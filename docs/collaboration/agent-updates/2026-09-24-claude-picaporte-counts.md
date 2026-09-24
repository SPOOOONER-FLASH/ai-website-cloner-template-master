# 2026-09-24 · Claude（HYDE工程）· SEO 字段去 picaporte（甲方 D1）；新尺寸带来的计数更新

- 甲方 D1（西语锁具术语按 RAE）：HYDE 记录 19 条 `nameEs`「Picaporte / Picaporte antipalanca」→「Pestillo / Pestillo antipalanca」
  （只改这一个字段，术语表 `Latch: "Pestillo"` 由西语规格表会话已改），标题描述重生成后 SEO 字段 picaporte 0 处。
  翻译器模板「tanto el picaporte como el cerrojo」→「tanto el pestillo como el cerrojo」。标题检查的西语品类名词表加 pestillo。
  normalize-regional-terms 的 picaporte → pestillo 全局规则仍未加：等 Hyde 文案手改完正文（有的段落 pestillo 已指呆舌）。
- 西语规格表会话补进 9 条尺寸后，文章里登记的计数过期：why-the-catalogue（123 → 114，含三语 FAQ）、
  mortise-lock-backset（三语）、dimensional-interchangeability（三语覆盖表）、mortise-lock-case-comparison
  （32 of the 58；对照表补 LC8520、140、LC8535、LC06 85_50PS、LC05 8560 五行，窄边框 12 + 标准 20 = 32）。
- 未修：`zh-terms 覆盖全部规格标签` 红（缺「Cylinder split」的中文），雷茵车道，已通知雷茵会话。
