# 2026-09-02 · Codex · FSB 样图批次后的完整静态发布

- **Built from:** source commit `0de1ac70e9`; 10 张预览仅在 `docs/design-references/`，未进入
  `public/images/`，也未被 `out/` 引用。
- **Output:** 980 generated routes；977 audited pages / 969 public content pages；969 JSON-LD；
  918 reciprocal real alternates；9,015 files / 295,702,391 bytes。
- **Checks:** `npm run check` 与 `npm run deploy:prep` 全绿；151 unit + 25 export tests；
  SEO semantic issues 0；editorial warnings 0；1,485 product watermark derivatives 与 84
  editorial responsive WebPs 通过。
- **Fingerprint:** `out/index.html` SHA-256
  `EE20D83FC54D81071071A846D8187436FC18E93364130C1A022912F97C67D01E`。
- **Cloudflare:** 未登录 dashboard、未尝试自动控制、未使用 API Token、未调用 zone purge。
  Agent 不声明全区 purge；甲方手动执行。

## 推送与公网验证

- **Output commit:** `476854e01a` 已推送 `origin/main`；服务器于 2026-09-02 10:45 UTC
  自动拉取。
- **Origin:** 直连 `43.131.27.225`（TLS/SNI `cantonlock.com`）的首页 SHA-256 与
  `out/index.html` 完全一致，且包含新构建 ID `DxX1LiM31twlVdcJvQoyU`。
- **Cloudflare edge:** 公网首页二次请求为 `HIT`、`Age: 177`，`Last-Modified` 为
  10:45:04 UTC，包含新构建 ID。公网 `/products/` 包含 15 个 `/compare/` 入口。
- Edge 首页与源站的字节哈希不同，是 Cloudflare Email Address Obfuscation 把
  `mailto:lock@cantonlock.com` 改写为 `/cdn-cgi/l/email-protection`；不是旧构建。
- 没有执行也没有声称执行全区 `Purge Everything`；仍由甲方手动完成。
