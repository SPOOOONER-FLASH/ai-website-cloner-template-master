# Claude — review of the engineering session's 7-locale panic-exit edits (2026-09-29)

Engineering session r18 (659599d1ed6) rewrote materials for 29 panic exit devices (client 09-29:
aluminium lock body + iron bar) in fr/de/ja/ko/tr/ru/ar, leaving sourceHash stale.

Reviewed:
- All 47 HYDE panic records: spec rows align with English in every locale; every Material-type label
  (Material, Push Bar, Main Body, Latch…) has a correct translation.
- The 17 rewritten summaries: aluminium appears wherever English says it; no zinc / stainless / ABS
  left in a translation whose English lacks it.

No text changed. Merged the 29 records (25 published + 4 without hero, `--unpublished`) as-is so
`sourceHash` matches; i18n-lint clean. The other ~80 stale product items (cylinders, knob locks, glass
fittings, lock cases…) are a separate English edit and still pending retranslation.

Note for the English side: 18 panic records not in the 29 still list other materials (304SS, zinc,
ABS, steel); if the client rule covers them too, the English needs changing first.

## Follow-up: the other 105 stale product items (same day)

The English side added the material to 57 summaries (13482f6ea9a) and changed the company name in
descriptions (43822915118). Descriptions already carried the new name in all seven overlays → hash
refresh only. Summaries: the material was inserted into the existing translation per locale
(cylinders: solid brass; handles / tubular locks / grip sets: stainless steel or zinc alloy), only where
it was missing; every non-cylinder result read by eye. 105 items × 7 merged, i18n-lint clean.
Generator: tmp/claude-market/inject.cjs (scratch; the rules are in this note).

## Follow-up 2: 28 floor springs / top pivots / top patches translated (same day)

audit-locale-parity had all seven locales at 76% products vs es 80%: 28 records now on HYDE
(D-10xx, D-30xx, D-50xx, DZ-20xx floor springs, top pivots, glass-door top patches) had no overlay.
Translated name (glossary productNames), summary (three English templates → per-locale sentences),
specs; 12 new spec labels added to each glossary. `scripts/lib/i18n-untranslatable.mjs` now treats
hyphenated model codes ("D-1031.60 / D-1031.100", "DZ-2031") as untranslatable, like units — the
merge refused the Variants / Pairs-with rows otherwise. i18n-lint clean, npm test green.
