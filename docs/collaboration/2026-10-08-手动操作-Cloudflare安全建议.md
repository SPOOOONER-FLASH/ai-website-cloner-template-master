# Cloudflare 安全页四条建议怎么处理（2026-10-08）

**这份 Word 由仓库里的同名 markdown 生成，改内容请告诉我，不要直接改 Word。**

## 先说结论

- **第三步（AI 搜索爬虫有没有被拦）你 10-08 查过了：没有被拦。** 不用再做。
- 安全事件里那几条 Block **都是拦对了**：比利时那条在找 `/wp-config.php.bak`（WordPress 密码文件，我们不是 WordPress），台湾那几条是 React 远程执行漏洞的探测（CVE-2025-55182）。两个来源 IP 都是 Google 云上的租用服务器，不是 Google 搜索爬虫。巴西那条是 2010 年版本的 Opera 浏览器标识在批量抓 PDF，也是机器人。**没有真买家被拦。**
- 下面四条建议：**两条别开，两条点「归档」就行。**

| 建议 | 怎么处理 | 为什么 |
|---|---|---|
| Detect and mitigate automated traffic with **Bot Fight Mode** | **不要开**，点归档 | 09-25 实测过：它会给 Google 自己的检测工具出质询页（GTM「Test」一直报未检测到就是它）。AI 搜索爬虫、各种 SEO 验证工具也可能被挡。我们要的是被抓取，不是被保护起来 |
| Disrupt unwanted AI crawlers with **AI Labyrinth** | **不要开**，点归档 | 它会把 AI 爬虫引进假页面迷宫。我们的周报显示 ChatGPT 是质量最高的流量来源，AI 引用是增长最快的渠道，开了等于自己关门 |
| Unproxied CNAME Record detected | 先截图发我（DNS 页里那条记录） | 要看是哪条。如果是邮件、验证用的子域名，不走代理是对的；如果指向网站服务器，可能暴露源站 IP。看到记录名我才能判断，**先别改** |
| Configure your website's **Security.txt** | 点归档 | 我们已经有了：`https://cantonlock.com/.well-known/security.txt` 10-08 实测 200。Cloudflare 只是不知道我们自己放了一份 |

## 怎么点「归档」

1. Cloudflare → cantonlock.com → **Security** → **Overview（Security Overview）**。
2. 在「Security action items」里，找到要归档的那一行，点行右侧的 **文件夹图标**（Review 按钮左边那个）。
3. **成功的样子**：这一行从列表里消失，右上角 **Archived** 里能找到它。
4. 点错了：去 **Archived** 里把它拿回来，不会改动任何设置。

归档只是「我看过了、不处理」，**不会改网站的任何设置**。

## Unproxied CNAME 怎么截图

1. 点那一条的 **Review**，看它说的是哪个记录名（形如 `xxx.cantonlock.com`）。
2. 或者左栏 **DNS** → **Records**，找「Proxy status」显示**灰色云朵（DNS only）**、类型是 **CNAME** 的那一行。
3. 截图发我，**只截记录名、类型、目标和云朵颜色**，不用截别的。
