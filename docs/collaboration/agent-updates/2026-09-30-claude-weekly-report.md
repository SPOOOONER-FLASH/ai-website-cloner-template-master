# 2026-09-30 Claude — 第 39 周周报、看板缺口、报数口径

甲方 09-30：周例行数据分析 → 周报（大厂周报样式，直接出样板）、周环比与同比、看板还缺什么、Word 到桌面 hyde。
接 `2026-09-30-claude-weekly-checkpoint.md`（压缩前的检查点）。

## 交付

| 物 | 位置 |
|---|---|
| 周报正文（计分卡、漏斗、成果、九条洞察、实验看板、风险与求助、下周计划、四周 OKR、看板缺口、口径、骨架） | `docs/research/analytics/2026-09-30/HYDE-周报-2026-W39.md` |
| Word 版 | `Desktop\hyde\HYDE-周报-2026-W39.docx`（`node scripts/build-client-runbook-docx.mjs --src <md>`） |
| 环比 / 同比表（可重跑） | `scripts/build-weekly-kpis.mjs --write` → `2026-09-30/KPI-WOW.md` |
| 本期结论、报数口径、看板缺口 | `docs/collaboration/DATA-DASHBOARDS.md` |
| 甲方要做的五件 | `CLIENT-RUNBOOK.md` 第一屏（Word 已重生成） |
| 数据驱动的优化 | be90da18c14：HS 编码、161/86、玻璃门三篇英文搜索标题（实验 E1，10-14 读数） |

## 所有会话都要知道的三件事

1. **报数口径变了**：流量只报 Clarity 真人会话、GA4 感兴趣的会话。GA4 用户数约 58% 是分辨率 1280×1200 的机器人。
2. **AI 只引用指南，不引用产品页**；0% 的两个话题（送审文件、消防合规）不能靠声称没有的认证去补。
3. **「找谁买」的词排在第 20–45 位**：manufacturer / factory / exporter 类查询是下周 P0。

## 给其他会话

- 多语言会话：三篇指南（door-hardware-hs-codes-2026、door-preparation-161-and-86-2026、glass-door-thickness-and-cutouts-2026）
  的英文 seoTitle / seoDescription 已改，七语种的源哈希会显示过期，请按新英文重译标题。西葡语**故意没改**（实验对照组），10-14 读数后再定。
- 文案会话：被引用最多的 10 篇指南，下周要逐篇核对文末「对应型号」链接（周报第九节 P1）。

## 测试

`npm test` 456/456；i18n-lint 通过；`build-weekly-kpis.mjs` 用 09-22、09-25、09-30 三期实数验算（GSC 9/21–9/27 点击 25、展示 2,884 与导出一致）。

## 没做 / 风险

- 同比：GA4 没有去年数据；GSC 同比等甲方导出「过去 16 个月」，脚本拿到后自动出数。
- Bing AI 引用 9/23 180 → 9/27 47，只有 5 天数据，判断不了是波动还是趋势。
- Meta 爬虫是否限流等甲方一句话；限流要在 Cloudflare 操作，会话不碰。
