"use client";
import { useEffect, useState } from 'react';
import type { Locale } from '@/data/site';
import styles from './ArticleReading.module.css';
export interface ContentsItem { id: string; text: string; level: number }
export function ArticleContents({ items, locale }: { items: ContentsItem[]; locale: Locale }) {
  const [active, setActive] = useState('');
  useEffect(() => {
    const observer = new IntersectionObserver(entries => { const match = entries.find(e => e.isIntersecting); if (match) setActive(match.target.id); }, { rootMargin: '-132px 0px -60% 0px' });
    items.forEach(item => { const node = document.getElementById(item.id); if (node) observer.observe(node); });
    return () => observer.disconnect();
  }, [items]);
  const title = { en: 'On this page', es: 'En esta página', pt: 'Nesta página' }[locale];
  const links = <nav aria-label={title}>{items.map(item => <a key={item.id} href={`#${item.id}`} className={item.level === 3 ? styles.subheading : undefined} aria-current={active === item.id ? 'location' : undefined} onClick={() => setActive(item.id)}>{item.text}</a>)}</nav>;
  return <aside className={styles.contents}><div className={styles.desktopContents}><p className={styles.contentsTitle}>{title}</p>{links}</div><details className={styles.mobileContents}><summary>{title}</summary>{links}</details></aside>;
}
