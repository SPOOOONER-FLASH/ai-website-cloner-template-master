# 2026-10-13 Claude: new guide, importing door hardware from China into Mexico (Spanish-first, ten languages) + why /es/ is not cited

- **Why:** third AI-citation gap article; the client wants a Spanish page AI assistants can cite.
- **What:** `content/guides/importing-door-hardware-china-mexico-2026.json`, written Spanish-first (neutral LatAm trade Spanish with Mexico's own legal terms; regional-terms check 0 changes), plus en/pt and fr/de/ja/ko/tr/ru/ar overlays via `i18n-merge.mjs`. 30 blocks, 6 FAQ, no relatedModels (route `price-list` + `noProducts`), topic `buying`.
- **Steps covered (public procedure only):** RFC + SAT Padrón de Importadores (requirements as published by the SAT: active RFC, e.firma, positive 32-D opinion, located tax address, validated buzón tributario, designated broker/representative) and the sectoral padrón; agente aduanal + encargo conferido; pedimento; fracción (8301 / 8302 six digits, Mexican eight-digit fracción + two-digit NICO since 2020; classification is the importer's responsibility; consultation possible); 2026 tariff; DTA / IVA / cuota compensatoria named without amounts; NOM-050-SCFI-2004 label content, exclusions and annex 2.4.1 of the SE foreign-trade rules; no FTA Mexico–China so no preferential origin; Incoterms 2020 (FCA vs FOB for containers, DDP needs a Mexican importer of record); COVE via VUCEM.
- **No rates published.** Only dated fact: LIGIE amendment decree published in the DOF on 29 Dec 2025, in force 1 Jan 2026, raising rates on many fracciones for non-agreement countries incl. China, rates differ by fracción, amended again in 2026 (lexlatin, taxtodaymexico, idconline 2026-04-24). The 1,463-line count and 5–50% range seen in press were deliberately left out.
- **Sources:** SAT Padrón de Importadores minisite and requirement summaries (thelogisticsworld, contadormx); normasoficiales.mx NOM-050 summary; Secretaría de Economía PLATIICA page on the NOM annex 2.4.1; idconline on annex reforms. Not verified and therefore not written: article number of the Ley Aduanera classification consultation, whether 8301/8302 fracciones are in annex 2.4.1, whether an RFC must appear on the NOM-050 label, any cuota compensatoria on Chinese locks.
- **Hero:** `/images/products/308-d-d-panic-exit-device-4.webp` (real box-contents photo from the 308-D gallery, used by no article); share image 1200×675, 24 KB.
- **Translations:** written in-session (sub-agents had hit the rate limit); all seven passed the merge validator first time except de (heading identical to English) and ja (7-kanji run), both fixed.
- **Checks:** content, i18n-lint, titles:check, regional terms, article/guide/news/image/faq/regional/portuguese/us-spelling tests 81/81, translated-body / locale-route-parity / i18n / seo-policy / json-ld pass.

## Why no /es/ page is cited by AI — findings (read-only, nothing changed)

| Signal | Status | Evidence |
|---|---|---|
| hreflang | ok | EN and ES guide pages emit the same 10 alternates + x-default, absolute, trailing slash; Spanish code is plain `es` |
| canonical | ok | `/es/guides/<slug>/` canonicalises to itself |
| robots / sitemap | ok | `/es/sitemap.xml` listed in robots.txt and sitemap-index; 718 locs incl. all ES guides; meta robots `index, follow`; AI crawlers allowed |
| `<html lang>` / body / JSON-LD | ok | `lang="es"`, Spanish body, `inLanguage: "es"`, ES `@id`s |
| seoTitleEs / seoDescriptionEs | ok, minor | all present and natural; some descriptions over 155 chars (E1 experiment pages excepted); `| Canton Hyland` suffix inconsistent on a few |
| **llms.txt** | **gap** | `src/app/llms.txt/route.ts:208` emits one Spanish URL (`/es/`); every guide/model line is English. No Spanish section, no `/es/llms.txt`. An assistant that reads llms.txt never sees a Spanish guide URL |
| **internal links into /es/** | **gap** | English pages link to `/es/` only via the language switcher; no contextual EN→ES links; article bodies have no link syntax at all |
| measurement | caveat | Clarity loads `lazyOnload` (`src/components/site/Analytics.tsx`), so short AI-referral visits may go unrecorded on every locale |

Conclusion: nothing blocks indexing; the Spanish pages are discoverable only through sitemaps and the switcher. Suggested next steps (not in this commit, `src/app/llms.txt` is a shared route): add a "Guías en español" block listing `/es/guides/*` to llms.txt (or an `/es/llms.txt`), and give each English guide a visible "Leer en español" link to its twin.

- **Untouched:** `out/`, RAYEN lane; release belongs to the johns-machine engineering session.
