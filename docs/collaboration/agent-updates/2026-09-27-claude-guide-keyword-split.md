# 2026-09-27 · Claude（工程）· 5 对文章 seoTitle 分流

**来源**：文案会话的建议 `docs/copy/guide-keyword-split.md`，数据 `scripts/audit-guide-keywords.mjs`。可见标题不动（归文案），只改 seoTitle（归工程）。

**改了 6 篇 × 10 语种**（`content/news/*.json` 的 seoTitle/Es/Pt，`content/i18n/<7 语种>/news.json` 的 seoTitle）：

| 文章 | 新 seoTitle（英） | 让给 |
|---|---|---|
| choosing-a-cylindrical-lock… | Entrance, Privacy or Passage: Cylindrical Lock Functions | Backset / Door Thickness 归 backset-door-thickness-chart |
| stainless-steel-grades-304-201-316 | Which Stainless Grade Were You Quoted? 304, 201 or 316 | "vs" 句式归 stainless-grade-selection |
| euro-cylinder-length-and-split | Euro Cylinder Length vs Split: What 30/40 Means | "Size" 归 euro-cylinder-size-chart |
| mortise-lock-backset-and-centre-distance-guide | How to Read a Mortise Lock Case Number | backset chart 归 mortise-lock-case-comparison |
| en-1125-or-ansi… | EN 1125 or ANSI: Which Standard Your Project Needs | 不再用 "vs … Exit Device" |
| ansi-grade-1-vs-en-1125… | ANSI Grade 1 vs EN 1125 Exit Devices: Grades Compared | PT 原来和上一篇同句「qual norma a sua obra exige」，改成等级对比 |

**结果**：重跑审计，≥0.7 的从 5 对降到 1 对（钢种那对 0.71，两篇都必须写 201/304/316 三个数字，属正常）。`docs/copy/guide-keyword-overlap.md` 已重新生成。`npm test` 406 通过。

**没动**：seoDescription（en-1125-or-ansi 和 ansi-grade-1 的描述里仍都提到"按国家选"，下一轮可再分）；/euro-cylinder-calculator 的 metadata 记为目标清单 #71。

**上线**：下一次 release:hyde，purge 后 `npm run seo:indexnow:release`。
