export type ArticleBlock = { kind: 'paragraph'; text: string } | { kind: 'heading'; text: string; id: string; level: 2 | 3 } | { kind: 'table'; headers: string[]; rows: string[][]; caption: string };
export interface TableCell { text: string; value?: number; href?: string }
export type SortDirection = 'ascending' | 'descending' | null;

function cells(line: string): string[] {
  return line.trim().replace(/^\|/, '').replace(/(?<!\\)\|$/, '').split(/(?<!\\)\|/).map(c => c.trim().replace(/\\\|/g, '|'));
}

/** True when the text has letters and every one of them is an upper-case cased letter (never for uncased scripts). */
export function isAllCaps(text: string): boolean {
  const letters = text.match(/\p{L}/gu) ?? [];
  return letters.length > 0 && letters.every(ch => /\p{Lu}/u.test(ch));
}

/** Only authored headings and well-formed tables become structure; prose is never rewritten. */
export function articleBlocks(body: readonly string[]): ArticleBlock[] {
  const ids = new Map<string, number>();
  let heading = '';
  return body.map(text => {
    const explicit = text.trim().match(/^(#{2,3})\s+([^\n]+)$/);
    /*
      Legacy ALL-CAPS headings (e.g. "LE PERÇAGE 161") still count, but only when every letter is an
      upper-case cased letter. Scripts without case (Japanese, Korean, Arabic, Chinese) always equal
      their own upper case, so the old `text === text.toLocaleUpperCase()` test turned 1,053 short
      Japanese paragraphs into <h2> (2026-10-25); in those scripts only an explicit "## " makes a heading.
    */
    const capitals = !text.includes('\n') && text.length <= 120 && !/[.!?]$/.test(text) && (text.match(/\p{L}+/gu)?.length ?? 0) >= 2 && isAllCaps(text);
    if (explicit || capitals) {
      heading = explicit ? explicit[2].trim() : text.trim();
      const base = heading.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'section';
      const count = (ids.get(base) ?? 0) + 1; ids.set(base, count);
      return { kind: 'heading', text: heading, id: count === 1 ? base : `${base}-${count}`, level: explicit?.[1] === '###' ? 3 : 2 };
    }
    const lines = text.trim().split(/\r?\n/);
    if (lines.length >= 3 && lines[0].includes('|')) {
      const headers = cells(lines[0]), separator = cells(lines[1]), rows = lines.slice(2).map(cells);
      if (headers.length >= 2 && separator.length === headers.length && separator.every(c => /^:?-{3,}:?$/.test(c)) && rows.every(r => r.length === headers.length)) {
        return { kind: 'table', headers, rows, caption: heading };
      }
    }
    return { kind: 'paragraph', text };
  });
}

export function sortedTableRows(rows: readonly (readonly TableCell[])[], column: number, direction: SortDirection, type: 'text' | 'number', locale: string): readonly (readonly TableCell[])[] {
  if (!direction) return rows;
  const compare = new Intl.Collator(locale, { sensitivity: 'base' });
  return rows.map((row, index) => ({ row, index })).sort((a, b) => {
    const left = a.row[column], right = b.row[column];
    const leftEmpty = !left || !left.text.trim() || left.text === '—' || (type === 'number' && !Number.isFinite(left.value));
    const rightEmpty = !right || !right.text.trim() || right.text === '—' || (type === 'number' && !Number.isFinite(right.value));
    if (leftEmpty || rightEmpty) return Number(leftEmpty) - Number(rightEmpty) || a.index - b.index;
    const difference = type === 'number' ? left.value! - right.value! : compare.compare(left.text, right.text);
    return difference * (direction === 'ascending' ? 1 : -1) || a.index - b.index;
  }).map(item => item.row);
}
