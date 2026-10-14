# 01 逃生推杠锁（Panic Exit Devices）

> 覆盖范围：`categoryPath` 以 `panic-exit-devices` 开头、站点含 HYDE 的 46 个型号（主类 34、外侧把手 exterior-trim 2、特殊应用 special-applications 6、防火门 fire-door 1、多点 multi-point 2、报警 alarmed 1）。
> 用途：写文案、审 AI/场景图、拍演示、答买家。数字只取自来源或我们的 JSON；没有出处的写「待核实」。
> **本文是知识，不是认证声明。** 我们的产品页不得写或暗示通过 EN 1125 / UL 305 / UL 10C / GB 30051 等任何认证。

---

## 1. 是什么、怎么工作

### 1.1 基本逻辑链

逃生推杠锁（exit device，又称 panic hardware / panic bar / crash bar）是装在门的**推开面（push side，即逃生方向一侧）**的横向操作件。人往逃生方向一推，锁舌就收回，门向外打开；不需要钥匙、不需要先识别把手。

通用链条：

```
人体推力 → 操作件（推杠 push bar / 触压条 touch bar）下压或转动
        → 连杆/凸轮（linkage / cam）在头部机箱（head / centre case）内转动
        → 锁舌收回（latch bolt retracts）  ← 单点（rim / mortise）
        → 同时拉动上下拉杆（vertical rods）收回天地锁舌  ← 多点（SVR / CVR）
        → 门打开；松手后弹簧复位，门关上时锁舌自动弹出（self-latching）
```

美国规范对操作件的要求：作用部分长度不小于门扇宽度的一半，向门开启方向用力即释放（Von Duprin 101；iDigHardware）。英国 DHF 指南对 EN 1125 推杠的建议是：取最大有效长度，**不得少于门扇宽度的 60%**。

### 1.2 两种操作件：推杠 vs 触压条

| 中文 | 英文 | EN 1125 第 9 位分类 | 外观与动作 | 我们的型号 |
|---|---|---|---|---|
| 横杆式推杠 | push bar / cross bar（美式叫法 crossbar） | Type A（push bar operation） | 一根圆管或扁管，两端由带摆臂的端座（end case / operating arm）支承；推杆绕端座转轴向门面摆动 | 300–313、316、320、330、308、309、306 PS |
| 触压条式 | touch bar / push pad | Type B（touch bar operation） | 一整条矩形铝型材机箱贴门安装，前部有一块可压下的触压板（touch pad） | 314、315（照片可见：矩形型材 + 头部机箱 + 锁舌） |

注意：EN 179 里的 Type B 是"推/拉板"（push or pull pad），EN 1125 里的 Type B 是"触压条"；同一个字母，标准不同含义不同（DHF）。

DHF 指南的一条安全规定直接影响产品形态：**Type A 推杠不得伸出两端支座之外**。所以英式"双门共用一根推杠"的老式 double panic bolt 不能符合标准；对开企口门（rebated pair）的合格做法是：**副扇装单独的竖向推杠天地栓，主扇装推杠锁舌**。

### 1.3 四种锁闭方式（按锁舌在哪里）

| 类型 | 英文 | 锁舌位置 | 工作方式 | 我们的对应 |
|---|---|---|---|---|
| 明装单点 | rim exit device | 头部机箱内，锁舌伸进**门框面上的明装锁扣（surface strike）** | 门锁边只在一点锁住 | 308-S、309-S、315、314、316-S、310、303、301 等 |
| 插芯单点 | mortise exit device | 插在门边里的**插芯锁体（mortise lock case）**，推杠通过方轴（follower/spindle）带动锁体 | 门边开槽装锁体，锁舌进门框上的扣板 | 307 + 072 锁体；311（套装含锁体）；313（中心距 72/92 mm，方轴 9 mm） |
| 明装竖杆 | surface vertical rod（SVR） | 拉杆明装在门面上，上锁舌进门头锁扣，下锁舌进地面锁扣 | 门的顶、底两点锁住；欧洲做法多为"天地栓"（top & bottom bolts） | 308-D、309-D、316-D、320（两点）、330（三点） |
| 暗装竖杆 | concealed vertical rod（CVR） | 拉杆藏在门扇内腔 | 外观只见推杠，上下锁点在门顶/门底端面 | 我们的 JSON 中**没有**明确的 CVR 型号 |

Von Duprin 还列出三点锁（rim + SVR：中部、顶部、底部同时锁）。我们的 330 写的是"3-point locking system"，属于这一类。

### 1.4 欧式天地栓的"顶部触发器"（top trip）

ASSA ABLOY 294 推杠天地栓说明书写明了一个关键机构：门开着时，**顶部触发器把上下栓杆保持在收回位置**；门关上、碰到门头锁扣后，触发器释放栓杆，上下同时弹入锁扣。没有这个机构，门开着时栓杆会伸出来刮地、刮门框。演示和审图时都要记住：**门开着时天地栓是缩回的**。

### 1.5 常开（dogging）

常开 = 把锁舌保持在收回状态，门变成推/拉门（Von Duprin 101）。方式：内六角常开（hex dogging, HD）、钥匙常开（cylinder dogging, CD）、电动常开（electric latch retraction）。

- **防火门上禁止机械常开。** 防火门必须每次关上都自动锁住（positive latching）。电动常开可以用，但火警时必须自动释放锁舌（Von Duprin 101；iDigHardware）。
- DHF：带常开/保持功能的逃生锁不能用于防火门，**除非**该五金和门本身都已在"不锁闭状态"下做过耐火试验。

### 1.6 外侧把手（outside trim / outside access device）

推杠锁本身只解决"从里出去"。从外面进来要配外侧件，装在**拉开面（pull side）**，通过方轴或尾杆穿过门去拨动推杠头部机构或锁体。

| 功能 | 英文 | 外面怎么开 | 我们的对应 |
|---|---|---|---|
| 仅出口 | exit only / no trim | 外面什么都没有，进不来 | 316-S/D 不含外把手（"Outside Lever = Optional"） |
| 假把手 | dummy trim | 固定拉手，不能开锁，只用于拉门 | — |
| 夜锁 | night latch | 钥匙收回锁舌 | — |
| 通道 | passage | 把手永远可开 | 023 PS |
| 教室 | classroom | 钥匙锁住/解开外把手 | 023 ET（"Entrance, keyed outside"）的具体行为待核实 |
| 储藏室 | storeroom | 钥匙临时放行，拔钥匙即恢复锁定 | — |
| 带钥匙的执手 | keyed lever | 钥匙控制执手 | 016、026、027、028、037、039、030、033、035、X2、001、9080E、015、023 ETAN |

功能定义见 Von Duprin 101 exit trim 页（classroom / storeroom / passage / dummy）。我们 JSON 里的外把手大多只写了"Key-operated locking/unlocking"，**没有写清是哪一种功能**，答买家时要先问清楚，不能套用上表。

### 1.7 插芯锁的"逃生功能"字母（欧洲）

欧式做法常把横杆推杠装在一个**逃生插芯锁（panic mortise lock）**上，例如我们的 307 + 072。这种锁的逃生方向不需要钥匙也能打开，即使已经上锁（Siegenia）。Siegenia 列出：
- **B（切换功能）**：反逃生方向须先用钥匙解锁，再用执手开；逃生后门一关，反方向又锁住。
- **D（通行功能）**：同样须钥匙解锁再用执手；逃生后门一关，反方向锁住。B 与 D 的区别来源未写清，待核实。
- **E（锁芯功能）**：反方向只能用钥匙开门。

我们 072 锁体有两个欧标锁芯孔、两个方轴孔（照片 `072-panic-exit-device-lock-case.webp`），JSON 未写它属于哪种功能，待核实。

### 1.8 我们卖的特殊变体

- **报警型（314）**：触压条机箱上有喇叭格栅和钥匙开关（照片 `314-alarm-panic-bar-exit-device.webp`）；报警模式下推杠即响。JSON 写"Optional … Dogging Function"，与"Fire Door"用途同时出现，见第 8 节标注。
- **冷库型（317）**：装在门内侧，从里一推即开，外把手可选；用于防止人员被困在冷库内。
- **通道推杠（306 PS）**：**本身没有锁舌**，要配单独的锁体；不是自锁逃生装置（JSON 原话）。拍照、文案都不能把它说成能自己锁门。
- **双门成套（306-D、308-D、309-D、316-D）**：带竖杆的门扇配合主扇使用。
- **"Pry Latch"（315）**：照片是标准的触压条明装单点锁（`315-pry-latch-2.webp`：机箱、锁舌、扣板、内六角扳手、螺钉、"EMERGENCY ONLY PUSH TO EXIT"贴纸）。JSON 说"anti-pry double latch"（防撬双锁舌），型号名与品类名不一致，见第 8 节。

美国专利文献描述的"防撬"原理：门关上时，辅助锁舌（auxiliary/dead latch）被锁扣压下，挡块随之进入锁舌后方，从外面撬锁舌会被顶住；只有推杠动作会先让开挡块再收回锁舌（Google Patents US4598939 等）。

---

## 2. 装在哪里、怎么装

### 2.1 门的类型和材料

- 适用：**单开平开门、对开平开门**，开启方向 = 逃生方向（向外开）。钢门、铝门、木门都有对应的安装方式（Schlage 672 说明书分铝门、空心钢门、木门的螺钉包）。
- 不适用：ASSA ABLOY 294 说明书写明**不建议装在空心芯门（hollow core door）**上；除非厂家专门设计，**不用于双向弹簧门（double action door）**。安装前要求门和框完好、不扭曲，门用三个合适的合页挂好、开关顺畅。
- EN 179 有少数产品可用于内开单门（DHF），EN 1125 推杠锁的应用代码只有"外开"（DHF 第 10 位：A 单/双门主副扇，B 仅单门，C 仅双门副扇）。
- 我们 JSON 写的门材：309-D/309-S"钢、铝或木门"，039"防火金属或木门"。

### 2.2 方向（handing）和推/拉面

- 推杠锁永远装在**推开面**。外把手永远在**拉开面**。
- 美式判定：站在门外，门朝你开，合页在左 = 左手反向（LHR），合页在右 = 右手反向（RHR）。外把手一般**不能现场换向**，除非说明书允许（Von Duprin exit trim）。
- 我们大多数推杠写"左右通用"（302、307、313、316、016 等），但外把手的方向仍要按门来选。
- 313 写"支持 DIN 左/右"。DIN 左右的判定视角待核实，不要在文案里自行解释。

### 2.3 安装高度

| 体系 | 数值 | 来源 |
|---|---|---|
| 欧洲（EN 1125 说明书） | 推杠距地 **900–1100 mm** | ASSA ABLOY 294 说明书 |
| 美国（IBC / NFPA 101） | **34–48 in（约 864–1219 mm）**；NFPA 101 对既有安装放宽到 30–48 in | iDigHardware 2026 |
| 具体产品示例 | Hager 4200：横向中心线距完成地面 **1000 mm** | Hager 说明书 |
| 具体产品示例 | Falcon 1590：设备中心线距门底 **40-9/16 in（约 1030 mm）**，尺寸以 1-3/4 in 门为准 | Falcon 说明书 |

ASSA ABLOY 294：推杠装在 1100 mm 时，门最大 2550 mm 高 × 1230 mm 宽；更高或更宽的门要换长栓管和长推杠。

### 2.4 长度和门宽

- 欧洲：推杠不得短于门扇宽度的 60%（DHF）。美国：不得短于门扇宽度的一半（Von Duprin、iDigHardware）。
- 截短：Hager 4200 推荐设备总长 = 洞口宽度 − 80 mm，用钢锯切、去毛刺，不要用砂轮打磨（会损伤表面）。Falcon 1590：切割长度 = 两组安装孔中心距 − 2-13/16 in，切前往管里塞布挡铁屑。ASSA 294：量两摆臂外侧尺寸减 8 mm 切推杠，在端头 12 mm 处钻 10 mm 孔装夹紧螺钉。
- 我们的长度（JSON）：300、303、310、311 为 900 mm；302、305 为 1040 mm；307 为 1000 mm；309-D 为 1110 mm；314 为 650/800/1000 mm；315 为 800/1000 mm；320、330 按客户要求。多数写"可调"。

### 2.5 门厚

- 美式设备的说明书尺寸以 **1-3/4 in（约 44 mm）** 门为准（Falcon）。
- 我们外把手 JSON：028、037 写 35–55 mm；039 写 45–50 mm；015 写最大 80 mm；X2 写最大 90 mm。026、027、028、037、039 写"方轴长度按门厚调整"；307 写"锁芯长度按门厚定制"。
- 下单时门厚必须作为必填项，否则方轴/锁芯长度会错。

### 2.6 门的加工（开孔、开槽）

| 部位 | 典型加工 | 来源/数值 |
|---|---|---|
| 推杠头部与端座 | 金属门：钻孔攻丝装机螺钉；木门：木螺钉或穿门对锁螺栓（sex bolt） | Falcon：#16 钻、12-24 攻丝；Hager：M5 机螺钉、M5×35 mm 对锁螺母（套管直径 7.5 mm）。Hager 提示按建筑和消防规范确认是否必须用对锁螺栓 |
| 门框锁扣（rim） | 先只钻锁扣外侧两孔，调好后再钻中间孔 | Hager |
| 外侧锁芯孔 | 门外侧开圆孔装锁芯 | Adams Rite P8800：门外侧开 1-1/4 in 孔；我们 001：锁芯开孔 Ø32 mm |
| 插芯锁体 | 门边开槽装锁体，门面开方轴孔和锁芯孔 | 我们 072：边距（backset）65 mm、中心距 72 mm、方轴 9×9×130 mm；313：中心距 72 或 92 mm，方轴 9 mm；320/330：方轴 8×8 或 9×9 mm |
| 天地栓门头锁扣 | 门头框开槽约 17 mm 深；或用明装锁扣免开槽 | ASSA 294 |
| 地面锁扣 | 开约 10 mm 深，让栓头完全进入；混凝土地面可明装 | ASSA 294 |
| 栓管截短 | 下栓管 = 实测尺寸 − 8 mm；上栓管 = 实测 − 56 mm（用明装锁扣时分别为 −23 mm、−71 mm） | ASSA 294（仅适用该型号） |

### 2.7 必须配什么

- **锁扣（strike / keep）**：rim 锁扣装在门框或中梃上；天地栓配门头锁扣和地面锁扣。我们 308-D、308-S、309-D、315 的成套照片都有锁扣。
- **中梃（mullion）**：对开门两扇都用 rim 推杠时，中间要一根可拆或固定中梃给两边锁舌提供锁扣。从业者普遍认为"rim × rim + 可拆中梃"比竖杆更好维护、锁得更可靠；中梃反复拆装会磨损固定点（iDigHardware 检索摘要）。
- **顺序器（coordinator）**：让副扇先关、主扇后关。需要的情况：副扇用自动插销、门有企口/盖缝条（astragal）、或副扇用单竖杆推杠。两扇都装推杠时通常不需要（iDigHardware）。
- **闭门器（closer）**：自锁的前提是门能自己关严。防火门必须自闭。
- **外把手 + 锁芯**：见 1.6。
- **标识**：ASSA 294 要求在推杠正上方贴绿色"Push Bar To Open"标识；我们 308-D 成套照片含该标识，315 含"EMERGENCY ONLY PUSH TO EXIT"贴纸。

### 2.8 常见安装错误

1. **竖杆调整不好**：上下锁点不能同时到位。iDigHardware 作者说这是他遇到的最大问题；CVR 尤其难调。
2. **给对开门额外加明装插销**来"修"竖杆问题：常见且不合规（iDigHardware）。
3. **加二次锁**：铁链、挂锁、门闩等任何附加锁都会让逃生锁失效（Construction Witness）。
4. **防火门装带机械常开的推杠**，或把普通推杠的常开拆掉就当防火推杠用。拆掉常开不会让它变成防火五金（iDigHardware 网络研讨会问答）。
5. **推杠太短**：低于门宽一半（美）或 60%（欧）。
6. **门不顺**：门扭曲、合页下垂、闭门器力度不够，锁舌进不了锁扣。
7. **用错螺钉**：替换成过长或过粗的螺钉；端盖损坏露出锋利边或内部零件，会伤人（Construction Witness）。
8. **装在推开面以外**，或装在内开门上。
9. **外把手方轴/锁芯长度与门厚不符**。
10. **切推杠时铁屑进机构**（Falcon 特别提醒）。

---

## 3. 场景和展示怎么做才对（审 AI 图规则）

### 3.1 必须成立

1. **推杠只出现在门的推开面**，门向推杠这一面的反方向打开。
2. **推开面的门框门挡（stop）压在门边外侧**。Falcon 说明书的推开面图上标注了"Face of stop"。普通明装合页的轴筒通常露在拉开面（行业通识，具体合页型式待核实）。
3. **高度**：推杠大约在腰到胸之间：欧洲 900–1100 mm，美国 34–48 in。不要凭感觉，按门上真实尺寸的比例画。
4. **水平**、两端同高；头部机箱（有锁舌的那端）在**锁边**，端盖/从动端在**合页边**。
5. **长度** ≥ 门宽一半（美）/ 60%（欧）。一根杠只管一扇门，不得跨过两扇门的接缝（DHF：Type A 推杠不得伸出端座）。
6. **rim 型**：锁边门框上能看到一个明装锁扣，和锁舌同高。对开门如果两扇都是 rim，中间必须有中梃。
7. **竖杆型**：拉杆垂直，靠锁边，上端进门头锁扣，下端进地面锁扣（或门底锁扣）。门开着时栓头是缩回的。
8. **插芯型（307 / 072 类）**：门边能看到锁体面板和锁舌；推杠锁边端座正对锁体方轴位置；锁芯在面板下方（照片 `307-panic-exit-device-5.webp` 可见面板上的欧标锁芯孔）。
9. **外把手**在拉开面，与推杠头部机构**同一高度、同一边**；执手方向与门的开向匹配。
10. **一种表面处理**：推杠、端座、外把手同色（例：红杆黑座就整套红黑）。外把手若单独卖的不锈钢款（001、9080E），只能与说明里能配的推杠同场出现。
11. 防火门场景：门上可有防火标牌（不要编造文字），**推杠上不能出现常开孔或常开钥匙**，门必须装闭门器。
12. 合理的伴随件：闭门器、出口标识、绿色"推杠开门"标识贴在推杠正上方。

### 3.2 正常状态下看不到的东西

- 门关着时**看不到锁舌**（藏在锁扣/锁体里），也看不到天地栓的栓头（在锁扣里）。
- 暗装竖杆（CVR）的拉杆**完全看不到**。
- 插芯锁体只露出门边面板，**锁体本身在门里**。
- 外把手与推杠之间的方轴、尾杆在门里，看不到。
- 报警型的电池、电路板在机箱里，看不到。

### 3.3 物理上不可能、一票否决

- 推杠装在拉开面，或装在内开门的推开面却画成向外开。
- 一根推杠横跨对开门两扇。
- 推杠装在合页边一端带锁舌。
- 竖杆歪斜、只有上杆没有门头锁扣、下杆插进地毯或木地板却没有地面锁扣。
- 推杠和门把手、圆球锁、插销同时锁着同一扇逃生门；门上有铁链或挂锁。
- 头部机箱与外侧锁芯不在同一侧（外侧锁芯在合页边）。
- 推杠高于肩或低于膝。
- 推杠短到只有门宽三分之一。
- 防火门上出现常开装置。
- 用在旋转门、推拉门、双向弹簧门上。
- 零件数和我们照片不一致：例如 308-S 只有两个端座 + 一根圆管，不能画成四个端座；314 喇叭格栅位置必须按照片。

---

## 4. 功能和使用

### 4.1 功能分类

| 功能 | 英文/标准名 | 说明 |
|---|---|---|
| 逃生推杠（公共场所） | Panic exit device，EN 1125 | 用户不熟悉门和五金、可能发生恐慌的地方必须用：公共建筑、娱乐场所、商店（DHF） |
| 紧急逃生（熟悉人员） | Emergency exit device，EN 179（执手或推/拉板） | 只用于人员熟悉出口、不预见恐慌的场合；有疑问时 DHF 建议用 EN 1125 |
| 逃生 + 防火 | Fire exit hardware（美：UL 305 + UL 10C） | 防火门上用，不能机械常开 |
| 普通逃生（美） | Panic hardware（UL 305） | 不能用于防火门，通常带常开 |
| 外侧功能 | exit only / dummy / night latch / passage / classroom / storeroom | 见 1.6 |
| 报警 | Alarmed exit device | 推即报警，防止日常随意使用（我们 314） |
| 通道 | Passage push bar | 无锁舌，只开门（我们 306 PS） |

**美国何时必须用逃生推杠**（iDigHardware 2026）：IBC/IFC 规定 A、E 类用途且人数 ≥ 50 人、H 类任何人数；NFPA 101 规定集会、教育、托儿用途 ≥ 100 人、高危场所 > 5 人。要求覆盖从房间到公共道路的整条疏散路线上带锁或锁舌的门。

### 4.2 日常使用

- 出：直接推杠，不需要任何先行动作。美国规范最大开锁力 15 lbf；ADA 对可操作部件要求 ≤ 5 lbf，两者冲突由当地主管机关决定（iDigHardware）。
- 进：用外把手/钥匙；仅出口的门从外面进不来。
- 常开：营业时间要求门不锁的地方可用（非防火门）。

### 4.3 维护

- ASSA ABLOY 294：**每周**检查推杠动作正常、栓头完全进入锁扣、锁扣无堵塞；**每三个月**检查所有紧固件。
- 说明书必须由安装方交给最终用户（ASSA 294）。
- 旧设备只要调整好、润滑好、固定牢，仍能通过检查（Construction Witness）。

### 4.4 典型故障

| 故障 | 原因 |
|---|---|
| 门关不上锁/锁不住 | 门下垂、闭门器力不够、锁扣位置偏、竖杆长度不对 |
| 推了不开 | 锁扣卡死、外加二次锁、门受压（防火门正压） |
| 天地栓刮地 | 顶部触发器失效，门开着时栓杆没被保持 |
| 对开门副扇关不上 | 没有顺序器或顺序器失调；顺序器触发片摩擦（iDigHardware） |
| 竖杆型上下点不同步 | 安装调整不当，CVR 最难调 |
| 外把手转动但不开锁 | 方轴长度不对、方轴未插入、换向错误 |
| 端盖脱落伤人 | 维护缺失，螺钉替换错误 |

---

## 5. 材料和工序

> 只写行业通识和我们 JSON 中写明的内容，不代表我们工厂的工艺流程。

### 5.1 各零件常见材料

| 零件 | 行业常见 | 我们 JSON 写的 |
|---|---|---|
| 推杠/触压条 | 铝合金挤压型材（Schlage 672：heavy-duty aluminum extrusion，表面阳极氧化或粉末喷涂）；钢管 | "iron bar"（几乎所有推杠）；303 写"内部材料 Iron" |
| 头部机箱/端座 | 压铸铝或压铸锌合金 | "Aluminum alloy body"；316 写主体铝合金 |
| 端盖 | 铸造金属端盖（Schlage 672："cast metal end caps"） | — |
| 锁舌 | 钢、不锈钢 | 316-S/D："Thickened Iron" 锁舌 |
| 锁体 | 钢板冲压外壳 + 内部钢件 | 072：铁 |
| 竖杆 | 钢管/钢棒 | 308-D、309-D 照片可见两根杆 |
| 外把手 | 锌合金压铸、不锈钢、铝、黄铜 | 016、026、027、039 锌合金；001、9080E 304 不锈钢；030、035 铝；X2 黄铜；033 碳钢；037 铁+不锈钢；015 ABS |
| 方轴 | 钢 | 016："Iron" 方轴 |
| 钥匙/锁芯 | 黄铜、锌合金 | 015、X2 黄铜钥匙 3 把；026 锌合金锁芯 + 镀镍黄铜钥匙 3 把；030 黄铜锁芯 + 黄铜钥匙 2 把；016 铁钥匙 |

### 5.2 工序（行业通识）

- **铝型材**：挤压 → 定长切割 → 冲孔/铣槽 → 阳极氧化或喷涂。
- **机箱/端座/外把手**：压铸（锌合金、铝合金） → 去浇口、去毛刺 → 抛光 → 电镀或喷涂/粉末喷涂。
- **内部件**：钢板冲压（连杆、底板、挡块）；锁舌可冲压、铸造或粉末冶金。
- **不锈钢执手/管**：管材弯曲、焊接、抛光；或精密铸造。
- **表面**：我们 JSON 出现的有喷涂（spray painting）、粉末喷涂/静电喷涂（powder-coated / static paint）、镀锌（zinc-plated）、镀铬、黑镍（BN）、缎面镍、仿古铜、亮铜、拉丝不锈钢（SS）。

### 5.3 装配和测试

- 装配：机箱内装凸轮、弹簧、锁舌、连杆 → 装推杠和端座 → 装配后手推测试回弹。
- 出厂检查点（行业通识）：
  1. 开锁力和回弹顺畅，松手后锁舌完全伸出；
  2. 锁舌伸出量和锁扣配合；
  3. 竖杆型上下栓同步，顶部触发器能保持；
  4. 推杠切割口无毛刺；
  5. 涂层附着力和盐雾（EN 1670 用中性盐雾，EN ISO 9227）；
  6. 外把手方轴与推杠头部插口配合、方向正确；
  7. 成套件数量与清单一致（锁扣、螺钉、扳手、标识、说明书）。
- 标准中的耐久试验：EN 1125 第 2 位 100 000 次（6 级）或 200 000 次（7 级）；ANSI/BHMA A156.3 1/2/3 级 500 000 / 250 000 / 100 000 次（Allegion）。

### 5.4 便宜货为什么坏

- 压铸件壁薄或气孔多，端座受冲击开裂。
- 回位弹簧材质差，几千次后疲软，锁舌伸不出 → 门不锁。
- 推杠管壁薄，人群推挤时弯曲。
- 涂层前处理不良，潮湿环境起泡生锈。
- 锁舌材质软或无防撬结构，容易被从外撬开。
- 塑料件替代金属件（我们 015 写 ABS、311 写 ABS + 铝），在防火或高频场景中强度和耐温需要另外确认（待核实）。
- 螺钉包不全或规格不对，导致现场代用。

---

## 6. 拆解

### 6.1 典型零件清单

| 编号 | 零件 | 英文 |
|---|---|---|
| 1 | 推杠或触压条 | push bar / touch bar |
| 2 | 头部机箱（主动端，含锁舌或拉杆接口） | head / centre case / operating unit |
| 3 | 从动端座/端盖 | end case / slave unit / end cap |
| 4 | 摆臂 | operating arm |
| 5 | 凸轮、连杆、回位弹簧 | cam, linkage, return spring |
| 6 | 锁舌（含防撬辅助舌） | latch bolt (with auxiliary latch) |
| 7 | 底板/安装板 | mounting plate |
| 8 | 锁扣/门头锁扣/地面锁扣 | strike / keep / floor keep |
| 9 | 竖杆、栓头、导向座 | vertical rods, bolt heads, rod guides |
| 10 | 顶部触发器 | top trip |
| 11 | 插芯锁体（插芯型） | mortise lock case |
| 12 | 方轴 | spindle / follower |
| 13 | 外把手、锁芯、钥匙 | outside trim, cylinder, keys |
| 14 | 盖帽、内六角扳手、螺钉包 | cover caps, hex key, screw pack |
| 15 | 标识贴、说明书 | "Push bar to open" sign, instructions |

### 6.2 我们照片能证明的

| 照片 | 显示的零件 | 对应型号 |
|---|---|---|
| `308-d-d-panic-exit-device-3.webp` | 圆管推杠 + 两端座（主动端带上下拉杆接口）、两根竖杆、两只栓头、多只锁扣/导向件、内六角扳手、螺钉、说明书、"Push bar to open"标识 | 308-D |
| `308-d-d-panic-exit-device-4.webp` | 端座打开：压铸壳体、扭簧、拨块、带方孔的转毂（安装板上）、上下拉杆接口；另一只为合上的状态 | 308-D |
| `308-s-s-panic-exit-device-3.webp` | 圆管推杠、两端座（一只带锁舌）、锁扣、盖帽、内六角扳手、螺钉 | 308-S |
| `309-d-double-door-panic-exit-device-3.webp` | 扁推杠、两根竖杆、两只带摆臂的操作端、两只栓头座、两只锁扣、螺钉 | 309-D |
| `316-d-panic-exit-device-3.webp` | 两端座背面：镀锌钢安装板，长孔 + 中心孔 + 固定孔 | 316-D |
| `072-panic-exit-device-lock-case.webp` | 插芯锁体：面板、锁舌、两个方轴孔、两个欧标锁芯孔 | 072（配 307） |
| `307-panic-exit-device-5.webp` | 圆管推杠、两端座，锁边端座下带面板和欧标锁芯孔 | 307 |
| `315-pry-latch-2.webp` | 触压条机箱、头部锁舌、明装锁扣、内六角扳手、螺钉、逃生贴纸、说明书 | 315 |
| `314-alarm-panic-bar-exit-device.webp` | 触压条机箱、喇叭格栅、钥匙开关、头部锁舌；头部圆钮用途待核实 | 314 |
| `320-two-point-locking-exit-device.webp` | 推杠、锁边端座带上下竖杆和栓头座 | 320 |
| `016-exterior-trim.webp` | 外执手、方形底座、执手内锁芯和钥匙 | 016 |
| `306-ps-panic-exit-device-3.webp` | 圆管推杠 + 两只扁平底座，无锁舌 | 306 PS |

---

## 7. 演示怎么拍

只拍真实动作，零件数和照片一致。

1. **全景定位**：外开钢门，推开面正对镜头，门挡在门边外侧，推杠在约 1 m 高，标识贴在推杠正上方。
2. **关门状态特写**：锁舌看不见，在锁扣里。
3. **推的动作**：手掌推杠 → 推杠摆动/压下 → 切到门边特写：锁舌收回 → 门打开。慢动作一遍、实速一遍。
4. **剖视动画（可选）**：只画照片 `308-d-d-panic-exit-device-4.webp` 能证明的零件，演示转毂转动 → 拉杆收回。照片没有的零件不画。
5. **松手复位**：门由闭门器关上，锁舌自动弹入锁扣。
6. **竖杆型**：从地面锁扣仰拍上推，展示上下栓同时收回；门开着时栓缩回（顶部触发器）。
7. **外侧进门**：切到拉开面，钥匙转动 → 外执手开锁 → 拉开门。
8. **报警型（314）**：钥匙打开报警 → 推杠 → 报警响（声音如实录制）。
9. **截短**：按说明书量尺寸、塞布、锯、去毛刺。
10. **成套开箱**：按 `308-d-d-panic-exit-device-3.webp` 的摆放清点零件。

不要拍：防火门上用常开；推杠装在拉开面；把 306 PS 演示成能自己锁门。

---

## 8. 我们站上的对应型号

| 型号 | slug | 一句话 |
|---|---|---|
| 300 | 300-panic-exit-device | 铝合金机体 + 铁推杠，900 mm 可调，红/黑；特征写"Mortise lock design"，单门 |
| 301 | 301-panic-exit-device | 单点，半长推杠，左右通用，外侧锁芯 + 3 把钥匙；起订 500 件 |
| 301-S | 301-s-s-panic-exit-device | 301 的 S 款，银色喷涂；无图库 |
| 302 | 302-panic-exit-device | 1040 mm，写"两点锁闭" + "半臂"机体；左右通用 |
| 302-S | 302-s-s-panic-exit-device | 302 的 S 款，1040 mm；无图库 |
| 303 | 303-panic-exit-device | 900 mm 全长推杠，单点，表面可选缎镍/铬/仿古铜/亮铜 |
| 305 | 305-fire-door-panic-exit-device | 防火门用单点推杠，1040 mm，带外执手和锁芯孔；起订 200 件 |
| 306-S | 306-s-panic-exit-device | 单门；尺寸未公布 |
| 306-D | 306-d-panic-exit-device | 双门；尺寸未公布 |
| 306 PS | 306-ps-panic-exit-device | 通道推杠，无锁舌，配单独锁体，**不自锁** |
| 307 | 307-panic-exit-device | 1000 mm，配 072 锁体，外执手 015 或 9080E，锁芯按门厚；起订 50 件 |
| 308-S | 308-s-s-panic-exit-device | 明装单门，两端座 + 推杠，不含锁体；按图纸确认尺寸 |
| 308-D | 308-d-d-panic-exit-device | 双门，带锁体和上下竖杆；按图纸确认尺寸 |
| 309-S | 309-s-s-panic-exit-device | 粉末喷涂，单扇/防火门用途 |
| 309-D | 309-d-double-door-panic-exit-device | 双门成套（主副扇），推杠 1110 mm |
| 310 | 310-panic-exit-device | 900 mm，单点，红/黑 |
| 311 | 311-panic-exit-device | 套装：推杠 + 锁体 + 黄铜锁芯 + 不锈钢执手，900 mm，中心距 72/92 mm；ABS + 铝 |
| 312 | 312-panic-exit-device | 规格下单前与工厂确认 |
| 313 | 313-panic-exit-device | 中心距 72/92 mm，方轴 9 mm；门高 ≤2520、宽 ≤1500 mm，−10~+60 °C，可接天地栓 |
| 314 | 314-alarm-panic-bar-exit-device | 内置报警，650/800/1000 mm，外侧钥匙，明装 |
| 315 | 315-pry-latch | 触压条明装逃生锁，800/1000 mm，防撬双锁舌，喷涂铁 |
| 316-S | 316-s-panic-exit-device | 单门明装，加厚铁锁舌，外执手另购，左右通用 |
| 316-D | 316-d-panic-exit-device | 双门，上下锁闭，明装，外执手另购 |
| 317 | 317-cold-room-push-bar-exit-device | 冷库门内侧推杠，外把手可选 |
| 320 | 320-two-point-locking-exit-device | 两点（上下）锁闭，欧式，方轴 8×8/9×9 |
| 330 | 330-panic-exit-device | 三点锁闭，欧式，方轴 8×8/9×9，单门 |
| 036 | 036-panic-exit-device | 写"Panic Exit Device"，规格 200×190 mm |
| SH01 | sh01-panic-exit-device | 规格下单前确认 |
| DDH001 | ddh001-panic-exit-device | 防火双门，尺寸 175×53×73 mm；无图库 |
| 072 | 072-panic-exit-device-lock-case | 307 的插芯锁体：边距 65、中心距 72、方轴 9×9×130 mm、两个欧标锁芯孔 |
| 001 | 001-panic-exit-device-trim | 304 不锈钢外把手，底板 300×75×1.5 mm，把手中心距 179 mm，锁芯孔 Ø32 |
| 015 | 015-panic-exit-device-trim | ABS 外把手，黑镍，门厚 ≤80 mm，3 把黄铜钥匙；307 的选项 |
| 016 | 016-exterior-trim | 锌合金外执手，钥匙在执手里，铁方轴，左右通用，黑色粉末喷涂 |
| 023 ET | 023-et-panic-exit-device-trim | 钢喷涂，外侧钥匙（Entrance） |
| 023 ETAN | 023-etan-anti-pick-panic-exit-device | 防技术开启外把手 |
| 023 PS | 023-ps-panic-exit-device-trim | 钢喷涂，通道功能 |
| 026 | 026-panic-exit-device-trim | 锌合金，圆底座 Ø65 mm，高 118、伸出 55 mm |
| 027 | 027-panic-exit-device-trim | 锌合金，执手 122 mm，底板 75×77.5 mm，方轴 60 mm |
| 028 | 028-panic-exit-device-trim | 锌合金 + 黄铜，门厚 35–55 mm |
| 030 | 030-panic-exit-device-trim | 铝合金，底板 178×52 mm，执手 140 mm，黄铜锁芯 + 2 钥匙 |
| 033 | 033-panic-exit-device-trim | 碳钢，带锁芯 |
| 035 | 035-panic-exit-device-trim | 铝，带锁芯，喷涂 |
| 037 | 037-panic-exit-device-trim | 铁 + 不锈钢，门厚 35–55 mm |
| 039 | 039-panic-exit-device-trim | 锌合金，门厚 45–50 mm，带黄铜锁芯 |
| 9080E | 9080e-panic-exit-device-trim | 304 不锈钢拉丝，配锁体和欧标锁芯；南美市场；307 的选项 |
| X2 | x2-panic-exit-device-trim | 黄铜，门厚 ≤90 mm，3 把黄铜钥匙；无图库 |

### 8.1 JSON 中看起来不一致的地方（只标注，不修改）

1. **313**："Max door weight: ≥200kg"。上限应该是 ≤，"≥"表示没有上限，待核实。
2. **314**："Fire Door" 用途与 "Optional … Dogging Function" 同时出现。防火门不能机械常开（Von Duprin、iDigHardware、DHF）。至少应说明常开版本不用于防火门。
3. **305、307**："Turn handle for locking/unlocking"。如果这个旋钮是机械常开或保持开启，就与防火门用途冲突（305 名称就是 Fire Door）。旋钮实际功能待核实。
4. **311**："Key-operated locking from both sides"。逃生方向任何时候都不能需要钥匙。需核实是指"两侧都有锁芯可操作外侧功能"，还是内侧也能锁死；后者不可作为逃生锁销售。
5. **315**：型号名 "Pry Latch"，但照片和规格都是触压条逃生推杠锁（"Push-to-Open Emergency Exit"）。品名与品类不一致。
6. **001**："304SS … with Plated"。304 不锈钢通常不需电镀，材料是 304 不锈钢还是电镀钢，待核实。
7. **072**：材料 "Iron"，表面却写 "SS"；摘要称 "fire-rated case"，属于认证性措辞，站上不应保留，除非有证书。
8. **303**：Application 写 "Building industry machinery"，与逃生门无关，疑似填错。
9. **036**：归为整套推杠锁，但规格（宽 200、高 190、"Bar section 4mm"、"Plate width 20mm"）更像外把手或配件，待核实。
10. **DDH001**：175×53×73 mm 作为"防火双门推杠锁"的尺寸过小，更像一个部件（端座或锁体），待核实。
11. **302**：写 "Two-point locking system"，规格却没有竖杆或天地栓，待核实。
12. **015**：ABS 外把手，且被列为 307（防火门用途）的执手选项。塑料件用于防火门需另行确认，待核实。
13. **027**：箱规 "37×29×41" 和体积 "0.044" 都没写单位；按数值推算应为 cm 和 m³，待核实后补单位。
14. **026**："Plate width 22mm" 与 "Rosette Diameter 65mm" 同时出现，含义不清。
15. **310**："Suitable for handed or non-handed installation" 表述含糊。
16. 分类：023 ET、023 PS 在主类，023 ETAN、016 在 exterior-trim 子类；301-S、302-S、308-S、309-S 在 special-applications，但它们只是单门版本。不是技术错误，但会让买家找不到。

---

## 9. 相关标准（只作知识）

> 再次强调：以下只介绍标准测什么。**我们的产品页面不得声称或暗示符合或通过任何一项。** DHF 也指出，"tested to …""designed to conform to …"这类措辞不足以表达符合性；没有证书就一个字都不写。

| 标准 | 地区 | 测什么 |
|---|---|---|
| EN 1125:2008 | 欧洲 | 水平杆操作的逃生推杠锁。10 位分类码：使用类别（仅 3 级）、耐久（6 级 100 000 次 / 7 级 200 000 次）、门重（5 级 ≤100 kg / 6 级 ≤200 kg / 7 级 >200 kg）、防火适用（0 / A 防烟 / B 防火防烟）、安全（仅 1 级）、耐腐蚀（3 高 / 4 很高）、安全性（仅 2 级；Union 写 100 N，其他来源不同，待核实）、凸出（1 级 ≤150 mm / 2 级 ≤100 mm）、类型（A 推杠 / B 触压条）、应用（A/B/C）。CE 标志需公告机构参与（DHF） |
| EN 179:2008 | 欧洲 | 执手或推/拉板操作的紧急出口装置，用于熟悉出口的人员；含内开单门 |
| EN 1634-1 | 欧洲 | 门组件耐火试验；EN 1125 防火 B 级以此为基础 |
| EN 1670 | 欧洲 | 建筑五金耐腐蚀分级，中性盐雾（EN ISO 9227）；各级小时数待核实 |
| UL 305 | 美国 | 逃生五金（panic hardware）；开锁力上限 15 lbf |
| UL 10C | 美国 | 门组件正压耐火试验；逃生五金另加此项才算防火逃生五金 |
| ANSI/BHMA A156.3 | 美国 | 逃生装置分级；循环 1/2/3 级 500 000 / 250 000 / 100 000 次（Allegion） |
| NFPA 101 / IBC / IFC | 美国 | 何时必须装逃生推杠、安装高度 34–48 in、长度 ≥ 门宽一半、开锁力 15 lbf |
| ADA | 美国 | 可操作部件 ≤5 lbf（与 15 lbf 存在冲突） |
| GB 30051-2013《推闩式逃生门锁通用技术要求》 | 中国 | 推闩式逃生门锁的结构、尺寸、灵活度等要求和试验方法；2026 年 4 月已有修订报批稿，涉及使用寿命和耐火要求，具体数值待核实 |

---

## 10. 来源

实际抓取阅读：
- Von Duprin 101 · Exit Devices：https://www.vonduprin.com/en/resources/training-education/von-duprin-101/exit-devices.html
- Von Duprin 101 · Exit Trim：https://www.vonduprin.com/en/resources/training-education/von-duprin-101/exit-trim.html
- iDigHardware · Panic hardware vs fire exit hardware：https://idighardware.com/2012/07/qa-panic-hardware-vs-fire-exit-hardware/
- iDigHardware · Which doors need panic hardware (2026)：https://idighardware.com/2026/01/decoded-which-doors-need-panic-hardware/
- iDigHardware · Door coordinators：https://idighardware.com/2021/01/qq-door-coordinators/
- DHF Best Practice Guide（EN 1125 / EN 179）：https://www.dhfonline.org.uk/media/documents/documents34a.pdf
- UNION · EN 1125：https://uniononline.co.uk/uk/en/help-support/standards-and-legislation/en-1125
- ASSA ABLOY 294 推杠天地栓安装说明：https://eshop.assaabloyopeningsolutions.com.au/media/B2BUserGuide/EXI294-SIL%20EXI285-SIL%20EXI284-SIL%20Instructions.pdf
- Falcon 1590 Touchbar Rim 安装说明：https://us.allegion.com/content/dam/allegion-us-2/web-documents-2/InstallInstructions/Falcon_1590_Touchbar_Rim_Exit_Device_Installation_Instructions_108145.pdf
- Hager 4200 Rim 安装说明：https://hagerco.com/Files/Images/Images/Instructions/I-ED01625.pdf
- Adams Rite P8800 Pullman Rim 安装说明：https://cdn11.bigcommerce.com/s-iqhkw55zf5/content/product-attachments/Adams%20Rite_P8800_Pullman_Rim_Installation_Instructions.pdf
- Allegion · Understanding BHMA Grading and Testing：https://dev-cs-schlage-commercial.allegion.com/content/dam/allegion-us-2/web-files/allegion/information-documents/Understanding_BHMA_Grading_and_Testing_009968.pdf
- Schlage 672 Touch Bar 数据表：https://commercial.schlage.com/content/dam/allegion-us-2/web-files/schlage/information-documents/Schlage_672_Touch_Bar_Data_Sheet_103909.pdf
- Siegenia · 逃生插芯锁：https://www.siegenia.com/gb/products/doorsystems/emergency-exit-and-panic-door-locks/mortise-door-locks
- Construction Witness · Door Panic Hardware basics：https://constructionwitness.com/Published-Articles/Doors-Door-Closers-Door-Hardware/DOOR-PANIC-HARDWARE-Getting-To-Know-the-Basics.aspx

仅来自检索摘要（未全文打开，相关结论已降级为「从业者观点」或「待核实」）：
- iDigHardware 关于中梃 vs 竖杆、LBR、竖杆调整的帖子：https://idighardware.com/?p=21898 、https://idighardware.com/2015/10/ff-follow-up/
- Allegion 知识库 · Von Duprin 可拆中梃：https://kc.allegion.com/kb/user-question/von-duprin-removable-mullion-maintenance
- 防撬辅助锁舌原理（专利）：https://patents.google.com/patent/US4598939
- GB 30051 修订报批稿（国家消防救援局）：https://www.119.gov.cn/images/zfxxgk/fdzdgknr/zqyj/2026/04/24/1776997055493009454.pdf

我们自己的数据：`content/products/*.json`（46 个型号）、`public/images/products/`（上表所列照片）、`docs/research/image-audit/verdicts.json`（照片类型判定）。
