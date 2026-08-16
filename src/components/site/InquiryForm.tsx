"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "./Button";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

interface Web3FormsResponse {
  success?: boolean;
  message?: string;
}

const FIELD_CLASS =
  "field min-h-42 w-full rounded-card border border-line bg-surface px-16 py-10 text-c1 text-ink placeholder:text-ink-secondary";

/** Keep query-string content useful without allowing an arbitrarily large value into the form. */
function queryValue(params: URLSearchParams, key: string): string {
  return (params.get(key) ?? "").trim().slice(0, 160);
}

/**
 * Static-export inquiry form.
 *
 * The page has no API route or Server Action: it posts directly to Web3Forms so
 * `output: "export"` remains intact. The parent page supplies the Suspense boundary
 * required by Next.js when a statically rendered Client Component reads search params.
 */
export function InquiryForm() {
  const searchParams = useSearchParams();
  const [product, setProduct] = useState(() => queryValue(searchParams, "product"));
  const [model, setModel] = useState(() => queryValue(searchParams, "model"));
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    setProduct(queryValue(searchParams, "product"));
    setModel(queryValue(searchParams, "model"));
  }, [searchParams]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const accessKey = process.env.NEXT_PUBLIC_W3F_KEY?.trim();
    if (!accessKey) {
      setStatus("error");
      setStatusMessage(
        "The inquiry service is not configured yet. Add NEXT_PUBLIC_W3F_KEY before publishing this form.",
      );
      return;
    }

    setStatus("submitting");
    setStatusMessage("");

    const form = event.currentTarget;
    const payload = new FormData(form);
    payload.set("access_key", accessKey);
    payload.set("subject", `Website inquiry${model ? ` — ${model}` : ""}`);
    payload.set("from_name", "Canton Hyland website");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: payload,
      });
      const result = (await response.json()) as Web3FormsResponse;

      if (!response.ok || !result.success) {
        throw new Error(result.message || "The inquiry could not be sent.");
      }

      form.reset();
      setStatus("success");
      setStatusMessage("Thank you. Your inquiry has been sent to our export team.");
    } catch (error) {
      setStatus("error");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "The inquiry could not be sent. Please try again later.",
      );
    }
  }

  return (
    <form className="space-y-32" onSubmit={handleSubmit} noValidate={false}>
      {/* Web3Forms honeypot: hidden from people; automated fillers expose themselves here. */}
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
          <span>Name *</span>
          <input className={FIELD_CLASS} type="text" name="name" autoComplete="name" required />
        </label>
        <label className="space-y-8 text-c1 text-ink">
          <span>Business email *</span>
          <input
            className={FIELD_CLASS}
            type="email"
            name="email"
            autoComplete="email"
            required
          />
        </label>
        <label className="space-y-8 text-c1 text-ink">
          <span>Company</span>
          <input
            className={FIELD_CLASS}
            type="text"
            name="company"
            autoComplete="organization"
          />
        </label>
        <label className="space-y-8 text-c1 text-ink">
          <span>Country / region</span>
          <input className={FIELD_CLASS} type="text" name="country" autoComplete="country-name" />
        </label>
        <label className="space-y-8 text-c1 text-ink">
          <span>Product</span>
          <input
            className={FIELD_CLASS}
            type="text"
            name="product"
            value={product}
            onChange={(event) => setProduct(event.target.value)}
          />
        </label>
        <label className="space-y-8 text-c1 text-ink">
          <span>Model</span>
          <input
            className={FIELD_CLASS}
            type="text"
            name="model"
            value={model}
            onChange={(event) => setModel(event.target.value)}
          />
        </label>
        <label className="space-y-8 text-c1 text-ink">
          <span>Application</span>
          <select className={FIELD_CLASS} name="application" defaultValue="">
            <option value="" disabled>
              Select one
            </option>
            <option>Commercial project</option>
            <option>Residential project</option>
            <option>Distribution / wholesale</option>
            <option>OEM / custom development</option>
            <option>Replacement / maintenance</option>
          </select>
        </label>
        <label className="space-y-8 text-c1 text-ink">
          <span>Estimated quantity</span>
          <input className={FIELD_CLASS} type="text" name="quantity" inputMode="numeric" />
        </label>
      </div>

      <label className="block space-y-8 text-c1 text-ink">
        <span>Project requirements *</span>
        <textarea
          className={`${FIELD_CLASS} min-h-160 resize-y`}
          name="message"
          placeholder="Door type, dimensions, finish, standards, quantity and delivery market"
          required
        />
      </label>

      <div className="flex flex-col items-start gap-16 sm:flex-row sm:items-center">
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Send inquiry"}
        </Button>
        <p
          className={status === "error" ? "text-c2 text-ink" : "text-c2 text-ink-secondary"}
          role="status"
          aria-live="polite"
        >
          {statusMessage || "Fields marked * are required."}
        </p>
      </div>
    </form>
  );
}
