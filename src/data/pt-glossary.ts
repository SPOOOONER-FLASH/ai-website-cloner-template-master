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
  "Mechanism":
    "Mecanismo",
  "Size6":
    "Medida 6",
  "Size7":
    "Medida 7",
  "Spring":
    "Mola",
  "OEM":
    "OEM",
  "Max door thickness":
    "Espessura máxima da porta",
  "Grip width":
    "Largura do punho",
  "Centre distance, horizontal":
    "Distância entre centros, horizontal",
  "Centre distance, vertical":
    "Distância entre centros, vertical",
  "Corner offset":
    "Recuo do canto",
  "Length bands":
    "Faixas de comprimento",
  "Compatibility":
    "Compatibilidade",
  "LOGO":
    "Marcação",
  "Overall width":
    "Largura total",
  "Roll spacing":
    "Distância entre roletes",
  "Glass cutout":
    "Recorte no vidro",
  "Bar spacing":
    "Distância entre barras",
  "Tube section":
    "Seção do tubo",
  "Section":
    "Seção",
  "Fixing pitch":
    "Passo de fixação",
  "Recess depth":
    "Profundidade do rebaixo",
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
  /*
    ⚠ The three below carry U+202F (NARROW NO-BREAK SPACE) before "mm", not a plain
    space. They look identical to "110 mm" in every editor and they are a different
    string, so an entry typed with a normal space never matches and the value silently
    stays English. Copy them, do not retype them.
  */
  "110 mm (L) × 66 mm (W)":
    "110 mm (C) × 66 mm (L)",
  "103 mm × 66 mm":
    "103 mm × 66 mm",
  "115 mm (L) × 53 mm (W)":
    "115 mm (C) × 53 mm (L)",
  "The Rim door looks with double cylinder double throw. Dead bolt and latch bolt have triple guaranteed function which avoid prizing off the door, opening the door from inside. Without keys and removing the lock from inside when closed so as to ensure security. They are suitable for various kinds of wooden or iron doors.":
    "Fechadura de sobrepor com cilindro duplo e duplo avanço. A trava e o trinco têm tripla função de garantia, que impede alavancar a porta, abri-la por dentro sem chave e remover a fechadura pelo lado interno quando trancada, garantindo a segurança. Servem em vários tipos de porta de madeira ou de ferro.",
  "Wooden Door / Metal Door / Furniture Door / Commercial Door / Residential / Commercial / Hotel / Office / Hospital / School / Warehouse":
    "Porta de madeira / porta de metal / porta de móvel / porta comercial / residencial / comercial / hotel / escritório / hospital / escola / galpão",
  "Includes opening and closing speed regulation, spring tension is fully adjustable, door can swing 116 inwards or out wards, with stops at 0, 88 and 116 in both directions.":
    "Inclui regulagem da velocidade de abertura e de fechamento, tensão de mola totalmente ajustável, a porta gira 116° para dentro ou para fora, com paradas em 0°, 88° e 116° nos dois sentidos.",
  "Aluminum Storefront Door / Glass Door / Office Door / Commercial Entrance Door / Shops, Offices, Malls, Supermarkets, Commercial Buildings":
    "Porta de vitrine em alumínio / porta de vidro / porta de escritório / porta de entrada comercial / lojas, escritórios, shoppings, supermercados, edifícios comerciais",
  "Stainless Steel Flag Hinge":
    "Dobradiça bandeira em aço inoxidável",
  "Stainless Steel Spring Hinge":
    "Dobradiça de mola em aço inoxidável",
  "No Ball Bearing / 2BB Plain Bearing (available options)":
    "Sem rolamento / 2BB com bucha lisa (opções disponíveis)",
  "Plain Bearing / No Ball Bearing / 2BB (optional)":
    "Bucha lisa / sem rolamento / 2BB (opcional)",
  "201/304 Stainless Steel":
    "Aço inoxidável 201/304",
  "304 Stainless steel":
    "Aço inoxidável 304",
  "Automatic Self-Closing (Adjustable Tension)":
    "Fechamento automático (tensão regulável)",
  "Double Action, Self-Closing":
    "Duplo sentido, fechamento automático",
  "Interior Door / Commercial Door / Fire Door / Passage Door":
    "Porta interna / porta comercial / porta corta-fogo / porta de passagem",
  "Cafe Doors, Kitchen Doors, Swing Doors":
    "Portas de café, portas de cozinha, portas vaivém",
  "1 Pair/Box, 50 Pairs/Carton":
    "1 par/caixa, 50 pares/caixa de embarque",
  "Includes Screws":
    "Inclui parafusos",
  "Non-Handed (Reversible)":
    "Sem mão (reversível)",
  "180° (90° each direction)":
    "180° (90° em cada sentido)",
  "4” × 3”":
    "4” × 3”",
  "Hardened Steel (HRC58)":
    "Aço temperado (HRC58)",
  "Anti-Drill & Anti-Pry Cylinder Protection":
    "Proteção do cilindro antifuro e antialavanca",
  "Concealed Internal Fixing (Through-bolt)":
    "Fixação interna oculta (parafuso passante)",
  "Armored Doors / Security Doors / Entrance Doors":
    "Portas blindadas / portas de segurança / portas de entrada",
  "PVD / Satin / Polished / Antique (Gold, Chrome, Black, Bronze)":
    "PVD / acetinado / polido / antigo (dourado, cromado, preto, bronze)",
  "case is made of zinc alloy die-casting,":
    "a caixa é em zamac injetado,",
  "30mm (extension sizes optional)":
    "30 mm (medidas de extensão opcionais)",
  "Brushed satin":
    "Acetinado escovado",
  "6-pin":
    "6 pinos",
  "Five":
    "Cinco",
  "3 keys":
    "3 chaves",
  "3 brass keys":
    "3 chaves de latão",
  "Normal key / Computer key optional":
    "Chave comum / chave computadorizada opcional",
  "External single cylinder":
    "Cilindro simples externo",
  "Surface or mortise":
    "De sobrepor ou de embutir",
  "Works with panic exit devices":
    "Funciona com barras antipânico",
  "Up to 90mm":
    "Até 90 mm",
  "Up and down: ±2.5mm; Left and right: ±1.5mm; Front and back: ±1.0mm":
    "Vertical: ±2,5 mm; lateral: ±1,5 mm; profundidade: ±1,0 mm",
  "Up and down: ±2.5mm; Left and right: ±2.0mm; Front and back: ±2.5mm":
    "Vertical: ±2,5 mm; lateral: ±2,0 mm; profundidade: ±2,5 mm",
  "Up and down: ±1.5mm; Front and back: ±1.5mm":
    "Vertical: ±1,5 mm; profundidade: ±1,5 mm",
  "159&230mm":
    "159 e 230 mm",
  "11&49mm":
    "11 e 49 mm",
  "137&77mm":
    "137 e 77 mm",
  "12&50mm":
    "12 e 50 mm",
  "70&34mm":
    "70 e 34 mm",
  "7&23mm":
    "7 e 23 mm",
  "117&70.5mm":
    "117 e 70,5 mm",
  "11.5&36mm":
    "11,5 e 36 mm",
  "138.8&110mm":
    "138,8 e 110 mm",
  "10&30mm":
    "10 e 30 mm",
  "99&140mm":
    "99 e 140 mm",
  "7.5&27mm":
    "7,5 e 27 mm",
  "119&150mm":
    "119 e 150 mm",
  "7&22mm":
    "7 e 22 mm",
  "141&177mm":
    "141 e 177 mm",
  "9.7&26.8mm":
    "9,7 e 26,8 mm",
  "113&73mm":
    "113 e 73 mm",
  "7&40mm":
    "7 e 40 mm",
  "108&161mm":
    "108 e 161 mm",
  "6&29mm":
    "6 e 29 mm",
  "67.5mm (L600) / 65mm (L1640–2140)":
    "67,5 mm (L600) / 65 mm (L1640–2140)",
  "300mm (P=260) / 700mm (P=660)":
    "300 mm (P = 260) / 700 mm (P = 660)",
  "P1=40mm at each end":
    "P1 = 40 mm em cada extremidade",
  "outside φ12mm inside φ8mm":
    "externo Ø12 mm, interno Ø8 mm",
  "50 × 50mm (square)":
    "50 × 50 mm (quadrado)",
  "50mm (square)":
    "50 mm (quadrado)",
  "A 1600–2200 / B 2201–2700 / C 2701–3100":
    "A 1600–2200 / B 2201–2700 / C 2701–3100",
  "1600–3100mm（按单定制）":
    "1600–3100 mm (sob encomenda)",
  "AB, AC, PB, SB, SS, SP, SC (e.g., antique brass, polished brass, satin nickel, matte black, etc.)":
    "AB, AC, PB, SB, SS, SP, SC (por exemplo: latão antigo, latão polido, níquel acetinado, preto fosco etc.)",
  "Electroplating.":
    "Galvanoplastia.",
  "Outswing Doors":
    "Portas de abertura para fora",
  "Anti Pry Protection":
    "Proteção antialavanca",
  "Screw Fixing":
    "Fixação por parafusos",
  "Residential and Commercial Use":
    "Uso residencial e comercial",
  "304 Stainless Steel Screws":
    "Parafusos em aço inoxidável 304",
  "Full Latch Coverage":
    "Cobertura total do trinco",
  "Deadlatch Lock":
    "Fechadura de trinco travável",
  "Deadlatch + Hold-Back Function":
    "Trinco travável + função de retenção",
  "Deadlatch Lock with Hold-Back Function":
    "Fechadura de trinco travável com função de retenção",
  "Push Pull Paddle Door Lock Set":
    "Conjunto de fechadura com acionador tipo alavanca",
  "Push / Pull Operation":
    "Operação empurra/puxa",
  "Reversible (Left / Right)":
    "Reversível (esquerda / direita)",
  "Left Hand or Right Hand Available":
    "Disponível em mão esquerda ou direita",
  "Iron Body, Zinc Alloy Latch, ABS Components":
    "Corpo de ferro, trinco em zamac, componentes em ABS",
  "Iron Lock Body + Stainless Steel Face Plate":
    "Corpo de fechadura em ferro + testa em aço inoxidável",
  "Zinc Alloy & ABS":
    "Zamac e ABS",
  "Zinc Alloy + Plastic / Brass":
    "Zamac + plástico / latão",
  "Nickel-plated iron":
    "Ferro niquelado",
  "40 hook-bolt lock body":
    "Corpo de fechadura com ferrolho tipo gancho 40",
  "Horizontal case":
    "Caixa horizontal",
  "10 Holes":
    "10 furos",
  "Aluminum Storefront Doors, Glass Doors, Commercial Entry Systems":
    "Portas de vitrine em alumínio, portas de vidro, sistemas de entrada comercial",
  "Aluminum Storefront Door / Glass Door / Office Door / Commercial Entrance Door / Shops, Offices, Malls":
    "Porta de vitrine em alumínio / porta de vidro / porta de escritório / porta de entrada comercial / lojas, escritórios, shoppings",
  "Shops, Offices, Malls, Supermarkets, Commercial Buildings":
    "Lojas, escritórios, shoppings, supermercados, edifícios comerciais",
  "Easy Installation with Complete Accessories":
    "Instalação fácil, com acessórios completos",
  "OEM / ODM Available":
    "OEM / ODM disponível",
  "Box Packing":
    "Embalagem em caixa",
  "Double Hook Door Bolt(Double Flat Door Bolt, Single Hook Door Bolt, Single Flat Door Bolt.)":
    "Ferrolho duplo tipo gancho (ferrolho duplo plano, ferrolho simples tipo gancho, ferrolho simples plano.)",
  "Single Hook Door Bolt (Double Hook Door Bolt,Double Flat Door Bolt,Single Flat Door Bolt.)":
    "Ferrolho simples tipo gancho (ferrolho duplo tipo gancho, ferrolho duplo plano, ferrolho simples plano.)",
  "Aluminum Door Lock Body, American-Style Lock Cylinder / Lock Case (Door Bolt), and Locks and Keys.":
    "Corpo de fechadura para porta de alumínio, cilindro no padrão americano / caixa de fechadura (ferrolho), e fechaduras e chaves.",
  "Cylindrical door lock":
    "Fechadura cilíndrica de porta",
  "Tubular lock":
    "Fechadura tubular",
  "lever handle":
    "maçaneta de alavanca",
  "Lever Handle Lock":
    "Fechadura com maçaneta de alavanca",
  "Entrance door lock":
    "Fechadura de porta de entrada",
  "Door Lock":
    "Fechadura de porta",
  "Panic exit":
    "Saída antipânico",
  "Emergency and escape doors":
    "Portas de emergência e de fuga",
  "Security doors":
    "Portas de segurança",
  "Sliding doors":
    "Portas de correr",
  "Wooden Doors / Security Doors":
    "Portas de madeira / portas de segurança",
  "For Passage doors":
    "Para portas de passagem",
  "Doors, Windows, Cabinet Doors, Fire Doors / Residential, Commercial, Hotel, Office, Warehouse, Industrial":
    "Portas, janelas, portas de armário, portas corta-fogo / residencial, comercial, hotel, escritório, galpão, industrial",
  "Irregular sizes and custom dimensions supported for OEM & ODM":
    "Medidas fora de padrão e dimensões sob medida para OEM e ODM",
  "Gun metal (GM)":
    "Metal escurecido (GM)",
  "3”, 4”, 5”, 6”":
    "3”, 4”, 5”, 6”",
  "784mm (600 + 184)":
    "784 mm (600 + 184)",
  "800mm (575 + 225)":
    "800 mm (575 + 225)",
  "326mm × 638mm":
    "326 mm × 638 mm",
  "300mm (P=275)":
    "300 mm (P = 275)",
  "12mm, R6":
    "12 mm, R6",
  "200mm (150mm at each end)":
    "200 mm (150 mm em cada extremidade)",
  "42 × 174mm (46mm for 45mm doors)":
    "42 × 174 mm (46 mm para portas de 45 mm)",
  "40mm (45mm version available)":
    "40 mm (versão de 45 mm disponível)",
  "26mm (20mm variant)":
    "26 mm (variante de 20 mm)",
  "160&127mm":
    "160 e 127 mm",
  "7.8&32mm":
    "7,8 e 32 mm",
  "186&240mm":
    "186 e 240 mm",
  "10&45.5mm":
    "10 e 45,5 mm",
  "196&235mm / 167&235mm":
    "196 e 235 mm / 167 e 235 mm",
  "9.5&43mm / 7.5&46mm":
    "9,5 e 43 mm / 7,5 e 46 mm",
  "Door Sequence Selector":
    "Coordenador de sequência de portas",
  "Automatic Door Sequencing":
    "Sequenciamento automático das folhas",
  "Mechanical, No Power Required":
    "Mecânico, não precisa de energia",
  "Inactive Leaf First, Active Leaf After":
    "Folha passiva primeiro, folha ativa depois",
  "Top of Door Frame":
    "Travessa superior do batente",
  "2 Support Brackets, Screws and Washers":
    "2 suportes, parafusos e arruelas",
  "Double-Leaf Doors":
    "Portas de duas folhas",
  "Double door":
    "Porta dupla",
  "Fire double door":
    "Porta dupla corta-fogo",
  "Fire doors / double doors":
    "Portas corta-fogo / portas duplas",
  "Fire Doors / Commercial Double Doors / Schools / Hospitals / Office Buildings / Commercial Projects":
    "Portas corta-fogo / portas duplas comerciais / escolas / hospitais / edifícios de escritórios / obras comerciais",
  "Zinc-Plated Steel":
    "Aço zincado",
  "Iron with zinc-plated finish":
    "Ferro com acabamento zincado",
  "Surface mounted, screw fixed":
    "De sobrepor, fixado por parafusos",
  "Nylon":
    "Náilon",
  "Automatic closing / speed & force control":
    "Fechamento automático / controle de velocidade e força",
  "Includes opening and closing speed regulation, spring tension is fully adjustable, door can swing in both directions":
    "Inclui regulagem da velocidade de abertura e de fechamento, tensão de mola totalmente ajustável, a porta gira nos dois sentidos",
  "Synthetic resin":
    "Resina sintética",
  "Synthetic resin (with optional cover)":
    "Resina sintética (com tampa opcional)",
  "Synthetic resin lens with protective cover":
    "Lente em resina sintética com tampa de proteção",
  "Synthetic resin with protective cover":
    "Resina sintética com tampa de proteção",
  "Glass Lens":
    "Lente de vidro",
  "Available with or without cover":
    "Disponível com ou sem tampa",
  "180 degree/200 degree":
    "180 graus / 200 graus",
  "180° or 200°":
    "180° ou 200°",
  "35–55mm or 60–100mm":
    "35–55 mm ou 60–100 mm",
  "12mm, 14mm, 16mm":
    "12 mm, 14 mm, 16 mm",
  "12mm,14mm,16mm":
    "12 mm, 14 mm, 16 mm",
  "Provides wide-angle outdoor monitoring for enhanced door security":
    "Dá visão externa em grande angular, para mais segurança na porta",
  "Power and data transfer between door and frame":
    "Transferência de energia e dados entre a porta e o batente",
  "Rounded mounting tabs":
    "Abas de fixação arredondadas",
  "Concealed":
    "Oculto",
  "Non-handed":
    "Sem mão",
  "Door frame / door edge":
    "Batente / borda da porta",
  "Stainless steel 316":
    "Aço inoxidável 316",
  "Stainless steel 201":
    "Aço inoxidável 201",
  "Satin Stainless Steel 630/US32D":
    "Aço inoxidável acetinado 630/US32D",
  "Stain nickel":
    "Níquel acetinado",
  "0.88”":
    "0,88”",
  "0.67”":
    "0,67”",
  "ф44×24mm":
    "Ø44 × 24 mm",
  "42mm (L) × 35mm (H)":
    "42 mm (C) × 35 mm (A)",
  "110 mm (L) × 66 mm (W)":
    "110 mm (C) × 66 mm (L)",
  "103 mm × 66 mm":
    "103 mm × 66 mm",
  "115 mm (L) × 53 mm (W)":
    "115 mm (C) × 53 mm (L)",
  "22mm (L600) / Ø22mm (L900) / 30mm (L2000)":
    "22 mm (L600) / Ø22 mm (L900) / 30 mm (L2000)",
  "Ø19mm, oval":
    "Ø19 mm, oval",
  "26mm flat bar":
    "Barra chata de 26 mm",
  "40mm curved blade":
    "Lâmina curva de 40 mm",
  "42mm blade, Ø20mm column":
    "Lâmina de 42 mm, coluna Ø20 mm",
  "100mm at each end":
    "100 mm em cada extremidade",
  "16mm from each end":
    "16 mm de cada extremidade",
  "20mm square":
    "20 mm quadrado",
  "50mm square":
    "50 mm quadrado",
  "P1=750mm":
    "P1 = 750 mm",
  "550mm (300 + 250)":
    "550 mm (300 + 250)",
  "60mm or 70mm (2-3/8” or 2-3/4”)":
    "60 mm ou 70 mm (2-3/8” ou 2-3/4”)",
  "Glass Door Locks":
    "Fechaduras para porta de vidro",
  "Glass Door":
    "Porta de vidro",
  "Wooden Gates,window":
    "Portões de madeira, janela",
  "Stainless Steel/ Brass":
    "Aço inoxidável / latão",
  "Stainless Steel / Brass":
    "Aço inoxidável / latão",
  "SS/AB/SN/AC/PB are available":
    "SS/AB/SN/AC/PB disponíveis",
  "Iron body and 304 SS outer plates":
    "Corpo de ferro e placas externas em inox 304",
  "8in/10in/12in/24in":
    "8pol/10pol/12pol/24pol",
  "6in/8in/10in/12in/24in":
    "6pol/8pol/10pol/12pol/24pol",
  "3in/4in/5in/6in/8in/10in":
    "3pol/4pol/5pol/6pol/8pol/10pol",
  "3”, 4”, 5”, 6”, 8”, 10”":
    "3”, 4”, 5”, 6”, 8”, 10”",
  "Iron lock body, brass Cylinder(double cylinder), with 3pcs iron key.":
    "Corpo de fechadura em ferro, cilindro de latão (cilindro duplo), com 3 chaves de ferro.",
  "3 iron keys included":
    "Inclui 3 chaves de ferro",
  "2 nickel-plated brass keys included":
    "Inclui 2 chaves de latão niqueladas",
  "Suitable for left & right usage":
    "Serve para uso à esquerda e à direita",
  "Entrance doors":
    "Portas de entrada",
  "Blister or color box available,24 pcs/ctn G.W.:16KGS /CTN,N.W.:15KGS/CTN,":
    "Blister ou caixa colorida disponível, 24 peças/caixa. Peso bruto: 16 kg/caixa; peso líquido: 15 kg/caixa.",
  "Wooden Door / Metal Door / Furniture Door / Commercial Door / Residential / Commercial / Hotel / Office / Warehouse":
    "Porta de madeira / porta de metal / porta de móvel / porta comercial / residencial / comercial / hotel / escritório / galpão",
  "STOREROOM":
    "DEPÓSITO",
  "Satin Nickel, Chrome, Antique Brass, Polished Brass":
    "Níquel acetinado, cromado, latão antigo, latão polido",
  "PB/SB/AB/AC/CP other finish to order":
    "PB/SB/AB/AC/CP; outros acabamentos sob encomenda",
  "AB / AC / PB / SB / SS / SP / SC ；other available":
    "AB / AC / PB / SB / SS / SP / SC; outros disponíveis",
  "SC= Satin chrome":
    "SC = cromo acetinado",
  "SN=Satin Nickel":
    "SN = níquel acetinado",
  "White":
    "Branco",
  "White painted":
    "Pintado de branco",
  "Iron Door":
    "Porta de ferro",
  "Wooden Door":
    "Porta de madeira",
  "Iron and Brass":
    "Ferro e latão",
  "Stainless Steel 201/304":
    "Aço inoxidável 201/304",
  "Zinc alloy/304 Stainless steel":
    "Zamac / aço inoxidável 304",
  "double":
    "duplo",
  "3 Brass Keys":
    "3 chaves de latão",
  "Accepted":
    "Aceito",
  "Custom Logo Accepted":
    "Aceita marcação personalizada",
  "Security Hinge Butt Hinge":
    "Dobradiça de segurança, tipo comum",
  "Anti Theft Security Door Hinge":
    "Dobradiça de porta de segurança antifurto",
  "Anti Pry Anti Theft Reinforced Heavy Duty":
    "Antialavanca, antifurto, reforçada, serviço pesado",
  "Spring Hinge":
    "Dobradiça de mola",
  "Spring Butterfly Hinge / Self-Closing Hinge":
    "Dobradiça borboleta de mola / dobradiça com fechamento automático",
  "Continuous hinge (piano hinge)":
    "Dobradiça contínua (dobradiça piano)",
  "concealed hinge":
    "dobradiça oculta",
  "Self Closing / Adjustable Tension / 90° Positioning":
    "Fechamento automático / tensão regulável / retenção a 90°",
  "Self-Closing / Soft-Close Buffer / Multi-Angle Positioning":
    "Fechamento automático / amortecimento / retenção em vários ângulos",
  "Soft Closing / Quiet Operation / Corrosion Resistant / Heavy Duty":
    "Fechamento amortecido / operação silenciosa / resistente à corrosão / serviço pesado",
  "Thickened Solid Shaft Core":
    "Eixo maciço reforçado",
  "Matt black or polished brass finish over the iron leaf":
    "Acabamento preto fosco ou latão polido sobre a asa de ferro",
  "180 Degrees":
    "180 graus",
  "6 × ball bearing":
    "6 × rolamento",
  "Sheet Stamping":
    "Estampagem de chapa",
  "Screw-mounted":
    "Fixação por parafusos",
  "Mortise mounting":
    "Montagem embutida",
  "Recessed pull handle":
    "Puxador embutido",
  "Sliding and pocket doors":
    "Portas de correr e de embutir",
  "Fireproof doors":
    "Portas corta-fogo",
  "Window Connection":
    "Conexão de janela",
  "Window, Door / Residential, Commercial, Hotel, Office, Hospital, School, Warehouse":
    "Janela, porta / residencial, comercial, hotel, escritório, hospital, escola, galpão",
  "Room door, Entrance door.":
    "Porta de ambiente, porta de entrada.",
  "Ideal for bathrooms, living rooms, and more":
    "Indicado para banheiros, salas e outros ambientes",
  "Suitable for bathrooms, living rooms, and more":
    "Serve em banheiros, salas e outros ambientes",
  "Bathroom Bath Partition Hardware":
    "Ferragem para divisória de banheiro",
  "Household/ Hotel Bathroom":
    "Banheiro residencial / de hotel",
  "3M adhesive or screw installation":
    "Instalação com fita 3M ou parafusos",
  "3M adhesive or screw fixed":
    "Fixação com fita 3M ou parafusos",
  "Three square deadbolts, plus latch":
    "Três ferrolhos quadrados, mais o trinco",
  "6068 Mortise Lock Series":
    "Série de fechadura de embutir 6068",
  "100 pieces":
    "100 peças",
  "Customized Size Available":
    "Medida sob encomenda disponível",
  "Custom Sizes & Colors Available":
    "Medidas e cores sob encomenda disponíveis",
  "3 mm （Customizable）":
    "3 mm (sob medida)",
  "6*3*3mm（Customizable）":
    "6*3*3 mm (sob medida)",
  "53mm square":
    "53 mm quadrado",
  "45mm square":
    "45 mm quadrado",
  "36 mm (square)":
    "36 mm (quadrado)",
  "22mm, 8mm at the tip":
    "22 mm, 8 mm na ponta",
  "17 × 33mm, 10mm keyway":
    "17 × 33 mm, rasgo de chave de 10 mm",
  "60mm and 16mm":
    "60 mm e 16 mm",
  "80mm / 100mm (L) × 38mm (W) × 1.2mm (T)":
    "80 mm / 100 mm (C) × 38 mm (L) × 1,2 mm (E)",
  "70mm (L) × 48mm (W) × 1.0mm (T)":
    "70 mm (C) × 48 mm (L) × 1,0 mm (E)",
  "200 × 200 mm, 250 × 250 mm":
    "200 × 200 mm, 250 × 250 mm",
  "285mm (L) × 410mm (H)":
    "285 mm (C) × 410 mm (A)",
  "300mm,400mm,500mm,600mm":
    "300 mm, 400 mm, 500 mm, 600 mm",
  "The Rim door looks with double cylinder double throw. Dead bolt and latch bolt have triple guarantee.":
    "Fechadura de sobrepor com cilindro duplo e duplo avanço. A trava e o trinco têm tripla garantia.",
  "201 / 304 Stainless steel":
    "Aço inoxidável 201 / 304",
  "60 / 70 / 80 / 90 mm (Adjustable)":
    "60 / 70 / 80 / 90 mm (ajustável)",
  "Iron Body + Stainless Steel Faceplate":
    "Corpo de ferro + testa em aço inoxidável",
  "3.5”×3.5”×3.0mm / 4”×3”×3.0mm / 4”×4”×3.0mm (Custom Available)":
    "3,5”×3,5”×3,0 mm / 4”×3”×3,0 mm / 4”×4”×3,0 mm (sob medida disponível)",
  "Iron case, steel base internal components with zinc plated finish":
    "Caixa de ferro, componentes internos de base aço com acabamento zincado",
  "Iron case, steel base internal components with zinc plated finish, 3 pcs brass keys , brass latch and cylinder":
    "Caixa de ferro, componentes internos de base aço com acabamento zincado, 3 chaves de latão, trinco e cilindro de latão",
  "Iron case, steel base internal components with zinc plated, 3 pcs brass keys , brass latch and cylinder":
    "Caixa de ferro, componentes internos de base aço zincados, 3 chaves de latão, trinco e cilindro de latão",
  "Iron case, with 3 pcs brass keys , brass latch.":
    "Caixa de ferro, com 3 chaves de latão e trinco de latão.",
  "Iron case, with 3 pcs brass keys , zinc alloy latch and cylinder":
    "Caixa de ferro, com 3 chaves de latão, trinco e cilindro em zamac",
  "Fire door / Emergency exit door / Public building":
    "Porta corta-fogo / porta de saída de emergência / edifício público",
  "Fire Door, Exit Door, Steel Door, Public Access Door":
    "Porta corta-fogo, porta de saída, porta de aço, porta de acesso público",
  "Commercial Emergency Exit Door":
    "Porta de saída de emergência comercial",
  "Cold Storage Door, Freezer Door, Cold Chain Warehouse Door":
    "Porta de câmara fria, porta de freezer, porta de armazém de cadeia fria",
  "Wooden Doors / Metal Doors / Residential Doors":
    "Portas de madeira / portas de metal / portas residenciais",
  "Quick emergency release, safety push bar design":
    "Liberação rápida de emergência, barra de empurrar de segurança",
  "Push-to-Open Emergency Exit":
    "Saída de emergência do tipo empurre para abrir",
  "Emergency Escape, Quick Release":
    "Fuga de emergência, liberação rápida",
  "Key Access from Outside, Push Bar Exit from Inside":
    "Acesso por chave pelo lado de fora, saída pela barra por dentro",
  "No Key Required from Inside":
    "Sem necessidade de chave por dentro",
  "Press from Inside":
    "Pressione pelo lado de dentro",
  "Inside Release Push Bar":
    "Barra de liberação interna",
  "Inside Door Installation":
    "Instalação no lado interno da porta",
  "Surface-mounted, Horizontal Installation":
    "De sobrepor, instalação horizontal",
  "Built-in Alarm Function":
    "Função de alarme integrada",
  "External Lever Handle / Dogging Function":
    "Maçaneta externa / função de travamento aberto",
  "Top & Bottom Latching":
    "Travamento superior e inferior",
  "Single Door / Double Door":
    "Porta simples / porta dupla",
  "650mm / 800mm / 1000mm, Customizable":
    "650 mm / 800 mm / 1000 mm, sob medida",
  "Painted":
    "Pintado",
  "painting":
    "pintura",
  "Matt black":
    "Preto fosco",
  "Silver or Customized":
    "Prata ou sob medida",
  "Different colors available (customizable)":
    "Várias cores disponíveis (sob medida)",
  "Optional":
    "Opcional",
  "Aluminium":
    "Alumínio",
  "Iron+Iron tube":
    "Ferro + tubo de ferro",
  "PB brass polish":
    "PB latão polido",
  "1000 pieces":
    "1000 peças",
  "Blister or color box available,24 pcs/ctn":
    "Blister ou caixa colorida disponível, 24 peças/caixa",
  "Anti-Theft Rim Lock / Night Latch":
    "Fechadura de sobrepor antifurto",
  "Beveled latch design":
    "Trinco chanfrado",
  "3 or 5 keys available":
    "3 ou 5 chaves disponíveis",
  "Single or double brass cylinder, with self-locking function":
    "Cilindro de latão simples ou duplo, com função de autotravamento",
  "Double cylinder, solid brass cylinder plug":
    "Cilindro duplo, plugue de latão maciço",
  "Zinc die-cast outer case, zinc-plated steel internal components":
    "Caixa externa em zamac injetado, componentes internos em aço zincado",
  "25mm full-throw rim deadbolt":
    "Trava de sobrepor com avanço total de 25 mm",
  "Double side":
    "Dois lados",
  "Residential":
    "Residencial",
  "2-3/8\" (60mm)":
    "2-3/8” (60 mm)",
  "2-3/8＂(60mm)":
    "2-3/8” (60 mm)",
  /*
    2026-09-17. From `node scripts/translate-products-pt.mjs --all`, which counts every
    value the glossary could not translate and how many rows carry it.

    Two things stayed English on purpose and are NOT here:
      "Electroplatingbhgh."  — a typo in the source data, not a term. Translating it
                               would launder a defect into three languages.
      "Fabricada en lámina de acero 1.2 mm…" — SPANISH prose sitting in an ENGLISH
                               spec field on two records. That is a data bug for whoever
                               owns those records, not a translation gap.
  */

  /*
    2026-09-17. From `node scripts/translate-products-pt.mjs --all`, which counts every
    value the glossary could not translate and how many rows carry it.

    Two things stayed English on purpose and are NOT here:
      "Electroplatingbhgh."  — a typo in the source data, not a term. Translating it
                               would launder a defect into three languages.
      "Fabricada en lámina de acero 1.2 mm…" — SPANISH prose sitting in an ENGLISH
                               spec field on two records. That is a data bug for whoever
                               owns those records, not a translation gap.
  */
  "PB=Polish Brass":
    "PB = latão polido",
  "PB=polished brass":
    "PB = latão polido",
  "BN Black Nickle":
    "BN níquel preto",
  "SS/AC/AB/BN available":
    "SS/AC/AB/BN disponíveis",
  "1-3/8” to 1-3/4” (35mm–45mm)":
    "1-3/8” a 1-3/4” (35–45 mm)",
  "35–45mm (1-3/8” to 1-3/4”)":
    "35–45 mm (1-3/8” a 1-3/4”)",
  "25 × 25mm (square)":
    "25 × 25 mm (quadrado)",
  "22 × 22mm (square)":
    "22 × 22 mm (quadrado)",
  "Up and down: ±3.0mm; Left and right: +3.5/-2.0mm; Front and back: ±1.5mm":
    "Vertical: ±3,0 mm; lateral: +3,5/-2,0 mm; profundidade: ±1,5 mm",
  "Up and down: ±3.0mm; Left and right: ±3.0mm; Front and back: ±1.0mm":
    "Vertical: ±3,0 mm; lateral: ±3,0 mm; profundidade: ±1,0 mm",
  "Up and down: ±3.0mm; Left and right: ±2.0mm; Front and back: ±2.0mm":
    "Vertical: ±3,0 mm; lateral: ±2,0 mm; profundidade: ±2,0 mm",
  "Up and down: ±3.0mm; Left and right: ±2.0mm; Front and back: ±1.0mm":
    "Vertical: ±3,0 mm; lateral: ±2,0 mm; profundidade: ±1,0 mm",
  "50 pieces":
    "50 peças",
  "200 pieces":
    "200 peças",
  "500 pieces":
    "500 peças",
  "3M or Screws":
    "Fita 3M ou parafusos",
  "Bathroom":
    "Banheiro",
  "Wall Mounted":
    "Fixação na parede",
  "Aluminium Alloy":
    "Liga de alumínio",
  "Aluminum alloy and iron":
    "Liga de alumínio e ferro",
  "Aluminium alloy and iron":
    "Liga de alumínio e ferro",
  "Iron and aluminum":
    "Ferro e alumínio",
  "Iron and stainless steel":
    "Ferro e aço inoxidável",
  "Stainless steel+Iron":
    "Aço inoxidável + ferro",
  "Steel or stainless steel":
    "Aço ou aço inoxidável",
  "Stainless steel, brass, or steel":
    "Aço inoxidável, latão ou aço",
  "Stainless steel 304":
    "Aço inoxidável 304",
  "Steel":
    "Aço",
  "aluminium":
    "alumínio",
  "Spray Coated / Matte Black / Satin / Antique Finish":
    "Pintura a pó / preto fosco / acetinado / acabamento antigo",
  "Black / Silver / Bronze / Gold / Custom Finish":
    "Preto / prata / bronze / dourado / acabamento sob medida",
  "Satin / Chrome / Black / Gold (customizable":
    "Acetinado / cromado / preto / dourado (personalizável",
  "Satin / Plated Finish":
    "Acetinado / banhado",
  "Satin":
    "Acetinado",
  "Satin nickel, chrome, antique brass, polished brass, etc.":
    "Níquel acetinado, cromado, latão antigo, latão polido etc.",
  "Satin SS +Middle Part Acrylic":
    "Inox acetinado + centro em acrílico",
  "Aluminium, wooden and metal doors":
    "Portas de alumínio, madeira e metal",
  "Wooden doors":
    "Portas de madeira",
  "For privacy doors":
    "Para portas de banheiro",
  "For fire-rated metal or wood doors":
    "Para portas corta-fogo de metal ou madeira",
  "Fire-rated double escape doors":
    "Portas duplas de saída corta-fogo",
  "Door lock":
    "Fechadura de porta",
  "Four round bolts":
    "Quatro ferrolhos redondos",
  "Single action":
    "Ação simples",
  "Double-side":
    "Dois lados",
  "Single-side":
    "Um lado",
  "Single / Double cylinder, with self-locking function":
    "Cilindro simples / duplo, com função de autotravamento",
  "Up to 80mm":
    "Até 80 mm",
  "500mm (200 / 300 fixing)":
    "500 mm (fixação 200 / 300)",
  "900mm (adjustable)":
    "900 mm (ajustável)",
  "Trim handle · outside lever with key for panic exit devices":
    "Maçaneta externa · alavanca com chave para barras antipânico",
  "Trim handle · external handle for panic bar systems":
    "Maçaneta externa · maçaneta para sistemas de barra antipânico",
  "Keyed exterior trim":
    "Guarnição externa com chave",
  "Zinc alloy Cylinder":
    "Cilindro em zamac",
  "Aluminum alloy / Aluminium alloy for lock body, brass cylinder":
    "Liga de alumínio no corpo da fechadura, cilindro de latão",
  "Spray painting":
    "Pintura a pó",
  "Spray painting silver color":
    "Pintura a pó na cor prata",
  "Spray-painted silver, powder-coated iron":
    "Ferro com pintura a pó prata",
  "Paired with panic bar":
    "Combinada com barra antipânico",
  "Includes brass cylinder with key":
    "Inclui cilindro de latão com chave",
  "Profile lock case for panic exit devices":
    "Caixa de fechadura de perfil para barras antipânico",
  "Painted optional.":
    "Pintura opcional.",
  "painting red/ black or other finish also is available.":
    "pintura vermelha/preta ou outro acabamento também disponível.",
  "Red":
    "Vermelho",
  "Black+Red":
    "Preto + vermelho",
  "Two euro-profile apertures on the fire-rated case":
    "Duas aberturas de perfil europeu na caixa corta-fogo",
  "307 panic exit device":
    "Barra antipânico 307",
  "311 push bar, lock body, brass cylinder, stainless steel handle":
    "Barra 311, corpo de fechadura, cilindro de latão, maçaneta em aço inoxidável",
  "015 or 9080E.":
    "015 ou 9080E.",
  "Cylinder length according to the door thickness":
    "Comprimento do cilindro conforme a espessura da porta",
  "2.5 hours fire-resistant":
    "Resistência ao fogo de 2,5 horas",
  "Push bar, active and inactive leaf":
    "Barra de empurrar, folha ativa e passiva",
  "1.0 mm (Optional: 0.8 mm)":
    "1,0 mm (opcional: 0,8 mm)",
  "1.0 mm (also available in 0.8 mm)":
    "1,0 mm (também disponível em 0,8 mm)",
  "0.8 mm or 1.0 mm":
    "0,8 mm ou 1,0 mm",
  "10–12 mm glass doors":
    "Portas de vidro de 10–12 mm",
  "149mm at the head, 133mm at the foot — tapered":
    "149 mm na cabeça, 133 mm no pé — cônico",
  "32mm, tapering to 19mm":
    "32 mm, afinando para 19 mm",
  "32mm, tapering to 18.5mm":
    "32 mm, afinando para 18,5 mm",
  "72mm and 92mm (cylinder hole)":
    "72 mm e 92 mm (furo do cilindro)",
  "Iron + ABS body":
    "Corpo em ferro + ABS",
  "Iron with ABS material.":
    "Ferro com ABS.",
  "ABS material with Aluminum push bar":
    "ABS com barra de empurrar em alumínio",
  "ABS plastic material with Aluminum":
    "ABS com alumínio",
  "Building industry machinery":
    "Máquinas para a construção civil",
  "304SS / 304 Stainless Steel with Plated and suit for Panic Exit Device.":
    "Inox 304 banhado, indicado para barra antipânico.",
  "Aluminum Door Lock Body /American-Style/Lock Cylinder /Lock Case (Door Bolt)/Locks and Keys.":
    "Corpo de fechadura para porta de alumínio / padrão americano / cilindro / caixa de fechadura (ferrolho) / fechaduras e chaves.",
  "160&125mm":
    "160 e 125 mm",
  "10&32.5mm":
    "10 e 32,5 mm",
  "140&76mm":
    "140 e 76 mm",
  "8.5&38mm":
    "8,5 e 38 mm",
  "95&54mm":
    "95 e 54 mm",
  "10&28mm":
    "10 e 28 mm",
  "117&67mm":
    "117 e 67 mm",
  "10&40mm":
    "10 e 40 mm",
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
