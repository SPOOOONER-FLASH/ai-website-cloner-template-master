# 2026-09-07 · Claude · 全项目未完成事项审计；三处过期文档与一个错数字

## 范围

甲方要求核查从建站到现在有什么没做，两个 agent 都算，看所有文档。翻了 `docs/` 全部
文档、131 份 agent-update、`HANDOFF.md`、`NOW.md`、`CLIENT-RUNBOOK.md` 与全部 task。

**方法上做了一件本来该更早做的事：凡是文档说「还没做」的，都去实测。**
本轮前面栽过一次 —— Bing 报表显示旧站 371 个 URL 返 200，我据此写了「需要甲方上服务器
做 301」。实测发现 301 早在 09-04 就生效，而且是逐条精确映射的；那些 200 是 Bing
「最后抓取时」的状态，322 个抓于 7、8 月。**站长工具的 HTTP 列是历史不是现状。**
差一步就让甲方白跑一趟生产服务器。

## 结果

| | 条数 |
|---|---|
| 文档说没做、实测已完成 | 5 |
| 卡在甲方给事实 | 9 |
| 卡在甲方后台 | 2 |
| 我们能做未做 | 5 |
| 明确不做 | 3 |

全表在 `docs/collaboration/2026-09-07-outstanding-work-audit.md`。
**现在唯一要甲方动手的是 GSC 点「验证修复」。**

## 就地更正的三份过期文档

| 文档 | 原话 | 实测 |
|---|---|---|
| `CLIENT-RUNBOOK` §1 | nginx 还没读它，旧网址是 404 | 6/6 正确 301 |
| `CANTONLOCK_ROLLBACK` | HTTPS 尚未可用 | www 与 apex 证书均校验通过 |
| `STATIC_SITE_PERFORMANCE_RUNBOOK` | 根目录 20 项陈旧副本未清理 | 只剩在用的 `out/` 与 `out-rayen/` |

旧 URL 那条另写成脚本 `scripts/verify-legacy-redirects.mjs`，六个样本覆盖旧 CMS
的每种 URL 形态，其中两个是深层产品页 —— 如果哪天逐条映射退化成一股脑跳
`/products/`，就是这两个会报警。

## 一个线上可见的错数字

`content/faq.json` 的 OEM 答复（英西双语）写着「We publish 435 models across 15
product families」。实际：目录 462 条记录，**361 条有照片因而已发布**，101 条没有
照片、已建页但 `noindex`。

**435 同时错了两个方向，出现在商业上最重要的一条 FAQ 上，而这个站的全部论点就是
它的数字可信。** 没人是故意写错的 —— 它是放旧的，写死的数字都会。首页数字条和产能
链段靠计算规避（`site-facts.ts`），但 `faq.json` 是手写内容没法计算。

已改成 361，并加 `src/lib/published-counts.test.ts`：从 `content/products` 数一遍
有主图的记录，与 FAQ 里所有「publish N models / Publicamos N modelos」比对，
类目数同理。它拦不住数字变旧，但能拦住带着错数字的构建上线。

## 顺带修正我自己报告里的一个数

图片 sitemap 我先前报「6,548 条」，实为 **3,274 条 `image:image`、指向 1,637 张
不同图片**（英西两版各一条，所以条目是图片的两倍）。我把开标签和闭标签数了两遍。
`2026-09-07-seo-audit-findings.md` 已改。

## 发布

Codex 在 `2026-09-07-codex-motion-withdrawal.md` 里交回了接力棒（三部影片被甲方
09-07 否掉、已撤回，他们本地重建早于我的提交、新鲜度检查失败）。认领板当时是空的，
我接棒跑了两次 `deploy:prep`：第一次带产能链段与三篇文章，第二次带 FAQ 更正。

两次都全绿：1,095 页、25/25 导出测试、0 语义问题、81,719 条内链全部可达、
`out/` 新鲜度通过。接力棒已交还，认领板已清。

## 验证

`npm run typecheck` / `npm run lint` 干净；`npm test` 211 项全过（新增 2 项）。

## 没碰的东西

Codex 的 `src/app/es/**`、编辑图资产、`scripts/blender/`、
`content/promo.json` 的文案部分，一律未动。

记得 purge。
