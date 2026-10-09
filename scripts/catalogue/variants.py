"""One card per product design: finish variants merged.

D101 AB, D101 AC, D101 PB and D101 SS are one deadbolt in four finishes. Printed as four
cards they read as four products and push the book past its page budget; printed as one
card with "AB · AC · PB · SS" they say what is true.

The merge is conservative: records join only when the name and every non-finish spec row
are identical. Two records that share a model base but differ in a dimension stay apart,
because merging them would print one set of figures for two different parts.
"""
from __future__ import annotations

import re
import sys
from dataclasses import dataclass, field
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import build_catalogue as legacy  # noqa: E402

FINISH_LABELS = {"Finish", "Finishes", "Surface Finish", "Color", "Colour", "Color Options"}
_CODES = sorted(legacy.FINISH_CODES, key=len, reverse=True)


@dataclass
class Card:
    model: str
    name: str
    product: dict  # the first member: its photograph and specs speak for the card
    finishes: list[str] = field(default_factory=list)
    members: list[dict] = field(default_factory=list)


def split_finish(model: str) -> tuple[str, str]:
    """('D101', 'AB') for 'D101 AB'; ('1073D', '—') for a model with no finish suffix."""
    model = str(model).strip()
    for code in _CODES:
        m = re.match(rf"^(.*\S)[\s\-_/]+{re.escape(code)}$", model)
        if m:
            return m.group(1).strip(), code
    return model, "—"


def _key(product: dict) -> tuple:
    base, _ = split_finish(product.get("model", ""))
    specs = tuple(sorted((s["label"], s["value"]) for s in product.get("specs", [])
                         if s["label"] not in FINISH_LABELS))
    return base, product.get("name", ""), specs


def cards(products: list[dict]) -> list[Card]:
    out: dict[tuple, Card] = {}
    for p in products:
        k = _key(p)
        if k not in out:
            out[k] = Card(model=k[0], name=k[1], product=p)
        card = out[k]
        card.members.append(p)
        card.finishes.append(split_finish(p.get("model", ""))[1])
    for card in out.values():
        if len(card.members) == 1:
            card.model = str(card.product.get("model", "")).strip()  # nothing merged: print it as written
            card.finishes = []
    return list(out.values())
