### File tree

```text
tabtamer/
├── manifest.json
├── popup.html
├── popup.js
├── content.js
├── background.js
├── styles.css
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

### `manifest.json`

```json
{
  "manifest_version": 3,
  "name": "TabTamer",
  "version": "0.1.0",
  "description": "Highlight overdue tasks in Asana and keep tabs tidy.",
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  "action": {
    "default_popup": "popup.html",
    "default_title": "TabTamer",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png"
    }
  },
  "permissions": ["storage", "tabs", "scripting"],
  "host_permissions": ["https://app.asana.com/*"],
  "content_scripts": [
    {
      "matches": ["https://app.asana.com/*"],
      "js": ["content.js"],
      "run_at": "document_idle"
    }
  ],
  "background": {
    "service_worker": "background.js"
  }
}
```

### `popup.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TabTamer</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <h1>TabTamer</h1>
  <p>Highlight overdue tasks in Asana.</p>
  <label class="toggle">
    <input id="toggle" type="checkbox" />
    <span>Enable highlights</span>
  </label>
  <script src="popup.js"></script>
</body>
</html>
```

### `styles.css`

```css
body {
  font-family: system-ui, sans-serif;
  min-width: 220px;
  padding: 16px;
}

.toggle {
  display: flex;
  gap: 8px;
  align-items: center;
}
```

### `popup.js`

```js
const toggle = document.getElementById('toggle');

chrome.storage.sync.get(['enabled'], ({ enabled }) => {
  toggle.checked = enabled ?? true;
});

toggle.addEventListener('change', async () => {
  await chrome.storage.sync.set({ enabled: toggle.checked });
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) {
    // Fails harmlessly on tabs where the content script isn't injected
    chrome.tabs.sendMessage(tab.id, { type: 'toggle', enabled: toggle.checked }).catch(() => {});
  }
});
```

### `background.js`

```js
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ enabled: true });
});
```

### `content.js`

```js
const HIGHLIGHT_CLASS = 'tabtamer-highlight';
// Placeholder selector: inspect the target site's DOM and replace with the real
// overdue-task selector (it changes when the site ships UI updates).
const OVERDUE_SELECTOR = '[data-overdue="true"]';

// Inject highlight styles into the page (styles.css only applies to the popup)
const style = document.createElement('style');
style.textContent = `.${HIGHLIGHT_CLASS} { outline: 2px solid #f97316; background: rgba(249, 115, 22, 0.12); }`;
document.head.appendChild(style);

function applyHighlights(enabled) {
  const overdueRows = document.querySelectorAll(OVERDUE_SELECTOR);
  overdueRows.forEach((row) => {
    row.classList.toggle(HIGHLIGHT_CLASS, enabled);
  });
}

chrome.storage.sync.get(['enabled'], ({ enabled }) => {
  applyHighlights(enabled ?? true);
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'toggle') {
    applyHighlights(message.enabled);
  }
});
```

### Firefox Notes

- Firefox supports Manifest V3 but runs background code as an event page: replace `"service_worker": "background.js"` with `"scripts": ["background.js"]` (or ship both keys and let each browser pick).
- Add `"browser_specific_settings": { "gecko": { "id": "tabtamer@example.com" } }` to the manifest.
- Firefox accepts the `chrome.*` namespace; use `browser.*` if you want promise-based APIs everywhere.
- In Firefox MV3, host permissions are opt-in: users may need to grant site access from the extensions menu.
