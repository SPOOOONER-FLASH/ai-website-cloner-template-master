# 2026-09-25 · Claude · 英文规格值修四处；「N」不是多余的，别删；把还原文案字段做成脚本

工程会话转来一批英文规格值问题（七语种翻译时发现的）。改了四处，**驳回一处**，一处进工厂清单，
一处找不到。

## 改了

    BH01      Length    "…/500m/…"   → "…/500mm/…"     一串 mm 尺寸里混了个 m
    DS05      Size      "ф44×24mm"   → "Ø44×24mm"      ф 是西里尔字母 U+0444，不是直径符号
    AR4-1121  Backset   "40"         → "40mm"          缺单位
    AR4-1121  Faceplate "25 × 140"   → "25 × 140mm"    同一条记录同一个毛病，转来的清单没提

`Ø` 是本目录既有的写法（`Ø` 2 次，西里尔 `ф` 仅此 1 次）。

## 驳回：「N」是真实的饰面代号

转来的说法是 `DV05` / `DV05 BL` / `DV06` 的饰面串里「多一个单独的 N」。**不是多的。**
它登记在 `src/data/finish-codes.ts`：

    code: "N",  evidence: "unconfirmed"
    note: "A single letter, on five records. Too short to guess from —
           Nickel, Natural and Nylon are all live in this catalog's vocabulary."

也就是说**早就知道它可疑，而且已经在待问工厂的清单里**——`FACTORY_GAP_SHEET` 第一节
「未确认订货代码」那五个正是 `N KT IK PT BS`。删掉它会从五个产品上抹掉一个真实存在、
只是尚未确认名称的饰面。

另外是 **5 条不是 3 条**（还有 `DV08`、`DV08 SN`）。

值得记下的判据：**这个目录里不带括号的裸代号是常态，不是异常**——
`SS` 11、`NB` 11、`CB` 11、`BC` 11、`BP` 7、`GP` 5、`N` 5、`BN` 3、`BRN` 3。
所以「饰面串里有个孤零零的短代号」本身不能作为判断依据。

## 进工厂清单：LC9045，两边证据都记下来

没有自行修改（转来的要求也是如此）。但它不是一眼能判的，两边证据都记在这里：

- **支持「写反了」**：其他 LC 型号编码是「中心距+背距」——`LC05 8560` 是 85/60、
  `LC8520` 是 85/20、`LC8535` 是 85/35。照此 `LC9045` 应是中心距 90、背距 45，
  而记录写的是中心距 45、背距 90，正好相反。
- **支持「现在是对的」**：记录内部自洽。`Backset = 90mm` 与同表的
  `Faceplate to cylinder center = 90mm` 相等——锁体里锁芯与方轴通常在同一进深，这两个数本就该相等；
  再加 `Cylinder center to back = 45mm`，锁体总深约 135mm，说得通。

所以问工厂时应当**直接问这一条**：「LC9045 的背距是 90 还是 45？中心距呢？型号里的 9045 指哪两个数？」
而不是笼统问「是不是写反了」。

## 没找到

转来的说法是「有一条 specValue 是西语原文」。扫了全部 HYDE 记录的英文 `specs`，
用西语常见词（de/con/para/acero/latón/inoxidable/puerta/cerradura/regulable…）匹配，**0 命中**。
可能在别的字段或别的语种字段里。已回问多语言会话要型号和标签名。

`Electroplatingbhgh.` 昨天已修（`HY006DK` / `HY006ET` 的 `Surface Treatment`，粘贴残留），
现在全目录 0 处。

## 把「还原文案字段」做成了仓库里的脚本

`scripts/restore-prose-fields.mjs`（`npm run copy:prose`，另有 `--check`）。

这段逻辑我这两天一直在用，但它活在 `$TEMP` 里，**今天跑到一半被清掉了**，重新生成的
`summaryEs` / 葡语 SEO 就那样留在工作区里，差一点跟着提交。它现在是仓库里的脚本，
带着它存在的理由。

规则本身对所有动规格的人都成立，不只是我：两个翻译器是**整条记录重写**的，改一行规格
会顺带重写 `summary*` 和四个 SEO 字段，而那些字段不是规格车道的——
`summary*` 归文案会话，`seoTitle*` / `seoDescription*` 归工程会话——全量跑还会把 240 条
`summaryEs` 压成组装器残句。所以动规格的正确顺序是三步不是一步：

    node scripts/translate-products-es.mjs --only "<models>" --write
    node scripts/translate-products-pt.mjs --only "<models>" --write
    node scripts/restore-prose-fields.mjs

**即使只改了三条记录也要跑第三步**——重写是按记录发生的，三条记录足够丢三条摘要。

脚本按 HEAD 比对，所以自己有意改的文案要先提交，否则会被放回去。这既是它的用处，也是它的代价，
注释里写明了。

## 测试

`spec-table-parity`、`regional-terms`、`portuguese-brazilian`、`product-dashes`、
`hardware-terms`、`us-spelling` 共 11 项通过。
`npm run copy:drift` 与 `npm run copy:prose --check` 均干净。

## 交接

改了规格值，**标题里的尺寸是从规格行取的**，需要工程会话重跑标题。
