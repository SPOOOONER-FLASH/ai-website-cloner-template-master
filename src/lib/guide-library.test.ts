import test from 'node:test';
import assert from 'node:assert/strict';
import { filterGuides, guideTopic, isGuideProductPhoto, type GuideLibraryEntry } from './guide-library.ts';

const entries: GuideLibraryEntry[] = [
  { slug: 'cylinder', title: 'Cilindros: dimensiones', summary: 'Medición de la puerta', topic: 'fit', models: ['45BN'] },
  { slug: 'finish', title: 'Acabamento e aço', summary: 'Materiais e superfícies', topic: 'materials', models: ['LH851'] },
];
test('search combines accent-insensitive terms and model references with the selected topic', () => {
  assert.deepEqual(filterGuides(entries, 'medicion 45bn', 'fit'), [entries[0]]);
  assert.deepEqual(filterGuides(entries, 'ACO', 'all'), [entries[1]]);
  assert.deepEqual(filterGuides(entries, '45BN', 'materials'), []);
  assert.deepEqual(filterGuides(entries, 'unknown', 'all'), []);
  assert.deepEqual(filterGuides(entries, ' ', 'all'), entries);
});
test('curated topics have an honest fallback for future articles', () => {
  assert.equal(guideTopic('finish-code-reference-2026'), 'materials');
  assert.equal(guideTopic('door-thickness-to-cylinder-length-2026'), 'fit');
  assert.equal(guideTopic('certification-and-test-validation-2026'), 'standards');
  assert.equal(guideTopic('submittal-package-contents-2026'), 'buying');
  assert.equal(guideTopic('new-unclassified-subject-2027'), 'other');
});
test('decorative fallback backgrounds never masquerade as product thumbnails', () => {
  assert.equal(isGuideProductPhoto('/images/editorial/guides-reference-desk-1600.webp'), false);
  assert.equal(isGuideProductPhoto(undefined), false);
  assert.equal(isGuideProductPhoto('/images/products-hyde/45-bnik-lock-cylinder-2.webp'), true);
});
