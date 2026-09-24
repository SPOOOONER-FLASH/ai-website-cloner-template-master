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

**三件。②③ 是 09-24 新加的。** 09-23 的「服务器停止更新」已经修好，移进了 `archive/2026-09-24-server-deploy-v2.md`。

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

### ③ 装一次新的跳转规则 —— 2 分钟，今天做（2026-09-24）

**为什么**：有个产品网址写着「ansi-grade-3」（`/products/grip-handle-sets/ansi-grade-3-keyed-deadbolt-lock-set/`），
我们没有 ANSI 认证，网址不能这么写。已改成 `keyed-deadbolt-lock-set`。旧网址已被 Google 收录，
要在服务器上装一条 301。**装好之前旧网址是 404**（09-24 实测），Google 已收录的那一条会变成死链，所以今天就装。

**在宝塔终端贴这一行**：

```bash
bash /www/wwwroot/cantonlock.com/deploy/install-nginx-redirects.sh
```

**成功的样子**：最后一行是 `All redirects live. Now purge Cloudflare — it caches 301s.`
**然后 purge**（Cloudflare 会缓存 301）。
**失败时**脚本会自己把旧配置还原、不重载，网站不受影响 —— 整屏截图发我。

---

## 只有这两件是常规动作

| 什么时候 | 做什么 |
|---|---|
| 我说「已部署，记得 purge」 | 只 **purge** |
| 我说「有新的跳转规则」 | 先**装跳转规则**，再 **purge** |
| 其他任何时候 | **什么都不用做** |

服务器每五分钟自己拉一次代码，页面内容（产品、文章、翻译）**不需要你动手**。
需要你动手的只有 nginx 跳转规则，因为它在宝塔管理的目录里，脚本之外没人能碰。

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
