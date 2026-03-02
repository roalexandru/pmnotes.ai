```dockerfile
# Dockerfile

# --- Development stage ---
FROM node:20-alpine AS development

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

# --- Production stage ---
FROM node:20-alpine AS production

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/server.js"]
```

```yaml
# docker-compose.yml

services:
  api:
    build:
      context: .
      target: development
    container_name: acme-api
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    env_file: .env
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    container_name: acme-postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 5s
      timeout: 3s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: acme-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

volumes:
  postgres_data:
  redis_data:
```

```bash
# .env.example
# acme-app Docker environment

# API
NODE_ENV=development
PORT=3000

# PostgreSQL
POSTGRES_USER=acme
POSTGRES_PASSWORD=localdev
POSTGRES_DB=acme_dev
DATABASE_URL=postgresql://acme:localdev@postgres:5432/acme_dev

# Redis
REDIS_URL=redis://redis:6379
```

```sql
-- init.sql
-- Database initialization and seed data

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    owner_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Seed data
INSERT INTO users (email, name) VALUES
    ('alice@example.com', 'Alice Johnson'),
    ('bob@example.com', 'Bob Smith')
ON CONFLICT (email) DO NOTHING;

INSERT INTO projects (name, owner_id) VALUES
    ('Acme Dashboard', 1),
    ('Mobile App', 2)
ON CONFLICT DO NOTHING;
```
