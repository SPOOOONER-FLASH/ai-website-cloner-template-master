# claude — 汉堡二级类目（香奈儿式），并修好 26 个「任何筛选都够不到」的产品

| | |
|---|---|
| 范围 | `SiteMenuDrawer.tsx` / `categories.ts` / `globals.css` / `content/categories.json` 3 个 slug / 3 个产品 JSON |
| 测试 | `npm test` 140 全过（新增 3 条）；lint + typecheck 通过；375px 浏览器实测 |
| 未碰 | `out/`（构建令牌仍在别人手上）；`SiteFooter.tsx` |
| 风险 | 子类筛选的 `?type=` 取值变了 3 个。它是查询参数不是路由，不在 sitemap，无需 301 |

## 一、做二级菜单时撞出来的真 bug

准备把子类接进菜单，先验证 `?type=` 深链能不能落地筛选 —— 能。但顺手清点发现
**26 个产品的 `categoryPath[1]` 指向了它所属类目根本没声明的 slug**。

子类是筛选维度、**永远不是 URL 段**，所以这种错不会 404，也不会有任何报错：
产品只是**从所有筛选视图里消失**，只能在「全部」列表里找到。

三处单复数分裂，目录里两种写法同时存在：

| 产品里写的 | 类目里声明的 | 受影响 |
|---|---|---|
| `special-applications` | `special-application` | 5 |
| `door-flush-bolts` | `flush-bolts` | 9 |
| `glass-door-patch-fittings` | `patch-fittings` | 9 |
| （反向）`special-application` / `patch-fittings` / `flush-bolts` | 已改的新 slug | 3 |

**玻璃门配件 20 个产品里有 9 个筛选不到**，占该类目 45%。

统一到复数形式（与显示名一致：`special-applications` ↔ "Special Applications"），
改 3 个类目 slug + 3 个产品 JSON。修复后：

```
glass-door-accessories   10 patch-fittings / 10 handles   （原来 1 / 10）
hardware-accessories     40 已标签 / 50                    （原来 31 / 50）
```

`src/data/subcategory-integrity.test.ts` 三条断言防复发：孤儿 slug 归零、
同一类目下不得出现只差一个 s 的两个 slug、空子类清单必须是已知的那两个。

## 二、剩下的两个内容缺口（需要产品知识，我没猜）

1. **panic-exit-devices 42 个里有 30 个没有子类标签**（71%）。旗舰线的子类菜单
   只覆盖 12 个，五个子类各 1–6 个。菜单里照实显示数字，不粉饰。
2. **两个子类 0 产品**：`knob-locks/wafer-locks`、`hardware-accessories/armoured-lock-covers`。
   `getMenuCategories()` 会过滤掉 0 产品的子类 —— 菜单条目点进去「无匹配产品」是缺陷不是占位。
   测试把这两个钉成已知清单，甲方补货或删项时需要显式更新。

## 三、菜单本身

抽屉的 Products 区改成两级，就是香奈儿从 Skincare 钻进 Serums 的做法：

- 15 个类目**全部带产品数**（`Deadbolts 7`）。数字是这一行有用的那一半 ——
  它是「Deadbolts」和「Deadbolts，我们有 7 个」的区别。
- 4 个有子类的类目变成折叠盘（panic / knob / glass / hardware），
  展开后第一条永远是 `All <类目>`（筛选是收窄，未收窄的全集必须一键可达）。
- 其余 11 个是平的，直接跳转 —— 展开一个空盘比不给展开更糟。
- 一次只展开一支；15 个类目同时展开就是这个菜单本来要消灭的滚动墙。
- 子类链到 `/products/<类目>/?type=<子类>`，与筛选栏写的查询串完全一致。
  实测 `?type=fire-door` 落地即选中「Fire Door Devices」。

数字在服务端算好经 props 下发，客户端不引入 `products`（435 条记录）。

## 四、顺手修了 Codex 的红测（单独提交 843d218ec）

`61bb44f8` 按已批准设计把 `/services` 从 footer 数组移除，但 `services.test.ts`
仍断言 footer 含 `/services`，`npm test` 变红。测试意图没变（Services 必须可达且
不进顶栏），改为校验抽屉 Company 组与桌面 Company shelf，sitemap 断言保留。

## 五、一次操作失误，已恢复，记录在案

我为了判断红测是否先于我的改动，跑了 `git stash -u` —— **这会把 release builder
未提交的 5164 个 `out/` 文件一起卷走**。`stash pop` 已完整恢复（stash 列表空、
`out/` 仍 5164 个改动、我的文件都在），无损失。

**教训写在这里：共享工作树里不要用 `git stash`。** 判断某个测试是不是自己弄红的，
正确做法是看该测试读了哪些文件，再比对自己的 `git status` —— 不需要动工作树。
