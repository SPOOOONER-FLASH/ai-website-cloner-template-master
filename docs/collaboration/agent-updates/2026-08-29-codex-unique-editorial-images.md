# Codex — 首页与 News 独立编辑影像

## Scope

- 新增四张互不复用的编辑影像：主页逃生锁首帧，以及门五金明细表、锁体尺寸、型号后缀三篇 News。
- 四张图均由内置 ImageGen 以纯文字提示生成；没有输入 FSB、网页、客户或产品参考图片。
- 原始成片经 Sharp 以 WebP q=86、白底、opaque sRGB 和目标比例处理，并登记响应式候选图。
- 英文与西班牙文主页首帧共用同一张明确可见 panic push bars 的图；三篇 News 各用一张独立图。

## Assets

| File | Size | Role |
|---|---:|---|
| `home-panic-exit-bars.webp` | 2400×943 | 主页 Panic Exit Devices |
| `news-door-schedule-doors.webp` | 2400×943 | Door Schedule |
| `news-mortise-lock-inspection.webp` | 1800×1200 | Backset / Centre Distance |
| `news-finish-function-library.webp` | 1800×1200 | Finish / Function suffixes |

## Validation

- 新增唯一性回归测试，锁定四个栏目必须使用四张用途专属图片。
- 视觉检查：无人物、剪影、可辨识文字、品牌、Logo、水印或认证标志。
- 这些图只代表编辑概念，不是实际项目、工厂、检验、尺寸或合规证据。
- `npm run assets:editorial:check`：63 张响应式编辑图通过。
- `npm test`：89 项通过；`npm run typecheck` 与 `npm run lint` 通过。
- 导出测试同时验证新主页首图仍保留移动端宽源裁切提示，并同步更新 EN/ES OG 与 Twitter 分享图。
- `npm run check`：490 个静态路由、25 项导出测试、SEO 语义问题 0、编辑质量警告 0。

## Untouched / Risk

- 未修改产品实拍、证书、阿根廷 AR4 产品图或其他代理工作。
- `argentina-ar4-entry.webp` 的来源说明未随旧提交保留，已在 `IMAGE_CREDITS.md` 明确列为待确认，不把它并入已核实的生成资产。
