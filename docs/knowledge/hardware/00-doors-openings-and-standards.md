# 00 门与门洞、开向、尺寸、疏散、防火与标准地图（地基章）

> 本章是整个五金知识库的地基。后面各品类章节（01 推杠、02 插芯锁与锁芯、03 球锁/筒锁/单头锁/外装锁、04 执手与拉手、07 材料工序……）都默认读者已经懂这里的术语、开向规则和高度。
> 用途：写文案、审 AI 图和场景图、规划演示视频、回答买家。
> 规矩：数字都来自第 10 节列出的来源或我们自己的产品 JSON；没能核实的写「待核实」。本章只讲行业知识，**不代表、也不暗示我们的任何产品已通过或符合任何标准**。

---

## 1. 门是什么、怎么工作：门型与各自的五金逻辑

一樘门（opening，门洞 + 门框 + 门扇 + 五金）的工作链条只有四件事：**挂住**（hanging：合页、地弹簧、天地轴）→ **关住**（closing：闭门器、地弹簧、自闭合页）→ **锁住/扣住**（securing：锁舌进锁扣）→ **操作**（operating：执手、推杠、拉手）。门型不同，这四件事由不同的五金完成。

### 1.1 常见门型

| 门型 | 中文常称 | 结构要点 | 典型五金组合 |
|---|---|---|---|
| 木门（timber / wood door） | 木门、实木复合门 | 实心或空心芯，门边可开槽装插芯锁或钻孔装筒锁 | 对接合页（butt hinge）+ 筒式锁/球锁（tubular / cylindrical lock）或插芯锁（mortise lock）+ 门吸/门挡 |
| 空心金属门 / 钢门（hollow metal / steel door） | 钢质门 | 两张钢板面板 + 加强件；美国按 SDI 分 Level 1–4，Level 1 门板 20 号钢、Level 2 为 18 号、Level 3 为 16 号、Level 4 为 14 号（Allegion、SDI 108） | 重型合页、插芯锁或推杠、闭门器；门内预焊合页加强板和锁加强板 |
| 防火门（fire door / fire-rated door assembly） | 防火门（中国分 A 隔热 / B 部分隔热 / C 非隔热，GB 12955-2008） | 防火等级属于**整樘门组件**（门扇+门框+五金+密封），不是单件五金 | 必须自闭（closer）+ 主动锁舌自动扣合（positive latching）+ 防火合页；双扇要顺序器（coordinator）。见第 6 节 |
| 铝合金窄边框门（aluminium narrow-stile door / storefront door） | 铝框玻璃门、窄边门、"KFC 门" | 门边型材窄，美国资料给的窄边约 2 in、中边 3-1/2 in、宽边 5 in（Locksmith Ledger，各厂不同） | 窄背距插芯锁（narrow-backset），美国常见背距 31/32 in、1-1/8 in、1-1/2 in；1-1/2 in 背距锁体宽约 2.25 in，装不进窄边（Locksmith Ledger）；常配地弹簧或偏心天地轴 |
| 无框玻璃门（frameless glass door） | 无框玻璃门、玻璃地弹门 | 只有钢化玻璃，没有门边型材，五金全部"夹"或"穿"在玻璃上 | 上下夹（patch fitting）+ 地弹簧（floor spring）或天地轴（top pivot）+ 穿玻璃拉手；ASSA ABLOY 一款下夹标 10–12 mm 玻璃、最大门重 80 kg、门宽 1100 mm |
| 双扇门，有中立柱（pair with mullion） | 对开门带中立柱 | 两扇之间有固定或可拆中立柱（removable mullion） | 每扇一套外装推杠（rim device）各自扣在中立柱上 |
| 双扇门，无中立柱（pair without mullion） | 对开门 | 两扇在中缝直接相碰，可能有盖缝条（astragal） | 天地杆推杠（vertical rod device），或一扇主动 + 一扇被动（被动扇用插销 flush bolt）；企口门要顺序器 |

**双扇门的两条行业经验**（idighardware 多篇）：外门对开时，**可拆中立柱 + 两套外装推杠**常被优先选用，因为天地杆需要严格的地面公差、易失调；而中立柱的问题是拆下运货后装回时螺钉越来越少、穿线困难。NFPA 80 要求疏散用的双扇门**不得有妨碍任一扇自由开启的盖缝条**。

### 1.2 我们的品类在各门型上的位置（依据我们 JSON 的 Application / Door thickness 字段）

| 门型 | 我们站上对应的品类（例） | JSON 里写的适用门厚或场景 |
|---|---|---|
| 木门 | 球锁/筒锁（575、587、592）、执手（3431、6491）、合页、门吸 | 大量型号写 `Door thickness = 35mm to 45mm adjustable`；部分 35–50 mm |
| 钢门 / 防火门 | 推杠（300、301、307、309-D、313、314、316-S/316-D）、外侧执手（001、016、023、039）、插芯锁体 | 多个推杠写 `Application = Fire door` 等（见第 8 节的提醒） |
| 铝合金窄边门 | 锁体 HY006、HY007、HY008、LC8520/8525/8530/8535、AR4-140 | 背距 20 / 25 / 30 / 35 mm |
| 无框玻璃门 | 玻璃门拉手 100–112 系列、玻璃门锁 F110–F132、上下夹、地弹簧 D-10xx、天地轴 | `10–12 mm glass doors`；F110 等写 `8-12mm` |
| 双扇门 | 309-D、316-D、320、DSL02、DC01/DC02、DDH001、天地插销 | `Double Door`、`Fire double door` |

---

## 2. 一樘门的解剖：每个部位叫什么

| 中文 | 英文 | 是什么 / 判图时看什么 |
|---|---|---|
| 门扇 | leaf / door slab | 会动的那块板 |
| 门框 | frame | 固定在墙洞里的框，由两根竖框 + 上框组成 |
| 竖框 | jamb | 分合页侧竖框（hinge jamb）和锁侧竖框（strike jamb / lock jamb）。锁扣（strike）装在锁侧竖框上 |
| 门挡（框上的挡条） | stop | 门框上凸起的一圈，关门时门扇靠在上面；决定门往哪边开 |
| 上框 | head | 门框顶部横料，闭门器本体或滑轨常装在这里 |
| 门槛 | sill / threshold | 地面上的横条，不是每樘门都有 |
| 合页边（铰链边） | hinge stile / hinge edge | 门扇装合页的那条竖边 |
| 锁边（开启边） | lock stile / lock edge / leading edge | 门扇装锁、锁舌伸出的那条竖边 |
| 中缝边 | meeting stile | 双扇门两扇相对的竖边，可有盖缝条 |
| 盖缝条 | astragal | 盖住双扇门中缝的条，常见于防火门、企口门 |
| 中立柱 | mullion | 双扇门中间的立柱，可固定或可拆 |
| 推面 / 拉面 | push side / pull side | 门背离你打开的一面是推面；朝你打开的一面是拉面 |
| 背距 | backset | 门边到锁芯/执手轴中心的距离 |
| 中心距 | centre distance | 欧标插芯锁执手方轴中心到锁芯中心的距离，常见 72 mm；管框门用 92 mm（DIN 18251 相关产品资料） |

---

## 3. 开向与手向（handing）：ANSI 与 EN/DIN 两套说法，以及怎么从照片判断推面/拉面

### 3.1 北美 ANSI/BHMA 的四种手向

idighardware「Handing 101」与 Allegion 的说法一致：**站在门的外侧（安全侧、有钥匙的一侧，key side）面对门**，看合页在哪边：

| 合页在你左手 | 合页在你右手 | |
|---|---|---|
| **LH**（left hand） | **RH**（right hand） | 门**背离你**打开（向里开） |
| **LHR**（left hand reverse） | **RHR**（right hand reverse） | 门**朝你**打开（向外开，又称反手 reverse） |

要点：
- 没有锁的门，想象安全侧在哪一边再判断。
- **逃生推杠一律是 LHR 或 RHR**，因为装推杠的门总是向外开（idighardware 原话 "always outswinging"）。
- 双扇门以**主动扇**（active leaf，装锁的那扇）定手向，写作 LHA / RHA / LHRA / RHRA；大多数为 RHA 或 RHRA。双向疏散的对开门（一扇向一边开）通常写 RH/RH，装推杠时为 LHR/LHR（idighardware）。
- 闭门器有自己的手向，不随门的开向走；双向（double-acting）闭门器不分手向（idighardware）。Allegion 知识库另说闭门器按调速阀所在的一侧定手向（来自搜索摘要，原页 403 未打开，**待核实**）。
- 筒式锁（cylindrical）两面开孔相同，一般不分手向（idighardware）。

### 3.2 欧洲：DIN 左/右，以及 BS EN / ISO 的 5 / 6

- **DIN 左 / DIN 右**（德国和北欧）：**站在拉面**（门朝你开的那一面）看合页，合页在左为 DIN 左，在右为 DIN 右（idighardware「Door Handing: International Methods」）。
- **BS EN / ISO 手向**：按门的**关门方向**分，顺时针关记作 5、逆时针关记作 6；对开门记作 5/6（同一文章）。从哪一面看来判断顺/逆时针，原文没有写明，**待核实**。
- **ANSI 与 DIN 的换算**（由上面两个定义推出，不是标准原文；下单前要和客户用"哪一面看、合页在哪边、往哪边开"三句话再确认一遍）：

| ANSI | 门往哪开（从外侧看） | 站在拉面看合页 | DIN |
|---|---|---|---|
| LH | 背离外侧（向里开），拉面在里侧 | 合页在右 | DIN 右 |
| RH | 向里开 | 合页在左 | DIN 左 |
| LHR | 朝外侧开，拉面就是外侧 | 合页在左 | DIN 左 |
| RHR | 朝外侧开 | 合页在右 | DIN 右 |

同一扇门，ANSI 叫 LH 而 DIN 叫"右"，这是买家下错单最常见的原因。最稳妥的写法是把**观察面、合页侧、开启方向**三件事都写出来，不只写缩写（idighardware 的建议）。

### 3.3 从一张照片判断推面还是拉面

| 线索 | 拉面（门朝你开）看到的 | 推面（门背离你开）看到的 | 依据 |
|---|---|---|---|
| 合页的管（knuckle / barrel） | **看得到**合页管凸出在门缝上 | 看不到合页管 | 门向哪边开，合页管就露在哪边；外开门的合页露在外面（Doorways Plus 关于外开门防卸销合页的说明） |
| 框上的门挡（stop） | 门挡被门扇挡在后面，门扇外表面在最外层 | 门挡一圈压在门扇外缘外面，门扇比门挡退后 | 门挡是挡住门、不让它继续往推面转的那条，所以在推面一侧（由门挡的作用推出） |
| 闭门器 | 本体装在门扇上、连杆垂直伸出到框上（标准臂 regular arm） | 本体装在门扇上、连杆贴着门面平行（平行臂 parallel arm）；或本体装在上框正面（门框安装 transom fixing） | Allegion UK 闭门器安装方式图：regular = 门扇装、拉面；parallel = 门扇装、推面；transom = 框装、推面；滑轨臂（slide arm）两面都可 |
| 推杠 | **不可能出现在拉面** | 推杠只在推面 | 推杠门总是外开（idighardware） |
| 外侧执手 / 拉手（exit trim / pull） | 推杠门的外侧执手、拉手在拉面 | 推板（push plate）在推面 | 推杠与外侧执手的关系见 01 章 |
| 斜舌的斜面 | — | 斜舌（latch bolt）的斜面朝关门方向，即朝门挡一侧 | 斜面要先碰锁扣才能被压回（由斜舌原理推出） |

再加一条 Schlage 安装指南的规则：**执手装好后，手柄末端指向合页侧**（Emtek 解释：这样不会撞到门框）。执手指向锁边，要么是装反，要么是该型号本身就是分左右手的弯形执手。

---

## 4. 典型门尺寸与五金安装高度（美国、欧洲、中国）

### 4.1 门的尺寸

| 地区 | 门扇 / 门洞尺寸 | 门厚 | 来源 |
|---|---|---|---|
| 美国（住宅） | 宽 24–36 in，高 80 in（2032 mm）；无障碍门要求开到 90° 时净宽至少 32 in，实际常用 36 in 门扇 | 室内门 1-3/8 in，外门 1-3/4 in | Doors.com 等零售资料；净宽 32 in 是 ADA 要求（同页转述） |
| 美国（商业钢门） | 常见 3'0" × 7'0"（36 × 84 in），以产品资料为例 | 1-3/4 in | Securityparts 示例门表；SDI 108 Level 3 为 1-3/4 in |
| 德国（DIN 18101 / DIN 18100，室内门） | 墙洞宽 885 mm 对应企口门扇 860 mm；墙洞高 2005 mm / 2130 mm 对应门扇高 1985 / 2110 mm；Baurichtmaß 为 12.5 cm 的倍数，宽度名义尺寸 = 设计尺寸 + 10 mm，高度 + 5 mm | 来源未给 | Westag 尺寸表、Baunetz Wissen。DIN 18101 不适用于外门、防火门和防盗门 |
| 中国 | 洞口尺寸系列见 GB/T 5824-2021《建筑门窗洞口尺寸系列》；家装资料常说门洞约 2100 × 900 mm、木门厚约 40–50 mm，均为商业网站说法，**不是规范条文，待核实** | 同左，待核实 | chinesestandard.net 条目；家装网站 |

我们的 JSON 给出的适用门厚可以和上表对照：筒锁/球锁/执手多为 35–45 mm（= 1-3/8 至 1-3/4 in），外装锁 35–55 mm（可定制 30–60 mm），门镜 35–55 mm 或 60–100 mm，玻璃门五金 8–12 mm 或 10–12 mm 玻璃，地弹簧要求门厚 ≥ 42 mm 或 ≥ 60 mm（视型号）。

### 4.2 五金安装高度

**美国**

| 项目 | 数值 | 来源 |
|---|---|---|
| 可操作五金（执手、拉手、锁、推杠）的规范范围 | 完成地面以上 34–48 in（864–1219 mm）；仅作安防用途、日常不操作的锁不受限；泳池门可到 54 in | IBC 1008.1.9.2（2009 版）、ADA 2010、ICC A117.1，见 Lori Greene「Mounting Heights for Door Hardware」 |
| 地方更严的例子 | 马萨诸塞州 36–48 in；加州 34–44 in | 同上；Allegion 知识库 |
| 门锁、锁闩、执手套装的锁扣中心 | 门框底部以上 38–42 in（965–1067 mm）。表中"外装/插芯推杠"一行与之并列，读作同一高度，**以 ANSI/SDI A250.8 原表核实** | ANSI/SDI A250.8 表 5（转载于同一文） |
| 圆柱/插芯单舌锁（deadlock）锁扣中心 | 48 in（1219 mm） | 同上 |
| 推板中心 | 45 in（1143 mm） | 同上 |
| 拉手握持中心 | 42 in（1067 mm）；DHI 也给 42 in | 同上 |
| 顶部合页 | 框的企口到合页中心不超过 11-3/4 in（298.5 mm） | 同上 |
| 底部合页 | 框底到合页中心不超过 13 in（330.2 mm） | 同上 |
| 中间合页 | 上下合页之间等分 | 同上 |
| 合页数量 | 一份项目规范：门高 60 in 以内 2 只，61–90 in 3 只；SDI：6'8"、1-3/8 in 非防火门可省中间合页 | 搜索摘要中的项目规范与 SDI 111；防火门合页数量各厂商说法不一，**待核实** |

**欧洲**

| 项目 | 数值 | 来源 |
|---|---|---|
| EN 1125 推杠横杆高度 | 门关闭锁好时，横杆离完成地面 900–1100 mm；使用者主要是幼儿时应考虑降低 | dormakaba PHA2580 安装说明（转述 EN 1125 的建议）；Safelincs 产品说明同样写 900–1100 mm |
| 推杠有效长度 | 应尽量做到最大有效长度；一份 DoP 写"杠长 X > 60 % Y"，Y 的定义原文未给 | 同上；Safelincs 说明写覆盖门宽 60 %（单个产品的说法） |
| 德国无障碍（DIN 18040） | 执手方轴中心离完成地面 850 mm；不宜用旋钮和凹槽拉手 | Baunetz Wissen DIN 18040-2 |
| 德国 DIN 18101 的执手高度 | 常听说 1050 mm，但本次没有找到能核实的来源，**待核实** | — |
| 英国（Approved Document M / BS 8300） | 零售与行业资料多写 900–1000 mm，也有写 800–1050 mm，各说不一，**以原文核实** | Ironmongery Direct、Glass Times 等二手资料 |

**中国**

| 项目 | 说明 |
|---|---|
| 无障碍门 | GB 50763-2012《无障碍设计规范》第 3.5 节"无障碍通道、门"有门把手、护门板、门槛的要求；GB 55019-2021《建筑与市政工程无障碍通用规范》2022-04-01 起施行，写明满足无障碍要求的门不应设挡块和门槛。具体高度数值本次未查到原文，**待核实** |
| 一般门锁高度 | 本次没有找到可引用的国家标准数值，**待核实**。不要在文案里写"国标规定执手高度 xx mm" |

> 判图时的实用口径：执手、推杠、拉手的中心落在**约 0.85–1.1 m** 都可以在上表里找到依据；明显低于 0.8 m 或高于 1.25 m 的，几乎一定是错的（例如审图记录里 072-panic-exit-device-lock-case-5 的执手离地约 1.5 m，被判过高）。

---

## 5. 疏散逻辑：出口门往哪开，推杠装在哪

### 5.1 开向

| 地区 | 规则 | 来源 |
|---|---|---|
| 美国 IBC 1010.1.2.1 | 服务人数 50 人及以上的房间或区域，平开门、枢轴门、平衡门须**朝疏散方向开**；"服务"包括沿疏散路线的后续门 | The Building Code Forum 引用 2015/2018 IBC 条文 |
| 美国 IBC 1010.2.9 | A 类（集会）及 E 类（教育）中服务 50 人及以上的房间，以及 H 类（高危）的平开门，凡带锁闩的须装**推杠（panic hardware）或防火推杠（fire exit hardware）**。E 类是否在列，论坛引文被截断，**按所用版本核实** | 同上 |
| 中国 GB 50016 | 民用建筑和厂房的疏散门应**向疏散方向开启**，应为平开门，不应用推拉门、卷帘门、吊门、转门和折叠门；例外：除甲、乙类生产房间外，人数不超过 60 人且每樘门平均疏散人数不超过 30 人的房间，开启方向不限；人员密集的公共场所，观众厅入场门和疏散出口不应设门槛，门内外 1.4 m 内不设台阶，疏散门应为**推闩式外开门** | 消防工程师备考资料对规范的转述，条文号未给，**以 GB 50016 原文核实** |
| 英国 | 地方议会的消防检查清单：房间超过 50 人，出口门应装推杠或推板式开启装置并向外开 | Northumberland County Council「Fire Safety Checks」 |

### 5.2 EN 1125 和 EN 179 怎么选

- **EN 1125（panic exit devices，推杠）**：用于公众使用、可能出现恐慌的门（学校、医院、剧场），用水平推杠（Type A push bar）或水平触杠（Type B touch bar）操作（Allegion UK）。
- **EN 179（emergency exit devices，紧急出口装置）**：用于熟悉出口和五金的使用者（办公室、小型公寓），用执手（Type A）或推板（Type B）操作；锁体、执手和锁扣必须作为一套一起测试（Allegion UK）。
- **EN 13637（电控逃生系统）**：门由电锁锁住、由电控释放时用它；系统至少包含请求释放的启动元件、电锁元件、控制元件，释放最多两个操作；如果电只是用于监控或外侧门禁，而开门仍是机械推杠或执手，则仍属 EN 1125 / EN 179；不适用于向内开的双扇门（ASSA ABLOY SN EN 13637 说明）。

### 5.3 推杠放在哪、和什么配

1. 只装在**推面**；门**向疏散方向（外）开**。
2. 横杆水平、在 900–1100 mm 高（EN 1125 建议值，见 4.2），尽量长。
3. 外侧需要进入时，在**拉面**同一位置装外侧执手或拉手（exit trim），否则外面是光板。
4. 单扇：外装推杠（rim）扣框上锁扣；插芯推杠（mortise）配门内锁体；天地杆推杠（vertical rod）扣上框和地面。
5. 双扇：有中立柱 → 两套外装推杠各扣中立柱；无中立柱 → 天地杆，或一扇天地杆一扇插芯 + 顺序器（idighardware 讨论的三小时防火对开门做法）。**两扇都用单点外装推杠、中间无立柱无天地杆**，锁舌没有地方扣合，不成立（审图记录 315-pry-latch-8 就是这个错）。
6. **推杠门不得另加锁具**：插销、挂锁、链条都不行。Exidor 产品说明的每月检查表要求确认"安装后没有加装额外锁具"；英国消防指引要求有人时出口通道和出口保持畅通（Regulatory Reform (Fire Safety) Order 2005 的转述）。
7. 标识：内侧 "Push bar to open" 加方向箭头，外侧 "Fire Exit Keep Clear"（Allegion UK）。
8. 维护：EN 1125 / EN 179 建议使用方每月检查一次，间隔不超过 1 个月（Allegion UK 引述）。

---

## 6. 防火门五金原则

防火等级来自**整樘门组件的火试**（美国 UL 10C、欧洲 EN 1634-1、中国 GB 12955 / GB/T 7633），不是某个零件"防火"就行。五金在其中的角色：

| 原则 | 具体要求 | 来源 |
|---|---|---|
| 主动锁舌，自动扣合（positive latching） | 防火门必须有主动锁舌，在火试全程（包括水枪冲击段）把门扇扣住；可用防火推杠、锁/闩，或其他列名为防火门组件的带锁舌五金 | NFPA 80 及其手册（idighardware / FCIA 转述） |
| 自闭（self-closing） | 闭门装置每次都要把门关上并扣住；闭门器要调到足以克服锁舌阻力；闭门装置不得有机械定门功能 | NFPA 80 6.4.1.4（idighardware 转述） |
| 不能机械定门（no mechanical dogging） | 防火推杠不能用钥匙或六角扳手把锁舌锁在缩回状态，因为那样门就不会自己扣上；电控定门可以，但火警时必须自动解除 | idighardware「panic hardware vs fire exit hardware」；Locksmith Ledger |
| 所有五金都要列名 | 防火门上每件五金都要有对应等级的列名；换上未列名的五金，整樘门就不再合规 | 五金厂商对 NFPA 80 的说明（Doorways Plus，二手） |
| 护门板 | 护门板上沿离门底超过 16 in（406 mm）时须为带标签产品 | idighardware「protection plates on fire doors」（引 NFPA 80） |
| 插销 | 双扇防火门用手动插销、搭配单舌锁，不算自动扣合；手动插销只在主管部门允许、且房间平时无人时才可用 | idighardware（引 NFPA 80 2007 版，**以现行版核实**） |
| 闭门器（欧洲） | EN 1154 规定闭门器尺寸 1、2 号不适合防火门；不得带定门装置，除非是接火警系统的电动定门（EN 1155）；调速阀须隐蔽或只能用工具调 | Allegion UK 闭门器分级指南 |
| 欧洲必需五金 | 英国 DHF / GAI《防火门与逃生门五金实施规范》第 5 版（2024-11）把合页/地弹簧枢轴、闭门装置、锁或锁闩、膨胀密封条和防烟条、推杠列为"必需五金" | GAI 页面、Designing Buildings |
| 中国 | GB 12955-2008 对防火锁（5.3.1）和防火合页（5.3.2）有具体性能要求；GB 12955-2024 已于 2024-10-28 发布、2026-05-01 实施，替代 2008 版，新增机械力学性能、烟密闭性能、抗喷水冲击性能等要求；征求意见稿说明还提到疏散通道防火门"联动信号接收与反馈功能"。GB 50016 规定常开防火门火灾时应能自行关闭并有信号反馈（厂商培训资料转述，**以原文核实**） | maigoo、chinesestandard.net、119.gov.cn 征求意见稿 |

美国还要分清两个词：**panic hardware** 只按 UL 305 测，用于非防火门；**fire exit hardware** 除 UL 305 外还要按 UL 10C 测，用于防火门（UL 305 说明原文要求"另需按 UL 10C 评估"）。

---

## 7. 五金表（hardware schedule）：一樘门的五金怎样被完整写出来

项目里的五金不是一件件买的，而是按**门表 → 五金组 → 钥匙系统**三张表定下来（Securityparts「How to Specify Commercial Door Hardware」，CSI MasterFormat 第 8 分部 08 71 00）：

1. **门表（door schedule）**，在建筑图纸上，每樘门一行：门号、楼层、尺寸、门的材料和钢板厚度、门框、防火等级、五金组号、玻璃、备注。例："Door 201 / 3'-0" x 7'-0" / HM 18 gauge / HM KD frame / 90-minute / HW-7"。
2. **五金组（hardware set / group）**，在说明书第 2 部分：每组一个编号、一个标题（门的用途、尺寸、材料、是否防火），下面逐行写**数量、名称、厂家型号、功能与等级、尺寸、表面代号**。同组号的门五金完全相同。表面写法如 "US26D (626)"，BHMA 表面代号体系。
3. **钥匙系统表（keying schedule）**：每樘门的锁功能、子钥、上级总钥；钥匙会议定下来之前不下锁芯订单。

一个五金组至少要回答下面这些问题（项目常见条目；以下是示意，不是任何项目的真实清单）：

| 位置 | 典型条目 | 写清楚什么 |
|---|---|---|
| 挂 | 合页 3 只（或地弹簧 / 天地轴） | 尺寸、是否滚珠、是否防卸销（外开门的合页在外侧，常要防卸销 NRP） |
| 锁 / 操作 | 锁或推杠 + 外侧执手 | 功能（见各品类章的 ANSI / EN 功能名）、背距、手向、门厚 |
| 锁芯 | 锁芯 | 型式（欧标 / 美标）、长度、钥匙系统 |
| 关 | 闭门器 | 尺寸等级（EN 1–7）、安装方式（标准臂/平行臂/框装）、是否带缓冲 |
| 停 | 门挡或门吸 | 落地还是墙装、位置 |
| 保护 | 护门板、推板 | 高度（防火门超过 16 in 要带标签） |
| 密封 | 密封条、门底条、门槛 | 防火门的膨胀条/防烟条 |
| 双扇 | 插销、顺序器、盖缝条、中立柱 | 是否允许（见第 5、6 节） |
| 标识 | 指示牌、"Push bar to open" | 逃生门必有 |

EN 1154 闭门器的尺寸按门宽和门重选（Allegion UK 表，"理论值"）：

| EN 尺寸 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|
| 最大门重 kg | 20 | 40 | 60 | 80 | 100 | 120 | 160 |
| 最大门宽 mm | 750 | 850 | 950 | 1100 | 1250 | 1400 | 1600 |

**对我们的意义**：买家问"能不能配齐一樘门"时，他心里是一张五金组。回答时按上表逐行确认（门型、门厚、手向、背距、防火与否、表面），比只报单件价格更显专业。

---

## 8. 场景和展示怎么做才对（判 AI 图与场景图的通用规则）

### 8.1 正常状态下看不见的东西

- **门关着时看不见锁舌**（斜舌、方舌都缩在锁扣里），也看不见锁扣内部。门开着时，锁边的锁舌和门框上的锁扣才同时可见。
- **插芯锁体在门扇里面**：外面只看到门边的面板（forend）、两面的执手底座和锁芯。画面里出现完整锁盒贴在门面上，只能是外装锁（rim lock）。
- **对接合页**（butt hinge）开槽装在门边与框之间：门关着时，只有拉面能看到合页管；合页的两片不会平摊在门面上（审图记录 6-3-3mm-brass-and-steel-hinges-5 就是把合页平贴在门面上，判不通过）。
- **地弹簧埋在地面以下**，只露盖板和转轴；**天地轴**只在门的转轴上下端露一点。
- **隐藏式天地杆**的杆在门扇内部，只露上下锁点。
- 推杠门从**拉面**看，只看到外侧执手或光板，看不到推杠。

### 8.2 物理上不可能、一出现就判错的情形

| 错误 | 为什么错 | 审图记录里的实例 |
|---|---|---|
| 推杠装在拉面（门朝观者开，推杠却在这一面） | 推杠门必须外开，推杠只在推面 | 316-s-panic-exit-device-7、330-panic-exit-device-7、036-panic-exit-device-4 |
| 推杠部件伸出门边之外 | 门背面的部件不可能出现在门边之外 | 016-exterior-trim-5 |
| 双扇两套单点外装推杠在中缝互扣，无中立柱、无天地杆 | 锁舌没有可扣合的锁扣 | 315-pry-latch-7、315-pry-latch-8 |
| 锁侧组件装在合页边 | 锁装在开启边，合页在对边 | 312-panic-exit-device-5 |
| 外装锁或夜闩锁的门框上没有锁扣盒 | 锁舌伸出去必须有锁扣 | 260-night-latch-and-rim-lock-3、5682-night-latch-and-rim-lock-2 |
| 浴室锁外侧画成钥匙孔 | 功能与型号不符：浴室锁一侧应急孔、一侧旋钮 | 587-mbbk-light-duty-cylindrical-lock-5 |
| 执手离地约 1.5 m | 超出各地规范范围 | 072-panic-exit-device-lock-case-5 |
| 同一画面混两种表面（如黄铜推杠配银色门框） | 一单一个表面 | 036-panic-exit-device-4、108-glass-door-handle-6 |
| 拉手长度超过门宽或明显大于规格 | 比例错 | 100-glass-door-handle-5 |
| 合页和锁在同一条边上 | 门开不了 | — |
| 标准臂闭门器的连杆从推面伸出 | 标准臂装在拉面；推面应为平行臂或框装 | — |
| 执手末端指向锁边（非分手向款） | 执手应指向合页侧 | — |
| 向内开的门装推杠 | 推杠门总是外开 | — |
| 出口门是推拉门、转门、卷帘门 | GB 50016 不允许 | — |

### 8.3 比例参照

- 用门的尺寸做比例尺：美国住宅门高 80 in（2032 mm），欧洲门扇高 1985 / 2110 mm，宽 860 mm 一档（第 4.1 节）。产品在画面里的大小要和它 JSON 里的尺寸对得上（推杠长度、面板长度、拉手长度）。
- 玻璃门五金只装在玻璃上；玻璃厚度看型号（10–12 mm 或 8–12 mm）。

---

## 9. 标准地图（只作知识，**不代表我们的任何产品已测试、认证或符合**）

### 9.1 欧洲 EN

| 标准 | 对象 | 测什么、怎么分级（关键数字） | 来源 |
|---|---|---|---|
| EN 1125 | 水平推杠/触杠逃生装置（公众、恐慌场合） | 逐位分级（各位含义如下）：使用类别 3；耐久 6 = 100,000 次、7 = 200,000 次；门重 5 ≤ 100 kg、6 ≤ 200 kg、7 > 200 kg；防火 0 / A（防烟）/ B（防火防烟，按 EN 1634）；安全 1；腐蚀 3 / 4（EN 1670）；安防 2（1000 N）；推杠凸出 1 ≤ 150 mm、2 ≤ 100 mm；操作型式 A 推杠 / B 触杠；适用门类 A 单双扇主被动均可、B 仅单扇、C 仅双扇被动扇 | Allegion UK 分级指南 |
| EN 179 | 执手或推板紧急出口装置（熟悉出口的人） | 与 EN 1125 同结构；安防 2 = 1000 N、3 = 2000 N、4 = 3000 N、5 = 5000 N；操作型式 A 执手 / B 推板；锁、执手、锁扣作为一套测试 | 同上 |
| EN 13637 | 电控逃生系统 | 启动、电锁、控制三元件；释放最多两个操作；可带延时；防火门适用性需另做火试 | ASSA ABLOY |
| EN 1906 | 执手和球形执手 | 8 位：使用类别（1–4）、耐久（如 6 = 100,000、7 = 200,000 次，按 EN 1906:2012 厂商摘要）、门重、防火、安全、腐蚀、安防、操作型式；2002 / 2010 / 2012 各版分级定义不同 | BSI 条目；dormakaba；Boss Door Controls 摘要 |
| EN 12209 | 机械锁、锁闩、锁扣板 | 11 位：使用类别 1–3、耐久（字母档，如 A = 50,000、C = 200,000 次）、门重与关门力（9 档）、防火 0 / 1、安防、适用门类、钥匙操作与锁定型式、方轴操作型式、钥匙识别；EN 12209:2024 已替代 2016 版 | Baunetz Wissen；EN 12209:2003 分级卡；斯洛伐克标准局 |
| EN 1303 | 锁芯 | 8 位：使用类别、耐久、门重、防火、安全、腐蚀、钥匙安全（1–6 级，最少有效钥匙数从 100 到 100,000）、抗攻击（2015 版 A–D，旧版 0–2）；NS-EN 1303:2026 改为 13 级钥匙安全、5 级抗攻击 | Union；Lockwiki；Standard Norge |
| EN 1935 | 单轴合页 | 8 位：使用类别 1–4；耐久 3 = 10,000 次（仅窗）、4 = 25,000 次、7 = 200,000 次；试验门重 0 档 10 kg 至 7 档 160 kg；防火 0 / 1；安全 1；腐蚀 0–4；安防 0 / 1；最后为合页等级（共 14 级，例 "4 7 6 0 1 3 0 13"） | SFS；某厂 DoP |
| EN 1154 | 受控关门装置（闭门器） | 6 位：使用类别 3（从至少 105° 关门）/ 4（从 180° 关门）；耐久 8 = 500,000 次；尺寸 1–7（见第 7 节表）；防火 0 / 1；安全 1；腐蚀 0–4 | Allegion UK |
| EN 1155 | 电动定门装置 | 断电时门必须可靠关闭；可定位或自由摆动 | Intertek |
| EN 1158 | 顺序器 | 保证双扇门（如企口中缝）按先后顺序关闭；不含 EN 1154 闭门器和 EN 1155 定门器本身 | Intertek |
| EN 1670 | 腐蚀分级（被上面多个标准引用） | 0 无要求、1 = 24 h、2 = 48 h、3 = 96 h、4 = 240 h；试验方法见原文 | Allegion UK |
| EN 1634-1 | 门组件耐火试验 | 上述各标准"防火"一位的依据 | Allegion UK、EN 12209 摘要 |
| DIN 18251 / 18101 | 德国插芯锁与门尺寸 | 18251：背距 55 mm、中心距 72 mm 的欧标锁（第 1 部分），92 mm 中心距管框门锁（第 2 部分），等级 1–5；18101：门扇、合页位、锁位尺寸 | stuv、GEZE、Baunetz Wissen |

### 9.2 美国 ANSI/BHMA 与 UL

| 标准 | 对象 | 测什么（循环次数为 Allegion 2013 年图表，Grade 1 / 2 / 3） |
|---|---|---|
| A156.1 | 合页 | 循环、侧向与竖向磨损、摩擦、强度、材料与尺寸；2,500,000 / 1,500,000 / 350,000 次 |
| A156.2 | 筒式（bored）锁与预装锁 | 尺寸、操作、强度、循环、安防、材料；1,000,000 / 400,000 / 200,000 次 |
| A156.3 | 逃生装置 | 500,000 / 250,000 / 100,000 次；一份厂商资料称 2014 年起 Grade 1 带预加载测试，**待核实** |
| A156.4 | 闭门器 | 2,000,000 / 1,000,000 / 500,000 次（不带缓冲） |
| A156.13 | 插芯锁 | 1,000,000 / 800,000 / 800,000 次；锁芯拉力 Grade 1 3600 lbf、Grade 3 1000 lbf |
| A156.5 / .6 / .7 / .8 / .16 / .17 / .18 | 辅助锁与锁芯 / 门饰件 / 合页模板尺寸 / 顶门器与定门器 / 辅助五金 / 自闭合页与枢轴 / 材料与表面 | 名称来自 Facilitiesnet 列表 |
| UL 10C | 门组件正压火试 | 整樘门装在试验墙上进炉；中性压力面在试件底部以上 40 in，之上为正压；火试后做水枪冲击 |
| UL 305 | 推杠（panic hardware）与防火推杠 | 耐久 100,000 次（每分钟最多 15 次）；释放力 ≤ 66 N，耐久前后各测一次；含固相线低于 538 °C 材料的产品在 204 °C 下放 7 小时；低温冲击；防火推杠另按 UL 10C |
| NFPA 80 | 防火门与开口保护的安装与维护 | 见第 6 节 |
| IBC / NFPA 101 / ADA | 建筑规范、生命安全规范、无障碍 | 开向、推杠要求、五金高度（第 4、5 节） |

ANSI/BHMA 的"Grade 1"必须和标准号一起说才有意义，不同标准的 Grade 1 次数不同（Allegion）。

### 9.3 中国 GB / 行业标准

| 标准 | 对象 | 已核实到的内容 |
|---|---|---|
| GB 30051-2013《推闩式逃生门锁通用技术要求》 | 推杠锁 | 现行；新版 GB 30051-202X 报批稿由国家消防救援局归口，为强制性国家标准，按使用功能、耐火性能、使用寿命可靠性分类，修改了外观、灵活度、开启性能、机械环境耐受性要求，增加试验用门要求 |
| GB 12955《防火门》 | 防火门（含防火锁、防火合页要求） | 2008 版分 A / B / C 类；2024 版 2026-05-01 实施（见第 6 节） |
| GB 21556-2008《锁具安全通用技术条件》 | 锁具通用安全 | 现行；条款内容本次未查到，**待核实** |
| GA/T 73-2015《机械防盗锁》 | 防盗锁 | 2015-03-01 实施，非等效采用 EN 12209:2003；消费类文章称锁芯分 A / B / C 级、C 级防技术开启 10 分钟以上（二手，**待核实**） |
| QB/T 2698-2024《闭门器》 | 闭门器 | 现行，替代 2013 版 |
| JG/T 125-2017《建筑门窗五金件 合页（铰链）》 | 合页 | 2017-07-01 实施 |
| GB/T 32223-2025《建筑门窗五金件 通用要求》 | 门窗五金通用 | 2025-04-25 发布、2025-11-01 实施，替代 2015 版 |
| GB 50016《建筑设计防火规范》 | 疏散门开向、防火门设置 | 见第 5、6 节 |
| GB/T 5824-2021、GB 50352-2019、GB 50763-2012、GB 55019-2021 | 洞口尺寸、民用建筑设计、无障碍 | 见第 4 节 |

**写文案的红线**：可以写"按 EN 1125 的思路设计的横杆高度范围是 900–1100 mm"这类知识，但**不可以**写或暗示"我们的产品通过 / 符合 / 认证 EN 1125、UL 305、GB 30051"等，除非将来客户拿出了对应的检测报告并明确授权使用。

---

## 10. 我们站上 JSON 里需要注意的地方（只标记，不改）

统计口径：`content/products/*.json` 中 `sites` 缺省或含 `hyde` 的记录，2026-10-14 读取。

| 型号 | JSON 写的 | 问题 |
|---|---|---|
| 314 Alarm Panic Bar | `Optional Function = External Lever Handle / Dogging Function`，同时 `Application = Fire Door, Exit Door…` | 防火推杠不能有机械定门（第 6 节）。若可选定门，只能用于非防火门，或改为电控定门；文案需分开写 |
| 001、016、023 ET/PS、028、030、039、309-D、313、316-S/D、9080E、DSL02、DC01、DDH001 等 | `Application = Fire door` / `Fire-rated double escape doors` / `Fireproof doors` / `For fire-rated metal or wood doors` | "适用于防火门"本身就是要靠整樘门火试（UL 10C / EN 1634-1 / GB 12955）才能成立的说法。没有报告时，文案只能写"常用于钢质门、防火门项目"一类描述，不能写成认证或列名 |
| 6*3*3mm（brass-and-steel-hinges） | `Size = 6*3*3mm（Customizable）` | 单位混写，按合页常见写法应为 6 in × 3 in × 3 mm，**待核实** |
| 301、301-S | `Suitable for both left a right-handed doors.` | 文字笔误（"a" 应为 "and"），交文案修 |
| HY-0SS Latch Guard | `Door Type = Outswing Doors` | 一致：外开门锁舌在外侧暴露，才需要护舌板（与 3.3 节的推/拉面逻辑相符），无问题，列出供参考 |

---

## 11. 判断一张安装图对不对的通用清单

拿到一张安装图、场景图或 AI 渲染图，按顺序问下面的问题。任何一项答"否"，图就不能用；涉及产品本身的，同时按 AGENTS.md 的规矩和该型号实拍图逐项对照。

**A. 门本身**
1. 门型对不对？木门、钢门、防火门、铝合金窄边门、无框玻璃门，和产品 JSON 的 Application / 门厚字段一致吗（第 1、4 节）？
2. 门的比例对吗？高约 2.0–2.1 m、宽约 0.8–0.9 m 一档（第 4.1 节），产品大小与它的公布尺寸相符吗？
3. 门框、门挡、合页、锁扣这些"门必须有的东西"在画面里合理存在吗？

**B. 开向和推/拉面**
4. 能判断这是推面还是拉面吗？看合页管、门挡、闭门器臂型（第 3.3 节），几条线索互相一致吗？
5. 合页在一条竖边，锁和执手在对面那条竖边吗？
6. 执手末端指向合页侧吗？
7. 闭门器：标准臂在拉面，平行臂或框装在推面吗？装在门的上部、合页一侧吗？

**C. 疏散与推杠**
8. 有推杠的门是向外（疏散方向）开、推杠在推面吗？
9. 推杠水平、离地约 0.9–1.1 m、接近满门宽吗？
10. 拉面是外侧执手或光板，而不是第二根推杠吗？
11. 双扇门：有中立柱（各扣中立柱）或有天地杆，而不是两套单点推杠在中缝互扣吗？
12. 推杠门上没有额外的插销、挂锁、链条吗？
13. 出口门不是推拉门、转门、卷帘门吗？

**D. 高度与位置**
14. 执手、锁、推杠、拉手中心在约 0.85–1.1 m 之间吗（第 4.2 节）？单舌锁可略高（美国推荐锁扣中心 48 in）。
15. 合页上下位置合理（离门顶、门底各一个，中间等分）吗？

**E. 看不见的东西没有被画出来**
16. 门关着时看不到锁舌吗？插芯锁体没有露在门面上吗？对接合页没有平贴在门面上吗？
17. 地弹簧只露盖板，没有整个机体摆在地面上吗？

**F. 功能与配套**
18. 锁的功能与型号相符吗？（浴室锁没有钥匙孔、通道锁没有锁芯等，见各品类章）
19. 外装锁、夜闩锁、推杠在门框上有对应的锁扣吗？
20. 防火门场景里没有木质插销、没有机械定门、没有塞门的楔子吗？

**G. 表面与搭配**
21. 一张图只有一种表面处理吗？
22. 画面里只有我们这一类小五金，没有混进重型工业产品吗？
23. 没有出现未经证实的认证标志或文字（CE、EN、UL、"Fire rated"、循环次数）吗？审图记录 309-d-double-door-panic-exit-device-6 就因此被判不通过。

**H. 最后一问**
24. 一个装门的师傅看这张图，会不会说"装错了"？一个买家能不能照着这张图下单、把同一件东西装上去？

---

## 12. 来源

开向与手向
- https://idighardware.com/2014/08/back-2-basics-handing-101/
- https://idighardware.com/2023/05/door-handing-international-methods/
- https://kc.allegion.com/kb/article/how-do-i-determine-the-hand-of-a-door （搜索摘要；原页 403）
- https://kc.allegion.com/kb/article/how-can-you-tell-the-hand-of-a-door-closer （搜索摘要；原页 403）
- https://us.allegion.com/content/dam/allegion-us-2/web-documents-2/InstallInstructions/Schlage_Lever_Locks_Door_Handing_Guide_108266.pdf
- https://www.emtek.com/blog/understanding-handing
- https://www.doorwaysplus.com/blog/our-blog-1/nrp-hinges-on-outswing-doors-when-and-why-non-removable-pins-matter-86

尺寸与高度
- https://idighardware.com/wp-content/uploads/2012/05/Decoded-Jul12-Mounting-Heights-for-Door-Hardware.pdf （Lori Greene，含 ANSI/SDI A250.8 表 5）
- https://kc.allegion.com/kb/article/is-there-a-recommended-mounting-height-range-for-door-hardware
- https://steeldoor.org/sdi-108/
- https://kc.allegion.com/kb/article/what-are-door-levels-and-models
- https://steeldoor.org/SDI-111
- https://www.doors.com/pages/standard-door-size
- https://www.westag.de/fileadmin/westag_getalit/tueren-und-zargen/profinet/6massegewichtenormen.pdf
- https://www.baunetzwissen.de/fenster-und-tueren/fachwissen/konstruktion-funktion/wandoeffnungen-und-tuergroessen-nach-din-18101-155227
- https://www.baunetzwissen.de/beschlaege/fachwissen/normen-im-detail/din-18040-2-barrierefreies-bauen--planungsgrundlagen-fuer-wohnungen-2421465
- https://www.ironmongerydirect.co.uk/blog/right-door-handle-height
- https://glasstimes.co.uk/featured-articles/ensuring-compliance-and-safety-in-care-homes/
- https://dormakaba-res.cloudinary.com/image/upload/v1745407253/dormakaba-prod/1653478814-057160-200226-pha2580-vb-pz-1flg-moun-instr-de-en.pdf
- https://www.safelincs.co.uk/templates_safelincs/files/datasheets/980_991-992-panic-latch-bolt-instructions.pdf
- https://www.chinesestandard.net/PDF.aspx/GBT5824-2021
- https://www.chinesestandard.net/PDF.aspx/GB50352-2019
- https://www.gongbiaoku.com/mobile/book/ith17166bef
- https://paper.people.com.cn/hwbwap/html/2022-04/13/content_25912451.htm

门型
- https://www.locksmithledger.com/door-hardware/article/12059560/narrowstile
- https://www.locksmithledger.com/article/10821547/an-overview-aluminum-stile-glass-storefront-doors
- https://www.assaabloy.com/vn/market-images/product-assets/assa-abloy/patch-fitting/assets/documents/Brochure%20-%20Patch%20Fitting.pdf
- https://idighardware.com/2009/07/astragals-with-vertical-rod-panics/
- https://idighardware.com/2021/11/qq-astragal-vs-egress-conflict/
- https://stuv.de/en_GB/steel-and-metal-engineering/mortise-locks/43/mortice-lock-according-to-din-18251-1-class-1-warded-lever-with-1-key-backset-55-mm-center-72-mm-forend-235-x-18-x-3-mm-square-din-right
- https://www.geze.com.cn/en/products-solutions/p_91464

疏散
- https://www.thebuildingcodeforum.com/forum/threads/assembly-occupancy-doors-along-egress-path.33460
- https://mm.edrawsoft.cn/template/94112
- https://www.northumberland.gov.uk/NorthumberlandCountyCouncil/media/About-the-Council/Staff%20Information/Health%20and%20safety/Policy%20Documents%20and%20Guidance/Section-3-Fire-Safety-Checks.pdf
- https://www.safelincs.co.uk/templates_safelincs/files/datasheets/3387_Exidor-200-and-300-Series-Counterpart-Leaflet.pdf
- https://www.assaabloy.com/ch/en/stories/blog/sn-en-13637

防火门
- https://idighardware.com/2025/12/fdai-inspection-criteria-9/
- https://idighardware.com/2009/04/protection-plates-on-fire-doors/
- https://idighardware.com/2012/07/qa-panic-hardware-vs-fire-exit-hardware/
- https://www.locksmithledger.com/door-hardware/article/10229686/an-overview-of-mechanical-exit-devices
- https://www.fcia.org/Portals/0/241007%20FCIA%20Fire%20Doors%20Have%20One%20Job.pdf
- https://www.doorwaysplus.com/blog/our-blog-1/why-a-passage-latchset-fails-the-fire-door-inspection-the-four-gaps-most-facilities-miss-524
- https://www.gai.org.uk/GAI/Knowledge/end-user-guides/Issue5-of-the-Code-of-Practice.aspx
- https://www.designingbuildings.co.uk/wiki/New_Code_of_Practice_for_fire_and_escape_door_hardware_published
- https://m.maigoo.com/news/726370.html
- https://www.chinesestandard.net/PDF.aspx/GB12955-2008
- https://www.119.gov.cn/images/qmxfgk/tzgg/2023/05/23/1684810129156027437.pdf
- https://www.jbufa.com/uploads/20220722/12c0a6cf44a9e5eff727762d99d91585.pdf

五金表
- https://www.securityparts.com/how-to-specify-commercial-door-hardware-division-8
- https://www.palmbeachschools.org:443/cms/lib/FL50010848/Centricity/Domain/388/08%2071%2000%20Door%20Hardware.pdf

标准
- https://www.allegion.co.uk/content/dam/allegionuk/Literature/M0172%20EN%20Classification%20and%20CE%20Guide%20Dec20.pdf
- https://knowledge.bsigroup.com/products/building-hardware-lever-handles-and-knob-furniture-requirements-and-test-methods
- https://www.bossdoorcontrols.com/_files/ugd/c9eba6_de06f9bdc78a468298539df81b5abeb3.pdf
- https://www.baunetzwissen.de/beschlaege/fachwissen/normen-im-detail/din-en-12209-mechanisch-betaetigte-schloesser-und-schliessbleche-150398
- https://eshop.klicovyservis.cz/_obchody/748.shop5.cz/soubory/classification-key-en12209_2003-mechanical-locks.pdf
- https://normy.normoff.gov.sk/norma/140096/?lang=en
- https://www.uniononline.co.uk/uk/en/help-support/standards-and-legislation/en-1303
- https://lockwiki.com/index.php/EN_1303
- https://online.standard.no/en/ns-en-1303-2026
- https://uk.sfs.com/knowledge-hub/sfs-talks/hinge-technology/single-axis
- https://disk.cpilot.cz/tkz-polna/2021/09/Declaration%20of%20performance%20-%20hinge%20%22H%22@AXwTWt1-BkvqoxmsMpPW.pdf
- https://intertek.com/building/standards/en-1155
- https://w3inte.intertek-france.com/building/standards/en-1158
- https://dev-cs-schlage-commercial.allegion.com/content/dam/allegion-us-2/web-files/allegion/information-documents/Understanding_BHMA_Grading_and_Testing_009968.pdf
- https://www.facilitiesnet.com/doorshardware/article/Doors-ANSIBHMA-Standards--18146
- https://intertek.com/building/standards/ul-10c
- https://uk.ul.com/news/emergency-exits-panic-hardware-and-ul-305-the-ongoing-story-of-testing-and-product-compliance/
- https://www.119.gov.cn/images/zfxxgk/fdzdgknr/zqyj/2026/04/24/1776997040131090875.pdf
- https://www.chinesestandard.net/Related.aspx/GB21556-2008
- https://www.chinesestandard.net/Related.aspx/GAT73-1994
- https://www.chinesestandard.net/Related.aspx/QBT2698-2013
- https://www.chinesestandard.net/PDF.aspx/JGT125-2017
- https://www.chinesestandard.net/Related.aspx/GBT32223-2025

本站内部
- `content/products/*.json`（HYDE 过滤，2026-10-14）
- `docs/research/image-audit/verdicts.json`（审图记录，第 8.2 节的实例）
- `public/images/products/314-alarm-panic-bar-exit-device-7.webp`、`316-s-panic-exit-device-7.webp`（已查看）
