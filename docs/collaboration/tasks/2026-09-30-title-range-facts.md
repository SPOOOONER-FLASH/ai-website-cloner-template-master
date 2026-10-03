# HYDE SEO title range facts — 2026-09-30

Owner: Claude HYDE engineering, which currently claims `scripts/build-product-titles.mjs` and all `seoTitle*` / `seoDescription*` fields in `docs/collaboration/NOW.md`. Seven-locale `content/i18n/**` overlays are claimed by Claude multilingual. This is a factual product-fit correction, not a decorative SEO rewrite.

## Reproduced on released source `a53308b4b11` and normal public GETs

| Model | Published `Door thickness` | Generated SEO error |
|---|---|---|
| 028 panic exit trim | `35–55mm` | EN title and EN/ES/PT descriptions say only `55mm` |
| 037 panic exit trim | `35–55mm` | Same upper-bound-only description, EN title says `55mm` |
| 039 panic exit trim | `45–50mm` | Same upper-bound-only description, EN title says `50mm` |
| DV05 door viewer | `35–55mm / 60–100mm` | EN/ES/PT titles and descriptions say continuous `55–100mm`, incorrectly admitting the 56–59mm gap |

The public 028 and DV05 EN/ES/PT pages all return 200 with correct canonicals but retain these mismatches. The authoritative specifications are in `content/products/028-panic-exit-device-trim.json`, `037-panic-exit-device-trim.json`, `039-panic-exit-device-trim.json` and `dv05-door-viewer.json`; do not change their published fit ranges to match the faulty titles.

## Cause and bounded fix

`scripts/build-product-titles.mjs` `condense()` (around line 236) runs a generic `mm` number extractor. In `35–55mm` it only captures the 55, and in the two DV05 ranges it captures 55 and 100, then joins them as one continuous range. `dimensionPhrase()` passes the false result into the three-locale title/description generator. This is a class bug: catalogue inspection found 171 products with a plain door-thickness interval, including at least 44 for which thickness becomes a leading SEO size.

Before the generic extractor, parse exact full-value `N–Nmm` and slash-separated `N–Nmm / N–Nmm` forms (accept the catalogue's hyphen/en dash and optional unit spacing). Preserve both endpoints of each range and the slash between discontinuous ranges. Leave composite dimensions and `60/70mm` adjustable options on their existing paths. Then run `node scripts/build-product-titles.mjs --write` under the claimed owner's workflow, inspect every generated product/overlay diff, and keep only facts supported by each record. Do not hand-edit six SEO fields: `titles:check` will otherwise regenerate the incorrect version.

Acceptance: 028/037/039 EN/ES/PT snippets express their full published ranges; DV05 snippets express **both** `35–55mm` and `60–100mm`, with no continuous `55–100mm` claim. Add regression coverage for single and discontinuous ranges. `npm run titles:check` and full `npm run check` must pass, followed by HYDE-only export and normal public page verification. The current `a53308b4b11` baseline itself is green (452 project tests, 26 export tests); do not confuse the superseded ancestor's 196-entry title drift with this task.
