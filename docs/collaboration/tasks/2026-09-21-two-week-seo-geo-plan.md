# 两周计划：在 SEO 与 GEO 上超过 snrida

**立项**: 2026-09-21 · 甲方原话：「我们一定要超过他们的 seo 和 geo 这是目标接下来两周，
要写文章你就狂写，要做什么告诉我和 codex 全力配合。」

依据：`2026-09-21-why-snrida-outranks-us.md`、`2026-09-21-competitor-read-four-sites.md`、
`docs/research/clarity-opportunities.json`

---

## 目标是数字，不是「更好」

| 指标 | 2026-09-21 | 两周目标 | snrida 今天 |
|---|---|---|---|
| 英文文章数 | **35** | **75** | 72 |
| 平均正文字数 | **730** | **1,600** | ~2,300 |
| FAQ 问数 | **105** | **300** | ~430 |
| 标题含年份 | **0** | 新文全部 | 多数 |
| 标题含标准号 | 5 / 35 | 新文全部 | 多数 |
| Clarity Rank #1 的主题 | 2 / 10 | **5 / 10** | — |

每周五重测，数字进 `docs/collaboration/agent-updates/`。
**重测用脚本，不用眼睛**：

```bash
node -e "…"   # 见本文末尾的度量脚本
```

---

## 一、Claude：第一批 20 篇「公共数据查表文」

**选这一类的理由是一句话**：snrida 赢的那些内容**一条都不需要工厂给数据**。
HS code、NFPA 80 间隙、RAL 色号、集装箱装载量、EN 1154 等级 —— 全是公开事实。
我们被工厂卡住的是产品页的尺寸，而我们一直把「等工厂」当成内容产出的瓶颈。
**对产品页成立，对这一类不成立。**

| # | 文章 | 数据来源 | 状态 |
|---|---|---|---|
| 1 | Door hardware HS codes by country (2026) | 各国海关税则 | |
| 2 | Container loading: how much hardware fits a 20GP / 40GP / 40HQ | 箱型内尺寸，算术 | |
| 3 | EN ↔ ANSI/BHMA cross-reference, full table | 两套标准文本 | |
| 4 | BHMA 600-series ↔ US26x ↔ factory codes, full table | 扩写现有 `/finishes` | |
| 5 | EN 1154 & ANSI/BHMA A156.4 door closer grades | 标准文本 | |
| 6 | EN 1935 & A156.1 hinge grades | 标准文本 | |
| 7 | Euro cylinder sizes: every split from 30/30 to 50/60 | 几何 + 在售长度 | |
| 8 | Door thickness → cylinder length, quick table | 算术 | |
| 9 | Backset → door width, quick table | 算术 | |
| 10 | Stainless 201 / 304 / 316: selection and cost | 材料牌号 | |
| 11–20 | 按 Clarity 十个主题各补一篇最弱的 | 见 clarity-opportunities.json | |

### 每篇的标准形状（不达标不发）

- **1,600 字以上**正文
- **6 条 FAQ**（现在每篇 3 条）
- **至少一张查表**
- **标题带年份与规范号**
- **公制 + 英制双单位**（`src/lib/imperial.ts` 已就位）
- **三语**（en 写完，es/pt 同批翻译）

### ⚠ 这一批唯一不能破的纪律

> **每一个数字都要能指回一个公开来源，来源写进文章。**
>
> 抄一张表不写来源，和 snrida 抄 TENGLONG 目录是同一件事，只是抄的对象不同。
> 一个抄来的数字被查出来一次，读者会把这个站上所有的数字都打折 ——
> 这正是我们相对他们唯一的结构性优势，不能自己送掉。

---

## 二、Codex：四件，全部在他们自己的区域

分工按 `AGENTS.md` 的归属表，我不碰 `src/components/site/` 的视觉与 `src/app/es/**`。

1. **文章版式要撑得住 1,600–2,300 字。**
   现在的版式是为 730 字设计的。需要：目录锚点（长文必备）、
   小标题层级、段间节奏。**这是这批内容能不能被读完的前提。**

2. **一个通用数据表组件。**
   查表文章的核心是表，而站上今天没有一个可横向滚动、手机可读、
   表头可粘的通用表。十篇里至少八篇需要它。

3. **`/documents/` 的视觉。**
   2026-09-21 我用现有 token 拼的，归设计区。

4. **新文章的西语/葡语版式与术语复核。**
   翻译我出初稿，`src/app/es/**` 的最终形态是他们的。

---

## 三、甲方：两件，第一件最挡路

1. **那张工厂填写表**（`docs/research/FACTORY_GAP_SHEET.html`）——
   六个订单码、五个板尺寸、执手/拉手的固定孔径与孔中心距。
   **这是零件级索引和产品页被引用的唯一路径。**
   `securityparts.com` 在 4 个主题上压过我们，赢的就是这一层：
   爆炸图 + 件号。我们停在产品级，而往下一层要的正是这张表上的数。

2. **Clarity 配额一到就跑剩下的主题报告**，每份跑完把
   `Top content opportunities` 整块粘进 `docs/research/clarity-opportunities.txt`，
   然后 `node scripts/parse-clarity-opportunities.mjs`。

---

## 四、明确不做的两件

- ❌ **不抄任何证书号、UL 列名、ANSI 等级。**
  307 与 311 还在送检。证号下来之前，任何材料不得暗示我们已持有 ANSI 或 UL。
  UL Product iQ 与 BHMA 目录都是公开可查的。
- ❌ **不用生成图做产品图。**
  snrida 产品页上那本 `TENGLONG CATALOG` 是他们的风险，不是我们的机会。

---

## 五、度量脚本（每周五跑，数字进 agent-update）

```bash
node -e "
const fs=require('fs');
const files=fs.readdirSync('content/news').filter(f=>f.endsWith('.json'));
let words=0, faq=0, year=0, std=0;
const STD=/EN ?\d{3,4}|ANSI|BHMA|NFPA|UL ?\d|ISO ?\d|A156|HS ?code|DIN|BS ?\d/i;
for(const f of files){
  const a=JSON.parse(fs.readFileSync('content/news/'+f,'utf8'));
  words += (Array.isArray(a.body)?a.body.join(' '):String(a.body||'')).split(/\s+/).filter(Boolean).length;
  if(a.faq&&Array.isArray(a.faq.en)) faq += a.faq.en.length;
  if(/20\d\d/.test(a.title)) year++;
  if(STD.test(a.title)) std++;
}
console.log('文章', files.length, '| 平均字数', Math.round(words/files.length),
            '| FAQ', faq, '| 标题含年份', year, '| 含标准号', std);
"
```

2026-09-21 基线：`文章 35 | 平均字数 730 | FAQ 105 | 标题含年份 0 | 含标准号 5`

---

## 六、第二批 20 篇（2026-09-21 排定，按 Clarity 排名选题）

### 先纠正第一批的一个口径问题

第一批交付时报的「平均 1,467 词」是**引擎可见口径**（summary + body + FAQ）。
本计划第 52 行定的标准是「**正文** 1,600 字以上」，两者不是一回事：

| | 正文均 | 引擎可见均 | FAQ |
|---|---|---|---|
| guides 第一批 20 篇 | **1,057** | 1,477 | 120 |
| news 旧 35 篇 | 731 | 1,098 | 135 |

**按本计划的口径，第一批正文没达标。** 第二批按正文 ≥1,600 写。

### 全站平均 1,600 这个指标做不到，算术如下

要 75 篇的正文平均到 1,600，新 20 篇每篇得写 3,664 字：

```
(35×731 + 20×1057 + 20×X) / 75 = 1600
→ 46,725 + 20X = 120,000
→ X = 3,664
```

3,664 字的查表文没人读完，也不会因此排得更高。**这个指标的设定方式有问题**：
它把「旧 35 篇短」这个历史事实算进了新内容的 KPI。

建议改成两个分开的指标：

- **新文正文 ≥1,600**（可达成，且是真正影响排名的那个）
- **旧 35 篇择优扩写**，单独排期，不混进新文产出

没有替甲方改指标，此处只记录算术，决定权在甲方。

### 选题依据：Clarity 各主题当前排名

| rank | 主题 | 本批篇数 |
|---|---|---|
| 未上榜 | Documentation, test evidence and submittals | 3 |
| 34 | Lock function selection for a building | 3 |
| 27 | OEM, private label and tooling | 2 |
| 10 | Euro cylinder and keying systems | 2 |
| 7 | Exit device selection and escape hardware | 3 |
| 3 | Finishes, materials and codes | 3 |
| 4 | Architectural hardware sourcing | 1 |
| 1（守住） | Door handing and installation fit | 2 |
| — | 本计划第 31 节未覆盖项 #8 | 1 |

目标是把 Rank #1 从 2/10 提到 5/10，所以火力集中在 rank 3、4、7 三个
「离 #1 最近」的主题，同时补上完全隐形的 Documentation。

### 20 篇清单

| # | slug | 对应 Clarity 机会簇 |
|---|---|---|
| 1 | submittal-package-contents-2026 | Compliance documentation structure |
| 2 | technical-drawings-what-to-expect-2026 | Technical drawing expectations |
| 3 | material-traceability-mill-certs-2026 | Material traceability evidence |
| 4 | commercial-lock-function-decision-2026 | Commercial function decision frameworks |
| 5 | classroom-storeroom-office-functions-2026 | Commercial function decision frameworks |
| 6 | specification-section-08-71-00-2026 | Specification and scheduling standards |
| 7 | dimensional-interchangeability-2026 | Dimensional interchangeability guidance |
| 8 | drop-in-replacement-checklist-2026 | Dimensional interchangeability guidance |
| 9 | master-key-hierarchy-planning-2026 | Master key hierarchy planning |
| 10 | cylinder-attack-resistance-en-1303-2026 | Euro cylinder / security |
| 11 | exit-device-outside-trim-functions-2026 | Exterior trim function guidance |
| 12 | multipoint-exit-device-applications-2026 | Multi-point latching applications |
| 13 | escape-route-hardware-by-occupancy-2026 | Standards and compliance distinctions |
| 14 | stainless-grade-selection-201-304-316-2026 | Stainless steel grade selection（本计划 #10） |
| 15 | field-identifying-stainless-grades-2026 | Field identification of stainless grades |
| 16 | chrome-finish-differences-2026 | Chrome finish appearance differences |
| 17 | certification-and-test-validation-2026 | Certification and test validation |
| 18 | door-thickness-to-cylinder-length-2026 | 本计划 #8，未覆盖 |
| 19 | replacement-measurement-workflow-2026 | Replacement measurement workflows |
| 20 | universal-vs-handed-hardware-2026 | Universal versus handed hardware |

**每一篇都查过不与现有 55 篇撞题。** 第一批排选题时已经撞掉过
「不锈钢 201/304/316」和「把手朝向」；这一批第 14 篇仍然写不锈钢，是因为
Clarity 的机会簇就叫 Stainless steel grade selection，而 `/news/` 那篇
`stainless-steel-grades-304-201-316` 正文只有 731 字均线水平 —— 新的一篇写
**选型与成本**，角度不同且长度是它的两倍以上。
