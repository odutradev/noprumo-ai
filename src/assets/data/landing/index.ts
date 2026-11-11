import type { LandingStep, LandingWallRow } from "@utils/types/landing"

export const toolPath = "/gerador"

export const portfolioUrl = "https://odutra.com"

export const heroWords = [
  { text: "Sua", isLight: false },
  { text: "IA", isLight: false },
  { text: "no", isLight: true },
  { text: "prumo.", isLight: false }
]

export const wallRows: LandingWallRow[] = [
  { label: "src/domains/users/actions", width: 92, tilt: -1.6, shift: 18 },
  { label: "getUserById()", width: 64, tilt: 1.4, shift: -22 },
  { label: "feat: add user card", width: 78, tilt: -0.9, shift: 34 },
  { label: "isActive · hasAccess", width: 56, tilt: 2.2, shift: -12 },
  { label: "return manageError(...)", width: 84, tilt: -1.3, shift: 26 },
  { label: "Dockerfile · nginx.conf", width: 70, tilt: 1, shift: -30 }
]

export const crookedNotes = ["Pasta errada", "Outro padrão de nome", "Commit fora do formato", "Arquitetura ignorada"]

export const landingSteps: LandingStep[] = [
  { title: "Responda", description: "Projeto, stack, arquitetura, nomenclatura, convenções, commits e deploy. Poucas etapas, com presets e campo livre para qualquer regra." },
  { title: "Veja ao vivo", description: "A cada escolha, a prévia mostra o código de exemplo, a árvore de pastas e o arquivo final do jeito que a IA vai ler." },
  { title: "Baixe e use", description: "Um SKILL.md ou CLAUDE.md, em português ou inglês. No fullstack, um guia para a raiz e um para cada app." },
  { title: "Construa no prumo", description: "O agente lê o guia e passa a seguir o padrão do time. Você para de corrigir a IA e volta a revisar o que importa." }
]

export const stackRows = [
  ["TypeScript", "JavaScript", "Go", "Node.js", "Express", "Fastify", "NestJS", "Hono", "Gin", "Echo", "Chi", "Fiber"],
  ["React", "Next.js", "Vue", "Angular", "Zustand", "Redux", "Zod", "Prisma", "Drizzle", "MongoDB", "PostgreSQL", "Docker"]
]

export const guideStages = ["Projeto", "Stack", "Arquitetura", "Nomenclatura", "Convenções", "Commits", "Deploy", "Publicação", "Resultado"]

export const wallModes = [
  { value: "crooked", label: "Sem guia" },
  { value: "aligned", label: "Com noprumo" }
]

export const wallAnchor = 0.3

export const alignedThreshold = 0.6

export const wallTargets = { crooked: 0.02, aligned: 0.86 }
