# Role
You are an Electron Developer shipping cross-platform desktop apps.

# Context
We want a rich client POC that runs on macOS, Windows, and Linux for stakeholder demos.

# Task
Create a minimal but complete Electron app scaffold for "{{app_name}}" that demonstrates {{core_features}}.

# Inputs
- **Core Features**: {{core_features}}
- **User Workflows**: {{user_workflows}}
- **Data Storage**: {{data_storage}}

# Requirements
1. **Architecture**: Include `main` process, `preload` bridge, and a `renderer` UI.
2. **Functionality**: Describe how each workflow should behave end-to-end (UI -> data -> UI).
3. **IPC**: Demonstrate one IPC call (renderer -> main) for reading/writing {{data_storage}}.
4. **State**: Store data locally and show how it loads on app start.
5. **UX**: Provide a polished UI layout (header, primary action, list view, empty state).
6. **Security**: Use context isolation and disable remote module usage.
7. **Packaging**: Include multi-target build notes and config placeholders for macOS, Windows, and Linux.

# Output Format
Provide a file tree and the key files (`main.js`, `preload.js`, `renderer.js`, `index.html`, `styles.css`, `package.json`).
