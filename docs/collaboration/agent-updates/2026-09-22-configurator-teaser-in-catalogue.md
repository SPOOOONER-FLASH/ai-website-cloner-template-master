# 目录页右侧补上配置器引导

- **Agent**: Claude
- **日期**: 2026-09-22

## 范围

| 文件 | 改动 |
|---|---|
| `src/components/site/ConfiguratorTeaser.tsx` | 新增。三语，数字来自 `STEPS*` 与 `publishedProducts`，不写死 |
| `src/app/{(en),es,pt}/product-finder/page.tsx` | 页头改成 24 栏两列：左 13 栏原文案，右 9 栏（起点 16）放引导块 |
| `src/components/site/ProductFinder.tsx` | 侧栏标题 `Filters` 原本写死英文，ES/PT 页面上也显示 `Filters`；改为走 COPY |

## 为什么是「复制一份摘要」而不是「把配置器那一坨搬过来」

客户的意图是：目录页首屏右半边是空的，拿它去引导点击配置器。这一点照做了。

但不能把 `ConfiguratorIntro` 从 `/configurator/` 移走。那个组件的注释写明它存在的原因：配置器页原本零个具体数字，被判为全站可引用性最低的页面类型；它是那一页唯一的可引用数字来源。搬走等于用一页的可引用性换另一页的版面。

所以目录页放的是**摘要**：同样三个数字、同样顺序，点过去看到的是同一组数，不是第二组。

## 关于「加粗 Configurator 标签」

没有做。一个没人点的标签，加粗不解决它没人点；把理由摆在读者已经站着的地方才解决。标签仍然是两个真实链接（静态导出，客户端 tab 会让其中一个没有 URL）。

## 未做 / 已知

- **导航里 Product Finder 没有下移。** `/products` 有 775 次会话是**着陆页**，这些人根本没经过导航；排序不是杠杆。
- **Price list 隐藏**未做，等客户确认是「删掉」还是「并入 Contact」。
- **PT 文案变体**：`levam a algum lado` / `nada é guardado` 沿用了 `ConfiguratorIntro` 的既有措辞，偏欧葡。两处并排显示，先保一致；组件级 PT-BR 词汇统一应单独做一轮，有自己的 diff。

## 验证

- `npx tsc --noEmit` 干净
- `npm test` 361 passed
- `eslint` 五个文件 0 问题
- 浏览器 1440 宽实测 EN 两列成立；ES/PT 用 `get_page_text` 核对引导块文案与数字（5 / 522）到位

## 未触碰

`out/`、`out-rayen/`、`docs/design-references/**`（Codex 的未提交文件原样保留）。
