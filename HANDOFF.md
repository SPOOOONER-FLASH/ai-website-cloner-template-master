# Canton Hyland — 交接文档

> **新会话请先读这一份，再读 PROGRESS.md 和 BUILD_PLAN.md。**
> 写于 2026-08-17，上一段会话 context 用尽前。

---

## 一句话现状

Canton Hyland 英文官网，Next.js 16 静态导出，已上线
**https://spoonercantonlock.stahlock.com**，56 个静态页、中英西双语、
20 个产品、含 Product Finder 筛选器和 Decap CMS 后台。

---

## 立刻要知道的三件事

### 1. 部署方式（不是常规做法，先看这条）

`out/` **提交进 Git 仓库**。服务器不构建、不装 Node，只 `git pull`。

原因：甲方无法配置 CI secrets 或 SSH 密钥。这是权衡后的选择，不是疏忽。

- 改完代码 **必须** `npm run build` 再提交，否则线上是旧版
- `npm run deploy:prep` 会检查这一点（比较 mtime），务必用它
- 服务器路径 `/www/wwwroot/spoonercantonlock.stahlock.com`，Nginx 运行目录指向 `/out`
- 宝塔计划任务每小时 `git reset --hard origin/main`

### 2. 索引是关闭的，且是刻意的

`src/data/site.ts` 里 `indexable = false`。

当前域名是**别的品牌（Stahlock）活站的子域名**。索引它会造成重复内容、
并把 Canton 的产品目录关联到 Stahlock 品牌下。

正式域名就绪后：改 `siteUrl` + `indexable = true`，一行搞定全站。

### 3. 数据真实性纪律 —— 这条最重要

这个项目反复出现的原则：**宁可留空，不可编造**。

- **规格表大部分是空的** —— 阿里详情页被 captcha 挡住，没有真实尺寸数据。
  编造五金规格 = 采购商照着下单 = 商业事故。
- **认证不挂到产品上** —— 4 张证书各自指名具体型号（KD070/30-290、
  KD070/20-101、607 SS ET），没有一张对应现有的 20 个产品。
  它们作为**公司资质**展示在 `src/data/company.ts`。
- **产品 Schema 不含 offers / aggregateRating** —— 没有价格、没有评价，
  伪造会被 Search Console 处罚。
- 7 个产品标了 `modelTbc: true`，是描述性名称不是真 SKU。

**接手的人请守住这条线。** 甲方可能会催"先填上去"，但这些是对外承诺。

---

## 常用命令

| 命令 | 用途 |
|---|---|
| `npm run dev` | 开发服务器（端口 3000） |
| `npm run cms` | 启动内容后台 + dev server（端口 3001） |
| `npm run build` | 构建到 `out/` |
| `npm run deploy:prep` | 构建 + 检查 out/ 未过期 |
| `npm test` | 轮播和筛选器的单元测试 |
| `npm run check` | lint + typecheck + build |

**CMS 后台地址**：本地 `http://localhost:3001/admin/index.html`
（dev 需要 `/index.html`；线上 `/admin/` 直接可用）

---

## 目录结构

```
content/                 产品/案例 JSON —— CMS 编辑的就是这些
  products/*.json        20 个，文件名必须等于 slug
  projects/*.json
  categories.json  downloads.json
src/data/                类型定义 + 查询函数（数据本身在 content/）
  generated/             构建时自动生成的 barrel，勿手改
  site.ts                indexable / siteUrl / socialLinks / hasSpanishMirror
src/components/site/     全部组件（扁平，无子目录）
src/lib/                 carousel.ts / product-finder.ts / seo.ts（纯函数，有测试）
public/admin/            Decap CMS 配置
out/                     构建产物，已提交
```

---

## 西语站是**部分**镜像

有：`/es/` `/es/company/` `/es/contact/` `/es/projects/` + 3 个案例详情
无：`/es/products/` 整个产品板块、`/es/downloads/`

`src/data/site.ts` 的 `hasSpanishMirror()` 控制 hreflang 只对真正双语的路径声明。
**改动这里之前先读那段注释** —— hreflang 指向 404 比不写更糟。
补齐西语产品页后，把前缀加进 `SPANISH_MIRROR_PREFIXES` 即可自动生效。

---

## 未完成 / 已知问题

| 项 | 状态 |
|---|---|
| 4 张图分辨率不足（0.54×–0.86×） | 等甲方原始文件，见 IMAGE_CREDITS.md |
| 产品图带 Hyland 水印徽标 | 建议要无水印版重导 |
| 规格表 15/20 为空 | 等甲方目录 |
| 7 个产品无真实 SKU | `modelTbc: true` |
| 成立年份 1998 | 甲方已确认（2012 是阿里开店年份） |
| CMS 仅本地可用 | 上服务器需 GitHub OAuth 中转，未做 |
| Web3Forms key 在 out/ 的 JS 里 | 设计上就是公开的；被刷垃圾邮件时去后台换 key |
| P11 真实素材替换 | 甲方明确取消 |

---

## 甲方的工作方式

- 非技术背景，中文沟通
- 一次一个阶段，做完停下报告，**不要自动继续下一阶段**
- 额度有限，避免大规模重构和重复读大文件
- 设计规则写在 `src/app/globals.css` 顶部，**是硬约束**：
  品牌红只用于可点击元素；标题正文图标分隔线一律不用红；
  无渐变无阴影无高光；卡片圆角 0–2px
