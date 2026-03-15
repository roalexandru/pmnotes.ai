# Authentication Flow for TaskFlow

## 1. Architecture Overview

### Auth Flow Diagram

```
REGISTRATION FLOW
=================
Client                    Server                      Database              Email Service
  |                         |                            |                       |
  |-- POST /auth/register ->|                            |                       |
  |                         |-- validate input           |                       |
  |                         |-- hash password (bcrypt) ->|                       |
  |                         |-- INSERT user ------------>|                       |
  |                         |-- generate verify token -->|                       |
  |                         |-- send verification -------|---------------------> |
  |<-- 201 { user } --------|                            |                       |


LOGIN FLOW (Email/Password)
============================
Client                    Server                      Database
  |                         |                            |
  |-- POST /auth/login ---->|                            |
  |                         |-- check rate limit         |
  |                         |-- SELECT user ------------>|
  |                         |-- bcrypt.compare           |
  |                         |-- generate access JWT      |
  |                         |-- generate refresh token ->|
  |                         |-- INSERT refresh token --->|
  |<-- 200 { accessToken }--|                            |
  |<-- Set-Cookie: refresh  |                            |


TOKEN REFRESH FLOW (Rotation)
==============================
Client                    Server                      Database
  |                         |                            |
  |-- POST /auth/refresh -->|                            |
  |   (cookie: refresh)     |-- hash token               |
  |                         |-- SELECT refresh token --->|
  |                         |-- check: revoked? -------->|
  |                         |   if revoked: REVOKE ALL   |
  |                         |   (theft detected!)        |
  |                         |-- REVOKE old token ------->|
  |                         |-- INSERT new token ------->|
  |                         |-- generate new access JWT  |
  |<-- 200 { accessToken }--|                            |
  |<-- Set-Cookie: refresh  |                            |


OAUTH2 FLOW (Google)
=====================
Client              Server                Google              Database
  |                   |                     |                    |
  |-- GET /auth/google|                     |                    |
  |<-- 302 redirect --|                     |                    |
  |-- redirect -------|-------------------->|                    |
  |                   |                     |-- user consents    |
  |<-- callback ------|<-- code + state ----|                    |
  |                   |-- exchange code --->|                    |
  |                   |<-- tokens + profile-|                    |
  |                   |-- find/create user ---------------->|   |
  |                   |-- link oauth account -------------->|   |
  |                   |-- issue JWT + refresh                |   |
  |<-- 200 + cookie --|                                      |   |
```

### Token Strategy

| Property | Access Token | Refresh Token |
|----------|-------------|---------------|
| Lifespan | 15 minutes | 7 days |
| Storage (client) | In-memory variable | httpOnly secure cookie |
| Storage (server) | Stateless (JWT) | SHA-256 hash in database |
| Rotation | New on each refresh | Rotated on each use |
| Algorithm | HS256 (symmetric) | crypto.randomBytes(64) |

**Why httpOnly cookie for refresh tokens:** Cannot be accessed by JavaScript, protecting against XSS attacks. Even if an attacker injects a script, they cannot steal the refresh token.

**Why in-memory for access tokens:** Short-lived and needed for API calls. localStorage is vulnerable to XSS. Memory is cleared on tab close, which is acceptable given the short lifespan and auto-refresh capability.

### Session Management
- Each device/session gets its own refresh token
- Users can have multiple concurrent sessions
- "Logout everywhere" revokes all refresh tokens for the user
- Password reset automatically revokes all sessions

---

## 2. Database Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  ADMIN
  MEMBER
  VIEWER
}

model User {
  id                     String         @id @default(cuid())
  email                  String         @unique
  name                   String
  avatarUrl              String?
  role                   Role           @default(MEMBER)
  organizationId         String?
  passwordHash           String?        // null for OAuth-only users
  emailVerified          Boolean        @default(false)
  emailVerificationToken String?        @unique
  emailVerificationExpires DateTime?
  passwordResetToken     String?        @unique // stored as SHA-256 hash
  passwordResetExpires   DateTime?
  lastLoginAt            DateTime?
  failedLoginAttempts    Int            @default(0)
  lockedUntil            DateTime?
  createdAt              DateTime       @default(now())
  updatedAt              DateTime       @updatedAt

  refreshTokens          RefreshToken[]
  oauthAccounts          OAuthAccount[]

  @@index([email])
  @@index([organizationId])
}

model RefreshToken {
  id         String    @id @default(cuid())
  tokenHash  String    @unique  // SHA-256 hash of the raw token
  userId     String
  userAgent  String?
  ipAddress  String?
  expiresAt  DateTime
  createdAt  DateTime  @default(now())
  revokedAt  DateTime?

  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([tokenHash])
  @@index([expiresAt])
}

model OAuthAccount {
  id                String   @id @default(cuid())
  provider          String   // "google", "github", etc.
  providerAccountId String
  userId            String
  accessToken       String?  // provider's access token (encrypted at rest)
  refreshToken      String?  // provider's refresh token (encrypted at rest)
  profileData       Json?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
}
```

---

## 3. Backend Implementation

### 3a. Shared Types and Utilities

```typescript
// src/types/auth.types.ts

import { Role } from "@prisma/client";

export interface JwtPayload {
  sub: string;       // user ID
  email: string;
  role: Role;
  iat: number;
  exp: number;
}

export interface RegisterInput {
  email: string;
  name: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
}

export interface AuthResponse {
  accessToken: string;
  user: SanitizedUser;
}

export interface SanitizedUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: Role;
  organizationId: string | null;
  emailVerified: boolean;
}
```

```typescript
// src/lib/auth.utils.ts

import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { User } from "@prisma/client";
import type { JwtPayload, SanitizedUser } from "../types/auth.types";

const JWT_SECRET = process.env.JWT_SECRET!;
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY_DAYS = 7;
const BCRYPT_ROUNDS = 12;

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateAccessToken(user: User): string {
  const payload: Omit<JwtPayload, "iat" | "exp"> = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export function generateRefreshToken(): string {
  return crypto.randomBytes(64).toString("base64url");
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString("base64url");
}

export function getRefreshTokenExpiry(): Date {
  return new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
}

export function sanitizeUser(user: User): SanitizedUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    role: user.role,
    organizationId: user.organizationId,
    emailVerified: user.emailVerified,
  };
}

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

export function validatePasswordStrength(password: string): { valid: boolean; message: string } {
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters" };
  }
  if (!PASSWORD_REGEX.test(password)) {
    return {
      valid: false,
      message: "Password must include uppercase, lowercase, number, and special character",
    };
  }
  return { valid: true, message: "" };
}
```

### 3b. Rate Limiter

```typescript
// src/middleware/rate-limiter.ts

import { Request, Response, NextFunction } from "express";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In production, replace with Redis-backed store
const store = new Map<string, RateLimitEntry>();

interface RateLimitOptions {
  windowMs: number;
  maxAttempts: number;
  keyGenerator?: (req: Request) => string;
}

export function rateLimiter(options: RateLimitOptions) {
  const { windowMs, maxAttempts, keyGenerator } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = keyGenerator ? keyGenerator(req) : req.ip ?? "unknown";
    const now = Date.now();
    const entry = store.get(key);

    if (!entry || now > entry.resetAt) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (entry.count >= maxAttempts) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      res.set("Retry-After", String(retryAfter));
      res.status(429).json({
        error: "Too many requests",
        retryAfter,
      });
      return;
    }

    entry.count++;
    next();
  };
}

// Pre-configured limiters for auth routes
export const loginLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxAttempts: 5,
  keyGenerator: (req) => `login:${req.ip}:${req.body?.email ?? "unknown"}`,
});

export const registerLimiter = rateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxAttempts: 3,
  keyGenerator: (req) => `register:${req.ip}`,
});

export const passwordResetLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  maxAttempts: 3,
  keyGenerator: (req) => `reset:${req.ip}`,
});
```

### 3c. Auth Middleware

```typescript
// src/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import { verifyAccessToken } from "../lib/auth.utils";
import type { JwtPayload } from "../types/auth.types";

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid authorization header" });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired access token" });
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    try {
      req.user = verifyAccessToken(authHeader.slice(7));
    } catch {
      // Token invalid — proceed without user
    }
  }

  next();
}

export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: "Insufficient permissions" });
      return;
    }

    next();
  };
}
```

### 3d. Auth Controller

```typescript
// src/controllers/auth.controller.ts

import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  generateVerificationToken,
  getRefreshTokenExpiry,
  sanitizeUser,
  validatePasswordStrength,
} from "../lib/auth.utils";
import { sendVerificationEmail, sendPasswordResetEmail } from "../lib/email";
import type { RegisterInput, LoginInput, ResetPasswordInput } from "../types/auth.types";

const REFRESH_TOKEN_COOKIE = "taskflow_refresh";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

function setRefreshTokenCookie(res: Response, token: string): void {
  res.cookie(REFRESH_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: "strict",
    path: "/api/auth",     // Only sent to auth endpoints
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

function clearRefreshTokenCookie(res: Response): void {
  res.clearCookie(REFRESH_TOKEN_COOKIE, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: "strict",
    path: "/api/auth",
  });
}

// ─── REGISTER ──────────────────────────────────────────────

export async function register(req: Request, res: Response): Promise<void> {
  const { email, name, password } = req.body as RegisterInput;

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: "Invalid email format" });
    return;
  }

  // Validate password strength
  const passwordCheck = validatePasswordStrength(password);
  if (!passwordCheck.valid) {
    res.status(400).json({ error: passwordCheck.message });
    return;
  }

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    // Don't reveal that the email exists — just return a generic message
    // But still return 409 so the client can handle it
    res.status(409).json({ error: "Unable to create account with this email" });
    return;
  }

  const passwordHash = await hashPassword(password);
  const verificationToken = generateVerificationToken();

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      emailVerificationToken: hashToken(verificationToken),
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
  });

  // Send verification email with the raw token (not the hash)
  await sendVerificationEmail(email, name, verificationToken);

  res.status(201).json({ user: sanitizeUser(user) });
}

// ─── VERIFY EMAIL ──────────────────────────────────────────

export async function verifyEmail(req: Request, res: Response): Promise<void> {
  const { token } = req.params;
  const tokenHash = hashToken(token);

  const user = await prisma.user.findFirst({
    where: {
      emailVerificationToken: tokenHash,
      emailVerificationExpires: { gt: new Date() },
    },
  });

  if (!user) {
    res.status(400).json({ error: "Invalid or expired verification token" });
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
    },
  });

  res.json({ message: "Email verified successfully" });
}

// ─── RESEND VERIFICATION ──────────────────────────────────

export async function resendVerification(req: Request, res: Response): Promise<void> {
  const { email } = req.body as { email: string };

  // Always return 200 to prevent email enumeration
  const user = await prisma.user.findUnique({ where: { email } });

  if (user && !user.emailVerified) {
    const verificationToken = generateVerificationToken();

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: hashToken(verificationToken),
        emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    await sendVerificationEmail(email, user.name, verificationToken);
  }

  res.json({ message: "If that email is registered and unverified, a verification email has been sent" });
}

// ─── LOGIN ─────────────────────────────────────────────────

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as LoginInput;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.passwordHash) {
    // Timing-safe: still run bcrypt compare against a dummy hash to prevent
    // timing attacks that reveal whether an account exists
    await comparePassword(password, "$2b$12$dummyhashfortimingnormalization000000000000000");
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  // Check account lockout
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const retryAfter = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 1000);
    res.status(423).json({
      error: "Account temporarily locked due to too many failed attempts",
      retryAfter,
    });
    return;
  }

  // Check email verification
  if (!user.emailVerified) {
    res.status(403).json({ error: "Please verify your email before logging in" });
    return;
  }

  const isValidPassword = await comparePassword(password, user.passwordHash);

  if (!isValidPassword) {
    // Increment failed attempts, lock after 5 failures
    const failedAttempts = user.failedLoginAttempts + 1;
    const lockoutData: { failedLoginAttempts: number; lockedUntil?: Date } = {
      failedLoginAttempts: failedAttempts,
    };

    if (failedAttempts >= 5) {
      // Exponential backoff: 15min, 30min, 1hr, 2hr...
      const lockoutMinutes = 15 * Math.pow(2, Math.floor((failedAttempts - 5) / 5));
      lockoutData.lockedUntil = new Date(Date.now() + lockoutMinutes * 60 * 1000);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: lockoutData,
    });

    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  // Reset failed attempts on successful login
  await prisma.user.update({
    where: { id: user.id },
    data: {
      failedLoginAttempts: 0,
      lockedUntil: null,
      lastLoginAt: new Date(),
    },
  });

  // Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();

  await prisma.refreshToken.create({
    data: {
      tokenHash: hashToken(refreshToken),
      userId: user.id,
      userAgent: req.headers["user-agent"] ?? null,
      ipAddress: req.ip ?? null,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  setRefreshTokenCookie(res, refreshToken);

  res.json({
    accessToken,
    user: sanitizeUser(user),
  });
}

// ─── REFRESH TOKEN ─────────────────────────────────────────

export async function refresh(req: Request, res: Response): Promise<void> {
  const rawToken = req.cookies?.[REFRESH_TOKEN_COOKIE];

  if (!rawToken) {
    res.status(401).json({ error: "No refresh token provided" });
    return;
  }

  const tokenHash = hashToken(rawToken);

  const storedToken = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!storedToken) {
    res.status(401).json({ error: "Invalid refresh token" });
    return;
  }

  // REUSE DETECTION: If token was already revoked, this is a potential theft.
  // Revoke ALL tokens for this user as a safety measure.
  if (storedToken.revokedAt) {
    await prisma.refreshToken.updateMany({
      where: { userId: storedToken.userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    clearRefreshTokenCookie(res);
    res.status(401).json({ error: "Token reuse detected — all sessions revoked" });
    return;
  }

  // Check expiry
  if (storedToken.expiresAt < new Date()) {
    res.status(401).json({ error: "Refresh token expired" });
    return;
  }

  // Rotate: revoke old token, issue new one
  const newRefreshToken = generateRefreshToken();

  await prisma.$transaction([
    prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    }),
    prisma.refreshToken.create({
      data: {
        tokenHash: hashToken(newRefreshToken),
        userId: storedToken.userId,
        userAgent: req.headers["user-agent"] ?? null,
        ipAddress: req.ip ?? null,
        expiresAt: getRefreshTokenExpiry(),
      },
    }),
  ]);

  const accessToken = generateAccessToken(storedToken.user);
  setRefreshTokenCookie(res, newRefreshToken);

  res.json({ accessToken });
}

// ─── PASSWORD RESET REQUEST ────────────────────────────────

export async function requestPasswordReset(req: Request, res: Response): Promise<void> {
  const { email } = req.body as { email: string };

  // Always return 200 — never reveal whether the email exists
  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    const resetToken = generateVerificationToken();

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: hashToken(resetToken),
        passwordResetExpires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    await sendPasswordResetEmail(email, user.name, resetToken);
  }

  res.json({ message: "If that email is registered, a password reset link has been sent" });
}

// ─── PASSWORD RESET ────────────────────────────────────────

export async function resetPassword(req: Request, res: Response): Promise<void> {
  const { token, newPassword } = req.body as ResetPasswordInput;

  const passwordCheck = validatePasswordStrength(newPassword);
  if (!passwordCheck.valid) {
    res.status(400).json({ error: passwordCheck.message });
    return;
  }

  const tokenHash = hashToken(token);

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: tokenHash,
      passwordResetExpires: { gt: new Date() },
    },
  });

  if (!user) {
    res.status(400).json({ error: "Invalid or expired reset token" });
    return;
  }

  const newPasswordHash = await hashPassword(newPassword);

  await prisma.$transaction([
    // Update password and clear reset token
    prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newPasswordHash,
        passwordResetToken: null,
        passwordResetExpires: null,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    }),
    // Revoke ALL refresh tokens (force re-login everywhere)
    prisma.refreshToken.updateMany({
      where: { userId: user.id, revokedAt: null },
      data: { revokedAt: new Date() },
    }),
  ]);

  res.json({ message: "Password reset successfully. Please log in with your new password." });
}

// ─── LOGOUT ────────────────────────────────────────────────

export async function logout(req: Request, res: Response): Promise<void> {
  const rawToken = req.cookies?.[REFRESH_TOKEN_COOKIE];

  if (rawToken) {
    const tokenHash = hashToken(rawToken);
    await prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  clearRefreshTokenCookie(res);
  res.json({ message: "Logged out successfully" });
}

// ─── LOGOUT EVERYWHERE ────────────────────────────────────

export async function logoutAll(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  await prisma.refreshToken.updateMany({
    where: { userId: req.user.sub, revokedAt: null },
    data: { revokedAt: new Date() },
  });

  clearRefreshTokenCookie(res);
  res.json({ message: "All sessions revoked" });
}
```

### 3e. OAuth2 (Google) Controller

```typescript
// src/controllers/oauth.controller.ts

import { Request, Response } from "express";
import crypto from "crypto";
import { prisma } from "../lib/prisma";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  getRefreshTokenExpiry,
  sanitizeUser,
} from "../lib/auth.utils";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;
const FRONTEND_URL = process.env.FRONTEND_URL!;
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const REFRESH_TOKEN_COOKIE = "taskflow_refresh";

// In-memory state store (use Redis in production)
const oauthStateStore = new Map<string, { expiresAt: number }>();

export async function googleAuthRedirect(_req: Request, res: Response): Promise<void> {
  const state = crypto.randomBytes(32).toString("base64url");
  oauthStateStore.set(state, { expiresAt: Date.now() + 10 * 60 * 1000 }); // 10 min expiry

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "offline",
    prompt: "consent",
  });

  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
}

export async function googleAuthCallback(req: Request, res: Response): Promise<void> {
  const { code, state } = req.query as { code?: string; state?: string };

  // Validate state parameter (CSRF protection)
  if (!state || !oauthStateStore.has(state)) {
    res.redirect(`${FRONTEND_URL}/login?error=invalid_state`);
    return;
  }

  const storedState = oauthStateStore.get(state)!;
  oauthStateStore.delete(state);

  if (storedState.expiresAt < Date.now()) {
    res.redirect(`${FRONTEND_URL}/login?error=state_expired`);
    return;
  }

  if (!code) {
    res.redirect(`${FRONTEND_URL}/login?error=no_code`);
    return;
  }

  // Exchange code for tokens
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenResponse.ok) {
    res.redirect(`${FRONTEND_URL}/login?error=token_exchange_failed`);
    return;
  }

  const tokens = (await tokenResponse.json()) as {
    access_token: string;
    refresh_token?: string;
    id_token: string;
  };

  // Fetch user profile from Google
  const profileResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  const profile = (await profileResponse.json()) as {
    id: string;
    email: string;
    name: string;
    picture: string;
  };

  // Find or create user + link OAuth account
  let user = await prisma.user.findUnique({ where: { email: profile.email } });

  if (!user) {
    // Create new user (auto-verified since OAuth provider verified the email)
    user = await prisma.user.create({
      data: {
        email: profile.email,
        name: profile.name,
        avatarUrl: profile.picture,
        emailVerified: true,
        lastLoginAt: new Date(),
      },
    });
  } else {
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });
  }

  // Upsert OAuth account link
  await prisma.oAuthAccount.upsert({
    where: {
      provider_providerAccountId: {
        provider: "google",
        providerAccountId: profile.id,
      },
    },
    update: {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token ?? undefined,
      profileData: profile,
    },
    create: {
      provider: "google",
      providerAccountId: profile.id,
      userId: user.id,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token ?? null,
      profileData: profile,
    },
  });

  // Issue TaskFlow tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();

  await prisma.refreshToken.create({
    data: {
      tokenHash: hashToken(refreshToken),
      userId: user.id,
      userAgent: req.headers["user-agent"] ?? null,
      ipAddress: req.ip ?? null,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: "strict",
    path: "/api/auth",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // Redirect to frontend with access token in URL fragment (not query param)
  // Fragment is not sent to server, reducing log exposure
  res.redirect(`${FRONTEND_URL}/auth/callback#access_token=${accessToken}`);
}
```

### 3f. Auth Routes

```typescript
// src/routes/auth.routes.ts

import { Router } from "express";
import cookieParser from "cookie-parser";
import {
  register,
  verifyEmail,
  resendVerification,
  login,
  refresh,
  requestPasswordReset,
  resetPassword,
  logout,
  logoutAll,
} from "../controllers/auth.controller";
import { googleAuthRedirect, googleAuthCallback } from "../controllers/oauth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { loginLimiter, registerLimiter, passwordResetLimiter } from "../middleware/rate-limiter";

const router = Router();
router.use(cookieParser());

// Registration & verification
router.post("/register", registerLimiter, register);
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", passwordResetLimiter, resendVerification);

// Login
router.post("/login", loginLimiter, login);

// Token refresh
router.post("/refresh", refresh);

// Password reset
router.post("/forgot-password", passwordResetLimiter, requestPasswordReset);
router.post("/reset-password", resetPassword);

// Logout
router.post("/logout", logout);
router.post("/logout-all", authenticate, logoutAll);

// OAuth2 — Google
router.get("/google", googleAuthRedirect);
router.get("/google/callback", googleAuthCallback);

export { router as authRouter };
```

### 3g. Server Setup with Security Headers

```typescript
// src/server.ts

import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.routes";
import { authenticate, requireRole } from "./middleware/auth.middleware";

const app = express();
const PORT = process.env.PORT ?? 3000;
const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://*.googleusercontent.com"],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
}));

// CORS — only allow the frontend origin
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true, // Required for cookies
}));

app.use(express.json({ limit: "10kb" })); // Limit body size
app.use(cookieParser());

// Auth routes (public)
app.use("/api/auth", authRouter);

// Example protected routes
app.get("/api/me", authenticate, (req, res) => {
  res.json({ user: req.user });
});

app.get("/api/admin/users", authenticate, requireRole("ADMIN"), async (_req, res) => {
  // Admin-only endpoint example
  res.json({ message: "Admin access granted" });
});

app.listen(PORT, () => {
  console.log(`TaskFlow server running on port ${PORT}`);
});
```

### 3h. Email Service Integration Point

```typescript
// src/lib/email.ts

// Replace with your email provider (SendGrid, Resend, AWS SES, etc.)
// This module provides the integration point — swap the implementation.

const APP_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";

export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string
): Promise<void> {
  const verifyUrl = `${APP_URL}/verify-email?token=${token}`;

  // TODO: Replace with your email provider
  console.log(`[Email] Sending verification to ${email}`);
  console.log(`[Email] Verify URL: ${verifyUrl}`);

  // Example with Resend:
  // await resend.emails.send({
  //   from: "TaskFlow <noreply@taskflow.app>",
  //   to: email,
  //   subject: "Verify your TaskFlow email",
  //   html: `
  //     <h1>Welcome to TaskFlow, ${name}!</h1>
  //     <p>Click the link below to verify your email:</p>
  //     <a href="${verifyUrl}">Verify Email</a>
  //     <p>This link expires in 24 hours.</p>
  //   `,
  // });
}

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  token: string
): Promise<void> {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;

  console.log(`[Email] Sending password reset to ${email}`);
  console.log(`[Email] Reset URL: ${resetUrl}`);

  // Example with Resend:
  // await resend.emails.send({
  //   from: "TaskFlow <noreply@taskflow.app>",
  //   to: email,
  //   subject: "Reset your TaskFlow password",
  //   html: `
  //     <h1>Password Reset</h1>
  //     <p>Hi ${name}, we received a request to reset your password.</p>
  //     <a href="${resetUrl}">Reset Password</a>
  //     <p>This link expires in 1 hour. If you didn't request this, ignore this email.</p>
  //   `,
  // });
}
```

---

## 4. Frontend Integration

### 4a. Auth Context Provider

```typescript
// src/contexts/AuthContext.tsx

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: "ADMIN" | "MEMBER" | "VIEWER";
  organizationId: string | null;
  emailVerified: boolean;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

// Store access token in memory only — never localStorage
let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Attempt silent refresh on mount to restore session
  useEffect(() => {
    async function restoreSession() {
      try {
        const res = await fetch(`${API_BASE}/auth/refresh`, {
          method: "POST",
          credentials: "include", // Send cookies
        });

        if (res.ok) {
          const data = (await res.json()) as { accessToken: string };
          accessToken = data.accessToken;

          // Fetch user profile with the new token
          const meRes = await fetch(`${API_BASE}/me`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          if (meRes.ok) {
            const meData = (await meRes.json()) as { user: User };
            setUser(meData.user);
          }
        }
      } catch {
        // No valid session — user stays logged out
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const error = (await res.json()) as { error: string; retryAfter?: number };
      throw new Error(error.error);
    }

    const data = (await res.json()) as { accessToken: string; user: User };
    accessToken = data.accessToken;
    setUser(data.user);
  }, []);

  const signup = useCallback(async (email: string, name: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, password }),
    });

    if (!res.ok) {
      const error = (await res.json()) as { error: string };
      throw new Error(error.error);
    }

    // Don't auto-login — user needs to verify email first
  }, []);

  const logout = useCallback(async () => {
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    accessToken = null;
    setUser(null);
  }, []);

  const logoutAll = useCallback(async () => {
    await fetch(`${API_BASE}/auth/logout-all`, {
      method: "POST",
      credentials: "include",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    accessToken = null;
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      login,
      signup,
      logout,
      logoutAll,
    }),
    [user, isLoading, login, signup, logout, logoutAll]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
```

### 4b. API Client with Token Refresh Interceptor

```typescript
// src/lib/api-client.ts

import { getAccessToken } from "../contexts/AuthContext";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) return null;

  const data = (await res.json()) as { accessToken: string };
  return data.accessToken;
}

export async function apiClient<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken();

  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  headers.set("Content-Type", "application/json");

  let res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  // If 401, attempt token refresh (only once)
  if (res.status === 401 && token) {
    // Deduplicate concurrent refresh calls
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshAccessToken();
    }

    const newToken = await refreshPromise;
    isRefreshing = false;
    refreshPromise = null;

    if (newToken) {
      // Retry original request with new token
      headers.set("Authorization", `Bearer ${newToken}`);
      res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
        credentials: "include",
      });
    } else {
      // Refresh failed — redirect to login
      window.location.href = "/login";
      throw new Error("Session expired");
    }
  }

  if (!res.ok) {
    const error = (await res.json()) as { error: string };
    throw new Error(error.error);
  }

  return res.json() as Promise<T>;
}
```

### 4c. Protected Route Wrapper

```tsx
// src/components/ProtectedRoute.tsx

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: Array<"ADMIN" | "MEMBER" | "VIEWER">;
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
```

### 4d. Login/Signup Form Components

```tsx
// src/components/LoginForm.tsx

import { useState, type FormEvent } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-2xl font-bold">Sign in to TaskFlow</h1>

      {error && (
        <div className="mb-4 rounded border border-red-400 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-between">
          <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <hr className="flex-1 border-gray-300" />
        <span className="text-sm text-gray-500">or</span>
        <hr className="flex-1 border-gray-300" />
      </div>

      <a
        href={`${API_BASE}/auth/google`}
        className="flex w-full items-center justify-center gap-2 rounded border border-gray-300 px-4 py-2 font-medium hover:bg-gray-50"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </a>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link to="/signup" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
```

```tsx
// src/components/SignupForm.tsx

import { useState, type FormEvent } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;

  if (score <= 1) return { score, label: "Weak", color: "bg-red-500" };
  if (score <= 2) return { score, label: "Fair", color: "bg-orange-500" };
  if (score <= 3) return { score, label: "Good", color: "bg-yellow-500" };
  if (score <= 4) return { score, label: "Strong", color: "bg-green-500" };
  return { score, label: "Very Strong", color: "bg-green-600" };
}

export function SignupForm() {
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const strength = getPasswordStrength(password);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await signup(email, name, password);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="mx-auto max-w-md text-center">
        <h1 className="mb-4 text-2xl font-bold">Check your email</h1>
        <p className="text-gray-600">
          We've sent a verification link to <strong>{email}</strong>. Click the link to activate
          your account.
        </p>
        <Link to="/login" className="mt-6 inline-block text-blue-600 hover:underline">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-2xl font-bold">Create your TaskFlow account</h1>

      {error && (
        <div className="mb-4 rounded border border-red-400 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="Jane Smith"
          />
        </div>

        <div>
          <label htmlFor="signup-email" className="mb-1 block text-sm font-medium">
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="signup-password" className="mb-1 block text-sm font-medium">
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="Min 8 chars, mixed case, number, symbol"
          />
          {password.length > 0 && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-1.5 flex-1 rounded-full ${
                      level <= strength.score ? strength.color : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-1 text-xs text-gray-500">{strength.label}</p>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
```

---

## 5. Security Considerations

| Concern | Approach |
|---------|----------|
| **Token storage** | Access token in JavaScript memory variable (cleared on tab close). Refresh token in `httpOnly`, `secure`, `sameSite: strict` cookie. Never use localStorage for tokens — any XSS vulnerability would expose them. |
| **CSRF protection** | `sameSite: strict` on refresh token cookie prevents cross-site request forgery. The cookie is only sent on same-origin requests. For additional safety, the cookie path is restricted to `/api/auth`. |
| **XSS mitigation** | Helmet.js sets `Content-Security-Policy` to restrict script sources. React escapes output by default. Never use `dangerouslySetInnerHTML` with user content. |
| **Secure headers** | Helmet.js configured with: HSTS (1 year, includeSubDomains, preload), `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, CSP. |
| **Password security** | Bcrypt with cost factor 12 (~250ms per hash). Minimum 8 chars with uppercase, lowercase, number, and special character required. Consider integrating Have I Been Pwned API for breached password checks. |
| **Timing attacks** | Login always runs bcrypt.compare even when user doesn't exist to prevent timing-based account enumeration. Password reset always returns 200. |
| **Token rotation** | Refresh tokens are single-use. Reuse of a revoked token triggers revocation of ALL tokens for that user (theft detection). |
| **Transport** | HTTPS enforced in production via HSTS. Cookies set with `secure: true` in production. |
| **Rate limiting** | Auth endpoints have specific rate limits: login (5/15min per IP+email), register (3/hr per IP), password reset (3/15min per IP). Returns `Retry-After` header. |

---

## 6. Environment Variables

```bash
# .env

# ─── Required ────────────────────────────────────────────────
DATABASE_URL="postgresql://user:password@localhost:5432/taskflow"
JWT_SECRET="your-256-bit-secret-minimum-32-characters-long-replace-me"
GOOGLE_CLIENT_ID="123456789-abcdef.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-your-google-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google/callback"
FRONTEND_URL="http://localhost:5173"

# ─── Optional ────────────────────────────────────────────────
PORT=3000                          # Server port (default: 3000)
NODE_ENV="development"             # "development" | "production"
BCRYPT_ROUNDS=12                   # Password hashing cost (default: 12)
ACCESS_TOKEN_EXPIRY="15m"          # JWT access token lifespan (default: 15m)
REFRESH_TOKEN_EXPIRY_DAYS=7        # Refresh token lifespan in days (default: 7)
RATE_LIMIT_LOGIN_MAX=5             # Max login attempts per window (default: 5)
RATE_LIMIT_LOGIN_WINDOW_MS=900000  # Login rate limit window in ms (default: 15min)

# ─── Email Provider (pick one) ───────────────────────────────
RESEND_API_KEY="re_your_resend_api_key"
# or
SENDGRID_API_KEY="SG.your_sendgrid_api_key"

# ─── Production Only ─────────────────────────────────────────
# JWT_SECRET should be generated with: openssl rand -base64 64
# GOOGLE_REDIRECT_URI should point to production domain
# FRONTEND_URL should point to production domain
```
