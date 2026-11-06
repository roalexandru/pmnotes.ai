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
2. **Signature Verification First**: Before doing anything else, verify the `{{secret_header}}` signature against the **raw** request body. Prefer the provider's official SDK helper if one exists (e.g. `stripe.webhooks.constructEvent` for Stripe); otherwise compute HMAC-SHA256 and compare with `crypto.timingSafeEqual`, checking buffer lengths first (it throws on unequal lengths). Return `400` if the signature is missing or invalid.
3. **Replay Protection**: Reject events whose signed timestamp is missing, non-numeric, or more than 5 minutes from the current time.
4. **Response**: Only after verification succeeds, return a `2xx` immediately, then process the event asynchronously so slow handlers don't trigger provider retries.
5. **Event Routing**: Switch on the event type and call a dedicated handler function for each event in the list.
6. **Idempotency**: Providers retry and may deliver duplicates, so dedupe by event ID (in-memory Set as a stub; note that production needs a durable store) and make handlers safe to run more than once.
7. **Errors**: Log handler errors without crashing the server. Because the event was already acknowledged, note how failed events would be retried or reconciled (e.g. a job queue or dead-letter log).

# Ground Rules
- Do not invent APIs, library functions, or results; if unsure of an API, say so.
- Where you must estimate, mark it `(est.)` and state the assumption.
- Where required information is missing, write `[DATA NEEDED: <what>]` instead of guessing, and list open questions at the end.
- Quotes must be verbatim from the inputs. Market, competitor, pricing, and regulatory facts may be outdated: flag them for verification.
- If you can execute code, run it and report the real output. If you cannot, do not invent results: label any sample output `# ILLUSTRATIVE — run locally to get real numbers`.

# Output Format
Node.js server script with a `package.json` showing required dependencies.
