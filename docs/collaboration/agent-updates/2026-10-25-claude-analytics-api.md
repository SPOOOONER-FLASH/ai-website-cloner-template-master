# 2026-10-25 · Claude · 数据看板接 API

- 甲方给了 Bing Webmaster API Key，问 GSC / Clarity / GA4 怎么调用。
- 新增 `scripts/pull-analytics-api.mjs`，不装新依赖：
  - **Bing**：用 API Key，拉 GetQueryStats、PageStats、RankAndTrafficStats、CrawlStats、CrawlIssues。
  - **GSC**：`searchAnalytics.query`，按 query、page、date、country、query+page 拉。
  - **GA4**：Data API `runReport`，拉落地页、来源、国家、事件。
  - **Clarity**：`project-live-insights`，只能拉最近 3 天，每天 10 次。
  - GSC 和 GA4 用服务账号，RS256 JWT 由 `node:crypto` 签名。缺凭据的来源自动跳过。
- **凭据**：只放本机 `.env.local`（已在 .gitignore）和仓库外的 `E:\hyde-keys\`，不进 git。仓库中 grep 不到 key。
- **首次实拉（Bing）**：`docs/research/analytics/2026-10-25/raw/api/`。
  - 数据覆盖 77 天，到 10-23。
  - 近 7 天展示 1,410、点击 23；前 7 天展示 910、点击 15。
- **交接**：`docs/collaboration/2026-10-25-手动操作-数据看板API凭据.md`（桌面 00）。
- **下一步**：甲方发服务账号文件名、GA4 媒体资源 ID、Clarity 令牌后，写入 `.env.local` 并跑全量；再把 `build-analytics-report.mjs` 接上 API 输出。
