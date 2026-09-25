# 七语种市场落地站：法 德 日 韩 土 俄 阿 上线工程

**agent**: Claude（多语种会话）· **日期**: 2026-09-24

## 甲方要什么

> 给 hyde https://cantonlock.com 做法德语 日韩语 土俄语 加个阿拉伯语，7 个地道 专业 流畅 语言页面 拿 seo 和 geo 权重。
> 不要管雷茵，只动 hyde。

## 做成了什么

七个语种各一个**市场落地站**，七页：`/{code}/`（首页）、`/products/`（目录总览）、`/company/`、`/services/`（OEM）、
`/certifications/`、`/faq/`、`/contact/`。代码：`fr de ja ko tr ru ar`。49 个页面，每个都是**从英文源文本按本语种重写**的，
不是逐句机翻（写作说明见 `docs/collaboration/2026-09-24-market-locale-brief.md`）。

**为什么是七页而不是像西葡那样 1,100 个产品全翻。** `Locale` 类型钥住十几本文案字典，产品记录每个字段都是
`nameEs / namePt` 后缀式，加一个语种要等 1,100 条产品译完才能编译过（`src/data/locales.ts` 头注释）；
`2026-09-24-copy-longtail-multilingual-plan.md` 第四节估的是每语种 1.5–2 周。七页是一个语种能**今天就上线、
且每一页都完整**的最大集合：公司、能做什么、认证、商务问答、怎么联系 —— 正好是答案引擎会引用、买家会搜的那几页。
目录本身留在英文，每个语种的页面**明说**目录是英文的（`products.englishNote`），链接用 `hrefLang="en"` 标出。

## 架构：市场语种是第二档，不进 `locales`

| 文件 | 作用 |
|---|---|
| `src/data/market-locales.ts` | 叶子模块：七个代码、`<html lang/dir>`、端名、七个镜像路径 `MARKET_MIRROR_PATHS`、`hasMarketMirror()` |
| `src/data/market/types.ts` | `MarketCopy`：一个语种的全部文案，一个对象，编译器守形状 |
| `src/data/market/source.en.ts` | 英文源文本，**不渲染**；七个译本只从它写 |
| `src/data/market/{fr,de,ja,ko,tr,ru,ar}.ts` | 七个译本，各约 280 条字符串 |
| `src/lib/market-mirror.ts` | `marketHref()` / `marketAlternates()`：hreflang 和 sitemap 用的 URL，不拉文案 |
| `src/lib/market.ts` | `marketPageMetadata()`：自指 canonical + 十语 hreflang + OG |
| `src/components/market/*` | 自己的页眉页脚（七个链接 + 十语菜单 `<details>`，无 JS）和七个页面组件；全部逻辑属性（`ms-/me-/ps-`），阿拉伯语 `dir="rtl"` 直接可用 |
| `src/app/{code}/**` | 由 `scripts/scaffold-market-routes.mjs` 生成的 1 个 layout + 7 个薄页面；`test:export` 里 `--check` 守着不许手改漂移 |

**为什么不用 SiteHeader / SiteFooter。** 它们渲染整个目录（17 个品类的大菜单、搜索、货架链接），每个标签都是
`Record<Locale,…>`，每个链接走 `localisedHref` —— 对市场语种来说第一下点击就会把读者弹回英文树（09-17 葡语那次事故的形状）。
七页的站就给七个链接。

## 接进了哪些既有系统

- **hreflang 双向**：`pageMetadata()` / `alternateLanguages()`（`src/lib/seo.ts`）在七个路径上加七个 alternate；
  三个根 layout 的首页簇也加了。市场页自己列 en / es / pt（若存在）+ 其余六个。`audit-seo` 的
  `hreflang-not-reciprocal` 现在两边都读同一个函数。
- **sitemap**：`buildLocaleSitemapEntries` 新增 `market` 参数，七个路径各多 7 条 `<url>`，共 49 条，同簇互指。
- **语言面板 / 页脚**：`languageChoices()` 和 `SiteFooter` 在三个全量语种之后列出七个市场语种；在七个路径上指同页，
  其他页指该语种首页并由面板说明（`samePage:false`，与西语缺页时同一套诚实分支）。
- **llms.txt**：新增「Other languages」一节，十个语种各一行。
- **`audit-no-chinese.mjs`**：`/ja/` 改为「连续 7 个以上汉字且无假名」才判中文（prep 文档第三节预告的坑），其余路径规则不变。
- **`seo-audit.mjs`**：`LOCALE_PREFIXES` 加七个，`<html lang>` 校验按前缀。
- **`normalize-us-spelling.mjs`**：跳过 `src/data/market/<code>.ts`（法语的 centre 不是英式拼写），只扫 `source.en.ts`。
- **字体**：`globals.css` 按 `html[lang]` 给日、韩、阿、俄各一套系统字体栈，Archivo 仍排在前面管拉丁型号和单位。
  不下载 CJK 字体文件（每个字重 4–8 MB）。

## 守卫（新增 44 条测试，`npm test` 464/464）

`src/data/market/market-copy.test.ts`，每个语种六条：字段与英文源一一对应；slug、品类键、报告编号原样；`{n}` 占位在；
meta 标题 20–45 字、描述 80–160 字且不截断；**没有一条字段还是英文原句**（型号、地名、数字字段除外）；
非日语不出现汉字，全部不出现东方阿拉伯数字和 bidi 控制符。
`locale-route-parity.test.ts` 加两条：七个语种各恰好七个路由 + layout；每个市场镜像路径在英文树里真的存在。
`language-choices.test.ts` 期望改为「三个全量语种 + 七个市场语种」。

## 译本里值得知道的判断（各子代理的报告，摘要）

- 德语：DIN EN 1125 标题 „Paniktürverschlüsse mit horizontaler Betätigungsstange"，只写 „geprüft nach"，不写 „konform"；
  科隆五金展写成 Eisenwarenmesse in Köln。
- 法语：法式标点用 U+202F/U+00A0（写入时被工具归一化过一次，已用脚本补回并核对码点）；night latch 无固定法语词，
  用 serrures en applique et verrous de sûreté。
- 日语：箱錠（モーティスロック）；耐久試験報告書 拆成 耐久試験の報告書 避开 7 连汉字；地名 中国・広東省中山市・小欖鎮。
- 韩语：Turkey 写 튀르키예；单位空格规则全站一致。
- 土耳其语：backset 保留英文（土耳其目录惯用）；千分位点。
- 俄语：`{n} моделей` 对 1–4 会读错（俄语复数三形），构建时替换的是 17、500+ 这类数，先用属格复数。
- 阿拉伯语：西式数字，型号不镜像；`مسافة الظهر / الباك سيت` 并写一次。
- 三个报告记录的 `reference: "See certificate"` / `coversModel: "Panic exit device series"` 按说明**原样照抄**，在七个页面上是英文。

**母语审校**：阿、土、俄、日、韩五种按 `2026-09-24-language-expansion-prep.md` 第三节仍建议抽查；这是唯一要花钱的环节，甲方定。

## 没做的、下一步

- 目录、文章、下载中心仍是英文；市场页每处链过去都标了 `hrefLang="en"` 并在页面上说明。
- 联系页没有表单：表单服务是英文字段和英文回执，改成德语表单收英文回执更误导；给的是三个邮箱 + 英文表单链接。
- 德国 BAU 2027 前：把 `/de/` 提交到 Google Search Console 德国属性；俄语要 Yandex、韩语要 Naver 站长后台（甲方注册）。
- 后续如要给某个语种加第八页，改 `MARKET_MIRROR_PATHS`，编译器会点名七个文案文件里缺的字段，脚手架脚本补路由。
