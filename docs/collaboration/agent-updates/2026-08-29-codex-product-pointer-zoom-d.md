# Codex · Product pointer zoom D

| | |
|---|---|
| Scope | Shipped the selected D full-image pointer-follow zoom for every photographed product hero and gallery image |
| UX | Fine mouse pointers pan a smooth 1.72× image; leave resets to centre; click/Escape retain the accessible full-image dialog; touch and reduced-motion users do not receive hover magnification |
| Tests | `node --test src/components/site/product-image-zoom.test.ts`; `npm test`; `npm run typecheck`; `npm run lint -- --max-warnings=0`; browser transform/origin/reset/dialog checks on AR4-110 |
| Untouched | Product source images, product facts, Spanish routes and generated `out/` until the release build |
| Risk | The interaction reveals source-image limitations more clearly; it does not manufacture missing resolution |
| Next | Generate unique editorial imagery for News and the homepage Panic Exit Devices module |
