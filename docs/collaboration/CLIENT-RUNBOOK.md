# Spooner 操作手册

**最后更新：2026-09-28 · 更新人：Claude（Hyde 文案）：新增公司名、LinkedIn、AI 可见度摸底、GSC 未收录导出四件**

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

## 现在要做的：等我通知后，在 Search Console 提交 9 条 RSS（2026-09-28）

### 先说清楚一件事：**现在还不能做，要等我说「已部署」**

你待办里写的是提交 `/es/feed.xml` 和 `/pt/feed.xml`。我今天实测过线上：

| 网址 | 现在的状态 |
|---|---|
| `https://cantonlock.com/feed.xml`（英文） | **200，正常，82 篇文章** |
| `https://cantonlock.com/es/feed.xml` | **404，不存在** |
| `https://cantonlock.com/pt/feed.xml` | **404，不存在** |

西语和葡语那两条**当时根本没做出来**。今天我把十个语种的 RSS 都做好了，
但**要等下一次发布上线之后才真的存在**。

**所以：在我明确说「RSS 已部署」之前，先不要去提交。** 现在提交只会得到一条失败记录，
以后还要去删。

---

### 等我说「已部署」之后，这样做

#### 第 1 步 · 先自己确认一下网址是通的（30 秒，不用登录）

浏览器地址栏直接输入：

```
https://cantonlock.com/es/feed.xml
```

- **看到一大片密密麻麻的文字/代码** → 正常，继续下一步。（浏览器显示 RSS 就是这样，不好看是对的。）
- **看到「找不到网页」「404」** → **停在这里，截图发我**，别往下做。

同样再看一眼 `https://cantonlock.com/pt/feed.xml`。两条都正常再继续。

#### 第 2 步 · 打开 Search Console 的「站点地图」

1. 打开 https://search.google.com/search-console
2. **左上角**有个下拉框，是选网站的。先确认选的是 **cantonlock.com**。
3. 左边一列菜单里找 **「索引」** 这一组，点它下面的 **「站点地图」**（英文界面是 Sitemaps）。

#### 第 3 步 · 一条一条加进去

页面上方有一个框，标题是 **「添加新的站点地图」**（Add a new sitemap）。
框里已经灰字写着 `https://cantonlock.com/`，**你只需要填后面那一截**。

在框里输入下面第一条，点 **「提交」**：

```
es/feed.xml
```

⚠️ **只填 `es/feed.xml`，不要填完整网址。** 前面的 `https://cantonlock.com/` 是它自带的，
你再写一遍会变成重复的一长串，提交会失败。

提交完一条，框会清空，接着填下一条，一共 9 条：

```
es/feed.xml
pt/feed.xml
fr/feed.xml
de/feed.xml
ja/feed.xml
ko/feed.xml
tr/feed.xml
ru/feed.xml
ar/feed.xml
```

（英文那条 `feed.xml` 之前已经在 robots.txt 里，Google 自己会找到，不用你提交；
你要是想手动加一条 `feed.xml` 也没坏处。）

#### 第 4 步 · 看结果

提交完往下看，有一张表叫 **「已提交的站点地图」**。

- **状态写「成功」** → 这条就完成了。
- **状态写「无法获取」/「有错误」** → 先**等 1 天再看一次**（Google 有时要隔一晚才去抓）。
  一天后还是错的，**截图整张表发我**。
- **「已发现的网址数」显示 0 或者空着** → 正常，这一栏有时要等几天才有数字，不用管。

**成功长什么样**：9 行，状态都是「成功」，类型写「RSS」。

---

### 常见问题

**问：左上角的下拉框里有好几个，像 `cantonlock.com` 和 `https://cantonlock.com/de/`，选哪个？**

选 **cantonlock.com**（没有后缀那个）就行，9 条全提交在这一个里面。

如果你之前给某个语种单独建过资源（比如 `https://cantonlock.com/de/`），那种资源**只认
它自己前缀下面的文件**——在 `/de/` 那个资源里，你只能提交 `feed.xml`（它会自动理解成
`/de/feed.xml`）。这属于锦上添花，不做也不影响。

**问：提交后多久有效果？**

Google 通常几天内开始抓。RSS 的作用是让它**更快发现新文章**，不是让排名变好，所以不用盯着看。

**问：我不小心填了完整网址、提交失败了怎么办？**

在「已提交的站点地图」那张表里找到那一行，**点最右边的三个点 → 删除**，然后按第 3 步重填。

---

## 已经不用做了（2026-09-28 复查）



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

## 现在要做的（2026-09-28，文案会话）：四件，都不碰服务器

### ① 定公司英文全称 —— 回我一句话就行

现在外面流通着三个英文名，AI 和买家会以为是三家公司：

| 在哪里 | 写的是 |
|---|---|
| 官网（公司页、FAQ、产品描述、结构化数据） | Canton Hyland Hardware (Group) Co., Ltd. |
| BAU 2027 展位登记 | Canton Hyland lock Co.,Ltd |
| 付给展会的银行汇款 | Canton Hyland Hardware & Locks Co., Ltd. |

**你要做的**：看一下营业执照上的英文名，回我“官网用 ×××”。我把官网全部改成这一个；展会那边的更正邮件 BAU 会话 09-25 已起草，用同一个名字发。
**不确定就别猜**：执照上没有英文名的话，告诉我中文全称，我们再定。

### ② 建 LinkedIn 公司主页，发 3 篇帖 —— 约 30 分钟

文章结论：B2B 买家和 AI 搜索都大量读 LinkedIn，而且看重“真人 + 公司”。我们现在没有公司主页，官网的结构化数据里也就没有这条身份证明。

1. 用你自己的 LinkedIn 账号登录 https://www.linkedin.com → 右上角 **For Business（业务）** → **Create a Company Page（创建公司主页）** → 选 **Company**。
2. 名称、网址、行业、规模、简介：全部照抄 `docs/copy/linkedin-starter.md` 的「公司主页」一节（桌面 `hyde\GEO-学习与进展-2026-09-28.docx` 里也有）。Logo 用官网那张。
3. **成功的样子**：主页地址像 `https://www.linkedin.com/company/xxxx/`。**把这个地址发给我**，工程会话会把它加进官网的结构化数据。
4. 发帖：先发第 1、2 篇（锁芯计算器、EN 1125 vs EN 179），用公司主页发，也可以用你个人账号转发。**第 3 篇（BAU）等老板确认带哪几款产品之后再发**。
5. 看不到「创建公司主页」：LinkedIn 要求账号用了一段时间、有真实姓名和一个联系人，截图发我。

### ③ AI 可见度第一次摸底 —— 约 2 小时，可以分几天

题库和规则在 `docs/geo/README.md`（桌面文档附录二）。45 道题，除最后 3 道品牌题外都不含我们的名字。空白记录表用 `npm run geo:baseline` 打印，工程会话可以替你打。

1. 在 ChatGPT、Gemini、Perplexity 各问一遍，Google 搜同样的句子看顶部的 AI 概览。**一字不改地复制粘贴**。
2. 每题每个平台问 3 次，按记录表填：有没有提到我们、排第几、怎么描述我们、有没有引用 cantonlock.com 的网址。ChatGPT 用临时聊天；其他平台用未登录或没有历史的会话。
3. 做不完没关系，先做 mfr-01 到 mfr-08（找制造商那组）也有用。填好的表发我，放进 `docs/geo/results/`。
4. **这是基线**：以后每季度同一套题再问一次，看数字变化。第一次多半是 0，这本身就是结论，不是失败。

### ④ Search Console 导出两张“没收录”清单 —— 5 分钟

1. 打开 https://search.google.com/search-console → 左上角选 **cantonlock.com** → 左侧 **网页**（Pages）。
2. 往下拉到「为什么网页未编入索引」，点 **已抓取 - 尚未编入索引**（Crawled – currently not indexed）→ 右上角 **导出** → **下载 CSV**。
3. 回到上一页，再点 **已发现 - 尚未编入索引**（Discovered – currently not indexed）→ 同样导出。
4. 两个文件发我。前一张说明 Google 看过但觉得不值得收，要改内容；后一张是还没来抓，要加内链。**不要**对着这些网址一条条点“请求编入索引”，没用。
5. 列表里没有这两项：说明目前没有这类问题，截个图告诉我就行。

### 还在等你的（BAU 专栏，不急但上线前要有）

- 老板确认 BAU 带哪几款：现在页面上是 307、311、305、LC14、564 和主匙系统。
- 预约邮件发到 tec@cantonlock.com，谁负责回复客户确认时间。

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

完整清单在 `docs/collaboration/OPEN-ITEMS.md`。当前最挡路的三件（2026-09-17 实测数字；308-S/308-D 甲方 09-28 已答：单的没有锁体，双的有锁体）：

1. **五个订单代码的含义** —— 表面码 `N`，功能码 `KT` `IK` `PT` `BS`。
   （`DK` 你 2026-09-22 已确认 = 锁头双开，已上线。）
   `/finishes` 页面上其余几个仍印着「未确认」。每个一句话就能补上。
2. **五个型号的板尺寸** —— 307 / 311 / 305 / 035 的 **Plate size** 与
   **Plate thickness**（308 已经有 Plate size，还缺厚度）。
   这几个型号占了九十天询盘的大头，数一给，尺寸图和规格表当天就能出。
3. **执手 / 拉手的固定孔径与孔中心距** —— **519 个已发布型号里只有 6 条有这个数**。
   开孔图生成器早就建好了，就卡在这一个字段上；买家换装时第一个要对的也是它。
