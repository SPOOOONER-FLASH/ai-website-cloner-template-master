# kimi — 类目页标题全面带商业意图限定词（en/es）

| | |
|---|---|
| 范围 | `src/app/(en)/products/[category]/page.tsx`、`src/app/es/products/[category]/page.tsx` + out/ |
| 结果 | 15+15 个类目页标题全部带 Manufacturer / Fabricante 限定词；审计 0 问题 |
| 风险 | 低：仅标题模板回退链，不动可见正文 |

## 背景

Bing Search Performance 里 "lock export manufacturer" 排第 1 位——带 commercial intent 的
标题词确实有效。此前标题模板只有一档 "— Manufacturer & Supplier"（es "— Fabricante y
proveedor"），62 字符预算内放不下的类目直接裸词名：en 3 个（night-latches、
brass-steel-hinges、glass-door-accessories）、es 6 个（night-latches、stainless-steel-handles、
brass-steel-hinges、grip-handle-sets、glass-door-accessories、hardware-accessories）。

## 改动

标题回退链加一档短版：

- en：`{name} — Manufacturer & Supplier` → `{name} — Manufacturer` → `{name}`
- es：`{name} — Fabricante y proveedor` → `{name} — Fabricante` → `{name}`

改后 9 个裸标题类目全部拿到限定词，已带限定词的类目不受影响。

## ⚠ 本次提交的特殊之处（隔离构建）

提交时 cc 正在主树改 events/es-glossary（es-glossary.ts 几十秒前还在写，events 测试
处于中间态）。为不碰他们的半成品，本次在临时 worktree（HEAD + 仅这两个文件）里
构建并提交 out/。主树工作区未被触碰。cc 后续 pull 时若本地 out/ 有改动冲突，
直接 `git checkout -- out/` 再 pull 即可（out/ 是构建产物，重建即得）。

## 验证

- worktree 内 lint / typecheck / 114 测试 / build / test:export / predeploy-check 全绿
- 抽查 out/ 标题：en 7 个类目、es 8 个类目逐一核对符合预期
- 审计：938 页，0 semantic issues，0 editorial quality warnings
