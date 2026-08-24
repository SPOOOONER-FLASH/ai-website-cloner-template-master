"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

/**
 * A short form that trades a business contact for a document.
 *
 * Separate from InquiryForm on purpose. That one asks for product, model, application
 * and quantity because a quote request needs them; asking the same nine questions for a
 * price list would cost more leads than the list is worth. Five fields is the point.
 *
 * Posts straight to Web3Forms, so `output: "export"` stays intact — no API route, no
 * server action, nothing to keep running.
 */

type Status = "idle" | "sending" | "sent" | "error";

const FIELD =
  "mt-8 w-full appearance-none border-b border-line bg-transparent pb-8 text-c1 text-ink outline-none transition-colors duration-200 focus:border-ink";

export function AssetRequestForm({
  /** What the visitor is asking for. Goes into the email subject. */
  asset,
  /** Shown after a successful send — say what happens next, not just "thanks". */
  successMessage,
}: {
  asset: string;
  successMessage: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const accessKey = process.env.NEXT_PUBLIC_W3F_KEY?.trim();

    if (!accessKey) {
      setStatus("error");
      setMessage(
        "The request service is not configured yet. Add NEXT_PUBLIC_W3F_KEY before publishing this page.",
      );
      return;
    }

    setStatus("sending");
    const payload = new FormData(form);
    payload.set("access_key", accessKey);
    payload.set("subject", `Document request — ${asset}`);
    payload.set("from_name", "Canton Hyland website");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: payload,
      });
      const result = (await response.json()) as { success?: boolean };
      if (!response.ok || !result.success) throw new Error("rejected");
      setStatus("sent");
      setMessage(successMessage);
      form.reset();
    } catch {
      setStatus("error");
      setMessage("The request could not be sent. Please email us directly instead.");
    }
  }

  if (status === "sent") {
    return (
      <p className="border-t border-line pt-16 text-c1 text-ink" role="status">
        {message}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-24 sm:grid-cols-2">
      {/* Web3Forms honeypot: hidden from people; automated fillers expose themselves. */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <label className="block">
        <span className="text-c2 text-ink-secondary">Name</span>
        <input className={FIELD} type="text" name="name" autoComplete="name" required />
      </label>

      <label className="block">
        <span className="text-c2 text-ink-secondary">Work email</span>
        <input className={FIELD} type="email" name="email" autoComplete="email" required />
      </label>

      <label className="block">
        <span className="text-c2 text-ink-secondary">Company</span>
        <input className={FIELD} type="text" name="company" autoComplete="organization" required />
      </label>

      <label className="block">
        <span className="text-c2 text-ink-secondary">Country</span>
        <input className={FIELD} type="text" name="country" autoComplete="country-name" />
      </label>

      <label className="block sm:col-span-2">
        <span className="text-c2 text-ink-secondary">What are you working on? (optional)</span>
        <textarea className={cn(FIELD, "resize-y")} name="message" rows={3} />
      </label>

      <div className="sm:col-span-2">
        <Button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Request the document"}
        </Button>
        {status === "error" ? (
          <p className="mt-16 text-c2 text-brand" role="alert">
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
