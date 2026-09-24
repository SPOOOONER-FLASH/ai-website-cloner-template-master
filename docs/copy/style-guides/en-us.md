# 英语（美国）市场补充：写给美国进口商和规格顾问

**本文件只是补充。** 总声音（“一位把数字说清楚的工厂工程师”）见 `docs/collaboration/2026-09-24-copy-longtail-multilingual-plan.md` 第二节；每种语言怎么落地、拼写和行业叫法见 `docs/collaboration/2026-09-24-voice-en-es-pt.md`。两处和本文件不一致时，**以那两份为准**。
本文件只补 [README](README.md) 那批美国公司（Baldwin、Emtek、Detex、Marks USA、TownSteel、PBB、Deltana）身上学到、那两份还没写的东西。

## 1. 读者，和我们对他承诺什么

| 读者 | 他在找什么 | 他担心什么 |
|---|---|---|
| 进口商、合同五金经销商 | 能替换现有品牌、价格合适的货源 | 到货尺寸和样品不一致；文件拿不到 |
| 规格顾问、五金清单编制者 | 能写进 Div. 08 71 00 的尺寸 | 描述含糊，验收时被退回 |

承诺：**你拿到的尺寸和文件都是真的**。美国商用品牌写 Grade 1、UL，是因为它们有证书；我们没有，就不写，也不写“符合”（见 voice 文件）。

## 2. 从美国商用品牌学什么

| 学什么 | 谁在这么写 | 怎么用到 HYDE |
|---|---|---|
| 先写**用在哪里**，再写数字 | Detex 按门类（木门、钢门、铝门）列系列 | 产品和文章先写适用的门和开口，再写尺寸 |
| **对标**现有型号 | Marks USA 写“和某大牌某型号同样耐用，价格更低” | 只在核对过尺寸能互换时写，见 news/cross-referencing-a-lock-you-already-buy |
| 给规格顾问准备的文件 | Detex 放 CSI 三段式规格书和“给规格顾问的说明” | 下载区可以按 Section 08 71 00 的格式整理 |
| 行动按钮写具体的事 | TownSteel 的按钮是“开始写规格” | 见第 4 节 |

## 3. 不学什么

- Baldwin、Emtek 面向住宅的生活方式写法（“成为家的宣言”“为你而设计”）：我们的读者在下订单，不是在装修自己家。
- “Industry-leading”“high-quality”：Detex、Baldwin、Deltana 的首页都这么写，谁写都一样，读者读不到任何信息。

## 4. 行动按钮（CTA）

| 用 | 不用 |
|---|---|
| Send us your door schedule | Contact us |
| Request the LC07 drawing | Learn more |
| Get a cross-reference quote | Submit |

## 5. 尺寸：一条提醒

英寸由 `src/lib/imperial.ts` 在渲染时自动加上：毫米在前，英寸取最接近的 1/16"。所以 45 mm 会显示成 `45mm (1-3/4")`。
**换算不等于能互换。** 1-3/4" 是 44.45 mm，比我们的 45 mm 小 0.55 mm。文章里要写“能替换某个美标件”，得先核对实物尺寸，不能凭括号里的英寸推断。
