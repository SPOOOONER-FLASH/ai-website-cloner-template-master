# 产品主图一致性审计

生成：`node scripts/audit-product-plates.mjs`（2026-09-28），不要手改。
范围：HYDE 目录里有主图的 521 个产品，测量未加水印的原图。方法和阈值见脚本开头。
**只列问题，不改图**：修图归视觉会话，只允许清理真实照片（留白、居中、底色），不得生成或改动产品本身。

共 54 张需要看（占 10%）。

## 各品类基准

| 品类 | 产品数 | 主体占比中位 | 底边留白中位 | 底色 |
| --- | --- | --- | --- | --- |
| hardware-accessories | 69 | 0.805 | 0.18 | 白底 |
| knob-locks | 59 | 0.836 | 0.207 | 白底 |
| lock-cases | 51 | 0.902 | 0.047 | 白底 |
| lever-handles | 48 | 0.875 | 0.23 | 白底 |
| lock-cylinders | 45 | 0.801 | 0.211 | 白底 |
| panic-exit-devices | 44 | 0.871 | 0.156 | 白底 |
| stainless-steel-handles | 43 | 0.77 | 0.168 | 白底 |
| bathroom-accessories | 42 | 0.781 | 0.211 | 白底 |
| brass-steel-hinges | 29 | 0.766 | 0.117 | 白底 |
| night-latches-rim-locks | 25 | 0.867 | 0.281 | 白底 |
| glass-door-accessories | 23 | 0.852 | 0.094 | 白底 |
| grip-handle-sets | 14 | 0.887 | 0.051 | 白底 |
| deadbolts | 11 | 0.789 | 0.195 | 白底 |
| care-grab-bars | 8 | 0.926 | 0.25 | 白底 |
| door-closers | 7 | 0.801 | 0.102 | 白底 |
| sliding-hook-locks | 3 | 0.863 | 0.086 | 白底 |

## 需要看的图

| 品类 | 型号 | 图片 | 问题 |
| --- | --- | --- | --- |
| bathroom-accessories | BH10 | /images/products/bh10-robe-hook.webp | 主体偏小（0.516，品类中位 0.781） |
| bathroom-accessories | BH11 | /images/products/bh11-robe-hook.webp | 主体偏小（0.496，品类中位 0.781） |
| bathroom-accessories | BH41 | /images/products/bh41-robe-hook.webp | 主体偏小（0.531，品类中位 0.781） |
| bathroom-accessories | BH42 | /images/products/bh42-robe-hook.webp | 主体偏小（0.578，品类中位 0.781） |
| care-grab-bars | BH02 | /images/products/bh02-knurled-grab-bar.webp | 基线偏（底边留白 0.086，品类中位 0.25） |
| care-grab-bars | BH55 | /images/products/bh55-fold-down-shower-seat.webp | 不居中（x 0.01，y 0.152） |
| door-closers | JU-088 | /images/products/ju-088-door-closer.webp | 基线偏（底边留白 0.309，品类中位 0.102） |
| glass-door-accessories | F110 | /images/products/f110-glass-door-patch-fittings.webp | 基线偏（底边留白 0.25，品类中位 0.094） |
| glass-door-accessories | F111 | /images/products/f111-glass-door-patch-fittings.webp | 基线偏（底边留白 0.254，品类中位 0.094） |
| glass-door-accessories | F112 | /images/products/f112-glass-door-patch-fittings.webp | 基线偏（底边留白 0.293，品类中位 0.094） |
| glass-door-accessories | F113 | /images/products/f113-glass-door-patch-fittings.webp | 主体偏小（0.609，品类中位 0.852） |
| glass-door-accessories | F114 | /images/products/f114-glass-door-patch-fittings.webp | 基线偏（底边留白 0.254，品类中位 0.094） |
| glass-door-accessories | Stainless Steel Glass Door Pull Handle | /images/products/stainless-steel-glass-door-pull-handle.webp | 主体偏小（0.656，品类中位 0.852） |
| hardware-accessories | BH16 | /images/products/bh16-flat-slide-bolt.webp | 主体偏小（0.613，品类中位 0.805）；画面里有 1 处与主体分开的物件（散放配件，或旧 logo / 标注）；基线偏（底边留白 0.34，品类中位 0.18） |
| hardware-accessories | BH15-100mm | /images/products/bh15-100mm-barrel-bolt.webp | 基线偏（底边留白 0.363，品类中位 0.18） |
| hardware-accessories | BH15-80mm | /images/products/bh15-80mm-barrel-bolt.webp | 画面里有 1 处与主体分开的物件（散放配件，或旧 logo / 标注） |
| hardware-accessories | DV09 | /images/products/dv09-door-viewer.webp | 主体偏小（0.574，品类中位 0.805） |
| hardware-accessories | DV12-S | /images/products/dv12-s-door-viewer.webp | 主体偏小（0.5，品类中位 0.805） |
| hardware-accessories | HY-0SS | /images/products/hy-0ss-latch-guard.webp | 画面里有 2 处与主体分开的物件（散放配件，或旧 logo / 标注） |
| hardware-accessories | L002 | /images/products/l002-latch.webp | 主体偏小（0.609，品类中位 0.805） |
| knob-locks | Cylindrical Knob Lock | /images/products/cylindrical-knob-lock.webp | 主体偏小（0.633，品类中位 0.836） |
| knob-locks | Tubular Knob Lock | /images/products/tubular-knob-lock.webp | 主体偏小（0.625，品类中位 0.836） |
| lever-handles | EH02 | /images/products/eh02-lever-handle.webp | 基线偏（底边留白 0.047，品类中位 0.23） |
| lever-handles | EH03 | /images/products/eh03-lever-handle.webp | 基线偏（底边留白 0.031，品类中位 0.23） |
| lever-handles | Stainless Steel Lever Handle Lock | /images/products/stainless-steel-lever-handle-lock.webp | 主体偏小（0.656，品类中位 0.875） |
| lock-cases | 140 | /images/products/140-lock-case.webp | 主体贴边（0.973），可能被裁 |
| lock-cases | 6068 | /images/products/6068-mortise-lever-handle-lock.webp | 基线偏（底边留白 0.234，品类中位 0.047） |
| lock-cases | AR4-1121 | /images/products/argentina-ar4/hyde-ar4-1121.webp | 底色不是白（亮度 228） |
| lock-cases | AR4-140 | /images/products/argentina-ar4/hyde-ar4-140.webp | 底色不是白（亮度 230） |
| lock-cylinders | 47BSIK | /images/products/47bsik-lock-cylinder.webp | 主体偏小（0.555，品类中位 0.801） |
| lock-cylinders | 65SN | /images/products/65sn-lock-cylinder.webp | 基线偏（底边留白 0.051，品类中位 0.211） |
| lock-cylinders | 70 ACKT BK | /images/products/70-ackt-bk-lock-cylinder.webp | 主体偏小（0.586，品类中位 0.801） |
| lock-cylinders | 70 SNKT BK | /images/products/70-snkt-bk-lock-cylinder.webp | 主体偏小（0.566，品类中位 0.801） |
| lock-cylinders | 70BK | /images/products/70bk-lock-cylinder.webp | 主体偏小（0.617，品类中位 0.801） |
| lock-cylinders | 80 BSKT | /images/products/80-bskt-lock-cylinder.webp | 主体偏小（0.598，品类中位 0.801） |
| lock-cylinders | 90 BSKT | /images/products/90-bskt-lock-cylinder.webp | 主体偏小（0.594，品类中位 0.801） |
| lock-cylinders | 90 SNKT | /images/products/90-snkt-lock-cylinder.webp | 主体偏小（0.598，品类中位 0.801） |
| night-latches-rim-locks | 1073D | /images/products/1073d-night-latch-and-rim-lock.webp | 基线偏（底边留白 0.086，品类中位 0.281） |
| night-latches-rim-locks | 559 | /images/products/559-night-latch-and-rim-lock.webp | 主体贴边（0.988），可能被裁 |
| panic-exit-devices | 001 | /images/products/001-panic-exit-device-trim.webp | 主体偏小（0.66，品类中位 0.871） |
| panic-exit-devices | 026 | /images/products/026-panic-exit-device-trim.webp | 画面里有 6 处与主体分开的物件（散放配件，或旧 logo / 标注） |
| panic-exit-devices | 035 | /images/products/035-panic-exit-device-trim.webp | 基线偏（底边留白 0，品类中位 0.156） |
| panic-exit-devices | 300 | /images/products/300-panic-exit-device.webp | 基线偏（底边留白 0.363，品类中位 0.156） |
| panic-exit-devices | 306-S | /images/products/306-s-panic-exit-device.webp | 基线偏（底边留白 0.32，品类中位 0.156） |
| panic-exit-devices | 309-D | /images/products/309-d-double-door-panic-exit-device.webp | 不居中（x 0.121，y 0） |
| panic-exit-devices | 309-S | /images/products/309-s-s-panic-exit-device.webp | 基线偏（底边留白 0.34，品类中位 0.156） |
| panic-exit-devices | 310 | /images/products/310-panic-exit-device.webp | 基线偏（底边留白 0.375，品类中位 0.156） |
| stainless-steel-handles | 9007 | /images/products/9007-stainless-steel-handle.webp | 基线偏（底边留白 0.016，品类中位 0.168） |
| stainless-steel-handles | 9012E | /images/products/9012e-stainless-steel-handle.webp | 基线偏（底边留白 0.324，品类中位 0.168） |
| stainless-steel-handles | 9014 SSBK | /images/products/9014-ssbk-stainless-steel-handle.webp | 基线偏（底边留白 0.348，品类中位 0.168） |
| stainless-steel-handles | 9014 | /images/products/9014-stainless-steel-handle.webp | 画面里有 1 处与主体分开的物件（散放配件，或旧 logo / 标注） |
| stainless-steel-handles | LH1085 SS | /images/products/lh1085-ss-stainless-steel-handle.webp | 基线偏（底边留白 0.016，品类中位 0.168） |
| stainless-steel-handles | NC181 | /images/products/nc181-stainless-steel-handle.webp | 主体偏小（0.57，品类中位 0.77） |
| stainless-steel-handles | NCB | /images/products/ncb-stainless-steel-handle.webp | 主体偏小（0.574，品类中位 0.77） |
