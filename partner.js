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
  exportContext(projectPath);
  git(projectPath, ['add', '-A']);
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
    exportContext(p);
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

module.exports = { init, stopAll, shareProject, joinWithCode, syncOne, syncAll, list, remove, setAutoSync, decodeCode };
