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
  /*
    Packing terms, added 2026-09-06 to unblock the product FAQ.

    Without them the Spanish side of 027 fell below the three-question floor while English
    cleared it, so the two locales silently disagreed about which products get a FAQ at
    all — a whole page of markup lost to five missing rows.

    These are mechanical trade Spanish rather than a terminology decision, and they stay
    flagged for the translator's confirmation in the review workbook. The rule in this
    file's header — leave it in English rather than guess — is about terms where a wrong
    choice misleads a specifier. "Piezas por caja" is not one of those.
  */
  "Pieces per carton": "Piezas por caja",
  "Carton size": "Medidas de la caja",
  "Carton volume": "Volumen de la caja",
  "Gross weight": "Peso bruto",
  "Net weight": "Peso neto",
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
  Lens: "Lente",
  "Lens Cover": "Cubierta del lente",
  "Lens Cover Material": "Material de la cubierta del lente",
  "Product Type": "Tipo de producto",
  "Product Name": "Nombre del producto",
  Structure: "Estructura",
  "OEM & ODM": "OEM y ODM",
  "OEM /ODM": "OEM / ODM",
  OEM: "OEM",
  "OEM & Sample": "OEM y muestras",
  "Color Options": "Colores disponibles",
  Deadbolt: "Cerrojo",
  "Deadbolt Material": "Material del cerrojo",
  "Surface Finish": "Acabado superficial",
  "Surface Finish Options": "Acabados superficiales disponibles",
  "Surface Treatment": "Tratamiento superficial",
  "Hardware Finish": "Acabado del herraje",
  "Finish & Color": "Acabado y color",
  Finishes: "Acabados",
  "Finishes Available": "Acabados disponibles",
  "Trim Material": "Material de la guarnición",
  "Exposed Trim Material": "Material de la guarnición vista",
  "Included Accessories": "Accesorios incluidos",
  Accessories: "Accesorios",
  "Installation Method": "Método de instalación",
  "Installation Position": "Posición de instalación",
  "Factory reference": "Referencia de fábrica",
  "Bar Length": "Longitud de la barra",
  "Fire Rating": "Clasificación al fuego",
  Handling: "Manipulación",
  "Push Bar Material": "Material de la barra de empuje",
  "Latch Material": "Material del picaporte",
  "Latch Bolt Material": "Material del pestillo",
  "Latch Components": "Componentes del picaporte",
  "Latch & Puller": "Picaporte y tirador",
  "Suitable for": "Apto para",
  "Suitable For": "Apto para",
  "Suitable Door Thickness": "Espesor de puerta admitido",
  "Door Thickness Range": "Rango de espesor de puerta",
  "Applicable Door Thickness": "Espesor de puerta aplicable",
  "Glass door thickness": "Espesor del vidrio",
  Options: "Opciones",
  "Available Versions": "Versiones disponibles",
  "Available Diameters": "Diámetros disponibles",
  Style: "Estilo",
  Design: "Diseño",
  "Handle Design": "Diseño de la manija",
  "Backplate Material": "Material de la placa posterior",
  "Housing Material": "Material de la carcasa",
  "Main Body Material": "Material del cuerpo principal",
  "Main body": "Cuerpo principal",
  "Inner body": "Cuerpo interior",
  "Inner Material": "Material interior",
  "Cover material": "Material de la cubierta",
  Cover: "Cubierta",
  Body: "Cuerpo",
  "Lock Type": "Tipo de cerradura",
  "Lock Type Compatibility": "Compatibilidad de cerradura",
  "Lock Cylinder": "Cilindro",
  "Lock Cylinder Housing": "Carcasa del cilindro",
  "Cylinder Core": "Núcleo del cilindro",
  "Cylinder Type": "Tipo de cilindro",
  "Cylinder material": "Material del cilindro",
  "Cylinder Decorative Ring": "Anillo decorativo del cilindro",
  "Locking System": "Sistema de cierre",
  Mechanism: "Mecanismo",
  "Outside Lever": "Manija exterior",
  "Opening Direction": "Sentido de apertura",
  Market: "Mercado",
  "Country of Origin": "País de origen",
  "Case & Strike Plate": "Caja y cerradero",
  "Key Types": "Tipos de llave",
  "Key Type": "Tipo de llave",
  "Keys Supplied": "Llaves suministradas",
  Key: "Llave",
  "Key material": "Material de la llave",
  Durability: "Durabilidad",
  Mounting: "Montaje",
  "Mounting Style": "Tipo de montaje",
  "Mounting Location": "Ubicación de montaje",
  Sizes: "Medidas",
  Features: "Características",
  Specifications: "Especificaciones",
  "Compatible With": "Compatible con",
  Compatibility: "Compatibilidad",
  "Set Includes": "El juego incluye",
  "Thumbturn Button": "Botón de giro",
  "Tail Bar": "Cuadradillo de arrastre",
  "Decorative Plate": "Placa decorativa",
  Screws: "Tornillos",
  Rosette: "Rosetón",
  "Rosette Size": "Medida del rosetón",
  Applications: "Aplicaciones",
  Use: "Uso",
  LOGO: "Logotipo",
  "Closing Sequence": "Secuencia de cierre",
  "Closing Force": "Fuerza de cierre",
  "Roller Material": "Material del rodillo",
  "Diameter size": "Diámetro",
  "Viewing angle": "Ángulo de visión",
  Depth: "Profundidad",
  "Additional Info": "Información adicional",
  "Burglar Rated": "Clasificación antirrobo",
  "Rated Opening Compliant": "Conforme para huecos clasificados",
  "BAA Compliant": "Conforme BAA",
  "Pin Material": "Material de los pines",
  "Max Bearing Capacity": "Capacidad de carga máxima",
  Lengths: "Longitudes",
  Model: "Modelo",
  "Nominal lock body": "Cuerpo nominal",
  "Hook bolt": "Pestillo de gancho",
  "Lock case": "Caja de cerradura",
  "Hole Count": "Número de perforaciones",
  "Center Distance": "Distancia entre ejes",
  Spring: "Resorte",
  "2. Dual center distances": "Doble distancia entre ejes",
  Size1: "Medida 1",
  Size2: "Medida 2",
  Size3: "Medida 3",
  Size4: "Medida 4",
  Size5: "Medida 5",
  Size6: "Medida 6",
  Size7: "Medida 7",
  // labels introduced by scripts/cad-dimensions.mjs
  "Tube diameter": "Diámetro del tubo",
  "Rose diameter": "Diámetro del rosetón",
  "Rose thickness": "Espesor del rosetón",
  "Rose size": "Medida del rosetón",
  "Rose depth": "Fondo del rosetón",
  "Lever length": "Longitud de la manija",
  "Lever section": "Sección de la manija",
  "Lever drop": "Caída de la manija",
  Projection: "Saliente",
  Standoff: "Separador",
  "Fixing centre": "Centro de fijación",
  "Fixing centres": "Centros de fijación",
  "Fixing screws": "Tornillos de fijación",
  "Glass gap": "Luz para el vidrio",
  "Plate size": "Medida de la placa",
  "Plate width": "Ancho de la placa",
  "Plate height": "Alto de la placa",
  "Plate thickness": "Espesor de la placa",
  "Grip centre distance": "Distancia entre centros del asa",
  "Grip section": "Sección del asa",
  "Grip length": "Longitud del asa",
  "Slot width": "Ancho de la ranura",
  "Cylinder cutout": "Recorte para el cilindro",
  "Base diameter": "Diámetro de la base",
  "Body diameter": "Diámetro del cuerpo",
  "Stem diameter": "Diámetro del vástago",
  Footprint: "Huella",
  Height: "Alto",
  Drop: "Caída",
  Stem: "Vástago",
  "Bar section": "Sección de la barra",
  "Overall length": "Longitud total",
  "Upper hook": "Gancho superior",
  "Hook arm": "Brazo del gancho",
  Faceplate: "Frente",
  "Case height": "Alto del cuerpo",
  "Case depth": "Fondo del cuerpo",
  "Latch throw": "Salida del picaporte",
  "Bolt projection": "Salida del pestillo",
  "Spindle length": "Longitud del cuadradillo",
  Spindle: "Cuadradillo",
  "Faceplate to cylinder centre": "Del frente al centro del cilindro",
  "Cylinder centre to back": "Del centro del cilindro al fondo",
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
  /*
    The rest of the finish set, in the title case scripts/expand-finish-codes.mjs writes.
    The order code stays in brackets after the name and is never translated — it is what
    the buyer puts on a purchase order and is identical in every language.
    translate-products-es.mjs composes the comma list from these, so a finish offered on
    one more model needs no new entry, and a finish we have never named needs exactly one.
  */
  "Satin Chrome": "Cromo satinado",
  "Satin Brass": "Latón satinado",
  "Bright Polished": "Pulido brillante",
  "Black Nickel": "Níquel negro",
  "Nickel Plated": "Niquelado",
  "Oil Rubbed Bronze": "Bronce envejecido",
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
  "Wooden Door / Metal Door": "Puertas de madera y metálicas",
  "Decorative / Classic / European Style": "Decorativo, clásico o estilo europeo",
  "Twisted Lever Handle": "Manija de palanca torneada",
  "Euro Profile Mortise Lock": "Cerradura de embutir de perfil europeo",
  "Backplate Mounted, Mortise Lock Installation": "Montaje sobre placa, para cerradura de embutir",
  "SS/AB/SN/AC/PB, all available": "SS/AB/SN/AC/PB, todos disponibles",
  "AB/AC/PB/SB/SS/SP/SC all available": "AB/AC/PB/SB/SS/SP/SC, todos disponibles",
  "Copper-plated zinc alloy or brass": "Zamak cobreado o latón",
  "Zinc-plated, black or chrome-plated.": "Zincado, negro o cromado",
  "Multiple finish": "Varios acabados",
  "1.0 mm (optional: 0.8 mm)": "1,0 mm (opcional: 0,8 mm)",
  "Gray spray painted, other available": "Pintado en gris; otros colores bajo pedido",
  "Brass rolling latch": "Picaporte de rodillo de latón",
  "1.5 hours": "1,5 horas",
  "Suitable for both left a right-handed doors.": "Apto para puertas de mano izquierda y derecha",
  "Powder-coated (static paint)": "Pintura electrostática en polvo",
  "Push to Open": "Apertura por empuje",
  "Flame-Retardant ABS": "ABS retardante de llama",
  "Thickened Iron": "Hierro reforzado",
  "Optional (Not Included in the Listed Price)": "Opcional (no incluido en el precio)",
  "Different length according to customer request": "Longitud a medida según pedido",
  "Suit for toilet door or other doors": "Apto para puertas de baño y otras puertas",
  "Single or double cylinder with self-locking function": "Cilindro simple o doble, con autobloqueo",
  "Double-sided": "De doble cara",
  "Includes installation screws": "Incluye tornillos de instalación",
  "OEM & ODM available": "OEM y ODM disponibles",
  "OEM & ODM Available": "OEM y ODM disponibles",
  "South America": "Sudamérica",
  "Steel with electrostatic powder coating": "Acero con pintura electrostática en polvo",
  "Brass or iron, two/three-throw": "Latón o hierro, de dos o tres vueltas",
  "Brass or zinc": "Latón o zinc",
  "Brass (inside and outside), fixed or loose type": "Latón (interior y exterior), fijo o suelto",
  "Brass or iron": "Latón o hierro",
  "One set per box with fasteners": "Un juego por caja, con tornillería",
  "zinc alloy / Solid brass/Zinc & brass cylinder": "Zamak; cilindro de latón macizo o de zamak y latón",
  "Satin nickel, chrome, antique brass, polished brass, black nickel, antique copper – multiple options available": "Níquel satinado, cromo, latón antiguo, latón pulido, níquel negro y cobre antiguo; varias opciones",
  "Iron, nickel-plated brass, solid brass, brushed nickel": "Hierro, latón niquelado, latón macizo o níquel cepillado",
  "PB=polished brass": "PB = latón pulido",
  "Satin / Chrome / Black / Gold (customizable": "Satinado, cromo, negro o dorado (personalizable)",
  "Standard USA mounting size": "Medida de montaje estándar EE. UU.",
  "Bedroom, apartment, office, hotel, interior doors": "Dormitorios, departamentos, oficinas, hoteles y puertas interiores",
  "High usage life": "Larga vida útil",
  "BN Black Nickle": "BN = níquel negro",
  "Customizable upon customer request": "Personalizable bajo pedido",
  "1–8 hooks": "De 1 a 8 ganchos",
  "Custom Colors Available": "Colores personalizados disponibles",
  "Spray Coated / Matte Black / Satin / Antique Finish": "Pintado, negro mate, satinado o acabado antiguo",
  "Black / Silver / Bronze / Gold / Custom Finish": "Negro, plata, bronce, dorado o acabado personalizado",
  "180° / 360° Rotation": "Rotación de 180° / 360°",
  "2 Nickel-Plated Brass Keys": "2 llaves de latón niquelado",
  "2 × Nickel-Plated Brass Keys": "2 llaves de latón niquelado",
  "Stainless steel, brass, or steel": "Acero inoxidable, latón o acero",
  "Adjustable 35–45mm (1-3/8” to 1-3/4”)": "Regulable de 35 a 45 mm (1-3/8” a 1-3/4”)",
  "ABS/plastic": "ABS / plástico",
  "Concealed Lock": "Cerradura oculta",
  "Powder Coating": "Pintura en polvo",
  "Black": "Negro",
  "Panic Exit Device Accessory": "Accesorio para barra antipánico",
  "Panic Exit Device / Panic Bar": "Barra antipánico",
  "Key Operated": "Accionamiento con llave",
  "Fire Doors / Emergency Exit Doors / Commercial Doors": "Puertas cortafuego, de salida de emergencia y comerciales",
  "Fire door accessory": "Accesorio para puerta cortafuego",
  "Carbon Steel .": "Acero al carbono",
  "Nickel Plated Iron": "Hierro niquelado",
  "zinc alloy+brass": "Zamak y latón",
  "Fire door , panic door .": "Puerta cortafuego y puerta antipánico",
  "Fire Doors, Emergency Exit Doors": "Puertas cortafuego y de salida de emergencia",
  "Fully reversible for left or right-hand doors": "Totalmente reversible, mano izquierda o derecha",
  "Left & Right Reversible": "Reversible izquierda y derecha",
  "Stainless Steel / Brass / Steel": "Acero inoxidable, latón o acero",
  "Brass/zinc alloy": "Latón o zamak",
  "Zinc alloy or brass; two keys": "Zamak o latón; dos llaves",
  "Nickel-Plated Brass, Solid Brass, Brushed Nickel": "Latón niquelado, latón macizo o níquel cepillado",
  "Zinc Plated": "Zincado",
  "Satin+Polished": "Satinado y pulido",
  "Silver": "Plata",
  "Red,Black": "Rojo y negro",
  "Red, Black": "Rojo y negro",
  "Matte Black.（Custom colors available.）": "Negro mate (otros colores bajo pedido)",
  "Synthetic resin lens with cover": "Lente de resina sintética con cubierta",
  "4 hooks": "4 ganchos",
  "180° / 200°": "180° / 200°",
  "12mm / 14mm / 16mm": "12 / 14 / 16 mm",
  "60mm/70mm": "60 / 70 mm",
  "60–70mm Adjustable": "Regulable de 60 a 70 mm",
  "Adjustable 60mm or 70mm (2-3/8” or 2-3/4”)": "Regulable a 60 o 70 mm (2-3/8” o 2-3/4”)",
  "AB/AC/PB/SB/SS/SP/SC,other available": "AB/AC/PB/SB/SS/SP/SC; otros bajo pedido",
  "SS/AC/AB/BN available": "SS/AC/AB/BN disponibles",
  "PB=Polish Brass": "PB = latón pulido",
  "4\"x3\"x2.5MM": "4” × 3” × 2,5 mm",
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

  /*
    2026-08-31 tail. 296 terms that each appear once or twice — the long tail the earlier
    passes left behind. Same register as the rest of the file: Latin American trade Spanish.
    Where the source string is malformed (a stray CJK comma, a doubled unit, an OCR slip)
    the Spanish states the meaning cleanly; the English is left untouched in the record.
  */

  // materials and construction
  "Iron with ABS material.": "Hierro con ABS",
  "Iron and stainless steel": "Hierro y acero inoxidable",
  "Stainless steel+Iron": "Acero inoxidable y hierro",
  "Steel or stainless steel": "Acero o acero inoxidable",
  "ABS material with Aluminum push bar": "ABS con barra de empuje de aluminio",
  "ABS plastic material with Aluminum": "ABS con aluminio",
  "Aluminum alloy and iron": "Aleación de aluminio y hierro",
  "Aluminium alloy and iron": "Aleación de aluminio y hierro",
  "Iron + ABS body": "Cuerpo de hierro y ABS",
  "Iron+Iron tube": "Hierro con tubo de hierro",
  "Iron and Brass": "Hierro y latón",
  "Stainless Steel 201/304": "Acero inoxidable 201/304",
  "201 / 304 Stainless steel": "Acero inoxidable 201 / 304",
  "201/304 Stainless Steel": "Acero inoxidable 201/304",
  "Stainless steel 201": "Acero inoxidable 201",
  "Stainless steel 316": "Acero inoxidable 316",
  "Zinc alloy/304 Stainless steel": "Zamak y acero inoxidable 304",
  "Zinc alloy Cylinder": "Cilindro de zamak",
  "Zinc Alloy & ABS": "Zamak y ABS",
  "Zinc Alloy + Plastic / Brass": "Zamak con plástico o latón",
  "Zinc-Plated Steel": "Acero zincado",
  "Iron with zinc-plated finish": "Hierro zincado",
  "Nickel-plated iron": "Hierro niquelado",
  "Nickel plated": "Niquelado",
  "Stainless Steel/ Brass": "Acero inoxidable o latón",
  "Stainless Steel / Brass": "Acero inoxidable o latón",
  "304 Stainless Steel Screws": "Tornillos de acero inoxidable 304",
  "Hardened Steel (HRC58)": "Acero templado (HRC58)",
  "Thickened Solid Shaft Core": "Eje macizo reforzado",
  Nylon: "Nylon",
  "Synthetic resin": "Resina sintética",
  "Synthetic resin (with optional cover)": "Resina sintética (con cubierta opcional)",
  "Synthetic resin with protective cover": "Resina sintética con cubierta protectora",
  "Synthetic resin lens with protective cover": "Lente de resina sintética con cubierta protectora",
  "Glass Lens": "Lente de vidrio",
  "Satin SS +Middle Part Acrylic": "Acero inoxidable satinado con parte central de acrílico",
  "Iron Body + Stainless Steel Faceplate": "Cuerpo de hierro con frente de acero inoxidable",
  "Iron Lock Body + Stainless Steel Face Plate":
    "Cuerpo de cerradura de hierro con frente de acero inoxidable",
  "Iron body and 304 SS outer plates":
    "Cuerpo de hierro con placas exteriores de acero inoxidable 304",
  "Iron Body, Zinc Alloy Latch, ABS Components":
    "Cuerpo de hierro, picaporte de zamak y componentes de ABS",
  "Zinc die-cast outer case, zinc-plated steel internal components":
    "Caja exterior de zamak inyectado; componentes internos de acero zincado",
  "case is made of zinc alloy die-casting,": "Caja de zamak inyectado",
  "Aluminum alloy / Aluminium alloy for lock body, brass cylinder":
    "Aleación de aluminio para el cuerpo de la cerradura; cilindro de latón",
  "304SS / 304 Stainless Steel with Plated and suit for Panic Exit Device.":
    "Acero inoxidable 304 con recubrimiento, apto para barra antipánico",
  "Iron case, steel base internal components with zinc plated, 3 pcs brass keys , brass latch and cylinder":
    "Caja de hierro; componentes internos de acero zincado; 3 llaves de latón; picaporte y cilindro de latón",
  "Iron case, steel base internal components with zinc plated finish, 3 pcs brass keys , brass latch and cylinder":
    "Caja de hierro; componentes internos de acero zincado; 3 llaves de latón; picaporte y cilindro de latón",
  "Iron case, steel base internal components with zinc plated finish":
    "Caja de hierro con componentes internos de acero zincado",
  "Iron case, with 3 pcs brass keys , brass latch.":
    "Caja de hierro con 3 llaves de latón y picaporte de latón",
  "Iron case, with 3 pcs brass keys , zinc alloy latch and cylinder":
    "Caja de hierro con 3 llaves de latón; picaporte y cilindro de zamak",
  "Iron lock body, brass Cylinder(double cylinder), with 3pcs iron key.":
    "Cuerpo de cerradura de hierro; cilindro de latón de doble cilindro; 3 llaves de hierro",
  "Aluminum Door Lock Body /American-Style/Lock Cylinder /Lock Case (Door Bolt)/Locks and Keys.":
    "Cuerpo de cerradura de aluminio estilo americano; cilindro, caja de cerradura (cerrojo), cerradura y llaves",
  "Aluminum Door Lock Body, American-Style Lock Cylinder / Lock Case (Door Bolt), and Locks and Keys.":
    "Cuerpo de cerradura de aluminio; cilindro estilo americano, caja de cerradura (cerrojo), cerradura y llaves",
  "311 push bar, lock body, brass cylinder, stainless steel handle":
    "Barra de empuje 311, cuerpo de cerradura, cilindro de latón y manija de acero inoxidable",
  "Push bar, active and inactive leaf": "Barra de empuje para hoja activa y hoja pasiva",
  "40 hook-bolt lock body": "Cuerpo de cerradura con cerrojo de gancho 40",
  /*
    "Electroplatingbhgh." is a keyboard slip in the source record, not a finish name. The
    Spanish states the finish; the English side is left as the client wrote it.
  */
  "Electroplating.": "Galvanoplastia",
  "Electroplatingbhgh.": "Galvanoplastia",
  "Fabricada en lámina de acero 1.2 mm,componentes internos aleación de zinc, aleación de cobre,cilindros en latón sólido,4 llaves. Permite instalación con tornillos o soldadura.Incluye accesorios de instalación.Acabado pintura electrostática. / Iron.":
    "Fabricada en lámina de acero de 1,2 mm; componentes internos de zamak y aleación de cobre; cilindros de latón macizo y 4 llaves. Permite instalación con tornillos o soldadura e incluye accesorios de montaje. Acabado en pintura electrostática. Hierro.",

  // applications
  Residential: "Residencial",
  "Building industry machinery": "Maquinaria para la construcción",
  "Iron Door": "Puerta de hierro",
  "Wooden Door": "Puerta de madera",
  "Sliding and pocket doors": "Puertas corredizas y embutidas",
  "Room door, Entrance door.": "Puerta de habitación y puerta de acceso",
  "Fireproof doors": "Puertas cortafuego",
  "For fire-rated metal or wood doors": "Para puertas cortafuego metálicas o de madera",
  "Fire doors / double doors": "Puertas cortafuego y puertas de doble hoja",
  "Fire double door": "Puerta cortafuego de doble hoja",
  "Bathroom Bath Partition Hardware": "Herrajes para mamparas de baño",
  "Household/ Hotel Bathroom": "Baños residenciales y de hotel",
  "Window Connection": "Unión de ventana",
  "Wooden Doors / Security Doors": "Puertas de madera y puertas de seguridad",
  "Wooden Doors / Metal Doors / Residential Doors":
    "Puertas de madera, metálicas y residenciales",
  "Cafe Doors, Kitchen Doors, Swing Doors": "Puertas de café, de cocina y batientes",
  "Toilet Cubicle Door / Restroom Door / Hotel / Office / Hospital / Public Restroom":
    "Puertas de cubículo sanitario y de baño: hoteles, oficinas, hospitales y baños públicos",
  "Fire door / Emergency exit door / Public building":
    "Puerta cortafuego, puerta de salida de emergencia y edificio público",
  "Fire Door, Exit Door, Steel Door, Public Access Door":
    "Puerta cortafuego, puerta de salida, puerta de acero y puerta de acceso público",
  "Commercial Emergency Exit Door": "Puerta comercial de salida de emergencia",
  "Cold Storage Door, Freezer Door, Cold Chain Warehouse Door":
    "Puerta de cámara frigorífica, de congelador y de almacén de cadena de frío",
  "Aluminum Storefront Doors, Glass Doors, Commercial Entry Systems":
    "Puertas de fachada de aluminio, puertas de vidrio y accesos comerciales",
  "Aluminum Storefront Door / Glass Door / Office Door / Commercial Entrance Door / Shops, Offices, Malls, Supermarkets, Commercial Buildings":
    "Puerta de fachada de aluminio, de vidrio, de oficina o de acceso comercial: comercios, oficinas, centros comerciales, supermercados y edificios comerciales",
  "Shops, Offices, Malls, Supermarkets, Commercial Buildings":
    "Comercios, oficinas, centros comerciales, supermercados y edificios comerciales",
  "Doors, Windows, Cabinet Doors, Fire Doors / Residential, Commercial, Hotel, Office, Warehouse, Industrial":
    "Puertas, ventanas, puertas de mueble y puertas cortafuego: residencial, comercial, hotelería, oficinas, bodegas e industria",
  "Window, Door / Residential, Commercial, Hotel, Office, Hospital, School, Warehouse":
    "Ventanas y puertas: residencial, comercial, hotelería, oficinas, hospitales, escuelas y bodegas",
  "Wooden Door / Metal Door / Furniture Door / Commercial Door / Residential / Commercial / Hotel / Office / Hospital / School / Warehouse":
    "Puertas de madera, metálicas, de mueble y comerciales: residencial, comercial, hotelería, oficinas, hospitales, escuelas y bodegas",
  "Fire Doors / Commercial Double Doors / Schools / Hospitals / Office Buildings / Commercial Projects":
    "Puertas cortafuego y puertas comerciales de doble hoja: escuelas, hospitales, edificios de oficinas y proyectos comerciales",
  "Interior Door / Commercial Door / Fire Door / Passage Door":
    "Puerta interior, comercial, cortafuego o de paso",
  "Armored Doors / Security Doors / Entrance Doors":
    "Puertas acorazadas, de seguridad y de acceso",
  "Double-Leaf Doors": "Puertas de doble hoja",
  "Single Door / Double Door": "Puerta de una hoja o de doble hoja",
  "Ideal for bathrooms, living rooms, and more": "Ideal para baños, salas y otros ambientes",
  "Suitable for bathrooms, living rooms, and more": "Apto para baños, salas y otros ambientes",
  "Wooden Gates,window": "Portones de madera y ventanas",
  "10–12 mm glass doors": "Puertas de vidrio de 10 a 12 mm",
  "Glass Door Locks": "Cerraduras para puerta de vidrio",
  "Door frame / door edge": "Marco de puerta o canto de puerta",
  "Top of Door Frame": "Parte superior del marco",
  "Inside Door Installation": "Instalación del lado interior de la puerta",

  // functions
  "COMMUNICATION LOCK": "Cerradura de comunicación",
  "CLASSROOM LOCK": "Cerradura de aula",
  "EXIT LATCH": "Picaporte de salida",
  STOREROOM: "Cerradura de bodega",
  "Entrance and communication": "Acceso y comunicación",
  "Emergency Escape, Quick Release": "Escape de emergencia con liberación rápida",
  "For Privacy doors": "Para puertas de baño",
  "For privacy doors": "Para puertas de baño",
  "For Passage doors": "Para puertas de paso",
  "For entrance doors": "Para puertas de acceso",
  "Door lock": "Cerradura de puerta",
  "Door Lock": "Cerradura de puerta",
  "Cylindrical door lock": "Cerradura cilíndrica",
  "Tubular lock": "Cerradura tubular",
  "lever handle": "Manija de palanca",
  "Entrance door lock": "Cerradura de puerta de acceso",
  "Lever Handle Lock": "Cerradura con manija de palanca",
  "Deadlatch Lock": "Cerradura de picaporte con retén",
  "Slide Bolt Lock": "Pasador corredizo",
  "Anti-Theft Rim Lock / Night Latch":
    "Cerradura de sobreponer antirrobo / cerradura de golpe",
  "Push Pull Paddle Door Lock Set": "Juego de cerradura con paleta de empuje y tiro",
  "Automatic Door Sequencing": "Secuenciador automático de cierre",
  "Door Sequence Selector": "Selector de secuencia de cierre",
  "Inactive Leaf First, Active Leaf After": "Primero la hoja pasiva y después la activa",
  "Double Action, Self-Closing": "Doble acción, con cierre automático",
  "Vacant & Occupied Indicator": "Indicador de libre y ocupado",
  "Built-in Alarm Function": "Alarma integrada",
  "Key Access from Outside, Push Bar Exit from Inside":
    "Acceso con llave desde el exterior y salida por barra de empuje desde el interior",
  "External Lever Handle / Dogging Function":
    "Manija de palanca exterior con función de retención (dogging)",
  "Push-to-Open Emergency Exit": "Salida de emergencia con apertura por empuje",
  "Top & Bottom Latching": "Enganche superior e inferior",
  "Press from Inside": "Accionamiento por empuje desde el interior",
  "No Key Required from Inside": "No requiere llave desde el interior",
  "Inside Release Push Bar": "Barra de empuje de liberación interior",
  "Quick emergency release, safety push bar design":
    "Liberación rápida de emergencia; barra de empuje de seguridad",
  "Paired with panic bar": "Para usar con barra antipánico",
  "Works with panic exit devices": "Compatible con barras antipánico",
  "Keyed exterior trim": "Guarnición exterior con llave",
  Concealed: "Oculto",
  "concealed hinge": "Bisagra oculta",
  "Non-handed": "Sin mano definida",
  "Non-Handed (Reversible)": "Sin mano definida (reversible)",
  "Reversible (Left / Right)": "Reversible (izquierda o derecha)",
  "Left Hand or Right Hand Available": "Disponible en mano izquierda o derecha",
  "Suitable for left & right usage": "Apto para uso izquierdo y derecho",
  "Double-side": "De doble cara",
  "Double side": "De doble cara",
  "Single-side": "De una sola cara",
  double: "Doble",
  "Double cylinder": "Doble cilindro",
  "Double cylinder, solid brass cylinder plug": "Doble cilindro con rotor de latón macizo",
  "Single / Double cylinder, with self-locking function":
    "Cilindro simple o doble, con autobloqueo",
  "Single or double brass cylinder, with self-locking function":
    "Cilindro de latón simple o doble, con autobloqueo",
  "External single cylinder": "Cilindro simple exterior",
  "Includes brass cylinder with key": "Incluye cilindro de latón con llave",
  "Cylinder length according to the door thickness":
    "Longitud del cilindro según el espesor de puerta",
  "6-pin": "De 6 pines",
  "3 keys": "3 llaves",
  "3 Brass Keys": "3 llaves de latón",
  "3 brass keys": "3 llaves de latón",
  "3 iron keys included": "Incluye 3 llaves de hierro",
  "2 nickel-plated brass keys included": "Incluye 2 llaves de latón niquelado",
  "3 or 5 keys available": "Disponible con 3 o 5 llaves",
  "Normal key / Computer key optional": "Llave normal o llave de computadora, a elección",
  "Beveled latch design": "Picaporte biselado",
  "Beveled latch structure": "Estructura de picaporte biselado",
  "25mm full-throw rim deadbolt": "Cerrojo de sobreponer de 25 mm de salida total",
  "12mm throw, deadlocking for keyed functions":
    "12 mm de salida; con bloqueo en las funciones con llave",
  "60/70mm adjustable tubular latch": "Picaporte tubular regulable de 60 / 70 mm",
  "Full Latch Coverage": "Cubre todo el picaporte",
  "Anti-Drill & Anti-Pry Cylinder Protection":
    "Protección del cilindro antitaladro y antipalanca",
  "Anti Pry Anti Theft Reinforced Heavy Duty":
    "Antipalanca y antirrobo, reforzada, de servicio pesado",
  "Anti Theft Security Door Hinge": "Bisagra de seguridad antirrobo",
  "Security Hinge Butt Hinge": "Bisagra de seguridad tipo libro",
  "Spring Hinge": "Bisagra de resorte",
  "Stainless Steel Spring Hinge": "Bisagra de resorte de acero inoxidable",
  "Spring Butterfly Hinge / Self-Closing Hinge":
    "Bisagra mariposa de resorte, de cierre automático",
  "Stainless Steel Flag Hinge": "Bisagra bandera de acero inoxidable",
  "Self Closing / Adjustable Tension / 90° Positioning":
    "Cierre automático, tensión regulable y posicionamiento a 90°",
  "Self-Closing / Soft-Close Buffer / Multi-Angle Positioning":
    "Cierre automático, amortiguador y posicionamiento en varios ángulos",
  "Soft Closing / Quiet Operation / Corrosion Resistant / Heavy Duty":
    "Cierre suave, funcionamiento silencioso, resistente a la corrosión y de servicio pesado",
  "Automatic Self-Closing (Adjustable Tension)": "Cierre automático (tensión regulable)",
  "Adjustable Spring Tension": "Tensión de resorte regulable",
  "Adjustable Tension": "Tensión regulable",
  "Adjustable Closing Force": "Fuerza de cierre regulable",
  "Automatic closing / speed & force control":
    "Cierre automático con control de velocidad y fuerza",
  "Mechanical, No Power Required": "Mecánico, no requiere alimentación eléctrica",
  "No Ball Bearing / 2BB Plain Bearing (available options)":
    "Sin rodamiento o con 2 rodamientos (2BB), a elección",
  "Plain Bearing / No Ball Bearing / 2BB (optional)":
    "Casquillo liso, sin rodamiento o 2 rodamientos (2BB), opcional",
  "Power and data transfer between door and frame":
    "Paso de corriente y datos entre la puerta y el marco",
  "Provides wide-angle outdoor monitoring for enhanced door security":
    "Ofrece visión exterior de gran angular para mayor seguridad",
  "Available with or without cover": "Disponible con o sin cubierta",
  "The Rim door looks with double cylinder double throw. Dead bolt and latch bolt have triple guaranteed function which avoid prizing off the door, opening the door from inside. Without keys and removing the lock from inside when closed so as to ensure security. They are suitable for various kinds of wooden or iron doors.":
    "Cerradura de sobreponer de doble cilindro y doble vuelta. El cerrojo y el picaporte cuentan con triple seguro, que impide apalancar la puerta, abrirla desde el interior sin llave o desmontar la cerradura desde adentro con la puerta cerrada. Apta para puertas de madera y de hierro de distintos tipos.",
  "Includes opening and closing speed regulation, spring tension is fully adjustable, door can swing 116 inwards or out wards, with stops at 0, 88 and 116 in both directions.":
    "Incluye regulación de la velocidad de apertura y de cierre; tensión del resorte totalmente regulable; la puerta abre hasta 116° hacia adentro o hacia afuera, con retenciones a 0°, 88° y 116° en ambos sentidos.",

  // installation and fittings
  "Recessed pull handle": "Manija de tiro embutida",
  "Mortise mounting": "Montaje de embutir",
  "Surface or mortise": "De sobreponer o de embutir",
  "Surface-mounted, Horizontal Installation": "De sobreponer, instalación horizontal",
  "Surface mounted, screw fixed": "De sobreponer, fijación con tornillos",
  "Screw-mounted": "Fijación con tornillos",
  "Screw Mounted": "Fijación con tornillos",
  "3M adhesive or screw installation": "Instalación con adhesivo 3M o con tornillos",
  "3M adhesive or screw fixed": "Fijación con adhesivo 3M o con tornillos",
  "Concealed Internal Fixing (Through-bolt)": "Fijación interna oculta (perno pasante)",
  "Rounded mounting tabs": "Orejas de fijación redondeadas",
  "Sheet Stamping": "Estampado de chapa",
  "Detachable, Smooth Rotation, Easy Installation":
    "Desmontable, giro suave e instalación sencilla",
  "With hooks": "Con ganchos",
  "1 to 8 hooks available": "Disponible de 1 a 8 ganchos",
  "10 Holes": "10 orificios",
  "Includes Screws": "Incluye tornillos",
  "2 Support Brackets, Screws and Washers": "2 soportes, tornillos y arandelas",
  "Double Hook Door Bolt(Double Flat Door Bolt, Single Hook Door Bolt, Single Flat Door Bolt.)":
    "Pasador de doble gancho (también en doble plano, gancho simple y plano simple)",
  "Single Hook Door Bolt (Double Hook Door Bolt,Double Flat Door Bolt,Single Flat Door Bolt.)":
    "Pasador de gancho simple (también en doble gancho, doble plano y plano simple)",

  // finishes and colours
  Satin: "Satinado",
  "Satin / Plated Finish": "Satinado o con recubrimiento galvánico",
  "Satin Stainless Steel (SS)": "Acero inoxidable satinado (SS)",
  "Satin Stainless Steel 630/US32D": "Acero inoxidable satinado 630 / US32D",
  "Stain nickel": "Níquel satinado",
  "Brushed satin": "Satinado cepillado",
  "Satin nickel, chrome, antique brass, polished brass, etc.":
    "Níquel satinado, cromo, latón antiguo, latón pulido, entre otros",
  "Satin Nickel, Chrome, Antique Brass, Polished Brass":
    "Níquel satinado, cromo, latón antiguo y latón pulido",
  "PB brass polish": "PB = latón pulido",
  "SC= Satin chrome": "SC = cromo satinado",
  "SN=Satin Nickel": "SN = níquel satinado",
  Red: "Rojo",
  "Black+Red": "Negro y rojo",
  "Silver or Customized": "Plata o personalizado",
  Painted: "Pintado",
  "Painted optional.": "Pintado, opcional",
  "Spray painting silver color": "Pintado con pistola en color plata",
  "Spray-painted silver, powder-coated iron":
    "Hierro con pintura en polvo, pintado en plata",
  "painting red/ black or other finish also is available.":
    "Pintado en rojo o negro; otros acabados bajo pedido",
  "Different colors available (customizable)":
    "Varios colores disponibles (personalizable)",
  "PVD / Satin / Polished / Antique (Gold, Chrome, Black, Bronze)":
    "PVD, satinado, pulido o antiguo (dorado, cromo, negro y bronce)",
  "AB / AC / PB / SB / SS / SP / SC ；other available":
    "AB/AC/PB/SB/SS/SP/SC; otros bajo pedido",
  "AB / AC / PB / SB / SS / SP / SC (Custom Available)":
    "AB/AC/PB/SB/SS/SP/SC (personalizable)",
  "AB, AC, PB, SB, SS, SP, SC (e.g., antique brass, polished brass, satin nickel, matte black, etc.)":
    "AB, AC, PB, SB, SS, SP, SC (latón antiguo, latón pulido, níquel satinado, negro mate, entre otros)",
  "PB/SB/AB/AC/CP other finish to order": "PB/SB/AB/AC/CP; otros acabados bajo pedido",
  "SS/AB/SN/AC/PB are available": "SS/AB/SN/AC/PB disponibles",

  // sizes the rules cannot reach, because a word carries part of the meaning
  '2-3/8" (60mm)': "2-3/8” (60 mm)",
  "2-3/8＂(60mm)": "2-3/8” (60 mm)",
  "35–45mm (1-3/8” to 1-3/4”)": "De 35 a 45 mm (1-3/8” a 1-3/4”)",
  "60 / 70 / 80 / 90 mm (Adjustable)": "60 / 70 / 80 / 90 mm (regulable)",
  "Adjustable 2-3/8” or 2-3/4” (60mm or 70mm)": "Regulable a 2-3/8” o 2-3/4” (60 o 70 mm)",
  "Adjustable to 2-3/8” or 2-3/4” (60mm or 70mm)":
    "Regulable a 2-3/8” o 2-3/4” (60 o 70 mm)",
  "Adjustable 60 mm or 70 mm (2-3/8” or 2-3/4”)":
    "Regulable a 60 o 70 mm (2-3/8” o 2-3/4”)",
  "60mm or 70mm (2-3/8” or 2-3/4”)": "60 o 70 mm (2-3/8” o 2-3/4”)",
  "Adjustable 1-3/8” to 1-3/4” (35mm–45mm)": "Regulable de 1-3/8” a 1-3/4” (35 a 45 mm)",
  "Adjustable 35–45 mm (1-3/8” to 1-3/4”)": "Regulable de 35 a 45 mm (1-3/8” a 1-3/4”)",
  "1-3/8” to 1-3/4” (35mm–45mm)": "De 1-3/8” a 1-3/4” (35 a 45 mm)",
  "35–55mm / 60–100mm": "De 35 a 55 mm / de 60 a 100 mm",
  "35–55mm or 60–100mm": "De 35 a 55 mm o de 60 a 100 mm",
  "Up to 80mm": "Hasta 80 mm",
  "Up to 90mm": "Hasta 90 mm",
  "0.8 mm or 1.0 mm": "0,8 mm o 1,0 mm",
  "1.0 mm (also available in 0.8 mm)": "1,0 mm (también disponible en 0,8 mm)",
  "30 mm (extension sizes optional)": "30 mm (largos de extensión opcionales)",
  "30mm (extension sizes optional)": "30 mm (largos de extensión opcionales)",
  "1040mm(length can be adjusted)": "1040 mm (longitud regulable)",
  "36 mm (square)": "36 mm (cuadrado)",
  "70mm (L) × 48mm (W) × 1.0mm (T)": "70 mm (largo) × 48 mm (ancho) × 1,0 mm (espesor)",
  "285mm (L) × 410mm (H)": "285 mm (largo) × 410 mm (alto)",
  "42mm (L) × 35mm (H)": "42 mm (largo) × 35 mm (alto)",
  "110 mm (L) × 66 mm (W)": "110 mm (largo) × 66 mm (ancho)",
  "115 mm (L) × 53 mm (W)": "115 mm (largo) × 53 mm (ancho)",
  "900mm (adjustable)": "900 mm (regulable)",
  "900 mm (adjustable)": "900 mm (regulable)",
  "3 mm （Customizable）": "3 mm (personalizable)",
  "6*3*3mm（Customizable）": "6 × 3 × 3 mm (personalizable)",
  "149mm at the head, 133mm at the foot — tapered":
    "149 mm en la cabeza y 133 mm en el pie, en forma cónica",
  "32mm, tapering to 19mm": "32 mm, con reducción cónica a 19 mm",
  "32mm, tapering to 18.5mm": "32 mm, con reducción cónica a 18,5 mm",
  "22mm, 8mm at the tip": "22 mm, 8 mm en la punta",
  "72mm & 92mm (with cylinder hole)": "72 y 92 mm (con perforación para cilindro)",
  "53mm square": "Cuadrado de 53 mm",
  "45mm square": "Cuadrado de 45 mm",
  "17 × 33mm, 10mm keyway": "17 × 33 mm; bocallave de 10 mm",
  "60mm and 16mm": "60 y 16 mm",
  "80mm / 100mm (L) × 38mm (W) × 1.2mm (T)":
    "80 / 100 mm (largo) × 38 mm (ancho) × 1,2 mm (espesor)",
  "300*135*60mm / 300*135*100mm / 400*135*60mm / 400*135*100mm":
    "300 × 135 × 60 mm / 300 × 135 × 100 mm / 400 × 135 × 60 mm / 400 × 135 × 100 mm",
  "200* 200mm / 250*250mm": "200 × 200 mm / 250 × 250 mm",
  "200 × 200 mm, 250 × 250 mm": "200 × 200 mm / 250 × 250 mm",
  "650mm / 800mm / 1000mm, Customizable": "650 / 800 / 1000 mm, personalizable",
  "34*140*28mm/28*118*22mm/25*118*18mm/19*95*13mm/16*70*11mm":
    "34 × 140 × 28 mm / 28 × 118 × 22 mm / 25 × 118 × 18 mm / 19 × 95 × 13 mm / 16 × 70 × 11 mm",
  "3.5”×3.5”×3.0mm / 4”×3”×3.0mm / 4”×4”×3.0mm (Custom Available)":
    "3,5” × 3,5” × 3,0 mm / 4” × 3” × 3,0 mm / 4” × 4” × 3,0 mm (personalizable)",
  "4” × 3”": "4” × 3”",
  "0.88”": "0,88”",
  "0.67”": "0,67”",
  // The source writes this size list with a CJK comma and stray spaces.
  '1"1-1/4 "2 "、3"': "1”, 1-1/4”, 2”, 3”",
  "180° (90° each direction)": "180° (90° en cada sentido)",
  "80 kg": "80 kg",
  "25 N·m": "25 N·m",
  "2.5 hours fire-resistant": "Resistencia al fuego de 2,5 horas",

  // catalogue bookkeeping
  "015 or 9080E.": "015 o 9080E",
  No: "No",
  Yes: "Sí",
  Optional: "Opcional",
  Accepted: "Se acepta",
  Four: "Cuatro",
  Five: "Cinco",
  "Custom Sizes Available": "Medidas personalizadas disponibles",
  "Custom Sizes & Colors Available": "Medidas y colores personalizados disponibles",
  "Customized Size Available": "Medidas personalizadas disponibles",
  "Custom Logo Accepted": "Se acepta logotipo personalizado",
  "Irregular sizes and custom dimensions supported for OEM & ODM":
    "Se admiten medidas irregulares y dimensiones a medida para OEM y ODM",
  "1 Pair/Box, 50 Pairs/Carton": "1 par por caja, 50 pares por cartón",
  "Blister or color box available,24 pcs/ctn":
    "Blíster o caja a color; 24 unidades por cartón",
  "Blister or color box available,24 pcs/ctn G.W.:16KGS /CTN,N.W.:15KGS/CTN,":
    "Blíster o caja a color; 24 unidades por cartón; peso bruto 16 kg y peso neto 15 kg por cartón",
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
