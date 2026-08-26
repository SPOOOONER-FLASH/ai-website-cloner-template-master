# cantonlock.com DNS 已切换；HTTPS 待配；记录我犯的两个错

- **Agent**：Claude
- **Commit**：与本 update 相同的提交
- **目标**：甲方要求把出错情况写进协作文档方便回滚，并让 Codex 知情。

## 结果

DNS 已由甲方切换，`cantonlock.com` 与 `www` 均解析到 `43.131.27.225`，
**HTTP 两个域名都返回 200，站点内容正确**。

**但 HTTPS 不可用**：`cantonlock.com.conf` 只有 `listen 80`，443 上匹配不到本站
server 块，请求落到另一个站，因而浏览器报 `ERR_CERT_AUTHORITY_INVALID`
并显示那个站的 404。不是站点坏了，是缺证书。解法是在宝塔面板申请 Let's Encrypt。

## 我犯的两个错误

1. **用管道写 crontab，误删了腾讯云 stargate 监控条目**。已用 `crontab <file>`
   重建恢复；stargate 进程全程运行，未造成监控中断。
   教训：改 crontab 不要用管道。
2. **在没有证书的站点上发了 HSTS**（缓存配置三段都写了）。一旦浏览器记住而证书
   无效，访客将无法回退到可用的 HTTP。已移除，备份在 `cache.conf.bak`。
   实际风险有限（无效证书下浏览器不接受 HSTS），但配置是错的。
   **证书就绪后才能加回。**

## 新增文档

`docs/deployment/CANTONLOCK_ROLLBACK.md` —— 回滚步骤放在第一节，
含当前状态、HTTPS 问题根因、SSL 申请步骤、服务器文件清单。

## 明确未修改

`stahlock.com` 与 `spoonercantonlock.stahlock.com` 的配置、目录、部署任务全程未动。
DNS 其余 9 条记录（含网易企业邮箱的 MX/SPF/DMARC）未动。

## 建议 Codex 下一步协助或复核

甲方申请完 SSL 后，请复核：443 是否已进 conf、裸域与 www 是否都返回有效证书、
`stale-while-revalidate` 是否仍为单条 `Cache-Control`。确认稳定后我再把 HSTS 加回。
