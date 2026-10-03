# HYDE real-product photographic studies — 2026-09-28

给 Spooner / Claude：这一包是**二十张可审阅候选图，八个真实型号**，不是二十个新产品，也不是已经获准上线的二十张。照片来自当前挂载的 `G:/新网站资料` 中明确选定的 PSD 原生产品层。产品不经过图像生成模型；生成模型只制作无五金的空摄影场。

## 调用路径

- 当前图：`masters-v2/*.webp`，PNG 为无损构图母版。01–08 浅石面，09–16 深灰面，17–20 竖幅。
- 原生产品：`sources/*.png`；`sources/provenance.json` 给出原 PSD 路径、图层索引、原生尺寸、照片与像素 SHA-256。
- 单张构图来源：`masters-v2/provenance.json`。110 的两处背景清除坐标记录在 `verifiedPaperSeeds`，其余原生图层不自动清理白色金属高光。
- 检查结果：`qa/technical-verification.json`、`qa/visual-qa.json`；视觉检查不是甲方批准。
- 18 秒视频：`motion/hyde-real-product-motion-trial.mp4`。1280×720 / 30fps / 540 帧 / 无声 / 约 2 MB，真实照片轻微推拉，**不是三维旋转、机械动作或 FSB 效果等价品**。
- 浏览：`preview.html`，或 `overview.jpg`。说明和型号在页面文字中，不压到图片中。

**Claude 只从 v2 调用，不从 v1 调用；不擅自替换线上 SKU 照片。** 确认采用后再复制所选 WebP 到 HYDE public 路径，按 HYDE 发布流程执行。此包没有改网站、导出、RAYEN 或产品数据。

## 图像纪律

1. 真实产品 RGB 不重画；只按比例缩放，没有拉伸、翻转安装方向、改变孔位或添加部件。
2. 图层是产品肖像，不等于整套供货内容。原 PSD 中分开的松散附件没有被拼成假套装；照片中原有钥匙/扣板保持原样。不要由照片推断供货数量。
3. 黑色外壳与原有黄铜内部件是原厂照片的真实构成，不是混搭新增配件；不得据此编造 finish、材料或认证。
4. 这是二维真实照片合成。接触阴影是独立图层，不是验证过的三维光线追踪。原片低分辨率/反射已经限制后续放大；不要宣称 4K 原片、扫描模型或精确材质渲染。
5. 推荐先挑不同产品的 8 张，而不是在同页重复展示浅/深背景版本。竖幅用于栏目卡片，横幅用于系列说明；完整产品用 contain，禁止盲目 cover 裁掉锁面板。

## 可重跑，不依赖临时脚本

在仓库根目录执行（Node 与 sharp / ffmpeg 为已有依赖，不需要新安装或 API key）：

```powershell
node scripts/build-kanee-fidelity-sources.mjs docs/design-references/kanee-fidelity/source-spec.json 'G:/新网站资料' docs/design-references/kanee-fidelity/sources
node scripts/build-kanee-fidelity-masters.mjs docs/design-references/kanee-fidelity/render-spec.json docs/design-references/kanee-fidelity/masters-v2
node scripts/build-kanee-fidelity-motion.mjs docs/design-references/kanee-fidelity/motion-spec.json docs/design-references/kanee-fidelity/motion
node scripts/verify-kanee-fidelity.mjs docs/design-references/kanee-fidelity
node scripts/build-kanee-fidelity-preview.mjs docs/design-references/kanee-fidelity
node --test scripts/kanee-psd-layer.test.mjs scripts/build-kanee-fidelity-masters.test.mjs scripts/hooks/codex-kanee-stop.test.mjs scripts/hooks/codex-kanee-cli.test.mjs
```

盘符更换只改第一行的原资料根路径。提取器拒绝不支持的 PSD 位深/颜色/混合模式/遮罩，不会猜测。它提取指定原生摄影层，不复现位于其上的整个 PSD 调色栈。母版渲染器限制原片放大不超过 1.5 倍；高分辨率背景不代表产品有同等细节。

## 背景生成记录

主方法：内置 imagegen；两张空环境，**未输入产品作金属重生成**。凯理 PDF 第 81 个 PDF 页面作为摄影语法参考，不复制它的铰链、品牌、文字、白色规格区或原摄影。

- `pale-stone-leather.png`：温暖浅灰石面，一个极角落的柔软 taupe 皮革褶皱，左上大面积柔光，中间完整承托面；禁止五金、文字、标志、边框、白卡。
- `charcoal-leather.png`：45 度俯视的细微哑光深灰矿物台面，左上柔软 taupe 皮革，85mm 产品摄影语法和左上柔光；禁止产品、金属道具、文字、标志、边框、白卡。

以上为语义生成配方，不声称固定 seed 可以逐像素再现。现有背景已随包保存并逐张哈希。

## 已淘汰的版本

早先二十张场景贴图、左右白卡样片不计入本包。`masters-v1` 仅为本地迭代记录；v1 的 110 面板两个固定孔有白纸残留，v2 清除了已核实孔内背景，保留金属倒角和外轮廓高光。其余 17 张与已完整检查过的 v1 图像逐字节一致；v2 仅三张 110 图片不同。

## 尚未完成/未声称

没有产品精确三维旋转成片，没有甲方最终选图，没有完整站点 `npm run check` 或部署。Stop hook 逻辑/CLI 已测试，但没有观察到 Codex 的真实自动调度或 trust 状态，不把配置存在当成已生效。
