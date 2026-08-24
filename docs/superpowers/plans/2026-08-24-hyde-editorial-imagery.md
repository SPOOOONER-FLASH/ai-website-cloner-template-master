# HYDE Editorial Imagery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate and integrate an original, people-free editorial image system that shifts the Canton Hyland site toward architecture, materials, and calm industrial credibility.

**Architecture:** New generated assets live in a dedicated `public/images/editorial/` namespace so existing first-party and technical imagery remains recoverable. Homepage and representative-project data files are remapped to the new assets. Because the polished factory/showroom set still needs documentary-authenticity confirmation, public Company surfaces use clearly disclosed architectural/material studies while factual profile, statistics, and certificate evidence remain separate.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, static JSON content, built-in ImageGen, Sharp, npm verification scripts.

**Spec:** `docs/superpowers/specs/2026-08-24-hyde-editorial-imagery-design.md`

## Global Constraints

- Approved mix: 60% architectural editorial, 25% industrial/material, 15% warm interiors.
- No people in newly generated images, including silhouettes, reflections, hands, crowds, or distant figures.
- No text, letters, logos, watermarks, signage, project names, certification marks, or third-party brands in generated images.
- Do not imitate a specific FSB photograph, building, photographer, or composition.
- Do not use generated images as technical product evidence or as factual Canton Hyland factory documentation.
- Preserve existing source assets; create new files under `public/images/editorial/`.
- Keep the current official HYDE SVG logo in site navigation and structured data.
- English and Spanish content must reference the same new image files with localized alt text.

---

### Task 1: Establish the editorial asset namespace and brand reference

**Files:**
- Create: `public/images/editorial/*.webp`
- Create: `public/images/brand/hyde/hyde-logo-stacked-black-1600.png`
- Reference: `public/images/brand/hyde/hyde-logo-stacked-black.svg`

**Interfaces:**
- Consumes: approved raster logo at `C:/Users/johns/Documents/Codex/2026-08-23/wu-j/outputs/hyde-brand-kit-v1/hyde-brand-kit/hyde-logo-stacked-black-1600.png`
- Produces: stable `/images/editorial/<slug>.webp` URLs for homepage and project content

- [ ] **Step 1: Confirm the repository is clean and the supplied raster logo has alpha**

Run:

```powershell
git status --short
node -e "const sharp=require('sharp');sharp('C:/Users/johns/Documents/Codex/2026-08-23/wu-j/outputs/hyde-brand-kit-v1/hyde-brand-kit/hyde-logo-stacked-black-1600.png').metadata().then(console.log)"
```

Expected: no Git status entries; metadata reports `channels: 4` and `hasAlpha: true`.

- [ ] **Step 2: Copy the approved raster logo without changing site logo references**

Run:

```powershell
Copy-Item -LiteralPath 'C:/Users/johns/Documents/Codex/2026-08-23/wu-j/outputs/hyde-brand-kit-v1/hyde-brand-kit/hyde-logo-stacked-black-1600.png' -Destination 'public/images/brand/hyde/hyde-logo-stacked-black-1600.png'
```

Expected: the raster master is present, while `src/components/site/icons.tsx` still references official horizontal SVG variants.

- [ ] **Step 3: Create the editorial output directory**

Run:

```powershell
New-Item -ItemType Directory -Force -Path 'public/images/editorial'
```

Expected: `public/images/editorial/` exists and contains no inherited source-site assets.

### Task 2: Generate and process the architecture set

**Files:**
- Create: `public/images/editorial/hero-cultural-entrance.webp`
- Create: `public/images/editorial/hero-warm-residential-entry.webp`
- Create: `public/images/editorial/hero-civic-corridor.webp`
- Create: `public/images/editorial/home-commercial-egress.webp`
- Create: `public/images/editorial/home-design-context.webp`
- Create: `public/images/editorial/home-editorial-insight.webp`
- Create: `public/images/editorial/project-commercial-egress.webp`
- Create: `public/images/editorial/project-glass-entrance.webp`
- Create: `public/images/editorial/project-hospitality-residential.webp`
- Create: `public/images/editorial/architecture-boutique-hotel.webp`
- Create: `public/images/editorial/architecture-coastal-residence.webp`
- Create: `public/images/editorial/home-material-library.webp`

**Interfaces:**
- Consumes: prompt constraints from the design spec
- Produces: twelve original architecture assets with stable slugs and website-ready WebP encoding

- [ ] **Step 1: Generate each architecture asset with one built-in ImageGen call**

Use the shared prompt skeleton:

```text
Use case: photorealistic-natural
Asset type: architectural website editorial image
Primary request: <asset-specific scene from the design spec>
Style/medium: restrained architectural editorial photography, physically plausible and buildable
Composition/framing: <wide hero or 3:2 section crop>; generous structural negative space
Lighting/mood: natural soft daylight; calm, quiet, timeless
Color palette: warm white, stone gray, graphite, muted timber, restrained metal tones
Constraints: empty architecture; no people, silhouettes, reflections of people, hands, vehicles as subjects, text, letters, signs, logos, watermarks, brands, famous buildings, or identifiable projects
Avoid: glossy real-estate advertising, dramatic HDR, impossible doors, malformed hardware, duplicated fixtures, exaggerated luxury, direct imitation of any reference photograph
```

Expected: one distinct output per asset slug, with no shared composition masquerading as a separate scene.

- [ ] **Step 2: Visually inspect every generated architecture asset**

Inspect each source with the local image viewer at original or high detail.

Expected: no forbidden people/text/logo content; straight architectural geometry; plausible door swing, glazing, frames, thresholds, and hardware.

- [ ] **Step 3: Convert approved sources to WebP with Sharp**

Use `fit: 'cover'`, quality `86`, and these exact target sizes:

```text
hero-cultural-entrance.webp: 2400×943
hero-warm-residential-entry.webp: 2400×943
hero-civic-corridor.webp: 2400×943
home-commercial-egress.webp: 2400×1159
home-design-context.webp: 1800×1200
home-editorial-insight.webp: 2400×1464
project-commercial-egress.webp: 1800×1200
project-glass-entrance.webp: 1800×1200
project-hospitality-residential.webp: 1800×1200
architecture-boutique-hotel.webp: 1800×1200
architecture-coastal-residence.webp: 1800×1200
home-material-library.webp: 1800×1200
```

Expected: final files use the exact slugs listed above and remain visually clean at desktop width.

### Task 3: Generate and process the industrial-material set

**Files:**
- Create: `public/images/editorial/industrial-precision-parts.webp`
- Create: `public/images/editorial/material-brushed-steel.webp`
- Create: `public/images/editorial/material-bronze-patina.webp`
- Create: `public/images/editorial/material-metal-stone-detail.webp`

**Interfaces:**
- Consumes: no-people and brand-truth constraints from the design spec
- Produces: four material-led editorial assets for homepage teasers and project galleries

- [ ] **Step 1: Generate each material asset with one built-in ImageGen call**

Use the shared prompt skeleton:

```text
Use case: photorealistic-natural
Asset type: architectural-material editorial image
Primary request: <asset-specific material study from the design spec>
Style/medium: high-end editorial still-life or macro material photography, physically accurate surface texture
Composition/framing: square or 3:2; strong geometry; quiet negative space
Lighting/mood: raking natural studio daylight, controlled reflections, understated
Color palette: stainless silver, charcoal, warm bronze, limestone, oak
Constraints: no people, hands, reflections of people, text, letters, measurement labels, logos, watermarks, brands, or recognizable products
Avoid: jewellery styling, science-fiction machinery, liquid-metal forms, excessive bokeh, perfect CGI surfaces
```

Expected: four distinct, believable material images with no product claims.

- [ ] **Step 2: Inspect and convert material sources**

Convert with WebP quality `86` and these exact targets:

```text
industrial-precision-parts.webp: 1800×1200
material-brushed-steel.webp: 1600×1600
material-bronze-patina.webp: 1600×1600
material-metal-stone-detail.webp: 1600×1600
```

Expected: brushed direction, patina, machining, edges, and reflections remain credible after compression.

### Task 4: Integrate the new image system into both homepage locales

**Files:**
- Modify: `src/data/home.ts`
- Modify: `src/data/home-es.ts`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `/images/editorial/*.webp` URLs from Tasks 2 and 3
- Produces: matching English and Spanish homepage media mappings

- [ ] **Step 1: Update homepage carousel references and alt text**

Map the three slides to:

```text
/images/editorial/hero-cultural-entrance.webp
/images/editorial/hero-warm-residential-entry.webp
/images/editorial/hero-civic-corridor.webp
```

Expected: titles, bodies, links, and carousel ordering remain unchanged; only media sources and accurate localized labels change.

- [ ] **Step 2: Update the default social-preview image**

Map the root Open Graph and Twitter preview from the old product-room composite to:

```text
/images/editorial/hero-cultural-entrance.webp
```

Expected: shared links use the new architectural art direction; set the image metadata to the actual `2400×943` dimensions and use an accurate architectural alt label while leaving titles, descriptions, and locale metadata unchanged.

- [ ] **Step 3: Update large homepage modules**

Map:

```text
hero2 -> /images/editorial/home-commercial-egress.webp
hero3 -> /images/editorial/home-design-context.webp
hero4 -> /images/editorial/home-material-library.webp
hero5 -> /images/editorial/home-editorial-insight.webp
```

Expected: Materials + Engineering uses a representative material-library study and does not imply that generated imagery documents a Canton Hyland factory or completed project.

- [ ] **Step 4: Replace conceptual teaser media while retaining technical product cards**

Use this exact mapping for conceptual cards in both locales:

```text
teaser1.cards[0] -> /images/editorial/material-brushed-steel.webp
teaser1.cards[1] -> /images/editorial/material-metal-stone-detail.webp
teaser2.cards[0] -> keep the real 305 product image
teaser2.cards[1] -> keep the real LC14 product image
teaser3.cards[0] -> /images/editorial/material-bronze-patina.webp
teaser3.cards[1] -> /images/editorial/industrial-precision-parts.webp
```

Use accurate localized media labels. Do not call the generated precision-parts still life a Canton Hyland factory, inspection, or production photograph.

Expected: the page reaches the approved mix without weakening technical credibility.

- [ ] **Step 5: Run type checking**

Run:

```powershell
npm run typecheck
```

Expected: exit code 0.

### Task 5: Integrate representative application imagery

**Files:**
- Modify: `content/projects/commercial-fire-egress-hardware.json`
- Modify: `content/projects/glass-entrance-hardware-package.json`
- Modify: `content/projects/hospitality-residential-door-package.json`

**Interfaces:**
- Consumes: project and supporting assets from Tasks 2 and 3
- Produces: three truthful representative applications with architecture heroes and real product anchors

- [ ] **Step 1: Replace the three project hero images**

Map commercial, glass, and hospitality projects to their matching `project-*.webp` assets, all with ratio `3 / 2` and labels beginning with `Representative`.

Expected: listing cards show architecture rather than product cutouts while the disclosure remains unchanged.

- [ ] **Step 2: Replace one gallery image per project with editorial support**

Map supporting images to `architecture-boutique-hotel.webp`, `architecture-coastal-residence.webp`, and `industrial-precision-parts.webp` where semantically appropriate. Retain one real product image in every project gallery.

Expected: each project detail page balances architectural context and product evidence.

- [ ] **Step 3: Rebuild the generated content index**

Run:

```powershell
npm run content
```

Expected: exit code 0 and generated project data reflects the new image paths.

### Task 6: Build a launch-safe Company editorial context without falsifying facilities

**Files:**
- Modify: `src/data/company.ts`
- Modify: `src/components/site/CompanyOverview.tsx`
- Modify: `src/data/home.ts`
- Modify: `src/data/home-es.ts`

**Interfaces:**
- Consumes: approved representative editorial assets plus factual company copy and certificates
- Produces: a people-free, bilingual architectural/material study group with an explicit non-documentary disclosure

- [ ] **Step 1: Remove all unverified factory/showroom imagery from public route references**

The archived factory/showroom files remain recoverable under `public/images/company/`, but public homepage and Company data must not reference them until the client confirms their facility identity and embedded signage.

- [ ] **Step 2: Use this exact final editorial order**

```text
/images/editorial/home-material-library.webp
/images/editorial/home-design-context.webp
/images/editorial/industrial-precision-parts.webp
```

Rename the collection to `companyEditorialStudies`. The first image is the large context visual. Change the visible section copy to state that these are representative editorial concepts—not Canton Hyland facilities, production documentation, or completed client projects. Provide Spanish `labelEs` values and select them on Spanish routes.

Expected: exactly three people-free editorial studies appear, the documentary-authenticity gate is removed from public routes, and factual company claims remain grounded in approved copy and model-scoped evidence rather than generated imagery.

- [ ] **Step 3: Run type checking and the content build**

Run:

```powershell
npm run typecheck
npm run content
```

Expected: both commands exit 0.

### Task 7: Record generated-asset provenance

**Files:**
- Modify: `IMAGE_CREDITS.md`

**Interfaces:**
- Consumes: final approved editorial asset list and generation method
- Produces: accurate public-facing asset provenance and usage restrictions

- [ ] **Step 1: Correct the blanket licence statement**

Separate first-party client photography, client-supplied technical/product evidence, and generated editorial imagery. Do not describe `public/images/editorial/` as client photography.

Expected: the document remains explicit that generated scenes are representative concepts and not completed Canton Hyland projects or factory documentation.

- [ ] **Step 2: Add the editorial asset inventory**

List all fifteen exact filenames, the built-in ImageGen workflow, the no-people/no-logo constraints, and WebP processing details.

Expected: every newly added editorial image is traceable without implying a stock licence or client-photo provenance.

### Task 8: Verify assets and rendered pages

**Files:**
- Verify: `public/images/editorial/*.webp`
- Verify: `src/data/home.ts`
- Verify: `src/data/home-es.ts`
- Verify: `src/app/layout.tsx`
- Verify: `src/data/company.ts`
- Verify: `content/projects/*.json`
- Verify: `IMAGE_CREDITS.md`

**Interfaces:**
- Consumes: all completed assets and mappings
- Produces: evidence that the site builds and the new visual system renders correctly

- [ ] **Step 1: Validate file presence, dimensions, encoding, and size**

Run a Sharp metadata check over every expected slug.

Expected: exactly fifteen WebP assets exist; each matches the exact dimensions specified in Tasks 2 and 3, and no file is zero bytes.

- [ ] **Step 2: Search for stale weak-hero references**

Run:

```powershell
rg -n "hero-panic-exit-device|hero-heavy-duty-fire-door-lock|hero-modern-tubular-lock|hero-panic-exit-banner|hero-designed-for|hero-storefront-banner" src/data content/projects src/app
```

Expected: no homepage or representative-project references remain, except intentional metadata or technical-page uses documented in the final report.

- [ ] **Step 3: Run the full verification suite**

Run:

```powershell
npm test
npm run lint
npm run typecheck
npm run build
```

Expected: all commands exit 0; the test report shows 2 passing tests and 0 failures.

- [ ] **Step 4: Render and inspect local pages**

Inspect at desktop and mobile widths:

```text
/
/es/
/projects/
/projects/commercial-fire-egress-hardware/
/projects/glass-entrance-hardware-package/
/projects/hospitality-residential-door-package/
/company/
/es/company/
```

Expected: no broken images, no important architecture cropped away, no page text baked into images, and no generated image presented as a named completed project or factory record.

- [ ] **Step 5: Review the final Git diff**

Run:

```powershell
git status --short
git diff --stat
git diff -- src/data/home.ts src/data/home-es.ts src/data/company.ts content/projects
```

Expected: only the approved visual-system files, content mappings, brand raster master, spec, and plan are changed.
