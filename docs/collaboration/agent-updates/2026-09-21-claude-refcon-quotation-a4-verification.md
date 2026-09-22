# 2026-09-21 · Claude · REFCON 报价单 + 修好一个假的「A4 已验证」

## 范围

| 文件 | 动作 |
|---|---|
| `docs/quotations/refcon-20260921.json` | 新增：REFCON（沙特利雅得）两款三点式推杆 |
| `scripts/verify-quotation-a4.ps1` | 新增：A4 单页验证，不依赖打印机 |
| `docs/quotations/{novalux-sa,show-de-cadeiras,refcon}*.json` | `outFile` 改到 `Desktop/hyde/报价/`（甲方已把报价单归到该子目录） |

交付物在 `~/Desktop/hyde/报价/`，**不进仓库**（含客户信息）。

## 一、之前那句「A4 已验证」是假的

9-01 和 9-02 两份报价单我报告过「A4 已验证，Excel COM 导出 PDF 后 `Pages.Count == 1`」。
**只验了页数，没验纸张。** 这台机器上所有打印机默认 Letter，
`PageSetup.PaperSize` 读回来是 9（xlPaperA4），Excel 实际却按 Letter 排版，
`ExportAsFixedFormat` 写出的是 612×792pt。我当时量的是 Letter 上的一页。

Letter 比 A4 **宽 6.1mm、矮 18mm**，所以 Letter 一页不蕴含 A4 一页 —— 宽度是这套版式的
约束边（`fitToWidth=1`），Letter 更宽意味着它是更宽松的测试。

`Set-PrintConfiguration -PaperSize A4` 需要管理员权限，这里拿不到。

### 用的办法：把 Letter 的版心调成 A4 的版心

本模板 A4 版心（左右 0.25″、上下 0.4″）= 7.768″ × 10.893″。
在 Letter 上左右 0.366″、上下 0.0535″ 得到**同一个矩形**。版心相同，分页行为就相同。

三份全部 `PASS 1 page, no vertical break`，包括补验的前两份 —— 结论没变，但现在是量出来的。

```powershell
powershell -File scripts/verify-quotation-a4.ps1 "<xlsx>" ["<xlsx>" ...]
```

脚本在副本上跑并以不保存关闭，不改版式。

### 顺带修掉一个假绿

第一版脚本遇到不存在的文件时让 `Resolve-Path` 抛错然后继续，结果：
唯一存在的那份打印 `PASS`，`$LASTEXITCODE` 仍是 0 —— 读起来就像「三份都验过了」。
现已改为 `Test-Path` 判空即计 FAIL，实测 `exit=1`。
（与 AGENTS.md「返回 0 不等于做成了」同一类。）

## 二、REFCON 这一单

- 买家：REFCON = Refrigerated Containers Industrial Co.，利雅得，做冷库夹芯板 / 冷藏箱 /
  电信机房。这解释了甲方照片里推杆装在**白色夹芯板门**上。
- 型号从甲方自己的照片对到目录真实记录：黑体红杆上下拉杆 → **330**；
  银色装在夹芯板门上 → **302**；黑色外执手带欧标锁芯 → **016**（未报价，只在备注提及）。
- 「3 points」是甲方原话且照片可见，目录记录本身没有写点位数，**没有替目录发明规格**。
- 价格照甲方给的：330 = 18.90、302 = 10.44；MOQ/OEM 逐型号写在规格栏（两者不同）。

### ⚠ 一个没解决的歧义，已写进报价单正文

甲方原话「这个价格 usd10.44/PC」没有指名对象。照片顺序上它既可能指 302 银色推杆，
也可能指 016 外执手。当前按 **302** 出，并在 NOTES 第一条明写 OPEN QUESTION 请甲方确认。
**发给客户前必须先定这一条。**

一个反直觉点支持「需要确认」：302 是不锈钢+铁，却比铁制的 330 便宜 45%。不合常理，
但价格是甲方给的，这边不擅自调整。

### 一条顺带的商务观察（已写进 NOTES）

按 MOQ 300+300 算，订单额 USD 8,802 < 10,000 —— 按甲方自己的规则会**落到 EXW**，
拿不到 FOB。这是算出来的，不是猜的。

## 三、链接

3 条全部实测 200（`/products/panic-exit-devices/{302,330}-panic-exit-device/` 与首页）。
`verify_product_links`（9-21 早些时候加的）在出单时已先对 `out/` 核过一遍。

## 未动

`out/`、`out-rayen/`、`content/**`、`src/**`、NOW.md 里 Codex news studio 认领的路径。
未构建、未部署 —— 本次改动不影响站点产物。

## 下一步

1. **甲方定 10.44 归属**，我改一行重跑。
2. 016 外执手要报价的话，给数量即可加行。
3. 317（冷库低背推杆）与 REFCON 主业直接相关，值得主动推一次。
