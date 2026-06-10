const { app, BrowserWindow, ipcMain, dialog, shell, clipboard, Tray, Menu, nativeImage, Notification, safeStorage, globalShortcut } = require('electron');
const path = require('path');
const fs = require('fs');
const fsp = fs.promises;
const { spawn, spawnSync } = require('child_process');
const { Indexer } = require('./indexer');
const preview = require('./preview');
const agents = require('./agents');
const { autoUpdater } = require('electron-updater');

const HOME = app.getPath('home');
const HIDDEN_LAUNCH = process.argv.includes('--hidden'); // passed by login-item when "start hidden"
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
  accent: 'clay',      // accent palette: clay | lagoon | aubergine | jade
  hotkey: 'CommandOrControl+Shift+H', // global shortcut to summon the window
  hotkeyEnabled: true, // register the global shortcut
  lastSeenTs: 0,       // last time the window was focused/opened (for "while you were away")
  terminalCommand: '', // optional custom terminal template with {dir} and {cmd}
  autoTrust: false,    // off by default — opt-in (writes hasTrustDialogAccepted)
  onboarded: false,    // first-run setup completed
  budgetWeekly: 0,     // $ weekly budget (0 = off)
  budgetMonthly: 0,    // $ monthly budget (0 = off)
  notifications: true, // desktop notifications (session finished, budget)
  archived: [],        // project paths hidden from the dashboard
  tags: {},            // { projectPath: "client"|"personal"|... }
  clients: {},         // { projectPath: "Client name" } for the billable work-log
  routines: [],        // recurring `claude -p` tasks
  redact: false,       // blur descriptions for screenshots/screen-sharing (off by default)
  openAtLogin: false,  // launch Claude Helm when you log in
  startHidden: false,  // when launched at login, start minimized to the tray
  adminKey: '',        // optional Anthropic Admin API key for real billed usage
  notes: {},           // { projectPath: "freeform note" }
  previewTarget: 'window', // where Launch opens a running app/site: 'window' (in-app) | 'browser'
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

// ---------- formatting (shared with tray) ----------
function fmtDur(ms) {
  if (!ms) return '0m';
  const min = Math.round(ms / 60000);
  if (min < 60) return min + 'm';
  const h = Math.floor(min / 60), r = min % 60;
  return r && h < 10 ? `${h}h ${r}m` : `${h}h`;
}
function fmtMoney(n) {
  if (!n) return '$0';
  if (n < 0.01) return '<$0.01';
  if (n < 1000) return '$' + n.toFixed(2);
  return '$' + Math.round(n).toLocaleString();
}

// ---------- tray ----------
let tray = null;
function buildTray() {
  try {
    let img = nativeImage.createFromPath(path.join(__dirname, 'icon.png'));
    if (!img.isEmpty()) img = img.resize({ width: 16, height: 16 });
    tray = new Tray(img.isEmpty() ? nativeImage.createEmpty() : img);
    tray.setToolTip('Claude Helm');
    tray.on('click', showMainWindow);
    updateTray();
  } catch (err) { console.error('tray error:', err.message); }
}
function showMainWindow() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  } else { createWindow(); }
}

// ---- global shortcut to summon (or dismiss) the launcher from anywhere ----
function toggleMainWindow() {
  if (mainWindow && !mainWindow.isDestroyed() && mainWindow.isVisible() && mainWindow.isFocused()) {
    mainWindow.hide();
  } else {
    showMainWindow();
  }
}
function registerHotkey(cfg) {
  globalShortcut.unregisterAll();
  if (!cfg.hotkeyEnabled || !cfg.hotkey) return { ok: true, registered: false };
  try {
    const ok = globalShortcut.register(cfg.hotkey, toggleMainWindow);
    return { ok, registered: ok, error: ok ? '' : 'That shortcut is already taken by another app.' };
  } catch (err) {
    return { ok: false, registered: false, error: err.message || 'Invalid shortcut.' };
  }
}
function updateTray() {
  if (!tray) return;
  const today = indexer.spendInDays(1);
  const week = indexer.spendInDays(7);
  const active = indexer.activeProjects();
  const dot = active.length ? '🟢 ' : '';
  tray.setToolTip(`Claude Helm — today ${fmtDur(today.activeMs)} · ${fmtMoney(today.cost)}`);
  const menu = Menu.buildFromTemplate([
    { label: `${dot}Today: ${fmtDur(today.activeMs)} · ${fmtMoney(today.cost)}`, enabled: false },
    { label: `This week: ${fmtDur(week.activeMs)} · ${fmtMoney(week.cost)}`, enabled: false },
    ...(active.length ? [{ label: `Active now: ${active.map((a) => a.name).join(', ')}`, enabled: false }] : []),
    { type: 'separator' },
    { label: 'Open Claude Helm', click: showMainWindow },
    { label: 'Quit', click: () => { app.isQuitting = true; app.quit(); } },
  ]);
  tray.setContextMenu(menu);
}

// ---------- notifications ----------
function notify(title, body) {
  if (!loadConfig().notifications) return;
  if (!Notification.isSupported()) return;
  try {
    const n = new Notification({ title, body, icon: path.join(__dirname, 'icon.png') });
    n.on('click', showMainWindow);
    n.show();
  } catch {}
}

let notifiedBudget = {}; // key -> true, dedup per period+threshold
function weekKey() { const d = new Date(); const onejan = new Date(d.getFullYear(), 0, 1); const w = Math.ceil((((d - onejan) / 86400000) + onejan.getDay() + 1) / 7); return d.getFullYear() + '-W' + w; }
function monthKey() { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1); }

// session-end notifier: track which projects are "active", notify when one leaves the set.
let activeSet = {};
function checkActivity() {
  const active = indexer.activeProjects(150000); // active within 2.5 min
  const nowActive = {};
  active.forEach((a) => { nowActive[a.path] = a; });
  // ended = was active, now not
  for (const p in activeSet) {
    if (!nowActive[p]) {
      const m = indexer.metricsFor(p);
      const name = p.split(/[\\/]/).pop();
      notify('Session finished', `${name} — ${fmtDur(m ? m.totals.activeMs : 0)} total · ${fmtMoney(m ? m.totals.cost : 0)}`);
    }
  }
  activeSet = nowActive;
}

function checkBudgets() {
  const cfg = loadConfig();
  const checks = [
    { on: cfg.budgetWeekly > 0, spend: indexer.spendInDays(7).cost, budget: cfg.budgetWeekly, label: 'weekly', key: 'w' + weekKey() },
    { on: cfg.budgetMonthly > 0, spend: indexer.spendInDays(30).cost, budget: cfg.budgetMonthly, label: 'monthly', key: 'm' + monthKey() },
  ];
  for (const c of checks) {
    if (!c.on) continue;
    const pct = c.spend / c.budget;
    const k80 = c.key + ':80', k100 = c.key + ':100';
    if (pct >= 1 && !notifiedBudget[k100]) {
      notifiedBudget[k100] = true;
      notify('Budget exceeded', `You've spent ${fmtMoney(c.spend)} this ${c.label === 'weekly' ? 'week' : 'month'} — over your ${fmtMoney(c.budget)} budget.`);
    } else if (pct >= 0.8 && pct < 1 && !notifiedBudget[k80]) {
      notifiedBudget[k80] = true;
      notify('Approaching budget', `${fmtMoney(c.spend)} of your ${fmtMoney(c.budget)} ${c.label} budget (${Math.round(pct * 100)}%).`);
    }
  }
}

// ---------- routines (recurring `claude -p` tasks) ----------
let claudeBin = null;
function resolveClaudeBin() {
  if (claudeBin) return claudeBin;
  try {
    const finder = process.platform === 'win32' ? 'where' : 'which';
    const r = spawnSync(finder, ['claude'], { encoding: 'utf8' });
    if (r.status === 0 && r.stdout) { claudeBin = r.stdout.split(/\r?\n/)[0].trim(); return claudeBin; }
  } catch {}
  const candidates = process.platform === 'win32'
    ? [path.join(HOME, '.local', 'bin', 'claude.exe')]
    : [path.join(HOME, '.local', 'bin', 'claude'), '/usr/local/bin/claude', '/opt/homebrew/bin/claude'];
  for (const c of candidates) { try { if (fs.existsSync(c)) { claudeBin = c; return c; } } catch {} }
  claudeBin = 'claude';
  return claudeBin;
}

function updateRoutine(id, patch) {
  const cfg = loadConfig();
  const r = (cfg.routines || []).find((x) => x.id === id);
  if (r) { Object.assign(r, patch); saveConfig(cfg); }
}
function sendRoutines() {
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('routines-updated');
}

const runningRoutines = new Set();
const MAX_CONCURRENT_ROUTINES = 2; // don't spawn a swarm of claude processes at once
const ROUTINE_TIMEOUT_MS = 10 * 60 * 1000;
function friendlyRoutineErr(msg) {
  if (/ENOENT/i.test(msg || '')) return 'Claude Code CLI not found on PATH — install it from claude.com/claude-code to run routines.';
  return msg || 'Unknown error.';
}
function runRoutine(routine) {
  if (runningRoutines.has(routine.id)) return;
  runningRoutines.add(routine.id);
  updateRoutine(routine.id, { lastStatus: 'running' });
  sendRoutines();

  const bin = resolveClaudeBin();
  const args = ['-p', routine.prompt];
  if (routine.model && routine.model !== 'default') args.push('--model', routine.model);
  if (routine.autonomous) args.push('--permission-mode', 'acceptEdits');

  let out = '', err = '', timedOut = false, child;
  try {
    child = spawn(bin, args, { cwd: routine.projectPath, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
  } catch (e) {
    runningRoutines.delete(routine.id);
    finishRoutine(routine.id, 'error', '', friendlyRoutineErr(e.message));
    return;
  }
  const timer = setTimeout(() => { timedOut = true; try { child.kill(); } catch {} }, ROUTINE_TIMEOUT_MS);
  child.stdout.on('data', (d) => { out += d; if (out.length > 24000) out = out.slice(-24000); });
  child.stderr.on('data', (d) => { err += d; });
  child.on('error', (e) => { clearTimeout(timer); runningRoutines.delete(routine.id); finishRoutine(routine.id, 'error', '', friendlyRoutineErr(e.message)); });
  child.on('close', (code) => {
    clearTimeout(timer);
    runningRoutines.delete(routine.id);
    if (timedOut) { finishRoutine(routine.id, 'error', out.trim(), 'Timed out after 10 minutes — the routine was stopped.'); return; }
    const status = code === 0 ? 'ok' : 'error';
    finishRoutine(routine.id, status, out.trim(), status === 'error' ? friendlyRoutineErr(err.trim() || `exited with code ${code}`) : '');
  });
}
function finishRoutine(id, status, output, error) {
  updateRoutine(id, { lastRun: Date.now(), lastStatus: status, lastOutput: output, lastError: error });
  sendRoutines();
  const r = (loadConfig().routines || []).find((x) => x.id === id);
  if (r) notify(status === 'ok' ? `Routine done — ${r.name}` : `Routine failed — ${r.name}`,
    status === 'ok' ? (output.slice(0, 140) || 'Completed.') : (error.slice(0, 140) || 'See the Routines tab.'));
}

function routineDue(r, now) {
  if (!r.enabled) return false;
  const s = r.schedule || {};
  if (s.type === 'daily') {
    const [hh, mm] = String(s.time || '09:00').split(':').map(Number);
    const target = new Date(); target.setHours(hh || 0, mm || 0, 0, 0);
    return now >= target.getTime() && (r.lastRun || 0) < target.getTime();
  }
  // interval (hours)
  const ms = Math.max(1, Number(s.hours) || 24) * 3600000;
  return !r.lastRun || (now - r.lastRun) >= ms;
}
function checkRoutines() {
  const cfg = loadConfig();
  const now = Date.now();
  for (const r of (cfg.routines || [])) {
    if (runningRoutines.size >= MAX_CONCURRENT_ROUTINES) break; // cap concurrent runs; rest catch up next tick
    if (routineDue(r, now) && !runningRoutines.has(r.id)) runRoutine(r);
  }
}

function tick() {
  if (!indexer.loaded) return;
  updateTray();
  checkActivity();
  checkBudgets();
  checkRoutines();
}

// ---------- config ----------

// Secrets (API keys) are encrypted at rest with the OS keychain via safeStorage.
function decryptSecret(enc) {
  try {
    if (!enc || !safeStorage.isEncryptionAvailable()) return '';
    return safeStorage.decryptString(Buffer.from(enc, 'base64'));
  } catch { return ''; }
}
function encryptSecret(plain) {
  try {
    if (!plain || !safeStorage.isEncryptionAvailable()) return '';
    return safeStorage.encryptString(plain).toString('base64');
  } catch { return ''; }
}

function loadConfig() {
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  } catch {
    return { ...DEFAULTS }; // no config file → genuine first run → onboarded:false
  }
  // Migration: a config file already exists → this is a returning user.
  if (!('onboarded' in parsed)) parsed.onboarded = true;
  const cfg = { ...DEFAULTS, ...parsed, launch: { ...DEFAULTS.launch, ...(parsed.launch || {}) } };
  // Decrypt secrets held at rest (fall back to any legacy plaintext value).
  if (cfg.apiKeyEnc) cfg.apiKey = decryptSecret(cfg.apiKeyEnc) || cfg.apiKey || '';
  if (cfg.adminKeyEnc) cfg.adminKey = decryptSecret(cfg.adminKeyEnc) || cfg.adminKey || '';
  return cfg;
}

function saveConfig(cfg) {
  const out = { ...cfg };
  // Encrypt secrets at rest; don't persist them in plaintext when encryption works.
  if (safeStorage.isEncryptionAvailable()) {
    out.apiKeyEnc = out.apiKey ? encryptSecret(out.apiKey) : '';
    out.adminKeyEnc = out.adminKey ? encryptSecret(out.adminKey) : '';
    delete out.apiKey;
    delete out.adminKey;
  }
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(out, null, 2));
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
    show: !HIDDEN_LAUNCH, // start in tray when launched at login with "start hidden"
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  mainWindow.removeMenu();
  mainWindow.loadFile('index.html');
  // Re-send the last known update state once the renderer is ready, so a 'ready'
  // that fired before the page registered its listener is never missed.
  mainWindow.webContents.on('did-finish-load', () => {
    if (lastUpdateState && mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('update-status', lastUpdateState);
    }
  });
  mainWindow.on('closed', () => { mainWindow = null; });
  // closing the window hides it to the tray (keeps monitoring); Quit from the tray to exit
  mainWindow.on('close', (e) => {
    if (!app.isQuitting && tray) { e.preventDefault(); mainWindow.hide(); }
  });
}

// ---- in-app preview windows (one per launched project) ----
const previewWindows = new Map(); // projectPath -> BrowserWindow

function openPreviewWindow(projectPath, url, name) {
  let win = previewWindows.get(projectPath);
  if (win && !win.isDestroyed()) {
    win.webContents.send('preview-navigate', url);
    win.show(); win.focus();
    return;
  }
  win = new BrowserWindow({
    width: 1200,
    height: 840,
    minWidth: 480,
    minHeight: 360,
    backgroundColor: '#1c1b18',
    title: `${name} — Preview`,
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preview-preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webviewTag: true, // the shell hosts the page in a <webview>
      partition: `preview:${projectPath}`, // isolated storage per project
    },
  });
  win.removeMenu();
  win.loadFile('preview-shell.html', { query: { url, name } });
  win.on('closed', () => { previewWindows.delete(projectPath); });
  previewWindows.set(projectPath, win);
}

function closePreviewWindow(projectPath) {
  const win = previewWindows.get(projectPath);
  if (win && !win.isDestroyed()) win.close();
  previewWindows.delete(projectPath);
}

function sendPreviewState() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('preview-changed', preview.snapshot());
  }
}

preview.bus.on('change', sendPreviewState);
preview.bus.on('ready', ({ projectPath, url, name, target }) => {
  if (target === 'browser') shell.openExternal(url);
  else openPreviewWindow(projectPath, url, name);
});

// ---- auto-update (electron-updater → GitHub Releases) ----
let lastUpdateState = null; // remembered so a freshly-loaded renderer never misses 'ready'
function sendUpdate(state, info) {
  lastUpdateState = { state, info };
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

// Locate the installer electron-updater already downloaded (updater cache is
// named from the npm package name, not the productName).
function findPendingInstaller() {
  try {
    const dir = path.join(HOME, 'AppData', 'Local', 'claude-launcher-updater', 'pending');
    const f = fs.readdirSync(dir).find((n) => /Setup.*\.exe$/i.test(n));
    return f ? path.join(dir, f) : '';
  } catch { return ''; }
}

ipcMain.handle('install-update', () => {
  try {
    app.isQuitting = true;
    const exe = process.execPath;
    const installer = process.platform === 'win32' ? findPendingInstaller() : '';

    // PREFERRED (unsigned Windows): run the downloaded installer OURSELVES, but
    // only AFTER a short delay once the app has fully exited. The "failed to
    // uninstall old application files (2)" dialog is caused by Windows Defender
    // still holding the old exe when NSIS's immediate uninstall runs; giving it
    // a few seconds lets the handle release so the uninstall succeeds cleanly
    // (no dialog). Then relaunch. Single-instance lock dedupes any double-start.
    if (installer) {
      const cmd = `ping -n 5 127.0.0.1 >nul & "${installer}" /S & ping -n 12 127.0.0.1 >nul & start "" "${exe}" & ping -n 6 127.0.0.1 >nul & start "" "${exe}"`;
      spawn(process.env.ComSpec || 'cmd.exe', ['/c', cmd],
        { detached: true, stdio: 'ignore', windowsVerbatimArguments: true }).unref();
      BrowserWindow.getAllWindows().forEach((w) => { try { w.removeAllListeners('close'); w.close(); } catch {} });
      setImmediate(() => app.quit());
      return;
    }

    // FALLBACK: electron-updater's own install, plus a relaunch watcher so the
    // app still reopens even if NSIS skips its run-after on the exit-2 path.
    if (process.platform === 'win32') {
      try {
        const relaunch = `ping -n 8 127.0.0.1 >nul & start "" "${exe}" & ping -n 14 127.0.0.1 >nul & start "" "${exe}"`;
        spawn(process.env.ComSpec || 'cmd.exe', ['/c', relaunch],
          { detached: true, stdio: 'ignore', windowsVerbatimArguments: true }).unref();
      } catch {}
    }
    BrowserWindow.getAllWindows().forEach((w) => { try { w.removeAllListeners('close'); w.close(); } catch {} });
    setImmediate(() => autoUpdater.quitAndInstall(true, true));
  } catch {}
});
ipcMain.handle('check-update', () => {
  if (app.isPackaged) autoUpdater.checkForUpdates().catch(() => {});
  else sendUpdate('current'); // dev build has no feed — report "latest"
});
ipcMain.handle('open-external', (_e, url) => {
  if (typeof url === 'string' && /^https?:\/\//.test(url)) shell.openExternal(url);
});

// ---- git status (for project cards) ----
const gitCache = new Map(); // path -> { time, data }
const GIT_TTL = 15000;
function git(projectPath, args) {
  const r = spawnSync('git', args, { cwd: projectPath, encoding: 'utf8', timeout: 4000, windowsHide: true });
  if (r.status !== 0 || r.error) return null;
  return (r.stdout || '').trim();
}
function gitStatus(projectPath) {
  const hit = gitCache.get(projectPath);
  if (hit && Date.now() - hit.time < GIT_TTL) return hit.data;
  let data = { isRepo: false };
  try {
    const inside = git(projectPath, ['rev-parse', '--is-inside-work-tree']);
    if (inside === 'true') {
      const branch = git(projectPath, ['rev-parse', '--abbrev-ref', 'HEAD']) || '';
      const porcelain = git(projectPath, ['status', '--porcelain']);
      const dirty = porcelain ? porcelain.split('\n').filter(Boolean).length : 0;
      let ahead = 0, behind = 0;
      const lr = git(projectPath, ['rev-list', '--count', '--left-right', '@{upstream}...HEAD']);
      if (lr && /\d+\s+\d+/.test(lr)) { const [b, a] = lr.split(/\s+/).map(Number); behind = b || 0; ahead = a || 0; }
      const last = git(projectPath, ['log', '-1', '--format=%h\x1f%cr\x1f%s']);
      let commit = null;
      if (last) { const [hash, rel, subject] = last.split('\x1f'); commit = { hash, rel, subject: (subject || '').slice(0, 100) }; }
      data = { isRepo: true, branch, dirty, ahead, behind, commit };
    }
  } catch { /* not a repo / git missing */ }
  gitCache.set(projectPath, { time: Date.now(), data });
  return data;
}
ipcMain.handle('git-status', (_e, projectPath) => {
  try { return gitStatus(projectPath); } catch { return { isRepo: false }; }
});

// ---- launch at login ----
function applyLoginItem(cfg) {
  try {
    if (!app.isPackaged) return; // only meaningful for the installed app
    app.setLoginItemSettings({
      openAtLogin: !!cfg.openAtLogin,
      args: cfg.startHidden ? ['--hidden'] : [],
    });
  } catch { /* unsupported platform */ }
}
ipcMain.handle('set-login-item', (_e, opts) => {
  const cfg = loadConfig();
  if (opts && 'openAtLogin' in opts) cfg.openAtLogin = !!opts.openAtLogin;
  if (opts && 'startHidden' in opts) cfg.startHidden = !!opts.startHidden;
  saveConfig(cfg);
  applyLoginItem(cfg);
  return { openAtLogin: cfg.openAtLogin, startHidden: cfg.startHidden };
});

ipcMain.handle('daily-recap', async (_e, opts) => {
  const force = !!(opts && opts.force);
  const range = (opts && opts.range) === 'week' ? 'week' : 'today';
  const cfg = loadConfig();
  let sinceMs, label, cacheKey;
  const today = new Date().toISOString().slice(0, 10);
  if (range === 'week') {
    sinceMs = Date.now() - 7 * 86400000;
    label = 'the last 7 days';
    cacheKey = 'week-' + today;
  } else {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    sinceMs = start.getTime();
    label = 'today';
    cacheKey = today;
  }
  const data = indexer.recapData(sinceMs);
  const totalMs = data.reduce((s, p) => s + p.activeMs, 0);
  const totalCost = data.reduce((s, p) => s + p.cost, 0);
  const projects = data.map((p) => ({
    name: p.name, path: p.path, activeMs: p.activeMs, cost: p.cost,
    sessions: p.sessions.length,
    titles: p.sessions.map((s) => s.title).filter(Boolean).slice(0, 4),
  }));
  if (!data.length) return { range, empty: true, totalMs: 0, totalCost: 0, projects: [], hasKey: !!cfg.apiKey };

  let narrative = null, aiError = null;
  if (cfg.apiKey) {
    const hash = crypto.createHash('sha1').update(JSON.stringify(projects)).digest('hex');
    const cache = loadRecapCache();
    const hit = cache[cacheKey];
    if (!force && hit && hit.hash === hash && hit.narrative) {
      narrative = hit.narrative;
    } else {
      try {
        narrative = await generateRecap(projects, totalMs, totalCost, cfg.apiKey, label);
        if (narrative) { cache[cacheKey] = { hash, narrative, time: Date.now() }; saveRecapCache(); }
      } catch (err) { aiError = err.message; }
    }
  }
  return { range, empty: false, totalMs, totalCost, projects, narrative, aiError, hasKey: !!cfg.apiKey };
});

app.whenReady().then(() => {
  createWindow();
  startWatchers();
  setupAutoUpdate();
  indexer.load();
  buildTray();
  registerHotkey(loadConfig()); // global summon shortcut
  applyLoginItem(loadConfig()); // keep OS login-item in sync with saved setting
  setInterval(tick, 30000); // refresh tray + notification checks every 30s
  // backfill, then tell the renderer to refresh with full data
  runIndex().then(() => {
    if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('fs-changed', 'claude');
    tick();
  });
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('before-quit', () => { app.isQuitting = true; try { indexer.flushSync(); } catch {} try { preview.stopAll(); } catch {} });
app.on('will-quit', () => { try { globalShortcut.unregisterAll(); } catch {} });

app.on('window-all-closed', () => {
  // with a tray the app keeps running in the background; otherwise quit
  if (process.platform !== 'darwin' && !tray) app.quit();
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
  if (launch.resume) {
    // resume a specific conversation; --fork-session branches it into a NEW
    // session id so the original transcript is left untouched.
    parts.push('--resume', launch.resume);
    if (launch.fork) parts.push('--fork-session');
  } else if (launch.continue) {
    parts.push('--continue');
  }
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

function openClaudeIn(projectPath, overrides) {
  const cfg = loadConfig();
  if (cfg.autoTrust) trustProject(projectPath); // opt-in only
  const launch = { ...cfg.launch, ...(overrides || {}) };
  const cmd = buildClaudeCommand(launch);
  return spawnTerminal(projectPath, cmd, cfg.terminalCommand);
}

// ---------- IPC ----------

ipcMain.handle('app-version', () => app.getVersion());

ipcMain.handle('get-config', () => {
  const cfg = loadConfig();
  const safe = { ...cfg };
  safe.hasApiKey = !!cfg.apiKey;
  safe.hasAdminKey = !!cfg.adminKey;
  safe.encryptionAvailable = safeStorage.isEncryptionAvailable();
  // never expose secrets (or their ciphertext) to the renderer
  delete safe.apiKey; delete safe.apiKeyEnc;
  delete safe.adminKey; delete safe.adminKeyEnc;
  return safe;
});

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
  const lpCfg = loadConfig();
  const dir = root || lpCfg.root;
  const tagOf = (p) => lpCfg.tags[p] || '';
  const isArchived = (p) => lpCfg.archived.includes(p);
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
      return { name: d.name, path: full, mtime, isGit, external: false, tag: tagOf(full), archived: isArchived(full) };
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
      tag: tagOf(cwd),
      archived: isArchived(cwd),
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

ipcMain.handle('active-session', (_e, preferId) => {
  try { return indexer.activeSession(150000, preferId || null); } catch { return null; }
});
ipcMain.handle('active-sessions', () => {
  try { return indexer.activeSessions(150000); } catch { return []; }
});

// "While you were away" — activity since the previous app open. Called once per
// launch; updates lastSeenTs so the next open compares against this one.
ipcMain.handle('away-digest', () => {
  const cfg = loadConfig();
  const since = cfg.lastSeenTs || 0;
  let digest = null;
  try { digest = indexer.awaySince(since); } catch { digest = null; }
  cfg.lastSeenTs = Date.now();
  saveConfig(cfg);
  return digest;
});

ipcMain.handle('insights', () => {
  try { return indexer.insights(); } catch { return null; }
});
ipcMain.handle('mcp-usage', () => {
  try { return indexer.mcpUsage(); } catch { return []; }
});
ipcMain.handle('set-note', (_e, projectPath, text) => {
  const cfg = loadConfig();
  cfg.notes = cfg.notes || {};
  const t = String(text || '').slice(0, 4000).trim();
  if (t) cfg.notes[projectPath] = t; else delete cfg.notes[projectPath];
  saveConfig(cfg);
  return { ok: true };
});

ipcMain.handle('overview-metrics', (_e, days) => {
  const range = indexer.overviewFor(days || 7);
  return { range, heatDays: indexer.combinedDaily(30) };
});

ipcMain.handle('open-project', (_e, projectPath, overrides) => {
  try {
    return openClaudeIn(projectPath, overrides);
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

// ---- live preview: run a project's app/site and open it ----
ipcMain.handle('preview-scan', (_e, paths) => {
  const out = {};
  for (const p of paths || []) {
    try {
      const d = preview.detect(p);
      if (d.launchable) out[p] = { launchable: true, type: d.type, label: d.label, command: d.command || '' };
    } catch {}
  }
  return out;
});
ipcMain.handle('preview-detect', (_e, projectPath) => {
  try { return preview.detect(projectPath); } catch (err) { return { launchable: false, error: err.message }; }
});
ipcMain.handle('preview-state', () => preview.snapshot());
ipcMain.handle('preview-launch', async (_e, projectPath, name) => {
  try {
    const cfg = loadConfig();
    const r = await preview.launch(projectPath, name || path.basename(projectPath), cfg.previewTarget || 'window');
    // static previews resolve with their URL synchronously — open immediately
    if (r.ok && r.already && r.url) {
      if ((cfg.previewTarget || 'window') === 'browser') shell.openExternal(r.url);
      else openPreviewWindow(projectPath, r.url, name || path.basename(projectPath));
    }
    return r;
  } catch (err) { return { ok: false, error: err.message }; }
});
ipcMain.handle('preview-open', (_e, projectPath, name) => {
  const info = preview.get(projectPath);
  if (!info || !info.url) return { ok: false, error: 'Not running.' };
  const cfg = loadConfig();
  if ((cfg.previewTarget || 'window') === 'browser') shell.openExternal(info.url);
  else openPreviewWindow(projectPath, info.url, name || path.basename(projectPath));
  return { ok: true };
});
ipcMain.handle('preview-stop', (_e, projectPath) => {
  closePreviewWindow(projectPath);
  return preview.stop(projectPath);
});
ipcMain.handle('preview-log', (_e, projectPath) => preview.logTail(projectPath));
ipcMain.handle('set-preview-target', (_e, val) => {
  const cfg = loadConfig();
  cfg.previewTarget = val === 'browser' ? 'browser' : 'window';
  saveConfig(cfg);
  return cfg.previewTarget;
});

// Session ids are uuids — validate before putting on a command line.
const SESSION_ID_RE = /^[0-9a-fA-F][0-9a-fA-F-]{7,63}$/;
ipcMain.handle('branch-session', (_e, cwd, sessionId) => {
  try {
    if (!cwd || !SESSION_ID_RE.test(String(sessionId || ''))) return { ok: false, error: 'Invalid session.' };
    return openClaudeIn(cwd, { resume: sessionId, fork: true, continue: false });
  } catch (err) { return { ok: false, error: err.message }; }
});
ipcMain.handle('resume-session', (_e, cwd, sessionId) => {
  try {
    if (!cwd || !SESSION_ID_RE.test(String(sessionId || ''))) return { ok: false, error: 'Invalid session.' };
    return openClaudeIn(cwd, { resume: sessionId, fork: false, continue: false });
  } catch (err) { return { ok: false, error: err.message }; }
});

ipcMain.handle('set-budget', (_e, b) => {
  const cfg = loadConfig();
  if (b && b.weekly != null) cfg.budgetWeekly = Math.max(0, Number(b.weekly) || 0);
  if (b && b.monthly != null) cfg.budgetMonthly = Math.max(0, Number(b.monthly) || 0);
  saveConfig(cfg);
  notifiedBudget = {};
  return { budgetWeekly: cfg.budgetWeekly, budgetMonthly: cfg.budgetMonthly };
});

ipcMain.handle('set-notifications', (_e, on) => {
  const cfg = loadConfig();
  cfg.notifications = !!on;
  saveConfig(cfg);
  return cfg.notifications;
});

ipcMain.handle('budget-status', () => {
  const cfg = loadConfig();
  return {
    weekly: { budget: cfg.budgetWeekly, spend: indexer.spendInDays(7).cost },
    monthly: { budget: cfg.budgetMonthly, spend: indexer.spendInDays(30).cost },
    today: indexer.spendInDays(1),
  };
});

ipcMain.handle('model-spend', () => indexer.modelSpend());

// ---- routines ----
ipcMain.handle('get-routines', () => loadConfig().routines || []);
ipcMain.handle('save-routine', (_e, routine) => {
  const cfg = loadConfig();
  if (!cfg.routines) cfg.routines = [];
  if (routine.id) {
    const i = cfg.routines.findIndex((r) => r.id === routine.id);
    if (i >= 0) cfg.routines[i] = { ...cfg.routines[i], ...routine };
    else cfg.routines.push(routine);
  } else {
    routine.id = 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    routine.lastRun = 0; routine.lastStatus = ''; routine.lastOutput = ''; routine.lastError = '';
    cfg.routines.push(routine);
  }
  saveConfig(cfg);
  return cfg.routines;
});
ipcMain.handle('delete-routine', (_e, id) => {
  const cfg = loadConfig();
  cfg.routines = (cfg.routines || []).filter((r) => r.id !== id);
  saveConfig(cfg);
  return cfg.routines;
});
ipcMain.handle('toggle-routine', (_e, id) => {
  const cfg = loadConfig();
  const r = (cfg.routines || []).find((x) => x.id === id);
  if (r) { r.enabled = !r.enabled; saveConfig(cfg); }
  return cfg.routines;
});
ipcMain.handle('run-routine', (_e, id) => {
  const r = (loadConfig().routines || []).find((x) => x.id === id);
  if (r) runRoutine(r);
  return true;
});

ipcMain.handle('toggle-archive', (_e, projectPath) => {
  const cfg = loadConfig();
  const i = cfg.archived.indexOf(projectPath);
  if (i === -1) cfg.archived.push(projectPath); else cfg.archived.splice(i, 1);
  saveConfig(cfg);
  return cfg.archived;
});

ipcMain.handle('set-tag', (_e, { projectPath, tag }) => {
  const cfg = loadConfig();
  if (!tag) delete cfg.tags[projectPath]; else cfg.tags[projectPath] = tag;
  saveConfig(cfg);
  return cfg.tags;
});

ipcMain.handle('set-client', (_e, { projectPath, client }) => {
  const cfg = loadConfig();
  cfg.clients = cfg.clients || {};
  const name = String(client || '').trim().slice(0, 60);
  if (!name) delete cfg.clients[projectPath]; else cfg.clients[projectPath] = name;
  saveConfig(cfg);
  return cfg.clients;
});

// Billable work-log: group projects by assigned client, with per-month rollups.
ipcMain.handle('client-report', () => {
  const cfg = loadConfig();
  const clients = cfg.clients || {};
  const groups = {}; // name -> { name, projects, months, totalMs, totalCost }
  for (const [pPath, name] of Object.entries(clients)) {
    if (!name) continue;
    const g = groups[name] || (groups[name] = { name, projects: [], months: {}, totalMs: 0, totalCost: 0 });
    const m = indexer.metricsFor(pPath);
    const pMs = m ? m.totals.activeMs : 0;
    const pCost = m ? m.totals.cost : 0;
    const pSessions = m ? m.totals.sessions : 0;
    g.projects.push({ path: pPath, name: pPath.split(/[\\/]/).pop() || pPath, activeMs: pMs, cost: pCost, sessions: pSessions });
    g.totalMs += pMs; g.totalCost += pCost;
    const mt = indexer.monthlyTotals(pPath);
    for (const mo in mt) {
      g.months[mo] = g.months[mo] || { activeMs: 0, cost: 0 };
      g.months[mo].activeMs += mt[mo].activeMs;
      g.months[mo].cost += mt[mo].cost;
    }
  }
  const list = Object.values(groups).sort((a, b) => b.totalCost - a.totalCost);
  return { clients: list, hasClients: list.length > 0, assignments: clients };
});

ipcMain.handle('open-in-editor', (_e, projectPath) => {
  if (cmdExists('code')) {
    try {
      if (process.platform === 'win32') spawnDetached('cmd.exe', ['/c', 'code', projectPath]);
      else spawnDetached('/bin/sh', ['-c', `code ${shQuote(projectPath)}`]);
      return { ok: true, via: 'vscode' };
    } catch {}
  }
  shell.openPath(projectPath);
  return { ok: true, via: 'explorer' };
});

ipcMain.handle('export-csv', async () => {
  const list = indexer.projectsList();
  let csv = 'Project,Path,Time (min),Cost ($),Sessions,Turns,Last Active\n';
  for (const p of list) {
    csv += [JSON.stringify(p.name), JSON.stringify(p.path), Math.round(p.activeMs / 60000), p.cost.toFixed(2), p.sessions, p.turns, p.lastTs ? new Date(p.lastTs).toISOString() : ''].join(',') + '\n';
  }
  const res = await dialog.showSaveDialog(mainWindow, { title: 'Export project stats', defaultPath: 'claude-helm-stats.csv', filters: [{ name: 'CSV', extensions: ['csv'] }] });
  if (res.canceled || !res.filePath) return { ok: false };
  try { fs.writeFileSync(res.filePath, csv); return { ok: true, path: res.filePath }; } catch (e) { return { ok: false, error: e.message }; }
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
  // word-AND: every query word must appear somewhere (description OR body),
  // so multi-word descriptions match even when the words aren't adjacent
  const tokens = q.split(/\s+/).filter(Boolean);
  const matches = (hay) => tokens.every((t) => hay.includes(t));
  let files;
  try { files = await fsp.readdir(memDir); } catch { return out; }
  for (const f of files) {
    if (!f.endsWith('.md') || f === 'MEMORY.md') continue;
    let text;
    try { text = await fsp.readFile(path.join(memDir, f), 'utf8'); } catch { continue; }
    if (!matches(text.toLowerCase())) continue;
    const mem = parseMemory(text);
    const hay = (mem.description + ' ' + mem.body).toLowerCase();
    if (!matches(hay)) continue;
    out.push({
      title: mem.description || mem.name || f,
      type: mem.type || (f.match(/^(feedback|project|reference|user)/) || [])[1] || 'other',
      body: mem.body,
      snippet: snippet((mem.body || mem.description || '').replace(/\s+/g, ' '), tokens[0], 200),
    });
  }
  // also the global CLAUDE.md
  try {
    const cm = await fsp.readFile(path.join(HOME, '.claude', 'CLAUDE.md'), 'utf8');
    if (matches(cm.toLowerCase())) {
      out.push({ title: 'Global instructions (CLAUDE.md)', type: 'instructions', body: cm.trim(), snippet: snippet(cm.replace(/\s+/g, ' '), tokens[0], 200) });
    }
  } catch {}
  return out;
}

// Search projects by ANY description: name, tag, client, your notes, README first
// paragraph, and recent session titles. Word-AND matching — every word in the query
// must appear somewhere in the project's combined text (order doesn't matter).
ipcMain.handle('search-projects', async (_e, query, list) => {
  const q = String(query || '').trim().toLowerCase();
  if (q.length < 2 || !Array.isArray(list)) return [];
  const tokens = q.split(/\s+/).filter(Boolean);
  const cfg = loadConfig();
  const out = [];
  for (const p of list.slice(0, 200)) {
    if (!p || !p.path) continue;
    let desc = '';
    for (const name of ['README.md', 'readme.md', 'CLAUDE.md']) {
      try { desc = firstParagraph(await fsp.readFile(path.join(p.path, name), 'utf8')); if (desc) break; } catch {}
    }
    const m = indexer.metricsFor(p.path);
    const titles = m ? Object.values(m.sessions).filter((s) => s.title)
      .sort((a, b) => b.lastTs - a.lastTs).slice(0, 8).map((s) => s.title) : [];
    const note = (cfg.notes || {})[p.path] || '';
    const tag = (cfg.tags || {})[p.path] || '';
    const client = (cfg.clients || {})[p.path] || '';
    const hay = [p.name, tag, client, note, desc, ...titles].join(' \n ').toLowerCase();
    if (!tokens.every((t) => hay.includes(t))) continue;
    // surface WHERE it matched so the result is self-explanatory
    let matched = '';
    if (tokens.some((t) => p.name.toLowerCase().includes(t))) matched = desc || note || titles[0] || '';
    else if (tokens.some((t) => desc.toLowerCase().includes(t))) matched = desc;
    else if (tokens.some((t) => note.toLowerCase().includes(t))) matched = 'Note: ' + note;
    else {
      const hit = titles.find((t) => tokens.some((tok) => t.toLowerCase().includes(tok)));
      matched = hit ? 'Session: ' + hit : desc || note || '';
    }
    out.push({ path: p.path, name: p.name, tag, client, desc: String(matched).slice(0, 220) });
    if (out.length >= 12) break;
  }
  return out;
});

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

// First real prose line of a README/CLAUDE.md — skips YAML frontmatter, HTML
// (e.g. `<div align="center">`, `<img …>`), HTML comments, badges, and headings,
// and strips inline markup. Falls back to the first heading text only if there's
// no prose, so a card description is always clean readable text — never raw markup.
function firstParagraph(text) {
  let lines = text.split(/\r?\n/);
  if (lines[0] && lines[0].trim() === '---') {
    const end = lines.indexOf('---', 1);
    if (end > 0) lines = lines.slice(end + 1);
  }
  let inComment = false, headingFallback = '';
  for (const raw of lines) {
    let l = raw.trim();
    if (!l) continue;
    if (inComment) { if (l.includes('-->')) inComment = false; continue; }
    if (l.startsWith('<!--')) { if (!l.includes('-->')) inComment = true; continue; }
    if (/^<\/?[a-z!]/i.test(l)) continue; // a line that is just HTML markup
    const isHeading = /^#{1,6}\s/.test(l);
    if (/^[#>*\-=`|]/.test(l)) {
      l = l.replace(/^#+\s*/, '').replace(/^[>*\-]\s*/, '').trim();
      if (!l || /^[=\-]+$/.test(l)) continue;
    }
    l = l.replace(/<[^>]+>/g, '')                 // inline HTML tags
         .replace(/!\[[^\]]*\]\([^)]*\)/g, '')    // images / badges
         .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links → their text
         .replace(/[*_`]/g, '')
         .trim();
    if (l.length > 8 && /[a-zA-Z]{3,}/.test(l)) {
      const clipped = l.length > 160 ? l.slice(0, 157) + '…' : l;
      if (isHeading) { if (!headingFallback) headingFallback = clipped; continue; }
      return clipped; // prefer real prose over the title
    }
  }
  return headingFallback;
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

// ---- daily recap ----
const RECAP_CACHE_PATH = path.join(app.getPath('userData'), 'daily-recap.json');
let recapCache = null;
function loadRecapCache() {
  if (recapCache) return recapCache;
  try { recapCache = JSON.parse(fs.readFileSync(RECAP_CACHE_PATH, 'utf8')); }
  catch { recapCache = {}; }
  return recapCache;
}
function saveRecapCache() {
  try {
    const tmp = RECAP_CACHE_PATH + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(recapCache));
    fs.renameSync(tmp, RECAP_CACHE_PATH);
  } catch {}
}
async function generateRecap(projects, totalMs, totalCost, apiKey, label = 'today') {
  const Anthropic = require('@anthropic-ai/sdk');
  const client = new Anthropic({ apiKey });
  const hrs = totalMs / 3600000;
  const lines = projects.map((p) => {
    const t = (p.activeMs / 3600000).toFixed(1);
    const titles = p.titles && p.titles.length ? ` — ${p.titles.join('; ')}` : '';
    return `- ${p.name}: ${t}h, $${p.cost.toFixed(2)}, ${p.sessions} session(s)${titles}`;
  }).join('\n');
  const resp = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 500,
    system: `You write a brief standup recap for a developer, from their Claude Code activity over ${label}. ${label === 'today' ? '3-6' : '4-8'} short, plain, factual bullet points about what was worked on and accomplished — no preamble, no headers, no fluff. Start each bullet with '- '. Refer to projects by name.`,
    messages: [{ role: 'user', content: `Over ${label} I spent ${hrs.toFixed(1)} hours total (~$${totalCost.toFixed(2)}) across these projects:\n\n${lines}\n\nWrite the recap.` }],
  });
  const text = (resp.content.find((b) => b.type === 'text') || {}).text || '';
  return text.trim();
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

// ---- agent maker (Claude Code subagents) ----
ipcMain.handle('agents-list', (_e, projectPath) => agents.list(HOME, projectPath || ''));
ipcMain.handle('agent-save', (_e, a) => agents.save(HOME, a || {}));
ipcMain.handle('agent-delete', (_e, { scope, projectPath, name }) => agents.remove(HOME, scope, projectPath || '', name));
ipcMain.handle('open-agents-folder', (_e, { scope, projectPath }) => {
  const dir = agents.dirFor(HOME, scope, projectPath || '');
  if (!dir) return { ok: false };
  try { fs.mkdirSync(dir, { recursive: true }); } catch {}
  shell.openPath(dir);
  return { ok: true, dir };
});
ipcMain.handle('generate-agent-prompt', async (_e, { name, description }) => {
  const cfg = loadConfig();
  if (!cfg.apiKey) return { ok: false, error: 'Add your Anthropic API key in Settings → AI & Usage to generate prompts.' };
  try {
    const Anthropic = require('@anthropic-ai/sdk');
    const client = new Anthropic({ apiKey: cfg.apiKey });
    const resp = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 900,
      system: "You write system prompts for Claude Code subagents. Given an agent name and a short description of what it should do, output ONLY the system prompt body — no frontmatter, no markdown code fences, no preamble or sign-off. Write in the second person (\"You are…\"). Be specific about the agent's role, when it should act, the method it follows, and what a good result looks like. Aim for 120–300 words.",
      messages: [{ role: 'user', content: `Agent name: ${name || '(unnamed)'}\nWhat it should do: ${description || ''}` }],
    });
    const text = (resp.content.find((b) => b.type === 'text') || {}).text || '';
    return { ok: true, prompt: text.trim() };
  } catch (err) { return { ok: false, error: err.message }; }
});

ipcMain.handle('set-api-key', (_e, key) => {
  const cfg = loadConfig();
  cfg.apiKey = String(key || '').trim();
  if (!cfg.apiKey) cfg.aiSummaries = false;
  saveConfig(cfg);
  return { hasApiKey: !!cfg.apiKey, aiSummaries: cfg.aiSummaries };
});
ipcMain.handle('set-admin-key', (_e, key) => {
  const cfg = loadConfig();
  cfg.adminKey = String(key || '').trim();
  saveConfig(cfg);
  return { hasAdminKey: !!cfg.adminKey };
});
ipcMain.handle('admin-billing', async () => {
  const cfg = loadConfig();
  if (!cfg.adminKey) return { hasKey: false };
  try {
    const start = new Date(); start.setDate(1); start.setHours(0, 0, 0, 0);
    const since = start.toISOString();
    const url = `https://api.anthropic.com/v1/organizations/cost_report?starting_at=${encodeURIComponent(since)}`;
    const resp = await fetch(url, { headers: { 'x-api-key': cfg.adminKey, 'anthropic-version': '2023-06-01' } });
    if (!resp.ok) {
      return { hasKey: true, error: resp.status === 401 ? 'Key rejected (needs an org Admin key).' : `Anthropic API error ${resp.status}.` };
    }
    const json = await resp.json();
    let total = 0;
    for (const bucket of (Array.isArray(json.data) ? json.data : [])) {
      for (const r of (Array.isArray(bucket.results) ? bucket.results : [])) {
        const amt = parseFloat(r.amount != null ? r.amount : (r.cost != null ? r.cost : 0));
        if (!isNaN(amt)) total += amt;
      }
    }
    return { hasKey: true, amount: total, currency: 'USD', since };
  } catch (err) {
    return { hasKey: true, error: err.message };
  }
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

// Read the signed-in Claude account + subscription plan straight from what Claude Code
// already stored locally (~/.claude.json → oauthAccount). No network, no token exposure —
// we never touch ~/.claude/.credentials.json. This is the real plan, not a guess.
function planLabel(orgType, rateTier) {
  const t = String(orgType || '').toLowerCase();
  let base = 'Claude';
  if (t.includes('max')) base = 'Claude Max';
  else if (t.includes('pro')) base = 'Claude Pro';
  else if (t.includes('team')) base = 'Claude Team';
  else if (t.includes('enterprise')) base = 'Claude Enterprise';
  else if (t.includes('free')) base = 'Claude Free';
  else if (orgType) base = orgType;
  const mult = String(rateTier || '').match(/(\d+)\s*x/i);
  if (mult && base === 'Claude Max') base += ` ${mult[1]}×`;
  return base;
}
ipcMain.handle('claude-account', () => {
  try {
    const raw = fs.readFileSync(path.join(HOME, '.claude.json'), 'utf8');
    const o = (JSON.parse(raw) || {}).oauthAccount;
    if (!o || !o.emailAddress) return { signedIn: false };
    return {
      signedIn: true,
      email: o.emailAddress,
      displayName: o.displayName || '',
      organization: o.organizationName || '',
      organizationRole: o.organizationRole || '',
      plan: planLabel(o.organizationType, o.organizationRateLimitTier),
      planRaw: o.organizationType || '',
      rateLimitTier: o.organizationRateLimitTier || '',
      billingType: o.billingType || '',
      extraUsage: !!o.hasExtraUsageEnabled,
      subscriptionCreatedAt: o.subscriptionCreatedAt || '',
      trialEndsAt: o.claudeCodeTrialEndsAt || null,
    };
  } catch (err) {
    return { signedIn: false, error: err.message };
  }
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

ipcMain.handle('set-redact', (_e, on) => {
  const cfg = loadConfig();
  cfg.redact = !!on;
  saveConfig(cfg);
  return cfg.redact;
});

ipcMain.handle('set-theme', (_e, theme) => {
  const cfg = loadConfig();
  cfg.theme = theme === 'dark' ? 'dark' : 'light';
  saveConfig(cfg);
  return cfg.theme;
});

const ACCENTS = ['clay', 'lagoon', 'aubergine', 'jade'];
ipcMain.handle('set-accent', (_e, accent) => {
  const cfg = loadConfig();
  cfg.accent = ACCENTS.includes(accent) ? accent : 'clay';
  saveConfig(cfg);
  return cfg.accent;
});

ipcMain.handle('set-hotkey', (_e, opts) => {
  const cfg = loadConfig();
  if (opts && 'enabled' in opts) cfg.hotkeyEnabled = !!opts.enabled;
  if (opts && typeof opts.hotkey === 'string' && opts.hotkey.trim()) cfg.hotkey = opts.hotkey.trim();
  saveConfig(cfg);
  const res = registerHotkey(cfg);
  return { hotkey: cfg.hotkey, enabled: cfg.hotkeyEnabled, registered: res.registered, error: res.error || '' };
});
