#!/usr/bin/env python
"""A4 HYDE Canton Fair catalogue: source-faithful print review + linked digital PDF.

Run prepare-cantonfair-catalogue.mjs first. Uses ReportLab and Pillow, no source edits.
The print file is a review master: RGB source photographs do not constitute PDF/X or
a press proof. preflight.json records effective image resolution for the printer.
"""
from __future__ import annotations

import argparse
import json
import math
import re
from collections import defaultdict
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.graphics.shapes import Drawing
from reportlab.graphics import renderPDF

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "tmp/codex-cantonfair-catalogue/assets"
REPORT = ROOT / "docs/catalogues/2026-canton-fair"
PW, PH = 595.276, 841.890
INK = colors.HexColor("#202426")
MUTED = colors.HexColor("#596064")
HAIR = colors.HexColor("#D6DADB")
PALE = colors.HexColor("#EFF1F1")
BRASS = colors.HexColor("#8B7044")
WHITE = colors.white
MARGIN = 46
CONTENT = PW - MARGIN * 2
GUTTER = 25
CARD_W = (CONTENT - GUTTER) / 2
CARD_H = 205

# These names only determine reading order, not product membership or specifications.
ORDER = ["stainless-steel-handles", "lever-handles", "knob-locks", "grip-handle-sets",
         "lock-cases", "lock-cylinders", "deadbolts", "night-latches-rim-locks",
         "panic-exit-devices", "brass-steel-hinges", "door-closers",
         "glass-door-accessories", "sliding-hook-locks", "hardware-accessories",
         "bathroom-accessories"]
FEATURES = {
    "stainless-steel-handles": "9004s-stainless-steel-handle",
    "lever-handles": "6491-snet-lever-handle",
    "knob-locks": "575-cpet-tubular-lock",
    "grip-handle-sets": "70710-sn-grip-handle-set",
    "lock-cases": "140-lock-case",
    "lock-cylinders": "70-sndk-lock-cylinder",
    "deadbolts": "d102-ss-deadbolts",
    "night-latches-rim-locks": "564-night-latch-and-rim-lock",
    "panic-exit-devices": "305-fire-door-panic-exit-device",
    "brass-steel-hinges": "bl027-brass-and-steel-hinges",
    "door-closers": "ju-061-door-closer",
    "glass-door-accessories": "gl125-ss-glass-door-patch-fittings",
    "sliding-hook-locks": "s03-sliding-hook-lock",
    "hardware-accessories": "dv06-door-viewer",
    "bathroom-accessories": "bh33-bathroom-accessories",
}
PREFERRED = ["Material", "Backset", "Centre distance", "Door thickness", "Glass thickness",
             "Lever length", "Length", "Size", "Dimensions", "Spindle", "Projection",
             "Rose diameter", "Cylinder", "Finish", "Finishes", "Surface Finish"]
UNVERIFIED_LABEL = re.compile(r"certif|cycle|grade|test|standard|resistan|fire|life|capacity|load|warrant|minimum order|lead time|payment", re.I)


def clean(value):
    return re.sub(r"\s+", " ", str(value or "")).replace("\u2013", "-").replace("\u2014", "-").strip()


def wrap(value, width, font="Body", size=9):
    """Measure and wrap without truncating factual values, including long model codes."""
    words = clean(value).split()
    lines, line = [], ""
    for word in words:
        candidate = f"{line} {word}".strip()
        if pdfmetrics.stringWidth(candidate, font, size) <= width:
            line = candidate
            continue
        if line:
            lines.append(line)
            line = ""
        while pdfmetrics.stringWidth(word, font, size) > width:
            cut = len(word) - 1
            while cut > 1 and pdfmetrics.stringWidth(word[:cut], font, size) > width:
                cut -= 1
            lines.append(word[:cut])
            word = word[cut:]
        line = word
    if line:
        lines.append(line)
    return lines or [""]


def selected_specs(p, max_lines=4):
    candidates = [s for s in p.get("specs", []) if clean(s.get("value"))
                  and not UNVERIFIED_LABEL.search(s.get("label", ""))
                  and not (p["slug"] in {"bh01-bathroom-accessories", "bh02-bathroom-accessories"}
                           and s["label"] == "Length")]
    candidates.sort(key=lambda s: (PREFERRED.index(s["label"]) if s["label"] in PREFERRED else 100))
    if p.get("material") and not any(s["label"].lower() == "material" for s in candidates):
        candidates.insert(0, {"label": "Material", "value": p["material"]})
    result, line_count = [], 0
    for s in candidates:
        lines = wrap(f"{s['label']}  {s['value']}", CARD_W, size=8.5)
        if line_count + len(lines) > max_lines:
            continue
        result.extend(lines)
        line_count += len(lines)
    return result


class Book:
    def __init__(self, target, manifest, plan, mode):
        self.mode, self.data, self.plan = mode, manifest, plan
        self.c = canvas.Canvas(str(target), pagesize=(PW, PH), pageCompression=1)
        self.c.setTitle("HYDE Architectural Door Hardware - Canton Fair 2026")
        self.c.setAuthor(manifest["settings"]["legalName"])
        self.c.setSubject("English product catalogue: photographs, model references and published specifications")
        self.c.setViewerPreference("DisplayDocTitle", "true")
        self.c.setPageSize((PW, PH))
        self.c.showOutline()
        self.number = 0
        self.image_checks = []
        self.text_checks = []

    def text(self, text, x, y, size=10, font="Body", color=INK):
        self.c.setFillColor(color)
        self.c.setFont(font, size)
        text = clean(text)
        width = pdfmetrics.stringWidth(text, font, size)
        self.text_checks.append({"page": self.number, "text": text, "x": round(x, 2),
                                 "y": round(y, 2), "size": size, "width": round(width, 2)})
        self.c.drawString(x, y, text)

    def lines(self, text, x, y, width, size=10, leading=14, font="Body", color=INK):
        for line in wrap(text, width, font, size):
            self.text(line, x, y, size, font, color)
            y -= leading
        return y

    def rule(self, x1, y, x2, color=HAIR, weight=.5):
        self.c.setStrokeColor(color)
        self.c.setLineWidth(weight)
        self.c.line(x1, y, x2, y)

    def rect(self, x, y, w, h, color):
        self.c.setFillColor(color)
        self.c.rect(x, y, w, h, stroke=0, fill=1)

    def qr(self, url, x, y, side=64):
        widget = QrCodeWidget(url, barLevel="M")
        bounds = widget.getBounds()
        drawing = Drawing(side, side, transform=[side/(bounds[2]-bounds[0]), 0, 0,
                                                side/(bounds[3]-bounds[1]), 0, 0])
        drawing.add(widget)
        renderPDF.draw(drawing, self.c, x, y)
        self.c.linkURL(url, (x, y, x+side, y+side), relative=0)

    def photo(self, p, x, y, w, h):
        asset = p["catalogueAsset"]
        image_key = "printJpg" if self.mode == "print" else "jpg"
        if p["slug"] == "9014-stainless-steel-handle":
            image_key = "png"  # original dimension lines stay lossless
        file = ASSETS / asset[image_key]
        reader = ImageReader(str(file))
        iw, ih = reader.getSize()
        scale = min(w / iw, h / ih)
        dw, dh = iw * scale, ih * scale
        self.c.drawImage(reader, x+(w-dw)/2, y+(h-dh)/2, dw, dh, mask="auto")
        self.image_checks.append({"page": self.number, "model": p["model"], "slug": p["slug"],
                                  "source": asset["source"], "dpi": round(72/scale, 1),
                                  "widthPoints": round(dw, 1), "heightPoints": round(dh, 1)})

    def logo(self, x, y, w=120):
        self.c.drawImage(str(ASSETS/"hyde-logo.png"), x, y, w, w/4, mask="auto")

    def page(self, section="", bookmark=None):
        if self.number:
            self.c.showPage()
        self.number += 1
        if bookmark:
            self.c.bookmarkPage(bookmark)
        if self.number == 1:
            return
        self.text("HYDE", MARGIN, PH-32, 9, "Bold")
        self.text("ARCHITECTURAL DOOR HARDWARE", MARGIN+44, PH-32, 7, color=MUTED)
        self.rule(MARGIN, 42, PW-MARGIN)
        self.text(section.upper(), MARGIN, 28, 7.2, color=MUTED)
        self.text("cantonlock.com", PW-MARGIN-91, 28, 7.2, color=MUTED)
        self.text(f"{self.number:03d}", PW-MARGIN-14, 28, 7.2, "Bold")

    def heading(self, eyebrow, title, description=""):
        self.text(eyebrow.upper(), MARGIN, 749, 8.5, "Bold", BRASS)
        y = self.lines(title, MARGIN, 711, CONTENT, 30, 33, "Bold")
        if description:
            self.lines(description, MARGIN, y-10, CONTENT, 10, 14, color=MUTED)

    def cover(self, featured):
        self.page(bookmark="cover")
        self.c.addOutlineEntry("Cover", "cover", 0)
        self.logo(42, 720, 191)
        self.text("2026  /  CANTON FAIR EDITION", MARGIN, 681, 9, "Bold", BRASS)
        self.lines("Architectural\nDoor Hardware".replace("\n", " "), MARGIN, 627,
                   450, 38, 42, "Bold")
        self.lines("Handles. Locks. Door hardware.", MARGIN, 524, CONTENT, 13, 17, color=MUTED)
        self.photo(featured, MARGIN-6, 140, CONTENT+12, 356)
        self.text(f"{featured['model']}  /  {featured['name']}", MARGIN, 126, 9, color=MUTED)
        self.rule(MARGIN, 104, PW-MARGIN, BRASS, 1)
        self.lines(self.data["settings"]["legalName"], MARGIN, 80, CONTENT, 10, 14, "Bold")
        self.text("Zhongshan, Guangdong, China", MARGIN, 58, 9, color=MUTED)
        self.text("cantonlock.com", PW-MARGIN-111, 58, 9, "Bold")

    def contents(self):
        self.page("Contents", "contents")
        self.c.addOutlineEntry("Contents", "contents", 0)
        self.heading("Explore the range", "Find your hardware.",
                     f"{len(self.data['products'])} model references. {len(self.plan['families'])} product families.")
        y = 626
        for i, family in enumerate(self.plan["families"], 1):
            self.text(f"{i:02d}", MARGIN, y, 10, "Bold", BRASS)
            self.text(family["name"], MARGIN+35, y, 11, "Bold")
            self.text(str(len(family["products"])), PW-MARGIN-68, y, 9, color=MUTED)
            self.text(f"{family['start']:03d}", PW-MARGIN-22, y, 11, "Bold")
            self.c.linkRect("", family["slug"], (MARGIN, y-10, PW-MARGIN, y+15))
            self.rule(MARGIN, y-14, PW-MARGIN)
            y -= 32
        self.text("Ordering & enquiries", MARGIN+35, y-4, 10)
        self.text("003", PW-MARGIN-22, y-4, 10, "Bold")
        self.c.linkRect("", "ordering", (MARGIN, y-14, PW-MARGIN, y+10))
        self.text("Model index", MARGIN+35, y-34, 10)
        self.text(f"{self.plan['indexStart']:03d}", PW-MARGIN-22, y-34, 10, "Bold")
        self.c.linkRect("", "index", (MARGIN, y-44, PW-MARGIN, y-22))
        self.text("NUMBERS AT RIGHT: MODEL COUNT / PAGE", MARGIN, 75, 7.5, color=MUTED)

    def ordering(self):
        self.page("Ordering & enquiries", "ordering")
        self.c.addOutlineEntry("Ordering & enquiries", "ordering", 0)
        self.heading("Start with the part", "Make the enquiry precise.",
                     "Bring the model reference and the dimensions that decide whether it fits.")
        items = [("01", "Model & quantity", "Quote the complete model reference, including any printed suffix."),
                 ("02", "Door & preparation", "Send the door material, thickness and existing preparation dimensions."),
                 ("03", "Finish & function", "State the required finish, lock function and handing where applicable."),
                 ("04", "Destination & documents", "Tell us the delivery destination and required drawings or test documents.")]
        y = 622
        for number, title, desc in items:
            self.text(number, MARGIN, y, 20, "Bold", BRASS)
            self.text(title, MARGIN+49, y+3, 15, "Bold")
            self.lines(desc, MARGIN+49, y-18, CONTENT-49, 10, 14, color=MUTED)
            self.rule(MARGIN+49, y-53, PW-MARGIN)
            y -= 91
        self.rect(MARGIN, 150, CONTENT, 90, PALE)
        self.text("Published values stay with their model.", MARGIN+18, 215, 12, "Bold")
        self.lines("The product pages show selected published specifications. Use the online record or request the full drawing before confirming an order. Finishes and components pictured apply to the source image; confirm the supplied configuration in your quotation.",
                   MARGIN+18, 195, CONTENT-36, 9.5, 13, color=MUTED)
        email = self.data["settings"]["contact"]["brandEmail"]
        self.text(email, MARGIN, 108, 17, "Bold")
        self.c.linkURL(f"mailto:{email}", (MARGIN, 101, MARGIN+270, 125))
        self.text("Catalogue references / drawings / quotations", MARGIN, 84, 9, color=MUTED)

    def range_page(self):
        self.page("Using the catalogue", "range")
        self.c.addOutlineEntry("Using the catalogue", "range", 0)
        self.heading("Print + digital", "A reference you can use.")
        y = 618
        blocks = [("Find by family", "Use the contents to compare one type of hardware at a time. Each family begins with one real model, followed by the full illustrated range."),
                  ("Compare at the product", "Photographs, complete model references and selected specifications share the same space. Dimension images and assembly photographs remain as supplied."),
                  ("Keep the complete reference", "Finish and function suffixes are part of the model reference. Do not substitute a suffix or infer that every pictured option is supplied together."),
                  ("Continue online", "Click Full specification in the digital file, or scan the family QR code from the printed copy. The model index also links back to each product in this book.")]
        for title, desc in blocks:
            self.text(title, MARGIN, y, 16, "Bold")
            self.lines(desc, MARGIN, y-27, CONTENT-55, 11, 16, color=MUTED)
            y -= 115
        self.qr(self.data["siteUrl"]+"/products/", PW-MARGIN-81, 96, 81)
        self.text("View the online catalogue", MARGIN, 125, 13, "Bold")
        self.text("cantonlock.com/products/", MARGIN, 101, 10, color=MUTED)
        self.text("2026 edition  /  English", MARGIN, 76, 8.5, color=MUTED)

    def opener(self, family, chapter):
        self.page(family["name"], family["slug"])
        self.c.addOutlineEntry(family["name"], family["slug"], 0)
        self.text(f"{chapter:02d}", MARGIN, 731, 52, "Bold", BRASS)
        self.lines(family["name"], MARGIN, 666, CONTENT, 32, 36, "Bold")
        self.text(f"{len(family['products'])} model references", MARGIN, 567, 11, color=MUTED)
        hero = family["hero"]
        self.photo(hero, MARGIN+18, 217, CONTENT-36, 320)
        self.rule(MARGIN, 196, PW-MARGIN, BRASS, 1)
        self.text(clean(hero["model"]), MARGIN, 172, 17, "Bold")
        self.lines(hero["name"], MARGIN, 151, CONTENT-105, 10, 14, color=MUTED)
        hero_specs = selected_specs(hero, 2)
        for i, value in enumerate(hero_specs):
            self.text(value, MARGIN, 114-i*12, 9, color=MUTED)
        self.qr(self.data["siteUrl"]+f"/products/{family['slug']}/", PW-MARGIN-67, 87, 67)
        self.text("VIEW THE FAMILY", PW-MARGIN-80, 72, 7, "Bold", MUTED)

    def product_card(self, p, x, top):
        self.c.bookmarkHorizontalAbsolute("product-"+p["slug"], top)
        self.rule(x, top, x+CARD_W)
        self.photo(p, x, top-113, CARD_W, 106)
        model_lines = wrap(p["model"], CARD_W, "Bold", 11.5)
        model_y = top-131
        for line in model_lines:
            self.text(line, x, model_y, 11.5, "Bold")
            model_y -= 12.5
        name_lines = wrap(p["name"], CARD_W, size=8.5)
        if len(name_lines) > 2:
            raise ValueError(f"Product name needs extra layout: {p['slug']}")
        y = model_y-1
        for line in name_lines:
            self.text(line, x, y, 8.5, color=MUTED)
            y -= 10.5
        available = max(0, math.floor((y-(top-CARD_H+24))/10))
        specs = selected_specs(p, min(4, available))
        if not specs:
            specs = ["Specifications on request"]
        for line in specs:
            self.text(line, x, y, 8.5)
            y -= 10
        link_y = top-CARD_H+8
        if y < link_y+10:
            raise ValueError(f"Overfull product card: {p['slug']}")
        self.text("Full specification", x, link_y, 7.7, "Bold", BRASS)
        if p["slug"] == "9014-stainless-steel-handle":
            self.text("Dimension reference", x+CARD_W-92, link_y, 7.2, color=MUTED)
        if p["slug"] == "9007-stainless-steel-handle":
            self.text("Configuration reference", x+CARD_W-104, link_y, 7.2, color=MUTED)
        url = self.data["siteUrl"]+f"/products/{p['categoryPath'][0]}/{p['slug']}/"
        self.c.linkURL(url, (x, link_y-3, x+CARD_W, link_y+10))

    def product_pages(self, family):
        for offset in range(0, len(family["products"]), 6):
            self.page(family["name"])
            self.text(family["name"], MARGIN, 751, 22, "Bold")
            self.text(f"{offset+1}-{min(offset+6, len(family['products']))} / {len(family['products'])} models",
                      MARGIN, 731, 8, color=MUTED)
            for i, p in enumerate(family["products"][offset:offset+6]):
                x = MARGIN+(i%2)*(CARD_W+GUTTER)
                self.product_card(p, x, 708-(i//2)*(CARD_H+12))

    def index(self):
        indexed = sorted(self.data["products"], key=lambda p: (p["model"].casefold(), p["slug"]))
        col_w = (CONTENT-22)/2
        per_col = 30
        for offset in range(0, len(indexed), per_col*2):
            self.page("Model index", "index" if offset == 0 else None)
            if offset == 0:
                self.c.addOutlineEntry("Model index", "index", 0)
            self.heading("Find by reference", "Model index")
            for i, p in enumerate(indexed[offset:offset+per_col*2]):
                x = MARGIN+(i//per_col)*(col_w+22)
                y = 646-(i%per_col)*18.8
                page_no = self.plan["productPages"][p["slug"]]
                for line_i, line in enumerate(wrap(p["model"], col_w-34, "Body", 8.2)):
                    if line_i > 1:
                        raise ValueError(f"Index model too long: {p['model']}")
                    self.text(line, x, y-line_i*8, 8.2)
                self.text(f"{page_no:03d}", x+col_w-21, y, 8.2, "Bold", BRASS)
                self.c.linkRect("", "product-"+p["slug"], (x, y-9, x+col_w, y+8))
                self.rule(x, y-11, x+col_w, HAIR, .3)

    def enquiry_sheet(self):
        self.page("Your enquiry", "enquiry")
        self.c.addOutlineEntry("Your enquiry", "enquiry", 0)
        self.heading("At the fair", "Keep the selection together.",
                     "Write the model reference beside the requested quantity and preparation.")
        self.text("Company / buyer", MARGIN, 623, 10, "Bold")
        self.rule(MARGIN+103, 621, PW-MARGIN)
        self.text("Email / destination", MARGIN, 583, 10, "Bold")
        self.rule(MARGIN+103, 581, PW-MARGIN)
        y = 528
        self.rect(MARGIN, y-23, CONTENT, 28, PALE)
        for title, x in [("MODEL", MARGIN+10), ("QTY", MARGIN+230), ("FINISH / DOOR / NOTES", MARGIN+280)]:
            self.text(title, x, y-12, 8, "Bold")
        for row in range(7):
            self.rule(MARGIN, y-23-(row+1)*45, PW-MARGIN)
        self.text("Drawings / samples / other requirements", MARGIN, 165, 10, "Bold")
        self.rule(MARGIN, 134, PW-MARGIN)
        self.rule(MARGIN, 103, PW-MARGIN)
        self.text(self.data["settings"]["contact"]["brandEmail"], MARGIN, 73, 11, "Bold", BRASS)

    def notes(self):
        self.page("Meeting notes")
        self.heading("Follow-up", "Meeting notes")
        for y in range(623, 85, -38):
            self.rule(MARGIN, y, PW-MARGIN)

    def back_cover(self):
        self.page("Contact", "contact")
        self.c.addOutlineEntry("Contact", "contact", 0)
        self.logo(MARGIN, 707, 161)
        self.lines("Let us prepare\nyour next order.".replace("\n", " "), MARGIN, 625, CONTENT-80,
                   35, 40, "Bold")
        self.lines("Model references, door dimensions and quantities are the starting point.",
                   MARGIN, 502, CONTENT-110, 12, 17, color=MUTED)
        email = self.data["settings"]["contact"]["brandEmail"]
        self.text(email, MARGIN, 423, 23, "Bold", BRASS)
        self.c.linkURL(f"mailto:{email}", (MARGIN, 415, PW-MARGIN, 447))
        self.text("cantonlock.com", MARGIN, 389, 15, "Bold")
        self.c.linkURL(self.data["siteUrl"], (MARGIN, 382, MARGIN+200, 407))
        self.text("T "+self.data["settings"]["contact"]["phone"], MARGIN, 358, 11, color=MUTED)
        self.qr(self.data["siteUrl"]+"/contact/", MARGIN-6, 232, 105)
        self.text("CONTACT & ENQUIRIES", MARGIN+124, 294, 8.5, "Bold")
        self.lines("Scan to open the contact page. Include the catalogue model reference with your enquiry.",
                   MARGIN+124, 273, CONTENT-124, 10, 14, color=MUTED)
        self.rule(MARGIN, 192, PW-MARGIN, BRASS, 1)
        self.lines(self.data["settings"]["legalName"], MARGIN, 162, CONTENT, 11, 16, "Bold")
        c = self.data["settings"]["contact"]
        office = f"{c['address']}, {c['city']}, {c['province']}, {c['country']}"
        self.lines("Sales office: "+office, MARGIN, 132, CONTENT, 9, 13, color=MUTED)
        self.text(f"Factory: {c['factoryAddress']}, {c['city']}, {c['province']}, {c['country']}",
                  MARGIN, 89, 9, color=MUTED)
        self.text("2026 / ENGLISH", MARGIN, 65, 8, color=MUTED)

    def finish(self):
        self.c.save()
        outside = [t for t in self.text_checks if t["x"] < 20 or t["x"]+t["width"] > PW-20
                   or t["y"] < 20 or t["y"] > PH-20]
        if outside:
            raise ValueError(f"Text outside safe area: {outside[:3]}")
        return {"pages": self.number, "textItems": len(self.text_checks), "textOutsideSafeArea": outside,
                "imagePlacements": self.image_checks,
                "below180dpi": [a for a in self.image_checks if a["dpi"] < 180],
                "below300dpi": [a for a in self.image_checks if a["dpi"] < 300]}


def make_plan(data):
    families = defaultdict(list)
    for p in data["products"]:
        families[p["categoryPath"][0]].append(p)
    names = {c["slug"]: c["name"] for c in data["categories"]}
    ordered = ORDER+[key for key in families if key not in ORDER]
    page, plan = 5, {"families": [], "productPages": {}}
    for key in ordered:
        if key not in families:
            continue
        items = sorted(families[key], key=lambda p: (p["model"].casefold(), p["slug"]))
        hero = next((p for p in items if p["slug"] == FEATURES.get(key)),
                    max(items, key=lambda p: p["catalogueAsset"]["width"] * p["catalogueAsset"]["height"]))
        plan["families"].append({"slug": key, "name": names[key], "products": items, "hero": hero, "start": page})
        page += 1
        for i, p in enumerate(items):
            plan["productPages"][p["slug"]] = page+i//6
        page += math.ceil(len(items)/6)
    plan["indexStart"] = page
    page += math.ceil(len(data["products"])/60)
    page += 1  # enquiry sheet
    # Final back cover completes a multiple of four; padding carries useful meeting notes.
    plan["notePages"] = (-(page+1-1)) % 4
    plan["totalPages"] = page+plan["notePages"]
    return plan


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", type=Path, default=ROOT/"output/pdf")
    args = parser.parse_args()
    for name, filename in [("Body", "arial.ttf"), ("Bold", "arialbd.ttf")]:
        pdfmetrics.registerFont(TTFont(name, str(Path("C:/Windows/Fonts")/filename)))
    data = json.loads((ASSETS/"manifest.json").read_text(encoding="utf8"))
    plan = make_plan(data)
    args.out.mkdir(parents=True, exist_ok=True)
    REPORT.mkdir(parents=True, exist_ok=True)
    all_checks = {}
    hero = next(p for p in data["products"] if p["slug"] == "9004s-stainless-steel-handle")
    for mode in ("print", "digital"):
        name = f"hyde-canton-fair-2026-{'print-review' if mode == 'print' else 'digital'}.pdf"
        target = args.out/name
        book = Book(target, data, plan, mode)
        book.cover(hero)
        book.contents()
        book.ordering()
        book.range_page()
        for i, family in enumerate(plan["families"], 1):
            book.opener(family, i)
            book.product_pages(family)
        book.index()
        book.enquiry_sheet()
        for _ in range(plan["notePages"]):
            book.notes()
        book.back_cover()
        checks = book.finish()
        assert checks["pages"] == plan["totalPages"] and checks["pages"] % 4 == 0
        checks["file"] = str(target.relative_to(ROOT))
        checks["bytes"] = target.stat().st_size
        all_checks[mode] = checks
        print(f"{target}: {checks['pages']} pages, {checks['bytes']/1048576:.1f} MB")
    report = {"sourceDate": data["sourceDate"], "products": len(data["products"]),
              "withheldNoImage": len(data["withheld"]), "originalLibraryMounted": data["originalLibraryMounted"],
              "printStatus": "Review master only. RGB, not PDF/X. Confirm stock, binding, bleed, profile and source image quality with printer.",
              "facts": "Only existing model records and selected specifications; no certification/cycle/grade performance claims.",
              "families": [{"name": f["name"], "start": f["start"], "models": len(f["products"]),
                            "featuredModel": f["hero"]["model"]} for f in plan["families"]],
              "productPages": plan["productPages"], "editions": all_checks}
    (REPORT/"preflight.json").write_text(json.dumps(report, indent=2, ensure_ascii=False)+"\n", encoding="utf8")


if __name__ == "__main__":
    main()
