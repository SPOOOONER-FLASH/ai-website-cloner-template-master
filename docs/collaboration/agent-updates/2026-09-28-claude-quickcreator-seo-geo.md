# Claude · 2026-09-28 · QuickCreator 12 篇 SEO/GEO 落地

**分支** `claude/quickcreator-seo-geo-s6ltdt`（draft PR）。只推源码，`out/` 归 johns 机器发布。

## 改了什么
- 分类页「怎么选」区块（en/es/pt 16 个分类）：`src/lib/category-guide.ts`（+test）、`src/components/site/CategoryGuide.tsx`，挂在三个 `products/[category]/page.tsx` 的 SpecMatrix 之后；删了「其余目录正在准备」那句。数字全部从规格行计数，FAQ 可见且与 FAQPage 同源。
- robots 具名组加 OAI-SearchBot、ChatGPT-User、Claude-SearchBot、Perplexity-User（`src/lib/seo-policy.ts`）。
- 询盘首次来源：`src/lib/first-touch.ts`（+test），`EngagementTracker` 落地时记一次（sessionStorage），`InquiryForm` 发 `first_touch` 字段，`trackLead` 带 `first_touch` 参数，Clarity 标签 `first_touch`。
- GEO 基线：`docs/geo/`（37 问 × 4 平台 × 3 次）+ `scripts/geo-baseline-sheet.mjs`（`npm run geo:baseline`）。
- 文档：逐篇报告 `2026-09-28-quickcreator-seo-geo-report.md`；内容规划底稿 `2026-09-28-content-planning-icp-fab-gaps.md`；CLIENT-RUNBOOK 第一屏新增三步（GA4 维度、AI 渠道组、Cloudflare 爬虫检查）。
- 移植 PR #4 的 BauColumn `duration-300` 一行修复，让 motion:check 转绿。

## 交给谁
- **多语种线**：`src/components/locale-pages/CategoryPage.tsx` 七语种分类页仍有「正在准备」那句；请删掉并挂 `<CategoryGuide category={category} products={products} locale={locale} />`。
- **隐私政策线（PR #3）**：站内存储清单加一条 `hyde:first-touch`（sessionStorage，只存来源词，关标签页即清）。
- **Claude 文案线**：34 篇指南 `relatedModels` 为空，补上后分类页自动挂链接（清单见内容规划底稿第四节）。
- **CLIENT-RUNBOOK.docx**：本次改了 runbook 的 md，桌面 docx 需在 johns 机器跑 `npm run runbook:docx`。

## 风险
- 分类 FAQ 问句是模板、答案逐页不同；若 GSC 报重复内容，先看这里。
- 本环境 Node 22（仓库要求 ≥24），check 在此环境跑通；以 johns 机器为准。
