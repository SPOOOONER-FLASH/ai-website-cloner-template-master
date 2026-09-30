# 2026-09-30 Claude — 周例行检查点（压缩前落盘）

甲方 09-30：抽屉比例、全站排查、周数据分析与报告。本文件是中途检查点，压缩后从这里接着做。

## 已完成（源码，已测试，未发布）

| 项 | 改动 | 验证 |
|---|---|---|
| 抽屉一屏看全 | `EditorialCatalogue.module.css`：纵向尺寸随视口高度缩放（clamp + vh），≥1200px 四组链接一行四列；`SiteMenuDrawer.tsx` 联系方式并排 | 线上实测旧版高 1157px 固定，1080 屏溢出 77px、768 屏 389px；新版 1280×720、1366×650/768、1440×900、1920×950/1080、2222×1155 均 0 溢出，de/ru/ar 同；1100px 宽仍需滚动 112px（窄屏两列） |
| BAU 横条手机 CLS | `BauEntry.module.css`：<1032px 展位号固定独占一行 | 390px /products/ CLS 0.412→0，首页 1.207→0；de/ru 余 0.059 来自语言提示条 |
| 重复标题 | 配置器工作室 es/pt 有了自己的标题描述 | seo-geo 审计的 duplicate-title 3→0（重建后复核） |
| 指南栏目标题过短 | /guides/ 及十语种栏目标题改为「Door Hardware Guides: Size Charts, Standards, Finish Codes」等 | Bing 24 展示 0 点击 |
| 看板脚本 | `build-analytics-report.mjs` 认 GSC Discover 导出和 Bing AIPerformanceOverview | 64 个 CSV 已归档 `docs/research/analytics/2026-09-30/` |

npm test 456/456，tsc、precheck 全过。

## 全站排查结果（r20 发布包 + 线上）

- 死链 0（8,049 页，91.5 万内链）；线上外链审计 0 死链（Pinterest/Tumblr 连接超时，非死链）
- 孤页 0，最深 3 次点击；十语种内链摆位 WEAK 0
- 旧站 index.php 链接抽查 12 条全部 301 到对应新页
- 剩余告警：5,190 个 `<img>` 无 alt（多为 alt=""，装饰图）、4,835 条描述 <110 字符（多为七语种产品页）、190 条标题 <30 字符（日语为主，按字符宽度实际不短）

## 数据要点（9/21–9/30，写周报用）

- GSC 网页 7 天：点击 25、展示 2,884、CTR 0.87%、排名 ~8.8；每日点击 0→7 上升。图片搜索 569 展示 0 点击；Discover 首次出现（9/25 起 90 展示，圆柱锁 vs 管状锁指南）
- 最大机会：HS 编码指南 593 展示 2 点击、主钥匙文章 238/2、161/86 开孔 145/1、欧标锁芯尺寸表 114/1
- Bing AI 引用：9/23 180 → 9/27 47（下降）；被引页首位 HS 编码 74、161/86 开孔 69、锁扣板 49
- Clarity AI 可见度：SoA 22.3%；引用 Door Components 109；Documentation / Fire safety 话题 0%
- GA4：活跃用户 1,386，但中国 638 + 新加坡 491 = 81%（非买家流量）；Direct 1,206 新用户、互动 15 秒；Organic 64 新用户互动 59 秒；ChatGPT 24 新用户互动 81 秒、关键事件率 4.2%（最高）；BAU 展商页 6 用户互动 96 秒
- /products/ 着陆 423 会话、平均互动 3.2 秒 → 疑似机器人/预渲染流量，需核实
- 关键事件 14 次；GA4「潜在客户」漏斗全 0（lead 生命周期未配置）
- Clarity：真人 42.7%，Meta 爬虫 31.3%；OpenAI 抓取:引荐 68:1；桌面性能分 70.8，LCP 3.6s，CLS 0.16（/products/ 0.694 → 已修 BAU 横条）

## 还没做（接着做）

1. 周报正文：`docs/research/analytics/2026-09-30/WEEKLY-REPORT.md`（大公司格式：摘要、KPI 表、成果、洞察、问题、下周计划、方法论教学），生成器 `scripts/build-weekly-report-docx.mjs` 输出到 `Desktop\hyde\`
2. `DATA-DASHBOARDS.md` 追加「本期结论（2026-09-30）」和期数表行；看板缺口清单（本期缺 Cloudflare AI Crawl、GSC 查询按国家、GA4 维度登记、Bing 爬取错误）
3. 发布（release:hyde）、线上核对抽屉/CLS、IndexNow、通知各会话
