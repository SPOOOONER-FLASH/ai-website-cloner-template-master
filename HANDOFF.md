# 交接 — Canton Hyland / HYDE 官网

> 新会话先读这份，再按需读 `docs/collaboration/agent-updates/`（Claude × Codex 互通进度）。
> 最后更新：2026-08-27

## 一、这个站是干什么的

**不卖给建筑商。** 目标是海外经销商和项目采购，衡量标准是**产生多少封询盘 / 多少人点去阿里**。
成交发生在邮箱和阿里，不在本站。所以 FSB 那套 BIM 库、招标文本、门规划服务**价值很低，不要抄**。

**HYDE 是品牌**，Canton Hyland Hardware (Group) Co., Ltd. 是公司主体。

## 二、硬约束

| | |
|---|---|
| 框架 | Next.js 16 App Router，`output: "export"` 静态导出 |
| 正式域名 | **cantonlock.com**（已上线，Cloudflare CDN + Sectigo 证书） |
| 服务器 | 腾讯云法兰克福 `43.131.27.225`，宝塔 + nginx，与 stahlock.com 共用 |
| 部署 | 推送 GitHub → 服务器 crontab 每 5 分钟 `git pull` → nginx 发 `out/` |
| CMS | Decap，编辑写 GitHub JSON |

**由静态导出衍生的规则**

1. 每个动态路由必须有 `generateStaticParams()`，且不能返回空数组。
2. 没有服务端：询盘走 Web3Forms，搜索靠构建期索引。
3. **`out/` 提交进仓库**，改完必须 `npm run deploy:prep` 再提交。
4. 「CMS 保存 ≠ 上线」，还需要有人构建并推送。

## 三、内容纪律（违反会造成商业风险）

- **没有真实数据就留空，不要猜。** 空规格表是诚实的，编造的是事故——采购商照着下单。
- **认证只能对应点名该型号的检测报告。** 手上四份只覆盖 KD070/30-290、KD070/20-101、607 SS ET。
- **案例只有甲方确认供过货才能标「真实项目」**，否则一律「代表性应用」。
- **FAQ 商业性答案（起订量、交期、付款、OEM）留空等甲方填。**

## 四、当前状态

产品 431 · 静态页 471 · 图片 1342 张 · 测试 47 通过

**已完成**：全站页面、西语 7 页、FAQ、价格表索取、站内搜索、弹窗、CMS 五栏目、
SEO 元数据（471 页全带 canonical/hreflang/OG/JSON-LD）、`llms.txt`、Product Finder
（20/页 + 分面折叠 + 独立滚动）、全部 431 个产品链接服务端渲染（`ProductIndexList`）、阿里深链接、GA4 + Clarity、旧站 URL 301。

**分析与站长工具**

| | |
|---|---|
| GA4 | `G-RBTE7KF82P` 已收数据 |
| Clarity | `y8utyrgvv0` 已收数据 |
| IndexNow | 2026-08-27 首次提交成功，467 条 200 OK。`npm run seo:indexnow`，**推送并确认服务器已 pull 之后再跑** |
| GSC | 820 已索引 / 961 未索引 |
| Bing | 533 indexed，86 errors |

## 五、⚠ 最要紧的两件未完成

**1. 正文重复 → GSC 525「重复网页」+ Bing「内容过少」**
**不是 canonical 问题**：471 页 canonical 全部自指，已验证。真因是正文本身重复。
已修 36 个（44 个空规格表 → 18）。剩下的靠数据解决不了，需要甲方定：
32 个 stainless-steel-handles / 30 个 lever-handles / 18 个 bathroom-accessories
各自 summary 完全相同、只有 1 行 Material——给尺寸用途，或合并成带变体的单页。
⚠ finish 后缀（SNET/PBET）不可推断，21 个样本 4 个矛盾，别再试。

**2. 西语只有 7 / 471 页**
`/es/` 导航的 href 全指向英文页，两个语区形成闭环。
`SPANISH_MIRROR_PREFIXES` 在 `src/data/site.ts`，加前缀即自动生成 hreflang 与 sitemap。

## 六、Bing 报的 86 个错误

| 类型 | 页数 | 说明 |
|---|---|---|
| `<h1>` 缺失 | 4 | 需定位是哪 4 页 |
| meta 描述过短 | 26 | 建成品里只有 14 页 <110 字符：/contact/ 74、/company/ 82、/products/knob-locks/ 91、/downloads/ 98 |
| 标题过短 | 25 | 建成品里 19 页 <40 字符，多为 d101-* 系列。差额是旧站 index.php URL，301 后自然消失 |
| 内容过少 | 25 | 已修大部分，见第五节 1 |
| `<img>` 缺 alt | 4 | |

## 七、需要甲方给数据才能推进

- 112 个产品无图（硬盘上没有）
- MOQ 与交期分档（阿里后台可导出，同时能填 FAQ 空着的两问）
- Application 用途字段（只有 30% 的产品有）
- 44 个属性字段里的整句话要改写成值
- 阿根廷四款锁（Elabora 代工）的型号与规格

## 八、甲方已确认的待办

**要做**：相关产品推荐 · Service 聚合栏目 · 展会日程页 · Newsletter · 资质证书页 ·
材料内容线 · 应用场景页 · 图片 ALT 批量管理 · 首页「当季主打市场」模块（方案待定，
倾向四宫格而非轮播）

**不做**：经销商查询 · 网站装修拖拽编辑器

## 八·五、甲方明确的下一批数据

甲方确认后期会给：**尺寸 / 用途 / finish**，届时每页差异化。
到货后跑 `npm run content:enrich` 之前先扩 `CITED` 表，别手改 431 个 JSON。

## 九、怎么干活

```bash
npm run check        # lint + typecheck + build，提交前必跑
npm test             # 47 个测试
npm run deploy:prep  # 构建并校验 out/ 是最新
node scripts/audit-seo.mjs   # 读 out/ 的 HTML 审计 SEO
npm run content:enrich       # 由型号命名规则+甲方 worldbid 文案补规格表
npm run seo:indexnow         # 推送到服务器之后再跑
```

**协作**：Claude 与 Codex 共用一个工作树，无锁。开工前 `git log --oneline -5`，
只 `git add -- <明确路径>`，每次提交附一份 `docs/collaboration/agent-updates/`。

**文档纪律**：所有 `.md`（HANDOFF、agent-updates、docs/）写成最简洁的形式——表格与短句优先，
不写背景铺陈、不复述已知信息、不写礼貌用语。改完一件事就在 HANDOFF 里删掉对应的待办，
不要另起一段说「已完成」。目标是下一个 worker 用最少 token 读懂现状。

**验证纪律**：改了页面就实测，别凭 CSS 猜。用浏览器量 `getBoundingClientRect`。
本地验证生产产物用 `npx serve out`（**不要加 `-s`**，那是 SPA 模式会重写所有路径）。

**踩过的坑**

- `.git/index.lock` 反复出现（0 字节陈旧锁）→ 确认无 git 进程后 `rm -f` 即可。
- 改 crontab 用 `crontab <file>`，**不要用管道**，引号会被吃掉（曾误删腾讯云监控条目）。
- 写含反引号的文档用脚本文件，不要用 `node -e` 内联（反引号会被 bash 当命令替换）。
- nginx 子 `location` 一旦有 `add_header`，父级安全头会全部丢失，需在每个 location 重复声明。
- 本机 python 是商店占位程序，跑不了。

## 十、下一个会话建议顺序

1. **写指南文章** —— 见 `docs/content/EDITORIAL_PLAN.md`，选题 1–3 优先。
   基础设施全就绪（`/news/[slug]/`、`kind:"insight"`→TechArticle、`relatedModels` 内链），
   `content/news/` 是 0 篇。Claude 撰稿，Codex 版式。
2. **Cloudflare 缓存 HTML** —— 见下方「未做的一件外部配置」，性能第一优先，但要在 CF 后台改。
3. **修分类与下载的接线** —— `content/{categories,downloads}.json` 改了不生效，
   前台仍读 `src/data/` 硬编码数组，是后台唯一的假功能
4. **西语铺开**（第五节 2）

**未做的一件外部配置（需要 Cloudflare 后台，代码改不了）**

实测 `cf-cache-status: DYNAMIC`，HTML 完全没走边缘缓存，每个访客都回源到法兰克福。
源站已经发 `Cache-Control: public, max-age=300`，但 Cloudflare 默认只缓存静态扩展名，
HTML 必须显式加 Cache Rule：

    Rules → Caching rules → Create rule
    表达式  (http.request.uri.path.extension eq "") or (ends_with(http.request.uri.path, "/"))
    Cache eligibility        Eligible for cache
    Edge TTL                 Override origin → 1 hour
    Browser TTL              Respect origin

发布后必须 Purge Everything，之后每次部署也要 purge（或改用 Cache Tag）。
验证：`curl -sI https://cantonlock.com/ | grep cf-cache-status` 应为 HIT。

**服务器相关**：回滚与止损见 `docs/deployment/CANTONLOCK_ROLLBACK.md`。
⚠ 证书 **2026-12-14 到期**且已开 HSTS（一年）——过期未续则网站完全打不开，
建议到期前换 Let's Encrypt 自动续期。
