# 七语种全栈镜像 M1–M4：工程底座落地（746 页 × 7），术语表、界面、品类、问答、521 条产品七语种合入

**agent**: Claude（多语种会话，E:/cantonlock-hyde）· **日期**: 2026-09-25 · **任务文件**: `docs/collaboration/tasks/2026-09-25-seven-locale-full-mirror.md`

## 甲方要什么

> 新的七种语言没有问题的，现在就是需要全量全栈模仿英西葡，需要是一个完整的一样的站点……你配合 release build 去做，
> 做完做好，建个 hook 自动工作跟踪，确保完成保质保量。

## 这一批做成了什么

- **`/fr /de /ja /ko /tr /ru /ar` 从 7 页落地站升为与 `/es` 同形的完整站点**：每棵树 26 条路由，构建出 **746 页 × 7**（与 `/es` 的 746 页一一对应），
  全站 `out/` 共 7,466 个 `index.html`，`sitemap.xml` 14.9 MB（单 urlset，拆分见「风险」）。
- **覆盖层架构**（`src/lib/i18n.ts` + `content/i18n/<code>/*.json`）代替第 4–10 套后缀字段：`t / tx / dict / withOverlays / specLabels`；
  英文回退**可见且被计数**。`src/lib/i18n.test.ts` 锁行为。
- **镜像 / hreflang / sitemap / llms.txt 十语泛化**：`mirrorsOf()`、`alternateLanguages()`、`localeUrl()`；构建出的西语页也已互指十语（互惠性验过 `out/es/**` 的 hrefLang 集合）。
- **路由生成器** `scripts/scaffold-locale-routes.mjs`（19 静态 + 7 动态模板 → 7 × 26 个 `page.tsx`），`test:export` 里 `--check` 守着；
  页面组件在 `src/components/locale-pages/`（19 个），首页文案 `src/data/home-locale.ts`。
- **翻译流水线**：`i18n-extract-ui.mjs`（664 句界面文案键）→ `i18n-batch.mjs`（按语种/类型切片，产品范围 = 521 条在售 HYDE）→ 子代理填 `target` →
  `i18n-merge.mjs`（拒绝空译、同英、丢型号/占位符、非日语汉字、东方数字、bidi 控制符）。作业说明 `docs/collaboration/2026-09-25-i18n-job-brief.md`。
- **自动跟踪钩子**：`.claude/settings.json` 的 Stop 钩子跑 `scripts/track-locale-mirror.mjs`，重写 `docs/collaboration/LOCALE-MIRROR-STATUS.md`（每语种：路由 / 术语表 / 品类 / 界面 / 问答 / 产品 / 新闻 / 指南 / 案例 / 页面英文残留）。`npm run status` 与 `npm run i18n:board` 同。
- **RTL**：`scripts/convert-rtl-logical.mjs` 把物理方向工具类改为逻辑类（`ps-/pe-/ms-/me-/start-/end-`），照片热点 CSS 刻意不动；`/ar/` 的 `<html dir="rtl">`。
- 旧的七页落地站（`src/components/market/`、`src/data/market/`、`market-*.ts`、`scaffold-market-routes.mjs`）删除；其文案归档到
  `docs/collaboration/archive/market-copy-2026-09-24/`，已由 `i18n-seed-from-market.mjs` 播入 `ui.json`（每语种 ~60 句）、`categories.json`（17）、`faq.json`（15）。

## M2 术语表 + M3 界面文案（同一提交）

七个母语写手子代理（每语种一个）按 `docs/collaboration/2026-09-25-i18n-job-brief.md` 填完 `tmp/i18n/<code>-glossary-*.json` 与 `<code>-ui-*.json`，
经 `i18n-merge.mjs` 校验合入：每语种术语表 ~1,087 条（specLabels 246 / specValues ~640 / finish 41 / material 48 / category 19 / product 99），
界面文案 ~600 句（`ui-keys.json` 现为 662 键；ui.json 里多出的键来自 09-24 落地站文案的播种，无害）。

写手集体撞上的三个规则问题，已在脚本里改掉而不是让译文迁就：

| 问题 | 处理 |
|---|---|
| 合并拒绝「与英文相同」，写手于是把 `80 kg` 写成 `80 kilogram`、`Canton Hyland` 写成 `L'entreprise Canton Hyland` | `i18n-merge.mjs`：品牌名与只含数字/单位/代码的值允许相同；新脚本 `i18n-prune-untranslatable.mjs` 把这类条目删掉（无条目即回退英文，就是正确文本），本次删 ~360 条 |
| `i18n-extract-ui.mjs` 把 `LOCALE_TAG` / `LANGUAGE_LABELS` 里的 `en: "en-GB"` / `en: "English"` 当成界面句子，德语写手译成了 `de-DE` / `Deutsch` | 提取器跳过 `src/lib/i18n.ts`、`language-choices.ts`、`src/data/locales.ts`；两键从七份 ui.json 删除 |
| 三个子类 slug（door-hinges、flip-up-grab-bars、fixed-grab-bars）不在 categories.json 里 | 写手自行命名，已进 glossary.categoryNames；下一批 categories 作业会补齐 |

写手报告的源文本问题（供英文文案会话）：一条 specValue 源是西班牙语、一条是 `Electroplatingbhgh.`、一条 `left a right-handed`。

## M4 产品 521 × 7（同一提交）

七个产品文案子代理各跑 9 片（60 条/片），521 条在售 HYDE 产品的 name / summary / description / features / specs.value 七语种全部合入
`content/i18n/<code>/products.json`（规格 label 保持英文，经术语表集中翻译）；品类子类名 29 个、问答余下 1 条同批补齐。看板：术语表 / 品类 / 界面 / 问答 / 产品（三字段）七语种全 100%；
「产品字段」67% 差的是 seoTitle / seoDescription（521 × 2 × 7），按分工归工程会话的标题生成器。案例 5 篇：ja/ko/tr/ru/ar 已合入，fr/de 与新闻 37、指南 44 的子代理在 API 会话限额（重置 07:30 America/Los_Angeles）时中止，作业文件在 `tmp/i18n/`（71 个），重派即可。

写手集体报告的**英文源缺陷**（转文案会话）：DS011 门吸的摘要写成 flush bolt；DSL02 / DC01 列为 panic exit device 却是 door coordinator；HY-0SS 列在 lock case 实为 latch guard；
DV05/DV06 表面列表里多一个 "n"；DS05 用西里尔字母 ф 当直径符号；"500m"（应为 500mm）；AR4-1121 "40 backset" 无单位；LC9045 的 45 mm 中心距 / 90 mm 背距疑似写反；
9007 "Stainless steel stainless steel handle"；HY007-S "function function"；70750 PB 有编辑标签 "Optimized Description:" 当卖点；一条 specValue 源是西班牙语、一条 "Electroplatingbhgh."。
合页类 25 条摘要文案会话已改英文源（B024/B025 黄铜写成不锈钢；23 条嵌类目名），待其推送后按 slug 重译摘要。

**客户端包体**：术语表与界面合入后，15 个 `"use client"` 组件经 `@/lib/i18n` 把七语种全部覆盖层拖进浏览器，首页一个 chunk 1,267 KB（预算 1,200 KB，`static-export-performance.test.ts`）。
拆成 `src/lib/i18n-core.ts`（规则，无数据）、`src/lib/i18n.ts`（服务端，全量覆盖层）、`src/lib/i18n-client.ts`（客户端，只读
`src/data/generated/i18n-ui-client.json`：`scripts/build-i18n-client-ui.mjs` 从 ui-keys.json 的出处出发，沿客户端组件的 import 图取可达的 169 句 × 7 语种，111 KB）。
`i18n-merge`/`i18n-prune` 合并 ui 后自动重生成；`test:export` 里 `--check`。**客户端组件不得 import `@/lib/i18n`**。

**发布后两处性能修正**（发布会话 09-25 线上实测）：
- 客户端字典曾是一个 218 KB（gzip 104 KB）的 chunk，每一页都下载，英西葡也不例外，法语手机首绘 1.8 s → 2.7 s。改为每语种一个
  `src/data/generated/i18n-client/<code>.{json,tsx}`，由该语种根 layout 渲染 `<I18nClientBundle />` 注册到 `src/lib/i18n-client.ts` 的注册表：
  英西葡页零字节，新语种页只带本语种约 30 KB。首页 JS：en 773 KB，de 798，ar 804（预算 1,200）。
- `/model-lookup/` 的客户端组件经 `lib/model-index.ts` 拖进整本目录 + 七语种覆盖层，chunk 17 MB。纯函数拆到 `src/lib/model-index-core.ts`。
- sitemap：`/sitemap.xml` 保持全量（十几个脚本和审计都读它），另加 `/<locale>/sitemap.xml`（`src/lib/locale-sitemap-xml.ts` 从同一份 `src/lib/site-sitemap.ts` 条目按前缀切片；七语种路由由 scaffold 生成，es/pt 手写），robots.txt 全部列出。按语种建的 Search Console 资源只能收其路径下的 sitemap，这就是给它的。

**hreflang 互惠修复**：`(en|es|pt)/products/[category]/[slug]/page.tsx` 三处硬编码 en/es/pt 的 `languages` 改为 `alternateLanguages()`，
否则七语种产品页指向英西葡而对方不指回，`scripts/seo-audit.test.mjs` 报 10,841 处 `hreflang-not-reciprocal`。

## M5–M7 文章（后续提交 85d024a03a6 … 及之后）

新闻 37 篇 × 7、案例 5 篇 × 7 已合入；指南 44（+1 新增）逐批合入中。写手的英文源报告已转文案会话并改好 47 条记录，
用 `git diff <old>..<new> -- content/products` 算出变动字段，`i18n-batch --slugs` 只重译这些字段。工程会话把七语种 seoTitle/seoDescription 写进了
`products.json`（看板「产品字段」升到 100%），并按文案会话定名改了三条 slug（dsl02/dc01 → door-coordinator，hy-0ss → latch-guard）。

**并发纪律（本轮学到的）**：子代理只写 `tmp/i18n/` 和经 merge 写 `content/i18n/`；改 `i18n-merge.mjs` 时先写临时文件再 `mv` 原子替换，因为七个子代理随时在调用它；
提交前把每个暂存的 JSON `git show :path | JSON.parse` 一遍，防止抓到写了一半的文件。

## 测试

| 检查 | 结果 |
|---|---|
| `npm run typecheck` | 通过 |
| `npm run lint` | 0 个我的错误。剩 3 个 `react/no-unescaped-entities` 在 `src/app/(en)/certifications` 与 `contact`（英文页，非本次改动，归英文文案）；`es/pt` 产品页两个未用变量同理 |
| `npm test` | **通过**（含新 `i18n.test.ts`、`locale-route-parity.test.ts`、`seo-policy.test.ts`、`language-choices.test.ts`）。曾失败的 `door-prep-drawings.test.ts` 见下 |
| `npm run build` | 通过，8,627 个输出文件，7,466 页；首页 JS 从 2,233 KB（拆分前，含七语种全部覆盖层）降到 964 KB（预算 1,200 KB） |
| `npm run test:export` | 通过（含 hreflang 互惠、首页包体、scaffold 与客户端子集 `--check`） |

**顺手修的一个别人的回归**：`e834ca7c4df`（美式拼写第二批）把 `scripts/build-door-prep-drawings.mjs` 的行标签改成 `Center distance`，但 96 条产品记录仍是 `Centre distance`，
`prebuild` 一跑门孔图索引就归零、`door-prep-drawings.test.ts` 失败、95 张门孔图从站上消失。生成器现在两种拼写都认（`CENTRE_LABELS`），索引回到 95 张。
工程交接会话请在拼写批次里把这 96 条记录的标签统一掉，再把 `Centre` 从列表里拿走。

## 没碰的

雷茵车道一切（`out-rayen/`、`public/search-index-rayen-*.json` 构建时被重写，不提交）；`content/products/**`；`src/app/(en|es|pt)/**` 只改了三个根 layout 的 hreflang；
`public/images/drawings/*.svg` 与 `src/data/generated/*` 的构建期重写不提交（发布会话的干净检出会自己生成）。`out/` 不提交 —— **请发布会话跑 `npm run release:hyde -- --root E:/release`**。

## 风险与待办

- 七棵树上界面与规格表已是本语种，**产品名/摘要/卖点、文章仍是英文回退**（看板产品列 0%）。M4 起逐批推进。
- `sitemap.xml` 14.9 MB 单文件，低于 50 MB / 50,000 URL 上限但不宜再涨；按语种拆 sitemap index 需先改 `scripts/lib/seo-audit.mjs` 的解析，M4 前做。
- 甲方 09-25：五种语言（阿土俄日韩）母语抽查、`/de/` 上线后提交 Search Console 德国属性 —— 在 M8。

## 下一步

通知 HYDE 工程会话术语表与品类已可供标题生成器 → M4 产品 521 × 7（`i18n-batch.mjs --kind products --size 60 --all`，每语种 9 片）→ M5–M7 文章 → M8 母语抽查。
