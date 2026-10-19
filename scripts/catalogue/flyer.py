"""HYDE Canton Fair flyer: a 16-face accordion (eight panels a side), the catalogue's look in your pocket.

    py scripts/catalogue/flyer.py --out-dir DIR

Client, 2026-10-11/12: a short "best of" flyer for the 140th Canton Fair, with QR codes and
a folded preview. Drafts: 10 panels (「不够流畅」), then 3 a side, then 「单侧 6页」; on 2026-10-13
the client added the rest of the fire-door pages and made it 「正反八页了 16页」. Flat 800 x 210 mm,
folds to 100 x 210.

Writes to <out-dir>:
  HYDE-flyer-2026-print.pdf    2 pages = side A and side B, 3 mm bleed, crop and fold marks
  HYDE-flyer-2026-screen.pdf   16 single panels in reading order, for email
  传单预览/*.png                both sides flat, plus folded previews (closed, and each side
                               half-open in a zigzag) drawn from the same pages

Folding (zigzag, an even number of panels): side A is A1..A8 left to right, side B is
B1..B8 left to right as printed; B1 backs A8. Folded, A8 is the cover and A1 the back
cover, both on side A. Opening the cover shows B1 | B2 (the factory, then the range with a
code per panel), and side B carries on into six product panels; side A holds six more.

Same rules as the catalogue (docs/superpowers/specs/2026-10-08-canton-fair-catalogue-design.md):
real cut-out photographs only (no as-shot plates, which carry the old supplier watermark),
spec rows only as the product states them, no certification claims, the legal name as fixed
2026-09-28. Products are chosen, not invented: featured models first, then the cards with
the most stated spec rows, one finish per design. Ink on white only (client 2026-10-11).
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

import pymupdf
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "brand"))
from catalogue import heroes, qr, samples, style, variants  # noqa: E402
import hyde_mark as hm  # noqa: E402
import kit  # noqa: E402

MM = 72 / 25.4
PANEL_W, PANEL_H, PANELS = 100 * MM, 210 * MM, 8
BLEED, SLUG = 3 * MM, 12 * MM
PAD = 6.5 * MM
COMPANY = samples.COMPANY
SITE = "https://cantonlock.com/"
CONTACT = [
    ("Factory", "No. 76 Haiwei Road, Zhongshan, Guangdong, China"),
    ("Germany", "Koblenzerstr. 29, 56656 Brohl-Lützing"),
    ("Email", "tec@cantonlock.com"),
    ("Phone", "+1 703 967 7493"),
    ("Web", "cantonlock.com"),
]
FEATURED = {"307", "311", "305", "316-D", "309-D", "302", "LC14", "564", "9014", "575", "578", "70722",
            # Alibaba models with inquiries (docs/research/2026-09-11-alibaba-product-performance.json)
            "587", "607", "5836", "1073D", "SSH016", "70BK"}

# The twelve product panels, up to ten cards each: (title, [(family slug, count or explicit
# slugs)]). The first six run on after the range panel on side B; the other six sit on side A
# between the covers.
PRODUCT_PANELS = [
    # Client 2026-10-12: the panic-exit pages of the client's own catalogue go in whole, in
    # their order — devices, then outside trims, then fire-door hardware. Explicit slugs, not
    # a pick: the client chose these models.
    ("Panic exit devices", [("panic-exit-devices", [
        "305-fire-door-panic-exit-device", "307-panic-exit-device", "311-panic-exit-device",
        "301-panic-exit-device", "302-panic-exit-device", "300-panic-exit-device", "310-panic-exit-device",
        "330-panic-exit-device", "320-two-point-locking-exit-device", "306-ps-panic-exit-device"])]),
    ("Exit devices & outside trims", [("panic-exit-devices", [
        "308-s-s-panic-exit-device", "308-d-d-panic-exit-device", "015-panic-exit-device-trim",
        "026-panic-exit-device-trim", "027-panic-exit-device-trim", "028-panic-exit-device-trim",
        "030-panic-exit-device-trim", "033-panic-exit-device-trim", "035-panic-exit-device-trim",
        "037-panic-exit-device-trim"])]),
    # Client 2026-10-12, second pass: the 309 and 316 devices, both on the client's Alibaba
    # storefront; 2026-10-13: the catalogue's page 33 (023 series) and the 016 trim.
    ("Fire-door hardware", [("panic-exit-devices", [
        "316-s-panic-exit-device", "316-d-panic-exit-device", "309-s-s-panic-exit-device",
        "309-d-double-door-panic-exit-device", "023-etan-anti-pick-panic-exit-device",
        "023-et-panic-exit-device-trim", "023-ps-panic-exit-device-trim", "036-panic-exit-device",
        "016-exterior-trim"])]),
    # Client 2026-10-13, the catalogue page of fire-door accessories: 「这些产品加上去」. This
    # supersedes the 10-12 instruction that dropped the coordinators along with the closers.
    ("Fire-door coordinators & springs", [
        ("hardware-accessories", ["dc01-door-coordinator", "dc02-door-coordinator", "dsl02-door-coordinator"]),
        ("panic-exit-devices", ["sh01-panic-exit-device"]),
        ("brass-steel-hinges", ["sh02-spring-hinge-pin"])]),
    # 6068 has the most Alibaba exposure of any lock case; the AR4 mortise locks are the newest range.
    ("Lock cases", [("lock-cases", ["6068-mortise-lever-handle-lock", "hyde-ar4-110-mortise-lock",
                                    "hyde-ar4-140-mortise-lock", "hyde-ar4-1121-hook-bolt-lock"]),
                    ("lock-cases", 6)]),
    ("Lock cylinders", [("lock-cylinders", 10)]),
    ("Lever handles", [("lever-handles", 10)]),
    # Nine of the client's Alibaba listings are stainless handles: they get a panel of their own.
    ("Stainless steel handles", [("stainless-steel-handles", [
        "9014-ssbk-stainless-steel-handle", "lh1016-stainless-steel-handle", "lh1033-ss-stainless-steel-handle",
        "9010e-stainless-steel-handle", "nc013-stainless-steel-handle", "9008s-stainless-steel-handle",
        "9021-stainless-steel-handle", "9007e-stainless-steel-handle", "nc046-stainless-steel-handle",
        "lh1056-ss-stainless-steel-handle"])]),
    ("Knob & tubular locks", [("knob-locks", ["587-sset-light-duty-cylindrical-lock", "607-sset-tubular-lock"]),
                              ("knob-locks", 8)]),
    ("Rim locks & night latches", [("night-latches-rim-locks", ["564-mb-night-latch-and-rim-lock",
                                                                "5836-night-latch-and-rim-lock",
                                                                "1073d-night-latch-and-rim-lock"]),
                                   ("night-latches-rim-locks", 7)]),
    ("Hinges & accessories", [("brass-steel-hinges", ["ssh016-brass-and-steel-hinges"]),
                              ("brass-steel-hinges", 5), ("hardware-accessories", 4)]),
    ("Glass door handles", [("glass-door-accessories", [
        "102-glass-door-handle", "100-glass-door-handle", "104-glass-door-handle", "106-glass-door-handle"]),
        ("glass-door-accessories", 6)]),
]
# Lock cases the client's principal called too old to show (2026-10-12, 「这些太老旧了」),
# with their finish variants (LC7065S, LC7065PS).
RETIRED = ("LC33-5572", "AI8530", "LC7065")
# Not on the flyer at all (client 2026-10-12): door closers and floor springs, including the
# glass-door patch fittings that sit on a floor spring. Coordinators came back on 2026-10-13 by
# name (panel above); CHOSEN keeps the auto-picks from repeating them.
EXCLUDED = re.compile(r"closer|floor.?spring|patch.?fitting", re.I)
# Models chosen by hand above are never picked again by a counted group.
CHOSEN = {s for _, groups in PRODUCT_PANELS for _, spec in groups if isinstance(spec, list) for s in spec}


def _chosen_bases() -> set[str]:
    import json
    return {_base(json.loads((style.ROOT / "content/products" / f"{s}.json").read_text(encoding="utf8"))["model"])
            for s in CHOSEN}


# The range panel: one row and one code per product panel; the code opens its first family.
RANGE = [(title, groups) for title, groups in PRODUCT_PANELS]


def _base(model: str) -> str:
    """'575 ABET' -> '575'; '6491ABET' -> '6491': one finish per design on a flyer."""
    head = re.split(r"[\s*]", str(model).strip())[0]
    return re.sub(r"(?<=\d)(AB|AC|BK|ET|MB|PB|SN|SP|SS)[A-Z]*$", "", head)


def pick(slug: str, n) -> list[variants.Card]:
    """`n` cards from a family: a count picks (featured first, most stated specs), a list of
    product slugs takes exactly those, in that order."""
    fam = next(f for f in heroes.families() if f.slug == slug)
    if isinstance(n, list):
        by_slug = {p["slug"]: p for p in samples.ordered(fam)}
        missing = [s for s in n if s not in by_slug or not samples.grid_plate(by_slug[s])]
        if missing:
            raise ValueError(f"{slug}: not published or no plate: {missing}")
        return [variants.Card(model=by_slug[s]["model"], name=by_slug[s]["name"], product=by_slug[s]) for s in n]
    chosen = _chosen_bases()
    good = [c for c in variants.cards(samples.ordered(fam))
            if heroes.hero_plate(c.product) and len(samples.card_specs(slug, c.product, 2)) >= 1
            and not re.match(r"^\d+\*\d|^\d+-\d+\s*mm$", str(c.model), re.I)  # "6*3*3mm", "19-130MM" are sizes, not models
            and c.product.get("slug") not in CHOSEN
            and _base(c.model) not in chosen
            and not EXCLUDED.search(f"{c.name} {c.product.get('slug')}")
            and not str(c.model).upper().startswith(RETIRED)]
    good.sort(key=lambda c: (_base(c.model) not in FEATURED and c.model not in FEATURED,
                             -len(samples.card_specs(slug, c.product, 3))))
    out, seen = [], set()
    for c in good:
        if _base(c.model) in seen:
            continue
        seen.add(_base(c.model))
        out.append(c)
        if len(out) == n:
            break
    return out


def panel_cards(groups) -> list[tuple[str, variants.Card]]:
    return [(slug, c) for slug, n in groups for c in pick(slug, n)]


class Sheet:
    """One side of the flat sheet. Panel i spans x in [i*PANEL_W, (i+1)*PANEL_W] in trim units."""

    def __init__(self, doc, print_mode: bool, panels: int = PANELS):
        self.panels = panels
        self.off = BLEED + SLUG if print_mode else 0.0
        w, h = panels * PANEL_W + 2 * self.off, PANEL_H + 2 * self.off
        self.page = doc.new_page(width=w, height=h)
        if print_mode:
            trim = pymupdf.Rect(self.off, self.off, self.off + panels * PANEL_W, self.off + PANEL_H)
            self.page.set_trimbox(trim)
            self.page.set_bleedbox(trim + (-BLEED, -BLEED, BLEED, BLEED))
            self._marks(trim)

    def _marks(self, trim):
        s = self.page.new_shape()
        g, ln = BLEED + 2, 10
        for x, y, dx, dy in ((trim.x0, trim.y0, -1, -1), (trim.x1, trim.y0, 1, -1),
                             (trim.x0, trim.y1, -1, 1), (trim.x1, trim.y1, 1, 1)):
            s.draw_line((x + dx * g, y), (x + dx * (g + ln), y))
            s.draw_line((x, y + dy * g), (x, y + dy * (g + ln)))
        for i in range(1, self.panels):  # fold marks, dashed, outside the bleed
            x = trim.x0 + i * PANEL_W
            s.draw_line((x, trim.y0 - g), (x, trim.y0 - g - ln))
            s.draw_line((x, trim.y1 + g), (x, trim.y1 + g + ln))
        s.finish(color=(0, 0, 0), width=0.3, dashes="[2 1] 0")
        s.commit()

    def r(self, x0, y0, x1, y1):
        return pymupdf.Rect(x0 + self.off, y0 + self.off, x1 + self.off, y1 + self.off)

    def text(self, x, y, t, size, key="text", color=style.INK, track=0.0, align="left"):
        f = style.FONTS[key]
        w = f.text_length(t, size) + size * track / 1000 * max(len(t) - 1, 0)
        x = x - w / 2 if align == "center" else x - w if align == "right" else x
        cx = x + self.off
        if not track:
            self.page.insert_text((cx, y + self.off), t, fontname="f-" + key,
                                  fontfile=str(style.FONT_FILES[key]), fontsize=size, color=color)
            return w
        for ch in t:
            self.page.insert_text((cx, y + self.off), ch, fontname="f-" + key,
                                  fontfile=str(style.FONT_FILES[key]), fontsize=size, color=color)
            cx += f.text_length(ch, size) + size * track / 1000
        return w

    def para(self, x0, y0, x1, y1, t, size, key="text", color=style.INK, leading=1.45):
        rc = self.page.insert_textbox(self.r(x0, y0, x1, y1), t, fontname="f-" + key,
                                      fontfile=str(style.FONT_FILES[key]), fontsize=size, color=color, lineheight=leading)
        if rc < 0:
            raise ValueError(f"text overflows by {-rc:.1f}pt: {t[:40]}")
        return (y1 - y0) - rc

    def rule(self, x0, y, x1, color=style.RULE, width=0.4):
        self.page.draw_line((x0 + self.off, y + self.off), (x1 + self.off, y + self.off), color=color, width=width)

    def fill(self, x0, y0, x1, y1, color):
        self.page.draw_rect(self.r(x0, y0, x1, y1), color=None, fill=color, width=0)

    def image(self, x0, y0, x1, y1, path, min_dpi=200):
        return style.place_image(self.page, self.r(x0, y0, x1, y1), path, min_dpi)

    def mark(self, x0, y0, x1, y1, mark, color=hm.INK, legal=False):
        return kit.place_mark(self.page, self.r(x0, y0, x1, y1), mark, color, legal)

    def qr(self, x0, y0, size, url):
        qr.draw_qr(self.page, self.r(x0, y0, x0 + size, y0 + size), url)


# --------------------------------------------------------------------------- panels


def cover(s: Sheet, i: int) -> None:
    x0, x1 = i * PANEL_W + PAD, (i + 1) * PANEL_W - PAD
    s.mark(x0, 16 * MM, x1, 46 * MM, hm.stacked())
    fam = next(f for f in heroes.families() if f.slug == "lever-handles")
    _, hero = heroes.hero_for(fam)
    top, bottom = 58 * MM, 150 * MM
    path = style.readable(hero)
    pix = pymupdf.Pixmap(str(path))
    mw, mh = style.max_print_width(pix.width), style.max_print_width(pix.height)
    k = min((x1 - x0) / mw, (bottom - top) / mh, 1.0)
    bw, bh = mw * k, mh * k
    s.image(x0 + (x1 - x0 - bw) / 2, bottom - bh, x0 + (x1 - x0 + bw) / 2, bottom, hero)
    s.rule(x0, 160 * MM, x0 + 14 * MM, style.INK, 1.0)
    s.para(x0, 164 * MM, x1, 190 * MM, "Door hardware, made in our own factory since 1998.", 13, "display", style.INK, 1.25)
    s.text(x0, 196 * MM, "PANIC EXIT · LOCKS · HANDLES · HINGES · GLASS DOOR", 4.9, "text-medium", style.INK3, track=90)


def factory_panel(s: Sheet, i: int) -> None:
    x0, x1 = i * PANEL_W + PAD, (i + 1) * PANEL_W - PAD
    s.text(x0, 18 * MM, "THE FACTORY", 6, "text-medium", style.INK, track=160)
    s.para(x0, 21 * MM, x1, 42 * MM, "A factory, not a trading office.", 14, "display", style.INK, 1.2)
    photo = samples.COMPANY_PHOTOS / "press-shop.webp"
    s.image(x0, 46 * MM, x1, 98 * MM, photo)
    facts = [
        ("Since 1998", "Founded in Xiaolan, Zhongshan, the town that ships close to a third of China's lock exports."),
        ("Our own parts", "We stamp, polish, assemble and inspect our own parts."),
        ("OEM & tooling", "Bring a drawing or a sample and we tool it. Much of what we make ships under our customers' brands."),
        ("Orders", "Most models start between 300 and 5,000 pieces. Samples are charged and credited against the first order."),
        ("Markets", "Europe, Russia, the Americas, Turkey and Southeast Asia. An office in Germany; a Spanish-speaking team."),
        ("Inquiries", "Send the model, finish code, quantity and door thickness. A sample confirms the rest."),
    ]
    y = 106 * MM
    for head, body in facts:
        s.text(x0, y, head.upper(), 5.6, "text-semibold", style.INK, track=100)
        used = s.para(x0, y + 2.2 * MM, x1, y + 22 * MM, body, 6.6, "text", style.INK2, 1.4)
        y += 2.2 * MM + used + 4 * MM


def back_cover(s: Sheet, i: int) -> None:
    x0, x1 = i * PANEL_W + PAD, (i + 1) * PANEL_W - PAD
    s.mark(x0 + 12 * MM, 22 * MM, x1 - 12 * MM, 36 * MM, hm.horizontal(), hm.INK)   # ink on white: the website's colours
    q = 46 * MM
    qx = x0 + (x1 - x0 - q) / 2
    s.qr(qx, 56 * MM, q, "https://cantonlock.com/")
    s.text((x0 + x1) / 2, 113 * MM, "SCAN FOR EVERY PRODUCT AND ITS FULL SPECIFICATIONS", 5.2, "text-medium", style.INK,
           track=80, align="center")
    y = 128 * MM
    for label, value in CONTACT:
        s.text(x0, y, label.upper(), 5.4, "text-medium", style.INK3, track=140)
        s.para(x0 + 17 * MM, y - 2.4 * MM, x1, y + 8 * MM, value, 7, "text", style.INK, 1.3)
        y += 11 * MM
    s.para(x0, 186 * MM, x1, 202 * MM, COMPANY, 6.2, "text-semibold", style.INK, 1.3)


def product_panel(s: Sheet, i: int, title: str, groups: list[tuple[str, int]]) -> int:
    x0, x1 = i * PANEL_W + PAD, (i + 1) * PANEL_W - PAD
    s.text(x0, 11 * MM, "SELECTED MODELS", 5.4, "text-medium", style.INK3, track=160)
    s.text(x0, 16 * MM, title.upper(), 7.2, "display-semibold", style.INK, track=40)
    s.rule(x0, 19.5 * MM, x0 + 10 * MM, style.INK, 1.0)
    q = 13 * MM
    s.qr(x1 - q, 7 * MM, q, qr.family_url(groups[0][0]))
    s.text(x0, 24.5 * MM, "Every model and its full specifications: scan the code", 5.2, "text", style.INK3)
    cards = panel_cards(groups)
    cols = 2
    rows = min(5, max(3, -(-len(cards) // cols)))  # six chosen cards get three taller rows
    gx, gy = 4 * MM, 3.2 * MM
    top, bottom = 29 * MM, PANEL_H - 8 * MM
    cw = (x1 - x0 - gx) / cols
    ch = (bottom - top - (rows - 1) * gy) / rows
    box_h = ch * 0.58
    for k, (slug, c) in enumerate(cards[: cols * rows]):
        cx0 = x0 + (k % cols) * (cw + gx)
        cy0 = top + (k // cols) * (ch + gy)
        s.image(cx0, cy0, cx0 + cw, cy0 + box_h, samples.grid_plate(c.product))
        y = cy0 + box_h + 4.2 * MM
        s.text(cx0, y, style.fit(c.model, cw, 8.2, "text-semibold"), 8.2, "text-semibold", style.INK)
        y += 3.2 * MM
        s.text(cx0, y, style.fit(c.name, cw, 5.4), 5.4, "text", style.INK2)
        for label, value in samples.card_specs(slug, c.product, 2):
            y += 3.1 * MM
            lab = style.fit(label, cw * 0.48, 4.9)
            s.text(cx0, y, lab, 4.9, "text", style.INK3)
            room = cw - style.FONTS["text"].text_length(lab, 4.9) - 4
            s.text(cx0 + cw, y, style.fit(value, max(room, 10), 4.9, "text-medium"), 4.9, "text-medium", style.INK, align="right")
    return len(cards)


def range_panel(s: Sheet, i: int) -> None:
    """The whole range on one panel: a photograph, model numbers and a code per product panel.
    Twelve rows since 2026-10-13, so the row, code and photograph scale with the count."""
    x0, x1 = i * PANEL_W + PAD, (i + 1) * PANEL_W - PAD
    s.text(x0, 18 * MM, "THE RANGE", 6, "text-medium", style.INK, track=160)
    s.para(x0, 21 * MM, x1, 36 * MM, "Scan a family for every model.", 14, "display", style.INK, 1.2)
    top = 40 * MM
    row = (PANEL_H - 8 * MM - top) / len(RANGE)
    q = min(14 * MM, row - 2 * MM)
    img_w = min(20 * MM, row * 1.4)
    for k, (title, groups) in enumerate(RANGE):
        y = top + k * row
        s.rule(x0, y, x1, style.RULE, 0.4)
        cards = panel_cards(groups)
        s.image(x0, y + 1.2 * MM, x0 + img_w, y + row - 1.2 * MM, samples.grid_plate(cards[0][1].product))
        tx = x0 + img_w + 3 * MM
        tw = x1 - q - 3 * MM - tx
        s.text(tx, y + row * 0.42, style.fit(title, tw, 7, "text-semibold"), 7, "text-semibold", style.INK)
        models = [c.model for _, c in cards][:4]
        s.text(tx, y + row * 0.72, style.fit("  ·  ".join(models), tw, 5.4), 5.4, "text", style.INK2)
        s.qr(x1 - q, y + (row - q) / 2, q, qr.family_url(groups[0][0]))
    s.rule(x0, top + len(RANGE) * row, x1, style.RULE, 0.4)


# Panels per side, left to right as printed (key, product-panel index), and reading order.
SIDE_B = [("factory", None), ("range", None)] + [(f"products-{k + 1}", k) for k in range(6)]
SIDE_A = [("back", None)] + [(f"products-{k + 1}", k) for k in range(6, 12)] + [("cover", None)]
READING = ["cover"] + [key for key, _ in SIDE_B] + [key for key, _ in SIDE_A[1:-1]] + ["back"]


def draw_panel(s: Sheet, i: int, key: str, idx) -> int:
    if key.startswith("products"):
        title, groups = PRODUCT_PANELS[idx]
        return product_panel(s, i, title, groups)
    {"cover": cover, "factory": factory_panel, "range": range_panel, "back": back_cover}[key](s, i)
    return 0


def _side(doc, mode, panels) -> int:
    s = Sheet(doc, mode)
    return sum(draw_panel(s, i, key, idx) for i, (key, idx) in enumerate(panels))


def render_sides(out: Path | None, print_mode: bool) -> tuple[pymupdf.Document, int]:
    doc = pymupdf.open()
    # One side at a time: a page object loses its document once the next page is created.
    n = _side(doc, print_mode, SIDE_A)
    n += _side(doc, print_mode, SIDE_B)
    doc.set_metadata({"title": "HYDE — Canton Fair flyer 2026", "author": COMPANY, "subject": "Door hardware"})
    if out:
        out.parent.mkdir(parents=True, exist_ok=True)
        doc.save(out, garbage=4, deflate=True)
    return doc, n


def render_screen(out: Path) -> Path:
    doc = pymupdf.open()
    where = dict(SIDE_A + SIDE_B)
    for key in READING:
        draw_panel(Sheet(doc, False, panels=1), 0, key, where[key])
    doc.set_metadata({"title": "HYDE — Canton Fair flyer 2026", "author": COMPANY, "subject": "Door hardware"})
    doc.save(out, garbage=4, deflate=True)
    return out


# --------------------------------------------------------------------------- folded previews

BG = (239, 238, 235)


def _perspective(src_size, quad):
    """PIL PERSPECTIVE coefficients mapping the output quad (tl, tr, br, bl) onto the source."""
    w, h = src_size
    a = []
    for (x, y), (u, v) in zip(quad, [(0, 0), (w, 0), (w, h), (0, h)]):
        a.append([x, y, 1, 0, 0, 0, -u * x, -u * y, u])
        a.append([0, 0, 0, x, y, 1, -v * x, -v * y, v])
    for c in range(8):  # Gauss-Jordan with partial pivoting
        p = max(range(c, 8), key=lambda r: abs(a[r][c]))
        a[c], a[p] = a[p], a[c]
        for r in range(8):
            if r != c:
                f = a[r][c] / a[c][c]
                a[r] = [x - f * y for x, y in zip(a[r], a[c])]
    return [a[r][8] / a[r][r] for r in range(8)]


def _warp(canvas, panel, quad, shade):
    coeffs = _perspective(panel.size, quad)
    img = panel.transform(canvas.size, Image.PERSPECTIVE, coeffs, Image.BICUBIC)
    mask = Image.new("L", panel.size, 255).transform(canvas.size, Image.PERSPECTIVE, coeffs, Image.BICUBIC)
    canvas.paste(ImageEnhance.Brightness(img).enhance(shade), (0, 0), mask)


def _shadow(canvas, polys, blur):
    sh = Image.new("L", canvas.size, 0)
    d = ImageDraw.Draw(sh)
    for poly in polys:
        d.polygon(poly, fill=70)
    sh = sh.filter(ImageFilter.GaussianBlur(blur))
    canvas.paste(Image.new("RGB", canvas.size, (60, 58, 54)), (0, 0), sh)


def _zigzag(panels, path):
    """The panels of one side half-open in a Z, fold edges alternately near and far."""
    w, h = panels[0].size
    pw, far = int(w * 0.82), 0.88
    n = len(panels)
    W, H = int(n * pw + 0.5 * w), int(h * 1.3)
    canvas = Image.new("RGB", (W, H), BG)
    x0, cy = (W - n * pw) // 2, H // 2 - int(0.02 * h)
    edges = [(x0 + k * pw, far if k % 2 == 0 else 1.0) for k in range(n + 1)]
    quads = []
    for k in range(n):
        (xl, sl), (xr, sr) = edges[k], edges[k + 1]
        quads.append([(xl, cy - h * sl / 2), (xr, cy - h * sr / 2), (xr, cy + h * sr / 2), (xl, cy + h * sl / 2)])
    floor = [[(q[3][0] + 18, q[3][1] - 10), (q[2][0] + 18, q[2][1] - 10), (q[2][0] + 40, q[2][1] + 22),
              (q[3][0] + 40, q[3][1] + 22)] for q in quads]
    _shadow(canvas, floor, 22)
    for k, (panel, quad) in enumerate(zip(panels, quads)):
        _warp(canvas, panel, quad, 1.0 if k % 2 == 0 else 0.86)
    canvas.save(path)


def _closed(front, back, path):
    w, h = front.size
    gap = int(0.25 * w)
    W, H = 2 * w + 3 * gap, int(h * 1.2)
    canvas = Image.new("RGB", (W, H), BG)
    y = (H - h) // 2
    spots = [(gap, front), (2 * gap + w, back)]
    _shadow(canvas, [[(x + 14, y + 18), (x + w + 14, y + 18), (x + w + 14, y + h + 18), (x + 14, y + h + 18)]
                     for x, _ in spots], 16)
    for x, img in spots:
        canvas.paste(img, (x, y))
    canvas.save(path)


def previews(doc: pymupdf.Document, out_dir: Path) -> list[Path]:
    out_dir.mkdir(parents=True, exist_ok=True)
    sides, paths = [], []
    for pno, name in ((0, "外侧-展开.png"), (1, "内侧-展开.png")):
        pix = doc[pno].get_pixmap(dpi=150)
        img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
        img.save(out_dir / name)
        paths.append(out_dir / name)
        pw = img.width // PANELS
        sides.append([img.crop((k * pw, 0, (k + 1) * pw, img.height)) for k in range(PANELS)])
    a, b = sides
    folds = [out_dir / "折叠效果-1-合起-封面与封底.png", out_dir / "折叠效果-2-内侧-工厂-产品线-六面产品.png",
             out_dir / "折叠效果-3-外侧-封底-六面产品-封面.png"]
    _closed(a[-1], a[0], folds[0])   # cover A8, back cover A1
    _zigzag(b, folds[1])
    _zigzag(a, folds[2])
    return paths + folds


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out-dir", default=str(style.ROOT / "tmp" / "claude-brand" / "out"))
    d = Path(ap.parse_args().out_dir)
    _, n = render_sides(d / "HYDE-flyer-2026-print.pdf", True)
    print(f"print: {d / 'HYDE-flyer-2026-print.pdf'} ({n} products)")
    print(f"screen: {render_screen(d / 'HYDE-flyer-2026-screen.pdf')} (16 panels in reading order)")
    flat, _ = render_sides(None, False)
    for p in previews(flat, d / "传单预览"):
        print(f"preview: {p}")


if __name__ == "__main__":
    main()
