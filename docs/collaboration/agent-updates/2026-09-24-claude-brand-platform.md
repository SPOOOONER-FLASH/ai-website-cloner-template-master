# 品牌平台：Hardware you can stand behind（首页宣言、产品页、九个家族）

- **Agent**: Claude（HYDE 文案，tmp/claude-copy） · **日期**: 2026-09-24

甲方：「这个立场不太对……你就是美国奥美广告文案总监，要给我们改头换面、全新升级，保持专业，但是要吸引人、打动人。」另外定了 D1：「用西班牙皇家学院词典」。

| 改动 | 说明 |
|---|---|
| `docs/copy/brand-platform.md`（新，全站文案最高依据） | 核心洞察：五金做得好的那天没人注意，一旦出事，接到电话的是卖它的人。主张：*Hardware you can stand behind.*（ES *Herrajes que dan la cara.* / PT *Ferragem que você assina embaixo.*）。另有品牌宣言、五根支柱、语气要求，以及 15 个栏目的三语标题 |
| 首页 `WelcomeIntro` 三语 | 标题 *Made in Xiaolan. Since 1998.*；正文是宣言，以“当您的名字印在上面，我们希望您睡得安稳”收尾（呼应老板说的“睡得安稳”）；删掉 *Total solutions to the building industry*；链接 *Careers* 改为 *About the company*；葡语清掉 *Planeamento*、*ligações* |
| 产品页 `products-architecture.ts` | 导语改为 *Everything a door needs…*；九个家族各配一句标题，再跟一句事实 |
| **核实过的事实** | 小榄“中国锁都”**不是官方称号**。官方称号是“中国锁业出口基地”（2004 年）；新华社报道小榄的锁出口占全国将近 30%。宣言只写有出处的“将近三分之一” |
| D1 | 记录在任务文件：斜舌用 pestillo（依据 RAE 词典）、方舌用 cerrojo、执手用 manija，不再用 picaporte。工程会话已把规则改成 resbalón → pestillo；术语表键归西语规格表会话，已通知。文章和页面文字由 Claude 逐处手改 |
| 雷茵 | 改写建议已发给“雷茵中文站方案设计”会话，本会话没有改雷茵 |

## 测试

`npm run typecheck` 通过。`npm test` 有三项失败，都在远端已经存在，不是本次引起的：
- `article-catalogue-claims`：规格数据补齐后，文章里的数量句过期。归本会话，已列为下一项（任务文件待办第 0 项）。
- `us-spelling`：报 `scripts/build-longtail-report.mjs`（工程会话的文件）。
- `zh-terms` 缺 *Cylinder split*（雷茵车道）。
