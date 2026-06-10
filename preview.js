// preview.js — detect, run, and manage live previews of a project's app or website.
//
// Two kinds of project are launchable:
//   • "server"  — package.json has a dev/start/serve script (Vite, Next, CRA, Express…).
//                 We spawn the dev command, watch its output for the first localhost URL
//                 it prints, then hand that URL back so the launcher can open it.
//   • "static"  — a folder with an index.html and no dev script. We spin up a tiny built-in
//                 HTTP server rooted at that folder (so fetch / ES-modules / routing all work,
//                 unlike a raw file://) and hand back http://localhost:PORT.
//
// Everything we start is tracked in `running` and torn down on stopAll() (called at quit).

const http = require('http');
const fs = require('fs');
const path = require('path');
const net = require('net');
const { spawn, spawnSync } = require('child_process');
const { EventEmitter } = require('events');

// Emits:
//   'change'              — the running registry changed (start/stop/exit). Payload: none.
//   'ready' {projectPath, url, name, target}  — a preview now has a URL ready to open.
//   'log'   {projectPath} — new output captured (registry entry's logTail updated).
const bus = new EventEmitter();

// projectPath -> { projectPath, name, type, status, url, port, server?, child?, startedAt, logTail, target }
const running = new Map();

const MIME = {
  '.html': 'text/html; charset=utf-8', '.htm': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.webp': 'image/webp', '.ico': 'image/x-icon', '.avif': 'image/avif',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.otf': 'font/otf',
  '.map': 'application/json', '.wasm': 'application/wasm', '.txt': 'text/plain; charset=utf-8',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.mp3': 'audio/mpeg', '.wav': 'audio/wav',
  '.pdf': 'application/pdf', '.xml': 'application/xml',
};

const STATIC_DIRS = ['', 'public', 'dist', 'build', 'out', 'site', 'www', 'docs', 'src'];

function readJSON(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return null; }
}

function detectPackageManager(projectPath) {
  if (fs.existsSync(path.join(projectPath, 'pnpm-lock.yaml'))) return 'pnpm';
  if (fs.existsSync(path.join(projectPath, 'yarn.lock'))) return 'yarn';
  if (fs.existsSync(path.join(projectPath, 'bun.lockb'))) return 'bun';
  return 'npm';
}

// Find an index.html (or a lone *.html) inside one of the common web roots.
function findStaticEntry(projectPath) {
  for (const d of STATIC_DIRS) {
    const dir = d ? path.join(projectPath, d) : projectPath;
    let st; try { st = fs.statSync(dir); } catch { continue; }
    if (!st.isDirectory()) continue;
    const idx = path.join(dir, 'index.html');
    if (fs.existsSync(idx)) return { dir, file: 'index.html' };
    // fall back to a single html file at the root level only
    if (d === '') {
      let names; try { names = fs.readdirSync(dir); } catch { names = []; }
      const html = names.filter((n) => /\.html?$/i.test(n)).sort();
      if (html.length) return { dir, file: html[0] };
    }
  }
  return null;
}

// Lightweight profile used to decide whether to show a Launch button. Cheap: a few fs reads.
function detect(projectPath) {
  try {
    const pkg = readJSON(path.join(projectPath, 'package.json'));
    const scripts = (pkg && pkg.scripts) || {};
    const scriptName = ['dev', 'start', 'serve', 'preview'].find((s) => scripts[s]);
    if (scriptName) {
      const pm = detectPackageManager(projectPath);
      const runner = pm === 'npm' ? 'npm run' : pm === 'yarn' ? 'yarn' : pm === 'bun' ? 'bun run' : 'pnpm';
      return {
        launchable: true,
        type: 'server',
        label: 'Launch app',
        script: scriptName,
        command: `${runner} ${scriptName}`,
      };
    }
    const stat = findStaticEntry(projectPath);
    if (stat) {
      return { launchable: true, type: 'static', label: 'Launch site', dir: stat.dir, file: stat.file };
    }
  } catch {}
  return { launchable: false };
}

function freePort() {
  return new Promise((resolve, reject) => {
    const s = net.createServer();
    s.once('error', reject);
    s.listen(0, '127.0.0.1', () => {
      const p = s.address().port;
      s.close(() => resolve(p));
    });
  });
}

function publicInfo(e) {
  if (!e) return null;
  return {
    projectPath: e.projectPath, name: e.name, type: e.type, status: e.status,
    url: e.url || '', port: e.port || 0, startedAt: e.startedAt, command: e.command || '',
  };
}

function snapshot() {
  const out = {};
  for (const [k, e] of running) out[k] = publicInfo(e);
  return out;
}

function appendLog(e, chunk) {
  e.logTail = (e.logTail + chunk).slice(-8000);
  bus.emit('log', { projectPath: e.projectPath });
}

const URL_RE = /(https?:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0)(?::\d+)?(?:\/[\w\-./?%&=#]*)?)/i;
function extractUrl(text) {
  const m = text.match(URL_RE);
  if (!m) return null;
  return m[1].replace('0.0.0.0', 'localhost').replace(/[).,]+$/, '');
}

// ---- static site ----
async function startStatic(projectPath, name, prof, target) {
  const port = await freePort();
  const root = path.resolve(prof.dir);
  const server = http.createServer((req, res) => {
    try {
      let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
      if (urlPath === '/') urlPath = '/' + prof.file;
      let filePath = path.normalize(path.join(root, urlPath));
      // path-traversal guard — never escape the served root
      if (filePath !== root && !filePath.startsWith(root + path.sep)) {
        res.writeHead(403); res.end('Forbidden'); return;
      }
      let st; try { st = fs.statSync(filePath); } catch { st = null; }
      if (st && st.isDirectory()) { filePath = path.join(filePath, 'index.html'); try { st = fs.statSync(filePath); } catch { st = null; } }
      if (!st) {
        // SPA fallback: extension-less misses serve index.html so client routing works
        if (!path.extname(urlPath)) {
          filePath = path.join(root, prof.file);
          try { st = fs.statSync(filePath); } catch { st = null; }
        }
        if (!st) { res.writeHead(404, { 'content-type': 'text/plain' }); res.end('404 Not Found'); return; }
      }
      const type = MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
      res.writeHead(200, { 'content-type': type, 'cache-control': 'no-cache' });
      fs.createReadStream(filePath).pipe(res);
    } catch (err) {
      res.writeHead(500); res.end('500 ' + err.message);
    }
  });
  return new Promise((resolve) => {
    server.on('error', (err) => {
      running.delete(projectPath); bus.emit('change');
      resolve({ ok: false, error: err.message });
    });
    server.listen(port, '127.0.0.1', () => {
      const url = `http://localhost:${port}/`;
      const entry = {
        projectPath, name, type: 'static', status: 'running', url, port, server,
        startedAt: Date.now(), logTail: `Serving ${root} on ${url}\n`, target,
        command: `static · ${path.basename(root)}`,
      };
      running.set(projectPath, entry);
      bus.emit('change');
      bus.emit('ready', { projectPath, url, name, target });
      resolve({ ok: true, ...publicInfo(entry) });
    });
  });
}

// ---- dev server ----
function startServer(projectPath, name, prof, target) {
  const env = { ...process.env, BROWSER: 'none', FORCE_COLOR: '1', npm_config_yes: 'true' };
  let child;
  try {
    if (process.platform === 'win32') {
      child = spawn(prof.command, { cwd: projectPath, env, shell: true, windowsHide: true });
    } else {
      // own process group so we can kill the whole tree later
      child = spawn('/bin/sh', ['-c', prof.command], { cwd: projectPath, env, detached: true });
    }
  } catch (err) {
    return { ok: false, error: err.message };
  }

  const entry = {
    projectPath, name, type: 'server', status: 'starting', url: '', port: 0, child,
    startedAt: Date.now(), logTail: `$ ${prof.command}\n`, target, command: prof.command, opened: false,
  };
  running.set(projectPath, entry);
  bus.emit('change');

  const onData = (buf) => {
    const s = buf.toString();
    appendLog(entry, s);
    if (!entry.opened) {
      const url = extractUrl(entry.logTail);
      if (url) {
        entry.url = url; entry.status = 'running'; entry.opened = true;
        try { entry.port = Number(new URL(url).port) || 0; } catch {}
        bus.emit('change');
        bus.emit('ready', { projectPath, url, name, target });
      }
    }
  };
  if (child.stdout) child.stdout.on('data', onData);
  if (child.stderr) child.stderr.on('data', onData);

  child.on('error', (err) => { appendLog(entry, `\n[error] ${err.message}\n`); });
  child.on('exit', (code) => {
    appendLog(entry, `\n[process exited with code ${code}]\n`);
    running.delete(projectPath);
    bus.emit('change');
  });

  // If no URL appears within 30s, the app is running but we couldn't detect a URL.
  setTimeout(() => {
    if (running.get(projectPath) === entry && !entry.opened) {
      entry.status = 'running-nourl';
      bus.emit('change');
    }
  }, 30000);

  return { ok: true, ...publicInfo(entry) };
}

async function launch(projectPath, name, target) {
  const existing = running.get(projectPath);
  if (existing) return { ok: true, already: true, ...publicInfo(existing) };
  const prof = detect(projectPath);
  if (!prof.launchable) return { ok: false, error: 'No app or website detected in this project.' };
  if (prof.type === 'static') return startStatic(projectPath, name, prof, target);
  return startServer(projectPath, name, prof, target);
}

function stop(projectPath) {
  const e = running.get(projectPath);
  if (!e) return { ok: true, notRunning: true };
  try { if (e.server) e.server.close(); } catch {}
  try {
    if (e.child && e.child.pid) {
      if (process.platform === 'win32') {
        spawnSync('taskkill', ['/pid', String(e.child.pid), '/T', '/F'], { stdio: 'ignore' });
      } else {
        try { process.kill(-e.child.pid, 'SIGTERM'); } catch { try { e.child.kill('SIGTERM'); } catch {} }
      }
    }
  } catch {}
  running.delete(projectPath);
  bus.emit('change');
  return { ok: true };
}

function stopAll() {
  for (const k of [...running.keys()]) stop(k);
}

function get(projectPath) { return publicInfo(running.get(projectPath)); }
function logTail(projectPath) { const e = running.get(projectPath); return e ? e.logTail : ''; }

module.exports = { bus, detect, launch, stop, stopAll, snapshot, get, logTail };
