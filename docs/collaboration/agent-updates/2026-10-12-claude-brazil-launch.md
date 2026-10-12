# 2026-10-12 · Claude · 巴西逃生锁专栏上线

客户：「就按图片来呀 巴西专栏没有问题 非常好……做完你直接推送就行 工程在做别的」。任务与授权：`tasks/2026-10-12-brazil-panic-bars.md`。

| 部分 | 内容 |
|---|---|
| 页面 | `/products/brazil/`（en）+ `/pt/products/brazil/`（pt），去掉 noindex，进 sitemap；39 个型号（HYDE 306 三款 + 36 款客户模具） |
| 照片去品牌字 | workflow `wf_0d46518d-8ac`：37 张逐张由一个代理写方框规格、跑 `scripts/argentina/retouch-stamps.mjs --root=../claude-brazil --specs=../claude-brazil/stamps`（新增两个参数，默认仍是阿根廷），再由另一个代理独立复核；不过的修后再复核。36 张通过。**BR6-SM 未上**：字去掉了，但锁盒棱边被拖出缺口（改了产品轮廓），列入 `image-picks.json` 的 `skipModels`，需重修后再加 |
| 去掉的内容 | 客户品牌字与标志（含 DURATI、JAQUE 等第三方压印）、网址水印、NBR / CLASSE 认证字样；保留 EMPURRE、箭头、纯数字模号 |
| 背景 | `scripts/brazil/whiten.mjs`：只把与图片边缘相连的近白像素刷成纯白（去掉 JPEG 灰块），产品内部高光不动；有测试 |
| 流程 | `raw/` → `retouched/` → `webp/`（方形白底）→ `watermark-product-images.mjs` → `branded/` → `build-collection.mjs --publish` 才复制进 `public/images/brazil-collection/`；未去字的图不会进仓库 |
| 入口 | 产品菜单全语种「Panic bars for Brazil」（pt → 葡语页，其余 → 英文页）；首页阿根廷模块下新增巴西模块（全语种，四格：306-D / BR5-S / BR7-ST / BR5-TK），首页图都有 srcset（三张集合图登记进 editorial-images，306-D 进 product-image config） |
| 路由判定 | `hasSpanishMirror` / `hasPortugueseMirror` 先查 PARTIAL_ROUTES（`/products/brazil` 只有 en/pt） |

检查：npm test 463/0、i18n-lint、titles:check、eslint、tsc、impeccable detect；本地 en/pt 页面与首页 HTML（含脚本数据）客户名 0 次。发布由本会话执行（工程会话让出发布棒）。
