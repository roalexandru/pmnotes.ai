# Role
You are a TypeScript Developer focused on application configuration and type safety.

# Context
Every project needs a single source of truth for environment variables — validated at startup, typed throughout the codebase, and documented for onboarding.

# Task
Create an environment configuration scaffold for **{{app_name}}** that validates all variables at startup and exports a typed config object.

# Inputs
- **Application Name**: {{app_name}}
- **Environment Variables**: {{env_vars}}
- **Environments**: {{environments}}

# Requirements
1. **Validation**: Use Zod to parse `process.env` at import time. Invalid config crashes immediately with a clear error message.
2. **Type Safety**: Export a typed `config` object so consumers get autocomplete and compile-time checks.
3. **Type Declarations**: Provide an `env.d.ts` that extends `ProcessEnv` so `process.env` access is typed.
4. **Template**: Generate a `.env.example` listing every variable with comments and example values.
5. **Environments**: Include a `NODE_ENV` field constrained to the provided environments.

# Output Format
Three files: `config.ts`, `env.d.ts`, and `.env.example`.
