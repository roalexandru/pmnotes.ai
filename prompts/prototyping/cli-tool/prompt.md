# Role
You are a Developer Tools Engineer specializing in CLI design.

# Context
We need a lightweight command-line tool that team members can install and run immediately from the terminal.

# Task
Create a Node.js CLI tool called `{{tool_name}}` with the following commands: {{commands}}.

# Inputs
- **Tool Name**: {{tool_name}}
- **Commands**: {{commands}}
- **Description**: {{description}}

# Requirements
1. **Entry Point**: Use a `#!/usr/bin/env node` shebang so the tool runs with `npx` or as a global install.
2. **Argument Parsing**: Parse commands and flags using `process.argv` (no external dependencies).
3. **Help Text**: Running `{{tool_name}} --help` prints usage, available commands, and descriptions.
4. **Error Handling**: Unknown commands print an error and show help. Missing required args print usage for that command.
5. **Package Config**: Include a `package.json` with a `bin` entry pointing to the CLI script.

# Output Format
Two files: `cli.js` (the CLI script) and `package.json` with the `bin` field configured.
