# File Tree
tabtamer/
├── manifest.json
├── popup.html
├── popup.js
├── content.js
├── background.js
└── styles.css

# manifest.json
{
  "manifest_version": 3,
  "name": "TabTamer",
  "version": "0.1.0",
  "description": "Highlight overdue tasks in Asana and keep tabs tidy.",
  "action": {
    "default_popup": "popup.html",
    "default_title": "TabTamer"
  },
  "permissions": ["storage", "tabs", "scripting"],
  "host_permissions": ["https://app.asana.com/*"],
  "background": {
    "service_worker": "background.js"
  }
}

# popup.html
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

# styles.css
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

# popup.js
const toggle = document.getElementById('toggle');

chrome.storage.sync.get(['enabled'], ({ enabled }) => {
  toggle.checked = enabled ?? true;
});

toggle.addEventListener('change', async () => {
  await chrome.storage.sync.set({ enabled: toggle.checked });
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) {
    chrome.tabs.sendMessage(tab.id, { type: 'toggle', enabled: toggle.checked });
  }
});

# background.js
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ enabled: true });
});

# content.js
const HIGHLIGHT_CLASS = 'tabtamer-highlight';

function applyHighlights(enabled) {
  const overdueRows = document.querySelectorAll('[data-overdue="true"]');
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

# Firefox Notes
- Replace `chrome` with `browser` and update permissions if needed.
- Firefox currently supports Manifest V3 with minor API differences.
