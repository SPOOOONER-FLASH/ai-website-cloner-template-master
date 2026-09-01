# claude — Bing 唯一的高危错误、图片 sitemap、AI 爬虫、MOQ 与运费

| | |
|---|---|
| 范围 | `category-aliases.ts` 注释 · 两个类目/产品路由的 metadata · `seo-policy.ts` · `sitemap.ts` · `content/faq.json` |
| 测试 | `npm test` 149 全过；`deploy:prep` 941 页、语义问题 0、编辑质量告警 0 |

## 一、Bing 的高危错误：我们在主动邀请爬虫索引空页

Bing Site Scan 唯一的 High severity 是「The `<h1>` tag is missing」4 页。
查下来，**同样这几个页面同时构成它的 thin content 和 duplicate title 计数** ——
一个原因，三个症状。

原因：`/products/door-hinges/` 这个类目已经并入 `brass-steel-hinges`。
路由用 `permanentRedirect()` 处理，但在 `output: "export"` 下**它发不出 301** ——
Next 写出一个客户端跳转桩：`<html id="__next_error__">`，没有 `<h1>`，正文约 10 个词。

**而 `generateMetadata` 照常运行，给这个空桩盖了 `robots: index, follow`。**
我们在明确告诉爬虫去索引三个空页，而且它们的 title 和真页面一模一样。

改成 `noindex, follow` 并**保留 canonical**。

实测（构建产物）：

```
改前   无 h1 且可索引：4        可索引页里重复 title：4 组 8 页
改后   无 h1 且可索引：0        可索引页里重复 title：0 组
```

### ⚠ 修的过程中我自己引入了一个 bug，被测试抓住

第一版只返回 `{ robots: {...} }`。在 Next 的 metadata 里**这会替换整个对象**，
于是 canonical 退回站点根 `https://cantonlock.com/`。
`scripts/seo-audit.test.mjs` 报 `redirect-canonical-mismatch` 三条。

noindex 和 canonical 在这里做两件不同的事，两个都要：
一个让桩不进索引，一个告诉任何到达它的东西真页面在哪。已同时返回。

## 二、图片 sitemap：1440 条

站点此前**没有任何 `<image:image>`**。爬虫处理网页和图片是两条路径 ——
页面被收录不等于页面上的照片被收录。这个行业尤其吃亏：
采购和工程师经常先在 Google 图片里搜一个**认得出的形状**（一个补丁夹具、一个锁体前板），
然后才知道型号。

产品详情页现在带 hero 图进 sitemap。**没有照片的记录不发占位图**，直接不带。

## 三、robots.txt：五个助手爬虫具名，并且重复了规则

具名的四个 + Google-Extended。它们本来就被 `*` 组允许，所以**今天不改变任何访问权限** ——
具名是为了把它变成一个写下来的决定。

**每个具名组都重复了同一份 allow/disallow，这是刻意的。**
爬虫一旦找到匹配自己 token 的组，就**只服从那一组、完全忽略 `*` 组，规则不合并**。
如果只具名而不重复 disallow，等于把 `/admin/` 和 4693 个 RSC `.txt` 载荷
恰好交给这五个爬虫 —— 与具名的目的正好相反。

Google-Extended 不是爬虫，是 Gemini / Vertex AI 的接地开关。
列进来是「愿意被引用」的商业选择，从列表里移出即可撤销。

## 四、甲方给的两个数字

| 问题 | 状态 |
|---|---|
| MOQ | **按范围写了 300–5,000 件**，并说明因型号/表面/是否定制而异 |
| 运费 | 新增一条 FAQ：按目的地/重量/海运空运报价，阿里店铺自动算运费，DDP/DAP |

⚠ **MOQ 有一处冲突，需要甲方确认：** 甲方给的范围是 300–5,000，
但阿里后台某个锁芯商品的自定义属性写的是 **`MOQ 50pieces`**。
我在答案里写成「多数型号 300–5,000，阿里店铺上部分已上架商品的起订量更低」——
这是我能给出的、两边都不违背的说法。**哪个是对外口径，请甲方定。**

买家题库覆盖 30 → **31**。

## 五、还空着的（甲方数据）

样品是否收费 · 付款方式（TT/LC/定金比例）· OEM 商务条款。
这三条我没编。
