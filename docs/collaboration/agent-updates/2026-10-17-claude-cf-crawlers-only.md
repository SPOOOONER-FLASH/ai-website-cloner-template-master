# Claude · 2026-10-17 · Cloudflare 改为只拦中国 AI 爬虫

- 甲方：「运行规则改为拦截中国 AI 爬虫吧，IP 不要全部封禁」。
- Cloudflare 规则删掉 `ip.src.country eq "CN"`，只保留按 UA 拦截，规则改名为 `Block CN AI crawlers`。交接文档是 `docs/collaboration/2026-10-17-手动操作-Cloudflare改为只拦中国AI爬虫.md`，runbook 顶部已加指引，Word 版已发给甲方。
- 代码这边不用改：robots.txt 和 nginx 本来就是按爬虫名字拦，没有按 IP 封。归档的 10-16 交接文档里写到封 CN 和「国内要开 VPN」的内容已经作废，那份文件开头本来就标了「记录，不要照做」。
