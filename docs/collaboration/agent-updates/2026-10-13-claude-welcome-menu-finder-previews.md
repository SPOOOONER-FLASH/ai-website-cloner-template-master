# 2026-10-13 Claude: welcome band, mega menu and Product Finder previews

- **Requests:**
  - Task row 72: bring the three scroll effects to the homepage band after the hero. The effects are parallax, rise on entry and scroll-linked word brightening. The band is the two-photo teaser, the welcome copy, the signature and the facts.
  - Row 73: tidy the Company and Resources mega menus.
  - Row 74 (later sharpened as row 77): redesign the Product Finder's Catalog, Configurator and Studio. 「你给几个方案单独」.
- **Method:**
  - Workflow 1 (`wf_c8b65aa6`) handled the welcome band, the menu and a baseline finder. It ran 20 agents, in this order:
    1. Measured the product page's design language. The spec is saved in this session's scratchpad as `lang-spec.md`, and its Chinese section answers row 76.
    2. Ran a Yuangao/reference-site pattern sweep.
    3. Audited the three live surfaces.
    4. Wrote a design plan for each surface.
    5. Revised each plan after adversarial review.
    6. Built, QA'd and fixed each surface.
  - Workflow 2 (`wf_0113fa9e`) builds three separate finder directions, `finder-a/b/c`. Their files are not in this commit.
- **Preview files:** all are in `docs/design-references/2026-10-12-motion-demo/`. Each preview is its own vite entry with CSS scoped under `.pv-<name>`. Each has a prep script that copies real files from `public/` and computes its numbers from `content/`, and the prep script throws if a file is missing.
  - `welcome.html`, `WelcomePreview.jsx`, `welcome.css`, `prep-welcome.mjs`:
    - The two teaser photos get parallax: card 2 settles from 32 px lower.
    - The first four sentences of the live welcome copy become a 62-word statement that brightens word by word as it scrolls.
    - The rest of the copy is set in two columns.
    - The signature (legal name, 101–200 people, ISO mark) and the links move under the H1.
    - The figures 549 / 17 / 196 rise once.
    - `?still` and reduced motion show the final state.
  - `menu.html`, `MenuPreview.jsx`, `menu.css`, `prep-menu.mjs`:
    - Every shelf now opens with the same ruled left "ledger": Products shows 549 records and the tools, Company the legal name, Resources the newest published guide (added after QA, because the empty ledger repeated the inconsistency the client screenshotted), and Buy the export promise and email.
    - Every item has a count and a one-line detail.
    - Keyboard, RTL and the phone drawer are covered.
  - `finder.html`, `FinderPreview.jsx`, `finder.css`, `prep-finder.mjs`: the baseline finder in the product-page language. It runs through the dev server only, and photos beyond the 58 copied ones load from cantonlock.com.
  - `build-previews.mjs`: builds any of these into double-click single files under `dist/previews/` (gitignored), copying each preview's image folder.
- **Checks:**
  - Each preview passed builder screenshots, an independent QA pass and a fix pass.
  - I opened the built files from disk at 1440 and 390: no console errors, no failed requests, no horizontal overflow, no broken images.
  - The numbers trace to `content/` (549 / 17 / 196, 5 / 45 / 37 / 23, BAU 11–15 Jan 2027, Hall C4, Stand 523).
- **Not touched:** site code, `out/`, RAYEN. No release is needed.
- **Open items from QA:**
  - The live `Configurator.tsx` quote link sends `configuration=`, which `inquiry-prefill.ts` ignores.
  - The function codes IK and KT need names from the client.
  - Raw supplier wording in material and finish values needs a separate normalisation pass.
- **Next step:**
  1. Send the previews and the three finder directions to the client.
  2. After the client chooses, port the chosen pieces into the live components as separate releases. Every new string costs es/pt plus 7 overlays.
