# 产品主图一致性审计

生成：`node scripts/audit-product-plates.mjs`（2026-09-28），不要手改。
范围：HYDE 目录里有主图的 521 个产品，测量未加水印的原图。方法和阈值见脚本开头。
**只列问题，不改图**：修图归视觉会话，只允许清理真实照片（留白、居中、底色），不得生成或改动产品本身。

共 13 张需要看（占 2%）。

## 各品类基准

| 品类 | 产品数 | 主体占比中位 | 底边留白中位 | 底色 |
| --- | --- | --- | --- | --- |
| hardware-accessories | 69 | 0.805 | 0.176 | 白底 |
| knob-locks | 59 | 0.836 | 0.207 | 白底 |
| lock-cases | 51 | 0.902 | 0.047 | 白底 |
| lever-handles | 48 | 0.875 | 0.23 | 白底 |
| lock-cylinders | 45 | 0.805 | 0.207 | 白底 |
| panic-exit-devices | 44 | 0.875 | 0.145 | 白底 |
| stainless-steel-handles | 43 | 0.77 | 0.168 | 白底 |
| bathroom-accessories | 42 | 0.781 | 0.203 | 白底 |
| brass-steel-hinges | 29 | 0.766 | 0.117 | 白底 |
| night-latches-rim-locks | 25 | 0.867 | 0.281 | 白底 |
| glass-door-accessories | 23 | 0.852 | 0.094 | 白底 |
| grip-handle-sets | 14 | 0.887 | 0.051 | 白底 |
| deadbolts | 11 | 0.789 | 0.195 | 白底 |
| care-grab-bars | 8 | 0.93 | 0.25 | 白底 |
| door-closers | 7 | 0.801 | 0.102 | 白底 |
| sliding-hook-locks | 3 | 0.863 | 0.086 | 白底 |

## 需要看的图

| 品类 | 型号 | 图片 | 问题 |
| --- | --- | --- | --- |
| care-grab-bars | BH01 | /images/products/bh01-grab-bar-3.webp | 主体偏小（0.746，品类中位 0.93） |
| care-grab-bars | BH02 | /images/products/bh02-knurled-grab-bar.webp | 基线偏（底边留白 0.031，品类中位 0.25） |
| hardware-accessories | BH15-80mm | /images/products/bh15-80mm-barrel-bolt.webp | 画面里有 1 处与主体分开的物件（散放配件，或旧 logo / 标注）；基线偏（底边留白 0.328，品类中位 0.176） |
| hardware-accessories | BH16 | /images/products/bh16-flat-slide-bolt.webp | 主体偏小（0.621，品类中位 0.805）；画面里有 1 处与主体分开的物件（散放配件，或旧 logo / 标注） |
| hardware-accessories | HY-0SS | /images/products/hy-0ss-latch-guard.webp | 画面里有 2 处与主体分开的物件（散放配件，或旧 logo / 标注） |
| lock-cases | 6068 | /images/products/6068-mortise-lever-handle-lock.webp | 基线偏（底边留白 0.203，品类中位 0.047） |
| lock-cases | AR4-1121 | /images/products/argentina-ar4/hyde-ar4-1121.webp | 底色不是白（亮度 228） |
| lock-cases | AR4-140 | /images/products/argentina-ar4/hyde-ar4-140.webp | 底色不是白（亮度 230） |
| night-latches-rim-locks | 559 | /images/products/559-night-latch-and-rim-lock.webp | 主体贴边（0.988），可能被裁 |
| panic-exit-devices | 026 | /images/products/026-panic-exit-device-trim.webp | 画面里有 6 处与主体分开的物件（散放配件，或旧 logo / 标注） |
| panic-exit-devices | X2 | /images/products/x2-panic-exit-device-trim.webp | 基线偏（底边留白 0.305，品类中位 0.145） |
| stainless-steel-handles | 9007 | /images/products/9007-stainless-steel-handle.webp | 基线偏（底边留白 0.016，品类中位 0.168） |
| stainless-steel-handles | 9014 | /images/products/9014-stainless-steel-handle.webp | 画面里有 1 处与主体分开的物件（散放配件，或旧 logo / 标注） |
