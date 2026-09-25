# Cloudflare Security Insights 与 AI 抓取报告（Claude 工程，2026-09-25）

- **security.txt**：新增 public/.well-known/security.txt（RFC 9116，Contact tec@，Expires 2027-09-25）；scripts/security-txt.test.mjs 在到期前 30 天变红。
- **改名视频 301**：build-taxonomy-redirects.mjs 从 productMerges 推出 18 条 /videos/products/<旧>.mp4 → <新>.mp4（只写导出里存在的目标）；taxonomy-redirect-locales.test 对文件型规则改查文件本身。起因：AI 爬虫还在请求 026/023-et/033 的旧视频地址，都是 404。cron 会自动装。
- **不照做的**：mail.cantonlock.com 指向网易企业邮箱 mailhz.qiye.163.com，Cloudflare 代理不转 IMAP/SMTP，所以保持 DNS-only；AI Labyrinth 不开（我们欢迎 AI 抓取）；Turnstile 暂不需要。MFA 要甲方自己开。以上写进 CLIENT-RUNBOOK ⑥。
- **实测**：AI 请求过的产品页、文章页全部 200 或 301。auth.cantonlock.com 和主站上的 .env、.git 等请求全部 404，没有泄露。robots.txt 由我们自己出，Cloudflare 没有注入禁止 AI 的规则。
- **数据**：三份 CSV 存进 docs/research/analytics/2026-09-25/cloudflare/，结论写进 DATA-DASHBOARDS 第 7–9 条。
