# Mac session — test partner sharing + build the .dmg

Everything below is paste-and-go on the Mac. Two goals: (1) prove cross-machine
partner sharing with the test code, (2) finally build the macOS installers
(the standing Tier-1 item — it needs a real Mac).

## 0. Prereqs (one-time)

```bash
# git ships with macOS (or via Xcode CLT — accept the prompt if one appears)
git --version
# Node 20+ — if missing: install from nodejs.org or `brew install node`
node --version
```

Sign git into GitHub as `trifactorscalingllc` (needed to clone the private
test repo). Easiest path:

```bash
brew install gh   # or download from cli.github.com
gh auth login     # GitHub.com → HTTPS → login with browser
gh auth setup-git # make git use gh's credentials
```

## 1. Run Claude Helm from source

```bash
git clone https://github.com/trifactorscalingllc/claude-helm
cd claude-helm
npm install
npm start
```

First-run onboarding: pick (or create) a projects folder, e.g. `~/projects`.

## 2. Test the sharing function (no real project at risk)

1. Go to **Clients & Partners** → **Join with a code…**
2. Paste the test code (from the Windows machine — `helm-share-test` row →
   *Copy code*, or the one already saved in chat).
3. Verify, in order:
   - A `helm-share-test` project appears in your projects list.
   - It contains `marker.txt` and `README.md` ("If you can read this…").
   - **Context tab** (or the project's memory) now includes
     *"context travelled through the partner pipe"* — proves context sync.
   - The project's note says *"Share self-test note"* — proves meta sync.
4. Create a file in the project (e.g. `hello-from-mac.txt`), wait ~1 minute
   (auto-sync) or hit **Sync now** — then check the repo on GitHub: if the
   file is there, two-way sync across machines is fully proven.
5. Optional: run **Self-test the pipes** on the Mac too — it logs each link
   (git, gh, local engine, live GitHub) PASS/FAIL for this machine.

## 3. Build the macOS installers (.dmg + .zip)

```bash
npm run dist:mac   # = npx electron-builder --mac (dmg + zip, x64 + arm64)
ls dist/           # Claude-Helm-*.dmg, *-mac.zip, latest-mac.yml
```

Notes:
- The build is **unsigned** (no Apple Developer ID yet) — Gatekeeper will
  warn. First-run on any Mac: `xattr -cr "/Applications/Claude Helm.app"`
  (already documented in the README).
- `latest-mac.yml` + the `.zip` files are what the auto-updater needs.

## 4. Publish the Mac build to the existing release

```bash
gh release upload v1.12.0 dist/*.dmg dist/*-mac.zip dist/*-mac.zip.blockmap dist/latest-mac.yml \
  --repo trifactorscalingllc/claude-helm
```

(If a newer version has shipped since, upload to that tag instead.)

## 5. Clean up the test share

- On both machines: Clients & Partners → `helm-share-test` → **Stop** (files
  stay on disk; delete the folders if you want).
- Delete the throwaway repo: `gh repo delete trifactorscalingllc/helm-share-selftest-neph6n --yes`
  (needs the `delete_repo` scope: `gh auth refresh -s delete_repo`).
