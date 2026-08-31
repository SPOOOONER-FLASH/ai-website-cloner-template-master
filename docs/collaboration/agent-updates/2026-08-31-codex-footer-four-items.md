# Codex update — Footer 四项收尾

| 项目 | 结果 |
|---|---|
| 范围 | `How to buy` 精确保留 Contact、FAQ、Buy on Alibaba、`lock@cantonlock.com` |
| 行为 | Downloads、Company、Certificates、Projects、Services、Events、Price list 仅从 Footer 移除；页面与其他导航保留 |
| Alibaba | 复用全局 D 风格 hard-shadow CTA，增加 Footer 局部紧凑尺寸，不改全局按钮和 reduced-motion 规则 |
| TDD | 新测试先因 9 个内部链接失败；实现后 `node --test src/components/site/header-shelf.test.ts` 6/6 通过 |
| 验证 | `npx eslint src/components/site/SiteFooter.tsx src/components/site/header-shelf.test.ts`、`npm run typecheck`、owned-path `git diff --check` 通过 |
| 未触碰 | `out/`、Panic Exit Devices 首页首图、Claude 已提交的首页目标链接/移动导航/字阶工作 |
| 下一项 | 建立五组编辑图第一方参考清单，生成 15 张候选，逐张原尺寸复核并评分 |
