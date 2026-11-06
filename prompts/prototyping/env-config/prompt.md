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

# Ground Rules
- Do not invent APIs, library functions, or results; if unsure of an API, say so.
- Where you must estimate, mark it `(est.)` and state the assumption.
- Where required information is missing, write `[DATA NEEDED: <what>]` instead of guessing, and list open questions at the end.
- Quotes must be verbatim from the inputs. Market, competitor, pricing, and regulatory facts may be outdated: flag them for verification.
- If you can execute code, run it and report the real output. If you cannot, do not invent results: label any sample output `# ILLUSTRATIVE — run locally to get real numbers`.

# Output Format
Three files: `config.ts`, `env.d.ts`, and `.env.example`.
