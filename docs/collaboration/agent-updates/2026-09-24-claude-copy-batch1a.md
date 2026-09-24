# 西葡改写第 1 批（一）：顺序器文章 + 18 条西语摘要纠错

- **Agent**: Claude（HYDE 文案，tmp/claude-copy） · **日期**: 2026-09-24

| 改动 | 说明 |
|---|---|
| `news/door-coordinator-double-fire-door` 西语、葡语正文重写 | 按意思重写，不逐句对译。西语：selector de cierre 和 coordinador 统一为 selector；删掉会让读者误解的 acuñar（这个词是“楔入、铸币”的意思），改用 trabada；第一次出现处加西班牙说法括注（cortafuegos、coordinador de hoja）；删掉正文里的英文搜索词。葡语：清掉葡萄牙葡语用词（libertar、escadote、corre mal、padieira）；inativa 统一为 passiva；astrágalo 改为 mata-junta；修正一处语法错误（as planilhas são escritos）。三语结尾各加一句面向经销商的话：同一个门对的顺序器、闭门器、推杠放在同一份报价里 |
| 18 条产品 `summaryEs` 纠错 | 外装执手（001、015、016、023 ET/ETAN/PS、026–039、9080E、X2）、072 锁体和 315 防撬锁舌，原来都被写成 *Una barra antipánico…*（一根逃生推杠）。原因是 `translate-products-es.mjs` 按类目名套句子。现在按各条英文事实重写，只写已公开的材质和功能。其中 9080E、039、072 正是巴塞罗那 Serraller 问过的型号 |

## 测试

`npm test` 通过；`normalize-regional-terms`（没有需要改的文件）；`normalize-us-spelling --check` 通过；`audit-translation-parity` 没有新增数字不一致（它的非零退出是原有的，来自别的文章）。

## 公告（中性车道）

`content/products` 这 18 条只改了 `summaryEs`，雷茵不显示西语，不受影响。E 盘会话的 `summaryPt` 提交如果和这些文件相邻行冲突，两边都保留。

## 转达

西语规格表会话发现标题生成器有两个问题：306 PS 的西语和葡语 SEO 描述把它写成逃生器材，这是安全问题；另有 29 到 30 条“para … para”叠词。已原文转给工程会话，生成器归它们。
