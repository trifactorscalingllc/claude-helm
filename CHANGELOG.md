# Changelog

All notable changes to Claude Helm are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/) · versions follow the `package.json` semver.

## [1.21.0] - 2026-06-10

### Added
- **Joins set themselves up.** After a partner joins, Helm detects the package manager (npm/yarn/pnpm/bun from the lockfile) and installs dependencies automatically — the partner row shows "installing", then a "project is ready" ping. When a sync later pulls a changed lockfile, dependencies reinstall on their own.
- **Local data travels (one-time seed).** Sharing now snapshots gitignored data files — dev databases (`*.sqlite`, `*.db`) and `uploads/`/`storage/`/`data/` folders — into the share, so the partner starts with real data, not an empty app. Deliberately one-time: later database changes stay local (live-syncing binary databases through git means endless conflicts). Seeds never overwrite files the partner already has. Caps: 50MB/file, 200MB total.
- **Conversation history travels.** Each side's Claude sessions for the project sync into the share (only once a session has been idle 10+ minutes, 25MB/file cap). Project detail grows a **Partner sessions** panel — read your partner's actual conversations in the transcript viewer (and export them as Markdown). Heads up: transcripts can contain anything that appeared in them, including secrets echoed in command output — the share is private, but know it travels.

### Fixed
- Seed/session copies under `.helm-context/` are force-added past the project's own ignore patterns (e.g. `uploads/` used to also ignore the seed copy of uploads).

## [1.20.0] - 2026-06-10

### Added
- **Partners need no GitHub account anymore.** The partner code now carries its own repo-scoped access key (a deploy key minted per share): your partner pastes the code and Helm clones + syncs with zero sign-in, zero setup. Treat the code like a password — and "Stop" on a share now revokes that key. If key creation ever fails, Helm falls back to the old collaborator-invite flow and tells you exactly what to do. Old (v1) codes keep working.

## [1.19.2] - 2026-06-10

### Fixed
- **Share works "off rip" on any project, safely.** Sharing a project that already had its own git remote used to push the share — including force-added `.env` secrets — straight to that remote (public repos included). Shares now always live on their own private `helm-*` repo: projects with an existing remote get a separate `helm-share` remote and the original is never touched (covered by tests).
- **A failed collaborator invite is now loud.** The share repo is private, so if granting your partner access fails (typo'd username), their clone is guaranteed to fail — Helm used to report success anyway. The code-ready dialog now shows exactly what failed and how to fix it, and warns before sharing with no username at all.
- **Share errors stay inside the dialog** (same fix Join got in 1.19.1) instead of flashing as a toast behind the closing window.

## [1.19.1] - 2026-06-10

### Fixed
- **Joining a shared project is never a dead end anymore.** If your projects folder already had a folder with the share's name, Join refused — and since stopping a share keeps the files on disk (by design), rejoining the same project was impossible without manual folder surgery. Now: the same repo is *reconnected* in place (rejoin just works), an empty leftover folder from a cancelled clone is reused, and an unrelated folder with the same name gets the share cloned beside it as `name-shared`.
- **Join failures now show inside the Join dialog** in red and keep it open. Before, the error was a brief toast behind the closing dialog — entering a code and "nothing happening" was this bug.

## [1.19.0] - 2026-06-10

### Added
- **Copy session as Markdown** — export any conversation as clean Markdown: "Copy Markdown" and "Save .md…" in the transcript viewer (with an optional include-thinking toggle), plus a Copy button on every session row in project detail. Exports the full transcript with no display caps; tool calls and results render as code blocks.
- **Saved & recent searches** — the search tab remembers your last 20 successful searches (with their filters) as chips on the empty-search screen, and a ★ "Save this search" pin above results keeps favorites permanently. Clicking a chip restores the query *and* its project/role/date filters. Saved chips get a hover × to remove.

### Fixed
- **Token, cost and turn counts were ~3× too high** — Claude Code logs one transcript line per assistant content block, each repeating the same message id and usage, and continuation/fork session files replay the parent session's lines verbatim. Helm counted every line every time. The indexer now processes each line and each API call exactly once across all files (verified against real history: $9,002 shown → $2,723 actual). All history recomputes on first launch after update.
- **Active time was inflated too** — replayed history in continuation files re-counted the same working gaps (~15% high); now counted once.
- **Clear error for Windows-unreachable project folders** — folders whose names end in a dot or space (e.g. `T.O.M.`) exist on disk but can't be entered by any Windows terminal, so launching them flashed Windows Terminal's cryptic `0x8007010B Could not access starting directory`. Helm now explains the problem and tells you to rename the folder, instead of copying a fallback `cd` command that fails the same way. Missing folders (stale rows) also get a plain "Folder not found" message.

### Changed
- **Removed the redundant Launch button on project rows** — launching lives in the per-file Launchable-files subtree (and the detail view); the row keeps Open, pin, and the menu.
- New test suite `test-indexer.js` (24 assertions) covers usage dedup, continuation-file skipping, sidechain gauge isolation, daily buckets, and restart safety; wired into `npm test`.

## [1.18.0] - 2026-06-10

### Added
- **Compact dashboard toggle** — a "Compact" button in the projects topbar compresses everything vertically: dense rows, no descriptions, no launchable subtrees, tighter sections. Persists across launches.
- **Real MCP tool monitoring** — the MCP tab now tracks every call's outcome: error counts per server and per tool (red chips), last-used times, and a live feed of the most recent calls with project, latency, and error status. Updates live as sessions run.
- **API tab** — connects to the Anthropic Admin API with your org Admin key and shows real billed usage for the last 30 days: cost per day chart, token totals, per-model token breakdown, and your local active-time alongside. Straight from Anthropic — not an estimate.

## [1.17.3] - 2026-06-10

### Fixed
- **Cost analytics for top-tier models** — sessions on Fable-family models are now priced at their real rate ($10/$50 per MTok, double Opus) instead of falling back to Opus pricing. All historical costs recompute on first launch (full re-index), so spend, budgets, model breakdown, and client reports reflect what you actually paid.
- **Daily analytics use your local day** — daily buckets were keyed to UTC dates while hourly ones used local time, so evening work counted toward "tomorrow" and today's spend reset mid-evening. Daily keys are now local-time everywhere (recap, heatmap, budgets, away digest, sparklines).

## [1.17.2] - 2026-06-10

### Fixed
- **Context tracker accuracy** — sessions on 1M-context models (`[1m]` variants) are now measured against their real 1,000,000-token window instead of a hardcoded 200K, so the ctx % and the rescue card stop crying wolf at 17% full. The ambient tooltip names the window (~200K or ~1M).
- Subagent (sidechain) turns no longer move the context gauge or the "waiting for you" flag — they run in their own smaller context, which made the gauge dip falsely mid-task. Their token spend still counts in usage and cost totals.

## [1.17.1] - 2026-06-10

### Changed
- Launchable files now show their real names — an HTML page's `<title>` (or its file name when untitled) and a dev app's package name — with the path or run command as smaller secondary text.
- The launchable-files subtree starts collapsed; click the header to open it.

## [1.17.0] - 2026-06-10

### Added
- **Launchable files subtree** — projects edited or opened in Claude within the past 48 hours show an open-by-default subtree under their row listing every launchable file (`.html` pages and `dev`/`start`/`serve`/`preview` scripts, up to 12), each with its own Launch button. Launching a different file while one is running swaps the preview to it; the running entry shows a green Open button with a stop control.
- New preview-engine API: `detectAll()` inventories every launchable in a project with stable ids; `launch()` accepts an entry id to run that exact file/app. Default launches now record their entry id too, so the subtree highlights what's live.
- Test suite doubled: 5 new preview test groups (25 assertions) covering the launchables inventory, skip-dirs/depth/item caps, entry-specific launch, swap behavior, stale-id handling, and server-entry boot.

### Changed
- **Projects list floats** like the rest of the app — leading accent line and hairline row dividers replace the boxed glass panel; row hover washes the accent gradient in from the line.
- **"Open in browser" button** in the preview window is now an accent-gradient pill matching the Helm nav tabs, tinted with whichever accent preset is active when the preview opens.

### Fixed
- Switching launchables no longer orphans the old dev-server process or drops the new preview from the running registry (the dead child's exit event was deleting the replacement entry).
- Clicking Launch on a since-deleted file no longer kills a healthy running preview — the target is validated before anything stops.
- Swapping launchables tears down an active share tunnel that would otherwise point at the dead port.
- Launchable scans are cached per project so typing in search no longer re-walks project trees on every keystroke.
- `escapeHtml` now escapes quotes, closing an attribute-breakout gap for file names from cloned repos.
