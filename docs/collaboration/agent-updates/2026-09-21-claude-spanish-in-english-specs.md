# 2026-09-21 Claude — 英文 specs 里的西语散文；spec 行散文通扫

**Agent:** Claude
**Scope:** `content/products/` 4 个文件、`content/i18n/zh-terms.json`、重新生成的索引。未动 `src/`（生成文件除外）、`out/`、`out-rayen/`。

## 真实影响范围比报告的一行大

报的是 5835 的 `specs[Material]`。实际同一段西语散文**在每个文件里出现 4 次**：

| 字段 | 问题 |
|---|---|
| `specs[Material]` | 西语落在英文表里 |
| `specsPt[Material]` | **原封不动的西语，落在葡语表里** |
| `material` | 西语 |
| `summary` | 西语，后面接了一句 `night latch and rim lock.` —— 英文页的摘要是西语 |

`5835` 和 `5836` 的 `specs` 完全相同。

通扫确认**只有这 2 个文件**：另外 36 个 grep 命中都在合法的西语字段（`specsEs`、`featuresEs`、`summaryEs`）里。

## 拆法

原西语只说了这些，一个字没多加：

```
lámina de acero 1.2 mm / componentes internos aleación de zinc, aleación de cobre
cilindros en latón sólido / 4 llaves / instalación con tornillos o soldadura
incluye accesorios de instalación / acabado pintura electrostática / Iron
```

- **Material 行**（三语）→ 短材料值，house style 对齐同族的 `1073D`（`"Iron case, steel base internal components with zinc plated, 3 pcs brass keys…"`）
- **新增 `Installation` / `Keys supplied` 行**（三语），装配方式和钥匙数是规格性事实
- **表面处理不新增行** —— 既有的 `Case & Strike Plate = Steel with electrostatic powder coating` 已经写了，重复更糟
- `material`、`summary` 改成英文

**没放进 `description`**，尽管那是个空字段：`ProductDetail.tsx:546` 是 `!es && product.description`，只在英文页渲染。三语都渲染的是 spec 行。

`aleación de zinc` 一律直译成 `zinc alloy` / `liga de zinco`，**没有沿用 `specsEs` 原本写的 "zamak"** —— zamak 是一个牌号族的断言，原文没说。这是把既有译文改得更保守，不是更激进。

## 必须有人回答的矛盾：我没有自己解决

新的 `Material` 行说 **Steel sheet 1.2mm case**，同一张表里既有的 `Chassis` 行说 **Zinc die-cast case**。

两个来源打架：西语那段来自某个西语经销商列表，其余规格是我们自己的目录数据，合并进来后从没对过。**钢板 1.2mm 和锌合金压铸不可能同时是同一个壳体。**

按「不确定的尺寸宁可留空」的规矩，我照指示只做了翻译和重组，**没有替工厂裁决哪个是真的**。这需要工厂回答，已开一个独立任务。在答案到来之前，这两行会同时出现在产品页上 —— 这对买家是负面信号，应当尽快处理。

## spec 行散文通扫（用户要的通用情况）

`specs` 值 >120 字符的共 **41 条**。逐条判断：

| 条目 | 判断 | 动作 |
|---|---|---|
| 31 条 `Finish` | 表面处理代码的合法长清单 | 留 |
| `5688` `Function` 320 字 | **散文**，且 `features` 数组里已有同样内容、英文写得更好；原文有错字 `Rim door looks`、`prizing off` | 三语缩短为 `Double cylinder, double throw`。三语 `features` 都在，不丢内容 |
| `f100-ss` `Function` 171 字 | 半结构化，错字 `out wards` | 只改错字 |
| `bl031` / `hy007-s` `Application` | `/` 分隔清单 | 留 |
| `ry8001-8004` `Features` | 分号分隔特性清单 | 留 |
| `ry8005/6` `Maximum door height and width` | 三档结构化查表 | 留 |

**`f100-ss` 里的 `116` 和 `88` 没有单位。** 上下文（合页开启角、`stops at 0, 88 and 116`）几乎肯定是度，但补上 `°` 就是替工厂断言一个规格。按规矩留着不完整，不编。已记在下面的待办里。

## 测试

```
npm run content                     924 products / 35 news / 40 guides；search index 588 entries
node scripts/build-chinese-mirror.mjs --check   OK
npm test                            353 passed, exit 0
npx tsc --noEmit                    exit 0
```

`npm test` 第一次红：中文镜像守卫报 `zh-terms.json` 缺 `Keys supplied`。加了 `配钥匙数量`。

**第一次加的时候我顺手把 `specLabels` 排了序，diff 变成 41 增 40 删。** 共享树里这是纯噪音，会让审阅看不清、也容易和 Codex 撞。已撤销重做成**单行插入**（1 insertion）。

`src/data/generated/products.ts` 无 diff 是**正确的** —— 它只是 import 清单，不内联规格值；真正吃到改动的是 `public/search-index.json`。

## 待办（都不该塞进别人的改动里）

1. **`5835`/`5836` 的壳体材料矛盾** —— 需要工厂回答，已开任务。
2. **`f100-ss` 的 `116`/`88` 缺角度单位** —— 需要工厂确认后补。
3. `bl031` / `hy007-s` 的 `Application` 行是关键词堆砌式清单（`/ 商场 / 超市 / 商业楼宇`），不算错但也不专业。属于文案范畴，留给设计/文案归属方。
