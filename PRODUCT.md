# Product
<!-- impeccable:product-schema 1 -->

## Platform
Responsive bilingual B2B website built with Next.js 16 and exported as static HTML.

## Users
International door-hardware distributors, importers, architects, specifiers, contractors,
project buyers, and OEM/private-label customers who need to identify a product family,
confirm a model, compare documented specifications, and contact the factory.

## Product Purpose
Turn Canton Hyland's verified hardware catalogue into a clear path from an opening or
application need to a product family, an exact model, and a technically useful enquiry.

## Positioning
HYDE is Canton Hyland's restrained, manufacturer-led architectural-hardware brand. The
site presents the breadth of one coordinated catalogue while keeping exact product facts,
factory evidence, and export contact routes visible and distinct.

## Operating Context
Visitors arrive with different levels of certainty: a known model, a hardware schedule,
a door/application requirement, or only a broad product family. They browse on desktop
and mobile, in English or Spanish, and may share filtered URLs with colleagues before
requesting a quotation.

## Capabilities and Constraints
- Preserve crawlable category and product links in server-rendered static output.
- Product Finder filters may progressively enhance navigation and must remain shareable.
- Never invent compatibility, dimensions, certification scope, price, MOQ, lead time,
  payment terms, customer names, project claims, or availability.
- Exact SKU pages use verified first-party product records and images. Generated imagery
  is editorial only and must never be presented as exact model evidence.
- English and Spanish information architecture must remain aligned.
- The shared worktree and committed `out/` release process follow `AGENTS.md`.

## Brand Commitments
Industrial precision, editorial restraint, useful hierarchy, and honest product evidence.
Typography stays clear; product photography carries the visual weight; conversion asks are
direct and factual. External references such as FSB inform principles, never copied assets,
layouts, brand marks, claims, or implied affiliation.

## Evidence on Hand
- Catalogue and taxonomy: `content/products/`, `content/categories.json`.
- Product and navigation adapters: `src/data/products.ts`, `src/data/categories.ts`.
- Current catalogue surfaces: `src/app/(en)/products/`, `src/app/es/products/`.
- Finder, comparison, configurator, downloads, contact, and certification routes.
- First-party product photography under `public/images/products/`.
- Conceptual editorial imagery under `public/images/editorial/`.
- Current design tokens and interaction rules in `src/app/globals.css`.

## Product Principles
1. Establish the product system before asking visitors to choose an individual model.
2. Give each visual one job: range, form, installation, technical structure, or conversion.
3. Use a repeatable photography grammar so the catalogue reads as one product family.
4. Reveal complexity progressively without hiding the direct route for expert buyers.
5. Treat generated visuals as clearly described editorial concepts, not product proof.
6. Every prominent path should end in an exact category, model, comparison, download, or
   contact action instead of decorative browsing.
