# 2026-09-24 · Claude（HYDE 文案）· 第 2、3 批文章复核完成

- `news/trim-handle-or-panic-bar`：西语 FAQ 和正文用词对齐（bombillo 改 bocallave，escudo 改 rosetón，relación 改 planilla）；葡语 “canhão” 是葡萄牙叫法，改成 cilindro。
- `news/master-key-systems-how-many-levels-you-need`：西语里 CK 原来有三种叫法（llave de cambio / de servicio / de uso），统一为 llave individual；GMK 统一为 gran maestra，GGMK 统一为 gran maestra general；西班牙用词 gobernanta、patinillos、contrata 改成拉美说法；Ése 改 Ese。
- `news/mortise-lock-backset-and-centre-distance-guide`：
  - 背距表是手打的，已经过期（60 mm 固定 22 改 23，50 mm 6 改 7，其他 8 改 11，合计仍是 180），三语都改了。
  - 第 20 段是一段旧的标签审计，数字（144、103、“上面的 41”）和第 19 段的 34 对不上，三语都改写成不带数字的说法。
  - 表格里会变的三行已登进 `src/data/article-catalogue-claims.test.ts`，下次再过期测试会报红。
- 测试：`npm test`、tsc 通过。
