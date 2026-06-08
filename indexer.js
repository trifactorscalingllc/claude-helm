// Transcript indexer — the "living monitoring" engine.
// Tails ~/.claude/projects/<encoded>/*.jsonl, parses new lines incrementally
// (byte offset per file), groups sessions to projects by their `cwd` field,
// and persists aggregates (time, tokens, cost, tools, files, models, daily
// activity) so the dashboard can query instantly.

const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const readline = require('readline');

const IDLE_CAP_MS = 5 * 60 * 1000; // gaps longer than 5 min don't count as active time

// Price per token, by model family. Cache write = 1.25x input (5m TTL), cache read = 0.1x input.
const PRICES = {
  opus:   { in: 5 / 1e6,  out: 25 / 1e6, cw: 6.25 / 1e6, cr: 0.5 / 1e6 },
  sonnet: { in: 3 / 1e6,  out: 15 / 1e6, cw: 3.75 / 1e6, cr: 0.3 / 1e6 },
  haiku:  { in: 1 / 1e6,  out: 5 / 1e6,  cw: 1.25 / 1e6, cr: 0.1 / 1e6 },
};

function priceFor(model) {
  if (!model) return PRICES.opus;
  if (model.includes('opus')) return PRICES.opus;
  if (model.includes('sonnet')) return PRICES.sonnet;
  if (model.includes('haiku')) return PRICES.haiku;
  return PRICES.opus;
}

const pad2 = (n) => String(n).padStart(2, '0');
// Local-time hour key 'YYYY-MM-DDTHH' so "last 3 days" lines up with the user's clock.
function hourKey(ts) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}`;
}

const STORE_VERSION = 2; // bump → full re-index (adds hourly buckets)

class Indexer {
  constructor(claudeProjectsDir, storePath) {
    this.dir = claudeProjectsDir;
    this.storePath = storePath;
    this.store = { version: 1, files: {}, projects: {} };
    this.loaded = false;
  }

  load() {
    try {
      this.store = JSON.parse(fs.readFileSync(this.storePath, 'utf8'));
      if (!this.store.files) this.store.files = {};
      if (!this.store.projects) this.store.projects = {};
      if ((this.store.version || 1) < STORE_VERSION) {
        // schema changed (added hourly buckets) — rebuild from scratch
        this.store = { version: STORE_VERSION, files: {}, projects: {} };
      }
    } catch {
      this.store = { version: STORE_VERSION, files: {}, projects: {} };
    }
    this.loaded = true;
  }

  save() {
    try {
      const tmp = this.storePath + '.tmp';
      fs.writeFileSync(tmp, JSON.stringify(this.store));
      fs.renameSync(tmp, this.storePath);
    } catch {}
  }

  project(cwd) {
    if (!this.store.projects[cwd]) {
      this.store.projects[cwd] = { sessions: {}, daily: {}, hourly: {} };
    }
    if (!this.store.projects[cwd].hourly) this.store.projects[cwd].hourly = {};
    return this.store.projects[cwd];
  }

  session(cwd, sessionId) {
    const p = this.project(cwd);
    if (!p.sessions[sessionId]) {
      p.sessions[sessionId] = {
        firstTs: 0, lastTs: 0, activeMs: 0, turns: 0,
        tokens: { in: 0, out: 0, cw: 0, cr: 0 },
        cost: 0, models: {}, tools: {}, files: {}, title: '',
      };
    }
    return p.sessions[sessionId];
  }

  // Process one parsed JSONL object against a session aggregate.
  applyEvent(o, sess, daily, hourly) {
    const ts = o.timestamp ? Date.parse(o.timestamp) : 0;
    if (ts) {
      if (sess.lastTs) {
        const gap = ts - sess.lastTs;
        if (gap > 0 && gap <= IDLE_CAP_MS) {
          sess.activeMs += gap;
          const day = o.timestamp.slice(0, 10);
          daily[day] = daily[day] || { activeMs: 0, cost: 0, turns: 0, tokensIn: 0, tokensOut: 0 };
          daily[day].activeMs += gap;
          const hk = hourKey(ts);
          hourly[hk] = hourly[hk] || { activeMs: 0, cost: 0 };
          hourly[hk].activeMs += gap;
        }
      }
      if (!sess.firstTs) sess.firstTs = ts;
      sess.lastTs = ts;
    }

    const msg = o.message;
    if (msg && msg.model) sess.models[msg.model] = (sess.models[msg.model] || 0) + 1;

    if (o.type === 'assistant' && msg && msg.usage) {
      const u = msg.usage;
      const inc = u.input_tokens || 0;
      const out = u.output_tokens || 0;
      const cw = u.cache_creation_input_tokens || 0;
      const cr = u.cache_read_input_tokens || 0;
      sess.tokens.in += inc; sess.tokens.out += out; sess.tokens.cw += cw; sess.tokens.cr += cr;
      const pr = priceFor(msg.model);
      const cost = inc * pr.in + out * pr.out + cw * pr.cw + cr * pr.cr;
      sess.cost += cost;
      sess.turns += 1;
      if (ts && o.timestamp) {
        const day = o.timestamp.slice(0, 10);
        daily[day] = daily[day] || { activeMs: 0, cost: 0, turns: 0, tokensIn: 0, tokensOut: 0 };
        daily[day].cost += cost;
        daily[day].turns += 1;
        daily[day].tokensIn += inc + cw + cr;
        daily[day].tokensOut += out;
        const hk = hourKey(ts);
        hourly[hk] = hourly[hk] || { activeMs: 0, cost: 0 };
        hourly[hk].cost += cost;
      }
    }

    // tool usage + files touched
    const content = msg && msg.content;
    if (Array.isArray(content)) {
      for (const b of content) {
        if (b && b.type === 'tool_use') {
          sess.tools[b.name] = (sess.tools[b.name] || 0) + 1;
          if (/^(Edit|Write|MultiEdit|NotebookEdit)$/.test(b.name) && b.input && b.input.file_path) {
            const f = b.input.file_path;
            sess.files[f] = (sess.files[f] || 0) + 1;
          }
        }
      }
    }

    if (o.aiTitle) sess.title = o.aiTitle;
    else if (o.type === 'ai-title' && (o.title || o.content)) sess.title = o.title || o.content;
  }

  // Parse new bytes of one jsonl file from the stored offset to EOF.
  async indexFile(fullPath) {
    let stat;
    try { stat = await fsp.stat(fullPath); } catch { return; }
    const rec = this.store.files[fullPath] || { offset: 0, cwd: null, sessionId: null };
    if (stat.size <= rec.offset && rec.offset !== 0) return; // nothing new
    if (stat.size < rec.offset) rec.offset = 0; // file shrank/rewritten — reparse

    const stream = fs.createReadStream(fullPath, { start: rec.offset, encoding: 'utf8' });
    const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

    // We need cwd to know the project. Buffer until we discover it (first lines carry it).
    let cwd = rec.cwd;
    let sessionId = rec.sessionId;
    const pending = [];
    let bytes = rec.offset;

    for await (const line of rl) {
      bytes += Buffer.byteLength(line, 'utf8') + 1; // +1 for newline
      if (!line.trim()) continue;
      let o;
      try { o = JSON.parse(line); } catch { continue; }
      if (!cwd && o.cwd) cwd = o.cwd;
      if (!sessionId && o.sessionId) sessionId = o.sessionId;
      if (!cwd) { pending.push(o); continue; }
      if (pending.length) {
        const sess = this.session(cwd, sessionId || 'unknown');
        const proj = this.project(cwd);
        for (const po of pending) this.applyEvent(po, sess, proj.daily, proj.hourly);
        pending.length = 0;
      }
      const sess = this.session(cwd, sessionId || 'unknown');
      const proj = this.project(cwd);
      this.applyEvent(o, sess, proj.daily, proj.hourly);
    }

    rec.offset = stat.size;
    rec.cwd = cwd;
    rec.sessionId = sessionId;
    this.store.files[fullPath] = rec;
  }

  // Walk all transcript dirs and index every jsonl (incremental).
  async indexAll() {
    if (!this.loaded) this.load();
    let dirs;
    try { dirs = await fsp.readdir(this.dir, { withFileTypes: true }); } catch { return; }
    for (const d of dirs) {
      if (!d.isDirectory()) continue;
      const sub = path.join(this.dir, d.name);
      let files;
      try { files = await fsp.readdir(sub); } catch { continue; }
      for (const f of files) {
        if (f.endsWith('.jsonl')) await this.indexFile(path.join(sub, f));
      }
    }
    this.pruneHourly(10); // keep hourly buckets bounded (~10 days)
    this.save();
  }

  // Drop hourly buckets older than `days` to keep the store small.
  pruneHourly(days) {
    const cutoff = hourKey(Date.now() - days * 86400000);
    for (const cwd in this.store.projects) {
      const h = this.store.projects[cwd].hourly;
      if (!h) continue;
      for (const k in h) if (k < cutoff) delete h[k];
    }
  }

  // ---- queries ----

  projectPaths() {
    return Object.keys(this.store.projects);
  }

  // Resolve the .jsonl file for a given project cwd + sessionId (from the files map).
  sessionFile(cwd, sessionId) {
    for (const p in this.store.files) {
      const r = this.store.files[p];
      if (r && r.cwd === cwd && r.sessionId === sessionId) return p;
    }
    return null;
  }

  // Per-project totals, sorted by time — for the Overview breakdown.
  projectsList() {
    const out = [];
    for (const cwd of Object.keys(this.store.projects)) {
      const m = this.metricsFor(cwd);
      if (!m || m.totals.sessions === 0) continue;
      out.push({
        name: cwd.split(/[\\/]/).pop() || cwd,
        path: cwd,
        activeMs: m.totals.activeMs,
        cost: m.totals.cost,
        sessions: m.totals.sessions,
        turns: m.totals.turns,
        lastTs: m.totals.lastTs,
      });
    }
    return out.sort((a, b) => b.activeMs - a.activeMs);
  }

  // Hourly activity per project for the last `hours` (default 72 = 3 days),
  // for the multi-line history graph. Only projects active in the window.
  recentActivity(hours = 72) {
    const now = Date.now();
    const keys = [];
    const labels = [];
    for (let i = hours - 1; i >= 0; i--) {
      const t = now - i * 3600000;
      keys.push(hourKey(t));
      labels.push(t);
    }
    const projects = [];
    for (const cwd of Object.keys(this.store.projects)) {
      const h = this.store.projects[cwd].hourly || {};
      const active = keys.map((k) => (h[k] ? h[k].activeMs : 0));
      const cost = keys.map((k) => (h[k] ? h[k].cost : 0));
      const totalMs = active.reduce((s, v) => s + v, 0);
      if (totalMs === 0) continue;
      projects.push({
        name: cwd.split(/[\\/]/).pop() || cwd,
        path: cwd,
        active,
        cost,
        totalMs,
        totalCost: cost.reduce((s, v) => s + v, 0),
      });
    }
    projects.sort((a, b) => b.totalMs - a.totalMs);
    return { labels, projects };
  }

  // Per-project sessions active since `sinceMs` (for the daily recap). Returns
  // [{ name, path, activeMs, cost, sessions:[{title, activeMs, cost, turns, lastTs}] }]
  recapData(sinceMs) {
    const out = [];
    for (const cwd of Object.keys(this.store.projects)) {
      const p = this.store.projects[cwd];
      const sessions = [];
      let activeMs = 0, cost = 0;
      for (const id in p.sessions) {
        const s = p.sessions[id];
        if (!s.lastTs || s.lastTs < sinceMs) continue;
        sessions.push({ title: s.title || '', activeMs: s.activeMs, cost: s.cost, turns: s.turns, lastTs: s.lastTs });
        activeMs += s.activeMs; cost += s.cost;
      }
      if (!sessions.length) continue;
      sessions.sort((a, b) => b.lastTs - a.lastTs);
      out.push({ name: cwd.split(/[\\/]/).pop() || cwd, path: cwd, activeMs, cost, sessions });
    }
    out.sort((a, b) => b.activeMs - a.activeMs);
    return out;
  }

  metricsFor(projectPath) {
    const p = this.store.projects[projectPath];
    if (!p) return null;
    const totals = {
      sessions: 0, turns: 0, activeMs: 0, cost: 0,
      tokens: { in: 0, out: 0, cw: 0, cr: 0 },
      lastTs: 0, lastTitle: '', models: {}, tools: {}, files: {},
    };
    for (const id in p.sessions) {
      const s = p.sessions[id];
      totals.sessions += 1;
      totals.turns += s.turns;
      totals.activeMs += s.activeMs;
      totals.cost += s.cost;
      totals.tokens.in += s.tokens.in; totals.tokens.out += s.tokens.out;
      totals.tokens.cw += s.tokens.cw; totals.tokens.cr += s.tokens.cr;
      if (s.lastTs > totals.lastTs) { totals.lastTs = s.lastTs; if (s.title) totals.lastTitle = s.title; }
      for (const m in s.models) totals.models[m] = (totals.models[m] || 0) + s.models[m];
      for (const t in s.tools) totals.tools[t] = (totals.tools[t] || 0) + s.tools[t];
      for (const f in s.files) totals.files[f] = (totals.files[f] || 0) + s.files[f];
    }
    return { totals, daily: p.daily, sessions: p.sessions };
  }

  // Last `days` of activity as an ordered array for sparklines/heatmaps.
  dailySeries(projectPath, days = 14) {
    const p = this.store.projects[projectPath];
    const out = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const rec = (p && p.daily && p.daily[key]) || { activeMs: 0, cost: 0, turns: 0 };
      out.push({ day: key, activeMs: rec.activeMs, cost: rec.cost, turns: rec.turns });
    }
    return out;
  }

  // Range-aware overview for the last `days` (1 = hourly buckets, else daily).
  overviewFor(days) {
    const now = Date.now();
    const cutoff = now - days * 86400000;
    const hourly = days <= 1;
    const keys = [];
    const labels = [];
    if (hourly) {
      for (let i = 24 * days - 1; i >= 0; i--) { const t = now - i * 3600000; keys.push(hourKey(t)); labels.push(t); }
    } else {
      for (let i = days - 1; i >= 0; i--) { const d = new Date(now - i * 86400000); keys.push(d.toISOString().slice(0, 10)); labels.push(d.getTime()); }
    }
    let cost = 0, activeMs = 0, sessions = 0;
    const breakdown = [];
    for (const cwd of Object.keys(this.store.projects)) {
      const pr = this.store.projects[cwd];
      const bucket = hourly ? (pr.hourly || {}) : (pr.daily || {});
      const series = keys.map((k) => (bucket[k] ? bucket[k].activeMs : 0));
      const costSeries = keys.map((k) => (bucket[k] ? (bucket[k].cost || 0) : 0));
      const tokenSeries = keys.map((k) => { const b = bucket[k]; return b ? ((b.tokensIn || 0) + (b.tokensOut || 0)) : 0; });
      const totalMs = series.reduce((s, v) => s + v, 0);
      const totalCost = costSeries.reduce((s, v) => s + v, 0);
      let sess = 0, lastTs = 0;
      for (const id in pr.sessions) {
        const s = pr.sessions[id];
        if (s.lastTs >= cutoff) sess++;
        if (s.lastTs > lastTs) lastTs = s.lastTs;
      }
      if (totalMs === 0 && sess === 0) continue;
      cost += totalCost; activeMs += totalMs; sessions += sess;
      breakdown.push({
        name: cwd.split(/[\\/]/).pop() || cwd, path: cwd,
        activeMs: totalMs, cost: totalCost, sessions: sess, lastTs,
        active: series, costS: costSeries, tokenS: tokenSeries, totalMs, totalCost,
      });
    }
    breakdown.sort((a, b) => b.activeMs - a.activeMs);
    return {
      days, hourly, labels,
      totals: { cost, activeMs, sessions, projects: breakdown.length },
      breakdown,
      top: breakdown[0] || null,
    };
  }

  // Combined daily activity across all projects (for the heatmap).
  combinedDaily(days) {
    const out = [];
    const today = new Date();
    const map = {};
    for (const cwd of Object.keys(this.store.projects)) {
      const d = this.store.projects[cwd].daily || {};
      for (const k in d) {
        map[k] = map[k] || { activeMs: 0, cost: 0 };
        map[k].activeMs += d[k].activeMs || 0;
        map[k].cost += d[k].cost || 0;
      }
    }
    for (let i = days - 1; i >= 0; i--) {
      const dt = new Date(today);
      dt.setDate(today.getDate() - i);
      const key = dt.toISOString().slice(0, 10);
      const rec = map[key] || { activeMs: 0, cost: 0 };
      out.push({ day: key, activeMs: rec.activeMs, cost: rec.cost });
    }
    return out;
  }

  // Total cost + active time over the last `days` calendar days (for budgets/today).
  spendInDays(days) {
    const arr = this.combinedDaily(days);
    return arr.reduce((acc, d) => { acc.cost += d.cost; acc.activeMs += d.activeMs; return acc; }, { cost: 0, activeMs: 0 });
  }

  // $ attributed by primary model of each session.
  modelSpend() {
    const out = {};
    for (const cwd in this.store.projects) {
      const sessions = this.store.projects[cwd].sessions;
      for (const id in sessions) {
        const s = sessions[id];
        let model = 'unknown', max = -1;
        for (const m in (s.models || {})) { if (s.models[m] > max) { max = s.models[m]; model = m; } }
        out[model] = (out[model] || 0) + (s.cost || 0);
      }
    }
    return out;
  }

  // Projects with a session touched within `withinMs` (default 2 min) — "active now".
  activeProjects(withinMs = 120000) {
    const now = Date.now();
    const out = [];
    for (const cwd in this.store.projects) {
      const m = this.metricsFor(cwd);
      if (m && m.totals.lastTs && now - m.totals.lastTs < withinMs) {
        out.push({ path: cwd, name: cwd.split(/[\\/]/).pop() || cwd, lastTs: m.totals.lastTs });
      }
    }
    return out;
  }

  // The active session for the live "Active now" panel, or null if nothing has been
  // touched within `withinMs`. STICKY: if `preferId` is still active, keep returning
  // it (so the panel doesn't flip between two concurrently-active sessions); only
  // fall back to the most-recent when the preferred one goes idle.
  activeSession(withinMs = 150000, preferId = null) {
    const now = Date.now();
    let best = null, preferred = null;
    for (const cwd in this.store.projects) {
      const p = this.store.projects[cwd];
      for (const id in p.sessions) {
        const s = p.sessions[id];
        if (!s.lastTs || now - s.lastTs >= withinMs) continue;
        const tok = s.tokens || { in: 0, out: 0, cw: 0, cr: 0 };
        const info = {
          path: cwd, name: cwd.split(/[\\/]/).pop() || cwd, sessionId: id,
          firstTs: s.firstTs, lastTs: s.lastTs, activeMs: s.activeMs, turns: s.turns,
          cost: s.cost,
          tokens: tok.in + tok.out + tok.cw + tok.cr,
          tokensIn: tok.in, tokensOut: tok.out, tokensCache: tok.cw + tok.cr,
          model: Object.keys(s.models || {}).sort((a, b) => s.models[b] - s.models[a])[0] || '',
          models: Object.keys(s.models || {}),
        };
        if (preferId && id === preferId) preferred = info;
        if (!best || s.lastTs > best.lastTs) best = info;
      }
    }
    return preferred || best;
  }

  // ALL sessions active within `withinMs` (most recent first) — one per live
  // Claude session, so the UI can show a card for each.
  activeSessions(withinMs = 150000) {
    const now = Date.now();
    const out = [];
    for (const cwd in this.store.projects) {
      const p = this.store.projects[cwd];
      for (const id in p.sessions) {
        const s = p.sessions[id];
        if (!s.lastTs || now - s.lastTs >= withinMs) continue;
        const tok = s.tokens || { in: 0, out: 0, cw: 0, cr: 0 };
        out.push({
          path: cwd, name: cwd.split(/[\\/]/).pop() || cwd, sessionId: id,
          firstTs: s.firstTs, lastTs: s.lastTs, activeMs: s.activeMs, turns: s.turns,
          cost: s.cost,
          tokens: tok.in + tok.out + tok.cw + tok.cr,
          tokensIn: tok.in, tokensOut: tok.out, tokensCache: tok.cw + tok.cr,
          model: Object.keys(s.models || {}).sort((a, b) => s.models[b] - s.models[a])[0] || '',
          models: Object.keys(s.models || {}),
        });
      }
    }
    out.sort((a, b) => b.lastTs - a.lastTs);
    return out;
  }

  // Which MCP servers/tools you lean on, aggregated from tool_use names of the
  // form `mcp__<server>__<tool>`. Returns servers sorted by total calls.
  mcpUsage() {
    const servers = {};
    for (const cwd in this.store.projects) {
      const m = this.metricsFor(cwd);
      if (!m) continue;
      for (const name in m.totals.tools) {
        if (!name.startsWith('mcp__')) continue;
        const parts = name.split('__');
        const server = parts[1] || 'unknown';
        const tool = parts.slice(2).join('__') || name;
        const c = m.totals.tools[name];
        if (!servers[server]) servers[server] = { server, count: 0, tools: {} };
        servers[server].count += c;
        servers[server].tools[tool] = (servers[server].tools[tool] || 0) + c;
      }
    }
    return Object.values(servers)
      .sort((a, b) => b.count - a.count)
      .map((s) => ({ server: s.server, count: s.count, tools: Object.entries(s.tools).sort((a, b) => b[1] - a[1]).slice(0, 6) }));
  }

  // Deeper analytics for the Overview: efficiency, week-over-week trend,
  // busiest hour/day, and the most expensive / longest sessions.
  insights() {
    let tin = 0, tout = 0, tcw = 0, tcr = 0, tcost = 0, tturns = 0;
    const sessions = [];
    const hourBuckets = new Array(24).fill(0);
    const dowBuckets = new Array(7).fill(0);
    for (const cwd in this.store.projects) {
      const p = this.store.projects[cwd];
      const nm = cwd.split(/[\\/]/).pop() || cwd;
      for (const id in p.sessions) {
        const s = p.sessions[id];
        const tk = s.tokens || { in: 0, out: 0, cw: 0, cr: 0 };
        tin += tk.in; tout += tk.out; tcw += tk.cw; tcr += tk.cr; tcost += s.cost; tturns += s.turns;
        sessions.push({ name: nm, path: cwd, sessionId: id, title: s.title || '', cost: s.cost, activeMs: s.activeMs, turns: s.turns, lastTs: s.lastTs });
      }
      const h = p.hourly || {};
      for (const k in h) {
        const hr = Number(k.slice(-2));
        const dt = new Date(k.slice(0, 10));
        if (!isNaN(hr)) hourBuckets[hr] += h[k].activeMs || 0;
        if (!isNaN(dt.getTime())) dowBuckets[dt.getDay()] += h[k].activeMs || 0;
      }
    }
    const inputSide = tin + tcr;
    const cacheHit = inputSide > 0 ? tcr / inputSide : 0;
    const totalTokens = tin + tout + tcw + tcr;
    let bh = 0; for (let i = 1; i < 24; i++) if (hourBuckets[i] > hourBuckets[bh]) bh = i;
    let bd = 0; for (let i = 1; i < 7; i++) if (dowBuckets[i] > dowBuckets[bd]) bd = i;
    return {
      cacheHit,
      costPerTurn: tturns > 0 ? tcost / tturns : 0,
      tokensPerTurn: tturns > 0 ? totalTokens / tturns : 0,
      totalTokens, totalCost: tcost, totalTurns: tturns,
      busiestHour: bh, busiestHourMs: hourBuckets[bh],
      busiestDow: bd, busiestDowMs: dowBuckets[bd],
      anyHourly: hourBuckets.some((v) => v > 0),
      wow: this._wow(),
      topByCost: [...sessions].sort((a, b) => b.cost - a.cost).slice(0, 5),
      topByTime: [...sessions].sort((a, b) => b.activeMs - a.activeMs).slice(0, 5),
    };
  }

  _wow() {
    const day = 86400000, now = Date.now();
    const thisStart = now - 7 * day, lastStart = now - 14 * day;
    let tc = 0, ta = 0, lc = 0, la = 0;
    for (const cwd in this.store.projects) {
      const p = this.store.projects[cwd];
      for (const id in p.sessions) {
        const s = p.sessions[id];
        if (!s.lastTs) continue;
        if (s.lastTs >= thisStart) { tc += s.cost; ta += s.activeMs; }
        else if (s.lastTs >= lastStart) { lc += s.cost; la += s.activeMs; }
      }
    }
    const pct = (cur, prev) => (prev > 0 ? Math.round(((cur - prev) / prev) * 100) : (cur > 0 ? 100 : 0));
    return { thisCost: tc, lastCost: lc, costPct: pct(tc, lc), thisMs: ta, lastMs: la, msPct: pct(ta, la) };
  }

  // For the session-finished notifier: latest activity timestamp per project.
  lastActivityMap() {
    const out = {};
    for (const cwd in this.store.projects) {
      const m = this.metricsFor(cwd);
      if (m) out[cwd] = { lastTs: m.totals.lastTs, name: cwd.split(/[\\/]/).pop() || cwd, cost: m.totals.cost, activeMs: m.totals.activeMs };
    }
    return out;
  }

  overview() {
    let cost = 0, activeMs = 0, sessions = 0, turns = 0;
    const dailyMap = {};
    let top = null;
    for (const proj in this.store.projects) {
      const m = this.metricsFor(proj);
      if (!m) continue;
      cost += m.totals.cost; activeMs += m.totals.activeMs;
      sessions += m.totals.sessions; turns += m.totals.turns;
      if (!top || m.totals.activeMs > top.activeMs) {
        top = { path: proj, activeMs: m.totals.activeMs, cost: m.totals.cost };
      }
      for (const day in m.daily) {
        dailyMap[day] = dailyMap[day] || { activeMs: 0, cost: 0, turns: 0 };
        dailyMap[day].activeMs += m.daily[day].activeMs;
        dailyMap[day].cost += m.daily[day].cost;
        dailyMap[day].turns += m.daily[day].turns || 0;
      }
    }
    return { cost, activeMs, sessions, turns, top, dailyMap };
  }
}

module.exports = { Indexer };
