import { Fragment, type ReactNode } from 'react';
import type { Locale } from '@/data/site';
import type { ArticleBlock } from '@/lib/article-layout';
import { DataTable } from './DataTable';
import { InlineText } from './InlineText';
import styles from './ArticleReading.module.css';
import { tx } from "@/lib/i18n";
/** `figure` renders one extra node after the block at `afterIndex` (see NewsDetail). */
/** `mentions`: block index → model links for that paragraph; `rowHref`: link for a table row header (article-products.ts). */
export function ArticleBody({ blocks, locale, figure, mentions, rowHref }: { blocks: ArticleBlock[]; locale: Locale; figure?: { afterIndex: number; node: ReactNode }; mentions?: Map<number, Map<string, string>>; rowHref?: (cell: string) => string | undefined }) {
  return <div className={styles.body} id="article-overview" data-link-list="article-body">{blocks.map((block, index) => {
    const rendered = renderBlock(block, index, locale, mentions, rowHref);
    return figure?.afterIndex === index ? <Fragment key={index}>{rendered}{figure.node}</Fragment> : rendered;
  })}</div>;
}

function renderBlock(block: ArticleBlock, index: number, locale: Locale, mentions?: Map<number, Map<string, string>>, rowHref?: (cell: string) => string | undefined) {
  if (block.kind === 'heading') return block.level === 2 ? <h2 key={block.id} id={block.id} data-caps={/\p{Lu}/u.test(block.text) && block.text === block.text.toLocaleUpperCase()}>{block.text}</h2> : <h3 key={block.id} id={block.id}>{block.text}</h3>;
  if (block.kind === 'table') {
    const numeric = block.headers.map((_, column) => block.rows.every(row => /^-?\d+(?:\.\d+)?$/.test(row[column])));
    return <DataTable key={index} locale={locale} caption={block.caption || tx(locale, 'Reference table', { es: 'Tabla de consulta', pt: 'Tabela de consulta' })} columns={block.headers.map((label, column) => ({ label, sort: numeric[column] ? 'number' : 'text' }))} rows={block.rows.map(row => row.map((text, column) => ({ text, value: numeric[column] ? Number(text) : undefined, href: column === 0 ? rowHref?.(text) : undefined })))} />;
  }
  return <p key={index}><InlineText text={block.text} links={mentions?.get(index)} /></p>;
}
