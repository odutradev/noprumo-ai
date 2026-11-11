import { apiDocsOptions, architectureInfo, commentsOptions, databaseOptions, errorHandlingOptions, exportOptions, frameworkOptions, functionStyleOptions, importAliasOptions, importOrderOptions, languageOptions, paradigmOptions, projectTypeOptions, quoteOptions, routeStyleOptions, semicolonOptions, testLocationOptions, testSuffixOptions, testingOptions, validationOptions } from "@assets/data/generator/options"
import { booleanPrefixOptions, fileOrganizationOptions, identifierLanguageOptions, namingGroups, tableNumberOptions, typePrefixOptions } from "@assets/data/generator/naming"
import { code, extraPrinciples, gitSection, principlesSection, samplesSection, selectedPrinciples, slugify } from "@utils/functions/generator/markdownHelpers"
import { buildTree, getArchitectureLayout, renderTree } from "@utils/functions/generator/architecture"
import { buildFrontendMarkdown } from "@utils/functions/generator/frontendMarkdown"
import { createMdContext, sentence } from "@utils/functions/generator/mdContext"
import { publishingSection } from "@utils/functions/generator/publishing"
import { caseStyleLabels } from "@utils/functions/generator/naming"
import { createNamer } from "@utils/functions/generator/namer"

import type { GeneratorConfig } from "@utils/types/generator"
import type { MdContext } from "@utils/types/markdown"

export { slugify } from "@utils/functions/generator/markdownHelpers"

export const namingRow = (ctx: MdContext, key: string, label: string, value: string, example: string) => {
  const custom = ctx.customText(`naming.${key}`)
  return `| ${ctx.tr(label)} | ${custom ?? value} | ${custom ? "—" : `\`${example}\``} |`
}

export const architectureBlock = (ctx: MdContext, tree: string) => {
  const { config, byLanguage, tr } = ctx
  const custom = ctx.customText("architecture")
  if (custom) return `## 2. ${byLanguage("Arquitetura", "Architecture")}\n\n${custom}\n\n${byLanguage("Siga essa organização ao criar pastas e arquivos.", "Follow this organization when creating folders and files.")}`
  const architecture = architectureInfo[config.architecture]
  return `## 2. ${byLanguage("Arquitetura", "Architecture")}: ${tr(architecture.label)}

${tr(architecture.summary)}

**${byLanguage("Regras", "Rules")}:**

${architecture.rules.map((rule) => `- ${tr(rule)}`).join("\n")}

**${byLanguage("Estrutura de pastas", "Folder structure")}:**

${code(tree, "text")}`
}

export const frontmatter = (config: GeneratorConfig) => `---
name: ${slugify(config.skillName)}
description: ${createMdContext(config).tr(config.skillDescription.trim()).replace(/\n/g, " ")}
---`

export const buildGuideMarkdown = (config: GeneratorConfig): string => {
  if (config.projectType === "frontend") return buildFrontendMarkdown(config)

  const ctx = createMdContext(config)
  const { byLanguage, tr, field } = ctx
  const { naming, conventions } = config
  const n = createNamer(naming)
  const tree = [".", ...renderTree(buildTree(getArchitectureLayout(config).files))].join("\n")
  const language = field("naming.language", identifierLanguageOptions, naming.language)
  const isPt = !language.isCustom && naming.language === "pt"

  const namingRows = namingGroups.flatMap((group) => group.categories.map((category) => namingRow(ctx, category.key, category.label, caseStyleLabels[naming[category.key]], category.example(n))))
  const extraRows = [
    namingRow(ctx, "typePrefix", "Prefixo de tipos", tr(typePrefixOptions.find((option) => option.value === naming.typePrefix)?.label ?? ""), n.type("userResponse")),
    namingRow(ctx, "booleanPrefix", "Booleanos", tr(booleanPrefixOptions.find((option) => option.value === naming.booleanPrefix)?.label ?? ""), n.boolean("isActive")),
    namingRow(ctx, "fileOrganization", "Organização", tr(fileOrganizationOptions.find((option) => option.value === naming.fileOrganization)?.label ?? ""), n.file("user", "repository")),
    namingRow(ctx, "tableNumber", "Número das tabelas", tr(tableNumberOptions.find((option) => option.value === naming.tableNumber)?.label ?? ""), n.table()),
    `| ${byLanguage("Variáveis de ambiente", "Environment variables")} | SCREAMING_SNAKE | \`DATABASE_URL\` |`
  ]

  const paradigm = field("conventions.paradigm", paradigmOptions, conventions.paradigm)
  const functionStyle = field("conventions.functionStyle", functionStyleOptions, conventions.functionStyle)
  const exportsStyle = field("conventions.exports", exportOptions, conventions.exports)
  const semicolons = field("conventions.semicolons", semicolonOptions, conventions.semicolons)
  const quotes = field("conventions.quotes", quoteOptions, conventions.quotes)
  const comments = field("conventions.comments", commentsOptions, conventions.comments)
  const imports = field("conventions.importAlias", importAliasOptions, conventions.importAlias)
  const importOrder = field("conventions.importOrder", importOrderOptions, conventions.importOrder)
  const errors = field("conventions.errorHandling", errorHandlingOptions, conventions.errorHandling)
  const validation = field("conventions.validation", validationOptions, conventions.validation)
  const routes = field("conventions.routeStyle", routeStyleOptions, conventions.routeStyle)
  const docs = field("conventions.apiDocs", apiDocsOptions, conventions.apiDocs)
  const testing = field("conventions.testing", testingOptions, conventions.testing)
  const testLocation = field("conventions.testLocation", testLocationOptions, conventions.testLocation)
  const testSuffix = field("conventions.testSuffix", testSuffixOptions, conventions.testSuffix)
  const principles = selectedPrinciples(config)
  const hasNoTests = !testing.isCustom && conventions.testing === "none"
  const commentsLanguage = conventions.commentsLanguage === "pt" ? byLanguage("português", "Portuguese") : byLanguage("inglês", "English")

  const testSection = hasNoTests
    ? byLanguage("Este projeto não exige testes automatizados.", "This project does not require automated tests.")
    : [
        `- Framework: **${testing.label}**.`,
        `- ${byLanguage("Localização", "Location")}: ${sentence(`**${testLocation.label}**`, testLocation.description)}`,
        `- ${byLanguage("Sufixo dos arquivos", "File suffix")}: ${testSuffix.isCustom ? testSuffix.label : `\`.${conventions.testSuffix}.ts\`${conventions.testLocation === "hybrid" ? ` (E2E: \`.e2e-${conventions.testSuffix}.ts\`)` : ""}`}.`,
        `- ${byLanguage("Os testes seguem as mesmas regras de nomenclatura, imports e comentários do código de produção.", "Tests follow the same naming, import and comment rules as production code.")}`,
        `- ${byLanguage("Unitários não acessam banco nem rede. Integração usa banco em memória ou isolado, criado no setup e limpo após cada caso.", "Unit tests never touch the database or network. Integration tests use an in-memory or isolated database, created in setup and cleaned after each case.")}`
      ].join("\n")

  const checklist = [
    byLanguage(`Nomes seguem a tabela de nomenclatura e estão em ${language.label.toLowerCase()}.`, `Names follow the naming table and are in ${language.label}.`),
    byLanguage("Arquivos estão na pasta certa da arquitetura.", "Files are in the right folder for the architecture."),
    byLanguage(`Imports seguem "${imports.label}" e "${importOrder.label}".`, `Imports follow "${imports.label}" and "${importOrder.label}".`),
    byLanguage(`Erros seguem o padrão "${errors.label}".`, `Errors follow "${errors.label}".`),
    validation.isCustom || conventions.validation !== "none" ? byLanguage(`Toda entrada externa é validada (${validation.label}).`, `All external input is validated (${validation.label}).`) : "",
    !comments.isCustom && conventions.comments === "none" ? byLanguage("Nenhum comentário no código.", "No comments in the code.") : "",
    hasNoTests ? "" : byLanguage("Código novo tem testes no local e com o sufixo definidos.", "New code has tests in the defined location and with the defined suffix."),
    ...principles.map((principle) => byLanguage(`Princípio "${principle.label}" aplicado.`, `Principle "${tr(principle.label)}" applied.`)),
    ...extraPrinciples(config),
    config.publishing.isEnabled && config.publishing.prompt === "everyTask" ? byLanguage("Pergunta de publicação feita como última ação, se a tarefa alterou arquivos.", "Publish question asked as the last action, if the task changed files.") : ""
  ].filter(Boolean)

  return `# ${byLanguage("Guia de padrões do projeto", "Project standards guide")}

${byLanguage("Este guia define as regras de arquitetura, estrutura e código deste projeto. Seguir este guia é **obrigatório**.", "This guide defines this project's architecture, structure and code rules. Following it is **mandatory**.")}

**${byLanguage("Diretriz", "Directive")}:** ${byLanguage(
    "antes de criar ou refatorar qualquer código, leia este guia e reproduza exatamente a estrutura e os padrões descritos aqui. Quando um padrão não estiver coberto, siga o exemplo de referência mais próximo no final do documento.",
    "before creating or refactoring any code, read this guide and follow exactly the structure and standards described here. When a standard is not covered, follow the closest reference example at the end of this document."
  )}

## 1. Stack

| Item | ${byLanguage("Escolha", "Choice")} |
| :--- | :--- |
| ${byLanguage("Tipo de projeto", "Project type")} | ${field("projectType", projectTypeOptions, config.projectType).label} |
| ${byLanguage("Linguagem", "Language")} | ${field("language", languageOptions, config.language).label} (strict) |
| ${byLanguage("Framework HTTP", "HTTP framework")} | ${field("framework", frameworkOptions, config.framework).label} |
| ${byLanguage("Banco de dados", "Database")} | ${field("database", databaseOptions, config.database).label} |
| ${byLanguage("Validação", "Validation")} | ${validation.label} |
| ${byLanguage("Testes", "Tests")} | ${testing.label} |

${architectureBlock(ctx, tree)}

## 3. ${byLanguage("Nomenclatura", "Naming")}

- **${byLanguage("Idioma dos identificadores", "Identifier language")}:** ${language.label}. ${byLanguage(
    `Variáveis, funções, tipos, chaves de objetos, tabelas e campos são escritos em ${language.label.toLowerCase()}${isPt ? ", sem acentos nem cedilha" : ""}.`,
    `Variables, functions, types, object keys, tables and fields are written in ${language.label}${isPt ? ", without accents" : ""}.`
  )}
- ${byLanguage("Nomes precisam ser descritivos. Não use abreviações (`usr`, `tmp`, `data2`).", "Names must be descriptive. No abbreviations (`usr`, `tmp`, `data2`).")}

| ${byLanguage("Elemento", "Element")} | ${byLanguage("Padrão", "Standard")} | ${byLanguage("Exemplo", "Example")} |
| :--- | :--- | :--- |
${[...namingRows, ...extraRows].join("\n")}

## 4. ${byLanguage("Estilo de código", "Code style")}

- **${byLanguage("Paradigma", "Paradigm")}:** ${sentence(paradigm.label, paradigm.description)}
- **${byLanguage("Funções", "Functions")}:** ${sentence(functionStyle.label, functionStyle.description)}
- **Exports:** ${sentence(exportsStyle.label, exportsStyle.description)}
- **${byLanguage("Ponto e vírgula", "Semicolons")}:** ${semicolons.label}.
- **${byLanguage("Aspas", "Quotes")}:** ${quotes.label}.
- **${byLanguage("Comentários", "Comments")}:** ${sentence(comments.label, comments.description)}${!comments.isCustom && conventions.comments !== "none" ? ` ${byLanguage(`Escritos em ${commentsLanguage}.`, `Written in ${commentsLanguage}.`)}` : ""}

### Imports

- **${byLanguage("Caminhos", "Paths")}:** ${sentence(imports.label, imports.description)}
- **${byLanguage("Organização", "Organization")}:** ${sentence(importOrder.label, importOrder.description)}

${importOrder.example ? code(importOrder.example) : ""}

### ${byLanguage("Tratamento de erros", "Error handling")}

${sentence(errors.label, errors.description)}

${errors.example ? code(errors.example) : ""}

### ${byLanguage("Validação", "Validation")}

${sentence(validation.label, validation.description)}

${validation.example ? code(validation.example) : ""}

### ${byLanguage("Rotas e documentação da API", "Routes and API docs")}

- **${byLanguage("Rotas", "Routes")}:** ${sentence(routes.label, routes.description)}

${routes.example ? code(routes.example, "text") : ""}

- **${byLanguage("Documentação", "Docs")}:** ${sentence(docs.label, docs.description)}

## 5. ${byLanguage("Princípios obrigatórios", "Required principles")}

${principlesSection(ctx)}

## 6. ${byLanguage("Testes", "Tests")}

${testSection}

## 7. ${byLanguage("Commits e Git", "Commits and Git")}

${gitSection(ctx)}

## 8. ${byLanguage("Publicação", "Publishing")}

${publishingSection(ctx)}

## 9. ${byLanguage("Exemplo de referência", "Reference example")}

${samplesSection(ctx)}

## 10. ${byLanguage("Checklist antes de entregar", "Checklist before delivering")}

${checklist.map((item) => `- [ ] ${item}`).join("\n")}
`.replace(/\n{3,}/g, "\n\n")
}
