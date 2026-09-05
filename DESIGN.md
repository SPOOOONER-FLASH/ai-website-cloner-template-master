# HYDE Web Design System

## Visual world

HYDE uses a restrained industrial-editorial world: white and cool light-grey fields,
near-black type, architectural rules, brushed-metal product surfaces, disciplined open
space, and one clear focal move per viewport. It should feel like a manufacturer with
design literacy, not a lifestyle shop or a software dashboard.

## Tokens

- Ink: `#11110f`; secondary ink: `#6e6e73`; tertiary ink: `#8e8e93`.
- Surface: `#ffffff`; alternate surface: `#f5f5f7`; dark surface: `#2c2c2e`.
- Rules: `#deddd8`; restrained brand tint: `#efefeb`.
- Typeface: Archivo via the project's `--font-sans`; no decorative display face.
- Corners: nearly square (`2px`) unless a physical product form itself is rounded.
- Grid: mobile-first 4/8/12 columns and 24 columns at wide desktop, with the existing
  `layout`, `col-content`, `col-outset`, and `col-popout` boundaries.
- Motion: crisp 180/260 ms interface transitions; 560 ms only for one authored reveal.

## Composition

- Let one large product system, editorial image, or decision path own the first viewport.
- Use calm negative space to establish hierarchy, not empty space that removes evidence.
- Vary section density and image scale; do not repeat a wall of equal cards.
- Product families may form a map, atlas, sequence, or schedule, but their reading order
  must remain semantic and predictable on mobile.
- Keep factual labels and actions in HTML. Never bake model numbers, claims, controls,
  certification marks, or navigation text into generated photography.

## Photography grammar

- Product-atlas images share a cool neutral field, consistent camera height, one soft
  directional light, restrained contact shadows, complete silhouettes, and clear visual
  scale tiers without implying dimensional scale. Long pull handles anchor; lever handles establish rhythm; small parts act
  as punctuation. Objects do not overlap.
- Exhibition-wall images must originate from actual client photographs. Only crop,
  perspective, exposure and colour correction are permitted, not invented displays.
- All metal product imagery uses real catalogue/client photographs with original geometry,
  components and finishes preserved. Generated hardware is forbidden even for editorial
  concepts. Compositions do not establish a sold set or dimensional scale.
- Current Products application imagery is an actual source-pack push/pull mechanism
  photograph, not a claim of a completed installation or exhibition. The supplied exhibition
  temporary paths are unavailable; retain this honest fallback until originals are recovered.

## Components and interaction

- Use rules and spacing before containers. Avoid nested cards, gratuitous pills, floating
  controls, soft dashboard chrome, and repeated hard-shadow tiles.
- Primary actions are short, direct links or the existing button language. A menu first
  resolves navigation intent; it is not a second homepage.
- Navigation, filters, comparison, and contact routes remain keyboard operable, focus-safe,
  responsive, and available without relying on animation.
- Respect reduced-motion preferences. Motion explains grouping, selection, or product
  geometry and never delays access to content.

## Content hierarchy

Range overview answers what HYDE makes. Family views explain form and scope. Application
photographs explain relevant mechanisms; installation claims require an actual installation
photograph. Technical views explain structure. Downloads and contact close
the specification or sourcing task. No single photograph is asked to do all five jobs.

## Layout

Products begins with an asymmetric introduction and a contained 18:13 real-photo atlas,
capped at 64vh. Its caption and catalogue count remain HTML. The nine-family directory
has one column below 820px, two from 820px and three from 1376px. The engineering series
uses two columns below 1032px and four above, with contained 3:2 photographs. Application
and technical chapters stack on small screens and alternate image/text from 1376px.
Downloads and contact end the editorial sequence; comparisons and the full index remain.

The independently scrolling menu is calc(100% - 1.2rem) wide, 90vw from 744px and 82vw
from 1376px. RFQ routes sit beside supporting navigation from 1032px. Below 1376px,
a native disclosure exposes the complete product families and nested category controls.

## Components

### Products overview

Use secondary ink for readable photograph captions. Family alternatives have no decorative
sequence numbers; the range/application/technical photo chapters retain meaningful order.
Photographs preserve complete objects through contained framing; application imagery uses
the actual source-pack push/pull mechanism, without an invented installation claim.

### Site menu

MENU_VARIANT selects rfq-concierge (D): Product Finder, Configurator and Contact first,
then Explore/Evidence, export email, buying and social links. specify-source-company (A)
is a compiled alternative; its two photographic cards appear only from 1376px. Never
render both variants and hide one with CSS. Focus starts on Close; Tab stays in the dialog;
Escape, backdrop and Close dismiss it and restore the actual opener. Preserve the ink
edge and unblurred offset plane. Access must not depend on animation.
