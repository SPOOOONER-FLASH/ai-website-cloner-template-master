# HYDE desktop correction evidence — 2026-09-28

Before: public desktop baseline recorded by the browser audit. After: isolated integration checkout at `144b7ec067e` plus the owned native-details promo and motion-token correction, with `npm run check` exit 0.

At 1440 × 900, the homepage entrance moves from y=339 to y=195 after removing the duplicate desktop margin. The corrected hero action is visible. The delayed promo defaults to a compact disclosure instead of obscuring that action; its close button is 44 × 44. Expanded dismissal advances to a collapsed next offer.

- `home-before-1440.png` / `home-after-1440.png`: unedited viewport captures.
- `desktop-audit.json`: all five core pages at 390, 1440 and 1920px; 15/15 pass.
- `promo-audit.json`: the 11-second disclosure flow at all three widths; 3/3 pass, with each assertion recorded.

Reproduce with an exported site served locally:

```powershell
node scripts/audit-hyde-desktop-rhythm.mjs --base http://127.0.0.1:8766
node scripts/audit-hyde-desktop-rhythm.mjs --base http://127.0.0.1:8766 --page home --width 390,1440,1920 --settle-ms 11000 --check-promo
node scripts/audit-hyde-inquiry-feedback.mjs --base http://127.0.0.1:8766
```

The inquiry audit passed 4/4 success/error scenarios at 390/1440px. It blocks external HTTP and mocks Web3Forms before app initialization: zero real submissions. This establishes frontend feedback, not email delivery. The screenshot/reference baseline is preserved; later owner commits may change unrelated header, copy and product-photo details.

## Merged BAU-notice regression, 2026-09-29

The later source merge (`e36f7876720`) adds a notice above the hero. At 1440px that moves the active hero action into even the collapsed promo rail. The same browser assertion fails before the follow-up clearance fix and passes after it: all four 390/1280/1440/1920px disclosure scenarios pass, including expanded dismissal. `home-with-bau-before-1440.png` / `home-with-bau-after-1440.png` are untouched captures; `merged-promo-before.json` / `merged-promo-after.json` retain the measurements. The clearance responds to actual hero-link rectangles, rather than one fixed header height.

```powershell
node scripts/audit-hyde-desktop-rhythm.mjs --base http://127.0.0.1:8766 --page home --width 390,1280x900,1440,1920 --settle-ms 11000 --check-promo
node scripts/audit-hyde-product-public.mjs --out tmp/codex-product-public
```

`public-loading-audit.json` records 15 read-only public page/viewport scenarios with no critical resource failure, overflow or exception. It does not assert that the old public promo is corrected. `public-product-audit.json` verifies 21 EN/ES/PT product/studies pages and 26 source-study WebPs; no inquiry is sent and no cache-buster or purge is used. Publication/verification of the new clearance is recorded separately in the handoff; local success alone is not an online deployment.

## Browser font preference regression

The bounded Tailwind `bottom-*` classes use the site's `0.1rem` spacing token. Treating their data attribute as physical pixels fails when the browser's default font is 20px (computed root: 12.5px). `promo-font20-before.json` records a real failing run: the card's lift alternates after scrolling and resizing, and the hero action is overlapped. The correction converts both the previous lift and tier thresholds to actual CSS pixels. `promo-font20-after.json` records the same probe passing all 11 assertions, including 12 scroll/resize samples. It changes the browser preference through CDP, without editing page CSS.

```powershell
node scripts/audit-hyde-desktop-rhythm.mjs --base http://127.0.0.1:8766 --page home --width 1440 --check-promo --default-font-size 20 --out tmp/codex-promo-font20
```
