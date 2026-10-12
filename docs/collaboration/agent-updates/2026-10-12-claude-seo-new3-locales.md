# 2026-10-12 Claude — full SEO/GEO re-audit, 3 new products in 7 locales

- Audits run on the live build (`tmp/claude-release/release-hyde`, release f752570): audit-seo --all (0 semantic issues), audit-seo-geo (0 errors), audit-dead-links (0), audit-anchor-text (0 empty), audit-link-placement (all sections linked), audit-geo-citability (overall 75→76 after fix below).
- Found: 8829 BL, D104 SS, SH02 (added 10-11, #157) had no overlay entries, so fr/de/ja/ko/tr/ru/ar showed the English title and description → 3 duplicate titles × 7. Added name/summary/spec values via `i18n-batch --slugs` + `i18n-merge` (all 21 accepted; ja needed one 7-kanji run split), then `build-product-titles.mjs --write` added the localized seoTitle/seoDescription (only these 3 keys changed per locale). `i18n-lint` clean, `titles:check` clean.
- `audit-geo-citability.mjs`: sentence split now also ends on 。！？ — /ja scored 58 only because a Japanese page counted as one sentence; with the fix it reads 75 like the other locales. Measurement fix, no page change.
- GSC "重复网页，Google 选择的规范网页与用户指定的不同" (3 ES URLs, crawled 08-30 to 09-22): all three are pre-rename URLs that now 301 to bh42-robe-hook / ds011-door-stopper / panic-exit-devices/315-pry-latch, which return 200 with self canonicals and are in the sitemap. Nothing to fix; validation will move them to "page with redirect".
- Lab check: /products/ desktop LCP 394 ms, CLS 0 (unthrottled). Lighthouse mobile on 8829 BL: SEO 100, a11y 100; best-practices 58 only from Cloudflare challenge script deprecations and Clarity third-party cookies.
- Needs a HYDE release (engineering session) + `node scripts/mirror-to-gitlab.mjs` before the 21 pages change live.

## Runbook and Desktop clean-up (same day)

- Client: 「文件太多了 很多东西我看了修了 但是还在里头 … 自己删除已经完成的文档」. Runbook 376 → 128 lines: every 10-09-and-older section folded into one 9-row table (#1 brain access … #9 AI baseline) with "reply with the numbers that are done"; verified-done items (10-08 GSC exports, Bing High, RSS, LinkedIn page, GA4 first_touch, Cloudflare AI-crawler check) moved to `archive/2026-10-12-runbook-cleanup.md`. Weekly inquiry log moved to 常规动作; BAU open items to 还欠我. Measured section refreshed with today's checks.
- `organize-desktop-hyde.mjs` only looked at loose files in Desktop\hyde, never inside 00-先看这里-人工待办, so finished hand-offs stayed there forever. Added step 1b: a 手动操作/同事操作 docx in 00 that the runbook no longer names moves to 09-旧资料归档\已完成的人工操作 (logged in 移动记录.md, nothing deleted). Ran it: 5 server/GitHub hand-offs from 10-10 to 10-12 archived.

## Client reply, same day

- Client: items 1, 5, 7 done/dropped; brain stays local (no colleague access); sent GA4, Cloudflare, Ahrefs and Semrush screenshots. Runbook table rebuilt to 5 rows. `mail.cantonlock.com` CNAME → mailhz.qiye.163.com is NetEase enterprise mail and must stay DNS only, so the Cloudflare "Unproxied CNAME" insight is dismissed, not acted on.
- Ahrefs: ~1,000 referring domains appeared in the last weeks, almost all .shop/.store/.site/.xyz with link-selling anchor text (spam blast, not bought). Hand-off asks only for a GSC manual-actions check; no disavow unless there is a manual action.
- Client asked for "AIO 90+" on `audit-geo-citability.mjs`. Measured: product pages are 5,490 of 7,178 indexable pages; their concrete-figure component averages 21/40, because 521 HYDE products print fewer than 6 figures in their specs (174 indexed ones print none). Each spec figure is printed 2–3× on a page (table, FAQ, summary), so ≥6 spec figures is what saturates that component. 90 is therefore a data task, not a copy task, and no figure is filled by us. The fill-in list is generated in the private brain repo (`hyde-brain/scripts/spec_gap_sheet.mjs`, Desktop `05-目录与报价`) because it carries factory hints for the 62 products with a visually confirmed 同款.
- `organize-desktop-hyde.mjs`: a file open in Word (EBUSY) is now skipped instead of aborting the run, and Word's `~$` owner files are never moved.

## Ahrefs / Semrush results (same day)

- Ahrefs "AI responses" export is paid — dropped; AI-citation tracking stays on Bing AI Performance + Clarity (free).
- Ahrefs 404s (6): /video/dc01-panic-exit-device/ and /video/hy-0ss-lock-case/ are renamed products whose /video/<slug>/ watch pages got no 301 (build-taxonomy-redirects covers /products/ and the .mp4 files, not the watch pages) — handed to the engineering session with the exact loop, since it changed that generator today and owns releases. /sitemap_cn.xml, /sitemap_es.xml: old-site names, optional 301. /es/product-studies/ is 200 now. /cdn-cgi/l/email-protection is Cloudflare email obfuscation, not a page.
- Semrush (crawl of 09-28, 100 pages): 19 "invalid structured data" are all Product snippets without offers/review/aggregateRating — deliberate (JsonLd.tsx: no prices or ratings are published; a placeholder offer is worse). "Links with no anchor text" on 40 pages = image-only header logo link; aria-label suggested to engineering. "Broken external links" are the social profile links; could not verify from here (those hosts are unreachable from this network).
