# Image Credits

Every photograph in `public/images/` and where it came from.

**These are stock placeholders, not Canton Hyland products.** They show generic
architectural door hardware and interiors so the demo reads as a real site. They are
scheduled for replacement with Canton's own product photography in **P11**. Do not let
a customer read them as a product catalogue.

---

## Licence

All 11 photographs are from **[Pexels](https://www.pexels.com)** under the
**[Pexels License](https://www.pexels.com/license/)**.

The Pexels License permits free use for commercial and non-commercial purposes and does
not require attribution. Photographers are credited below anyway — it costs nothing and
it is the decent thing to do.

Restrictions that still apply under that licence, and are all satisfied here:
- Photos may not be sold unaltered — we are not selling them.
- Identifiable people and brands may not be shown as endorsing a product — none of the
  selected photos contains an identifiable face or a competitor's visible branding.
- Photos may not be used in a way that is offensive or that implies the photographer
  endorses the product — not the case here.

Licence was verified per photo from the `license` field of each photo page's JSON-LD on
2026-08-15; every one returned `https://www.pexels.com/license/`.

---

## Sourcing

Downloaded and sized by `scripts/download-homepage-images.mjs`. Re-run it to regenerate.
Cropping and JPEG compression are done by the Pexels CDN (`fit=crop`), so each file
arrives at exactly the aspect ratio its slot needs.

**Budget:** 300 KB per file. Target output width is 2× the display size for sharpness on
retina screens. Two of the large heroes cannot reach 300 KB at 2× without crushing JPEG
quality into visible artefacts, so the script walks dimensions down before it lowers
quality, with a hard quality floor of 60. Those two ship at 1.75× and 1.5× — noted below.

All 11 files: **q=78, 1 965 KB total, largest 291 KB.**

---

## Homepage

| File | Slot | Output | Scale | Size | Photographer | Source |
|---|---|---|---|---|---|---|
| `hero-architectural-door-handle.jpg` | Hero 1 — main visual | 2880×1392 | 2× | 213 KB | khairul nizam | [pexels.com/photo/…-16515](https://www.pexels.com/photo/close-up-photography-of-gray-stainless-steel-door-lever-and-lock-16515/) |
| `hero-product-collection.jpg` | Hero 2 — product collection | 2520×1297 | 1.75× | 266 KB | Talha Topal | [pexels.com/photo/…-13620442](https://www.pexels.com/photo/a-gray-wooden-door-with-door-lever-13620442/) |
| `hero-designed-for.jpg` | Hero 3 — "Designed For", side variant | 1940×1292 | 2× | 124 KB | H&CO | [pexels.com/photo/…-3276079](https://www.pexels.com/photo/close-up-photo-of-door-handle-3276079/) |
| `hero-company-corridor.jpg` | Hero 4 — About Us | 2160×1440 | 1.5× | 291 KB | Max Vakhtbovych | [pexels.com/photo/…-7533836](https://www.pexels.com/photo/empty-hallway-of-modern-apartment-7533836/) |
| `hero-insights-hallway.jpg` | Hero 5 — Insights | 2880×1758 | 2× | 279 KB | MAXArtbovich | [pexels.com/photo/…-6908564](https://www.pexels.com/photo/modern-hallway-design-6908564/) |
| `card-distributors-lever.jpg` | Teaser 1 — "For distributors" | 1360×1360 | 2× | 77 KB | H&CO | [pexels.com/photo/…-2835653](https://www.pexels.com/photo/grayscale-photo-of-gray-door-lever-and-white-door-panel-2835653/) |
| `card-specifiers-lever.jpg` | Teaser 1 — "For specifiers" | 1360×1360 | 2× | 156 KB | Max Vakhtbovych | [pexels.com/photo/…-8134755](https://www.pexels.com/photo/brown-wooden-doors-with-silver-door-lever-8134755/) |
| `project-office-corridor.jpg` | Teaser 2 — project card 1 | 1360×1360 | 2× | 91 KB | Max Vakhtbovych | [pexels.com/photo/…-8089087](https://www.pexels.com/photo/door-in-corridor-8089087/) |
| `project-civic-entrance.jpg` | Teaser 2 — project card 2 | 1360×1360 | 2× | 221 KB | hi room | [pexels.com/photo/…-17240673](https://www.pexels.com/photo/modern-apartment-hallway-17240673/) |
| `card-contact-glass-doors.jpg` | Teaser 3 — "Get in Touch" | 1360×1360 | 2× | 130 KB | Andrea De Santis | [pexels.com/photo/…-13094990](https://www.pexels.com/photo/double-glass-doors-with-golden-handles-13094990/) |
| `card-faq-white-corridor.jpg` | Teaser 3 — FAQ | 1360×1360 | 2× | 117 KB | Alexander Vie | [pexels.com/photo/…-19966755](https://www.pexels.com/photo/dresser-in-white-corridor-19966755/) |

---

## Slots still on placeholders

Two slots in the Welcome block are **deliberately** still rendering placeholder blocks:

| Slot | Ratio | Why |
|---|---|---|
| Decorative graphic | 306 / 156 | Brand artwork, not a photograph. Stock photography would be wrong here — it needs Canton's own mark or an illustration. |
| Signature graphic | 87 / 46 | A signature/monogram. Same reasoning. |

Both come from the layout reference, where they are the company's own drawn artwork.
They wait for P11 or for a design decision, whichever comes first.
