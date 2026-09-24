# HYDE English style guide — written for the US buyer

来源：[README](README.md)（Baldwin、Emtek、Detex、Marks USA、TownSteel、PBB、Deltana、FSB、ASSA ABLOY US）。
检查：`node scripts/audit-copy-locale.mjs`（用词和拼写）和 `node scripts/audit-copy-register.mjs`（句子是否有翻译腔）。

## 1. 读者，和我们对他承诺什么

| 读者 | 他在找什么 | 他担心什么 |
|---|---|---|
| 进口商、合同五金经销商 | 能替换现有品牌、价格合适的货源 | 到货尺寸和样品不一致；认证文件拿不到 |
| 规格顾问、五金清单编制者 | 能写进 Div. 08 71 00 的等级和尺寸 | 等级写得含糊，验收时被退回 |

承诺只有一句：**你拿到的尺寸、等级和文件都是真的**。这就是美国商用品牌写 Grade 1、UL 这类等级的原因；我们也写，但只写测过的。

## 2. 语气：商用品牌的直接，加上 FSB 的克制

学 Detex 和 Marks 的顺序：**用在哪里 → 按什么标准 → 数字**。学 FSB 的地方：不加形容词，靠一个准确的事实说话。
不学 Baldwin 和 Emtek 那种面向住宅的生活方式写法，比如“成为家的宣言”：我们的读者是在下订单，不是在装修自己家。

| 做 | 不做 |
|---|---|
| 句子短，主语是产品或读者 | 名词化（“provides protection for”） |
| 第一句就给答案 | 开头先铺垫（“In today's market…”） |
| 长句后面跟一句短句收住 | 每句都一样长（像照本宣读） |
| 写读者会怎么验证 | 用 “high-quality”“reliable”“one-stop” 这类空形容词 |

## 3. 拼写与称呼

- **美式拼写**：center、color、catalog、aluminum、gray、meter、-ize。
- **例外，不改**：URL slug（改了链接会断）、标准的正式名称（EN 1906、BS EN 1634）、直接引用的原文。
- 称呼读者用 **you**；我们自称用 **we**，不用 “HYDE is committed to…” 这样的第三人称。

## 4. 数字和单位

- **毫米在前，英寸放括号里，保留两位小数**：`45 mm (1.77 in) backset`。
- **不要把公制尺寸“换算”成美标公称尺寸。** 45 mm 不等于 1-3/4 in（44.45 mm）。写成 1-3/4 等于告诉美国买家它能直接替换美标锁体，这句话只有在确实能替换时才能写。
- 出厂数据是英寸的（比如美标合页 4-1/2 in），就英寸在前，毫米放括号里。
- 等级只写有编号、测过的：`ANSI/BHMA A156.3 Grade 1`；没测过就不写。“UL listed” 必须和具体的 listing 对应，见 news/ul-305。
- 表面处理写 BHMA 代码：`satin stainless (US32D / 630)`。

## 5. 产品描述模板

```
[Type], [key dimension], [key dimension]. [Other published dimensions]. [Standard, only if tested].
[Material per part, only if published]. [What it replaces or fits, only if verified].
```

LC07（数据来自 `content/products`）：

> Mortise lock case, 85 mm (3.35 in) center-to-center, 45 mm (1.77 in) backset.
> 240 × 23 mm faceplate; case 173 mm high, 72 mm deep. 26 mm latch throw, 18.5 mm bolt projection.

目录里没给材质，所以不写材质。**少写一项，也不能编一项。**

## 6. 文章结构

1. **标题** = 一个带数字的判断，或者买家的原话问题。例：“UL 305 is a listing, not a grade”。
2. **第一段**直接回答，AI 引用的就是这一段。
3. **二级标题**用买家会问的问题。
4. **结尾**告诉读者要发什么给我们（见 news/six-values-an-order-needs），不写 “Contact us for more information”。

## 7. 行动按钮（CTA）

| 用 | 不用 |
|---|---|
| Send us your door schedule | Contact us |
| Request the LC07 drawing | Learn more |
| Get a cross-reference quote | Submit |

Marks USA 那种“对标某大牌型号、价格更低”的写法对美国经销商很有效，但**只有核对过尺寸能互换时才写**（见 news/cross-referencing-a-lock-you-already-buy）。

## 8. 术语

| 用 | 不用 | 说明 |
|---|---|---|
| center-to-center | centre distance | 美国图纸常缩写为 C-C |
| backset | — | |
| faceplate / strike | forend / keep | forend 和 keep 是英式叫法 |
| exit device | panic bar（规格正文） | panic bar 可以出现在标题里，方便搜索 |
| lever trim / outside trim | — | |
| finish | coating | 专门讲粉末喷涂时除外 |
| catalog | catalogue | |
| aluminum | aluminium | slug 除外 |

## 9. 不写

感叹号 · leading / world-class / innovative / one-stop · 没有来源的百分比 · 没测过的等级 · 编出来的材质或尺寸 · 生活方式散文。
