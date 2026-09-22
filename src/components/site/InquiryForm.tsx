"use client";
import type { Locale } from "@/data/site";
import { localised } from "@/lib/localised";

import { useEffect, useRef, useState } from "react";
import { submitInquiry } from "@/lib/inquiry-submit";
import { trackLead } from "@/lib/analytics-events";
import { InquirySuccess } from "./InquirySuccess";
import type { FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "./Button";
import { EmailLink } from "./EmailLink";
import { siteSettings } from "@/data/navigation";

/** Where a failed enquiry goes instead. The orders desk, not the technical one. */
const INQUIRY_ADDRESS = siteSettings.contact.email;

type SubmitStatus = "idle" | "submitting" | "success" | "error";

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
    success: "Thank you. Your inquiry has been sent to our export team.",
    failure: "We could not send this from the website.",
    failureHelp:
      "Nothing you typed is lost. Open it as an email — every field is already in the message — or copy the text below and send it to",
    openEmail: "Open this as an email",
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
    success: "Gracias. Su consulta se ha enviado a nuestro equipo de exportación.",
    failure: "No hemos podido enviarla desde la web.",
    failureHelp:
      "No se ha perdido nada de lo que ha escrito. Ábralo como correo — todos los campos ya van en el mensaje — o copie el texto de abajo y envíelo a",
    openEmail: "Abrir como correo electrónico",
    subject: "Consulta del sitio web",
  },
  pt: {
    name: "Nome *",
    email: "E-mail comercial *",
    company: "Empresa",
    country: "País / região",
    product: "Produto",
    model: "Modelo",
    application: "Aplicação",
    select: "Escolha uma opção",
    applications: [
      "Obra comercial",
      "Obra residencial",
      "Distribuição / atacado",
      "OEM / desenvolvimento sob medida",
      "Reposição / manutenção",
    ],
    quantity: "Quantidade estimada",
    requirements: "Requisitos da obra *",
    placeholder: "Tipo de porta, dimensões, acabamento, normas, quantidade e mercado de destino",
    sending: "Enviando…",
    send: "Enviar consulta",
    required: "Os campos marcados com * são obrigatórios.",
    success: "Obrigado. A sua consulta foi enviada à nossa equipe de exportação.",
    failure: "Não conseguimos enviar pelo site.",
    failureHelp:
      "Nada do que você escreveu se perdeu. Abra como e-mail — todos os campos já vão na mensagem — ou copie o texto abaixo e envie para",
    openEmail: "Abrir como e-mail",
    subject: "Consulta pelo site",
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
  const text = localised(formCopy, locale);
  const searchParams = useSearchParams();
  const [product, setProduct] = useState(() => queryValue(searchParams, "product"));
  const [model, setModel] = useState(() => queryValue(searchParams, "model"));
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  /** The typed enquiry, kept so a failed send can still be posted as an email. */
  const [fallback, setFallback] = useState("");
  const submitting = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [returnToForm, setReturnToForm] = useState(false);
  useEffect(() => {
    if (returnToForm && status === "idle") {
      formRef.current?.querySelector<HTMLInputElement>('input[name="name"]')?.focus();
      setReturnToForm(false);
    }
  }, [returnToForm, status]);

  useEffect(() => {
    setProduct(queryValue(searchParams, "product"));
    setModel(queryValue(searchParams, "model"));
  }, [searchParams]);

  /**
   * What the buyer typed, as an email they can send themselves.
   *
   * This exists because the send CAN fail, and on 2026-09-17 it always did: the Brazilian
   * session in Clarity filled this form, pressed Send three times (05:08, 05:26, 05:40),
   * rage-clicked, and left. The buyer had written a full specification into a box that
   * threw it away.
   *
   * A form that cannot deliver must not also destroy. Everything goes into a mailto so the
   * lead survives the outage, and the address is printed beside it for the many desktops
   * that have no mail client registered.
   */
  function asEmail(payload: FormData): string {
    const labelled: [string, string][] = [
      [text.name, "name"],
      [text.email, "email"],
      [text.company, "company"],
      [text.country, "country"],
      [text.product, "product"],
      [text.model, "model"],
      [text.application, "application"],
      [text.quantity, "quantity"],
      [text.requirements, "message"],
    ];
    return labelled
      .map(([label, field]) => [label.replace(" *", ""), String(payload.get(field) ?? "").trim()])
      .filter(([, value]) => value.length > 0)
      .map(([label, value]) => `${label}: ${value}`)
      .join("\n");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;

    const form = event.currentTarget;
    const payload = new FormData(form);
    const accessKey = process.env.NEXT_PUBLIC_W3F_KEY?.trim();

    const fail = (message: string) => {
      setStatus("error");
      setStatusMessage(message);
      setFallback(asEmail(payload));
    };

    if (!accessKey) {
      /*
        The visitor is never shown the name of an environment variable. That string was on
        the live site until 2026-09-17: a page whose whole argument is "this factory is
        careful" answering a buyer's enquiry with a deployment note.
      */
      console.warn(
        "InquiryForm: NEXT_PUBLIC_W3F_KEY is not set, so the form cannot post to Web3Forms. " +
          "See docs/collaboration/CLIENT-RUNBOOK.md.",
      );
      fail(text.failure);
      return;
    }

    setStatus("submitting");
    submitting.current = true;
    setStatusMessage("");

    payload.set("access_key", accessKey);
    payload.set("subject", `${text.subject}${model ? ` — ${model}` : ""}`);
    payload.set("from_name", "Canton Hyland website");

    try {
      await submitInquiry(payload);

      // 询盘已经送达。计数失败绝不能把成功面板带下去 —— trackLead 自身不抛。
      trackLead({ locale, model, page: globalThis.location?.pathname });

      form.reset();
      setProduct("");
      setModel("");
      setFallback("");
      setStatus("success");
      setStatusMessage(text.success);
    } catch (error) {
      /*
        The service's own error text is not shown. It is written in English for a
        developer ("Invalid access key"), and it tells a buyer nothing they can act on —
        the next line does.
      */
      fail(error instanceof DOMException && error.name === "TimeoutError"
        ? localised({ en: "We could not confirm delivery. Your message may have been received. You can contact us by email to check before sending again.", es: "No hemos podido confirmar la entrega. Es posible que su mensaje se haya recibido. Puede consultarnos por correo antes de volver a enviarlo.", pt: "Não foi possível confirmar a entrega. Sua mensagem pode ter sido recebida. Consulte-nos por e-mail antes de enviar novamente." }, locale)
        : text.failure);
    } finally {
      submitting.current = false;
    }
  }

  if (status === "success") return <InquirySuccess locale={locale} onAnother={() => { setStatus("idle"); setStatusMessage(""); setReturnToForm(true); }} />;

  return (
    <form ref={formRef} className="space-y-32" onSubmit={handleSubmit} noValidate={false} aria-busy={status === "submitting"}>
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

      {status === "error" && fallback ? (
        <div className="border border-line bg-surface p-24">
          <p className="max-w-[64ch] text-c1 text-ink">
            {text.failureHelp}{" "}
            <EmailLink
              address={INQUIRY_ADDRESS}
              className="short-marker short-marker-compact text-brand hover:text-brand-hover"
            />
          </p>
          <div className="mt-16">
            <a
              className="short-marker short-marker-compact text-c1 text-brand hover:text-brand-hover"
              href={`mailto:${INQUIRY_ADDRESS}?subject=${encodeURIComponent(
                `${text.subject}${model ? ` — ${model}` : ""}`,
              )}&body=${encodeURIComponent(fallback.slice(0, 1500))}`}
            >
              {text.openEmail}
            </a>
          </div>
          <textarea
            readOnly
            value={fallback}
            aria-label={text.requirements.replace(" *", "")}
            className={`${FIELD_CLASS} mt-16 min-h-160 resize-y font-mono text-c2`}
          />
        </div>
      ) : null}
    </form>
  );
}
