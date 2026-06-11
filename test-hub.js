// Tests for hub.js — the Helm Hub git smart-HTTP server, fully local.
// Proves: repo creation API, token auth (reject/accept), real `git push` and
// `git clone` through the HTTP server, and idempotent re-create.
// Run: node test-hub.js
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');
const hub = require('./hub');

let pass = 0, fail = 0;
const check = (label, cond, extra) => {
  if (cond) { pass++; console.log('  PASS ', label); }
  else { fail++; console.log('  FAIL ', label, extra !== undefined ? `— ${JSON.stringify(extra)}` : ''); }
};
// ASYNC git: the hub server lives in THIS process — spawnSync would block the
// event loop while git waits for the server's response (deadlock by design).
// GIT_TERMINAL_PROMPT=0 + no credential helper: a 401 must FAIL, not hang on
// an interactive password prompt (same settings the real client uses).
function sh(cwd, args, env) {
  return new Promise((resolve) => {
    const child = spawn('git', ['-c', 'credential.helper='].concat(args), {
      cwd, windowsHide: true,
      env: { ...process.env, GIT_TERMINAL_PROMPT: '0', GCM_INTERACTIVE: 'Never', ...(env || {}) },
    });
    let stdout = '', stderr = '';
    child.stdout.on('data', (d) => stdout += d);
    child.stderr.on('data', (d) => stderr += d);
    const t = setTimeout(() => { try { child.kill(); } catch {} }, 60000);
    child.on('close', (code) => { clearTimeout(t); resolve({ status: code, stdout, stderr }); });
    child.on('error', (e) => { clearTimeout(t); resolve({ status: -1, stdout, stderr: String(e) }); });
  });
}

function post(port, pathName, body, token) {
  return new Promise((resolve) => {
    const data = JSON.stringify(body);
    const req = http.request({ host: '127.0.0.1', port, path: pathName, method: 'POST', headers: { 'content-type': 'application/json', 'content-length': Buffer.byteLength(data), ...(token ? { authorization: `Bearer ${token}` } : {}) } }, (res) => {
      let raw = '';
      res.on('data', (d) => raw += d);
      res.on('end', () => { let o = null; try { o = JSON.parse(raw); } catch {} resolve({ status: res.statusCode, body: o }); });
    });
    req.end(data);
  });
}

(async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'helm-hub-test-'));
  const hubDir = path.join(tmp, 'HelmHub');

  console.log('\n[1] hub boots and mints an admin token');
  const s = await hub.start(hubDir, path.join(tmp, 'hub-config.json'));
  check('hub started', s.ok && s.port > 0, s);
  check('admin token minted', typeof s.adminToken === 'string' && s.adminToken.length > 20);

  console.log('\n[2] repo management API');
  // the sharer's branch travels with the create call so clones get a real HEAD
  const work = path.join(tmp, 'work'); fs.mkdirSync(work);
  fs.writeFileSync(path.join(work, 'index.html'), '<h1>hub!</h1>');
  await sh(work, ['init']);
  await sh(work, ['-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '--allow-empty', '-m', 'root']);
  await sh(work, ['add', '-A']);
  await sh(work, ['-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '-m', 'site']);
  const br = (await sh(work, ['rev-parse', '--abbrev-ref', 'HEAD'])).stdout.trim();
  const noAuth = await post(s.port, '/api/repos', { name: 'client-site', head: br });
  check('create rejected without admin token', noAuth.status === 401);
  const mk = await post(s.port, '/api/repos', { name: 'client-site', head: br }, s.adminToken);
  check('repo created', mk.status === 200 && mk.body.ok && mk.body.created === true, mk.body);
  const repoToken = mk.body.token;
  check('repo token minted', typeof repoToken === 'string' && repoToken.length > 20);
  const again = await post(s.port, '/api/repos', { name: 'client-site', head: br }, s.adminToken);
  check('re-create is idempotent (same token, created:false)', again.body.token === repoToken && again.body.created === false);
  const evil = await post(s.port, '/api/repos', { name: '../escape' }, s.adminToken);
  check('path traversal rejected or sanitized', evil.status === 400 || (evil.body.ok && !evil.body.repo.includes('..')), evil.body);

  console.log('\n[3] real git push/clone through the hub (token auth)');
  const base = `http://127.0.0.1:${s.port}/client-site.git`;
  const authCfg = (tok) => ['-c', `http.extraHeader=Authorization: Bearer ${tok}`];
  const badPush = await sh(work, [...authCfg('wrong-token'), 'push', base, br]);
  check('push rejected with a bad token', badPush.status !== 0, badPush.stderr.slice(0, 80));
  const goodPush = await sh(work, [...authCfg(repoToken), 'push', base, br]);
  check('push accepted with the repo token', goodPush.status === 0, goodPush.stderr.slice(-200));
  const badClone = await sh(tmp, ['clone', base, path.join(tmp, 'cloned-bad')]);
  check('clone rejected without token', badClone.status !== 0);
  const cloneDir = path.join(tmp, 'cloned');
  const goodClone = await sh(tmp, [...authCfg(repoToken), 'clone', base, cloneDir]);
  check('clone works with the token', goodClone.status === 0, goodClone.stderr.slice(-200));
  check('cloned content intact', fs.existsSync(path.join(cloneDir, 'index.html')));
  check('clone is on the sharer\'s branch (HEAD followed)', (await sh(cloneDir, ['rev-parse', '--abbrev-ref', 'HEAD'])).stdout.trim() === br);

  console.log('\n[4] round trip: edit in clone → push → fetch in original');
  fs.writeFileSync(path.join(cloneDir, 'new.txt'), 'from the other side');
  await sh(cloneDir, ['config', 'http.extraHeader', `Authorization: Bearer ${repoToken}`]);
  await sh(cloneDir, ['add', '-A']);
  await sh(cloneDir, ['-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '-m', 'edit']);
  const p2 = await sh(cloneDir, ['push']);
  check('clone pushes via persisted extraHeader', p2.status === 0, p2.stderr.slice(-200));
  const f = await sh(work, [...authCfg(repoToken), 'pull', base, br]);
  check('original pulls the edit back', f.status === 0 && fs.existsSync(path.join(work, 'new.txt')), f.stderr.slice(-200));

  hub.stop();
  try { fs.rmSync(tmp, { recursive: true, force: true }); } catch {} // Windows can hold pack-file locks briefly
  console.log(fail === 0 ? '\nALL HUB TESTS PASSED' : `\n${fail} FAILED`);
  process.exit(fail === 0 ? 0 : 1);
})();
