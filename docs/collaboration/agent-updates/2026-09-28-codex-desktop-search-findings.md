# Codex — desktop and search findings, 2026-09-28

Source baseline: `211a69bcd44` in `C:/hyde-photo-work`. Scope extends the client's existing Goal through `tasks/2026-09-27-codex-desktop-search-goal.md`; current Guides hero images are preserved.

## Owned corrections

- Remove the additional desktop `lg:mt-192` on the EN/ES/PT homepage, Product Finder and Contact. At 1440×900 the previous home hero began at y=339 and its caption at y=903. Its 48px base entrance margin is sufficient; interior module rhythm is unchanged.
- Suppress the five generated diagrams for glass pulls 100/102/104/106/107 in `ProductDrawing.tsx`. Published source drawings contradict the generated vertical spacing. Real-photo galleries remain. Source evidence: `../2026-09-27-glass-pull-handle-dimension-evidence.md`.
- New `scripts/audit-hyde-photo-consistency.mjs` produces review candidates, not automatic crop decisions: current catalogue has 2,432 image references, 1,645 measurable white/transparent backgrounds, 787 manual-review references and 444 layout candidates. Slender real handles legitimately have low occupancy; never reshape them to satisfy the metric.
- Configure a project Codex Stop hook scoped to this conversation and its actionable checklist. Synthetic tests do not prove runtime activation; Codex requires hook review/trust. Other sessions and recursive Stop continuations fail open.

## Exact assist for Claude's claimed files

1. **Header at 1376–1599px:** `HeaderNavigation.module.css` switches to compact navigation and gives `.controls` `grid-column:1/-1`, producing a 147px, two-row header at 1440px. A browser-only experiment showed a 96px single row fits with wide navigation and `.controls` restored to `span 12 / span 12`; nav ends at x≈650, logo x≈728, no horizontal overflow. Please reproduce before adopting. No header or motion source edited by Codex.
2. **Other page entrances:** 55 `lg:mt-192` occurrences across 51 routes; nine scoped visual fixes above are delivered. Assess the remaining page templates rather than globally replacing them. At 1440px, Finder H1 previously y≈395 and Contact H1 y≈339.
3. **Product titles:** `build-product-titles.mjs` `condense()` loses range endpoints. 028 is 35–55mm but title says 55mm. DV05 is 35–55mm **or** 60–100mm but title says 55–100mm. Correct the generator before regenerating titles; do not bridge distinct fit ranges.
4. **Sitemap audit:** `audit-seo-geo.mjs` reads only the root English sitemap and falsely reports 5,448 missing pages. Root 881 URLs + nine declared language maps ×681 = 7,010, matching current indexable output. Read every sitemap declared in robots or the sitemap index.
5. **Locale interface:** German and Japanese audits detect visible English on 748/748 pages, concentrated in shared navigation/footer and some specifications. Translated Guide bodies already exist. Reproduce with `node scripts/audit-locale-pages.mjs --locale de` / `ja`; coordinate with the seven-language owner.
6. **Pull-handle source data:** correct mislabeled total width / connector diameter / connector pitch and drawing source indexes, following the evidence document. 104/106 pitch remains ambiguous in the published diagram; do not infer 340/300mm. The UI suppression does not remove the downloadable old SVGs or repair the JSON specifications.

## Remaining UX work

The 360px bottom-right Talk to us prompt can cover the home hero CTA after the entrance spacing is corrected. Preserve the approved delay/cooldown policy; repair the visual collision without changing its timing. Contact success must be checked with a local mocked success response, never by sending a fake production inquiry.

No reason to duplicate the completed SEO foundation: semantic audit has zero errors, existing Guides have anchors, horizontally scrollable sortable tables and FAQ accordions. Search work prioritizes factual titles, clear language, extractable tables, internal links and buyer conversion. Google's AI Search guidance requires no special AI schema or speculative files: https://developers.google.com/search/docs/appearance/ai-features.

Validation: `npm run check` passed twice, the second with the existing publication environment copied to this isolated checkout. Browser audit passed all 15 Home/Finder/Guides/Studies/Contact scenarios at 390, 1440 and 1920px, with no overflow, uncaught exception or critical same-origin loading error. The 1440px home entrance is y=195 instead of y=339; Finder H1 y=245, Contact H1 y=195; mobile coordinates are unchanged. Diagram checks cover all 15 affected EN/ES/PT pages; the 001 trim's verified diagram remains visible. Hook tests: 3/3. Impeccable detector: no findings. Photo report `--check`: current.

The delayed browser run confirmed a follow-up defect: the 360×199 promo covers the corrected home CTA at 1440px (CTA y=753.5; promo y=677–876). The next owned visual correction is a collapsed native-details contact rail; approved delay/cooldown/content remain. Keep this in the next source stage before the HYDE export release.

New remote work arrived during validation (`b8e204dd9fa`): shared components include translated patterns and promo presence/discover behavior. Integrate those commits before the next check; do not overwrite their source. The seven-language and header findings above describe the measured baseline, not a claim that those later commits are still defective. RAYEN sources/output, Claude article copy, claimed shared motion files, and production form submissions are untouched.
