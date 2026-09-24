# 2026-09-24 · Claude · 品类页长尾标题（GSC 循环第二批）

依据：GSC 09-22 导出，这几页有展示、0 点击；标题都是通用的「X — Manufacturer & Supplier」，没有买家搜的词。

| 页面 | 展示 / 排名 | 新 seoTitle | 买家原话（查询语料） |
|---|---|---|---|
| /products/brass-steel-hinges/ | 79 / 10.9 | Stainless Steel & Brass Door Hinges, China Manufacturer | brass door hinge manufacturer, china … steel hinge, ss hinges |
| /products/door-closers/ | 72 / 19.9 | Door Closers for Commercial Doors, China Manufacturer | door closer manufacturer, china door closer |
| /products/night-latches-rim-locks/ | 36 / 29.3 | Rim Night Latches & Rim Locks, China Manufacturer | rim night latch, night latch rim lock |
| /products/panic-exit-devices/ | — | Panic Bars & Exit Devices for Single and Double Doors | anti panic door, fire exit door with panic bar double |

- `Category.seoTitle?`（types.ts）+ `content/categories.json` 四条；`(en)/products/[category]/page.tsx` 有就用，没有照旧。
- 核对事实：合页 29 款以不锈钢为主、有黄铜；单门、双门推杠都有。**夜锁品类摘要原写「60mm backset」，实际有 50mm ×3、40mm ×1**，三语改为「大多数 60mm」（同族卖点必须对每个型号成立）。
- 标题不写「Fire」：防火等级没有证书。
- categories.json 是中性文件；seoTitle 只有英文页读，雷茵不读。夜锁摘要的西葡字段是 HYDE 页面文字。
- tsc 通过，npm test 373 通过。生效需要 HYDE 发布。两周后（10-08）看这几页点击率。
