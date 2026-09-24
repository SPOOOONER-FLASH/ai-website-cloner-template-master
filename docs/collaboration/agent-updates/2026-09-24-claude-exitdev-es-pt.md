# 2026-09-24 · Claude（HYDE 文案）· 推杠对比指南补西语、葡语

- `content/guides/exit-device-comparison-2026.json` 以前只有英文。现在补上西语和葡语：正文逐段对应，三张表、六问 FAQ、首图说明，另有三语 SEO 草稿（归工程会话）。GUIDES_WITHOUT_ES/PT 里只剩 `cylindrical-and-tubular-lock-comparison-2026` 一篇。
- 这篇的表格不是生成器出的，计数测试只查英文（46/27/19/16、13 个有长度）。**如果英文计数变了，西语和葡语要跟着改。** 正文第 1、4 段和 FAQ 第 1 问的数字就是要跟着改的地方。
- 用词：西语按 D1（pestillo、cerrojo、manija），pry latch 写成 pestillo de empuje，dogging 写成 retención en abierto。葡语避开 trinco/lingueta，用 travamento、peça de travamento；pry latch 写成 fecho de empurrar。
- 测试：`npm test` 通过（含区域用词守卫）。已重建 guide-locales.ts 和 search-index.json。
