# 2026-09-28 · Claude · 被 AI 引流页：回链、场景纠错、工厂缺数据清单

Client: ChatGPT 把买家直接送到 LC04 85×60 和 SSH018；做长尾词，补被 AI 引流的页，继续横评。

## 改了什么

- **产品页回链到引用它的文章**（`src/lib/citing-articles.ts` + `ProductDetail.tsx` 的 Next steps）。
  文章一直链到产品，产品从不链回。LC04 85*60 被三篇引用（含锁体横评），页面上一篇都看不到。
  现在按 `relatedModels` 精确匹配，指南在前、新闻在后，最多 4 条，三语文案，链接走 `localisedHref`。
- **5 个断掉的 relatedModels**：`LC04 85-60`、`LC02 85-40mm`（两篇）、`LC14 85-50mm` 与记录的型号串不一致，
  文章不显示产品卡、产品也找不到文章。已改成记录里的写法。`citing-articles.test.ts` 守住：以后任何
  relatedModels 不匹配就失败。三条留在豁免表里等编辑决定：`808 SS ET`（808 只有 ABET/MBET/SNET/SNPS）、
  裸 `D101`、`Brass Piano Hinge`（无型号）。
- **标题生成器：品类场景不能超出产品自己的 Application 行**（`narrowedByApplication`）。
  LC04 85*60 写着 Wooden doors，描述却是「for timber & metal doors」。同类 13 条：HY006/007/008 铝框窄边
  门锁体被说成木门、5833 铁门、LC17 推拉门、CH01 窗用、SSH031 弹簧门等。只收窄不扩写；混写的保持原样。
  `--write` 只改了这 12 个文件的 seoTitle*/seoDescription*，`titles:check` 通过。
- **`npm run sheet:ai-landing`** → `docs/research/AI-LANDING-GAPS.md`：读 analytics 里 AI 类导出
  （Bing AI 引用、GSC 生成式 AI、Cloudflare AEO）+ `docs/research/ai-landing-seeds.json`（客户在 Clarity
  看到的 chatgpt.com 落地页，手记），按品类列每个型号**缺的字段**，前 40 个。一个数字都不填。
  前五：564、SSH018、LC04 85*60、AR4-101、AR4-110。

## 没做、为什么

- 逃生推杠横评：`/guides/exit-device-comparison-2026/` 09-23 已上线（27 款、三张表、缺项点名）。
  客户说「数据我已经整理好了」，如果那份数据比产品记录新，要先拿到再改那篇，不另写一篇。
- 7 个采购问题答案页：`docs/research/2026-09-22-buyer-question-simulation.md` 第四节，全部卡在工厂/甲方的数字。
- IndexNow：发布机的事（`npm run seo:indexnow:release`）。

## 风险 / 下一步

- 回链改的是共享组件 `ProductDetail.tsx`，RAYEN 不用它（RAYEN 走 `components/rayen`）。
- 需要 HYDE 发布才生效。发布后 10-08 左右看 LC04、HY00x 的 GSC 点击率。
- 下一位：工厂按 AI-LANDING-GAPS.md 回数字 → Claude 写进 content/products → 重跑 titles 与 sheet。
