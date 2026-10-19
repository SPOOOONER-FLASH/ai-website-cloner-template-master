"use client";

import { useState } from "react";
import styles from "./ProductPage.module.css";

/**
 * Copies a block of plain text — a product's spec rows for a tender, or the list of what a
 * quotation needs. From the Yuangao design 4 clause-copy button (2026-10-12 preview).
 * Falls back to a hidden textarea where the Clipboard API is blocked (http, old browsers).
 */
export function CopyText({ text, label, done }: { text: string; label: string; done: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = Object.assign(document.createElement("textarea"), { value: text });
      document.body.append(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }
  return (
    <button type="button" onClick={copy} className={styles.copy} data-copied={copied}>
      <span aria-live="polite">{copied ? done : label}</span>
    </button>
  );
}
