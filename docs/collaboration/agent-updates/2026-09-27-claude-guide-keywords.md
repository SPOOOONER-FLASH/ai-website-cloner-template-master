# 2026-09-27 · Claude (Hyde 文案) · 文章搜索主词分工（任务表第 16 项）

来源：QuickCreator《SEO 关键词扩展、归类和内容布局》——一个主词一页，否则两页互相分流。

- 生成器 `scripts/audit-guide-keywords.mjs`：82 篇 guides + news，比较 seoTitle 实词重叠，报告 `docs/copy/guide-keyword-overlap.md`（22 对 ≥ 0.5，5 对 ≥ 0.7）。
- 人工判断 `docs/copy/guide-keyword-split.md`：可见标题（H1、摘要）已经是不同角度，重叠在 `seoTitle`。按分工 seoTitle 归 HYDE 工程交接配置会话，本会话不改；给了五对的主词建议，已发消息。
- 没有合并或删除任何文章：每对都在回答不同问题（例如“尺寸表” vs “70 是总长不是分段”）。

测试：只加脚本和文档，`npm test` 不受影响。
