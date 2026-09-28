# 2026-09-27 · Claude (Hyde 文案) · 更正：摘要里的材质按记录自身的 `material` 字段补回

发现：上线后抽查 70 SNDK，页面 JSON-LD 写 `"material":"Solid Brass"`，而当天的摘要（1b982b3976e）已把西葡原有的“latón macizo”删掉。原因是我只看了规格行里的 Material，没有看记录顶层的 `material` 字段（2026-09-08 随品类导入，页面 Material 行和 JSON-LD 都在用）。删掉“实心黄铜”的理由不成立，是我的错。

更正（`material` 为 Solid Brass / Stainless Steel / Zinc Alloy / 304SS / Steel 时，三语补进摘要，已写了就不重复）：
- 57 条，都是当天按订货代码生成或写成“规格与工厂确认”的摘要。例：“70mm solid brass euro profile cylinder in a satin nickel finish (SN)…”，“Zinc alloy lever handle in a stainless steel finish (SS)…”（底材和表面分开写）。
- **不补**的 14 条（DV04、FB001/005/017、L002–L026 各门闩）：这些摘要来自图纸；硬件配件类导入时一律是“Zinc Alloy”，像是品类默认值，而 L016 的图纸摘要写的是“zinc-plated body”（像镀锌钢），两者可能矛盾。**请规格会话或工厂确认这些配件的 `material` 是否逐条准确。**

顺带：HYDE 记录葡语摘要“em inox em aço inoxidável”重复 17 处改为“em inox”（雷茵记录同样问题未动）。

测试：`npm test` 409/409。发布：已按新规矩请工程会话发布。
