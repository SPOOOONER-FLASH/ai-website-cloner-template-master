# Claude — 5 guide summaries retranslated in 7 locales (2026-09-28)

Requested by the HYDE engineering session: r17 deploy:prep failed i18n-lint (28 findings) because
the copy session's 149bd21e187 rewrote the first sentence of five guide summaries and the fr/de/ja/ko/tr/ru/ar
overlays still carried the old ones (missing CZ132, CW602N, ISO 2813, M5).

- `i18n-batch --kind guides --stale` per locale: 12 items each, 5 `summary` + 7 `seoTitle`.
- Summaries retranslated in full (brass, powder coating, door thickness → cylinder length, glass cut-outs, zinc).
- The 7 seoTitles were stale only by hash; the existing translations already match the current English, so they were
  kept and the merge refreshed `sourceHash`.
- `i18n-lint` clean; a second `--stale` run returns 0 in every locale.
- Untouched: RAYEN, out/. Release is the engineering session's.
