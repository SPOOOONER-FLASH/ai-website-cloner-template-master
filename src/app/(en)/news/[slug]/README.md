# 新闻详情页 —— 等第一篇稿子

这个目录里是 `page.tsx.template`，**不是** `page.tsx`。Next 只把 `page.tsx` 当路由，所以
它现在是一个死文件，不参与构建。

## 为什么

`output: "export"` 下，动态路由的 `generateStaticParams()` **不允许返回空数组** ——
Next 会直接让构建失败：

```
Error: Page "/news/[slug]" returned an empty array from "generateStaticParams()".
With "output: export", at least one route must be generated.
```

`content/news/` 现在是空的（一篇真新闻都还没有），所以这个路由一旦启用就会让整个构建挂掉。

绕过它的办法只有两种：编一篇假新闻稿，或者先不启用这个路由。**假新闻稿是不能碰的** ——
新闻稿带日期、可被引用、会被记者核对，编一条出来是实打实的商业风险。所以选后者。

## 怎么启用（写完第一篇之后）

1. 在后台「新闻」里发布第一篇，或直接在 `content/news/` 放一个 JSON
2. 把模板改回真正的路由文件：

```bash
git mv "src/app/news/[slug]/page.tsx.template" "src/app/news/[slug]/page.tsx"
```

3. `npm run check`

之后这个 README 就可以删了。

## 现在能用的部分

- `/news/` 列表页 **已上线**，没有内容时显示诚实的空状态
- 后台「新闻」集合已配好，可以正常写、正常存
- `sitemap.ts` 和 `NewsArticleJsonLd` 都已接好，第一篇一发布就自动生效
