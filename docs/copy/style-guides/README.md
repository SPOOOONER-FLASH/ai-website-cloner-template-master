# 三个市场的文风调研：本地五金厂商怎么写（2026-09-24，Claude）

目的：HYDE 英、西、葡三语文案按**目标市场本地厂商的写法**重写，而不是按“翻译得对”重写。
**这组文件在整套文案规则里的位置**（不一致时，以排在前面的为准）：

1. `docs/collaboration/2026-09-24-copy-longtail-multilingual-plan.md`：总方案、总声音、执行顺序
2. `docs/collaboration/2026-09-24-voice-en-es-pt.md` 和 `src/data/es-glossary.ts` / `pt-glossary.ts`：每种语言怎么落地，以及术语
3. **本目录**：24 家本地公司的调研，外加三份指南（只补前两份没写的内容）

同一天另一个会话读的是另一批来源（Von Duprin、I Dig Hardware、Travex、Battaglia、Jako、La Fonte、PCF Brasil），两边合起来覆盖面更广。

三份指南：

| 指南 | 服务的读者 | 文件 |
|---|---|---|
| 英语（美国） | 美国进口商、经销商、五金规格顾问（specifier） | [en-us.md](en-us.md) |
| 西语（拉美中性） | 墨西哥、阿根廷、秘鲁的进口商和经销商 | [es-latam.md](es-latam.md) |
| 葡语（巴西） | 巴西的经销商和门厂 | [pt-br.md](pt-br.md) |

本次新增的待办和待决：[`docs/collaboration/tasks/2026-09-24-copy-style-rewrite.md`](../../collaboration/tasks/2026-09-24-copy-style-rewrite.md)

**重跑语料**：`node scripts/collect-copy-corpus.mjs`，输出到 `tmp/claude-copy-corpus/`，该目录已被 gitignore。
语料是别家受版权保护的文字，只供分析，**不进仓库，也不上我们的页面**。指南里的例句全部是用 HYDE 自己的产品写的。

**量化**：`node scripts/normalize-us-spelling.mjs --check` 和 `node scripts/normalize-regional-terms.mjs`（不加参数时只报告，不修改）。

---

## 一、调研了哪些公司

挑选标准：当地的**门锁、五金制造商或品牌方**优先，零售商只作补充；每家至少看首页，再看一页产品页或类目页。

### 美国

| 公司 | 定位 | 看了什么 |
|---|---|---|
| Baldwin | 高端住宅，80 年历史 | 首页、执手/玫瑰底座类目页 |
| Emtek | 高端住宅，可定制 | 首页、Deadbolt 类目页 |
| Detex | 商用逃生装置，百年厂 | 首页、Advantex 与 Value Series 系列页 |
| Marks USA | 商用锁、逃生装置，对标大牌 | 首页 |
| TownSteel | 商用锁，项目与规格支持 | 首页、Rejuvenator 页 |
| PBB | 合页专业厂 | 首页 |
| Deltana | 建筑五金，库存型 | 首页 |
| FSB（德国） | 甲方点名的克制标杆 | 英文首页 |
| ASSA ABLOY US | 行业集团 | 美国首页 |

### 墨西哥

| 公司 | 定位 | 看了什么 |
|---|---|---|
| Truper | 墨西哥最大的五金工具集团 | 首页、两份门锁技术规格页（ficha técnica） |
| Phillips（ASSA ABLOY） | 墨西哥门锁国民品牌 | 首页、X-1100 产品页 |
| Helvex | 高端卫浴 | 首页（只作反例） |

### 阿根廷

| 公司 | 定位 | 看了什么 |
|---|---|---|
| Kallay | 1946 年创立的锁厂 | 首页、门锁类目与筛选项 |
| Trabex | 70 多年的门锁品牌 | 首页 |
| Fratelli Currao | 1964 年创立的建筑五金厂 | 首页、产品线页 |
| Easy（Cencosud） | 建材零售 | 首页（只看称呼方式） |

### 秘鲁

| 公司 | 定位 | 看了什么 |
|---|---|---|
| Cantol | 秘鲁本土锁厂，约 50 年 | 首页、公司介绍、挂锁产品页 |
| Forte（ASSA ABLOY） | 秘鲁门锁品牌 | 首页 |

### 巴西

| 公司 | 定位 | 看了什么 |
|---|---|---|
| Papaiz（ASSA ABLOY） | 1952 年创立的门锁品牌 | 首页、门锁产品线页 |
| Aliança Metalúrgica | 1927 年创立的门锁厂 | 首页、LINIE 5051 产品页 |
| Soprano | 门锁、五金、电工，面向经销商 | 首页、玻璃门锁类目页 |

**因为有机器人验证而没抓到的**（没有绕过）：Hager、Allegion 旗下品牌（Von Duprin、Ives）、Grainger、National Hardware、Don-Jo、Accurate、Home Depot México、Lock（墨西哥）、Pado、Stam、IMAB。
已经用定位相同、页面公开的公司替代，结论不受影响。

---

## 二、拆分：五条跨市场规律

### 1. 品牌承诺落在“安心”这个词上，而且三个语种用的是同一个词

- 阿根廷 Kallay：品牌口号和使命里都用 *tranquilidad*（安心）。
- 秘鲁 Cantol：口号是 *Vive tranquilo*（安心过日子）。
- 巴西 Papaiz：口号用 *tranquilo*（放心）。

这和甲方老板那句“工厂给人专业感觉，他们会睡得安稳”说的是同一件事。
**不同的是，本地品牌对终端消费者说“家里安心”，HYDE 要对采购商说“下单安心”**：型号不会错、孔位不会错、柜子到港不用返工。
这个词可以用，但对象要换，见各指南第 1 节。

### 2. 产品描述 = 按部件列材质

写法最成熟的三家不约而同：

- **Papaiz**：一整句名词短语，依次写功能、backset（distância de broca）、每个部件用什么材料、钥匙和锁芯用什么材料、锁芯长度。
- **Phillips**：逐条列点，每条是“部件 + 材料 + 起什么作用”。
- **Truper**：规格优先，英寸和毫米并写，适配门厚写成区间。

美国商用品牌（Detex、Marks）换了一种写法：**标准等级 + 适用场景 + 系列号**，比如 Grade 1、UL、适用学校或高频使用场景。

→ HYDE 的规格行本来就是按部件列尺寸的（面板、锁体、锁舌伸出量），**这是最该学、成本也最低的一条**。材质只写目录公开了的。

### 3. 历史写成具体年份，不写“多年经验”

Kallay 写 1946，Currao 写 1964，Papaiz 写 1952，Aliança 写 1927，Trabex 写 70 多年，Baldwin 写 80 年，Detex 写百年。**没有一家写“many years of experience”**。
→ HYDE 只写能核实的年份和数字；不知道的空着，问甲方。

### 4. 产地直说

- Truper 在每份技术规格页上写明**在中国制造、按 Truper 规格生产**。墨西哥第一大五金品牌不回避产地，把“按谁的规格”当成质量保证。
- Cantol 把“秘鲁制造”做成卖点。

→ HYDE 写“在中国自有工厂生产”时语气平实就行，重点落在**按什么规格、谁来检验**。

### 5. 本地品牌也有 HYDE 不能学的写法

| 写法 | 谁在用 | 为什么不学 |
|---|---|---|
| 感叹号标题 | Phillips | 面向零售；采购商读到会觉得不专业 |
| 数字清单式标题党（“15 个真相”） | Aliança 的博客 | 给搜索引擎写的，会降低信任 |
| 生活方式散文（水、仪式感、宇宙） | Helvex、Baldwin | 高端消费品的写法，和 FSB 式的克制相反 |
| 自称“行业领导者” | Trabex、Kallay、Detex、Baldwin | 每家都这么说，等于什么也没说 |
| 优惠、限时促销话术 | Forte、Easy、Tramontina | 零售话术 |

---

## 三、各市场的差异

| | 美国 | 墨西哥 | 阿根廷 | 秘鲁 | 巴西 |
|---|---|---|---|---|---|
| 怎么称呼读者 | you，或不用人称的祈使句 | tú（零售）；规格页用无人称 | **vos**（Explorá、podés） | tú | você，或无人称 |
| 尺寸单位 | 英寸为主，商用规格带 ANSI 等级 | **英寸（毫米）并写** | 毫米 | 毫米 | 毫米 |
| 标准与认证 | ANSI/BHMA、UL 放在显眼处 | 少 | 少，写“安全等级” | 少 | 少，写获奖和 Top of Mind |
| 表面处理叫什么 | finish | acabado | **terminación** | acabado | acabamento |
| 执手叫什么 | lever | manija | manija（**picaporte 在这里指执手**） | manija | maçaneta |
| 语气 | 短而笃定，用法先行 | 规格优先 | 讲历史，有温度 | 讲本地制造和安全 | 讲部件和耐用，强调“适合海边的防腐” |

西语一个 `/es/` 要同时服务三个国家，所以西语指南定的是**中性拉美西语**：
不用 vos，避开只在一个国家通用的词，某个词在各国意思不同时，第一次出现写成“通用词（地区词）”。

---

## 四、HYDE 现状（2026-09-24）

早上用旧的检出统计过一次：英语有 620 处英式拼写；西语有 manilla 215、picaporte 85、cortafuegos 21。
同一天，另一个会话的 `normalize-us-spelling.mjs` 和 `normalize-regional-terms.mjs` 已经改掉其中大部分，并加了测试守住。**现在还剩的**：

| 语言 | 剩什么 | 处理 |
|---|---|---|
| 西语 | cortafuegos 21 处 | voice 文件已定 puerta cortafuego → 在 normalize-regional-terms 里加一条规则 |
| 西语 | picaporte 106 处（指锁舌） | 在阿根廷口语里指执手 → 待甲方决定，见 es-latam.md 第 4 节 |
| 英语 | tonnes、labour、recognised、authorisation 等十几处 | 补进 normalize-us-spelling 的词表 |
| 葡语 | tens 4 处（tu 的动词形式） | 看上下文，逐处改 |
| 葡语 | 产品规格里的小数点（产品层） | 并入总方案的产品层；文章里已经用逗号 |

---

## 来源

美国：[Baldwin](https://www.baldwinhardware.com/) · [Emtek](https://www.emtek.com/) · [Detex](https://www.detex.com/) · [Marks USA](https://marksusa.com/) · [TownSteel](https://www.townsteel.com/) · [PBB](https://pbbinc.com/) · [Deltana](https://deltana.net/) · [FSB](https://www.fsb.de/en/) · [ASSA ABLOY US](https://www.assaabloy.com/us/en)
墨西哥：[Truper](https://www.truper.com/) · [Truper 技术规格页](https://www.truper.com/ficha_tecnica/Cerraduras-de-sobreponer-clasicas.html) · [Phillips](https://www.phillips.com.mx/) · [Helvex](https://www.helvex.com.mx/)
阿根廷：[Kallay](https://www.kallay.com/) · [Trabex](https://trabex.com/) · [Fratelli Currao](https://www.fratellicurrao.com.ar/) · [Easy](https://www.easy.com.ar/)
秘鲁：[Cantol](https://cantol.com.pe/) · [Forte](https://forte.com.pe/)
巴西：[Papaiz](https://www.papaiz.com.br/pt/index) · [Aliança](https://www.aliancametalurgica.com.br/) · [Soprano](https://www.soprano.com.br/)
