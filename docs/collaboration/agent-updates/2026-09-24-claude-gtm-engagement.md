# 2026-09-24 · Claude（HYDE工程）· GTM / GA4 / Clarity：阅读方式与点击事件

甲方 09-23：「怎么确认客户意图，有的快速全页下滑，有的人逐字逐句看」；09-24：「谷歌 GTM 帮我做进去」。

- `src/lib/engagement.ts`（纯函数 + 4 个测试）：页面类型、滚动深度档位、阅读方式判定
  （skim：25 秒内到 75%；read：≥60 秒且过半；bounce：<15 秒且没过 25%；其余 browse）、链接意图。
- `src/components/site/EngagementTracker.tsx`，挂在 `Analytics` 里（三语 HYDE 布局都有，staging 不发）：
  `scroll_depth`、`article_read`、`select_item`（GA4 推荐事件名）、`contact_click`、`configurator_open`；
  同时推进 GTM 的 dataLayer（GTM 里可以直接做触发器，不用改代码），并给 Clarity 打 `read_style` / `page_type` 标签，
  录像可以按「快速滑过 / 认真读」筛选。只记可见时间；GA4 延迟加载期间的事件先缓冲，不丢。
- 不采集任何个人信息：路径、深度、秒数、链接类型。
- CLIENT-RUNBOOK：新 ② 教甲方在 GA4 登记 5 个自定义维度 + 1 个指标；旧 ②（服务器停更）09-24 实测已修好，移入
  `archive/2026-09-24-server-deploy-v2.md`；「实测」表更新。docx 已重生成。
- DATA-DASHBOARDS 结论 5、6 更正（generate_lead 甲方 09-22 已标关键事件；旧站 URL 301 已实测）。

检查：tsc 0；npm test 378/378。生效需 HYDE 发布。
