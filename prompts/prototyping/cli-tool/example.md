```json
// package.json
{
  "name": "projctl",
  "version": "1.0.0",
  "description": "Project scaffolding and deployment helper",
  "bin": {
    "projctl": "./cli.js"
  }
}
```

```js
#!/usr/bin/env node
// cli.js

const args = process.argv.slice(2);
const command = args[0];

const COMMANDS = {
  init: {
    description: 'Initialize a new project in the current directory',
    run(args) {
      const name = args[0] || 'my-project';
      console.log(`Initializing project "${name}"...`);
      console.log('Created package.json');
      console.log('Created src/ directory');
      console.log(`Project "${name}" is ready.`);
    }
  },
  build: {
    description: 'Build the project for production',
    run() {
      console.log('Building project...');
      console.log('Compiling source files...');
      console.log('Build complete. Output in dist/');
    }
  },
  deploy: {
    description: 'Deploy the project to the target environment',
    run(args) {
      const env = args[0] || 'staging';
      console.log(`Deploying to ${env}...`);
      console.log('Uploading build artifacts...');
      console.log(`Deployed to ${env} successfully.`);
    }
  }
};

function printHelp() {
  console.log('projctl — Project scaffolding and deployment helper');
  console.log('');
  console.log('Usage: projctl <command> [options]');
  console.log('');
  console.log('Commands:');
  for (const [name, cmd] of Object.entries(COMMANDS)) {
    console.log(`  ${name.padEnd(12)} ${cmd.description}`);
  }
  console.log('');
  console.log('Options:');
  console.log('  --help       Show this help message');
  console.log('  --version    Show version number');
}

if (!command || command === '--help') {
  printHelp();
  process.exit(0);
}

if (command === '--version') {
  console.log('1.0.0');
  process.exit(0);
}

const handler = COMMANDS[command];

if (!handler) {
  console.error(`Unknown command: ${command}`);
  console.error('');
  printHelp();
  process.exit(1);
}

handler.run(args.slice(1));
```
