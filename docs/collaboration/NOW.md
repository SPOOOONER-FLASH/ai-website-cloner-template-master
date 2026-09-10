# NOW — 谁正在动哪些文件

**这个文件存在的唯一目的：把「这 140 个 JSON 是谁改的？」从一次五轮调查，变成一次 `cat`。**

开工前 `cat docs/collaboration/NOW.md`。要动一批文件（超过 3 个，或任何 glob）之前，
在表里加一行；那批工作提交后，删掉自己那行。**删自己的行，不删别人的。**

一行的成本约 50 token。一次「工作树里冒出 140 个我没动过的文件，我得先搞清楚是谁的」
的调查，成本是几千 token 加一次停工 —— 2026-08-31 Codex 就为此中断过一次展会任务。

## 正在进行

| agent | 路径 | 在做什么 | 开始时间 |
|---|---|---|---|
| Codex recovery | docs/design-references/2026-09-09-professional-hardware-sets/, scripts/build-hardware-image-board.mjs, scripts/blender/hardware-photo-stage.py, docs/research/2026-09-09-hardware-image-standards.md | Source-led set corrections, top20 evidence matrix and review board; no production assets or out/ | 2026-09-09 |
| Claude | content/products/**, public/images/**, public/videos/**, out/, out-rayen/ | DS011 改名、12 个单图型号补图、位置语言面板，重出构建并部署 | 2026-09-08 |
| Codex | scripts/blender/9004s-published-shell.py, docs/design-references/2026-09-07-home-stills/models-9004s | Published-dimension exterior model and evidence; no site geometry publication | 2026-09-08 |
| Codex | scripts/blender/editorial-stills.py, scripts/build-editorial-stills.mjs, docs/design-references/2026-09-07-home-stills | Three real-photo architectural still-life previews; no carousel change | 2026-09-07 |
| Codex | `docs/design-references/2026-09-09-style-batches/` | Two reference-derived image libraries: 20 real-product plates + 20 original architecture scenes | 2026-09-09 |

> ⚠ 2026-09-08：甲方通知 Codex 下线（服务器崩溃），并指示 Claude 直接部署。
> 上面两行 Codex 的认领因此是**停在半途的记录**，不是进行中的工作——保留是因为
> 那是他们的记录，但下一个会话不必等它们。他们未提交的 HeroCarousel.tsx 与
> static-export-performance.test.ts 经哈希核对只有行尾符差异，内容与 HEAD 一致，
> 所以本次构建没有烤进任何未提交的源码改动。

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
