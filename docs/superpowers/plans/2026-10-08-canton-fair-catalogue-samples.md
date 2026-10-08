# Canton Fair catalogue — Milestone 1: four sample pages — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce four real sample pages of the redesigned HYDE catalogue (cover, factory front-matter, one family opener, one 3×3 product page) as a print PDF (3mm bleed + crop marks) and a screen PDF, for client approval on 2026-10-09.

**Architecture:** A new small package `scripts/catalogue/` holds the design system (geometry, fonts, colours, a dpi guard), QR drawing, hero selection and the sample renderer. It reuses the data layer already in `scripts/build_catalogue.py` (`load`, `is_hyde`, `spec_map`, `key_labels`, `plate`) by import, unchanged. The full-book renderer is a separate plan, written after the samples are approved, because the sample review may change the layout.

**Tech Stack:** Python 3 + PyMuPDF 1.28 (already used), Pillow, segno (new, BSD-3), Archivo TTF (new, OFL), stdlib `unittest` (no pytest in this environment).

**Spec:** `docs/superpowers/specs/2026-10-08-canton-fair-catalogue-design.md`

## Global Constraints

- Trim A4 = 595.276 × 841.890 pt. Bleed = 8.504 pt (3 mm) per side in the print PDF only; crop marks outside the bleed. Screen PDF = trim only.
- Colour: RGB (client 2026-10-08: printer accepts RGB).
- Typeface: Archivo (website typeface). Display = ArchivoExpanded; text = Archivo. Glyphs Archivo lacks fall back to Arial (`C:/Windows/Fonts/arial.ttf`).
- Field: the white page. Product images come only from `tmp/catalogue-plates*/` (cut-out, watermark removed by `build-catalogue-plates.mjs`). Never `public/images/editorial/`, never `hero-*-banner` except `hero-storefront-banner`.
- Every placed raster must print at **≥ 200 effective dpi**; placement below that raises an error.
- One accent colour: `BRASS = (0.541, 0.416, 0.122)` (from `build_catalogue.py`), rules and folios only.
- Missing spec value prints `—`. No certification is claimed, named or implied.
- Company name exactly: `Canton Hyland Hardware & Building Material Co., Ltd.`
- Only public facts from `docs/copy/brand-platform.md` §一: founded 1998; Xiaolan, Zhongshan, “China lock export base” (2004); custom tooling to drawing or sample; exports to Europe, Russia, North and South America, Turkey, Southeast Asia; Cologne hardware fair for years; office and resident company in Germany. No country count.
- Products filtered with `is_hyde`. Language: English.
- No booth number, no fair name or date printed.

## File Structure

| File | Responsibility |
|---|---|
| `scripts/catalogue/__init__.py` | Marks the package; empty |
| `scripts/catalogue/style.py` | Page geometry (trim/bleed/margins), font loading, colours, type scale, `fit()` measured with the real font, `max_print_width()` dpi guard, `place_image()` |
| `scripts/catalogue/qr.py` | `draw_qr(page, rect, url)` — vector QR from segno's matrix |
| `scripts/catalogue/heroes.py` | `families()` (17, taxonomy order, with counts) and `hero_for(family)` (highest-res product plate) |
| `scripts/catalogue/samples.py` | Renders the four sample pages; CLI `--out` and `--print` |
| `scripts/catalogue/test_style.py`, `test_qr.py`, `test_heroes.py`, `test_samples.py` | stdlib unittest |
| `scripts/fonts/archivo/*.ttf`, `OFL.txt` | Vendored typeface |
| `scripts/requirements-catalogue.txt` | `segno` pin |

Run all tests with: `py -m unittest discover -s scripts/catalogue -p "test_*.py" -v`

---

### Task 1: Dependencies, fonts and the design system

**Files:**
- Create: `scripts/requirements-catalogue.txt`, `scripts/fonts/archivo/` (8 TTF + `OFL.txt`), `scripts/catalogue/__init__.py`, `scripts/catalogue/style.py`
- Test: `scripts/catalogue/test_style.py`

**Interfaces:**
- Produces: `TRIM: pymupdf.Rect`, `BLEED: float`, `MARGIN_OUTER/INNER/TOP/BOTTOM: float`, `INK, INK2, INK3, RULE, BRASS: tuple`, `FONTS: dict[str, pymupdf.Font]` keyed `"text"`, `"text-medium"`, `"text-semibold"`, `"text-bold"`, `"display"`, `"display-semibold"`, `"fallback"`; `FONT_FILES: dict[str, Path]` same keys; `fit(text, width, size, key) -> str`; `max_print_width(px: int, min_dpi: int = 200) -> float` (points); `place_image(page, rect, path, min_dpi=200) -> pymupdf.Rect` (raises `LowResolution`).

- [ ] **Step 1: Install segno and record it**

```bash
py -m pip install "segno==1.6.1"
printf 'segno==1.6.1\n' > scripts/requirements-catalogue.txt
```

- [ ] **Step 2: Vendor the fonts**

```bash
mkdir -p scripts/fonts/archivo
for f in Archivo-Regular Archivo-Medium Archivo-SemiBold Archivo-Bold ArchivoExpanded-Regular ArchivoExpanded-Medium ArchivoExpanded-SemiBold ArchivoExpanded-Bold; do
  curl -sSL --max-time 60 -o "scripts/fonts/archivo/$f.ttf" "https://github.com/Omnibus-Type/Archivo/raw/master/fonts/ttf/$f.ttf"
done
curl -sSL --max-time 60 -o scripts/fonts/archivo/OFL.txt "https://github.com/Omnibus-Type/Archivo/raw/master/OFL.txt"
ls -la scripts/fonts/archivo
```
Expected: 8 `.ttf` files of ~180 KB and `OFL.txt`.

- [ ] **Step 3: Write the failing tests** — `scripts/catalogue/test_style.py`

```python
import sys, unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from catalogue import style

class StyleTest(unittest.TestCase):
    def test_trim_is_a4_and_bleed_is_3mm(self):
        self.assertAlmostEqual(style.TRIM.width, 595.276, places=2)
        self.assertAlmostEqual(style.TRIM.height, 841.890, places=2)
        self.assertAlmostEqual(style.BLEED, 8.504, places=2)

    def test_every_font_loads_and_is_archivo(self):
        for key in ("text", "text-medium", "text-semibold", "text-bold", "display", "display-semibold"):
            self.assertIn("Archivo", style.FONTS[key].name, key)

    def test_archivo_covers_the_characters_specs_use(self):
        # Characters that appear in content/products spec values; a missing glyph prints as a box.
        for ch in "—–×°Ø±½¼":
            self.assertTrue(style.has_glyph("text", ch), repr(ch))

    def test_fallback_covers_what_archivo_does_not(self):
        for ch in "≤≥":
            self.assertTrue(style.has_glyph("fallback", ch), repr(ch))

    def test_fit_trims_with_an_ellipsis_and_never_exceeds_width(self):
        out = style.fit("Stainless steel lever handle with return spring", 60, 9, "text")
        self.assertTrue(out.endswith("…"))
        self.assertLessEqual(style.FONTS["text"].text_length(out, 9), 60)
        self.assertEqual(style.fit("Short", 200, 9, "text"), "Short")

    def test_dpi_guard(self):
        # 1000 px at 200 dpi = 5 in = 360 pt
        self.assertAlmostEqual(style.max_print_width(1000, 200), 360.0)

if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 4: Run to see them fail**

Run: `py -m unittest discover -s scripts/catalogue -p "test_style.py" -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'catalogue'` (package not yet created).

- [ ] **Step 5: Implement** — `scripts/catalogue/__init__.py` (empty) and `scripts/catalogue/style.py`:

```python
"""The catalogue's design system: geometry, type, colour, and the print-resolution guard.

Archivo is the website's typeface (src/app/fonts.ts), so the printed book and the site
read as one brand. Static TTFs are vendored from Omnibus-Type/Archivo (OFL) because
MuPDF renders only the default instance of a variable font.
"""
from __future__ import annotations

from pathlib import Path
import pymupdf

ROOT = Path(__file__).resolve().parents[2]
FONT_DIR = ROOT / "scripts" / "fonts" / "archivo"

TRIM = pymupdf.Rect(0, 0, 595.276, 841.890)   # A4
BLEED = 8.504                                   # 3 mm
MARGIN_OUTER, MARGIN_INNER = 46.0, 58.0
MARGIN_TOP, MARGIN_BOTTOM = 54.0, 58.0

INK = (0.08, 0.075, 0.06)
INK2 = (0.34, 0.32, 0.29)
INK3 = (0.55, 0.53, 0.49)
RULE = (0.84, 0.82, 0.78)
BRASS = (0.541, 0.416, 0.122)

FONT_FILES: dict[str, Path] = {
    "text": FONT_DIR / "Archivo-Regular.ttf",
    "text-medium": FONT_DIR / "Archivo-Medium.ttf",
    "text-semibold": FONT_DIR / "Archivo-SemiBold.ttf",
    "text-bold": FONT_DIR / "Archivo-Bold.ttf",
    "display": FONT_DIR / "ArchivoExpanded-Medium.ttf",
    "display-semibold": FONT_DIR / "ArchivoExpanded-SemiBold.ttf",
    # Archivo has no ≤ ≥; Arial does, and spec values use them.
    "fallback": Path("C:/Windows/Fonts/arial.ttf"),
}
FONTS: dict[str, pymupdf.Font] = {k: pymupdf.Font(fontfile=str(p)) for k, p in FONT_FILES.items()}


class LowResolution(ValueError):
    """Raised instead of placing an image that would print below the dpi floor."""


def has_glyph(key: str, ch: str) -> bool:
    return FONTS[key].has_glyph(ord(ch)) != 0


def fit(text: str, width: float, size: float, key: str = "text") -> str:
    """Trim to the measured width with an ellipsis — measured with the real font."""
    font = FONTS[key]
    text = " ".join(str(text).split())
    if font.text_length(text, size) <= width:
        return text
    while text and font.text_length(text + "…", size) > width:
        text = text[:-1]
    return text.rstrip(" ,;") + "…"


def max_print_width(px: int, min_dpi: int = 200) -> float:
    """Widest the image may print, in points, before falling below `min_dpi`."""
    return px / min_dpi * 72.0


def place_image(page: pymupdf.Page, rect: pymupdf.Rect, path: Path, min_dpi: int = 200) -> pymupdf.Rect:
    """Fit an image inside `rect` (keeping aspect), centred, refusing anything below `min_dpi`.

    Every product photograph we hold is 648–2100 px on its long side. At full-page size
    the median one prints near 65 dpi, which is the difference between a premium book and
    a blurred one. The guard makes that impossible to ship by accident.
    """
    pix = pymupdf.Pixmap(str(path))
    w, h = pix.width, pix.height
    scale = min(rect.width / w, rect.height / h)
    dw, dh = w * scale, h * scale
    dpi = w / (dw / 72.0)
    if dpi < min_dpi:
        raise LowResolution(f"{path.name}: {w}px at {dw:.0f}pt = {dpi:.0f} dpi < {min_dpi}")
    x0 = rect.x0 + (rect.width - dw) / 2
    y0 = rect.y0 + (rect.height - dh) / 2
    target = pymupdf.Rect(x0, y0, x0 + dw, y0 + dh)
    page.insert_image(target, filename=str(path))
    return target
```

- [ ] **Step 6: Run to see them pass**

Run: `py -m unittest discover -s scripts/catalogue -p "test_style.py" -v`
Expected: 6 tests OK. If `test_archivo_covers_the_characters_specs_use` fails for a character, add that character to the fallback test instead and note it in `style.py`'s fallback comment — do not delete the assertion.

- [ ] **Step 7: Commit**

```bash
git add scripts/requirements-catalogue.txt scripts/fonts/archivo scripts/catalogue/__init__.py scripts/catalogue/style.py scripts/catalogue/test_style.py
git commit -m "catalogue: design system, Archivo fonts, 200-dpi placement guard"
```

---

### Task 2: Families and hero photographs

**Files:**
- Create: `scripts/catalogue/heroes.py`
- Test: `scripts/catalogue/test_heroes.py`

**Interfaces:**
- Consumes: `build_catalogue.load() -> (categories, products)`, `build_catalogue.is_hyde`, `build_catalogue.plate(slug) -> Path | None` (imported from `scripts/build_catalogue.py`).
- Produces: `Family` dataclass `(slug: str, name: str, summary: str, products: list[dict], photographed: list[dict])`; `families() -> list[Family]` in `categories.json` order, empty families dropped; `HI_PLATES = ROOT/"tmp"/"catalogue-plates-hi"`; `hero_plate(product) -> Path | None` (hi-res plate); `hero_for(family, min_px=1200) -> tuple[dict, Path]` (raises `LookupError` if none qualifies).

- [ ] **Step 1: Build the high-resolution plates** (the existing 460 px plates are for the grid; heroes need more)

```bash
node scripts/build-catalogue-plates.mjs --out tmp/catalogue-plates
node scripts/build-catalogue-plates.mjs --out tmp/catalogue-plates-hi --size 2000
```
Expected: both directories filled; `--size` never enlarges (`withoutEnlargement`), so hi-res plates are the source's true size.

- [ ] **Step 2: Write the failing tests** — `scripts/catalogue/test_heroes.py`

```python
import sys, unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from catalogue import heroes

class HeroesTest(unittest.TestCase):
    def test_seventeen_families_with_the_measured_counts(self):
        fams = heroes.families()
        self.assertEqual(len(fams), 17)
        self.assertEqual(sum(len(f.products) for f in fams), 616)
        self.assertEqual(sum(len(f.photographed) for f in fams), 549)

    def test_every_family_has_a_hero_that_prints_sharp(self):
        for fam in heroes.families():
            product, path = heroes.hero_for(fam)
            from PIL import Image
            with Image.open(path) as im:
                self.assertGreaterEqual(max(im.size), 1200, fam.slug)

    def test_heroes_never_come_from_editorial_imagery(self):
        for fam in heroes.families():
            _, path = heroes.hero_for(fam)
            self.assertIn("catalogue-plates-hi", str(path))
```

- [ ] **Step 3: Run to see them fail**

Run: `py -m unittest discover -s scripts/catalogue -p "test_heroes.py" -v`
Expected: FAIL — `ImportError: cannot import name 'heroes'`.

- [ ] **Step 4: Implement** — `scripts/catalogue/heroes.py`

```python
"""Families in taxonomy order, and the photograph that opens each one.

The hero is the family's sharpest real product photograph, taken from the high-resolution
plates (cut out, watermark removed). Never the category's editorial image: those live in
public/images/editorial and may be composed scenes, which a catalogue that promises real
products cannot use.
"""
from __future__ import annotations

import sys
from dataclasses import dataclass, field
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))
import build_catalogue as legacy  # noqa: E402

HI_PLATES = ROOT / "tmp" / "catalogue-plates-hi"


@dataclass
class Family:
    slug: str
    name: str
    summary: str
    products: list[dict] = field(default_factory=list)
    photographed: list[dict] = field(default_factory=list)


def _slug(product: dict) -> str | None:
    src = (product.get("heroImage") or {}).get("src", "")
    return Path(src).stem if src else None


def families() -> list[Family]:
    categories, products = legacy.load()
    by_slug = {c["slug"]: Family(c["slug"], c["name"], c.get("summary", "")) for c in categories}
    for p in products:
        if p.get("published") is False:
            continue
        fam = by_slug.get((p.get("categoryPath") or [None])[0])
        if fam is None:
            continue
        fam.products.append(p)
        slug = _slug(p)
        if slug and legacy.plate(slug):
            fam.photographed.append(p)
    return [f for f in by_slug.values() if f.products]


def hero_plate(product: dict) -> Path | None:
    slug = _slug(product)
    path = HI_PLATES / f"{slug}.jpg" if slug else None
    return path if path and path.exists() else None


def hero_for(family: Family, min_px: int = 1200) -> tuple[dict, Path]:
    best: tuple[int, dict, Path] | None = None
    for p in family.photographed:
        path = hero_plate(p)
        if not path:
            continue
        with Image.open(path) as im:
            px = max(im.size)
        if px >= min_px and (best is None or px > best[0]):
            best = (px, p, path)
    if best is None:
        raise LookupError(f"{family.slug}: no photograph of at least {min_px}px")
    return best[1], best[2]
```

- [ ] **Step 5: Run to see them pass**

Run: `py -m unittest discover -s scripts/catalogue -p "test_heroes.py" -v`
Expected: 3 tests OK. If the counts differ from 616/549, re-measure with the HYDE filter (`is_hyde`, `published !== false`, plate exists) and update the test to the measured figure in the same commit, stating the measurement in the commit message — never loosen to `assertGreater`.
If a family has no ≥1200 px photograph, the test names it: lower that family's opener to a smaller hero box via `style.max_print_width` rather than lowering `min_px` globally.

- [ ] **Step 6: Commit**

```bash
git add scripts/catalogue/heroes.py scripts/catalogue/test_heroes.py
git commit -m "catalogue: families in taxonomy order, sharpest real photo as each opener's hero"
```

---

### Task 3: Vector QR codes

**Files:**
- Create: `scripts/catalogue/qr.py`
- Test: `scripts/catalogue/test_qr.py`

**Interfaces:**
- Produces: `family_url(slug: str) -> str` = `f"https://cantonlock.com/products/{slug}/"`; `draw_qr(page, rect, url, color=INK) -> int` (number of dark modules drawn).

- [ ] **Step 1: Write the failing tests** — `scripts/catalogue/test_qr.py`

```python
import sys, unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import pymupdf, segno
from catalogue import qr

class QrTest(unittest.TestCase):
    def test_url_shape(self):
        self.assertEqual(qr.family_url("lever-handles"), "https://cantonlock.com/products/lever-handles/")

    def test_draws_exactly_the_dark_modules_segno_encodes(self):
        url = qr.family_url("lever-handles")
        expected = sum(sum(1 for v in row if v) for row in segno.make(url, error="m").matrix)
        doc = pymupdf.open(); page = doc.new_page()
        drawn = qr.draw_qr(page, pymupdf.Rect(100, 100, 172, 172), url)
        self.assertEqual(drawn, expected)

    def test_is_vector_not_raster(self):
        doc = pymupdf.open(); page = doc.new_page()
        qr.draw_qr(page, pymupdf.Rect(100, 100, 172, 172), qr.family_url("deadbolts"))
        self.assertEqual(page.get_images(), [])
        self.assertGreater(len(page.get_drawings()), 0)
```

- [ ] **Step 2: Run to see them fail**

Run: `py -m unittest discover -s scripts/catalogue -p "test_qr.py" -v`
Expected: FAIL — `ImportError: cannot import name 'qr'`.

- [ ] **Step 3: Implement** — `scripts/catalogue/qr.py`

```python
"""QR codes as vector rectangles, so they print sharp at any size."""
from __future__ import annotations

import pymupdf
import segno

from .style import INK


def family_url(slug: str) -> str:
    return f"https://cantonlock.com/products/{slug}/"


def draw_qr(page: pymupdf.Page, rect: pymupdf.Rect, url: str, color=INK) -> int:
    """Draw `url` as a QR code filling the square fitted in `rect`; returns dark modules drawn.

    Error level M survives a fold or a smudge on a trade-fair table. The quiet zone is
    the white page around `rect`, so callers leave 4 modules of margin.
    """
    matrix = segno.make(url, error="m").matrix
    n = len(matrix)
    side = min(rect.width, rect.height)
    cell = side / n
    shape = page.new_shape()
    dark = 0
    for y, row in enumerate(matrix):
        for x, v in enumerate(row):
            if v:
                shape.draw_rect(pymupdf.Rect(rect.x0 + x * cell, rect.y0 + y * cell,
                                             rect.x0 + (x + 1) * cell, rect.y0 + (y + 1) * cell))
                dark += 1
    shape.finish(color=None, fill=color, width=0)
    shape.commit()
    return dark
```

- [ ] **Step 4: Run to see them pass**

Run: `py -m unittest discover -s scripts/catalogue -p "test_qr.py" -v`
Expected: 3 tests OK.

- [ ] **Step 5: Commit**

```bash
git add scripts/catalogue/qr.py scripts/catalogue/test_qr.py
git commit -m "catalogue: vector QR codes to each family's page"
```

---

### Task 4: The four sample pages

**Files:**
- Create: `scripts/catalogue/samples.py`
- Test: `scripts/catalogue/test_samples.py`
- Modify: `docs/superpowers/specs/2026-10-08-canton-fair-catalogue-design.md` §3 "Full-bleed" line (resolution finding)

**Interfaces:**
- Consumes: `style.*`, `qr.draw_qr`, `qr.family_url`, `heroes.families`, `heroes.hero_for`, `legacy.spec_map`, `legacy.key_labels`, `legacy.plate`.
- Produces: `render(out: Path, print_mode: bool) -> Path`; CLI `py scripts/catalogue/samples.py --out <pdf> [--print]`.

Page content (all four, in this order):
1. **Cover** — white. `HYDE` in `display-semibold` ~64 pt; brass hairline; “Door hardware · Export catalogue 2026”; “Since 1998 · Xiaolan, Zhongshan, China”; the cover hero (family `lever-handles`, its `hero_for`) large in the lower two-thirds, sized by `place_image` so it never drops below 200 dpi; company name at the foot.
2. **Factory** (front matter) — heading “A factory, not a trading office”; two confirmed client photos (`assembly-line.webp`, `press-shop.webp`) each ≤ `max_print_width(1308)` wide; three short factual paragraphs from brand-platform §一 (Xiaolan lock-export base 2004; custom tooling to drawing or sample, reworked when a design meets someone else's patent; exports to Europe, Russia, North and South America, Turkey and Southeast Asia, office in Germany). No numbers not in brand-platform §一.
3. **Opener** — family `panic-exit-devices`: brass rule + small “01”; family name `display-semibold` ~40 pt; `summary` from categories.json; “{n} models”; hero large; QR (≈22 mm) with “Full specifications online” beside it.
4. **Product page** — first 9 photographed products of `panic-exit-devices`, 3×3. Each cell: plate fitted to an identical square box (uniform scale); model in `text-semibold` 11 pt; name `text` 7.5 pt `INK2`; up to 3 key-spec rows from `legacy.key_labels(family.products)` as “Label  value”, value `—` if absent, `fit()` to the cell width. Running head: family name + folio in `BRASS`.

Print mode: each page is `TRIM` grown by `BLEED` on every side, content offset by `BLEED`, crop marks (0.25 pt, 12 pt long, starting 3 pt outside the trim corner, in the bleed-surround). Screen mode: `TRIM` only, no marks.

- [ ] **Step 1: Write the failing tests** — `scripts/catalogue/test_samples.py`

```python
import sys, tempfile, unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import pymupdf
from catalogue import samples, style

COMPANY = "Canton Hyland Hardware & Building Material Co., Ltd."

class SamplesTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        d = Path(tempfile.mkdtemp())
        cls.screen = pymupdf.open(samples.render(d / "s.pdf", print_mode=False))
        cls.press = pymupdf.open(samples.render(d / "p.pdf", print_mode=True))

    def test_four_pages_each(self):
        self.assertEqual(self.screen.page_count, 4)
        self.assertEqual(self.press.page_count, 4)

    def test_screen_is_trim_and_print_adds_3mm_bleed(self):
        self.assertAlmostEqual(self.screen[0].rect.width, 595.276, places=1)
        self.assertAlmostEqual(self.press[0].rect.width, 595.276 + 2 * style.BLEED, places=1)

    def test_fonts_embedded_are_archivo(self):
        names = {f[3] for p in self.screen for f in p.get_fonts(full=True)}
        self.assertTrue(any("Archivo" in n for n in names), names)

    def test_text_layer_has_the_exact_company_name(self):
        text = "".join(p.get_text() for p in self.screen)
        self.assertIn(COMPANY, text)
        self.assertNotIn("Canton Hyland Hardware Co., Ltd.", text)

    def test_no_certification_claimed(self):
        text = "".join(p.get_text() for p in self.screen).lower()
        for word in ("iso 9001", "certified", "tüv", "ce mark", "ul listed"):
            self.assertNotIn(word, text)

    def test_product_page_has_nine_models(self):
        fam = next(f for f in samples.heroes.families() if f.slug == "panic-exit-devices")
        text = self.screen[3].get_text()
        for p in fam.photographed[:9]:
            self.assertIn(p["model"], text)
```

- [ ] **Step 2: Run to see them fail**

Run: `py -m unittest discover -s scripts/catalogue -p "test_samples.py" -v`
Expected: FAIL — `ImportError: cannot import name 'samples'`.

- [ ] **Step 3: Implement `scripts/catalogue/samples.py`** with `render(out, print_mode)` drawing the four pages exactly as specified above, using only `style`, `qr`, `heroes` and `legacy` helpers, plus a `main()` CLI (`--out`, `--print`). Text is inserted with `page.insert_text(..., fontname=<key>, fontfile=str(style.FONT_FILES[key]))` so fonts embed; any run containing a character for which `style.has_glyph(key, ch)` is false is drawn with `"fallback"`.

- [ ] **Step 4: Run to see them pass**

Run: `py -m unittest discover -s scripts/catalogue -p "test_*.py" -v`
Expected: all tests in all four files OK.

- [ ] **Step 5: Render and look — every page, both modes**

```bash
py scripts/catalogue/samples.py --out tmp/catalogue-samples/hyde-samples-screen.pdf
py scripts/catalogue/samples.py --out tmp/catalogue-samples/hyde-samples-print.pdf --print
py -c "import pymupdf;d=pymupdf.open('tmp/catalogue-samples/hyde-samples-screen.pdf');[p.get_pixmap(dpi=110).save(f'tmp/catalogue-samples/page-{i+1}.png') for i,p in enumerate(d)]"
```
Read each PNG. Fix and re-render until: nothing clipped; the 9 plates read as one shoot (same box, same visual weight); type hierarchy clear; generous white; brass only on rules/folios; QR scans (check with a phone or `zbarimg` if available) to `https://cantonlock.com/products/panic-exit-devices/` and that URL returns 200 (`curl -sI`).

- [ ] **Step 6: Amend the spec** — in §3 replace the “Full-bleed” bullet with: “**No full-bleed photography.** Measured 2026-10-08: the client's confirmed factory photos are at most 1308 px and product photos at most 2100 px (median 1000), so full-bleed A4 would print near 150 dpi. Cover = one large real product on white; factory photos placed at ≤ `max_print_width(px)`; every raster ≥ 200 dpi, enforced by `place_image`.”

- [ ] **Step 7: Commit and push**

```bash
git add scripts/catalogue/samples.py scripts/catalogue/test_samples.py docs/superpowers/specs/2026-10-08-canton-fair-catalogue-design.md
git commit -m "catalogue: four sample pages (cover, factory, opener, product grid), print + screen"
npm run ship
```
Then confirm with `git ls-remote origin refs/heads/main` (AGENTS.md: exit 75 is ambiguous).

- [ ] **Step 8: Deliver for approval** — send `hyde-samples-screen.pdf` and the four PNGs to the client with `SendUserFile`, and ask: (a) approve the direction or list changes; (b) ISO 9001 since 2002 — is there a current certificate (print it) or not (leave it out)?; (c) are `factory-cnc-machining`, `factory-laser-cutter`, `factory-polishing-workshop-wide` the client's own photographs?

**Stop here.** The full-book renderer is planned only after the samples are approved.

---

## Out of this plan (next plan, after approval)

Full-book renderer reusing `samples.py`'s page functions: contents, finishes, how to order, all 17 openers, all product grids, “Also available” lists, model index, back cover, page count padded to a multiple of 4, bookmarks, `npm run catalogue` wiring, print/screen outputs. Written once the client has approved the sample pages, because their feedback decides the page functions it reuses.
