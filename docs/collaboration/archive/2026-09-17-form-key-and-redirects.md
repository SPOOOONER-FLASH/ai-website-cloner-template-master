# 已完成：2026-09-17 那一屏的操作指令

**这是记录，不是指令。不要照着做。**

存档于 2026-09-21，存档人 Claude。当时那三条的实测结局：

| 条目 | 结局 |
|---|---|
| ① 联系表单密钥 | **已完成**。`NEXT_PUBLIC_W3F_KEY` 已配置，2026-09-21 实测线上 7 个文件带真实 key，表单跑通。 |
| ② 服务器跳转规则 | **基本完成**。2026-09-21 实测：三个西/葡语 panic 404 已全部 301。唯独 `/index.asp` 仍是 404 —— 仓库里从来没有这条规则，已转成新一屏的待办。 |
| ③ Cloudflare purge | 已成为常规动作，留在手册的「常规动作」一节。 |

以下为当时原文。

---

## 现在要做的（2026-09-17）

### ① 联系表单的密钥 —— 5 分钟，**这一条最急**

**出了什么事**：网站的联系表单**从上线那天起，一次都没发出去过**。

代码里发信要一个 Web3Forms 的 access key（`NEXT_PUBLIC_W3F_KEY`），
这个密钥从来没有配置过，所以每次点「发送」都直接失败 ——
而且失败时给访客看的是一句**给程序员看的话**：
「请在发布表单前添加 NEXT_PUBLIC_W3F_KEY」。

Clarity 里能看到代价。9 月 16 日那位巴西买家：

```
01:32  开始填表单
05:08  点发送
05:26  再点
05:40  再点 —— 连续的死点击和暴怒点击
06:07  回到表单又填一次，然后离开
```

他写完了一整份需求，按了三次发送，什么都没发出去。

**我已经做的**（今天上线）：现在发送失败时，页面会用访客自己的语言说
「我们没能从网站发出去」，并且**把他填的每一个字原样保留**，给出一个
一键「用邮件发送」的链接（收件人、主题、正文全部填好）和一个可复制的文本框。
**线索不会再丢**。但这只是兜底，正路还得靠密钥。

**你要做的**

1. 打开 https://web3forms.com
2. 在首页的输入框里填 **`lock@cantonlock.com`**（表单要发到哪个邮箱就填哪个），
   点 **Create Access Key**
3. 去那个邮箱收信，里面有一串形如
   `a1b2c3d4-5e6f-7890-abcd-ef1234567890` 的 **Access Key**
4. **把这一串发给我**，我写进构建配置并重新部署

**关于安全**：这个 key 是**公开的**，按设计就要出现在网页的 JavaScript 里 ——
任何人都能看到它。它唯一能做的事是「把表单内容发到你注册的那个邮箱」，
不能读邮件、不能改设置。所以它不是密码，直接发我就行。

免费额度每月 250 封。够用；不够的话那是好消息，到时候再说。

---

### ② 服务器跳转规则 —— 一条命令，约 2 分钟

**为什么现在做**：Search Console 报的三个 404，我刚才逐个实测过，**线上现在还是 404**：

```
https://cantonlock.com/es/products/panic-exit-devices/72-panic-exit-device/    404
https://cantonlock.com/pt/products/panic-exit-devices/72-panic-exit-device/    404
https://cantonlock.com/es/products/panic-exit-devices/030-panic-exit-device/   404
https://cantonlock.com/index.asp                                              404
```

规则我今天已经写好并推送了（西语/葡语路径以前一条都没有，全部规则只认英文路径），
但**规则在仓库里不等于在 nginx 里** —— nginx 读的是它自己的目录，不是仓库。
下面这条命令做的就是搬过去、测试、重载。

**怎么做**

1. 浏览器登录宝塔面板 → 左侧菜单最下面的 **「终端」**（黑色方框图标）。
   没有这一项就去「软件商店」搜 `终端` 装一个。
2. 把下面**整行**粘进去，回车：

```bash
bash /www/wwwroot/cantonlock.com/deploy/install-nginx-redirects.sh
```

**这一条就够了。** 它自己会先 `git pull`，不用你再敲第二行。
（旧手册让你敲两行，那是旧的。）

**成功的样子** —— 最后一行是：

```
All redirects live. Now purge Cloudflare — it caches 301s.
```

它上面会有一串 `OK 301 /…`，那是它自己在服务器内部逐条验证的结果。

**失败的样子** —— 出现 `BAD`、`nginx -t FAILED` 或 `git pull failed`。
**这时网站不会坏**：脚本在重载之前先测试配置，测试不过就把旧配置放回去、不重载。
请把**整屏截图发我**，不要自己改 nginx 文件。

**如果第 1 步找不到那个路径**（提示 `No such file or directory`），先跑这一行看看仓库在哪：

```bash
find /www/wwwroot -maxdepth 3 -name "install-nginx-redirects.sh" 2>/dev/null
```

把它打印出来的路径替换到上面那条命令里。

### ③ Cloudflare purge —— 约 1 分钟

跑完 ②，以及**我每次告诉你「已部署」之后**，都做这一件：

Cloudflare 控制台 → 选 `cantonlock.com` → 左侧 **Caching** → **Configuration** →
**Purge Everything** → 确认。

⚠ Cloudflare **会缓存 301**。不 purge 的话，你在浏览器里测跳转，测到的还是旧结果，
容易误以为 ② 没生效。

