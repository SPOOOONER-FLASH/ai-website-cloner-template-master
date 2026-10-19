# 02 插芯锁体与锁芯（lock-cases / lock-cylinders）

> 知识库第 02 章。用途：写文案、审 AI/场景图、策划演示视频、回答买家。
> 覆盖 HYDE 站上 `categoryPath` 为 `lock-cases`（54 款）和 `lock-cylinders`（45 款）的产品，共 99 款（2026-10-14 按 `sites` 过滤统计）。
> 规则：数字只来自来源或我们的 JSON/实拍图；不确定处标「待核实」。本章**不声明我们的任何产品通过任何认证**。

---

## 1. 是什么、怎么工作

### 1.1 插芯锁体（mortise lock case）

插芯锁体是嵌进门扇侧边槽口里的金属盒。外露部分只有**锁面板（forend / faceplate）**，门面上只看到执手和锁芯。

**动作链（带执手的锁体，sashlock）**

执手（lever）转动 → 方轴（spindle）转动 → 锁体里的**拨轮（follower / hub）**转动 → 拨动斜舌连杆 → **斜舌（latch bolt）**缩回 → 门可以打开。
松开执手 → 复位弹簧把执手和斜舌推回原位。

**动作链（钥匙/旋钮部分）**

钥匙或旋钮转动锁芯塞（plug）→ 锁芯中部的**拨片（cam）**转一圈 → 拨动锁体里的方舌机构 → **方舌（deadbolt）**伸出或缩回。很多锁体还让拨片在回程时顺带收回斜舌，这样从外侧用钥匙也能开门。我们的哪些型号有这个功能，要逐款核实（待核实）。

**两个关键尺寸**（定义见 blue-id 的说明）

- **边距（backset）**：锁面板外表面到锁芯孔（或钥匙孔）中心的距离。它决定执手和锁芯在门面上离门边多远。
- **中心距（centre distance；德系称 PZ-Maß，PZ 即 Profilzylinder，欧标锁芯）**：方轴孔中心到锁芯孔中心的距离。执手底座和锁芯盖板必须按这个尺寸开孔。

**我们的命名习惯**：竖式锁体多为「中心距 × 边距」，例如 LC8525 表示 85/25；LC05 8560 表示 85/60；LC5845 表示 58/45；LC6860 表示 68/60。卧式锁体倒过来，**先写边距**：LC7065 是锁面板到锁芯 70、锁芯到方轴 65；LC9045 是 90 和 45（见 `lc7065-lock-case.webp`、`lc9045-lock-case.webp` 上的标注）。所以**不能只凭型号数字判断哪个是边距**，要以 JSON 规格和标注图为准。

**市场上的常见组合**（来源：blue-id、DIN 18251 的产品页）

| 用途 | 边距 | 中心距 | 锁面板 |
|---|---|---|---|
| 德系室内门（DIN 18251） | 55 / 60 mm | 72 mm（也有 78） | 宽 20/24 mm，长 235/245 mm |
| 德系外门 | 65 / 80，部分 90 mm | 92 mm，最大到 100 | 宽 24/25 mm，长 280/300 mm |
| 旧标准锁 | 60 / 65 / 70 mm | 常见 78，偶见 85 | 非标 |

blue-id 把 85 mm 中心距列为旧标准的少数值；DIN 18251 的产品页用的是 72 mm。我们站上主力是 **85 系列**（LC02–LC14、LC21/22、LC35、LC8520–LC8535），另有 72 系列（AR4-111、AR4-140、LC32/33/34）、68（AR4-110、LC6860）、58（LC5845）、92（LC9230）。85 系列主要用于哪些国家的门，目前没有找到可靠来源（待核实），所以不要在文案里写「欧洲标准 85」。

### 1.2 锁舌类型

| 锁舌 | 工作方式 | 我们的型号和证据 |
|---|---|---|
| 斜舌（latch bolt） | 一面带斜坡，关门时被锁扣板压回，靠弹簧弹出 | 几乎所有带方轴的锁体。LC05 的信息图标为 "Silent Latch Bolt"（静音斜舌） |
| 方舌（deadbolt） | 只能由钥匙或旋钮驱动，伸出后推不回去 | LC35（斜舌加方舌）；LC05、LC6860、6068 各有三个方舌 |
| 圆柱舌 / 多舌（round bolts） | 几根圆柱舌同步伸出，对应门框上的多个孔 | LC04 85*60、LC14：四根圆柱舌（JSON 写 "Four round bolts"，`lc14-85-50mm-lock-case.webp` 可见） |
| 钩舌（hook bolt） | 绕销轴摆出，钩进锁扣板后面，门不能被横向拉开 | LC15、LC17、LC19（窄边框）；AR4-1121；HY006DK、HY006ET、HY008 |
| 防撬斜舌 / 辅助斜舌（deadlatch，auxiliary / guard latch） | 门关好后，辅助舌被锁扣板压下，把主斜舌锁死，防止用卡片顶回 | HY007、HY007-S（JSON："Deadlatch + Hold-Back Function"） |
| 滚珠舌（roller bolt） | 弹簧顶住的滚轮，只起关门定位作用，不锁门 | `lc8520ps-lock-case.webp` 的斜舌位置看上去是滚轮，待核实 |

**"Multi-bolt" 的两个意思要分清**：一种是一个锁体上有多根舌（如四根圆柱舌）；另一种是门边整根长锁条上分布多个锁点（多点锁，multipoint lock）。我们站上这一族属于前一种，不要写成多点锁。

### 1.3 锁扣板（strike / keep）

锁扣板装在门框上，开有斜舌孔和方舌孔，斜舌靠它的弯边（lip）压回。我们的 JSON 多写 "Strike Plate Material = Stainless Steel"。LC14 的配件图 `lc14-85-50mm-lock-case-3.webp` 有锁扣板、白色塑料**扣盒（dust box / strike box）**和一组螺钉；扣盒装在门框槽里，防止舌孔里的木屑或灰浆挡住锁舌。

### 1.4 锁芯（cylinder）

**弹子锁芯（pin-tumbler）的原理**（来源：Wikipedia 的 Pin tumbler lock 条目）

外壳（shell / housing）里有一根可以转动的锁芯塞（plug）。每一列弹子由下到上依次是：

- 下弹子（key pin），长度对应钥匙牙花；
- 上弹子（driver pin）；
- 弹簧。

插对钥匙，每列弹子的分界都正好落在锁芯塞与外壳之间的**剪切线（shear line）**上，锁芯塞才能转。插错钥匙，就总有弹子横跨剪切线，锁芯塞转不动。

**型材（profile）**

| 型材 | 外形 | 配什么锁体 | 我们的型号 |
|---|---|---|---|
| 欧标（euro profile，DIN 18252） | 上圆下窄的"钥匙孔形"；常见截面宽 17 mm、高约 33 mm | 欧标锁芯孔的插芯锁体 | 45–90 mm 全系列。标注图（如 `70sn-lock-cylinder-18.webp`）：头部 Φ17、颈宽 10、总高 33 |
| 椭圆（oval） | 椭圆截面，与欧标不能互换 | 椭圆锁芯孔的锁体，配椭圆盖板 | Single oval cylinder；LC18/19/20 附带椭圆锁芯（`lc18-lock-case-3.webp` 可见椭圆盖板） |
| 美式螺纹插芯锁芯（threaded mortise cylinder） | 圆柱外壳带外螺纹，从门面拧进锁体，尾部带拨片 | 美式窄边框锁体 | HY006DK、HY006ET、HY008 附带（`hy006dk-lock-case-3.webp`）。Adams Rite 同类锁体要求长 1"（25.4 mm）、直径 1-5/32"（29.4 mm）的锁芯，配 MS 型拨片；我们锁芯的螺纹和尺寸待核实 |
| 外装锁锁芯（rim cylinder） | 装在门面外侧，用尾片（tailpiece）穿过门去驱动室内的外装锁 | 外装锁（rim lock） | 本族没有明确的 rim 型号。Single oval cylinder 写着 "External single cylinder"，带长螺钉，可能属于此类，待核实 |

**欧标锁芯的长度怎么量**：从锁芯一端量到固定螺孔（拨片）中心，两段相加就是总长；长度按 5 mm 递增。带旋钮的锁芯，型号前加 "T" 表示旋钮在哪一侧（来源：Latham's、DIN 18252 产品页的检索摘要）。
我们的 70 SNKT-2 写的是 "Cylinder split 30/10/30"，即两段各 30、中间拨片段 10。按市场"量到拨片中心"的习惯就是 **35/35**。报给买家时两种写法都要给，否则会被误读成 30/40。

**锁芯的种类**

- **双开（double cylinder，DK）**：两侧都用钥匙。我们后缀 DK 的型号属于这一类，摘要里写 "double key function"。
- **单开加旋钮（key and thumbturn，KT）**：一侧用钥匙，一侧用旋钮。`70sn-lock-cylinder.webp`、`70-snkt-1-lock-cylinder.webp` 可见旋钮；**旋钮必须装在室内一侧**。
- **半锁芯（half cylinder）**：只有一侧有锁芯塞，另一端就是拨片。45 BNIK（`45-bnik-lock-cylinder-4.webp`，45×33×17/10）、47BSIK（`47bsik-lock-cylinder-2.webp`）都是半锁芯。后缀 "IK" 的含义待核实。
- **偏心锁芯（offset）**、隐私锁芯、带电脑钥匙孔的锁芯：只在通用信息图 `70anti-theft-lock-cylinder-6.webp` 里出现。图审结论是"通用功能示意"，**不能说明具体型号有这些版本**。

**拨片（cam）和离合（clutch）**

拨片位于锁芯中段。双开锁芯中间有离合件，哪一侧插进钥匙，哪一侧就和拨片结合。很多设计里，室内插着钥匙时，室外钥匙就转不动拨片（来源：LockWiki Euro Profile）。
常见故障是**拨片错位（slipped cam）**：两侧同时插钥匙、或锁芯和钥匙已经磨损时，拨片会转过 180° 卡在上方，钥匙拔不出（来源：Oriel College 的维修记录）。
另外有**可调位置拨片（multi-position cam）**，可以把拨片的静止角度调到设备需要的位置（ASSA ABLOY、Mul-T-Lock 的检索摘要）。我们锁芯的拨片类型，照片上只看到标准单拨片，其他类型待核实。

### 1.5 防技术开启和防破坏（只讲原理）

- **防拉断（anti-snap）**：攻击者用钳子扭断锁芯外露的一段。对策是在锁芯上预设断裂线，外段断掉后拨片和内段仍然完好（TS 007 检索摘要；Wikipedia）。
- **防撞匙（anti-bump）**、**防拨（anti-pick）**：用防盗弹子（spool、serrated）造成假手感，或加侧弹子、侧杆（sidebar）。这只能增加开启时间，熟练的人仍可能打开（Wikipedia）。
- **防钻（anti-drill）**：在锁芯塞或外壳里嵌淬硬钢件；或在门外加淬硬**锁芯护盖（cylinder guard / defender）**，例如我们的 XF-1，JSON 标 HRC58，带转动护片和穿心螺栓，见 `xf-1-lock-cylinder-3.webp`。
- **防拔芯（anti-extraction）**：EN 1303 C/D 级规定了 10 kN / 15 kN 的拔芯力（LockWiki）。
- 我们 JSON 里的 "ANTI-THEFT"（如 70ANTI-THEFT、70PB ANTI-THEFT）**没有写明是哪一种防护**，文案只能写型号名，**不能扩写成防拉断或防撞匙**（待核实）。

### 1.6 电脑钥匙（dimple / computer key）

在钥匙平面上铣出圆坑（dimple）。锁芯里的侧向弹子读取这些坑，往往还配合侧杆；很多是双面对称、可以正反插的钥匙（LockWiki 各型号条目的检索摘要）。
"电脑钥匙"是国内俗称，指数控机床铣出的平面凹坑钥匙。它**不等于防撞匙**，有的凹坑锁照样能被撞开（同一来源）。
我们的 47BSIK 写 "computer keys optional"，Single oval cylinder 写 "Computer key optional"。图审记录还提到 80 SNDK CP 的实拍钥匙是电脑钥匙。

### 1.7 主钥匙系统（master keying）

- **各开（keyed to differ）**：每把锁一把钥匙。
- **同花（keyed alike）**：一把钥匙开一组锁。
- **中央锁（central / maison）**：各户钥匙都能开公共门。
- **主钥匙（master）/ 总主钥匙（grand master）**：分层管理（Abloy）。

原理是在弹子列里加一颗**中间弹子（master pin / spacer）**，每列就有两个剪切点，单把钥匙和主钥匙都能开（Wikipedia）。代价是理论上更容易被技术开启。
要不要做主钥匙系统必须在设计阶段定下来，已经做成各开的锁，事后不重新配弹子就加不进系统（Abloy master key 设计指南的检索摘要）。我们的 JSON 没有提供主钥匙系统，文案不能写（待核实）。

### 1.8 叶片锁（lever lock）：AR4 系列

AR4-110、AR4-111、AR4-1121 的照片（`argentina-ar4/hyde-ar4-1121.webp`、`1121-lock-case-3.webp`）上是**带齿片（bit）的钥匙**，锁体上没有欧标锁芯孔，只有钥匙孔。按照片判断属于叶片锁或双齿片锁，待核实。

叶片锁的原理：每片叶片（lever）上有一个缺口（gate），钥匙齿片把每片叶片抬到正确高度后，方舌上的立柱（stump）才能穿过缺口，方舌才能移动（FIRGELLI 和 Door Furniture Direct 的检索摘要）。
意大利称这类锁为 doppia mappa（双齿片），常用在防盗门上（CISA 手册的检索摘要）。

### 1.9 窄边框铝门锁体（narrow-stile）

铝门边框窄，锁体只能做得很薄、边距很小。

**美式（Adams Rite 一类）**：边距有 7/8"、31/32"、1-1/8"、1-1/2" 几档；美式螺纹锁芯从门面拧进锁体；钩舌由锁芯拨片经摆杆推出。
Adams Rite MS1850 的数据：边距 22/24/28/38 mm 对应锁体深 40/41.5/45/57 mm，锁体高 152 mm，锁面板 175×26 mm（lockandkey 产品资料）。
我们的 HY006DK 标注图 `hy006dk-lock-case-5.webp`：锁芯中心距锁面板 28.5、锁体深 45、锁面板 175×25、门厚标 46 mm，和这一类非常接近。不过 "Adams Rite 兼容"**未经验证，不能写**。

**欧式**：锁体薄，用欧标或椭圆锁芯，边距很小。
- LC15：20 mm，钩舌，欧标；
- LC17：16 mm，推拉门钩舌；
- LC18：17 mm，椭圆；
- LC19、LC20：16 mm；
- AI8530：30 mm；
- AR4-140：25 mm，锁面板 183.5×20。

**防撬斜舌加长开（deadlatch with hold-back）**：HY007 和 HY007-S。按压推板或拉手收回斜舌；营业时间可以把斜舌"常开"保持住，门就能自由推拉。
Adams Rite 4900 的做法是：先把斜舌按进去，再反向转钥匙保持（4900 产品页的检索摘要）。我们怎么实现，待核实。

---

## 2. 装在哪里、怎么装

### 2.1 门的类型和材质

| 锁体 | 适用门（来自我们的 JSON / 照片） |
|---|---|
| 85、72、68、58 竖式，带方轴 | 木门、金属门（LC02、LC06、LC21 等写 "Wooden and metal doors"）；LC04 85*70 写 "Wooden Doors / Security Doors"；LC14 写 "Security doors" |
| 卧式（LC7065/PS/S、LC9045、7066） | 锁体横装。照片 `lc7065-lock-case-4.webp` 是实拍，门型 JSON 没写，待核实 |
| 窄边框（HY006/7/8、LC15–20、AR4-140、AI8530） | 铝合金窄边框门、玻璃门、店面门；LC17 是推拉门 |
| LC33-5572 | 写 "Panic exit / Emergency and escape doors"，配套见第 01 章（推杠锁） |

### 2.2 开门方向（handing）和内外侧

- **斜舌的斜面必须朝门关闭的方向**，也就是朝门框止口一侧。多数锁体可以把斜舌翻转来换向。HY007 写 "Reversible (Left / Right)"；HY007-S 写 "Left Hand or Right Hand Available"，即出厂分左右，不一定能现场换。
- 方舌、圆柱舌、钩舌没有斜面，不分左右，但锁体在门上可以装反。
- **旋钮侧必须在室内**；锁芯较长的一段、或带安全功能的一侧装在室外（Latham's：有些安全锁芯只有室外段有防护）。
- 推板锁（HY007-S）分 PUSH 侧和 PULL 侧，见 `hy007-s-lock-case.webp` 上的 "PUSH"。

### 2.3 安装高度

执手高度应和同一建筑里其他门一致；门扇有中横档时，锁体要落在横档范围内，避开榫接处（practicaldiy、directdoors 的安装说明）。
具体离地高度，本章来源没有给出统一数字，以项目图纸为准（待核实）。

### 2.4 门厚

- 锁体本身不限门厚，限制门厚的是**方轴长度**、**锁芯长度**和执手的固定螺丝。安装说明要求先核对锁的适用门厚（practicaldiy）。
- 欧标锁芯总长 = 门厚 + 两侧盖板（或执手底板）厚，再按 5 mm 档选。锁芯外露越多越容易被扭断。有指南建议外侧最多凸出约 1 mm（检索摘要，待核实原文）。
- HY006DK 的图标注门厚 46 mm、装饰盖 4 mm。

### 2.5 门的开孔（以木门竖式锁体为例）

1. 在门边厚度的中心画线，按锁体轮廓标出上下端（practicaldiy）。
2. 用**和锁体盒厚相当**的钻头钻一排相互重叠的孔，深度不小于锁体加锁面板，钻头要和门面平行；然后用凿子清成方槽（practicaldiy、directdoors）。
3. 为锁面板凿浅槽，让锁面板和门边齐平。
4. 从门的两面分别钻方轴孔和锁芯孔，背面垫木块防止崩边；按锁芯形状（欧标或椭圆）修出锁芯孔。
5. 装锁体，再装执手和盖板。螺丝不能顶到锁体，方轴长度合适，执手才能贴平。
6. 伸出锁舌在门框上画位置，凿出锁扣板槽和舌孔，装锁扣板（和扣盒），然后试关门、试锁。

**典型尺寸**：
- 槽宽：DIN 室内锁体盒厚 15–18 mm，外门最大 24 mm（blue-id）。
- 我们 LC07 的图：锁面板 240×23、锁体高 173、深 72（`lc07-85-45mm-lock-case-2.webp`）。
- LC05：锁面板 240、锁体 173。
- 其他型号逐款看标注图。没有标注图的型号**不能借用这些数字**。

### 2.6 必须配什么

| 配件 | 要点 |
|---|---|
| 锁芯 | 型材（欧标/椭圆/美式螺纹）和长度都要对上 |
| 执手或拉手、盖板 | 孔距等于锁体中心距；底座直径必须小于边距的两倍左右，否则会伸出门边（见第 3 节）。方轴规格本章 JSON 都没写，待核实 |
| 锁扣板、扣盒 | 舌孔位置和尺寸与锁舌一致；钩锁要用专用锁扣板 |
| 窄边框锁 | 美式锁芯（螺纹、拨片型号），推板或拉手，铝型材的加强件 |
| 推杠、闭门器 | 与 LC33 这类逃生锁体有关，见第 01 章和闭门器章节 |

### 2.7 常见安装错误

- 方轴孔或锁芯孔钻偏，执手发卡、钥匙转不动。
- 锁芯太长凸出门面（容易被扭断），或太短（盖板压住，拨片转不到位）。
- 斜舌装反，门关不上。
- 锁扣板偏位，方舌伸不出；扣盒漏装，舌孔堵死。
- 锁芯固定螺丝打歪，或拧得太紧夹死锁芯。
- 窄边框锁用错锁芯型号或拨片，钩舌出不到位。

---

## 3. 场景和展示怎么做才对（审 AI 图的规则）

### 3.1 几何必须成立

1. **竖式锁体**：执手（方轴）在锁芯的**正上方**，两者在同一条竖线上，间距等于中心距（85/72/68/58…），离门边的距离等于边距。
   图审已经否决过：LC05 执手和斜舌一样高（实拍方轴孔在斜舌下方约 20 mm）；LC8535 执手到锁芯约 110 mm，而规格是 85。
2. **卧式锁体**（LC7065、LC9045、7066）：锁芯和方轴在**同一水平线**上，方轴离门边更远。场景图里执手不能画在锁芯上方。
3. **底座必须放得下**：边距 20–30 mm 的锁体（LC8520、LC8525、AI8530、窄边框）不能配大圆底座执手，底座会伸出门边，只能配窄长面板执手。图审否决过 LC8525：25 mm 边距配了约 52 mm 的圆底座。
4. **锁面板在门的侧边，执手和锁芯盖板在门面**，两个面互相垂直。同一张图里不能两者都正对镜头。图审否决过 HY007、HY007-S。
5. **锁芯孔不可能开在锁面板上**。图审否决过 AR4 编辑图。
6. **锁扣板在门框上**，和锁舌一一对应。不能悬空，不能装在门扇上。

### 3.2 什么在正常状态下看不见

- 门关着时：锁体、斜舌、方舌、钩舌、拨片全部看不见。只看得到门面上的执手、锁芯端面（或盖板），门缝里也许能看到一点锁扣板。
- 门开着、能看到门边时：才看得到锁面板和伸出的锁舌。斜舌平时是伸出的；方舌只有锁上时才伸出。**门开着却画方舌伸出**，表示门开着被反锁，演示时要讲明。
- 欧标锁芯装好后，只露出两端（双开锁芯露钥匙孔，KT 锁芯露钥匙孔和旋钮），拨片和固定螺丝都看不见。

### 3.3 门型要对

- 窄边框铝门锁不能装在实木平开门上。图审否决过 HY006ET。
- 推拉门钩锁（LC17）没有方轴孔，不能配执手装在平开门上。图审否决过 LC17：配了执手，钩舌多一根销子，面板螺丝 3 颗而实拍是 2 孔。
- 多圆柱舌锁体（LC04、LC14）的图应该是防盗门或厚木门，门框上要有对应数量的舌孔。

### 3.4 零件和表面要对

- 钥匙类型要和实拍一致。图审否决过 80 SNDK CP：实拍是电脑钥匙，AI 画成普通齿形钥匙。
- 不能加 Hyland 刻字，不能加实拍上没有的销子或螺丝。图审否决过 LC07、LC8535。
- 一张图只用一种表面。图审否决过 LC35、LC5845、LC7065、90 SNDK 的混搭表面。
- 锁芯颜色和后缀要对上：SN 是缎面镍，MB 是哑黑，PB 是亮金，AB 是青古铜。注意后缀里的 "CP" 或 "BK" 和实际颜色不一致的问题（见第 8 节）。
- 旋钮要在室内侧，室外侧只有钥匙孔。

### 3.5 物理上不可能的画面

- 门关着却看到锁体侧面。
- 执手和锁芯不在规定的连线上。
- 锁芯从锁面板伸出。
- 钩舌向上钩进一块平面锁扣板（钩舌需要带钩槽的锁扣板）。
- 门开着而斜舌缩在里面。斜舌只有按着执手时才缩回。

---

## 4. 功能和使用

### 4.1 功能类型

| 功能 | ANSI/BHMA 代号（来源：securityparts 汇总） | 动作 |
|---|---|---|
| 通道（passage） | F01 | 两侧执手都能开，不能上锁。我们的 LC06、LC21、LC8520PS、LC8530PS、LC7065PS 写 "Passage" |
| 卫浴/隐私（privacy） | F02 | 室内旋钮上锁，室外可应急开启 |
| 教室（classroom） | F04 | 外执手由钥匙锁或开，内执手始终可开 |
| 储藏室（storeroom） | F07 / F08 | 外执手固定，靠钥匙收斜舌 |
| 入户（entrance） | F20 | 钥匙从外侧收斜舌，内执手始终可开 |
| 单方舌（deadbolt） | F17 | 只有方舌 |
| 逃生（exit） | F31 | 外执手固定，内侧可开 |

ANSI 的代号**不标示等级**，等级要另行规定（A156.13 预览页）。我们很多 JSON 里有一段通用文字 "Functions: Entrance, Anti-Panic, Privacy, Passage, Storeroom, Deadlock, Classroom, Multi-Function"，这是系列层面的可选范围，**不是某一个型号具备全部功能**（见第 8 节）。

### 4.2 日常使用

- 关门靠斜舌；锁门要转钥匙或旋钮让方舌伸出。多舌锁体的方舌常要转几圈才完全伸出，转的圈数按型号核实。
- 防撬斜舌：门要完全关好，辅助舌被压下，主斜舌才被锁死。
- 长开功能：营业时间让门自由推拉，下班前必须解除。

### 4.3 维护

- 锁芯用锁芯专用润滑剂（行业惯例，具体品类待核实）。
- 锁体活动部位定期检查。
- 锁扣板位置随门下沉需要调整。

### 4.4 典型故障

| 现象 | 常见原因 |
|---|---|
| 执手下垂、手感松 | 方轴、拨轮磨损（securityparts），或复位弹簧疲劳 |
| 斜舌不弹出或卡住 | 斜舌弹簧断，锁体变形，扣盒里有杂物 |
| 方舌伸不出 | 锁扣板偏位，门下沉 |
| 钥匙拔不出 | 拨片错位（slipped cam），锁芯磨损（Oriel） |
| 钥匙转不动 | 锁芯固定螺丝夹死，锁芯长度不对，弹子卡住 |
| 辅助舌失灵 | 辅助舌部件损坏，可单件更换（securityparts） |

---

## 5. 材料和工序

> 本节只讲行业的普遍情况。关于我们的材料，只引用 JSON 里写明的内容。

### 5.1 典型材料

| 部件 | 行业常见 | 我们 JSON 里写的 |
|---|---|---|
| 锁体外壳 | 冷轧钢板冲压后电镀或涂装；也有不锈钢 | "Iron"（LC8525 等）；"Nickel-plated iron"（AR4）；"Stainless steel"（LC8520B/PS、LC8535B）；"Aluminum case"（LC02、LC03、AI8530，待核实）；LC05 信息图写 "Electroplated Decorative Cover with Rust Resistance" |
| 锁面板、锁扣板 | 不锈钢或钢板电镀 | "Stainless Steel"（锁扣板、LC04 85*70、LC5845 的面板） |
| 斜舌 | 锌合金压铸，黄铜，不锈钢 | "Copper"（多款，见第 8 节）；"Zinc Alloy + Plastic / Brass"（LC5845）；"Copper-plated zinc alloy or brass"（AR4）；"Zinc Alloy & ABS"（HY007） |
| 方舌、钩舌 | 钢（实心或带防锯芯），锌合金 | "Iron"（LC5845 方舌）；"Nickel-plated iron"（AR4-1121 钩舌） |
| 拨轮（方轴孔件） | 锌合金、粉末冶金、铜 | "Copper"（多款） |
| 锁芯外壳、锁芯塞 | 黄铜型材 | "Solid Brass"（所有欧标锁芯） |
| 弹子、弹簧 | 黄铜、镍白铜；不锈钢弹簧 | 未写 |
| 锁芯护盖 | 淬硬钢 | XF-1："Hardened Steel (HRC58)" |
| 表面 | 电镀（镍、铬、仿古）、PVD | 锁体系列：PB、AB、AC、SS、SN；XF-1：PVD |

### 5.2 典型工序

- **锁体**：外壳和底板冲压 → 铆接或点焊 → 表面处理 → 装入斜舌、方舌、弹簧、拨轮 → 盖板用铆钉或螺钉封合。
- **锁舌**：压铸（锌合金）或机加工（铜、钢）；斜舌斜面要光滑。
- **锁芯**：黄铜型材切断 → 数控钻弹子孔 → 锁芯塞车削 → 按钥匙牙花配弹子 → 装弹簧和封片 → 装拨片和离合 → 表面处理。
- **钥匙**：钥匙坯冲切 → 机加工牙花或凹坑。电脑钥匙用数控铣出凹坑。

### 5.3 装配和测试的典型检查点

- **锁体**：斜舌伸出量和回弹，方舌伸出量，执手力矩，方轴孔和锁芯孔的位置公差（决定中心距准不准），锁面板平整，螺丝孔位。
- **锁芯**：每一把钥匙都能顺畅开启，错误钥匙打不开（不能互开），拨片角度，固定螺孔位置，整体长度和分段尺寸。
- **表面**：镀层附着力，耐盐雾（EN 12209、EN 1303 的腐蚀等级用中性盐雾小时数）。

### 5.4 便宜货为什么坏

- 锁体钢板薄，铆点少，门一受力锁体就变形，斜舌卡死。
- 锌合金斜舌和拨轮会磨损甚至断裂，执手下垂。
- 弹簧材质差，疲劳后斜舌不回弹。
- 锁芯公差大，钥匙之间互开；弹子少，牙花组合少；锁芯没有防拉断设计，凸出门面就容易被扭断。
- 镀层薄，户外使用很快生锈或褪色。

---

## 6. 拆解

### 6.1 插芯锁体的典型部件

锁体外壳（case）、盖板（cover）、锁面板（forend）、斜舌（latch bolt）、斜舌弹簧、方舌（deadbolt）或圆柱舌、钩舌、拨轮（follower / hub）、复位弹簧、方舌拨动机构、锁扣板（strike）、扣盒（dust box）、固定螺钉。

| 部件 | 在我们哪张照片上看得到 |
|---|---|
| 锁面板、斜舌、三个方舌、锁扣板 | `lc05-8560-lock-case-6.webp`（含锁扣板） |
| 标注：静音斜舌、实心方舌、电镀盖板、标准锁芯孔 | `lc05-8560-lock-case-4.webp`（信息图） |
| 四根圆柱舌、锁扣板、扣盒、螺钉 | `lc14-85-50mm-lock-case-3.webp` |
| 标注图（锁面板 240、锁体 173、85/60、方舌位置） | `lc05-8560-lock-case-3.webp`、`lc07-85-45mm-lock-case-2.webp` |
| 卧式锁体结构 | `lc7065-lock-case-3.webp`、`7066-lock-case-3.webp` |
| 窄边框钩舌、欧标锁芯、钥匙 | `lc15-lock-case.webp`、`lc17-lock-case-3.webp` |
| 椭圆锁芯、椭圆盖板、锁扣板 | `lc18-lock-case-3.webp` |
| 美式锁体爆炸图（锁芯、垫圈、锁体、螺钉） | `hy006dk-lock-case-4.webp` |
| 美式螺纹锁芯和尾部拨片 | `hy006dk-lock-case-3.webp` |
| 全套（锁体、锁芯、锁扣板、螺钉、钥匙） | `hy008-lock-case-2.webp` |
| AR4 钩舌锁全套（锁体、两块锁扣板、盖板、螺钉、钥匙） | `1121-lock-case-3.webp` |
| 6068 锁体背面（欧标锁芯孔及下方带槽圆孔） | `6068-mortise-lever-handle-lock-2.webp` |

### 6.2 欧标锁芯的典型部件

外壳、两根锁芯塞（双开）或一根锁芯塞加旋钮轴（KT）、拨片（cam）、离合件、弹子（上、下）、弹簧、封片、卡簧、钥匙、固定螺丝。

| 部件 | 在我们哪张照片上看得到 |
|---|---|
| 锁芯、长固定螺丝、钥匙 | `70sn-lock-cylinder.webp`、`70-snkt-1-lock-cylinder.webp` |
| 旋钮锁芯装进锁体后拨片的位置 | `70sn-lock-cylinder-3.webp`（插图） |
| 尺寸标注（Φ17、10、33、30/10/30、固定螺孔 d4） | `70sn-lock-cylinder-18.webp`、`70sn-lock-cylinder-15.webp` |
| 半锁芯尺寸 | `45-bnik-lock-cylinder-4.webp`、`47bsik-lock-cylinder-2.webp` |
| 锁芯护盖及淬硬部件 | `xf-1-lock-cylinder-3.webp` |
| 椭圆锁芯外壳（金属和塑料两种） | `single-oval-cylinder-lock-cylinder-3.webp` |

我们没有锁芯内部弹子的拆解照片。弹子数量只有 Single oval cylinder 写了 "6-pin"；其余型号待核实。

---

## 7. 演示怎么拍

1. 锁体正面特写，标出边距和中心距（用实物和尺子，不用动画箭头凭空画尺寸）。
2. 门开着、门边朝镜头：转执手 → 斜舌缩回 → 松手 → 斜舌弹出。
3. 转钥匙或旋钮 → 方舌伸出。多舌锁体拍几根舌同步伸出。
4. 关门过程：斜舌被锁扣板压回、再弹进舌孔（侧面拍门框）。
5. 锁芯：钥匙插入转一圈，拨片露在锁芯中段转动（锁芯不装进锁体时拍）。
6. KT 锁芯：一侧钥匙、一侧旋钮，标明室内和室外。
7. 窄边框钩锁：钥匙一转，钩舌摆出钩进锁扣板，然后拉门拉不开。
8. 防撬斜舌：门关好后，用卡片试图顶回斜舌，顶不动。
9. 最后一个镜头：门关上，只看得到执手和锁芯端面（如实展示正常状态）。

**禁止**：用动画画出我们实物上没有的内部零件；把锁芯装进型材不对的锁体；在演示里出现通用信息图上的功能（偏心锁芯、隐私锁芯），除非实物确实有。

---

## 8. 我们站上的对应型号

### 8.1 锁体（lock-cases，54 款）

| 型号 | slug | 一句话 |
|---|---|---|
| LC02 85×40mm | lc02-85-40mm-lock-case | 85/40，JSON 写铝外壳，木门和金属门 |
| LC03 85×45mm | lc03-85-45mm-lock-case | 85/45，欧标，JSON 写铝外壳 |
| LC04 85*60 | lc04-85-60-lock-case | 85/60，四根圆柱舌，木门 |
| LC04 85*70 | lc04-85-70-lock-case | 85/70，铁锁体，不锈钢面板，木门和防盗门 |
| LC05 8560 | lc05-8560-lock-case | 85/60，静音斜舌，三个方舌，锁面板 240、锁体 173 |
| LC06 85×50mm PS | lc06-85-50mm-ps-lock-case | 通道功能，木门和金属门 |
| LC06 85_50PS | lc06-85-50ps-lock-case | 通道功能，85/50（与上一条似为重复记录） |
| LC07 85×45mm | lc07-85-45mm-lock-case | 85/45，锁面板 240×23、锁体高 173、深 72 |
| LC08 85×55mm | lc08-85-55mm-lock-case | 85/55，铁锁体，方形斜舌 |
| LC09 85×60mm | lc09-85-60mm-lock-case | 85/60，铁锁体，方形斜舌 |
| LC14 85×50mm | lc14-85-50mm-lock-case | 85/50，四根圆柱舌，防盗门 |
| LC15 | lc15-lock-case | 窄边框，钩舌，边距 20，欧标 |
| LC16 | lc16-lock-case | 无规格 |
| LC17 | lc17-lock-case | 推拉门钩舌，边距 16，铝钢锁体 |
| LC18 | lc18-lock-case | 窄边框，边距 17，配椭圆锁芯和盖板 |
| LC19 | lc19-lock-case | 窄边框，钩舌，边距 16，锁面板 158×20，锁体 100×30，椭圆锁芯 |
| LC20 | lc20-lock-case | 窄边框，边距 16，锁面板 138×20，锁体 91×28，椭圆锁芯 |
| LC21 85×50mm | lc21-85-50mm-lock-case | 85/50，通道功能 |
| LC22 85×45mm | lc22-85-45mm-lock-case | 85/45 |
| LC31 | lc31-lock-case | 无规格 |
| LC32 65×72mm | lc32-65-72mm-lock-case | 72/65 |
| LC33-5572 | lc33-5572-lock-case | 72/55，逃生功能，欧标 |
| LC34 50×72mm | lc34-50-72mm-lock-case | 72/50，铁锁体，方形斜舌 |
| LC35 8550 | lc35-8550-lock-case | 85/50，斜舌加方舌，欧标 |
| LC45*85 | lc45-85-lock-case | 无规格 |
| LC5845 | lc5845-lock-case | 58/45，铁锁体，不锈钢面板，锌合金加塑料或黄铜斜舌 |
| LC6860 | lc6860-lock-case | 68/60，照片可见三个方舌 |
| LC7065 | lc7065-lock-case | 卧式，锁面板到锁芯 70，锁芯到方轴 65 |
| LC7065PS | lc7065ps-lock-case | 卧式，通道功能 |
| LC7065S | lc7065s-lock-case | 卧式，规格同 LC7065 |
| LC8520 | lc8520-lock-case | 85/20，欧标 |
| LC8520B | lc8520b-lock-case | 85/20，JSON 写不锈钢锁体，室内门 |
| LC8520PS | lc8520ps-lock-case | 85/20，通道功能，照片斜舌位像滚珠 |
| LC8525 | lc8525-lock-case | 85/25，铁锁体 |
| LC8525 PS | lc8525-ps-lock-case | 边距 25，欧标，缺中心距 |
| LC8525B | lc8525b-lock-case | 85/25，铁锁体 |
| LC8530BK | lc8530bk-lock-case | 85/30，铁锁体 |
| LC8530PS | lc8530ps-lock-case | 85/30，通道功能 |
| LC8535 | lc8535-lock-case | 85/35，锁面板 240、锁体 173 |
| LC8535B | lc8535b-lock-case | 85/35，JSON 写不锈钢锁体 |
| LC9045 | lc9045-lock-case | 卧式，锁面板到锁芯 90，锁芯到方轴 45 |
| LC9230 | lc9230-lock-case | 92/30，铁锁体 |
| 7066 | 7066-lock-case | 卧式，164×44，锁面板 160，锁芯距锁面板 67，方轴距锁芯 66.8，椭圆锁芯孔 |
| AI8530 | ai8530-lock-case | 85/30，JSON 写铝外壳，用于铝门、木门、金属门 |
| AR4-110 | hyde-ar4-110-mortise-lock | 68/40，锁面板 212×25，锁体 127.3×60.8，齿片钥匙 |
| AR4-111 | hyde-ar4-111-mortise-lock | 72/40，锁面板 220×25，锁体高 140 |
| AR4-1121 | hyde-ar4-1121-hook-bolt-lock | 钩舌锁，边距 40，锁面板 140×25，锁体 82.4×66.7 |
| AR4-140 | hyde-ar4-140-mortise-lock | 铝门窄框，72/25，锁面板 183.5×20 |
| HY006DK | hy006dk-lock-case | 美式窄边框，双钩舌，铁锁体，螺纹黄铜锁芯 |
| HY006ET | hy006et-lock-case | 美式窄边框，单钩舌，JSON 写 "Entrance, keyed outside" |
| HY007 | hy007-lock-case | 窄边框防撬斜舌加长开，可换向 |
| HY007-S | hy007-s-lock-case | HY007 配推板拉手，分左右手 |
| HY008 | hy008-lock-case | 美式窄边框，平摆舌、钩舌或防撬斜舌可选，单开或双开 |
| 6068 | 6068-mortise-lever-handle-lock | 304 不锈钢执手锁，330 mm 面板，三方舌加斜舌，欧标 |

### 8.2 锁芯（lock-cylinders，45 款）

后缀：**KT** 为钥匙加旋钮（照片证实）；**DK** 为双开（摘要证实）。

| 系列 / 型号 | slug | 一句话 |
|---|---|---|
| 45 BNIK、45 SNIK | 45-bnik-…、45-snik-lock-cylinder | 45 mm 半锁芯，黑镍或缎面镍 |
| 45BN | 45bn-lock-cylinder | 45 mm 实心黄铜 |
| 47BSIK | 47bsik-lock-cylinder | 47 mm 半锁芯，3 或 5 把钥匙，电脑钥匙可选 |
| 54 DK、54 SNDK | 54-dk-…、54-sndk-lock-cylinder | 54 mm 双开 |
| 56 SN | 56-sn-lock-cylinder | 黄铜，缎面镍 |
| 60 BSKT、60 PBKT、60 SNKT | 60-bskt-…、60-pbkt-…、60-snkt-lock-cylinder | 60 mm 钥匙加旋钮 |
| 60 CPDK、60 SNDK | 60-cpdk-…、60-sndk-lock-cylinder | 60 mm 双开 |
| 65 SNKT、65SN | 65-snkt-…、65sn-lock-cylinder | 65 mm |
| 70 ABKT CP、70 ACKT BK、70 SNKT-1/-2/BK/CP、70SNKT-3 | 70-…-lock-cylinder | 70 mm 钥匙加旋钮；70 SNKT-2 分段 30/10/30 |
| 70 BSDK、70 MBDK CP、70 SNDK、70 SNDK CP | 70-…-lock-cylinder | 70 mm 双开 |
| 70ANTI-THEFT、70PB ANTI-THEFT、70PBDK CP-ANTI-THEFT、70SNDK CP-ANTI-THEFT、70SNKT CP-ANTI-THEFT | 70…anti-theft-lock-cylinder | 型号名带 "ANTI-THEFT"，防护内容没写明 |
| 70BK、70MB、70SN | 70bk-…、70mb-…、70sn-lock-cylinder | 70 mm；70SN 有 19 张图，含尺寸标注 |
| 80 BSDK、80 SNDK CP / 80 BSKT、80 PBKT、80 SNKT、80SN | 80-…-lock-cylinder | 80 mm，双开或钥匙加旋钮 |
| 90 SNDK / 90 BSKT、90 MBKT CP、90 SNKT | 90-…-lock-cylinder | 90 mm |
| Single oval cylinder | single-oval-cylinder-lock-cylinder | 椭圆单开锁芯，30 mm，6 弹子，3 把钥匙，电脑钥匙可选 |
| XF-1 | xf-1-lock-cylinder | 锁芯护盖（不是锁芯），HRC58 淬硬钢，穿心螺栓固定 |

### 8.3 JSON 里看起来有问题的规格（只标记，不修改）

1. **后缀和颜色矛盾**：70 ABKT CP 的摘要是 AB；70 ACKT BK 是 AC；70 SNKT BK、70 SNKT CP、70 SNDK CP 都是 SN；70 MBDK CP、90 MBKT CP 是 MB。后缀 "CP" 或 "BK" 和摘要里的表面对不上，含义待核实。
2. **表面清单不含型号本身的颜色**：45BN 的表面清单里没有 BN；70BK、70MB 的清单（PB/CP/SS/SC/AB/AC）里没有 BK、MB。像是通用清单。
3. **47BSIK** 写 "single or double-sided operation"，照片是 47 mm 半锁芯。
4. **XF-1** 是锁芯护盖，却放在 lock-cylinders 类目、名称叫 "Lock Cylinder"。
5. **通用功能清单**："Functions: Entrance, Anti-Panic, Privacy, …" 出现在 LC17（推拉门钩锁）、AI8530、LC6860 等 17 款上。推拉门钩锁不可能有逃生或隐私功能，这是系列描述，不能当成单款功能。
6. **"Latch = Copper"、"Spindle hole construction = Copper"**：铜质斜舌很可能是黄铜（brass）或镀铜锌合金，原文用词待核实。
7. **外壳材料**：LC02、LC03、AI8530 写铝外壳；LC8520B、LC8520PS、LC8535B 写不锈钢外壳。照片上是黑色锁体，外观和铁锁体一样，待核实。
8. **LC07**："Latch throw = 26mm"。标注图上的 26 mm 标在斜舌旁，更像是斜舌高度；26 mm 当作伸出量偏大。对比：EN 12209 最高等级的方舌最小伸出量才是 20 mm。待核实。
9. **LC9045 和 LC7065 系列**："Center distance" 填的是锁芯到方轴的距离，"Backset" 填的是锁面板到锁芯的距离。对卧式锁体这在几何上正确，但型号的读法和 85 系列相反，买家容易读反。
10. **HY006ET**：钩舌锁标 "Function = Entrance"，而 ANSI 的 Entrance 指带执手斜舌的功能，用词待核实。
11. **重复和缺失**：LC06 有两条记录（`lc06-85-50mm-ps`、`lc06-85-50ps`）；LC16、LC31、LC45*85 没有任何规格；LC8525 PS 缺中心距。
12. **LC6860、LC7065、LC7065S 的摘要**是 "Options: 85 Series, 72 Series…"，不是对产品的描述。

---

## 9. 相关标准（只作知识，不代表我们的产品符合）

| 标准 | 管什么 | 测什么（要点） |
|---|---|---|
| EN 12209 | 机械插芯锁、外装锁和锁扣板 | 11 位分级码：使用类别 1–3；耐久（斜舌 5 万到 20 万次）；门重（≤100 kg、≤200 kg、>200 kg）；防火适用 0/1；安全；腐蚀（24–240 h 中性盐雾）；防盗等级 0–7（方舌最小伸出量 10/12/14/20 mm，侧向力 1–7 kN，部分等级含防钻时间）；应用场合（插芯或外装，平开或推拉）；钥匙操作方式；执手操作方式；钥匙识别等级（叶片数、钥匙差异数） |
| EN 1303 | 锁芯 | 8 位分级码：耐久 4/5/6 级（2.5 万、5 万、10 万次）；钥匙安全 1–6 级（最少 100 到 100,000 个有效差异）；防攻击 0–D 级（钻 3–10 分钟、扭力 20/30 Nm、拔芯 10/15 kN）。2026 版的分级有变化 |
| DIN 18251 / DIN 18252 | 德国插芯锁 / 欧标锁芯 | 锁体等级、标准孔位；欧标型材尺寸 |
| BS 3621 | 英国防盗锁（可钥匙锁闭） | 据检索摘要：至少 5 个叶片或弹子，至少 1,000 个差异，方舌伸出至少 20 mm，防钻防撬（原文待核实） |
| TS 007（英国） | 锁芯与门把手的防拉断等 | 3 星（单独锁芯），或 1 星锁芯加 2 星把手；测撬拨、钻、撞匙、拉断、拔芯 |
| ANSI/BHMA A156.13 | 美国插芯锁 | 3 个等级；Grade 1 的循环次数约 100 万次（ANSI 博客的检索摘要）；功能代号与等级分开规定 |
| UL 437 | 美国钥匙锁和锁芯 | 测撬拨、钻、锯、撬、拉等。据检索摘要，门锁和锁芯至少 1,000 个钥匙变化；各项时间要求待核实 |
| EN 179 / EN 1125 | 逃生锁 | 与 LC33-5572 有关，见第 01 章 |
| GA/T 73-2015 机械防盗锁（中国） | 锁芯 A/B/C 级 | 防技术开启时间分别不少于 1、5、10 分钟（检索摘要） |

再次强调：我们的 JSON `certifications` 字段全部为空，**站上不得写或暗示通过以上任何一项**。

---

## 10. 来源

**已打开全文的页面**

- https://www.blue-id.com/en/blog/mortise-lock-mass
- https://www.lathamssteeldoors.co.uk/help-centre/how-to-measure-a-euro-cylinder-lock/
- https://lockwiki.com/index.php/EN_1303
- https://lockwiki.com/index.php/Euro_Profile
- https://www.abloy.com/global/en-us/abloy-technology/master-keying
- https://spivey.oriel.ox.ac.uk/corner/Euro-lock_with_a_slipped_cam
- https://www.securityparts.com/mortise-locks-commercial-guide
- https://practicaldiy.com/carpentry/mortice-lock/mortice-lock-fitting.php
- https://www.lockandkey.co.uk/product/adams-rite-ms1850-mortice-deadlock-case/datasheet.pdf
- https://eshop.klicovyservis.cz/_obchody/748.shop5.cz/soubory/classification-key-en12209_2003-mechanical-locks.pdf
- https://en.wikipedia.org/wiki/Pin_tumbler_lock

**只用了检索摘要的页面（没有打开全文，数字已标待核实或注明来源）**

- https://www.stuv.de/en_GB/steel-and-metal-engineering/mortise-locks/721/ （DIN 18251，55/72，锁面板 18×235×3）
- https://reiman.pt/en/211-9302-00-00000-profile-cylinder-din-18252/ （DIN 18252 截面尺寸）
- https://www.uhs-hardware.com/products/adams-rite-ms-deadlock-ms1850s-45x-1-1-8-backset-ansi-size-hook-bolt-flat-faceplate-aluminum-metal-door
- https://www.qualifiedhardware.com/brands/adams-rite/4900.htm
- https://www.directdoors.com/diy-help-advice/how-fit-mortice-lock/
- https://www.uniononline.co.uk/uk/en/knowledge-centre/what-are-bs3621-locks
- https://www.abus.com/uk/Consumer/Highlights/Highlights/X60 （TS 007）
- https://abloy.com/gb/en/documents/master-key-design-guide.pdf
- https://lockwiki.com/index.php/LIPS_Octro 、https://lockwiki.com/index.php/Kale_Kilit_164_BNE （凹坑锁）
- https://www.firgelliauto.com/blogs/mechanisms/lever-tumbler-lock
- https://www.cisa.com/content/dam/cisa/documenti/Brochure-Serrature-CISA-Standard-Lock-doppia-mappa.pdf
- https://www.lockshop-warehouse.co.uk/acatalog/cisa-45110-30-sliding-door-hook-case.html
- https://blog.ansi.org/ansi/ansi-grade-levels-bhma-locks-hardware-tests/
- https://webstore.ansi.org/preview-pages/BHMA/preview_ANSI+BHMA+A156.13-2005.pdf
- https://lockwiki.com/index.php/UL_437
- https://www.sina.cn/news/article/nikhyqt0428993.html （GA/T 73）

**站内依据**

- `content/products/*.json`（99 款）
- `public/images/products/`（本章引用的实拍图和标注图）
- `docs/research/image-audit/verdicts.json`（图审结论）
