#!/usr/bin/env python
"""Generates the HYDE export catalogue as a print-ready PDF, from content/products.

---------------------------------------------------------------------------
WHY A GENERATOR

Everything in this book except the prose is already in the repository: 435 products,
their specs, their photographs, their family tree. A catalogue laid out by hand goes
stale the first time a product changes and nobody can tell which pages are wrong. This
one is rebuilt with `npm run catalogue` and is correct by construction.

---------------------------------------------------------------------------
WHAT THIS VERSION DELIBERATELY DOES NOT HAVE

FSB's product pages carry a dimensioned line drawing. Ours cannot yet: only 31 of 435
products publish three or more geometry dimensions (see scripts/build-render-brief.mjs).
So this is the "no drawings" edition, and it is still a usable book - family overviews,
spec tables and an index are the three things a buyer actually scans. The drawings get
added when the factory sends them, and nothing here has to be redone to accept them.

Nothing is invented to fill a gap. A product with no stated backset shows an em dash.

---------------------------------------------------------------------------
DECISIONS THAT DIFFER FROM FSB, AND WHY

  PAPER SIZE   A4, not US Letter. FSB's book is the North American edition; ours goes to
               Latin America, Europe, the Middle East and Africa, where A4 is the paper
               a distributor's printer holds.

  FIELD        Products sit on the page's own white, not on the grey field the website
               uses. The grey exists because the site's background is #ffffff and a
               cut-out on white has no edge there. On paper the page IS the field.

  CREDIT LINE  FSB prints "Design: Foster + Partners". We have no design house, so the
               credit is the factory's: material, process, cycle life.

Usage:  py scripts/build_catalogue.py [out.pdf]
"""

from __future__ import annotations

import io
import json
import sys
from collections import Counter
from pathlib import Path

import pymupdf
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PRODUCTS = ROOT / "content" / "products"
PHOTOS = ROOT / "public" / "images" / "products"

# A4 in points.
PW, PH = 595.276, 841.890
TOP, BOTTOM = 54.0, 58.0
OUTER, INNER = 46.0, 58.0

INK = (0.08, 0.075, 0.06)
INK2 = (0.34, 0.32, 0.29)
INK3 = (0.55, 0.53, 0.49)
RULE = (0.84, 0.82, 0.78)
HAIR = (0.91, 0.90, 0.87)
BRASS = (0.541, 0.416, 0.122)
PAPER = (1, 1, 1)

BODY, BOLD = "helv", "hebo"

# The finish system. Codes are the ones buyers already use; the US/ANSI column is filled
# only where our own catalogue text states it - see docs artefacts. "-" is a question for
# the factory, not a blank to be guessed at.
FINISHES = [
    ("Steel Series", [
        ("SS", "Stainless Steel", "", (0.79, 0.79, 0.79)),
        ("SSS", "Satin Stainless Steel", "US32D", (0.72, 0.72, 0.72)),
        ("PSS", "Polished Stainless Steel", "US32", (0.89, 0.89, 0.89)),
        ("SP", "Bright Polished", "", (0.94, 0.94, 0.94)),
    ]),
    ("Plated Series", [
        ("PB", "Polished Brass", "US3", (0.79, 0.64, 0.15)),
        ("SB", "Satin Brass", "US4", (0.69, 0.58, 0.25)),
        ("AB", "Antique Brass", "US5", (0.54, 0.42, 0.12)),
        ("AC", "Antique Copper", "US11", (0.48, 0.29, 0.16)),
        ("CP", "Chrome Plated", "", (0.84, 0.84, 0.85)),
        ("SC", "Satin Chrome", "", (0.71, 0.72, 0.73)),
        ("SN", "Satin Nickel", "US15", (0.76, 0.74, 0.69)),
        ("NP", "Nickel Plated", "", (0.81, 0.79, 0.74)),
        ("BN", "Black Nickel", "", (0.24, 0.23, 0.22)),
        ("GP", "Gold Plated", "", (0.83, 0.70, 0.35)),
        ("ORB", "Oil Rubbed Bronze", "", (0.29, 0.21, 0.14)),
    ]),
    ("Coated Series", [
        ("MB", "Matt Black", "", (0.13, 0.13, 0.13)),
        ("PC", "Powder Coated", "", (0.36, 0.36, 0.36)),
        ("ZP", "Zinc Plated", "", (0.60, 0.63, 0.65)),
        ("PVD", "PVD", "", (0.56, 0.56, 0.57)),
    ]),
]
FINISH_CODES = [code for _, rows in FINISHES for code, *_ in rows]
# Colour lookup for the swatches, derived from the one FINISHES table above so the two
# can never drift apart.
FINISH_RGB = {code: rgb for _, rows in FINISHES for code, _n, _u, rgb in rows}


# --------------------------------------------------------------------------- data


def load() -> tuple[list[dict], list[dict]]:
    categories = json.loads((ROOT / "content" / "categories.json").read_text("utf8"))["categories"]
    products = []
    for f in sorted(PRODUCTS.glob("*.json")):
        products.append(json.loads(f.read_text("utf8")))
    return categories, products


def spec_map(product: dict) -> dict[str, str]:
    return {s["label"]: s["value"] for s in product.get("specs", [])}


def fit(text: str, width: float, size: float, font: str = BODY) -> str:
    """Trim to the measured width and mark the trim.

    Slicing by character count was the first version and it cut mid-word without saying
    so - "Stainless Steel+Ir", "1040mm(length can be a". A reader cannot tell a truncated
    value from a complete one, which on a spec table is the difference between a length
    and a wrong length. An ellipsis is a small admission that there is more.
    """
    text = " ".join(str(text).split())
    if pymupdf.get_text_length(text, font, size) <= width:
        return text
    while text and pymupdf.get_text_length(text + "…", font, size) > width:
        text = text[:-1]
    return text.rstrip(" ,;") + "…"


def key_labels(products: list[dict], n: int = 3) -> list[str]:
    """The spec labels this family actually uses, most common first.

    Chosen from the data instead of hard-coded per family: a fixed column set would print
    "Backset" over an empty column for hinges, and an empty column reads as missing data
    rather than as an inapplicable question.
    """
    skip = {"Material", "Finish", "Finishes", "Surface Finish", "Application", "Feature"}
    counts = Counter(
        s["label"] for p in products for s in p.get("specs", []) if s["label"] not in skip
    )
    # A column only earns its place if most of the family fills it. The first version took
    # the three most common labels outright and gave Panic Exit Devices a "Color" column
    # that was empty on 40 of 43 rows - and a column of dashes reads as missing data
    # rather than as a question that does not apply to this product.
    floor = max(2, len(products) * 0.4)
    return [label for label, hits in counts.most_common(n) if hits >= floor]


# ------------------------------------------------------------------------- imaging

PLATES = ROOT / "tmp" / "catalogue-plates"


def plate(slug: str) -> Path | None:
    """The pre-cut photograph from scripts/build-catalogue-plates.mjs.

    Trimming happens there rather than here, in the one function that owns the cut-out and
    the watermark test. A first version trimmed in Pillow to the non-white bounding box -
    correct-looking, and wrong: the supplier's burned-in oval is not white, so every
    thumbnail in the book came out with a floating Hyland logo above the product.
    """
    path = PLATES / f"{slug}.jpg"
    return path if path.exists() else None


def finish_codes(product: dict) -> list[str]:
    """The finish codes this model is offered in, normalised to the twenty-code system.

    Read from two places because the catalogue records them in two ways: a `finishes`
    array, and parenthesised codes inside the Finish spec string. Anything that is not one
    of the twenty is dropped rather than guessed at - a made-up finish code is a colour
    somebody orders and cannot be shipped.
    """
    found: list[str] = []
    for raw in product.get("finishes", []) or []:
        code = str(raw).strip().upper()
        if code in FINISH_CODES and code not in found:
            found.append(code)
    spec = spec_map(product)
    text = " ".join(spec.get(k, "") for k in ("Finish", "Finishes", "Surface Finish", "Color Options"))
    for token in text.replace("(", " ").replace(")", " ").split():
        code = token.strip(",;.").upper()
        if code in FINISH_CODES and code not in found:
            found.append(code)
    return found[:8]


# ---------------------------------------------------------------------- page furniture


class Book:
    def __init__(self) -> None:
        self.doc = pymupdf.open()
        self.page = None
        self.folio = 0

    def new(self, section: str | None = None, furniture: bool = True):
        self.page = self.doc.new_page(width=PW, height=PH)
        self.folio += 1
        if furniture:
            self.furniture(section)
        return self.page

    @property
    def recto(self) -> bool:
        return self.folio % 2 == 1

    def margins(self) -> tuple[float, float]:
        """Left and right text edges, mirrored so the gutter is always the inner one."""
        return (INNER, PW - OUTER) if self.recto else (OUTER, PW - INNER)

    def furniture(self, section: str | None) -> None:
        p = self.page
        left, right = self.margins()

        if section:
            # The bleed tab: FSB's is red on the outer edge so a closed book is navigable.
            w, h = 15.0, 132.0
            x = PW - w if self.recto else 0.0
            p.draw_rect(pymupdf.Rect(x, 120, x + w, 120 + h), color=None, fill=BRASS)
            p.insert_textbox(
                pymupdf.Rect(x - 60 + w / 2, 120 + h / 2 - 7, x + 60 + w / 2, 120 + h / 2 + 7),
                section.upper(), fontname=BOLD, fontsize=6.2, color=PAPER,
                align=pymupdf.TEXT_ALIGN_CENTER, rotate=90 if self.recto else 270,
            )

        y = PH - BOTTOM + 16
        p.draw_line(pymupdf.Point(left, y - 10), pymupdf.Point(right, y - 10), color=RULE, width=0.5)
        # Folio outside, imprint inside - the pair a reader uses to know where they are.
        folio_box = (pymupdf.Rect(right - 60, y - 4, right, y + 10) if self.recto
                     else pymupdf.Rect(left, y - 4, left + 60, y + 10))
        p.insert_textbox(folio_box, str(self.folio), fontname=BOLD, fontsize=7.5, color=INK,
                         align=pymupdf.TEXT_ALIGN_RIGHT if self.recto else pymupdf.TEXT_ALIGN_LEFT)
        imprint_box = (pymupdf.Rect(left, y - 4, left + 300, y + 10) if self.recto
                       else pymupdf.Rect(right - 300, y - 4, right, y + 10))
        p.insert_textbox(imprint_box, "HYDE · Canton Hyland · Zhongshan, China",
                         fontname=BODY, fontsize=7, color=INK3,
                         align=pymupdf.TEXT_ALIGN_LEFT if self.recto else pymupdf.TEXT_ALIGN_RIGHT)

    def legend(self) -> None:
        """The finish codes, repeated at the foot of every content page.

        This is the single most useful thing in FSB's book: 554 pages and the finish table
        is on all of them, so a reader never turns back. Ours is one line of codes rather
        than the full table - the same job in the space we have.
        """
        p = self.page
        left, right = self.margins()
        y = PH - BOTTOM - 2
        p.draw_line(pymupdf.Point(left, y - 12), pymupdf.Point(right, y - 12), color=HAIR, width=0.4)
        x = left
        p.insert_text(pymupdf.Point(x, y), "FINISHES", fontname=BOLD, fontsize=5.6, color=INK3)
        x += 42
        for code, _name, _us, rgb in [r for _, rows in FINISHES for r in rows]:
            p.draw_rect(pymupdf.Rect(x, y - 5, x + 5, y), color=RULE, fill=rgb, width=0.3)
            p.insert_text(pymupdf.Point(x + 7, y), code, fontname=BODY, fontsize=5.6, color=INK2)
            x += 11 + pymupdf.get_text_length(code, BODY, 5.6)

    def title(self, text: str, eyebrow: str | None = None) -> float:
        left, right = self.margins()
        y = TOP
        if eyebrow:
            self.page.insert_text(pymupdf.Point(left, y), eyebrow.upper(),
                                  fontname=BOLD, fontsize=6.4, color=INK3)
            y += 16
        self.page.insert_text(pymupdf.Point(left, y + 12), text, fontname=BOLD, fontsize=17, color=INK)
        y += 24
        self.page.draw_line(pymupdf.Point(left, y), pymupdf.Point(right, y), color=INK, width=0.9)
        return y + 22


# ------------------------------------------------------------------------- sections


def cover(book: Book) -> None:
    p = book.new(furniture=False)
    book.folio = 0
    p.draw_rect(pymupdf.Rect(0, 0, PW, PH), color=None, fill=(0.972, 0.965, 0.945))
    p.insert_text(pymupdf.Point(INNER, 190), "HYDE", fontname=BOLD, fontsize=54, color=INK)
    p.draw_line(pymupdf.Point(INNER, 214), pymupdf.Point(PW - OUTER, 214), color=BRASS, width=2)
    p.insert_textbox(pymupdf.Rect(INNER, 236, PW - OUTER, 340),
                     "Export Catalogue\n2026 · Edition 001",
                     fontname=BODY, fontsize=15, color=INK2, lineheight=1.5)
    p.insert_textbox(pymupdf.Rect(INNER, PH - 190, PW - OUTER - 140, PH - 90),
                     "Canton Hyland Hardware Co., Ltd.\n"
                     "Zhongshan, Guangdong, China\n"
                     "cantonlock.com",
                     fontname=BODY, fontsize=9, color=INK2, lineheight=1.6)
    p.insert_textbox(pymupdf.Rect(INNER, PH - 78, PW - OUTER, PH - 58),
                     "Dimensions and drawings are being added family by family. "
                     "This edition states only what the factory has confirmed.",
                     fontname=BODY, fontsize=7, color=INK3)


def contents(book: Book, plan: list[dict]) -> None:
    p = book.new()
    y = book.title("Contents")
    left, right = book.margins()
    for entry in plan:
        p.insert_text(pymupdf.Point(left, y), entry["name"], fontname=BOLD, fontsize=9.5, color=INK)
        p.insert_textbox(pymupdf.Rect(right - 60, y - 8, right, y + 4), str(entry["page"]),
                         fontname=BODY, fontsize=9, color=INK2, align=pymupdf.TEXT_ALIGN_RIGHT)
        p.insert_text(pymupdf.Point(left, y + 12), f"{entry['count']} products",
                      fontname=BODY, fontsize=7.5, color=INK3)
        y += 20
        p.draw_line(pymupdf.Point(left, y + 2), pymupdf.Point(right, y + 2), color=HAIR, width=0.4)
        y += 16
    book.legend()


def how_to_order(book: Book) -> None:
    p = book.new()
    y = book.title("How to Order", "Ordering guidelines")
    left, right = book.margins()

    p.insert_textbox(pymupdf.Rect(left, y, left + 320, y + 74),
                     "Six values decide whether a part can be installed. Written in this order "
                     "they form one reference that needs no follow-up email.",
                     fontname=BODY, fontsize=9.5, color=INK, lineheight=1.55)
    y += 84

    p.draw_rect(pymupdf.Rect(left, y, right, y + 40), color=RULE, fill=(0.98, 0.975, 0.96), width=0.6)
    p.insert_textbox(pymupdf.Rect(left, y + 13, right, y + 36), "9001 - SSS - 60 - 72 - L - 45",
                     fontname=BOLD, fontsize=15, color=BRASS, align=pymupdf.TEXT_ALIGN_CENTER)
    y += 62

    for code, label, note in [
        ("9001", "Model", "As printed in the family overview and the index."),
        ("SSS", "Finish code", "From the finish table on the following page."),
        ("60", "Backset", "Millimetres, face of door to centre of spindle."),
        ("72", "Centre distance", "Millimetres, spindle centre to cylinder centre."),
        ("L", "Handing", "L left, R right, U universal."),
        ("45", "Door thickness", "Millimetres."),
    ]:
        p.insert_text(pymupdf.Point(left, y), code, fontname=BOLD, fontsize=9, color=BRASS)
        p.insert_text(pymupdf.Point(left + 66, y), label, fontname=BOLD, fontsize=9, color=INK)
        p.insert_text(pymupdf.Point(left + 180, y), note, fontname=BODY, fontsize=8.5, color=INK2)
        y += 12
        p.draw_line(pymupdf.Point(left, y), pymupdf.Point(right, y), color=HAIR, width=0.4)
        y += 12

    y += 14
    p.insert_textbox(pymupdf.Rect(left, y, left + 330, y + 60),
                     "Where a dimension is not printed in this edition, it has not yet been "
                     "confirmed by the factory. Ask for it rather than assuming a standard: "
                     "the wrong backset is a container that cannot be installed.",
                     fontname=BODY, fontsize=8.5, color=INK2, lineheight=1.5)
    book.legend()


def finishes_page(book: Book) -> None:
    p = book.new()
    y = book.title("Materials & Finishes")
    left, right = book.margins()

    p.insert_textbox(pymupdf.Rect(left, y, left + 330, y + 46),
                     "Twenty finishes in three series. The US column is filled only where "
                     "the equivalent is confirmed; an em dash is a question for the factory.",
                     fontname=BODY, fontsize=9, color=INK2, lineheight=1.5)
    y += 58

    for series, rows in FINISHES:
        p.insert_text(pymupdf.Point(left, y), series.upper(), fontname=BOLD, fontsize=7, color=BRASS)
        y += 12
        p.draw_line(pymupdf.Point(left, y), pymupdf.Point(right, y), color=INK, width=0.7)
        y += 14
        for code, name, us, rgb in rows:
            p.draw_rect(pymupdf.Rect(left, y - 7, left + 9, y + 2), color=RULE, fill=rgb, width=0.4)
            p.insert_text(pymupdf.Point(left + 16, y), code, fontname=BOLD, fontsize=8.5, color=INK)
            p.insert_text(pymupdf.Point(left + 58, y), name, fontname=BODY, fontsize=8.5, color=INK)
            p.insert_textbox(pymupdf.Rect(right - 70, y - 8, right, y + 4), us or "-",
                             fontname=BODY, fontsize=8.5, color=INK2 if us else INK3,
                             align=pymupdf.TEXT_ALIGN_RIGHT)
            y += 11
            p.draw_line(pymupdf.Point(left, y), pymupdf.Point(right, y), color=HAIR, width=0.35)
            y += 8
        y += 12
    book.legend()


def overview_pages(book: Book, family: str, products: list[dict], page_of: dict[str, int]) -> None:
    """The family grid: picture, model, name, and the page its specs are on."""
    cols, rows = 4, 5
    per = cols * rows
    for chunk in range(0, len(products), per):
        p = book.new(family)
        first = chunk == 0
        y = book.title(family if first else f"{family} (continued)",
                       "Overview" if first else None)
        left, right = book.margins()
        cw = (right - left) / cols
        ch = (PH - BOTTOM - 34 - y) / rows

        for i, product in enumerate(products[chunk:chunk + per]):
            cx = left + (i % cols) * cw
            cy = y + (i // cols) * ch
            p.draw_line(pymupdf.Point(cx, cy), pymupdf.Point(cx + cw - 10, cy), color=INK, width=0.6)
            p.insert_text(pymupdf.Point(cx, cy + 12), str(product.get("model", ""))[:16],
                          fontname=BOLD, fontsize=8, color=INK)

            # Finish swatches instead of the product name. On a Panic Exit Devices page
            # every cell would otherwise read "Panic Exit Device" twenty times, which
            # tells a buyer nothing they did not learn from the heading. The finishes are
            # what differs between neighbouring cells, and they are what FSB prints here.
            sx = cx
            for code in finish_codes(product):
                rgb = FINISH_RGB.get(code, (0.8, 0.8, 0.8))
                p.draw_rect(pymupdf.Rect(sx, cy + 18, sx + 5.5, cy + 23.5),
                            color=RULE, fill=rgb, width=0.3)
                sx += 8
                if sx > cx + cw - 22:
                    break
            if sx == cx:
                p.insert_text(pymupdf.Point(cx, cy + 23), "finish on request",
                              fontname=BODY, fontsize=5.8, color=INK3)

            p.insert_textbox(pymupdf.Rect(cx, cy + 27, cx + cw - 12, cy + 40),
                             product.get("series") or product.get("name", ""),
                             fontname=BODY, fontsize=6.2, color=INK2)
            p.insert_text(pymupdf.Point(cx, cy + 46), f"Page {page_of.get(product['slug'], '-')}",
                          fontname=BODY, fontsize=6.2, color=INK3)
            img = plate(product["slug"])
            if img:
                box = pymupdf.Rect(cx, cy + 52, cx + cw - 12, cy + ch - 12)
                p.insert_image(box, filename=str(img), keep_proportion=True)
        book.legend()


def spec_pages(book: Book, family: str, products: list[dict], page_of: dict[str, int]) -> None:
    """The dense spec table - the page a buyer scans with a pen."""
    labels = key_labels(products)
    per = 26
    for chunk in range(0, len(products), per):
        p = book.new(family)
        y = book.title(f"{family} - Specifications", None if chunk else "Specifications")
        left, right = book.margins()

        widths = [58, 148, 96]
        rest = right - left - sum(widths)
        each = rest / max(1, len(labels))
        heads = ["Model", "Product", "Material"] + labels
        x = left
        for head, w in zip(heads, widths + [each] * len(labels)):
            p.insert_text(pymupdf.Point(x, y), head[:18].upper(), fontname=BOLD, fontsize=5.8, color=INK3)
            x += w
        y += 6
        p.draw_line(pymupdf.Point(left, y), pymupdf.Point(right, y), color=INK, width=0.7)
        y += 11

        for product in products[chunk:chunk + per]:
            page_of[product["slug"]] = book.folio
            specs = spec_map(product)
            cells = [
                str(product.get("model", "")),
                product.get("name", ""),
                product.get("material") or specs.get("Material", "-"),
            ] + [specs.get(label, "-") for label in labels]
            x = left
            for j, (cell, w) in enumerate(zip(cells, widths + [each] * len(labels))):
                p.insert_text(pymupdf.Point(x, y), fit(cell, w - 6, 6.6, BOLD if j == 0 else BODY),
                              fontname=BOLD if j == 0 else BODY, fontsize=6.6,
                              color=INK if j < 2 else INK2)
                x += w
            y += 7
            p.draw_line(pymupdf.Point(left, y), pymupdf.Point(right, y), color=HAIR, width=0.3)
            y += 7
        book.legend()


def index_pages(book: Book, products: list[dict], page_of: dict[str, int]) -> None:
    entries = sorted(
        ((str(p.get("model", "")).strip(), p.get("name", ""), page_of.get(p["slug"], "-")) for p in products),
        key=lambda e: (e[0].lstrip("0") or e[0]).lower(),
    )
    cols, per_col = 2, 46
    per = cols * per_col
    for chunk in range(0, len(entries), per):
        p = book.new("Index")
        y0 = book.title("Product Number Index" if chunk == 0 else "Product Number Index (continued)")
        left, right = book.margins()
        cw = (right - left) / cols
        for i, (model, name, page) in enumerate(entries[chunk:chunk + per]):
            cx = left + (i // per_col) * cw
            cy = y0 + (i % per_col) * 13
            p.insert_text(pymupdf.Point(cx, cy), model[:14], fontname=BOLD, fontsize=6.8, color=INK)
            p.insert_text(pymupdf.Point(cx + 58, cy), name[:34], fontname=BODY, fontsize=6.8, color=INK2)
            p.insert_textbox(pymupdf.Rect(cx + cw - 46, cy - 7, cx + cw - 14, cy + 3), str(page),
                             fontname=BODY, fontsize=6.8, color=INK3, align=pymupdf.TEXT_ALIGN_RIGHT)
        book.legend()


# ------------------------------------------------------------------------------ run


def build(out: Path) -> Path:
    categories, products = load()
    by_family: dict[str, list[dict]] = {}
    for product in products:
        by_family.setdefault(product.get("categoryPath", ["hardware-accessories"])[0], []).append(product)
    for items in by_family.values():
        items.sort(key=lambda p: str(p.get("model", "")))

    order = [c for c in categories if c["slug"] in by_family]

    """
    TWO PASSES, BECAUSE A CONTENTS PAGE CITES PAGES THAT DO NOT EXIST YET.

    The overview grid prints "Page 74" beside each product, and the contents prints the
    first page of each family. Both are only known once the body has been laid out. So the
    book is built twice: the first pass throws its PDF away and keeps the page map, the
    second pass renders with real numbers. Cheaper and far more legible than trying to
    back-patch text into a finished page.
    """
    page_of: dict[str, int] = {}
    book = Book()
    for final in (False, True):
        book = Book()
        cover(book)
        contents(book, [
            {"name": c["name"], "count": len(by_family[c["slug"]]),
             "page": page_of.get(f"__family__{c['slug']}", "-")}
            for c in order
        ])
        how_to_order(book)
        finishes_page(book)

        for category in order:
            items = by_family[category["slug"]]
            page_of[f"__family__{category['slug']}"] = book.folio + 1
            overview_pages(book, category["name"], items, page_of)
            spec_pages(book, category["name"], items, page_of)

        index_pages(book, products, page_of)
        if not final:
            book.doc.close()

    book.doc.set_metadata({
        "title": "HYDE Export Catalogue 2026 - Edition 001",
        "author": "Canton Hyland Hardware Co., Ltd.",
        "subject": "Architectural door hardware",
        "keywords": "door hardware, panic exit device, mortise lock, lever handle, hinge",
    })
    book.doc.save(out, garbage=4, deflate=True)
    return out


if __name__ == "__main__":
    target = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "public" / "downloads" / "hyde-export-catalogue-2026.pdf"
    target.parent.mkdir(parents=True, exist_ok=True)
    written = build(target)
    doc = pymupdf.open(written)
    print(f"{written}  {doc.page_count} pages  {written.stat().st_size / 1_048_576:.1f} MB")
