# 2026-10-13 Claude: 308-S / 308-D new photographs and video; old 308 retired from HYDE (row 91)

Client: 「新品，要删除旧的308 麻烦上架」 with `Panic Exit Devices(2).zip` (308-S and 308-D folders: 主图, 图库, 视频).

- **Imported** with the house scripts: `import-client-product-photos.mjs` and `import-client-product-videos.mjs` (720p/30, 50 MB → 2 MB, posters chosen by sharpness), then `assets:watermark`, `build-product-image-config`.
- **Curated before publishing.** The originals carried a HYDE logo baked into the top-left, so the watermark pass would have put a second mark on every image. The baked logo was painted out on the originals: a 220×58 white patch on a white field, checked image by image, and the 308-D drawing was rebuilt after the first pass clipped a dimension line.
  - Published: **308-S** hero + 5 views (front, box contents, end cases, dimension drawing, opened case) and **308-D** hero + 4 views (rods laid out, box contents, opened case, dimension drawing). Each has en/es/pt alt text.
  - Held back for the client, not published:
    - three corridor scenes (308-D grey double door; 308-S red doors with a figure; 308-S bar on a grey door), which look composited or generated, against the real-in-camera rule;
    - two "MATERIAL DETAILS" infographics, which carry certification-style icons nobody has verified.
  - Specs unchanged. The drawings show figures, but no spec row was derived from an image.
- **Old 308 retired from HYDE**:
  - `sites: []` on `308-panic-exit-device`. RAYEN only shows records whose `sites` contains "rayen", and this record had no `sites`, so RAYEN output is unchanged.
  - `productMerges` 301 → `308-s-s-panic-exit-device` with new reason `superseded-by-new-model`. `superseded-models.ts` keeps it off the model-lookup "renamed" list ("nothing changed" would be false).
  - The nginx taxonomy conf was regenerated. The 308 spec-sheet PDFs (10 languages) and their manifest entry were removed.
  - `product-sites.test.ts` now ignores redirect stubs for merged slugs.
- **Counts that moved**, all ten languages (scripts in `tmp/claude-308/`, rules printed for review before `--write`):
  - catalogue records 616 → 615: what-documents, mortise backset guide, commercial-lock-function, refurbishment survey, powder-coating, technical-drawings;
  - visible listings 549 → 548: what-documents, technical-drawings, and the FAQ OEM answer;
  - technical-drawings coverage 14 → 13 % (72/548). Its overlays still said 546 / 613 and now read 548 / 615.
  - exit-device guide: 44 → 43 records, 27 → 26 devices, 13 → 12 publish a length. The 308 table row, its projection sentence and its FAQ length entry were removed. Turkish case suffixes were fixed (26'sı, 12'si).
  - "why-the-catalogue-is-this-wide" keeps 616 because it is dated "as of September 2026".
- **Checks:** tsc; `npm test` 487/0; i18n-lint; titles:check; motion tokens; image-config and watermark checks. Local render: 308-S (7 thumbs + video), 308-D (6 + video), old 308 URL redirects to 308-S, guide 43 has no bare 308.
- **Release:** engineering session. Expect `product-sites` to stay green after the rebuild.

## Follow-up the same day (row 92): the five held images

The client changed the image rule (renders, 3D and AI re-renders are now allowed when they follow every real photograph and published dimension of the model; AGENTS.md on main, 8db621c0) and said 「5 张上架」. Each image was compared against the model's own photographs on the checklist: holes and screws, lever or bar profile and thickness, proportions against published dimensions, cylinder and keyway, part count, and finish.

- **Published (3):**
  - 308-S on a grey steel door (`-7`). This is a real photograph: latch case with its four screws and visible latch bolt, end case and bar all match. The baked-in logo was filled column-wise from the pixels directly above and below it.
  - 308-S MATERIAL DETAILS (`-8`).
  - 308-D MATERIAL DETAILS (`-6`), with its CE, fire and exit icons painted out. A CE mark on a panic device asserts conformity nobody has evidenced for this model; that is the "never claim certified to EN 1125" rule.
- **Not published (2), failed the checklist:**
  - 308-D grey double-door scene: the top rod carries two guide brackets where the real hero photograph and the dimension drawing show one, so there is one part too many.
  - 308-S red double-door scene: the latch cases sit at the hinge edges of a mullion-less pair, and no latch bolt is visible, so the installation geometry is wrong for this device.
  - Both reported to the client with these findings.
