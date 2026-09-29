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
