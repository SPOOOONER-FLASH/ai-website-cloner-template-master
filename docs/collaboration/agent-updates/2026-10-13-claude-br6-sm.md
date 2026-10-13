# Claude — BR6-SM back on the Brazil collection (2026-10-13)

Client: 「BR6-SM 的修图接着重做，修好后加回巴西专栏」.

## What changed

- `public/images/brazil-collection/br6-sm.webp` + one row in `src/data/generated/brazil-collection.json`
  (single-door panic bar with microswitch). The collection is now 40 models; every count on the page is computed.
- `scripts/argentina/retouch-stamps.mjs`: new box mode `lines`, used only by the local BR6-SM spec.
  - **Why**: on this housing the lettering is moulded right against the inner ridge and the rim bevel. The v/h blend runs
    across those edges, and that is what left the notch the 10-12 verifier rejected.
  - **How**: `lines` blends each pixel from clean pixels above and below it, along the line between two measured edges
    (polylines). An edge running through the patch therefore continues from its own pixels.
  - `fill: "harmonic"` is used for the plain face between the strips. A line-wise blend stretched the JPEG grain there
    into streaks.
  - `whole: true` rebuilds every pixel in the polygon. A missed faint letter edge would otherwise be copied as "clean".
- The script now has a main guard, so importing it no longer runs every Argentina spec.
- `scripts/argentina/retouch-stamps.test.mjs`, added to `npm test`: the letter goes, the ridge continues, pixels outside
  the polygon do not change, and the harmonic fill settles.

## Verified

- Independent verifier, round 1: **FAIL**. The first harmonic version bit the left bevel and smeared the rib highlight.
  Fixed by splitting each housing into ridge strip + bevel strip (`lines`) and a face (`harmonic`).
- Round 2: **PASS**. No lettering is traceable at 5× brightened. Every changed pixel is inside the two face regions
  (x 191–348 / 938–1077). Rims, bevels and screw holes are unchanged. The ridges are continuous, with no kink or step.
- `npm test`: 484 pass, 0 fail. The Argentina default path still runs (`117_Candex_niq`, same spec, same seed).
- The spec and its generator stay local, because the file path names the customer:
  `tmp/claude-brazil/stamps/br6-sm.json` and `tmp/claude-brazil/_br6spec.mjs`.

## Not done / for the release session

- Source only. **The HYDE release baton is with the engineering session**, so the next `release:hyde` carries this.
  Spot-check `/products/brazil/` and `/pt/products/brazil/` for the BR6-SM card.
- Local dev preview could not compile: `lenis` (from 835ff5ea9f9, homepage smooth scroll) is not installed in the shared
  `node_modules`. That is not mine and I did not install it. The release checkout installs it from the lockfile.
