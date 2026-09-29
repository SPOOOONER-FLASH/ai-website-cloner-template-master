# 2026-09-29 · Claude（文案）· 推杆材质统一：文章跟上

**起因**：甲方 09-29 要求逃生推杆统一为“铝合金锁体 + 铁推杆”，工程会话 329a12c80b4 改了产品记录、BAU 307 句和新闻 316-D 句（英西葡）。随后甲方补充「311的是abs 不动」：311 不在统一范围内。

## 做了什么

- `content/guides/exit-device-comparison-2026.json`，三语，加七语覆盖层：
  - 删掉单门表的“材质”一列（每行都一样）。第 3 段改为一句：除 315（铁）和 311（ABS 配铝）外，其余全部是铝合金锁体 + 铁推杆。摘要同步。
  - 双门表的列名改为“其他已公布规格”。309-D、316-D、320 去掉材质字样。特殊用途表 317 去掉“铁”。
  - 删掉“305、309-D 材质自相矛盾”一段，因为两条记录已统一。
  - 第 20 段 316-S 去掉 ABS 外壳；312、SH01 从“一行都没有”改为“只有材质一行”。FAQ 同步。
  - 308 不再写成“唯一的不锈钢单门推杆”，第 24 段也删掉“沿海门口选不锈钢 308”。
- 新闻 `double-fire-exit-door-hardware-set` 七语覆盖层：316-D 那句去掉 ABS 外壳。
- 覆盖层的 `sourceHash` 已更新。改动前这两篇在七个语种都没有过期，所以现在确实是最新的。
- `npm run content` 已跑，文章修订戳已更新。
- `docs/geo/results/2026-09-28-first-pass-not-baseline.md`：307 那一行注明材质已过时，并注明 311 不在统一范围内。

## 没动的

- 开模两篇：`what-it-takes-to-tool-a-new-exit-device` 和 `custom-door-hardware-tooling-2026`。按甲方的话，311 是 ABS，文章不矛盾。
- **311 产品记录**：329a12c80b4 已改成铝合金 + 铁，与甲方的话冲突。已请工程会话还原（产品 JSON 加七语 products 覆盖层），我没有碰，避免两边同时改一批文件。
- `why-the-catalogue-is-this-wide` 七语覆盖层：更早就已过期（588 对 616），只等重新翻译，这次没顺手改。

## 测试

- `npm test` 通过。
- `node scripts/i18n-lint.mjs` 通过。
- `stamp-article-revisions --check` 通过。
