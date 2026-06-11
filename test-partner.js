// End-to-end test for partner.js — run with: node test-partner.js
// Simulates two machines (separate fake homes + configs) sharing one project through
// a local bare git repo (standing in for the private GitHub repo). Proves:
//   • everything syncs, including .env files that .gitignore would normally hide
//   • Claude context (memory + meta) travels owner → partner
//   • edits propagate BOTH ways through the auto-sync path (syncOne)
//   • conflict-free round trips leave both sides "synced"
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');
const partner = require('./partner');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'helm-partner-test-'));
let failures = 0;
const check = (label, cond, extra) => {
  if (cond) console.log(`  PASS  ${label}`);
  else { failures++; console.log(`  FAIL  ${label}${extra ? ' — ' + extra : ''}`); }
};
const sh = (cwd, cmd, args) => spawnSync(cmd, args, { cwd, encoding: 'utf8', windowsHide: true });
const write = (f, c) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, c); };

// two "machines": separate homes + separate in-memory configs
function machine(name) {
  const home = path.join(tmp, 'home-' + name);
  fs.mkdirSync(home, { recursive: true });
  let cfg = { notes: {}, tags: {}, clients: {}, partners: [] };
  return {
    home,
    env: {
      home,
      loadConfig: () => cfg,
      saveConfig: (c) => { cfg = c; },
      notify: () => {},
      onChange: () => {},
    },
    cfg: () => cfg,
  };
}
const memDirFor = (home, proj) => path.join(home, '.claude', 'projects', proj.replace(/[\\/:]/g, '-'), 'memory');

(async () => {
  const A = machine('owner'), B = machine('partner');

  // --- the "GitHub" repo: a local bare repo ---
  const bare = path.join(tmp, 'remote.git');
  sh(tmp, 'git', ['init', '--bare', bare]);

  // --- owner project: site + gitignored .env + Claude memory ---
  const projA = path.join(tmp, 'projects-A', 'client-site');
  write(path.join(projA, 'index.html'), '<h1>v1</h1>');
  write(path.join(projA, '.env'), 'API_KEY=secret123');
  write(path.join(projA, '.gitignore'), '.env\nnode_modules/\n');
  write(path.join(memDirFor(A.home, projA), 'project-context.md'), '---\nname: project-context\ndescription: client wants blue buttons\n---\n\nThe client insists on blue CTAs.');
  A.cfg().notes[projA] = 'Launch deadline: Friday';
  A.cfg().clients[projA] = 'JC Roofing';

  console.log('\n[1] owner shares (git plumbing, local bare remote standing in for GitHub)');
  partner.init(A.env);
  sh(projA, 'git', ['init']);
  sh(projA, 'git', ['remote', 'add', 'origin', bare]);
  A.cfg().partners.push({ projectPath: projA, name: 'client-site', url: bare, role: 'owner', autoSync: true });
  partner.syncOne(A.cfg().partners[0]); // first sync errors on pull (empty remote) — expected; push manually like shareProject does
  sh(projA, 'git', ['add', '-A']);
  sh(projA, 'git', ['add', '-f', '.env']);
  sh(projA, 'git', ['commit', '-m', 'initial']);
  const br = sh(projA, 'git', ['rev-parse', '--abbrev-ref', 'HEAD']).stdout.trim();
  const push = sh(projA, 'git', ['push', '-u', 'origin', br]);
  check('initial push ok', push.status === 0, push.stderr);
  partner.syncOne(A.cfg().partners[0]); // now exports context + env and pushes
  const lsRemote = sh(projA, 'git', ['ls-tree', '-r', '--name-only', 'origin/' + br]).stdout;
  check('.env synced past .gitignore', lsRemote.includes('.env'), lsRemote);
  check('context exported to repo', lsRemote.includes('.helm-context/project-context.md'), lsRemote);
  check('meta exported (note/client)', lsRemote.includes('.helm-context/helm-meta.json'));

  console.log('\n[2] partner joins with the code');
  partner.init(B.env);
  const code = 'HELM-' + Buffer.from(JSON.stringify({ v: 1, url: bare, name: 'client-site' })).toString('base64url');
  const projectsB = path.join(tmp, 'projects-B');
  fs.mkdirSync(projectsB, { recursive: true });
  const j = partner.joinWithCode(code, projectsB);
  check('join ok', j.ok, j.error);
  const projB = j.path;
  check('files arrived', fs.existsSync(path.join(projB, 'index.html')));
  check('.env arrived (partner can run the app)', fs.existsSync(path.join(projB, '.env')));
  const memB = path.join(memDirFor(B.home, projB), 'project-context.md');
  check('Claude context imported on partner machine', fs.existsSync(memB));
  check('note/client meta imported', B.cfg().notes[projB] === 'Launch deadline: Friday' && B.cfg().clients[projB] === 'JC Roofing');

  console.log('\n[3] partner edits → owner receives (live sync round trip)');
  write(path.join(projB, 'index.html'), '<h1>v2-from-partner</h1>');
  write(path.join(projB, '.env.local'), 'PARTNER_KEY=abc');
  partner.syncOne(B.cfg().partners[0]);
  partner.init(A.env); // switch back to "machine A"
  partner.syncOne(A.cfg().partners[0]);
  check('owner got the edit', fs.readFileSync(path.join(projA, 'index.html'), 'utf8').includes('v2-from-partner'));
  check('owner got the new .env.local', fs.existsSync(path.join(projA, '.env.local')));

  console.log('\n[4] owner edits + memory update → partner receives');
  write(path.join(projA, 'styles.css'), 'h1{color:blue}');
  write(path.join(memDirFor(A.home, projA), 'new-insight.md'), '---\nname: new-insight\ndescription: client approved blue\n---\n\nApproved.');
  partner.syncOne(A.cfg().partners[0]);
  partner.init(B.env);
  partner.syncOne(B.cfg().partners[0]);
  check('partner got the new file', fs.existsSync(path.join(projB, 'styles.css')));
  check('partner got the new memory', fs.existsSync(path.join(memDirFor(B.home, projB), 'new-insight.md')));

  console.log('\n[5] joining is never a dead end (existing folders)');
  // rejoin after "Stop": the folder stays on disk by design — the same code must reconnect it
  partner.init(B.env);
  const cfgB = B.cfg();
  cfgB.partners = [];
  B.env.saveConfig(cfgB);
  const rejoin = partner.joinWithCode(code, projectsB);
  check('rejoin adopts the existing folder', rejoin.ok && rejoin.adopted === true, rejoin.error || JSON.stringify(rejoin));
  check('rejoin points at the same path', rejoin.path === projB, rejoin.path);
  check('partner entry restored', B.cfg().partners.some((x) => x.projectPath === projB));

  // an unrelated folder owns the name → clone lands beside it, not refused
  const projectsC = path.join(tmp, 'projects-C');
  fs.mkdirSync(path.join(projectsC, 'client-site'), { recursive: true });
  write(path.join(projectsC, 'client-site', 'mine.txt'), 'an unrelated project');
  const beside = partner.joinWithCode(code, projectsC);
  check('occupied name clones beside it', beside.ok && beside.renamed === true, beside.error || JSON.stringify(beside));
  check('lands in name-shared', path.basename(beside.path) === 'client-site-shared', beside.path);
  check('original folder untouched', fs.existsSync(path.join(projectsC, 'client-site', 'mine.txt')));
  check('share files arrived in the new folder', fs.existsSync(path.join(beside.path, 'index.html')));

  // an empty husk from a cancelled clone → reused, not refused
  const projectsD = path.join(tmp, 'projects-D');
  fs.mkdirSync(path.join(projectsD, 'client-site'), { recursive: true });
  const husk = partner.joinWithCode(code, projectsD);
  check('empty leftover folder is reused', husk.ok && !husk.renamed && path.basename(husk.path) === 'client-site', husk.error || husk.path);

  console.log('\n[6] a project with its own remote shares via helm-share, origin untouched');
  check('helm repo URLs recognized (https)', partner.isHelmShareUrl('https://github.com/u/helm-dionet-ab12c'));
  check('helm repo URLs recognized (.git)', partner.isHelmShareUrl('https://github.com/u/helm-client-site-x.git'));
  check('helm repo URLs recognized (ssh)', partner.isHelmShareUrl('git@github.com:u/helm-site-9z.git'));
  check('own repos NOT treated as share repos', !partner.isHelmShareUrl('https://github.com/u/claude-helm') && !partner.isHelmShareUrl('https://github.com/u/dionet'));

  // syncOne must honor entry.remote: edits flow through the share remote only
  partner.init(A.env);
  const ownRemote = path.join(tmp, 'own-remote.git');
  sh(tmp, 'git', ['init', '--bare', ownRemote]);
  const shareRemote = path.join(tmp, 'share-remote.git');
  sh(tmp, 'git', ['init', '--bare', shareRemote]);
  const projE = path.join(tmp, 'projects-E', 'has-own-repo');
  write(path.join(projE, 'app.js'), 'console.log(1)');
  write(path.join(projE, '.env'), 'SECRET=topsecret');
  write(path.join(projE, '.gitignore'), '.env\n');
  sh(projE, 'git', ['init']);
  sh(projE, 'git', ['remote', 'add', 'origin', ownRemote]);
  sh(projE, 'git', ['remote', 'add', 'helm-share', shareRemote]);
  sh(projE, 'git', ['add', '-A']);
  sh(projE, 'git', ['-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '-m', 'own work']);
  const brE = sh(projE, 'git', ['rev-parse', '--abbrev-ref', 'HEAD']).stdout.trim();
  sh(projE, 'git', ['push', 'origin', brE]); // the project's own repo has the clean version
  sh(projE, 'git', ['push', '-u', 'helm-share', brE]);
  const entryE = { projectPath: projE, name: 'has-own-repo', url: shareRemote, role: 'owner', remote: 'helm-share', autoSync: true };
  write(path.join(projE, 'feature.js'), 'console.log(2)');
  partner.syncOne(entryE);
  const shareTree = sh(projE, 'git', ['ls-tree', '-r', '--name-only', 'helm-share/' + brE]).stdout;
  const ownTree = sh(projE, 'git', ['ls-tree', '-r', '--name-only', 'origin/' + brE]).stdout;
  check('sync pushed to the share remote', shareTree.includes('feature.js'), shareTree);
  check('share remote carries the env file', shareTree.includes('.env'));
  check('the project\'s own remote did NOT receive sync commits', !ownTree.includes('feature.js') && !ownTree.includes('.helm-context'), ownTree);

  console.log('\n[7] v2 codes: the access key travels in the code (no GitHub account)');
  partner.init(B.env);
  const fakeKey = Buffer.from('-----BEGIN OPENSSH PRIVATE KEY-----\nfake-for-test\n-----END OPENSSH PRIVATE KEY-----\n', 'utf8').toString('base64url');
  const codeV2 = 'HELM-' + Buffer.from(JSON.stringify({ v: 2, url: bare, ssh: bare, key: fakeKey, name: 'keyed-site' })).toString('base64url');
  const p2 = partner.decodeCode(codeV2);
  check('v2 payload round-trips', p2 && p2.v === 2 && p2.key === fakeKey && p2.ssh === bare);
  const projectsF = path.join(tmp, 'projects-F');
  fs.mkdirSync(projectsF, { recursive: true });
  const jk = partner.joinWithCode(codeV2, projectsF);
  check('v2 join ok', jk.ok && jk.keyless === true, jk.error || JSON.stringify(jk));
  const keyFiles = fs.readdirSync(path.join(B.home, '.claude', 'helm-keys')).filter((f) => f.endsWith('.key'));
  check('key file installed under ~/.claude/helm-keys', keyFiles.length >= 1, keyFiles);
  const sshCmd = sh(jk.path, 'git', ['config', 'core.sshCommand']).stdout.trim();
  check('core.sshCommand persisted for the sync loop', /ssh -i ".*\.key" -o IdentitiesOnly=yes/.test(sshCmd), sshCmd);
  check('key file contents restored from the code', fs.readFileSync(path.join(B.home, '.claude', 'helm-keys', keyFiles[0]), 'utf8').includes('fake-for-test'));
  check('v2 entry registered', B.cfg().partners.some((x) => x.projectPath === jk.path));
  // rejoin with a v2 code adopts AND refreshes the key config
  const cfgB2 = B.cfg(); cfgB2.partners = cfgB2.partners.filter((x) => x.projectPath !== jk.path); B.env.saveConfig(cfgB2);
  const jk2 = partner.joinWithCode(codeV2, projectsF);
  check('v2 rejoin adopts in place', jk2.ok && jk2.adopted === true, jk2.error || JSON.stringify(jk2));

  console.log('\n[8] local-data seed: gitignored dbs/uploads snapshot once, never overwrite');
  partner.init(A.env);
  const entryA = A.cfg().partners.find((x) => x.projectPath === projA);
  write(path.join(projA, 'dev.sqlite'), 'OWNER-DB-DATA');
  write(path.join(projA, 'uploads', 'logo.png'), 'PNG-BYTES');
  write(path.join(projA, 'debug.log'), 'not data — must not seed');
  fs.appendFileSync(path.join(projA, '.gitignore'), 'dev.sqlite\nuploads/\n*.log\n');
  const seedRes = partner.exportSeedData(projA);
  check('db + uploads seeded', seedRes.seeded.includes('dev.sqlite') && seedRes.seeded.some((s) => s.includes('logo.png')), seedRes.seeded);
  check('logs not seeded', !seedRes.seeded.some((s) => s.includes('debug.log')));
  check('seed is one-time (second call no-ops)', partner.exportSeedData(projA).seeded.length === 0);
  partner.syncOne(entryA); // commits + pushes the seed
  partner.init(B.env);
  partner.syncOne(B.cfg().partners[0]); // partner pulls it
  check('partner received the db seed', fs.existsSync(path.join(projB, '.helm-context', 'seed', 'dev.sqlite')));
  write(path.join(projB, 'dev.sqlite'), 'PARTNER-LOCAL-DB'); // simulate partner already having data
  partner.syncOne(B.cfg().partners[0]); // importContext runs importSeedData
  check('seed never overwrites existing data', fs.readFileSync(path.join(projB, 'dev.sqlite'), 'utf8') === 'PARTNER-LOCAL-DB');
  fs.rmSync(path.join(projB, 'uploads'), { recursive: true, force: true });
  partner.syncOne(B.cfg().partners[0]);
  check('missing seeded files restored on partner', fs.existsSync(path.join(projB, 'uploads', 'logo.png')));

  console.log('\n[9] auto-setup detection (no network — mapping only)');
  const det = path.join(tmp, 'detect');
  fs.mkdirSync(det, { recursive: true });
  check('no package.json → no setup', partner.detectInstall(det) === null);
  write(path.join(det, 'package.json'), '{}');
  check('bare package.json → npm install', JSON.stringify(partner.detectInstall(det)) === JSON.stringify({ cmd: 'npm', args: ['install'] }));
  write(path.join(det, 'package-lock.json'), '{}');
  check('package-lock → npm ci', partner.detectInstall(det).args[0] === 'ci');
  write(path.join(det, 'yarn.lock'), '');
  check('yarn.lock wins over npm lock', partner.detectInstall(det).cmd === 'yarn');
  write(path.join(det, 'pnpm-lock.yaml'), '');
  check('pnpm lock wins', partner.detectInstall(det).cmd === 'pnpm');

  console.log('\n[10] conversation history export (idle sessions only)');
  partner.init(A.env);
  const trA = path.dirname(memDirFor(A.home, projA));
  write(path.join(trA, 'sess-old.jsonl'), JSON.stringify({ type: 'ai-title', aiTitle: 'Old finished session' }) + '\n');
  const old = new Date(Date.now() - 30 * 60000);
  fs.utimesSync(path.join(trA, 'sess-old.jsonl'), old, old);
  write(path.join(trA, 'sess-live.jsonl'), JSON.stringify({ type: 'ai-title', aiTitle: 'Live right now' }) + '\n'); // fresh mtime
  partner.exportSessions(projA);
  check('idle session exported', fs.existsSync(path.join(projA, '.helm-context', 'sessions', 'sess-old.jsonl')));
  check('live session NOT exported (still being written)', !fs.existsSync(path.join(projA, '.helm-context', 'sessions', 'sess-live.jsonl')));
  partner.syncOne(A.cfg().partners[0]);
  partner.init(B.env);
  partner.syncOne(B.cfg().partners[0]);
  check('partner received the session history', fs.existsSync(path.join(projB, '.helm-context', 'sessions', 'sess-old.jsonl')));

  partner.stopAll();
  try { fs.rmSync(tmp, { recursive: true, force: true }); } catch {}
  console.log(failures ? `\n${failures} FAILURE(S)` : '\nALL TESTS PASSED');
  process.exit(failures ? 1 : 0);
})();

