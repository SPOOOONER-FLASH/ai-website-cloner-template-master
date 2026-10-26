# 2026-10-26 · Claude · Master-key terminology: fr, ar, ru, es, pt — one term per level

Follows the list in `2026-10-25-claude-data-driven-week2.md` (terminology conflicts). The rule in every language: the news articles' terms win, because they carry most occurrences and the most traffic.

| Language | GGMK / GMK / MK / SMK / change key | What changed |
|---|---|---|
| fr | grand passe général / passe général / passe partiel / sous-passe / clé individuelle | <ul><li>« Passe grand général » → « grand passe général »: guide table, 2 ui values, figure.</li><li>Keying schedule: « tableau d'organigramme » (15×, schedule article, title and seoTitle included) → « plan de combinaison » (trade usage, already 11×). « plan de combinaisons » → singular.</li><li>Key control: « contrôle des clés » (bitting article, 3×) → « maîtrise des clés » (21×), with « de la » / « sur la » agreement.</li></ul> |
| ar | المفتاح الرئيسي الأعلى / العام / المفتاح الرئيسي / الرئيسي الفرعي / المفتاح الفردي | <ul><li>Levels article: GMK was الأعلى and GGMK الأعلى الأكبر; its summary called the cleaners' sub-master الفرعي.</li><li>Schedule and bitting articles: the change key was الفرعي, which reads as SMK. Now الفردي.</li><li>The one true sub-master (مفتاحًا رئيسيًا فرعيًا) is kept.</li><li>30 replacements.</li></ul> |
| ru | главный гранд-мастер-ключ / гранд-мастер(-ключ) / мастер-ключ / субмастер / индивидуальный ключ | <ul><li>ui.json had its own set (генеральный мастер-ключ, главный генеральный, гранд-гранд, сменный ключ); aligned to the articles and figure.</li><li>Levels summary: «от генерального мастер-ключа» → «от главного гранд-мастер-ключа».</li><li>11 replacements.</li></ul> |
| es | gran maestra general / gran maestra / maestra / submaestra / llave individual | <ul><li>Hierarchy guide: «gran gran maestra» → «gran maestra general»; «llave diferente» for the change key → «llave individual».</li><li>Figure labels follow.</li></ul> |
| pt (BR) | grande mestra geral / grande mestra / mestra / submestra / chave individual | <ul><li>Hierarchy guide: «grande grande mestra» → «grande mestra geral»; «chave diferente» for the change key → «chave individual».</li><li>Campus article: «grã-mestra» → «grande mestra».</li><li>Levels article: «chave de serviço» → «chave individual».</li><li>«serralheiro» → «chaveiro» in 5 articles (in Brazil a serralheiro works metal).</li><li>Figure follows.</li></ul> |

## Kept on purpose

- PT «chave diferente (KD)» is *keyed different*, a different concept.
- «Grã-Bretanha» is the country.

## Not done here

The hierarchy guide's PT body is still European Portuguese in its syntax: pisos, porta-chaves, num, importa-lhe. That is a rewrite of the article, not a term fix; it belongs to the next ES/PT rewrite batch.

## Tests

- i18n-lint, titles:check, stamp --check (7 ES/PT articles stamped 2026-10-26) and heading markers: clean.
- fix-pt-latch-terms --check: clean.
- us-spelling, portuguese-brazilian and regional-terms tests: pass.
- Client UI subset rebuilt.

## Release

From today this session also releases (AGENTS.md, client 「你直接接管发布」). See NOW.md.
