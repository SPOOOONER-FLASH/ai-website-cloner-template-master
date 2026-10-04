# HYDE full-homepage motion concepts

Date: 2026-10-04. Agent: Codex.

The client rejected the previous navigation-only proposals as insufficiently attractive and explicitly requested three more dynamic, premium designs with gradients and animations throughout the homepage. This request authorizes visual exploration beyond the older restrained design brief. It does not select a production design.

## Three directions

| Direction | Composition | Motion |
|---|---|---|
| 金属光场 | Charcoal/petrol hero, actual lever-set photograph, metallic headline, asymmetric pale product section, factory and specification sections | Slowly moving conic lightfield, metallic text gradient, small pointer-follow translation of the complete photo, scrolling reveals and product transitions |
| 建筑杂志 | Cream/moss palette, large serif typography, arched real-product field, workshop photo ribbon, asymmetric editorial grid and manufacturing story | Scroll reveals, gentle whole-photo hover zoom and product transitions; soft gradient footer |
| 色彩实验室 | Cobalt/acid-lime identity, animated warm/mint gradient, oversized italic title, tilted oval photo field, typography ticker, bold blue factory section | Gradient movement, typography ticker, card lift, product transitions and scrolling reveals |

All three have visible catalog/download and contact paths. Menus, catalog/support previews, product selection and motion controls work locally. The featured-product selector changes one identified product card; it does not imply that a silver 9001 and the separate black tubular set are the same model. The language panel explicitly identifies this as an English design preview and disables the other language choices. Downloads are a navigation/content preview, not an actual PDF transfer; contact does not send anything.

## Real-photo provenance

Images are embedded once as WebP data URIs and reused by all three concepts. No imagined metal product, altered component, invented dimension, certification or quantitative factory claim was added.

| Asset | Evidence and scope |
|---|---|
| `images/editorial/hyde-real-lever-plate.webp` | Whole-object layout from the actual 9001 product image; sidecar identifies the original `images/products/9001-stainless-steel-handle.webp`. Uniform photo scaling only. |
| `images/editorial/hyde-real-lever-set-dark.webp` | Client Sep 7 source `image-1788832445996.webp`, preserved as the complete original image. Model number is unconfirmed, so the concept names it a lever lock set. |
| `images/products/black-tubular-lever-lock-set.webp` | Client `Black Tubular Lever Lock Set.jpg`, recorded in `scripts/process-client-assets.mjs` and `public/IMAGE_CREDITS.md`. Original photograph including its logo is retained; no model number is invented. |
| `images/company/factory-cnc-machining.webp` | Client `423b142324065050bd287c2ac3090670.png`; `public/IMAGE_CREDITS.md` records the Sep 17 confirmation that this is the client's factory. This confirmation is not extended to other workshop images. |

Product movement affects the complete image. Hover uses uniform scaling; the prototype does not invent assembly motion or geometry. Only the confirmed CNC photograph is used for factory content.

## Reproduce and retain

Editable literal source: `docs/design-references/2026-10-04-homepage-motion-options.template.html`.

Generator: `scripts/build-homepage-motion-proposals.mjs`.

Generated canonical fragment: `docs/design-references/2026-10-04-homepage-motion-options.html`.

From `E:\cantonlock-vis`:

```powershell
node scripts/build-homepage-motion-proposals.mjs --asset-root 'E:\cantonlock-hyde\public' --inline-output 'C:\Users\86132\Downloads\cantonlock\tmp\codex-inline-nav\hyde-homepage-motion-options.html'
```

The sparse proposal worktree lacks actual public images, so the asset root is explicitly supplied from the full checkout. The small conversation-readable display copy is inside the genuine C workspace; `.codex/visualizations` is a migration junction and previously caused `Invalid visualization read request`. The generator rejects linked parent directories for its display copy. Main source and canonical output remain on E.

The fragment uses the native three-variant carousel and stays below 1 MB. Google Fonts supply DM Sans, Manrope and Playfair Display with local font fallbacks. Fonts are the only remote resources; pictures are embedded. There are no API requests. Native buttons remain keyboard accessible. Shared stage sizing measures all three natural page heights at the current width, then aligns their carousel heights without truncating their content.

Motion can be paused at the top and footer. System reduced-motion mode disables ambient animation and the resume control, and identifies that state. Hidden variants and a hidden document suspend animations. Navigation scrolling respects the pause/reduced-motion state. Escape closes an open panel and restores focus to its original trigger; Escape on an already closed panel leaves focus in place.

## Verification record

Use the bundled Visualize renderer and the in-app browser to inspect the fragment inside its sandboxed iframe. Verify desktop, intermediate and narrow layouts; inspect header, title and collection text bounds. Check the three carousel choices, real-image loading, featured-product image/title/action coherence, nested Downloads-to-catalog navigation, Escape/focus restoration, language preview, and pause/resume.

The finishing results are recorded in the accompanying agent update. Impeccable's executable skill/detector is absent from this installation; manual visual inspection and browser DOM checks cover this proposal. No skill, plugin or runtime is installed for this work.

This stage changes proposal artifacts only. Production `src/`, `out/`, migration paths, other agent work and the release builder's work remain untouched. Production implementation requires a selected direction and a separate release stage.
