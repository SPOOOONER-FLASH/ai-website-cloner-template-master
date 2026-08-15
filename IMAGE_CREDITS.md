# Image Credits

Every image in `public/images/` and where it came from.

---

## Licence

**All images are the client's own material — 甲方自有素材.** Delivered by Canton Hyland on
2026-08-15 as a WeChat asset pack (the same photography used on their Alibaba storefront,
`https://cnhyland.en.alibaba.com/`). No stock library, no third-party licence, no Alibaba
CDN hotlinking — every file is downloaded, converted and served from this repo.

The previous stock photography from Pexels has been **removed**.

Excluded on instruction: Wangwang / sales-contact avatars, prices, MOQ, transaction data,
and any image carrying platform promotional text.

---

## Processing

`scripts/process-client-assets.mjs` converts the pack to WebP.

- Format WebP, quality 78, hard cap 300 KB (largest file is 114 KB — WebP is far more
  efficient than the source JPEGs)
- Cover-crop to each slot's aspect ratio, centre gravity
- **Never upscales.** Several sources are smaller than the slot renders at; inventing
  pixels would hide that. The `scale` column below is output width ÷ CSS display width.

**31 files, 998 KB total.**

---

## Quality assessment

The client asked which images are acceptable and which must be reshot. Verdicts:

### 🔴 Must reshoot / re-export before launch — resolution failure

| File | Output | Scale | Problem |
|---|---|---|---|
| `company/hero-grip-handle-banner.webp` | 772×397 | **0.54×** | Source is only 1024×397. The slot renders 1440 CSS px wide, so the browser upscales ~2×. Visibly soft on any screen, badly so on retina. |
| `company/hero-panic-exit-banner.webp` | 822×397 | **0.57×** | Same source problem. |
| `company/facility-yard.webp` | 1024×683 | **0.71×** | Also looks upscaled or synthetic at source — soft edges, uniform lighting. Worth checking whether an original exists. |
| `company/hero-storefront-banner.webp` | 1236×754 | **0.86×** | 1920×754 source, but the 16:10 hero crop eats the width. |

These four are the site's largest, most prominent images. **Ask the client for the original
full-resolution exports** — the banners were almost certainly composed at a larger size and
downscaled for Alibaba. If originals do not exist, they need reshooting.

### 🟡 Acceptable for the demo, replace in P11

| File group | Output | Scale | Note |
|---|---|---|---|
| `company/press-shop`, `polishing-line`, `assembly-line` | 1308×872 | 0.91× | Genuine factory photography and it reads as real, which is the point. But under 1× for a full-width hero, and the phone-camera look (mixed colour temperature, no styling) sits awkwardly against the minimal layout. Fine at card size, weak at hero size. |
| All 16 `products/*.webp` | 1000×1000 | 1.47× | Clean white-background B2B pack shots. Sharp and correctly exposed. Just under 1.5×, so slightly soft on retina but perfectly usable. |
| `certificates/*.webp` | 604×800 | 1× | Document scans. Legible at reading size, not at full-page zoom. Fine — they are evidence, not decoration. |

### ⚠️ Design conflict, not a resolution problem

**Every product image has the client's own Hyland logo badge burned into the top-left
corner.** It is their own trademark so there is no licensing issue, but on a site whose
whole visual language is flat white space and a single hairline rule, a glossy red-and-
chrome logo lozenge repeated across every card is the loudest thing on the page. It also
duplicates the wordmark already in the header.

Recommend requesting the un-badged originals — same shots, watermark layer off. That is
usually a one-click re-export for whoever produced the pack.

Beyond the badge, the B2B house style (pure white sweep, hard specular highlights, product
floating centred) is a different visual register from the architectural photography this
layout was designed around. Usable now for credibility; **P11 should replace it with styled
product photography on a neutral ground.**

---

## Products — `public/images/products/`

All 1000×1000, cropped 1:1, q=78.

| File | Source file (client pack) | Size |
|---|---|---|
| `305-fire-door-panic-exit-device.webp` | 305 Fire Door Panic Exit Device.jpg | 12.5 KB |
| `309-d-double-door-panic-exit-device.webp` | 309-D Double Door Panic Exit Device.jpg | 6.1 KB |
| `314-alarm-panic-bar-exit-device.webp` | 314 Alarm Panic Bar Exit Device.jpg | 39.6 KB |
| `320-two-point-locking-exit-device.webp` | 320 Two Point Locking Exit Device.jpg | 12.8 KB |
| `lc14-8550-mortise-lock-case.webp` | LC14 85×50 Four Bolt Mortise Lock Case.jpg | 24.0 KB |
| `black-tubular-lever-lock-set.webp` | Black Tubular Lever Lock Set.jpg | 20.0 KB |
| `stainless-steel-lever-handle-lock.webp` | Stainless Steel Lever Handle Lock.jpg | 14.5 KB |
| `ansi-grade-3-keyed-deadbolt.webp` | ANSI Grade 3 Keyed Deadbolt Lock Set.jpg | 14.7 KB |
| `glass-door-patch-fitting-set.webp` | Glass Door Patch Fitting Set.jpg | 26.1 KB |
| `stainless-steel-glass-door-pull-handle.webp` | Stainless Steel Glass Door Pull Handle.jpg | 12.1 KB |
| `600-concealed-sliding-door-handle.webp` | 600 Concealed Sliding Door Handle.jpg | 22.0 KB |
| `tubular-knob-lock.webp` | Tubular Knob Lock.jpg | 17.7 KB |
| `cylindrical-knob-lock.webp` | Cylindrical Knob Lock.jpg | 19.9 KB |
| `night-latch-rim-lock.webp` | Night Latch & Rim Lock.jpg | 25.9 KB |
| `wooden-door-floor-hinge.webp` | Wooden Door Floor Hinges.jpg | 38.4 KB |
| `stainless-steel-door-hinge.webp` | Hinge.jpg | 35.2 KB |
| `cat-panic-exit-device.webp` | Panic Exit Device.jpg | 13.9 KB |
| `cat-lever-handle-lock.webp` | Lever Handle Lock.jpg | 14.7 KB |

## Company — `public/images/company/`

| File | Source | Output | Size |
|---|---|---|---|
| `press-shop.webp` | 公司图 1.jpg | 1308×872 | 75.9 KB |
| `polishing-line.webp` | 公司图 2.jpg | 1308×872 | 91.6 KB |
| `assembly-line.webp` | 公司图 3.jpg | 1308×872 | 113.8 KB |
| `facility-yard.webp` | 公司图 大图.jpg | 1024×683 | 74.5 KB |
| `hero-panic-exit-banner.webp` | 大图一.jpg | 822×397 | 31.8 KB |
| `hero-grip-handle-banner.webp` | 大图二.jpg | 772×397 | 28.8 KB |
| `hero-storefront-banner.webp` | 未标题-1.jpg | 1236×754 | 41.7 KB |
| `hero-designed-for.webp` | Storefront Door Push Pull Handle Lock.jpg | 1000×666 | 26.4 KB |
| `decorative-hinge-detail.webp` | Hinge.jpg | 1000×510 | 27.0 KB |
| `certification-marks.svg` | **drawn for this project** | vector | 1 KB |

`certification-marks.svg` is not client material — it is a monochrome vector mark drawn to
fill the 87:46 signature slot, showing ISO 9001 and ANSI/BHMA Grade 3. Flat, no gradients,
inherits `--color-ink`.

`decorative-hinge-detail.webp` fills the 306:156 slot. The brief asked for a CAD line
drawing; the pack contains none, so a clean hinge close-up stands in. **Flagged in
BUILD_PLAN.md as "replace with CAD line art".**

## Certificates — `public/images/certificates/`

All 604×800, q=78. Transcribed into `src/data/company.ts`.

| File | Document | Covers model |
|---|---|---|
| `intertek-en1125-panic-device.webp` | Intertek EN 1125 test report 130722068GZU-001, 7 Nov 2013 | KD070/30-290 |
| `intertek-en1154-floor-spring.webp` | Intertek EN 1154 test report 151120057GZU-001, 17 Jun 2016 | KD070/20-101 |
| `intertek-tubular-lock-durability.webp` | Intertek durability report 140306043GZU-001, 28 Apr 2014 | 607 SS ET |
| `celab-ce-panic-exit-device.webp` | CELAB CE Certificate of Conformity, EN 1125:2008 | Panic exit device series |

## Unused sources

Available in the client pack, converted but not yet placed: `023 ETAN Anti-Pick Panic Exit
Device`, `317 Cold Room Push Bar Exit Device`, `Stainless Steel Wall Hook`, `Bolt`. Add
them when the catalogue grows past 12 products.
