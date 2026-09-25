# 七语种市场落地站：写作说明（2026-09-24）

> 甲方 09-24：「做法德语 日韩语 土俄语 加个阿拉伯语，7 个地道、专业、流畅的语言页面，拿 SEO 和 GEO 权重」。
> 工程方案见 `docs/collaboration/agent-updates/2026-09-24-claude-market-locales.md`。本文件是**每个语种的写作说明**，
> 翻译者只读这一份加英文源文本。

## 产出物

每个语种一个文件：`src/data/market/<code>.ts`，导出 `export const <code>Copy: MarketCopy = { locale: "<code>", … }`。
形状由 `src/data/market/types.ts` 决定，**每个字段都必须有**，编译器守着。源文本是 `src/data/market/source.en.ts`，
**只从英文写，不从西语或葡语转译**（原因见 `src/lib/localised.ts` 头注释）。

## 七个语种、变体和称呼

| code | 变体 | 称呼 | 行业叫法参考（只借叫法，不声称符合） |
|---|---|---|---|
| fr | fr-FR，中性，非洲法语区和魁北克可读 | vous | NF / EN：barre anti-panique（EN 1125 官方译名「fermeture anti-panique」），serrure à mortaiser / à larder，béquille，cylindre européen，entraxe，axe (backset)，ferme-porte，paumelle |
| de | de-DE | Sie | DIN / EN：Panikverschluss / Paniktürverschluss（EN 1125），Panikstange，Einsteckschloss，Drücker，Profilzylinder，Dornmaß (backset)，Entfernung (centre distance)，Türschließer，Band，Schließblech |
| ja | ja-JP，です・ます体 | 敬体、B2B | JIS：パニックバー / パニックデバイス，箱錠（はこじょう），レバーハンドル，シリンダー，バックセット，ドアクローザー，丁番（ちょうばん），ストライク，マスターキーシステム |
| ko | ko-KR，합니다체 | 존댓말、B2B | KS：패닉바 / 패닉 엑시트 디바이스，모티스 락（박스 자물쇠），레버 핸들，실린더，백셋，도어 클로저，경첩，스트라이크，마스터키 시스템 |
| tr | tr-TR | siz | TSE / EN：panik bar，gömme kilit，kapı kolu，silindir（barel），kilit gövdesi，kapı kapatıcı（hidrolik），menteşe，karşılık（strike），master anahtar sistemi |
| ru | ru-RU | Вы | ГОСТ 术语：устройство «антипаника»，ручка «антипаника»，врезной замок，дверная ручка（нажимная），цилиндровый механизм，бэксет（расстояние до оси），доводчик，петля，ответная планка，мастер-ключ |
| ar | 现代标准阿拉伯语，海湾工程采购读者 | 敬称 | 海湾项目常用英阿对照：جهاز الخروج الطارئ / بار الهلع (panic bar)，قفل مثبت داخل الباب (mortise)，مقبض ذراع，أسطوانة القفل，مسافة الظهر (backset)，غلاق الباب，مفصلة，نظام المفتاح الرئيسي。**数字用西式阿拉伯数字 0–9，型号不翻、不镜像。** |

## 十条写作规则（所有语种共用）

声音是「一位把数字说清楚的工厂工程师」：

1. **不是逐句对译，是用本语种重写。** 读者要读不出这是译文。可以拆句、并句、调语序；不能加英文里没有的事实。
2. 短句。一句一个意思。删掉「解决方案」「高品质」「在当今市场」这类空话。
3. 数字带单位，公制。`60 mm`、`30 天`、`300–5,000 件`。数字和单位的空格、千分位、小数按各语种习惯。
4. **不翻的东西**：HYDE、Canton Hyland、Canton Hyland Hardware (Group) Co., Ltd.、型号（KD070/30-290、607 SS ET）、标准号（EN 1125、ISO 9001、EN 1125:2008）、报告编号、Intertek、CELAB、Alibaba、Incoterm 缩写（EXW、FOB、DDP、DAP、T/T、L/C）、邮箱。
5. **地名**按各语种惯用译法：Zhongshan、Xiaolan、Guangdong、Cologne、Remagen、Lima、Buenos Aires（日语用片假名，俄语用西里尔，阿拉伯语用阿文，其余拉丁字母语种通常保留原拼写）。
6. 只说源文本说了的。缺数据就说缺、说怎么拿到，不写「详情请联系我们」。
7. 标题给判断，不给栏目名。H1 可以按本语种的习惯重新组织，但意思要一致。
8. 认证段落**一个字都不能夸大**：报告只覆盖它写明的型号；「CE 和 ANSI 测试正在准备」不能写成「已通过」。
9. `meta.title` 20–45 个字符（布局会追加 " | Canton Hyland"）；`meta.description` 80–160 个字符，完整的一到两句，不截断。首页 `meta["/"].title` 也一样。
10. `common.modelsCount` 保留 `{n}` 占位符，构建时替换成数字。`certifications.records[].issuer / reference / coversModel` 原样照抄，`issued` 日期按本语种格式写。`home.flagship[].slug` 和 `categories` 的键（slug）原样照抄。

## 各语种额外注意

- **阿拉伯语**：页面是 RTL，工程已处理；文本里出现的拉丁型号、单位和邮箱不用做任何标记。用 MSA，不用方言；不用东方阿拉伯数字。
- **日语**：`scripts/audit-no-chinese.mjs` 会检查连续 7 个以上汉字（无假名）的片段，正常日语不会触发；不要写纯汉字长串。全角标点。
- **韩语**：谚文为主，行业外来语用惯用的外래어 표기법；数字后单位不加空格按韩语习惯亦可，但要全站一致。
- **俄语**：`«кавычки»`，单位前不间断空格习惯可以写普通空格；公司作为「мы」。
- **土耳其语**：单位空格 `60 mm`，千分位用点 `5.000`。
- **德语**：复合词优先（Einsteckschloss 不是 Einsteck-Schloss，除非可读性需要）。千分位用点，`5.000 Stück`。
- **法语**：法式标点（`:` `;` `!` `?` 前有不间断空格 ` `），千分位用不间断空格 `5 000`。

## 验收

- `npm run typecheck` 通过（字段齐）。
- `node scripts/audit-market-copy.mjs`：无残留英文句子（型号、标准、品牌除外），meta 长度在范围内，`{n}` 占位符在。
- 母语审校：阿、土、俄、日、韩五种建议抽查（`2026-09-24-language-expansion-prep.md` 第三节）。
