# 2026-09-23 Kimi：发布 + robots 修复 + JS 瘦身（告知 Claude / Codex）

甲方让 Kimi 把当时工作树全量发布，并顺手做了任务 12（robots）和任务 11（JS 瘦身）。
三个推送都已上 `origin/main`，服务器 cron 拉取后两站已验证在线。

## 推送清单

| 提交 | 内容 |
|---|---|
| `216880a2c94` | 全量发布：Codex motion 优化（已批准、甲方指示不等认领）+ 雷茵锌合金分体门锁 + 四篇指南数字更新，out/ 与 out-rayen/ 全量重建 |
| `7f3e1cbe8ac` | robots：加 `Disallow: /*/__next.` 拦 RSC 侧车文件（任务 12 的第二层） |
| `439d785234c` | **修复：`seo-policy.ts` 块注释里的 `/*/__next.` 提前闭合注释，HEAD 语法报错无法构建** —— 任何 agent 拉 `7f3e1cb` 都会撞上，拉最新即可 |
| `0d933f69015` | JS 瘦身：显式现代 browserslist + SearchDialog/SiteMenuDrawer/Promo 改 `next/dynamic` 按需加载 |
| `2c790760ae8` | 构建产物：全量重建 + prune 清掉 24 个陈旧软 404 导出页 |

## 任务 12（__next._tree.txt 被抓约 3,000 次）

- 已做：`Disallow: /*/__next.`（两站生成源 + 线上产物同步）。
- **没有**用方案里建议的 `Disallow: /_next/` —— 那会拦住渲染所需的 CSS/JS，
  而且 payload 文件根本不在 `/_next/` 路径下（它们在每个页面目录旁边）。
- 没做的一半：llms.txt 加厚（加结构化产品与文章摘要），仍是待办。

## 任务 11（JS 瘦身）结果

| 页面 | 前 | 后 | 节省 |
|---|---|---|---|
| guides 文章页 | 696 KB | 648 KB | −48 KB（6.9%） |
| 首页 | 708 KB | 674 KB | −34 KB（4.8%） |

- 节省来自代码分割，不是 browserslist。Next 16 默认目标本来就是现代浏览器，
  显式 browserslist 只是固化约定，体积没变化 —— 方案文档里「调 browserslist
  去掉 26 KiB polyfill」的预期应下调。
- 搜索索引 457 KB 早就懒加载（SearchDialog 打开才 fetch），无需处理。
- HeroCarousel / ProductImageZoom 有意保留静态 import（首屏 LCP / SEO）。
- 下一个候选：LocalePicker（12.6 KB），需要先做无 JS 的 SSR 降级方案，未动。

## 留给 Claude（rayen zinc）的一件事

`npm run titles:check` 有 **39 个失败**，全是已入库的锌合金型号标题待重新生成。
按规矩没动你们的 content/products 文件 —— 请跑 `titles --write` 收尾。
其余 test:export 全绿（死链 2221 页 / 17.6 万链接、SEO 审计、tsc、eslint 全过）。
