# AI Service API Design
## Document Intelligence API

**Version**: 1.0.0
**Base URL**: `https://api.example.com/v1/document-intelligence`

---

## 1. API Overview

### Authentication
All requests require an API key passed via header:
```
Authorization: Bearer <api_key>
```

### Common Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | Bearer token authentication |
| `X-Request-ID` | No | Client-provided request ID for tracing |
| `X-Model-Version` | No | Pin specific model version (e.g., "v2.1.0") |
| `X-Idempotency-Key` | No | Prevent duplicate processing on retries |

### Common Response Headers

| Header | Description |
|--------|-------------|
| `X-Request-ID` | Unique request identifier |
| `X-Model-Version` | Model version used for inference |
| `X-Processing-Time-Ms` | Total processing time in milliseconds |
| `X-RateLimit-Limit` | Requests allowed per window |
| `X-RateLimit-Remaining` | Requests remaining in window |
| `X-RateLimit-Reset` | Unix timestamp when limit resets |

---

## 2. Core Endpoints

### 2.1 Synchronous Extraction (Single Page)

**POST** `/extract`

For single-page documents with fast response requirements.

#### Request

```json
{
  "document": {
    "content": "base64_encoded_content",
    "content_type": "application/pdf",
    "source_url": "https://storage.example.com/doc.pdf"  // Alternative to content
  },
  "extraction_config": {
    "fields": ["vendor_name", "invoice_number", "total_amount", "line_items"],
    "confidence_threshold": 0.70,
    "include_bounding_boxes": true,
    "language_hint": "en"
  },
  "processing_options": {
    "enhance_quality": true,
    "deskew": true,
    "timeout_ms": 5000
  }
}
```

#### Response (200 OK)

```json
{
  "request_id": "req_abc123def456",
  "model_version": "v2.1.0",
  "processing_time_ms": 1847,
  "status": "completed",
  "result": {
    "document_type": "invoice",
    "document_type_confidence": 0.96,
    "fields": {
      "vendor_name": {
        "value": "Acme Corporation",
        "confidence": 0.94,
        "bounding_box": {
          "page": 1,
          "x": 100,
          "y": 150,
          "width": 200,
          "height": 30
        }
      },
      "invoice_number": {
        "value": "INV-2024-001234",
        "confidence": 0.98,
        "bounding_box": { "page": 1, "x": 450, "y": 150, "width": 150, "height": 25 }
      },
      "total_amount": {
        "value": {
          "amount": 15750.00,
          "currency": "USD"
        },
        "confidence": 0.97,
        "bounding_box": { "page": 1, "x": 450, "y": 600, "width": 100, "height": 25 }
      },
      "line_items": {
        "value": [
          {
            "description": "Professional Services",
            "quantity": 40,
            "unit_price": 350.00,
            "total": 14000.00
          },
          {
            "description": "Travel Expenses",
            "quantity": 1,
            "unit_price": 1750.00,
            "total": 1750.00
          }
        ],
        "confidence": 0.89,
        "item_confidences": [0.92, 0.86]
      }
    },
    "aggregate_confidence": 0.92,
    "warnings": []
  },
  "usage": {
    "pages_processed": 1,
    "credits_used": 1
  }
}
```

---

### 2.2 Asynchronous Extraction (Multi-Page)

**POST** `/extract/async`

For large documents requiring background processing.

#### Request

```json
{
  "document": {
    "source_url": "https://storage.example.com/large-contract.pdf"
  },
  "extraction_config": {
    "fields": ["all"],
    "confidence_threshold": 0.70
  },
  "callback": {
    "url": "https://your-app.com/webhooks/extraction-complete",
    "headers": {
      "X-Webhook-Secret": "your_secret_token"
    }
  }
}
```

#### Response (202 Accepted)

```json
{
  "job_id": "job_xyz789",
  "status": "pending",
  "created_at": "2024-01-15T10:30:00Z",
  "estimated_completion": "2024-01-15T10:32:00Z",
  "status_url": "/extract/async/job_xyz789",
  "cancel_url": "/extract/async/job_xyz789"
}
```

---

### 2.3 Job Status

**GET** `/extract/async/{job_id}`

#### Response (200 OK) - In Progress

```json
{
  "job_id": "job_xyz789",
  "status": "processing",
  "progress": {
    "pages_total": 45,
    "pages_processed": 23,
    "percentage": 51
  },
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:31:15Z"
}
```

#### Response (200 OK) - Completed

```json
{
  "job_id": "job_xyz789",
  "status": "completed",
  "progress": {
    "pages_total": 45,
    "pages_processed": 45,
    "percentage": 100
  },
  "created_at": "2024-01-15T10:30:00Z",
  "completed_at": "2024-01-15T10:33:22Z",
  "result_url": "/extract/async/job_xyz789/result",
  "expires_at": "2024-01-22T10:33:22Z"
}
```

---

### 2.4 Retrieve Async Results

**GET** `/extract/async/{job_id}/result`

Returns same format as synchronous extraction response.

---

### 2.5 Cancel Job

**DELETE** `/extract/async/{job_id}`

#### Response (200 OK)

```json
{
  "job_id": "job_xyz789",
  "status": "cancelled",
  "cancelled_at": "2024-01-15T10:31:00Z",
  "pages_processed_before_cancel": 12,
  "credits_refunded": 33
}
```

---

### 2.6 Webhook Callback Payload

When async job completes, the following is POSTed to your callback URL:

```json
{
  "event": "extraction.completed",
  "job_id": "job_xyz789",
  "status": "completed",
  "completed_at": "2024-01-15T10:33:22Z",
  "result_url": "https://api.example.com/v1/document-intelligence/extract/async/job_xyz789/result",
  "summary": {
    "pages_processed": 45,
    "aggregate_confidence": 0.88,
    "fields_extracted": 127,
    "warnings_count": 3
  }
}
```

---

## 3. Streaming Endpoint

**POST** `/extract/stream`

For real-time extraction with incremental results via Server-Sent Events.

#### Request

Same as synchronous extraction.

#### Response (SSE Stream)

```
event: progress
data: {"page": 1, "total_pages": 10, "status": "processing"}

event: field
data: {"field": "vendor_name", "value": "Acme Corp", "confidence": 0.94}

event: field
data: {"field": "invoice_number", "value": "INV-001", "confidence": 0.98}

event: progress
data: {"page": 2, "total_pages": 10, "status": "processing"}

event: complete
data: {"request_id": "req_123", "aggregate_confidence": 0.91, "result_url": "/extract/req_123/result"}
```

---

## 4. Model Version Management

### 4.1 List Available Models

**GET** `/models`

```json
{
  "models": [
    {
      "version": "v2.1.0",
      "status": "stable",
      "released_at": "2024-01-01T00:00:00Z",
      "supported_document_types": ["invoice", "receipt", "contract", "form"],
      "accuracy_metrics": {
        "invoice_accuracy": 0.96,
        "receipt_accuracy": 0.94
      }
    },
    {
      "version": "v2.2.0-beta",
      "status": "beta",
      "released_at": "2024-01-10T00:00:00Z",
      "improvements": ["Better handwriting recognition", "New languages: Japanese, Korean"]
    },
    {
      "version": "v2.0.0",
      "status": "deprecated",
      "deprecated_at": "2024-01-01T00:00:00Z",
      "sunset_at": "2024-04-01T00:00:00Z",
      "migration_guide": "https://docs.example.com/migrate-v2.0-to-v2.1"
    }
  ],
  "default_version": "v2.1.0"
}
```

### 4.2 Version Pinning

Request with pinned version:
```
X-Model-Version: v2.1.0
```

Response includes deprecation warning when using old version:
```
X-Model-Version: v2.0.0
Deprecation: version="v2.0.0"; sunset="2024-04-01"; see="https://docs.example.com/migrate"
```

---

## 5. Error Responses

### Error Response Format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {},
    "request_id": "req_abc123",
    "documentation_url": "https://docs.example.com/errors/ERROR_CODE"
  }
}
```

### ML-Specific Error Codes

| Code | HTTP Status | Description | Recommended Action |
|------|-------------|-------------|-------------------|
| `LOW_CONFIDENCE` | 200 | Results below confidence threshold | Human review recommended |
| `OUT_OF_DISTRIBUTION` | 200 | Input unlike training data | Manual processing recommended |
| `PARTIAL_EXTRACTION` | 200 | Some fields could not be extracted | Review warnings array |
| `UNSUPPORTED_DOCUMENT` | 400 | Document type not supported | Check supported types |
| `DOCUMENT_TOO_LARGE` | 400 | Exceeds size limits | Use async endpoint |
| `INVALID_DOCUMENT` | 400 | Cannot parse document | Check document format |
| `MODEL_UNAVAILABLE` | 503 | Inference service down | Retry with backoff |
| `PROCESSING_TIMEOUT` | 504 | Exceeded time limit | Use async endpoint |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests | Wait for Retry-After |
| `QUOTA_EXCEEDED` | 429 | Usage quota depleted | Upgrade plan or wait |

### Low Confidence Response Example

```json
{
  "request_id": "req_abc123",
  "status": "completed_with_warnings",
  "result": {
    "fields": {
      "vendor_name": {
        "value": "Acme Corp",
        "confidence": 0.65,
        "below_threshold": true
      }
    },
    "aggregate_confidence": 0.58
  },
  "warnings": [
    {
      "code": "LOW_CONFIDENCE",
      "message": "Overall confidence (0.58) below threshold (0.70)",
      "recommendation": "human_review",
      "affected_fields": ["vendor_name", "line_items"]
    }
  ],
  "routing": {
    "recommendation": "human_review",
    "reason": "Multiple fields below confidence threshold"
  }
}
```

---

## 6. Rate Limiting

### Limits by Tier

| Tier | Requests/Second | Requests/Day | Concurrent | Max Pages/Request |
|------|-----------------|--------------|------------|-------------------|
| Free | 1 | 100 | 1 | 5 |
| Starter | 5 | 1,000 | 3 | 25 |
| Professional | 20 | 10,000 | 10 | 100 |
| Enterprise | 100 | Unlimited | 50 | 500 |

### Rate Limit Response (429)

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please retry after the specified time.",
    "details": {
      "limit": 20,
      "window": "1 second",
      "retry_after_seconds": 1
    }
  }
}
```

Headers:
```
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1705318800
Retry-After: 1
```

---

## 7. Debug Mode

Add header for verbose debugging information:
```
X-Debug-Mode: true
```

### Debug Response Extensions

```json
{
  "result": { ... },
  "debug": {
    "timing": {
      "preprocessing_ms": 145,
      "ocr_ms": 823,
      "inference_ms": 756,
      "postprocessing_ms": 123,
      "total_ms": 1847
    },
    "model_info": {
      "version": "v2.1.0",
      "checkpoint": "2024-01-01-final",
      "gpu_used": "A100"
    },
    "preprocessing": {
      "original_size": "2480x3508",
      "processed_size": "1240x1754",
      "deskew_angle": 1.2,
      "quality_score": 0.87
    },
    "feature_attribution": {
      "vendor_name": {
        "top_features": [
          {"region": "header_left", "contribution": 0.45},
          {"region": "logo_area", "contribution": 0.32}
        ]
      }
    }
  }
}
```

---

## 8. OpenAPI Specification (Excerpt)

```yaml
openapi: 3.0.3
info:
  title: Document Intelligence API
  version: 1.0.0
  description: AI-powered document extraction service

servers:
  - url: https://api.example.com/v1/document-intelligence

paths:
  /extract:
    post:
      summary: Extract data from document (synchronous)
      operationId: extractSync
      tags: [Extraction]
      security:
        - bearerAuth: []
      parameters:
        - $ref: '#/components/parameters/RequestId'
        - $ref: '#/components/parameters/ModelVersion'
        - $ref: '#/components/parameters/IdempotencyKey'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ExtractionRequest'
      responses:
        '200':
          description: Extraction successful
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ExtractionResponse'
        '400':
          $ref: '#/components/responses/BadRequest'
        '429':
          $ref: '#/components/responses/RateLimited'
        '503':
          $ref: '#/components/responses/ServiceUnavailable'

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer

  schemas:
    ExtractionRequest:
      type: object
      required: [document]
      properties:
        document:
          $ref: '#/components/schemas/DocumentInput'
        extraction_config:
          $ref: '#/components/schemas/ExtractionConfig'
        processing_options:
          $ref: '#/components/schemas/ProcessingOptions'

    ExtractionResponse:
      type: object
      properties:
        request_id:
          type: string
        model_version:
          type: string
        status:
          type: string
          enum: [completed, completed_with_warnings]
        result:
          $ref: '#/components/schemas/ExtractionResult'
        warnings:
          type: array
          items:
            $ref: '#/components/schemas/Warning'
        usage:
          $ref: '#/components/schemas/Usage'
```

---

## 9. SDK Quick Start

### Python

```python
from document_intelligence import Client

client = Client(api_key="your_api_key")

# Synchronous extraction
result = client.extract(
    document="path/to/invoice.pdf",
    fields=["vendor_name", "total_amount"],
    confidence_threshold=0.7
)

print(f"Vendor: {result.fields.vendor_name.value}")
print(f"Confidence: {result.aggregate_confidence}")

# Async extraction with callback
job = client.extract_async(
    document="path/to/large-contract.pdf",
    callback_url="https://your-app.com/webhook"
)

# Or poll for results
result = job.wait_for_completion(timeout=300)
```

### JavaScript/TypeScript

```typescript
import { DocumentIntelligence } from '@example/document-intelligence';

const client = new DocumentIntelligence({ apiKey: 'your_api_key' });

// Synchronous extraction
const result = await client.extract({
  document: fs.readFileSync('invoice.pdf'),
  fields: ['vendor_name', 'total_amount'],
  confidenceThreshold: 0.7
});

// Streaming extraction
const stream = client.extractStream({ document: buffer });
for await (const event of stream) {
  if (event.type === 'field') {
    console.log(`Extracted: ${event.field} = ${event.value}`);
  }
}
```

---

## 10. Best Practices

### Retry Strategy

```python
import time
from random import uniform

def extract_with_retry(client, document, max_retries=3):
    for attempt in range(max_retries):
        try:
            return client.extract(document)
        except RateLimitError as e:
            wait_time = e.retry_after or (2 ** attempt + uniform(0, 1))
            time.sleep(wait_time)
        except ServiceUnavailableError:
            wait_time = 2 ** attempt + uniform(0, 1)
            time.sleep(wait_time)
    raise MaxRetriesExceeded()
```

### Handling Low Confidence

```python
result = client.extract(document, confidence_threshold=0.7)

if result.routing.recommendation == "human_review":
    # Route to human review queue
    queue_for_review(result)
elif result.status == "completed_with_warnings":
    # Process but flag for spot-checking
    process_with_flag(result)
else:
    # Fully automated processing
    process_automatically(result)
```
