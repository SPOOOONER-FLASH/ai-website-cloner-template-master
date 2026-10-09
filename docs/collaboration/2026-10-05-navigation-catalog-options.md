# 导航、侧边栏与「要目录」的询盘 — 三个方案（2026-10-05）

甲方：「客户很多第一反应找我们要目录……是我们做的不够清晰还是他们懒惰……给几个预览吧。」
例句来自科特迪瓦阿比让的进口商：*Could you please send us your catalog, wholesale prices, and minimum order quantities?*

## 结论：两边都有

**买家这边。** 这类开场白是群发模板：同一段话发给 10 到 30 家工厂，把目录、价格、起订量收齐后线下比价、转给老板。很多人根本不打开网站。所以网站改得再好，这种邮件也不会消失；业务端需要一封「一键回复」（见最后一节）。（推断，依据是 B2B 进口采购的通行做法，不是我们的询盘统计。）

**我们这边。** 买家要的三个词 Catalog、Price、MOQ，在顶部导航里一个都没有：

1. 目录 PDF 在「Buy it now › Downloads」第二层，标题叫 Downloads。
2. 起订量的答案在「FAQ」里，标题看不出来。
3. 「Buy it now」读起来像零售网店的「立即购买」，批发商不会点；点开后最显眼的黑色大按钮是「Buy on Alibaba」，把人送出网站。
4. 手机上点「Buy it now」，侧边栏的标题是「What are you trying to specify?」，这是问建筑师的问题，不是问进口商的。
5. 侧边栏 24 个链接分 4 栏，「Price list」排在第 4 栏第 2 个。
6. 1376 到 1599px 宽的笔记本（1440、1536 都很常见）看到的是第二行紧凑导航，不是截图里那一行。

**面包屑不是瓶颈。** 09-28 已改为一行不换行，逻辑清楚，这次不动；新页面同样带面包屑。

## 三个方案都带的新页面：/wholesale/（Catalog & prices）

一页回答三问：目录 PDF 直接下载（不填表）、批发价怎么报、起订量；下面是条款一览（起订量、交期、样品、付款、贸易术语）、下单五步、询价表单。
所有数字都来自现有 FAQ：多数型号 300 到 5,000 件，生产 30 天起，样品收费且可抵扣首单，T/T 或即期 L/C，EXW、FOB、DDP。
价格不公开、按型号报，延续 09-22 去掉「Price list」链接的决定（那个链接承诺了一份我们不公开的文件）。
这个链接也是业务回复询盘时可以直接贴的那一个。

## 方案

| | A 采购入口（推荐） | B 轻改 | C 常驻采购条 |
|---|---|---|---|
| 顶部最后一项 | 「Catalog & prices」描边按钮，点击进 /wholesale/，悬停展开 | 改名「Catalog & quote」，样式不变 | 同 A |
| 展开层 | 目录 PDF 黑色主按钮（直接下载）· 批发价格 · 起订量/交期/付款 · 下单流程；Alibaba 降为一行小字 | 同 A，第四格是 Contact | 同 A |
| 手机右侧黑按钮 | 「Catalog & prices」直达入口页 | 「Catalog & quote」，仍打开侧边栏 | 同 A |
| 侧边栏 | 标题改「What do you need first?」，前三行：目录 PDF / 批发价与起订量 / 询价 | 同 A | 同 A |
| 额外 | 无 | 无 | 每页最顶上一条灰色细条：目录 PDF ↓ · 起订量 300–5,000 · 生产 30 天起 · EXW·FOB·DDP，随页面滚走 |

**推荐 A。** 三个词进了第一屏，PDF 一次点击，手机上不再先问规格。C 最显眼，但顶部会叠三层（细条、导航、BAU 横幅），读起来像在推销，和「专业、不花哨」的原则相反；B 改动最小，但手机按钮仍先进侧边栏。

PR #5 里提过把「Buy it now」改成「Request a quote」。这次没有照搬：顶部用「Catalog & prices」，因为买家第一句要的是目录和价格，不是报价单；「Request a quote」放进侧边栏和入口页。

截图在 `/mnt/project-files/navigation-catalog-2026-10-05/`（现状、A、B、C 各 5 张，加入口页电脑版和手机版）。

## 业务回复模板（比导航更快见效）

入口页上线后，回复这类询盘只需：附目录 PDF，贴 /wholesale/ 链接，问三个问题。买家来自法语区（科特迪瓦）时，附法语版。

English:

> Dear Mustafa,
> Thank you for contacting HYDE. Our product catalog is attached (PDF, 79 pages).
> Minimum order, lead time and payment terms are on one page: https://cantonlock.com/wholesale/
> Prices are quoted by model, finish and quantity. To send prices with the minimum for each line, please tell us:
> 1. the product families or model numbers you are interested in;
> 2. the approximate quantity per model;
> 3. delivery: FOB China port, or delivered to Abidjan (DDP).
> You can also reach me on WhatsApp: +1 703 967 7493.

Français :

> Bonjour Monsieur Hallal,
> Merci de votre message. Vous trouverez notre catalogue en pièce jointe (PDF, 79 pages).
> Minimum de commande, délais et conditions de paiement : https://cantonlock.com/wholesale/
> Nos prix dépendent du modèle, de la finition et de la quantité. Pour vous envoyer les prix et le minimum par ligne, merci de nous indiquer :
> 1. les familles de produits ou les références qui vous intéressent ;
> 2. la quantité approximative par référence ;
> 3. la livraison : FOB port de Chine, ou rendu Abidjan (DDP).
> Vous pouvez aussi me joindre sur WhatsApp : +1 703 967 7493.

## 选定之后

- 删掉另外两个方案和切换开关，选中的方案设为默认。
- /wholesale/ 目前只有英文；选定后补西语、葡语页面，七个叠加语种交给多语种会话（新标签在这七种语言里暂显示英文）。
- 上线后看三项：目录 PDF 下载（GA4 file_download）、/wholesale/ 访问、generate_lead。导航点击次数本身不算成功。
- 另发现：Downloads 页面的 meta 描述在十种语言里都写「46 页目录」，实际目录是 79 页。归多语种会话修。
