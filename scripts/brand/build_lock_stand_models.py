"""HYDE counter-top lock display stand: two plain colourways, simple 3-D model.

    python scripts/brand/build_lock_stand_models.py [--out-dir DIR]

Client, 2026-10-17, with a photo of another maker's white stand and a video of a sample:
「纯色锁架，你给我两个简单建模，黑的配白色 hyde，白色配黑 hyde logo」. The red marks on the photo
put the wordmark down the right of the face, reading top to bottom, and again on the base.

The sample in the video is a tower with a small hinged door leaf in a frame, prepared for a
lock, on a flat base. Modelled as that, with nothing on it: the bore and through-holes are cut
for whichever lock goes on, so none is drawn, and no lock is drawn either (only real
photographs of real products may show a product). The latch edge is the left, as on the
photo, so the wordmark sits on the hinge side and never under a lock.

DIMENSIONS ARE ESTIMATES from the photo (knob rose ≈ 70 mm as the scale): tower 240 × 120 ×
760 mm, base 360 × 280 × 50 mm. Change STAND and BASE when the supplier's drawing arrives.
"""
from __future__ import annotations

import argparse
import io
from pathlib import Path

import numpy as np
import pymupdf
from PIL import Image, ImageDraw, ImageFilter

import hyde_mark as hm
import kit
from kit import place_mark

S = 1000.0                                  # points per metre on the texture pages
STAND = (0.240, 0.120, 0.760)               # width, depth, height of the tower
BASE = (0.360, 0.280, 0.050)                # width, depth, height of the base
LEAF_INSET = 0.022                          # frame around the door leaf
OUT_DEFAULT = kit.ROOT / "docs" / "design-references" / "lock-display-stand"
PX = 1400                                   # px per metre for textures

COLOURWAYS = {
    "black": dict(face=(30, 30, 28), side=(17, 17, 16), top=(58, 58, 55), gap=(8, 8, 8),
                  hinge=(70, 70, 66), logo=hm.WHITE),
    "white": dict(face=(238, 237, 233), side=(204, 203, 199), top=(249, 249, 247), gap=(178, 177, 172),
                  hinge=(160, 158, 150), logo=hm.INK),
}


def wordmark() -> hm.Mark:
    return hm.Mark(hm.wordmark_width(), hm.CAP, hm.wordmark_shapes(0, 0, 1))


def mark_pdf(mark: hm.Mark, color: str) -> pymupdf.Document:
    src = pymupdf.open(stream=hm.svg(mark, color=color).encode(), filetype="svg")
    return pymupdf.open("pdf", src.convert_to_pdf())


def rgbf(c):
    return tuple(v / 255 for v in c)


def front_page(cw: dict) -> pymupdf.Document:
    """The tower's front face: frame, door leaf with its gap and hinges, the wordmark rotated
    to read top to bottom down the hinge side."""
    w, _, h = STAND
    doc = pymupdf.open()
    page = doc.new_page(width=w * S, height=h * S)
    page.draw_rect(page.rect, color=None, fill=rgbf(cw["face"]), width=0)
    i = LEAF_INSET
    leaf = pymupdf.Rect(i * S, i * S, (w - i) * S, (h - i) * S)
    page.draw_rect(leaf, color=rgbf(cw["gap"]), width=0.0018 * S)
    for zc in (0.16, h - 0.16):  # two butt hinges on the right-hand (hinge) edge
        page.draw_rect(pymupdf.Rect((w - i - 0.004) * S, (zc - 0.032) * S, (w - i + 0.004) * S, (zc + 0.032) * S),
                       color=None, fill=rgbf(cw["hinge"]), width=0)
    # wordmark, rotated so it reads top to bottom, centred in the hinge-side strip
    m = wordmark()
    length = 0.44
    cap = length * m.height / m.width
    cx = w - i - 0.050
    top = i + 0.075
    target = pymupdf.Rect((cx - cap / 2) * S, top * S, (cx + cap / 2) * S, (top + length) * S)
    page.show_pdf_page(target, mark_pdf(m, cw["logo"]), 0, rotate=-90)
    return doc


def base_front_page(cw: dict) -> pymupdf.Document:
    w, _, h = BASE
    doc = pymupdf.open()
    page = doc.new_page(width=w * S, height=h * S)
    page.draw_rect(page.rect, color=None, fill=rgbf(cw["face"]), width=0)
    place_mark(page, pymupdf.Rect(0.05 * S, 0.012 * S, (w - 0.05) * S, (h - 0.012) * S), hm.horizontal(), cw["logo"])
    return doc


def to_image(doc: pymupdf.Document) -> Image.Image:
    pix = doc[0].get_pixmap(matrix=pymupdf.Matrix(PX / S, PX / S))
    return Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")


def flat(w, h, color) -> Image.Image:
    return Image.new("RGB", (max(int(w * PX), 2), max(int(h * PX), 2)), color)


# ----------------------------------------------------------------------------- projection
class Cam:
    def __init__(self, pos, target, focal, size):
        self.p, self.f_len, self.size = np.array(pos, float), focal, size
        f = np.array(target, float) - self.p
        self.f = f / np.linalg.norm(f)
        r = np.cross(self.f, [0, 0, 1.0])
        self.r = r / np.linalg.norm(r)
        self.u = np.cross(self.r, self.f)

    def __call__(self, q):
        d = np.array(q, float) - self.p
        z = d @ self.f
        return (self.size[0] / 2 + self.f_len * (d @ self.r) / z, self.size[1] / 2 - self.f_len * (d @ self.u) / z)


def homography(src, dst):
    a = []
    for (x, y), (u, v) in zip(src, dst):
        a.append([u, v, 1, 0, 0, 0, -x * u, -x * v])
        a.append([0, 0, 0, u, v, 1, -y * u, -y * v])
    b = [c for p in src for c in p]
    return np.linalg.solve(np.array(a, float), np.array(b, float))


def warp(canvas, tex, corners, cam):
    """Paste `tex` onto the 3-D quad `corners` (top-left, top-right, bottom-right, bottom-left)."""
    dst = [cam(p) for p in corners]
    src = [(0, 0), (tex.width, 0), (tex.width, tex.height), (0, tex.height)]
    big = tex.transform(canvas.size, Image.PERSPECTIVE, tuple(homography(src, dst)), Image.BICUBIC)
    mask = Image.new("L", canvas.size, 0)
    ImageDraw.Draw(mask).polygon(dst, fill=255)
    canvas.paste(big, (0, 0), mask)
    # close the anti-aliasing seam along the quad's edges with the face's own edge colour
    ImageDraw.Draw(canvas).line(dst + [dst[0]], fill=tex.getpixel((tex.width // 2, 1)), width=2)


def render(name: str) -> Image.Image:
    cw = COLOURWAYS[name]
    size = (1100, 1500)
    cam = Cam((-0.60, -1.30, 1.15), (0.12, 0.06, 0.40), 1650.0, size)
    im = Image.new("RGB", size, (232, 231, 228))
    # studio floor and soft contact shadow
    d = ImageDraw.Draw(im)
    horizon = cam((0.12, 30.0, 0))[1]
    d.rectangle((0, int(horizon), size[0], size[1]), fill=(222, 221, 218))
    bw, bd, bh = BASE
    sw, sd, sh = STAND
    bx0, by0 = (sw - bw) / 2, (sd - bd) / 2
    shadow = Image.new("L", size, 0)
    ImageDraw.Draw(shadow).polygon([cam(p) for p in [(bx0 - 0.02, by0 - 0.01, 0), (bx0 + bw + 0.04, by0 - 0.01, 0),
                                                      (bx0 + bw + 0.06, by0 + bd + 0.06, 0), (bx0 - 0.01, by0 + bd + 0.05, 0)]], fill=120)
    im = Image.composite(Image.new("RGB", size, (150, 149, 145)), im, shadow.filter(ImageFilter.GaussianBlur(28)))
    # base: left side, front, top
    warp(im, flat(bd, bh, cw["side"]), [(bx0, by0 + bd, bh), (bx0, by0, bh), (bx0, by0, 0), (bx0, by0 + bd, 0)], cam)
    warp(im, to_image(base_front_page(cw)), [(bx0, by0, bh), (bx0 + bw, by0, bh), (bx0 + bw, by0, 0), (bx0, by0, 0)], cam)
    warp(im, flat(bw, bd, cw["top"]), [(bx0, by0 + bd, bh), (bx0 + bw, by0 + bd, bh), (bx0 + bw, by0, bh), (bx0, by0, bh)], cam)
    # tower: left side (latch edge), front, top
    z0, z1 = bh, bh + sh
    warp(im, flat(sd, sh, cw["side"]), [(0, sd, z1), (0, 0, z1), (0, 0, z0), (0, sd, z0)], cam)
    warp(im, to_image(front_page(cw)), [(0, 0, z1), (sw, 0, z1), (sw, 0, z0), (0, 0, z0)], cam)
    warp(im, flat(sw, sd, cw["top"]), [(0, sd, z1), (sw, sd, z1), (sw, 0, z1), (0, 0, z1)], cam)
    return im


def elevation() -> Image.Image:
    """Front elevations of both colourways with the overall sizes, for the supplier."""
    sw, _, sh = STAND
    bw, _, bh = BASE
    doc = pymupdf.open()
    W, H = 1.30, 1.05
    page = doc.new_page(width=W * S, height=H * S)
    page.draw_rect(page.rect, color=None, fill=(1, 1, 1), width=0)
    grey = (0.45, 0.45, 0.43)
    for k, name in enumerate(("black", "white")):
        cw = COLOURWAYS[name]
        ox = 0.20 + k * 0.58
        base_y = 0.92
        page.show_pdf_page(pymupdf.Rect((ox + (bw - sw) / 2) * S, (base_y - bh - sh) * S, (ox + (bw + sw) / 2) * S, (base_y - bh) * S),
                           front_page(cw), 0)
        page.show_pdf_page(pymupdf.Rect(ox * S, (base_y - bh) * S, (ox + bw) * S, base_y * S), base_front_page(cw), 0)
        page.draw_rect(pymupdf.Rect(ox * S, (base_y - bh) * S, (ox + bw) * S, base_y * S), color=grey, width=0.0008 * S)
        page.draw_rect(pymupdf.Rect((ox + (bw - sw) / 2) * S, (base_y - bh - sh) * S, (ox + (bw + sw) / 2) * S, (base_y - bh) * S),
                       color=grey, width=0.0008 * S)
        kit.text(page, (ox + bw / 2) * S, (base_y + 0.05) * S, {"black": "Black · white HYDE", "white": "White · black HYDE"}[name],
                 0.022 * S, "semibold", (0.08, 0.075, 0.06), align="center")
        # dimensions
        y = base_y + 0.08
        page.draw_line((ox * S, y * S), ((ox + bw) * S, y * S), color=grey, width=0.0008 * S)
        kit.text(page, (ox + bw / 2) * S, (y + 0.025) * S, f"base {bw * 1000:.0f} × {BASE[1] * 1000:.0f} × {bh * 1000:.0f} mm",
                 0.016 * S, "text", grey, align="center")
        x = ox + bw + 0.03
        page.draw_line((x * S, (base_y - bh - sh) * S), (x * S, (base_y - bh) * S), color=grey, width=0.0008 * S)
        kit.text(page, (x + 0.01) * S, (base_y - bh - sh / 2) * S, f"{sh * 1000:.0f}", 0.016 * S, "text", grey)
        kit.text(page, (ox + bw / 2) * S, (base_y - bh - sh - 0.02) * S, f"tower {sw * 1000:.0f} × {STAND[1] * 1000:.0f} mm",
                 0.016 * S, "text", grey, align="center")
    kit.text(page, 0.05 * S, 0.05 * S, "HYDE lock display stand · sizes estimated, confirm with the supplier", 0.020 * S, "medium",
             (0.08, 0.075, 0.06))
    pix = page.get_pixmap(matrix=pymupdf.Matrix(1.6, 1.6))
    return Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out-dir", default=str(OUT_DEFAULT))
    out = Path(ap.parse_args().out_dir)
    out.mkdir(parents=True, exist_ok=True)
    renders = {n: render(n).crop((150, 200, 950, 1300)) for n in COLOURWAYS}
    for n, im in renders.items():
        im.save(out / f"stand-{n}.png", optimize=True)
    pair = Image.new("RGB", (renders["black"].width * 2, renders["black"].height), (232, 231, 228))
    pair.paste(renders["black"], (0, 0))
    pair.paste(renders["white"], (renders["black"].width, 0))
    pair.save(out / "stand-pair.png", optimize=True)
    elevation().save(out / "stand-elevation.png", optimize=True)
    print(out)


if __name__ == "__main__":
    main()
