"use client";
import type { Locale } from '@/data/site';
import styles from './ArticleReading.module.css';
import { tx } from "@/lib/i18n-client";
import { useScrollSpy } from './useScrollSpy';
export interface ContentsItem { id: string; text: string; level: number }
/**
 * The guide's contents, held beside the text. Since 2026-10-12 (the preview the client
 * approved): a "03 / 08 · 38% read" line over the list, and the section being read marked by
 * position each frame rather than by an IntersectionObserver band a fast scroll can skip.
 */
export function ArticleContents({ items, locale }: { items: ContentsItem[]; locale: Locale }) {
  const { active, progress } = useScrollSpy(items.map(item => item.id), 0.3, 'article-overview');
  const title = tx(locale, 'On this page', { es: 'En esta página', pt: 'Nesta página' });
  const index = Math.max(0, items.findIndex(item => item.id === active));
  const pad = (n: number) => String(n).padStart(2, '0');
  const read = tx(locale, '{n}% read', { es: '{n}% leído', pt: '{n}% lido' }).replace('{n}', String(Math.round(progress * 100)));
  const links = <nav aria-label={title}>{items.map((item, k) => <a key={item.id} href={`#${item.id}`} className={item.level === 3 ? styles.subheading : undefined} data-past={k < index} aria-current={active === item.id ? 'location' : undefined}>{item.text}</a>)}</nav>;
  return <aside className={styles.contents}><div className={styles.desktopContents}><p className={styles.contentsTitle}>{title}</p><p className={styles.contentsCount}><b>{pad(index + 1)}</b> / {pad(items.length)} · {read}</p>{links}</div><details className={styles.mobileContents}><summary>{title}</summary>{links}</details></aside>;
}
