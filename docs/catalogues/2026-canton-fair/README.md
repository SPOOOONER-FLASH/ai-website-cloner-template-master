# HYDE 广交会目录 — 2026-10-08 审阅稿

用途：广交会现场印刷、洽谈选型和会后电子发送。语言为英文；两种 PDF 使用相同 A4 竖版版式与页码。当前 124 页、15 个系列、523 个有真实源图的型号。官网源产品记录 590 个，其中 67 个无图记录暂缓收录，详见 `source-register.json`。

## 文件

- `output/pdf/hyde-canton-fair-2026-digital.pdf`：压缩电子版，含产品链接、目录及型号索引跳转、22 个书签、系列与联络二维码。
- `output/pdf/hyde-canton-fair-2026-print-review.pdf`：原始尺寸图片的 A4 印刷审阅母版，字体已嵌入，124 页为 4 的倍数。
- `output/pdf/hyde-canton-fair-2026-preview.jpg`：封面、系列页与产品页的快速预览。
- `source-register.json`：每个产品源图路径、SHA-256、像素尺寸和未收录产品。
- `preflight.json`：产品页码、分类起始页、文字安全区检查、每幅图片在 PDF 中的有效分辨率。
- `verification.json`：重新打开最终 PDF 后核对页数、书签、523 个产品链接、540 个内部跳转、字体嵌入及本地静态产品页面存在性。

版式采用黑灰文字、少量铜色导航与统一留白。每页最多 6 个产品，完整型号、图片及精选规格同页。系列首页使用单个真实产品；后面为型号索引、询价记录页、会议笔记页和联络封底。正文规格 8.5 pt，型号 11.5 pt；相较旧版分开的缩略图与 6.6 pt 规格表，更便于现场比对。

## 内容边界与待确认资料

- 来源为 `content/products/*.json`、`content/categories.json`、`content/site-settings.json` 与现有 HYDE 产品图片。原图完整保留，只有格式转换和电子版缩小压缩；无 AI 产品生成、重新绘制金属、零件重组或套装拼装。
- 本次检查 `G:/新网站资料` 未挂载。未使用被冻结的 33 张 Products plate、未接受的 still-life 样张或部分几何模型。
- 9014 的源图是尺寸图，正文标记 `Dimension reference`；9007 的源图是兼容性拼图，标记 `Configuration reference`。原有尺寸箭头和配件保持完整，不把兼容性选项称为随货套装。
- 120 个有图记录的 `specs` 为空。有现成材料字段时只引用该字段；没有可用事实则显示 `Specifications on request`。完整尺寸、配置和供应条件在报价前确认。
- BH01/BH02 的 `Length` 源值含 `500m`，本版不打印该行，也未猜改为 `500mm`。5835/5836 的 summary 钥匙数与 specs 不同，本版未引用 summary。
- SSH012 的材料为 SS304，标题为通用品类名，饰面列表为 PB/SB/AB/AC/CP；本版引用原有规格，未选作分类主视觉。工厂仍需确认材质与饰面组合。
- 不增加展位号、日期、认证、性能测试、循环寿命、MOQ、交期或付款承诺。性能与商业条件字段不作为本版精选规格。
- 公司名、办公地址、工厂地址、邮件和电话来自当前共享设置；办公与工厂地址分别标明。

## 印刷交接

当前是**印刷审阅母版**，并非已确定印厂要求的 PDF/X 定稿。所有页面采用 A4 单页，内文有安全留白，没有需要裁切的满版图片。印厂应按最终纸张与装订方式拼版，不能将电子阅读跨页直接作为印刷拼版。

`preflight.json` 中的 `print.below300dpi` 列出少数放大的分类主图及封面，便于补高清原图；本版没有低于 180 dpi 的印刷图片。源照片的锐度和原始压缩仍需印前打样判断。印厂确认纸张、装订、色彩配置与是否需要额外出血后，再输出符合其要求的正式印刷文件。不要把 RGB 审阅稿称为已经完成 CMYK 或 PDF/X 校验。

## 重建

先运行现有 Node 环境中的资产准备命令：

```powershell
node scripts/prepare-cantonfair-catalogue.mjs
```

本机 `py` 没有 ReportLab；使用 Codex 已提供的 Python 运行生成器与验证器：

```powershell
& 'C:/Users/johns/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe' scripts/build-cantonfair-catalogue.py
& 'C:/Users/johns/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe' scripts/verify-cantonfair-catalogue.py
```

成功时两份 PDF 出现在 `output/pdf/`，控制台显示相同页数，验证器返回两版 `status: passed`。验证器需要本地 `out/products/` 以检查实际产品路由；不等于验证了公开网站的当前部署。

使用 Poppler 将最终 PDF 全页渲染后，检查封面、目录、每个系列、普通产品页、9014/9007、长型号索引、询价页和联络页。对英文源文字做自动换行，不截断型号或规格；超出预设卡片高度或页面安全区会使生成器报错，需先修布局再交付。

资产缓存位于自己所属的 `tmp/codex-cantonfair-catalogue/assets/`。任何源图或产品资料变更后重新执行两个生成步骤；不使用旧目录的按过期 slug 命名的 plate 缓存。新增目录与旧官网下载 PDF 独立，审阅方向确定后再决定官网下载替换。
