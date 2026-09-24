# 2026-09-24 · Claude（HYDE 文案）· 四个参考页的 H1

- 工程会话提出：/finishes、/glossary、/model-lookup、/documents 的 H1 只有判断句，没有搜索词。现在三语都是“搜索词。原句。”，例如 `Finish codes. A model number is three facts, not one name.`、`Glosario de herrajes. …`、`Documentos técnicos de ferragens. …`。
- 葡语 model-lookup 原句「continua a significar alguma coisa」是葡萄牙说法，改为巴西说法「continua valendo aqui」。
- 测试：`npm test` 通过；改动的 12 个页面 eslint 通过。
- 未碰：metadata/SEO 字段（归工程会话）、out/。
