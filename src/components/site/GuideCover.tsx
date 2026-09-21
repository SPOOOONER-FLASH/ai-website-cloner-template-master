import type { NewsArticle } from '@/data/types';
import type { Locale } from '@/data/site';
import styles from './GuideVisual.module.css';

/** Product pixels come from the supplied catalogue photograph; generated art is background only. */
export function GuideCover({ article, locale, compact = false }: { article: NewsArticle; locale: Locale; compact?: boolean }) {
  const source = article.heroImage.src;
  const label = (locale === 'es' ? article.heroImage.labelEs : locale === 'pt' ? article.heroImage.labelPt : undefined) || article.heroImage.label;
  if (!source) return null;
  // The listing already has an outer link; never nest an image link inside it.
  // eslint-disable-next-line @next/next/no-img-element
  const image = <img src={source} alt={label} width="1200" height="750" className={styles.photo} loading={compact ? 'lazy' : 'eager'} />;
  return <figure className={`${styles.cover} ${compact ? styles.compact : ''}`}><div className={styles.stage}>
    {compact ? <div>{image}</div> : <a href={source} target="_blank" rel="noopener noreferrer" aria-label={{ en: 'Open original image', es: 'Abrir imagen original', pt: 'Abrir imagem original' }[locale]}>{image}</a>}
  </div>{!compact && <figcaption>{label}</figcaption>}</figure>;
}
