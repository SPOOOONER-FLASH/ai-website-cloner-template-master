# 三语写作口吻：美式英语 · 拉美西语 · 巴西葡语（2026-09-24）

> 甲方 09-23：「英语要像美国人写的，西语像阿根廷或者秘鲁墨西哥人写的，葡萄牙就是巴西人写的，不能念起来呆板，
> 机械化，过多的解释很机器写的感觉……你能找到各自语言的素材学习吗」。
> 总声音不变：见 `2026-09-24-copy-longtail-multilingual-plan.md` 第二节「一位把数字说清楚的工厂工程师」十条。
> 本文件只管**每种语言怎么落地**。术语以 `src/data/es-glossary.ts` / `pt-glossary.ts` 为准，本文件不另立术语。

## 学了哪些素材

| 语言 | 来源（09-24 读过） | 学什么 |
|---|---|---|
| 美式英语，产品页 | Von Duprin 98/99（Allegion 官网） | 型号 + 描述性名词短语当标题；卖点是名词短语；标准写全称 |
| 美式英语，文章 | I Dig Hardware（美国五金顾问博客，按规范条款答问） | 第一人称、问答开头、条款号直接引用、口语化但术语精确 |
| 拉美西语 | Travex（秘鲁）、Battaglia（阿根廷）、Phillips / Jako（墨西哥） | 无人称或 usted；「vía de escape」「salida de emergencia」「puerta cortafuego」；不用 voseo |
| 巴西葡语 | La Fonte（ASSA ABLOY 巴西）、PCF Brasil（防火门行业博客）、Papaiz | 无人称为主、você 用在文章；「corta-fogo」「alta circulação」「evacuação」 |

**只学结构和用词，不学它们的认证话术**：Von Duprin 写「Grade 1」「UL 305」，La Fonte 写「120min de fogo」，
那是它们有证书。我们没有，就不写，也不写「符合」「按照」某标准。

## 美式英语（cantonlock.com 英文）

| 项 | 规则 | 例 |
|---|---|---|
| 拼写 | **美式**：center, aluminum, color, gray, catalog（文件名和 URL 里的 catalogue 不动） | 现状：全站英式，centre 90 处、aluminium 52 处、center 0 处 |
| 行业叫法 | exit device（正文）/ panic bar（标题，买家搜这个）；lever（不说 handle）；mortise（不说 mortice）；strike；faceplate；trim；opening；hardware set | 「a pair of openings on a hardware set」 |
| 单位 | 公制在前，英制括号在后；backset 必给英寸 | 60mm (2-3/8") |
| 文章口吻 | 允许 we / you、缩写（don't, it's）；开头直接回答问题，第一句不铺垫 | 「Two. Most buildings need two levels, not four.」 |
| 产品页口吻 | 不用缩写；卖点是名词短语，一条一个事实 | 「Stainless steel strike, 304」 |
| 规范 | 可以**解释**规范条款在管什么，不能说我们的产品符合 | 「IBC 1010 governs the release force; ask for the test report」 |
| 删掉 | 「In today's…」「It's worth noting」「Whether you're…or…」「robust」「seamless」「elevate」 | |

## 拉美中性西语（/es/）

| 项 | 规则 | 例 |
|---|---|---|
| 地区 | 中性拉美，不偏墨西哥；术语已由 `normalize-regional-terms.mjs` 统一、测试守着 | manija、tirador、cerradero、entrada、planilla de puertas |
| 称呼 | usted；产品页无人称（se instala, se entrega）；不用 vos、tú、vosotros | 「Envíe la planilla de puertas」 |
| 行业叫法 | barra antipánico、cerradura de embutir、puerta cortafuego、vía de escape、salida de emergencia、herrajes、obra、cotización | |
| 单位 | 数字和单位之间空格；小数避免出现，必须时用逗号 | 60 mm |
| 句法 | 主动或 se 被动，不用 ser + 过去分词；不堆副动词；一句不超过两层从句 | 「se fabrica」而非「es fabricado」 |
| 删掉 | 英文直译的空话：「ofrecemos soluciones」「de alta calidad」「en orden de」「aplicación」滥用 | |

## 巴西葡语（/pt/）

| 项 | 规则 | 例 |
|---|---|---|
| 称呼 | 文章用 você；产品页无人称 | 「Você envia a planilha de portas」 |
| 语序 | 代词前置（巴西），不用欧葡后置 | 「o obriga」，不写「obriga-o」 |
| 用词 | equipe（不写 equipa）、planilha、obra、orçamento、porta corta-fogo、barra antipânico、fechadura de embutir、maçaneta（执手）、puxador（拉手） | |
| 单位 | 空格 + 小数逗号 | 60 mm；2,5 mm |
| 待确认 | 巴西厂商（Pado、Papaiz）规格表里 backset 常写「distância de broca」，我们术语表用「distância ao eixo」（158 处）。**先问巴西买家或审校再改**，不自行替换 | |
| 删掉 | 「soluções completas」「alta qualidade」「no mercado atual」 | |

## 执行

1. **美式拼写是一次脚本改动，不是手改**：写 `scripts/normalize-us-spelling.mjs`（只改 content/news、content/guides 的
   英文字段和 `src/app/(en)` 的文案，跳过 URL、文件名、型号），加守卫测试，防止回退。产品记录（中性、两站共用）
   等第一阶段生成器那一行做完再跟。
2. 文章改写按 GSC 循环的顺序（展示多、点击少的先改），每篇三种语言一起改，不逐句对译。
3. 每批改完：`npm test`（含地区用语守卫）→ 提交 → `npm run ship` → HYDE 发布。
