# 2026-09-24 · Claude · 长尾词纪律 × 文案方案合并

Client: 「我们之前谈的长尾词和现在新写的 md 应该怎么结合」。

- `docs/collaboration/2026-09-24-copy-longtail-multilingual-plan.md` 新增第七节：措辞可以为点击率组合，数字和资质只能照抄；
  标题顺序按品类由查询数据决定；`titles:check` 四条新断言（留给第一阶段实现）；每周 GSC 循环。
- `scripts/build-query-corpus.mjs` 报告末尾新增「按品类：数字型 / 场景型 / 泛称」表，重跑即更新。
- 循环第一条：新闻 master-key-systems… 英文 seoTitle 加「Chart」、描述改为完整句子
  （「master keying system chart」153 展示 / 0 点击 / 排名 7.9）。10-08 左右复查。
- 未动：`scripts/build-product-titles.mjs`、`category-positioning.json`（NOW.md 上 E:/cantonlock-hyde 那一行的）。
- 生效需要 HYDE 发布。
