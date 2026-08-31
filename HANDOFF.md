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

产品 435 · 静态页 **938**（公开 930，其中西语 459）· 产品图 1479 张 · 测试 **114 + 25** 全过

**已完成**：全站页面、**西语全目录 459 页**、FAQ、价格表索取、站内搜索、弹窗、CMS 五栏目、
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

## 五、⚠ 下一个会话的三件事（按价值排序）

### 1. 西语规格表还有 9% 是英文 —— 不依赖任何人，今天就能做

    未译规格行   274 / 3040（9%，最初 25%）
    受影响页面   129 / 426（30%，最初 88%）
    剩余词条     352 个，基本都只出现 1 次，是真长尾

**做法**：`node scripts/translate-products-es.mjs`（不加 --write）会列出所有未命中的词条
及其出现次数；在 `src/data/es-glossary.ts` 补词条，再 `--write`。**先补标签再补取值** ——
标签是每行的左栏，一个缺失标签出现在所有带该属性的产品上，一个缺失取值只出现一次。

⚠ **不要机翻**。查不到的词条脚本会原样留英文并计数，这是设计，不是 bug。
术语表用的是拉美外贸西语（`entrada` 不是 `retranqueo`，`manija` 不是 `manilla`）。
母语复核件在 `docs/content/revision-terminologia-es.docx`，甲方在找人看。

### 2. tid 映射还没部署到服务器 —— 单项性价比最高的 SEO 动作

`deploy/nginx/legacy-redirects.conf` 已含 11 条旧分类 → 新分类的映射，
**但服务器上的还是旧版**。实测 `tid=97` 仍落在 `/products/` 而不是 `/products/lock-cases/`，
而 GSC 显示 **tid=97 一个就带 456 条内链**。全部倒进通用 hub，Google 读作 soft 404。

**需要人在服务器上做**：更新该 conf 并 reload nginx。代码侧已就绪，无需再改。

### 3. 还有 9 个 0 规格 + 27 个 1–2 行

图纸里还有尺寸没读完，见第八·七节。

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

**已确认启动**：Service 聚合栏目 · 展会日程页 · Newsletter 界面系统 ·
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
| F = 喷木纹球 | 甲方确认 2026-08-28 |
| WL = 白色喷漆球 | 甲方确认 2026-08-28 |
| SP = 抛亮光 / Shiny Polish | 甲方确认 2026-08-28 |
| ET = 门锁功能 / Entrance Lock | 甲方确认 2026-08-28 |
| PS = 通道功能 / Passage Lock | 甲方确认 2026-08-28 |
| BK = 浴室功能 / Privacy Lock | 甲方确认 2026-08-28 |

**已确认**：PB / AB / AC / SN / SC / CP / SS / SSS / PSS / BN / SB / W / F / WL / SP / ET / PS / BK。
下一步单独提交后缀解析：用 F / WL / SP 选择对应首图及补 Finish；用 ET / PS / BK
补 Function。先生成 dry-run 对照表，逐条校验实际存在的图片文件，再写产品 JSON，不能仅凭
字符串批量覆盖现有甲方已选首图。

## 八·七、图纸里的尺寸：已做 20 个，剩下的没有便宜的自动化

产品图库里混着**带尺寸标注的 CAD 图纸**，此前从没读过。它是我们手上最权威的来源
（甲方自己的生产图），而且**它推翻过已发布的数据** —— 五个玻璃门拉手都写着
`Size = 32x300x600 mm`（stahlock 一条文案复制到整个系列），五张图纸没有一张出现 300mm。

已读 20 个产品的图纸，写进 `scripts/cad-dimensions.mjs`，每条都带 `drawing` 字段指明
出处，可随时复查。**LC07 那张图独立验证了 LC 命名规则** —— 图上直接印着 85 和 45。

⚠ **自动识别哪张图是图纸，我没做成。** 三种判据都试过：

| 判据 | 失败方式 |
|---|---|
| 纯黑墨水 | 漏掉每一张细线图 —— 图纸的线是抗锯齿的灰，不是纯黑 |
| 长直线（尺寸线） | 把深色照片全捞进来，每一行都有长暗色游程 |
| 纸白 + 无中间灰 | 白底摄影棚照片照样通过 |

同一张营销拼图被逐产品重新编码，**哈希去重也救不了**（248 张候选去重后仍是 246 张）。

**现状**：248 张候选人工读了 28 张，命中约 20 张真图纸。剩余清单在
`tmp/claude-cad/worklist.json`（A 组 = 规格 ≤3 行，B 组 = 有尺寸行待核对）。
**这一步要么继续人眼读，要么上 OCR。别再花时间调像素判据了。**
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
