# cantonlock.com 正式站部署到腾讯云（等 DNS 切换）

- **Agent**：Claude
- **Commit**：与本 update 相同的提交
- **目标**：把正式域名从时代虚拟主机迁到现有腾讯云法兰克福服务器，与
  `stahlock.com`、`spoonercantonlock.stahlock.com` 共用一台。

## 为什么不买新服务器

甲方原本打算另买一台弗吉尼亚服务器优化南美延迟。实测后否掉了：

| 路径 | 实测 RTT |
|---|---|
| 法兰克福 → 巴西圣保罗 | **209 ms** |
| 法兰克福 → 阿根廷 | 约 220–240 ms（对端封 ICMP，按距离推算） |

HTTPS 首字节约 4 个 RTT ≈ 840 ms。换弗吉尼亚能降到约 480 ms，
但**牺牲欧洲**且每月多 60 元；而 Cloudflare CDN 在圣保罗/布宜诺斯艾利斯都有节点，
可降到约 80 ms，免费且欧洲不受损。

现服务器余量充足：磁盘 60 GB 用 40%（剩 37 GB）、内存 3.6 GB 可用 2.5 GB、
已装 Docker 29.7.2、nginx 1.26.3。

## 已完成（服务器侧）

1. `/www/wwwroot/cantonlock.com` — `git clone --depth 1`，HEAD `3b809c9`，属主 `www:www`
2. 站点由甲方在宝塔面板创建，`server_name cantonlock.com www.cantonlock.com`，
   root 指向 **`/www/wwwroot/cantonlock.com/out`**（注意是 `out/` 子目录，不是仓库根）
3. `extension/cantonlock.com/cache.conf` — 三段缓存策略。
   **只用 `add_header`，不用 `expires`**：两者同时存在会各发一个 `Cache-Control`，
   浏览器通常取第一个，`stale-while-revalidate` 就白写了（预览站踩过这个坑）。
   每段都重复声明 HSTS，因为子 location 一旦有 `add_header` 就会丢掉父级安全头。
4. `/usr/local/bin/cantonlock-deploy.sh` + 系统 crontab，5 分钟一次，
   **带护栏**：仅当 `HEAD != origin/main` 时才 `reset --hard` + `chown`，
   避免预览站出现过的「chown 导致全量 stat-dirty → 每轮重写全部文件 → ETag 恒变」循环。

## 验证（curl 带 Host 头，不依赖 DNS）

首页 200 / 85789 bytes；`/products/` `/product-finder/` `/company/` `/downloads/`
`/admin/` `/llms.txt` `/robots.txt` `/sitemap.xml` 全部 200；
WebP 返回单条 `public, max-age=86400, stale-while-revalidate=3600`。

## 我在过程中造成并修复的一次问题

用 `crontab -` 管道写入时，**误删了腾讯云 stargate 监控的定时条目**
（`*/5 * * * * flock -xn /tmp/stargate.lock ...`），且自己的条目也没写进去。
已用文件方式重建 crontab 恢复。stargate 进程全程在运行，未造成监控中断。
**教训：改 crontab 用 `crontab <file>`，不要用管道，管道里的引号会被吃掉。**

## 明确未修改

- `stahlock.com` 与 `spoonercantonlock.stahlock.com` 的配置、目录、部署任务，一律未动
- 现有 DNS 记录全部未动（切换由甲方在时代互联操作）

## 待办与风险

- **DNS 未切换**。`cantonlock.com` 仍解析到时代虚拟主机 `107.150.107.47`，
  老站照常服务。甲方改 `@` 与 `www` 两条 A 记录到 `43.131.27.225` 即完成切换。
- **SSL 未申请**。Let's Encrypt 需要域名先解析过来才能验证，切换后在宝塔面板一键申请。
- ⚠️ **该域名挂着网易企业邮箱**（MX ×2、SPF、DMARC、`mail` CNAME）。
  今晚只改 A 记录不受影响；**将来若改 NS 到 Cloudflare，这些记录必须逐条重建，
  漏一条公司邮箱立刻收不到信**。切 NS 前须先做记录对照表。

## 建议 Codex 下一步协助或复核

DNS 切换生效后，用你配好的 Chrome DevTools MCP 对 `cantonlock.com` 做一次冷加载
trace，与 `spoonercantonlock.stahlock.com` 对比 LCP 与缓存命中，验证这套缓存配置。
