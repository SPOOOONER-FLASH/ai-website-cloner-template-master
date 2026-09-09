# 111 接手交付 — 2026-09-09

入口：[原图与新场景逐张对照](review.html)。

原任务最后停在 9 月 8 日；首页两张指定图已在 fc0e563dce 推送。Products 与菜单实现已收尾，不能把后续的场景/CAD停顿误报为整个网站没完成。三部被客户取消的影片不恢复。

## 本次补做与保存

- LC04 石材桌面、BL028 浅内衬样品盒、9004S 木纹样品板：三张单型号候选，用原产品照片编辑背景，避免混装为未经确认的套装。所有提示词保存为 JSON。
- 9004S 修正了钥匙孔内的白底残留，保留修正前版本便于追溯。
- 从官方 Product Finder 对应产品资料保存全部 19 张图库源图。文件以 SHA-256 固定；图库变化时重跑会报错，原快照不会悄悄被覆盖。
- 46 个历史图片、模型、配置和来源文件登记在 inventory.json；旧场景错误继续标为草稿，不上官网。
- 9004S Blender 外壳重新生成并验证了实体尺寸和闭合网格，见 model-validation.txt。它不是完整制造模型。不要将三份旧照片平面场景当作三个产品模型。

## 原请求仍有未完成部分

1. 三产品精细 CAD 尚未完成。LC04 的锁面板基准/四栓中心、BL028 的孔中心/轴节尺寸没有完整标注。客户已说明没有其他 CAD；现有图库就是唯一资料，不再反复要求客户提供文件。
2. 原多产品石材桌、盒子和木门安装组合尚未达到产品细节逐项可靠的程度。本次单型号候选是可以继续使用的构图方向，并非对原组合已全部修好的声明。
3. 新图仅作私有对照候选：虽然已检查主要孔位数量、布局和外形，生成式编辑不提供像素锁定或尺寸证明。官网产品图仍是事实源。

## 重跑

在项目根目录：`node scripts/build-111-recovery.mjs`。

该命令读取现有图片、完整解码验证、保存源图快照，重新生成 inventory.json 和 review.html；不会生成新产品像素，也不重新调用付费图片生成。成功输出：46 个历史文件、3 张候选、19 张源图。图片重做使用旁边提示词并在内置 imagegen 中重新编辑，对结果重新核对。

应用验证在独立的 tmp/codex-111-validation 执行 `npm run check`，以免覆盖其他人的源码或 out/。完整日志见 check-validation.txt；构建产物仅在验证目录，不是本次部署。

源图库：[LC04](https://cantonlock.com/products/lock-cases/lc04-85-60-lock-case/) · [BL028](https://cantonlock.com/products/brass-steel-hinges/bl028-brass-and-steel-hinges/) · [9004S](https://cantonlock.com/products/stainless-steel-handles/9004s-stainless-steel-handle/)。
