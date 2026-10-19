# Claude · 2026-10-16 · cantonlock.com 屏蔽中国 IP 与中国 AI 爬虫

**甲方原话：**「给 cantonlock 建立一个防止中国 AI 爬取的限制……不允许中国 IP 分析拆解 seo geo sxo aeo aio」。

## 改了什么

- `src/lib/seo-policy.ts` 新增 `BLOCKED_CRAWLERS`：Bytespider、TikTokSpider、Baiduspider、YisouSpider、Sogou web spider、360Spider、HaosouSpider、PetalBot、ChatGLM-Spider。每个都生成 robots.txt 里的 `Disallow: /`。`ASSISTANT_CRAWLERS`（GPTBot、ClaudeBot 等）保持不变。RAYEN 的 robots.txt 由 `build-rayen-site.mjs` 单独生成，不受影响。
- `deploy/nginx/20-block-cn-crawlers.conf`：同一份名单，再加 Scrapy、python-requests、python-urllib、aiohttp、Go-http-client，命中返回 403。故意放行 curl、node、HeadlessChrome，因为我们自己的部署验证和审计脚本要用。
- `deploy/install-nginx-redirects.sh`：安装上面这个文件，包括备份、首次安装失败时删除新文件回滚；在源站验证 3 个被拦 UA 返回 403、浏览器和 GPTBot、ClaudeBot 返回 200。
- `src/lib/seo-policy.test.ts`：检查名单里每个名字都在 robots 里是 `Disallow: /`，nginx 正则也包含它，而且 nginx 不会误拦 GPTBot、ClaudeBot、PerplexityBot、Googlebot、bingbot、curl、node。
- 交接文档 `docs/collaboration/2026-10-16-手动操作-屏蔽中国AI爬虫.md`（Word 版已发给甲方），runbook 顶部加了一条指引。

## 关键判断

- **主防线是 Cloudflare WAF**（甲方手动操作）：`ip.src.country eq "CN"` 加上 UA 关键词，动作 Block。原因：Cloudflare 缓存命中的请求不会到 nginx；Bytespider 不遵守 robots。
- **明确告诉甲方不要开 Cloudflare 的「Block AI bots」一键开关**，它会连 GPTBot、ClaudeBot、PerplexityBot 一起拦，GEO 就白做了。
- 风险已写进文档：国内同事不开 VPN 打不开官网和 `/admin/`（可选按固定 IP 放行）；香港没有拦；VPN 加伪装 UA 的人挡不住；页面结构本来就公开。

## 待办

- 本分支合并进 main 并做 HYDE 发布后，robots.txt 才生效；之后通知甲方在服务器跑 `install-nginx-redirects.sh`。这一步由持 HYDE 发布棒的会话负责。
- 本会话所在的云端环境访问线上站点返回 403（代理），没能核对线上 robots.txt 和 Cloudflare 的现状。甲方发截图后再核对。

## 补充：SEO 审计按组解析 robots

- `scripts/lib/seo-audit.mjs` 的 `parseRobots()` 原来把任何一行 `Disallow: /` 都当成整站封禁，加上中国爬虫的分组后，`test:export` 把整站报成了 staging。现在只看 `*` 组；`scripts/seo-audit.test.mjs` 加了对应用例。
- `npm run check` 全绿。
