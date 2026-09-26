# 土耳其语母语抽查（2026-09-25）

审校角色：土耳其语母语、五金外贸背景。只改 `content/i18n/tr/*.json` 的译文，型号、数字、单位、标准、数组长度、`sourceHash`、`seoTitle/seoDescription` 均未动。改后 `node scripts/i18n-lint.mjs --locale tr` 通过（exit 0）。

## 抽查范围

- `ui.json`：全部 769 条逐条对照英文。
- `glossary.json`：specLabels 246 条全读；specValues 646、finishNames、materialNames、productNames、terms 全部过一遍。
- `categories.json`、`faq.json`：全读，逐句对照英文。
- `products.json`：抽 49 个产品，覆盖逃生推杠、锁体、执手、不锈钢拉手、锁芯、球锁、天地/夜锁、单舌锁、合页、闭门器、顺位器、卫浴、扶手、玻璃门配件、猫眼、门吸、插销、指示锁、护舌板等；另对全部 521 条做格式扫描。
- `guides.json` 4 篇（backset 表、锁体对比、合页等级、闭门器力度）；`news.json` 3 篇（顺位器、开门方向、backset/中心距）；`projects.json` 2 个（双开防火门套装、玻璃门入口套装）。

## 总体结论

**可以当作母语文案发布。** 文章和指南质量最高：用 siz 敬语，ı/İ/ş/ğ 全对，小数用逗号、千位用点（200.000、5.000），行业词基本地道（gömme kilit、aks mesafesi、karşılık、kapı kapatıcı、dile oturmak、kumpas、lamba、kapı çıtası）。土耳其五金买家读起来会觉得是专业供应商写的。问题集中在界面短句的直译、同一概念前后用词不一、少数旧译文与现行英文不同步。

## 问题类型与例子

1. **英文直译（calque）**：`Export desk` 译成 “İhracat masası”（字面“出口桌子”）→ 改 “İhracat birimi”；另有 “doğru masaya ulaşır” → “doğru kişiye ulaşır”。
2. **术语错误**：`communication lock`（酒店连通门锁）译成音译 “KOMÜNİKASYON KİLİDİ” → 改 “ARA KAPI KİLİDİ”，词表、分类、3 个产品同步改。`Latch Guard` 译成 “Mandal Koruma Plakası”，与全站 Latch = “Dil” 不一致 → 改 “Dil Koruma Plakası”。
3. **“assembly” 被译成 “montaj”（安装）**：“onaylı bir montaj ile duvardaki bir delik” → “onaylı bir kapı sistemi ile…”。防火门语境里意思完全变了。
4. **语法**：复合名词缺所属格后缀，“Kapı Kapanma Sıralayıcı” → “Kapı Kapanma Sıralayıcısı”（产品名、标题、文章里共 20 多处）；“dikey kayıtı” → “dikey kaydı”。
5. **与英文不同步或漏译**：FAQ 里 7 个答案是旧版英文的缩写译文，漏了 Alibaba 运费自动计算、Easy Return、“17 个家族 521 个型号”等句子，已按现行英文补全。9001 等 32 个不锈钢拉手的特点写成“要详细尺寸请联系出口团队”，英文只是 “Contact us for more details”，已改为忠实译法。分类摘要里有 3 条加了英文没有的内容（如“kaplaması kapı aksesuarıyla uyumlu”），已删。
6. **格式**：合页摘要里的 `3.5"x2.28"x1.6MM`、夜锁装箱数据 `30.2×26×40.4`、`0.88”` 等仍是英文数字格式 → 改为 `3,5" × 2,28" × 1,6 mm`、`30,2 × 26 × 40,4`、`0,88”`。
7. **同一概念用词不一**：door hardware 在标题里时而 “kapı aksesuarı” 时而 “kapı donanımı”；private label 与 “özel marka” 混用；faceplate 有 “ön plaka / ön alın / alın plakası” 三种。抽查范围内统一为 kapı donanımı / özel marka / alın plakası（与词表一致）。

## 修改数量（按字符串计）

| 文件 | 改动 |
|---|---|
| ui.json | 30 |
| glossary.json | 20（specLabels 10、specValues 7、finishNames 1、productNames 2） |
| categories.json | 9 |
| faq.json | 10 |
| products.json | 107（含全目录的术语/格式传播修正） |
| guides.json | 25 |
| news.json | 22 |
| projects.json | 6 |

## 需要人工决定

1. **“60mm” 还是 “60 mm”**：土耳其标准写法数字与单位之间空格；产品页已是 “60 mm”，但指南/新闻里还有约 100 处 “60mm”（多在表格里，部分贴着型号）。是否统一，需要一次性决定，避免碰坏型号串。
2. **“montaj” 表示 assembly**：抽查的文章已改；guides/news 全部共 125 处 “montaj”，大部分是正确的“安装”义，少数指“门组件”。要逐篇读，建议下一轮母语审校处理。
3. **“backset” 保留英文**：按 brief 保留，土耳其同行能看懂；如客户希望更本地化，可改成 “backset (kenar mesafesi)” 首次出现时加注。
4. **分类 “Yardımcı aksesuarlar”（Hardware Accessories）** 和 **“kelebek menteşe / yaprak menteşe”（butt hinge）** 两种说法市场都用，目前保留原样，未强行统一。
5. `categories.json` 和 `faq.json` 中大部分条目没有 `sourceHash`，说明它们不在自动同步范围内；英文再改时不会提示土耳其语过期，需要人工跟进。

另注：审校中执行过一次只读的 `git diff --stat`（查看改动规模），未做任何暂存或提交。
