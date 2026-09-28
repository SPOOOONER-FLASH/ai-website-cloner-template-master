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

  public/downloads/spec-sheets/<slug>.pdf     English sheets
  public/downloads/spec-sheets/<loc>/<slug>.pdf   the nine other site languages
  src/data/generated/spec-sheets.json         slugs with a sheet; the product page reads it
  docs/research/spec-sheet-gaps.md            who has no sheet and why, and what each sheet lacks

The sheets carry no date, so a regeneration only rewrites the files whose data changed.

Usage:  npm run spec-sheets             (all ten languages)
        py scripts/build_spec_sheets.py de ja   (only those)
        (= node scripts/build-catalogue-plates.mjs && py scripts/build_spec_sheets.py)
"""

from __future__ import annotations

import io
import json
import re
import sys
from collections import Counter
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


# ------------------------------------------------------------------ locales
#
# Ten sheets per product, one per site locale, each reading the same fields the product
# page reads in that locale: es/pt from nameEs/specsEs/featuresEs (…Pt), the seven market
# locales from the overlay in content/i18n/<code>/ with glossary.specLabels for row labels.
# A field with no translation falls back to English, exactly as the page does.
#
# Text is set with insert_htmlbox, whose built-in fallback fonts cover Cyrillic, Turkish,
# CJK, Hangul and shaped Arabic; fonts are subset, so a sheet stays in the tens of KB.

LOCALES = ["en", "es", "pt", "fr", "de", "ja", "ko", "tr", "ru", "ar"]
OVERLAY = ["fr", "de", "ja", "ko", "tr", "ru", "ar"]

UI = {
    "en": dict(sheet="Product specification sheet", specs="Specifications", features="Features", finishes="Finish codes", confirm="Confirm on order",
               note="Not stated in our published data, so confirm on the order: {items}.", more="More rows on the product page.",
               foot="As published on cantonlock.com. The order confirmation is the binding specification.",
               gap={"finish codes": "finish codes", "fixing-hole positions": "fixing-hole positions", "overall dimensions": "overall dimensions", "order code per finish": "order code per finish"}),
    "es": dict(sheet="Ficha técnica de producto", specs="Especificaciones", features="Características", finishes="Códigos de acabado", confirm="Confirmar en el pedido",
               note="No figura en nuestros datos publicados; confírmelo en el pedido: {items}.", more="Más filas en la página del producto.",
               foot="Según lo publicado en cantonlock.com. La confirmación del pedido es la especificación vinculante.",
               gap={"finish codes": "códigos de acabado", "fixing-hole positions": "posición de los agujeros de fijación", "overall dimensions": "dimensiones generales", "order code per finish": "código de pedido por acabado"}),
    "pt": dict(sheet="Ficha técnica do produto", specs="Especificações", features="Características", finishes="Códigos de acabamento", confirm="Confirmar no pedido",
               note="Não consta em nossos dados publicados; confirme no pedido: {items}.", more="Mais linhas na página do produto.",
               foot="Conforme publicado em cantonlock.com. A confirmação do pedido é a especificação válida.",
               gap={"finish codes": "códigos de acabamento", "fixing-hole positions": "posição dos furos de fixação", "overall dimensions": "dimensões gerais", "order code per finish": "código de pedido por acabamento"}),
    "fr": dict(sheet="Fiche technique produit", specs="Caractéristiques techniques", features="Points clés", finishes="Codes de finition", confirm="À confirmer à la commande",
               note="Non indiqué dans nos données publiées, à confirmer à la commande : {items}.", more="Autres lignes sur la page produit.",
               foot="Tel que publié sur cantonlock.com. La confirmation de commande fait foi.",
               gap={"finish codes": "codes de finition", "fixing-hole positions": "position des trous de fixation", "overall dimensions": "dimensions hors tout", "order code per finish": "référence de commande par finition"}),
    "de": dict(sheet="Produktdatenblatt", specs="Technische Daten", features="Merkmale", finishes="Oberflächencodes", confirm="Bei Bestellung bestätigen",
               note="In unseren veröffentlichten Daten nicht angegeben, daher bei der Bestellung bestätigen: {items}.", more="Weitere Zeilen auf der Produktseite.",
               foot="Wie auf cantonlock.com veröffentlicht. Maßgeblich ist die Auftragsbestätigung.",
               gap={"finish codes": "Oberflächencodes", "fixing-hole positions": "Lage der Befestigungslöcher", "overall dimensions": "Gesamtmaße", "order code per finish": "Bestellnummer je Oberfläche"}),
    "ja": dict(sheet="製品仕様書", specs="仕様", features="特長", finishes="仕上げコード", confirm="ご注文時にご確認ください",
               note="公開データに記載がないため、ご注文時にご確認ください：{items}。", more="その他の項目は製品ページをご覧ください。",
               foot="cantonlock.com に掲載の内容です。正式な仕様は注文請書によります。",
               gap={"finish codes": "仕上げコード", "fixing-hole positions": "取付穴の位置", "overall dimensions": "外形寸法", "order code per finish": "仕上げごとの注文コード"}),
    "ko": dict(sheet="제품 사양서", specs="사양", features="특징", finishes="마감 코드", confirm="주문 시 확인",
               note="공개된 데이터에 없으므로 주문 시 확인해 주십시오: {items}.", more="나머지 항목은 제품 페이지에 있습니다.",
               foot="cantonlock.com 게시 내용입니다. 구속력 있는 사양은 주문 확인서입니다.",
               gap={"finish codes": "마감 코드", "fixing-hole positions": "고정 구멍 위치", "overall dimensions": "전체 치수", "order code per finish": "마감별 주문 코드"}),
    "tr": dict(sheet="Ürün teknik föyü", specs="Teknik özellikler", features="Özellikler", finishes="Kaplama kodları", confirm="Siparişte teyit edin",
               note="Yayımlanan verilerimizde yer almıyor; siparişte teyit edin: {items}.", more="Diğer satırlar ürün sayfasında.",
               foot="cantonlock.com'da yayımlandığı haliyle. Bağlayıcı şartname sipariş onayıdır.",
               gap={"finish codes": "kaplama kodları", "fixing-hole positions": "bağlantı deliği konumları", "overall dimensions": "genel ölçüler", "order code per finish": "kaplama başına sipariş kodu"}),
    "ru": dict(sheet="Техническая карта изделия", specs="Характеристики", features="Особенности", finishes="Коды покрытий", confirm="Уточнить при заказе",
               note="Не указано в опубликованных данных, уточните при заказе: {items}.", more="Остальные строки на странице изделия.",
               foot="По данным cantonlock.com. Обязательной спецификацией является подтверждение заказа.",
               gap={"finish codes": "коды покрытий", "fixing-hole positions": "расположение крепёжных отверстий", "overall dimensions": "габаритные размеры", "order code per finish": "код заказа для каждого покрытия"}),
    "ar": dict(sheet="ورقة مواصفات المنتج", specs="المواصفات", features="المزايا", finishes="رموز التشطيب", confirm="يُؤكَّد عند الطلب",
               note="غير مذكور في بياناتنا المنشورة، لذا يُرجى تأكيده عند الطلب: {items}.", more="بقية البنود في صفحة المنتج.",
               foot="وفق المنشور على cantonlock.com. تأكيد الطلب هو المواصفة الملزمة.",
               gap={"finish codes": "رموز التشطيب", "fixing-hole positions": "مواضع ثقوب التثبيت", "overall dimensions": "الأبعاد الكلية", "order code per finish": "رمز الطلب لكل تشطيب"}),
}
SEP = {"ja": "、", "ko": ", ", "ar": "، "}


def read_json(path: Path) -> dict:
    return json.loads(path.read_text("utf8")) if path.exists() else {}


I18N = {l: {k: read_json(ROOT / "content" / "i18n" / l / f"{k}.json") for k in ("products", "categories", "glossary")} for l in OVERLAY}
CATEGORIES = {c["slug"]: c for c in json.loads((ROOT / "content" / "categories.json").read_text("utf8"))["categories"]}


def localised(p: dict, loc: str) -> dict:
    """Name, category, spec rows and features as the product page shows them in `loc`."""
    cat = CATEGORIES.get(p["categoryPath"][0], {})
    out = dict(name=p.get("name", ""), cat=cat.get("name", ""), specs=p.get("specs", []), features=p.get("features") or [])
    if loc in ("es", "pt"):
        sfx = loc.capitalize()
        out["name"] = p.get(f"name{sfx}") or out["name"]
        out["cat"] = cat.get(f"name{sfx}") or out["cat"]
        out["specs"] = p.get(f"specs{sfx}") or out["specs"]
        out["features"] = p.get(f"features{sfx}") or out["features"]
    elif loc in OVERLAY:
        ov = I18N[loc]["products"].get(p["slug"], {})
        labels = I18N[loc]["glossary"].get("specLabels", {})
        out["name"] = ov.get("name") or out["name"]
        out["cat"] = (I18N[loc]["categories"].get(p["categoryPath"][0]) or {}).get("name") or out["cat"]
        specs = ov.get("specs") or out["specs"]
        out["specs"] = [{**r, "label": labels.get(r["label"], r["label"])} for r in specs]
        out["features"] = ov.get("features") or out["features"]
    return out


# ------------------------------------------------------------------ drawing
#
# Text goes through pymupdf.Story drawn onto one DocumentWriter page: the HTML engine
# brings fallback fonts (Cyrillic, CJK, Hangul) and Arabic shaping, and drawing every box
# on the same device keeps one set of font resources. insert_htmlbox would wrap each box in
# its own XObject, which measured 2.5x the file size for the same page.
# Rules, the photograph and the finish swatches are drawn onto that page afterwards.

SETTINGS = json.loads((ROOT / "content" / "site-settings.json").read_text("utf8"))


def hexc(rgb: tuple) -> str:
    return "#" + "".join(f"{round(c * 255):02x}" for c in rgb)


def html(text: str, size: float, color: tuple, bold: bool, align: str, rtl: bool, upper: bool) -> str:
    esc = str(text).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\n", "<br/>")
    css = (f"font-family:sans-serif;font-size:{size}px;line-height:1.3;color:{hexc(color)};"
           f"font-weight:{'bold' if bold else 'normal'};text-align:{align};margin:0;"
           f"{'text-transform:uppercase;letter-spacing:0.5px;' if upper else ''}")
    return f'<p dir="{"rtl" if rtl else "ltr"}" style="{css}">{esc}</p>'


BODY_CSS = "body, p { margin: 0; padding: 0; }"


class Pen:
    """Collects positioned text boxes; `render` draws them all onto one page."""

    def __init__(self, rtl: bool):
        self.rtl = rtl
        self.boxes: list[tuple[pymupdf.Rect, str]] = []

    def height(self, text: str, width: float, size: float, bold: bool = False) -> float:
        story = pymupdf.Story(html(text, size, INK, bold, "left", self.rtl, False), user_css=BODY_CSS)
        _, filled = story.place(pymupdf.Rect(0, 0, width, 4000))
        return filled[3]

    def box(self, x0, y0, x1, text, size, color=INK, bold=False, align=None, upper=False) -> float:
        align = align or ("end" if self.rtl else "left")  # MuPDF reads "right" as "start" under dir=rtl
        h = self.height(text, x1 - x0, size, bold) + 2
        self.boxes.append((pymupdf.Rect(x0, y0, x1, y0 + h + 4), html(text, size, color, bold, align, self.rtl, upper)))
        return h

    def render(self) -> pymupdf.Document:
        buf = io.BytesIO()
        writer = pymupdf.DocumentWriter(buf)
        device = writer.begin_page(pymupdf.Rect(0, 0, PW, PH))
        for rect, markup in self.boxes:
            story = pymupdf.Story(markup, user_css=BODY_CSS)
            story.place(rect)
            story.draw(device)
        writer.end_page()
        writer.close()
        return pymupdf.open("pdf", buf.getvalue())


def draw_sheet(p: dict, loc: str) -> pymupdf.Document:
    t, d = UI[loc], localised(p, loc)
    rtl = loc == "ar"
    pen = Pen(rtl)
    ops = []  # graphics drawn after the text page exists
    right = PW - M
    prefix = "" if loc == "en" else f"/{loc}"
    url = f"{SITE}{prefix}/products/{p['categoryPath'][0]}/{p['slug']}/"

    # Masthead
    ops.append(lambda pg: pg.draw_rect(pymupdf.Rect(0, 0, PW, 6), color=None, fill=BRASS))
    pen.box(M, 30, right, f"HYDE · Canton Hyland · {t['sheet']}", 7.5, INK3, True, upper=True)
    ops.append(lambda pg: pg.insert_text(pymupdf.Point(M, 78), p["model"], fontname=BOLD, fontsize=26, color=INK))
    y = 86
    y += pen.box(M, y, right, d["name"], 12, INK2)
    pen.box(M, y + 1, right, d["cat"], 8.5, INK3)
    ops.append(lambda pg: pg.draw_line(pymupdf.Point(M, 126), pymupdf.Point(right, 126), color=INK, width=0.9))

    # Photograph on the leading side, spec table beside it; mirrored for Arabic.
    top = 142
    photo = photo_for(p)
    img_box = pymupdf.Rect(right - 220, top, right, top + 220) if rtl else pymupdf.Rect(M, top, M + 220, top + 220)
    ops.append(lambda pg: pg.draw_rect(img_box, color=HAIR, width=0.5))
    if photo:
        ops.append(lambda pg: pg.insert_image(img_box + (8, 8, -8, -8), filename=str(photo), keep_proportion=True))

    x0, x1 = (M, right - 240) if rtl else (M + 240, right)
    label_w = 96
    lx0, lx1 = (x1 - label_w + 8, x1) if rtl else (x0, x0 + label_w - 8)
    vx0, vx1 = (x0, x1 - label_w) if rtl else (x0 + label_w, x1)
    y = top
    y += pen.box(x0, y, x1, t["specs"], 7, INK3, True, upper=True) + 6
    for row in d["specs"]:
        value = " ".join(f"{row['value']} {row.get('unit', '')}".split())
        if not value:
            continue
        h = max(pen.height(value, vx1 - vx0, 8.5), pen.height(row["label"], lx1 - lx0, 8.5, True))
        if y + h > PH - 230:
            y += pen.box(x0, y, x1, t["more"], 8, INK3) + 4
            break
        pen.box(lx0, y, lx1, row["label"], 8.5, INK, True)
        pen.box(vx0, y, vx1, value, 8.5, INK2)
        y += h + 5
        ops.append(lambda pg, yy=y: pg.draw_line(pymupdf.Point(x0, yy - 2), pymupdf.Point(x1, yy - 2), color=HAIR, width=0.4))
        y += 3

    # Below both columns: features, finishes, what to confirm
    y = max(y, img_box.y1) + 20
    features = [f for f in d["features"] if str(f).strip()]
    if features:
        y += pen.box(M, y, right, t["features"], 7, INK3, True, upper=True) + 4
        for f in features[:8]:
            y += pen.box(M, y, right, f"–  {f}", 9, INK2) + 2
        y += 12

    codes = finish_codes(p)
    if codes:
        y += pen.box(M, y, right, t["finishes"], 7, INK3, True, upper=True) + 8

        def swatches(pg, yy=y):
            x = right - sum(22 + pymupdf.get_text_length(c, BOLD, 8.5) for c in codes) if rtl else M
            for code in codes:
                pg.draw_rect(pymupdf.Rect(x, yy - 7, x + 9, yy + 2), color=RULE, fill=FINISH_RGB.get(code, PAPER), width=0.3)
                pg.insert_text(pymupdf.Point(x + 13, yy + 1), code, fontname=BOLD, fontsize=8.5, color=INK)
                x += 22 + pymupdf.get_text_length(code, BOLD, 8.5)

        ops.append(swatches)
        y += 20

    items = SEP.get(loc, ", ").join(t["gap"][g] for g in gaps(p))
    y += pen.box(M, y, right, t["confirm"], 7, INK3, True, upper=True) + 4
    pen.box(M, y, right, t["note"].format(items=items), 8.5, INK2)

    # Footer
    fy = PH - 64
    ops.append(lambda pg: pg.draw_line(pymupdf.Point(M, fy), pymupdf.Point(right, fy), color=RULE, width=0.5))
    c = SETTINGS["contact"]
    pen.box(M, fy + 8, right, t["foot"], 7.2, INK3)
    ops.append(lambda pg: pg.insert_text(pymupdf.Point(M, fy + 36), f"{url}   ·   {c['email']}", fontname=BODY, fontsize=7.2, color=INK3))
    ops.append(lambda pg: pg.insert_text(pymupdf.Point(M, fy + 46), f"{SETTINGS['legalName']}, {c['city']}, {c['province']}, {c['country']}",
                                         fontname=BODY, fontsize=7.2, color=INK3))

    doc = pen.render()
    page = doc[0]
    for op in ops:
        op(page)
    doc.set_metadata({
        "title": f"{p['model']} {d['name']}",
        "author": SETTINGS["legalName"],
        "subject": f"{p['model']} {d['name']}",
        "creator": "scripts/build_spec_sheets.py",
        "producer": "", "creationDate": "", "modDate": "",
    })
    doc.subset_fonts()
    return doc


def sheet_path(loc: str, slug: str) -> Path:
    return (OUT if loc == "en" else OUT / loc) / f"{slug}.pdf"


def main() -> None:
    only = sys.argv[1:] or LOCALES
    made, skipped, gap_rows = [], [], []
    products = load_products()

    for p in products:
        reason = eligibility(p)
        if reason:
            skipped.append((p, reason))
            continue
        made.append(p["slug"])
        gap_rows.append((p, gaps(p)))

    for loc in only:
        folder = sheet_path(loc, "x").parent
        folder.mkdir(parents=True, exist_ok=True)
        for p in products:
            if p["slug"] in made:
                draw_sheet(p, loc).save(sheet_path(loc, p["slug"]), garbage=4, deflate=True, use_objstms=1, no_new_id=True)
        # Sheets for products that no longer qualify must not linger in public/.
        keep = {f"{s}.pdf" for s in made}
        for old in folder.glob("*.pdf"):
            if old.name not in keep:
                old.unlink()
        print(f"{loc}: {len(made)} sheets")

    MANIFEST.write_text(json.dumps(sorted(made), indent=1) + "\n", "utf8")

    reasons = Counter(r if not r.startswith(tuple("0123456789")) else f"fewer than {MIN_ROWS} spec rows beyond material/finish/function" for _, r in skipped)
    gap_count = Counter(g for _, gs in gap_rows for g in gs)
    lines = [
        "# Spec sheet coverage and gaps",
        "",
        "Generated by `npm run spec-sheets` (scripts/build_spec_sheets.py). Do not edit by hand.",
        "",
        f"HYDE products: {len(made) + len(skipped)}. With a sheet: {len(made)}, in {len(LOCALES)} languages "
        f"(public/downloads/spec-sheets/<locale>/, English at the root). Without a sheet: {len(skipped)}.",
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
    print(f"{len(made)} products with sheets, {len(skipped)} without -> {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
