import Link from "next/link";
import { productModels, type ProductModelEntry } from "@/data/product-models";
import { formatDownloadSize } from "@/data/downloads";
import { ModelPreview } from "./ModelPreview";
import type { Locale } from "@/data/site";
import { localised } from "@/lib/localised";

const COPY = {
  en: {
    partial: "Partial 3D model",
    warning: "Form reference only. Do not use for machining, door preparation or installation.",
    scope: "Model scope (EN/ES/PT)",
    libraryTitle: "3D reference models",
    libraryIntro:
      "Three exterior studies based on published dimensions. These are partial models; each file’s scope is described before downloading.",
    viewProduct: "View product and original photographs",
  },
  es: {
    partial: "Modelo 3D parcial",
    warning:
      "Referencia de forma únicamente. No utilizar para fabricación, mecanizados de puerta ni instalación.",
    scope: "Alcance del modelo (EN/ES/PT)",
    libraryTitle: "Modelos 3D de referencia",
    libraryIntro:
      "Tres estudios exteriores basados en cotas publicadas. Son modelos parciales; el alcance de cada archivo se describe antes de la descarga.",
    viewProduct: "Ver producto y fotografías originales",
  },
  pt: {
    partial: "Modelo 3D parcial",
    warning:
      "Referência de forma apenas. Não usar para fabricação, usinagem da porta ou instalação.",
    /* The document itself is bilingual EN/ES; naming it in Portuguese while the file is
       not would be a promise the download does not keep. */
    scope: "Escopo do modelo (EN/ES/PT)",
    libraryTitle: "Modelos 3D de referência",
    libraryIntro:
      "Três estudos externos baseados em cotas publicadas. São modelos parciais; o escopo de cada arquivo é descrito antes do download.",
    viewProduct: "Ver produto e fotografias originais",
  },
} as const;

export function ProductModel({ model, locale = "en" }: { model: ProductModelEntry; locale?: Locale }) {
  const t = localised(COPY, locale);
  return (
    <div id={`model-${model.id}`} className="border-t border-line pt-24">
      <p className="text-c2 font-semibold uppercase text-ink-secondary">{t.partial}</p>
      <h3 className="mt-8 text-h3 text-ink">{model.model}</h3>
      <p className="mt-16 max-w-[70ch] text-c1 text-ink">{localised(model.scope, locale)}</p>
      <p className="mt-12 max-w-[70ch] text-c2 text-ink-secondary">{localised(model.omissions, locale)}</p>
      <p className="mt-12 max-w-[70ch] text-c2 font-semibold text-ink">{t.warning}</p>
      <ModelPreview src={model.glb} model={model.model} orbit={model.orbit} locale={locale} />
      <div className="mt-24 flex flex-wrap gap-x-32 gap-y-16 text-c1 text-ink">
        <a href={model.blend} download className="short-marker short-marker-compact">Blender · {formatDownloadSize(model.blendBytes)}</a>
        <a href={model.glb} download className="short-marker short-marker-compact">GLB · {formatDownloadSize(model.glbBytes)}</a>
        <a href={model.notes} download className="short-marker short-marker-compact">{t.scope}</a>
      </div>
    </div>
  );
}

export function ModelLibrary({ locale = "en" }: { locale?: Locale }) {
  const t = localised(COPY, locale);
  const prefix = locale === "en" ? "" : `/${locale}`;
  return (
    <section id="reference-models" aria-labelledby="reference-models-title">
      <h2 id="reference-models-title" className="text-h3 text-ink">{t.libraryTitle}</h2>
      <p className="mt-16 max-w-[70ch] text-c1 text-ink-secondary">{t.libraryIntro}</p>
      <div className="mt-32 space-y-48">
        {productModels.map((model) => (
          <div key={model.id}>
            <ProductModel model={model} locale={locale} />
            <Link href={`${prefix}/products/${model.category}/${model.slug}/`} className="short-marker short-marker-compact mt-24 inline-block text-c1 text-ink">{t.viewProduct}</Link>
          </div>
        ))}
      </div>
    </section>
  );
}
