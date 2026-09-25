# 改名同时移类：一跳 301（Claude 工程，2026-09-24）

- **为什么**：卫浴 54 条要改名（slug 跟着改），其中 BH01–04、BH55–58 移 care-grab-bars，BH15/16/17 移 hardware-accessories/latches。原机制里改名是 `productMerges`（同类目内），移类是 `productMoves`（slug 不变）；两条叠用，旧网址要跳两次，还会在「旧类目 + 新 slug」生成一个从没存在过的网址。
- **改了什么**：`productMerges` 可带 `toCategory`，一条记录、一次跳转。`category-aliases.ts`（跳转页）、`build-taxonomy-redirects.mjs`（nginx）、产品页路由都按它走；`rename-product-slug.mjs` 加 `--category-path a/b`。
- **测试**：`taxonomy-moves.test.ts` 新增「改名又移类只跳一次」；`tsc` 通过。
- **影响雷茵**：无（BH 系列不在 out-rayen）。
- **下一步**：文案会话提交 54 条三语名后，我跑改名 + 移类 + 标题，一起发布（目标清单 #38、#39）。
