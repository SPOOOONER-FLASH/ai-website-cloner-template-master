# 2026-09-24 · Claude · 葡语数字格式（根因在结构，不在规则）；D1 漏改三处；加一个防漂移审计

三件事，都是别的会话转来的，都在 `content/**` / `scripts/**` / `src/data/**` 车道内。

## 一、葡语数字格式：问题在结构，不在缺一条规则

工程会话建议按位数定边界（小数 1–2 位按小数，正好 3 位时看整数部分是不是 0）。
照着做会失败，因为**位数不是区分点，输入的语言才是**。

`spaceUnits()` 被两种输入调用：

    英文原值          "22.5mm"                 点是小数 → 要改成逗号
    术语表的葡语      "Chapa de aço de 1,2 mm"  逗号已经是对的 → 千万不能动

所以**任何分隔符转换放在 `spaceUnits()` 里，都必然把两者之一改坏**。旧的千分位规则
`\d{1,3},\d{3}` 就是这么坏的：术语表里的巴西写法 `0,044` 经过它变成 `0.044`——同一个缺陷，方向反过来。

改法是把转换拆出来，只在**输入仍是英文**的地方调用：

- `spaceUnits()` 只留与语言无关的整理（单位前空格、range 连接词）
- 新增 `brNumbers()`：在数字 token 内**互换两个分隔符**。英文写 `1,250.75`、巴西写 `1.250,75`，
  两个符号角色互换，所以一次互换同时搞定千分位和小数位，两条规则不可能互相矛盾，
  而且**在正好三位小数上也对**（`0.044` → `0,044`），那正是数位法做不到的地方。
- `enMeasure() = brNumbers(spaceUnits())`，用在 10 个英文入口；
  **术语表命中那一处仍然只走 `spaceUnits()`**。

顺带修掉两个同源的：

| 症状 | 原因 |
|---|---|
| 10 条测量值仍是英文句点 | `IS_CODE` 把裸小数当标识符（`19.6` 解析成 `19` + `.` + `6`），且它在数字判断之前，于是原样返回。那十条是箱体体积、毛重净重、厚度，全是测量值。现在「代号」要求含字母、且不能整体读作一个测量值 |
| 25 条值写大写 `MM` | 葡语从不把单位转小写，西语一直转。西语侧 0 处、葡语侧 25 处 |

结果：非千分位的小数句点 **0 处**、大写 `MM` **0 处**。
`200.000 ciclos`（千分位）保留，那是正确的巴西写法——我第一次量的 142 处里有 132 处是它，
不是缺陷，是我的正则把千分位也数进去了。

安全性：全目录核过，**没有任何 HYDE 规格值用逗号做裸数字之间的列表分隔符**
（`300mm,400mm` 中间有单位），这是互换法唯一会踩的情况。这个核查写进了函数注释。

## 二、D1 漏改三处，其中一处是我自己上一次改出来的

工程会话转来文案会话的发现：`"Four round bolts"` 还是 `"Cuatro pestillos redondos"`。
我顺着扫了一遍，共三处，**第三处是我造成的**：

| | 旧 | 新 | 依据 |
|---|---|---|---|
| `Four round bolts` | Cuatro pestillos redondos | **Cuatro cerrojos redondos** | LC04 85*60 / LC14 是欧标锁芯锁体，**整张规格表没有斜舌那一行**，四根圆舌由钥匙带动，就是呆舌 |
| `Hook bolt` | Pestillo de gancho | **Cerrojo de gancho** | AR4-1121 是钩舌锁体，唯一的舌是钥匙带动的钩舌 |
| `Bolt projection` | Salida del pestillo | **Salida del cerrojo** | 见下 |

第三处是真缺陷，不只是用词：**LC07 85×45mm 同时有 `Latch throw` 和 `Bolt projection`**。
我那次全局 picaporte→pestillo 把两者都变成了「Salida del pestillo」，于是那个产品页出现
**同一个标签两行、两个不同数字**（26 mm 和 18,5 mm）——而这是买家据以选型的表。
改成「Salida del cerrojo」既符合 D1，也把两行重新分开了。全目录没有记录同时含
`Deadbolt throw` 和 `Bolt projection`，所以不会造成新的碰撞。

**标签 `Bolts` = `Pestillos` 保留。** D1 引的 RAE 义项是「由钥匙**或**弹簧带动」的件，
所以 pestillo 作泛指标签准确；值里知道是哪一种时才用精确词。泛指标签 + 精确取值。

**葡语这三处本来就是对的**：`Bolt projection` → `Saída do trinco`（与 `Curso da lingueta` 区分开），
`Hook bolt` → `Trinco de gancho`。葡语没有碰撞。`Four round bolts` → `Quatro ferrolhos redondos`
没动，`ferrolho` 是泛指且表头未声称它，而 trinco/lingueta 的归属还在等巴西买家答复。

## 三、`npm run copy:drift`：让「术语表覆盖审校写法」这件事可复查

一天之内我四次加术语表键时凭英文直译，覆盖了记录里已有的审校写法
（`Case size` 西葡各一次、`Max door weight`、`Supplied with`）。前三次靠逐行读重新生成的 diff 抓到，
第四次是两小时后在另一个语言里发现的。**这不是一种可重复的发现方式。**

`scripts/audit-glossary-drift.mjs` 把每个术语表标签与记录里该位置**实际写着的**标签对比。
缺键是**可见**的——翻译器会报；键只是**不同**则是**不可见**的：运行干净、diff 又大又乏味、
审校过的写法就没了。

**它只报告不失败**，因为不一致不等于错——甲方 D1 让 `picaporte` 退役，那就是故意的术语表修正——
由读的人判断哪边对。它去掉的是「靠偶然发现」。现在西葡两边都是 0。

## 测试

`spec-table-parity`、`regional-terms`、`portuguese-brazilian`、`product-dashes`、
`hardware-terms`、`product-donor-fields`、`us-spelling` 共 14 项通过。

## 交接

- **SEO 与 summary 字段按 HEAD 还原了**，一个字没动。葡语描述里的尺寸要变成逗号，
  需要工程会话重生成标题——他们已表示改完就跑。
- `Four round bolts` 的葡语、以及 trinco/lingueta 的最终归属，等 `docs/copy/style-guides/pt-br.md §5`
  的巴西买家答复。
- 仍未做：LC19 / LC20 / DV04 的尺寸（等视觉会话给图纸出处）、LC35 的正确型号名、
  14 条材质存疑（已列进工厂问题清单，不自行改动也不清空）。
