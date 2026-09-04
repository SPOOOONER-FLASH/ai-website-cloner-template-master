# Spooner 操作手册

> **这份文件只写「必须由你本人操作」的事。** 代理做不了的原因写在每一节开头 ——
> 不是偷懒，是权限或纪律上做不到。
>
> 每一步都写清楚：**去哪里、点什么、看到什么算成功、失败了怎么办。**
> 不确定就停下来问，不要猜着点。

---

## 目录

| # | 事情 | 多久做一次 | 大约耗时 |
|---|---|---|---|
| 1 | nginx reload（让 301 重定向生效） | 有新重定向时 | 2 分钟 |
| 1b | **改 index.php 跳转规则（2026-09-04 新增，只做一次）** | 一次性 | 5 分钟 |
| 1c | **⚠ 撤销上一版的 TLS 改动（我诊断错了）** | 一次性 | 2 分钟 |
| 2 | Cloudflare 全区 purge | 每次发布后 | 1 分钟 |
| 3 | Google Search Console 手动提交 | 有新页面时 | 每天 10 分钟 |
| 4 | Bing / Clarity 设置 | 一次性 | 5 分钟 |
| 5 | 装 / 更新 skills | 想更新时 | 3 分钟 |

---

## 1. nginx reload —— 让 301 重定向生效

### 为什么必须你来

代理不碰生产服务器。改配置、重载服务、万一打错字导致 nginx 起不来 ——
这几件事的后果是**整站下线**，不该由一个看不到你服务器状态的程序按下去。

### 现在欠的是什么

仓库里 `deploy/nginx/taxonomy-redirects.conf` 有 **12 条 301**，其中 6 条是新的
（三个产品换了类目，旧网址要跳到新网址）。文件已经推到服务器上了，
**但 nginx 还没读它**，所以那 6 条现在不生效 —— 旧网址目前是 404。

### ⚠ 2026-09-03 更正：光 reload 是不够的

你那次 `nginx -t` 和 `nginx -s reload` **执行得完全正确**，输出也对。但三条新的
301 依然返回 200 —— 原因是我上一版手册漏了一步：

**nginx 读的不是仓库里的文件。** 它读的是

```
/www/server/panel/vhost/nginx/extension/cantonlock.com/10-taxonomy-redirects.conf
```

`git pull` 只更新仓库目录，不会碰这个路径。所以 reload 重新读的还是**旧文件** ——
而且它会报告成功，这是最容易误判的地方。

现在有一条命令一次做完：复制 → 备份 → 测试 → 重载 → 验证。**用它，不要手动
复制。**

### 操作步骤（宝塔面板）— 推荐：一条命令

**① 打开宝塔终端**（左侧菜单最下 **「终端」**；没有就去「软件商店」搜 `终端` 装 Web终端）

**② 找到仓库在服务器上的位置**，粘贴这一行回车：

```bash
find /www/wwwroot -maxdepth 3 -name "install-nginx-redirects.sh" 2>/dev/null
```

会打印出一个路径，例如
`/www/wwwroot/cantonlock.com/deploy/install-nginx-redirects.sh`。

> 如果**什么都没打印**，说明服务器上的代码还没更新到最新。先跑
> `cd /www/wwwroot/cantonlock.com && git pull`，再重来这一步。

**③ 执行它**（把下面的路径换成上一步打印出来的那个）：

```bash
bash /www/wwwroot/cantonlock.com/deploy/install-nginx-redirects.sh
```

**成功时最后一行是：**

```
All redirects live. Now purge Cloudflare — it caches 301s.
```

**失败时**它会自己把旧配置**还原回去、不重载**，网站不受影响 —— 把整屏截图发我。

**④ 然后去 Cloudflare purge**（第 2 节）。⚠ **Cloudflare 会缓存 301**，不 purge
的话你在浏览器里测还是旧结果。

---

### 手动方式（只在脚本跑不了时用）

**① 打开宝塔终端**

浏览器登录你的宝塔面板 → 左侧菜单最下面有一项 **「终端」**（图标是一个黑色方框）
→ 点进去。会出现一个黑底白字的命令行窗口。

> 如果左侧没有「终端」：点左侧 **「软件商店」** → 搜索 `终端` → 安装
> 「Web终端」插件。或者用 Windows 自带的 PowerShell：
> `ssh root@43.131.27.225`，输入服务器密码。

**② 先测试配置有没有写错**

在终端里**粘贴这一行**，然后按回车：

```bash
nginx -t
```

**看到这两行就是对的：**

```
nginx: the configuration file /www/server/nginx/conf/nginx.conf syntax is ok
nginx: configuration file /www/server/nginx/conf/nginx.conf test is successful
```

⚠ **如果不是这两行，就到此为止，把整屏内容截图发我，不要执行下一步。**
配置有错的时候 reload 会让 nginx 起不来，整站会打不开。

**③ 确认没错之后，重载**

```bash
nginx -s reload
```

**这条命令成功时不会有任何输出** —— 光标直接跳到下一行就是成功了。
没有消息就是好消息。

**④ 验证重定向生效了**

还在同一个终端里，粘贴这一行：

```bash
curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" https://cantonlock.com/products/deadbolts/ansi-grade-3-keyed-deadbolt-lock-set/
```

**期望看到：**

```
301 -> https://cantonlock.com/products/grip-handle-sets/ansi-grade-3-keyed-deadbolt-lock-set/
```

看到 `301 ->` 就成功了。如果看到 `200 ->` 或 `404 ->`，把结果发我。

### 以后什么时候还要做这一步

**我在交接里写「⚠ nginx 需要 reload」的时候。** 只有 `deploy/nginx/` 下的文件
变了才需要，普通发布不需要。

---

---

## 1b. 改 index.php 跳转规则（2026-09-04 新增，只做一次）

### 为什么要做

9 月 4 日的 Search Console 导出里有一条很清楚的东西：

> `https://www.cantonlock.com/index.php?lang=es` —— **31 次展示，平均排名 4.97**

这是**旧的西班牙语首页**，也是全站排名最好的几个 URL 之一。它现在 301 到
**英文的** `/products/`。也就是说：一个西语买家在 Google 上搜到我们、点进来，
落在一个英文栏目页上。访客和排名一起浪费掉。

还有第二个问题：光秃秃的 `index.php`（旧首页）也被送到 `/products/`。
那是在回答没人问的问题，还丢掉了首页自己积累的排名。

`deploy/install-nginx-redirects.sh` 已经把需要的三个变量装好了（第 1 步做过就有）。
**只剩这一个 location 块要手工改** —— 因为它在宝塔管理的主配置文件里，
安装脚本按设计不碰那个文件。

### 第一步：打开配置文件

1. 打开宝塔面板 → 左边菜单 **网站**
2. 找到 `cantonlock.com` 这一行，点最右边的 **设置**
3. 弹出窗口里点上方的 **配置文件**

你会看到一大段配置。**先什么都别改。**

### 第二步：备份（重要）

**在改任何东西之前**，在文本框里点一下，按 `Ctrl+A` 全选、`Ctrl+C` 复制，
粘贴到一个记事本里存起来。

万一改坏了，把这份贴回去就恢复原状。这一步花 20 秒，省的是网站下线。

### 第三步：找到要改的那三行

在配置文件里按 `Ctrl+F`，搜 **`LEGACY-REDIRECT-START`**。

> **这一步我上一版写错了，抱歉。** 上一版让你搜 `index.php` —— 但配置文件第 9 行
> 就有一句 `index index.php index.html …`，那是 nginx 的默认首页设置，
> **和跳转规则毫无关系**。搜索框会先跳到那一行（显示「1 of 1」），
> 于是你看到的和我写的对不上。
>
> `LEGACY-REDIRECT-START` 在整个文件里只出现一次，直接落在正确的位置。

搜到之后，你会看到被两行注释包起来的一段：

```nginx
#LEGACY-REDIRECT-START 旧 DedeCMS URL 的 301，见 0.legacy-redirects.conf
location ~* ^/index\.php$ {
    if ($legacy_product_url != "") { return 301 $legacy_product_url; }
    if ($legacy_category_url != "") { return 301 $legacy_category_url; }
    return 301 /products/;
}
#LEGACY-REDIRECT-END
```

在服务器上这一段大约在第 27–33 行。

**如果搜不到 `LEGACY-REDIRECT-START`**，停在这里，把整个配置文件截图发我，
不要继续。

### 第四步：把中间三行换掉

把上面那段里的**三行**（两行 `if` 加最后一行 `return`）替换成下面这三行。
`location` 那一行和最后那个 `}` 不要动：

```nginx
    if ($legacy_product_url != "")  { return 301 $legacy_lang_prefix$legacy_product_url; }
    if ($legacy_category_url != "") { return 301 $legacy_lang_prefix$legacy_category_url; }
    return 301 $legacy_lang_home$legacy_fallback_path;
```

改完这一段应该长这样：

```nginx
location ~* ^/index\.php$ {
    if ($legacy_product_url != "")  { return 301 $legacy_lang_prefix$legacy_product_url; }
    if ($legacy_category_url != "") { return 301 $legacy_lang_prefix$legacy_category_url; }
    return 301 $legacy_lang_home$legacy_fallback_path;
}
```

**逐字对照一遍。** 少一个 `$` 或者少一个分号，nginx 会拒绝启动。

### 第五步：保存

点弹窗右下角的 **保存**。

**宝塔在保存时会自动跑一次 `nginx -t` 语法检查：**

- **看到「保存成功」** → 语法没问题，配置已经生效，继续第六步。
- **看到红色报错**（通常写着 `nginx: [emerg]` 或 `configuration file test failed`）
  → **不要再点保存，也不要再改**。把第二步存的备份全选贴回去、保存，
  然后把报错截图发我。这个过程中网站不会中断 —— nginx 只在检查通过后才换配置。

### 第六步：验证（在服务器终端里）

宝塔 → 左边菜单 **终端**，把下面整段粘进去按回车：

```bash
for u in "index.php?lang=es" "index.php" "index.php?lang=es&tid=97" "index.php?tid=97" "index.php?tid=999"; do printf "%-30s " "$u"; curl -sk -o /dev/null -w "%{http_code} -> %{redirect_url}\n" --resolve "cantonlock.com:443:127.0.0.1" "https://cantonlock.com/$u"; done
```

> **⚠ 2026-09-04 更正：必须走 443，不能走 80。**
> 我上一版写的是 `http://127.0.0.1`，那条命令**测不到这段规则**。
> 配置第 22–26 行有：
>
> ```nginx
> if ($server_port !~ 443){
>     rewrite ^(/.*)$ https://$host$1 permanent;
> }
> ```
>
> 80 端口的请求在到达跳转规则之前就被强制跳到 https 了 —— 这条 `rewrite`
> 在 nginx 的 rewrite 阶段执行，**早于 location 处理**。所以测出来会是
> `index.php?lang=es → https://cantonlock.com/index.php?lang=es`，
> 五行全是「原样加个 https」，看起来像没生效，其实是根本没测到那段。
>
> `--resolve` 让 curl 连本机的 443，`-k` 跳过证书域名校验。

**应该看到这五行**（`->` 后面的地址要完全一样）：

```
index.php?lang=es              301 -> https://cantonlock.com/es/
index.php                      301 -> https://cantonlock.com/
index.php?lang=es&tid=97       301 -> https://cantonlock.com/es/products/lock-cases/
index.php?tid=97               301 -> https://cantonlock.com/products/lock-cases/
index.php?tid=999              301 -> https://cantonlock.com/products/
```

- **五行都对** → 完成了。接着做第 2 步（Cloudflare purge），因为 Cloudflare 会缓存
  301，不清缓存的话外面看到的还是旧跳转。
- **有任何一行不对，或者出现 `404` / `200` / `500`** → 把整段输出截图发我。
  网站此刻是正常的（这几条只是旧 URL 的跳转），不用紧张，也不要自己回滚。

### 这一步做完之后

不需要再做第二次。以后 `deploy/nginx/` 下的文件变了，跑第 1 步的安装脚本就够了 ——
这三个变量在那个脚本装的文件里，会跟着一起更新。

---

---

## 1c. 网站卡顿：先撤销我上一版的改动（2026-09-04 更正）

### 请先做这一件：把那五行删掉

如果你已经加了这几行，**全部删掉**：

```nginx
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 223.5.5.5 119.29.29.29 valid=300s;
    resolver_timeout 5s;
    ssl_session_cache shared:SSL:20m;
    ssl_session_timeout 1d;
```

删完保存，`nginx -t` 会通过。

### 我错在哪

**我把诊断做在了源站上，而访客根本不碰那台机器。**

`cantonlock.com` 的 A 记录指向 `172.67.136.43` / `104.21.62.132` —— 这是
**Cloudflare 的 IP**。域名是橙云代理状态，**TLS 由 Cloudflare 的边缘节点终止**。

两条命令就能看出来：

| 连谁 | 证书签发者 |
|---|---|
| `cantonlock.com`（访客走的） | **Google Trust Services** —— Cloudflare 的边缘证书 |
| `43.131.27.225`（源站） | Sectigo —— 宝塔里那张 |

**两张不同的证书。** 所以源站 nginx 上的 `ssl_stapling` 和 `ssl_session_cache`
对访客的握手速度**没有任何影响** —— 那是 Cloudflare 到源站之间才会用到的东西，
而 Cloudflare 对源站是长连接复用的，本来就不怎么握手。

我测出来的 `OCSP response: no response sent` 是 **Cloudflare 边缘的行为**，
不是你服务器的，也不是你服务器能改的。

顺带：`ssl_session_cache shared:SSL:20m` 报错是另一回事 ——
`SSL` 这个共享内存区名在这台机器上已经被声明成 10m 了（`stahlock.com`
和它共用一台服务器）。同一个名字全局只能有一个大小。**这也说明会话缓存本来就已经开着。**

### 那到底为什么慢

实测（从你这台机器，重复三次）：

| | 连接 | TLS 握手 | 首字节 | 整页 |
|---|---|---|---|---|
| 走 Cloudflare | 0.21 秒 | 1.07–1.56 秒 | 1.32–1.82 秒 | 2.3–2.5 秒 |
| 直连源站 | 0.21 秒 | 1.11–1.15 秒 | 1.41–1.69 秒 | 1.9–2.2 秒 |

**两条路一样慢**，而且 `CF-RAY` 的结尾是 **`MIA`** —— 迈阿密。

**Cloudflare 免费版把中国大陆的访问调度到了美国东岸。** 从广东到迈阿密单程约
210 毫秒，TLS 1.3 理论上一个往返就够，实测却花了 900 毫秒 ——
多出来的是国际线路的丢包重传。

**这不是 nginx 能改的，也不是服务器的问题。**

### 重要：这可能不是你买家的体验

**你在中国测一个卖到海外的网站。** Search Console 的国家分布是：
印度、美国、越南、德国、西班牙。**一个西班牙的买家会落在马德里或巴黎的节点上，
不会绕到迈阿密。**

所以在花钱解决之前，先确认海外访客到底慢不慢 —— Search Console 的
**「核心网页指标」** 报告用的是真实访客数据，那个数字才代表买家的体验。
你下次登录时点开看一下，把截图发我。

### 真要解决，只有这几条路（都不在宝塔里）

| 方案 | 代价 | 适合谁 |
|---|---|---|
| 什么都不做 | 0 | **如果海外指标是绿的，这就是正确答案** |
| Cloudflare 域名改「灰云」（关代理） | 失去 CDN 和 DDoS 防护，源站 IP 暴露 | 只有中国访客是主力时 |
| Cloudflare 中国网络 | 企业版价格 + 需要 ICP 备案 | 中国是正式市场时 |

### 我这边确实能修的一件

产品页首屏要下载 **1.2 MB**，其中约 **570 KB 是 JavaScript** ——
一个静态站不该有这么多。这个和线路无关，在任何地方都省下来，
归我改，不用你操作。

### 对不起

这一节上一版让你在服务器上白改了一次，还撞出一个 `nginx -t` 失败。
根因是我拿边缘的测量结果去开源站的药方 —— **同一个域名，两台机器，
我没有先确认我在测哪一台。**

---

## 2. Cloudflare 全区 purge

### 为什么必须你来

代理不登录 Cloudflare 后台、不使用 API token。这是纪律，写在 `AGENTS.md` 里。

### 什么时候做

**每次我说「已推送 / 已发布」之后。** 不 purge 的话，访客最长两小时内看到的
还是旧页面。

### 操作步骤

1. 浏览器打开 **dash.cloudflare.com**，登录
2. 在网站列表里点 **cantonlock.com**
3. 左侧菜单找 **「Caching」（缓存）** → 点 **「Configuration」（配置）**
4. 页面上找到 **「Purge Everything」**（紫色/蓝色按钮，写着「清除所有内容」）
5. 点它 → 弹窗问你确认 → 再点一次 **「Purge Everything」**
6. 看到绿色提示 **「Successfully purged」** 就完成了

**多久生效**：大约 30 秒。之后你自己刷新网站，Ctrl+F5 强制刷新一次。

### 一个已经不用担心的事

以前有个风险：purge 不及时的话，访客可能拿到旧的 HTML，而它引用的样式表
已经被新版本删掉了 —— 结果是**整页没有样式**，像网站坏了。

**这个我已经从根上修掉了**（`scripts/retain-previous-assets.mjs`，旧资源保留
48 小时）。所以现在 purge 只影响「多久看到新内容」，不会再出现无样式页面。
你想什么时候 purge 都行。

---

## 3. Google Search Console 手动提交

### 为什么必须你来

Google 没有 IndexNow 这种接口，只能人工在后台一条条点。

**Bing / Yandex / Naver / Seznam 你完全不用管** —— 我每次发布跑一次
`node scripts/indexnow-submit.mjs`，969 条一次推完，不限量。

### 操作步骤

1. 打开 **search.google.com/search-console**，登录
2. 左上角确认选中的是 **cantonlock.com**
3. 打开桌面 `hyde` 文件夹里的 **《需要手动提交的网址.md》**
4. 从 **第 1 组** 的第一条网址开始，复制
5. 在 Search Console **最顶上那个搜索框**（灰色，写着「检查 https://cantonlock.com/ 中的任何网址」）粘贴 → 回车
6. 等 10–30 秒，出现结果页
7. 点右边的 **「请求编入索引」**
8. 等一个转圈的弹窗结束，看到 **「已请求编入索引」** 就成功了
9. 回到第 4 步，做下一条

### 什么时候停

**当它提示配额用完时就停**，第二天接着做。Google 每天大约十几条。

### 三条别做的事

- ❌ **不要重复提交同一条**。重复不会加快，只会白白用掉配额
- ❌ **不要从 sitemap 顶上一条条往下点**。那份清单是排过序的，第 1 组价值最高
- ❌ 提交后不要天天去看。通常几天到两周才收录

---

## 4. Bing 与 Clarity 设置（一次性）

### 4.1 Clarity 的「乱码」是它自己的打码，不是网站问题

你看到的 `□□□■■` 是 Clarity 的**隐私打码**（Masking）。它默认会把数字、日期
这类内容遮掉。标签正常、只有数值变方块 —— 那就是它。

**关掉的方法：**

1. 打开 **clarity.microsoft.com**，登录，进 cantonlock 项目
2. 右上角齿轮 **「Settings」（设置）**
3. 左侧点 **「Masking」（遮罩）**
4. 把 **「Balanced」** 改成 **「Relaxed」**
5. 点 **「Save」**

改完之后**新的录像**才不打码，已有的录像不会变。

### 4.2 Clarity 里 PC 看起来像手机版 —— 不是 bug

两个原因，都正常：

- Clarity 回放是把页面放进一个小框里播，**CSS 断点响应的是这个小框的宽度**，
  不是访客当时的屏幕宽度。框窄了，桌面会话就回放成手机版
- 「PC」这个标签是从浏览器标识推出来的。**一个把窗口拉窄或者分屏的 PC 用户，
  本来就该看到手机版** —— 那是对的行为

### 4.3 Bing 面板上「Not indexed as this page is a redirect」

那是 **Bing Index** 标签页，显示的是它**存档里的旧记录**（旧站时代首页会跳转）。
旁边的 **Live URL** 标签才是现在的状态。

**要做的只有一件事**：点那个 **「Request indexing」** 按钮。

---

## 5. Skills 的安装与更新

### 现状

已经装好 **35 个**（原有 13 个 Cloudflare + 我新装的 22 个）。
位置：`C:\Users\johns\.claude\skills\`

### 为什么不是全部装上

你下载的 9 个仓库里一共有 **1,586 个 skill**。

**skill 不是免费的** —— 每一个的名字和说明都会在每次会话开始时载入我的上下文。
1,586 个大约要吃掉 11 万 token，会严重挤占我处理你实际工作的空间，而且
选择项太多反而会让我挑错。

所以我挑了 22 个跟这个项目直接相关的。清单和用途见我的回复。

### 怎么更新（推荐方式）

你下载的是 zip 解压包，**没有自动更新**。但其中 5 个仓库自带
`.claude-plugin/marketplace.json`，意味着它们**支持作为插件安装，插件能更新**。

在**一个交互式的 claude 终端**里（不是这个界面），执行：

```
/plugin marketplace add https://github.com/coreyhaines31/marketingskills
```

之后 `/plugin` 菜单里就能安装、更新、卸载。

支持这种方式的仓库：

| 仓库 | GitHub |
|---|---|
| marketingskills | coreyhaines31/marketingskills |
| taste-skill | （见你下载页面的地址） |
| ui-ux-pro-max-skill | 同上 |
| open-design | 同上 |
| ECC | 同上 |

### 手动更新（如果不想用插件）

重新去 GitHub 下载 zip → 解压到 `C:\Users\johns\Downloads\skills\` 覆盖 →
跟我说一声「skills 更新了」，我重新拷一遍。

---

## 附：什么时候该找我，什么时候自己做

| 情况 | 谁做 |
|---|---|
| 改网站内容、代码、图片、SEO | **我** |
| 服务器上执行命令 | **你**（我给你逐字命令） |
| Cloudflare 后台 | **你** |
| Google Search Console 点提交 | **你** |
| Bing / Clarity 后台设置 | **你** |
| 装 / 更新 skills | 你下载，我安装 |

**我每次说「已推送」之后，你固定做两件事：**
1. Cloudflare purge（第 2 节）
2. 如果我提到 nginx，就做第 1 节

其余的按需要做。
