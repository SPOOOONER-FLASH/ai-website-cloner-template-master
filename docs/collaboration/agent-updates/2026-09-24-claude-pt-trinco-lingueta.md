# 2026-09-24 · Claude · 葡语 trinco/lingueta 反了——两条，不是一条

文案会话报了 `pt-glossary.ts` 里一条把 latch 和 deadbolt 说反了。查下去是**两条**，
另外顺带找到了葡语小数分隔符问题的根因。

## 这个文件本来是自洽的

| 键 | 值 | 与表头一致？ |
|---|---|---|
| `Latch` | Lingueta | ✓ |
| `Deadbolt` | Trinco | ✓ |
| `Latch throw` | Curso da lingueta | ✓ |
| `Deadbolt throw` | Curso do trinco | ✓ |
| `Latch Bolt Material` | Material da lingueta | ✓ |
| `Bolts`（泛指） | Ferrolhos | 表头没定义这个词 |

表头（引 ABNT NBR 11742）说 `trinco` 是方舌、`lingueta` 是弹簧舌。单字映射全部正确，
**只有把两个件写进同一句的复合值出了问题**——和西语那边完全同一类错误。

## 两条，改掉

    "Latch and square deadbolt"
      旧  Trinco e lingueta quadrada     ← 两个件整个对调了
      新  Lingueta e trinco quadrado     ← 性数也跟着名词走：trinco quadrado，不是 quadrada

    "Three square deadbolts, plus latch"
      旧  Três ferrolhos quadrados, mais o trinco    ← "mais o trinco" 是「加方舌」，英文说的是 latch
      新  Três ferrolhos quadrados, mais a lingueta

第三条 `"60mm / 70mm adjustable, latch and deadbolt both"` → `lingueta e trinco` 本来就是对的，没动。

**`ferrolho` 没动**：表头没有声称这个词，`Bolts` 标签用的就是它，而且它不是这次的矛盾点。
只改与文件自身表头直接冲突的地方——trinco/lingueta 到底哪个是哪个，文案会话已经列进
`docs/copy/style-guides/pt-br.md §5` 等巴西买家确认，真要翻也是统一翻。

## 又一次抓到我今天埋的雷

重新生成后读 diff，`"label": "Acompanha"` 变成了 `"Fornecido com"`——**我今天加的
`"Supplied with": "Fornecido com"` 在覆盖审校已有的「Acompanha」**。
和西语那三条（`Case size` / `Max door weight` / `Supplied with`）是同一个毛病，
同一天、同一个键、换了个语言又犯一次。已采用审校的写法。

**加标签键之前先看记录里那一行现在写什么。** 这句话今天写第二遍了。

## 葡语小数分隔符：找到根因了

上一份更新里我记了「葡语句点 206 处、西语逗号，未处理」。这次重新生成时它现场发作：

    9088 SS   22,5 mm  →  22.5 mm      记录里本来是对的巴西写法，生成器把它改坏了

根因是两个脚本不对称：

- `translate-products-es.mjs` 有 `DIM()`，注释明写「Spanish trade writes 2,5 mm」，
  所以西语输出 `183,5`。
- `translate-products-pt.mjs` 的 `spaceUnits()` 只做三件事：单位前加空格、range 连接词、
  **千分位逗号→句点**。**没有小数点→逗号这一步**。

所以葡语那 206 处句点不是历史遗留，是生成器每次都在制造。

**这次没修**，因为有一个顺序上的坑：千分位规则把 `200,000` 变成 `200.000`，
若再加一条「点→逗号」的小数规则，`200.000` 会被改回去；而像 `0.044` 这种小数点后正好三位的，
又没法靠位数区分。**要修得先想清楚两条规则的先后和边界，值得单独一次改动、单独读一次 diff**，
不该夹在术语修正里。我把被改坏的那一处还原了。

## 测试

`spec-table-parity`、`portuguese-brazilian`、`regional-terms`、`hardware-terms` 共 9 项通过。
