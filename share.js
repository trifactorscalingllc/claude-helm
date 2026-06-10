// share.js — expose a locally-running preview to the internet for a client to view.
//
// Uses Cloudflare quick tunnels (`cloudflared tunnel --url …`): free, no account,
// gives a random https://*.trycloudflare.com URL. We find cloudflared on PATH or
// download the official binary once into the app's data dir (Windows; on macOS /
// Linux we point the user at brew/apt if it's missing).
//
// Registry parallels preview.js: one share per project, stopAll() on quit.

const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');
const { spawn, spawnSync } = require('child_process');
const { EventEmitter } = require('events');

// Pinned cloudflared release + checksum — we EXECUTE this binary, so a floating
// `latest` URL is a supply-chain hole. Bump deliberately: new version tag +
// matching SHA-256 from the cloudflared release notes (windows-amd64.exe line).
const CLOUDFLARED_VERSION = '2026.6.0';
const CLOUDFLARED_WIN_SHA256 = '03e322598e84d77406fa55b93f59e8e54636c5d8501d9dce36697fcf080ed8cc';

const bus = new EventEmitter(); // 'change' | 'ready' {projectPath, url}

const shares = new Map(); // projectPath -> { child, url, status, port, startedAt }
let binDir = null; // set via init(userDataPath)

function init(userDataPath) { binDir = path.join(userDataPath, 'bin'); }

function findCloudflared() {
  try {
    const finder = process.platform === 'win32' ? 'where' : 'which';
    const r = spawnSync(finder, ['cloudflared'], { encoding: 'utf8' });
    if (r.status === 0 && r.stdout) return r.stdout.split(/\r?\n/)[0].trim();
  } catch {}
  if (binDir) {
    const local = path.join(binDir, process.platform === 'win32' ? 'cloudflared.exe' : 'cloudflared');
    if (fs.existsSync(local)) return local;
  }
  return null;
}

function download(url, dest, redirects = 5) {
  return new Promise((resolve, reject) => {
    if (redirects < 0) return reject(new Error('Too many redirects'));
    https.get(url, { headers: { 'user-agent': 'claude-helm' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        return download(res.headers.location, dest, redirects - 1).then(resolve, reject);
      }
      if (res.statusCode !== 200) { res.resume(); return reject(new Error('Download failed: HTTP ' + res.statusCode)); }
      const tmp = dest + '.part';
      const out = fs.createWriteStream(tmp);
      res.pipe(out);
      out.on('finish', () => out.close(() => { try { fs.renameSync(tmp, dest); resolve(dest); } catch (e) { reject(e); } }));
      out.on('error', reject);
    }).on('error', reject);
  });
}

async function ensureCloudflared() {
  const found = findCloudflared();
  if (found) return { ok: true, bin: found };
  if (process.platform !== 'win32') {
    return { ok: false, error: 'cloudflared not found. Install it (macOS: brew install cloudflared · Linux: see developers.cloudflare.com) and try again.' };
  }
  if (!binDir) return { ok: false, error: 'Share engine not initialized.' };
  fs.mkdirSync(binDir, { recursive: true });
  const dest = path.join(binDir, 'cloudflared.exe');
  const url = `https://github.com/cloudflare/cloudflared/releases/download/${CLOUDFLARED_VERSION}/cloudflared-windows-amd64.exe`;
  const staged = dest + '.dl';
  await download(url, staged); // throws on failure
  const hash = await sha256File(staged);
  if (hash !== CLOUDFLARED_WIN_SHA256) {
    try { fs.unlinkSync(staged); } catch {}
    return { ok: false, error: 'cloudflared download failed its integrity check (SHA-256 mismatch) — not installed.' };
  }
  fs.renameSync(staged, dest); // only a verified binary ever lands at the executable path
  return { ok: true, bin: dest, downloaded: true };
}

function sha256File(p) {
  return new Promise((resolve, reject) => {
    const h = crypto.createHash('sha256');
    fs.createReadStream(p)
      .on('data', (d) => h.update(d))
      .on('end', () => resolve(h.digest('hex')))
      .on('error', reject);
  });
}

function publicInfo(e) {
  if (!e) return null;
  return { status: e.status, url: e.url || '', port: e.port, startedAt: e.startedAt };
}
function snapshot() {
  const out = {};
  for (const [k, e] of shares) out[k] = publicInfo(e);
  return out;
}

const TUNNEL_URL_RE = /(https:\/\/[a-z0-9-]+\.trycloudflare\.com)/i;

async function start(projectPath, port) {
  // Short-circuit on ANY existing entry — including one still in the 'starting'
  // window (no URL yet). Spawning again there would orphan the first cloudflared
  // and overwrite its map entry; the caller gets the URL via the 'ready' event.
  const existing = shares.get(projectPath);
  if (existing) return { ok: true, already: true, ...publicInfo(existing) };
  const ensured = await ensureCloudflared().catch((e) => ({ ok: false, error: e.message }));
  if (!ensured.ok) return ensured;

  let child;
  try {
    child = spawn(ensured.bin, ['tunnel', '--url', `http://127.0.0.1:${port}`, '--no-autoupdate'],
      { stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
  } catch (e) { return { ok: false, error: e.message }; }

  const entry = { child, url: '', status: 'starting', port, startedAt: Date.now() };
  shares.set(projectPath, entry);
  bus.emit('change');

  return new Promise((resolve) => {
    let buf = '';
    const onData = (d) => {
      buf = (buf + d).slice(-6000);
      const m = buf.match(TUNNEL_URL_RE);
      if (m && !entry.url) {
        entry.url = m[1];
        entry.status = 'live';
        bus.emit('change');
        bus.emit('ready', { projectPath, url: entry.url });
        resolve({ ok: true, ...publicInfo(entry) });
      }
    };
    // cloudflared prints the URL on stderr
    if (child.stderr) child.stderr.on('data', onData);
    if (child.stdout) child.stdout.on('data', onData);
    child.on('error', (e) => { shares.delete(projectPath); bus.emit('change'); resolve({ ok: false, error: e.message }); });
    child.on('exit', () => {
      if (shares.get(projectPath) === entry) { shares.delete(projectPath); bus.emit('change'); }
      if (!entry.url) resolve({ ok: false, error: 'Tunnel exited before a URL was issued. Check your internet connection.' });
    });
    setTimeout(() => {
      if (entry.url) return;
      // Kill the whole tree (plain .kill() leaves cloudflared's children on Windows)
      // and clear the registry entry NOW — waiting for the 'exit' event leaves a
      // stale 'starting' entry that blocks the user's retry.
      try {
        if (process.platform === 'win32' && child.pid) spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
        else child.kill('SIGTERM');
      } catch {}
      if (shares.get(projectPath) === entry) { shares.delete(projectPath); bus.emit('change'); }
      resolve({ ok: false, error: 'Timed out waiting for the tunnel URL (30s).' });
    }, 30000);
  });
}

function stop(projectPath) {
  const e = shares.get(projectPath);
  if (!e) return { ok: true };
  try {
    if (e.child && e.child.pid) {
      if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(e.child.pid), '/T', '/F'], { stdio: 'ignore' });
      else e.child.kill('SIGTERM');
    }
  } catch {}
  shares.delete(projectPath);
  bus.emit('change');
  return { ok: true };
}

function stopAll() { for (const k of [...shares.keys()]) stop(k); }
function get(projectPath) { return publicInfo(shares.get(projectPath)); }

module.exports = { bus, init, start, stop, stopAll, snapshot, get, findCloudflared };
