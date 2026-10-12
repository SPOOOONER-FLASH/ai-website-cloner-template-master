# 2026-10-12 · Claude · 首页阿根廷模块：照片位换成 AR-5 一排

客户（附首页截图）：「ar4 做到阿根廷集合那里去，四个框上面加多一栏给 ar-5 明白吗 不要浪费这个位置了」。

| 部分 | 改动 |
|---|---|
| 首页模块（`ArgentinaAr4Showcase`，`pageHeading=false`，全部语种的首页） | 标题改为「HYDE Argentina Collection」；布宜诺斯艾利斯大照片去掉，原位置放 **AR-5** 一排四格（AR5-2000 插芯锁 / AR5-120 铝门锁 / AR5-113 门闩 / AR5-123 推拉门锁，四个组各一款，图与 AR-4 区分开）；下面 **AR-4** 一排（原四格），行右侧「Explore the AR-4 collection」；顶部主链接「Explore the Argentina collection」 |
| AR-5 格子链接 | `/products/argentina/#<id>`（es → `/es/…`；pt 与覆盖语种 → 英文页，集合只有 en/es）。`ArgentinaCollection` 卡片加 `id` 与 `scroll-mt` |
| AR-4 页（`pageHeading=true`） | 不变：照片、四格、底部两个链接照旧 |
| 译文 | 新导语 + 四个 AR-5 名称：es/pt 写在组件里，七个覆盖语种进 ui.json；不再使用的「The full Argentina collection」删除；`npm run i18n:keys` 重生成 |

检查：npm test 462/0、i18n-lint、titles:check、eslint；本地首页实测链接与锚点。发布归工程会话。
