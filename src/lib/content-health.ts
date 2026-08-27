import { products } from "@/data/products";
import { projects } from "@/data/projects";
import { news } from "@/data/news";
import { categories } from "@/data/categories";
import { faqGroups, getUnansweredFaq } from "@/data/faq";
import type { Product } from "@/data/types";

/**
 * Content health, computed at build time from what is actually in the repository.
 *
 * This exists because the client asked for a UEESHOP-style overview dashboard. UEESHOP's
 * fills its cards with visitor counts and enquiry totals, which need a database and a
 * tracking pipeline this site does not have. Reproducing that layout with zeroes in it
 * would be a mock-up of a dashboard, not a dashboard.
 *
 * So the numbers here are a different quantity that we genuinely have: how complete the
 * catalogue is. Every figure is derived from content/, so it cannot drift out of date —
 * it is recomputed on every build.
 */

export interface HealthMetric {
  label: string;
  value: number;
  /** Denominator, when the figure is "n of m". */
  total?: number;
  /** What to do about it. Empty when nothing needs doing. */
  action?: string;
  tone: "good" | "warn" | "bad";
}

export interface HealthSection {
  title: string;
  description: string;
  metrics: HealthMetric[];
}

const isBlank = (s?: string) => !s || !s.trim();

function productIssues(product: Product) {
  return {
    noSpecs: product.specs.length === 0,
    noHero: !product.heroImage?.src,
    /*
      An image carrying a sourceNote is publishable but dated — the 2022 shoot has the
      cantonlock.com domain tiled across it. The client asked for these to go live rather
      than leaving a grey block, on the condition that the site can list them again when
      there is budget to re-photograph. This metric is that list.
    */
    datedImagery: [product.heroImage, ...product.gallery].some((image) => image?.sourceNote),
    noGallery: product.gallery.length === 0,
    modelTbc: Boolean(product.modelTbc),
    noMaterial: isBlank(product.material),
    noFinishes: product.finishes.length === 0,
    hasCertifications: product.certifications.length > 0,
    noSeo: isBlank(product.seoTitle) || isBlank(product.seoDescription),
  };
}

function tone(count: number, warnAt = 1, badAt = 20): HealthMetric["tone"] {
  if (count === 0) return "good";
  return count >= badAt ? "bad" : count >= warnAt ? "warn" : "good";
}

export function buildHealthReport(): HealthSection[] {
  const issues = products.map(productIssues);
  const count = (key: keyof ReturnType<typeof productIssues>) =>
    issues.filter((i) => i[key]).length;

  const total = products.length;

  /** Categories with nothing filed under them render as an empty page to a buyer. */
  const productsPerCategory = new Map<string, number>();
  for (const product of products) {
    const top = product.categoryPath[0];
    productsPerCategory.set(top, (productsPerCategory.get(top) ?? 0) + 1);
  }
  const emptyCategories = categories.filter((c) => !productsPerCategory.get(c.slug));

  const unansweredFaq = getUnansweredFaq();
  const draftNews = news.filter((n) => n.draft).length;
  const verifiedProjects = projects.filter(
    (p) => p.referenceStatus === "verified-project",
  ).length;

  return [
    {
      title: "产品目录",
      description: `共 ${total} 个产品。下面每一项都是「还差什么」，不是访问量。`,
      metrics: [
        {
          label: "规格表为空",
          value: count("noSpecs"),
          total,
          action: "详情页会显示「尺寸待确认」。补规格前采购商无法照着下单。",
          tone: tone(count("noSpecs")),
        },
        {
          label: "没有主图",
          value: count("noHero"),
          total,
          action: "列表和详情页都会显示占位方块。",
          tone: tone(count("noHero")),
        },
        {
          label: "图片是旧拍摄，待重拍",
          value: count("datedImagery"),
          total,
          action: "带 sourceNote 标记，多为 2022 年那批（图上有 cantonlock.com 水印）。重拍后替换即可，脚本按此字段定位。",
          tone: tone(count("datedImagery"), 1, 200),
        },
        {
          label: "没有图库（只有主图）",
          value: count("noGallery"),
          total,
          action: "详情页会显示「暂无更多视图」。",
          tone: tone(count("noGallery")),
        },
        {
          label: "型号待确认",
          value: count("modelTbc"),
          total,
          action: "这些产品不会把型号带进询盘表单，避免客户引用一个不存在的编号。",
          tone: tone(count("modelTbc")),
        },
        {
          label: "没填材质",
          value: count("noMaterial"),
          total,
          action: "配置区会显示「详情请咨询」。",
          tone: tone(count("noMaterial")),
        },
        {
          label: "SEO 标题或描述为空",
          value: count("noSeo"),
          total,
          action: "搜索结果里会由 Google 自己拼一句，通常不理想。",
          tone: tone(count("noSeo")),
        },
      ],
    },
    {
      title: "合规风险",
      description: "这一节的数字不为零不一定是错，但每一条都需要有人确认过。",
      metrics: [
        {
          label: "挂了认证声明的产品",
          value: count("hasCertifications"),
          total,
          action:
            "每一条都必须对应一份点名该型号的检测报告。我们自己的报告只覆盖 KD070/30-290 与 607 SS ET；地弹簧那份 EN 1154 的申请人是 KALE，不是我们的，已撤下。ANSI/BHMA 没有。",
          tone: count("hasCertifications") > 0 ? "warn" : "good",
        },
        {
          label: "标为「真实项目」的案例",
          value: verifiedProjects,
          total: projects.length,
          action: "只有甲方确认确有供货才能这样标。其余应保持「代表性应用」。",
          tone: verifiedProjects > 0 ? "warn" : "good",
        },
      ],
    },
    {
      title: "分类与内容",
      description: "空分类会给访客一个什么都没有的页面。",
      metrics: [
        {
          label: "没有任何产品的一级分类",
          value: emptyCategories.length,
          total: categories.length,
          action: emptyCategories.length
            ? `空的是：${emptyCategories.map((c) => c.name).join("、")}`
            : undefined,
          tone: tone(emptyCategories.length, 1, 5),
        },
        {
          label: "已发布新闻",
          value: news.length - draftNews,
          total: news.length,
          action:
            news.length === 0
              ? "新闻板块已建好但还没有内容，列表页显示空状态。"
              : undefined,
          tone: news.length === 0 ? "warn" : "good",
        },
        {
          label: "常见问题未回答",
          value: unansweredFaq.length,
          total: faqGroups.reduce((n, g) => n + g.items.length, 0),
          action: unansweredFaq.length
            ? `不会显示在网站上，等甲方回答：${unansweredFaq.map((q) => q.question).join("；")}`
            : undefined,
          tone: unansweredFaq.length ? "warn" : "good",
        },
        {
          label: "新闻草稿",
          value: draftNews,
          action: draftNews ? "草稿不会进入构建，也不会有可访问的网址。" : undefined,
          tone: "good",
        },
      ],
    },
  ];
}

/** Per-category counts for the breakdown table. */
export function categoryBreakdown() {
  const counts = new Map<string, number>();
  for (const product of products) {
    const top = product.categoryPath[0];
    counts.set(top, (counts.get(top) ?? 0) + 1);
  }
  return categories
    .map((c) => ({ slug: c.slug, name: c.name, count: counts.get(c.slug) ?? 0 }))
    .sort((a, b) => b.count - a.count);
}
