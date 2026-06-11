# Helm Hub — the Mac mini as the always-on share relay (Phase 1)

Decisions (user, 2026-06-10): everyone is remote (PC, mini, partners all different
places); no domain / no Cloudflare account; Phase 1 only (share hosting — the
live cross-machine analytics "database" is Phase 2, later).

## Architecture

```
 Windows Helm  ──┐                       ┌── Gavin's Helm
                 │   https (rotating     │
                 ▼    quick tunnel)      ▼
            ┌─────────────────────────────────┐
            │  Mac mini — Helm in HUB MODE    │
            │  hub.js: git-over-HTTP server   │
            │  ~/HelmHub/<name>.git bare repos│
            │  bearer-token auth per repo     │
            └─────────────────────────────────┘
                 ▲ on boot: publish current tunnel URL
                 │
        rendezvous bulletin (tiny gist, owner's gh — partners
        read it anonymously; swappable for a Worker later)
```

- **hub.js** (new module): plain-Node git smart-HTTP server.
  - `GET /<repo>.git/info/refs?service=git-upload-pack|git-receive-pack` →
    spawn `git upload-pack|receive-pack --stateless-rpc --advertise-refs`,
    pkt-line service header + 0000 + stdout.
  - `POST /<repo>.git/git-upload-pack|git-receive-pack` → pipe request body
    (gunzip if Content-Encoding: gzip) into the same command's stdin, stream
    stdout back. This is the standard smart-HTTP recipe.
  - `POST /api/repos {name}` (admin token) → `git init --bare`, mint repo token.
  - `GET /api/ping` → `{ ok, hub: true, name }`.
  - Auth: `Authorization: Bearer <token>`; per-repo tokens + one admin token,
    persisted in hub config. Constant-time compare.
- **Reachability**: cloudflared quick tunnel (share.js already manages the
  binary). URL rotates on hub restart → **rendezvous bulletin**: hub mode
  updates a secret gist (`gh gist edit`) with `{url, ts}` on every boot/URL
  change; clients resolve `gist raw URL → current base URL`, anonymous read,
  and re-resolve automatically whenever a sync hits a dead URL. Self-healing.
- **v3 partner codes**: `{ v:3, rdv: <gist raw url>, repo, token, name }`.
  joinWithCode resolves rdv → clones `https://<base>/<repo>.git` with
  `http.extraHeader = Authorization: Bearer <token>` persisted via
  `git config http.<base>.extraHeader` — plus stored entry `{ rdv }` so
  syncOne can re-resolve and rewrite the remote URL when the tunnel rotated.
- **Sharing via hub**: owner Helm picks "share through my hub" (hub address +
  admin token stored once in Settings), POSTs /api/repos, pushes, mints code.
- Everything else (auto-setup, seed, sessions, context) rides unchanged — the
  hub is just a different remote.

## Hard-won notes

- The create-repo API takes `head` (the sharer's branch) and sets the bare
  repo's symbolic HEAD — otherwise clones land on a detached HEAD.
- Clients MUST set `GIT_TERMINAL_PROMPT=0` + `credential.helper=` for hub
  remotes: on a 401 git otherwise hangs forever on an interactive prompt.
- **Same-process deadlock**: anything that runs the hub in-process (the mini's
  Helm) must NEVER drive git at it synchronously over http://localhost —
  spawnSync blocks the event loop, the server can't answer, git waits forever.
  The mini syncs its own copies via the bare-repo FILESYSTEM path as the
  remote, not localhost HTTP. (Burned an hour on this in tests.)

## Status

- [x] Decisions captured
- [x] hub.js core server + token auth + create-repo API — 17 assertions in
      test-hub.js (in npm test): real push/clone/round-trip, auth rejects,
      HEAD follows sharer's branch, idempotent create, traversal guard
- [ ] Hub mode toggle in Settings (mini side): start server + tunnel on boot
- [ ] Rendezvous publish (gh gist) + client resolve/re-resolve in partner.js
- [ ] v3 codes in shareProject/joinWithCode + "share through hub" UI
- [ ] Self-test: hub leg in partner self-test
- [ ] Phase 2 (later): live session/analytics streaming to hub, config sync
