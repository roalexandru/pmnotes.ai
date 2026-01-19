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
