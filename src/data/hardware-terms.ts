/**
 * The words on our own specification tables, defined.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS NOT A GENERAL GLOSSARY
 *
 * There are hundreds of door-hardware glossaries on the web and they are all the same
 * list copied from each other. This one is derived from a survey of every published
 * specification row in our catalogue on 2026-09-14 — `Backset` appears on 145 records,
 * `Handing` on 134, `Chassis` on 135, `Centre distance` on 31 — so every term below is
 * one a buyer will actually meet on one of our pages, and the count beside it is real.
 *
 * `specLabels` is what ties an entry to the catalogue. The count is computed at build
 * time from it, which means the glossary cannot drift: add a product and the numbers
 * move; rename a spec label and the count drops to zero, which is visible.
 *
 * ---------------------------------------------------------------------------
 * EVERY ENTRY SAYS WHAT GETTING IT WRONG COSTS
 *
 * A definition alone is a dictionary. What a buyer needs is the consequence, because
 * that is the part that tells them whether this is the field they are about to get wrong.
 * "Backset is the distance from the door edge to the spindle centre" is true and inert.
 * "Order the wrong backset and the lock does not fit a door that is already prepared"
 * is the same fact doing work.
 *
 * This is the client's principal's brief applied to a word list: 让别人看起来专业。
 * A supplier who can say precisely what goes wrong is a supplier who has seen it go
 * wrong and fixed it.
 *
 * ---------------------------------------------------------------------------
 * WHERE OUR CATALOGUE USES A WORD TWO WAYS, THE ENTRY SAYS SO
 *
 * `Centre distance` is the clearest case: on a mortise lock case it is cylinder centre to
 * spindle centre (72mm, 85mm, 92mm), and on a pull handle it is the distance between the
 * two fixings (125mm to 149mm). Those are different measurements sharing a label. A
 * glossary that picked one and printed it would mislead on half the catalogue.
 */

export interface HardwareTerm {
  /** URL fragment. Stable — these get linked to directly. */
  id: string;
  term: string;
  termEs: string;
  /** Section the term belongs to. */
  group: "dimensions" | "mechanism" | "ordering";
  /**
   * Specification labels in `content/products` that carry this value.
   *
   * Empty is allowed, and is the right answer for a term that names a thing rather than a
   * field — "narrow stile" describes a door. Those print no count, which is better than
   * borrowing a generic label and printing a number that means something else.
   */
  specLabels: string[];
  /** Counts the product-level `certifications` array instead of a spec row. */
  countCertifications?: boolean;
  definition: string;
  definitionEs: string;
  /** What ordering it wrong costs. */
  consequence: string;
  consequenceEs: string;
  /** Slug of the article that goes deeper, if one exists. */
  article?: string;
}

export const HARDWARE_TERMS: readonly HardwareTerm[] = [
  /* ---------------------------------------------------------------- dimensions */
  {
    id: "backset",
    term: "Backset",
    termEs: "Distancia al eje (backset)",
    group: "dimensions",
    specLabels: ["Backset"],
    definition:
      "The distance from the edge of the door to the centre of the spindle — the hole the handle turns in. 60mm is much the commonest figure in our range and a great many models are field-adjustable between 60 and 70mm; the full published span runs from 16 to 90mm. North America writes the same two figures as 2-3/8″ and 2-3/4″.",
    definitionEs:
      "La distancia desde el canto de la puerta hasta el centro del eje, el agujero donde gira la manilla. 60 mm es con diferencia la cifra más frecuente en nuestra gama y muchos modelos son regulables en obra entre 60 y 70 mm; el rango publicado completo va de 16 a 90 mm. Norteamérica escribe esas dos mismas cifras como 2-3/8″ y 2-3/4″.",
    consequence:
      "It is the single most common wrong number on a door-hardware order. A door already bored for 60mm will not take a 70mm lock: the handle lands in the wrong place and the latch does not reach the strike. Metal cannot be adjusted on site, so a wrong backset is a container that gets stored rather than fitted.",
    consequenceEs:
      "Es el número equivocado más habitual en un pedido de herrajes. Una puerta ya taladrada a 60 mm no admite una cerradura de 70: la manilla queda fuera de sitio y el picaporte no llega al cerradero. El metal no se ajusta en obra, así que un backset equivocado es un contenedor que se almacena en vez de instalarse.",
    article: "mortise-lock-backset-and-centre-distance-guide",
  },
  {
    id: "centre-distance",
    term: "Centre distance",
    termEs: "Distancia entre ejes",
    group: "dimensions",
    specLabels: ["Centre distance", "Grip centre distance"],
    definition:
      "Our catalogue uses this label for two different measurements, and it is worth knowing which one you are reading. On a mortise lock case it is the distance from the cylinder centre to the spindle centre — we publish 45, 65, 68, 72, 85 and 92mm, of which 72 and 85 are the common European figures. On a pull handle or a glass-door fitting it is the distance between the two fixing points, and our range runs from 125 to 179mm.",
    definitionEs:
      "Nuestro catálogo usa esta etiqueta para dos medidas distintas, y conviene saber cuál está leyendo. En una caja de cerradura es la distancia del centro del cilindro al centro del eje — publicamos 45, 65, 68, 72, 85 y 92 mm, de las cuales 72 y 85 son las cifras europeas habituales. En un tirador o un herraje para puerta de vidrio es la distancia entre los dos puntos de fijación, de 125 a 179 mm en nuestra gama.",
    consequence:
      "On a lock case, the centres decide where the two holes go in the door face. Get them wrong and the cylinder hole and the handle hole do not line up with the lock — the door is scrap, not the lock.",
    consequenceEs:
      "En una caja de cerradura, la distancia entre ejes decide dónde van los dos taladros en la hoja. Si se equivoca, el agujero del cilindro y el de la manilla no coinciden con la cerradura: lo que se pierde es la puerta, no la cerradura.",
    article: "mortise-lock-backset-and-centre-distance-guide",
  },
  {
    id: "door-thickness",
    term: "Door thickness",
    termEs: "Espesor de puerta",
    group: "dimensions",
    specLabels: ["Door thickness"],
    definition:
      "The range of leaf thickness a product is built to fit. It is a range rather than a figure because the spindle and the fixing screws have travel in them.",
    definitionEs:
      "El rango de espesor de hoja para el que está construido un producto. Es un rango y no una cifra porque el eje y los tornillos tienen recorrido.",
    consequence:
      "Below the range the screws bottom out and the roses stand proud; above it the spindle does not reach through, and no amount of force will make it. This is the figure to check first on a glass or aluminium door, where leaves are thinner than the joinery a lock was designed around.",
    consequenceEs:
      "Por debajo del rango los tornillos topan y los embellecedores quedan salidos; por encima, el eje no llega a atravesar. Es la cifra que hay que comprobar primero en puertas de vidrio o aluminio, cuyas hojas son más finas que la carpintería para la que se diseñó la cerradura.",
  },
  {
    id: "deadbolt-throw",
    term: "Deadbolt throw",
    termEs: "Recorrido del pestillo",
    group: "dimensions",
    specLabels: ["Deadbolt throw"],
    definition:
      "How far the deadbolt projects from the lock face when fully thrown. Our published figure is 25mm.",
    definitionEs:
      "Cuánto sobresale el pestillo desde el frente de la cerradura cuando está completamente echado. Nuestra cifra publicada es 25 mm.",
    consequence:
      "The throw sets the depth of the pocket that has to be cut in the frame, and several markets write a minimum throw into the building code for entrance doors. A short throw in a deep-rebated frame leaves a bolt that can be levered.",
    consequenceEs:
      "El recorrido determina la profundidad de la caja que hay que abrir en el marco, y varios mercados fijan un recorrido mínimo por normativa en puertas de entrada. Un recorrido corto en un marco muy rebajado deja un pestillo que se puede palanquear.",
  },
  {
    id: "projection",
    term: "Projection",
    termEs: "Vuelo",
    group: "dimensions",
    specLabels: ["Projection"],
    definition:
      "How far the handle, bar or fitting stands out from the face of the door.",
    definitionEs:
      "Cuánto sobresale la manilla, la barra o el herraje respecto a la cara de la puerta.",
    consequence:
      "It comes off the clear width of a corridor, and on an escape route that width is regulated. A panic bar projecting 70mm into a 900mm corridor is a specification problem, not a preference.",
    consequenceEs:
      "Se descuenta de la anchura libre de un pasillo, y en una vía de evacuación esa anchura está regulada. Una barra antipánico con 70 mm de vuelo en un pasillo de 900 mm es un problema de especificación, no de gusto.",
  },
  {
    id: "standoff",
    term: "Standoff",
    termEs: "Separación del tirador",
    group: "dimensions",
    specLabels: ["Standoff"],
    definition:
      "The gap between a pull handle's bar and the door face — the space your fingers go into. Ours are published at 18.5 and 26mm.",
    definitionEs:
      "La separación entre la barra del tirador y la cara de la puerta: el hueco por donde entran los dedos. Los nuestros se publican en 18,5 y 26 mm.",
    consequence:
      "Too small and a gloved hand cannot use it, which matters on a cold-store or a workshop entrance. Accessibility guidance in several markets sets a minimum.",
    consequenceEs:
      "Si es demasiado pequeña, una mano con guante no puede usarlo — lo que importa en una cámara frigorífica o en la entrada de un taller. Varias normativas de accesibilidad fijan un mínimo.",
  },
  {
    id: "cross-bore",
    term: "Cross bore",
    termEs: "Taladro pasante",
    group: "dimensions",
    specLabels: ["Cross bore"],
    definition:
      "The large hole drilled through the face of the door that a cylindrical lock chassis sits in. Ours is published at 51mm.",
    definitionEs:
      "El taladro grande que atraviesa la cara de la puerta y en el que se aloja el chasis de una cerradura cilíndrica. El nuestro se publica a 51 mm.",
    consequence:
      "A bore is a hole that already exists. A chassis larger than the bore means re-boring a hung door; a chassis much smaller leaves the rose covering nothing.",
    consequenceEs:
      "Un taladro es un agujero que ya existe. Un chasis más grande obliga a re-taladrar una puerta ya colgada; uno mucho más pequeño deja el embellecedor tapando aire.",
  },
  {
    id: "fixing-centre",
    term: "Fixing centre",
    termEs: "Entre-ejes de fijación",
    group: "dimensions",
    specLabels: ["Fixing centre", "Fixing hole"],
    definition:
      "The distance between the centres of the screw holes that hold a fitting to the door.",
    definitionEs:
      "La distancia entre los centros de los agujeros de tornillo que sujetan un herraje a la puerta.",
    consequence:
      "It is the figure that decides whether a replacement fitting lands on the holes already in the door. It is also the figure our catalogue is thinnest on, and we would rather say that than print an approximate one — ask, and we will measure the part.",
    consequenceEs:
      "Es la cifra que decide si un herraje de recambio cae sobre los agujeros que ya tiene la puerta. Es también la cifra con menos cobertura en nuestro catálogo, y preferimos decirlo antes que publicar una aproximada: pregúntenos y medimos la pieza.",
  },
  {
    id: "glass-gap",
    term: "Glass gap",
    termEs: "Espesor de vidrio admitido",
    group: "dimensions",
    specLabels: ["Glass gap", "Glass thickness"],
    definition:
      "The thickness of glass a patch fitting or glass-door lock is machined to clamp. Ours are published at 7, 7.5 and 8mm.",
    definitionEs:
      "El espesor de vidrio que un herraje de sujeción o una cerradura para puerta de vidrio está mecanizado para sujetar. Los nuestros se publican en 7, 7,5 y 8 mm.",
    consequence:
      "Toughened glass cannot be cut or drilled after tempering. A fitting that does not match the glass is a fitting that waits for a new glass panel, which is the longest lead time on the whole opening.",
    consequenceEs:
      "El vidrio templado no se puede cortar ni taladrar después del temple. Un herraje que no encaja con el vidrio es un herraje que espera a un panel nuevo, el plazo más largo de todo el hueco.",
    article: "what-a-frameless-glass-door-needs",
  },

  /* ---------------------------------------------------------------- mechanism */
  {
    id: "handing",
    term: "Handing",
    termEs: "Mano",
    group: "mechanism",
    specLabels: ["Handing"],
    definition:
      "Which edge the door is hinged on and which way it swings, described from a fixed point of view so that two people can agree about it. Many of our models are reversible, which means the handing is set during installation rather than at the order.",
    definitionEs:
      "En qué canto está colgada la puerta y hacia dónde abre, descrito desde un punto de vista fijo para que dos personas puedan ponerse de acuerdo. Muchos de nuestros modelos son reversibles: la mano se define en la instalación y no en el pedido.",
    consequence:
      "Handing is the field most often filled in from memory, and the two conventions in common use disagree with each other. Where a model is reversible the question disappears, which is why it is worth checking before deciding rather than after.",
    consequenceEs:
      "La mano es el campo que más se rellena de memoria, y las dos convenciones de uso común no coinciden entre sí. Cuando un modelo es reversible la pregunta desaparece, por eso conviene comprobarlo antes de decidir y no después.",
    article: "handing-left-right-and-universal",
  },
  {
    id: "chassis",
    term: "Chassis",
    termEs: "Chasis",
    group: "mechanism",
    specLabels: ["Chassis"],
    definition:
      "The working body of a cylindrical lock — the part that sits inside the cross bore and turns handle movement into latch movement. The trim bolts onto it from both faces.",
    definitionEs:
      "El cuerpo mecánico de una cerradura cilíndrica: la parte que va dentro del taladro pasante y convierte el giro de la manilla en movimiento del picaporte. La guarnición se atornilla a él por ambas caras.",
    consequence:
      "Grade is a property of the chassis, not of the lever you can see. Two locks with identical handles and different chassis are different products, and it is the chassis that the cycle-life number belongs to.",
    consequenceEs:
      "El grado es una propiedad del chasis, no de la manilla que se ve. Dos cerraduras con manillas idénticas y chasis distintos son productos distintos, y el número de ciclos pertenece al chasis.",
  },
  {
    id: "latch",
    term: "Latch",
    termEs: "Picaporte",
    group: "mechanism",
    specLabels: ["Latch", "Latch extension"],
    definition:
      "The sprung bolt with one angled face that holds a closed door shut and pulls back when the handle turns. It is not a deadbolt: a latch can be pushed back, a deadbolt cannot.",
    definitionEs:
      "El resbalón con una cara inclinada que mantiene cerrada la puerta y se recoge al girar la manilla. No es un pestillo: un resbalón se puede empujar hacia dentro, un pestillo no.",
    consequence:
      "A fire door has to latch, not merely close. If the latch does not engage the strike the leaf is held by nothing, and a door held by nothing is not a fire door however it is rated.",
    consequenceEs:
      "Una puerta cortafuegos tiene que enclavar, no sólo cerrar. Si el resbalón no entra en el cerradero la hoja no está sujeta por nada, y una hoja sujeta por nada no es una puerta cortafuegos por mucha clasificación que tenga.",
    article: "door-coordinator-double-fire-door",
  },
  {
    id: "strike",
    term: "Strike",
    termEs: "Cerradero",
    group: "mechanism",
    specLabels: ["Strike", "Strike Plate Material"],
    definition:
      "The plate let into the frame that the latch or bolt enters. Its lip guides the latch in as the door closes.",
    definitionEs:
      "La placa embutida en el marco en la que entra el resbalón o el pestillo. Su labio guía al resbalón mientras la puerta se cierra.",
    consequence:
      "A strike fitted a few millimetres out is the usual reason a new door does not latch, and it is the cheapest thing on the opening to correct. The material matters on an entrance: a thin strike is what gives way first under force, not the lock.",
    consequenceEs:
      "Un cerradero desplazado unos milímetros es la causa habitual de que una puerta nueva no enclave, y es lo más barato de corregir del hueco. En una entrada el material importa: bajo fuerza cede antes un cerradero fino que la cerradura.",
  },
  {
    id: "spindle",
    term: "Spindle",
    termEs: "Eje cuadradillo",
    group: "mechanism",
    specLabels: ["Spindle", "Spindle Hole"],
    definition:
      "The square steel bar that passes through the lock and carries the turn of the handle from one side of the door to the other. Ours are 8mm and 9mm square.",
    definitionEs:
      "La barra cuadrada de acero que atraviesa la cerradura y transmite el giro de la manilla de un lado al otro de la puerta. Los nuestros son de 8 y 9 mm.",
    consequence:
      "8mm and 9mm look alike in a photograph and are not interchangeable — a 8mm spindle in a 9mm follower has play in it, and play becomes a handle that droops and then a mechanism that wears. Check the square before mixing a handle from one supplier with a lock from another.",
    consequenceEs:
      "8 y 9 mm se parecen en una fotografía y no son intercambiables: un eje de 8 en un cuadradillo de 9 tiene holgura, y la holgura acaba en una manilla caída y en un mecanismo desgastado. Compruebe el cuadradillo antes de mezclar manilla de un proveedor con cerradura de otro.",
  },
  {
    id: "cylinder",
    term: "Cylinder",
    termEs: "Cilindro",
    group: "mechanism",
    specLabels: ["Cylinder", "Cylinder cutout"],
    definition:
      "The removable key-operated core. The cylinder decides the key; the lock case decides the function. Because it comes out without disturbing the lock, it is the part a master-key plan is written around.",
    definitionEs:
      "El núcleo extraíble accionado por llave. El cilindro decide la llave; la caja de cerradura decide la función. Como sale sin tocar la cerradura, es la pieza sobre la que se escribe un plan de amaestramiento.",
    consequence:
      "A cylinder sized wrong for the door sticks out and can be gripped and snapped; sized short it does not reach the cam. The length is set by the door, not by the lock.",
    consequenceEs:
      "Un cilindro con la medida equivocada sobresale y se puede agarrar y romper; demasiado corto, no llega a la leva. La longitud la fija la puerta, no la cerradura.",
    article: "euro-cylinder-length-and-split",
  },
  {
    id: "trim",
    term: "Trim",
    termEs: "Guarnición exterior",
    group: "mechanism",
    specLabels: ["Trim", "Trim Material"],
    definition:
      "The furniture on the outside face — lever, knob, pull or plate — supplied separately from the device it operates. On a panic exit device the bar is the inside and the trim is the outside, and they are two order lines.",
    definitionEs:
      "La guarnición de la cara exterior — manilla, pomo, tirador o placa — que se suministra por separado del mecanismo que acciona. En una barra antipánico, la barra es el interior y la guarnición el exterior: son dos líneas de pedido.",
    consequence:
      "This is the most common misreading of our own catalogue, which is why fourteen records were renamed on 2026-09-14: a record called “035 Panic Exit Device” was the outside trim, not the bar. An order for the wrong one arrives as half a door.",
    consequenceEs:
      "Es la confusión más habitual con nuestro propio catálogo, y por eso el 2026-09-14 se renombraron catorce fichas: «035 Panic Exit Device» era la guarnición exterior, no la barra. Pedir la equivocada llega como media puerta.",
    article: "trim-handle-or-panic-bar",
  },
  {
    id: "rose",
    term: "Rose",
    termEs: "Roseta",
    group: "mechanism",
    specLabels: ["Rose diameter", "Rosette Diameter", "Rose thickness", "Rose depth"],
    definition:
      "The round plate behind a lever or knob that covers the fixings and the bore. Ours run 36 to 75mm in diameter, depending on the range — the catalogue calls it a rose on the handle ranges and a rosette on the knob and bathroom ranges, and they are the same part.",
    definitionEs:
      "La placa redonda tras la manilla o el pomo que tapa las fijaciones y el taladro. Las nuestras van de 36 a 75 mm de diámetro según la gama — el catálogo la llama roseta en unas gamas y embellecedor en otras, y son la misma pieza.",
    consequence:
      "When a lock is replaced, the new rose has to cover the marks the old one left. A smaller rose on a refurbishment means filling and repainting every leaf.",
    consequenceEs:
      "Al sustituir una cerradura, la roseta nueva tiene que tapar la marca de la anterior. Una roseta más pequeña en una reforma significa masillar y repintar todas las hojas.",
  },

  /* ---------------------------------------------------------------- ordering */
  {
    id: "cycle-life",
    term: "Cycle life",
    termEs: "Ciclos de vida",
    group: "ordering",
    specLabels: ["Cycle life"],
    definition:
      "The number of open-and-close cycles the product completed in a laboratory test without failing. Our published figure is 200,000 cycles.",
    definitionEs:
      "El número de ciclos de apertura y cierre que el producto completó en ensayo de laboratorio sin fallar. Nuestra cifra publicada es de 200.000 ciclos.",
    consequence:
      "It is a test result, not a warranty and not a service life. It is comparable between products tested to the same standard and meaningless between products tested to different ones — which is the first question to ask when two suppliers quote the same number.",
    consequenceEs:
      "Es un resultado de ensayo, no una garantía ni una vida útil. Es comparable entre productos ensayados con la misma norma y no significa nada entre productos ensayados con normas distintas — que es la primera pregunta cuando dos proveedores citan la misma cifra.",
    article: "what-a-test-report-actually-covers",
  },
  {
    id: "keying",
    term: "Keying",
    termEs: "Amaestramiento",
    group: "ordering",
    specLabels: ["Keying", "Key options", "Key Types"],
    definition:
      "How a set of locks relates to a set of keys. Keyed different: every lock its own key. Keyed alike: one key opens a group. Master keyed: each lock has its own key and one key above opens them all.",
    definitionEs:
      "Cómo se relaciona un conjunto de cerraduras con un conjunto de llaves. Llaves distintas: cada cerradura la suya. Llaves iguales: una llave abre un grupo. Amaestrado: cada cerradura tiene su llave y una llave superior las abre todas.",
    consequence:
      "A master-key plan has to be decided before the cylinders are cut, not after they arrive. Changing the hierarchy later means new cylinders for every door in the group — which is why the plan sheet exists.",
    consequenceEs:
      "Un plan de amaestramiento se decide antes de cortar los cilindros, no cuando llegan. Cambiar la jerarquía después significa cilindros nuevos para todas las puertas del grupo — por eso existe la hoja de plan.",
    article: "master-key-systems-how-many-levels-you-need",
  },
  {
    id: "function",
    term: "Function",
    termEs: "Función",
    group: "ordering",
    specLabels: ["Function"],
    definition:
      "What the lock does rather than what it looks like: entrance (keyed outside), privacy (turn button inside, emergency release outside), passage (latch only, no locking), classroom, communication. The function is the last two letters of our order code.",
    definitionEs:
      "Lo que hace la cerradura, no su aspecto: entrada (con llave por fuera), privacidad (botón interior y desbloqueo de emergencia exterior), paso (sólo picaporte, sin bloqueo), aula, comunicación. La función son las dos últimas letras de nuestro código de pedido.",
    consequence:
      "Two locks that are visually identical can be a bathroom lock and an entrance lock. Specify a privacy set on a store room and it cannot be keyed; specify an entrance set on a bathroom and there is no way in when someone faints behind the door.",
    consequenceEs:
      "Dos cerraduras visualmente idénticas pueden ser una de baño y una de entrada. Si especifica un juego de privacidad en un almacén, no se podrá poner llave; si especifica uno de entrada en un baño, no hay forma de entrar si alguien se desmaya detrás.",
  },
  {
    id: "grade",
    term: "Grade",
    termEs: "Grado",
    group: "ordering",
    specLabels: [],
    countCertifications: true,
    definition:
      "A performance class awarded by a test standard — ANSI/BHMA Grade 1, 2 and 3 in North America, EN 1125 and EN 179 for escape hardware in Europe. A grade always belongs to a named model tested as a whole assembly.",
    definitionEs:
      "Una clase de prestaciones otorgada por una norma de ensayo: ANSI/BHMA grados 1, 2 y 3 en Norteamérica; EN 1125 y EN 179 para herrajes de evacuación en Europa. Un grado pertenece siempre a un modelo concreto ensayado como conjunto.",
    consequence:
      "A grade is not a property of a factory or of a catalogue. If a supplier says the range is Grade 2, ask which model number the report names — that is the only form of the claim that survives a submittal.",
    consequenceEs:
      "Un grado no es una propiedad de una fábrica ni de un catálogo. Si un proveedor dice que la gama es grado 2, pregunte qué número de modelo nombra el informe: es la única forma de la afirmación que sobrevive a una aprobación en obra.",
    article: "ansi-grade-1-vs-en-1125-exit-devices",
  },
  {
    id: "finish",
    term: "Finish",
    termEs: "Acabado",
    group: "ordering",
    specLabels: ["Finish", "Color"],
    definition:
      "The surface treatment, written as a two- or three-letter code in the middle of our model number — SSS, PB, SN, GM. It is the first half of the letters after the number; the second half is the function.",
    definitionEs:
      "El tratamiento superficial, escrito como un código de dos o tres letras dentro del número de modelo — SSS, PB, SN, GM. Es la primera mitad de las letras que siguen al número; la segunda es la función.",
    consequence:
      "A finish code is not an ANSI/BHMA number, because a BHMA number also encodes the base metal: the same satin chrome is 626 on brass and 652 on steel, and supplying one against a specification for the other is a rejected submittal.",
    consequenceEs:
      "Un código de acabado no es un número ANSI/BHMA, porque el número BHMA codifica también el metal base: el mismo cromo satinado es 626 sobre latón y 652 sobre acero, y suministrar uno contra una especificación del otro es un rechazo en obra.",
    article: "reading-door-hardware-model-numbers",
  },
  {
    id: "narrow-stile",
    term: "Narrow stile",
    termEs: "Perfil estrecho",
    group: "ordering",
    /*
      Deliberately no labels. The first draft pointed this at `Application`, which is a
      generic row on 198 records, and the page printed "198 models state it" beside a term
      that describes a door rather than a product field. A wrong count is worse than none
      on a page whose whole argument is that the numbers are real.
    */
    specLabels: [],
    definition:
      "An aluminium door whose vertical frame member is too slim to take an ordinary mortise lock — commonly around 30 to 50mm of usable depth. It needs a lock case built for that depth rather than a standard one cut down.",
    definitionEs:
      "Una puerta de aluminio cuyo montante vertical es demasiado estrecho para una cerradura de embutir corriente — habitualmente de unos 30 a 50 mm de fondo útil. Necesita una caja fabricada para ese fondo, no una estándar recortada.",
    consequence:
      "Fitting a standard case into a narrow stile removes material the door was relying on, and the leaf sags within a season. The sag is blamed on the hinges and caused by the lock pocket.",
    consequenceEs:
      "Meter una caja estándar en un perfil estrecho quita material del que dependía la puerta, y la hoja se descuelga en una temporada. El descuelgue se achaca a las bisagras y lo provocó la caja de la cerradura.",
    article: "narrow-stile-aluminium-door-lock-sag",
  },
];
