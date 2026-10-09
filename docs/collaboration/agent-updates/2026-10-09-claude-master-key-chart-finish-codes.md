# 2026-10-09 · Claude（文案）· 工程会话 10-09 清单 ①②

| # | 做了什么 | 提交 |
|---|---|---|
| ① 万能钥匙分级表 | 词落在新闻 `master-key-systems-how-many-levels-you-need`（工程会话核实：709 曝光，指南 31）。在第 15 段后加「每把钥匙开几扇门」表（按文中示例楼假设计数：36 个锁芯，GMK 36、MK-A 8、SMK-1 3、CK 各 1 加入口）和一张可打印的空白分级表（GGMK→CK + 同钥组 + 共用入口门）。三语 + 七语 | 45c399c267c 之前那笔 |
| ② 饰面代码两页定主次 | 主页是新闻 `finish-codes-us26d-626-630`（1,050 曝光，指南 179；工程会话已把指南 seoTitle 让位，6ad07ffda67）。正文不支持链接，所以加了一个字段 `seeAlso: "guides/<slug>" \| "news/<slug>"`，NewsDetail 在侧栏工具行下面渲染「Read next」+ 目标文章自己的标题（十种语言都有）。新闻 → 指南「Finish Code Reference 2026: The 23 Codes…」；指南 → 新闻「US26D, 626, 630: A Finish Code Is Not a Color」 | 本次 |

## 改到的共享文件（工程会话请知悉）

- `src/data/types.ts`：`NewsArticle.seeAlso?: string`
- `src/components/site/NewsDetail.tsx`：解析 `seeAlso`（getGuideBySlug / getNewsBySlug），样式照抄 `tool` 那一行
- 新 UI 词「Read next」：`content/i18n/<7>/ui.json` 已补译，`npm run i18n:keys` 已跑（客户端词库无变化，NewsDetail 是服务端组件）
- `src/data/news-publish-date.test.ts`：新增断言，每个 `seeAlso` 必须指向存在的文章，否则测试失败（目标缺失时页面会静默不显示）

## 验证

- typecheck、eslint（只有一条原有的 `<img>` 提示）、`npm test`、`i18n-lint`、`build-i18n-client-ui --check`、`revisions --check` 全过。
- **没能在浏览器里看到渲染结果**：本会话的开发服务器两次都在 PostCSS 子进程超时（`globals.css`，另一会话的开发服务器同时在跑），与改动无关。请发布后在线上看 `/news/finish-codes-us26d-626-630/` 侧栏底部和 `/de/guides/finish-code-reference-2026/`。

## ③

每周新文章：等下一次 GSC 导出再选题（任务 #35，待问）。
