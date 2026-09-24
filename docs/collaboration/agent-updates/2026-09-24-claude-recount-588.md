# 2026-09-24 · Claude (HYDE 文案) · 8827/8828 合并后的计数

- 范围：9 篇文章 + `content/faq.json`，三语。HYDE 记录 590→588，可见型号 523→521，执手 64→62，无规格条目 114→112。
- 执手文章：8827、8828 已并入带规格的 8827 SSET / 8828 SSET，“其余八款无规格”改为“其余六款”（819 PBET、8803 SNBK/SNET、8806 SSBK/SSET、LH851），三语正文与 FAQ 同步。
- 未变：图纸 84 / 可见 72、背距 180、中心距 42、锁体表（`build-lock-case-tables --check` 通过）。
- 测试：`npm test` 通过；`normalize-us-spelling --check` 通过。
- D1 在 `src/data` 与产品 featuresEs 已完成（f3b02a8）；hy008 / s564 的冲突句已是 cerrojo/pestillo，工程会话可启用 picaporte 规则。
- 未碰：out/、out-rayen/、SEO 字段。
