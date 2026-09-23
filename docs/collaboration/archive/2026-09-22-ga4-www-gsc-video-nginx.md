# 存档：2026-09-22 的「现在要做的」—— 已全部做完或已被取代

> **这是记录，不要照着做。** 2026-09-23 由 Claude 移出 CLIENT-RUNBOOK.md。
>
> | 原节 | 结果（2026-09-23 实测或已由你确认） |
> |---|---|
> | ① GA4 关键事件 | ✅ 你已把 `generate_lead` 与 `form_start` 标为关键事件 |
> | ② www 与裸域合并 | ✅ `www.cantonlock.com` → 裸域 301 |
> | ③ Search Console 前 20 条 | ✅ 你 2026-09-23 确认已全部录入；剩下 20 条见新手册 ① |
> | ④ 贴服务器部署脚本 | ✅ 你已贴出。根因找到并修好（`ea954f22575`）：旧脚本 `chown -R` 让每次发布把 16,000 个文件全部重写。**但修好的脚本还没装到服务器上** —— 见新手册 ② |
> | nginx 跳转脚本「跑不起来」 | ✅ 跳转已生效，2026-09-23 实测：`/products/door-hinges` 301、`index.php?aid=1569` 301 到 LC5845、大写 `Index.php` 301、未知 id 301 到 `/products/`。9-22 那次输出停在 verifying… 是脚本验证段的 bug（已修），不是安装失败 |

---

## 现在要做的（2026-09-22）

上一屏（2026-09-17 的表单密钥和跳转规则）已经做完，移进了
`archive/2026-09-17-form-key-and-redirects.md`，**不要再照着做**。
实测结果写在那份存档的开头。

---

### ① 在 GA4 里把询盘标成「关键事件」——五分钟，这是目前最值钱的五分钟（2026-09-22）

**为什么是第一件事**：两个月的数据复盘里，GA4 每一张报表的「关键事件数」都是 **0**。
也就是说我们能看到有多少人来、看了多久，**但看不到有几个人发了询盘**。

「自然搜索和 ChatGPT 哪个更值钱」这种问题，现在只能用「停留时间」这种替代指标回答。
那是猜，不是量。

**我已经做完的部分**：网站以前根本不发这个信号。表单是用后台静默提交的，浏览器不跳转，
所以 GA4 从来没看见过「提交成功」这件事。我已经改好了代码，现在每次询盘发送成功，
网站会发出一个叫 **`generate_lead`** 的事件。

**剩下的这一步只能你点**，因为它在 GA4 后台不在代码里。

**怎么做**

1. 打开 https://analytics.google.com
2. 左下角点 **管理**（齿轮图标）
3. 中间那栏找到 **数据显示** → 点 **关键事件**（旧版叫「转化」）
4. 右上角点 **新建关键事件**
5. 事件名称填：

```
generate_lead
```

6. 点 **保存**

**成功的样子**：列表里出现一行 `generate_lead`，右边的开关是打开的。

**看不到这个事件怎么办**：新事件要网站先发生过一次才会出现在别处的列表里，
但 **第 4 步是手动新建，不需要等**，直接填名字就行。

**什么时候能看到数字**：下一次有人发询盘之后，最长 24 小时。届时「关键事件数」
那一列就不再是 0，我们第一次能回答「哪个渠道真的带来生意」。

**顺带建议**：同一个页面上也把 `form_start` 标成关键事件（重复第 4–6 步，名字填
`form_start`）。它衡量的是「有多少人开始填但没发出去」——过去 30 天有 **26 次开始、
11 个人**，而我们不知道他们后来怎么了。

---

### ② 把 www 和不带 www 合并成一个网址（2026-09-22）

**问题**：我们的首页现在在 Google 眼里是**两个不同的页面**。

| 网址 | 点击 | 展示 |
|---|---|---|
| `https://www.cantonlock.com/` | 31 | 206 |
| `https://cantonlock.com/` | 19 | 101 |

两条加起来 50 次点击、307 次展示。**如果它们是同一个网址，排名会比现在任何一条都高** ——
现在等于把同一份努力劈成了两半。

这不用写任何新内容，只是一次配置，而且它作用在**已经有的 1,520 次展示**上。

**怎么做（Cloudflare 里点，两分钟）**

1. 登录 Cloudflare，进 **cantonlock.com** 这个域
2. 左边菜单点 **规则** → **重定向规则**（Redirect Rules）
3. 点 **创建规则**
4. 规则名称随便填，比如 `www to apex`
5. **When incoming requests match** 选「自定义筛选表达式」，字段选 **Hostname**，
   运算符选 **equals**，值填：

```
www.cantonlock.com
```

6. **Then** 选 **动态**（Dynamic），表达式填：

```
concat("https://cantonlock.com", http.request.uri.path)
```

7. 状态码选 **301（永久重定向）**，把「保留查询字符串」打开
8. 点 **部署**

**成功的样子**：浏览器打开 `https://www.cantonlock.com/products/`，地址栏自己变成
`https://cantonlock.com/products/`，页面正常显示。

**验证**：把这两条网址各打开一次，看地址栏有没有跳过去。如果没跳，截图发我。

**为什么选不带 www 的那个**：Search Console 里不带 www 的首页点击率 **18.81%**，
带 www 的是 15.05% —— 不带 www 的表现更好，而且我们全站的新页面链接都是不带 www 的。

**风险**：低，但这是一条会影响所有访客的规则。做完立刻自己点开首页确认能打开。
如果打不开，回到第 3 步把那条规则**暂停**（右边有开关），站点立刻恢复原状。

---



### ③ Search Console 手动请求收录 —— 今天 10 条，明天 10 条

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

### ④ 61 个视频不被 Google 收录 —— 我需要看一眼服务器那个定时脚本（2026-09-22）

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

