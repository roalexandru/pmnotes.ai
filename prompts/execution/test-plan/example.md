```markdown
# Feature Test Plan: Self-Serve Invoice Download

## Scope

Billing admins can download invoices as PDFs from the Billing page.

## Coverage

### Unit Tests

- Validate permission checks for billing_admin role.
- Ensure invoice metadata formatting (date, amount, currency).

### Integration Tests

- Stripe invoice retrieval with valid/invalid invoice IDs.
- PDF renderer returns a file within 2 seconds.

### End-to-End Tests

- Admin logs in → opens Billing → downloads latest invoice.
- Non-admin attempts download and receives access denied.

## High-Risk Edge Cases

1. Invoice is in draft status.
2. Large invoice with 100+ line items.
3. Missing customer address data.
4. Stripe API rate limit response.
5. PDF renderer timeout.

## Data Setup

- Seed billing admin and read-only user accounts.
- Create invoices across statuses (paid, draft, void).
- Mock Stripe API responses for error scenarios.

## Exit Criteria

- All P0/P1 tests pass.
- No open critical bugs for permissions or billing data.
- PDF downloads successful in 3 consecutive runs.

## Residual Risks

- Stripe downtime remains a dependency; mitigate with cached invoice PDFs.
```

## Test Stubs: Unit Tests (Jest)

```typescript
// invoice-download.test.ts
import { describe, test, expect, beforeEach } from '@jest/globals';

describe('Invoice Download - Permissions', () => {
  beforeEach(() => {
    // TODO: Set up mock user context and billing data
  });

  test('billing_admin role can request invoice download', () => {
    // TODO: Create billing_admin user, call download endpoint, assert 200
  });

  test('read_only role receives 403 on download attempt', () => {
    // TODO: Create read_only user, call download endpoint, assert 403
  });

  test('unauthenticated request receives 401', () => {
    // TODO: Call download endpoint without auth header, assert 401
  });
});

describe('Invoice Download - PDF Formatting', () => {
  test('invoice metadata includes correct date format', () => {
    // TODO: Generate invoice PDF, parse metadata, assert ISO date format
  });

  test('invoice amount matches Stripe source data', () => {
    // TODO: Mock Stripe invoice, generate PDF, compare amount fields
  });

  test('currency formatting handles non-USD currencies', () => {
    // TODO: Test EUR, GBP, JPY formatting (decimal places, symbols)
  });
});

describe('Invoice Download - Edge Cases', () => {
  test('draft invoice returns appropriate error', () => {
    // TODO: Request download for draft-status invoice, assert error message
  });

  test('invoice with 100+ line items generates within timeout', () => {
    // TODO: Create large invoice fixture, assert PDF generated in <2s
  });

  test('missing customer address data handled gracefully', () => {
    // TODO: Create invoice with null address, assert PDF renders with placeholder
  });
});
```

## Test Stubs: E2E Tests (Playwright)

```typescript
// billing-e2e.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Billing - Invoice Download Flow', () => {
  test.beforeEach(async ({ page }) => {
    // TODO: Log in as billing admin, navigate to billing page
  });

  test('admin downloads latest invoice successfully', async ({ page }) => {
    // TODO: Click download button on latest invoice row
    // TODO: Assert file download triggered with correct filename
    // TODO: Assert downloaded file is valid PDF
  });

  test('non-admin sees disabled download button', async ({ page }) => {
    // TODO: Log in as read_only user
    // TODO: Navigate to billing page
    // TODO: Assert download button is disabled or hidden
    // TODO: Assert tooltip shows permission message
  });

  test('download handles Stripe API timeout gracefully', async ({ page }) => {
    // TODO: Intercept Stripe API call, delay response by 10s
    // TODO: Assert loading indicator appears
    // TODO: Assert timeout error message displayed to user
  });

  test('invoice list displays correct statuses', async ({ page }) => {
    // TODO: Assert invoice rows show paid, draft, void badges
    // TODO: Assert only paid invoices have active download buttons
  });

  test('downloaded PDF matches invoice details on screen', async ({ page }) => {
    // TODO: Read invoice amount and date from the page
    // TODO: Download PDF, extract text, compare values
  });
});
```
