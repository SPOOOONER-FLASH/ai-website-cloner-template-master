# HYDE 三语文案：B 端方向、转化和逐篇改写（2026-09-24，Claude）

甲方 09-24：
- 「老板说的“让买家睡得安稳”是让买家认为我们工厂专业、资深，OEM 质量好、价格合适……不是消费端晚上不会进贼」
- 「我们实际上是 B2B……主要是做 OEM 贴牌」
- 「D2 交给你，开始逐篇改写，西语葡语，把文档改过来，由你负责而不是 codex，codex 以后只负责生图和视觉」

方向和真实买家：[`docs/copy/style-guides/README.md`](../../copy/style-guides/README.md)。分工：AGENTS.md「Who owns what」和 `2026-09-24-division-of-labour.md`（09-24 已改）。

## 一、对今早“ChatGPT 为什么把人送到具体产品页”那份分析的意见

**同意**它的四条：先补被 AI 引流的产品页；继续写横评；补齐 7 个采购问题的答案；每次发布后跑 IndexNow（这条归工程会话）。
**再加五条**，全部来自 Serraller 和 SAGA 真实问过的问题：

| # | 做什么 | 为什么 | 缺什么 |
|---|---|---|---|
| A | **一页 OEM / 贴牌说明**（英西葡三语）：能换什么（标签、说明书语种、包装、颜色、方轴 8 或 9 mm），不能换什么，起订量，打样流程 | Serraller 第一封信问的全是这些；这页是询盘前的最后一步 | 甲方给清单：哪些能定制、起订量、打样周期 |
| B | **如实写认证现状** | 他问“有没有有效的 CE”。答得含糊，比坦白说“测试报告在客户名下，我们自己名下的正在做”更伤信任 | **甲方定对外措辞**，这一条不能由我起草了就上线 |
| C | **写明交易路径**：阿里巴巴平台或直接交易 | Serraller 是阿里巴巴老客户，平台担保能降低第一单的风险 | 甲方确认可以公开写 |
| D | **双开防火门成套配置**文章（推杠 + 执手 + 顺序器 + 闭门器），三语，直接链到型号 | Serraller 的 7 项订单就是这一套 | 无，用现有型号就能写 |
| E | **葡语 NBR 11742 / AVCB 解释文**：讲清验收查什么，不声称我们的产品符合 | SAGA 的日常工作就围绕这两个词 | 无 |

## 二、逐篇改写（西语、葡语）

**顺序**：先改和真实买家相关的，再按 Search Console 的机会清单改。每批 3 篇，改完推送一批。

| 批次 | 文章 | 为什么先改 |
|---|---|---|
| 1 | `news/door-coordinator-double-fire-door`、`news/push-bar-or-touch-bar-panic-exit-devices`、`guides/spindle-sizes-and-length-2026` | Serraller 订的正是推杠和顺序器，问的正是方轴尺寸 |
| 2 | `guides/en-1125-vs-en-179-2026`、`guides/fire-door-hardware-what-must-be-rated-2026`、`news/trim-handle-or-panic-bar` | 西班牙和巴西的防火门买家 |
| 3 | `news/master-key-systems-how-many-levels-you-need`、`news/mortise-lock-backset-and-centre-distance-guide`、`guides/mortise-lock-case-comparison-2026` | 机会清单第一名（243 次展示），以及被 AI 引用的 LC04 相关页 |
| 之后 | 其余文章按机会清单，每周重排一次 | |

**每篇的改法**：

1. 读英文，弄清每段在说什么。
2. 西语和葡语**按意思重写，不逐句翻译**。按市场补充：先写兼容尺寸，写成套配置，不写消费端的话；西语第一次出现的关键零件加西班牙说法括注（等 D1 定了再批量做）。
3. **不动** `seoTitle*` / `seoDescription*`（归工程会话）、型号、数字、标准编号。
4. 验收：`npm test`（包括地区用语、美式拼写、文章数量和型号的测试）、`node scripts/audit-copy-register.mjs`、`npm run copy:parity`，然后提交，用 `npm run ship` 推送。

## 三、待甲方决定或提供

| # | 事项 |
|---|---|
| D1 | 西语：锁舌用 **pestillo**，死舌用 **cerrojo**，不再用 picaporte；执手写 manija，第一次出现括注 manilla。理由见 es-latam.md 第 2 节。同意的话，我和工程会话一起改规则和测试 |
| F1 | OEM 能定制的项目清单、起订量、打样周期（用于 A） |
| F2 | 认证现状的对外措辞（用于 B） |
| F3 | 能不能在网站上写“可以走阿里巴巴平台下单”（用于 C） |

## 边界

- 雷茵那一侧不动。`content/products` 是两站共用的，改了要在 agent-update 里公告。
- 不编造任何尺寸、材质、认证或年份。
