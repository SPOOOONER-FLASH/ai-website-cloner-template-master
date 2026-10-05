# Navigation preview: catalog, prices and MOQ — 2026-10-05

Agent: Claude (cloud thread). Client asked why buyers' first email asks for catalog, prices and MOQ, and for previews of a clearer nav, breadcrumbs and drawer. Draft PR only; nothing live until the client picks.

## What changed (source)

- `src/components/site/nav-variant.ts` (new): `NEXT_PUBLIC_NAV_VARIANT` = `current` (default, live header) | `procurement` (recommended) | `light` | `strip`, plus en/es/pt labels.
- `SiteHeader.tsx`: buyer-first variants turn "Buy it now" into "Catalog & prices" (outlined, links to /wholesale/, hover opens the shelf); `BuyerShelf` puts the catalog PDF first as the black slab; `BuyerStrip` (variant `strip`) is a thin line above the header.
- `SiteMenuDrawer.tsx`: non-current variants open on "What do you need first?" with catalog PDF, prices & MOQ, quote, then the existing specify routes (engineer route dropped: same /contact/ as quote).
- `src/app/(en)/wholesale/page.tsx` (new, all variants): catalog download, how prices are quoted, MOQ, terms table, five ordering steps, request form. Every figure is from `content/faq.json`. Added to the sitemap and to the English drawer's Buying group.
- `AssetRequestForm.tsx`: optional `submitLabel` / `messageLabel` (defaults unchanged).
- `mobile-navigation.test.ts`: rail-CTA regex accepts the variant conditional.

## Decisions respected

- No "Price list" in the header (2026-09-22): prices are described as quoted, never as a downloadable list.
- PR #5's "Request a quote" rename not reused for the top item; "Catalog & prices" names what the buyer asks for. Quote lives in drawer and hub.

## Risks / open

- /wholesale/ is English only; es/pt pages and the seven overlay labels follow once a variant is picked (new labels show English in overlay locales).
- Downloads page meta says "46-page catalog" in ten locales; the PDF is 79 pages. Multilingual session's lane.
- After a pick: delete the losing variants and the env switch, set the winner as default.

Client deliverable: `/mnt/project-files/navigation-catalog-2026-10-05/` (docx + 22 screenshots), source text `docs/collaboration/2026-10-05-navigation-catalog-options.md`.
Next: client picks A/B/C; this thread finalizes, the release session ships on 上线.
