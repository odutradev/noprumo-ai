import { goArchitectureInfo, goCommentsOptions, goDatabaseOptions, goErrorHandlingOptions, goFileCaseOptions, goFrameworkOptions, goIdioms, goLoggerOptions, goPrincipleOptions, goTestingOptions, goValidationOptions } from "@assets/data/generator/go"
import { code, deployChecklistItem, extraPrinciples, gitSection, publishChecklistItem, rootGuidePointer, samplesSection } from "@utils/functions/generator/markdownHelpers"
import { createGoNamer, getGoLayout, goInterfaceHomeLabel } from "@utils/functions/generator/go"
import { projectTypeOptions, routeStyleOptions } from "@assets/data/generator/options"
import { createMdContext, sentence } from "@utils/functions/generator/mdContext"
import { buildTree, renderTree } from "@utils/functions/generator/architecture"
import { identifierLanguageOptions } from "@assets/data/generator/naming"
import { publishingSection } from "@utils/functions/generator/publishing"
import { caseStyleLabels } from "@utils/functions/generator/naming"
import { deploySection } from "@utils/functions/generator/deploy"
import { createNamer } from "@utils/functions/generator/namer"

import type { GeneratorConfig } from "@utils/types/generator"
import type { MdContext } from "@utils/types/markdown"

export const selectedGoPrinciples = (config: GeneratorConfig) => goPrincipleOptions.filter((principle) => config.go.principles.includes(principle.value))

const goPrinciplesSection = (ctx: MdContext) => {
  const { config, byLanguage, tr } = ctx
  const principles = selectedGoPrinciples(config)
  const extras = extraPrinciples(config)
  if (!principles.length && !extras.length) return byLanguage("Nenhum princípio adicional obrigatório.", "No additional required principles.")
  const listed = principles.map((principle) => {
    const examples = [`✅ ${byLanguage("Certo", "Do")}:\n${code(principle.good, "go")}`, principle.bad ? `❌ ${byLanguage("Errado", "Don't")}:\n${code(principle.bad, "go")}` : ""].filter(Boolean).join("\n\n")
    return `### ${tr(principle.label)}\n\n${tr(principle.description)}\n\n${examples}`
  })
  const extra = extras.length ? [`### ${byLanguage("Outros princípios", "Other principles")}\n\n${extras.map((line) => `- ${line}`).join("\n")}`] : []
  return [...listed, ...extra].join("\n\n")
}

export const goVersionOf = (config: GeneratorConfig) => config.go.image.match(/golang:(\d+\.\d+)/)?.[1] ?? "1.23"

export const buildGoMarkdown = (config: GeneratorConfig, isWorkspaceApp = false): string => {
  const ctx = createMdContext(config, isWorkspaceApp)
  const { byLanguage, tr, field } = ctx
  const { naming, conventions, go } = config
  const g = createGoNamer(config)
  const n = createNamer(naming)
  const layout = getGoLayout(config)
  const architecture = goArchitectureInfo[go.architecture]
  const customArchitecture = ctx.customText("architecture")
  const tree = [".", ...renderTree(buildTree(layout.files))].join("\n")
  const language = field("naming.language", identifierLanguageOptions, naming.language)
  const framework = field("go.framework", goFrameworkOptions, go.framework)
  const database = field("go.database", goDatabaseOptions, go.database)
  const errors = field("go.errorHandling", goErrorHandlingOptions, go.errorHandling)
  const validation = field("go.validation", goValidationOptions, go.validation)
  const logger = field("go.logger", goLoggerOptions, go.logger)
  const testing = field("go.testing", goTestingOptions, go.testing)
  const routes = field("conventions.routeStyle", routeStyleOptions, conventions.routeStyle)
  const comments = field("conventions.comments", goCommentsOptions, conventions.comments)
  const fileCase = goFileCaseOptions.find((option) => option.value === go.fileCase) ?? goFileCaseOptions[0]
  const hasNoTests = !testing.isCustom && go.testing === "none"
  const principles = selectedGoPrinciples(config)
  const commentsLanguage = conventions.commentsLanguage === "pt" ? byLanguage("português", "Portuguese") : byLanguage("inglês", "English")
  const isPt = naming.language === "pt"

  const architectureSection = customArchitecture
    ? `## 2. ${byLanguage("Arquitetura", "Architecture")}\n\n${customArchitecture}\n\n${byLanguage("Siga essa organização ao criar pacotes e arquivos.", "Follow this organization when creating packages and files.")}`
    : `## 2. ${byLanguage("Arquitetura", "Architecture")}: ${tr(architecture.label)}

${tr(architecture.summary)}

**${byLanguage("Regras", "Rules")}:**

${[...architecture.rules.map(tr), byLanguage(`As interfaces de repositório ficam ${goInterfaceHomeLabel[layout.interfaceHome]}.`, `Repository interfaces live ${layout.interfaceHome === "service" ? "in the consuming service" : layout.interfaceHome === "domain" ? "in the domain package" : "in core/ports"}.`), byLanguage("Tudo que não é API pública do módulo fica em `internal/`.", "Everything that is not public module API lives in `internal/`.")].map((rule) => `- ${rule}`).join("\n")}

**${byLanguage("Estrutura de pastas", "Folder structure")}:**

${code(tree, "text")}`

  const idiomRows = goIdioms.map((idiom) => `| ${tr(idiom.element)} | ${tr(idiom.standard)} | \`${idiom.example}\` |`)
  const projectRows = [
    `| ${byLanguage("Arquivos", "Files")} | ${fileCase.label} | \`${g.file(["user", "handler"])}\` |`,
    `| ${byLanguage("Pacotes de domínio", "Domain packages")} | ${byLanguage("no idioma dos identificadores", "in the identifier language")} | \`${g.pkg("user")}\` |`,
    `| ${byLanguage("Pacotes estruturais", "Structural packages")} | ${byLanguage("em inglês, como no ecossistema Go", "in English, as in the Go ecosystem")} | \`handler, service, repository, platform\` |`,
    `| ${byLanguage("Erros do domínio", "Domain errors")} | ${byLanguage("prefixo Err no idioma dos identificadores", "Err prefix in the identifier language")} | \`${g.errVar("userNotFound")}\` |`,
    `| ${byLanguage("Tabelas e coleções", "Tables and collections")} | ${caseStyleLabels[naming.dbTables]} | \`${n.table()}\` |`,
    `| ${byLanguage("Colunas e campos", "Columns and fields")} | ${caseStyleLabels[naming.dbColumns]} | \`${n.column("createdAt")}\` |`,
    `| ${byLanguage("Campos JSON", "JSON fields")} | camelCase | \`${isPt ? "estaAtivo" : "isActive"}\` |`,
    `| ${byLanguage("Segmentos de rota", "Route segments")} | ${caseStyleLabels[naming.routes]} | \`${n.route()}\` |`,
    `| ${byLanguage("Códigos de erro da API", "API error codes")} | ${caseStyleLabels[naming.errorCodes]} | \`${n.errorCode("userNotFound")}\` |`,
    `| ${byLanguage("Variáveis de ambiente", "Environment variables")} | SCREAMING_SNAKE | \`DATABASE_URL\` |`
  ]

  const testSection = hasNoTests
    ? byLanguage("Este projeto não exige testes automatizados.", "This project does not require automated tests.")
    : [
        `- Framework: ${sentence(`**${testing.label}**`, testing.description)}`,
        byLanguage("- Testes ficam em `_test.go` ao lado do código, no mesmo pacote. Testes de caixa-preta usam o pacote `_test`.", "- Tests live in `_test.go` files next to the code, in the same package. Black-box tests use the `_test` package."),
        byLanguage("- Testes de tabela com `t.Run`, um caso por comportamento, com nomes em frases.", "- Table-driven tests with `t.Run`, one case per behavior, named as sentences."),
        byLanguage("- Dependências externas são trocadas por stubs que implementam as interfaces. Nada de mocks gerados para interfaces de um método.", "- External dependencies are replaced by stubs that implement the interfaces. No generated mocks for one-method interfaces."),
        byLanguage("- Integração com banco real roda com a build tag `integration` e um banco isolado criado no setup.", "- Integration tests with a real database run under the `integration` build tag with an isolated database created in setup."),
        byLanguage("- Antes de entregar: `go test ./... -race -cover`.", "- Before delivering: `go test ./... -race -cover`.")
      ].join("\n")

  const checklist = [
    byLanguage("`gofmt`, `goimports` e `go vet` passam sem alterações. `golangci-lint run` sem avisos.", "`gofmt`, `goimports` and `go vet` pass with no changes. `golangci-lint run` with no warnings."),
    byLanguage(`Nomes seguem as convenções do Go e estão em ${language.label.toLowerCase()}.`, `Names follow Go conventions and are in ${language.label}.`),
    byLanguage("Pacotes e arquivos estão no lugar certo da arquitetura.", "Packages and files are in the right place for the architecture."),
    byLanguage("Todo erro é tratado ou retornado, nunca ignorado com `_`.", "Every error is handled or returned, never discarded with `_`."),
    byLanguage(`Erros seguem "${errors.label}".`, `Errors follow "${errors.label}".`),
    byLanguage("Funções com I/O recebem `context.Context` como primeiro parâmetro.", "Functions doing I/O take `context.Context` as the first parameter."),
    !validation.isCustom && go.validation === "manual" ? "" : byLanguage(`Toda entrada externa é validada (${validation.label}).`, `All external input is validated (${validation.label}).`),
    hasNoTests ? "" : byLanguage("Código novo tem testes de tabela e `go test ./... -race` passa.", "New code has table-driven tests and `go test ./... -race` passes."),
    ...principles.map((principle) => byLanguage(`Princípio "${principle.label}" aplicado.`, `Principle "${tr(principle.label)}" applied.`)),
    ...extraPrinciples(config),
    deployChecklistItem(ctx),
    publishChecklistItem(ctx)
  ].filter(Boolean)

  return `# ${byLanguage("Guia de padrões do backend em Go", "Go backend standards guide")}

${byLanguage("Este guia define as regras de arquitetura, pacotes, nomenclatura e código deste projeto em Go. Seguir este guia é **obrigatório**.", "This guide defines this Go project's architecture, package, naming and code rules. Following it is **mandatory**.")}

**${byLanguage("Diretriz", "Directive")}:** ${byLanguage(
    "antes de criar ou refatorar qualquer código, leia este guia e reproduza exatamente a estrutura e os padrões descritos aqui. Na dúvida, siga o Effective Go e o exemplo de referência no final do documento.",
    "before creating or refactoring any code, read this guide and follow exactly the structure and standards described here. When in doubt, follow Effective Go and the reference example at the end of this document."
  )}

## 1. Stack

| Item | ${byLanguage("Escolha", "Choice")} |
| :--- | :--- |
| ${byLanguage("Tipo de projeto", "Project type")} | ${field("projectType", projectTypeOptions, config.projectType).label} |
| ${byLanguage("Linguagem", "Language")} | Go ${goVersionOf(config)} (\`go.mod\`) |
| ${byLanguage("HTTP", "HTTP")} | ${framework.label} |
| ${byLanguage("Banco de dados", "Database")} | ${database.label} |
| ${byLanguage("Validação", "Validation")} | ${validation.label} |
| Logs | ${logger.label} |
| ${byLanguage("Testes", "Tests")} | ${testing.label} |

${architectureSection}

## 3. ${byLanguage("Nomenclatura", "Naming")}

- **${byLanguage("Idioma dos identificadores", "Identifier language")}:** ${language.label}. ${byLanguage(
    `Tipos, funções, variáveis, pacotes de domínio, tabelas e campos são escritos em ${language.label.toLowerCase()}${isPt ? ", sem acentos nem cedilha" : ""}.`,
    `Types, functions, variables, domain packages, tables and fields are written in ${language.label}${isPt ? ", without accents" : ""}.`
  )}
- ${byLanguage("A visibilidade é a primeira letra: maiúscula exporta, minúscula fica no pacote. Exporte só o que outro pacote usa.", "Visibility is the first letter: uppercase exports, lowercase stays in the package. Export only what another package uses.")}
- ${byLanguage("Evite repetir o nome do pacote: `user.Service`, não `user.UserService`.", "Avoid repeating the package name: `user.Service`, not `user.UserService`.")}

| ${byLanguage("Elemento", "Element")} | ${byLanguage("Padrão", "Standard")} | ${byLanguage("Exemplo", "Example")} |
| :--- | :--- | :--- |
${[...idiomRows, ...projectRows].join("\n")}

## 4. ${byLanguage("Estilo de código", "Code style")}

- **${byLanguage("Formatação", "Formatting")}:** ${byLanguage("`gofmt` e `goimports` em todo arquivo. Indentação com tab. Nenhuma discussão de estilo além do que o formatter decide.", "`gofmt` and `goimports` on every file. Tab indentation. No style debate beyond what the formatter decides.")}
- **Lint:** ${byLanguage("`go vet` e `golangci-lint` (errcheck, staticcheck, revive, gosec) sem avisos.", "`go vet` and `golangci-lint` (errcheck, staticcheck, revive, gosec) with no warnings.")}
- **Imports:** ${byLanguage("três grupos separados por linha em branco: biblioteca padrão, externos e pacotes do módulo.", "three groups separated by a blank line: standard library, external and module packages.")}
- **${byLanguage("Assinaturas", "Signatures")}:** ${byLanguage("`ctx context.Context` primeiro, `error` sempre o último retorno.", "`ctx context.Context` first, `error` always the last return value.")}
- **${byLanguage("Construtores", "Constructors")}:** ${byLanguage("`NewXxx` recebe as dependências e retorna o tipo concreto. Nada de `init()` com efeito colateral.", "`NewXxx` takes the dependencies and returns the concrete type. No `init()` with side effects.")}
- **${byLanguage("Comentários", "Comments")}:** ${sentence(comments.label, comments.description)}${!comments.isCustom && conventions.comments !== "none" ? ` ${byLanguage(`Comentários de documentação começam pelo nome do identificador e são escritos em ${commentsLanguage}.`, `Doc comments start with the identifier's name and are written in ${commentsLanguage}.`)}` : ""}

${code("import (\n\t\"context\"\n\t\"errors\"\n\n\t\"github.com/jackc/pgx/v5\"\n\n\t\"app/internal/platform/httpx\"\n)", "go")}

### ${byLanguage("Tratamento de erros", "Error handling")}

${sentence(errors.label, errors.description)}

${errors.example ? code(errors.example, "go") : ""}

- ${byLanguage("A borda HTTP traduz o erro do domínio para status e código, e loga só os erros inesperados.", "The HTTP edge maps domain errors to a status and code, and only logs unexpected errors.")}
- ${byLanguage("Mensagens de erro em minúsculas, sem ponto final.", "Error messages in lowercase, with no trailing period.")}

### ${byLanguage("Validação", "Validation")}

${sentence(validation.label, validation.description)}

${validation.example ? code(validation.example, "go") : ""}

### Logs

${sentence(logger.label, logger.description)} ${byLanguage("O logger é injetado pelo construtor, nunca global.", "The logger is injected through the constructor, never global.")}

${logger.example ? code(logger.example, "go") : ""}

### ${byLanguage("Rotas", "Routes")}

${sentence(routes.label, routes.description)}

${routes.example ? code(routes.example, "text") : ""}

## 5. ${byLanguage("Princípios obrigatórios", "Required principles")}

${goPrinciplesSection(ctx)}

## 6. ${byLanguage("Testes", "Tests")}

${testSection}

## 7. ${byLanguage("Commits e Git", "Commits and Git")}

${ctx.isWorkspaceApp ? rootGuidePointer(ctx) : gitSection(ctx)}

## 8. ${byLanguage("Docker e deploy", "Docker and deploy")}

${ctx.isWorkspaceApp ? rootGuidePointer(ctx) : deploySection(ctx)}

## 9. ${byLanguage("Publicação", "Publishing")}

${ctx.isWorkspaceApp ? rootGuidePointer(ctx) : publishingSection(ctx)}

## 10. ${byLanguage("Exemplo de referência", "Reference example")}

${samplesSection(ctx)}

## 11. ${byLanguage("Checklist antes de entregar", "Checklist before delivering")}

${checklist.map((item) => `- [ ] ${item}`).join("\n")}
`.replace(/\n{3,}/g, "\n\n")
}
