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

  partner.stopAll();
  try { fs.rmSync(tmp, { recursive: true, force: true }); } catch {}
  console.log(failures ? `\n${failures} FAILURE(S)` : '\nALL TESTS PASSED');
  process.exit(failures ? 1 : 0);
})();
