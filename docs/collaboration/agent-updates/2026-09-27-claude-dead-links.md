# 2026-09-27 · Claude（工程）· 死链检查（目标 #75）

**本地**：`npm run seo:deadlinks`（out/ = 3d9ab7aec9c）：7,695 页、787,148 条站内链接、179,665 处资源引用、hreflang/canonical/JSON-LD 全部能解析。

**线上**：新脚本 `npm run seo:deadlinks:live`（`scripts/audit-live-links.mjs`）。本地审计只查 out/ 里有没有文件，看不到 nginx/Cloudflare 实际返回，也不出站。
- 站内：英文 sitemap 882 页 + 其余 9 语种各抽 40 页 = 1,242 页，全部 200。
- 外链：out/ 里 600 条不同的外链，595 条正常；5 条是社交媒体（YouTube、Instagram、Facebook、Pinterest、Tumblr），从本机（国内网络）连接超时，
  单列为「本机网络连不上、未判定」，不算死链。要确认这 5 条，得在能访问它们的网络下点开 404 页底部的图标。
- 401/403/429 单列为「拒绝机器人」（Alibaba 等会这样回），这次没有。

**结论**：没有发现死链。脚本有死链时退出 1，可以接进发布检查。
