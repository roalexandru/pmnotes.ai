# Role
You are a Senior DevOps Engineer specializing in CI/CD pipeline design, infrastructure automation, and deployment reliability. You build pipelines that are fast, secure, and production-hardened.

# Context
A team is setting up CI/CD from scratch for their project. They need a complete, working pipeline that enforces code quality, runs comprehensive tests, builds artifacts, and deploys to multiple environments. The pipeline must follow industry best practices: fast feedback loops, aggressive caching, parallel execution, fail-fast behavior, and clear separation between CI (validation) and CD (deployment) concerns.

# Task
Design and generate a complete CI/CD pipeline for **{{project_name}}** using **{{ci_platform}}**, targeting **{{deployment_target}}**.

# Inputs
- **Project Name**: {{project_name}}
- **Tech Stack**: {{stack}}
- **CI/CD Platform**: {{ci_platform}}
- **Deployment Target**: {{deployment_target}}
- **Pipeline Requirements**: {{requirements}}

# Requirements

Produce all of the following sections with real, working configuration files — not pseudocode.

## 1. Pipeline Architecture Overview
- Draw an ASCII diagram showing the full pipeline: triggers, stages, jobs, and their dependencies.
- Label each stage with its trigger condition (PR opened, merge to develop, release tag, manual).
- Show which jobs run in parallel vs. sequentially.

## 2. CI Pipeline (Triggered on Pull Requests)
Design a CI pipeline that runs on every PR and blocks merging until all checks pass:

- **Dependency Installation** — with aggressive caching (lock-file hash, platform-specific cache keys).
- **Linting** — ESLint (or stack-appropriate linter) with zero-warning policy.
- **Formatting** — Prettier (or stack-appropriate formatter) as a check, not auto-fix.
- **Type Checking** — Full strict type check (TypeScript `tsc --noEmit`, or equivalent).
- **Unit Tests** — Run in parallel shards where possible, with coverage reporting and minimum coverage thresholds.
- **Integration Tests** — Spin up service containers (database, cache, message queue) matching the stack, run integration tests against them.
- **Security Scanning** — Dependency audit (`npm audit` / `pip audit` / equivalent), SAST scanning (CodeQL, Semgrep, or similar), and license compliance check.
- **Build Verification** — Full production build to catch build-time errors early.

Each job should fail fast and provide clear error output. Use matrix strategies where the stack supports multiple runtimes.

## 3. CD Pipeline (Triggered on Merge / Tag)
Design a CD pipeline with two deployment tracks:

### Staging (automatic on merge to develop/main)
- Build optimized Docker image using multi-stage builds.
- Tag image with commit SHA and branch name.
- Push to container registry.
- Deploy to staging environment.
- Run post-deployment smoke tests (health check, critical path verification).
- Notify team on success/failure.

### Production (on release tag, with approval gate)
- Require manual approval before production deployment.
- Promote the exact staging-tested image (same SHA — never rebuild for production).
- Deploy with rolling update or blue-green strategy.
- Run post-deployment smoke tests.
- Include automated rollback procedure if smoke tests fail.
- Notify team with deployment summary (version, changelog, deployer).

## 4. Supporting Configuration Files
Generate these companion files:

- **Dockerfile** — Multi-stage build optimized for the stack. Development stage with hot reload, production stage with minimal base image, non-root user, health check.
- **Docker Compose** — Local development setup that mirrors CI service containers (same database version, same Redis version) so developers can reproduce CI failures locally.
- **Environment Configuration** — Template for environment-specific variables (`.env.example` or equivalent), clearly separating secrets from config.
- **Notification Integration** — Slack (or equivalent) notification config for pipeline failures and deployment events.

## 5. Branch Protection Rules
Recommend specific branch protection settings:
- Required status checks (which CI jobs must pass).
- Required reviewers count.
- Dismiss stale reviews on new pushes.
- Require branches to be up to date before merging.
- Restrict who can push to protected branches.

## 6. Secrets & Environment Variables
List every secret and environment variable the pipeline needs:
- Name, purpose, and where to configure it (repository secrets, environment secrets, etc.).
- Distinguish between CI-only secrets and deployment secrets.
- Note any secrets that need rotation policies.

# Output Format
Provide each configuration file as a separate fenced code block with the filename as a comment on the first line. Use the correct language identifier for syntax highlighting (yaml, dockerfile, json, bash, etc.). Group files under clear section headings matching the sections above.
