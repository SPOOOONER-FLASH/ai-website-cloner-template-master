# 2026-10-23 · Claude · reception desk print artwork

**Ask (client):** 「设计接待台广告，准备广告尺寸 1.6米/1米/50厘米」.

**Assumption, unconfirmed:** desk 1600 W × 1000 H × 500 D → front 1600×1000 mm, two ends
500×1000 mm. Vendor bleed / format not yet known; files carry 3 mm bleed + crop marks.

**Changed**
- `scripts/build_reception_desk_ad.py` (new): generator for both directions ("light" white
  field, "dark" rich-black field with white specimen tiles). Six real catalogue photos from
  `public/images/products-hyde/` (9014 SSET, AR4-110, 70 SNDK, SSH016, 311, glass-door pull),
  corner HYDE mark cleared and levels lifted to paper white, nothing else altered; each in its
  own captioned cell (not true relative scale, so never composed as one scene). CMYK with full
  GCR, 150 ppi at placed size, TrimBox/BleedBox set, bottom 100 mm kept clear (plinth).
  QR → `https://cantonlock.com/?utm_source=reception_desk&utm_medium=print` (GA4 attributable).
- Output (not in git): `/mnt/project-files/reception-desk-2026-10-23/` — 6 PDFs + 2 previews.

**Risks / contradictions**
- Source photos are 1000 px; at 150 ppi the front cells are ~2× upsampled. Fine at reception
  viewing distance; hi-res factory originals would be better for the side-panel lever.
- Site copy says both "since 1998" (company) and "making locks since 1999" (one page). The ad
  uses 1998; someone should reconcile the 1999 sentence.
- Not run: `npm run check` — the change is a standalone Python generator outside the build.

**Next:** client picks a direction + confirms size/vendor spec; re-run with `--out`.
Codex may restyle (visual lane); wording stays as is unless the client changes it.
