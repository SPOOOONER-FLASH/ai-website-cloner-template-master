# 交接 — Canton Hyland / HYDE 官网

## 2026-08-31 Codex 停工点（下一位先读）

本轮已提交并推送墨西哥、阿根廷两项“意向参展”内容：`1215dd7c2`。CI 与静态导出通过，
但**没有部署到正式服务器**：GitHub 发布任务中的 `DEPLOY_HOST` 为空，公网
`https://cantonlock.com/events/` 仍是旧 HTML；这不是 Cloudflare 单纯缓存问题。

2026-08-31 后续源代码已加入产品返回记忆：同一浏览器会话内从详情返回英文/西语类目或
Product Finder 时，恢复筛选、页码、原卡片与滚动位置；关闭会话后清除。`out/` 与正式站尚未更新。

当前工作树另有 **5,164** 个未提交路径，核对时全部属于 `out/`，是其他会话/构建者的
水印和发布产物。**不要 restore、clean、批量 stage，也不要重新运行 `deploy:prep` 覆盖它们。**
先确认来源、审阅差异和发布 baton，再做下一次构建。

下一位 Codex 的完整优先级、验收条件和未完成指令见：
[`docs/collaboration/agent-updates/2026-08-31-codex-stop-point-and-open-work.md`](docs/collaboration/agent-updates/2026-08-31-codex-stop-point-and-open-work.md)。
本节优先于下文的旧状态数字；完成正式发布、图片人工复核和最终审计后，再据实重写整份交接。

> 新会话先读这份，再按需读 `docs/collaboration/agent-updates/`（Claude × Codex 互通进度）。
> 最后更新：2026-08-31

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

产品 435 · 静态页 **938**（公开 930，其中西语 459）· 产品图 1479 张 · 测试 **114 + 25** 全过

**已完成**：全站页面、**西语全目录 459 页**、FAQ、价格表索取、站内搜索、弹窗、CMS 五栏目、
SEO 元数据（471 页全带 canonical/hreflang/OG/JSON-LD）、`llms.txt`、Product Finder
（20/页 + 分面折叠 + 独立滚动 + `1 2 3 … 22` 总页数提示）、全部 435 个产品链接服务端渲染（`ProductIndexList`）、阿里深链接、GA4 + Clarity、旧站 URL 301。
产品详情返回记忆为 session-only：类目页与 Finder 的筛选、页码和原卡片滚动位置可恢复。

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

## 五、⚠ 下一个会话该做什么

### 1. 还有 9 个 0 规格 + 27 个 1–2 行 —— 唯一剩下的内容缺口

图纸里还有尺寸没读完，见第八·七节。完整任务书：`docs/collaboration/tasks/cad-drawing-extraction.md`

### 2. 后缀码差异化 85 个页面

第八·六节已列全 18 个已确认后缀。下一步：F / WL / SP 选首图并补 Finish，
ET / PS / BK 补 Function。**先出 dry-run 对照表并逐条核对图片文件是否存在**，
不能凭字符串批量覆盖甲方已选的首图。

### 已关闭

| | |
|---|---|
| 西语规格表英文残留 | 2026-08-31 清零。274 → 0 行，426 页全覆盖 |
| tid 类目映射 | 2026-08-30 上线，2026-08-31 复测 11 条全中 |

## 六、Bing 报的 86 个错误

| 类型 | 页数 | 说明 |
|---|---|---|
| `<h1>` 缺失 | 4 | 需定位是哪 4 页 |
| meta 描述过短 | 26 | 建成品里只有 14 页 <110 字符：/contact/ 74、/company/ 82、/products/knob-locks/ 91、/downloads/ 98 |
| 标题过短 | 25 | 建成品里 19 页 <40 字符，多为 d101-* 系列。差额是旧站 index.php URL，301 后自然消失 |
| 内容过少 | 25 | 已修大部分 |
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

**已确认启动**：Service 聚合栏目 · 展会日程页 · Newsletter 界面系统 ·
资质证书页（Kale 文件除外）· 材料内容线 · 应用场景页 · 图片 ALT 批量管理 ·
429 个西班牙语产品路由。西语术语可先上线，甲方后续提供修订。

**已完成**：首页「当季主打市场」采用 AR-4 建筑主视觉 + 四宫格；四款产品同时保留长期产品页。

**不做**：经销商查询 · 网站装修拖拽编辑器

## 八·五、甲方明确的下一批数据

甲方确认后期会给：**尺寸 / 用途 / finish**，届时每页差异化。
到货后跑 `npm run content:enrich` 之前先扩 `CITED` 表，别手改 431 个 JSON。

## 八·六、后缀码

**唯一口径：`docs/collaboration/tasks/model-suffix-codes.md`** —— 含证据分级、
已确认 18 + 1 个码（2026-08-31 新增 MB = Matt Black，证据 `564 MB` 自己的 Finish 字段）、
7 个仍未确认的码，以及 **28 个型号的 Finish 行与自身后缀矛盾**的清单
（`suffix-finish-contradictions.json`）。那 28 条是玻璃拉手 300mm 的同一类事故。

## 八·七、图纸里的尺寸：已做 27 个，筛选判据已解决

产品图库里混着**带尺寸标注的 CAD 图纸**，此前从没读过。它是我们手上最权威的来源
（甲方自己的生产图），而且**它推翻过已发布的数据** —— 五个玻璃门拉手都写着
`Size = 32x300x600 mm`（stahlock 一条文案复制到整个系列），五张图纸没有一张出现 300mm。

已读 27 个产品的图纸，写进 `scripts/cad-dimensions.mjs`，每条都带 `drawing` 字段指明
出处，可随时复查。**LC07 那张图独立验证了 LC 命名规则** —— 图上直接印着 85 和 45。

**判据 2026-08-31 解决了。** 前三次都在量墨水本身，都失败。真正的分开点是墨水
**有多孤立**：产品照的暗像素周围还是暗像素（物体内部），图纸的暗像素周围是纸。
`scripts/score-cad-drawings.mjs` 算这个（speckle）。全库 1478 张实测：
19 张已确认图纸 0.53–0.99，14 张已确认照片 0.01–0.18，中间无样本。
按排序开 8 张命中 8 张；按旧清单开 6 张命中 0 张。

⚠ 反例：`lc9045-lock-case.webp` 是真图纸但排第 1074（深色渲染图，只印了两个数字）。
分数低只能用来排先后，不能当"不是图纸"的证据。

**待读清单**：`docs/collaboration/tasks/cad-drawing-ranked.json` —— 82 个产品 / 90 张图。
旧的 candidates（248 张）和 worklist 已废弃。
完整任务书（含写入格式与三条纪律）：`docs/collaboration/tasks/cad-drawing-extraction.md`

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

**见第五节的三件事。** 顺序就是那个顺序：西语补词条（不依赖任何人）→ tid 映射
（需要服务器）→ 继续读图纸（见第八·七节）。

第八·六节的后缀码对照表已由甲方确认并全部落地，不必再问。

**服务器相关**：回滚与止损见 `docs/deployment/CANTONLOCK_ROLLBACK.md`。
⚠ **每次部署后必须去 Cloudflare 手动 Purge**。Cache Rule 设的是
"Ignore cache-control header, Edge TTL 2 hours"，不清缓存最多 2 小时看不到新内容。
`curl -sI https://cantonlock.com/ | grep cf-cache-status` 应为 HIT（已验证生效）。

⚠ 证书 **2026-12-14 到期**且已开 HSTS（一年）——过期未续则网站完全打不开，
建议到期前换 Let's Encrypt 自动续期。
