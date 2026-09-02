# 交接 — Canton Hyland / HYDE 官网

## 2026-09-02 Claude 发布点（下一位先读）

`8fa393b8f2` 已推送。977 页，语义问题 0，编辑告警 0，predeploy-check 通过。
IndexNow 已提交 969 条，返回 200 —— **Bing / Yandex / Naver / Seznam 不需要人手再做任何事**。
**发布接力棒空闲**（`out/` 干净）。**部署后要 purge Cloudflare。**

| 本次 | 结果 |
|---|---|
| 搜索按回车没反应 | 已修 —— 提交处理器原本只在恰好一条结果时关弹窗，其余什么都不做 |
| 近似型号建议看不到 | 已修 —— 原本排在六个类目胶囊和六个热门型号之后，被挤出手机屏幕 |
| **回车跳到随机 SKU** | 已修 —— 三层：精确型号 → 单一系列 → 不跳。`d` 命中五个系列就不替用户选，改为把系列做成胶囊提到结果上方。详见 `2026-09-02-claude-search-broadens-instead-of-guessing.md` |
| AR4 手机端太占位置 | 已改 scroll-snap 横轨，区块高度 2300 → 937；桌面端无变化 |
| `/compare/` 找不到入口 | `/products/` 新增 15 条入链 |
| 美工填写表 | `scripts/build-design-brief.mjs` → 74 个要拍照 · 1 个只差选封面 · 69 个只有一张图 · 126 个没有介绍 |
| 手动提交清单 | `scripts/build-submit-list.mjs` → Google 配额排序，第一组 34 条新页面 |

细节与踩坑：[`docs/collaboration/agent-updates/2026-09-02-claude-search-enter-ar4-rail-and-handoff-sheets.md`](docs/collaboration/agent-updates/2026-09-02-claude-search-enter-ar4-rail-and-handoff-sheets.md)

给甲方同事的表格集中在 `C:\Users\johns\Desktop\hyde\`，`npm run sheets` 重跑。

---

## 2026-09-01 Codex 发布点

正式发布 `43e2040cc6` 已推送，服务器计划任务在 2026-09-01 14:10 UTC 拉取。绕过 Cloudflare
直连 `43.131.27.225` 后，首页与 564 MB 页面 Git blob 均与该提交完全一致；正式域名无查询参数
首页、564 MB、023 ET 与三张关键图片均已验证。Cloudflare 首页和新展厅图已返回新内容 `HIT`。

本次上线包括：产品返回会话记忆、墨西哥/阿根廷“意向参展”、真实展厅首页图、564 MB 黑色首图，
以及 1,485 张逐组修复的 HYDE 产品衍生图。IndexNow 已提交 sitemap 中 933 个 URL，返回 200。
GitHub workflow 的 SSH 步骤仍因 `SSH_HOST` 为空而跳过；正式部署由服务器每五分钟的受控 `git pull`
完成。`out/` 已构建、审计、提交并推送，发布接力棒空闲；陌生脏文件仍按 `AGENTS.md` 保护。

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

产品 435 · 静态页 **941**（公开内容页 933，其中西语 459）· HYDE 产品衍生图 1,485 张 · 测试 **151 + 25** 全过

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

### 3. EH01 是 75 个「无图产品」里唯一已经有照片的

`content/products/eh01-lever-handle.json` 的 `heroImage` 有 `label` 没有 `src`，
所以被计入「75 个无图」。但磁盘上有 **8 张**
（`public/images/products/eh01-lever-handle-{2..9}.webp`，`products-hyde/` 水印版同样 8 张，
编号从 -2 起、无基准文件）。全量扫过 435 个产品：75 个缺 `heroImage.src`，
**只有 EH01 带相册**，所以真实缺口是 74。它有 18 行规格，是 lever-handles 里最全的两个之一,
只差「指定哪张当首图」—— 属编辑决定，与八·六「首图应该是黑色款」同类。

> 2026-09-02：这个区分已经写进 `scripts/build-design-brief.mjs`，美工表第四节列 74 个
> 要拍的，第四·五节单独列 EH01 并注明「不用再拍，只要选一张」。把它放进拍摄清单，
> 等于派人去拍一个已经拍过八次的产品。

### 4. 页脚移动端挤压（Codex 的 Footer 批次未覆盖）

`docs/superpowers/specs/2026-08-31-hyde-sales-imagery-watermark-footer-design.md`
已批准并认领 `SiteFooter.tsx`，覆盖了「How to buy 精简为 Contact / FAQ / Alibaba / 邮箱」。
但甲方真正抱怨的「底部不对齐、How to buy 太拥挤」是另一回事：

> 页脚三块在移动端是 4 栏网格里的 `col-span-2`，各占一半宽 ——
> 375px 上每栏只有 163px，Newsletter 与 How to buy 并排硬挤。
> **精简链接不解决它**，需要 `sm` 以下改 `col-span-full` 单列堆叠。

### 已关闭（勿再排期）

西语英文残留 · tid 类目映射 · 移动端无导航 · 首页轮播指向单个 SKU · 搜索框无默认建议 ·
字阶塌陷与字重倒挂 · 26 个产品筛选不可达 —— 全部 2026-08-31 前完成并由测试锁定。
细节见 `docs/collaboration/agent-updates/2026-08-3*`，不在这里重复。

2026-09-01：工厂/办公室地址拆分 · 撤下制造主体名 · `/compare/` 15 页 · `/collections/` 19 页 ·
搜索近似型号建议 · FAQ 五个商务问题（MOQ / 交期 / 样品 / 付款 / OEM）。

2026-09-02：搜索按回车无反应 · 近似建议被挤出屏幕 · 回车跳到随机 SKU ·
AR4 手机端纵向堆叠 · `/compare/` 无入口。

### 已知未修（别当成已修）

搜 `lv` 返回 9 条噪音结果而不是空 —— 通用匹配器对 `entry.text` 做子串匹配，
两个字符在正文里到处能撞上。改匹配阈值会动到所有查询的排序，需要单独一轮并配测试。

## 六、Bing 报的 86 个错误

| 类型 | 页数 | 说明 |
|---|---|---|
| `<h1>` 缺失 | 4 | 需定位是哪 4 页 |
| meta 描述过短 | 26 | 建成品里只有 14 页 <110 字符：/contact/ 74、/company/ 82、/products/knob-locks/ 91、/downloads/ 98 |
| 标题过短 | 25 | 建成品里 19 页 <40 字符，多为 d101-* 系列。差额是旧站 index.php URL，301 后自然消失 |
| 内容过少 | 25 | 已修大部分 |
| `<img>` 缺 alt | 4 | |

## 六·五、2026-09-01 结论：瓶颈已经从代码转到数据

结构工程基本做完了 —— Schema、canonical、301、hreflang、图片 sitemap、面包屑、
商业意图词、五条商务 FAQ 全部上线，AI 已引用 9 次。**再投代码的边际收益在快速下降。**

真正卡住的是字段覆盖率，量出来是这样：

```
Packing         1%   还缺 429      ← 报价与运费全卡在这
Cycle life     23%   还缺 333
Backset        33%   还缺 291
Function       38%   还缺 271
Door thickness 37%   还缺 272
Application    49%   还缺 222
Finish         66%   还缺 150
Material       90%   还缺  45
```

`available on request` 只有 48 行 / 48 个产品 —— **不是主要问题，「根本没有那一行」才是。**

给供货同事的填写表（**唯一一份**，双击浏览器打开就能填，自动保存，填完点【复制全部】发微信）：
[`docs/research/SUPPLIER_WORKBOOK.html`](docs/research/SUPPLIER_WORKBOOK.html) —— 216 个填写框。
它把「规格缺口」和「买家问题库」合成了一份：同一个事实只问一次。
重跑 `node scripts/build-supplier-workbook.mjs`，补进数据后表会自动变短。

完整复盘、Gemini 35 条对账、Claude × Codex 分工：
[`docs/collaboration/agent-updates/2026-09-01-claude-fsb-benchmark-and-division-of-labour.md`](docs/collaboration/agent-updates/2026-09-01-claude-fsb-benchmark-and-division-of-labour.md)

## 六·六、FSB 20 维对比报告：逐条回应（2026-09-01）

9 条已完成或当日完成 · 5 条被数据卡住 · **4 条我判断不该按它说的做** · 2 条需甲方决策。

不该做的四条：设计师背书（我们没有大师 IP，替代品是车间实拍）·
分面静态聚合页（447 页还没被抓，再造 URL 只会让队列更长）·
「缺 JSON-LD」（与事实相反，Bing AI 已引用 9 次）· ESG 声明（没报告就是编造）。

**对标的正确用法是看清差距，不是照着变成对方。** 把 20 条都补齐会得到一个更差的 FSB。
该问的是：FSB 用设计师建立信任，我们用什么？答案是车间和数据。

全文：[`docs/collaboration/agent-updates/2026-09-01-claude-fsb-20-point-response.md`](docs/collaboration/agent-updates/2026-09-01-claude-fsb-20-point-response.md)

## 七、需要甲方给数据才能推进

- **75 个产品无图**（原 113，2026-08-27 从 F 盘补了 38 个）。
  剩下的多为同型号不同表面处理（607 ABET/BNET/FET/WBK/WLET，F 盘只有 607 PBBK）——
  **不能拿别的表面处理的照片顶替**。要么补拍，要么合并成带变体的单页。
- 77 张图是 2022 旧拍（带 cantonlock.com 水印），已按甲方要求先上线。
  `/status/` 有「图片是旧拍摄，待重拍」一栏，读 `ImageRef.sourceNote`，重拍后可批量定位。
- **FAQ 五条空答案：MOQ · 交期 · 样品 · 付款方式 · OEM。** 阿里后台可导出。
  这是单项价值最高的内容缺口 —— 买家问价之前先问这五个，答案引擎也拿它们判采购意图。
- Application 用途字段（只有 213/435 的产品有）
- 44 个属性字段里的整句话要改写成值
- **四个横向缺口，一次写作能填掉 20+ 个买家问题**：盒内配件（螺丝/方轴/锁扣板含不含，
  最常见的错单原因）· 销售单位（铰链按只还是按对，报价差一倍）· 耐腐蚀等级
  （304/201/316，沿海与泳池项目必问）· 成套搭配（玻璃门一樘需要哪几件）。
  另需两个边界声明：**HS 编码**（每个进口商都要）与**保修**。

> 以上缺口已全部并进 [`docs/research/SUPPLIER_WORKBOOK.html`](docs/research/SUPPLIER_WORKBOOK.html)
> —— 170 个买家问题，完整回答 34 / 部分 58 / 无 78，待答的 136 条都在第三部分里逐条问。
> 随时跑 `node scripts/audit-question-coverage.mjs` 看数字（只打印，不写文件）。
> **不要为了让数字好看去编答案。**

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

**见第五节。** 西语与 tid 两项已关闭，现在的顺序是：继续读图纸补规格（第八·七节）
→ 后缀码差异化 85 个页面（第八·六节）→ EH01 首图 → 页脚移动端两栏挤压。

第八·六节的后缀码对照表已由甲方确认并全部落地，不必再问。

**服务器相关**：回滚与止损见 `docs/deployment/CANTONLOCK_ROLLBACK.md`。
⚠ **每次部署后必须去 Cloudflare 手动 Purge**。Cache Rule 设的是
"Ignore cache-control header, Edge TTL 2 hours"，不清缓存最多 2 小时看不到新内容。
`curl -sI https://cantonlock.com/ | grep cf-cache-status` 应为 HIT（已验证生效）。

⚠ 证书 **2026-12-14 到期**且已开 HSTS（一年）——过期未续则网站完全打不开，
建议到期前换 Let's Encrypt 自动续期。
