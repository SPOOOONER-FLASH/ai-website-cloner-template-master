# Spooner 操作手册

**最后更新：2026-09-22 · 更新人：Claude**

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

## 现在要做的（2026-09-22）

上一屏（2026-09-17 的表单密钥和跳转规则）已经做完，移进了
`archive/2026-09-17-form-key-and-redirects.md`，**不要再照着做**。
实测结果写在那份存档的开头。

---

### ① Search Console 手动请求收录 —— 今天 10 条，明天 10 条

**为什么要手点**：20 篇新文章已经上线，sitemap 也有了，Bing 那边我已经用
IndexNow 推过（63 条 → 200 OK）。**Google 没有 IndexNow**，只能等它自己来爬，
或者在 Search Console 里逐条催。手点能把「几周」变成「一两天」。

**为什么分两天**：Search Console 的「请求编入索引」有每日配额，一天点太多后面
会点不动。而且只点英文版就够 —— 西语和葡语版通过 sitemap 里的 hreflang 关联，
Google 认了英文版就会顺着找到另外两种。

**怎么做**

1. 打开 https://search.google.com/search-console
2. 左上角确认选的是 **cantonlock.com**
3. 把下面第一条网址**粘贴到页面最顶部那个长条搜索框**（不是左边菜单），回车
4. 等它检测完（约 30 秒），页面会说「网址不在 Google 上」——这是正常的，新页面本来就不在
5. 点 **请求编入索引**
6. 等它转完圈说「已请求编入索引」，再换下一条

**今天这 10 条**

```
https://cantonlock.com/guides/euro-cylinder-size-chart-2026/
https://cantonlock.com/guides/backset-door-thickness-chart-2026/
https://cantonlock.com/guides/hinge-grades-and-count-2026/
https://cantonlock.com/guides/door-closer-power-size-2026/
https://cantonlock.com/guides/finish-code-reference-2026/
https://cantonlock.com/guides/strike-plates-and-keeps-2026/
https://cantonlock.com/guides/door-preparation-161-and-86-2026/
https://cantonlock.com/guides/spindle-sizes-and-length-2026/
https://cantonlock.com/guides/en-ansi-bhma-cross-reference-2026/
https://cantonlock.com/guides/glass-door-thickness-and-cutouts-2026/
```

**明天这 10 条**

```
https://cantonlock.com/guides/fire-door-hardware-what-must-be-rated-2026/
https://cantonlock.com/guides/corrosion-resistance-en-1670-2026/
https://cantonlock.com/guides/cycle-testing-durability-grades-2026/
https://cantonlock.com/guides/lever-return-and-en-1906-2026/
https://cantonlock.com/guides/key-blanks-and-restricted-profiles-2026/
https://cantonlock.com/guides/door-closer-mounting-positions-2026/
https://cantonlock.com/guides/door-hardware-hs-codes-2026/
https://cantonlock.com/guides/moq-tooling-and-lead-time-2026/
https://cantonlock.com/guides/container-loading-door-hardware-2026/
https://cantonlock.com/guides/samples-and-incoming-inspection-2026/
```

**排序不是随便排的**：今天这 10 条是买家真的会一个字一个字敲进搜索框的查表题
（欧标锁芯尺寸表、距心对照、一扇门要几个铰链、闭门器力量等级……），
明天那 10 条偏专业判断，搜的人少一些但成交意图更强。

**遇到这两种情况**

- 说「已超出配额」→ 今天就停，明天接着点。不是出错。
- 说「网址不在 Google 上，且存在编入索引问题」→ **截图发我**，先别自己动。

---

### ② 61 个视频不被 Google 收录 —— 我需要看一眼服务器那个定时脚本（2026-09-22）

**这条要你去宝塔上复制一段文字发我，不改任何东西，零风险。**

**症状**：Search Console 说 61 个视频「视频不在观看页面上」，从 9/17 开始验证，9/21 失败。

**我已经排除的**（我这边查的，你不用管）：

| 可能原因 | 查的结果 |
|---|---|
| robots.txt 挡住了 | 没有，`/videos/` 放行 |
| 视频文件不存在 | 195 个全在 |
| 页面上没有播放器 | 有，静态 HTML 里就带 `<video>` 和 `<source>` |
| 结构化数据缺字段 | 六个字段齐全，缩略图文件也在 |
| 文件太大 | 排除。受影响的平均 2.9 MB，没受影响的 2.8 MB |
| 服务器不支持分段下载 | 支持，`Accept-Ranges: bytes`、`Content-Type: video/mp4` 都对 |

**剩下唯一的异常，我实测到了**：同一个视频，**内容一个字节都没变**（线上大小和仓库完全一致，git 里最后改动是 9/21 凌晨 1 点），但线上的「最后修改时间」是 **9/22 早上 6 点 21 分**。我一次查四个视频，时间全落在 **06:21:11–06:21:14** 三秒内 —— 整个目录被**整批重写**过。

nginx 用「最后修改时间」生成 ETag（给搜索引擎看的版本号）。内容没变、时间变了，ETag 就跟着变。**在 Google 眼里这些视频每天"变"好几次**，一个一直在变的视频，收录状态就定不下来。

我不能说这一定是原因，只能说排除完其他六项后它是唯一剩下的异常。要确认得先知道服务器在跑什么。

**你已经给了我 crontab，答案在这一行**

```
*/5 * * * * flock -n /tmp/cantonlock-deploy.lock /usr/local/bin/cantonlock-deploy.sh
```

所以部署脚本是 **`/usr/local/bin/cantonlock-deploy.sh`**。现在只差它的内容。

**请你在终端贴这一条，把输出发我**（只是把文件内容显示出来，不改任何东西）：

```bash
cat /usr/local/bin/cantonlock-deploy.sh
```

**成功的样子**：屏幕上出现几行到几十行脚本，里面大概率有 `git pull`，可能还有
`cp`、`rsync`、`npm` 之类的词。全选复制发我即可。

**顺便也贴这一条**，它会告诉我最近几次部署实际做了什么：

```bash
tail -30 /var/log/cantonlock-deploy.log
```

**我要看什么**：如果脚本里是 `cp -r` 这种整目录复制，那每复制一次，所有文件的
时间戳都会刷新一遍，即使内容一个字节都没变 —— 那就和我实测到的现象对上了。
改成保留时间戳的写法（`cp -a` 或 `rsync -a`），一行的事。

---

### 关于 `deploy/install-nginx-redirects.sh` 跑不起来（2026-09-22）

你截图里的报错：

```
[root@VM-0-5-opencloudos ~]# deploy/install-nginx-redirects.sh
bash: deploy/install-nginx-redirects.sh: No such file or directory
```

**不是脚本的问题，是路径的问题。** `deploy/install-nginx-redirects.sh` 是**相对路径** ——
它的意思是「从我现在所在的目录往下找 deploy 文件夹」。你当时在 `~`（也就是
`/root`），那底下没有 `deploy` 文件夹，所以找不到。

**正确的跑法是两步**：先进到仓库目录，再跑。

```bash
cd /www/wwwroot/cantonlock.com && sudo bash deploy/install-nginx-redirects.sh
```

**如果这条也报 "No such file or directory"**，说明仓库不在我猜的这个位置。那就先用
这条找出来，把输出发我：

```bash
find /www -maxdepth 4 -name "install-nginx-redirects.sh" 2>/dev/null
```

它会打印一行完整路径，比如 `/www/wwwroot/某个目录/deploy/install-nginx-redirects.sh`。
把 `/deploy/install-nginx-redirects.sh` 之前的部分拿去替换上面 `cd` 后面的路径就行。

**成功的样子**：脚本会自己打印一串带 `→` 的进度行，最后是一行绿色的成功提示。
它自己会 `nginx -t` 测试、reload、验证，失败会自动回滚 —— 所以跑它是安全的。

**看到任何红色的 FAIL 就停下，截图发我，不要重跑。**

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

## 我刚刚替你查过的（2026-09-17 实测，不用你确认）

| 项目 | 状态 |
|---|---|
| `www.cantonlock.com` → 裸域 301 | ✅ 生效 |
| `index.php?lang=es` → `/es/` | ✅ **生效** —— 旧手册第 1b 节那个「只做一次」的手工改动，你已经做完了 |
| 英文旧类目跳转（如 `/products/door-hinges/`） | ✅ 生效 |
| 西语/葡语旧型号跳转、`/index.asp` | ❌ **要跑上面的 ②** |
| 今天的葡语构建是否已上线 | ✅ 已在服务器上（绕开缓存实测，`/pt/glossary/` 与 `/pt/` 都是新内容） |
| 带哈希的 JS/CSS 缓存一年 | ✅ 生效 |
| 联系表单能不能发出邮件 | ❌ **不能，从上线起就不能** —— 见上面的 ① |

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

* Google Search Console 手动提交 —— **目前不需要提交任何页面**。
  覆盖率报告里最大的三类（重复网页 462、已抓取未编入 421、已发现未编入 415）
  手动提交都不起作用，原因写在 `OPEN-ITEMS.md` 第三之二节。
* Bing / Clarity 设置 —— 已配置完成。
* Clarity 里怎么分辨爬虫和真买家、要不要封爬虫 —— 2026-09-10 的结论在存档里。
* 两台机器怎么同步、我在哪台机器上写文件 —— 存档第 7、8 节。
* 雷茵中文站预览域名、还缺的素材 —— 存档，以及 `OPEN-ITEMS.md`。
* skills 的安装与更新 —— `docs/collaboration/SKILLS.md`。

---

## 还欠我的东西（我会一直提醒）

完整清单在 `docs/collaboration/OPEN-ITEMS.md`。当前最挡路的四件（2026-09-17 实测数字）：

1. **六个订单代码的含义** —— 表面码 `N`，功能码 `DK` `KT` `IK` `PT` `BS`。
   `/finishes` 页面上它们现在印着「未确认」。每个一句话就能补上。
2. **五个型号的板尺寸** —— 307 / 311 / 305 / 035 的 **Plate size** 与
   **Plate thickness**（308 已经有 Plate size，还缺厚度）。
   这几个型号占了九十天询盘的大头，数一给，尺寸图和规格表当天就能出。
3. **308-S 与 308-D** —— 是同一个锁体配不同端盒，还是两套不同的东西。
   现在两条记录规格一样，站上不敢替工厂下结论。
4. **执手 / 拉手的固定孔径与孔中心距** —— **519 个已发布型号里只有 6 条有这个数**。
   开孔图生成器早就建好了，就卡在这一个字段上；买家换装时第一个要对的也是它。
