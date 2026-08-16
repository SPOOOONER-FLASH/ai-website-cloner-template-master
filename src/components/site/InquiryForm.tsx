"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "./Button";

type SubmitStatus = "idle" | "submitting" | "success" | "error";
type Locale = "en" | "es";

interface Web3FormsResponse {
  success?: boolean;
  message?: string;
}

const FIELD_CLASS =
  "field min-h-42 w-full rounded-card border border-line bg-surface px-16 py-10 text-c1 text-ink placeholder:text-ink-secondary";

const formCopy = {
  en: {
    name: "Name *",
    email: "Business email *",
    company: "Company",
    country: "Country / region",
    product: "Product",
    model: "Model",
    application: "Application",
    select: "Select one",
    applications: [
      "Commercial project",
      "Residential project",
      "Distribution / wholesale",
      "OEM / custom development",
      "Replacement / maintenance",
    ],
    quantity: "Estimated quantity",
    requirements: "Project requirements *",
    placeholder: "Door type, dimensions, finish, standards, quantity and delivery market",
    sending: "Sending…",
    send: "Send inquiry",
    required: "Fields marked * are required.",
    unconfigured:
      "The inquiry service is not configured yet. Add NEXT_PUBLIC_W3F_KEY before publishing this form.",
    success: "Thank you. Your inquiry has been sent to our export team.",
    failure: "The inquiry could not be sent. Please try again later.",
    subject: "Website inquiry",
  },
  es: {
    name: "Nombre *",
    email: "Correo profesional *",
    company: "Empresa",
    country: "País / región",
    product: "Producto",
    model: "Modelo",
    application: "Aplicación",
    select: "Seleccione una opción",
    applications: [
      "Proyecto comercial",
      "Proyecto residencial",
      "Distribución / mayorista",
      "OEM / desarrollo a medida",
      "Repuesto / mantenimiento",
    ],
    quantity: "Cantidad estimada",
    requirements: "Requisitos del proyecto *",
    placeholder: "Tipo de puerta, dimensiones, acabado, normas, cantidad y mercado de destino",
    sending: "Enviando…",
    send: "Enviar consulta",
    required: "Los campos marcados con * son obligatorios.",
    unconfigured:
      "El servicio de consultas aún no está configurado. Añada NEXT_PUBLIC_W3F_KEY antes de publicar el formulario.",
    success: "Gracias. Su consulta se ha enviado a nuestro equipo de exportación.",
    failure: "No se pudo enviar la consulta. Inténtelo de nuevo más tarde.",
    subject: "Consulta del sitio web",
  },
} as const;

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
export function InquiryForm({ locale = "en" }: { locale?: Locale }) {
  const text = formCopy[locale];
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
      setStatusMessage(text.unconfigured);
      return;
    }

    setStatus("submitting");
    setStatusMessage("");

    const form = event.currentTarget;
    const payload = new FormData(form);
    payload.set("access_key", accessKey);
    payload.set("subject", `${text.subject}${model ? ` — ${model}` : ""}`);
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
      setStatusMessage(text.success);
    } catch (error) {
      setStatus("error");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : text.failure,
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
          <span>{text.name}</span>
          <input className={FIELD_CLASS} type="text" name="name" autoComplete="name" required />
        </label>
        <label className="space-y-8 text-c1 text-ink">
          <span>{text.email}</span>
          <input
            className={FIELD_CLASS}
            type="email"
            name="email"
            autoComplete="email"
            required
          />
        </label>
        <label className="space-y-8 text-c1 text-ink">
          <span>{text.company}</span>
          <input
            className={FIELD_CLASS}
            type="text"
            name="company"
            autoComplete="organization"
          />
        </label>
        <label className="space-y-8 text-c1 text-ink">
          <span>{text.country}</span>
          <input className={FIELD_CLASS} type="text" name="country" autoComplete="country-name" />
        </label>
        <label className="space-y-8 text-c1 text-ink">
          <span>{text.product}</span>
          <input
            className={FIELD_CLASS}
            type="text"
            name="product"
            value={product}
            onChange={(event) => setProduct(event.target.value)}
          />
        </label>
        <label className="space-y-8 text-c1 text-ink">
          <span>{text.model}</span>
          <input
            className={FIELD_CLASS}
            type="text"
            name="model"
            value={model}
            onChange={(event) => setModel(event.target.value)}
          />
        </label>
        <label className="space-y-8 text-c1 text-ink">
          <span>{text.application}</span>
          <select className={FIELD_CLASS} name="application" defaultValue="">
            <option value="" disabled>
              {text.select}
            </option>
            {text.applications.map((application) => (
              <option key={application}>{application}</option>
            ))}
          </select>
        </label>
        <label className="space-y-8 text-c1 text-ink">
          <span>{text.quantity}</span>
          <input className={FIELD_CLASS} type="text" name="quantity" inputMode="numeric" />
        </label>
      </div>

      <label className="block space-y-8 text-c1 text-ink">
        <span>{text.requirements}</span>
        <textarea
          className={`${FIELD_CLASS} min-h-160 resize-y`}
          name="message"
          placeholder={text.placeholder}
          required
        />
      </label>

      <div className="flex flex-col items-start gap-16 sm:flex-row sm:items-center">
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? text.sending : text.send}
        </Button>
        <p
          className={status === "error" ? "text-c2 text-ink" : "text-c2 text-ink-secondary"}
          role="status"
          aria-live="polite"
        >
          {statusMessage || text.required}
        </p>
      </div>
    </form>
  );
}
