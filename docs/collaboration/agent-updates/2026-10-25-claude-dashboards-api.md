# Claude · 2026-10-25 · 四个看板改用 API 拉数

- **起因：** 甲方发来 Bing Webmaster API Key，问「GSC、Clarity、GA4 的 API 怎么调用」。
- **新增 `scripts/fetch-dashboards-api.mjs`（`npm run dashboards:api`），不依赖任何第三方包：**
  - **Bing**：用 apikey，拉 GetQueryStats、GetPageStats、GetRankAndTrafficStats、GetCrawlStats、GetCrawlIssues；
  - **GSC**：用服务账号，在脚本里用 node:crypto 签 RS256 JWT 换取 token；按 query、page、country、date、query+page 拉 searchAnalytics，时间窗为 30 天前到 3 天前；默认先试 `sc-domain:cantonlock.com`，返回 403/404 时改试 URL 前缀属性；
  - **GA4**：Data API runReport，近 28 天，按 渠道、来源、国家、语言、着陆页、事件、日期 七个维度出报表；
  - **Clarity**：用 Data Export 令牌拉 project-live-insights，近 3 天，共 3 次请求（每天上限 10 次）。
  - 输出到 `docs/research/analytics/<日期>/api/*.json` 和 `API-SUMMARY.md`。缺凭据的看板跳过并提示变量名；单个看板出错不影响其他看板。日志里的密钥打码。`--dry-run` 只打印将要发出的请求。
- **凭据放法：** 只放在 johns 机器仓库根目录的 `.env.local`（已被 git 忽略）。`.env.example` 里只加了占位变量。
- **云端无法实测：** 代理拦截了 ssl.bing.com，Google 和 Clarity 的接口也连不上。已验证的部分：dry-run 输出、缺凭据时的跳过、JWT 签名（离线生成密钥自签自验）、eslint。第一次真实运行由甲方在 johns 机器上完成。
- **安全：** 甲方把 Bing Key 发在了聊天里。交接文档建议先确认能用，再到 Bing 后台重新生成，新 Key 只写进 `.env.local`。会话不得把 Key 写进任何仓库文件。
- **交接：** `docs/collaboration/2026-10-25-手动操作-看板API开通.md`（Word 版已发给甲方），runbook 顶部已加指引，`DATA-DASHBOARDS.md` 补了用法和限制。
- **下一步：** 甲方跑通后，可以把 `build-analytics-report.mjs` / `build-weekly-kpis.mjs` 改成也能读取 `api/*.json`，周报就不再需要导出 CSV。
