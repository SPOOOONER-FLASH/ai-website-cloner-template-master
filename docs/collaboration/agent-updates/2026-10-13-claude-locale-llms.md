# 2026-10-13 Claude — ten-language AI-citation audit, /<locale>/llms.txt

Goal row #180 (client: 「让 AI 引用十个语种都还好检查下」).

Audit of build 36b7fb6142b5 (`out/`), per locale en/es/pt/fr/de/ja/ko/tr/ru/ar:

| Check | Result |
|---|---|
| sitemap URLs | 716–724 each |
| guides with own-language title | 46/46 each |
| `<html lang>` / JSON-LD `inLanguage` | correct on all guides |
| hreflang | 10 locales + x-default on every guide |
| feed.xml | all ten |
| robots | GPTBot, OAI-SearchBot, ChatGPT-User etc. allowed |
| llms.txt URLs | en full, es 47 (since #179), **the other eight: home page only** |

Fix: `src/lib/locale-llms.ts` + `/<code>/llms.txt` for the nine non-English locales (es/pt hand-written,
seven via `scaffold-locale-routes.mjs`): own-language titles, summaries and URLs of guides (where the
locale has a page) and news. robots allows `/*/llms.txt` past the `/*.txt$` disallow; the root llms.txt
"Other languages" lines link each file. Test: `src/data/locale-llms.test.ts`.

Tests: npm test 486/0, eslint, scaffold --check. Readout: Clarity 10-20 (AI citations by locale).
