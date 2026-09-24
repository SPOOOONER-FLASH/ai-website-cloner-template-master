# 栏目文案第一轮：说明书口吻改为有立场的声音；甲方答复 A–E 记录在案

- **Agent**: Claude（HYDE 文案，tmp/claude-copy） · **日期**: 2026-09-24

甲方：「所有介绍都没有人味……太指示性……不像 PR 过的，就是机器的指令……FSB 写得有风格、格调、立场、有态度。」

| 改动 | 说明 |
|---|---|
| `docs/copy/style-guides/section-voice.md`（新） | 拆解 FSB 每个栏目的写法：标题 = 名称 + 一句态度，导语 = 立场 → 事实 → 对读者意味着什么，链接配一句特点。定下 HYDE 的立场：“盒子上常是客户的牌子，里面的零件是我们的；第十柜要和样品一样”，依据是已公开的 1998 年创立、2002 年起 ISO 9001、出口 OEM。七条规则，附改写前后对照；另附雷茵“品质与认证”栏目的改写建议，仅供雷茵会话参考 |
| 首页（`home.ts` / `home-es.ts` / `home-pt.ts`） | 三张品类卡、主推系列、项目、材料、服务栏重写。**删掉两条不实说法**：英文项目栏写了地弹簧（地弹簧只在雷茵上架），还有查不到出处的“三十多个出口市场”。服务栏按甲方答复 A 写：按客户的图纸或样品开新模具；设计碰到别人的专利，就改配件或外观，改到不再冲突。去掉照抄 FSB 的标题 *Projects – Where Canton Hyland Takes Shape*。葡语清掉葡萄牙用词 *libertam*、*gama*、*planeamento* |
| 产品页（`products-architecture.ts`） | 导语、品类导语、品牌段、故事段三语重写。**更正两处事实**：推杠家族原写“push 和 touch 两种”，实际 42 款全是 push 型；门控原写“隐藏式地弹簧”，改为按门扇重量和宽度选的明装闭门器 |
| 产品查找（三语 page.tsx）、配置器（`ConfiguratorTeaser` / `ConfiguratorIntro`） | 删掉讲界面运作的句子（筛选叠加、计数刷新、地址栏、“不会得到空结果”），改为说明读者会得到什么；按钮 *Open the configurator* 改为 *Find my model*；三句否定并成一句 *No sign-up.*；“我们制造”一律写成“我们供应”（supply / suministramos / fornecemos），不在工具页上扩大制造声明 |
| `tasks/2026-09-24-copy-style-rewrite.md` | 记下甲方对 A、B、C、D、E 的答复，以及按顺序排好的没做完清单（共 10 项） |

## 测试

`npm run typecheck` 通过；`normalize-regional-terms` 无改动；`npm test` 只有 1 项失败：`us-spelling` 报 `content/i18n/zh-terms.json` 有英式拼写。这个文件来自雷茵 p81 提交 `5f17f81b4b6`，本次没有碰它，按雷茵分界不改，已转告工程会话。本次只改了文字字符串，没有动标记和样式，所以没有跑 impeccable 检测。

## 下一步

待办 2–4：OEM 服务页、认证页、联系页和询盘页，按甲方答复 A、B、C 写。
