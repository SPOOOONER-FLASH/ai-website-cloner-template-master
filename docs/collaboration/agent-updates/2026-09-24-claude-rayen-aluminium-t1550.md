# 2026-09-24 Claude（雷茵，E:/rayen）— 氧化铝门锁 24 个 + UNION 最后一包 T1550

| | |
|---|---|
| 图册 | 《雷茵五金》p57–p60 豪华氧化铝门锁 → **24 个型号**（圆座 15、方座 3、长面板 6），`rayen-catalogue-aluminium.json` |
| UNION | T1550（L500 / L750）→ `union-handles-b12.json`。**54 个 UNION 包全部上架** |
| 切图 | 新增 `scripts/catalogue-cutters/cut-aluminium.mjs`：这一章一格 = 一个型号的一个表面，按格子坐标切；长面板页把画在面板右下的尺寸图涂白 |
| 新词 | 铝氧化亚黑 / 砂白 / 砂金 → Anodised Matt Black / Sand White / Sand Gold；「面板执手锁」= Lever Handle on Backplate。zh-terms 与 rayen-finishes 同步 |
| 源图 | `E:/rayen-sources/`（C 盘满，源图不再放 C:/Users/86132） |

33 格的尺寸逐格放大读过：同一型号在几格里的数全部一致。25 个新型号中文页零英文残留；联络表逐张看过。

## 没收的（都在清单 heldBack）

- **适用门厚**：图册同一格中文印 35-50mm、英文印 40-55mm。等甲方定。
- 适用标准 QB/T2474 / GB21556（不是检测报告）、适用范围（系列通用说明）、AL-143 图上的锁体中心距 58。
- p57 左半页 5845 / 5806H-45 锁体：和锌合金 p32 的 7255 锁体一起另起记录。
- T1550：侧视图 25（量哪段说不清）、古铜色表面（没有名字）、安装螺钉孔径。D504 场景图有日文消防栓标牌，剔除。

## 老问题又出现一次

`rayen:images` 照旧把 14 张旧图纸（中英 28 个文件）原地重写、带回重影。已还原 HEAD，账本只收新型号。
处理办法写进了移交文件 4.1，根因仍未修。

## 测试

npm test 370/370；rayen:images:check 0（中英各 2286 张带标）。按分界墙两个提交：雷茵+中立 / HYDE 派生图。
out-rayen/ 由 release:rayen 发布（检出在 E:/rayen/tmp，本来就在 E 盘）。

## 下一个

p61–p64 不锈钢空管分体锁；之后 p65–p70。锁体记录（7255、5845、5806H-45）单独一件。
