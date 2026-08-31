/**
 * Spanish vocabulary for the catalogue.
 *
 * This is not a translation memory and it is not fed to a machine translator. Product
 * pages are almost entirely structured text — 43 spec labels, a few hundred spec values,
 * 16 category names — so Spanish is produced by looking each term up here and composing
 * a fresh Spanish sentence from the rows, never by translating an English sentence.
 * That is what keeps the output reading like Spanish rather than like English wearing a
 * Spanish coat.
 *
 * The register is Latin American trade Spanish, because that is where the buyers are:
 * Colombia, Ecuador, Peru, Argentina, Mexico. Where peninsular and Latin usage differ,
 * Latin wins — `manija` and `cerradura de embutir` rather than `manilla` and
 * `cerradura de embutir` alone, `entrada` for backset rather than the Iberian `retranqueo`.
 *
 * A term with no entry here is LEFT IN ENGLISH by the generator and reported, rather
 * than guessed at. An invented Spanish spec term is the same class of error as an
 * invented dimension: a buyer specifies from it.
 */

/** Spec table labels. Sentence case, matching how the English side is written. */
export const SPEC_LABELS_ES: Record<string, string> = {
  Material: "Material",
  Application: "Aplicación",
  Finish: "Acabado",
  Chassis: "Chasis",
  Handing: "Mano",
  Backset: "Entrada",
  Trim: "Guarnición",
  Function: "Función",
  "Cycle life": "Vida útil",
  "Door thickness": "Espesor de puerta",
  Keying: "Amaestramiento",
  Cylinder: "Cilindro",
  Feature: "Característica",
  Strike: "Cerradero",
  Size: "Medidas",
  Length: "Longitud",
  "Deadbolt throw": "Salida del cerrojo",
  Latch: "Picaporte",
  "Latch extension": "Salida del picaporte",
  Thickness: "Espesor",
  Installation: "Instalación",
  "Centre distance": "Distancia entre ejes",
  Color: "Color",
  "Cross bore": "Perforación principal",
  "Door Type": "Tipo de puerta",
  Type: "Tipo",
  Customization: "Personalización",
  "OEM / ODM": "OEM / ODM",
  Packing: "Embalaje",
  Bolts: "Pestillos",
  "Opening Method": "Sistema de apertura",
  Operation: "Accionamiento",
  Handle: "Manija",
  "Alarm Function": "Función de alarma",
  "Unlocking Method": "Sistema de desbloqueo",
  "Optional Function": "Función opcional",
  "Key Required": "Llave requerida",
  "Outside Handle": "Manija exterior",
  Process: "Proceso",
  Weight: "Peso",
  Width: "Ancho",
  "Available lengths": "Longitudes disponibles",
  Hooks: "Ganchos",
  // arrived with the stahlock import
  "Key options": "Opciones de llave",
  "Spindle Hole": "Orificio del cuadradillo",
  "Strike Plate Material": "Material del cerradero",
  "Opening Angle": "Ángulo de apertura",
  "Max opening angle": "Ángulo máximo de apertura",
  Diameter: "Diámetro",
  "Viewing Angle": "Ángulo de visión",
  "Rosette Diameter": "Diámetro del rosetón",
  "Door Width": "Ancho de puerta",
  Capacity: "Capacidad",
  "Handle Material": "Material de la manija",
  "Tube Thickness": "Espesor del tubo",
  Opening: "Apertura",
  Includes: "Incluye",
  "Latch options": "Opciones de picaporte",
  "Spindle Material": "Material del cuadradillo",
  "Key Material": "Material de la llave",
};

/**
 * Spec values that recur across the catalogue.
 *
 * Only whole-value matches are translated. A value that is mostly a dimension
 * ("85mm", "60mm / 70mm adjustable") is handled by `translateValue` below, because the
 * number must survive untouched and only the qualifier is language.
 */
export const SPEC_VALUES_ES: Record<string, string> = {
  // materials
  "Stainless steel": "Acero inoxidable",
  "Stainless Steel": "Acero inoxidable",
  "304 Stainless Steel": "Acero inoxidable 304",
  "304SS": "Acero inoxidable 304",
  "Zinc alloy": "Zamak",
  "Zinc Alloy": "Zamak",
  Brass: "Latón",
  "Solid brass": "Latón macizo",
  Iron: "Hierro",
  "Iron case": "Cuerpo de hierro",
  "Aluminium case": "Cuerpo de aluminio",
  "Aluminium and steel": "Aluminio y acero",
  Steel: "Acero",
  "Stainless steel body": "Cuerpo de acero inoxidable",
  "Aluminum alloy": "Aleación de aluminio",

  // finishes — the trade uses these names, not literal colour words
  "Satin Nickel": "Níquel satinado",
  "Polished Brass": "Latón pulido",
  "Antique Brass": "Latón antiguo",
  "Antique Copper": "Cobre antiguo",
  "Satin Stainless": "Acero inoxidable satinado",
  "Satin Stainless Steel": "Acero inoxidable satinado",
  "Polished Stainless Steel": "Acero inoxidable pulido",
  Chrome: "Cromo",
  "Chrome Plated": "Cromado",
  "Matt Black": "Negro mate",
  White: "Blanco",
  "All Available": "Todos disponibles",
  "Spray Painting": "Pintura en polvo",
  "Polished brass": "Latón pulido",
  "Antique brass": "Latón antiguo",
  "Antique copper": "Cobre antiguo",
  "Satin nickel": "Níquel satinado",
  "Satin chrome": "Cromo satinado",
  "Chrome plated": "Cromado",
  "Satin brass": "Latón satinado",
  "Bright polished": "Pulido brillante",
  "Black nickel": "Níquel negro",
  "Satin stainless steel": "Acero inoxidable satinado",
  "Polished stainless steel": "Acero inoxidable pulido",
  "Oil-rubbed bronze": "Bronce envejecido",
  "White sprayed": "Pintado en blanco",
  "Wood-grain sprayed": "Pintado imitación madera",
  Copper: "Cobre",
  "Copper Construction": "Construcción en cobre",
  "Iron and aluminum": "Hierro y aluminio",
  "Spray painted": "Pintado con pistola",
  "PB/AB/AC/SS/SN, all available":
    "PB/AB/AC/SS/SN, todos disponibles",
  "Adjustable 60–70mm": "Regulable de 60 a 70 mm",
  "Includes 3 brass keys": "Incluye 3 llaves de latón",
  "3 nickel-plated brass keys": "3 llaves de latón niqueladas",
  "Brass cylinder with 2 brass keys": "Cilindro de latón con 2 llaves de latón",
  "Used in combination with push bar and lock":
    "Se usa en combinación con la barra antipánico y la cerradura",
  "Suitable for all types of doors": "Apto para todo tipo de puertas",
  "Safety lock with cylinder": "Cerradura de seguridad con cilindro",
  "Spray painted; various finishes available (MOQ required)":
    "Pintado con pistola; otros acabados disponibles (sujeto a pedido mínimo)",
  "Spray painted; multiple finishes available (MOQ required)":
    "Pintado con pistola; varios acabados disponibles (sujeto a pedido mínimo)",
  "OEM available with MOQ": "OEM disponible con pedido mínimo",
  // the printed finish table, with its US designations kept verbatim
  "Satin stainless steel (US32D)": "Acero inoxidable satinado (US32D)",
  "Polished stainless steel (US32)": "Acero inoxidable pulido (US32)",
  "Satin chrome (US26D)": "Cromo satinado (US26D)",
  "Bright chrome (US26)": "Cromo brillante (US26)",
  "Polished brass (US3)": "Latón pulido (US3)",
  "Satin brass (US4)": "Latón satinado (US4)",
  "Antique brass (US5)": "Latón antiguo (US5)",
  "Antique copper (US11)": "Cobre antiguo (US11)",
  "Satin nickel (US15)": "Níquel satinado (US15)",
  "Antique nickel (US15A)": "Níquel antiguo (US15A)",
  "Oil-rubbed bronze (US10B)": "Bronce envejecido (US10B)",
  "Polished satin chrome": "Cromo satinado pulido",
  "Bright nickel": "Níquel brillante",
  "Antique black": "Negro antiguo",
  "White painted": "Pintado en blanco",
  "Grey painted": "Pintado en gris",
  "Brown painted": "Pintado en marrón",
  "Blue painted": "Pintado en azul",
  "Golden painted": "Pintado en dorado",
  "Golden finish": "Acabado dorado",
  "Ivory painted": "Pintado en marfil",
  "Black painted": "Pintado en negro",
  "Red painted": "Pintado en rojo",
  "Classroom — key releases the outside knob": "Aula — la llave libera el pomo exterior",
  "Storeroom — outside knob always rigid": "Bodega — el pomo exterior siempre fijo",
  "Patio — locked by inside button": "Patio — se bloquea con el botón interior",
  // decoded function suffixes
  "Entrance — keyed outside": "Entrada — con llave por fuera",
  "Passage — latch only, no cylinder": "Paso libre — solo picaporte, sin cilindro",
  "Privacy — bathroom, turn button inside": "Privacidad — baño, botón de giro interior",

  // door types and applications
  "Fire Door": "Puerta cortafuego",
  "Fire door": "Puerta cortafuego",
  "Wooden doors": "Puertas de madera",
  "Wooden and metal doors": "Puertas de madera y metálicas",
  "Interior wooden and metal doors": "Puertas interiores de madera y metálicas",
  "Aluminium, wooden and metal doors": "Puertas de aluminio, madera y metálicas",
  "Security doors": "Puertas de seguridad",
  "Entrance doors": "Puertas de entrada",
  "Sliding doors": "Puertas corredizas",
  "Emergency and escape doors": "Puertas de emergencia y evacuación",
  "Fire-rated double escape doors": "Puertas dobles de evacuación cortafuego",
  "Residential and Commercial Use": "Uso residencial y comercial",
  "Standard residential use": "Uso residencial estándar",
  "Residential use": "Uso residencial",
  "Commercial offices, schools and heavy-duty residential":
    "Oficinas comerciales, centros educativos y uso residencial intensivo",

// frequent values the catalogue actually uses, in the client's own casing variants
  "Solid Brass": "Latón macizo",
  Aluminum: "Aluminio",
  Aluminium: "Aluminio",
  "Brass cylinder": "Cilindro de latón",
  "Brass or Stainless Steel": "Latón o acero inoxidable",
  "Stainless Steel 304": "Acero inoxidable 304",
  "Stainless Steel 304/201": "Acero inoxidable 304/201",
  "Stainless Steel+Brass": "Acero inoxidable y latón",
  "Stainless steel/Brass/Solid steel": "Acero inoxidable, latón o acero macizo",
  "Solid brass/Zinc & brass cylinder": "Latón macizo; cilindro de zamak y latón",
  "Zinc alloy, Aluminium": "Zamak y aluminio",

  // applications, as the client writes them
  "Bathroom Hotel": "Baños de hotel",
  bathroom: "Baño",
  Bathroom: "Baño",
  "living room, bathroom": "Sala y baño",
  "Living room/Bathroom": "Sala y baño",
  "bathroom, living room": "Baño y sala",
  "Monitoring Outdoor": "Vigilancia en exteriores",
  "fix the door": "Fijación de puerta",
  "Single Door": "Puerta simple",
  "Double Door": "Puerta doble",
  "wall-mount": "Montaje en pared",
  "Wall mounted": "Montaje en pared",

  "Satin nickel, chrome, antique brass, polished brass,all available":
    "Níquel satinado, cromo, latón antiguo y latón pulido; todos disponibles",
  "living room,bathroom...": "Sala, baño y otros ambientes",
  "Door Security": "Seguridad de puertas",
  "Door Safety": "Seguridad de puertas",
  "Iron+stainless steel": "Hierro y acero inoxidable",
  Available: "Disponible",
  "Stainless Steel201/304": "Acero inoxidable 201/304",
  "for lavatory or other privacy doors": "Para baños y otras puertas de privacidad",
  "Residential Doors / Interior Doors / Light Commercial Use":
    "Puertas residenciales, puertas interiores y uso comercial ligero",
  "KFC Lock Bodies, Aluminum Narrow Door Lock Bodies":
    "Cuerpos de cerradura para puertas de aluminio de perfil estrecho",
  "Surface Mounted": "De sobreponer",
  Painting: "Pintado",
  "Solid Brass Cylinder": "Cilindro de latón macizo",
  "Glass door": "Puerta de vidrio",
  "Glass Door": "Puerta de vidrio",
  "steel material with spray painting , different finishes are available .":
    "Acero con pintura en polvo; disponible en distintos acabados",
  "Screw Fixing": "Fijación con tornillos",
  "Outswing Doors": "Puertas de apertura exterior",
  "Anti Pry Protection": "Protección antipalanca",
  "Easy Installation with Complete Accessories":
    "Instalación sencilla, con todos los accesorios",
  "Box Packing": "Embalaje en caja",
  "OEM / ODM Available": "OEM / ODM disponible",
  "Push / Pull Operation": "Accionamiento de empujar y tirar",
  "Deadlatch + Hold-Back Function": "Picaporte con bloqueo y función de retención",
  "Deadlatch Lock with Hold-Back Function":
    "Cerradura de picaporte con bloqueo y función de retención",
  "1-8 hooks available": "De 1 a 8 ganchos",
  "3M or Screws": "Adhesivo 3M o tornillos",

  // functions
  Passage: "Paso libre",
  "Panic exit": "Barra antipánico",
  "Single cylinder": "Cilindro simple",
  "Sliding hook": "Gancho corredizo",
  "Euro profile": "Perfil europeo",
  "Square latch": "Picaporte cuadrado",
  "Four round bolts": "Cuatro pestillos redondos",
  "Horizontal case": "Cuerpo horizontal",
  "Entrance, privacy, passage or dummy":
    "Entrada, privacidad, paso libre o falsa",
  "Single cylinder, double cylinder or self-locking":
    "Cilindro simple, doble cilindro o autoblocante",
  "Deadlocking on keyed functions":
    "Bloqueo automático en las funciones con llave",

  // the family rows added from the client's own write-ups
  "200,000 cycles": "200.000 ciclos",
  "Solid steel chassis and latch case, zinc plated":
    "Chasis y caja de picaporte de acero macizo, zincados",
  "Solid steel, zinc plated for corrosion resistance":
    "Acero macizo zincado para resistir la corrosión",
  "Solid steel internal construction, corrosion protected":
    "Construcción interna de acero macizo con protección anticorrosiva",
  "Zinc plated steel internal components":
    "Componentes internos de acero zincado",
  "Zinc die-cast case, zinc-plated steel internal components":
    "Caja de zamak inyectado con componentes internos de acero zincado",
  "Zinc die-casting electro-plated or solid brass":
    "Zamak inyectado con galvanizado, o latón macizo",
  "Wrought stainless steel or brass": "Acero inoxidable forjado o latón",
  "Forged solid brass or zinc die-casting electro-plated":
    "Latón macizo forjado o zamak inyectado con galvanizado",
  "Stainless steel, brass or steel": "Acero inoxidable, latón o acero",
  "5-pin tumbler, brass plug, two nickel-plated brass keys":
    "Cilindro de 5 pines con núcleo de latón y dos llaves de latón niqueladas",
  "5-pin tumbler, solid brass plug, two nickel-plated brass keys":
    "Cilindro de 5 pines con núcleo de latón macizo y dos llaves de latón niqueladas",
  "Fully reversible, left or right hand": "Reversible, mano izquierda o derecha",
  "Non-handed, left or right hand": "Sin mano definida, izquierda o derecha",
  "Can be keyed alike with deadbolts, or master keyed":
    "Admite llave igual con los cerrojos, o amaestramiento",
  "Can be keyed alike to deadbolts": "Admite llave igual con los cerrojos",
  "Can be keyed alike to the deadbolt series, or master keyed":
    "Admite llave igual con la serie de cerrojos, o amaestramiento",
  "Can be keyed to pair with an entrance bored lock":
    "Admite llave igual con una cerradura de entrada de perforación",
  "57mm curved lip standard; 70mm available on request":
    "Cerradero curvo de 57 mm de serie; 70 mm bajo pedido",
  "Angle strike standard for inward-opening doors; flat strike available":
    "Cerradero angular de serie para puertas de apertura interior; cerradero plano disponible",
  "13mm, with inside deadlocking button":
    "13 mm, con botón de bloqueo interior",
  "25mm, with hardened steel insert to resist sawing":
    "25 mm, con inserto de acero templado antisierra",
  "25mm, zinc die-cast with hardened steel roller insert":
    "25 mm, de zamak inyectado con rodillo de acero templado",
  "25mm on rim deadbolt versions":
    "25 mm en las versiones con cerrojo de sobreponer",
  "51mm — replaces most existing locksets":
    "51 mm — sustituye a la mayoría de las cerraduras existentes",
  "No exposed exterior fixings; free-turning cylinder ring resists wrenching":
    "Sin tornillería exterior a la vista; el anillo giratorio del cilindro resiste el arranque",
  "Free-turning cylinder trim prevents wrenching; cylinder removable for rekeying":
    "La guarnición giratoria del cilindro impide el arranque; cilindro extraíble para recodificar",
  "Anti-picking slide gate on single-cylinder deadlock":
    "Compuerta antiganzúa en la versión de cilindro simple",
};

/** Category and sub-category names, keyed by slug. */
export const CATEGORY_NAMES_ES: Record<string, string> = {
  "panic-exit-devices": "Barras antipánico",
  "lock-cases": "Cerraduras de embutir",
  "lever-handles": "Manijas de palanca",
  "knob-locks": "Cerraduras de pomo",
  "stainless-steel-handles": "Manijas de acero inoxidable",
  "glass-door-accessories": "Herrajes para puertas de vidrio",
  deadbolts: "Cerrojos",
  "door-closers": "Cierrapuertas",
  "door-hinges": "Bisagras",
  "brass-steel-hinges": "Bisagras de latón y acero",
  "night-latches-rim-locks": "Cerraduras de sobreponer",
  "lock-cylinders": "Cilindros",
  "bathroom-accessories": "Accesorios de baño",
  "grip-handle-sets": "Juegos de manija con placa",
  "hardware-accessories": "Accesorios de herrajes",
  "sliding-hook-locks": "Cerraduras de gancho para correderas",
};

/*
  Values that are a number plus a qualifier ("60mm / 70mm adjustable") are handled by
  scripts/translate-products-es.mjs, not here: the number must survive untouched and only
  the qualifier is language. That is a generation concern — the site renders the finished
  `specsEs` rows out of the content files and never composes Spanish at request time.
*/
