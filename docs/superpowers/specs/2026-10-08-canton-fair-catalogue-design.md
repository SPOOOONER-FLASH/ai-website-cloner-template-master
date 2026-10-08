# HYDE export catalogue, Canton Fair edition: design

**Status:** design approved in chat by the client on 2026-10-08; this document records it.
**Deadline:** print PDF to the printer by **2026-10-11**; the 140th Canton Fair Phase I opens 2026-10-15.
**Generator:** `scripts/build_catalogue.py`, run by `npm run catalogue` (`build-catalogue-plates.mjs` → `build_catalogue.py` → `finish-downloadable-pdfs.mjs`).

## 1. Decisions taken with the client

| Question | Decision |
|---|---|
| Scope | Rebuild the **whole** catalogue, not a fair-only edition |
| Print | **Print shop, perfect binding**. Output a print PDF (3mm bleed, crop marks) and a separate screen PDF |
| Booth number | **Not printed.** The book must stay usable after the fair. Fair name and dates are not printed either |
| Direction | **A, premium lookbook**: a full-page opener per family, 9 products per page at uniform scale |
| Specs | **Specs travel with each product** (2–3 key rows under the photo) plus a QR code per family to the full specs online. No separate spec tables. About 108 pages |

Saddle stitch is ruled out because it tops out around 64 pages.

## 2. Structure and page budget

Measured from `content/products` on 2026-10-08: 616 HYDE products in 17 families, 549 with a real photograph.

| Part | Pages | Content |
|---|---|---|
| Front matter | 10 | Cover; inside cover; factory (2); OEM & tooling; export markets; materials & finishes (2); how to order; contents |
| Family openers | 17 | One page per family: one large real product photo, family name, one line of positioning, product count, QR to the family page |
| Product pages | 68 | 3×3 grid, 9 per page. Each cell: photo at uniform scale, model (large), name, 2–3 key spec rows |
| Also available | ≈6 | The 67 unphotographed products, listed at the end of their family with their spec rows. No empty photo cells anywhere |
| Index + back cover | 6 | Model-number index with page references; back cover with company, address, Germany office, web, email |
| **Total** | **≈108** | Padded to a multiple of 4 |

Family order follows the site taxonomy. The final page count is whatever the data produces, padded to a multiple of 4. The 108 figure is an estimate.

## 3. Visual system

- **Page:** A4 trim (595.276 × 841.890 pt) plus 3mm (8.504 pt) bleed on every side in the print PDF. Crop marks outside the bleed. The screen PDF is the trim area only.
- **Type:** **Archivo**, the website's typeface (`src/app/fonts.ts`), so print and web read as one brand. Family names large in a wide weight, body and spec text small and quiet. TTF files vendored under `scripts/fonts/archivo/` with `OFL.txt`.
- **Field:** the page's own white. Real product cutouts sit on it. **No generated backgrounds, no props, no composited scenes** (client rejection on record: a real cutout on a generated backdrop is not acceptable).
- **Scale:** every product plate in a grid is fitted to the same box, so the grid reads as one shoot. Plates come from the existing `build-catalogue-plates.mjs`.
- **Colour:** black, white, greys, plus **one accent**: the brass already defined in the generator (`BRASS`), used only for rules, page numbers and section marks.
- **No full-bleed photography** (amended 2026-10-08, measured). Product cut-outs are at most 829–992 px per family and the client's confirmed factory photos at most 1308 px, so full-bleed A4 would print near 150 dpi. Cover = one large real product on white; heroes are sized from their own pixels (at most ~121 mm); one factory photo per page at up to 166 mm. Every raster is ≥ 200 dpi, enforced by `place_image`.
- **Running elements:** folio and family name on product pages. The per-page finish-swatch strip in today's footer is removed; finishes have their own spread.

## 4. Content rules

1. **Photography:** real product photographs only, and the client's own factory photographs. Usable: `assembly-line`, `press-shop`, `facility-yard`, `hero-storefront-banner` (added as "the client's own material"). `factory-cnc-machining`, `factory-laser-cutter` and `factory-polishing-workshop-wide` have no recorded source and are used **only after their provenance is confirmed**. `hero-*-banner` images other than the storefront are not used.
2. **No invention:** a missing spec value prints as "—". No dimension, count, rating or claim is created to fill space.
3. **No certifications** are claimed, named or implied.
4. **Company name:** Canton Hyland Hardware & Building Material Co., Ltd. (fixed by the client 2026-09-28; today's cover is wrong).
5. **Front-matter copy** uses only facts already approved as public (`docs/copy/brand-platform.md`): OEM / private label and custom tooling to the customer's drawing or sample; exports to Europe, North America, South America, Turkey and Southeast Asia; a Spanish-speaking team; years exhibiting at the Cologne hardware fair; an office and resident company in Germany (Koblenzerstr. 29, 56656 Brohl-Lützing). **No country count, no customer names.**
6. **Language:** English.
7. **Key specs per product** come from that product's own spec rows, by a per-family priority table in the generator. A card lists the first three labels **the product actually states**; an unstated row is left off, not printed as "—" (amended 2026-10-08: on a card, a dash per unknown row reads as unfinished, and omitting it claims nothing). "—" remains the rule wherever a fixed column is printed.
8. **Images:** family heroes are clean cut-outs only. An "as-shot" plate skips the cut-out step that removes the supplier's burned-in watermark. `floor-springs-and-pivots` has no clean cut-out (supplier-catalogue crops on a dark background; one carries Chinese text fragments), so it is the single open item for the full book.

## 5. QR codes

One per family opener, pointing at `https://cantonlock.com/products/<family>/`. Plus one on the back cover pointing at the site root. Generated with **segno** (pure Python, permissive licence) as vector paths, so they print sharp. Every QR target is checked to return 200 before release.

## 6. New dependencies (approval requested with this spec)

| What | Why | Licence |
|---|---|---|
| `segno` (pip) | Vector QR codes | BSD-3 |
| Archivo TTF files, vendored | The site's brand typeface, embedded in the PDF | SIL OFL 1.1 |

## 7. Verification before it goes to the printer

- Render every page to PNG and look at it, especially every grid page. No empty cells, no clipped text, no plate at the wrong scale.
- Page count is a multiple of 4. Bleed is present on the print PDF and absent on the screen PDF.
- Fonts embedded (`pymupdf` font listing). Text layer present, so the PDF is searchable.
- Every QR decodes to its intended URL, and that URL returns 200.
- Counts printed in the book (products per family) equal the counts from `content/products` with the HYDE filter.
- The company name appears exactly as in §4.4 everywhere.

## 8. Risks and open items

| Item | Owner | Note |
|---|---|---|
| **RGB vs CMYK** | Client → printer | The generator outputs RGB. Most print shops convert, but the printer must confirm before the file is sent |
| **Spine width** | Printer | Depends on paper weight. Needed only if the cover is printed as one sheet with the spine |
| Factory photo provenance | Claude, confirmed with client | Three photos have no recorded source |
| 7-day timeline | — | Sample pages 10/09 for approval; full book 10/10; to printer 10/11 |

## 9. Out of scope

A fair-only short edition; Spanish or Portuguese editions; dimensioned line drawings (only 31 products publish enough geometry); new product photography; the website.
