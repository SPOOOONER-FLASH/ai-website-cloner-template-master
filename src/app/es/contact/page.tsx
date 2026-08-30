import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { InquiryForm } from "@/components/site/InquiryForm";

export const metadata: Metadata = pageMetadata({
  enPath: "/contact",
  locale: "es",
  title: "Contacto — Equipo de exportación",
  description:
    "Consulte a nuestro equipo de exportación sobre producto, muestras, OEM o proyectos. Indique tipo de puerta, acabado, norma y cantidad.",
});

export default function ContactoPage() {
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout">
        <section className="col-content grid w-full grid-cols gap-x gap-y-48">
          <div className="col-span-full lg:col-span-4 xl:col-span-7">
            <h1 className="text-h1 text-ink">Contacto</h1>
            <p className="mt-24 text-c1 text-ink">
              Hable con nuestro equipo de exportación sobre selección de producto, muestras,
              trabajo OEM o una cotización de proyecto.
            </p>
            <p className="mt-24 text-c1 text-ink-secondary">
              Indique el tipo de puerta, acabado, norma aplicable, cantidad y mercado de destino.
            </p>
            <div className="mt-48 border-t border-line pt-24">
              <h2 className="text-h3 text-ink">Catálogo actual</h2>
              <a
                className="short-marker short-marker-compact mt-16 text-c1 text-brand hover:text-brand-hover"
                href="/downloads/canton-hyland-product-catalogue-2026.pdf"
                download
              >
                Descargar catálogo (PDF, 4,4 MB)
              </a>
            </div>
          </div>
          <div className="col-span-full lg:col-span-7 lg:col-start-6 xl:col-span-15 xl:col-start-10">
            <Suspense fallback={<p className="text-c1 text-ink-secondary">Preparando formulario…</p>}>
              <InquiryForm locale="es" />
            </Suspense>
          </div>
        </section>
      </div>
    </main>
  );
}
