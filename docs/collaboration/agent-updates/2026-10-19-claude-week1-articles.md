# Claude · 2026-10-19 · Week-1 articles: five of seven, all ten languages (task 98)

Requested by the engineering session on the client's behalf: at least seven articles a week. The reason is that the average GSC position fell from 6 to 11. Topics come from `docs/collaboration/2026-10-19-数据结论-GSC排名下滑与每周7篇选题.md` §4.

Topics #5 (HSN codes) and #6 (door closer arms) went to the 「硬件产品数据库与报价系统」 session, by agreement.

## The five articles (`content/news/`, publishedAt 2026-10-19)

| # | Slug | Overlaps with, and how this one differs |
|---|---|---|
| 1 | flush-bolt-selection-manual-automatic-length-which-leaf | door-stop-holder-or-flush-bolt: that one is the stop/holder/bolt distinction. This one covers type, length, which leaf, keep and strike, fire pairs, and the order line |
| 2 | how-to-write-a-keying-schedule-with-template | master-key-hierarchy-planning: that one is theory. This one is the schedule itself, with a worked example and a blank template |
| 3 | satin-chrome-vs-satin-nickel-us26d-us15 | chrome-finish-differences: that one explains the plating stack. This one is the head-to-head choice |
| 4 | fire-rated-door-knobs-and-levers-what-is-rated | fire-door-hardware-what-must-be-rated: that one covers the whole door. This one covers knobs and levers. It is education only and states that our knob and lever locks carry no fire listing |
| 7 | why-key-bitting-must-be-unique-master-key-security | key-blanks and master-key articles: this one covers bitting uniqueness, MACS and key control. It contains no attack methods |

## How they were made

- **Drafting.** Subagents drafted EN/ES/PT. In review, I removed every sentence that pointed out contradictions between our own records (FB012/FB016/FB001 SS, and finish spellings in 70SN/70722). Those belong in the knowledge base, not on a public page.
- **Hero images.** Each hero is a real photograph (verdict `photo`, no confidence flag).
- **Share images.** Regenerated with `npm run share-images`. I reverted the unrelated byte change it made to importing-door-hardware-china-mexico-2026.
- **Seven languages.** Translated through `i18n-batch` and `i18n-merge` by one native-register subagent per locale. All merges were 5 of 5 with sourceHash, and the `--dry` runs were clean. Terms that are new to the site (keying schedule, incidental master key, bitting and similar) are listed in each locale's report. A native reviewer is still worthwhile.

## Checks

- `npm test` 494 passed, 0 failed.
- `i18n-lint`: clean.
- `titles:check`: passed.
- `audit-no-chinese`: passed.
- `i18n-batch`: 0 untranslated in every locale.

## Open question for the client

`master-key-systems-how-many-levels-you-need` says "We build to five levels", but no product record offers master keying. The new articles make no claim either way. The client should confirm.

## Release

Not done here. The engineering session releases week 1 together, once #5 and #6 are in.
