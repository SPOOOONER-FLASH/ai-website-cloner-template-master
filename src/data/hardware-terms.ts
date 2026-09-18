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
  termPt: string;
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
  definitionPt: string;
  /** What ordering it wrong costs. */
  consequence: string;
  consequenceEs: string;
  consequencePt: string;
  /** Slug of the article that goes deeper, if one exists. */
  article?: string;
}

export const HARDWARE_TERMS: readonly HardwareTerm[] = [
  /* ---------------------------------------------------------------- dimensions */
  {
    id: "backset",
    term: "Backset",
    termEs: "Distancia al eje (backset)",
    termPt: "Backset",
    group: "dimensions",
    specLabels: ["Backset"],
    definition:
      "The distance from the edge of the door to the centre of the spindle — the hole the handle turns in. 60mm is much the commonest figure in our range and a great many models are field-adjustable between 60 and 70mm; the full published span runs from 16 to 90mm. North America writes the same two figures as 2-3/8″ and 2-3/4″.",
    definitionEs:
      "La distancia desde el canto de la puerta hasta el centro del eje, el agujero donde gira la manilla. 60 mm es con diferencia la cifra más frecuente en nuestra gama y muchos modelos son regulables en obra entre 60 y 70 mm; el rango publicado completo va de 16 a 90 mm. Norteamérica escribe esas dos mismas cifras como 2-3/8″ y 2-3/4″.",
    definitionPt:
      "A distância entre a borda da porta e o centro do eixo — o furo em que a maçaneta gira. 60 mm é de longe a medida mais frequente na nossa linha e muitos modelos são reguláveis em obra entre 60 e 70 mm; a faixa publicada completa vai de 16 a 90 mm. A América do Norte escreve esses mesmos dois números como 2-3/8″ e 2-3/4″.",
    consequence:
      "It is the single most common wrong number on a door-hardware order. A door already bored for 60mm will not take a 70mm lock: the handle lands in the wrong place and the latch does not reach the strike. Metal cannot be adjusted on site, so a wrong backset is a container that gets stored rather than fitted.",
    consequenceEs:
      "Es el número equivocado más habitual en un pedido de herrajes. Una puerta ya taladrada a 60 mm no admite una cerradura de 70: la manilla queda fuera de sitio y el picaporte no llega al cerradero. El metal no se ajusta en obra, así que un backset equivocado es un contenedor que se almacena en vez de instalarse.",
    consequencePt:
      "É o número errado mais comum num pedido de ferragens. Uma porta já furada para 60 mm não aceita uma fechadura de 70: a maçaneta fica fora de lugar e a lingueta não alcança a contratesta. O metal não se ajusta em obra, então um backset errado é um contêiner que acaba estocado em vez de instalado.",
    article: "mortise-lock-backset-and-centre-distance-guide",
  },
  {
    id: "centre-distance",
    term: "Centre distance",
    termEs: "Distancia entre ejes",
    termPt: "Distância entre eixos",
    group: "dimensions",
    specLabels: ["Centre distance", "Grip centre distance"],
    definition:
      "Our catalogue uses this label for two different measurements, and it is worth knowing which one you are reading. On a mortise lock case it is the distance from the cylinder centre to the spindle centre — we publish 45, 65, 68, 72, 85 and 92mm, of which 72 and 85 are the common European figures. On a pull handle or a glass-door fitting it is the distance between the two fixing points, and our range runs from 125 to 179mm.",
    definitionEs:
      "Nuestro catálogo usa esta etiqueta para dos medidas distintas, y conviene saber cuál está leyendo. En una caja de cerradura es la distancia del centro del cilindro al centro del eje — publicamos 45, 65, 68, 72, 85 y 92 mm, de las cuales 72 y 85 son las cifras europeas habituales. En un tirador o un herraje para puerta de vidrio es la distancia entre los dos puntos de fijación, de 125 a 179 mm en nuestra gama.",
    definitionPt:
      "O nosso catálogo usa este rótulo para duas medidas diferentes, e vale saber qual delas você está lendo. Numa caixa de fechadura de embutir é a distância do centro do cilindro ao centro do eixo — publicamos 45, 65, 68, 72, 85 e 92 mm, das quais 72 e 85 são as medidas europeias usuais. Num puxador ou numa ferragem para porta de vidro é a distância entre os dois pontos de fixação, de 125 a 179 mm na nossa linha.",
    consequence:
      "On a lock case, the centres decide where the two holes go in the door face. Get them wrong and the cylinder hole and the handle hole do not line up with the lock — the door is scrap, not the lock.",
    consequenceEs:
      "En una caja de cerradura, la distancia entre ejes decide dónde van los dos taladros en la hoja. Si se equivoca, el agujero del cilindro y el de la manilla no coinciden con la cerradura: lo que se pierde es la puerta, no la cerradura.",
    consequencePt:
      "Numa caixa de fechadura, a distância entre eixos decide onde ficam os dois furos na face da porta. Se ela estiver errada, o furo do cilindro e o da maçaneta não coincidem com a fechadura: o que se perde é a porta, não a fechadura.",
    article: "mortise-lock-backset-and-centre-distance-guide",
  },
  {
    id: "door-thickness",
    term: "Door thickness",
    termEs: "Espesor de puerta",
    termPt: "Espessura da porta",
    group: "dimensions",
    specLabels: ["Door thickness"],
    definition:
      "The range of leaf thickness a product is built to fit. It is a range rather than a figure because the spindle and the fixing screws have travel in them.",
    definitionEs:
      "El rango de espesor de hoja para el que está construido un producto. Es un rango y no una cifra porque el eje y los tornillos tienen recorrido.",
    definitionPt:
      "A faixa de espessura de folha para a qual o produto foi construído. É uma faixa, e não um número, porque o eixo e os parafusos de fixação têm curso.",
    consequence:
      "Below the range the screws bottom out and the roses stand proud; above it the spindle does not reach through, and no amount of force will make it. This is the figure to check first on a glass or aluminium door, where leaves are thinner than the joinery a lock was designed around.",
    consequenceEs:
      "Por debajo del rango los tornillos topan y los embellecedores quedan salidos; por encima, el eje no llega a atravesar. Es la cifra que hay que comprobar primero en puertas de vidrio o aluminio, cuyas hojas son más finas que la carpintería para la que se diseñó la cerradura.",
    consequencePt:
      "Abaixo da faixa os parafusos encostam no fundo e as rosetas ficam salientes; acima dela o eixo não atravessa, e nenhuma força resolve. É a medida a conferir primeiro numa porta de vidro ou de alumínio, cujas folhas são mais finas do que a marcenaria para a qual a fechadura foi desenhada.",
  },
  {
    id: "deadbolt-throw",
    term: "Deadbolt throw",
    termEs: "Recorrido del pestillo",
    termPt: "Curso da trava",
    group: "dimensions",
    specLabels: ["Deadbolt throw"],
    definition:
      "How far the deadbolt projects from the lock face when fully thrown. Our published figure is 25mm.",
    definitionEs:
      "Cuánto sobresale el pestillo desde el frente de la cerradura cuando está completamente echado. Nuestra cifra publicada es 25 mm.",
    definitionPt:
      "Quanto a trava avança para fora da testa da fechadura quando totalmente lançada. A nossa medida publicada é 25 mm.",
    consequence:
      "The throw sets the depth of the pocket that has to be cut in the frame, and several markets write a minimum throw into the building code for entrance doors. A short throw in a deep-rebated frame leaves a bolt that can be levered.",
    consequenceEs:
      "El recorrido determina la profundidad de la caja que hay que abrir en el marco, y varios mercados fijan un recorrido mínimo por normativa en puertas de entrada. Un recorrido corto en un marco muy rebajado deja un pestillo que se puede palanquear.",
    consequencePt:
      "O curso define a profundidade do rebaixo que precisa ser aberto no batente, e vários mercados fixam um curso mínimo em norma para portas de entrada. Um curso curto num batente muito rebaixado deixa uma trava que pode ser alavancada.",
  },
  {
    id: "projection",
    term: "Projection",
    termEs: "Vuelo",
    termPt: "Saliência",
    group: "dimensions",
    specLabels: ["Projection"],
    definition:
      "How far the handle, bar or fitting stands out from the face of the door.",
    definitionEs:
      "Cuánto sobresale la manilla, la barra o el herraje respecto a la cara de la puerta.",
    definitionPt:
      "Quanto a maçaneta, a barra ou a ferragem avança para fora da face da porta.",
    consequence:
      "It comes off the clear width of a corridor, and on an escape route that width is regulated. A panic bar projecting 70mm into a 900mm corridor is a specification problem, not a preference.",
    consequenceEs:
      "Se descuenta de la anchura libre de un pasillo, y en una vía de evacuación esa anchura está regulada. Una barra antipánico con 70 mm de vuelo en un pasillo de 900 mm es un problema de especificación, no de gusto.",
    consequencePt:
      "Ela é descontada da largura livre de um corredor, e numa rota de fuga essa largura é regulamentada. Uma barra antipânico com 70 mm de saliência num corredor de 900 mm é um problema de especificação, não de gosto.",
  },
  {
    id: "standoff",
    term: "Standoff",
    termEs: "Separación del tirador",
    termPt: "Afastamento do puxador",
    group: "dimensions",
    specLabels: ["Standoff"],
    definition:
      "The gap between a pull handle's bar and the door face — the space your fingers go into. Ours are published at 18.5 and 26mm.",
    definitionEs:
      "La separación entre la barra del tirador y la cara de la puerta: el hueco por donde entran los dedos. Los nuestros se publican en 18,5 y 26 mm.",
    definitionPt:
      "O vão entre a barra do puxador e a face da porta — o espaço por onde entram os dedos. Os nossos são publicados em 18,5 e 26 mm.",
    consequence:
      "Too small and a gloved hand cannot use it, which matters on a cold-store or a workshop entrance. Accessibility guidance in several markets sets a minimum.",
    consequenceEs:
      "Si es demasiado pequeña, una mano con guante no puede usarlo — lo que importa en una cámara frigorífica o en la entrada de un taller. Varias normativas de accesibilidad fijan un mínimo.",
    consequencePt:
      "Pequeno demais, uma mão com luva não consegue usá-lo, o que importa numa câmara fria ou na entrada de uma oficina. Normas de acessibilidade de vários mercados fixam um mínimo.",
  },
  {
    id: "cross-bore",
    term: "Cross bore",
    termEs: "Taladro pasante",
    termPt: "Furo passante",
    group: "dimensions",
    specLabels: ["Cross bore"],
    definition:
      "The large hole drilled through the face of the door that a cylindrical lock chassis sits in. Ours is published at 51mm.",
    definitionEs:
      "El taladro grande que atraviesa la cara de la puerta y en el que se aloja el chasis de una cerradura cilíndrica. El nuestro se publica a 51 mm.",
    definitionPt:
      "O furo grande que atravessa a face da porta e onde se aloja o chassi de uma fechadura cilíndrica. O nosso é publicado com 51 mm.",
    consequence:
      "A bore is a hole that already exists. A chassis larger than the bore means re-boring a hung door; a chassis much smaller leaves the rose covering nothing.",
    consequenceEs:
      "Un taladro es un agujero que ya existe. Un chasis más grande obliga a re-taladrar una puerta ya colgada; uno mucho más pequeño deja el embellecedor tapando aire.",
    consequencePt:
      "Um furo é um buraco que já existe. Um chassi maior do que o furo obriga a refurar uma porta já pendurada; um chassi bem menor deixa a roseta cobrindo nada.",
  },
  {
    id: "fixing-centre",
    term: "Fixing centre",
    termEs: "Entre-ejes de fijación",
    termPt: "Entre-eixos de fixação",
    group: "dimensions",
    specLabels: ["Fixing centre", "Fixing hole"],
    definition:
      "The distance between the centres of the screw holes that hold a fitting to the door.",
    definitionEs:
      "La distancia entre los centros de los agujeros de tornillo que sujetan un herraje a la puerta.",
    definitionPt:
      "A distância entre os centros dos furos dos parafusos que prendem uma ferragem à porta.",
    consequence:
      "It is the figure that decides whether a replacement fitting lands on the holes already in the door. It is also the figure our catalogue is thinnest on, and we would rather say that than print an approximate one — ask, and we will measure the part.",
    consequenceEs:
      "Es la cifra que decide si un herraje de recambio cae sobre los agujeros que ya tiene la puerta. Es también la cifra con menos cobertura en nuestro catálogo, y preferimos decirlo antes que publicar una aproximada: pregúntenos y medimos la pieza.",
    consequencePt:
      "É a medida que decide se uma ferragem de reposição cai sobre os furos que a porta já tem. É também a medida com menos cobertura no nosso catálogo, e preferimos dizer isso a publicar uma aproximada — pergunte, e medimos a peça.",
  },
  {
    id: "glass-gap",
    term: "Glass gap",
    termEs: "Espesor de vidrio admitido",
    termPt: "Espessura de vidro aceita",
    group: "dimensions",
    specLabels: ["Glass gap", "Glass thickness"],
    definition:
      "The thickness of glass a patch fitting or glass-door lock is machined to clamp. Ours are published at 7, 7.5 and 8mm.",
    definitionEs:
      "El espesor de vidrio que un herraje de sujeción o una cerradura para puerta de vidrio está mecanizado para sujetar. Los nuestros se publican en 7, 7,5 y 8 mm.",
    definitionPt:
      "A espessura de vidro que uma ferragem de aperto ou uma fechadura para porta de vidro é usinada para prender. As nossas são publicadas em 7, 7,5 e 8 mm.",
    consequence:
      "Toughened glass cannot be cut or drilled after tempering. A fitting that does not match the glass is a fitting that waits for a new glass panel, which is the longest lead time on the whole opening.",
    consequenceEs:
      "El vidrio templado no se puede cortar ni taladrar después del temple. Un herraje que no encaja con el vidrio es un herraje que espera a un panel nuevo, el plazo más largo de todo el hueco.",
    consequencePt:
      "O vidro temperado não pode ser cortado nem furado depois da têmpera. Uma ferragem que não corresponde ao vidro é uma ferragem esperando por uma chapa nova, o prazo mais longo de todo o vão.",
    article: "what-a-frameless-glass-door-needs",
  },

  /* ---------------------------------------------------------------- mechanism */
  {
    id: "handing",
    term: "Handing",
    termEs: "Mano",
    termPt: "Mão da porta",
    group: "mechanism",
    specLabels: ["Handing"],
    definition:
      "Which edge the door is hinged on and which way it swings, described from a fixed point of view so that two people can agree about it. Many of our models are reversible, which means the handing is set during installation rather than at the order.",
    definitionEs:
      "En qué canto está colgada la puerta y hacia dónde abre, descrito desde un punto de vista fijo para que dos personas puedan ponerse de acuerdo. Muchos de nuestros modelos son reversibles: la mano se define en la instalación y no en el pedido.",
    definitionPt:
      "Em que borda a porta está pendurada e para que lado ela abre, descrito a partir de um ponto de vista fixo para que duas pessoas possam concordar sobre isso. Muitos dos nossos modelos são reversíveis, o que quer dizer que a mão é definida na instalação e não no pedido.",
    consequence:
      "Handing is the field most often filled in from memory, and the two conventions in common use disagree with each other. Where a model is reversible the question disappears, which is why it is worth checking before deciding rather than after.",
    consequenceEs:
      "La mano es el campo que más se rellena de memoria, y las dos convenciones de uso común no coinciden entre sí. Cuando un modelo es reversible la pregunta desaparece, por eso conviene comprobarlo antes de decidir y no después.",
    consequencePt:
      "A mão é o campo que mais se preenche de memória, e as duas convenções de uso corrente discordam entre si. Quando um modelo é reversível a pergunta desaparece, e por isso vale conferir antes de decidir, não depois.",
    article: "handing-left-right-and-universal",
  },
  {
    id: "chassis",
    term: "Chassis",
    termEs: "Chasis",
    termPt: "Chassi",
    group: "mechanism",
    specLabels: ["Chassis"],
    definition:
      "The working body of a cylindrical lock — the part that sits inside the cross bore and turns handle movement into latch movement. The trim bolts onto it from both faces.",
    definitionEs:
      "El cuerpo mecánico de una cerradura cilíndrica: la parte que va dentro del taladro pasante y convierte el giro de la manilla en movimiento del picaporte. La guarnición se atornilla a él por ambas caras.",
    definitionPt:
      "O corpo mecânico de uma fechadura cilíndrica — a parte que fica dentro do furo passante e transforma o giro da maçaneta em movimento da lingueta. As guarnições são parafusadas nele pelas duas faces.",
    consequence:
      "Grade is a property of the chassis, not of the lever you can see. Two locks with identical handles and different chassis are different products, and it is the chassis that the cycle-life number belongs to.",
    consequenceEs:
      "El grado es una propiedad del chasis, no de la manilla que se ve. Dos cerraduras con manillas idénticas y chasis distintos son productos distintos, y el número de ciclos pertenece al chasis.",
    consequencePt:
      "O grau é uma propriedade do chassi, não da maçaneta que se vê. Duas fechaduras com maçanetas idênticas e chassis diferentes são produtos diferentes, e o número de ciclos pertence ao chassi.",
  },
  {
    id: "latch",
    term: "Latch",
    termEs: "Picaporte",
    termPt: "Lingueta",
    group: "mechanism",
    specLabels: ["Latch", "Latch extension"],
    definition:
      "The sprung bolt with one angled face that holds a closed door shut and pulls back when the handle turns. It is not a deadbolt: a latch can be pushed back, a deadbolt cannot.",
    definitionEs:
      "El resbalón con una cara inclinada que mantiene cerrada la puerta y se recoge al girar la manilla. No es un pestillo: un resbalón se puede empujar hacia dentro, un pestillo no.",
    definitionPt:
      "A lingueta com mola e uma face chanfrada que mantém fechada uma porta encostada e recolhe quando a maçaneta gira. Não é uma trava: uma lingueta pode ser empurrada para dentro, uma trava não.",
    consequence:
      "A fire door has to latch, not merely close. If the latch does not engage the strike the leaf is held by nothing, and a door held by nothing is not a fire door however it is rated.",
    consequenceEs:
      "Una puerta cortafuegos tiene que enclavar, no sólo cerrar. Si el resbalón no entra en el cerradero la hoja no está sujeta por nada, y una hoja sujeta por nada no es una puerta cortafuegos por mucha clasificación que tenga.",
    consequencePt:
      "Uma porta corta-fogo precisa travar, não apenas encostar. Se a lingueta não entra na contratesta, a folha não está presa por nada, e uma folha presa por nada não é uma porta corta-fogo por mais classificada que seja.",
    article: "door-coordinator-double-fire-door",
  },
  {
    id: "strike",
    term: "Strike",
    termEs: "Cerradero",
    termPt: "Contratesta",
    group: "mechanism",
    specLabels: ["Strike", "Strike Plate Material"],
    definition:
      "The plate let into the frame that the latch or bolt enters. Its lip guides the latch in as the door closes.",
    definitionEs:
      "La placa embutida en el marco en la que entra el resbalón o el pestillo. Su labio guía al resbalón mientras la puerta se cierra.",
    definitionPt:
      "A chapa embutida no batente em que a lingueta ou a trava entra. O lábio dela guia a lingueta enquanto a porta fecha.",
    consequence:
      "A strike fitted a few millimetres out is the usual reason a new door does not latch, and it is the cheapest thing on the opening to correct. The material matters on an entrance: a thin strike is what gives way first under force, not the lock.",
    consequenceEs:
      "Un cerradero desplazado unos milímetros es la causa habitual de que una puerta nueva no enclave, y es lo más barato de corregir del hueco. En una entrada el material importa: bajo fuerza cede antes un cerradero fino que la cerradura.",
    consequencePt:
      "Uma contratesta montada alguns milímetros fora de posição é a razão habitual de uma porta nova não travar, e é a coisa mais barata de corrigir no vão. Numa entrada o material importa: sob força, quem cede primeiro é uma contratesta fina, não a fechadura.",
  },
  {
    id: "spindle",
    term: "Spindle",
    termEs: "Eje cuadradillo",
    termPt: "Eixo quadrado",
    group: "mechanism",
    specLabels: ["Spindle", "Spindle Hole"],
    definition:
      "The square steel bar that passes through the lock and carries the turn of the handle from one side of the door to the other. Ours are 8mm and 9mm square.",
    definitionEs:
      "La barra cuadrada de acero que atraviesa la cerradura y transmite el giro de la manilla de un lado al otro de la puerta. Los nuestros son de 8 y 9 mm.",
    definitionPt:
      "A barra quadrada de aço que atravessa a fechadura e leva o giro da maçaneta de um lado da porta ao outro. Os nossos são de 8 mm e 9 mm.",
    consequence:
      "8mm and 9mm look alike in a photograph and are not interchangeable — a 8mm spindle in a 9mm follower has play in it, and play becomes a handle that droops and then a mechanism that wears. Check the square before mixing a handle from one supplier with a lock from another.",
    consequenceEs:
      "8 y 9 mm se parecen en una fotografía y no son intercambiables: un eje de 8 en un cuadradillo de 9 tiene holgura, y la holgura acaba en una manilla caída y en un mecanismo desgastado. Compruebe el cuadradillo antes de mezclar manilla de un proveedor con cerradura de otro.",
    consequencePt:
      "8 mm e 9 mm se parecem numa fotografia e não são intercambiáveis: um eixo de 8 num seguidor de 9 tem folga, e a folga vira uma maçaneta caída e depois um mecanismo gasto. Confira o quadrado antes de misturar maçaneta de um fornecedor com fechadura de outro.",
  },
  {
    id: "cylinder",
    term: "Cylinder",
    termEs: "Cilindro",
    termPt: "Cilindro",
    group: "mechanism",
    specLabels: ["Cylinder", "Cylinder cutout"],
    definition:
      "The removable key-operated core. The cylinder decides the key; the lock case decides the function. Because it comes out without disturbing the lock, it is the part a master-key plan is written around.",
    definitionEs:
      "El núcleo extraíble accionado por llave. El cilindro decide la llave; la caja de cerradura decide la función. Como sale sin tocar la cerradura, es la pieza sobre la que se escribe un plan de amaestramiento.",
    definitionPt:
      "O núcleo removível acionado por chave. O cilindro decide a chave; a caixa da fechadura decide a função. Como ele sai sem mexer na fechadura, é a peça em torno da qual se escreve um plano de chave-mestra.",
    consequence:
      "A cylinder sized wrong for the door sticks out and can be gripped and snapped; sized short it does not reach the cam. The length is set by the door, not by the lock.",
    consequenceEs:
      "Un cilindro con la medida equivocada sobresale y se puede agarrar y romper; demasiado corto, no llega a la leva. La longitud la fija la puerta, no la cerradura.",
    consequencePt:
      "Um cilindro com a medida errada para a porta fica saliente e pode ser agarrado e quebrado; curto demais, não alcança a came. O comprimento é dado pela porta, não pela fechadura.",
    article: "euro-cylinder-length-and-split",
  },
  {
    id: "trim",
    term: "Trim",
    termEs: "Guarnición exterior",
    termPt: "Guarnição externa",
    group: "mechanism",
    specLabels: ["Trim", "Trim Material"],
    definition:
      "The furniture on the outside face — lever, knob, pull or plate — supplied separately from the device it operates. On a panic exit device the bar is the inside and the trim is the outside, and they are two order lines.",
    definitionEs:
      "La guarnición de la cara exterior — manilla, pomo, tirador o placa — que se suministra por separado del mecanismo que acciona. En una barra antipánico, la barra es el interior y la guarnición el exterior: son dos líneas de pedido.",
    definitionPt:
      "As peças da face externa — maçaneta, bola, puxador ou espelho — fornecidas separadamente do mecanismo que acionam. Numa barra antipânico, a barra é o lado de dentro e a guarnição é o lado de fora, e são duas linhas de pedido.",
    consequence:
      "This is the most common misreading of our own catalogue, which is why fourteen records were renamed on 2026-09-14: a record called “035 Panic Exit Device” was the outside trim, not the bar. An order for the wrong one arrives as half a door.",
    consequenceEs:
      "Es la confusión más habitual con nuestro propio catálogo, y por eso el 2026-09-14 se renombraron catorce fichas: «035 Panic Exit Device» era la guarnición exterior, no la barra. Pedir la equivocada llega como media puerta.",
    consequencePt:
      "É a leitura errada mais comum do nosso próprio catálogo, e por isso catorze fichas foram renomeadas em 2026-09-14: uma ficha chamada “035 Panic Exit Device” era a guarnição externa, e não a barra. Pedir a errada chega como meia porta.",
    article: "trim-handle-or-panic-bar",
  },
  {
    id: "rose",
    term: "Rose",
    termEs: "Roseta",
    termPt: "Roseta",
    group: "mechanism",
    specLabels: [
      "Rose diameter",
      "Rosette Diameter",
      "Rose thickness",
      "Rose depth",
    ],
    definition:
      "The round plate behind a lever or knob that covers the fixings and the bore. Ours run 36 to 75mm in diameter, depending on the range — the catalogue calls it a rose on the handle ranges and a rosette on the knob and bathroom ranges, and they are the same part.",
    definitionEs:
      "La placa redonda tras la manilla o el pomo que tapa las fijaciones y el taladro. Las nuestras van de 36 a 75 mm de diámetro según la gama — el catálogo la llama roseta en unas gamas y embellecedor en otras, y son la misma pieza.",
    definitionPt:
      "A chapa redonda atrás da maçaneta ou da bola que cobre as fixações e o furo. As nossas vão de 36 a 75 mm de diâmetro conforme a linha — o catálogo a chama de roseta nas linhas de maçaneta e de rosette nas linhas de bola e de banheiro, e é a mesma peça.",
    consequence:
      "When a lock is replaced, the new rose has to cover the marks the old one left. A smaller rose on a refurbishment means filling and repainting every leaf.",
    consequenceEs:
      "Al sustituir una cerradura, la roseta nueva tiene que tapar la marca de la anterior. Una roseta más pequeña en una reforma significa masillar y repintar todas las hojas.",
    consequencePt:
      "Quando uma fechadura é substituída, a roseta nova precisa cobrir a marca que a antiga deixou. Uma roseta menor numa reforma significa massa e pintura em todas as folhas.",
  },

  /* ---------------------------------------------------------------- ordering */
  {
    id: "cycle-life",
    term: "Cycle life",
    termEs: "Ciclos de vida",
    termPt: "Vida em ciclos",
    group: "ordering",
    specLabels: ["Cycle life"],
    definition:
      "The number of open-and-close cycles the product completed in a laboratory test without failing. Our published figure is 200,000 cycles.",
    definitionEs:
      "El número de ciclos de apertura y cierre que el producto completó en ensayo de laboratorio sin fallar. Nuestra cifra publicada es de 200.000 ciclos.",
    definitionPt:
      "O número de ciclos de abertura e fechamento que o produto completou em ensaio de laboratório sem falhar. A nossa cifra publicada é de 200.000 ciclos.",
    consequence:
      "It is a test result, not a warranty and not a service life. It is comparable between products tested to the same standard and meaningless between products tested to different ones — which is the first question to ask when two suppliers quote the same number.",
    consequenceEs:
      "Es un resultado de ensayo, no una garantía ni una vida útil. Es comparable entre productos ensayados con la misma norma y no significa nada entre productos ensayados con normas distintas — que es la primera pregunta cuando dos proveedores citan la misma cifra.",
    consequencePt:
      "É um resultado de ensaio, não uma garantia nem uma vida útil. É comparável entre produtos ensaiados pela mesma norma e não significa nada entre produtos ensaiados por normas diferentes — que é a primeira pergunta a fazer quando dois fornecedores citam o mesmo número.",
    article: "what-a-test-report-actually-covers",
  },
  {
    id: "keying",
    term: "Keying",
    termEs: "Amaestramiento",
    termPt: "Sistema de chaves",
    group: "ordering",
    specLabels: ["Keying", "Key options", "Key Types"],
    definition:
      "How a set of locks relates to a set of keys. Keyed different: every lock its own key. Keyed alike: one key opens a group. Master keyed: each lock has its own key and one key above opens them all.",
    definitionEs:
      "Cómo se relaciona un conjunto de cerraduras con un conjunto de llaves. Llaves distintas: cada cerradura la suya. Llaves iguales: una llave abre un grupo. Amaestrado: cada cerradura tiene su llave y una llave superior las abre todas.",
    definitionPt:
      "Como um conjunto de fechaduras se relaciona com um conjunto de chaves. Chaves diferentes: cada fechadura com a sua. Chaves iguais: uma chave abre um grupo. Chave-mestra: cada fechadura tem a sua chave e uma chave acima abre todas.",
    consequence:
      "A master-key plan has to be decided before the cylinders are cut, not after they arrive. Changing the hierarchy later means new cylinders for every door in the group — which is why the plan sheet exists.",
    consequenceEs:
      "Un plan de amaestramiento se decide antes de cortar los cilindros, no cuando llegan. Cambiar la jerarquía después significa cilindros nuevos para todas las puertas del grupo — por eso existe la hoja de plan.",
    consequencePt:
      "Um plano de chave-mestra precisa ser decidido antes de os cilindros serem cifrados, e não depois que eles chegam. Mudar a hierarquia mais tarde significa cilindros novos para todas as portas do grupo — é para isso que existe a planilha do plano.",
    article: "master-key-systems-how-many-levels-you-need",
  },
  {
    id: "function",
    term: "Function",
    termEs: "Función",
    termPt: "Função",
    group: "ordering",
    specLabels: ["Function"],
    definition:
      "What the lock does rather than what it looks like: entrance (keyed outside), privacy (turn button inside, emergency release outside), passage (latch only, no locking), classroom, communication. The function is the last two letters of our order code.",
    definitionEs:
      "Lo que hace la cerradura, no su aspecto: entrada (con llave por fuera), privacidad (botón interior y desbloqueo de emergencia exterior), paso (sólo picaporte, sin bloqueo), aula, comunicación. La función son las dos últimas letras de nuestro código de pedido.",
    definitionPt:
      "O que a fechadura faz, e não com o que ela se parece: entrada (com chave por fora), banheiro (botão de giro por dentro, destrave de emergência por fora), passagem (só lingueta, sem travamento), sala de aula, comunicação. A função são as duas últimas letras do nosso código de pedido.",
    consequence:
      "Two locks that are visually identical can be a bathroom lock and an entrance lock. Specify a privacy set on a store room and it cannot be keyed; specify an entrance set on a bathroom and there is no way in when someone faints behind the door.",
    consequenceEs:
      "Dos cerraduras visualmente idénticas pueden ser una de baño y una de entrada. Si especifica un juego de privacidad en un almacén, no se podrá poner llave; si especifica uno de entrada en un baño, no hay forma de entrar si alguien se desmaya detrás.",
    consequencePt:
      "Duas fechaduras visualmente idênticas podem ser uma de banheiro e uma de entrada. Especifique um conjunto de banheiro num almoxarifado e ele não aceita chave; especifique um de entrada num banheiro e não há como entrar quando alguém desmaia atrás da porta.",
  },
  {
    id: "grade",
    term: "Grade",
    termEs: "Grado",
    termPt: "Grau",
    group: "ordering",
    specLabels: [],
    countCertifications: true,
    definition:
      "A performance class awarded by a test standard — ANSI/BHMA Grade 1, 2 and 3 in North America, EN 1125 and EN 179 for escape hardware in Europe. A grade always belongs to a named model tested as a whole assembly.",
    definitionEs:
      "Una clase de prestaciones otorgada por una norma de ensayo: ANSI/BHMA grados 1, 2 y 3 en Norteamérica; EN 1125 y EN 179 para herrajes de evacuación en Europa. Un grado pertenece siempre a un modelo concreto ensayado como conjunto.",
    definitionPt:
      "Uma classe de desempenho conferida por uma norma de ensaio — ANSI/BHMA Grau 1, 2 e 3 na América do Norte, EN 1125 e EN 179 para ferragens de saída de emergência na Europa. Um grau pertence sempre a um modelo nomeado, ensaiado como conjunto completo.",
    consequence:
      "A grade is not a property of a factory or of a catalogue. If a supplier says the range is Grade 2, ask which model number the report names — that is the only form of the claim that survives a submittal.",
    consequenceEs:
      "Un grado no es una propiedad de una fábrica ni de un catálogo. Si un proveedor dice que la gama es grado 2, pregunte qué número de modelo nombra el informe: es la única forma de la afirmación que sobrevive a una aprobación en obra.",
    consequencePt:
      "Grau não é propriedade de uma fábrica nem de um catálogo. Se um fornecedor diz que a linha é Grau 2, pergunte qual número de modelo o relatório nomeia: essa é a única forma da afirmação que sobrevive a uma aprovação de projeto.",
    article: "ansi-grade-1-vs-en-1125-exit-devices",
  },
  {
    id: "finish",
    term: "Finish",
    termEs: "Acabado",
    termPt: "Acabamento",
    group: "ordering",
    specLabels: ["Finish", "Color"],
    definition:
      "The surface treatment, written as a two- or three-letter code in the middle of our model number — SSS, PB, SN, GM. It is the first half of the letters after the number; the second half is the function.",
    definitionEs:
      "El tratamiento superficial, escrito como un código de dos o tres letras dentro del número de modelo — SSS, PB, SN, GM. Es la primera mitad de las letras que siguen al número; la segunda es la función.",
    definitionPt:
      "O tratamento de superfície, escrito como um código de duas ou três letras no meio do nosso número de modelo — SSS, PB, SN, GM. É a primeira metade das letras que vêm depois do número; a segunda metade é a função.",
    consequence:
      "A finish code is not an ANSI/BHMA number, because a BHMA number also encodes the base metal: the same satin chrome is 626 on brass and 652 on steel, and supplying one against a specification for the other is a rejected submittal.",
    consequenceEs:
      "Un código de acabado no es un número ANSI/BHMA, porque el número BHMA codifica también el metal base: el mismo cromo satinado es 626 sobre latón y 652 sobre acero, y suministrar uno contra una especificación del otro es un rechazo en obra.",
    consequencePt:
      "Um código de acabamento não é um número ANSI/BHMA, porque o número BHMA codifica também o metal base: o mesmo cromo acetinado é 626 sobre latão e 652 sobre aço, e fornecer um contra uma especificação do outro é uma aprovação recusada.",
    article: "reading-door-hardware-model-numbers",
  },
  {
    id: "narrow-stile",
    term: "Narrow stile",
    termEs: "Perfil estrecho",
    termPt: "Perfil estreito",
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
    definitionPt:
      "Uma porta de alumínio cujo montante vertical é estreito demais para uma fechadura de embutir comum — normalmente entre 30 e 50 mm de profundidade útil. Ela precisa de uma caixa de fechadura feita para essa profundidade, e não de uma padrão cortada.",
    consequence:
      "Fitting a standard case into a narrow stile removes material the door was relying on, and the leaf sags within a season. The sag is blamed on the hinges and caused by the lock pocket.",
    consequenceEs:
      "Meter una caja estándar en un perfil estrecho quita material del que dependía la puerta, y la hoja se descuelga en una temporada. El descuelgue se achaca a las bisagras y lo provocó la caja de la cerradura.",
    consequencePt:
      "Encaixar uma caixa padrão num perfil estreito tira material de que a porta dependia, e a folha cai em uma estação. A queda é atribuída às dobradiças e foi causada pelo rebaixo da fechadura.",
    article: "narrow-stile-aluminium-door-lock-sag",
  },
];
