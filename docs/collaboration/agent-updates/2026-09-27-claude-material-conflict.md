# 2026-09-27 · Claude · 三条记录的材质与自己的图纸说明矛盾；清空而不是猜

文案会话报的疑点：五金配件类 14 条 material 一律 `Zinc Alloy`，像品类默认值，而 L016 的
摘要写的是 `zinc-plated body`。查下来结论比这更具体，也更窄。

## 「品类默认值」这个解释不成立

把三个品类的 material 全量列出来就看得见：

| 品类 | material 分布 |
|---|---|
| latches | Stainless Steel ×5、**空 ×10**、Zinc Alloy ×8 |
| door-viewers | Brass ×7、Zinc Alloy ×2、Brass/Zinc Alloy ×3、ABS/Plastic ×2 |
| door-flush-bolts | Stainless Steel ×6、Zinc Alloy ×3、Brass ×1、Stainless Steel/Brass ×2 |

不是一律。而且有两条**自带独立佐证**：`DV08 SN` 和 `L018` 的 `specs` 里另有一行
`Material = Zinc alloy`，`L018` 的摘要也写着 `Zinc alloy latch`。所以不能把这 14 条
当成一批默认值一起处理。

## 真正矛盾的是三条，不是十四条

用「记录自己的文字是否提到别的材质」扫了一遍，排除掉假阳性之后：

| 记录 | 摘要（按图纸写的） | material |
|---|---|---|
| L016 | Tubular latch … and a **zinc-plated** body | Zinc Alloy |
| L025 | Tubular latch … and a **zinc-plated** body | Zinc Alloy |
| L026 | Tubular latch with a cylindrical **zinc-plated** body | Zinc Alloy |

排除掉的假阳性值得记下，免得下次重扫又当成问题：`L008` 的「round brass **pin**」是零件不是机体；
`FB005 AC` 的「antique copper」是**饰面**不是材质；`DV07/08/10` 的 material 本来就写着
`Brass/Zinc Alloy`，摘要提黄铜是一致的；`DV08 SN` 的黄铜来自 Finish 串。

西语侧独立佐证了这个读法：这三条的 `summaryEs` 早就写着 **cuerpo zincado**（镀锌机体）。

## 为什么是清空，不是改成「镀锌钢」

镀锌和锌合金是两种东西——**镀锌是钢件表面镀一层锌，锌合金是压铸件**——买家挑耐腐蚀和强度时
正是在这两者之间选。所以留着 `Zinc Alloy` 等于发布一个大概率错误的规格。

但也不能改成「Zinc-plated steel」：**摘要说的是镀层，没说底材**。「镀锌的什么」在整条记录里
没有任何地方写过，写成钢就是猜。按甲方那条「说不知道的，破折号比一个貌似合理的数字更可信」，
`material` 清空，`content-health` 的 `noMaterial` 会把它们计进去。

三条都在 `specSources.material` 里记了 `basis: "conflict-unresolved"`、原值、以及要问工厂的
那一句，所以下一个会话不会把它当成「漏填」又照品类补回去。

**影响面已核过**：这三条 `specs` 是 0 行、`finishes` 是空数组，所以 `material` 是页面上
唯一的材质陈述，清空不会让任何规格行变空；也不经过 `bhmaFinish(part, product.material)`，
不影响 BHMA 底材推导。

## 问题进了工厂待填表，而且会自己消失

`scripts/build-factory-gap-sheet.mjs` 加了第四节，**数据来源是 `specSources` 而不是手写名单**：
填上材质、删掉那个 `specSources.material` 块，这一行就不再打印。问法只有一句——
「是锌合金压铸，还是镀锌的钢？如果是镀锌，底材是什么？」

    一、未确认订货代码   5 个：N KT IK PT BS
    二、面板尺寸         5 个型号待填
    三、固定孔           149 个，归成 10 个系列
    四、材质对不上       3 个型号：L016 L025 L026

## 其余十一条没动

`DV04`、`FB001`、`FB017`、`L002`、`L009`、`L010`、`L019`、`L023`、`L024` 等没有任何
内部矛盾，也没有证据说它们错。既然「品类默认值」不成立，就没有理由一起清空——
清空会删掉可能正确的信息。它们仍在工厂问题清单里（09-24 已记），等逐条确认。

## 测试

`product-donor-fields`、`product-sites`、`product-finder`、`spec-table-parity`、
`bhma-finish`、`us-spelling` 共 39 项通过。`copy:drift` 两段为 0，`copy:prose --check` 干净。
