"use client";

import type { ReactNode } from "react";
import { useScrollSpy } from "./useScrollSpy";
import styles from "./GuidePage.module.css";

/**
 * "Models in this guide", beside the text, with the ones the current section names drawn
 * in ink (2026-10-12 preview). Which section names which model is worked out on the server
 * from the article's own words; nothing here guesses.
 */
export function GuideModelRail({
  title,
  note,
  models,
  sections,
  action,
}: {
  title: string;
  note: string;
  models: { model: string; href: string; thumb: ReactNode }[];
  sections: { id: string; models: string[] }[];
  action: { href: string; label: string };
}) {
  const { active } = useScrollSpy(sections.map((s) => s.id));
  const lit = new Set(sections.find((s) => s.id === active)?.models ?? []);
  return (
    <div className={styles.rail}>
      <p className={styles.railTitle}>
        {title} <span>· {note}</span>
      </p>
      <ul>
        {models.map((m) => (
          <li key={m.model} data-lit={lit.has(m.model)}>
            <a href={m.href}>
              {m.thumb}
              <b>{m.model}</b>
            </a>
          </li>
        ))}
      </ul>
      <a className={styles.railAction} href={action.href}>
        {action.label}
      </a>
    </div>
  );
}
