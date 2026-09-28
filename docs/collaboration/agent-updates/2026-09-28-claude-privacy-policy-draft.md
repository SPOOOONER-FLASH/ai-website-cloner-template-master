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

## Privacy page built (client 2026-09-28: 「德语表单必须链到隐私政策页……把这个做了上架」)

- `/privacy/` and `/de/privacy/`, English and German only: `PARTIAL_ROUTES` in `src/lib/spanish-mirror.ts`,
  `HAND_WRITTEN` in `scripts/scaffold-locale-routes.mjs`, sitemap entry. Copy in `src/data/privacy-policy.ts`.
- **The published text describes the site as it is today**: analytics load without a banner, so section 4 states
  legitimate interest + right to object + opt-out routes. It does NOT mention a consent tool. When a banner lands,
  section 4 must switch to consent (Art. 6(1)(a) / §25 TDDDG) in the same commit.
- Linked from: footer "Privacy Notice" (en → /privacy, de → /de/privacy, es/pt → English /privacy) and
  `PrivacyNote` under all four forms (inquiry, document request, newsletter, BAU meeting).
- Still open, not invented in the page: EU representative (Art. 27), which of the two addresses is registered
  (page prints the contact address already on the site), fixed retention periods, Web3Forms DPA.
- `/privacy` is EXEMPT in `internal-link-placement.test.ts` (footer + forms, not a drawer section).
- Neutral lane only; nothing RAYEN touched. Release is the johns machine's.
- Client 2026-09-28: Lehe Road No. 28 = actual address (used on /privacy); Haiwei Road No. 76 = factory for customer audits. No EU representative yet.
