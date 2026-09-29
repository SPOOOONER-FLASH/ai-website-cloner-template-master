# Claude · 2026-09-29 · 巴西葡语：trinco 是斜舌，不是方舌（351 行 / 207 条记录）

**Scope**: `content/products/**`（207 条的 `specsPt`）、`src/data/pt-glossary.ts`、
`src/data/pt-features.ts`、`src/data/hardware-terms.ts`、
`scripts/fix-pt-latch-terms.mjs`（新）、`src/data/pt-latch-terms.test.ts`（新）、`package.json`。
HYDE / 中立 lane；`specsPt` 雷茵不渲染，对 RAYEN 无影响。

## 起因

甲方 2026-09-29 拍了一份 AROUCA FECHADURAS 的安装说明书，问：葡语「锁舌」到底用
trinco 还是 lingueta。

## 结论：trinco = 斜舌（把手收回的那根），trava = 方舌（钥匙推出的那根）

三个互相独立的来源一致：

1. **AROUCA 说明书本身**（甲方提供）——
   「Insira o **trinco** na furação inferior com o lado **chanfrado** voltado pra o batente」
   （斜面 = 斜舌）；「Ajuste do **trinco** … 60mm (2-3/8") … 70mm (2 3/4")」
   （可调 backset = 斜舌）；收尾步骤里把手方轴穿过「o cubo central do **trinco**」，
   而锁芯拨片穿过「o cubo central da **lingueta**」。
2. **pro-reforma.com**：「Trinco: acionada por meio da **maçaneta**… Lingueta: também
   conhecida como tranca, acionada pela **chave**.」
3. **Leroy Merlin 巴西**的选锁指南，同样的分法。

## 我们错在哪

`pt-glossary.ts` 的文件头写的**正好相反**，而且引了错的标准：

> 「`trinco` is the deadbolt and `picaporte`/`lingueta` the sprung latch … because it is
> the word on **ABNT NBR 11742**'s own vocabulary for the sprung element.」

NBR 11742 是**防火门**标准，里面没有锁具术语表；锁具术语标准是 **NBR 12927
（Fechaduras — Terminologia）**。

后果是具体的。型号 **1073D** 的同一张规格表上，巴西买家读到：

| 英文 | 我们的葡语 |
|---|---|
| Latch extension = 13 mm | Saída da **lingueta** = 13 mm |
| Deadbolt throw = 25 mm | Curso do **trinco** = 25 mm |

他手里拿着 AROUCA 说明书对照，**两个数都会读反**。13 mm 和 25 mm 的差别就是这套五金
装不装得上他已经开好孔的门。这正是这个文件头自己警告过的那一类错误：
「A plausible Portuguese row that means something slightly different … on a door it
costs a container.」

**最值得记的一点：这个错是通过「认真」传播的。** 有两行原本是对的，09-24 被后来的会话
**改成了错的** —— 因为他们信了文件头。一个错误的权威比一个缺失的词危险得多。

## 改了什么

- **351 行 / 207 条记录**的 `specsPt`，由 `npm run copy:pt-latch` 改写。
- `pt-glossary.ts` 22 行 + `pt-features.ts` 1 行标签表。
- `hardware-terms.ts` 7 处（包括站上公开的术语页条目：Latch 的葡语词从 Lingueta 改为
  **Trinco**）。
- 文件头重写，写清证据、错引的标准、以及那两行被改反的历史。

方舌统一用 **trava**：本文件原本就用了 18 次，任何读者都不会把它和斜舌搞混，而且上面
第 2 条来源正是用 tranca/trava 去解释 lingueta 的。**`ferrolho` 一律不动** —— 它指
插芯锁和铝门锁的推出舌，从来不在这场混淆里。

## 为什么这个脚本可以自动跑，而 es 翻译器不行

AGENTS.md 的规矩是「带 fall back to source 分支的生成器会悄悄抹掉人工改好的文本」。
这个脚本**没有那个分支**：它从不翻译，只换一个名词，而且**只在同一下标的英文原行本身
就写着 latch 或 deadbolt 时才换**。配不上英文的行原样不动；认不出的词让运行失败而不是
猜。配对用**下标而不是标签**——标签已经被翻译过，按标签匹配恰好会跳过最需要看的那些行。

## 停在哪里，以及为什么

**散文里剩下 107 处 `lingueta` 没动**（13 篇文章 + `categories.json` +
`category-positioning.json` 等）。原因是抽样之后发现**它们是混着的**：

- 「o sentido da **lingueta** (para que lado fica o **chanfro**)」→ 斜舌，**错的**。
- 「**trinco** de 13 mm … avanço de **lingueta** de 25 mm nas versões com **tranca**」
  → 这里 lingueta 就是方舌，**是对的**。

对散文做整体替换，就是把刚修好的错误换个形式再犯一遍。这部分是逐句的文案工作，
不是脚本能做的，**已列为待办**。规格表和术语表可以自动，是因为英文原行给了确定的配对。

## 守卫

- `npm run copy:pt-latch --check` 进了 `test:export` —— 重新生成的记录不可能再把它换回去。
- `src/data/pt-latch-terms.test.ts` 锁住标签表和术语页。写成测试而不是注释，正是因为
  这个错误是被「认真的读者」推着走的：注释可以被说服，失败的测试必须被人主动改写，
  而改写的人会先读证据。

## 测试

`npm test` 447 passed；`npm run lint` 0 errors；`npm run typecheck` clean。
未发布 —— 线上要等下一次 `release:hyde`。

## 待办（散文）

13 篇文章里的 `lingueta` 需要逐句判断。已知**错**的至少有：
`cross-referencing-a-lock-you-already-buy`、`door-hardware-schedule-guide`、
`handing-left-right-and-universal`、`strike-plates-and-keeps-2026`（都和「chanfro/斜面」
连用，是斜舌）。已知**对**的：`rim-night-latch-564-and-1073` 里与 tranca 并列的那几处。
