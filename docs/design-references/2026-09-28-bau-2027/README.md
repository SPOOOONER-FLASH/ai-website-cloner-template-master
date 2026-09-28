# BAU 2027 专栏：三个版式预览（甲方选一个）

生成：`node scripts/build-bau-2027-previews.mjs --png`（2026-09-28，视觉会话）。文字全部原样取自 `content/bau-2027.json`；图片只用 `public/images/products-hyde/` 里 307、311、305、LC14、564 的现成主图；主匙系统没有单一型号照片，用文字卡。不生成任何金属件，不合成展台图。

| 方向 | 首屏是什么 | 适合 | 桌面 EN | 桌面 DE | 手机 DE（390px） |
|---|---|---|---|---|---|
| **A 事实卡优先** | 超大「C4·523」和日期，旁边标题导语；下接事实卡、产品网格，最后公司简介 + 表单 | 访客最先要的是“在哪、哪天” | A-en-desktop.png | A-de-desktop.png | A-de-mobile.png |
| **B 产品优先** | 标题下直接是五个型号实拍网格，预约表单在右侧常驻（滚动时跟随） | 让买家先看到带什么货，边看边约 | B-en-desktop.png | B-de-desktop.png | B-de-mobile.png |
| **C 预约优先** | 左边标题 + 事实表，右边就是完整表单；产品和简介在下面 | 把页面当成预约入口，转化最直接 | C-en-desktop.png | C-de-desktop.png | C-de-mobile.png |

每张 PNG 旁边有同名 `.html`，可在浏览器打开（图片按相对路径读 `public/`）。

德语比英语长约 20–30%：三个方向在 1440 宽和 390 宽下德语都放得下，没有溢出；最紧的是 B 右侧表单栏里的日期按钮，德语会折成三行。

选定后交工程会话建 `/bau-2027/` 与 `/de/bau-2027/`（任务单 `docs/collaboration/tasks/2026-09-28-bau-2027-column.md` 第 4 项）。
