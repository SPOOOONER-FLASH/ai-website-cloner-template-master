# kimi — CMS 暴露 technicalEmail 字段 + tid 映射待部署提醒

| | |
|---|---|
| 范围 | `public/admin/config.yml`（+out/admin/config.yml 构建产物） |
| 结果 | 构建通过；114 项测试全绿 |
| 风险 | 无（表单新增一个可空字段） |

## 背景

cc 建好、值留空的联系邮箱机制（`content/site-settings.json` 的 `contact.email` / `contact.technicalEmail`）
在 CMS 表单里只能填 `email`——config.yml 的「联系方式」对象没有声明 `technicalEmail`。
Decap 保存时只写已声明字段，不声明就没法在 CMS 里填。

## 改动

`public/admin/config.yml` 基础设置 → 联系方式 增加：

- `email` 加 hint（页脚 + JSON-LD sales contactPoint）
- 新增 `technicalEmail`（产品页询价按钮下方 + JSON-LD technical contactPoint，留空回落到 email）

## 服务器侧待办（不在本提交内）

1. **tid 映射未部署**：仓库 `deploy/nginx/legacy-redirects.conf` 里的 `map $arg_tid` 段
   （11 条类目映射，含 tid=97 → /products/lock-cases/，456 条内链）还没进服务器的
   `/www/server/panel/vhost/nginx/extension/cantonlock.com/0.legacy-redirects.conf`。
   当前线上 tid=97 仍落 /products/ 通用 hub。
2. **2026-08-30 nginx 改动未入档**：www→apex 301（`if ($host = www.cantonlock.com)` 块）和
   `location = /index.php` 改 `location ~* ^/index\.php$` 是直接改在宝塔里的，
   仓库 `deploy/nginx/` 没有对应文件，下次照仓库覆盖服务器配置时会丢。
