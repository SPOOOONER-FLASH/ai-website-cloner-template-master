# 葡语页面上的英文：690 个页面，0 条

**agent**: Claude · **日期**: 2026-09-17 · 接 `2026-09-17-claude-pt-features-complete.md`

## 结果

| | 早上 | 上一条提交 | 现在 |
|---|---|---|---|
| 有英文的葡语页面 | 675 / 680 | 104 / 690 | **0 / 690** |
| 葡语页面上的英文短语（不重复） | 7,281 | 123 | **0** |
| 葡语页面上的**西班牙语**短语 | 没人数过 | 37（57 个页面） | **0** |
| `npm test` | 331 | 334 | **334** |

两个审计脚本都可重跑：

```
npm run audit:pt:pages     # 葡语页上的英文（西语作对照）
npm run audit:pt:spanish   # 葡语页上的西语（英语作对照）
```

## 一、西班牙语残留：一个审计看不见的类别

`audit-pt-pages.mjs` 拿西班牙语当对照 —— 这正是它不会对 "EN 1125"、"SSET" 误报的
原因，也是一个和这棵树的历史形状完全吻合的盲区。**/pt 路由是从 /es 复制来的，
它们带的残留不是英文，是西班牙语。**

葡语术语表的 `<h1>` 当时写着 `Las palabras de nuestras fichas técnicas`，
而旧审计报告那条路由是干净的。

新脚本 `scripts/audit-pt-spanish.mjs` 用同一套比较法，只是**换英语当对照**：
/pt 有、/es 有、英文没有，并且句子里带一个葡语不用的词，才报。首跑 57 个页面 37 条，
全部已修。

⚠ 唯一一条误报是 `Ver catálogo` —— 这句西语葡语拼法一样。
词表里 `catálogo / página / fábrica / acabado` 已移进 `NOT_A_MARKER`，
**因为一条误报会让下一个会话花半天去证明一个正确的页面是错的。**

## 二、链接才是那个 bug

甲方 09-17：「点选葡萄牙语，选择产品配置器和首页又变成了英文。」

不是配置器的问题。`menu-experience.ts` 的 pt 区块里五个葡语标签指着英文路由，
`home-pt.ts` 里「Ver aplicações」和两张案例卡指 /projects/，
`ProjectCard` 对任何非西语都拼 `/projects/<slug>/`。

**一个链接掉出去，整场访问都掉出去**：落到英文页之后，那页的页眉、面包屑、
每一张卡又全是英文。

`src/data/locale-route-parity.test.ts` 新增守卫：**镜像存在时，locale 页面不许链出
自己的树**。扫 `src/app/es|pt/**`、`home-es.ts`/`home-pt.ts`、以及 `menu-experience.ts`
按缩进切出来的 locale 区块。反证过。

`/services/` 与 `/events/` 不报：它们在任何语言都没有镜像。带 `.` 的 href 也不报
（`/downloads/canton-hyland-product-catalogue-2026.pdf` 是同一份资产）。

### 顺手翻出来一条：西语首页也在踢人

`home-editorial-assets.test.ts` 锁着「西语 FAQ 卡片指英文 /faq/」，写于 2026-08-31 ——
**那天还没有西语 FAQ 页**。`src/app/es/faq/page.tsx` 是 09-10 上的，没人回头改卡片。
按纪律在同一个提交里翻转了那条测试，并把原因写进测试注释。

## 三、这一轮翻了什么

| 位置 | 内容 |
|---|---|
| `src/data/hardware-terms.ts` | 术语表 23 条 × 术语/定义/**代价**三段 |
| `content/faq.json` | 16 组问答 + 4 个分组标题 |
| `products-architecture.ts` | /products 的九张家族卡、三章故事、四张摄影板、整页文案 |
| `capability.ts` | /company 的七步制造链 + 图注 |
| `feature-columns.ts` | 首页三条专栏（**以及它们指向英文文章的 href**） |
| `demand-showcase.ts` / `flagship-tooling.ts` | 首页两条产品栏 |
| `product-faq.ts` | ANSI/BHMA 与认证两问，约 90 个产品页 |
| `content/categories.json` | 17 条 `summaryPt`（`namePt` 09-16 就有了，摘要没人补） |
| `superseded-models.ts` + `ModelLookup` | 改名/合并/类型更正三类原因与全部型号名 |
| `configurator.ts` | 九条缺失的选项说明 |
| `representatives.ts` / `locale-picker.ts` | 代表处地区名与说明 |
| `publish-dimension-models.mjs` + index.json + 三个 .txt | 三个部分 3D 模型的范围与省略说明 |

## 四、pt-BR，不是 pt-PT

这棵树自己在 `news.ts` 和 Article 标记里声明 **pt-BR**，正文里却是
equipa / actual / selecção / Descarregáveis / está a ser / contacto / ficheiros。
已统一成巴西式。`hardware-terms.test.ts` 加了一条守卫：葡语字段出现
equipa、stock、actual、planeado、facto、ecrã 这类词就红。

⚠ 这条守卫**只管术语表**。其余文件靠的是这一轮的人工清理，没有自动防线。

## 五、两条故意没翻的，仍然没翻

```
"Electroplatingbhgh."                     源数据里的错字
"Fabricada en lámina de acero 1.2 mm…"    英文规格字段里坐着一段西语
```

是**记录所有者的数据 bug**，不是翻译活。翻成三种语言只是把缺陷洗白。

## 还剩

- **西语的 `featuresEs` 仍然是 0 / 216**。渲染早就是按语言各取各的列表，
  补上译文就会出现，不用改组件。
- 甲方还欠：六个订单码、五个尺寸、308-S/308-D 的端盒问题。
- **GSC 的跳转规则要在服务器上跑那两行命令才生效**，见
  `docs/collaboration/CLIENT-RUNBOOK.md`。
