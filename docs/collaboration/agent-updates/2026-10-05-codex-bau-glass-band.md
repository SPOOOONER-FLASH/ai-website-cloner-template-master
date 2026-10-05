# Codex — BAU exhibition band glass material

- Agent: Codex, `E:/cantonlock-vis`, branch `codex/contact-catalogue`.
- Request: make the existing HYDE at BAU 2027 notification band look like frosted glass.
- Production scope: only `src/components/site/BauEntry.module.css`. The band gains an 84% translucent surface gradient, 16px backdrop blur with 115% saturation, a soft highlight and a 4% ink shadow. Secondary band text is darker for legibility. The unsupported-blur fallback retains the solid surface.
- The component remains in normal document flow. Existing grid, 1032px breakpoint, stand-line reservation below that breakpoint, minimum height, link targets and 44px click height are retained. The shared showcase secondary link is unaffected because the new text color is scoped beneath `.band`.

## Verification

- Read the installed Next CSS Modules guide before editing. `lightningcss` compiled the actual source as CSS Modules; expected band/link exports are present. PostCSS parsed and scoped the same source into the preview. Fragment JavaScript parsed with `vm.Script`; preview runtime logged no warnings/errors.
- `node scripts/build-bau-glass-preview.mjs --inline-output C:/Users/86132/Downloads/cantonlock/tmp/codex-inline-nav/hyde-bau-glass.html` regenerates both tracked preview and the conversation-readable copy. The generator validates genuine directory parents for the latter, because the previous migration junction caused inline read errors.
- The generator reads light fallback colors and blend weights from the CSS and computes secondary text contrast over a black underlay: 4.94:1. This is a reference color calculation, not a claim about every possible theme or browser compositor.
- Browser observations at outer widths 1440, 1024, 736 and 320px (iframe widths 1408, 992, 704 and 288px): no horizontal overflow; 44px-high links; desktop three-column band height 74px; narrower one-column band height 136.39px, with stand facts on their reserved line. Removing preview-only outer margins also removed a renderer iframe scrollbar; this did not alter production CSS.
- Native anchors retain `tabIndex=0` and existing focus-visible CSS. Automated Tab input timed out in the browser control layer and sent no key, so keyboard traversal is not claimed as a passed browser test.
- Independent read-only review found no blocking issue and confirmed layout/scope preservation. Full build was not run: the johns engineering/release session owns `out/`.

## Preview and limits

- Editable source: `docs/design-references/2026-10-04-bau-glass.template.html`.
- Generated fragment: `docs/design-references/2026-10-04-bau-glass.html`.
- Generator: `scripts/build-bau-glass-preview.mjs`; it injects the actual production CSS, rather than a separate approximation of the material.
- The optional host control compares glass with the prior solid material. Event facts and EN/DE destinations remain the existing source values. The preview uses simplified page gutters and an Archivo/Arial font stack, so it is not a claim of complete production typography parity.
- With a white page behind the normal-flow band, blur alone is barely visible. The visible material comes primarily from the translucent gradient, highlight and shadow. No invented background image or product asset was added to exaggerate it.

## Release handoff

- Source and preview are ready to push to main. No `out/` rebuild, deployment or Cloudflare operation was performed by this task.
- Next useful assist: the current release builder should incorporate the committed CSS during the ordinary HYDE export/release and verify `[data-bau-info-band]` on desktop and phone at the origin.
- Other navigation/language prototypes, other agents' files, content, product images and routes are untouched.
