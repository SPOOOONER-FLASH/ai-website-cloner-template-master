# Cantonlock contact and catalog downloads — 2026-10-03

Agent: Codex. User requested removal of the HYDE email, the product catalog first on Downloads, and a catalog download inside Talk to us.

## Source change

- Removed `contact.brandEmail` and its Monica Lee mailbox-owner entry. Optional contact rows now disappear; the location picker falls back to `tec@cantonlock.com`. Both German representative entries use TEC too.
- The EN, ES, PT and shared seven-locale Downloads renderers put catalog and planning downloads before the three partial 3D models. The product catalog is the first download section.
- Only the Talk to us card enables `downloadCatalogue`. Its expanded panel keeps Contact us and adds a direct `<a download>` for the existing `export-catalogue-2026` record. The file URL is never given a locale prefix. The row displays PDF, EN and the size from the download record.
- Ten localized labels live in `src/data/promo-catalog-download-labels.json`; the English-only spelling guard otherwise treats the French word catalogue as British English. CMS exposes the optional toggle.
- No timing, card order, dismissal key, model geometry or PDF content changed.

## Verification

- `npm test`: 447 passed, 0 failed.
- `npm run typecheck`: passed.
- ESLint on all changed TS/TSX files: passed. `git diff --check`: passed.
- EN/ES/PT/DE Downloads and Contact returned HTTP 200. Rendered catalog heading precedes the 3D heading; the old mailbox is absent and TEC is retained.
- Both promo cards rendered in ten locales: only Talk to us has the catalog anchor; all ten use the exact existing file URL and remain collapsed initially.
- Existing PDF on disk: 6,356,696 bytes, matching the download record (6.4 MB shown).
- Browser: expanded Talk to us shows both actions. Closing it reveals the configurator card. At a 390 × 844 viewport the download row has a 44px click height and stays inside the viewport. Preview evidence: `docs/design-references/2026-10-03-contact-catalogue/desktop.png` and `mobile.png`.
- Preview used `npm run dev -- --webpack --port 3044 --hostname 127.0.0.1`; Turbopack rejects the existing shared node_modules junction outside this worktree. No dependency or project configuration change was required.

## Release handoff

The client subsequently asked to try publishing. The current attempt and verified result are recorded in `2026-10-03-codex-catalogue-publication.md`; the paragraphs below preserve the earlier failed attempt.

Source only. `out/` and `out-rayen/` were not rebuilt or committed. The existing johns engineering session owns HYDE release per AGENTS.md; incorporate this source in its next `release:hyde`, then verify the public contact page, catalog-first order and the expanded promo download. Live deployment remains unverified until that release.

Source commit: `7f3394e06df8`. `npm run ship` exited 75: pushes were rejected because main had advanced; merging and the fallback checkout could not retrieve a required Git object from the remote. Fetched `origin/main` is `4e83433aa510` and does not contain this source commit. A final `ls-remote` could not connect, so no successful push or deployment is claimed. The generated failure record is in `PUSH-PENDING.md`; do not keep retrying the same failed ship loop.

Portable handoff exported with `git format-patch --binary -1 7f3394e06df --output-directory E:/cantonlock-deliverables`: `E:/cantonlock-deliverables/0001-Remove-HYDE-mailbox-and-prioritize-catalog-downloads.patch` (112,915 bytes). It includes the verified source, this task's original handoff and the two preview screenshots. The release engineer can transfer it to their clean checkout and apply it with `git am --3way`, review any conflicts, then use the normal ship and HYDE release workflow. This avoids needing to reproduce the UI work while this machine cannot sync the missing remote object.

Finishing check: `node scripts/build-i18n-client-ui.mjs --check` passed; generated locale client subsets are current without regeneration.

The older C: workspace, paused search changes, other agents' work and RAYEN are untouched. Remote sync had an interrupted pack transfer and a bounded fetch timeout during this task; record actual ship status rather than treating a local commit as a push.
