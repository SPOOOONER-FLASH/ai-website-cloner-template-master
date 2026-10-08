# Claude · 2026-10-08 · 广交会目录重做：样张阶段

**Scope**: `scripts/catalogue/`（新包）、`scripts/fonts/archivo/`（新，OFL）、
`scripts/requirements-catalogue.txt`、`scripts/build-catalogue-plates.mjs`、
`docs/superpowers/specs/2026-10-08-canton-fair-catalogue-design.md`、
`docs/superpowers/plans/2026-10-08-canton-fair-catalogue-samples.md`。
旧生成器 `scripts/build_catalogue.py` **未改动**，样张只是复用它的数据层。HYDE lane。

## 甲方在对话里定的

全本重做；印刷厂胶装，出印刷版（3mm 出血 + 裁切标记，TrimBox/BleedBox 都设好）和电子版；
不印展位号；方向 A 精品画册；规格跟产品走 + 开篇二维码，约 108 页；印刷厂接受 RGB；
两项新依赖批准（segno、Archivo）。

## 实测改掉的设计

| 原设想 | 实测 | 结果 |
|---|---|---|
| 封面、工厂页满版大图 | 每类最佳抠图 829–992px，工厂图最大 1308px；满版 A4 只有约 150 dpi | **不做满版**。封面是白底上的一件大产品；`place_image` 拒绝任何低于 200 dpi 的图 |
| 开篇主图 1200px 起 | 抠图会裁掉画面，没有一类达到 1200 | 门槛定在 800px，主图按自身像素定尺寸（最大约 121mm） |
| 卡片上缺值印「—」 | 推杠类除材质外，没有一个规格超过 40% 产品填写 | 卡片只列**该产品实际写了的**规格，最多 3 条；固定列的地方仍印「—」 |

## 顺手查出来的

- **旧目录里有 5 个产品没有图**：plate 生成器按目录扫描，漏了 BH01 的主图
  `bh01-grab-bar-3.webp`（被「-N.webp 是图集变体」规则跳过），以及放在
  `argentina-ar4/` 子目录里的 4 个 AR4 主图。已改为按每个产品的 `heroImage` 点名生成。
- **as-shot 图片带水印**：抠图失败的图会跳过 `cutOut()`，而去掉供应商烙印水印的正是这一步。
  开篇主图因此只用抠好的图。
- **地弹簧 28 张图全是供应商画册截图**：深色底配装饰圆，D-1042 那张底边还带着中文画册字样。
  **这些图目前也在官网上。** 目录里列为唯一的 `PENDING_HERO`；官网那边需要另行处理。

## 测试

`py -m unittest discover -s scripts/catalogue -p "test_*.py"` 20 项通过。
`npm test` 456 项通过；`eslint scripts/build-catalogue-plates.mjs` 无报错。
二维码从 PDF 页面以 300 dpi 渲染、逐模块和应编码内容对照，33×33 全部一致，0 处不符；
印出来 20.5mm，目标网址返回 200。

## 下一步

等甲方看样张。看完再写全本的实施计划，因为样张反馈决定要复用哪些页面函数。
三个问题等甲方回答：ISO 9001（2002 年起）要不要印；三张来源不明的工厂图是不是自家拍的；
地弹簧的图怎么处理。
