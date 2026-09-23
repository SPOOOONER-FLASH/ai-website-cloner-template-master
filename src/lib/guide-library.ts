export type GuideTopic = 'fit' | 'materials' | 'standards' | 'buying' | 'other';

const TOPICS: Record<Exclude<GuideTopic, 'other'>, readonly string[]> = {
  fit: ['backset-door-thickness-chart', 'mortise-lock-case-comparison', 'commercial-lock-function-decision', 'dimensional-interchangeability', 'door-closer-mounting-positions', 'door-closer-power-size', 'door-preparation-161-and-86', 'door-thickness-to-cylinder-length', 'euro-cylinder-size-chart', 'exit-device-outside-trim-functions', 'glass-door-thickness-and-cutouts', 'hardware-refurbishment-survey', 'hinge-grades-and-count', 'key-blanks-and-restricted-profiles', 'master-key-hierarchy-planning', 'spindle-sizes-and-length', 'strike-plates-and-keeps', 'universal-vs-handed-hardware'],
  materials: ['brass-alloys-and-dezincification', 'chrome-finish-differences', 'finish-code-reference', 'powder-coating-and-ral', 'stainless-grade-selection-201-304-316', 'zinc-alloy-die-cast-hardware'],
  standards: ['certification-and-test-validation', 'corrosion-resistance-en-1670', 'cycle-testing-durability-grades', 'en-1125-vs-en-179', 'en-ansi-bhma-cross-reference', 'fire-door-hardware-what-must-be-rated', 'lever-return-and-en-1906', 'material-traceability-mill-certs'],
  buying: ['container-loading-door-hardware', 'door-hardware-hs-codes', 'hardware-warranty-what-it-covers', 'moq-tooling-and-lead-time', 'qualifying-a-hardware-supplier', 'samples-and-incoming-inspection', 'specification-section-08-71-00', 'submittal-package-contents', 'technical-drawings-what-to-expect'],
};

export function guideTopic(slug: string): GuideTopic {
  const base = slug.replace(/-\d{4}$/, '');
  return (Object.keys(TOPICS) as Exclude<GuideTopic, 'other'>[]).find(topic => TOPICS[topic].includes(base)) ?? 'other';
}

export interface GuideLibraryEntry {
  slug: string;
  title: string;
  summary: string;
  topic: GuideTopic;
  models: string[];
  image?: { src: string; label: string };
}

function normalize(value: string) {
  return value.normalize('NFKD').replace(/\p{M}/gu, '').toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

export function filterGuides(entries: readonly GuideLibraryEntry[], query: string, topic: GuideTopic | 'all') {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  return entries.filter(entry => {
    if (topic !== 'all' && entry.topic !== topic) return false;
    const haystack = normalize([entry.title, entry.summary, entry.slug, ...entry.models].join(' '));
    return terms.every(term => haystack.includes(term));
  });
}

export function isGuideProductPhoto(src?: string): src is string {
  return Boolean(src && !src.includes('guides-reference-desk-'));
}
