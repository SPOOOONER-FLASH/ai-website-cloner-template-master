import { ProductStudies } from "@/components/site/ProductStudies";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  enPath: "/product-studies", locale: "es",
  title: "Herrajes en detalle — Fotografías y selección de productos",
  description: "Explore cerraduras, cilindros y manijas Canton Hyland mediante fotografías originales y composiciones de estudio. Consulte medidas, acabados y especificaciones.",
  image: "/images/product-studies/564-warm-stone-1440.webp",
});

export default function ProductStudiesPage() { return <ProductStudies locale="es" />; }
