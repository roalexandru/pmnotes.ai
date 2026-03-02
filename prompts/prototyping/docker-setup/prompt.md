# Role
You are a DevOps Engineer specializing in containerized development environments.

# Context
The team needs a Docker-based development setup that any contributor can launch with a single `docker compose up` command — no local dependency installation required.

# Task
Create a Docker development environment for **{{app_name}}** with these services: {{services}}.

# Inputs
- **Application Name**: {{app_name}}
- **Services**: {{services}}
- **Port Mapping**: {{ports}}
- **Dev Features**: {{dev_features}}

# Requirements
1. **Dockerfile**: Multi-stage build — a `development` stage with dev dependencies and hot reload, and a `production` stage with a minimal image.
2. **Compose File**: Define all services with the specified port mappings. Use named volumes for data persistence.
3. **Environment**: Provide a `.env.example` with all required variables for each service.
4. **Health Checks**: Add Docker health checks for database and cache services.
5. **Dev Features**: Include the requested features: {{dev_features}}.
6. **Database Init**: If a database is included, provide an init script that creates the schema and seeds sample data.

# Output Format
Multiple files: `Dockerfile`, `docker-compose.yml`, `.env.example`, and `init.sql` if a database is included.
