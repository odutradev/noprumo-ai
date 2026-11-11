import type { AnatomyNote, ArtworkColors, BrandBackground, BrandPalette, BrandProduct, BrandRatio, BrandTile, ColorScale, FaviconAsset, KeyColor, LogoKind, LogoKindOption, MisuseExample, OpticalSize, PersonalityTrait, QuickAsset, StateColor, SymbolGeometry, SymbolOptical, ThemeToken, TileGeometry, TypeFamily, TypeScaleItem, UsageRule } from "@utils/types/brand"

export const brandColors = {
  ink: "#0F1012",
  graphite: "#16181B",
  paper: "#FCFCFB",
  white: "#FFFFFF",
  chalk: "#F2F1EE",
  orange: "#FF8A4C",
  orangeMark: "#E0652A",
  orangeText: "#B4501B",
  mutedDark: "#878D97",
  mutedLight: "#5E646E",
  border: "#D9DCE0",
  deepOrange: "#3A1A09",
  chalkBlue: "#3358D4",
  line: "#2C3036"
}

const bob = "M24 27C28.4 27 31.5 30 31.5 33.2L24 45L16.5 33.2C16.5 30 19.6 27 24 27Z"

export const symbolGeometry: Record<SymbolOptical, SymbolGeometry> = {
  regular: {
    bounds: { left: 16.5, right: 31.5, top: 2.5, bottom: 45 },
    parts: [
      { d: "M21.5 5A2.5 2.5 0 1 0 26.5 5A2.5 2.5 0 1 0 21.5 5Z", role: "ink" },
      { d: "M24 5V29", role: "ink", strokeWidth: 2.5 },
      { d: bob, role: "mark" }
    ]
  },
  medium: {
    bounds: { left: 14, right: 34, top: 2, bottom: 46 },
    parts: [
      { d: "M24 4V27", role: "ink", strokeWidth: 4 },
      { d: "M24 23C30 23 34 27 34 31.5L24 46L14 31.5C14 27 18 23 24 23Z", role: "mark" }
    ]
  },
  small: {
    bounds: { left: 11.5, right: 36.5, top: 0, bottom: 46 },
    parts: [
      { d: "M24 3V22", role: "ink", strokeWidth: 6 },
      { d: "M24 18C31.5 18 36.5 23 36.5 28.5L24 46L11.5 28.5C11.5 23 16.5 18 24 18Z", role: "mark" }
    ]
  }
}

export const symbolBox = 48

export const tileGeometry: TileGeometry[] = [
  {
    size: 16,
    box: 16,
    parts: [
      { d: "M3.5 0H12.5A3.5 3.5 0 0 1 16 3.5V12.5A3.5 3.5 0 0 1 12.5 16H3.5A3.5 3.5 0 0 1 0 12.5V3.5A3.5 3.5 0 0 1 3.5 0Z", role: "tile" },
      { d: "M7 2H9V8H7Z", role: "ink" },
      { d: "M8 6.5C10.5 6.5 12 8 12 9.7L8 14L4 9.7C4 8 5.5 6.5 8 6.5Z", role: "mark" }
    ]
  },
  {
    size: 32,
    box: 32,
    parts: [
      { d: "M7 0H25A7 7 0 0 1 32 7V25A7 7 0 0 1 25 32H7A7 7 0 0 1 0 25V7A7 7 0 0 1 7 0Z", role: "tile" },
      { d: "M14 6A2 2 0 0 1 18 6V13A2 2 0 0 1 14 13Z", role: "ink" },
      { d: "M16 12C21 12 24 15 24 18.5L16 28L8 18.5C8 15 11 12 16 12Z", role: "mark" }
    ]
  },
  {
    size: 96,
    box: 512,
    parts: [
      { d: "M115 0H397A115 115 0 0 1 512 115V397A115 115 0 0 1 397 512H115A115 115 0 0 1 0 397V115A115 115 0 0 1 115 0Z", role: "tile" },
      { d: "M256 92V296", role: "ink", strokeWidth: 40 },
      { d: "M256 250C306 250 340 284 340 322L256 438L172 322C172 284 206 250 256 250Z", role: "mark" }
    ]
  },
  {
    size: Infinity,
    box: 512,
    parts: [
      { d: "M115 0H397A115 115 0 0 1 512 115V397A115 115 0 0 1 397 512H115A115 115 0 0 1 0 397V115A115 115 0 0 1 115 0Z", role: "tile" },
      { d: "M113 4H399A109 109 0 0 1 508 113V399A109 109 0 0 1 399 508H113A109 109 0 0 1 4 399V113A109 109 0 0 1 113 4Z", role: "tileBorder", strokeWidth: 4 },
      { d: "M232 100A24 24 0 1 0 280 100A24 24 0 1 0 232 100Z", role: "ink" },
      { d: "M256 100V296", role: "ink", strokeWidth: 28 },
      { d: "M256 270C300 270 330 300 330 334L256 432L182 334C182 300 212 270 256 270Z", role: "mark" }
    ]
  }
]

export const themedColors: ArtworkColors = { ink: "currentColor", muted: "var(--enchase-color-text-secondary)", mark: "var(--enchase-color-primary)", tile: "transparent", tileBorder: "transparent" }

const tileColorsBase = { tile: "transparent", tileBorder: "transparent" }

export const brandPalettes: BrandPalette[] = [
  { id: "light", label: "Padrão claro", description: "Grafite e laranja, para fundos claros ou transparentes.", colors: { ...tileColorsBase, ink: brandColors.graphite, muted: brandColors.mutedLight, mark: brandColors.orangeMark } },
  { id: "dark", label: "Padrão escuro", description: "Giz e laranja, para fundos escuros e o tema escuro.", colors: { ...tileColorsBase, ink: brandColors.chalk, muted: brandColors.mutedDark, mark: brandColors.orange } },
  { id: "onOrange", label: "Sobre laranja", description: "Grafite com o peso em papel, para fundos laranja.", colors: { ...tileColorsBase, ink: brandColors.ink, muted: brandColors.deepOrange, mark: brandColors.paper } },
  { id: "monoInk", label: "Monocromático grafite", description: "Uma cor só, para carimbos, documentos e impressão em 1 cor.", colors: { ...tileColorsBase, ink: brandColors.graphite, muted: brandColors.graphite, mark: brandColors.graphite } },
  { id: "monoWhite", label: "Monocromático branco", description: "Marca d'água para fotos, vídeos e estampas.", colors: { ...tileColorsBase, ink: brandColors.white, muted: brandColors.white, mark: brandColors.white } },
  { id: "monoOrange", label: "Monocromático laranja", description: "Uma cor só, em laranja, para brindes e materiais especiais.", colors: { ...tileColorsBase, ink: brandColors.orangeMark, muted: brandColors.orangeMark, mark: brandColors.orangeMark } }
]

export const brandTiles: BrandTile[] = [
  { id: "ink", label: "Grafite (principal)", description: "App, PWA, avatar da organização e favicon.", colors: { ink: brandColors.chalk, muted: brandColors.mutedDark, mark: brandColors.orange, tile: brandColors.ink, tileBorder: "transparent" } },
  { id: "orange", label: "Laranja (alternativo)", description: "Eventos, stickers e destaques em lojas.", colors: { ink: brandColors.ink, muted: brandColors.deepOrange, mark: brandColors.paper, tile: brandColors.orange, tileBorder: "transparent" } },
  { id: "paper", label: "Claro", description: "Documentação e materiais em fundo claro.", colors: { ink: brandColors.graphite, muted: brandColors.mutedLight, mark: brandColors.orangeMark, tile: brandColors.paper, tileBorder: brandColors.border } }
]

export const brandBackgrounds: BrandBackground[] = [
  { id: "transparent", label: "Transparente", color: null },
  { id: "ink", label: "Grafite #0F1012", color: brandColors.ink },
  { id: "paper", label: "Papel #FCFCFB", color: brandColors.paper },
  { id: "white", label: "Branco #FFFFFF", color: brandColors.white },
  { id: "orange", label: "Laranja #FF8A4C", color: brandColors.orange }
]

export const brandRatios: BrandRatio[] = [
  { id: "original", label: "Original (recorte justo)", value: null },
  { id: "square", label: "1:1 · avatar e post", value: 1 },
  { id: "feed", label: "4:5 · feed vertical", value: 4 / 5 },
  { id: "classic", label: "4:3 · apresentação", value: 4 / 3 },
  { id: "wide", label: "16:9 · tela e vídeo", value: 16 / 9 },
  { id: "story", label: "9:16 · stories", value: 9 / 16 },
  { id: "og", label: "1,91:1 · link e Open Graph", value: 1.91 },
  { id: "banner", label: "3:1 · banner e capa", value: 3 }
]

export const logoKinds: LogoKindOption[] = [
  { id: "horizontal", label: "Horizontal (símbolo + nome)", description: "Versão principal: navbar, site, README e assinaturas." },
  { id: "stacked", label: "Empilhada", description: "Para espaços estreitos e verticais: totens, crachás e capas." },
  { id: "symbol", label: "Símbolo", description: "Só o prumo: avatares, carimbos e elementos gráficos." },
  { id: "wordmark", label: "Logotipo (só o nome)", description: "Quando o símbolo já aparece por perto ou em textos." },
  { id: "icon", label: "Ícone do app", description: "Símbolo dentro do bloco: app, PWA, favicon e lojas." },
  { id: "social", label: "Card social", description: "Imagem de compartilhamento com o slogan, em 1200×630." }
]

export const pngSizes: Record<"default" | "icon" | "social", number[]> = {
  default: [256, 512, 1024, 2048, 4096],
  icon: [16, 32, 48, 64, 180, 192, 512, 1024],
  social: [1200, 2400]
}

export const kindsWithTile: LogoKind[] = ["icon"]

export const kindsWithFixedFrame: LogoKind[] = ["icon", "social"]

export const quickAssets: QuickAsset[] = [
  { id: "horizontal-light", title: "Logo horizontal · claro", description: "Grafite e laranja sobre transparente. Para web e peças claras.", spec: { kind: "horizontal", palette: "light", tile: "ink", background: "transparent", ratio: "original" }, pngSize: 2048 },
  { id: "horizontal-dark", title: "Logo horizontal · escuro", description: "Giz e laranja sobre transparente. Para o tema escuro e telas.", spec: { kind: "horizontal", palette: "dark", tile: "ink", background: "transparent", ratio: "original" }, pngSize: 2048 },
  { id: "stacked-light", title: "Logo empilhada · claro", description: "Para capas, totens e espaços estreitos em fundo claro.", spec: { kind: "stacked", palette: "light", tile: "ink", background: "transparent", ratio: "original" }, pngSize: 2048 },
  { id: "stacked-dark", title: "Logo empilhada · escuro", description: "Para capas, totens e espaços estreitos em fundo escuro.", spec: { kind: "stacked", palette: "dark", tile: "ink", background: "transparent", ratio: "original" }, pngSize: 2048 },
  { id: "symbol-light", title: "Símbolo · claro", description: "O prumo sozinho, para fundos claros.", spec: { kind: "symbol", palette: "light", tile: "ink", background: "transparent", ratio: "square" }, pngSize: 1024 },
  { id: "symbol-dark", title: "Símbolo · escuro", description: "O prumo sozinho, para fundos escuros.", spec: { kind: "symbol", palette: "dark", tile: "ink", background: "transparent", ratio: "square" }, pngSize: 1024 },
  { id: "avatar", title: "Avatar da organização", description: "Ícone grafite 1:1, para GitHub, npm e redes sociais.", spec: { kind: "icon", palette: "dark", tile: "ink", background: "transparent", ratio: "original" }, pngSize: 1024 },
  { id: "mono-white", title: "Monocromático branco", description: "100% branco. Marca d'água para fotos e vídeos.", spec: { kind: "horizontal", palette: "monoWhite", tile: "ink", background: "transparent", ratio: "original" }, pngSize: 2048 },
  { id: "mono-ink", title: "Monocromático grafite", description: "100% grafite. Para documentos e impressão em 1 cor.", spec: { kind: "horizontal", palette: "monoInk", tile: "ink", background: "transparent", ratio: "original" }, pngSize: 2048 },
  { id: "social-dark", title: "Card social · escuro", description: "1200×630 com o slogan. Para links, posts e Open Graph.", spec: { kind: "social", palette: "dark", tile: "ink", background: "ink", ratio: "original" }, pngSize: 1200 },
  { id: "social-light", title: "Card social · claro", description: "1200×630 com o slogan, na versão clara.", spec: { kind: "social", palette: "light", tile: "ink", background: "paper", ratio: "original" }, pngSize: 1200 }
]

export const faviconAssets: FaviconAsset[] = [
  { fileName: "favicon-16.png", size: 16, description: "Aba do navegador" },
  { fileName: "favicon-32.png", size: 32, description: "Aba em telas retina" },
  { fileName: "favicon-48.png", size: 48, description: "Atalhos do Windows" },
  { fileName: "apple-touch-icon.png", size: 180, description: "Tela inicial do iOS" },
  { fileName: "icon-192.png", size: 192, description: "PWA e Android" },
  { fileName: "icon-512.png", size: 512, description: "PWA e lojas" }
]

export const colorScales: ColorScale[] = [
  {
    name: "Laranja prumo",
    description: "A cor do peso. 400 é a primária no escuro, 500 o símbolo no claro e 600 botões e textos no claro.",
    steps: [
      { step: "50", hex: "#FFF3EC" },
      { step: "100", hex: "#FFE2D1" },
      { step: "200", hex: "#FFC4A3" },
      { step: "300", hex: "#FFA673" },
      { step: "400", hex: "#FF8A4C" },
      { step: "500", hex: "#E0652A" },
      { step: "600", hex: "#B4501B" },
      { step: "700", hex: "#8A3C14" },
      { step: "800", hex: "#5E2A0F" },
      { step: "900", hex: "#3A1A09" }
    ]
  },
  {
    name: "Azul giz",
    description: "A linha de giz do pedreiro. Cor de apoio para links, informação, seleção e diffs.",
    steps: [
      { step: "50", hex: "#EEF3FF" },
      { step: "100", hex: "#DCE6FF" },
      { step: "200", hex: "#B8CCFF" },
      { step: "300", hex: "#98B5FF" },
      { step: "400", hex: "#7AA2FF" },
      { step: "500", hex: "#456BD9" },
      { step: "600", hex: "#3358D4" },
      { step: "700", hex: "#2541A3" },
      { step: "800", hex: "#1A2E73" },
      { step: "900", hex: "#101C47" }
    ]
  },
  {
    name: "Grafite",
    description: "Neutros levemente quentes. 950 é o fundo escuro, 0 o fundo claro e 400/500 o texto suave.",
    steps: [
      { step: "0", hex: "#FCFCFB" },
      { step: "50", hex: "#F6F6F4" },
      { step: "100", hex: "#EDEEEF" },
      { step: "200", hex: "#D9DCE0" },
      { step: "300", hex: "#B3B8BF" },
      { step: "400", hex: "#878D97" },
      { step: "500", hex: "#5E646E" },
      { step: "600", hex: "#40454D" },
      { step: "700", hex: "#2C3036" },
      { step: "800", hex: "#1F2226" },
      { step: "900", hex: "#16181B" },
      { step: "950", hex: "#0F1012" }
    ]
  }
]

export const keyColors: KeyColor[] = [
  { name: "Laranja prumo", hex: "#FF8A4C", token: "--np-primary (escuro)", usage: "O peso do símbolo, a ação principal e o foco. Use pouco: é o que guia o olhar." },
  { name: "Laranja símbolo", hex: "#E0652A", token: "--np-mark (claro)", usage: "O peso do símbolo sobre fundos claros. Só em elementos gráficos, nunca em texto pequeno." },
  { name: "Laranja texto", hex: "#B4501B", token: "--np-primary (claro)", usage: "Botões, links e textos em laranja no tema claro, com contraste de 4,9:1 no branco." },
  { name: "Azul giz", hex: "#7AA2FF", token: "--np-link (escuro)", usage: "Links, informação e seleção no tema escuro." },
  { name: "Grafite", hex: "#0F1012", token: "--np-bg (escuro)", usage: "Fundo do tema escuro, do ícone do app e das telas de apresentação." },
  { name: "Papel", hex: "#FCFCFB", token: "--np-bg (claro)", usage: "Fundo do tema claro. Um branco com um toque quente, menos estéril." }
]

export const stateColors: StateColor[] = [
  { name: "Sucesso", sample: "Guia gerado", dark: "#4CC38A", light: "#1A7548" },
  { name: "Erro", sample: "Regra inválida", dark: "#FF6B6B", light: "#C42F3A" },
  { name: "Aviso", sample: "Etapa incompleta", dark: "#F5C451", light: "#8A6100" },
  { name: "Info", sample: "Prévia atualizada", dark: "#7AA2FF", light: "#3358D4" }
]

export const themeTokens: ThemeToken[] = [
  { name: "--np-bg", dark: "#0F1012", light: "#FCFCFB" },
  { name: "--np-surface", dark: "#16181B", light: "#FFFFFF" },
  { name: "--np-surface-2", dark: "#1F2226", light: "#F6F6F4" },
  { name: "--np-border", dark: "#2C3036", light: "#D9DCE0" },
  { name: "--np-text", dark: "#F2F1EE", light: "#16181B" },
  { name: "--np-text-muted", dark: "#878D97", light: "#5E646E" },
  { name: "--np-primary", dark: "#FF8A4C", light: "#B4501B" },
  { name: "--np-on-primary", dark: "#0F1012", light: "#FFFFFF" },
  { name: "--np-mark", dark: "#FF8A4C", light: "#E0652A" },
  { name: "--np-link", dark: "#7AA2FF", light: "#3358D4" }
]

export const typeFamilies: TypeFamily[] = [
  { name: "Geist", role: "Logotipo, títulos, interface e texto", description: "Sans geométrica feita para telas, com números tabulares e pesos variáveis de 100 a 900. No logotipo, 300 para o \"no\" e 650 para o \"prumo\".", weights: [300, 400, 500, 600, 650], cssVariable: "--enchase-font-primary", isMono: false },
  { name: "Geist Mono", role: "Código e rótulos técnicos", description: "A irmã monoespaçada: código, árvores de pastas, nomes de arquivo e os nomes dos produtos (noprumo/infra).", weights: [400, 500, 600], cssVariable: "--enchase-font-mono", isMono: true }
]

export const typeScale: TypeScaleItem[] = [
  { name: "Display", spec: "56 / 0.95 · 650", sample: "Sua IA no prumo.", size: "3.5rem", weight: 650, tracking: "-0.045em" },
  { name: "H1", spec: "44 / 1.05 · 650", sample: "Defina uma vez.", size: "2.75rem", weight: 650, tracking: "-0.03em" },
  { name: "H2", spec: "28 / 1.15 · 600", sample: "A IA constrói do seu jeito.", size: "1.75rem", weight: 600, tracking: "-0.02em" },
  { name: "H3", spec: "22 / 1.3 · 600", sample: "Arquitetura por domínios", size: "1.375rem", weight: 600, tracking: "-0.01em" },
  { name: "Corpo", spec: "16 / 1.6 · 400", sample: "Responda a poucas etapas e baixe um guia que o agente lê e segue.", size: "1rem", weight: 400, tracking: "0" },
  { name: "Pequeno", spec: "14 / 1.5 · 400", sample: "A prévia muda a cada escolha.", size: "0.875rem", weight: 400, tracking: "0" }
]

export const brandProducts: BrandProduct[] = [
  { slug: "guias", description: "Gera o SKILL.md ou CLAUDE.md com os padrões do time.", isLive: true },
  { slug: "infra", description: "Dockerfile, compose e nginx no padrão do projeto.", isLive: false },
  { slug: "scaffold", description: "Cria projetos já com a arquitetura e as pastas certas.", isLive: false },
  { slug: "review", description: "Revisa PRs contra o guia do time, regra por regra.", isLive: false },
  { slug: "prompts", description: "Biblioteca versionada de prompts e regras para agentes.", isLive: false }
]

export const usageRules: UsageRule[] = [
  { title: "Área de proteção", description: "Deixe livre em volta da marca um espaço igual à altura do x do logotipo (a altura do \"n\"). Nada de texto, borda ou imagem dentro dela." },
  { title: "Tamanho mínimo", description: "Logo horizontal com 96 px (ou 24 mm) de largura. Abaixo de 48 px de altura, use o ícone do app; abaixo de 32 px, as versões de favicon." },
  { title: "Fundos", description: "Padrão claro em fundos claros, padrão escuro em fundos escuros e a versão sobre laranja só no laranja prumo. Em fotos, use o monocromático branco." },
  { title: "Escrita do nome", description: "Sempre noprumo, em minúsculas e junto. Em texto corrido, o nome dos produtos vem depois: noprumo review." }
]

export const misuseExamples: MisuseExample[] = [
  { kind: "stretch", title: "Não distorça nem achate" },
  { kind: "rotate", title: "Não gire: o prumo é sempre vertical" },
  { kind: "recolor", title: "Não troque a cor do peso" },
  { kind: "shadow", title: "Não aplique sombra, brilho ou gradiente" },
  { kind: "rename", title: "Não escreva NoPrumo nem No Prumo" },
  { kind: "busy", title: "Não use sobre fundos com pouco contraste" }
]

export const brandSections = [
  { id: "conceito", label: "Conceito" },
  { id: "simbolo", label: "Símbolo" },
  { id: "logotipo", label: "Logotipo" },
  { id: "cores", label: "Cores" },
  { id: "tipografia", label: "Tipografia" },
  { id: "icone", label: "Ícone" },
  { id: "familia", label: "Família" },
  { id: "usos", label: "Usos" },
  { id: "downloads", label: "Downloads" }
]

export const anatomyNotes: AnatomyNote[] = [
  { title: "Ancoragem", measure: "círculo · r 2,5 · centro em (24, 5)", description: "O ponto fixo de onde a regra parte: o padrão do time, definido uma vez." },
  { title: "Fio", measure: "traço 2,5 · de y 5 a y 29", description: "A linha reta e vertical. É também o cursor de texto e o eixo de um diff." },
  { title: "Peso", measure: "15 × 18 · ponta em y 45", description: "O laranja que puxa tudo para o prumo. É a única cor do símbolo e o ponto focal da marca." }
]

export const anatomyGuides = ["M24 0V48", "M0 5H48", "M0 27H48", "M0 45H48", "M16.5 0V48", "M31.5 0V48"]

export const personalityTraits: PersonalityTrait[] = [
  { title: "Precisa", description: "Alinhada, exata e sem ruído. Cada forma da marca tem uma medida e uma razão." },
  { title: "Confiável", description: "Algo em que você confia para guiar a IA: sóbria, estável, sem truques visuais." },
  { title: "Artesanal", description: "Valoriza o ofício de construir bem, como o pedreiro que confere a parede com o prumo." },
  { title: "Brasileira e global", description: "Nome e tom em português, com um visual técnico que funciona em qualquer lugar." }
]

export const showcaseKinds: LogoKind[] = ["horizontal", "stacked", "wordmark", "symbol"]

export const opticalSizes: OpticalSize[] = [
  { optical: "regular", label: "64 px ou mais · com ancoragem", sizeClass: "size64" },
  { optical: "medium", label: "24 a 48 px · fio de 4", sizeClass: "size32" },
  { optical: "small", label: "16 px · fio de 6, peso maior", sizeClass: "size16" }
]

export const iconPreviewSizes = [16, 32, 48, 64, 128]

export const playgroundWeights = [
  { value: "300", label: "300" },
  { value: "400", label: "400" },
  { value: "600", label: "600" },
  { value: "650", label: "650" }
]
