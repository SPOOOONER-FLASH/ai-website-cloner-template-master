# 2026-10-12 · Claude（文案会话）· HYDE 动效四合一演示页

**甲方**：「先做演示页，可以用 motion……动画炫酷精美华丽 专业 牛逼就可以上」。

**做了**：`docs/design-references/2026-10-12-motion-demo/` 是一个独立的 Vite + React 项目，装了 `motion`、`lenis`、`d3-geo`，有自己的 node_modules，不进正式站。
- `node prep.mjs` 从 `content/products`（按 HYDE 规则：在 HYDE 目录里且有主图）算数字：549 款、17 类、8 组品类数量；还从 `public/images` 和目录白底图复制图片；世界陆地点阵用 world-atlas 和 d3-geo 预先算好。
- `npx vite build` 输出单文件 `dist/index.html` 加 `img/`，双击就能打开。桌面 `03-研究与方案/HYDE动效演示页-2026-10-12/` 放了一份。
- 共 12 段，各借自远高 4、1、3、2 号方案，对应 `docs/research/2026-10-12-HYDE动效四合一方案.md`。右下角是中文的演示开关，对应方案里的问题 1、2、5，另外可以模拟“减少动效”。
- `shoot.mjs` 用 playwright-core 加系统 Edge 无头截图。应用内浏览器面板隐藏时不出动画帧，Playwright MCP 又被别的会话占着。

**没用的素材**：`hyde-editorial-exhibition-wall-*` 是 AI 生成图，按产品图规矩不用。工厂四张图取自现有公司页。

**eslint**：`docs/design-references/*-motion-demo/**` 加进了忽略列表。它有自己的依赖，不属于站点代码。

**下一步（#48）**：甲方点名三段（出口地图加品类数量条、品类索引跟手图、工厂故事）要加进正式首页。
