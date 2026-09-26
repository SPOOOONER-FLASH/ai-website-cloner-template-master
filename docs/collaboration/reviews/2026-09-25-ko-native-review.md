# 韩语站母语抽查（2026-09-25）

> 审校人：Claude（按韩国建築金物 / 도어 철물行业母语编辑的标准）。只改 `content/i18n/ko/` 下 8 个文件；型号、数字、单位、标准号、
> `sourceHash`、`seoTitle`/`seoDescription` 未动。`node scripts/i18n-lint.mjs --locale ko` 通过（exit 0）。
> 修改脚本在 `scratchpad/ko-review/`（`apply-terms.mjs` 术语统一、`fix-bsn.mjs` 表格换行、`ui-edits.mjs`、`glossary-edits.mjs`、`product-edits.mjs`、`cat-faq-edits.mjs`）。

## 抽查范围

| 文件 | 抽查量 |
|---|---|
| ui.json | 全部 769 条逐条对照英文 |
| glossary.json | specLabels 全部 246 条；specValues 646、finishNames、materialNames、productNames、terms 全扫 |
| categories.json / faq.json | 全部（17 类目 + 16 问答） |
| products.json | 47 个：防火/报警/双门/冷库/两点锁推杠、外侧把手、锁体（含 AR-4）、面装锁、レバー、不锈钢把手、锁芯、球形锁（轻/重型/商用）、单舌锁、合页、闭门器、顺位器、玻璃门夹、浴室配件、扶手、猫眼、门吸、天地插销、指示锁、电源过线器 |
| guides.json | 4 篇全文：backset-door-thickness-chart、commercial-lock-function-decision、en-1125-vs-en-179、fire-door-hardware-what-must-be-rated |
| news.json | 3 篇全文：ansi-grade-1-vs-en-1125、door-coordinator-double-fire-door、choosing-a-cylindrical-lock |
| projects.json | 2 个：double-leaf-fire-door-set、glass-entrance-hardware-package |

## 总体结论

**文章（指南、新闻）和产品页：韩国五金采购读起来基本是母语文案。** 합니다체统一，句子自然，行业词大多到位（백셋、센터 거리、모티스 락、스트라이크、애스트라갈、팽창성 실、차염성/차열성）。
**ui.json：约九成地道，约 5% 是英文直译腔**，已改。真正会让行内人皱眉的是**术语错误**，不是文笔——下面第 1、2 类。

## 发现的问题类别（附改前/改后）

1. **显示故障**：韩语 25 段指南表格 + 13 段新闻表格里的换行是字面的 `\n` 两个字符，渲染器（`src/lib/article-layout.ts` 按真换行切表）认不出，整张表会显示成一行竖线乱码。已改成真换行；其他 6 个语种检查过，没有这个问题。
2. **误译（意思错了）**
   - Outswing doors「외여닫이 문」（韩语意思是"单开门"）→「**밖여닫이 문**」（外开门）
   - Spray painting「**분체 도장**」（粉末喷涂，另一种工艺）→「스프레이 도장」；另有错字「스프링클 도장」
   - Armoured doors / armoured lock covers「**방탄문**」（防弹门）→「강화 방범문」「락·실린더 보호 커버」
   - Anti-pry「비틀어 열기 방지」（那是"拧"，wrench）→「**비집어 열기 방지**」（撬）；Angled grab bar「각형」（方形截面）→「**꺾임형**」
   - Computer key → 「딤플 키(컴퓨터 키)」；Communication 功能「커뮤니케이션 락」→「**연결문용**」（约 30 处）
3. **双扇门术语三套并存**：「주동문/부동문」（中文 主动/被动 直译）、「활성/비활성 문짝」（英文直译）、「주문짝/보조문짝」→ 全站统一为 **주문짝/보조문짝**（约 115 处）。
4. **加了英文没有的事实 / FAQ 是旧版**：类目「욕실 액세서리」多了"与门五金同色"、「경첩」多了"滚珠/普通轴承"、「레버 핸들」摘要写成"附锁舌和扣板"（英文是 60/70 可调、与单舌锁同钥匙）→ 按英文重写。FAQ 7 条答案是旧英文的译文（缺 Easy Return、Alibaba 自动算运费、521 个型号等句）→ 按现行英文重译。ui 首页一句多出的"각 제품군은 영문 카탈로그로 이어집니다"删除。
5. **直译腔**：「도면을 가져오십시오. 제품으로 돌아갑니다.」→「도면을 가져오시면 제품으로 만들어 드립니다.」；「대기열이 아니라 엔지니어가 읽습니다」→「자동 응답이 아니라 엔지니어가 직접 읽습니다」；「모델 번호를 들고 나가십시오」→「모델 번호까지 찾아 드립니다」
6. **术语不统一**：솔리드 황동→**통황동**、섬턴→썸턴、페이스플레이트→프론트 플레이트、셀프 로킹→자동 잠금、도어 하드웨어→도어 철물、유압 힌지→유압 경첩；单位统一为数字紧贴单位（`60mm`，与文章一致；原来产品页是 `60 mm`、文章是 `60mm`）。

## 改动计数（被改的字符串条数）

| 文件 | 条数 | 主要内容 |
|---|---|---|
| ui.json | 40 | 38 条改写 + 2 条单位空格 |
| glossary.json | 约 170 | 23 条纠错（5 个规格标签：Capacity→적용 문 무게、Handling→좌우 방향 等）+ 通黄铜 17 + 单位 121 |
| categories.json | 12 | 8 条摘要/名称重写 + 术语 |
| faq.json | 8 | 7 条答案重译 + 1 条问题 |
| products.json | 约 1,650 | 单位空格 1,412、통황동 139、썸턴 39、术语传播 29、手改 12 |
| guides.json | 约 110 | 表格 25、연결문용 17、双扇门 21、프론트 플레이트 9、其他 |
| news.json | 约 130 | 表格 13、双扇门 83、통황동 19、其他 |
| projects.json | 8 | 주문짝/보조문짝、"래치가 걸리다" |

## 仍需人工决定

1. **stile 译成「스타일」**（新闻/指南约 40 处，如「좁은 스타일 알루미늄 문」）：韩国读者会读成 style。建议「세로틀」或「협폭 프레임」，但要逐句改助词，没做。
2. **Heavy / Light Duty 译成「고하중 / 경하중」**（类目名 + 约 120 处）：能懂，但锁行业更常说「헤비듀티」。若改，建议用「헤비듀티형 / 라이트듀티형」（助词不变）。
3. **Privacy 功能**：UI 与产品页用「프라이버시용」，文章用「욕실용(프라이버시)」。两者都对，要不要统一由客户定。
4. **`seoTitle`/`seoDescription` 未动**，仍含旧词（「각형 안전 손잡이」「주택 번지 표지」「도어 하드웨어」等）；负责 SEO 字段的一方需要同步。
5. **生成文件已过期**：`node scripts/build-i18n-client-ui.mjs --check` 报 ja/ko/tr/ru/ar 的 `src/data/generated/i18n-client/*.json` 过期（ja/tr/ru/ar 在本次之前就过期）。发版前需重跑该脚本；本次未碰 `src/`。
