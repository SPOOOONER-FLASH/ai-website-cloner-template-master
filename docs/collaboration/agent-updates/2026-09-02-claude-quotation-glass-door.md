# 2026-09-02 · Claude · 玻璃门五金报价（巴西 Show de Cadeiras）+ 抬头地址集中

## 范围
- 新增 `docs/quotations/_company.json`：卖方抬头集中一处，所有作业文件共用。
- 新增 `docs/quotations/show-de-cadeiras-20260902.json`。
- `scripts/build-quotation.py`：支持 `company` 传路径；修两处版式 bug。
- `docs/quotations/novalux-sa-20260901.json` 改为引用共用抬头并重新出单（换新地址）。

## 抬头为什么要集中
官网地址更新了（`content/site-settings.json`：中山小榄镇联丰社区乐和路 28 号，
电话 +1 703 967 7493）。旧的 Novalux 作业文件里抬头是内联的，如果不集中，
每份历史作业文件都会继续印着旧地址。现在改一处，全部重跑即更新。

⚠ `content/site-settings.json` 里的电话是美国号码 `+1 703 967 7493`，
不是中国座机。若网站上那个是有意为之（海外销售线），报价单照用没问题；
若是填错，改 `_company.json` 与站点设置两处。

## 修的两处版式 bug
1. 抬头地址合并到 E 列为止，新地址更长，打印时在电话号码中间被裁掉
   （"T +1 703 967"）。改为整行 B:I，邮箱与网址挪到上一行右侧。
2. NOTES 是合并单元格不会自动换行，长注释直接印出纸张右缘、无省略号。
   改为按字数估算行数设置行高并开启 wrap。

## 客户询价单怎么读的
客人给的 `Proforma Kit Fechadura-Porta de Vidro-Atualizado.xlsx` 是一份
**佛山某家具厂的模板**，客人拿来复用的 —— 里面的条款、银行账号、
"FOSHAN WINNER FURNITURE" 抬头都不是我们的，一条都没有搬过来。
真正的需求只有两行，各 100 pcs，价格列表头是 `USD (FOB)`：

| 客人行 | 客人描述 | 我们对应 |
|---|---|---|
| 1（图：门夹+转轴） | 8/10mm 钢化玻璃平开门安装套件，带锁芯，201 不锈钢抛光 | Glass Door Patch Fitting Set |
| 2（图：D 形玻璃门锁） | SU304/锌合金，10-15mm 无框玻璃，配夹具与地弹簧，镜面/砂面/钛金/PVC | GL125 SS |

两处对不上，已写进报价单 NOTES 请客人确认，没有含糊过去：
- GL125 SS 是 8-10mm 玻璃、玻璃对玻璃锁扣；客人要 10-15mm 且图上是墙面锁扣。
- 客人表里另有 "201 不锈钢 / 黑色" 一条，不确定属于哪一行。

## 未动
`out/`、`public/images/**`、其余源码。两份成品（xlsx+PDF）在 `~/Desktop/hyde/`，含客户信息，不进仓库。

## 下一步
- 客人还需要箱规 / N.W. / G.W. / CBM 才能算海运费 —— 目录里没有这些数据，
  报价单里已承诺随价格版一起给。谁有装箱数据可以补进 `content/products/`。
