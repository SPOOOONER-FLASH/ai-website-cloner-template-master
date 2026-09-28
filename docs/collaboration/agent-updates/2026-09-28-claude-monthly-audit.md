# 2026-09-28 · Claude（工程）· 8/31–9/28 指令核查与月度总结（目标 #78）

**交付**：`Desktop\hyde\HYDE-月度工作总结-2026-08-31_2026-09-28.docx`，源在 `docs/collaboration/reports/`：
- `…md`：报告正文，由 `npm run report:monthly` 生成
- `…json`：474 条合并后的核查行
- `…-导语.md`：手写结论，由生成器插入报告开头

**方法**
1. `npm run report:instructions -- --from 2026-08-31 --to 2026-09-28` 提取本机 Claude 与 Codex 会话里甲方亲自发的 512 条消息（雷茵、惠恩除外）。
2. 五路并行核查，每条都对照 git 和线上实测，不采信会话的自述：Claude 会话 291 行、Codex 会话 183 行、仓库任务文件与 runbook 204 行、agent-updates 279 行、提交记录 40 行。
3. 按类别分五组语义合并：997 行合并为 474 条，状态以最新证据为准，矛盾写在 note。

**覆盖缺口**：86132 那台电脑的会话原文本机读不到，只能通过它写进仓库的目标清单、任务文件和工作报告覆盖。没落进这些文件的指令查不到。

**结果（网站 459 条）**

| 状态 | 条数 |
|---|---|
| ✓ 已完成 | 330 |
| ◐ 部分完成 | 42 |
| ▲ 待甲方 | 38 |
| … 等待外部 | 20 |
| ✗ 未完成 | 12 |
| ↺ 已改方向 | 17 |

**核查中发现的文档与现状不符**：目标清单 #14、#54、#56、#59 实际已完成，#67 动效大部分已做，#23 甲方答复不用；runbook ④⑤ 已完成但仍在第一屏。已在本次或下一提交更正。

## 追加：#80 两处核查查出的事实错误

- `JsonLd.tsx` `websiteSchema().inLanguage` 原为 `["en","es"]`，改为从 `locales` 生成的 10 个语种（pt 用 pt-BR）。
- `llms.txt` 的「over thirty markets」在 09-24 已从 FAQ 删掉（无法核实），这里漏改；改为甲方给的出口地区：欧洲、北美、南美、土耳其、东南亚。`generate-product-seo.mjs` 里同句的两条模板一并删掉（内容里已无残留）。

## 追加：#81 型号未确认的 13 条记录

产品页和产品卡片原写「Reference available on request」，等于承诺能给出型号，但工厂型号我们并不知道。改为如实的「Model code to be confirmed」，十个语种（es/pt 在组件里，另外 7 种写进 ui.json，并用 `npm run i18n:keys` 重新生成客户端译文表）。
「Information available on request」那条兜底实际不会显示：uncoveredFacts 已经过滤掉空值，所以没改。
