# Cloudflare：拦截所有中国爬虫，不封中国真人访客（2026-10-17）

你的要求：「运行规则改为拦截中国 AI 爬虫，IP 不要全部封禁」，接着又说「还有 Kimi、GLM、DeepSeek、腾讯元宝、WorkBuddy，好多，能不能把中国全部爬虫都禁止了」。

一条规则里放了三层拦截，真人访客都不受影响：

| 层 | 拦什么 | 拦得住谁 |
|---|---|---|
| 1. 按爬虫名字 | 名字里带 bytespider、baiduspider、yisou、sogou、360spider、petalbot、chatglm、deepseek、kimi、tencent、yuanbao、hunyuan 的请求，不论从哪个国家来 | 字节豆包、百度文心、阿里夸克、搜狗、360、华为、智谱 GLM、DeepSeek、Kimi，以及报出名字的腾讯爬虫 |
| 2. 中国 IP 上的自动程序 | 从中国大陆来、并且自称 spider / bot / crawl，或者是 Python、Scrapy、Go 程序、无头浏览器的请求 | 所有公开报名字的中国爬虫，包括还没上名单的新爬虫 |
| 3. 中国大厂的机房网络 | 来自腾讯云、阿里云、华为云、百度云服务器的请求 | **伪装成普通浏览器的 AI 抓取**：元宝、WorkBuddy、Kimi 这类工具大多在这些机房里运行。真人上网不会从机房 IP 访问 |

Google、Bing 和 Cloudflare 认证过的正规爬虫（`cf.client.bot`）一律放行。ChatGPT、Claude、Perplexity 的爬虫也不受影响，GEO 照常。

大约 3 分钟。

## 步骤

1. 登录 Cloudflare，点进 **cantonlock.com**。
2. 左侧点 **Security（安全性）→ Security rules（安全规则）**（旧界面是 **WAF → Custom rules**）。
3. 找到原来那条规则（`Block CN and CN crawlers` 或 `Block CN AI crawlers`），点右边的 **Edit（编辑）**。
4. **Rule name（规则名称）** 改成：`Block CN crawlers`
5. 点 **Edit expression（编辑表达式）**，把原来的内容**全部删掉**，粘贴下面整段：

```
(lower(http.user_agent) contains "bytespider") or (lower(http.user_agent) contains "tiktokspider") or (lower(http.user_agent) contains "baiduspider") or (lower(http.user_agent) contains "yisouspider") or (lower(http.user_agent) contains "sogou") or (lower(http.user_agent) contains "360spider") or (lower(http.user_agent) contains "haosouspider") or (lower(http.user_agent) contains "petalbot") or (lower(http.user_agent) contains "chatglm") or (lower(http.user_agent) contains "deepseek") or (lower(http.user_agent) contains "kimi") or (lower(http.user_agent) contains "tencent") or (lower(http.user_agent) contains "yuanbao") or (lower(http.user_agent) contains "hunyuan") or (ip.src.country eq "CN" and not cf.client.bot and (lower(http.user_agent) contains "spider" or lower(http.user_agent) contains "bot" or lower(http.user_agent) contains "crawl" or lower(http.user_agent) contains "python" or lower(http.user_agent) contains "scrapy" or lower(http.user_agent) contains "go-http" or lower(http.user_agent) contains "headless")) or (ip.src.asnum in {45090 132203 133478 37963 45102 136907 38365} and not cf.client.bot)
```

6. 操作仍然选 **Block（阻止）**，点 **Save（保存）**。

**成功的样子：** 规则名变成 `Block CN crawlers`，状态是开启。在国内用手机流量或家里宽带（不开 VPN）打开 cantonlock.com，能正常显示。过一两天，规则旁边会显示拦截次数。

**如果保存时报错：** 截图发我，不要改别的地方。

## 先确认一件事：服务器是不是在腾讯云上

服务器系统是 OpenCloudOS，这是腾讯云的系统，所以服务器很可能就在第 3 层拦截的腾讯云网段里。

- **不受影响：** 访客通过 Cloudflare 访问网站；部署脚本的自检（脚本直接连本机，不经过 Cloudflare）。
- **会受影响：** 如果服务器上有定时任务，是通过网址 `https://cantonlock.com/...` 访问自己的网站，这些请求会被拦。目前我们的脚本都不这么做。哪天发现服务器上有任务访问网站失败，先想到这里。

## 代价（你需要知道）

- **微信里转发 cantonlock.com 的链接，预览卡片可能出不来。** 生成预览图是微信服务器去抓的，这些服务器在腾讯的网段里。链接本身点开没问题。
- 少数用阿里云、腾讯云服务器做代理上网的人会被拦。这类访客基本不会是海外买家。

## 实话：仍然挡不住的

- 有人在自己电脑上用 AI 工具打开网页（例如电脑版元宝、WorkBuddy 在本机运行），对网站来说那就是一个真人在浏览，任何网站都分辨不出来。
- 开 VPN、从海外普通网络访问的人也拦不住。

**网段编号已经逐个核对过：** 腾讯 45090 / 132203 / 133478，阿里 37963 / 45102，华为云 136907，百度 38365。字节的网段编号没查到可靠来源，所以没有加进去；字节的爬虫已经按名字拦了。
