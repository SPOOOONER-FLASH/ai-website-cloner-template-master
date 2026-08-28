"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "./Button";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

interface Web3FormsResponse {
  success?: boolean;
  message?: string;
}

const FIELD_CLASS =
  "field min-h-42 w-full rounded-card border border-line bg-surface px-16 py-10 text-c1 text-ink placeholder:text-ink-secondary";

export function NewsletterForm() {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const accessKey = process.env.NEXT_PUBLIC_W3F_KEY?.trim();
    if (!accessKey) {
      setStatus("error");
      setMessage("Subscription requests are temporarily unavailable. Please contact our export team.");
      return;
    }

    setStatus("submitting");
    setMessage("");

    const form = event.currentTarget;
    const payload = new FormData(form);
    payload.set("access_key", accessKey);
    payload.set("subject", "Newsletter subscription request");
    payload.set("from_name", "Canton Hyland website");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: payload,
      });
      const result = (await response.json()) as Web3FormsResponse;

      if (!response.ok || !result.success) {
        throw new Error(result.message || "The subscription request could not be sent.");
      }

      form.reset();
      setStatus("success");
      setMessage("Thank you. Your subscription request has been sent to our export team.");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "The subscription request could not be sent. Please try again later.",
      );
    }
  }

  return (
    <form className="space-y-32" onSubmit={handleSubmit}>
      <input
        type="checkbox"
        name="botcheck"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 gap-24 md:grid-cols-2">
        <label className="space-y-8 text-c1 text-ink">
          <span>Business email *</span>
          <input className={FIELD_CLASS} type="email" name="email" autoComplete="email" required />
        </label>
        <label className="space-y-8 text-c1 text-ink">
          <span>Name</span>
          <input className={FIELD_CLASS} type="text" name="name" autoComplete="name" />
        </label>
        <label className="space-y-8 text-c1 text-ink">
          <span>Company</span>
          <input className={FIELD_CLASS} type="text" name="company" autoComplete="organization" />
        </label>
        <label className="space-y-8 text-c1 text-ink">
          <span>Country / region</span>
          <input className={FIELD_CLASS} type="text" name="country" autoComplete="country-name" />
        </label>
      </div>

      <label className="block space-y-8 text-c1 text-ink">
        <span>Primary interest</span>
        <select className={FIELD_CLASS} name="interest" defaultValue="Product and export updates">
          <option>Product and export updates</option>
          <option>Door hardware specifications</option>
          <option>OEM and private-label development</option>
          <option>Standards and documentation</option>
          <option>Exhibitions and meetings</option>
        </select>
      </label>

      <label className="flex items-start gap-12 text-c2 text-ink-secondary">
        <input
          className="mt-4 size-16 shrink-0 accent-black"
          type="checkbox"
          name="consent"
          value="I agree to receive Canton Hyland email updates"
          required
        />
        <span>
          I agree to receive occasional product, technical-document and exhibition updates from
          Canton Hyland. I can ask to unsubscribe at any time. *
        </span>
      </label>

      <div className="flex flex-col items-start gap-16 sm:flex-row sm:items-center">
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Request subscription"}
        </Button>
        <p
          className={status === "error" ? "text-c2 text-ink" : "text-c2 text-ink-secondary"}
          role="status"
          aria-live="polite"
        >
          {message || "Business email and consent are required."}
        </p>
      </div>
    </form>
  );
}
