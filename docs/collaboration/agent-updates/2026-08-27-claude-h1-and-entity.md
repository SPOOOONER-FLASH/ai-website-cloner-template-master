# Claude — H1 带型号 · 首页 H1 关键词 · sameAs · 社交链接

| | |
|---|---|
| 范围 | `ProductDetail.tsx`(H1)、`JsonLd.tsx`(Product name + sameAs)、`WelcomeIntro.tsx`(首页 H1 文案 EN+ES)、`content/site-settings.json` |
| 未动 | `src/app/es/**`、图片、布局 |

## 改动

| 项 | 前 | 后 |
|---|---|---|
| 产品页 H1 | `Panic Exit Device` | `001 Panic Exit Device` |
| Product JSON-LD name | `Panic Exit Device 001` | `001 Panic Exit Device`（与 H1、seoTitle 同序） |
| 首页 H1 第一行 | `Welcome` | `Panic Exit Devices, Locks and Door Hardware` |
| 首页 H1 第二行 | `Door Security and Building Hardware, Manufactured in Guangdong` | `Manufactured in Guangdong since 1998` |
| Organization | 无 sameAs | 3 条已验证品牌主页 |

产品 H1 带型号同时解决重复：40 个记录都叫 "Lock Case"、38 个叫 "Lever Handle"，
之前几十页共用同一个 H1。

## 社交链接（比同事点评说的更严重）

6 条里 4 条不是品牌主页：`linkedin.com/feed/`、`tumblr.com/dashboard` 是**登录用户自己的页面**，
`x.com/iiiponso/followers` 是个人号的关注者列表，eBay 那条返回 403。
只保留已验证的 Instagram / Facebook / Alibaba，其余删除。
**指向登录页的 sameAs 是坏的身份声明**，宁可不写。
甲方给到真实的 LinkedIn 公司页与 X 账号后加回 `content/site-settings.json` 即可，sameAs 自动跟随。

## 验证

`npm run check` 通过（23 测试 / 472 页 / 0 semantic issue）。
`scripts/seo-audit.test.mjs` 的 `jsonld-product-name-not-visible` 拦住了第一版——
Product schema 的 name 必须在页面上可见，改 H1 就必须同步改 schema。三处（H1 / schema / seoTitle）绑定。
浏览器实测 375px：H1 342×88，无溢出。

## 给 Codex

- 首页 H1 的英西文案我改了（属编辑文案，本来是你的地界）——语感请复核，改回或润色都行，
  只要第一行仍以品类词开头。
- 首页 `col-outset home-accent-surface` 模块在 1265px 视口横向溢出 16px（`scrollWidth` 1281），
  与本次改动无关，早就存在。
