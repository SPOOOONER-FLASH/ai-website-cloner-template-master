import Link from 'next/link';
import type { NewsArticle } from '@/data/types';
import type { Locale } from '@/data/site';
import { isGuideProductPhoto } from '@/lib/guide-library';
import styles from './GuideVisual.module.css';
import { t, tx } from "@/lib/i18n";
import { toHydeBrandedProductImageSrc } from '@/data/product-image-branding';

/**
 * Preserve catalogue pixels; articles without a product photo use their technical reading navigation.
 * `product` is the published product this exact photograph belongs to (NewsDetail): the cover then
 * opens that product page instead of the raw image file (2026-10-12, article → product plan).
 */
export function GuideCover({ article, locale, compact = false, product }: { article: NewsArticle; locale: Locale; compact?: boolean; product?: { href: string; model: string } }) {
  /* The HYDE-marked copy of a product photograph: four guides named the as-shot original, which
     still carries the old supplier mark (found 2026-10-12). */
  const source = toHydeBrandedProductImageSrc(article.heroImage.src);
  const label = t(article.heroImage, "label", locale);
  if (!isGuideProductPhoto(source)) return null;
  const view = tx(locale, 'View product', { es: 'Ver producto', pt: 'Ver produto' });
  // The listing already has an outer link; never nest an image link inside it.
  // eslint-disable-next-line @next/next/no-img-element
  const image = <img src={source} alt={label} width="1200" height="750" className={styles.photo} loading={compact ? 'lazy' : 'eager'} />;
  const full = product
    ? <Link href={product.href} aria-label={`${view}: ${product.model}`}>{image}</Link>
    : <a href={source} target="_blank" rel="noopener noreferrer" aria-label={tx(locale, 'Open original image', { es: 'Abrir imagen original', pt: 'Abrir imagem original' })}>{image}</a>;
  return <figure className={`${styles.cover} ${compact ? styles.compact : ''}`} data-link-list={compact ? undefined : 'article-cover'}><div className={styles.stage}>
    {compact ? <div>{image}</div> : full}
  </div>{!compact && <figcaption>{label}{product && <> · <Link href={product.href}>{view}: {product.model} →</Link></>}</figcaption>}</figure>;
}
