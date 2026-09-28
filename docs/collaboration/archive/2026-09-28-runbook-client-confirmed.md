# 存档：runbook 第一屏，甲方 2026-09-28 确认全部完成

> 这是记录，不是指令。**不要照着做。** 现在要做什么，只看 `docs/collaboration/CLIENT-RUNBOOK.md` 第一屏。

甲方 2026-09-28：「runbook 里面都做完了，你复查下」。

外部可测的前提（2026-09-28 实测）：security.txt 200；robots.txt 10 份 sitemap；/sitemap.xml 1.55 MB；/de/sitemap.xml 200、683 个网址；/de/、/de/products/、/fr/、/ar/products/ 200；GA4 G-RBTE7KF82P 在页面上。后台动作（GSC、GA4、Cloudflare MFA、Bing 提交）只能由甲方在后台确认，本次按甲方口头确认记为完成。

---

## 2026-09-28：Codex 续做钩子已配置，运行前需要一次审核

项目文件 `.codex/hooks.json` 和 `.codex/hooks/hyde-goal-stop.mjs` 已配置，并通过模拟测试。**尚未证实它在当前桌面会话里启用**。它只读取本次 HYDE 目标的未完成清单；不会替代账户额度、自动批准发布或操作其他会话。

Codex 的官方机制要求用户审核并信任每个新增或改变的钩子；这是软件的信任检查，不是网站发布所需的批准。说明来源：https://learn.chatgpt.com/docs/hooks。

如果要在 Codex CLI 使用它：

1. 在包含这次提交的项目文件夹打开终端，启动已经安装的 `codex`。不要为这一步安装新软件；如果没有这个命令，停在这里，继续使用当前聊天完成工作即可。
2. 在 Codex 提示框输入 `/hooks`。找到项目来源 `.codex/hooks.json` 下的 `Stop`，核对命令是 `node .codex/hooks/hyde-goal-stop.mjs`。
3. 读完后选择信任该定义。成功标志是该钩子显示已信任，而不是待审核。如果没有这个菜单或显示错误，停在这里，将错误文字发回；不要修改全局配置或使用跳过信任检查的启动参数。

该钩子只匹配当前目标会话 `01a085d0-c428-7210-b89a-dc7c4cd8cf02`；在另一条聊天里不会强制续做。任务清单位于 `docs/collaboration/tasks/2026-09-27-codex-desktop-search-goal.md`。实际已完成的任务才会勾选，外部缺失资料记为依赖。

---


---

## 现在要做的（2026-09-25 新增）：七个语种上线后，Search Console 里做两件事

七个新语种（法 德 日 韩 土 俄 阿）已经是和西语一样的完整站点（每个语种 746 页），发布会话从 E:/release 发布后即上线。
主资源的 sitemap.xml 已经包含全部十个语种的网址，**主资源不用再提交新的 sitemap**；每个语种另有自己的一份（`/de/sitemap.xml`、`/fr/sitemap.xml` …），给按语种建的资源用。要做的只有：

**① 给 /de/ 建一个「网址前缀」资源（甲方 09-25 的要求：赶 BAU 2027）**

1. 打开 https://search.google.com/search-console → 左上角资源下拉 → 最底下 **添加资源**。
2. 右边「**网址前缀**」那一栏填 `https://cantonlock.com/de/` → **继续**。
3. 验证：因为 cantonlock.com 这个域名资源你已经验证过，这里通常会**自动通过**，显示「所有权已自动验证」。
   如果没有自动通过，选「HTML 标记」以外的任何方式都不用管，直接截图发我，我来处理。
4. 建好后，左侧 **站点地图** → 填 `https://cantonlock.com/de/sitemap.xml`（只含德语 746 条网址的那份；主资源那边的 `sitemap.xml` 不用动）→ 提交。成功的样子是状态列显示「成功」。

这样德国属性里能单独看 /de/ 的曝光和点击，和主资源不冲突。

**② 请求收录七个语种的首页和目录页（14 条，每天 10 条上限，分两天）**

和之前一样：主资源 cantonlock.com → 顶部长条搜索框粘网址 → 回车 → 等 30 秒 → **请求编入索引**。

```
https://cantonlock.com/de/
https://cantonlock.com/de/products/
https://cantonlock.com/fr/
https://cantonlock.com/fr/products/
https://cantonlock.com/ja/
https://cantonlock.com/ja/products/
https://cantonlock.com/ko/
https://cantonlock.com/ko/products/
https://cantonlock.com/tr/
https://cantonlock.com/tr/products/
https://cantonlock.com/ru/
https://cantonlock.com/ru/products/
https://cantonlock.com/ar/
https://cantonlock.com/ar/products/
```

其余 5,000 多页 Google 会顺着 hreflang 和 sitemap 自己抓，不用一条条点。如果某条显示「网址不在 Google 中」并且按钮是灰的，说明还没抓到，跳过，明天再点。

---

## 现在要做的（2026-09-24）

上一屏（2026-09-22 的五件事）已经全部做完，移进了
`archive/2026-09-22-ga4-www-gsc-video-nginx.md`，**不要再照着做**。
每一件的实测结果写在那份存档的开头。

**现在剩 ①②⑥⑦。** ③④⑤ 已完成，09-28 移进 `archive/2026-09-28-runbook-3-4-5-done.md`。 09-23 的「服务器停止更新」已经修好，移进了 `archive/2026-09-24-server-deploy-v2.md`。

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

### ⑥ Cloudflare「Security Insights」6 条：1 条要你做，4 条点 Archive，1 条我已修（2026-09-25）

你 09-25 导出的那 6 条，逐条实测过：

| 那一条 | 怎么处理 | 为什么 |
|---|---|---|
| **Users without MFA**（Moderate） | **要你做**：Cloudflare 右上角头像 → My Profile → Authentication → 开两步验证（手机装 Google Authenticator 扫码） | 这个账号管着网站和邮箱的 DNS，密码泄露就能改 DNS。这一条最重要 |
| Unproxied CNAME mail.cantonlock.com（Moderate） | **不要改**，点那一行右边 … → **Archive** | 它指向网易企业邮箱（mailhz.qiye.163.com）。Cloudflare 代理只转网页，不转 IMAP/SMTP；按它说的开橙色云，公司邮件客户端就连不上了 |
| Security.txt not configured | 已修：/.well-known/security.txt 已上线（联系邮箱 tec@），**现在就可以点 Archive** | 它是给发现漏洞的人找联系方式的标准文件；到期前一个月测试会提醒续期 |
| AI Labyrinth（cantonlock.com） | 点 **Archive**，不要开 | 我们的策略是欢迎 AI 抓取、被 AI 引用（本周 OpenAI 抓了 2,517 次）。它只对不守规矩的爬虫起作用，但会往页面里塞 AI 生成的假链接，没必要冒这个险 |
| AI Labyrinth（rayen.cn） | 雷茵站的事，问雷茵那边 | — |
| No Turnstile enabled | 点 **Archive**，以后询盘垃圾多了再说 | Turnstile 是表单人机验证，要改询盘表单和后端；现在没有垃圾询盘的问题 |

**Signals 页那 535 条「违规」不用管**：全是 Meta 的爬虫在抓 `/pt/…/__next._tree.txt` 这类网站内部数据文件，robots.txt 里我们写了不许抓，它不守。那些文件对 SEO 没有价值，也不影响网站。

### ⑦ Bing 站长工具：重新提交 sitemap —— 3 分钟，sitemap 已发布，现在就能做（2026-09-26）

**为什么**：你 09-26 导出的 Bing SEO 报告里，「Important pages missing in sitemaps」那 5 页（5 篇指南）其实**都在** sitemap 里；
「description missing」那 2 页是旧站的 index.php 网址，线上都在正确 301（aid=397 → X2，tid=23 → 产品目录），Bing 重新抓过就会消失。
真正的问题是 sitemap.xml 有 **14 MB**（七语种上线后 7,010 个网址，每个带 10 个语种互指），Bing 读不完。
现在改成：sitemap.xml 只放英文网址，每个语种各有一份 /es/sitemap.xml、/fr/sitemap.xml ……（都已写进 robots.txt）。

**步骤**：https://www.bing.com/webmasters → 选 cantonlock.com → 左侧 **Sitemaps** → 右上 **Submit sitemap** →
依次粘贴下面这些，每条点一次 Submit：

```
https://cantonlock.com/sitemap.xml
https://cantonlock.com/es/sitemap.xml
https://cantonlock.com/pt/sitemap.xml
https://cantonlock.com/fr/sitemap.xml
https://cantonlock.com/de/sitemap.xml
https://cantonlock.com/ja/sitemap.xml
https://cantonlock.com/ko/sitemap.xml
https://cantonlock.com/tr/sitemap.xml
https://cantonlock.com/ru/sitemap.xml
https://cantonlock.com/ar/sitemap.xml
```

**成功的样子**：列表里每条状态变成 Success，「URLs discovered」有数字。
然后回到 SEO 报告，点 **Scan now** 重新扫一次。
**Inbound links from high-quality domains**（第三条）不是网站代码能修的：要靠展会、行业目录、客户网站链回来，
docs/research/BACKLINK_DEEPLINKS.md 里有清单。

---

