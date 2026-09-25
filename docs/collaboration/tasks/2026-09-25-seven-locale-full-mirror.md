# 七语种全栈镜像：法 德 日 韩 土 俄 阿 与英西葡完全一致（2026-09-25 起）

> 甲方 09-25：「新的七种语言没有问题的，现在就是需要全量全栈模仿英西葡，需要是一个完整的一样的站点……
> 你配合 release build 去做，做完做好，建个 hook 自动工作跟踪，确保完成保质保量。」

**这份文件是这项工程的唯一进度真相。** 每个会话开工先读它和 `docs/collaboration/LOCALE-MIRROR-STATUS.md`
（脚本生成的覆盖率看板），做完一批就更新第四节的勾选并提交。

## 一、目标

`/fr /de /ja /ko /tr /ru /ar` 七棵树各 26 条路由（`/pt` 的路由集 + `/products/argentina-ar4`），与 `/es` 对齐：首页、products（索引 / 17 品类 / 521 个在售 HYDE 产品 / argentina-ar4）、
collections、compare、configurator、product-finder、product-studies、projects（+5 篇）、news（+37 篇）、guides（+44 篇）、
downloads、finishes、model-lookup、glossary、documents、faq、certifications、company、contact、services。
每一页的**界面文案、页面文案、产品字段、规格表、文章正文**都是本语种，英文只作为可见的、被计数的回退。

## 二、架构：覆盖层（overlay），不是第 4–10 套后缀字段

西葡是 `nameEs / namePt` 后缀字段，29 个字段 × 1,110 条记录，再加七套会把每个产品 JSON 撑到 200 个键。
七个新语种的译文放在 **`content/i18n/<code>/`**，构建时叠到记录上：

| 文件 | 键 | 内容 |
|---|---|---|
| `ui.json` | **英文原句** | 界面与页面文案：`{"Frequently asked questions": "Häufige Fragen"}`。用英文句子做键，代码里不用改键名 |
| `products.json` | 产品 slug | `{ name, summary, description, features[], specs[{label,value}], seoTitle, seoDescription }` |
| `categories.json` | 品类 slug | `{ name, summary, children: { <slug>: { name } } }` |
| `news.json` / `guides.json` | 文章 slug | `{ title, summary, body[], seoTitle, seoDescription, faq[{question,answer}] }` |
| `projects.json` | slug | `{ name, buildingType, summary, body[], seoTitle, seoDescription }` |
| `glossary.json` | 英文 | `{ specLabels, specValues, finishNames, materialNames, categoryNames, productNames }`，与 `es-glossary.ts` 六张表同形 |
| `faq.json` | 英文问题 | `{ question, answer }`；分组标题走 ui.json |

读取全部经 **`src/lib/i18n.ts`**：

- `t(record, "name", locale)`：es/pt 读后缀字段，七语种读 `record.i18n[locale].name`，都没有就英文。
- `tx(locale, "English sentence", { es, pt })`：界面短句。七语种查 `ui.json`，查不到回英文。
- `dict(COPY, locale)`：整本文案字典。七语种把 `COPY.en` 的每个字符串过一遍 `ui.json`，`href` 走 `localisedHref`。
- `specLabels(locale)` / `localiseProductValues(values, locale)`：规格表走 `glossary.json`。
- **`"use client"` 组件只能 import `src/lib/i18n-client.ts`**（同名 `tx/dict`，数据是 `scripts/build-i18n-client-ui.mjs` 生成的客户端可达子集 `src/data/generated/i18n-ui-client.json`）；`src/lib/i18n.ts` 带全量覆盖层，进了客户端包首页就超预算（09-25 实测 1,267 KB）。
- 不可译条目（品牌名、纯数字/单位/代码）不入覆盖层：规则在 `scripts/lib/i18n-untranslatable.mjs`，merge 放行、`i18n-prune-untranslatable.mjs` 清理、看板不计分母。

**回退可见且被计数**：`scripts/track-locale-mirror.mjs` 按语种、按类型数出「还是英文」的字段，写进看板；
`scripts/audit-locale-pages.mjs --locale de` 读构建出的 HTML，用西语作对照组找出页面上残留的英文短语（葡语那套方法）。

路由由 `scripts/scaffold-locale-routes.mjs` 从模板生成（22 条 × 7），页面组件在 `src/components/locale-pages/`，
每条路由文件只有几行；`test:export` 里 `--check` 守着。

## 三、翻译流水线（保质）

1. `node scripts/i18n-batch.mjs --locale de --kind products --size 60 --all` → `tmp/i18n/de-products-001.json …`（英文源 + 空目标；`--kind ui|glossary|categories|faq|news|guides|projects` 同理）。填法见 `docs/collaboration/2026-09-25-i18n-job-brief.md`。
2. 母语写手子代理按 `docs/collaboration/2026-09-24-market-locale-brief.md` 的规则填目标（不是逐句对译）。
3. `node scripts/i18n-merge.mjs tmp/i18n/de-products-001.json`：校验（键齐、型号/标准/数字/单位原样、占位符在、非日语无汉字、无双向控制符、长度）后并入 `content/i18n/de/products.json`。
4. `npm test`（含 `src/lib/i18n.test.ts`）→ `npm run i18n:board`（看板）→ 提交 → `npm run ship`。
5. 每个阶段结束请发布会话跑 `npm run release:hyde -- --root E:/release`。

顺序：**术语表 → 品类 → 产品（名/摘要/规格/卖点/SEO）→ 界面 → 新闻 → 指南 → 应用案例**。
术语表先做，因为规格值的翻译在构建时查表，一次翻 2,800 个键覆盖 6,538 行规格。

## 四、里程碑

- [x] M1 工程底座（09-25 完成，见 agent-updates/2026-09-25-claude-seven-locale-mirror-m1.md；746 页 × 7）：locales 扩到 10、`i18n.ts`、覆盖层加载、`dict/tx/t` 替换全部 `[locale]` 与三元、镜像/hreflang/sitemap 泛化、22 条路由 × 7 生成、构建与 `test:export` 全绿（英文回退可见）。
- [x] M2 术语表七语种（09-25，~1,087 条/语种；不可译条目按 `i18n-prune-untranslatable.mjs` 规则不入表）。
- [x] M3 界面文案 ui.json 七语种（09-25，662 键；`en-GB`/`English` 等常量表不再提取）。
- [x] M4 产品 **521 条在售 HYDE 记录** × 7（09-25 合入；seoTitle/seoDescription 归工程会话标题生成器；合页 25 条摘要待英文源改后重译）（`!sites || sites.includes("hyde")` 且有主图；发布会话 09-25 校正，雷茵专属的另一半不渲染）。分批，每批 60。
- [ ] M5 新闻 37 篇 × 7。
- [ ] M6 指南 44 篇 × 7。
- [ ] M7 应用案例 5 篇 × 7（ja/ko/tr/ru/ar 已合入，fr/de 待重派）、首页文案、下载中心。
- [x] M4b 材质一致性校验（09-25）：`i18n-batch` 产品作业带 `material`，`i18n-merge` 用 `scripts/lib/i18n-material.mjs` 拒绝「摘要提到别的金属却从不提本品材质」的译文（只查 summary；description 的模板句嵌类目名是英文源的问题，已转文案会话）。首轮跑出 42 条——8 条「颜色当材质」产品的摘要丢了 Zinc alloy——已重译。
- [ ] M8 母语抽查（阿、土、俄、日、韩）与页面级英文残留清零；Search Console 提交。

## 五、分工与守门

| 会话 | 做 |
|---|---|
| 多语种（Claude，E:/cantonlock-hyde） | 二、三两节的一切；不动 out/ |
| Cantonlock release build deployment | `release:hyde`；发布后 purge 提醒 |
| Hyde 文案 | 英西葡文案；本工程从英文源翻，不从西葡 |

自动跟踪：`.claude/settings.json` 的 Stop 钩子在每个会话结束时跑 `scripts/track-locale-mirror.mjs`，刷新看板；
`npm run status` 同样。看板里任何一格低于 100% 都是未完成。
