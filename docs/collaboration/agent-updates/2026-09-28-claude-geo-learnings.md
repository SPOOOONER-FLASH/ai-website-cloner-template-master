# 2026-09-28 · Claude (Hyde 文案) · GEO 系列文章：学到的、做的、交给甲方的

来源：甲方转来 QuickCreator GEO 系列与 SEO 文章约二十篇。完整说明 `docs/collaboration/reports/2026-09-28-geo-learnings.md`，桌面 Word 由 `node scripts/build-geo-report.mjs` 生成。

**学到并落地的**：零品牌词测法和季度复测；提到 ≠ 推荐；AI 读的是站外引用图谱；答案要放开头；实体一致性。**不照做的**：字数和实体密度的硬指标（来自 SaaS 样本）、AI 批量生产内容（与“不编造”冲突）。

| 做了什么 | 文件 |
|---|---|
| 题库：没有另起一套——另一会话已建 `docs/geo/`（口径锁定、尚未首测），第一次记录前补 8 题（oem-05–07、mdl-01–05 型号级），37→45 | `docs/geo/baseline-queries.json`、`README.md` |
| 文章开头审计生成器；5 篇指南摘要首句改为直接答案（三语，数字取自正文） | `scripts/audit-article-openings.mjs`、`docs/copy/article-openings-audit.md`、5 个 guide JSON |
| LinkedIn 主页简介 + 3 帖 | `docs/copy/linkedin-starter.md` |
| 发现三个英文公司名并交甲方定 | runbook ① |
| runbook 第一屏新增四件（公司名、LinkedIn、AI 摸底、GSC 两张未收录清单）；删掉已过时的“隐私页没有”（/privacy/ 已上线） | `CLIENT-RUNBOOK.md` + Word |

**交给别人**：工程会话——LinkedIn 主页网址到手后加进 `siteSettings.social`（进 `sameAs`）；公司名定了之后 JSON-LD 的 `legalName` 同步。多语会话——5 篇指南摘要英文变了，`--stale` 会带出。
**接下来（本会话）**：任务表 23 行，34 篇指南补 `relatedModels`。
**测试**：`npm test` 通过（见提交前运行）。

## 追加：任务表 23 行（relatedModels）
7 篇指南补 `relatedModels`：307/311（认证、EN 1125 vs 179、外侧执手功能、防火门、供应商资质五篇，正文都写“307 和 311 正在测试”）；311 + AR4-101/110/140/1121（开模指南）；B024/B025（铜还是黄铜合页）。其余 27 篇不讨论具体型号，保持空。候选脚本把 201（钢种）、300（起订量）、564（“57 of 564 rows”）误认成型号，已人工排除。`npm test` 442/442。
