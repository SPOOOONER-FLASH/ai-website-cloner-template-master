"use client";

import { useRef, useState, type FormEvent } from "react";
import siteSettings from "../../../content/site-settings.json";
import type { BauCopy, BauLocale } from "@/data/bau-2027";
import { submitInquiry } from "@/lib/inquiry-submit";
import { trackLead } from "@/lib/analytics-events";
import { Button } from "./Button";
import { PrivacyNote } from "./PrivacyNote";

const FIELD_CLASS =
  "field min-h-42 w-full rounded-card border border-line bg-surface px-16 py-10 text-c1 text-ink placeholder:text-ink-secondary";
const CHOICE_CLASS =
  "cursor-pointer border border-line bg-surface px-12 py-8 text-c2 text-ink has-[:checked]:border-ink has-[:checked]:outline has-[:checked]:outline-1 has-[:checked]:outline-ink has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand";

/* Strings the copy file does not carry: the sending state and the failure path. */
const SYSTEM = {
  en: {
    sending: "Sending…",
    failure: "We could not send this from the website. Nothing you typed is lost: open it as an email, or write to",
    openEmail: "Open this as an email",
  },
  de: {
    sending: "Wird gesendet…",
    failure: "Die Anfrage konnte nicht über die Website gesendet werden. Ihre Angaben sind nicht verloren: Öffnen Sie sie als E-Mail oder schreiben Sie an",
    openEmail: "Als E-Mail öffnen",
  },
} as const;

/**
 * The stand-meeting form. It posts through the same Web3Forms path as every other enquiry
 * on the site (src/lib/inquiry-submit.ts), to the export mailbox, with the BAU subject so
 * the reply can be sorted from ordinary enquiries. If the post fails, the whole request is
 * offered as a prepared email instead of being lost.
 */
export function BauMeetingForm({
  locale,
  copy,
  models,
}: {
  locale: BauLocale;
  copy: BauCopy["form"];
  models: string[];
}) {
  const system = SYSTEM[locale];
  const address = siteSettings.contact.email;
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [mailto, setMailto] = useState("");
  const submitting = useRef(false);

  function asEmail(payload: FormData): string {
    const rows: [string, string][] = [
      [copy.name, String(payload.get("name") ?? "")],
      [copy.company, String(payload.get("company") ?? "")],
      [copy.email, String(payload.get("email") ?? "")],
      [copy.country, String(payload.get("country") ?? "")],
      [copy.day, String(payload.get("day") ?? "")],
      [copy.time, String(payload.get("time") ?? "")],
      [copy.products, payload.getAll("products").map(String).join(", ")],
      [copy.message, String(payload.get("message") ?? "")],
    ];
    const body = rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n");
    return `mailto:${address}?subject=${encodeURIComponent(copy.subject)}&body=${encodeURIComponent(body)}`;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const form = event.currentTarget;
    const payload = new FormData(form);
    const accessKey = process.env.NEXT_PUBLIC_W3F_KEY?.trim();
    const fail = () => {
      setStatus("error");
      setMailto(asEmail(payload));
    };
    if (!accessKey) {
      console.warn("BauMeetingForm: NEXT_PUBLIC_W3F_KEY is not set. See docs/collaboration/CLIENT-RUNBOOK.md.");
      fail();
      return;
    }
    /* One readable line for the mailbox instead of a repeated "products" key. */
    const products = payload.getAll("products").map(String).join(", ");
    payload.delete("products");
    if (products) payload.set("products", products);
    payload.set("access_key", accessKey);
    payload.set("subject", copy.subject);
    payload.set("from_name", "Canton Hyland website — BAU 2027");
    submitting.current = true;
    setStatus("submitting");
    try {
      await submitInquiry(payload);
      trackLead({ locale, model: products || undefined, page: globalThis.location?.pathname });
      form.reset();
      setStatus("success");
    } catch {
      fail();
    } finally {
      submitting.current = false;
    }
  }

  if (status === "success") {
    return (
      <p role="status" className="text-c1 text-ink">
        {copy.success}
      </p>
    );
  }

  return (
    <form className="space-y-24" onSubmit={handleSubmit} aria-busy={status === "submitting"}>
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="grid grid-cols-1 gap-16 sm:grid-cols-2">
        <label className="space-y-8 text-c2 text-ink">
          <span>{copy.name} *</span>
          <input className={FIELD_CLASS} type="text" name="name" autoComplete="name" required />
        </label>
        <label className="space-y-8 text-c2 text-ink">
          <span>{copy.company}</span>
          <input className={FIELD_CLASS} type="text" name="company" autoComplete="organization" />
        </label>
        <label className="space-y-8 text-c2 text-ink">
          <span>{copy.email} *</span>
          <input className={FIELD_CLASS} type="email" name="email" autoComplete="email" required />
        </label>
        <label className="space-y-8 text-c2 text-ink">
          <span>{copy.country}</span>
          <input className={FIELD_CLASS} type="text" name="country" autoComplete="country-name" />
        </label>
      </div>

      <fieldset className="space-y-8">
        <legend className="mb-8 text-c2 text-ink">{copy.day}</legend>
        {/*
          Days as a grid of equal cells, not wrapped chips: in the 4-of-12 sidebar the German
          labels ("Donnerstag, 14. Januar") broke inside their chips and the five days ran to
          three ragged rows (client, 2026-09-28). Two columns where the column is wide enough,
          one in the sidebar below 1512px, and never a line break inside a label.
        */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2">
          {copy.days.map((day) => (
            <label key={day} className={`${CHOICE_CLASS} whitespace-nowrap text-center`}>
              <input type="radio" name="day" value={day} className="sr-only" />
              {day}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-8">
        <legend className="mb-8 text-c2 text-ink">{copy.time}</legend>
        <div className="flex flex-wrap gap-8">
          {copy.times.map((time) => (
            <label key={time} className={CHOICE_CLASS}>
              <input type="radio" name="time" value={time} className="sr-only" />
              {time}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-8 text-c2 text-ink">{copy.products}</legend>
        <div className="space-y-4">
          {models.map((model) => (
            <label key={model} className="flex cursor-pointer items-start gap-8 text-c2 text-ink">
              <input type="checkbox" name="products" value={model} className="mt-2 size-16 flex-none accent-ink" />
              <span>{model}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block space-y-8 text-c2 text-ink">
        <span>{copy.message}</span>
        <textarea className={`${FIELD_CLASS} min-h-96`} name="message" rows={4} />
      </label>

      <div className="space-y-12">
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? system.sending : copy.submit}
        </Button>
        <p className="text-c2 text-ink-secondary">{copy.privacy}</p>
        <PrivacyNote locale={locale} />
        {status === "error" ? (
          <p role="alert" className="text-c2 text-ink">
            {system.failure}{" "}
            <a href={`mailto:${address}`} className="underline">
              {address}
            </a>
            .{" "}
            <a href={mailto} className="short-marker short-marker-compact text-brand hover:text-brand-hover">
              {system.openEmail}
            </a>
          </p>
        ) : null}
      </div>
    </form>
  );
}
