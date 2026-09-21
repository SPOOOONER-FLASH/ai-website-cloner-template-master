# 35 篇文章的问答块 + 葡语新闻区上线

**agent**: Claude · **日期**: 2026-09-17 · 接 `2026-09-17-claude-portuguese-reachable.md`

## 做了什么

### 1 · 问答块：7/35 → 35/35（135 组）

机制上一批就位了（`src/lib/article-faq.ts` + `ArticleFaqJsonLd` + 三条测试）。
这一批是写内容。

**问题不是编的。** 甲方 9-17 发来的 Bing 关键词导出里是真人打进去的提问，
逐条原样抄进对应文章（只改拼写）：

| 关键词导出里的原句 | 写进了哪篇 |
|---|---|
| how do you ensure that double doors close in the right order | door-coordinator-double-fire-door |
| difference between flush bolts and door holders | door-stop-holder-or-flush-bolt |
| if a door in hingd on the left and opens away from you what handing lock is required | handing-left-right-and-universal |
| what is a door cylinder split size | euro-cylinder-length-and-split |
| ansi equivalent to en standard | en-1125-or-ansi-which-standard-your-project-needs |
| panic touch bar vs push bar | trim-handle-or-panic-bar |
| canton product identification / cutsheet for door meaning | reading-door-hardware-model-numbers |

上一批的问题是我猜的。这一批不用猜，理由和「用真实照片而不是渲染图」是同一条：
真人打进去的问题比我写得漂亮的问题更值钱。

**每一条答案都只复述文章正文里已有的内容。** `article-faq.test.ts`
第一条测试会在答案出现正文没有的数字时失败 —— 编造一个尺寸是这个目录
唯一吸收不了的错误，而问答块是全世界最容易写出一个的地方（它是散文，
读起来像总结，没人会拿它去和正文对差异）。

### 2 · 葡语新闻区：从「不存在」到 36 个页面

`/pt/` 下原本没有 news 路由。**这个站真正被引用的就是这 35 篇技术文章** ——
Bing 把 25 次引用归给推杆那篇，17 次归给西语的开向那篇；Google AI 功能
过去 24 小时 17 次展示里，5 次是 master-key 那篇。它们存在于英语和西语，
不存在于葡语。一个跟着引用过来的巴西规格师，落在一个没有葡语对应版本的页面上。

新建：
- `src/app/pt/news/page.tsx` 与 `src/app/pt/news/[slug]/page.tsx`
- `"/news"` 进 `PORTUGUESE_MIRROR_PREFIXES` —— sitemap 与 hreflang 自动跟上

### 3 · 葡语正文：10/35

按巴西优先级翻：逃生器械与标准（trim-handle / en-1125-or-ansi /
ansi-grade-1 / door-coordinator）、开向、欧标锁芯两篇、门档与暗闩、
钥匙系统、不锈钢等级。

**未译的显示英文，不显示半中半英。** `NewsDetail` 只在
`bodyPt.length === body.length` 时采用译文，否则整篇回落英文。
混着两种语言的页面看起来像做完了，其实没有；纯英文的页面看起来没做完，
而没做完的状态才会被修。翻译脚本在写入前也做同一个检查并拒绝写入，
因为这个失败是静默的：文件存得下、构建过得去、页面悄悄发英文。

### 4 · 顺手修掉的一个西语 bug

`NewsCard` 一直渲染 `article.title` / `article.summary` 的英文原文 ——
所以**西语新闻列表页列的是英文标题，点进去才是西语文章**。
和当天的语言面板是同一类问题：只有读西语的人看得见。

## 测试与构建

`npm test` 326/326。`npm run deploy:prep` 全绿：

```
dead-link audit — 2073 pages, 157332 internal links, 48087 asset references
✔ every internal link, asset, hreflang, canonical and JSON-LD URL resolves.
deploy/nginx/legacy-redirects.conf — up to date (424 product ids, no chains)
✅ out/ is newer than every source file
```

读导出的 HTML 核过（这是唯一能看见这类缺陷的地方）：

- `/pt/news/door-coordinator-double-fire-door/` → 葡语 h1
- `/pt/news/what-oem-actually-changes/` → 英文 h1（未译，正确回落）
- 三棵树的 hreflang 三向互指，各自自指 canonical
- 导出里带 FAQPage 标记的页面：1353

## 没做的 / 要人做的

- **葡语正文还剩 25 篇。**
- **工具清单的四张截图**在上一段会话里，压缩后看不到了。已写
  `2026-09-17-tooling-evaluation.md`（评估的是本次会话实际能调的工具 +
  SKILLS.md 那十个仓库），要逐条对那四张图需要重发。
- **改了页眉页脚属于网页 UI，`AGENTS.md` 要求收尾跑 impeccable 的
  确定性 detector —— 那个 skill 本次会话没有暴露，没跑，也不声称跑了。**
- 甲方要导两份 CSV：GSC 的 404（49 条）和 5xx（1 条）。见
  `2026-09-17-gsc-index-coverage.md`。

## 给甲方的两份 Word

- `2026-09-17-谷歌索引覆盖率-逐条结论.docx`
- `2026-09-17-工具清单评估.docx`

两份都由 `scripts/build-client-docx.mjs` 从 md 生成，`DOCUMENTS` 现在 7 条。
