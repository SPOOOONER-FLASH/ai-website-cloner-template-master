# Artifact Manifest — www.fsb.de/en/ → Canton Hyland prototype

- **Source URL:** https://www.fsb.de/en/
- **Destination route:** `/` (`src/app/page.tsx`)
- **site-key:** `www-fsb-de-bf263c85` · **page-key:** `en-7a4ba3ba`
- **Scope:** desktop visual prototype, internal evaluation only. Not for publication or deployment.
- **Reference viewport:** 1512 × 900 (scrollbar-less content width 1497px)

## Routes

| Source | Destination | Note |
|---|---|---|
| `https://www.fsb.de/en/` | `/` | Replaced the untouched template scaffold at `src/app/page.tsx` |

No pre-existing cloned or user-authored route was modified — the project contained only the
template placeholder.

## Assets downloaded: **none**

Per the client brief, **no image, video, font file, icon or logo was fetched from the target.**
The Atlas Cloud generated-asset fallback was **not** used and was not needed.

Every visual slot renders as a `MediaPlaceholder`: a flat `#E7E7E7` block at the original
aspect ratio, labelled with its role and ratio.

| Slot | Original ratio | Placeholder label | Used by |
|---|---|---|---|
| Hero 1 media | `2880 / 1391` | `工程实景 2880:1391` | hero1 |
| Hero 2 media | `2880 / 1481` | `产品图 2880:1481` | hero2 |
| Hero 4 media | `2880 / 1920` | `工程实景 3:2` | hero4 |
| Hero 5 media | `2880 / 1757` | `人物访谈 2880:1757` | hero5 |
| Hero 3 media | `1940 / 1293` → rendered `970 / 646` | `产品图 3:2` | hero3 (side variant) |
| Teaser cards ×6 | `1 / 1` | `产品图 1:1` / `工程实景 1:1` | teaser1–3 |
| Welcome graphic | `306 / 156` | `装饰图形 306:156` | WelcomeIntro |
| Welcome signature | `87 / 46` | `签名图形 87:46` | WelcomeIntro |

Hero 3 uses the target's *rendered* box (970 × 646) rather than the 2× source's intrinsic
`1940 / 1293`. The target floors the resulting half-pixel; matching the rendered box keeps the
module height exact. The two ratios differ by 0.08%.

## Substitutions applied

| # | Brief item | Implementation |
|---|---|---|
| 1 | Font | Archivo 400/600/700 via `https://fonts.googleapis.com/css2` in `src/app/layout.tsx`. **Trade Gothic Next LT Pro and Traffic were not downloaded.** Both roles (body and H1 display) map to Archivo. |
| 2 | Copy | All visible text is Canton Hyland placeholder content in `content.ts` + `WelcomeIntro.tsx`, calibrated so every block renders at the target's measured line count. |
| 3 | Imagery | `MediaPlaceholder` everywhere; no asset fetched. |
| 4 | Accent | `--c-highlight` `244 255 113` → `26 26 26`; `--color-highlight: #1A1A1A`. Black-and-white base unchanged. |
| 5 | Breakpoints | 393 / 640 / 744 / 820 / 1032 / 1376 / 1512 — these are the target's own breakpoints; Tailwind's defaults are cleared with `--breakpoint-*: initial`. |

### Trademark note
The FSB wordmark SVG is a registered trademark and was **not** copied. It is replaced by a text
wordmark rendering "Canton Hyland" in Archivo 700. The header's globe / search / menu icons were
redrawn from scratch, not traced.

## Files created

### Research (5 documents, 4 component spec files covering 9 components)
```
docs/research/www-fsb-de-bf263c85/en-7a4ba3ba/
  DESIGN_TOKENS.md
  PAGE_TOPOLOGY.md
  BEHAVIORS.md
  ARTIFACT_MANIFEST.md
  VISUAL_QA.md
  components/
    site-header.spec.md
    site-footer.spec.md
    hero-module.spec.md
    page-teaser-module.spec.md
    welcome-intro.spec.md
    text-module-spacer-arrowlink.spec.md
```

### Components (10 files)
```
src/components/sites/www-fsb-de-bf263c85/
  shared/
    icons.tsx              ArrowRightIcon, ChevronDownIcon, GlobeIcon, SearchIcon, MenuIcon, Wordmark
    ArrowLink.tsx
    MediaPlaceholder.tsx
  en-7a4ba3ba/
    SiteHeader.tsx
    SiteFooter.tsx
    HeroModule.tsx         variants "stacked" and "side"
    PageTeaserModule.tsx
    TextModule.tsx
    WelcomeIntro.tsx       "use client" — the mobile-only accordion
    Spacer.tsx
    content.ts             placeholder copy + spacer height table
```

### Foundation
```
src/app/globals.css        design tokens, layout grid, type utilities, custom breakpoints
src/app/layout.tsx         Archivo CDN link, 62.5% root, metadata (noindex)
src/app/page.tsx           page assembly
src/types/fsb-modules.ts   module content interfaces
.claude/launch.json        dev-server config for the preview tooling
```

## Screenshots: **none captured**

The browser pane was not displayed in this session, so `computer{action:"screenshot"}` could not
composite frames. Extraction and QA were done entirely through `getComputedStyle()` and
`getBoundingClientRect()` against the live target and the running clone — a stricter check than
pixel comparison, since it compares exact numbers rather than rendered images. See VISUAL_QA.md.

`docs/design-references/www-fsb-de-bf263c85/en-7a4ba3ba/` was created but is empty.
