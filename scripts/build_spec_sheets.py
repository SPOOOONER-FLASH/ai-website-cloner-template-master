#!/usr/bin/env python
"""One-page A4 spec sheet per HYDE product, as a PDF, from content/products.

---------------------------------------------------------------------------
WHY

The client's 2026-09-28 list asked for "每款产品单页规格 PDF". A buyer forwards a spec
sheet to the architect, the site team and the purchasing office; a web page does not
survive that trip, a PDF does.

---------------------------------------------------------------------------
WHAT IS PRINTED, AND WHAT IS NOT

Every value on a sheet is a value the product page already publishes: the spec rows,
the feature lines, the finish codes, the photograph. Nothing is inferred. The factory
data is known to be incomplete (finishes, fixing holes, order codes), so a sheet says
what it does not state in a "Confirm on order" line instead of leaving a buyer to assume.

A product only gets a sheet when there is something worth sending:
  · on the HYDE catalogue (same predicate as the site and the export catalogue)
  · a photograph (the site does not publish a product without one either)
  · a confirmed model code (modelTbc records have none to order against)
  · at least MIN_ROWS spec rows other than Material / Finish / Function
Everything else is listed, with the reason, in docs/research/spec-sheet-gaps.md.

---------------------------------------------------------------------------
OUTPUTS (all regenerated, never hand-edited)

  public/downloads/spec-sheets/<slug>.pdf     the sheets
  src/data/generated/spec-sheets.json         slugs with a sheet; the product page reads it
  docs/research/spec-sheet-gaps.md            who has no sheet and why, and what each sheet lacks

Usage:  npm run spec-sheets
        (= node scripts/build-catalogue-plates.mjs && py scripts/build_spec_sheets.py)
"""

from __future__ import annotations

import json
import re
import sys
from collections import Counter
from datetime import date
from pathlib import Path

import pymupdf

sys.path.insert(0, str(Path(__file__).resolve().parent))
from build_catalogue import (  # noqa: E402  (reuse the catalogue's rules, do not fork them)
    BODY, BOLD, BRASS, FINISH_RGB, HAIR, INK, INK2, INK3, PAPER, PH, PLATES, PW, ROOT, RULE,
    finish_codes, is_hyde, spec_map,
)

OUT = ROOT / "public" / "downloads" / "spec-sheets"
MANIFEST = ROOT / "src" / "data" / "generated" / "spec-sheets.json"
REPORT = ROOT / "docs" / "research" / "spec-sheet-gaps.md"
SITE = "https://www.cantonlock.com"

MIN_ROWS = 3
THIN = {"Material", "Finish", "Finishes", "Surface Finish", "Function"}
M = 44.0  # page margin

FIXING = re.compile(r"fix|hole|screw|mount|centre|center|spindle", re.I)
DIMENSION = re.compile(r"\d\s*(mm|cm|in|\")", re.I)


def load_products() -> list[dict]:
    out = []
    for f in sorted((ROOT / "content" / "products").glob("*.json")):
        p = json.loads(f.read_text("utf8"))
        if is_hyde(p):
            out.append(p)
    return out


def category_names() -> dict[str, str]:
    cats = json.loads((ROOT / "content" / "categories.json").read_text("utf8"))["categories"]
    return {c["slug"]: c["name"] for c in cats}


def photo_for(p: dict) -> Path | None:
    src = (p.get("heroImage") or {}).get("src")
    if not src:
        return None
    path = PLATES / f"{Path(src).stem}.jpg"
    return path if path.exists() else None


def eligibility(p: dict) -> str | None:
    """None when the product gets a sheet, otherwise the reason it does not."""
    if not (p.get("heroImage") or {}).get("src"):
        return "no photograph (not published on the site)"
    if p.get("modelTbc"):
        return "model code not confirmed"
    rows = [s for s in p.get("specs", []) if s.get("label") not in THIN and str(s.get("value", "")).strip()]
    if len(rows) < MIN_ROWS:
        return f"{len(rows)} spec rows beyond material/finish/function (needs {MIN_ROWS})"
    if not photo_for(p):
        return "no catalogue plate for its photograph (numbered gallery file or outside /images/products)"
    return None


def gaps(p: dict) -> list[str]:
    """What this sheet cannot state. Printed on the sheet and in the report."""
    specs = p.get("specs", [])
    labels = " ".join(s["label"] for s in specs)
    values = " ".join(str(s["value"]) for s in specs)
    out = []
    if not finish_codes(p):
        out.append("finish codes")
    if not FIXING.search(labels):
        out.append("fixing-hole positions")
    if not DIMENSION.search(values):
        out.append("overall dimensions")
    out.append("order code per finish")  # no record in content/products carries one yet
    return out


# ------------------------------------------------------------------ drawing helpers


def text_height(text: str, width: float, size: float, font: str = BODY) -> float:
    """Height insert_textbox will need, measured by a dry run on a scratch page."""
    scratch = pymupdf.open().new_page(width=width + 10, height=2000)
    spare = scratch.insert_textbox(pymupdf.Rect(0, 0, width, 2000), text, fontname=font, fontsize=size)
    return 2000 - spare


SETTINGS = json.loads((ROOT / "content" / "site-settings.json").read_text("utf8"))


def draw_sheet(p: dict, cat: str, today: str) -> pymupdf.Document:
    doc = pymupdf.open()
    page = doc.new_page(width=PW, height=PH)
    right = PW - M
    url = f"{SITE}/products/{p['categoryPath'][0]}/{p['slug']}/"

    # Masthead
    page.draw_rect(pymupdf.Rect(0, 0, PW, 6), color=None, fill=BRASS)
    page.insert_text(pymupdf.Point(M, 40), "HYDE · CANTON HYLAND", fontname=BOLD, fontsize=7.5, color=INK3)
    page.insert_textbox(pymupdf.Rect(right - 200, 32, right, 44), "PRODUCT SPECIFICATION SHEET",
                        fontname=BOLD, fontsize=7.5, color=INK3, align=pymupdf.TEXT_ALIGN_RIGHT)
    page.insert_text(pymupdf.Point(M, 78), p["model"], fontname=BOLD, fontsize=26, color=INK)
    page.insert_text(pymupdf.Point(M, 98), p.get("name", ""), fontname=BODY, fontsize=12, color=INK2)
    page.insert_text(pymupdf.Point(M, 114), cat, fontname=BODY, fontsize=8.5, color=INK3)
    page.draw_line(pymupdf.Point(M, 126), pymupdf.Point(right, 126), color=INK, width=0.9)

    # Photograph, left column
    top = 142
    photo = photo_for(p)
    img_box = pymupdf.Rect(M, top, M + 220, top + 220)
    page.draw_rect(img_box, color=HAIR, width=0.5)
    if photo:
        page.insert_image(img_box + (8, 8, -8, -8), filename=str(photo), keep_proportion=True)

    # Spec table, right column (every row, wrapped, never trimmed)
    x0, x1 = M + 240, right
    label_w = 92
    y = top
    page.insert_text(pymupdf.Point(x0, y + 8), "SPECIFICATIONS", fontname=BOLD, fontsize=7, color=INK3)
    y += 16
    for row in p.get("specs", []):
        value = " ".join(f"{row['value']} {row.get('unit', '')}".split())
        if not value:
            continue
        h = max(text_height(value, x1 - x0 - label_w, 8.5), text_height(row["label"], label_w - 8, 8.5, BOLD))
        if y + h > PH - 230:
            page.insert_text(pymupdf.Point(x0, y + 9), "More rows on the product page.", fontname=BODY, fontsize=8, color=INK3)
            y += 16
            break
        page.insert_textbox(pymupdf.Rect(x0, y, x0 + label_w - 8, y + h + 2), row["label"],
                            fontname=BOLD, fontsize=8.5, color=INK)
        page.insert_textbox(pymupdf.Rect(x0 + label_w, y, x1, y + h + 2), value,
                            fontname=BODY, fontsize=8.5, color=INK2)
        y += h + 5
        page.draw_line(pymupdf.Point(x0, y - 2), pymupdf.Point(x1, y - 2), color=HAIR, width=0.4)
        y += 3

    # Below both columns: features, finishes, what to confirm
    y = max(y, img_box.y1) + 22
    features = [f for f in (p.get("features") or []) if f.strip()]
    if features:
        page.insert_text(pymupdf.Point(M, y), "FEATURES", fontname=BOLD, fontsize=7, color=INK3)
        y += 8
        for f in features[:8]:
            h = text_height(f"-  {f}", right - M, 9)
            page.insert_textbox(pymupdf.Rect(M, y, right, y + h + 2), f"-  {f}", fontname=BODY, fontsize=9, color=INK2)
            y += h + 3
        y += 14

    codes = finish_codes(p)
    if codes:
        page.insert_text(pymupdf.Point(M, y), "FINISH CODES", fontname=BOLD, fontsize=7, color=INK3)
        y += 12
        x = M
        for code in codes:
            page.draw_rect(pymupdf.Rect(x, y - 7, x + 9, y + 2), color=RULE, fill=FINISH_RGB.get(code, PAPER), width=0.3)
            page.insert_text(pymupdf.Point(x + 13, y + 1), code, fontname=BOLD, fontsize=8.5, color=INK)
            x += 22 + pymupdf.get_text_length(code, BOLD, 8.5)
        y += 24

    missing = gaps(p)
    note = ("Not stated in our published data, so confirm on the order: " + ", ".join(missing) + ".")
    page.insert_text(pymupdf.Point(M, y), "CONFIRM ON ORDER", fontname=BOLD, fontsize=7, color=INK3)
    y += 8
    page.insert_textbox(pymupdf.Rect(M, y, right, y + 40), note, fontname=BODY, fontsize=8.5, color=INK2)

    # Footer
    fy = PH - 64
    page.draw_line(pymupdf.Point(M, fy), pymupdf.Point(right, fy), color=RULE, width=0.5)
    page.insert_textbox(
        pymupdf.Rect(M, fy + 8, right, fy + 44),
        f"As published on cantonlock.com on {today}. The order confirmation is the binding specification.\n"
        f"{url}   ·   {SETTINGS['contact']['email']}   ·   {SETTINGS['legalName']}, "
        f"{SETTINGS['contact']['city']}, {SETTINGS['contact']['province']}, {SETTINGS['contact']['country']}",
        fontname=BODY, fontsize=7.2, color=INK3,
    )

    doc.set_metadata({
        "title": f"{p['model']} {p.get('name', '')} specification sheet",
        "author": SETTINGS["legalName"],
        "subject": f"{p['model']} {p.get('name', '')}",
        "creator": "scripts/build_spec_sheets.py",
        "creationDate": "", "modDate": "",
    })
    return doc


def main() -> None:
    today = date.today().isoformat()
    cats = category_names()
    OUT.mkdir(parents=True, exist_ok=True)
    made, skipped, gap_rows = [], [], []

    for p in load_products():
        reason = eligibility(p)
        if reason:
            skipped.append((p, reason))
            continue
        doc = draw_sheet(p, cats.get(p["categoryPath"][0], ""), today)
        doc.save(OUT / f"{p['slug']}.pdf", garbage=4, deflate=True)
        made.append(p["slug"])
        gap_rows.append((p, gaps(p)))

    # Sheets for products that no longer qualify must not linger in public/.
    keep = {f"{s}.pdf" for s in made}
    for old in OUT.glob("*.pdf"):
        if old.name not in keep:
            old.unlink()

    MANIFEST.write_text(json.dumps(sorted(made), indent=1) + "\n", "utf8")

    reasons = Counter(r if not r.startswith(tuple("0123456789")) else f"fewer than {MIN_ROWS} spec rows beyond material/finish/function" for _, r in skipped)
    gap_count = Counter(g for _, gs in gap_rows for g in gs)
    lines = [
        "# Spec sheet coverage and gaps",
        "",
        "Generated by `npm run spec-sheets` (scripts/build_spec_sheets.py). Do not edit by hand.",
        "",
        f"HYDE products: {len(made) + len(skipped)}. Sheets generated: {len(made)}. Without a sheet: {len(skipped)}.",
        "",
        "## Why a product has no sheet",
        "",
        "| Reason | Products |",
        "| --- | --- |",
        *[f"| {r} | {n} |" for r, n in reasons.most_common()],
        "",
        "## What the generated sheets cannot state",
        "",
        "Each sheet prints these under \"Confirm on order\". Filling them needs factory data.",
        "",
        "| Missing | Sheets |",
        "| --- | --- |",
        *[f"| {g} | {n} |" for g, n in gap_count.most_common()],
        "",
        "## Products without a sheet",
        "",
        "| Model | Slug | Reason |",
        "| --- | --- | --- |",
        *[f"| {p['model']} | {p['slug']} | {r} |" for p, r in sorted(skipped, key=lambda x: x[0]['slug'])],
        "",
    ]
    REPORT.write_text("\n".join(lines), "utf8")
    print(f"{len(made)} sheets, {len(skipped)} without -> {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
