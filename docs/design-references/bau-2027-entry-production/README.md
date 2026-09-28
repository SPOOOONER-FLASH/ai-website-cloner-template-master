# BAU entrances 1 + 2 — implementation evidence

The client selected the AR4 homepage slot replacement and the information band below navigation. These captures are from the actual static export, using the existing HYDE typography, grid and unchanged 307/311 product photographs. They supersede the four-option study for the chosen layout.

The screenshots cover the English desktop and phone layouts and the German phone layout. The band scrolls with the page; navigation remains sticky. Both sections expose the English and German BAU pages as ordinary initial-HTML links. The German primary goes to `/de/bau-2027/`; other homepages use `/bau-2027/`, with an English-language label where needed.

## Reproduce

Run `npm run check` in the source checkout first. This session used the already installed PowerShell 7 for npm's nested scripts after the default CMD context reported a local SVG rewrite error. This setting is scoped to the terminal; no generator, test, global npm configuration or package was changed:

```powershell
$env:npm_config_script_shell = (Get-Command pwsh).Source
$env:NEXT_BUILD_CPUS = '8'
npm run check
```

Its exported `out/` is verification output; releases remain the responsibility of the HYDE engineering release session. In a separate terminal, serve that export:

```powershell
& 'C:/Users/johns/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe' -m http.server 8769 --bind 127.0.0.1 --directory out
```

Then run the checked-in browser verifier with the already bundled Playwright package:

```powershell
$env:BAU_QA_PLAYWRIGHT = 'C:/Users/johns/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'
node scripts/design/check-bau-entry-pages.mjs http://127.0.0.1:8769 docs/design-references/bau-2027-entry-production
```

It verifies ten initial HTML homepages, the two retained meeting forms, 15 language/viewport states (320–1440 px), image loading and contain fit, touch targets, overflow, visible keyboard focus, browser errors, real booking links and sticky navigation. It saves six section captures and `results.json`, including the image candidates actually requested. It does not submit a meeting request. Stop the temporary server with Ctrl+C when finished.

The event date, venue, hall and stand derive from `content/bau-2027.json`. The product photographs illustrate existing factory products; this change adds no claim about a confirmed exhibition shortlist. No generated stand or metal product was used.
