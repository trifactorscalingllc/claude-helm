const { app, BrowserWindow, ipcMain, dialog, shell, clipboard } = require('electron');
const path = require('path');
const fs = require('fs');
const fsp = fs.promises;
const { spawn, spawnSync } = require('child_process');
const { Indexer } = require('./indexer');
const { autoUpdater } = require('electron-updater');

const HOME = app.getPath('home');
const CONFIG_PATH = path.join(app.getPath('userData'), 'launcher-config.json');
const DEFAULT_ROOT = path.join(HOME, 'projects');
const CLAUDE_PROJECTS_DIR = path.join(HOME, '.claude', 'projects');
const CLAUDE_JSON = path.join(HOME, '.claude.json');

const DEFAULTS = {
  root: DEFAULT_ROOT,
  pinned: [],
  launch: { model: 'default', skipPermissions: false, continue: false },
  apiKey: '',
  aiSummaries: false,
  theme: 'light',
  terminalCommand: '', // optional custom terminal template with {dir} and {cmd}
  autoTrust: false,    // off by default — opt-in (writes hasTrustDialogAccepted)
  onboarded: false,    // first-run setup completed
};

const AI_CACHE_PATH = path.join(app.getPath('userData'), 'ai-summaries.json');

let mainWindow = null;

// Single-instance lock — prevents multiple copies (which made updates fail to auto-close).
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

const indexer = new Indexer(
  CLAUDE_PROJECTS_DIR,
  path.join(app.getPath('userData'), 'metrics-index.json')
);
let indexing = false;

async function runIndex() {
  if (indexing) return;
  indexing = true;
  try {
    await indexer.indexAll();
  } catch (err) {
    console.error('index error:', err.message);
  } finally {
    indexing = false;
  }
}

// ---------- config ----------

function loadConfig() {
  try {
    const parsed = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    // Migration: a config file already exists → this is a returning user.
    // Don't re-onboard them just because the `onboarded` flag was added later.
    if (!('onboarded' in parsed)) parsed.onboarded = true;
    return {
      ...DEFAULTS,
      ...parsed,
      launch: { ...DEFAULTS.launch, ...(parsed.launch || {}) },
    };
  } catch {
    return { ...DEFAULTS }; // no config file → genuine first run → onboarded:false
  }
}

function saveConfig(cfg) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2));
}

// ---------- window ----------

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 760,
    minWidth: 760,
    minHeight: 520,
    backgroundColor: '#f5f4ee',
    title: 'Claude Helm',
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  mainWindow.removeMenu();
  mainWindow.loadFile('index.html');
  mainWindow.on('closed', () => { mainWindow = null; });
}

// ---- auto-update (electron-updater → GitHub Releases) ----
function sendUpdate(state, info) {
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('update-status', { state, info });
}
function setupAutoUpdate() {
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.on('checking-for-update', () => sendUpdate('checking'));
  autoUpdater.on('update-available', (info) => sendUpdate('available', { version: info.version }));
  autoUpdater.on('update-not-available', () => sendUpdate('current'));
  autoUpdater.on('download-progress', (p) => sendUpdate('downloading', { percent: Math.round(p.percent) }));
  autoUpdater.on('update-downloaded', (info) => sendUpdate('ready', { version: info.version }));
  autoUpdater.on('error', (err) => sendUpdate('error', { message: String(err && err.message || err) }));
  // only check when packaged (dev builds have no update feed)
  if (app.isPackaged) {
    autoUpdater.checkForUpdates().catch(() => {});
    setInterval(() => autoUpdater.checkForUpdates().catch(() => {}), 6 * 60 * 60 * 1000); // every 6h
  }
}

ipcMain.handle('install-update', () => {
  try {
    // close windows first so no renderer holds files, then silent install + relaunch
    BrowserWindow.getAllWindows().forEach((w) => { try { w.removeAllListeners('close'); w.close(); } catch {} });
    setImmediate(() => autoUpdater.quitAndInstall(true, true)); // isSilent=true → NSIS /S, force-closes; isForceRunAfter=true
  } catch {}
});
ipcMain.handle('check-update', () => { if (app.isPackaged) autoUpdater.checkForUpdates().catch(() => {}); });

app.whenReady().then(() => {
  createWindow();
  startWatchers();
  setupAutoUpdate();
  indexer.load();
  // backfill, then tell the renderer to refresh with full data
  runIndex().then(() => {
    if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('fs-changed', 'claude');
  });
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ---------- stats ----------

const statsCache = new Map(); // path -> { data, time }
const STATS_TTL = 20000;

const SKIP_SIZE_DIRS = new Set(['.git']); // counted in "heavy", flagged separately

function claudeDirFor(projectPath) {
  const encoded = projectPath.replace(/[\\/:]/g, '-');
  return path.join(CLAUDE_PROJECTS_DIR, encoded);
}

async function claudeStats(projectPath) {
  const dir = claudeDirFor(projectPath);
  let sessions = 0;
  let bytes = 0;
  let lastActive = 0;
  try {
    const entries = await fsp.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      if (e.isFile() && e.name.endsWith('.jsonl')) {
        sessions++;
        try {
          const st = await fsp.stat(path.join(dir, e.name));
          bytes += st.size;
          if (st.mtimeMs > lastActive) lastActive = st.mtimeMs;
        } catch {}
      }
    }
  } catch {}
  return { sessions, claudeBytes: bytes, lastActive };
}

async function dirStats(dir) {
  let files = 0;
  let bytes = 0;
  let dirs = 0;
  let hasNodeModules = false;
  let capped = false;
  const stack = [dir];
  while (stack.length) {
    const cur = stack.pop();
    let entries;
    try {
      entries = await fsp.readdir(cur, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      const full = path.join(cur, e.name);
      if (e.isDirectory()) {
        if (e.name === 'node_modules') hasNodeModules = true;
        dirs++;
        stack.push(full);
      } else if (e.isFile()) {
        files++;
        try {
          bytes += (await fsp.stat(full)).size;
        } catch {}
      }
      if (files > 400000) {
        capped = true;
        return { files, bytes, dirs, hasNodeModules, capped };
      }
    }
  }
  return { files, bytes, dirs, hasNodeModules, capped };
}

async function projectStats(projectPath) {
  const cached = statsCache.get(projectPath);
  if (cached && Date.now() - cached.time < STATS_TTL) return cached.data;
  const [disk, claude] = await Promise.all([
    dirStats(projectPath),
    claudeStats(projectPath),
  ]);
  const data = { ...disk, ...claude };
  statsCache.set(projectPath, { data, time: Date.now() });
  return data;
}

// ---------- watchers ----------

let watchers = [];
let notifyTimer = null;

function notifyChanged(scope) {
  statsCache.clear();
  if (notifyTimer) clearTimeout(notifyTimer);
  notifyTimer = setTimeout(async () => {
    if (scope === 'claude') await runIndex(); // refresh metrics from new transcript lines
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('fs-changed', scope);
    }
  }, 1200);
}

function watchPath(target, scope) {
  try {
    const w = fs.watch(target, { recursive: true }, (_ev, file) => {
      if (file && /node_modules/.test(file)) return; // ignore dependency churn
      notifyChanged(scope);
    });
    w.on('error', () => {});
    watchers.push(w);
    return true;
  } catch {
    // fall back to non-recursive
    try {
      const w = fs.watch(target, () => notifyChanged(scope));
      w.on('error', () => {});
      watchers.push(w);
    } catch {}
    return false;
  }
}

function startWatchers() {
  watchers.forEach((w) => { try { w.close(); } catch {} });
  watchers = [];
  const root = loadConfig().root;
  if (fs.existsSync(root)) watchPath(root, 'projects');
  if (fs.existsSync(CLAUDE_PROJECTS_DIR)) watchPath(CLAUDE_PROJECTS_DIR, 'claude');
}

// ---------- launch ----------

function buildClaudeCommand(launch) {
  const parts = ['claude'];
  if (launch.model && launch.model !== 'default') {
    parts.push('--model', launch.model);
  }
  if (launch.continue) parts.push('--continue');
  if (launch.skipPermissions) parts.push('--dangerously-skip-permissions');
  return parts.join(' ');
}

// Pre-mark a folder as trusted in ~/.claude.json so Claude Code never shows the
// "Do you trust the files in this folder?" prompt. Atomic write via temp + rename.
function trustProject(projectPath) {
  let data = {};
  try {
    data = JSON.parse(fs.readFileSync(CLAUDE_JSON, 'utf8'));
  } catch {
    // file missing or unreadable — start fresh
  }
  if (!data.projects || typeof data.projects !== 'object') data.projects = {};
  const existing = data.projects[projectPath] || {};
  data.projects[projectPath] = {
    allowedTools: [],
    mcpContextUris: [],
    enabledMcpjsonServers: [],
    disabledMcpjsonServers: [],
    hasClaudeMdExternalIncludesApproved: false,
    hasClaudeMdExternalIncludesWarningShown: false,
    projectOnboardingSeenCount: 0,
    ...existing,
    hasTrustDialogAccepted: true,
  };
  try {
    const tmp = CLAUDE_JSON + '.launcher.tmp';
    fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
    fs.renameSync(tmp, CLAUDE_JSON);
  } catch (err) {
    // non-fatal: worst case Claude shows its normal trust prompt
    console.error('trustProject failed:', err.message);
  }
}

// --- cross-platform terminal launch ---
function cmdExists(bin) {
  try {
    const finder = process.platform === 'win32' ? 'where' : 'which';
    const r = spawnSync(finder, [bin], { stdio: ['ignore', 'pipe', 'ignore'] });
    return r.status === 0;
  } catch { return false; }
}
function shQuote(s) { return "'" + String(s).replace(/'/g, "'\\''") + "'"; }            // POSIX
function aplQuote(s) { return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"'; } // AppleScript
function spawnDetached(bin, args) {
  const child = spawn(bin, args, { detached: true, stdio: 'ignore' });
  child.unref();
}

// Open a terminal in projectPath running cmd. Returns {ok} or {ok:false, error, command}.
function spawnTerminal(projectPath, cmd, custom) {
  const platform = process.platform;
  const fallbackCmd = `cd "${projectPath}" && ${cmd}`;

  // advanced: user-supplied template with {dir} / {cmd}
  if (custom && custom.trim()) {
    try {
      const filled = custom.replace(/\{dir\}/g, projectPath).replace(/\{cmd\}/g, cmd);
      if (platform === 'win32') spawnDetached('cmd.exe', ['/c', filled]);
      else spawnDetached('/bin/sh', ['-c', filled]);
      return { ok: true };
    } catch (e) { return { ok: false, error: e.message, command: fallbackCmd }; }
  }

  try {
    if (platform === 'win32') {
      if (cmdExists('wt')) {
        spawnDetached('wt.exe', ['-d', projectPath, 'powershell', '-NoExit', '-Command', cmd]);
      } else {
        spawnDetached('cmd.exe', ['/c', 'start', '', 'powershell', '-NoExit', '-Command',
          `Set-Location -LiteralPath '${projectPath.replace(/'/g, "''")}'; ${cmd}`]);
      }
      return { ok: true };
    }

    if (platform === 'darwin') {
      const useITerm = fs.existsSync('/Applications/iTerm.app');
      const inner = `cd ${shQuote(projectPath)} && ${cmd}`;
      const script = useITerm
        ? `tell application "iTerm"\n activate\n set w to (create window with default profile)\n tell current session of w to write text ${aplQuote(inner)}\nend tell`
        : `tell application "Terminal"\n activate\n do script ${aplQuote(inner)}\nend tell`;
      spawnDetached('osascript', ['-e', script]);
      return { ok: true };
    }

    // linux / other unix — try known terminal emulators
    const sh = process.env.SHELL || 'bash';
    const inner = `cd ${shQuote(projectPath)} && ${cmd}; exec ${sh}`;
    const candidates = [
      ['gnome-terminal', ['--', 'bash', '-c', inner]],
      ['konsole', ['-e', 'bash', '-c', inner]],
      ['xfce4-terminal', ['-e', `bash -c ${shQuote(inner)}`]],
      ['x-terminal-emulator', ['-e', 'bash', '-c', inner]],
      ['kitty', ['bash', '-c', inner]],
      ['alacritty', ['-e', 'bash', '-c', inner]],
      ['tilix', ['-e', 'bash', '-c', inner]],
      ['xterm', ['-e', 'bash', '-c', inner]],
    ];
    for (const [bin, args] of candidates) {
      if (cmdExists(bin)) { spawnDetached(bin, args); return { ok: true }; }
    }
    return { ok: false, error: 'No supported terminal emulator found', command: fallbackCmd };
  } catch (e) {
    return { ok: false, error: e.message, command: fallbackCmd };
  }
}

function openClaudeIn(projectPath) {
  const cfg = loadConfig();
  if (cfg.autoTrust) trustProject(projectPath); // opt-in only
  const cmd = buildClaudeCommand(cfg.launch);
  return spawnTerminal(projectPath, cmd, cfg.terminalCommand);
}

// ---------- IPC ----------

ipcMain.handle('app-version', () => app.getVersion());

ipcMain.handle('get-config', () => loadConfig());

ipcMain.handle('set-root', (_e, root) => {
  const cfg = loadConfig();
  cfg.root = root;
  saveConfig(cfg);
  startWatchers();
  return cfg;
});

ipcMain.handle('pick-root', async () => {
  const res = await dialog.showOpenDialog(mainWindow, {
    title: 'Choose your projects folder',
    properties: ['openDirectory'],
  });
  if (res.canceled || !res.filePaths[0]) return null;
  const cfg = loadConfig();
  cfg.root = res.filePaths[0];
  saveConfig(cfg);
  startWatchers();
  return cfg;
});

ipcMain.handle('set-launch', (_e, launch) => {
  const cfg = loadConfig();
  cfg.launch = { ...cfg.launch, ...launch };
  saveConfig(cfg);
  return cfg;
});

ipcMain.handle('toggle-pin', (_e, projectPath) => {
  const cfg = loadConfig();
  const i = cfg.pinned.indexOf(projectPath);
  if (i === -1) cfg.pinned.push(projectPath);
  else cfg.pinned.splice(i, 1);
  saveConfig(cfg);
  return cfg.pinned;
});

ipcMain.handle('list-projects', (_e, root) => {
  const dir = root || loadConfig().root;
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    return { error: `Can't read ${dir}: ${err.message}`, projects: [] };
  }
  const projects = entries
    .filter((d) => d.isDirectory() && !d.name.startsWith('.'))
    .map((d) => {
      const full = path.join(dir, d.name);
      let mtime = 0;
      let isGit = false;
      try {
        mtime = fs.statSync(full).mtimeMs;
        isGit = fs.existsSync(path.join(full, '.git'));
      } catch {}
      return { name: d.name, path: full, mtime, isGit, external: false };
    })
    .sort((a, b) => b.mtime - a.mtime);

  // Surface projects that have Claude activity but live outside the scanned folder,
  // so all your real Claude work shows up (most sessions run from cwd = home, etc.).
  const seen = new Set(projects.map((p) => p.path));
  const external = [];
  for (const cwd of indexer.projectPaths()) {
    if (seen.has(cwd) || !fs.existsSync(cwd)) continue;
    const m = indexer.metricsFor(cwd);
    if (!m || m.totals.sessions === 0) continue;
    let isGit = false;
    try { isGit = fs.existsSync(path.join(cwd, '.git')); } catch {}
    external.push({
      name: path.basename(cwd) || cwd,
      path: cwd,
      mtime: m.totals.lastTs || 0,
      isGit,
      external: true,
    });
  }
  external.sort((a, b) => b.mtime - a.mtime);

  return { error: null, projects, external };
});

ipcMain.handle('project-stats', (_e, projectPath) => projectStats(projectPath));

// ---- Transcript viewer: parse a session .jsonl into a readable conversation ----
function summarizeToolInput(b) {
  const i = b.input || {};
  if (i.file_path) return i.file_path;
  if (i.path) return i.path;
  if (i.command) return String(i.command).replace(/\s+/g, ' ').slice(0, 140);
  if (i.pattern) return String(i.pattern).slice(0, 100);
  if (i.query) return String(i.query).slice(0, 100);
  if (i.url) return String(i.url).slice(0, 120);
  if (i.description) return String(i.description).slice(0, 120);
  const s = JSON.stringify(i);
  return s.length > 2 ? s.slice(0, 120) : '';
}
function resultText(b) {
  const c = b.content;
  if (typeof c === 'string') return c;
  if (Array.isArray(c)) return c.map((x) => (x && x.text) || '').join('\n');
  return '';
}

ipcMain.handle('read-transcript', async (_e, { filePath, cwd, sessionId }) => {
  const file = filePath || (cwd && sessionId ? indexer.sessionFile(cwd, sessionId) : null);
  if (!file) return { error: 'Session file not found', messages: [] };
  let content;
  try { content = await fsp.readFile(file, 'utf8'); } catch (err) { return { error: err.message, messages: [] }; }

  const messages = [];
  let title = '';
  let project = cwd || '';
  const MAX = 2000;
  let truncated = false;

  for (const line of content.split('\n')) {
    if (!line.trim()) continue;
    let o;
    try { o = JSON.parse(line); } catch { continue; }
    if (o.aiTitle && !title) title = o.aiTitle;
    if (o.cwd && !project) project = o.cwd;
    if (o.type !== 'user' && o.type !== 'assistant') continue;
    const ts = o.timestamp ? Date.parse(o.timestamp) : 0;
    const c = o.message && o.message.content;
    const blocks = [];
    if (typeof c === 'string') {
      if (c.trim()) blocks.push({ kind: 'text', text: c.slice(0, 6000) });
    } else if (Array.isArray(c)) {
      for (const b of c) {
        if (!b) continue;
        if (b.type === 'text' && b.text && b.text.trim()) blocks.push({ kind: 'text', text: b.text.slice(0, 6000) });
        else if (b.type === 'tool_use') blocks.push({ kind: 'tool', name: b.name, summary: summarizeToolInput(b) });
        else if (b.type === 'tool_result') { const t = resultText(b).trim(); if (t) blocks.push({ kind: 'result', text: t.slice(0, 2000), error: !!b.is_error, truncated: t.length > 2000 }); }
        else if (b.type === 'thinking' && b.thinking && b.thinking.trim()) blocks.push({ kind: 'thinking', text: b.thinking.slice(0, 4000) });
      }
    }
    if (!blocks.length) continue;
    messages.push({ role: o.type, ts, blocks });
    if (messages.length >= MAX) { truncated = true; break; }
  }

  return { messages, title, project, sessionId: sessionId || '', file, truncated, error: null };
});

ipcMain.handle('project-metrics', (_e, projectPath) => {
  const m = indexer.metricsFor(projectPath);
  const series = indexer.dailySeries(projectPath, 14);
  const lastTs = m ? m.totals.lastTs : 0;
  const active = lastTs ? Date.now() - lastTs < 120000 : false; // active within 2 min
  if (!m) {
    return { sessions: 0, turns: 0, activeMs: 0, cost: 0, tokens: { in: 0, out: 0, cw: 0, cr: 0 }, lastTs: 0, models: {}, tools: {}, files: {}, series, active };
  }
  return { ...m.totals, series, active };
});

ipcMain.handle('project-detail', (_e, projectPath) => {
  const m = indexer.metricsFor(projectPath);
  return {
    totals: m ? m.totals : null,
    sessions: m ? m.sessions : {},
    series: indexer.dailySeries(projectPath, 30),
  };
});

ipcMain.handle('overview-metrics', (_e, days) => {
  const range = indexer.overviewFor(days || 7);
  return { range, heatDays: indexer.combinedDaily(30) };
});

ipcMain.handle('open-project', (_e, projectPath) => {
  try {
    return openClaudeIn(projectPath);
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

ipcMain.handle('copy-text', (_e, text) => { clipboard.writeText(String(text || '')); return true; });

ipcMain.handle('set-terminal', (_e, val) => {
  const cfg = loadConfig();
  cfg.terminalCommand = String(val || '').trim();
  saveConfig(cfg);
  return cfg.terminalCommand;
});

ipcMain.handle('create-project', (_e, { root, name }) => {
  const base = root || loadConfig().root;
  const clean = String(name || '').trim();
  if (!clean) return { ok: false, error: 'Project name is empty.' };
  if (/[<>:"/\\|?*]/.test(clean)) {
    return { ok: false, error: 'Name has invalid characters: < > : " / \\ | ? *' };
  }
  const full = path.join(base, clean);
  if (fs.existsSync(full)) return { ok: false, error: `"${clean}" already exists.` };
  try {
    fs.mkdirSync(full, { recursive: true });
    const launch = openClaudeIn(full);
    return { ok: true, path: full, launch };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

ipcMain.handle('open-in-explorer', (_e, projectPath) => {
  shell.openPath(projectPath);
});

// ---- Transcript search: scan all *.jsonl for a query, return matches w/ context ----
function entryText(o) {
  const parts = [];
  const c = o.message && o.message.content;
  if (typeof c === 'string') parts.push(c);
  else if (Array.isArray(c)) {
    for (const b of c) {
      if (!b) continue;
      if (b.type === 'text' && b.text) parts.push(b.text);
      else if (b.type === 'tool_use') {
        parts.push('[' + b.name + ']');
        if (b.input) parts.push(JSON.stringify(b.input).slice(0, 400));
      } else if (b.type === 'tool_result') {
        const tc = b.content;
        if (typeof tc === 'string') parts.push(tc.slice(0, 400));
        else if (Array.isArray(tc)) parts.push(tc.map((x) => (x && x.text) || '').join(' ').slice(0, 400));
      }
    }
  }
  return parts.join(' ');
}

function snippet(text, q, len = 160) {
  const i = text.toLowerCase().indexOf(q);
  if (i === -1) return text.slice(0, len).trim();
  const start = Math.max(0, i - Math.floor(len / 3));
  let s = text.slice(start, start + len).replace(/\s+/g, ' ').trim();
  if (start > 0) s = '… ' + s;
  return s;
}

// Search the memory/context files (what Claude remembers) for a query.
async function searchMemory(q) {
  const encoded = HOME.replace(/[\\/:]/g, '-');
  const memDir = path.join(CLAUDE_PROJECTS_DIR, encoded, 'memory');
  const out = [];
  let files;
  try { files = await fsp.readdir(memDir); } catch { return out; }
  for (const f of files) {
    if (!f.endsWith('.md') || f === 'MEMORY.md') continue;
    let text;
    try { text = await fsp.readFile(path.join(memDir, f), 'utf8'); } catch { continue; }
    if (!text.toLowerCase().includes(q)) continue;
    const mem = parseMemory(text);
    const hay = (mem.description + ' ' + mem.body).toLowerCase();
    if (!hay.includes(q)) continue;
    out.push({
      title: mem.description || mem.name || f,
      type: mem.type || (f.match(/^(feedback|project|reference|user)/) || [])[1] || 'other',
      body: mem.body,
      snippet: snippet((mem.body || mem.description || '').replace(/\s+/g, ' '), q, 200),
    });
  }
  // also the global CLAUDE.md
  try {
    const cm = await fsp.readFile(path.join(HOME, '.claude', 'CLAUDE.md'), 'utf8');
    if (cm.toLowerCase().includes(q)) {
      out.push({ title: 'Global instructions (CLAUDE.md)', type: 'instructions', body: cm.trim(), snippet: snippet(cm.replace(/\s+/g, ' '), q, 200) });
    }
  } catch {}
  return out;
}

ipcMain.handle('search-transcripts', async (_e, query, filters) => {
  const q = String(query || '').trim().toLowerCase();
  if (q.length < 2) return { results: [], contexts: [], scanned: 0, truncated: false };
  const f = filters || {};
  const roleFilter = f.role && f.role !== 'all' ? f.role : null;
  const projectFilter = f.project || null;
  const cutoff = f.sinceDays ? Date.now() - f.sinceDays * 86400000 : 0;
  // memory/context isn't conversation-scoped — show it only when not narrowing to one project
  const contexts = projectFilter ? [] : await searchMemory(q);
  const MAX = 80;
  const results = [];
  let scanned = 0;
  let truncated = false;
  let dirs;
  try { dirs = await fsp.readdir(CLAUDE_PROJECTS_DIR, { withFileTypes: true }); } catch { return { results, scanned, truncated }; }

  outer:
  for (const d of dirs) {
    if (!d.isDirectory()) continue;
    const sub = path.join(CLAUDE_PROJECTS_DIR, d.name);
    let files;
    try { files = await fsp.readdir(sub); } catch { continue; }
    for (const f of files) {
      if (!f.endsWith('.jsonl')) continue;
      scanned++;
      let content;
      try { content = await fsp.readFile(path.join(sub, f), 'utf8'); } catch { continue; }
      if (!content.toLowerCase().includes(q)) continue; // fast file-level prefilter
      const lines = content.split('\n');
      for (const line of lines) {
        if (!line || !line.toLowerCase().includes(q)) continue;
        let o;
        try { o = JSON.parse(line); } catch { continue; }
        if (o.type !== 'user' && o.type !== 'assistant') continue;
        if (roleFilter && o.type !== roleFilter) continue;
        if (projectFilter && o.cwd !== projectFilter) continue;
        const ts = o.timestamp ? Date.parse(o.timestamp) : 0;
        if (cutoff && ts < cutoff) continue;
        const text = entryText(o);
        if (!text.toLowerCase().includes(q)) continue;
        results.push({
          project: (o.cwd ? o.cwd.split(/[\\/]/).pop() : d.name),
          projectPath: o.cwd || '',
          sessionId: o.sessionId || '',
          file: path.join(sub, f),
          role: o.type,
          ts,
          snippet: snippet(text, q),
        });
        if (results.length >= MAX) { truncated = true; break outer; }
      }
    }
  }
  results.sort((a, b) => b.ts - a.ts);
  return { results, contexts, scanned, truncated };
});

// ---- project summary (offline heuristic: README/CLAUDE.md + git + latest session title) ----
const summaryCache = new Map();

function firstParagraph(text) {
  const lines = text.split(/\r?\n/);
  for (const raw of lines) {
    let l = raw.trim();
    if (!l) continue;
    if (/^[#>*\-=`|!\[]/.test(l)) {
      l = l.replace(/^#+\s*/, '').replace(/^[>*\-]\s*/, '').trim();
      if (!l || /^=+$/.test(l) || /^-+$/.test(l)) continue;
    }
    l = l.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_`]/g, '');
    if (l.length > 8) return l.length > 160 ? l.slice(0, 157) + '…' : l;
  }
  return '';
}

ipcMain.handle('project-summary', async (_e, projectPath) => {
  const cached = summaryCache.get(projectPath);
  if (cached && Date.now() - cached.time < 60000) return cached.data;

  let desc = '';
  for (const name of ['README.md', 'readme.md', 'CLAUDE.md', 'README.txt']) {
    try {
      const txt = await fsp.readFile(path.join(projectPath, name), 'utf8');
      desc = firstParagraph(txt);
      if (desc) break;
    } catch {}
  }

  const m = indexer.metricsFor(projectPath);
  const lastTitle = m && m.totals.lastTitle ? m.totals.lastTitle : '';

  let commit = '';
  await new Promise((resolve) => {
    try {
      const git = spawn('git', ['-C', projectPath, 'log', '-1', '--format=%s'], { stdio: ['ignore', 'pipe', 'ignore'] });
      let out = '';
      git.stdout.on('data', (d) => (out += d));
      git.on('close', () => { commit = out.trim().slice(0, 120); resolve(); });
      git.on('error', () => resolve());
    } catch { resolve(); }
  });

  const data = { desc, lastTitle, commit };
  summaryCache.set(projectPath, { data, time: Date.now() });
  return data;
});

// ---- AI summaries (Claude API, claude-opus-4-8) ----
const crypto = require('crypto');
let aiCache = null;
function loadAiCache() {
  if (aiCache) return aiCache;
  try { aiCache = JSON.parse(fs.readFileSync(AI_CACHE_PATH, 'utf8')); }
  catch { aiCache = {}; }
  return aiCache;
}
function saveAiCache() {
  try {
    const tmp = AI_CACHE_PATH + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(aiCache));
    fs.renameSync(tmp, AI_CACHE_PATH);
  } catch {}
}

function gitLog(projectPath, n) {
  return new Promise((resolve) => {
    try {
      const git = spawn('git', ['-C', projectPath, 'log', `-${n}`, '--format=%s'], { stdio: ['ignore', 'pipe', 'ignore'] });
      let out = '';
      git.stdout.on('data', (d) => (out += d));
      git.on('close', () => resolve(out.trim()));
      git.on('error', () => resolve(''));
    } catch { resolve(''); }
  });
}

async function buildContext(projectPath, name) {
  let readme = '';
  for (const f of ['README.md', 'readme.md', 'CLAUDE.md']) {
    try { readme = (await fsp.readFile(path.join(projectPath, f), 'utf8')).slice(0, 1400); if (readme) break; } catch {}
  }
  let files = [];
  try {
    files = (await fsp.readdir(projectPath, { withFileTypes: true }))
      .filter((d) => !d.name.startsWith('.') && d.name !== 'node_modules')
      .slice(0, 30).map((d) => d.name + (d.isDirectory() ? '/' : ''));
  } catch {}
  const commits = await gitLog(projectPath, 8);
  const m = indexer.metricsFor(projectPath);
  let titles = [];
  if (m) {
    titles = Object.values(m.sessions).filter((s) => s.title)
      .sort((a, b) => b.lastTs - a.lastTs).slice(0, 6).map((s) => s.title);
  }
  return { name, readme, files, commits, titles };
}

const aiQueue = [];
let aiActive = 0;
function pumpQueue() {
  while (aiActive < 2 && aiQueue.length) {
    const job = aiQueue.shift();
    aiActive++;
    job().finally(() => { aiActive--; pumpQueue(); });
  }
}
function enqueueAi(fn) {
  return new Promise((resolve) => {
    aiQueue.push(() => fn().then(resolve, () => resolve(null)));
    pumpQueue();
  });
}

async function generateAiSummary(projectPath, name, ctx, apiKey) {
  const Anthropic = require('@anthropic-ai/sdk');
  const client = new Anthropic({ apiKey });
  const parts = [`Project folder: ${name}`];
  if (ctx.readme) parts.push(`README / CLAUDE.md (excerpt):\n${ctx.readme}`);
  if (ctx.files.length) parts.push(`Top-level contents: ${ctx.files.join(', ')}`);
  if (ctx.commits) parts.push(`Recent git commits:\n${ctx.commits}`);
  if (ctx.titles.length) parts.push(`Recent Claude Code session titles:\n- ${ctx.titles.join('\n- ')}`);
  const resp = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 160,
    system: "You write one terse, factual sentence for a developer's project dashboard: what this project is and its current state. Output ONLY that sentence — no preamble, no markdown, no quotes. If the inputs are sparse, infer conservatively from the folder name and contents.",
    messages: [{ role: 'user', content: parts.join('\n\n') }],
  });
  const text = (resp.content.find((b) => b.type === 'text') || {}).text || '';
  return text.trim();
}

ipcMain.handle('ai-summary', async (_e, { projectPath, name }) => {
  const cfg = loadConfig();
  if (!cfg.apiKey || !cfg.aiSummaries) return { summary: null, reason: 'disabled' };
  const cache = loadAiCache();
  const ctx = await buildContext(projectPath, name);
  const hash = crypto.createHash('sha1')
    .update((ctx.readme || '') + '|' + (ctx.commits || '') + '|' + ctx.titles.join('|') + '|' + ctx.files.join(','))
    .digest('hex');
  const hit = cache[projectPath];
  if (hit && hit.hash === hash && hit.summary) return { summary: hit.summary, cached: true };
  try {
    const summary = await enqueueAi(() => generateAiSummary(projectPath, name, ctx, cfg.apiKey));
    if (summary) {
      cache[projectPath] = { summary, hash, time: Date.now() };
      saveAiCache();
      return { summary, cached: false };
    }
    return { summary: null, reason: 'empty' };
  } catch (err) {
    return { summary: null, reason: err.message };
  }
});

ipcMain.handle('set-api-key', (_e, key) => {
  const cfg = loadConfig();
  cfg.apiKey = String(key || '').trim();
  if (!cfg.apiKey) cfg.aiSummaries = false;
  saveConfig(cfg);
  return { apiKey: cfg.apiKey, aiSummaries: cfg.aiSummaries };
});

ipcMain.handle('set-ai-summaries', (_e, on) => {
  const cfg = loadConfig();
  cfg.aiSummaries = !!on && !!cfg.apiKey;
  saveConfig(cfg);
  return cfg.aiSummaries;
});

// ---- Context: what Claude remembers about you (memory files + CLAUDE.md) ----
function parseMemory(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { name: '', description: '', type: '', body: text.trim() };
  const fm = m[1];
  const body = m[2].trim();
  const pick = (re) => { const x = fm.match(re); return x ? x[1].trim().replace(/^["']|["']$/g, '') : ''; };
  return {
    name: pick(/^name:\s*(.+)$/m),
    description: pick(/^description:\s*(.+)$/m),
    type: pick(/^\s*type:\s*(.+)$/m),
    body,
  };
}

ipcMain.handle('get-context', async () => {
  const encoded = HOME.replace(/[\\/:]/g, '-');
  const memDir = path.join(CLAUDE_PROJECTS_DIR, encoded, 'memory');
  const groups = { user: [], feedback: [], project: [], reference: [], other: [] };
  let count = 0;
  try {
    const files = await fsp.readdir(memDir);
    for (const f of files) {
      if (!f.endsWith('.md') || f === 'MEMORY.md') continue;
      let text;
      try { text = await fsp.readFile(path.join(memDir, f), 'utf8'); } catch { continue; }
      const mem = parseMemory(text);
      let type = mem.type;
      if (!type) {
        const m = f.match(/^(feedback|project|reference|user)/);
        type = m ? m[1] : 'other';
      }
      if (!groups[type]) type = 'other';
      groups[type].push({ ...mem, file: f });
      count++;
    }
  } catch {}
  let claudeMd = '';
  try { claudeMd = await fsp.readFile(path.join(HOME, '.claude', 'CLAUDE.md'), 'utf8'); } catch {}
  return { groups, count, claudeMd, memDir };
});

ipcMain.handle('open-memory-folder', () => {
  const encoded = HOME.replace(/[\\/:]/g, '-');
  shell.openPath(path.join(CLAUDE_PROJECTS_DIR, encoded, 'memory'));
});

ipcMain.handle('set-auto-trust', (_e, on) => {
  const cfg = loadConfig();
  cfg.autoTrust = !!on;
  saveConfig(cfg);
  return cfg.autoTrust;
});

ipcMain.handle('complete-onboarding', (_e, patch) => {
  const cfg = loadConfig();
  if (patch && typeof patch === 'object') {
    if (patch.root) cfg.root = patch.root;
    if (patch.theme) cfg.theme = patch.theme === 'dark' ? 'dark' : 'light';
    if (typeof patch.autoTrust === 'boolean') cfg.autoTrust = patch.autoTrust;
  }
  cfg.onboarded = true;
  saveConfig(cfg);
  startWatchers();
  return cfg;
});

// Detect a Claude Code CLI install (soft check — the login shell may still resolve it).
ipcMain.handle('detect-claude', () => {
  if (cmdExists('claude')) return { found: true, via: 'PATH' };
  const candidates = process.platform === 'win32'
    ? [path.join(HOME, '.local', 'bin', 'claude.exe'), path.join(HOME, 'AppData', 'Local', 'Programs', 'claude', 'claude.exe')]
    : [path.join(HOME, '.local', 'bin', 'claude'), '/usr/local/bin/claude', '/opt/homebrew/bin/claude', path.join(HOME, '.claude', 'local', 'claude')];
  for (const c of candidates) { try { if (fs.existsSync(c)) return { found: true, via: c }; } catch {} }
  return { found: false };
});

// Does the projects root exist / is it readable?
ipcMain.handle('check-root', (_e, root) => {
  const dir = root || loadConfig().root;
  try { fs.accessSync(dir, fs.constants.R_OK); return { exists: true, path: dir }; }
  catch { return { exists: false, path: dir }; }
});

ipcMain.handle('create-root', (_e, root) => {
  const dir = root || loadConfig().root;
  try { fs.mkdirSync(dir, { recursive: true }); return { ok: true, path: dir }; }
  catch (err) { return { ok: false, error: err.message }; }
});

ipcMain.handle('set-theme', (_e, theme) => {
  const cfg = loadConfig();
  cfg.theme = theme === 'dark' ? 'dark' : 'light';
  saveConfig(cfg);
  return cfg.theme;
});
