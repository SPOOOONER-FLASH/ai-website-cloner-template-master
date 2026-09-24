# 分工（2026-09-24 起）

> 甲方 09-24：「现在文案润色本地化交给 hyde 文案那个 chat，把文档给他，然后你去修死链和 js 问题 bug，
> 先做 seo geo audit……哪些你这边要做，其他的你看怎么优化分工给其他 chat」。
> 规则不变：一个文件一个主人；要动别人的文件，先在 NOW.md 看，再发消息，不抢。

| 会话 | 负责 | 不碰 |
|---|---|---|
| **HYDE工程交接配置**（Claude，johns 机器） | SEO / GEO 审计（sitemap、robots、llms.txt、H1、结构化数据）；死链；JS 报错；GTM / GA4 / Clarity 事件；**四个数据看板的导入、报告和每周结论**；**全站长尾词**：所有 `seoTitle*` / `seoDescription*`、`scripts/build-product-titles.mjs`、品类页和文章的搜索标题；美式拼写（脚本 + 守卫，含产品记录和界面）；多语种工程准备；HYDE 发布 | 正文文案的润色和本地化；雷茵一切 |
| **Hyde 文案** | **全部文案润色与本地化**，英西葡三语：新闻、指南正文；产品 `summary*`、`description*`、`features*`；`src/data/category-positioning.json`（品类卖点）；198 条葡语短摘要；同族卖点矛盾（SSH018 类）；按口吻文件改写 | `seoTitle*` / `seoDescription*` 字段和标题生成器（改了会被生成器覆盖）；拼写脚本管的词 |
| **西语规格表 / 产品规格补全** | 规格数据补全、`specsEs` / `specsPt`、术语表 `es-glossary.ts` / `pt-glossary.ts` 的新词条 | 规格**标签**改美式拼写那一次由工程会话统一做（术语表键要同时改），期间不动这两个术语表的键 |
| **Hyde 视觉** | 图片：只用真实照片清理，不合成（见 AGENTS.md 与记忆「no composited product photos」） | 文案、SEO 字段 |
| **雷茵各会话** | 雷茵站一切 | HYDE 车道 |

## 交给 Hyde 文案的文档（按阅读顺序）

1. `docs/collaboration/2026-09-24-voice-en-es-pt.md` —— 三语口吻落地规则（美式拼写、各语种称呼和删词表）
2. `docs/collaboration/2026-09-24-copy-longtail-multilingual-plan.md` 第二节（工程师口吻十条）、第七节（哪些能写、哪些只能照抄）
3. 你们 09-24 自己的三份市场指南（`07779a0ac67` / `24f84bc0e67`）
4. `docs/collaboration/DATA-DASHBOARDS.md` 与 `docs/research/analytics/LATEST.md` —— 先改被看见没被点击的页
5. `src/data/es-glossary.ts` / `pt-glossary.ts` 头注释 —— 术语的权威

## 交接点：标题生成器

`scripts/build-product-titles.mjs` 原在 Hyde 文案（E:/cantonlock-hyde）名下（NOW.md）。甲方 09-24 把全站长尾词
交给工程会话，所以生成器**移交工程会话**。Hyde 文案如果有未推送的改动，先推送再告诉工程会话；
工程会话从最新的 origin/main 接手，不覆盖。品类卖点 `category-positioning.json` 仍归文案（它是文案，生成器只读它）。

## 通知

每次数据看板更新、每次分工变化，发起方用 SendMessage 通知上表所有活跃会话，一句话 + 文件路径。
