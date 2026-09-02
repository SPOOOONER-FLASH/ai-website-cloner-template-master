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

公网 origin/edge 验证在 output commit 推送并由服务器拉取后单独记录。
