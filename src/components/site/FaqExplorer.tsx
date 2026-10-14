"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./FaqPage.module.css";

type Group = { title: string; items: { question: string; answer: string }[] };
type Labels = { search: string; placeholder: string; count: string; none: string; ask: string; askHref: string };

/**
 * The FAQ's working half (2026-10-13, from the preview the client approved): a search over the
 * questions and answers, a group index that follows the reader, and answers that open in place.
 * Every answer is in the HTML from the start; closed ones are only collapsed, so search engines
 * and FaqJsonLd see the same text a reader can open.
 */
export function FaqExplorer({ groups, labels }: { groups: Group[]; labels: Labels }) {
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(() => new Set(["0-0"]));
  const [current, setCurrent] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);
  const term = q.trim().toLowerCase();

  const shown = useMemo(() => {
    let n = 0;
    return groups.map((g, gi) => g.items.map((it, ii) => ({ ...it, key: `${gi}-${ii}`, no: ++n }))
      .filter((it) => !term || `${it.question} ${it.answer}`.toLowerCase().includes(term)));
  }, [groups, term]);
  const count = shown.reduce((n, g) => n + g.length, 0);

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) setCurrent(Number((e.target as HTMLElement).dataset.gi));
    }, { rootMargin: "-30% 0px -60% 0px" });
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [term]);

  const toggle = (k: string) => setOpen((s) => {
    const next = new Set(s);
    if (next.has(k)) next.delete(k);
    else next.add(k);
    return next;
  });

  return (
    <div className="col-content grid w-full grid-cols gap-x gap-y-32">
      <div className="col-span-full xl:col-span-7">
        <div className={styles.sticky}>
          <label className="block">
            <span className="text-c2 text-ink-secondary">{labels.search}</span>
            <input className={styles.search} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={labels.placeholder} />
          </label>
          <p className="mt-12 text-c2 text-ink-secondary" aria-live="polite">
            {labels.count.replace("{shown}", String(count)).replace("{total}", String(total))}
          </p>
          <ol className={styles.index}>
            {groups.map((g, gi) => (
              <li key={g.title} data-on={gi === current || undefined} data-empty={!shown[gi].length || undefined}>
                <a href={`#faq-group-${gi}`}><span>{g.title}</span><span className="text-c2 text-ink-secondary">{shown[gi].length}</span></a>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="col-span-full min-w-0 xl:col-span-16 xl:col-start-9">
        {groups.map((g, gi) => (
          <section key={g.title} id={`faq-group-${gi}`} data-gi={gi} ref={(el) => { refs.current[gi] = el; }} className={styles.group} hidden={!shown[gi].length} aria-labelledby={`faq-group-${gi}-title`}>
            <h2 id={`faq-group-${gi}-title`} className="text-h3 text-ink">{g.title}</h2>
            <ul className={styles.list}>
              {shown[gi].map((it) => {
                const on = open.has(it.key) || !!term;
                return (
                  <li key={it.key} className={styles.qa} data-open={on || undefined}>
                    <h3>
                      <button type="button" aria-expanded={on} aria-controls={`faq-a-${it.key}`} onClick={() => toggle(it.key)}>
                        <span className={styles.no}>{String(it.no).padStart(2, "0")}</span>
                        <span className={styles.q}>{it.question}</span>
                        <span className={styles.plus} aria-hidden="true" />
                      </button>
                    </h3>
                    <div className={styles.a} id={`faq-a-${it.key}`}><div><p>{it.answer}</p></div></div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
        {!count ? (
          <p className="text-lead text-ink">
            {labels.none.replace("{q}", q.trim())}{" "}
            <a className="short-marker text-ink" href={labels.askHref}>{labels.ask}</a>
          </p>
        ) : null}
      </div>
    </div>
  );
}
