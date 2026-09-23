/**
 * 雷茵与 HYDE 的分界线：哪些路径属于哪一边。一处定义，提交钩子和发布脚本共用。
 *
 * 甲方 2026-09-23：「雷茵和 hyde 请设立一个墙或者分界线，让两边不要互相干扰，各自独立
 * 工作推送部署，必须设置一个好办法。」
 *
 * 为什么是三类而不是两类：两站在同一个 Next 应用里构建，587 个产品记录两站共用（没有
 * `sites` 字段），组件、库、package.json 也共用。把共用的东西硬划给某一边，另一边就改不了
 * 自己要用的数据。所以共用的归「中立」—— 谁都能改、墙不拦；墙只拦「一个提交同时动了两站
 * 各自独占的文件」。今天出过的两种事故都属于这一种：一次全量构建把 out/ 和 out-rayen/
 * 一起提交，带走了另一边正在做的东西。
 *
 * 加新的独占路径：改这里，别处不用动。
 */

/** 只属于雷茵。HYDE 这边的人不改、不提交。 */
export const RAYEN = [
  /^out-rayen\//,
  /^content\/rayen\//,
  /^src\/app\/zh\//,
  /^src\/app\/zh-en\//,
  /^src\/components\/rayen\//,
  /^src\/data\/rayen[^/]*$/,
  /^src\/data\/generated\/rayen[^/]*$/,
  /^src\/lib\/rayen[^/]*$/,
  /^scripts\/[^/]*rayen[^/]*$/,
  /^scripts\/catalogue-cutters\/[^/]*rayen[^/]*$/,
  /^public\/images\/products-rayen[^/]*\//,
  /^public\/images\/rayen\//,
  /^public\/search-index-rayen[^/]*$/,
  /^public\/downloads\/rayen[^/]*$/,
];

/** 只属于 HYDE（cantonlock.com）。雷茵那边的人不改、不提交。 */
export const HYDE = [
  /^out\//,
  /^src\/app\/\(en\)\//,
  /^src\/app\/es\//,
  /^src\/app\/pt\//,
  /^content\/news\//,
  /^content\/guides\//,
  /^public\/images\/products-hyde\//,
  /^public\/search-index\.json$/,
];

/** 'rayen' | 'hyde' | null（中立：共用源码、产品数据、配置、文档）。 */
export function laneOf(path) {
  const p = path.replace(/\\/g, "/");
  if (RAYEN.some((r) => r.test(p))) return "rayen";
  if (HYDE.some((r) => r.test(p))) return "hyde";
  return null;
}

/** 每条发布线提交哪个输出目录。 */
export const OUTPUT_DIR = { hyde: "out", rayen: "out-rayen" };
