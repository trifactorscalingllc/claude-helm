# Claude Helm

A desktop dashboard to monitor and open every Claude Code project on your machine.
Lists your projects with live stats (time, cost, sessions) and opens **Claude Code in a
terminal** with one click — no `cd`, no trust prompt. Cross-platform (Windows/macOS/Linux),
with transcript search + viewer, a context view of what Claude remembers, and auto-update.

## Use it

Double-click **"Claude Launcher"** on your Desktop.

- **Open in Claude** on any card → opens a new Windows Terminal in that folder running
  `claude`, with the folder **pre-trusted** (no "do you trust this folder?" prompt) and
  your chosen launch flags applied.
- **Folder icon** → opens the folder in Explorer.
- **Star** → pin a project; pinned projects get their own section at the top.
- **Search** → live filter by name.
- **New project** → creates a folder under your projects root and opens Claude in it.

### Per-project stats (on every card)
- **Time spent** and **cost** — real numbers derived from Claude Code transcripts.
- **14-day activity sparkline** + a pulsing **● Active** badge when a session is live.
- **Files / size** (disk), **sessions**, and **last active in Claude**.
- A one-line **summary** (from README/CLAUDE.md, latest session title, or last git commit).

### Project detail view (click a card's chart icon)
Drill-in with: time-per-day and cost-per-day charts (30d), token breakdown, model split,
tool-usage bars, most-edited files, and a session list (each with duration/cost/turns/title).

### Overview page
Cross-project rollups: all-time + this-week time and cost, total sessions, a 30-day
activity heatmap, and your most-active project.

The dashboard **auto-refreshes** when projects are added/removed/changed *and* when Claude
session data updates (e.g. a live session writes a new message). No manual refresh.

### The monitoring engine
`indexer.js` tails every transcript in `~/.claude/projects/<encoded>/*.jsonl`, parses new
lines incrementally (byte-offset tracked per file), and groups sessions to projects by each
event's `cwd`. It computes time (sum of inter-message gaps, capped at 5-min idle), cost
(token usage × a Claude price table — Opus $5/$25, Sonnet $3/$15, Haiku $1/$5 per 1M
in/out, cache-write 1.25× / cache-read 0.1×), tool/file/model tallies, and per-day rollups,
persisted to `metrics-index.json` in the app's userData. Backfills once on startup, then
incremental on every change. Some projects start at 0 because Claude sessions are logged
under the `cwd` they ran in (often your home dir); opening a project via this app (which
starts Claude *in* the project dir) attributes future sessions to that project.

### Settings
- **Projects folder** — pick which folder to scan (remembered between runs).
- **Launch options** — model (Default / Opus / Sonnet / Haiku), Continue last session
  (`--continue`), Skip permission prompts (`--dangerously-skip-permissions`). A live
  command preview shows exactly what runs.
- **AI project summaries** — paste an Anthropic API key and toggle on to have
  `claude-opus-4-8` write each project's one-line "what it is + where it stands" from its
  README/CLAUDE.md, git log, and recent Claude session titles. Summaries are cached to
  `ai-summaries.json` (keyed by a content hash) and only regenerate when the project
  changes, so you're billed once per change, not per page load. Generation is concurrency-
  limited (2 at a time). Off by default — cards then use the instant offline summary.

## How it works

- `main.js` — Electron main process. Lists/creates projects, computes disk + Claude-session
  stats (from `~/.claude/projects/<encoded-path>/*.jsonl`), watches the projects folder and
  Claude's session dir for changes, pre-trusts folders in `~/.claude.json`, and spawns
  `wt.exe -d <dir> powershell -NoExit -Command "claude [flags]"`.
- `preload.js` — safe `contextIsolation` bridge exposing those handlers + the change event.
- `index.html` / `renderer.js` / `styles.css` — sidebar dashboard UI in Claude's palette
  (cloud cream + clay coral), Inter type, recreated Claude sunburst mark, inline SVG icons.

All paths are derived from the current user's home at runtime (`app.getPath('home')`), so it
works for whoever installs it — no hardcoded paths.

## Build from source

```
npm install
npm start          # run in dev
npm run dist       # build the Windows installer into dist/
```

Default projects root: `<your-home>/projects` (changeable in Settings).
