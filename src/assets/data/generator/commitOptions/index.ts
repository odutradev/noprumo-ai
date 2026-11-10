import type { AiAttribution, BranchNaming, ChoiceOption, CommitBody, CommitFormat, CommitGranularity, CommitScope, CommitTiming, IdentifierLanguage } from "@utils/types/generator"

export const commitFormatOptions: ChoiceOption<CommitFormat>[] = [
  { value: "conventional", label: "Conventional Commits", description: "`<type>: <descrição>` com feat, fix, docs, style, refactor, test e chore. Verbo no imperativo, sem ponto final.", example: "feat: add user profile editing" },
  { value: "free", label: "Livre", description: "Sem formato obrigatório, só uma frase clara do que mudou.", example: "Add user profile editing" }
]

export const commitLanguageOptions: ChoiceOption<IdentifierLanguage>[] = [
  { value: "en", label: "Inglês", description: "Mensagens de commit em inglês.", example: "feat: add user profile editing" },
  { value: "pt", label: "Português", description: "Mensagens de commit em português.", example: "feat: adiciona edição do perfil do usuário" }
]

export const commitGranularityOptions: ChoiceOption<CommitGranularity>[] = [
  { value: "logical", label: "Por parte lógica", description: "Ao terminar, agrupa as mudanças em partes coesas (configuração, tipos, feature, testes, docs) e faz um commit para cada.", badge: "Meu padrão" },
  { value: "perStep", label: "Etapa a etapa", description: "Um commit logo após cada etapa concluída do trabalho, em ordem." },
  { value: "single", label: "Um commit para tudo", description: "Todas as mudanças da tarefa em um único commit no final." }
]

export const commitScopeOptions: ChoiceOption<CommitScope>[] = [
  { value: "none", label: "Sem escopo", description: "Só o tipo antes dos dois pontos.", example: "feat: add user profile page" },
  { value: "scoped", label: "Com escopo", description: "O módulo ou área afetada entre parênteses.", example: "feat(users): add user profile page" }
]

export const commitBodyOptions: ChoiceOption<CommitBody>[] = [
  { value: "subjectOnly", label: "Só o título", description: "Uma linha curta, até 72 caracteres.", example: "fix: handle expired token on login" },
  { value: "withBody", label: "Título e corpo", description: "Uma linha de título, uma em branco e um corpo explicando o porquê.", example: "fix: handle expired token on login\n\nRedirect to /signin when the API answers 401\ninstead of showing a blank screen." }
]

export const commitTimingOptions: ChoiceOption<CommitTiming>[] = [
  { value: "afterTask", label: "Ao concluir a tarefa", description: "Commita sem esperar pedido, assim que cada parte fica pronta e typecheck, lint e testes passam." },
  { value: "onRequest", label: "Só quando pedido", description: "Nunca commita sem o pedido explícito de quem está usando." }
]

export const aiAttributionOptions: ChoiceOption<AiAttribution>[] = [
  { value: "never", label: "Sem coautoria de IA", description: "Nunca adicionar `Co-Authored-By` nem menções à IA nas mensagens.", example: "feat: add user profile page" },
  { value: "coAuthor", label: "Com Co-Authored-By", description: "Adiciona o trailer de coautoria no fim da mensagem.", example: "feat: add user profile page\n\nCo-Authored-By: Claude <noreply@anthropic.com>" }
]

export const branchNamingOptions: ChoiceOption<BranchNaming>[] = [
  { value: "typeSlash", label: "tipo/descricao", description: "Prefixo do tipo de mudança e descrição em kebab-case.", example: "feat/user-profile\nfix/login-redirect\ndocs/readme" },
  { value: "free", label: "Livre", description: "Sem padrão de nome de branch." }
]
