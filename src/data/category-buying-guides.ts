/**
 * The buying guide under each category page — "How buyers specify …".
 *
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS
 *
 * scripts/audit-keyword-coverage.mjs (2026-09-28): the fifteen category pages carried the
 * words a buyer uses to LEARN, and almost none of the words a buyer uses to BUY. Body copy
 * with a commercial word — manufacturer, supplier, wholesale, OEM — on 4 of 15 pages; a
 * transactional word — quote, MOQ, lead time, sample — on 1 of 15. The Search Console
 * export of 2026-09-22 shows the same thing from the other side: "brass door hinge
 * manufacturer", "china door closer", "door closer manufacturer", "fire door with panic
 * hardware", "anti panic door", "patch fitting", "hook locks" all reach the site and none
 * of them is answered by a sentence on the page they land on. The category page ranks
 * (hinges 10.9, closers 19.9) and gets no click, because the snippet has nothing to say
 * to that query.
 *
 * scripts/audit-question-coverage.mjs: 71 of 170 buyer questions unanswered anywhere on
 * the site, and most of the answerable ones are per-category dimension questions — what
 * backset, what door thickness, what spindle — whose answers already sit in the records.
 *
 * ---------------------------------------------------------------------------
 * THE RULE THAT KEEPS IT HONEST
 *
 * The words are written here, in the buyer's own vocabulary (the query log, the anchor
 * text report in docs/research/commercial-keywords.json, and the question library in
 * docs/research/buyer-questions.json). The FIGURES are not written here at all: every
 * `{placeholder}` is filled at build time from the published records by
 * src/lib/category-facts.ts, and an item whose `needs` are not stated on enough records
 * is dropped rather than printed with a blank. So a guide can say "backset {backset}" for
 * lock cases and the number is whatever the catalogue says the day it is built.
 *
 * No certification, grade, fire rating or standard number is claimed anywhere in this
 * file, for the reason in AGENTS.md: there are no certificates to point at. Where a buyer
 * asks about one, the answer says what the test-report page says and stops.
 *
 * Languages: en / es / pt written here. The seven overlay locales read `en` through
 * ui.json (scripts/i18n-extract-ui.mjs picks up every `en:` leaf), so a placeholder must
 * survive translation — the merge refuses a target that drops one.
 */
import type { CategoryFacts } from "../lib/category-facts.ts";

export interface GuideText {
  en: string;
  es: string;
  pt: string;
}

export interface GuideItem {
  question: GuideText;
  answer: GuideText;
  /** Facts the answer prints; the item is dropped when any of them is unavailable. */
  needs?: (keyof CategoryFacts)[];
}

export interface CategoryGuide {
  /** Two or three sentences: who buys this, in the words they search with. */
  intro: GuideText;
  items: GuideItem[];
}

const ORDERING: GuideItem = {
  question: {
    en: "What do you need from me to quote?",
    es: "¿Qué necesitan de mí para cotizar?",
    pt: "O que vocês precisam de mim para cotar?",
  },
  answer: {
    en: "The model numbers or a drawing, the finish, the quantity per model and the destination port. Minimum order and lead time are confirmed per line; most models fall between 300 and 5,000 pieces, and production starts at 30 days from order confirmation. Samples are available before a production order.",
    es: "Los números de modelo o un plano, el acabado, la cantidad por modelo y el puerto de destino. El pedido mínimo y el plazo se confirman por línea; la mayoría de los modelos queda entre 300 y 5.000 piezas, y la producción arranca a los 30 días de confirmar el pedido. Hay muestras antes del pedido de producción.",
    pt: "Os números de modelo ou um desenho, o acabamento, a quantidade por modelo e o porto de destino. Pedido mínimo e prazo são confirmados por linha; a maioria dos modelos fica entre 300 e 5.000 peças, e a produção começa 30 dias após a confirmação do pedido. Há amostras antes do pedido de produção.",
  },
};

export const CATEGORY_GUIDES: Record<string, CategoryGuide> = {
  "panic-exit-devices": {
    intro: {
      en: "Buyers come to this range for a panic bar on a fire exit door, an anti-panic device for a double door, or the outside trim that lets a keyed user in while the bar still works from inside. We manufacture the {count} models here in Zhongshan and supply them to distributors, contractors and OEM brands.",
      es: "Los compradores llegan a esta gama buscando una barra antipánico para una puerta de salida de emergencia, un dispositivo antipánico para puerta doble o la manilla exterior que deja entrar con llave mientras la barra sigue funcionando desde dentro. Fabricamos los {count} modelos en Zhongshan y los suministramos a distribuidores, contratistas y marcas OEM.",
      pt: "Os compradores chegam a esta linha procurando uma barra antipânico para porta de saída de emergência, um dispositivo antipânico para porta dupla ou o trim externo que deixa entrar com chave enquanto a barra continua funcionando por dentro. Fabricamos os {count} modelos em Zhongshan e fornecemos a distribuidores, construtoras e marcas OEM.",
    },
    items: [
      {
        question: { en: "Which push bar length fits my door?", es: "¿Qué longitud de barra le va a mi puerta?", pt: "Qual comprimento de barra serve para a minha porta?" },
        answer: {
          en: "Measure the leaf, not the opening. Published bar lengths in this range run {barLength}; several models are cut to length on request. Give us the leaf width and thickness with the inquiry and we confirm the model.",
          es: "Mida la hoja, no el hueco. Las longitudes de barra publicadas en esta gama van de {barLength}; varios modelos se cortan a medida bajo pedido. Indíquenos ancho y espesor de hoja en la consulta y confirmamos el modelo.",
          pt: "Meça a folha, não o vão. Os comprimentos de barra publicados nesta linha vão de {barLength}; vários modelos são cortados sob medida a pedido. Informe largura e espessura da folha na consulta e confirmamos o modelo.",
        },
        needs: ["barLength"],
      },
      {
        question: { en: "Can the exit door be opened from outside?", es: "¿La puerta de salida se puede abrir desde fuera?", pt: "A porta de saída pode ser aberta por fora?" },
        answer: {
          en: "Yes, with an outside lever trim. The trim is a separate part fitted to the same device: a keyed lever lets authorized users in, and the bar inside still opens the door with one push. Trims are listed under Exterior Trim in this category.",
          es: "Sí, con una manilla exterior. Es una pieza aparte que se monta sobre el mismo dispositivo: una manilla con llave deja entrar a los usuarios autorizados y la barra interior sigue abriendo con un solo empuje. Las manillas están en Manillas exteriores dentro de esta categoría.",
          pt: "Sim, com um trim de alavanca externa. É uma peça separada montada no mesmo dispositivo: uma alavanca com chave deixa entrar os usuários autorizados, e a barra interna continua abrindo com um empurrão. Os trims estão em Trim externo nesta categoria.",
        },
      },
      {
        question: { en: "Is it certified for fire doors?", es: "¿Está certificado para puertas cortafuego?", pt: "É certificado para portas corta-fogo?" },
        answer: {
          en: "Test reports are published per model on the certificates page, not per range. Where a model has no report yet, the page says so, and we do not describe it as certified. Ask for the report by model number before you specify.",
          es: "Los informes de ensayo se publican por modelo en la página de certificados, no por gama. Si un modelo aún no tiene informe, la página lo dice y no lo presentamos como certificado. Pida el informe por número de modelo antes de especificar.",
          pt: "Os relatórios de ensaio são publicados por modelo na página de certificados, não por linha. Se um modelo ainda não tem relatório, a página diz isso e não o apresentamos como certificado. Peça o relatório pelo número do modelo antes de especificar.",
        },
      },
      ORDERING,
    ],
  },
  "night-latches-rim-locks": {
    intro: {
      en: "A rim night latch is the lock a distributor buys for apartment and residential entrance doors that are already hung: it mounts on the face of the door through one cylinder hole. The {count} models here are made in our own factory for wholesale and private-label orders.",
      es: "Una cerradura de sobreponer es la que un distribuidor compra para puertas de entrada de vivienda ya instaladas: se monta sobre la cara de la puerta con un solo taladro de cilindro. Los {count} modelos se fabrican en nuestra propia planta para pedidos al por mayor y de marca propia.",
      pt: "Uma fechadura de sobrepor é a que um distribuidor compra para portas de entrada residenciais já instaladas: monta-se na face da porta por um único furo de cilindro. Os {count} modelos são feitos em nossa própria fábrica para pedidos de atacado e marca própria.",
    },
    items: [
      {
        question: { en: "What backset and door thickness do they take?", es: "¿Qué entrada y espesor de puerta admiten?", pt: "Que backset e espessura de porta aceitam?" },
        answer: {
          en: "Backset across the range is {backset} and the door thickness range is {thickness}; both figures are on each model's specification table, and a 60mm backset is the most common.",
          es: "La entrada en toda la gama es {backset} y el espesor de puerta admitido es {thickness}; ambas cifras están en la tabla de cada modelo, y la entrada de 60 mm es la más común.",
          pt: "O backset na linha é {backset} e a espessura de porta aceita é {thickness}; os dois valores estão na tabela de cada modelo, e o backset de 60 mm é o mais comum.",
        },
        needs: ["backset", "thickness"],
      },
      {
        question: { en: "Single cylinder, double cylinder or self-locking?", es: "¿Cilindro simple, doble o autoblocante?", pt: "Cilindro simples, duplo ou autotravante?" },
        answer: {
          en: "All three functions are in the range: {functions}. Single-cylinder versions open from inside without a key; double-cylinder versions need a key on both sides; self-locking versions latch as the door closes.",
          es: "Las tres funciones están en la gama: {functions}. Las versiones de cilindro simple abren desde dentro sin llave; las de doble cilindro necesitan llave por ambos lados; las autoblocantes cierran al cerrar la puerta.",
          pt: "As três funções estão na linha: {functions}. As versões de cilindro simples abrem por dentro sem chave; as de cilindro duplo exigem chave dos dois lados; as autotravantes trancam ao fechar a porta.",
        },
        needs: ["functions"],
      },
      {
        question: { en: "Can they be keyed alike for a block of flats?", es: "¿Se pueden amaestrar para un bloque de viviendas?", pt: "Podem ser feitas com chave igual para um prédio?" },
        answer: {
          en: "Keyed-alike groups and master-key systems are quoted per project. Send the door schedule with the inquiry; the cylinders are cut before shipment, and the keying plan has to be decided before the order is confirmed.",
          es: "Los grupos de llave igual y los sistemas de amaestramiento se cotizan por proyecto. Envíe la relación de puertas con la consulta; los cilindros se tallan antes del envío y el plan de llaves debe decidirse antes de confirmar el pedido.",
          pt: "Grupos de chave igual e sistemas de chave mestra são cotados por projeto. Envie a lista de portas com a consulta; os cilindros são cortados antes do embarque e o plano de chaves precisa ser decidido antes de confirmar o pedido.",
        },
      },
      ORDERING,
    ],
  },
  "stainless-steel-handles": {
    intro: {
      en: "Specifiers searching for a stainless steel door handle manufacturer usually need three things confirmed: the grade of steel, the door thickness the rose or plate will take, and whether the lever is solid or hollow. The {count} models here are stainless throughout, made for entrance, glass and commercial doors.",
      es: "Quien busca un fabricante de manijas de acero inoxidable suele necesitar tres confirmaciones: el grado del acero, el espesor de puerta que admite la roseta o placa y si la manija es maciza o hueca. Los {count} modelos son de inoxidable en todas sus piezas, para puertas de entrada, de vidrio y comerciales.",
      pt: "Quem procura um fabricante de maçanetas de aço inoxidável costuma precisar de três confirmações: o grau do aço, a espessura de porta que a roseta ou espelho aceita e se a maçaneta é maciça ou oca. Os {count} modelos são inteiramente em inox, para portas de entrada, de vidro e comerciais.",
    },
    items: [
      {
        question: { en: "What door thickness do the handles fit?", es: "¿Para qué espesor de puerta sirven?", pt: "Para que espessura de porta servem?" },
        answer: {
          en: "The published range is {thickness}. The figure is set by the spindle and fixing screws supplied; a thicker door needs a longer spindle, which we can supply when the thickness is on the order.",
          es: "El rango publicado es {thickness}. Lo fija el cuadradillo y los tornillos suministrados; una puerta más gruesa necesita un cuadradillo más largo, que suministramos si el espesor figura en el pedido.",
          pt: "A faixa publicada é {thickness}. É definida pelo quadrado e pelos parafusos fornecidos; uma porta mais espessa precisa de um quadrado mais longo, que fornecemos quando a espessura consta no pedido.",
        },
        needs: ["thickness"],
      },
      {
        question: { en: "Which steel grade is used?", es: "¿Qué grado de acero se usa?", pt: "Qual grau de aço é usado?" },
        answer: {
          en: "Materials stated on the records are {materials}. Grade 304 is the standard for interior and sheltered entrance doors; ask for 316 when the door faces a coastal or chlorinated environment.",
          es: "Los materiales indicados en las fichas son {materials}. El grado 304 es el estándar para interiores y entradas protegidas; pida 316 cuando la puerta esté en ambiente costero o con cloro.",
          pt: "Os materiais indicados nos registros são {materials}. O grau 304 é o padrão para interiores e entradas abrigadas; peça 316 quando a porta estiver em ambiente costeiro ou com cloro.",
        },
        needs: ["materials"],
      },
      ORDERING,
    ],
  },
  "lever-handles": {
    intro: {
      en: "These are tubular lever handle sets: lever, latch and spindle in one box, bored straight through the door. They are what a hardware wholesaler orders for apartments, hotels and interior doors, in entrance, privacy and passage functions. {count} models, manufactured here, with finishes to match the rest of the door.",
      es: "Son juegos de manija tubulares: manija, picaporte y cuadradillo en una caja, montados a través de la puerta. Es lo que un mayorista de herrajes pide para apartamentos, hoteles y puertas interiores, en funciones de entrada, baño y paso. {count} modelos, fabricados aquí, con acabados a juego con el resto de la puerta.",
      pt: "São conjuntos de maçaneta tubulares: alavanca, trinco e quadrado numa caixa, montados através da porta. É o que um atacadista de ferragens pede para apartamentos, hotéis e portas internas, nas funções entrada, banheiro e passagem. {count} modelos, fabricados aqui, com acabamentos que combinam com o resto da porta.",
    },
    items: [
      {
        question: { en: "What backset and door thickness do the sets take?", es: "¿Qué entrada y espesor de puerta admiten?", pt: "Que backset e espessura de porta aceitam?" },
        answer: {
          en: "Backset is {backset} and door thickness {thickness} across the range; most latches are adjustable between 60 and 70mm, so one set covers both common door preparations.",
          es: "La entrada es {backset} y el espesor de puerta {thickness} en toda la gama; la mayoría de los picaportes son ajustables entre 60 y 70 mm, así que un mismo juego cubre las dos preparaciones de puerta habituales.",
          pt: "O backset é {backset} e a espessura de porta {thickness} em toda a linha; a maioria dos trincos é ajustável entre 60 e 70 mm, então um mesmo conjunto cobre as duas preparações de porta mais comuns.",
        },
        needs: ["backset", "thickness"],
      },
      {
        question: { en: "How many cycles are they tested to?", es: "¿A cuántos ciclos están probados?", pt: "A quantos ciclos foram ensaiados?" },
        answer: {
          en: "The published cycle life is {cycle}. It is a laboratory figure, comparable between products tested the same way, and it is stated on the specification table of each model that carries it.",
          es: "La vida en ciclos publicada es {cycle}. Es un dato de laboratorio, comparable entre productos ensayados del mismo modo, y figura en la tabla de cada modelo que lo indica.",
          pt: "A vida em ciclos publicada é {cycle}. É um dado de laboratório, comparável entre produtos ensaiados da mesma forma, e consta na tabela de cada modelo que o informa.",
        },
        needs: ["cycle"],
      },
      {
        question: { en: "Entrance, privacy or passage — which function do I order?", es: "Entrada, baño o paso: ¿qué función pido?", pt: "Entrada, banheiro ou passagem: qual função peço?" },
        answer: {
          en: "Entrance is keyed outside with a turn button inside; privacy has the turn button and no key, for bathrooms and bedrooms; passage latches without locking. The functions published here are {functions}. Order by function code as well as model number so the two cannot be confused.",
          es: "Entrada lleva llave por fuera y botón por dentro; baño lleva botón sin llave, para aseos y dormitorios; paso solo cierra sin bloquear. Las funciones publicadas aquí son {functions}. Pida con el código de función además del número de modelo para que no se confundan.",
          pt: "Entrada tem chave por fora e botão por dentro; banheiro tem botão sem chave, para banheiros e quartos; passagem apenas fecha sem trancar. As funções publicadas aqui são {functions}. Peça pelo código de função além do número do modelo para não haver confusão.",
        },
        needs: ["functions"],
      },
      ORDERING,
    ],
  },
  "knob-locks": {
    intro: {
      en: "Cylindrical and tubular knob locks in the function sets a commercial or residential specification asks for: entrance, privacy, passage, classroom and communication. Buyers compare our heavy-duty and light-duty ranges by chassis and cycle life; the {count} models are made in our factory for wholesale, project and OEM supply.",
      es: "Cerraduras de pomo cilíndricas y tubulares en las funciones que pide una especificación comercial o residencial: entrada, baño, paso, aula y comunicación. Los compradores comparan nuestras gamas de servicio pesado y ligero por chasis y vida en ciclos; los {count} modelos se fabrican en nuestra planta para mayoristas, proyectos y OEM.",
      pt: "Fechaduras de maçaneta redonda cilíndricas e tubulares nas funções que uma especificação comercial ou residencial pede: entrada, banheiro, passagem, sala de aula e comunicação. Os compradores comparam nossas linhas pesada e leve por chassi e vida em ciclos; os {count} modelos são feitos em nossa fábrica para atacado, projetos e OEM.",
    },
    items: [
      {
        question: { en: "What is the difference between heavy duty and light duty?", es: "¿Qué diferencia hay entre servicio pesado y ligero?", pt: "Qual a diferença entre linha pesada e linha leve?" },
        answer: {
          en: "The chassis. Heavy-duty cylindrical locks use a steel chassis and latch case for schools, offices and heavy residential use; light-duty and tubular locks use a lighter mechanism for standard residential doors. Both share the same backset and door-thickness figures, so the door preparation is the same.",
          es: "El chasis. Las cilíndricas de servicio pesado llevan chasis y caja de picaporte de acero para colegios, oficinas y viviendas de uso intenso; las de servicio ligero y las tubulares llevan un mecanismo más ligero para puertas residenciales estándar. Comparten entrada y espesor de puerta, así que la preparación de la puerta es la misma.",
          pt: "O chassi. As cilíndricas pesadas usam chassi e caixa de trinco em aço para escolas, escritórios e uso residencial intenso; as leves e tubulares usam um mecanismo mais leve para portas residenciais comuns. Ambas compartilham backset e espessura de porta, então a preparação da porta é a mesma.",
        },
      },
      {
        question: { en: "What backset, door thickness and cycle life are published?", es: "¿Qué entrada, espesor y vida en ciclos se publican?", pt: "Que backset, espessura e vida em ciclos são publicados?" },
        answer: {
          en: "Backset {backset}, door thickness {thickness}, cycle life {cycle}. The figures are on each model's table, and the comparison page lists every model side by side.",
          es: "Entrada {backset}, espesor de puerta {thickness}, vida en ciclos {cycle}. Las cifras están en la tabla de cada modelo, y la página de comparación lista todos los modelos lado a lado.",
          pt: "Backset {backset}, espessura de porta {thickness}, vida em ciclos {cycle}. Os valores estão na tabela de cada modelo, e a página de comparação lista todos os modelos lado a lado.",
        },
        needs: ["backset", "thickness", "cycle"],
      },
      {
        question: { en: "Can they be master keyed with the rest of the building?", es: "¿Se pueden amaestrar con el resto del edificio?", pt: "Podem entrar num sistema de chave mestra com o resto do prédio?" },
        answer: {
          en: "Yes. Keyed-alike and master-key systems are cut to a keying schedule agreed before production, and the knob locks can be keyed to match our deadbolts. Send the door list and the levels you need with the inquiry.",
          es: "Sí. Los sistemas de llave igual y amaestramiento se tallan según un plan de llaves acordado antes de producir, y las cerraduras de pomo pueden igualarse con nuestros cerrojos. Envíe la lista de puertas y los niveles que necesita con la consulta.",
          pt: "Sim. Sistemas de chave igual e chave mestra são cortados conforme um plano de chaves acordado antes da produção, e as fechaduras de maçaneta podem ser combinadas com nossos ferrolhos. Envie a lista de portas e os níveis necessários com a consulta.",
        },
      },
      ORDERING,
    ],
  },
  "bathroom-accessories": {
    intro: {
      en: "Stainless steel bathroom accessories for hotel, residential and commercial washrooms: towel rails, robe hooks, paper holders, shelves and shower baskets. Buyers order this range as a matched set in one finish; the {count} models are stamped and polished in our own plant for wholesale and OEM supply.",
      es: "Accesorios de baño en acero inoxidable para hoteles, viviendas y aseos comerciales: toalleros, colgadores, portarrollos, repisas y cestas de ducha. Los compradores piden esta gama como conjunto a juego en un mismo acabado; los {count} modelos se estampan y pulen en nuestra planta para mayoristas y OEM.",
      pt: "Acessórios de banheiro em aço inoxidável para hotéis, residências e sanitários comerciais: toalheiros, cabides, porta-papel, prateleiras e cestos de banho. Os compradores pedem esta linha como conjunto combinado num mesmo acabamento; os {count} modelos são estampados e polidos em nossa fábrica para atacado e OEM.",
    },
    items: [
      {
        question: { en: "What material and wall thickness are the pieces made from?", es: "¿De qué material y espesor de chapa están hechos?", pt: "De que material e espessura de chapa são feitos?" },
        answer: {
          en: "Materials on the records are {materials}; sheet thickness is stated per model where it matters for load, such as shelves and grab rails. Every visible face is polished before finishing.",
          es: "Los materiales indicados son {materials}; el espesor de chapa se indica por modelo donde importa para la carga, como repisas y asideros. Todas las caras visibles se pulen antes del acabado.",
          pt: "Os materiais indicados são {materials}; a espessura de chapa é informada por modelo onde importa para a carga, como prateleiras e barras de apoio. Todas as faces visíveis são polidas antes do acabamento.",
        },
        needs: ["materials"],
      },
      {
        question: { en: "Can I get the whole set in one finish?", es: "¿Puedo pedir todo el conjunto en un mismo acabado?", pt: "Posso pedir o conjunto inteiro num mesmo acabamento?" },
        answer: {
          en: "Yes. Finishes stated across the range are {finishes}; order every piece of a washroom in the same finish code and they are polished and plated together so the tones match.",
          es: "Sí. Los acabados publicados en la gama son {finishes}; pida todas las piezas de un aseo con el mismo código de acabado y se pulen y recubren juntas para que el tono coincida.",
          pt: "Sim. Os acabamentos publicados na linha são {finishes}; peça todas as peças de um banheiro com o mesmo código de acabamento e elas são polidas e revestidas juntas para o tom coincidir.",
        },
        needs: ["finishes"],
      },
      ORDERING,
    ],
  },
  "care-grab-bars": {
    intro: {
      en: "Grab bars for accessible bathrooms and care homes: fixed straight bars and flip-up bars beside the WC, in stainless steel. Specifiers ask for length, fixing centers and whether the bar folds; the {count} models here answer those from the record, and we supply them to distributors and healthcare projects.",
      es: "Asideros para baños accesibles y residencias: barras rectas fijas y abatibles junto al inodoro, en acero inoxidable. Los prescriptores preguntan longitud, distancia de fijación y si la barra se abate; los {count} modelos responden con datos de ficha, y los suministramos a distribuidores y proyectos sanitarios.",
      pt: "Barras de apoio para banheiros acessíveis e casas de repouso: barras retas fixas e articuladas ao lado do vaso, em aço inoxidável. Os especificadores perguntam comprimento, distância de fixação e se a barra dobra; os {count} modelos respondem com dados de registro, e fornecemos a distribuidores e projetos de saúde.",
    },
    items: [
      {
        question: { en: "Which lengths are available?", es: "¿Qué longitudes hay?", pt: "Quais comprimentos existem?" },
        answer: {
          en: "Published lengths run {sizes}. Straight bars are listed by length; flip-up bars by their arm length in the folded and lowered position. Fixing centers are on each model's drawing where one is published.",
          es: "Las longitudes publicadas van de {sizes}. Las barras rectas se listan por longitud; las abatibles por la longitud del brazo plegado y bajado. La distancia de fijación está en el plano de cada modelo cuando se publica.",
          pt: "Os comprimentos publicados vão de {sizes}. As barras retas são listadas por comprimento; as articuladas pelo comprimento do braço dobrado e baixado. A distância de fixação está no desenho de cada modelo quando publicado.",
        },
        needs: ["sizes"],
      },
      {
        question: { en: "What are they made of?", es: "¿De qué están hechos?", pt: "De que são feitos?" },
        answer: {
          en: "{materials}, with the tube wall thickness stated on the model where the record carries it. Ask for a load statement by model before specifying for a care facility; we send the test figure we have and say when we have none.",
          es: "{materials}, con el espesor de pared del tubo indicado en el modelo cuando la ficha lo recoge. Pida la carga admisible por modelo antes de especificar para un centro asistencial; enviamos la cifra de ensayo que tenemos y decimos cuando no la hay.",
          pt: "{materials}, com a espessura de parede do tubo informada no modelo quando o registro a traz. Peça a carga admissível por modelo antes de especificar para uma instituição de cuidados; enviamos o valor de ensaio que temos e dizemos quando não há.",
        },
        needs: ["materials"],
      },
      ORDERING,
    ],
  },
  "brass-steel-hinges": {
    intro: {
      en: "A brass door hinge manufacturer and a stainless steel hinge supplier in one range: butt hinges, ball-bearing hinges, spring hinges, flag hinges and continuous piano hinges for timber, metal and fire doors. Buyers specify by leaf size, thickness and bearing; the {count} models are stamped and finished in our own factory for wholesale and project orders.",
      es: "Fabricante de bisagras de latón y proveedor de bisagras de acero inoxidable en una misma gama: bisagras de libro, de rodamiento, de muelle, de bandera y continuas para puertas de madera, metal y cortafuego. Los compradores especifican por tamaño de pala, espesor y rodamiento; los {count} modelos se estampan y acaban en nuestra planta para mayoristas y proyectos.",
      pt: "Fabricante de dobradiças de latão e fornecedor de dobradiças de aço inoxidável numa só linha: dobradiças de porta, com rolamento, de mola, tipo bandeira e contínuas para portas de madeira, metal e corta-fogo. Os compradores especificam por tamanho de aba, espessura e rolamento; os {count} modelos são estampados e acabados em nossa fábrica para atacado e projetos.",
    },
    items: [
      {
        question: { en: "Which sizes and thicknesses do you make?", es: "¿Qué tamaños y espesores fabrican?", pt: "Quais tamanhos e espessuras vocês fabricam?" },
        answer: {
          en: "Leaf size is stated per model in inches and millimeters — 4\" × 3\" is the most common — in the materials {materials}. Leaf thickness is stated per model, and several sizes are made to order for a project quantity.",
          es: "El tamaño de pala se indica por modelo en pulgadas y milímetros — 4\" × 3\" es el más común — en los materiales {materials}. El espesor de pala se indica por modelo, y varios tamaños se fabrican bajo pedido para cantidades de proyecto.",
          pt: "O tamanho da aba é informado por modelo em polegadas e milímetros — 4\" × 3\" é o mais comum — nos materiais {materials}. A espessura da aba é informada por modelo, e vários tamanhos são feitos sob encomenda para quantidades de projeto.",
        },
        needs: ["materials"],
      },
      {
        question: { en: "Ball bearing or plain bearing?", es: "¿Con rodamiento o sin él?", pt: "Com rolamento ou sem?" },
        answer: {
          en: "Both are in the range. Ball-bearing hinges are specified for heavy leaves and doors in constant use, such as corridors and fire doors with closers; plain-bearing hinges suit residential doors. The bearing type is on the model's record, and the same size is usually offered in both.",
          es: "Ambas opciones están en la gama. Las bisagras de rodamiento se especifican para hojas pesadas y puertas de uso continuo, como pasillos y puertas cortafuego con cierrapuertas; las de fricción sirven para puertas residenciales. El tipo de rodamiento figura en la ficha del modelo, y el mismo tamaño suele ofrecerse en ambas versiones.",
          pt: "As duas opções estão na linha. Dobradiças com rolamento são especificadas para folhas pesadas e portas de uso contínuo, como corredores e portas corta-fogo com mola; as de mancal simples servem para portas residenciais. O tipo de mancal consta no registro do modelo, e o mesmo tamanho costuma existir nas duas versões.",
        },
      },
      {
        question: { en: "Which finishes can I order hinges in?", es: "¿En qué acabados puedo pedir las bisagras?", pt: "Em que acabamentos posso pedir as dobradiças?" },
        answer: {
          en: "Stainless hinges are supplied satin or polished from the base metal. Brass and steel hinges are plated — polished brass, satin brass, antique brass, antique copper and chrome are the codes on the records, with other finishes to order — and the finish code goes on the order line with the size.",
          es: "Las bisagras de inoxidable van satinadas o pulidas sobre el propio metal. Las de latón y acero van recubiertas — latón pulido, latón satinado, latón antiguo, cobre antiguo y cromo son los códigos de las fichas, con otros acabados bajo pedido — y el código de acabado se anota en la línea de pedido junto al tamaño.",
          pt: "Dobradiças em inox são fornecidas acetinadas ou polidas no próprio metal. As de latão e aço são revestidas — latão polido, latão acetinado, latão envelhecido, cobre envelhecido e cromo são os códigos dos registros, com outros acabamentos sob encomenda — e o código de acabamento vai na linha do pedido junto com o tamanho.",
        },
      },
      ORDERING,
    ],
  },
  deadbolts: {
    intro: {
      en: "Single- and double-cylinder deadbolts for residential entrance doors, bought by hardware distributors alongside our knob locks and lever sets so the whole door keys alike. The {count} models are made here with a 25mm throw and an adjustable backset.",
      es: "Cerrojos de cilindro simple y doble para puertas de entrada residenciales, que los distribuidores compran junto con nuestras cerraduras de pomo y juegos de manija para que toda la puerta abra con la misma llave. Los {count} modelos se fabrican aquí con 25 mm de recorrido y entrada ajustable.",
      pt: "Ferrolhos de cilindro simples e duplo para portas de entrada residenciais, comprados por distribuidores junto com nossas fechaduras de maçaneta e conjuntos de alavanca para que toda a porta use a mesma chave. Os {count} modelos são feitos aqui com 25 mm de curso e backset ajustável.",
    },
    items: [
      {
        question: { en: "What backset and throw do they have?", es: "¿Qué entrada y recorrido tienen?", pt: "Que backset e curso têm?" },
        answer: {
          en: "Backset {backset}, adjustable on the latch; deadbolt throw {throw}. Door thickness accepted is {thickness}, so the same deadbolt fits the standard residential door preparations without a new bore.",
          es: "Entrada {backset}, ajustable en el pestillo; recorrido del cerrojo {throw}. El espesor de puerta admitido es {thickness}, así que el mismo cerrojo encaja en las preparaciones residenciales estándar sin taladrar de nuevo.",
          pt: "Backset {backset}, ajustável no trinco; curso do ferrolho {throw}. A espessura de porta aceita é {thickness}, então o mesmo ferrolho serve nas preparações residenciais padrão sem novo furo.",
        },
        needs: ["backset", "throw", "thickness"],
      },
      {
        question: { en: "Single or double cylinder — which one?", es: "¿Cilindro simple o doble?", pt: "Cilindro simples ou duplo?" },
        answer: {
          en: "Single cylinder has a thumbturn inside and is the usual choice for an entrance door, because it opens from inside without a key. Double cylinder needs a key on both sides and is specified where a glazed panel sits within reach of the lock. Check local egress rules before choosing double cylinder on an exit door.",
          es: "El de cilindro simple lleva mariposa por dentro y es la elección habitual para una puerta de entrada, porque abre desde dentro sin llave. El de doble cilindro necesita llave por ambos lados y se especifica cuando hay un panel acristalado al alcance de la cerradura. Consulte la normativa local de evacuación antes de elegir doble cilindro en una puerta de salida.",
          pt: "O de cilindro simples tem borboleta por dentro e é a escolha habitual para porta de entrada, porque abre por dentro sem chave. O de cilindro duplo exige chave dos dois lados e é especificado quando há vidro ao alcance da fechadura. Verifique as regras locais de evacuação antes de escolher cilindro duplo numa porta de saída.",
        },
      },
      ORDERING,
    ],
  },
  "door-closers": {
    intro: {
      en: "A door closer manufacturer in China supplying overhead closers with aluminum bodies for commercial, office and fire doors, plus a floor hinge for timber doors. Buyers select by door width and leaf weight, then ask for a double-door coordinator where a pair must close in order. {count} models, made in our own plant.",
      es: "Fabricante de cierrapuertas en China que suministra cierrapuertas aéreos con cuerpo de aluminio para puertas comerciales, de oficina y cortafuego, más una bisagra de suelo para puertas de madera. Los compradores eligen por ancho de puerta y peso de hoja, y piden un selector de cierre cuando un par de hojas debe cerrar en orden. {count} modelos, fabricados en nuestra planta.",
      pt: "Fabricante de molas de porta na China que fornece molas aéreas com corpo de alumínio para portas comerciais, de escritório e corta-fogo, além de uma dobradiça de piso para portas de madeira. Os compradores escolhem por largura de porta e peso da folha, e pedem um coordenador de portas duplas quando um par precisa fechar em ordem. {count} modelos, feitos em nossa fábrica.",
    },
    items: [
      {
        question: { en: "Which closer fits my door width and weight?", es: "¿Qué cierrapuertas le va a mi ancho y peso de puerta?", pt: "Qual mola serve para a largura e o peso da minha porta?" },
        answer: {
          en: "Published door widths run {doorWidth} and leaf capacities {capacity}. Pick the model whose band contains your leaf weight, then confirm the mounting position on the drawing; an exposed door or a wind load moves the choice one band up.",
          es: "Los anchos de puerta publicados van de {doorWidth} y las capacidades de hoja son {capacity}. Elija el modelo cuya banda contenga el peso de su hoja y confirme la posición de montaje en el plano; una puerta expuesta o con carga de viento sube la elección una banda.",
          pt: "As larguras de porta publicadas vão de {doorWidth} e as capacidades de folha são {capacity}. Escolha o modelo cuja faixa contenha o peso da sua folha e confirme a posição de montagem no desenho; uma porta exposta ou com carga de vento sobe a escolha uma faixa.",
        },
        needs: ["doorWidth", "capacity"],
      },
      {
        question: { en: "Is the closing speed adjustable, and is there hold-open?", es: "¿La velocidad de cierre es ajustable y hay retención?", pt: "A velocidade de fechamento é ajustável e há retenção aberta?" },
        answer: {
          en: "Closing speed and latching speed are adjusted with the valves on the body; the record for each model says whether a hold-open arm is offered. Hold-open must not be used on a fire door, which has to close every time.",
          es: "La velocidad de cierre y la de golpe final se regulan con las válvulas del cuerpo; la ficha de cada modelo indica si se ofrece brazo con retención. La retención no debe usarse en una puerta cortafuego, que tiene que cerrar siempre.",
          pt: "A velocidade de fechamento e a de trinco são reguladas pelas válvulas do corpo; o registro de cada modelo diz se há braço com retenção aberta. A retenção não deve ser usada em porta corta-fogo, que precisa fechar sempre.",
        },
      },
      {
        question: { en: "Do you have a certified closer for fire doors?", es: "¿Tienen cierrapuertas certificado para puertas cortafuego?", pt: "Vocês têm mola certificada para portas corta-fogo?" },
        answer: {
          en: "Test reports are published per model on the certificates page; a closer without a report is not described as fire-door rated. Ask for the report by model number, and for a double fire door add a coordinator so the inactive leaf closes first.",
          es: "Los informes de ensayo se publican por modelo en la página de certificados; un cierrapuertas sin informe no se presenta como apto para cortafuego. Pida el informe por número de modelo y, en una puerta cortafuego doble, añada un selector de cierre para que la hoja pasiva cierre primero.",
          pt: "Os relatórios de ensaio são publicados por modelo na página de certificados; uma mola sem relatório não é apresentada como apta para corta-fogo. Peça o relatório pelo número do modelo e, numa porta corta-fogo dupla, acrescente um coordenador para que a folha inativa feche primeiro.",
        },
      },
      ORDERING,
    ],
  },
  "grip-handle-sets": {
    intro: {
      en: "Grip handle sets for entrance doors: a long pull outside, a lever inside, latch and deadbolt in one box. Distributors order them for residential and apartment entrances in the finish of the rest of the door; the {count} models are made here with an adjustable backset.",
      es: "Juegos de manillón para puertas de entrada: un tirador largo por fuera, manija por dentro, picaporte y cerrojo en una caja. Los distribuidores los piden para entradas de vivienda y apartamento en el acabado del resto de la puerta; los {count} modelos se fabrican aquí con entrada ajustable.",
      pt: "Conjuntos de puxador de entrada: um puxador longo por fora, alavanca por dentro, trinco e ferrolho numa caixa. Os distribuidores pedem para entradas residenciais e de apartamento no acabamento do resto da porta; os {count} modelos são feitos aqui com backset ajustável.",
    },
    items: [
      {
        question: { en: "What door preparation do they need?", es: "¿Qué preparación de puerta necesitan?", pt: "Que preparação de porta exigem?" },
        answer: {
          en: "Backset {backset}, door thickness {thickness}, deadbolt throw {throw}. Two bores in the door face for latch and deadbolt, at the centers on the model's drawing.",
          es: "Entrada {backset}, espesor de puerta {thickness}, recorrido del cerrojo {throw}. Dos taladros en la cara de la puerta para picaporte y cerrojo, a la distancia indicada en el plano del modelo.",
          pt: "Backset {backset}, espessura de porta {thickness}, curso do ferrolho {throw}. Dois furos na face da porta para trinco e ferrolho, na distância indicada no desenho do modelo.",
        },
        needs: ["backset", "thickness", "throw"],
      },
      {
        question: { en: "Can the deadbolt be keyed to match my other locks?", es: "¿El cerrojo se puede igualar con mis otras cerraduras?", pt: "O ferrolho pode ter a mesma chave das minhas outras fechaduras?" },
        answer: {
          en: "Yes. The cylinder can be keyed alike with our bored locks and deadbolts, or cut into a master-key system. State the keying with the order; cylinders are cut before shipment.",
          es: "Sí. El cilindro puede igualarse con nuestras cerraduras de embutir y cerrojos, o integrarse en un amaestramiento. Indique el plan de llaves con el pedido; los cilindros se tallan antes del envío.",
          pt: "Sim. O cilindro pode ter chave igual às nossas fechaduras e ferrolhos, ou entrar num sistema de chave mestra. Informe o plano de chaves no pedido; os cilindros são cortados antes do embarque.",
        },
      },
      ORDERING,
    ],
  },
  "glass-door-accessories": {
    intro: {
      en: "Patch fittings, glass door locks and pull handles for frameless toughened glass doors in shopfronts and offices. A patch fitting is specified by the glass thickness it clamps; the {count} models here are stainless steel and are supplied to glaziers, shopfitters and distributors.",
      es: "Herrajes de pinza, cerraduras para puerta de vidrio y tiradores para puertas de vidrio templado sin marco en locales y oficinas. Una pinza se especifica por el espesor de vidrio que aprieta; los {count} modelos son de acero inoxidable y se suministran a cristaleros, montadores de locales y distribuidores.",
      pt: "Ferragens tipo patch, fechaduras para porta de vidro e puxadores para portas de vidro temperado sem caixilho em lojas e escritórios. Um patch fitting é especificado pela espessura do vidro que prende; os {count} modelos são de aço inoxidável e fornecidos a vidraceiros, montadores de lojas e distribuidores.",
    },
    items: [
      {
        question: { en: "Which glass thickness do the patch fittings take?", es: "¿Qué espesor de vidrio admiten las pinzas?", pt: "Que espessura de vidro os patch fittings aceitam?" },
        answer: {
          en: "The published range is {thickness}. Toughened glass cannot be cut after tempering, so the fitting is chosen to the glass, not the other way round; give us the glass thickness and the cut-out drawing with the inquiry.",
          es: "El rango publicado es {thickness}. El vidrio templado no se puede cortar después del templado, así que la pinza se elige según el vidrio y no al revés; indíquenos el espesor del vidrio y el plano de mecanizado en la consulta.",
          pt: "A faixa publicada é {thickness}. O vidro temperado não pode ser cortado após a têmpera, então a ferragem é escolhida conforme o vidro e não o contrário; informe a espessura do vidro e o desenho do recorte na consulta.",
        },
        needs: ["thickness"],
      },
      {
        question: { en: "What lengths are the pull handles?", es: "¿De qué longitudes son los tiradores?", pt: "Quais os comprimentos dos puxadores?" },
        answer: {
          en: "Published handle lengths run {sizes}, back-to-back through drilled glass with no frame to fix to. Center distance is on each model's record where it is stated.",
          es: "Las longitudes publicadas van de {sizes}, en montaje pasante a través del vidrio taladrado, sin marco al que fijarse. La distancia entre ejes figura en la ficha de cada modelo cuando se indica.",
          pt: "Os comprimentos publicados vão de {sizes}, em montagem passante pelo vidro furado, sem caixilho para fixar. A distância entre centros consta no registro de cada modelo quando informada.",
        },
        needs: ["sizes"],
      },
      ORDERING,
    ],
  },
  "hardware-accessories": {
    intro: {
      en: "The parts that finish a door schedule: latches for tubular levers, flush bolts and door coordinators for double doors, door viewers, door stops, security door guards, occupied indicators for cubicles and power-transfer devices for electrified locks. A latch hardware catalog in one place: {count} models, made or finished here.",
      es: "Las piezas que completan una relación de puertas: picaportes para manijas tubulares, pasadores y selectores de cierre para puertas dobles, mirillas, topes, cadenas de seguridad, indicadores de libre/ocupado para cabinas y pasacables para cerraduras eléctricas. Un catálogo de accesorios en un solo sitio: {count} modelos, fabricados o acabados aquí.",
      pt: "As peças que completam uma lista de portas: trincos para alavancas tubulares, ferrolhos embutidos e coordenadores para portas duplas, olhos mágicos, batentes, correntes de segurança, indicadores livre/ocupado para cabines e passa-cabos para fechaduras elétricas. Um catálogo de acessórios num só lugar: {count} modelos, fabricados ou acabados aqui.",
    },
    items: [
      {
        question: { en: "Which latch fits my lever set?", es: "¿Qué picaporte le va a mi juego de manija?", pt: "Qual trinco serve para o meu conjunto de alavanca?" },
        answer: {
          en: "Match the backset first: latches here are published at {backset}, with the faceplate size on each record. A 60/70mm adjustable latch covers both common door preparations for tubular lever and knob sets.",
          es: "Empiece por la entrada: los picaportes publicados aquí son de {backset}, con el tamaño de frente en cada ficha. Un picaporte ajustable 60/70 mm cubre las dos preparaciones habituales para juegos tubulares de manija y pomo.",
          pt: "Comece pelo backset: os trincos publicados aqui são de {backset}, com o tamanho da testa em cada registro. Um trinco ajustável 60/70 mm cobre as duas preparações mais comuns para conjuntos tubulares de alavanca e maçaneta.",
        },
        needs: ["backset"],
      },
      {
        question: { en: "What do I need for a double door?", es: "¿Qué necesito para una puerta doble?", pt: "O que preciso para uma porta dupla?" },
        answer: {
          en: "Flush bolts to hold the inactive leaf, and a door coordinator (door selector) where both leaves have closers, so the inactive leaf closes first and the active leaf latches over it. On a fire door pair both are required for the latch to engage.",
          es: "Pasadores para sujetar la hoja pasiva y un selector de cierre cuando las dos hojas llevan cierrapuertas, para que la pasiva cierre primero y la activa quede sobre ella. En un par cortafuego se necesitan ambos para que el picaporte engatille.",
          pt: "Ferrolhos embutidos para segurar a folha inativa e um coordenador de portas quando as duas folhas têm mola, para que a inativa feche primeiro e a ativa trave sobre ela. Num par corta-fogo os dois são necessários para o trinco engatar.",
        },
      },
      ORDERING,
    ],
  },
  "lock-cases": {
    intro: {
      en: "Mortise lock cases for timber, metal and aluminum narrow-stile doors, bought by distributors and door manufacturers who fit their own handles and cylinders. A lock body is specified by two numbers, backset and center distance, and both are in the model name of most of the {count} cases we make.",
      es: "Cajas de cerradura de embutir para puertas de madera, metal y perfil estrecho de aluminio, que compran distribuidores y fabricantes de puertas que montan sus propias manijas y cilindros. Una caja se especifica con dos números, entrada y distancia entre ejes, y ambos están en el nombre de la mayoría de las {count} cajas que fabricamos.",
      pt: "Caixas de fechadura de embutir para portas de madeira, metal e perfil estreito de alumínio, compradas por distribuidores e fabricantes de portas que montam suas próprias maçanetas e cilindros. Uma caixa é especificada por dois números, backset e distância entre centros, e ambos estão no nome da maioria das {count} caixas que fabricamos.",
    },
    items: [
      {
        question: { en: "What backset and center distance do you make?", es: "¿Qué entrada y distancia entre ejes fabrican?", pt: "Que backset e distância entre centros vocês fabricam?" },
        answer: {
          en: "Backset {backset} and center distance {center} across the range. An 85mm center with a 60mm backset is the most common European case; the narrow-stile cases go down to a 25–30mm backset for aluminum doors.",
          es: "Entrada {backset} y distancia entre ejes {center} en toda la gama. Ejes a 85 mm con entrada de 60 mm es la caja europea más habitual; las cajas de perfil estrecho bajan a 25–30 mm de entrada para puertas de aluminio.",
          pt: "Backset {backset} e distância entre centros {center} em toda a linha. Centros a 85 mm com backset de 60 mm é a caixa europeia mais comum; as caixas de perfil estreito descem a 25–30 mm de backset para portas de alumínio.",
        },
        needs: ["backset", "center"],
      },
      {
        question: { en: "Do they take a euro profile cylinder?", es: "¿Admiten cilindro de perfil europeo?", pt: "Aceitam cilindro de perfil europeu?" },
        answer: {
          en: "The cases with a cylinder hole take a euro profile cylinder, sized to the door thickness; our lock cylinders page lists the published lengths. Cylinder and handles are ordered separately from the case, which is how door factories want it.",
          es: "Las cajas con taladro de cilindro admiten cilindro de perfil europeo, a la medida del espesor de puerta; nuestra página de cilindros lista los largos publicados. El cilindro y las manijas se piden aparte de la caja, que es como lo quieren las fábricas de puertas.",
          pt: "As caixas com furo de cilindro aceitam cilindro de perfil europeu, dimensionado pela espessura da porta; nossa página de cilindros lista os comprimentos publicados. Cilindro e maçanetas são pedidos separadamente da caixa, que é como as fábricas de portas preferem.",
        },
      },
      {
        question: { en: "Will your case fit another brand's faceplate cut-out?", es: "¿Su caja encaja en el mecanizado de otra marca?", pt: "A sua caixa serve no recorte de outra marca?" },
        answer: {
          en: "Often, when backset, center distance and faceplate size match. Send the faceplate drawing or the existing model number; we compare it against the drawings we publish and say which case is a drop-in and which needs a new cut-out.",
          es: "A menudo sí, cuando coinciden entrada, distancia entre ejes y tamaño de frente. Envíe el plano del frente o el número de modelo actual; lo comparamos con los planos que publicamos y le decimos qué caja entra directa y cuál necesita nuevo mecanizado.",
          pt: "Muitas vezes sim, quando backset, distância entre centros e tamanho da testa coincidem. Envie o desenho da testa ou o número de modelo atual; comparamos com os desenhos que publicamos e dizemos qual caixa entra direto e qual precisa de novo recorte.",
        },
      },
      ORDERING,
    ],
  },
  "lock-cylinders": {
    intro: {
      en: "Euro profile lock cylinders in solid brass, single, double and thumbturn, supplied keyed to differ, keyed alike or as a master-key system for a whole project. Buyers order by overall length and split; the {count} models here are made and pinned in our own factory.",
      es: "Cilindros de perfil europeo en latón macizo, simples, dobles y con mariposa, suministrados con llaves distintas, llave igual o como sistema de amaestramiento para todo un proyecto. Los compradores piden por largo total y reparto; los {count} modelos se fabrican y montan en nuestra planta.",
      pt: "Cilindros de perfil europeu em latão maciço, simples, duplos e com borboleta, fornecidos com chaves diferentes, chave igual ou como sistema de chave mestra para um projeto inteiro. Os compradores pedem por comprimento total e divisão; os {count} modelos são feitos e pinados em nossa fábrica.",
    },
    items: [
      {
        question: { en: "Which lengths and splits are available?", es: "¿Qué largos y repartos hay?", pt: "Quais comprimentos e divisões existem?" },
        answer: {
          en: "Published lengths run {sizes}. The split is chosen from the door thickness and the trim on each side; our euro cylinder calculator works it out from those two figures, and the length goes on the order line.",
          es: "Los largos publicados van de {sizes}. El reparto se calcula a partir del espesor de puerta y del herraje de cada lado; nuestra calculadora de cilindros lo obtiene con esos dos datos, y el largo se anota en la línea de pedido.",
          pt: "Os comprimentos publicados vão de {sizes}. A divisão é definida pela espessura da porta e pelo acabamento de cada lado; nossa calculadora de cilindro a obtém desses dois valores, e o comprimento vai na linha do pedido.",
        },
        needs: ["sizes"],
      },
      {
        question: { en: "Can you supply them keyed alike or master keyed?", es: "¿Pueden suministrarlos con llave igual o amaestrados?", pt: "Podem fornecer com chave igual ou chave mestra?" },
        answer: {
          en: "Yes. Keyed alike, keyed to differ in groups, and master-key hierarchies from one master down to change keys are cut to a keying schedule agreed before production. The schedule cannot be changed after the cylinders are pinned without new cylinders.",
          es: "Sí. Llave igual, llaves distintas por grupos y jerarquías de amaestramiento desde una maestra hasta las llaves de cambio se tallan según un plan de llaves acordado antes de producir. El plan no puede cambiarse después de montar los cilindros sin cilindros nuevos.",
          pt: "Sim. Chave igual, chaves diferentes por grupos e hierarquias de chave mestra desde uma mestra até as chaves de mudança são cortadas conforme um plano de chaves acordado antes da produção. O plano não pode ser alterado depois de pinar os cilindros sem cilindros novos.",
        },
      },
      ORDERING,
    ],
  },
  "sliding-hook-locks": {
    intro: {
      en: "Hook locks for sliding doors, where a straight bolt cannot travel out of the edge: the hook swings from the case into the keep. The {count} models here are zinc alloy, made for pocket doors and sliding partitions, and are supplied to distributors and door manufacturers.",
      es: "Cerraduras de gancho para puertas correderas, donde un cerrojo recto no puede salir por el canto: el gancho gira desde la caja hasta el cerradero. Los {count} modelos son de aleación de zinc, para puertas correderas y tabiques móviles, y se suministran a distribuidores y fabricantes de puertas.",
      pt: "Fechaduras de gancho para portas de correr, onde um ferrolho reto não pode sair pela borda: o gancho gira da caixa para a chapa-testa. Os {count} modelos são em liga de zinco, feitos para portas de correr e divisórias móveis, e fornecidos a distribuidores e fabricantes de portas.",
    },
    items: [
      {
        question: { en: "What sizes are the hook locks?", es: "¿De qué tamaños son las cerraduras de gancho?", pt: "Quais os tamanhos das fechaduras de gancho?" },
        answer: {
          en: "Published lengths run {sizes}, in {materials}. The case drawing gives the mortise depth and the keep position; both are needed before the door is routed.",
          es: "Los largos publicados van de {sizes}, en {materials}. El plano de la caja da la profundidad de la caja y la posición del cerradero; ambos hacen falta antes de fresar la puerta.",
          pt: "Os comprimentos publicados vão de {sizes}, em {materials}. O desenho da caixa dá a profundidade do encaixe e a posição da chapa-testa; os dois são necessários antes de fresar a porta.",
        },
        needs: ["sizes", "materials"],
      },
      ORDERING,
    ],
  },
};
