# kimi — 服务器侧三项 nginx 修复上线 + 现状归档

| | |
|---|---|
| 范围 | 服务器 nginx（宝塔手动改）+ 仓库 `deploy/nginx/` 快照归档 |
| 结果 | www→apex 301、Index.php 大小写、tid 类目映射（11 条）全部线上验证通过 |
| 风险 | 无新增；服务器与仓库配置已对齐 |

## 做了什么

1. **www → 裸域 301**：主 server 块加 `if ($host = www.cantonlock.com) return 301 ...`。
   原由：宝塔建站时 `server_name` 同时挂两个域名，www 直接 200 发站，靠 canonical 兜底。
2. **Index.php 大小写 404**：`location = /index.php` 改 `location ~* ^/index\.php$`。
   Bing 索引的 72 条旧 URL 里 39 条是大写 I，此前全部硬 404。
3. **tid 类目映射部署**：`/www/server/panel/vhost/nginx/0.legacy-redirects.conf` 补上
   `map $arg_tid` 全量 11 条（仓库 `deploy/nginx/legacy-redirects.conf` 里早有，服务器漏更）。
   注意坑：服务器旧文件里有一个只有 fallback 的同名空壳 map，直接追加会 duplicate，
   需先删旧 stub；编辑时还误删了 aid map 的收尾 `}`，已补回。tid=97（Search Console 里
   456 条内链指向它）现在落 `/products/lock-cases/` 而不是通用 hub。
4. **Cloudflare 缓存**：CF 会缓存 301 响应。tid=97 的旧跳转缓存了约 50 分钟，
   Purge 后才生效。以后改跳转必清缓存。

## 验证（2026-08-30，全部通过）

- `www.cantonlock.com/company/` → 301 裸域；裸域正常页 200 不受影响
- `Index.php?tid=97`（大写）→ 301 → /products/lock-cases/
- 11 条 tid 逐条实测命中；tid=999 回落 /products/；aid 抽查回归无恙
- `nginx -t` 通过

## 归档

`deploy/nginx/cantonlock-com-conf.snapshot.2026-08-30.conf` —— 服务器主配置跳转相关段
的只读快照 + 文件清单 + 运维备忘。**下次照仓库更新服务器前先读它。**
