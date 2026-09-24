import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getAllGuideParams, getPublishedGuides } from '@/data/guides';
import { localisedHref } from '@/lib/spanish-mirror';
import type { Locale } from '@/data/site';
import { guideTopic, isGuideProductPhoto, type GuideLibraryEntry } from '@/lib/guide-library';
import { GuideLibrary } from './GuideLibrary';
import styles from './GuideEditorial.module.css';

const COPY = {
  en: {
    label: 'Guides', title: 'The details behind the door.',
    intro: 'Hardware guides for the decisions before a purchase order. Dimensions, materials, standards and the questions worth asking.',
    find: 'Find a guide', read: 'Read the guide',
    material: 'Material. Surface. Character.',
    materialText: 'A finish code is more than a color. Explore the published codes and the differences that matter when specifying hardware.',
    evidence: 'Start with the evidence.',
    evidenceText: 'Every figure should lead back to a published source. Where a value is not published, we say so rather than estimate it.',
    documents: 'Explore available documents', contact: 'Discuss your requirements',
  },
  es: {
    label: 'Guías', title: 'Los detalles detrás de la puerta.',
    intro: 'Guías de herrajes para decidir antes de hacer un pedido. Medidas, materiales, normas y las preguntas que conviene hacer.',
    find: 'Buscar una guía', read: 'Leer la guía',
    material: 'Material. Acabado. Carácter.',
    materialText: 'Un código de acabado es más que un color. Consulte los códigos publicados y las diferencias que importan al especificar herrajes.',
    evidence: 'Empiece por la documentación.',
    evidenceText: 'Cada cifra debe remitir a una fuente publicada. Cuando un valor no está publicado, lo indicamos en lugar de estimarlo.',
    documents: 'Consultar documentos disponibles', contact: 'Consultar sus requisitos',
  },
  pt: {
    label: 'Guias', title: 'Os detalhes por trás da porta.',
    intro: 'Guias de ferragens para decidir antes de fazer um pedido. Medidas, materiais, normas e as perguntas que vale a pena fazer.',
    find: 'Buscar um guia', read: 'Ler o guia',
    material: 'Material. Acabamento. Personalidade.',
    materialText: 'Um código de acabamento é mais do que uma cor. Consulte os códigos publicados e as diferenças que importam ao especificar ferragens.',
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
    image: isGuideProductPhoto(article.heroImage.src) ? {
      src: article.heroImage.src,
      label: (locale === 'es' ? article.heroImage.labelEs : locale === 'pt' ? article.heroImage.labelPt : undefined) || article.heroImage.label,
    } : undefined,
  }));
  const featured = entries.find(entry => entry.slug === 'euro-cylinder-size-chart-2026');
  const material = entries.find(entry => entry.slug === 'finish-code-reference-2026');
  return <main className={styles.page}>
    <section className={styles.hero}>
      <div>
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
        <h2>{featured.title}</h2>
        <span className={styles.textLink}>{t.read}<ArrowUpRight size={18} aria-hidden="true" /></span>
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
