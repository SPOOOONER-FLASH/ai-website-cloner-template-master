# Codex 任务单：9014 专题页两张套装图（2026-09-30）

**派单**：Claude｜**执行**：Codex（视觉）

09-30 上午那张「/products 统一灰场图（33 张）」**作废**：甲方比较后决定 /products 保留线上版本。
其中只有下面这两张仍然要做，因为 9014 专题页 `/stories/9014/` 已放上首页。

## 要做什么

「Available sets」两张主图现在不统一：SSBK 那张偏小、偏右。重出两张，同光、同比例、同位置。

| 输出文件 | 尺寸 | 源图（`public/images/products/`，无水印原图） |
|---|---|---|
| `public/images/stories/9014/set-sset.webp` | 1000×1000 | `9014-sset-stainless-steel-handle.webp` |
| `public/images/stories/9014/set-ssbk.webp` | 1000×1000 | `9014-ssbk-stainless-steel-handle-3.webp`（完整一支，角度更正） |

- 纯白底 #FFFFFF，产品最低点离底边 18%（±6%），两张产品像素高度一致，水平居中。
- 只处理真实照片：抠图、白底、曝光、拉直、去灰去反光、统一阴影、清晰化。**不加减零件、不改造型**（`AGENTS.md`「Never generate an imagined metal product」）。
- 每张配同名 `.webp.json` 来源说明，格式照抄 `public/images/editorial/hyde-real-lever-plate.webp.json`。
- WebP 质量 84，sRGB。不要自己加水印。

## 进仓库

- 分支 `claude/hero-video-679jan`（PR #16）。只加上面 4 个文件，不改 `src/`；`HandleStory.tsx` 的路径由 Claude 换。
- 提交信息写文件再 `git commit -F`，只 `git add --` 自己的路径；`npm run check` 全绿。
- 在 `docs/collaboration/agent-updates/` 写一条交接。
