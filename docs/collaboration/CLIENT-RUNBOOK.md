# Spooner 操作手册

**最后更新：2026-09-24 · 更新人：Claude**

这份文件只写**现在要做什么**。做完的、过时的一律移进
`docs/collaboration/archive/`，不留在这里。

> 甲方 2026-09-17：「那个 runbook 都是旧的信息，我需要每次你给我安排工作要清晰的
> 指令和新的指引。」
>
> 之前那份 1,412 行的手册里，光「让 301 生效」就有 1、1a、1b、1c、1c-新、1d 六节，
> 其中三节写的是「这一节又旧了，回去跑第 1 节」。整份已存进
> `archive/2026-09-17-client-runbook-history.md`，只当记录，**不要照着做**。
>
> 从今天起的规矩：**你要动手的事，永远只在这份文件的第一屏，带日期**。
> 做完一条我就把它移走。你在这里读到一条已经做完的事，是我的错，告诉我。

---

## 现在要做的（2026-09-24）

上一屏（2026-09-22 的五件事）已经全部做完，移进了
`archive/2026-09-22-ga4-www-gsc-video-nginx.md`，**不要再照着做**。
每一件的实测结果写在那份存档的开头。

**四件。②③④ 是 09-24 新加的。** 09-23 的「服务器停止更新」已经修好，移进了 `archive/2026-09-24-server-deploy-v2.md`。

---

### ① Search Console 再请求收录 20 条 —— 今天 10 条，明天 10 条

你已经点完前 20 条。**40 篇指南里还剩这 20 条没点。** 步骤和上次完全一样：
打开 https://search.google.com/search-console → 左上角确认 **cantonlock.com** →
把网址粘进**页面最顶部的长条搜索框** → 回车 → 等 30 秒 → 点 **请求编入索引**。

**今天这 10 条**（按「买家在 Search Console / Bing 里真的搜过的词」排序，
数据来自 `docs/research/QUERY-CORPUS-2026-09-22.md`）

```
https://cantonlock.com/guides/door-thickness-to-cylinder-length-2026/
https://cantonlock.com/guides/master-key-hierarchy-planning-2026/
https://cantonlock.com/guides/en-1125-vs-en-179-2026/
https://cantonlock.com/guides/dimensional-interchangeability-2026/
https://cantonlock.com/guides/qualifying-a-hardware-supplier-2026/
https://cantonlock.com/guides/exit-device-outside-trim-functions-2026/
https://cantonlock.com/guides/zinc-alloy-die-cast-hardware-2026/
https://cantonlock.com/guides/brass-alloys-and-dezincification-2026/
https://cantonlock.com/guides/hardware-refurbishment-survey-2026/
https://cantonlock.com/guides/chrome-finish-differences-2026/
```

**明天这 10 条**

```
https://cantonlock.com/guides/commercial-lock-function-decision-2026/
https://cantonlock.com/guides/powder-coating-and-ral-2026/
https://cantonlock.com/guides/stainless-grade-selection-201-304-316-2026/
https://cantonlock.com/guides/universal-vs-handed-hardware-2026/
https://cantonlock.com/guides/specification-section-08-71-00-2026/
https://cantonlock.com/guides/certification-and-test-validation-2026/
https://cantonlock.com/guides/material-traceability-mill-certs-2026/
https://cantonlock.com/guides/submittal-package-contents-2026/
https://cantonlock.com/guides/technical-drawings-what-to-expect-2026/
https://cantonlock.com/guides/hardware-warranty-what-it-covers-2026/
```

**说实话的一句**：排序信号很薄。今天第一条在查询里出现 26 次，第十条只有 1 次；
明天后 8 条是 **0 次** —— 买家还没在我们看得到的地方搜过这些词，不代表没人搜。
所以明天那批是「按题目的采购意图」排的，不是按数据。

**点完 40 条之后**：35 篇旧文章（`/news/`）的英文版都扩写过了，内容变化很大，
值得再点一轮。那一轮我到时候给你按 AI 引用数排好的清单，**现在不用管**。

**遇到这两种情况**

- 说「已超出配额」→ 今天就停，明天接着点。不是出错。
- 说「网址不在 Google 上，且存在编入索引问题」→ **截图发我**，先别自己动。

---

### ② GA4：把「阅读方式」登记成自定义维度 —— 10 分钟，一次性（2026-09-24）

**为什么**：你问过「怎么分辨快速滑到底的人和逐字看的人」。网站从这次发布起会发这些事件：

| 事件 | 什么时候发 | 带的参数 |
|---|---|---|
| `scroll_depth` | 页面看到 25% / 50% / 75% / 90% 各一次 | `percent`、`page_type` |
| `article_read` | 离开一篇文章时 | `read_style`（skim 快速滑过 / read 认真读 / browse / bounce）、`percent`、`seconds` |
| `select_item` | 从任何页面点进某个产品 | `item_id`（产品）、`item_list_name`（从哪类页面来） |
| `contact_click` | 点邮件、WhatsApp、Alibaba、联系表单 | `method` |
| `configurator_open` | 点进配置器 | `page_type` |

事件会自己出现在 GA4 里，**但参数要登记一次才能在报表里按它分组**。

**步骤**：
1. 打开 https://analytics.google.com → 左上角确认账号 **hyde数据看板** / 媒体资源 **cantonlock**
2. 左下角齿轮 **管理** → 中间那栏 **数据显示** → **自定义定义** → 右上角 **创建自定义维度**
3. 每行填一次、点保存，共 5 次（「范围」都选 **事件**）：

| 维度名称 | 事件参数 |
|---|---|
| 阅读方式 | `read_style` |
| 页面类型 | `page_type` |
| 联系方式 | `method` |
| 产品来源页 | `item_list_name` |
| 滚动深度 | `percent` |

4. 再点 **自定义指标** 标签 → **创建自定义指标**：名称 **阅读秒数**，范围 **事件**，事件参数 `seconds`，计量单位 **标准**。

**成功的样子**：「自定义定义」列表里出现这 6 行。数据从登记之后开始积累，**24–48 小时后**报表里才看得到。
**Clarity 不用你做任何事**：录像里可以直接按标签 `read_style = skim / read` 筛选（筛选 → 自定义标签）。
**看不到「创建自定义维度」按钮**：你的账号权限不是「编辑者」，截图发我。

---

### ③ 最后一次在终端贴命令：让跳转规则以后自动装 —— 1 分钟（2026-09-25）

**为什么以前每次都要你贴**：nginx 读的跳转规则放在宝塔自己的目录里，不在网站代码里。服务器每 5 分钟自动拉一次代码，
但拉的只是网站文件，规则文件得有人拷过去、测试、重载，所以一直要你去终端贴那一行。

**现在改好了**：每 5 分钟的自动拉取顺带检查规则。仓库里的规则和服务器上装的不一样，就自动装：
先用 nginx -t 测试，失败就还原旧规则、不重载，网站不受影响。
但服务器上跑的是那个自动拉取脚本的**旧副本**，要把新版装上去一次。**等我说「自动装已推送」5 分钟之后**（服务器要先拉到新版），在宝塔终端贴这一行：

```bash
sudo bash /www/wwwroot/cantonlock.com/deploy/install-deploy-script.sh
```

**成功的样子**：最后一行是 ✓。**失败**：最后一行是 ✗，什么都没改，整屏截图发我。
**装完以后**：跳转规则再也不用你贴了，只剩 purge。（09-25 18:15 你装的那次已经全部生效，钢琴合页、卫浴旧网址我都实测过。）
想看它有没有自动装过，在终端贴：`tail /var/log/cantonlock-redirects.log`

### ④ GA4：删掉重复的 G-X7EMRX2V2X —— 5 分钟（2026-09-24）

**为什么**：你 09-24 回复「之前加的，重复无用就删掉」。它确实是重复的：09-24 实测，每次访问
我们的看板 **G-RBTE7KF82P（「hyde数据看板」）** 收 1 次，**G-X7EMRX2V2X 也收同样的 1 次**。
我们所有报告只读 G-RBTE7KF82P，那一份没人看；它还让每次访问多下载两次 Google 脚本，拖慢手机。
删掉的是「转发」这条线，**G-X7EMRX2V2X 里已有的历史数据不会被删**。

它不在网站代码里，是 GA 后台把它挂成了同一个 Google 代码的「目标」，所以只能你在后台删：

1. 打开 https://analytics.google.com ，左上角切到媒体资源 **cantonlock**（编号 G-RBTE7KF82P）。
   **注意别切到 G-X7EMRX2V2X 那个资源里去操作。**
2. 左下角齿轮 **管理** → **数据收集和修改** → **数据流** → 点那条网站数据流（cantonlock.com）。
3. 页面往下拉，点 **配置代码设置**。会打开 Google 代码页面，编号是 **GT-PL3V5HF9**。
4. 在这个页面找 **目标**（Destinations）一栏：里面应该列着 G-RBTE7KF82P 和 G-X7EMRX2V2X 两个。
5. 点 **G-X7EMRX2V2X** 那一行右边的三个点或「管理」→ **移除目标**，确认。**G-RBTE7KF82P 不要动。**

**成功的样子**：目标一栏只剩 G-RBTE7KF82P。生效最多要等一小时，我会再用无头浏览器实测一次，确认只发给 G-RBTE7KF82P。
**找不到「目标」这一栏，或者列表和上面说的不一样**：停下，整页截图发我，不要删别的东西。

**GTM**：你说「页面加载完再装，但一定要装上」，已改好（见 `src/components/site/Analytics.tsx`）。
Google 官方那段代码原样保留在 head 里（检测器认的就是它），只是等页面加载完才执行。发布后我实测三件事：
HTML 里有这段代码、加载完 gtm.js 确实下载了、dataLayer 里有 gtm.js 事件。你不用做任何事。

### ⑤ GTM：「Test」报 wasn't detected 不是没装上 —— 用 Preview 验证，2 分钟（2026-09-25）

**为什么 Test 永远不过**：GTM 的「Test your website」是从 Google 的服务器去抓网页。我 09-25 实测：
从 Google 服务器请求 cantonlock.com，拿到的是 Cloudflare 的 **403「Just a moment...」质询页**，不是网页。
这是 09-17 打开的 **Bot Fight Mode** 在起作用：它放行 Googlebot 这类已验证爬虫，但不放行 GTM 的检测器。
检测器看不到网页，就报没检测到。**真实访客的浏览器里 GTM 是正常加载的**（实测第 2.6 秒加载，容器已生效）。
09-24 我以为是代码写法的问题，这个判断是错的。

**用这个办法确认已装好（不用动 Cloudflare）**：
1. 打开 https://tagmanager.google.com ，进 cantonlock.com 这个容器，点右上角 **Preview**（预览）。
2. 在弹出的框里填 `https://cantonlock.com`，点 **Connect**。
3. 会新开一个窗口打开网站，右下角出现 Tag Assistant 的小标记；回到原来那个标签页，显示 **Connected** 就是装好了。

**成功的样子**：Tag Assistant 页面左侧能看到 Container Loaded（容器已加载）这类事件。
**连不上**：整屏截图发我。

**如果一定要让「Test」那个按钮变绿**：Cloudflare → Security → Bots → 暂时关掉 **Bot Fight Mode** → 回 GTM 点 Test →
变绿后**马上再打开** Bot Fight Mode。关着的这几分钟，机器人流量会进来，不影响网站。

### ⑥ Cloudflare「Security Insights」6 条：1 条要你做，4 条点 Archive，1 条我已修（2026-09-25）

你 09-25 导出的那 6 条，逐条实测过：

| 那一条 | 怎么处理 | 为什么 |
|---|---|---|
| **Users without MFA**（Moderate） | **要你做**：Cloudflare 右上角头像 → My Profile → Authentication → 开两步验证（手机装 Google Authenticator 扫码） | 这个账号管着网站和邮箱的 DNS，密码泄露就能改 DNS。这一条最重要 |
| Unproxied CNAME mail.cantonlock.com（Moderate） | **不要改**，点那一行右边 … → **Archive** | 它指向网易企业邮箱（mailhz.qiye.163.com）。Cloudflare 代理只转网页，不转 IMAP/SMTP；按它说的开橙色云，公司邮件客户端就连不上了 |
| Security.txt not configured | 已修：网站加了 /.well-known/security.txt（联系邮箱 tec@），**等我说已发布后**点 Archive | 它是给发现漏洞的人找联系方式的标准文件；到期前一个月测试会提醒续期 |
| AI Labyrinth（cantonlock.com） | 点 **Archive**，不要开 | 我们的策略是欢迎 AI 抓取、被 AI 引用（本周 OpenAI 抓了 2,517 次）。它只对不守规矩的爬虫起作用，但会往页面里塞 AI 生成的假链接，没必要冒这个险 |
| AI Labyrinth（rayen.cn） | 雷茵站的事，问雷茵那边 | — |
| No Turnstile enabled | 点 **Archive**，以后询盘垃圾多了再说 | Turnstile 是表单人机验证，要改询盘表单和后端；现在没有垃圾询盘的问题 |

**Signals 页那 535 条「违规」不用管**：全是 Meta 的爬虫在抓 `/pt/…/__next._tree.txt` 这类网站内部数据文件，robots.txt 里我们写了不许抓，它不守。那些文件对 SEO 没有价值，也不影响网站。

---

## 只有这两件是常规动作

| 什么时候 | 做什么 |
|---|---|
| 我说「已部署，记得 purge」 | 只 **purge** |
| 我说「有新的跳转规则」 | 只 **purge**（装好 ③ 以后，规则 5 分钟内自动装上） |
| 其他任何时候 | **什么都不用做** |

服务器每五分钟自己拉一次代码，页面内容（产品、文章、翻译）**不需要你动手**。
跳转规则也由这一轮自动装（2026-09-25 起，装好 ③ 之后）。

---

## 我刚刚替你查过的（2026-09-24 实测，不用你确认）

| 项目 | 状态 |
|---|---|
| `www.cantonlock.com` → 裸域 301 | ✅ 生效 |
| 英文旧类目跳转（`/products/door-hinges`） | ✅ 301 → `/products/brass-steel-hinges/` |
| 旧型号跳转 `index.php?aid=1569` | ✅ 301 → LC5845 锁体页 |
| 大写 `Index.php?aid=1555` | ✅ 301 → EH03 执手页 |
| 不存在的旧型号 id | ✅ 301 → `/products/`（不是 404） |
| `/index.asp` | ✅ 301 → 首页 |
| 旧站 `index.php` 地址（GSC 里仍有展示的 4 个） | ✅ 都 301 到对应新页 |
| 第二版部署脚本 | ✅ 生效：09-24 当天的两次发布都已在线上 |
| 线上是否是最新版本 | ✅ 09-24 实测：主钥匙文章与闭门器品类页已是当天新标题 |

---


## 出事了怎么办

**网站打不开 / 报 502** —— 和跳转规则无关的话，先在宝塔终端跑：

```bash
nginx -t
```

* 打印 `syntax is ok` 和 `test is successful` → 配置没问题，问题在别处，截图发我。
* 打印别的 → 截图发我，**不要保存任何配置文件**。

**`git pull failed` / 「local changes would be overwritten」** —— 服务器上有人手改过文件。
截图发我，我给你三行对齐命令（存档里 1c-新 节有，但我更愿意按当时情况给你，
免得你照着一份旧的敲）。

---

## 需要时再看（不用主动做）

这些都在存档里，需要时我会直接把当次的步骤贴给你，不要求你翻文档：

* Google Search Console 覆盖率报告里最大的三类（重复网页 462、已抓取未编入 421、
  已发现未编入 415）手动提交不起作用，原因写在 `OPEN-ITEMS.md` 第三之二节。
  **新上线的页面**手动提交是有用的 —— 那是上面 ① 在做的事。
* Bing / Clarity 设置 —— 已配置完成。
* Clarity 里怎么分辨爬虫和真买家、要不要封爬虫 —— 2026-09-10 的结论在存档里。
* 两台机器怎么同步、我在哪台机器上写文件 —— 存档第 7、8 节。
* 雷茵中文站预览域名、还缺的素材 —— 存档，以及 `OPEN-ITEMS.md`。
* skills 的安装与更新 —— `docs/collaboration/SKILLS.md`。

---

## 还欠我的东西（我会一直提醒）

完整清单在 `docs/collaboration/OPEN-ITEMS.md`。当前最挡路的四件（2026-09-17 实测数字）：

1. **五个订单代码的含义** —— 表面码 `N`，功能码 `KT` `IK` `PT` `BS`。
   （`DK` 你 2026-09-22 已确认 = 锁头双开，已上线。）
   `/finishes` 页面上其余几个仍印着「未确认」。每个一句话就能补上。
2. **五个型号的板尺寸** —— 307 / 311 / 305 / 035 的 **Plate size** 与
   **Plate thickness**（308 已经有 Plate size，还缺厚度）。
   这几个型号占了九十天询盘的大头，数一给，尺寸图和规格表当天就能出。
3. **308-S 与 308-D** —— 是同一个锁体配不同端盒，还是两套不同的东西。
   现在两条记录规格一样，站上不敢替工厂下结论。
4. **执手 / 拉手的固定孔径与孔中心距** —— **519 个已发布型号里只有 6 条有这个数**。
   开孔图生成器早就建好了，就卡在这一个字段上；买家换装时第一个要对的也是它。
