# 阿里 43 个产品 · 出图清单

数据源：`docs/research/2026-09-11-alibaba-product-performance.json`（甲方本人导出，2026-09-11）。
这份文档是生成的 —— `npm run brief:images`，每次重跑，不要手改里面的数字。

## 三种「出图」，不能互相代替

| 类型 | 谁能做 | 条件 |
|---|---|---|
| **照片** | 只有工厂能拍 | 列出来是让缺口可见，**不是让人去生成** |
| **尺寸图** | 站上自动生成 | `build-dimension-drawings.mjs`，要先有公布尺寸 |
| **3D 模型** | 公布尺寸确定外形时 | 判据同 `audit-modelling-candidates.mjs` |

⚠ **这份清单里没有一条是「照着想象画一个」。** 数据不够的地方写的是缺什么，
不是可以假设什么 —— 一个孔位靠猜的执手是装不上去的零件，甲方的老板亲自否过一批生成图。

## 先看这一条：曝光最高的几个，站上没有页面

| 阿里标题 | 曝光 | 询盘 | 站上 |
|---|---:|---:|---|
| Door Lock Cylinder Keys, Universal Blank Key Hyland OEM, Brass M | 309 | 1 | **没有对应记录** |
| Hotel/Garage Main Master Key Hyland OEM Brass Cylinder Key Three | 256 | 3 | **没有对应记录** |
| Push bar Panic Exit Device with Outside Handle, Hyland OEM 310+0 | 134 | 2 | **没有对应记录** |

对照一下：下面第一节里表现最好的 307 是 63 次曝光。**曝光最高的两条我们一张页面都没有** ——
这不是出图问题，是目录问题，而且它比整份出图清单更值钱。先确认是「型号没建」还是「写法对不上」。

## 一、有真实询盘的，按询盘排

这是该先出图的顺序。转化率只印在旁边不参与排序 —— 甲方自己的导出就警告过：
它的分母是访客，样本是个位数，「100%」可能只是一个访客问了一次。

| 型号 | 询盘 | 曝光 | 转化 | 橱窗 | 现有照片 | 规格行 | 视频 | 尺寸图 | 可建模？ |
|---|---:|---:|---|---|---:|---:|---|---|---|
| **307** | 5 | 63 | 20.00% | ✓ | 10 | 7 | ✓ |  | 缺 Plate size / Plate thickness |
| **311** | 4 | 40 | 21.43% | ✓ | 10 | 5 | ✓ |  | 缺 Plate size / Plate thickness |
| **6068** | 3 | 119 | 23.08% | ✓ | 2 | 6 |  |  | 缺 Faceplate / Case height / Case depth |
| **305** | 3 | 77 | 21.43% | ✓ | 8 | 4 | ✓ |  | 缺 Plate size / Plate thickness |
| **564** | 2 | 60 | 40.00% | ✓ | 6 | 15 |  | ✓ | — |
| **5836** | 1 | 50 | 0% |  | 6 | 16 | ✓ | ✓ | — |
| **308** | 1 | 37 |  |  | 7 | 3 |  |  | 缺 Plate thickness |
| **035** | 1 | 26 | 0% |  | 5 | 5 | ✓ |  | 缺 Plate size / Plate thickness |

## 二、目录里有、九十天没有询盘（18 个）

曝光排序。曝光高而询盘为零，通常是页面没有给出买家要的东西 —— 照片、尺寸、或者两样都缺。

| 型号 | 曝光 | 访客 | 现有照片 | 规格行 | 尺寸图 | 可建模？ |
|---|---:|---:|---:|---:|---|---|
| SSH016 | 36 | 1 | 7 | 11 |  | — |
| 102 | 32 | 1 | 4 | 10 | ✓ | ✅ round tube |
| 607 SSET | 26 | 1 | 9 | 13 | ✓ | — |
| DC02 | 24 | 2 | 7 | 13 |  | — |
| 316-S | 19 | 1 | 8 | 12 |  | 缺 Plate size / Plate thickness |
| 9014S | 18 | 2 | 4 | 3 |  | 缺 Tube diameter / Tube Thickness / Length / Centre distance / Standoff |
| 307 | 16 | 3 | 10 | 7 |  | 缺 Plate size / Plate thickness |
| F101 | 13 | 1 | 7 | 6 |  | 缺 Tube diameter / Tube Thickness / Length / Centre distance / Standoff |
| LH1016 | 8 | 1 | 4 | 8 |  | 缺 Tube diameter / Tube Thickness / Length / Centre distance / Standoff |
| 9010E | 6 | 0 | 5 | 0 |  | 缺 Tube diameter / Tube Thickness / Length / Centre distance / Standoff |
| 026 | 5 | 1 | 7 | 8 |  | 缺 Plate size / Plate thickness |
| NC013 | 5 | 0 | 5 | 3 |  | 缺 Tube diameter / Tube Thickness / Length / Centre distance / Standoff |
| 9008S | 3 | 0 | 5 | 3 |  | 缺 Tube diameter / Tube Thickness / Length / Centre distance / Standoff |
| 301 | 3 | 0 | 7 | 5 |  | 缺 Plate size / Plate thickness |
| 9021 | 1 | 0 | 5 | 3 |  | 缺 Tube diameter / Tube Thickness / Length / Centre distance / Standoff |
| 9007E | 1 | 0 | 6 | 0 |  | 缺 Tube diameter / Tube Thickness / Length / Centre distance / Standoff |
| NC046 | 1 | 0 | 5 | 3 |  | 缺 Tube diameter / Tube Thickness / Length / Centre distance / Standoff |
| 309-S | 0 | 2 | 6 | 2 |  | 缺 Plate size / Plate thickness |

## 三、阿里有、我们对不上号（17 个）

**这些不是出图问题，是目录缺口。** 阿里上有真实曝光甚至询盘，站上却找不到对应记录 ——
要么这个型号我们没建，要么写法不同（`587 SS ET` 对 `587 SSET`）。出图之前要先确认是哪一种。

| 阿里标题 | 型号栏 | 询盘 | 曝光 |
|---|---|---:|---:|
| Hotel/Garage Main Master Key Hyland OEM Brass Cylinder Key Three /two  | （空） | 3 | 256 |
| American Standard Deadlatch Lock Key for Aluminum Storefront Doors Nar | （空） | 3 | 48 |
| Push bar Panic Exit Device with Outside Handle, Hyland OEM 310+015, Do | 310+015 | 2 | 134 |
| HYLAND OEM 90MM Tubular Lock Latch Cerradura De Puerta. Entry Door Loc | （空） | 2 | 57 |
| Matte Black Euro-standard Door Lock Cylinder Hyland OEM, 70mm Length S | （空） | 2 | 47 |
| Ball Door Knob Lock HYLAND 587 SS ET Stainless Steel Cylindrical Knob  | 587 SS ET | 2 | 18 |
| Door Lock Cylinder Keys, Universal Blank Key Hyland OEM, Brass Materia | （空） | 1 | 309 |
| Smart Door Lock Rim Gate Door Lock Hyland OEM CE 1073 DL Double Cylind | 1073 DL | 0 | 35 |
| Exterior High Quality Stainless Steel Door Knob Lock, Hyland OEM Widel | 587 SS ET | 0 | 34 |
| HYLAND OEM 9087 Security 4-Round Bolt Lock Case 85mm Center 50/60mm Ba | 9087 | 0 | 13 |
| HYLAND 035 / Panic Exit Device Lever Trim Keyed Fire Door Lock ANSI Gr | （空） | 0 | 9 |
| Heavy Duty Tubular Lever Handle Keyless Door Lock Bathroom Privacy Loc | （空） | 0 | 6 |
| HYLAND OEM LH1033 SUS304 Stainless Steel Modern Lever Handle Lock Easy | LH1033 | 0 | 6 |
| Zinc Alloy Tubular Lever Set Door Lock HYLAND OEM Heavy-Duty Wooden Do | （空） | 0 | 4 |
| Heavy Duty Tubular Privacy Lever Handle Door Lock Zinc Alloy Bathroom  | （空） | 0 | 2 |
| Stainless Steel Door Handle Lock Works with Latches, 9007 E Round Rose | 9007 E | 0 | 1 |
| HYLAND F100 SS Bisagra De Piso Double Accion Para Puertas De Vaiven He | F100 | 0 | 0 |

## 四、要工厂给的数（按缺什么归类）

给了就能出尺寸图和模型。括号里是九十天询盘人数。

- **Plate thickness** — 307(5)、311(4)、305(3)、308(1)、035(1)
- **Plate size** — 307(5)、311(4)、305(3)、035(1)
- **Faceplate** — 6068(3)
- **Case height** — 6068(3)
- **Case depth** — 6068(3)

---

43 个阿里产品：目录里有 26、对不上号 17；有询盘的 8；现有照片合计 165 张。
