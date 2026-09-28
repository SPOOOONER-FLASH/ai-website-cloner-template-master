# 2026-09-28 · Claude · privacy policy draft (EN + DE)

- Added `docs/legal/privacy-policy-draft-2026-09-28.md`: English and German privacy policy drafted
  only from what the code collects (4 Web3Forms forms, GA4, GTM, Clarity, Cloudflare, two browser-storage keys).
  Not a route, not linked, not published.
- Blockers found (in the doc's first table): analytics load with no consent banner (§25 TDDDG breach
  for EU visitors); no Art. 27 EU representative; two conflicting company addresses in `content/site-settings.json`.
- Tests: docs-only, no source touched; `npm run check` not run (nothing it covers changed).
- Next: owner fills [OWNER] markers; lawyer clears [LAWYER] markers; engineering adds a consent
  banner gating `Analytics.tsx` as a whole before the policy goes live; then a `/privacy` route + ES/PT versions,
  and footer links in `SiteFooter.tsx` repointed from `/company`.

## CI fix (same session)

- `main` CI was red on every run since r8: `finish-downloadable-pdfs.mjs --check` shelled out to `py`
  (Windows-only launcher) and needed pymupdf; on ubuntu it threw ENOENT and reported the PDFs as stale.
  The three PDFs were in fact set (`/PageLayout/TwoPageRight`, `/PageMode/UseOutlines`).
- `--check` now reads the bytes in Node, no Python; write mode uses `python3` off Windows.
  Verified: passes on the committed PDFs, fails when one layout token is broken. Rest of `test:export`
  passes locally against the committed `out/`.
