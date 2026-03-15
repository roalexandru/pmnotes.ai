# Pipeline Architecture Overview

```
                         ┌─────────────────────────────────────────────────────────────┐
                         │                    InvoiceAPI CI/CD Pipeline                 │
                         └─────────────────────────────────────────────────────────────┘

  ┌──────────────┐       ┌──────────────────────────────────────────────────────────┐
  │ PR Opened /  │──────▶│                    CI Pipeline                           │
  │ PR Updated   │       │                                                          │
  └──────────────┘       │  ┌─────────┐   ┌──────────────────────────────────────┐  │
                         │  │ Install │──▶│         Parallel Jobs                 │  │
                         │  │  Deps   │   │                                      │  │
                         │  └─────────┘   │  ┌───────┐ ┌────────┐ ┌───────────┐ │  │
                         │                │  │ Lint  │ │  Type  │ │ Security  │ │  │
                         │                │  │ + Fmt │ │ Check  │ │   Scan    │ │  │
                         │                │  └───┬───┘ └───┬────┘ └─────┬─────┘ │  │
                         │                │      │         │            │        │  │
                         │                │  ┌───┴─────────┴────────────┴─────┐  │  │
                         │                │  │        Unit Tests (3 shards)   │  │  │
                         │                │  └──────────────┬─────────────────┘  │  │
                         │                │                 │                    │  │
                         │                │  ┌──────────────┴─────────────────┐  │  │
                         │                │  │      Integration Tests         │  │  │
                         │                │  │   (Postgres + Redis services)  │  │  │
                         │                │  └──────────────┬─────────────────┘  │  │
                         │                │                 │                    │  │
                         │                │  ┌──────────────┴─────────────────┐  │  │
                         │                │  │       Build Verification       │  │  │
                         │                │  └───────────────────────────────-┘  │  │
                         │                └──────────────────────────────────────┘  │
                         └──────────────────────────────────────────────────────────┘

  ┌──────────────┐       ┌──────────────────────────────────────────────────────────┐
  │  Merge to    │──────▶│               CD Pipeline — Staging                     │
  │  develop     │       │                                                          │
  └──────────────┘       │  Build Image ──▶ Push to ECR ──▶ Deploy ECS ──▶ Smoke   │
                         │                                    Tests ──▶ Notify      │
                         └──────────────────────────────────────────────────────────┘

  ┌──────────────┐       ┌──────────────────────────────────────────────────────────┐
  │ Release Tag  │──────▶│              CD Pipeline — Production                    │
  │  (v*.*.*)    │       │                                                          │
  └──────────────┘       │  Approval Gate ──▶ Promote Image ──▶ Deploy ECS ──▶     │
                         │  Smoke Tests ──▶ Notify (or Rollback on failure)         │
                         └──────────────────────────────────────────────────────────┘
```

---

# CI Pipeline

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [develop, main]
  push:
    branches: [develop]

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

env:
  NODE_VERSION: "20"
  PNPM_VERSION: "9"

jobs:
  install:
    name: Install Dependencies
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: ${{ env.PNPM_VERSION }}

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Cache node_modules
        uses: actions/cache/save@v4
        with:
          path: |
            node_modules
            apps/*/node_modules
            packages/*/node_modules
          key: modules-${{ runner.os }}-${{ hashFiles('pnpm-lock.yaml') }}

  lint:
    name: Lint & Format
    needs: install
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: ${{ env.PNPM_VERSION }}

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Restore node_modules
        uses: actions/cache/restore@v4
        with:
          path: |
            node_modules
            apps/*/node_modules
            packages/*/node_modules
          key: modules-${{ runner.os }}-${{ hashFiles('pnpm-lock.yaml') }}

      - name: ESLint
        run: pnpm lint

      - name: Prettier check
        run: pnpm format:check

  typecheck:
    name: Type Check
    needs: install
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: ${{ env.PNPM_VERSION }}

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Restore node_modules
        uses: actions/cache/restore@v4
        with:
          path: |
            node_modules
            apps/*/node_modules
            packages/*/node_modules
          key: modules-${{ runner.os }}-${{ hashFiles('pnpm-lock.yaml') }}

      - name: TypeScript type check
        run: pnpm typecheck

  security:
    name: Security Scan
    needs: install
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: ${{ env.PNPM_VERSION }}

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Restore node_modules
        uses: actions/cache/restore@v4
        with:
          path: |
            node_modules
            apps/*/node_modules
            packages/*/node_modules
          key: modules-${{ runner.os }}-${{ hashFiles('pnpm-lock.yaml') }}

      - name: Dependency audit
        run: pnpm audit --audit-level=high
        continue-on-error: false

      - name: License compliance
        run: npx license-checker --onlyAllow "MIT;Apache-2.0;BSD-2-Clause;BSD-3-Clause;ISC;0BSD"

      - name: Initialize CodeQL
        uses: github/codeql-action/init@v3
        with:
          languages: javascript-typescript

      - name: Run CodeQL analysis
        uses: github/codeql-action/analyze@v3

  unit-tests:
    name: Unit Tests (shard ${{ matrix.shard }}/${{ strategy.job-total }})
    needs: [lint, typecheck]
    runs-on: ubuntu-latest
    strategy:
      fail-fast: true
      matrix:
        shard: [1, 2, 3]
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: ${{ env.PNPM_VERSION }}

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Restore node_modules
        uses: actions/cache/restore@v4
        with:
          path: |
            node_modules
            apps/*/node_modules
            packages/*/node_modules
          key: modules-${{ runner.os }}-${{ hashFiles('pnpm-lock.yaml') }}

      - name: Run unit tests (shard ${{ matrix.shard }}/3)
        run: |
          pnpm test:unit --shard=${{ matrix.shard }}/3 --coverage
        env:
          NODE_ENV: test

      - name: Upload coverage
        uses: actions/upload-artifact@v4
        with:
          name: coverage-shard-${{ matrix.shard }}
          path: coverage/
          retention-days: 5

  integration-tests:
    name: Integration Tests
    needs: [lint, typecheck]
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: invoice_test
          POSTGRES_PASSWORD: test_password
          POSTGRES_DB: invoice_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd="pg_isready -U invoice_test"
          --health-interval=5s
          --health-timeout=3s
          --health-retries=5
      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379
        options: >-
          --health-cmd="redis-cli ping"
          --health-interval=5s
          --health-timeout=3s
          --health-retries=5
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: ${{ env.PNPM_VERSION }}

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Restore node_modules
        uses: actions/cache/restore@v4
        with:
          path: |
            node_modules
            apps/*/node_modules
            packages/*/node_modules
          key: modules-${{ runner.os }}-${{ hashFiles('pnpm-lock.yaml') }}

      - name: Run database migrations
        run: pnpm db:migrate
        env:
          DATABASE_URL: postgresql://invoice_test:test_password@localhost:5432/invoice_test

      - name: Run integration tests
        run: pnpm test:integration
        env:
          NODE_ENV: test
          DATABASE_URL: postgresql://invoice_test:test_password@localhost:5432/invoice_test
          REDIS_URL: redis://localhost:6379

  build:
    name: Build Verification
    needs: [unit-tests, integration-tests, security]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: ${{ env.PNPM_VERSION }}

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Restore node_modules
        uses: actions/cache/restore@v4
        with:
          path: |
            node_modules
            apps/*/node_modules
            packages/*/node_modules
          key: modules-${{ runner.os }}-${{ hashFiles('pnpm-lock.yaml') }}

      - name: Build backend
        run: pnpm --filter api build

      - name: Build frontend
        run: pnpm --filter web build

      - name: Upload frontend build
        uses: actions/upload-artifact@v4
        with:
          name: frontend-dist
          path: apps/web/dist/
          retention-days: 1
```

---

# CD Pipeline — Staging

```yaml
# .github/workflows/deploy-staging.yml
name: Deploy to Staging

on:
  push:
    branches: [develop]

concurrency:
  group: deploy-staging
  cancel-in-progress: false

env:
  AWS_REGION: us-east-1
  ECR_REGISTRY: ${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.us-east-1.amazonaws.com
  ECR_REPOSITORY: invoiceapi
  ECS_CLUSTER: invoiceapi-staging
  ECS_SERVICE: invoiceapi-api-staging
  S3_BUCKET: invoiceapi-frontend-staging
  CLOUDFRONT_DIST_ID: ${{ secrets.STAGING_CLOUDFRONT_DIST_ID }}

permissions:
  id-token: write
  contents: read

jobs:
  build-and-push:
    name: Build & Push Docker Image
    runs-on: ubuntu-latest
    outputs:
      image_tag: ${{ steps.meta.outputs.tags }}
      sha_short: ${{ steps.vars.outputs.sha_short }}
    steps:
      - uses: actions/checkout@v4

      - name: Set short SHA
        id: vars
        run: echo "sha_short=$(git rev-parse --short HEAD)" >> "$GITHUB_OUTPUT"

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_DEPLOY_ROLE_ARN }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Login to Amazon ECR
        id: ecr-login
        uses: aws-actions/amazon-ecr-login@v2

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build and push API image
        uses: docker/build-push-action@v6
        with:
          context: .
          file: ./Dockerfile
          target: production
          push: true
          tags: |
            ${{ env.ECR_REGISTRY }}/${{ env.ECR_REPOSITORY }}:${{ steps.vars.outputs.sha_short }}
            ${{ env.ECR_REGISTRY }}/${{ env.ECR_REPOSITORY }}:staging-latest
          cache-from: type=gha
          cache-to: type=gha,mode=max
          build-args: |
            NODE_ENV=production

  deploy-backend:
    name: Deploy Backend to ECS
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_DEPLOY_ROLE_ARN }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Download task definition
        run: |
          aws ecs describe-task-definition \
            --task-definition invoiceapi-api-staging \
            --query taskDefinition \
            > task-definition.json

      - name: Update image in task definition
        id: task-def
        uses: aws-actions/amazon-ecs-render-task-definition@v1
        with:
          task-definition: task-definition.json
          container-name: api
          image: ${{ env.ECR_REGISTRY }}/${{ env.ECR_REPOSITORY }}:${{ needs.build-and-push.outputs.sha_short }}

      - name: Deploy to ECS
        uses: aws-actions/amazon-ecs-deploy-task-definition@v2
        with:
          task-definition: ${{ steps.task-def.outputs.task-definition }}
          service: ${{ env.ECS_SERVICE }}
          cluster: ${{ env.ECS_CLUSTER }}
          wait-for-service-stability: true
          wait-for-minutes: 10

  deploy-frontend:
    name: Deploy Frontend to S3/CloudFront
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: "9"

      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build frontend
        run: pnpm --filter web build
        env:
          VITE_API_URL: https://api-staging.invoiceapi.com
          VITE_ENV: staging

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_DEPLOY_ROLE_ARN }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Deploy to S3
        run: |
          aws s3 sync apps/web/dist/ s3://${{ env.S3_BUCKET }} \
            --delete \
            --cache-control "public,max-age=31536000,immutable" \
            --exclude "index.html"
          aws s3 cp apps/web/dist/index.html s3://${{ env.S3_BUCKET }}/index.html \
            --cache-control "public,max-age=0,must-revalidate"

      - name: Invalidate CloudFront cache
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ env.CLOUDFRONT_DIST_ID }} \
            --paths "/index.html"

  smoke-tests:
    name: Staging Smoke Tests
    needs: [deploy-backend, deploy-frontend]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Wait for service to stabilize
        run: sleep 15

      - name: Health check — API
        run: |
          for i in {1..10}; do
            STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://api-staging.invoiceapi.com/health)
            if [ "$STATUS" = "200" ]; then
              echo "API health check passed"
              exit 0
            fi
            echo "Attempt $i: got $STATUS, retrying in 5s..."
            sleep 5
          done
          echo "API health check failed after 10 attempts"
          exit 1

      - name: Health check — Frontend
        run: |
          STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://staging.invoiceapi.com)
          if [ "$STATUS" != "200" ]; then
            echo "Frontend health check failed with status $STATUS"
            exit 1
          fi
          echo "Frontend health check passed"

      - name: Smoke test — API critical paths
        run: |
          # Verify API returns valid JSON
          curl -sf https://api-staging.invoiceapi.com/health | jq .

          # Verify auth endpoint is reachable
          STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
            https://api-staging.invoiceapi.com/api/v1/auth/login \
            -H "Content-Type: application/json" \
            -d '{"email":"test@example.com","password":"invalid"}')
          if [ "$STATUS" != "401" ]; then
            echo "Expected 401 from auth endpoint, got $STATUS"
            exit 1
          fi
          echo "Auth endpoint responding correctly"

  notify-staging:
    name: Notify — Staging Deploy
    needs: smoke-tests
    if: always()
    runs-on: ubuntu-latest
    steps:
      - name: Slack notification
        uses: slackapi/slack-github-action@v2.0.0
        with:
          webhook: ${{ secrets.SLACK_WEBHOOK_URL }}
          webhook-type: incoming-webhook
          payload: |
            {
              "text": "${{ needs.smoke-tests.result == 'success' && ':white_check_mark:' || ':x:' }} Staging deployment ${{ needs.smoke-tests.result }}",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "${{ needs.smoke-tests.result == 'success' && ':white_check_mark:' || ':x:' }} *InvoiceAPI Staging* — deployment ${{ needs.smoke-tests.result }}\n*Commit:* `${{ github.sha }}` by ${{ github.actor }}\n*Branch:* `${{ github.ref_name }}`\n<${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}|View Run>"
                  }
                }
              ]
            }
```

---

# CD Pipeline — Production

```yaml
# .github/workflows/deploy-production.yml
name: Deploy to Production

on:
  push:
    tags:
      - "v*.*.*"

concurrency:
  group: deploy-production
  cancel-in-progress: false

env:
  AWS_REGION: us-east-1
  ECR_REGISTRY: ${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.us-east-1.amazonaws.com
  ECR_REPOSITORY: invoiceapi
  ECS_CLUSTER: invoiceapi-production
  ECS_SERVICE: invoiceapi-api-production
  S3_BUCKET: invoiceapi-frontend-production
  CLOUDFRONT_DIST_ID: ${{ secrets.PRODUCTION_CLOUDFRONT_DIST_ID }}

permissions:
  id-token: write
  contents: read

jobs:
  approval:
    name: Production Approval Gate
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Approval confirmed
        run: echo "Production deployment approved for ${{ github.ref_name }}"

  verify-staging:
    name: Verify Image Exists
    needs: approval
    runs-on: ubuntu-latest
    outputs:
      image_sha: ${{ steps.find.outputs.image_sha }}
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Get commit SHA for tag
        id: find
        run: |
          TAG_SHA=$(git rev-parse --short ${{ github.sha }})
          echo "image_sha=$TAG_SHA" >> "$GITHUB_OUTPUT"
          echo "Image SHA: $TAG_SHA"

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_DEPLOY_ROLE_ARN }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Verify image exists in ECR
        run: |
          aws ecr describe-images \
            --repository-name ${{ env.ECR_REPOSITORY }} \
            --image-ids imageTag=${{ steps.find.outputs.image_sha }} \
            || (echo "ERROR: Image not found in ECR. Deploy to staging first." && exit 1)

  deploy-backend:
    name: Deploy Backend to Production ECS
    needs: verify-staging
    runs-on: ubuntu-latest
    outputs:
      previous_task_def: ${{ steps.current.outputs.task_def_arn }}
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_DEPLOY_ROLE_ARN }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Capture current task definition for rollback
        id: current
        run: |
          CURRENT=$(aws ecs describe-services \
            --cluster ${{ env.ECS_CLUSTER }} \
            --services ${{ env.ECS_SERVICE }} \
            --query "services[0].taskDefinition" \
            --output text)
          echo "task_def_arn=$CURRENT" >> "$GITHUB_OUTPUT"
          echo "Current task definition: $CURRENT"

      - name: Download task definition
        run: |
          aws ecs describe-task-definition \
            --task-definition invoiceapi-api-production \
            --query taskDefinition \
            > task-definition.json

      - name: Update image in task definition
        id: task-def
        uses: aws-actions/amazon-ecs-render-task-definition@v1
        with:
          task-definition: task-definition.json
          container-name: api
          image: ${{ env.ECR_REGISTRY }}/${{ env.ECR_REPOSITORY }}:${{ needs.verify-staging.outputs.image_sha }}

      - name: Deploy to ECS (rolling update)
        uses: aws-actions/amazon-ecs-deploy-task-definition@v2
        with:
          task-definition: ${{ steps.task-def.outputs.task-definition }}
          service: ${{ env.ECS_SERVICE }}
          cluster: ${{ env.ECS_CLUSTER }}
          wait-for-service-stability: true
          wait-for-minutes: 15

  deploy-frontend:
    name: Deploy Frontend to Production
    needs: verify-staging
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: "9"

      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build frontend
        run: pnpm --filter web build
        env:
          VITE_API_URL: https://api.invoiceapi.com
          VITE_ENV: production

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_DEPLOY_ROLE_ARN }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Deploy to S3
        run: |
          aws s3 sync apps/web/dist/ s3://${{ env.S3_BUCKET }} \
            --delete \
            --cache-control "public,max-age=31536000,immutable" \
            --exclude "index.html"
          aws s3 cp apps/web/dist/index.html s3://${{ env.S3_BUCKET }}/index.html \
            --cache-control "public,max-age=0,must-revalidate"

      - name: Invalidate CloudFront cache
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ env.CLOUDFRONT_DIST_ID }} \
            --paths "/*"

  smoke-tests:
    name: Production Smoke Tests
    needs: [deploy-backend, deploy-frontend]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Wait for service to stabilize
        run: sleep 20

      - name: Health check — API
        run: |
          for i in {1..15}; do
            STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://api.invoiceapi.com/health)
            if [ "$STATUS" = "200" ]; then
              echo "API health check passed"
              exit 0
            fi
            echo "Attempt $i: got $STATUS, retrying in 10s..."
            sleep 10
          done
          echo "API health check failed after 15 attempts"
          exit 1

      - name: Health check — Frontend
        run: |
          STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://invoiceapi.com)
          if [ "$STATUS" != "200" ]; then
            echo "Frontend health check failed with status $STATUS"
            exit 1
          fi
          echo "Frontend health check passed"

      - name: Smoke test — Critical endpoints
        run: |
          # Health endpoint returns valid JSON
          curl -sf https://api.invoiceapi.com/health | jq .

          # API version header present
          VERSION=$(curl -s -I https://api.invoiceapi.com/health | grep -i x-api-version || true)
          echo "API version: $VERSION"

  rollback:
    name: Rollback on Failure
    needs: [deploy-backend, smoke-tests]
    if: failure()
    runs-on: ubuntu-latest
    steps:
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_DEPLOY_ROLE_ARN }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Rollback ECS to previous task definition
        run: |
          echo "Rolling back to: ${{ needs.deploy-backend.outputs.previous_task_def }}"
          aws ecs update-service \
            --cluster ${{ env.ECS_CLUSTER }} \
            --service ${{ env.ECS_SERVICE }} \
            --task-definition ${{ needs.deploy-backend.outputs.previous_task_def }} \
            --force-new-deployment

      - name: Wait for rollback to stabilize
        run: |
          aws ecs wait services-stable \
            --cluster ${{ env.ECS_CLUSTER }} \
            --services ${{ env.ECS_SERVICE }}
          echo "Rollback completed successfully"

  notify-production:
    name: Notify — Production Deploy
    needs: smoke-tests
    if: always()
    runs-on: ubuntu-latest
    steps:
      - name: Slack notification
        uses: slackapi/slack-github-action@v2.0.0
        with:
          webhook: ${{ secrets.SLACK_WEBHOOK_URL }}
          webhook-type: incoming-webhook
          payload: |
            {
              "text": "${{ needs.smoke-tests.result == 'success' && ':rocket:' || ':rotating_light:' }} Production deployment ${{ needs.smoke-tests.result }}",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "${{ needs.smoke-tests.result == 'success' && ':rocket:' || ':rotating_light:' }} *InvoiceAPI Production* — deployment ${{ needs.smoke-tests.result }}\n*Version:* `${{ github.ref_name }}`\n*Commit:* `${{ github.sha }}`\n*Triggered by:* ${{ github.actor }}\n<${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}|View Run>"
                  }
                }
              ]
            }
```

---

# Supporting Configuration

## Dockerfile

```dockerfile
# Dockerfile

# --- Base stage: shared between dev and prod ---
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app

# --- Dependencies stage: install only ---
FROM base AS dependencies
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json apps/api/
COPY packages/ packages/
RUN pnpm install --frozen-lockfile

# --- Development stage: hot reload ---
FROM base AS development
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/api/node_modules ./apps/api/node_modules
COPY . .
EXPOSE 3000
ENV NODE_ENV=development
CMD ["pnpm", "--filter", "api", "dev"]

# --- Build stage: compile TypeScript ---
FROM base AS build
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/api/node_modules ./apps/api/node_modules
COPY . .
RUN pnpm --filter api build
RUN pnpm deploy --filter api --prod /app/deployed

# --- Production stage: minimal image ---
FROM node:20-alpine AS production
RUN apk add --no-cache tini curl
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
COPY --from=build /app/deployed/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/package.json ./
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
USER appuser
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/server.js"]
```

## Docker Compose (local development)

```yaml
# docker-compose.yml

services:
  api:
    build:
      context: .
      target: development
    container_name: invoiceapi-api
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    env_file: .env
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile.dev
    container_name: invoiceapi-web
    ports:
      - "5173:5173"
    volumes:
      - ./apps/web:/app/apps/web
      - /app/apps/web/node_modules
    environment:
      - VITE_API_URL=http://localhost:3000
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    container_name: invoiceapi-postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-invoice}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-localdev}
      POSTGRES_DB: ${POSTGRES_DB:-invoice_dev}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-invoice}"]
      interval: 5s
      timeout: 3s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: invoiceapi-redis
    ports:
      - "6379:6379"
    command: redis-server --maxmemory 128mb --maxmemory-policy allkeys-lru
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

volumes:
  postgres_data:
  redis_data:
```

## Environment Configuration

```bash
# .env.example
# InvoiceAPI — copy to .env and fill in values

# ── Application ──
NODE_ENV=development
PORT=3000
API_URL=http://localhost:3000
LOG_LEVEL=debug

# ── Database ──
POSTGRES_USER=invoice
POSTGRES_PASSWORD=localdev
POSTGRES_DB=invoice_dev
DATABASE_URL=postgresql://invoice:localdev@localhost:5432/invoice_dev

# ── Redis ──
REDIS_URL=redis://localhost:6379

# ── Authentication ──
JWT_SECRET=local-dev-secret-change-in-production
JWT_EXPIRES_IN=7d

# ── Frontend (Vite) ──
VITE_API_URL=http://localhost:3000
```

---

# Branch Protection Rules

**`main` branch:**
- Require pull request before merging (min 1 reviewer)
- Dismiss stale reviews when new commits are pushed
- Require status checks to pass: `Lint & Format`, `Type Check`, `Unit Tests`, `Integration Tests`, `Security Scan`, `Build Verification`
- Require branches to be up to date before merging
- Require conversation resolution before merging
- Restrict pushes to: release automation bot, lead engineers
- Do not allow force pushes
- Do not allow deletions

**`develop` branch:**
- Require pull request before merging (min 1 reviewer)
- Require status checks to pass: `Lint & Format`, `Type Check`, `Unit Tests`, `Integration Tests`, `Build Verification`
- Require branches to be up to date before merging
- Allow force pushes by administrators only (for occasional history cleanup)

---

# Secrets & Environment Variables

| Name | Purpose | Scope | Where to Configure |
|------|---------|-------|--------------------|
| `AWS_ACCOUNT_ID` | AWS account for ECR registry URL | CI + CD | Repository secret |
| `AWS_DEPLOY_ROLE_ARN` | IAM role ARN for OIDC-based AWS auth | CD | Repository secret |
| `STAGING_CLOUDFRONT_DIST_ID` | CloudFront distribution ID for staging | CD (staging) | Repository secret |
| `PRODUCTION_CLOUDFRONT_DIST_ID` | CloudFront distribution ID for production | CD (production) | Environment secret (`production`) |
| `SLACK_WEBHOOK_URL` | Slack incoming webhook for notifications | CD | Repository secret |
| `DATABASE_URL` | PostgreSQL connection string | CD (per environment) | Environment secret |
| `REDIS_URL` | Redis connection string | CD (per environment) | Environment secret |
| `JWT_SECRET` | JWT signing secret | CD (per environment) | Environment secret |

**Rotation policy:**
- `JWT_SECRET` — rotate every 90 days, support dual-secret validation during rotation window.
- `AWS_DEPLOY_ROLE_ARN` — uses OIDC federation (no static credentials to rotate).
- `DATABASE_URL` — rotate password quarterly, coordinate with RDS credential rotation.
- `SLACK_WEBHOOK_URL` — regenerate if compromised, no scheduled rotation needed.
