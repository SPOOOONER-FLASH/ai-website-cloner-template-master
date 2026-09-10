/**
 * RAYEN 雷茵 — data access for the Chinese site.
 *
 * This module is the boundary between the shared catalogue and the RAYEN pages. It reads
 * the generated Chinese mirror (scripts/build-chinese-mirror.mjs) plus the taxonomy in
 * content/categories.json, and exposes nothing that carries an export brand.
 *
 * It deliberately does NOT import src/data/products.ts. That module maps every image
 * through brandProductImageRef(), which rewrites /images/products/ to
 * /images/products-hyde/ — the watermarked set. A RAYEN page showing a HYDE watermark
 * would tell a Chinese buyer they are looking at somebody else's catalogue, which is both
 * true and fatal. The mirror carries the unbranded originals; keep it that way.
 */

import categoriesFile from "../../content/categories.json";
import rayenFile from "../../content/rayen/site.json";
import mirror from "./generated/products-zh.json";

export type RayenImage = { src: string; ratio: string; label: string };
export type RayenSpec = { label: string; value: string };

export type RayenProduct = {
  slug: string;
  model: string;
  name: string;
  nameEn: string;
  series: string;
  categoryPath: string[];
  categoryNames: string[];
  summary: string;
  specs: RayenSpec[];
  material: string;
  finishes: string[];
  doorTypes: string[];
  heroImage?: RayenImage;
  gallery: RayenImage[];
  relatedModels: string[];
  styleFamily: string;
  seoTitle: string;
  seoDescription: string;
};

export type RayenCategory = {
  slug: string;
  name: string;
  summary: string;
  image?: { src?: string; ratio?: string; label?: string };
  children: { slug: string; name: string }[];
};

export const rayen = rayenFile;
export const products = mirror.products as RayenProduct[];

/* ---------------------------------------------------------------------------
 * The site's own identity. Kept here rather than in content/site-settings.json,
 * which belongs to HYDE.
 * ------------------------------------------------------------------------ */
export const siteName = `${rayen.brand.latin} ${rayen.brand.zh}`;
export const legalName = rayen.brand.legalName;

/**
 * The origin used for canonical URLs and JSON-LD.
 *
 * Points at the temporary preview host until the real domain is chosen. It is the only
 * place that host appears in the source — moving the site later is this line plus
 * `server_name` in nginx, and nothing else. See CLIENT-RUNBOOK 「雷茵中文站」.
 */
export const siteUrl = `https://${rayen.preview.host}`;

/**
 * Every internal link on this site goes through here.
 *
 * The pages live at /zh/... inside this repo's Next app, because they share one static
 * export with cantonlock.com. The DEPLOYED RAYEN site serves them at the root of its own
 * host, so scripts/build-rayen-site.mjs rewrites "/zh/" to "/" as it assembles out-rayen/.
 * That rewrite is only safe because this helper is the single place the prefix is written
 * — a hand-typed href would either survive the rewrite and 404, or get mangled if the
 * rewrite were made greedier to catch it. src/lib/rayen-paths.test.ts guards it.
 */
export const ZH_PREFIX = "/zh";

export const zhPath = (path: string) => `${ZH_PREFIX}${path.startsWith("/") ? path : `/${path}`}`;

export const absoluteUrl = (path: string) =>
  new URL(path.startsWith("/") ? path : `/${path}`, siteUrl).toString();

/** Top navigation. 顶固 的栏目骨架，去掉投资者关系和爱心公益 —— 那两样我们没有。 */
export const primaryNav = [
  { href: "/products/", label: "产品中心", latin: "Products" },
  { href: "/company/", label: "走进雷茵", latin: "Company" },
  { href: "/quality/", label: "品质与认证", latin: "Quality" },
  { href: "/oem/", label: "合作与定制", latin: "OEM / ODM" },
  { href: "/contact/", label: "联系我们", latin: "Contact" },
];

/* ---------------------------------------------------------------------------
 * Categories, in Chinese, with their real product counts.
 *
 * The count is derived rather than stored: a category that says 24 型号 and lists 19 is
 * the kind of small inconsistency a careful buyer notices and generalises from.
 * ------------------------------------------------------------------------ */
type RawCategory = {
  slug: string;
  name: string;
  nameZh?: string;
  summary?: string;
  image?: { src?: string; ratio?: string; label?: string };
  children?: { slug: string; name: string; nameZh?: string }[];
};

const rawCategories = categoriesFile.categories as RawCategory[];

export const categories: RayenCategory[] = rawCategories.map((category) => ({
  slug: category.slug,
  name: category.nameZh ?? category.name,
  summary: category.summary ?? "",
  image: category.image,
  children: (category.children ?? []).map((child) => ({
    slug: child.slug,
    name: child.nameZh ?? child.name,
  })),
}));

export function getCategory(slug: string): RayenCategory | undefined {
  return categories.find((category) => category.slug === slug);
}

/** Products whose category path starts with this top-level category, in model order. */
export function getProductsInCategory(slug: string): RayenProduct[] {
  return products
    .filter((product) => product.categoryPath[0] === slug)
    .sort((a, b) => a.model.localeCompare(b.model, "en", { numeric: true }));
}

export function getProduct(slug: string): RayenProduct | undefined {
  return products.find((product) => product.slug === slug);
}

export function countInCategory(slug: string): number {
  return products.filter((product) => product.categoryPath[0] === slug).length;
}

/** Categories that actually have products. An empty category page is a dead end. */
export const stockedCategories = categories.filter(
  (category) => countInCategory(category.slug) > 0,
);

/**
 * The three numbers on the home page.
 *
 * All derived from the catalogue itself, so they cannot drift from what the site shows.
 * 第三个数字 2026-09-09 换了。原本是「2026 公司成立」，甲方看到之后说「这个可以先去掉，
 * 不要写出来」—— 一家 2026 年注册的公司，把注册年份摆在首页最显眼的位置，讲的是
 * 「我们很新」，而这个位置要讲的恰恰相反。改成甲方自己给的口径「锁具经验始于 1999」。
 *
 * 这不是把 2026 改成 1999 这么简单：公司确实是 2026 年注册的，foundedYear 还在数据里。
 * 变的是这个位置回答哪个问题 —— 不是「你们公司几岁」，是「你们做这行多久了」。
 *
 * 仍然没有厂房面积、没有出口国家数、没有年产能。前两个数字由 content/products 现算，
 * 第三个是甲方给的口径，三个都站得住。见 AGENTS.md「Say what is not known」。
 */
export const siteFacts = [
  { value: String(stockedCategories.length), unit: "个", label: "在售品类" },
  { value: String(products.length), unit: "个", label: "在售型号" },
  { value: String(rayen.brand.lockExperienceSince), unit: "年起", label: "锁具制造经验" },
];


/**
 * The other models in this model's design family.
 *
 * The supplier ships a pull handle and a lever handle drawn in the same language, and
 * the client's own note put it plainly: 「有门把手的表示此款式搭配有同风格的门把手」.
 * That is a real specifying decision — somebody choosing a handle for an entrance door
 * usually needs the matching lever for the doors behind it, and finding out later that
 * there was one costs a second order.
 *
 * Derived from styleFamily rather than stored per model, so the two directions cannot
 * disagree: whatever the handle says about the lever, the lever says about the handle.
 */
export function getStyleFamily(product: RayenProduct): RayenProduct[] {
  if (!product.styleFamily) return [];
  return products.filter(
    (candidate) =>
      candidate.styleFamily === product.styleFamily && candidate.slug !== product.slug,
  );
}

/** True when this record is a lever handle — the family block calls those out by name. */
export function isLeverHandle(product: RayenProduct): boolean {
  return product.categoryPath[0] === "lever-handles";
}

/** Related models a buyer might compare, resolved to records that exist. */
export function getRelatedProducts(product: RayenProduct, limit = 4): RayenProduct[] {
  const named = product.relatedModels
    .map((slug) => getProduct(slug))
    .filter((candidate): candidate is RayenProduct => Boolean(candidate));
  if (named.length >= limit) return named.slice(0, limit);

  const siblings = getProductsInCategory(product.categoryPath[0] ?? "").filter(
    (candidate) =>
      candidate.slug !== product.slug && !named.some((n) => n.slug === candidate.slug),
  );
  return [...named, ...siblings].slice(0, limit);
}
