# 2026-10-12 · Claude（文案会话）· 演示页三段加进正式首页

**甲方**：看了动效演示页后说「出口地图 + 品类数量条、品类索引（跟手图）、工厂故事 这三部分特别好，甚至可以直接加入现在的首页 你看看怎么放」。

## 放在哪里（10 种语言的首页都一样）

| 新段落 | 放在 | 理由 |
|---|---|---|
| 品类索引 `FamilyIndex` | 「最受欢迎型号」那一排（DemandShowcase 加 9014 故事或工作室条）之后、BAU 之前 | 先看别人常买什么，再看全部品类，顺着往下走 |
| 出口地图 `ExportMap` | 阿根廷 AR4 系列之后、FeatureColumns 之前 | BAU（德国）、AR4（阿根廷）讲的都是市场，地图接在后面做总括 |
| 工厂故事 `FactoryStory` | FeatureColumns 之后、旧的编辑大图模块之前 | 和地图之间隔一段白底，两段黑色不贴在一起 |

09-14 甲方定过“数字条后面第一段必须是推荐货架”，这次没动。

## 做法

- 不装 `motion`：正式站用 CSS（只用 `--motion-*` 令牌）加四个小客户端组件。
  - `MotionArm`：区块还在屏幕下方时才把它收回起点，滚到时用 IntersectionObserver 加滚动检查两条路触发。
  - `StoryStage`：告诉固定大图当前是第几步。
  - `FamilyFollow`：桌面端让产品图跟着鼠标走。
  - `FactoryClock`：工厂当地时间。
- 所有文字和数字由服务器直接输出，不开 JS 也是完整内容；系统开了“减少动效”时全部动效关闭。
- 地图点阵和市场坐标由 `docs/design-references/2026-10-12-motion-demo/prep.mjs` 生成，写进 `src/data/generated/export-map.json`（26 KB，整数坐标）。正式站不需要 d3 或地图数据。
- 品类数量由 `src/lib/home-families.ts` 从 publishedProducts 实时算；代表型号未发布时直接报错，不会显示一个没图的品类。
- 工厂故事只用了公司页里已登记的三张自家照片：冲压、抛光、装配。激光切割那张没用，机身上有设备厂商的商标，RAYEN 首页的备注写过首页不放别家商标。文案是照着 `companyEditorialStudies` 里已有的图注改写的，没有新增说法。
- 英、西、葡三语写在组件里；法、德、日、韩、土、俄、阿七语的 30 条新句子写进各自的 `ui.json`（法语冒号前用窄不换行空格）。

## 检查

- `npm test` 462/462 通过；typecheck 通过；新文件 eslint 通过；`motion:check` 通过；`i18n-lint` 显示七个语种干净。
- 在 webpack 开发服务器上用无头 Edge 截了 1440 和 390 两种宽度，脚本是 `shoot-site.mjs`。修了两处：固定大图被页头挡住一截；品类名字号偏小，调到和演示页接近。
- `/es/ /pt/ /de/ /ja/ /ar/` 都返回 200，新标题都在 HTML 里。

## 没做的、要注意的

- 没跑 `npm run build` 和 `test:export`（全站 8,869 页），由发布会话在 release:hyde 时跑。首页 HTML 预计增加约 60 KB，离 640 KB 上限还很远。
- 工作树的 node_modules 是符号链接，Turbopack 开发服务器起不来，这次用 `--webpack` 看的。
- 网站要等工程会话发布才会上线。
