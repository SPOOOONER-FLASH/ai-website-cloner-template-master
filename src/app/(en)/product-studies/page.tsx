import { ProductStudies } from "@/components/site/ProductStudies";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  enPath: "/product-studies", locale: "en",
  title: "Hardware in Focus — Product Photography & Selection",
  description: "Explore Canton Hyland locks, cylinders and handles through original product photography and studio compositions. Open each model for specifications and finish options.",
  image: "/images/product-studies/564-warm-stone-1440.webp",
});

export default function ProductStudiesPage() { return <ProductStudies locale="en" />; }
