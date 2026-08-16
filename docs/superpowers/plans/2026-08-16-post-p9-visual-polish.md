# Post-P9 Visual Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the completed P9 responsive site by removing the global promo strip, correcting header alignment, replacing the homepage hinge visual, adding a restrained three-slide hero carousel, and placing all nine approved concept images without changing P10/P11 completion status.

**Architecture:** Keep the current App Router, static export, shared site chrome, data-driven home modules, and product/project data structures. Add one focused client carousel component, one isolated concept-asset processing script, and surgical data/CSS updates. Concept images remain local static assets and are explicitly identified as representative AI-assisted visuals rather than real customer projects.

**Tech Stack:** Next.js 16.3, React 19, TypeScript strict, Tailwind CSS v4, Archivo, Sharp, static export.

## Global Constraints

- Preserve `output: "export"`, noindex, the 24-column grid, 42px gutters, 1376px content band, and breakpoints 393/640/744/820/1032/1376/1512px.
- Use only black, white, gray, and the existing brand-red variables. Red remains limited to clickable/current states.
- Do not add gradients, shadows, glass effects, or rounded cards beyond 0–2px.
- Do not introduce a UI library, animation dependency, or carousel package.
- Keep English and Spanish routes behaviorally equivalent.
- Do not present AI-assisted visuals as photographed Hyland installations or named customer projects.
- Do not mark P10 or P11 complete.

---

## File Map

**Create**

- `scripts/process-concept-assets.mjs` — optimize the nine approved PNG files into local WebP assets.
- `src/components/site/HeroCarousel.tsx` — accessible, dependency-free homepage hero carousel.
- `public/images/concepts/*.webp` — nine processed concept visuals.

**Modify**

- `src/app/page.tsx` — use the English carousel for the first homepage hero.
- `src/app/es/page.tsx` — use the Spanish carousel for the first homepage hero.
- `src/components/site/SiteHeader.tsx` — remove the top promo strip and align compact navigation controls.
- `src/components/site/WelcomeIntro.tsx` — replace the hinge photograph with a restrained Hyland logo presentation.
- `src/data/home.ts` — define English carousel slides.
- `src/data/home-es.ts` — define Spanish carousel slides.
- `src/data/products.ts` — add approved application visuals to matching product galleries.
- `src/data/projects.ts` — add approved representative application visuals to matching project galleries.
- `src/types/fsb-modules.ts` — define the carousel slide contract if the current module types do not already cover it.
- `src/app/globals.css` — add restrained motion and reduced-motion behavior.
- `IMAGE_CREDITS.md` — document all nine user-provided AI-assisted concept visuals.
- `PROGRESS.md` — record the post-P9 polish without advancing P10/P11.

## Task 1: Establish a clean baseline

- [ ] Run `git status --short` and verify there are no unexpected user changes before editing.
- [ ] Run `git log --oneline -3` and confirm `bb89a8f Document post-P9 visual polish design` is the current design baseline.
- [ ] Run `npm run typecheck` to confirm the existing code compiles before this work.
- [ ] If the baseline is not clean or typecheck already fails, stop and record the exact pre-existing state rather than folding unrelated fixes into this task.

## Task 2: Process the nine approved concept images

- [ ] Create `scripts/process-concept-assets.mjs` using the existing Sharp-based compression pattern from `scripts/process-client-assets.mjs`.
- [ ] Encode with WebP quality starting at 78, reducing only as needed to keep every output at or below 300KB; do not upscale source images.
- [ ] Preserve the source composition instead of forcing portrait images into destructive square crops. Layout components will control visible framing with `object-fit`.
- [ ] Use this exact source-to-output mapping:

| Source file in `C:/Users/johns/Downloads/` | Output in `public/images/concepts/` | Intended placement |
| --- | --- | --- |
| `Gemini_Generated_Image_z58n53z58n53z58n.png` | `hero-panic-exit-device.webp` | Homepage carousel slide 2 |
| `Gemini_Generated_Image_eghjtoeghjtoeghj.png` | `hero-heavy-duty-fire-door-lock.webp` | Homepage carousel slide 3 |
| `Gemini_Generated_Image_l5tfetl5tfetl5tf.png` | `deadbolt-application.webp` | Deadbolt product gallery |
| `Gemini_Generated_Image_efkxkqefkxkqefkx.png` | `panic-exit-application.webp` | Panic-exit product gallery |
| `Gemini_Generated_Image_74dbcl74dbcl74db.png` | `glass-patch-fitting-application.webp` | Glass patch fitting product gallery |
| `Gemini_Generated_Image_t2at4et2at4et2at.png` | `lever-handle-application.webp` | Lever handle product gallery |
| `Gemini_Generated_Image_oemunioemunioemu.png` | `smart-lock-residential-application.webp` | Hospitality/residential representative application |
| `Gemini_Generated_Image_r07m2or07m2or07m.png` | `double-door-coordinator-application.webp` | Commercial fire-egress representative application |
| `Gemini_Generated_Image_p0q80ap0q80ap0q8.png` | `commercial-panic-exit-application.webp` | Commercial fire-egress representative application |

- [ ] Run `node scripts/process-concept-assets.mjs`.
- [ ] Verify all files exist with:

  ```powershell
  Get-ChildItem -LiteralPath public/images/concepts -Filter *.webp |
    Select-Object Name, Length, LastWriteTime
  ```

- [ ] Verify the size ceiling with:

  ```powershell
  Get-ChildItem -LiteralPath public/images/concepts -Filter *.webp |
    Where-Object Length -gt 307200
  ```

  Expected result: no output.

## Task 3: Define bilingual carousel data

- [ ] In `src/types/fsb-modules.ts`, add the smallest shared type needed by the carousel:

  ```ts
  export interface HeroCarouselSlide {
    id: string;
    image: ImageRef;
    href: string;
    ariaLabel: string;
    title?: string;
    body?: string;
    linkLabel?: string;
    embeddedCopy?: boolean;
  }
  ```

- [ ] In `src/data/home.ts`, export `heroCarouselSlides` with exactly three entries:
  1. Existing Modern Tubular Door Lock hero, retaining its current title/body/link.
  2. `/images/concepts/hero-panic-exit-device.webp`, linking to the most relevant panic-exit product route, with `embeddedCopy: true` so the embedded artwork copy is not duplicated.
  3. `/images/concepts/hero-heavy-duty-fire-door-lock.webp`, linking to the most relevant fire-door/panic product route, with `embeddedCopy: true`.
- [ ] In `src/data/home-es.ts`, export the same three slides and routes with Spanish accessibility labels; retain Spanish visible copy only on slide 1 because slides 2–3 already contain English copy inside the supplied artwork.
- [ ] Keep the current `content.hero1` exports intact until both pages have been migrated, avoiding unrelated module rewrites.
- [ ] Run `npm run typecheck`.

## Task 4: Build the accessible hero carousel

- [ ] Create `src/components/site/HeroCarousel.tsx` as a focused `'use client'` component accepting `slides: HeroCarouselSlide[]`.
- [ ] Implement these behaviors without a third-party package:
  - 6-second autoplay.
  - Fade plus a subtle 8–12px translation; no scale animation or parallax.
  - Previous/next buttons and current-slide dots.
  - Pause while hovered, keyboard-focused, or the page is hidden.
  - Left/right arrow-key navigation when focus is within the carousel.
  - Basic horizontal swipe using pointer start/end positions.
  - `aria-roledescription="carousel"`, an announced slide position, and descriptive button labels.
  - Respect `prefers-reduced-motion: reduce` by disabling autoplay and transition movement.
- [ ] Keep each slide's main content/link structure visually consistent with the existing stacked `HeroModule`; slides with `embeddedCopy: true` should show only the supplied artwork plus navigation controls.
- [ ] Use the brand red only for clickable hover/focus states and the current dot. Default controls remain black/white/gray.
- [ ] Give controls at least a 44×44px target without adding shadows or pill styling.
- [ ] In `src/app/page.tsx`, replace only the first `HeroModule content={content.hero1}` call with `<HeroCarousel slides={heroCarouselSlides} />`.
- [ ] Apply the equivalent change in `src/app/es/page.tsx` using the Spanish slide data.
- [ ] Run `npm run lint` and `npm run typecheck`.

## Task 5: Remove the promo strip and align navigation controls

- [ ] In `src/components/site/SiteHeader.tsx`, delete only the global black promo strip that renders `Project Planner`; keep any legitimate Project Planner link inside page content.
- [ ] Remove imports/constants that become unused because of that deletion.
- [ ] Change the sticky header offset to `top: 0` and remove dependence on the deleted banner-height variable.
- [ ] Replace the mobile control wrapper with a single aligned row/grid whose three groups are:
  1. `EN | ES`
  2. Search button
  3. Menu button
- [ ] Normalize those controls to the same vertical center, line-height, icon box, and minimum 44px interaction height at 393/640/744/820px.
- [ ] Preserve current desktop navigation and existing drawer/search behavior; do not add a new search implementation.
- [ ] Verify keyboard focus remains visible and uses the existing brand focus color.
- [ ] Run `npm run lint` and `npm run typecheck`.

## Task 6: Replace the homepage hinge visual with the Hyland identity

- [ ] In `src/components/site/WelcomeIntro.tsx`, replace `/images/company/decorative-hinge-detail.webp` with a flat logo presentation using the existing local brand assets in `public/images/brand/`.
- [ ] Prefer `/images/brand/hyland-mark.png` with a text wordmark beside it, or reuse the existing `Wordmark` component if that produces a cleaner responsive result.
- [ ] Keep the existing grid footprint and whitespace rhythm; use a simple white or `--color-surface-alt` field with a `--color-line` divider only.
- [ ] Do not add a logo glow, metallic frame, shadow, gradient, or decorative red background.
- [ ] Verify the brand lockup does not clip at 393px and does not dominate the 1512px layout.
- [ ] Run `npm run typecheck`.

## Task 7: Place the seven remaining concept visuals in truthful slots

- [ ] Update only the matching entries in `src/data/products.ts`:
  - Deadbolt product gallery → `/images/concepts/deadbolt-application.webp`.
  - Panic-exit product gallery → `/images/concepts/panic-exit-application.webp`.
  - Glass patch fitting product gallery → `/images/concepts/glass-patch-fitting-application.webp`.
  - Stainless steel lever handle product gallery → `/images/concepts/lever-handle-application.webp`.
- [ ] Use concise labels that identify these as representative application visuals, not field photography. Example:

  ```ts
  label: "AI-assisted representative application visual; not a completed client project"
  ```

- [ ] Update only the matching entries in `src/data/projects.ts`:
  - Commercial fire-egress application → `commercial-panic-exit-application.webp` and `double-door-coordinator-application.webp`.
  - Hospitality/residential application → `smart-lock-residential-application.webp`.
- [ ] Preserve every existing `referenceStatus` disclaimer and strengthen it only if needed to keep the AI-assisted status explicit.
- [ ] Do not create fake customer names, locations, dates, or project claims.
- [ ] Run `npm run typecheck`.

## Task 8: Add restrained, consistent motion

- [ ] In `src/app/globals.css`, consolidate interaction motion around 180–240ms for links, buttons, header controls, drawer/search surfaces, carousel controls, and image hover states.
- [ ] Use only opacity, color, border-color, and small transforms. Avoid layout-property animation, blur, bounce, large zoom, and infinite decorative animation.
- [ ] Add a global reduced-motion guard:

  ```css
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      scroll-behavior: auto !important;
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```

- [ ] Confirm motion does not introduce shadows, gradients, or decorative red.
- [ ] Run `npm run lint` and `npm run typecheck`.

## Task 9: Document provenance and progress

- [ ] Add a new table to `IMAGE_CREDITS.md` listing all nine WebP files with source type `甲方提供的 AI 概念样稿` and the exact intended slot.
- [ ] State clearly that these are approved internal prototype visuals, not proof of real installations or customer projects, and must be reviewed/replaced during P11 if used for a public launch.
- [ ] Update `PROGRESS.md`:
  - Keep P9 marked complete.
  - Add a dated “Post-P9 visual polish” completed line naming the carousel, header, logo replacement, concept assets, and key files.
  - Keep P10 as the next formal stage.
  - Add the concept-image truthfulness/review risk under known issues.
- [ ] Do not change the stage list in `BUILD_PLAN.md` unless implementation uncovers a direct contradiction with the approved design specification.

## Task 10: Full verification and browser acceptance

- [ ] Run the complete project check:

  ```powershell
  npm run check
  ```

- [ ] Confirm static export still creates `out/index.html` and `out/es/index.html`.
- [ ] Start the dev server on the required tunnel port:

  ```powershell
  npm run dev -- -p 3001
  ```

- [ ] Inspect these routes in English and Spanish where available:
  - `/`
  - `/es/`
  - `/products/`
  - The four modified product detail routes.
  - The two modified representative project routes.
- [ ] At widths 393, 640, 744, 820, 1032, 1376, and 1512px verify:
  - No horizontal overflow.
  - Header language/search/menu controls share one center line.
  - No top `Project Planner` strip remains.
  - Carousel controls remain reachable and do not cover embedded artwork copy.
  - Carousel pauses and resumes correctly.
  - Reduced-motion mode disables autoplay/movement.
  - Logo presentation does not clip or stretch.
  - Concept images load locally with no broken references.
  - No hydration, console, or image 404 errors.
- [ ] Submit the contact form only if the existing test path is configured not to send an unintended real inquiry; otherwise verify its structure without external submission.

## Task 11: Final diff review and commit

- [ ] Run `git diff --check`.
- [ ] Run `git status --short` and confirm every changed file traces to this approved scope.
- [ ] Search for accidental placeholder or unsupported project claims:

  ```powershell
  rg -n "Lorem|placeholder|real client|completed project|customer project" src IMAGE_CREDITS.md PROGRESS.md
  ```

- [ ] Confirm no concept image exceeds 300KB and all nine are referenced exactly once or in their approved slots.
- [ ] Run `npm run build` one final time after documentation changes.
- [ ] Stage and commit:

  ```powershell
  git add -A
  git commit -m "Polish post-P9 visuals and homepage carousel"
  ```

- [ ] Report the commit hash, modified/generated files, exact image placements, build result, and any remaining decisions. Stop without starting P10.

## Plan Self-Review Checklist

- [ ] All approved items are covered: strip removal, logo replacement, header alignment, smooth motion, carousel choice C, and all nine images.
- [ ] English and Spanish routes are both covered.
- [ ] Static export, noindex, brand-color rules, and custom breakpoints remain intact.
- [ ] No P10/P11 work is falsely marked complete.
- [ ] No fake customer/project facts are introduced.
- [ ] Every task includes a concrete verification step.
