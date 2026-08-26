# cantonlock.com 上线与回滚手册

> 2026-08-26 从时代虚拟主机迁到腾讯云法兰克福 `43.131.27.225`。
> 本文的第一用途是**出事时照着回滚**，第二用途是让 Codex 了解现状。

## ⚠️ 回滚路径已于 2026-08-26 失效

甲方已在时代虚拟主机上**移除了老站**。实测  现返回 404。
**把 DNS 改回去已经没有意义**——那边没有站点在服务了。

出问题只能往前修，不能退回。下面的原回滚方案仅作历史记录保留。

### 现在真正的止损手段

1. **配置层面**：服务器上每次改动都留了 ，
    等。
    回去再  即可。
2. **内容层面**： 后跑一次
   。
3. **整站层面**：预览站  仍在同机运行，
   内容一致，可临时把 DNS 指过去应急。

## ~~一键回滚（已失效，见上）~~

老站在时代虚拟主机上**原封未动**。把 DNS 改回去即可：

| 主机记录 | 类型 | 改回 |
|---|---|---|
| `@` | A | `107.150.107.47` |
| `www` | A | `107.150.107.47` |

操作位置：`dns.now.cn` → 域名管理 → `cantonlock.com` → 解析记录。TTL 600，约 10 分钟。

**老站建议保留至少 1–2 周**再考虑清理。

## 当前状态（2026-08-26 切换后）

| 项 | 状态 |
|---|---|
| DNS | ✅ `cantonlock.com` / `www` 均已指向 `43.131.27.225` |
| HTTP (80) | ✅ 两个域名均返回 200 |
| **HTTPS (443)** | ❌ **未配置，见下方「已知问题」** |
| 自动拉取 | ✅ 系统 crontab，5 分钟，带护栏 |
| 缓存头 | ✅ 三段策略，无重复头 |

## 已知问题：HTTPS 尚未可用

**现象**：浏览器访问 `https://www.cantonlock.com` 报
`NET::ERR_CERT_AUTHORITY_INVALID`，点继续后是 nginx 的 `404 Not Found`。

**根因**：`/www/server/panel/vhost/nginx/cantonlock.com.conf` 只有

```
listen 80;
listen [::]:80;
```

没有 `listen 443`，也没有 `ssl_certificate`。于是 443 上的请求匹配不到本站的
server 块，被 nginx 交给了 443 上的第一个 server（另一个站点），
因而返回那个站的证书和它的 404。

**这不是站点坏了**——HTTP 完全正常，纯粹是缺证书。

**解法**：在宝塔面板申请 Let's Encrypt（见下节）。申请成功后宝塔会自动
往该 conf 写入 `listen 443` 与证书路径。

## 我在这次部署中犯的两个错误（已修复，记录备查）

### 1. 用管道写 crontab，误删腾讯云监控条目

```bash
# 错误写法：管道里的单引号被吃掉，整条没写进去，且覆盖了原有内容
( crontab -l | grep -v xxx ; echo '*/5 * * * * ...' ) | crontab -
```

结果 `*/5 * * * * flock -xn /tmp/stargate.lock ...`（腾讯云 stargate 监控）
被从 crontab 里抹掉。已用 `crontab <file>` 方式重建恢复。
stargate 进程全程在运行，**未造成监控中断**。

**教训：改 crontab 一律用 `crontab <file>`，不要用管道。**

### 2. 在没有证书的站点上发了 HSTS

缓存配置里三段都写了 `Strict-Transport-Security "max-age=31536000"`，
但当时站点根本没有 HTTPS。HSTS 的语义是「此域名今后一律走 HTTPS」，
一旦被浏览器记住，而证书又无效，访客将**无法回退到可用的 HTTP**。

实际风险有限（浏览器只在**有效**的 HTTPS 连接上接受 HSTS，
无效证书下不会记录），但这仍是错误配置。已从
`extension/cantonlock.com/cache.conf` 移除，备份在同目录 `.bak`。

**HSTS 必须等证书就绪、HTTPS 稳定后再加回。**

## SSL 申请步骤（甲方在宝塔面板操作）

```
宝塔面板 → 网站 → cantonlock.com → 设置 → SSL
  → 选「Let's Encrypt」
  → 勾选 cantonlock.com 和 www.cantonlock.com 两个域名
  → 申请
  → 成功后再打开「强制 HTTPS」
```

前提：DNS 已生效（已满足，两个域名都解析到本机）。

申请成功后需要复核：

1. `grep listen /www/server/panel/vhost/nginx/cantonlock.com.conf` 应出现 `443`
2. `curl -sI https://cantonlock.com/` 返回 200 且证书有效
3. 确认 `www` 与裸域都可用
4. 之后才把 HSTS 加回 `cache.conf`

## 服务器上与本站相关的文件

```
/www/wwwroot/cantonlock.com/              仓库浅克隆，nginx root 指向其 out/
/www/server/panel/vhost/nginx/cantonlock.com.conf          宝塔生成的站点配置
/www/server/panel/vhost/nginx/extension/cantonlock.com/cache.conf   缓存策略（我写的）
/usr/local/bin/cantonlock-deploy.sh        自动拉取脚本（带护栏）
/var/log/cantonlock-deploy.log             拉取日志
crontab: */5 * * * * ... cantonlock-deploy.sh
```

**同机另外两个站（`stahlock.com`、`spoonercantonlock.stahlock.com`）
的配置与目录全程未改动。**
