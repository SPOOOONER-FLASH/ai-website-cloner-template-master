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

## 第二版（同日，甲方：「内容有些简单，能不能更专业，工厂图官网有很多 要不要换一个」）

- **后墙底边：** 白字公司事实条，内容有 1998、中山、ISO 9001:2015 stamping plant、OEM、MOQ 300–5,000。
- **侧墙楣头：** 加 46 cm 二维码，指向 `https://cantonlock.com/bau-2027/`，已用 OpenCV 解码确认。旁边配英德各一句扫码说明。
- **侧墙通道端「工厂实拍」栏（1.40 m 宽，这一段不挂展板）：** 三张官网实拍，一大两小，带编号墨色标签：
  - 01 冲压：`press-shop`
  - 02 抛光：`polishing-line`
  - 03 装配：`factory-assembly-quality-line`，裁掉右边的旧招牌

  官网 16 张工厂图逐张看过，有旧红色 Hyland 招牌或中文标牌的一律不用。
- **侧墙底边：** 邮箱和 WhatsApp，都是 site-settings 里已公开的信息。
- **依赖：** 用到 `segno`（二维码）和 `Pillow`。

## 第三版（同日，甲方：「去搜下亚萨合莱、yale、kale 等顶级五金公司参展都是专门设计的」）

- **调研：** `docs/research/2026-10-16-五金头部品牌展台做法.md`，资料来自搜索摘要，厂商官网在云端打不开。共同做法有五条：
  - 一面墙只讲一句主张（SIMONSWERK「Only a detail?」、dormakaba）；
  - 产品装在真门上演示（ASSA ABLOY 展示门）；
  - 产品少而大，像展品一样陈列（Formani）；
  - 设置互动和洽谈；
  - 转角展位从两条通道都能看到品牌。
- **楣头改为大字主张：** 后墙「Your brand. Our factory.」，侧墙「Made to your drawing.」，都配德文。两句都依据 `content/bau-2027.json` 里已确认的事实。侧墙宽度只有 4.50 m，主张放在标志下方。
- **方案页说明第 7 条：** 建议在展位开放角放一扇独立实物演示门，不印。
- **待甲方：** 选定主张句、定是否做演示门、提供高清原图。网站上 4000 px 以上的产品场景图都在 concepts/，是 AI 图，不能用于产品。
