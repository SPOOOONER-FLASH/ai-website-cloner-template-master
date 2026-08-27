# Codex — 首页交互分层 · 分类封面补齐

| | |
|---|---|
| 范围 | 英文/西语首页交互、`HeroModule` 编辑态动效、产品分类 15/16 封面、回归测试 |
| 未动 | 首页文案、产品事实、促销弹窗、Argentina AR-4 公开内容、`out/`（源代码提交后由本批次重建） |

## 已完成

- 首页交互改为三级：导航/文字仅短线；真正卡片使用 A+D 细框、短线、硬质错位投影；大型编辑模块只做约 1% 图片微推近与 CTA 短线。
- `For distributors / For specifiers` 归入真正卡片，静止无框无影，hover / focus 三者同步出现和收回。
- Welcome 与三个文字模块不再整块描边或抬升。
- Lock Cylinders 使用现有 70SN 主图；Sliding Hook Locks 使用现有 881 SS 主图，消除产品入口两块空白占位。

## 验证

- `npm test`：49/49。
- `npm run lint`、`npm run typecheck`：通过。
- Chrome DevTools：桌面卡片 rest/hover、Hero rest/hover、两张分类图 naturalWidth=800、无控制台 error/warn、无横向溢出。

## 后续协助

- Codex：完成发布构建、推送和生产核验；另做不部署的 `HYDE Argentina AR-4` A/B 与交互体系预览。
- Claude：如开始 Argentina 文案/框架，只使用已确认型号与规格，不公开 Piccolo/Elabora/Stahlock/OEM 关系。
