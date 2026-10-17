# Cloudflare 规则改为只拦中国 AI 爬虫，不再封中国 IP（2026-10-17）

你的要求：「运行规则改为拦截中国 AI 爬虫吧，IP 不要全部封禁」。

改完之后，中国大陆的人照常能打开 cantonlock.com，国内同事不用开 VPN，微信里转发的链接也能正常预览。字节、百度、阿里、搜狗、360、华为、智谱的爬虫照样被拦。服务器上 nginx 那道拦截也是按爬虫名字拦的，本来就没有封 IP，不用改。

大约 3 分钟。

## 步骤

1. 登录 Cloudflare，点进 **cantonlock.com**。
2. 左侧点 **Security（安全性）→ Security rules（安全规则）**（旧界面是 **WAF → Custom rules**）。
3. 在列表里找到 `Block CN and CN crawlers`，点右边的 **Edit（编辑）**。
4. **Rule name（规则名称）** 改成：`Block CN AI crawlers`
5. 点 **Edit expression（编辑表达式）**，把原来的内容**全部删掉**，粘贴下面这段：

```
(lower(http.user_agent) contains "bytespider") or (lower(http.user_agent) contains "tiktokspider") or (lower(http.user_agent) contains "baiduspider") or (lower(http.user_agent) contains "yisouspider") or (lower(http.user_agent) contains "sogou") or (lower(http.user_agent) contains "360spider") or (lower(http.user_agent) contains "haosouspider") or (lower(http.user_agent) contains "petalbot") or (lower(http.user_agent) contains "chatglm-spider")
```

   和原来相比，只是删掉了开头的 `(ip.src.country eq "CN") or`。

6. 操作仍然选 **Block（阻止）**，点 **Save（保存）**。

**成功的样子：** 列表里规则名变成 `Block CN AI crawlers`，状态是开启。在国内不开 VPN 打开 cantonlock.com，能正常显示网页，而不是 Cloudflare 的拦截页。

**如果保存时报错：** 截图发我，不要改别的地方。
