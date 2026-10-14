# 给 Codex 的补图清单：阿里爆品 + 新上产品

生成：`node scripts/build-image-fill-list.mjs --write`（数字每次重跑重取，不要手改）。阿里数据：甲方 2026-09-11 导出；「新上」= 2026-09-13 以后新建、在 HYDE 站上的产品记录，加阿根廷、巴西两个专栏。

## Codex 开工前必读（AGENTS.md 硬规则）

- **规矩（2026-10-13 甲方更新）见 `docs/collaboration/tasks/2026-10-13-codex-scene-compositing.md`：** 可以用实拍产品图合成场景图、安装效果图，**产品本身也可以渲染**（3D 或 AI 重渲染），但要以该型号在网站上的全部实拍图和公布尺寸为依据，并且逐张和实拍图对照：孔位、螺丝、轮廓、比例、零件数都对上才能交。照片里看不到的部分不能补画。场景、搭配、安装位置、朝向、比例要符合五金常识。
- 每张交付图要写清：型号、slug、用的哪张原图（路径 + 哈希）、场景说明、逐张目检结论（对照原图检查孔位轮廓，再检查安装逻辑）。
- **取图位置：网站自己的产品图库** `public/images/products/<slug>[-N].webp`（干净无水印，后台 /admin/ 的媒体目录）；型号对应哪几张看 `content/products/<slug>.json` 的 heroImage / gallery。不要用加了水印的 products-hyde 做合成源，也不再用 G 盘。
- 先给甲方看 5 张样图（每个型号建议 1 张 KANEE 式氛围图 + 1 张安装效果图），方向定了再批量做。KANEE 图册：桌面 hyde/03-研究与方案/KANEE凯理五金2025产品图册.pdf，只学版式和光影。
- 新图作为新增角度加入图库（例如 `<slug>-scene-1.webp`），不覆盖已有实拍白底图；交付后跑水印和 srcset，发布交给工程会话。

## 一、阿里爆品（43 个，按询盘、再按曝光排）

| # | 型号 | 站上文件名 slug | 询盘(90天) | 曝光(30天) | 站上照片 | 主图宽 | 要补什么 |
|---:|---|---|---:|---:|---:|---:|---|
| 1 | **307** | `307-panic-exit-device` | 5 | 63 | 10 | 1000 | 可做 KANEE 精修/多角度 |
| 2 | **311** | `311-panic-exit-device` | 4 | 40 | 10 | 1000 | 可做 KANEE 精修/多角度 |
| 3 | **6068** | `6068-mortise-lever-handle-lock` | 3 | 119 | 2 | 1000 | 仅 2 张 |
| 4 | **305** | `305-fire-door-panic-exit-device` | 3 | 77 | 8 | 1000 | 可做 KANEE 精修/多角度 |
| 5 | **564** | `564-night-latch-and-rim-lock` | 2 | 60 | 6 | 1000 | 可做 KANEE 精修/多角度 |
| 6 | **587 SS ET** | `587-sset-light-duty-cylindrical-lock` | 2 | 18 | 6 | 1000 | 可做 KANEE 精修/多角度 |
| 7 | **5836** | `5836-night-latch-and-rim-lock` | 1 | 50 | 6 | 1000 | 可做 KANEE 精修/多角度 |
| 8 | **035** | `035-panic-exit-device-trim` | 1 | 26 | 5 | 1000 | 可做 KANEE 精修/多角度 |
| 9 | **SSH016** | `ssh016-brass-and-steel-hinges` | 0 | 36 | 7 | 1000 | 可做 KANEE 精修/多角度 |
| 10 | **587 SS ET** | `587-sset-light-duty-cylindrical-lock` | — | 34 | 6 | 1000 | 可做 KANEE 精修/多角度 |
| 11 | **102** | `102-glass-door-handle` | 0 | 32 | 4 | 1000 | 可做 KANEE 精修/多角度 |
| 12 | **607 SSET** | `607-sset-tubular-lock` | 0 | 26 | 6 | 1000 | 可做 KANEE 精修/多角度 |
| 13 | **DC02** | `dc02-door-coordinator` | 0 | 24 | 7 | 1000 | 可做 KANEE 精修/多角度 |
| 14 | **316-S** | `316-s-panic-exit-device` | 0 | 19 | 8 | 1000 | 可做 KANEE 精修/多角度 |
| 15 | **9014S** | `9014s-stainless-steel-handle` | 0 | 18 | 4 | 1000 | 可做 KANEE 精修/多角度 |
| 16 | **307** | `307-panic-exit-device` | 0 | 16 | 10 | 1000 | 可做 KANEE 精修/多角度 |
| 17 | **F101** | `f101-glass-door-patch-fittings` | 0 | 13 | 7 | 1000 | 可做 KANEE 精修/多角度 |
| 18 | **LH1016** | `lh1016-stainless-steel-handle` | 0 | 8 | 4 | 1000 | 可做 KANEE 精修/多角度 |
| 19 | **9010E** | `9010e-stainless-steel-handle` | 0 | 6 | 5 | 1000 | 可做 KANEE 精修/多角度 |
| 20 | **026** | `026-panic-exit-device-trim` | 0 | 5 | 7 | 1000 | 可做 KANEE 精修/多角度 |
| 21 | **NC013** | `nc013-stainless-steel-handle` | 0 | 5 | 5 | 1000 | 可做 KANEE 精修/多角度 |
| 22 | **9008S** | `9008s-stainless-steel-handle` | 0 | 3 | 5 | 1000 | 可做 KANEE 精修/多角度 |
| 23 | **301** | `301-panic-exit-device` | 0 | 3 | 7 | 1000 | 可做 KANEE 精修/多角度 |
| 24 | **9007 E** | `9007e-stainless-steel-handle` | 0 | 1 | 6 | 1000 | 可做 KANEE 精修/多角度 |
| 25 | **9021** | `9021-stainless-steel-handle` | 0 | 1 | 5 | 1000 | 可做 KANEE 精修/多角度 |
| 26 | **9007E** | `9007e-stainless-steel-handle` | 0 | 1 | 6 | 1000 | 可做 KANEE 精修/多角度 |
| 27 | **NC046** | `nc046-stainless-steel-handle` | 0 | 1 | 5 | 1000 | 可做 KANEE 精修/多角度 |
| 28 | **309-S** | `309-s-s-panic-exit-device` | 0 | 0 | 6 | 1000 | 可做 KANEE 精修/多角度 |

站上没有对应页面的阿里产品（15 个）—— 先建页面再谈图，这不是 Codex 的活：

- （无型号）：Hotel/Garage Main Master Key Hyland OEM Brass Cylinder Key Three /two Groups Com（询盘 3，曝光 256）
- （无型号）：American Standard Deadlatch Lock Key for Aluminum Storefront Doors Narrow Stile （询盘 3，曝光 48）
- 310+015：Push bar Panic Exit Device with Outside Handle, Hyland OEM 310+015, Door Lock fo（询盘 2，曝光 134）
- （无型号）：HYLAND OEM 90MM Tubular Lock Latch Cerradura De Puerta. Entry Door Lock Latch（询盘 2，曝光 57）
- （无型号）：Matte Black Euro-standard Door Lock Cylinder Hyland OEM, 70mm Length Solid Brass（询盘 2，曝光 47）
- （无型号）：Door Lock Cylinder Keys, Universal Blank Key Hyland OEM, Brass Material Normal K（询盘 1，曝光 309）
- 308：Hyland 308 Zinc Alloy Panic Exit Device Push Bar Fire Door Hardware EN1125 CE Em（询盘 1，曝光 37）
- 1073 DL：Smart Door Lock Rim Gate Door Lock Hyland OEM CE 1073 DL Double Cylinder Left Op（询盘 0，曝光 35）
- 9087：HYLAND OEM 9087 Security 4-Round Bolt Lock Case 85mm Center 50/60mm Backset（询盘 0，曝光 13）
- （无型号）：HYLAND 035 / Panic Exit Device Lever Trim Keyed Fire Door Lock ANSI Grade 2 Zinc（询盘 0，曝光 9）
- （无型号）：Heavy Duty Tubular Lever Handle Keyless Door Lock Bathroom Privacy Lockset Zinc （询盘 0，曝光 6）
- LH1033：HYLAND OEM LH1033 SUS304 Stainless Steel Modern Lever Handle Lock Easy Installat（询盘 0，曝光 6）
- （无型号）：Zinc Alloy Tubular Lever Set Door Lock HYLAND OEM Heavy-Duty Wooden Door Lock Ad（询盘 0，曝光 4）
- （无型号）：Heavy Duty Tubular Privacy Lever Handle Door Lock Zinc Alloy Bathroom Bedroom Do（询盘 0，曝光 2）
- F100：HYLAND F100 SS Bisagra De Piso Double Accion Para Puertas De Vaiven Heavy Duty H（询盘 —，曝光 —）

## 二、新上产品（42 个，照片最少的排前面）

无图 0 个；仅 1 张 28 个；主图小于 800px 4 个。

| 型号 | 站上文件名 slug | 类目 | 上架 | 照片 | 主图宽 | 要补什么 |
|---|---|---|---|---:|---:|---|
| D-1031 | `d-1031-floor-spring` | floor-springs-and-pivots | 2026-09-14 | 1 | 1057 | 仅 1 张 |
| D-1032 | `d-1032-floor-spring` | floor-springs-and-pivots | 2026-09-14 | 1 | 1057 | 仅 1 张 |
| D-1033 | `d-1033-floor-spring` | floor-springs-and-pivots | 2026-09-14 | 1 | 1057 | 仅 1 张 |
| D-1042 | `d-1042-glass-door-top-patch` | floor-springs-and-pivots | 2026-09-14 | 1 | 626 | 仅 1 张、主图 626px 偏小 |
| D-1043 | `d-1043-glass-door-top-patch` | floor-springs-and-pivots | 2026-09-14 | 1 | 621 | 仅 1 张、主图 621px 偏小 |
| D-1051 | `d-1051-floor-spring` | floor-springs-and-pivots | 2026-09-14 | 1 | 1057 | 仅 1 张 |
| D-1067 | `d-1067-floor-spring` | floor-springs-and-pivots | 2026-09-14 | 1 | 1057 | 仅 1 张 |
| D-1068 | `d-1068-floor-spring` | floor-springs-and-pivots | 2026-09-14 | 1 | 1057 | 仅 1 张 |
| D-3001 | `d-3001-floor-spring` | floor-springs-and-pivots | 2026-09-14 | 1 | 1057 | 仅 1 张 |
| D-3002 | `d-3002-floor-spring` | floor-springs-and-pivots | 2026-09-14 | 1 | 1057 | 仅 1 张 |
| D-3010 | `d-3010-top-pivot` | floor-springs-and-pivots | 2026-09-14 | 1 | 1057 | 仅 1 张 |
| D-3011 | `d-3011-top-pivot` | floor-springs-and-pivots | 2026-09-14 | 1 | 1057 | 仅 1 张 |
| D-3011A | `d-3011a-top-pivot` | floor-springs-and-pivots | 2026-09-14 | 1 | 1057 | 仅 1 张 |
| D-3012 | `d-3012-floor-spring` | floor-springs-and-pivots | 2026-09-14 | 1 | 1057 | 仅 1 张 |
| D-3013 | `d-3013-floor-spring` | floor-springs-and-pivots | 2026-09-14 | 1 | 1057 | 仅 1 张 |
| D-3015 | `d-3015-floor-spring` | floor-springs-and-pivots | 2026-09-14 | 1 | 1057 | 仅 1 张 |
| D-3016 | `d-3016-floor-spring` | floor-springs-and-pivots | 2026-09-14 | 1 | 1057 | 仅 1 张 |
| D-3017 | `d-3017-glass-door-top-patch` | floor-springs-and-pivots | 2026-09-14 | 1 | 702 | 仅 1 张、主图 702px 偏小 |
| D-3018 | `d-3018-glass-door-top-patch` | floor-springs-and-pivots | 2026-09-14 | 1 | 702 | 仅 1 张、主图 702px 偏小 |
| D-3019 | `d-3019-top-pivot` | floor-springs-and-pivots | 2026-09-14 | 1 | 1057 | 仅 1 张 |
| D-3021 | `d-3021-top-pivot` | floor-springs-and-pivots | 2026-09-14 | 1 | 1057 | 仅 1 张 |
| D-5061 | `d-5061-floor-spring` | floor-springs-and-pivots | 2026-09-14 | 1 | 1057 | 仅 1 张 |
| D-5062 | `d-5062-floor-spring` | floor-springs-and-pivots | 2026-09-14 | 1 | 1057 | 仅 1 张 |
| D-5063 | `d-5063-floor-spring` | floor-springs-and-pivots | 2026-09-14 | 1 | 1057 | 仅 1 张 |
| DZ-2031 | `dz-2031-floor-spring` | floor-springs-and-pivots | 2026-09-14 | 1 | 1057 | 仅 1 张 |
| DZ-2039 | `dz-2039-floor-spring` | floor-springs-and-pivots | 2026-09-14 | 1 | 1057 | 仅 1 张 |
| DZ-2086 | `dz-2086-floor-spring` | floor-springs-and-pivots | 2026-09-14 | 1 | 1057 | 仅 1 张 |
| DZ-2087 | `dz-2087-floor-spring` | floor-springs-and-pivots | 2026-09-14 | 1 | 1057 | 仅 1 张 |
| BH15-100mm | `bh15-100mm-barrel-bolt` | hardware-accessories | 2026-09-24 | 4 | 1000 | — |
| BH15-80mm | `bh15-80mm-barrel-bolt` | hardware-accessories | 2026-09-24 | 4 | 1000 | — |
| BH58 | `bh58-flip-up-grab-bar` | care-grab-bars | 2026-09-24 | 5 | 1000 | — |
| BH56 | `bh56-flip-up-grab-bar` | care-grab-bars | 2026-09-24 | 6 | 1000 | — |
| BH57 | `bh57-double-flip-up-grab-bar` | care-grab-bars | 2026-09-24 | 6 | 1000 | — |
| LH852 GMBK | `lh852-gmbk-lever-handle` | lever-handles | 2026-09-14 | 6 | 1000 | — |
| 9088 SS | `9088-ss-stainless-steel-handle` | stainless-steel-handles | 2026-09-23 | 7 | 1000 | — |
| 306-S | `306-s-panic-exit-device` | panic-exit-devices | 2026-09-21 | 7 | 800 | — |
| BH55 | `bh55-fold-down-shower-seat` | care-grab-bars | 2026-09-24 | 8 | 1000 | — |
| 306 PS | `306-ps-panic-exit-device` | panic-exit-devices | 2026-09-21 | 9 | 800 | — |
| 306-D | `306-d-panic-exit-device` | panic-exit-devices | 2026-09-21 | 9 | 800 | — |
| 8829 BL | `8829-bl-lever-handle` | lever-handles | 2026-10-11 | 10 | 1000 | — |
| SH02 | `sh02-spring-hinge-pin` | brass-steel-hinges | 2026-10-11 | 10 | 1000 | — |
| D104 SS | `d104-ss-deadbolts` | deadbolts | 2026-10-11 | 11 | 1000 | — |

## 三、两个市场专栏（客户授权的 OEM 照片，已去字加 HYDE 水印）

这些图来自下游客户的产品照，每个型号只有 1 张。补图同样只能用真实照片：要么我们工厂自己拍同款，要么在现有照片上精修，**不要换成生成图**。

### 阿根廷专栏（55 款，页面 /products/argentina/）

只有 1 张或没有图：55 款。主图小于 800px：55 款。

| 型号 | 照片 | 主图宽 | 备注 |
|---|---:|---:|---|
| AR5-115 | 1 | 720 | 主图 720px 偏小 |
| AR5-122 | 1 | 720 | 主图 720px 偏小 |
| AR5-117 | 1 | 720 | 主图 720px 偏小 |
| AR5-103 | 1 | 720 | 主图 720px 偏小 |
| AR5-102 | 1 | 720 | 主图 720px 偏小 |
| AR5-110 | 1 | 720 | 主图 720px 偏小 |
| AR5-111 | 1 | 720 | 主图 720px 偏小 |
| AR5-114 | 1 | 720 | 主图 720px 偏小 |
| AR5-116 | 1 | 720 | 主图 720px 偏小 |
| AR5-100 | 1 | 720 | 主图 720px 偏小 |
| AR5-101 | 1 | 720 | 主图 720px 偏小 |
| AR5-123 | 1 | 720 | 主图 720px 偏小 |
| AR5-118 | 1 | 720 | 主图 720px 偏小 |
| AR5-120 | 1 | 720 | 主图 720px 偏小 |
| AR5-121 | 1 | 720 | 主图 720px 偏小 |
| AR5-Due | 1 | 720 | 主图 720px 偏小 |
| AR5-124 | 1 | 720 | 主图 720px 偏小 |
| AR5-125 | 1 | 720 | 主图 720px 偏小 |
| AR5-126 | 1 | 720 | 主图 720px 偏小 |
| AR5-2000 | 1 | 720 | 主图 720px 偏小 |
| AR5-104 | 1 | 720 | 主图 720px 偏小 |
| AR5-105 | 1 | 720 | 主图 720px 偏小 |
| AR5-106 | 1 | 720 | 主图 720px 偏小 |
| AR5-107 | 1 | 720 | 主图 720px 偏小 |
| AR5-108 | 1 | 720 | 主图 720px 偏小 |
| AR5-119 | 1 | 720 | 主图 720px 偏小 |
| AR5-119 | 1 | 720 | 主图 720px 偏小 |
| AR5-109 | 1 | 720 | 主图 720px 偏小 |
| AR5-112 | 1 | 720 | 主图 720px 偏小 |
| AR5-113 | 1 | 720 | 主图 720px 偏小 |
| AR5-119 | 1 | 720 | 主图 720px 偏小 |
| AR5-119 | 1 | 720 | 主图 720px 偏小 |
| AR5-119 | 1 | 720 | 主图 720px 偏小 |
| AR5-127 | 1 | 720 | 主图 720px 偏小 |
| AR5-127 | 1 | 720 | 主图 720px 偏小 |
| AR5-128 | 1 | 720 | 主图 720px 偏小 |
| AR5-901 | 1 | 720 | 主图 720px 偏小 |
| AR5-902 | 1 | 720 | 主图 720px 偏小 |
| AR5-112 | 1 | 720 | 主图 720px 偏小 |
| AR5-117 | 1 | 720 | 主图 720px 偏小 |
| AR5-109 | 1 | 720 | 主图 720px 偏小 |
| AR5-103 | 1 | 720 | 主图 720px 偏小 |
| AR5-102 | 1 | 720 | 主图 720px 偏小 |
| AR5-100 | 1 | 720 | 主图 720px 偏小 |
| AR5-101 | 1 | 720 | 主图 720px 偏小 |
| AR4-110 | 1 | 720 | 主图 720px 偏小 |
| AR4-110 FC | 1 | 720 | 主图 720px 偏小 |
| AR4-111 | 1 | 720 | 主图 720px 偏小 |
| AR4-111 DP | 1 | 720 | 主图 720px 偏小 |
| AR4-101 | 1 | 720 | 主图 720px 偏小 |
| AR4-102 | 1 | 720 | 主图 720px 偏小 |
| AR4-140 | 1 | 720 | 主图 720px 偏小 |
| AR4-1140 | 1 | 720 | 主图 720px 偏小 |
| AR4-1121 | 1 | 720 | 主图 720px 偏小 |
| AR4-1122 | 1 | 720 | 主图 720px 偏小 |

### 巴西专栏（40 款，页面 /products/brazil/）

只有 1 张或没有图：40 款。主图小于 800px：37 款。

| 型号 | 照片 | 主图宽 | 备注 |
|---|---:|---:|---|
| 306-S | 1 | 800 |  |
| 306-D | 1 | 800 |  |
| 306 PS | 1 | 800 |  |
| BR1-D | 1 | 720 | 主图 720px 偏小 |
| BR1-DL | 1 | 720 | 主图 720px 偏小 |
| BR1-DT | 1 | 720 | 主图 720px 偏小 |
| BR1-S | 1 | 720 | 主图 720px 偏小 |
| BR1-SK | 1 | 720 | 主图 720px 偏小 |
| BR1-SL | 1 | 720 | 主图 720px 偏小 |
| BR1-ST | 1 | 720 | 主图 720px 偏小 |
| BR1-STL | 1 | 720 | 主图 720px 偏小 |
| BR1-STV | 1 | 720 | 主图 720px 偏小 |
| BR1-TK | 1 | 720 | 主图 720px 偏小 |
| BR2-D | 1 | 720 | 主图 720px 偏小 |
| BR2-DK | 1 | 720 | 主图 720px 偏小 |
| BR2-SK | 1 | 720 | 主图 720px 偏小 |
| BR2-SL | 1 | 720 | 主图 720px 偏小 |
| BR2-T | 1 | 720 | 主图 720px 偏小 |
| BR2-TK | 1 | 720 | 主图 720px 偏小 |
| BR3-D | 1 | 720 | 主图 720px 偏小 |
| BR3-S | 1 | 720 | 主图 720px 偏小 |
| BR3-ST | 1 | 720 | 主图 720px 偏小 |
| BR5-S | 1 | 720 | 主图 720px 偏小 |
| BR5-TK | 1 | 720 | 主图 720px 偏小 |
| BR6-D | 1 | 720 | 主图 720px 偏小 |
| BR6-S | 1 | 720 | 主图 720px 偏小 |
| BR6-SM | 1 | 720 | 主图 720px 偏小 |
| BR6-T | 1 | 720 | 主图 720px 偏小 |
| BR7-D | 1 | 720 | 主图 720px 偏小 |
| BR7-DT | 1 | 720 | 主图 720px 偏小 |
| BR7-S | 1 | 720 | 主图 720px 偏小 |
| BR7-ST | 1 | 720 | 主图 720px 偏小 |
| BR7-STV | 1 | 720 | 主图 720px 偏小 |
| BR7-SV | 1 | 720 | 主图 720px 偏小 |
| BR7-T | 1 | 720 | 主图 720px 偏小 |
| BR8-D | 1 | 720 | 主图 720px 偏小 |
| BR8-DG | 1 | 720 | 主图 720px 偏小 |
| BR8-S | 1 | 720 | 主图 720px 偏小 |
| BR8-SG | 1 | 720 | 主图 720px 偏小 |
| BR8-TK | 1 | 720 | 主图 720px 偏小 |

