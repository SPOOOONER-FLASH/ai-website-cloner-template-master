"""The HYDE export catalogue, both editions, from content/products.

    py scripts/catalogue/book.py --edition electronic --out public/downloads/hyde-export-catalogue-2026.pdf
    py scripts/catalogue/book.py --edition print      --out tmp/catalogue-book/hyde-catalogue-2026-print.pdf

Electronic (the website download): every product, a full-page opener per family, 3 x 3
cards, clickable links. Print (the Canton Fair handout): every product, the opener as a
band on the family's first page, 4 x 3 cards, at most 70 pages, 3 mm bleed and crop marks.
The client chose "all products, denser" over a 393-product selection on 2026-10-08.

Two passes: the first lays the book out as a list of jobs, so the contents and the index
know every page number; the second draws.

Spec: docs/superpowers/specs/2026-10-08-canton-fair-catalogue-design.md
Plan: docs/superpowers/plans/2026-10-08-canton-fair-catalogue-full-book.md
"""
from __future__ import annotations

import argparse
import math
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Callable

import pymupdf

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from catalogue import heroes, qr, style, variants  # noqa: E402
from catalogue.heroes import legacy  # noqa: E402
from catalogue.samples import (  # noqa: E402
    COMPANY, Canvas, H, L, R, W, card_specs, cover, factory, folio, grid_plate, ordered,
)

# Supplier crops cut off at the left edge, so the whole part is not visible: a buyer
# could not order from the picture. Printed under "Also available" with specs, no image.
NO_PHOTO = {"D-1042", "D-1043", "D-3017", "D-3018"}

CONTACT = [
    ("Factory", "No. 76 Haiwei Road, Zhongshan, Guangdong, China"),
    ("Germany", "Koblenzerstr. 29, 56656 Brohl-Lützing"),
    ("Email", "tec@cantonlock.com"),
    ("Phone", "+1 703 967 7493"),
    ("Web", "cantonlock.com"),
]


@dataclass(frozen=True)
class Edition:
    name: str
    print_mode: bool
    opener: str  # "full" | "band"
    cols: int
    rows: int
    band_rows: int
    max_pages: int | None
    links: bool


ELECTRONIC = Edition("electronic", False, "full", 3, 3, 0, None, True)
PRINT = Edition("print", True, "band", 4, 3, 2, 70, False)


@dataclass
class FamilyLayout:
    family: heroes.Family
    number: int
    cards: list[variants.Card]
    listed: list[variants.Card]  # "Also available": no usable photograph
    first_page: int = 0
    band_rows: int = 0


@dataclass
class Job:
    draw: Callable[[Canvas, int], None]
    title: str = ""
    family: str = ""
    models: list[str] = field(default_factory=list)


# --------------------------------------------------------------------------- layout


def _family_layouts() -> list[FamilyLayout]:
    out = []
    for i, fam in enumerate(heroes.families(), 1):
        shown = [p for p in ordered(fam) if p.get("model") not in NO_PHOTO]
        shown_ids = {id(p) for p in shown}
        rest = [p for p in fam.products if id(p) not in shown_ids]
        out.append(FamilyLayout(fam, i, variants.cards(shown), variants.cards(rest)))
    return out


LIST_ROW = 11.5  # one "Also available" line
LIST_HEAD = 34.0


def _list_height(n: int) -> float:
    return LIST_HEAD + n * LIST_ROW if n else 0.0


def _chunks(cards: list, first: int, per: int) -> list[list]:
    pages, i = [], 0
    if first:
        pages.append(cards[:first]); i = first
    while i < len(cards):
        pages.append(cards[i:i + per]); i += per
    return pages or [[]]


def plan(edition: Edition) -> tuple[list[Job], list[FamilyLayout]]:
    fams = _family_layouts()
    jobs: list[Job] = [Job(lambda c, n: cover(c), "Cover")]
    contents_at = len(jobs)
    jobs.append(Job(lambda c, n: None, "Contents"))  # filled once page numbers are known
    jobs.append(Job(lambda c, n: factory(c, n), "The factory"))
    jobs.append(Job(how_to_order, "How to order"))
    jobs.append(Job(finishes, "Materials & finishes"))

    per = edition.cols * edition.rows
    for fl in fams:
        fl.first_page = len(jobs) + 1
        if edition.opener == "full":
            jobs.append(Job(_bind(opener_full, fl, edition), fl.family.name, fl.family.slug))
            groups = _chunks(fl.cards, 0, per)
            first_band = False
        else:
            # A third row on the band page when that saves the family a whole page:
            # deadbolts (9 cards) otherwise strands one card alone on a page of its own.
            def pages(b: int) -> int:
                return 1 + math.ceil(max(0, len(fl.cards) - edition.cols * b) / per)
            fl.band_rows = edition.band_rows + (1 if pages(edition.band_rows + 1) < pages(edition.band_rows) else 0)
            groups = _chunks(fl.cards, edition.cols * fl.band_rows, per)
            first_band = True
        for k, group in enumerate(groups):
            band = first_band and k == 0
            last = k == len(groups) - 1
            rows_used = math.ceil(len(group) / edition.cols) if group else 0
            area_rows = fl.band_rows if band else edition.rows
            free = (area_rows - rows_used) / area_rows * _grid_height(band)
            listed_here = last and fl.listed and _list_height(len(fl.listed)) <= free
            jobs.append(Job(_bind(grid_page, fl, edition, group, band, fl.listed if listed_here else []),
                            fl.family.name if band else "", fl.family.slug,
                            [m.get("model") for card in group for m in card.members]
                            + ([m.get("model") for card in fl.listed for m in card.members] if listed_here else [])))
            if last and fl.listed and not listed_here:
                jobs.append(Job(_bind(list_page, fl), "", fl.family.slug,
                                [m.get("model") for card in fl.listed for m in card.members]))

    index_entries = _index_entries(jobs)
    per_index_page = 4 * 84
    for k in range(math.ceil(len(index_entries) / per_index_page)):
        chunk = index_entries[k * per_index_page:(k + 1) * per_index_page]
        jobs.append(Job(_bind(index_page, chunk, k == 0), "Index" if k == 0 else ""))

    total = len(jobs) + 1  # + back cover
    if edition.print_mode:
        while total % 4:
            jobs.append(Job(notes_page, ""))
            total += 1
    jobs.append(Job(back_cover, "Contact"))
    if edition.max_pages and len(jobs) > edition.max_pages:
        raise ValueError(f"{edition.name}: {len(jobs)} pages > {edition.max_pages}")
    jobs[contents_at] = Job(_bind(contents, fams, jobs), "Contents")
    return jobs, fams


def _bind(fn, *args):
    return lambda c, n: fn(c, n, *args)


def _index_entries(jobs: list[Job]) -> list[tuple[str, int]]:
    seen: dict[str, int] = {}
    for i, job in enumerate(jobs, 1):
        for model in job.models:
            if model and model not in seen:
                seen[str(model)] = i
    def natural(s: str):
        return [int(t) if t.isdigit() else t.lower() for t in re.split(r"(\d+)", s)]
    return sorted(seen.items(), key=lambda kv: natural(kv[0]))


# --------------------------------------------------------------------------- pages

TOP, BOTTOM = 64, H - 58


def _grid_height(band: bool) -> float:
    return BOTTOM - (236 if band else TOP)


def section_title(c: Canvas, kicker: str, title: str) -> None:
    c.text(L, 96, kicker.upper(), 7, "text-medium", style.BRASS, track=160)
    c.text(L, 128, title, 24, "display", style.INK)


def contents(c: Canvas, n: int, fams: list[FamilyLayout], jobs: list[Job]) -> None:
    section_title(c, "Contents", "Door hardware, by family")
    y = 172
    front = [("The factory", 3), ("How to order", 4), ("Materials & finishes", 5)]
    for title, page in front:
        c.rule(L, y - 12, R, style.RULE, 0.4)
        c.text(L, y, title, 9.5, "text-medium", style.INK)
        c.text_right(R, y, str(page), 9.5, "text-medium", style.INK2)
        _link(c, L, y - 12, R, y + 4, page)
        y += 22
    y += 14
    for fl in fams:
        c.rule(L, y - 12, R, style.RULE, 0.4)
        c.text(L, y, f"{fl.number:02d}", 8, "text-semibold", style.BRASS)
        c.text(L + 30, y, fl.family.name, 10.5, "text-semibold", style.INK)
        total = sum(len(card.members) for card in fl.cards + fl.listed)
        c.text(L + 290, y, f"{total} models", 8.5, "text", style.INK3)
        c.text_right(R, y, str(fl.first_page), 10.5, "text-semibold", style.INK)
        _link(c, L, y - 12, R, y + 4, fl.first_page)
        y += 25
    index_page = next(i for i, j in enumerate(jobs, 1) if j.title == "Index")
    c.rule(L, y - 12, R, style.RULE, 0.4)
    c.text(L, y + 2, "Model index", 9.5, "text-medium", style.INK)
    c.text_right(R, y + 2, str(index_page), 9.5, "text-medium", style.INK2)
    _link(c, L, y - 12, R, y + 4, index_page)
    folio(c, n, "Contents")


def how_to_order(c: Canvas, n: int) -> None:
    section_title(c, "Ordering", "How to order")
    c.paragraph(L, 150, L + 330, 200,
                "Six values decide whether a part can be installed. Written in this order they "
                "form one reference that needs no follow-up email.", 10, "text", style.INK2)
    y = 214
    c.page.draw_rect(c.r(L, y, R, y + 58), color=None, fill=(0.965, 0.958, 0.945))
    c.text(L + 22, y + 37, "9001 — SSS — 60 — 72 — L — 45", 19, "display-semibold", style.BRASS)
    y += 96
    for code, label, note in [
        ("9001", "Model", "As printed on the product card and in the index."),
        ("SSS", "Finish code", "From Materials & finishes, page 5."),
        ("60", "Backset", "Millimetres, face of door to centre of spindle."),
        ("72", "Centre distance", "Millimetres, spindle centre to cylinder centre."),
        ("L", "Handing", "L left, R right, U universal."),
        ("45", "Door thickness", "Millimetres."),
    ]:
        c.text(L, y, code, 10, "text-semibold", style.BRASS)
        c.text(L + 70, y, label, 10, "text-semibold", style.INK)
        c.text(L + 200, y, note, 9, "text", style.INK2)
        y += 14
        c.rule(L, y, R, style.RULE, 0.4)
        y += 18
    c.paragraph(L, y + 14, L + 360, y + 90,
                "Where a value is not printed in this catalogue, it has not yet been confirmed by "
                "the factory. Ask for it rather than assuming a standard: the wrong backset is a "
                "container that cannot be installed.", 9, "text", style.INK2)
    folio(c, n, "How to order")


def finishes(c: Canvas, n: int) -> None:
    section_title(c, "Materials & finishes", "Twenty finishes, three series")
    c.paragraph(L, 150, L + 360, 196,
                "The US column is filled only where the equivalent is confirmed. A dash is a "
                "question for the factory, not a blank to be guessed at.", 9.5, "text", style.INK2)
    y = 214
    for series, rows in legacy.FINISHES:
        c.text(L, y, series.upper(), 7, "text-semibold", style.BRASS, track=140)
        y += 9
        c.rule(L, y, R, style.INK, 0.6)
        y += 17
        for code, name, us, rgb in rows:
            c.page.draw_rect(c.r(L, y - 8, L + 11, y + 3), color=style.RULE, fill=rgb, width=0.4)
            c.text(L + 20, y, code, 9, "text-semibold", style.INK)
            c.text(L + 68, y, name, 9, "text", style.INK)
            c.text_right(R, y, us or "—", 9, "text", style.INK2 if us else style.INK3)
            y += 8
            c.rule(L, y, R, style.RULE, 0.3)
            y += 12
        y += 14
    folio(c, n, "Materials & finishes")


def opener_full(c: Canvas, n: int, fl: FamilyLayout, edition: Edition) -> None:
    fam = fl.family
    c.text(L, 96, f"{fl.number:02d}", 9, "text-semibold", style.BRASS)
    c.rule(L + 22, 93, L + 70, style.BRASS, 0.8)
    c.text(L, 150, fam.name, 34 if len(fam.name) < 24 else 28, "display-semibold", style.INK)
    c.paragraph(L, 168, L + 330, 236, fam.summary, 11, "text", style.INK2, leading=1.4)
    total = sum(len(card.members) for card in fl.cards + fl.listed)
    c.text(L, 258, f"{total} MODELS", 7.5, "text-medium", style.INK3, track=140)
    if fam.slug not in heroes.PENDING_HERO:
        _, hero = heroes.hero_for(fam)
        c.hero(L, 290, R, H - 148, hero, align="right")
    _qr_block(c, fam.slug, edition, H - 128)
    folio(c, n, fam.name)


def _qr_block(c: Canvas, slug: str, edition: Edition, y: float) -> None:
    size = 58
    url = qr.family_url(slug)
    c.rule(L, y, R, style.RULE, 0.5)
    c.qr(R - size, y + 16, size, url)
    c.text(L, y + 36, "Full specifications online", 9.5, "text-semibold", style.INK)
    c.text(L, y + 51, url.replace("https://", ""), 8, "text", style.INK2)
    if edition.links:
        c.page.insert_link({"kind": pymupdf.LINK_URI, "from": c.r(L, y + 24, R, y + 16 + size), "uri": url})


def band(c: Canvas, fl: FamilyLayout, edition: Edition) -> None:
    fam = fl.family
    c.text(L, 78, f"{fl.number:02d}", 9, "text-semibold", style.BRASS)
    c.rule(L + 22, 75, L + 70, style.BRASS, 0.8)
    c.text(L, 118, fam.name, 28 if len(fam.name) < 26 else 23, "display-semibold", style.INK)
    c.paragraph(L, 132, L + 300, 184, fam.summary, 9.5, "text", style.INK2, leading=1.4)
    total = sum(len(card.members) for card in fl.cards + fl.listed)
    c.text(L, 200, f"{total} MODELS", 7, "text-medium", style.INK3, track=140)
    qs = 50
    url = qr.family_url(fam.slug)
    c.qr(R - qs, 118, qs, url)
    c.text_right(R - qs - 10, 148, "Full specifications online", 7.5, "text-semibold", style.INK)
    c.text_right(R - qs - 10, 159, url.replace("https://", ""), 6.5, "text", style.INK2)
    c.rule(L, 216, R, style.RULE, 0.5)


def grid_page(c: Canvas, n: int, fl: FamilyLayout, edition: Edition, group: list[variants.Card],
              is_band: bool, listed: list[variants.Card]) -> None:
    if is_band:
        band(c, fl, edition)
    top = 236 if is_band else TOP
    rows = fl.band_rows if is_band else edition.rows
    used = draw_cards(c, fl.family.slug, group, top, BOTTOM, edition.cols, rows)
    if listed:
        also_available(c, fl, listed, used + 10)
    folio(c, n, fl.family.name)


def list_page(c: Canvas, n: int, fl: FamilyLayout) -> None:
    also_available(c, fl, fl.listed, TOP)
    folio(c, n, fl.family.name)


def draw_cards(c: Canvas, slug: str, cards: list[variants.Card], top: float, bottom: float,
               cols: int, rows: int) -> float:
    """Cards in a grid; returns the y below the last row used."""
    dense = cols >= 4
    gx, gy = (16, 14) if dense else (22, 18)
    model_pt, name_pt, spec_pt = (10.5, 6.8, 5.9) if dense else (12, 7.5, 6.4)
    label_w = 38 if dense else 44
    cw = (R - L - (cols - 1) * gx) / cols
    ch = (bottom - top - (rows - 1) * gy) / rows
    box_h = ch * (0.52 if dense else 0.56)
    for i, card in enumerate(cards[: cols * rows]):
        col, row = i % cols, i // cols
        x0, y0 = L + col * (cw + gx), top + row * (ch + gy)
        path = grid_plate(card.product)
        if path:
            c.image(x0, y0, x0 + cw, y0 + box_h, path)
        y = y0 + box_h + (15 if dense else 18)
        # A model is never truncated: a cut-off model number is a part nobody can order.
        # Too long for one line, it steps down a size and then wraps to two.
        lines = _wrap(card.model, cw, model_pt, "text-semibold")
        size = model_pt if len(lines) == 1 else model_pt * 0.82
        lines = _wrap(card.model, cw, size, "text-semibold")[:2]
        for k, line in enumerate(lines):
            c.text(x0, y + k * (size + 1.5), line, size, "text-semibold", style.INK)
        y += (len(lines) - 1) * (size + 1.5)
        if card.name != card.model:
            c.text(x0, y + name_pt + 4, style.fit(card.name, cw, name_pt, "text"), name_pt, "text", style.INK2)
        y += name_pt + 14
        rows_out = []
        if card.finishes:
            codes = [f for f in card.finishes if f != "—"]
            label = "Also in" if "—" in card.finishes else "Finishes"
            rows_out.append((label, " · ".join(codes)))
        rows_out += card_specs(slug, card.product, 3 - len(rows_out))
        for label, value in rows_out:
            c.rule(x0, y - spec_pt - 1, x0 + cw, style.RULE, 0.35)
            c.text(x0, y + 2, label, spec_pt, "text", style.INK3)
            v = style.fit(value, cw - label_w, spec_pt, "text-medium")
            c.text_right(x0 + cw, y + 2, v, spec_pt, "text-medium",
                         style.BRASS if label in ("Finishes", "Also in") else style.INK)
            y += spec_pt + 5.6
    used_rows = math.ceil(min(len(cards), cols * rows) / cols) if cards else 0
    return top + used_rows * ch + max(0, used_rows - 1) * gy


def _wrap(text: str, width: float, size: float, key: str) -> list[str]:
    font, words, lines, line = style.FONTS[key], str(text).split(), [], ""
    for w in words:
        trial = f"{line} {w}".strip()
        if font.text_length(trial, size) <= width or not line:
            line = trial
        else:
            lines.append(line); line = w
    return lines + ([line] if line else [])


def also_available(c: Canvas, fl: FamilyLayout, cards: list[variants.Card], y: float) -> None:
    c.rule(L, y + 6, R, style.INK, 0.6)
    c.text(L, y + 22, "ALSO AVAILABLE", 7, "text-semibold", style.BRASS, track=140)
    c.text_right(R, y + 22, "Photograph on request", 7, "text", style.INK3)
    y += LIST_HEAD + 4
    for card in cards:
        specs = card_specs(fl.family.slug, card.product, 3)
        detail = "  ·  ".join(v for _, v in specs) or "—"
        c.text(L, y, style.fit(card.model, 70, 7.5, "text-semibold"), 7.5, "text-semibold", style.INK)
        c.text(L + 78, y, style.fit(card.name, 150, 7.2, "text"), 7.2, "text", style.INK2)
        c.text(L + 236, y, style.fit(detail, R - L - 236, 7.2, "text"), 7.2, "text", style.INK2)
        c.rule(L, y + 4, R, style.RULE, 0.3)
        y += LIST_ROW


def index_page(c: Canvas, n: int, entries: list[tuple[str, int]], first: bool) -> None:
    if first:
        section_title(c, "Index", "Model index")
    top = 160 if first else TOP
    col_w = (R - L) / 4
    per_col = int((BOTTOM - top) // 8.4)
    for k, (model, page) in enumerate(entries):
        col, row = divmod(k, per_col)
        if col >= 4:
            break
        x, y = L + col * col_w, top + row * 8.4
        c.text(x, y, style.fit(model, col_w - 26, 6.8, "text-medium"), 6.8, "text-medium", style.INK)
        c.text_right(x + col_w - 10, y, str(page), 6.8, "text", style.INK2)
        _link(c, x, y - 6.5, x + col_w - 10, y + 1.5, page)
    folio(c, n, "Index")


def notes_page(c: Canvas, n: int) -> None:
    c.text(L, 96, "NOTES", 7, "text-medium", style.BRASS, track=160)
    y = 130
    while y < BOTTOM - 10:
        c.rule(L, y, R, style.RULE, 0.35)
        y += 22
    folio(c, n, "Notes")


def back_cover(c: Canvas, n: int) -> None:
    c.text(L, 118, "HYDE", 44, "display-semibold", style.INK, track=40)
    c.rule(L, 136, L + 48, style.BRASS, 1.0)
    c.text(L, 160, COMPANY, 10, "text-semibold", style.INK)
    y = 214
    for label, value in CONTACT:
        c.text(L, y, label.upper(), 7, "text-medium", style.INK3, track=140)
        c.text(L + 90, y, value, 10, "text", style.INK)
        y += 26
    c.qr(R - 70, 196, 70, "https://cantonlock.com/")
    c.paragraph(L, H - 140, R, H - 70,
                "Specifications in this catalogue are taken from the factory's own records. A value "
                "that is not printed has not been confirmed; ask for it. Finishes, dimensions and "
                "packing can be made to your drawing or sample.", 8, "text", style.INK2)


# --------------------------------------------------------------------------- render


def _link(c: Canvas, x0, y0, x1, y1, page: int) -> None:
    """Queue an internal link; inserted once every page exists (a link to a page not yet
    created fails in MuPDF, and the contents page links forward to every family)."""
    if getattr(c, "links", False):
        c.pending.append((c.index, c.r(x0, y0, x1, y1), page - 1))


def render(edition: Edition, out: Path) -> Path:
    jobs, fams = plan(edition)
    out.parent.mkdir(parents=True, exist_ok=True)
    doc = pymupdf.open()
    pending: list = []
    for i, job in enumerate(jobs, 1):
        c = Canvas(doc, edition.print_mode)
        c.links, c.pending, c.index = edition.links, pending, i - 1
        job.draw(c, i)
    for index, rect, target in pending:
        doc[index].insert_link({"kind": pymupdf.LINK_GOTO, "from": rect, "page": target})
    toc = [[1, j.title, i] for i, j in enumerate(jobs, 1) if j.title]
    doc.set_toc(toc)
    doc.set_metadata({"title": f"HYDE — Export catalogue 2026 ({edition.name} edition)",
                      "author": COMPANY, "subject": "Door hardware export catalogue"})
    if not edition.print_mode:
        doc.set_pagelayout("TwoPageRight")
        doc.set_pagemode("UseOutlines")
    doc.save(out, garbage=4, deflate=True)
    return out


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--edition", choices=["electronic", "print"], required=True)
    ap.add_argument("--out", type=Path, required=True)
    a = ap.parse_args()
    ed = ELECTRONIC if a.edition == "electronic" else PRINT
    out = render(ed, a.out)
    print(f"{out}  {pymupdf.open(out).page_count} pages")


if __name__ == "__main__":
    main()
