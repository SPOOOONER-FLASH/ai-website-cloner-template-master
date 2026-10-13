# 2026-10-11 · Claude（文案会话）· 广交会物料：标志精修、风琴折传单、厂内标识

**起因**：甲方 10-11 要三样东西，都为 140 届广交会准备，开幕在 10-15：精选产品的精简传单（带二维码）、按 SOTA 标准焕新的标志、挂在工厂里的标识（欢迎横幅、背景墙、参观动线、门头）。

**甲方逐项选定**：
- 标志：精修现有 HYDE 标志，不换新标志。
- 传单：长条风琴折。
- 工厂标识：四种都要。

## 交付

| 东西 | 生成器 | 输出 |
|---|---|---|
| 标志精修 + 4 页规范手册 | `scripts/brand/hyde_mark.py`（几何）、`build_brand_kit.py` | `docs/brand/hyde-2026/marks/*.svg`（12 个，已转曲）；规范手册 PDF |
| 厂内标识，12 块牌 | `scripts/brand/build_signage.py` | A3 说明 14 页（每块牌带尺寸、材料、位置，另有摆放方案、制作清单）；每块牌一个 1:10 矢量制作文件 |
| 风琴折传单，70 款产品 | `scripts/catalogue/flyer.py`（复用目录的 style、qr、heroes、variants、samples） | 印刷版（3 mm 出血、裁切线、折线）和电子版 |
| 共用绘图 | `scripts/brand/kit.py` | 标志以矢量放进 PDF；Archivo 字体内嵌；`outlined_svg()` 导出时把文字转成曲线 |

成品在桌面 `hyde\05-目录与报价\广交会物料-2026-10-11\`；说明在 `docs/collaboration/2026-10-11-广交会物料-说明.md`（同目录有 docx 版）。

## 决定和依据

- **标志**：字形用现有 SVG 的轮廓，没有重画。改动只有四处：
  - 光学字距：H–Y 46、Y–D 47、D–E 50；原来是 54、50、64。
  - 图标横杠从 34 改为 32，上移 2 单位。
  - 字母凸角加 3 单位圆角，凹角保持尖角。
  - 补齐组合版本、留白、最小尺寸、颜色。

  网站上的 `public/images/brand/hyde/*` **没有改**，等甲方认可后再换，届时归工程会话或 Codex。目录封面现在的“HYDE”是 Archivo 打的字，不是标志，以后也应该换成精修后的标志。
- **传单的选品规则**：
  - 只用 `cut-out` 高清图，不用 as-shot：as-shot 带供应商的旧 Hyland 水印。
  - 至少要有 1 行写明的规格。
  - 主推型号排前面，例如 307、311、305、LC14、564、9014、575、578。
  - 同一设计只取一种表面处理。
  - 排除把尺寸当型号的记录，例如“6*3*3mm”。

  闭门器、明锁、地弹簧这次没有干净的抠图，没有上传单。
- **不写认证**：传单沿用目录规则，ISO 9001 也不写。公司页上写着 ISO 9001，但目录 10-08 定的是不写，这里跟目录一致。
- **中文字体**：效果稿用微软雅黑。可变字体版 Noto Sans SC 在 MuPDF 里只能渲染出 Light，太细。制作说明里要求广告公司改用思源黑体 Bold。
- **二维码**：7 个品类页加官网，共 8 个网址，10-11 实测都返回 200。

## 待甲方

1. 中文全称。稿里写的是“广州海狄五金建材有限公司”，这个名字只在搜索词里出现过，没有确认。
2. 广交会官方矢量标志。现在是 `tmp/claude-brand/canton-fair-140-red.png`，从甲方截图裁出来，350px。这个占位图不在 git 里，换机器重跑时横幅会没有广交会标志。
3. 厂区平面图或照片，用来定准每块牌的位置。

## 没动的

- 网站的标志文件、目录的生成器（`book.py`、`samples.py`）都没改。
- RAYEN 一侧没碰。

## 测试

- 三个生成器都跑通。
- 每一页都渲染成 PNG 逐页看过：修过文字溢出、字符缺字、横幅标题压到标志、合页型号等问题。
- 二维码对应的网址都实测过。

## 10-11 追加：中文全称已确认；只用墨白两色

甲方：「中文全称就是广州海狄五金建材有限公司 黑白色呗 和官网匹配 白底墨色不要黑金」。

- `build_signage.py`：`CN_NAME` 标为已确认，删掉“待确认”红字；所有牌面改白底墨字，材料改白色底板 + 黑色烤漆立体字或墨色 UV 直印；设计页给白色牌面加一圈细灰线示意边缘（制作文件里没有）。
- `build_brand_kit.py`：颜色只剩墨、白；删除 4 个 `*-brass.svg`；组合页改两列，白底墨色标为首选。
- `flyer.py`：铜色细线改墨色；封底从墨底改成白底墨色标志。`scripts/catalogue/style.py` 的 `BRASS` 没动，目录生成器仍在用它，目录是否也去铜色要甲方另说。
- `hyde_mark.BRASS` 常量保留未删，现在没有调用。
- 仍待甲方：广交会官方矢量标志、厂区平面图或照片。

## 10-11 第二轮：目录墨白、招牌英文为主、传单改三折

甲方：「目录也改成墨白两色 这种要中文字小很小。英文大。主要是给外国人看 然后 就是 flyer啊 不够流畅 ，做前后六页带折叠效果展示」。

- 目录：`scripts/catalogue/style.py` 的 `BRASS` 改名 `ACCENT`，值为墨色；`book.py`、`samples.py` 跟着改名。封面的“HYDE”从 Archivo 打字换成精修标志。电子版重出仍 92 页，覆盖 `public/downloads/hyde-export-catalogue-2026.pdf`（官网下载件，**要等工程会话下一次 release:hyde 才上线**；联系页写的“92 pages”仍对）。印刷版按当前产品数据重出为 60 页（10-09 版 64 页，差别来自产品数据，不是版式）。
- 招牌：门头英文全称两行做主文字，中文一行小字灰色；背景墙英文一行，中文小字。材料说明同步。
- 传单：10 折改 Z 字三折（300 × 210，折后 100 × 210）。外侧 A1 A2 = 精选 20 款，A3 = 封面；内侧 B1 = 工厂，B2 = 产品线（7 类，每类图 + 型号 + 二维码），B3 = 封底。电子版 6 页按阅读顺序排。`传单预览/` 由生成器出：合起、内外侧 Z 字折叠效果（Pillow 透视变形，自己写的 8 元方程求解，没装 numpy）、两面展开。折叠效果图只变形我们自己的版面，不涉及产品图生成。

## 10-12 第三轮：传单单侧 6 面；所有指示英文大

甲方：「不是单侧 3 页是 单侧 6页 传单」「所有指示 广告 中文和英文大小调换 中文小英文大」。

- `flyer.py`：`PANELS = 6`，展开 600 × 210。6 面是双数，Z 字折后封面 A6、封底 A1 都在外侧；B1 背靠 A6，所以翻开封面先看到 B1 工厂、B2 产品线。8 个产品面各 10 款（共 80 款），产品线一面从 `PRODUCT_PANELS` 派生，8 行 8 个码。新加的两个码（stainless-steel-handles、night-latches-rim-locks）实测 200。电子版 12 页按阅读顺序排。折叠效果图 `_zigzag` 改成任意面数。
- `build_signage.py`：欢迎横幅、路线总图、区域门牌、方向牌全部英文做主文字，中文灰色小字；加了 `fit()` 按宽度缩字号。

## 10-12 第四轮：传单逃生推杆按甲方目录页选型；撤三款老锁体

- 甲方发来自家目录的逃生推杆页，要求“前面发的都要上”，老板聊天截图里的 LC33-5572、AI8530、LC7065 不要了。
- `flyer.py` 的 `PRODUCT_PANELS` 现在支持两种写法：写数量就按原规则自动挑，写型号 slug 列表就严格按列表、按顺序放；列表里的型号没发布或没有白底图，构建直接报错。逃生推杆占三面：推杆 10 款、308-S/308-D 加外侧执手、防火门配件 6 款（这一面的卡片自动改成三行，图更大）。301-S 和 302-S 网站上没有单独的记录，只放了 301 和 302。
- `RETIRED` 按型号前缀排除，所以 LC7065S 和 LC7065PS 也一起排除了；手选过的型号自动排除在其他面之外，不会重复出现。
- 为了腾出两面：执手和不锈钢拉手合成一面（各 5 款）；球形管状锁和明锁合成一面；组合把手和钩锁这次不上。
- 共 76 款。印刷版、电子版和折叠效果图都已替换到桌面。

## 2026-10-12, flyer round 3: no bathroom, floor springs or closers; Alibaba models in

- Client: 「卫浴的也下掉 地弹簧 闭门器也不要 换我们的新产品 拳头产品 阿里巴巴重要的产品」.
- `scripts/catalogue/flyer.py`: the bathroom family is gone, and so are F101 (floor spring) and DSL02/DC02 (closer arm/coordinator). `EXCLUDED` keeps closer, coordinator and floor-spring names out of every auto-pick. Replacements are taken from `docs/research/2026-09-11-alibaba-product-performance.json` (listings with inquiries) plus the AR4 locks: 316-S/D and 309-S/D, 6068, AR4-110/140/1121, 587 SSET, 607 SSET, 5836, 1073D and SSH016. Stainless handles get their own panel of ten Alibaba-listed models. Glass door handles now share a panel with levers. 79 products.
- `_base` strips finish suffixes ("6491ABET" → "6491"), and auto-picks skip any base already chosen by hand.
- Tests: the flyer builds and the previews were checked by eye. No site code was touched, so no release is needed.

## 2026-10-13, flyer round 4: sixteen faces

- Client sent catalogue pages 29 and 33 and the fire-door accessories page: 「这些产品加上去 那传单可以正反八页了 16页」.
- `flyer.py`:
  - `PANELS = 8` per side, flat 800 × 210 mm, 12 product panels, 109 products.
  - New panels: "Fire-door coordinators & springs" (DC01, DC02, DSL02, SH01, SH02). Lock cases, cylinders, levers, knob/tubular, rim locks and glass handles each get a panel of their own.
  - The coordinators come back by name; this page supersedes 10-12. `EXCLUDED` now drops closers, floor springs and glass patch fittings only.
  - The range panel scales its rows for 12.
  - Size-like models ("19-130MM") are skipped.
- `build-catalogue-plates.mjs`: a product whose hero exists only as the HYDE-marked copy (SH02, added 10-08) was never plated. It now falls back to `products-hyde/`; the cut-out drops the mark, which I checked by eye.
- Not done: 024 (catalogue page 33) has no site record or photo. Asked the client (task #71).
- Desktop files are replaced; the notes doc and its docx are updated.
