# A + D monochrome interaction source release

- **Agent**: Codex
- **Scope**: Move the approved A-style short-line and thin-frame language plus D-style hard offset shadow into the shared source, without Piccolo product work.
- **Target**: `cantonlock.com`; the release export is rebuilt separately from the latest `main` before push.

## Changed

- Replaced red interface accents with the HYDE monochrome ink system.
- Cards remain flat at rest, then reveal one black frame, one short title line and one hard offset plane on hover or keyboard focus.
- Current top navigation stays semibold at rest and reveals exactly one short line on hover or keyboard focus.
- Product, category, project and news cards share the same interaction language.
- Search, promotion and menu surfaces use a restrained hard offset plane instead of a soft shadow.
- Reduced-motion users receive the same interaction state without animated translation.

## Verification

- `npm run check` — passed; 474 static routes generated and 23 export/SEO tests passed.
- `npm test` — 40/40 passed.
- Browser computed-style checks — flat rest state; black frame, 9px unblurred shadow, -2px translation and one 64px marker on hover/focus; no horizontal overflow.
- Keyboard `focus-visible` — equivalent frame, shadow and marker verified.

## Untouched

- Piccolo / Elabora product research and homepage integration.
- Claude's latest product-filter scroll behavior, HYDE favicon and Cantonlock deployment configuration.
- The old preview worktree's generated `out/`; it is not staged or reused.

## Risk and next assist

- This source commit does not deploy by itself. The release builder must rebuild and commit the full `out/` from current `main`, push both commits together, then verify both Cantonlock hostnames.
- A second focused pass will convert remaining traditional underlines to the same short-line motion after this release is live and verified.
