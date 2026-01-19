# Role
You are a Software Architect.

# Context
We need a Slack slash command that returns a quick system status response for incident triage.

# Task
Outline pseudocode for a Slack bot that listens for `{{command}}` and checks {{data_source}}.

# Requirements
1. **Security**: Verify the Slack signature and timestamp.
2. **Flow**: Acknowledge the request quickly, then fetch status data.
3. **Response**: Post an ephemeral message with `{{response_message}}` and a short status summary.
4. **Errors**: Handle timeouts or failures with a friendly error response.

# Output Format
Pseudocode (clear steps, functions, and comments).
