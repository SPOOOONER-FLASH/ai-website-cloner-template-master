# 给 Codex：换掉审计没过的 20 张编辑图、场景图（2026-10-18）

## 来由

- 甲方 10-14 让我们审全站的图，审计报告在 `docs/research/image-audit/REPORT.md`。
- 10-18 甲方回「CONTINUE」，同意按报告第七节撤图、换图。
- 产品页上的图由 Claude 直接撤（任务 97，`scripts/apply-image-audit.mjs`）。
- 下面这 20 张是编辑图、场景图和专栏图，属于视觉，归 Codex。

## 先做

**首页的 3 张**（page 列是 `/` 的那几行）：hero-civic-corridor、argentina-ar4-entry、stories/9014/one-take-poster。

## 规矩

- 照 `docs/collaboration/ai-image-standard.md`，五金逻辑照 `docs/knowledge/hardware/`。
- 换上来的图逐张对照实拍：孔位、螺丝、轮廓、比例、锁芯、零件数、表面、安装逻辑。
- 一项对不上就用实拍。
- 做不出合格的，就把那一格换成该型号的实拍白底图，或者干脆撤掉那一格。不要留着错图。
- 换完以后：
  1. 在 `docs/research/image-audit/verdicts.json` 里给新图写判定；
  2. 运行 `node scripts/audit-site-images.mjs` 重出报告；
  3. 首页的位图要带 srcset。

## 清单

| 图片 | 用在哪个页面（示例） | 用到的页面数 | 问题 |
|---|---|---:|---|
| brazil-collection/br1-dl.webp | /products/brazil/ | 2 | 带钥匙的外侧执手画在与推杠同一面（推侧），且明显高于推杠；外侧执手应装在拉侧 |
| editorial/architecture-boutique-hotel.webp | /projects/hospitality-residential-door-package/ | 10 | 生成场景中木门上的古铜色长板执手为生成产物，无法对应任何 HYDE 型号 |
| editorial/argentina-ar4-entry.webp | / | 19 | 黄铜锁面板上开有欧式锁芯孔（锁芯不可能在门边面板上）；AR4 面板只有斜舌/方舌孔和螺钉孔；执手亦为生成，无法对应 AR4 型号 |
| editorial/hero-civic-corridor.webp | / | 10 | 远景双开门上的执手/锁为生成产物，无法对应任何型号 |
| editorial/home-design-context.webp | /projects/glass-entrance-hardware-package/ | 10 | 木门上的黑色长板执手为生成产物，无法对应任何型号 |
| editorial/hyde-editorial-product-range-07.webp | /news/ | 20 | 执手锁、球锁及散件均为生成产物，无法对应型号（球体、底座、锁舌与 587 系列实拍不同）；两套锁已各带斜舌又另放一只斜舌，部件数不合理 |
| editorial/hyde-hero-lockcase.webp | /compare/lock-cases/ | 20 | sidecar 称源图为单只 lc14 尺寸图且保留原像素，实际是四只锁体的重绘图；出现黑色面板款，实拍只有银/古铜/银/白四款面板；锁体外形与实拍不同 |
| editorial/industrial-precision-parts.webp | /projects/commercial-fire-egress-hardware/ | 10 | 生成的机加工金属件（V 形块、角码、垫圈等），不是任何 HYDE 产品，属想象的金属件 |
| editorial/news-door-schedule-doors.webp | /news/ | 20 | 走廊各门执手与尽头双开门拉手均为生成产物，无法对应型号 |
| editorial/news-exit-device-standards-2026.webp | /news/ | 20 | 生成的展会场景：木门上的银色推杠两端支座同形，没有 305 的大锁头壳体，无法对应型号；灰门红色推杠近似 310，但为生成产物，无法核对 |
| editorial/news-mortise-lock-inspection.webp | /news/ | 20 | 生成的插芯锁体及散落的 L 形件，无法对应任何 HYDE 型号 |
| editorial/project-commercial-egress.webp | /projects/ | 20 | 两樘双开门上的推杠为生成产物，无法对应型号 |
| editorial/project-glass-entrance.webp | /projects/ | 30 | 玻璃门夹与地弹簧为生成产物，无法对应型号；两扇玻璃门没有拉手 |
| editorial/project-hospitality-residential.webp | /projects/ | 20 | 走廊木门上的黑色执手为生成产物，无法对应型号 |
| product-studies/14-source-hyde-ar4-110-mortise-lock-1440.webp | /product-studies/ | 10 | 板面写 Nominal lock body 68 × 40 mm，规格中 68/40 是中心距/后距，锁体为 127.3×60.8mm |
| product-studies/14-source-hyde-ar4-110-mortise-lock-720.webp | /product-studies/ | 10 | 同 1440 版：Nominal lock body 68 × 40 mm 与规格锁体 127.3×60.8mm 不符 |
| product-studies/19-source-310-panic-exit-device-1440.webp | /product-studies/ | 10 | 板面写 Material: Iron，规格为铝合金本体+铁杆 |
| product-studies/19-source-310-panic-exit-device-720.webp | /product-studies/ | 10 | 同 1440 版：Material: Iron 与规格（铝合金本体+铁杆）不符 |
| stories/9014/detail-corner.webp | /stories/9014/ | 1 | 画面是方截面、带分层棱边的部件；9014 实拍为 Ø19 圆管执手配圆底座，没有这种棱角 |
| stories/9014/one-take-poster.webp | / | 2 | 执手颈部缺少实拍可见的紧定螺丝；圆底座画成平板圆盘，实拍为带凸台的分层底座；标注 135·60·Ø19 与规格一致 |
