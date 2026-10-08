"""QR codes as vector rectangles, so they print sharp at any size.

One per family opener, pointing at that family's page on cantonlock.com, where the full
specifications live. That is what lets the printed book carry two or three key specs per
product instead of thirty-one pages of tables (spec §1, client 2026-10-08).
"""
from __future__ import annotations

import pymupdf
import segno

from .style import INK


def family_url(slug: str) -> str:
    return f"https://cantonlock.com/products/{slug}/"


def draw_qr(page: pymupdf.Page, rect: pymupdf.Rect, url: str, color=INK) -> int:
    """Draw `url` as a QR code filling the square fitted in `rect`; returns dark modules drawn.

    Error level M survives a fold or a coffee ring on a trade-fair table. The quiet zone
    is the white page around `rect`, so callers leave about four modules of margin.
    """
    matrix = segno.make(url, error="m").matrix
    n = len(matrix)
    cell = min(rect.width, rect.height) / n
    shape = page.new_shape()
    dark = 0
    for y, row in enumerate(matrix):
        for x, on in enumerate(row):
            if on:
                shape.draw_rect(pymupdf.Rect(rect.x0 + x * cell, rect.y0 + y * cell,
                                             rect.x0 + (x + 1) * cell, rect.y0 + (y + 1) * cell))
                dark += 1
    shape.finish(color=None, fill=color, width=0)
    shape.commit()
    return dark
