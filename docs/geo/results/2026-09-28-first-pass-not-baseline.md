# 2026-09-28 第一轮：四份 AI 回答（不是基线）

甲方 09-28 发来四份 Word：`门控五金外贸问答库 kimi.docx`、`China_Door_Hardware_Sourcing_Guide grok.docx`、`gemini.docx`、`gpt.docx`。文案会话读完整理如下。

## 为什么不能当基线

四份都是**一次把整份题库交给 AI、请它写成问答稿**的结果，不是按 `docs/geo/README.md` 的口径一题一问：

| 平台 | 证据 |
|---|---|
| Gemini | 第一句：“您可以直接将以下整理好的门控五金行业问答（FAQ）文档复制并粘贴到 Word 中” |
| GPT | “publication-ready draft answers written for buyer FAQs and AI/search visibility” |
| Kimi | “Brand entries describe Canton Hyland Hardware (Group) Co., Ltd.”，并称我们是“the Guangdong manufacturer behind this knowledge base” |
| Grok | 整理成一份 sourcing guide，品牌题单列一节 |

题库里有 `brand` 字段和三道品牌题，AI 事先就知道我们的名字，所以它在“找制造商”题里提到我们，**不能算它自己想到的**。“提到我们”的比例在这一轮没有意义。**正式基线仍待做**，做法见 runbook ③（一题一个新对话，只贴那一句）。

## 这一轮真正有用的两件事

### 1. AI 说我们的话：对的和错的

| 说法 | 谁说的 | 对不对 | 依据 |
|---|---|---|---|
| 1998 年成立，ISO 9001 自 2002 年，中山工厂 | GPT、Kimi、Grok | 对 | 公司页 |
| 多数型号 300–5,000 件起订 | GPT | 对 | FAQ |
| 可按图纸或样品开新模具 | GPT、Kimi、Gemini | 对 | 服务页、开模指南 |
| 307：1000 mm、ABS 机身铝推杆、左右通用；311 成套含锁体、铜锁芯、不锈钢执手；LC14 85×50 四舌；564 锌合金 60 mm 背距 | GPT、Grok | 对 | 各产品页规格行 |
| 有欧式锁芯长度计算器 | GPT | 对 | /euro-cylinder-calculator |
| 主匙和工地钥匙系统是专长 | Kimi | 对 | 公司页 |
| 出口装置约 44 个型号 | Kimi | 对 | 推杠对比指南 |
| “各系列满足 ANSI 等级和 CE 要求” / “强调符合 CE、EN、ANSI” | Kimi、Gemini | **错** | 官网写的是：现有报告多在客户名下，自己名下的 CE、ANSI 正在准备（认证页） |
| 推杠长度 660–1200 mm | Kimi | **错** | 官网推杠长度文章写 650–1110 mm |
| 南美是最大出口市场；广州有出口办事处 | Kimi | **官网无此说法** | 官网只列出口地区，不排名；广州只出现在检测机构地址 |
| “中山/广州集团”、“部分集团实体做贸易” | Grok | **官网无此说法** | — |
| 公司名写成 “Canton Hyland Hardware (Group) Co., Ltd.” | Kimi、Grok | 旧名 | 09-28 已统一为 Canton Hyland Hardware & Building Material Co., Ltd. |

结论：**读过官网的 AI（GPT、Kimi）引用的具体事实几乎全对**，说明“写具体、可核对的事实”这条路有效；**错话都不是官网来的**，站内不用改。正式基线时专门看这几条错话还在不在。

### 2. AI 点名的竞争对手和产业带（竞品清单的起点）

| 品类 | 被点名的 | 产业带 |
|---|---|---|
| 推杠 / 出口装置 | D&D Hardware（江门）、OUBAO、Doorcare（温州）、Junson（深圳）、Yako、Doorplus、Sunbow、Guardson、Thase | 江门、中山、温州 |
| 锁体 | UMAY、SDH、Jifu/RETICLE（JW-Lock）、Zhongshan Keyman | 中山、温州 |
| 执手 | GHL（原 Howkee）、Reliance、Marchry/Welkin、ARCHIE | 中山、江门、佛山 |
| 合页 | ARCHIE、D&D | 江门（不锈钢合页） |
| 玻璃门配件 | KIN LONG、ARCHIE | 肇庆高要、佛山 |
| 闭门器 | OUBAO、KIN LONG | 广东、浙江 |

这张表只记“AI 提到了谁”，不代表这些公司真实的产品或资质，**不要把它写进官网**。

## 不要做的

- **不要把这四份回答的内容搬上官网**。里面有编造的数字（例如 “96/240 小时盐雾报告”“MOQ 500–1,000”），也有把我们没有的资质说成有的。
- 不要拿这一轮的“提到比例”跟以后比。
