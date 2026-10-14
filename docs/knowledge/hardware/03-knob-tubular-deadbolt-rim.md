# 03 球形锁 / 筒式锁 / 单头锁舌锁（Deadbolt）/ 外装夜闩锁（Rim night latch）

> 适用 categoryPath：`knob-locks/*`（tubular-locks、light-duty-cylindrical-locks、heavy-duty-cylindrical-locks、commercial-locks）、`deadbolts`、`night-latches-rim-locks`。
> HYDE 站共 129 条记录：筒式 36、轻型圆柱 16、重型圆柱 35、商用功能 5、单头锁舌 12、外装夜闩 25（2026-10-14 按 `sites` 过滤统计）。
> 本章只写行业通用知识和我们 JSON 里写明的内容。任何"我们工厂怎么做"的说法，JSON 里没有就不写。
> 本章不声明、不暗示任何产品通过任何认证。

---

## 1. 是什么、怎么工作

### 1.1 三大类的区别（一句话）

| 类 | 装在哪 | 核心动作 |
|---|---|---|
| 筒式锁（Tubular lock）/ 圆柱锁（Cylindrical lock），俗称球形锁 | 门扇上一个大横孔（Cross bore）+ 门边一个小边孔（Edge bore） | 转执手 → 中心传动 → 斜舌（Latch bolt）缩回 |
| 单头锁舌锁（Deadbolt，辅助锁 Auxiliary lock） | 同样的横孔 + 边孔，通常在球锁上方 | 钥匙或拧钮（Thumbturn）转动 → 方舌（Deadbolt）伸出 / 缩回，不靠弹簧 |
| 外装夜闩 / 外装锁（Rim night latch / Rim lock） | 锁体装在门内侧表面，只有锁芯穿过门 | 外侧钥匙或内侧旋钮 → 拉回斜舌；部分型号另带方舌、防盗链 |

### 1.2 筒式锁 vs 圆柱锁：结构差别

- **筒式锁**：内、外两个半套 + 一个斜舌，靠中心轴/传动件把转动传到斜舌。结构简单、装得快，几乎不用调整；缺点是中心传动在大扭力下容易损伤。
- **圆柱锁（重型）**：一个整体底盘（Chassis）装进横孔，**穿门螺栓（Through-bolts）**把内外两侧锁在一起，通常落在 2-1/8″ 横孔之外，用来抵抗执手扭力。底盘贵、功能可做得更多、通常更耐用。
- 两者都可以配相同的弹子锁芯（Pin-tumbler cylinder）。"Tubular" 在美国锁匠圈也指自动售货机那种圆形锁芯，不要混用。

### 1.3 斜舌动作链（球形锁）

钥匙/执手转动 → 执手轴（Spindle）带动凸轮/拨块 → 拉动斜舌尾部 → 斜舌缩回 → 门打开；松手后复位弹簧（Spring cage）把执手拉回，斜舌弹出。
关门时：斜舌斜面碰到锁扣板（Strike）的弧形唇口（Curved lip）→ 斜舌被压回 → 进入扣板孔后弹出 → 门被锁住。

**防撬保险柱（Deadlocking plunger / Guardbolt）**：斜舌旁边那根小柱。门关好时它被扣板平面压住（不进扣板孔），此时斜舌被锁死，不能用卡片从门缝撬回。Kwikset 安装说明明确写："如果小柱进入了扣板孔，就要重新定位扣板"。我们 JSON 写作 "Deadlocking on keyed functions"（有钥匙的功能才带保险柱）。

### 1.4 2-1/8″ 横孔、60/70 可调斜舌

- 北美标准门孔：横孔 **2-1/8″（54 mm）**，边孔 **1″（25 mm）**。（Kwikset 安装说明）
- **背距（Backset）** = 门边到横孔中心的距离。标准 **2-3/8″（60 mm）**，可选 **2-3/4″（70 mm）**。
- **60/70 可调斜舌**：斜舌壳体是两段伸缩结构，拨动/推动定位销后把斜舌拉长或缩短，在 60 和 70 之间切换（Kwikset："移动销子使斜舌伸长"）。我们 575/576/592/595/598/607/609/6082 的 JSON 写 "60mm / 70mm adjustable"。
- 更长背距（如 Schlage A 系列的 95 mm、127 mm）是**另外一只斜舌**，不是可调范围（Schlage A 系列规格页把它们列为 Optional 独立选项）。

### 1.5 打入式斜舌（Drive-in latch）vs 面板式斜舌（Faceplate latch）

| | 面板式 | 打入式 |
|---|---|---|
| 门边外观 | 一块矩形面板（如 1″×2-1/4″，Kwikset；Schlage A 系列 1-1/8″×2-1/4″），两颗螺丝 | 只有一个圆形套环（Drive-in collar），**没有螺丝** |
| 门边加工 | 要凿面板槽（Mortise） | 只钻 1″ 圆孔，用木块垫着锤入 |
| 适用 | 通用；防火门一般要求面板式 | 翻新、快速安装；Schlage 标注 drive-in/round face 为 "non-UL" |

我们 592/595/607 的 JSON 写 "Optional: 1″ round drive-in 4-way latch"（可选打入式）。**578 SSET 的实拍图（`578-sset-light-duty-cylindrical-lock.webp`）是打入式斜舌**：带滚花套环、无面板。审图记录里 578-2 就因为 AI 画成两颗螺丝的方面板而判"不通过"。

### 1.6 单头锁舌锁（Deadbolt）

- 动作链：外侧钥匙 → 锁芯尾片/驱动杆（Driver bar / Tailpiece）→ 穿过锁舌壳体的 "+" 形孔 → 带动方舌伸出/缩回；内侧拧钮带动同一根驱动杆。
- 方舌**不带弹簧**，关门不会自己锁，必须人去转。
- **单头（Single cylinder）**：外钥匙 + 内拧钮。我们 D101 JSON："Function: Single cylinder"。
- **双头（Double cylinder）**：内外都要钥匙。玻璃门旁常用（防止打碎玻璃伸手拧开），但在逃生门上属于"例外许可"，见第 4 节。
- **自由旋转锁芯外罩（Free-turning / spin ring）**：外罩能空转，管钳夹住也拧不动锁芯。D101/D102 JSON 写有此项；Grandeur 安装说明也有 "spin ring"。
- 我们 D101/D102：方舌 25 mm（1″），锌合金压铸，内嵌淬火钢滚柱（防锯）；门厚 35–45 mm；背距 60/70 可调。
- **D104 不是单头锁舌锁**：JSON 写的是"给榫槽式锁体（Mortise deadlock）用的锁芯 + 拧钮"，只有锁芯和旋钮，不含锁体。

### 1.7 外装夜闩（Rim night latch）

动作链：外侧锁芯 → 扁平连接片（Flat connecting bar / Tail bar）穿过门 → 插入锁体背面的旋转槽 → 拉回斜舌；内侧直接拧锁体上的旋钮（Knob / Puller）→ 拉回斜舌。关门时斜舌自动进入门框上的锁扣盒（Staple / Keeper）。

- **Snib（小按钮/小滑块）**：行业里有两种用法，务必区分：
  1. **留门（Hold-back）**：把斜舌固定在缩回位置，门可随手推开（Yale P89 说明第 6 步："用锁壳正面的按钮把锁扣在打开状态"）。
  2. **反锁（Deadlocking）**：按下后外侧钥匙/卡片都拉不回斜舌。我们 JSON 统一写："13 mm 斜舌，带内侧反锁按钮（inside deadlocking button）"；G559 写明"防止外侧钥匙操作和撬舌"。
  我们的锁是否同时具备留门功能，JSON 未写，**待核实**。
- **钥匙反转反锁**（Yale P89）：外侧钥匙反转一下，把室内旋钮也锁住，防止打碎玻璃伸手开门。我们的型号是否有此功能，**待核实**。
- **外装方舌锁（Rim deadbolt）**：我们 JSON 写 "Deadbolt throw: 25mm on rim deadbolt versions"。5688/5689 是"双头、双行程（double throw）"；5835/5836 方舌"两/三行程（two/three-throw）"——钥匙每转一圈方舌多伸出一段。
- **电控外装锁**：1073D / 1073S。JSON：支持电控和手动、可接对讲/门禁、带信号反馈。实拍 `1073d-night-latch-and-rim-lock.webp` 可见：锁芯、旁边一个按钮、两根引线、门框侧扣盒。电压、断电开/断电关**未写，待核实**。

### 1.8 防盗链（Door chain）挂在外装锁上

- 独立防盗链的通用装法（Yale/ASSA ABLOY MC30 说明）：**滑槽板（Slide plate）装门扇**，**扣板/挂钩（Keeper）装门框**，两者同一高度；画线时两者间距 10–50 mm；位置在执手上方或下方，小孩够得到。
- 我们的拉美式外装锁（5681、5682、G559）把链条做在**门框侧锁扣盒**上：实拍 `5681-night-latch-and-rim-lock.webp` 链条一端固定在扣盒顶部，另一端是带长槽的挂片。挂片挂在锁体哪个位置，照片看不清，**待核实（看实物或视频）**。
- G559 实拍防盗链是银色不锈钢链；审图 g559-7 因为 AI 画成金色链（同框两种表面）判"不通过"。

---

## 2. 装在哪里、怎么装

### 2.1 门类型与材质

| 产品 | 门 | 依据 |
|---|---|---|
| 筒式/圆柱锁 | 木门、空心门、钢门（钢门需按 ANSI 预开孔） | 通用 |
| 单头锁舌锁 | 入户门，常与入户球锁配对 | D101 JSON "Application: Entrance doors" |
| 外装夜闩 | 木门、铁门（铁门可焊接安装） | 564 JSON "Wooden / Metal Doors"；5835/5836 "Screws or welding"；5833 "Iron Door"；5688 "wooden or iron doors" |

### 2.2 门厚

| 系列 | JSON 门厚 |
|---|---|
| 筒式 575/576/592/595/598/607/609/6082 | 35–45 mm 可调 |
| 587、5871 特征行 | 35–50 mm（1-3/8″–2″） |
| 5831 SSET / 5870 ACET / 5874 ACET | 35–50 mm |
| 5807 / 5870 SSCC 商用功能 | 35–45 mm |
| D101 / D102 | 35–45 mm |
| 外装夜闩 | 35–55 mm 标准，30–60 mm 可订 |

参考：Kwikset 球锁标准 1-3/8″–1-3/4″，2-1/4″（57 mm）门要另配件；Yale P89 夜闩最大 57 mm（装门拉手时 54 mm）；Truper 外装锁 35–60 mm。

### 2.3 安装高度与背距

| 项目 | 典型值 | 来源 |
|---|---|---|
| 球锁横孔中心离地 | 约 38″（97 cm） | Kwikset 模板说明 |
| 单头锁舌锁中心 | 在球锁横孔中心**上方至少 5-1/2″（约 140 mm）** | Grandeur 单头锁说明 |
| 外装锁离地 | 90–100 cm | Truper CS-75/85 说明 |
| 外装夜闩背距 | 60 mm 或 40 mm（必须与锁体一致，否则锁芯孔对不上） | Yale P89；lockshop-warehouse |
| 我们夜闩背距 | 60 mm（多数）；50 mm（5833、5835、5836）；40 mm（S564） | JSON |

各国建筑规范对高度另有规定，以当地为准（**待核实**）。

### 2.4 开门方向、左右手

- **球锁、单头锁**：我们 JSON 均写 "Fully reversible, left or right hand"——左右门通用，只需把斜舌翻面。**斜舌斜面朝门框（关门方向）**（Kwikset："slant of latch bolt faces door frame"）。外装锁 / 拉美外装锁的左右手见下。
- **外装夜闩**：锁体装在**门的室内一面**，锁扣盒装在门框室内一面，与锁体对齐。
  - **内开门**：用**角形锁扣（Angle strike / 盒式扣）**——我们 JSON 标准配置。
  - **外开门**：需平扣（Flat strike）。我们 JSON 写"可选，不推荐"；Yale P89 写"本锁不适用外开门"。
  - 左右手：我们 JSON 写可换向。Truper 拉美外装锁则按左右门用不同钻孔位（B/C 右门，B1/C1 左门）。**下单前确认左右手和内外开**。
- **单头锁 / 入户球锁的"内外"**：钥匙一侧朝外（走廊/户外），拧钮/按钮一侧朝内。Kwikset 特别提醒：入户门上装通道锁时，带螺丝孔的执手必须在室内一侧。

### 2.5 门的开孔（典型尺寸）

**球锁 / 筒式锁（Kwikset）**

| 部位 | 尺寸 |
|---|---|
| 横孔 | 2-1/8″（54 mm）通孔，从一面钻到钻头穿出，再从另一面钻完（防崩边） |
| 边孔 | 1″（25 mm），钻到横孔 |
| 面板槽 | 按面板描线凿平；打入式斜舌不凿 |
| 扣板 | 扣板孔中心 = 从门挡条量回半个门厚；扣板孔至少 1″ 深 |

**单头锁舌锁（Grandeur 说明，门厚 1-3/4″–2-1/4″ 型号）**

| 部位 | 尺寸 |
|---|---|
| 横孔 | 2-1/8″ |
| 边孔 | 1″；背距 2-3/8″ 时**至少 3-1/2″ 深**，2-3/4″ 时**至少 3-3/4″ 深** |
| 面板槽 | 深 1/8″；面板螺丝孔 7/64″、至少 1″ 深 |
| 门框锁舌孔 | 两个 7/8″ 孔，中心在锁舌中心线上下各 5/16″，相互重叠，**每个至少 1-1/8″ 深**；放防尘盒（Dust box） |
| 门框加强板 | 两颗加强螺丝，孔 7/64″ × **3″ 深**（打进门框后面的墙骨） |

**外装夜闩（Yale P89）**

| 部位 | 尺寸 |
|---|---|
| 锁芯孔 | 32 mm 通孔，距门边 60 mm（40 mm 款按 40 mm） |
| 连接片 | 锯短到伸出安装底板 12 mm（lockshop-warehouse：伸出锁壳 10–20 mm） |
| 门厚 < 45 mm | 锁芯连接螺丝需锯短 |
| 底板 | 底板前凸缘距门边 1.5 mm |
| 锁扣盒 | 关门后以锁体为准在门框上画位，凿槽使扣盒齐平 |
| 安全间隙 | 锁体与扣盒间隙尽量小，**不得超过 5 mm** |

Truper 拉美外装锁：锁芯孔用 32 mm（1-1/4″）开孔器（可选），定位孔 6.5 mm 穿透门，螺丝预钻孔 2.5 mm 深约 2 cm，锁体用 38 mm 和 25 mm 木螺丝；锁扣"正对锁体"装在门框上。

### 2.6 必须配什么

| 产品 | 配套件 |
|---|---|
| 球锁 | 扣板（我们 JSON：57 mm 弧唇标准，70 mm 可订）、防尘盒、扣板螺丝；入户功能常与单头锁同钥（JSON "Can be keyed alike to deadbolts"） |
| 单头锁 | 门框扣板 + 防尘盒；有加强板时用长螺丝打进墙骨（Grandeur 说明） |
| 外装夜闩 | 锁芯 + 锁芯装饰圈（Rosette / ring）、连接片、门框锁扣盒、安装螺丝；我们 564 套装含铁锁芯装饰圈、铁装饰板、铁螺丝 |
| 防火门 | 必须有带弹簧斜舌的认证锁具；单头锁不能单独当防火门锁（idighardware） |

### 2.7 常见安装错误

1. 横孔一面钻穿 → 木门背面崩边。
2. 背距选错（60 vs 70）→ 斜舌和执手中心对不上；外装夜闩背距错 → 锁芯孔废掉。
3. 斜舌装反（斜面朝房内）→ 门关不上。
4. 扣板位置偏 → 防撬保险柱掉进扣板孔，斜舌不再被锁死。
5. 扣板螺丝太短；单头锁扣板不打长螺丝 → 一脚就能把门框踹开。
6. 单头锁边孔不够深 → 方舌伸不满，"锁上"其实只出一半。
7. 螺丝拧太紧 → 锁舌卡滞（Grandeur 说明两次提醒）。
8. 外装夜闩连接片太长/太短 → 钥匙转了带不动锁体。
9. 夜闩锁体与扣盒间隙超过 5 mm → 可被撬。
10. 外开门硬装角形锁扣（我们 JSON：外开门用平扣且不推荐）。
11. 给锁芯上油或刷漆（Yale：锁芯不可上油，润滑用含特氟龙的产品）。

---

## 3. 场景和展示怎么做才对（判图规则）

### 3.1 必须对的

**球锁 / 筒式锁**
- 两只执手**同轴、同高**，分别在门的两面；横孔被玫瑰盖（Rose）完全盖住。
- 执手中心距门**开启边（锁边）**约 60 或 70 mm，**绝不在铰链边**。
- 入户/仓库/教室功能：**钥匙孔在外侧执手**；内侧执手是按钮或旋钮（看实拍 `607-sset-tubular-lock-2.webp` 内侧球头有拧钮）。
- 通道（Passage）功能：两侧都没有钥匙孔。
- 浴室（Privacy）：内侧有按钮/拧钮，外侧**只有一个小应急孔或槽，没有钥匙孔**。
- 门边看到的斜舌类型必须与该型号实拍一致：578 是打入式圆套环；607/5870/5831 是带两颗螺丝的方面板。
- 一个画面只能有一种表面处理。

**单头锁舌锁**
- 在球锁正上方，同一门边，同一背距；外侧锥形锁芯外罩，内侧拧钮。
- 拧钮和钥匙孔**不会在同一个玫瑰盖上**（审图 d103-4 就是这个错误）。
- 双头型号内侧也是锁芯。
- 方舌形状照实拍：D101 是圆柱形方舌带滚柱，不是八角棱柱（审图 d101-ac-2）。

**外装夜闩**
- **锁体在门的室内一面、贴近开启边**；室外一面只看到锁芯和装饰圈。
- **锁扣盒在门框上，正对锁体**，斜舌/方舌朝向扣盒（审图 556-5、558-5、5688-5 都以此判通过）。
- 内开门用角形扣盒；门开着时，**门框上必须看得到扣盒**（审图 260-3 因门框上无扣盒判不通过；5682-2 同样）。
- 拉手/钩形拨杆（Puller）、旋钮、小按钮的位置、数量与实拍一致（5835/5836 钩形拨杆；5688 三角锁芯座；5681 双圆舌 + 链）。
- 带链型号：链在门框扣盒上，链和锁同一表面。
- 电控型号 1073D/1073S：有引线；引线走向要合理（进门扇内或沿门边线槽），**不要画成悬空乱飞**（**待核实**我们推荐的走线方式）。

### 3.2 物理上不可能的（见到就判错）

- 斜舌/方舌从**门的正面**伸出，或扣板装在门扇正面（审图 d104-9）。
- 锁装在铰链边；执手两侧高度不同；两侧不同轴。
- 外装锁体装在门的室外一面（除非是专门的户外型号，我们 JSON 没有此类）。
- 外开门上的角形扣盒（扣盒在门挡条外侧，门关不上）。
- 浴室锁外侧有钥匙孔；通道锁有锁芯。
- 单头锁和球锁画成一个整体（单头锁是独立部件）。
- 把工厂不按套卖的东西拼成一套：单头锁旁边加一套执手锁、球锁上方多一把单头锁（审图 d01-2、d101-ab-2、d102-pb-2、9210-pbet-2 均因此不通过）。
- 小五金旁边放重型工业件。

### 3.3 正常状态下看不见的

- **门关着**：斜舌、方舌、保险柱、扣板孔都看不见；只看得到门两面的执手/锁芯，以及（外装锁）锁体和扣盒的外壳。
- **门关着**：单头锁的方舌伸没伸出，从外面看不出来；只能靠拧钮方向（**拧钮朝向与锁舌状态的对应因型号而异，待核实**）。
- 筒式锁的底盘、弹簧、穿门螺栓**在门里**，装好后看不见；拆解图才能出现。
- 外装锁的连接片穿在门里，看不见。
- 防盗链只有在门开一条缝、链条挂上时才拉直。

---

## 4. 功能和使用

### 4.1 功能对照（ANSI A156.2 编号以 Schlage A 系列规格页为准）

| 功能 | ANSI | 动作 | 我们 JSON 用词 / 后缀 |
|---|---|---|---|
| 通道 Passage | F75 | 两侧执手一直可转 | "Passage"，后缀 PS |
| 浴室/卧室 Privacy | F76 | 内侧按钮锁外侧；内侧转执手或关门解除；外侧可用小螺丝刀从应急孔打开 | "Privacy, bathroom, turn button inside"，后缀 BK |
| 入户 Entrance | F109（转/按钮）等 | 外侧钥匙；内侧按钮锁外侧执手 | "Entrance, keyed outside"，后缀 ET |
| 储藏室 Storeroom | F86 | 外侧执手固定，只能用钥匙进；内侧永远可开 | 5807 SSR |
| 教室 Classroom | F84 | 外侧钥匙锁/开外侧执手；内侧永远可开 | 5807 SSCR |
| 连通 Communicating | F79 | 门两侧各自独立锁 | 5807 SSCL、5870 SSCC |
| 出口 Exit | — | 外侧盲板/固定，内侧可开 | 5807 SSEL "Exit latch" |
| 假锁 Dummy | — | 不转，当拉手 | 无 |

- F 编号各厂家对同一行为写法不一，下单以对方指定的 F 编号为准。功能一般出厂固定，现场改不了。
- 后缀 PT（587 SSPT）含义 JSON 未写，**待核实**。

### 4.2 浴室锁应急开启（Privacy emergency release）

外侧执手中心有一个小孔或一字槽。小孔型：用随锁附带的应急钥匙（一根细金属杆）捅入，顶开内部解锁杆；槽型：用硬币或螺丝刀转动。Schlage A 系列写"可从外侧用小螺丝刀打开"；Kwikset 提醒"保留卧室/浴室应急解锁工具"。拍浴室锁外侧时，应急孔/槽要画对，**不能画成钥匙孔**。我们 JSON 未写应急工具是否随附，**待核实**。

### 4.3 单头 vs 双头锁舌锁的规范问题

- 美国 IBC 和 NFPA 101 原则：逃生方向不能要钥匙。双头锁是**窄例外**，只限部分用途的主入口，且有附加条件。
- 住宅单元：从室内开门不能要钥匙或工具，且只能多一个释放动作。
- 在讲解或文案里推荐双头型号时，**不要说"适合所有门"**；可写"双头型号用于当地规范允许的门，以当地主管部门为准"。

### 4.4 日常使用与维护

- 锁芯不上油、不刷漆，用含特氟龙的润滑剂；锁体活动件可上脂（Yale）。
- 门下垂导致斜舌顶扣板 → 钥匙难转：调扣板，不要加力硬拧（lockshop-warehouse）。
- 门晃 → 扣板槽凿深或调扣板舌片（Kwikset "adjust the strike tab"）。
- 清洁只用湿布，不用溶剂、汽油、洗涤剂（Truper）。

### 4.5 典型故障

| 现象 | 常见原因 |
|---|---|
| 执手下垂、不回位 | 复位弹簧疲劳或断裂；筒式锁中心传动受大扭力变形 |
| 斜舌卡住不回 | 螺丝拧太紧；横孔和边孔不同心；门下垂 |
| 卡片能撬开 | 扣板偏，保险柱掉进扣板孔 |
| 钥匙插不进/转不动 | 锁芯脏、被上了油吸灰；连接片长度不对（夜闩） |
| 外罩松动 | 穿门螺栓或连接螺丝松 |
| 表面起泡、发黑 | 电镀层薄、盐雾性能差；201 不锈钢在潮湿/沿海环境生锈 |
| 方舌伸不满 | 边孔太浅；门框锁舌孔太浅 |

---

## 5. 材料和工序（行业通用；我们工厂的做法只引用 JSON）

### 5.1 各零件常见材料

| 零件 | 常见材料 | 我们 JSON 写的 |
|---|---|---|
| 执手/球头（Knob） | 冲压/拉伸的不锈钢或铜壳（Wrought）；锌合金压铸后电镀 | 轻型/筒式："Wrought stainless steel or brass"；重型："Zinc die-casting electro-plated or solid brass" |
| 玫瑰盖（Rose） | 冲压铜、不锈钢 | Schlage A：wrought brass/bronze/stainless；5870/5874 玫瑰盖直径 65–75 mm |
| 底盘、斜舌壳 | 钢，镀锌防腐 | "Solid steel chassis and latch case, zinc plated" |
| 斜舌 | 铜（镀铬）或锌合金 | Schlage A：brass, chrome plated；564 夜闩斜舌：锌合金；1073 系列：铜滚动斜舌 |
| 锁芯 | 铜锁胆（Plug）+ 铜/锌/铝外壳 | 5 弹子、铜锁胆；564：铝外壳 + 铜胆；5870 ACET："Zinc alloy / Solid brass / Zinc & brass" |
| 钥匙 | 镀镍铜、铜、铁 | 镀镍铜 / 铜 / 铁（564、G559 为铁钥匙） |
| 单头锁方舌 | 锌合金或钢，内嵌淬火钢滚柱防锯 | D101/D102：锌合金压铸 + 淬火钢滚柱 |
| 夜闩锁壳 | 铁板冲压喷漆/粉末涂装；锌合金压铸 | 铁壳喷漆；5835 钢板 1.2 mm、5836 钢板 1.5 mm，静电粉末涂装；564/F102/H101/S564 锌合金压铸 |
| 夜闩方舌 | 镀彩锌铁、铜 | 5835 彩锌铁；5836 铜 |
| 连接片（Tail bar） | 铁/钢 | 564：铁 |

**201 vs 304**：201 不锈钢镍少、锰多，耐蚀性明显不如 304，沿海和浴室环境容易出锈点。我们多条 JSON 写 "Stainless Steel 304/201" 或 "201/304"，买家必须知道具体是哪一种（见第 8 节）。

### 5.2 工序

| 零件 | 典型工序 |
|---|---|
| 不锈钢/铜球壳 | 板料落料 → 多道拉伸（Deep drawing），不锈钢多道拉伸中间常需退火 → 修边 → 抛光/拉丝 |
| 锌合金执手、锁壳、方舌 | 压铸（Die casting）→ 去水口、抛光 → 电镀（铜-镍-铬或仿古色）或喷涂 |
| 钢底盘、扣板、斜舌壳 | 冲压（Stamping）→ 镀锌（彩锌/白锌）；照片里的彩虹色就是彩锌 |
| 铁板夜闩壳 | 冲压成形 → 喷漆或静电粉末涂装 |
| 锁胆、弹子 | 铜棒车削/CNC，开钥匙槽，配弹子 |
| 表面 | 拉丝、抛光、电镀、仿古（AB/AC）、喷涂（白、木纹）、PVD（**我们 JSON 未写 PVD**） |

### 5.3 装配与测试

- 装配：底盘 + 弹簧 + 执手轴 → 装执手 → 斜舌调背距 → 锁芯配钥匙（同钥/主钥按订单）→ 功能检查 → 包装（我们 5688/5689："24 pcs/ctn"；5835/5836："One set per box with fasteners"）。
- 寿命：我们 JSON 写 "200,000 cycles"。这是我们自己写的数字；JSON 未说明测试方法、侧向载荷和测试机构。**不得写成"达到 BHMA 3 级"**。
- 行业测试项目（只作知识）：开关循环、斜舌退回力、锁住执手扭力、冲击、盐雾（ASTM B117）。

### 5.4 QC 要点

1. 背距实测 60.0 / 70.0 mm，可调斜舌两档都锁得住。
2. 斜舌行程（我们 12 mm / 1/2″）、方舌行程（25 mm）、夜闩斜舌伸出 13 mm。
3. 保险柱：压下后斜舌确实推不回去。
4. 执手回位：无下垂、无卡滞。
5. 钥匙：每把钥匙都开；同钥/主钥批次抽检；**数量与包装说明一致**（见第 8 节"两把还是三把"）。
6. 功能：通道两侧都转；浴室锁应急孔能开；入户锁按钮锁住外侧。
7. 表面：同一套无色差；电镀附着力、盐雾。
8. 夜闩：连接片长度、锁体与扣盒对位、左右手标识。
9. 配件齐全：扣板、防尘盒、螺丝（数量与长度）、钥匙。

### 5.5 便宜货为什么坏

- 锌合金执手镀层薄 → 几个月起泡、发黑。
- 底盘钢板薄、弹簧线径小 → 执手下垂。
- 没有保险柱，或扣板偏 → 卡片可撬。
- 方舌空心、无防锯滚柱 → 锯/撬可破。
- 扣板只配短螺丝 → 门框先坏。
- "不锈钢"其实是 201 或不锈钢薄皮包锌 → 生锈。
- 锁芯弹子少、公差大 → 互开率高。

---

## 6. 拆解（典型零件清单）

### 6.1 筒式 / 圆柱球锁

| 零件 | 我们的照片 |
|---|---|
| 外侧执手（带锁芯） | `5870-sset-heavy-duty-cylindrical-lock-3.webp`、`607-sset-tubular-lock-5.webp` |
| 内侧执手（带按钮/拧钮） | `607-sset-tubular-lock-2.webp` |
| 玫瑰盖、底盘（彩锌） | `578-sset-light-duty-cylindrical-lock.webp`、`607-sset-tubular-lock-2.webp` |
| 斜舌：面板式 | `607-sset-tubular-lock-2.webp`、`5870-sset-…-3.webp` |
| 斜舌：打入式（滚花套环） | `578-sset-light-duty-cylindrical-lock.webp` |
| 弧唇扣板 | `607-sset-tubular-lock-5.webp`；`5870-sset-…-3.webp`（带蓝色保护膜） |
| 防尘盒 | `607-sset-tubular-lock-5.webp`（白色塑料）、`5870-sset-…-3.webp` |
| 钥匙 | 上述两图均为 **3 把** |
| 木螺丝 | `607-sset-tubular-lock-5.webp`（4 颗） |
| 复位弹簧、执手轴、穿门螺栓 | 我们照片中看不清，**待核实**（需拆解实拍） |

### 6.2 单头锁舌锁

| 零件 | 我们的照片 |
|---|---|
| 外侧锥形锁芯外罩 | `d101-ss-deadbolts-2.webp` |
| 锁舌壳 + 方舌（圆柱形，端面滚花） | `d101-ss-deadbolts-2.webp`、`-4` |
| 内侧安装板（彩锌） | `d101-ss-deadbolts-4.webp` |
| 扣板（矩形，无唇）、防尘盒 | `d101-ss-deadbolts-4.webp` |
| 2 根长机螺丝（穿门固定）+ 4 颗木螺丝 | `d101-ss-deadbolts-4.webp` |
| 钥匙 3 把 | `d101-ss-deadbolts-4.webp` |
| 门框加强板、3″ 长螺丝 | 照片中**没有**，不要在渲染里加 |

### 6.3 外装夜闩

| 零件 | 我们的照片 |
|---|---|
| 锁体（铁壳喷漆）+ 斜舌 + 方舌 + 钩形拨杆 | `5835-night-latch-and-rim-lock-2.webp` |
| 盒式锁扣 | `5835-…-2.webp`、`5688-night-latch-and-rim-lock-2.webp` |
| 锁体背面（装门的一面）、彩锌底板、锁芯穿出 | `564-night-latch-and-rim-lock-2.webp` |
| 三角锁芯座 + 椭圆锁芯装饰圈（室外一侧） | `5688-night-latch-and-rim-lock-2.webp` |
| 安装螺丝（4 长 + 6 短）、3 把钥匙 | `5688-night-latch-and-rim-lock-2.webp` |
| 双圆方舌 + 扁斜舌 + 顶部小按钮 + 带链扣盒 | `5681-night-latch-and-rim-lock.webp` |
| 电控锁体：锁芯 + 按钮 + 引线 + 扣盒 | `1073d-night-latch-and-rim-lock.webp` |

---

## 7. 演示怎么拍

1. **门孔**：空门特写，标 2-1/8″ 横孔、1″ 边孔、60/70 mm 背距。
2. **60/70 调节**：手拨斜舌定位销，伸缩一次，旁边用尺子量。
3. **斜舌方向**：斜面朝门框，慢速关门，斜舌被扣板唇口压回再弹出。
4. **保险柱**：剖面或门开状态下，演示关门后保险柱被扣板压住，用卡片撬不动；再演示扣板偏位时保险柱掉进孔、卡片能撬（对照）。
5. **功能**：入户（外钥匙、内按钮）、浴室（内按钮 → 外侧应急孔用工具打开）、通道，各一个镜头。
6. **单头锁**：外钥匙转 → 方舌伸出 25 mm（尺子）；内拧钮转回；空转外罩演示。
7. **夜闩**：室外只见锁芯 → 室内锁体；拧旋钮拉回斜舌；按反锁按钮后外侧钥匙打不开；关门时斜舌自动进入扣盒。
8. **防盗链**：门开一条缝，链条拉直。
9. **拆解**：按第 6 节逐件摆放，只摆照片里有的零件。

规则：每个镜头只用一个型号、一种表面；门的类型、开向、左右手与该锁一致；没有实拍证明的内部结构（弹簧、电控机构）用"示意"标注或不拍。

---

## 8. 我们站上的对应型号

slug 规则：`<型号小写，空格换连字符>-<类别名>`，例如 `607-sset-tubular-lock`。后缀：ET 入户、BK 浴室、PS 通道；前缀为表面（SS 不锈钢、PB 抛光铜、AB 仿古铜、AC 仿古红铜、SN 沙镍、BN 黑镍、MB 哑黑、W/WL 白色/木纹等，按 JSON 的 Finish 字段核对）。

| 系列 / 型号 | 示例 slug | 说明 |
|---|---|---|
| 575 ABET/ACET/CPET/SSET | `575-sset-tubular-lock` | 筒式，入户，60/70 可调，门厚 35–45，57 mm 弧唇扣板 |
| 576 PBPS | `576-pbps-tubular-lock` | 筒式，通道，抛光铜 |
| 592 ABET/BSET/PBBK/PBET/PBPS/SSET | `592-sset-tubular-lock` | 筒式，郁金香执手；入户/浴室/通道；可选打入式斜舌 |
| 595 ACBK/ACET | `595-acet-tubular-lock` | 筒式，仿古红铜，浴室/入户 |
| 598 ACET/SNBK/SNET/SSET/598 | `598-sset-tubular-lock` | 筒式，入户/浴室 |
| 607（14 款） | `607-sset-tubular-lock` | 筒式球头，9 种表面，入户/浴室/通道；可选打入式斜舌 |
| 609 PBET/SSET | `609-sset-tubular-lock` | 筒式，入户 |
| 6082 SN | `6082-sn-tubular-lock` | 筒式，沙镍，功能未写 |
| Tubular Knob Lock | `tubular-knob-lock` | 系列总页 |
| 571 SSET、578（4 款）、586 ABET、587（10 款） | `587-sset-light-duty-cylindrical-lock` | 轻型圆柱，住宅；578 实拍为打入式斜舌 |
| 201、5733、5790、5807 E/F、5831 SSET、5832、5833 SSET、5870（5 款）、5871、5874（2 款）、6094（3 款）、9211、9212、9216、9217、9221 | `5870-sset-heavy-duty-cylindrical-lock` | 重型圆柱，标注办公/学校/重度住宅 |
| 5831-90mm black/chrome/grey/white、5870 SNET、587 SSPT、9210（4 款）、S578 | `5831-90mm-white-tubular-lock` | 名称为 "Tubular Lock"，但放在重型圆柱类（见下） |
| Cylindrical Knob Lock | `cylindrical-knob-lock` | 系列总页 |
| 5807 SSCL/SSCR/SSEL/SSR、5870 SSCC | `5807-ssr-commercial-lock` | 商用功能：连通/教室/出口/储藏/入户+连通 |
| D101（6 款）、D102（3 款） | `d101-ss-deadbolts` | 单头，25 mm 方舌 + 防锯滚柱，空转外罩，35–45 门厚，60/70 |
| D01 AB、D103 AC | `d103-ac-deadbolts` | 圆座 / 方座单头锁；背距按图纸确认 |
| D104 SS | `d104-ss-deadbolts` | 榫槽锁用锁芯 + 拧钮，SUS304，玫瑰盖 44 mm |
| 260、556、558、559、5683、5687、5834 | `558-night-latch-and-rim-lock` | 铁壳夜闩，60 mm（5834/5687 规格空） |
| 5681、5682、G559 | `5681-night-latch-and-rim-lock` | 拉美式外装锁，带链扣盒 |
| 5688、5689 | `5688-night-latch-and-rim-lock` | 铁壳 100×100，双头双行程，三角锁芯座 |
| 5833、5835、5836 | `5835-night-latch-and-rim-lock` | 50 mm 背距；5835/5836 钢板壳 100×85×25，可螺丝或焊接 |
| 564、564 MB、S564、F102、H101、H102 | `564-night-latch-and-rim-lock` | 锌合金压铸壳；S564 背距 40 mm |
| 1073D、1073D MB、1073S | `1073d-night-latch-and-rim-lock` | 电控外装锁，可接对讲/门禁 |
| Night Latch & Rim Lock | `night-latch-rim-lock` | 系列总页 |

### 8.1 JSON 中看起来不一致的地方（只标记，不修改）

1. **分类与名称冲突**：5831-90mm ×4、5870 SNET、587 SSPT、9210 ×4、S578 名称写 "Tubular Lock"，categoryPath 却是 heavy-duty-cylindrical-locks。
2. **材质自相矛盾**：重型圆柱多条写 "Material: Stainless steel"，同时 "Trim: Zinc die-casting electro-plated or solid brass"（201 PBET、5733、5790、5831 SSET、9211 等）。
3. **无锁芯功能却写了锁芯**：578 SNBK、587 PBPS/BK、6094 PBBK/PBPS、5870 SSPS 都写 "5-pin tumbler… two keys"，通道和浴室功能没有钥匙。
4. **钥匙数量**：JSON 写两把（"two nickel-plated brass keys"），实拍 `5870-sset-…-3`、`607-sset-…-5`、`d101-ss-deadbolts-4` 均为 **3 把**。
5. **6094 PBET（入户）/ PBPS（通道）** 的 Application 写 "For lavatory or other privacy doors"。
6. **5831 SSET 背距 "60/70/80/90 mm (Adjustable)"**：一只斜舌覆盖 60–90 少见，可能是多只斜舌选配，**待核实**；同一条特征又写"为普通住宅设计的经济型"，与重型、学校办公定位冲突。
7. **5835 / 5836 钥匙数**：summary 都写"四把钥匙"，规格写 5835 = 5 把、5836 = 3 把。
8. **夜闩模板化字段**：所有夜闩都带 "Anti-picking slide gate on single-cylinder deadlock"、"Function: Single cylinder, double cylinder or self-locking"、"Deadbolt throw 25mm on rim deadbolt versions"，包括只有双头的 564（Cylinder: Double cylinder）、G559 和电控 1073 系列。"slide gate" 具体指什么，**待核实**。
9. **D104** 放在 deadbolts 类，实际是榫槽锁的锁芯 + 拧钮，不是钻孔式单头锁。
10. **5870 SSCC "Entrance and communication"**：特征写 "Outside knob remains fixed"，又写外侧钥匙开斜舌，和入户、连通两种标准功能都对不上，**待核实**。
11. **"304/201" 并列**（5807、5870 SSCC、6094、5870 SSPS）：买家无法知道实际是哪种钢。
12. **5807 E / F、9210、5831-90mm、1073D MB、5687、5834、587 SSPT** 缺功能或缺规格。
13. 球锁寿命统一 "200,000 cycles"，重型与轻型没有区别；没有任何 BHMA 等级。文案不得据此写"商用级/Grade"。

---

## 9. 相关标准（只作知识，不代表我们的产品已认证或符合）

| 标准 | 管什么 |
|---|---|
| ANSI/BHMA A156.2 | 钻孔式和预装式锁（Bored & preassembled locks），Series 4000 为圆柱锁；循环、强度、操作、安全、材料、表面、尺寸测试。Allegion 资料列循环次数：1 级 1,000,000、2 级 400,000、3 级 200,000（版本不同可能变化，**以现行版本为准**） |
| ANSI/BHMA A156.39 | 住宅钻孔锁和斜舌锁，A/B/C 三档；摘要列 A 档：400,000 次（5 lb 轴向载荷）、斜舌 800 lbf、锁住执手 500 in-lbf、盐雾 ASTM B117 |
| ANSI/BHMA A156.36 | 辅助锁（商用和住宅单头锁）；2010 年从 A156.5 拆出；2020 版新增外装锁类型 |
| ANSI/BHMA A156.40 | 住宅单头锁和斜舌锁；耐久、强度与安全、表面三项分别评 A/B/C；2015 版含 17 项安全测试，其中一项对方舌施加 1,350 lb |
| ANSI/BHMA A156.5 | 2010 年后只管锁芯 |
| UL 防火门列名 | 防火门锁具要列名，且要有带弹簧的斜舌；单头锁不能单独用 |
| IBC / NFPA 101 | 逃生门不能要钥匙；双头锁仅为有条件的例外 |
| EN 12209 | 欧洲机械锁与锁扣板；11 位分类码：使用类别、耐久、门重/关门力、防火适用、安全、腐蚀、防盗、门面、钥匙/锁定方式、方轴方式、钥匙识别 |
| BS 3621 / BS 8621 / BS 10621 | 英国防盗锁具（含夜闩）：3621 为双面钥匙；8621 无钥匙出门；10621 双模式；常见要求方舌伸出至少 20 mm |
| GB 21556-2008 / GB 21556.2-2025 | 锁具安全通用技术条件；第 2 部分"防盗锁"2026-03-01 实施，部分替代 2008 版 |
| QB/T 2476-2017 | 球形门锁（Bored locks）行业标准，替代 2000 版 |

---

## 10. 来源

- Kwikset 球锁安装说明（PDF，已下载并提取文字）：https://images.kwikset.com/is/content/Kwikset/QR%20Code%20Instructions/Knob_Install_ENG_Final.pdf
- Schlage A 系列规格页（Allegion，PDF）：https://us.allegion.com/content/dam/allegion-us-2/web-files/schlage/information-documents/Schlage_A_Series_Cut_Sheet_113208.pdf
- Allegion《Understanding BHMA Grading and Testing》（PDF）：https://dev-cs-schlage-commercial.allegion.com/content/dam/allegion-us-2/web-files/allegion/information-documents/Understanding_BHMA_Grading_and_Testing_009968.pdf
- Grandeur 单头锁安装说明（Home Depot 托管 PDF）：https://images.homedepot-static.com/catalog/pdfImages/ef/ef23f52d-b3c3-4088-8552-cffd484c43d9.pdf
- Yale P89 60 mm 夜闩安装说明（ASSA ABLOY PDF）：https://static-mpc.assaabloy.com/yalefile//Fetchfile.aspx?id=15647
- Lockshop Warehouse 外装夜闩安装：https://www.lockshop-warehouse.co.uk/info/installing-your-locks/installing-rim-night-latches/
- Truper CS-75/85 外装锁说明（PDF）：https://www.truper.com/admin/descargables/manual/INSTRUCTIVO%2075%20y%2085-11.pdf
- Yale MC30 防盗链说明（ASSA ABLOY NZ PDF）：https://eshop.assaabloyopeningsolutions.nz/media/B2BUserGuide/Q25149_MC30_Doorchain.pdf
- BHMA A156.39 摘要：https://buildershardware.com/ANSI-BHMA-Standards/Hardware-Highlights/A15639-2015-Residential-Locksets-and-Latches
- BHMA A156.36 修订摘要：https://buildershardware.com/Home-Sweet-Secure-Home/a15636-auxiliary-locks-ansi-approved-november-2020
- BHMA A156.40 摘要：https://buildershardware.com/Home-Sweet-Secure-Home/ansibhma-a15640-residential-deadbolts
- idighardware《Decoded: Deadbolts in a Means of Egress》：https://idighardware.com/2023/06/decoded-deadbolts-in-a-means-of-egress/
- Union EN 12209 说明：https://uniononline.co.uk/uk/en/help-support/standards-and-legislation/en-12209
- Union《What are BS3621 locks》：https://www.uniononline.co.uk/uk/en/knowledge-centre/what-are-bs3621-locks
- 功能编号对照（Quality Door / SecurityParts）：https://qualitydoor.com/pages/cylindrical-lock-function-guide 、https://www.securityparts.com/commercial-lock-function-codes-guide
- 筒式 vs 圆柱锁（Emtek）：https://emtek.com/blog/mortise-vs-tubular-locks
- 深拉伸工艺（Xometry）：https://www.xometry.com/resources/sheet/deep-draw-stamping/
- GB 21556 / QB/T 2476 条目：https://www.chinesestandard.net/Related.aspx/GB21556.2-2025 、https://www.chinesestandard.net/Related.aspx/QBT2476-2000
- 本仓库：`content/products/*.json`（129 条 HYDE 记录）、`docs/research/image-audit/verdicts.json`、`public/images/products/` 实拍图（第 6 节列出的文件）
