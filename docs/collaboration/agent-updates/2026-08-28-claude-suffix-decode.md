# Claude — 后缀码解码：89 个产品差异化

甲方 2026-08-27 确认了完整对照表,上一轮我判断「不可推断」是**错的**,已纠正。

## 我之前为什么判断错

我拿后缀和 `finishes` 字段比,21 个样本 4 个矛盾,就否了。
**那个比较本身是错的**:那 4 条记录的 `finishes` 写的是该型号**可生产的范围**
（"Satin nickel, chrome, antique brass, polished brass, all available"),
不是眼前这一件的颜色。后缀说的是具体哪一个。两者同时成立,不矛盾。

目录里本来就自带图例佐证:`PB=Polish Brass`(6094)、`SN=Satin Nickel`(70710)、
`SC= Satin chrome`(70610)、`BN Black Nickle`(9211)、`Satin Stainless Steel (SS)`(9080E)。

## 对照表（甲方确认）

| 表面处理 | | 功能 | |
|---|---|---|---|
| PB 抛光黄铜 · AB 仿古黄铜 · AC 仿古铜 | SN 缎面镍 · SC 缎面铬 · CP 镀铬 | ET | 门锁功能 entrance |
| SB 缎面黄铜 · SP 抛亮光 · BN 黑镍 | SS / SSS / PSS 不锈钢三档 | PS | 通道功能 passage |
| W · WL 白色喷漆 · F 喷木纹 | ORB · MB | BK | 浴室功能 privacy |

`F` 与 `WL` 是**喷涂**不是电镀（喷木纹球 / 白色喷漆球）,已在文章里如实区分。

## 从右往左解析

功能码在最右,表面处理在它前面。**592 SSET 是 SS + ET,不是 S + SET**——
从左往右读会解反。整串字母必须被完全消费才算解出,消费不掉就一个字不写。

## 结果

| | |
|---|---|
| 解出 | 89 个产品,69 条 Finish + 48 条 Function |
| 未覆盖 | S(17) · E(9) · D(4) · B(4) · BNAC(3) 等,甲方没定义,留空 |
| 最大重复正文组 | **29 → 6** |

607 系列现在这样:

    607 ABET  仿古黄铜 · 门锁      607 PBBK  抛光黄铜 · 浴室
    607 BNET  黑镍   · 门锁      607 PBET  抛光黄铜 · 门锁
    607 FET   喷木纹 · 门锁

## 三个顺带修掉的 bug

1. **系列默认值挡住了型号专属值。** 系列文档写 Function 是
   "Entrance, privacy, passage or dummy"——那是**这个系列有哪些选项**,不是这个型号是哪个。
   解码器现在会覆盖这种「菜单式」取值,但绝不覆盖已经是具体事实的值。
2. **Finish 没进正文句子。** 差异化的关键就是它,只进表格等于白解。现在
   "A zinc alloy lever handle **in satin nickel** with 60/70mm backset, entrance function."
   但材质已含该词时不重复("stainless steel knob lock in stainless steel")。
3. **重复判定改成频率法。** 原来是硬编码几个句式,现在「≥5 个产品共用同一句」即视为
   模板文案。下次再导入一批同样毛病的系列不用改代码。⚠ 只在已有 ≥3 行规格时才重写,
   没数据的不动。

## 仍然改不动的

32 个 stainless-steel-handles 还是同一句。它们只有 1 行 Material,型号后缀是 `E`(未定义),
**没有任何数据可用**。要么甲方定义 E,要么补规格。

## 验证

`npm run check` 全绿:65 + 25 测试(Codex 新增的 related-products / catalogue-taxonomy 也在内),
483 页,0 semantic issue,0 editorial warning。
