# 视频观看页：/video/<slug>/（Claude 工程，2026-09-25）

- **问题**：Search Console 视频报告有 97 个视频在「视频不在观看页面上」，09-24 验证失败（甲方 09-25 导出）。Google 只从「主要用途就是这个视频」的页面编视频索引；产品页的主要用途是产品，前几轮修的 preload、uploadDate 时区、字节范围都对，但改变不了这一点。
- **做法**：每个可编索引的产品视频一个英文观看页 /video/<产品 slug>/：标题下面就是整宽播放器，再下面是产品原有的摘要、「规格和表面」「询价」两个链接。VideoObject（加 url）和 sitemap 里的 <video:video> 都从产品页挪到观看页。产品页照常播放，英文产品页的视频说明文字链到观看页。另有 /video/ 总目录，按品类列出全部视频。
- **只做英文**：一个视频一个观看页就够 Google 编索引；西葡再做一份，就是几个页面争同一个视频。
- **代码**：src/lib/video-pages.ts（判定、路径）、src/app/(en)/video/**、JsonLd.videoObjectSchema、sitemap.ts、ProductDetail 的链接。
- **测试**：tsc、eslint 通过；npm test 只有 taxonomy-redirect 那一项红，是七语种和观看页还不在本地 out/，发布后变绿。
- **甲方要做**：发布后在 Search Console 的视频索引报告里点「验证修正」；观看页被抓取后，视频应该出现在「已编入索引」里。
