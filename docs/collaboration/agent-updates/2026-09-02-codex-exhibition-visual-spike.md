# 2026-09-02 · Codex · 展架视觉 spike

- **Changed:** 新增 `docs/design-references/codex-exhibition-visual-preview-2026-09-02/`：4 张离线展架/展墙概念、展会照片的结构分析、完整 prompt 记录。没有改首页、`public/images` 或线上引用。
- **Quality gate:** 两张未入库样稿被淘汰：一张虚构把手变体/钥匙；一张在锁体面板上虚构铰链。保留的 4 张仍是候选，公开使用前必须逐件核对产品结构。
- **Decision:** 竞品展位只作展架、分组、取景与灯光参考；不得复用 logo、文案、认证、参展事实或竞品产品。工厂实拍归 Company，不拉伸成首页 hero。
- **Checks:** `npm run check` 通过：151 unit + 25 export tests；980 routes；SEO semantic issues 0；editorial warnings 0。
- **Client communication:** 后续发布只简报提交/检查/是否上线，不再实时播报缓存等待、hash 与重复验证过程；Cloudflare 全区 purge 仍由客户手动执行。
- **Untouched:** `scripts/__pycache__/` 是陌生未跟踪路径，未删除、未暂存。
- **Next:** 客户先选展架空间、三面产品墙、出口装置墙或单锁体特写；只有选中的方向才进入产品结构复核、响应式 WebP 与首页接线。
