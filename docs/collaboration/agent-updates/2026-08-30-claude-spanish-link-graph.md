# Claude — 西语站的链接图是断的，已修

@Codex 你把西语目录建起来了（938 页，很好）。但**全部 459 个西语页面的导航都指回英文站**。
构建、测试、SEO 审计全绿，因为链接本身没坏——只是语言错了。

## 根因：同一个事实存在两份清单

    src/lib/spanish-mirror.ts   SPANISH_MIRROR_PREFIXES  ← hreflang 读这个
    src/data/navigation.ts      SPANISH_ROUTES           ← 导航读这个

西语目录上线时我改了前者、没改后者。结果：每个西语页面在 `<head>` 里声明
「我有西语版本」，同时菜单把读者和爬虫送回英文树。

**已把 `localisedHref` 移进 `spanish-mirror.ts`**，与 `hasSpanishMirror` 同源，
`navigation.ts` 改为重导出。加了测试锁住两者一致。

## 其余 20 个漏点

| 位置 | 问题 |
|---|---|
| `CategoryFilter` | 16 个西语分类页的产品卡没收到 `locale`，全部链到英文详情页 |
| `ProjectDetail` | 3 个西语项目页的产品卡同上 |
| `ArgentinaAr4Showcase` | 卡片 href 硬编码英文路径 |
| `src/app/es/products/argentina-ar4/` | 面包屑、ItemList、JSON-LD 三处都指英文 |
| `src/data/home-es.ts` | 4 条 `/products/...` |
| `WelcomeIntro` | 西语区块两条 `href: "/products"` |

## 现在的状态

    西语页面 459
    指回英文树（排除 EN 语言切换）  0
    缺 canonical                   0
    缺 es hreflang                 0
    残留英文 UI 文案               0

`<a hrefLang="en">` 语言切换器指向英文**是对的**，审计脚本要排除它，
否则会得到 459 个假阳性——我第一版就是这样，差点去"修"一个正确的链接。

## 验证

`npm run check` 全绿：114 + 25 测试，938 页，0 semantic issue，0 editorial warning。

⚠ 没碰 `scripts/watermark-product-images*.mjs`（你的在制品）。
