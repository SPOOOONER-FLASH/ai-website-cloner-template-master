# 葡语全通路：缺的五个路由建好，语言不再半路掉回英文

**agent**: Claude · **日期**: 2026-09-17

## 甲方报的 bug

> 我现在点选葡萄牙语，选择产品配置器和首页又变成了英文

这不是两个 bug，是一个。

`localisedHref` 在一个路由没有镜像时返回**英文裸路径** —— 对单个链接来说这是诚实的
答案，对一次访问来说是个陷阱：读者落到一个英文页面，**从那里开始，页眉、面包屑、
每一张卡片全是英文的**。一个缺失的路由，代价是整次访问的语言。

西语有 22 个路由，葡语只有 16 个。缺的五个里有四个在页眉上。

## 先做了一把尺子

`scripts/audit-pt-pages.mjs`（新，`npm run audit:pt:pages`）。

`npm run audit:pt` 数的是**字段** —— 产品名、文章正文、问答对 —— 9-17 它报
news 100%、products 96%，而甲方打开葡语站，点到哪儿都是英文。**两个数字都是真的。**
差距在所有不是字段的东西上：导航标签、按钮文案、表单标签、表头、空状态、
面包屑、筛选facet、组件里的字符串。字段审计看不见其中任何一个，因为它们都不是字段。

所以这个脚本读**构建出来的 HTML**，并且不猜语言：

> 一个短语只有在它**同时出现在 /pt/ 页面和对应英文页面，而西语页面里没有**时才被报出来。
> **西语是对照组。** 一个短语如果在西语里原样幸存，那它是型号、标准、
> acabamento 代码或品牌名 —— 不是英文散文，不报。西语改了而葡语没改的，就是没翻。

这就是它不需要词典也不会把「EN 1125」「SSET」「HYDE」「304/201」误报出来的原因。

**第一次运行：680 个页面里 675 个有英文，7,281 个不同短语。** 甲方是对的。

## 按影响面修

| 页面数 | 是什么 | 在哪 |
|---|---|---|
| 519 | 「Move across the image to inspect details…」 | `ProductImageZoom` 的一个两分支三元 |
| 415 | 「Common questions」+ 全部产品问答 | `product-faq.ts` 整张表只有 en/es |
| 250 / 152 / 46 | Stainless Steel / Zinc Alloy / Solid Brass | `localiseProductValues` 只查一张表，生成器查三张 |
| 83 | 「Door thickness」等表头 | `collection-spec-range` 与 `SpecMatrix` |

**那个材料的例子值得单独说。** `scripts/translate-products-pt.mjs` 读
SPEC_VALUES_PT、MATERIAL_NAMES_PT、FINISH_NAMES_PT 三张表；`localiseProductValues`
只读第一张。同一个问题，两个答案 —— 这正是 AGENTS.md 说的「一个事实存在两个地方」。

结果是：**同一个葡语页面上，规格表写「Zamak」，产品卡片写「Zinc Alloy」。**
两个都不算错，合在一页上就是没做完。而且「Zinc Alloy/304 Stainless Steel」这种
工厂写法是**两个值加一个分隔符**，整串去查什么都查不到 —— 现在按分隔符拆开分别翻，
再用原来的分隔符拼回去，查不到的那一半保留英文。

## 补齐的五个路由

`/pt/product-finder/`、`/pt/configurator/`、`/pt/downloads/`、`/pt/projects/`
（含 `[slug]`）、`/pt/product-studies/`。

`/products/argentina-ar4` **故意不补** —— 它是给阿根廷做的市场页，
`PORTUGUESE_MIRROR_EXCEPTIONS` 里记着原因。

配的数据：
- `STEPS_PT`、`OPTION_NOTES_PT`（配置器的五个问题和 39 条分类说明）
- 五个应用案例的葡语正文（17 段）、标题、摘要和 SEO 字段
- `profilePt`、`statsPt`（公司简介四段 + 七行数字）
- `search-suggestions` 的 `labelPt`（11 条）
- `SPEC_LABELS_PT` 新增 59 个标签、`SPEC_VALUES_PT` 新增 8 个值
- `PRODUCT_NAMES_PT` 新增两个铰链品名（另一个会话当天上架的 76 个型号，
  翻译器拒绝跑而不是回落成分类名 —— 九月西语那 582 条的教训）

`OPTION_NOTES_PT` **是从英文翻的，不是从西语**。从西语翻会连西语译者的每一个判断
一起继承，包括判断错的那些。

## 守卫

`src/data/locale-route-parity.test.ts`，三条，**已验证会触发**（把
`src/app/pt/configurator` 挪走，测试立刻报 `+ '/configurator'`）：

1. 磁盘上的葡语路由必须登记为镜像，否则 hreflang 和页脚不知道它存在。
2. **登记为镜像的路由必须在磁盘上存在**，否则每一条指向它的链接都是 404。
3. 西语同样检查 —— 两棵树往相反方向漂移，只盯新的那棵，半年后会找到这件事的西语版本。

## 数字

| | 修复前 | 现在 |
|---|---|---|
| 葡语页面上的英文短语（不重复） | 7,281 | 2,805 |
| 葡语路由 | 16 | 22（与西语持平） |
| `audit:pt` 产品字段 | 96% | 100% |
| `/pt/configurator/` | **不存在** | 在，且每条导航都留在 /pt/ |

`npm test` 331/331。`deploy:prep` 全绿：2,083 页，158,609 条内链全部可解析。

## 还剩什么

`npm run audit:pt:pages` 现在最上面的是**产品描述正文**：
「Made from high-quality 304 stainless steel…」(32 页)、
「Key Features:」(18)、「Functions: Entrance, Anti-Panic…」(17)。

这些是产品记录里的 `description` / `features` 字段，翻译器目前不覆盖它们
（它做 name/summary/specs/seo）。这是下一批，量最大，而且是真正的文案翻译
而不是词表补充。

另外 `audit:pt` 里那 123 条 `specs` 现在单独归类为「**英文本身就是空的**」——
不是翻译缺口，是要问工厂的。把它算成翻译缺口会让下一个会话以为这是一下午的词表活。
