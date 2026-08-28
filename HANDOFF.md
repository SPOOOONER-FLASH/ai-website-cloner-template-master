# 交接 — Canton Hyland / HYDE 官网

> 新会话先读这份，再按需读 `docs/collaboration/agent-updates/`（Claude × Codex 互通进度）。
> 最后更新：2026-08-28

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
- **认证：只有两份是我们自己的。** 2026-08-27 逐份核对原件：
  EN 1154 地弹簧那份 applicant 是 KALE KILIT、商标 KALE ARCO，**是客户的，已删除，别恢复**；
  EN 1125（KD070/30-290）与 607 SS ET 耐久两份是我们的（applicant/manufacturer 都是 Canton Hyland）。
  三份均**停止公开下载**——Intertek 明文限制"仅可整份分发，用其名称做广告需书面批准"，
  我们之前发的是 13 页里的第 1 页。文字记录保留，`CertificateRecord.publish` 改 true 即可恢复。
  **ANSI/BHMA 完全没有**，甲方确认，首页徽标与产品名已清除。
- **案例只有甲方确认供过货才能标「真实项目」**，否则一律「代表性应用」。
- **FAQ 商业性答案（起订量、交期、付款、OEM）留空等甲方填。**

## 四、当前状态

产品 435 · 公开内容页 476 · 静态页 481 · 图片 1593 张 · 测试 51 通过

**已完成**：全站页面、西语 7 页、FAQ、价格表索取、站内搜索、弹窗、CMS 五栏目、
SEO 元数据（471 页全带 canonical/hreflang/OG/JSON-LD）、`llms.txt`、Product Finder
（20/页 + 分面折叠 + 独立滚动 + `1 2 3 … 22` 总页数提示）、全部 435 个产品链接服务端渲染（`ProductIndexList`）、阿里深链接、GA4 + Clarity、旧站 URL 301。

**2026-08-28 已上线**：`HYDE Argentina AR-4` 首页市场橱窗、四款长期产品页、英西双语集合页、
响应式营销图、ItemList/Breadcrumb JSON-LD、Sitemap/hreflang/llms.txt 与 IndexNow 提交。

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

- **75 个产品无图**（原 113，2026-08-27 从 F 盘补了 38 个）。
  剩下的多为同型号不同表面处理（607 ABET/BNET/FET/WBK/WLET，F 盘只有 607 PBBK）——
  **不能拿别的表面处理的照片顶替**。要么补拍，要么合并成带变体的单页。
- 77 张图是 2022 旧拍（带 cantonlock.com 水印），已按甲方要求先上线。
  `/status/` 有「图片是旧拍摄，待重拍」一栏，读 `ImageRef.sourceNote`，重拍后可批量定位。
- MOQ 与交期分档（阿里后台可导出，同时能填 FAQ 空着的两问）
- Application 用途字段（只有 30% 的产品有）
- 44 个属性字段里的整句话要改写成值

## 八、甲方已确认的待办

**已确认启动**：相关产品推荐 · Service 聚合栏目 · 展会日程页 · Newsletter 界面系统 ·
资质证书页（Kale 文件除外）· 材料内容线 · 应用场景页 · 图片 ALT 批量管理 ·
429 个西班牙语产品路由。西语术语可先上线，甲方后续提供修订。

**已完成**：首页「当季主打市场」采用 AR-4 建筑主视觉 + 四宫格；四款产品同时保留长期产品页。

**不做**：经销商查询 · 网站装修拖拽编辑器

## 八·五、甲方明确的下一批数据

甲方确认后期会给：**尺寸 / 用途 / finish**，届时每页差异化。
到货后跑 `npm run content:enrich` 之前先扩 `CITED` 表，别手改 431 个 JSON。

## 八·六、后缀码：甲方确认一次就能差异化 85 个页面

目录里自带图例，**不是猜的**：

| 证据 | 出处 |
|---|---|
| `PB=Polish Brass` | 6094 PBBK 的 Finish 字段 |
| `SN=Satin Nickel` | 70710 SN |
| `SC= Satin chrome` | 70610 SC |
| `BN Black Nickle` | 9211 BNAC |
| `Satin Stainless Steel (SS)` | 9080E |
| W = 白色 | 甲方微信 2026-08-27 |

**已确认**：PB / AB / AC / SN / SC / CP / SS / SSS / PSS / BN / SB / W。
**待确认**：F（甲方说「应该是木把手吧」，不确定）、WL、SP、以及 ET / PS / BK 三个功能后缀。
甲方确认后跑一个脚本即可给 32 个 stainless-steel-handles、30 个 lever-handles
逐型号补 Finish，正文就不再重复。

## 九、怎么干活

```bash
npm run check        # lint + typecheck + **test** + build + test:export，提交前必跑
                     # ⚠ 真读输出，别只 grep 测试行——构建失败会被漏掉
npm test             # 47 个测试
npm run deploy:prep  # 构建并校验 out/ 是最新
node scripts/audit-seo.mjs   # 读 out/ 的 HTML 审计 SEO
npm run content:enrich       # 由型号命名规则+甲方 worldbid 文案补规格表
npm run seo:indexnow         # 推送到服务器之后再跑
npm run assets:editorial     # 加了编辑图必跑，否则 prebuild 直接终止构建
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
- **CMS 登录白屏（2026-08-28 排查了一轮）**。三处必须同源，改一处就要改另外两处：
  Worker 的 `ALLOWED_DOMAINS` · `config.yml` 的 `base_url` · GitHub OAuth App 的 callback。
  换域名后只改了站点没改 Worker，登录就全断。
  症状极具误导性：Worker 拒绝时返回 **HTTP 200、1504 字节、可见文字为零**（内容全在
  `<script>` 里），浏览器渲染成纯白，看起来像 about:blank，完全不像域名问题。
  排查方法：`curl -o /dev/null -w "%{redirect_url}"` 打
  `<base_url>/auth?provider=github&site_id=<域名>&scope=repo`，能 302 到 github.com 才算通。
- **`*.workers.dev` 在国内部分网络不可达**（同事的 Mac 上 Edge 报 `ERR_TIMED_OUT`）。
  已改用 `auth.cantonlock.com`（同一个 Cloudflare zone，主站通它就通）。
  ⚠ 别被"另一台设备能用"误导——那台多半走的手机流量，不是同一条网络。

## 十、下一个会话建议顺序

1. **铺 429 个西语产品路由**
   甲方 2026-08-28 明确授权先上线，后续收到母语术语修订再更新。
   加 `src/app/es/products/**` 路由 + `SPANISH_MIRROR_PREFIXES` 对应前缀；上线前仍需检查
   nameEs/summaryEs/specsEs 回退、canonical、hreflang、JSON-LD 与 Sitemap 是否逐页一致。
2. **确认后缀码对照表** —— 见第八·六节，甲方确认后可差异化 85 个重复页
3. **继续写指南文章** —— 已上线 3 篇，选题见 `docs/content/EDITORIAL_PLAN.md`。
   ⚠ 选题 1（EN 1125 vs ANSI）要重写角度：我们没有 ANSI/BHMA，EN 1125 只覆盖一个型号。
   讲标准本身可以，**任何"我们已认证"的暗示都不行**。
4. **修剩下 75 个产品的图**（见第七节）

**服务器相关**：回滚与止损见 `docs/deployment/CANTONLOCK_ROLLBACK.md`。
⚠ **每次部署后必须去 Cloudflare 手动 Purge**。Cache Rule 设的是
"Ignore cache-control header, Edge TTL 2 hours"，不清缓存最多 2 小时看不到新内容。
`curl -sI https://cantonlock.com/ | grep cf-cache-status` 应为 HIT（已验证生效）。

⚠ 证书 **2026-12-14 到期**且已开 HSTS（一年）——过期未续则网站完全打不开，
建议到期前换 Let's Encrypt 自动续期。
