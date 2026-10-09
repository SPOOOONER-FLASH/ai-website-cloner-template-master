# Canton Fair catalogue — Milestone 2: both editions — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render the whole catalogue in two editions from one renderer: the **electronic** edition (complete, layout A) and the **print** edition (complete, layout B, ≤ 70 pages, multiple of 4, bleed + crop marks).

**Architecture:** `scripts/catalogue/variants.py` merges finish variants into one card. `scripts/catalogue/book.py` holds an `Edition` config, a two-pass layout (pass 1 assigns pages so the contents and index can cite them, pass 2 draws), generalised page functions, outline and links. It reuses `Canvas`, `cover`, `factory`, `draw_grid`, `card_specs`, `grid_plate`, `ordered` and `folio` from `samples.py`.

**Tech Stack:** as Milestone 1 (Python 3, PyMuPDF, Pillow, segno, Archivo, unittest).

**Spec:** `docs/superpowers/specs/2026-10-08-canton-fair-catalogue-design.md`. Milestone 1 plan: `docs/superpowers/plans/2026-10-08-canton-fair-catalogue-samples.md`.

## Decisions since Milestone 1 (client, 2026-10-08)

| | Electronic | Print |
|---|---|---|
| Products | All | All (client chose option B over a 393-product selection) |
| Opener | Full page per family | Band at the top of the family's first page |
| Grid | 3 × 3 | 4 × 3 |
| Pages | ≈ 108, as the data falls | ≤ 70, padded to a multiple of 4 with a Notes page |
| Geometry | Trim only, clickable links | Trim + 3 mm bleed + crop marks |
| File | `public/downloads/hyde-export-catalogue-2026.pdf` (the site download) | `Desktop\hyde\` and `tmp/catalogue-book/` |

## Global Constraints

All Milestone 1 constraints, plus:
- Back cover prints only what the website publishes: No. 76 Haiwei Road, Zhongshan, Guangdong, China; Koblenzerstr. 29, 56656 Brohl-Lützing, Germany; tec@cantonlock.com; +1 703 967 7493; cantonlock.com.
- Finish variants merge into one card only when name and every non-finish spec row are identical; the card lists the finish codes.
- `NO_PHOTO` (exact set, asserted): D-1042, D-1043, D-3017, D-3018 — supplier crops cut off at the left edge, so the whole part is not visible. They print under "Also available", with specs, no picture.
- Floor-springs-and-pivots: no cut-out hero, so its opener is typographic.
- No Chinese characters in the text layer of either edition.

---

### Task 1: Merge finish variants

**Files:** Create `scripts/catalogue/variants.py`, `scripts/catalogue/test_variants.py`

**Interfaces:** Produces `Card` dataclass `(model: str, name: str, product: dict, finishes: list[str], members: list[dict])`; `cards(products: list[dict]) -> list[Card]` (order preserved by first member).

- [ ] Test: `D101 AB/AC/PB/SS` → one card `D101`, finishes `["AB","AC","PB","SS"]`; two records with the same base but different non-finish specs → two cards; the sum of `len(card.members)` equals the input length.
- [ ] Implement: base model = model with a trailing finish code (from `build_catalogue.FINISH_CODES`) stripped; group key = (base, name, non-finish spec rows); the finish of a member = the stripped code, or `"—"` if it had none.
- [ ] Run `py -m unittest discover -s scripts/catalogue -p "test_*.py"`; commit.

### Task 2: The book renderer, both editions

**Files:** Create `scripts/catalogue/book.py`, `scripts/catalogue/test_book.py`

**Interfaces:** Consumes `samples.Canvas/cover/factory/draw_grid/card_specs/grid_plate/ordered/folio`, `variants.cards`, `heroes.*`, `qr.*`. Produces `ELECTRONIC`, `PRINT: Edition`; `render(edition, out: Path) -> Path`; CLI `py scripts/catalogue/book.py --edition electronic|print --out <pdf>`.

Book order: cover · contents · factory · how to order · materials & finishes · per family (opener/band, grids, Also available) · model index · Notes padding (print) · back cover.

- [ ] Tests (`test_book.py`, each edition rendered once in `setUpClass`):
  - print page count ≤ 70 and `% 4 == 0`; electronic page count `% 2 == 0`
  - every card's model appears in the text layer exactly where the index says (index entry page contains that model)
  - every published HYDE product's model appears somewhere in the book (none dropped)
  - company name exact; no certification words; no CJK characters (`[㐀-鿿]`) in any page's text
  - print pages carry TrimBox A4 and BleedBox +3 mm; electronic pages are trim size and family QR areas are links to `family_url`
  - the NO_PHOTO set equals the four models, and none of them is drawn as an image card
- [ ] Implement the two passes, page functions, outline (`doc.set_toc`), and links (`page.insert_link`) in the electronic edition.
- [ ] Run the tests; render both editions; commit.

### Task 3: Look at every page

- [ ] Render contact sheets (8 pages per sheet, 70 dpi) for both editions; read every sheet.
- [ ] Fix clipping, orphaned single cards on a last page, empty Also-available headings, and anything that reads as unfinished; re-render; re-read.
- [ ] Commit.

### Task 4: Wire, deliver, record

- [ ] `npm run catalogue` → plates (both sizes) + `py scripts/catalogue/book.py --edition electronic --out public/downloads/hyde-export-catalogue-2026.pdf` + `finish-downloadable-pdfs.mjs`.
- [ ] Print edition → `tmp/catalogue-book/hyde-catalogue-2026-print.pdf` and `Desktop\hyde\`.
- [ ] Full `npm test`; Python tests; agent-update; commit; `npm run ship`; confirm with `git ls-remote`.
- [ ] Send both PDFs to the client; repeat the open questions (ISO 9001, three factory photos, the floor-spring and patch photographs on the website).
