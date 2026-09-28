# 2026-09-28 · Claude (projects) · 首页与全站外壳改服务端渲染 + 客户端小岛

任务单：`docs/collaboration/tasks/2026-09-28-server-render-islands.md`。只推源码，**发布归工程会话**（`release:hyde` 未跑、`out/` 未提交）。

## 批次 1 · WelcomeIntro + SiteFacts（本提交）

| 组件 | 现在 | 客户端岛 |
|---|---|---|
| `WelcomeIntro` | 服务端组件，文案改用 `@/lib/i18n` | `WelcomeIntroLinksToggle`：只管手机上 "More links" 的展开状态；标题 `<h2>` 和链接列表由服务端渲染后作为 props/children 传入 |
| `SiteFacts` | 服务端组件，最终数字直接在 HTML 里 | `FactRoll`：只包带 `countTo` 的数字；每个岛观察同一个 `<section>`、同一阈值，按 `index` 错开，所以滚动计数的时机和改前一致。`fact-roll.ts` 新增 `rollAt()`，`rollFrame()` 改为调用它（测试不变） |

`npm run i18n:keys` 已重跑：七个 overlay 语种的客户端字典各少 14 条（WelcomeIntro 的句子不再进浏览器）。`content/i18n/ui-keys.json` 的 diff 里还有几行与本改动无关的行号漂移，是生成器顺手更新的。

**实测**（本机完整构建，`tmp/claude-islands/measure.mjs`，统计页面引用的全部 JS 块）：

| 页面 | JS 原始 | JS gzip | 内联 RSC 数据 gzip |
|---|---|---|---|
| `/` | 804,038 → 795,716（−8.3 KB） | 243,078 → 240,031（−3.0 KB） | 20,502 → 21,966（+1.5 KB） |
| `/fr/` | 854,714 → 846,392（−8.3 KB） | 261,618 → 258,571（−3.0 KB） | +1.7 KB |
| 产品页、`/contact/` | 不变 | 不变 | 不变 |

RSC 数据变大是预期内的：开场文字现在作为服务端输出放在页面里（只含当前语种），而不是作为三语字典打进 JS。每页净传输约 −1.5 KB gzip，浏览器少解析执行约 8 KB 脚本、少激活两个组件。**收益如任务单所说是小的。**

**验证**：en / fr / ar 首页和一个产品页，1440 与 390 两种宽度，改前改后全页截图像素差 0（fr 390 第一次有差异，是懒加载图片时序，重拍为 0）。控制台无 hydration 报错（只有沙箱里 GTM 等外部资源连不上，改前改后相同）。390 宽度下 "More links" 点击展开/收起、`aria-expanded` 正确；数字栏从屏幕外滚入时计数，结束值与服务端输出一致（en / fr / ar / es）。

## 批次 2 · SiteFooter

`SiteFooter` 改为服务端组件，`locale` 由各语种 layout 传入（`scaffold-locale-routes.mjs` 模板改一行并重新生成七个 layout；es/pt layout 手改；(en) 与 404 用默认 `en`）。依赖当前路径的两块拆进 `FooterPathAware.tsx`：`FooterCurrentLink`（当前页显示 `aria-current` 的 span，否则显示链接；两者都由服务端渲染后传入，岛只做选择）和 `FooterLanguageLinks`（每个其他语种一条指向本页对应版本的链接）。`i18n:keys` 重跑，七语种客户端字典再各少 8 条。

| 页面 | JS 原始 | JS gzip | 内联 RSC 数据 gzip |
|---|---|---|---|
| `/` | 795,716 → 789,588（−6.1 KB） | −1.3 KB | +1.6 KB |
| 产品页 | 796,630 → 789,945（−6.7 KB） | −1.5 KB | +1.6 KB |
| `/contact/` | 784,664 → 777,979（−6.7 KB） | −1.5 KB | +1.4 KB |

**传输量基本持平**：页脚的 HTML 现在同时出现在页面和 RSC 数据里，抵消了 JS 的减少。得到的是浏览器少解析执行约 6–7 KB 脚本、页脚大部分不再参与激活。

**验证**：7 个页面（含 /contact/、/fr/contact/、/es/faq/、/pt/、/ar/company/、产品页）的页脚 HTML，静态导出与浏览器激活后逐字相同；en/fr/ar 首页与产品页 1440/390 截图像素差 0；无 hydration 报错；从首页点页脚 Contact 客户端跳转后，当前页标记与语言链接正确更新。

## 下一步

批次 3（SiteHeader，单独发布）一个 PR。HeroCarousel 等前四个评估完再说。

**风险 / 给其他会话**：`scripts/scaffold-locale-routes.mjs` 属于多语种会话的认领范围；批次 2、3 会各改它一行（给 `SiteFooter` / `SiteHeader` 传 `locale`），并重新生成七个 locale layout。

**构建副作用，不是本任务的**：在 Linux 上 `prebuild` 会改写 `public/images/drawings/*.svg`、`public/images/door-prep/*.svg`、`public/search-index*.json`、`src/data/generated/products-zh.json`，未提交。`finish-downloadable-pdfs.mjs` 调用 Windows 的 `py` 启动器，Linux 上要 `pymupdf` 和一个 `py → python3` 垫片才能跑完 `npm run check`。
