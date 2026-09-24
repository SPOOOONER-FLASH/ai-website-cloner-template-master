# HYDE article catalogue claims — 2026-09-23

- Agent: Codex (isolated `codex/hyde-article-claims` worktree).
- Scope: Corrected EN/ES/PT factual prose and FAQ in four HYDE guides and `what-documents-you-can-actually-get.json`. The articles now distinguish 590 HYDE records, 523 visible listings, 84 dimensioned SVG assets, 72 assets on visible listings, and 0 HYDE door-preparation SVGs. The refurbishment survey uses the HYDE-only counts 201 / 184 / 175 / 36 / 6; the finish guide uses 326 of 590.
- Reason: The previous 973-product denominator and 95 door-preparation drawings mixed this site with RAYEN. The old document article also described simple product SVGs as complete door-cutting templates.
- Verification: All five JSON files parse; no old 973 / 964 / 95 / 79 inventory claims remain; `node --test src/lib/article-faq.test.ts src/lib/article-layout.test.ts src/data/news-publish-date.test.ts` passed 7/7; `git diff --check` passed.
- Untouched: generators, tests, reports, images, `out/`, and `out-rayen/`. Publication dates are unchanged.
- Known test gap: The current article-catalogue-claims test has one failure because it still requires the two removed cross-site phrases `there are 95 door-preparation drawings` and `Alongside the 84 dimensioned product drawings`. The release owner is updating that test to HYDE-scoped claims.
- Next: The release owner will replace the two old cross-site expectations in `article-catalogue-claims.test.ts`, integrate this branch, run its catalogue-claim checks, and build the HYDE export. No production deployment is claimed here.
