# claude — Bing「Html size is too long」：/product-finder/ 1.29MB，94% 是 RSC 载荷

| | |
|---|---|
| 范围 | `src/lib/product-finder.ts` 新增 `FinderProduct` 投影；`ProductCard` / `ProductFinder` / `ProductFinderClient` / `product-finder/page.tsx` 改用它 |
| 测试 | `npm test` 142 全过；lint + typecheck |
| 未碰 | `out/`（Codex 正在改首页编辑图，`assets:editorial` 未跑完，构建会中断）；`SiteFooter.tsx` |

## Bing 报的 5 条全是同一个页面

```
/product-finder/                      1
/product-finder/?category=panic-exit-devices   2
/product-finder/?category=lock-cases           2
/product-finder/?doorType=Fire Door            2
/product-finder/?material=Stainless Steel      2
```

四条带参数的是同一个静态文件加查询串。**真正超标的只有一个导出文件。**

## 量出来的原因

```
out/product-finder/index.html   1,341,341 字节
  其中内联 <script>              1,257,468 字节  = 94%
  真正的 HTML                       83,873 字节  =  6%
```

那 94% 是 **RSC flight 载荷**。`ProductFinderClient` 是客户端组件，页面把
**完整的 435 条 `Product`** 传给它，于是每一条的 `specs`、`specsEs`、`gallery`、
`attachmentIds`、`relatedModels`、四个 SEO 字段全部被序列化进内联脚本。

`ssr: false` 不救这个 —— 它只是不预渲染 UI，props 照样要过 flight 载荷。

**筛选器一个都没读这些字段。** 它实际只用 14 个：
`slug model modelTbc name nameEs nameZh series categoryPath material finishes doorTypes certifications heroImage summary`。

## 做法

`product-finder.ts` 新增 `FinderProduct`（`Pick<Product, …>`）与 `toFinderProduct()`，
在页面边界投影。`filterProducts` / `sortForDisplay` 改成泛型 `<T extends FinderProduct>`，
所以类目页那条从服务端组件传完整 `Product` 的路径**一行都不用改** —— 完整记录
在结构上满足窄类型。`ProductCard` 的 prop 也收窄到 `FinderProduct`，同理兼容。

## 效果

```
435 条完整 JSON   991,854 字节
435 条投影后      212,488 字节   = 21%

页面 1,341,341  →  约 353,000   （远低于 1MB 软上限）
```

HTML 里的 903 个产品链接**一个不少** —— 那部分是 `ProductIndexList` 服务端渲染的，
不在客户端 props 里，爬虫看到的内链完全不变。

⚠ **估算值，未经真实构建复核。** Codex 正在提交首页编辑图，`generate-editorial-srcsets`
的 `--check` 会中断 prebuild，我没有替他跑资产管线。他那批落地后需要重跑
`npm run deploy:prep` 并复核 `ls -la out/product-finder/index.html` 实际字节数。
