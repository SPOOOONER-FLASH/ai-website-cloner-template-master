# Cylinder colour reviews — 2026-10-10

Scope: genuine cached photographs on the parent pack's petrol-blue and terracotta empty fields. Existing source-shadow renderer unchanged. No application, catalogue, public image, export, live image or external disk touched.

| Model / photograph | Field | State |
|---|---|---|
| 70 ABKT CP, original photograph 1 | Petrol blue | Actual review rendered; HELD for thin pale upper-rim contour validation |
| 60 CPDK, cached PSD 1 product layer 1 | Terracotta | Actual native colour portrait rendered; HELD for pale body-rim contour validation; no added contact shadow |

Reproduce from the isolated checkout root:

```powershell
node docs/design-references/kanee-category-colour-2026-10-10/lock-cylinders/rebuild.mjs
```

70 uses the unchanged supplied alpha at original offset (124,148) and full photograph RGB. Only the empty field is resized, blurred0.9 and given gain0.95. Source metal, camera, orientation, scale, components and ground-shadow coordinates are preserved. Visible external circles do not establish internal pin count. The model's exact current factory finish and kit contents are unconfirmed; retain photographed gold/brass appearance without inventing a finish label.

60 layer1 is648×591 at offset(89,153) in the original800×800 PSD frame. The actual cached source and original layer manifest are retained in its folder. Its cylinder and keys stay together, unchanged; the separate screw layer is not added. Discarding the native alpha reveals stretched border RGB, not a ground photograph. The diagnostic records why no source-shadow treatment is claimed; it is not a usable full photograph. Layer0 is plain white, layer2 a corner badge and layer3 a separate screw. The colour portrait overlays only the unchanged native cutout onto the parent empty terracotta field. No new ground shadow, approximate product mask, invented component or replacement65 mask was produced. Missing natural ground is an explicit aesthetic limitation of this design study.

`contour-3x.png`, `thumbturn-contour-3x.png` and `keys-contour-3x.png` are nearest-neighbour inspection crops, not resized deliverables. The lossless masters preserve original product scale. Enlarged review shows thin pale/white body-rim lines. Source highlights versus extraction fringes cannot be conclusively separated, so neither specimen is called accepted. Their alpha is not approximated or eroded to hide this issue. Each `qa.json` separates this visual hold from pixel-fidelity verification.

Original PSD hashes are historical receipts only; this session verifies the retained local PNG hashes. Technical pixel equality and contour review are separate from client aesthetic acceptance. No full project build or deployment is claimed.

Session delta / handoff: two colour masters, WebP companions, pinned inputs/specs, reproducible recipe, provenance receipts and individual visual-QA holds created only under this cylinder folder. Focused rebuild exited0, with104839 and162579 opaque source RGB pixels compared and zero differences respectively. Existing source-shadow renderer remains unchanged. Parent owns the combined agent-update and client review; no staging or commit was performed here.
