"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/site/Button";
import { contactHref } from "@/lib/inquiry-prefill";
import { MAX_BRANCH, MAX_CHANGE, branchLevels, flatten, keyPlan, validPlan, type Levels } from "@/lib/tools/master-key";
import { FIELD_CLASS, RESULT_KICKER, fill, prefixOf } from "./shared";

/**
 * Master key plan → key symbols and a keying-schedule CSV (2026-10-19). Symbols are
 * src/lib/tools/master-key.ts; words arrive translated from the server.
 */
export interface MasterKeyCopy {
  levels: string;
  /** {n} */
  levelOption: string;
  /** Labels for the branch inputs, top first, per plan size. */
  branch: Record<"3" | "4" | "5", string[]>;
  changeKeys: string;
  roles: Record<string, string>;
  colSymbol: string;
  colRole: string;
  colAbove: string;
  /** {n} */
  totalKeys: string;
  /** {n} */
  totalChange: string;
  /** {shown} {total} */
  truncated: string;
  download: string;
  invalid: string;
  capacity: string;
  quoteCta: string;
  product: string;
  /** CSV header cells, in the order of the keying-schedule template. */
  csv: string[];
}

const MAX_ROWS = 120;
const numOf = (s: string) => (s.trim() === "" ? Number.NaN : Number(s));

export function MasterKeyPlanner({
  locale,
  copy,
  products,
}: {
  locale: string;
  copy: MasterKeyCopy;
  products: ReactNode;
}) {
  const [levels, setLevels] = useState<Levels>(3);
  const [branches, setBranches] = useState<string[]>(["2", "2", "2"]);
  const [change, setChange] = useState("5");
  const counts = branches.slice(0, branchLevels(levels)).map(numOf);
  const input = { levels, branches: counts, changeKeys: numOf(change) };
  const ok = validPlan(input);
  const nodes = ok ? flatten(keyPlan(input)) : [];
  const changeCount = nodes.filter((n) => n.role === "CK").length;
  const summary = ok ? `${fill(copy.totalKeys, { n: String(nodes.length) })} · ${fill(copy.totalChange, { n: String(changeCount) })}` : copy.invalid;
  const quote = contactHref(prefixOf(locale), {
    product: copy.product,
    note: ok
      ? `${fill(copy.levelOption, { n: String(levels) })}: ${counts.join(" / ")} / ${change.trim()}\n${summary}`
      : undefined,
    from: "tools/master-key-plan-generator",
  });

  const download = () => {
    const cell = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const lines = [copy.csv.map(cell).join(",")];
    for (const n of nodes) if (n.role === "CK") lines.push(["", "", n.symbol, n.above.join(" "), "", ""].map(cell).join(","));
    const url = URL.createObjectURL(new Blob([`﻿${lines.join("\r\n")}`], { type: "text/csv;charset=utf-8" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: "keying-schedule.csv" });
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <section className="col-content grid grid-cols gap-x gap-y-48">
        <p className="sr-only" aria-live="polite">
          {summary}
        </p>
        <form className="col-span-full space-y-24 lg:col-span-5 xl:col-span-9" onSubmit={(e) => e.preventDefault()}>
          <label className="block space-y-8 text-c1 text-ink">
            <span>{copy.levels}</span>
            <select className={FIELD_CLASS} value={levels} onChange={(e) => setLevels(Number(e.target.value) as Levels)}>
              {([3, 4, 5] as const).map((n) => (
                <option key={n} value={n}>
                  {fill(copy.levelOption, { n: String(n) })}
                </option>
              ))}
            </select>
          </label>
          {copy.branch[String(levels) as "3" | "4" | "5"].map((label, i) => (
            <label key={label} className="block space-y-8 text-c1 text-ink">
              <span>
                {label} (1–{MAX_BRANCH})
              </span>
              <input
                className={FIELD_CLASS}
                inputMode="numeric"
                value={branches[i]}
                onChange={(e) => setBranches((b) => b.map((v, j) => (j === i ? e.target.value : v)))}
              />
            </label>
          ))}
          <label className="block space-y-8 text-c1 text-ink">
            <span>
              {copy.changeKeys} (1–{MAX_CHANGE})
            </span>
            <input className={FIELD_CLASS} inputMode="numeric" value={change} onChange={(e) => setChange(e.target.value)} />
          </label>
        </form>
        <div className="col-span-full lg:col-span-5 lg:col-start-7 xl:col-span-10 xl:col-start-15">
          <p className={RESULT_KICKER}>{summary}</p>
          {ok ? (
            <>
              <div className="mt-16 max-h-[32rem] overflow-auto">
                <table className="w-full min-w-[24rem] border-collapse text-start">
                  <thead>
                    <tr className="border-b border-line">
                      {[copy.colSymbol, copy.colRole, copy.colAbove].map((h) => (
                        <th key={h} scope="col" className="py-8 pe-16 text-c2 font-semibold text-ink-secondary">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {nodes.slice(0, MAX_ROWS).map((n) => (
                      <tr key={n.symbol} className="border-b border-line">
                        <th scope="row" className="py-8 pe-16 text-c1 font-semibold tabular-nums text-ink">
                          {n.symbol}
                        </th>
                        <td className="py-8 pe-16 text-c1 text-ink">{copy.roles[n.role]}</td>
                        <td className="py-8 text-c1 tabular-nums text-ink-secondary">{n.above.join(" · ") || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {nodes.length > MAX_ROWS ? (
                <p className="mt-8 text-c2 text-ink-secondary">
                  {fill(copy.truncated, { shown: String(MAX_ROWS), total: String(nodes.length) })}
                </p>
              ) : null}
              <div className="mt-24 flex flex-wrap gap-16">
                <Button onClick={download} variant="secondary">
                  {copy.download}
                </Button>
                <Button href={quote}>{copy.quoteCta}</Button>
              </div>
            </>
          ) : null}
          <p className="mt-24 text-c2 text-ink-secondary">{copy.capacity}</p>
        </div>
      </section>
      {products}
    </>
  );
}
