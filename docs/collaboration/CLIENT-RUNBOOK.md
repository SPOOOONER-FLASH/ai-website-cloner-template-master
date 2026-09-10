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
| 6 | **雷茵中文站上预览域名（2026-09-06 新增，只做一次）** | 一次性 | 5 分钟 |
| 7 | **两台机器怎么同步（2026-09-09 新增）** | 每次开工/收工 | 1 分钟 |
| 8 | **我在哪台电脑写文件、改动怎么上线、雷茵与 HYDE 的分区** | 读一次 | 3 分钟 |

---

## 1. nginx reload —— 让 301 重定向生效

### 为什么必须你来

代理不碰生产服务器。改配置、重载服务、万一打错字导致 nginx 起不来 ——
这几件事的后果是**整站下线**，不该由一个看不到你服务器状态的程序按下去。

### ✅ 2026-09-07 复查：这一节的工作已经做完了，现在不欠什么

线上实测六个旧网址，**全部正确 301**，而且是逐条精确映射的：

| 旧网址 | 跳到 |
|---|---|
| `/index.php` | `/` |
| `/index.php?lang=es` | **`/es/`**（西语跳西语，不是英文页） |
| `...&aid=488` | `/products/hardware-accessories/dv07-door-viewer/` |
| `...&aid=297&lang=en` | `/products/glass-door-accessories/f112-glass-door-patch-fittings/` |

随时可以自己复跑：`node scripts/verify-legacy-redirects.mjs`。

**下面的步骤保留，是为了以后再加 301 时照着做**，不是现在要做的事。

### 当时欠的是什么（历史记录）

仓库里 `deploy/nginx/taxonomy-redirects.conf` 有 **12 条 301**，其中 6 条是新的
（三个产品换了类目，旧网址要跳到新网址）。文件已经推到服务器上了，
**但 nginx 还没读它**，所以那 6 条当时不生效 —— 旧网址是 404。

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

## 1a. ⚠ 2026-09-10：重定向规则已经旧了三天，跑一次第 1 节的脚本就行

**这一条现在最重要，因为它正在损失流量。而且只有两行命令。**

> 🔴 **2026-09-10 更正**：我上一版在这里写了 `cd /path/to/site`。
> `/path/to/site` 是占位符不是真路径，你照着粘贴当然会报
> `No such file or directory`。**是我写错了，对不起。**
> 真实路径是 `/www/wwwroot/cantonlock.com`，下面已经写死。

### 出了什么事

Bing 报「38 个页面标题重复」「4 个页面缺 h1」。查下来是同一个原因：
**产品改名之后的旧网址，服务器上没有 301，只有网页里的 JS 跳转。**

浏览器会跟着 JS 跳，人看不出问题；**搜索引擎看到的是一个 200 的空页面**，
标题是网站通用标题、没有 h1。所以 Bing 报了重复标题，而且旧网址攒下的排名传不到新网址。

实测（2026-09-10）：

| 网址 | 现在返回 | 应该返回 |
|---|---|---|
| `/products/hardware-accessories/ds011-door-flush-bolt/` | **200**（错） | 301 → `ds011-door-stopper/` |
| `/products/door-hinges/stainless-steel-door-hinge/` | 301（对） | 301 |

对的那条是类目搬迁，规则在 2026-09-07 生成的那份文件里；错的那条是产品改名，
**在那之后才发生，服务器上那份文件还是 09-07 的旧版。**

| | 条数 |
|---|---|
| 服务器上正在用的（2026-09-07 生成） | 16 |
| 仓库里最新的 | **48** |
| 新增的是什么 | DS011 门吸改名 + 逃生器械 16 个型号改名 |

### 你要做的：两行命令

在宝塔面板左侧点 **「终端」**，粘贴第一行，回车：

```bash
cd /www/wwwroot/cantonlock.com && git pull
```

**成功的样子**：打印出一串更新的文件名，里面应该有
`deploy/nginx/taxonomy-redirects.conf`。
如果显示 `Already up to date.`，说明服务器已经拉过了，直接做下一步。

然后粘贴第二行，回车：

```bash
bash /www/wwwroot/cantonlock.com/deploy/install-nginx-redirects.sh
```

**成功时最后一行是：**

```
All redirects live. Now purge Cloudflare — it caches 301s.
```

**这个脚本是安全的**：它会先备份现有配置、先跑 `nginx -t` 测试、测试不过就
**自动还原并且不重载**。所以它跑失败也不会让网站下线 —— 把整屏截图发我就行。

### 做完之后

去 Cloudflare purge（第 2 节）。⚠ **Cloudflare 会缓存 301**，不 purge 的话你在
浏览器里测还是旧结果。

想自己验证的话，在你自己电脑上：

```bash
curl -I https://cantonlock.com/products/hardware-accessories/ds011-door-flush-bolt/
```

**成功的样子**：第一行是 `HTTP/2 301`，并且有一行
`location: https://cantonlock.com/products/hardware-accessories/ds011-door-stopper/`。

> 做完这一条，Bing 报的「重复标题」和「缺 h1」会在它下次抓取时自己消失。

---

## 1c-新. 服务器 git pull 被中止：「local changes would be overwritten」

2026-09-10 出现过一次，以后还会再出现，所以写下来。

### 症状

在服务器上跑 `git pull`，结尾是：

```
error: Your local changes to the following files would be overwritten by merge:
error: The following untracked working tree files would be overwritten by merge:
Aborting
```

**「Aborting」的意思是：什么都没做，服务器还是旧版本。** 网站不会坏，
但你推的新内容没上线 —— 新网址会 404，新图片不显示。

### 为什么会这样

服务器上不知何时跑过一次构建，生成了一批文件。这些文件后来我在本地也生成了、
提交了、推上去了。git 现在两边都有同名文件、内容不同，它不敢替你决定要哪个，
所以停下。

### 处理方式：让服务器强制对齐远端

**这台服务器是部署镜像 —— 上面所有内容都应该来自 git，不该有任何独有的东西。**
所以正确动作是丢掉服务器上的本地改动，完全跟远端一致。

**第一步：先看看会删掉什么**（这一步不改任何东西，只是列清单）：

```bash
cd /www/wwwroot/cantonlock.com && git clean -fdn | head -40
```

**2026-09-10 实测的结果是只有三行**，而且三个都是宝塔生成的配置文件：

```
Would remove out-rayen/.user.ini
Would remove out/.htaccess
Would remove out/.user.ini
```

**看到的和这个差不多就继续。** 如果列出了几十上百个 `out/` 或
`content/products/` 里的文件，也是正常的（那是旧构建残留）。
**但只要看到任何不像自动生成的东西 —— 你自己上传的照片、你自己写的文件 ——
就停下来发我截图。**

**第二步：确认没问题之后，四行命令：**

```bash
cd /www/wwwroot/cantonlock.com
git fetch origin
git reset --hard origin/main
git clean -fd -e .user.ini -e .htaccess
git log --oneline -1
```

> ⚠ **`-e .user.ini -e .htaccess` 这两个排除项不能省。**
>
> 2026-09-10 实测，服务器上唯一的未跟踪文件就是这三个：
> `out/.user.ini`、`out-rayen/.user.ini`、`out/.htaccess`。
> **它们不是网站内容，是宝塔面板自己给站点目录生成的** ——
> `.user.ini` 放 PHP 的 open_basedir 限制，`.htaccess` 是伪静态规则。
>
> 宝塔通常还给 `.user.ini` 加了不可修改属性（`chattr +i`），所以
> `git clean` 删它会**失败并中断整条命令**，后面的验证就不会执行。
> 加了排除项就绕开这个坑，而且这两个文件留着对静态站没有任何副作用。

**成功的样子**：最后一行打印出一个提交号和中文提交信息，
和你在 GitHub 上看到的最新一条一致。

**第三步：验证网站**

```bash
curl -s -o /dev/null -w "%{http_code}
" https://cantonlock.com/
```

打印 `200` 就是好的。

**第四步：去 Cloudflare purge**（第 2 节）。

### 这三行命令会不会把网站弄坏

不会，但要理解它做什么：

| 命令 | 做什么 |
|---|---|
| `git fetch origin` | 只下载，不改任何文件 |
| `git reset --hard origin/main` | 把**已跟踪**文件恢复成远端的样子 |
| `git clean -fd` | 删掉**未跟踪**的文件和目录 |

第三条是唯一会删东西的。**在部署镜像上这是对的** —— 网站要的每个文件都在 git 里。
第一步的 `-fdn`（n = 预演）就是让你在删之前先看一眼。

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

---

## 6. 雷茵中文站上预览域名（2026-09-06 新增，只做一次）

### 为什么必须你来

代理不碰生产服务器。这一步要在宝塔里启动一个网站、改它的目录 ——
改错了会让 `spoonercantonlock.stahlock.com` 打不开。cantonlock.com 和 stahlock.com
不受影响（它们是另外两个网站配置），但这一条仍然是你按，不是我按。

### 这一步之后会发生什么

`https://spoonercantonlock.stahlock.com/` 会变成雷茵五金的中文站首页。
证书已经有了（面板显示剩余 69 天），不需要重新申请。

站上有 456 个页面：首页、产品中心、15 个品类页、435 个型号页，以及走进雷茵、
品质与认证、合作与定制、联系我们。**全站设了不收录**（robots.txt 里 `Disallow: /`），
因为这是临时域名 —— 正式域名定下来之前，不能让搜索引擎把雷茵的页面收在
stahlock 的子域名下。

### 第 1 步：先确认服务器已经拉到最新代码

用宝塔的「终端」，粘贴这一行：

```bash
ls -d /www/wwwroot/cantonlock.com/out-rayen && ls /www/wwwroot/cantonlock.com/out-rayen | head
```

**成功的样子**：先打印出 `/www/wwwroot/cantonlock.com/out-rayen`，
接着列出 `_next  company  contact  images  index.html  ...` 这些名字。

**看到 `No such file or directory`**：服务器还没拉到这次的提交。
服务器每 5 分钟自动 `git pull` 一次，等 5 分钟再跑一遍这行。
连着两次都没有就截图发我，不要自己动 git。

### 第 2 步：在宝塔里改这个网站的目录

1. 宝塔面板 →左侧 **网站**
2. 找到 `spoonercantonlock.stahlock.com` 这一行（现在状态是红色的「已停止」）
3. 点这一行右边的 **设置**
4. 打开 **网站目录** 这个标签页
5. **网站目录** 那一栏，把里面的内容整个删掉，改成下面这一行，然后点它右边的绿色 **保存**：

```
/www/wwwroot/cantonlock.com/out-rayen
```

6. **运行目录** 那一栏，现在写的是 `/www/server/stop`。把它改成一个斜杠：

```
/
```

   再点这一栏右边的绿色 **保存**。

> ⚠ **两个「保存」是分开的两个按钮，各管各的一栏。** 只点一个的话另一栏不会生效。

7. 关掉设置弹窗

### 第 3 步：启动网站

回到 **网站** 列表，`spoonercantonlock.stahlock.com` 那一行右边有个 **停止 / 启动**
的开关（现在显示红色「已停止」）。点它，让它变成绿色的「运行中」。

### 第 4 步：看结果

浏览器打开：

```
https://spoonercantonlock.stahlock.com/
```

**成功的样子**：整屏是一张车间照片，左下角写着「机械门锁与门控五金制造」，
左上角是 RAYEN 雷茵 的黑红商标，右上角有「产品中心 走进雷茵 品质与认证
合作与定制 联系我们」五个栏目。往下拉能看到「15 个在售品类 / 435 个在售型号 /
2026 年公司成立」和一格一格的产品分类。

**如果看到宝塔默认页 / 「站点已停止」/ 404**：

| 看到什么 | 多半是哪一步 | 怎么办 |
|---|---|---|
| 「站点已停止」 | 第 3 步没点，或点了没生效 | 回列表再点一次开关，刷新页面 |
| 宝塔默认欢迎页 | 第 2 步的**运行目录**没改成 `/` | 回第 2 步，把运行目录改成 `/` 并单独保存 |
| 404 Not Found | **网站目录**路径打错了 | 回第 2 步，逐字对一遍那行路径 |
| 页面出来了但没有图 | 服务器代码拉了一半 | 等 5 分钟刷新；还不行截图发我 |

以上都试过还不对，**停下来截图发我**，不要继续改配置。

### 第 5 步（发布后）

和其他站一样：**记得 purge Cloudflare。**

---

## 雷茵中文站 · 还缺你提供的东西

下面这些现在在网站上显示成一条短横线「—」。不是漏做了，是**我们不知道，
所以没有编一个填上去**。你把内容给我，我填进 `content/rayen/site.json` 就会出现。

| 缺什么 | 现在显示 | 为什么不能先随便填 |
|---|---|---|
| **雷茵的电话** | — | 现有的 `+1 703 967 7493` 是 HYDE 的美国号码。填上去，中国买家打过去接到的是出口部 |
| **雷茵的邮箱** | — | `lock@cantonlock.com` 同理，是另一家主体的 |
| **微信号 / 二维码** | — | 中国买家找工厂第一个找微信，这一条现在是空的 |
| **1688 店铺链接** | — | 联系页和页脚都留了位置 |
| **正式域名** | 用临时域名 | 定了之后改一行配置 + nginx 的 server_name |
| **ISO 14001 / CCC 证书扫描件** | 只写了名称，没有图 | 见下面一条 |

### 关于证书，有一件事要先跟你确认

`G:\新网站资料\24-工厂图\证书\` 里的那几张，我打开看了 —— 第一张是 Intertek 的
EN 1154 检测报告，上面印着：

- **申请方**：KALE KILIT VE KALIP SANAYI A.S.（土耳其公司）
- **制造方**：CANTON HYLAND HARDWARE CO., LTD

**那是 HYDE 的证书，不是雷茵五金的**，而且是针对某个具体型号的检测报告，不是公司资质。
挂到雷茵站上，等于声明雷茵有一份它没有的资质 —— 证书编号就印在图上，
买家拿编号一查就露馅，而且露馅的代价是他连你真有的那两项也不信了。

所以现在品质页上只写了「ISO 14001」「CCC」两个名称，加一句「证书扫描件待提供」。
请把**雷茵五金自己名下**的证书扫描件发我，我放上去。
如果雷茵名下暂时没有，那就维持现状 —— 少两张图，比多两张查得到的假证强。

### 还有 78 个型号没有实拍图

435 个型号里，78 个在仓库里一张照片都没有（不是被水印挡掉的，是本来就没有）。
这些型号的页面上写着「暂无实拍图」，规格表照常显示。

另外 158 张照片因为左上角有 **Hyland** 的椭圆商标、而商标压在走廊/门体这类
实景画面上没法清掉，也没有用。要用的话需要美工手工裁切，清单在
`content/rayen/product-image-cleanup.json` 的 `refused` 里。

`npm run sheets` 生成的美工填写表已经在统计要补拍的型号，这 78 个在里面。

---

## 7. 两台机器怎么同步（2026-09-09 新增）

甲方 2026-09-09：「在那台机器上办公，做雷茵的东西，然后这里后续再同步过来」。
那台机器上的目录是 `C:\Users\86132\Downloads\ai-website-cloner-template-master-main`，
已确认是 **clone**（不是下载的 zip），所以 `git pull` 能用。

### 为什么要有这一节

两台机器改同一个仓库，最容易出的事不是冲突报错，而是**两边各自改了同一批文件，
谁后推谁就把对方覆盖掉**，而且 git 不会拦你 —— 它只在同一行冲突时才报。
`content/products/` 有 587 个 JSON、`out/` 一次动几千个文件，这种覆盖发生了很难发现。

规矩只有一条：**开工前先拉，收工后就推。中间不要两台同时改。**

### 每次在那台机器上开工前

打开那个目录，在里面开一个终端（在文件夹地址栏输入 `cmd` 回车），粘贴：

```bash
git pull
```

**成功的样子**：打印 `Updating xxxxxxx..xxxxxxx` 加一串文件名，
或者 `Already up to date.`（表示这边没有新东西，也是正常的）。

**看到 `error: Your local changes to the following files would be overwritten by merge`**：
那台机器上有没提交的改动。**停下来截图发我**，不要用 `git checkout` 或 `git reset` ——
那两条命令会直接丢掉那些改动。

### 每次在那台机器上收工后

```bash
git add -A
git commit -m "描述这次做了什么"
git push
```

**成功的样子**：最后打印 `main -> main`。

**看到 `rejected` / `non-fast-forward`**：这边先推了新东西。先 `git pull` 再 `git push`。

### 服务器怎么拿到

两台机器谁推都一样 —— 服务器每 5 分钟自己 `git pull` 一次。
推完等 5 分钟，网站就更新了。**记得 purge Cloudflare。**

### 那台机器第一次 push 要登录（拉取不用）

仓库是**公开**的，所以 `git pull` 不需要任何账号，直接就能拉。
**只有 `git push` 需要登录**，而且只有第一次。

第一次在那台机器上 `git push` 时，会弹出一个 GitHub 登录窗口：

1. 选 **Sign in with your browser**
2. 浏览器打开后用 `spoonerlau@gmail.com` 那个账号登录
3. 点 **Authorize**

**成功的样子**：窗口自己关掉，终端里继续跑完并打印 `main -> main`。
以后就不会再问了 —— Windows 的凭据管理器会记住。

**如果没有弹窗、而是提示输入密码**：不要输 GitHub 密码（那个早就不能用了）。
停下来告诉我，我给你另一种登录方式。

> 服务器那边不受影响：它有自己的一份 clone 和自己的计划任务，
> 谁推的都一样，5 分钟后自动拉。**雷茵预览站的网站根目录早就设好了，不用再动。**

---

## 8. 我在哪台电脑上写文件，改动怎么上线（2026-09-09）

### 先回答那个最要紧的问题：我改的是本地，不是线上

**我没有直接编辑 GitHub 的能力。** 每一次改动都是这条路：

```
我改本地文件  →  本地构建  →  本地提交  →  git push 到 GitHub
                                                    ↓
                              服务器自己那份 clone，每 5 分钟 git pull
                                                    ↓
                                        nginx 发出去，网站更新
```

所以「线上仓库」永远是我推上去的结果，不是我直接动的地方。
**这也意味着：改动只有在我推送之后才存在于 GitHub，才可能到另一台电脑和服务器。**

### 关键限制：我只能写「我正在运行的那台电脑」

Claude Code 是跑在某一台电脑上的程序，它读写的是**那台电脑的硬盘**。

- 现在我跑在 **`johns` 这台**，目录 `C:\Users\johns\Downloads\ai-website-cloner-template-master`
- 我在这台上**看不到** `C:\Users\86132\...` —— 那是另一台物理电脑，不在同一个硬盘上

**所以出差那十天，如果你带的是 86132 那台，我不能从这边给那台写文件。**
要我在那台上干活，得**在那台电脑上打开 Claude Code**，然后我读写的就是那台的目录。

两台之间传东西只有一条路：**git。这边推，那边拉。** 没有别的通道。

| 你想要的 | 实际怎么做 |
|---|---|
| 「把新文件发到那台去」 | 我在这边 `git push`，你在那边 `git pull` |
| 「让 Claude 在那台上干活」 | 在那台电脑上打开 Claude Code |
| 「两台都开着，我在哪台说话就在哪台改」 | 可以，但**同一时间只能有一台在改**，见下 |

### 两台同时开工，唯一的禁忌

git 只在**同一行**冲突时才报错。两台各自改了同一批文件的不同地方，
**谁后推谁就把对方悄悄覆盖掉，不会有任何提示**。`content/products/` 有 598 个 JSON、
`out/` 一次动上万个文件，这种覆盖发生了很难发现。

规矩一句话：**开工前先 `git pull`，收工后立刻 `git push`，中间不要两台同时改同一块。**

### 雷茵和 HYDE 的分区：已经分开了，只有目录数据是共用的

你担心「互相修改会互相影响」。实测下来，**页面层是完全隔离的** ——
雷茵的页面一个都没有引用 HYDE 的组件，HYDE 也没有引用雷茵的任何东西。

**改这些只影响 HYDE，雷茵一动不动：**

| 路径 | 是什么 |
|---|---|
| `src/app/(en)/`、`src/app/es/` | 英文站、西班牙文站的页面 |
| `src/components/site/` | HYDE 的所有组件（70 个文件） |
| `content/site-settings.json` | HYDE 的公司信息、联系方式 |
| `public/images/products-hyde/` | 带 HYDE 水印的产品图 |
| `out/` | cantonlock.com 发出去的东西 |

**改这些只影响雷茵，HYDE 一动不动：**

| 路径 | 是什么 |
|---|---|
| `src/app/zh/` | 雷茵中文站的页面 |
| `src/components/rayen/` | 雷茵自己的组件 |
| `content/rayen/` | 雷茵的公司信息、图片清单、拉手型号清单 |
| `content/i18n/zh-terms.json` | 中文术语表 |
| `public/images/products-rayen/` | 去掉水印的产品图 |
| `out-rayen/` | 雷茵预览站发出去的东西 |

**只有这三处是两站共用的：**

| 路径 | 为什么共用 |
|---|---|
| `content/products/*.json` | 产品目录。598 个型号里 **584 个两站都卖，14 个只上雷茵** |
| `content/categories.json` | 品类树（逃生推杠、球锁……），两站是同一套分类 |
| `public/images/products/` | 产品原图。HYDE 加水印、雷茵去水印，都从这里出 |

**产品目录是故意共用的，不建议拆。** 这是同一家工厂的同一批货 ——
拆成两份就要把同一个型号的规格表维护两遍，而两遍迟早会对不上，
到那天两个站会对同一个型号的背距给出不同答案。这比共用危险得多。

需要只上一个站的型号，用记录里的 `sites` 字段控制（这次那 14 个拉手就是
`sites: ["rayen"]`），不用拆目录。有测试盯着：只上雷茵的型号如果漏进了 HYDE 的
构建产物，测试会挂。

### 「线上只有一份」是对的，但不等于「线上一定是对的」

你说的前半句完全正确：**只有一个 GitHub 仓库、一条 `main`**。
两台电脑推的是同一个地方，服务器也只从这一个地方拉。这一点没有歧义。

但**「只有一份」不等于「那一份是干净的」**，原因在这里：

仓库里提交了 **21,245 个构建产物文件**（`out/` 16,316 个 + `out-rayen/` 4,929 个）。
这些是「构建出来的网页」，不是手写的源码。

如果两台电脑都改了东西、都跑了构建、都要推：

1. 先推的那台，正常上去
2. 后推的那台会被 git **拒绝**（`rejected` / `non-fast-forward`）—— 这一步是好的，有提示
3. 但接下来自然的动作是 `git pull`，而 **git 会逐个文件去合并这两万个构建产物**
4. 合出来的结果是**两次构建的混合物**：一部分页面来自 A 那次构建，一部分来自 B 那次
5. **git 不会报任何错**，因为这些文件各自没有冲突。推上去，服务器拉下来，
   网站开始发一批互相对不上的页面

这种坏法查起来非常费劲，因为每个文件单独看都是好的。

### 所以出差这十天，规矩就一条

**只在你带走的那台上改、构建、推。另一台只 `git pull` 看，不改、不构建、不推。**

这样线上永远是一条直线，不会有合并。

> 如果哪天确实需要两台都改：**先在一台上做完并推，另一台再 `git pull`，然后才开始改。**
> 中间不要重叠。
