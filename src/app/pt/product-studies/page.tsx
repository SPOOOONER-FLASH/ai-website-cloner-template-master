import { ProductStudies } from "@/components/site/ProductStudies";
import { pageMetadata } from "@/lib/seo";

/** The Portuguese mirror of /product-studies/. Same component, `locale="pt"`. */

export const metadata = pageMetadata({
  enPath: "/product-studies", locale: "pt",
  title: "Ferragens em detalhe — Fotografias e seleção de produtos",
  description: "Veja fechaduras, cilindros e maçanetas Canton Hyland em fotografias originais e composições de estúdio. Consulte medidas, acabamentos e especificações.",
  image: "/images/product-studies/564-warm-stone-1440.webp",
});

export default function ProductStudiesPage() { return <ProductStudies locale="pt" />; }
