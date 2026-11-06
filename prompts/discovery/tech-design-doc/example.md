# Technical Design: FleetPulse

## 1. Executive Summary

FleetPulse is a real-time fleet monitoring dashboard designed for 5k concurrent users and 500k events/minute. The architecture uses managed AWS services to achieve <200ms alert latency and 99.9% uptime.

## 2. Chosen Tech Stack

| Layer     | Choice                 | Rationale                                      |
| --------- | ---------------------- | ---------------------------------------------- |
| Frontend  | React + Vite           | Fast UI iteration, strong component ecosystem  |
| Backend   | Node.js (NestJS)       | Scalable API layer with TypeScript safety      |
| Streaming | AWS Kinesis            | Handles high event throughput with low latency |
| Data      | Postgres (RDS) + Redis | Relational data + fast lookup for alerts       |
| Infra     | AWS ECS + CloudFront   | Managed deployment and global edge caching     |

## 3. System Architecture

```text
User → CloudFront → Web App → API Gateway → Core API (ECS)
Telemetry → Kinesis → Stream Processor → Alert Engine → Redis/Postgres → Notifications
```

## 4. Core Components

- **Core API**: Auth, tenant config, fleet dashboards; scales horizontally.
- **Stream Processor**: Normalizes incoming events and enriches with metadata.
- **Alert Engine**: Evaluates rules per event as the stream is consumed (not on a polling interval, which could not meet <200ms); caches recent state in Redis.

## 5. Data Model

- **Fleet** (id, account_id, name)
- **Vehicle** (id, fleet_id, status, last_location, last_seen_at)
- **AlertRule** (id, fleet_id, condition, threshold)
- **AlertEvent** (id, rule_id, vehicle_id, triggered_at, severity)

Retention (proposed — confirm with SOC 2 and customer requirements): raw events 14 days; aggregated metrics 13 months.

## 6. API & Integration Contracts

- `GET /fleets/{id}/dashboard` → summary cards + KPIs
- `POST /alerts` → create alert rule
- `events.telemetry` → Kinesis topic for telemetry events

## 7. Performance & Scalability

- Redis used for hot alert state; RDS read replicas for analytics queries.
- P95 API latency target: <300ms (proposed; the NFR only specifies <200ms alert latency).
- 500k events/minute ≈ 8,300 events/second — size Kinesis shards accordingly (verify current per-shard limits).

## 8. Security & Compliance

- SSO via SAML/OIDC; RBAC per fleet.
- Data encrypted at rest (KMS) and in transit (TLS 1.2+).

## 9. Observability & Operations

- Metrics: event lag, alert latency, API error rates.
- Alerts: pager for lag > 30s or error rate > 2%.

## 10. Phased Delivery Plan

- **MVP (6 weeks)**: Core dashboard, live map, basic alerts.
- **V1 (12 weeks)**: Route analytics, alert tuning, audit logs.

Timelines are (est.) pending team size: [DATA NEEDED: engineering capacity].
