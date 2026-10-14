# 07 材料、工序与表面处理（横跨所有品类）

> 用途：写文案、审 AI/场景图、策划演示视频、回答买家时，判断"这个零件是什么做的、怎么做出来的、表面是什么、能不能这么说"。
> 本章只写行业通识和我们产品 JSON 里写着的东西。**不代表我们工厂的实际工序**；JSON 没写的，一律不能说成"我们这样做"。
> 数据快照：2026-10-14，`content/products/*.json` 中面向 HYDE 的记录 616 条（`sites` 为空或含 `hyde`），其中 **325 条 `finishes` 为空**。
> 不确定的数字标「待核实」。所有标准只作知识，**不得写成或暗示我们的产品已认证/符合**。

---

## 1. 是什么、怎么工作：零件 → 材料 → 工序 → 表面

五金件的价值链是一条固定顺序，后一步不能弥补前一步：

**基材（base material）→ 成形（forming）→ 机加工/去毛刺（machining / deburring）→ 研磨抛光（grinding & polishing）→ 表面处理（surface finish）→ 装配（assembly）→ 测试（testing）→ 包装（packaging）**

- 表面处理只是"皮"。同样看起来是"拉丝银色"，可能是不锈钢本色，也可能是锌合金上的电镀铬。BHMA 的代号体系正是为此而设：同一个颜色，因基材不同而编不同的号（例如 626 = 铜基上的缎面铬；652 = 钢基上的缎面铬；630 = 不锈钢本色缎面）。
- 划伤后露出的是基材：630 划伤露出的仍是不锈钢；626 划伤露出的是会腐蚀的基材（来源：securityparts 表面指南）。
- 因此**判断质量、写文案、审图，先问基材，再问表面**。

### 1.1 常用基材（材料速查）

| 材料 | 牌号/成分要点 | 在门五金上的典型用途 | 说明 |
|---|---|---|---|
| 锌合金（zinc alloy, Zamak） | Zamak = Zn + Al + Mg + Cu 的德文首字母。Zamak 3（ASTM AG40A）是北美最常用；Zamak 5（AC41A）在欧洲最常用，比 3 多加铜，强度硬度更高、延性略降；Zamak 7 是 3 的高纯改型，流动性和表面更好，适合薄壁和高抛光电镀件 | 执手（lever）、球形锁把（knob）的装饰件、门吸、门镜外壳、挂钩锁 | 全部为热室压铸（hot-chamber die casting）合金。精确成分区间见 ASTM B240/B86「待核实原文」 |
| 304 不锈钢（stainless steel 304） | 约 18% 铬 / 8% 镍的奥氏体钢 | 拉丝/镜面执手、合页、扶手、玻璃门夹、面板 | 300 系的"标准不锈钢"；BHMA 630（US32D）默认基材 |
| 316 不锈钢 | 在 304 基础上加 2–3% 钼，抗氯离子点蚀 | 海边、泳池、强清洁剂场所 | 沿海项目应明确要求 316，不接受 304 替代（securityparts） |
| 201 不锈钢 | Cr 16.0–18.0%，Ni 3.5–5.5%，Mn 5.5–7.5%，N ≤0.25%，C ≤0.15%（NKS 数据表）。用锰和氮代替部分镍以降低成本 | 低价执手、合页、面板 | 退火态基本无磁，冷加工后会带磁；在温和环境可替代 304，含碳未控制在 0.03% 以下时焊缝热影响区易晶间腐蚀（NKS）。腐蚀数据少，"按化学成分推测接近 304，具体应用应先测试"（Hendrix Group） |
| 黄铜（brass） | 锻造黄铜如 UNS C37700：Cu 58–61%，Pb 1.5–2.5%；欧标 CW617N：Cu 57–59%，Pb 1.6–2.5%（bwvalve 材料表） | 锁芯（cylinder）、钥匙、锻造执手、实心铜合页、门镜 | 含铅黄铜**不是无铅材料**。抗脱锌（DZR）需专门牌号并按 ISO 6509 检验，不能默认 |
| 铁/碳钢（iron / carbon steel） | JSON 中写作 Iron、45# steel、Steel、Carbon Steel | 锁体外壳（lock case）、底座、方轴、内部底盘（chassis）、推杠 | 必须有防护层：镀锌、镀镍、喷涂/粉末喷涂、电泳 |
| 铝合金（aluminium alloy） | 牌号在 JSON 中未写「待核实」 | 逃生推杠主体、型材把手 | 常见表面为阳极氧化（anodizing，BHMA 628 = 缎面铝本色阳极氧化）或喷涂 |

### 1.2 主要成形工序

| 工序 | 原理 | 适合的零件 | 典型缺陷 |
|---|---|---|---|
| 压铸（die casting） | 熔融合金高压射入钢模。锌合金走热室压铸，效率高于铝用的冷室压铸 | 锌合金执手、玫瑰底座外壳、门吸、推杠端盒 | 气孔/缩孔（porosity）、冷隔（cold shut）、分型线、飞边。气孔在抛光后被打开，电镀时把镀液封在里面，日后鼓泡 |
| 冲压与拉伸（stamping / deep drawing） | 板材在模具中冲裁、折弯、拉深 | 锁体外壳、面板（faceplate）、锁扣板（strike）、玫瑰底板、合页页片 | 毛刺、回弹、拉深开裂、孔位偏 |
| 精密铸造（investment casting, 失蜡铸造） | 蜡模 → 陶壳 → 浇注 | 不锈钢实心执手、管把手的支脚 | 成本和重量都高于管材方案（专利背景说明） |
| 热锻（hot forging） | 加热棒料在模具中锻压 | 铜执手、铜把手（CW617N/C37700 一类） | 折叠、欠压、氧化皮 |
| 数控加工（CNC machining） | 车/铣/钻 | 锁芯、方孔、螺纹孔、精度要求高的配合面 | 尺寸超差、刀纹 |
| 管材弯曲与焊接（tube bending & welding） | 不锈钢管弯形，与铸/车件焊接后打磨 | 空心管执手、扶手、拉手、玻璃门把手 | 焊缝发黑/气孔、打磨不平、弯管压扁 |
| 研磨抛光（grinding & polishing） | 逐级砂带/砂轮，再布轮抛光 | 不锈钢、黄铜、锌合金电镀前 | 过抛打开锌铸件表皮暴露气孔；拉丝方向乱 |

### 1.3 表面处理

| 表面 | 原理 | 耐久性要点 |
|---|---|---|
| 缎面/拉丝（satin / brushed） | 定向砂纹。BHMA 定义"缎面"为平滑哑光，可有或无方向纹 | 不锈钢 No.4 拉丝常用约 150–180 目（finishing.com 问答，作参考）。划痕可顺纹修复 |
| 镜面（mirror / bright polished） | 逐级细磨后抛光，镜面应无残留磨纹 | 指纹、划痕最明显 |
| 电镀铜-镍-铬（Cu–Ni–Cr electroplating） | 锌合金：先氰化铜预镀（copper strike），再镀铜、镍、铬。BHMA 625 = 镍上镀亮铬；626 = 镍上缎面铬 | ISO 1456 / ASTM B456 按使用条件（service condition）规定不同厚度等级，具体厚度值「待核实原文」。基材有气孔或预镀铜浴被锌污染时会鼓泡、脱皮 |
| 缎面镍（satin nickel） | 镍层做缎面效果。BHMA 619 = US15 缎面镍 | 室内为主 |
| PVD（物理气相沉积, physical vapour deposition） | 真空中蒸发钛、锆等金属沉积成几微米的硬膜，可做金、玫瑰金、青铜、黑色 | 比电镀层硬、耐磨、不易变色。Baldwin 的"终身表面"是先电镀镍-钯，再在真空室镀氮化锆（ZrN）的金色——即**PVD 常叠在电镀底层上**，并非单独一层 |
| 粉末喷涂（powder coating） | 带电粉末吸附后高温固化 | 颜色多、哑黑流行；被锐物损伤处基材裸露。高频或户外推荐 PVD 或不锈钢（Griffwerk） |
| 喷漆（spray painting） | 液态涂料 | 抗机械磨损不如粉末或 PVD |
| 电泳（e-coating / electrophoretic coating） | 工件浸入水性漆槽，通电沉积，膜层自限性生长，能进入内腔、螺纹和边角（"泳透力"） | 常作底漆再叠粉末或液体漆。环氧电泳耐蚀好但不耐紫外线，户外需面漆 |
| 阳极氧化（anodizing） | 铝表面电化学氧化 | 仅铝；628 = 缎面铝清阳极。海边会出现白色氧化 |
| 仿古/做旧（antique, oxidised, relieved） | 化学发黑后局部擦亮（BHMA 术语 relieved：部分去除表面形成对比），多数再罩清漆 | 613（US10B）油擦青铜是"活表面（living finish）"：高频接触处会磨出浅色底，属预期现象，多数厂家质保不包 |
| 镀锌及钝化（zinc plating, 白锌/彩锌） | 钢件电镀锌 | 内部件防锈。JSON 多处写 "Chassis = Solid steel ... zinc plated" |

---

## 2. 装在哪里、怎么装：材料/表面与环境、门型的匹配

本章不讲具体孔位（见各品类章节），只讲**材料和表面在安装与环境上的约束**：

- **室内一般门**：626/US26D 缎面铬是商业室内的默认；630/US32D 不锈钢是门五金外门、合页、逃生装置的默认（nationallocksupply）。
- **外门、潮湿、强清洁剂（医院、餐饮厨房）**：用 630 不锈钢。铬电镀在漂白剂和消毒剂下退化；外门用 626，安装当时看不出区别，几个月后才出问题（securityparts）。
- **沿海/泳池**：明确 316。US26D、US3/US4 黄铜、US10B、US28 铝都应避免（securityparts）。
- **紧固件**：厨房等高湿场所，安装螺丝也要不锈钢，普通镀锌或发黑螺丝会生锈（securityparts）。
- **同一门洞的表面一致**：同为"US26D"，不同厂家可能交 626（铜基）或 652（钢基），外观一致但基材不同，涉及防火门认证时需向厂家确认代号（securityparts）。
- **门厚和尺寸不受表面影响**，但**电镀/喷涂会增加膜厚**：方孔、螺纹孔、配合面若被涂层堵塞会装不上——这是 QC 点而不是安装问题（膜厚数值「待核实」）。

常见安装/选型错误：

1. 外门或海边用镀铬（CP/SC/626）锌合金件。
2. 把"SS"字样当成不锈钢材质卖给外门项目——在我们的数据里，"SS"也出现在锌合金、铁、黄铜件上（见第 8 节）。
3. 用 201 替代 304 却不告知，用于潮湿或含氯环境（Aalco 数据表称 200 系主要用于室内低腐蚀环境，不推荐氯化物环境——该点来自检索摘要）。
4. 用强清洁剂或研磨剂清洁 PVD、粉末喷涂或电镀表面。

---

## 3. 场景和展示：图片里表面与材质"对"的规则

这些规则用于审核 AI 图和渲染图。凡与本章冲突的，以对应型号的实拍图为准。

**必须做到**

1. **表面跟着基材走。** 630/US32D 只能是不锈钢本体；锌合金件即使写着 "SS" 或 "satin stainless"，也是电镀/喷涂的"不锈钢色"。渲染时按该型号实拍的光泽和纹理走，不要因为写了 SS 就画成不锈钢管材的焊缝结构。
2. **拉丝方向与实拍一致。** 缎面件有方向纹；同一零件上不能出现两个方向的拉丝，也不能把拉丝件渲染成镜面。镜面件应反射环境，不应有砂纹。
3. **仿古表面（AB/AC/ORB/US10B）是"做旧"的**：凸起处亮、凹处暗，件与件之间有差异，这是正常的。不要渲染成均匀的单色塑料感，也不要把 PB 抛光黄铜画成 AB。
4. **可见装饰件同一表面**：一个画面里，执手、玫瑰、面板应为同一表面（AGENTS.md 的"一个画面一个表面"）。
5. **内部件不是装饰表面，按实拍保留。** 我们的实拍显示：
   - 037 PS 的底板、方轴、紧固柱是黄/彩色钝化镀锌外观，旋钮是缎面镍、玫瑰是不锈钢（`037-ps-panic-exit-device-trim-5.webp`）；
   - 069 的方玫瑰背面是亮银色冲压底板、卡簧、黄色钝化方轴，执手为黑色（`069-stainless-steel-handle-4.webp`）；
   - 575 ABET 整套为古铜色，但**斜舌头（latch bolt）是亮银色**（`575-abet-tubular-lock-2.webp`）。
   渲染时不得把这些零件"统一"成装饰表面，也不得把古铜色锁的锁舌改成古铜色。
6. **粉末喷涂/喷漆件没有金属纹理。** 逃生推杠（如 305、314）的黑色或灰色喷涂面不应出现拉丝或镜面高光；阳极氧化银（Anodized Silver）是铝，不是不锈钢。

**物理上不可能 / 不可信**

- 沿海、泳池、户外淋雨场景配镀铬或黄铜本色的室内件——专业买家一眼看出选型错误。
- 不锈钢件表面有红锈；或"实心铜"件露出灰白色锌基材。
- 镀层件的崩边处露出"不锈钢"——镀层下面是锌或铁，不会是不锈钢。
- 同一张图中出现两种以上金属色调却声称是"一套"。
- 在图上加我们 JSON 没有的表面名或工艺字样（如 "PVD"、"316"、"salt spray 480h"），除非该型号 JSON 写明。

**正常状态下看不见的东西**（不应在"已安装"图中出现）

- 底盘、方轴、紧固柱、锁体外壳都在门内或玫瑰后面。
- 镀层厚度、基材牌号、气孔——肉眼看不见，只能靠测量（第 5.5 节）。

---

## 4. 功能和使用：表面代号、保养与失效

### 4.1 美标 US / BHMA 代号对照（只列有来源的）

| US 代号 | BHMA | 表面 | 基材（BHMA 定义） | 环境 |
|---|---|---|---|---|
| US3 | 605 | 亮黄铜，罩清漆（bright brass, clear coated） | 黄铜/青铜 | 室内 |
| US4 | 606 | 缎面黄铜（satin brass） | 黄铜 | 室内 |
| US10 | 612 | 缎面青铜，罩清漆 | 青铜/黄铜 | 室内 |
| US10B | 613 | 深色氧化缎面青铜，油擦（oil-rubbed bronze, ORB） | 青铜/黄铜 | 室内；活表面 |
| US14 | 618 | 亮镍，罩清漆 | 黄铜/青铜 | 装饰 |
| US15 | 619 | 缎面镍（satin nickel） | 黄铜/青铜 | 室内 |
| US15A | 620 | 缎面镍，发黑，缎面做旧，罩清漆 | 黄铜/青铜 | 室内 |
| US19 | 622 | 平光黑（flat black，喷涂） | — | 高频接触处比 630 先磨损 |
| US26 | 625 | 亮铬（镍上） | 黄铜/青铜 | 室内 |
| US26D | 626 | 缎面铬（镍上） | 黄铜/青铜（钢基为 652） | 室内默认 |
| US28 | 628 | 缎面铝，清阳极氧化 | 铝 | 门面型材、闭门器 |
| US32 | 629 | 亮不锈钢 | 不锈钢 | 户外、高频 |
| US32D | 630 | 缎面不锈钢 | 不锈钢 | 户外、沿海、逃生装置、合页 |
| — | 689 / 690 / 695 | 铝色喷涂 / 深青铜喷涂 / 深青铜粉末 | 多为闭门器 | — |

- US 代号中带 D 表示缎面（dull），不带 D 表示亮面（securityparts）。
- **US5（BHMA 609）**：不同来源写法不一（"古铜/antique brass" 或 "缎面黄铜发黑"），以 A156.18 原文为准「待核实」。
- **US11**：在 BHMA 表中未查到；仅有一家零售商把 Yale 某型号的 "US11" 描述为古铜（antique copper）。我们 JSON 用 "Antique copper (US11)"，需核实（第 8 节）。

### 4.2 欧标/中国出口常用字母代号（EN 风格命名）

欧洲标准 EN 1670 只给耐腐蚀**等级**，不规定颜色代号；颜色字母是行业/厂家惯例，**各厂含义不统一**。下表是我们数据中的用法：

| 代号 | 在我们 JSON 中的含义 | 近似的 US/BHMA（仅颜色近似，基材可能不同） |
|---|---|---|
| PB | Polished Brass 抛光黄铜 | US3 / 605（若基材为黄铜） |
| SB | **两义**：Satin Brass 缎面黄铜；在 D104 SS 中却是 Mirror polished | US4 / 606（缎面黄铜义） |
| AB | Antique Brass 古铜 | US5 / 609「待核实」 |
| AC | Antique Copper 古红铜 | 无可靠对应 |
| CP | Chrome Plated 亮铬 | US26 / 625（铜基）或钢基对应码 |
| SC | Satin Chrome 缎面铬 | US26D / 626（铜基）、652（钢基） |
| SN | Satin Nickel 缎面镍 | US15 / 619 |
| NP | Nickel Plated 镀镍 | 近 US14 / 618「待核实」 |
| SS / SSS / ST | 缎面不锈钢 / 缎面不锈钢 / 发丝纹不锈钢（Hairline） | US32D / 630——**仅当基材为不锈钢** |
| PSS / SP | 抛光不锈钢 / "Bright Polished" | US32 / 629——仅当基材为不锈钢 |
| ORB | Oil Rubbed Bronze 油擦青铜 | US10B / 613 |
| MB / BK | Matt Black 哑黑（BK 也是功能后缀，见 8.2） | US19 / 622（若为喷涂） |
| BN | Black Nickel 黑镍（部分型号）；其余未定义 | 无 |
| PVD | 仅 SSH031 写有 PVD | 无 |

### 4.3 日常保养（通识）

- 不锈钢：中性清洁剂，顺纹擦拭。
- 电镀件、PVD、粉末喷涂：软湿布；避免研磨剂和强化学清洁剂（Griffwerk；Baldwin 的 PVD 变色被认为多由清洁化学品造成）。
- 活表面（US10B 等）：磨出底色是设计如此，不是质量问题，应事先告诉买家。

### 4.4 典型失效

| 失效 | 原因 |
|---|---|
| 电镀层鼓泡、起皮 | 锌压铸件气孔封住镀液；过度抛光打开表皮；预镀铜浴被锌污染；氧化膜未除净（pfonline / finishing.com 讨论） |
| 镀铬件户外点锈 | 镀层被划穿，基材腐蚀 |
| 304 沿海出现黑色小点 | 氯离子破坏钝化膜，点蚀；应选 316 |
| 201 焊缝附近锈蚀 | 含碳高，焊接热影响区晶间腐蚀 |
| 黄铜清漆发白/发黄 | 清漆老化；A156.18 的紫外与清漆评估项针对此类变化 |
| 粉末层局部破损后起锈 | 锐物损伤，基材裸露 |
| 执手下垂、松动 | 回位弹簧、卡簧或管把与转动件连接松脱（空心组装式执手的已知问题，见专利背景） |

---

## 5. 材料和工序（核心）

### 5.1 典型零件 × 材料 × 工序

| 零件 | 常见材料 | 常见工序 | 表面 |
|---|---|---|---|
| 执手/球把（lever / knob） | 锌合金；不锈钢（管或实心）；黄铜 | 锌：压铸→去毛刺→抛光→电镀；不锈钢：管弯+焊接+打磨，或精密铸造实心；铜：热锻+CNC+抛光 | 电镀/PVD/拉丝/镜面/喷涂 |
| 玫瑰/面盖（rose / escutcheon） | 不锈钢板；锌合金；黄铜 | 冲压拉伸；或压铸 | 同执手 |
| 底板、方轴、紧固柱 | 钢 | 冲压、冷镦、车削 | 镀锌（白锌/彩锌） |
| 锁体外壳（lock case） | 钢板、铁 | 冲压、折弯、铆接 | 镀锌/镀镍；JSON：AR4 系列 "Nickel-plated iron lock case" |
| 面板/锁舌（faceplate / latch bolt） | 不锈钢、锌合金、黄铜、铁 | 冲压；锁舌压铸或车削 | 与装饰面一致或单独镀层 |
| 锁芯与钥匙 | 黄铜；钥匙常为镀镍黄铜 | CNC、冲齿 | 本色/镀镍 |
| 合页页片（hinge leaf） | 不锈钢 201/304、铁、黄铜 | 冲压+卷边（knuckle） | 拉丝、电镀、喷涂 |
| 逃生推杠主体/端盒 | 铝合金、铁/钢 | 型材或铸件「待核实」 | 阳极氧化、粉末/喷涂 |
| 扶手、玻璃门拉手 | 304 不锈钢管 | 弯管、焊接、抛光 | SSS / PSS |

### 5.2 装配与测试

**耐腐蚀 —— 中性盐雾（neutral salt spray, NSS）**

- 方法：ISO 9227（中国等效修改采用 GB/T 10125-2021，基于 ISO 9227:2017）。5% 氯化钠溶液，箱内 35°C，NSS 的沉降液 pH 6.5–7.2；AASS 加醋酸使 pH 3.1–3.3；CASS 再加氯化铜 0.26 g/L ±0.02，专用于铜-镍-铬或镍-铬装饰镀层（Ascott 摘要）。ASTM B117 是美标对应方法。
- ISO 9227 本身**不规定时长**，时长由产品标准定，且声明盐雾结果不宜用于材料排序或预测长期寿命。
- EN 1670（门窗五金耐腐蚀分级）：0 级无要求，1–5 级。**3 级 = 96 小时**（证书原文），**5 级 = 480 小时**（Giesse 说明）。1、2、4 级的时长「待核实」（常被引用为 24/48/240 小时，但未从可靠来源确认）。
- EN 1906（执手）分类代码第 6 位是耐腐蚀等级，按 EN 1670 评级。
- ANSI/BHMA A156.18：几乎所有建筑五金都做盐雾试验（判据：无腐蚀、无污渍、无起泡），另有铅笔硬度、耐磨、汗液、紫外等项目。具体小时数「待核实」。

**寿命 —— 循环测试（cycle test）**

| 标准 | 品类 | 有来源的数字 |
|---|---|---|
| EN 1906 | 执手 | 耐久 6 级 = 100,000 次；7 级 = 200,000 次 |
| EN 1935 | 单轴合页 | 耐久 7 级 = 200,000 次（门用中、重、严酷级）；门重等级 0–7 对应 10–160 kg |
| ANSI/BHMA A156.2 | 圆柱/球形锁 | Grade 1 = 1,000,000 次。Grade 2/3 不同来源互相矛盾（800,000/400,000 或 400,000/200,000）「待核实」 |
| A156.13 | 插芯锁 | Grade 1 = 1,000,000 次 |
| A156.3 | 逃生装置 | Grade 1 = 500,000 次（含预载） |
| A156.4 | 闭门器 | Grade 1 = 2,000,000 次 |

**强度与扭矩**：A156.2 含强度、扭矩、冲击、安全测试；securityparts 给出门冲击等级（Grade 1 = 360 lbf 等），旧资料提到 Grade 1 锁止执手滥用扭矩 1,000 lbf·in——均为二手资料「待核实」。

**镀层厚度测量**：X 射线荧光（XRF），按 ISO 3497 / ASTM B568；可分层测多层金属镀层；对油漆等非金属涂层不适用，应改用磁性或涡流测厚仪。镀镍件基材若为含镍不锈钢，需要用标准片校准（Evident / Quality Magazine 摘要）。

### 5.3 典型 QC 点

**来料（incoming）**
- 不锈钢、黄铜：材质证明（mill certificate）+ 抽检成分。磁铁**不能**区分 201 和 304（两者退火态都基本无磁、冷加工后都可能带磁）；可用手持 XRF 或送实验室化学分析，201 的锰明显高、镍明显低。
- 锌合金：锭的牌号与杂质；来料铸件检查气孔、麻点、冷隔，**气孔件应直接拒收**。
- 黄铜：铅含量、是否要求抗脱锌（ISO 6509）。

**尺寸（dimensional QC）**
- 方孔、螺纹孔、孔距、中心距（backset）、门厚适配范围——这些决定"装得上装不上"。**涂层后**再测一次，膜厚可能堵孔「待核实具体公差」。

**表面缺陷（finish defects）**
- 鼓泡、针孔、麻点、橘皮、色差、流挂、露底、拉丝方向不一、镜面残留砂纹、仿古件做旧不均（在合理范围内允许差异）。
- 抽检做盐雾、附着力、膜厚（XRF）。

**装配与功能**
- 回位力度、转动手感、锁舌伸缩、钥匙插拔、换向（handing）。

### 5.4 出口包装

- 单件内盒 + 外箱（例：SSH023 JSON 写明 "1 Pair/Box, 50 Pairs/Carton"）；不同表面的件要隔开防擦伤「通识」。
- 运输测试常用 ISTA：1A 为非模拟完整性测试（固定位移振动 ASTM D999 + 自由跌落 ASTM D5276）；2A 为部分模拟，适用 68 kg（150 lb）以下包装件，加入温湿度预处理、压力测试和两次振动。
- 海运防潮（干燥剂、气相防锈 VCI 等）「待核实」，没有找到可引用的五金专用来源。

### 5.5 如何识别"便宜做法"

| 便宜做法 | 识别方法 | 为什么会坏 |
|---|---|---|
| 空心代替实心 | 同款称重对比；看执手背面/端部是否有开口或铸造掏空「待核实」；切开样品 | 空心组装式执手的转动件可能长期使用后松脱（专利背景）；空心锌铸件壁薄易断「待核实」 |
| 201 冒充 304 | XRF 或化学分析（Mn 高、Ni 低）；**不要用磁铁** | 201 在氯离子、焊接部位更易腐蚀 |
| 锌合金冒充不锈钢/黄铜 | 重量、划痕下的基材颜色、材质证明 | 镀层划穿后锌基材腐蚀；锌强度低于钢/铜 |
| 镀层偏薄 | XRF 按 ISO 3497 测厚；CASS/NSS 抽检 | 磨穿、点锈、鼓泡 |
| 跳过铜底层/预处理差 | 鼓泡、脱皮；显微观察 | 锌件气孔封液 |
| "PVD 色"其实是电镀色或喷涂 | 要求工艺说明；耐磨对比 | 电镀层更薄更软，会变色磨损（Griffwerk） |
| 内部件不做防护 | 看底盘、方轴、底板是否有镀锌层 | 门内潮气锈蚀卡死 |

---

## 6. 拆解：常见零件清单与我们照片的对应

以下映射只基于照片可见内容和 JSON 文字；看不出的材质不推断。

| 照片（`public/images/products/`） | 类型 | 可见零件 | JSON 写的材料/表面 |
|---|---|---|---|
| `037-ps-panic-exit-device-trim-5.webp` | 信息图（实拍标注） | 球形旋钮、不锈钢玫瑰、黄色钝化外观的底板、方轴（installation spindle）、两根带螺纹的紧固柱 | "Iron knob, stainless steel rose"；"Satin nickel plated" |
| `069-stainless-steel-handle-4.webp` | 实拍 | 两只方执手背面：冲压亮银底板（6 个六角孔）、卡簧、黄色方轴 | Material: Stainless Steel；finishes 为空 |
| `575-abet-tubular-lock-2.webp` | 实拍 | 外侧带锁芯球把、内侧球把、玫瑰、锁舌管、面板；**锁舌为亮银色** | Stainless Steel；Trim "Wrought stainless steel or brass"；Chassis "Solid steel ... zinc plated"；Finish AB |
| `308-d-d-panic-exit-device-4.webp` | 实拍 | 端盒打开：带加强筋的灰色铸造壳体、扭簧、冲压盖板、方孔转轴 | "Aluminum alloy body, iron bar"；端盒材质未单列「待核实」 |

通用零件清单（以带锁执手/球锁为例）：执手或球把 ×2、玫瑰 ×2、底板 ×2、方轴（spindle）、紧固柱/螺丝、底盘（chassis）、锁舌组件（latch）、面板、锁扣板（strike）、锁芯、钥匙。

---

## 7. 演示怎么拍（材料与工艺）

原则：**只拍真实存在的东西。** 我们 JSON 没写的工序（盐雾箱、XRF、PVD 炉等）不得摆拍或用 AI 生成来暗示是我们的。

1. **基材对比**：同款执手的实拍特写——镜头从正面滑到背面，交代可见的底板、方轴（参考 069-4、037 PS-5）。
2. **表面系列**：同一型号的各表面实拍并排（如 575 的 ABET / CPET / SSET），统一光位，展示颜色和光泽差异。
3. **拉丝 vs 镜面**：微距光扫过同一件 SSS 与 PSS 扶手（BH01），显示方向纹与反射的区别。
4. **"不是所有零件都同色"**：特写 575 ABET 锁舌——诚实展示内部件/功能件的表面。
5. **称重**：仅当有真实对比件时，电子秤上实心与空心件的重量。
6. **测试类镜头**：只有在真实测试报告存在时才拍，并在画外音说明是"测试方法示意"，**不得出现"认证/合格"字样**。

---

## 8. 我们站上的对应型号与数据问题

### 8.1 代表型号

| 型号 | slug | 说明 |
|---|---|---|
| 575 SSET | `575-sset-tubular-lock` | 不锈钢；"Satin stainless steel (US32D)"——基材与代号一致 |
| BH01 | `bh01-grab-bar` | 不锈钢扶手，SSS / PSS 两种表面 |
| SSH031 | `ssh031-brass-and-steel-hinges` | 唯一写有 PVD 的型号 |
| D104 SS | `d104-ss-deadbolts` | SUS304；ST 发丝纹、SB 镜面、CB 陶瓷青铜、WH 白、CD 陶瓷深灰、BK 哑黑 |
| 70900 MBET | `70900-mbet-grip-handle-set` | 铝；"Trim = Forged solid brass or zinc die-casting electro-plated" |
| 9211 BNAC | `9211-bnac-heavy-duty-cylindrical-lock` | 锌合金；BN = Black Nickel |
| AR4-110 | `hyde-ar4-110-mortise-lock` | 镀镍铁锁体 |
| 314 | `314-alarm-panic-bar-exit-device` | 铝主体、铁杠；阳极氧化银 / 粉末黑 |
| 45BN | `45bn-lock-cylinder` | 实心黄铜锁芯；表面列表含 "Stainless Steel (SS)" |

### 8.2 代号含义不清或冲突（需要老板/业务确认，本章不改数据）

| 问题 | 出现位置 | 说明 |
|---|---|---|
| **SB 两义** | 804 PBET、CH01、SSH023 等 = Satin Brass；D104 SS = Mirror polished | 同一代号含义相反 |
| **BK 两义** | D104 SS 表面 = Matte black；型号后缀 587 MBBK、LH855 BNBK、592 PBBK = 卧室/浴室功能 | 同一代号既是表面又是功能 |
| **ET 不是表面** | 型号后缀 ET 出现 78 次，Function 为 "Entrance, keyed outside" | 若有人把 ET 当表面代号，会错 |
| **AC / BS 双用** | AC = Antique Copper（77 条）；9211 BNAC 的 AC、9212 BNBS 的 BS 是后缀，含义未写 | BS 在 592 BSET、D101 BS 中 = Satin Brass |
| **CL 与 CR** | 5807 SSCL = Communication lock；5807 SSCR = Classroom lock | 内部约定，需写入对照表 |
| 其他后缀未定义 | DK、IK、KT、PT、AN、CC | 不知是功能还是表面 |
| **"SS" 用在非不锈钢上** | 3431 SSET、881 SS、L018、F005（锌合金）；072、F004（铁）；45BN、B025（黄铜） | 指"不锈钢色"，非材质。3431 SSET 规格写 "Satin stainless steel (US32D)"，而 US32D/630 的基材必须是不锈钢——**技术上不成立** |
| 未定义代号 | BP、NB、CB（D104 以外）、BC、GP、BRN、N、BL、SP | 出现在 DS011、DS013、FB0xx、F001/F002/F006、DV05/DV06/DV08、BL027 等 |
| 同义多名 | SS / SSS / ST / "Satin stainless" / "Satin Stainless Steel (SS)" | 建议统一 |
| BN 定义不全 | 9211/9212/LH852/LH855 = Black Nickel；881 SS、DV12、015 未定义 | 也有厂家用 BN 指 Brushed Nickel「待核实」 |
| 混合字段 | "PB.AB.AC.CP.SN"、"All Available"、"Other Available"、"Custom" 等写在 finishes 数组里 | 不是单一表面 |

### 8.3 技术上不一致的规格（标出，不改）

1. **201 PBET**：Material = Stainless steel；Finish = Polished brass (US3)（BHMA 605 定义基材为铜）；Trim = "Zinc die-casting electro-plated or solid brass"——三处基材互相矛盾。
2. **575 ACET** "Antique copper (US11)"：US11 未在 BHMA 表中查到「待核实」。
3. **586 ABET、5870 ABET、607 ABET**：不锈钢 + "Antique brass (US5)"；US5 的定义基材是黄铜「待核实」。
4. **70722 DC**：锌合金 + "Satin nickel (US15)"；BHMA 619 定义基材为黄铜/青铜。
5. **305**：finishes = "Satin Stainless" 与 "Powder-Coated Black"，规格写 "Spray painted"，主体是铝合金/铁——"Satin Stainless" 不成立。
6. **587 MBBK**：表面代号 MB（Matt Black），规格却写 "Satin nickel, chrome, antique brass, polished brass"。
7. **5807 系列、5870 SSPS 等 "Stainless Steel 304/201"**：未说明是哪一种；买家会按 304 理解。
8. **132 条规格写 "Cycle life = 200,000 cycles"**：未注明测试标准。不得解读为 EN 1906 7 级或任何 ANSI 等级。
9. **325/616 条 HYDE 记录 finishes 为空。**
10. 合页型号 "6*3*3mm" 是尺寸，不像型号。

---

## 9. 相关标准（只作知识，不代表我们的产品已通过）

| 标准 | 测什么 |
|---|---|
| ANSI/BHMA A156.18 | 表面与材料代号（605–630 等）；盐雾、耐磨、铅笔硬度、汗液、紫外等表面性能 |
| ANSI/BHMA A156.1 / .2 / .3 / .4 / .13 | 合页 / 圆柱锁 / 逃生装置 / 闭门器 / 插芯锁的循环、强度、操作、安全测试；Grade 1–3 |
| EN 1670 | 门窗五金耐腐蚀 0–5 级，按 EN ISO 9227 中性盐雾 |
| EN 1906 | 执手：使用类别、耐久（6/7 级）、耐腐蚀等 8 位代码 |
| EN 1935 | 单轴合页：使用类别、耐久、门重、防火、耐腐蚀等 8 位代码 |
| ISO 9227 / GB/T 10125-2021 / ASTM B117 | 人造气氛腐蚀：NSS、AASS、CASS 方法；不规定时长 |
| QB/T 3826-1999 | 轻工产品金属镀层中性盐雾试验方法 |
| ISO 1456 / ASTM B456 | 铜+镍+铬装饰电镀层按使用条件的厚度与要求 |
| ISO 3497 / ASTM B568 | X 射线荧光法测镀层厚度 |
| ISO 6509 | 黄铜抗脱锌测试 |
| ASTM B240 / B86 | 锌合金锭 / 锌合金压铸件 |
| ISTA 1A / 2A | 包装件运输测试 |

---

## 10. 来源

**已抓取并阅读：**
- https://nationallocksupply.com/blog/door-hardware-finishes-guide-bhma-codes-605630-and-us-equivalents/
- https://www.securityparts.com/commercial-door-hardware-finish-guide
- https://www.securityparts.com/ansi-bhma-door-hardware-standards-guide
- https://buildershardware.com/ANSI-BHMA-Standards/Hardware-Highlights/A15618-2020-Materials-and-Finishes
- https://buildershardware.com/Home-Sweet-Secure-Home/ansibhma-a1562-bored-preassembled-locks-and-latches
- https://dev-cs-schlage-commercial.allegion.com/content/dam/allegion-us-2/web-files/allegion/information-documents/Understanding_BHMA_Grading_and_Testing_009968.pdf
- https://www.tyman-international.com/focus/giesse-products-class-5/
- https://www.griffwerk.de/en/blog/surface-quality-of-door-handles/
- https://www.bwvalve.com/brass-raw-materials-detailed-classifications/
- https://nks.com/wp-content/uploads/201-Stainless-Steel.pdf
- https://hghouston.com/archive/technical-faq/corrosion/corrosion-properties-of-201-grade-stainless
- https://www.dynacast.com/metals/zinc
- https://ozarkdie.com/zinc-alloys-zamak-3-vs-zamak-5-vs-zamak-7-vs-za-8-selection-guide/
- https://www.ascott-analytical.com/test-standards/iso-9227/

**仅用到检索摘要（未能打开全文，相关数字已降级或标「待核实」）：**
- https://certificates.intratone.com/FPL00110_27-0001%20to%2027-9999_Corrosion%20Resistance_UK_.pdf（EN 1670 3 级 = 96 h）
- https://www.bossdoorcontrols.com/_files/ugd/c9eba6_de06f9bdc78a468298539df81b5abeb3.pdf（EN 1906 耐久等级）
- https://uk.sfs.com/knowledge-hub/sfs-talks/hinge-technology/single-axis（EN 1935）
- https://www.aalco.co.uk/datasheets/Aalco-Metals-Ltd_Stainless-Steel-201201L202204_97.pdf.ashx（200 系用途）
- https://sterc.org/pdf/p1196c.pdf 、 https://www.finishing.com/61/25.shtml（Baldwin 镍-钯底层 + ZrN）
- https://pfonline.com/articles/porosity-zinc-die-casts 、 https://www.finishing.com/461/45.shtml（锌压铸件电镀鼓泡）
- https://www.kippwerk.de/en/products/PRODUCT-LINES/Rustproof-stainless-steel/Tubular-handles-stainless-steel-with-investment-cast-grip-legs/Tubular-handles-stainless-steel-with-investment-cast-grip-legs-mounted-from-the-rear/p/agid.11669 、 https://patents.justia.com/patent/20080083092 、 https://assaabloy.com/ke/en/solutions/products/door-furniture/door-handles/lever-handles（实心/管式执手）
- https://ims.evidentscientific.com/en/insights/xrf-coating-method-thickness 、 https://www.qualitymag.com/articles/96866-how-to-measure-metal-coating-thickness-using-handheld-x-ray-fluorescence-analyzers（XRF 测厚与合金鉴别）
- https://lso-inc.com/standards/ista-standard-1a.md 、 https://lso-inc.com/standards/ista-standard-2a.md（ISTA）
- https://www.freilacke.com/coating-knowledge/e-coating/ 、 https://kluthe.com/magazin/en/?p=9655（电泳）
- https://www.chinesestandard.net/PDF_MS.aspx/GBT10125-2021（GB/T 10125）
- https://www.finishing.com/73/13.shtml（No.4 拉丝目数）
- https://eezee.sg/product/yale-assa-abloy-entrance-lockset-antique-copper-backset-60mm-vca5227-us11-548e0aec03（US11 仅零售商用法）

**内部资料：** `content/products/*.json`（616 条 HYDE 记录）、`docs/research/image-audit/verdicts.json`、上表 4 张产品照片。
