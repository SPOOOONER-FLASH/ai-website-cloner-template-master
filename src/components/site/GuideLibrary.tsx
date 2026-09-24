'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Search } from 'lucide-react';
import type { Locale } from '@/data/site';
import { localisedHref } from '@/lib/spanish-mirror';
import { filterGuides, type GuideLibraryEntry, type GuideTopic } from '@/lib/guide-library';
import styles from './GuideEditorial.module.css';

const COPY = {
  en: { title: 'Find your next answer.', search: 'Search guides', placeholder: 'Cylinder, LC04, finish, EN 1125…', all: 'All guides', fit: 'Dimensions & fit', materials: 'Materials & finishes', standards: 'Standards & testing', buying: 'Ordering & delivery', other: 'More topics', count: 'guides', topics: 'Browse by topic', clear: 'Clear filters', empty: 'No guides match these filters.', emptyText: 'Try a model, a shorter keyword, or choose another topic.', read: 'Read guide' },
  es: { title: 'Encuentre la respuesta.', search: 'Buscar guías', placeholder: 'Cilindro, LC04, acabado, EN 1125…', all: 'Todas las guías', fit: 'Medidas y compatibilidad', materials: 'Materiales y acabados', standards: 'Normas y ensayos', buying: 'Pedidos y entrega', other: 'Más temas', count: 'guías', topics: 'Explorar por tema', clear: 'Borrar filtros', empty: 'No hay guías con estos filtros.', emptyText: 'Pruebe un modelo, una palabra más corta u otro tema.', read: 'Leer guía' },
  pt: { title: 'Encontre a resposta.', search: 'Buscar guias', placeholder: 'Cilindro, LC04, acabamento, EN 1125…', all: 'Todos os guias', fit: 'Medidas e compatibilidade', materials: 'Materiais e acabamentos', standards: 'Normas e ensaios', buying: 'Pedidos e entrega', other: 'Mais temas', count: 'guias', topics: 'Explorar por tema', clear: 'Limpar filtros', empty: 'Nenhum guia corresponde aos filtros.', emptyText: 'Tente um modelo, uma palavra mais curta ou outro tema.', read: 'Ler guia' },
} as const;

export function GuideLibrary({ entries, locale }: { entries: GuideLibraryEntry[]; locale: Locale }) {
  const t = COPY[locale];
  const id = useId();
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState<GuideTopic | 'all'>('all');
  const results = filterGuides(entries, query, topic);
  const topics: (GuideTopic | 'all')[] = ['all', 'fit', 'materials', 'standards', 'buying', ...(entries.some(entry => entry.topic === 'other') ? ['other' as const] : [])];
  const clear = () => { setQuery(''); setTopic('all'); };
  return <section id="guide-library" className={styles.library} aria-labelledby={`${id}-title`}>
    <header className={styles.libraryHeader}>
      <h2 id={`${id}-title`}>{t.title}</h2>
      <div className={styles.search}>
        <label htmlFor={`${id}-search`}>{t.search}</label>
        <div><Search size={20} aria-hidden="true" /><input id={`${id}-search`} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={t.placeholder} aria-controls={`${id}-results`} /></div>
      </div>
    </header>
    <div className={styles.libraryBody}>
      <aside className={styles.filters}>
        <h3>{t.topics}</h3>
        <div className={styles.filterButtons} role="group" aria-label={t.topics}>
          {topics.map(value => <button key={value} type="button" aria-pressed={topic === value} onClick={() => setTopic(value)}>
            {t[value]}<span>{value === 'all' ? entries.length : entries.filter(entry => entry.topic === value).length}</span>
          </button>)}
        </div>
      </aside>
      <div id={`${id}-results`}>
        <div className={styles.resultsHeader}>
          <p role="status" aria-live="polite" aria-atomic="true">{results.length} {t.count}</p>
          {(query || topic !== 'all') && <button type="button" onClick={clear}>{t.clear}</button>}
        </div>
        {/* All links are server-rendered: filtering must not make this catalogue an orphaned client-only index. */}
        {results.map(entry => <article key={entry.slug} className={styles.result}>
          <div><p className={styles.topic}>{t[entry.topic]}</p>
            <h3><Link href={localisedHref(`/guides/${entry.slug}/`, locale)}>{entry.title}</Link></h3>
            <p className={styles.summary}>{entry.summary}</p>
            <Link href={localisedHref(`/guides/${entry.slug}/`, locale)} className={styles.textLink}>{t.read}<ArrowUpRight size={16} aria-hidden="true" /></Link>
          </div>
          {entry.image && <Link href={localisedHref(`/guides/${entry.slug}/`, locale)} className={styles.thumbnail} tabIndex={-1} aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {/* The label, not "": these are product photographs Google Images can index; the link itself is aria-hidden. */}
            <img src={entry.image.src} alt={entry.image.label} width="200" height="160" loading="lazy" />
          </Link>}
        </article>)}
        {results.length === 0 && <div className={styles.empty}><h3>{t.empty}</h3><p>{t.emptyText}</p><button type="button" onClick={clear}>{t.clear}</button></div>}
      </div>
    </div>
  </section>;
}

