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
