# Codex — `/status/` 元数据边界

- Agent: Codex
- Scope: 内部 `/status/` 页面不再继承公开首页的 canonical、hreflang、Open Graph 与 Twitter 元数据；保留 `noindex, nofollow`。
- Tests: `npm run typecheck` 通过；完整静态导出与 SEO 审计由本次 release build 验证。
- Untouched: Claude 的 IndexNow、Clarity、站点数据与 SEO policy 逻辑未改动。
- Risk: 仅影响内部状态页 `<head>`；公开页面元数据不变。
- Next assist/review: 复核重新导出的 `/status/index.html` 不含 canonical/alternate/OG/Twitter，并运行 `npm run test:export`。
