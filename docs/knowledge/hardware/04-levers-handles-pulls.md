# 04 执手 / 不锈钢执手 / 拇指压把套装 / 玻璃门拉手

> 适用 categoryPath：`lever-handles`、`stainless-steel-handles`、`grip-handle-sets`、`glass-door-accessories/glass-door-handles`。
> HYDE 站共 140 条记录：执手 63、不锈钢执手 45、拇指压把套装 16、玻璃门拉手 16（2026-10-14 按 `sites` 过滤统计）。
> 筒式斜舌（tubular latch）、单头锁舌（deadbolt）、2-1/8″ 横孔的细节见 `03-knob-tubular-deadbolt-rim.md`，本章不重复。
> 本章只写行业通用知识和我们 JSON 里写明的内容。不声明、不暗示任何产品通过任何认证。不确定的数字标「待核实」。

---

## 1. 是什么、怎么工作

### 1.1 四类产品的动作链

| 类型 | 动作链 |
|---|---|
| 美式筒式执手（tubular lever set） | 压执手（lever）→ 执手内的驱动件转动 → 转动方轴/驱动片（spindle / drive bar）→ 斜舌（latch bolt）的凸轮（cam）把舌拉回 → 松手后回位弹簧把执手和斜舌复位 |
| 欧式圆底座执手（lever on rose） | 压执手 → 方轴（一般 8mm）→ 插芯锁（mortise lock）的拨轮（follower）转动 → 斜舌缩回。底座（rose）只是装饰盖和支承，里面是否有弹簧决定执手是否"自己弹回" |
| 长面板执手（lever on backplate） | 同上，但执手、钥匙孔或锁芯孔装在一块长面板上。面板上的两孔间距（中心距，centres）必须与锁体一致 |
| 拇指压把套装（grip handleset / thumb-latch entry set） | 室外：握住固定拉手（grip），用拇指压上方的压片（thumbpiece）→ 压片尾端穿门推动斜舌机构 → 斜舌缩回。室内：执手或球把直接转动斜舌。上方另配单头锁舌：室外钥匙、室内旋钮（thumbturn） |
| 拉手（pull handle） | 没有机构。只是一个固定的抓握件，配合闭门器或地弹簧使用：拉开、推回 |

### 1.2 带弹簧的底座（sprung rose）和不带弹簧的底座

- 执手是一根悬臂。很多锁体内部的回位弹簧力不够把执手托平，执手会慢慢下垂（droop）。
- 带弹簧的底座在底座里自带复位弹簧，负担执手重量，锁体弹簧只管斜舌。
- 英国厂 Joseph Giles 把底座分为：带弹簧+轴承、只有轴承、普通平底座（basic）；普通底座只在装不下弹簧机构时用（例如薄金属门），执手的复位依赖锁体弹簧和安装精度。
- EN 1906 的第 8 位把执手分为：A（弹簧辅助）、B（预紧弹簧）、U（无弹簧）。不同年份版本定义略有不同。
- 我们的照片：9014 SSBK 的执手底座背面是一块镀锌钢底盘（`9014-ssbk-stainless-steel-handle-2.webp`）；9088 SS 的 JSON 写的是"每块面板后有复位弹簧盒（return spring cassette）"。照片本身无法证明某个圆底座里有没有弹簧，单看外观不能判断，需要「待核实」。

### 1.3 方轴（spindle）规格

- 欧洲执手最常见的是 8mm 方轴。Häfele 目录中的执手套装都配 8×8mm 方轴，长度 95–115mm 不等。Joseph Giles 的 8mm 方轴适用门厚可到 54mm。
- 也有 7mm、9mm（2N 的执手方轴有 7/8/9mm 三种宽度），英国旧锁还有 7.6mm。
- 方轴形式：一体实心方轴、对开方轴（split spindle，两半各连一只执手）、带螺纹或带凹槽配顶丝（grub screw）的方轴。
- 浴室旋钮/应急开启用的是另一根细方轴，英国常见 5mm。
- 美式筒式执手不用独立的 8mm 方轴，而是执手底盘里的驱动片穿过斜舌（见 03 章）。
- 我们 JSON：不锈钢圆底座执手多写"Spindle: 8mm"（9003E、9004S、9005E、9007S、9014、LH1033 SS、NC182）；LH1016 写 9mm（见第 8 节标记）。

### 1.4 固定方式：穿门螺栓（through-bolt）和暗装（concealed fixing）

- **穿门螺栓**：室外一侧底座上焊有螺纹套柱，螺栓从室内一侧穿门拧进去，两侧互相夹紧。厂家普遍认为这是更稳的做法。我们的 LH852 配件照片里，一只执手带一根驱动轴和两根套柱，另配 2 根长机牙螺丝（`lh852-bnbk-lever-handle-4.webp`）。8829 BL 两执手之间也是两根穿门螺杆夹一根方轴（`products-hyde/8829-bl-lever-handle-3.webp`）。
- **木螺丝固定**：底座用木螺丝各自固定在门面上，两侧互不连接。
- **暗装**：底座分为底盘和外盖。先用螺丝把底盘固定，再把外盖拧上或卡上，螺丝头就看不见了。9003E 的照片可见镀锌钢底盘和 2 个螺丝孔（`9003e-stainless-steel-handle-3.webp`），外盖是不锈钢。
- **明装**：面板上可以看到螺丝。EH01–03 和 DH02 的长面板上下各有可见螺丝孔。

### 1.5 左右手（handing）和可换向执手

- 门的左右手：站在门外（推开的那一侧），合页在左边就是左手门（LH），合页在右边就是右手门（RH）；门向外拉开的为反手（LHR/RHR）。
- **对称执手**（直杆、圆管 L 形）：不分左右，两侧通用。
- **有方向的执手**（造型有上下之分，例如弯钩、鸟笼、扭花）：执手头必须朝上。Kwikset 的可换向执手是把室内和室外执手拆下互换，以免装完执手倒置。Allegion 说明，有方向的执手不能在室内外之间互换，否则只能倒着装，必须订对应左/右手的执手。
- 我们 JSON：锌合金筒式执手都写"Fully reversible, left or right hand"；拇指压把套装写"Non-handed"。
- 判图要点：拇指压把一侧通常是固定拉手，不分左右，但压片必须在拉手上方并朝向门内。长面板执手如果做了左右手面板，锁芯孔要在执手下方。

### 1.6 浴室锁：旋钮锁门 + 外侧应急开启（privacy turn and release）

- **美式筒式**（如 LH853 SNBK、8826 SNBK）：室内执手上有按钮或旋钮（JSON 写"turn button inside"）。按下或转动后，室外执手被锁住。室内执手转动或关门时，是否自动解锁取决于具体型号。室外执手上有一个应急孔，用细针或专用工具可以打开（ANSI 名称 F76 Privacy）。
- **欧式插芯**：执手只管斜舌，另外配一套"旋钮 + 应急开启"玫瑰（WC turn & release）。室内是旋钮；室外是硬币槽或螺丝刀槽，部分型号带"有人/无人"红绿指示。二者用 5mm 方轴连接浴室插芯锁的锁舌。
- 9088 SS 用的是欧式锁芯，室外钥匙、室内旋钮。这是"入户/房间"功能，不是浴室功能。

### 1.7 拇指压把入户套装（grip handleset）

- 美式标准开孔：上下两个 2-1/8″ 孔，中心距 5-1/2″，背距 2-3/8″ 或 2-3/4″（Ashley Norton 安装说明）。
- 上方是单头锁舌：室外钥匙锁芯，室内旋钮。下方是斜舌：室外拇指压把，室内执手或球把。拉手下端还有一根固定柱，用螺丝从室内穿门固定。
- 我们 JSON 的写法："Backset 60/70mm adjustable, latch and deadbolt both"、"Deadbolt throw 25mm, with hardened steel insert"、"Latch extension 13mm"、"Cross bore 51mm"。最后一项与美式标准 2-1/8″（54mm）不一致，见第 8 节。
- 70610 的配件照片：
  - `-2`：斜舌和锁舌两个舌芯，配两只塑料防尘盒。
  - `-3`：3 把钥匙、带唇边的斜舌扣板、锁舌扣板、一袋螺丝。
  - `-7`：单头锁舌室外锁芯（带尾杆）、室内旋钮和底盘。

### 1.8 拉手：背靠背、单面、中心距、离门距离、管径

- **背靠背（back-to-back）**：门两面各装一只拉手，用一根螺杆穿门把两只连接起来，没有可见螺丝。From the Anvil 的做法：螺杆先全拧进一只拉手再退约 5mm，穿过门后拧上第二只。
- **单面穿门螺栓（single-sided bolt-through）**：只装一只拉手，螺栓从另一面穿过门，那一面只留装饰盖（cover cap）。常见用法：门一面装拉手，另一面装推板。
- **中心距（centres / fixing centres）**：两条支脚轴线之间的距离，决定门上打孔的间距；和拉手总长不是一回事。From the Anvil 的例子中，900mm 长的拉手，固定中心距是 700mm。
- **离门距离（stand-off / projection）**：手握位置到门面的净空。英国 BS 8300-2 的二手引述：手与门面之间至少 45–50mm；管径 19–35mm（常见 19/25/32/35mm）；固定中心距至少 300mm（来源：Made in Britain 汇总，原文待核实）。
- **玻璃门拉手**：门是钢化玻璃（toughened / tempered glass），孔必须在钢化之前开好，钢化之后再钻孔会使玻璃整块碎裂（Wagner、Tecnoglass、DTU 研究）。行业规则：孔径至少比玻璃厚度大 1/16″，且不小于 6mm；孔边到玻璃边缘不小于 2 倍玻璃厚度，且不小于 6mm。孔径以拉手图纸为准，例如 Bohle 某款要求在玻璃上开 12mm 孔。
- **我们的玻璃拉手**：管径 32mm，壁厚 1.0mm（可选 0.8mm），总长 600mm，适用 10–12mm 玻璃（100/102/104/106/107）。照片 `stainless-steel-glass-door-pull-handle.webp` 是两对背靠背拉手的侧视图：两根立管加两根支脚，支脚中间的环就是玻璃所在的位置。

### 1.9 实心 vs 空心 304 不锈钢

- **空心管执手**：把 304 不锈钢管弯曲、斜切后焊接，再抛光。重量轻、成本低，强度取决于壁厚和焊缝质量。
- **实心执手**：精密铸造（investment casting）或锻造，再经机加工和抛光。重、手感实。
- 公开资料里找不到"同牌号空心 vs 实心"的腐蚀对比试验。腐蚀取决于牌号和表面处理，与内部是否空心无关。
- 201 与 304：201 的镍、铬含量低，耐蚀性明显较差。304 在含氯环境（海边、泳池）也会出现茶色锈斑（tea staining），这类场合行业推荐 316。
- 我们 JSON 里写明 304 的只有玻璃拉手（100/102/104/106/107）和 9088 SS（"SUS 304 stamped on the plate"）。其他记录只写"Stainless steel"，没有写牌号。

### 1.10 表面：拉丝/缎面、镜面、PVD、电镀、喷涂

- **不锈钢本色**：没有镀层，靠钝化膜防锈。拉丝最不显指纹，镜面最显手印（Griffwerk）。
- **电镀**（锌合金常用，如镍、铬、仿古铜）：镀层薄而软，会失光、磨穿、变色。
- **PVD**（物理气相沉积）：在真空腔里沉积微米级的钛或锆化合物膜，耐刮耐蚀；常用于黑色、金色、枪色等深色效果。
- **粉末喷涂**：撞击后局部会崩落，露出底材。
- 我们 JSON 的表面代号（与 BHMA/US 代号对应的写法照 JSON 原样）：
  - SN 缎镍（US15）、SS 缎面不锈钢色（US32D）
  - PB 亮黄铜（US3）、SB 缎黄铜（US4）、AB 仿古铜（US5）
  - AC 仿古红铜、SC 缎铬、CP 亮铬
  - BN 黑镍、GM 枪色、MB 哑黑
  - 不锈钢的 SSS/PSS（LH1016）

---

## 2. 装在哪里、怎么装

### 2.1 门类型与材质

| 产品 | 适用门 |
|---|---|
| 筒式执手、拇指压把套装 | 木门、钢门。北美式开孔：横孔 + 边孔；门厚见 2.4 |
| 欧式圆底座/长面板执手 | 木门、钢门、铝门（需配插芯锁）。薄金属门可能装不下带弹簧的底座 |
| 9082E 外侧执手面板 | 推杠逃生装置的室外配套执手（JSON："outside lever for panic exit devices"）；详见 01 章 |
| 600 嵌入式拉手 | 推拉门、口袋门（JSON：Sliding / Pocket door） |
| 玻璃门拉手 | 10–12mm 钢化玻璃门（JSON），无框玻璃门 |

### 2.2 左右手与推/拉侧

- 执手、拇指压把、锁舌永远装在锁边（lock stile），不装在合页边。
- 背靠背拉手两侧都能拉，所以门两侧都装拉手。若门一侧装推板一侧装拉手，拉手装在拉开方向那一侧。
- 浴室锁：旋钮在浴室内侧，应急开启在走廊一侧。

### 2.3 安装高度与背距

- 美国 ADA 2010 标准 404.2.7：门上执手、拉手、锁等可操作件距完成地面 34–48 英寸（865–1220mm），而且必须单手操作，不需要紧握、捏或扭转手腕（309.4）。圆球把因此不利于无障碍，执手可以。
- 美式开孔模板常把执手中心定在离地 36″（914mm），也有 38″（965mm）的。
- 英国：执手高度在二手资料中多引 900–1000mm（Approved Document M / BS 8300，原文待核实）；拉手 900–1100mm（Made in Britain 汇总）。
- 背距（backset）是门边到执手中心的距离：
  - 美式 60mm（2-3/8″）或 70mm（2-3/4″），我们的筒式执手多写"60/70mm"可调；LH853 系列 JSON 写死 60mm。
  - 9088 SS 的插芯锁背距 45mm、中心距 58mm（执手到锁芯）。

### 2.4 门厚范围（我们 JSON）

| 类型 | 门厚 |
|---|---|
| 锌合金筒式执手、拇指压把套装 | 35–45mm 可调 |
| 不锈钢圆底座执手 | 35–50mm |
| 玻璃拉手 | 10–12mm 玻璃 |

门厚超出范围时，要换长螺丝、长方轴或长尾杆。Joseph Giles 的标准方轴适用门厚到 54mm。

### 2.5 门上开孔

| 产品 | 典型开孔 |
|---|---|
| 筒式执手 | 门面 2-1/8″（54mm）横孔；门边 1″（25.4mm）边孔装斜舌；斜舌面板和扣板需要铣浅槽（见 03 章）。厂家建议横孔从门两面对钻，防止木门崩边 |
| 拇指压把套装 | 两个 2-1/8″ 横孔，中心距 5-1/2″；下方固定柱另开一个小孔（门上没有就要补钻） |
| 欧式圆底座 + 插芯锁 | 门边铣插芯锁槽；门面钻方轴孔和锁芯孔（或钥匙孔）。穿门螺栓需要另钻 2 个小孔。孔距必须等于锁体中心距 |
| 长面板 | 同上；面板中心距（欧式常见 72mm / 92mm，英国浴室锁 57/78mm）与锁体一致；装面板的螺丝孔以面板图纸为准 |
| 背靠背拉手 | 按拉手中心距开 2 个通孔（木门、金属门），孔径按螺杆/螺栓选，From the Anvil 指南建议比螺栓大 1–2mm |
| 玻璃拉手 | 孔在钢化前由玻璃厂开好；孔径和中心距交给玻璃厂 |
| 600 嵌入式拉手 | 门面铣一个长圆形浅槽，2 颗自攻螺丝固定（照片 `600-concealed-sliding-door-handle-3.webp`）；槽深和尺寸「待核实」 |

### 2.6 必须配什么

- **筒式执手**：斜舌、扣板（strike）、防尘盒（dust box）。入户功能还要钥匙；如需和单头锁舌同钥匙，要订对齿（keyed alike，JSON 有此选项）。
- **欧式执手**：插芯锁体、方轴、锁芯（欧式锁芯）或钥匙孔盖、锁芯装饰盖（escutcheon）、扣板。浴室功能另配"旋钮 + 应急开启"玫瑰。
- **拇指压把套装**：斜舌、单头锁舌、两块扣板、钥匙、室内执手或球把。
- **拉手**：闭门器或地弹簧（拉手本身不能把门关上）；推板或另一只拉手；玻璃门还需要地弹簧或夹具（见对应章节）。

### 2.7 常见安装错误

1. **背距没调到门上的实际尺寸**：斜舌够不到驱动件，或执手压不动。
2. **斜舌斜面装反**：斜面应朝向门关上时扣板所在的一侧，否则门关不上。
3. **穿门螺丝拧得过紧**：执手发卡、不回位。Ashley Norton 提醒不要拧过紧，并建议略回松。
4. **方轴偏向一侧**：一只执手吃不满方轴。Status 的安装说明建议在方轴两侧画线，保证居中。顶丝要对准方轴的凹槽。
5. **有方向的执手装倒**：执手头朝下，或室内外装反。
6. **拇指压把套装的室内旋钮装错方向**：Ashley Norton 要求锁舌尾杆竖直插入。
7. **按 51mm 开孔却用 54mm 底座的产品**（或反过来）：底座盖不住孔，或装不进去。
8. **玻璃门在钢化后才钻孔**：会整块碎裂。或者孔边太靠近玻璃边。
9. **单面拉手的螺栓长度没算**：要计入门厚、贴面层和离门距离，还要留够拧装饰盖的螺纹。
10. **浴室旋钮装到了走廊一侧**；或忘了装室外应急开启件。

---

## 3. 场景和展示怎么做才对（判 AI 图规则）

### 3.1 必须对的

- **位置**：执手、拉手、压把都在锁边；执手的转轴（底座中心）离门边约 60/70mm（美式）；执手自由端指向合页方向，不指向门边外。
- **一套成对**：门两面的执手底座中心等高、正对，因为它们共用一根方轴或驱动片。背靠背拉手的两根管也在同一位置正对。
- **高度**：执手大约在成人腰部，约 0.9–1.0m；不能出现在门的上三分之一或贴近地面。
- **长面板**：执手在上，锁芯孔或钥匙孔在下（EH01、DH02、9088 SS 的照片都是如此）；面板竖直，紧贴门面。
- **拇指压把套装**：室外是"上锁芯 + 下拉手"，压片在拉手顶端；室内是"上旋钮 + 下执手/球把"。室内不会出现第二只拉手。
- **浴室锁**：室内一侧看到旋钮，室外一侧看到应急孔或硬币槽。
- **玻璃拉手**：两根立管分别在玻璃两面，支脚穿过玻璃；玻璃上看不到螺丝。只是一面玻璃，不会有门框和合页（无框门靠地弹簧或夹具，另见相关章节）。
- **表面**：同一张图里执手、底座、锁芯盖、扣板是同一种表面；JSON 写 MB（哑黑）就全部是黑色。图审已发现 EH01/EH03 的 AI 图把锁芯画成黄铜色，配在黑色面板上，判为不通过。
- **比例**：执手长度对得上 JSON。例如 9003E 执手长 133mm、底座 Ø53mm，执手长约为底座直径的 2.5 倍；8829 BL 执手 160mm；玻璃拉手长 600mm，在普通门上约占门高的四分之一，不能长到接近门宽（图审已判 100-5 不通过）。

### 3.2 物理上不可能的（见到就判错）

- 执手装在合页边，或门两面执手高度不同、不对正。
- 一个底座上没有方轴孔或固定方式，执手却"悬"在门上（底座直径小于执手根部，看不到任何连接）。
- 长面板执手的锁芯孔在执手上方（我们的产品照片里没有这种排列），或面板上的孔数与产品照片不一致。
- 拇指压把放在门的室内一侧，或室内外都是固定拉手。
- 浴室旋钮出现在走廊一侧；或室外执手上有钥匙孔，却标为浴室功能。图审已判 9014 SSBK 的渲染图不通过：画了四舌锁体和钥匙锁芯，与 JSON 的浴室功能矛盾。
- 玻璃门拉手底下有木门框或合页；或者拉手装在玻璃门的合页边、夹具上。
- 不同表面混在同一套：黑面板配金色执手、银色锁芯配黑面板。
- 凭空多出零件：例如套装照片里没有的装饰盖、锁体、钥匙。图审已判 9014 SSET 的渲染图不通过：多画了锁体和锁芯。

### 3.3 正常状态下看不见的

- 门关着：斜舌、锁舌、方轴、穿门螺栓、底座里的弹簧都看不见；只能看到执手、底座、锁芯面和锁边的面板。扣板在门框上，门关着时被门挡住大半。
- 暗装底座：看不到螺丝。明装面板可以看到螺丝头。
- 背靠背拉手：看不到螺杆；单面穿门的拉手，另一面只看到装饰盖。
- 玻璃拉手：支脚穿过玻璃的部分在透明玻璃中可见，这是唯一允许看到连接件的场景。
- 拇指压把的压片尾端、斜舌机构都在门内。

---

## 4. 功能和使用

### 4.1 功能对照（我们 JSON 的型号后缀 → ANSI 常见名称）

| JSON 后缀 / 写法 | 功能 | 常见 ANSI 代号（Securityparts 等二手资料） | 动作 |
|---|---|---|---|
| ET "Entrance, keyed outside" | 入户（entry） | F109（Entrance）；或 F82（Office） | 室外钥匙；室内按钮或旋钮锁住室外执手；室内执手随时可开 |
| BK "Privacy, bathroom, turn button inside" | 浴室（privacy） | F76 | 室内按钮或旋钮锁门；室外应急孔开启 |
| PS "Passage" | 通道（passage） | F75 | 两侧随时可开，不能上锁 |
| "dummy" | 假执手（dummy） | F170 半假执手（二手资料） | 只是拉手，没有斜舌 |

- 后缀是我们的命名规律（ET/BK/PS），从 JSON 的 `Function` 字段推得。没有 `Function` 字段的型号（8803、8806 等）只能看 summary。
- F82 与 F109 的区别在不同厂家的资料里写法不一，具体以订单规格为准。
- **欧式长面板**的功能由插芯锁体和锁芯决定，执手本身不决定功能：
  - 9088 SS：钥匙 + 旋钮锁芯。
  - EH01–03：欧式锁芯孔，锁体另配。

### 4.2 日常使用与维护

- **拉丝不锈钢**：用软布清洁。海边和泳池环境要更勤清洁（有供应商建议至少每 6 个月一次），否则会出现茶色锈斑。
- **PVD 和电镀表面**：不要用研磨剂或强化学清洁剂。
- **定期检查**：
  - 穿门螺丝或底座螺丝是否松动；执手松动时会晃，而且下垂。
  - 顶丝（grub screw）是否松脱。
- 筒式执手的斜舌在漆后可能被油漆粘住；斜舌扣板对不准时，门需要用力推才能关上（见 03 章）。

### 4.3 典型故障

| 故障 | 常见原因 |
|---|---|
| 执手下垂（droop） | 底座没有弹簧，锁体弹簧不够；弹簧疲劳；执手太重（实心长执手） |
| 执手晃动、空转 | 螺丝松；方轴与锁体方孔配合太松（例如 7.6mm 方轴配 8mm 孔）；顶丝没压在凹槽里 |
| 执手压不回 | 穿门螺丝过紧；方轴过长、顶到锁体；门厚超范围 |
| 浴室锁打不开 | 应急孔被涂层封住；室内按钮卡死 |
| 电镀面起泡、掉色 | 镀前处理不好；锌合金铸件有气孔，镀层下面"冒泡"；汗手长期摩擦 |
| 不锈钢生锈 | 用了 201；304 用在含氯环境；加工时铁屑嵌入表面没清洗干净 |
| 空心管执手焊缝开裂、凹陷 | 壁厚不足、焊接不良（买家指南把"空心 + 焊接差"列为强度隐患） |
| 玻璃拉手松动 | 螺丝没锁紧、没加垫片；玻璃孔径偏大 |

---

## 5. 材料和工序（行业通用；我们工厂的做法只引用 JSON）

### 5.1 各零件常见材料

| 零件 | 常见材料 | 我们 JSON 写到的 |
|---|---|---|
| 执手 | 锌合金（压铸）、黄铜（锻造）、不锈钢（管材弯焊或精铸）、铝合金 | 锌合金（筒式）；"Trim: Zinc die-casting electro-plated or solid brass"；不锈钢；EH 系列"Handle Material: Aluminum Alloy" |
| 底座 / 面板 | 锌合金、不锈钢板冲压、铁板冲压、铝 | 9088：SUS 304 板 200×50×1mm；EH 系列"Backplate Material: Iron" |
| 底盘 / 机构（chassis） | 冲压钢件，镀锌防锈 | "Solid steel, zinc plated for corrosion resistance" |
| 方轴 | 钢，镀锌（照片中呈黄锌或蓝锌色） | 8mm（多款） |
| 斜舌、锁舌 | 锌合金或钢；锁舌内含淬硬钢芯 | "Deadbolt throw 25mm, with hardened steel insert" |
| 锁芯 | 黄铜或锌合金 | 不锈钢执手"Cylinder: Brass"；9088 锁芯"zinc alloy" |
| 插芯锁体 | 钢板（铁）冲压 | 9088 "Lock case: Mortise lock body, iron" |
| 拉手 | 304 不锈钢管、实心棒，配黄铜或不锈钢螺杆 | 304 管 Ø32，壁厚 1.0（可选 0.8）mm |

### 5.2 工序

- **锌合金执手**：
  1. 压铸
  2. 去浇口、去披锋
  3. 研磨、抛光
  4. 电镀（铜打底，再镍/铬），或仿古、喷涂
- **黄铜执手**：热锻 → 机加工 → 抛光 → 电镀或 PVD。
- **不锈钢管执手**：
  1. 下料
  2. 弯管，斜接处焊接
  3. 焊缝打磨
  4. 拉丝或镜面抛光
  5. 底座冲压、拉伸
- **实心不锈钢执手**：精密铸造或锻造 → 机加工 → 抛光。
- **长面板**：冲压、冲孔，或压铸；然后表面处理。
- **玻璃拉手**：
  1. 管材切断
  2. 支脚焊接或螺纹连接
  3. 抛光、拉丝
  4. 107 型的中段换成亚克力（JSON："Middle Part Acrylic"）
- **PVD**：工件清洗 → 真空镀膜。前道抛光的质量直接决定成品效果。

### 5.3 装配与测试

- 执手装上驱动件和回位弹簧；筒式执手连底盘预装成两半，加上斜舌、扣板、螺丝包装（配件照片 `lh852-bnbk-lever-handle-4.webp`）。
- **行业常见测试**：
  - 循环开合寿命：EN 1906 第 2 位分为 6 级 = 100,000 次、7 级 = 200,000 次。
  - 静载强度、扭矩、自由转角和间隙。
  - 盐雾试验：EN 1906 第 6 位为耐蚀 0–5 级。
- 我们 JSON 写"Cycle life: 200,000 cycles"。这只是数字，不等于通过任何认证，文案不能写成"符合 EN 1906 7 级"。

### 5.4 QC 要点

1. 执手装上后是否水平，回位是否干脆，有没有下垂。
2. 方孔尺寸与方轴配合（8mm）是否合适：没有晃动，也没有卡滞。
3. 镀层：有无起泡、麻点、色差；同一批同一表面颜色一致。
4. 不锈钢：
   - 牌号核实：磁铁不能区分 201 和 304，因为二者在退火状态下都基本无磁；需要光谱或化学分析，此条为行业常识「待核实来源」。
   - 板上钢印"SUS304"只是标记，不是检验结果。
5. 管材壁厚（JSON：1.0mm 或 0.8mm）、焊缝无砂眼、斜接对齐。
6. 背距可调件在 60 和 70 两个位置都能正常工作；斜舌伸出量（JSON：13mm）。
7. 配件包按清单清点：螺丝长度对应门厚范围、钥匙数量、扣板。
8. 有方向的执手：左、右手不能装错盒。

### 5.5 便宜货为什么坏

- 锌合金压铸件气孔多 → 镀层起泡；壁薄 → 执手根部断裂。
- 没有弹簧底座或弹簧太软 → 半年就下垂。
- 用 201 冒充 304 → 卫生间、海边生锈。
- 空心管壁太薄（低于 0.8mm 时多见，「待核实」）→ 一压就凹、焊缝开裂。
- 电镀薄 → 手常摸的位置先露底。
- 方轴、方孔公差大 → 执手晃、空行程大。

---

## 6. 拆解（典型零件清单 + 我们照片对应）

### 6.1 美式筒式执手（以 LH852 为例）

| 零件 | 我们照片 |
|---|---|
| 室外执手（带驱动轴、两根穿门套柱） | `lh852-bnbk-lever-handle-4.webp` |
| 室内执手（带底座） | 同上 |
| 60/70 可调斜舌 | 同上；`70610-ab-grip-handle-set-2.webp` |
| 带唇边扣板 | `lh852-bnbk-lever-handle-4.webp`；`70610-ab-grip-handle-set-3.webp` |
| 2 根穿门机牙螺丝、4 颗木螺丝 | `lh852-bnbk-lever-handle-4.webp` |
| 塑料防尘盒 | 同上 |
| 室内按钮（入户、浴室款） | `lh853-snet-lever-handle-2.webp`（执手根部的扁按钮） |

### 6.2 欧式圆底座执手（以 9014 SSBK / 9003E 为例）

| 零件 | 我们照片 |
|---|---|
| L 形圆管执手 + 镀锌钢底盘 + 方轴 | `9014-ssbk-stainless-steel-handle-2.webp` |
| 固定圆拉手（另一侧） | 同上 |
| 4 片欧式锁芯盖（2 底 + 2 盖） | 同上 |
| 螺丝包 | 同上 |
| 一对弯管执手、底盘、带铜衬的方轴 | `9003e-stainless-steel-handle-3.webp` |

注意：9014 SSBK 的照片里是欧式锁芯盖，而 JSON 写的是浴室功能，二者不一致（见第 8 节）。

### 6.3 长面板 + 插芯锁套装（9088 SS）

`9088-ss-stainless-steel-handle-2.webp`（实拍）包含：
- 一对 SUS(304) 面板执手；
- 插芯锁体（斜舌 + 方舌）；
- 欧式锁芯（钥匙 + 旋钮）和 3 把钥匙；
- 方轴；
- 扣板；
- 塑料盒；
- 穿门螺丝、套管、膨胀塞。

与 JSON "Supplied with" 清单一致。

### 6.4 拇指压把套装（70610）

| 零件 | 照片 |
|---|---|
| 斜舌、锁舌、两只防尘盒 | `70610-ab-grip-handle-set-2.webp` |
| 钥匙 ×3、斜舌扣板、锁舌扣板、螺丝袋 | `70610-ab-grip-handle-set-3.webp` |
| 室外锁芯（带尾杆）、室内旋钮、底盘 | `70610-ab-grip-handle-set-7.webp` |

拇指压把本体和室内执手：本次没有逐张核对，「待核实」照片编号。

### 6.5 其他

| 型号 | 照片 | 内容 |
|---|---|---|
| 8829 BL | `products-hyde/8829-bl-lever-handle-3.webp` | 两只方形执手、两根穿门螺杆、一根方轴；执手侧面有滑动锁门按钮 |
| EH01 | `eh01-lever-handle-2.webp` | 长面板（上下各 1 个螺丝孔）、鸟笼执手、欧式锁芯孔 |
| DH02 | `dh02-ab-grip-handle-set-3.webp` | 两块长面板：一块是固定拉手，一块是执手；各有欧式锁芯孔、4 个螺丝孔 |
| 600 | `600-concealed-sliding-door-handle-3.webp` | 嵌入式拉手、2 颗自攻螺丝 |
| 背靠背玻璃拉手 | `stainless-steel-glass-door-pull-handle.webp` | 两对拉手，侧视为 H 形 |
| 19-130MM | `19-130mm-glass-door-handle-3.webp` | 圆弧端面板 + U 形拉手，面板 4 个孔 |

---

## 7. 演示怎么拍

1. **门外全景**：门关着，执手在锁边、腰高，合页在另一边。先交代"左右手"和推拉侧。
2. **压执手特写**：慢动作；切一个剖面动画，显示方轴转动 → 斜舌缩回 → 松手后执手弹回水平（用于展示弹簧底座，型号必须有弹簧证据）。
3. **筒式执手安装**：
   1. 调背距 60 → 70
   2. 插斜舌，斜面朝向扣板
   3. 室外执手穿门
   4. 室内执手对准套柱
   5. 两根螺丝从室内拧紧
   6. 门关上，斜舌进扣板
4. **换向**：拆下有方向的执手，换到另一侧；对称执手则直接说明"不分左右"。
5. **浴室功能**：室内按下或转动按钮 → 室外执手压不动 → 用工具从室外应急孔打开。
6. **拇指压把**：
   - 室外：拇指压下压片 → 斜舌缩回。
   - 钥匙开上方锁舌，锁舌伸出 25mm。
   - 室内：执手开门，旋钮锁舌。
7. **长面板 + 插芯（9088）**：钥匙转锁芯 → 方舌伸出；执手只控制斜舌。
8. **背靠背玻璃拉手**：
   - 先展示玻璃上预开的孔（钢化前开）。
   - 支脚穿过玻璃。
   - 另一侧拉手对上，锁紧顶丝。
   - 手握拉手拉开（门由地弹簧控制，不在本章范围）。
9. **表面并排**：同一款不同表面并排放在同一灯光下；不要在一扇门上混用两种表面。

拍摄禁忌：不要拍出我们照片里没有的零件；尺寸要和 JSON 对得上。没有实拍的颜色（如 LH852 GM 枪色，图审判为"实拍改色"），不要作为实拍展示。

---

## 8. 我们站上的对应型号

后缀规律：ET = 入户，BK = 浴室，PS = 通道（从 JSON `Function` 推出）。

| 型号 | slug | 说明 |
|---|---|---|
| 3431 SNET / SSET | `3431-snet-lever-handle`, `3431-sset-lever-handle` | 锌合金筒式执手，入户，60/70，35–45mm |
| 6491 SNET / SSET / ABET | `6491-snet-lever-handle`, `6491-sset-lever-handle`, `6491abet-lever-handle` | 同上，SN / US32D / US5 三种表面 |
| 801 PBET；803 PBET / SBET | `801-pbet-lever-handle`, `803-pbet-lever-handle`, `803-sbet-lever-handle` | 入户，PB(US3) / SB(US4) |
| 804 PBET；805PBET | `804-pbet-lever-handle`, `805pbet-lever-handle` | 入户；JSON 列出 7 种表面 |
| 807 ABBK / ABET | `807-abbk-lever-handle`, `807-abet-lever-handle` | 浴室 / 入户，仿古铜 |
| 808 ABET / MBET / SNET / SNPS | `808-abet-lever-handle`, `808-mbet-lever-handle`, `808-snet-lever-handle`, `808-snps-lever-handle` | 一个造型的入户和通道款；"60/70mm adjustable tubular latch" |
| 809 PBET / SBET；812 SSET | `809-pbet-lever-handle`, `809-sbet-lever-handle`, `812-sset-lever-handle` | 入户 |
| 816 PBET / SNET；819 PBET；822 SNET；823 PBET | `816-pbet-lever-handle`, `816-snet-lever-handle`, `819-pbet-lever-handle`, `822-snet-lever-handle`, `823-pbet-lever-handle` | 入户；819 PBET 没有 specs |
| 836；836 SNET | `836-lever-handle`, `836-snet-lever-handle` | 836 可选四种功能 |
| 853 SNBK / SSBK | `853-snbk-lever-handle`, `853-ssbk-lever-handle` | 浴室 |
| 8803 SNBK / SNET；8806 SSBK / SSET | `8803-snbk-lever-handle`, `8803-snet-lever-handle`, `8806-ssbk-lever-handle`, `8806-sset-lever-handle` | 浴室 / 入户；JSON 没有 specs |
| 8826 SNBK / SNET；8827 SSET；8828 SSET | `8826-snbk-lever-handle`, `8826-snet-lever-handle`, `8827-sset-lever-handle`, `8828-sset-lever-handle` | 8827/8828："Standard USA mounting size" |
| 8829 BL | `8829-bl-lever-handle` | 磁性插芯锁执手；执手 160mm；锁体 86×48mm；滑钮锁门；盖板下藏应急钥匙孔 |
| LH851 | `lh851-lever-handle` | 没有 specs |
| LH852 BNBK / BNET / BNPS / GMBK / SSET | `lh852-bnbk-lever-handle`, `lh852-bnet-lever-handle`, `lh852-bnps-lever-handle`, `lh852-gmbk-lever-handle`, `lh852-sset-lever-handle` | 方底座，穿门固定；GM 款没有实拍 |
| LH853 BK / BNBK / CPBK / CPPS / PS / SNBK / SNET / SNPS | `lh853-bk-lever-handle`, `lh853-bnbk-lever-handle`, `lh853-cpbk-lever-handle`, `lh853-cpps-lever-handle`, `lh853-ps-lever-handle`, `lh853-snbk-lever-handle`, `lh853-snet-lever-handle`, `lh853-snps-lever-handle` | 多数写固定 60mm 背距 |
| LH854；LH854 SNET；LH855 / BNBK / SNBK / SNET | `lh854-lever-handle`, `lh854-snet-lever-handle`, `lh855-lever-handle`, `lh855-bnbk-lever-handle`, `lh855-snbk-lever-handle`, `lh855-snet-lever-handle` | 筒式执手 |
| S802 SNET | `s802-snet-lever-handle` | 入户 |
| Black Tubular Lever Lock Set | `black-tubular-lever-lock-set` | 方形执手，哑黑，木门 |
| Stainless Steel Lever Handle Lock | `stainless-steel-lever-handle-lock` | 缎面不锈钢；specs 是筒式锁通用写法 |
| EH01 / EH02 / EH03 | `eh01-lever-handle`, `eh02-lever-handle`, `eh03-lever-handle` | 欧式长面板（铁面板 + 铝执手），配欧式锁芯插芯锁，哑黑 |
| 9001、9002E、9003E、9004、9004S、9005E、9005S、9006S | `9001-stainless-steel-handle`, `9002e-…`, `9003e-…`, `9004-…`, `9004s-…`, `9005e-…`, `9005s-…`, `9006s-…`（后缀统一 `-stainless-steel-handle`） | 不锈钢圆底座执手，35–50mm，配黄铜锁芯；9004S 为 53mm 方底座 |
| 9007、9007E、9007S、9008E、9008S、9010E、9011E、9012E | `9007-…`, `9007e-…`, `9007s-…`, `9008e-…`, `9008s-…`, `9010e-…`, `9011e-…`, `9012e-…`（同上后缀） | 同上；9007S：执手 132mm，底座 Ø53 |
| 9014、9014S、9014 SSBK、9014 SSET、9015、9016S、9020S、9021 | `9014-…`, `9014s-…`, `9014-ssbk-…`, `9014-sset-…`, `9015-…`, `9016s-…`, `9020s-…`, `9021-…`（同上后缀） | L 形圆管执手；SSBK 一侧是固定圆拉手 |
| 069、9087 SS | `069-stainless-steel-handle`, `9087-ss-stainless-steel-handle` | 没有 specs |
| LH1016、LH1033 SS、LH1056 SS、LH1083、LH1083 SS、LH1085 SS | `lh1016-…`, `lh1033-ss-…`, `lh1056-ss-…`, `lh1083-…`, `lh1083-ss-…`, `lh1085-ss-…`（同上后缀） | 不锈钢圆底座；LH1016 有 SSS/PSS 两种表面 |
| NC013、NC046、NC053、NC068、NC181、NC182、NCB、NCD | `nc013-…` … `ncd-…`（同上后缀） | NC182：执手 86mm、截面 38mm，短执手 |
| 9082E | `9082e-stainless-steel-handle` | 推杠逃生装置的室外执手面板，168×45mm |
| 9088 SS | `9088-ss-stainless-steel-handle` | 304 长面板 + 插芯锁体 + 欧式锁芯整套 |
| HD02 / HD03 | `hd02-stainless-steel-handle`, `hd03-stainless-steel-handle` | 长度写"64/56/128/192/284"，没有单位 |
| 600 | `600-concealed-sliding-door-handle` | 推拉门、口袋门嵌入式拉手，4 种表面 |
| 70610 AB / SC；70710 PB / SN；70720 PB / SM；70722 DC；70750 PB；70780 AB | `70610-ab-grip-handle-set` 等（`<型号>-<表面>-grip-handle-set`） | 锌合金拇指压把 + 单头锁舌套装 |
| 70900 BK / ET / MBBK / MBET | `70900-bk-grip-handle-set`, `70900-et-…`, `70900-mbbk-…`, `70900-mbet-…` | 铝合金压把套装；有浴室和入户两种 |
| DH02 AB / PB | `dh02-ab-grip-handle-set`, `dh02-pb-grip-handle-set` | 实为长面板"拉手 + 执手"，欧式锁芯孔 |
| Keyed Deadbolt Lock Set | `keyed-deadbolt-lock-set` | 单头锁舌，5 珠弹子锁芯 |
| 100 / 102 / 104 / 106 / 107 | `100-glass-door-handle` 等 | 304 背靠背玻璃拉手：Ø32 管，长 600mm，10–12mm 玻璃；104、106 管径渐细；107 中段为亚克力 |
| 100-30MM、102-30MM、105、105-600、108、109、112、410、G130 | `100-30mm-glass-door-handle` 等 | 多数没有 specs；105-600 为 25×25×600mm 方管 |
| 19-130MM | `19-130mm-glass-door-handle` | 面板 200×65×1.2mm，拉手截面 19mm，中心距 148mm，出墙 60mm |
| Stainless Steel Glass Door Pull Handle | `stainless-steel-glass-door-pull-handle` | 背靠背管状拉手，没有 specs |

### 8.1 JSON 中看起来不一致的规格（只标记，不改）

1. **"Cross bore: 51mm"**：所有拇指压把套装和 600 都这么写，并称"replaces most existing locksets"。美式标准横孔是 2-1/8″ ≈ 54mm（多家厂家说明一致）。「待核实」是写错，还是确实另有规格。
2. **600 嵌入式拉手**：specs 照抄了压把套装的锁舌、背距、横孔、"Handing"、"free-turning cylinder ring"。嵌入式拉手没有锁舌，也没有锁芯（照片只有拉手和 2 颗螺丝）。
3. **70900 系列**："Material: Aluminum"，但"Trim: Forged solid brass or zinc die-casting"，两处矛盾。浴室款（BK/MBBK）同样写了"Deadbolt throw 25mm"和"free-turning cylinder ring"，浴室功能是否带钥匙锁舌「待核实」。
4. **EH01–03**："Lock Type Compatibility: Euro Profile Mortise Lock"、"Backplate Mounted"，但同时写了筒式锁通用的"Backset 60/70 adjustable"、"Chassis: Solid steel"、"Trim: Zinc die-casting or solid brass"，而执手实为铝合金、面板为铁。面板的锁芯中心距没有给出。
5. **通道 / 浴室款写"Keying: Can be keyed alike with deadbolts"**：例如 808 SNPS、LH853 PS / CPPS、LH852 BNPS，以及各 BK 款。通道和浴室款没有锁芯，这一行不适用。
6. **"Application" 与功能互相矛盾**：
   - LH853 SNBK / CPBK（浴室）、CPPS / SNPS（通道）都写"For entrance doors"。
   - LH852 BNET（入户）写"For Privacy doors"。
7. **LH853 SNET 的 summary 写成了操作说明**："Turn thumb-turn counterclockwise or key clockwise to lock"。旋转方向取决于门的左右手，不能一概而论。
8. **LH1016 "Spindle: 9mm"**：同系列其他款都是 8mm。「待核实」。
9. **9014 SSBK**：JSON 写浴室功能（内侧旋钮），实拍配件却是欧式锁芯盖、一侧固定圆拉手（`-2`）。功能描述「待核实」。
10. **玻璃拉手 100**：
    - 尺寸图（`100-glass-door-handle-3.webp`）的"148mm"是整对拉手穿过玻璃后的总厚度，不是中心距。
    - "30mm"标在两支脚之间，但按图上比例约 350mm（图审已提出）。
    - "26mm"在图上标的是支脚粗细，JSON 却写成"Standoff 26mm"。
    - 按 148 − 2×32 − 玻璃 10–12 推算，单侧离玻璃约 36–37mm（推算值，待核实）。
    - "Glass gap 7.5mm"小于适用玻璃厚度 10–12mm，含义「待核实」。
    - 102/104/106/107 的写法相同（fixing center 30/34mm、glass gap 7–8mm），同样待核实。
11. **104**："Center distance: 149mm at the head, 133mm at the foot, tapered"。若 148/149 是总厚度，那么"133 at the foot"说明拉手下端向玻璃收拢，描述「待核实」。
12. **HD02 / HD03**："Length: 64/56/128/192/284"没有单位，顺序也乱（56 在 64 后面），看起来像柜门拉手孔距。是否属于门用拉手「待核实」。
13. **Keyed Deadbolt Lock Set**：放在 grip-handle-sets 分类下；唯一一张图的 label 写的是"Matt black keyed knob lock"，而表面选项为 Satin Stainless / Polished Brass，图与品类、表面都对不上。
14. **19-130MM**：放在玻璃门拉手分类，但照片是装在面板上的拉手（门面用），而且"Slot width 20mm"的含义不明。另外，出墙 60mm − 截面 19mm ≈ 41mm 手部净空，若按 BS 8300 二手引述的 45mm 要求偏小（仅提示）。
15. **8827 / 8828 的 finish 字段**："Gold (customizable" 缺右括号（文字小问题）。

---

## 9. 相关标准（只作知识，不代表我们的产品符合或通过）

| 标准 | 管什么 |
|---|---|
| EN 1906 | 执手和球把。8 位分级码依次为：使用等级 1–4、耐久 6 级（10 万次）/ 7 级（20 万次）、门重、防火（0/A/B/C/D 及带 1 的 20 万次版本）、安全、耐蚀 0–5、防盗、型式 A/B/U（弹簧形式）。另测试方轴和紧固件、操作扭矩、自由间隙、静载强度 |
| EN 12209 | 机械锁和插芯锁体（与长面板执手配套的锁体），此处不展开，待核实 |
| EN 12150 | 钢化安全玻璃；孔边到玻璃边至少 2 倍玻璃厚度（经 Springer 文章二手引述） |
| EN 1634 | 门的防火试验；英国浴室旋钮产品会写"BS EN 1634 fire tested"。我们不写 |
| ANSI/BHMA A156.2 | 筒式和圆柱锁（含执手）。Allegion 资料中的循环次数：1 级 100 万次、2 级 40 万次、3 级 20 万次；具体以现行版本为准 |
| ANSI/BHMA A156.39 | 住宅锁和斜舌，分 A/B/C 级；2015 版要求至少 40 万次循环（据 BHMA 资料） |
| ANSI/BHMA A156.6 | 门饰件：推板、拉手、推拉杠、护门板；包括强度、尺寸、材料，2021 版增加了环境性能 |
| ANSI/BHMA A156.18 | 材料和表面处理（表面涂层的测试） |
| ADA 2010 Standards 309.4 / 404.2.7 | 无障碍：可操作件高度 34–48″，单手操作，不需要扭腕 |
| BS 8300-2 / Approved Document M（英国） | 无障碍建筑设计：执手和拉手的高度、管径、离门净空（本章数值来自二手汇总，待核实原文） |
| UL 10C | 美国防火门组件正压燃烧试验（行业常识，待核实），用于判断执手能否用在防火门上 |
| GB 21556 | 锁具安全通用技术条件（编号见检索摘要，条款待核实） |
| GB 15763.2 | 建筑用钢化玻璃（行业常识，待核实） |
| 中国执手专用行业标准（QB/T） | 本次未检索到，待核实 |

再次说明：我们的网站不得声称任何产品通过上述任何标准或认证。JSON 中的"Cycle life: 200,000 cycles"只能原样作为参数使用，不能对应成 EN 1906 的等级。

---

## 10. 来源

已打开并阅读：
- Häfele / HTH Architectural Hardware 执手目录（EN 1906 分级码、8×8mm 方轴）：https://htdocs.kirz.com/HTHMKT/Catalogue/AH/01-door-handles.pdf
- Joseph Giles 产品页（弹簧底座、轴承底座、普通底座；8mm 方轴；门厚到 54mm；穿门螺栓）：https://josephgiles.com/product/lv1158-darlington-lever-handle
- Ashley Norton 筒式拇指压把套装安装说明（2-1/8″ 孔、5-1/2″ 中心距、背距、旋钮方向、勿过紧）：https://www.ashleynorton.com/resources/pdf/tubular-gripset-50-function.pdf
- US Access Board ADA 2010 Standards（309.4、404.2.7）：https://www.access-board.gov/ada/
- Made in Britain，建筑师问答（拉手高度、管径、45–50mm 净空、300mm 中心距）：https://www.madeinbritain.org/news/architects-questions-answered-aug-25
- Griffwerk 执手表面处理（不锈钢、PVD、电镀、喷涂）：https://www.griffwerk.de/en/blog/surface-quality-of-door-handles/
- Kwikset 可换向执手：https://kwikset.com/support/answers/how-can-the-reversible-lever-work-on-both-a-left-hand-and-a-right-hand-configured-door

只用了检索摘要（未逐页打开）：
- 美式开孔模板（36″/38″ 高、2-1/8″ 和 1″ 孔、60/70 背距）：https://www.nanz.com/wp-content/uploads/2023/10/In-Stock-Door-Hardware-Installation-Guide.pdf ；https://rejuvenation.com/netstorage/images/pdfs/instructions/AN-AI-Ext-LxL-KxK.pdf
- Status 执手安装（方轴两侧画线居中）：https://checkout.mkm.com/content/products/pdf/49292/status-texas-lever-on-round-rose-pc-b097214_Installation_1.pdf
- Allegion 有方向执手的订法：https://kc.allegion.com/kb/article/how-to-specify-the-handing-of-a-handed-lever
- Allegion BHMA 分级与测试：https://dev-cs-schlage-commercial.allegion.com/content/dam/allegion-us-2/web-files/allegion/information-documents/Understanding_BHMA_Grading_and_Testing_009968.pdf
- BHMA A156.39：https://buildershardware.com/Home-Sweet-Secure-Home/ansibhma-a15639-residential-locksets-and-latches
- ANSI A156.6 预览：https://webstore.ansi.org/preview-pages/BHMA/preview_ANSI+BHMA+A156.6-2015.pdf
- 功能代号：https://www.securityparts.com/commercial-lock-function-codes-guide
- 背距：https://www.directdoorhardware.com/all-about-backsets.htm
- 背靠背 / 穿门拉手固定：https://www.fromtheanvil.co.uk/media/fta/guide_pdf/T_Bar_Range_-_Back-to-back_Fixing_Guide_-_2021.pdf ；https://www.fromtheanvil.co.uk/media/fta/guide_pdf/T_Bar_Range_-_Bolt-through_Fixing_Guide_-_2021.pdf
- 欧式面板中心距 72/92mm：https://www.g-u.com/en/AT/products/door-technology/door-hardware/door-hardware-articles/belcanto-series-product-features_2498.html ；https://www.lockshop-warehouse.co.uk/acatalog/hoppe-atlanta-lever-on-narrow-backplate-92mm-centres.html
- 方轴 7/8/9mm：https://www.alltrade.co.uk/shop/2n-fortis-handle-spindle-7mm-30-38mm
- 浴室旋钮 + 应急开启、5mm 方轴：https://screwfix.com/p/eclipse-standard-wc-thumbturn-set-polished-stainless-steel-52mm/225kw ；https://phg-uk.com/eclipse-precision-thumbturn-release.html
- 钢化玻璃开孔规则：https://wagnercompanies.com/holes-notches-tempered-glass/ ；https://www.tecnoglass.com/?p=1158 ；https://orbit.dtu.dk/en/publications/drilling-in-tempered-glass-modelling-and-experiments/ ；https://link.springer.com/10.1007/s40940-023-00245-w
- 玻璃拉手开孔示例：https://www.bohle.com/en-za/Handle-for-All-Glass-Doors-OE-25-mm/SA5113701
- 304 / 201 / 316 与茶色锈斑：https://www.doorsuperstore.co.uk/help-and-advice/product-guides/door-furniture/why-choose-grade-304-stainless-steel-door-handles/ ；https://www.everich.com/stainless-steel-304-vs-201-what-is-the-difference-between-the-two/
- EN 1906 概要（DIN）：https://din.de/en/wdc-proj:din21:379891044

我们自己的数据：`content/products/*.json`（140 条，HYDE 过滤）、`docs/research/image-audit/verdicts.json`，以及第 6 节列出的 `public/images/products/` 照片。
