# 文章搜索主词分工

数据：`docs/copy/guide-keyword-overlap.md`（由 `node scripts/audit-guide-keywords.mjs --write` 生成）。本文件是人工判断。

## 文案会话的判断和建议（2026-09-27）

可见标题（H1）已经各答各的问题，重叠主要在 `seoTitle`。`seoTitle*` 归 HYDE 工程交接配置会话，以下是给它的建议主词：

| 页面 A（主词） | 页面 B（主词） | 建议 |
|---|---|---|
| cylindrical-and-tubular-lock-comparison：cylindrical vs tubular lock | choosing-a-cylindrical-lock…：entrance / privacy / passage lock function | B 的 seoTitle 以功能开头，去掉 Backset、Door Thickness（这两个词归 backset-door-thickness-chart） |
| stainless-grade-selection：201 vs 304 vs 316 stainless（选材和成本） | stainless-steel-grades-304-201-316：how to tell which stainless grade you were quoted | B 的 seoTitle 改成“怎么认出报价里的钢种”，不再用 “vs” 句式 |
| euro-cylinder-size-chart：euro cylinder size chart | euro-cylinder-length-and-split：euro cylinder split 30/40 meaning | B 的 seoTitle 去掉 “Size”，改为读型号：总长 vs 分段 |
| mortise-lock-case-comparison：mortise lock case backset chart | mortise-lock-backset-and-centre-distance-guide：how to read a mortise lock case number | B 的 seoTitle 以 “How to read a mortise lock case number” 开头 |
| en-1125-or-ansi…：EN 1125 or ANSI, by project market | ansi-grade-1-vs-en-1125…：ANSI Grade 1 vs EN 1125 exit devices | 两篇最接近：A 保留“按项目所在市场选标准”，B 保留“等级对比”，两篇 seoTitle 不要同时出现 “vs … Exit Device” |

其余 ≥0.5 的对（EN/ANSI 交叉表 vs 循环测试、推杠对比 vs 推杠长度等）主题本来就不同，不动。
