# 长尾词成果汇报

**生成于 2026-09-24**，由 `scripts/build-longtail-report.mjs` 从产品记录、品类表和买家查询数据现场计算。重跑就是最新状态。

## 一句话

全站 590 个 HYDE 产品页、15 个品类页，三种语言的搜索标题都按「买家怎么搜」重写了。产品标题里带长尾成分（尺寸、用途场景或材质）的比例：英文 97%，西语 97%，葡语 96%。所有数字都照抄产品记录，没有一个是编的；认证和防火等级一个字都没写。

## 为什么要改：被看见了，但没人点

Search Console 2026-06-24 → 09-22 的数据（`docs/research/analytics/2026-09-22/`）：

| 页面 | 展示 | 点击 | 问题 |
|---|---|---|---|
| 主钥匙文章 | 243 | 0 | 买家搜「master keying system chart」153 次，标题里没有 Chart |
| 合页品类页 | 79 | 0 | 标题是「Brass & Steel Door Hinges — Manufacturer」，买家搜的是 brass door hinge manufacturer、ss hinges |
| 闭门器品类页 | 72 | 0 | 买家搜 door closer manufacturer、china door closer |
| 型号查询 fb005 / bh28 / 564mb | 12–17 | 0 | 排第 3–7 名却零点击：标题只有型号和品类名，没有买家要核对的尺寸 |

排名已经有了，缺的是搜索结果里那两行字对上买家的问题。长尾词的任务是**让人点进来**，不只是排上去。

## 规则：哪些可以写，哪些只能照抄

| 成分 | 能不能「组合、生成」 | 例子 |
|---|---|---|
| 买家用语的品类名 | 可以，用买家的叫法 | panic bar、barra antipánico、mola aérea |
| 用途场景 | 可以，前提是这个型号真的装得上 | for Single and Double Doors、para puertas corredizas |
| 供应商词 | 可以，每个标题最多一个 | China Manufacturer、fábrica en China |
| 型号、尺寸、材质 | **只能照抄产品记录** | LC04 的 85mm 中心距、60mm backset |
| 认证、防火等级、标准号 | **永远不写**（没有证书） | 不写 Fire Rated、ANSI、UL |

标题正文不超过 60 个字符（站名放最后，被截掉也无妨）。描述是完整句子，不超过 150 个字符，不用「…」截断。

## 买家先打数字还是先打场景（决定标题顺序）

| 品类 | 查询数 | 加权 | 数字型 | 场景型 | 泛称 | 标题先放 |
| --- | --- | --- | --- | --- | --- | --- |
| 锁芯 | 31 | 227 | 1% | 4% | 95% | 场景 |
| 推杠 / 逃生 | 32 | 121 | 10% | 25% | 65% | 场景 |
| 外装锁 / 夜锁 | 10 | 42 | 48% | 0% | 52% | 数字 |
| 合页 | 12 | 34 | 12% | 21% | 68% | 场景 |
| 插芯锁体 | 14 | 28 | 57% | 4% | 39% | 数字 |
| 闭门器 / 门挡 / 插销 | 8 | 22 | 32% | 64% | 5% | 场景 |
| 把手 / 执手 | 9 | 13 | 46% | 15% | 38% | 数字 |

读法：锁体、夜锁、执手先放数字；推杠、合页、闭门器先放场景。大部分查询只有品类名，所以**品类名用买家的叫法**是最重要的一个长尾词。

## 品类页：加了什么词、为什么

| 品类 | 英文 | 西语 | 葡语 | 为什么 |
|---|---|---|---|---|
| Panic Exit Devices | Panic Bars & Exit Devices for Single and Double Doors | Barras antipánico para puertas simples y dobles | Barras antipânico para portas simples e duplas | 买家原话：anti panic door、fire exit door with panic bar double、two point panic bar。单门、双门型号都有。不写 Fire，因为防火等级没有证书。 |
| Night Latches & Rim Locks | Rim Night Latches & Rim Locks, China Manufacturer | Cerraduras de sobreponer, fábrica en China | Fechaduras de sobrepor, fábrica na China | 买家原话：rim night latch、night latch rim lock、rim nightlatch（夜锁 10 条查询，一半带型号数字）。backset 不写进标题：大多数是 60mm，但也有 50、40mm。 |
| Stainless Steel Handles | Stainless Steel Door Pull Handles, China Manufacturer | Tiradores de acero inoxidable para puertas | Puxadores de aço inox para portas | 45 款全部是不锈钢，所以材质可以写进品类标题；「China Manufacturer」对应 china … handle 这类找工厂的查询。 |
| Lever Handles | Lever Handle Sets for Entrance, Privacy & Passage Doors | Manijas de palanca para puertas de entrada, baño y paso | Maçanetas de alavanca para entrada, banheiro e passagem | 品类摘要里写明入户、卧室（隐私）、通道三种功能，都是买家按门选执手的叫法。 |
| Knob Locks | Cylindrical & Tubular Knob Locks, Entry, Privacy, Passage | Cerraduras de perilla cilíndricas y tubulares | Fechaduras tubulares e cilíndricas com maçaneta bola | 买家找这类锁用的是 cylindrical lock / tubular lock，功能词同上。 |
| Bathroom Accessories | Stainless Steel Bathroom Accessories for Hotels & Washrooms | Accesorios de baño de acero inoxidable para hoteles | Acessórios de banheiro em aço inox para hotéis | 55 款全部是不锈钢；酒店和卫生间工程是这一类的主要用途（品类定位）。 |
| Brass & Steel Door Hinges | Stainless Steel & Brass Door Hinges, China Manufacturer | Bisagras de acero inoxidable y latón para puertas | Dobradiças de aço inox e latão para portas | 买家原话：brass door hinge manufacturer、china … steel hinge、ss hinges price list。29 款以不锈钢为主，也有黄铜。 |
| Deadbolts | Deadbolts, 25mm Throw, Single & Double Cylinder | Cerrojos de seguridad con pasador de 25 mm | Fechaduras auxiliares com lingueta de 25 mm | 品类摘要写明的事实：25mm 锁舌行程、单双锁芯。 |
| Door Closers | Door Closers for Commercial Doors, China Manufacturer | Cierrapuertas para puertas comerciales, fábrica en China | Molas aéreas para portas comerciais | 买家原话：door closer manufacturer、china door closer。 |
| Grip Handle Sets | Grip Handle Sets for Entrance & Sliding Doors | Juegos de tirador con placa para puertas de entrada | Conjuntos de puxador com espelho para portas de entrada | 品类摘要：用于入户门和推拉门。 |
| Glass Door Accessories | Glass Door Patch Fittings & Handles for Frameless Doors | Herrajes para puertas de vidrio templado | Ferragens para portas de vidro temperado | 无框玻璃门是这类五金唯一的用途；西葡用「vidrio templado / vidro temperado」，因为那边买家就是这么搜玻璃门五金的。 |
| Hardware Accessories | Door Stops, Flush Bolts, Viewers & Latches | Topes, pasadores, mirillas y pestillos para puertas | Batedores, fechos, olho mágico e trincos para portas | 把子类名直接写进标题（门挡、插销、猫眼、门闩），「hardware accessories」这个词没人搜。 |
| Lock Cases | Mortise Lock Cases by Backset & Center Distance | Cerraduras de embutir por entrada y distancia entre ejes | Fechaduras de embutir por distância e entre centros | 锁体买家按 backset 和中心距选型（锁体查询 57% 带数字）；具体数字写在每个型号的标题里。 |
| Lock Cylinders | Lock Cylinders, Euro & Oval Profile, Master Key Systems | Cilindros de perfil europeo y ovalado, llave maestra | Cilindros perfil europeu e oval para chave mestra | 品类里有欧标和椭圆两种型材，并且用于主钥匙系统。「master keying system chart」是全站展示最多的一条查询（153 次）。 |
| Sliding Hook Locks | Sliding Door Hook Locks, Zinc Alloy | Cerraduras de gancho para puertas corredizas | Fechaduras de gancho para portas de correr | 3 款都是锌合金；推拉门是唯一用途。 |

## 产品页：按品类统计

标题由生成器 `scripts/build-product-titles.mjs` 统一产出：型号 → 买家用语的品类名 → 尺寸或场景 → 材质。按品类的公式见方案第七节。

| 品类 | 产品数 | 英文带尺寸 | 带场景 | 带材质 | 例子 |
|---|---|---|---|---|---|
| Panic Exit Devices | 49 | 39% | 73% | 16% | 001 Panic Exit Device Trim, 300×75mm, 304SS |
| Night Latches & Rim Locks | 25 | 88% | 32% | 20% | 1073D Night Latch And Rim Lock, 60mm backset, Iron Case |
| Stainless Steel Handles | 45 | 78% | 76% | 98% | 600 Concealed Sliding Door Handle, 60–70mm backset |
| Lever Handles | 64 | 88% | 14% | 80% | 3431 SNET Lever Handle, 60/70mm backset, Zinc Alloy |
| Knob Locks | 92 | 53% | 18% | 61% | 575 ABET Tubular Lock, 60–70mm backset, Stainless Steel |
| Bathroom Accessories | 55 | 55% | 55% | 47% | BH01 Bathroom Accessories, 300–1000mm, Stainless Steel |
| Brass & Steel Door Hinges | 29 | 31% | 76% | 76% | 6*3*3mm 201 / 304 Stainless Steel Door Hinge for Doors |
| Deadbolts | 11 | 82% | 18% | 9% | D101 AB Deadbolts, 60–70mm backset |
| Door Closers | 9 | 0% | 100% | 89% | JU-051 Door Closer for Controlled Closing, Aluminum |
| Grip Handle Sets | 16 | 81% | 19% | 81% | 70610 AB Grip Handle Set, 60–70mm backset, Zinc Alloy |
| Glass Door Accessories | 26 | 65% | 31% | 42% | 100-30MM Glass Door Handle, Stainless Steel |
| Hardware Accessories | 63 | 49% | 86% | 37% | 200 Indicator for Washroom & Cubicle Doors, Zinc Alloy |
| Lock Cases | 58 | 62% | 38% | 3% | 140 Mortise Lock Case, 72mm center, 25mm backset |
| Lock Cylinders | 45 | 27% | 100% | 7% | 45BN Lock Cylinder for Mortise & Rim Locks, 45mm |
| Sliding Hook Locks | 3 | 100% | 100% | 0% | 881 SS Sliding Hook Lock for Sliding & Pocket Doors, 160mm |

三语对照（每类一例）：

| 型号 | 英文 | 西语 | 葡语 |
|---|---|---|---|
| 001 | 001 Panic Exit Device Trim, 300×75mm, 304SS | 001 Guarnición exterior para barra antipánico, 300×75mm | 001 Maçaneta externa para barra antipânico, 300×75mm |
| 100-30MM | 100-30MM Glass Door Handle, Stainless Steel | 100-30MM Tirador para puerta de vidrio, Acero inoxidable | 100-30MM Puxador para porta de vidro, Aço inoxidável |
| 1073D | 1073D Night Latch And Rim Lock, 60mm backset, Iron Case | 1073D Cerradura de sobreponer, entrada 60mm, Caja de hierro | 1073D Fechadura de sobrepor, distância 60mm, Caixa de ferro |
| 140 | 140 Mortise Lock Case, 72mm center, 25mm backset | 140 Cerradura de embutir, ejes 72 mm, entrada 25 mm | 140 Fechadura de embutir, centros 72 mm, eixo 25 mm |
| 200 | 200 Indicator for Washroom & Cubicle Doors, Zinc Alloy | 200 Indicador de libre y ocupado, Zamak | 200 Indicador para portas de banheiro e de box, Zamak |
| 3431 SNET | 3431 SNET Lever Handle, 60/70mm backset, Zinc Alloy | 3431 SNET Manija de palanca, entrada 60/70mm, Zamak | 3431 SNET Maçaneta de alavanca, distância 60/70mm, Zamak |
| 45BN | 45BN Lock Cylinder for Mortise & Rim Locks, 45mm | 45BN Cilindro de cerradura, 45mm, Latón macizo | 45BN Cilindro para fechaduras de embutir e de sobrepor, 45mm |
| 575 ABET | 575 ABET Tubular Lock, 60–70mm backset, Stainless Steel | 575 ABET Cerradura tubular, entrada 60–70mm | 575 ABET Fechadura tubular, distância 60–70mm |
| 6*3*3mm | 6*3*3mm 201 / 304 Stainless Steel Door Hinge for Doors | 6*3*3mm Bisagra de acero inoxidable 201 / 304 | 6*3*3mm Dobradiça de aço inoxidável 201 / 304 |
| 600 | 600 Concealed Sliding Door Handle, 60–70mm backset | 600 Tirador oculto para puerta corredera, entrada 60–70mm | 600 Puxador embutido para porta de correr, distância 60–70mm |
| 70610 AB | 70610 AB Grip Handle Set, 60–70mm backset, Zinc Alloy | 70610 AB Juego de manillón, entrada 60–70mm, Zamak | 70610 AB Conjunto de puxador, distância 60–70mm, Zamak |
| 881 SS | 881 SS Sliding Hook Lock for Sliding & Pocket Doors, 160mm | 881 SS Cerradura de gancho para puerta corredera, 160mm | 881 SS Fechadura de gancho para porta de correr, 160mm |
| BH01 | BH01 Bathroom Accessories, 300–1000mm, Stainless Steel | BH01 Accesorios de baño, 300–1000mm, Acero inoxidable | BH01 Acessórios de banheiro, 300–1000mm, Aço inoxidável |
| D101 AB | D101 AB Deadbolts, 60–70mm backset | D101 AB Cerrojo de seguridad, entrada 60–70mm | D101 AB Trincos, distância 60–70mm |

## 顺带修掉的事实错误（改标题时发现的）

| 问题 | 怎么改的 |
|---|---|
| 306 PS 是通道推杠，自己没有锁舌，西葡描述却写「用于逃生与出口门」 | 改成「用于装插芯锁的门」；这是安全问题，不是措辞问题 |
| 网址 ansi-grade-3-keyed-deadbolt-lock-set 写着 ANSI Grade 3，我们没有 ANSI 认证 | 网址改为 keyed-deadbolt-lock-set，旧网址 301 |
| 14 条门闩、插销、猫眼被归在「指示器」下，描述里写着「有人 / 无人」 | 按记录自己的名字移回正确子类，标题描述随之更正 |
| 夜锁品类介绍写「60mm backset」，实际还有 50mm、40mm 的型号 | 三语改为「大多数 60mm」 |
| 所有葡语品类页标题后缀是西语「Fabricante y proveedor」 | 改为「Fabricante e fornecedor」 |
| 西葡描述里同一句出现两次 para（「guarnición exterior para barra antipánico para puertas…」） | 59 处 → 0 |
| 英文全站原来按英国拼法写，面向的却是美国买家 | 全站改美式（中心距、目录、铝等 70 多个词），npm test 守着 |

## 怎么知道有没有用

1. **10 月 8 日前后**看上面四类页面在 Search Console 里的点击率（改之前全是 0%）。
2. 以后每周导一次四个看板的数据（`docs/collaboration/DATA-DASHBOARDS.md`），先改「展示 ≥30、点击率 <1%」的页面。
3. GA4 从这次发布起记录阅读方式和产品点击：能看出点进来的人是快速滑过还是认真读，读完有没有点进产品。

## 还没做的

- 新闻和指南的搜索标题：按每周的机会清单逐篇改，不一次性全改（没有数据支撑的改动可能反而掉排名）。
- 约 120 个 HYDE 产品没有任何规格行，标题只能写型号和品类名。要工厂补尺寸（给工厂的问题清单里）。
- 10 个产品名字太长，放不下长尾词（生成器列为警告），要改名字才能改善。
