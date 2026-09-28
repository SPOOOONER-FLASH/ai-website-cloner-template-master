# 2026-09-28 · Claude · 首页专题层级与询盘浮层

甲方批评三点：新区块标题层级不一、首页四个专题连堆主次不分、Contact 浮层挡产品和规格。

## 改了什么

| 文件 | 变化 |
|---|---|
| `src/components/site/HomeSectionHeading.tsx`（新） | 四个专题共用一个标题形：墨色顶线 → 眉题 → `text-h2` 标题 → 右栏导语/链接 |
| `DemandShowcase.tsx`、`FlagshipTooling.tsx`、`FeatureColumns.tsx`、`ArgentinaAr4Showcase.tsx` | 改用上面的标题；AR-4 原来是 `text-h1`，降为 `text-h2` |
| `ProductCard.tsx` | 新增 `shelf` 变体（只在首页热门型号用）：名称固定两行高、材料一行截断并贴底，四张卡的名称/型号/材料对齐。目录页卡片不变 |
| `ArgentinaAr4Showcase.tsx` | 首页版去掉整幅建筑图和四张大卡，改为缩略图索引（型号 + 名称），共同材料写进导语一次。`/products/argentina-ar4/` 页面版（`pageHeading`）不变 |
| `FlagshipTooling.tsx` | 307/311 每款改成「图 + 规格」并排的规格单，占满全宽，不再左半空白 |
| `src/app/{(en),es,pt}/page.tsx` | 顺序改为 热门型号 → 307/311 → AR-4 → 专栏，间距统一 `s96` |
| `src/data/feature-columns.ts` | 专栏眉题 For specifiers / Para prescriptores / Para especificadores |
| `PromoDialog.tsx` | 浮层出现后滚动超过 240px 即收成一行（CTA + 关闭，约 44px 高），不再自动展开。时长用 `--motion-fast` |
| `content/promo.json` | 第一张卡 CTA：Contact us → Request a quote / Solicitar cotización / Solicitar cotação |

另：`BauColumn.tsx` 的 `duration-300` 让主线 `motion:check` 变红，顺手改成 `--motion-medium`。

## 需要别人做

- **SiteHeader 的「Buy it now」**（`SiteHeader.tsx` 440/619/796 行，归「Move homepage components to server」线程）：
  建议改为 **Request a quote / Solicitar cotización / Solicitar cotação**，和浮层同一句话。
  B2B 买家不在网站上「立即购买」，这个词许诺了一个不存在的结账流程。

## 风险

- 七语种镜像（fr/de/…）走 `locale-pages`，未用这四个组件，不受影响。
- 截图：`/mnt/project-files/homepage-hierarchy-2026-09-28/`（before/after × 桌面/手机）。

下一步：甲方看 PR 截图定夺；SiteHeader 改词由协调会话转交。
