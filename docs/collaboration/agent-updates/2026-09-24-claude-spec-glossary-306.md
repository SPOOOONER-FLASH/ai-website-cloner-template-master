# 2026-09-24 · Claude · 补齐西/葡规格术语表；306 三条记录；译者加 `--only`

## 做了什么

**术语表补齐。** 规格标签共 244 种，西语表缺 12、葡语表缺 6。现在西语缺 2、葡语缺 0。
葡语的 6 个全补上；西语补了 10 个，另加 2 个品名、5 个规格值。

**306-D / 306 PS / 306-S。** 这三条是全站仅有的没有 `specsEs` / `specsPt` 的记录。原因不是漏跑，
是 `Door leaves` 没有词条——而这三条的规格表只有这一行，一个标签没映射就等于零行被翻译。

**`scripts/translate-products-es.mjs` / `-pt.mjs` 加 `--only <models>`。** 见下。

## 为什么加 `--only`

脚本里那段长注释把「全量重跑不安全」讲得很清楚（2026-09-11 那次退回 830 行），然后没有给出安全的做法：
开关只有「全量」和 `--names-only`，所以改三条记录要重跑 1089 条再读 diff 自证没搞坏东西。
「targeted change gets a targeted write」得先有 targeted write 存在。

`--only` 之外的记录不读、不组装、不写入，所以无论术语表相对于人工润色有多旧，都碰不到它们。
本次实测：`git status` 只有 3 个产品文件改动。

## 两件本来会静默上线的事

**1. 生成器覆盖了更好的葡语 SEO 描述。** 写完一看，这三条的 `seoDescriptionPt` 从专门写的句子
变成了模板句。量了一下：590 条 HYDE 记录里 **587 条是专门写的，模板式的只有我刚写的这 3 条**。
就是 AGENTS.md 记的那类事故，规模小而已。已把 SEO 与 summary 字段按人工改回，并补上西/葡品名。

**2. 306 PS 的西语和葡语文案在把它当逃生器材卖。** 这个是本次最要紧的发现，且早于我的改动。
英文 summary 写着 “no latch bolt of its own… **Not a self-latching exit device**”，
而原来的 `seoDescriptionEs` / `seoDescriptionPt` 写的是
「Abre com o peso do corpo… o único requisito」——逃生推杠的话术，套在一根没有斜舌的通行推杠上。
这是买家据以选型的字段，装到逃生门上是人命问题。已重写为明确说明「不是防恐慌装置、闩锁由独立锁体承担」。

全目录扫了一遍同类错误（英文否认逃生功能、西/葡仍在卖逃生功能）：**只有 306 PS 这一条**，已修。

## 没做，且不打算猜

- **`Follower`（072）** 留英文。值是 `9 × 9 × 130mm`——9mm 方杆、长 130mm，那是方轴
  （表里已有 `Spindle: "Cuadradillo"`），不是 follower 所指的凸轮。标签和值必有一个是错的，
  买家据此选型，所以按本文件头部的规矩留英文并报告，等工厂确认是哪个。**请代为问工厂。**
- **`Centre distances`** 留着，等规格标签的美式拼写改名落地后按最终拼写补。

## 给做拼写改名的那位

只改 `content/products` 会让 **45 条西语、46 条葡语**规格行静默掉回英文，且测试全绿。
涉及 7 种标签 46 行（`Centre distance` 34、`Fixing centre` 6、`Grip centre distance` 2、
`Fixing centres` / `Centre distances` / `Faceplate to cylinder centre` / `Cylinder centre to back` 各 1），
其中 6 种在西语表、7 种在葡语表里有译名。术语表**以英文标签为键**，标签一改名键就对不上，
生成器走「无词条则保留英文」那条分支。

所以**改名和术语表改键必须同一个提交**。`src/data/**` 虽是我的车道，这一次机械改键请一并做，我认可。
译名一个字都不用动。

另外：`scripts/normalize-us-spelling.mjs` 的扫描范围只有 `content/news` 和 `content/guides`，
**不含 `content/products`**——这就是 `us-spelling.test.mjs` 在 46 处英式拼写下仍然全绿的原因。
改名时建议把 `content/products` 纳入 `DIRS`，否则守不住。

规格值里还有 `aluminium` 10 处、`colour` 1 处，面向美国买家应为 `aluminum` / `color`，看你的范围要不要一起收。

## 测试

`spec-table-parity`、`portuguese-brazilian`、`regional-terms`、`product-naming`、`us-spelling` 共 7 项通过。
未跑 build：`out/` 的发布棒不在我手上。

## 没碰

`out/`、`out-rayen/`、NOW.md、`.clinerules`，以及主工作树里任何不属于我的改动。
本次在 `tmp/claude-spec-work`（`origin/main` 的独立 worktree）里做，主工作树一个文件没动。

## 下一个有用的活

123 条 HYDE 记录完全没有规格表——不是翻译问题，是工厂数据缺失，需要甲方那边补。
