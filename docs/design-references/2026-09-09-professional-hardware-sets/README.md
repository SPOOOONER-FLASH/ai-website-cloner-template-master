# 五金实物照片与 Blender 审阅包

打开 review.html：二十项清单加客户组合图共21项。主展示为13份原图版面；13张旧生成稿和1张早期抠图实验均退回折叠。未替换生产网站照片。

## 已交付

- 00-real-source-selection：9004S、LC04、70SN三张实物照片，依客户最新“把三个图放一起”反馈制作。照片卡不代表真实相对尺寸或已确认套装。
- 01-source-307-components：307、072、015。307页面明确配套关系；072新目录照片已核对。锁芯长度仍取决于实际门厚，没有放任意锁芯冒充完整配置。
- 单品：564、607、587、70BK、LC14、316-S、DC02、AR4-110、308、310、035，共11份。

每份在 blender/ 内有 .blend、1600×1200 PNG及 -qa.json。产品为嵌入照片纹理，纸板、石材、相机、灯光可编辑；不是可旋转查看所有面的产品模型或加工CAD。所有13份已重新打开，照片均已打包，详见 blender-verification.json。

references/ 原样归档20个产品记录、153张原图。manifest.json 记录来源、尺寸、SHA-256及各图状态；jobs.json 是可编辑清单。保真断言校验纹理的源像素，不能证明产品尺寸或配套关系。成图还会经历相机采样与显示变换，不声称PNG和源照片逐像素相同。

## 重建

在仓库根目录执行：

```powershell
node scripts/build-hardware-image-board.mjs
node scripts/build-hardware-image-board.mjs --render-sources
& 'C:/Program Files/Blender Foundation/Blender 5.2/blender.exe' --background --python-exit-code 1 --python scripts/blender/verify-hardware-source-layouts.py -- docs/design-references/2026-09-09-professional-hardware-sets
```

第一条生成审阅页面并完整解码所有图片。第二条重建13个Blender场景后生成页面，成功日志含 SOURCE_LAYOUT_OK。第三条重新打开交付文件核验嵌入照片，成功显示 PACKED_SOURCE_BLENDS_OK 13。

归档来源发生变化时会报 Source drift，须明确建立新版来源，不悄悄替换证据。输入配置保存本机原路径；在其他电脑重建须更新路径，已打包的 .blend 可以直接打开。旧 hardware-photo-stage.py 和提示词仅供追溯，不属于主展示流程。

## 尚未完成

统一照片卡完成了保真基础交付，但客户要求的多样空间与两张指定场景的最终精细合成尚未完成。插芯锁具体套装、主匙实物配置、玻璃门配置及缺唯一型号的项目仍按各项缺口记录。072已补齐照片，不再是缺图项。不能把本包称为二十款全部完成或生产部署。
