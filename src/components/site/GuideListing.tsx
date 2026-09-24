import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getAllGuideParams, getPublishedGuides } from '@/data/guides';
import { localisedHref } from '@/lib/spanish-mirror';
import type { Locale } from '@/data/site';
import { guideTopic, isGuideVisual, type GuideLibraryEntry } from '@/lib/guide-library';
import { GuideLibrary } from './GuideLibrary';
import styles from './GuideEditorial.module.css';

const COPY = {
  en: {
    label: 'Guides', title: 'The details behind the door.',
    intro: 'Hardware guides for the decisions before a purchase order. Dimensions, materials, standards and the questions worth asking.',
    featured: 'Featured guide',
    find: 'Find a guide', read: 'Read the guide',
    material: 'Know the material.',
    materialText: 'Brass is an alloy family, not a single promise. Understand the grades, where they belong, and what to ask before placing an order.',
    evidence: 'Start with the evidence.',
    evidenceText: 'Every figure should lead back to a published source. Where a value is not published, we say so rather than estimate it.',
    documents: 'Explore available documents', contact: 'Discuss your requirements',
  },
  es: {
    label: 'Guías', title: 'Los detalles detrás de la puerta.',
    intro: 'Guías de herrajes para decidir antes de hacer un pedido. Medidas, materiales, normas y las preguntas que conviene hacer.',
    featured: 'Guía destacada',
    find: 'Buscar una guía', read: 'Leer la guía',
    material: 'Conozca el material.',
    materialText: 'El latón es una familia de aleaciones, no una promesa única. Conozca sus grados, usos y qué preguntar antes de hacer un pedido.',
    evidence: 'Empiece por la documentación.',
    evidenceText: 'Cada cifra debe remitir a una fuente publicada. Cuando un valor no está publicado, lo indicamos en lugar de estimarlo.',
    documents: 'Consultar documentos disponibles', contact: 'Consultar sus requisitos',
  },
  pt: {
    label: 'Guias', title: 'Os detalhes por trás da porta.',
    intro: 'Guias de ferragens para decidir antes de fazer um pedido. Medidas, materiais, normas e as perguntas que vale a pena fazer.',
    featured: 'Guia em destaque',
    find: 'Buscar um guia', read: 'Ler o guia',
    material: 'Conheça o material.',
    materialText: 'O latão é uma família de ligas, não uma promessa única. Conheça as classes, aplicações e o que perguntar antes do pedido.',
    evidence: 'Comece pela documentação.',
    evidenceText: 'Cada número deve remeter a uma fonte publicada. Quando um valor não está publicado, nós informamos em vez de estimar.',
    documents: 'Consultar documentos disponíveis', contact: 'Conversar sobre seus requisitos',
  },
} as const;

export function GuideListing({ locale = 'en' }: { locale?: Locale } = {}) {
  const t = COPY[locale];
  const base = locale === 'en' ? '' : `/${locale}`;
  /* A guide not yet translated into this page's language is left out of its library rather
     than listed under an English title (see getAllGuideParams). */
  const available = new Set(getAllGuideParams(locale).map(p => p.slug));
  const entries: GuideLibraryEntry[] = getPublishedGuides().filter(article => available.has(article.slug)).map(article => ({
    slug: article.slug,
    title: (locale === 'es' ? article.titleEs : locale === 'pt' ? article.titlePt : undefined) || article.title,
    summary: (locale === 'es' ? article.summaryEs : locale === 'pt' ? article.summaryPt : undefined) || article.summary,
    topic: guideTopic(article.slug),
    models: article.relatedModels ?? [],
    image: isGuideVisual(article.heroImage.src) ? {
      src: article.heroImage.src,
      label: (locale === 'es' ? article.heroImage.labelEs : locale === 'pt' ? article.heroImage.labelPt : undefined) || article.heroImage.label,
    } : undefined,
  }));
  const featured = entries.find(entry => entry.slug === 'door-preparation-161-and-86-2026');
  const material = entries.find(entry => entry.slug === 'brass-alloys-and-dezincification-2026');
  return <main className={styles.page}>
    <section className={styles.hero}>
      <div className={styles.heroLead}>
        <p className={styles.eyebrow}>{t.label} / Canton Hyland</p>
        <h1>{t.title}</h1>
        <p className={styles.intro}>{t.intro}</p>
        <a href="#guide-library" className={styles.textLink}>{t.find}<ArrowUpRight size={18} aria-hidden="true" /></a>
      </div>
      {featured && <Link href={localisedHref(`/guides/${featured.slug}/`, locale)} className={styles.heroFeature}>
        {featured.image && <div className={styles.heroPhoto}>
          {/* Catalogue photograph, never a generated product. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={featured.image.src} alt={featured.image.label} width="640" height="480" fetchPriority="high" />
        </div>}
        <div className={styles.heroFeatureText}>
          <p className={styles.eyebrow}>{t.featured} / 01</p>
          <h2>{featured.title}</h2>
          <span className={styles.textLink}>{t.read}<ArrowUpRight size={18} aria-hidden="true" /></span>
        </div>
      </Link>}
    </section>
    <GuideLibrary entries={entries} locale={locale} />
    {material && <section className={styles.material}>
      <div><h2>{t.material}</h2><p>{t.materialText}</p>
        <Link href={localisedHref(`/guides/${material.slug}/`, locale)} className={styles.textLink}>{t.read}<ArrowUpRight size={18} aria-hidden="true" /></Link>
      </div>
      {material.image && <Link href={localisedHref(`/guides/${material.slug}/`, locale)} className={styles.materialPhoto} aria-label={material.title}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={material.image.src} alt={material.image.label} width="640" height="480" loading="lazy" />
      </Link>}
    </section>}
    <section className={styles.evidence}><h2>{t.evidence}</h2><div><p>{t.evidenceText}</p>
      <div className={styles.links}><Link href={`${base}/downloads/`} className={styles.textLink}>{t.documents}<ArrowUpRight size={18} aria-hidden="true" /></Link>
        <Link href={`${base}/contact/`} className={styles.textLink}>{t.contact}<ArrowUpRight size={18} aria-hidden="true" /></Link></div>
    </div></section>
  </main>;
}
