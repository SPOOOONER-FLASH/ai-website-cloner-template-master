# 三语文案按市场文风重写：计划（2026-09-24，Claude）

甲方指示（2026-09-24）：「搜集美国、拉美（阿根廷、秘鲁、墨西哥）、巴西本地五金建材大公司的真实文案，
写成三份文风指南，再按指南逐篇改写。」

调研和指南：[`docs/copy/style-guides/`](../../copy/style-guides/README.md)。本文件是执行计划，**任务状态以本文件为准**。

## 需要甲方拍板的五件事（定了才动阶段 1）

| # | 问题 | 选项 | Claude 建议 |
|---|---|---|---|
| D1 | 英语改成美式拼写吗？ | 改（centre→center 等，共 620 处）/ 保持英式 | **改**。甲方 09-11 的要求是“像美国公关公司润色过”；URL 不改 |
| D2 | 西语小数用点还是逗号？ | 18.5 mm（墨西哥习惯）/ 18,5 mm（阿根廷习惯） | **点**：和英文数据一致，墨西哥是最大的西语市场 |
| D3 | 英语尺寸哪个在前？ | 毫米在前，英寸放括号 / 英寸在前 | **毫米在前**：零件本来就是公制；英寸放括号，保留两位小数 |
| D4 | 葡语 backset 叫什么？ | distância de broca（Papaiz 的写法）/ 保留现在的 distância do eixo | **distância de broca**，但先请巴西询盘客户 SAGA 看一眼 |
| D5 | 页面文案（不是文章）归谁？ | Claude 负责三语全部页面文字，Codex 管版式 / 维持现状（`src/app/es/**` 归 Codex） | **Claude 负责文字**，否则阶段 4 做不了 |

## 现状（`node scripts/audit-copy-locale.mjs`，2026-09-24）

| 语种 | 问题 | 处数 |
|---|---|---|
| EN | 英式拼写和 -ise 拼法 | 620 |
| ES | manilla / picaporte / cortafuegos（西班牙西语用词） | 321 |
| ES | 小数点和逗号混用 | 56 / 99 |
| PT | 小数用了点（巴西应当用逗号） | 229 |
| PT | 产品摘要只有 4 个词以内 | 207 / 590 |

`audit-copy-register.mjs`（翻译腔）目前只查 news 的英语和西语，**不查 guides，也不查葡语**，阶段 1 补上。

## 阶段

| 阶段 | 内容 | 范围 | 前提 | 每批验收 |
|---|---|---|---|---|
| 0 ✅ | 调研 24 家公司，写三份指南，新增 `audit-copy-locale.mjs` 和 `collect-copy-corpus.mjs` | docs、scripts | — | 本次提交 |
| 1 | **机械统一**：写 `scripts/apply-locale-terms.mjs`（默认只预览；按字段列出改动；只动文章正文等文字字段，不动 slug、型号、标准名）。只做一对一、不看上下文也不会错的替换：美式拼写、manilla→manija、cortafuegos→cortafuego、小数分隔符、registar→registrar。**picaporte 不在这一步改**：它有时指锁舌，有时指执手，要看上下文 | 75 篇 × 3 语 | D1、D2 | 按字段读 diff，locale 审计清零，`npm test` |
| 1b | `audit-copy-register.mjs` 扩到 guides 和葡语，并加 `npm run copy:locale` | scripts | — | 两个审计都能跑 |
| 2 | **逐篇改写**：每批 5 篇。英语先按指南改（标题、第一段、按买家问题写的二级标题、结尾说要发什么）；西语和葡语**照意思重写，不逐句翻译**；picaporte、pestillo、cerrojo 这类词在这一步按上下文改。顺序：locale 审计最差的文件，结合 AI 引用优先级。和现有「≥1,600 词扩写」任务合并做，同一篇不改两次 | 75 篇，15 批 | 阶段 1 | register 和 locale 两个审计、`copy:parity`、`npm test`，然后提交并用 `npm run ship` 推送 |
| 3 | **产品摘要**：写生成器，从已发布的规格行重新组装葡语摘要（Papaiz 句式）；英语摘要改美式拼写。**不跑** `translate-products-es.mjs` 全量（见 AGENTS.md 的规定） | `content/products`，590 条 | D1、D4 | 按字段 diff；公告雷茵（产品库是两站共用的，雷茵英文站也会显示英语摘要） |
| 4 | **页面文案**：首页、产品、公司、联系、CTA，三语 | `src/app/(en)`、`es`、`pt` | D5 | impeccable 的检测、`npm run check` |
| 5 | 发布 | `out/` | 持有 HYDE 发布棒 | `npm run release:hyde`，然后提醒甲方 purge |

## 需要本地人确认的术语（先不批量替换）

西语：backset（entrada 还是 distancia al eje）、strike（cerradero 还是 hembra）、阿根廷是否通用 manija。
葡语：backset（D4）。
来源：甲方在拉美和巴西的现有客户（例如 SAGA Portas），一人看一页词表就够了。

## 边界

- 雷茵那一侧不动。`content/products` 是两站共用的，改了要在 agent-update 里公告。
- 竞品原文只进 `tmp/claude-copy-corpus/`（已 gitignore），不进仓库，也不上页面。
- 不编造任何尺寸、材质、等级或年份。目录里没有的，就不写。
