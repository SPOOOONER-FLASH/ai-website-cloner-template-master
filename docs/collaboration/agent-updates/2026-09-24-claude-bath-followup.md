# 2026-09-24 · Claude（HYDE 文案）· 卫浴拆分后续（工程会话提的 4 件事）

- `news/why-the-catalogue-is-this-wide` 三语：现在是 16 个品类，五金配件 68、卫浴 42；“最小的几类”加上了 grab bars and shower seats (8)，计数测试里的这条声明也一起改了。
- `content/categories.json`：care-grab-bars 这个类目第一次在 HYDE 上有产品。原来的简介写的是雷茵的货（L 形扶手），现在按 HYDE 的实际产品重写，顶层和两个子类都补了三语 summary。
- 10 条模板 description（“… is a bathroom accessories manufactured by …”）按照片上看得到的内容改写，尺寸写明“下单前确认”。
- 葡语统一用 rebatível：BH55 改为 “Assento de banho rebatível”，记录和 pt-glossary 一起改；命名表同步更新。BH55 西语 pitch 里的 “contra el muro” 改为 “contra la pared”。
- 测试：两条测试依赖 out/ 的构建，暂时失败：“every category that does have products is built”（care-grab-bars）和 “no taxonomy redirect points at a page the export does not have”（新的 301 目标）。origin/main 上本来就失败，下一次 release:hyde 构建后会通过。其余全部通过。
- 工程会话接着做：BH55–58 的 seoTitlePt/seoDescriptionPt 要重新生成，然后发布。
