import Link from "next/link";
import { MediaPlaceholder } from "./MediaPlaceholder";
import styles from "./EditorialCatalogue.module.css";
import type { Locale } from "@/data/site";

// Existing catalogue photographs, composed in HTML without redrawing any product.
export const atlasSubjects = [
  ["lever", "hyde-real-lever-plate", "9001-stainless-steel-handle", "9001", "stainless-steel-handles"],
  ["panic", "/images/products-hyde/311-panic-exit-device.webp", "311-panic-exit-device", "311", "panic-exit-devices"],
  ["pull", "hyde-real-pull-plate", "stainless-steel-glass-door-pull-handle", "Pull handle", "glass-door-accessories"],
  ["hinge", "hyde-real-hinge-plate", "stainless-steel-door-hinge", "Hinges", "brass-steel-hinges"],
  ["lock", "hyde-real-lock-plate", "lc14-85-50mm-lock-case", "LC14", "lock-cases"],
  ["cylinder", "hyde-real-cylinder-plate", "70sn-lock-cylinder", "70SN", "lock-cylinders"],
  ["accessory", "/images/products-hyde/stainless-steel-flush-bolt.webp", "stainless-steel-flush-bolt", "Flush bolts", "hardware-accessories"],
  ["flush", "/images/products-hyde/600-concealed-sliding-door-handle.webp", "600-concealed-sliding-door-handle", "600", "stainless-steel-handles"],
] as const;

export function EditorialAtlas({ locale, priority = false, onNavigate }: { locale: Locale; priority?: boolean; onNavigate?: () => void }) {
  return <div className={styles.atlas}>
    {atlasSubjects.map(([position, image, slug, model, category]) => (
      <Link key={slug} href={`${locale === "es" ? "/es" : ""}/products/${category}/${slug}/`}
        className={styles[position]} title={model} onClick={onNavigate}>
        <MediaPlaceholder src={image.startsWith("/") ? image : `/images/editorial/${image}.webp`}
          ratio="3 / 2" label={`${locale === "es" ? "Ver producto" : "View product"}: ${model}`}
          sizes="(max-width: 767px) 40vw, 30vw" priority={priority} />
      </Link>
    ))}
  </div>;
}
