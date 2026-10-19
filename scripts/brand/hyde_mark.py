"""The HYDE mark, refined (2026-10-11), drawn from numbers so every size and colour is the same mark.

Client, 2026-10-11: refresh the HYDE logo to a current standard for the 140th Canton Fair
(flyer, factory signage, welcome banner). Decision taken with the client: refine the
existing mark, do not replace it. What changed and why:

  1. Spacing. The old wordmark gaps were H–Y 54, Y–D 50, D–E 64 units: D–E read loose.
     Spacing here is optical: a round or diagonal edge carries less mass at the edge, so it
     sits closer than two straight stems would.
  2. Icon crossbar 34 -> 32. A horizontal stroke of the same measured width as a vertical
     one reads heavier; the wordmark already corrects this (H crossbar 19 vs stem 22), the
     icon did not.
  3. Convex outer corners of the letters get a radius of 3 units (3% of cap height), the
     only bridge between the fully rounded icon and the square wordmark. Concave corners
     (the Y crotch, the inside of E) stay sharp, so letters do not go soft or blobby.
  4. A system around the mark: lockups (icon, horizontal, stacked, horizontal with the
     legal name), clear space, minimum sizes, three colourways. See build_brand_kit.py.

The letter outlines are the existing ones from public/images/brand/hyde (cap height 101).
The site's files are not touched; they are replaced only after the client approves.
"""
from __future__ import annotations

import math
from dataclasses import dataclass

INK = "#14130F"     # the catalogue's INK (0.08, 0.075, 0.06)
BRASS = "#8A6A1F"   # the catalogue's BRASS (0.541, 0.416, 0.122)
WHITE = "#FFFFFF"

# ------------------------------------------------------------------ icon (lever H)
ICON_H = 180.0
STEM = 34.0
BAR = 32.0           # optical correction, see (2)
BAR_GAP = 18.0       # the lever stops short of the right stem: the mark's idea, kept
ICON_W = 210.0       # left stem 0..34, right stem 176..210


def icon_shapes(x: float, y: float, s: float) -> list[str]:
    """Three rounded bars, as SVG elements, with the icon's top-left at (x, y), scale s."""
    def pill(px, py, w, h):
        r = min(w, h) / 2
        return (f'<rect x="{x + px * s:.3f}" y="{y + py * s:.3f}" width="{w * s:.3f}" '
                f'height="{h * s:.3f}" rx="{r * s:.3f}"/>')
    bar_y = (ICON_H - BAR) / 2 - 2.0  # 2 units above centre: optical centre
    right = ICON_W - STEM
    return [
        pill(0, 0, STEM, ICON_H),
        pill(STEM / 2, bar_y, right - BAR_GAP - STEM / 2, BAR),
        pill(right, 0, STEM, ICON_H),
    ]


# ------------------------------------------------------------------ wordmark
CAP = 101.0
R = 3.0  # convex-corner radius, see (3)

# Rectilinear outlines (clockwise, y down), from the existing SVGs.
POLY = {
    "H": [(0, 0), (22, 0), (22, 39), (94, 39), (94, 0), (116, 0), (116, 101), (94, 101),
          (94, 58), (22, 58), (22, 101), (0, 101)],
    "Y": [(0, 0), (28, 0), (64, 42), (101, 0), (129, 0), (75, 56), (75, 101), (53, 101), (53, 56)],
    "E": [(0, 0), (101, 0), (101, 18), (21, 18), (21, 40), (92, 40), (92, 57), (21, 57),
          (21, 83), (101, 83), (101, 101), (0, 101)],
}
WIDTH = {"H": 116.0, "Y": 129.0, "D": 114.0, "E": 101.0}
# Optical gaps between letters, in cap units. Straight–straight would be ~56.
GAPS = {("H", "Y"): 46.0, ("Y", "D"): 47.0, ("D", "E"): 50.0}
WORD = "HYDE"


def _rounded(points: list[tuple[float, float]], r: float, ox: float, oy: float, s: float) -> str:
    """Path for a polygon with convex corners rounded by `r`; concave corners left sharp."""
    n = len(points)
    area = sum(points[i][0] * points[(i + 1) % n][1] - points[(i + 1) % n][0] * points[i][1] for i in range(n))
    sign = 1 if area > 0 else -1
    out = []
    for i in range(n):
        p0, p1, p2 = points[i - 1], points[i], points[(i + 1) % n]
        v1 = (p1[0] - p0[0], p1[1] - p0[1]); v2 = (p2[0] - p1[0], p2[1] - p1[1])
        cross = v1[0] * v2[1] - v1[1] * v2[0]
        l1, l2 = math.hypot(*v1), math.hypot(*v2)
        convex = cross * sign > 0
        rr = min(r, l1 / 2, l2 / 2) if convex else 0.0
        a = (p1[0] - v1[0] / l1 * rr, p1[1] - v1[1] / l1 * rr)
        b = (p1[0] + v2[0] / l2 * rr, p1[1] + v2[1] / l2 * rr)
        X = lambda q: f"{ox + q[0] * s:.3f} {oy + q[1] * s:.3f}"
        out.append(("M" if i == 0 else "L") + X(a))
        if rr:
            out.append("Q" + X(p1) + " " + X(b))
    return " ".join(out) + " Z"


def _d_path(ox: float, oy: float, s: float) -> str:
    """D: the existing bowl, with the two convex left corners rounded like the others."""
    X = lambda x, y: f"{ox + x * s:.3f} {oy + y * s:.3f}"
    outer = (f"M{X(R, 0)} L{X(62, 0)} C{X(95, 0)} {X(114, 18)} {X(114, 50)} "
             f"C{X(114, 83)} {X(95, 101)} {X(62, 101)} L{X(R, 101)} Q{X(0, 101)} {X(0, 101 - R)} "
             f"L{X(0, R)} Q{X(0, 0)} {X(R, 0)} Z")
    inner = (f"M{X(22, 18)} V{oy + 83 * s:.3f} H{ox + 59 * s:.3f} "
             f"C{X(80, 83)} {X(92, 70)} {X(92, 50)} C{X(92, 30)} {X(80, 18)} {X(59, 18)} Z")
    return outer + " " + inner


def wordmark_width() -> float:
    return sum(WIDTH[c] for c in WORD) + sum(GAPS[(a, b)] for a, b in zip(WORD, WORD[1:]))


def wordmark_shapes(x: float, y: float, s: float) -> list[str]:
    """The four letters as SVG paths, top-left of the cap box at (x, y), scale s (1 = cap 101)."""
    out, cx = [], x
    for i, ch in enumerate(WORD):
        d = _d_path(cx, y, s) if ch == "D" else _rounded(POLY[ch], R, cx, y, s)
        rule = ' fill-rule="evenodd"' if ch == "D" else ""
        out.append(f'<path d="{d}"{rule}/>')
        cx += WIDTH[ch] * s
        if i < len(WORD) - 1:
            cx += GAPS[(ch, WORD[i + 1])] * s
    return out


# ------------------------------------------------------------------ lockups
LEGAL = "CANTON HYLAND HARDWARE & BUILDING MATERIAL CO., LTD."
WM_SCALE = 0.5 * ICON_H / CAP     # wordmark cap = half the icon height
LOCKUP_GAP = 0.6 * ICON_H         # icon to wordmark, horizontal
CLEAR = STEM * 1.5                # clear space on every side: 1.5 stem widths


@dataclass
class Mark:
    width: float
    height: float
    body: list[str]                  # SVG elements in mark units, origin top-left
    legal: tuple[float, float, float, float] | None = None  # x, baseline, width, cap for the legal line


def icon() -> Mark:
    return Mark(ICON_W, ICON_H, icon_shapes(0, 0, 1))


def horizontal() -> Mark:
    wm_w = wordmark_width() * WM_SCALE
    x = ICON_W + LOCKUP_GAP
    y = (ICON_H - CAP * WM_SCALE) / 2
    return Mark(x + wm_w, ICON_H, icon_shapes(0, 0, 1) + wordmark_shapes(x, y, WM_SCALE))


def stacked() -> Mark:
    wm_w = wordmark_width() * WM_SCALE * 0.82
    w = max(ICON_W, wm_w)
    gap = 0.42 * ICON_H
    body = icon_shapes((w - ICON_W) / 2, 0, 1) + wordmark_shapes((w - wm_w) / 2, ICON_H + gap, WM_SCALE * 0.82)
    return Mark(w, ICON_H + gap + CAP * WM_SCALE * 0.82, body)


def horizontal_legal() -> Mark:
    """Horizontal lockup with the legal name set under the wordmark, flush left to it.

    The legal line is text, not outlines: build_brand_kit.py sets it in Archivo Medium at a
    size that makes it exactly the wordmark's width, so it is placed there, not here.
    """
    x = ICON_W + LOCKUP_GAP
    wm_w = wordmark_width() * WM_SCALE
    cap = CAP * WM_SCALE
    legal_cap, gap = 0.2 * cap, 0.36 * cap
    top = (ICON_H - (cap + gap + legal_cap)) / 2  # wordmark + legal line centred on the icon
    m = Mark(x + wm_w, ICON_H, icon_shapes(0, 0, 1) + wordmark_shapes(x, top, WM_SCALE))
    m.legal = (x, top + cap + gap + legal_cap, wm_w, legal_cap)
    return m


def svg(mark: Mark, color: str = INK, background: str | None = None, pad: float = 0.0) -> str:
    """A standalone SVG of the mark's shapes. The legal line is not here: it is set as text
    on a PDF page (kit.place_mark) and exported outlined, so no SVG depends on a font."""
    w, h = mark.width + 2 * pad, mark.height + 2 * pad
    bg = f'<rect width="{w:.3f}" height="{h:.3f}" fill="{background}"/>' if background else ""
    return (f'<?xml version="1.0" encoding="UTF-8"?>\n'
            f'<svg xmlns="http://www.w3.org/2000/svg" width="{w:.1f}" height="{h:.1f}" '
            f'viewBox="0 0 {w:.3f} {h:.3f}" role="img" aria-label="HYDE">{bg}'
            f'<g transform="translate({pad:.3f} {pad:.3f})" fill="{color}">{"".join(mark.body)}</g></svg>\n')
