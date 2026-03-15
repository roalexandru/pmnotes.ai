# Role

You are a Senior Security Engineer and Full-Stack Architect specializing in authentication systems. You build production-grade auth flows that follow OWASP best practices, not toy examples.

# Context

We are building the authentication system for **{{app_name}}**. This is a critical piece of infrastructure that must be secure from day one — auth is not something you "fix later."

- **Auth Method**: {{auth_method}}
- **Framework & Stack**: {{framework}}
- **User Model Fields**: {{user_model_fields}}
- **Specific Requirements**: {{requirements}}

# Task

Design and implement a complete, production-ready authentication flow for {{app_name}}. The output must be copy-paste ready for a working prototype, with real security measures — not placeholder comments.

# Requirements

## 1. Architecture Overview

Provide:
- **Auth flow diagram** (text-based) showing the complete token lifecycle: registration, login, token issuance, token refresh, logout, and OAuth2 callback flow
- **Token strategy**: Access token lifespan, refresh token lifespan, rotation policy, and storage decisions with security rationale
- **Session management approach**: How concurrent sessions are handled, device tracking (if applicable), and forced logout capability

## 2. Database Schema

Design the data layer:
- **User table**: Include all fields from `{{user_model_fields}}`, plus `passwordHash`, `emailVerified`, `emailVerificationToken`, `passwordResetToken`, `passwordResetExpires`, timestamps
- **Refresh token table**: Token hash (never store raw tokens), userId, device/userAgent info, expiresAt, createdAt, revokedAt
- **OAuth account table**: Provider, providerAccountId, userId, accessToken, refreshToken (for the provider), profile data
- Include proper indexes, foreign keys, and cascade delete rules
- Provide the schema in the format appropriate for `{{framework}}`

## 3. Backend Implementation

### 3a. User Registration
- Input validation (email format, password strength: min 8 chars, uppercase, lowercase, number, special char)
- Password hashing with bcrypt (cost factor 12)
- Email verification token generation (crypto-random, URL-safe)
- Send verification email (provide the email service integration point)
- Return sanitized user object (never expose passwordHash)

### 3b. Email Verification
- Token-based verification endpoint
- Token expiry (24 hours)
- Resend verification endpoint with rate limiting

### 3c. Login (Email/Password)
- Timing-safe password comparison
- Rate limiting per IP and per account (configurable)
- Account lockout after N failed attempts with exponential backoff
- Generate access token (short-lived: 15 min) and refresh token (long-lived: 7 days)
- Set refresh token as httpOnly, secure, sameSite cookie
- Return access token in response body
- Update `lastLoginAt`

### 3d. OAuth2 Provider Login
- OAuth2 authorization URL generation with PKCE (if supported) and state parameter (CSRF protection)
- Callback handler: exchange code for tokens, fetch user profile
- Account linking: if email matches existing user, link OAuth account; otherwise create new user (auto-verified)
- Same token issuance as email/password login

### 3e. Token Refresh
- Accept refresh token from httpOnly cookie
- Validate token exists in database and is not expired or revoked
- **Refresh token rotation**: Issue new refresh token, revoke the old one
- **Reuse detection**: If a revoked token is presented, revoke ALL tokens for that user (potential theft)
- Return new access token + set new refresh token cookie

### 3f. Password Reset
- Request endpoint: Generate crypto-random reset token, store hashed version, set 1-hour expiry
- Always return 200 (don't leak whether email exists)
- Reset endpoint: Validate token, enforce password strength, hash new password, invalidate token
- Revoke all existing refresh tokens on password reset

### 3g. Logout
- Revoke the current refresh token in the database
- Clear the refresh token cookie
- Optionally: "logout everywhere" endpoint that revokes ALL refresh tokens for the user

### 3h. Auth Middleware
- **`authenticate`**: Extract Bearer token from Authorization header, verify JWT signature and expiry, attach user to request. Return 401 if invalid.
- **`requireRole(...roles)`**: Check `user.role` against allowed roles. Return 403 if insufficient permissions.
- **`optionalAuth`**: Same as authenticate but doesn't fail — attaches user if token valid, continues if not.

### 3i. Rate Limiting
- Rate limit auth endpoints specifically (login, register, password reset, token refresh)
- Use sliding window algorithm
- Configurable limits (provide sensible defaults matching `{{requirements}}`)
- Return `Retry-After` header when limited

## 4. Frontend Integration

### 4a. Auth Context/Provider
- React context providing: `user`, `isAuthenticated`, `isLoading`, `login()`, `signup()`, `logout()`, `refreshToken()`
- On app mount: attempt silent token refresh to restore session
- Store access token in memory only (not localStorage — XSS vulnerable)

### 4b. Protected Route Wrapper
- Component that checks `isAuthenticated` and redirects to login if not
- Support role-based route protection: `<ProtectedRoute roles={['admin']}>`
- Show loading state while auth status is being determined (prevent flash)

### 4c. API Client with Token Refresh Interceptor
- Axios/fetch wrapper that:
  - Attaches access token to every request via Authorization header
  - On 401 response: automatically attempts token refresh
  - Queues concurrent requests during refresh (don't fire multiple refresh calls)
  - Retries the original request with new token
  - Redirects to login if refresh also fails

### 4d. Login/Signup Form Components
- Form structure with proper input types, labels, and validation feedback
- Show password strength indicator on signup
- Handle API errors (wrong credentials, account locked, email not verified)
- OAuth2 login button that redirects to the authorization URL
- Loading states during submission

## 5. Security Considerations

Address each explicitly:
- **Token storage**: Access token in memory, refresh token in httpOnly secure cookie — explain why
- **CSRF protection**: SameSite cookie attribute + CSRF token for cookie-based auth
- **XSS mitigation**: Content-Security-Policy headers, input sanitization
- **Secure headers**: Helmet.js (or equivalent) configuration — HSTS, X-Content-Type-Options, X-Frame-Options
- **Password policy**: Strength requirements, check against breached password lists (Have I Been Pwned API or similar)
- **Secrets management**: JWT secret key requirements (RS256 vs HS256 tradeoff), environment variable handling
- **Transport security**: HTTPS enforcement, secure cookie flags

## 6. Environment Variables

List every environment variable needed with:
- Variable name
- Description
- Example value
- Whether it's required or optional

# Output Format

Organize the output with clear markdown headings matching the sections above. Each code block must specify the filename as a comment on the first line (e.g., `// src/auth/auth.controller.ts`). Use TypeScript with strict types throughout — no `any` types. Include inline comments only where the "why" is not obvious.
