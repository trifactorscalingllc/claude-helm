// hub.js — Helm Hub: host shared project repos on an always-on machine.
//
// A plain-Node git smart-HTTP server. Repos live as bare repos under a hub
// directory; every repo has its own bearer token (minted at create time) and
// the hub has one admin token for management calls. Reachability (tunnel +
// rendezvous) is wired by main.js; this module is pure local HTTP + git.
//
//   GET  /api/ping                              → { ok, hub, name }
//   POST /api/repos { name }        (admin)     → { ok, repo, token, created }
//   GET  /<repo>.git/info/refs?service=…  (repo) → ref advertisement
//   POST /<repo>.git/git-upload-pack       (repo) → fetch/clone data
//   POST /<repo>.git/git-receive-pack      (repo) → push data
//
// Standard smart-HTTP recipe: spawn `git upload-pack|receive-pack
// --stateless-rpc` and stream. Bodies may arrive gzip-compressed.

const fs = require('fs');
const path = require('path');
const http = require('http');
const zlib = require('zlib');
const crypto = require('crypto');
const { spawn, spawnSync } = require('child_process');

let state = null; // { dir, configPath, server, port, cfg: { adminToken, repos: { name: { token, created } } } }

function newToken() { return crypto.randomBytes(24).toString('base64url'); }

function timingSafeEqual(a, b) {
  const ab = Buffer.from(String(a || ''));
  const bb = Buffer.from(String(b || ''));
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

function loadHubConfig(configPath) {
  try { return JSON.parse(fs.readFileSync(configPath, 'utf8')); } catch { return null; }
}
function saveHubConfig() {
  const tmp = state.configPath + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(state.cfg, null, 2));
  fs.renameSync(tmp, state.configPath);
}

function repoNameOk(name) { return /^[a-z0-9][a-z0-9._-]{0,80}$/i.test(name) && !name.includes('..'); }
function repoDir(name) { return path.join(state.dir, name + '.git'); }

function bearerOf(req) {
  const m = /^Bearer\s+(.+)$/i.exec(req.headers.authorization || '');
  return m ? m[1].trim() : '';
}

function send(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, { 'content-type': 'application/json', 'content-length': Buffer.byteLength(body) });
  res.end(body);
}

// ---- the two git smart-HTTP endpoints ----
function advertiseRefs(res, service, dir) {
  const child = spawn('git', [service.replace('git-', ''), '--stateless-rpc', '--advertise-refs', dir], { windowsHide: true });
  res.writeHead(200, {
    'content-type': `application/x-${service}-advertisement`,
    'cache-control': 'no-cache',
  });
  // pkt-line header: "# service=git-upload-pack\n" then a flush packet
  const head = `# service=${service}\n`;
  res.write((head.length + 4).toString(16).padStart(4, '0') + head + '0000');
  child.stdout.pipe(res);
  child.on('error', () => { try { res.end(); } catch {} });
}

function serviceRpc(req, res, service, dir) {
  const child = spawn('git', [service.replace('git-', ''), '--stateless-rpc', dir], { windowsHide: true });
  res.writeHead(200, { 'content-type': `application/x-${service}-result`, 'cache-control': 'no-cache' });
  const body = /gzip/.test(req.headers['content-encoding'] || '') ? req.pipe(zlib.createGunzip()) : req;
  body.pipe(child.stdin);
  child.stdout.pipe(res);
  child.on('error', () => { try { res.end(); } catch {} });
}

function handle(req, res) {
  const u = new URL(req.url, 'http://hub.local');

  if (u.pathname === '/api/ping') return send(res, 200, { ok: true, hub: true, name: state.cfg.name || 'helm-hub' });

  if (u.pathname === '/api/repos' && req.method === 'POST') {
    if (!timingSafeEqual(bearerOf(req), state.cfg.adminToken)) return send(res, 401, { ok: false, error: 'bad admin token' });
    let raw = '';
    req.on('data', (d) => { raw += d; if (raw.length > 10000) req.destroy(); });
    req.on('end', () => {
      let name = '', head = '';
      try { const b = JSON.parse(raw); name = String(b.name || ''); head = String(b.head || ''); } catch {}
      name = name.replace(/[^a-zA-Z0-9._-]/g, '-');
      if (!repoNameOk(name)) return send(res, 400, { ok: false, error: 'bad repo name' });
      const dir = repoDir(name);
      const existing = state.cfg.repos[name];
      if (existing && fs.existsSync(dir)) return send(res, 200, { ok: true, repo: name, token: existing.token, created: false });
      const r = spawnSync('git', ['init', '--bare', dir], { windowsHide: true, encoding: 'utf8' });
      if (r.status !== 0) return send(res, 500, { ok: false, error: (r.stderr || 'git init failed').slice(0, 200) });
      // point HEAD at the sharer's branch, or clones land on a detached HEAD
      if (/^[\w./-]{1,100}$/.test(head)) spawnSync('git', ['-C', dir, 'symbolic-ref', 'HEAD', `refs/heads/${head}`], { windowsHide: true });
      state.cfg.repos[name] = { token: newToken(), created: Date.now() };
      saveHubConfig();
      send(res, 200, { ok: true, repo: name, token: state.cfg.repos[name].token, created: true });
    });
    return;
  }

  // /<repo>.git/...
  const m = u.pathname.match(/^\/([^/]+)\.git(\/.*)?$/);
  if (!m) return send(res, 404, { ok: false, error: 'not found' });
  const name = decodeURIComponent(m[1]);
  const rest = m[2] || '/';
  const repo = state.cfg.repos[name];
  if (!repo || !fs.existsSync(repoDir(name))) return send(res, 404, { ok: false, error: 'no such repo' });
  const tok = bearerOf(req);
  if (!timingSafeEqual(tok, repo.token) && !timingSafeEqual(tok, state.cfg.adminToken)) {
    return send(res, 401, { ok: false, error: 'bad token' });
  }

  if (rest === '/info/refs' && req.method === 'GET') {
    const service = u.searchParams.get('service');
    if (service !== 'git-upload-pack' && service !== 'git-receive-pack') return send(res, 400, { ok: false, error: 'smart http only' });
    return advertiseRefs(res, service, repoDir(name));
  }
  if ((rest === '/git-upload-pack' || rest === '/git-receive-pack') && req.method === 'POST') {
    return serviceRpc(req, res, rest.slice(1), repoDir(name));
  }
  send(res, 404, { ok: false, error: 'not found' });
}

// Start the hub. dir = where bare repos live; configPath = hub state file.
// Returns { ok, port, adminToken } — adminToken is minted on first start.
function start(dir, configPath, port = 0) {
  if (state && state.server) return Promise.resolve({ ok: true, port: state.port, adminToken: state.cfg.adminToken, already: true });
  fs.mkdirSync(dir, { recursive: true });
  const cfg = loadHubConfig(configPath) || { adminToken: newToken(), repos: {}, name: 'helm-hub' };
  if (!cfg.repos) cfg.repos = {};
  state = { dir, configPath, server: null, port: 0, cfg };
  saveHubConfig();
  return new Promise((resolve) => {
    const server = http.createServer(handle);
    server.on('error', (e) => { state = null; resolve({ ok: false, error: e.message }); });
    server.listen(port, '127.0.0.1', () => {
      state.server = server;
      state.port = server.address().port;
      resolve({ ok: true, port: state.port, adminToken: cfg.adminToken });
    });
  });
}

function stop() {
  if (state && state.server) { try { state.server.close(); } catch {} }
  state = null;
}

function info() {
  if (!state || !state.server) return { running: false };
  return { running: true, port: state.port, repos: Object.keys(state.cfg.repos), name: state.cfg.name };
}

module.exports = { start, stop, info };
