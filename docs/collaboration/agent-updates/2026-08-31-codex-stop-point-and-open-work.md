# Codex stop point and open work — 2026-08-31

## 本次交付状态

- Agent：Codex。
- 已提交并推送：`1215dd7c2 新增墨西哥和阿根廷展会计划`。
- 保留并基于 Kimi 的 SEO 提交：`3862b7f86`。
- 收尾时 Claude 留下一个本地已提交但尚未推送的 `34664b516f 西语规格表英文残留清零`；
  它有独立 agent update，并记录 lint、typecheck、114 项测试通过。本次在干净 worktree 复核
  翻译器仍为 0 个未命中后，与本交接提交一起顺序推送，不改写其作者或内容。
- 展会内容：
  - Expo Nacional Ferretera Guadalajara 2026，2026-09-03 至 09-05，Expo Guadalajara。
  - ExpoFerretera Argentina 2027，2027-10-20 至 10-23，La Rural Trade Center。
  - 两项均写成 `Intended participation — unconfirmed`，没有虚构展位号或确认参展状态。
  - 官方外链已加入；墨西哥内链到 `/products/`，阿根廷内链到 `/products/argentina-ar4/`。
- 本轮源代码验证：`node --test src/lib/events.test.ts` 2/2 通过；`npm run typecheck` 通过。
- 远端 GitHub Actions：CI 与构建任务成功；构建日志为 938 页（公开 930）、JSON-LD 930、
  alternate 918、语义问题 0、编辑警告 0、导出测试 25/25。
- **正式公网未更新。** `cantonlock.com/events/` 普通请求和 query-bust 请求均返回旧 HTML；
  发布日志显示 `DEPLOY_HOST` 为空，任务只完成构建/审计，没有上传服务器。

## 共享工作树警戒

开始写交接时远端是 `fd87680c2`；本地另有已提交的 Claude 变更 `34664b516f`。
后续复核时，`git status --porcelain` 有 5,164 条，全部位于 `out/`，属于水印批处理和
另一位 release builder。此前的产品 JSON 已由其他会话提交，不再是当前脏树的一部分。

这些都不是本次展会提交的文件。下一位必须先运行：

```powershell
git status --short
git log --oneline -8
git diff --name-only
git log -5 -- docs/collaboration/agent-updates/
```

然后确认进程与所有者。禁止 `git add -A`、`git restore .`、`git clean` 或重新构建覆盖现有 `out/`。
若确认是完整可审的成果，按来源拆分小提交；如果是中断产物，先只读核对再决定 fix-forward。

## P0：先恢复发布并验证公网

1. 修复 GitHub 部署 secret / `DEPLOY_HOST`，或按仓库文档走受控手工部署。
2. 把至少 `1215dd7c2` 部署到正式服务器；不得只把 GitHub Actions 绿色当成上线。
3. 部署后清 Cloudflare 缓存，再用**无查询参数**公网请求核验：
   - `/events/` 包含 Mexico 和 Argentina 两项名称、日期、官方链接及内部链接；
   - 墨西哥链接 `/products/`；阿根廷链接 `/products/argentina-ar4/`；
   - 页面仍明确写“意向参展 / 未确认”。
4. 公网 HTML 真正更新后再提交 IndexNow；`200 OK` 只表示已接收，不表示已收录。

## P1：五个编辑图与首页首图重做

用户认可现有图片格调，但认为意义与销售目的不清。设计基准仍是：

- A 建筑编辑 60% + B 工业纪实 25% + C 温暖生活 15%；
- 不要人物；只做建筑、金属、材质、真实门五金语义；
- 每张图必须独有，禁止在首页、新闻、栏目之间复用；
- 保持 FSB 式克制、高级、建筑编辑感，但要比纯建筑图更明确指向产品与销售。

需要为下列五处生成多组候选，并在本地预览后再选择：

1. `Two ways to source our products`：现为泛化的不锈钢角与窗框。建议分别呈现可采购的金属五金组合、
   经销目录/装箱逻辑，与门表/项目规格的工程逻辑。
2. `Designed for / Nine product families`：现为三扇抽象门。建议使用九类门五金形成建筑化陈列，
   或单一放大的机械部件配合门型秩序。
3. `Materials + Engineering`：现为材料样板间。建议呈现锁体、铰链、拉手、逃生装置的材料与公差细节。
4. `Get in Touch`：现为铜绿纹理，行动含义不清。建议用出口打样/规格沟通的无人物工作台。
5. `FAQ`：现为泛机械块，需改成明确的门五金剖面、规格量测或安装节点。

首页 Panic Exit Devices 首图也需重做：保留建筑格调，但画面中必须能识别门与 panic bar / exit device，
不能继续只有建筑入口。用户接受“单个金属部件机械图放大”，不要求每张都是建筑全景。

## P1：全站图片 HYDE 商标人工复核

当前自动水印仍有明显失配，不能只跑存在性计数：

- 原黑椭圆 Hyland logo 没有清干净，HYDE 覆盖后仍露出半圆、注册符号或旧标语；
- 白底产品图出现多余白色矩形补丁；
- 背景图的白框 logo 突兀；
- logo 压到蓝红色 `PRODUCT DIMENSIONS` 横幅或规格文字；
- 同一相册内位置、尺度与颜色不一致；有些只剩被裁切的 HYDE 字样。

处理原则：逐图建立例外，不做一刀切坐标。

- 白底图：先精确去旧标，再直接叠透明黑色 HYDE PNG，不加白框。
- 深色/复杂背景：使用低调的白色或反白透明标，避开产品、尺寸、横幅和安装节点。
- 有旧标残留：先局部修复/蒙版，再放新标；不能只盖住中间留下椭圆两侧。
- 尺寸图：标放空白角，严禁挡住尺寸线、型号、认证与说明。
- 生活场景：小而清晰，贴边但保留安全距；不要像网页贴纸。
- 最终按图像类型抽样全览，并运行 `npm run assets:watermark:check`；计数合格不代替视觉合格。

## P1：Footer、导航、交互和移动端

### Footer 的 How to buy

用户截图要求该列精简：

- 保留 `Contact`；
- 保留 `FAQ`；
- 保留并强化 D 风格的 `Buy on Alibaba`；
- 保留 `lock@cantonlock.com`；
- 从该 Footer 列移除 Downloads、Company、Certificates、Projects、Services、Events、Price list。

不要据此删除这些页面，也不要自动从顶部 mega menu 移除。

### 顶部与卡片

- 顶部选择 A `Architectural shelf` 向下展开；Alibaba CTA 单独使用 D 的硬质错位投影和按压反馈。
- 验证 Company 下的 Projects / Services / Events 与 Buy it now 下的 Contact / Downloads / Price list / Alibaba。
- 首页大卡片静止无黑框、无短线、无硬投影；hover / keyboard focus 时三者同步出现，退出同步收回。
- 顶部当前页只加粗，不要双重下划线。
- 分页须显示 First、Previous、`1 2 3 … 22`、Next、Last；同时展示三个邻近页按钮并有克制翻页动画。
- 放大预览采用用户已选的 D：鼠标位置跟随的平滑镜片放大；移动端要有触控回退，不能阻碍滚动。

### 移动端回归

以游客和 AI 爬虫两种视角检查：顶部 shelf、侧边栏、产品相册、镜片缩放、卡片动效、分页、
AR-4 橱窗、新闻、Footer。重点查横向溢出、文字裁切、粘滞滚动、手势冲突、CLS、动画卡顿与
`prefers-reduced-motion`。不得只在桌面截图验收。

- 产品详情返回必须在同一浏览器会话内恢复来源（类目或 Product Finder）、筛选、页码、原卡片和
  滚动位置；浏览器后退与页面内返回链接都要测，英文、西语都要测。关闭标签页/浏览器后不保留。

## P1：产品、类目、链接与证书

### Argentina AR-4 / Alibaba

- AR-4 是本站营销编号，不是 Alibaba 可搜索型号。
- 同事确认 Piccolo 101 对应本站/Alibaba 110（同族、尺寸不同）。
- 110、140、1121 必须按数字精确对齐 Alibaba 搜索或产品链接；不能凭相似外观猜 URL。
- 四款分别核对产品图、尺寸表、搜索词、CTA 与 schema；找不到精确链接时显示“在 Alibaba 搜索型号”，
  不要连到错误商品。

### 类目与后缀规则

- Door Hinges 合并进 `Brass & Steel Door Hinges`，命名增加 Door，产品也迁入。
- 玻璃门拉手归 `Glass Door Accessories`。
- `Stainless Steel Handles` 代表图重新从该类真实不锈钢执手中选，不能继续用玻璃门拉手。
- 后缀：F = woodgrain ball；WL = white painted ball；SP = shiny polish；
  ET = entrance lock；PS = passage lock；BK = privacy lock。
- BK 功能表只适用于 cylindrical / tubular locks，不能套到 mortise lock case。
- 首图须根据真实后缀/功能/表面处理选择，不能把 finish、function、material 混为一列。

### 其他产品数据

- 验证 435 个产品页 Related Products 全部为非占位、轮转分布，不要每页固定同三项。
- 约 75 个无图产品仍等甲方素材；不得跨型号或跨表面处理借图。
- Stahlock 参数只允许 exact model / exact family 且保留来源证据；不能只因外观相似批量抄。
- `Useful package` 被反馈不可交互：查清组件职责，改成明确名称与可点击 CTA，或删除空壳。
- Downloads / 侧边栏补甲方拥有的三份证书；排除 KALE。发布证书前再次核对整份分发和宣传限制。
- Newsletter 真订阅界面、Service 聚合栏目、展会 CMS 编辑能力需要检查现状并补齐。

## P2：SEO / GEO 的正确方向

- 不添加 `<meta keywords>`：Google、Bing 都不把它作为有效排名信号。
- 关键词继续落实在 title、H1、正文、内部链接、图片 alt 与结构化数据中，围绕：
  product name + manufacturer / supplier + material / finish + function + application + region / OEM。
- Kimi 已提交英文 `— Manufacturer` 与西语 `— Fabricante` 的短商业限定词：`3862b7f86`；先复核，不重复改。
- 不要为“至少三个外部数据锚点”编造站外引用。可验证产品事实来自内部精确数据与可追溯官方资料。
- 所有图片调整后检查 alt 与可见内容一致；不要把风格图写成具体认证或真实项目。

## 最终发布与审计门槛

只有在确认当前 `out/` 所有者并拿到 release baton 后，才执行完整发布：

```powershell
npm run check
npm run deploy:prep
npm run seo:audit
npm run test:export
npm run assets:watermark:check
```

还要补充：

- 静态页面数、公开页面数、英西语页面数、产品页数、类目数、图片数、无图产品数；
- canonical / alternate / JSON-LD 的解析与 URL 对齐，不是只统计标签存在；
- 桌面与移动端公网交互回归；
- 正式域名无查询参数的 edge HTML、资源缓存与跳转检查；
- 图片水印完整性视觉抽样；
- IndexNow 只在正式 HTML 更新后提交。

最终把 `HANDOFF.md` 中仍写着旧部署机制、旧页数、旧认证数量或“已上线”的段落据实重写；
不要把本文件的待办直接改名成“已完成”。

## 下一位建议的执行顺序

1. 保护 5,164 条 `out/` 脏树；确认 release baton。
2. 恢复正式部署并上线 `1215dd7c2`，做公网验证。
3. 按 Footer 精简与移动端阻断问题做一个小提交、一次部署。
4. 分批人工修水印，每一类图片一个小提交；先产品白底图，再尺寸图，再生活场景。
5. 生成五个编辑图与 panic-exit 首图候选，本地预览给用户选，不要直接大批上线。
6. 修 AR-4 Alibaba 对齐与类目代表图/归类。
7. 完整静态导出、SEO/GEO、结构化数据、交互、公网与水印审计。
8. 据实重写 `HANDOFF.md`，再写一个新的 agent update，提交并推送。

## 官方展会来源

- Mexico: <https://www.expoferretera.com.mx/es-mx/expositores.html>
- Argentina: <https://expoferretera.ar.messefrankfurt.com/buenosaires/es.html>
