# HYDE navigation discoverability options — 2026-10-03

Agent: Codex. Client request: after publishing the contact/catalog changes, research several navigation improvements because important pages feel invisible and unclicked. This is a proposal, not authorization to replace the production navigation. No navigation source or out files changed for this study.

The design goal is to help an export buyer find products, download the catalog, check technical evidence, understand the factory and request a quote. Retain HYDE's restrained visual system. The user's observation is not a measured click-through rate: this study did not access GA4 or Clarity reports.

## Current evidence

- `content/navigation.json` includes Downloads, but `SiteHeader.tsx` presents its top-level area as Buy it now. Contact, FAQ, Downloads and Alibaba are inside that buying menu. A catalog researcher must infer this category first.
- Resources exposes Applications, Guides and News; technical documents, certificates, finish codes and the cylinder calculator are distributed elsewhere. Important pages exist in the hamburger, but its existence does not ensure first-time discovery.
- Desktop displays ten language codes. Mobile already uses a current-locale control. The header has insufficient visible submenu cues and inconsistent first-click behavior; immediate close on pointer exit makes submenu targeting fragile.
- Search starts with product categories and popular models. It does not immediately expose catalog/documents/FAQ; several support pages are absent from its static page-index list.

## Options

**Procurement-task navigation — recommended.** Products, Product Finder, Downloads, Guides & Support, About HYDE. Independent Request a quote action; current language dropdown and Search. Put Configurator/Studio prominently in Products. Group support by Dimensions & fit, Standards & testing, Finishes & ordering. Keep Alibaba as an explicitly external secondary action. Test actual widths in all ten languages before implementation.

**Light entry improvements.** Preserve Resources and Company, add visible dropdown arrows, rename Buy it now to Request a quote, expose Catalog PDF directly, compress languages into EN plus a dropdown. Lowest change cost, but important technical tools remain scattered.

**Two-tier document navigation.** Main row contains Products, Finder, About HYDE, quote and utilities. Persistent second row exposes Catalog PDF, Technical documents, Guides & Standards, OEM services and FAQ. Highest visibility, with a taller, denser header.

All options should keep Products / Downloads / Quote visible on phones, with a clearly labeled Menu for the rest. Remove horizontal scrolling as the only way to reveal later primary items. Keep menu click, keyboard and touch behavior consistent; show expanded state, support Escape/outside click, and use a brief pointer-exit grace period. Avoid animations that move page content. Repeat important support links on their landing page and in relevant product pages; header discovery is only one entrance.

## Measurement and implementation boundary

Add nav_open/nav_click with destination, location, locale, device and input method. Review catalog downloads, support-page arrivals and successful inquiries; more menu clicks alone is not success. Check enhanced-measurement file_download before adding a duplicate event. Existing select_item/contact_click/configurator_open/generate_lead do not provide complete navigation attribution. Page-type locale stripping currently recognizes only es/pt and needs verification before interpreting seven newer locales.

The interactive source is `docs/design-references/2026-10-03-navigation-options.html`, a hand-authored, retained proposal source. Its links only demonstrate local selection and never navigate, download, submit an inquiry or change production. It is not a generated website export. The recommended layout is shown first, with named alternatives; mobile uses the same task priorities.

Primary references verified on 2026-10-03:

- https://www.fsb.de/en/service-information — explicit Downloads, Price List, Contact and FAQ links plus a direct product-overview download and engineering support.
- https://www.nngroup.com/articles/menu-design/ — visible desktop navigation, familiar labels, submenu indicators and clear interaction targets.
- https://www.w3.org/WAI/tutorials/menus/flyout/ — visible submenu states, keyboard activation and delayed close on pointer exit.

Next useful review: choose a navigation direction, then test desktop/mobile layouts with actual localized labels and use recorded event data to validate which support destinations need the strongest exposure.
