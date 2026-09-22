# 2026-09-21 Claude — 规格覆盖率数字纠错 + 生成器

**Agent:** Claude
**Scope:** `scripts/spec-coverage.mjs`(新)、`docs/research/SPEC_COVERAGE.json`(新)、`package.json`、四篇 guides。未动 `src/`、`out/`、`out-rayen/`。

## 出了什么错

第 18/19/20 篇里那些「924 个产品里有 N 个发布了某字段」的数字，是我在写文章时**临时敲正则**量出来的。正则太松，扫进了不该算的标签：

```
/hand/i          → 把 "Handle Material"、"Handle Design" 也算成了 handing
/cent(re|er)/    → 把 "Fixing centre"、"Spindle centre" 算成了中心距（完全不同的尺寸）
/forend|faceplate/ → 漏掉了带空格的 "Face plate"，少算 4 个
```

八个已发布的数字里有六个是错的：

| 字段 | 已发布 | 真值 |
|---|---|---|
| Backset | 175 | 175 ✅ |
| Centre distance | 148 | **145** |
| Door thickness | 277 | **285** |
| Handing | 186 | **184** |
| Forend / faceplate | 6 | **10** |
| Finish（产品数） | 327 | **325** |
| Finish（不同取值） | 85 | **84** |
| 写了黑色但不说工艺的行 | 30 | **36**（八种拼法） |
| 已发布尺寸图 | 85 | **84** |
| 门孔加工图 | 96 | **95** |

后两个是跑 `build-dimension-drawings.mjs` / `build-door-prep-drawings.mjs` 自己报出来的，目录变过了。

**四篇文章都还没进 `out/`，所以这些错数字从未上线。**

## 修法：先写生成器，再写数字

按 AGENTS.md「写生成器，然后跑它；不要写输出」，新增 `scripts/spec-coverage.mjs`。

关键设计：**用显式标签白名单，不用正则。** 加一个新标签必须在脚本里登记，这本身就是一道拼写与同义词检查。已知但刻意排除的标签也列出来了（裸 `Thickness` 81 行、`Rose thickness`、`Fixing centre`、`Finishing process` …），让下一个人知道那是决定不是遗漏。

脚本还会报告「未登记但看着相关」的标签，避免静默丢数据。

顺带量出来的一个真实数据缺陷：**5 条记录的标签拼成了 `Handling`**，值确实是分手别信息。白名单暂时把它收进来了，但它应该被改成 `Handing` —— 见下面待办。

## 接进 CI

```
specs:coverage        node scripts/spec-coverage.mjs
specs:coverage:check  node scripts/spec-coverage.mjs --check
```

`test:export` 现在以 `specs:coverage:check` 开头（快速失败）。`--check` 失败时会直接列出引用了这些数字的四篇文章，所以它不只是说「JSON 过期了」，而是说「目录动了，去看这几篇要不要改」。

## 测试

```
npm test                            353 passed, exit 0
npx tsc --noEmit                    exit 0
npm run specs:coverage:check        exit 0
merge-guide-table-rows.mjs --check  exit 0
add-guide-hero-images.mjs --check   exit 0
```

## 没有动、但下一个人应该动的

**那四个缺口数没有生成器：**不锈钢牌号 224 行、zamak 156、黄铜/DZR 57、圆柱内外分配 45。它们散落在好几篇文章里。

我用临时正则量了一遍，得到 419/290/532 —— 和已发布值差得太远。**这说明我的正则不是同一个测量**（它把 "Polished Brass" 这种表面处理也当成黄铜牌号了），不是那些数字错了。没有证据就没有改。

这是独立的一件事：需要先确定原始定义，再把它写成 `spec-coverage.mjs` 里的字段，然后读按字段的 diff。**不要塞进别人的修改里**——这正是 AGENTS.md 里 `translate-products-es.mjs --write` 那条教训。

**`Handling` → `Handing`：**5 条产品记录的标签拼错了。改它要动 `content/products`，属于我的归属区，但会和别人正在做的产品改动撞车，所以单独一个提交做。

## 教训（已经是 AGENTS.md 里那条的下一级）

「返回 0 不等于做对了事」的隔壁是：**一个量出了数的正则，不等于量对了东西。** 正则不会告诉你它多匹配了什么。白名单会。
