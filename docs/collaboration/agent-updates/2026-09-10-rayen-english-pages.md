# 雷茵英文版页面上线（源码）

| 项 | 内容 |
|---|---|
| agent | Claude |
| 范围 | `src/app/zh-en/**`、`src/components/rayen/pages.tsx`、`src/components/rayen/{Chrome,primitives,Gallery}.tsx`、`src/app/zh/**`、`src/data/rayen-i18n.ts`、`content/rayen/site.json`、`scripts/build-rayen-site.mjs`、`src/lib/rayen-paths.test.ts` |
| 检查 | `npx eslint`（干净）、`npx tsc --noEmit`（干净）、`npm test` 241/241 通过、`npm run rayen:mirror` 产物与已提交版本逐字节一致 |
| 未构建 | 是。`out/` 脏，`src/app/(en)/product-studies/` 等是 Codex 未提交的在途工作，构建会把未审过的源码烤进发布 |
| 没碰 | Codex 的 product-studies 全套（`src/app/(en)/products/page.tsx`、`src/app/es/products/page.tsx`、`src/app/sitemap.ts`、`src/lib/spanish-mirror.ts`、`ProductStudies.tsx`、`scripts/publish-hardware-studies.mjs`） |

## 地址形状（最容易踩的一条）

- 构建期前缀：`/zh`（中文）、`/zh-en`（英文）
- 部署后地址：`/`（中文）、`/en/`（英文）

`/zh-en/` **永远不是一个可访问的网址**。甲方 2026-09-10 访问
`https://spoonercantonlock.stahlock.com/zh-en/` 得到 nginx 404，是符合预期的——
`scripts/build-rayen-site.mjs` 把 `out/zh-en/` 抬到 `out-rayen/en/`，
并且必须**先**替换 `/zh-en/` 再替换 `/zh/`（反过来会把前四个字符吃掉，剩 `-en/`，
构建不报错、页面照出，只有点下去才 404）。

英文站要能访问，还差一次构建 + 提交 `out-rayen/`，见下条。

## 下一个人接手

1. 等 Codex 的 product-studies 提交落地，或确认 `out/` 干净
2. `npm run deploy:prep`
3. 确认 `out-rayen/en/index.html` 存在且内部链接是 `/en/...`
4. `git add out/ out-rayen/` 后再 `git commit`（pathspec 不会加未跟踪的新文件）
5. 推送，提醒甲方 purge

## 为什么英文是重写不是翻译

`en` 区块来自 `content/products` 的英文原文，不是把中文译回去。
规格行、材质、表面处理在英文源里本来就是英文，回译会把 "Satin stainless steel"
变成 "缎面不锈钢" 再变成别的东西。站点文案（走进雷茵/品质与认证/OEM）是按英文买家
重写的，不是中文的直译。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
