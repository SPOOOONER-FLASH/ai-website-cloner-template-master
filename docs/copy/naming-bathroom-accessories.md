# 卫浴 54 个 “Bathroom Accessories” 逐个命名（2026-09-24，Claude 文案）

依据：每个型号的主图，看不清的再看图库（场景图、尺寸图），外加规格行。**名称里不写材质**：标题生成器会拼出 `{型号} {名称}, {尺寸}, {材质}`，材质已经在后面了。同一种东西用同一个名字，由型号区分；只有看得出是不同东西时才换名字。西语按 D1（RAE，拉美通用）；葡语按巴西用法，避开 trinco/lingueta（待办 0c）。

## 命名表

| 型号 | 图上是什么 | EN name | ES nameEs | PT namePt |
|---|---|---|---|---|
| BH01 | 直扶手，圆座 | Grab Bar | Barra de apoyo | Barra de apoio |
| BH02 | 直扶手，中段滚花 | Knurled Grab Bar | Barra de apoyo moleteada | Barra de apoio recartilhada |
| BH03、BH04 | 折角扶手，415 mm | Angled Grab Bar | Barra de apoyo en ángulo | Barra de apoio angular |
| BH05–BH09 | 长条底板上一排挂钩（1–8 钩 / 4 钩） | Hook Rail | Perchero de pared | Cabideiro de parede |
| BH10–BH14、BH38–BH42 | 单个挂钩（圆座、方座、3M 或螺丝固定；BH40 黑色） | Robe Hook | Gancho de pared | Gancho de parede |
| BH36、BH37 | 上下双叉挂钩 | Coat and Hat Hook | Gancho para abrigo y sombrero | Gancho para casaco e chapéu |
| BH54 | 圆座双钩 | Double Robe Hook | Gancho doble de pared | Gancho duplo de parede |
| BH15、BH15-80mm、BH15-100mm | 圆杆插销，80 / 100 mm | Barrel Bolt | Pasador de sobreponer | Ferrolho de sobrepor |
| BH16 | 扁插销，带拨片和箭头（场景图装在门上） | Flat Slide Bolt | Pasador plano | Ferrolho chato |
| BH17 | 斜面弹簧舌，明装（尺寸图：舌 12 mm、伸出 8 mm） | Spring Latch | Pestillo de resorte de sobreponer | Fecho de mola de sobrepor |
| BH18 | 毛巾环 | Towel Ring | Toallero de aro | Porta-toalha de argola |
| BH19、BH21、BH22、BH43 | 卷纸架（BH19 场景图确认） | Toilet Roll Holder | Portarrollos | Porta-papel higiênico |
| BH20 | 带盖卷纸架 | Toilet Roll Holder with Cover | Portarrollos con tapa | Porta-papel higiênico com tampa |
| BH23 | 带置物板卷纸架 | Toilet Roll Holder with Shelf | Portarrollos con repisa | Porta-papel higiênico com prateleira |
| BH24 | 擦手纸盒，280 × 215 × 100 mm | Paper Towel Dispenser | Dispensador de toallas de papel | Dispenser de papel toalha |
| BH25 | 带锁大卷纸盒 | Jumbo Roll Dispenser | Dispensador de papel higiénico jumbo | Dispenser de papel higiênico rolão |
| BH26 | 磨砂玻璃皂碟 | Soap Dish | Jabonera | Saboneteira |
| BH27 | 网篮皂碟 | Wire Soap Dish | Jabonera de rejilla | Saboneteira aramada |
| BH28 | 长方网篮 | Shower Basket | Canasta para ducha | Cesto aramado para banho |
| BH29 | 三角网篮 | Corner Shower Basket | Canasta esquinera para ducha | Cesto aramado de canto |
| BH30、BH31 | 双层转角网篮 | Two-Tier Corner Shower Basket | Canasta esquinera doble para ducha | Cesto aramado de canto duplo |
| BH32 | 毛巾架，带挂钩 | Towel Shelf with Hooks | Repisa toallero con ganchos | Prateleira porta-toalhas com ganchos |
| BH33 | 管式毛巾架，下带横杆 | Towel Shelf | Repisa toallero | Prateleira porta-toalhas |
| BH34 | 单杆毛巾杆 | Towel Bar | Toallero de barra | Porta-toalha de barra |
| BH35 | 皂液器 | Soap Dispenser | Dispensador de jabón | Dispenser de sabonete |
| BH50 | 双层长方置物架 | Two-Tier Shower Shelf | Repisa doble para ducha | Prateleira dupla para box |
| BH51 | 单层长方置物架 | Shower Shelf | Repisa para ducha | Prateleira para box |
| BH52 | 双层转角置物架 | Two-Tier Corner Shower Shelf | Repisa esquinera doble para ducha | Prateleira de canto dupla para box |
| BH53 | 单层转角置物架 | Corner Shower Shelf | Repisa esquinera para ducha | Prateleira de canto para box |
| BH55 | 翻折淋浴凳 | Fold-Down Shower Seat | Asiento de ducha abatible | Assento de banho rebatível |
| BH56、BH58 | 上翻扶手 | Flip-Up Grab Bar | Barra de apoyo abatible | Barra de apoio rebatível |
| BH57 | 双杆上翻扶手 | Double Flip-Up Grab Bar | Barra de apoyo abatible doble | Barra de apoio rebatível dupla |

合计 54 个型号，32 个名字。

## 顺带发现，归工程会话定

| 事项 | 说明 |
|---|---|
| BH15、BH16、BH17 分错了类 | 规格行写的是 “Application=Door Security”，图上是门用插销和弹簧舌，不是卫浴配件。可以考虑移到 `hardware-accessories/latches`。 |
| 扶手和淋浴凳 | BH01–04、BH56–58、BH55 是关怀类产品。`care-grab-bars` 这个类目已经有了，要不要移过去，归你们定。 |
| slug | 现在的 slug 都是 `bh01-bathroom-accessories` 这种。改名后要不要改 slug 并做 301，归你们定；不改 slug 也不影响页面。 |
| 翻译表 | 两个翻译生成器遇到没登记的名称会报错停下，所以 32 个新名字要在 `src/data/es-glossary.ts` 的 PRODUCT_NAMES_ES 和 `src/data/pt-glossary.ts` 的名称表里各加一行。 |
| 标题和 SEO | 改名后需要重跑 `build-product-titles.mjs`。 |
