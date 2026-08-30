# -*- coding: utf-8 -*-
"""
Stahlock -> Canton Hyland exact-model mapping dry-run.

DISCIPLINE (from HANDOFF.md / src/data/products.ts):
- exact model match only, never approximate inference
- never overwrite an existing cantonlock value
- same label with different value = conflict, report only
- different finish suffix (PBET/SNET/...) = NOT a match -> near-miss list, review only
"""
import json, glob, re, csv, collections

WS = r"C:\Users\johns\Documents\kimi\workspace"

# ---- category compatibility (stahlock category -> cantonlock series set) ----
# Same-family only. Catch-all buckets (Hardware Accessories) get NO synonyms:
# model numbers get reused across families (stahlock 033=Trim Handle vs
# cantonlock 033=Panic Exit Device), so mismatched-category pairs are review-only.
CATEGORY_MAP = {
    "Panic Exit Device": {"Panic Exit Device", "S-Panic Exit Device", "D-Panic Exit Device", "Pry Latch"},
    "Push Bar": {"Panic Exit Device", "S-Panic Exit Device", "D-Panic Exit Device"},
    "Trim Handle": {"Exterior Trim"},
    "Profile Lock Case": {"Lock Case"},
    "Lock Case": {"Lock Case", "Hyland LC14"},
    "Lever Handle": {"Lever Handle", "Hyland Lever"},
    "Stainless Steel Handle": {"Stainless Steel Handle"},
    "Lock Cylinder": {"Lock Cylinder"},
    "Deadbolts": {"Deadbolts", "Hyland Deadbolt"},
    "Door Closer": {"Door Closer"},
    "Brass and Steel Hinges": {"Brass and Steel Hinges"},
    "Fire Hinge": {"Brass and Steel Hinges", "Door Hinge", "Hyland Hinge"},
    "Door Hinge": {"Door Hinge", "Hyland Hinge"},
    "Washroom Accessories": {"Bathroom Accessories"},
    "Glass Door Handle": {"Glass Door Handle", "Hyland Glass"},
    "Glass Door Patch Fittings": {"Glass Door Patch Fittings", "Hyland Glass"},
    "Hardware Accessories": set(),  # catch-all: always review-only
    "Cylindrical lock": {"Heavy Duty Cylindrical Lock", "Light Duty Cylindrical Lock"},
    "Tubular lock": {"Tubular Lock", "Hyland Tubular"},
    "Night Latch And Rim Lock": {"Night Latch And Rim Lock", "Hyland Rim"},
    "Commercial Locks": {"Commercial Lock"},
    "Grip Handle Set": {"Grip Handle Set"},
    "Fire Door Coordinator": {"Door Coordinator"},
}

def category_ok(stah_cat, cant_series):
    return cant_series in CATEGORY_MAP.get(stah_cat, set())

def norm(model: str) -> str:
    """Uppercase, strip spaces/hyphens/dots/slashes."""
    return re.sub(r"[\s\-./]+", "", (model or "").upper())

def base_key(model: str) -> str:
    """Leading alpha prefix + leading digit block, for near-miss grouping only."""
    n = norm(model)
    m = re.match(r"^([A-Z]*)(\d+)", n)
    return (m.group(1) + m.group(2)) if m else n

# ---- load stahlock ----
stah = json.load(open(WS + r"\stahlock_raw\stahlock_products.json", encoding="utf-8"))
stah_by_norm = collections.defaultdict(list)
for p in stah:
    stah_by_norm[norm(p.get("modelRaw", ""))].append(p)
stah_by_norm.pop("", None)

# ---- load cantonlock ----
cant = []
for f in glob.glob(WS + r"\cantonlock\content\products\*.json"):
    p = json.load(open(f, encoding="utf-8"))
    cant.append(p)
cant_by_norm = collections.defaultdict(list)
for p in cant:
    cant_by_norm[norm(p.get("model", ""))].append(p)
cant_by_norm.pop("", None)

def clean_label(l):
    """Strip bullet/dash prefixes stahlock leaves in labels."""
    return re.sub(r"^[\s•·●▪◦*\-–—]+", "", (l or "")).strip()

def norm_label(l): return re.sub(r"\s+", " ", clean_label(l).lower())
def norm_val(v): return re.sub(r"\s+", " ", (v or "").strip().lower())

rows, conflicts_seen, ambiguous = [], 0, []
mismatch_rows = []
matched_cant_slugs = set()

for nkey, s_list in sorted(stah_by_norm.items()):
    c_list = cant_by_norm.get(nkey)
    if not c_list:
        continue
    if len(s_list) > 1 or len(c_list) > 1:
        ambiguous.append((nkey, [p["id"] for p in s_list], [p["slug"] for p in c_list]))
    for sp in s_list:
        for cp in c_list:
            if not category_ok(sp.get("category", ""), cp.get("series", "")):
                mismatch_rows.append({
                    "cantonlock_slug": cp["slug"], "cantonlock_model": cp["model"],
                    "stahlock_id": sp["id"], "stahlock_url": sp["url"],
                    "stahlock_model": sp["modelRaw"],
                    "stahlock_category": sp.get("category", ""),
                    "cantonlock_series": cp.get("series", "")})
                continue
            matched_cant_slugs.add(cp["slug"])
            existing = {norm_label(s["label"]): s for s in (cp.get("specs") or [])}
            for ss in (sp.get("specs") or []):
                lab, val = clean_label(ss.get("label", "")), ss.get("value", "")
                if not lab or not val:
                    continue
                nl = norm_label(lab)
                if nl in existing:
                    if norm_val(existing[nl].get("value", "")) != norm_val(val):
                        conflicts_seen += 1
                        rows.append({
                            "cantonlock_slug": cp["slug"], "cantonlock_model": cp["model"],
                            "cantonlock_spec_rows": len(cp.get("specs") or []),
                            "stahlock_id": sp["id"], "stahlock_url": sp["url"],
                            "stahlock_model": sp["modelRaw"], "label": lab,
                            "stahlock_value": val, "type": "conflict",
                            "cantonlock_existing": existing[nl].get("value", ""),
                            "evidence": ss.get("evidence", "")})
                else:
                    rows.append({
                        "cantonlock_slug": cp["slug"], "cantonlock_model": cp["model"],
                        "cantonlock_spec_rows": len(cp.get("specs") or []),
                        "stahlock_id": sp["id"], "stahlock_url": sp["url"],
                        "stahlock_model": sp["modelRaw"], "label": lab,
                        "stahlock_value": val, "type": "new",
                        "cantonlock_existing": "",
                        "evidence": ss.get("evidence", "")})

# ---- near misses: same base key, different normalized model, NOT exact match ----
stah_base = collections.defaultdict(set)
for p in stah: stah_base[base_key(p.get("modelRaw", ""))].add(p["modelRaw"])
cant_base = collections.defaultdict(set)
for p in cant: cant_base[base_key(p.get("model", ""))].add(p["model"])

near = []
for bk in sorted(set(stah_base) & set(cant_base)):
    exact_pairs = {norm(m) for m in stah_base[bk]} & {norm(m) for m in cant_base[bk]}
    s_left = [m for m in stah_base[bk] if norm(m) not in exact_pairs]
    c_left = [m for m in cant_base[bk] if norm(m) not in exact_pairs]
    if s_left and c_left:
        near.append({"base": bk, "stahlock_models": "; ".join(sorted(s_left)),
                     "cantonlock_models": "; ".join(sorted(c_left))})

# ---- write outputs ----
hdr = ["cantonlock_slug", "cantonlock_model", "cantonlock_spec_rows", "stahlock_id",
       "stahlock_url", "stahlock_model", "label", "stahlock_value", "type",
       "cantonlock_existing", "evidence"]
with open(WS + r"\stahlock_mapping_dryrun.csv", "w", encoding="utf-8-sig", newline="") as f:
    w = csv.DictWriter(f, fieldnames=hdr); w.writeheader(); w.writerows(rows)
json.dump(rows, open(WS + r"\stahlock_mapping_dryrun.json", "w", encoding="utf-8"),
          ensure_ascii=False, indent=1)
with open(WS + r"\stahlock_near_misses.csv", "w", encoding="utf-8-sig", newline="") as f:
    w = csv.DictWriter(f, fieldnames=["base", "stahlock_models", "cantonlock_models"])
    w.writeheader(); w.writerows(near)
with open(WS + r"\stahlock_category_mismatch.csv", "w", encoding="utf-8-sig", newline="") as f:
    w = csv.DictWriter(f, fieldnames=["cantonlock_slug", "cantonlock_model", "stahlock_id",
                                      "stahlock_url", "stahlock_model", "stahlock_category",
                                      "cantonlock_series"])
    w.writeheader(); w.writerows(mismatch_rows)

# ---- summary ----
news = [r for r in rows if r["type"] == "new"]
label_dist = collections.Counter(r["label"] for r in news)
print(f"stahlock products parsed : {len(stah)}")
print(f"exact-match model keys   : {len([k for k in stah_by_norm if k in cant_by_norm])}")
print(f"category-mismatch pairs  : {len(mismatch_rows)} (excluded, review-only)")
print(f"cantonlock products hit  : {len(matched_cant_slugs)}")
print(f"proposed NEW fields      : {len(news)}")
print(f"conflicts (report only)  : {conflicts_seen}")
print(f"near-miss groups         : {len(near)}")
print(f"ambiguous keys           : {len(ambiguous)}")
print("top new-field labels     :", label_dist.most_common(12))
thin = [s for s in matched_cant_slugs
        if len(next(p for p in cant if p['slug']==s).get('specs') or []) <= 2]
print(f"matched & thin (<=2 rows): {len(thin)}")
print("\nsample new rows:")
for r in news[:3]:
    print(" ", r["cantonlock_model"], "<-", r["stahlock_model"], "|", r["label"], "=", r["stahlock_value"], "|", r["stahlock_url"])
