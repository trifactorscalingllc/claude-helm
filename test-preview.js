// End-to-end test for preview.js — run with: node test-preview.js
// Builds throwaway projects in TEMP, then proves detect() finds them and
// launch() actually serves real bytes over HTTP.
const fs = require('fs');
const path = require('path');
const os = require('os');
const http = require('http');
const preview = require('./preview');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'helm-preview-test-'));
let failures = 0;

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', reject);
  });
}
function check(label, cond, extra) {
  if (cond) console.log(`  PASS  ${label}`);
  else { failures++; console.log(`  FAIL  ${label}${extra ? ' — ' + extra : ''}`); }
}
function mk(rel, content) {
  const f = path.join(tmp, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, content);
}

async function testNestedHtmlNoIndex() {
  console.log('\n[1] nested page.html (no index.html, depth 2)');
  const proj = path.join(tmp, 'p1');
  mk('p1/site/pages/page.html', '<h1>hello-from-nested-page</h1>');
  mk('p1/README.md', 'not html');
  const d = preview.detect(proj);
  check('detected as static', d.launchable && d.type === 'static', JSON.stringify(d));
  const r = await preview.launch(proj, 'p1', 'window');
  check('launch ok', r.ok, r.error);
  const res = await get(r.url);
  check('served 200 with content', res.status === 200 && res.body.includes('hello-from-nested-page'), `status=${res.status}`);
  preview.stop(proj);
}

async function testNestedIndexBeatsOtherHtml() {
  console.log('\n[2] nested index.html preferred over other html');
  const proj = path.join(tmp, 'p2');
  mk('p2/docs/aaa.html', '<h1>wrong</h1>');
  mk('p2/web/index.html', '<h1>right-index</h1>');
  const d = preview.detect(proj);
  check('picked index.html', d.file && /^index\.html$/i.test(d.file), JSON.stringify(d));
  const r = await preview.launch(proj, 'p2', 'window');
  const res = await get(r.url);
  check('serves the index', res.status === 200 && res.body.includes('right-index'), res.body.slice(0, 60));
  preview.stop(proj);
}

async function testNestedDevServer() {
  console.log('\n[3] nested package.json dev script (depth 1) actually boots');
  const proj = path.join(tmp, 'p3');
  mk('p3/app/server.js', `
    const http = require('http');
    const s = http.createServer((req, res) => res.end('hello-from-dev-server'));
    s.listen(0, '127.0.0.1', () => console.log('Listening on http://localhost:' + s.address().port + '/'));
  `);
  mk('p3/app/package.json', JSON.stringify({ name: 'p3app', scripts: { dev: 'node server.js' } }));
  const d = preview.detect(proj);
  check('detected as server with nested cwd', d.launchable && d.type === 'server' && d.cwd && d.cwd.endsWith('app'), JSON.stringify(d));
  const ready = new Promise((resolve) => preview.bus.once('ready', resolve));
  const r = preview.launch(proj, 'p3', 'window');
  const ev = await Promise.race([ready, new Promise((res) => setTimeout(() => res(null), 20000))]);
  check('dev server URL captured', !!(ev && ev.url), 'no ready event in 20s');
  if (ev && ev.url) {
    const res = await get(ev.url);
    check('dev server responds', res.status === 200 && res.body.includes('hello-from-dev-server'), res.body.slice(0, 60));
  }
  preview.stop(proj);
}

async function testRootIndexBeatsNestedApp() {
  console.log('\n[4] root index.html outranks a deeper dev app');
  const proj = path.join(tmp, 'p4');
  mk('p4/index.html', '<h1>root-site</h1>');
  mk('p4/tools/gen/package.json', JSON.stringify({ scripts: { start: 'node x.js' } }));
  const d = preview.detect(proj);
  check('root static wins', d.type === 'static' && d.dir === proj, JSON.stringify(d));
}

async function testNotLaunchable() {
  console.log('\n[5] plain folder is not launchable');
  const proj = path.join(tmp, 'p5');
  mk('p5/notes.txt', 'nothing here');
  const d = preview.detect(proj);
  check('not launchable', !d.launchable, JSON.stringify(d));
}

(async () => {
  try {
    await testNestedHtmlNoIndex();
    await testNestedIndexBeatsOtherHtml();
    await testNestedDevServer();
    await testRootIndexBeatsNestedApp();
    await testNotLaunchable();
  } catch (e) {
    failures++;
    console.log('  FAIL  unexpected error — ' + e.message);
  } finally {
    preview.stopAll();
    try { fs.rmSync(tmp, { recursive: true, force: true }); } catch {}
  }
  console.log(failures ? `\n${failures} FAILURE(S)` : '\nALL TESTS PASSED');
  process.exit(failures ? 1 : 0);
})();
