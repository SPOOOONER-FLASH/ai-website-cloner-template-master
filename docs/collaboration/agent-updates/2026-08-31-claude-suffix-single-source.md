# claude — 后缀码统一口径；MB 确认；发现 28 个 Finish 行自相矛盾

| | |
|---|---|
| 范围 | 新增 `docs/collaboration/tasks/model-suffix-codes.md` 与 `suffix-finish-contradictions.json`；HANDOFF 第八·六节改为指向它 |
| 结果 | 三个 agent 一份口径；MB 升为 A 级证据；28 个数据 bug 列成可执行清单 |
| 测试 | lint ✅ `npm test` 114/114 ✅ |
| 未触碰 | 任何产品 JSON、任何图片、`out/` |

## 1. 为什么不是继续写在 HANDOFF 里

Codex 一直没修 MB，不是因为不想修，是因为**它没有一个能判断「可以动手了」的标准**。
HANDOFF 第八·六节是散文加一张证据表，读起来像笔记，不像验收条件。

所以这份把证据分成两级，只有两级：

- **A · 记录自证** —— 某个带该后缀的产品，自己的 Finish 字段就写着这个词。
- **B · 甲方口头** —— 有日期的微信/邮件确认。

**两级之外一律留空。** 不要发明第三级，不要用「看起来像」。

## 2. MB 是 A 级，可以动手了

`564 MB` 自己的 Finish 字段写着 **`Matt black`**。这和当初确立 `PB=Polish Brass`
所依据的 `6094 PBBK` 是完全一样的证据。MB 不再是待确认项。

## 3. 顺手炸出来的：28 个型号的 Finish 行和自己的后缀矛盾

| 型号 | 后缀说 | Finish 行却写着 |
|---|---|---|
| `70MB` | 哑光黑 | PB. CP. SS. SC. AB. AC —— **清单里根本没有黑色** |
| `587 MBET` | 哑光黑 | Satin nickel, chrome, antique brass, polished brass, all available |
| `65SN` / `70SN` | 缎面镍 | PB. CP. SS. SC. AB. AC |
| `45BN` | 黑镍 | PB. CP. SS. SC. AB. AC |

**这是玻璃门拉手 300mm 的同一类事故** —— 一份系列级的可选清单被复制到每个变体上，
把变体自己的表面处理挤掉了。完整 28 条在 `suffix-finish-contradictions.json`，
每条带 slug、现有 Finish 行、首图与全部 gallery 路径。

⚠ **这份不是「照着改」的清单。** 28 条里可能有后缀本身标错的，
而且甲方手选过一部分首图。必须逐条确认。

## 4. 分工建议（不是指派）

| 步骤 | 谁 | 依据 |
|---|---|---|
| Finish 字段值 | Claude | AGENTS.md：`content/**` |
| 首图选择 | **Codex** | AGENTS.md：editorial imagery |

流程：Claude 出 dry-run 对照表（后缀 → 应有 Finish → 现有 Finish → 候选图片文件是否存在）
→ Codex 逐条核对图片决定首图 → 谁先完谁先提交，另一位在其之上补。
不要互相等。

## 5. 为什么这件事的优先级比它看起来高

产品页的 JSON-LD `additionalProperty` **直接由规格表生成**
（`src/components/site/JsonLd.tsx:166`，西语走 `specsEs`）。

所以 Finish 行不是「页面上多一行字」，它是 AI 被问到「有没有黑色的」时
**唯一能引用的结构化字段**。同理，今天写进去的 8 组图纸尺寸，
下次构建后会让 9003E 的 PropertyValue 从 3 条变成 9 条。

**这个站的 GEO 瓶颈是规格表的空格，不是文案。**
