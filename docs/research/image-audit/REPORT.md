# 全站产品图审计：实拍图与生成图

2026-10-14 · 由 `node scripts/audit-site-images.mjs` 生成，不要手改。逐张判定在 `docs/research/image-audit/verdicts.json`，全表在 `docs/research/image-audit/all-images.csv`。

范围：cantonlock.com（HYDE）616 个在售型号的主图和图库，加上站内所有展示产品的场景图、编辑图、合集图和尺寸线图，共 2806 张。RAYEN 站不在范围内。

## 一、总数

| 类型 | 产品页 | 其他页面 | 合计 |
|---|---:|---:|---:|
| 实拍照片 | 1262 | 127 | 1389 |
| 渲染图（3D/CG） | 193 | 17 | 210 |
| AI 生成 / 重渲染 | 505 | 31 | 536 |
| 实拍合成 | 37 | 42 | 79 |
| 尺寸图 / 线图 | 361 | 90 | 451 |
| 图文说明图 | 137 | 4 | 141 |

渲染、AI、合成、图文图，加上发现问题的尺寸线图，共 968 张逐张做了对照：

| 结论 | 张数 | 含义 |
|---|---:|---|
| 通过 | 519 | 和该型号实拍图逐项对得上 |
| 不通过 | 247 | 至少一项对不上，见第三节，建议下架或换实拍 |
| 无实拍可对照 | 202 | 这个型号站上没有一张实拍，只能和它自己的尺寸图、规格对照，见第四节 |

对照清单（甲方 10-13）：孔位和孔数、螺丝数量和位置、执手或推杠的轮廓和粗细、按公布尺寸核对比例、锁芯和钥匙孔的形状方向、零件数量（不多不少）、表面处理和颜色；场景图另看安装逻辑（门型、开启边、高度、推拉面、比例、单一表面）；图文图另看有没有未核实的认证说法。

## 二、不通过的原因分布

按问题描述的关键词粗分，一张图可能计入多类。

| 问题 | 张数 |
|---|---:|
| 同框混了两种以上表面 / 颜色不对 | 64 |
| 多出或缺少零件，拼了别的型号 | 52 |
| 外形、孔位、螺丝和实拍不一致 | 85 |
| 安装逻辑错（装错面、装错边、高度、门型） | 34 |
| 未核实的认证 / 性能说法 | 28 |
| 文字拼错、标注和规格不符 | 53 |

## 三、不通过（247 张）

| # | 图片 | 型号 / 位置 | 类型 | 问题 |
|---:|---|---|---|---|
| 2 | products/001-panic-exit-device-trim-2.webp | 001（图库第 1 张） | AI 生成 / 重渲染 | 产品过小模糊，6 个固定孔和 Ø32 锁芯孔都看不出；面板宽长比约 1:6，实物 75×300 为 1:4 |
| 10 | products/015-panic-exit-device-trim-5.webp | 015（图库第 4 张） | AI 生成 / 重渲染 | 门外侧（球形执手面）贴着 'FIRE EXIT - PUSH BAR TO OPEN'，但这一面没有推杠；黑色面板里装黄铜锁芯，一画面两种表面 |
| 16 | products/016-exterior-trim-3.webp | 016（图库第 2 张） | AI 生成 / 重渲染 | 执手是直板、末端无回勾（实拍为弧形带回勾）；底座近方形小块，实拍为 110×60 竖长底座、执手从底座下半部伸出 |
| 18 | products/016-exterior-trim-5.webp | 016（图库第 4 张） | 图文说明图 | 门扇右边缘外凸出一块黑色推杠端头（门背面的部件出现在门边之外，不可能）；'FOR FIRE DOORS' 和 FIRE SAFETY 图标属未经验证的防火声明 |
| 31 | products/023-etan-anti-pick-panic-exit-device-5.webp | 023 ETAN（图库第 4 张） | AI 生成 / 重渲染 | 门框上的锁扣是方块，实拍锁扣为一端加高的斜楔形 |
| 32 | products/023-etan-anti-pick-panic-exit-device-6.webp | 023 ETAN（图库第 5 张） | AI 生成 / 重渲染 | 执手圆座是黑色，实拍圆座为灰色镀锌铁；且与 023-PS-6 几乎同一张图，两个型号共用 |
| 37 | products/023-ps-panic-exit-device-trim-5.webp | 023 PS（图库第 4 张） | AI 生成 / 重渲染 | 执手末端是方头且带刻纹，实拍为圆头扁执手；锁盒下方多出一根黑色竖杆，实物没有 |
| 38 | products/023-ps-panic-exit-device-trim-6.webp | 023 PS（图库第 5 张） | AI 生成 / 重渲染 | 执手圆座是黑色，实拍圆座为灰色镀锌铁；与 023-ETAN-6 几乎同一张图 |
| 62 | products/030-panic-exit-device-trim-4.webp | 030（图库第 3 张） | AI 生成 / 重渲染 | 执手是直的圆截面棒，实拍执手为方截面、向上弧形 |
| 70 | products/033-panic-exit-device-trim-4.webp | 033（图库第 3 张） | AI 生成 / 重渲染 | 门上贴有 UL / CE 认证标签，属未经验证的认证声明（产品本身与实拍一致） |
| 81 | products/036-panic-exit-device-4.webp | 036（图库第 3 张） | AI 生成 / 重渲染 | 画面里看不到 036（U 形臂 + 白色滚轮），只有别的推杠；推杠是黄铜色、门框是银色，混色；门扇朝观察者开（这一面看得到合页和闭门器），推杠却装在这一面（拉面） |
| 87 | products/037-panic-exit-device-trim-6.webp | 037（图库第 5 张） | AI 生成 / 重渲染 | 告示牌印有 cUL/UL/CSA/CE/EN 1634 认证标志，属未经验证的声明；球锁圆座上印了 Hyland 标志，实拍没有 |
| 113 | products/072-panic-exit-device-lock-case-5.webp | 072（图库第 4 张） | AI 生成 / 重渲染 | 已装执手离地约 1.5 m，过高；工人手里的锁体模糊变形，看不出实拍的双欧标锁芯孔和导向孔 |
| 171 | products/19-130mm-glass-door-handle.webp | 19-130MM（主图） | 渲染图（3D/CG） | 底板只有 2 个固定孔（对角），尺寸图和实拍都是 4 个孔（上下各 2） |
| 172 | products/19-130mm-glass-door-handle-2.webp | 19-130MM（图库第 1 张） | AI 生成 / 重渲染 | 底板只见 2 颗螺丝，尺寸图和实拍为 4 个孔 |
| 180 | products/200-indicator-5.webp | 200（图库第 4 张） | AI 生成 / 重渲染 | 旋钮不以转轴为中心（转轴露在旋钮上沿，旋钮整体偏下），实拍旋钮以转轴居中 |
| 181 | products/200-indicator-6.webp | 200（图库第 5 张） | AI 生成 / 重渲染 | 同上，旋钮偏离转轴向下 |
| 183 | products/200-indicator-8.webp | 200（图库第 7 张） | 图文说明图 | 左侧两张插图沿用 200-5/-6 的场景图，旋钮偏离转轴；无认证声明 |
| 186 | products/260-night-latch-and-rim-lock-3.webp | 260（图库第 2 张） | AI 生成 / 重渲染 | 门开着，门框锁边上看不到锁扣盒（产品带锁扣，见实拍） |
| 194 | products/300-panic-exit-device-8.webp | 300（图库第 7 张） | AI 生成 / 重渲染 | 门左边缘这一面看得到合页轴，说明门朝观察者开（拉面），推杠和 PUSH TO OPEN 却装在这一面 |
| 221 | products/305-fire-door-panic-exit-device-7.webp | 305（图库第 6 张） | AI 生成 / 重渲染 | 推杠两端都是小支架，锁边缺少 305 的大锁盒；门上贴 CE 标签，属未经验证的认证声明 |
| 222 | products/305-fire-door-panic-exit-device-8.webp | 305（图库第 7 张） | AI 生成 / 重渲染 | 推杠两端都是小支架，锁边缺少 305 的大锁盒 |
| 229 | products/306-d-panic-exit-device-7.webp | 306-D（图库第 6 张） | AI 生成 / 重渲染 | 左扇朝观察者打开，门边看得到合页轴（拉面），两扇推杠却装在这一面 |
| 230 | products/306-d-panic-exit-device-8.webp | 306-D（图库第 7 张） | 图文说明图 | 'For Commercial & Fire Doors' 属未经验证的防火适用声明；产品本身与实拍一致 |
| 231 | products/306-d-panic-exit-device-9.webp | 306-D（图库第 8 张） | 图文说明图 | 有 CE 标志和防火图标，属未经验证的认证声明；产品本身与实拍一致 |
| 240 | products/306-ps-panic-exit-device-9.webp | 306 PS（图库第 8 张） | 图文说明图 | 左下角有 CE 标志和防火图标，属未经验证的认证声明 |
| 246 | products/306-s-panic-exit-device-6.webp | 306-S（图库第 5 张） | 图文说明图 | 门右边缘这一面看得到合页轴（拉面），推杠和 PUSH TO OPEN 却装在这一面 |
| 277 | products/309-d-double-door-panic-exit-device-6.webp | 309-D（图库第 5 张） | AI 生成 / 重渲染 | 有 CE、EN 1125、200.000 次、防火门图标，属未经验证的认证声明；合页侧端座画成小支架，渲染和尺寸图为大方座 |
| 278 | products/309-d-double-door-panic-exit-device-7.webp | 309-D（图库第 6 张） | 实拍合成 | 竖杆上有 2 个导向座，实拍配件和尺寸图都没有导向座 |
| 284 | products/309-s-s-panic-exit-device-6.webp | 309-S（图库第 5 张） | AI 生成 / 重渲染 | 推杆为细圆管、两端为小方块支座，实拍是梯形壳体加斜臂、宽黑推杆；门上标牌图标为生成乱码 |
| 297 | products/311-panic-exit-device-4.webp | 311（图库第 3 张） | 图文说明图 | 文字写“50cm Aluminum Tube”，规格表写 Bar Length 900mm |
| 300 | products/311-panic-exit-device-7.webp | 311（图库第 6 张） | AI 生成 / 重渲染 | 推杆是哑光白色，实拍是银色铝管；对开门两扇都装插芯单点推杠，副扇没有天地杆或插销固定，主扇锁舌没有地方扣合 |
| 302 | products/311-panic-exit-device-9.webp | 311（图库第 8 张） | AI 生成 / 重渲染 | 推杆是白色，实拍是银色铝管；右侧窄扇贴着“PUSH TO EXIT”，却没有装任何五金 |
| 308 | products/312-panic-exit-device-5.webp | 312（图库第 4 张） | AI 生成 / 重渲染 | 装反了：带长盖板的锁侧组件和门边锁体都在合页一侧，C 形钩端在开启边；该型号也没有实拍 |
| 312 | products/313-panic-exit-device-2.webp | 313（图库第 1 张） | AI 生成 / 重渲染 | 右端锁侧组件是短小支座，没有实拍和尺寸图中下延约 239mm 的盖板和锁芯孔 |
| 330 | products/315-pry-latch-5.webp | 315（图库第 4 张） | 图文说明图 | 右下角有 CE 标志和防火图标，属于未经核实的认证声明；标题写“带外部锁定执手”，图中和实拍都没有外部执手，只有内六角 dogging |
| 332 | products/315-pry-latch-7.webp | 315（图库第 6 张） | 图文说明图 | 主图推杠末端是八角形大支座，实拍 315 末端是平头端盖；双开门小图两扇单点推杠在中缝互扣，没有中立柱 |
| 333 | products/315-pry-latch-8.webp | 315（图库第 7 张） | AI 生成 / 重渲染 | 对开门两扇各装一套单点外装推杠，锁头在中缝相对，没有中立柱或天地杆，锁舌没有地方扣合；左侧墙面标识是乱码 |
| 339 | products/316-d-panic-exit-device-6.webp | 316-D（图库第 5 张） | AI 生成 / 重渲染 | 合页侧支座是细 C 形钩，实拍是宽 D 形壳体（63×151mm）；推杆画成扁薄条 |
| 348 | products/316-s-panic-exit-device-7.webp | 316-S（图库第 6 张） | AI 生成 / 重渲染 | 门扇朝观者方向打开，推杠装在拉的一侧；人从拉侧去“推”推杠，逻辑不成立 |
| 362 | products/320-two-point-locking-exit-device-7.webp | 320（图库第 6 张） | AI 生成 / 重渲染 | 中缝两个锁头是银色，实拍是黑色，一个画面里混用了两种表面 |
| 369 | products/330-panic-exit-device-6.webp | 330（图库第 5 张） | AI 生成 / 重渲染 | 天地杆导向座是银色，实拍配件是黑色；左扇没有装任何五金 |
| 370 | products/330-panic-exit-device-7.webp | 330（图库第 6 张） | AI 生成 / 重渲染 | 左图灰门朝观者方向打开，推杠和闭门器所在的一面是拉侧 |
| 391 | products/45bn-lock-cylinder-4.webp | 45BN（图库第 3 张） | 图文说明图 | 图中是双开锁芯，不是本款 45mm 半锁芯；“Stain Brass / Stain Nickel”拼错（应为 Satin）；铜色件标成“Antique brass”，Antique Brass 出现两次；Black Nickel、Satin Brass 不在规格的表面列表里 |
| 393 | products/45bn-lock-cylinder-6.webp | 45BN（图库第 5 张） | 图文说明图 | 画面是五舌插芯锁配双开锁芯，本款 45mm 半锁芯没有出现，容易误导 |
| 407 | products/54-dk-lock-cylinder-5.webp | 54 DK（图库第 4 张） | 图文说明图 | “Stain Brass / Stain Nickel”拼错（应为 Satin）；铜色件标成“Antique brass”，Antique Brass 出现两次；表面列表没有经过规格核实 |
| 429 | products/56-sn-lock-cylinder-5.webp | 56 SN（图库第 4 张） | 图文说明图 | “Stain Brass / Stain Nickel”拼错（应为 Satin）；铜色件标成“Antique brass”，Antique Brass 出现两次；规格只写了 Satin nickel |
| 452 | products/5682-night-latch-and-rim-lock-2.webp | 5682（图库第 1 张） | AI 生成 / 重渲染 | 锁舌伸出方向的门框上没有扣盒，实拍套装有带链条的扣盒；实拍锁体角上的小按钮没有出现 |
| 492 | products/578-snbk-light-duty-cylindrical-lock-6.webp | 578 SNBK（图库第 5 张） | AI 生成 / 重渲染 | 实拍没有展示内部机芯，图中的黄色机芯结构是想象出来的；外侧执手的应急孔画在颈部侧面，实拍 479 是执手端面的一字槽 |
| 501 | products/578-sset-light-duty-cylindrical-lock-2.webp | 578 SSET（图库第 1 张） | AI 生成 / 重渲染 | 门边画的是带两颗螺丝的方形锁舌面板，实拍 492、494 是没有面板的圆形打入式锁舌 |
| 528 | products/5831-90mm-chrome-tubular-lock-6.webp | 5831-90mm chrome（图库第 5 张） | AI 生成 / 重渲染 | 锁舌画成圆头，实拍是斜舌；锁舌面板上印着“HYLAND”字样，实拍面板是空白的 |
| 529 | products/5831-90mm-chrome-tubular-lock-7.webp | 5831-90mm chrome（图库第 6 张） | AI 生成 / 重渲染 | 背景桌上手册的 Hyland 标志和“Product Manual”文字是镜像乱码 |
| 567 | products/587-mbbk-light-duty-cylindrical-lock-5.webp | 587 MBBK（图库第 4 张） | AI 生成 / 重渲染 | 外侧球头中心为钥匙孔（锁芯），实拍 MBBK 为浴室锁：一侧应急孔/槽、一侧旋钮，无锁芯 |
| 575 | products/587-pbbk-light-duty-cylindrical-lock-2.webp | 587 PBBK（图库第 1 张） | AI 生成 / 重渲染 | 球头面上为钥匙孔（锁芯），实拍 PBBK 为浴室锁，外侧只有横向应急槽，无锁芯 |
| 604 | products/5870-acet-heavy-duty-cylindrical-lock-5.webp | 5870 ACET（图库第 4 张） | AI 生成 / 重渲染 | 锁舌面板仍为蓝色保护膜颜色装在门上，与红古铜执手同框两种颜色；安装状态应为同饰面面板 |
| 640 | products/592-sset-tubular-lock-3.webp | 592 SSET（图库第 2 张） | 图文说明图 | 标注 "Round Ball Door Knob"，但 592 为郁金香形执手；"Screws &Dust BoX" 大小写错误 |
| 675 | products/6-3-3mm-brass-and-steel-hinges-5.webp | 6*3*3mm（图库第 4 张） | AI 生成 / 重渲染 | 对接合页平贴在门扇与门框正面（明装、两页展平），实际应开槽装在门边与门框之间；防撬钉在此安装方式下不起作用 |
| 696 | products/6068-mortise-lever-handle-lock.webp | 6068（主图） | 渲染图（3D/CG） | 壳体孔位与实拍不符：实拍欧标锁芯孔下方另有带槽圆孔，渲染无；渲染两端伸出连杆/拨片，实拍无 |
| 715 | products/607-pbet-tubular-lock-6.webp | 607 PBET（图库第 5 张） | AI 生成 / 重渲染 | 场景执手与锁舌面板为哑光拉丝黄铜，实拍 PBET 为亮光镀金（PB） |
| 723 | products/607-spet-tubular-lock-8.webp | 607 SPET（图库第 7 张） | 图文说明图 | 标题拼写错误 "COMPLETE ACCESSOIRES"（应为 ACCESSORIES）；"Screws &Dust BoX" 大小写错误 |
| 760 | products/6491abet-lever-handle-6.webp | 6491ABET（图库第 5 张） | AI 生成 / 重渲染 | 执手为直的水滴形宽板，实拍/尺寸图为细长弯曲执手（长 108–119mm，末端上翘）；旋钮位置也不同 |
| 761 | products/6491abet-lever-handle-7.webp | 6491ABET（图库第 6 张） | AI 生成 / 重渲染 | 执手为直的水滴形宽板，实拍/尺寸图为细长弯曲执手（长 108–119mm，末端上翘） |
| 770 | products/65sn-lock-cylinder-5.webp | 65SN（图库第 4 张） | 图文说明图 | "Stain Brass/Stain Nickel" 拼写错误（应为 Satin）；铜色段标为 Antique brass，与另一 Antique Brass 重复；Satin Brass、Satin Nickel、Black Nickel 不在规格饰面清单（PB/CP/SS/SC/AB/AC） |
| 771 | products/65sn-lock-cylinder-6.webp | 65SN（图库第 5 张） | 图文说明图 | 列出 Offset Cylinder、Computer keyhole、Privacy/Entrance Cylinder 等功能，65SN 规格与实拍均未体现；图内铜色、黑色锁芯与本型号 SN 饰面不同 |
| 816 | products/70610-ab-grip-handle-set-4.webp | 70610 AB（图库第 3 张） | AI 生成 / 重渲染 | 门边斜舌与方舌面板为银色，实拍 #806/#807 面板、扣板为青古铜，同框两种饰面 |
| 817 | products/70610-ab-grip-handle-set-5.webp | 70610 AB（图库第 4 张） | AI 生成 / 重渲染 | 门边斜舌与方舌面板为银色，实拍 #806/#807 面板、扣板为青古铜，同框两种饰面 |
| 824 | products/70610-sc-grip-handle-set-4.webp | 70610 SC（图库第 3 张） | 图文说明图 | 文案写“门框高度 212mm”，尺寸图 818 中 212mm 是拉手上下安装孔距，说法错误；产品部件与实拍一致，无认证声明 |
| 833 | products/70710-pb-grip-handle-set-3.webp | 70710 PB（图库第 2 张） | AI 生成 / 重渲染 | 室内侧下方应为球形执手（见 823/827），图中为扁平圆片带锁孔状缝，执手缺失；上方旋钮细节糊化 |
| 836 | products/70710-sn-grip-handle-set-3.webp | 70710 SN（图库第 2 张） | AI 生成 / 重渲染 | 外侧单头锁看不到钥匙孔，中心为凸起圆头，与 826/827 外侧带锁芯不符；细节糊化 |
| 837 | products/70710-sn-grip-handle-set-4.webp | 70710 SN（图库第 3 张） | AI 生成 / 重渲染 | 室内侧拇指旋钮被画成钥匙孔状图形，与 826 拇指旋钮不符 |
| 841 | products/70720-pb-grip-handle-set-4.webp | 70720 PB（图库第 3 张） | AI 生成 / 重渲染 | 室内侧下方为带钥匙孔的扁圆盘，非 830/831 的球形执手，执手缺失 |
| 844 | products/70720-sm-grip-handle-set-3.webp | 70720 SM（图库第 2 张） | AI 生成 / 重渲染 | 室内侧下方为带钥匙孔的圆盘，非 834/837 的球形执手，执手缺失 |
| 854 | products/70750-pb-grip-handle-set-2.webp | 70750 PB（图库第 1 张） | AI 生成 / 重渲染 | 外侧单头锁为圆形底座，本型号渲染 845 为竖向椭圆长底座；五金过小，其余无法核对 |
| 855 | products/70750-pb-grip-handle-set-3.webp | 70750 PB（图库第 2 张） | AI 生成 / 重渲染 | 拇指旋钮被画成十字/钥匙孔状异形，与 845 圆座拇指旋钮不符；画面左上有矩形拼接痕 |
| 856 | products/70750-pb-grip-handle-set-4.webp | 70750 PB（图库第 3 张） | 渲染图（3D/CG） | 饰面为黑色，与型号 PB（抛光金）不符；拉手上下座与单头锁造型也与 845 不同（无环纹、底座形状不同） |
| 862 | products/70900-mbbk-grip-handle-set-2.webp | 70900 MBBK（图库第 1 张） | AI 生成 / 重渲染 | 入户把手套装装在通向浴室（玻璃隔断、浴缸）的室内门上，门型不对；五金本身与实拍一致 |
| 863 | products/70900-mbbk-grip-handle-set-3.webp | 70900 MBBK（图库第 2 张） | AI 生成 / 重渲染 | 入户把手套装（单头锁+执手）装在浴室门上，门型不对 |
| 878 | products/70anti-theft-lock-cylinder-5.webp | 70ANTI-THEFT（图库第 4 张） | 图文说明图 | 文字拼写错误：“Stain Brass / Stain Nickel”应为 Satin；为多饰面选项图，无认证声明 |
| 881 | products/70anti-theft-lock-cylinder-8.webp | 70ANTI-THEFT（图库第 7 张） | 图文说明图 | 图中带 4 个方舌的插芯锁体和 5 款执手不是本型号部件，实拍中没有，属拼配展示 |
| 888 | products/70bk-lock-cylinder-5.webp | 70BK（图库第 4 张） | 图文说明图 | 文字拼写错误：“Stain Brass / Stain Nickel”应为 Satin；为多饰面选项图，无认证声明 |
| 893 | products/70mb-lock-cylinder-4.webp | 70MB（图库第 3 张） | 图文说明图 | 文字拼写错误：“Stain Brass / Stain Nickel”应为 Satin；为多饰面选项图，无认证声明 |
| 900 | products/70pb-anti-theft-lock-cylinder-6.webp | 70PB ANTI-THEFT（图库第 5 张） | 图文说明图 | 文字拼写错误：“Stain Brass / Stain Nickel”应为 Satin；为多饰面选项图，无认证声明 |
| 912 | products/70sn-lock-cylinder-7.webp | 70SN（图库第 6 张） | 图文说明图 | 文字拼写错误：“Stain Brass / Stain Nickel”应为 Satin；为多饰面选项图，无认证声明 |
| 924 | products/70sn-lock-cylinder-21.webp | 70SN（图库第 18 张） | 图文说明图 | 图中带 4 个方舌的插芯锁体和 5 款执手不是本型号部件，实拍中没有，属拼配展示 |
| 949 | products/80-sndk-cp-lock-cylinder-5.webp | 80 SNDK CP（图库第 4 张） | AI 生成 / 重渲染 | 插入的是普通齿形钥匙，实拍 937 为电脑（凹点）钥匙；钥匙柄上有 Hyland 字样、锁芯外的长条面板均为图中臆造部件 |
| 955 | products/803-pbet-lever-handle-3.webp | 803 PBET（图库第 2 张） | AI 生成 / 重渲染 | 执手杆缺失：钥匙插在圆柱颈部，没有执手 |
| 970 | products/808-abet-lever-handle-6.webp | 808 ABET（图库第 5 张） | AI 生成 / 重渲染 | 执手杆缺失：钥匙插在圆柱颈部，没有执手 |
| 990 | products/80sn-lock-cylinder-5.webp | 80SN（图库第 4 张） | 图文说明图 | 文字拼写错误：“Stain Brass / Stain Nickel”应为 Satin；为多饰面选项图，无认证声明 |
| 1014 | products/819-pbet-lever-handle-2.webp | 819 PBET（图库第 1 张） | AI 生成 / 重渲染 | 执手杆缺失：钥匙插在圆柱颈部，没有执手 |
| 1028 | products/853-snbk-lever-handle-4.webp | 853 SNBK（图库第 3 张） | 图文说明图 | 图中执手为细长渐尖杆，实拍 1017/1021 为等宽方形直杆；上方外侧还带钥匙锁芯，与本浴室款不符 |
| 1068 | products/881-ss-sliding-hook-lock-5.webp | 881 SS（图库第 4 张） | AI 生成 / 重渲染 | 面板上下颠倒：钥匙孔画在扣手槽下方，实拍 1056/1058 锁芯在扣手槽上方 |
| 1069 | products/881-ss-sliding-hook-lock-6.webp | 881 SS（图库第 5 张） | AI 生成 / 重渲染 | 面板上下颠倒：旋钮画在扣手槽下方，实拍 1056/1058 旋钮在扣手槽上方 |
| 1087 | products/8827-lever-handle-3.webp | 8827 SSET（图库第 2 张） | AI 生成 / 重渲染 | 圆座上多出 Hyland 字样，实拍 1077 圆座无字 |
| 1100 | products-hyde/8829-bl-lever-handle-8.webp | 8829 BL（图库第 7 张） | AI 生成 / 重渲染 | 盖板画成从执手末端铰接翻起，实拍为可整块取下的独立盖板；实拍盖板内面为不锈钢衬板带 3 个孔，图中盖板内面为黑色无孔 |
| 1112 | products/90-sndk-lock-cylinder-3.webp | 90 SNDK（图库第 2 张） | 实拍合成 | 同一画面拼入另外 3 款锁芯（银色带旋钮、黄铜带旋钮、黑色带旋钮），混合三种表面，只有右下一款是本型号 90 SNDK |
| 1160 | products/9007e-stainless-steel-handle-5.webp | 9007E（图库第 4 张） | 渲染图（3D/CG） | 画面加了四舌锁体、锁芯和钥匙，实拍套件里只有执手、底座、锁孔盖和螺丝，锁体没法核对 |
| 1195 | products/9014-ssbk-stainless-steel-handle-4.webp | 9014 SSBK（图库第 3 张） | 渲染图（3D/CG） | 画面加了四舌锁体、锁芯和钥匙，实拍套件只有执手、固定拉手、4 个锁孔盖和螺丝；规格写浴室隐私功能（内侧旋钮），图中却是钥匙锁芯 |
| 1196 | products/9014-ssbk-stainless-steel-handle-5.webp | 9014 SSBK（图库第 4 张） | 渲染图（3D/CG） | 同上：加了四舌锁体、锁芯和钥匙，实拍套件中没有；与规格的隐私功能矛盾 |
| 1203 | products/9014-sset-stainless-steel-handle-4.webp | 9014 SSET（图库第 3 张） | 渲染图（3D/CG） | 画面加了四舌锁体、锁芯和钥匙，实拍套件只有两只执手、4 个锁孔盖和螺丝 |
| 1204 | products/9014-sset-stainless-steel-handle-5.webp | 9014 SSET（图库第 4 张） | 渲染图（3D/CG） | 实拍是执手对执手，本图一侧画成圆形固定拉手；另外加了四舌锁体和锁芯 |
| 1205 | products/9014-sset-stainless-steel-handle-6.webp | 9014 SSET（图库第 5 张） | 图文说明图 | 主体是四舌锁体，另外拼了 5 款不同执手和 2 款锁芯，多数不是本型号；锁体在实拍中没有出现 |
| 1253 | products/9088-ss-stainless-steel-handle-6.webp | 9088 SS（图库第 5 张） | 渲染图（3D/CG） | 面板和执手画成镜面抛光，实拍为拉丝面带抛光边 |
| 1258 | products/9210-pbet-tubular-lock-2.webp | 9210 PBET（图库第 1 张） | AI 生成 / 重渲染 | 球锁上方多画了一把单头钥匙锁舌锁（deadbolt），不是本型号的部件 |
| 1285 | products/bh01-grab-bar.webp | BH01（图库第 1 张） | AI 生成 / 重渲染 | 扶手竖装在玻璃淋浴门上当门拉手；扶手应固定在墙体上，安装逻辑错误 |
| 1291 | products/bh02-knurled-grab-bar-3.webp | BH02（图库第 2 张） | AI 生成 / 重渲染 | 扶手的两个墙座固定在玻璃淋浴隔断上（水珠覆盖在墙座上），扶手不能装在玻璃上，安装逻辑错误 |
| 1296 | products/bh03-angled-grab-bar-2.webp | BH03（图库第 1 张） | 渲染图（3D/CG） | 扶手中段画成滚花防滑纹，实拍 BH03 为整根光管无滚花（滚花款是 BH02/BH04） |
| 1302 | products/bh04-angled-grab-bar-2.webp | BH04（图库第 1 张） | AI 生成 / 重渲染 | 场景中扶手为整根拉丝管，没有实拍中的抛光管加中段防滑段 |
| 1315 | products/bh06-hook-rail-3.webp | BH06（图库第 2 张） | AI 生成 / 重渲染 | 挂钩画成 4 个，规格只有 3、5、6 钩三种 |
| 1360 | products/bh15-100mm-barrel-bolt-3.webp | BH15-100mm（图库第 2 张） | AI 生成 / 重渲染 | 底板长宽比约1.8:1，实拍(100mm款)约2.9:1，底板明显偏短偏高；插销伸出但门处开启状态 |
| 1363 | products/bh15-80mm-barrel-bolt-2.webp | BH15-80mm（图库第 1 张） | AI 生成 / 重渲染 | 底板长宽比约1.7:1，尺寸图80×37mm（约2.2:1），底板偏短偏高 |
| 1372 | products/bh17-spring-latch-2.webp | BH17（图库第 1 张） | AI 生成 / 重渲染 | 拨片为正对镜头的方片且下沿压住右下螺钉；实拍与尺寸图为宽3mm、垂直于锁舌轴线竖立的拨片 |
| 1424 | products/bh28-shower-basket-2.webp | BH28（图库第 1 张） | AI 生成 / 重渲染 | 篮内左右两端多出U形内框，实拍与尺寸图均无；瓶身文字乱码 |
| 1441 | products/bh31-two-tier-corner-shower-basket-2.webp | BH31（图库第 1 张） | AI 生成 / 重渲染 | 下层篮底缺两只挂钩，实拍bh31-…-4与尺寸图均有；瓶身文字乱码 |
| 1473 | products/bh38-robe-hook-2.webp | BH38（图库第 1 张） | AI 生成 / 重渲染 | 三只挂钩造型互不相同：中、右两只为带两螺孔圆座的双钩（类似BH36），非BH38的8mm扁钢单钩圆座；本型号无实拍 |
| 1528 | products/bh56-flip-up-grab-bar-6.webp | BH56（图库第 5 张） | 图文说明图 | 标题写“FIXED DUAL-RAIL”，与型号“Flip-Up 可翻折”矛盾；“150KG/100KG”承重数据无规格依据，属未核实声明；本型号无实拍 |
| 1538 | products/bh58-flip-up-grab-bar-4.webp | BH58（图库第 3 张） | 图文说明图 | “150KG max user weight / 100KG static load”承重数据无规格依据，属未核实安全声明；本型号无实拍 |
| 1544 | products/bl027-brass-and-steel-hinges-5.webp | BL027（图库第 4 张） | 图文说明图 | 宽度标注63mm，规格为2.28"（约58mm）；高88mm、厚1.6mm、6孔与规格一致 |
| 1545 | products/bl027-brass-and-steel-hinges-6.webp | BL027（图库第 5 张） | AI 生成 / 重渲染 | 合页平贴在门缝正面、跨在门框与门扇之间，未装在门边与门框侧面；仅见一只且位于门中部 |
| 1552 | products/bl028-brass-and-steel-hinges-7.webp | BL028（图库第 6 张） | AI 生成 / 重渲染 | 合页为黑色而执手为金色，画面混用两种表面 |
| 1567 | products/bl030-brass-and-steel-hinges-7.webp | BL030（图库第 6 张） | 图文说明图 | 同框5种表面（色板），除黑色外金/古铜/红铜/镍色版本均无实拍；“304不锈钢/Soft-close”与规格一致 |
| 1572 | products/bl031-brass-and-steel-hinges-5.webp | BL031（图库第 4 张） | AI 生成 / 重渲染 | 子母合页平贴在门面跨缝，未装于门边与门框之间；按合页长125mm推算执手距合页边仅约11cm，锁具位置紧贴合页侧 |
| 1573 | products/bl031-brass-and-steel-hinges-6.webp | BL031（图库第 5 张） | 图文说明图 | 同框7种表面，红古铜/黄古铜/绿古铜/金色/灰色版本无实拍（实拍仅黑、银） |
| 1606 | products/d01-ab-deadbolts-2.webp | D01 AB（图库第 1 张） | AI 生成 / 重渲染 | 画面加入一只古铜执手锁（非本型号），构成未核实的组合套装；锁本体与实拍一致 |
| 1608 | products/d101-ab-deadbolts-2.webp | D101 AB（图库第 1 张） | AI 生成 / 重渲染 | 画面加入一只古铜执手锁（非本型号），构成未核实的组合套装；锁本体与实拍一致 |
| 1610 | products/d101-ac-deadbolts-2.webp | D101 AC（图库第 1 张） | AI 生成 / 重渲染 | 锁舌为八角棱柱，实拍为圆柱；内侧拧钮从内盖边缘伸出、传动件变形 |
| 1615 | products/d101-bs-deadbolts-2.webp | D101 BS（图库第 1 张） | AI 生成 / 重渲染 | 锁舌面板为银色，实拍d101-bs-deadbolts为黄铜色 |
| 1620 | products/d101-dspb-deadbolts-3.webp | D101 DSPB（图库第 2 张） | AI 生成 / 重渲染 | 画面加入一只抛光铜执手（非本型号），构成未核实的组合套装；本型号无实拍 |
| 1622 | products/d101-pb-deadbolts-2.webp | D101 PB（图库第 1 张） | AI 生成 / 重渲染 | 画面加入一套抛光铜把手锁（非本型号），构成未核实的组合套装 |
| 1628 | products/d101-ss-deadbolts-5.webp | D101 SS（图库第 4 张） | AI 生成 / 重渲染 | 画面加入一只镍色执手锁（非本型号），构成未核实的组合套装；锁本体与实拍一致 |
| 1635 | products/d102-ac-deadbolts-4.webp | D102 AC（图库第 3 张） | AI 生成 / 重渲染 | 门边两块锁舌面板为黄铜色，实拍为古铜色，同框两种表面；下方多出一套古铜拇指把手套装（非 D102 配件） |
| 1637 | products/d102-pb-deadbolts-2.webp | D102 PB（图库第 1 张） | AI 生成 / 重渲染 | 下方加了一对球形执手，D102 不含，构成工厂不按套销售的组合 |
| 1638 | products/d102-pb-deadbolts-3.webp | D102 PB（图库第 2 张） | AI 生成 / 重渲染 | 下方加了拇指把手套装，D102 不含，构成不按套销售的组合 |
| 1643 | products/d102-ss-deadbolts-5.webp | D102 SS（图库第 4 张） | AI 生成 / 重渲染 | 下方加了一套执手锁，D102 不含，构成不按套销售的组合 |
| 1646 | products/d103-ac-deadbolts-3.webp | D103 AC（图库第 2 张） | AI 生成 / 重渲染 | 门边锁舌为黄铜色，实拍古铜色，同框两种表面；下方多出方座执手（非 D103 配件） |
| 1647 | products/d103-ac-deadbolts-4.webp | D103 AC（图库第 3 张） | AI 生成 / 重渲染 | 同一方座上同时有旋钮和钥匙孔，实拍旋钮侧只有旋钮，不可能的结构；下方多出方座执手 |
| 1654 | products-hyde/d104-ss-deadbolts-5.webp | D104 SS（图库第 4 张） | 图文说明图 | 底部颜色栏同框 6 种表面，除拉丝 ST 外（CB/WH/CD/BK 等）均无实拍可证；无认证标志 |
| 1656 | products-hyde/d104-ss-deadbolts-7.webp | D104 SS（图库第 6 张） | 图文说明图 | 画面含整个榫槽锁体，D104 规格只含锁芯+旋钮，未注明锁体不含，买家会以为成套 |
| 1658 | products-hyde/d104-ss-deadbolts-9.webp | D104 SS（图库第 8 张） | AI 生成 / 重渲染 | 带锁舌的锁体面板画在门正面而不是门边，无法安装；多出方座执手 |
| 1659 | products-hyde/d104-ss-deadbolts-10.webp | D104 SS（图库第 9 张） | AI 生成 / 重渲染 | 锁芯画成扁平圆盘，实拍为高 31.5mm 的锥形座带台阶；多出执手 |
| 1660 | products-hyde/d104-ss-deadbolts-11.webp | D104 SS（图库第 10 张） | AI 生成 / 重渲染 | 旋钮侧画成扁平圆座小旋钮，实拍为锥形座宽旋钮；多出执手 |
| 1672 | products/dc02-door-coordinator-6.webp | DC02（图库第 5 张） | 图文说明图 | 标题宣称 Engineered for Fire Doors，属未经验证的防火适用声明；应用场景图为图库图 |
| 1714 | products/dsl02-door-coordinator-2.webp | DSL02（图库第 1 张） | 图文说明图 | 与 25CM 图为同一底图只改标注为 35CM，臂长未变；尺寸图只有 250/277mm，规格无 35CM |
| 1731 | products/dv05-bl-door-viewer-6.webp | DV05 BL（图库第 5 张） | AI 生成 / 重渲染 | 黑色猫眼与门上黄铜把手同框，两种表面 |
| 1741 | products/dv06-door-viewer-4.webp | DV06（图库第 3 张） | AI 生成 / 重渲染 | 黄铜猫眼与黑色把手套装同框，两种表面 |
| 1743 | products/dv07-door-viewer-2.webp | DV07（图库第 1 张） | AI 生成 / 重渲染 | 黄铜猫眼与深色/黑色把手锁同框，两种表面 |
| 1745 | products/dv07-door-viewer-4.webp | DV07（图库第 3 张） | AI 生成 / 重渲染 | 黄铜猫眼与银色把手套装同框，两种表面 |
| 1749 | products/dv08-door-viewer-3.webp | DV08（图库第 2 张） | AI 生成 / 重渲染 | 猫眼只画成发光小点看不出 DV08 外形；门上为黑色把手，与缎镍猫眼两种表面 |
| 1757 | products/dv08-sn-door-viewer-3.webp | DV08 SN（图库第 2 张） | AI 生成 / 重渲染 | 与 DV08 场景图为同一张；猫眼只是发光小点看不出外形；黑色把手与缎镍猫眼两种表面 |
| 1764 | products/dv09-door-viewer-2.webp | DV09（图库第 1 张） | AI 生成 / 重渲染 | 猫眼只画成发光小点，看不出 DV09 外形和表面；门上为黑色把手 |
| 1768 | products/dv10-door-viewer-4.webp | DV10（图库第 3 张） | AI 生成 / 重渲染 | 猫眼只画成发光蓝点，看不出 DV10 外形和表面，无法核对 |
| 1769 | products/dv10-door-viewer-5.webp | DV10（图库第 4 张） | AI 生成 / 重渲染 | 猫眼只画成发光蓝点，看不出 DV10 外形和表面，无法核对 |
| 1772 | products/dv11-door-viewer-3.webp | DV11（图库第 2 张） | AI 生成 / 重渲染 | DV11 是方形猫眼，场景画成圆形发光点 |
| 1773 | products/dv11-door-viewer-4.webp | DV11（图库第 3 张） | AI 生成 / 重渲染 | DV11 是方形猫眼，场景画成圆形发光点；门上为黄铜把手 |
| 1776 | products/dv12-b-door-viewer-2.webp | DV12-B（图库第 1 张） | AI 生成 / 重渲染 | 猫眼只画成发光小点，看不出 DV12 白圈黑身外形 |
| 1782 | products/dv12-s-door-viewer-4.webp | DV12-S（图库第 3 张） | AI 生成 / 重渲染 | 猫眼画成深色圆点加蓝光，看不出实拍的白色外圈 |
| 1796 | products/eh01-lever-handle-10.webp | EH01（图库第 9 张） | AI 生成 / 重渲染 | 锁芯为黄铜色，实拍为黑色，同框两种表面；鸟笼执手画成细长开口螺旋，与实拍的闭合鸟笼形不同 |
| 1805 | products/eh02-lever-handle-8.webp | EH02（图库第 7 张） | AI 生成 / 重渲染 | 锁芯为银色，黑色面板实拍配黑色锁芯，同框两种表面 |
| 1812 | products/eh03-lever-handle-7.webp | EH03（图库第 6 张） | AI 生成 / 重渲染 | 锁芯为黄铜色，实拍为黑色，同框两种表面 |
| 1819 | products/f001-security-door-guard-3.webp | F001（图库第 2 张） | AI 生成 / 重渲染 | 两板之间多出一块两颗螺丝的小板，实拍没有；球头和 U 形杆位置与实拍不同 |
| 1830 | products/f006-security-door-guard-2.webp | F006（图库第 1 张） | AI 生成 / 重渲染 | 门侧盒体出现红黑按钮，实拍没有；框侧板形状与实拍不同 |
| 1839 | products/f100-ss-door-hinge-9.webp | F100 SS（图库第 8 张） | 图文说明图 | 标题文字错为 MOOTH CLOSING（缺 S）；产品部分与实拍一致，无认证声明 |
| 1881 | products/f113-glass-door-patch-fittings-5.webp | F113（图库第 4 张） | AI 生成 / 重渲染 | 夹具孤立装在玻璃中段约 1.4m 处，位置图（-6）标在门顶上方转接处 |
| 1904 | products/f132-glass-door-patch-fittings-6.webp | F132（图库第 5 张） | AI 生成 / 重渲染 | 拉手轴线与玻璃面平行，玻璃未从中间黑色胶圈处穿过，拉手悬空无安装面 |
| 1905 | products/f132-glass-door-patch-fittings-7.webp | F132（图库第 6 张） | AI 生成 / 重渲染 | 画面混入另一型号玻璃门锁（GL125 类锁体+D形锁扣）；拉手中间黑色胶圈不可见，与玻璃安装关系不清 |
| 1908 | products/fb001-ac-door-flush-bolt-2.webp | FB001 AC（图库第 1 张） | AI 生成 / 重渲染 | 地面多出一块带2颗螺丝的地扣板，FB001 实拍中无此零件 |
| 1912 | products/fb001-door-flush-bolt-4.webp | FB001（图库第 3 张） | AI 生成 / 重渲染 | 地面多出一块带2颗螺丝的地扣板，FB001 实拍中无此零件 |
| 1914 | products/fb001-door-flush-bolt-6.webp | FB001（图库第 5 张） | 图文说明图 | 插销为直板两端各一螺丝孔、顶端出圆销配圆形地扣，实拍 FB001 一端为带孔L形折边；拨钮为平片式，实拍为圆钮；地扣实拍未见 |
| 1915 | products/fb001-door-flush-bolt-7.webp | FB001（图库第 6 张） | 图文说明图 | 左图平片式拨钮在 FB001 实拍中不存在（实拍仅圆钮）；“两种铆钉可选”无实拍佐证 |
| 1929 | products/fb014-door-flush-bolt-3.webp | FB014（图库第 2 张） | AI 生成 / 重渲染 | 天地插装在右扇靠侧窗的门边（合页侧），而非双开门中缝门边；两扇执手同样装在外侧边 |
| 1933 | products/fb016-door-flush-bolt-2.webp | FB016（图库第 1 张） | AI 生成 / 重渲染 | 插销装在单开玻璃门门扇正面上部而非门边；单开门无需天地插；延长杆未体现 |
| 1951 | products/g559-night-latch-and-rim-lock-7.webp | G559（图库第 6 张） | AI 生成 / 重渲染 | 防盗链为金色，实拍为银色不锈钢链，画面两种饰面 |
| 1954 | products/gl125-ss-glass-door-patch-fittings-3.webp | GL125 SS（图库第 2 张） | AI 生成 / 重渲染 | 锁体两块压板外翻伸出锁体边缘、横向朝锁扣，实拍压板位于夹玻璃槽内；锁体跨在玻璃边缘 |
| 1955 | products/gl125-ss-glass-door-patch-fittings-4.webp | GL125 SS（图库第 3 张） | AI 生成 / 重渲染 | 画面混入 F132 圆拉手（另一型号）；锁体盖为哑白银色而锁扣为拉丝色，两种饰面；压板外翻伸出锁体 |
| 1961 | concepts/glass-patch-fitting-application.webp | Glass Door Patch Fitting Set（图库第 1 张） | AI 生成 / 重渲染 | L形门夹下部3个圆孔，实拍套装中同类门夹为2孔；加入实拍套装中没有的立式拉手 |
| 1974 | products/hy-0ss-latch-guard-5.webp | HY-0SS（图库第 4 张） | AI 生成 / 重渲染 | 门面上加了火焰图标，属未经证实的防火/易燃标识 |
| 1992 | products/hy006et-lock-case-9.webp | HY006ET（图库第 8 张） | AI 生成 / 重渲染 | 窄边框铝门钩锁（规格：Aluminum narrow-stile）装在实木平开门上，门型不符 |
| 2000 | products/hy007-lock-case-7.webp | HY007（图库第 6 张） | AI 生成 / 重渲染 | 黑色锁扣板悬空，未装在任何门框上；锁面板（门边）与锁芯（门面）同时正对镜头，几何不成立 |
| 2008 | products/hy007-s-lock-case-8.webp | HY007-S（图库第 7 张） | AI 生成 / 重渲染 | 锁面板（门边）与推板（门面）同时正对镜头，几何不成立，推板与锁体安装关系错误 |
| 2017 | products/hy008-lock-case-8.webp | HY008（图库第 6 张） | 图文说明图 | HY008 页面图中三款锁体，另两款为 HY007 斜舌款与 HY006 钩舌款（非本型号）；锁芯为银色，HY008 实拍为绿色饰圈锁芯 |
| 2026 | products/110-lock-case-6.webp | AR4-110（图库第 8 张） | AI 生成 / 重渲染 | 锁舌为半圆柱形，AR4-110 实拍为方形锌合金块；门另一侧执手越出锁边、朝向错误 |
| 2042 | products/140-lock-case-5.webp | AR4-140（图库第 5 张） | AI 生成 / 重渲染 | AR4-140 为铝门锁，场景装在实木门上；门另一侧执手越出锁边、朝向错误（与 AR4-110 共用同一张场景图） |
| 2047 | products/ih01-brass-and-steel-hinges-5.webp | IH01（图库第 4 张） | AI 生成 / 重渲染 | 合页为拉丝不锈钢色，实拍及规格为镀锌（Zinc Plated） |
| 2050 | products/ju-051-door-closer-2.webp | JU-051（图库第 1 张） | AI 生成 / 重渲染 | 机身一端为竖立安装板带4螺丝、截面八角形，实拍为平顶机身+底部两端安装脚；调速阀位置不同 |
| 2083 | products/l018-latch-2.webp | L018（图库第 1 张） | AI 生成 / 重渲染 | 门另一侧执手越出门边、朝锁边方向，执手朝向错误 |
| 2090 | products/l021-latch-3.webp | L021（图库第 2 张） | AI 生成 / 重渲染 | 门另一侧锁盖/旋钮越出门边，60/70mm 后备距下不可能 |
| 2107 | products/lc04-85-60-lock-case-6.webp | LC04 85*60（图库第 5 张） | 图文说明图 | 画面含 7085、5085 两个其他规格及银灰色锁体，非本型号 85×60 黑色锁体 |
| 2116 | products/lc05-8560-lock-case-5.webp | LC05 8560（图库第 4 张） | 图文说明图 | 四宫格含仅斜舌款与4圆柱舌款，非 LC05 实拍的3方舌款 |
| 2119 | products/lc05-8560-lock-case-8.webp | LC05 8560（图库第 7 张） | AI 生成 / 重渲染 | 执手与斜舌同高，实拍方孔位于斜舌下方约20mm |
| 2125 | products/lc07-85-45mm-lock-case-5.webp | LC07 85×45mm（图库第 4 张） | AI 生成 / 重渲染 | 锁面板上多出两处 Hyland 刻字，实拍面板无字 |
| 2130 | products/lc08-85-55mm-lock-case-4.webp | LC08 85×55mm（图库第 3 张） | 图文说明图 | 图中锁体为4个圆柱舌，LC08 实拍为单个方形大舌 |
| 2139 | products/lc14-85-50mm-lock-case-7.webp | LC14 85×50mm（图库第 6 张） | AI 生成 / 重渲染 | 门另一侧执手越出门边、朝锁边方向，执手朝向错误 |
| 2154 | products/lc17-lock-case-6.webp | LC17（图库第 5 张） | AI 生成 / 重渲染 | LC17 为推拉门钩锁（无方孔），场景配执手装在平开门上；钩舌多出一根圆柱销；面板3颗螺丝，实拍为2孔 |
| 2181 | products/lc35-8550-lock-case-5.webp | LC35 8550（图库第 4 张） | AI 生成 / 重渲染 | 锁体面板为亮金色，实拍为青古铜(AB)；画面内亮金面板/锁芯与拉丝不锈钢执手、底座混合多种表面 |
| 2185 | products/lc5845-lock-case-4.webp | LC5845（图库第 3 张） | AI 生成 / 重渲染 | 画面混合两种表面：金色+拉丝双色长面板执手，锁体面板为拉丝不锈钢 |
| 2199 | products/lc7065-lock-case-7.webp | LC7065（图库第 6 张） | AI 生成 / 重渲染 | 门框扣板为金色，锁体面板为拉丝不锈钢，画面内表面不统一 |
| 2213 | products/lc8525-lock-case-5.webp | LC8525（图库第 4 张） | AI 生成 / 重渲染 | LC8525背距25mm，画面执手圆底座中心距门边约40mm；且25mm背距无法安装约52mm圆底座（会超出门边）；角标Hyland标语重复叠印 |
| 2221 | products/lc8535-lock-case-4.webp | LC8535（图库第 3 张） | AI 生成 / 重渲染 | 执手与锁芯圆座中心距约为底座直径2.1倍（按52mm底座约110mm），规格为85mm；执手底座和钥匙上加了实拍没有的Hyland字样 |
| 2225 | products/lc9045-lock-case-2.webp | LC9045（图库第 1 张） | AI 生成 / 重渲染 | 与LC7065S场景图为同一张；锁芯到执手中心距约65mm，LC9045规格为45mm、背距90mm |
| 2245 | products/lh1083-ss-stainless-steel-handle-4.webp | LH1083 SS（图库第 3 张） | AI 生成 / 重渲染 | 执手为直杆从椭圆底座直出，缺少实拍的Z形偏置颈部 |
| 2246 | products/lh1083-ss-stainless-steel-handle-5.webp | LH1083 SS（图库第 4 张） | AI 生成 / 重渲染 | 执手下方为黑色旋钮状部件，实拍为椭圆锁芯盖板；角标Hyland标志重影错乱 |
| 2286 | products/lh852-gmbk-lever-handle-6.webp | LH852 GMBK（图库第 5 张） | AI 生成 / 重渲染 | 执手直接贴在方底座正面、没有方颈，隐私旋钮跑到执手端侧；与LH852实拍结构不符（且枪灰色无实拍） |
| 2333 | products/lh855-lever-handle-8.webp | LH855（图库第 7 张） | 图文说明图 | 文字标注错误：把带钥匙孔的执手标为"DOOR KNOB"，套装内无门球 |
| 2336 | products/lh855-snbk-lever-handle-3.webp | LH855 SNBK（图库第 2 张） | 图文说明图 | 标注门厚30-50mm，尺寸图和规格均为35-45mm |
| 2337 | products/lh855-snbk-lever-handle-4.webp | LH855 SNBK（图库第 3 张） | 图文说明图 | 色板列出金色、亮铬、黄铜、玫瑰金等颜色，LH855仅有黑色与缎面镍实拍 |
| 2341 | products/lh855-snet-lever-handle-2.webp | LH855 SNET（图库第 1 张） | 图文说明图 | 文字标注错误：把带钥匙孔的执手标为"DOOR KNOB"，套装内无门球 |
| 2343 | products/lh855-snet-lever-handle-4.webp | LH855 SNET（图库第 3 张） | 图文说明图 | 标注门厚30-50mm，尺寸图和规格均为35-45mm |
| 2344 | products/lh855-snet-lever-handle-5.webp | LH855 SNET（图库第 4 张） | 图文说明图 | 色板列出金色、亮铬、黄铜、玫瑰金等颜色，LH855仅有黑色与缎面镍实拍 |
| 2354 | products/nc046-stainless-steel-handle-3.webp | NC046（图库第 2 张） | AI 生成 / 重渲染 | 执手为圆管圆头直杆，实拍为扁方截面直角端头、带下折颈部 |
| 2384 | products/no01-gate-house-no-3.webp | NO01（图库第 2 张） | 图文说明图 | 标注140mm，规格尺寸为3"/4"/5"/6"（约76/102/127/152mm） |
| 2387 | products/no01-gate-house-no-6.webp | NO01（图库第 5 张） | 图文说明图 | 标注200/150/100/75mm，200mm不在规格(3"-6")内，且缺5" |
| 2389 | products/no01-gate-house-no-8.webp | NO01（图库第 7 张） | 图文说明图 | 标注30cm、25.5cm、21cm、20cm等尺寸，超出规格3"-6"(最大约15cm) |
| 2397 | products/s02-cp-sliding-hook-lock-5.webp | S02 CP（图库第 4 张） | AI 生成 / 重渲染 | CP款配黑色方形拉手，与镀铬面板混色；CP实拍拉手为铬色 |
| 2398 | products/s02-cp-sliding-hook-lock-6.webp | S02 CP（图库第 5 张） | AI 生成 / 重渲染 | 锁体勾舌与面板不可见，门面方形拉手明显过小且无实拍的旋钮/盖板结构，无法与实拍对应 |
| 2415 | products/sh01-panic-exit-device-4.webp | SH01（图库第 3 张） | AI 生成 / 重渲染 | 画面贴有"ABNT NBR 11742 CLASSE P-90 PORTA CORTA-FOGO"防火门认证标签，属未经核实的认证/防火等级声明 |
| 2416 | products/sh01-panic-exit-device-5.webp | SH01（图库第 4 张） | AI 生成 / 重渲染 | 门上标牌"PORTA CORTA-FOGO - CLASSE P-90"为未经核实的防火等级声明；门上合页为普通平开合页外观，看不出SH01弹簧合页 |
| 2427 | products-hyde/sh02-spring-hinge-pin-7.webp | SH02（图库第 6 张） | 图文说明图 | 标题"FOR FIRE DOORS"为未经核实的防火用途声明（规格仅写金属门） |
| 2430 | products-hyde/sh02-spring-hinge-pin-10.webp | SH02（图库第 9 张） | AI 生成 / 重渲染 | 门上三副为普通合页外观，看不到SH02销钉的下端调节环和钩头，产品无法辨认 |
| 2447 | products/ssh013-brass-and-steel-hinges-3.webp | SSH013（图库第 2 张） | AI 生成 / 重渲染 | 每页4个螺钉单列排布，实拍孔位为交错双列 |
| 2448 | products/ssh013-brass-and-steel-hinges-4.webp | SSH013（图库第 3 张） | 图文说明图 | 标注尺寸3"×3"×3mm、4.5"×4"×3mm、5"×3"×3mm、5"×4"×3mm、6"×4"×3mm，与规格(4"×3"×2.0、4"×4"×2.0、3.5"×3.5"×2.5、4"×3"×2.5mm)不符 |
| 2456 | products/ssh016-brass-and-steel-hinges-6.webp | SSH016（图库第 5 张） | 图文说明图 | 标注63×41×1.2、50×37×1.2、38×30.5×1、25×24.5×1mm，规格为2"×2"×2mm至4"×4"×2.5mm，尺寸和厚度均不符 |
| 2472 | products/ssh023-brass-and-steel-hinges-9.webp | SSH023（图库第 8 张） | AI 生成 / 重渲染 | 合页每页3孔，实拍为每页4孔；弹簧筒顶部无调节帽 |
| 2473 | products/ssh023-brass-and-steel-hinges-10.webp | SSH023（图库第 9 张） | AI 生成 / 重渲染 | 合页每页3孔，实拍为每页4孔；门向观者一侧打开且合页轴可见，推杠却装在同一面（拉门侧），推杠应在推门侧 |
| 2484 | concepts/lever-handle-application.webp | Stainless Steel Lever Handle Lock（图库第 1 张） | AI 生成 / 重渲染 | 画面为方底座方执手，本型号实拍为圆底座圆管L形执手，产品不符 |
| 2487 | concepts/smart-lock-residential-application.webp | Tubular Knob Lock（图库第 1 张） | AI 生成 / 重渲染 | 画面为密码智能锁，不是球形锁；与本型号实拍完全不符 |
| 2494 | products/xf-1-lock-cylinder-5.webp | XF-1（图库第 4 张） | 图文说明图 | 色板含红铜、枪灰等颜色，规格只列金、铬、黑、古铜；多数色样无实拍 |
| 2554 | brazil-collection/br1-dl.webp | /products/brazil/ | 渲染图（3D/CG） | 带钥匙的外侧执手画在与推杠同一面（推侧），且明显高于推杠；外侧执手应装在拉侧 |
| 2609 | drawings/5835-night-latch-and-rim-lock.svg | /products/night-latches-rim-locks/5835-night-latch-and-rim-lock/ | 尺寸图 / 线图 | SVG 说明称锁壳外形未公布故不画，但 5835 规格已公布 Case size 100×85×25mm；图未画锁壳外形 |
| 2610 | drawings/5836-night-latch-and-rim-lock.svg | /products/night-latches-rim-locks/5836-night-latch-and-rim-lock/ | 尺寸图 / 线图 | SVG 说明称锁壳外形未公布故不画，但 5836 规格已公布 Case size 100×85×25mm；图未画锁壳外形 |
| 2678 | editorial/architecture-boutique-hotel.webp | /projects/hospitality-residential-door-package/ | AI 生成 / 重渲染 | 生成场景中木门上的古铜色长板执手为生成产物，无法对应任何 HYDE 型号 |
| 2680 | editorial/argentina-ar4-entry.webp | / | AI 生成 / 重渲染 | 黄铜锁面板上开有欧式锁芯孔（锁芯不可能在门边面板上）；AR4 面板只有斜舌/方舌孔和螺钉孔；执手亦为生成，无法对应 AR4 型号 |
| 2738 | editorial/hero-civic-corridor.webp | / | AI 生成 / 重渲染 | 远景双开门上的执手/锁为生成产物，无法对应任何型号 |
| 2742 | editorial/home-design-context.webp | /projects/glass-entrance-hardware-package/ | AI 生成 / 重渲染 | 木门上的黑色长板执手为生成产物，无法对应任何型号 |
| 2744 | editorial/hyde-editorial-product-range-07.webp | /news/ | AI 生成 / 重渲染 | 执手锁、球锁及散件均为生成产物，无法对应型号（球体、底座、锁舌与 587 系列实拍不同）；两套锁已各带斜舌又另放一只斜舌，部件数不合理 |
| 2749 | editorial/hyde-hero-lockcase.webp | /compare/lock-cases/ | AI 生成 / 重渲染 | sidecar 称源图为单只 lc14 尺寸图且保留原像素，实际是四只锁体的重绘图；出现黑色面板款，实拍只有银/古铜/银/白四款面板；锁体外形与实拍不同 |
| 2758 | editorial/industrial-precision-parts.webp | /projects/commercial-fire-egress-hardware/ | AI 生成 / 重渲染 | 生成的机加工金属件（V 形块、角码、垫圈等），不是任何 HYDE 产品，属想象的金属件 |
| 2761 | editorial/news-door-schedule-doors.webp | /news/ | AI 生成 / 重渲染 | 走廊各门执手与尽头双开门拉手均为生成产物，无法对应型号 |
| 2762 | editorial/news-exit-device-standards-2026.webp | /news/ | AI 生成 / 重渲染 | 生成的展会场景：木门上的银色推杠两端支座同形，没有 305 的大锁头壳体，无法对应型号；灰门红色推杠近似 310，但为生成产物，无法核对 |
| 2763 | editorial/news-mortise-lock-inspection.webp | /news/ | AI 生成 / 重渲染 | 生成的插芯锁体及散落的 L 形件，无法对应任何 HYDE 型号 |
| 2764 | editorial/project-commercial-egress.webp | /projects/ | AI 生成 / 重渲染 | 两樘双开门上的推杠为生成产物，无法对应型号 |
| 2765 | editorial/project-glass-entrance.webp | /projects/ | AI 生成 / 重渲染 | 玻璃门夹与地弹簧为生成产物，无法对应型号；两扇玻璃门没有拉手 |
| 2766 | editorial/project-hospitality-residential.webp | /projects/ | AI 生成 / 重渲染 | 走廊木门上的黑色执手为生成产物，无法对应型号 |
| 2785 | product-studies/14-source-hyde-ar4-110-mortise-lock-1440.webp | /product-studies/ | 实拍合成 | 板面写 Nominal lock body 68 × 40 mm，规格中 68/40 是中心距/后距，锁体为 127.3×60.8mm |
| 2786 | product-studies/14-source-hyde-ar4-110-mortise-lock-720.webp | /product-studies/ | 实拍合成 | 同 1440 版：Nominal lock body 68 × 40 mm 与规格锁体 127.3×60.8mm 不符 |
| 2789 | product-studies/19-source-310-panic-exit-device-1440.webp | /product-studies/ | 实拍合成 | 板面写 Material: Iron，规格为铝合金本体+铁杆 |
| 2790 | product-studies/19-source-310-panic-exit-device-720.webp | /product-studies/ | 实拍合成 | 同 1440 版：Material: Iron 与规格（铝合金本体+铁杆）不符 |
| 2801 | stories/9014/detail-corner.webp | /stories/9014/ | 渲染图（3D/CG） | 画面是方截面、带分层棱边的部件；9014 实拍为 Ø19 圆管执手配圆底座，没有这种棱角 |
| 2803 | stories/9014/one-take-poster.webp | / | 渲染图（3D/CG） | 执手颈部缺少实拍可见的紧定螺丝；圆底座画成平板圆盘，实拍为带凸台的分层底座；标注 135·60·Ø19 与规格一致 |

## 四、无实拍可对照（62 个型号 / 组）

这些型号站上的图全是渲染或 AI 图，没有实拍可以对。要么补拍实物，要么接受它们只按尺寸图核对。

| 型号 | 张数 | 和自身尺寸图、规格的矛盾 |
|---|---:|---|
| 100 | 4 | 与尺寸图外形一致；尺寸图/规格把支脚中心距标为 30mm，图上实际约 350mm，需核对；图中标 300mm / 250mm 两个长度，规格只有 600mm；与渲染/尺寸图一致；拉手长度超过门宽（约 1.0–1.1 m），规格 600mm，比例不对 |
| 102 | 3 | 与尺寸图一致；分段亮环外观与渲染一致；按门宽估算长约 0.7–0.8 m，略长于 600mm；与渲染一致 |
| 104 | 2 | 与尺寸图一致（两管顶端斜切、下端收细）；每副拉手只有一根管顶斜切，另一根为圆头；渲染和尺寸图两根都是斜切 |
| 105 | 3 | 与尺寸图一致；矩形框拉手、上下螺丝与渲染一致；黑色款，与本型号其它图（拉丝银色）不一致；左侧 7 根黑色扁条在尺寸图里不存在，看不出是什么部件 |
| 106 | 3 | 规格写握持段 140mm，图中握持段约占全长 40%（约 240mm），需核对；两端收细、中段握持段与渲染一致；握持段为竖条纹，渲染为光面；与渲染一致 |
| 107 | 3 | 与尺寸图一致；亚克力气泡中段、两端刻线与渲染一致；与渲染一致 |
| 108 | 5 | 尺寸图 108-2 标 510/410mm，108-5 标 300/500/600mm，两张尺寸图互相矛盾；背靠背一对 T 形拉手，管径、支脚位置与渲染/尺寸图相符；与尺寸图一致；黑色款支脚连接处出现银色圈，黑色渲染（108-2）为全黑，一画面两种表面；与尺寸图一致 |
| 109 | 4 | 与尺寸图一致；方管 + 圆支脚与渲染一致；外形与渲染一致；按门宽估算长约 0.8 m，规格最长 600mm，偏长；与尺寸图一致 |
| 112 | 2 | 与尺寸图一致；椭圆环形对装拉手与渲染一致 |
| 312 | 5 | 该型号没有实拍，只有安装图 302；图纸两侧底板有锁芯位，渲染外壳看不到锁芯孔，无法确认是否一致；该型号没有实拍，只有安装图 302；渲染外壳看不到图纸上的锁芯位，无法确认；该型号没有实拍；两端组件俯视图和其他渲染图一致，看不到锁芯孔；该型号没有实拍；正视图和渲染图 296、297 一致，看不到锁芯孔；锁侧组件靠近门边锁体，安装逻辑合理，外形和渲染图 296–299 一致；没有实拍可以核对 |
| 70710 PB | 2 | 无实拍；与本型号尺寸图 70710-sn-2 造型一致；外侧单头锁+拉手在锁边，高度合理；五金在画面中过小，孔位无法核对 |
| 70710 SN | 1 | 无实拍；低分辨率渲染，与尺寸图 827 造型一致 |
| 70720 PB | 2 | 无实拍；与尺寸图 831 造型一致；外侧花边底座单头锁+拉手在锁边，与 830 一致；五金过小，孔位无法核对 |
| 70720 SM | 2 | 无实拍；与尺寸图 837 造型一致；外侧单头锁+拉手在锁边，与 834 一致；五金过小，孔位无法核对 |
| 70750 PB | 1 | 无实拍；仅渲染，无尺寸图可对 |
| 70780 AB | 3 | 无实拍；与尺寸图 850 造型一致；外侧花边底座单头锁+拉手在锁边，与 849 一致；五金过小，孔位无法核对；室内侧拇指旋钮+球形执手，与 849 一致；五金过小，孔位无法核对 |
| 9001 | 4 | 本型号无实拍；方底座、圆管执手、欧标锁孔盖与尺寸图不矛盾；本型号无实拍；本型号无实拍；场景安装逻辑正确（锁体在门边、执手指向远离门边）；本型号无实拍；场景安装逻辑正确 |
| 9002E | 3 | 本型号无实拍；本型号无实拍；本型号无实拍；锁体在门边、执手指向远离门边 |
| 9004 | 3 | 本型号无实拍；本型号无实拍；安装逻辑正确；本型号无实拍 |
| 9005S | 4 | 本型号无实拍；本型号无实拍；本型号无实拍；安装逻辑正确；本型号无实拍 |
| 9006S | 4 | 本型号无实拍；本型号无实拍；本型号无实拍；安装逻辑正确；本型号无实拍 |
| 9007 | 1 | 本型号唯一一张图，主体是四舌锁体加 5 款不同执手和 2 款锁芯，看不出哪一款是 9007；规格只写不锈钢执手，没提锁体 |
| 9008E | 3 | 本型号无实拍；本型号无实拍；本型号无实拍；安装逻辑正确 |
| 9008S | 4 | 本型号无实拍；本型号无实拍；本型号无实拍；安装逻辑正确；本型号无实拍 |
| 9011E | 3 | 本型号无实拍；本型号无实拍；本型号无实拍；安装逻辑正确 |
| 9014 | 1 | 本型号无实拍；图中是四舌锁体、钥匙锁芯和 5 款不同执手，和规格写的浴室隐私功能（内侧旋钮）矛盾 |
| 9014S | 3 | 本型号无实拍；本型号无实拍；本型号无实拍；安装逻辑正确 |
| 9015 | 4 | 本型号无实拍；本型号无实拍；本型号无实拍；安装逻辑正确；本型号无实拍；本图执手为扁平弧形、无颈部折弯，与同型号其它渲染图（圆管折弯执手）轮廓不一致 |
| 9020S | 3 | 本型号无实拍；本型号无实拍；本型号无实拍；安装逻辑正确 |
| 9080E | 4 | 本型号无实拍；本型号无实拍；本型号无实拍；双开防火门，执手在活动扇碰口边，指向远离门边；本型号无实拍；执手靠锁边、方向正确 |
| 9082E | 4 | 本型号无实拍；面板、U 形执手、锁孔与尺寸图不矛盾；本型号无实拍；本型号无实拍；执手在双开门活动扇碰口边，画面中执手很小，无法核对细节；本型号无实拍；安装逻辑正确 |
| AAH024 | 6 | 本型号无实拍；每片 3 孔，与尺寸图不矛盾；本型号无实拍；本型号无实拍；本型号无实拍；本型号无实拍；三片各 3 颗螺钉，与渲染图孔数一致；本型号无实拍；“360°”旋转说法没有依据（装上门后不可能转 360°）；无认证类声明 |
| BH09 | 3 | 本型号无实拍；圆头底板 4 钩，与尺寸图一致；本型号无实拍；只能看到 3 个挂钉，第 4 个可能被毛巾挡住；本型号无实拍 |
| BH12 | 3 | 本型号无实拍；外形与尺寸图一致；本型号无实拍；本型号无实拍 |
| BH38 | 2 | 全为CG图，无实拍；与尺寸图（圆座48mm、8mm扁钢）无矛盾；全为CG图，无实拍；与尺寸图（圆座48mm、8mm扁钢）无矛盾 |
| BH39 | 3 | 全为CG图，无实拍；与尺寸图（方座45mm）无矛盾；无实拍；挂钩方座造型与CG图、尺寸图一致；全为CG图，无实拍；与尺寸图（方座45mm）无矛盾 |
| BH40 | 3 | 全为CG图，无实拍；黑色单一表面，与尺寸图无矛盾；无实拍；黑色方座挂钩与CG图一致；全为CG图，无实拍；黑色单一表面，与尺寸图无矛盾 |
| BH41 | 3 | 全为CG图，无实拍；与尺寸图45×18.5mm无矛盾；无实拍；方座挂钩与CG图一致（钩体被毛巾遮挡）；全为CG图，无实拍；与尺寸图45×18.5mm无矛盾 |
| BH42 | 3 | 全为CG图，无实拍；与尺寸图圆座48mm无矛盾；无实拍；圆座挂钩与CG图一致；全为CG图，无实拍；与尺寸图圆座48mm无矛盾 |
| BH50 | 2 | 本型号全为CG图，无实拍；与尺寸图无矛盾；无实拍；双层架、底层两挂钩与尺寸图一致 |
| BH51 | 3 | 本型号全为CG图，无实拍；与尺寸图无矛盾；无实拍；单层架与CG图一致；本型号全为CG图，无实拍；与尺寸图无矛盾 |
| BH52 | 3 | 本型号全为CG图，无实拍；与尺寸图无矛盾；本型号全为CG图，无实拍；与尺寸图无矛盾；无实拍；双层转角架与CG图一致 |
| BH53 | 4 | 本型号全为CG图，无实拍；与尺寸图无矛盾；无实拍；转角架与CG图一致；瓶身文字；无实拍；转角架与CG图一致；CG图，镜面抛光与同型号其他图（拉丝）表面不一致 |
| BH55 | 7 | 本型号全为CG图，无实拍；与尺寸图350×350无矛盾；本型号全为CG图，无实拍；与尺寸图350×350无矛盾；本型号全为CG图，无实拍；与尺寸图350×350无矛盾；配件CG图，无实拍可对照；无实拍；折叠座外形与CG图一致，装于淋浴区墙面；无实拍；折叠座外形与CG图一致，装于淋浴区墙面；无实拍；折叠座外形与CG图一致，装于淋浴区墙面 |
| BH56 | 5 | 本型号全为CG图，无实拍；本型号全为CG图，无实拍；本型号全为CG图，无实拍；无实拍；黑杆白支撑与CG图一致，装于马桶侧墙；无实拍；扶手与CG图一致 |
| BH57 | 6 | 本型号全为CG图，无实拍；本型号全为CG图，无实拍；本型号全为CG图，无实拍；本型号全为CG图，无实拍；无实拍；“Braked movement / Strong support”为未核实功能声明，无认证标志；无实拍；马桶两侧双杆翻折扶手与CG图一致 |
| BH58 | 4 | 本型号全为CG图，无实拍；无实拍；扶手与CG图一致，装于马桶侧；本型号全为CG图，无实拍；无实拍；“CONTROLLED LOWERING”为未核实功能声明 |
| D101 DSPB | 2 | 无实拍；本型号全部为生成图；无实拍；拧钮与1610一致 |
| DS01 | 3 | 规格材质为不锈钢且未列表面，图为金色；底座 3 孔与尺寸图一致；底座 3 孔、Ø24 胶头与尺寸图一致；装在踢脚线上、胶头顶门面，逻辑合理；与渲染图一致 |
| DS010 | 5 | 无防转销，而 -4 图底部有销，同型号两图结构不一；底部有防转销，其他视图没有；地装在门扇摆动路径上，逻辑合理 |
| DS011 | 4 | 画成单体滚柱式碰珠，与 -2 图的双钢珠+T 形扣板结构不同，同型号两图矛盾；双钢珠碰珠装柜框、扣板装柜门，逻辑合理；碰珠在层板下、扣板在门顶，逻辑合理 |
| DS013 | 2 | 门装下压式门顶，胶脚着地，逻辑合理 |
| DS02 | 2 | 墙装于踢脚线，胶头顶门面，逻辑合理 |
| DS022 | 2 | 墙装，胶头顶门面，逻辑合理 |
| DS05 | 3 | 地装于门扇摆动路径，逻辑合理 |
| DS09 | 2 | 地装，胶头朝门，逻辑合理 |
| Dust Proof 01 | 1 | — |
| DV09 | 1 | — |
| H102 | 2 | H102 无实拍，仅渲染图；与 H101 实拍结构一致；H102 无实拍；场景安装逻辑（锁边、锁扣在门框）无矛盾 |
| Keyed Deadbolt Lock Set | 2 | 无实拍；未见认证标识文字；无实拍；与本型号渲染图矛盾：场景为哑黑执手而非缎面不锈钢球锁/拉手套装，锁舌黄铜与黑色面板两种饰面 |
| LH852 GMBK | 5 | 枪灰色无实拍；结构与LH852 BNBK/BNET实拍一致，疑为实拍改色；枪灰色无实拍；结构与LH852 BNBK/BNET实拍一致，疑为实拍改色；枪灰色无实拍；尺寸(35-45mm门厚、60/70mm背距、120mm)与LH852尺寸图一致；枪灰色无实拍；零件数与LH852 BNBK配件图一致；枪灰色无实拍；执手、方底座、隐私旋钮与LH852实拍一致 |
| brazil-collection | 13 | OEM 目录渲染图，该型号站内仅此一图，无实拍可对照；数据中 BR1-D 颜色为 black，图中推杠为灰/白色，与自身规格不符；OEM 目录渲染图，该型号站内仅此一图，无实拍可对照；OEM 目录渲染图，该型号站内仅此一图，无实拍可对照；OEM 目录渲染图，该型号站内仅此一图，无实拍可对照（黑色推杠+外侧执手小圆图）；OEM 目录渲染图，该型号站内仅此一图，无实拍可对照；OEM 目录渲染图，该型号站内仅此一图，无实拍可对照；OEM 目录渲染图，该型号站内仅此一图，无实拍可对照；OEM 目录渲染图，该型号站内仅此一图，无实拍可对照；OEM 目录渲染图，该型号站内仅此一图，无实拍可对照；OEM 目录渲染图，该型号站内仅此一图，无实拍可对照；OEM 目录渲染图，该型号站内仅此一图，无实拍可对照；OEM 目录渲染图，该型号站内仅此一图，无实拍可对照；OEM 目录渲染图，该型号站内仅此一图，无实拍可对照 |

## 五、实拍图里顺带发现的问题

实拍照片只记类型，不做对照。下面这几张是审图时顺带看到的，需要另外处理：

| # | 图片 | 问题 |
|---:|---|---|
| 2397 | products/s564-night-latch-and-rim-lock.webp（S564 主图） | 画面中央有第三方品牌水印「STAHLOCK」，线上主图可见（已人工复看确认） |
| 2481 | products/x2-panic-exit-device-trim.webp（X2 主图） | 只拍了一个外装锁芯；这个型号是推杠的外侧执手套件，图和产品对不上 |
| 466 | products/575-acet-tubular-lock.webp（575 ACET 主图） | 照片是古铜色；规格写的是红古铜（US11），颜色要核对 |
| 607 | products/5870-sset-heavy-duty-cylindrical-lock-2.webp | 5870 SSET（不锈钢）页面上的图，同框还有一只古铜执手 |
| 1399 | products/bh24-paper-towel-dispenser-3.webp | 带椭圆视窗，和 BH24 主图不是同一个版本 |
| 1432 | products/bh31-two-tier-corner-shower-basket.webp（BH31 主图） | 看不到挂钩；同型号另一张图和尺寸图都有挂钩 |
| 1841 | products/f101-glass-door-patch-fittings-7.webp | 在 F101 页面上，安装位置图里标的却是 F112 |
| 2741 | editorial/hyde-hero-lockcase.webp（锁体对比页首图） | 说明文件称「只用 LC14 一张原图、保留原像素」，实际是四只锁体的重绘图，和 LC14 原图对不上（已人工复看确认） |

## 六、判定的把握和局限

- **白底图分不清实拍还是渲染**：供应商给的白底图里，有一部分做得像渲染。这类共标了 165 张「把握低」（在 all-images.csv 的「判定把握」一列）。如果把其中一张实拍误判成渲染，那个型号可能被错列到「无实拍可对照」。
- **推拉面靠透视判断**：看画面里能不能看到合页轴来判断推面还是拉面。只因为这一条判不通过的（例如 186、221、238、300、340、362），建议人工再看一眼。
- **中心距、比例是目测估算**：没有逐张量背距和中心距。只有偏差明显（大约 1.4 倍以上）才判不通过。
- **口径偏严的两类**：
  - 场景里加了这个型号不含的执手或锁（「拼成一套」），一律判不通过。
  - 黄铜锁芯配缎面面板这类搭配，规格里写了「黄铜锁芯」的就没有判。
- **不在范围内**：RAYEN 站、社交分享图（share/）、公司和工厂照片、品牌 logo。

## 七、建议处理顺序

1. **首页上的图先换**：
   - hero-civic-corridor（双开门推杠是生成的）
   - argentina-ar4-entry（门边面板上开了锁芯孔）
   - stories/9014/one-take-poster（缺紧定螺丝，底座画成平板）
2. **带未核实认证、性能说法的图下架**：约 28 张，有 CE、UL、EN 1125、防火图标、ABNT P-90、承重和 dB 数字。
3. **两张主图换掉**：
   - 6068（渲染图孔位和实拍不一样）
   - 19-130MM（底板 2 个孔，实拍和尺寸图都是 4 个）
4. **S564 主图去掉 STAHLOCK 水印**，X2 主图换图。
5. **其余不通过的图库图从图库里撤下**：实拍还在，型号页不会空。
6. **「无实拍可对照」的 62 个型号 / 组补拍实物**：拍好以后，用实拍对照它们现有的渲染图。
