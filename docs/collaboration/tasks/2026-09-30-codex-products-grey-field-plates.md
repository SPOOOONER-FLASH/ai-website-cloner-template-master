# Codex 任务单：/products 改版用的统一产品图（2026-09-30）

**派单**：Claude（HYDE 文案 + 工程）｜**执行**：Codex（视觉）｜**甲方已批**：09-30 在决策卡上选了「改草稿」
**背景**：/products 按 FSB 产品总览页的做法重排（方案：`docs/design-references/2026-09-30-fsb-page-study/products-page.md`）。
版式和文案已经做好（PR #16，分支 `claude/hero-video-679jan`，文件 `src/components/site/ProductsShowroom.tsx`），
现在用的是现成的目录白底图。这张单子要你出一套**同光、同比例、同底**的图，替换进去。

---

## 0. 先读这三条，违反任何一条整批作废

1. **只能处理真实照片，不能生成产品。** 允许：抠图、换白底、曝光、拉直、透视校正、去灰去反光、统一阴影、清晰化/放大。
   不允许：加减零件、改执手造型、补螺丝、补孔位、拼一个工厂不单卖的套装、同一张图里混两种表面。
   依据：`AGENTS.md`「Never generate an imagined metal product」。孔位不对就是装不上，买家会因此不信整站。
2. **每张图一个产品、一种表面。** 不锈钢就全是不锈钢，黑色就全是黑色。
3. **每张图配一份来源说明**：同名 `.webp.json`，格式照抄 `public/images/editorial/hyde-real-lever-plate.webp.json`
   （`kind`、`operation`、`sources[].source` + `sha256`、`productGeometry`、`scope`）。没有来源说明的图不上线。

## 1. 统一规格（所有图都按这个）

| 项 | 要求 |
|---|---|
| 底色 | **纯白 #FFFFFF**。灰场由页面 CSS 叠出来（`bg-surface-alt` + `mix-blend-multiply`），所以你交白底，页面上自动变成统一的浅灰。**不要自己铺灰**，否则叠两次会发脏。 |
| 阴影 | 允许一道柔和的接触阴影（产品正下方，透明度低，不拖长）。全批同一个方向、同一个强度。 |
| 光 | 全批同一个光向（左上 45° 主光），不锈钢拉丝纹方向不改。 |
| 地平线 | 产品最低点离底边 **18%**（±6%），和全站产品图标准一致（`scripts/audit-product-image-consistency.mjs` 里的 `HORIZON = 0.18`）。那个脚本只扫 `public/images/products/`，新目录要自己量。 |
| 格式 | WebP，质量 84，sRGB，无透明通道。 |
| 水印 | 不要自己加。水印由管线统一加（见第 4 节）。 |
| 源图 | 只用 `public/images/products/`（无水印原图）里的文件，不要用 `products-hyde/`（已带水印）。源图多数只有 1000×1000，放大允许，但放大后放 100% 检查拉丝纹和边缘没有糊、没有长出不存在的细节。 |

## 2. 要出的图（共 33 张）

输出目录统一：`public/images/editorial/products-page/`（新建）。文件名照下表，**一个字都别改**，页面按这个名字接。

### A. 主图 1 张 —— 9014 执手（页面第一张大图）

| 输出文件 | 尺寸 | 源图 | 构图 |
|---|---|---|---|
| `hero-9014-sset.webp` | 2400×1350（16:9） | `9014-sset-stainless-steel-handle.webp`，可参考 `-2`…`-8` 选最正的一张 | 执手 + 锁孔盖，按原图的上下排布；产品整体高度占画面 **60%**，水平居中。两侧大留白是故意的（FSB 的做法），不要裁紧。 |

### B. 一致性墙 18 张 —— 不锈钢执手（整页最重要的一块）

尺寸都是 **1200×1200**。规则：**锁孔盖（圆的或方的）在每张图里像素大小一样**（外径约 **300 px**），执手在上、锁孔盖在下，
和现在目录图的排布相同。这样 18 张排成一面墙时，大小差别就是真实产品的大小差别。

| 输出文件 | 源图（`public/images/products/`） |
|---|---|
| `wall-9001.webp` | `9001-stainless-steel-handle.webp` |
| `wall-9002e.webp` | `9002e-stainless-steel-handle.webp` |
| `wall-9003e.webp` | `9003e-stainless-steel-handle.webp` |
| `wall-9004.webp` | `9004-stainless-steel-handle.webp` |
| `wall-9004s.webp` | `9004s-stainless-steel-handle.webp` |
| `wall-9005e.webp` | `9005e-stainless-steel-handle.webp` |
| `wall-9005s.webp` | `9005s-stainless-steel-handle.webp` |
| `wall-9006s.webp` | `9006s-stainless-steel-handle.webp` |
| `wall-9007e.webp` | `9007e-stainless-steel-handle.webp` |
| `wall-9007s.webp` | `9007s-stainless-steel-handle.webp` |
| `wall-9008e.webp` | `9008e-stainless-steel-handle.webp` |
| `wall-9008s.webp` | `9008s-stainless-steel-handle.webp` |
| `wall-9010e.webp` | `9010e-stainless-steel-handle.webp` |
| `wall-9011e.webp` | `9011e-stainless-steel-handle.webp` |
| `wall-9014-sset.webp` | `9014-sset-stainless-steel-handle.webp` |
| `wall-9015.webp` | `9015-stainless-steel-handle.webp` |
| `wall-9020s.webp` | `9020s-stainless-steel-handle.webp` |
| `wall-lh1016.webp` | `lh1016-stainless-steel-handle.webp` |

注意：9005E、9008E、9011E 的原图底色偏灰、边缘有灰框，要彻底换成纯白，不然墙上会一格一格地露出来。
不要把 9007（信息图）、9012E / 9016S / 9021（爆炸图）、9087 / 9088（长面板）换进来，它们会打破这面墙。

### C. 九个品类卡 9 张

尺寸都是 **1600×1200**（4:3），产品占画面高度 **55%**，居中。每张一个产品。

| 输出文件 | 品类 | 源图（`public/images/products/`） |
|---|---|---|
| `family-lever-handles.webp` | Lever handles | `9001-stainless-steel-handle.webp` |
| `family-panic-exit-devices.webp` | Panic exit devices | `305-fire-door-panic-exit-device.webp` |
| `family-lock-cases.webp` | Lock cases | `lc14-85-50mm-lock-case.webp` |
| `family-door-closers.webp` | Door control | `ju-051-door-closer.webp` |
| `family-brass-steel-hinges.webp` | Door hinges | `stainless-steel-door-hinge.webp` |
| `family-glass-door-accessories.webp` | Glass door hardware | `stainless-steel-glass-door-pull-handle.webp` |
| `family-grip-handle-sets.webp` | Grip handle sets | `70750-pb-grip-handle-set.webp` |
| `family-lock-cylinders.webp` | Lock cylinders | `70sn-lock-cylinder.webp` |
| `family-hardware-accessories.webp` | Hardware accessories | `stainless-steel-flush-bolt.webp` |

门控那张现在用的是地弹簧图（和「Surface closers」的描述对不上），所以换成 JU-051 顶置闭门器。

### D. 材料三张 3 张（临时版，等工厂实景照）

尺寸都是 **1200×1500**（4:5）。三张都是**合页**，这样材料是唯一变化的东西。合页高度占画面 **65%**，居中，三张像素高度一致。

| 输出文件 | 材料 | 源图（`public/images/products/`） |
|---|---|---|
| `material-stainless.webp` | 304 不锈钢，拉丝 | `ssh012-brass-and-steel-hinges.webp` |
| `material-brass.webp` | 黄铜 | `b024-brass-and-steel-hinges.webp` |
| `material-black.webp` | 哑黑 | `bl030-brass-and-steel-hinges.webp` |

### E. 9014 专题页两张套装图 2 张（上一单遗留）

尺寸 **1000×1000**，两张同比例同位置（现在 SSBK 那张偏小、偏右）。

| 输出文件 | 源图 |
|---|---|
| `set-9014-sset.webp` | `9014-sset-stainless-steel-handle.webp` |
| `set-9014-ssbk.webp` | `9014-ssbk-stainless-steel-handle-3.webp`（这张是完整一支，比主图正） |

## 3. 交之前自己检查

1. 33 张放在一个画布上缩略排开（你之前做的 contact sheet 那种），看：底色一致、阴影一致、墙上 18 张锁孔盖一样大、没有灰框。
2. 每张放大 100% 抽查拉丝纹、螺丝孔、钥匙孔：和源图一模一样，没多没少。
3. 逐张量一下产品最低点到底边的距离，都在 12%–24% 之间。
4. 截一张 contact sheet 存到 `docs/design-references/2026-09-30-fsb-page-study/grey-plates-contact.jpg`。

## 4. 进仓库

- 在 PR #16 的分支 `claude/hero-video-679jan` 上提交（或者从它开一个分支，合回来）。只加 `public/images/editorial/products-page/**`
  和那张 contact sheet，**不要改 `src/`**，路径替换由 Claude 做，免得两个人同时改 `ProductsShowroom.tsx`。
- 这是超过 3 个文件的批量写入，先在 `docs/collaboration/NOW.md` 加一行认领，提交后删掉。
- 跑 `npm run assets:editorial` 生成响应式尺寸（`editorial-images.config.json` 会跟着更新，一起提交）。
- 水印：跑 `npm run assets:brandlist` 和 `npm run assets:watermark:editorial`，和 `hyde-real-*-plate` 一样走编辑图管线。
- 提交信息写到文件里再 `git commit -F`，只 `git add --` 你自己的路径。
- `npm run check` 全绿才算交。
- 在 `docs/collaboration/agent-updates/` 写一条交接：出了哪几张、哪张源图质量不够（如果有）、谁接手（Claude 换路径）。

## 5. 做完之后 Claude 做什么

Claude 把 `ProductsShowroom.tsx` 里的四组路径（`HERO`、`WALL`、`FAMILY_IMAGES`、`MATERIALS`）和 `HandleStory.tsx` 的套装图
换成上面的文件名，重新截图给甲方看。页面代码不用再改版式。

## 6. 不属于这张单子的

- 材料实景照（三种材料装在真门上）：**工厂拍**，不是你出。到了以后替换 D 组。
- 9014 三张微距（斜接拐角、面座边、拉丝方向）：**工厂拍**。
- 专题位的 Configurator Studio 和 BAU 两张图直接用产品主图，不用你处理。
