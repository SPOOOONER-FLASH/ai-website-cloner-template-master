# Claude · 2026-10-17 · HYDE 品牌包（全规格）

**甲方原话：**「logo brand kit 整理一份发我，需要所有规格尺寸的，图案、纯文字的」。

- **新生成器** `scripts/brand/build_brand_package.py`：输出 5 种组合（图案、纯文字、横版、竖版、横版带公司全称）× 墨色/白色两种颜色，共 105 个文件，打包成 `tmp/claude-brand/HYDE-Brand-Kit-2026.zip`（约 7 MB，tmp 目录不入库，随时可重出）。包内容：
  - SVG、PDF：文字已转曲；
  - 透明底 PNG：256–4096 px；
  - 带底色 PNG：1024 / 2048 px；
  - 头像：400 / 800 / 1080 px；
  - favicon：16–512 px，另附 .ico；
  - 3 页《HYDE-品牌规范-2026.pdf》：比例、最小尺寸、留白、颜色、字体、文件清单。
- **新增纯文字字标母版：** `docs/brand/hyde-2026/marks/hyde-wordmark-{ink,white}.svg`。
- **最小尺寸：** 横版和图标沿用 10-11 规范里的数值；纯文字和竖版按「字母高度不小于横版最小尺寸时的字母高度」推算（纯文字 ≥ 19 mm / 75 px，竖版 ≥ 19 mm / 75 px）；带公司全称的横版按 ≥ 60 mm 计，保证公司名能看清。
- zip 和规范 PDF 已直接发给甲方。云端没有 Desktop\hyde，下次在 johns 机器上重跑生成器即可得到同一套文件。
