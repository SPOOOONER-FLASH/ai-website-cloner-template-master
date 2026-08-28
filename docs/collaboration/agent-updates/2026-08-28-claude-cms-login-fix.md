# CMS 远程登录修复 — Claude — 2026-08-28

**结果**：同事的 Mac 已能正常登录 `https://www.cantonlock.com/admin/`，产品列表加载正常。

**根因**：两层，不是一层。
1. 换域名后 Worker 的 `ALLOWED_DOMAINS` 是旧值 → Worker 拒绝，返回 HTTP 200、
   1504 字节、可见文字为零（全在 `<script>` 里），浏览器渲染成纯白 ≈ about:blank。
2. `*.workers.dev` 在那台 Mac 的网络下不可达（Edge 报 `ERR_TIMED_OUT`）。
   已迁到 `auth.cantonlock.com`（Worker 自定义域，与主站同 zone）。

**同源约束**（改一处必须改三处，否则登录直接断）：
Worker `ALLOWED_DOMAINS` · `public/admin/config.yml` 的 `base_url` · GitHub OAuth App callback。

**改动**：`public/admin/config.yml` 的 `base_url`（提交 `323f5c761`）+ 本次 HANDOFF 第九节踩坑记录。

**没碰**：`out/`（当前脏，约 2350 文件，是我跑 `npm run check` 的构建产物，
多为 build hash churn）。发布构建的一方请按需 `git checkout -- out/` 或并入下次发布。
`src/**`、`content/**` 一律未动。

**测试**：`npm run check` 通过（481 页 / 476 带 JSON-LD / 0 语义问题 / 测试全过）。
线上 `config.yml` 已核对与仓库逐字节一致。

**下一步可接力**：把 `workers.dev` 的 callback 作为备用地址加回 GitHub OAuth App，
这样任一入口不可达时还有退路。
