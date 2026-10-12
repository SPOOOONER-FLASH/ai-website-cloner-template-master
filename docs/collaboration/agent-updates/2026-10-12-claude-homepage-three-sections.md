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

## 10-12 第二轮：加回激光切割；撤下首页下半段旧模块

甲方：「激光切割加进去，这都不要了 但是图片帮我留着我喜欢 图片放到hyde桌面文件夹」。

- 工厂故事改回 4 步：切割（激光切割机）→ 冲压 → 抛光 → 装配与检验。机身上的设备厂商商标由甲方当场同意保留；`content/rayen/assets.json` 本来也已放行公司页使用这张图。正文改成“We cut, stamp, polish…”，七语一起更新，旧的正文键已删掉。
- 首页 FactoryStory 之后的旧模块全部撤下，10 种语言一样：hero2 Panic Exit Devices、text1 加 teaser2 “Where our hardware is fitted”、hero3 Designed for、hero4 Materials + Engineering、text2 加 teaser3 Service + Downloads、text3 Engineering for Export 加 hero5 Hardware Specification。现在首页在工厂故事之后直接到页脚。
- 8 张图片按原尺寸复制到桌面 `03-研究与方案/首页撤下的图片-2026-10-12/`，有 HYDE 角标版本的用角标版。`public/images` 里的文件没删，别的页面可能还在用。
- `src/data/home*.ts` 里 hero2–hero5、text1–text3、teaser2–3 的数据对象还留着，没有引用了。要彻底清理，另开一项做，因为 i18n 提取和测试还会扫到它们。
- `home-accent.test.ts`：按甲方决定把锁定值改成 homeAccent 1 个、homeEditorial 0 个，在同一个提交里。
- 检查：npm test 462/462 通过，typecheck、i18n-lint、motion:check 都通过；开发服务器截图看过工厂故事第 1 步和页面底部。

## 10-12 第三轮：清理撤下模块的数据（#50）

- `src/data/home.ts`、`home-es.ts`、`home-pt.ts` 删掉了 hero2–hero5、text1–3、teaser2–3 这几个导出，七语首页通过 `home-locale` 读的是同一份英文数据；`ui-keys.json` 跟着重新生成。七语 `ui.json` 里这些旧句子的译文还留着，不影响页面，i18n-lint 照样通过。
- `home-editorial-assets.test.ts`：首页资产锁定改成剩下的两张（teaser1 的拉手套装和锁芯）；西语 FAQ 卡片随 teaser3 一起撤了，测试改成只断言西语首页没有指向英文 /faq 的链接。
- 图片文件一张没删。
- 检查：npm test 462/462 通过，typecheck、i18n-lint 都通过，eslint 对这三个文件零警告。

## 10-12 第四轮：r42 上线后甲方反馈（#51–#53）

甲方：工厂故事「和样机不一样，而且很卡，图片变得不对应不灵敏」「图片帮我优化下分辨率」；地图按国家细分（西欧全部、美加、南美七国、日韩澳）；「把 bau 移除，地图挪到数据后面」。

- **卡顿的原因和修法**：之前换图用的是全屏大图上的 `clip-path` 动画，每一帧都要重绘。现在改成一对方向相反的 transform（外框上移、照片下移），只走合成层。在无头 Edge 里以 1440 和 2000 两种宽度滚过整段，长帧数都是 0。
- **换图不对应的原因和修法**：之前观察的是整篇 88svh 高的 article，它跨过屏幕中线时，文字其实还在屏幕底部。现在只观察每一步的文字块，判定带是屏幕中间 10%（rootMargin -45%）。
- **分辨率**：网站上的四张工厂图原本只有 1000–1308px，客户原图所在的 G: 盘没挂在这台机器上。用 Real-ESRGAN x4plus（ncnn-vulkan v0.2.5.0，放在 tmp/claude-tools，没进仓库）先放大 4 倍，再用 Lanczos 缩回 2 倍，得到 2000/2616px。只是锐化原有像素，没有增加任何内容，前后对比图逐张看过。HYDE 角标版用 `watermark-product-images.mjs --list=branded-company-list.json` 重出，srcset 加了 1440 和 1920 两档；`generate-editorial-srcsets.mjs` 顺带重写了 12 张无关的产品变体，已还原。记录在 IMAGE_CREDITS.md。
- **地图**：
  - 26 个国家：西欧 12 国、俄罗斯、土耳其、美国、加拿大、南美 7 国、日本、韩国、澳大利亚，东南亚作为一个区域。这些国家在点阵里用高亮点标出，每国一条航线。
  - 国名不手写翻译，用 `Intl.DisplayNames` 按十种语言在构建时生成。
  - 移动的光点只保留 8 个，每个区域一个；区块不在屏幕内时暂停 SMIL（MotionArm 的 `pauseAnimations`）。光点在开始运动前隐藏，修掉了之前停在左上角的那个点。
  - 左栏改成欧洲、美洲、亚太三组国名，另起一行写德国办事处。
  - 新句子已补七语翻译；没人再用的旧键已从七语 ui.json 删掉，删之前核对过 ui-keys 里确实没有引用。
- **首页顺序**：十语首页都移除了 BauShowcase（`BauEntry` 组件和 /bau-2027 页面没动，只是首页不再放）。出口地图挪到“The factory, in figures”之后、推荐货架之前。09-14“数字条后面先放推荐货架”的规定已被甲方这次的指示取代，页面注释已改。
- **检查**：npm test 462/462 通过；typecheck、i18n-lint、motion:check 都通过；开发服务器截图看过地图和工厂故事。
