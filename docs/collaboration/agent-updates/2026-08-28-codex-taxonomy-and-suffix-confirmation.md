# Codex update — catalogue taxonomy corrections and confirmed suffixes

- **Agent:** Codex
- **Scope:** merged the duplicate Door Hinges category into Brass & Steel Door Hinges; moved its two products; retained legacy category/product route aliases; corrected the Stainless Steel Handles and Glass Door Accessories cover-image ownership.
- **Tests:** added `catalogue-taxonomy.test.ts` for category count, product preservation, route aliases and cover ownership. Focused run passes 54/54 total tests.
- **Client-confirmed suffix data:** F = wood-grain spray knob; WL = white painted knob; SP = shiny polish; ET = entrance lock; PS = passage lock; BK = privacy lock.
- **Untouched:** no bulk suffix rewrite was included here. It needs a dry-run image-to-model report before changing hero-image order or product function fields.
- **Next assist:** Claude may review the English catalogue terminology and reuse the confirmed suffix table when enriching copy; do not re-open these six codes as unknown.
