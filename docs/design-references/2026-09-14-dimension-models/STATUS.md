# 实体建模状态

最新任务是撤回新图、继续建模。本目录不会写入网站图片库。

| 文件 | 已完成 | 尚未建造 |
|---|---|---|
| 9004s-exterior | 图纸支持的135mm执手与53×53×8mm底座外形 | 未给尺寸的边缘圆角、底座内部、固定孔、方轴长度、装饰圈 |
| lc04-case-envelope | 173mm高、从96mm总深减3mm面板得到93mm深的锁体包络 | 面板全长/全宽，锁舌、四柱及孔位、机构；跨门厚度15mm仅为注明的中性闭合值 |
| 70sn-upper-housing-envelopes | Φ17mm上部圆柱外包络，两段30mm、中间10mm间隔 | 下部完整欧规轮廓、凸轮、锁芯内部、钥匙、旋钮及固定螺纹 |

三份都是可编辑真实网格，非照片贴片。它们是**局部外形研究，不是三份完整产品CAD**。
已测量网格尺寸、核查闭合边与正体积、重新打开blend确认源图打包，见verification.json。
正交图从实际网格顶点投影生成，不能当成工厂加工图。LC04只展示有来源的93×173正视图，不把中性厚度15mm标为图纸尺寸，也不把该侧面设为默认视角。

## 未完成的工程输入

原二十项中，大部分资料只有总长、门厚、背距等选型数据，不能由此确定产品三维轮廓和孔位。
主匙具体配置、6068照片、窄边锁体与90mm锁舌唯一型号仍未解决。推杠的总长不能替代端壳截面、安装面和孔距。
不把局部尺寸包络、照片平面场景或不完整CAD标为完整产品建模完成。

## 旧生成器注意

本轮检查发现scripts/blender/lock-case.py仍有默认8mm/17mm孔径、把两孔默认对称放在锁体中点以及背距另加面板厚度的逻辑；这不由所有产品资料支持。
本次没有调用该生成器，也没有把其产物当作完成模型。此目录的生成器独立使用明确记录的范围，缺失结构省略。

## 重新生成

```powershell
& 'C:/Program Files/Blender Foundation/Blender 5.2/blender.exe' --background --threads 2 --python-exit-code 1 --python scripts/blender/finalize-dimension-studies.py -- docs/design-references/2026-09-14-dimension-models
```

完成标志是`DIMENSION_MODELS_VERIFIED 3`；失败不得只凭进程返回码判成功。
