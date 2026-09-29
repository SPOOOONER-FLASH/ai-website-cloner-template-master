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
