# 被 AI 引用最多的文章：能不能一跳到产品

由 `scripts/audit-cited-guides-models.mjs` 生成，数据源：`docs/research/analytics/2026-09-30/raw/cantonlock.com_AIPageStatsReport_2026_9_30 (1).csv`（Bing AI 引用，同一篇文章的英西葡合并计数）。
文章页的“对应型号”（Mentioned）栏来自 `relatedModels`；型号不在 HYDE 目录或没有照片时，页面会悄悄丢掉那条链接。

| # | 文章 | 引用 | 会显示的型号链接 | 被丢掉的型号 |
|---:|---|---:|---|---|
| 1 | guides/door-hardware-hs-codes-2026 | 78 | **无** |  |
| 2 | guides/door-preparation-161-and-86-2026 | 73 | **无** |  |
| 3 | guides/strike-plates-and-keeps-2026 | 49 | 575 ABET, 564 |  |
| 4 | guides/en-1125-vs-en-179-2026 | 31 | 307, 311 |  |
| 5 | guides/chrome-finish-differences-2026 | 26 | 70722 DC, 65SN |  |
| 6 | guides/master-key-hierarchy-planning-2026 | 23 | 578 SSET, 3431 SSET |  |
| 7 | guides/universal-vs-handed-hardware-2026 | 23 | 575 ABET, 70722 DC |  |
| 8 | news/finish-codes-us26d-626-630 | 20 | 5870 ACET, 607 SSET, 3431 SSET |  |
| 9 | guides/euro-cylinder-size-chart-2026 | 18 | 45BN, 65SN, 70BK, 70MB |  |
| 10 | guides/key-blanks-and-restricted-profiles-2026 | 15 | 65SN, 70BK |  |

前 10 篇中 2 篇没有任何可点击的型号链接。

暂缓：`door-hardware-hs-codes-2026`、`door-preparation-161-and-86-2026` 在标题实验 E1 中（10-14 读数），读数前正文和修订日期都不动；两篇正文目前都没点名型号，读数后再补。
