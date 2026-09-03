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

### 操作步骤（宝塔面板）

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
