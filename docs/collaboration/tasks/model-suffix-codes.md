# 型号后缀码 —— 三个 agent 的唯一口径

> 这份取代 `HANDOFF.md` 第八·六节的散文版本。Claude / Codex / Kimi 都读这一份。
> 改动后缀含义必须改这里，不要在别处另起一段。

## 一、证据分级

只有两级，不要发明第三级。

| 级别 | 含义 | 可以拿来做什么 |
|---|---|---|
| **A · 记录自证** | 某个带该后缀的产品，**自己的 Finish 字段**就写着这个词 | 可以直接写入产品数据 |
| **B · 甲方口头** | 甲方微信/邮件确认，记录了日期 | 可以直接写入产品数据 |

没有 A 也没有 B 的，**留空**。不要从「看起来像」推断。

## 二、表面处理码

| 码 | 含义 | 级别 | 证据 |
|---|---|---|---|
| PB | Polished Brass 抛光黄铜 | A | `70710 PB`：Finish = PB=polished brass |
| AB | Antique Brass 仿古黄铜 | A | `70610 AB`：Finish = Antique brass (US5) |
| AC | Antique Copper 仿古铜 | A | `9216 AC`：Finish = Antique copper (US11) |
| SN | Satin Nickel 缎面镍 | A | `56 SN`：Finish = Satin nickel |
| SC | Satin Chrome 缎面铬 | A | `70610 SC`：Finish = SC= Satin chrome |
| SS | Stainless Steel 不锈钢本色 | A | `D101 SS`：Finish = Satin stainless steel (US32D) |
| **MB** | **Matt Black 哑光黑** | **A** | **`564 MB`：Finish = Matt black** ← 2026-08-31 新确认 |
| BN | Black Nickel 黑镍 | A | `9211 BNAC` 目录图例 |
| SSS / PSS | Satin / Polished Stainless | A | `9080E` 目录图例 |
| CP | Chrome Plated 镀铬 | A | 目录图例 |
| SB | Satin Brass 缎面黄铜 | A | 目录图例 |
| W | 白色 | B | 甲方微信 2026-08-27 |
| F | 喷木纹球 | B | 甲方确认 2026-08-28 |
| WL | 白色喷漆球 | B | 甲方确认 2026-08-28 |
| SP | Shiny Polish 抛亮光 | B | 甲方确认 2026-08-28 |

## 三、功能码

| 码 | 含义 | 级别 | 证据 |
|---|---|---|---|
| ET | Entrance Lock 门锁功能 | B | 甲方确认 2026-08-28 |
| PS | Passage Lock 通道功能 | B | 甲方确认 2026-08-28 |
| BK | Privacy Lock 浴室功能 | B | 甲方确认 2026-08-28 |

## 四、⚠ 仍未确认的码 —— 不要猜

出现次数 ≥2、既没有 A 也没有 B 的：`S`(16) `D`(5) `E`(9) `N`(4) `K`(3) `T`(3) `B`(3)。
其中 `S`/`D` 在 `301-S`/`308-D` 这类型号里很可能是 single / double，
但**「很可能」不是证据**。要甲方一句话，一次能解掉 21 个型号。

## 五、⚠ 已发现的数据 bug：28 个型号的 Finish 行和自己的后缀矛盾

清单：**`docs/collaboration/tasks/suffix-finish-contradictions.json`**

这是**玻璃门拉手 300mm 的同一类事故**：Finish 行存的是整个系列的可选清单，
被复制到每一个变体上，于是变体自己的表面处理反而丢了。

最刺眼的两个：

| 型号 | 后缀说 | Finish 行却写着 |
|---|---|---|
| `70MB` | 哑光黑 | PB. CP. SS. SC. AB. AC —— **清单里根本没有黑色** |
| `587 MBET` | 哑光黑 | Satin nickel, chrome, antique brass, polished brass, all available |

**归属**：Finish 字段值 = Claude（`content/**`）；**首图选择 = Codex（editorial imagery）**。
所以流程是：

1. Claude 出 dry-run 对照表（后缀 → 应有 Finish → 现有 Finish → 候选图片文件是否存在）。
2. Codex 逐条核对图片，决定首图。
3. 谁先做完谁先提交，另一位在其之上补。

**不能只凭字符串批量覆盖**：这 28 条里可能有后缀本身就标错的，
而且甲方已经手选过一部分首图，覆盖掉是不可逆的。

## 六、和 SEO / GEO 的关系

产品页的 `additionalProperty`（JSON-LD）**直接由规格表生成**
（`src/components/site/JsonLd.tsx:166`，西语走 `specsEs`）。
所以填一行 Finish 不只是页面上多一行字 —— 它同时进入结构化数据，
是 AI 回答「有没有黑色的」时唯一能引用的东西。
后缀差异化是这个站**投入产出比最高的结构化数据工作**，不是文案工作。
