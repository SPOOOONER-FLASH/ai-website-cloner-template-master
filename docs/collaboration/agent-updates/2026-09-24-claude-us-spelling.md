# 2026-09-24 · Claude · 文章改美式拼写；三语口吻指南

甲方 09-23：「英语要像美国人写的」。英文全站原为英式拼写（centre 200+、aluminium 50、center 0）。

- `docs/collaboration/2026-09-24-voice-en-es-pt.md`：三语口吻指南（读过的素材：Von Duprin、I Dig Hardware、
  Travex、Battaglia、Phillips、La Fonte、PCF Brasil；学结构和用词，不学它们的认证话术）。
- `scripts/normalize-us-spelling.mjs`：content/news + content/guides 的英文字段改美式（77 篇，约 830 个词）。
  跳过 URL / 文件名 / `代码片段`（引用的是产品页上原样的规格标签）/ Es·Pt 字段。`--check` 做守卫，
  `scripts/us-spelling.test.mjs` 进了 `npm test`。
- `src/data/article-catalogue-claims.test.ts`：登记的计数句子同步改为 catalog / center。
- **未改**：产品记录（两站共用，规格标签仍是 Centre distance 等）、`src/app/(en)` 界面文案、组件文案。
  文章里个别处写「按记录原文」引用的 aluminium alloy 现在与产品页拼写不一致，产品记录跟进时一并消除。
- npm test 374 通过。生效需要 HYDE 发布。
