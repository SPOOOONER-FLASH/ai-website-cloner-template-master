"use client";
import { useState } from 'react';
import type { Locale } from '@/data/site';
import styles from './ArticleReading.module.css';
export function DocumentPreview({ url, title, locale }: { url: string; title: string; locale: Locale }) {
  const [opened, setOpened] = useState(false);
  const text = { en: { view: 'Preview the original catalogue', fallback: 'If the PDF does not display on your device, open the original file in a new tab.', open: 'Open original PDF' }, es: { view: 'Vista previa del catálogo original', fallback: 'Si su dispositivo no muestra el PDF, abra el archivo original en otra pestaña.', open: 'Abrir PDF original' }, pt: { view: 'Prévia do catálogo original', fallback: 'Se o seu dispositivo não exibir o PDF, abra o arquivo original em outra aba.', open: 'Abrir PDF original' } }[locale];
  return <details className={styles.pdf} onToggle={event => setOpened(event.currentTarget.open)}><summary>{text.view}</summary>{opened && <><p>{text.fallback}</p><a href={url} target="_blank" rel="noopener noreferrer" className="short-marker short-marker-compact">{text.open}</a><iframe src={url} title={title} loading="lazy" /></>}</details>;
}
