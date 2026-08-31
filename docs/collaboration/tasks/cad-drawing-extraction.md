# 任务 · 从产品图纸提取尺寸（Codex / Kimi）

> 派给：Codex 或 Kimi，二选一或分工。Claude 已做完 19 个，方法和坑都在下面。
> 前置阅读：`HANDOFF.md` 第八·七节、`scripts/cad-dimensions.mjs` 的头注。
>
> ⚠ **先 `git pull`。** 本任务的全部文件都在 `origin/main` 上。第一版任务书曾把清单
> 指向 `tmp/claude-cad/` —— 那是 `.gitignore` 里的目录，**永远不会同步给别的 agent**。
> 已改为下面这些跟踪路径。（这是 Claude 的疏忽，不是你的检出有问题。）

## 为什么这件事值得做

产品图库里混着**带尺寸标注的 CAD 图纸**，一直没被读过。它是我们手上最权威的来源
——甲方自己的生产图，不是门店文案——而且**它推翻过已发布的数据**：

五个玻璃门拉手（100 / 102 / 104 / 106 / 107）都写着 `Size = 32x300x600 mm`，
是 stahlock 一条商品文案被复制到整个系列。五张图纸给出五种几何，
**没有一张出现 300mm**，中心距分别是 148 / 147 / 149-133 / 125 / 148。

同时它也是最后一批差异化数据：32 个不锈钢拉手此前共用一句摘要，
因为除型号外没有任何区别；执手长度和座径从图纸上读出来之后就分开了。

## 现状

| | |
|---|---|
| 已读并写入 | **27 个产品**（`scripts/cad-dimensions.mjs` 的 `FROM_DRAWINGS`，每条带 `drawing` 出处） |
| 待读清单 | **`docs/collaboration/tasks/cad-drawing-ranked.json` —— 82 个产品 / 90 张图，按缺口大小排序** |
| 剩余缺口 | 9 个产品 0 行规格 · 27 个 1–2 行 |

⚠ **旧的 `cad-drawing-candidates.json`（248 张）和 `cad-drawing-worklist.json` 不要再用了。**
它们是"宁滥勿缺"的初筛，三分之二是产品照。ranked 那份是从同一批图里挑出来的。

## 判据已经解决了：speckle

之前记录的三条弯路都在量**墨水本身**（多黑、线多长、有没有中间灰）。真正分开两类的
不是墨水，是墨水**有多孤立**：

- 产品照是实心物体，绝大多数暗像素周围还是暗像素——那是物体的内部。
- 图纸是细线加小字，绝大多数暗像素周围是纸。

`speckle` = 8 邻域中浅色占多数的暗像素比例。`scripts/score-cad-drawings.mjs` 算这个。

**实测分离度**（1478 张全库）：

| 集合 | speckle |
|---|---|
| 19 张人工确认的图纸 | 0.53 – 0.99（18 张进前 84 名） |
| 14 张人工确认的产品照 | 0.01 – 0.18 |
| 中间地带 | 没有样本 |

2026-08-31 按这个排序开了 8 张，**8 张全是图纸**。此前按旧清单开 6 张，0 张。

⚠ **一个已知反例**：`lc9045-lock-case.webp` 是真图纸却排到第 1074 名——它是深色渲染图，
上面只印了 90 和 45 两个数字。**分数低不能当作"这不是图纸"的证据**，只能用来排先后。

```bash
node scripts/score-cad-drawings.mjs --top=40      # 看排名
node scripts/score-cad-drawings.mjs --json=<path> # 机器可读
```


## 怎么写入

照 `scripts/cad-dimensions.mjs` 已有的格式加条目：

```js
"<slug>": {
  drawing: "<图片文件名>",        // 必填：出处，任何人都能复查
  remove: ["Size"],               // 选填：图纸推翻了哪个已有标签
  specs: [["Length", "600mm"], ["Centre distance", "148mm"]],
},
```

跑 `node scripts/cad-dimensions.mjs --dry` 看对照，去掉 `--dry` 写入。
幂等，已有的标签不会被覆盖。

## 三条纪律

1. **只写图纸上印着的数字。** 不要从兄弟型号推断 —— 100 和 107 都是 148mm，
   102 是 147，106 是 125。差一毫米就是另一个型号，这正是复制尺寸危险的地方。
2. **图纸没标注名称的，就照位置描述，别贴术语。** 例：LC9045 的图上只有 90 和 45，
   没说哪个是 backset，所以写成"前端到锁芯中心 90mm"。这是横装锁体，量法和
   LC85xx 不同，硬套术语会错。
3. **认证行一律丢弃。** stahlock 的 305 页面写着 `Certification: EN1205 compliant`
   ——世上没有 EN 1205，是 EN 1125 的错字。我们只有两份自己的检测报告，
   且都不覆盖这些型号。见 `src/data/company.ts` 的 certificates 块。

## 完成后

```bash
node scripts/translate-products-es.mjs --write   # 新标签要补西语
npm run check                                    # lint + typecheck + test + build + audit
npm run deploy:prep
```

新增的规格标签记得在 `src/data/es-glossary.ts` 补西语，否则西语页会露出英文。
提交时附一份 `docs/collaboration/agent-updates/`，写清读了哪些图、
哪些图纸与现有数据矛盾。**矛盾的那些最重要，务必单独列出来。**
