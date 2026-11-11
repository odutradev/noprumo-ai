import analyticsConfig from "@assets/config/analytics"

import type { PrivacySection } from "@utils/types/privacy"

export const privacyPath = "/privacy"

export const privacyUpdatedAt = "11 de novembro de 2026"

const { retentionMonths } = analyticsConfig

export const privacyNotice = "Sem cookies. Medimos os acessos de forma anônima."

export const privacySummary = "O noprumo não tem cadastro, não usa cookies e não mostra anúncios. Para saber o que melhorar, medimos os acessos de forma anônima, num servidor próprio."

export const privacySections: PrivacySection[] = [
  {
    id: "collected",
    title: "O que medimos",
    paragraphs: ["A cada visita, registramos informações gerais, que servem para contar acessos e entender o uso do site:"],
    items: [
      "A página visitada e o site de onde você veio, incluindo parâmetros de campanha (UTM).",
      "Navegador, sistema operacional, tipo de dispositivo e idioma.",
      "País, região e cidade aproximados, estimados a partir do endereço IP.",
      "Algumas ações no site, como baixar ou copiar o guia e baixar a marca, com as opções técnicas escolhidas (formato, tipo de projeto e linguagem)."
    ]
  },
  {
    id: "notCollected",
    title: "O que não medimos",
    paragraphs: [
      "Não coletamos nome, e-mail nem qualquer dado de cadastro. Não registramos o que você escreve no gerador, nem o conteúdo do guia gerado.",
      "O endereço IP é usado só no momento da visita, para estimar a localização e gerar um código anônimo que muda periodicamente. O IP não é gravado, e esse código não permite acompanhar você por muito tempo nem entre outros sites."
    ]
  },
  {
    id: "tool",
    title: "Como medimos",
    paragraphs: [
      "Usamos o Umami, uma ferramenta de código aberto, instalada no nosso próprio servidor. Os dados não são vendidos, não são repassados a terceiros e não são usados para publicidade.",
      "Se o seu navegador estiver com a opção \"Do Not Track\" (não rastrear) ligada, a sua visita não é contada."
    ]
  },
  {
    id: "browser",
    title: "O que fica no seu navegador",
    paragraphs: ["As escolhas que você faz no gerador ficam salvas só no armazenamento local (localStorage) do seu navegador, para você não perder o progresso. Elas nunca são enviadas para nós. Para apagar, basta limpar os dados do site no navegador."]
  },
  {
    id: "legalBasis",
    title: "Base legal",
    paragraphs: ["Tratamos esses dados com base no legítimo interesse (art. 7º, IX, da LGPD): estatísticas agregadas de uso, sem identificar ninguém, para manter e melhorar o serviço."]
  },
  {
    id: "retention",
    title: "Por quanto tempo",
    paragraphs: [`Os dados de acesso são guardados por até ${retentionMonths} meses. Uma rotina diária no servidor apaga automaticamente tudo o que passou desse prazo.`]
  },
  {
    id: "rights",
    title: "Seus direitos",
    paragraphs: ["A LGPD garante a você o direito de pedir informações, correção ou exclusão dos seus dados. Como as métricas são anônimas, em geral não conseguimos ligar um registro a uma pessoa, mas qualquer dúvida ou pedido pode ser feito pelo contato abaixo."]
  }
]
