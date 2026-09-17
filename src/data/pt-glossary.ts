/**
 * The Portuguese glossary: what a spec row is called, and what its value says.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS A DICTIONARY AND NOT A TRANSLATION PASS
 *
 * Spanish shipped this way and the reason holds harder for Portuguese: a catalogue row is
 * not prose. "Backset", "Deadbolt throw", "Cross bore" are terms of art with one correct
 * Brazilian equivalent each, and a model that paraphrases them produces a page that reads
 * fluently and specifies nothing. `distância entre eixos` is the phrase a Brazilian
 * locksmith uses; anything else is a synonym the trade does not check against.
 *
 * So: a finite dictionary keyed on the English string, numbers carried through untouched,
 * and anything unmapped left in English and COUNTED (`npm run audit:pt`). An English row
 * on a Portuguese page is visibly unfinished. A plausible Portuguese row that means
 * something slightly different is not, and on a door it costs a container.
 *
 * ---------------------------------------------------------------------------
 * BRAZILIAN, NOT IBERIAN, WHERE THEY DIVERGE
 *
 * The market is Brazil, so where the two Portuguese trades differ the Brazilian word wins:
 * `maçaneta` not `puxador` for a lever, `fechadura` not `fechadura de embutir` as the
 * default noun, `parafuso` not `parafuso de fixação` where the English says "screw".
 * `trinco` is the deadbolt and `picaporte`/`lingueta` the sprung latch — Brazilian usage
 * varies, and `lingueta` is used here because it is the word on ABNT NBR 11742's own
 * vocabulary for the sprung element.
 */

/** Spec row labels. Keyed on the exact English label as it appears in content/products. */
export const SPEC_LABELS_PT: Record<string, string> = {
  /*
    2026-09-17. Every one of these came out of
    `node scripts/translate-products-pt.mjs --all`, which counts the labels the
    glossary could not translate and how many rows carry each. Ordered by row count,
    because a label on 55 rows is 55 English lines on Portuguese pages.
  */
  "Bearings": "Rolamentos",
  "Leaf size": "Medida da asa",
  "Knuckle diameter": "Diâmetro do nó",
  "Maximum load capacity (2 hinges)": "Capacidade máxima de carga (2 dobradiças)",
  "Minimum door thickness": "Espessura mínima da porta",
  "Maximum door width": "Largura máxima da porta",
  "Milling cutter diameter": "Diâmetro da fresa",
  "Routing length": "Comprimento do rasgo",
  "Routing depth": "Profundidade do rasgo",
  "Opening angle": "Ângulo de abertura",
  "Adjustment": "Regulagem",
  "Set configuration": "Configuração do conjunto",
  "Hold-open range": "Faixa de retenção",
  "Closing valve": "Válvula de fechamento",
  "Accessories": "Acessórios",
  "Bolts": "Ferrolhos",
  "Options": "Opções",
  "Style": "Estilo",
  "Grip reach": "Alcance do punho",
  "Wall cutout": "Recorte na parede",
  "Size1": "Medida 1",
  "Size2": "Medida 2",
  "Size3": "Medida 3",
  "Size4": "Medida 4",
  "Size5": "Medida 5",
  "Includes": "Inclui",
  "Use": "Uso",
  "Market": "Mercado",
  "Finishes": "Acabamentos",
  "Durability": "Durabilidade",
  "Design": "Design",
  "Hooks": "Ganchos",
  "Mounting": "Fixação",
  "Sizes": "Medidas",
  "Cut-out": "Recorte",
  "Footprint": "Área de apoio",
  "Height above fixing": "Altura acima da fixação",
  "Specifications": "Especificações",
  "Minimum wall depth": "Profundidade mínima da parede",
  "Door cutout": "Recorte na porta",
  "Follower": "Seguidor",
  "Cylinder apertures": "Aberturas para cilindro",
  "Used with": "Usado com",
  "Screws": "Parafusos",
  "Key": "Chave",
  "Process": "Processo",
  "Plate length": "Comprimento do espelho",
  "Series": "Série",
  "Rosette": "Roseta",
  "Applications": "Aplicações",
  "Drop": "Queda",
  "Stem": "Haste",
  "Cover": "Tampa",
  "Lengths": "Comprimentos",
  "End to fixing": "Da ponta à fixação",
  "Second centre": "Segundo centro",
  "Model": "Modelo",
  "Base width": "Largura da base",
  "Bracket": "Suporte",
  /* packing */
  "Pieces per carton": "Peças por caixa",
  "Carton size": "Dimensões da caixa",
  "Carton volume": "Volume da caixa",
  "Gross weight": "Peso bruto",
  "Net weight": "Peso líquido",
  Packing: "Embalagem",
  "Minimum order": "Pedido mínimo",

  /* the dimensions that decide whether a part fits */
  Backset: "Distância à testa",
  "Door thickness": "Espessura da porta",
  "Door Thickness": "Espessura da porta",
  "Suitable Door Thickness": "Espessura de porta indicada",
  "Door Thickness Range": "Faixa de espessura da porta",
  "Applicable Door Thickness": "Espessura de porta aplicável",
  "Glass door thickness": "Espessura do vidro",
  "Deadbolt throw": "Curso do trinco",
  "Latch throw": "Curso da lingueta",
  "Latch extension": "Saída da lingueta",
  "Bolt projection": "Saída do trinco",
  "Centre distance": "Distância entre eixos",
  "Center Distance": "Distância entre eixos",
  "Centre distances": "Distâncias entre eixos",
  "2. Dual center distances": "2. Distâncias entre eixos duplas",
  "Cross bore": "Furo transversal",
  "Tube diameter": "Diâmetro do tubo",
  "Tube Thickness": "Espessura do tubo",
  "Rose diameter": "Diâmetro da roseta",
  "Rose thickness": "Espessura da roseta",
  "Rose size": "Dimensões da roseta",
  "Rose depth": "Profundidade da roseta",
  "Rosette Size": "Dimensões da roseta",
  "Rosette Diameter": "Diâmetro da roseta",
  "Lever length": "Comprimento da maçaneta",
  "Lever section": "Secção da maçaneta",
  "Lever drop": "Queda da maçaneta",
  "Fixing centre": "Distância entre fixações",
  "Fixing centres": "Distâncias entre fixações",
  "Fixing screws": "Parafusos de fixação",
  "Glass gap": "Folga do vidro",
  "Plate size": "Dimensões da placa",
  "Plate width": "Largura da placa",
  "Plate height": "Altura da placa",
  "Plate thickness": "Espessura da placa",
  "Grip centre distance": "Distância entre eixos do puxador",
  "Grip section": "Secção do puxador",
  "Grip length": "Comprimento do puxador",
  "Slot width": "Largura da ranhura",
  "Cylinder cutout": "Recorte do cilindro",
  "Base diameter": "Diâmetro da base",
  "Body diameter": "Diâmetro do corpo",
  "Stem diameter": "Diâmetro da haste",
  "Diameter size": "Diâmetro",
  "Bar section": "Secção da barra",
  "Bar Length": "Comprimento da barra",
  "Overall length": "Comprimento total",
  "Available lengths": "Comprimentos disponíveis",
  "Available Diameters": "Diâmetros disponíveis",
  "Upper hook": "Gancho superior",
  "Hook arm": "Braço do gancho",
  "Hook bolt": "Trinco de gancho",
  "Case height": "Altura da caixa",
  "Case depth": "Profundidade da caixa",
  "Spindle length": "Comprimento do quadrado",
  "Spindle Hole": "Furo do quadrado",
  "Spindle Material": "Material do quadrado",
  "Faceplate to cylinder centre": "Da testa ao centro do cilindro",
  "Cylinder centre to back": "Do centro do cilindro ao fundo",
  "Hole Count": "Número de furos",
  "Door Width": "Largura da porta",
  Size: "Dimensões",
  Thickness: "Espessura",
  Width: "Largura",
  Length: "Comprimento",
  Projection: "Saliência",

  /* mechanism and function */
  Function: "Função",
  "Optional Function": "Função opcional",
  "Alarm Function": "Função de alarme",
  "Opening Method": "Método de abertura",
  "Unlocking Method": "Método de destravamento",
  "Opening Direction": "Sentido de abertura",
  "Opening Angle": "Ângulo de abertura",
  "Max opening angle": "Ângulo máximo de abertura",
  "Locking System": "Sistema de travamento",
  "Closing Sequence": "Sequência de fechamento",
  "Closing Force": "Força de fechamento",
  "Cycle life": "Vida útil em ciclos",
  "Max Bearing Capacity": "Capacidade máxima de carga",
  Handing: "Mão",
  Structure: "Estrutura",
  Feature: "Característica",
  Features: "Características",
  Chassis: "Chassi",
  Latch: "Lingueta",
  "Latch options": "Opções de lingueta",
  "Latch Components": "Componentes da lingueta",
  "Latch & Puller": "Lingueta e puxador",
  Deadbolt: "Trinco",
  Body: "Corpo",
  "Main body": "Corpo principal",
  "Inner body": "Corpo interno",
  Strike: "Contra-testa",
  "Case & Strike Plate": "Caixa e contra-testa",
  "Lock case": "Caixa da fechadura",
  "Nominal lock body": "Corpo de fechadura nominal",
  "Lock Type": "Tipo de fechadura",
  "Lock Type Compatibility": "Compatibilidade de fechadura",
  "Lock Cylinder": "Cilindro",
  "Lock Cylinder Housing": "Corpo do cilindro",
  "Cylinder Core": "Núcleo do cilindro",
  "Cylinder Type": "Tipo de cilindro",
  "Cylinder Decorative Ring": "Anel decorativo do cilindro",
  Cylinder: "Cilindro",
  "Outside Lever": "Maçaneta externa",
  "Outside Handle": "Maçaneta externa",
  "Thumbturn Button": "Botão de trava",
  "Tail Bar": "Haste",
  "Decorative Plate": "Placa decorativa",
  "Roller Material": "Material do rolete",
  "Pin Material": "Material do pino",
  Handle: "Maçaneta",
  "Handle Design": "Desenho da maçaneta",

  /* keys */
  Keying: "Amaestramento",
  "Key Required": "Chave necessária",
  "Key Types": "Tipos de chave",
  "Key Type": "Tipo de chave",
  "Keys Supplied": "Chaves fornecidas",
  "Key options": "Opções de chave",
  "Key material": "Material da chave",
  "Key Material": "Material da chave",

  /* material and finish */
  Material: "Material",
  "Housing Material": "Material do corpo",
  "Main Body Material": "Material do corpo principal",
  "Inner Material": "Material interno",
  "Cover material": "Material da tampa",
  "Backplate Material": "Material da placa traseira",
  "Deadbolt Material": "Material do trinco",
  "Latch Material": "Material da lingueta",
  "Latch Bolt Material": "Material da lingueta",
  "Push Bar Material": "Material da barra",
  "Handle Material": "Material da maçaneta",
  "Trim Material": "Material da guarnição",
  "Exposed Trim Material": "Material da guarnição aparente",
  "Strike Plate Material": "Material da contra-testa",
  "Cylinder material": "Material do cilindro",
  "Lens Cover": "Tampa da lente",
  "Lens Cover Material": "Material da tampa da lente",
  Finish: "Acabamento",
  "Surface Finish": "Acabamento de superfície",
  "Surface Finish Options": "Opções de acabamento",
  "Surface Treatment": "Tratamento de superfície",
  "Hardware Finish": "Acabamento da ferragem",
  "Finish & Color": "Acabamento e cor",
  "Finishes Available": "Acabamentos disponíveis",
  Color: "Cor",
  "Color Options": "Opções de cor",

  /* application and commercial */
  Application: "Aplicação",
  "Door Type": "Tipo de porta",
  "Suitable for": "Indicado para",
  "Suitable For": "Indicado para",
  "Compatible With": "Compatível com",
  "Available Versions": "Versões disponíveis",
  "Set Includes": "O conjunto inclui",
  "Included Accessories": "Acessórios incluídos",
  "Installation Method": "Método de instalação",
  "Installation Position": "Posição de instalação",
  Installation: "Instalação",
  "Mounting Style": "Tipo de montagem",
  "Mounting Location": "Local de montagem",
  "Fire Rating": "Resistência ao fogo",
  "Burglar Rated": "Classificação antiarrombamento",
  "Rated Opening Compliant": "Conforme para vão classificado",
  "BAA Compliant": "Conforme BAA",
  "Viewing angle": "Ângulo de visão",
  "Viewing Angle": "Ângulo de visão",
  "Country of Origin": "País de origem",
  "Factory reference": "Referência de fábrica",
  "Product Type": "Tipo de produto",
  "Product Name": "Nome do produto",
  "Additional Info": "Informação adicional",
  "OEM / ODM": "OEM / ODM",
  "OEM & ODM": "OEM e ODM",
  "OEM /ODM": "OEM / ODM",
  "OEM & Sample": "OEM e amostra",
  /* Added 2026-09-16 after the first run counted how often each was left in English. */
  Trim: "Guarnição",
  Weight: "Peso",
  Height: "Altura",
  Depth: "Profundidade",
  Diameter: "Diâmetro",
  Type: "Tipo",
  Variants: "Variantes",
  Customization: "Personalização",
  Operation: "Acionamento",
  Opening: "Abertura",
  Handling: "Manuseio",
  "Fixing screw": "Parafuso de fixação",
  "Fixing hole": "Furo de fixação",
  "Fixing hole (glass door)": "Furo de fixação (porta de vidro)",
  "Fixing hole (timber door)": "Furo de fixação (porta de madeira)",
  "Fixing hole (flush door)": "Furo de fixação (porta lisa)",
  "Max door weight": "Peso máximo da porta",
  "Max door width (spindle to edge)": "Largura máxima da porta (do quadrado ao canto)",
  "Min door thickness": "Espessura mínima da porta",
  "Door leaf thickness": "Espessura da folha",
  "Glass thickness": "Espessura do vidro",
  "Body size": "Dimensões do corpo",
  "Double action": "Ação dupla",
  "90° hold-open": "Retenção a 90°",
  "Two-stage closing valve": "Válvula de fechamento em dois estágios",
  "Closing force": "Força de fechamento",
  Standoff: "Afastamento",
  Spindle: "Quadrado",
  "Spindle centre": "Centro do quadrado",
  Capacity: "Capacidade",
  Lens: "Lente",
  Faceplate: "Testa",
  "Face plate": "Testa",
  "Lever thickness": "Espessura da maçaneta",
  "Pairs with": "Combina com",
};

/** Category slugs → the Portuguese name of the category. */
export const CATEGORY_NAMES_PT: Record<string, string> = {
  "panic-exit-devices": "Barras antipânico",
  "lock-cases": "Caixas de fechadura",
  "lever-handles": "Maçanetas de alavanca",
  "knob-locks": "Fechaduras de pomo",
  "stainless-steel-handles": "Puxadores em inox",
  "glass-door-accessories": "Ferragens para porta de vidro",
  "door-closers": "Molas aéreas",
  "door-hinges": "Dobradiças",
  "brass-steel-hinges": "Dobradiças de latão e aço",
  "night-latches-rim-locks": "Fechaduras de sobrepor",
  "lock-cylinders": "Cilindros",
  "bathroom-accessories": "Acessórios de banheiro",
  "grip-handle-sets": "Conjuntos de puxador",
  "hardware-accessories": "Acessórios de ferragem",
  "sliding-hook-locks": "Fechaduras de gancho para correr",
  "care-grab-bars": "Barras de apoio",
  "flip-up-grab-bars": "Barras de apoio rebatíveis",
  "fixed-grab-bars": "Barras de apoio fixas",
};

/**
 * Product names. Keyed on the English `name`, which is the product TYPE rather than the
 * model — the model number is never translated.
 *
 * ⚠ An unmapped name stops the run rather than defaulting to the category name. That
 * default is the exact defect that put "Accesorios de herrajes" on 582 Spanish records;
 * see the note in AGENTS.md.
 */
export const PRODUCT_NAMES_PT: Record<string, string> = {
  "Panic Exit Device": "Barra antipânico",
  "Fire Door Panic Exit Device": "Barra antipânico para porta corta-fogo",
  "Double Door Panic Exit Device": "Barra antipânico para porta de duas folhas",
  "S-Panic Exit Device": "Barra antipânico S",
  "D-Panic Exit Device": "Barra antipânico D",
  "Alarm Panic Bar Exit Device": "Barra antipânico com alarme",
  "Cold Room Push Bar Exit Device": "Barra antipânico para câmara fria",
  "Two Point Locking Exit Device": "Barra antipânico com travamento em dois pontos",
  "Panic Exit Device Trim": "Maçaneta externa para barra antipânico",
  "Anti-Pick Panic Exit Device Trim": "Maçaneta externa antiganzua para barra antipânico",
  "Panic Exit Device Lock Case": "Caixa de fechadura para barra antipânico",
  "Exterior Trim": "Guarnição externa",
  "Lock Case": "Caixa de fechadura",
  "Standard Mortise Lock Body": "Corpo de fechadura de embutir padrão",
  "Security Mortise Lock Body": "Corpo de fechadura de embutir de segurança",
  "Slim Mortise Lock Body": "Corpo de fechadura de embutir estreito",
  "Hook-Bolt Mortise Lock": "Fechadura de embutir com trinco de gancho",
  "Sliding Hook Lock": "Fechadura de gancho para porta de correr",
  "Tubular Lock": "Fechadura tubular",
  "Tubular Knob Lock": "Fechadura tubular de pomo",
  "Black Tubular Lever Lock Set": "Conjunto de fechadura tubular preta com maçaneta",
  "Heavy Duty Cylindrical Lock": "Fechadura cilíndrica de uso pesado",
  "Light Duty Cylindrical Lock": "Fechadura cilíndrica de uso leve",
  "Cylindrical Knob Lock": "Fechadura cilíndrica de pomo",
  "Commercial Lock": "Fechadura comercial",
  "Keyed Deadbolt Lock Set": "Conjunto de trinco com chave",
  "Night Latch And Rim Lock": "Fechadura de sobrepor",
  "Night Latch & Rim Lock": "Fechadura de sobrepor",
  "Lock Cylinder": "Cilindro",
  "Lever Handle": "Maçaneta de alavanca",
  "Stainless Steel Handle": "Puxador em inox",
  "Stainless Steel Lever Handle Lock": "Fechadura com maçaneta em inox",
  "Grip Handle Set": "Conjunto de puxador",
  "Concealed Sliding Door Handle": "Puxador embutido para porta de correr",
  "Glass Door Handle": "Puxador para porta de vidro",
  "Stainless Steel Glass Door Pull Handle": "Puxador em inox para porta de vidro",
  "Brass Pull Handle": "Puxador de latão",
  /*
    2026-09-17, the 55 stainless and 21 concealed hinges another session added the same
    day. The translator refuses to run on an unmapped name rather than falling back to the
    category — the defect that named 582 Spanish records after their own category in
    September. Two lines instead of weeks.

    "Dobradiça com rolamento" rather than a calque of "ball bearing": the Brazilian trade
    names the hinge after what is in the knuckle, and BB in the model number carries the
    count for anyone who reads the code.
  */
  "Ball Bearing Hinge": "Dobradiça com rolamento",
  "Concealed Hinge": "Dobradiça oculta",
  "Glass Door Patch Fittings": "Ferragens para porta de vidro",
  "Glass Door Patch Fitting Set": "Conjunto de ferragens para porta de vidro",
  "Brass and Steel Hinges": "Dobradiças de latão e aço",
  "Door Hinge": "Dobradiça",
  "Stainless Steel Door Hinge": "Dobradiça em inox",
  "Wooden Door Floor Hinge": "Mola de piso para porta de madeira",
  "Floor Spring": "Mola de piso",
  "Overhead Door Closer": "Mola aérea",
  "Top Pivot": "Pivô superior",
  "Glass Door Top Patch": "Ferragem superior para porta de vidro",
  "Hydraulic Hinge": "Dobradiça hidráulica",
  "Door Closer": "Mola aérea",
  "Door Coordinator": "Coordenador de fechamento",
  "Pry Latch": "Lingueta antialavanca",
  "Door Flush Bolt": "Ferrolho embutido",
  "Stainless Steel Flush Bolt": "Ferrolho embutido em inox",
  "Door Stopper": "Batente de porta",
  "Door viewer": "Olho mágico",
  "Security Door Guard": "Trava de segurança",
  "Door Power Transfer Devices": "Transferência de energia para porta",
  "Gate House No": "Número de porta",
  "Stainless Steel Wall Hook": "Gancho de parede em inox",
  "Bathroom Accessories": "Acessórios de banheiro",
  "Grab Bar": "Barra de apoio",
  "Flip-Up Grab Bar": "Barra de apoio rebatível",
  Indicator: "Indicador",
  Latch: "Lingueta",
  /* Added when the guard stopped the first run: 11 deadbolt records and 3 knobs. */
  Deadbolts: "Trincos",
  Deadbolt: "Trinco",
  "Door Knob": "Pomo de porta",
};

/**
 * Finish names, used both on their own and inside the comma-separated lists the catalogue
 * writes ("Polished Brass (PB), Antique Brass (AB), …"). The parenthesised code is a code
 * and passes through untouched — that is the whole point of a code.
 */
export const FINISH_NAMES_PT: Record<string, string> = {
  "Polished Brass": "Latão polido",
  "Polished brass": "Latão polido",
  "Satin Brass": "Latão acetinado",
  "Satin brass": "Latão acetinado",
  "Antique Brass": "Latão antigo",
  "Antique brass": "Latão antigo",
  "Antique Copper": "Cobre antigo",
  "Antique copper": "Cobre antigo",
  "Chrome Plated": "Cromado",
  "Chrome plated": "Cromado",
  "Satin Chrome": "Cromo acetinado",
  "Satin chrome": "Cromo acetinado",
  "Satin Nickel": "Níquel acetinado",
  "Satin nickel": "Níquel acetinado",
  "Nickel Plated": "Niquelado",
  "Nickel plated": "Niquelado",
  "Black Nickel": "Níquel preto",
  "Black nickel": "Níquel preto",
  "Stainless Steel": "Aço inoxidável",
  "Stainless steel": "Aço inoxidável",
  "Satin Stainless": "Inox acetinado",
  "Satin Stainless Steel": "Aço inoxidável acetinado",
  "Satin stainless steel": "Aço inoxidável acetinado",
  "Polished Stainless Steel": "Aço inoxidável polido",
  "Polished stainless steel": "Aço inoxidável polido",
  "Bright Polished": "Polido brilhante",
  "Bright polished": "Polido brilhante",
  "Oil Rubbed Bronze": "Bronze oleado",
  "Oil-rubbed bronze": "Bronze oleado",
  "Matt Black": "Preto fosco",
  "Matte Black": "Preto fosco",
  "Spray Painting": "Pintura a pistola",
  "Spray painted": "Pintado a pistola",
  "Powder Coating": "Pintura a pó",
  "Zinc Plated": "Zincado",
  "White sprayed": "Pintado de branco",
  "Wood-grain sprayed": "Pintado imitando madeira",
  "All Available": "Todos disponíveis",
  "Multiple finish": "Vários acabamentos",
};

/** Materials, as they appear in a `Material` row. */
export const MATERIAL_NAMES_PT: Record<string, string> = {
  "Stainless steel": "Aço inoxidável",
  "Stainless Steel": "Aço inoxidável",
  "stainless steel": "aço inoxidável",
  "304 Stainless Steel": "Aço inoxidável 304",
  "304 stainless steel": "aço inoxidável 304",
  "Stainless Steel 304": "Aço inoxidável 304",
  "Stainless Steel 304/201": "Aço inoxidável 304/201",
  "Stainless Steel201/304": "Aço inoxidável 201/304",
  "304SS": "Inox 304",
  "Zinc alloy": "Zamak",
  "Zinc Alloy": "Zamak",
  "zinc alloy": "zamak",
  "Solid brass": "Latão maciço",
  "Solid Brass": "Latão maciço",
  Brass: "Latão",
  Copper: "Cobre",
  "Copper Construction": "Construção em cobre",
  Iron: "Ferro",
  iron: "ferro",
  "Iron case": "Caixa de ferro",
  "Aluminium case": "Caixa de alumínio",
  Aluminum: "Alumínio",
  "Aluminum Alloy": "Liga de alumínio",
  "Aluminum alloy": "Liga de alumínio",
  "Aluminium and steel": "Alumínio e aço",
  "Stainless steel body": "Corpo em aço inoxidável",
  "Thickened Iron": "Ferro reforçado",
  "Flame-Retardant ABS": "ABS retardante de chama",
  "ABS/plastic": "ABS / plástico",
  "Carbon Steel .": "Aço carbono.",
  "Nickel Plated Iron": "Ferro niquelado",
  "zinc alloy+brass": "zamak + latão",
  "Brass/zinc alloy": "Latão / zamak",
  "Iron+stainless steel": "Ferro + aço inoxidável",
  "Stainless Steel+Brass": "Aço inoxidável + latão",
  "Brass or Stainless Steel": "Latão ou aço inoxidável",
  "Brass or iron": "Latão ou ferro",
  "Brass or zinc": "Latão ou zinco",
  "Stainless steel, brass or steel": "Aço inoxidável, latão ou aço",
  "Stainless Steel / Brass / Steel": "Aço inoxidável / latão / aço",
  "Stainless steel/Brass/Solid steel": "Aço inoxidável / latão / aço maciço",
  "Solid Brass Cylinder": "Cilindro de latão maciço",
  "Brass Cylinder": "Cilindro de latão",
  "Brass cylinder": "Cilindro de latão",
  Silver: "Prata",
  Black: "Preto",
};

/**
 * Whole spec values that are prose. Keyed on the exact English string.
 *
 * These are the rows that carry the most meaning for a buyer — function, handing, keying,
 * what a throw resists — so they are translated in full rather than assembled from parts.
 */
export const SPEC_VALUES_PT: Record<string, string> = {
  "4 × ball bearing": "4 × rolamento",
  "2 × ball bearing": "2 × rolamento",
  "1 × ball bearing": "1 × rolamento",
  "0 × ball bearing": "0 × rolamento",
  "2 × copper gasket": "2 × arruela de cobre",
  "Stainless Steel 304/316L": "Aço inoxidável 304/316L",
  "Pure Copper": "Cobre puro",
  "Two hydraulic / 2+1": "Duas hidráulicas / 2+1",
  /* handing and reversibility */
  "Fully reversible, left or right hand": "Totalmente reversível, mão direita ou esquerda",
  "Fully reversible for left or right-hand doors":
    "Totalmente reversível para portas de mão direita ou esquerda",
  "Non-handed, left or right hand": "Sem mão definida, direita ou esquerda",
  "Left & Right Reversible": "Reversível para direita e esquerda",
  "Suitable for both left a right-handed doors.":
    "Serve para portas de mão direita e esquerda.",
  "Suitable for both left and right-handed doors.":
    "Serve para portas de mão direita e esquerda.",

  /* function */
  "Entrance — keyed outside": "Entrada — com chave pelo lado de fora",
  "Privacy — bathroom, turn button inside": "Condena — banheiro, botão de trava por dentro",
  Passage: "Passagem",
  "Entrance, privacy, passage or dummy": "Entrada, condena, passagem ou cega",
  "Entrance and communication": "Entrada e comunicação",
  "COMMUNICATION LOCK": "FECHADURA DE COMUNICAÇÃO",
  "CLASSROOM LOCK": "FECHADURA DE SALA DE AULA",
  "EXIT LATCH": "LINGUETA DE SAÍDA",
  "Key Operated": "Acionada por chave",
  "Push to Open": "Empurre para abrir",
  "Double-sided": "Dos dois lados",
  "Single Door": "Porta de uma folha",
  "Double Door": "Porta de duas folhas",
  "Surface Mounted": "De sobrepor",
  "Concealed Lock": "Fechadura embutida",
  "Single or double cylinder with self-locking function":
    "Cilindro simples ou duplo, com função de autotravamento",
  "Single cylinder, double cylinder or self-locking":
    "Cilindro simples, cilindro duplo ou autotravamento",
  "Safety lock with cylinder": "Fechadura de segurança com cilindro",
  "Vacant & Occupied Indicator": "Indicador de livre e ocupado",
  "Slide Bolt Lock": "Pasador corredor",

  /* latch, bolt and case construction */
  "Deadlocking on keyed functions": "Com travamento nas funções com chave",
  "12mm throw, deadlocking for keyed functions":
    "Curso de 12 mm, com travamento nas funções com chave",
  "13mm, with inside deadlocking button": "13 mm, com botão de travamento interno",
  "25mm on rim deadbolt versions": "25 mm nas versões com trinco de sobrepor",
  "25mm, with hardened steel insert to resist sawing":
    "25 mm, com inserto de aço temperado que resiste ao serramento",
  "25mm, zinc die-cast with hardened steel roller insert":
    "25 mm, zamak injetado com pino rolante de aço temperado",
  "Solid steel chassis and latch case, zinc plated":
    "Chassi e caixa da lingueta em aço maciço, zincados",
  "Solid steel, zinc plated for corrosion resistance":
    "Aço maciço, zincado para resistência à corrosão",
  "Solid steel internal construction, corrosion protected":
    "Construção interna em aço maciço, protegida contra corrosão",
  "Zinc die-cast case, zinc-plated steel internal components":
    "Caixa em zamak injetado, componentes internos em aço zincado",
  "Zinc plated steel internal components": "Componentes internos em aço zincado",
  "Zinc die-casting electro-plated or solid brass":
    "Zamak injetado com galvanização ou latão maciço",
  "Forged solid brass or zinc die-casting electro-plated":
    "Latão maciço forjado ou zamak injetado galvanizado",
  "Wrought stainless steel or brass": "Aço inoxidável laminado ou latão",
  "Anti-picking slide gate on single-cylinder deadlock":
    "Corrediça antiganzua no trinco de cilindro simples",
  "Free-turning cylinder trim prevents wrenching; cylinder removable for rekeying":
    "O anel giratório do cilindro impede o arrancamento; o cilindro sai para recombinação",
  "No exposed exterior fixings; free-turning cylinder ring resists wrenching":
    "Sem fixações aparentes pelo lado de fora; o anel giratório do cilindro resiste ao arrancamento",
  "Angle strike standard for inward-opening doors; flat strike available":
    "Contra-testa angular de série para portas que abrem para dentro; contra-testa plana disponível",
  "57mm curved lip standard; 70mm available on request":
    "Lábio curvo de 57 mm de série; 70 mm sob pedido",
  "51mm — replaces most existing locksets":
    "51 mm — substitui a maioria das fechaduras existentes",
  "Brass rolling latch": "Lingueta rolante de latão",
  "Square latch": "Lingueta quadrada",
  "Beveled latch structure": "Lingueta chanfrada",
  "Euro profile": "Perfil europeu",
  "Euro Profile Mortise Lock": "Fechadura de embutir de perfil europeu",
  "Trim handle · outside lever for panic exit devices":
    "Maçaneta externa · para barras antipânico",
  "Trim handle · anti-pick outside lever for panic exit devices":
    "Maçaneta externa antiganzua · para barras antipânico",

  /* keying */
  "Can be keyed alike with deadbolts, or master keyed":
    "Pode ser igualada com os trincos ou integrada num sistema de chave-mestra",
  "Can be keyed alike to deadbolts": "Pode ser igualada com os trincos",
  "Can be keyed alike to the deadbolt series, or master keyed":
    "Pode ser igualada com a série de trincos ou integrada num sistema de chave-mestra",
  "Can be keyed to pair with an entrance bored lock":
    "Pode ser combinada com uma fechadura de entrada de furo",
  "5-pin tumbler, brass plug, two nickel-plated brass keys":
    "Cilindro de 5 pinos, núcleo de latão, duas chaves de latão niquelado",
  "5-pin tumbler, solid brass plug, two nickel-plated brass keys":
    "Cilindro de 5 pinos, núcleo de latão maciço, duas chaves de latão niquelado",
  "2 Nickel-Plated Brass Keys": "2 chaves de latão niquelado",
  "2 × Nickel-Plated Brass Keys": "2 × chaves de latão niquelado",
  "3 nickel-plated brass keys": "3 chaves de latão niquelado",
  "Includes 3 brass keys": "Inclui 3 chaves de latão",
  "Brass cylinder with 2 brass keys": "Cilindro de latão com 2 chaves de latão",
  "Zinc alloy or brass; two keys": "Zamak ou latão; duas chaves",
  "Nickel-plated brass, solid brass, brushed nickel":
    "Latão niquelado, latão maciço, níquel escovado",
  "Nickel-Plated Brass, Solid Brass, Brushed Nickel":
    "Latão niquelado, latão maciço, níquel escovado",

  /* application */
  "Residential use": "Uso residencial",
  "Standard residential use": "Uso residencial padrão",
  "Commercial offices, schools and heavy-duty residential":
    "Escritórios, escolas e uso residencial pesado",
  "Residential Doors / Interior Doors / Light Commercial Use":
    "Portas residenciais / portas internas / uso comercial leve",
  "Wooden Door / Metal Door": "Porta de madeira / porta metálica",
  "Wooden and metal doors": "Portas de madeira e metálicas",
  "Interior wooden and metal doors": "Portas internas de madeira e metálicas",
  "Fire door": "Porta corta-fogo",
  "Fire Doors, Emergency Exit Doors": "Portas corta-fogo, portas de saída de emergência",
  "Fire Doors / Emergency Exit Doors / Commercial Doors":
    "Portas corta-fogo / portas de saída de emergência / portas comerciais",
  "Fire door , panic door .": "Porta corta-fogo, porta antipânico.",
  "Fire door accessory": "Acessório para porta corta-fogo",
  "Panic Exit Device Accessory": "Acessório para barra antipânico",
  "Panic Exit Device / Panic Bar": "Barra antipânico",
  "Glass door": "Porta de vidro",
  "For entrance doors": "Para portas de entrada",
  "For Privacy doors": "Para portas de condena",
  "for lavatory or other privacy doors": "para banheiros e outras portas de condena",
  "Suit for toilet door or other doors": "Indicado para portas de banheiro e outras portas",
  "Suitable for all types of doors": "Indicado para todos os tipos de porta",
  "Used in combination with push bar and lock":
    "Utilizado em conjunto com a barra e a fechadura",
  bathroom: "banheiro",
  "bathroom, living room": "banheiro, sala",
  "Bathroom Hotel": "Banheiro, hotel",
  "Living room/Bathroom": "Sala / banheiro",
  "living room,bathroom...": "sala, banheiro…",
  "Door Safety": "Segurança da porta",
  "Door Security": "Segurança da porta",
  "Monitoring Outdoor": "Vigilância externa",
  "fix the door": "fixar a porta",
  "wall-mount": "de parede",
  "Toilet Cubicle Door / Restroom Door / Hotel / Office / Hospital / Public Restroom":
    "Porta de cabine sanitária / porta de banheiro / hotel / escritório / hospital / banheiro público",

  /* commercial */
  Available: "Disponível",
  "OEM & ODM available": "OEM e ODM disponíveis",
  "OEM & ODM Available": "OEM e ODM disponíveis",
  "OEM available with MOQ": "OEM disponível com pedido mínimo",
  "Customizable upon customer request": "Personalizável a pedido do cliente",
  "Custom Colors Available": "Cores personalizadas disponíveis",
  "Custom Sizes Available": "Dimensões personalizadas disponíveis",
  "Different length according to customer request":
    "Comprimento conforme o pedido do cliente",
  "Optional (Not Included in the Listed Price)": "Opcional (não incluído no preço indicado)",
  "One set per box with fasteners": "Um conjunto por caixa, com fixações",
  "Includes installation screws": "Inclui parafusos de instalação",
  "Screw Mounted": "Fixação por parafusos",
  "South America": "América do Sul",
  "High usage life": "Vida útil elevada",
  "Detachable, Smooth Rotation, Easy Installation":
    "Desmontável, rotação suave, instalação fácil",
  "Synthetic resin lens with cover": "Lente de resina sintética com tampa",
  "Standard USA mounting size": "Medida de instalação padrão dos EUA",
  "Bedroom, apartment, office, hotel, interior doors":
    "Quarto, apartamento, escritório, hotel, portas internas",
  "Double cylinder": "Cilindro duplo",
  "Single cylinder": "Cilindro simples",
  "Double Cylinder": "Cilindro duplo",
  "Single Cylinder": "Cilindro simples",
  Yes: "Sim",
  No: "Não",
  Painting: "Pintura",
  "CF60 lift-to-lock": "CF60 levantar para travar",
  "Satin nickel, chrome, antique brass, polished brass,all available":
    "Níquel acetinado, cromado, latão antigo, latão polido — todos disponíveis",
  "60mm / 70mm adjustable, latch and deadbolt both":
    "60 mm / 70 mm ajustável, lingueta e trinco",
  "Solid brass/Zinc & brass cylinder": "Latão maciço / cilindro de zamak e latão",
  "60/70mm adjustable tubular latch": "Lingueta tubular ajustável 60/70 mm",
  "zinc alloy / Solid brass/Zinc & brass cylinder":
    "zamak / latão maciço / cilindro de zamak e latão",
  "Iron, nickel-plated brass, solid brass, brushed nickel":
    "Ferro, latão niquelado, latão maciço, níquel escovado",
  "Satin nickel, chrome, antique brass, polished brass, black nickel, antique copper – multiple options available":
    "Níquel acetinado, cromado, latão antigo, latão polido, níquel preto, cobre antigo — várias opções disponíveis",
  "Zinc-plated, black or chrome-plated.": "Zincado, preto ou cromado.",
  "Copper-plated zinc alloy or brass": "Zamak cobreado ou latão",
  "Gray spray painted, other available": "Pintado de cinza, outras cores disponíveis",
  "steel material with spray painting , different finishes are available .":
    "aço com pintura a pistola; vários acabamentos disponíveis.",
  "Steel with electrostatic powder coating": "Aço com pintura eletrostática a pó",
  "Powder-coated (static paint)": "Pintura a pó (eletrostática)",
  "Brass or iron, two/three-throw": "Latão ou ferro, duas ou três voltas",
  "Brass (inside and outside), fixed or loose type":
    "Latão (interno e externo), tipo fixo ou solto",
  "Spray painted; various finishes available (MOQ required)":
    "Pintado a pistola; vários acabamentos disponíveis (com pedido mínimo)",
  "Spray painted; multiple finishes available (MOQ required)":
    "Pintado a pistola; vários acabamentos disponíveis (com pedido mínimo)",
  "1.0 mm (optional: 0.8 mm)": "1,0 mm (opcional: 0,8 mm)",
  "Decorative / Classic / European Style": "Decorativo / clássico / estilo europeu",
  "Twisted Lever Handle": "Maçaneta torcida",
  "Backplate Mounted, Mortise Lock Installation":
    "Montagem em espelho, instalação com fechadura de embutir",
  "KFC Lock Bodies, Aluminum Narrow Door Lock Bodies":
    "Corpos de fechadura KFC e corpos para porta estreita de alumínio",
  "Matte Black.（Custom colors available.）": "Preto fosco. (Cores personalizadas disponíveis.)",
  "Red,Black": "Vermelho, preto",
  "Red, Black": "Vermelho, preto",
  "Satin+Polished": "Acetinado + polido",
  "Multiple finish": "Vários acabamentos",
};
