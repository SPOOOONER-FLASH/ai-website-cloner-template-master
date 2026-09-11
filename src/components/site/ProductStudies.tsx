import Link from "next/link";
import { publishedProducts } from "@/data/products";
import studies from "@/data/generated/product-studies.json";

export function ProductStudies({ locale }: { locale: "en" | "es" }) {
  const es = locale === "es";
  const prefix = es ? "/es" : "";
  return (
    <main className="layout mt-32 flex-grow pb-96 lg:mt-48">
      <header className="col-content mb-32 w-full lg:mb-48">
        <Link href={`${prefix}/products/`} className="short-marker short-marker-compact text-c1 text-ink-secondary">
          {es ? "Volver al catálogo" : "Back to the catalogue"}
        </Link>
        <h1 className="mt-24 max-w-[18ch] text-h1 text-ink">{es ? "Herrajes en detalle" : "Hardware in focus"}</h1>
        <p className="mt-24 max-w-[66ch] text-c1 text-ink-secondary">
          {es ? "Cerraduras, cilindros y manijas de nuestro catálogo, presentados en composiciones de estudio. Consulte cada modelo para ver sus fotografías originales, medidas y opciones de acabado." : "Locks, cylinders and handles from our catalogue, presented in studio compositions. Open each model to explore its original photographs, dimensions and finish options."}
        </p>
        <nav aria-label={es ? "Explorar la galería" : "Explore the gallery"} className="mt-24 flex flex-wrap gap-x-32 gap-y-16 text-c1 text-ink">
          <a href="#material" className="short-marker short-marker-compact">{es ? "Material y acabado" : "Material & finish"}</a>
          <a href="#selection" className="short-marker short-marker-compact">{es ? "Modelos y componentes" : "Models & components"}</a>
          <Link href={`${prefix}/product-finder/`} className="short-marker short-marker-compact">{es ? "Buscar productos" : "Product Finder"}</Link>
        </nav>
      </header>
      <div className="col-content grid w-full grid-cols-1 gap-x-32 gap-y-64 lg:grid-cols-2 lg:gap-y-80">
        {studies.map((study, index) => {
          const models = study.slugs.map(slug => publishedProducts.find(p => p.slug === slug)).filter(p => p !== undefined);
          const shown = study.itemId === "01" ? models.filter(p => p.model !== "9080E") : models;
          const title = shown.map(p => p.model).join(" / ");
          const caption = study.itemId === "01"
            ? es ? "307 con caja de cerradura 072 y manija 015. La ficha del 307 también admite la manija 9080E. La longitud del cilindro se selecciona según el espesor de la puerta." : "307 with lock case 072 and handle 015. The 307 specification also lists handle 9080E. Cylinder length is selected for the door thickness."
            : study.itemId === "00"
              ? es ? "Modelos individuales para selección. Confirme la compatibilidad y la configuración completa antes de realizar el pedido; la composición no representa una escala de instalación." : "Individual models for selection. Confirm compatibility and the complete configuration before ordering; the composition does not represent installation scale."
              : es ? "Fotografía del producto de nuestro catálogo en una composición de estudio." : "Catalogue product photograph in a studio composition.";
          return (
            <figure key={study.id} id={index === 0 ? "material" : index === 2 ? "selection" : undefined} className={index === 2 ? "scroll-mt-128 lg:col-span-2" : "scroll-mt-128"}>
              <a href={study.src} target="_blank" rel="noreferrer" className="block focus-visible:outline-2 focus-visible:outline-offset-4" aria-label={`${es ? "Ampliar imagen de" : "Enlarge image of"} ${title}`}>
                {/* The composed images have their own responsive, static WebP exports. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={study.src} srcSet={`${study.small} 720w, ${study.src} 1440w`} sizes={index === 2 ? "(max-width: 768px) 100vw, 90vw" : "(max-width: 1024px) 100vw, 45vw"} width={study.width} height={study.height} alt={`${title} — ${es ? "composición con fotografías originales" : "original-photo composition"}`} loading={index === 0 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : "auto"} className="h-auto w-full" />
              </a>
              <figcaption className="mt-24 border-t border-line pt-16">
                <h2 className="text-h3 text-ink">{title}</h2>
                <p className="mt-12 max-w-[66ch] text-c1 text-ink-secondary">{caption}</p>
                <div className="mt-16 flex flex-wrap gap-x-24 gap-y-12">
                  {models.map(p => <Link key={p.slug} href={`${prefix}/products/${p.categoryPath[0]}/${p.slug}/`} className="short-marker short-marker-compact text-c1 text-ink">{p.model} · {es ? "Ver especificaciones" : "View specifications"}</Link>)}
                </div>
              </figcaption>
            </figure>
          );
        })}
      </div>
      <section className="col-content mt-80 w-full border-t border-line pt-32">
        <h2 className="text-h3 text-ink">{es ? "Seleccione la configuración de su puerta" : "Specify your door configuration"}</h2>
        <p className="mt-16 max-w-[66ch] text-c1 text-ink-secondary">{es ? "Indique los modelos, el espesor de la puerta y el acabado requerido para confirmar las piezas de su pedido." : "Share the models, door thickness and required finish to confirm the parts for your order."}</p>
        <Link href={`${prefix}/contact/`} className="short-marker short-marker-compact mt-24 inline-block text-c1 text-ink">{es ? "Consultar con Canton Hyland" : "Contact Canton Hyland"}</Link>
      </section>
    </main>
  );
}
