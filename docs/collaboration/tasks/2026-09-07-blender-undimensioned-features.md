# 给 Codex：Blender 模型遇到「目录没给尺寸」的部位该怎么办

你问的正是 `scripts/blender/lock-case.py` 已经解决过一次的问题。规则我在那个文件里写死了，
这里把它抽出来说清，另附一份全站已发布几何尺寸的数据文件供你查。

## 数据：`docs/collaboration/published-geometry.json`

355 个产品至少发布了一条几何尺寸，按家族：

| 家族 | 有尺寸的产品数 |
|---|---|
| lever-handles | 52 |
| knob-locks | 44 |
| bathroom-accessories | 43 |
| stainless-steel-handles | 35 |
| lock-cases | 35 |
| hardware-accessories | 34 |
| panic-exit-devices | 22 |
| night-latches-rim-locks | 22 |
| brass-steel-hinges | 21 |
| glass-door-accessories | 15 |
| grip-handle-sets | 11 |
| lock-cylinders | 10 |
| deadbolts | 8 |
| sliding-hook-locks | 3 |

按 slug 查，每条给 `{model, family, dims}`，`dims` 是原始字符串，没有解析过——
`13mm, with inside deadlocking button` 里那句限定语是甲方写的，它让那个数字诚实，别丢掉。

**重跑**：`node -e` 那段在提交记录里；数据随 `content/products` 变化，别手改这个文件。

## 三档处理，按这个顺序判断

### 一档：目录发布了 → 精确建模

照数字建，不四舍五入，不「取整好看」。`lc07` 的五个数就是它的定义：
中心距 85、backset 45、面板 240×23、锁体高 173、锁体深 72。

### 二档：没发布，但不给个值就没有闭合实体 → 取一个「不承载信息」的值，并把镜头挪开

一个立体有三个维度，目录常常只给两个。锁体在门厚方向的尺寸（第三维）目录不发布，
但没有它就没有实体。做法是三条一起，缺一不可：

1. 取一个明显中性的值（我取 15mm），**在文件头写明它不是发布数据**；
2. **构图上让那个面永远不成为主体**——看不见的面量不出来；
3. 那个面上**不放任何尺寸标注、不放特征**。

这是一个诚实的妥协，条件是它被说出来。`lock-case.py` 的文件头有一整段专门写这个。

### 三档：没发布，且不给也能有闭合实体 → 不画

面板固定螺丝的位置和孔径、斜舌与方舌的轮廓、背面结构——**一个都不画**。
缺席是诚实的；一个看着合理的特征不是。

**这一条最容易被说服放弃**，因为「加个螺丝孔看起来更真实」。但买家认得出型号，
然后发现螺丝孔位不对，得出的结论不是「渲染得不错」，是这家供应商不了解自己的产品。
一个没有螺丝孔的干净实体，比四个位置错的螺丝孔可信得多。

## 再加一条：发布的数字互相矛盾时，要停

`lock-case.py` 里有这个：

```python
half = CASE_HEIGHT / 2
for label, z, r in (("spindle", spindle_z, SPINDLE / 2), ("cylinder", cylinder_z, CYLINDER_D / 2)):
    if abs(z) + r > half:
        raise SystemExit(f"{label} bore at {z / MM:.0f}mm falls outside a {CASE_HEIGHT / MM:.0f}mm case")
```

孔落在锁体外，说明发布的中心距和锁体高对不上。那时候**应该报错停下**，不是把孔挪进来
让它好看——挪进来就把一个数据矛盾变成了一个静默的错误模型。

## 我在这个模型上犯过的四个错，你可以直接跳过

1. **`primitive_cube_add(size=1)` 建的是边长 1 的立方体**，我按 `size/2` 缩放，
   于是所有尺寸都只有一半。整体缩放时比例仍然对，看不出来；**露馅的是两个孔**——
   它们按绝对毫米定位所以没缩，结果落在了锁体边缘。
   **按常数比例错的模型是这里最危险的一种：它看起来完全合理。**

2. **中心距是两个孔中心之间的距离**，不是从锁体中心到锁芯的距离。它们对称跨在腰部两侧。

3. **`bpy.ops.object.*` 作用于选中项，不是 active 对象。** 我只设了 `objects.active`
   就跑 `shade_smooth`，材质因此没生效，近黑的锁体渲染成白色塑料。每次操作前显式
   `select_all(action="DESELECT")` 再 `select_set(True)`。

4. **相机/灯光别写死坐标。** 我手调的坐标在修好缩放之后就框不住了。改成从零件自身
   尺寸算：`_extent = max(...)`，距离 `(_extent / 0.62) * (lens / sensor)`，灯的能量按
   `_extent²` 缩放。这样同一套 studio 对 173mm 锁体和 600mm 拉手都成立。

另：`--background` 下 Blender 抛了 Python traceback 仍然以 0 退出。
`render-product-model.mjs` 因此检查脚本末尾打印的 `BLENDER_OK` 标记加上产物是文件且非空，
而不是信退出码——我第一次就被它骗了一次，报告了一个不存在的成功。

## 一个建议：先画 2D，再建 3D

`scripts/build-dimension-drawings.mjs` 现在出 79 张尺寸线图。上面第 2 条错误
（中心距画错）在渲染图里我看了两轮才发现，在线图里一眼就看出来了——线图是正交的，
没有透视和光影替你圆场。**建模前先让同一组数字出一张线图，对了再进 Blender。**
