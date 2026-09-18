/**
 * The product feature bullets, in Spanish.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTED AS AN EMPTY GAP FOR SO LONG
 *
 * `featuresEs` was 0 of 216 records from the day the Spanish tree shipped. The bullets
 * were not falling back to English on those pages — `ProductDetail` hid the whole block
 * on any non-English page, so 545 lines of the client's own copy simply never appeared in
 * Spanish. Portuguese was filled in on 2026-09-17 and made the gap visible: the newer
 * locale had 216/216 while the older one had none.
 *
 * ---------------------------------------------------------------------------
 * ALL OR NOTHING, PER RECORD
 *
 * `scripts/translate-product-features-es.mjs` writes `featuresEs` only when EVERY line of
 * a record resolves here. A record with four Spanish bullets and two English ones is a
 * list that looks finished and is not.
 *
 * ---------------------------------------------------------------------------
 * WHAT IS NOT TRANSLATED
 *
 * Figures, model numbers, standard designations and imperial twins are carried across
 * unchanged: "60mm (2-3/8”)" is the same measurement in every language, and a buyer
 * checking it against a drawing needs to see the same characters. Only the words move.
 * Decimal commas and thousands separators DO move, because they are the local reading of
 * the same number: 200,000 cycles is written 200.000, and 18.5mm is 18,5 mm.
 *
 * ---------------------------------------------------------------------------
 * THE TRADE WORDS, DECIDED ONCE
 *
 *   latch bolt   → picaporte        deadbolt     → pestillo / cerrojo
 *   strike       → cerradero        spindle      → cuadradillo
 *   backset      → entrada          trim         → guarnición
 *   rose         → roseta           knob         → pomo
 *   lever        → manilla          keyed alike  → llave igual
 *   master key   → amaestramiento   cross bore   → taladro pasante
 *   zinc die-cast → zamak           thumb-turn   → botón giratorio
 *
 * These match src/data/es-glossary.ts. A second spelling of "picaporte" on the same page
 * as the spec table is how a reader stops trusting both.
 */
export const FEATURE_LINES_ES: Record<string, string> = {
  /* Headings that structure the list. */
  "Introduction:": "Introducción:",
  Introduction: "Introducción",
  "Key Features:": "Características principales:",
  "Key Features": "Características principales",
  "Product Highlights": "Puntos destacados del producto",
  "Technical Features": "Características técnicas",
  "Technical Specifications": "Especificaciones técnicas",
  "Technical Parameters": "Parámetros técnicos",
  "Basic Specifications": "Especificaciones básicas",
  "Functionality:": "Funcionamiento:",
  "Application:": "Aplicación:",
  "Construction": "Construcción",
  "Robust Construction": "Construcción robusta",
  "Keying Options:": "Opciones de llave:",
  "Strike Plate:": "Cerradero:",
  "Enhanced Security:": "Mayor seguridad:",
  "Easy Installation:": "Instalación sencilla:",
  "Easy Installation": "Instalación sencilla",
  "Push Bar Features:": "Características de la barra de empuje:",
  "Multifunctional Locking Options:": "Opciones de bloqueo multifunción:",
  "Cylinder & Keys": "Cilindro y llaves",
  "Deadbolt Mechanism": "Mecanismo de pestillo",
  "Secure Deadbolt": "Pestillo de seguridad",
  "Precision Cylinder": "Cilindro de precisión",
  "Reversible Design": "Diseño reversible",

  /* The most repeated body line in the catalogue — 32 records. */
  "Made from high-quality 304 stainless steel with material certification, this door handle is ideal for modern entry door locks. Contact us for more details.":
    "Fabricada en acero inoxidable 304 de alta calidad y con certificado de material, esta manilla es ideal para cerraduras de puerta de entrada modernas. Consúltenos para más detalles.",

  "Functions: Entrance, Anti-Panic, Privacy, Passage, Storeroom, Deadlock, Classroom, Multi-Function":
    "Funciones: entrada, antipánico, privacidad, paso libre, almacén, bloqueo, aula y multifunción",
  "Options: 85 Series, 72 Series, and small-size lock cases available":
    "Opciones: serie 85, serie 72 y cajas de cerradura de tamaño reducido",
  "Customization: Irregular sizes and custom dimensions supported for OEM & ODM":
    "Personalización: se admiten medidas irregulares y dimensiones a medida para OEM y ODM",
  "Exposed trim available in stainless steel or brass":
    "Guarnición vista disponible en acero inoxidable o latón",
  "Zinc-plated steel chassis and latch for corrosion resistance":
    "Chasis y picaporte de acero cincado, resistentes a la corrosión",
  "Zinc-plated steel chassis and latch case for corrosion resistance":
    "Chasis y caja de picaporte de acero cincado, resistentes a la corrosión",
  "Zinc-plated steel latch and chassis for corrosion resistance":
    "Picaporte y chasis de acero cincado, resistentes a la corrosión",
  "Zinc-plated steel latch and chassis for enhanced durability":
    "Picaporte y chasis de acero cincado para mayor durabilidad",
  "Zinc-plated steel chassis and latch for enhanced corrosion resistance":
    "Chasis y picaporte de acero cincado para mayor resistencia a la corrosión",
  "Door Thickness: Adjustable 35–45mm (1-3/8” to 1-3/4”)":
    "Espesor de puerta: regulable de 35 a 45 mm (1-3/8” a 1-3/4”)",
  "Door Thickness: Adjustable for 35–50mm (1-3/8” to 2”) doors":
    "Espesor de puerta: regulable para hojas de 35 a 50 mm (1-3/8” a 2”)",
  "Door Thickness: Adjustable 35–50mm (1-3/8” to 2”)":
    "Espesor de puerta: regulable de 35 a 50 mm (1-3/8” a 2”)",
  "Key or thumb-turn locks/unlocks both knobs":
    "La llave o el botón giratorio bloquean y desbloquean ambos pomos",
  "Key or thumb-turn simultaneously locks/unlocks both knobs":
    "La llave o el botón giratorio bloquean y desbloquean ambos pomos a la vez",
  "Key or thumb-turn locks/unlocks both handles":
    "La llave o el botón giratorio bloquean y desbloquean ambas manillas",
  "Lock/unlock both knobs via key or thumb-turn":
    "Bloqueo y desbloqueo de ambos pomos con llave o botón giratorio",
  "Handing: Reversible for left or right hand doors":
    "Mano: reversible para puertas de mano izquierda o derecha",
  "Handing: Reversible for left or right-hand doors":
    "Mano: reversible para puertas de mano izquierda o derecha",
  "Handing: Fully reversible for left or right-hand doors":
    "Mano: totalmente reversible para puertas de mano izquierda o derecha",
  "Handing: Fully reversible for left or right hand doors":
    "Mano: totalmente reversible para puertas de mano izquierda o derecha",
  "Economical and easy to install": "Económica y fácil de instalar",
  "Economical and easy to install, ideal for residential use":
    "Económica y fácil de instalar, ideal para uso residencial",
  "Economical and easy to install, ideal for residential applications":
    "Económica y fácil de instalar, ideal para aplicaciones residenciales",
  "Cost-effective and easy to install, ideal for residential use":
    "Buena relación calidad-precio y fácil de instalar, ideal para uso residencial",
  "Affordable and easy to install, ideal for residential applications":
    "Asequible y fácil de instalar, ideal para aplicaciones residenciales",
  "Economical Choice – Ideal for light-duty residential applications":
    "Opción económica: ideal para aplicaciones residenciales de servicio ligero",
  "Backset: Adjustable 60mm or 70mm (2-3/8” or 2-3/4”)":
    "Entrada: regulable a 60 o 70 mm (2-3/8” o 2-3/4”)",
  "Backset: Standard 60mm (2-3/8”); 70mm (2-3/4”) & 90mm (3-9/16”) optional":
    "Entrada: 60 mm (2-3/8”) de serie; 70 mm (2-3/4”) y 90 mm (3-9/16”) opcionales",
  "Backset: Standard 60mm (2-3/8”); optional 70mm (2-3/4”) and 90mm (3-9/16”)":
    "Entrada: 60 mm (2-3/8”) de serie; opcionales 70 mm (2-3/4”) y 90 mm (3-9/16”)",
  "Backset: 60mm or 70mm (2-3/8” or 2-3/4”) adjustable":
    "Entrada: regulable de 60 o 70 mm (2-3/8” o 2-3/4”)",
  "Backset: 60mm or 70mm (2-3/8” or 2-3/4”), adjustable":
    "Entrada: 60 o 70 mm (2-3/8” o 2-3/4”), regulable",
  "Strike Plate: 57mm curved lip standard; 70mm optional":
    "Cerradero: labio curvo de 57 mm de serie; 70 mm opcional",
  "Strike Plate: 57mm curved lip standard, 70mm optional":
    "Cerradero: labio curvo de 57 mm de serie, 70 mm opcional",
  "Strike Options: 2-1/4” (57mm) curved lip standard; 2-3/4” (70mm) optional":
    "Opciones de cerradero: labio curvo de 2-1/4” (57 mm) de serie; 2-3/4” (70 mm) opcional",
  "Supports master keying for family or facility use":
    "Admite amaestramiento para uso familiar o de edificio",
  "Available functions: Entrance, Privacy, Passage, Dummy":
    "Funciones disponibles: entrada, privacidad, paso libre y decorativa",
  "Turn thumb-turn counterclockwise or key clockwise to lock; reverse to unlock":
    "Gire el botón en sentido antihorario o la llave en sentido horario para bloquear; al revés para desbloquear",
  "Rotate thumb-turn counterclockwise or key clockwise to lock; reverse to unlock":
    "Gire el botón en sentido antihorario o la llave en sentido horario para bloquear; al revés para desbloquear",
  "Locking: turn thumb-turn counter-clockwise or key clockwise; reverse to unlock":
    "Bloqueo: gire el botón en sentido antihorario o la llave en sentido horario; al revés para desbloquear",
  "Simple operation: turn to lock or unlock":
    "Manejo sencillo: girar para bloquear o desbloquear",
  "Multiple color options available": "Varias opciones de color disponibles",
  "Multiple color options": "Varias opciones de color",
  "Available in multiple colors": "Disponible en varios colores",
  "Various color options": "Distintas opciones de color",
  "Available in various colors": "Disponible en distintos colores",
  "Key-operated locking/unlocking": "Bloqueo y desbloqueo con llave",
  "– 1/2” (13mm) latch bolt extension": "– Salida de picaporte de 1/2” (13 mm)",
  "– Adjustable backset: 2-3/8” or 2-3/4” (60mm or 70mm)":
    "– Entrada regulable: 2-3/8” o 2-3/4” (60 o 70 mm)",
  "– Fits standard 2” (51mm) cross bore":
    "– Encaja en taladro pasante estándar de 2” (51 mm)",
  "– Fits door thickness: 1-3/8” to 1-3/4” (35–45mm)":
    "– Para espesor de puerta de 1-3/8” a 1-3/4” (35–45 mm)",
  "Durable design with over 200,000 life cycles":
    "Diseño duradero, con más de 200.000 ciclos de vida",
  "Durable Performance – Tested for 200,000+ cycles":
    "Prestaciones duraderas: ensayada a más de 200.000 ciclos",
  "Durable Use – Tested for over 200,000 life cycles":
    "Uso duradero: ensayada a más de 200.000 ciclos de vida",
  "200,000+ cycle durability": "Durabilidad de más de 200.000 ciclos",
  "Can be keyed alike with deadbolts for enhanced security":
    "Puede llevar la misma llave que los cerrojos, para mayor seguridad",
  "Can be keyed alike or master keyed":
    "Admite llave igual o amaestramiento",
  "Stainless Steel Hinge (Loose Pin)": "Bisagra de acero inoxidable (pasador extraíble)",
  "Adjustable spindle length based on door thickness":
    "Longitud del cuadradillo regulable según el espesor de la puerta",
  "Adjustable length based on door thickness":
    "Longitud regulable según el espesor de la puerta",
  "Adjustable length to suit door thickness":
    "Longitud regulable para adaptarse al espesor de la puerta",
  "Adjustable length based on door width":
    "Longitud regulable según el ancho de la puerta",
  "Adjustable length to fit various door widths":
    "Longitud regulable para distintos anchos de puerta",
  "Adjustable length to fit various door sizes":
    "Longitud regulable para distintos tamaños de puerta",
  "Adjustable length to fit door width":
    "Longitud regulable para ajustarse al ancho de la puerta",
  "Latch Bolt: 12mm (1/2”) throw, dead-locking on keyed models":
    "Picaporte: salida de 12 mm (1/2”), con bloqueo en los modelos con llave",
  "Latch Bolt: 12mm (1/2”) throw, dead-locking for keyed models":
    "Picaporte: salida de 12 mm (1/2”), con bloqueo en los modelos con llave",
  "Latch Bolt: 1/2” (12mm) throw with deadlocking for keyed functions":
    "Picaporte: salida de 1/2” (12 mm) con bloqueo en las funciones con llave",
  "Latch Bolt: 12mm (1/2”) throw, deadlocking for keyed functions":
    "Picaporte: salida de 12 mm (1/2”) con bloqueo en las funciones con llave",
  "Latch Bolt: 12mm (1/2”) throw; dead-locking for keyed versions":
    "Picaporte: salida de 12 mm (1/2”); con bloqueo en las versiones con llave",
  "Latch: 12mm (1/2”) throw, dead-locking for keyed functions":
    "Picaporte: salida de 12 mm (1/2”), con bloqueo en las funciones con llave",
  "Deadlocking latch bolt": "Picaporte con bloqueo",
  "• Keyed alike with deadbolt series": "• Misma llave que la serie de cerrojos",
  "• Group keying for convenience": "• Llave por grupos, para mayor comodidad",
  "• Master keyed for facility or family use":
    "• Amaestrada para uso de edificio o familiar",
  "• Compatible with deadbolts for enhanced security":
    "• Compatible con cerrojos para mayor seguridad",
  "• Supports keyed-alike groups": "• Admite grupos con llave igual",
  "• Master keying available for family or facility use":
    "• Amaestramiento disponible para uso familiar o de edificio",
  "Flexible Keying –": "Sistema de llaves flexible:",
  "Corrosion Resistance – Zinc-plated solid steel chassis & latch case":
    "Resistencia a la corrosión: chasis y caja de picaporte de acero macizo cincado",
  "Corrosion Resistant – Zinc-plated steel chassis and latch case":
    "Resistente a la corrosión: chasis y caja de picaporte de acero cincado",
  "High-Security Cylinder – 5-pin tumbler with brass plug and 2 nickel-plated brass keys":
    "Cilindro de alta seguridad: 5 pitones, núcleo de latón y 2 llaves de latón niquelado",
  "Secure Cylinder – 5-pin tumbler with brass plug and 2 nickel-plated brass keys":
    "Cilindro seguro: 5 pitones, núcleo de latón y 2 llaves de latón niquelado",
  "Trim Material – Electroplated zinc die-cast or solid brass":
    "Material de la guarnición: zamak electrochapado o latón macizo",
  "Refined Appearance – Zinc die-cast or solid brass trim with electroplated finish":
    "Acabado cuidado: guarnición de zamak o latón macizo con acabado electrochapado",
  "Optional: 1” round drive-in 4-way latch":
    "Opcional: picaporte redondo de 1” de clavar, de 4 posiciones",
  "Optional: 1” round drive-in 4-way latch available":
    "Opcional: disponible picaporte redondo de 1” de clavar, de 4 posiciones",
  "Optional Latch: 1” round drive-in 4-way latch (upon request)":
    "Picaporte opcional: redondo de 1” de clavar, de 4 posiciones (bajo pedido)",
  "Drive-In Latch: Optional 1” round 4-way latch":
    "Picaporte de clavar: opcional, redondo de 1” y 4 posiciones",
  "Interior parts: Zinc-plated steel": "Piezas interiores: acero cincado",
  "Internal parts made of zinc-plated steel for durability":
    "Piezas internas de acero cincado, para mayor durabilidad",
  "Exterior trim: Available in stainless steel, brass, or steel":
    "Guarnición exterior: disponible en acero inoxidable, latón o acero",
  "Exterior trim available in stainless steel, brass, or steel":
    "Guarnición exterior disponible en acero inoxidable, latón o acero",
  "Free-turning cylinder trim resists wrench attacks":
    "La guarnición del cilindro gira libremente y resiste los ataques con llave de tubo",
  "Free-spinning cylinder trim protects against wrench attacks":
    "La guarnición del cilindro gira loca y protege frente a ataques con llave de tubo",
  "1” (25mm) zinc die-cast bolt": "Pestillo de zamak de 1” (25 mm)",
  "1-inch (25mm) throw bolt made of zinc alloy":
    "Pestillo de 1 pulgada (25 mm) de recorrido, en aleación de zinc",
  "Hardened steel roller insert enhances resistance to sawing":
    "El rodillo de acero templado mejora la resistencia al serrado",
  "Hardened steel roller insert improves anti-sawing performance":
    "El rodillo de acero templado mejora el comportamiento frente al serrado",
  "5-pin tumbler mechanism, easy to rekey":
    "Mecanismo de 5 pitones, fácil de recodificar",
  "5-pin tumbler system, easy to rekey":
    "Sistema de 5 pitones, fácil de recodificar",
  "Solid brass plug": "Núcleo de latón macizo",
  "Solid brass plug with two nickel-plated brass keys included":
    "Núcleo de latón macizo, con dos llaves de latón niquelado incluidas",
  "Includes two nickel-plated brass keys":
    "Incluye dos llaves de latón niquelado",
  "Fully reversible handing": "Mano totalmente reversible",
  "Ideal for left or right door installation without extra adjustment":
    "Ideal para montaje en puerta izquierda o derecha, sin ajustes adicionales",
  "Universal handing, suitable for both left-hand and right-hand doors":
    "Mano universal, válida para puertas de mano izquierda y derecha",
  "No need to specify when ordering — field-reversible":
    "No hay que indicarla al pedir: es reversible en obra",
  "Compatible with standard wooden or metal doors":
    "Compatible con puertas estándar de madera o metálicas",
  "Adjustable to fit a wide range of door thicknesses and backsets":
    "Regulable para un amplio rango de espesores de puerta y entradas",
  "• Iron backplate with aluminum alloy lever handle":
    "• Placa posterior de hierro con manilla de aleación de aluminio",
  "• Elegant twisted handle design": "• Diseño de manilla con torsión, elegante",
  "• Matte black finish, durable and corrosion-resistant":
    "• Acabado negro mate, duradero y resistente a la corrosión",
  "• Compatible with Euro profile cylinder mortise locks":
    "• Compatible con cerraduras de embutir de cilindro perfil europeo",
  "• Suitable for wooden and metal doors":
    "• Apta para puertas de madera y metálicas",
  "• Reversible handle for left or right opening doors":
    "• Manilla reversible para puertas de apertura izquierda o derecha",
  "• Easy installation and maintenance": "• Instalación y mantenimiento sencillos",
  "Trim options: wrought stainless steel or brass":
    "Opciones de guarnición: acero inoxidable forjado o latón",
  "Optional flat strike for outward-opening doors (not recommended)":
    "Cerradero plano opcional para puertas de apertura hacia fuera (no recomendado)",
  "Optional: Flat strike for outward-opening doors (not recommended)":
    "Opcional: cerradero plano para puertas de apertura hacia fuera (no recomendado)",
  "Standard: Angled strike for inward-opening doors":
    "De serie: cerradero angular para puertas de apertura hacia dentro",
  "Angled strike standard for inward-opening doors":
    "Cerradero angular de serie para puertas de apertura hacia dentro",
  "Security: High-security design with anti-theft protection":
    "Seguridad: diseño de alta seguridad con protección antirrobo",
  "Two-point locking system": "Sistema de cierre en dos puntos",
  "Traditional European design, non-handed":
    "Diseño europeo tradicional, sin mano",
  "Square spindle: 8×8mm or 9×9mm": "Cuadradillo: 8×8 mm o 9×9 mm",
  "Single Cylinder: Operated by key and inside knob, with anti-pick slide gate":
    "Cilindro simple: accionado con llave y con el pomo interior, con pletina antiganzúa",
  "Single Cylinder: Operated by key and inside knob; includes anti-pick slide gate":
    "Cilindro simple: accionado con llave y con el pomo interior; incluye pletina antiganzúa",
  "Double Cylinder: Operated by key from both inside and outside":
    "Doble cilindro: accionado con llave desde dentro y desde fuera",
  "Durable construction with an attractive finish":
    "Construcción duradera con un acabado atractivo",
  "Double cylinder, double-throw rim lock":
    "Cerradura de sobreponer de doble cilindro y doble vuelta",
  "Triple security: anti-pry, anti-inside unlock without key, and anti-removal from inside when locked":
    "Triple seguridad: antipalanca, no se abre desde dentro sin llave y no se puede desmontar desde dentro con la puerta cerrada",
  "Suitable for wooden or iron doors": "Apta para puertas de madera o de hierro",
  "Suitable for wooden or metal doors (interior/exterior)":
    "Apta para puertas de madera o metálicas (interiores o exteriores)",
  "Secure deadbolt and bronze slide latch system":
    "Pestillo de seguridad y sistema de pasador de bronce",
  "Includes rectangular steel pin for added strength":
    "Incluye pasador rectangular de acero para mayor resistencia",
  "Classic key operation with separate cylinder":
    "Accionamiento clásico con llave, con cilindro independiente",
  "Available in standard and economy versions":
    "Disponible en versión estándar y en versión económica",
  "Ideal for bedrooms and privacy rooms":
    "Ideal para dormitorios y estancias que requieren privacidad",
  "Button-lock mechanism: press to lock, release to unlock":
    "Mecanismo de botón: pulsar para bloquear, soltar para desbloquear",
  "Durable, heavy-duty construction": "Construcción robusta y duradera",
  "Multiple finishes available to match interior styles":
    "Varios acabados disponibles para combinar con el interiorismo",

  "US type 3-latch construction, long-lasting performance":
    "Construcción americana de 3 picaportes, de larga duración",
  "Zinc alloy handle & rose, strong and durable":
    "Manilla y roseta de aleación de zinc, resistentes y duraderas",
  "Corrosion-resistant plated finish":
    "Acabado galvánico resistente a la corrosión",
  "Smooth turning, comfortable to operate":
    "Giro suave, cómodo de accionar",
  "Easy installation with universal standard fitting":
    "Instalación sencilla con mecanizado estándar universal",
  "Ideal for residential and commercial interior doors":
    "Ideal para puertas interiores residenciales y comerciales",
  "Made of high-grade 304 stainless steel for durability and corrosion resistance":
    "Fabricada en acero inoxidable 304 de alta calidad, duradero y resistente a la corrosión",
  "Compatible with lock cases and profile cylinders":
    "Compatible con cajas de cerradura y cilindros de perfil",
  "Ideal for fire-rated doors":
    "Ideal para puertas cortafuego",
  "Combines strength, security, and modern design—popular in the South American market":
    "Combina resistencia, seguridad y diseño moderno; muy demandada en el mercado sudamericano",
  "Optional configurations: Single or Double Cylinder":
    "Configuraciones opcionales: cilindro simple o doble cilindro",
  "• Durable iron lock body for enhanced strength and stability":
    "• Cuerpo de cerradura de hierro, para mayor resistencia y estabilidad",
  "• American-style brass cylinder for smooth key operation":
    "• Cilindro de latón de tipo americano, de giro suave",
  "• Multiple bolt configurations to meet different door requirements":
    "• Varias configuraciones de pestillo, para distintas exigencias de puerta",
  "• Concealed structure for clean appearance and secure installation":
    "• Estructura oculta, de aspecto limpio e instalación segura",
  "• Suitable for aluminum narrow doors and commercial door systems":
    "• Apta para puertas de aluminio de perfil estrecho y sistemas de puerta comercial",
  "• OEM / ODM customization available":
    "• Personalización OEM / ODM disponible",
  "This concealed lock body is designed for aluminum narrow doors and commercial applications.":
    "Este cuerpo de cerradura oculto está pensado para puertas de aluminio de perfil estrecho y para aplicaciones comerciales.",
  "It features an American-style brass lock cylinder and a durable iron lock body, offering stable performance, smooth operation, and long service life.":
    "Lleva un cilindro de latón de tipo americano y un cuerpo de cerradura de hierro resistente, lo que le da un funcionamiento estable, un accionamiento suave y una larga vida útil.",
  "Widely used for aluminum doors, narrow frame doors, and fast-food restaurant door systems such as KFC lock bodies.":
    "Muy utilizada en puertas de aluminio, puertas de perfil estrecho y sistemas de puerta de restaurantes de comida rápida, como los cuerpos de cerradura de KFC.",
  "Designed for use with panic exit devices":
    "Diseñada para usarse con barras antipánico",
  "Durable plated 304SS construction for corrosion resistance and fire door compatibility":
    "Construcción duradera en acero inoxidable 304 recubierto, resistente a la corrosión y apta para puertas cortafuego",
  "Made of durable zinc alloy with a painted finish, the body and lever handle offer excellent strength and durability. The iron spindle ensures smooth, reliable operation.":
    "Fabricados en aleación de zinc con acabado pintado, el cuerpo y la manilla ofrecen una resistencia y una durabilidad excelentes. El cuadradillo de hierro asegura un accionamiento suave y fiable.",
  "External lever handle for panic exit device":
    "Manilla exterior para barra antipánico",
  "External lever handle for panic exit devices":
    "Manilla exterior para barras antipánico",
  "External lever handle for panic device":
    "Manilla exterior para dispositivo antipánico",
  "External lever handle for panic bar":
    "Manilla exterior para barra antipánico",
  "External handle for panic bar systems":
    "Manilla exterior para sistemas de barra antipánico",
  "Key-operated lock/unlock":
    "Bloqueo y desbloqueo con llave",
  "Standards: ANSI Grade 2":
    "Normas: ANSI grado 2",
  "Durable security handle for panic exit devices":
    "Manilla de seguridad duradera para barras antipánico",
  "Compatible with cylinder lock/unlock systems":
    "Compatible con sistemas de bloqueo y desbloqueo por cilindro",
  "Suitable for various push bar types":
    "Apta para distintos tipos de barra de empuje",
  "Security trim with cylinder for panic devices":
    "Guarnición de seguridad con cilindro para dispositivos antipánico",
  "Durable construction with customizable appearance":
    "Construcción duradera con aspecto personalizable",
  "• Suit for mortise type lock body":
    "• Apta para cuerpo de cerradura de embutir",
  "• Iron bar: 9×9×130mm":
    "• Barra de hierro: 9×9×130 mm",
  "• Backset: 65mm":
    "• Entrada: 65 mm",
  "• Center Distance: 72mm":
    "• Distancia entre ejes: 72 mm",
  "• Color: Painted optional":
    "• Color: pintado opcional",
  "Crafted from premium SUS304 stainless steel, this handle offers a sleek and elegant look for glass entry doors.":
    "Fabricado en acero inoxidable SUS304 de primera calidad, este tirador da un aspecto limpio y elegante a las puertas de entrada de vidrio.",
  "Durable, corrosion-resistant, and easy to install.":
    "Duradero, resistente a la corrosión y fácil de instalar.",
  "Compatible with most standard locks and easily interchangeable with other handle designs.":
    "Compatible con la mayoría de cerraduras estándar y fácilmente intercambiable con otros diseños de tirador.",
  "Premium-grade SUS304 stainless steel handle, designed to add a modern, elegant touch to glass entry doors.":
    "Tirador de acero inoxidable SUS304 de primera calidad, pensado para dar un toque moderno y elegante a las puertas de entrada de vidrio.",
  "Durable, corrosion-resistant, and safe for long-term use.":
    "Duradero, resistente a la corrosión y seguro para un uso prolongado.",
  "Easy to install—compatible with existing lock holes and supports handle replacements in various finishes or styles.":
    "Fácil de instalar: aprovecha los taladros de cerradura existentes y permite sustituir el tirador por otros acabados o estilos.",
  "Elegant and durable SUS304 stainless steel handle for glass doors.":
    "Tirador de acero inoxidable SUS304 para puertas de vidrio, elegante y duradero.",
  "Easy to install, corrosion-resistant, and compatible with most standard lock replacements.":
    "Fácil de instalar, resistente a la corrosión y compatible con la sustitución de la mayoría de cerraduras estándar.",
  "Ideal for modern entryways requiring both aesthetics and functionality.":
    "Ideal para accesos modernos que exigen estética y función a la vez.",
  "High-quality SUS304 stainless steel handle with a refined satin and polished finish.":
    "Tirador de acero inoxidable SUS304 de alta calidad, con un cuidado acabado satinado y pulido.",
  "Elegant and secure, easy to install on glass doors without modification.":
    "Elegante y seguro, fácil de instalar en puertas de vidrio sin modificarlas.",
  "Compatible with standard lock systems and ideal for upgrading door aesthetics.":
    "Compatible con los sistemas de cerradura estándar e ideal para mejorar la estética de la puerta.",
  "Elegant SUS304 stainless steel handle with an acrylic center for a modern look.":
    "Tirador elegante de acero inoxidable SUS304 con centro de acrílico, de aspecto moderno.",
  "Durable, safe, and easy to install on glass doors without drilling.":
    "Duradero, seguro y fácil de instalar en puertas de vidrio sin taladrar.",
  "Compatible with most lock systems for easy replacement and upgrade.":
    "Compatible con la mayoría de sistemas de cerradura, para sustituirla o mejorarla sin complicaciones.",
  "Supports electric and manual operation":
    "Admite accionamiento eléctrico y manual",
  "Supports both electric and manual operation":
    "Admite tanto accionamiento eléctrico como manual",
  "Anti-tamper security with signal feedback to prevent unauthorized unlocking":
    "Seguridad antimanipulación con señal de retorno, para impedir aperturas no autorizadas",
  "Anti-unlock protection with signal feedback for enhanced security":
    "Protección contra apertura forzada con señal de retorno, para mayor seguridad",
  "Ideal for intercom and access control systems":
    "Ideal para sistemas de portero automático y control de accesos",
  "Ideal for intercom or access control systems":
    "Ideal para sistemas de portero automático o de control de accesos",
  "Suitable for homes, apartments, hotels, warehouses, schools, and institutions":
    "Apta para viviendas, apartamentos, hoteles, almacenes, colegios e instituciones",
  "Suitable for homes, apartments, hotels, warehouses, schools, and public buildings":
    "Apta para viviendas, apartamentos, hoteles, almacenes, colegios y edificios públicos",
  "Modern Zinc Alloy Bathroom Indicator Lock designed for toilet cubicle doors, restroom partitions, and privacy doors.":
    "Cerradura de baño con indicador, en aleación de zinc y de diseño actual, pensada para puertas de cabina de aseo, mamparas de baño y puertas que requieren privacidad.",
  "The vacant (green) and occupied (red) indicator clearly shows room availability, improving privacy and convenience in public restroom applications.":
    "El indicador de libre (verde) y ocupado (rojo) muestra con claridad si la cabina está disponible, lo que mejora la privacidad y la comodidad en aseos públicos.",
  "Made of durable zinc alloy with a smooth satin finish, this Bathroom Indicator Lock offers corrosion resistance, stable performance, and long service life.":
    "Fabricada en aleación de zinc resistente con un acabado satinado suave, esta cerradura con indicador ofrece resistencia a la corrosión, funcionamiento estable y una larga vida útil.",
  "The surface-mounted structure allows quick and easy installation.":
    "La estructura de sobreponer permite una instalación rápida y sencilla.",
  "Suitable for hotels, offices, shopping malls, hospitals, schools, airports, restaurants, and commercial restroom projects.":
    "Apta para hoteles, oficinas, centros comerciales, hospitales, colegios, aeropuertos, restaurantes y proyectos de aseos comerciales.",
  "• Vacant / Occupied Indicator":
    "• Indicador de libre / ocupado",
  "• Smooth Slide Bolt Operation":
    "• Pasador de accionamiento suave",
  "• Durable Zinc Alloy Construction":
    "• Construcción duradera en aleación de zinc",
  "• Easy Surface-Mounted Installation":
    "• Instalación sencilla, de sobreponer",
  "• Commercial Bathroom Hardware Solution":
    "• Solución de herrajes para aseos comerciales",
  "OEM & ODM customization available.":
    "Personalización OEM y ODM disponible.",
  "Mortise lock design":
    "Diseño de cerradura de embutir",
  "Exposed press-type push bar":
    "Barra de empuje vista, de presión",
  "One-point locking system":
    "Sistema de cierre en un punto",
  "One-point locking mechanism":
    "Mecanismo de cierre en un punto",
  "Single-point locking system":
    "Sistema de cierre de un solo punto",
  "Exposed design with semi-length push bar":
    "Diseño visto con barra de empuje de media longitud",
  "Suitable for left- and right-hand doors":
    "Apta para puertas de mano izquierda y derecha",
  "Color and length customizable":
    "Color y longitud personalizables",
  "External access via cylinder with 3 keys":
    "Acceso desde el exterior mediante cilindro, con 3 llaves",
  "Internal touch bar ensures safe and quick emergency exit":
    "La barra de toque interior garantiza una salida de emergencia segura y rápida",
  "Exposed half-arm steel body design":
    "Diseño de cuerpo de acero visto, de medio brazo",
  "Adjustable length and bolt height to fit various door sizes":
    "Longitud y altura del pestillo regulables para distintos tamaños de puerta",
  "Safety lock mechanism":
    "Mecanismo de bloqueo de seguridad",
  "Exposed type design":
    "Diseño de tipo visto",
  "Full-length push bar":
    "Barra de empuje de longitud completa",
  "90-minute fire resistance tested":
    "Ensayada a 90 minutos de resistencia al fuego",
  "Turn handle for locking/unlocking":
    "Manilla giratoria para bloquear y desbloquear",
  "Integrated lock and counter lock system":
    "Sistema integrado de cerradura y contracerradura",
  "1. Lock/unlock via turn handle":
    "1. Bloqueo y desbloqueo mediante manilla giratoria",
  "2. Adjustable length to fit door width":
    "2. Longitud regulable para ajustarse al ancho de la puerta",
  "3. Multiple color options":
    "3. Varias opciones de color",
  "4. Integrated lock and counter lock system":
    "4. Sistema integrado de cerradura y contracerradura",
  "• Lock Case: 072":
    "• Caja de cerradura: 072",
  "• Handle Options: 015 or 9080E":
    "• Opciones de manilla: 015 o 9080E",
  "• Cylinder: Customized length per door thickness":
    "• Cilindro: longitud a medida según el espesor de la puerta",
  "Suitable for steel, aluminum, or wooden double-leaf and fire doors":
    "Apta para puertas de dos hojas y cortafuego de acero, aluminio o madera",
  "Anti-slip push bar for fast, safe egress in emergencies":
    "Barra de empuje antideslizante, para una evacuación rápida y segura",
  "Accessible to children, elderly, or injured—no key required":
    "Accesible para niños, personas mayores o heridas: no hace falta llave",
  "Ideal for high-traffic public buildings: schools, hospitals, malls, airports, etc.":
    "Ideal para edificios públicos de mucho tránsito: colegios, hospitales, centros comerciales, aeropuertos, etc.",
  "Compatible with steel, aluminum, or wooden doors":
    "Compatible con puertas de acero, aluminio o madera",
  "Suitable for single-leaf and fire doors":
    "Apta para puertas de una hoja y para puertas cortafuego",
  "Suitable for fire-rated double doors":
    "Apta para puertas cortafuego de dos hojas",
  "Designed for high-traffic areas: schools, hospitals, malls, factories, airports, etc.":
    "Diseñada para zonas de mucho tránsito: colegios, hospitales, centros comerciales, fábricas, aeropuertos, etc.",
  "Anti-slip bar ensures safe and quick exit during emergencies":
    "La barra antideslizante garantiza una salida segura y rápida en caso de emergencia",
  "Easy operation—accessible to children, the elderly, or injured persons without a key":
    "Manejo sencillo: accesible sin llave para niños, personas mayores o heridas",
  "Suitable for handed or non-handed installation":
    "Apta para montaje con mano o sin mano",
  "• Key-operated locking from both sides; handle and key access from outside, panic push-bar from inside":
    "• Bloqueo con llave por ambos lados; desde fuera se abre con manilla y llave, desde dentro con la barra antipánico",
  "• Key locks from outside only; unlocks via handle/key outside and panic device inside":
    "• La llave bloquea solo desde fuera; se desbloquea con manilla o llave desde fuera y con el dispositivo antipánico desde dentro",
  "• Key retracts latch bolt from outside; opens with panic bar from inside":
    "• La llave recoge el picaporte desde fuera; desde dentro se abre con la barra antipánico",
  "• Center distance optional 72mm / 92mm":
    "• Distancia entre ejes opcional de 72 mm / 92 mm",
  "• Spindle size 9mm.":
    "• Cuadradillo de 9 mm.",
  "• EN1125 certified, durability tested >300,000 cycles":
    "• Certificada según EN 1125, ensayada a más de 300.000 ciclos de durabilidad",
  "• Suitable for single & double doors":
    "• Apta para puertas de una y de dos hojas",
  "• Reversible for left/right handing,no orientation required":
    "• Reversible para mano izquierda o derecha, no hay que indicar la orientación",
  "• Max door weight: ≥200kg":
    "• Peso máximo de puerta: ≥200 kg",
  "• Max door height: 2520mm":
    "• Altura máxima de puerta: 2520 mm",
  "• Max door width: 1500mm":
    "• Ancho máximo de puerta: 1500 mm",
  "• Working temperature: -10°C ~ +60°C":
    "• Temperatura de servicio: -10 °C ~ +60 °C",
  "• Supports DIN left/right door installation":
    "• Admite montaje DIN izquierda / derecha",
  "• One push to open – fast evacuation":
    "• Se abre de un empujón: evacuación rápida",
  "• Robust structure with high load resistance for long-term reliability":
    "• Estructura robusta y de alta resistencia a la carga, fiable a largo plazo",
  "• Easy installation with wide compatibility":
    "• Instalación sencilla y amplia compatibilidad",
  "• Supports top & bottom bolt linkage for double door systems":
    "• Admite varillaje superior e inferior para sistemas de doble puerta",
  "Suitable for emergency exit doors, fire doors, smoke control doors":
    "Apta para puertas de salida de emergencia, puertas cortafuego y puertas cortahumos",
  "Recommended for high-traffic public areas:":
    "Recomendada para zonas públicas de mucho tránsito:",
  "Shopping malls / Hospitals / Schools / Cinemas / Stadiums / Office buildings / Exhibition centers / Airports / Metro & transport hubs":
    "Centros comerciales / Hospitales / Colegios / Cines / Estadios / Edificios de oficinas / Recintos feriales / Aeropuertos / Metro e intercambiadores de transporte",
  "The product features a built-in alarm function. When the alarm mode is activated, pressing the push bar will trigger the alarm, helping improve safety control and prevent unauthorized use.":
    "El producto lleva función de alarma integrada. Con el modo de alarma activado, al presionar la barra se dispara la alarma, lo que ayuda a controlar la seguridad y a impedir un uso indebido.",
  "It is widely used in hotels, hospitals, schools, offices, shopping malls, factories, warehouses, and other public buildings.":
    "Se utiliza ampliamente en hoteles, hospitales, colegios, oficinas, centros comerciales, fábricas, almacenes y otros edificios públicos.",
  "Suitable for shopping malls, hotels, schools, hospitals, office buildings, warehouses, factories, and other commercial spaces.":
    "Apta para centros comerciales, hoteles, colegios, hospitales, edificios de oficinas, almacenes, fábricas y otros espacios comerciales.",
  "Ideal for shopping malls, schools, hospitals, hotels, office buildings, factories, warehouses, and other commercial or public facilities.":
    "Ideal para centros comerciales, colegios, hospitales, hoteles, edificios de oficinas, fábricas, almacenes y otras instalaciones comerciales o públicas.",
  "It helps reduce the risk of people being trapped inside cold rooms. An optional outside handle is available for daily door operation.":
    "Ayuda a reducir el riesgo de que alguien quede atrapado dentro de una cámara frigorífica. Existe una manilla exterior opcional para el uso diario de la puerta.",

  "3-point locking system":
    "Sistema de cierre en tres puntos",
  "Available in single or double-sided operation":
    "Disponible con accionamiento por uno o por ambos lados",
  "Finishes: PB, CP, SS, SC, AB, AC":
    "Acabados: PB, CP, SS, SC, AB, AC",
  "Supplied with 3 or 5 keys; computer keys optional":
    "Se suministra con 3 o 5 llaves; llaves de seguridad opcionales",
  "Angled strike (standard) for inward-opening doors":
    "Cerradero angular (de serie) para puertas de apertura hacia dentro",
  "Single Cylinder: Key and inside knob operate latch, with anti-pick slide gate":
    "Cilindro simple: la llave y el pomo interior accionan el picaporte, con pletina antiganzúa",
  "Double Cylinder: Key operation from both sides":
    "Doble cilindro: accionamiento con llave por ambos lados",
  "Double Cylinder: Operated by key on both sides":
    "Doble cilindro: se acciona con llave por ambos lados",
  "Double Cylinder: Operated by key from both sides":
    "Doble cilindro: se acciona con llave desde los dos lados",
  "Security: High-security, anti-theft performance":
    "Seguridad: alta seguridad, con prestaciones antirrobo",
  "Security: High protection against theft with self-locking option":
    "Seguridad: alta protección antirrobo, con opción de autobloqueo",
  "Lock Function:":
    "Función de la cerradura:",
  "This anti-theft rim lock night latch is designed for surface-mounted door installation, providing dependable security for residential applications.":
    "Esta cerradura de sobreponer antirrobo está pensada para montaje en la cara de la puerta y ofrece una seguridad fiable en aplicaciones residenciales.",
  "The lock cylinder features an aluminum outer housing with a brass core, delivering consistent key rotation and stable locking performance.":
    "El cilindro lleva carcasa exterior de aluminio y núcleo de latón, lo que da un giro de llave constante y un cierre estable.",
  "The rotating tail bar is made of iron, providing secure power transmission during locking and unlocking.":
    "La cola giratoria es de hierro y transmite el movimiento con seguridad al bloquear y desbloquear.",
  "Supplied as a complete hardware set, the lock includes an iron cylinder decorative ring, iron keys, iron decorative plate, and iron fixing screws, making installation simple and convenient.":
    "Se suministra como juego completo: incluye embellecedor de hierro para el cilindro, llaves de hierro, placa decorativa de hierro y tornillos de fijación de hierro, de modo que la instalación es sencilla y cómoda.",
  "With its classic night latch structure and anti-theft design, this lock is widely used on wooden and metal doors in homes, apartments, and similar environments.":
    "Con su estructura clásica de cerradura de sobreponer y su diseño antirrobo, se utiliza ampliamente en puertas de madera y metálicas de viviendas, apartamentos y entornos similares.",
  "OEM / ODM customization, surface finishes, and packaging options are available upon request.":
    "Bajo pedido hay disponibles personalización OEM / ODM, acabados superficiales y opciones de embalaje.",
  "Provides reliable security for exterior wooden doors":
    "Ofrece una seguridad fiable en puertas exteriores de madera",
  "Economical and durable night latch design":
    "Diseño de cerradura de sobreponer económico y duradero",
  "Ideal for residential use; compatible with intercom and access control systems. Suitable for apartments, commercial buildings, schools, warehouses, hotels, and more.":
    "Ideal para uso residencial; compatible con sistemas de portero automático y control de accesos. Apta para apartamentos, edificios comerciales, colegios, almacenes, hoteles y más.",
  "Ideal for residential doors, intercom systems, and access control. Suitable for apartments, hotels, warehouses, schools, and commercial buildings.":
    "Ideal para puertas residenciales, sistemas de portero automático y control de accesos. Apta para apartamentos, hoteles, almacenes, colegios y edificios comerciales.",
  "Available in single or double cylinder options":
    "Disponible con cilindro simple o doble cilindro",
  "Self-locking function":
    "Función de autobloqueo",
  "Anti-theft design with high security":
    "Diseño antirrobo de alta seguridad",
  "Operated by key or rotating knob":
    "Se acciona con llave o con pomo giratorio",
  "Full turn of key locks or unlocks":
    "Una vuelta completa de llave bloquea o desbloquea",
  "Latch operated by both knobs; inside knob always free":
    "El picaporte se acciona con ambos pomos; el pomo interior queda siempre libre",
  "Outside knob locked/unlocked by key in inside cylinder":
    "El pomo exterior se bloquea y desbloquea con llave desde el cilindro interior",
  "Latch automatically deadlocks when door is closed":
    "El picaporte se autobloquea al cerrar la puerta",
  "Latch automatically deadlocks when closed":
    "El picaporte se autobloquea al cerrarse",
  "Ideal for communicating or exit doors with one-side operation":
    "Ideal para puertas de comunicación o de salida con accionamiento por un solo lado",
  "Suitable for doors with limited space near switch panels":
    "Apta para puertas con poco espacio junto a los cuadros de interruptores",
  "Blank rose design":
    "Diseño de roseta ciega",
  "Recommended for rooms with multiple entrances":
    "Recomendada para estancias con varias entradas",
  "Inside knob operates latch":
    "El pomo interior acciona el picaporte",
  "Outside knob always fixed; operated by key only":
    "El pomo exterior está siempre fijo; solo se acciona con llave",
  "Security: 5-pin tumbler brass cylinder with two nickel-plated brass keys":
    "Seguridad: cilindro de latón de 5 pitones con dos llaves de latón niquelado",
  "Standards: ANSI Grade 3, tested for over 200,000 cycles":
    "Normas: ANSI grado 3, ensayada a más de 200.000 ciclos",
  "Standards: ANSI Grade 3":
    "Normas: ANSI grado 3",
  "Application: Entrance doors for homes, apartments, or light commercial use":
    "Aplicación: puertas de entrada de viviendas, apartamentos o uso comercial ligero",
  "Durable and cost-effective cylindrical lockset designed for standard residential use. Ideal for entrance doors requiring reliable performance and enhanced security.":
    "Juego de cerradura cilíndrica duradero y de buena relación calidad-precio, pensado para uso residencial estándar. Ideal para puertas de entrada que necesitan un funcionamiento fiable y más seguridad.",
  "Economical choice for standard residential use":
    "Opción económica para uso residencial estándar",
  "Guaranteed for over 200,000 life cycles":
    "Garantizada para más de 200.000 ciclos de vida",
  "Tested for over 200,000 life cycles":
    "Ensayada a más de 200.000 ciclos de vida",
  "Durable: Tested for over 200,000 cycles":
    "Duradera: ensayada a más de 200.000 ciclos",
  "Can be keyed alike to deadbolt series for added security":
    "Puede llevar la misma llave que la serie de cerrojos, para más seguridad",
  "Keyed alike with deadbolts for enhanced security":
    "Misma llave que los cerrojos, para mayor seguridad",
  "Supports keyed alike function with deadbolts to enhance security":
    "Admite la función de llave igual con los cerrojos, para mayor seguridad",
  "Supports master keying for family or facility needs":
    "Admite amaestramiento para necesidades familiares o de edificio",
  "Solid steel chassis and zinc-plated latch case for corrosion resistance":
    "Chasis de acero macizo y caja de picaporte cincada, resistentes a la corrosión",
  "Solid steel chassis and latch case, zinc-plated for corrosion resistance":
    "Chasis y caja de picaporte de acero macizo, cincados para resistir la corrosión",
  "Latch bolt operated by key (outside) or knob (inside)":
    "El picaporte se acciona con llave (desde fuera) o con el pomo (desde dentro)",
  "Outside knob remains fixed":
    "El pomo exterior permanece fijo",
  "Inside knob locked/unlocked by key from inside":
    "El pomo interior se bloquea y desbloquea con llave desde dentro",
  "Latch bolt auto-deadlocks when door is closed":
    "El picaporte se autobloquea al cerrar la puerta",
  "Latch Bolt: 12mm (1/2”) throw with deadlocking":
    "Picaporte: salida de 12 mm (1/2”) con bloqueo",
  "Latch Bolt: 12mm (1/2”) throw; dead-locking for keyed function":
    "Picaporte: salida de 12 mm (1/2”); con bloqueo en la función con llave",
  "Door Thickness: 35–50mm (1-3/8” to 2”), adjustable":
    "Espesor de puerta: 35–50 mm (1-3/8” a 2”), regulable",
  "Door Thickness: 35–45mm (1-3/8” to 1-3/4”)":
    "Espesor de puerta: 35–45 mm (1-3/8” a 1-3/4”)",
  "Backset: Standard 70mm (2-3/4”); optional 60mm or 90mm available":
    "Entrada: 70 mm (2-3/4”) de serie; opcionales de 60 o 90 mm",
  "Backset: Adjustable 60mm or 70mm (2-3/8” or 2-3/4”); 70mm strike optional":
    "Entrada: regulable a 60 o 70 mm (2-3/8” o 2-3/4”); cerradero de 70 mm opcional",
  "Ideal for medium-grade commercial and heavy-duty residential applications":
    "Ideal para aplicaciones comerciales de gama media y residenciales de uso intensivo",
  "Exposed trim in zinc die-casting (electroplated) or solid brass":
    "Guarnición vista en zamak (electrochapado) o latón macizo",
  "Exposed trim available in wrought stainless steel or brass":
    "Guarnición vista disponible en acero inoxidable forjado o latón",
  "5-pin brass cylinder, brass plug with 2 nickel-plated brass keys":
    "Cilindro de latón de 5 pitones, núcleo de latón con 2 llaves de latón niquelado",
  "1. Wide range of hinge types for different market needs worldwide.":
    "1. Amplia gama de tipos de bisagra para las necesidades de distintos mercados.",
  "2. Multiple surface finish options available, including powder coating, painting, anodizing, and wood-effect finishes.":
    "2. Varias opciones de acabado superficial: recubrimiento en polvo, pintura, anodizado y acabados imitación madera.",
  "3. Easy to install with standard mounting design.":
    "3. Fácil de instalar, con mecanizado de montaje estándar.",
  "4. Modern appearance with a clean, premium look.":
    "4. Aspecto actual, limpio y de gama alta.",
  "5. High quality, durable performance, excellent surface finish, and competitive pricing.":
    "5. Alta calidad, prestaciones duraderas, excelente acabado superficial y precio competitivo.",
  "6. Reliable after-sales service and technical support.":
    "6. Servicio posventa y soporte técnico fiables.",
  "7. Over 18 years of manufacturing and export experience.":
    "7. Más de 18 años de experiencia en fabricación y exportación.",
  "Durable 304 stainless steel":
    "Acero inoxidable 304 duradero",
  "Custom sizes and shapes available":
    "Medidas y formas a medida disponibles",
  "Easy exposed mounting for versatile use":
    "Montaje visto sencillo, para usos muy diversos",
  "Optional Latch: 1” round drive-in 4-way latch upon request":
    "Picaporte opcional: redondo de 1” de clavar y 4 posiciones, bajo pedido",
  "Economical and easy-to-install lockset, ideal for residential use":
    "Juego de cerradura económico y fácil de instalar, ideal para uso residencial",
  "Economical, easy-to-install lockset for residential use":
    "Juego de cerradura económico y fácil de instalar para uso residencial",
  "Economical and easy-to-install, ideal for residential use":
    "Económico y fácil de instalar, ideal para uso residencial",
  "– 1” (25mm) deadbolt with hardened steel insert resists sawing":
    "– Pestillo de 1” (25 mm) con inserto de acero templado que resiste el serrado",
  "– 1” (25mm) deadbolt with hardened steel insert":
    "– Pestillo de 1” (25 mm) con inserto de acero templado",
  "– 1” (25mm) solid deadbolt with hardened steel insert":
    "– Pestillo macizo de 1” (25 mm) con inserto de acero templado",
  "– 1” (25mm) steel-reinforced deadbolt":
    "– Pestillo de 1” (25 mm) reforzado con acero",
  "– Free-spinning cylinder collar prevents wrenching":
    "– El collarín del cilindro gira libremente e impide arrancarlo con llave de tubo",
  "– Free-spinning cylinder ring prevents wrenching":
    "– El anillo del cilindro gira libremente e impide arrancarlo con llave de tubo",
  "– Free-spinning cylinder ring resists wrenching":
    "– El anillo del cilindro gira libremente y resiste el arranque con llave de tubo",
  "– Anti-wrenching rotating cylinder ring":
    "– Anillo giratorio del cilindro, antiarranque",
  "– No visible exterior screws":
    "– Sin tornillos vistos por el exterior",
  "– No exposed external screws":
    "– Sin tornillos exteriores a la vista",
  "– No exposed external fasteners":
    "– Sin fijaciones exteriores a la vista",
  "– No exposed exterior fixings":
    "– Sin herrajes de fijación exteriores a la vista",
  "– Non-handed design suits both left- and right-hand doors":
    "– Diseño sin mano, válido para puertas de mano izquierda y derecha",
  "– Reversible for left or right hand doors":
    "– Reversible para puertas de mano izquierda o derecha",
  "– Reversible for left/right-handed doors":
    "– Reversible para puertas de mano izquierda o derecha",
  "– Reversible for left or right-handed doors":
    "– Reversible para puertas de mano izquierda o derecha",
  "– Door thickness: adjustable from 1-3/8” to 1-3/4” (35mm to 45mm)":
    "– Espesor de puerta: regulable de 1-3/8” a 1-3/4” (35 a 45 mm)",
  "– Fits door thickness: 1-3/8” to 1-3/4” (35mm to 45mm)":
    "– Para espesor de puerta de 1-3/8” a 1-3/4” (35 a 45 mm)",
  "– Fits 2” (51mm) standard cross bore":
    "– Encaja en taladro pasante estándar de 2” (51 mm)",
  "Installation":
    "Instalación",
  "Enhanced Security":
    "Mayor seguridad",

  "Elegant entrance handle set crafted from durable zinc alloy with polished brass finish. Designed to fit standard door preparations, offering an easy upgrade for residential entry doors.":
    "Juego de manilla de entrada elegante, fabricado en aleación de zinc duradera con acabado latón pulido. Diseñado para encajar en los mecanizados de puerta estándar, es una mejora sencilla para puertas de entrada residenciales.",
  "Stylish grip handle set designed to enhance the appearance and security of entrance doors. Made of durable zinc alloy with satin nickel finish, compatible with standard door preps and easy to install.":
    "Juego de tirador con placa de línea cuidada, pensado para mejorar el aspecto y la seguridad de las puertas de entrada. Fabricado en aleación de zinc duradera con acabado níquel satinado, compatible con los mecanizados de puerta estándar y fácil de instalar.",
  "Premium Construction: Durable zinc alloy with polished brass finish; external components crafted from forged brass or electroplated zinc die-cast.":
    "Construcción de calidad: aleación de zinc duradera con acabado latón pulido; las piezas exteriores son de latón forjado o de zamak electrochapado.",
  "Optimized Description:":
    "Descripción optimizada:",
  "Polished brass grip handle set designed to enhance entrance doors with elegance and functionality. Compatible with standard door preparations, ideal for both replacements and new installations.":
    "Juego de tirador en latón pulido, pensado para dar elegancia y funcionalidad a las puertas de entrada. Compatible con los mecanizados de puerta estándar, ideal tanto para sustituciones como para obra nueva.",
  "Simple turn-to-lock mechanism":
    "Mecanismo sencillo: girar para bloquear",
  "Turn to lock; reverse to unlock":
    "Girar para bloquear; al revés para desbloquear",
  "Intuitive locking: turn to lock, reverse to unlock":
    "Bloqueo intuitivo: girar para bloquear, al revés para desbloquear",
  "Key or thumb-turn locks/unlocks both levers":
    "La llave o el botón giratorio bloquean y desbloquean ambas manillas",
  "Key or thumb-turn operates both knobs":
    "La llave o el botón giratorio accionan ambos pomos",
  "Locks/unlocks both knobs via key or thumb-turn":
    "Bloquea y desbloquea ambos pomos con llave o botón giratorio",
  "Lock/unlock via key or thumb-turn":
    "Bloqueo y desbloqueo con llave o botón giratorio",
  "Synchronized locking for both knobs":
    "Bloqueo sincronizado de ambos pomos",
  "Internal thumb-turn or key rotation locks/unlocks simultaneously":
    "El botón giratorio interior o el giro de llave bloquean y desbloquean a la vez",
  "Turning thumb-turn counter-clockwise or key clockwise locks the knobs; reverse to unlock":
    "Girando el botón en sentido antihorario o la llave en sentido horario se bloquean los pomos; al revés para desbloquear",
  "Locking: turn thumb-turn counter-clockwise or key clockwise; unlock in reverse":
    "Bloqueo: gire el botón en sentido antihorario o la llave en sentido horario; para desbloquear, al revés",
  "Zinc-plated steel chassis and latch for durability and corrosion resistance":
    "Chasis y picaporte de acero cincado, para durabilidad y resistencia a la corrosión",
  "Trim options: stainless steel or brass":
    "Opciones de guarnición: acero inoxidable o latón",
  "Trim available in stainless steel or brass":
    "Guarnición disponible en acero inoxidable o latón",
  "1. Premium 304 stainless steel material with excellent corrosion resistance and long service life.":
    "1. Acero inoxidable 304 de primera calidad, con excelente resistencia a la corrosión y larga vida útil.",
  "2. Self-closing spring hinge with adjustable tension for flexible closing force adjustment.":
    "2. Bisagra de muelle con cierre automático y tensión regulable, para ajustar la fuerza de cierre.",
  "3. Soft-close positioning function provides smooth, quiet, and stable door closing performance.":
    "3. La función de posicionamiento amortiguado da un cierre suave, silencioso y estable.",
  "4. Thickened stainless steel construction ensures strong load-bearing capacity and durable daily use.":
    "4. Construcción en acero inoxidable de mayor espesor, con gran capacidad de carga y resistencia al uso diario.",
  "5. Supports 90° positioning and 180° opening angle for convenient operation.":
    "5. Admite posicionamiento a 90° y apertura hasta 180°, para un manejo cómodo.",
  "6. Available in 4”*3”*3” and 5”*3”*3” sizes for different door applications.":
    "6. Disponible en 4”*3”*3” y 5”*3”*3”, para distintas aplicaciones de puerta.",
  "7. Multiple surface finishes available, including matte black, satin stainless steel, gold, antique brass, and antique copper.":
    "7. Varios acabados superficiales disponibles: negro mate, acero inoxidable satinado, dorado, latón antiguo y cobre antiguo.",
  "8. Suitable for wooden doors, apartment doors, hotel doors, office doors, corridor doors, and commercial doors.":
    "8. Apta para puertas de madera, de vivienda, de hotel, de oficina, de pasillo y comerciales.",
  "9. OEM & ODM customization supported for sizes, colors, finishes, and logo requirements.":
    "9. Se admite personalización OEM y ODM de medidas, colores, acabados y logotipo.",
  "• Compatible with multiple profile systems":
    "• Compatible con varios sistemas de perfil",
  "• Finishes include powder coating, anodizing, painting, wood grain, etc.":
    "• Acabados: recubrimiento en polvo, anodizado, pintura, imitación madera, etc.",
  "• Easy installation":
    "• Instalación sencilla",
  "• Durable construction with excellent surface finish":
    "• Construcción duradera con un acabado superficial excelente",
  "• Cost-effective with stable quality":
    "• Buena relación calidad-precio y calidad estable",
  "• Over 18 years of manufacturing & export experience":
    "• Más de 18 años de experiencia en fabricación y exportación",
  "• Reliable after-sales support":
    "• Soporte posventa fiable",
  "Economical and durable auxiliary lock":
    "Cerradura auxiliar económica y duradera",
  "Economical and durable auxiliary deadbolt":
    "Cerrojo auxiliar económico y duradero",
  "25mm (1”) zinc die-cast deadbolt with hardened steel roller insert for anti-saw protection":
    "Pestillo de zamak de 25 mm (1”) con inserto de rodillo de acero templado, como protección frente al serrado",
  "25mm (1”) zinc die-cast bolt with hardened steel roller insert for anti-saw protection":
    "Pestillo de zamak de 25 mm (1”) con inserto de rodillo de acero templado, como protección frente al serrado",
  "Free-turning cylinder trim prevents wrenching":
    "La guarnición del cilindro gira libremente e impide arrancarlo con llave de tubo",
  "Free-turning cylinder trim to prevent wrenching":
    "Guarnición del cilindro de giro libre, para impedir el arranque con llave de tubo",
  "Compatible with entrance bored locks for enhanced exterior door security":
    "Compatible con cerraduras de entrada de taladro pasante, para más seguridad en la puerta exterior",
  "Can be keyed alike with entrance locks for enhanced exterior security":
    "Puede llevar la misma llave que las cerraduras de entrada, para más seguridad en el exterior",
  "Can be keyed alike with standard entrance locks for seamless integration and enhanced exterior door security.":
    "Puede llevar la misma llave que las cerraduras de entrada estándar, para integrarse sin fisuras y dar más seguridad a la puerta exterior.",
  "Easy rekeying with removable brass cylinder plug":
    "Recodificación sencilla gracias al núcleo de latón extraíble",
  "Zinc-plated steel internal components":
    "Componentes internos de acero cincado",
  "5-pin solid brass cylinder, easy to rekey":
    "Cilindro de latón macizo de 5 pitones, fácil de recodificar",
  "Supplied with 2 nickel-plated brass keys":
    "Se suministra con 2 llaves de latón niquelado",
  "Deadbolt Series":
    "Serie de cerrojos",
  "A durable and cost-effective auxiliary lock featuring a 25mm (1”) zinc die-cast bolt with a hardened steel roller insert for added resistance against sawing and forced entry.":
    "Cerradura auxiliar duradera y de buena relación calidad-precio, con pestillo de zamak de 25 mm (1”) e inserto de rodillo de acero templado que añade resistencia al serrado y a la entrada forzada.",
  "•Reinforced Construction":
    "•Construcción reforzada",
  "Internal components are made of zinc-plated steel. External trims are available in stainless steel, brass, or steel options. The free-turning trim design helps resist wrenching and tampering.":
    "Los componentes internos son de acero cincado. Las guarniciones exteriores están disponibles en acero inoxidable, latón o acero. El diseño de guarnición de giro libre ayuda a resistir el arranque y la manipulación.",
  "•Heavy-Duty Deadbolt":
    "•Pestillo de uso intensivo",
  "Equipped with a full 25mm throw deadbolt and hardened steel roller, engineered to withstand high-impact attacks and sawing.":
    "Lleva un pestillo con 25 mm de salida completa y rodillo de acero templado, calculado para aguantar golpes fuertes y el serrado.",
  "•Secure Cylinder & Key System":
    "•Cilindro y sistema de llave seguros",
  "Features a 5-pin tumbler mechanism with a solid brass plug, allowing for easy rekeying. Comes with two nickel-plated brass keys.":
    "Incorpora un mecanismo de 5 pitones con núcleo de latón macizo, lo que permite recodificarla con facilidad. Se entrega con dos llaves de latón niquelado.",
  "•Flexible Installation":
    "•Instalación flexible",
  "Fully reversible handing supports both left- and right-handed doors. The adjustable backset and door thickness make it suitable for a wide range of residential and commercial applications.":
    "La mano es totalmente reversible y admite puertas de mano izquierda y derecha. La entrada y el espesor de puerta regulables la hacen válida para un amplio abanico de aplicaciones residenciales y comerciales.",
  "Made of a high-quality iron structure with zinc-plated surface treatment, providing excellent corrosion resistance and long service life. Suitable for long-term commercial and industrial environments.":
    "Fabricada con una estructura de hierro de alta calidad y tratamiento superficial cincado, que le da una excelente resistencia a la corrosión y una larga vida útil. Apta para entornos comerciales e industriales de uso prolongado.",
  "This mechanical door coordinator is designed for double-leaf door systems. It controls the correct closing sequence, ensuring that the inactive leaf closes first and the active leaf closes afterward.":
    "Este selector de cierre mecánico está pensado para sistemas de puerta de dos hojas. Controla el orden de cierre correcto, de modo que la hoja pasiva cierra primero y la hoja activa después.",
  "This double-door coordinator is designed for fire-rated and commercial double-door systems.":
    "Este selector de cierre para puerta doble está pensado para sistemas de doble hoja comerciales y con clasificación al fuego.",
  "Made from durable 304 stainless steel, it provides smooth, stable, and quiet automatic door sequencing.":
    "Fabricado en acero inoxidable 304 duradero, ordena el cierre de forma automática, suave, estable y silenciosa.",
  "The precision spring mechanism and adjustable tension screw allow flexible control of the closing force, while the nylon roller design ensures reduced wear and long service life.":
    "El mecanismo de muelle de precisión y el tornillo de tensión regulable permiten controlar la fuerza de cierre, mientras que el rodillo de nailon reduce el desgaste y alarga la vida útil.",
  "Ideal for commercial buildings, hospitals, schools, and other high-traffic applications. OEM and ODM customization services are available.":
    "Ideal para edificios comerciales, hospitales, colegios y otras aplicaciones de mucho tránsito. Hay servicios de personalización OEM y ODM disponibles.",
  "EPT Power Transfer Unit":
    "Unidad de transferencia de corriente EPT",
  "Concealed, tamper-resistant design for flexible power and data transmission":
    "Diseño oculto y resistente a la manipulación, para transmitir corriente y datos con flexibilidad",
  "• Mounts on the edge of the door and frame with concealed wiring":
    "• Se monta en el canto de la puerta y del marco, con el cableado oculto",
  "• Flexible steel conduit protects cable bundles up to Ø5/16” (8mm)":
    "• El conducto flexible de acero protege mazos de cable de hasta Ø5/16” (8 mm)",
  "• Compatible with most hinge types: butt hinges, continuous hinges, and partial pivot hinges":
    "• Compatible con la mayoría de tipos de bisagra: bisagras de pala, bisagras continuas y bisagras de pivote parcial",
  "• Rounded mounting tabs for improved installation adaptability":
    "• Pestañas de montaje redondeadas, que facilitan la adaptación en obra",
  "• EPT Standard: Suitable for standard hinges and pivot hinges with <3/4” (19mm) offset":
    "• EPT estándar: apta para bisagras estándar y bisagras de pivote con desplazamiento inferior a 3/4” (19 mm)",
  "All our door guards are for exporting, with various materials like brass, stainless Steel 304, zinc alloy and iron in order to meet different markets. With different finishes available.":
    "Todos nuestros limitadores de puerta son para exportación, con materiales como latón, acero inoxidable 304, aleación de zinc y hierro, para responder a mercados distintos. Con varios acabados disponibles.",
  "Sizes can be customized.":
    "Las medidas se pueden personalizar.",
  "Application: Suitable for kitchens, hallways, and residential doors.":
    "Aplicación: apta para cocinas, pasillos y puertas residenciales.",
  "Function: Adjustable opening/closing speed and spring tension. Allows 116° swing in both directions with stop points at 0°, 88°, and 116°.":
    "Funcionamiento: velocidad de apertura y cierre y tensión del muelle regulables. Permite un giro de 116° en ambos sentidos, con puntos de parada a 0°, 88° y 116°.",
  "Durability: Tested for over 500,000 open-close cycles":
    "Durabilidad: ensayada a más de 500.000 ciclos de apertura y cierre",
  "Adjustment: Latch speed and closing speed adjustable via built-in screws":
    "Regulación: velocidad de acuñado y velocidad de cierre regulables mediante tornillos integrados",
  "Function: 13mm latch extension with inside deadlocking button to prevent outside key operation and latch picking":
    "Funcionamiento: picaporte con 13 mm de salida y botón de bloqueo interior, que impide el accionamiento con llave desde fuera y la manipulación del picaporte",
  "Packing: Blister or color box":
    "Embalaje: blíster o caja de color",
  "G.W.: 16kg / N.W.: 15kg":
    "Peso bruto: 16 kg / Peso neto: 15 kg",
  "Carton Size: 41.5 × 26 × 30.5 cm":
    "Medidas de la caja: 41,5 × 26 × 30,5 cm",
  "Installation Instructions":
    "Instrucciones de instalación",
  "Compatible Door Thickness: 8–10 mm glass doors":
    "Espesor de puerta compatible: puertas de vidrio de 8–10 mm",
  "No Drilling Required: Installs without cutting or drilling the glass":
    "No requiere taladro: se instala sin cortar ni taladrar el vidrio",
  "Clean Surface: Wipe the installation area on the glass with a damp cloth.":
    "Limpie la superficie: pase un paño húmedo por la zona del vidrio donde se va a instalar.",
  "Position the Lock: Select the correct position and check that the latch operates smoothly.":
    "Sitúe la cerradura: elija la posición correcta y compruebe que el picaporte se mueve con suavidad.",
  "Attach Plate A:":
    "Coloque la placa A:",
  "Use the clamp plates to secure the lock.":
    "Use las placas de apriete para fijar la cerradura.",
  "Adjust or loosen the screws on Plate A as needed to ensure a firm fit on the glass.":
    "Ajuste o afloje los tornillos de la placa A según haga falta, hasta que quede firme sobre el vidrio.",
  "Install Plate B:":
    "Instale la placa B:",
  "Hook the holding teeth of Plate B onto the back of Plate A.":
    "Enganche los dientes de sujeción de la placa B en la parte trasera de la placa A.",
  "Push forward firmly, then secure with two screws.":
    "Empuje con firmeza hacia delante y fíjela después con dos tornillos.",
  "Stainless Steel Door Latch Guard, durable material with satin finish, strong and corrosion resistant for long term use":
    "Protector de picaporte de acero inoxidable, material duradero con acabado satinado, resistente y anticorrosión para un uso prolongado",
  "Anti Pry Door Security Plate, reinforces the latch area to prevent forced entry and improve door security":
    "Placa de seguridad antipalanca, refuerza la zona del picaporte para impedir la entrada forzada y mejorar la seguridad de la puerta",
  "Full Latch Coverage Design, effectively blocks latch bolt access and makes it difficult to pry open the door":
    "Diseño de cobertura completa del picaporte, que bloquea el acceso al resbalón y dificulta apalancar la puerta",
  "Heavy Duty Construction, thick and solid structure provides reliable protection for residential and commercial doors":
    "Construcción de uso intensivo, estructura gruesa y sólida que protege con fiabilidad puertas residenciales y comerciales",
  "Easy Installation, quick screw fixing installation, suitable for most outswing doors without complex tools":
    "Instalación sencilla, fijación rápida con tornillos, válida para la mayoría de puertas de apertura hacia fuera sin herramientas complicadas",
  "Includes 304 Stainless Steel Screws, ensures strong fixing and long lasting durability":
    "Incluye tornillos de acero inoxidable 304, que garantizan una fijación firme y una durabilidad prolongada",
  "Designed for the Australian Market, meets application needs for outswing door systems":
    "Diseñado para el mercado australiano, responde a las necesidades de los sistemas de puerta de apertura hacia fuera",
  "Wide Application, ideal for home office apartment and commercial door security systems":
    "Aplicación amplia, ideal para sistemas de seguridad de puertas de vivienda, oficina, apartamento y locales comerciales",
  "Key Features：":
    "Características principales:",
  "• Deadlatch security design for enhanced anti-pry protection":
    "• Diseño de picaporte con bloqueo, para una mayor protección antipalanca",
  "• Durable iron body with zinc alloy + ABS latch":
    "• Cuerpo de hierro duradero con picaporte de aleación de zinc y ABS",
  "• Double & single cylinder configurations available":
    "• Disponible en configuración de cilindro simple y doble cilindro",
  "• Hold-back function for smooth door operation":
    "• Función de retención, para un uso cómodo de la puerta",
  "• Ideal for aluminum storefront and narrow frame doors":
    "• Ideal para puertas de escaparate de aluminio y de perfil estrecho",
  "This narrow stile deadlatch lock is designed for aluminum storefront doors and narrow frame systems, offering reliable security and smooth operation for commercial applications.":
    "Esta cerradura de picaporte con bloqueo para perfil estrecho está pensada para puertas de escaparate de aluminio y sistemas de perfil estrecho, y ofrece seguridad fiable y un accionamiento suave en aplicaciones comerciales.",
  "Built with a durable iron body, zinc alloy + ABS latch, and auxiliary deadlatch structure, it provides strong anti-pry performance and long service life.":
    "Construida con cuerpo de hierro duradero, picaporte de aleación de zinc y ABS y estructura auxiliar de bloqueo, ofrece un buen comportamiento antipalanca y una larga vida útil.",
  "Widely used in storefront doors, glass doors, and commercial entry systems.":
    "Muy utilizada en puertas de escaparate, puertas de vidrio y accesos comerciales.",
  "This commercial aluminum storefront door push-pull paddle lock set is designed for aluminum glass doors, shop doors, office doors, and commercial entrances.":
    "Este juego de cerradura de manetas de empujar y tirar para puerta de escaparate de aluminio está pensado para puertas de vidrio con perfil de aluminio, puertas de tienda, puertas de oficina y accesos comerciales.",
  "Left-hand and right-hand options are available. The hold-back function keeps the latch retracted when needed, allowing convenient access during business hours and high-traffic periods.":
    "Hay versión de mano izquierda y de mano derecha. La función de retención mantiene el picaporte recogido cuando hace falta, lo que facilita el paso en horario comercial y en momentos de mucho tránsito.",
  "With complete accessories and easy installation, this lock set is ideal for storefront door replacement, project installation, commercial door hardware, and aluminum glass door applications.":
    "Con accesorios completos e instalación sencilla, este juego es ideal para sustituir cerraduras de puerta de escaparate, para montaje en obra, como herraje de puerta comercial y en puertas de vidrio con perfil de aluminio.",
  "American-style storefront door lock body with durable iron construction for reliable and stable commercial security performance.":
    "Cuerpo de cerradura de tipo americano para puerta de escaparate, de construcción en hierro duradera, con un comportamiento de seguridad comercial fiable y estable.",
  "Equipped with an American-style brass mortise cylinder for smooth key operation and dependable locking performance.":
    "Equipada con cilindro de embutir de latón de tipo americano, de giro de llave suave y cierre fiable.",
  "Available with Flat Swing Bolt, Hook Bolt, and Spring Loaded Deadlatch options for different aluminum door applications.":
    "Disponible con pestillo basculante plano, pestillo de gancho y picaporte con bloqueo por muelle, para distintas aplicaciones de puerta de aluminio.",
  "Suitable for storefront doors, narrow stile aluminum doors, sliding doors, fast-food restaurant door systems such as KFC doors, and commercial glass door systems.":
    "Apta para puertas de escaparate, puertas de aluminio de perfil estrecho, puertas correderas, sistemas de puerta de restaurantes de comida rápida como los de KFC y sistemas de puerta de vidrio comercial.",
  "Anti-pry lock body design enhances security for shops, offices, commercial buildings, and storefront entrances.":
    "El diseño antipalanca del cuerpo de cerradura mejora la seguridad de tiendas, oficinas, edificios comerciales y accesos de escaparate.",
  "Available in Single Cylinder and Double Cylinder configurations to meet different security requirements.":
    "Disponible en configuración de cilindro simple y de doble cilindro, para distintas exigencias de seguridad.",
  "Concealed lock body structure provides a clean appearance, secure installation, and professional commercial applications.":
    "La estructura de cuerpo de cerradura oculto da un aspecto limpio, una instalación segura y un acabado profesional en aplicaciones comerciales.",
  "Multiple finishes available including SSS, PSS, AB, AC, and customized surface treatments.":
    "Varios acabados disponibles: SSS, PSS, AB, AC y tratamientos superficiales a medida.",
  "Compatible with narrow stile aluminum door frames and commercial storefront door systems.":
    "Compatible con marcos de puerta de aluminio de perfil estrecho y con sistemas de puerta de escaparate comercial.",
  "OEM & ODM customization supported for lock body size, bolt structure, finish, and packaging.":
    "Se admite personalización OEM y ODM del tamaño del cuerpo de cerradura, la estructura del pestillo, el acabado y el embalaje.",
  "Suitable for wooden doors, metal doors, fire doors, windows, and cabinet doors, this hinge is widely used in residential, commercial, hotel, office, warehouse, and industrial applications.":
    "Apta para puertas de madera, puertas metálicas, puertas cortafuego, ventanas y puertas de mueble, esta bisagra se utiliza ampliamente en aplicaciones residenciales, comerciales, hoteleras, de oficina, de almacén e industriales.",
  "Multiple sizes and customization options are available for OEM and ODM projects.":
    "Hay varias medidas y opciones de personalización disponibles para proyectos OEM y ODM.",
  "Structure: Beveled latch design with 13mm latch throw and 25mm full-throw deadbolt":
    "Estructura: picaporte biselado con 13 mm de salida y pestillo de 25 mm de salida completa",
  "Function: Inside deadlocking button prevents external key operation and latch picking":
    "Funcionamiento: el botón de bloqueo interior impide el accionamiento con llave desde fuera y la manipulación del picaporte",
  "Finish: Painted":
    "Acabado: pintado",
  "Application: Economical and secure solution for exterior wooden doors":
    "Aplicación: solución económica y segura para puertas exteriores de madera",
  "• Cylinder extensions available in various sizes for thicker doors":
    "• Hay prolongadores de cilindro en varias medidas para puertas más gruesas",
  "• Variable height escutcheons available":
    "• Bocallaves de distintas alturas disponibles",
  "Stainless Steel Spring Hinge – Automatic Self-Closing (Adjustable Tension)":
    "Bisagra de muelle de acero inoxidable – cierre automático (tensión regulable)",
  "Stainless Steel Construction":
    "Construcción en acero inoxidable",
  "Constructed from high-quality stainless steel with a brushed finish for durability and corrosion resistance.":
    "Fabricada en acero inoxidable de alta calidad con acabado cepillado, duradero y resistente a la corrosión.",
  "Double Action Operation":
    "Funcionamiento de doble acción",
  "Enables smooth and stable movement in both directions.":
    "Permite un movimiento suave y estable en ambos sentidos.",
  "Self-Closing Function":
    "Función de cierre automático",
  "Built-in spring mechanism automatically returns the door to the center position.":
    "El mecanismo de muelle integrado devuelve la puerta automáticamente a la posición central.",
  "Adjustable Spring Tension":
    "Tensión del muelle regulable",
  "Allows precise control of closing speed for different door weights and applications.":
    "Permite controlar con precisión la velocidad de cierre para distintos pesos de puerta y aplicaciones.",
  "Includes all necessary accessories for quick and straightforward installation.":
    "Incluye todos los accesorios necesarios para una instalación rápida y sencilla.",
  "Wide Application":
    "Aplicación amplia",
  "Suitable for cafe doors, kitchen doors, saloon doors, and commercial swing doors.":
    "Apta para puertas de cafetería, puertas de cocina, puertas batientes de vaivén y puertas comerciales de vaivén.",
};

