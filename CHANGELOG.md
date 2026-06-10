# Changelog

All notable changes to Claude Helm are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/) · versions follow the `package.json` semver.

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
