# Codex — SEO correctness, semantic audit, and tooling

- **Agent:** Codex
- **Base inspected:** `72027d5d` (`弹窗：取消冷却、加入选型器页面`)
- **Scope:** domain-independent SEO correctness, generated-output audit, and narrow tooling integration.
- **Release-build baton:** Codex rebuilt the complete `out/` only after Claude's promo files were committed and the unrelated working tree was clean.

## Client decisions preserved

- The site remains a fully static brand/catalogue front door. Enquiries and purchases continue through email and Alibaba; no database, customer login, cart, or SSR migration is planned.
- The final production domain is not chosen. `siteUrl` remains the temporary Stahlock host and `indexable` remains `false`.
- Do **not** remove staging `noindex`, enable the sitemap, or expose the temporary host to indexing. The exact launch gate is recorded below.
- Claude and Codex continue with small independent commits, explicit-path staging, and this update folder instead of a global lock.

## Implemented

- English and Spanish now use separate documented Next.js root layouts. Public URLs did not change; exported English documents use `lang="en"` and `/es/**` documents use `lang="es"`.
- The multiple-root topology uses Next 16.3's global 404 convention. Both exported 404 shells are English and `noindex`.
- Spanish project detail pages now own their canonical URL, reciprocal `en`/`es`/`x-default` alternates, Spanish Open Graph metadata, and Spanish Twitter metadata.
- JSON-LD serialization escapes `<` as `\\u003c`; a regression test covers `</script>` injection text.
- `schema-dts@2.0.0` is installed as a dev dependency and all schema builders have concrete Schema.org return types.
- Sitemap entries no longer claim every build happened “now.” Only content with a real tracked date (currently news publication records) receives `lastModified`.
- The future indexable robots policy no longer blocks `/_next/` CSS/JavaScript. Current staging still returns the deliberate global `Disallow: /`.
- `scripts/audit-seo.mjs` is now a semantic export audit. It validates route/canonical/OG/Twitter alignment, document language, actual `<link rel="alternate">` relationships (including an explicit counterpart, not merely a self-link) and reciprocity, JSON-LD parsing/fields/internal URLs, Product/News/FAQ structured data against visible `<main>` copy, and robots/sitemap/indexability agreement. Editorial length guidance is report-only; semantic errors fail `--check` and CI/export verification.
- Machine-readable audit output omits local filesystem paths, raw HTML, extracted page text, and raw JSON-LD payloads; it retains only the schema type summary needed for diagnosis.
- Independent review hardening now validates nested FAQ `Question`/`Answer` types and required text, BreadcrumbList/ItemList `ListItem` types, sequential positions and required URLs/names, inherited `@graph` contexts, and sitemap `<lastmod>` values against a real `NewsArticle.datePublished`. Malformed, untracked, and mismatched freshness values fail CI.
- The Spanish home page uses an explicit branded absolute title because Next does not apply a layout title template to metadata declared in the same `/es` segment.
- Future news detail pages now render the same summary used by `NewsArticle.description`, preserving a visible-content basis for structured data.

## Fresh-export evidence

- 472 HTML documents; 467 public content pages.
- 467/467 public pages contain JSON-LD accepted by the audit.
- 14 pages contain actual alternate-link metadata. Ordinary header language anchors are no longer counted as SEO alternates.
- 0 semantic issues and 0 title/description/H1 quality warnings.
- Title length: min 33, median 51, p90 59, max 63.
- Description length: min 74, median 148, p90 163, max 165.
- Browser verification on the Spanish commercial project showed `lang=es`, the Spanish self-canonical, matching `og:url`, three correct alternate URLs, then `lang=en` after clicking the language switch. Browser console: 0 errors and 0 warnings.

## Commands run

```text
npm test                         # 39 passed
npm run lint                     # clean
npm run typecheck                # clean
npm run build                    # 474 static routes generated; 469 segment payloads normalized
npm run test:export              # 23 passed; semantic audit clean; segment layout portable
node scripts/audit-seo.mjs --check
```

Run `npm run seo:audit` for the full human-readable report. `npm run test:export` now enforces the semantic contract on every fresh build.

## Independent review follow-up

- A read-only reviewer found no Critical release issue and confirmed the source/export commit boundary, bilingual metadata, hard staging block, JSON-LD serialization, and future robots policy.
- The reviewer did find that the first audit revision treated nested FAQ and ListItem structures too shallowly, treated inherited graph context as missing, and parsed sitemap URLs without auditing freshness.
- Six focused fixture tests reproduced those gaps before implementation; all six failed for the intended missing issue codes or graph-context false positive. A second focused fixture proved a `null` FAQ entry previously crashed the new validator before the guarded read was added.
- After the minimal fixes, the focused audit suite and the complete `npm run test:export` gate pass. The temporary host remains `noindex`; none of this follow-up changes page content, the final-domain gate, or the site's static architecture.

## Tooling available to Claude and Codex

- Chrome DevTools MCP is user-level, not a project dependency. `claude mcp list` was verified as `chrome-devtools ... Connected`. Codex has the same `chrome-devtools-mcp@latest --no-usage-statistics` configuration; a task opened before configuration may need a new task/app restart to expose it.
- `schema-dts` is the only downloaded-tool idea added to this project because it directly strengthens current JSON-LD work.
- `playwright-main`, `lighthouse-ci-main`, `lychee-master`, `siteone-crawler-main`, `unlighthouse-main`, and `axe-core-develop` are standalone/CI candidates, not plugins to copy into the repository. Add one only with a scoped test or CI gate.
- `motion-main`, `GSAP-master`, and `storybook-next` remain deferred. Choose Motion **or** GSAP only after an interaction specification exists; do not load both by default. Storybook is useful only if component isolation becomes a sustained workflow.

## Deferred final-domain/indexing launch gate

1. Client confirms the exact final production origin and redirect policy.
2. Change `siteUrl` in `src/data/site.ts` to that origin.
3. Confirm public claims/certification and privacy launch gates.
4. Flip `indexable` to `true`.
5. Rebuild and run `npm run test:export` plus `npm run seo:audit`; the audit will then require every public canonical exactly once in the sitemap, every public page indexable, `/admin/` private, and a sitemap directive in robots.
6. Deploy, verify redirects/canonical/robots/sitemap on the live origin, then submit to Google Search Console and Bing Webmaster Tools.

## Useful next review

- Review the SEO/audit commit read-only for false-positive or missing semantic cases.
- Do not change the final domain or `indexable` flag until the client supplies the domain.
- The next independent tracks can be animation-system design, link/accessibility CI, and keyword/content-cluster research; keep them separate from this correctness commit.
- Known nonblocking edge: the static global 404 shell is English. A request for an unknown `/es/**` URL therefore receives an English `noindex` 404 unless the final hosting layer adds locale-aware error routing.
