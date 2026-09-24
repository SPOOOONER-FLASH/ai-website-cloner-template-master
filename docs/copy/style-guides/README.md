# HYDE 文案方向：写给 B 端采购（2026-09-24，Claude）

## 〇、先纠正方向

上午的第一版调研看的多是面向消费者的锁具品牌，结论落在“安心”这个词上，也就是“家里安全”。**这是错的。**
甲方老板说的“让买家睡得安稳”，是**采购方**的安心：相信这家工厂专业、资深，代工质量稳定，价格合适。
我们是 B2B：给经销商、门厂、防火门安装和维保公司、进口商做 OEM 贴牌供货，不卖给终端家庭。

所以本目录的规则只有一条总纲：**每一句话都要让一个谨慎的采购更愿意下单。** 家里防盗、守护家人这类话，一句都不写。

**文案规则的优先级**（不一致时，以排在前面的为准）：

1. `docs/collaboration/2026-09-24-copy-longtail-multilingual-plan.md`：总方案，“工程师口吻”十条
2. `docs/collaboration/2026-09-24-voice-en-es-pt.md` 和 `src/data/es-glossary.ts` / `pt-glossary.ts`：每种语言怎么落地，以及术语
3. **本目录**：B 端买家是谁、他们在问什么，以及三份市场补充 [en-us](en-us.md) · [es-latam](es-latam.md) · [pt-br](pt-br.md)

执行计划：[`docs/collaboration/tasks/2026-09-24-copy-style-rewrite.md`](../../collaboration/tasks/2026-09-24-copy-style-rewrite.md)

---

## 一、四个真实买家告诉我们的事

| 买家 | 怎么来的 | 第一封信问什么 | 结果 |
|---|---|---|---|
| **D.P. Serraller**（巴塞罗那，1982 年创立，金属门锁和五金的制造兼分销商，只卖给专业客户） | 在 Clarity 里看到他们浏览了网站，随后发来询盘 | 四款推杠能不能统一用 **9×9 mm 方轴**（他们所有的防火门锁和执手都用这个尺寸）；能否附**西语说明书**、在侧壳上贴他们的**标签**；侧壳是不是**金属**的；有没有**有效的 CE 证书** | 按型号要了 7 项报价，50 到 250 件不等，说明是**反复采购的消耗品**，可以走阿里巴巴也可以直接交易 |
| **SAGA Portas**（圣保罗，防火门维保公司兼五金网店） | 在 Clarity 里看到浏览，随后主动联系 | 我们在巴西有没有经销商，想谈合作 | 在谈；他们的服务页围绕 **NBR 11742**（巴西防火门逃生五金标准）和 **AVCB**（消防验收证书）写 |
| 瑞士用户 | ChatGPT 直接把他送到 LC04 85×60 产品页 | 他问的是带参数的问题；页面上中心距、backset、锁芯都写成了文字 | 落到了具体产品页 |
| 澳大利亚用户 | ChatGPT 送到产品总目录 | 自己点进合页，看了 SSH018，下载了目录 PDF | 发来询盘 |

**共同点**：

1. 先按**具体型号和尺寸**找过来，数字写成文字的页面才会被搜到、被 AI 引用。
2. 第一轮问的是**能不能配上**（方轴、材质）、**能不能贴牌**（标签、说明书语种、包装）、**有什么文件**（CE、测试报告），没有人问“你们的产品好不好”。
3. 下单是**成组、反复**的：推杠、执手、顺序器一起要，这是双开防火门的一整套配置。
4. 他们要一条**低风险的交易路径**：阿里巴巴平台或直接交易。

## 二、向 B2B 大公司学什么

| 学什么 | 谁在这么做 | 用到 HYDE |
|---|---|---|
| **按身份分入口** | Hettich 首页让访客先选“工业客户、经销商、木工、建筑师、安装商” | 分成三个入口：经销商和进口商 / 门厂（OEM）/ 防火门安装和维保 |
| **把服务说具体** | Hettich 列出 CAD 设计工具、招标规格文本、安装视频、技术助手 | 我们能给的：图纸、规格文本、西语和葡语安装说明、标签和包装选项、打样流程 |
| **说明只卖给专业客户** | Serraller 首页写“只卖给行业专业客户” | 写明我们只供行业客户，写清最小起订量（数字待甲方给） |
| **懂标准** | Serraller 写自己是 AENOR 标准委员会成员、按 EN 13241 做 CE；SAGA 写 NBR 11742 和 AVCB | 每个市场用一篇文章讲清当地标准管什么；**不声称符合我们没拿到的认证** |
| **物流说具体** | Serraller 写条码标签、24 到 72 小时到货 | 纸箱标签、交期、装柜方式：数字要工厂给 |
| **强调合作伙伴关系** | Hettich 给经销商那一栏的口号是“以 Hettich 为伙伴，因为信任对我们很重要” | 对经销商写：稳定供货、同一型号每批一致、贴牌不外泄 |

Häfele、Yale 和 ASSA ABLOY 的商用站点有机器人验证，没有抓取，也没有绕过。

## 三、“安心”对 B 端采购意味着什么，以及怎么写出来

| 采购心里的问题 | 用文案怎么回答 |
|---|---|
| 这家厂懂不懂自己的零件？ | 尺寸精确到毫米，写成文字；不知道的写“待确认”，不编 |
| 他们做了多久，给别人代工过吗？ | 写能核实的年份、年产量、出口国家数；不点客户名字 |
| 每一批都一样吗？ | 写检验流程、打样和首件确认、批次追溯 |
| 价格合不合适？ | 不写“低价”；写“同一套模具多家品牌共用，所以起订量低”这类能让人理解成本结构的事实 |
| 出了问题找谁？ | 写报价、下单、验货、售后各一步谁负责、多久回复 |

## 四、三个语种的读者

| 语种 | 读者 | 要特别注意 |
|---|---|---|
| 英语 | 美国、澳大利亚、东南亚、中东的进口商和经销商 | 美式拼写（已有脚本和测试守住） |
| 西语 | **西班牙**、秘鲁、乌拉圭、阿根廷、墨西哥 | Search Console 里西班牙有 60 次展示，AI 摘要里也有 15 次；下单的 Serraller 用的是西班牙西语（manilla、puerta cortafuegos、coordinador de hoja）。拉美中性西语的写法，**西班牙读者也必须读得懂**，见 es-latam.md |
| 葡语 | 巴西的经销商、门厂、防火门维保公司 | NBR 11742 和 AVCB 是他们的日常词汇 |

---

## 附：上午的消费端调研（方向偏了，只留用词参考）

上午调研了 24 家：美国 Baldwin、Emtek、Detex、Marks USA、TownSteel、PBB、Deltana；墨西哥 Truper、Phillips；阿根廷 Kallay、Trabex、Fratelli Currao；秘鲁 Cantol、Forte；巴西 Papaiz、Aliança、Soprano。
还能用的只有三条：

- **按部件写材质**（Papaiz、Phillips、Truper），B 端一样适用。
- **产地直说**：Truper 在每份规格页上写明在中国制造、按 Truper 的规格生产。
- **历史写具体年份**，不写“多年经验”。

重跑语料：`node scripts/collect-copy-corpus.mjs`，输出到 `tmp/claude-copy-corpus/`，已 gitignore，不进仓库，也不上页面。

## 来源

[Serraller](https://serraller.es/) · [SAGA 服务页](https://portacortafogo.com/servicos) · [Hettich](https://www.hettich.com/en-de) · [Hettich 服务页](https://www.hettich.com/en-de/services) · [Detex](https://www.detex.com/) · [TownSteel](https://www.townsteel.com/) · [Truper 规格页](https://www.truper.com/ficha_tecnica/Cerraduras-de-sobreponer-clasicas.html) · [Papaiz](https://www.papaiz.com.br/pt/produtos/linha-de-fechaduras)
