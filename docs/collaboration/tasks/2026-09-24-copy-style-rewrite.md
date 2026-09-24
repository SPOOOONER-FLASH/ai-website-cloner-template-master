# 市场文风调研：新增的待办和待决（2026-09-24，Claude）

甲方指示（2026-09-24）：「搜集美国、拉美（阿根廷、秘鲁、墨西哥）、巴西本地五金建材大公司的真实文案，
写成三份文风指南，再按指南逐篇改写。」

**执行顺序不在这里。** 逐篇改写按总方案 `docs/collaboration/2026-09-24-copy-longtail-multilingual-plan.md`
第 7.5 节的 GSC 循环走（展示多、点击少的先改），每篇三种语言一起改。本文件只列这次调研**新增**的事。
调研和指南见 [`docs/copy/style-guides/`](../../copy/style-guides/README.md)。

## 待甲方决定

| # | 问题 | 选项 | Claude 建议 |
|---|---|---|---|
| D1 | 西语 picaporte 要不要换？现在 106 处，指锁舌；在阿根廷口语里它指执手 | A. 保持 / B. 改成 pestillo | **B**，但先找一位阿根廷买家确认；pestillo 在一些段落里被当作 deadbolt 用，要逐处读，不能批量替换 |
| D2 | 西语页面文案（`src/app/es/**`，分工表上归 Codex）的**文字**，要不要按指南由 Claude 改？ | Claude 改文字，Codex 管版式 / 维持现状 | **Claude 改文字**；文章已经归 Claude（09-23） |

葡语 backset 叫什么（distância de broca 还是 distância ao eixo），voice 文件已经定为先问巴西买家，这里不重复列。

## 新增待办（小，按顺序）

| # | 内容 | 位置 | 验收 |
|---|---|---|---|
| 1 | 在 `normalize-regional-terms.mjs` 加 `cortafuegos → cortafuego`（voice 文件已定，还剩 21 处） | scripts、content | 脚本默认只报告；按字段读 diff 后再加 `--write`；测试守住 |
| 2 | 在 `normalize-us-spelling.mjs` 的词表里补上还剩的英式拼法：tonnes、labour、recognised、authorisation、normalising、stabilises | scripts、content | `--check` 通过 |
| 3 | 葡语 4 处 tens（tu 的动词形式），看上下文改 | content | 人工读过 |
| 4 | 葡语短摘要生成器按 Papaiz 句式组装（总方案 A 阶段“补齐葡语短摘要”那一项） | 产品层 | 见 `docs/copy/style-guides/pt-br.md` 第 2 节 |
| 5 | 逐篇改写时，每篇对照对应市场的指南补充（用法先行、按部件写材质、行动按钮写具体的事、不写行业领导者） | 文章 | 总方案的验收 |

## 边界

- 雷茵那一侧不动。`content/products` 是两站共用的，改了要在 agent-update 里公告。
- 竞品原文只进 `tmp/claude-copy-corpus/`（已 gitignore），不进仓库，也不上页面。
