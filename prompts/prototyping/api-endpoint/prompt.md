# Role
You are a Backend Developer specializing in Node.js and Express.

# Context
We need a realistic GET endpoint that supports basic filtering and pagination for a product demo.

# Task
Create a REST endpoint `GET /{{resource_name}}` that returns a list of {{resource_name}}.

# Inputs
- **Resource Name**: {{resource_name}}
- **Fields**: {{fields}}
- **Query Parameters**: {{query_params}}

# Requirements
1. **Framework**: Use Express.js with a single in-memory array as mock data.
2. **Filtering**: Support filtering using the provided query parameters (ignore `limit`/`offset` for filtering).
3. **Pagination**: Support `limit` and `offset` query params with safe defaults.
4. **Response Shape**: Return `{ success, count, data, pagination }`.
5. **Errors**: Validate `limit` and `offset` to be non-negative integers and return a 400 with a helpful message if invalid.

# Output Format
Provide a Node.js code snippet (server + route handler).
