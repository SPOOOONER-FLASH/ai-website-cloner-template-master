import type { NewsArticle } from '@/data/types';
import type { Locale } from '@/data/site';
import { isGuideProductPhoto, isGuideVisual } from '@/lib/guide-library';
import styles from './GuideVisual.module.css';

/** Preserve catalogue pixels and label architectural scenes as illustrations, never product evidence. */
export function GuideCover({ article, locale, compact = false }: { article: NewsArticle; locale: Locale; compact?: boolean }) {
  const source = article.heroImage.src;
  const label = (locale === 'es' ? article.heroImage.labelEs : locale === 'pt' ? article.heroImage.labelPt : undefined) || article.heroImage.label;
  if (!isGuideVisual(source)) return null;
  const scene = !isGuideProductPhoto(source);
  const catalogue = source.startsWith('/images/products-');
  const conceptCaption = { en: 'Conceptual architectural illustration', es: 'Ilustración arquitectónica conceptual', pt: 'Ilustração arquitetônica conceitual' }[locale];
  // The listing already has an outer link; never nest an image link inside it.
  // eslint-disable-next-line @next/next/no-img-element
  const image = <img src={source} alt={scene ? `${conceptCaption}: ${label}` : label} width="1200" height="750" className={styles.photo} loading={compact ? 'lazy' : 'eager'} />;
  return <figure className={`${styles.cover} ${compact ? styles.compact : ''}`}><div className={`${styles.stage} ${scene ? styles.scene : catalogue ? styles.catalogue : styles.subject}`}>
    {compact || scene ? <div>{image}</div> : <a href={source} target="_blank" rel="noopener noreferrer" aria-label={{ en: 'Open original image', es: 'Abrir imagen original', pt: 'Abrir imagem original' }[locale]}>{image}</a>}
  </div>{!compact && <figcaption>{scene ? conceptCaption : label}</figcaption>}</figure>;
}
