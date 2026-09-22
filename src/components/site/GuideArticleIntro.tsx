import type { NewsArticle } from '@/data/types';
import type { Locale } from '@/data/site';
import { isGuideProductPhoto } from '@/lib/guide-library';
import { GuideCover } from './GuideCover';
import styles from './GuideEditorial.module.css';

/** Navigation is drawn from the article itself; no invented dimensions or illustrative hardware. */
export function GuideArticleIntro({ article, locale, contents }: {
  article: NewsArticle;
  locale: Locale;
  contents: { id: string; text: string; level: number }[];
}) {
  const headings = contents.filter(item => item.id !== 'article-overview' && item.id !== 'article-faq').slice(0, 3);
  return <div className={styles.articleIntro} data-photo={isGuideProductPhoto(article.heroImage.src)}>
    <GuideCover article={article} locale={locale} />
    {headings.length > 0 && <nav className={styles.readingPanel} aria-label={{ en: 'Start reading', es: 'Empezar a leer', pt: 'Começar a ler' }[locale]}>
      <h2>{{ en: 'Before you specify', es: 'Antes de especificar', pt: 'Antes de especificar' }[locale]}</h2>
      <ul>{headings.map(item => <li key={item.id}><a href={`#${item.id}`}>{item.text}</a></li>)}</ul>
    </nav>}
  </div>;
}
