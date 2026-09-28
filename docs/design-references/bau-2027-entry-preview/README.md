# HYDE BAU entrance previews — 2026-09-28

Four interactive placement studies, preserving the incumbent FSB-inspired monochrome language. Only the proposed entry and concise surrounding context are depicted; header language choices and context are deliberately simplified. This is not a deployed website or a reconstruction of the entire homepage.

## Editable source and regeneration

`preview.template.html` is literal editable HTML. The generator embeds existing image renditions unchanged, verifies the inline size ceiling, and writes the provenance manifest. No image generation, metal-part changes, new dependencies, website source or export changes.

```powershell
node scripts/design/build-bau-entry-preview.mjs --out C:/Users/johns/.codex/visualizations/2026/09/28/01a0e71e-5ef4-73c3-a13e-2c282aca4273/hyde-bau-options.html
```

The variant carousel is supplied by the visualization runtime. The explicit desktop/phone controls and Menu button operate locally; booking and German links open the existing production BAU pages. The preview does not collect or send meeting details.

## Verification

Real Chromium checks cover four variants at 1024px desktop, 390px simulated phone and 320px narrow width: 12 states, no horizontal element overflow, broken images or JavaScript errors. Every design has both EN/DE event destinations. All product photos use `contain`. The Menu and device controls were exercised. Screenshots and machine-readable evidence live in ignored `tmp/codex-bau-visual-review/preview-qa/` and can be regenerated.

Use the already bundled Python to run the visualization skill renderer temporarily, then the existing Playwright package to check it:

```powershell
& 'C:/Users/johns/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe' 'C:/Users/johns/.codex/plugins/cache/openai-bundled/visualize/1.0.41/skills/visualize/scripts/render.py' 'C:/Users/johns/.codex/visualizations/2026/09/28/01a0e71e-5ef4-73c3-a13e-2c282aca4273/hyde-bau-options.html' --serve --port 8768
```

In a separate terminal:

```powershell
$env:BAU_PREVIEW_PLAYWRIGHT = 'C:/Users/johns/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'
node scripts/design/check-bau-entry-preview.mjs http://127.0.0.1:8768/
```

Stop the temporary renderer with Ctrl+C. The delivered inline preview works independently of that server.

`node --check` passes for both generator/checker. Impeccable's HTML detector ran once and returned no matches **in degraded regex mode**, because its optional HTML parser modules are absent; no full contrast/computed-style audit is claimed. No runtime was installed. `npm run check` and HYDE release were not run: production source is unchanged and existing shared release outputs were preserved.

Product provenance is in `provenance.json`. Event copy follows the EN/DE pages reviewed earlier in this chat. Recover current published BAU source before turning a selected preview into a production implementation.
