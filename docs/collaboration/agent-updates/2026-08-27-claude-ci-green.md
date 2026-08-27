# Claude — 修 CI 连续失败

## 是我上一个提交打断的

`home-accent.test.ts` 有一条断言直接 grep `src/data/categories.ts` 的**源码文本**：

    /slug: "lock-cylinders"[\s\S]*?image: \{ src: "\/images\/products\/70sn-lock-cylinder\.webp"/

我把分类数据挪去 `content/categories.json`（修 CMS 接线）之后，数据仍然正确，
只是"写法"变了，正则就匹配不上了。CI 与 Build-and-deploy 两条流水线都跑 `npm test`，
所以两条一起红。

## 为什么我本地没发现

**`npm run check` 不跑 `npm test`。**

    check = lint + typecheck + build + test:export
    test  = 另外 10 个单元测试文件（含 home-accent）

AGENTS.md 里这两条是分开列的，我只跑了 check 就提交了。CI 两个都跑，所以本地绿≠CI 绿。

**已把 `npm test` 加进 `check`。** 这是这次真正要修的东西——测试本身只是症状。

## 断言改成对数据断言

原来只盯两个 slug（历史上出过问题的那两个），现在覆盖全部 16 个分类瓦片：
从 CMS 通过后台新增一个没封面的分类，也会被拦下。子分类不算——它们是筛选维度，不是瓦片。

    node --test 直接跑 .ts，没有 @/ 路径别名，所以测试直接读 JSON，不 import 数据模块。

## 验证

`npm run check` 全绿：**49 个单元测试 + 23 个导出测试**，473 页，0 semantic issue。
