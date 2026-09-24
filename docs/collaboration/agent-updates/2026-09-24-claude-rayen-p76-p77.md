# 2026-09-24 · Claude · 雷茵 p76–p77（液压合页、暗门锁、旋钮）

| 项 | 内容 |
|---|---|
| 范围 | 《雷茵五金》p76–p77：10 个型号，36 张图。清单 `content/rayen/rayen-catalogue-p76-p84.json`，裁图 `scripts/catalogue-cutters/regions/rayen-wujin-p76-p84.json` |
| 型号 | EK型 / E型 多功能液压合页；D型 免开槽多功能液压合页；A9-987 BL、A5-A002 隐形门锁；旋钮 A5-A008、A5-A009、A9-A010、A5-A011、A5-A012 |
| 查重 | p76 三款与已上架 RY8001–8006 不重复。A5-A011/A012 与 Kaiser KA5-A011/A012 造型相同，但属暗门版、另一个 SKU，两边都保留（清单 `_readme` 有写） |
| 暂缓 | A9-987 尺寸（p77 标 145/53，p45 标 146/52，冲突）；A5-937 BL（只有小图）；E型 DBN 表面名；旋钮的尺寸和材质 → 见清单 `heldBack` |
| 术语 | zh-terms 新增：Gunmetal→枪灰、Sand White→砂白、Soft White→雅白，以及两条用途/特点短语 |
| 修复 1 | `delocalize-drawings.mjs`：以前每跑一次流水线，就把已打过标的 14 张本地化图纸重画一遍，接着被 brand 再盖一次章（双重水印）。现在会读 `image-branding.json` 的 SHA，已经是成品的就跳过。复跑结果：14 张全部跳过，旧文件改动 0 个 |
| 修复 2 | `ingest-union-handles.mjs` buildSummary：没有材质的旋钮之前生成 "undefined lever handle."，已修。以后若重新导入 ET4017、KA5-A011、KA5-A012，摘要会一并变成正确写法 |
| 测试 | `npm test` 372/372；`rayen:images:check` 0 |
| 未碰 | HYDE 的内容和 `out/`。products-hyde 水印图单独放进一个 HYDE 侧提交 |
| 下一步 | p78–p82 门吸，先和已上架的 12 个门吸核对；p83 移门扣盒；p84 装饰拉手、PUSH/PULL 牌；然后是《不锈钢把手.pdf》（要新开 FH、SP 两个品类） |

## 追加：金色表面被当成水印拒绝

| 项 | 内容 |
|---|---|
| 现象 | E型第 3 张（砂金）在雷茵站上缺失。`build-rayen-product-images` 的「红字水印」检测把红金色表面当成了 Hyland 标，旁边又不是纯白底，于是拒绝处理，图片没有发布 |
| 修复 | 来源豁免从 `union-handles.json` 扩大到全部 `content/rayen/rayen-catalogue-*.json`（都是从工厂自己的目录 PDF 裁出来的，本来就没有 Hyland 标）。另外，以前记下的「拒绝」结论可以被来源豁免推翻 |
| 结果 | 新发布 4 张：e-type -3、ry8005 -6、al-115 -4、4x4x2.5-3D -3，都是金色表面的白底图。其余图片一张没动（刚好 +4），`rayen:images:check` 0 |
| 没做 | 优恩场景包里还有 76 张被拒，原因同样是木纹、红墙误判。但其中有些照片上有中文或日文招牌（例如 t1111-6 上有学校名），需要逐张过一遍才能发布，这次不放开 |
