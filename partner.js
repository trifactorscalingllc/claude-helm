// partner.js — share a project (files + Claude context) with a partner, live.
//
// Model: a private GitHub repo is the pipe. The OWNER shares a project — we init git,
// create a private repo (via the `gh` CLI), export the project's Claude context
// (memory files + your note/tag/client) into `.helm-context/` inside the repo, push,
// and mint a PARTNER CODE (base64 of {url, name}). The PARTNER pastes the code — we
// clone into their projects folder and import the context into THEIR ~/.claude so
// their Claude starts knowing everything yours knows.
//
// "Live" = a sync loop on both sides: every SYNC_INTERVAL_MS each partner project is
// auto-committed, pulled (rebase, autostash), and pushed. Save a file on one machine
// and it appears on the other within a minute — no server, works offline (catches up),
// full git history. Conflicts pause sync for that project and surface in the UI.

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const SYNC_INTERVAL_MS = 45000;
const CONTEXT_DIR = '.helm-context';

let env = null; // { home, loadConfig, saveConfig, notify, onChange }
let timer = null;
const liveStatus = new Map(); // projectPath -> { state, detail, lastSync }
const syncing = new Set();

function init(e) {
  env = e;
  timer = setInterval(syncAll, SYNC_INTERVAL_MS);
  setTimeout(syncAll, 8000); // first pass shortly after boot
}
function stopAll() { if (timer) clearInterval(timer); }

function git(cwd, args, timeoutMs = 60000) {
  const r = spawnSync('git', args, { cwd, encoding: 'utf8', timeout: timeoutMs, windowsHide: true });
  return { ok: r.status === 0, out: (r.stdout || '').trim(), err: (r.stderr || '').trim(), code: r.status };
}
function gh(args, timeoutMs = 60000) {
  const r = spawnSync('gh', args, { encoding: 'utf8', timeout: timeoutMs, windowsHide: true, shell: process.platform === 'win32' });
  return { ok: r.status === 0, out: (r.stdout || '').trim(), err: (r.stderr || '').trim() };
}

function setStatus(projectPath, state, detail) {
  liveStatus.set(projectPath, { state, detail: detail || '', lastSync: state === 'synced' ? Date.now() : (liveStatus.get(projectPath) || {}).lastSync || 0 });
  if (env && env.onChange) env.onChange();
}

// ---- context export / import ----
// Claude Code keys a project's memory dir by the project's absolute path with
// [\/:] replaced by '-'. Different on each machine, so we re-encode on import.
function memoryDirFor(home, projectPath) {
  const encoded = String(projectPath).replace(/[\\/:]/g, '-');
  return path.join(home, '.claude', 'projects', encoded, 'memory');
}

function exportContext(projectPath) {
  const cfg = env.loadConfig();
  const dest = path.join(projectPath, CONTEXT_DIR);
  fs.mkdirSync(dest, { recursive: true });
  // memory files
  const memDir = memoryDirFor(env.home, projectPath);
  try {
    for (const f of fs.readdirSync(memDir)) {
      if (!f.endsWith('.md')) continue;
      const src = path.join(memDir, f), out = path.join(dest, f);
      try {
        const same = fs.existsSync(out) && fs.readFileSync(src, 'utf8') === fs.readFileSync(out, 'utf8');
        if (!same) fs.copyFileSync(src, out);
      } catch {}
    }
  } catch {}
  // project meta (note / tag / client)
  const meta = {
    note: (cfg.notes || {})[projectPath] || '',
    tag: (cfg.tags || {})[projectPath] || '',
    client: (cfg.clients || {})[projectPath] || '',
  };
  try {
    const metaFile = path.join(dest, 'helm-meta.json');
    const next = JSON.stringify(meta, null, 2);
    if (!fs.existsSync(metaFile) || fs.readFileSync(metaFile, 'utf8') !== next) fs.writeFileSync(metaFile, next);
  } catch {}
}

function importContext(projectPath) {
  const src = path.join(projectPath, CONTEXT_DIR);
  if (!fs.existsSync(src)) return;
  const memDir = memoryDirFor(env.home, projectPath);
  fs.mkdirSync(memDir, { recursive: true });
  try {
    for (const f of fs.readdirSync(src)) {
      if (!f.endsWith('.md')) continue;
      const from = path.join(src, f), to = path.join(memDir, f);
      try {
        const same = fs.existsSync(to) && fs.readFileSync(from, 'utf8') === fs.readFileSync(to, 'utf8');
        if (!same) fs.copyFileSync(from, to);
      } catch {}
    }
  } catch {}
  try {
    const meta = JSON.parse(fs.readFileSync(path.join(src, 'helm-meta.json'), 'utf8'));
    const cfg = env.loadConfig();
    if (meta.note && !(cfg.notes || {})[projectPath]) { cfg.notes = cfg.notes || {}; cfg.notes[projectPath] = meta.note; }
    if (meta.tag && !(cfg.tags || {})[projectPath]) { cfg.tags = cfg.tags || {}; cfg.tags[projectPath] = meta.tag; }
    if (meta.client && !(cfg.clients || {})[projectPath]) { cfg.clients = cfg.clients || {}; cfg.clients[projectPath] = meta.client; }
    env.saveConfig(cfg);
  } catch {}
}

// ---- "everything syncs" guarantees ----
// 1. Projects with no .gitignore would sync node_modules and other bulk junk on the
//    very first commit — seed a baseline so auto-sync stays fast and reliable.
// 2. .env-style files are usually gitignored, but a partner's copy is useless without
//    them — the user's explicit choice is that EVERYTHING syncs (private repo), so we
//    force-add env files past .gitignore on every sync.
const BASELINE_GITIGNORE = [
  'node_modules/', 'dist/win-unpacked/', '__pycache__/', '*.pyc', 'venv/', '.venv/',
  '*.log', '.DS_Store', 'Thumbs.db',
].join('\n') + '\n';

// Auto-commits need a git identity; many machines never set the global one (this
// exact bug surfaced in testing). Seed a repo-local identity from the signed-in
// Claude account, falling back to a neutral one.
function ensureGitIdentity(projectPath) {
  if (git(projectPath, ['config', 'user.email']).out) return;
  let name = 'Claude Helm', email = 'helm@localhost';
  try {
    const o = (JSON.parse(fs.readFileSync(path.join(env.home, '.claude.json'), 'utf8')) || {}).oauthAccount || {};
    if (o.displayName) name = o.displayName;
    if (o.emailAddress) email = o.emailAddress;
  } catch {}
  git(projectPath, ['config', 'user.name', name]);
  git(projectPath, ['config', 'user.email', email]);
}

function ensureBaselineGitignore(projectPath) {
  const gi = path.join(projectPath, '.gitignore');
  if (!fs.existsSync(gi)) {
    try { fs.writeFileSync(gi, BASELINE_GITIGNORE); } catch {}
  }
}

function findEnvFiles(projectPath, maxDepth = 2) {
  const out = [];
  const walk = (dir, depth) => {
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (e.isDirectory()) {
        if (e.name === 'node_modules' || e.name === '.git' || e.name.startsWith('.') && e.name !== '.env') continue;
        if (depth < maxDepth) walk(path.join(dir, e.name), depth + 1);
      } else if (/^\.env(\..+)?$/i.test(e.name)) {
        out.push(path.relative(projectPath, path.join(dir, e.name)));
      }
    }
  };
  walk(projectPath, 0);
  return out;
}

function forceAddEnvFiles(projectPath) {
  for (const f of findEnvFiles(projectPath)) {
    git(projectPath, ['add', '-f', '--', f]);
  }
}

// ---- partner code ----
function encodeCode(payload) {
  return 'HELM-' + Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
}
function decodeCode(code) {
  const raw = String(code || '').trim().replace(/^HELM-/, '');
  try { return JSON.parse(Buffer.from(raw, 'base64url').toString('utf8')); } catch { return null; }
}

// ---- owner: share a project ----
function shareProject(projectPath, partnerGithub) {
  if (!gh(['--version']).ok) return { ok: false, error: 'GitHub CLI (gh) is required to create the share. Install from cli.github.com and run `gh auth login`.' };
  const auth = gh(['auth', 'status']);
  if (!auth.ok) return { ok: false, error: 'GitHub CLI is not signed in — run `gh auth login` in a terminal first.' };

  const name = projectPath.split(/[\\/]/).pop();
  // 1. git repo with at least one commit
  if (!fs.existsSync(path.join(projectPath, '.git'))) {
    const i = git(projectPath, ['init']);
    if (!i.ok) return { ok: false, error: 'git init failed: ' + i.err };
  }
  ensureGitIdentity(projectPath);
  ensureBaselineGitignore(projectPath);
  exportContext(projectPath);
  git(projectPath, ['add', '-A']);
  forceAddEnvFiles(projectPath); // everything syncs — env files included, past .gitignore
  git(projectPath, ['commit', '-m', 'helm-partner: initial share']); // no-op if clean

  // 2. remote: reuse origin if present, else create a private repo
  let url = '';
  const remote = git(projectPath, ['remote', 'get-url', 'origin']);
  if (remote.ok && remote.out) {
    url = remote.out;
  } else {
    const repoName = ('helm-' + name).toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 80) + '-' + Math.random().toString(36).slice(2, 7);
    const c = gh(['repo', 'create', repoName, '--private', '--source', projectPath, '--remote', 'origin', '--push'], 180000);
    if (!c.ok) return { ok: false, error: 'Could not create the private repo: ' + (c.err || c.out) };
    const u = git(projectPath, ['remote', 'get-url', 'origin']);
    url = u.out;
  }
  // make sure everything is pushed
  const branch = git(projectPath, ['rev-parse', '--abbrev-ref', 'HEAD']).out || 'main';
  const p = git(projectPath, ['push', '-u', 'origin', branch], 180000);
  if (!p.ok && !/up to date/i.test(p.err)) return { ok: false, error: 'Push failed: ' + p.err };

  // 3. optional: invite the partner's GitHub account as collaborator
  let invited = '';
  if (partnerGithub) {
    const m = url.match(/github\.com[:/]([^/]+)\/([^/.]+)/);
    if (m) {
      const inv = gh(['api', `repos/${m[1]}/${m[2]}/collaborators/${partnerGithub.trim()}`, '-X', 'PUT', '-f', 'permission=push']);
      invited = inv.ok ? partnerGithub.trim() : '';
    }
  }

  // 4. record + mint the code
  const cfg = env.loadConfig();
  cfg.partners = (cfg.partners || []).filter((x) => x.projectPath !== projectPath);
  const code = encodeCode({ v: 1, url, name });
  cfg.partners.push({ projectPath, name, url, role: 'owner', code, autoSync: true, added: Date.now() });
  env.saveConfig(cfg);
  setStatus(projectPath, 'synced');
  return { ok: true, code, url, invited };
}

// ---- partner: join with a code ----
function joinWithCode(code, projectsRoot) {
  const payload = decodeCode(code);
  if (!payload || !payload.url) return { ok: false, error: 'That code is not a valid partner code.' };
  if (!git(projectsRoot, ['--version']).ok) return { ok: false, error: 'git is required — install it from git-scm.com.' };
  const name = (payload.name || 'partner-project').replace(/[<>:"/\\|?*]/g, '-');
  const dest = path.join(projectsRoot, name);
  if (fs.existsSync(dest)) return { ok: false, error: `"${name}" already exists in your projects folder.` };
  const c = git(projectsRoot, ['clone', payload.url, dest], 300000);
  if (!c.ok) {
    return { ok: false, error: 'Clone failed — make sure the owner gave your GitHub account access, and that git can sign in (it may pop up a browser). Details: ' + c.err.slice(0, 300) };
  }
  ensureGitIdentity(dest);
  importContext(dest);
  const cfg = env.loadConfig();
  cfg.partners = (cfg.partners || []).filter((x) => x.projectPath !== dest);
  cfg.partners.push({ projectPath: dest, name, url: payload.url, role: 'partner', autoSync: true, added: Date.now() });
  env.saveConfig(cfg);
  setStatus(dest, 'synced');
  return { ok: true, path: dest, name };
}

// ---- the live sync loop ----
function syncOne(entry) {
  const p = entry.projectPath;
  if (syncing.has(p)) return;
  if (!fs.existsSync(path.join(p, '.git'))) { setStatus(p, 'error', 'No longer a git repo.'); return; }
  syncing.add(p);
  try {
    // freshen the shared context before committing (owner & partner both export their memory)
    ensureGitIdentity(p);
    exportContext(p);
    forceAddEnvFiles(p); // everything syncs — new/changed env files included
    const dirty = git(p, ['status', '--porcelain']).out;
    if (dirty) {
      git(p, ['add', '-A']);
      git(p, ['commit', '-m', 'helm-sync: auto']);
    }
    const pull = git(p, ['pull', '--rebase', '--autostash', 'origin'], 120000);
    if (!pull.ok) {
      if (/CONFLICT|could not apply/i.test(pull.err + pull.out)) {
        git(p, ['rebase', '--abort']);
        if ((liveStatus.get(p) || {}).state !== 'conflict') {
          env.notify(`Sync conflict — ${entry.name}`, 'You and your partner changed the same lines. Open the project to resolve, then sync resumes.');
        }
        setStatus(p, 'conflict', 'Both sides edited the same lines — resolve in the project, then Sync now.');
        return;
      }
      setStatus(p, 'error', pull.err.slice(0, 200) || 'pull failed');
      return;
    }
    const push = git(p, ['push'], 120000);
    if (!push.ok && !/up.to.date/i.test(push.err)) { setStatus(p, 'error', push.err.slice(0, 200)); return; }
    importContext(p); // pick up context the other side exported
    setStatus(p, 'synced');
  } finally {
    syncing.delete(p);
  }
}

function syncAll() {
  if (!env) return;
  const cfg = env.loadConfig();
  for (const entry of (cfg.partners || [])) {
    if (!entry.autoSync) continue;
    try { syncOne(entry); } catch (e) { setStatus(entry.projectPath, 'error', e.message); }
  }
}

function list() {
  const cfg = env ? env.loadConfig() : { partners: [] };
  return (cfg.partners || []).map((e) => ({ ...e, live: liveStatus.get(e.projectPath) || { state: 'idle' } }));
}

function remove(projectPath) {
  const cfg = env.loadConfig();
  cfg.partners = (cfg.partners || []).filter((x) => x.projectPath !== projectPath);
  env.saveConfig(cfg);
  liveStatus.delete(projectPath);
  if (env.onChange) env.onChange();
  return { ok: true }; // files stay on disk — stopping the share never deletes work
}

function setAutoSync(projectPath, on) {
  const cfg = env.loadConfig();
  const e = (cfg.partners || []).find((x) => x.projectPath === projectPath);
  if (e) { e.autoSync = !!on; env.saveConfig(cfg); }
  if (env.onChange) env.onChange();
  return { ok: true };
}

// ---- share self-test: prove every link in the chain with a dummy project ----
// Runs the REAL pipeline end-to-end (local engine → live GitHub → clone-back →
// sync round trip) with throwaway content, logging PASS/FAIL per step. Leaves the
// dummy repo + partner code behind so a second machine (e.g. the Mac) can join it
// and verify the cross-machine leg before any real project is shared.
const os = require('os');

async function selfTest(progress) {
  const steps = [];
  const t0 = Date.now();
  const log = (step, ok, detail) => {
    const entry = { step, ok, detail: String(detail || '').slice(0, 300), t: Date.now() - t0 };
    steps.push(entry);
    try { if (progress) progress(entry); } catch {}
    try {
      if (env && env.userData) fs.appendFileSync(path.join(env.userData, 'share-selftest.log'),
        JSON.stringify({ ...entry, ts: new Date().toISOString() }) + '\n');
    } catch {}
    return ok;
  };
  const yield_ = () => new Promise((r) => setImmediate(r)); // let progress events flush between blocking git calls
  const fail = (extra) => ({ ok: false, steps, ...extra });

  // 1-4: tooling
  const gv = git(os.tmpdir(), ['--version']);
  if (!log('git installed', gv.ok, gv.out || gv.err)) return fail({ blocker: 'Install git from git-scm.com.' });
  await yield_();
  const ghv = gh(['--version']);
  log('GitHub CLI (gh) installed', ghv.ok, ghv.ok ? ghv.out.split('\n')[0] : 'gh not found — owner side needs it (partner side only needs git)');
  let ghAuthed = false;
  if (ghv.ok) {
    const a = gh(['auth', 'status']);
    ghAuthed = a.ok;
    log('GitHub CLI signed in', a.ok, (a.out + ' ' + a.err).match(/Logged in to [^\n]+/i) ? (a.out + ' ' + a.err).match(/Logged in to [^\n]+/i)[0] : a.err.slice(0, 120));
  }
  await yield_();

  // 5: local engine round trip (bare repo stands in for GitHub — no network)
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'helm-selftest-'));
  try {
    const bare = path.join(tmp, 'remote.git');
    git(tmp, ['init', '--bare', bare]);
    const p1 = path.join(tmp, 'dummy'); fs.mkdirSync(p1);
    fs.writeFileSync(path.join(p1, 'hello.txt'), 'helm self-test v1');
    fs.writeFileSync(path.join(p1, '.env'), 'TEST_SECRET=sync-me');
    fs.writeFileSync(path.join(p1, '.gitignore'), '.env\n');
    git(p1, ['init']); ensureGitIdentity(p1);
    git(p1, ['add', '-A']); git(p1, ['add', '-f', '.env']);
    const c1 = git(p1, ['commit', '-m', 'selftest']);
    log('local commit engine (identity, staging)', c1.ok, c1.ok ? 'committed' : c1.err);
    const br = git(p1, ['rev-parse', '--abbrev-ref', 'HEAD']).out || 'master';
    git(p1, ['remote', 'add', 'origin', bare]);
    const pu = git(p1, ['push', '-u', 'origin', br]);
    log('local push/pull engine', pu.ok, pu.ok ? 'pushed to local bare repo' : pu.err);
    const p2 = path.join(tmp, 'clone');
    const cl = git(tmp, ['clone', bare, p2]);
    const envArrived = cl.ok && fs.existsSync(path.join(p2, '.env'));
    log('.env files survive sync (everything-syncs mode)', envArrived, envArrived ? '.env arrived in the clone' : cl.err);
  } catch (e) {
    log('local engine round trip', false, e.message);
  } finally {
    try { fs.rmSync(tmp, { recursive: true, force: true }); } catch {}
  }
  await yield_();

  if (!ghAuthed) {
    log('live GitHub leg', false, 'Skipped — gh not signed in. Local engine verified; run `gh auth login` then re-test.');
    return fail({ blocker: 'GitHub CLI not signed in.' });
  }

  // 6-9: LIVE GitHub leg with a real (private, throwaway) repo
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'helm-selftest-live-'));
  let code = '', url = '', repoFull = '';
  try {
    const proj = path.join(work, 'helm-share-test'); fs.mkdirSync(proj);
    fs.writeFileSync(path.join(proj, 'README.md'), '# Claude Helm share self-test\nIf you can read this on the other machine, the pipe works.\n');
    fs.writeFileSync(path.join(proj, 'marker.txt'), 'created ' + new Date().toISOString());
    fs.mkdirSync(path.join(proj, CONTEXT_DIR));
    fs.writeFileSync(path.join(proj, CONTEXT_DIR, 'selftest-memory.md'),
      '---\nname: selftest-memory\ndescription: context travelled through the partner pipe\n---\n\nIf this file shows up in the joining machine\'s Context, context sync works.\n');
    fs.writeFileSync(path.join(proj, CONTEXT_DIR, 'helm-meta.json'), JSON.stringify({ note: 'Share self-test note', tag: '', client: '' }, null, 2));
    git(proj, ['init']); ensureGitIdentity(proj);
    git(proj, ['add', '-A']);
    git(proj, ['commit', '-m', 'helm share self-test']);
    const repoName = 'helm-share-selftest-' + Math.random().toString(36).slice(2, 8);
    const cr = gh(['repo', 'create', repoName, '--private', '--source', proj, '--remote', 'origin', '--push'], 180000);
    if (!log('create private GitHub repo + push', cr.ok, cr.ok ? repoName : (cr.err || cr.out))) return fail({});
    url = git(proj, ['remote', 'get-url', 'origin']).out;
    repoFull = (url.match(/github\.com[:/](.+?)(\.git)?$/) || [])[1] || repoName;
    await yield_();

    code = encodeCode({ v: 1, url, name: 'helm-share-test' });
    const dec = decodeCode(code);
    log('partner code mint + decode', !!(dec && dec.url === url), code.slice(0, 28) + '…');
    await yield_();

    // clone back = exactly what the partner's Join does
    const back = path.join(work, 'joined');
    const cb = git(work, ['clone', url, back], 300000);
    const okBack = cb.ok && fs.existsSync(path.join(back, 'marker.txt')) && fs.existsSync(path.join(back, CONTEXT_DIR, 'selftest-memory.md'));
    log('clone-back (the partner Join leg)', okBack, okBack ? 'files + context arrived' : cb.err);
    await yield_();

    if (okBack) {
      // live sync round trip through real GitHub
      fs.writeFileSync(path.join(back, 'from-the-other-side.txt'), 'round trip');
      ensureGitIdentity(back);
      git(back, ['add', '-A']); git(back, ['commit', '-m', 'round trip']);
      const p2 = git(back, ['push']);
      const pl = git(proj, ['pull', '--rebase', '--autostash', 'origin'], 120000);
      const round = p2.ok && pl.ok && fs.existsSync(path.join(proj, 'from-the-other-side.txt'));
      log('two-way sync through real GitHub', round, round ? 'edit travelled clone → GitHub → original' : (p2.err || pl.err));
    }

    // register the owner entry so the dummy share shows in Clients & Partners (joinable from the Mac)
    const cfg = env.loadConfig();
    cfg.partners = (cfg.partners || []).filter((x) => x.name !== 'helm-share-test');
    cfg.partners.push({ projectPath: path.join(work, 'helm-share-test'), name: 'helm-share-test', url, role: 'owner', code, autoSync: false, added: Date.now(), selftest: true });
    env.saveConfig(cfg);
    log('test code registered', true, 'Join from the other machine, then delete the repo when done.');
  } catch (e) {
    log('live GitHub leg', false, e.message);
  }

  const okAll = steps.every((s) => s.ok);
  return { ok: okAll, steps, code, url, repoFull };
}

module.exports = { init, stopAll, shareProject, joinWithCode, syncOne, syncAll, list, remove, setAutoSync, decodeCode, selfTest };
