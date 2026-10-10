# HYDE 人工代做清单

生成：`node scripts/organize-desktop-hyde.mjs`，来源是操作手册（CLIENT-RUNBOOK）里每一节「现在要做的」，2026-10-10 更新。做完一件告诉我，我从手册里移走，下次生成就不在这里了。

| # | 事项 | 第一步 |
|---|---|---|
| 1 | （2026-10-09）：产品大脑 —— 给同事开 GitHub 权限 | 使用说明和开权限步骤在桌面 `hyde\05-目录与报价\2026-10-09-产品大脑-目录与报价资料库.docx`（第一节怎么打开，第三节开权限，每人约 2 分钟）。不想自己点：把同事的 GitHub 用户名微信发我。后台地址 https://cantonlock.com/admin/brain/ 在下一次 HYD |
| 2 | （2026-10-09）：反链改到产品页 + 五个页面的搜索词导出 | 两件事的步骤在桌面 `hyde\00-先看这里-人工待办\2026-10-09-手动操作-反链深链与长尾词.docx`；要改的 69 条帖子对照表在桌面 `hyde\02-周报与数据结论\BACKLINK-DEEPLINKS.docx`。先做 worldbid 的 51 条。 |
| 3 | （2026-10-09）：Ahrefs Webmaster Tools | 开通 Ahrefs Webmaster Tools 免费版，步骤在桌面 `hyde\00-先看这里-人工待办\2026-10-08-手动操作-曝光继续爬升要的数据.docx` 第 ③ 节。10-08 要的三样里，GSC 全站效果和两张收录表你 10-09 已经给了，只剩这一样。 |
| 4 | （2026-10-08）：Cloudflare 安全页四条建议 | 两条别开（Bot Fight Mode、AI Labyrinth），security.txt 归档，Unproxied CNAME 先截图发我。AI 搜索爬虫没被拦（你 10-08 查过）。步骤在桌面 `hyde\00-先看这里-人工待办\2026-10-08-手动操作-Cloudflare安全建议.docx`。 |
| 5 | （2026-10-08）：Search Console —— 停点「验证修复」，再导出三张表（约 10 分钟） | 你 10-08 发来的 12 个导出包我全部读完了，结论和逐条数据在 `docs/research/analytics/2026-10-08/gsc-coverage.md`（`node scripts/audit-gsc-coverage.mjs` 可重跑）。**一句话：那五类都不是网站坏了，“验证失败”也不代表没修 |
| 6 | （2026-10-02）：Clarity 九个新话题 + LinkedIn 公司主页 | 完整步骤和要粘贴的全部文字在桌面 `hyde\00-先看这里-人工待办\2026-10-02-手动操作-Clarity九个话题与LinkedIn.docx` （源文件 `docs/collaboration/2026-10-02-手动操作-Clarity九个话题与LinkedIn.md`）。LinkedIn 主页已建 |
| 7 | （2026-09-30，周报）：五件，都在后台点，不碰服务器 | 为什么要做：周报 `docs/research/analytics/2026-09-30/HYDE-周报-2026-W39.md`（桌面 `hyde\02-周报与数据结论\HYDE-周报-2026-W39.docx`） 第七节。前两件决定以后的周报能不能回答「带来生意了没有」和「比去年好多少」。 |
| 8 | Bing 那两条「High」报错 —— 已修好，只差让 Bing 重新检查（2026-09-28） | 你截图里的两条，我今天对着线上逐条实测过，**网站这边都已经是对的**，Bing 显示的是它上一次扫描时的旧结果： |
| 9 | （2026-09-28 新增）：看清询盘是不是从 ChatGPT 来的 —— 三步，约 20 分钟，一次性 | **前提**：等 johns 电脑下一次发布之后再做（本条改动已合并进 main）。发布前做也不会坏事，只是没有数据。 **为什么**：从这次发布起，每封询盘邮件会多一行 `first_touch`，写着这个买家第一次是从哪来的（`chatgpt`、`perplexity`、`google`、`direct` ……） |
| 10 | （2026-09-28，文案会话）：三件，都不碰服务器 | > ① 公司英文全称你 09-28 已定：**Canton Hyland Hardware & Building Material Co., Ltd.**，官网已全部改好。BAU 展位登记名的更正邮件，按这个名字发（BAU 会话 09-25 起草的那封，把名字换成这个）。 |

详细步骤在同一个文件夹的 CLIENT-RUNBOOK.docx，以及各份「手动操作」Word。
