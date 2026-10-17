# Claude · 2026-10-17 · Cloudflare 改为只拦中国 AI 爬虫

- 甲方：「运行规则改为拦截中国 AI 爬虫吧，IP 不要全部封禁」。
- Cloudflare 规则删掉 `ip.src.country eq "CN"`，只保留按 UA 拦截，规则改名为 `Block CN AI crawlers`。交接文档是 `docs/collaboration/2026-10-17-手动操作-Cloudflare改为只拦中国AI爬虫.md`，runbook 顶部已加指引，Word 版已发给甲方。
- 代码这边不用改：robots.txt 和 nginx 本来就是按爬虫名字拦，没有按 IP 封。归档的 10-16 交接文档里写到封 CN 和「国内要开 VPN」的内容已经作废，那份文件开头本来就标了「记录，不要照做」。

## 补充：加拦 GLM、DeepSeek、Kimi（甲方：「还有 kimi GLM deepseek，所有中国 AI 都拦截」）

- `BLOCKED_CRAWLERS` 和 nginx 正则新增 DeepSeekBot、KimiBot、Kimi-SearchBot、Kimi-User。GLM 原来已经有 ChatGLM-Spider。Cloudflare 表达式改为按包含 `chatglm`、`deepseek`、`kimi` 匹配，范围更宽。
- 这些名字来自第三方爬虫目录，各公司官方没有公开说明。另据报道 Kimi 会伪装成普通浏览器，按名字拦不住。如果要拦得更彻底，下一步是按云服务商的网段（ASN）拦，需要逐个核对网段编号，等甲方同意后再做。
- `npm test` 494 项全过，tsc 和 eslint 也通过。生效时间：robots.txt 和 nginx 随下次 HYDE 发布生效，Cloudflare 那部分等甲方手动改。

## 补充 2：拦截所有中国爬虫（甲方：「还有腾讯元宝、WorkBuddy……能不能把中国全部爬虫都禁止了」）

Cloudflare 规则改为三层，统一叫 `Block CN crawlers`：
1. 按爬虫名字拦，不分国家，新增了 tencent、yuanbao、hunyuan 三个名字。这三个没有公开的官方说明，只在 Cloudflare 生效，robots 和 nginx 不加。
2. 来自中国 IP、且请求自称 spider / bot / crawl，或是 Python、Scrapy、Go、无头浏览器的，拦。
3. 来自中国大厂机房网段（ASN）的请求，拦。已核实的网段：腾讯 45090、132203、133478，阿里 37963、45102，华为云 136907，百度 38365；字节没查到可靠的网段编号，没有加。
   - Cloudflare 认证过的正规爬虫（`cf.client.bot`）在第 2、3 层都放行。

已写进交接文档的代价：
- 服务器是 OpenCloudOS（腾讯云），如果服务器上的任务通过 Cloudflare 访问自己的网站，会被拦；
- 微信里转发网站链接时，预览卡片可能出不来；
- 第 2 层用 `contains "bot"` 匹配，User-Agent 里带 CUBOT 的国产手机也会被误伤，量很小，已接受。
