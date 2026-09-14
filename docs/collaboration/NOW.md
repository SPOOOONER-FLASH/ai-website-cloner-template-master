# NOW — 谁正在动哪些文件

**这个文件存在的唯一目的：把「这 140 个 JSON 是谁改的？」从一次五轮调查，变成一次 `cat`。**

开工前 `cat docs/collaboration/NOW.md`。要动一批文件（超过 3 个，或任何 glob）之前，
在表里加一行；那批工作提交后，删掉自己那行。**删自己的行，不删别人的。**

一行的成本约 50 token。一次「工作树里冒出 140 个我没动过的文件，我得先搞清楚是谁的」
的调查，成本是几千 token 加一次停工 —— 2026-08-31 Codex 就为此中断过一次展会任务。

## 正在进行

| agent | 路径 | 在做什么 | 开始时间 |
|---|---|---|---|
| Codex image completion | scripts/*curated*, scripts/blender/curated-hardware-scenes.py, docs/design-references/2026-09-14-curated-hardware/, public/images/editorial/curated-*, public/images/product-studies/, home EN/ES, ProductStudies, editorial config, news hero selection | Final reviewed image selection, original-photo details and two scene replacements; source QA then export if out remains clean | 2026-09-14 |
| Codex studies release | src/app/(en)/product-studies/, src/app/es/product-studies/, src/components/site/ProductStudies.tsx, src/data/generated/product-studies.json, scripts/publish-hardware-studies.mjs, public/images/product-studies/, out/, out-rayen/ | Publish approved real-photo studies EN/ES, catalogue entry, verify and deploy export; out was clean | 2026-09-10 |
| Claude | content/products/**, public/images/**, public/videos/**, out/, out-rayen/ | DS011 改名、12 个单图型号补图、位置语言面板，重出构建并部署 | 2026-09-08 |
| Codex | scripts/blender/9004s-published-shell.py, docs/design-references/2026-09-07-home-stills/models-9004s | Published-dimension exterior model and evidence; no site geometry publication | 2026-09-08 |
| Codex | scripts/blender/editorial-stills.py, scripts/build-editorial-stills.mjs, docs/design-references/2026-09-07-home-stills | Three real-photo architectural still-life previews; no carousel change | 2026-09-07 |
| Codex | `docs/design-references/2026-09-09-style-batches/` | Two reference-derived image libraries: 20 real-product plates + 20 original architecture scenes | 2026-09-09 |

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
