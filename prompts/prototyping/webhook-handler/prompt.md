# Role
You are a Backend Developer specializing in Node.js and webhook integrations.

# Context
We need a webhook receiver that accepts events from **{{provider}}**, verifies their authenticity, and routes each event type to the correct handler.

# Task
Create an Express.js server that receives {{provider}} webhooks, verifies the `{{secret_header}}` signature, and handles these events: {{events}}.

# Inputs
- **Provider**: {{provider}}
- **Events**: {{events}}
- **Signature Header**: {{secret_header}}

# Requirements
1. **Framework**: Use Express.js with raw body parsing on the webhook route (required for signature verification).
2. **Signature Verification**: Verify the `{{secret_header}}` header using HMAC-SHA256 and `crypto.timingSafeEqual`.
3. **Event Routing**: Switch on the event type and call a dedicated handler function for each event in the list.
4. **Idempotency**: Log the event ID and skip duplicates using an in-memory Set (stub for production store).
5. **Response**: Always return 200 quickly to avoid provider retries. Process events after responding.
6. **Errors**: Log handler errors without crashing the server or returning non-200 to the provider.

# Output Format
Node.js server script with a `package.json` showing required dependencies.
