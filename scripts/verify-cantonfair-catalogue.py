#!/usr/bin/env python
"""Verify both delivered PDFs, their page map, bookmarks and extracted hyperlinks.

Uses bundled pypdf. Rendering and image QA are a separate required visual pass.
The route check inspects local exported HTML; it does not assert a production deploy.
"""
from __future__ import annotations

import json
import shutil
import subprocess
from collections import Counter
from pathlib import Path
from urllib.parse import urlparse

from pypdf import PdfReader
from PIL import Image, ImageDraw, ImageOps

ROOT = Path(__file__).resolve().parent.parent
REPORT = ROOT / "docs/catalogues/2026-canton-fair"


def preview(preflight):
    """Derive the review image from the final PDF, rather than hand-pasting pages."""
    executable = shutil.which("pdftoppm")
    if not executable:
        bundled = Path.home()/".cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin/pdftoppm.exe"
        if bundled.exists():
            executable = str(bundled)
    if not executable:
        raise RuntimeError("Poppler pdftoppm is required to render the final preview")
    work = ROOT/"tmp/codex-cantonfair-catalogue/preview"
    work.mkdir(parents=True, exist_ok=True)
    first_family = preflight["families"][0]["start"]
    pages = [(1, "COVER"), (first_family, "FAMILY"), (first_family+1, "PRODUCTS")]
    sheet = Image.new("RGB", (1512, 764), "#E7EAEB")
    draw = ImageDraw.Draw(sheet)
    pdf = ROOT/preflight["editions"]["digital"]["file"]
    for i, (number, label) in enumerate(pages):
        prefix = work/f"page-{number}"
        subprocess.run([executable, "-f", str(number), "-l", str(number), "-singlefile",
                        "-scale-to", "1400", "-png", str(pdf), str(prefix)], check=True)
        with Image.open(prefix.with_suffix(".png")) as image:
            thumb = ImageOps.contain(image, (480, 690))
            sheet.paste(thumb, (12+i*504+(480-thumb.width)//2, 50))
        draw.text((18+i*504, 22), label+f"  /  {number:03d}", fill="#202426")
    target = ROOT/"output/pdf/hyde-canton-fair-2026-preview.jpg"
    sheet.save(target, quality=94)


def verify():
    preflight = json.loads((REPORT/"preflight.json").read_text(encoding="utf8"))
    manifest = json.loads((ROOT/"tmp/codex-cantonfair-catalogue/assets/manifest.json").read_text(encoding="utf8"))
    expected = {f"https://cantonlock.com/products/{p['categoryPath'][0]}/{p['slug']}/": p
                for p in manifest["products"]}
    results = {}
    for mode, edition in preflight["editions"].items():
        reader = PdfReader(ROOT/edition["file"])
        assert len(reader.pages) == edition["pages"]
        assert len(reader.pages) % 4 == 0
        uris, internal_links = Counter(), 0
        page_text = [p.extract_text() for p in reader.pages]
        assert f"{len(expected)} model references" in page_text[1]
        assert "Canton Hyland Hardware (Group) Co., Ltd." in page_text[0]
        assert "hyde@cantonlock.com" in page_text[-1]
        for i, page in enumerate(reader.pages):
            assert abs(float(page.mediabox.width)-595.276) < .1
            assert abs(float(page.mediabox.height)-841.890) < .1
            for annotation in page.get("/Annots", []):
                obj = annotation.get_object()
                action = obj.get("/A")
                if action and action.get("/S") == "/URI":
                    uris[str(action["/URI"])] += 1
                elif obj.get("/Dest"):
                    internal_links += 1
            # Actual folio must agree with PDF page position.
            if i:
                assert f"{i+1:03d}" in page_text[i], f"Missing folio on {i+1}"
        assert set(expected).issubset(uris), "Product hyperlinks missing"
        assert all(uris[url] == 1 for url in expected), "Duplicated or absent product links"
        missing_routes = []
        for url, p in expected.items():
            html = ROOT/"out"/urlparse(url).path.strip("/")/"index.html"
            if not html.exists():
                missing_routes.append(url)
                continue
            text = html.read_text(encoding="utf8")
            assert '<title>' in text and p["slug"] in text, f"Wrong route: {url}"
            page = preflight["productPages"][p["slug"]]
            assert str(p["model"]) in page_text[page-1], f"Index map mismatch: {p['model']}"
        assert not missing_routes, f"Missing local product routes: {missing_routes}"
        for family in preflight["families"]:
            assert family["name"] in page_text[family["start"]-1], f"Wrong family page: {family['name']}"
            assert f"{family['start']:03d}" in page_text[1], "Contents page number missing"
        outlines = [entry for entry in reader.outline if not isinstance(entry, list)]
        assert len(outlines) >= 20
        for entry in outlines:
            page_number = reader.get_destination_page_number(entry)
            assert page_number is not None and 0 <= page_number < len(reader.pages)
        fonts = set()
        for page in reader.pages:
            for item in page["/Resources"].get("/Font", {}).values():
                font = item.get_object()
                name = str(font.get("/BaseFont"))
                if "Arial" in name:
                    descriptor = font["/FontDescriptor"]
                    assert descriptor.get("/FontFile2"), f"Font not embedded: {name}"
                    fonts.add(name)
        assert len(fonts) == 2
        results[mode] = {"pages": len(reader.pages), "models": len(expected),
                         "productLinks": sum(uris[u] for u in expected), "allUriLinks": sum(uris.values()),
                         "internalLinks": internal_links, "bookmarks": len(outlines),
                         "missingLocalProductRoutes": missing_routes, "embeddedFonts": sorted(fonts),
                         "status": "passed"}
    (REPORT/"verification.json").write_text(json.dumps(results, indent=2)+"\n", encoding="utf8")
    preview(preflight)
    print(json.dumps(results, indent=2))


if __name__ == "__main__":
    verify()
