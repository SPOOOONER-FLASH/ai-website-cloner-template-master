import type { NewsArticle } from "./types";
import { guides as generatedGuides } from "./generated/guides";
import { GUIDES_WITHOUT_ES, GUIDES_WITHOUT_PT } from "./generated/guide-locales";
import { applyImageAltOverride, applyImageAltOverrides } from "./image-alt-overrides";

/**
 * 指南栏目 —— 买家该怎么判断，而不是这家工厂发生了什么。
 *
 * ---------------------------------------------------------------------------
 * 为什么另开一个集合而不是复用 /news/
 *
 * 甲方 2026-09-21：「之前是无头苍蝇写的，就放在那，新开栏目叫 guide，
 * 这 20 放进去，以后这种 seo geo 文章放到 guide 里面，不要挪现在的 35 篇了。」
 *
 * 这个决定比搬家好，而且理由是可验证的：那 35 篇的 URL **正在被引用**。
 * 2026-09-20 的 Clarity 读数里，全部 33 条 AI 引用落在 /news/ 下的八个页面上，
 * 其中 push-bar-or-touch-bar-panic-exit-devices 一篇占 10 条。把它们搬走，
 * 301 能接住大部分（2026-09-18 的报告实测 8% 的引用就是靠 301 活着的），
 * 但换来的是几天的抖动和零收益。
 *
 * ---------------------------------------------------------------------------
 * 两个栏目的分界线
 *
 *   /news/    这家工厂发生了什么，以及为了回答一个具体问题而写的短文
 *   /guides/  买家在决定之前要查的东西：尺寸表、代码对照、标准范围、选型判断
 *
 * 类型是同一个 NewsArticle，因为形状确实相同 —— 分的是**集合**，不是数据结构。
 * 新增一个类型只会让 JsonLd、NewsDetail 和三语路由各分叉一次，换不到任何东西。
 *
 * ---------------------------------------------------------------------------
 * 这一批的写作标准（2026-09-21 两周计划）
 *
 *   整页可抓取英文词数 ≥ 1,600（摘要 + 正文 + FAQ，引擎看到的口径）
 *   FAQ 6 条
 *   标题带年份与规范号
 *   公制 + 英制双单位
 *   三语齐全
 *   **每一个数字都要能指回一个公开来源，来源写进文章**
 *
 * 最后一条是纪律不是格式。抄一张表不写来源，和对手抄别人的目录是同一件事，
 * 只是抄的对象不同 —— 而「说得出处」是我们相对他们唯一的结构性优势。
 */

export const guides: NewsArticle[] = generatedGuides.map((article) => ({
  ...article,
  heroImage: applyImageAltOverride(article.heroImage),
  gallery: article.gallery ? applyImageAltOverrides(article.gallery) : undefined,
}));

/**
 * 同 getPublishedNews 的两条过滤：草稿永不构建，未来日期在那天之前不出现。
 * 静态导出没有请求时逻辑，所以这两条都只能在构建时生效 —— 设了未来日期的人
 * 要负责在那天再跑一次构建。
 *
 * 最新在前，同日按 slug 排，这样构建顺序稳定而不依赖文件系统。
 */
export function getPublishedGuides(today = new Date()): NewsArticle[] {
  const todayIso = today.toISOString().slice(0, 10);

  return guides
    .filter((article) => !article.draft && article.publishedAt <= todayIso)
    .sort((a, b) =>
      a.publishedAt === b.publishedAt
        ? a.slug.localeCompare(b.slug)
        : b.publishedAt.localeCompare(a.publishedAt),
    );
}

export function getGuideBySlug(slug: string): NewsArticle | undefined {
  return guides.find((article) => article.slug === slug);
}

/**
 * 只覆盖已发布的，草稿因此没有页面可以被 URL 猜到。
 *
 * es / pt 只产出已有该语种译文的指南（2026-09-22：先写英文、译文另批）。判断与
 * hasSpanishMirror / hasPortugueseMirror 同源 —— 都读 generated/guide-locales.ts ——
 * 所以页面、sitemap、hreflang 和语言切换不会各说各话。
 */
export function getAllGuideParams(locale: "en" | "es" | "pt" = "en"): { slug: string }[] {
  const lacking = locale === "es" ? GUIDES_WITHOUT_ES : locale === "pt" ? GUIDES_WITHOUT_PT : [];
  return getPublishedGuides()
    .filter((article) => !lacking.includes(article.slug))
    .map((article) => ({ slug: article.slug }));
}
