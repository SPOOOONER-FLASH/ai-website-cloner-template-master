# Codex — desktop CTA and inquiry verification, 2026-09-28

## Delta

- `PromoDialog.tsx`: only `PromoCardBlock` presentation changes. Passive card is a native, collapsed disclosure; 44px close target; `key={dismissalKey}` resets native open state when advancing to another card. Preserve timing, cooldown, localized copy, overlay presence and mobile-article suppression from the latest merged source.
- `BauColumn.tsx`: replace the newly introduced `duration-300` with the existing medium motion token; this fixes the integrated motion guard failure.
- Desktop audit adds a localhost-only disclosure/dismissal flow. Inquiry audit is new and rejects public domains, mocks before initialization and blocks external HTTP. Persist selected before/after screenshots and generated JSON in `docs/design-references/2026-09-28-desktop-verification/`.
- Refresh the generated photo-audit reports for the integrated catalogue; update goal checkpoint and the runbook's same-session CLI hook instructions. Existing Guides hero imagery and the 13 published real-photo Blender studies remain.

## Verification

Exact owned runtime source on merged baseline `144b7ec067e`: `npm run check` exit 0 (`tmp/codex-desktop-check/check-promo-final.log`); motion, lint, typecheck, tests, build and export guards pass. Semantic SEO errors zero; 7,697 inspected documents / 773,711 internal links / 182,853 asset references resolve. Report-only length warnings remain (2,436 titles, 1,630 descriptions); no invented claims added to pad them.

Browser: 15/15 Home/Finder/Guides/Studies/Contact viewport scenarios; 3/3 delayed home promo scenarios at 390/1440/1920, including expanded dismissal; 4/4 local mock inquiry success/error scenarios at 390/1440. Zero real Web3Forms requests. Impeccable detector on both changed components: no findings. Hook tests: 3/3, but runtime trust is not observed and the persistent Goal is `usageLimited`.

## Risks / next assist

- Source push and HYDE export publication follow this checkpoint; append the actual commit and public verification evidence after observing them. Do not equate these local checks with deployment.
- Claude retains the claimed header/motion, seven-language and title/SEO pipelines. Exact baseline findings are in `2026-09-28-codex-desktop-search-findings.md`; no overlapping edits made. Factory source is still required for complete glass-pull meshes and ambiguous dimensions.
- Never edit/build in this checkout while `npm run ship` is running: its failed root merge can restore a Git-created backup stash, discarding newer edits or restoring an export mid-build. This occurred during stage 1; own changes were recovered and the full check rerun after ship completed. Keep those operations sequential.
- Full project check generates both site outputs in this isolated checkout. Generated RAYEN/export churn is excluded from the source commit; publish HYDE only through `release:hyde`. Cloudflare purge remains the client's action.
