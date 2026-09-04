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
  directional light, restrained contact shadows, complete silhouettes, and real-world
  scale tiers. Long pull handles anchor; lever handles establish rhythm; small parts act
  as punctuation. Objects do not overlap.
- Exhibition-wall images use plausible modular display panels filled with varied hardware
  families. Handles face the viewer; mechanisms are installable; hinges vary by size and
  construction; panic devices and closers remain in believable scale.
- Exact product pages use first-party photography. Generated images are labeled and
  described as representative editorial compositions.

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

Range overview answers what HYDE makes. Family views explain form and scope. Installed
views explain application. Technical views explain structure. Downloads and contact close
the specification or sourcing task. No single photograph is asked to do all five jobs.
