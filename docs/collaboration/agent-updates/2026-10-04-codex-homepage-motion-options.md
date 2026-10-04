# Codex: three full-homepage motion proposals

Date: 2026-10-04. Branch: `codex/contact-catalogue`. Agent: Codex.

## Scope and result

The client requested three substantially more dynamic, gradient-rich, premium homepage concepts after rejecting the navigation proposals. Created 金属光场, 建筑杂志 and 色彩实验室 as three complete, interactive designs in the conversation carousel. Each includes hero, products, factory, resources and contact/footer composition; this is a proposal stage, not a production release.

The editable template, embedded-image generated fragment and `scripts/build-homepage-motion-proposals.mjs` are retained. Asset provenance, design decisions and the exact regeneration command are in `tasks/2026-10-04-homepage-motion-options.md`. Read-only teammates researched the directions, audited real assets and reviewed the runtime. No teammate wrote the shared checkout.

## Verification

- Generator completed: three variants, 783,466 bytes, matching canonical and display copies. Generator syntax and the fragment's single script compile successfully. `git diff --check` passed.
- In-app browser tested at 1024, 736 and 320 px outer viewport widths (actual fragment widths 977, 689 and 273 px). All three layouts switch correctly. Shared stage heights measured 3,042 px desktop, 2,929 px intermediate and 3,861 px narrow, with no truncation. Narrow headings fit their content widths. The translated italic title's actual text bounds also fit the hero at desktop/intermediate widths.
- All embedded product/factory images loaded with nonzero natural widths. Screenshot inspection covered all three desktop and narrow heroes, plus the intermediate color concept and its product/factory content. The final desktop root's `scrollWidth` equals `clientWidth` (977 px).
- Downloads opens the catalog menu; nested catalog navigation works. Escape restores the original stable header trigger. After a closed menu, Escape on the hero CTA leaves focus on the hero CTA, fixing the review finding.
- Featured-product selection updates the image, title, description, product action and accessible name together. The black product opens the black-set detail panel.
- Pause changes the ambient animation name to `none`; resume restores `hp-light`. Top/footer labels update across the three designs. Reduced-motion CSS and its disabled-resume branch were reviewed statically; the browser's operating-system preference was not changed.
- Language menu identifies an English design preview and disables other locales. Console error/warning log was empty in the finishing browser check. Viewport override reset; temporary QA tab closed and preview server stopped.

Impeccable is not installed on this host, so its executable detector could not run. No new dependency was installed. Verification used manual visual review, deterministic DOM bounds checks, script syntax and the existing renderer instead.

## Untouched work and limits

No production source, `out/`, other agent work, migration junction or Cloudflare operation was changed. No Next.js build was needed for this static proposal artifact. Real photographs are moved/scaled as complete images; no invented metal geometry, model number, dimension or certification was added. Product details and the catalog are local design previews; they do not submit inquiries or download a PDF. Google Fonts require the allowed font CDN; local font fallbacks remain.

Next useful step: the client chooses a direction or a combination of sections before production implementation and release verification. This stage's push result is reported separately in the conversation; it is not a claim of homepage deployment.
