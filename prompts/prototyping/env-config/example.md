```ts
// config.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().int().positive().default(3000),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment configuration:');
  for (const issue of parsed.error.issues) {
    console.error(`  ${issue.path.join('.')}: ${issue.message}`);
  }
  process.exit(1);
}

export const config = parsed.data;
export type Config = z.infer<typeof envSchema>;
```

```ts
// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'staging' | 'production';
    DATABASE_URL: string;
    PORT?: string;
    LOG_LEVEL?: 'debug' | 'info' | 'warn' | 'error';
  }
}
```

```bash
# .env.example
# acme-api environment configuration

# Application environment
NODE_ENV=development

# Database connection string (required)
DATABASE_URL=postgresql://user:password@localhost:5432/acme

# Server port (default: 3000)
PORT=3000

# Log level: debug, info, warn, error (default: info)
LOG_LEVEL=info
```
