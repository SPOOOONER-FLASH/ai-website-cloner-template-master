# Codex — product image inspection

- Agent: Codex
- Scope: added a product-detail image inspection surface for hero and gallery assets across the catalogue.
- Behaviour: mouse, keyboard and touch open an on-demand full-screen image; Escape and the close control dismiss it; missing images remain labelled placeholders. The large copy is mounted only after interaction and does not compete with LCP.
- Validation: focused tests passed; TypeScript and ESLint passed; a real AR-4 detail route exposed three zoom controls, opened the dialog and closed it with Escape.
- Untouched work: navigation A–D preview remains local pending client selection; no product data, image files, watermark pixels, Spanish routes or generated `out/` files were changed in this source commit.
- Next useful review: verify the generated static product page and public edge after the release build.
