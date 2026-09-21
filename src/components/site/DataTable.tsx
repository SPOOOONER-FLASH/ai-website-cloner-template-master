"use client";
import { useId, useState } from 'react';
import type { Locale } from '@/data/site';
import { sortedTableRows, type SortDirection, type TableCell } from '@/lib/article-layout';
import styles from './ArticleReading.module.css';

export interface DataColumn { label: string; sort?: 'text' | 'number' | false }
export function DataTable({ caption, columns, rows, locale = 'en' }: { caption: string; columns: readonly DataColumn[]; rows: readonly (readonly TableCell[])[]; locale?: Locale }) {
  const id = useId();
  const [sort, setSort] = useState<{ column: number; direction: SortDirection }>({ column: 0, direction: null });
  const text = { en: { hint: 'Scroll sideways to compare columns. Select a column heading to sort; select it three times to restore source order.', source: 'Source order', rows: 'rows', asc: 'ascending', desc: 'descending' }, es: { hint: 'Deslice horizontalmente para comparar columnas. Seleccione un encabezado para ordenar; selecciónelo tres veces para restablecer el orden original.', source: 'Orden original', rows: 'filas', asc: 'ascendente', desc: 'descendente' }, pt: { hint: 'Deslize na horizontal para comparar colunas. Selecione um cabeçalho para ordenar; selecione três vezes para restaurar a ordem original.', source: 'Ordem original', rows: 'linhas', asc: 'crescente', desc: 'decrescente' } }[locale];
  const visible = sortedTableRows(rows, sort.column, sort.direction, columns[sort.column]?.sort || 'text', locale);
  return <figure className={styles.tableFigure}>
    <p id={`${id}-hint`} className={styles.tableHint}>{text.hint}</p>
    <div className={styles.tableScroll} role="region" aria-label={caption} aria-describedby={`${id}-hint`} tabIndex={0}>
      <table className={styles.table}>
        <caption>{caption}</caption>
        <thead><tr>{columns.map((column, index) => <th scope="col" key={index} aria-sort={sort.column === index && sort.direction ? sort.direction : undefined}>
          {column.sort === false ? column.label : <button type="button" onClick={() => setSort({ column: index, direction: sort.column !== index || !sort.direction ? 'ascending' : sort.direction === 'ascending' ? 'descending' : null })}>{column.label}<svg width="12" height="16" viewBox="0 0 12 16" fill="none" stroke="currentColor" aria-hidden="true"><path d={sort.column === index && sort.direction === 'ascending' ? 'm2 6 4-4 4 4M6 2v12' : sort.column === index && sort.direction === 'descending' ? 'm2 10 4 4 4-4M6 14V2' : 'm2 5 4-3 4 3m-8 6 4 3 4-3'} /></svg></button>}
        </th>)}</tr></thead>
        <tbody>{visible.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => cellIndex === 0 ? <th scope="row" key={cellIndex}>{cell.text}</th> : <td key={cellIndex}>{cell.text}</td>)}</tr>)}</tbody>
      </table>
    </div>
    <p className={styles.tableHint} role="status" aria-live="polite">{rows.length} {text.rows} · {sort.direction ? `${columns[sort.column].label}: ${sort.direction === 'ascending' ? text.asc : text.desc}` : text.source}</p>
  </figure>;
}
