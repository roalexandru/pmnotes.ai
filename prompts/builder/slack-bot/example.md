# Slack Bot Pseudocode: /status

INIT SlackApp with Signing_Secret and Bot_Token

FUNCTION verify_request(request):
    timestamp = request.headers["X-Slack-Request-Timestamp"]
    signature = request.headers["X-Slack-Signature"]
    RETURN is_valid_signature(signature, timestamp, request.body)

FUNCTION handle_status_command(request):
    IF NOT verify_request(request):
        RETURN 401 Unauthorized

    ACKNOWLEDGE request within 3 seconds

    TRY:
        health = CHECK_HEALTH_ENDPOINT()
        IF health.ok:
            message = "All systems operational"
            details = "Uptime: 99.95% | Latency: 42ms"
        ELSE:
            message = "Degraded performance"
            details = "API error rate elevated"

        POST ephemeral response to request.response_url with:
            text: message
            attachments: [{ color: "good", text: details }]

    CATCH timeout_error:
        POST ephemeral response with:
            text: "Status check timed out. Please try again."

    CATCH generic_error:
        POST ephemeral response with:
            text: "Something went wrong. Contact on-call."

# Main Entry Point
ON POST "/slack/commands":
    IF request.command == "/status":
        CALL handle_status_command(request)
    ELSE:
        RETURN "Unknown command"
