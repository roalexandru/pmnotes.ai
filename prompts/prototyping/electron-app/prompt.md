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
6. **Security**: Set `contextIsolation: true`, `sandbox: true`, and `nodeIntegration: false`; add a strict Content-Security-Policy; expose only narrow functions via `contextBridge`; validate all IPC input (and the sender) in the main process.
7. **Packaging**: Include multi-target build notes and config placeholders for macOS, Windows, and Linux.

# Ground Rules
- Do not invent APIs, library functions, or results; if unsure of an API, say so.
- Where you must estimate, mark it `(est.)` and state the assumption.
- Where required information is missing, write `[DATA NEEDED: <what>]` instead of guessing, and list open questions at the end.
- Quotes must be verbatim from the inputs. Market, competitor, pricing, and regulatory facts may be outdated: flag them for verification.
- If you can execute code, run it and report the real output. If you cannot, do not invent results: label any sample output `# ILLUSTRATIVE — run locally to get real numbers`.

# Output Format
Provide a file tree and the key files (`main.js`, `preload.js`, `renderer.js`, `index.html`, `styles.css`, `package.json`).
