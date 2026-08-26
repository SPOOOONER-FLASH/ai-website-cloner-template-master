# cantonlock.com HTTPS 已上线

- **Agent**：Claude
- **Commit**：与本 update 相同的提交

## 结果

正式站已完整上线，全部实测通过：

| 项 | 结果 |
|---|---|
| `https://cantonlock.com` | 200 |
| `https://www.cantonlock.com` | 200 |
| 证书链 | `Verify return code: 0 (ok)` |
| ALPN | **h2**（HTTP/2 已启用） |
| TLS | 1.3 |
| HTTP → HTTPS | 301 |
| HSTS | `max-age=31536000` |
| 缓存头 | HTML 300s / 图片 86400s，均单条 |

## 用的是甲方已购的商业证书

Sectigo DV，SAN 含 `www.cantonlock.com` 与 `cantonlock.com` **两个域名**
（时代后台只显示 www，实际证书两个都覆盖——我一开始据后台显示判断只覆盖 www，是错的）。

证书与私钥在本地和服务器两侧都做了 modulus 比对，确认匹配。
私钥经 stdin 传输，未出现在命令行或日志中，服务器上权限 600。

## ⚠️ 三个必须跟进的风险

### 1. 私钥已泄露

甲方曾把该私钥的完整内容截图发出。**这把私钥必须视为已泄露**，
任何持有者都能冒充本站。建议向 Sectigo 申请 Reissue（通常免费，会换新私钥），
或直接改用 Let's Encrypt。

### 2. 证书 2026-12-14 到期，且已开启 HSTS

有效期 2025-11-13 → **2026-12-14**，从今天算只剩约 3.5 个月。
时代后台显示的 2029 是订单期限，不是证书有效期。

**HSTS 让这件事变得更严重**：`max-age=31536000` 即一年，浏览器会记住
「此域名只能走 HTTPS」。**证书一旦过期而未续，访客既无法用 HTTPS
（证书失效）也无法回退 HTTP（HSTS 禁止）——网站将完全打不开。**

**强烈建议在到期前改用 Let's Encrypt 自动续期**，宝塔面板可一键申请。

### 3. 回滚路径已失效

甲方已在时代虚拟主机移除老站，`107.150.107.47` 现返回 404。
改回 DNS 已无意义。`CANTONLOCK_ROLLBACK.md` 已相应改写，
给出配置层 `.bak`、内容层 git reset、整站层临时指向预览站三种止损手段。

## 再次确认了 add_header 继承边界这个坑

在 server 级加了 HSTS 之后，实测 HTML 响应里**没有** HSTS 头——
因为 `cache.conf` 里的 location 有自己的 `add_header`，父级安全头被整体丢弃。
解法是在每个 location 内重复声明。runbook §4 记过这一条，这次是实证。

## 明确未修改

`stahlock.com` 与 `spoonercantonlock.stahlock.com` 的配置、证书、目录全程未动。

## 建议 Codex 下一步协助或复核

现在 HTTPS + HTTP/2 都就位了，可以用 Chrome DevTools MCP 做一次冷加载 trace，
拿到真实的 LCP/CLS 基线。这是第一次具备可比条件——之前没有 HTTP/2。
