# 2026-09-28 · Claude · 作者照片进署名与 Person 结构化数据

甲方 2026-09-28 提供了 Johnson Liu 本人的真实照片（388×466 PNG）。

## 放在哪

    public/images/people/johnson-liu.webp           384×384  12.7 KB  方形裁切
    public/images/people/johnson-liu-portrait.webp  388×466  18.4 KB  原始比例

用 `sharp`（仓库已有依赖）转成 webp，与站上其他图片一致。方形是从顶部裁的，脸居中而不是胸口居中。
产品图的水印流程只覆盖 `public/images/products`，人物照片不经过它。

## 怎么用

**不是给 82 条记录每条加一个 `image` 字段。** 作者信息在 82 篇文章里各存一份（姓名、职位、学历、
主页），再加一个路径就是 82 份拷贝，换照片那天会有 81 处对、1 处错。
改成 `src/data/author-portraits.ts` 按姓名查，一处即可。

- **文章署名**：姓名旁边 48×48 方形（DESIGN.md 的 2px 圆角），`alt=""` —— 名字就在旁边，
  读屏软件念两遍「Johnson Liu」比念一遍差。
- **Person 结构化数据**：`image` 字段。这是搜索引擎唯一能看见的那一半署名，
  也是甲方关心的「专业性」信号真正落地的地方。

`ArticleAuthor` 接口没有动，照片不是文章数据的一部分。

## 规则写进了代码

`author-portraits.ts` 的头部写明：只放真人实拍、由甲方提供、拍的就是署名那个人；
没有图库人像，也永远不生成人脸。理由和产品图那条一样——读者抓到一张编造的作者照，
会连带把学历和文章一起打折，而署名存在的全部意义就是承载那个信号。

## 还没做，等甲方给真实信息

**审稿人署名。** 技术指南若有工厂工程师真正审过，可加「审稿：某某，职位」并在 JSON-LD 写
`reviewedBy`。甲方说「正在要」。`NewsDetail.tsx` 的署名注释里本来就写着这件事：
「where a factory engineer reviews a piece a reviewer line can be added beside this —
empty until a real name exists」。拿到真实姓名和职位再加，不编。

## 待确认

甲方说的是「作者页加照片」，但站上**没有作者页路由**（`/authors/...` 不存在），
docs 里也没有相关计划。照片已经进了署名和结构化数据这两个确定的位置。
**要不要再建一个独立作者页**（十个语种各一页）是另一件事，已单独问甲方，没有擅自建。

## 测试

`npm test` 418 项、`lint` 0 error、`typecheck` 通过。
