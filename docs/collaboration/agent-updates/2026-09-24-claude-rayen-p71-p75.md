# 2026-09-24 Claude（雷茵，E:/rayen）— 《雷茵五金》p71–p75，25 个型号；E:/rayen 这条线到此为止

| 页 | 系列 | 型号 |
|---|---|---|
| p71 | 三杆门锁（ET/BK801·802·901·902·903） | 10 |
| p72 | 三维可调节合页 4"×4"×2.5mm | 1（EDA-09 图在这页，算入 p73–p74） |
| p73–p74 | 三维可调暗铰链 EDA-06D/08/08A/09/11/34/36/37/38B/39/40 | 11 |
| p75 | 三维可调液压暗铰链 EDA-09C/20/23 | 3 |

清单 `content/rayen/rayen-catalogue-p71-p75.json`，坐标配置 `scripts/catalogue-cutters/regions/rayen-wujin-p71-p75.json`。
源码 4de9bc148f8，HYDE 侧派生图 6e7e3059908。和 RY8001–8004 合页不重复。

## heldBack（清单里有全文）

- ET801–ET903 执手长与锁盖：ET 格只有锁舌照片、没有图纸，不从同号 BK 借。
- BK902 锁盖直径：放大后仍分不清 69 还是 60。
- 4"×4" 合页英文行 SS/PSS/AB/AC/PVD 与中文四种表面对不上 —— 按中文（甲方：同格中英不一致以中文为准）。
- EDA-09C、EDA-20 总长：图上几段数，哪个是总长说不清。
- p73 / p75 场景照：只用能确定型号的两张。

## 优恩（UNION）收尾核对

微信 2026-09 文件夹 17 个包、20 个型号逐一对 `content/products`：19 个已上架，UL1111 按 b11 清单 heldBack
（包里只有一张氛围图）。优恩这批已全部完成。

## 分工变更

甲方 09-24 把《雷茵五金》**p76–p84** 和《不锈钢把手.pdf》交给 johns 机器（NOW.md 2d9a6e4ef66）。
E:/rayen 做到 p75 为止，不再转录 p76 起的页，避免两边重复。交接表 p76 行上的「下一块」指 johns 那边。

## 测试

npm test 372/372；rayen:images:check 0；25/25 新型号中文页零英文残留。

## 发布

release:rayen 第一次在 git fetch 遇到 TLS 握手失败中止（网络），重跑成功：bd74c19c752（只含 out-rayen/，5166 个文件）。Cloudflare purge 由甲方做。
