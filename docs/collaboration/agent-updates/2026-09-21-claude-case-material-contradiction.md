# 2026-09-21 Claude — 壳体材料矛盾：不是 2 个产品，是一条刷了 184 次的模板

**Agent:** Claude
**Scope:** `docs/collaboration/CLIENT-RUNBOOK.md`、`scripts/build-client-runbook-docx.mjs`。**未改任何 `content/products`** —— 第 2 步等客户回答。

## 任务描述的定性是错的，范围也小了

任务写的是「5835/5836 混进了西语经销商的外来数据，和我们自己的目录数据打架」。查下来不是这样。

`Chassis` 行**不是逐个产品量出来的**：

| 事实 | 数 |
|---|---|
| 带 `Chassis` 行的产品 | **184** |
| 不同的 `Chassis` 取值 | **7** |
| 每个取值对应的品类 | **恰好一个** |

7 个取值分别精确对应 rim locks / lever handles / cylindrical locks / grip handle sets / deadbolts / glass patch fittings。这是**一条按品类写死的模板文案，一次性刷到 184 个产品上，从没跟每个产品自己的 `Material` 行对过**。

5835 不是特例，它只是因为 `Material` 写得特别具体（`Steel sheet 1.2mm case`）才把矛盾顶出了水面。

**所以大概率是模板那行错，不是外来数据错** —— 但这仍然要工厂回答，没有猜。

## 真正矛盾的是 15 个，不是 2 个也不是 89 个

第一遍我用 `/zinc|zamak/` 判有没有冲突，得到 89 个。**这个数是错的**，和我上周把 `Handle Material` 算进 handing 覆盖率是同一类错误：

- 它把 `"Iron case, ... with zinc plated"` 判成「不冲突」，因为串里有 zinc —— 但那说的是**镀层**，壳体明明写着 iron。
- 反过来它把圆筒锁的 `Material: Stainless steel` vs `Chassis: Solid steel chassis` 判成冲突 —— 那**不是**冲突：`Material` 描述的是**外露把手**（证据：它随饰面后缀变，587 PBET / 587 SSBK / 587 MBBK 各不相同），`Chassis` 描述的是**内部底盘**。两者可以同时为真。

判别标准只有一个：**两行是不是在说同一个对象**。只有 rim lock 那条模板明说 `Zinc die-cast **case**`，而 `Material` 也明说 `Iron **case**` —— 同一个壳体，两个材料。

精确集合 **15 个**：`260 556 558 559 1073D 1073S 5681 5682 5683 5688 5689 5833 5835 5836 G559`
（清单在 `tmp/claude-runbook/case-clash.json`，tmp 不入库，要用重跑通扫即可。）

## 第 1 步：已写进客户 runbook 顶部

`CLIENT-RUNBOOK.md` 新增 ③，写给非开发者：**不用上服务器、不用敲命令，回一句话即可**。带 15 个型号的表，问壳体到底是铁/钢板还是锌合金压铸，并单独问 5835/5836 的 **1.2mm** 是不是真的。

明确写了：**不确定就说不确定，我会把那行删掉而不是写一个看起来合理的数字。**

顺手修掉一处已经过时的东西：下面那张「什么时候做什么」的表里写着「只做 ③」「先 ② 再 ③」，是上一版的编号，现在指向的是别的小节。改成用动作名（**purge** / **装跳转规则**），编号再变也不会错。按 runbook 规矩，读者读到过时指令是我的错。

## 第 2 步：阻塞中

等客户回答。回答到了就改 15 个产品的 `specs` / `specsEs` / `specsPt` 三语，跑 `npm run content` + `npm test`，连同重新生成的索引一起提交。

## 顺带修掉一个我昨天刚引入的缺陷

`npm run runbook:docx` 在文件被 Word 打开时崩了，吐的是原始 `EBUSY` 堆栈。这在这里是**常态不是异常** —— 客户桌面那份多半就开着。已改成：

```
写不进 C:\Users\johns\Desktop\hyde\CLIENT-RUNBOOK.docx
这个文件正在 Word 里开着。关掉 Word 再跑一次就行,内容没有丢。
```

**这个错误我差点漏掉**：第一次我只 `tail -3`，看到的是堆栈尾巴的 `}` 和 `Node.js v24.19.0`，而同一条命令里其他几个 exit code 都是 0。这就是 AGENTS.md 里「返回 0 不等于做对了事」的变体 —— 一条命令的崩溃被同批命令的绿色淹掉了。

**桌面上那份 docx 目前还是旧的**，因为 Word 占着写不进去。内容已验证能正确渲染（写到 `tmp/claude-runbook/docx-verify/`：源 313 行 → 257 段、4 张表，15 个型号都在）。客户关掉 Word 后重跑一次即可。

## 测试

```
npm run content   924 products / 35 news / 40 guides
npm test          353 passed, exit 0
```
