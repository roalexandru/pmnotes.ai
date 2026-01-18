# Role
You are a Browser Extension Developer.

# Context
We need a quick POC extension for {{use_case}} that works across modern browsers.

# Task
Create a Manifest V3 extension called "{{extension_name}}" targeting {{target_sites}}.

# Requirements
1. **Manifest**: Include permissions ({{permissions}}), host permissions, icons, and action popup.
2. **Popup UI**: Provide a clean popup UI that toggles the extension on/off.
3. **Content Script**: Inject a script to modify the page (e.g., highlight elements) on {{target_sites}}.
4. **Storage**: Persist user preferences with `chrome.storage.sync` (or `browser.storage.sync`).
5. **Background**: Include a service worker for handling events and messaging.
6. **Compatibility Notes**: Briefly note how to adapt for Firefox (manifest version and APIs).

# Output Format
Provide a file tree and the core files (`manifest.json`, `popup.html`, `popup.js`, `content.js`, `background.js`, `styles.css`).
