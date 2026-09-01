# Image Credits and Provenance

This register separates client-supplied factual material, project-created or processed
assets, and AI-generated editorial imagery. Provenance, processing, and permitted use are
recorded by source set; no blanket ownership or processing statement applies to every file
under `public/images/`.

---

## Provenance classes and permitted use

### Client-supplied factual material

Product pack shots, selected company photography, certificate scans, catalogue documents,
and approved brand material described below were supplied by or on behalf of Canton Hyland,
or recovered from the client's own legacy properties. These assets remain distinct from
generated editorial imagery. Product, certificate, factory, and facility claims must be
supported only by the applicable first-party source material and any per-file verification
notes below.

### Project-created and processed assets

Some repository assets are crops, format conversions, or project-created vectors derived
from approved source material. Their processing does not change the provenance of the
source. Project-created graphics must not be described as client-supplied photography or
used on their own as certification evidence.

### AI-generated editorial imagery

The confirmed generated files under `public/images/editorial/` were produced in documented
batches on 2026-08-24 and 2026-08-29 with the built-in ImageGen workflow from text-only
prompts, then processed with Sharp as WebP quality 86. No stock, web, FSB, Canton Hyland,
or other reference images were supplied to those generation workflows.

These files are representative editorial concepts. They are not photographs of completed
Canton Hyland or HYDE projects, actual installations, named buildings, Canton Hyland
facilities, factory operations, manufacturing or inspection processes, branded products,
dimensional evidence, compliance evidence, or certification evidence.

Use these images only for architectural atmosphere, conceptual material studies, or clearly
labelled representative applications. Where a caption or media label is shown, use language
such as “Representative application study” or “Conceptual material study”; do not use “our
project”, “our factory”, “our process”, “completed project”, or a named location.

The generated set was prompted and visually reviewed to exclude people, silhouettes, hands,
faces, human reflections, readable text, logos, watermarks, brands, and certification marks.
This no-people statement applies to the generated editorial set, not automatically to every
archived first-party source stored elsewhere in the repository.

The previous Pexels stock photography was **removed**. The generated editorial set is not
part of the client asset pack delivered on 2026-08-15.

Excluded on instruction from client-derived material: Wangwang / sales-contact avatars,
prices, MOQ, transaction data, and any image carrying platform promotional text.

---

## Processing by source set

### Client asset-pack processing

`scripts/process-client-assets.mjs` converts the original client asset-pack subset to WebP.
The quality, crop, and size statements in the corresponding tables apply only to that
documented subset; they do not apply to generated editorial imagery, later legacy-site
imports, source documents, vectors, or brand masters.

### Generated editorial processing

The twenty confirmed generated editorial sources were converted with the repository Sharp dependency
using `fit: "cover"` and WebP quality 86 at the exact output dimensions listed below. The
original eleven architecture images used attention-aware cover cropping; the exact-ratio
material-library source used standard cover resizing. The industrial and material images used
cover cropping; the corrected `industrial-precision-parts.webp` and the four 2026-08-29
homepage/news images were additionally normalised to opaque sRGB before encoding.

The directory contains 27 WebP files totalling 5,486,764 bytes: 26 confirmed text-only
ImageGen derivatives totalling 5,387,396 bytes, plus `argentina-ar4-entry.webp` (99,368
bytes), whose generation/source note was not preserved with its 2026-08-27 commit and is
therefore kept outside the confirmed inventory below pending provenance confirmation.

### Retouched first-party showroom photography

`hyde-nine-families-showroom-2026.webp` is derived from the client-supplied
`company/showroom-emergency-hardware.webp` photograph. The obsolete illuminated oval
sign was removed with a tightly scoped generative object-removal pass; the photographed
showroom, wall-mounted products, camera perspective, lighting, and product geometry were
kept as the factual source. The derivative was visually reviewed at full size and exported
as opaque 1536×1024 WebP. It is used as a real multi-family showroom context, not as
dimensional, certification, or model-specific evidence.

---

## AI-generated editorial inventory — `public/images/editorial/`

| File | Role | Output | Bytes | Generated | Method |
|---|---|---:|---:|---|---|
| `hero-cultural-entrance.webp` | Architectural editorial | 2400×943 | 119,540 | 2026-08-24 | Built-in ImageGen, text-only; Sharp cover/attention, WebP q=86 |
| `hero-warm-residential-entry.webp` | Architecture / warm threshold | 2400×943 | 265,160 | 2026-08-24 | Built-in ImageGen, text-only; Sharp cover/attention, WebP q=86 |
| `hero-civic-corridor.webp` | Architectural editorial | 2400×943 | 109,892 | 2026-08-24 | Built-in ImageGen, text-only; Sharp cover/attention, WebP q=86 |
| `home-commercial-egress.webp` | Architectural editorial | 2400×1159 | 243,648 | 2026-08-24 | Built-in ImageGen, text-only; Sharp cover/attention, WebP q=86 |
| `home-design-context.webp` | Architecture / material junctions | 1800×1200 | 253,806 | 2026-08-24 | Built-in ImageGen, text-only; Sharp cover/attention, WebP q=86 |
| `home-editorial-insight.webp` | Architectural light / material study | 2400×1464 | 185,346 | 2026-08-24 | Built-in ImageGen, text-only; Sharp cover/attention, WebP q=86 |
| `home-material-library.webp` | Architectural material-library study | 1800×1200 | 190,206 | 2026-08-24 | Built-in ImageGen, text-only; Sharp exact-ratio cover, opaque sRGB, WebP q=86 |
| `home-panic-exit-bars.webp` | Representative commercial panic-exit application | 2400×943 | 160,580 | 2026-08-29 | Built-in ImageGen, text-only; Sharp cover, opaque sRGB, WebP q=86 |
| `hyde-source-by-range-2026.webp` | Coordinated hardware range / sample-kit editorial | 1254×1254 | 347,888 | 2026-08-31 | Built-in ImageGen, text-only; first-party HYDE product geometry used as visual reference; final edit removed keys and pseudo-engraving; Sharp square crop, WebP q=86 |
| `hyde-source-by-project-2026.webp` | Project schedule and finish-board editorial | 1254×1254 | 136,120 | 2026-08-31 | Built-in ImageGen, text-only; first-party HYDE product geometry used as visual reference; blank non-readable schedule; Sharp square crop, WebP q=86 |
| `hyde-nine-families-2026.webp` | Nine-family coordinated hardware board | 1536×1024 | 175,700 | 2026-08-31 | Built-in ImageGen, text-only; first-party HYDE product geometry used as visual reference; no model or specification claims; Sharp WebP q=86 |
| `hyde-materials-engineering-2026.webp` | Material samples and hardware engineering workbench | 1536×1024 | 180,134 | 2026-08-31 | Built-in ImageGen, text-only; first-party HYDE product geometry used as visual reference; no manufacturing-process claim; Sharp WebP q=86 |
| `hyde-engineering-contact-2026.webp` | Buyer requirements and engineering review still life | 1254×1254 | 237,420 | 2026-08-31 | Built-in ImageGen, text-only; first-party HYDE product geometry used as visual reference; final edit removed keys and pseudo-engraving; Sharp square crop, WebP q=86 |
| `hyde-installation-faq-2026.webp` | Exploded installation-components editorial | 1254×1254 | 172,498 | 2026-08-31 | Built-in ImageGen, text-only; first-party HYDE product geometry used as visual reference; no dimensions, standards, or certification claims; Sharp square crop, WebP q=86 |
| `project-commercial-egress.webp` | Representative application concept | 1800×1200 | 205,920 | 2026-08-24 | Built-in ImageGen, text-only; Sharp cover/attention, WebP q=86 |
| `project-glass-entrance.webp` | Representative application concept | 1800×1200 | 167,582 | 2026-08-24 | Built-in ImageGen, text-only; Sharp cover/attention, WebP q=86 |
| `project-hospitality-residential.webp` | Warm interior / representative application | 1800×1200 | 113,086 | 2026-08-24 | Built-in ImageGen, text-only; Sharp cover/attention, WebP q=86 |
| `architecture-boutique-hotel.webp` | Warm interior / architectural detail | 1800×1200 | 260,270 | 2026-08-24 | Built-in ImageGen, text-only; Sharp cover/attention, WebP q=86 |
| `architecture-coastal-residence.webp` | Architectural editorial | 1800×1200 | 272,070 | 2026-08-24 | Built-in ImageGen, text-only; Sharp cover/attention, WebP q=86 |
| `industrial-precision-parts.webp` | Industrial / material still life | 1800×1200 | 204,458 | 2026-08-24 | Built-in ImageGen, text-only; one QA replacement; Sharp cover, opaque sRGB, WebP q=86 |
| `material-brushed-steel.webp` | Material macro | 1600×1600 | 179,238 | 2026-08-24 | Built-in ImageGen, text-only; Sharp cover, WebP q=86 |
| `material-bronze-patina.webp` | Material macro | 1600×1600 | 391,848 | 2026-08-24 | Built-in ImageGen, text-only; Sharp cover, WebP q=86 |
| `material-metal-stone-detail.webp` | Architectural material junction | 1600×1600 | 176,074 | 2026-08-24 | Built-in ImageGen, text-only; Sharp cover, WebP q=86 |
| `news-door-schedule-doors.webp` | Representative coordinated door-schedule study | 2400×943 | 83,564 | 2026-08-29 | Built-in ImageGen, text-only; Sharp cover, opaque sRGB, WebP q=86 |
| `news-finish-function-library.webp` | Representative finish and function library | 1800×1200 | 334,320 | 2026-08-29 | Built-in ImageGen, text-only; Sharp cover, opaque sRGB, WebP q=86 |
| `news-mortise-lock-inspection.webp` | Representative mortise-lock dimensional study | 1800×1200 | 221,028 | 2026-08-29 | Built-in ImageGen, text-only; Sharp cover, opaque sRGB, WebP q=86 |

Visual QA of the final WebP files found no visible people, silhouettes, hands, faces, distant
figures, or human reflections, and no readable text, logo, watermark, or brand mark. This
review does not convert the images into factual project or manufacturing evidence; the
representative-use restrictions above remain mandatory.

---

## Quality assessment

The client asked which images are acceptable and which must be reshot. Verdicts:

### 🔴 Must reshoot / re-export before launch — resolution failure

| File | Output | Scale | Problem |
|---|---|---|---|
| `company/hero-grip-handle-banner.webp` | 772×397 | **Superseded** | Replaced in the public Products index by the 2017×780 versioned editorial asset below. The original remains documented for provenance. |
| `company/hero-panic-exit-banner.webp` | 822×397 | **Superseded** | Replaced in the public Products index by the 2016×780 versioned editorial asset below. The original remains documented for provenance. |
| `company/facility-yard.webp` | 1024×683 | **0.71×** | Also looks upscaled or synthetic at source — soft edges, uniform lighting. Worth checking whether an original exists. |
| `company/hero-storefront-banner.webp` | 1236×754 | **0.86×** | 1920×754 source, but the 16:10 hero crop eats the width. |

These four are the site's largest, most prominent images. **Ask the client for the original
full-resolution exports** — the banners were almost certainly composed at a larger size and
downscaled for Alibaba. If originals do not exist, they need reshooting.

### 🟡 Acceptable for the demo, replace in P11

| File group | Output | Scale | Note |
|---|---|---|---|
| `company/press-shop`, `polishing-line`, `assembly-line` | 1308×872 | 0.91× | Genuine factory photography and it reads as real, which is the point. But under 1× for a full-width hero, and the phone-camera look (mixed colour temperature, no styling) sits awkwardly against the minimal layout. Fine at card size, weak at hero size. |
| Original 22-image product prototype subset | 1000×1000 | 1.47× | 20 catalogue products plus 2 category images from the first prototype set. Clean white-background B2B pack shots, sharp and correctly exposed. Just under 1.5×, so slightly soft on retina but usable for the demo. This is not an inventory of later legacy-site imports. |
| `certificates/*.webp` | 604×800 | 1× | Document scans. Legible at reading size, not at full-page zoom. Fine — they are evidence, not decoration. |

### ⚠️ Design conflict, not a resolution problem

**Every product image in the original 22-image prototype subset has the client's own Hyland
logo badge burned into the top-left corner.** It is their own trademark so there is no
licensing issue, but on a site whose
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

## Original product prototype subset — `public/images/products/`

The following 22 rows document the original prototype subset only, not the complete current
contents of `public/images/products/`. These listed files are 1000×1000, cropped 1:1, q=78.

| File | Source file (client pack) | Size |
|---|---|---|
| `305-fire-door-panic-exit-device.webp` | 305 Fire Door Panic Exit Device.jpg | 12.5 KB |
| `309-d-double-door-panic-exit-device.webp` | 309-D Double Door Panic Exit Device.jpg | 6.1 KB |
| `314-alarm-panic-bar-exit-device.webp` | 314 Alarm Panic Bar Exit Device.jpg | 39.6 KB |
| `320-two-point-locking-exit-device.webp` | 320 Two Point Locking Exit Device.jpg | 12.8 KB |
| `023-etan-anti-pick-panic-exit-device.webp` | 023 ETAN Anti-Pick Panic Exit Device.jpg | 15.9 KB |
| `317-cold-room-push-bar-exit-device.webp` | 317 Cold Room Push Bar Exit Device.jpg | 20.8 KB |
| `lc14-8550-mortise-lock-case.webp` | LC14 85×50 Four Bolt Mortise Lock Case.jpg | 24.0 KB |
| `black-tubular-lever-lock-set.webp` | Black Tubular Lever Lock Set.jpg | 20.0 KB |
| `stainless-steel-lever-handle-lock.webp` | Stainless Steel Lever Handle Lock.jpg | 14.5 KB |
| `ansi-grade-3-keyed-deadbolt.webp` | ANSI Grade 3 Keyed Deadbolt Lock Set.jpg | 14.7 KB |
| `glass-door-patch-fitting-set.webp` | Glass Door Patch Fitting Set.jpg | 26.1 KB |
| `stainless-steel-glass-door-pull-handle.webp` | Stainless Steel Glass Door Pull Handle.jpg | 12.1 KB |
| `600-concealed-sliding-door-handle.webp` | 600 Concealed Sliding Door Handle.jpg | 22.0 KB |
| `stainless-steel-wall-hook.webp` | Stainless Steel Wall Hook.jpg | 11.5 KB |
| `tubular-knob-lock.webp` | Tubular Knob Lock.jpg | 17.7 KB |
| `cylindrical-knob-lock.webp` | Cylindrical Knob Lock.jpg | 19.9 KB |
| `night-latch-rim-lock.webp` | Night Latch & Rim Lock.jpg | 25.9 KB |
| `stainless-steel-flush-bolt.webp` | Bolt.jpg | 40.0 KB |
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
| `hero-panic-exit-banner-v2.webp` | AI-generated architectural editorial study; Codex built-in image generation, 2026-08-30; no external source asset | 2016×780 | 150.7 KB |
| `hero-grip-handle-banner-v2.webp` | AI-generated architectural editorial study; Codex built-in image generation, 2026-08-30; no external source asset | 2017×780 | 117.9 KB |
| `hero-storefront-banner.webp` | 未标题-1.jpg | 1236×754 | 41.7 KB |
| `hero-designed-for.webp` | Storefront Door Push Pull Handle Lock.jpg | 1000×666 | 26.4 KB |
| `hero-modern-tubular-lock.webp` | 未标题-1.jpg | 1920×754 | 59.3 KB |
| `decorative-hinge-detail.webp` | Hinge.jpg | 1000×510 | 27.0 KB |
| `certification-marks.svg` | **drawn for this project** | vector | 1 KB |

The two versioned Products-index banners are representative visual studies, not evidence of
a completed HYDE project or a specific manufactured model. They were generated as two unique
scenes: a timber-and-glass commercial exit fitted with clearly readable panic bars, and a
separate warm-oak threshold fitted with one brushed-stainless lever set. Neither image contains
people, readable signs, third-party logos or copied source material.

### 2026-08 client-supplied factory / showroom set

Source for every file below: **client-owned material supplied directly for the prototype**.
WebP q=78, centre-cropped to 3:2, each under 300 KB. These files are technically suitable
for the demo, but their highly polished / composited appearance and embedded Hyland signage
must be confirmed by the client as faithful documentary photography before public launch.
They remain archived for client review, but the public homepage and Company routes do not
reference them; those surfaces use clearly identified representative editorial studies instead.

| File | Source file | Output | Size | P11 verdict |
|---|---|---|---|---|
| `factory-polishing-workshop.webp` | e60a1601…png | 1776×1184 | 223.7 KB | Accept for demo; verify authenticity |
| `factory-assembly-quality-line.webp` | f0315c17…png | 1776×1184 | 234.6 KB | Accept for demo; verify authenticity |
| `factory-cnc-production.webp` | 63633323…png | 1776×1184 | 110.7 KB | Accept for demo; verify authenticity |
| `factory-cnc-machining.webp` | 423b1423…png | 1776×1184 | 193.6 KB | Accept for demo; verify authenticity |
| `showroom-product-gallery.webp` | ef4f1112…png | 1776×1184 | 135.3 KB | Accept for demo; verify authenticity |
| `showroom-emergency-hardware.webp` | ba72e861…png | 2390×1593 | 177.4 KB | Accept for demo; strongest documentary image |
| `material-innovation-workshop.webp` | 60d70746…png | 1776×1184 | 148.7 KB | Internal demo only; verify sign and facility accuracy |
| `factory-polishing-workshop-wide.webp` | cdc07db…png | 1776×1184 | 223.7 KB | Internal demo alternate; duplicate scene |

The client approved both previously excluded files for this internal management prototype.
`cdc07db…png` repeats the polishing-workshop scene; `60d70746…png` contains the wording
“HYDE MATERIAL INNOVATION CENTER”. Neither should be published until the imagery and
facility identity have been confirmed as accurate.

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

## Catalogue — `public/downloads/`

| File | Source | Use |
|---|---|---|
| `canton-hyland-product-catalogue-2026.pdf` | 甲方自有 46 页产品目录（本次会话提供） | Contact-page catalogue download; original PDF retained without modification |

## Brand — `public/images/brand/`

| File | Source | Use |
|---|---|---|
| `canton-hyland-logo-source.png` | 甲方自有 Logo 源图（本次会话提供；与 cantonlock.com 页眉素材一致） | Archived source strip |
| `hyland-mark.png` | Exact crop of the client source via `scripts/process-brand-logo.mjs` | Header emblem paired with a live Archivo wordmark |
| `hyde/hyde-logo-stacked-black-1600.png` | Approved HYDE stacked raster master supplied directly for this project; copied byte-for-byte into the repository on 2026-08-24 | Archival/reference raster; not AI-generated; 1600×1322 RGBA PNG with transparency, 25,100 bytes; SHA-256 `91B6D85E8F4AB8F8FC3E4FDAB6576E298C5BFC4080F75BB4AD9BBB88571D94EE` |

## Unused sources

No remaining product JPEGs in the supplied pack are unaccounted for. Contact avatars,
video-platform material and the temporary Word lock file remain intentionally excluded.
