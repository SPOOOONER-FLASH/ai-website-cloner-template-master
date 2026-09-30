# 2026-09-29 · Claude（云端视频线程）· FSB 英雄视频逆向 → HYDE 9014 第一版

甲方发来 FSB × Rams 1138 英雄视频，问能否用 HYDE 产品逆向做一支，以及配置器要不要升级。完整拆解、镜头表、差距和配置器建议见 `docs/design-references/2026-09-29-fsb-film-reverse/BRIEF.md`。

**做了什么**
- FSB 片子拆解：40 秒一镜到底的 3D 渲染（不是实拍），掠射高光 + 灰渐变 + 小字落版，首尾可循环。
- 9014 不锈钢执手按工厂尺寸图（135 / 60 / Ø19 / 面座 Ø53×9，45° 斜接）在 Blender 建模，Cycles 渲染 18 秒 432 帧，合成灰渐变背景和 HYDE 落版。**没有尺寸的部件一律省略**（紧定螺丝、焊缝、面座倒边）。
- 这不是 09-07 被否的「照片推拉」：摄影机真的绕着三维模型走。
- 成片 mp4 在项目共享文件夹 `fsb-film-2026-09-29/`，不进仓库。

**文件**：`scripts/blender/hyde-9014-film.py`（建模 + 机位 + 渲染）、`scripts/blender/hyde-9014-film-composite.py`（背景 + 落版 + 编码）、上面的 BRIEF。未动任何网站源码、`out/`、产品数据。

**测试**：只加了 Python 脚本和文档，没有改 TS/JS/内容；云端容器没有 node_modules，`npm run check` 未跑（不影响构建产物）。渲染脚本在 bpy 5.0.1 上跑通。

**风险 / 待甲方**
- 拉丝纹理是程序生成，不是实物扫描；成片级要一张真样品微距照做材质参考。
- 要做到 FSB 同级（4K、细节全）需要工厂 CAD（STEP）。这是整条视频管线和未来 3D 配置器的共同前提。

**下一步**：甲方拿到 CAD 或确认方向后，johns 机器（4090）上用同一脚本跑 4K 256 采样。配置器按 BRIEF 第五节的顺序：先 CAD，再模型，再界面。

## 追加（同日晚）：ONE TAKE · 十支单独成片

甲方看过 9014 第一版后：「黑色逃生锁打头，取个名字，做十个，选不同颜色，十个独立 mp4，像作品集」。
配置器的事另一会话已做（/configurator/studio/），本线程只管视频。

- 系列名 **ONE TAKE**。十个型号、颜色、几何来源、省略项和待甲方确认的三个尺寸，全在
  `docs/design-references/2026-09-29-one-take/README.md` 的表里。
- 生成器 `scripts/blender/one-take.py`（十个 builder + 按产品尺寸自动取景/取焦的机位）、
  `scripts/blender/one-take-composite.py`（渐变场 + 落版 + 颗粒 + 暗角）。
- 两轮试渲踩的坑，写进脚本以免再踩：相机默认 `clip_start=0.1 m` 会把微距里的产品裁没；
  对焦距离不能小于 1.4 倍焦距，否则景深公式发散；`ext` 要取整个装配的包围盒，不是单个零件。
- 成片落在项目文件 `one-take-2026-09-29/hyde-one-take-<型号>.mp4`，不进仓库。
- **发现一处文案错误**：DS01 记录摘要写「不锈钢门吸」，主图是黄铜配白胶头（`-2` 图才是不锈钢）。
  文案会话请改摘要或换主图。

## 追加（09-30 凌晨）：十支全部渲完，交付 9/10，最后两支在重渲

- 已交到项目文件 `one-take-2026-09-29/`：9014、70SN、SSH016、DS01、LC07、19-130MM、027（9004S 成片待与
  重渲的 311、BH21 一起交）。每支交付前抽 8 帧看过。
- 第一批成片暴露的问题及修法（都已进脚本、已推送）：
  - 黑色 ABS / 喷粉渲成灰：`Specular IOR Level` 0.3 + 粗糙度下调。
  - 311 壳顶半圆与方壳共面 → 一个黑洞：内缩 0.3 mm。
  - **竖长产品的收尾镜头会被 16:9 上下裁掉**（LC07 面板 240、19-130MM 板 200、027 执手）：取景系数要
    约 2 倍以上。方法是**先只渲第 288 帧预检**（3 采样，15 秒一张），再放整支——五支预检出三支要改，
    省了约 2.5 小时重渲。以后每个新 builder 先跑 `'288'` 看收尾。
  - BH21 收尾把面座切出画面、圆环压到落版上：拉宽、压低目标点，只重渲 216–288 帧（脚本跳过已存在帧）。
- 云端容器半夜重启过一次，渲染进程全死；因为脚本按帧落盘且跳过已存在帧，重新拉起就从断点续，没丢帧。
  长渲染任务一律这样写：每帧一个文件，重跑即续。
- 交付里给甲方标了三处待工厂确认（311 杆径、SSH016 轴节 Ø、LC07 舌栓位置；027 执手截面）和 DS01 文案
  冲突，与 README 表一致。4K / 128 采样版在 johns 机器上跑，参数见 README。

- 09-30 01:29：311、BH21 重渲完成，**十支全部交付**到 `one-take-2026-09-29/`（各 12 s，1280×720）。云端线程的活到此为止；4K 版等 johns 机器。

## 追加（09-30）：甲方判定只有执手能用；FSB 页面拆解

- 甲方：十支里只有拉手能用（其余缺细节）。结论写进 ONE TAKE README：只给尺寸图能定义每个可见面的产品做特写。
- FSB 1138 复刻页 / 产品页拆解 + 9014 专题页建议：`docs/design-references/2026-09-30-fsb-page-study/README.md`。fsbna.com 及其图床被云端网络策略拦截，正文经抓取工具取回，图片未取到。
- 待甲方：是否做 9014 专题页；工厂补每支主推执手 3 张微距实拍。

## 追加（09-30 上午）：9014 专题页草稿 `/stories/9014/`

甲方在决策卡上选了「做草稿」。按 FSB 1138 页的区块顺序做了英文草稿，**noindex、不进 sitemap、不进菜单**
（`canton-withheld: draft-awaiting-owner-review`；`internal-link-placement.test.ts` 的 EXEMPT 里写明原因），
上线前要删这两处并放进抽屉和页脚。

- 文件：`src/app/(en)/stories/9014/page.tsx`、`src/components/site/HandleStory.tsx`、
  `src/components/site/StoryFilm.tsx`（全页唯一会动的元素：静音循环、可暂停、减少动态/省流量时不自动播放）、
  `public/videos/stories/9014-one-take.mp4`（ONE TAKE 9014 压成 1 MB）、`public/images/stories/9014/`
  （海报 + 两张 2560 渲染细节帧，由新脚本 `scripts/blender/one-take-still.py` 生成）。
- 只用英文、放在任何镜像前缀之外，所以不需要另外九个语种的路由，hreflang 也不会指向 404。
- 数字全部来自 `content/products/9014-*.json`：135 / 60 / Ø19 / Ø53×9 / 8 / 35–50。「方轴」没写，记录里只有 8mm。
- 细节区：渲染帧的特写抽象到看不出是什么（09-30 试过 bar 那一帧），只保留斜接拐角和颈部接面座两张，并在页面上注明是按图纸渲染。
  「看不见的部分」用了一张真实工厂照（SSBK -3，面座内部可见）。
- **给 Codex**：「Available sets」两张主图不统一（SSBK 主图偏小、偏右）。按「清理真实照片」规则重新出一版同光同比例的两张，页面不用改代码。
- **给甲方/工厂**：每支主推执手 3 张真样品微距照（斜接拐角、面座边、拉丝方向）到了就替换两张渲染帧。
- 注意：playwright 自带的 Chromium 不含 H.264，截图时视频显示为海报，这不是页面问题；真实浏览器正常播放。
- `npm run check` 全绿（本地云端构建）。构建改动的 `out/`、`public/images/door-prep/*.svg` 等不是本次提交内容，已还原。

## 追加（09-30 下午）：/products 改版撤回；9014 上首页；studio 挪到 /products

甲方比较后说线上 /products 更好（「老实说我觉得现在线上这个更好」），改版提交已 revert（c15915b194），33 张灰场图任务单作废，
只保留 9014 两张套装图：`docs/collaboration/tasks/2026-09-30-codex-9014-set-plates.md`。

- 英文首页：原 Configurator Studio 那一行换成 `HandleStoryShowcase.tsx`（9014 影片 + 一段尺寸 + 链接 `/stories/9014/`）。es/pt 和七个覆盖语种首页不变（专题页只有英文）。
- /products：en、es、pt 和覆盖语种（`ProductsIndexPage.tsx`）都在总览后面加了 `StudioShowcase`，引导去 studio。
- `/stories/9014/` 转为公开：去掉 noindex/withheld，进 sitemap，进抽屉 Products 组和页脚 REFERENCE_LINKS，删掉 placement 测试里的豁免。
- `StoryFilm` 改为进入视口才播放（preload="none"，首页不滚到就不下载），访客按了暂停后回滚也不自动播放。
- 未发布。上线等甲方一句话，然后合并 PR #16、`npm run release:hyde`。
- `npm run check` 全绿。

## 追加（09-30 傍晚）：首页 9014 改成 FSB 1138 式横屏大卡

甲方发来 FSB「Relaunch of FSB 1138」卡片截图：「我想做成这样横屏的一块替换原来的那个 D101 那一行」。
`HandleStoryShowcase.tsx` 改为一块细边框横屏卡：影片满宽，下面左侧粗体标题 + 一行说明，右侧链接。
链接文字用「See the 9014」而不是 FSB 的「Learn more」（`home-accent.test.ts` 的规矩：CTA 要说去哪）。`npm run check` 全绿，未发布。

## 追加（09-30 晚）：33 张灰场图是按作废任务单做的

Codex 交回 33 张灰场图，用的是已作废的 /products 任务单（那份文件被 revert 删掉了，但没有留下「作废」标记）。
现在在原路径放了一个作废说明，Codex 再拉取时会看到。这批图不提交、不上线；只做 9014 两张套装图。
**教训**：撤回任务单时，要在原路径留一个作废说明，不能只删文件。
