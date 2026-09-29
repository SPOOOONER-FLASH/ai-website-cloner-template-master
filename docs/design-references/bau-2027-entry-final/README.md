# BAU 1 + 2 with the original lower AR4 showcase

The client requested two releases in order: publish the selected BAU showcase and information band first, verify the remote deployment, then replace the repeated lower 307/311 tooling section with the original AR4 showcase. Stage 1 was published as `974fd5bcae6`; direct HTTPS origin verification passed before stage 2 began. The urgent-release agent update records commit and deployment results.

The final layout preserves both BAU entrances. Below them, the original Argentina AR4 module returns with its unchanged architectural hero, four existing model records (AR4-110, AR4-140, AR4-101 and AR4-1121), real product photographs and collection link. Locale props remain intact. The repeated lower flagship section is removed from the homepages; its standalone component remains available in the repository.

## Reproduce the captures

Run `npm run check` first. On this Windows checkout the documented byte-comparison guards may require normalizing generator output after Git writes CRLF; this changes no repository content:

```powershell
node scripts/build-product-image-config.mjs
node scripts/build-branded-editorial-list.mjs --write
node scripts/build-legacy-redirects.mjs
$env:npm_config_script_shell = (Get-Command pwsh).Source
$env:NEXT_BUILD_CPUS = '8'
npm run check
```

Serve the checked export in a separate terminal:

```powershell
& 'C:/Users/johns/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe' -m http.server 8770 --bind 127.0.0.1 --directory out
```

Then run the browser verifier:

```powershell
$env:BAU_QA_PLAYWRIGHT = 'C:/Users/johns/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'
node scripts/design/check-bau-entry-pages.mjs http://127.0.0.1:8770 docs/design-references/bau-2027-entry-final --expect-ar4
```

It checks ten initial HTML homepages, both retained meeting forms, 15 language/viewport states, the AR4 section's order and original images, removal of the repeated flagship, real BAU navigation, mobile overflow, focus and sticky navigation. It saves nine captures and `results.json`. During the tall AR4 section capture only, the sticky navigation is temporarily hidden to prevent its overlay from obscuring the hero halfway through the image; navigation remains visible for the interaction checks. No meeting request is submitted. Stop the server with Ctrl+C when finished.

## Verify the deployed origin

After the standard HYDE release and server deployment complete:

```powershell
node scripts/design/check-bau-entry-origin.mjs --expect-ar4 --out tmp/codex-bau-ar4-qa/origin-final
```

This verifier connects directly to the configured origin with the production HTTPS hostname and certificate verification. It checks EN/DE homepages and BAU pages, linked JS/CSS/fonts, the restored AR4 hero/product images, and absence of the repeated flagship. Its `verification.json` can be archived here. It does not operate Cloudflare or submit forms.
