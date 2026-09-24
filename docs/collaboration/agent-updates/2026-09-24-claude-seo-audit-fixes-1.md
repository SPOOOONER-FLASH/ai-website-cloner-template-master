# 2026-09-24 · Claude（HYDE工程）· SEO/GEO 审计，第一批修复

审计（在 69bbd778dda 的构建上跑 seo:audit / seo:deadlinks / seo:graph / seo:citability / seo:anchors / seo:gtmhead）：

| 项 | 结果 |
|---|---|
| 死链（2,223 页、17.6 万内链、4.9 万资源、hreflang、canonical、JSON-LD） | 0 |
| H1 | 2,220 页每页恰好一个 |
| sitemap / robots / llms.txt / IndexNow | 都在；sitemap 2,017 个可索引页带 hreflang；robots 点名 5 个 AI 爬虫并声明 Sitemap；llms.txt 列 612 个 URL |
| 线上 JS | 首页、产品页、配置器、葡语选型器、指南、西语联系页：控制台 0 错误、0 失败资源 |
| 旧站 URL | 抽查 4 个 GSC 仍有展示的 index.php 地址，全部 301 到对应新页（www → 裸域 → 目标，两跳） |

本批修复：
- **13 个页面从首页点不到**（三语的 finishes、glossary、model-lookup、documents）+ 葡语 ferragens-porta-corta-fogo 孤页：页脚加「参考」入口。
- **所有葡语品类页标题后缀是西语「Fabricante y proveedor」**（与 /es/ 重复标题）：改为「Fabricante e fornecedor」。
- 三语品类页兜底标题去掉破折号；品类支持 `seoTitleEs` / `seoTitlePt`（长尾词阶段填）。

留给后续：306-D/306-S 西葡标题重复（E 盘会话 1fcc8854060 已补名称，重生成后复查）；219 张无 alt 图片（指南、新闻列表）；
「Read more」空锚文本（术语表）；H1 是纯判断句不含搜索词（finishes 等），放进长尾词阶段；隐私政策页不存在（页脚 Privacy 指向 /company），GA4 + Clarity 在收数据，欧盟访客需要一页隐私说明，**需甲方提供内容**。

tsc 通过，npm test 374 通过。
