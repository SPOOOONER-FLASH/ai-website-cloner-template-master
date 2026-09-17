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
};
