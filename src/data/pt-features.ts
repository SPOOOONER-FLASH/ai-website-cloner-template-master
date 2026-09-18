/**
 * The product feature bullets, in Brazilian Portuguese.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS A SEPARATE FILE FROM pt-glossary.ts
 *
 * The glossary holds TERMS — a spec label, a finish name, a material. These are SENTENCES,
 * written by the client's own copywriter and cached from stahlock.com. They are a different
 * kind of thing with a different review process: a wrong glossary entry is a wrong word on
 * a hundred pages, and a wrong sentence here is a wrong claim on one.
 *
 * ---------------------------------------------------------------------------
 * ALL OR NOTHING, PER RECORD
 *
 * `scripts/translate-product-features-pt.mjs` writes `featuresPt` only when EVERY line of
 * a record resolves here. A record with four Portuguese bullets and two English ones is a
 * list that looks finished and is not — the same rule as the article bodies, applied one
 * level down.
 *
 * Until 2026-09-17 the component simply hid the whole block on any non-English page
 * (`{!es && product.features?.length ? …}` — a guard written for two locales, so Portuguese
 * took the English branch and showed English prose under Portuguese headings).
 *
 * ---------------------------------------------------------------------------
 * WHAT IS NOT TRANSLATED
 *
 * Figures, model numbers, standard designations and imperial twins are carried across
 * unchanged: "60mm (2-3/8”)" is the same measurement in every language, and a buyer
 * checking it against a drawing needs to see the same characters. Only the words move.
 */
export const FEATURE_LINES_PT: Record<string, string> = {
  /* Headings that structure the list. */
  "Introduction:": "Introdução:",
  Introduction: "Introdução",
  "Key Features:": "Principais características:",
  "Key Features": "Principais características",
  "Product Highlights": "Destaques do produto",
  "Technical Features": "Características técnicas",
  "Technical Specifications": "Especificações técnicas",
  "Technical Parameters": "Parâmetros técnicos",
  "Basic Specifications": "Especificações básicas",
  "Functionality:": "Funcionamento:",
  "Application:": "Aplicação:",
  "Construction": "Construção",
  "Robust Construction": "Construção robusta",
  "Keying Options:": "Opções de chaveamento:",
  "Strike Plate:": "Contra-testa:",
  "Enhanced Security:": "Segurança reforçada:",
  "Easy Installation:": "Instalação fácil:",
  "Easy Installation": "Instalação fácil",
  "Push Bar Features:": "Características da barra:",
  "Multifunctional Locking Options:": "Opções de travamento multifuncionais:",
  "Cylinder & Keys": "Cilindro e chaves",
  "Deadbolt Mechanism": "Mecanismo da trava",
  "Secure Deadbolt": "Trava segura",
  "Precision Cylinder": "Cilindro de precisão",
  "Reversible Design": "Projeto reversível",

  /* The most repeated body line in the catalogue — 32 records. */
  "Made from high-quality 304 stainless steel with material certification, this door handle is ideal for modern entry door locks. Contact us for more details.":
    "Fabricada em aço inoxidável 304 de alta qualidade com certificado de material, esta maçaneta é indicada para fechaduras de porta de entrada modernas. Fale conosco para mais detalhes.",

  "Functions: Entrance, Anti-Panic, Privacy, Passage, Storeroom, Deadlock, Classroom, Multi-Function":
    "Funções: entrada, antipânico, banheiro, passagem, depósito, trava, sala de aula, multifunção",
  "Options: 85 Series, 72 Series, and small-size lock cases available":
    "Opções: séries 85 e 72, e caixas de fechadura em tamanho reduzido",
  "Customization: Irregular sizes and custom dimensions supported for OEM & ODM":
    "Personalização: medidas fora de padrão e dimensões sob medida para OEM e ODM",
  "Exposed trim available in stainless steel or brass":
    "Guarnição aparente disponível em aço inoxidável ou latão",
  "Zinc-plated steel chassis and latch for corrosion resistance":
    "Chassi e trinco em aço zincado para resistência à corrosão",
  "Zinc-plated steel chassis and latch case for corrosion resistance":
    "Chassi e caixa do trinco em aço zincado para resistência à corrosão",
  "Zinc-plated steel latch and chassis for corrosion resistance":
    "Trinco e chassi em aço zincado para resistência à corrosão",
  "Zinc-plated steel latch and chassis for enhanced durability":
    "Trinco e chassi em aço zincado para maior durabilidade",
  "Zinc-plated steel chassis and latch for enhanced corrosion resistance":
    "Chassi e trinco em aço zincado para maior resistência à corrosão",
  "Door Thickness: Adjustable 35–45mm (1-3/8” to 1-3/4”)":
    "Espessura de porta: ajustável de 35–45 mm (1-3/8” a 1-3/4”)",
  "Door Thickness: Adjustable for 35–50mm (1-3/8” to 2”) doors":
    "Espessura de porta: ajustável para portas de 35–50 mm (1-3/8” a 2”)",
  "Door Thickness: Adjustable 35–50mm (1-3/8” to 2”)":
    "Espessura de porta: ajustável de 35–50 mm (1-3/8” a 2”)",
  "Key or thumb-turn locks/unlocks both knobs":
    "A chave ou o botão de giro trava e destrava os dois pomos",
  "Key or thumb-turn simultaneously locks/unlocks both knobs":
    "A chave ou o botão de giro trava e destrava os dois pomos ao mesmo tempo",
  "Key or thumb-turn locks/unlocks both handles":
    "A chave ou o botão de giro trava e destrava as duas maçanetas",
  "Lock/unlock both knobs via key or thumb-turn":
    "Trava e destrava os dois pomos por chave ou botão de giro",
  "Handing: Reversible for left or right hand doors":
    "Mão: reversível para portas de mão esquerda ou direita",
  "Handing: Reversible for left or right-hand doors":
    "Mão: reversível para portas de mão esquerda ou direita",
  "Handing: Fully reversible for left or right-hand doors":
    "Mão: totalmente reversível para portas de mão esquerda ou direita",
  "Handing: Fully reversible for left or right hand doors":
    "Mão: totalmente reversível para portas de mão esquerda ou direita",
  "Economical and easy to install": "Econômica e fácil de instalar",
  "Economical and easy to install, ideal for residential use":
    "Econômica e fácil de instalar, indicada para uso residencial",
  "Economical and easy to install, ideal for residential applications":
    "Econômica e fácil de instalar, indicada para aplicações residenciais",
  "Cost-effective and easy to install, ideal for residential use":
    "Boa relação custo-benefício e fácil de instalar, indicada para uso residencial",
  "Affordable and easy to install, ideal for residential applications":
    "Acessível e fácil de instalar, indicada para aplicações residenciais",
  "Economical Choice – Ideal for light-duty residential applications":
    "Opção econômica — indicada para aplicações residenciais de serviço leve",
  "Backset: Adjustable 60mm or 70mm (2-3/8” or 2-3/4”)":
    "Distância ao eixo: ajustável 60 mm ou 70 mm (2-3/8” ou 2-3/4”)",
  "Backset: Standard 60mm (2-3/8”); 70mm (2-3/4”) & 90mm (3-9/16”) optional":
    "Distância ao eixo: 60 mm (2-3/8”) padrão; 70 mm (2-3/4”) e 90 mm (3-9/16”) opcionais",
  "Backset: Standard 60mm (2-3/8”); optional 70mm (2-3/4”) and 90mm (3-9/16”)":
    "Distância ao eixo: 60 mm (2-3/8”) padrão; 70 mm (2-3/4”) e 90 mm (3-9/16”) opcionais",
  "Backset: 60mm or 70mm (2-3/8” or 2-3/4”) adjustable":
    "Distância ao eixo: 60 mm ou 70 mm (2-3/8” ou 2-3/4”), ajustável",
  "Backset: 60mm or 70mm (2-3/8” or 2-3/4”), adjustable":
    "Distância ao eixo: 60 mm ou 70 mm (2-3/8” ou 2-3/4”), ajustável",
  "Strike Plate: 57mm curved lip standard; 70mm optional":
    "Contra-testa: aba curva de 57 mm padrão; 70 mm opcional",
  "Strike Plate: 57mm curved lip standard, 70mm optional":
    "Contra-testa: aba curva de 57 mm padrão, 70 mm opcional",
  "Strike Options: 2-1/4” (57mm) curved lip standard; 2-3/4” (70mm) optional":
    "Opções de contra-testa: aba curva de 2-1/4” (57 mm) padrão; 2-3/4” (70 mm) opcional",
  "Supports master keying for family or facility use":
    "Aceita chave-mestra para uso familiar ou predial",
  "Available functions: Entrance, Privacy, Passage, Dummy":
    "Funções disponíveis: entrada, banheiro, passagem, cega",
  "Turn thumb-turn counterclockwise or key clockwise to lock; reverse to unlock":
    "Gire o botão no sentido anti-horário ou a chave no sentido horário para trancar; inverta para destrancar",
  "Rotate thumb-turn counterclockwise or key clockwise to lock; reverse to unlock":
    "Gire o botão no sentido anti-horário ou a chave no sentido horário para trancar; inverta para destrancar",
  "Locking: turn thumb-turn counter-clockwise or key clockwise; reverse to unlock":
    "Travamento: gire o botão no sentido anti-horário ou a chave no sentido horário; inverta para destravar",
  "Simple operation: turn to lock or unlock":
    "Operação simples: gire para trancar ou destrancar",
  "Multiple color options available": "Várias opções de cor disponíveis",
  "Multiple color options": "Várias opções de cor",
  "Available in multiple colors": "Disponível em várias cores",
  "Various color options": "Diversas opções de cor",
  "Available in various colors": "Disponível em diversas cores",
  "Key-operated locking/unlocking": "Travamento e destravamento por chave",
  "– 1/2” (13mm) latch bolt extension": "– Avanço do trinco de 1/2” (13 mm)",
  "– Adjustable backset: 2-3/8” or 2-3/4” (60mm or 70mm)":
    "– Distância ao eixo ajustável: 2-3/8” ou 2-3/4” (60 mm ou 70 mm)",
  "– Fits standard 2” (51mm) cross bore":
    "– Serve no furo padrão de 2” (51 mm)",
  "– Fits door thickness: 1-3/8” to 1-3/4” (35–45mm)":
    "– Serve em portas de 1-3/8” a 1-3/4” (35–45 mm)",
  "Durable design with over 200,000 life cycles":
    "Projeto durável, com mais de 200.000 ciclos de vida",
  "Durable Performance – Tested for 200,000+ cycles":
    "Desempenho durável — ensaiada a mais de 200.000 ciclos",
  "Durable Use – Tested for over 200,000 life cycles":
    "Uso durável — ensaiada a mais de 200.000 ciclos de vida",
  "200,000+ cycle durability": "Durabilidade acima de 200.000 ciclos",
  "Can be keyed alike with deadbolts for enhanced security":
    "Pode ser chaveada igual às travas para maior segurança",
  "Can be keyed alike or master keyed":
    "Pode ser chaveada igual ou em sistema de chave-mestra",
  "Stainless Steel Hinge (Loose Pin)": "Dobradiça em inox (pino solto)",
  "Adjustable spindle length based on door thickness":
    "Comprimento do quadrado ajustável conforme a espessura da porta",
  "Adjustable length based on door thickness":
    "Comprimento ajustável conforme a espessura da porta",
  "Adjustable length to suit door thickness":
    "Comprimento ajustável conforme a espessura da porta",
  "Adjustable length based on door width":
    "Comprimento ajustável conforme a largura da porta",
  "Adjustable length to fit various door widths":
    "Comprimento ajustável para diversas larguras de porta",
  "Adjustable length to fit various door sizes":
    "Comprimento ajustável para diversos tamanhos de porta",
  "Adjustable length to fit door width":
    "Comprimento ajustável conforme a largura da porta",
  "Latch Bolt: 12mm (1/2”) throw, dead-locking on keyed models":
    "Trinco: avanço de 12 mm (1/2”), com travamento nos modelos com chave",
  "Latch Bolt: 12mm (1/2”) throw, dead-locking for keyed models":
    "Trinco: avanço de 12 mm (1/2”), com travamento nos modelos com chave",
  "Latch Bolt: 1/2” (12mm) throw with deadlocking for keyed functions":
    "Trinco: avanço de 1/2” (12 mm) com travamento nas funções com chave",
  "Latch Bolt: 12mm (1/2”) throw, deadlocking for keyed functions":
    "Trinco: avanço de 12 mm (1/2”), com travamento nas funções com chave",
  "Latch Bolt: 12mm (1/2”) throw; dead-locking for keyed versions":
    "Trinco: avanço de 12 mm (1/2”); com travamento nas versões com chave",
  "Latch: 12mm (1/2”) throw, dead-locking for keyed functions":
    "Trinco: avanço de 12 mm (1/2”), com travamento nas funções com chave",
  "Deadlocking latch bolt": "Trinco com travamento",
  "• Keyed alike with deadbolt series": "• Chaveamento igual com a linha de travas",
  "• Group keying for convenience": "• Chaveamento por grupo, por conveniência",
  "• Master keyed for facility or family use":
    "• Chave-mestra para uso predial ou familiar",
  "• Compatible with deadbolts for enhanced security":
    "• Compatível com travas para maior segurança",
  "• Supports keyed-alike groups": "• Aceita grupos chaveados iguais",
  "• Master keying available for family or facility use":
    "• Chave-mestra disponível para uso familiar ou predial",
  "Flexible Keying –": "Chaveamento flexível —",
  "Corrosion Resistance – Zinc-plated solid steel chassis & latch case":
    "Resistência à corrosão — chassi e caixa do trinco em aço maciço zincado",
  "Corrosion Resistant – Zinc-plated steel chassis and latch case":
    "Resistente à corrosão — chassi e caixa do trinco em aço zincado",
  "High-Security Cylinder – 5-pin tumbler with brass plug and 2 nickel-plated brass keys":
    "Cilindro de alta segurança — pino tambor de 5 pinos com plugue de latão e 2 chaves de latão niqueladas",
  "Secure Cylinder – 5-pin tumbler with brass plug and 2 nickel-plated brass keys":
    "Cilindro seguro — pino tambor de 5 pinos com plugue de latão e 2 chaves de latão niqueladas",
  "Trim Material – Electroplated zinc die-cast or solid brass":
    "Material da guarnição — zamac injetado eletrogalvanizado ou latão maciço",
  "Refined Appearance – Zinc die-cast or solid brass trim with electroplated finish":
    "Aparência refinada — guarnição em zamac injetado ou latão maciço com acabamento eletrogalvanizado",
  "Optional: 1” round drive-in 4-way latch":
    "Opcional: trinco redondo de 1” de encaixe, 4 posições",
  "Optional: 1” round drive-in 4-way latch available":
    "Opcional: trinco redondo de 1” de encaixe, 4 posições, disponível",
  "Optional Latch: 1” round drive-in 4-way latch (upon request)":
    "Trinco opcional: redondo de 1” de encaixe, 4 posições (sob consulta)",
  "Drive-In Latch: Optional 1” round 4-way latch":
    "Trinco de encaixe: opcional, redondo de 1”, 4 posições",
  "Interior parts: Zinc-plated steel": "Peças internas: aço zincado",
  "Internal parts made of zinc-plated steel for durability":
    "Peças internas em aço zincado para durabilidade",
  "Exterior trim: Available in stainless steel, brass, or steel":
    "Guarnição externa: disponível em aço inoxidável, latão ou aço",
  "Exterior trim available in stainless steel, brass, or steel":
    "Guarnição externa disponível em aço inoxidável, latão ou aço",
  "Free-turning cylinder trim resists wrench attacks":
    "Colar de cilindro que gira livre, resistente a ataque com grifa",
  "Free-spinning cylinder trim protects against wrench attacks":
    "Colar de cilindro que gira livre, protege contra ataque com grifa",
  "1” (25mm) zinc die-cast bolt": "Ferrolho de 1” (25 mm) em zamac injetado",
  "1-inch (25mm) throw bolt made of zinc alloy":
    "Ferrolho com avanço de 1 polegada (25 mm) em zamac",
  "Hardened steel roller insert enhances resistance to sawing":
    "Pino rolete de aço temperado aumenta a resistência ao corte por serra",
  "Hardened steel roller insert improves anti-sawing performance":
    "Pino rolete de aço temperado melhora o desempenho antisserra",
  "5-pin tumbler mechanism, easy to rekey":
    "Mecanismo de pino tambor de 5 pinos, fácil de repinar",
  "5-pin tumbler system, easy to rekey":
    "Sistema de pino tambor de 5 pinos, fácil de repinar",
  "Solid brass plug": "Plugue de latão maciço",
  "Solid brass plug with two nickel-plated brass keys included":
    "Plugue de latão maciço, com duas chaves de latão niqueladas incluídas",
  "Includes two nickel-plated brass keys":
    "Inclui duas chaves de latão niqueladas",
  "Fully reversible handing": "Mão totalmente reversível",
  "Ideal for left or right door installation without extra adjustment":
    "Indicada para instalação em porta esquerda ou direita sem ajuste adicional",
  "Universal handing, suitable for both left-hand and right-hand doors":
    "Mão universal, serve em portas de mão esquerda e direita",
  "No need to specify when ordering — field-reversible":
    "Não precisa ser indicada no pedido — reversível na obra",
  "Compatible with standard wooden or metal doors":
    "Compatível com portas padrão de madeira ou metal",
  "Adjustable to fit a wide range of door thicknesses and backsets":
    "Ajustável para uma ampla faixa de espessuras de porta e distâncias ao eixo",
  "• Iron backplate with aluminum alloy lever handle":
    "• Espelho de ferro com maçaneta em liga de alumínio",
  "• Elegant twisted handle design": "• Desenho de maçaneta torcida, elegante",
  "• Matte black finish, durable and corrosion-resistant":
    "• Acabamento preto fosco, durável e resistente à corrosão",
  "• Compatible with Euro profile cylinder mortise locks":
    "• Compatível com fechaduras de embutir de cilindro europeu",
  "• Suitable for wooden and metal doors":
    "• Indicada para portas de madeira e de metal",
  "• Reversible handle for left or right opening doors":
    "• Maçaneta reversível para portas de abertura esquerda ou direita",
  "• Easy installation and maintenance": "• Instalação e manutenção fáceis",
  "Trim options: wrought stainless steel or brass":
    "Opções de guarnição: aço inoxidável conformado ou latão",
  "Optional flat strike for outward-opening doors (not recommended)":
    "Contra-testa plana opcional para portas de abertura para fora (não recomendada)",
  "Optional: Flat strike for outward-opening doors (not recommended)":
    "Opcional: contra-testa plana para portas de abertura para fora (não recomendada)",
  "Standard: Angled strike for inward-opening doors":
    "Padrão: contra-testa angular para portas de abertura para dentro",
  "Angled strike standard for inward-opening doors":
    "Contra-testa angular padrão para portas de abertura para dentro",
  "Security: High-security design with anti-theft protection":
    "Segurança: projeto de alta segurança com proteção antifurto",
  "Two-point locking system": "Sistema de travamento de dois pontos",
  "Traditional European design, non-handed":
    "Desenho europeu tradicional, sem mão",
  "Square spindle: 8×8mm or 9×9mm": "Quadrado: 8×8 mm ou 9×9 mm",
  "Single Cylinder: Operated by key and inside knob, with anti-pick slide gate":
    "Cilindro simples: acionado por chave e pelo pomo interno, com lingueta antiabertura",
  "Single Cylinder: Operated by key and inside knob; includes anti-pick slide gate":
    "Cilindro simples: acionado por chave e pelo pomo interno; inclui lingueta antiabertura",
  "Double Cylinder: Operated by key from both inside and outside":
    "Cilindro duplo: acionado por chave por dentro e por fora",
  "Durable construction with an attractive finish":
    "Construção durável com acabamento atraente",
  "Double cylinder, double-throw rim lock":
    "Fechadura de sobrepor de cilindro duplo e duplo avanço",
  "Triple security: anti-pry, anti-inside unlock without key, and anti-removal from inside when locked":
    "Tripla segurança: antialavanca, impede destravar por dentro sem chave e impede a remoção pelo lado interno quando trancada",
  "Suitable for wooden or iron doors": "Indicada para portas de madeira ou de ferro",
  "Suitable for wooden or metal doors (interior/exterior)":
    "Indicada para portas de madeira ou de metal (interna/externa)",
  "Secure deadbolt and bronze slide latch system":
    "Trava segura e sistema de lingueta deslizante em bronze",
  "Includes rectangular steel pin for added strength":
    "Inclui pino retangular de aço para maior resistência",
  "Classic key operation with separate cylinder":
    "Operação clássica por chave, com cilindro separado",
  "Available in standard and economy versions":
    "Disponível nas versões padrão e econômica",
  "Ideal for bedrooms and privacy rooms":
    "Indicada para quartos e ambientes de privacidade",
  "Button-lock mechanism: press to lock, release to unlock":
    "Mecanismo de botão: pressione para trancar, solte para destrancar",
  "Durable, heavy-duty construction": "Construção durável, de serviço pesado",
  "Multiple finishes available to match interior styles":
    "Vários acabamentos disponíveis para combinar com o estilo do ambiente",

  "US type 3-latch construction, long-lasting performance":
    "Construção com trinco tipo US 3, de longa durabilidade",
  "Zinc alloy handle & rose, strong and durable":
    "Maçaneta e roseta em zamac, resistentes e duráveis",
  "Corrosion-resistant plated finish":
    "Acabamento banhado resistente à corrosão",
  "Smooth turning, comfortable to operate":
    "Giro suave, confortável de operar",
  "Easy installation with universal standard fitting":
    "Instalação fácil, com encaixe padrão universal",
  "Ideal for residential and commercial interior doors":
    "Indicada para portas internas residenciais e comerciais",
  "Made of high-grade 304 stainless steel for durability and corrosion resistance":
    "Fabricada em aço inoxidável 304 de alta qualidade, para durabilidade e resistência à corrosão",
  "Compatible with lock cases and profile cylinders":
    "Compatível com caixas de fechadura e cilindros de perfil",
  "Ideal for fire-rated doors":
    "Indicada para portas corta-fogo",
  "Combines strength, security, and modern design—popular in the South American market":
    "Combina resistência, segurança e desenho moderno — popular no mercado sul-americano",
  "Optional configurations: Single or Double Cylinder":
    "Configurações opcionais: cilindro simples ou duplo",
  "• Durable iron lock body for enhanced strength and stability":
    "• Corpo de fechadura em ferro, para maior resistência e estabilidade",
  "• American-style brass cylinder for smooth key operation":
    "• Cilindro de latão no padrão americano, para giro suave da chave",
  "• Multiple bolt configurations to meet different door requirements":
    "• Várias configurações de ferrolho, para diferentes exigências de porta",
  "• Concealed structure for clean appearance and secure installation":
    "• Estrutura oculta, para aparência limpa e instalação segura",
  "• Suitable for aluminum narrow doors and commercial door systems":
    "• Indicada para portas de alumínio de montante estreito e sistemas comerciais",
  "• OEM / ODM customization available":
    "• Personalização OEM / ODM disponível",
  "This concealed lock body is designed for aluminum narrow doors and commercial applications.":
    "Esta caixa de fechadura oculta foi projetada para portas de alumínio de montante estreito e aplicações comerciais.",
  "It features an American-style brass lock cylinder and a durable iron lock body, offering stable performance, smooth operation, and long service life.":
    "Traz cilindro de latão no padrão americano e corpo de fechadura em ferro, oferecendo desempenho estável, operação suave e longa vida útil.",
  "Widely used for aluminum doors, narrow frame doors, and fast-food restaurant door systems such as KFC lock bodies.":
    "Muito usada em portas de alumínio, portas de perfil estreito e sistemas de porta de restaurantes de serviço rápido.",
  "Designed for use with panic exit devices":
    "Projetada para uso com barras antipânico",
  "Durable plated 304SS construction for corrosion resistance and fire door compatibility":
    "Construção em inox 304 banhado, resistente à corrosão e compatível com porta corta-fogo",
  "Made of durable zinc alloy with a painted finish, the body and lever handle offer excellent strength and durability. The iron spindle ensures smooth, reliable operation.":
    "Em zamac com acabamento pintado, o corpo e a maçaneta oferecem excelente resistência e durabilidade. O quadrado de ferro garante operação suave e confiável.",
  "External lever handle for panic exit device":
    "Maçaneta externa para barra antipânico",
  "External lever handle for panic exit devices":
    "Maçaneta externa para barras antipânico",
  "External lever handle for panic device":
    "Maçaneta externa para dispositivo antipânico",
  "External lever handle for panic bar":
    "Maçaneta externa para barra antipânico",
  "External handle for panic bar systems":
    "Maçaneta externa para sistemas de barra antipânico",
  "Key-operated lock/unlock":
    "Travamento e destravamento por chave",
  "Standards: ANSI Grade 2":
    "Normas: ANSI Grade 2",
  "Durable security handle for panic exit devices":
    "Maçaneta de segurança durável para barras antipânico",
  "Compatible with cylinder lock/unlock systems":
    "Compatível com sistemas de travamento por cilindro",
  "Suitable for various push bar types":
    "Serve em diversos tipos de barra de empurrar",
  "Security trim with cylinder for panic devices":
    "Guarnição de segurança com cilindro para dispositivos antipânico",
  "Durable construction with customizable appearance":
    "Construção durável, com aparência personalizável",
  "• Suit for mortise type lock body":
    "• Serve em caixa de fechadura de embutir",
  "• Iron bar: 9×9×130mm":
    "• Barra de ferro: 9×9×130 mm",
  "• Backset: 65mm":
    "• Distância ao eixo: 65 mm",
  "• Center Distance: 72mm":
    "• Distância entre centros: 72 mm",
  "• Color: Painted optional":
    "• Cor: pintura opcional",
  "Crafted from premium SUS304 stainless steel, this handle offers a sleek and elegant look for glass entry doors.":
    "Fabricado em aço inoxidável SUS304 de primeira linha, este puxador dá um visual limpo e elegante a portas de entrada em vidro.",
  "Durable, corrosion-resistant, and easy to install.":
    "Durável, resistente à corrosão e fácil de instalar.",
  "Compatible with most standard locks and easily interchangeable with other handle designs.":
    "Compatível com a maioria das fechaduras padrão e facilmente intercambiável com outros desenhos de puxador.",
  "Premium-grade SUS304 stainless steel handle, designed to add a modern, elegant touch to glass entry doors.":
    "Puxador em aço inoxidável SUS304 de primeira linha, para dar um toque moderno e elegante a portas de entrada em vidro.",
  "Durable, corrosion-resistant, and safe for long-term use.":
    "Durável, resistente à corrosão e seguro para uso prolongado.",
  "Easy to install—compatible with existing lock holes and supports handle replacements in various finishes or styles.":
    "Fácil de instalar — compatível com os furos de fechadura existentes e aceita troca de puxador em diversos acabamentos ou estilos.",
  "Elegant and durable SUS304 stainless steel handle for glass doors.":
    "Puxador elegante e durável em aço inoxidável SUS304 para portas de vidro.",
  "Easy to install, corrosion-resistant, and compatible with most standard lock replacements.":
    "Fácil de instalar, resistente à corrosão e compatível com a maioria das trocas de fechadura padrão.",
  "Ideal for modern entryways requiring both aesthetics and functionality.":
    "Indicado para entradas modernas que exigem estética e funcionalidade.",
  "High-quality SUS304 stainless steel handle with a refined satin and polished finish.":
    "Puxador em aço inoxidável SUS304 de alta qualidade, com acabamento acetinado e polido refinado.",
  "Elegant and secure, easy to install on glass doors without modification.":
    "Elegante e seguro, fácil de instalar em portas de vidro sem modificação.",
  "Compatible with standard lock systems and ideal for upgrading door aesthetics.":
    "Compatível com sistemas de fechadura padrão e indicado para melhorar a estética da porta.",
  "Elegant SUS304 stainless steel handle with an acrylic center for a modern look.":
    "Puxador elegante em aço inoxidável SUS304 com centro em acrílico, de visual moderno.",
  "Durable, safe, and easy to install on glass doors without drilling.":
    "Durável, seguro e fácil de instalar em portas de vidro sem furação.",
  "Compatible with most lock systems for easy replacement and upgrade.":
    "Compatível com a maioria dos sistemas de fechadura, para troca e atualização fáceis.",
  "Supports electric and manual operation":
    "Aceita operação elétrica e manual",
  "Supports both electric and manual operation":
    "Aceita operação elétrica e manual",
  "Anti-tamper security with signal feedback to prevent unauthorized unlocking":
    "Segurança antiviolação com sinal de retorno, para impedir destravamento não autorizado",
  "Anti-unlock protection with signal feedback for enhanced security":
    "Proteção contra destravamento com sinal de retorno, para maior segurança",
  "Ideal for intercom and access control systems":
    "Indicada para sistemas de interfone e controle de acesso",
  "Ideal for intercom or access control systems":
    "Indicada para sistemas de interfone ou controle de acesso",
  "Suitable for homes, apartments, hotels, warehouses, schools, and institutions":
    "Indicada para casas, apartamentos, hotéis, galpões, escolas e instituições",
  "Suitable for homes, apartments, hotels, warehouses, schools, and public buildings":
    "Indicada para casas, apartamentos, hotéis, galpões, escolas e edifícios públicos",
  "Modern Zinc Alloy Bathroom Indicator Lock designed for toilet cubicle doors, restroom partitions, and privacy doors.":
    "Indicador de banheiro moderno em zamac, projetado para portas de box, divisórias de sanitário e portas de privacidade.",
  "The vacant (green) and occupied (red) indicator clearly shows room availability, improving privacy and convenience in public restroom applications.":
    "O indicador de livre (verde) e ocupado (vermelho) mostra com clareza a disponibilidade do ambiente, melhorando a privacidade e a conveniência em banheiros públicos.",
  "Made of durable zinc alloy with a smooth satin finish, this Bathroom Indicator Lock offers corrosion resistance, stable performance, and long service life.":
    "Em zamac durável com acabamento acetinado liso, este indicador de banheiro oferece resistência à corrosão, desempenho estável e longa vida útil.",
  "The surface-mounted structure allows quick and easy installation.":
    "A estrutura de sobrepor permite instalação rápida e fácil.",
  "Suitable for hotels, offices, shopping malls, hospitals, schools, airports, restaurants, and commercial restroom projects.":
    "Indicado para hotéis, escritórios, shoppings, hospitais, escolas, aeroportos, restaurantes e projetos de banheiro comercial.",
  "• Vacant / Occupied Indicator":
    "• Indicador livre / ocupado",
  "• Smooth Slide Bolt Operation":
    "• Ferrolho deslizante de operação suave",
  "• Durable Zinc Alloy Construction":
    "• Construção durável em zamac",
  "• Easy Surface-Mounted Installation":
    "• Instalação de sobrepor, fácil",
  "• Commercial Bathroom Hardware Solution":
    "• Solução de ferragem para banheiro comercial",
  "OEM & ODM customization available.":
    "Personalização OEM e ODM disponível.",
  "Mortise lock design":
    "Projeto de fechadura de embutir",
  "Exposed press-type push bar":
    "Barra de empurrar aparente, tipo pressão",
  "One-point locking system":
    "Sistema de travamento de um ponto",
  "One-point locking mechanism":
    "Mecanismo de travamento de um ponto",
  "Single-point locking system":
    "Sistema de travamento de ponto único",
  "Exposed design with semi-length push bar":
    "Projeto aparente com barra de meia largura",
  "Suitable for left- and right-hand doors":
    "Serve em portas de mão esquerda e direita",
  "Color and length customizable":
    "Cor e comprimento personalizáveis",
  "External access via cylinder with 3 keys":
    "Acesso externo por cilindro, com 3 chaves",
  "Internal touch bar ensures safe and quick emergency exit":
    "A barra de toque interna garante saída de emergência segura e rápida",
  "Exposed half-arm steel body design":
    "Projeto de corpo em aço, meio braço, aparente",
  "Adjustable length and bolt height to fit various door sizes":
    "Comprimento e altura do ferrolho ajustáveis para diversos tamanhos de porta",
  "Safety lock mechanism":
    "Mecanismo de travamento de segurança",
  "Exposed type design":
    "Projeto do tipo aparente",
  "Full-length push bar":
    "Barra de empurrar de largura total",
  "90-minute fire resistance tested":
    "Ensaiada para 90 minutos de resistência ao fogo",
  "Turn handle for locking/unlocking":
    "Maçaneta de giro para travar e destravar",
  "Integrated lock and counter lock system":
    "Sistema integrado de fechadura e contrafechadura",
  "1. Lock/unlock via turn handle":
    "1. Trava e destrava pela maçaneta de giro",
  "2. Adjustable length to fit door width":
    "2. Comprimento ajustável conforme a largura da porta",
  "3. Multiple color options":
    "3. Várias opções de cor",
  "4. Integrated lock and counter lock system":
    "4. Sistema integrado de fechadura e contrafechadura",
  "• Lock Case: 072":
    "• Caixa de fechadura: 072",
  "• Handle Options: 015 or 9080E":
    "• Opções de maçaneta: 015 ou 9080E",
  "• Cylinder: Customized length per door thickness":
    "• Cilindro: comprimento sob medida conforme a espessura da porta",
  "Suitable for steel, aluminum, or wooden double-leaf and fire doors":
    "Indicada para portas de duas folhas e corta-fogo em aço, alumínio ou madeira",
  "Anti-slip push bar for fast, safe egress in emergencies":
    "Barra de empurrar antiderrapante, para saída rápida e segura em emergências",
  "Accessible to children, elderly, or injured—no key required":
    "Acessível a crianças, idosos ou feridos — sem necessidade de chave",
  "Ideal for high-traffic public buildings: schools, hospitals, malls, airports, etc.":
    "Indicada para edifícios públicos de grande fluxo: escolas, hospitais, shoppings, aeroportos etc.",
  "Compatible with steel, aluminum, or wooden doors":
    "Compatível com portas de aço, alumínio ou madeira",
  "Suitable for single-leaf and fire doors":
    "Indicada para portas de folha simples e corta-fogo",
  "Suitable for fire-rated double doors":
    "Indicada para portas duplas corta-fogo",
  "Designed for high-traffic areas: schools, hospitals, malls, factories, airports, etc.":
    "Projetada para áreas de grande fluxo: escolas, hospitais, shoppings, fábricas, aeroportos etc.",
  "Anti-slip bar ensures safe and quick exit during emergencies":
    "A barra antiderrapante garante saída segura e rápida em emergências",
  "Easy operation—accessible to children, the elderly, or injured persons without a key":
    "Operação fácil — acessível a crianças, idosos ou feridos sem chave",
  "Suitable for handed or non-handed installation":
    "Serve em instalação com ou sem mão definida",
  "• Key-operated locking from both sides; handle and key access from outside, panic push-bar from inside":
    "• Travamento por chave pelos dois lados; acesso por maçaneta e chave por fora, barra antipânico por dentro",
  "• Key locks from outside only; unlocks via handle/key outside and panic device inside":
    "• Trava por chave só pelo lado de fora; destrava por maçaneta/chave por fora e pelo antipânico por dentro",
  "• Key retracts latch bolt from outside; opens with panic bar from inside":
    "• A chave recolhe o trinco por fora; abre pela barra antipânico por dentro",
  "• Center distance optional 72mm / 92mm":
    "• Distância entre centros opcional 72 mm / 92 mm",
  "• Spindle size 9mm.":
    "• Quadrado de 9 mm.",
  "• EN1125 certified, durability tested >300,000 cycles":
    "• Certificada EN 1125, durabilidade ensaiada a mais de 300.000 ciclos",
  "• Suitable for single & double doors":
    "• Serve em portas simples e duplas",
  "• Reversible for left/right handing,no orientation required":
    "• Reversível para mão esquerda/direita, sem necessidade de indicar orientação",
  "• Max door weight: ≥200kg":
    "• Peso máximo da porta: ≥200 kg",
  "• Max door height: 2520mm":
    "• Altura máxima da porta: 2520 mm",
  "• Max door width: 1500mm":
    "• Largura máxima da porta: 1500 mm",
  "• Working temperature: -10°C ~ +60°C":
    "• Temperatura de trabalho: -10 °C ~ +60 °C",
  "• Supports DIN left/right door installation":
    "• Aceita instalação DIN esquerda/direita",
  "• One push to open – fast evacuation":
    "• Um empurrão para abrir — evacuação rápida",
  "• Robust structure with high load resistance for long-term reliability":
    "• Estrutura robusta, com alta resistência a carga, para confiabilidade de longo prazo",
  "• Easy installation with wide compatibility":
    "• Instalação fácil, com ampla compatibilidade",
  "• Supports top & bottom bolt linkage for double door systems":
    "• Aceita acionamento de ferrolhos superior e inferior em sistemas de porta dupla",
  "Suitable for emergency exit doors, fire doors, smoke control doors":
    "Indicada para portas de saída de emergência, portas corta-fogo e portas corta-fumaça",
  "Recommended for high-traffic public areas:":
    "Recomendada para áreas públicas de grande fluxo:",
  "Shopping malls / Hospitals / Schools / Cinemas / Stadiums / Office buildings / Exhibition centers / Airports / Metro & transport hubs":
    "Shoppings / Hospitais / Escolas / Cinemas / Estádios / Edifícios de escritórios / Centros de exposições / Aeroportos / Metrô e terminais de transporte",
  "The product features a built-in alarm function. When the alarm mode is activated, pressing the push bar will trigger the alarm, helping improve safety control and prevent unauthorized use.":
    "O produto tem função de alarme integrada. Com o modo de alarme ativado, pressionar a barra dispara o alarme, ajudando no controle de segurança e evitando uso não autorizado.",
  "It is widely used in hotels, hospitals, schools, offices, shopping malls, factories, warehouses, and other public buildings.":
    "É muito usada em hotéis, hospitais, escolas, escritórios, shoppings, fábricas, galpões e outros edifícios públicos.",
  "Suitable for shopping malls, hotels, schools, hospitals, office buildings, warehouses, factories, and other commercial spaces.":
    "Indicada para shoppings, hotéis, escolas, hospitais, edifícios de escritórios, galpões, fábricas e outros espaços comerciais.",
  "Ideal for shopping malls, schools, hospitals, hotels, office buildings, factories, warehouses, and other commercial or public facilities.":
    "Indicada para shoppings, escolas, hospitais, hotéis, edifícios de escritórios, fábricas, galpões e outras instalações comerciais ou públicas.",
  "It helps reduce the risk of people being trapped inside cold rooms. An optional outside handle is available for daily door operation.":
    "Ajuda a reduzir o risco de pessoas ficarem presas dentro de câmaras frias. Há maçaneta externa opcional para a operação diária da porta.",

  "3-point locking system":
    "Sistema de travamento de três pontos",
  "Available in single or double-sided operation":
    "Disponível com operação de um lado ou dos dois",
  "Finishes: PB, CP, SS, SC, AB, AC":
    "Acabamentos: PB, CP, SS, SC, AB, AC",
  "Supplied with 3 or 5 keys; computer keys optional":
    "Fornecida com 3 ou 5 chaves; chaves computadorizadas opcionais",
  "Angled strike (standard) for inward-opening doors":
    "Contra-testa angular (padrão) para portas de abertura para dentro",
  "Single Cylinder: Key and inside knob operate latch, with anti-pick slide gate":
    "Cilindro simples: chave e pomo interno acionam o trinco, com lingueta antiabertura",
  "Double Cylinder: Key operation from both sides":
    "Cilindro duplo: operação por chave pelos dois lados",
  "Double Cylinder: Operated by key on both sides":
    "Cilindro duplo: acionado por chave pelos dois lados",
  "Double Cylinder: Operated by key from both sides":
    "Cilindro duplo: acionado por chave pelos dois lados",
  "Security: High-security, anti-theft performance":
    "Segurança: desempenho de alta segurança, antifurto",
  "Security: High protection against theft with self-locking option":
    "Segurança: alta proteção contra furto, com opção de autotravamento",
  "Lock Function:":
    "Função da fechadura:",
  "This anti-theft rim lock night latch is designed for surface-mounted door installation, providing dependable security for residential applications.":
    "Esta fechadura de sobrepor antifurto foi projetada para instalação na face da porta, oferecendo segurança confiável em aplicações residenciais.",
  "The lock cylinder features an aluminum outer housing with a brass core, delivering consistent key rotation and stable locking performance.":
    "O cilindro tem corpo externo em alumínio com núcleo de latão, garantindo giro de chave uniforme e travamento estável.",
  "The rotating tail bar is made of iron, providing secure power transmission during locking and unlocking.":
    "A haste giratória é de ferro, transmitindo o movimento com segurança ao travar e destravar.",
  "Supplied as a complete hardware set, the lock includes an iron cylinder decorative ring, iron keys, iron decorative plate, and iron fixing screws, making installation simple and convenient.":
    "Fornecida como conjunto completo, a fechadura inclui anel decorativo de ferro para o cilindro, chaves de ferro, espelho decorativo de ferro e parafusos de fixação de ferro, o que torna a instalação simples e prática.",
  "With its classic night latch structure and anti-theft design, this lock is widely used on wooden and metal doors in homes, apartments, and similar environments.":
    "Com estrutura clássica de fechadura de sobrepor e projeto antifurto, é muito usada em portas de madeira e de metal em casas, apartamentos e ambientes semelhantes.",
  "OEM / ODM customization, surface finishes, and packaging options are available upon request.":
    "Personalização OEM / ODM, acabamentos de superfície e opções de embalagem disponíveis sob consulta.",
  "Provides reliable security for exterior wooden doors":
    "Oferece segurança confiável em portas externas de madeira",
  "Economical and durable night latch design":
    "Projeto de fechadura de sobrepor econômico e durável",
  "Ideal for residential use; compatible with intercom and access control systems. Suitable for apartments, commercial buildings, schools, warehouses, hotels, and more.":
    "Indicada para uso residencial; compatível com interfone e sistemas de controle de acesso. Serve em apartamentos, edifícios comerciais, escolas, galpões, hotéis e outros.",
  "Ideal for residential doors, intercom systems, and access control. Suitable for apartments, hotels, warehouses, schools, and commercial buildings.":
    "Indicada para portas residenciais, interfones e controle de acesso. Serve em apartamentos, hotéis, galpões, escolas e edifícios comerciais.",
  "Available in single or double cylinder options":
    "Disponível com cilindro simples ou duplo",
  "Self-locking function":
    "Função de autotravamento",
  "Anti-theft design with high security":
    "Projeto antifurto, de alta segurança",
  "Operated by key or rotating knob":
    "Acionada por chave ou pomo giratório",
  "Full turn of key locks or unlocks":
    "Uma volta completa da chave trava ou destrava",
  "Latch operated by both knobs; inside knob always free":
    "Trinco acionado pelos dois pomos; o pomo interno fica sempre livre",
  "Outside knob locked/unlocked by key in inside cylinder":
    "Pomo externo travado e destravado por chave no cilindro interno",
  "Latch automatically deadlocks when door is closed":
    "O trinco trava automaticamente quando a porta é fechada",
  "Latch automatically deadlocks when closed":
    "O trinco trava automaticamente ao fechar",
  "Ideal for communicating or exit doors with one-side operation":
    "Indicada para portas de comunicação ou de saída com operação de um lado só",
  "Suitable for doors with limited space near switch panels":
    "Serve em portas com pouco espaço junto a quadros de interruptores",
  "Blank rose design":
    "Roseta cega",
  "Recommended for rooms with multiple entrances":
    "Recomendada para ambientes com várias entradas",
  "Inside knob operates latch":
    "O pomo interno aciona o trinco",
  "Outside knob always fixed; operated by key only":
    "O pomo externo é sempre fixo; acionado só por chave",
  "Security: 5-pin tumbler brass cylinder with two nickel-plated brass keys":
    "Segurança: cilindro de latão de pino tambor com 5 pinos e duas chaves de latão niqueladas",
  "Standards: ANSI Grade 3, tested for over 200,000 cycles":
    "Normas: ANSI Grade 3, ensaiada a mais de 200.000 ciclos",
  "Standards: ANSI Grade 3":
    "Normas: ANSI Grade 3",
  "Application: Entrance doors for homes, apartments, or light commercial use":
    "Aplicação: portas de entrada de casas, apartamentos ou uso comercial leve",
  "Durable and cost-effective cylindrical lockset designed for standard residential use. Ideal for entrance doors requiring reliable performance and enhanced security.":
    "Conjunto de fechadura cilíndrica durável e de boa relação custo-benefício, para uso residencial padrão. Indicado para portas de entrada que exigem desempenho confiável e mais segurança.",
  "Economical choice for standard residential use":
    "Escolha econômica para uso residencial padrão",
  "Guaranteed for over 200,000 life cycles":
    "Garantida para mais de 200.000 ciclos de vida",
  "Tested for over 200,000 life cycles":
    "Ensaiada a mais de 200.000 ciclos de vida",
  "Durable: Tested for over 200,000 cycles":
    "Durabilidade: ensaiada a mais de 200.000 ciclos",
  "Can be keyed alike to deadbolt series for added security":
    "Pode ser chaveada igual à linha de travas para mais segurança",
  "Keyed alike with deadbolts for enhanced security":
    "Chaveada igual às travas para maior segurança",
  "Supports keyed alike function with deadbolts to enhance security":
    "Aceita chaveamento igual com travas para aumentar a segurança",
  "Supports master keying for family or facility needs":
    "Aceita chave-mestra para necessidades familiares ou prediais",
  "Solid steel chassis and zinc-plated latch case for corrosion resistance":
    "Chassi de aço maciço e caixa de trinco zincada, para resistência à corrosão",
  "Solid steel chassis and latch case, zinc-plated for corrosion resistance":
    "Chassi e caixa do trinco em aço maciço, zincados para resistência à corrosão",
  "Latch bolt operated by key (outside) or knob (inside)":
    "Trinco acionado por chave (por fora) ou pomo (por dentro)",
  "Outside knob remains fixed":
    "O pomo externo permanece fixo",
  "Inside knob locked/unlocked by key from inside":
    "Pomo interno travado e destravado por chave pelo lado de dentro",
  "Latch bolt auto-deadlocks when door is closed":
    "O trinco trava sozinho quando a porta é fechada",
  "Latch Bolt: 12mm (1/2”) throw with deadlocking":
    "Trinco: avanço de 12 mm (1/2”), com travamento",
  "Latch Bolt: 12mm (1/2”) throw; dead-locking for keyed function":
    "Trinco: avanço de 12 mm (1/2”); com travamento na função com chave",
  "Door Thickness: 35–50mm (1-3/8” to 2”), adjustable":
    "Espessura de porta: 35–50 mm (1-3/8” a 2”), ajustável",
  "Door Thickness: 35–45mm (1-3/8” to 1-3/4”)":
    "Espessura de porta: 35–45 mm (1-3/8” a 1-3/4”)",
  "Backset: Standard 70mm (2-3/4”); optional 60mm or 90mm available":
    "Distância ao eixo: 70 mm (2-3/4”) padrão; 60 mm ou 90 mm opcionais",
  "Backset: Adjustable 60mm or 70mm (2-3/8” or 2-3/4”); 70mm strike optional":
    "Distância ao eixo: ajustável 60 mm ou 70 mm (2-3/8” ou 2-3/4”); contra-testa de 70 mm opcional",
  "Ideal for medium-grade commercial and heavy-duty residential applications":
    "Indicada para uso comercial de porte médio e residencial de serviço pesado",
  "Exposed trim in zinc die-casting (electroplated) or solid brass":
    "Guarnição aparente em zamac injetado (eletrogalvanizado) ou latão maciço",
  "Exposed trim available in wrought stainless steel or brass":
    "Guarnição aparente disponível em aço inoxidável conformado ou latão",
  "5-pin brass cylinder, brass plug with 2 nickel-plated brass keys":
    "Cilindro de latão de 5 pinos, plugue de latão com 2 chaves de latão niqueladas",
  "1. Wide range of hinge types for different market needs worldwide.":
    "1. Ampla variedade de tipos de dobradiça para diferentes necessidades de mercado no mundo todo.",
  "2. Multiple surface finish options available, including powder coating, painting, anodizing, and wood-effect finishes.":
    "2. Várias opções de acabamento de superfície, incluindo pintura a pó, pintura líquida, anodização e efeito madeira.",
  "3. Easy to install with standard mounting design.":
    "3. Fácil de instalar, com fixação em padrão corrente.",
  "4. Modern appearance with a clean, premium look.":
    "4. Aparência moderna, com visual limpo e sofisticado.",
  "5. High quality, durable performance, excellent surface finish, and competitive pricing.":
    "5. Alta qualidade, desempenho durável, excelente acabamento de superfície e preço competitivo.",
  "6. Reliable after-sales service and technical support.":
    "6. Pós-venda confiável e suporte técnico.",
  "7. Over 18 years of manufacturing and export experience.":
    "7. Mais de 18 anos de experiência em fabricação e exportação.",
  "Durable 304 stainless steel":
    "Aço inoxidável 304 durável",
  "Custom sizes and shapes available":
    "Medidas e formatos sob medida disponíveis",
  "Easy exposed mounting for versatile use":
    "Fixação aparente fácil, para uso versátil",
  "Optional Latch: 1” round drive-in 4-way latch upon request":
    "Trinco opcional: redondo de 1” de encaixe, 4 posições, sob consulta",
  "Economical and easy-to-install lockset, ideal for residential use":
    "Conjunto econômico e fácil de instalar, indicado para uso residencial",
  "Economical, easy-to-install lockset for residential use":
    "Conjunto econômico e fácil de instalar, para uso residencial",
  "Economical and easy-to-install, ideal for residential use":
    "Econômica e fácil de instalar, indicada para uso residencial",
  "– 1” (25mm) deadbolt with hardened steel insert resists sawing":
    "– Trava de 1” (25 mm) com inserto de aço temperado, resistente ao corte por serra",
  "– 1” (25mm) deadbolt with hardened steel insert":
    "– Trava de 1” (25 mm) com inserto de aço temperado",
  "– 1” (25mm) solid deadbolt with hardened steel insert":
    "– Trava maciça de 1” (25 mm) com inserto de aço temperado",
  "– 1” (25mm) steel-reinforced deadbolt":
    "– Trava de 1” (25 mm) reforçada com aço",
  "– Free-spinning cylinder collar prevents wrenching":
    "– Colar de cilindro que gira livre, impede o ataque com grifa",
  "– Free-spinning cylinder ring prevents wrenching":
    "– Anel de cilindro que gira livre, impede o ataque com grifa",
  "– Free-spinning cylinder ring resists wrenching":
    "– Anel de cilindro que gira livre, resiste ao ataque com grifa",
  "– Anti-wrenching rotating cylinder ring":
    "– Anel de cilindro giratório, antiataque com grifa",
  "– No visible exterior screws":
    "– Sem parafusos aparentes pelo lado de fora",
  "– No exposed external screws":
    "– Sem parafusos externos aparentes",
  "– No exposed external fasteners":
    "– Sem fixadores externos aparentes",
  "– No exposed exterior fixings":
    "– Sem fixações externas aparentes",
  "– Non-handed design suits both left- and right-hand doors":
    "– Projeto sem mão, serve em portas de mão esquerda e direita",
  "– Reversible for left or right hand doors":
    "– Reversível para portas de mão esquerda ou direita",
  "– Reversible for left/right-handed doors":
    "– Reversível para portas de mão esquerda/direita",
  "– Reversible for left or right-handed doors":
    "– Reversível para portas de mão esquerda ou direita",
  "– Door thickness: adjustable from 1-3/8” to 1-3/4” (35mm to 45mm)":
    "– Espessura de porta: ajustável de 1-3/8” a 1-3/4” (35 mm a 45 mm)",
  "– Fits door thickness: 1-3/8” to 1-3/4” (35mm to 45mm)":
    "– Serve em portas de 1-3/8” a 1-3/4” (35 mm a 45 mm)",
  "– Fits 2” (51mm) standard cross bore":
    "– Serve no furo padrão de 2” (51 mm)",
  "Installation":
    "Instalação",
  "Enhanced Security":
    "Segurança reforçada",

  "Elegant entrance handle set crafted from durable zinc alloy with polished brass finish. Designed to fit standard door preparations, offering an easy upgrade for residential entry doors.":
    "Conjunto de puxador de entrada elegante, em zamac durável com acabamento latão polido. Feito para as preparações de porta padrão, é uma troca simples em portas de entrada residenciais.",
  "Stylish grip handle set designed to enhance the appearance and security of entrance doors. Made of durable zinc alloy with satin nickel finish, compatible with standard door preps and easy to install.":
    "Conjunto de puxador de estilo, para melhorar a aparência e a segurança de portas de entrada. Em zamac durável com acabamento níquel acetinado, compatível com as preparações de porta padrão e fácil de instalar.",
  "Premium Construction: Durable zinc alloy with polished brass finish; external components crafted from forged brass or electroplated zinc die-cast.":
    "Construção de primeira: zamac durável com acabamento latão polido; componentes externos em latão forjado ou zamac injetado eletrogalvanizado.",
  "Optimized Description:":
    "Descrição otimizada:",
  "Polished brass grip handle set designed to enhance entrance doors with elegance and functionality. Compatible with standard door preparations, ideal for both replacements and new installations.":
    "Conjunto de puxador em latão polido, para dar elegância e funcionalidade a portas de entrada. Compatível com as preparações de porta padrão, indicado tanto para troca quanto para instalação nova.",
  "Simple turn-to-lock mechanism":
    "Mecanismo simples: gire para trancar",
  "Turn to lock; reverse to unlock":
    "Gire para trancar; inverta para destrancar",
  "Intuitive locking: turn to lock, reverse to unlock":
    "Travamento intuitivo: gire para trancar, inverta para destrancar",
  "Key or thumb-turn locks/unlocks both levers":
    "A chave ou o botão de giro trava e destrava as duas maçanetas",
  "Key or thumb-turn operates both knobs":
    "A chave ou o botão de giro aciona os dois pomos",
  "Locks/unlocks both knobs via key or thumb-turn":
    "Trava e destrava os dois pomos por chave ou botão de giro",
  "Lock/unlock via key or thumb-turn":
    "Trava e destrava por chave ou botão de giro",
  "Synchronized locking for both knobs":
    "Travamento sincronizado dos dois pomos",
  "Internal thumb-turn or key rotation locks/unlocks simultaneously":
    "O botão interno ou o giro da chave trava e destrava ao mesmo tempo",
  "Turning thumb-turn counter-clockwise or key clockwise locks the knobs; reverse to unlock":
    "Girar o botão no sentido anti-horário ou a chave no sentido horário trava os pomos; inverta para destravar",
  "Locking: turn thumb-turn counter-clockwise or key clockwise; unlock in reverse":
    "Travamento: gire o botão no sentido anti-horário ou a chave no sentido horário; destrave no sentido inverso",
  "Zinc-plated steel chassis and latch for durability and corrosion resistance":
    "Chassi e trinco em aço zincado, para durabilidade e resistência à corrosão",
  "Trim options: stainless steel or brass":
    "Opções de guarnição: aço inoxidável ou latão",
  "Trim available in stainless steel or brass":
    "Guarnição disponível em aço inoxidável ou latão",
  "1. Premium 304 stainless steel material with excellent corrosion resistance and long service life.":
    "1. Aço inoxidável 304 de primeira linha, com excelente resistência à corrosão e longa vida útil.",
  "2. Self-closing spring hinge with adjustable tension for flexible closing force adjustment.":
    "2. Dobradiça de mola com fechamento automático e tensão regulável, para ajustar a força de fechamento.",
  "3. Soft-close positioning function provides smooth, quiet, and stable door closing performance.":
    "3. Função de amortecimento dá um fechamento suave, silencioso e estável.",
  "4. Thickened stainless steel construction ensures strong load-bearing capacity and durable daily use.":
    "4. Construção em inox reforçado garante alta capacidade de carga e uso diário durável.",
  "5. Supports 90° positioning and 180° opening angle for convenient operation.":
    "5. Retenção a 90° e ângulo de abertura de 180°, para operação prática.",
  "6. Available in 4”*3”*3” and 5”*3”*3” sizes for different door applications.":
    "6. Disponível nas medidas 4”*3”*3” e 5”*3”*3”, para diferentes aplicações de porta.",
  "7. Multiple surface finishes available, including matte black, satin stainless steel, gold, antique brass, and antique copper.":
    "7. Vários acabamentos de superfície: preto fosco, inox acetinado, dourado, latão antigo e cobre antigo.",
  "8. Suitable for wooden doors, apartment doors, hotel doors, office doors, corridor doors, and commercial doors.":
    "8. Indicada para portas de madeira, de apartamento, de hotel, de escritório, de corredor e comerciais.",
  "9. OEM & ODM customization supported for sizes, colors, finishes, and logo requirements.":
    "9. Personalização OEM e ODM em medidas, cores, acabamentos e marcação.",
  "• Compatible with multiple profile systems":
    "• Compatível com vários sistemas de perfil",
  "• Finishes include powder coating, anodizing, painting, wood grain, etc.":
    "• Acabamentos: pintura a pó, anodização, pintura líquida, efeito madeira etc.",
  "• Easy installation":
    "• Instalação fácil",
  "• Durable construction with excellent surface finish":
    "• Construção durável, com excelente acabamento de superfície",
  "• Cost-effective with stable quality":
    "• Boa relação custo-benefício, com qualidade estável",
  "• Over 18 years of manufacturing & export experience":
    "• Mais de 18 anos de experiência em fabricação e exportação",
  "• Reliable after-sales support":
    "• Suporte pós-venda confiável",
  "Economical and durable auxiliary lock":
    "Fechadura auxiliar econômica e durável",
  "Economical and durable auxiliary deadbolt":
    "Trava auxiliar econômica e durável",
  "25mm (1”) zinc die-cast deadbolt with hardened steel roller insert for anti-saw protection":
    "Trava de 25 mm (1”) em zamac injetado, com pino rolete de aço temperado para proteção antisserra",
  "25mm (1”) zinc die-cast bolt with hardened steel roller insert for anti-saw protection":
    "Ferrolho de 25 mm (1”) em zamac injetado, com pino rolete de aço temperado para proteção antisserra",
  "Free-turning cylinder trim prevents wrenching":
    "Colar de cilindro que gira livre, impede o ataque com grifa",
  "Free-turning cylinder trim to prevent wrenching":
    "Colar de cilindro que gira livre, para impedir o ataque com grifa",
  "Compatible with entrance bored locks for enhanced exterior door security":
    "Compatível com fechaduras broqueadas de entrada, para mais segurança em porta externa",
  "Can be keyed alike with entrance locks for enhanced exterior security":
    "Pode ser chaveada igual às fechaduras de entrada, para mais segurança externa",
  "Can be keyed alike with standard entrance locks for seamless integration and enhanced exterior door security.":
    "Pode ser chaveada igual às fechaduras de entrada padrão, integrando-se ao conjunto e aumentando a segurança da porta externa.",
  "Easy rekeying with removable brass cylinder plug":
    "Repinagem fácil, com plugue de latão removível",
  "Zinc-plated steel internal components":
    "Componentes internos em aço zincado",
  "5-pin solid brass cylinder, easy to rekey":
    "Cilindro de latão maciço de 5 pinos, fácil de repinar",
  "Supplied with 2 nickel-plated brass keys":
    "Fornecida com 2 chaves de latão niqueladas",
  "Deadbolt Series":
    "Linha de travas",
  "A durable and cost-effective auxiliary lock featuring a 25mm (1”) zinc die-cast bolt with a hardened steel roller insert for added resistance against sawing and forced entry.":
    "Fechadura auxiliar durável e de boa relação custo-benefício, com ferrolho de 25 mm (1”) em zamac injetado e pino rolete de aço temperado, para mais resistência ao corte por serra e ao arrombamento.",
  "•Reinforced Construction":
    "• Construção reforçada",
  "Internal components are made of zinc-plated steel. External trims are available in stainless steel, brass, or steel options. The free-turning trim design helps resist wrenching and tampering.":
    "Os componentes internos são de aço zincado. As guarnições externas estão disponíveis em aço inoxidável, latão ou aço. O colar que gira livre ajuda a resistir ao ataque com grifa e à violação.",
  "•Heavy-Duty Deadbolt":
    "• Trava de serviço pesado",
  "Equipped with a full 25mm throw deadbolt and hardened steel roller, engineered to withstand high-impact attacks and sawing.":
    "Traz trava com avanço total de 25 mm e rolete de aço temperado, projetada para resistir a ataques de alto impacto e ao corte por serra.",
  "•Secure Cylinder & Key System":
    "• Cilindro e sistema de chaves seguros",
  "Features a 5-pin tumbler mechanism with a solid brass plug, allowing for easy rekeying. Comes with two nickel-plated brass keys.":
    "Traz mecanismo de pino tambor de 5 pinos com plugue de latão maciço, o que facilita a repinagem. Acompanha duas chaves de latão niqueladas.",
  "•Flexible Installation":
    "• Instalação flexível",
  "Fully reversible handing supports both left- and right-handed doors. The adjustable backset and door thickness make it suitable for a wide range of residential and commercial applications.":
    "A mão totalmente reversível atende portas de mão esquerda e direita. A distância ao eixo e a espessura de porta ajustáveis a tornam adequada a uma ampla gama de aplicações residenciais e comerciais.",
  "Made of a high-quality iron structure with zinc-plated surface treatment, providing excellent corrosion resistance and long service life. Suitable for long-term commercial and industrial environments.":
    "Estrutura de ferro de alta qualidade com tratamento de superfície zincado, oferecendo excelente resistência à corrosão e longa vida útil. Indicada para ambientes comerciais e industriais de uso prolongado.",
  "This mechanical door coordinator is designed for double-leaf door systems. It controls the correct closing sequence, ensuring that the inactive leaf closes first and the active leaf closes afterward.":
    "Este coordenador mecânico foi projetado para sistemas de porta de duas folhas. Ele impõe a sequência correta de fechamento, garantindo que a folha passiva feche primeiro e a ativa depois.",
  "This double-door coordinator is designed for fire-rated and commercial double-door systems.":
    "Este coordenador foi projetado para sistemas de porta dupla corta-fogo e comerciais.",
  "Made from durable 304 stainless steel, it provides smooth, stable, and quiet automatic door sequencing.":
    "Em aço inoxidável 304 durável, faz o sequenciamento automático das folhas de forma suave, estável e silenciosa.",
  "The precision spring mechanism and adjustable tension screw allow flexible control of the closing force, while the nylon roller design ensures reduced wear and long service life.":
    "O mecanismo de mola de precisão e o parafuso de tensão regulável permitem controlar a força de fechamento, e o rolete de náilon reduz o desgaste e prolonga a vida útil.",
  "Ideal for commercial buildings, hospitals, schools, and other high-traffic applications. OEM and ODM customization services are available.":
    "Indicado para edifícios comerciais, hospitais, escolas e outras aplicações de grande fluxo. Personalização OEM e ODM disponível.",
  "EPT Power Transfer Unit":
    "Unidade de transferência de energia EPT",
  "Concealed, tamper-resistant design for flexible power and data transmission":
    "Projeto oculto e resistente à violação, para transmissão flexível de energia e dados",
  "• Mounts on the edge of the door and frame with concealed wiring":
    "• Monta na borda da porta e do batente, com fiação oculta",
  "• Flexible steel conduit protects cable bundles up to Ø5/16” (8mm)":
    "• Conduíte flexível de aço protege chicotes de até Ø5/16” (8 mm)",
  "• Compatible with most hinge types: butt hinges, continuous hinges, and partial pivot hinges":
    "• Compatível com a maioria dos tipos de dobradiça: comuns, contínuas e de pivô parcial",
  "• Rounded mounting tabs for improved installation adaptability":
    "• Abas de fixação arredondadas, para melhor adaptação na instalação",
  "• EPT Standard: Suitable for standard hinges and pivot hinges with <3/4” (19mm) offset":
    "• EPT padrão: serve em dobradiças comuns e de pivô com desalinhamento menor que 3/4” (19 mm)",
  "All our door guards are for exporting, with various materials like brass, stainless Steel 304, zinc alloy and iron in order to meet different markets. With different finishes available.":
    "Todas as nossas travas de segurança são para exportação, em materiais variados como latão, aço inoxidável 304, zamac e ferro, para atender diferentes mercados. Com diversos acabamentos disponíveis.",
  "Sizes can be customized.":
    "As medidas podem ser personalizadas.",
  "Application: Suitable for kitchens, hallways, and residential doors.":
    "Aplicação: indicada para cozinhas, corredores e portas residenciais.",
  "Function: Adjustable opening/closing speed and spring tension. Allows 116° swing in both directions with stop points at 0°, 88°, and 116°.":
    "Funcionamento: velocidade de abertura/fechamento e tensão da mola reguláveis. Permite giro de 116° nos dois sentidos, com paradas em 0°, 88° e 116°.",
  "Durability: Tested for over 500,000 open-close cycles":
    "Durabilidade: ensaiada a mais de 500.000 ciclos de abre-fecha",
  "Adjustment: Latch speed and closing speed adjustable via built-in screws":
    "Regulagem: velocidade do trinco e de fechamento reguláveis por parafusos internos",
  "Function: 13mm latch extension with inside deadlocking button to prevent outside key operation and latch picking":
    "Funcionamento: avanço de trinco de 13 mm com botão de travamento interno, que impede a operação por chave pelo lado de fora e a abertura do trinco",
  "Packing: Blister or color box":
    "Embalagem: blister ou caixa colorida",
  "G.W.: 16kg / N.W.: 15kg":
    "Peso bruto: 16 kg / Peso líquido: 15 kg",
  "Carton Size: 41.5 × 26 × 30.5 cm":
    "Medidas da caixa: 41,5 × 26 × 30,5 cm",
  "Installation Instructions":
    "Instruções de instalação",
  "Compatible Door Thickness: 8–10 mm glass doors":
    "Espessura de porta compatível: vidro de 8–10 mm",
  "No Drilling Required: Installs without cutting or drilling the glass":
    "Sem furação: instala sem cortar nem furar o vidro",
  "Clean Surface: Wipe the installation area on the glass with a damp cloth.":
    "Limpe a superfície: passe um pano úmido na área de instalação do vidro.",
  "Position the Lock: Select the correct position and check that the latch operates smoothly.":
    "Posicione a fechadura: escolha a posição correta e confira se o trinco funciona suavemente.",
  "Attach Plate A:":
    "Fixe a placa A:",
  "Use the clamp plates to secure the lock.":
    "Use as placas de aperto para prender a fechadura.",
  "Adjust or loosen the screws on Plate A as needed to ensure a firm fit on the glass.":
    "Ajuste ou afrouxe os parafusos da placa A conforme necessário, para garantir aperto firme no vidro.",
  "Install Plate B:":
    "Instale a placa B:",
  "Hook the holding teeth of Plate B onto the back of Plate A.":
    "Encaixe os dentes de retenção da placa B na parte de trás da placa A.",
  "Push forward firmly, then secure with two screws.":
    "Empurre firme para a frente e prenda com dois parafusos.",
  "Stainless Steel Door Latch Guard, durable material with satin finish, strong and corrosion resistant for long term use":
    "Protetor de trinco em aço inoxidável, material durável com acabamento acetinado, resistente e anticorrosivo para uso prolongado",
  "Anti Pry Door Security Plate, reinforces the latch area to prevent forced entry and improve door security":
    "Placa de segurança antialavanca, reforça a região do trinco para evitar arrombamento e aumentar a segurança da porta",
  "Full Latch Coverage Design, effectively blocks latch bolt access and makes it difficult to pry open the door":
    "Cobertura total do trinco, que bloqueia o acesso ao ferrolho e dificulta alavancar a porta",
  "Heavy Duty Construction, thick and solid structure provides reliable protection for residential and commercial doors":
    "Construção de serviço pesado, estrutura espessa e sólida que protege portas residenciais e comerciais",
  "Easy Installation, quick screw fixing installation, suitable for most outswing doors without complex tools":
    "Instalação fácil, fixação rápida por parafusos, serve na maioria das portas de abertura para fora sem ferramentas complexas",
  "Includes 304 Stainless Steel Screws, ensures strong fixing and long lasting durability":
    "Inclui parafusos em aço inoxidável 304, que garantem fixação firme e durabilidade",
  "Designed for the Australian Market, meets application needs for outswing door systems":
    "Projetada para o mercado australiano, atende às necessidades de sistemas de porta com abertura para fora",
  "Wide Application, ideal for home office apartment and commercial door security systems":
    "Ampla aplicação, indicada para sistemas de segurança de portas residenciais, de escritório, de apartamento e comerciais",
  "Key Features：":
    "Principais características:",
  "• Deadlatch security design for enhanced anti-pry protection":
    "• Trinco de travamento, para maior proteção antialavanca",
  "• Durable iron body with zinc alloy + ABS latch":
    "• Corpo de ferro durável, com trinco em zamac + ABS",
  "• Double & single cylinder configurations available":
    "• Configurações de cilindro simples e duplo disponíveis",
  "• Hold-back function for smooth door operation":
    "• Função de retenção do trinco, para operação suave da porta",
  "• Ideal for aluminum storefront and narrow frame doors":
    "• Indicada para portas de vitrine em alumínio e perfis estreitos",
  "This narrow stile deadlatch lock is designed for aluminum storefront doors and narrow frame systems, offering reliable security and smooth operation for commercial applications.":
    "Esta fechadura de trinco travável para montante estreito foi projetada para portas de vitrine em alumínio e sistemas de perfil estreito, oferecendo segurança confiável e operação suave em uso comercial.",
  "Built with a durable iron body, zinc alloy + ABS latch, and auxiliary deadlatch structure, it provides strong anti-pry performance and long service life.":
    "Com corpo de ferro durável, trinco em zamac + ABS e estrutura auxiliar de travamento, oferece forte desempenho antialavanca e longa vida útil.",
  "Widely used in storefront doors, glass doors, and commercial entry systems.":
    "Muito usada em portas de vitrine, portas de vidro e sistemas de entrada comercial.",
  "This commercial aluminum storefront door push-pull paddle lock set is designed for aluminum glass doors, shop doors, office doors, and commercial entrances.":
    "Este conjunto de fechadura com acionador tipo alavanca para porta de vitrine em alumínio foi projetado para portas de vidro com alumínio, portas de loja, de escritório e entradas comerciais.",
  "Left-hand and right-hand options are available. The hold-back function keeps the latch retracted when needed, allowing convenient access during business hours and high-traffic periods.":
    "Há versões de mão esquerda e direita. A função de retenção mantém o trinco recolhido quando necessário, facilitando o acesso no horário comercial e em períodos de grande fluxo.",
  "With complete accessories and easy installation, this lock set is ideal for storefront door replacement, project installation, commercial door hardware, and aluminum glass door applications.":
    "Com acessórios completos e instalação fácil, este conjunto é indicado para troca em porta de vitrine, instalação em obra, ferragem de porta comercial e aplicações em porta de vidro com alumínio.",
  "American-style storefront door lock body with durable iron construction for reliable and stable commercial security performance.":
    "Corpo de fechadura para porta de vitrine no padrão americano, em ferro durável, para desempenho de segurança comercial confiável e estável.",
  "Equipped with an American-style brass mortise cylinder for smooth key operation and dependable locking performance.":
    "Equipada com cilindro de embutir de latão no padrão americano, para giro de chave suave e travamento confiável.",
  "Available with Flat Swing Bolt, Hook Bolt, and Spring Loaded Deadlatch options for different aluminum door applications.":
    "Disponível com ferrolho plano basculante, ferrolho tipo gancho e trinco travável com mola, para diferentes aplicações em porta de alumínio.",
  "Suitable for storefront doors, narrow stile aluminum doors, sliding doors, fast-food restaurant door systems such as KFC doors, and commercial glass door systems.":
    "Indicada para portas de vitrine, portas de alumínio de montante estreito, portas de correr, sistemas de porta de restaurantes de serviço rápido e sistemas comerciais de porta de vidro.",
  "Anti-pry lock body design enhances security for shops, offices, commercial buildings, and storefront entrances.":
    "O corpo de fechadura antialavanca aumenta a segurança em lojas, escritórios, edifícios comerciais e entradas de vitrine.",
  "Available in Single Cylinder and Double Cylinder configurations to meet different security requirements.":
    "Disponível nas configurações de cilindro simples e duplo, para diferentes exigências de segurança.",
  "Concealed lock body structure provides a clean appearance, secure installation, and professional commercial applications.":
    "A estrutura de corpo oculto dá aparência limpa, instalação segura e acabamento profissional em uso comercial.",
  "Multiple finishes available including SSS, PSS, AB, AC, and customized surface treatments.":
    "Vários acabamentos disponíveis, incluindo SSS, PSS, AB, AC e tratamentos de superfície sob medida.",
  "Compatible with narrow stile aluminum door frames and commercial storefront door systems.":
    "Compatível com perfis de alumínio de montante estreito e sistemas comerciais de porta de vitrine.",
  "OEM & ODM customization supported for lock body size, bolt structure, finish, and packaging.":
    "Personalização OEM e ODM em tamanho do corpo, estrutura do ferrolho, acabamento e embalagem.",
  "Suitable for wooden doors, metal doors, fire doors, windows, and cabinet doors, this hinge is widely used in residential, commercial, hotel, office, warehouse, and industrial applications.":
    "Indicada para portas de madeira, de metal, corta-fogo, janelas e portas de armário, esta dobradiça é muito usada em aplicações residenciais, comerciais, hoteleiras, de escritório, de galpão e industriais.",
  "Multiple sizes and customization options are available for OEM and ODM projects.":
    "Várias medidas e opções de personalização para projetos OEM e ODM.",
  "Structure: Beveled latch design with 13mm latch throw and 25mm full-throw deadbolt":
    "Estrutura: trinco chanfrado com avanço de 13 mm e trava de avanço total de 25 mm",
  "Function: Inside deadlocking button prevents external key operation and latch picking":
    "Funcionamento: o botão de travamento interno impede a operação por chave pelo lado de fora e a abertura do trinco",
  "Finish: Painted":
    "Acabamento: pintado",
  "Application: Economical and secure solution for exterior wooden doors":
    "Aplicação: solução econômica e segura para portas externas de madeira",
  "• Cylinder extensions available in various sizes for thicker doors":
    "• Extensões de cilindro em várias medidas, para portas mais espessas",
  "• Variable height escutcheons available":
    "• Espelhos de altura variável disponíveis",
  "Stainless Steel Spring Hinge – Automatic Self-Closing (Adjustable Tension)":
    "Dobradiça de mola em aço inoxidável — fechamento automático (tensão regulável)",
  "Stainless Steel Construction":
    "Construção em aço inoxidável",
  "Constructed from high-quality stainless steel with a brushed finish for durability and corrosion resistance.":
    "Fabricada em aço inoxidável de alta qualidade com acabamento escovado, para durabilidade e resistência à corrosão.",
  "Double Action Operation":
    "Operação de duplo sentido",
  "Enables smooth and stable movement in both directions.":
    "Permite movimento suave e estável nos dois sentidos.",
  "Self-Closing Function":
    "Função de fechamento automático",
  "Built-in spring mechanism automatically returns the door to the center position.":
    "O mecanismo de mola interno devolve a porta automaticamente à posição central.",
  "Adjustable Spring Tension":
    "Tensão de mola regulável",
  "Allows precise control of closing speed for different door weights and applications.":
    "Permite controlar com precisão a velocidade de fechamento para diferentes pesos de porta e aplicações.",
  "Includes all necessary accessories for quick and straightforward installation.":
    "Inclui todos os acessórios necessários para uma instalação rápida e direta.",
  "Wide Application":
    "Ampla aplicação",
  "Suitable for cafe doors, kitchen doors, saloon doors, and commercial swing doors.":
    "Indicada para portas de café, de cozinha, tipo vaivém e portas comerciais basculantes.",
};
