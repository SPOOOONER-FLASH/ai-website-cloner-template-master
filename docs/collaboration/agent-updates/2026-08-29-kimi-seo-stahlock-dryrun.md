# kimi — SEO/GEO·公网回归审计 + Stahlock 参数映射 dry-run（待审核，未提交）

| | |
|---|---|
| 范围 | 只读审计 + dry-run；新增文件全部在 `docs/collaboration/reviews/2026-08-29-kimi-seo-stahlock/`（**untracked，审核通过后随执行提交**） |
| 结果 | 构建 0 语义错误；线上 7 项发现（3 项与西语路由同源）；Stahlock 精确匹配出 **246 产品 / 592 条可补字段** |
| 未动 | 仓库源码、`content/`、`out/`、线上、服务器，一律未碰 |
| 风险 | 无（无写入）；dry-run 自身的三类风险见预案「风险与注意」 |
| 下一步 | 请 cc/cx 审核 `reviews/2026-08-29-kimi-seo-stahlock/PROPOSAL.md` |

## 做了什么

- 本地跑 `node scripts/audit-seo.mjs --json`：487 页 / 0 semantic issues / 0 quality warnings。
- 线上实测 https://cantonlock.com/：重定向、状态码、安全头、压缩、缓存、robots/sitemap/llms、
  JSON-LD 解析、hreflang、面包屑。发现 7 项，最重要：`/es/products/` 裸目录 403、
  `/es/` 缺 in-head hreflang、es 面包屑跨语言跳段（三者建议并入 429 西语路由工程）。
- 抓取 stahlock.com 全站 458 个产品（原始 HTML 在本机 `kimi\workspace\stahlock_raw\`），
  按「型号归一化完全相等 + 类目同族」双闸门精确匹配：
  - 592 条 new（本站缺失字段，带 stahlock URL + 证据原文）
  - 311 条 conflict（仅报告，不动现有值）
  - 73 对类目不符、22 组后缀近似、3 键 ambiguous——全部只供人工，不进自动填充

## 纪律自检

- 精确型号匹配，无近似推断；Finish 18 条有页面证据但已标注请人工逐条过目。
- 未覆盖任何现有值；空规格表宁可留空（HANDOFF 内容纪律）。
- 全部产出可复现：`map_stahlock.py` + 落盘原始 HTML。

## 给审核者的三个重点抽查

1. `stahlock_mapping_dryrun.csv` 里 `type=new` 且 label=Finish 的 18 行
2. 同文件 `type=conflict` 的随机 10 行（确认确为措辞差异）
3. ambiguous 3 键：F101 / 587SSET / 5870SSET 的 stahlock 原页
