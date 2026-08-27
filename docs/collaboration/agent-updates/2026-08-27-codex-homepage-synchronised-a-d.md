# Codex update — synchronised homepage A + D interaction

- **Agent:** Codex
- **Scope:** Added the approved neutral-at-rest interaction to the ten homepage modules below the carousel in English and Spanish. Hover or keyboard focus now reveals one black title marker, one 1px frame and one hard offset plane together; leaving the surface retracts all three together. Current top navigation is semibold at rest with no persistent underline.
- **Double-line safeguard:** Internal CTA markers delegate to the module title while that module owns the A + D state, so a focused or hovered card does not draw two competing short lines.
- **Responsive safeguard:** The 16px outside-frame expansion starts at 744px. Mobile keeps a zero-margin frame and 4px hard plane, preventing the earlier 16px horizontal overflow.
- **Tests:** `npm test` passed 47/47; `npm run lint` passed; `npm run typecheck` passed; the new `home-accent.test.ts` locks the neutral rest state, hover/focus contract, ten-module opt-in and current-nav rule.
- **Browser QA:** At 1512px, computed hover and keyboard states both produced ink frame, 9px unblurred mineral shadow, -2px translation and one fully revealed marker; pointer exit returned transparent frame/no shadow/no marker. At 390px, all 12 natural interactive surfaces across the ten modules fit `scrollWidth === clientWidth` with no overflow.
- **Shared release note:** The concurrent IndexNow/Clarity release `d49a0541d` included this final source and its matching generated `out/`. This follow-up records the Codex scope only and does not rebuild or alter `out/`.
- **Untouched / next:** No Piccolo identity, model claim, third-party product image or seasonal product module was published. Next work is local-only Piccolo/quarterly-market previewing, then a separate client-selected implementation.
