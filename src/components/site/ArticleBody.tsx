import { Fragment, type ReactNode } from 'react';
import type { Locale } from '@/data/site';
import type { ArticleBlock } from '@/lib/article-layout';
import { DataTable } from './DataTable';
import { InlineText } from './InlineText';
import styles from './ArticleReading.module.css';
import { tx } from "@/lib/i18n";
import type { ArticleReadingAids } from '@/data/types';
/** `figure` renders one extra node after the block at `afterIndex` (see NewsDetail). */
/** `mentions`: block index → model links for that paragraph; `rowHref`: link for a table row header (article-products.ts). */
/** `aids`: the article's key-points table and per-section margin figures for this locale (types.ts). */
export function ArticleBody({ blocks, locale, figure, mentions, rowHref, aids }: { blocks: ArticleBlock[]; locale: Locale; figure?: { afterIndex: number; node: ReactNode }; mentions?: Map<number, Map<string, string>>; rowHref?: (cell: string) => string | undefined; aids?: ArticleReadingAids }) {
  const figures = new Map((aids?.figures ?? []).map((f) => [f.heading, f] as const));
  return <div className={styles.body} id="article-overview" data-link-list="article-body">
    {aids?.keyPoints ? <KeyPoints {...aids.keyPoints} /> : null}
    {blocks.map((block, index) => {
      let rendered = renderBlock(block, index, locale, mentions, rowHref);
      const margin = block.kind === 'heading' ? figures.get(block.text) : undefined;
      if (margin) rendered = <Fragment key={index}>{rendered}<MarginFigure {...margin} /></Fragment>;
      return figure?.afterIndex === index ? <Fragment key={index}>{rendered}{figure.node}</Fragment> : rendered;
    })}
  </div>;
}

function KeyPoints({ title, headers, rows }: { title: string; headers: string[]; rows: string[][] }) {
  return <section className={styles.keyPoints} aria-label={title}>
    <p className={styles.keyPointsTitle}>{title}</p>
    <table><thead><tr>{headers.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
      <tbody>{rows.map((row) => <tr key={row.join('|')}>{row.map((cell, k) => k === 0 ? <th key={k} scope="row">{cell}</th> : <td key={k}>{cell}</td>)}</tr>)}</tbody></table>
  </section>;
}

/** The figure a section turns on, in the margin. "55–100kg" sets as 55–100 with a small unit. */
function MarginFigure({ value, label }: { value: string; label: string }) {
  const [, number, unit] = /^([\d.,–-]+)\s*(.*)$/.exec(value) ?? [, value, ''];
  return <aside className={styles.marginFigure}><span className={styles.marginValue}>{number}{unit ? <small>{unit}</small> : null}</span><span className={styles.marginLabel}>{label}</span></aside>;
}

function renderBlock(block: ArticleBlock, index: number, locale: Locale, mentions?: Map<number, Map<string, string>>, rowHref?: (cell: string) => string | undefined) {
  if (block.kind === 'heading') return block.level === 2 ? <h2 key={block.id} id={block.id} data-caps={/\p{Lu}/u.test(block.text) && block.text === block.text.toLocaleUpperCase()}>{block.text}</h2> : <h3 key={block.id} id={block.id}>{block.text}</h3>;
  if (block.kind === 'table') {
    const numeric = block.headers.map((_, column) => block.rows.every(row => /^-?\d+(?:\.\d+)?$/.test(row[column])));
    return <DataTable key={index} locale={locale} caption={block.caption || tx(locale, 'Reference table', { es: 'Tabla de consulta', pt: 'Tabela de consulta' })} columns={block.headers.map((label, column) => ({ label, sort: numeric[column] ? 'number' : 'text' }))} rows={block.rows.map(row => row.map((text, column) => ({ text, value: numeric[column] ? Number(text) : undefined, href: column === 0 ? rowHref?.(text) : undefined })))} />;
  }
  return <p key={index}><InlineText text={block.text} links={mentions?.get(index)} /></p>;
}
