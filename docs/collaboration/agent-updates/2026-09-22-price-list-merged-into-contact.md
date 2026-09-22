# Price list 并入 Contact

- **Agent**: Claude
- **日期**: 2026-09-22
- **客户指令**: 「pricelist 从网站上隐藏」→「pricelist 并进 contact」

## 改了什么

| 文件 | 改动 |
|---|---|
| `SiteHeader.tsx` | Buy 货架去掉 Price list 一行（三语）；Contact 那行副标题改成「报价、价格与出口专员」 |
| `SiteMenuDrawer.tsx` | 抽屉去掉 Price list 一行（三语） |
| `src/app/{(en),es,pt}/contact/page.tsx` | 邮箱区正下方新增「价格表」板块 |
| `header-shelf.test.ts` | 两处断言反转，附反转理由 |

## 为什么不是直接删

**「想知道价格」是真实意图，砍掉入口不会让意图消失。** 所以入口撤了，答案搬到人真正落地的那一页。

Contact 上新增的板块说的是：出口价不公开，因为它随规格、饰面、数量走；没有这三样的一张表是一个谁也下不了单的数字，而挂在公开 URL 上的价目表贴出去一周就过期。要价格就在表单里说，或者写上面那个订单邮箱，报一下买哪些系列、大概什么量。

这一段本身就是专业感的论据，和「不知道的尺寸写破折号」是同一条纪律。

## 顺带修掉的一个真 bug

货架和抽屉里的 **「Lista de precios」和「Lista de preços」都指向英文路由 `/request/price-list/`** —— 西语买家点自己语言的入口，会被弹出自己的语言。现在三语都落在各自的 `/contact/`。

## `/request/price-list/` 这一页留着，没删

- 删掉就是一个 404，而「canton hyland price list」是真实搜索需求
- FAQ 里还链着它 —— 那是**上下文链接**，是人真在问价的地方，不是导航
- sitemap 保留
- `header-shelf.test.ts` 里「这一页必须还在」的断言原样没动

**隐藏的是常驻导航位，不是这个 URL。**

## 验证

- `npm test` 361 passed（改过的两条断言在内）
- `npx tsc --noEmit` 干净、`eslint` 六个文件 0 问题
- 浏览器实测：`#buy-shelf` 现在是 Contact / FAQ / Downloads / Buy on Alibaba 四项，
  页面上 `a[href*="price-list"]` 为 0；三语 Contact 的价格表板块都渲染出来了

## 未触碰

`out/`、`out-rayen/`（构建 baton 在 Codex）、`docs/design-references/**`。
