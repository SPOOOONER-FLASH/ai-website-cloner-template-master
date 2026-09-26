# 2026-09-25 · Claude · 删六个死键；Electroplating 统一；审计加「近似键」检查

多语言会话报了两个死键。删的时候顺着查出我自己 09-24 造成的一处分裂，以及差点再犯一次同类错误。

## 删掉的死键（每条都先核过全目录 0 引用）

| 文件 | 键 | 为什么死了 |
|---|---|---|
| es | `"Electroplatingbhgh."` | 粘贴残留，记录已于 09-24 修正 |
| es | `"Fabricada en lámina de acero 1.2 mm…/Iron."` | 英文字段里混进的西语原文，记录已清 |
| es | `"living room, bathroom"`、`"living room,bathroom..."` | 我 09-24 统一英文写法后作废 |
| pt | `"bathroom, living room"`、`"wall-mount"` | 同上 |

pt 侧没有前两个键——那两处只是注释在说明为什么不给它们建键。

## 我自己造成的分裂：同一个工艺，两个西语词

`HY006DK` / `HY006ET` 的 `Surface Treatment` 是 `"Electroplating"`，`HY008` 是
`"Electroplating."`——**只差一个句点**。我 09-24 给前者加键时只查了术语表、没查后者已有的
审校写法，于是：

    HY006DK / HY006ET   Electrodeposición     ← 我加的
    HY008               Galvanoplastia        ← 审校原有

同一个工艺、三个产品、两个词，而原因只是一个句点。按「采用审校已有的写法」统一为
**Galvanoplastia**（葡语同理，`Eletrodeposição` → `Galvanoplastia`），并把 `HY008` 英文的
句点去掉，三条记录现在共用一个键。

## 差点又犯一次：干跑报了未映射，我却先写了盘

重新生成这三条时，干跑报「1 distinct term left in English」——
`Aluminum narrow-stile door lock bodies`，因为这几条的英文值在被审校之后改过名，术语表没跟上。

**我没有先补键就写盘**，结果把审校写的
`Cuerpos de cerradura para puertas de aluminio de perfil estrecho` 退回成了英文。
已 `git checkout` 还原，从 `HEAD` 收割出西葡译文补进术语表，确认干跑 0 未映射之后才重写。

**教训：干跑报了未映射就必须先补键再写盘。那行报告存在的全部意义就是拦住这一步。**
这是我第二次在同一天从另一个角度撞上同一堵墙。

## `copy:drift` 加了第二段：近似键

`audit-glossary-drift.mjs` 原来只比对**标签**与页面。Electroplating 那次它是干净的——
两个键都存在，翻译器不会报，标签也没问题。**近似键是精确匹配式术语表的盲点**：
它们不是随时间漂移的，是一出生就分开的，只能靠键与键相比才看得见。

新增的第二段找「英文键只差标点或大小写、译文却实质不同」的成对键。
比较译文时同样做归一化，所以 `Aluminum`/`aluminum` → `Alumínio`/`alumínio` 这种
**大小写镜像不会误报**（那是生成器在正确地跟随英文大小写）。

## 还剩 4 处真实分歧，没有自行决定

删完死键后审计仍报 4 处，都是活的，都需要术语判断而不是机械修正：

    es  "Nickel-plated brass, solid brass, brushed nickel"  → 「…, níquel cepillado」
        "Nickel-Plated Brass, Solid Brass, Brushed Nickel"  → 「… o níquel cepillado」   587 系列各 3 条

    pt  "Single door" (306-S)      → Porta simples
        "Single Door" (300/310/316-S) → Porta de uma folha

    pt  "Double door" (306-D/GL125 SS) → Porta dupla
        "Double Door" (316-D/320)      → Porta de duas folhas

    pt  "For privacy doors" (LH855)  → Para portas de banheiro
        "For Privacy doors" (LH852)  → Para portas de condena

最后一条**两个词意思不同**——`banheiro` 是房间，`condena` 是锁的功能——所以它不是风格问题。
而葡语术语的归属还在等 `docs/copy/style-guides/pt-br.md §5` 的巴西买家答复，
**不该由我单方面定**。已发给对应车道。

前三组的根因都一样：**英文同一个值写了两种大小写**。真正的修法是先统一英文，
再一个键一个译文——但那会动到英文站显示和标题，属于另一次改动。

## 测试

`spec-table-parity`、`regional-terms`、`portuguese-brazilian`、`hardware-terms`、
`us-spelling` 共 10 项通过。`copy:drift` 标签段 0，`copy:prose --check` 干净。
