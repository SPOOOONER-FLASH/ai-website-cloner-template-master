import type { Locale } from '@/data/site';
import type { ArticleBlock } from '@/lib/article-layout';
import { DataTable } from './DataTable';
import { InlineText } from './InlineText';
import styles from './ArticleReading.module.css';
import { tx } from "@/lib/i18n";
export function ArticleBody({ blocks, locale }: { blocks: ArticleBlock[]; locale: Locale }) {
  return <div className={styles.body} id="article-overview">{blocks.map((block, index) => {
    if (block.kind === 'heading') return block.level === 2 ? <h2 key={block.id} id={block.id}>{block.text}</h2> : <h3 key={block.id} id={block.id}>{block.text}</h3>;
    if (block.kind === 'table') {
      const numeric = block.headers.map((_, column) => block.rows.every(row => /^-?\d+(?:\.\d+)?$/.test(row[column])));
      return <DataTable key={index} locale={locale} caption={block.caption || tx(locale, 'Reference table', { es: 'Tabla de consulta', pt: 'Tabela de consulta' })} columns={block.headers.map((label, column) => ({ label, sort: numeric[column] ? 'number' : 'text' }))} rows={block.rows.map(row => row.map((text, column) => ({ text, value: numeric[column] ? Number(text) : undefined })))} />;
    }
    return <p key={index}><InlineText text={block.text} /></p>;
  })}</div>;
}
