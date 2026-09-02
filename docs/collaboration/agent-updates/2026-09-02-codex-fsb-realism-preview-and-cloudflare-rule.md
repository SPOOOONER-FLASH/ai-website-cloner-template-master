# 2026-09-02 · Codex · FSB 视觉拆解、10 张真实感样图、Cloudflare 纪律

## 本次完成

- 逐模块拆解 FSB NA 首页与 FSB 1138 Dieter Rams relaunch，落在
  `docs/research/fsb/2026-09-02-fsbna-home-and-1138-visual-teardown.md`。
- 建立 10 张离线预览，位于
  `docs/design-references/codex-home-realism-preview-2026-09-02/`。没有改首页数据、
  `public/images/` 或线上引用。
- 样图纪律：一图一义、套件同色、产品结构来自实物源图、工厂实拍不可 AI 重绘、
  门内外关系分开、旧 logo 不准白块遮盖、AI 图不作规格/认证证据。
- 两次主动淘汰：装配线 AI 清理图因重绘生产事实淘汰；银色 305 + 黑色 016 因混色
  淘汰。保留真实装配原片与全黑 fire-exit 概念图。
- `AGENTS.md` 增加 Cloudflare 客户手动 purge 纪律，并用
  `scripts/sync-agent-rules.sh` 同步四份平台规则。Agent 禁止登录/自动控制 dashboard、
  获取/使用 API Token 或调用 zone purge endpoint；不得把单个新缓存键冒充全区 purge。

## 验证

- `npm run check`：151 unit + 25 export tests 通过；980 static routes；SEO semantic issues 0；
  editorial warnings 0。
- `npm run deploy:prep`：969 public content pages；969 JSON-LD；918 reciprocal alternates；
  predeploy check 确认 `out/` 新于全部源码。

## 风险与边界

- 01–07 为实物图约束下的 AI 视觉候选，仍须逐件对照源图；不能拿来证明尺寸、包装、
  认证或兼容性。
- 08 是真实 CNC 原片的局部旧标修复；09 是完全未 AI 编辑的真实装配车间。
- 10 只表达同色、门内/外两面的场景逻辑；305 与 016 的具体组合须工程确认后才能上线，
  且不得暗示 EN/UL 认证。
- 甲方确认样图方向前，不替换首页或汉堡抽屉图片。

## 下一步

甲方选定候选及使用位置后，Codex 只将通过产品结构复核的图片制作响应式 WebP、登记
provenance，再替换首页/抽屉并重新发布。Cloudflare 全区 purge 由甲方手动执行。
