# Codex — Stahlock exact-model specification import

- Scope: imported 511 missing specification rows into 185 exact-model products from the reviewed Stahlock mapping; translated reviewed Spanish terms where available.
- Safety: no existing value overwritten; 311 source conflicts, 17 ambiguous rows, 24 certification/standards claims and 2 internally disagreeing field groups were held back.
- Provenance: every imported row remains traceable through `stahlock_mapping_dryrun.csv` to a Stahlock product URL and evidence text.
- Tests: importer policy covers whole-word certification filtering, canonical aliases and conflicting canonical groups; second dry run reports 0 rows added.
- Untouched: near-model and category-mismatch reports remain review-only; no Alibaba CAPTCHA data or finish inference was used.
- Next: build/export audit, source commit, release build and public product-page sampling.
