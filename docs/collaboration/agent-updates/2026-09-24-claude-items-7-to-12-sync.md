# Claude → Codex：TODO 第 7–12 项完成情况与交接（2026-09-24）

> 甲方 09-24：「789101112 挨个做完……最后做 13，然后告诉 codex，和他们同步进度」。
> 本文是那句「告诉 codex」。所有提交都在 origin/main，HYDE 工作目录已搬到 **E:/cantonlock-hyde**（独立克隆）。

## 先看这三条（会影响你们的工作）

1. **工作目录分仓。** 本机 C 盘满（~7GB），甲方要把 C 盘旧目录删掉。C 盘上所有检出，包括你们
   `C:/Users/86132/.codex/worktrees/*` 下的四个，用的都是 `C:/Users/86132/Downloads/cantonlock/.git`。
   那个目录一删，你们的 worktree 全部失效。**请先把未提交的改动提交或推送**：09-24 查到
   `guides-visual-refresh` 有 3 篇指南 + NOW.md 未提交，`hyde-fluidity` 有 NOW.md、两个 design-references JSON、
   `out-rayen/__next._full.txt` 未提交。之后请在 E 盘建自己的独立克隆（命令见 AGENTS.md 分界墙一节），
   **新克隆要跑一次 `npm run wall:install`**：C 盘仓库从来没设过 `core.hooksPath`，site-wall 钩子其实一直没在跑。
2. **西葡用词有守卫测试了。** `src/data/regional-terms.test.ts` 会拦住西班牙/墨西哥用词和葡萄牙用词回流：
   manilla、pomo、cuadro/cédula、« »、tem de 等。你们写西葡文案被拦时，跑
   `node scripts/normalize-regional-terms.mjs --write` 就行，规则和理由都在脚本头注释里。
3. **产品记录不能再有破折号。** `src/data/product-dashes.test.ts` 会拦。规格值（如 `Entrance, keyed outside`）同时是
   es/pt 术语表的键，只改一边会让西葡规格行退回英文，改之前先看 `scripts/normalize-product-dashes.mjs`。

## 各项完成情况

| 项 | 状态 | 提交 | 要点 |
|---|---|---|---|
| 7 旧 35 篇三语扩写 | ✅ | 7cebea24295 等 | 35 篇西葡全部补齐、与英文段落 1:1；英文逐篇 ≥1,600 词；顺带修了去 AI 痕迹留下的逗号粘连句 |
| 8 西语拉美化 / 葡语巴西化 | ✅ | 1a5ad4e342c | 457 个文件；中性拉美（秘鲁、哥伦比亚、阿根廷），不用墨西哥词；葡语 backset 统一为 `Distância ao eixo (broca)` |
| 8 附带：/es /pt 搜索 | ✅ | 同上 | 两个站用的是同一份英文搜索索引，西语搜 manija 搜不到。`scripts/lib/search-regional-terms.mjs` 按品类加了西葡词和地区同义词 |
| 9 对比指南 | ✅ | b5288422816 | 新增 `exit-device-comparison-2026`、`cylindrical-and-tubular-lock-comparison-2026`（仅英文）；闭门器 EN 1154 对照表写进 `door-closer-power-size-2026`（三语） |
| 10 HYDE 口径数字 | ✅ | 同上 | 四篇文章用了旧的全目录 924 做分母，已改；你们 b0031531418 那批与本批不冲突。所有新数字都登记进 `article-catalogue-claims.test.ts` |
| 10 附带：去 AI 痕迹表格修复 | ✅ | 同上 | 空单元格被换成「,」「(」，跨两行的「X — Y」被合成一对括号，三语共 109 处已修复 |
| 产品去破折号（甲方追加） | ✅ | ec45c6c9d7f | 2,739 处；改前改后术语表命中数一致（西语 2,785 / 葡语 2,407）；5 个生成脚本不再写回 |
| 11 JS 瘦身 | ✅ 复核 | 无改动 | 线上实测：现代浏览器首页 JS 约 180KB（压缩后）。110KB 的 polyfill 块是 `noModule`，现代浏览器不下载。Kimi 的方案有效 |
| 12 robots | ✅ | b2388124c9a | 补上根目录 `/__next.`：`/*/__next.` 至少要一级目录，拦不住首页那层 |
| 13 新语种 | ⏸ 等甲方定范围 | — | 见下 |

## 需要你们（Codex）接的

- **按意图预加载（intent preload）**：SiteHeader / SearchDialog 是你们认领的，我没碰。建议在搜索按钮上
  `pointerenter` / `focus` 时预取 SearchDialog 的 chunk 和 `/search-index.json`。现在首次点开搜索要先下载约 700KB 的索引
  （加了西葡词后是 703KB）。
- **指南页标题字体**：甲方觉得你们的衬线大标题「很好」。我的意见是保留这个方向，但 Georgia 是系统字体，
  安卓上没有，会退回别的衬线字体。建议换成用 next/font 自托管的 Source Serif 4（大陆访问也不受影响），
  并扩到新闻标题和首页主标题。**甲方还没拍板**，GuideEditorial CSS 在你们的认领范围里，谁来改等甲方定。
- **一个 JS 报错线索**：Clarity 09-17 在 `/es/news/what-oem-actually-changes/` 记到一次 JavaScript error，
  一位洛杉矶访客，16 分钟会话。现在线上打开没有报错。最可能的原因是跨发布的旧 chunk 失效：服务器
  `git reset --hard` 会删掉旧的 hash chunk，开着旧页面的访客再做站内跳转就会报错。报错原文已向甲方要了；
  如果确认是 ChunkLoadError，需要改部署脚本，保留上一版 `_next/static`。

## 第 13 项（新语种）为什么停下

土、法、日、韩、德、俄六种语言，如果像西葡一样做全站镜像：590 个产品 + 43 篇指南 + 35 篇文章 × 6 种语言，
约 75 万词翻译，外加 6 套约 2,800 词条的术语表，且 `Locale` 类型一扩，十几个文案字典会全部编译报错。
质量达不到西葡的水准就上线，只会造出一批机器翻译的薄页。已请甲方在「每种语言先做一层落地页」和
「先挑两种语言做全站」之间选。定下来之前请不要动 `src/data/locales.ts`。
