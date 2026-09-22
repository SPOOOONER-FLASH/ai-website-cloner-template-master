# 2026-09-21 Claude — /guides 第二批完成（17–20 篇）

**Agent:** Claude
**Scope:** `content/guides/` 四个新文件。未动 `src/`、`out/`、`out-rayen/`。

## 做了什么

第二批最后四篇，补齐 20 篇。`content/guides/` 现共 **40 篇**（第一批 20 + 第二批 20），每篇 EN/ES/PT 三语。

| # | slug | 覆盖的 Clarity 话题 |
|---|---|---|
| 17 | `door-thickness-to-cylinder-length-2026` | Cylinders（查表文，计划第 8 项，此前从未覆盖） |
| 18 | `qualifying-a-hardware-supplier-2026` | Sourcing（rank 4） |
| 19 | `powder-coating-and-ral-2026` | Finishes |
| 20 | `hardware-refurbishment-survey-2026` | Handing |

四篇 body 均 ≥1,600 词（三语）：

```
door-thickness   en 1617 | es 1609 | pt 1612
qualifying       en 1781 | es 1777 | pt 1779
powder-coating   en 1673 | es 1786 | pt 1775
refurb-survey    en 1731 | es 1859 | pt 1819
```

## 每篇的自有数据（都由目录量出，不是形容词）

18、19、20 三篇的收尾节把标准用在自己身上，数字全部现场量自 `content/products`：

| 事实 | 数 |
|---|---|
| 有 Finish 行的产品 | 327 / 924 |
| 不同的 finish 字符串 | 85 |
| 提到 powder coating 的产品 | 11 |
| 只写 `paint` / `painting` 的行 | 16 |
| 写了某种黑色但不说工艺的行 | 30 |
| **整个目录里的 RAL 号** | **0** |
| Backset 已发布 | 175 / 924 |
| Centre distance | 148 / 924 |
| Door thickness | 277 / 924 |
| Handing | 186 / 924 |
| **Forend 尺寸/形状** | **6 / 924** |

最后一行是第 20 篇最有用的一句：改造项目十有八九卡在「新锁面板盖不盖得住旧锁孔」，而目录回答不了，必须要图纸或实样。提前说出来比装修当天发现便宜。

`door-thickness` 一篇给出欧规圆柱半边算法（`half = 门厚 ÷ 2 + 面板深 + 余量`，基准是固定螺丝中心），对着目录**真实发布的九个总长**（45/47/54/56/60/65/70/80/90mm）排表，并写明 45 条圆柱记录里写了内外半边分配的是 **0 条**。

## 测试

```
npm test            353 passed, exit 0
npx tsc --noEmit    exit 0
merge-guide-table-rows.mjs --check   exit 0
add-guide-hero-images.mjs --check    exit 0
```

`npm test` 第一次是**红的**，这是好事：重写过的 `portuguese-brazilian.test.ts` 在四篇新文里抓到 **13 处欧葡**（`está a ser`、`facto`、`contacto`、`ficheiro`、`telemóvel`）。用一次性脚本按葡语子树替换后复跑全绿，顺手把守卫没列但同样是欧葡的 `registar`、`carrinha` 一起换了。守卫按设计工作了。

三篇新文缺 `heroImage`，`add-guide-hero-images.mjs` 补上并通过磁盘存在性检查。

## 没碰的东西

- `deploy/nginx/taxonomy-redirects.conf` 和 `docs/design-references/2026-09-21-contact-celebration/**` 是 Codex 改的，未动。
- `out/` 和 `out-rayen/` 未重建。**这 40 篇全部还是纯源码，线上没有。** 下一次发布构建由拿 baton 的人做。

## 风险

- 第 19 篇引了 EN 1670 的等级结构（0–5，各对应一个盐雾时长），并明确写了「各版本等级与时长有变，按你签约的版本引」，没有把某一版的具体小时数当成绝对事实写死。
- 第 19、20 篇的自评节点名了我们自己的缺口（RAL 零条、forend 六条）。这是刻意的，符合「专业感来自可核验，不来自无缺口」。

## 下一步

1. **旧 35 篇 `/news/` 择优扩写**（客户明确的顺序：先做完新 20 篇）。
2. 然后 JS 瘦身，方案已记在 `docs/collaboration/tasks/2026-09-21-two-week-seo-geo-plan.md` 第七节。
3. 发布构建后提醒客户 purge。
