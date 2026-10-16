# Claude · 2026-10-16 · BAU 2027 C4.523 墙面喷绘方案与生产文件

**甲方原话：**「装展示板以外的空间用什么样的广告图片 做一下 bau的 东西喷绘布 15 公分出血，你出方案」。展板已有，要的是楣头和展板以外墙面的图。

## 方案

后墙、侧墙各一整块喷绘布，展板挂在布上。

- 楣头（0.70 m）：
  - HYDE 横版标志；
  - 英文一句，德文一句；
  - 右上角：后墙 Stand C4.523，侧墙 cantonlock.com。
- 底边（0.30 m）：墨色色带。
- 展板区：全白，展板怎么排都不会挡字。
- 侧墙通道端：冲压车间实拍照，1.20 × 0.80 m，用无水印源图 `public/images/company/press-shop.webp`。
- 只用墨色和白色，不用金色。文字只写已确认的事实，取自 `content/bau-2027.json`。

## 文件

- 生成器：`scripts/brand/build_bau_booth_graphics.py`，尺寸全部在 `WALLS` 里。
- 输出目录：`docs/design-references/bau-2027-booth-graphics/`
  - 方案图：A3，一页；
  - 生产文件：两份，1:10 矢量 PDF，页面即出血框，TrimBox 是成品边，四边各出血 15 cm；
  - 预览 PNG。
- `kit.py`：在非 Windows 环境下，中文字体回退到文泉驿正黑，用于中文说明页的打样。
- 给甲方的交接：`docs/collaboration/2026-10-16-手动操作-BAU展位喷绘交广告公司.md`，Word 版已直接发给甲方。runbook 顶部加了一条指引。

## 风险

- **墙高 2.50 m、楣头 0.70 m、底边 0.30 m 都是假设**，要等搭建方确认。侧墙在左还是在右，按效果图暂定为右侧。尺寸有变，改 `WALLS` 后重跑生成器即可。
- 照片分辨率为 2616 px，印到 1.20 m 宽约 55 dpi，喷绘布近看会偏软。这张图是 10-12 AI 放大后人工核对过的版本；有原始相机文件就换掉。
- 云端会话没有 Desktop\hyde，Word 文件是直接发给甲方的。下次在 johns 机器上，需要重跑 `node scripts/build-client-runbook-docx.mjs`（runbook）以及加 `--src` 生成本交接文档，写入 Desktop\hyde 对应的文件夹。

## 下一步

甲方回传 4 个尺寸后，改 `WALLS`，重出文件。
