import type { Project } from "./types";

/**
 * Representative application packages, not named completed projects.
 *
 * The client has not supplied approved project names, locations, architects, completion
 * years or installation photography. These entries therefore demonstrate how Canton
 * Hyland products can be scheduled together without implying a customer reference.
 * Replace `referenceStatus` only after documentary approval from the project owner.
 */
export const projects: Project[] = [
  {
    slug: "commercial-fire-egress-hardware",
    name: "Commercial Fire-Egress Hardware Package",
    nameEs: "Paquete de herrajes para evacuación comercial",
    referenceStatus: "representative-application",
    buildingType: "Commercial + Institutional",
    buildingTypeEs: "Comercial + Institucional",
    summary:
      "A representative schedule combining single-point, double-door and alarmed panic hardware for controlled escape routes.",
    summaryEs:
      "Una propuesta que combina herrajes antipánico de un punto, doble puerta y alarma para rutas de evacuación controladas.",
    body: [
      "This application concept starts with the escape strategy: door handing, active and inactive leaves, fire-door requirements and the outside-access condition are confirmed before hardware selection.",
      "The product group can combine model 305 for a single leaf, 309-D for paired doors and model 314 where an alarmed exit is required. Final compliance depends on the complete tested doorset and the exact report scope.",
      "Canton Hyland can support distributors and project buyers with schedule review, finish coordination, samples and export documentation.",
    ],
    bodyEs: [
      "La propuesta parte de la estrategia de evacuación: sentido de apertura, hojas activa e inactiva, requisitos de puerta cortafuego y acceso exterior.",
      "La familia puede combinar el modelo 305 para una hoja, 309-D para puertas dobles y 314 cuando se requiere alarma. La conformidad final depende del conjunto ensayado y del alcance exacto del informe.",
      "Canton Hyland apoya a distribuidores y compradores con revisión de cuadros, coordinación de acabados, muestras y documentación de exportación.",
    ],
    productModels: ["305", "309-D", "314", "320"],
    heroImage: {
      src: "/images/company/hero-panic-exit-banner.webp",
      ratio: "2880 / 1391",
      label: "Representative commercial escape-route doors with panic exit hardware",
    },
    gallery: [
      {
        src: "/images/company/showroom-emergency-hardware.webp",
        ratio: "3 / 2",
        label: "Emergency exit hardware displayed for schedule review",
      },
      {
        src: "/images/products/305-fire-door-panic-exit-device.webp",
        ratio: "1 / 1",
        label: "Model 305 fire door panic exit device",
      },
    ],
    seoTitle: "Commercial Fire-Egress Hardware Application | Canton Hyland",
    seoDescription:
      "Representative panic-exit hardware package linking models 305, 309-D, 314 and 320 for commercial escape routes.",
  },
  {
    slug: "hospitality-residential-door-package",
    name: "Hospitality + Residential Door Package",
    nameEs: "Paquete para puertas residenciales y hoteleras",
    referenceStatus: "representative-application",
    buildingType: "Hospitality + Residential",
    buildingTypeEs: "Hotelero + Residencial",
    summary:
      "A coordinated lever, tubular lock and deadbolt palette for guestrooms, apartments and private interior doors.",
    summaryEs:
      "Una gama coordinada de manillas, cerraduras tubulares y cerrojos para habitaciones, apartamentos y puertas interiores.",
    body: [
      "This representative package groups hardware by room function, privacy requirement and finish rather than treating every opening as the same door.",
      "Matt-black tubular levers can establish the visual language, while stainless lever sets and keyed deadbolts cover higher-use or perimeter openings. Keying requirements are confirmed before cylinders are scheduled.",
      "Samples and finish boards should be approved under the actual project lighting before production quantities are released.",
    ],
    bodyEs: [
      "Esta propuesta agrupa el herraje según la función del espacio, la privacidad y el acabado, sin tratar todas las puertas como iguales.",
      "Las manillas tubulares negras pueden definir el lenguaje visual; los juegos de acero inoxidable y los cerrojos cubren accesos de mayor uso o perímetro.",
      "Las muestras y los acabados deben aprobarse bajo la iluminación real del proyecto antes de liberar la producción.",
    ],
    productModels: [
      "Black Tubular Lever Lock Set",
      "Stainless Steel Lever Handle Lock",
      "Tubular Knob Lock",
      "ANSI Grade 3 Keyed Deadbolt",
    ],
    heroImage: {
      src: "/images/company/hero-modern-tubular-lock.webp",
      ratio: "1920 / 754",
      label: "Representative residential interior with a modern matt-black tubular lever lock",
    },
    gallery: [
      {
        src: "/images/company/hero-grip-handle-banner.webp",
        ratio: "2880 / 1481",
        label: "Representative timber doors with coordinated lever and grip hardware",
      },
      {
        src: "/images/products/ansi-grade-3-keyed-deadbolt.webp",
        ratio: "1 / 1",
        label: "ANSI Grade 3 keyed deadbolt set",
      },
    ],
    seoTitle: "Hospitality and Residential Door Hardware | Canton Hyland",
    seoDescription:
      "Representative lever, tubular lock and deadbolt package for hospitality and residential door schedules.",
  },
  {
    slug: "glass-entrance-hardware-package",
    name: "Glass Entrance Hardware Package",
    nameEs: "Paquete de herrajes para entradas de vidrio",
    referenceStatus: "representative-application",
    buildingType: "Retail + Workplace",
    buildingTypeEs: "Comercial + Oficinas",
    summary:
      "A representative frameless-glass entrance package combining patch fittings, pull handles and concealed floor hardware.",
    summaryEs:
      "Una propuesta para entradas de vidrio sin marco con herrajes patch, tiradores y mecanismos de suelo ocultos.",
    body: [
      "The glass thickness, door mass, opening angle and floor build-up must be coordinated before patch fittings and floor hardware are selected.",
      "Pull-handle centres and projection are reviewed against the architectural elevation, while visible stainless components are kept in one finish family.",
      "Final drilling templates and glass preparation drawings must come from the confirmed product set, not from a generic detail.",
    ],
    bodyEs: [
      "El espesor y peso del vidrio, el ángulo de apertura y la composición del suelo se coordinan antes de seleccionar herrajes y mecanismos.",
      "Los centros y la proyección de los tiradores se revisan con el alzado arquitectónico y los componentes visibles mantienen una misma familia de acabado.",
      "Las plantillas de perforación y los planos de preparación del vidrio deben proceder del conjunto de producto confirmado.",
    ],
    productModels: [
      "Glass Door Patch Fitting Set",
      "Stainless Steel Glass Door Pull Handle",
      "Wooden Door Floor Hinge",
    ],
    heroImage: {
      src: "/images/products/glass-door-patch-fitting-set.webp",
      ratio: "1 / 1",
      label: "Representative stainless steel patch fitting set for a frameless glass entrance",
    },
    gallery: [
      {
        src: "/images/products/stainless-steel-glass-door-pull-handle.webp",
        ratio: "1 / 1",
        label: "Stainless steel pull handles for glass doors",
      },
      {
        src: "/images/products/wooden-door-floor-hinge.webp",
        ratio: "1 / 1",
        label: "Concealed floor hinge hardware",
      },
    ],
    seoTitle: "Glass Entrance Hardware Application | Canton Hyland",
    seoDescription:
      "Representative glass entrance package with patch fittings, pull handles and concealed floor hardware.",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getAllProjectParams(): { slug: string }[] {
  return projects.map((project) => ({ slug: project.slug }));
}
