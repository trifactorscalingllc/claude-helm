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
};

// Shown on every cost figure so the dollar number is never mistaken for a bill.
const COST_TIP = "Estimate — your recorded token usage × Anthropic's public API prices. On a Pro/Max subscription you aren't billed per token, so treat this as a usage measure, not a bill.";

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
let filter = '';
let overviewDays = 7;
let recapRange = 'today'; // 'today' | 'week'
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
  const items = [
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

// ---------- card ----------
function makeCard(p) {
  const el = document.createElement('div');
  el.className = 'card' + (p.archived ? ' archived' : '');
  const pinned = cfg.pinned.includes(p.path);

  el.innerHTML = `
    <div class="card-top">
      <div class="card-meta">
        <div class="card-name" title="${p.path}">${p.name} <span class="active-dot hidden" data-slot="active-dot" title="Active in Claude now">●</span></div>
        <div class="card-tags">
          ${p.tag ? `<span class="tag tagchip">${svg('tag', 12)} ${escapeHtml(p.tag)}</span>` : ''}
          ${p.isGit && !p.external ? `<span class="tag git" data-slot="git">${svg('branch', 12)} <span class="sl">git…</span></span>` : (p.isGit ? `<span class="tag git">${svg('branch', 12)} git</span>` : '')}
          <span class="tag">${svg('clock', 13)} ${relTime(p.mtime)}</span>
          ${p.external ? `<span class="tag ext" title="${p.path}">${svg('layers', 13)} outside folder</span>` : ''}
        </div>
      </div>
      <button class="pin-btn ${pinned ? 'pinned' : ''}" title="${pinned ? 'Unpin' : 'Pin'}">
        ${pinned ? fillSvg('star', 18) : svg('star', 18)}
      </button>
    </div>
    <div class="card-summary" data-slot="summary"></div>
    <div class="metrics-row" data-slot="metrics">
      <div class="metric"><div class="m-ico">${svg('clock', 15)}</div><div><div class="m-val" data-slot="time">·</div><div class="m-lbl">time</div></div></div>
      <div class="metric" title="${COST_TIP}"><div class="m-ico">${svg('coin', 15)}</div><div><div class="m-val" data-slot="cost">·</div><div class="m-lbl">cost <span class="est">est.</span></div></div></div>
      <div class="spark-wrap" data-slot="spark"></div>
    </div>
    <div class="stats">
      <div class="stat loading" data-slot="files">${svg('file', 14)} <span class="sl">counting…</span></div>
      <div class="stat loading" data-slot="size">${svg('drive', 14)} <span class="sl">sizing…</span></div>
      <div class="stat loading" data-slot="sessions">${svg('message', 14)} <span class="sl">sessions…</span></div>
      <div class="stat loading" data-slot="active">${svg('clock', 14)} <span class="sl">activity…</span></div>
    </div>
    <div class="card-actions">
      <button class="btn primary open">${svg('terminal', 16)} Open in Claude</button>
      <button class="icon-btn details" title="View project stats">${svg('chart', 17)}</button>
      <button class="icon-btn folder" title="Open folder in Explorer">${svg('folder', 17)}</button>
      <button class="icon-btn more" title="More actions">${svg('dots', 17)}</button>
    </div>`;

  el.querySelector('.open').addEventListener('click', async (e) => {
    e.stopPropagation();
    const res = await window.launcher.openProject(p.path);
    await handleLaunchResult(res, p.name);
  });
  el.querySelector('.folder').addEventListener('click', (e) => { e.stopPropagation(); window.launcher.openInExplorer(p.path); });
  el.querySelector('.details').addEventListener('click', (e) => { e.stopPropagation(); openDetail(p); });
  el.querySelector('.more').addEventListener('click', (e) => { e.stopPropagation(); openCardMenu(e.currentTarget, p); });
  el.querySelector('.pin-btn').addEventListener('click', async (e) => {
    e.stopPropagation();
    cfg.pinned = await window.launcher.togglePin(p.path);
    render();
  });
  el.querySelector('.metrics-row').addEventListener('click', () => openDetail(p));

  if (p.external) {
    // don't walk huge external trees (e.g. home dir) — show Claude metrics only
    const fNode = el.querySelector('[data-slot="files"]');
    if (fNode) fNode.outerHTML = `<div class="stat" data-slot="files">${svg('file', 14)} <span class="sl">—</span></div>`;
    const szNode = el.querySelector('[data-slot="size"]');
    if (szNode) szNode.outerHTML = `<div class="stat" data-slot="size">${svg('drive', 14)} <span class="sl">—</span></div>`;
  } else {
    loadStats(el, p);
  }
  loadMetrics(el, p);
  loadSummary(el, p);
  if (p.isGit && !p.external) loadGit(el, p);
  return el;
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

async function loadMetrics(el, p) {
  const m = await window.launcher.projectMetrics(p.path);
  if (!el.isConnected) return;
  const setVal = (slot, val) => { const n = el.querySelector(`[data-slot="${slot}"]`); if (n) n.textContent = val; };
  setVal('time', fmtDuration(m.activeMs));
  setVal('cost', fmtCost(m.cost));
  const spark = el.querySelector('[data-slot="spark"]');
  if (spark) spark.innerHTML = sparkline(m.series, 'activeMs');
  const dot = el.querySelector('[data-slot="active-dot"]');
  if (dot) dot.classList.toggle('hidden', !m.active);
  el.classList.toggle('is-active', !!m.active);
  // sessions + last-active come from metrics too (authoritative)
  const sNode = el.querySelector('[data-slot="sessions"]');
  if (sNode) sNode.outerHTML = `<div class="stat" data-slot="sessions">${svg('message', 14)} <span class="sv">${fmtNum(m.sessions)}</span> <span class="sl">${m.sessions === 1 ? 'session' : 'sessions'}</span></div>`;
  const aNode = el.querySelector('[data-slot="active"]');
  if (aNode) aNode.outerHTML = `<div class="stat" data-slot="active">${svg('clock', 14)} <span class="sv">${relTime(m.lastTs)}</span> <span class="sl">in Claude</span></div>`;
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

function render() {
  const list = projects.filter(matches);
  const pinnedList = list.filter((p) => cfg.pinned.includes(p.path));
  const rest = list.filter((p) => !cfg.pinned.includes(p.path));

  cardEls.clear();
  const addCard = (gridEl, p) => { const el = makeCard(p); cardEls.set(p.path, el); gridEl.appendChild(el); };

  const pinnedWrap = $('pinnedWrap');
  const pinnedGrid = $('pinnedGrid');
  pinnedGrid.innerHTML = '';
  if (pinnedList.length) {
    pinnedList.forEach((p) => addCard(pinnedGrid, p));
    pinnedWrap.classList.remove('hidden');
  } else {
    pinnedWrap.classList.add('hidden');
  }

  const grid = $('grid');
  grid.innerHTML = '';
  rest.forEach((p) => addCard(grid, p));

  $('allCount').textContent = rest.length;
  const empty = $('empty');
  if (rootError) {
    empty.classList.remove('hidden'); // keep the actionable folder message set by loadProjects
  } else if (!list.length) {
    if (filter) {
      empty.textContent = `No projects match "${filter}".`;
    } else {
      const hasOther = externalProjects.length > 0;
      empty.innerHTML = `<div class="welcome">
          <div class="welcome-mark">${svg('sun', 30)}</div>
          <h3>Welcome to Claude Helm</h3>
          <p>This is your projects folder — every subfolder here shows up as a card you can open in Claude Code with one click.<br><code>${escapeHtml(cfg.root)}</code></p>
          <div class="welcome-actions">
            <button class="btn primary" id="emptyNew">${svg('plus', 14)} New project</button>
            <button class="btn ghost" id="emptyPick">Choose a different folder</button>
          </div>
          ${hasOther ? `<p class="welcome-hint">${svg('layers', 13)} Found ${externalProjects.length} project${externalProjects.length === 1 ? '' : 's'} from your existing Claude history below.</p>` : `<p class="welcome-hint">No Claude history yet — open a project and your time, cost, and activity will start showing up here.</p>`}
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

  // external (other Claude) projects
  const extList = externalProjects.filter(matches);
  const extGrid = $('externalGrid');
  extGrid.innerHTML = '';
  if (extList.length) {
    extList.forEach((p) => addCard(extGrid, p));
    $('externalCount').textContent = extList.length;
    $('externalWrap').classList.remove('hidden');
  } else {
    $('externalWrap').classList.add('hidden');
  }
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
  $('optBudgetWeekly').value = cfg.budgetWeekly || '';
  $('optBudgetMonthly').value = cfg.budgetMonthly || '';
  $('optNotifications').checked = cfg.notifications !== false;
  $('optRedact').checked = !!cfg.redact;
  $('optOpenAtLogin').checked = !!cfg.openAtLogin;
  $('optStartHidden').checked = !!cfg.startHidden;
  $('optStartHidden').disabled = !cfg.openAtLogin;
  const osNames = { win32: 'Windows Terminal', darwin: 'macOS Terminal/iTerm', linux: 'Linux terminal' };
  $('osName').textContent = osNames[window.launcher.platform] || window.launcher.platform;
  updateApiHint();
  updateCmdPreview();
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
function switchView(view) {
  document.querySelectorAll('.nav-item').forEach((n) => n.classList.toggle('active', n.dataset.view === view));
  ['projects', 'search', 'settings', 'overview', 'detail', 'context', 'routines', 'transcript'].forEach((v) => {
    const el = $(`view-${v}`);
    if (el) el.classList.toggle('hidden', view !== v);
  });
  if (view === 'settings') syncSettingsUI();
  if (view === 'overview') loadOverview();
  if (view === 'context') loadContext();
  if (view === 'routines') loadRoutines();
  if (view === 'search') loadSearch();
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
  const { results, contexts = [], scanned, truncated } = await window.launcher.searchTranscripts(q, searchFilters);
  if (!results.length && !contexts.length) {
    body.innerHTML = `<p class="empty">No matches for "${escapeHtml(q)}" in your conversations or context.</p>`;
    return;
  }
  const rx = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig');
  const hl = (s) => escapeHtml(s).replace(rx, '<mark>$1</mark>');
  let html = '';

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
      <p class="section-note" style="margin:0">Recurring Claude Code tasks. Each runs <code>claude -p</code> in a project on your schedule and shows the result here.</p>
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
    body.innerHTML = `<div class="panel"><p class="panel-sub">No Claude Code sessions recorded for this project yet. Open it in Claude and your time, cost, and activity will appear here.</p></div>${notesPanel(p)}`;
    wireNotes(body, p);
    return;
  }
  const totalTokens = t.tokens.in + t.tokens.out + t.tokens.cw + t.tokens.cr;
  const models = Object.entries(t.models).sort((a, b) => b[1] - a[1]);
  const tools = Object.entries(t.tools).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const toolMax = tools.length ? tools[0][1] : 1;
  const files = Object.entries(t.files).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const sessions = Object.entries(d.sessions).sort((a, b) => b[1].lastTs - a[1].lastTs);

  body.innerHTML = `
    <div class="kpis">
      <div class="kpi"><div class="kpi-val">${fmtDuration(t.activeMs)}</div><div class="kpi-lbl">Time spent</div></div>
      <div class="kpi" title="${COST_TIP}"><div class="kpi-val">${fmtCost(t.cost)}</div><div class="kpi-lbl">Total cost <span class="est">est.</span></div></div>
      <div class="kpi"><div class="kpi-val">${fmtNum(t.sessions)}</div><div class="kpi-lbl">Sessions</div></div>
      <div class="kpi"><div class="kpi-val">${fmtNum(t.turns)}</div><div class="kpi-lbl">Turns</div></div>
      <div class="kpi"><div class="kpi-val">${fmtTokens(totalTokens)}</div><div class="kpi-lbl">Tokens</div></div>
    </div>

    <div class="detail-grid">
      <div class="panel">${barChart(d.series, 'activeMs', fmtDuration, 'Time per day (30d)')}</div>
      <div class="panel">${barChart(d.series, 'cost', fmtCost, 'Cost per day (30d)')}</div>
    </div>

    <div class="detail-grid">
      <div class="panel">
        <div class="panel-title">Token breakdown</div>
        <table class="mini-table">
          <tr><td>Input</td><td>${fmtTokens(t.tokens.in)}</td></tr>
          <tr><td>Output</td><td>${fmtTokens(t.tokens.out)}</td></tr>
          <tr><td>Cache write</td><td>${fmtTokens(t.tokens.cw)}</td></tr>
          <tr><td>Cache read</td><td>${fmtTokens(t.tokens.cr)}</td></tr>
        </table>
        <div class="panel-title" style="margin-top:18px">Models</div>
        ${models.map(([m, c]) => `<div class="kv"><span>${m.replace('claude-', '')}</span><span class="muted">${c}×</span></div>`).join('') || '<p class="panel-sub">—</p>'}
      </div>
      <div class="panel">
        <div class="panel-title">Tool usage</div>
        ${tools.map(([name, c]) => `<div class="toolbar-row"><span class="tr-name">${name}</span><div class="tr-track"><div class="tr-fill" style="width:${(c / toolMax) * 100}%"></div></div><span class="tr-count">${c}</span></div>`).join('') || '<p class="panel-sub">—</p>'}
      </div>
    </div>

    <div class="detail-grid">
      <div class="panel">
        <div class="panel-title">Most-edited files</div>
        ${files.map(([f, c]) => `<div class="kv"><span title="${f}" class="file-name">${f.split(/[\\/]/).pop()}</span><span class="muted">${c} edits</span></div>`).join('') || '<p class="panel-sub">No file edits recorded.</p>'}
      </div>
      <div class="panel">
        <div class="panel-title">Sessions (${sessions.length})</div>
        <div class="session-list">
        ${sessions.map(([id, s]) => `<div class="session-row" data-session="${escapeHtml(id)}">
            <div class="s-main">
              <div class="s-title">${escapeHtml(s.title || 'Untitled session')} <span class="s-open">read ›</span></div>
              <div class="s-meta">${relTime(s.lastTs)} · ${fmtDuration(s.activeMs)} · ${fmtCost(s.cost)} · ${s.turns} turns</div>
            </div>
            <button class="s-branch" title="Fork this conversation into a new Claude Code session (original untouched)">${svg('branch', 14)} Branch</button>
          </div>`).join('')}
        </div>
      </div>
    </div>
    ${notesPanel(p)}`;

  wireNotes(body, p);

  body.querySelectorAll('.session-row[data-session]').forEach((row) => {
    row.addEventListener('click', () => openTranscript({ cwd: p.path, sessionId: row.dataset.session }, 'detail'));
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
  const eff = `
    <div class="panel">
      <div class="panel-title">Efficiency <span class="panel-hint">all-time</span></div>
      <div class="kv"><span>Cache hit rate</span><span title="Share of input tokens served from prompt cache — higher is cheaper."><strong>${Math.round((ins.cacheHit || 0) * 100)}%</strong></span></div>
      <div class="kv"><span>Cost / turn</span><span title="${COST_TIP}">${fmtCost(ins.costPerTurn)} <span class="est">est.</span></span></div>
      <div class="kv"><span>Tokens / turn</span><span>${fmtNum(Math.round(ins.tokensPerTurn || 0))}</span></div>
      ${ins.anyHourly ? `<div class="kv"><span>Busiest</span><span>${DOW[ins.busiestDow]} · ${hourLabel(ins.busiestHour)}</span></div>` : ''}
    </div>`;
  const trends = `
    <div class="panel">
      <div class="panel-title">Trends <span class="panel-hint">this week vs last</span></div>
      <div class="kv"><span>Spend this week</span><span title="${COST_TIP}">${fmtCost(w.thisCost || 0)} <span class="est">est.</span> ${deltaBadge(w.costPct, w.lastCost)}</span></div>
      <div class="kv"><span>Time this week</span><span>${fmtDuration(w.thisMs || 0)} ${deltaBadge(w.msPct, w.lastMs)}</span></div>
    </div>`;
  const top = (ins.topByCost && ins.topByCost.length) ? `
    <div class="panel">
      <div class="panel-title">Top sessions <span class="panel-hint">most expensive · all-time</span></div>
      ${ins.topByCost.map((s) => `<div class="kv lead-row" data-path="${escapeHtml(s.path)}" data-session="${escapeHtml(s.sessionId)}">
          <span class="lead-name">${escapeHtml(s.title || s.name)} <span class="s-open">read ›</span></span>
          <span class="muted" title="${COST_TIP}">${fmtCost(s.cost)} · ${fmtDuration(s.activeMs)}</span>
        </div>`).join('')}
    </div>` : '';
  return `<div class="detail-grid">${eff}${trends}</div>${top}`;
}

async function loadOverview(days) {
  overviewDays = days || overviewDays || 7;
  document.querySelectorAll('#rangeToggle button').forEach((b) =>
    b.classList.toggle('active', Number(b.dataset.days) === overviewDays));

  const [res, bs, ms, ins, mcp] = await Promise.all([
    window.launcher.overviewMetrics(overviewDays),
    window.launcher.budgetStatus(),
    window.launcher.modelSpend(),
    window.launcher.insights(),
    window.launcher.mcpUsage(),
  ]);
  const r = res.range;
  const body = $('overview-body');
  const t = r.totals;
  const rangeWord = RANGE_LABEL[overviewDays] || `last ${overviewDays} days`;
  const forecast = (bs.weekly.spend / 7) * 30; // projected monthly at this week's rate

  body.innerHTML = `
    <div class="kpis">
      <div class="kpi"><div class="kpi-val">${fmtDuration(t.activeMs)}</div><div class="kpi-lbl">Time · ${rangeWord}</div></div>
      <div class="kpi" title="${COST_TIP}"><div class="kpi-val">${fmtCost(t.cost)}</div><div class="kpi-lbl">Cost · ${rangeWord} <span class="est">est.</span></div></div>
      <div class="kpi"><div class="kpi-val">${fmtNum(t.sessions)}</div><div class="kpi-lbl">Sessions</div></div>
      <div class="kpi"><div class="kpi-val">${fmtNum(t.projects)}</div><div class="kpi-lbl">Projects active</div></div>
    </div>
    <p class="cost-note">${svg('coin', 12)} Cost is an estimate — recorded tokens × Anthropic's public API prices. Not a bill if you're on a Pro/Max subscription.</p>
    ${cfg.hasAdminKey ? `<div class="panel" id="billing-panel">
      <div class="panel-title">Real billed usage <span class="panel-hint">month to date · from Anthropic</span></div>
      <div id="billing-body"><p class="panel-sub">Fetching billed usage…</p></div>
    </div>` : ''}
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
    <div class="detail-grid">
      <div class="panel">
        <div class="panel-title">Budget &amp; forecast</div>
        ${budgetPanel(bs, forecast)}
      </div>
      <div class="panel">
        <div class="panel-title">Spend by model <span class="panel-hint">all-time</span></div>
        ${modelMixBars(ms)}
      </div>
    </div>
    <div class="panel">
      <div class="panel-title">History <span class="panel-hint">active time per project · ${rangeWord}</span></div>
      ${historyChart(r)}
    </div>
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
    ${insightsBlock(ins)}
    ${mcpBlock(mcp)}
    <div class="panel">
      <div class="panel-title">Activity — last 30 days</div>
      ${heatmap(res.heatDays)}
    </div>`;

  body.querySelectorAll('tr[data-path]').forEach((row) => {
    row.addEventListener('click', () => {
      const p = r.breakdown.find((x) => x.path === row.dataset.path);
      if (p) openDetail({ name: p.name, path: p.path, external: true });
    });
  });
  body.querySelectorAll('.lead-row[data-session]').forEach((row) => {
    row.addEventListener('click', () => openTranscript({ cwd: row.dataset.path, sessionId: row.dataset.session }, 'overview'));
  });

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
  window.launcher.appVersion().then((v) => { $('footVer').textContent = 'Claude Helm v' + v; });
  $('footRoot').textContent = cfg.root;
  await loadProjects();

  if (!cfg.onboarded) showOnboarding();
  else detectClaudeBanner();

  $('themeToggle').addEventListener('click', async () => {
    const next = (cfg.theme === 'dark') ? 'light' : 'dark';
    cfg.theme = await window.launcher.setTheme(next);
    applyTheme(cfg.theme);
  });

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
    b.addEventListener('click', () => loadOverview(Number(b.dataset.days))));
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
    if (!$('view-overview').classList.contains('hidden')) loadOverview(overviewDays);
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
  uinstall.addEventListener('click', () => window.launcher.installUpdate());
  window.launcher.appVersion().then((v) => { $('aboutVer').textContent = 'Claude Helm v' + v; });
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
    else if (state === 'ready') { umsg.textContent = `Update v${info.version} ready.`; toast.classList.remove('hidden'); uinstall.classList.remove('hidden'); if (ustate) ustate.textContent = `Update v${info.version} ready — restart to apply.`; }
    else if (state === 'current') { if (checkedManually && ustate) ustate.textContent = "You're on the latest version."; checkedManually = false; }
    else if (state === 'error') { toast.classList.add('hidden'); if (checkedManually && ustate) ustate.textContent = "Couldn't check right now — try again shortly."; checkedManually = false; }
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
    // the Overview is a heavy "report" view — refresh it at most every 25s while open
    if (!$('view-overview').classList.contains('hidden') && Date.now() - lastOverviewLive > 25000) {
      lastOverviewLive = Date.now();
      loadOverview(overviewDays);
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
    return `<rect x="${x.toFixed(1)}" y="${(H - h).toFixed(1)}" width="${Math.max(1, bw - gap).toFixed(1)}" height="${Math.max(0, h).toFixed(1)}" rx="1" fill="${i === bars.length - 1 ? '#c25c3b' : '#d97757'}"/>`;
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
async function sampleActiveUsage() {
  const panel = $('activePanel');
  if (!panel) return;
  const list = await window.launcher.activeSessions();
  if (!list || !list.length) {
    panel.classList.add('hidden'); panel.innerHTML = '';
    activeCards.clear(); sessionBars.clear(); sessionLast.clear(); sessionModels.clear();
    return;
  }
  panel.classList.remove('hidden');
  const ids = new Set(list.map((a) => a.sessionId));
  for (const [id, el] of activeCards) { // drop sessions that went idle
    if (!ids.has(id)) { el.remove(); activeCards.delete(id); sessionBars.delete(id); sessionLast.delete(id); sessionModels.delete(id); }
  }
  list.forEach((a) => {
    recordBar(a);
    if (activeCards.has(a.sessionId)) updateActiveCard(a);
    else { const el = buildActiveCard(a); activeCards.set(a.sessionId, el); panel.appendChild(el); }
  });
  panel.classList.toggle('multi', list.length > 1);
  if (!activeClockTimer) activeClockTimer = setInterval(tickActivePanels, 1000);
}
function buildActiveCard(a) {
  const el = document.createElement('div');
  el.className = 'active-card';
  el.dataset.session = a.sessionId;
  const first = a.firstTs || a.lastTs;
  const bars = sessionBars.get(a.sessionId);
  el.innerHTML = `
    <div class="ap-head"><span class="ap-dot"></span> ACTIVE NOW <span class="ap-models">${modelChips(a.sessionId)}</span></div>
    <div class="ap-name">${escapeHtml(a.name)}</div>
    <div class="ap-stats">
      <span class="ap-clock" data-first="${first}" title="How long this session has been running">${fmtClock(Date.now() - first)}</span>
      <span class="ap-tokens">${fmtNum(a.tokens)} tokens</span>
      <span class="ap-cost" title="${COST_TIP}">${fmtCost(a.cost)} <span class="est">est.</span></span>
    </div>
    <div class="ap-graph"><div class="ap-graph-inner">${usageBarsSvg(bars)}</div></div>
    <div class="ap-legend">
      <span class="ap-leg"><span class="ap-sw bar"></span>token usage / live</span>
      <span class="ap-leg">now <b class="ap-leg-now">${fmtNum(lastUsage(bars))}</b></span>
      <span class="ap-leg">peak <b class="ap-leg-peak">${fmtNum(peakUsage(bars))}</b></span>
      <span class="ap-leg-x">last ~2 min</span>
    </div>
    <div class="ap-actions">
      <button class="btn primary ap-open">${svg('terminal', 15)} Open</button>
      <button class="btn ghost ap-view">${svg('message', 15)} View session</button>
    </div>`;
  el.querySelector('.ap-open').addEventListener('click', async () => { const r = await window.launcher.openProject(a.path); handleLaunchResult(r, a.name); });
  el.querySelector('.ap-view').addEventListener('click', () => openTranscript({ cwd: a.path, sessionId: a.sessionId }, 'projects'));
  return el;
}
function updateActiveCard(a) {
  const el = activeCards.get(a.sessionId); if (!el) return;
  const bars = sessionBars.get(a.sessionId);
  const set = (sel, html) => { const n = el.querySelector(sel); if (n) n.innerHTML = html; };
  set('.ap-tokens', `${fmtNum(a.tokens)} tokens`);
  set('.ap-cost', `${fmtCost(a.cost)} <span class="est">est.</span>`);
  set('.ap-models', modelChips(a.sessionId));
  set('.ap-leg-now', fmtNum(lastUsage(bars)));
  set('.ap-leg-peak', fmtNum(peakUsage(bars)));
  const g = el.querySelector('.ap-graph-inner'); if (g) g.innerHTML = usageBarsSvg(bars);
}
function tickActivePanels() {
  document.querySelectorAll('#activePanel .ap-clock').forEach((clk) => {
    clk.textContent = fmtClock(Date.now() - Number(clk.dataset.first));
  });
}

init();
