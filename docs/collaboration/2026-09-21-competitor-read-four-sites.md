# 读了四个对手，结论和出发时的假设相反

**agent**: Claude · **日期**: 2026-09-21 · 依据：`docs/research/clarity-opportunities.json`（9 个主题 / 29 个机会簇 / 147 个域名）

选这四个的理由是优先级排序 —— **出现主题数 × 我们在那些主题上的弱势**。
一个只出现在我们排第 1 的主题里的域名，读它学不到东西。

| 域名 | 出现在我们哪些主题 | 我们在那里的成绩 |
|---|---|---|
| `securityparts.com` | Euro / Door / **Lock** / Architectural | Lock **#34** |
| `doorwaysplus.com` | Euro / Exit / Architectural / International | Exit #7 |
| `usmadesupply.com` | Exit / **Documentation** / International | Documentation **0%** |
| `snrida.com` | **OEM** / **Documentation** | OEM #27，Documentation **0%** |

---

## 出发时的假设：我们缺内容。**错了。**

四个里有三个的"优势内容"我们其实已经有，而且写得更细：

| 他们回答的 | 我们的对应物 | 谁更具体 |
|---|---|---|
| doorwaysplus《Rim Exit Devices: Spec & Select》讲推杆长度按门宽分四档 | `/news/exit-device-push-bar-length/`《650 to 1110mm: Which Push Bar Length Your Door Takes》，**46 处毫米尺寸** | **我们** |
| snrida 的 "Available Certificates / Test Reports"，正文写着"文件范围按项目逐个评估" | `/news/what-documents-you-can-actually-get/`《Cutsheets, CAD and BIM: What We Have and What We Do Not》 | **我们**（他们一个具体文件名都没给） |
| securityparts 的 Brand→Series→Model 三步查型号 | `/model-lookup/`，今天刚上，589 个型号静态链接 | 打平 |

**所以问题不是没内容。** 逐条对比之后，差别是三件很具体的事。

---

## 差别一：我们的技术文章**只有公制，一个英寸都没有**

实测四篇被引用最多的技术文章：

```
exit-device-push-bar-length                     mm  46  |  inch 0  |  AFF 0
mortise-lock-backset-and-centre-distance-guide  mm 116  |  inch 0  |  AFF 0
finish-codes-us26d-626-630                      mm   0  |  inch 0  |  AFF 0
what-documents-you-can-actually-get             mm  12  |  inch 0  |  AFF 0
```

**零。** 而我们输掉的那些机会簇，榜上的域名是什么样子：

- `Push bar sizing requirements` —— usglassmag.com、allegion.com、usmadesupply.com、**fairfaxcounty.gov**
- doorwaysplus 同一个问题的答案："four stock rail sizes covering roughly **24 to 48 inches** wide"、
  "a 36-inch door typically calls for the rail size covering **33 to 36 inches**"、
  "wide stile devices require a minimum stile width — typically around **4-1/2 inches**"、
  "centerline height — typically **41 inches above finished floor**，elementary schools 用 **38 inches**"

一个用英寸提问的买家（或者一个在回答英寸语境问题的引擎），够不到一篇只有毫米的文章。
**我们赢的那一题恰好证明了这一点**：`International standards comparison` 我们拿 Rank #1 78.85%，
而那一题本身就是跨制式的 —— 我们的 EN/ANSI 对比文章同时说了两套。

### 能做什么，以及不能做什么

✅ **在每一个我们已发布的公制尺寸旁边补英制** —— 这是算术，不是发明。
`1110mm` 写成 `1110 mm (43-3/4")` 不需要工厂给任何新数据。

❌ **不要补"离地 41 英寸"这类安装高度。** 那是北美规范要求，不是我们的产品尺寸，
我们没有核实过，而 `AGENTS.md` 的规矩是查不到的写破折号。
doorwaysplus 敢写是因为他们是北美分销商，天天照着 ICC A117.1 报价。

---

## 差别二：snrida 是一家**和我们几乎一模一样的中国工厂**，而它赢在结构不在内容

成都中欧瑞达（Chengdu SinoEuro Ruida）。同样的类目：闭门器、地弹簧、合页、
逃生推杠、门锁、拉手、玻璃门夹具。同样的市场：中东、独联体、东南亚、拉美、东欧。
**同样的买家。**

它在 Documentation 和 OEM 两题都被引用，而它的 Solutions 页面上：

> 没有任何尺寸、没有 MOQ、没有开模周期、没有具体认证编号。
> 原话："Documentation scope is reviewed project by project with our team."

它赢的是**信息架构**：

```
Solutions by Buyer Role
  ├ Solutions for Contractors
  ├ Solutions for Importers
  └ Solutions for Building Material Distributors

What We Can Support Across the Project
  ├ Product Selection
  ├ Technical Drawings
  ├ Available Certificates / Test Reports
  ├ Export Packing
  ├ Shipping Document Coordination
  └ Phased Delivery
```

**按买家角色分栏 × 把交付物逐项命名。** 一个引擎在回答"供应商能提供什么文件"时，
找到的是一个**站点区块**，不是一篇博客文章。

我们的 `what-documents-you-can-actually-get` 内容比他们诚实得多也具体得多 ——
但它是 `/news/` 下的一篇文章。**文章回答问题，区块回答"你是谁、能给我什么"。**

### 建议

把那篇文章的内容提升成一个页面（`/documents/` 或并进 `/services/`），
按买家角色分栏，逐项命名我们**真正有**的交付物。

⚠ 只列真的有的。snrida 的做法是把栏目名列出来、内容留给销售；
按我们的纪律那叫含糊其辞。我们的版本要写"这个有、那个没有、这个要问工厂" ——
那篇文章已经是这么写的，只是位置不对。

---

## 差别三：securityparts 的索引比我们深一层

他们："GET TO YOUR MODEL WITH JUST 3 SELECTS" —— 品牌 → 系列 → 型号，
然后给**爆炸图 + 每个零件的件号**（Von Duprin 98/99、LCN 4011、Schlage B 系列、
Falcon 19/24、Detex Advantex）。

我们今天上线的 `/model-lookup/` 停在**产品**这一层：589 个型号 → 产品页。
他们到**零件**这一层：一个推杠 → 十几个可单独订购的零件。

这一条**我们暂时做不了**，而且原因要写下来：零件级索引要有爆炸图和件号，
那正是工厂还没给的东西（`FACTORY_GAP_SHEET.html` 第三节问的固定孔径是同一类缺口）。
**不能编。** 但它是那张填写表价值的又一个证明。

---

## usmadesupply：不是对手，但机制值得抄一条

它是美国本土制造品的综合商城，不卖门五金。它出现在 Exit / Documentation /
International 三题，靠的是：

- **带年份和规范号的解释文章**：
  "NFPA 10: Fire Extinguisher Guide (**2026**): Placement & Inspection"、
  "NFPA 101: Life Safety Code: **2024** Requirements Guide"、
  "NFPA 72: **2025** Changes, Spacing & CO Rules"
- **按 CSI Division 组织产品**（Division 10 Specialties）—— 规格制定者真正使用的分类法

我们 35 篇文章里，标题带规范号的只有 `ansi-grade-1-vs-en-1125-exit-devices`、
`en-1125-or-ansi-which-standard-your-project-needs`、`ul-305-is-a-listing-not-a-grade`
—— 而这三篇所在的主题正是我们拿 **Rank #1** 的那一个。**样本虽小，方向一致。**

---

## 三条待办，按投入产出排

| # | 做什么 | 依赖谁 | 为什么 |
|---|---|---|---|
| **1** | **技术文章补英制**（公制旁边加括号） | **没有依赖，是算术** | 零风险，直接打开北美语境的问题 |
| **2** | 把 `what-documents-you-can-actually-get` 升成按买家角色分栏的站点区块 | 没有依赖 | Documentation 我们现在 **0%**，而内容早就有了，位置不对 |
| 3 | 零件级索引（爆炸图 + 件号） | **工厂** | 同一张填写表上的缺口 |

⚠ **Documentation 那一题我原本判断"可能不该抢"，现在改判为"该抢"。**
理由变了：榜上确实有 ul.com、europa.eu、ua.edu 这些发证机构和大学，
但**同时也有 snrida —— 一家和我们同类的中国工厂**，靠的只是把交付物列清楚。
发证机构回答"标准要求什么"，工厂回答"我能给你什么"，这是两个问题。
我们在回答第二个问题这件事上没有输给机构，是没上场。
