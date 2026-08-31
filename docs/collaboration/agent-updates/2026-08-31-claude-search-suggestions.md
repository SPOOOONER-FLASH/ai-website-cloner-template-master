# claude — 搜索面板默认建议（英西双语，桌面 + 移动）

| | |
|---|---|
| 范围 | `SearchDialog.tsx` / 新增 `src/data/search-suggestions.ts` + 测试 / `globals.css` 一个 `.search-chip` |
| 测试 | lint + typecheck + `npm test` 132 全过（新增 4 条）；浏览器实测 375px 与桌面、EN 与 ES |
| 未碰 | `out/`（构建令牌不在我手上）；`SiteFooter.tsx`（见下，归 Codex）；产品图与水印 |
| 风险 | 面板改为单一滚动容器（原来内层 `max-h-[46vh]` 嵌套滚动已移除） |

## 做了什么

空搜索框此前是死路：不先知道型号或类目名就什么都拿不到，而多数访客两样都不知道 ——
他们知道的是「防火门上那根推杆」。现在未输入时（以及**查无结果时**）展示：

- **主要类目** 6 个 chip
- **最常询问型号** 5 条

`placeholder` 也补上：`Model, category or door type` / `Modelo, categoría o tipo de puerta`。

### 选择依据是数据，不是口味

类目 = 目录里真正做深的 6 个，2026-08-31 统计 `content/products`：
knob-locks 67 / lock-cases 45 / panic-exit-devices 42 / lever-handles 40 /
stainless-steel-handles 35 / night-latches-rim-locks 22。旗舰线 panic 提到第一位。

型号 = 五个类目里各自资料最全的一个，每个都有首图 + 9–22 行规格。
`search-suggestions.test.ts` 会在任何一条掉到 9 行以下或丢掉首图时失败 ——
建议位的意义是「点进去有答案」，指向一个残页比不建议更糟。

### 顺带修的两个真问题

1. **面板在手机上装不下**：加了建议之后面板高于视口，而弹窗打开时 body 锁滚动，
   812px 手机上第二条型号以下**完全够不到**。改成 `max-h-[92vh] overflow-y-auto`，
   手机顶部留白 12vh → 4vh。实测 top 32 / height 747 / viewport 812，全部可达。
2. **嵌套滚动**：结果列表原本自己有 `max-h-[46vh] overflow-y-auto`，面板可滚之后
   就是两层滚动容器，靠近结果拖动会滚错列表。已去掉内层，只留面板一层。

## 给 Codex：两条现成的线索

### 1. EH01 是 75 个「无图产品」里唯一已经有照片的

`content/products/eh01-lever-handle.json` 的 `heroImage` 有 `label` 没有 `src`，
所以它被计入「75 个无图」。但磁盘上有 **8 张**：
`public/images/products/eh01-lever-handle-{2..9}.webp`（`products-hyde/` 里水印版同样 8 张），
**编号从 -2 开始，没有基准文件**。

我全量扫了 435 个产品：75 个 `heroImage` 缺 `src`，其中**只有 EH01 带相册**。
所以真实缺口是 74 个，不是 75；EH01 只差「指定哪张当首图」。

这是编辑决定不是数据修复，而且和用户提的「首图应该是黑的款式」是同一类问题
（HANDOFF 八·六 的 F / WL / SP 选图），所以我没有替你选。EH01 有 18 行规格，
是 lever-handles 里资料最全的两个之一 —— 定了首图它就能进搜索建议位，我在
`search-suggestions.ts` 里留了注释说明换回来的条件。

### 2. Footer 是你的，我停在门口

你已批准的 `docs/superpowers/specs/2026-08-31-hyde-sales-imagery-watermark-footer-design.md`
认领了 `SiteFooter.tsx`，且已覆盖用户这次提的「How to buy 去掉 Projects」（你做得更彻底，
只留 Contact / FAQ / Alibaba / 邮箱）。我不动。

**但那份 spec 没覆盖用户这次真正抱怨的那一条**，补充给你：

> 页脚三个区块在移动端是 4 栏网格里的 `col-span-2`，即**各占一半宽**。
> 375px 手机上每栏只有 163px，Newsletter 和 How to buy 并排硬挤 ——
> 用户说的「底部栏目不对齐不整齐 / how to buy 太拥挤」是这个，不是链接数量。
> 精简链接不会解决它，需要在 `sm` 以下改成 `col-span-full` 单列堆叠。

## 我这边还没做的

- **字阶塌陷**（用户「字太密集」的真实原因）：`--text-h3` 与 `--text-c1` 是**同一个值**
  （16–18px），h1 只有 24px。卡片标题＝正文＝页脚标题，眼睛没有落点。
  这是全站 938 页的改动且属设计域，我写成方案单独提交，不夹在这个提交里。
- 移动端弹窗 `Talk to us About your project` 标题读起来是断的，375px 上很挤。
