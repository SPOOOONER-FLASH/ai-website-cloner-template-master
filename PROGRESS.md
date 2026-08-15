# Canton Hyland Prototype — Progress

Internal desktop visual prototype. Layout reverse-engineered from `https://www.fsb.de/en/`;
brand identity is Canton Hyland's own. Not for publication or deployment.

---

## Status

| Phase | State |
|---|---|
| Layout replication (desktop, 1512px) | Done — 21/21 modules pixel-exact |
| Placeholder content pass | Done — line counts calibrated to the reference |
| Static export (`out/`) | Done — `canton-demo.zip` at repo root |
| Brand colour system | Done — this pass |
| Header modals (language / search / mega-menu) | Not implemented (known gap) |
| Responsive below 1376px | Carried structurally, not visually reviewed |

---

## 2026-08-15 — Brand colour system landed

Replaced the placeholder accent (`#1A1A1A`, itself a stand-in for the reference site's
`#F4FF71`) with the full Canton Hyland palette.

### Tokens — `src/app/globals.css` `@theme`

```
--color-brand           #E32322   links, primary button fill, current nav item
--color-brand-hover     #C41C1B
--color-brand-active    #A11716
--color-brand-tint      #FDECEB   tags, badges          [defined, no instance yet]
--color-ink             #121212   headings, body copy
--color-ink-secondary   #6E6E73   captions, descriptions
--color-ink-tertiary    #8E8E93   decorative grey — icons, display glyphs
--color-line            #E5E5E7   rules, borders, dividers
--color-surface         #FFFFFF   primary background
--color-surface-alt     #F5F5F7   alternating blocks    [defined, no instance yet]
--color-surface-dark    #2C2C2E   footer, dark cards    [defined, no instance yet]
--radius-card           2px       rule 4 ceiling
```

Retired: `--color-white`, `--color-black`, `--color-highlight`,
`--color-highlight-foreground`, `--color-gray`, `--color-aluminum`, `--color-stainless`,
`--color-bronze`, `--color-red`, and the whole `--c-*` RGB-triple block. Zero stale
references remain (`grep` verified).

### Colour rules (binding — restated at the top of `globals.css`)

1. **Brand red is for clickable things only** — primary button fill, links, link hover,
   the *currently selected* nav item, form focus borders.
2. **Never red** — headings, body copy, icons, dividers, decorative elements.
3. **No gradients, metallic effects, glows or shadows.** Fully flat; the logo is the only
   decorative artefact.
4. **Card radius 0–2px, no shadow.** Hierarchy comes from whitespace and `--color-line`.

Enforcement check on every pass: `grep -rni "shadow\|gradient\|rounded" src/` must return
only comments and `--radius-card`.

### Where brand red appears on `/`

| Location | Count | Trigger |
|---|---|---|
| Promo-bar link label ("Project Planner") | 1 | static |
| `ArrowLink` (5 hero + 3 text + 3 welcome + 5 footer) | 16 | static |
| Footer legal links + "Data preferences" | 4 | static |
| Hero module hover outline | 5 | hover |
| Teaser card hover outline | 6 | hover |
| Current nav item | 0 | none current on `/` |
| Primary button fill | 0 | component built, not mounted |
| Form focus border | 0 | no forms on the page |

21 statically red elements; 11 more turn red on hover.

### Files touched

| File | Change |
|---|---|
| `src/app/globals.css` | Token block replaced; colour rules documented; `.btn/.btn-primary/.btn-secondary/.field` added; `body` → surface/ink |
| `shared/ArrowLink.tsx` | → `--color-brand`, hover `--color-brand-hover`, active `--color-brand-active` |
| `shared/MediaPlaceholder.tsx` | Fill → `--color-line`; label → `--color-ink-secondary` |
| `shared/Button.tsx` | **New** — primary/secondary per spec |
| `en-7a4ba3ba/SiteHeader.tsx` | Promo bar → ink bg / white text / brand link; nav gains `current` flag; icons → tertiary |
| `en-7a4ba3ba/SiteFooter.tsx` | Top rule black → `--color-line`; links → brand; headings → ink |
| `en-7a4ba3ba/HeroModule.tsx` | Hover outline black → brand; title/body → ink |
| `en-7a4ba3ba/PageTeaserModule.tsx` | Hover outline → brand; title → ink, subtitle → ink-secondary |
| `en-7a4ba3ba/TextModule.tsx` | Heading/body → ink |
| `en-7a4ba3ba/WelcomeIntro.tsx` | h1/copy → ink; chevron → tertiary; caption → ink-secondary |

### Verification

- `npm run lint` — 0 errors, 1 pre-existing warning (`no-page-custom-font`, false positive
  for an App Router root layout)
- `npm run typecheck` — clean
- `npm run build` — clean, static export regenerated
- Geometry regression: **0 mismatches** across all 21 modules; document height 10838px,
  unchanged by the recolour

### Contrast measurements (WCAG 2.1)

| Pair | Ratio | AA normal text (4.5) |
|---|---|---|
| white on ink — promo bar text | 18.73 | pass |
| ink on white — body copy | 18.73 | pass |
| brand on white — body links, 18px | 4.64 | pass |
| white on brand — primary button | 4.64 | pass |
| white on brand-hover | 5.95 | pass |
| white on brand-active | 7.93 | pass |
| ink-secondary on white | 5.07 | pass |
| **brand on ink — promo bar link, 18px** | **4.04** | **fail** |
| ink-secondary on line — placeholder label, 12px | 4.03 | fail (scaffolding only) |
| ink-tertiary on white | 3.26 | n/a — token is non-body by definition |
| brand on brand-tint | 4.06 | fail if used for text |

---

## Open items

1. **Promo-bar link contrast 4.04:1.** Specified as `#E32322` on `#121212`. Options if it
   needs to clear AA: lighten the on-dark link to ~`#FF5A55` (≈5.9:1), keep the label white
   and mark it with a brand-red underline, or accept it as a decorative strip.
2. **`--color-surface-alt` / `--color-surface-dark` / `--color-brand-tint` unused.** The
   cloned layout has no alternating-tone blocks, no dark footer and no badges. Flipping the
   footer to `--color-surface-dark` is a visual-design decision, not a token substitution —
   awaiting a call.
3. **`src/components/ui/button.tsx` is dead shadcn scaffold** and violates rules 3 and 4
   (`rounded-lg`, focus ring shadows). Nothing imports it. Recommend deleting it so it
   cannot be picked up by mistake alongside `shared/Button.tsx`.
4. **Header modals** still unimplemented — three inert controls.
5. **`no-page-custom-font` warning** — resolvable by switching to `next/font/google`, which
   would also self-host Archivo instead of hitting the CDN.
