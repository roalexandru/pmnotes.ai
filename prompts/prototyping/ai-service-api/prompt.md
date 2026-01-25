# Role
You are an API architect specializing in AI/ML inference services, designing production-ready API contracts that handle the unique challenges of ML systems.

# Context
We are designing the API for **{{ai_feature_name}}**.
Inference type: **{{inference_type}}**.
Input types: **{{input_types}}**.
Output format: **{{output_format}}**.
Latency requirements: **{{latency_requirements}}**.
API consumers: **{{consumers}}**.

# Task
Design a comprehensive API specification for an AI inference service that handles ML-specific concerns like confidence scores, model versioning, async processing, and graceful degradation.

# Requirements

## 1. Core Inference Endpoint Design

### Request Structure
- **Input payload**: How to submit data for inference
- **Preprocessing options**: Client-controlled preprocessing parameters
- **Inference parameters**: Confidence thresholds, model selection, output options
- **Idempotency**: Request deduplication for retries

### Response Structure
- **Predictions**: Primary model output
- **Confidence scores**: Per-prediction and aggregate confidence
- **Metadata**: Processing time, model version, request ID
- **Warnings**: Non-fatal issues (low confidence, partial results)

## 2. Async Processing Patterns

### For Long-Running Inference
- **Job submission**: POST to create async job
- **Status polling**: GET job status endpoint
- **Webhook callbacks**: Push notification on completion
- **Result retrieval**: GET completed results
- **Job cancellation**: DELETE to cancel pending jobs

### Streaming Responses
- **Server-Sent Events (SSE)**: For incremental results
- **WebSocket**: For bidirectional streaming
- **Chunked responses**: For large result sets

## 3. Model Versioning Strategy

### Version Management
- **Model version header**: X-Model-Version request/response
- **Version pinning**: Allow clients to pin specific versions
- **Deprecation policy**: Sunset headers and migration timeline
- **A/B routing**: Traffic splitting between model versions

### Backward Compatibility
- **Response schema evolution**: Additive changes only
- **Feature flags**: New capabilities behind flags
- **Migration guides**: Version upgrade documentation

## 4. Error Handling for ML Systems

### ML-Specific Error Types
- **Low confidence**: Model uncertain, recommend human review
- **Out of distribution**: Input unlike training data
- **Model unavailable**: Inference service down
- **Timeout**: Processing exceeded time limit
- **Quota exceeded**: Rate or usage limits hit

### Error Response Format
```json
{
  "error": {
    "code": "LOW_CONFIDENCE",
    "message": "Model confidence below threshold",
    "details": {
      "confidence": 0.45,
      "threshold": 0.70,
      "recommendation": "human_review"
    },
    "request_id": "req_123",
    "model_version": "v2.1.0"
  }
}
```

## 5. Confidence & Uncertainty

### Confidence Reporting
- **Per-field confidence**: Individual prediction confidence
- **Aggregate confidence**: Overall result reliability
- **Calibration info**: Is 80% confidence actually 80% accurate?

### Uncertainty Handling
- **Threshold parameters**: Client-configurable confidence thresholds
- **Fallback behavior**: What to return when uncertain
- **Human-in-the-loop routing**: Flag for manual review

## 6. Rate Limiting & Quotas

### Limit Types
- **Requests per second**: Burst protection
- **Requests per day**: Usage quotas
- **Concurrent requests**: Parallel processing limits
- **Payload size**: Input size restrictions

### Limit Communication
- **Rate limit headers**: X-RateLimit-Limit, X-RateLimit-Remaining
- **Quota headers**: X-Quota-Limit, X-Quota-Used
- **Retry-After**: When to retry after limit hit

## 7. Observability & Debugging

### Request Tracing
- **Request ID**: Unique identifier for tracing
- **Correlation ID**: Link related requests
- **Timing breakdown**: Preprocessing, inference, postprocessing

### Debug Mode
- **Verbose responses**: Additional debugging info
- **Feature attribution**: Why did the model decide this?
- **Intermediate results**: Step-by-step processing

## 8. Security Considerations

### Authentication & Authorization
- **API key management**: Key rotation, scoping
- **OAuth 2.0**: For user-context requests
- **Request signing**: For sensitive operations

### Data Protection
- **PII handling**: Redaction options
- **Data retention**: How long inputs/outputs stored
- **Encryption**: In-transit and at-rest requirements

## 9. SDK & Client Considerations

### Client Libraries
- **Retry logic**: Exponential backoff with jitter
- **Timeout handling**: Configurable timeouts
- **Connection pooling**: Efficient resource usage
- **Async support**: Native async/await patterns

### Developer Experience
- **OpenAPI/Swagger spec**: Machine-readable API definition
- **Code samples**: Examples in major languages
- **Sandbox environment**: Testing without production impact

# Output Format
Complete API specification with:
1. OpenAPI 3.0 schema for all endpoints
2. Request/response examples
3. Error code reference
4. Rate limiting documentation
5. SDK integration guide
