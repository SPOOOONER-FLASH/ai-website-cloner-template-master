import type { NewsArticle } from '@/data/types';
import type { Locale } from '@/data/site';
import { isGuideProductPhoto } from '@/lib/guide-library';
import styles from './GuideVisual.module.css';
import { t, tx } from "@/lib/i18n";

/** Preserve catalogue pixels; articles without a product photo use their technical reading navigation. */
export function GuideCover({ article, locale, compact = false }: { article: NewsArticle; locale: Locale; compact?: boolean }) {
  const source = article.heroImage.src;
  const label = t(article.heroImage, "label", locale);
  if (!isGuideProductPhoto(source)) return null;
  // The listing already has an outer link; never nest an image link inside it.
  // eslint-disable-next-line @next/next/no-img-element
  const image = <img src={source} alt={label} width="1200" height="750" className={styles.photo} loading={compact ? 'lazy' : 'eager'} />;
  return <figure className={`${styles.cover} ${compact ? styles.compact : ''}`}><div className={styles.stage}>
    {compact ? <div>{image}</div> : <a href={source} target="_blank" rel="noopener noreferrer" aria-label={tx(locale, 'Open original image', { es: 'Abrir imagen original', pt: 'Abrir imagem original' })}>{image}</a>}
  </div>{!compact && <figcaption>{label}</figcaption>}</figure>;
}
