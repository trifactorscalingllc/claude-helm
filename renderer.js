// ---------- icon set (stroke, inherits currentColor) ----------
const ICONS = {
  grid: '<path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  star: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
  drive: '<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  message: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
  terminal: '<path d="M4 17l6-6-6-6M12 19h8"/>',
  coin: '<circle cx="12" cy="12" r="9"/><path d="M14.5 9a2.5 2 0 0 0-2.5-1.5c-1.4 0-2.5.7-2.5 1.8 0 2.7 5 1.2 5 3.9 0 1.1-1.1 1.8-2.5 1.8A2.5 2 0 0 1 9.5 15M12 6v1.5M12 16.5V18"/>',
  chart: '<path d="M3 3v18h18"/><rect x="7" y="11" width="3" height="6"/><rect x="12" y="7" width="3" height="10"/><rect x="17" y="13" width="3" height="4"/>',
  back: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
  layers: '<path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
  hash: '<path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  brain: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M9 7h7M9 11h5"/>',
  repeat: '<path d="M17 2l4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  bulb: '<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V18h6v-1.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z"/>',
  chev: '<path d="M9 6l6 6-6 6"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  dots: '<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>',
  edit: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>',
  archive: '<path d="M21 8v13H3V8M1 3h22v5H1zM10 12h4"/>',
  tag: '<path d="M20.6 13.4 11 3.8a2 2 0 0 0-1.4-.6H4a1 1 0 0 0-1 1v5.6a2 2 0 0 0 .6 1.4l9.6 9.6a2 2 0 0 0 2.8 0l4.6-4.6a2 2 0 0 0 0-2.8z"/>',
  bolt: '<path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/>',
  branch: '<line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
  gauge: '<path d="M12 14l4-4"/><path d="M3.5 14a8.5 8.5 0 1 1 17 0"/><circle cx="12" cy="14" r="1.6" fill="currentColor"/>',
  play: '<path d="M7 4l13 8-13 8z"/>',
  stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z"/>',
};

// Shown on every cost figure so the dollar number is never mistaken for a bill.
const COST_TIP = "Estimate — your recorded token usage × Anthropic's public API prices. On a Pro/Max subscription you aren't billed per token, so treat this as a usage measure, not a bill.";

// Releases ship as 3-part semver (auto-updater requirement). We DISPLAY a padded
// 5-part version + a beta tag, since this is pre-production (V2 will be the next gen).
function displayVersion(v) {
  const parts = String(v || '0').split('.');
  while (parts.length < 5) parts.push('0');
  return parts.slice(0, 5).join('.');
}

function svg(name, w = 17) {
  return `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`;
}
function fillSvg(name, w = 17) {
  return `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linejoin="round">${ICONS[name]}</svg>`;
}

// Radial activity burst — Claude's spark rendered as varying-length bars (a radial
// activity chart). Reads as both the Claude mark and a monitoring/metrics motif.
function burstSvg(size = 30) {
  const cx = 12, cy = 12, inner = 2.6;
  // Deterministic ray lengths → looks like a radial bar chart, not a plain sun.
  const lens = [9.4, 5.6, 8.2, 4.4, 9.0, 6.4, 7.4, 5.0, 9.4, 4.8, 8.0, 6.0];
  const rays = lens.length;
  let lines = '';
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * Math.PI * 2 - Math.PI / 2;
    const outer = lens[i];
    const x1 = cx + Math.cos(a) * inner;
    const y1 = cy + Math.sin(a) * inner;
    const x2 = cx + Math.cos(a) * outer;
    const y2 = cy + Math.sin(a) * outer;
    lines += `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}"/>`;
  }
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">${lines}<circle cx="12" cy="12" r="2.1" fill="currentColor" stroke="none"/></svg>`;
}

// hydrate static icon placeholders
function hydrateIcons(scope = document) {
  scope.querySelectorAll('.ico[data-ico]').forEach((el) => {
    if (!el.dataset.done) { el.innerHTML = svg(el.dataset.ico); el.dataset.done = '1'; }
  });
  scope.querySelectorAll('.burst').forEach((el) => { if (!el.dataset.done) { el.innerHTML = burstSvg(); el.dataset.done = '1'; } });
}

// ---------- helpers ----------
function fmtBytes(n) {
  if (n == null) return '—';
  if (n < 1024) return n + ' B';
  const u = ['KB', 'MB', 'GB', 'TB'];
  let i = -1; let v = n;
  do { v /= 1024; i++; } while (v >= 1024 && i < u.length - 1);
  return `${v < 10 ? v.toFixed(1) : Math.round(v)} ${u[i]}`;
}
function fmtNum(n) { return n == null ? '—' : n.toLocaleString(); }
function fmtDuration(ms) {
  if (!ms) return '0m';
  const min = Math.round(ms / 60000);
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  const rem = min % 60;
  if (h < 10) return rem ? `${h}h ${rem}m` : `${h}h`;
  return `${h}h`;
}
function fmtCost(n) {
  if (!n) return '$0';
  if (n < 0.01) return '<$0.01';
  if (n < 100) return '$' + n.toFixed(2);
  if (n < 10000) return '$' + Math.round(n).toLocaleString();
  return '$' + (n / 1000).toFixed(1) + 'k';
}
function fmtTokens(n) {
  if (!n) return '0';
  if (n < 1000) return String(n);
  if (n < 1e6) return (n / 1000).toFixed(n < 1e4 ? 1 : 0) + 'K';
  if (n < 1e9) return (n / 1e6).toFixed(1) + 'M';
  return (n / 1e9).toFixed(2) + 'B';
}

// Tiny inline bar sparkline from a daily series.
function sparkline(series, key, w = 96, h = 22) {
  const vals = series.map((d) => d[key] || 0);
  const max = Math.max(...vals, 1);
  const n = vals.length;
  const gap = 2;
  const bw = (w - gap * (n - 1)) / n;
  let bars = '';
  vals.forEach((v, i) => {
    const bh = Math.max(1, (v / max) * h);
    const x = i * (bw + gap);
    const y = h - bh;
    const today = i === n - 1;
    bars += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="1" fill="${today ? 'var(--clay)' : 'var(--clay-soft)'}"/>`;
  });
  return `<svg class="spark" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${bars}</svg>`;
}
function relTime(ms) {
  if (!ms) return 'never';
  const d = Date.now() - ms;
  const m = Math.floor(d / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const day = Math.floor(h / 24);
  if (day < 30) return `${day}d ago`;
  return `${Math.floor(day / 30)}mo ago`;
}

// ---------- state ----------
let cfg = { root: '', pinned: [], launch: {} };
let projects = [];
let externalProjects = [];
const cardEls = new Map(); // project path → its rendered card element (for in-place live updates)
let previewProfiles = {}; // path -> { launchable, type, label, command } — which projects can Launch
let previewRunning = {};  // path -> { status, url, type, name } — which previews are live now
let detailProject = null; // project currently shown in the detail view (for live preview repaint)
let filter = '';
let overviewDays = 7;
let recapRange = 'today'; // 'today' | 'week'
let analyticsMetric = 'time'; // 'time' | 'cost' | 'tokens'
let analyticsView = 'lines';  // 'lines' | 'stacked'
let lastAnalyticsRange = null;
let rootError = false;
let showArchived = false;
let tagFilter = '';
const TAGS = ['client', 'personal', 'work', 'archive-later'];

const $ = (id) => document.getElementById(id);

function showStatus(msg, kind = 'info') {
  const el = $('status');
  el.textContent = msg;
  el.className = `banner ${kind}`;
  if (kind !== 'error') setTimeout(() => el.classList.add('hidden'), 2800);
}

// Handle an Open-in-Claude result, including the no-terminal-found fallback.
async function handleLaunchResult(res, name) {
  if (res && res.ok) { showStatus(`Opening Claude in ${name}…`, 'ok'); return; }
  const cmd = res && res.command;
  if (cmd) {
    await window.launcher.copyText(cmd);
    showStatus(`Couldn't open a terminal automatically. Command copied — paste it in your terminal: ${cmd}`, 'error');
  } else {
    showStatus((res && res.error) || 'Failed to open', 'error');
  }
}

// ---------- popup menu ----------
let openMenuEl = null;
function closeMenu() { if (openMenuEl) { openMenuEl.remove(); openMenuEl = null; document.removeEventListener('click', closeMenu); } }
function popupMenu(anchor, items) {
  closeMenu();
  const m = document.createElement('div');
  m.className = 'popmenu';
  m.innerHTML = items.map((it, i) => it.sep
    ? '<div class="pm-sep"></div>'
    : `<button class="pm-item ${it.danger ? 'danger' : ''} ${it.active ? 'active' : ''}" data-i="${i}">${it.icon ? svg(it.icon, 14) : ''}<span>${escapeHtml(it.label)}</span></button>`).join('');
  document.body.appendChild(m);
  const r = anchor.getBoundingClientRect();
  const mw = 210;
  let left = r.right - mw; if (left < 8) left = 8;
  let top = r.bottom + 4;
  if (top + m.offsetHeight > window.innerHeight - 8) top = r.top - m.offsetHeight - 4;
  m.style.left = left + 'px'; m.style.top = top + 'px';
  m.querySelectorAll('.pm-item').forEach((b) => b.addEventListener('click', (e) => {
    e.stopPropagation();
    const it = items[Number(b.dataset.i)];
    closeMenu();
    if (it.onClick) it.onClick();
  }));
  openMenuEl = m;
  setTimeout(() => document.addEventListener('click', closeMenu), 0);
}

async function openCardMenu(anchor, p) {
  const launch = async (model) => { const r = await window.launcher.openProject(p.path, model ? { model } : undefined); await handleLaunchResult(r, p.name); };
  const prof = previewProfiles[p.path];
  const run = previewRunning[p.path];
  const previewItems = prof && prof.launchable ? [
    run
      ? { label: 'Open running app/site', icon: 'globe', onClick: () => window.launcher.previewOpen(p.path, p.name) }
      : { label: prof.label, icon: 'globe', onClick: () => launchPreview(p) },
    ...(run ? [{ label: 'Stop app/site', icon: 'stop', danger: true, onClick: () => stopPreview(p) }] : []),
    { sep: true },
  ] : [];
  const items = [
    { label: 'View stats & sessions', icon: 'chart', onClick: () => openDetail(p) },
    { label: 'Open folder', icon: 'folder', onClick: () => window.launcher.openInExplorer(p.path) },
    { sep: true },
    ...previewItems,
    { label: 'Open with Opus', icon: 'bolt', onClick: () => launch('opus') },
    { label: 'Open with Sonnet', icon: 'bolt', onClick: () => launch('sonnet') },
    { label: 'Open with Haiku', icon: 'bolt', onClick: () => launch('haiku') },
    { sep: true },
    { label: 'Open in editor', icon: 'edit', onClick: async () => { await window.launcher.openInEditor(p.path); } },
    { sep: true },
    ...TAGS.map((t) => ({ label: `Tag: ${t}`, icon: 'tag', active: p.tag === t, onClick: async () => { await window.launcher.setTag(p.path, p.tag === t ? '' : t); await loadProjects(); } })),
    ...(p.tag ? [{ label: 'Clear tag', onClick: async () => { await window.launcher.setTag(p.path, ''); await loadProjects(); } }] : []),
    { sep: true },
    { label: p.archived ? 'Unarchive' : 'Archive (hide)', icon: 'archive', danger: !p.archived, onClick: async () => { await window.launcher.toggleArchive(p.path); await loadProjects(); } },
  ];
  popupMenu(anchor, items);
}

// ---------- resume row (the launcher) ----------
// Home is one keyboard-first list ranked by likelihood-to-resume. A row is the
// product: name · what you were last doing · when · branch — Enter/click = Open.
async function openRow(p) {
  const res = await window.launcher.openProject(p.path);
  await handleLaunchResult(res, p.name);
}
// ---------- live preview (Launch a project's app/site) ----------
async function refreshPreviewData() {
  try {
    const paths = [...projects, ...externalProjects].map((p) => p.path);
    previewProfiles = (await window.launcher.previewScan(paths)) || {};
    previewRunning = (await window.launcher.previewState()) || {};
  } catch { previewProfiles = {}; previewRunning = {}; }
}

// Launch (or focus, if already running) a project's app/site.
async function launchPreview(p) {
  const run = previewRunning[p.path];
  if (run && run.url) { await window.launcher.previewOpen(p.path, p.name); return; }
  showStatus(`Starting ${p.name}…`, 'ok');
  const r = await window.launcher.previewLaunch(p.path, p.name);
  if (!r || !r.ok) { showStatus((r && r.error) || 'Could not launch.', 'warn'); return; }
  if (r.type === 'server' && !r.url) showStatus(`Running ${p.name} — waiting for it to print a URL…`, 'ok');
}
async function stopPreview(p) {
  await window.launcher.previewStop(p.path);
}

// Decorate a row/card's preview button from current profile + running state. Idempotent.
function paintPreviewBtn(btn, p) {
  if (!btn) return;
  const prof = previewProfiles[p.path];
  if (!prof || !prof.launchable) { btn.classList.add('hidden'); return; }
  btn.classList.remove('hidden');
  const run = previewRunning[p.path];
  if (run) {
    const starting = run.status === 'starting';
    btn.classList.add('running');
    btn.innerHTML = `${svg(starting ? 'globe' : 'play', 13)} ${starting ? 'Starting…' : 'Open'}`;
    btn.title = starting ? 'Starting…' : `Open ${run.url} · running`;
  } else {
    btn.classList.remove('running');
    btn.innerHTML = `${svg('globe', 13)} Launch`;
    btn.title = `${prof.label}${prof.command ? ' · ' + prof.command : ''}`;
  }
}

// Paint the detail view's Launch / Stop buttons from current state.
function paintDetailLaunch(p) {
  const lb = document.querySelector('#view-detail .d-launch');
  const sb = document.querySelector('#view-detail .d-stop');
  if (!lb) return;
  const prof = previewProfiles[p.path];
  if (!prof || !prof.launchable) { lb.classList.add('hidden'); if (sb) sb.classList.add('hidden'); return; }
  const run = previewRunning[p.path];
  lb.classList.remove('hidden');
  lb.innerHTML = run ? `${svg('globe', 14)} Open app/site` : `${svg('globe', 14)} ${prof.label}`;
  lb.title = run ? `Open ${run.url}` : (prof.command || prof.label);
  if (sb) sb.classList.toggle('hidden', !run);
}
function updateDetailPreview() { if (detailProject) paintDetailLaunch(detailProject); }

// Inject the Launch/Stop buttons into a detail-actions bar and wire them.
function wireDetailLaunch(body, p) {
  const lb = body.querySelector('.d-launch');
  const sb = body.querySelector('.d-stop');
  if (lb) lb.addEventListener('click', () => {
    const run = previewRunning[p.path];
    if (run && run.url) window.launcher.previewOpen(p.path, p.name); else launchPreview(p);
  });
  if (sb) sb.addEventListener('click', () => stopPreview(p));
  paintDetailLaunch(p);
}

// Update every visible row's preview button in place (called on preview-changed).
function repaintAllPreviewBtns() {
  document.querySelectorAll('.rrow[data-path]').forEach((el) => {
    const path = el.dataset.path;
    const p = projects.find((x) => x.path === path) || externalProjects.find((x) => x.path === path);
    if (p) paintPreviewBtn(el.querySelector('.preview-btn'), p);
  });
}

function makeResumeRow(p) {
  const el = document.createElement('div');
  el.className = 'rrow' + (p.archived ? ' archived' : '');
  el.dataset.path = p.path;
  el.tabIndex = -1;
  const pinned = cfg.pinned.includes(p.path);
  el.innerHTML = `
    <span class="active-dot hidden" data-slot="active-dot" title="Active in Claude now">●</span>
    <div class="rr-main">
      <div class="rr-top">
        <span class="rr-name" title="${escapeHtml(p.path)}">${escapeHtml(p.name)}</span>
        <span class="rr-when" data-slot="active">—</span>
        ${p.isGit ? `<span class="tag git rr-git" data-slot="git">${svg('branch', 11)} <span class="sl">git</span></span>` : ''}
        ${p.tag ? `<span class="tag tagchip">${escapeHtml(p.tag)}</span>` : ''}
        ${p.external ? `<span class="tag ext">outside folder</span>` : ''}
      </div>
      <div class="rr-sum" data-slot="summary"></div>
    </div>
    <button class="pin-btn ${pinned ? 'pinned' : ''}" title="${pinned ? 'Unpin' : 'Pin'}">${pinned ? fillSvg('star', 15) : svg('star', 15)}</button>
    <button class="btn primary btn-xs open">${svg('terminal', 14)} Open</button>
    <button class="btn ghost btn-xs preview-btn hidden" title="Launch app/site"></button>
    <button class="icon-btn more" title="Details &amp; actions">${svg('dots', 16)}</button>`;
  el.addEventListener('click', (e) => { if (!e.target.closest('button')) openRow(p); });
  el.querySelector('.open').addEventListener('click', (e) => { e.stopPropagation(); openRow(p); });
  const pv = el.querySelector('.preview-btn');
  paintPreviewBtn(pv, p);
  pv.addEventListener('click', (e) => { e.stopPropagation(); launchPreview(p); });
  el.querySelector('.more').addEventListener('click', (e) => { e.stopPropagation(); openCardMenu(e.currentTarget, p); });
  el.querySelector('.pin-btn').addEventListener('click', async (e) => { e.stopPropagation(); cfg.pinned = await window.launcher.togglePin(p.path); render(); });
  loadMetrics(el, p);
  loadResumeSummary(el, p);
  if (p.isGit) loadGit(el, p);
  return el;
}
// the "what you were doing" line — prefer the last session title over a generic desc
async function loadResumeSummary(el, p) {
  const s = await window.launcher.projectSummary(p.path);
  if (!el.isConnected) return;
  const node = el.querySelector('[data-slot="summary"]');
  if (!node) return;
  const text = s.lastTitle || s.desc || s.commit || '';
  if (text) node.textContent = text; else node.remove();
}

async function loadGit(el, p) {
  const g = await window.launcher.gitStatus(p.path);
  if (!el.isConnected) return;
  const node = el.querySelector('[data-slot="git"]');
  if (!node) return;
  if (!g || !g.isRepo) { node.remove(); return; }
  let extra = '';
  if (g.dirty > 0) extra += ` <span class="git-dirty" title="${g.dirty} uncommitted change${g.dirty === 1 ? '' : 's'}">●${g.dirty}</span>`;
  if (g.ahead) extra += ` <span class="git-sync" title="${g.ahead} commit(s) ahead of upstream">↑${g.ahead}</span>`;
  if (g.behind) extra += ` <span class="git-sync" title="${g.behind} commit(s) behind upstream">↓${g.behind}</span>`;
  node.className = 'tag git' + (g.dirty > 0 ? ' dirty' : ' clean');
  node.innerHTML = `${svg('branch', 12)} <span class="git-branch">${escapeHtml(g.branch || 'git')}</span>${extra}`;
  if (g.commit) node.title = `${g.commit.hash} · ${g.commit.rel}\n${g.commit.subject}`;
}

async function loadSummary(el, p) {
  const s = await window.launcher.projectSummary(p.path);
  if (!el.isConnected) return;
  const node = el.querySelector('[data-slot="summary"]');
  if (!node) return;
  const text = s.desc || s.lastTitle || s.commit;
  if (text) {
    node.textContent = text;
    if (!s.desc && s.lastTitle) node.title = 'Latest Claude session';
  } else {
    node.classList.add('hidden');
  }
  // Upgrade to an AI summary if enabled (cached server-side; safe to call).
  if (cfg.hasApiKey && cfg.aiSummaries) {
    const r = await window.launcher.aiSummary(p.path, p.name);
    if (el.isConnected && r && r.summary) {
      node.textContent = r.summary;
      node.classList.remove('hidden');
      node.title = 'AI summary';
      node.classList.add('ai');
    }
  }
}

// Update the live, in-place bits of a card/row: last-active, time spent, active dot.
async function loadMetrics(el, p) {
  const m = await window.launcher.projectMetrics(p.path);
  if (!el.isConnected) return;
  const set = (slot, val) => { const n = el.querySelector(`[data-slot="${slot}"]`); if (n) n.textContent = val; };
  set('active', m.lastTs ? relTime(m.lastTs) : 'no Claude activity yet');
  set('time', fmtDuration(m.activeMs));
  const tw = el.querySelector('[data-slot="time-wrap"]'); if (tw) tw.hidden = !(m.activeMs > 0);
  const dot = el.querySelector('[data-slot="active-dot"]'); if (dot) dot.classList.toggle('hidden', !m.active);
  el.classList.toggle('is-active', !!m.active);
}

async function loadStats(el, p) {
  const s = await window.launcher.projectStats(p.path);
  if (!el.isConnected) return;
  const set = (slot, icon, value, label) => {
    const node = el.querySelector(`[data-slot="${slot}"]`);
    if (node) node.outerHTML =
      `<div class="stat" data-slot="${slot}">${svg(icon, 14)} <span class="sv">${value}</span> <span class="sl">${label}</span></div>`;
  };
  set('files', 'file', fmtNum(s.files), 'files');
  set('size', 'drive', fmtBytes(s.bytes) + (s.capped ? '+' : ''), '');
}

// ---------- render ----------
function matches(p) {
  if (filter && !p.name.toLowerCase().includes(filter)) return false;
  if (tagFilter && p.tag !== tagFilter) return false;
  if (!showArchived && p.archived) return false;
  return true;
}

// "While you were away" — one-shot digest of activity since the last app open.
async function loadAwayDigest() {
  let d;
  try { d = await window.launcher.awayDigest(); } catch { return; }
  const node = $('awayDigest');
  if (!node || !d || !d.totalSessions) return;
  const projChips = d.projects.map((p) =>
    `<button class="awd-chip" data-path="${escapeHtml(p.path)}" data-name="${escapeHtml(p.name)}" title="${escapeHtml(p.path)}">${escapeHtml(p.name)} <span class="awd-chip-meta">${fmtDuration(p.activeMs)}</span></button>`).join('');
  node.innerHTML = `
    <div class="awd-head">
      <span class="ico" data-ico="clock"></span>
      <span class="awd-title">While you were away</span>
      <span class="awd-sub">since you last opened Helm · ${relTime(d.since)}</span>
      <button class="awd-x" title="Dismiss">×</button>
    </div>
    <div class="awd-stats">
      <span><strong>${d.totalSessions}</strong> session${d.totalSessions === 1 ? '' : 's'}</span>
      <span><strong>${d.projectsTouched}</strong> project${d.projectsTouched === 1 ? '' : 's'}</span>
      <span><strong>${fmtDuration(d.totalMs)}</strong> active</span>
      ${d.files ? `<span><strong>${d.files}</strong> file${d.files === 1 ? '' : 's'} touched</span>` : ''}
      <span class="awd-cost">${fmtCost(d.totalCost)}</span>
    </div>
    ${projChips ? `<div class="awd-projects">${projChips}</div>` : ''}`;
  hydrateIcons(node);
  node.classList.remove('hidden');
  node.querySelector('.awd-x').addEventListener('click', () => node.classList.add('hidden'));
  node.querySelectorAll('.awd-chip').forEach((c) =>
    c.addEventListener('click', () => openDetail({ name: c.dataset.name, path: c.dataset.path })));
}

// ---------- Clients (billable work-log) ----------
const MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function fmtMonth(ym) {
  const [y, m] = String(ym).split('-');
  return `${MONTH_ABBR[(+m) - 1] || ym} ${y}`;
}
function fmtHours(ms) { return (ms / 3600000).toFixed(1) + ' h'; }
let lastClientReport = null;

async function loadClients() {
  const body = $('clients-body');
  body.innerHTML = '<p class="empty">Loading…</p>';
  const rep = await window.launcher.clientReport();
  lastClientReport = rep;
  const assignments = rep.assignments || {};

  let html = '';
  if (!rep.hasClients) {
    html += `<div class="panel teach">
      <div class="panel-title">No clients assigned yet</div>
      <p class="panel-sub">Assign a client to any project below and Helm rolls up <strong>hours and estimated cost per client, per month</strong> — a billable work-log you can export to CSV. Costs are estimates from token usage.</p>
    </div>`;
  } else {
    html += rep.clients.map((c) => {
      const months = Object.keys(c.months).sort().reverse().slice(0, 6);
      const rows = months.map((mo) => `<tr>
          <td>${fmtMonth(mo)}</td>
          <td>${fmtHours(c.months[mo].activeMs)}</td>
          <td>${fmtCost(c.months[mo].cost)}</td>
        </tr>`).join('');
      const projs = c.projects.sort((a, b) => b.activeMs - a.activeMs)
        .map((p) => `<span class="cl-proj" title="${escapeHtml(p.path)}">${escapeHtml(p.name)} · ${fmtHours(p.activeMs)}</span>`).join('');
      return `<div class="panel cl-card">
        <div class="cl-head">
          <div class="cl-name">${escapeHtml(c.name)}</div>
          <div class="cl-totals">
            <span><strong>${fmtHours(c.totalMs)}</strong> total</span>
            <span><strong>${fmtCost(c.totalCost)}</strong></span>
            <span>${c.projects.length} project${c.projects.length === 1 ? '' : 's'}</span>
          </div>
        </div>
        <table class="breakdown cl-months">
          <thead><tr><th>Month</th><th>Active</th><th>Est. cost</th></tr></thead>
          <tbody>${rows || '<tr><td colspan="3" class="muted">No activity recorded yet.</td></tr>'}</tbody>
        </table>
        <div class="cl-projects">${projs}</div>
      </div>`;
    }).join('');
  }

  // assignment panel — set/edit a client on any project
  const all = [...projects, ...externalProjects];
  const rows = all.map((p) => `<div class="cl-assign-row">
      <span class="cl-assign-name" title="${escapeHtml(p.path)}">${escapeHtml(p.name)}${p.external ? ' <span class="tag ext">external</span>' : ''}</span>
      <input class="cl-assign-input" data-path="${escapeHtml(p.path)}" type="text" value="${escapeHtml(assignments[p.path] || '')}" placeholder="Client name…" spellcheck="false" autocomplete="off" />
    </div>`).join('');
  html += `<div class="panel">
    <div class="panel-title">Assign projects to clients</div>
    <p class="panel-sub">Type a client name to group a project under it. Clear the field to unassign. Projects sharing a name roll up together.</p>
    <div class="cl-assign">${rows || '<p class="panel-sub">No projects yet.</p>'}</div>
  </div>`;

  body.innerHTML = html;
  body.querySelectorAll('.cl-assign-input').forEach((inp) =>
    inp.addEventListener('change', async () => {
      await window.launcher.setClient(inp.dataset.path, inp.value);
      loadClients();
    }));
}

function buildClientsCsv(rep) {
  const lines = ['Client,Month,Active hours,Estimated cost (USD)'];
  for (const c of (rep.clients || [])) {
    const months = Object.keys(c.months).sort();
    for (const mo of months) {
      const h = (c.months[mo].activeMs / 3600000).toFixed(2);
      const cost = c.months[mo].cost.toFixed(2);
      lines.push(`"${c.name.replace(/"/g, '""')}",${mo},${h},${cost}`);
    }
    lines.push(`"${c.name.replace(/"/g, '""')}",TOTAL,${(c.totalMs / 3600000).toFixed(2)},${c.totalCost.toFixed(2)}`);
  }
  return lines.join('\n');
}

function render() {
  const list = projects.filter(matches);
  // rank by likelihood-to-resume: pinned first, then most-recently-touched
  const ranked = [...list].sort((a, b) => {
    const pa = cfg.pinned.includes(a.path) ? 1 : 0, pb = cfg.pinned.includes(b.path) ? 1 : 0;
    if (pa !== pb) return pb - pa;
    return (b.mtime || 0) - (a.mtime || 0);
  });

  cardEls.clear();
  const resumeList = $('resumeList');
  resumeList.innerHTML = '';
  $('resumeWrap').classList.toggle('hidden', !ranked.length);
  ranked.forEach((p) => { const el = makeResumeRow(p); cardEls.set(p.path, el); resumeList.appendChild(el); });

  const empty = $('empty');
  if (rootError) {
    empty.classList.remove('hidden'); // actionable folder message set by loadProjects
  } else if (!list.length) {
    if (filter) {
      empty.textContent = `No projects match "${filter}".`;
    } else {
      const hasOther = externalProjects.length > 0;
      empty.innerHTML = `<div class="welcome">
          <div class="welcome-mark">${svg('sun', 30)}</div>
          <h3>Welcome to Claude Helm</h3>
          <p>This is your projects folder — every subfolder shows up here, and one click (or Enter) opens it in Claude Code.<br><code>${escapeHtml(cfg.root)}</code></p>
          <div class="welcome-actions">
            <button class="btn primary" id="emptyNew">${svg('plus', 14)} New project</button>
            <button class="btn ghost" id="emptyPick">Choose a different folder</button>
          </div>
          ${hasOther ? `<p class="welcome-hint">${svg('layers', 13)} Found ${externalProjects.length} project${externalProjects.length === 1 ? '' : 's'} from your existing Claude history below.</p>` : `<p class="welcome-hint">No Claude history yet — open a project and your activity starts showing up here.</p>`}
        </div>`;
      const n = document.getElementById('emptyNew');
      if (n) n.addEventListener('click', openModal);
      const pk = document.getElementById('emptyPick');
      if (pk) pk.addEventListener('click', async () => { const c = await window.launcher.pickRoot(); if (c) { cfg = c; $('footRoot').textContent = cfg.root; await loadProjects(); } });
    }
    empty.classList.remove('hidden');
  } else {
    empty.classList.add('hidden');
  }

  // external (other Claude) projects — same rows
  const extList = externalProjects.filter(matches).sort((a, b) => (b.mtime || 0) - (a.mtime || 0));
  const extGrid = $('externalGrid');
  extGrid.innerHTML = '';
  $('externalWrap').classList.toggle('hidden', !extList.length);
  $('externalCount').textContent = extList.length;
  extList.forEach((p) => { const el = makeResumeRow(p); cardEls.set(p.path, el); extGrid.appendChild(el); });

  renderHomeRecap();
}

// Recap moved here from the (deleted) Overview tab — a quiet "what you did" panel
// below the resume list, not competing with the launcher.
function renderHomeRecap() {
  const host = $('recapHome');
  if (!host) return;
  if (rootError || !projects.length) { host.classList.add('hidden'); host.innerHTML = ''; return; }
  host.classList.remove('hidden');
  host.innerHTML = `<div class="panel recap-panel">
      <div class="panel-title">Recap
        <div class="seg recap-range">
          <button data-range="today" class="${recapRange === 'today' ? 'active' : ''}">Today</button>
          <button data-range="week" class="${recapRange === 'week' ? 'active' : ''}">This week</button>
        </div>
        <button class="btn ghost btn-xs recap-refresh" title="Regenerate recap">${svg('repeat', 14)}</button>
      </div>
      <div id="recap-body"><p class="panel-sub">Loading activity…</p></div>
    </div>`;
  const rr = host.querySelector('.recap-refresh');
  if (rr) rr.addEventListener('click', () => loadRecap(true));
  host.querySelectorAll('.recap-range button').forEach((b) => b.addEventListener('click', () => {
    recapRange = b.dataset.range;
    host.querySelectorAll('.recap-range button').forEach((x) => x.classList.toggle('active', x === b));
    loadRecap(false);
  }));
  loadRecap(false);
}

// Keyboard-first resume list: ↑/↓ select a project, Enter opens it in Claude.
function moveResumeSel(dir) {
  const rows = [...document.querySelectorAll('#resumeList .rrow, #externalGrid .rrow')];
  if (!rows.length) return;
  let i = rows.findIndex((r) => r.classList.contains('sel'));
  i = (i < 0) ? (dir > 0 ? 0 : rows.length - 1) : (i + dir + rows.length) % rows.length;
  rows.forEach((r) => r.classList.remove('sel'));
  rows[i].classList.add('sel');
  rows[i].scrollIntoView({ block: 'nearest' });
}
function openResumeSel() {
  const sel = document.querySelector('#resumeList .rrow.sel, #externalGrid .rrow.sel');
  if (sel) sel.click();
}

async function loadProjects() {
  const res = await window.launcher.listProjects(cfg.root);
  if (res.error) {
    rootError = true;
    projects = [];
    externalProjects = [];
    const empty = $('empty');
    empty.innerHTML = `Your projects folder isn't available:<br><code>${escapeHtml(cfg.root)}</code><br><br>
      <button class="btn primary" id="emptyCreate">Create this folder</button>
      <button class="btn ghost" id="emptyChoose">Choose another</button>`;
    empty.classList.remove('hidden');
    const c = document.getElementById('emptyCreate');
    if (c) c.addEventListener('click', async () => { await window.launcher.createRoot(cfg.root); await loadProjects(); });
    const ch = document.getElementById('emptyChoose');
    if (ch) ch.addEventListener('click', async () => { const r = await window.launcher.pickRoot(); if (r) { cfg = r; $('footRoot').textContent = cfg.root; await loadProjects(); } });
    $('footCount').textContent = '—';
    render();
    return;
  }
  rootError = false;
  projects = res.projects;
  externalProjects = res.external || [];
  populateTagFilter();
  $('footCount').textContent = `${projects.length} projects`;
  await refreshPreviewData();
  render();
}

// Update only the live numbers of the active (or just-ended) project cards — in
// place, no DOM rebuild, no placeholder flash, no layout shift. Inactive projects
// are left completely untouched (their data can't change while you're not in them).
async function refreshLiveMetrics() {
  const list = await window.launcher.activeSessions();
  const activePaths = new Set((list || []).map((a) => a.path));
  // a session started in a folder that has no card yet → add it (rare, one-time)
  for (const ap of activePaths) { if (!cardEls.has(ap)) { await reconcileProjects(); return; } }
  for (const [path, el] of cardEls) {
    if (!el.isConnected) continue;
    if (activePaths.has(path) || el.classList.contains('is-active')) {
      const p = projects.find((x) => x.path === path) || externalProjects.find((x) => x.path === path);
      if (p) loadMetrics(el, p); // updates time/cost/sparkline/active-dot/sessions in place
    }
  }
}

// Folder structure changed: reload the list, but only rebuild the grid if the set
// of projects actually changed (added/removed/renamed). Otherwise refresh in place.
async function reconcileProjects() {
  const sig = (arr) => arr.map((p) => p.path).join('|');
  const before = sig(projects) + '#' + sig(externalProjects);
  const res = await window.launcher.listProjects(cfg.root);
  if (res.error) { await loadProjects(); return; }
  projects = res.projects;
  externalProjects = res.external || [];
  populateTagFilter();
  $('footCount').textContent = `${projects.length} projects`;
  if (sig(projects) + '#' + sig(externalProjects) !== before) {
    await refreshPreviewData();
    render(); // a project was added/removed → rebuild
  } else {
    for (const [path, el] of cardEls) { // same set → refresh in place
      if (!el.isConnected) continue;
      const p = projects.find((x) => x.path === path) || externalProjects.find((x) => x.path === path);
      if (p) { if (!p.external) loadStats(el, p); loadMetrics(el, p); }
    }
  }
}

function populateTagFilter() {
  const sel = $('tagFilter');
  if (!sel) return;
  const tags = new Set();
  [...projects, ...externalProjects].forEach((p) => { if (p.tag) tags.add(p.tag); });
  const cur = sel.value;
  sel.innerHTML = '<option value="">All tags</option>' + [...tags].sort().map((t) => `<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join('');
  sel.value = cur;
}

// ---------- settings ----------
function updateCmdPreview() {
  const l = cfg.launch;
  const parts = ['claude'];
  if (l.model && l.model !== 'default') parts.push('--model', l.model);
  if (l.continue) parts.push('--continue');
  if (l.skipPermissions) parts.push('--dangerously-skip-permissions');
  $('cmdPreview').textContent = parts.join(' ');
}

function syncSettingsUI() {
  $('setRoot').textContent = cfg.root;
  $('optModel').value = cfg.launch.model || 'default';
  $('optContinue').checked = !!cfg.launch.continue;
  $('optSkip').checked = !!cfg.launch.skipPermissions;
  $('optApiKey').value = cfg.hasApiKey ? '••••••••••••••••' : '';
  $('optAiSummaries').checked = !!cfg.aiSummaries;
  $('optAiSummaries').disabled = !cfg.hasApiKey;
  if ($('optAdminKey')) $('optAdminKey').value = cfg.hasAdminKey ? '••••••••••••••••' : '';
  $('optAutoTrust').checked = !!cfg.autoTrust;
  $('optTerminal').value = cfg.terminalCommand || '';
  if ($('optPreviewTarget')) $('optPreviewTarget').value = cfg.previewTarget || 'window';
  $('optBudgetWeekly').value = cfg.budgetWeekly || '';
  $('optBudgetMonthly').value = cfg.budgetMonthly || '';
  $('optNotifications').checked = cfg.notifications !== false;
  $('optRedact').checked = !!cfg.redact;
  $('optOpenAtLogin').checked = !!cfg.openAtLogin;
  $('optStartHidden').checked = !!cfg.startHidden;
  $('optStartHidden').disabled = !cfg.openAtLogin;
  if ($('optHotkeyEnabled')) $('optHotkeyEnabled').checked = cfg.hotkeyEnabled !== false;
  if ($('optHotkey')) { $('optHotkey').value = prettyHotkey(cfg.hotkey || 'CommandOrControl+Shift+H'); $('optHotkey').disabled = cfg.hotkeyEnabled === false; }
  const osNames = { win32: 'Windows Terminal', darwin: 'macOS Terminal/iTerm', linux: 'Linux terminal' };
  $('osName').textContent = osNames[window.launcher.platform] || window.launcher.platform;
  updateApiHint();
  updateCmdPreview();
}

// Show the real signed-in Claude account + subscription plan (read locally by main).
async function renderAccountCard() {
  const el = $('accountCard');
  if (!el) return;
  let a;
  try { a = await window.launcher.claudeAccount(); } catch { a = null; }
  if (!a || !a.signedIn) {
    el.innerHTML = `<div class="acct-empty">Not signed in to Claude Code on this machine. Run <code>claude</code> and sign in, then reopen this tab.</div>`;
    return;
  }
  const created = a.subscriptionCreatedAt ? new Date(a.subscriptionCreatedAt).toLocaleDateString() : '';
  const rows = [
    ['Plan', `<span class="acct-plan">${escapeHtml(a.plan)}</span>`],
    ['Signed in as', `${escapeHtml(a.displayName || a.email)} <span class="muted">${escapeHtml(a.email)}</span>`],
    a.organization ? ['Organization', `${escapeHtml(a.organization)}${a.organizationRole ? ` · ${escapeHtml(a.organizationRole)}` : ''}`] : null,
    a.billingType ? ['Billing', escapeHtml(a.billingType.replace(/_/g, ' '))] : null,
    a.extraUsage ? ['Extra usage', 'enabled'] : null,
    created ? ['Subscription since', created] : null,
  ].filter(Boolean);
  el.innerHTML = rows.map(([k, v]) => `<div class="acct-row"><span class="acct-k">${k}</span><span class="acct-v">${v}</span></div>`).join('') +
    `<div class="panel-sub" style="margin-top:10px">Live quota usage (how much of your ${escapeHtml(a.plan)} limit is left) isn't exposed by any Anthropic API — this reads your plan, not a usage meter. Per-session context use is shown live on the home screen.</div>`;
}

function updateApiHint() {
  const h = $('apiKeyHint');
  if (!cfg.hasApiKey) h.textContent = 'No key set — using offline summaries.';
  else if (cfg.aiSummaries) h.textContent = 'AI summaries on. Cards generate once, then read from cache.';
  else h.textContent = 'Key saved. Turn on the toggle to enable AI summaries.';
}

async function saveLaunch(patch) {
  cfg = await window.launcher.setLaunch(patch);
  updateCmdPreview();
}

// ---------- views ----------
// ---------- agent maker ----------
const AGENT_TOOLS = ['Read', 'Write', 'Edit', 'Glob', 'Grep', 'Bash', 'WebFetch', 'WebSearch', 'Task', 'TodoWrite'];
let agentEditing = null;     // the agent object being edited, or null for a new one
let agentScope = 'global';   // 'global' | 'project'
let agentsWired = false;

async function loadAgentsView() {
  // populate the project dropdown from the known projects
  const sel = $('agentProject');
  if (sel) {
    const all = [...projects, ...externalProjects];
    sel.innerHTML = all.map((p) => `<option value="${escapeHtml(p.path)}">${escapeHtml(p.name)}</option>`).join('')
      || '<option value="">(no projects)</option>';
  }
  // render the tool checkboxes once
  const tw = $('agentTools');
  if (tw && !tw.dataset.built) {
    tw.innerHTML = AGENT_TOOLS.map((t) =>
      `<label class="agent-tool"><input type="checkbox" value="${t}" /> ${t}</label>`).join('');
    tw.dataset.built = '1';
  }
  if (!agentsWired) { wireAgentForm(); agentsWired = true; }
  await renderAgentList();
  if (!agentEditing) resetAgentForm();
}

async function renderAgentList() {
  const host = $('agentList');
  if (!host) return;
  const projectPath = agentScope === 'project' ? ($('agentProject') && $('agentProject').value) : '';
  let data;
  try { data = await window.launcher.agentsList(projectPath); } catch { data = { global: [], project: [] }; }
  const section = (title, arr) => arr.length ? `
    <div class="agent-group-title">${title}</div>
    ${arr.map((a) => `
      <div class="agent-item" data-scope="${a.scope}" data-name="${escapeHtml(a.name)}" data-path="${escapeHtml(a.projectPath || '')}">
        <div class="agent-item-main">
          <div class="agent-item-name">${escapeHtml(a.name)} <span class="agent-chip">${a.model === 'inherit' ? 'inherit' : escapeHtml(a.model)}</span></div>
          <div class="agent-item-desc">${escapeHtml(a.description || 'No description')}</div>
        </div>
      </div>`).join('')}` : '';
  const html = section('Global · all projects', data.global) + section('This project', data.project || []);
  host.innerHTML = html || '<p class="panel-sub">No agents yet. Fill in the form and Save to create your first one.</p>';
  host.querySelectorAll('.agent-item').forEach((el) => {
    el.addEventListener('click', () => {
      const arr = el.dataset.scope === 'project' ? (data.project || []) : data.global;
      const a = arr.find((x) => x.name === el.dataset.name);
      if (a) editAgent(a);
    });
  });
}

function readAgentForm() {
  return {
    scope: agentScope,
    projectPath: agentScope === 'project' ? ($('agentProject') && $('agentProject').value) : '',
    name: $('agentName').value.trim(),
    description: $('agentDesc').value.trim(),
    tools: [...document.querySelectorAll('#agentTools input:checked')].map((c) => c.value),
    model: $('agentModel').value,
    prompt: $('agentPrompt').value,
    originalName: agentEditing ? agentEditing.name : '',
  };
}

function setAgentScope(scope) {
  agentScope = scope === 'project' ? 'project' : 'global';
  document.querySelectorAll('#agentScope button').forEach((b) => b.classList.toggle('active', b.dataset.scope === agentScope));
  $('agentProjectField').classList.toggle('hidden', agentScope !== 'project');
  renderAgentList();
}

function editAgent(a) {
  agentEditing = a;
  setAgentScope(a.scope);
  if (a.scope === 'project' && a.projectPath && $('agentProject')) $('agentProject').value = a.projectPath;
  $('agentName').value = a.name;
  $('agentDesc').value = a.description || '';
  $('agentModel').value = a.model || 'inherit';
  $('agentPrompt').value = a.prompt || '';
  document.querySelectorAll('#agentTools input').forEach((c) => { c.checked = a.tools.includes(c.value); });
  $('agentFormTitle').textContent = `Editing: ${a.name}`;
  $('agentDelete').classList.remove('hidden');
  $('agentFormMsg').textContent = '';
}

function resetAgentForm() {
  agentEditing = null;
  $('agentName').value = '';
  $('agentDesc').value = '';
  $('agentModel').value = 'inherit';
  $('agentPrompt').value = '';
  document.querySelectorAll('#agentTools input').forEach((c) => { c.checked = false; });
  $('agentFormTitle').textContent = 'New agent';
  $('agentDelete').classList.add('hidden');
  $('agentFormMsg').textContent = '';
}

function wireAgentForm() {
  document.querySelectorAll('#agentScope button').forEach((b) =>
    b.addEventListener('click', () => setAgentScope(b.dataset.scope)));
  if ($('agentProject')) $('agentProject').addEventListener('change', renderAgentList);
  $('agentNew').addEventListener('click', () => { resetAgentForm(); $('agentName').focus(); });
  $('agentReset').addEventListener('click', resetAgentForm);
  $('agentFolder').addEventListener('click', () => window.launcher.openAgentsFolder({
    scope: agentScope, projectPath: agentScope === 'project' ? ($('agentProject') && $('agentProject').value) : '',
  }));
  $('agentSave').addEventListener('click', async () => {
    const a = readAgentForm();
    const msg = $('agentFormMsg');
    if (!a.name) { msg.textContent = 'Give the agent a name first.'; return; }
    if (a.scope === 'project' && !a.projectPath) { msg.textContent = 'Pick a project to save into.'; return; }
    const r = await window.launcher.agentSave(a);
    if (!r || !r.ok) { msg.textContent = (r && r.error) || 'Could not save.'; return; }
    showStatus(`Agent "${a.name}" saved.`, 'ok');
    agentEditing = { ...a };
    $('agentFormTitle').textContent = `Editing: ${a.name}`;
    $('agentDelete').classList.remove('hidden');
    msg.textContent = '';
    renderAgentList();
  });
  $('agentDelete').addEventListener('click', async () => {
    if (!agentEditing) return;
    const r = await window.launcher.agentDelete({ scope: agentEditing.scope, projectPath: agentEditing.projectPath, name: agentEditing.name });
    if (r && r.ok) { showStatus(`Agent "${agentEditing.name}" deleted.`, 'ok'); resetAgentForm(); renderAgentList(); }
    else showStatus((r && r.error) || 'Could not delete.', 'warn');
  });
  $('agentGenerate').addEventListener('click', async () => {
    const name = $('agentName').value.trim();
    const description = $('agentDesc').value.trim();
    const msg = $('agentFormMsg');
    if (!description) { msg.textContent = 'Add a short description first — that\'s what Claude drafts the prompt from.'; return; }
    const btn = $('agentGenerate');
    btn.disabled = true; const old = btn.innerHTML; btn.innerHTML = 'Generating…';
    const r = await window.launcher.generateAgentPrompt({ name, description });
    btn.disabled = false; btn.innerHTML = old;
    if (r && r.ok) { $('agentPrompt').value = r.prompt; msg.textContent = 'Draft generated — edit as you like, then Save.'; }
    else msg.textContent = (r && r.error) || 'Could not generate.';
  });
}

function switchView(view) {
  document.querySelectorAll('.nav-item').forEach((n) => n.classList.toggle('active', n.dataset.view === view));
  ['projects', 'search', 'settings', 'overview', 'analytics', 'clients', 'detail', 'context', 'agents', 'routines', 'transcript'].forEach((v) => {
    const el = $(`view-${v}`);
    if (el) el.classList.toggle('hidden', view !== v);
  });
  if (view === 'settings') syncSettingsUI();
  if (view === 'analytics') loadAnalytics();
  if (view === 'context') loadContext();
  if (view === 'search') loadSearch();
  if (view === 'clients') loadClients();
  if (view === 'agents') loadAgentsView();
}

// ---------- Transcript viewer ----------
let transcriptReturn = 'projects';
let currentTranscriptCtx = null; // { cwd, sessionId } for Branch/Resume

function renderMessage(m) {
  const who = m.role === 'user' ? 'You' : 'Claude';
  const blocks = m.blocks.map((b) => {
    if (b.kind === 'text') return `<div class="t-text">${escapeHtml(b.text)}</div>`;
    if (b.kind === 'thinking') return `<div class="t-think" title="Claude's thinking">${escapeHtml(b.text)}</div>`;
    if (b.kind === 'tool') return `<div class="t-tool">${svg('terminal', 13)} <span class="t-toolname">${escapeHtml(b.name)}</span>${b.summary ? ` <span class="t-toolsum">${escapeHtml(b.summary)}</span>` : ''}</div>`;
    if (b.kind === 'result') return `<div class="t-result ${b.error ? 'err' : ''}" title="Click to expand">${escapeHtml(b.text)}${b.truncated ? ' …' : ''}</div>`;
    return '';
  }).join('');
  return `<div class="t-msg ${m.role}" data-ts="${m.ts}">
    <div class="t-meta"><span class="t-who">${who}</span><span class="t-time">${m.ts ? relTime(m.ts) : ''}</span></div>
    <div class="t-blocks">${blocks}</div>
  </div>`;
}

async function openTranscript(args, fromView, scrollTs) {
  transcriptReturn = fromView || 'projects';
  switchView('transcript');
  const root = $('view-transcript');
  root.querySelector('.t-title').textContent = 'Loading…';
  root.querySelector('.t-sub').textContent = '';
  const bodyEl = root.querySelector('.t-body');
  bodyEl.innerHTML = '<p class="empty">Loading conversation…</p>';

  const d = await window.launcher.readTranscript(args);
  // capture session context for Branch / Resume
  const ctxCwd = args.cwd || d.project || '';
  const ctxSession = args.sessionId || d.sessionId || '';
  currentTranscriptCtx = (ctxCwd && ctxSession) ? { cwd: ctxCwd, sessionId: ctxSession } : null;
  const tBranch = root.querySelector('.t-branch');
  const tResume = root.querySelector('.t-resume');
  [tBranch, tResume].forEach((b) => { if (b) b.disabled = !currentTranscriptCtx; });
  if (d.error || !d.messages.length) {
    root.querySelector('.t-title').textContent = 'Session';
    bodyEl.innerHTML = `<p class="empty">${escapeHtml(d.error || 'No readable messages in this session.')}</p>`;
    return;
  }
  root.querySelector('.t-title').textContent = d.title || 'Session';
  root.querySelector('.t-sub').textContent =
    (d.project ? d.project.split(/[\\/]/).pop() + ' · ' : '') + d.messages.length + ' messages' + (d.truncated ? ' (truncated)' : '');
  bodyEl.innerHTML = d.messages.map(renderMessage).join('') +
    (d.truncated ? '<p class="section-note">Older messages truncated for display.</p>' : '');

  bodyEl.querySelectorAll('.t-result, .t-think').forEach((el) =>
    el.addEventListener('click', () => el.classList.toggle('open')));

  if (scrollTs) {
    const el = [...bodyEl.querySelectorAll('[data-ts]')].find((e) => Number(e.dataset.ts) === scrollTs);
    if (el) { el.scrollIntoView({ block: 'center' }); el.classList.add('t-hit'); }
  } else {
    bodyEl.scrollTop = 0;
  }
}

// ---------- Search across transcripts ----------
let searchTimer = null;
let searchInited = false;
let searchFilters = { project: '', role: 'all', sinceDays: 0 };

function populateProjectFilter() {
  const sel = $('filterProject');
  const seen = new Set();
  const all = [...projects, ...externalProjects]
    .filter((p) => { if (seen.has(p.path)) return false; seen.add(p.path); return true; })
    .sort((a, b) => a.name.localeCompare(b.name));
  const cur = sel.value;
  sel.innerHTML = '<option value="">All projects</option>' +
    all.map((p) => `<option value="${escapeHtml(p.path)}">${escapeHtml(p.name)}</option>`).join('');
  sel.value = cur;
}

function rerunSearch() {
  const q = $('searchInput').value.trim();
  runSearch(q);
}

function loadSearch() {
  const input = $('searchInput');
  populateProjectFilter();
  if (!searchInited) {
    searchInited = true;
    input.addEventListener('input', () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(rerunSearch, 300);
    });
    $('filterProject').addEventListener('change', (e) => { searchFilters.project = e.target.value; rerunSearch(); });
    $('filterDate').addEventListener('change', (e) => { searchFilters.sinceDays = Number(e.target.value); rerunSearch(); });
    document.querySelectorAll('#filterRole button').forEach((b) =>
      b.addEventListener('click', () => {
        searchFilters.role = b.dataset.role;
        document.querySelectorAll('#filterRole button').forEach((x) => x.classList.toggle('active', x === b));
        rerunSearch();
      }));
  }
  setTimeout(() => input.focus(), 50);
}
async function runSearch(q) {
  const body = $('search-body');
  if (q.length < 2) {
    body.innerHTML = '<p class="empty">Type at least 2 characters to search your Claude history.</p>';
    return;
  }
  body.innerHTML = '<p class="empty">Searching…</p>';
  const projList = [...projects, ...externalProjects].map((p) => ({ path: p.path, name: p.name }));
  const [{ results, contexts = [], scanned, truncated }, projHits] = await Promise.all([
    window.launcher.searchTranscripts(q, searchFilters),
    searchFilters.project ? Promise.resolve([]) : window.launcher.searchProjects(q, projList),
  ]);
  if (!results.length && !contexts.length && !projHits.length) {
    body.innerHTML = `<p class="empty">No matches for "${escapeHtml(q)}" in your projects, conversations, or context.</p>`;
    return;
  }
  // highlight every query word, not just the exact phrase
  const words = q.split(/\s+/).filter(Boolean).map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const rx = new RegExp('(' + words.join('|') + ')', 'ig');
  const hl = (s) => escapeHtml(s).replace(rx, '<mark>$1</mark>');
  let html = '';

  if (projHits.length) {
    html += `<div class="section-head">${svg('grid', 15)} Projects <span class="count">${projHits.length}</span></div>`;
    html += projHits.map((p, i) => `<div class="proj-hit" data-i="${i}">
      <div class="sr-head">
        <span class="sr-proj">${hl(p.name)}</span>
        ${p.tag ? `<span class="tag tagchip">${escapeHtml(p.tag)}</span>` : ''}
        ${p.client ? `<span class="sr-role">${escapeHtml(p.client)}</span>` : ''}
        <button class="btn primary btn-xs ph-open">${svg('terminal', 13)} Open</button>
      </div>
      ${p.desc ? `<div class="sr-snip">${hl(p.desc)}</div>` : ''}
    </div>`).join('');
  }

  if (contexts.length) {
    html += `<div class="section-head">${svg('brain', 15)} Context & memory <span class="count">${contexts.length}</span></div>`;
    html += `<div class="ctx-list">` + contexts.map((c) => `<div class="ctx-item">
      <div class="ctx-row">
        <span class="ctx-title">${hl(c.title)}</span>
        <span class="sr-role" style="margin-left:auto">${escapeHtml(c.type)}</span>
        <span class="ctx-chev">${svg('chev', 16)}</span>
      </div>
      <div class="ctx-detail">${renderMemBody(c.body || '')}</div>
    </div>`).join('') + `</div>`;
  }

  if (results.length) {
    html += `<div class="section-head">${svg('message', 15)} Conversations <span class="count">${results.length}${truncated ? '+' : ''}</span></div>`;
    html += results.map((r, i) => `<div class="sresult" data-i="${i}">
      <div class="sr-head">
        <span class="sr-proj">${escapeHtml(r.project)}</span>
        <span class="sr-role ${r.role}">${r.role}</span>
        <span class="sr-time">${relTime(r.ts)}</span>
        <span class="sr-open">open ›</span>
      </div>
      <div class="sr-snip">${hl(r.snippet)}</div>
    </div>`).join('');
  }

  body.innerHTML = html;
  // a project hit pulls the project right up: row → details, Open → launch in Claude
  body.querySelectorAll('.proj-hit[data-i]').forEach((el) => {
    const p = projHits[Number(el.dataset.i)];
    el.addEventListener('click', (e) => { if (!e.target.closest('button')) openDetail({ name: p.name, path: p.path }); });
    el.querySelector('.ph-open').addEventListener('click', async (e) => {
      e.stopPropagation();
      const r = await window.launcher.openProject(p.path);
      await handleLaunchResult(r, p.name);
    });
  });
  body.querySelectorAll('.ctx-row').forEach((row) =>
    row.addEventListener('click', () => row.parentElement.classList.toggle('open')));
  body.querySelectorAll('.sresult[data-i]').forEach((el) => {
    el.addEventListener('click', () => {
      const r = results[Number(el.dataset.i)];
      if (r && (r.file || r.sessionId)) {
        openTranscript({ filePath: r.file, cwd: r.projectPath, sessionId: r.sessionId }, 'search', r.ts);
      }
    });
  });
}

// ---------- Context (memory) view ----------
function escapeHtml(s) {
  return String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}
function renderMemBody(body) {
  return escapeHtml(body)
    .replace(/\[\[([^\]]+)\]\]/g, '<span class="memlink">$1</span>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}
function ctxItem(m) {
  const title = m.description || m.name || m.file;
  return `<div class="ctx-item">
    <div class="ctx-row"><span class="ctx-title">${escapeHtml(title)}</span><span class="ctx-chev">${svg('chev', 16)}</span></div>
    <div class="ctx-detail">${renderMemBody(m.body)}</div>
  </div>`;
}
const CTX_SECTIONS = [
  { key: 'user', icon: 'user', title: 'About you' },
  { key: 'feedback', icon: 'bulb', title: 'Preferences & feedback' },
  { key: 'project', icon: 'layers', title: 'Projects' },
  { key: 'reference', icon: 'hash', title: 'References' },
  { key: 'other', icon: 'file', title: 'Other' },
];

async function loadContext() {
  const body = $('context-body');
  body.innerHTML = '<p class="empty">Loading…</p>';
  const ctx = await window.launcher.getContext();
  let html = '';
  if (!ctx.count) {
    html += `<div class="panel"><p class="panel-sub">No memory found yet. As you work with Claude and it learns your preferences, projects, and goals, they'll show up here.</p></div>`;
  }
  for (const s of CTX_SECTIONS) {
    const items = ctx.groups[s.key] || [];
    if (!items.length) continue;
    html += `<div class="section-head">${svg(s.icon, 15)} ${s.title} <span class="count">${items.length}</span></div>`;
    html += `<div class="ctx-list">${items.map(ctxItem).join('')}</div>`;
  }
  if (ctx.claudeMd && ctx.claudeMd.trim()) {
    html += `<div class="section-head">${svg('gear', 15)} Global instructions <span class="count">CLAUDE.md</span></div>`;
    html += `<div class="ctx-list"><div class="ctx-item"><div class="ctx-row"><span class="ctx-title">Your global instructions for all projects</span><span class="ctx-chev">${svg('chev', 16)}</span></div><div class="ctx-detail"><pre class="claudemd">${escapeHtml(ctx.claudeMd.trim())}</pre></div></div></div>`;
  }
  body.innerHTML = html;
  body.querySelectorAll('.ctx-row').forEach((row) =>
    row.addEventListener('click', () => row.parentElement.classList.toggle('open')));
}

// ---------- Routines view (draft) ----------
const ROUTINE_IDEAS = [
  ['Daily standup digest', 'Summarize what changed in this project today (git + files) and what to do next.'],
  ['Weekly retro', 'Roll up this week\'s commits and progress into a short report with wins and risks.'],
  ['README freshness check', 'Check whether the README is out of date vs the code and list what to update.'],
  ['Test/health check', 'Run the test suite and summarize failures, or list the riskiest untested areas.'],
];

function scheduleText(r) {
  const s = r.schedule || {};
  return s.type === 'daily' ? `Daily at ${s.time || '09:00'}` : `Every ${s.hours || 24}h`;
}
function routineCard(r) {
  const proj = (r.projectPath || '').split(/[\\/]/).pop() || '—';
  const badge = r.lastStatus === 'running' ? '<span class="rstat run">running…</span>'
    : r.lastStatus === 'ok' ? '<span class="rstat ok">ok</span>'
    : r.lastStatus === 'error' ? '<span class="rstat err">error</span>' : '';
  const output = r.lastError ? r.lastError : r.lastOutput;
  return `<div class="routine ${r.enabled ? '' : 'off'}" data-id="${r.id}">
    <div class="routine-head">
      <div class="routine-info">
        <div class="routine-name">${escapeHtml(r.name)} ${badge}</div>
        <div class="routine-meta">${escapeHtml(proj)} · ${scheduleText(r)} · ${r.model && r.model !== 'default' ? r.model : 'default model'}${r.lastRun ? ` · last ${relTime(r.lastRun)}` : ' · never run'}</div>
      </div>
      <label class="rtoggle"><input type="checkbox" class="r-en" ${r.enabled ? 'checked' : ''} /><span class="track"></span></label>
    </div>
    <div class="routine-prompt">${escapeHtml(r.prompt)}</div>
    ${output ? `<div class="routine-output ${r.lastError ? 'err' : ''}">${escapeHtml(output)}</div>` : ''}
    <div class="routine-actions">
      <button class="btn primary r-run">${svg('bolt', 15)} Run now</button>
      <button class="icon-btn r-edit" title="Edit">${svg('edit', 16)}</button>
      <button class="icon-btn r-del" title="Delete">${svg('archive', 16)}</button>
    </div>
  </div>`;
}

async function loadRoutines() {
  const body = $('routines-body');
  const routines = await window.launcher.getRoutines();
  let html = `<div class="routines-top">
      <p class="section-note" style="margin:0">Recurring Claude Code tasks. Each runs <code>claude -p</code> in a project on your schedule and shows the result here. They run while Claude Helm is open (keep it in the tray) — a missed run catches up next time you open the app.</p>
      <button id="newRoutine" class="btn primary">${svg('plus', 16)} New routine</button>
    </div>`;
  if (!routines.length) {
    html += `<div class="panel routines-hero">
        <div class="panel-title" style="font-size:16px">No routines yet</div>
        <p class="panel-sub">Create one, or start from an idea below.</p>
      </div>
      <div class="section-head">${svg('bulb', 15)} Ideas to start with</div>
      <div class="mem-grid">
        ${ROUTINE_IDEAS.map(([t, d], i) => `<div class="mem idea" data-i="${i}"><div class="mem-title">${t}</div><div class="mem-body open">${d}</div><div class="idea-add">+ Use this</div></div>`).join('')}
      </div>`;
  } else {
    html += `<div class="routine-list">${routines.map(routineCard).join('')}</div>`;
  }
  body.innerHTML = html;

  $('newRoutine').addEventListener('click', () => openRoutineModal());
  body.querySelectorAll('.mem.idea').forEach((el) => el.addEventListener('click', () => {
    const [name, prompt] = ROUTINE_IDEAS[Number(el.dataset.i)];
    openRoutineModal({ name, prompt });
  }));
  body.querySelectorAll('.routine').forEach((el) => {
    const id = el.dataset.id;
    const r = routines.find((x) => x.id === id);
    el.querySelector('.r-run').addEventListener('click', async () => { await window.launcher.runRoutine(id); showStatus('Running routine…', 'ok'); });
    el.querySelector('.r-edit').addEventListener('click', () => openRoutineModal(r));
    el.querySelector('.r-del').addEventListener('click', async () => { if (confirm(`Delete routine "${r.name}"?`)) { await window.launcher.deleteRoutine(id); loadRoutines(); } });
    el.querySelector('.r-en').addEventListener('change', async () => { await window.launcher.toggleRoutine(id); });
  });
}

let editingRoutine = null;
function openRoutineModal(routine) {
  editingRoutine = routine && routine.id ? routine : null;
  const m = $('routineModal');
  $('rmTitle').textContent = editingRoutine ? 'Edit routine' : 'New routine';
  // populate project select
  const sel = $('rmProject');
  const all = [...projects, ...externalProjects].filter((p, i, a) => a.findIndex((x) => x.path === p.path) === i).sort((a, b) => a.name.localeCompare(b.name));
  sel.innerHTML = all.map((p) => `<option value="${escapeHtml(p.path)}">${escapeHtml(p.name)}</option>`).join('');
  $('rmName').value = routine ? (routine.name || '') : '';
  $('rmPrompt').value = routine ? (routine.prompt || '') : '';
  if (routine && routine.projectPath) sel.value = routine.projectPath;
  const sched = (routine && routine.schedule) || { type: 'interval', hours: 24 };
  $('rmSchedType').value = sched.type || 'interval';
  $('rmHours').value = sched.hours || 24;
  $('rmTime').value = sched.time || '09:00';
  $('rmModel').value = (routine && routine.model) || 'default';
  $('rmAutonomous').checked = !!(routine && routine.autonomous);
  $('rmEnabled').checked = routine ? routine.enabled !== false : true;
  syncSchedFields();
  m.classList.remove('hidden');
  $('rmName').focus();
}
function syncSchedFields() {
  const daily = $('rmSchedType').value === 'daily';
  $('rmIntervalWrap').classList.toggle('hidden', daily);
  $('rmTimeWrap').classList.toggle('hidden', !daily);
}
async function saveRoutineFromModal() {
  const name = $('rmName').value.trim();
  const prompt = $('rmPrompt').value.trim();
  const projectPath = $('rmProject').value;
  if (!name || !prompt || !projectPath) { showStatus('Name, project, and prompt are required.', 'error'); return; }
  const type = $('rmSchedType').value;
  const schedule = type === 'daily' ? { type: 'daily', time: $('rmTime').value || '09:00' } : { type: 'interval', hours: Math.max(1, Number($('rmHours').value) || 24) };
  const r = {
    ...(editingRoutine || {}),
    name, prompt, projectPath, schedule,
    model: $('rmModel').value,
    autonomous: $('rmAutonomous').checked,
    enabled: $('rmEnabled').checked,
  };
  await window.launcher.saveRoutine(r);
  $('routineModal').classList.add('hidden');
  loadRoutines();
}

// ---------- detail view (Phase 3) ----------
function barChart(series, key, fmt, label) {
  const vals = series.map((d) => d[key] || 0);
  const max = Math.max(...vals, 1);
  let bars = '';
  series.forEach((d, i) => {
    const v = vals[i];
    const pct = (v / max) * 100;
    const date = d.day.slice(5);
    bars += `<div class="bar-col" title="${d.day}: ${fmt(v)}">
      <div class="bar-fill" style="height:${Math.max(2, pct)}%"></div>
      <div class="bar-x">${i % 5 === 0 ? date : ''}</div>
    </div>`;
  });
  return `<div class="chart"><div class="chart-label">${label}</div><div class="bars">${bars}</div></div>`;
}

function notesPanel(p) {
  return `<div class="panel">
      <div class="panel-title">Notes</div>
      <p class="panel-sub">Your own notes about this project — saved locally, just for you.</p>
      <textarea class="proj-notes" placeholder="e.g. client contact, deploy steps, where you left off…">${escapeHtml((cfg.notes && cfg.notes[p.path]) || '')}</textarea>
      <div class="notes-saved muted" style="visibility:hidden">Saved</div>
    </div>`;
}
function wireNotes(body, p) {
  const ta = body.querySelector('.proj-notes');
  if (!ta) return;
  let noteTimer = null;
  const saved = body.querySelector('.notes-saved');
  const save = async () => {
    await window.launcher.setNote(p.path, ta.value);
    cfg.notes = cfg.notes || {}; if (ta.value.trim()) cfg.notes[p.path] = ta.value.trim(); else delete cfg.notes[p.path];
    if (saved) { saved.style.visibility = 'visible'; setTimeout(() => { saved.style.visibility = 'hidden'; }, 1500); }
  };
  ta.addEventListener('input', () => { clearTimeout(noteTimer); noteTimer = setTimeout(save, 700); });
  ta.addEventListener('blur', () => { clearTimeout(noteTimer); save(); });
}

async function openDetail(p) {
  detailProject = p;
  switchView('detail');
  const root = $('view-detail');
  root.querySelector('.detail-name').textContent = p.name;
  root.querySelector('.detail-path').textContent = p.path;
  const body = root.querySelector('.detail-body');
  body.innerHTML = '<p class="empty">Loading…</p>';

  const [d, sum] = await Promise.all([
    window.launcher.projectDetail(p.path),
    window.launcher.projectSummary(p.path),
  ]);
  let summaryText = sum.desc || sum.lastTitle || '';
  if (cfg.hasApiKey && cfg.aiSummaries) {
    const r = await window.launcher.aiSummary(p.path, p.name);
    if (r && r.summary) summaryText = r.summary;
  }
  const sumEl = root.querySelector('.detail-summary');
  sumEl.textContent = summaryText;
  sumEl.classList.toggle('hidden', !summaryText);
  const t = d.totals;
  if (!t || t.sessions === 0) {
    body.innerHTML = `
      <div class="detail-actions">
        <button class="btn primary d-open">${svg('terminal', 15)} Open in Claude</button>
        <button class="btn ghost d-launch hidden"></button>
        <button class="btn ghost d-stop hidden" title="Stop the running app/site">${svg('stop', 14)} Stop</button>
        <button class="icon-btn d-folder" title="Open folder in Explorer">${svg('folder', 16)}</button>
      </div>
      <div class="panel"><p class="panel-sub">No Claude Code sessions recorded for this project yet. Open it in Claude and your time, cost, and activity will appear here.</p></div>${notesPanel(p)}`;
    body.querySelector('.d-open').addEventListener('click', async () => { const r = await window.launcher.openProject(p.path); await handleLaunchResult(r, p.name); });
    body.querySelector('.d-folder').addEventListener('click', () => window.launcher.openInExplorer(p.path));
    wireDetailLaunch(body, p);
    wireNotes(body, p);
    return;
  }
  const totalTokens = t.tokens.in + t.tokens.out + t.tokens.cw + t.tokens.cr;
  const models = Object.entries(t.models).sort((a, b) => b[1] - a[1]);
  const tools = Object.entries(t.tools).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const toolMax = tools.length ? tools[0][1] : 1;
  const files = Object.entries(t.files).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const sessions = Object.entries(d.sessions).sort((a, b) => b[1].lastTs - a[1].lastTs);

  const lastId = sessions.length ? sessions[0][0] : null;
  body.innerHTML = `
    <div class="detail-actions">
      <button class="btn primary d-open">${svg('terminal', 15)} Open in Claude</button>
      ${lastId ? `<button class="btn ghost d-resume">${svg('message', 14)} Resume last session</button>` : ''}
      <button class="btn ghost d-launch hidden"></button>
      <button class="btn ghost d-stop hidden" title="Stop the running app/site">${svg('stop', 14)} Stop</button>
      <button class="icon-btn d-folder" title="Open folder in Explorer">${svg('folder', 16)}</button>
    </div>

    <div class="kpis usage-kpis">
      <div class="kpi"><div class="kpi-val">${relTime(t.lastTs)}</div><div class="kpi-lbl">Last active</div></div>
      <div class="kpi"><div class="kpi-val">${fmtDuration(t.activeMs)}</div><div class="kpi-lbl">Time spent</div></div>
      <div class="kpi"><div class="kpi-val">${fmtNum(t.sessions)}</div><div class="kpi-lbl">Sessions</div></div>
    </div>

    <div class="panel">
      <div class="panel-title">Sessions <span class="panel-hint">${sessions.length} · newest first · click to read</span></div>
      <div class="session-list">
      ${sessions.map(([id, s]) => `<div class="session-row" data-session="${escapeHtml(id)}">
          <div class="s-main">
            <div class="s-title">${escapeHtml(s.title || 'Untitled session')} <span class="s-open">read ›</span></div>
            <div class="s-meta">${relTime(s.lastTs)} · ${fmtDuration(s.activeMs)} · ${s.turns} turns</div>
          </div>
          <button class="s-resume" title="Reopen this exact conversation in Claude Code (claude --resume)">${svg('repeat', 14)} Resume</button>
          <button class="s-branch" title="Fork this conversation into a new Claude Code session (original untouched)">${svg('branch', 14)} Branch</button>
        </div>`).join('')}
      </div>
    </div>

    <div class="panel">${barChart(d.series, 'activeMs', fmtDuration, 'Time per day · last 30 days')}</div>

    <details class="more-detail">
      <summary>Tokens, models, tools &amp; files</summary>
      <div class="detail-grid" style="margin-top:12px">
        <div class="panel">
          <div class="panel-title">Tokens &amp; models</div>
          <table class="mini-table">
            <tr><td>Input</td><td>${fmtTokens(t.tokens.in)}</td></tr>
            <tr><td>Output</td><td>${fmtTokens(t.tokens.out)}</td></tr>
            <tr><td>Cache write</td><td>${fmtTokens(t.tokens.cw)}</td></tr>
            <tr><td>Cache read</td><td>${fmtTokens(t.tokens.cr)}</td></tr>
          </table>
          <div class="panel-title" style="margin-top:16px">Models</div>
          ${models.map(([m, c]) => `<div class="kv"><span>${escapeHtml(m.replace('claude-', ''))}</span><span class="muted">${c}×</span></div>`).join('') || '<p class="panel-sub">—</p>'}
        </div>
        <div class="panel">
          <div class="panel-title">Tools</div>
          ${tools.map(([name, c]) => `<div class="toolbar-row"><span class="tr-name">${escapeHtml(name)}</span><div class="tr-track"><div class="tr-fill" style="width:${(c / toolMax) * 100}%"></div></div><span class="tr-count">${c}</span></div>`).join('') || '<p class="panel-sub">—</p>'}
          <div class="panel-title" style="margin-top:16px">Most-edited files</div>
          ${files.map(([f, c]) => `<div class="kv"><span title="${escapeHtml(f)}" class="file-name">${escapeHtml(f.split(/[\\/]/).pop())}</span><span class="muted">${c}</span></div>`).join('') || '<p class="panel-sub">—</p>'}
        </div>
      </div>
    </details>

    ${notesPanel(p)}`;

  wireNotes(body, p);
  body.querySelector('.d-open').addEventListener('click', async () => { const r = await window.launcher.openProject(p.path); await handleLaunchResult(r, p.name); });
  wireDetailLaunch(body, p);
  const dr = body.querySelector('.d-resume');
  if (dr) dr.addEventListener('click', async () => { const r = await window.launcher.resumeSession(p.path, lastId); if (r && r.ok) showStatus('Resuming last session in Claude Code…', 'ok'); else showStatus((r && r.error) || 'Could not resume.', 'warn'); });
  const df = body.querySelector('.d-folder');
  if (df) df.addEventListener('click', () => window.launcher.openInExplorer(p.path));
  body.querySelectorAll('.session-row[data-session]').forEach((row) => {
    row.addEventListener('click', () => openTranscript({ cwd: p.path, sessionId: row.dataset.session }, 'detail'));
    const rb = row.querySelector('.s-resume');
    if (rb) rb.addEventListener('click', async (e) => {
      e.stopPropagation();
      const r = await window.launcher.resumeSession(p.path, row.dataset.session);
      if (r && r.ok) showStatus('Resuming this session in Claude Code…', 'ok');
      else showStatus((r && r.error) || 'Could not resume this session.', 'warn');
    });
    const bb = row.querySelector('.s-branch');
    if (bb) bb.addEventListener('click', async (e) => {
      e.stopPropagation();
      const r = await window.launcher.branchSession(p.path, row.dataset.session);
      if (r && r.ok) showStatus('Branched — a new forked session is opening in Claude Code. The original is untouched.', 'ok');
      else showStatus((r && r.error) || 'Could not branch this session.', 'warn');
    });
  });
}

// ---------- overview (Phase 4) ----------
const SERIES_COLORS = ['#d97757', '#4f7d5b', '#5b7db1', '#c79a3c', '#9b6f9e', '#3f9b9b', '#b1614a', '#7a8c4a'];

// Multi-line history graph: x = time over the selected range, y = active time,
// one line per project. Buckets are hourly (1-day range) or daily (longer ranges).
// ---- configurable Analytics chart (metric × view) ----
function seriesFor(p, metric) {
  if (metric === 'cost') return p.costS || [];
  if (metric === 'tokens') return p.tokenS || [];
  return p.active || []; // time, in ms
}
function fmtMetric(metric, v) {
  if (metric === 'cost') return fmtCost(v);
  if (metric === 'tokens') return fmtNum(Math.round(v));
  return fmtDuration(v);
}
function yLabelMetric(metric, v) {
  if (metric === 'cost') return '$' + (v >= 10 ? Math.round(v) : v.toFixed(1));
  if (metric === 'tokens') return v >= 1000 ? Math.round(v / 1000) + 'k' : String(Math.round(v));
  const min = v / 60000;
  return min >= 120 ? (min / 60).toFixed(1) + 'h' : Math.round(min) + 'm';
}
function metricChart(range, metric, view) {
  const { labels, hourly } = range;
  const projects = (range.breakdown || []).filter((p) => seriesFor(p, metric).some((v) => v > 0));
  if (!projects.length) {
    const hint = metric === 'tokens' && hourly ? ' Token history needs a range of 7 days or more.' : '';
    return `<p class="panel-sub">No ${metric} data in this range.${hint}</p>`;
  }
  const top = projects.slice(0, 8);
  const n = labels.length;
  const W = 760, H = 240, padL = 48, padR = 12, padT = 12, padB = 28;
  const x = (i) => padL + (n <= 1 ? 0 : (i / (n - 1)) * (W - padL - padR));
  let max = 0;
  if (view === 'stacked') {
    for (let i = 0; i < n; i++) { let sum = 0; top.forEach((p) => { sum += seriesFor(p, metric)[i] || 0; }); if (sum > max) max = sum; }
  } else {
    top.forEach((p) => seriesFor(p, metric).forEach((v) => { if (v > max) max = v; }));
  }
  max = max || 1;
  const y = (v) => H - padB - (v / max) * (H - padT - padB);
  let grid = '';
  [0, 0.5, 1].forEach((f) => {
    const yy = y(max * f);
    grid += `<line x1="${padL}" y1="${yy}" x2="${W - padR}" y2="${yy}" stroke="var(--line)" stroke-width="1"/>`;
    grid += `<text x="${padL - 6}" y="${yy + 3}" text-anchor="end" font-size="9" fill="var(--muted)">${yLabelMetric(metric, max * f)}</text>`;
  });
  let xlab = '';
  const step = hourly ? 24 : Math.max(1, Math.ceil(n / 6));
  labels.forEach((t, i) => {
    const d = new Date(t);
    const tick = hourly ? (d.getHours() === 0 && i > 0) : (i % step === 0);
    if (tick) xlab += `<text x="${x(i)}" y="${H - padB + 13}" text-anchor="middle" font-size="9" fill="var(--muted)">${d.getMonth() + 1}/${d.getDate()}</text>`;
  });
  xlab += `<text x="${x(n - 1)}" y="${H - padB + 13}" text-anchor="end" font-size="9" fill="var(--muted)">now</text>`;
  let plot = '';
  if (view === 'stacked') {
    const bw = (W - padL - padR) / n;
    for (let i = 0; i < n; i++) {
      let acc = 0; const d = new Date(labels[i]);
      top.forEach((p, idx) => {
        const v = seriesFor(p, metric)[i] || 0; if (v <= 0) return;
        const h = (v / max) * (H - padT - padB);
        const yTop = H - padB - ((acc + v) / max) * (H - padT - padB); acc += v;
        plot += `<rect x="${(padL + i * bw + 0.5).toFixed(1)}" y="${yTop.toFixed(1)}" width="${Math.max(1, bw - 1).toFixed(1)}" height="${h.toFixed(1)}" fill="${SERIES_COLORS[idx % SERIES_COLORS.length]}"><title>${escapeHtml(p.name)}: ${fmtMetric(metric, v)} (${d.getMonth() + 1}/${d.getDate()})</title></rect>`;
      });
    }
  } else {
    top.forEach((p, idx) => {
      const color = SERIES_COLORS[idx % SERIES_COLORS.length];
      const pts = seriesFor(p, metric).map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
      plot += `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><title>${escapeHtml(p.name)}</title></polyline>`;
    });
  }
  const legend = top.map((p, idx) => {
    const color = SERIES_COLORS[idx % SERIES_COLORS.length];
    const tot = seriesFor(p, metric).reduce((a, b) => a + b, 0);
    return `<div class="leg"><span class="leg-dot" style="background:${color}"></span><span class="leg-name">${escapeHtml(p.name)}</span><span class="leg-meta">${fmtMetric(metric, tot)}</span></div>`;
  }).join('');
  return `<svg class="linechart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${grid}${xlab}${plot}</svg><div class="legend">${legend}</div>`;
}
function analyticsChartPanel(range) {
  const mb = (m, label) => `<button data-metric="${m}" class="${analyticsMetric === m ? 'active' : ''}">${label}</button>`;
  const vb = (v, label) => `<button data-view="${v}" class="${analyticsView === v ? 'active' : ''}">${label}</button>`;
  return `<div class="panel">
    <div class="panel-title">Chart
      <div class="chart-controls">
        <div class="seg metric-seg">${mb('time', 'Time')}${mb('cost', 'Cost')}${mb('tokens', 'Tokens')}</div>
        <div class="seg view-seg">${vb('lines', 'Lines')}${vb('stacked', 'Stacked')}</div>
      </div>
    </div>
    <div id="analytics-chart">${metricChart(range, analyticsMetric, analyticsView)}</div>
  </div>`;
}

function historyChart(range) {
  const { labels, hourly } = range;
  const projects = (range.breakdown || []).filter((p) => p.totalMs > 0);
  if (!projects.length) return '<p class="panel-sub">No Claude activity in this range.</p>';

  const W = 760, H = 220, padL = 40, padR = 12, padT = 12, padB = 26;
  const n = labels.length;
  const top = projects.slice(0, 8);
  let maxMin = 1;
  top.forEach((p) => p.active.forEach((ms) => { const m = ms / 60000; if (m > maxMin) maxMin = m; }));
  const x = (i) => padL + (n <= 1 ? 0 : (i / (n - 1)) * (W - padL - padR));
  const y = (min) => H - padB - (min / maxMin) * (H - padT - padB);
  const yLabel = (min) => (min >= 120 ? (min / 60).toFixed(1) + 'h' : Math.round(min) + 'm');

  let grid = '';
  [0, 0.5, 1].forEach((f) => {
    const yy = y(maxMin * f);
    grid += `<line x1="${padL}" y1="${yy}" x2="${W - padR}" y2="${yy}" stroke="var(--line)" stroke-width="1"/>`;
    grid += `<text x="${padL - 6}" y="${yy + 3}" text-anchor="end" font-size="9" fill="var(--muted)">${yLabel(maxMin * f)}</text>`;
  });

  let xlab = '';
  const step = hourly ? 24 : Math.max(1, Math.ceil(n / 6));
  labels.forEach((t, i) => {
    const d = new Date(t);
    const tick = hourly ? (d.getHours() === 0 && i > 0) : (i % step === 0);
    if (tick) {
      xlab += `<line x1="${x(i)}" y1="${padT}" x2="${x(i)}" y2="${H - padB}" stroke="var(--line)" stroke-width="1" stroke-dasharray="2 3"/>`;
      xlab += `<text x="${x(i)}" y="${H - padB + 13}" text-anchor="middle" font-size="9" fill="var(--muted)">${d.getMonth() + 1}/${d.getDate()}</text>`;
    }
  });
  xlab += `<text x="${x(n - 1)}" y="${H - padB + 13}" text-anchor="end" font-size="9" fill="var(--muted)">now</text>`;

  let lines = '';
  top.forEach((p, idx) => {
    const color = SERIES_COLORS[idx % SERIES_COLORS.length];
    const pts = p.active.map((ms, i) => `${x(i).toFixed(1)},${y(ms / 60000).toFixed(1)}`).join(' ');
    lines += `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><title>${p.name}</title></polyline>`;
  });

  const legend = top.map((p, idx) => {
    const color = SERIES_COLORS[idx % SERIES_COLORS.length];
    return `<div class="leg"><span class="leg-dot" style="background:${color}"></span><span class="leg-name">${p.name}</span><span class="leg-meta">${fmtDuration(p.totalMs)} · ${fmtCost(p.totalCost)}</span></div>`;
  }).join('');

  return `
    <svg class="linechart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${grid}${xlab}${lines}</svg>
    <div class="legend">${legend}</div>`;
}

const RANGE_LABEL = { 1: 'today', 7: 'last 7 days', 30: 'last 30 days', 90: 'last 3 months' };

function heatmap(days) {
  const max = Math.max(...days.map((d) => d.activeMs), 1);
  return `<div class="heatmap">${days.map((d) => {
    const lvl = d.activeMs === 0 ? 0 : Math.ceil((d.activeMs / max) * 4);
    return `<div class="hm-cell hm-${lvl}" title="${d.day}: ${fmtDuration(d.activeMs)}, ${fmtCost(d.cost)}"></div>`;
  }).join('')}</div>`;
}

function budgetBar(label, spend, budget) {
  if (!budget) return `<div class="kv"><span>${label}</span><span class="muted">${fmtCost(spend)} · no budget set</span></div>`;
  const pct = Math.min(100, (spend / budget) * 100);
  const over = spend > budget;
  return `<div class="budget-row">
    <div class="budget-head"><span>${label}</span><span class="${over ? 'over' : 'muted'}">${fmtCost(spend)} / ${fmtCost(budget)}</span></div>
    <div class="budget-track"><div class="budget-fill ${over ? 'over' : (pct >= 80 ? 'warn' : '')}" style="width:${pct}%"></div></div>
  </div>`;
}
function budgetPanel(bs, forecast) {
  return `
    <div class="kv"><span>Projected this month</span><span><strong>${fmtCost(forecast)}</strong> <span class="muted">at current rate</span></span></div>
    <div style="margin-top:12px">${budgetBar('This week', bs.weekly.spend, bs.weekly.budget)}</div>
    ${budgetBar('This month', bs.monthly.spend, bs.monthly.budget)}
    ${(!bs.weekly.budget && !bs.monthly.budget) ? '<p class="panel-sub" style="margin-top:6px">Set a budget in Settings to get alerts.</p>' : ''}`;
}
function modelMixBars(ms) {
  const entries = Object.entries(ms).filter(([, c]) => c > 0).sort((a, b) => b[1] - a[1]);
  if (!entries.length) return '<p class="panel-sub">No spend recorded yet.</p>';
  const max = entries[0][1];
  return entries.map(([m, c], i) => `<div class="toolbar-row">
    <span class="tr-name">${escapeHtml(m.replace('claude-', '').replace('unknown', '—'))}</span>
    <div class="tr-track"><div class="tr-fill" style="width:${(c / max) * 100}%;background:${SERIES_COLORS[i % SERIES_COLORS.length]}"></div></div>
    <span class="tr-count">${fmtCost(c)}</span>
  </div>`).join('');
}

const DOW = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
function hourLabel(h) { const ap = h < 12 ? 'am' : 'pm'; let hh = h % 12; if (hh === 0) hh = 12; return `${hh}${ap}`; }
function deltaBadge(pct, lastVal) {
  if (!lastVal) return '<span class="delta new">new</span>';
  const up = pct >= 0;
  return `<span class="delta ${up ? 'up' : 'down'}">${up ? '▲' : '▼'}${Math.abs(pct)}% vs last wk</span>`;
}
function insightsBlock(ins) {
  if (!ins) return '';
  const w = ins.wow || {};
  const trends = `
    <div class="panel">
      <div class="panel-title">Trends <span class="panel-hint">this week vs last</span></div>
      <div class="kv"><span>Time this week</span><span>${fmtDuration(w.thisMs || 0)} ${deltaBadge(w.msPct, w.lastMs)}</span></div>
      ${ins.anyHourly ? `<div class="kv"><span>Busiest</span><span>${DOW[ins.busiestDow]} · ${hourLabel(ins.busiestHour)}</span></div>` : ''}
      <div class="kv"><span>Spend this week <span class="est">est.</span></span><span class="muted" title="${COST_TIP}">${fmtCost(w.thisCost || 0)} ${deltaBadge(w.costPct, w.lastCost)}</span></div>
    </div>`;
  const list = (ins.topByTime && ins.topByTime.length) ? ins.topByTime : [];
  const top = list.length ? `
    <div class="panel">
      <div class="panel-title">Longest sessions <span class="panel-hint">all-time · click to read</span></div>
      ${list.map((s) => `<div class="kv lead-row" data-path="${escapeHtml(s.path)}" data-session="${escapeHtml(s.sessionId)}">
          <span class="lead-name">${escapeHtml(s.title || s.name)} <span class="s-open">read ›</span></span>
          <span class="muted">${fmtDuration(s.activeMs)}</span>
        </div>`).join('')}
    </div>` : '';
  return `<div class="detail-grid">${trends}${top}</div>`;
}

// Friendly empty state for data views before there's any Claude history.
function dataEmpty(icon, title, msg) {
  return `<div class="welcome">
      <div class="welcome-mark">${svg(icon, 28)}</div>
      <h3>${title}</h3>
      <p>${msg}</p>
      <div class="welcome-actions"><button class="btn primary go-projects">${svg('grid', 14)} Go to projects</button></div>
    </div>`;
}

// Overview = glanceable dashboard (fixed last-7-days): KPIs, recap, budget, heatmap.
async function loadOverview() {
  const [res, bs] = await Promise.all([
    window.launcher.overviewMetrics(7),
    window.launcher.budgetStatus(),
  ]);
  const t = res.range.totals;
  const forecast = (bs.weekly.spend / 7) * 30;
  const body = $('overview-body');
  if (!t.sessions && !t.activeMs) {
    body.innerHTML = dataEmpty('gauge', 'Your dashboard is ready', "No Claude Code activity in the last 7 days yet. Open a project in Claude and your time, sessions, and a daily recap will show up here automatically.");
    const g = body.querySelector('.go-projects'); if (g) g.addEventListener('click', () => switchView('projects'));
    return;
  }
  body.innerHTML = `
    <div class="kpis">
      <div class="kpi"><div class="kpi-val">${fmtDuration(t.activeMs)}</div><div class="kpi-lbl">Time · 7 days</div></div>
      <div class="kpi"><div class="kpi-val">${fmtNum(t.sessions)}</div><div class="kpi-lbl">Sessions</div></div>
      <div class="kpi"><div class="kpi-val">${fmtNum(t.projects)}</div><div class="kpi-lbl">Projects active</div></div>
      <div class="kpi quiet" title="${COST_TIP}"><div class="kpi-val">${fmtCost(t.cost)}</div><div class="kpi-lbl">Cost · 7d <span class="est">est.</span></div></div>
    </div>
    <div class="panel recap-panel">
      <div class="panel-title">Recap
        <div class="seg recap-range">
          <button data-range="today" class="${recapRange === 'today' ? 'active' : ''}">Today</button>
          <button data-range="week" class="${recapRange === 'week' ? 'active' : ''}">This week</button>
        </div>
        <button class="btn ghost btn-xs recap-refresh" title="Regenerate recap">${svg('repeat', 14)}</button>
      </div>
      <div id="recap-body"><p class="panel-sub">Loading activity…</p></div>
    </div>
    <div class="dash-grid">
      ${cfg.hasAdminKey ? `<div class="panel" id="billing-panel">
        <div class="panel-title">Real billed usage <span class="panel-hint">month to date</span></div>
        <div id="billing-body"><p class="panel-sub">Fetching billed usage…</p></div>
      </div>` : ''}
      <div class="panel">
        <div class="panel-title">Budget &amp; forecast</div>
        ${budgetPanel(bs, forecast)}
      </div>
      <div class="panel">
        <div class="panel-title">Activity <span class="panel-hint">last 30 days</span></div>
        ${heatmap(res.heatDays)}
      </div>
    </div>`;

  const rr = body.querySelector('.recap-refresh');
  if (rr) rr.addEventListener('click', () => loadRecap(true));
  body.querySelectorAll('.recap-range button').forEach((b) => b.addEventListener('click', () => {
    recapRange = b.dataset.range;
    body.querySelectorAll('.recap-range button').forEach((x) => x.classList.toggle('active', x === b));
    loadRecap(false);
  }));
  loadRecap(false);
  if (cfg.hasAdminKey) loadBilling();
}

// Analytics = deep dive (range selector): history, breakdown, model spend,
// efficiency/trends, top sessions, MCP usage.
async function loadAnalytics(days) {
  overviewDays = days || overviewDays || 7;
  document.querySelectorAll('#rangeToggle button').forEach((b) =>
    b.classList.toggle('active', Number(b.dataset.days) === overviewDays));

  const [res, ms, ins, mcp] = await Promise.all([
    window.launcher.overviewMetrics(overviewDays),
    window.launcher.modelSpend(),
    window.launcher.insights(),
    window.launcher.mcpUsage(),
  ]);
  const r = res.range;
  lastAnalyticsRange = r;
  const body = $('analytics-body');
  const t = r.totals;
  const rangeWord = RANGE_LABEL[overviewDays] || `last ${overviewDays} days`;
  if (!t.sessions && !r.breakdown.length) {
    body.innerHTML = dataEmpty('chart', 'No analytics yet', `No Claude Code activity in the ${rangeWord}. Once you work in a project, charts, trends, and a per-project breakdown fill in here. Try a wider range, or open a project.`);
    const g = body.querySelector('.go-projects'); if (g) g.addEventListener('click', () => switchView('projects'));
    return;
  }

  body.innerHTML = `
    <div class="kpis">
      <div class="kpi"><div class="kpi-val">${fmtDuration(t.activeMs)}</div><div class="kpi-lbl">Time · ${rangeWord}</div></div>
      <div class="kpi"><div class="kpi-val">${fmtNum(t.sessions)}</div><div class="kpi-lbl">Sessions</div></div>
      <div class="kpi"><div class="kpi-val">${fmtNum(t.projects)}</div><div class="kpi-lbl">Projects</div></div>
      <div class="kpi quiet" title="${COST_TIP}"><div class="kpi-val">${fmtCost(t.cost)}</div><div class="kpi-lbl">Cost <span class="est">est.</span></div></div>
    </div>
    ${analyticsChartPanel(r)}
    <div class="panel">
      <div class="panel-title">Projects by time <span class="panel-hint">${rangeWord}</span></div>
      ${r.breakdown.length ? `<table class="breakdown">
        <thead><tr><th>Project</th><th>Time</th><th>Cost</th><th>Sessions</th><th>Last active</th></tr></thead>
        <tbody>
          ${r.breakdown.map((p) => `<tr data-path="${p.path}">
            <td class="bd-name">${p.name}</td>
            <td>${fmtDuration(p.activeMs)}</td>
            <td>${fmtCost(p.cost)}</td>
            <td>${fmtNum(p.sessions)}</td>
            <td class="muted">${relTime(p.lastTs)}</td>
          </tr>`).join('')}
        </tbody>
      </table>` : '<p class="panel-sub">No project activity in this range.</p>'}
    </div>
    <div class="panel">
      <div class="panel-title">Spend by model <span class="panel-hint">all-time</span></div>
      ${modelMixBars(ms)}
    </div>
    ${insightsBlock(ins)}
    ${mcpBlock(mcp)}`;

  body.querySelectorAll('tr[data-path]').forEach((row) => {
    row.addEventListener('click', () => {
      const p = r.breakdown.find((x) => x.path === row.dataset.path);
      if (p) openDetail({ name: p.name, path: p.path, external: true });
    });
  });
  body.querySelectorAll('.lead-row[data-session]').forEach((row) => {
    row.addEventListener('click', () => openTranscript({ cwd: row.dataset.path, sessionId: row.dataset.session }, 'analytics'));
  });
  const redrawChart = () => {
    body.querySelectorAll('.metric-seg button').forEach((b) => b.classList.toggle('active', b.dataset.metric === analyticsMetric));
    body.querySelectorAll('.view-seg button').forEach((b) => b.classList.toggle('active', b.dataset.view === analyticsView));
    const c = $('analytics-chart');
    if (c && lastAnalyticsRange) c.innerHTML = metricChart(lastAnalyticsRange, analyticsMetric, analyticsView);
  };
  body.querySelectorAll('.metric-seg button').forEach((b) => b.addEventListener('click', () => { analyticsMetric = b.dataset.metric; redrawChart(); }));
  body.querySelectorAll('.view-seg button').forEach((b) => b.addEventListener('click', () => { analyticsView = b.dataset.view; redrawChart(); }));
}

// ---------- compare projects ----------
function openCompare() {
  const all = [...projects, ...externalProjects];
  if (!all.length) { showStatus('No projects to compare yet.', 'warn'); return; }
  const opts = '<option value="">— none —</option>' + all.map((p) => `<option value="${escapeHtml(p.path)}">${escapeHtml(p.name)}</option>`).join('');
  const picks = document.querySelectorAll('.cmp-pick');
  picks.forEach((sel) => { sel.innerHTML = opts; });
  if (all[0]) picks[0].value = all[0].path;
  if (all[1]) picks[1].value = all[1].path;
  $('compareModal').classList.remove('hidden');
  renderCompare();
}
async function renderCompare() {
  const paths = [...document.querySelectorAll('.cmp-pick')].map((s) => s.value).filter(Boolean);
  const uniq = [...new Set(paths)];
  const result = $('compareResult');
  if (uniq.length < 2) { result.innerHTML = '<p class="panel-sub">Pick at least two different projects.</p>'; return; }
  const all = [...projects, ...externalProjects];
  const data = await Promise.all(uniq.map(async (p) => ({
    name: (all.find((x) => x.path === p) || {}).name || p.split(/[\\/]/).pop(),
    m: await window.launcher.projectMetrics(p),
  })));
  const tok = (m) => m.tokens.in + m.tokens.out + m.tokens.cw + m.tokens.cr;
  const rows = [
    ['Time', (d) => fmtDuration(d.m.activeMs), (d) => d.m.activeMs],
    ['Cost (est.)', (d) => fmtCost(d.m.cost), (d) => d.m.cost],
    ['Sessions', (d) => fmtNum(d.m.sessions), (d) => d.m.sessions],
    ['Turns', (d) => fmtNum(d.m.turns), (d) => d.m.turns],
    ['Tokens', (d) => fmtNum(tok(d.m)), (d) => tok(d.m)],
    ['Cost / turn', (d) => fmtCost(d.m.turns ? d.m.cost / d.m.turns : 0), (d) => (d.m.turns ? d.m.cost / d.m.turns : 0)],
    ['Top tool', (d) => { const t = Object.entries(d.m.tools || {}).sort((a, b) => b[1] - a[1])[0]; return t ? `${t[0]} (${fmtNum(t[1])})` : '—'; }, null],
  ];
  result.innerHTML = `<table class="compare-table">
    <thead><tr><th></th>${data.map((d) => `<th>${escapeHtml(d.name)}</th>`).join('')}</tr></thead>
    <tbody>${rows.map(([label, fn, valFn]) => {
      const max = valFn ? Math.max(...data.map(valFn), 0) : 0;
      return `<tr><td class="cmp-label">${label}</td>${data.map((d) => {
        const lead = valFn && max > 0 && valFn(d) === max && data.length > 1 ? ' cmp-lead' : '';
        return `<td class="${lead}">${fn(d)}</td>`;
      }).join('')}</tr>`;
    }).join('')}</tbody>
  </table>`;
}

// which MCP servers/tools you lean on
function mcpBlock(mcp) {
  if (!mcp || !mcp.length) return '';
  return `<div class="panel">
    <div class="panel-title">MCP usage <span class="panel-hint">servers &amp; tools you lean on · all-time</span></div>
    ${mcp.map((s) => `<div class="mcp-row">
        <div class="mcp-head"><span class="mcp-name">${escapeHtml(s.server)}</span><span class="muted">${fmtNum(s.count)} call${s.count === 1 ? '' : 's'}</span></div>
        <div class="mcp-tools">${s.tools.map(([t, c]) => `<span class="mcp-tool">${escapeHtml(t)} <b>${fmtNum(c)}</b></span>`).join('')}</div>
      </div>`).join('')}
  </div>`;
}

async function loadBilling() {
  const el = document.getElementById('billing-body');
  if (!el) return;
  const r = await window.launcher.adminBilling();
  const node = document.getElementById('billing-body');
  if (!node) return;
  if (!r || !r.hasKey) { node.innerHTML = '<p class="panel-sub">Add an Admin API key in Settings to see real billed usage.</p>'; return; }
  if (r.error) { node.innerHTML = `<p class="panel-sub">Couldn't fetch billed usage: ${escapeHtml(r.error)}</p>`; return; }
  node.innerHTML = `<div class="billing-amt">${fmtCost(r.amount || 0)}</div>
    <p class="panel-sub">Actual billed cost so far this month (USD), pulled from Anthropic's Cost API — not an estimate.</p>`;
}

async function loadRecap(force) {
  const bodyEl = document.getElementById('recap-body');
  if (!bodyEl) return;
  bodyEl.innerHTML = force ? '<p class="panel-sub">Generating recap…</p>' : '<p class="panel-sub">Loading activity…</p>';
  const r = await window.launcher.dailyRecap({ force: !!force, range: recapRange });
  const node = document.getElementById('recap-body');
  if (!node || r.range !== recapRange) return; // navigated away or range switched
  const word = recapRange === 'week' ? 'in the last 7 days' : 'yet today';
  if (r.empty) {
    node.innerHTML = `<p class="panel-sub">No Claude activity logged ${word}. Open a project and it'll show up here.</p>`;
    return;
  }
  const sentence = `${fmtDuration(r.totalMs)} · ${fmtCost(r.totalCost)} · ${r.projects.length} project${r.projects.length === 1 ? '' : 's'}`;
  let html = `<div class="recap-stat">${sentence}</div>`;
  if (r.narrative) {
    const bullets = r.narrative.split('\n').map((l) => l.replace(/^[-•*]\s*/, '').trim()).filter(Boolean);
    html += `<ul class="recap-list">${bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}</ul>`;
  } else {
    html += `<ul class="recap-list">${r.projects.map((p) => {
      const title = p.titles && p.titles.length ? ' — ' + escapeHtml(p.titles[0]) : '';
      return `<li><strong>${escapeHtml(p.name)}</strong> · ${fmtDuration(p.activeMs)} · ${fmtCost(p.cost)}${title}</li>`;
    }).join('')}</ul>`;
    if (!r.hasKey) html += '<p class="panel-sub recap-hint">Add an Anthropic API key in Settings for an AI-written narrative recap.</p>';
  }
  if (r.aiError) html += `<p class="panel-sub recap-hint">AI recap unavailable right now (${escapeHtml(r.aiError)}). Showing the factual summary.</p>`;
  node.innerHTML = html;
}

// ---------- modal ----------
// ---------- command palette (⌘K) ----------
let paletteItems = [];
let paletteIdx = 0;

function buildPaletteCommands() {
  const cmds = [];
  [['projects', 'Projects', 'grid'], ['overview', 'Overview', 'chart'], ['search', 'Search', 'search'],
   ['context', 'Context', 'brain'], ['routines', 'Routines', 'repeat'], ['settings', 'Settings', 'gear']]
    .forEach(([v, label, icon]) => cmds.push({ icon, label, hint: 'Tab', run: () => switchView(v) }));
  cmds.push({ icon: 'plus', label: 'New project', hint: 'Action', run: () => { switchView('projects'); openModal(); } });
  cmds.push({ icon: 'moon', label: 'Toggle dark mode', hint: 'Action', run: async () => { const next = (cfg.theme === 'dark') ? 'light' : 'dark'; cfg.theme = await window.launcher.setTheme(next); applyTheme(cfg.theme); } });
  ACCENTS.forEach((a) => cmds.push({ icon: 'star', label: 'Accent: ' + a.charAt(0).toUpperCase() + a.slice(1), hint: 'Theme', run: async () => { cfg.accent = await window.launcher.setAccent(a); applyAccent(cfg.accent); } }));
  [...projects, ...externalProjects].forEach((p) => {
    cmds.push({ icon: p.external ? 'layers' : 'folder', label: p.name, sub: p.path, hint: 'Open in Claude',
      run: async () => { const r = await window.launcher.openProject(p.path); handleLaunchResult(r, p.name); } });
  });
  return cmds;
}

function openPalette() {
  const ov = $('paletteOverlay');
  ov.classList.remove('hidden');
  const inp = $('paletteInput');
  inp.value = '';
  renderPalette('');
  setTimeout(() => inp.focus(), 20);
}
function closePalette() { $('paletteOverlay').classList.add('hidden'); }
function paletteOpen() { return !$('paletteOverlay').classList.contains('hidden'); }

function renderPalette(q) {
  const query = q.trim().toLowerCase();
  let items = query
    ? buildPaletteCommands().filter((c) => (c.label + ' ' + (c.sub || '')).toLowerCase().includes(query))
    : buildPaletteCommands();
  if (query.length >= 2) {
    items = [{ icon: 'search', label: `Search history for "${q.trim()}"`, hint: 'Search',
      run: () => { switchView('search'); const si = $('searchInput'); if (si) { si.value = q.trim(); runSearch(q.trim()); } } }, ...items];
  }
  paletteItems = items.slice(0, 60);
  paletteIdx = 0;
  drawPaletteList();
}

function drawPaletteList() {
  const list = $('paletteList');
  if (!paletteItems.length) { list.innerHTML = '<div class="palette-empty">No matches.</div>'; return; }
  list.innerHTML = paletteItems.map((c, i) => `<div class="palette-item ${i === paletteIdx ? 'sel' : ''}" data-i="${i}">
      <span class="palette-i-ico">${svg(c.icon || 'chev', 16)}</span>
      <span class="palette-i-label">${escapeHtml(c.label)}${c.sub ? `<span class="palette-i-sub">${escapeHtml(c.sub)}</span>` : ''}</span>
      <span class="palette-i-hint">${escapeHtml(c.hint || '')}</span>
    </div>`).join('');
  list.querySelectorAll('.palette-item').forEach((el) => {
    el.addEventListener('click', () => runPaletteItem(Number(el.dataset.i)));
    el.addEventListener('mousemove', () => { if (paletteIdx !== Number(el.dataset.i)) { paletteIdx = Number(el.dataset.i); highlightPalette(); } });
  });
  highlightPalette();
}
function highlightPalette() {
  const list = $('paletteList');
  list.querySelectorAll('.palette-item').forEach((el, i) => el.classList.toggle('sel', i === paletteIdx));
  const sel = list.querySelector('.palette-item.sel');
  if (sel) sel.scrollIntoView({ block: 'nearest' });
}
function movePalette(d) { if (!paletteItems.length) return; paletteIdx = (paletteIdx + d + paletteItems.length) % paletteItems.length; highlightPalette(); }
function runPaletteItem(i) { const c = paletteItems[i]; if (!c) return; closePalette(); try { c.run(); } catch {} }

function openModal() { $('modal').classList.remove('hidden'); $('newName').value = ''; $('newName').focus(); }
function closeModal() { $('modal').classList.add('hidden'); }
async function doCreate() {
  const name = $('newName').value;
  if (!name.trim()) { $('newName').focus(); return; }
  const res = await window.launcher.createProject(cfg.root, name);
  if (res.ok) {
    closeModal();
    if (res.launch && !res.launch.ok) await handleLaunchResult(res.launch, name);
    else showStatus(`Created ${name} — opening Claude…`, 'ok');
  } else { showStatus(res.error, 'error'); }
}

// ---------- init ----------
window.addEventListener('error', (e) => console.error('renderer error:', e.message));
window.addEventListener('unhandledrejection', (e) => console.error('renderer rejection:', e.reason));

function applyRedact(on) {
  document.body.classList.toggle('redact', !!on);
  const t = $('optRedact'); if (t) t.checked = !!on;
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const btn = $('themeToggle');
  if (btn) {
    const ico = btn.querySelector('.ico');
    const lbl = btn.querySelector('.theme-label');
    if (ico) ico.innerHTML = svg(theme === 'dark' ? 'sun' : 'moon');
    if (lbl) lbl.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
  }
  // Settings → Personalize theme segmented control
  document.querySelectorAll('#setThemeSeg button').forEach((b) =>
    b.classList.toggle('active', b.dataset.theme === theme));
}

// ---- global-shortcut helpers ----
const IS_MAC = window.launcher.platform === 'darwin';
// Human-readable label for an Electron accelerator string.
function prettyHotkey(accel) {
  if (!accel) return '';
  return accel.split('+').map((part) => {
    if (part === 'CommandOrControl' || part === 'CmdOrCtrl') return IS_MAC ? '⌘' : 'Ctrl';
    if (part === 'Command' || part === 'Cmd' || part === 'Super' || part === 'Meta') return IS_MAC ? '⌘' : 'Win';
    if (part === 'Control') return 'Ctrl';
    if (part === 'Alt' || part === 'Option') return IS_MAC ? '⌥' : 'Alt';
    if (part === 'Shift') return IS_MAC ? '⇧' : 'Shift';
    return part;
  }).join(' + ');
}
// Convert a keydown event into an Electron accelerator, or '' if not a valid combo.
function eventToAccelerator(e) {
  const mods = [];
  if (e.ctrlKey || e.metaKey) mods.push('CommandOrControl');
  if (e.altKey) mods.push('Alt');
  if (e.shiftKey) mods.push('Shift');
  let key = e.key;
  if (['Control', 'Shift', 'Alt', 'Meta', 'OS'].includes(key)) return ''; // modifier alone
  if (key === ' ' || e.code === 'Space') key = 'Space';
  else if (/^[a-z]$/i.test(key)) key = key.toUpperCase();
  else if (/^F\d{1,2}$/.test(key)) { /* function keys as-is */ }
  else if (/^Arrow/.test(key)) key = key.replace('Arrow', '');
  else if (key.length !== 1) return ''; // unsupported special key
  if (!mods.length) return ''; // require at least one modifier
  return [...mods, key].join('+');
}

const ACCENTS = ['clay', 'lagoon', 'aubergine', 'jade'];
function applyAccent(accent) {
  const a = ACCENTS.includes(accent) ? accent : 'clay';
  // 'clay' is the default :root palette — no attribute needed.
  if (a === 'clay') document.documentElement.removeAttribute('data-accent');
  else document.documentElement.setAttribute('data-accent', a);
  // sidebar swatches + Settings → Personalize chips both reflect the choice
  document.querySelectorAll('.accent-sw, .accent-chip').forEach((b) => {
    b.classList.toggle('sel', b.dataset.accent === a);
  });
}

// ---------- first-run onboarding + robustness ----------
async function showOnboarding() {
  const ov = $('onboard');
  let chosenRoot = cfg.root;
  let chosenTheme = cfg.theme || 'light';
  let chosenTrust = false;

  $('obRoot').textContent = chosenRoot;
  const det = await window.launcher.detectClaude();
  $('obClaude').className = 'ob-status ' + (det.found ? 'ok' : 'warn');
  $('obClaude').textContent = det.found
    ? '✓ Claude Code detected — you\'re ready to launch projects.'
    : '⚠ Claude Code CLI not found. Install it (claude.com/claude-code) to launch projects. You can still set up the dashboard now.';
  const rc = await window.launcher.checkRoot(chosenRoot);
  $('obRootHint').textContent = rc.exists ? '' : 'Doesn\'t exist yet — it\'ll be created.';

  ov.querySelectorAll('#obTheme button').forEach((b) => {
    b.classList.toggle('active', b.dataset.theme === chosenTheme);
    b.addEventListener('click', () => {
      chosenTheme = b.dataset.theme; applyTheme(chosenTheme);
      ov.querySelectorAll('#obTheme button').forEach((x) => x.classList.toggle('active', x === b));
    });
  });
  $('obAutoTrust').addEventListener('change', (e) => { chosenTrust = e.target.checked; });
  $('obChoose').addEventListener('click', async () => {
    const c = await window.launcher.pickRoot();
    if (c) { chosenRoot = c.root; $('obRoot').textContent = chosenRoot; const r = await window.launcher.checkRoot(chosenRoot); $('obRootHint').textContent = r.exists ? '' : 'Will be created.'; }
  });
  const finish = async (applyChoices) => {
    if (applyChoices) {
      const r = await window.launcher.checkRoot(chosenRoot);
      if (!r.exists) await window.launcher.createRoot(chosenRoot);
      cfg = await window.launcher.completeOnboarding({ root: chosenRoot, theme: chosenTheme, autoTrust: chosenTrust });
      applyTheme(cfg.theme);
      $('footRoot').textContent = cfg.root;
    }
    ov.classList.add('hidden');
    await loadProjects();
  };
  $('obStart').addEventListener('click', () => finish(true), { once: true });
  // dismiss without finishing (backdrop / Escape) still marks onboarded so it never re-nags
  ov.addEventListener('click', (e) => { if (e.target === ov) finish(false); });
  document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape' && !ov.classList.contains('hidden')) { document.removeEventListener('keydown', esc); finish(false); } });

  // mark onboarded immediately so it shows at most once, even if the app is closed now
  window.launcher.completeOnboarding({}).then((c) => { cfg = c; });
  ov.classList.remove('hidden');
}

async function detectClaudeBanner() {
  const det = await window.launcher.detectClaude();
  const b = $('claudeBanner');
  if (det.found) { b.classList.add('hidden'); return; }
  b.innerHTML = '⚠ Claude Code CLI not detected on PATH — install it from claude.com/claude-code to launch projects. <span class="banner-x">Dismiss</span>';
  b.classList.remove('hidden');
  b.querySelector('.banner-x').addEventListener('click', () => b.classList.add('hidden'));
}

async function init() {
  hydrateIcons();
  cfg = await window.launcher.getConfig();
  applyTheme(cfg.theme || 'light');
  applyAccent(cfg.accent || 'clay');
  applyRedact(cfg.redact);
  // quick toggle for screenshots / screen-sharing
  document.addEventListener('keydown', async (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'B' || e.key === 'b')) {
      e.preventDefault();
      cfg.redact = await window.launcher.setRedact(!document.body.classList.contains('redact'));
      applyRedact(cfg.redact);
      showStatus(cfg.redact ? 'Descriptions blurred (for screenshots).' : 'Blur off.', 'ok');
    }
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      paletteOpen() ? closePalette() : openPalette();
    }
    // keyboard-first resume list (only on the projects home, not while typing/in palette)
    const onHome = !$('view-projects').classList.contains('hidden') && !paletteOpen();
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target.tagName || ''));
    if (onHome && !typing && !e.ctrlKey && !e.metaKey) {
      if (e.key === 'ArrowDown') { e.preventDefault(); moveResumeSel(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); moveResumeSel(-1); }
      else if (e.key === 'Enter') { e.preventDefault(); openResumeSel(); }
      else if (e.key === '/') { e.preventDefault(); $('search').focus(); }
    }
  });

  // command palette interactions
  $('paletteInput').addEventListener('input', (e) => renderPalette(e.target.value));
  $('paletteInput').addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); movePalette(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); movePalette(-1); }
    else if (e.key === 'Enter') { e.preventDefault(); runPaletteItem(paletteIdx); }
    else if (e.key === 'Escape') { e.preventDefault(); closePalette(); }
  });
  $('paletteOverlay').addEventListener('click', (e) => { if (e.target === $('paletteOverlay')) closePalette(); });

  // indexing indicator (only show if it takes a moment)
  let indexed = false;
  setTimeout(() => { if (!indexed) $('indexBanner').classList.remove('hidden'); }, 700);
  const clearIndex = () => { indexed = true; $('indexBanner').classList.add('hidden'); };
  setTimeout(clearIndex, 12000); // fallback
  window.launcher.appVersion().then((v) => { $('footVer').innerHTML = `Claude Helm v${displayVersion(v)} <span class="beta-tag">beta</span>`; });
  $('footRoot').textContent = cfg.root;
  await loadProjects();

  if (!cfg.onboarded) showOnboarding();
  else { detectClaudeBanner(); loadAwayDigest(); }

  // accent pickers — Settings → Personalize chips (theme/accent moved out of the sidebar)
  document.querySelectorAll('#accentPicker .accent-sw, #setAccentPicker .accent-chip').forEach((sw) =>
    sw.addEventListener('click', async () => {
      cfg.accent = await window.launcher.setAccent(sw.dataset.accent);
      applyAccent(cfg.accent);
    }));

  // Settings → Personalize theme segmented control
  document.querySelectorAll('#setThemeSeg button').forEach((b) =>
    b.addEventListener('click', async () => {
      cfg.theme = await window.launcher.setTheme(b.dataset.theme);
      applyTheme(cfg.theme);
    }));

  // Global shortcut (Settings → General)
  const hkInput = $('optHotkey');
  const hkHint = $('hotkeyHint');
  async function saveHotkey(opts) {
    const r = await window.launcher.setHotkey(opts);
    cfg.hotkey = r.hotkey; cfg.hotkeyEnabled = r.enabled;
    if (hkInput) hkInput.value = prettyHotkey(r.hotkey);
    if (hkHint) hkHint.textContent = !r.enabled
      ? 'Shortcut disabled.'
      : (r.registered ? `Active — press ${prettyHotkey(r.hotkey)} from anywhere to summon Helm.` : (r.error || 'Could not register that shortcut.'));
  }
  if ($('optHotkeyEnabled')) $('optHotkeyEnabled').addEventListener('change', (e) => {
    if (hkInput) hkInput.disabled = !e.target.checked;
    saveHotkey({ enabled: e.target.checked });
  });
  if (hkInput) {
    hkInput.addEventListener('focus', () => { hkInput.classList.add('recording'); hkInput.value = 'Press keys…'; });
    hkInput.addEventListener('blur', () => { hkInput.classList.remove('recording'); hkInput.value = prettyHotkey(cfg.hotkey || 'CommandOrControl+Shift+H'); });
    hkInput.addEventListener('keydown', (e) => {
      e.preventDefault();
      const accel = eventToAccelerator(e);
      if (!accel) { if (hkHint) hkHint.textContent = 'Use at least one modifier (Ctrl/Alt/Shift) plus a key.'; return; }
      hkInput.classList.remove('recording');
      saveHotkey({ hotkey: accel });
      hkInput.blur();
    });
  }
  if ($('hotkeyReset')) $('hotkeyReset').addEventListener('click', () => saveHotkey({ hotkey: 'CommandOrControl+Shift+H', enabled: true }));

  // Clients → Export CSV
  if ($('exportClients')) $('exportClients').addEventListener('click', () => {
    if (!lastClientReport || !lastClientReport.hasClients) { showStatus('Assign a client to a project first.', 'warn'); return; }
    const csv = buildClientsCsv(lastClientReport);
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `client-worklog-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    showStatus('Exported client work-log to your Downloads.', 'ok');
  });

  // Settings subtabs (General / Personalize / AI & Usage / About)
  document.querySelectorAll('#settingsTabs button').forEach((tab) =>
    tab.addEventListener('click', () => {
      const pane = tab.dataset.pane;
      document.querySelectorAll('#settingsTabs button').forEach((t) => t.classList.toggle('active', t === tab));
      document.querySelectorAll('#view-settings .settings-pane').forEach((p) =>
        p.classList.toggle('hidden', p.dataset.pane !== pane));
      if (pane === 'usage') renderAccountCard();
    }));

  document.querySelectorAll('.nav-item').forEach((n) =>
    n.addEventListener('click', () => switchView(n.dataset.view)));
  document.querySelector('#view-detail .back-btn').addEventListener('click', () => switchView('projects'));
  document.querySelector('#view-transcript .t-back').addEventListener('click', () => switchView(transcriptReturn));
  document.querySelector('#view-transcript .t-branch').addEventListener('click', async () => {
    if (!currentTranscriptCtx) return;
    const r = await window.launcher.branchSession(currentTranscriptCtx.cwd, currentTranscriptCtx.sessionId);
    if (r && r.ok) showStatus('Branched — a new forked session is opening in Claude Code. The original is untouched.', 'ok');
    else showStatus((r && r.error) || 'Could not branch this session.', 'warn');
  });
  document.querySelector('#view-transcript .t-resume').addEventListener('click', async () => {
    if (!currentTranscriptCtx) return;
    const r = await window.launcher.resumeSession(currentTranscriptCtx.cwd, currentTranscriptCtx.sessionId);
    if (r && r.ok) showStatus('Resuming this conversation in Claude Code…', 'ok');
    else showStatus((r && r.error) || 'Could not resume this session.', 'warn');
  });
  document.querySelectorAll('#rangeToggle button').forEach((b) =>
    b.addEventListener('click', () => loadAnalytics(Number(b.dataset.days))));
  $('toAnalytics').addEventListener('click', () => switchView('analytics'));
  $('openMemory').addEventListener('click', () => window.launcher.openMemoryFolder());

  // routine editor
  $('rmCancel').addEventListener('click', () => $('routineModal').classList.add('hidden'));
  $('rmSave').addEventListener('click', saveRoutineFromModal);
  $('rmSchedType').addEventListener('change', syncSchedFields);
  $('routineModal').addEventListener('click', (e) => { if (e.target === $('routineModal')) $('routineModal').classList.add('hidden'); });
  window.launcher.onRoutinesUpdated(() => { if (!$('view-routines').classList.contains('hidden')) loadRoutines(); });

  $('search').addEventListener('input', (e) => { filter = e.target.value.trim().toLowerCase(); render(); });
  $('newBtn').addEventListener('click', openModal);
  $('modalCancel').addEventListener('click', closeModal);
  $('modalCreate').addEventListener('click', doCreate);
  $('newName').addEventListener('keydown', (e) => { if (e.key === 'Enter') doCreate(); if (e.key === 'Escape') closeModal(); });
  $('modal').addEventListener('click', (e) => { if (e.target === $('modal')) closeModal(); });

  $('changeRoot').addEventListener('click', async () => {
    const c = await window.launcher.pickRoot();
    if (c) { cfg = c; $('footRoot').textContent = cfg.root; syncSettingsUI(); await loadProjects(); }
  });
  $('optModel').addEventListener('change', (e) => saveLaunch({ model: e.target.value }));
  $('optContinue').addEventListener('change', (e) => saveLaunch({ continue: e.target.checked }));
  $('optSkip').addEventListener('change', (e) => saveLaunch({ skipPermissions: e.target.checked }));
  $('optAutoTrust').addEventListener('change', async (e) => {
    cfg.autoTrust = await window.launcher.setAutoTrust(e.target.checked);
    showStatus(cfg.autoTrust ? 'Auto-trust enabled — folders will be pre-approved.' : 'Auto-trust off — Claude will ask the first time.', 'ok');
  });
  $('optTerminal').addEventListener('change', async (e) => {
    cfg.terminalCommand = await window.launcher.setTerminal(e.target.value);
    showStatus(cfg.terminalCommand ? 'Custom terminal saved.' : 'Using auto-detect.', 'ok');
  });
  if ($('optPreviewTarget')) $('optPreviewTarget').addEventListener('change', async (e) => {
    cfg.previewTarget = await window.launcher.setPreviewTarget(e.target.value);
    showStatus(cfg.previewTarget === 'browser' ? 'Apps will open in your browser.' : 'Apps will open in an in-app window.', 'ok');
  });
  $('optBudgetWeekly').addEventListener('change', async (e) => { const r = await window.launcher.setBudget({ weekly: e.target.value }); cfg.budgetWeekly = r.budgetWeekly; showStatus('Weekly budget saved.', 'ok'); });
  $('optBudgetMonthly').addEventListener('change', async (e) => { const r = await window.launcher.setBudget({ monthly: e.target.value }); cfg.budgetMonthly = r.budgetMonthly; showStatus('Monthly budget saved.', 'ok'); });
  $('optNotifications').addEventListener('change', async (e) => { cfg.notifications = await window.launcher.setNotifications(e.target.checked); });
  $('optRedact').addEventListener('change', async (e) => { cfg.redact = await window.launcher.setRedact(e.target.checked); applyRedact(cfg.redact); });
  $('optOpenAtLogin').addEventListener('change', async (e) => {
    const r = await window.launcher.setLoginItem({ openAtLogin: e.target.checked });
    cfg.openAtLogin = r.openAtLogin; cfg.startHidden = r.startHidden;
    $('optStartHidden').disabled = !cfg.openAtLogin;
    showStatus(cfg.openAtLogin ? 'Claude Helm will launch at login.' : 'Launch at login turned off.', 'ok');
  });
  $('optStartHidden').addEventListener('change', async (e) => {
    const r = await window.launcher.setLoginItem({ startHidden: e.target.checked });
    cfg.startHidden = r.startHidden;
  });

  $('tagFilter').addEventListener('change', (e) => { tagFilter = e.target.value; render(); });
  $('archToggle').addEventListener('click', () => { showArchived = !showArchived; $('archToggle').classList.toggle('active', showArchived); render(); });
  $('exportCsv').addEventListener('click', async () => { const r = await window.launcher.exportCsv(); if (r && r.ok) showStatus('Exported to ' + r.path, 'ok'); });
  $('compareBtn').addEventListener('click', openCompare);
  $('compareClose').addEventListener('click', () => $('compareModal').classList.add('hidden'));
  $('compareModal').addEventListener('click', (e) => { if (e.target === $('compareModal')) $('compareModal').classList.add('hidden'); });
  document.querySelectorAll('.cmp-pick').forEach((sel) => sel.addEventListener('change', renderCompare));

  $('optApiKey').addEventListener('change', async (e) => {
    const val = e.target.value;
    if (val.includes('•')) return; // unchanged masked value
    const r = await window.launcher.setApiKey(val);
    cfg.hasApiKey = r.hasApiKey; cfg.aiSummaries = r.aiSummaries;
    syncSettingsUI();
    showStatus(r.hasApiKey ? 'API key saved (encrypted).' : 'API key cleared.', 'ok');
  });
  if ($('optAdminKey')) $('optAdminKey').addEventListener('change', async (e) => {
    const val = e.target.value;
    if (val.includes('•')) return;
    const r = await window.launcher.setAdminKey(val);
    cfg.hasAdminKey = r.hasAdminKey;
    showStatus(r.hasAdminKey ? 'Admin key saved (encrypted).' : 'Admin key cleared.', 'ok');
    if (!$('view-overview').classList.contains('hidden')) loadOverview();
  });
  $('optAiSummaries').addEventListener('change', async (e) => {
    cfg.aiSummaries = await window.launcher.setAiSummaries(e.target.checked);
    updateApiHint();
    if (cfg.aiSummaries) { showStatus('AI summaries on — refreshing…', 'ok'); render(); }
  });

  // auto-update lifecycle
  const toast = $('updateToast');
  const umsg = $('updateMsg');
  const uinstall = $('updateInstall');
  const ustate = $('updateState');      // Settings → About panel
  const ubanner = $('updateBanner');    // unmissable top-of-window bar
  const ubMsg = $('updateBannerMsg');
  function showUpdateBanner(version) {
    if (ubMsg) ubMsg.textContent = `Claude Helm v${version} is ready — restart to finish updating.`;
    if (ubanner) ubanner.classList.remove('hidden');
    document.body.classList.add('has-update-banner');
  }
  function hideUpdateBanner() {
    if (ubanner) ubanner.classList.add('hidden');
    document.body.classList.remove('has-update-banner');
  }
  uinstall.addEventListener('click', () => window.launcher.installUpdate());
  if ($('updateBannerInstall')) $('updateBannerInstall').addEventListener('click', () => window.launcher.installUpdate());
  if ($('updateBannerLater')) $('updateBannerLater').addEventListener('click', hideUpdateBanner);
  window.launcher.appVersion().then((v) => { $('aboutVer').innerHTML = `Claude Helm v${displayVersion(v)} <span class="beta-tag">beta</span>`; });
  $('repoLink').addEventListener('click', (e) => { e.preventDefault(); window.launcher.openExternal('https://github.com/trifactorscalingllc/claude-helm'); });
  let checkedManually = false;
  $('checkUpdate').addEventListener('click', () => {
    checkedManually = true;
    if (ustate) ustate.textContent = 'Checking for updates…';
    window.launcher.checkUpdate();
  });
  window.launcher.onUpdateStatus(({ state, info }) => {
    if (state === 'checking') { if (checkedManually && ustate) ustate.textContent = 'Checking for updates…'; }
    else if (state === 'available') { umsg.textContent = `Downloading update v${info.version}…`; toast.classList.remove('hidden'); uinstall.classList.add('hidden'); if (ustate) ustate.textContent = `Update v${info.version} found — downloading…`; }
    else if (state === 'downloading') { umsg.textContent = `Downloading update… ${info.percent}%`; toast.classList.remove('hidden'); if (ustate) ustate.textContent = `Downloading update… ${info.percent}%`; }
    else if (state === 'ready') { toast.classList.add('hidden'); showUpdateBanner(info.version); if (ustate) ustate.textContent = `Update v${info.version} ready — restart to apply.`; }
    else if (state === 'current') { hideUpdateBanner(); if (checkedManually && ustate) ustate.textContent = "You're on the latest version."; checkedManually = false; }
    else if (state === 'error') { toast.classList.add('hidden'); if (checkedManually && ustate) ustate.textContent = "Couldn't check right now — try again shortly."; checkedManually = false; }
  });

  // a preview started/stopped/exited → update the running map and repaint Launch buttons
  window.launcher.onPreviewChanged((state) => {
    previewRunning = state || {};
    repaintAllPreviewBtns();
    if (typeof renderPreviewBar === 'function') renderPreviewBar();
    if (typeof updateDetailPreview === 'function') updateDetailPreview();
  });

  // live auto-refresh — surgical, not a full rebuild:
  //  • 'projects' (folder add/remove) → reconcile the list, rebuild only if it changed
  //  • 'claude'   (transcript activity) → update ONLY the active project's live numbers,
  //    in place. Inactive cards never re-render, so nothing flickers or resizes.
  let lastOverviewLive = 0;
  window.launcher.onFsChanged((scope) => {
    clearIndex();
    if (scope === 'projects') reconcileProjects();
    else refreshLiveMetrics();
    sampleActiveUsage(); // immediate sample on activity
    // Overview/Analytics are heavier report views — refresh the visible one at most every 25s
    if (Date.now() - lastOverviewLive > 25000) {
      if (!$('view-overview').classList.contains('hidden')) { lastOverviewLive = Date.now(); loadOverview(); }
      else if (!$('view-analytics').classList.contains('hidden')) { lastOverviewLive = Date.now(); loadAnalytics(overviewDays); }
    }
  });

  // live token-usage bars sample on a fixed 2s cadence so they tick in real time
  sampleActiveUsage();
  setInterval(sampleActiveUsage, 2000);
  // slower tick: keep the project grid's active card numbers current + clear the dot
  setInterval(refreshLiveMetrics, 15000);
}

// ---------- live "Active now" panels (one card per running session) ----------
let activeClockTimer = null;
const activeCards = new Map();    // sessionId -> card element
const sessionBars = new Map();    // sessionId -> [{t, dTok, dCost}]  per-interval USAGE
const sessionLast = new Map();    // sessionId -> {tokens, cost}      for delta math
const sessionModels = new Map();  // sessionId -> Set(model)
const BAR_WINDOW = 70;            // ~70 bars × 2s ≈ last ~2.3 min of activity

function modelShort(m) {
  if (!m) return '';
  if (m.includes('opus')) return 'Opus';
  if (m.includes('sonnet')) return 'Sonnet';
  if (m.includes('haiku')) return 'Haiku';
  return m;
}
function fmtClock(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60;
  return (h ? String(h).padStart(2, '0') + ':' : '') + String(m).padStart(2, '0') + ':' + String(ss).padStart(2, '0');
}
function modelChips(id) {
  return [...(sessionModels.get(id) || [])].map((m) => `<span class="ap-model">${escapeHtml(modelShort(m))}</span>`).join('');
}
// Record one usage bar = tokens consumed since the previous sample. First sighting
// just sets the baseline (no giant first bar). Idle intervals push a zero bar so
// the graph scrolls and you can see the gaps between bursts.
function recordBar(a) {
  const prev = sessionLast.get(a.sessionId);
  sessionLast.set(a.sessionId, { tokens: a.tokens, cost: a.cost });
  let ms = sessionModels.get(a.sessionId);
  if (!ms) { ms = new Set(); sessionModels.set(a.sessionId, ms); }
  (a.models || []).forEach((m) => ms.add(m));
  if (!sessionBars.has(a.sessionId)) sessionBars.set(a.sessionId, []);
  if (!prev) return; // baseline only
  const dTok = Math.max(0, a.tokens - prev.tokens);
  const dCost = Math.max(0, a.cost - prev.cost);
  const arr = sessionBars.get(a.sessionId);
  arr.push({ t: Date.now(), dTok, dCost });
  if (arr.length > BAR_WINDOW) arr.shift();
}
// Live token-usage bar graph: each bar = tokens used in that ~2s interval. Bars
// spike while the session is generating and fall to zero when it's idle.
function usageBarsSvg(bars) {
  if (!bars || !bars.length || bars.every((b) => b.dTok === 0)) {
    return '<div class="ap-graph-empty">Waiting for token activity — bars rise live as this session uses tokens.</div>';
  }
  const W = 600, H = 130, gap = 1.5;
  const bw = W / BAR_WINDOW;
  const max = Math.max(1, ...bars.map((b) => b.dTok));
  const start = BAR_WINDOW - bars.length; // right-align newest bar
  const rects = bars.map((b, i) => {
    const h = (b.dTok / max) * (H - 3);
    const x = (start + i) * bw + gap / 2;
    return `<rect x="${x.toFixed(1)}" y="${(H - h).toFixed(1)}" width="${Math.max(1, bw - gap).toFixed(1)}" height="${Math.max(0, h).toFixed(1)}" rx="1" fill="${i === bars.length - 1 ? 'var(--clay-deep)' : 'var(--clay)'}"/>`;
  }).join('');
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" class="ap-graph-svg">${rects}</svg>`;
}
function peakUsage(bars) {
  if (!bars || !bars.length) return 0;
  return Math.max(0, ...bars.map((b) => b.dTok));
}
function lastUsage(bars) {
  if (!bars || !bars.length) return 0;
  return bars[bars.length - 1].dTok;
}

// Poll the active sessions on a fixed cadence so the usage bars are truly live.
// Monitoring shrinks to ONE ambient line: how many sessions are live + the most
// active one's project & active (working) time. No hero, no bar graph.
async function sampleActiveUsage() {
  const el = $('ambient');
  if (!el) return;
  const list = await window.launcher.activeSessions();
  if (!list || !list.length) { el.classList.add('hidden'); el.innerHTML = ''; return; }
  el.classList.remove('hidden');
  // prefer a session that's waiting on you as the lead; else the most active
  const ordered = list.slice().sort((a, b) => (b.awaiting - a.awaiting) || (b.activeMs - a.activeMs));
  const lead = ordered[0];
  const otherSessions = ordered.slice(1);
  const awaiting = !!lead.awaiting;
  el.classList.toggle('awaiting', awaiting);
  const ctxPct = lead.contextTokens ? Math.min(100, Math.round(lead.contextTokens / 200000 * 100)) : 0;
  const ctxHigh = ctxPct >= 85;
  const statusTxt = awaiting ? '<span class="amb-wait">waiting for you</span>' : `${fmtDuration(lead.activeMs)} active`;
  const ctxHtml = ctxPct
    ? ` · <span class="amb-ctx${ctxHigh ? ' high' : ''}" title="~${fmtTokens(lead.contextTokens)} of ~200K context window in use this session${ctxHigh ? ' — consider /compact' : ''}"><span class="amb-ctx-bar"><span style="width:${ctxPct}%"></span></span>ctx ${ctxPct}%</span>`
    : '';
  // Every other live session is named (and clickable), not collapsed to "+N more".
  const othersHtml = otherSessions.length
    ? ` · ${otherSessions.map((s, i) => `<span class="amb-other" data-i="${i}" title="${escapeHtml(s.path)} — click to open">${escapeHtml(s.name)}${s.awaiting ? ' <span class="amb-wait">·waiting</span>' : ''}</span>`).join(' · ')}`
    : '';
  el.innerHTML = `
    <span class="amb-dot"></span>
    <span class="amb-text"><strong>${list.length} session${list.length === 1 ? '' : 's'} live</strong> · <span class="amb-name">${escapeHtml(lead.name)}</span> · ${statusTxt}${ctxHtml}${othersHtml}</span>
    <button class="btn ghost btn-xs amb-open">${svg('terminal', 13)} Open</button>
    <button class="btn ghost btn-xs amb-view">${svg('message', 13)} View</button>`;
  el.querySelector('.amb-open').addEventListener('click', () => openRow(lead));
  el.querySelector('.amb-view').addEventListener('click', () => openTranscript({ cwd: lead.path, sessionId: lead.sessionId }, 'projects'));
  el.querySelectorAll('.amb-other').forEach((node) => {
    node.addEventListener('click', () => openRow(otherSessions[Number(node.dataset.i)]));
  });
  refreshLiveMetrics(); // keep the live rows' dot + last-active current
}

init();
