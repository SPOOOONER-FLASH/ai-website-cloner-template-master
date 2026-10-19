# 06 五金配件、卫浴挂件与无障碍扶手

> 覆盖 categoryPath：`hardware-accessories/*`（插销与天地插、猫眼、门吸/门挡、防盗扣、厕位指示锁、电源过线器、锁舌护板、门牌号、门顺序器、小型锁舌）、`sliding-hook-locks`、`bathroom-accessories`、`care-grab-bars/*`。
> 我方型号 124 个（`sites` 缺省或含 hyde）。本文只讲行业通用知识；凡说"我们的"，只引自 `content/products/*.json` 和 `public/images/products/` 照片。
> 数字均来自第 10 节来源或我方 JSON；拿不准的标「待核实」。本文不代表任何产品已通过认证。

---

## 1. 是什么、怎么工作

### 1.1 天地插 / 暗插销（flush bolt）
- **用途**：双开门（pair of doors）里不常开的那扇叫被动扇（inactive leaf），平时用上下两支插销固定在门框上槛（head）和地面；常开的主动扇（active leaf）的锁舌再锁进被动扇。
- **动作链（手动杠杆式 manual lever-action）**：拨动嵌在门边内的拨杆/拨钮 → 杠杆或滑块推动插杆 → 插杆伸出门顶（或门底）→ 插进框上的锁扣（strike）或地面的防尘地扣（dust-proof strike）。反向拨回即收回。
- **变体**：
  - 短插销直接出销（我们的 FB001、FB013、FB017，插杆直接从端头伸出）；
  - 带加长连杆（extension rod），用于高门：拨杆在人手高度，连杆把动作传到门顶（我们的 FB016、"Stainless Steel Flush Bolt" 照片里有长连杆款）；
  - 自动（automatic）和自锁（self-latching）天地插：主动扇关闭时压下触发器自动出销，开主动扇时自动收回。这两类必须配门顺序器，见 1.9。我们站上没有自动款。
- 行程参考：Hager 的安装说明写插销最大行程（throw）3/4 英寸（约 19 mm）。我方 FB001 的图纸 `fb001-door-flush-bolt-5` 标"205"和"205–230"，由此推算行程约 25 mm，单位按 mm 理解（待核实）。

### 1.2 明插销 / 地插 / 弹簧碰锁（barrel bolt, flat slide bolt, spring latch）
- 明装插销（barrel bolt / tower bolt）：底板装在门面上，插销在导套里滑动，伸进装在框上的扣座（keeper）。插销柄转进底板缺口后才不会自己滑回。
- 平板插销（flat slide bolt）：原理相同，截面是扁的（我们的 BH16，4 孔底板加 2 孔扣座）。
- 弹簧碰锁（spring latch）：斜舌靠弹簧伸出，门一关就自动锁进扣板；要开门时拨动拨片把舌收回（我们的 BH17）。

### 1.3 筒式锁舌 / 圆柱锁舌（tubular latch / cylindrical latch）
- 动作链：把手或旋钮转动 → 方轴（spindle）转动 → 锁舌机构里的凸轮或拨叉 → 斜舌（latch bolt）收回。松手后弹簧把舌推回。
- 关键尺寸是中心距（backset），即门边到把手中心的距离。北美常见 2-3/8 in（60 mm）和 2-3/4 in（70 mm），很多锁舌两档可调。我们的 L 系列 JSON 标 60/70、90 mm。
- 有两种结构：带方孔、配穿过的方轴（我们的 L002、L009 等），或圆柱锁专用、有尾片槽的锁舌（我们的 L004、L026）。两种不能互换。

### 1.4 猫眼（door viewer / peephole）
- 结构是两段螺纹配合：门外一段是物镜筒，带广角镜片和外圈；门内一段是目镜筒，带内螺纹，多数有遮光盖（cover）。两段从门两面旋进同一个孔里拧紧，靠旋入深度适应门厚。
- 光学上，外侧的广角负透镜加内侧目镜组成倒置的伽利略式结构：从内往外看是缩小的广角像，从外往里看几乎什么都看不清。BHMA A156.16 把它定义为"让室内观察者不被察觉地看到室外"的光学装置。
- 视角（viewing angle）是卖点：我方 JSON 有 160°、180°、200° 三档，详见第 8 节。
- 门厚适配靠伸缩段：我方 DV05/DV10 分 35–55 mm 和 60–100 mm 两种长度，DV06 的 160° 款标 30–50 mm。

### 1.5 门吸 / 门挡（door stop / holder）
- 门挡（stop）在设定位置挡住门扇摆动，保护墙面和把手。门吸或定门器（holder）还能把门保持在开启位置，直到人为放开。BHMA A156.16 对两者分别有定义。
- **按安装位置分**：
  - **墙装（wall stop）**：装在墙面或踢脚线上，橡胶头对着门面或把手；
  - **地装（floor stop）**：装在门扇摆动路径的地面上，挡门扇下部；
  - **门装下压式定门器（kick-down holder）**：装在门扇下部，脚踩放下胶脚顶住地面，我们的 DS013 就是这种。
- 我方照片：DS01、DS022、DS02 是墙装或踢脚线装的凸出式（DS01 图纸：总长 96、底座 Ø34 带 3 孔、胶头 Ø24）；DS05、DS010 是半球形地装门挡（DS05 规格 Ø44×24 mm）；DS09 是带 2 孔底座、胶头水平朝外的地装式。

### 1.6 防盗扣 / 门链 / 安全门扣（door guard: swing bar, chain）
- **U 形摆杆式（swing bar / hotel guard）**：一块板上铰接一根 U 形杆，另一块板上是一个球头。从室内把 U 形杆翻过来套住球头后，门只能开一条缝。U 形杆滑到球头根部的开口处才能脱开，而门关上时才能对准这个位置，所以从门外伸手够不着。我们的 F001、F002 属于这类。
- **门链（chain guard）**：链条一端固定，另一端的滑头插进带滑槽的槽座，链条拉直后门停住。我们的 F004 是这类；F005 是链条加插销的组合。
- 维基百科和 Engineer Fix 对 U 形杆装在门上还是框上的描述相反。实际以产品说明书为准，两块板都必须装在**室内侧**。
- F006 照片是一个带盒体的限开器，框侧有扣座。它的结构细节待核实。

### 1.7 厕位指示锁（indicator bolt / vacant-engaged indicator）
- 动作链：室内旋钮（thumbturn）转动 → 方轴 → 推动锁体里的插销伸进框侧扣座 → 同一根轴带动室外的指示片，显示"有人"（红，engaged/occupied）或"无人"（绿或白，vacant）。
- 室外侧通常有应急开启槽（emergency release），用硬币或一字工具从外面转开。用途是救援，不是防盗。
- 我们的 200：方形面板，图纸 `200-indicator-4` 标面板 58×42、锁体 62×40、方轴约 46 长；套件含插销体、扣座、方轴、8 颗螺丝。500：圆形旋钮带绿色指示窗，旋钮是一字形，可兼作应急开启。

### 1.8 推拉门钩锁（sliding door hook lock）
- 推拉门和移门不能用斜舌，因为门是沿墙平移的，斜舌没有可以压回的方向。这类门改用钩舌（hook bolt）：转动旋钮或钥匙 → 钩舌从锁面板翻出并向上（或向下）钩住框上的扣板 → 门既不能拉开，也不能抬起脱钩。
- 拉手做成和门面齐平的嵌入式拉手（flush pull），因为门要缩进门洞（pocket）或贴墙滑动，凸出的把手会卡住。
- 我方照片：
  - 881 SS 套件：黑色锁体、面板、扣板、两只嵌入拉手（一只带锁芯，一只带旋钮）、钥匙、螺丝；
  - S02 CP 图纸：锁体高 80 mm，标注 35 mm（推测是中心距，待核实），拉手 160×44.7 mm；
  - S03 图纸：圆形拉手座 Φ48/Φ57.5。

### 1.9 门顺序器（door coordinator）
- 有盖缝条（astragal）或错口门的双开门，必须让被动扇先关。否则主动扇先合上后，被动扇会被盖缝条挡住关不严。
- 动作链：主动扇开着时，顺序器的挡臂伸出挡住主动扇 → 被动扇关到位时压下触发件 → 挡臂释放 → 主动扇才能关。
- EN 1158 专门规范这类装置，也包括装在闭门器里的顺序机构。
- 我方型号：
  - DC01（摆臂加滚轮）、DSL02（304 不锈钢、尼龙滚轮，图纸臂长 250/277）装在门框上，触发臂顶着被动扇；
  - DC02 是杆式，规格写"Inactive Leaf First, Active Leaf After"，安装在门框顶部。

### 1.10 电源过线器（electric power transfer, EPT）
- 把电线从固定的门框引到转动的门扇，供电控锁或电控插锁用。线束穿在柔性钢套管里，两端的盒子分别嵌进门边和门框。关门时完全看不见，开门时套管在门缝里露出一段。
- 我们的 EPT01 JSON 写明：316 不锈钢，线束最大 Ø5/16"（8 mm），适用对接合页、长合页和偏心量小于 3/4"（19 mm）的偏心转轴，暗装，不分左右。

### 1.11 锁舌护板（latch guard / latch protector）
- 外开门（outswing）的锁舌在门外侧的门缝里看得见，可以被撬。护板装在门外侧锁边，盖住门缝。
- 我们的 HY-0SS 图纸 `hy-0ss-latch-guard-3`：板 274×75、凹槽 180、4 根螺柱、配内六角螺钉和扳手。即螺柱从外侧穿门、室内侧上螺钉，室外看不到螺钉头。JSON 写"为澳洲市场设计"。

### 1.12 卫浴挂件、无障碍扶手、淋浴折叠座
- 挂件（毛巾杆、浴巾架、纸巾架、挂钩、皂碟、置物篮）只承受物品重量。BH 系列照片显示多为隐藏式安装：底座固定在墙上，主体套上后用侧面的紧定螺丝（grub screw）锁住。
- 安全扶手（grab bar）要承受人体重量。ADA 609.8 要求在任意点施加 250 lbf（1112 N）时不超过许用应力。扶手不得在法兰里转动（609.6）。
- 翻折扶手（flip-up / hinged support rail）装在坐便器开放一侧，转移时向上翻起贴墙。
- 淋浴折叠座（fold-down shower seat）的座板靠铰链放下，由墙上的支架承重。

---

## 2. 装在哪里、怎么装

### 2.1 天地插
- **门型**：木门、钢门、铝门的双开门被动扇。我们的 "Stainless Steel Flush Bolt" JSON 写 Double Timber Door / Double Metal Door。单开门不需要天地插。
- **位置**：装在被动扇的**对口边（meeting stile）**，即与主动扇相碰的那条门边，不是合页边；上下各一支。拨杆面朝向主动扇的门边，所以主动扇关着时人手够不到。
- **开孔**：
  - 在门边开矩形槽，深度按样板；铣出拨杆凹槽和插杆通道，端头再开出销孔；
  - Hager 的做法是：先按样板开槽 → 每个插销体用 2 颗 #8 螺钉固定 → 调连杆长度，使插销收回时端头与门顶（或门底）齐平 → 装端头导向件 → 装锁扣 → 最后挂门；
  - 底部插销调长度要卸门，所以挂门前就要调好。
- **配套**：上框锁扣，地面防尘地扣（弹簧顶针，平时与地面齐平防灰），主动扇上的盖缝条。防火双开门还要配顺序器，见 2.9。
- **防火门**：doorwaysplus 的文章说，防火双开门上的天地插要列入认证清单，插入锁扣不少于 1/2 in；手动插销是否允许由当地主管部门（AHJ）决定。这是行业文章的转述，执行前查 NFPA 80 原文（待核实）。
- **常见错误**：
  - 装在合页边；
  - 主动扇和被动扇做反；
  - 底销忘配防尘地扣，地孔被灰尘堵死，插销伸不到位；
  - 上锁扣偏 1/8 in（约 3 mm）就可能导致插入不足；
  - 高门用了短连杆，够不到上锁扣。

### 2.2 明插销、平板插销、弹簧碰锁
- 底板装在门扇室内侧，扣座装在门框（或另一扇门）上；插销伸出方向朝向扣座。
- 不需要开槽，但螺钉必须吃进实木或门框，不能只吃进装饰线条。
- EN 12051 覆盖明插销、塔插、地插、天地插等"只从受保护一侧操作"的单点插销。

### 2.3 锁舌
- 北美通用开孔：面孔 2-1/8 in（54 mm）、边孔 1 in（25 mm）。中心距钻孔前必须确定，钻完不能改。
- 门厚范围随品牌不同：Yale 一款写 35–45 mm，Baldwin 一款写 1-3/8 至 2 in。
- 斜舌的斜面必须朝关门方向。装反后门要靠手推锁舌才能关上。

### 2.4 猫眼
- **位置**：门扇宽度居中，成人眼高。Hager 说明书推荐标准安装高 60 in（152 cm），无障碍安装高 43 in（109 cm）。有资料建议装两个：约 1550 mm 和约 1150 mm（来源为零售指南，作参考）。
- **开孔**：孔径必须匹配筒径。Yale MC96 用 14 mm 钻头，适用门厚 35–50 mm。从一面钻到钻尖刚露头，再从另一面钻穿，防止木门崩边。
  - 我方筒径：DV05/DV09/DV10/DV11 有 12/14/16 mm 三档；DV08 SN、DV12-S 为 28 mm。28 mm 猫眼要开大孔，孔径待核实。
- **方向**：物镜（镜片端）从门外插入，目镜筒从门内旋入，用一字螺丝刀插在室内侧的槽里拧紧，同时扶住外侧不让它转。
- **门厚**：门比猫眼可调范围厚，两段拧不到一起；比范围薄，两段顶死，压不紧门面。下单前必须先确认门厚。
- **防火门**：英国零售的防火门猫眼标 FD30/FD60，并随附膨胀密封套。普通猫眼装进防火门会破坏门的耐火完整性。我方 JSON 没有任何防火猫眼。
- **钢门和复合门**：门芯有发泡填充，钻孔后孔壁处理和密封要注意（零售指南，作参考）。

### 2.5 门挡
- **墙装**：后面必须有实心墙或踢脚线。挡点要先于把手碰到墙。
- **地装**：适合墙面不能打孔、门很重或墙面离门太远的情况。要放在门扇摆动路径上靠把手的一侧，避开主通道。
- **不要靠近合页**：门挡离合页越近，门扇的杠杆作用越大，门挡和合页受力越大，越容易坏。常听到的"装在门宽 2/3 处"只是经验说法，没有标准出处。
- **绊脚风险**：地装门挡会绊脚，医疗和养老场所尤其要注意（来自 NHS Wales 的设施警示）。
- **定门器**：DS013 这类下压式装在门扇推面下部，放下后胶脚着地。

### 2.6 防盗扣
- 两块板都装在门的**室内侧**，位于锁边、人手高度。螺钉要吃进门框结构，不能只吃进门套线条。
- 门框装饰线条凸出太多时，摆杆式可能装不平。
- 链式：滑槽装门扇，链端装门框。我方审图结论（F004）也是这个方向。

### 2.7 指示锁
- 用于卫生间隔断门、公共厕所门。我们的 200 JSON 写 Toilet Cubicle Door / Restroom Door，表面安装。
- 旋钮在室内，指示窗和应急开启口在室外，都装在门的**开启边**（锁边）。扣座装在框上，或装在隔断立板上。
- 隔断门很薄（板厚因产品而异，待核实）。方轴长度必须匹配门厚，买前先确认。
- 无障碍厕所常用大杠杆式室内旋钮，外侧带应急开启（来自英国零售商的产品说明）。BS 8300 对这类锁的具体要求本次未核对（待核实）。

### 2.8 推拉门钩锁
- 装在推拉门或移门的**前沿门边**（关门时碰到门框的那条边），钩舌朝向立框上的扣板。
- 开槽要按样板分别开出锁体槽和拉手槽，从两面钻穿以防崩边。Triser 的样板按中心距给出不同的边距（33 mm 和 55 mm 两种锁体）。
- 带锁芯的拉手朝外，旋钮那面朝内。
- **常见错误**：扣板没对准导致钩舌钩不住；锁体厚度超过门厚；嵌入拉手开槽过深打穿门板。

### 2.9 门顺序器、过线器、护板
- **顺序器**：装在门框上槛的门挡面或门框内侧，横跨两扇门。被动扇装天地插并带闭门器，或者双开门有盖缝条时，必须装顺序器。
- **过线器**：装在合页边，门边和门框上各开一个槽。有资料称常见位置在上合页下方约 6 in（引自转载的 Steelcraft 资料，待核实）。
- **锁舌护板**：只用于外开门，装在**门外侧**锁边。Select Hinges 的说明书要求护板保持完整一片，平贴在门框和门面上，并用随附紧固件；有一款提出门框和门扇上合计至少 8 个孔。

### 2.10 安全扶手（重点）
- **墙体**：只能固定在实心墙、预埋背板（blocking/backing）或厂家指定的暗装锚件上。
  - Bobrick 的说明：锚件和螺钉要另行订购；每个法兰至少 2 颗对角布置的螺钉；没有背板时，墙面须为至少 5/8 in（16 mm）厚的石膏板（刷漆或贴砖）；
  - Bobrick 原话大意是：扶手只有它的锚固和墙体那么牢；
  - **玻璃隔断、淋浴屏、门扇、空心轻质隔墙都不能装扶手。**
- **ADA 2010 的数字（只作知识）**：
  - 圆管外径 1¼–2 in（32–51 mm）；
  - 管与墙的净距 1½ in（38 mm）；
  - 顶面高度距完成地面 33–36 in（840–915 mm）；
  - 坐便器侧墙扶手长至少 42 in（1065 mm），距后墙不超过 12 in（305 mm），向前伸到距后墙至少 54 in（1370 mm）；
  - 后墙扶手长至少 36 in（915 mm），从坐便器中心线一侧至少伸出 12 in，另一侧至少 24 in；
  - 淋浴间：有座椅时，座椅正上方不装扶手（608.3.2）。
- **WHO APS15 草案（通用指导）**：
  - 离墙约 50 mm，留出手指空间；
  - 有效握持长度不少于 230 mm；
  - 常见长度 300/450/600/900 mm；
  - 三个方向各加 110 kg 后扶手仍须固定不动；
  - 湿区用不锈钢或铝；
  - 颜色要与墙面对比。
- **英国 Doc M 和中国 GB 55019**：具体高度和直径本次未核对原文（待核实）。英国零售的 "Doc M pack" 常含一根约 760 mm 的翻折扶手。
- **常见错误**：
  - 装在玻璃上（我们 BH01、BH02 的 AI 场景图就犯过）；
  - 只用普通塑料胀塞固定在空心墙上；
  - 装成竖直当门拉手用（BH01 场景图）；
  - 净距过小，夹手；
  - 法兰盖没扣上，露出螺钉。

### 2.11 淋浴折叠座
- **ADA 610.3**：座面高 17–19 in（430–485 mm），座椅终止在距淋浴间入口 3 in（75 mm）以内；标准和替代式无障碍淋浴间的座椅必须可折叠。
- **ADA 610.3.1 矩形座**：后缘距墙不超过 2½ in（64 mm），前缘距墙 15–16 in（380–405 mm）；承载要求同扶手，250 lbf。
- **Bobrick B-5181 的固定方式**：
  - 预制淋浴间由淋浴间厂家提供背板，用 #14×2-1/2 in 不锈钢螺钉固定；
  - 混凝土墙用纤维塞、膨胀套，或 1/4 in 翻转螺栓、膨胀螺栓；
  - 安装顺序：先把座板扶到水平 → 以导向支架作样板画孔 → 打孔装锚件 → 装底板 → 装导向支架。
- 我们的 BH55 没有尺寸规格。审图记录引用的尺寸图是 350×350。如果 350 是进深，就短于 ADA 要求的 380 mm（待核实）。

### 2.12 卫浴挂件固定
- **画线和打孔**：用水平尺画线；多点固定的毛巾杆，两组孔必须严格水平，打孔前核对孔距。
- **瓷砖**：先贴美纹纸防止钻头打滑，用瓷砖钻头，尽量把孔落在砖缝上。
- **石膏板**：尽量打在龙骨上；没有龙骨时用空腔锚件，并注意锚件适用的墙厚。
- **钻孔参数**：各厂不同，例如 7 mm 钻头打 30 mm 深，或 6 mm 钻头打 40 mm 深。以产品说明为准。
- **隐藏式安装**：先松开紧定螺丝取下底座 → 把底座固定上墙 → 套上主体，紧定螺丝**朝下**藏起来 → 用内六角扳手拧紧，不要过力。
- **挂钩不是扶手**：厂家说明会明确写"不得用作人体支撑"。
- **3M 背胶**：我们的 BH10、BH11 JSON 写"3M 背胶或螺丝"。胶粘只适合光滑、干燥、平整的面，而且只能挂轻物（承重待核实）。
- **转角篮和转角架**（BH29–BH31、BH52、BH53）必须装在墙的阴角上。

---

## 3. 场景和展示怎么做才对（判 AI 图的规则）

**通用**：一张图只能有一种表面处理。门上的锁和把手与配件的表面不一致就判不通过；我们的 DV05、DV06、DV07 场景图就因为两种表面同框被判了。所有尺度都要符合真实比例。

| 产品 | 正确的画面 | 物理上不可能，或必须判不通过 |
|---|---|---|
| 天地插 | 装在双开门被动扇的对口边，上下各一支；门关着时，插销只在门边上看得到 | 装在合页边（FB014 场景图）；装在单开门上（FB016 场景图）；装在门的正面；地面多出一块照片里没有的地扣板（FB001 场景图） |
| 天地插（关门状态） | 两扇门都关着时，正面**看不到**天地插；只有打开主动扇时才看得到被动扇门边上的拨杆 | 关着的双开门正面露出插销本体 |
| 明插销 | 底板装在门的室内侧，扣座装在框上；插销伸出时门必须是关着的 | 门开着而插销伸出（BH15 的场景图）；底板的长宽比和照片不一致 |
| 猫眼 | 门扇宽度居中、约眼高；门外看到小镜片和外圈，门内看到目镜筒和遮光盖；与门上五金同一种表面 | 画成发光点或蓝点；方形的 DV11 画成圆形；装在门框上或门边上 |
| 门挡 | 墙装胶头对着门面或把手；地装的放在门扇摆动路径上、靠把手一侧 | 装在合页边紧贴门轴的位置；地装的放在门洞正中的通道上 |
| 防盗扣 | 两块板都在室内侧锁边；扣上时门只开一条缝 | 装在门外侧；两板之间多出照片里没有的零件（F001 场景图）；盒体上出现照片里没有的按钮（F006） |
| 指示锁 | 指示窗在室外，旋钮在室内，都在门的开启边、中部高度；旋钮以轴为中心 | 旋钮偏离转轴（200 的 -5、-6 图）；指示窗朝向室内；装在合页边 |
| 推拉门钩锁 | 装在推拉门前沿门边，扣板在立框上；拉手嵌入、与门面齐平 | 面板上下颠倒（881 的 -5、-6：锁芯和旋钮画到了扣手槽下方）；CP 款配黑色拉手 |
| 顺序器 | 装在上框，横跨两扇门 | 装在门扇中部；装在单开门上 |
| 锁舌护板 | 外开门的门外侧锁边 | 内开门上装护板；门面上出现火焰之类的防火图标（HY-0SS -5 图） |
| 安全扶手 | 装在实心墙上，水平安装、顶面在腰高；坐便器旁、浴缸上方、淋浴墙上 | 装在玻璃隔断或淋浴门上（BH01、BH02）；竖装当门拉手；淋浴座正上方装扶手；滚花段画错（BH03 是整根光管，BH04 只有中段做防滑处理） |
| 翻折扶手 | 装在坐便器开放一侧的墙上，可向上翻 | 文案写"FIXED"却画成可翻折；标出没有规格依据的承重数字（BH56、BH58） |
| 淋浴折叠座 | 装在淋浴区墙面，放下后水平，座面约在膝高 | 装在玻璃上；座椅上方有扶手 |
| 挂钩、毛巾杆、置物篮 | 钩数、孔位、座形与照片一致；转角篮装在阴角 | 钩数与规格不一致（BH06 场景图画成 4 钩）；多出内框；瓶身上出现乱码文字 |

**正常状态下看不见的部分**：
- 天地插插杆（关门时在门边内或已插进框里）；
- 猫眼筒身（埋在门里）；
- 钩锁的钩舌（锁上时在门缝里）；
- 过线器（关门时完全藏起来）；
- 顺序器的触发件（藏在门顶上方）；
- 扶手和挂件的固定螺钉（被法兰盖或底座挡住）。

图上画出了这些部分，就等于画出了实际看不到的东西。只有剖切图和爆炸图可以例外，而且要标明是示意图。

---

## 4. 功能和使用

### 4.1 功能分类
- **插销类**：
  - 手动天地插：BHMA A156.16 管辖；
  - 自动或自锁天地插：A156.3 管辖，我们没有这类产品；
  - EN 体系下统一归 EN 12051。
- **指示锁**：本质上是卫生间的隐私功能（privacy），区别在于有外侧状态显示和应急开启。和锁具里的 privacy 功能对应，但通常不带斜舌。
- **推拉门钩锁**：
  - 带锁芯加旋钮（881 照片）：外侧用钥匙、内侧用旋钮，相当于入户功能；
  - 只有旋钮：隐私功能。外侧是否带应急开启，看具体照片（待核实）。
- **猫眼**：观察功能。ADA 模型规范只要求视角至少 180°（来自 idighardware）。
- **门挡和定门器**：分为只挡（stop）、挡并保持（holder）、两用（combination）。
- **防盗扣**：限位开门。它不是锁，不能替代锁。

### 4.2 日常使用和保养
- **天地插**：下销地孔要定期清理；有防尘地扣的，要确认顶针能弹回。
- **猫眼**：用软布清洁镜片；遮光盖要保持完好，否则夜间室内光会从外面看出来；螺纹松了就重新拧紧。
- **扶手**：定期检查是否松动。Bobrick 要求一旦发现松动或焊缝损伤，立即停用。
- **湿区固定螺钉**：可能锈蚀松动，需要定期检查（厂家说明）。
- **不锈钢挂件**：用中性清洁剂；氯化物会引起点蚀，温度越高越严重（Atlas 技术说明）。

### 4.3 典型故障
- **天地插**：插不进（锁扣错位或地孔被堵）；锌合金拨杆断裂；连杆脱扣。
- **猫眼**：雾化发黄（树脂镜片老化，待核实）；螺纹滑牙；镜片脱落。
- **门挡**：胶头老化脱落；底座螺钉被门撞松；地装门挡把地面拉裂。
- **防盗扣**：螺钉只吃进门套线条，一撞就拔出；锌合金摆杆受冲击断裂。
- **指示锁**：指示片错位，显示与实际状态相反；方轴太短，转不到位。
- **钩锁**：钩舌钩不到扣板；弹簧失效后钩舌下垂刮门框。
- **扶手**：法兰转动（违反 ADA 609.6 的原则）；焊缝开裂；锚固拔出。
- **201 不锈钢挂件**：潮湿环境下生锈。

---

## 5. 材料和工序（行业一般情况）

| 零件 | 常见材料 | 常见工序 | 说明 |
|---|---|---|---|
| 天地插本体、拨杆 | 锌合金、黄铜、不锈钢 | 锌合金压铸；黄铜型材或压铸；不锈钢冲压、折弯 | 我方 JSON 中 FB001/FB017 为锌合金，FB005 为黄铜，FB012–FB016 为不锈钢 |
| 插杆、连杆 | 钢或不锈钢圆棒 | 切断、车削、滚丝 | 连杆可调长度靠螺纹 |
| 猫眼筒、外圈 | 黄铜，部分用锌合金或 ABS | 黄铜车削（CNC 或自动车床）、滚丝、抛光、电镀；ABS 注塑 | 我方 DV05/DV06/DV09/DV11 为黄铜，DV12 为 ABS |
| 猫眼镜片 | 树脂（synthetic resin）或玻璃 | 注塑或研磨 | 我方 JSON：多数为树脂，DV08 SN 为玻璃 |
| 门挡 | 锌合金、不锈钢、黄铜；橡胶头 | 压铸、车削或冲压；橡胶硫化 | |
| 防盗扣 | 锌合金、铁、黄铜、304 不锈钢 | 压铸或冲压；链条冲压后焊接 | F002 JSON 写"有黄铜、304 不锈钢、锌合金、铁多种材料" |
| 指示锁 | 锌合金或不锈钢面板；钢插销 | 压铸、冲压、移印指示色 | |
| 钩锁锁体 | 钢板外壳，钩舌为钢或不锈钢 | 冲压、铆合、电泳或发黑；拉手冲压拉伸或压铸 | |
| 顺序器 | 镀锌铁、304 不锈钢；尼龙滚轮 | 冲压、焊接、镀锌 | |
| 扶手、挂件 | 304 不锈钢（湿区）、201（干区，便宜） | 管材折弯、法兰与管焊接（氩弧焊）、滚花、拉丝或抛光、钝化 | 我方 BH 系列 JSON 只写 Stainless Steel，没有写牌号（待核实） |
| 表面处理 | — | 电镀（铬、镍、铜、仿古）、PVD、喷粉、拉丝 | 我方 JSON 用代号 SS/SN/PB/AB/AC/CP/ORB/BN 等 |

**质检要点（行业通用）**：
- 插销行程，滑动是否顺滑无卡点；
- 猫眼螺纹配合，视场是否清晰无畸变，遮光盖是否顺滑；
- 门挡胶头的附着力；
- 扶手焊缝质量、法兰不转动，按目标市场要求做静载试验（如 ADA 的 250 lbf）；
- 镀层和涂层的耐腐蚀（盐雾）试验。EN 1670 是建筑五金的耐腐蚀分级标准；有猫眼产品引用过它；
- 不锈钢牌号要看材质证明（mill certificate）。

**便宜货为什么坏**：
- **201 代替 304**：201 用锰和氮替代部分镍，在潮湿、含氯的环境下更容易生锈（Atlas 技术说明和行业文章）；
- **锌合金拨杆或摆杆壁厚不足**：受冲击就断；
- **镀层薄**：浴室里很快起泡脱落；
- **扶手法兰太薄、焊点少，螺钉孔只有一个**：受侧向力时转动或拔出；
- **猫眼树脂镜片质量差**：发黄、视场模糊；
- **钩锁外壳钢板薄**：钩舌受力后外壳变形。

---

## 6. 拆解（典型零件，对应我方照片）

| 产品 | 典型零件 | 我方照片（type: photo / drawing） |
|---|---|---|
| 天地插 FB001 | 本体（带拨钮凹槽）、插杆、L 形端板（带孔）、拨钮、螺钉 | `fb001-door-flush-bolt`（两支，正面与侧面）、`-2`、`-3`；图纸 `-5`（205、端板 40×26、面宽 19、深 32） |
| 带连杆天地插 | 拨杆本体、上下连杆、端头导向件 | `fb016-door-flush-bolt`、`stainless-steel-flush-bolt` |
| 防尘地扣 | 套筒、弹簧顶针 | `dust-proof-02-door-viewer`（照片）；`dust-proof-01-door-viewer`（渲染图） |
| 猫眼 | 物镜筒（镜片加外圈）、带螺纹的目镜筒、遮光盖 | 图纸 `dv04-door-viewer-4`（34/62、筒 14、内侧 22、外圈 26）；`dv05-door-viewer-2`（64、筒 16、外圈 30）；`dv08-sn-door-viewer-2`（筒 28、60–95）；`dv12-s-door-viewer-2`（ABS，28 螺纹）；`dv07-door-viewer-5`（42/72、筒 28、外圈 38） |
| 摆杆式防盗扣 | U 形杆铰座板、球头板、螺钉 | `f001-security-door-guard`、`f002-security-door-guard` |
| 门链 | 链条、滑头、滑槽座、框侧座 | `f004-security-door-guard`；`f005-security-door-guard`（链加插销） |
| 指示锁 200 | 外侧指示面板、内侧旋钮面板、插销体、扣座、方轴、8 颗螺丝 | `200-indicator`（套件）；图纸 `200-indicator-4` |
| 指示锁 500 | 圆形旋钮（一字）、指示窗、方孔玫瑰座 | `500-indicator-3` |
| 钩锁 881 SS | 锁体、面板、扣板、带锁芯的嵌入拉手、带旋钮的嵌入拉手、钥匙、螺丝 | `881-ss-sliding-hook-lock`；图纸 `-3`；`s02-cp-sliding-hook-lock`；`s03-sliding-hook-lock-4` |
| 顺序器 | 臂、滚轮、底座、框侧支架、螺钉 | `dc01-door-coordinator`、`dc02-door-coordinator`；图纸 `dsl02-door-coordinator-3` |
| 过线器 | 柔性钢套管、门侧端盒、框侧端盒 | `ept01-door-power-transfer-devices` 至 `-4` |
| 锁舌护板 | 护板、4 根螺柱、内六角螺钉、扳手 | `hy-0ss-latch-guard`；图纸 `-3` |
| 锁舌 | 锁壳、斜舌、面板、方孔拨叉或尾片 | `l002-latch`、`l004-latch`、`l018-latch`、`l026-latch` |
| 明插销 | 底板、插销、扣座、螺钉 | `bh15-100mm-barrel-bolt-2`、`bh16-flat-slide-bolt-4`、`bh17-spring-latch` |
| 扶手 | 管体与焊接底盘、法兰装饰盖 ×2、塑料胀塞、螺钉 | `bh01-grab-bar-5`（套件照）；图纸 `bh02-knurled-grab-bar-4`（管 32、高 85、长 400、底盘 65）；`bh03-angled-grab-bar-5`（管 25、高 75、长 415、底盘 65） |
| 淋浴折叠座 BH55 | 座板、铰链支架；配件图有长螺杆、螺母、垫片、胀塞、橡胶条 | **全部为 CG 图，没有实拍**（`bh55-…-4` 是配件 CG 图），不能作为拆解证据 |
| 翻折扶手 BH56–BH58 | 扶手、铰链座、墙板 | **全部为 CG 图，没有实拍** |

---

## 7. 演示怎么拍

1. **天地插**：双开门全景，两扇都关着，正面看不到插销 → 打开主动扇 → 特写被动扇门边上的拨杆 → 拨动 → 切到门顶，插杆伸进上锁扣 → 切到地面，底销压下防尘地扣顶针。
2. **猫眼**：门外拍镜片和外圈 → 门内拍目镜和遮光盖 → 从猫眼里看出去的广角画面（实拍，不用特效）→ 剖切动画演示两段螺纹对拧、适应门厚。
3. **门挡**：同一扇门，墙装款先挡住门面，地装款再挡住门扇下部；镜头要拍到把手离墙还有余量。
4. **防盗扣**：室内侧扣上 U 形杆 → 开门，门停在一条缝 → 关门 → 杆滑到球头开口处脱开。
5. **指示锁**：室内转旋钮 → 切到室外，指示由绿变红 → 用硬币在外侧应急开启。
6. **钩锁**：推拉门关闭 → 转旋钮 → 钩舌翻出钩住扣板 → 用力拉门拉不开 → 抬门也脱不开。
7. **顺序器**：先关主动扇，被挡住 → 关被动扇 → 挡臂释放 → 主动扇关上。
8. **扶手**：
   - 展示墙内背板或锚件和法兰螺钉（剖切示意）→ 扣上法兰盖 → 用手压加载（只演示，不拍"承重 XX kg"字幕，除非有规格依据）；
   - 翻折扶手上翻贴墙、下放到位。
9. **挂件**：底座上墙 → 主体套上 → 紧定螺丝朝下拧紧 → 成品看不到螺钉。

**原则**：BH55–BH58 没有实拍。在拿到实物照片之前，不要拍"演示"冒充实物。

---

## 8. 我们站上的对应型号

| 型号 | slug | 说明 |
|---|---|---|
| FB001 | fb001-door-flush-bolt | 锌合金，带拨钮，L 形端板，用于被动扇；长度下单前确认 |
| FB001 AC | fb001-ac-door-flush-bolt | 8/10/12/24 in；**材料写不锈钢/黄铜，而 FB001 写锌合金**；应用写"木门、窗" |
| FB001 SS | fb001-ss-door-flush-bolt | 8 in；"Thickness=30–45 mm" 应是门厚，标签含义不清 |
| FB005 / FB005 AC | fb005-door-flush-bolt / fb005-ac-door-flush-bolt | 6–24 in；**FB005 写黄铜，FB005 AC 写锌合金，同一型号材料矛盾** |
| FB012 | fb012-door-flush-bolt | 3–10 in，宽 30 mm；**主图是明装圆销插销（barrel bolt），不是暗插销** |
| FB013 / FB014 / FB015 | fb013- / fb014- / fb015-door-flush-bolt | 不锈钢杠杆式；无尺寸 |
| FB016 | fb016-door-flush-bolt | 7 in，宽 24 mm，带加长连杆 |
| FB017 | fb017-door-flush-bolt | 锌合金杠杆式，多种长度 |
| Stainless Steel Flush Bolt | stainless-steel-flush-bolt | **"Width=22" 和长度 4–12 都没有单位；"Surface or mortise" 与摘要写的暗装（mortised）矛盾** |
| Dust Proof 01 / 02 | dust-proof-01- / dust-proof-02-door-viewer | 16 mm 黄铜。**照片是天地插防尘地扣，却归在猫眼类** |
| DV04 | dv04-door-viewer | 筒 14 mm，可调 34–62，外圈 26 |
| DV05 / DV05 BL | dv05-door-viewer / dv05-bl-door-viewer | 黄铜，筒 12/14/16，门厚 35–55 或 60–100，180°/200° |
| DV06 | dv06-door-viewer | 同 DV05，另有 160° 款，门厚 30–50 |
| DV07 | dv07-door-viewer | **门厚写 25–28 mm，但图纸长 42/72、筒 28**，疑把筒径填进了门厚 |
| DV08 / DV08 SN | dv08-door-viewer / dv08-sn-door-viewer | 筒 28 mm，60–95 mm，200°，玻璃镜片（SN 款） |
| DV09 / DV10 / DV11 | dv09- / dv10- / dv11-door-viewer | 黄铜，12/14/16，35–55（DV10 另有 60–100）；DV11 外形是方形 |
| DV12-B / DV12-S | dv12-b- / dv12-s-door-viewer | ABS，28 mm，200°，35–55 |
| DS01 / DS02 / DS022 | ds01- / ds02- / ds022-door-stopper | 墙装或踢脚线装；DS01 总长 96、底座 Ø34；DS01 规格为不锈钢，但主渲染图是金色 |
| DS05 / DS010 | ds05- / ds010-door-stopper | 半球地装；Ø44×24、Ø42；DS010 两张图的防转销不一致 |
| DS09 | ds09-door-stopper | 地装，胶头水平，42×35 |
| DS011 | ds011-door-stopper | **照片是双钢珠碰珠（柜门用），不是门挡；series 写成 "Door Flush Bolt"** |
| DS013 | ds013-door-stopper | 下压式定门器；**尺寸 110×66 和表面列表与 F001 完全相同，疑似复制** |
| F001 / F002 | f001- / f002-security-door-guard | U 形摆杆式；110×66、103×66 |
| F004 / F005 | f004- / f005-security-door-guard | 链式 / 链加插销；F004 为铁材，却列"SS"表面（待核实） |
| F006 | f006-security-door-guard | 盒式限开器，结构待核实 |
| 200 | 200-indicator | 锌合金方形指示锁，表面安装，套件完整 |
| 400 | 400-indicator | **JSON 没有任何图片** |
| 500 | 500-indicator | 不锈钢圆形；**不锈钢配 PB/AB 等电镀色，工艺待核实（可能是 PVD）** |
| 881 SS / S02 CP / S03 | 881-ss- / s02-cp- / s03-sliding-hook-lock | 锌合金钩锁，160 / 100 / 100 mm；881 带锁芯和旋钮 |
| DC01 / DC02 / DSL02 | dc01- / dc02- / dsl02-door-coordinator | DC01 **写"控制关门速度和力"——顺序器只管关门次序，速度由闭门器控制**；DSL02 写"可调关门力"（待核实）；DC02 的"55–100 kg"含义不清 |
| EPT01 | ept01-door-power-transfer-devices | 316 不锈钢暗装过线器。**"Weight=1.25" 没有单位；"BAA Compliant=Yes" 是合规声明，又与"原产中国"并列，按本站规则不应出现（法律含义待核实）** |
| HY-0SS | hy-0ss-latch-guard | 304 外开门锁舌护板，螺柱穿门固定 |
| NO01 | no01-gate-house-no | 3–6 in 门牌号；不锈钢配 PB/AB 色；信息图上的尺寸（如 200 mm、30 cm）超出规格 |
| L001 / L015 | l001-latch / l015-latch | 中心距 90 mm |
| L003 / L005 / L006 / L018 / L021 | l003- … l021-latch | 60/70 mm；JSON 材料写锌合金，**照片锁壳是镀锌钢**（待核实是否只指锁舌） |
| L004 | l004-latch | 圆柱锁锁舌，60/70/90 |
| L002 / L008 / L009 / L010 / L016 / L019 / L023 / L024 / L025 / L026 | 对应 l0xx-latch | 中心距下单前按图纸确认 |
| BH15 / BH15-80mm / BH15-100mm | bh15-barrel-bolt 等 | 明插销，80/100×38×1.2；后两者 doorTypes 写"墙装室内配件" |
| BH16 / BH17 | bh16-flat-slide-bolt / bh17-spring-latch | 平板插销 70×48；弹簧碰锁 44×42 |
| BH01 / BH02 | bh01-grab-bar / bh02-knurled-grab-bar | 直扶手 300–1000；BH02 中段滚花，图纸管径 32；**BH02 长度有一项写成"500m"** |
| BH03 / BH04 | bh03- / bh04-angled-grab-bar | 折角 415、底盘 65；**BH03 图纸管径 25 mm，小于 ADA 609.2.1 要求的最小 32 mm，不应写成 ADA 扶手** |
| BH56 / BH57 / BH58 | bh56- / bh57- / bh58-flip-up-grab-bar | 翻折扶手；没有尺寸，没有实拍；信息图上的承重和"FIXED"文字没有依据 |
| BH55 | bh55-fold-down-shower-seat | 白色座板加铬色支架；**description 写"上方是实物照片"，但审图结论是全部为 CG 图** |
| BH05–BH09、Stainless Steel Wall Hook | bh05-hook-rail … stainless-steel-wall-hook | 排钩：宽 30/25，厚 2.5/2.0，1–8 钩；钩数以规格为准 |
| BH10–BH14、BH36–BH42、BH54 | bh10-robe-hook … bh54-double-robe-hook | 单钩、双钩、衣帽钩；BH10/BH11 可用 3M 背胶；**BH14 厚度写 0.8 mm，偏薄（待核实）**；BH38–BH42 没有实拍 |
| BH18 / BH34 / BH32 / BH33 | 毛巾环、毛巾杆、浴巾架 | 毛巾杆 300–600；浴巾架进深 200 mm，管径 12 mm |
| BH19–BH23、BH43 | 纸巾架 | BH21：宽 152，下垂 96，座 Ø45 |
| BH24 / BH25 / BH35 | 擦手纸箱、大卷纸箱、皂液器 | 280×215×100；250×260×120（带锁）；162×92 |
| BH26 / BH27 | 皂碟 | 磨砂玻璃碗 / 金属丝网 |
| BH28–BH31、BH50–BH53 | 置物篮、置物架 | 转角款必须装阴角；BH50–BH53 没有实拍 |

另外，以下型号的 series 被标成 "Indicator"，与实际品类不符：FB001、FB005 AC、FB017、DV04、L002、L008、L009、L010、L016、L019、L023、L024、L025、L026。

---

## 9. 相关标准（只作知识）

**我方任何产品都不得据此声称已认证或合规。**

| 标准 | 管什么 |
|---|---|
| ANSI/BHMA A156.16 辅助五金（Auxiliary Hardware） | 门挡、定门器、门用插销（含手动天地插）、猫眼、衣钩、毛巾架等约二十类；给出定义和性能测试 |
| ANSI/BHMA A156.3 | 逃生装置，外加自动和自锁天地插、可拆中梃、门顺序器、开门撑杆 |
| NFPA 80 | 防火门组件：双开防火门的插销要求、何时必须装顺序器、现场改动限制 |
| EN 12051 | 门窗插销：只从受保护一侧操作的单点插销（明插销、塔插、天地插等）的性能、安全和测试；不包括逃生装置 |
| EN 1158 | 门顺序器（独立式和闭门器内置式）；防火/防烟门的附加要求见附录 A；有厂家声明耐久等级为 500,000 次 |
| EN 1670 | 建筑五金耐腐蚀分级（盐雾） |
| EN 1906 | 执手和球形把手（只在锁舌配执手时相关） |
| ADA 2010 Standards §604、§608、§609、§610 | 坐便器扶手布置、淋浴间扶手、扶手直径、净距、高度和强度（250 lbf）、淋浴和浴缸座椅 |
| ISO 17966:2016 | 个人卫生类辅助器具的安全和性能要求及测试方法（WHO 文件引用） |
| EN 12182、ISO 21542 | 辅助器具通用要求；建筑无障碍（WHO 文件指出可参考） |
| BS 8300、英国 Approved Document M | 英国无障碍设计；本次未核对原文（待核实） |
| GB 55019-2021、GB 50763-2012 | 中国无障碍规范；关于抓杆的条文本次未核对（待核实） |
| FD30/FD60 防火门猫眼（英国市场做法） | 防火门上的猫眼须为经过防火测试的产品，并附带膨胀密封件 |

---

## 10. 来源

> 说明：本次会话后段，WebFetch 被网络拦截（"Unable to verify if domain … is safe"），curl 也超时。所以标「检索」的条目是通过 WebSearch 的结果摘要读取的，没有打开原页面全文；标「全文」的条目已打开并核对。

- 全文：ADA 2010 Standards — https://www.access-board.gov/ada/
- 全文：WHO APS15 Handrails and grab bars（草案）— https://www.who.int/docs/default-source/assistive-technology-2/aps/mobility/aps15-handrails-grab-bars-oc-use.pdf
- 全文：Yale / ASSA ABLOY MC96 猫眼说明 — https://eshop.assaabloyopeningsolutions.nz/media/B2BUserGuide/Q25151_MC96_Door_Viewer.pdf
- 全文：Hager 1756 猫眼说明 I-TA01241 — https://www.hagerco.com/Files/Images/Images/Instructions/I-TA01241.pdf
- 全文：doorwaysplus 被动扇天地插选型 — https://www.doorwaysplus.com/blog/our-blog-1/specifying-flush-bolts-for-inactive-leaves-a-practical-guide-for-metal-door-openings-55
- 检索：Hager 天地插说明 I-TA01031 — https://www.hagerco.com/Files/Images/Images/Instructions/I-TA01031.pdf
- 检索：Rockwood 570 防尘地扣 — https://www.doorwaysplus.com/shop/rockwood-570-dust-proof-strike-47
- 检索：Bobrick B-5806 扶手技术资料 — https://www.specifiedby.com/bobrick-uk/b-5806-straight-grab-bar/Bobrick-UK_B-5806-Straight-Grab-Bar_Technical_PDS.pdf
- 检索：Bobrick B-5837 — https://www.bobrick.com/wp-content/uploads/B-5837_td.pdf
- 检索：Bobrick B-5181 淋浴折叠座 — https://www.bobrick.com/wp-content/uploads/5181_ii.pdf
- 检索：idighardware（ADA 猫眼视角） — https://idighardware.com/?p=21198
- 检索：idighardware 防火门顺序器问答 — https://idighardware.com/2019/05/qq-coordinators-on-fire-doors/
- 检索：Allegion 盖缝条与顺序器 — https://kc.allegion.com/kb/user-question/astrigal-with-coordinator
- 检索：FIRESTOP FD30 猫眼数据表 — https://www.lockandkey.co.uk/product/firestop-contract-fd30-door-viewer-180/datasheet.pdf
- 检索：墙装与地装门挡 — https://doorwaysplus.com/blog/our-blog-1/floor-stop-or-wall-stop-choosing-the-right-door-stop-for-commercial-openings-65
- 检索：NHS Wales 门挡设施警示 — https://nwssp.nhs.wales/ourservices/specialist-estates-services/specialist-estates-services-documents/estates-and-facilities-alerts-documents/wg-efa-2019-005-issues-with-doorstops-amp-door-buffers-pdf/
- 检索：Door chain — https://en.wikipedia.org/wiki/Door_chain
- 检索：Engineer Fix 门链 — https://engineerfix.com/what-is-the-chain-lock-on-a-door-called/
- 检索：厕位指示锁（应急开启） — https://www.commercialwashroomsltd.co.uk/bathroom-turn-and-indicator-lock-with-emergency-release.html
- 检索：Union 37651 指示锁 — https://www.lockshop-warehouse.co.uk/acatalog/union-37651-indicator-bolt.html
- 检索：Triser 推拉门锁安装 — https://www.alspec.com.au/hardware/Triser-Sliding-Mortice-Lock-Fitting-Instruction-Sheet.pdf
- 检索：Hager 推拉门锁 I-LS01774 — https://www.hagerco.com/Files/Images/Images/Instructions/I-LS01774.pdf
- 检索：Dowsing & Reynolds 卫浴挂件安装 — https://www.dowsingandreynolds.com/wp-content/uploads/2023/07/CV-Instructions-NEW-Bathroom-accessories-2023.pdf
- 检索：Lusso Luxe 挂件安装 — https://www.lussostone.com/cdn/shop/files/Luxe_Accessories_Install_Guide.pdf
- 检索：BHMA A156.16 要点 — https://buildershardware.com/ANSI-BHMA-Standards/Hardware-Highlights/A15616-2018-Auxiliary-Hardware
- 检索：BHMA 标准修订（A156.3 范围） — https://facilityexecutive.com/bhma-issues-revised-door-hardware-standards
- 检索：EN 1158 — https://w3inte.intertek-france.com/building/standards/en-1158
- 检索：GEZE EN 1158 证书 — https://www.geze.com.cn/en/download/file/GEZE_Certificate_EN_mw913936.pdf
- 检索：EN 12051 范围 — https://www.sis.se/en/produkter/construction-materials-and-building/elements-of-buildings/windows/ssen12051/
- 检索：EN 1906 — https://knowledge.bsigroup.com/products/building-hardware-lever-handles-and-knob-furniture-requirements-and-test-methods
- 检索：Select Hinges 外开门锁舌护板 — https://select-hinges.com/images/pdfs/instructions/Latch_Guard_Installation_Instructions_Outswing.pdf
- 检索：Locksmith Ledger 锁舌保护 — https://www.locksmithledger.com/door-hardware/article/10228419/latch-protection-and-security-strikes
- 检索：Atlas Steels 点蚀与缝隙腐蚀 — https://atlassteels.com.au/wp-content/uploads/2021/07/Atlas-Tech-Note-No-2-Pitting-Crevice-Corrosion-of-Stainless-Steels-17-06-21.pdf
- 检索：Arcat 圆柱锁开孔 — https://www.arcat.com/product/cylindrical-lever-143393
- 检索：dormakaba T300 开孔说明 — https://dormakaba.rokka.io/original/f13f5a/1726765426_T300%20Pass%20_%20Priv%20Temp%20_%20Install%20%20T93253.pdf
- 检索：Doc M 翻折扶手零售规格 — https://www.ironmongerydirect.co.uk/product/nymas-hinged-support-grab-rail-800-x-200mm-dark-blue-412193
- 我方数据：`content/products/*.json`（124 个型号）、`public/images/products/`、`docs/research/image-audit/verdicts.json`
