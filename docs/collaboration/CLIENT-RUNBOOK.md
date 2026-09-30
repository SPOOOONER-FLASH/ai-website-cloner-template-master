# Spooner 操作手册

**最后更新：2026-09-30 · 更新人：Claude · 待办：静态资源缓存头（一条命令，见第一节）；Bing 重新检查；公司名、LinkedIn 公司主页、AI 可见度摸底、GSC 未收录导出四件；AI 来源追踪三步。RSS 十条已上线验证完毕，无需动作**

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

## 现在要做的（2026-09-30）：给静态资源加缓存头 —— 服务器上一条命令，2 分钟

你 09-29 发我的 PageSpeed 报告里，「Use efficient cache lifetimes」记了 171 KB（桌面）/ 130 KB
（手机）。原因不在网页代码：宝塔的 nginx 没给 JS、图片、字体发 `Cache-Control`，
Cloudflare 就补了个 4 小时。JS 文件名都带哈希，可以让浏览器存一年。

**我这边的云端机器连不上 cantonlock.com（被代理拦了），所以线上现状我没能亲自 curl。第 1 步先看一眼再动手。**

### 第 1 步 · 看现状（不改任何东西）

服务器终端里粘贴：

```bash
curl -sI https://cantonlock.com/_next/static/chunks/turbopack-0r7jr9j3wpvhb.js | grep -i cache-control
```

- 看到 `max-age=31536000, immutable` → **已经装好了，这一节不用做**，告诉我一声。
- 看到 `max-age=14400` 或什么都没打出来 → 做第 2 步。
- 文件名 404 了也没关系（发布后哈希会变），换首页任何一个 `/_next/static/chunks/….js` 都行。

### 第 2 步 · 装（一条命令）

```bash
cd /www/wwwroot/cantonlock.com && git pull && \
cp deploy/nginx/static-cache.conf /www/server/panel/vhost/nginx/extension/cantonlock.com/20-static-cache.conf && \
nginx -t && nginx -s reload && echo OK
```

- 最后一行打出 `OK` 就成了。
- 打出 `nginx: [emerg] …` 而没有 `OK`：**站没坏**（`nginx -t` 失败时不会 reload），把整段输出截图发我，
  然后 `rm /www/server/panel/vhost/nginx/extension/cantonlock.com/20-static-cache.conf` 把文件删掉即可。
- `git pull` 那里如果目录不对，站点根目录以宝塔「网站 → 根目录」为准。

### 第 3 步 · 验证

再跑一次第 1 步的 curl，应看到 `cache-control: public, max-age=31536000, immutable`。
然后 **purge** 一次 Cloudflare（旧的 4 小时头还在边缘缓存里）。

---

## 现在要做的：Bing 那两条「High」报错 —— 已修好，只差让 Bing 重新检查（2026-09-28）

你截图里的两条，我今天对着线上逐条实测过，**网站这边都已经是对的**，Bing 显示的是它上一次扫描时的旧结果：

| Bing 报的 | 我实测线上（2026-09-28） | 结论 |
|---|---|---|
| 5 篇指南「不在 sitemap 里」（strike-plates、spindle-sizes、door-preparation，西语 chrome-finish、hinge-grades） | 5 个网址都返回 **200**；英文 3 篇在 `/sitemap.xml` 里，西语 2 篇在 `/es/sitemap.xml` 里 | 09-26 以前所有语种挤在一个 14 MB 的 sitemap 里，Bing 读到一半就停了——正是这 5 篇的成因。09-26 已拆成每个语种一个文件，已上线 |
| 2 个页面「head 里没有 description」（`index.php?...tid=23&lang=cn`、`index.php?...aid=397`） | 两个都是旧 PHP 站网址，现在返回 **301 跳转**：tid=23 → `/products/`，aid=397 → X2 逃生装置外把手产品页（该页有 description） | 跳走的网址本身不需要 description；Bing 抓的是跳转生效以前的旧页面 |

### 第 1 步 · 在 Bing 里把十个 sitemap 都交上去（2 分钟）

1. 打开 https://www.bing.com/webmasters ，选 cantonlock.com。
2. 左侧点 **Sitemaps（站点地图）**。
3. 看列表里有没有下面这些。**没有的，逐条点右上角「Submit sitemap / 提交站点地图」，粘贴，确定**：

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

   **成功的样子**：每一条的状态变成「Success / 成功」，「URLs discovered」有数字（英文约 880，其余每个约 680）。
   **状态是「Couldn't fetch / 无法获取」**：截图发我，先不要删。
   已经在列表里的，点它右边的 **Resubmit（重新提交）**。

> 下一次发布上线后，还会多一个 `https://cantonlock.com/sitemap-index.xml`，一个网址就包含上面十个。
> 我说「已部署」后，你可以只交这一个（交了它，上面十个留着也没关系，不会重复计算）。

### 第 2 步 · 让 Bing 重新扫描（1 分钟）

1. 左侧点 **Recommendations（建议）**，打开「Important pages missing in sitemaps」那条。
2. 如果页面上有 **Recheck / Validate / 重新检查** 按钮，点它；没有按钮也不用管，Bing 下次扫描（通常几天内）会自己更新。
3. 对「The description is missing in the head section」那条做同样的事。

**成功的样子**：几天后这两条从列表里消失，或「Pages with error」变成 0。
**一周后还在**：把那一条的截图（带网址列表）发我，我再逐个实测。

---

## 现在要做的（2026-09-28 新增）：看清询盘是不是从 ChatGPT 来的 —— 三步，约 20 分钟，一次性

**前提**：等 johns 电脑下一次发布之后再做（本条改动已合并进 main）。发布前做也不会坏事，只是没有数据。
**为什么**：从这次发布起，每封询盘邮件会多一行 `first_touch`，写着这个买家第一次是从哪来的（`chatgpt`、`perplexity`、`google`、`direct` ……）。下面三步让 GA4 和 Cloudflare 也跟得上。详细理由见 `docs/collaboration/2026-09-28-quickcreator-seo-geo-report.md`。

**第一步：GA4 登记 `first_touch`（5 分钟）**
1. 打开 https://analytics.google.com → 确认媒体资源 **cantonlock**。
2. 左下角齿轮 **管理** → **数据显示** → **自定义定义** → **创建自定义维度**。
3. 维度名称填 **首次来源**，范围选 **事件**，事件参数填 `first_touch`，保存。
- 成功的样子：列表里多一行「首次来源」。24–48 小时后，「询盘」事件（`generate_lead`）的报表里能按它分组。
- 看不到按钮：账号不是「编辑者」，截图发我。

**第二步：GA4 把 AI 流量单独成一行（10 分钟）**
1. 同一个 **管理** → **数据显示** → **渠道组** → **创建新渠道组**，名称 **含 AI 助手**。
2. 点 **添加新渠道**，渠道名 **AI assistants**，条件选「来源」→「与正则表达式匹配」，填：
   `chatgpt|openai|perplexity|gemini|copilot|claude|deepseek`
3. 保存后，把这个新渠道 **拖到「Referral」上面**（顺序决定归属，放在下面就会被 Referral 先吃掉），再保存渠道组。
- 成功的样子：报告 → 流量获取 → 把主维度换成「含 AI 助手」渠道组，能看到 AI assistants 一行（有流量才会出现）。

**第三步：Cloudflare 查 AI 搜索爬虫有没有被拦（5 分钟，只看不改）**
1. 登录 Cloudflare → 选 **cantonlock.com** → 左栏 **Security** → **Events**（安全事件）。
2. 右上角时间选「过去 7 天」，加筛选条件 **User agent** 包含，依次填：`OAI-SearchBot`、`Claude-SearchBot`、`PerplexityBot`、`GPTBot`。
3. 看「操作」一列：
   - 全是空的，或只有「Skip / Allow」：正常，什么都不用做。
   - 出现 **Block**、**Managed Challenge** 或 **JS Challenge**：**停在这里，截图发我**，不要自己改防火墙规则。
- 为什么要查：09-25 实测过 Bot Fight Mode 会拦谷歌自己的检测工具。robots.txt 允许了它们，但 Cloudflare 在 robots.txt 之前，拦下来 robots 写什么都没用。

> 之前第一屏的七件甲方 09-28 已确认做完（Codex 续做钩子审核；Search Console 建 /de/ 资源、请求收录七语种 14 条、指南 20 条；GA4 自定义维度；Cloudflare 两步验证与 Security Insights；Bing 提交 10 个 sitemap）已移进
`archive/2026-09-28-runbook-client-confirmed.md`，**不要再照着做**。

我能从外面测到的前提都在（2026-09-28 实测）：security.txt 200；robots.txt 列出 10 份 sitemap；/sitemap.xml 1.55 MB；/de/sitemap.xml 200、683 个网址；/de/ /de/products/ /fr/ /ar/products/ 都是 200；页面上 GA4（G-RBTE7KF82P）在。
后台里的动作（Search Console、GA4、Cloudflare、Bing）只有你看得到，我测不了；哪一项后台报错了，截图发我。

---

## 现在要做的（2026-09-28，文案会话）：三件，都不碰服务器

> ① 公司英文全称你 09-28 已定：**Canton Hyland Hardware & Building Material Co., Ltd.**，官网已全部改好。BAU 展位登记名的更正邮件，按这个名字发（BAU 会话 09-25 起草的那封，把名字换成这个）。

### ② 建 LinkedIn 公司主页，发 3 篇帖 —— 约 30 分钟

文章结论：B2B 买家和 AI 搜索都大量读 LinkedIn，而且看重“真人 + 公司”。我们现在没有公司主页，官网的结构化数据里也就没有这条身份证明。

1. 用你自己的 LinkedIn 账号登录 https://www.linkedin.com → 右上角 **For Business（业务）** → **Create a Company Page（创建公司主页）** → 选 **Company**。
2. 名称、网址、行业、规模、简介：全部照抄 `docs/copy/linkedin-starter.md` 的「公司主页」一节（桌面 `hyde\GEO-学习与进展-2026-09-28.docx` 里也有）。Logo 用官网那张。
3. **成功的样子**：主页地址像 `https://www.linkedin.com/company/xxxx/`。**把这个地址发给我**，工程会话会把它加进官网的结构化数据。
4. 发帖：先发第 1、2 篇（锁芯计算器、EN 1125 vs EN 179），用公司主页发，也可以用你个人账号转发。**第 3 篇（BAU）等老板确认带哪几款产品之后再发**。
5. 看不到「创建公司主页」：LinkedIn 要求账号用了一段时间、有真实姓名和一个联系人，截图发我。

### ③ AI 可见度第一次摸底 —— 重做一次，这回一题一问（约 2 小时，可分几天）

**你 09-28 发来的四份（kimi / grok / gemini / gpt）我读完了**，结论在 `docs/geo/results/2026-09-28-first-pass-not-baseline.md`。它们是把整份题库一次交给 AI、请它写成问答稿，AI 事先知道了我们的名字，所以“提到我们”不算数，**不能当基线**。但有用：读过官网的 GPT、Kimi 引用我们的具体事实几乎全对；几条错话（“满足 ANSI 和 CE”、推杠 660–1200 mm、“广州集团”）都不是官网来的；还顺带拿到一张 AI 眼里的竞争对手名单。

**正式摸底这样做**：

1. **一题开一个新对话**。ChatGPT 点左上角「临时聊天」；Gemini、Perplexity 用没登录的浏览器窗口（无痕窗口）。
2. **只粘那一句问题**，前后不加任何话，不提我们，不说“帮我写问答”。题目在 `docs/geo/baseline-queries.json`（桌面 GEO 文档附录二有表），**先做 mfr-01 到 mfr-08、es-01、es-02、pt-01 这 11 题**，最后再问 brand-01 到 brand-03。
3. 每题记三件事：有没有提到 Canton Hyland 或 HYDE、排第几、有没有附 cantonlock.com 的链接。**截图最省事**，每题一张，按题号命名发我，我来填表。
4. 同一题同一个平台问 3 次（AI 每次回答会变）。时间不够就先每题 1 次。
5. 第一次多半是 0，这本身就是结论。

### ④ Search Console 导出两张“没收录”清单 —— 5 分钟（在「网页」报告里，不是「站点地图」）

1. 打开 https://search.google.com/search-console → 左上角选 **cantonlock.com** → 左侧菜单「**编入索引**」下面的 **网页**（英文界面叫 Indexing → **Pages**）。**不是**「站点地图」（Sitemaps）——站点地图报告只告诉你提交了多少网址，不告诉你哪些没收录、为什么。
2. 往下拉到「为什么网页未编入索引」，点 **已抓取 - 尚未编入索引**（Crawled – currently not indexed）→ 右上角 **导出** → **下载 CSV**。
3. 回到上一页，再点 **已发现 - 尚未编入索引**（Discovered – currently not indexed）→ 同样导出。
4. 两个文件发我。前一张说明 Google 看过但觉得不值得收，要改内容；后一张是还没来抓，要加内链。**不要**对着这些网址一条条点“请求编入索引”，没用。
5. 列表里没有这两项：说明目前没有这类问题，截个图告诉我就行。

### 还在等你的（BAU 专栏，不急但上线前要有）

- 老板确认 BAU 带哪几款：现在页面上是 307、311、305、LC14、564 和主匙系统。
- 预约邮件发到 tec@cantonlock.com，谁负责回复客户确认时间。

---

## 不用做了：十条 RSS 已上线并验证（2026-09-28）

你说 Search Console 已经填完了。我从站外实测过，**十条 RSS 全部在线**，所以你提交的那几条会正常通过。

| 我测了什么 | 结果 |
|---|---|
| 十条 feed 是否正常（HTTP 200） | 十条全部 200 |
| 每条里有多少篇文章 | 各 82 篇 |
| 每篇有没有带大图（Discover 的大卡靠它） | 82/82 都有 |
| 每条是否声明自己而不是英文那条 | 十条全部正确 |
| 每条第一篇文章的链接是不是本语种 | 十条全部正确 |

这张表不是我手打的，是 `npm run seo:feeds` 跑出来的，随时可以重跑。所以你读到的是当天的数字，
不是上个月的 —— 上一版这里写着「/es/feed.xml 是 404，先别提交」，那句话在上线之后就变成了
**一句叫你别做已经能做的事的废话**，这次换成命令就不会再发生。

### 只有一种情况要你动手

Search Console 的「已提交的站点地图」表里，某一行状态是 **「无法获取」** 或 **「有错误」**：

- **先等一天再看一次。** Google 常常隔一晚才去抓；你提交得比上线早的那几条更是如此。
- 一天后还是错的 → **截图整张表发我**，先不要自己删了重填。

两件不用管的事：

- **「已发现的网址数」是 0 或空白** → 正常，这一栏要等几天才有数字。
- **状态全是「成功」** → 这件事就结束了，不用再看。

（提交时那个坑 ——「输入框里只填 `es/feed.xml` 这一截，不要填完整网址」—— 和当时的实测记录都在
`archive/2026-09-28-runbook-rss-search-console.md`，只当记录。）

---

## 只有这两件是常规动作

| 什么时候 | 做什么 |
|---|---|
| 我说「已部署，记得 purge」 | 只 **purge** |
| 我说「有新的跳转规则」 | 只 **purge**（规则 5 分钟内自动装上） |
| 其他任何时候 | **什么都不用做** |

服务器每五分钟自己拉一次代码，页面内容（产品、文章、翻译）**不需要你动手**。
跳转规则也由这一轮自动装（2026-09-25 起）。

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

完整清单在 `docs/collaboration/OPEN-ITEMS.md`。当前挡路的五件（前三件是 2026-09-17 实测数字；308-S/308-D 甲方 09-28 已答：单的没有锁体，双的有锁体）。每一件都卡着一样已经建好的东西：

1. **五个订单代码的含义** —— 表面码 `N`，功能码 `KT` `IK` `PT` `BS`。
   （`DK` 你 2026-09-22 已确认 = 锁头双开，已上线。）
   `/finishes` 页面上其余几个仍印着「未确认」。每个一句话就能补上。
2. **五个型号的板尺寸** —— 307 / 311 / 305 / 035 的 **Plate size** 与
   **Plate thickness**（308 已经有 Plate size，还缺厚度）。
   这几个型号占了九十天询盘的大头，数一给，尺寸图和规格表当天就能出。
3. **执手 / 拉手的固定孔径与孔中心距** —— **519 个已发布型号里只有 6 条有这个数**。
   开孔图生成器早就建好了，就卡在这一个字段上；买家换装时第一个要对的也是它。

4. **审稿人的真实姓名和职位** —— 技术指南如果有工厂工程师真正审过，作者行下面可以加一行
   「审稿：某某，某职位」，结构化数据里同时写上 `reviewedBy`。这对「专业性」加分很大。
   **名字和职位必须是真的，我们不编**，所以这一行到现在是空的；你给我一个名字，当天就能上。
5. **LinkedIn 公司主页的网址** —— 就是上面第 ② 件，做完把地址发我即可，这里不重复写步骤。
   补一句归属：你给的 `linkedin.com/in/leiboliu` 是**个人**主页，已经挂在作者页的人头和履历
   旁边、也写进了作者的结构化数据（2026-09-28 实测在线），那一处不用再动。页脚社媒和**公司**
   的结构化数据要的是 `linkedin.com/company/…`；拿个人主页去当公司身份是假声明，所以那边先空着。
