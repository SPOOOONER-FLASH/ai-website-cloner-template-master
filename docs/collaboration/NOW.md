# NOW — 谁正在动哪些文件

**这个文件存在的唯一目的：把「这 140 个 JSON 是谁改的？」从一次五轮调查，变成一次 `cat`。**

开工前 `cat docs/collaboration/NOW.md`。要动一批文件（超过 3 个，或任何 glob）之前，
在表里加一行；那批工作提交后，删掉自己那行。**删自己的行，不删别人的。**

一行的成本约 50 token。一次「工作树里冒出 140 个我没动过的文件，我得先搞清楚是谁的」
的调查，成本是几千 token 加一次停工 —— 2026-08-31 Codex 就为此中断过一次展会任务。

## 正在进行

| agent | 路径 | 在做什么 | 开始时间 |
|---|---|---|---|
| Claude HYDE（**E:/cantonlock-hyde** 独立克隆） | content/news, content/guides, src/data/es-glossary.ts, src/data/pt-glossary.ts, src/lib/seo-policy.ts, scripts/check-*.mjs | TODO 第 8–12 项：西葡拉美/巴西用词归一、对比指南、HYDE 口径数字核对、robots；第 13 项新语言最后做。不碰雷茵目录 | 2026-09-24 |
| Codex HYDE fluidity | `out/`, `scripts/spec-coverage.mjs`, `docs/research/SPEC_COVERAGE.json`, `src/data/article-catalogue-claims.test.ts`, 4 篇数字指南（独立 `hyde-release` worktree） | 按 HYDE 站点过滤纠正规格统计和指南数字，再用 `release:hyde` 发布搜索快速重开修复；不碰雷茵发布目录 | 2026-09-23 |
| Codex motion 2026-09-23 | HeroCarousel, SiteHeader, LocalePicker, SearchDialog, ProductImageZoom, GuideEditorial CSS, motion guard, SPEC_COVERAGE, four numeric guides, out/ out-rayen/ | 已批准的轮播与浮层优化；同期目录增长使覆盖报告和四篇文章数字过期，一并修复；当前持有发布构建 | 2026-09-23 |
| Codex guides DCB | GuideListing, GuideLibrary, GuideEditorial CSS, GuideCover, GuideArticleIntro, NewsDetail guide branch, guide-library helper/tests, out/ out-rayen/ | Approved D visual + C search/filter + B technical reading; tree/export clean at start | 2026-09-22 |
| Codex news studio | NewsVisual, news image selections, EditorialAtlas, background asset, out/ out-rayen/ | Catalogue-inspired real-photo framing; remove marked rejected and heavy hardware images | 2026-09-15 |

> Claude 2026-09-24：第 7 项完成，35 篇旧文三语全部 ≥1,600 词（7cebea24295），news expansion 那行已删。工作目录改到 E:/cantonlock-hyde（独立克隆，见 AGENTS.md 分界墙一节）。
> 
> Claude 2026-09-23：发布完成，接力棒交还，无人持棒。从 12c09abe6f3 重出，带上 3ec845be539 之后的 8 个源码提交（扩写批6–11 英文、西葡段落回退修复、指南英文先发）。
>
> Claude 2026-09-22：发布完成，接力棒交还，无人持棒。3ec845be539 已推送；线上 /contact/ /certifications/ /news/ 引用的 JS/CSS 块与本次构建逐个一致（上一版只重合 14/16），表单密钥已内联上线。⚠ 线上 HTML 不能逐字节比对：Cloudflare 会剥掉 <!--email_off--> 等标记，要比块哈希。
>
> ⚠ 2026-09-22：甲方通知 Codex 已下线，指示本次发布不等他们的认领。核对过了：
> `codex/guides-visual-refresh`（04b02b69cac）已全部并入 origin/main，未合并提交为 0；
> 他们的工作树里除 out/ 外没有任何未提交改动。所以上面两行 Codex 的认领是**停在半途的记录**，
> 本次构建没有烤进任何未提交的源码。行保留不删 —— 删自己的行，不删别人的。
Claude 2026-09-15 → **给雷茵会话的一条**：UNION 取数的前缀过滤
`/^(?:UL|PRE-?|G|T)\d/i` **静默漏掉了九个型号** —— MUL1022 / MUL1066 / MUL2101 /
TSG52 / TSG1169 / TSG1170 / TSG1226 / TSG4227 / USG1，全都是空规格表。
9-14 那份补料清单据此判断「UNION 上一个都没有」，**其中三个 MUL 是有的**，
只是抓取脚本从来没问过。过滤已改成
`/^(?:MUL|TSG|USG|UL|PRE[-_]?[A-Z]?|G|T-?)\d/i`，补抓结果：MUL 三个抓到，
TSG 五个与 USG1 确实未收录。

MUL2101 甲方特别点名：UNION 上是**五个颜色**，已按 UNION 自己的
材質・仕上 写进 `finishes`（-023 砂光无清漆 / -200 镀铬 / -202 硫化熏色金古铜 /
-207 硫化熏色棕 / -215 炭黑喷漆）。**并改正了一处实质错误**：MUL1066 与 MUL2101
站上写的是 stainless，UNION 写的是ブラス（黄铜）。

⚠ **规格行没有写进记录，留给你们定**：UNION 也给了尺寸、门厚 33–51mm、
适用范围（室内轻质木门 ≤25kg）和「无锁芯配置」，都在
`content/rayen/artunion-specs.json` 里。没写上去是因为
`product-sites.test.ts` 要求没有图纸的型号规格表必须为空 —— 那条规则防的是
「从同款抄尺寸」，而这些数字有 UNION 自己的出处。**算不算满足那条规则是你们的判断**，
不该由这边替你们放宽。新增 `scripts/scrape-artunion-finishes.mjs` 专门取颜色清单。

| Codex studies release | src/app/(en)/product-studies/, src/app/es/product-studies/, src/components/site/ProductStudies.tsx, src/data/generated/product-studies.json, scripts/publish-hardware-studies.mjs, public/images/product-studies/, out/, out-rayen/ | Publish approved real-photo studies EN/ES, catalogue entry, verify and deploy export; out was clean | 2026-09-10 |
| Claude | content/products/**, public/images/**, public/videos/**, out/, out-rayen/ | DS011 改名、12 个单图型号补图、位置语言面板，重出构建并部署 | 2026-09-08 |
| Codex | scripts/blender/9004s-published-shell.py, docs/design-references/2026-09-07-home-stills/models-9004s | Published-dimension exterior model and evidence; no site geometry publication | 2026-09-08 |
| Codex | scripts/blender/editorial-stills.py, scripts/build-editorial-stills.mjs, docs/design-references/2026-09-07-home-stills | Three real-photo architectural still-life previews; no carousel change | 2026-09-07 |

> ⚠ 2026-09-08：甲方通知 Codex 下线（服务器崩溃），并指示 Claude 直接部署。
> 上面两行 Codex 的认领因此是**停在半途的记录**，不是进行中的工作——保留是因为
> 那是他们的记录，但下一个会话不必等它们。他们未提交的 HeroCarousel.tsx 与
> static-export-performance.test.ts 经哈希核对只有行尾符差异，内容与 HEAD 一致，
> 所以本次构建没有烤进任何未提交的源码改动。

Claude 2026-09-11: 第 20 篇文章（311 开模）上线核实完毕。**接力棒没有真的易手** ——
我接棒重出构建之前，Codex 的 afc9055074 已经把这一页构建并提交了，我的重出产物和它
逐字节一致，out/ 零改动。这是共享工作树运转正常的样子，记一笔是因为当时我先看到
线上 404 才决定接棒，而 404 的真正原因是第三件事。

⚠ 值得记住的一条：**线上 404 不等于没部署。** 当时 out/ 里有这一页、HEAD 里有、
远端也有，线上仍返回 404 —— 因为 Cloudflare 缓存了服务器尚未拉取时的那个 404。
加一个随机查询参数绕过边缘缓存就是 200。下次判断「上线了没有」，先用
`curl "...?cb=123"` 打一次，再去怀疑构建或部署。

Claude 2026-09-10: 逃生器械 15 条改名 + BHMA 表面码 + 竞品认证对照，**源码已提交推送**
（7dad3d8556）。**没有构建**：out/ 当时有 10,004 个脏文件且 27 个 node 进程在跑，
接力棒在 Codex 手上，由他们的构建带上这批源码。

⚠ 给 Codex：`npm test` 目前 230/233，三条失败都在你这边 ——
flip-up-grab-bars 新类目缺封面图与配置器定义（2 条），
src/components/rayen/Chrome.tsx 未提交的 hover:underline（1 条，改成
short-marker short-marker-compact 即可）。content/i18n/zh-terms.json 里你新产品带出来的
18 个规格标签中文我一并补了（content/** 是我的区域且文件当时干净）。

Claude 2026-09-09: 无图型号从四个浏览面下架（product-finder / products A–Z / 抽屉计数 /
相关推荐回退），1,352 页构建已提交推送；接力棒交还，无人持棒。构建时 Codex 未提交的
HeroCarousel.tsx 与 static-export-performance.test.ts 经 `git diff` 核对为零内容差异，
未烤进任何未提交源码。

Claude 2026-09-07: 已接棒重跑并提交 1,095 页发布构建（含产能链段与三篇文章），接力棒交还，无人持棒。

Codex 2026-09-07: video trial withdrawn before push. Local out/ and out-rayen/ rebuilt without trial media; npm run check passed. Later concurrent source edits make predeploy freshness fail. Release baton returned: next builder incorporates those changes before publishing. See 2026-09-07-codex-motion-withdrawal.md.

> 2026-08-31 claude 已交还发布接力棒：941 页已构建、提交并推送（6b66bfdd）。
> ⚠ 那次构建里含 Codex 尚未提交的首页改动（home.ts / home-es.ts /
> editorial-images.config.json 与六张 webp）。**Codex 请提交这几个文件**，
> 否则 out/ 有一部分内容在 git 里找不到对应源码。

Claude 2026-09-15：**上面「Codex model publication」那一行的工作已经落地并推送**
（`93c861c5b6` + `87d08e2556`）。甲方告知 Codex 停止工作，我查后发现他们已经提交完，
只是没推 —— 所以那是一次 push，不是接棒重出。推之前按自己的发布验过一遍：
test:export 通过、死链审计 102,837 条链接全解析、`out/` 比每个源文件都新、
首页引用缺失资源 0、`out/` 与 `out-rayen/` 未跟踪残留 0/0。见
`agent-updates/2026-09-15-claude-pushed-codex-release.md`。**接力棒现在无人持有。**

Claude 2026-09-15 → **给 Codex 的建模清单**：
`docs/collaboration/2026-09-15-modelling-shortlist.md`，两个脚本随时重跑
（`npm run audit:modelling` / `npm run audit:modelling:alibaba`）。

**下一批先做管状拉手 100 / 102 / 104 / 106 / 107** —— 外径、壁厚、总长、中心距、
离面距五个数全部公布，**这五个是完整模型不是局部模型**，不需要「哪些没建」的清单。
同一族一个参数化生成器出五个，106 带锥度也完全确定。
其后 001 面板、LC07 包络（比 LC04 好，不用假设厚度）。

阿里 43 个产品交叉下来只有 102 现在能建，但**询盘最高的五个都只差两三个数**：
307/311/305/035/308 差 Plate size + Plate thickness，6068 差 Faceplate + Case height +
Case depth。这七个型号三类数据已经整理成给工厂的问句。

Claude 2026-09-15 → **给 Codex 的出图清单**：
`docs/collaboration/2026-09-15-alibaba-image-brief.md`，生成的，`npm run brief:images` 重跑。

按甲方自己导出的阿里数据排的 43 个产品：有询盘的 8 个在第一节（307/311/6068/305/564/
5836/308/035），每行印出现有照片数、规格行数、有没有视频与尺寸图、以及能不能建模。

⚠ **第一条不是出图问题**：曝光最高的两条（Universal Blank Key 309 次、Hotel/Garage
Master Key 256 次）**站上根本没有对应记录** —— 对照第一节最好的 307 只有 63 次。
这是目录缺口，比整份出图清单更值钱。

⚠ 清单里没有一条是「照着想象画一个」。数据不够的地方写的是**缺什么**，不是可以假设什么。

Claude 2026-09-15（第二轮，甲方又给了凯理图册六个跨页）→ 场景从三种扩到**八种**
（A 石板 / B 布面 / C 罗纹玻璃 / D 书堆 / E 木框 / F 混凝土+原木 / G 黑场 / H 装在门上），
并出了**选品清单** `docs/collaboration/2026-09-15-scene-shortlist.md`（`npm run brief:scenes`）：
全目录 519 个已发布型号归成 342 个形状，其中 **50 个形状**有两个以上表面、每个表面都有
真实照片、且尺寸适合台面场景。每组标了建议场景。

⚠ 两条新规律：道具永远比产品「软」（不跟金属抢高光）；渐变背景是打光打出来的不是刷出来的。

⚠ **书的事，甲方 2026-09-15 定了：书就是书，随便什么英文书都行**，不是版权问题。
（我上一版把它写成了「不能照抄」，写错了，已改。）竖立的书脊是好道具 —— 一排竖直硬边，
和罗纹板同一个作用。真正不能出现的只有一样：**别家五金品牌的标**。

甲方要的 Word 版，两份，都由 `node scripts/build-client-docx.mjs` 从 md 导出：
`2026-09-15-拍摄风格拆解.docx`、`2026-09-15-选品清单.docx`。
**以 Markdown 版为准**，两边不一致时改 md 再重新导出（不要直接改 docx）。

Claude 2026-09-15 → **给 Codex 的场景布光规格**：
`docs/collaboration/2026-09-15-catalogue-scene-style.md`。甲方圈了雷茵/凯理册子里三张
产品图，要求拆开分析好让 Codex 精准生成同类图。

⚠ **文档第零节是边界，先读那一节**：允许照配方布置场景（底座、背景、光、色调、机位、
构图），场景里的五金**必须是我们自己产品的真实照片抠图，或按公布尺寸建的 Blender 几何**；
**不允许让模型生成一个五金件**，也不允许复制凯理的具体画面与版式。

真正起作用的是一件事：**同一个形状、两个表面、放在一起**（一深一浅，一立一躺）。
我们做得了 —— 全目录 **68 个型号组**有两个及以上同形状不同表面的变体且都已有真实照片
（607 七个、587 八个、LH853 五个、70 系锁芯十九个），**不需要工厂补拍**。

光的配方、色值、构图规则、出图前检查表都在文档里。先做哪几张写在第八节。
⚠ 询盘最高的 307/311/305 是逃生器械，形状长，不适合这几个场景 —— 它们要的是装在门上的
实景，那得工厂拍。

## 规则

1. **只登记批量写入**。改一两个组件不用登记 —— `git diff --name-only` 就够看了。
   要登记的是：`content/products/*.json`、`out/`、`public/images/**`、跨目录的重命名。
2. **`out/` 永远登记**。它一次动 ~5164 个文件，是最容易被误读成「有人在乱搞」的东西。
   持有构建接力棒的人在这里写一行，其他人就不必猜。
3. **看到不在表里的陌生改动**：按 `AGENTS.md`「脏树不是阻塞信号」处理 —— 不清理、
   不回滚、不混入提交，用 `git commit -- <自己的路径>` 精确提交，然后继续干活。
   **不要为此发起调查**，写一行到自己的交接说明里就够了。
4. **表里有行但看起来早就该结束了**：那是别人忘了删。不要等，不要问，按第 3 条办。

## 为什么不是锁

甲方要求短反馈环，明确说过不要加锁 —— 锁会阻塞正在工作的人的提交流程。
这张表**不授予任何独占权**，它只回答「这是谁的」。看到别人占着你要动的路径时，
正确动作是去做手头别的事，不是等。

Claude 2026-09-10：雷茵英文版**源码已提交推送**（dd1bbbb324）——`src/app/zh-en/**`
八个页面 + `src/components/rayen/pages.tsx`。eslint / tsc / 241 个测试全过。
**没有构建**：`out/` 当时 8,206 个脏文件，`src/app/(en)/product-studies/` 等是 Codex
未提交的在途源码，构建会把未审过的东西烤进发布。接力棒在 Codex 手上。

→ **已由 Claude 构建部署**（af0310525f）：甲方 2026-09-10 告知 Codex 下线约五天，
指示直接提交。构建带上了 Codex 离线前已提交的 product-studies（7e73b0075b）。
out-rayen/en/ 87 个英文页已上线，`/zh-en/` 是构建期前缀，永远 404，不是 bug。

Claude 2026-09-11（第二台机器，全新 clone 到 `C:\Users\86132\Downloads\rayen-repo`）：
第五批大拉手 44 个型号、328 张图上线；图片顺序改成甲方给的「窗口图片 → 参数图 → 表面处理 → 实景」，
参数图固定第一张（`imageOrder: "drawing-first"`，只对 b5 生效，前四批源图不在本机没跟着改，
已有 30 个型号用 `scripts/reorder-rayen-gallery.mjs` 单独调了顺序）。新开子类目「黄铜拉手」。
**已提交推送，out/ 与 out-rayen/ 一并提交。**

⚠ 两件值得下一个人知道的：

一、**类目封面图一直挂着 Hyland 海得的椭圆标。** `src/data/rayen.ts` 只把产品图映射到
`/images/products-rayen/`，`content/categories.json` 的封面是原样透传的，走的是未清洗的
`/images/products/`。产品中心首屏那 6 张卡片因此从上线起就带着另一家公司的商标。
已修（rayen.ts 加一层映射），并把类目封面纳入 `brand-rayen-images.mjs` 的打标范围。
教训：「产品图清干净了」不等于「页面上的图清干净了」——类目封面不是任何产品的图。

二、**`public/videos/products/` 少了 12 个逃生器械视频，但 `out/` 里有。**
所以任何人在这台机器上重出构建，都会把这 12 个视频从 out/ 里删掉，死链审计立刻报 24 条。
我从 `git show HEAD:out/videos/...` 把它们还原进 `public/`，根因才算修掉。
下次看到「重建后莫名其妙少了文件」，先查是不是 public/ 里本来就没有、只有 out/ 里有。

开孔直径有一条**等甲方回话**：甲方给的「玻璃门16、木门10」经 artunion 核对是 M8 那一档，
M6 的型号原厂公布的是 φ12/φ8。现在网站上填的是每个型号自己的数字。
缺料清单在 `docs/collaboration/2026-09-11-rayen-batch5-gaps.md`。

Claude 2026-09-11（第二轮，同一台机器）：甲方看线上截图提了五件事，都已处理并推送。

⚠ 三条值得下一个人知道的：

一、**宽高比判断不了「会不会切到产品」。** `square-rayen-plates.mjs` 原来用 0.8–1.25 当安全带。
新写的 `scripts/audit-rayen-images.mjs` 模拟真实的 1:1 裁切，发现带内有 4 张在切金属
（ul690-lever-handle-11 比例 1.23，执手头和雷茵标都被切掉一半）。比例分不清
「摄影师留的余量」和「产品顶到边」。安全带已取消：白底图不是正方形就补白边，补白无损。

二、**补白边会让 `delocalize-drawings.mjs` 的坐标失效。** 544×532 → 609×609 之后六张图
全部「跳过，不乱涂」—— 内容是对的但 CI 验证不了。已让它接受「居中补白到正方形」
这一种变换并平移坐标，其他任何尺寸变化仍然拒绝。
另：乱序跑这两个脚本会**重复盖字**（出现「截 截面形状」）。必须整条 `npm run rayen:images`
按顺序跑，或者先删掉目标文件让它从源图重建。

三、**给类目加子类目会改掉父类目的显示名。** `displayNameFor` 里 `.filter(Boolean)` 把
「没有子类目」的产品漏掉了，于是不锈钢拉手（45 个型号）+ 黄铜拉手（7 个）被判成
「全部属于黄铜」，卡片显示成「黄铜拉手 45 个型号」。已修（空字符串也算集合成员）。

新增 `npm run rayen:audit` —— 独立于打标脚本的二次审查，拿每张图打标前的原图做基准做差，
画面花纹会抵消，比 ledger 的 `--check` 强。当前结果：836 张全部带标、836 张全部不会被裁。

**等甲方给两张图**：新 logo 要导成 SVG/PNG（发来的是 logo.dwg，本机无 CAD 可转）；
T2973A 要一张产品照（它只有尺寸图，没法不拿尺寸图当首图）。

Claude 2026-09-13：第六批 37 个大拉手、logo 按语言分家、首页三帧轮播，**已提交推送**。

⚠ 两条给下一个人：

一、**补白边会让已经打过标的文件失效。** `square-rayen-plates.mjs` 改动文件之后，
`brand-rayen-images.mjs` 的 ledger SHA 就对不上了，`rayen:images:check` 会报几张「没打标」。
再跑一次 `node scripts/brand-rayen-images.mjs` 即可，不是 bug。
跟「乱序跑会重复盖字」是同一个根源（这两个脚本互相影响），只是这次是良性的。

二、**rebase 不要用在这个仓库上。** 双方都重出 `out/` 时，`git rebase origin/main` 会在
9,587 个构建产物上冲突，而那些文件是生成的 —— 任何一边的版本都不「对」，手工合出来的更不对。
正确做法：重置到 origin/main，只恢复自己改过的**源文件**，整条重新生成，再提交。
本次恢复的是 9 个：manifest、两个 logo、三个 rayen 组件、zh-terms、artunion 缓存。

**天地轴（博克来奥 / DIROCK）**：甲方 2026-09-13 明确「代理贴牌销售，盖 logo 直接发产品，
认证不管」。所以产品图和规格照做（规格是零件客观事实），但封面、注册商标页、办公楼、
ISO/CE 认证页、页眉带对方标与口号的安装说明跨页一概不进站。这是个全新品类，
开品类记得按 AGENTS.md 第 5 个坑在 5 处注册，否则构建会在 /_not-found 崩。
| Codex image completion | content/news/*.json (heroImage only), src/data/home.ts, src/data/home-es.ts, src/components/site/editorial-images.config.json, src/components/site/ProductStudies.tsx, public/images/editorial/curated-*, public/images/product-studies/curated-*, scripts/blender/curated-hardware-scenes.py, scripts/build-curated-hardware.mjs, docs/design-references/2026-09-14-curated-hardware/ | Red-cross image replacement, unique covers, real-source scenes and 20-item review; no shared out build | 2026-09-14 |

Claude 2026-09-14：中英文两套产品图 + 天地轴 38 个型号新品类，**已提交推送**。

⚠ 三条给下一个人：

一、**产品图现在是两套，不是一套。**
`public/images/products-rayen/`（黑色 RAYEN 雷茵，中文站）与
`public/images/products-rayen-en/`（青绿 RAYEN 字标，英文站）。
标是烤进像素的，一个文件不可能带两个标。两套都从同一份未打标派生图生成，
`src/data/rayen.ts` 的 `viewProduct` / `categoriesFor` 为英文 locale 改写路径。
**改图片流水线时两套都要想到**：`rayen:images:check` 和 `rayen:audit` 都已经按套分别报告。

二、**「从主目录复制一份做底图」是个陷阱。**
这条链子每个脚本都就地改文件，所以复制到的是「此刻」的样子 —— 第一版英文图因此
全部双标叠加（青绿压在黑色上，两个都看得见，1,112 张全中）。
现在靠中文 ledger 的 SHA 判断底图是否已打标，已打标就拒绝并退出；
打标顺序也固定成 **en → zh**（英文必须从干净底图生成）。
同一个根还造成过「截 截面形状」重复盖字（09-11）和换 logo 时的双标（09-12）。

三、**四项自动检查当时全是绿的，双标是靠截图目视发现的。**
因为它们问的是「有没有标」，不问「有几个」。`rayen:audit` 已改成两套各自对着自己的
logo 审，但「有几个」这个问题现在仍然没有自动答案 —— 换标之后请人眼看一眼。

天地轴新品类 `floor-springs-and-pivots`（地弹簧与天地轴），5 个子类目、38 个型号，
来自甲方 2026-09-13 给的博克来奥 / DIROCK 两本画册（代理贴牌，已拿用图授权）。
清单在 `content/rayen/pivot-sets.json`，里面写明了什么进站、什么不进站。
**不进站的**：封面、对方注册商标页、办公楼、ISO/CE 认证页、页眉带对方标与口号的安装说明跨页。
**疲劳检测次数按甲方指示不写** —— 我们手上没有报告。

---

Claude 2026-09-14（第二轮）：**UNION 按型号取图 815 张，9 个空规格表填满，顺带挖出一类静默错图**。

甲方 2026-09-14：「所有图片你也可以去 union 爬取，记得打上我们的标志就行」「加速取图 推送」。
`scripts/scrape-artunion-images.mjs` 按**型号文件名**匹配（不看标题、不看缩略图），
110 个型号取回 815 张，`scripts/merge-union-scrape.mjs` 决定每张该去哪。

**一、b1–b4 原样不动，这是数出来的结论，不是偷懒。**
那几批的客户图包本身就是 UNION 的料：G1234 站上 13 张、UNION 也是 13 张；
G1105 站上 9 张、UNION 才 5 张。合进去只会同一张图出现两次。
只有 4 个型号例外（G1216 / G2110 / G1266 / G2888）—— 它们当初**一张图纸都没有**，
规格表是空的，而 UNION 有图纸。这 4 个单独搭了暂存目录，**只加图纸、不加产品图**，
清单是新的 `content/rayen/union-handles-rebuilt.json`，条目已从 b1 / b4 **移走**
（一个型号只能有一个清单管，别加回去）。

**二、9 个空规格表填满了，数字都是照各自那张图读的。**
G1265 G1286 G5450 T2522（第五批）、G1131（第六批）、G1216 G2110 G1266 G2888（新清单）、
UL1066。没有一个是抄同族型号的。补料清单
`docs/collaboration/2026-09-11-rayen-batch5-gaps.md` 第二节已更新：**11 个欠料变 7 个**。
剩下 7 个查过了 —— TSG1226/TSG52/CSM1/MUL1066/USG1 在 UNION 型号库里**根本没有**，
T52UP/T5650UP 有号但没有详情页。所以那 7 个八成是工厂自编号，**只能问工厂要图**。

**三、UL1066 顺手解决了补料清单第五节挂着的事。**
它的档案由 b3 管，而 b3 的源图包在 johns 那台机器上；可第五批图包里就有它完整 21 张，
站上却只显示 4 张。把清单条目挪到 b5（sourceRoot 正好就是那个图包）就解决了，不用换机器。
现在 13 张 + 5 行规格。同类错位的 G1106 / G2690 / T2750 查过了，UNION 和图包都没有新料，没动。

⚠ **四、这一轮挖出一个会静默上错图的坑，两个脚本都改了，还加了测试。**
重新 ingest 一个图变多的型号会**重新编号** `<slug>-N.webp`，于是 `-5` 换成了另一张照片。
如果新的那张被去水印那一步**拒绝清洗**，脚本按约定「什么都不写」——
旧的 `-5`（另一张照片，还带着上一轮打的标）就**原地留了下来**，顶着新名字继续上站。
10 张中过招。更隐蔽的是英文站：seeding 那一步「文件已存在就跳过」，
所以底图重新生成之后**英文副本永远不刷新** —— 19 张英文图和它的中文底图是**两张不同的照片**，
唯一的破绽是一边 1049px、一边 1050px。

**四项检查当时全绿**：ledger 说打过标（确实打过，打在错的图上）、
缩放检查说是正方形、`rayen:audit` 说「没有标」却是因为它在对比两张毫不相干的图。
**是打开图片看出来的。**

改了三处：
- `build-rayen-product-images.mjs`：拒绝清洗时**删掉**残留产物；`--check` 现在也反向检查
  「被拒绝的图不该有文件」（以前只检查「该有的图在不在」，所以这个方向是个盲区）。
- `brand-rayen-images.mjs`：英文 ledger 新增 `seededFrom`，记住每张英文图是从**哪一版**
  中文底图复制的；底图变了就重新取底。另外清掉没有中文底图的英文孤儿文件。
- 新增 `src/lib/rayen-image-sets.test.ts`：断言两套图**一一对应且尺寸一致**。
  尺寸就是破绽 —— 同一张照片的两次编码尺寸一定相同，两张不同的照片几乎一定不同。

**恢复动作是整条重建**（两个目录删掉重跑），因为底图一旦打过标就不能再拿来做英文底图。
下次遇到「英文和中文张数对不上」或测试报尺寸不符，就跑：
`rm -rf public/images/products-rayen public/images/products-rayen-en && npm run rayen:images`

**五、G1216 的图纸上有日文「断面形状」**，已按 T2412 的先例改写成「截面形状」，
坐标写在 `scripts/delocalize-drawings.mjs`（544×532 画布上量的）。
这一轮新进的 55 张图纸拼了张联系表逐格看过，**只有这一张带日文**。

⚠ **六、重新 ingest 会掀掉两样东西，两样都补成了脚本 + 测试。**

**1. 甲方定的开孔直径被原厂数据盖回去了。**
甲方三次说「玻璃门安装16mm，木门安装10mm」（两次带着「螺丝是M8的」前提），
09-14 那一轮是**直接改生成出来的产品 JSON** 落实的。这一轮重跑 b5/b6 之后，
`merge-artunion-specs.mjs` 把原厂的 φ12 又写了回去 —— **42 个型号悄悄改回原厂口径**，
而这是买家照着钻孔的那个数。玻璃上多开 4mm 退不回去。
现在写成 `scripts/apply-client-fixing-holes.mjs`（M8 才改，M6 保持原厂 φ12/φ8 ——
甲方三次说的都是 M8，没覆盖 M6），并由 `src/lib/rayen-paths.test.ts` 跑 `--check` 守住。
**顺序：merge-artunion-specs.mjs 之后必须跑这一步。**

**1b. 35 个拉手的 `Projection` 从来就不是突出。**（2026-09-16）
它们成对带着 `Projection` / `Rose depth` 两行，两行都是错的。图纸把突出写成立面底部的
尺寸链 —— T1263 是 `22 | 30 | 52`，22 的杆径加 30 的净空等于离门面 52 —— **大的那个才是突出**。
转录时取了小的那个，而小的那个每张图还不是同一个量：T1050、T2930 取的是**门厚**，
T1224 取的是**背板宽**，G1226 取的是底座在门面上的投影。
现在 `Rose depth` 的数值移进 `Projection`，`Rose depth` 整行删掉 —— 原来 `Projection` 里那个数
每张图含义都不一样，再给它编一个标签就是把同样的错再犯一次。
T811 两行都删了：它的图纸上 `55` / `68` 是底座投影宽度，而原来的 `35` 图纸上根本没有。
G1289、G777 本来只有 `Rose depth` 没有 `Projection`，第一轮按「成对」筛没筛出来，图纸画法一样（`30 | 69.5`、`25 | 61.5`）。
BH38/39/42/54 不动，它们没有原厂图纸，数来自 `scripts/cad-dimensions.mjs`（CAD 量的），
而且本来就是正常的大小关系。
脚本 `scripts/apply-pull-handle-projection.mjs`，源清单和产品记录一起改，
`rayen-paths.test.ts` 跑 `--check`。**顺序：同上，merge-artunion-specs.mjs 之后。**

**2. 同款式配对只在单份清单里数，跨清单就断了。**
`ingest-union-handles.mjs` 原来只统计当前这份清单里的 styleFamily，够不够两个。
G2110 挪进 union-handles-rebuilt.json 之后，搭档 T2110 还留在 b1，这一家就只剩一个，
字段被丢掉，`product-sites.test.ts` 报「2110 只有 T2110」。
配对是目录层面的事实，和它是哪一批进来的没关系 —— 现在跨全部清单统计。

**3. 顺带证明了 `seededFrom` 那个修复是对的。**
改完 G1216 图纸上的日文之后重跑，英文站自动「重新取底 8 张」——
正是 delocalize 改过的那 8 张图纸。没有这个修复，**英文站那 8 张会一直留着日文**。

**4. 加一张图纸的日文方框，坐标要比肉眼量的再往左一点。**
G1216 第一次量的 x=116 看着刚好，实际 断 字的笔画伸到 x=107，
盖完之后「截面形状」左边还立着一小截残笔。改成 x=104/w=82 才干净。

## 2026-09-15 —— 甲方一句「搜T2973」查出来的连锁问题

**1. UNION 变体去重把长度档吃掉了（17 个型号中招）。**
`scrape-artunion-specs.mjs` 原来按 `-L####` 后缀分组取一个变体。甲方自己上 UNION
搜 T2973，搜出 3 条，我们缓存里只有 1 条 —— 因为 T2973 的三档写成结尾字母
（`-01-023-A/B/C`），没有 `-L####`，全归到 `"base"`，只留第一个。
改成「型号后面的数字段是 finish/colour，再往后才是区分件号的部分」，重跑全站，
**17 个型号的变体回来了**，型号后缀的含义也拼出来了：

    -L / -R        左手 / 右手（T2522、T2751、T1780、T1018、T1263、T3103、G27）
    -A / -B / -C   长度档
    -P####         中心距选项
    -FIX           固定式（对可调式）

**2. 因此 35 个型号的可定制长度范围原来是错的。**
`merge-artunion-specs.mjs` 只引用「图纸印证过的那一个变体」—— 对重量和开孔是对的，
但拿它描述工厂能做什么就是错的。G1195 按 L1200 图纸印证，页面就写 1200mm，
而 UNION 上它是 700–2400 按单定制。要 2100mm 的买家看一眼就走了。
新增 `Available lengths` 行（跨所有变体算跨度），被引用的那个变体保留自己的出处不变。
G2690 600–2460、G620 600–2400、T2973 1600–3100。

**3. HYDE 的搜索索引里混着 196 个只上雷茵的产品，点开全是 404。**
`build-search-index.mjs` 直接读 `content/products`，没走 `products.ts` —— 而
`onHydeCatalogue()` 的注释恰恰写着「sitemap、搜索索引、finder、counts、llms.txt
都遵守这条规则，谁都不用知道它存在」。搜索索引是唯一的例外，注释是错的。
769 条里 196 条是死链，占四分之一。死链审计查 HTML 里的 `<a>`，这些是运行时
fetch 的 JSON 字符串，查不到。已修 + `src/lib/rayen-search.test.ts` 守住。

**4. 雷茵搜索框（`src/components/rayen/SearchBox.tsx`）。**
排序逻辑 import HYDE 的 `search-matching.ts`，不复制 —— 那里每条规则都是有人
搜坏了才加的，复制一份两个月就分叉。索引中英文各一份，首次打开才下载。
索引里存的是**不带语言前缀的路径**：Next app 里雷茵在 `/zh/`，部署后在 `/`，
而前缀重写只覆盖 HTML 不覆盖 `_next` 里的 JS —— 前缀烘进去必然有一边是错的，
所以改成运行时从 `location.pathname` 读。

中文不用分词器：三字以上走 substring，两字走 `startsWord()`（只要求前一个字符
不是拉丁字母或数字，在中文里恒真）。两种都能命中。

**5. `next dev` 有个既有的构建错误**（`src/app/zh/rayen.css` CSS 解析失败，
generated CSS 里混进了 `</script><script>self.__next_f.push`）。
把 SearchBox 摘掉重试，**错误照旧**，所以不是这一轮引入的；生产构建是过的。没动它。
