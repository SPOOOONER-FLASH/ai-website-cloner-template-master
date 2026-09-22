/**
 * 每个品类一句「这东西装在哪、给谁用」。
 *
 * ---------------------------------------------------------------------------
 * 为什么需要这个文件
 *
 * 客户 2026-09-22 说的一句话是对的:**买家不认识我们的型号。**
 *
 * 数据也证实了:392 条真实查询里,纯型号查询只有 61 条、合计 176 次展示,而全站
 * 展示是 2,217。`patch fitting` 排第 1 名零点击 —— 那根本不是型号搜索,是一个
 * 不知道我们是谁的人在找一类产品,而我们那条标题没有告诉他这东西是干什么的。
 *
 * 逐产品的场景数据太薄:doorTypes 只有 36%,Application 26%,features 23%。
 * 但**品类是 100%**,而且品类本身就是场景 —— panic-exit-devices 就是消防疏散,
 * floor-springs 就是商业玻璃门厅,bathroom-accessories 就是酒店卫浴。
 *
 * 所以这里写 40 条,不写 924 条。
 *
 * ---------------------------------------------------------------------------
 * 写作规则
 *
 * `use` 进标题,必须短(英文 ≤ 26 字符),而且必须是**这个品类的常规用途**,
 * 不是对某一个具体型号的断言。「for Fire Escape Doors」对整个 panic-exit-devices
 * 品类为真;「EN 1125 certified」不为真,因为我们的 307/311 还在送检。
 *
 * `pitch` 进描述,可以长一点,讲这个品类买家真正在乎的那件事 —— 性能、维护、
 * 装配、采购。同样不许出现未经核实的等级、认证或寿命数字。
 *
 * 一条红线:这里写的是**用途**,不是规格。规格来自产品自己的 specs 行。
 */

import raw from "./category-positioning.json";

export interface CategoryPositioning {
  /** 进标题的短用途短语。不带前置介词以外的修饰。 */
  use: string;
  useEs: string;
  usePt: string;
  /** 进描述的一句卖点。说买家在乎的事,不说我们想说的事。 */
  pitch: string;
  pitchEs: string;
  pitchPt: string;
}

/**
 * 数据存在同名的 .json 里,不是因为好看,是因为 scripts/build-product-titles.mjs
 * 是 Node 脚本读不了 TypeScript。两边读同一份文件,才不会出现「页面上写的用途和
 * 标题里写的用途不一样」这种事。
 */
export const CATEGORY_POSITIONING = raw as Record<string, CategoryPositioning>;

/** 取一个品类的定位,没有登记就返回 null(标题退回只用规格的格式)。 */
export function positioningFor(categoryPath: readonly string[] | undefined): CategoryPositioning | null {
  if (!categoryPath?.length) return null;
  const full = categoryPath.join("/");
  if (CATEGORY_POSITIONING[full]) return CATEGORY_POSITIONING[full];
  // 子品类没登记就退到父品类
  const parent = categoryPath[0];
  return CATEGORY_POSITIONING[parent] ?? null;
}
