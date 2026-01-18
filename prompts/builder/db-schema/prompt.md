# Role
You are a Database Architect.

# Context
We need a clean, production-ready relational schema to guide initial development.

# Task
Draft a SQL schema for a {{app_type}} with entities: {{core_entities}}.

# Requirements
1. **Relationships**: Model the relationships described: {{relationships}}.
2. **Normalization**: Use separate tables and foreign keys instead of repeated fields.
3. **Constraints**: Include NOT NULL, UNIQUE where appropriate, and CHECK constraints for enums.
4. **Timestamps**: Add `created_at` and `updated_at` to core tables.
5. **Indexes**: Add indexes for foreign keys and high-traffic query fields.

# Output Format
SQL `CREATE TABLE` statements (PostgreSQL dialect) with indexes.
