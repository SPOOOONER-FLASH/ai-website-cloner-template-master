import { publishedProducts } from "@/data/products";
import { locales, type Locale } from "@/data/site";
import { toFinderProduct } from "@/lib/product-finder";

/**
 * /data/<locale>/finder.json — the product list the finder and the configurator filter in
 * the browser.
 *
 * Until 2026-10-08 both pages received this array as a React prop, which means it was
 * serialised INTO the HTML of every copy of each page: /product-finder/ was 1,082 KB and
 * /configurator/ 868 KB, 85–93% of it this data, ten languages each. Bing's site scan
 * listed them among 100 pages over 500 KB. Both components already render only in the
 * browser (`ssr: false`), so nothing indexable depended on the data being in the HTML;
 * as a separate file it is fetched once, compressed by the server and cached across both
 * tools.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function GET(_request: Request, context: { params: Promise<{ locale: string }> }): Promise<Response> {
  const { locale } = await context.params;
  const products = publishedProducts.map((product) => toFinderProduct(product, { locale: locale as Locale }));
  return new Response(JSON.stringify(products), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
