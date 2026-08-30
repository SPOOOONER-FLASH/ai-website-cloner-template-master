# Claude — 按纸质目录第 40–42 页校正代码表

甲方给了老目录三页原件：功能说明（40/41 页）与表面处理一览表（42 页）。
**这三页推翻了我上一轮的两条取值,并暴露了一个我自己造的错误。**

## 一、两个 Finish 取值我写错了

| 代码 | 我写的 | 目录印的 |
|---|---|---|
| `SS` | Stainless steel | **不锈钢砂光 SATIN STAINLESS STEEL (US32D)** |
| `SP` | Bright polished | **不锈钢抛光 POLISHED STAINLESS STEEL (US32)** |

已上线 19 + 1 个页面写错。已改，并给品牌类代码补上目录印的 US 编号
（PB=US3、SB=US4、AB=US5、AC=US11、DC=US15、AN=US15A、SC=US26D、CR=US26、ABR=US10B）。

⚠ **US 编号是行业表面处理命名标准,不是认证。** US32D 命名一种砂光不锈钢,
就像 RAL 9010 命名一种白 —— 与 BHMA 产品认证无关。已在代码注释里写明,免得日后误读。

新增目录里有而我没有的：`CR` 镀铬、`NI` 镀镍、`DC` 哑镍、`AN` 枪古色、`ABL` 黑古、
`ABR` 褐古、`WL` 白漆、`GL/IL/BL/RL/BLL/GRL/BRL` 各色漆、`PSC` 抛光哑铬。

## 二、我把 BK 错安到了锁体上

两页功能表的标题分别是 **"Functions for cylindrical door locks"** 与
**"for tubular door locks"** —— 这些代码只描述**球锁和执手锁**。
插芯锁体没有球形执手、没有内侧旋钮,`Lc8530BK` 被我标成「浴室功能」是错的。

已把 ET/BK/CR/SR/PT 限定在球锁/执手/套锁/不锈钢拉手类目。
**PS 是例外**：甲方自己的 worldbid 文案把 LC7065PS、LC06 85-50PS、LC8520-PS 都写成
passage case,锁体上独立成立,保留。

同时从目录补了三个功能码：`CR` 教室锁、`SR` 贮物室锁、`PT` 阳台锁。
Exit Latch 与 Communicating Lock 目录里**没印代码字母**,所以 `CL`/`EL`/`R`/`S`
一概不认领。`E` 仍待甲方确认。

## 三、撤旧值时我差点删掉真数据

改名要撤旧值,我第一版的 SUPERSEDED 是一个**不分字段的值集合**。
`"Stainless steel"` 既是被取代的 Finish 旧名,**也是 40 多条记录合法的 Material 值** ——
一跑就把 32 个产品的 Material 行删了,规格表从 12 空变成 44 空。

`git checkout -- content/products` 回滚后改成**按字段名分组**,只碰 Finish 与 Function 行。
教训写进代码注释了：撤销操作必须连字段一起匹配,只匹配值等于盲删。

## 结果

| | |
|---|---|
| Finish 行 | 72 条（含 US 编号） |
| Function 行 | 73 条 |
| 撤销的失效行 | 2 条（Lc8530BK 等） |
| 空规格表 | 12（未变,都是真没数据） |

正文示例：
`A brass or stainless steel knob lock in antique brass (US5) with 60mm / 70mm adjustable backset, entrance function, for residential use.`

⚠ 顺带修：`(US5)` 一度被 `.toLowerCase()` 成 `(us5)`。订货/规格编号不能小写,
已改成逐词判断,含两个以上大写字母或数字的词保持原样。

## 验证

`npm run check` 全绿：96 + 25 测试,487 页,0 semantic issue,0 editorial warning。
西语术语表同步补了 26 条（US 编号原样保留）。
