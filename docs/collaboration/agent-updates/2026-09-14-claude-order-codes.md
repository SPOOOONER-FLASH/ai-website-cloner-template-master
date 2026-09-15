# 2026-09-14 — Claude — 订货编号对照表（MIWA 三件之一）

## 范围

甲方 2026-09-13 指示：「结合我们的定位你来设计把握 MIWA 那几条可照做的（停产对照表、
术语表、订货编号对照）」。这一条是第三件：**订货编号 → 表面处理对照**。

新增 `/finishes` 与 `/es/finishes`（路径两边都用英文 slug，和 `/es` 下其余路由一致）。

## 最重要的一件事：这个语法本来没有写在任何地方

不是抄 MIWA，是从我们自己的目录里数出来的。2026-09-14 统计全目录型号后缀：

| 后缀 | 型号数 | 这些型号 `Function` 规格行写的是 |
|---|---|---|
| `ET` | 78 | Entrance — keyed outside |
| `BK` | 28 | Privacy — bathroom, turn button inside |
| `PS` | 12 | Passage |

而同一批后缀的**前两个字母**正是目录里已经在用的表面处理代码。于是语法成立：

```
587 SSBK   =   587（基础型号） + SS（不锈钢） + BK（浴室/私密）
LH852 GMBK =   LH852          + GM（枪灰）   + BK
```

四个字母 = 两个双字母代码，**表面在前，功能在后**。

### 三个反例，决定了解析器怎么写

1. **`BS` 既是表面代码也是功能代码。** `9212 BNBS` 用的是后者，气缸那一批用的是前者。
   所以解析器**按位置读**，不按字母匹配 —— 0–1 位查表面表，2–3 位查功能表，各查各的。
   按字母扫的写法必须猜，而且会猜错一半。
2. **`9211 BNAC` 是双色，不是「表面+功能」。** BN 和 AC 都是表面代码。所以第二格
   先按功能查、查不到再按表面查，查到就返回两个表面。`finish` 字段因此是**数组**——
   `70 SNDK CP` 也在后面挂了第二个表面，只取第一个会把这些产品的一半颜色悄悄丢掉。
3. **`316-S` / `316-D` 是单开 / 双开门**，这是 316 自己的 `Door Type` 规格行写的，
   309-D 的名字直接叫 Double Door。但同一个 `-S` 也出现在 `DV12-S`（猫眼）和
   `HY007-S`（锁体）上，那里不可能是门扇数。**所以这条只在逃生器械类目下开启**，
   由调用方 `{ doorCodes: true }` 显式打开，解析器不替别人假设。

## 没确认的就不印 —— 12 个表面代码 + 5 个功能代码

`GP`、`NB`、`CB`、`BC`、`BP`、`SB`、`BRN`、`SP`、`BS`、`WL`、`ORB`、`N` 确实在用，
但**我们手上没有任何东西说它们展开成什么**。`NB` 可以是 Nickel Brushed、Natural Brass
或 Nickel Black —— 三种都说得通，买错一种就是一柜子错颜色。

所以这些行**留在表里，名字栏印「Not confirmed — ask」**，下面写清楚候选读法和为什么
不敢定。一张悄悄删掉未知项、看起来很完整的表，对手里拿着写着 `GP` 的报价单的买家
毫无用处。`order-code.test.ts` 锁死了这条：`evidence: "unconfirmed"` 的条目
**必须** `name: null`，想放名字就得改测试，改测试是个需要被 review 的动作。

确认来源分三种，每行都带：

- `catalogue` —— 目录自己写出来了（`PB=Polish Brass`、`Satin Stainless Steel (SSS)`、
  `SC= Satin chrome`、`Gun metal (GM)`）
- `client` —— 甲方书面确认（GM，2026-09-13，LH852 GMBK）
- `unconfirmed` —— 在用，没说法

## 数字都是构建时数出来的

`src/lib/finish-usage.ts` 每次构建从 `publishedProducts` 重新统计每个代码落在多少个
型号上。**不是手写在表格旁边的**。9-14 那次合并一口气进了 194 条记录，任何手写的
数字当天下午就错了，而且没有任何东西会说它错了。

`npm run audit:codes` 打印覆盖率与读不出来的原文：

```
586 条已发布 HYDE 记录
  finish 字段填了      258 (44%)
  其中能读懂           233 (90%)
  型号自带表面代码     195
  已确认               15 表面 + 7 功能
  在用但不知道含义     12 表面 + 5 功能
```

## 测试

- `npm test` 287 通过 0 失败（新增 `src/lib/order-code.test.ts`，21 条）
- `npx tsc --noEmit` 干净
- `eslint` 新增文件干净

## 我没有构建 out/

`out/` 当时是干净的（接力棒空着），**但我没有拿**：`content/news/` 下有 10 个文章
JSON 是 Codex 未提交的头图重选，指向 `news-door-schedule-doors.webp` 这类文件。
现在构建会把别人未完成、未 review 的图片选择烤进发布版，而且可能烤进不存在的路径。
源码先提交，构建留给这批图落地的人。

## 下一步

同一批里还有两件：**停产/替代型号对照表** 和 **术语表**。术语表有一半已经在
`/configurator` 上（`HardwareGlossary.tsx` 讲的是类目词），缺的是**尺寸与机构词汇**
—— backset、centre distance、spindle、follower、throw —— 也就是买家真正会写错的那些。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
