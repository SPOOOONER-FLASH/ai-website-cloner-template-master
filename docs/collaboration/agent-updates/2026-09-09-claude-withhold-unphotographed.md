# 2026-09-09 · Claude — 无图型号真正下架，语言标签改写，072 缺口浮出

## 一句话

`isPublished()` 这条规矩从来只被一半的页面遵守：sitemap、搜索索引、llms.txt、类目页
都过滤了无图型号，但 **product-finder、/products 的 A–Z、抽屉里的计数、以及产品页的
「同系列还有」回退** 四个地方照单全列。甲方 2026-09-09 指出后已全部修好，并加了一条
读构建产物的测试锁住。

## 甲方这次给的三件事

| | 甲方原话 | 结果 |
|---|---|---|
| 1 | intl 改为 es | 头部标签 `INT \| EN` → `ES \| EN`（西语站 `EN \| ES`） |
| 2 | LC 锁体配 072 逃生锁，072 防火锁体有两个葫芦孔的 | 写进两份文档；**发现 072 在目录里根本没有页面** |
| 3 | 不在现货没有首图的产品不删掉页面但是能不能下架、隐藏不显示在网页上 | 已下架，构建数字 573 → 517 |

## 一、下架：四个漏的地方

| 页面 | 漏在哪 | 修法 |
|---|---|---|
| `/product-finder/`（EN+ES） | 导入 `products` 而不是 `publishedProducts`；页面上那句「Showing 573 published products」**是假的** | 改 `publishedProducts`，数字随之变真 |
| `/products/`（EN+ES） | 同上，A–Z 全表列出 598 条 | 同上 |
| `getMenuCategories()` | 抽屉计数含无图记录；子类目若成员全是无图，仍会进菜单 → 点进去「no products match」 | 改 `publishedProducts` |
| `relatedBlock()` 回退 | 传的是整本目录，所以 `410-glass-door-handle` 推荐了 `100-30mm-glass-door-handle`（无图页） | 传 `publishedProducts` |
| `NewsDetail` relatedModels | 文章推荐位链到 301-S / 302-S / JU-071 等无图页 | 加 `.filter(isPublished)` |

**四个都是同一个错误**：调用点导入了 `products` 而不是 `publishedProducts`。两个名字差
一个词、都能编译，注释拦不住。所以规矩改成对**构建产物**断言。

### 数字

| | 之前（HEAD 的构建） | 现在 |
|---|---|---|
| product-finder / A–Z 列出的型号 | 573 | **517** |
| 构建页数 | — | 1,352（1,204 内容页，有意保留不索引 134） |

56 个无图型号从浏览面消失。

### 仍然保留的（有意为之）

页面**照建、照可直达、照标 noindex**。这些型号印在旧报价单和 B2B 目录上，删页面就是
404；安静的页面可恢复，404 把 URL 攒下的信号扔掉。新测试断言的是**没有页面链接到它们**，
不是它们不存在。

## 二、测试锁

`src/data/withheld-products.test.ts`（已进 `npm test`，2 条）：

1. 扫 `out/` 全部 1,352 个 `index.html`，断言没有任何一页 `href` 指向无图产品
   （该产品自己的页面除外）。写这条之前先对旧构建跑过一次，**失败并列出 12 条实例**，
   确认它抓得到才提交。
2. 断言没有人往产品 JSON 里加 `hidden` / `published` / `delisted` 旗标 —— 可见性只从
   `heroImage.src` 推导。两个真值来源，就会出现「照片有了但页面还是隐形」。

## 三、语言标签

`triggerLabel()` 之前是死代码，组件里另写了一个三元。两半各算各的，所以才会漂成
「区域 + 语言」两种不同的东西。现在组件调 `triggerLabel()`，一个来源。

顺序是 **OTHER | CURRENT**：英文站第一格是 `ES`。买家扫一眼头部就知道有西语站，
这是这个控件唯一能有用地广告的东西；当前语言排第二，用 `text-ink-secondary` 标成状态。

顺手删掉 `SiteHeader.tsx` 里 `hasSpanishMirror` 的死导入（lint 唯一的 warning）。

## 四、072：一个比作图更要紧的缺口

甲方确认 LC 锁体配 072 之后，才看出来：

- 307 的 features 里写着 `• Lock Case: 072`
- 307 是**阿里询盘第一（5 个）、转化 18.18%、自有模具**
- 目录里搜 072，只有 `ju-072-door-closer`（闭门器），**不是这个 072**

站上曝光最高的产品，规格行点名的配套锁体，买家在站上找不到。这不是设计问题也不是
文案问题 —— 需要 072 的照片和尺寸。已写进 `2026-09-08-questions-for-factory.md`
的最高优先级，并把 `2026-09-09-top20-image-brief.md` 第 1 组标注为「072 未到位之前
只能拍三件，图注说明锁体另出，**不要用别的锁体顶替**」。

**没有把「LC 配 072」写进 42 个 LC 产品页。** 目录里 LC02 到 LC9230 共 42 个型号，
中心距 45/50/55/60/65/70/72mm 都有。把一句聊天记录原样铺到 42 组配套关系上，等于替
工厂背书，错一组就是买家订到装不上的锁体。要一份「配 072 的 LC 型号清单」。

## 检查

`npm run lint` 0 problem · `npm run typecheck` 通过 · `npm test` **233/233** ·
`npm run deploy:prep` exit 0，dead-link 审计 99,647 条内链 + 29,804 条资源引用全部解析，
`out/` 新于所有源文件。

## 没碰的东西

Codex 的 `docs/design-references/2026-09-09-style-batches/`、
`2026-09-09-professional-hardware-sets/`、`scripts/blender/**`、
`scripts/build-editorial-stills.mjs`、`2026-09-07-home-stills/`，以及他未提交的
`HeroCarousel.tsx` / `static-export-performance.test.ts`（`git diff` 核对为零内容差异，
只是行尾符，所以本次构建没有烤进未提交源码）。

## 下一个有用的接手

1. **072 的照片和尺寸** — 现在是全站单点优先级最高的一条
2. 工厂给「配 072 的 LC 型号清单」，42 个 LC 页面可以一次全部写上配套关系
3. 第二梯队 8 个单件场景图不依赖任何确认，Codex 现在就能开
