import type { ConventionsConfig, EnabledProjectType, GeneratorConfig } from "@utils/types/generator"

interface CommitDraft {
  type: string
  scope: string
  en: string
  pt: string
  bodyEn: string
  bodyPt: string
}

const draft = (type: string, scope: string, en: string, pt: string, bodyEn: string, bodyPt: string): CommitDraft => ({ type, scope, en, pt, bodyEn, bodyPt })

const plans: Record<EnabledProjectType, Record<"perStep" | "logical" | "single", CommitDraft[]>> = {
  backend: {
    perStep: [
      draft("feat", "users", "add user schemas and types", "adiciona schemas e tipos do usuário", "Validate params and responses with shared schemas.", "Valida params e respostas com schemas compartilhados."),
      draft("feat", "users", "add user repository", "adiciona repositório do usuário", "Isolate database access behind findById.", "Isola o acesso ao banco atrás do findById."),
      draft("feat", "users", "add get user by id action", "adiciona action de busca de usuário por id", "Return user_not_found when the user does not exist.", "Retorna user_not_found quando o usuário não existe."),
      draft("test", "users", "cover get user by id action", "cobre a action de busca de usuário por id", "Run against the in-memory database.", "Roda contra o banco em memória."),
      draft("docs", "", "document users domain", "documenta o domínio de usuários", "Describe the new endpoint and its errors.", "Descreve o novo endpoint e seus erros.")
    ],
    logical: [
      draft("feat", "users", "add user schemas and repository", "adiciona schemas e repositório do usuário", "Base types and data access for the users domain.", "Tipos base e acesso a dados do domínio de usuários."),
      draft("feat", "users", "add get user by id action", "adiciona action de busca de usuário por id", "Return user_not_found when the user does not exist.", "Retorna user_not_found quando o usuário não existe."),
      draft("test", "users", "cover users domain", "cobre o domínio de usuários", "Repository and action tests with the in-memory database.", "Testes de repositório e action com banco em memória."),
      draft("docs", "", "document users domain", "documenta o domínio de usuários", "Describe the new endpoint and its errors.", "Descreve o novo endpoint e seus erros.")
    ],
    single: [draft("feat", "users", "add get user by id endpoint", "adiciona endpoint de busca de usuário por id", "Schemas, repository, action, tests and docs for the users domain.", "Schemas, repositório, action, testes e docs do domínio de usuários.")]
  },
  frontend: {
    perStep: [
      draft("feat", "users", "add user types", "adiciona tipos do usuário", "Shared User type for actions and stores.", "Tipo User compartilhado por actions e stores."),
      draft("feat", "users", "add update user action", "adiciona action de atualização do usuário", "Wrap the PATCH request in the actions layer.", "Encapsula o PATCH na camada de actions."),
      draft("feat", "users", "add user card component", "adiciona componente de cartão do usuário", "Show the name and save changes with feedback toasts.", "Mostra o nome e salva alterações com toasts de feedback."),
      draft("feat", "users", "add user profile page", "adiciona página de perfil do usuário", "Protected route that requires manage_users.", "Rota protegida que exige manage_users."),
      draft("test", "users", "add user profile e2e tests", "adiciona testes E2E do perfil do usuário", "Cover editing and the permission redirect.", "Cobre a edição e o redirecionamento sem permissão."),
      draft("docs", "", "document user profile", "documenta o perfil do usuário", "Explain the page and its permissions.", "Explica a página e suas permissões.")
    ],
    logical: [
      draft("feat", "users", "add user types and actions", "adiciona tipos e actions do usuário", "Data layer for the user profile.", "Camada de dados do perfil do usuário."),
      draft("feat", "users", "add user card and profile page", "adiciona cartão e página de perfil do usuário", "Protected page that edits the user with feedback toasts.", "Página protegida que edita o usuário com toasts de feedback."),
      draft("test", "users", "add user profile e2e tests", "adiciona testes E2E do perfil do usuário", "Cover editing and the permission redirect.", "Cobre a edição e o redirecionamento sem permissão."),
      draft("docs", "", "document user profile", "documenta o perfil do usuário", "Explain the page and its permissions.", "Explica a página e suas permissões.")
    ],
    single: [draft("feat", "users", "add user profile editing", "adiciona edição do perfil do usuário", "Types, actions, component, page, tests and docs for the user profile.", "Tipos, actions, componente, página, testes e docs do perfil do usuário.")]
  }
}

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

export const formatCommit = (conventions: ConventionsConfig, commit: CommitDraft) => {
  const isPt = conventions.commitLanguage === "pt"
  const text = isPt ? commit.pt : commit.en
  const scope = conventions.commitScope === "scoped" && commit.scope ? `(${commit.scope})` : ""
  const subject = conventions.commitFormat === "conventional" ? `${commit.type}${scope}: ${text}` : capitalize(text)
  const body = conventions.commitBody === "withBody" ? `\n\n${isPt ? commit.bodyPt : commit.bodyEn}` : ""
  const trailer = conventions.aiAttribution === "coAuthor" ? "\n\nCo-Authored-By: Claude <noreply@anthropic.com>" : ""
  return `${subject}${body}${trailer}`
}

export const buildCommitExamples = (config: GeneratorConfig) =>
  plans[config.projectType as EnabledProjectType][config.conventions.commitGranularity].map((commit) => formatCommit(config.conventions, commit))

export const renderCommitLog = (messages: string[]) =>
  messages
    .map((message, index) => {
      const [subject, ...rest] = message.split("\n")
      const hash = (0x1a2b3c4 + index * 0x9e3779).toString(16).slice(-7)
      const extra = rest.filter(Boolean).map((line) => `\n         ${line}`).join("")
      return `${hash}  ${subject}${extra}`
    })
    .join(messages.some((message) => message.includes("\n")) ? "\n\n" : "\n")
