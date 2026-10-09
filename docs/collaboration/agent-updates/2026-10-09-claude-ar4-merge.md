# 锁体 110 / 140 / 1121 并入 AR4，搜索旧号仍命中

- Agent：Claude（云端线程，分支 `claude/project-thread-464rgp`）
- Commit：与本 update 相同的提交
- 目标：客户（spooner）要求把「先上架、无规格」的 AR4-110 / AR4-140 / AR4-1121 与后上架、有规格的 110 / 140 / 1121 锁体合并为一条，搜索「140」仍能找到。
- 修改范围：
  - `content/products/hyde-ar4-{110,140}-mortise-lock.json`、`hyde-ar4-1121-hook-bolt-lock.json`：规格取自我方 Hyland 图纸（工厂编号 6840 = 中心距 68 / 进深 40，7225 = 72 / 25），旧 AR4 的面板 210、190 是照 Piccolo 目录抄的，已用图纸值替换；并入旧记录的图库和视频；新增 `modelAliases`。
  - 删除 `content/products/{110,140,1121}-lock-case.json`；`content/taxonomy-moves.json` 加 3 条 `productMerges`，`deploy/nginx/taxonomy-redirects.conf` 重新生成（旧网址 301 到 AR4）。
  - 搜索：`Product.modelAliases`（`src/data/types.ts`）→ `scripts/build-search-index.mjs` 写入 `aliases` → `src/lib/search-matching.ts` 别名与型号同分；`search-matching.test.ts` 锁定「110 / 140 / 1121 时 AR4 排第一」。
  - 七语种 `content/i18n/*/products.json`：去掉旧 slug，重建 AR4 规格行。
  - 计数随目录变化（HYDE 616→613 等）：锁体对照指南重新生成（33/54），`dimensional-interchangeability-2026` 三语和七语种全改；`why-the-catalogue-is-this-wide`、`mortise-lock-backset…`、`hardware-refurbishment-survey-2026` 等英西葡改；`content/faq.json` 549→546。
  - `src/data/generated/spec-sheets.json` 去掉 140-lock-case，删除其 10 个 PDF。
- 验证：`npm test` 457/0；i18n-lint、titles:check、spec-coverage --check、lock-case tables --check 均通过；`npm run check` 见提交说明。
- 明确未修改：`docs/collaboration/LOCALE-MIRROR-STATUS.md`（他人未提交改动）；`out/`（发布棒在 johns）。
- 已知风险 / 外部阻塞：
  - **图片来源**：AR4-110/140/101 的主图与阿根廷 Piccolo 目录照片高度相似（推断，未核实）；旧 110-7、140-6、1121-8 是 Piccolo「Terminaciones」图，合并时已排除，但 AR4 页上仍可能有 Piccolo 来源图，建议工厂补拍后替换。110-6/140-5 的「装在门里」图疑似生成图。
  - AR4-101 规格（18×183、深 63）看起来抄自 Piccolo，没有我方图纸可核对。
  - 其他计数文章的七语种 overlay 本来就停在 588，这次未动，留给本地化轮次。
  - AR4 三款还没有规格书 PDF：需在 johns 上跑 `npm run spec-sheets`；`spec-sheet-gaps.md` 已过期。
  - 与本次无关但构建时发现：在 origin/main 上 `npm run build` 会改写约 190 个 `public/images/{drawings,door-prep}/*.svg`（centre→center、millimetres→millimeters），并把 `src/data/generated/products-zh.json` 的中文规格值改回英文（RAYEN 车道），说明已提交的这些生成文件与生成器不一致。本提交没有带上这些改动；RAYEN 侧和图纸生成器的负责人需要看一下。
  - 新 301 需随下一次发布 + nginx reload 生效（`deploy/install-nginx-redirects.sh`）。
- 下一步：发布者合并后 `npm run release:hyde`；Claude 继续做 AR-4 四类（安全锁 / 铝门窄锁 / 普通锁 / 插销门栓）方案预览。

## 追加（同日）：AR-4 按 Elabora / Piccolo 四类改名，AR4-101 按 7240 图纸

- 客户确认：Elabora（品牌 Piccolo）的这几款是我们代工、模具是我们的。四款按他们的四类改名：AR4-110 安全锁（Cerradura de seguridad）、AR4-140 铝门锁（Aluminum-Door Mortise Lock Body / Cerradura para aberturas de aluminio）、AR4-101 普通锁（Cerradura común）、AR4-1121 插销门栓（Hook-Bolt Deadlock / Cerrojo de gancho）。三语简介按图纸尺寸重写，七语种名称、简介和 sourceHash 同步。
- AR4-101 规格按工厂目录 7240 页（客户 2026-10-09 发的截图）：面板 220 × 25、锁体高 140、进深 40、中心距 72。旧值 18×183、深 63（抄自 Piccolo）已删。锁体宽度图上没标，没写。
- AR4-140 加 Application 行「Aluminum narrow-stile doors」，否则标题生成器会套品类场景「for Metal Doors」。
- `content/i18n/zh-terms.json` 加两个新品名（中性车道，RAYEN 渲染会用到）。
- 锁体对照指南 34/54、标准 22、缺口 20；七语种 overlay 已跟。互换性文章 backset 113、中心距 37 (15%)；backset 指南 182 / 36；翻新调查 182 / 44。
- 线索：JM-LOCK 询的 Candex 117（面板 220、锁体 140×65、中心距 72）很可能就是 7240 / AR4-101，待工厂确认锁体宽 65。
- Elabora 目录图仍不得使用（版权与客户关系），AR4-101 主图来源存疑，需工厂原图或补拍。

---

## 本地 Claude 接手（2026-10-09）：AR-4 模块换成 Elabora 式分类方块

甲方：「https://www.elaboraoficial.com/piccolo 你去别人网站看看怎么设计交互展示的……把这换掉」，
圈的是首页 AR-4 模块的四张产品卡。

**看过 Elabora 的交互**：四个正方形方块，各链到自己的分类页；照片蒙一层白、分类名大字压在上面；
悬停时白色褪掉，露出真实照片。

**做法**：`ArgentinaAr4Showcase.tsx` 的卡片换成方块，首页（十语种）和 /products/argentina-ar4/
共用同一个组件，一处改两处生效 —— 交接里的 B 项（AR-4 页简化成四个分类块）也就一起完成了。

- 方块标题直接用产品自己的名字（已按 Elabora 四大类改名，十语种齐），**不新增任何文案**。
- 白色蒙版停在 20% 而不是 0：Elabora 完全褪掉后标题压在照片上看不清。
- 型号数字从浅灰改为墨色：浅灰压在锁面板金属上几乎看不见。
- 手机 2×2，长名字折 2–3 行不溢出，页面无横向滚动（实测 375 宽）。
- 删掉了因此变成死代码的手机横滑轨道和「Nickel-plated iron lock case」行。
- **Elabora 的图一张没用**，只借交互。

**测试**：`npm test` 457、lint、typecheck、motion-token 检查全过。用 Playwright 在 1440 与 390
宽各截图验证，悬停后蒙版透明度实测从 1 变为 0.2。

**踩到的环境坑（记下来）**：本机 `npm run dev`（Turbopack）的 postcss 子进程一直超时崩溃；
`next dev --webpack` 可以用。另外 **从主仓库目录启动、指向 `tmp/` 下的 worktree 时，Tailwind
不会扫描 worktree 的源码**（`globals.css` 有 `@source not "../../tmp"`，而且 `tmp/` 在 gitignore
里），新写的类根本不生成 —— 页面看起来"差不多对"，因为旧类在主仓库源码里出现过。必须在
worktree 目录里启动 dev server。正式发布不受影响（release 在自己的检出目录里构建）。

**A 项（红色 Hyland 标志）查完：网站上已经没有，不用改。**

- 红色 Hyland 只在原图 `public/images/products/{110,140,1121}-lock-case*.webp`（24 张全有）。
- HYDE 站点不显示原图：`src/data/product-image-branding.ts` 把 `/images/products/` 换成
  `/images/products-hyde/`，那 24 张左上角已是 HYDE 标（现有 legacy-badge 修复做的），逐张裁角看过。
- 其他引用：spec-sheets、分享图、文章都不引用这三组原图。广交会目录第 71 页是抠图，无标志。
- 所以没重跑 `assets:watermark`，没改原图 —— 改原图要重生成 24 张，结果和现在一样。
- 顺带：`110-lock-case-7`、`140-lock-case-6`、`1121-lock-case-8` 是西语「Modelo …/Terminaciones」
  参数页，来源不明（可能是客户目录），**目前没有任何记录引用它们**，保持不用。

**还没做**：AR4-101 主图来源仍未确认（交接要求向老板要 7240 原图）。

**合并进 main（客户 10-09：「合并」）**：PR #20 分支先合入最新 main 三次（main 期间一直在动）。
冲突只在 5 篇文章的 `summary`（AR4 分支没改过，取 main 的新版）和两个生成文件（重跑 `npm run content`）。
检查：lint、typecheck、`npm test` 458/0、i18n-lint、titles:check、stamp --check 全过；webpack 构建 +
`test:export` 只剩 71 条 `%5B` chunk 路径误报（worktree 里只能用 webpack 构建，Turbopack 找不到
借用的 node_modules；正式发布用 Turbopack，不受影响）。AR4 的 616→613 计数改动已核对保留。
**需要再发布一次**：AR-4 方块和 110/140/1121 并入 AR4 都在这次合并里，`release:hyde` 之后才上线；
301 需 nginx reload（`deploy/install-nginx-redirects.sh`）。
