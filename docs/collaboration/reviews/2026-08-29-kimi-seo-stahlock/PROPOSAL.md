# 预案 — SEO/GEO·结构化数据·公网回归审计 + Stahlock 参数精确映射 dry-run

> 待 cc/cx 审核。kimi 全程只读分析 + dry-run，**未改仓库、未动线上**。
> 日期：2026-08-29 · 分析对象：本仓库工作副本（最后提交 `1cbfd7b73`）+ 线上 https://cantonlock.com/

---

## 一、SEO/GEO 与结构化数据审计

### 1. 本地构建产物（`node scripts/audit-seo.mjs --json`）

| 指标 | 值 |
|---|---|
| 静态页 | 487（公开内容页 479） |
| JSON-LD 覆盖 | 479/479 |
| semantic issues（CI 级） | **0** |
| editorial quality warnings | **0** |
| releaseState | indexable |
| in-head alternate 链接页 | 16（其余靠 sitemap hreflang） |

### 2. 公网回归（线上实测）

**通过**：http→https 301 ✔；产品/新闻/服务/展会/证书/联系/公司/下载/status 全 200 ✔；404 正确 ✔；HSTS（1 年）✔；brotli ✔；`cf-cache-status: HIT` ✔；robots/sitemap/llms 全 200；sitemap 479 URL、48 条 sitemap 级 hreflang、8 个 es URL；产品页 4 个 JSON-LD（Organization/WebSite/Product/BreadcrumbList）可解析、canonical 自指、h1 唯一、img 全带 alt。

**发现问题（按严重度）**：

| # | 问题 | 证据 | 建议 |
|---|---|---|---|
| 1 | `/es/products/` 裸目录 **403**（无 index 页 + nginx autoindex off）。目前无页面链接它，但抓取/手改 URL 会踩到 | 实测 403 | 建 `/es/products/` 索引页（并入 429 西语路由工程），或 nginx 转 404 |
| 2 | `/es/` 首页**无 in-head hreflang**，而 `/products/argentina-ar4/` 等页有完整 en/es/x-default 簇——两套机制并存 | 实测对比 | 统一其中一种（建议 in-head 簇全站一致） |
| 3 | es 产品页 BreadcrumbList JSON-LD 中段指向**英文** `/products/`（跨语言跳段） | 实测 argentina-ar4 | 配合 #1 建索引后改指 `/es/products/` |
| 4 | `www.cantonlock.com` 200 + canonical 指 apex，而非 301 | 实测 | nginx 加 301 www→apex（canonical 已兜底，非紧急） |
| 5 | 首页响应**缺安全头**：无 X-Content-Type-Options / X-Frame-Options / Referrer-Policy / CSP | 实测 headers | 注意 HANDOFF 的坑：子 location 有 add_header 会吃掉父级安全头，需逐 location 复查 |
| 6 | 旧站 `index.php?id=1569`（LC5845）301 到 `/products/` 聚合页而非深链 | 实测 | 观察项，可后补深链映射 |
| 7 | robots.txt `Disallow: /*.txt$` 靠最长匹配兜底 llms.txt，简单爬虫可能误判 | robots.txt | 观察项 |

**结论**：构建产物 0 语义错误，线上基础健康。#1–#3 与西语路由工程同源，建议合并处理。

---

## 二、Stahlock → Canton Hyland 参数映射 dry-run

### 授权与纪律（沿用 `src/data/products.ts` 头注与 HANDOFF.md）
stahlock.com 是客户自有另一门面站，2026-08-16 授权为二级参考。**只搬精确同型号产品的字段**；其品牌故事、性能宣称、认证宣称一律排除。不覆盖任何已有值；不同表面处理（PBET/SNET…）互不借用。

### 方法
1. 全站抓取 stahlock.com：28 分类翻页，**458 个详情页**原始 HTML 落盘（`kimi\workspace\stahlock_raw\details\`，本机可复核），解析为结构化 JSON。
2. 型号归一化（大写、去空格/连字符/点/斜杠）后**完全相等**才算匹配。
3. **类目一致性闸门**：型号相同但类目不同族一律排除（拦下 73 对；典型：stahlock `033`=Trim Handle vs 本站 `033`=Panic Exit Device——同型号跨族复用）。
4. 只提「本站缺失的 label」；两边都有但值不同 → conflict，**不建议采用**。

### 结果

| 指标 | 值 |
|---|---|
| stahlock 解析产品 | 458 |
| 精确型号键命中 | 318 |
| 类目不符排除（仅人工复核） | 73 对 |
| 获益产品数 | **246** |
| 建议新增字段 | **592 条** |
| 冲突（仅报告） | 311 条 |
| 后缀近似（禁推断，仅人工） | 22 组 |
| 一对多 ambiguous（需人工定夺） | 3 键：`F101`(stahlock id 2104/2205)、`587SSET`(2147/2157)、`5870SSET`(2149/2151) |
| 其中当前规格表 ≤2 行的薄弱页 | 63 |

新增字段分布 top：Door Thickness 58 · Cylinder 34 · Lock Body Material 20 · Backset 18 · Finish 18 · Latch Bolt 16 · Spindle Hole 15 · Strike Plate Material 15 · Center distance 15 · Usage 14 · Standard 14 · Opening Angle 13。

### 本目录文件

| 文件 | 内容 |
|---|---|
| `stahlock_mapping_dryrun.csv` | 903 行 = 592 new + 311 conflict，每行带 stahlock URL + 证据原文 |
| `stahlock_near_misses.csv` | 22 组后缀不同近似型号，**仅供人工，不可自动填充** |
| `stahlock_category_mismatch.csv` | 73 对类目不符，仅人工复核 |
| `map_stahlock.py` | 匹配脚本，可重复执行（路径指向 kimi 工作区） |

### 风险与注意
- **Finish 类 18 条**：值来自同型号 stahlock 页面本身（有证据、非推断），但鉴于后缀教训，请逐条过目。
- 311 条 conflict 多数应是措辞差异（`304SS` vs `304 Stainless Steel`），少数可能真分歧——**一律不动现有值**，分歧交甲方。
- ambiguous 3 键写入前必须人工定夺以哪条 stahlock 记录为准。

### 建议执行路径（审核通过后）
1. 按 `scripts/enrich-product-specs.mjs` 的 CITED 模式写 `stahlock-cited.mjs`：592 条 new 带 `src`（stahlock URL）入引用表，idempotent、只追加缺失 label，先 `--dry` 再写。
2. 写入后 `npm run content` + `npm run check` + `node scripts/audit-seo.mjs --check`。
3. 上线：`deploy:prep` → push → 服务器 pull → **Cloudflare Purge**。
4. 本批可解决 GSC/Bing「内容过少/重复」中与这 246 个产品相关的部分（尤其 63 个薄弱页）；32 个 stainless-steel-handles 摘要重复等仍等甲方数据。

---

## 三、建议顺序
1. cc/cx 审核本预案 + 抽查 dry-run CSV（重点：Finish 18 条、conflict 样本、ambiguous 3 键）
2. 通过 → 写 `stahlock-cited.mjs` → dry → 写入 → `npm run check`
3. SEO #1–#3 并入 429 西语路由工程
