# 2026-10-12 · Claude · 首页阿根廷模块：照片位换成 AR-5 一排

客户（附首页截图）：「ar4 做到阿根廷集合那里去，四个框上面加多一栏给 ar-5 明白吗 不要浪费这个位置了」。

| 部分 | 改动 |
|---|---|
| 首页模块（`ArgentinaAr4Showcase`，`pageHeading=false`，全部语种的首页） | 标题改为「HYDE Argentina Collection」；布宜诺斯艾利斯大照片去掉，原位置放 **AR-5** 一排四格（AR5-2000 插芯锁 / AR5-120 窄框锁 / AR5-113 门闩 / AR5-123 推拉门锁，四个组各一款，图与 AR-4 区分开）；下面 **AR-4** 一排（原四格），行右侧「Explore the AR-4 collection」；顶部主链接「Explore the Argentina collection」 |
| AR-5 格子链接 | `/products/argentina/#<id>`（es → `/es/…`；pt 与覆盖语种 → 英文页，集合只有 en/es）。`ArgentinaCollection` 卡片加 `id` 与 `scroll-mt` |
| AR-4 页（`pageHeading=true`） | 不变：照片、四格、底部两个链接照旧 |
| 译文 | 新导语 + 四个 AR-5 名称：es/pt 写在组件里，七个覆盖语种进 ui.json；不再使用的「The full Argentina collection」删除；`npm run i18n:keys` 重生成 |

检查：npm test 462/0、i18n-lint、titles:check、eslint；本地首页实测链接与锚点。发布归工程会话。

**复核**（4 个视角 + 每条一名反驳者，workflow `wf_ff4440ad-ff0`）确认并已修：AR5-120 改称窄框锁（数据只写 batientes angostos，未写铝门）；俄语「门闩」用 засовный замок、阿拉伯语用 ترباس（网站其他处的用词）；两排标题到格子的间距统一；AR-5 格子悬停时遮罩只降到 85%（AR5-113 的深色锁盒在标题下，40% 时对比度低于 4.5:1）；`scripts/design/check-bau-entry-{pages,origin}.mjs --expect-ar4` 不再要求首页有照片，改查 AR-5 四款与锚点（README 同步一行）。与 main 合并时 7 个 ui.json 冲突按三方合并处理（main 新增 3 条保留、本次增 5 删 1）。
