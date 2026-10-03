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

Source only. `out/` and `out-rayen/` were not rebuilt or committed. The existing johns engineering session owns HYDE release per AGENTS.md; incorporate this source in its next `release:hyde`, then verify the public contact page, catalog-first order and the expanded promo download. Live deployment remains unverified until that release.

The older C: workspace, paused search changes, other agents' work and RAYEN are untouched. Remote sync had an interrupted pack transfer and a bounded fetch timeout during this task; record actual ship status rather than treating a local commit as a push.
