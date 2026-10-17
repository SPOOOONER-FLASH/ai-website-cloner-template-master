# Claude · 2026-10-17 · HYDE 锁架两款配色简模

**甲方原话：**「纯色锁架，你给我两个简单建模，黑的配白色 hyde，白色配黑 hyde logo」。附参考图：别家的白色锁架，红笔标出 HYDE 竖排在正面右侧、底座上再放一个。附视频：样品是立柱上开一扇带合页的小门，门上按锁开孔，下面带底座。

- **生成器** `scripts/brand/build_lock_stand_models.py`，输出到 `docs/design-references/lock-display-stand/`：
  - `stand-pair.png`：黑、白两款并排；
  - `stand-black.png`、`stand-white.png`：单张；
  - `stand-elevation.png`：正立面图，标了尺寸。
- **造型：** 立柱 + 带合页的小门 + 底座。左侧是锁舌一侧，右侧是合页一侧，竖排 HYDE 字标放在右侧，从上往下读，不会压在锁的位置上。底座正面放横版标志。
- **没有画锁，也没有画开孔。** 开孔要按实际装的锁来定；产品图只能用实拍，不能凭想象画。
- **尺寸是估的**（按参考图里球锁的圆面约 70 mm 换算）：立柱 240 × 120 × 760 mm，底座 360 × 280 × 50 mm。拿到供应商图纸后改 `STAND` / `BASE` 两个常量再重跑。
- 本次只改了 Python 生成器和图片，不在 `npm run check` 范围内，没有重跑。
