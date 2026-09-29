# 2026-09-28 · Claude (Hyde 文案) · 公司英文全称统一

甲方 09-28：「公司英文全称 Canton Hyland hardware & building material Co.ltd」。按标准英文书写统一为 **Canton Hyland Hardware & Building Material Co., Ltd.**

- 替换旧名 “Canton Hyland Hardware (Group) Co., Ltd.”（及 “Canton Hyland Hardware Co., Ltd.”）：143 个文件、931 处——110 条 HYDE 产品英文描述、`src/data/company.ts` 三语 profile、`content/faq.json`、`content/site-settings.json`（页脚版权）、七语覆盖层 `content/i18n/*`（专有名词，拉丁字母原样）、生成脚本 5 个（OG 图、主匙打印单、目录、FAQ 西葡、主匙工作簿）。SVG/HTML 里写 `&amp;`。
- 重出 `public/seo/og-default.png`，目视确认新名正确。
- **未改**：`content/rayen/assets.json` 里的历史证书名（雷茵线、且是证书原文）；`scripts/build-query-corpus.mjs` 注释里的真实搜索词；`docs/` 下的历史记录。
- **交工程会话 #112**：JSON-LD `legalName`。**交 BAU 会话**：展位登记名更正邮件用这个名字。**多语会话**：110 条产品描述和 FAQ 英文变了，覆盖层里的名字我已同步，`--stale` 若带出可直接标完成。
- runbook：① 移出（已答）；④ 写清是「编入索引 → 网页」报告，不是站点地图。Word 已重出。
- 测试：`npm test` 443/443。

## 追加：甲方发来的四份 AI 回答（任务表 25 行）
读完 kimi / grok / gemini / gpt 四份。都是“整份题库交给 AI 写问答稿”，AI 事先知道我们，**不是基线**。整理在 `docs/geo/results/2026-09-28-first-pass-not-baseline.md`：AI 对我们的说法逐条对照官网（读过官网的 GPT、Kimi 引用的具体事实几乎全对；“满足 ANSI 和 CE”“推杠 660–1200 mm”“广州集团”等错话官网里没有来源，站内不改）；AI 点名的竞品和产业带列表（只作内部参考，不上官网）。runbook ③ 改成一题一问、无痕窗口、只贴问题、截图发回的做法，Word 已重出。
