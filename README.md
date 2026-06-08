<div align="center">

<img src="build/icon.png" width="116" alt="Claude Helm" />

# Claude Helm

**The dashboard for Claude Code.**
Monitor, search, and launch every project — time, cost, transcripts, and context, all in one place.

[![Latest release](https://img.shields.io/github/v/release/trifactorscalingllc/claude-helm?color=d97757&label=download)](https://github.com/trifactorscalingllc/claude-helm/releases/latest)
![Platform](https://img.shields.io/badge/platform-Windows%20%C2%B7%20macOS%20%C2%B7%20Linux-444)
![Local only](https://img.shields.io/badge/data-100%25%20local-4f7d5b)
![License](https://img.shields.io/badge/license-MIT-444)

<br/>

<img src="docs/screenshot.png" width="860" alt="Claude Helm dashboard" />

</div>

---

Claude Helm reads your local Claude Code history (`~/.claude`) and turns it into a real
dashboard: **how much time and money each project costs, what you worked on, and a one-click
way to jump back in.** It runs entirely on your machine, and it auto-updates itself.

## Download

**[⬇ Get the latest release](https://github.com/trifactorscalingllc/claude-helm/releases/latest)** — Windows, macOS, and Linux:

| Platform | File | First-run note |
|---|---|---|
| **Windows** | `Claude-Helm-Setup-*.exe` | SmartScreen → **More info → Run anyway**. Then it **updates itself silently.** |
| **macOS (Apple Silicon)** | `Claude-Helm-*-arm64.dmg` | Right-click the app → **Open** (unsigned, so Gatekeeper warns once). |
| **macOS (Intel)** | `Claude-Helm-*-x64.dmg` | Same as above. |
| **Linux** | `Claude-Helm-*.AppImage` | `chmod +x` then run. |

_The apps aren't code-signed yet, so each OS shows a one-time "unidentified developer" prompt. Windows auto-updates in place; macOS/Linux re-download to update until signed._

---

## Features

### 🚀 Launch
- **One-click "Open in Claude"** — opens a terminal already in the project, running `claude`. No `cd`, no trust prompt.
- **Create projects** from the app (folder + open in Claude in one step).
- **Per-launch overrides** — open *this* project with Opus / Sonnet / Haiku without changing your default.
- **Open in editor** (VS Code, or your file explorer) right from the card.
- **Cross-platform launch** — Windows Terminal, macOS Terminal/iTerm, or your Linux terminal.

### 📊 Monitor & 📈 Analyze
- **Live engine** tails every transcript and computes, per project: **time spent**, **cost** (token×price estimate), sessions, tokens, tools used, files touched, and models.
- **Card metrics** — time, cost, a 14-day activity sparkline, and a live **"● active now"** dot.
- **Git status on cards** — current branch, dirty/clean, and ahead/behind your upstream, with the last commit on hover.
- **Today's recap** — an end-of-day, AI-written standup of what you worked on across every project (with a factual fallback when no API key is set).
- **Launch at login** — optionally start with your computer and sit in the tray, always monitoring.
- **Live "Active now" panel** — the session running this second, with a ticking timer and running token/cost counter.
- **⌘K command palette** — jump to any project, run a search, or switch tabs from the keyboard.
- **Deeper analytics** — cache-hit rate, $/turn, tokens/turn, week-over-week trends, busiest hour/day, and a most-expensive-sessions leaderboard.
- **Encrypted keys + real billing** — API keys are stored in your OS keychain (never plaintext); add an org Admin key to pull your *actual* billed month-to-date cost.
- **Recap (today / this week)**, **MCP usage** (which servers & tools you lean on), **project notes**, and **side-by-side project compare**.
- **System tray** — today's time + cost at a glance, plus an active-session indicator. Closing the window keeps it monitoring in the tray.
- **Desktop notifications** + **cost alerts** — get warned when a session finishes and when you hit 80%/100% of a weekly/monthly **budget**.
- **Overview** — range selector (1D/7D/1M/3M), per-project history chart, **spend forecast**, **spend-by-model**, 30-day heatmap, and **CSV export**.

<div align="center"><img src="docs/feat-overview.png" width="820" alt="Overview — budgets, forecast, spend by model, history" /></div>

- **Project detail** — per-day time/cost charts, token breakdown, tool-usage bars, most-edited files, and a session list.

<div align="center"><img src="docs/feat-detail.png" width="820" alt="Project detail — charts, tokens, tools, models" /></div>

### 🔎 Search & read
- **Unified search** across every conversation **and** your saved context/memory — highlighted snippets, filter by project / date / role.
- **In-app transcript viewer** — read the full conversation as a clean chat; jump straight from a search hit to the exact message.
- **Branch a conversation** — fork any past session into a new Claude Code session (`--resume … --fork-session`) straight from the transcript or a session row. The original stays untouched, so you can explore a different direction without losing your thread.

<div align="center"><img src="docs/feat-search.png" width="820" alt="Search across conversations and context" /></div>

### 🧠 Context
- See **what Claude remembers about you** — your memory files and global `CLAUDE.md`, grouped into About you / Preferences / Projects / References.

<div align="center"><img src="docs/feat-context.png" width="820" alt="Context — what Claude remembers about you" /></div>

### 🔁 Routines
- **Recurring Claude Code tasks on a schedule.** Each routine runs `claude -p "<your prompt>"` in a project (every N hours or daily at a time) and shows the result right in the app — a daily standup digest, a weekly retro, a README freshness check, a test/health sweep.
- Runs in **safe read-only mode by default**; an optional "autonomous" toggle (`--permission-mode acceptEdits`) lets a routine make changes. Per-routine model, enable/disable, and **Run now**.

<div align="center"><img src="docs/feat-routines.png" width="820" alt="Routines — recurring claude -p tasks" /></div>

### 🎛 Organize & polish
- **Tags** (client / personal / …) with a tag filter, **archive** to hide projects, **pin** favorites.
- **Dark mode**, first-run onboarding, and a privacy-first, **100% local** design — nothing leaves your machine (the only optional network call is AI summaries, if you add your own API key).

---

## 🔜 Coming soon

- **Code-signing** (removes the one-time "unidentified developer" prompts and enables macOS auto-update).

---

## How it works

- All paths are derived from your home directory at runtime, so it works for **whoever installs it**.
- It reads `~/.claude/projects/**.jsonl` (your Claude Code session transcripts) to compute stats, and your memory folder + `~/.claude/CLAUDE.md` for the Context view.
- Cost is an **estimate** (tokens × public Claude pricing), labeled as such.
- **No telemetry. No account. No data leaves your machine.**

## Build from source

```bash
npm install
npm start        # run in dev
npm run dist     # build the Windows installer into dist/
```

## License

MIT
