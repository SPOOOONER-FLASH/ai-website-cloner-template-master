import Link from "next/link";
import { productModels, type ProductModelEntry } from "@/data/product-models";
import { formatDownloadSize } from "@/data/downloads";
import { ModelPreview } from "./ModelPreview";

export function ProductModel({ model, locale = "en" }: { model: ProductModelEntry; locale?: "en" | "es" }) {
  const es = locale === "es";
  return (
    <div id={`model-${model.id}`} className="border-t border-line pt-24">
      <p className="text-c2 font-semibold uppercase text-ink-secondary">{es ? "Modelo 3D parcial" : "Partial 3D model"}</p>
      <h3 className="mt-8 text-h3 text-ink">{model.model}</h3>
      <p className="mt-16 max-w-[70ch] text-c1 text-ink">{model.scope[locale]}</p>
      <p className="mt-12 max-w-[70ch] text-c2 text-ink-secondary">{model.omissions[locale]}</p>
      <p className="mt-12 max-w-[70ch] text-c2 font-semibold text-ink">{es ? "Referencia de forma únicamente. No utilizar para fabricación, mecanizados de puerta ni instalación." : "Form reference only. Do not use for machining, door preparation or installation."}</p>
      <ModelPreview src={model.glb} model={model.model} orbit={model.orbit} locale={locale} />
      <div className="mt-24 flex flex-wrap gap-x-32 gap-y-16 text-c1 text-ink">
        <a href={model.blend} download className="short-marker short-marker-compact">Blender · {formatDownloadSize(model.blendBytes)}</a>
        <a href={model.glb} download className="short-marker short-marker-compact">GLB · {formatDownloadSize(model.glbBytes)}</a>
        <a href={model.notes} download className="short-marker short-marker-compact">{es ? "Alcance del modelo (EN/ES)" : "Model scope (EN/ES)"}</a>
      </div>
    </div>
  );
}

export function ModelLibrary({ locale = "en" }: { locale?: "en" | "es" }) {
  const es = locale === "es";
  return (
    <section id="reference-models" aria-labelledby="reference-models-title">
      <h2 id="reference-models-title" className="text-h3 text-ink">{es ? "Modelos 3D de referencia" : "3D reference models"}</h2>
      <p className="mt-16 max-w-[70ch] text-c1 text-ink-secondary">{es ? "Tres estudios exteriores basados en cotas publicadas. Son modelos parciales; el alcance de cada archivo se describe antes de la descarga." : "Three exterior studies based on published dimensions. These are partial models; each file’s scope is described before downloading."}</p>
      <div className="mt-32 space-y-48">
        {productModels.map((model) => (
          <div key={model.id}>
            <ProductModel model={model} locale={locale} />
            <Link href={`${es ? "/es" : ""}/products/${model.category}/${model.slug}/`} className="short-marker short-marker-compact mt-24 inline-block text-c1 text-ink">{es ? "Ver producto y fotografías originales" : "View product and original photographs"}</Link>
          </div>
        ))}
      </div>
    </section>
  );
}
