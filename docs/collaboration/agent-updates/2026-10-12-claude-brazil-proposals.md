# 2026-10-12 · Claude · 巴西逃生锁专栏：合成方案（未上线）

**范围**：任务与授权见 `tasks/2026-10-12-brazil-panic-bars.md`。分支 `claude/brazil-collection`，未进 main。

**客户选定**（10-12）：「结合 a 的多图视觉和 c 的选型器，不要写 9 个牌子和后面的厂商，他们是我们的下游，所以不要泄密」。A/B/C 三套预览已删除（在本分支历史 `d733e8a4591` 里）。

| 部分 | 内容 |
|---|---|
| 路由 | `/products/brazil/`（en）+ `/pt/products/brazil/`（pt），PARTIAL_ROUTES `["en","pt"]`；**noindex、不进 sitemap、无入口**，等甲方「上线」 |
| 组件 | `src/components/site/brazil/BrazilCollection.tsx`：标题与导语 → 「按门选」四个门型立面（`DoorDiagram`）→ 吸顶筛选条（外开方式 / 颜色 / 结果数 / 照片⇄表格）→ 白底卡片网格（插入工厂视频卡、「A fábrica por trás da barra」卡）或按门型分组的选型表 |
| 文案 | 不写品牌数、不写任何客户名；只说「Grandes fabricantes brasileiros de portas corta-fogo compram de nós」/「Leading Brazilian fire-door makers buy their panic bars from us」 |
| 数据 | `scripts/brazil/build-collection.mjs`：103 条商城/官网列表 → 38 个型号（含 HYDE 306 三款）。按「模具系列 × 门型 × 款式（推杆/touch/玻璃门/微动开关）× 外开方式」归并，颜色为选项；BR1…BR8 匿名系列号。选图：本机 `image-picks.json` 排除 logo / 示意图 / 占位图，其余取白底边缘最多的一张，DKS 裁掉底部品牌条；无可用照片的 3 个型号不上页 |
| 保密 | 品牌 ↔ 系列表、来源链接、选图表只在本机 `tmp/claude-brazil/`；生成器在公开 JSON 出现客户名时报错；页面文字实测无任何品牌名 |

**测试改动**：`locale-route-parity.test.ts` 的覆盖语种路由集合，排除不属于该语种的 PARTIAL_ROUTES（/products/brazil 只有 en/pt）。

**检查**：npm test 462/0、eslint、tsc（.next/dev 里已删预览路由的旧类型除外）、impeccable detect、美式拼写；本地 en/pt 桌面与 390 px 手机实测，无横向滚动，38 张图无坏图。

**上线前还差**：照片上的客户品牌字（DKS、DORMETAL、Soprano 等压印/印刷）按阿根廷流程逐张修掉并复核，统一 HYDE 水印；几张门的场景照可换成去背图（若客户有）。然后去掉 noindex、加 sitemap、首页与菜单入口。
