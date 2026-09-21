import assert from 'node:assert/strict';
import test from 'node:test';
import { articleBlocks, sortedTableRows } from './article-layout.ts';
test('headings get unique stable anchors, without treating codes as headings', () => {
  const blocks = articleBlocks(['Intro.', 'MEASURING YOUR DOOR', '## Measuring your door', 'EN 1303']);
  assert.deepEqual(blocks.filter(b => b.kind === 'heading').map(b => b.id), ['measuring-your-door', 'measuring-your-door-2']);
  assert.equal(blocks.at(-1)?.kind, 'paragraph');
});
test('tables preserve escaped pipes and reject malformed rows intact', () => {
  const raw = '| Code | Note |\n| --- | --- |\n| A | Left \\| right |';
  const table = articleBlocks([raw])[0];
  assert.equal(table.kind, 'table');
  if (table.kind === 'table') assert.equal(table.rows[0][1], 'Left | right');
  const bad = raw + '\n| missing cell |';
  assert.deepEqual(articleBlocks([bad])[0], { kind: 'paragraph', text: bad });
});
test('sorting uses explicit numeric values, keeps empty cells last and never mutates source', () => {
  const rows = [[{ text: '3/8 in', value: .375 }], [{ text: '1/2 in', value: .5 }], [{ text: '—' }]];
  assert.equal(sortedTableRows(rows, 0, 'descending', 'number', 'en')[0][0].text, '1/2 in');
  assert.equal(sortedTableRows(rows, 0, 'ascending', 'number', 'en').at(-1)?.[0].text, '—');
  assert.equal(rows[0][0].text, '3/8 in');
  assert.deepEqual(sortedTableRows(rows, 0, null, 'number', 'en'), rows);
});
