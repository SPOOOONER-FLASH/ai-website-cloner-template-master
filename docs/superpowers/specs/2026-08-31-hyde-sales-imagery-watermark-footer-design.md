# HYDE 销售语义图片、产品图品牌与 Footer 设计

## 状态与范围

- 用户于 2026-08-31 批准推荐方案：真实产品语义与建筑编辑场景结合。
- 本设计只覆盖第一批收尾：5 个首页图片位置、1,485 张产品图 HYDE 品牌复核、Footer 精简与标题评审。
- Panic Exit Devices 首页首图已由用户确认完成，禁止在本批重新生成、替换或调整。
- 导航、放大镜、分页、移动端、AR-4、类目、后缀、证书、SEO/GEO 和部署仍按
  `docs/collaboration/agent-updates/2026-08-31-codex-stop-point-and-open-work.md` 分批处理。
- 当前 5,164 个 `out/` 路径属于其他 release builder。本批只提交源代码和媒体；拿到发布接力棒前
  不运行 `deploy:prep`，不修改或提交 `out/`。

## 商业目标与事实边界

网站服务海外经销商和项目采购，图片必须帮助访客理解产品范围、规格支持和两条询盘路径：邮箱与
Alibaba。新图不承担精确型号、尺寸、认证、真实项目或工厂证据功能。

- 视觉比例：建筑编辑 60%，工业与材料 25%，温暖使用环境 15%。
- 不出现人物、手、脸、人物倒影、可读标识、Logo、水印、认证或第三方品牌。
- 可使用第一方产品照片或真实产品形态作为参考，但不得改变产品结构后继续声称是该型号。
- 生成图只标为代表性编辑图；产品页实拍、图纸和证书继续承担事实证据。
- 每张正式编辑图独占一个用途，不在首页、News、Projects 或 Company 之间复用。

## 采用方案

采用“真实产品锚点 + 生成场景”的混合方案。相比纯生成建筑图，它能明确表达销售用途；相比全部
产品白底图，它保留 HYDE 当前克制、建筑编辑式的品牌气质。

先为 5 组内容各生成 3 个候选构图，共 15 个候选输出。`Two ways to source our products` 的每个候选
是可拆分为两个独立方图的双联画，分别对应经销目录采购与项目规格采购；其余四组各为一张图。因此
最终进入 `public/images/editorial/` 的是 6 张独有定稿，而不是复用一张图填两个卡片。全部生成响应式
WebP，并更新英文、西语、alt 和 `IMAGE_CREDITS.md`。

## 五组图片

| 位置 | 当前资产 | 三个候选共同必须表达 |
|---|---|---|
| Two ways to source our products | `material-brushed-steel.webp`、`material-metal-stone-detail.webp` | 经销选品/装箱与项目门表/规格是两条不同采购路径；画面出现可识别门五金，不再使用纯材质抽象图 |
| Designed for / Nine product families | `home-design-context.webp` | 九类门五金的协调范围；可采用有秩序的产品陈列或单一机械部件放大配合多类轮廓，不使用三扇泛化门 |
| Materials + Engineering | `home-material-library.webp` | 锁体、铰链、执手、逃生装置的材料、加工表面、公差和紧固关系，不使用瓷砖/室内材料样板间 |
| Get in Touch | `material-bronze-patina.webp` | 无人物出口沟通工作台：五金样件、门表、包装样和 finish 样件，明确表达“把需求发给工程师” |
| FAQ | `industrial-precision-parts.webp` | 门五金剖面、安装节点或量测关系；不生成可被误认成真实规格的数字和认证文字 |

每组的三个候选分别偏向：建筑应用、工业近景、采购/规格工作台。生成使用内置 ImageGen，一次一张，
提示词明确写入用途、构图、真实材质、禁止项和“无文字/无 Logo/无水印”。候选先在会话中以对照形式
展示；废弃候选不写入正式资产目录。为满足用户要求的连续执行，Codex 同时按“产品语义清晰、五金
结构正确、无视觉畸变、版式可裁切、无伪文字/伪标志”五项逐张评分，每组最高分的有效候选自动进入
定稿；用户在正式发布前的明确选择具有最高优先级。

## 标题评审

图片候选同时配一张标题/副标题对照表。以下是评审起点，不自动上线：

| 当前标题 | 候选方向 |
|---|---|
| Two ways to source our products | Source by range or by project |
| Designed For / Nine product families | Nine hardware families, one coordinated schedule |
| Materials + Engineering | Materials, tolerances and finishes |
| Get in Touch! | Send us your hardware requirements |
| Frequently Asked Questions | Specify with confidence |

标题必须描述访客能获得什么，不把代表性图片写成产品或认证事实。候选与本设计保存在共享树，Claude
可通过 agent update 复核英文商业表达；Claude 的建议保留来源，最终采用以用户确认或明确提交记录
为准。

## 产品图 HYDE 品牌架构

### 当前问题

现有流程覆盖 1,485 张源图：596 张使用 `legacy-cover` 白色覆盖板，889 张使用
`adaptive-mark`。当前旧标探测主要依赖红色像素，不能可靠得到黑椭圆、灰色边缘、注册符号和旧标语
的完整边界；固定白板因此造成截图中的半圆残留、白块和内容遮挡。

### 新处理模型

保留非破坏式结构：`public/images/products/` 是原图，正式衍生图位于
`public/images/products-hyde/`。新增版本化的逐文件例外清单，默认规则只处理确认安全的图片，任何
不安全图片必须写入例外。

例外记录使用归一化坐标，至少包含：

- 源图相对路径；
- 图片类型：白底产品、尺寸图、深色/复杂背景、生活场景、已有正确 HYDE；
- 旧标完整修复边界和修复方式；
- 新标 variant、位置、宽度、安全距；
- 必须避开的区域：产品、尺寸线、型号、认证、说明、蓝红横幅和安装节点；
- 人工复核状态与简短原因。

修复方式限定为可解释、可重复的操作：

1. 白底图：以真实背景色修复完整旧标区域，再叠透明黑色 HYDE；禁止增加可见白框。
2. 尺寸图：只在已确认空白角放标；如果没有安全区，允许不放新标，不得牺牲规格可读性。
3. 深色/复杂背景：使用小号透明反白标；存在旧标时先修复旧标，不能单纯覆盖中央。
4. 生活场景：贴边但保留安全距，避开门、五金、消防标识和操作节点。
5. 已有正确 HYDE：避免重复叠加；只在裁切、尺度或颜色明显错误时重新处理。

同一相册优先保持统一位置和尺度，但图片内容安全区优先于机械一致。不得用一个固定坐标覆盖所有图。

### 视觉验收

- 为五类图片分别生成带文件名的联系表；1,485 张每张都在联系表中出现并由人工查看。
- 所有例外、低置信度和联系表异常图打开原尺寸复核。
- 检查旧黑椭圆、灰色半圆、注册符号、旧标语、白框、裁切 HYDE、重复标和横幅遮挡。
- `assets:watermark:check` 继续验证数量与哈希，但不作为视觉合格的替代证据。
- 最终 agent update 记录各类型数量、例外数量、人工复核范围和仍需重拍的第一方素材。

## Footer

`How to buy` / `Cómo comprar` 只保留：

1. Contact / Contacto
2. FAQ / Preguntas frecuentes
3. Buy on Alibaba
4. `lock@cantonlock.com`

从 Footer 数组移除 Downloads、Company、Certificates、Projects、Services、Events 和 Price list；不删除
对应页面，也不据此删除顶部或 shelf 入口。Alibaba 使用已选 D 风格：黑白硬质错位投影、按压位移、
清晰键盘焦点；`prefers-reduced-motion` 下取消非必要位移动画。

Footer 配置应在 CMS 数据层反映真实四项，而不是只在组件中隐藏七项。测试锁定 Footer 精确集合并
验证顶部导航仍保留自己的入口。

## 实现边界与文件

预计修改：

- `content/navigation.json`
- `src/components/site/SiteFooter.tsx` 与相关样式/测试
- `src/data/home.ts`、`src/data/home-es.ts`（仅在共享树现有修改提交后再进入，先检查差异）
- `public/images/editorial/`、`responsive/`、`editorial-images.config.json`
- `scripts/watermark-product-images.mjs`、测试、例外清单和 watermark manifest
- `public/images/products-hyde/`
- `IMAGE_CREDITS.md` 与协作更新

当前 Claude 正在修改 `package.json`、`src/data/home.ts`、`src/data/home-es.ts` 和
`src/data/home-destinations.test.ts`，本设计提交不触碰或暂存这些文件。后续实现先读取其提交，再在新
提交中补图片/标题，避免覆盖。

## 验证门槛

源代码/媒体阶段：

- Footer 精确链接测试、英文/西语链接测试、键盘与 reduced-motion 测试；
- 水印单元测试、1,485 张 manifest 校验和五类联系表视觉复核；
- 6 张定稿原尺寸检查、15 个候选构图用途对照、响应式候选完整性；
- ESLint、TypeScript、相关 Node 测试；
- 桌面与移动端本地浏览器检查，不允许横向溢出或文字裁切。

发布阶段仅由拿到 release baton 的构建者执行：

- `npm run check`
- `npm run deploy:prep`
- `npm run seo:audit`
- `npm run test:export`
- `npm run assets:watermark:check`
- Cloudflare purge 后以无查询参数请求检查正式 HTML、资源、跳转、桌面和移动端交互。

## 提交顺序

1. 本设计与共享评审入口。
2. Footer 四项与 D 风格 CTA。
3. 15 个候选构图；逐组评分并继续提交 6 张独有定稿与文案，发布前接受用户覆盖选择。
4. 白底产品图品牌修复。
5. 尺寸/横幅图品牌修复。
6. 深色背景、生活场景和剩余相册品牌修复。
7. 完整源代码/媒体回归；发布构建由当前 release builder 接手。

每个实现提交附一个短 agent update，显式列出测试、未触碰文件和下一项。不得批量 stage `out/` 或
其他 agent 的在制文件。
