import type { Metadata } from "next";
import { ProductsIndexBody } from "@/components/rayen/pages";
import { STRINGS } from "@/data/rayen-i18n";
import { alternatesFor, categoriesFor, products } from "@/data/rayen";

/*
  Route file only. The page body lives in src/components/rayen/pages.tsx and is shared with
  the English tree — see the note there on why there is one set of pages and not two.
*/

export const metadata: Metadata = {
  title: STRINGS.zh.products.title,
  description: STRINGS.zh.products.intro(categoriesFor("zh").length, products.length),
  alternates: alternatesFor("zh", "/products/"),
};

export default function Page() {
  return <ProductsIndexBody locale="zh" />;
}
