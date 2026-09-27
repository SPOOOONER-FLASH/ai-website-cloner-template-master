# 2026-09-27 · Claude (Hyde 文案) · 产品页“询价要提供什么”（任务表第 15 项）

来源：QuickCreator《Product-Led SEO》——CTA 按采购阶段分，并写明交付边界（客户要提供什么）。

核对：`ProductDetail.tsx` 已有三个入口（Request a quote / Ask a technical question / Download the export catalog）、直接邮件、本型号阿里巴巴链接，已经按阶段分，不加新按钮。

改动：按钮下加一行 `quoteNeeds`，三语：询价请发型号和表面、数量、目的国、要改动处的图纸或照片。沿用现有 `text-c2 text-ink-secondary`，没有新样式。

验证：typecheck、`npm test` 通过；本地 dev 实测 EN、PT 产品页显示正确。
共享组件：HYDE 产品页组件，雷茵不渲染。七语：`dict` 回落英文，待多语会话。
