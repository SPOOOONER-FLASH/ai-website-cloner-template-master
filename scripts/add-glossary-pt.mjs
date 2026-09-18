#!/usr/bin/env node
/**
 * Adds the Portuguese glossary to src/data/hardware-terms.ts.
 *
 * WHY THE GLOSSARY IS WORTH TRANSLATING AT ALL. It is the page with the highest ratio of
 * our own sentences to everybody else's. Every definition on it is interchangeable with
 * any other supplier's definition of the same word; the SECOND paragraph is not — "uma
 * porta já furada para 60 mm não aceita uma fechadura de 70" is a thing we have watched
 * happen, and it is what an answer engine quotes. Leaving those 23 second paragraphs in
 * English on the Portuguese tree left the one page that argues we have fitted these
 * things speaking a language the reader did not come for.
 *
 * BRAZILIAN VOCABULARY, DECIDED ONCE AND USED EVERYWHERE. The trade words here differ
 * between Brazil and Portugal, and a page that mixes them reads as translated rather than
 * written. This file fixes the choices so later sessions do not re-decide them:
 *
 *   latch        → lingueta  (never "trinco" alone, which also means the whole latch set)
 *   deadbolt     → trava
 *   strike       → contratesta
 *   spindle      → eixo quadrado
 *   rose         → roseta
 *   trim         → guarnição externa
 *   cross bore   → furo passante
 *   backset      → backset  (kept in English: it is what the buyer writes on the order,
 *                            and "distância ao eixo" is ambiguous with centre distance)
 *   handing      → mão da porta
 *   master key   → chave-mestra
 *
 * The figures are carried, not re-expressed: 60mm stays 60 mm, 2-3/8″ stays 2-3/8″,
 * 200,000 becomes 200.000 because that is the Brazilian thousands separator and the
 * number is the same number.
 *
 * Idempotent. Run it twice and nothing changes.
 *
 * Usage: node scripts/add-glossary-pt.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";

const FILE = "src/data/hardware-terms.ts";

/** id -> { term, definition, consequence } in Portuguese. */
const PT = {
  backset: {
    term: "Backset",
    definition:
      "A distância entre a borda da porta e o centro do eixo — o furo em que a maçaneta gira. 60 mm é de longe a medida mais frequente na nossa linha e muitos modelos são reguláveis em obra entre 60 e 70 mm; a faixa publicada completa vai de 16 a 90 mm. A América do Norte escreve esses mesmos dois números como 2-3/8″ e 2-3/4″.",
    consequence:
      "É o número errado mais comum num pedido de ferragens. Uma porta já furada para 60 mm não aceita uma fechadura de 70: a maçaneta fica fora de lugar e a lingueta não alcança a contratesta. O metal não se ajusta em obra, então um backset errado é um contêiner que acaba estocado em vez de instalado.",
  },
  "centre-distance": {
    term: "Distância entre eixos",
    definition:
      "O nosso catálogo usa este rótulo para duas medidas diferentes, e vale saber qual delas você está lendo. Numa caixa de fechadura de embutir é a distância do centro do cilindro ao centro do eixo — publicamos 45, 65, 68, 72, 85 e 92 mm, das quais 72 e 85 são as medidas europeias usuais. Num puxador ou numa ferragem para porta de vidro é a distância entre os dois pontos de fixação, de 125 a 179 mm na nossa linha.",
    consequence:
      "Numa caixa de fechadura, a distância entre eixos decide onde ficam os dois furos na face da porta. Se ela estiver errada, o furo do cilindro e o da maçaneta não coincidem com a fechadura: o que se perde é a porta, não a fechadura.",
  },
  "door-thickness": {
    term: "Espessura da porta",
    definition:
      "A faixa de espessura de folha para a qual o produto foi construído. É uma faixa, e não um número, porque o eixo e os parafusos de fixação têm curso.",
    consequence:
      "Abaixo da faixa os parafusos encostam no fundo e as rosetas ficam salientes; acima dela o eixo não atravessa, e nenhuma força resolve. É a medida a conferir primeiro numa porta de vidro ou de alumínio, cujas folhas são mais finas do que a marcenaria para a qual a fechadura foi desenhada.",
  },
  "deadbolt-throw": {
    term: "Curso da trava",
    definition:
      "Quanto a trava avança para fora da testa da fechadura quando totalmente lançada. A nossa medida publicada é 25 mm.",
    consequence:
      "O curso define a profundidade do rebaixo que precisa ser aberto no batente, e vários mercados fixam um curso mínimo em norma para portas de entrada. Um curso curto num batente muito rebaixado deixa uma trava que pode ser alavancada.",
  },
  projection: {
    term: "Saliência",
    definition:
      "Quanto a maçaneta, a barra ou a ferragem avança para fora da face da porta.",
    consequence:
      "Ela é descontada da largura livre de um corredor, e numa rota de fuga essa largura é regulamentada. Uma barra antipânico com 70 mm de saliência num corredor de 900 mm é um problema de especificação, não de gosto.",
  },
  standoff: {
    term: "Afastamento do puxador",
    definition:
      "O vão entre a barra do puxador e a face da porta — o espaço por onde entram os dedos. Os nossos são publicados em 18,5 e 26 mm.",
    consequence:
      "Pequeno demais, uma mão com luva não consegue usá-lo, o que importa numa câmara fria ou na entrada de uma oficina. Normas de acessibilidade de vários mercados fixam um mínimo.",
  },
  "cross-bore": {
    term: "Furo passante",
    definition:
      "O furo grande que atravessa a face da porta e onde se aloja o chassi de uma fechadura cilíndrica. O nosso é publicado com 51 mm.",
    consequence:
      "Um furo é um buraco que já existe. Um chassi maior do que o furo obriga a refurar uma porta já pendurada; um chassi bem menor deixa a roseta cobrindo nada.",
  },
  "fixing-centre": {
    term: "Entre-eixos de fixação",
    definition:
      "A distância entre os centros dos furos dos parafusos que prendem uma ferragem à porta.",
    consequence:
      "É a medida que decide se uma ferragem de reposição cai sobre os furos que a porta já tem. É também a medida com menos cobertura no nosso catálogo, e preferimos dizer isso a publicar uma aproximada — pergunte, e medimos a peça.",
  },
  "glass-gap": {
    term: "Espessura de vidro aceita",
    definition:
      "A espessura de vidro que uma ferragem de aperto ou uma fechadura para porta de vidro é usinada para prender. As nossas são publicadas em 7, 7,5 e 8 mm.",
    consequence:
      "O vidro temperado não pode ser cortado nem furado depois da têmpera. Uma ferragem que não corresponde ao vidro é uma ferragem esperando por uma chapa nova, o prazo mais longo de todo o vão.",
  },
  handing: {
    term: "Mão da porta",
    definition:
      "Em que borda a porta está pendurada e para que lado ela abre, descrito a partir de um ponto de vista fixo para que duas pessoas possam concordar sobre isso. Muitos dos nossos modelos são reversíveis, o que quer dizer que a mão é definida na instalação e não no pedido.",
    consequence:
      "A mão é o campo que mais se preenche de memória, e as duas convenções de uso corrente discordam entre si. Quando um modelo é reversível a pergunta desaparece, e por isso vale conferir antes de decidir, não depois.",
  },
  chassis: {
    term: "Chassi",
    definition:
      "O corpo mecânico de uma fechadura cilíndrica — a parte que fica dentro do furo passante e transforma o giro da maçaneta em movimento da lingueta. As guarnições são parafusadas nele pelas duas faces.",
    consequence:
      "O grau é uma propriedade do chassi, não da maçaneta que se vê. Duas fechaduras com maçanetas idênticas e chassis diferentes são produtos diferentes, e o número de ciclos pertence ao chassi.",
  },
  latch: {
    term: "Lingueta",
    definition:
      "A lingueta com mola e uma face chanfrada que mantém fechada uma porta encostada e recolhe quando a maçaneta gira. Não é uma trava: uma lingueta pode ser empurrada para dentro, uma trava não.",
    consequence:
      "Uma porta corta-fogo precisa travar, não apenas encostar. Se a lingueta não entra na contratesta, a folha não está presa por nada, e uma folha presa por nada não é uma porta corta-fogo por mais classificada que seja.",
  },
  strike: {
    term: "Contratesta",
    definition:
      "A chapa embutida no batente em que a lingueta ou a trava entra. O lábio dela guia a lingueta enquanto a porta fecha.",
    consequence:
      "Uma contratesta montada alguns milímetros fora de posição é a razão habitual de uma porta nova não travar, e é a coisa mais barata de corrigir no vão. Numa entrada o material importa: sob força, quem cede primeiro é uma contratesta fina, não a fechadura.",
  },
  spindle: {
    term: "Eixo quadrado",
    definition:
      "A barra quadrada de aço que atravessa a fechadura e leva o giro da maçaneta de um lado da porta ao outro. Os nossos são de 8 mm e 9 mm.",
    consequence:
      "8 mm e 9 mm se parecem numa fotografia e não são intercambiáveis: um eixo de 8 num seguidor de 9 tem folga, e a folga vira uma maçaneta caída e depois um mecanismo gasto. Confira o quadrado antes de misturar maçaneta de um fornecedor com fechadura de outro.",
  },
  cylinder: {
    term: "Cilindro",
    definition:
      "O núcleo removível acionado por chave. O cilindro decide a chave; a caixa da fechadura decide a função. Como ele sai sem mexer na fechadura, é a peça em torno da qual se escreve um plano de chave-mestra.",
    consequence:
      "Um cilindro com a medida errada para a porta fica saliente e pode ser agarrado e quebrado; curto demais, não alcança a came. O comprimento é dado pela porta, não pela fechadura.",
  },
  trim: {
    term: "Guarnição externa",
    definition:
      "As peças da face externa — maçaneta, bola, puxador ou espelho — fornecidas separadamente do mecanismo que acionam. Numa barra antipânico, a barra é o lado de dentro e a guarnição é o lado de fora, e são duas linhas de pedido.",
    consequence:
      "É a leitura errada mais comum do nosso próprio catálogo, e por isso catorze fichas foram renomeadas em 2026-09-14: uma ficha chamada “035 Panic Exit Device” era a guarnição externa, e não a barra. Pedir a errada chega como meia porta.",
  },
  rose: {
    term: "Roseta",
    definition:
      "A chapa redonda atrás da maçaneta ou da bola que cobre as fixações e o furo. As nossas vão de 36 a 75 mm de diâmetro conforme a linha — o catálogo a chama de roseta nas linhas de maçaneta e de rosette nas linhas de bola e de banheiro, e é a mesma peça.",
    consequence:
      "Quando uma fechadura é substituída, a roseta nova precisa cobrir a marca que a antiga deixou. Uma roseta menor numa reforma significa massa e pintura em todas as folhas.",
  },
  "cycle-life": {
    term: "Vida em ciclos",
    definition:
      "O número de ciclos de abertura e fechamento que o produto completou em ensaio de laboratório sem falhar. A nossa cifra publicada é de 200.000 ciclos.",
    consequence:
      "É um resultado de ensaio, não uma garantia nem uma vida útil. É comparável entre produtos ensaiados pela mesma norma e não significa nada entre produtos ensaiados por normas diferentes — que é a primeira pergunta a fazer quando dois fornecedores citam o mesmo número.",
  },
  keying: {
    term: "Sistema de chaves",
    definition:
      "Como um conjunto de fechaduras se relaciona com um conjunto de chaves. Chaves diferentes: cada fechadura com a sua. Chaves iguais: uma chave abre um grupo. Chave-mestra: cada fechadura tem a sua chave e uma chave acima abre todas.",
    consequence:
      "Um plano de chave-mestra precisa ser decidido antes de os cilindros serem cifrados, e não depois que eles chegam. Mudar a hierarquia mais tarde significa cilindros novos para todas as portas do grupo — é para isso que existe a planilha do plano.",
  },
  function: {
    term: "Função",
    definition:
      "O que a fechadura faz, e não com o que ela se parece: entrada (com chave por fora), banheiro (botão de giro por dentro, destrave de emergência por fora), passagem (só lingueta, sem travamento), sala de aula, comunicação. A função são as duas últimas letras do nosso código de pedido.",
    consequence:
      "Duas fechaduras visualmente idênticas podem ser uma de banheiro e uma de entrada. Especifique um conjunto de banheiro num almoxarifado e ele não aceita chave; especifique um de entrada num banheiro e não há como entrar quando alguém desmaia atrás da porta.",
  },
  grade: {
    term: "Grau",
    definition:
      "Uma classe de desempenho conferida por uma norma de ensaio — ANSI/BHMA Grau 1, 2 e 3 na América do Norte, EN 1125 e EN 179 para ferragens de saída de emergência na Europa. Um grau pertence sempre a um modelo nomeado, ensaiado como conjunto completo.",
    consequence:
      "Grau não é propriedade de uma fábrica nem de um catálogo. Se um fornecedor diz que a linha é Grau 2, pergunte qual número de modelo o relatório nomeia: essa é a única forma da afirmação que sobrevive a uma aprovação de projeto.",
  },
  finish: {
    term: "Acabamento",
    definition:
      "O tratamento de superfície, escrito como um código de duas ou três letras no meio do nosso número de modelo — SSS, PB, SN, GM. É a primeira metade das letras que vêm depois do número; a segunda metade é a função.",
    consequence:
      "Um código de acabamento não é um número ANSI/BHMA, porque o número BHMA codifica também o metal base: o mesmo cromo acetinado é 626 sobre latão e 652 sobre aço, e fornecer um contra uma especificação do outro é uma aprovação recusada.",
  },
  "narrow-stile": {
    term: "Perfil estreito",
    definition:
      "Uma porta de alumínio cujo montante vertical é estreito demais para uma fechadura de embutir comum — normalmente entre 30 e 50 mm de profundidade útil. Ela precisa de uma caixa de fechadura feita para essa profundidade, e não de uma padrão cortada.",
    consequence:
      "Encaixar uma caixa padrão num perfil estreito tira material de que a porta dependia, e a folha cai em uma estação. A queda é atribuída às dobradiças e foi causada pelo rebaixo da fechadura.",
  },
};

const source = readFileSync(FILE, "utf8");
let out = source;

/* The interface gains the three fields beside their Spanish siblings. */
if (!out.includes("termPt:")) {
  out = out
    .replace("  termEs: string;", "  termEs: string;\n  termPt: string;")
    .replace("  definitionEs: string;", "  definitionEs: string;\n  definitionPt: string;")
    .replace("  consequenceEs: string;", "  consequenceEs: string;\n  consequencePt: string;");
}

/**
 * Writes a Portuguese field after its Spanish sibling inside one record.
 *
 * The records are hand-written TypeScript with multi-line template-free strings, so this
 * walks the text rather than parsing it: find the record by `id:`, find the Spanish field
 * inside it, and insert after the line that closes that field's string. A record whose
 * Spanish field cannot be located is reported rather than skipped — a glossary missing
 * one of 23 entries is the half-translated state this repo keeps refusing.
 */
function insertAfter(text, recordStart, recordEnd, esField, ptField, value) {
  const region = text.slice(recordStart, recordEnd);
  const marker = region.indexOf(`    ${esField}:`);
  if (marker === -1) return null;
  /* The Spanish value may sit on the same line or on the next; either way it ends at the
     first line whose trailing character is the closing quote-comma. */
  const rest = region.slice(marker);
  const endOfValue = rest.search(/",\r?\n/);
  if (endOfValue === -1) return null;
  const insertAt = recordStart + marker + endOfValue + 2;
  const lineBreak = text.slice(insertAt).startsWith("\r\n") ? "\r\n" : "\n";
  const literal = JSON.stringify(value);
  return (
    text.slice(0, insertAt) +
    `${lineBreak}    ${ptField}:${lineBreak}      ${literal},` +
    text.slice(insertAt)
  );
}

const ids = [...source.matchAll(/^    id: "([^"]+)",$/gm)].map((m) => m[1]);
const missing = ids.filter((id) => !PT[id]);
if (missing.length) {
  console.error("No Portuguese for:");
  for (const id of missing) console.error(`  ${id}`);
  process.exit(1);
}

let written = 0;
let already = 0;

/* Back to front, so an insertion never moves the offsets of a record not yet handled. */
for (const id of [...ids].reverse()) {
  const pt = PT[id];
  const start = out.indexOf(`    id: "${id}",`);
  if (start === -1) {
    console.error(`Record ${id} vanished mid-run.`);
    process.exit(1);
  }
  const nextId = out.indexOf('    id: "', start + 10);
  const end = nextId === -1 ? out.length : nextId;
  if (out.slice(start, end).includes("termPt:")) {
    already += 1;
    continue;
  }
  for (const [esField, ptField, value] of [
    ["consequenceEs", "consequencePt", pt.consequence],
    ["definitionEs", "definitionPt", pt.definition],
    ["termEs", "termPt", pt.term],
  ]) {
    const next = insertAfter(out, start, end, esField, ptField, value);
    if (!next) {
      console.error(`Could not find ${esField} in record ${id}.`);
      process.exit(1);
    }
    out = next;
  }
  written += 1;
}

if (out !== source) writeFileSync(FILE, out);
console.log(`${FILE}: ${written} records written, ${already} already had Portuguese.`);
