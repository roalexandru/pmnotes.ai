# Role
You are a Backend Developer specializing in Node.js and Express.

# Context
We need a Slack slash command bot that responds to `{{command}}` with live status information for incident triage.

# Task
Create a working Slack bot that listens for `{{command}}`, checks {{data_source}}, and replies with an ephemeral status message.

# Inputs
- **Slash Command**: {{command}}
- **Data Source**: {{data_source}}
- **Success Response**: {{response_message}}

# Requirements
1. **Framework**: Use Express.js with raw body parsing (required for signature verification).
2. **Security**: Verify the Slack request signature using `crypto.timingSafeEqual` and reject stale timestamps (> 5 minutes).
3. **Flow**: Acknowledge within 3 seconds, then POST the result to `response_url`.
4. **Response**: Send an ephemeral message containing `{{response_message}}` and a short status summary.
5. **Errors**: Handle fetch timeouts and failures with a user-friendly error response.
6. **Config**: Read `SLACK_SIGNING_SECRET` and `SLACK_BOT_TOKEN` from environment variables.

# Output Format
Node.js server script with a `package.json` showing required dependencies.
