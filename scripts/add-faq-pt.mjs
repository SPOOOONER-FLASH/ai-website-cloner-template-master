#!/usr/bin/env node
/**
 * Adds the Portuguese FAQ to content/faq.json. Sibling of scripts/add-faq-es.mjs.
 *
 * BRAZILIAN PORTUGUESE, NOT EUROPEAN. `src/data/news.ts` and `JsonLd` both declare this
 * tree as pt-BR, because Brazil is the market it was built for. So: `equipe` not `equipa`,
 * `estoque` not `stock`, `planejado` not `planeado`, `atual` not `actual`, and the
 * gerund (`está sendo`) rather than `está a ser`. The two forms are mutually legible and
 * a Brazilian specifier still reads European Portuguese as foreign — which is the one
 * thing a page arguing that this factory is careful cannot afford.
 *
 * TRADE PORTUGUESE, NOT TRANSLATED ENGLISH. Settled forms in the trade:
 *
 *   pedido mínimo · prazo de produção · amostras · sinal · T/T ·
 *   carta de crédito irrevogável à vista · fatura proforma · frete ·
 *   impostos pagos (DDP) · desembaraço aduaneiro · ferramental e molde ·
 *   quadro de ferragens · sistema de chave-mestra · chave de obra ·
 *   desenhos dimensionais · relatório de ensaio · licitação
 *
 * The incoterms stay in their international form — EXW, FOB, DDP, DAP, T/T, L/C — because
 * that is what appears on the proforma and what the buyer will quote back at us.
 *
 * NUMBERS ARE CARRIED, NOT TRANSLATED. 300–5,000 pieces, 30 days, ISO 9001 since 2002,
 * 519 models, 17 families, thirty markets. Each one took a decision from the client, and
 * `src/lib/published-counts.test.ts` asserts the model and family counts in EVERY
 * language present in this file — so a Portuguese sentence that goes stale fails the
 * build rather than quietly contradicting the English one.
 *
 * Idempotent. Run it twice and nothing changes.
 *
 * Usage: node scripts/add-faq-pt.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";

const FILE = "content/faq.json";

/** Group titles, keyed by their English form. */
const GROUPS = {
  "Ordering and samples": "Pedidos e amostras",
  "Products and specification": "Produto e especificação",
  "Standards and certification": "Normas e certificação",
  "The company": "A empresa",
};

/** Question -> { q, a } in Portuguese, keyed by the English question. */
const ITEMS = {
  "What is your minimum order quantity?": {
    q: "Qual é o pedido mínimo?",
    a: "Depende do modelo, do acabamento e de o pedido sair de estoque ou ser fabricado conforme a sua especificação. A maioria dos modelos fica entre 300 e 5.000 peças. Alguns itens já publicados na nossa loja do Alibaba têm um mínimo publicado mais baixo. Envie os modelos de que precisa e as quantidades que tem em mente, e a equipe de exportação confirma o mínimo daquela linha exata antes de você se comprometer com o que quer que seja.",
  },
  "What are your lead times?": {
    q: "Quais são os prazos de entrega?",
    a: "O prazo de produção parte de 30 dias a contar da confirmação do pedido. A data exata depende dos modelos, da quantidade e dos acabamentos do pedido — diga à nossa equipe de exportação o que precisa e ela confirma uma data antes de você pagar qualquer sinal.",
  },
  "Can I order samples before placing a production order?": {
    q: "Posso pedir amostras antes de fazer um pedido de produção?",
    a: "Sim, e as amostras normalmente são cobradas. Cotamos o preço da amostra junto com o frete até o seu endereço, e esse valor é abatido do seu primeiro pedido de produção — de modo que, se a amostra virar negócio, no fim ela não lhe custa nada. Diga à equipe de exportação quais modelos e acabamentos quer ver e ela confirma o preço e a data de despacho. Um modelo que temos em estoque costuma sair em poucos dias; uma amostra num acabamento que não mantemos demora o mesmo que uma série curta de produção.",
  },
  "What payment terms do you accept?": {
    q: "Que condições de pagamento vocês aceitam?",
    a: "Trabalhamos com os instrumentos que o comércio exterior usa — T/T com sinal e saldo contra os documentos de embarque ou antes do despacho, e carta de crédito irrevogável à vista para pedidos maiores. A divisão não é uma regra fixa: varia com o valor do pedido, o tempo de produção que os modelos exigem, os materiais e acabamentos envolvidos e a forma como a mercadoria é desembaraçada e embarcada para o seu país. Também cotamos no incoterm que preferir — EXW na nossa fábrica, FOB no porto ou DDP entregue — e o termo escolhido muda tanto o preço quanto o ponto em que começa a sua responsabilidade. Envie os modelos, as quantidades e o destino, e a equipe de exportação coloca as condições por escrito na fatura proforma antes de você se comprometer com o que quer que seja.",
  },
  "Can I order through Alibaba instead of by email?": {
    q: "Posso comprar pelo Alibaba em vez de por e-mail?",
    a: "Sim. A nossa loja verificada tem o mesmo catálogo e costuma ser o caminho mais rápido se você já compra pelo Alibaba — trade assurance, mensagens e pagamento são tratados por lá. Para cronogramas de obra, acabamentos especiais ou sistemas de chave-mestra, o e-mail costuma ser melhor, porque esses casos exigem antes uma conversa técnica.",
  },
  "How is shipping quoted, and can you ship duty paid?": {
    q: "Como o frete é cotado, e vocês embarcam com impostos pagos?",
    a: "O frete é cotado por embarque, porque depende do destino, do peso e do volume do pedido e de a carga ir por via aérea ou marítima. As duas estão disponíveis: aéreo para amostras e reposição urgente, marítimo para pedidos de produção completos. Na nossa loja do Alibaba o frete de um pedido é calculado automaticamente no checkout para os principais países de destino, que é a forma mais rápida de ver um valor posto no destino. O embarque com impostos pagos (DDP) está disponível em muitas rotas, incluindo os Estados Unidos e boa parte da Europa; nos demais casos o padrão é DAP, com impostos e desembaraço em seu nome. Diga à equipe de exportação a cidade de destino e a quantidade e ela cota os modais lado a lado.",
  },
  "What happens if something arrives wrong or damaged?": {
    q: "E se alguma coisa chegar errada ou danificada?",
    a: "Depende de onde você comprou. Pedidos feitos pela nossa loja do Alibaba correm sob a proteção ao comprador do próprio Alibaba — esses anúncios têm Easy Return, e a devolução, as evidências e o reembolso são tratados dentro do Alibaba, e não por nós, o que é a razão mais forte para fazer um primeiro pedido por lá em vez de por e-mail. Num pedido feito diretamente conosco, a solução é acordada por escrito na fatura proforma antes do pagamento, porque um contêiner de ferragens não é uma encomenda: o que é razoável para um acabamento errado em 200 peças não é o que é razoável para um backset errado em 5.000. Fotografe a mercadoria e a marcação das caixas antes de mover qualquer coisa e envie as fotos com o número do pedido — uma reclamação com as fotos da embalagem se resolve em dias, e uma sem elas vira uma discussão sobre quem deixou cair.",
  },
  "Do you provide dimensional drawings?": {
    q: "Vocês fornecem desenhos dimensionais?",
    a: "Há desenhos dimensionais disponíveis para a maioria dos produtos mediante pedido. Envie o número do modelo e respondemos com o que temos para ele. Quando um desenho ainda não está publicado neste site, é porque não o verificamos contra o ferramental de produção atual — não porque ele não exista.",
  },
  "Can you supply master key and construction key systems?": {
    q: "Vocês fornecem sistemas de chave-mestra e de chave de obra?",
    a: "Sim. Sistemas de chave-mestra e de chave de obra são uma especialidade antiga da casa. Eles são planejados por obra, e não pedidos de um catálogo, então comece pelo quadro de portas e trabalhamos de trás para frente a partir dele.",
  },
  "Which finishes are available?": {
    q: "Quais acabamentos estão disponíveis?",
    a: "Os acabamentos disponíveis estão listados em cada página de produto, em Configuração. Quando uma página de produto não mostra acabamentos, é porque essa informação ainda não foi verificada para aquele modelo, e preferimos deixá-la em branco a adivinhar.",
  },
  "Can you produce to our own design or branding (OEM / ODM)?": {
    q: "Vocês produzem com o nosso desenho ou a nossa marca (OEM / ODM)?",
    a: "Sim — é boa parte do que a fábrica faz. Fabricamos sob as marcas próprias dos nossos clientes e conforme os desenhos deles: o seu logotipo no produto e na embalagem, o seu acabamento, o seu envase e a sua marcação de caixa. Se já existe um molde para a forma que você quer, conseguimos produzi-la; se não existe, fazemos o ferramental. Publicamos 519 modelos em 17 famílias de produto e o ferramental por trás deles é nosso, e é por isso que mudar o perfil da maçaneta, a roseta, o espelho ou o acabamento aqui é um pedido normal, e não um projeto especial. Envie uma amostra, um desenho ou até uma fotografia do que precisa e a nossa equipe de engenharia dirá o que é necessário para fazê-lo. O custo do ferramental, o tempo de amostragem e o mínimo que faz uma produção sob medida valer a pena dependem inteiramente da peça, por isso são cotados por projeto — pergunte, e você recebe números reais em vez de uma faixa.",
  },
  "Is Canton Hyland ISO 9001 certified?": {
    q: "A Canton Hyland tem certificação ISO 9001?",
    a: "Sim. A empresa mantém a certificação ISO 9001 desde 2002.",
  },
  "Are your panic exit devices EN 1125 certified?": {
    q: "As suas barras antipânico têm certificação EN 1125?",
    a: "Existem relatórios de ensaio para modelos específicos, e não para a linha como um todo, e não estendemos o relatório de um modelo a um produto irmão. Os relatórios são emitidos para uso exclusivo de quem os encomendou e só podem ser repassados na íntegra, por isso os enviamos mediante pedido, para um modelo nomeado, em vez de publicar trechos. Diga qual modelo pretende especificar e enviamos o relatório que o cobre — ou dizemos com todas as letras que não existe um.",
  },
  "Can you supply test reports and certificates for a tender?": {
    q: "Vocês fornecem relatórios de ensaio e certificados para uma licitação?",
    a: "Sim. Diga quais modelos estão no quadro e enviamos os relatórios que os nomeiam, com as datas de emissão e o escopo.",
  },
  "Where are your products manufactured?": {
    q: "Onde os seus produtos são fabricados?",
    a: "Em Guangdong, China. A Canton Hyland Hardware (Group) Co., Ltd. fabrica ferragens para portas comerciais e residenciais desde 1998.",
  },
  "Do you export worldwide?": {
    q: "Vocês exportam para o mundo todo?",
    a: "Sim. As nossas barras antipânico, caixas de fechadura, conjuntos de maçaneta e molas de piso são especificados em edifícios comerciais, institucionais e residenciais em mais de trinta mercados de exportação. Diga o país de destino e a nossa equipe de exportação confirma a documentação e o embarque para ele.",
  },
};

const data = JSON.parse(readFileSync(FILE, "utf8"));
let written = 0;
let already = 0;
const missing = [];

for (const group of data.groups ?? []) {
  const titlePt = GROUPS[group.title];
  if (!titlePt) missing.push(`GROUP: ${group.title}`);
  else if (group.titlePt === titlePt) already += 1;
  else {
    group.titlePt = titlePt;
    written += 1;
  }

  for (const item of group.items ?? []) {
    const pt = ITEMS[item.question];
    if (!pt) {
      missing.push(item.question);
      continue;
    }
    if (item.questionPt === pt.q && item.answerPt === pt.a) {
      already += 1;
      continue;
    }
    item.questionPt = pt.q;
    item.answerPt = pt.a;
    written += 1;
  }
}

if (missing.length) {
  console.error("No Portuguese for:");
  for (const m of missing) console.error(`  ${m}`);
  console.error("\nAdd it above rather than shipping a half-translated page.");
  process.exit(1);
}

if (written) writeFileSync(FILE, `${JSON.stringify(data, null, 2)}\n`);
console.log(`${FILE}: ${written} written, ${already} already correct.`);
