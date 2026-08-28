# 相关产品推荐补兜底 — Claude — 2026-08-28

**问题**：推荐区早就渲染了，但只认手填的 `relatedModels`，而 435 个产品里只有 24 个填了。
其余 411 页显示同一句 "Related products will appear when the catalogue relationship has
been verified." —— 411 页完全相同的正文，本身就是 GSC「重复网页」的一部分。

**做法**：`src/lib/related-products.ts`，三级回退
`relatedModels`（手填，标题 "Related products"）→ 同分类同系列 → 同分类。
都没有则整段不渲染，不留占位句。

标题随来源变，手填的关系不会和字母序邻居混为一谈。

**关键点**：邻居按型号排序后取**轮转窗口**，不是取前 N。取前 N 会让同组所有页面推荐一模一样，
等于把重复从正文搬到推荐区。实测 stainless-steel-handles 35 页 → 35 个不同组合。
副作用是每个产品被约 3 个兄弟页链接，长尾抓取深度也摊开了。

**验证**：`npm run check` 全过（483 页 / 475 内容页 / JSON-LD 475 / 语义问题 0）。
新增 11 个测试，已加进 `npm test`（总数 25）。
建成品抽查：435 个产品页全部有推荐区，旧占位句残留 0 页。

**没碰**：`src/data/products.ts`、`[category]/[slug]/page.tsx`、`content/categories.json`
—— Codex 正在改（分类别名重定向），未提交。解析器另起新文件就是为了避开。
`out/` 同样未提交（我跑 check 的产物），发布构建方自行处理。

**顺带纠正一条待办**：`categories.json` / `downloads.json`「没接进站点」是过时信息，
`src/data/categories.ts`、`downloads.ts` 都在，9 个文件在读。已从 HANDOFF 删掉。
