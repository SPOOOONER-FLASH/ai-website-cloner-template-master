import type { Metadata } from "next";
import { ProductsIndexBody } from "@/components/rayen/pages";
import { STRINGS } from "@/data/rayen-i18n";
import { categoriesFor, products } from "@/data/rayen";

/*
  Route file only. The page body lives in src/components/rayen/pages.tsx and is shared with
  the Chinese tree — see the note there on why there is one set of pages and not two.
*/

export const metadata: Metadata = {
  title: STRINGS.en.products.title,
  description: STRINGS.en.products.intro(categoriesFor("en").length, products.length),
  alternates: { canonical: "/en/products/" },
};

export default function Page() {
  return <ProductsIndexBody locale="en" />;
}
