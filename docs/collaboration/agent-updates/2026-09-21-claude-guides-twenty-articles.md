# Claude → Codex / Spooner：/guides 开栏，二十篇一次上线

**Agent**：Claude　**范围**：`content/guides/**`、`/guides` 三语路由、英制换算、PT-BR 守卫
**测试**：`npm test` 353 通过（含 Codex 新增的 3 个 article-layout），`tsc --noEmit` 干净，`eslint` 干净
**没碰**：`out/`、`out-rayen/` —— 见下面「构建 baton」

## 做了什么

新开 `/guides` 栏目，二十篇三语查表文一次性上线。现有 35 篇 `/news/` **一篇都没有挪**，
URL 全部不变，这是客户明确要求的。

二十篇合计 29,330 个引擎可见词（summary + body + FAQ），**平均 1,467 词**。
对照：现有 35 篇的同口径平均是 1,098 词。每篇 6 条 FAQ，英西葡各一份，
JSON-LD 走原有的 FAQ 源。

| 篇 | 主题 | 数据来源 |
|---|---|---|
| euro-cylinder-size-chart | 九个总长、拆分组合 | 本厂 45 条锁芯记录 |
| backset-door-thickness-chart | 距心与门厚分布 | 本厂 589 条记录 |
| en-ansi-bhma-cross-reference | EN 与 ANSI/BHMA 对照 | 公开标准 |
| finish-code-reference | 23 个表面代码 | 公开标准 + 本厂目录审计 |
| cycle-testing-durability-grades | 循环次数与等级 | 公开标准 |
| container-loading | 装箱密度 614 kg/m³ | `content/packing-data.json` |
| door-closer-power-size | EN 1154 力量 1–7 | 公开标准 |
| hinge-grades-and-count | EN 1935 与铰链数量 | 公开标准 |
| door-hardware-hs-codes | 8301 / 8302 子目 | WCO HS 目录 |
| spindle-sizes-and-length | 方轴 8/9mm、长度公式 | 本厂目录实测值 |
| strike-plates-and-keeps | ANSI 与 T-strike、唇长 | 公开标准 |
| door-preparation-161-and-86 | 161 孔位、86 槽 | 公开标准 |
| corrosion-resistance-en-1670 | 等级 0–5 与盐雾小时 | 公开标准 |
| moq-tooling-and-lead-time | 300–5,000 件、30 天起 | 本站已发布 FAQ |
| door-closer-mounting-positions | 四种安装方式 | 公开标准 |
| key-blanks-and-restricted-profiles | 开放/受限/专利齿型 | 公开标准 |
| lever-return-and-en-1906 | 把手回弯与八位分类 | 公开标准 |
| fire-door-hardware-what-must-be-rated | EN 1634-1 / UL 10C | 公开标准 |
| glass-door-thickness-and-cutouts | 8–14mm、R6 | 本厂目录实测值 |
| samples-and-incoming-inspection | 封样与验货 | 本厂做法 |

**每一个数字都能指回一个来源，来源写进文章正文。** 没有来源的行是缺的，不是猜的。

## 按 Codex 的渲染合同做的四件事

读了 `2026-09-21-codex-article-rendering-contract.md`，四条要求都落实了：

1. **管道表**。查表数据全部从散文段落改写成 Markdown 管道表 —— 7 篇文章、三语、
   **27 张表**，用 `scripts/guide-lookup-tables.mjs` 生成，幂等，`--check` 可进 CI。
   拿 `articleBlocks()` 跑过全量：27 表 / 417 标题 / 1386 段，无未知块、无空表、
   每张表的数据行宽度都和表头一致。
2. **heroImage**。13 篇缺字段（会在 `applyImageAltOverride` 于草稿过滤前抛错）。
   `scripts/add-guide-hero-images.mjs` 补上，用的是你那张 provenance 写明
   「contains no hardware」的生成背景 —— 那是唯一能安全当通用封面的生成图，
   标签如实说它是一张空桌面，不暗示展示了任何产品。
3. **你点名的那张缺图**：`ju-088-door-closer-16x9.webp` 是我按命名习惯推出来的，
   磁盘上没有。真图是 `ju-088-door-closer.webp`，**1000×1000 方图**，所以连
   `16 / 9` 这个比例也是错的。两篇闭门器文章都改成真实照片和 `1 / 1`。
   脚本里加了第二道检查：**heroImage 指向的文件必须真的在 `public/` 下**。
   静态导出不会因为图 404 失败，这种错误会一路走到线上。
4. **`article-layout.test.ts`** 已接进 `package.json` 的主 `test`，353 通过。

## 顺手修的一个守卫漏洞（这条请看一眼）

`src/data/portuguese-brazilian.test.ts` 一直在扫 `content/**/*.json`，但它用**行正则**：
`"bodyPt": [` 后面不是字符串，`*Pt` 模式匹配不上，回退逻辑只读下一行 ——
**一篇 27 段的文章只被检查了第一段**。`faq.pt` 更糟，键是裸 `pt` 不是 `*Pt`，整块从没被读过。

结果是 14 个 `registos` 静静躺在三篇文章里。改成**解析 JSON 再走查**之后，
立刻又抓出 11 处旧版看不见的欧葡（`contacto` / `humidade` / `facto` / `planeado` /
`está a + 不定式`），全部修正。

同时收紧了一条正则。`/\best(á|ão) a [a-zà-ÿ]+r\b/` 要求「以 r 结尾」，
但葡语比较级也以 r 结尾 —— 它把已上线文章里的
「entre esses dois casos **está a maior** parte do mundo」报成了欧葡结构。
那是完全正确的巴葡。**会对好句子报警的守卫会被人删掉**，所以比较级按名字排除，
词尾收窄到真正的动词不定式。现在守卫通过，且那条误报没了。

## 构建 baton 在你手上

`out/` 脏 12,726 个文件、`out-rayen/` 脏 3,506 个，`NOW.md` 上也是你的行。
按 AGENTS.md，**我没有构建、没有跑 `deploy:prep`、没有 `git add out/`**。
这次提交只有源码。

发布这二十篇需要你这边做一次构建。提醒两点，都是 AGENTS.md 里用事故换来的：

- 重建后 **先 `git add out/ out-rayen/` 再 commit**。pathspec 形式不会加未跟踪文件，
  2026-09-10 因此漏掉 1,871 个文件、两个首页引用的 chunk 404。
- 推之前确认 `git status --short out/ | grep -c '^??'` 读数为 **0**。

## 留给你 / 客户的三件事

1. **`NewsCard` / `NewsDetail` / `JsonLd` 已按你的说明整体提交**（我的 section 路由 +
   你的视觉集成在同一份 diff 里）。`docs/collaboration/patches/` 那份补丁**不要再 apply 一次**。
2. **`eng.traineddata`（5MB，tesseract 英文模型）已加进 `.gitignore`**。OCR 时按需下载，不进仓库。
3. **有一个产品数据错误我没动**：15 个产品的规格表里 `Spindle Hole` 这一行写的是
   `Copper Construction` —— 材料写进了尺寸行。读者扫规格表时看到「Spindle Hole」
   会期待一个 mm 数。正确的修法是改标签而不是编一个孔径，**真实孔径得问工厂**。
   已开成独立任务，没有塞进这次提交。

## 下一步

第二批文章按 `docs/collaboration/tasks/2026-09-21-two-week-seo-geo-plan.md` 走。
选题时**避开现有 35 篇 + 这 20 篇**已覆盖的题目 —— 这次排选题时已经撞掉过
「不锈钢 201/304/316」（`/news/` 里有）和「把手朝向」（同上），换成了 HS 编码和封样验货。
