# 2026-09-24 · Claude · 弹窗「目录下载」→ 配置器；葡语弹窗

Client: 「弹窗里的「目录下载」换成配置器」。

- `content/promo.json` v10: card 2 was the catalogue PDF; now "Don't know the model? / ¿No sabe el modelo? / Não sabe o modelo?" → `/configurator/`, `/es/configurator/`, `/pt/configurator/`. Card 1 (contact) gained Portuguese copy and `/pt/contact/`. Version bump re-shows the rail to everyone once.
- `/pt/` pages were never a promo surface (`promoSurfaceFor` stripped only `/es`), so Brazilian visitors never saw the rail at all. Fixed; `localisePromoCardCopy` now reads `*Pt` fields, falls back to English, close label "Fechar".
- Card hides on its own page in all three languages (dead-click rule).
- Tests: `npm test` 367 pass (new PT test), `tsc` clean. Dev-verified on `/pt/products/`.
- Card copy is Codex's field by ownership table; changed on the client's direct instruction — Codex may reword freely.
- Not released: HYDE release needed (`npm run release:hyde`).
