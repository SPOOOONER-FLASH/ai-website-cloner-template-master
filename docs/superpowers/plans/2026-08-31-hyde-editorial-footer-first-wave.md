# HYDE Editorial and Footer First-Wave Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the exact four-item footer and replace the five ambiguous homepage editorial groups with six unique, sales-relevant, visually verified HYDE assets, while leaving the completed Panic Exit Devices hero untouched.

**Architecture:** Keep navigation truth in `content/navigation.json`, keep compact footer presentation local to `SiteFooter.module.css`, and reuse the existing responsive editorial pipeline for selected imagery. Generate three preview directions per editorial group; the first group is a two-panel composition that produces two square assets. Score all groups against the approved semantic rubric, promote six unique finals, and preserve traceable credits and configuration.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, CSS Modules, Node test runner, built-in ImageGen, Sharp-based editorial asset pipeline, Playwright/browser QA.

**Spec:** `docs/superpowers/specs/2026-08-31-hyde-sales-imagery-watermark-footer-design.md`

## Global Constraints

- [ ] Do not modify, regenerate, rename, or recrop `home-commercial-egress.webp`, `home-panic-exit-bars.webp`, or any Panic Exit Devices homepage/share asset.
- [ ] Do not touch or stage `out/` while it is dirty; the current release builder owns that baton.
- [ ] Stage only explicit owned paths. Every source checkpoint includes a short tracked update under `docs/collaboration/agent-updates/`.
- [ ] Generated previews contain no text, logo, watermark, certification mark, dimension, or people.
- [ ] A selected image may imply a product family or workflow, but may not invent a model number, certification, real project, factory, or measurable product claim.

---

## Task 1: Correct and checkpoint the approved scope

**Files:**

- Modify: `docs/superpowers/specs/2026-08-31-hyde-sales-imagery-watermark-footer-design.md`
- Modify: `docs/collaboration/agent-updates/2026-08-31-codex-approved-image-branding-footer-design.md`
- Create: `docs/superpowers/plans/2026-08-31-hyde-editorial-footer-first-wave.md`

- [ ] Verify the design contains five positions, fifteen candidates, and an explicit prohibition on Panic Exit hero changes.
- [ ] Review only these three documentation diffs, commit with explicit pathspecs, and push.

Run: `rg -n "5 个首页|15 张|Panic Exit Devices 首页首图已由用户确认完成|禁止" docs/superpowers/specs/2026-08-31-hyde-sales-imagery-watermark-footer-design.md`

Expected: all scope statements are present and no implementation asks for a sixth/Panic candidate group.

---

## Task 2: Lock the four-item footer with a failing test

**Files:**

- Modify: `src/components/site/header-shelf.test.ts`
- Read: `content/navigation.json`
- Read: `src/components/site/SiteFooter.tsx`

- [ ] Extend the existing Node test to parse `content/navigation.json` and assert footer labels are exactly `Contact` and `FAQ`, in that order.
- [ ] Assert `SiteFooter.tsx` still renders `Buy on Alibaba` and `lock@cantonlock.com` and combines global `alibaba-hard-cta` with a CSS-module compact modifier.
- [ ] Assert removed footer labels remain available in non-footer routes/data, preventing accidental page deletion.

Run: `node --test src/components/site/header-shelf.test.ts`

Expected: FAIL because current footer data has nine internal links and `SiteFooter.tsx` has no compact modifier.

---

## Task 3: Implement the exact footer and compact D-style CTA

**Files:**

- Modify: `content/navigation.json`
- Modify: `src/components/site/SiteFooter.tsx`
- Create: `src/components/site/SiteFooter.module.css`
- Modify: `src/components/site/header-shelf.test.ts`
- Create: `docs/collaboration/agent-updates/2026-08-31-codex-footer-four-items.md`

- [ ] Reduce `footer` navigation data to only `Contact` and `FAQ`; do not remove routes, pages, header links, or sitemap entries.
- [ ] Import `SiteFooter.module.css` and apply the compact modifier together with `alibaba-hard-cta` to the Alibaba link.
- [ ] Use `inline-flex`, `width: fit-content`, `min-height: 0`, left alignment, restrained padding, and existing `--text-c1` / `--leading-c1` tokens. Preserve the global hard shadow, focus-visible, active, and reduced-motion behavior.
- [ ] Record scope, tests, untouched `out/`, and next visual check in the agent update.

Run: `node --test src/components/site/header-shelf.test.ts`, targeted ESLint, then `npm run typecheck`.

Expected: PASS; footer has exactly four user-visible destinations and no source/type errors.

- [ ] Commit and push only the five owned implementation paths.

---

## Task 4: Build the five-group reference inventory

**Files:**

- Read: `src/data/home.ts`
- Read: `src/data/home-es.ts`
- Read: `src/components/site/editorial-images.config.json`
- Read: `public/images/products/**`
- Create: `docs/design-references/2026-08-31-home-editorial-candidate-register.md`

- [ ] Select first-party, unwatermarked product references for Two ways to source, Designed for nine families, Materials + Engineering, Get in Touch, and FAQ.
- [ ] Inspect every local reference at original detail before passing it to ImageGen.
- [ ] Record source paths, semantic role, target aspect ratio, forbidden errors, and all three candidate directions.
- [ ] Explicitly confirm the register contains five groups and no Panic Exit group.

Expected: all five groups have traceable references; `rg "Panic Exit|home-commercial-egress|home-panic-exit-bars"` returns no register matches.

---

## Task 5: Generate and score fifteen preview candidates

**Files:**

- Create outside repository: `$CODEX_HOME/generated_images/**` for fifteen previews
- Modify: `docs/design-references/2026-08-31-home-editorial-candidate-register.md`

- [ ] Use built-in ImageGen once per candidate, three per group: architectural application, industrial close-up, procurement/specification workbench.
- [ ] Prompt with inspected product references, concrete door-hardware geometry, target crop, material, negative space, and prohibitions on text/logo/watermark/people/false dimensions.
- [ ] Inspect every return at original detail; reject malformed hardware, impossible fasteners, duplicates, pseudo-text, or misleading claims.
- [ ] Score 0–5 on product semantics, hardware correctness, artifact absence, crop resilience, and absence of pseudo-text/marks; record totals and reasons.
- [ ] Continue with the highest-scoring valid candidate per group; explicit user choice before release overrides scoring.

Expected: fifteen reviewed candidate compositions and exactly five selected compositions; the first selected composition yields two unique final assets, for six finals total. No invalid image is promoted.

---

## Task 6: Lock editorial semantics with a failing test

**Files:**

- Create: `src/data/home-editorial-assets.test.ts`
- Read: `src/data/home.ts`
- Read: `src/data/home-es.ts`
- Read: `src/components/site/editorial-images.config.json`

- [ ] Assert six affected English and Spanish media slots use six distinct new asset basenames with matching semantic alt text.
- [ ] Assert none equals a Panic Exit asset.
- [ ] Assert every selected basename is present in responsive config and `IMAGE_CREDITS.md`.

Run: `node --test src/data/home-editorial-assets.test.ts`

Expected: FAIL because selected assets are not installed yet.

---

## Task 7: Promote five assets and update bilingual content

**Files:**

- Create: `public/images/editorial/hyde-source-by-range-2026.webp`
- Create: `public/images/editorial/hyde-source-by-project-2026.webp`
- Create: `public/images/editorial/hyde-nine-families-2026.webp`
- Create: `public/images/editorial/hyde-materials-engineering-2026.webp`
- Create: `public/images/editorial/hyde-engineering-contact-2026.webp`
- Create: `public/images/editorial/hyde-installation-faq-2026.webp`
- Create: responsive derivatives from `scripts/generate-editorial-srcsets.mjs`
- Modify: `src/data/home.ts`
- Modify: `src/data/home-es.ts`
- Modify: `src/components/site/editorial-images.config.json`
- Modify: `IMAGE_CREDITS.md`
- Modify: `docs/design-references/2026-08-31-home-editorial-candidate-register.md`
- Modify: `src/data/home-editorial-assets.test.ts`
- Create: `docs/collaboration/agent-updates/2026-08-31-codex-home-editorial-five.md`

- [ ] Split the selected Two ways diptych into two square finals, then copy six unique final assets into the repository using the versioned filenames above.
- [ ] Generate responsive WebP assets; do not alter Panic assets or their configuration.
- [ ] Replace five English and Spanish paths and rewrite alt/captions to describe visible hardware and sales purpose without unsupported claims.
- [ ] Add ImageGen provenance, date, prompt purpose, and reference roles to `IMAGE_CREDITS.md`.
- [ ] Record rejected candidates and scoring; do not commit unselected preview binaries.

Run: `npm run assets:editorial`, `node --test src/data/home-editorial-assets.test.ts`, and `npm run typecheck`.

Expected: PASS; six responsive asset families exist and bilingual data points to intended files.

---

## Task 8: Visual QA and first-wave checkpoint

- [ ] Run the local site without producing or staging `out/`.
- [ ] Inspect homepage and footer at desktop, tablet, and mobile widths with a real browser.
- [ ] Verify six images clearly indicate door hardware and adjacent sales action, preserve focal hardware under responsive crops, have no pseudo-text/marks, and create no horizontal overflow.
- [ ] Verify footer order is Contact, FAQ, Buy on Alibaba, email; links are keyboard reachable; Alibaba CTA is compact; reduced-motion remains stable.
- [ ] Run focused tests, full `npm test`, lint, typecheck, and `git diff --check` on owned paths.
- [ ] Update the agent record, commit, and push only editorial/footer paths. State source-only; `out/` remains with release builder.

Expected: first-wave source is pushed with browser evidence. No production claim occurs before final release build, deployment, Cloudflare purge, and no-query public verification.

---

## Next Plan Boundary

Continue the active goal with separate plans for:

1. 1,485-image HYDE brand repair, exception registry, contact sheets, and full-size review.
2. Remaining catalogue/data, navigation, magnifier, mobile, pagination, AR-4, category/suffix, evidence-boundary, and content work from the main handoff.
3. Final SEO/GEO/static export, committed `out/`, push, production deployment, Cloudflare purge, and no-query public-edge audit.

The active goal is not complete at this boundary.
