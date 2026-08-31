# Codex update — five homepage editorial groups

- **Agent:** Codex
- **Scope:** Replaced the five ambiguous homepage editorial groups with 15 reviewed candidate compositions and six final sales-semantic assets (the first group is a two-card diptych). Panic Exit Devices imagery was not changed.
- **Final assets:** `hyde-source-by-range-2026.webp`, `hyde-source-by-project-2026.webp`, `hyde-nine-families-2026.webp`, `hyde-materials-engineering-2026.webp`, `hyde-engineering-contact-2026.webp`, and `hyde-installation-faq-2026.webp`.
- **Content:** English and Spanish headings, labels, and CTA descriptions now connect each image to distributor sourcing, specification, coordinated product families, engineering support, contact, or FAQ intent. The Spanish FAQ card deliberately falls back to the existing `/faq/` route because `/es/faq/` does not exist.
- **Provenance:** Added dimensions, bytes, generation method, first-party geometry-reference boundary, and factual-claim restrictions to `IMAGE_CREDITS.md`. Candidate scores and final IDs are recorded in the candidate register.
- **Responsive assets:** `npm run assets:editorial` generated/verified 81 responsive WebPs; the six new source files are configured with three variants each.
- **Validation:** Targeted Node tests 8/8, `npm run assets:editorial:check`, `npm run typecheck`, and targeted ESLint passed. Playwright checked EN/ES at 1440×1000 and 390×844; the new sections and four-item footer render without page-level horizontal overflow (`scrollWidth === clientWidth`). No browser console errors beyond Next dev/HMR information.
- **Untouched:** `home-commercial-egress.webp`, `home-panic-exit-bars.webp`, product data, generated `out/`, and unrelated shared-tree work.
- **Next:** Full product-image HYDE logo audit/repair, then the remaining handoff gates and one final `out/` release build.
