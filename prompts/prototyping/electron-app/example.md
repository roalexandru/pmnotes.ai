# File Tree
focusflow/
├── package.json
├── main.js
├── preload.js
└── renderer/
    ├── index.html
    ├── renderer.js
    └── styles.css

# Workflow Notes
- **Create a task**: User clicks "Add Task" → renderer sends updated list via IPC → main persists JSON → list re-renders.
- **Start a focus session**: User clicks the timer card → renderer starts local countdown and updates UI.
- **Review daily summary**: Renderer computes totals from stored tasks and renders a simple summary row.

# package.json
{
  "name": "focusflow",
  "version": "0.1.0",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "pack": "electron-builder --dir",
    "dist": "electron-builder"
  },
  "devDependencies": {
    "electron": "^28.2.0",
    "electron-builder": "^24.13.2"
  },
  "build": {
    "appId": "com.focusflow.app",
    "productName": "FocusFlow",
    "files": ["main.js", "preload.js", "renderer/**"],
    "mac": { "target": "dmg" },
    "win": { "target": "nsis" },
    "linux": { "target": "AppImage" }
  }
}

# main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const dataPath = () => path.join(app.getPath('userData'), 'focusflow.json');

function readData() {
  try {
    return JSON.parse(fs.readFileSync(dataPath(), 'utf-8'));
  } catch (error) {
    return { tasks: [] };
  }
}

function writeData(payload) {
  fs.writeFileSync(dataPath(), JSON.stringify(payload, null, 2));
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

app.whenReady().then(createWindow);

ipcMain.handle('tasks:load', () => readData());
ipcMain.handle('tasks:save', (event, payload) => {
  writeData(payload);
  return { ok: true };
});

# preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('focusflowAPI', {
  loadTasks: () => ipcRenderer.invoke('tasks:load'),
  saveTasks: (payload) => ipcRenderer.invoke('tasks:save', payload)
});

# renderer/index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>FocusFlow</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <header>
    <h1>FocusFlow</h1>
    <button id="addTask">Add Task</button>
  </header>
  <main>
    <section class="panel" id="timerPanel">
      <h2>Today's Focus</h2>
      <p class="subtext">Plan your next session and stay in flow.</p>
      <div class="timer" id="timerDisplay">25:00</div>
      <button id="startTimer">Start Session</button>
    </section>
    <section class="panel">
      <h2>Task List</h2>
      <ul id="taskList"></ul>
      <p id="emptyState">No tasks yet. Add your first task.</p>
      <div class="summary" id="summary"></div>
    </section>
  </main>
  <script src="renderer.js"></script>
</body>
</html>

# renderer/styles.css
:root {
  --bg: #0f172a;
  --panel: #1e293b;
  --text: #e2e8f0;
  --accent: #38bdf8;
}

body {
  margin: 0;
  font-family: "Inter", system-ui, sans-serif;
  background: var(--bg);
  color: var(--text);
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

header button,
#startTimer {
  background: var(--accent);
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

main {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  padding: 32px;
}

.panel {
  background: var(--panel);
  padding: 24px;
  border-radius: 16px;
}

.timer {
  margin-top: 16px;
  font-size: 48px;
  font-weight: 700;
}

.summary {
  margin-top: 12px;
  font-size: 14px;
  color: rgba(226, 232, 240, 0.8);
}

# renderer/renderer.js
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const addTask = document.getElementById('addTask');
const summary = document.getElementById('summary');
const startTimer = document.getElementById('startTimer');
const timerDisplay = document.getElementById('timerDisplay');

let tasks = [];
let timerSeconds = 25 * 60;
let timerId = null;

function renderTasks() {
  taskList.innerHTML = '';
  if (tasks.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
  }

  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.textContent = task.title;
    taskList.appendChild(li);
  });

  summary.textContent = `Daily summary: ${tasks.length} tasks planned.`;
}

function renderTimer() {
  const minutes = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
  const seconds = String(timerSeconds % 60).padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

function startSession() {
  if (timerId) return;
  timerId = setInterval(() => {
    timerSeconds = Math.max(0, timerSeconds - 1);
    renderTimer();
    if (timerSeconds === 0) {
      clearInterval(timerId);
      timerId = null;
    }
  }, 1000);
}

async function load() {
  const data = await window.focusflowAPI.loadTasks();
  tasks = data.tasks || [];
  renderTasks();
}

addTask.addEventListener('click', async () => {
  tasks.push({ title: `Focus session ${tasks.length + 1}` });
  await window.focusflowAPI.saveTasks({ tasks });
  renderTasks();
});

startTimer.addEventListener('click', startSession);

renderTimer();
load();

# Packaging Notes
- Run `npm install` then `npm run start` for local dev.
- Use `npm run dist` to create installers for macOS, Windows, and Linux.
- Update `build` targets in package.json per platform requirements.
