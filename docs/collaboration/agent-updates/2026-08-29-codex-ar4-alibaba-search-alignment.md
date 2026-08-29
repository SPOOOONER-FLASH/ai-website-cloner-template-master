# Codex — AR-4 Alibaba numeric alignment

- Scope: added a dedicated Alibaba search-number field and assigned AR4-110 → `110`, AR4-140 → `140`, AR4-101 → `110`, AR4-1121 → `1121` from the client's confirmed mapping.
- Behaviour: exact numeric searches remain labelled as storefront searches; only a real `alibabaUrl` may claim a direct listing.
- CMS: editors can maintain the alternate search number without code changes.
- Validation: regression test failed before the mapping and passes after it; `npm run check` passes with 75 unit tests, 489 generated routes, 0 SEO semantic issues and 0 editorial warnings. Generated HTML contains only the four confirmed numeric search queries.
- Untouched: product dimensions, names, images, pricing, MOQ and unverified direct Alibaba listing URLs.
- Next: release this source commit immediately, then publish the organiser-verified TOOL JAPAN schedule as a separate source/release pair.
