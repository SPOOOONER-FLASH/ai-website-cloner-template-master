# 2026-09-24 · Claude（HYDE 文案）· 锁体对比指南补西语、葡语；生成器管三语

- `content/guides/mortise-lock-case-comparison-2026.json` 原来只有英文，所以 `/es`、`/pt` 没有这一页，也没有 hreflang。现在补上西语和葡语：标题、摘要、正文、六问 FAQ、首图说明，另有三语 SEO 草稿（归工程会话）。
- **英文里有过期的数字**：摘要和 FAQ 还写着“27 款锁体、18 款 85 mm、9 款窄框”，表格早已是 32、22、12，因为生成器只重建正文。现在 `scripts/build-lock-case-tables.mjs` 管三种语言的表格、带数字的句子、摘要，以及 FAQ 里带数字的三条回答。遇到没有西语或葡语对照的规格值时直接报错，不会用英文值顶替。
- 英文“后缀”一段漏了 LC06 85_50PS 和 LC7065S，已补。
- 用词：西语按 D1（entrada、distancia entre ejes、pestillo、cerrojo、manija、perilla）。葡语 backset 用 distância ao eixo (broca)，faceplate 用 testa，按 pt-glossary。葡语避开 trinco/lingueta（0c 未定），用“peça com mola”“ferrolho”。
- **给工程会话或规格会话**：`src/data/es-glossary.ts` 里 "Four round bolts" 还是 “Cuatro pestillos redondos”，LC04 85*60 和 LC14 85×50mm 的 specsEs 也一样。这里说的是方舌销，按 D1 应该是 cerrojos。本指南的表格用的是 “Cuatro cerrojos redondos”。
- 测试：`npm test`（含区域用词守卫：pomo 改为 perilla，«» 改为直引号）、`build-lock-case-tables --check`、US 拼写，都通过。已重建 guide-locales.ts 和 search-index.json。
