# 2026-10-09 · Claude（HYDE 工程）· 曝光平台期分析 + 品类买家词标题

- **范围**：甲方 10-09 导出（GSC 3 个月全站效果、AI 功能效果、两张覆盖验证表；Bing 关键词 / 页面 / AI 引用 / 反链）→ 结论 `docs/collaboration/2026-10-09-曝光继续爬升-数据结论与行动.md`（桌面 docx）。目标表 #138、#139。
- **结论**：工作日曝光 1,135，与上周 1,185 持平；平均排名 14.9 → 6.9。曝光 67% 来自指南 / 文章，19% 来自产品页；Google AI 功能占上周 31%（点击率低的主因）。约 1,000 网址「已发现未抓取」：569 七语种译文、226 英文产品、177 /video/。
- **改动**：`content/categories.json` knob-locks、grip-handle-sets 的 seoTitle 加 「China Manufacturer」（买家词「knob & tubular lock manufacturer」排 40、「grip handle lock exporter」排 28）。中立文件，雷茵只渲染中文子类名，不受影响。
- **测试**：npm test 456/456，titles:check 通过。
- **未动**：E1 三页（10-14 读数）；/video/ 站点地图去留等甲方 A/B；万能钥匙分级表、饰面两页主次归文案会话。
- **插件**：ponytail、i-have-adhd（常开）、context-mode 本会话已生效；hyperframes 已装未试渲染。
- **发布**：西语规格会话的目录发布 4517489780b（源 eaab4162e0c）分块推送中；本提交的标题改动随下一次发布上线。
- **追加（甲方选 A）**：`src/lib/site-sitemap.ts` 去掉 /video/ 观看页与目录条目（页面保留）。
- **追加（饰面主次）**：指南 finish-code-reference-2026 英文 seoTitle/Description 让位给新闻 finish-codes-us26d-626-630（数据：1,050 vs 179 曝光）；正文与互链归文案会话，已发消息。
- **追加（反链深链 #141）**：`scripts/build-backlink-deeplinks.mjs`（自检两条手核帖子）把 Bing 引用页面 139 条按型号对到产品页，69 条可改 → `docs/research/analytics/2026-10-09/BACKLINK-DEEPLINKS.md`；10-09 原始导出存 `docs/research/analytics/2026-10-09/raw/`。甲方手动改帖。
- **追加（r31 被拦）**：seo-audit 规定站点地图外的公开页必须 noindex 并声明 `canton-withheld`，否则 sitemap-missing-page 拦发布。/video/ 与观看页加 `WATCH_PAGE_ROBOTS`（src/lib/video-pages.ts）。npm test 457/457。
- **追加（桌面整理 #142）**：`scripts/lib/desktop-hyde.mjs` + `scripts/organize-desktop-hyde.mjs`；生成器默认按文件名进子文件夹；AGENTS.md runbook 第 6 条补一段。手册三处 `hyde\2026` 被旧 sed 写成 U+0082 控制字符，已修。
- **追加（#144 漏英文）**：collection-spec-range 标题对所有非英语言走 specLabels（加 de 测试）；HardwareTerms 词条名回退 specLabels → UI；七语 glossary 补 OEM & ODM，重生成 i18n-client。顺手：desktop-hyde.mjs 的 catalogue 改 catalog(?:ue)? 过美式拼写测试。npm test 458。
- **追加（#145 LCP）**：线上实测（Slow 4G + CPU 4×，1440 宽）/products/ 2.25 s、/product-finder/ 1.0 s（CLS 0.05）、/company/ 0.49 s；周报 3.6 s 是 #131 之前的 Clarity 数据。等下一期 Clarity 确认。
