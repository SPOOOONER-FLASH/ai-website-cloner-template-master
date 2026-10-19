# 2026-10-19 Claude: week-1 topic #6 (door closer arm types) as an update, not a new page

- **Decision:** `door-closer-mounting-positions-2026` (2026-09-21) already is the arm-types article: regular arm (pull side), top jamb, parallel arm (push side, less leverage, size up), slide track, reinforcement, handing, backcheck, schedule. A second page on the same query would split "door closer" / "door closer mounting options" between two URLs. The 10-19 duplicate check missed it. So #6 was done as an update of the ranking page.
- **What:** new section "Two of our closers, two arrangements" before "What to put on a schedule", in all ten languages (en/es/pt on the record, seven overlays via `i18n-merge.mjs`, body hash refreshed). `relatedModels` now JU-088 + JU-051; `updatedAt` 2026-10-19.
- **Model facts (records + photos only):** JU-051 arm closer, photo shows body on door face with arm to a frame shoe (regular arm); record: aluminum, 15–30 kg, 800mm, 180°. JU-088 slide track (photos: body, single arm, track); record: aluminum, 40–65 kg, 950mm, 180°. Neither record has an EN 1154 power size or a mountings list, and the text says so. EN 1154 cited only for power-size classification by door width and mass.
- **Checks:** content, i18n-lint, titles:check, article/guide/faq/image/regional/i18n tests 106/107 (the `seo-policy` failure is `deploy/` missing from this sparse checkout).
- **Topic list:** no status column in the 10-19 table; not edited.
- **Untouched:** `out/`, RAYEN lane.
