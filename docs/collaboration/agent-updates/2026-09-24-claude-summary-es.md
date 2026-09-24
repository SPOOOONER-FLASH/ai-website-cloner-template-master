# 2026-09-24 · Claude（HYDE 文案）· 60 条西语产品摘要 + 守卫测试

- `content/products`：60 条 HYDE 记录的 `summaryEs` 原来只有两三个词，例如“Cerradura de embutir.”“Mirilla.”，现已逐条重写（`tmp/claude-copy-work/summaries-es.mjs`）。只动了 summaryEs，SEO 字段和其他语言都没碰。**产品记录是中立区**，但这些都是 HYDE 记录，雷茵只显示中文，不受影响。
- 依据：先看英文规格行，再看 summaryPt（09-24 按实拍图和尺寸图写的）。葡语 trinco/lingueta 分不清的地方，西语一律省略，不猜（LC20）。原来有几条写着“zamak”却没有任何规格依据（DV04、FB001、FB005 AC、FB017），已删掉；DV07、DV08、DV10、DV08 SN 的规格行写明是 zinc alloy，所以保留。
- 守卫：`src/data/product-summary-es.test.ts`，任何一条 HYDE 的 summaryEs 不超过四个词就报错。已加进 `package.json` 的 test 列表（只改这一行）。它也能拦住重新跑 `translate-products-es.mjs` 把摘要打回半句话的情况。
- 顺带修正（葡语也归我）：`cylindrical-knob-lock` 的 summaryPt 原来写的是“em aço inoxidável”，可英文规格写的饰件是 zinc die-casting 或 solid brass，已按规格改写。“pomo”是 pt-glossary 定下的 knob 译法，巴西零售也在用，保留不动。
- 测试：`npm test`、tsc 通过。
