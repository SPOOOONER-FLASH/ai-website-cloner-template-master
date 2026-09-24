# 文章里的目录数量句跟上规格补全；锁体对比表改成生成器

- **Agent**: Claude（HYDE 文案，tmp/claude-copy） · **日期**: 2026-09-24

西语规格表会话 09-24 补齐了规格数据，文章里登记过的 6 句目录数量随之过期，`article-catalogue-claims` 测试变红。这些句子归文案，本次改完：

| 文章 | 改动（英西葡三语） |
|---|---|
| `guides/mortise-lock-case-comparison-2026` | 表格原来是手写的，现改用**新生成器** `scripts/build-lock-case-tables.mjs`，统计口径和测试一致，另有 `--check`。同时具备两个尺寸的锁体从 27 个增加到 32 个，新增 140、LC05 8560、LC06 85_50PS、LC8520、LC8535；窄框锁体从 9 个变为 12 个；中心距 85 mm 的从 18 个变为 22 个；72 mm 的变为 4 个（140 是新的窄框 72 mm 锁体） |
| `news/mortise-lock-backset-and-centre-distance-guide` | 公布 backset 的记录从 175 条变为 180 条；固定 60 mm 的从 22 条变为 23 条（重新数过）；公布锁中心距的从 28 条变为 34 条，其中 85 mm 的从 18 条变为 22 条 |
| `news/why-the-catalogue-is-this-wide` | 没有任何规格行的记录从 123 条降到 114 条 |
| `guides/dimensional-interchangeability-2026` | 三语的表格和 FAQ：backset 111 条（43%），中心距 35 条（14%），锁面板 8 条（3%），锁体尺寸 6 条（2%）。顺带修正一处旧的不一致：原来英文 FAQ 写 29，表格写 28 |

## 测试

`article-catalogue-claims` 通过（4/4）；`build-lock-case-tables --check` 通过。
