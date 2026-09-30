# Claude — homepage Lighthouse (client's 09-29 PageSpeed: desktop 69, mobile 75)

Branch `claude/lighthouse-performance-jji382`, draft PR. Source only; no release run.

## What the two reports were actually measuring

| PSI finding | Cause | Done here |
|---|---|---|
| Desktop TBT 1,340 ms, 18 long tasks, JS execution 2.3 s | Third parties. The same homepage without GTM / GA4 / Clarity blocks for **0–10 ms** in a local Lighthouse desktop run (three runs, both before and after). The site's own JS is not the desktop problem | Clarity `afterInteractive` → `lazyOnload` (Analytics.tsx). GTM stays verbatim in `<head>` (client 09-25), GA4 was already `lazyOnload`. Nothing removed |
| "Reduce unused JavaScript" 316–428 KiB | Two first-party parts: (1) `src/lib/i18n-core.ts` + `localise-values.ts` imported the Spanish and Portuguese glossaries, and every "use client" component imports `i18n-client.ts`, so **117 KB (33 KB gz) of es/pt spec tables shipped in the shared chunk of every page in every language**; (2) the rest is GTM/gtag/Clarity | Glossaries out of the client core. `i18n-client-values.ts` + `data/i18n-client-values-{es,pt}.tsx` register the three value tables per locale exactly like the overlay bundles (both in the layout and in the client module — same lesson as de/layout.tsx 09-27). English homepage no longer contains a single Spanish string; /es/ gets its own 115 KB chunk |
| "Network dependency tree", LCP render delay | `<Link>` viewport prefetch: five header routes (home, products, product-finder 43 KB payload, guides, contact) plus their chunks, ~70 KB, fetched right after hydration on a phone still loading the hero | `prefetch={false}` on HeaderLink (HeaderIslands), the logo/finder/studio/shelf Links in SiteHeader, footer and footer language links |
| "Use efficient cache lifetimes" 130–171 KiB | Server, not code: nginx sends no `Cache-Control`; Cloudflare fills in 4 h. Could not verify live from the cloud (proxy refuses cantonlock.com) | `deploy/nginx/static-cache.conf` (1 year immutable for `/_next/static/`, 30 d images/fonts/pdf) + CLIENT-RUNBOOK first screen: curl to check, one command to install, purge after |
| Render-blocking CSS 380 ms | Three stylesheets, 19 KB compressed | Tried `experimental.inlineCss`: FCP −0.3 s on slow 4G, but Next also copies the 124 KB stylesheet into every page's RSC payload → out/index.html 282 → 534 KB, **+2 GB across 8,135 HTML files** committed per release. Reverted; reasoning kept in next.config.ts |
| Legacy JS 26 KiB, forced reflow, non-composited animation | Legacy JS and reflow are empty in the local run → third-party. The animation is `.hero-caption-slide` transitioning `visibility` (globals.css); lane belongs to the 视觉/动效 session, left alone | — |
| Image delivery 138–149 KiB | Below-fold lazy cards (hyde-real-* 800w for a 279 px slot at DPR 1.75; a 600w candidate would fix it); does not touch LCP | not done |

## Measured (local static export, Lighthouse 13, `/opt/pw-browsers/chromium`, 3 runs each, third parties blocked by the sandbox)

| | before (HEAD out/) | after |
|---|---|---|
| mobile score | 84–87 | 86–88 |
| mobile FCP / LCP | 1.5 s / 2.4–2.9 s | 1.2–1.5 s / 2.1–2.6 s |
| desktop score / TBT | 100 / 0 ms | 100 / 0 ms |
| homepage module JS | 670 KB (199 KB gz) | 555 KB (167 KB gz) |
| /es/ homepage | glossary in shared chunk | glossary in its own chunk, es pages only |

Caveat that matters: the local numbers cannot reproduce PSI's 69/75 because the three tags
cannot load here and the container has no Cloudflare latency. The desktop 1,340 ms is
third-party by elimination, not by trace. **Re-run PSI after the next release and attach it
here**; if desktop TBT is still >500 ms, the next step is loading GTM after `load` too, which
the client explicitly declined on 09-25 — his call.

`npm run check`: green (exit 0). Measurement trap found on the way: an uncached brotli response from the test server added
~250 ms "server latency" that Lantern multiplied into a 74–80 mobile score. Compare only
against a server that precompresses (tmp/lh/serve.mjs caches).

## Clarity (client question 09-30: a Toronto buyer in GA4, not in Clarity)

Checked: Clarity is on all 8,044 real pages of the committed export (404/admin/print sheet excepted),
and it loaded *earlier* than GA4 on the live site, so neither coverage nor timing explains it.
Told the client the likely causes (corporate gateway / Brave / Firefox strict blocking clarity.ms;
Clarity geolocating a VPN egress elsewhere; Clarity bot filter). Code added:
- `EngagementTracker` tags every session `ga_client_id` (from `_ga`, `gaClientId()` in
  src/lib/engagement.ts, tested) — GA4 User explorer Client ID → Clarity custom-tag filter.
- `tagClarity` installs Clarity's own queue stub when the tag is not loaded yet. Without it the
  `lazyOnload` move would have silently dropped `page_type` and `first_touch`.
- Decision card posted: keep Clarity `lazyOnload` (recommended, working on it) or restore
  `afterInteractive`. If the client picks restore, it is the one word in Analytics.tsx.

`src/lib/card-figure.ts` now carries its own 12 es/pt figure captions (`FIGURE_LABELS_LOCALISED`,
test asserts equality with the glossaries): the Product Finder builds es/pt figures outside the
es/pt layout, where the client registry is empty. /es/ and /pt/ lock-case pages: 54 "Entrada" /
45 "Distância ao eixo (broca)" before and after.

## Files

`src/lib/{i18n-core,i18n,i18n-client,i18n-client-values,localise-values,spanish-product}.ts`,
`src/data/{i18n-client-values-es,i18n-client-values-pt}.tsx`, `src/data/i18n-record-locale-tables.ts`,
`src/app/{es,pt}/layout.tsx`, `src/components/site/{ProductCard,HeaderIslands,SiteHeader,SiteFooter,FooterPathAware,Analytics,EngagementTracker}.tsx`,
`src/lib/{card-figure,engagement}.ts` + tests,
`next.config.ts` (comment only), `deploy/nginx/static-cache.conf`, `docs/collaboration/CLIENT-RUNBOOK.md`.

Not touched: `src/data/generated/products-zh.json`, `public/images/door-prep/*.svg`,
`docs/collaboration/LOCALE-MIRROR-STATUS.md` — dirty from the build, not mine.

## For the johns session

- Runbook changed → `npm run runbook:docx` on release.
- Release when the client asks; then the runbook step (nginx cache header) needs the server.
- Behaviour change worth a glance on /es/ and /pt/: product-card materials/finishes now come
  from the registered tables; a card showing an English material there means the layout's
  `registerRecordLocaleTables` call was lost.
