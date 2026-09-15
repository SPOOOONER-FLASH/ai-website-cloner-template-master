# 2026-09-14 — Claude — 术语表（MIWA 三件之三，这一批完成）

## 范围

新增 `/glossary` 与 `/es/glossary`，23 条术语，英西双语。甲方 2026-09-13 提的三件到此齐了：

| MIWA 那一条 | 我们的 | 提交 |
|---|---|---|
| 订货编号对照 | `/finishes` | `3a097e6a14` |
| 停产/替代对照 | `/model-lookup` | `f6c0172569` |
| 术语表 | `/glossary` | 本条 |

## 词是数出来的，不是从行业词典里抄的

网上的门五金术语表有几百个，内容互相抄，再多一个不会有人引用。

所以这 23 条是**统计出来的**：把每一条已发布产品页上印过的规格标签数一遍，按出现次数排序。
`Backset` 145 条、`Door thickness` 170 条、`Function` 159 条、`Handing` 134 条、
`Chassis` 135 条、`Centre distance` 33 条。每一条都是读者在这个站上真会遇到的字段，
旁边那个数字是真的 —— **构建时从 `publishedProducts` 现算**，加产品数字就动。

380 个已发布型号至少声明了其中一条。

## 每条两段：定义，然后「写错的代价」

定义那一段跟别人的一样，**第二段是我们的**。这是甲方老板那句「让别人看起来专业」落到
一张词表上的样子 —— 能说清出什么错的供应商，是见过这个错并且修过的供应商。

> **Backset** ——「一扇已经按 60mm 开好孔的门装不上 70mm 的锁：执手落在错的位置，
> 斜舌够不到锁扣。金属没法在现场改，所以 backset 错了就是一个柜子被堆进仓库而不是装上门。」

测试锁死了这一条：`consequence` 短于 80 字符就不给上线。一条只有定义的词条是词典条目。

## 一个词我们自己用成了两个意思，就直说

`Centre distance` 在锁体上是**锁芯中心到方轴中心**（72 / 85 / 92mm），在拉手上是
**两个固定点之间**（125–149mm）。这是两个测量共用一个标签。一张挑一个印出来的词表，
会在半个目录上误导人。所以那一条把两个都写出来了。

## 两个数字我先印错了，测试和自查各抓到一个

1. **Grade 印成「不是已发布字段」** —— 我把它指向 `Certification` / `Standard` 两个规格标签，
   而目录里根本没有这两个标签；认证在记录顶层的 `certifications` 数组里。改成从那里数，
   现在是 26 个型号。
2. **Narrow stile 印成「198 个型号声明」** —— 我把它指向了 `Application`，那是 198 条记录
   上的通用行。这个数字是**错的**：198 条里绝大多数跟窄边型材无关。改成不给标签、不印数字。
   **在一张全部论据都是「这些数字是真的」的页面上，一个错的数字比没有数字糟得多。**

新测试 `hardware-terms.test.ts` 还抓到第三个：我把 `Door Thickness` 当成一个变体写进去，
目录里只有 `Door thickness`。那个测试断言**每个术语引用的规格标签都真的存在于某条产品记录上** ——
如果以后有人改了规格行的名字，那条术语旁边的数字会悄悄变成 0，而页面看起来照样权威。
现在它会当场失败。

## 顺手修正一件已经推上去的

`/finishes`（`3a097e6a14`）里的链接用了 `underline underline-offset-4`。
`short-marker.test.ts` 有一条规则禁止这种写法（站上链接一律用 `short-marker`），
但它的匹配串带一个前导空格，而我写的是 `className="underline ...`，开头没有空格，
**所以那次溜过去了**。这次写术语表时写成 `className="text-c2 underline ...` 才被抓住。
三个新组件（OrderCodeTables / ModelLookup / HardwareTerms）已全部改成
`short-marker short-marker-compact text-brand`。

## 和 /configurator 上那个术语表不冲突

`HardwareGlossary.tsx` 定义的是**类目**（什么是 rim lock、什么是地弹簧），因为
configurator 用 `ssr: false` 加载，那些句子爬虫看不见，得在服务端再渲染一份。

这一页定义的是**尺寸与机构**（backset、entre-ejes、方轴、锁舌行程）。两者零重叠，
面向两种读者：一个还没选定产品类型，另一个正在填门五金表、需要知道那一列是什么意思。

## 测试

- `npm test` 292 通过 0 失败（新增 `hardware-terms.test.ts` 5 条）
- `tsc --noEmit` 干净，`eslint` 干净
- 两个语言在 dev server 上逐条核对，23 条计数全部抓下来看过

## 依然没有构建 out/

理由同前两条。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
