/**
 * 在**渲染时**给英文页面的公制尺寸配上英制等值。
 *
 * ---------------------------------------------------------------------------
 * 为什么不改 content/products
 *
 * 那 891 条含毫米的规格行是工厂发布的值，也是尺寸线图、测试记录和开孔图的
 * 事实源头。把英制写进 JSON 会带来三个问题：工厂改一个数时括号里的旧英寸
 * 不会跟着改；西语葡语的镜像会被污染；而 `npm run content:*` 那一批生成器
 * 重跑时会把它抹掉或翻倍。
 *
 * 换算是**表现层**的事，不是数据。在这里做，数据一个字节都不动，
 * 工厂改了值下一次构建自动跟上。
 *
 * ---------------------------------------------------------------------------
 * 为什么只给英文
 *
 * 2026-09-21 读四个对手时实测：我们输掉的机会簇榜上是 usglassmag、allegion、
 * usmadesupply、fairfaxcounty.gov —— 全是美国站，全用英寸。一个用英寸提问的
 * 买家够不到一张只有毫米的表。西语和葡语市场用公制，给他们补英寸是噪音。
 *
 * ---------------------------------------------------------------------------
 * 精度
 *
 * 最接近的 1/16 英寸 —— 美国五金规格书用的精度。不是四舍五入到小数，
 * 因为没有人在采购单上写 2.36 英寸。
 */

/** 最接近 1/16"，按美国五金规格书的写法：`2-3/8"`、`5/16"`、`3"`。 */
export function mmToImperial(mm: number): string | null {
  if (!Number.isFinite(mm) || mm <= 0) return null;
  const sixteenths = Math.round((mm / 25.4) * 16);
  if (sixteenths === 0) return null;
  const whole = Math.floor(sixteenths / 16);
  let num = sixteenths % 16;
  let den = 16;
  while (num % 2 === 0 && num > 0) {
    num /= 2;
    den /= 2;
  }
  if (num === 0) return `${whole}"`;
  return whole === 0 ? `${num}/${den}"` : `${whole}-${num}/${den}"`;
}

/**
 * 规格值里的毫米，原样保留，后面追加一个括号。
 *
 * 处理的形状全部来自目录里真实出现过的写法：
 *
 *   `65mm`              → `65mm (2-9/16")`
 *   `300 × 75mm`        → `300 × 75mm (11-13/16" × 2-15/16")`
 *   `Ø32mm`             → `Ø32mm (Ø1-1/4")`
 *   `Up to 80mm`        → `Up to 80mm (3-1/8")`
 *   `45 / 50 / 55mm`    → 每个数各自换算
 *
 * ⚠ 已经带括号的值不再处理，所以这个函数是幂等的 —— 万一哪天有人把英制写进了
 * 数据里，这里不会再套一层。
 */
export function withImperial(value: string): string {
  if (typeof value !== "string") return value;
  if (!/\d\s?mm/i.test(value)) return value;
  // 值里已经有英寸，说明来源已经写了，不重复。
  if (/["″]|inch/i.test(value)) return value;

  /*
    ⚠ 合页代号一律不碰，这是这个文件里最重要的一条。

    `6*3*3mm` 看起来像三个毫米值，实际是**混合单位**：按合页的行业约定，
    前两段是英寸（页片长 × 宽），只有第三段的厚度是毫米。
    2026-09-11 那次核对写得很清楚：`4x3x3.0-4BB` 算出来是 101.6 × 76.2 毫米 ——
    也就是 4 英寸 × 3 英寸。

    把 `6*3` 当毫米换算会产出 `(1/4" × 1/8")`，而真值是 6" × 3"。
    一个错二十四倍的尺寸会被买家照着开孔。

    三段及以上用 × / x / * 分隔的值一律原样返回。这不是保守，是因为
    这类代号的单位约定写在代号之外，而我们在这里读不到它。
  */
  const separators = (value.match(/[×xX*]/g) ?? []).length;
  if (separators >= 2) return value;

  /*
    先抓「A × B mm」这种成对尺寸，整组换算成一个括号。
    拆成两个括号会读成两个不相干的数，而板尺寸是一个事实。
  */
  const pair = value.match(/(\d+(?:\.\d+)?)\s*[×xX*]\s*(\d+(?:\.\d+)?)\s?mm/);
  if (pair) {
    const a = mmToImperial(Number(pair[1]));
    const b = mmToImperial(Number(pair[2]));
    if (a && b) return `${value} (${a} × ${b})`;
  }

  /*
    范围整组换算，两端都给。

    第一版漏了这一条，产出的是 `2.0-3.5mm (1/8")` —— 只有紧跟 mm 的那个数被
    匹配到，读起来像整个范围等于 1/8"。一个范围塌成单值比没有换算更糟：
    买家会以为 2.0mm 和 3.5mm 都是 1/8"。
  */
  const range = value.match(
    /(\d+(?:\.\d+)?)\s*(?:-|–|—|to|a)\s*(\d+(?:\.\d+)?)\s?mm/i,
  );
  if (range) {
    const lo = mmToImperial(Number(range[1]));
    const hi = mmToImperial(Number(range[2]));
    if (lo && hi) return lo === hi ? `${value} (${lo})` : `${value} (${lo} to ${hi})`;
  }

  const numbers = [...value.matchAll(/(\d+(?:\.\d+)?)(?=\s*(?:\/|,|\s|$|mm))/g)]
    .map((m) => Number(m[1]))
    .filter((n) => Number.isFinite(n) && n > 0);

  const unique = [...new Set(numbers)];
  if (!unique.length) return value;

  const converted = unique.map(mmToImperial).filter(Boolean) as string[];
  if (!converted.length) return value;

  // 直径符号跟着走：Ø32mm 的英寸也是一个直径。
  const diameter = /[Øø⌀]/.test(value);
  const rendered = converted.map((c) => (diameter ? `Ø${c}` : c)).join(" / ");
  return `${value} (${rendered})`;
}

/** 只有英文页面加括号。见文件顶部注释。 */
export function specValueFor(value: string, locale: string): string {
  return locale === "en" ? withImperial(value) : value;
}
