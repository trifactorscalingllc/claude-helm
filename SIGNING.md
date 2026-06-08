# Code signing — setup guide

The CI workflow (`.github/workflows/release.yml`) is **pre-wired**: the moment the repo
secrets below exist, builds sign themselves. Until then, everything builds **unsigned** (the
empty secrets are treated as "off"), exactly as today.

There are two independent halves — **Windows** and **macOS** — do either or both.

---

## macOS (Apple Developer — $99/yr) — fully pre-wired

This enables a signed `.dmg`, removes the Gatekeeper "unidentified developer" warning, and
turns on **macOS auto-update**.

1. Enroll in the **Apple Developer Program** ($99/yr).
2. In Xcode/Apple Developer, create a **"Developer ID Application"** certificate, then export
   it from Keychain as a **`.p12`** (set a password).
3. Base64-encode it:  `base64 -i cert.p12 | pbcopy`
4. Create an **app-specific password** at appleid.apple.com (for notarization).
5. Add these **repo secrets** (Settings → Secrets and variables → Actions):
   | Secret | Value |
   |---|---|
   | `MAC_CSC_LINK` | base64 of the `.p12` |
   | `MAC_CSC_KEY_PASSWORD` | the `.p12` password |
   | `APPLE_ID` | your Apple ID email |
   | `APPLE_APP_SPECIFIC_PASSWORD` | the app-specific password |
   | `APPLE_TEAM_ID` | your 10-char Team ID |
6. Tell me to **flip on notarization** — I'll remove `"identity": null` from `package.json`'s
   `mac` block and add `"notarize": true`, then cut a release and verify the `.dmg` is signed
   + notarized (`spctl -a -t open --context context:primary-signature` passes).

---

## Windows — choose ONE path

### Option A — Azure Trusted Signing (recommended, ~$10/mo, CI-friendly)

Cloud signing, no hardware token, runs in GitHub Actions.

1. Azure portal → create a **Trusted Signing account** + a **Certificate Profile**
   (requires identity validation — org 3+ yrs, or individual).
2. Create an **App Registration** (service principal) with the **Trusted Signing Certificate
   Profile Signer** role on the account.
3. Add repo secrets: `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, and note your
   **endpoint**, **account name**, and **profile name**.
4. Tell me — I'll add the electron-builder **custom sign hook** (`build/sign.js` invoking the
   Trusted Signing dlib via `signtool`) so the `.exe` is signed *during* the build (keeping the
   blockmap/`latest.yml` valid for auto-update), then cut a release and verify the signature.

> This is the one piece I finalize **with** you, because it restructures the sign step and
> can't be verified without the live account.

### Option B — Traditional OV/EV cert (.pfx)

If you already have (or buy) a standard cert exported as `.pfx`:
1. Base64-encode it and add secrets `WIN_CSC_LINK` (base64) + `WIN_CSC_KEY_PASSWORD`.
2. electron-builder signs automatically — **no code change needed** (already wired).
   ⚠️ Brand-new OV certs may require a hardware token (won't work in CI) unless you use the
   CA's cloud signer (e.g., SSL.com eSigner).

---

## What signing fixes
- ❌ "Access is denied" / Defender locking the installer on every update
- ❌ "Failed to uninstall old application files (2)" dialog
- ❌ SmartScreen "unknown publisher" (EV/Azure earns reputation fastest)
- ✅ Working **macOS auto-update** (impossible while unsigned)
