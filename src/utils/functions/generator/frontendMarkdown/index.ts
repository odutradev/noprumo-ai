import { apiLayerOptions, asyncActionsOptions, componentDeclarationOptions, componentStructureOptions, dataFetchingOptions, e2eOptions, formValidationOptions, frontendFrameworkOptions, stateOptions, stylingOptions, uiLibraryOptions } from "@assets/data/generator/frontendOptions"
import { commentsOptions, exportOptions, importAliasOptions, importOrderOptions, languageOptions, quoteOptions, semicolonOptions, testSuffixOptions, testingOptions } from "@assets/data/generator/options"
import { booleanPrefixOptions, fileOrganizationOptions, frontendNamingGroups, handlerPrefixOptions, identifierLanguageOptions, typePrefixOptions } from "@assets/data/generator/naming"
import { code, extraPrinciples, gitSection, principlesSection, samplesSection, selectedPrinciples } from "@utils/functions/generator/markdownHelpers"
import { architectureBlock, namingRow } from "@utils/functions/generator/skillMarkdown"
import { createMdContext, sentence } from "@utils/functions/generator/mdContext"
import { buildTree, renderTree } from "@utils/functions/generator/architecture"
import { publishingSection } from "@utils/functions/generator/publishing"
import { getFrontendLayout } from "@utils/functions/generator/frontend"
import { caseStyleLabels } from "@utils/functions/generator/naming"
import { createNamer } from "@utils/functions/generator/namer"

import type { GeneratorConfig } from "@utils/types/generator"

export const buildFrontendMarkdown = (config: GeneratorConfig): string => {
  const ctx = createMdContext(config)
  const { byLanguage, tr, field } = ctx
  const { naming, conventions, frontend } = config
  const n = createNamer(naming)
  const tree = [".", ...renderTree(buildTree(getFrontendLayout(config).files))].join("\n")
  const language = field("naming.language", identifierLanguageOptions, naming.language)
  const onSaved = createNamer({ ...naming, handlerPrefix: "on" }).handler("saved")

  const namingRows = frontendNamingGroups.flatMap((group) => group.categories.map((category) => namingRow(ctx, category.key, category.label, caseStyleLabels[naming[category.key]], category.example(n))))
  const extraRows = [
    `| Hooks | ${byLanguage("prefixo", "prefix")} \`use\` + ${caseStyleLabels[naming.functions]} | \`${n.fn("useUserStore")}\` |`,
    namingRow(ctx, "handlerPrefix", "Handlers de evento", tr(handlerPrefixOptions.find((option) => option.value === naming.handlerPrefix)?.label ?? ""), n.handler("save")),
    `| ${byLanguage("Props de callback", "Callback props")} | ${byLanguage("prefixo", "prefix")} \`on\` | \`${onSaved}\` |`,
    namingRow(ctx, "typePrefix", "Prefixo de tipos", tr(typePrefixOptions.find((option) => option.value === naming.typePrefix)?.label ?? ""), n.type("userCardProps")),
    namingRow(ctx, "booleanPrefix", "Booleanos", tr(booleanPrefixOptions.find((option) => option.value === naming.booleanPrefix)?.label ?? ""), n.boolean("isActive")),
    namingRow(ctx, "fileOrganization", "Organização de utilitários", tr(fileOrganizationOptions.find((option) => option.value === naming.fileOrganization)?.label ?? ""), n.file("user", "service")),
    `| ${byLanguage("Variáveis de ambiente", "Environment variables")} | ${byLanguage("SCREAMING_SNAKE com prefixo do bundler", "SCREAMING_SNAKE with the bundler prefix")} | \`VITE_BASEURL\` |`
  ]

  const declaration = field("frontend.componentDeclaration", componentDeclarationOptions, frontend.componentDeclaration)
  const structure = field("frontend.componentStructure", componentStructureOptions, frontend.componentStructure)
  const styling = field("frontend.styling", stylingOptions, frontend.styling)
  const ui = field("frontend.uiLibrary", uiLibraryOptions, frontend.uiLibrary)
  const state = field("frontend.state", stateOptions, frontend.state)
  const fetching = field("frontend.dataFetching", dataFetchingOptions, frontend.dataFetching)
  const apiLayer = field("frontend.apiLayer", apiLayerOptions, frontend.apiLayer)
  const asyncActions = field("frontend.asyncActions", asyncActionsOptions, frontend.asyncActions)
  const forms = field("frontend.formValidation", formValidationOptions, frontend.formValidation)
  const e2e = field("frontend.e2e", e2eOptions, frontend.e2e)
  const testing = field("conventions.testing", testingOptions, conventions.testing)
  const testSuffix = field("conventions.testSuffix", testSuffixOptions, conventions.testSuffix)
  const imports = field("conventions.importAlias", importAliasOptions, conventions.importAlias)
  const importOrder = field("conventions.importOrder", importOrderOptions, conventions.importOrder)
  const comments = field("conventions.comments", commentsOptions, conventions.comments)
  const exportsStyle = field("conventions.exports", exportOptions, conventions.exports)
  const principles = selectedPrinciples(config)
  const exportsDescription =
    !exportsStyle.isCustom && conventions.exports === "mixed"
      ? byLanguage("Default para o componente, hook ou store principal do arquivo e named para tipos e funções de API.", "Default for the file's main component, hook or store and named for types and API functions.")
      : exportsStyle.description
  const hasNoUnitTests = !testing.isCustom && conventions.testing === "none"
  const hasNoE2eTests = !e2e.isCustom && frontend.e2e === "none"
  const unitSuffix = testSuffix.isCustom ? testSuffix.label : `\`.${conventions.testSuffix}.tsx\``

  const testLines = [
    hasNoUnitTests ? byLanguage("- Testes unitários não são obrigatórios.", "- Unit tests are not required.") : byLanguage(`- Unitários com **${testing.label}**, ao lado do componente (${unitSuffix}).`, `- Unit tests with **${testing.label}**, next to the component (${unitSuffix}).`),
    hasNoE2eTests ? byLanguage("- Testes E2E não são obrigatórios.", "- E2E tests are not required.") : `- E2E: ${sentence(`**${e2e.label}**`, e2e.description)}`,
    !e2e.isCustom && frontend.e2e === "cypress"
      ? byLanguage(
          "- Cenários numerados pela ordem de execução (`01.auth.cy.ts`, `02.users.cy.ts`). Dados de teste em `cypress/fixtures` e comandos reutilizáveis (login, factories) em `cypress/support`.",
          "- Scenarios numbered by run order (`01.auth.cy.ts`, `02.users.cy.ts`). Test data in `cypress/fixtures` and reusable commands (login, factories) in `cypress/support`."
        )
      : "",
    byLanguage("- Antes de abrir um PR, rode o lint e a suíte E2E em modo headless.", "- Before opening a PR, run the linter and the E2E suite in headless mode.")
  ].filter(Boolean)

  const checklist = [
    byLanguage(`Nomes seguem a tabela de nomenclatura e estão em ${language.label.toLowerCase()}.`, `Names follow the naming table and are in ${language.label}.`),
    byLanguage("Arquivos estão na pasta certa da arquitetura.", "Files are in the right folder for the architecture."),
    byLanguage(`Componentes seguem "${structure.label}" e "${declaration.label}".`, `Components follow "${structure.label}" and "${declaration.label}".`),
    byLanguage("Props e estado estão tipados, sem `any`.", "Props and state are typed, with no `any`."),
    byLanguage(`Chamadas à API passam por "${apiLayer.label}" e usam "${asyncActions.label}".`, `API calls go through "${apiLayer.label}" and use "${asyncActions.label}".`),
    byLanguage(`Estilos usam ${styling.label} com os tokens do tema.`, `Styles use ${styling.label} with theme tokens.`),
    byLanguage(`Imports seguem "${imports.label}".`, `Imports follow "${imports.label}".`),
    ...principles.map((principle) => byLanguage(`Princípio "${principle.label}" aplicado.`, `Principle "${tr(principle.label)}" applied.`)),
    ...extraPrinciples(config),
    config.publishing.isEnabled && config.publishing.prompt === "everyTask" ? byLanguage("Pergunta de publicação feita como última ação, se a tarefa alterou arquivos.", "Publish question asked as the last action, if the task changed files.") : ""
  ].filter(Boolean)

  const formsBlock =
    !forms.isCustom && frontend.formValidation === "none"
      ? byLanguage("Validação manual, feita no handler de submit antes de chamar a API.", "Manual validation in the submit handler before calling the API.")
      : `${sentence(`**${forms.label}**`, forms.description)} ${byLanguage("A submissão usa o padrão de ações assíncronas acima.", "Submission uses the async action pattern above.")}${forms.example ? `\n\n${code(forms.example)}` : ""}`

  const propsWhere = !structure.isCustom && frontend.componentStructure === "singleFile" ? byLanguage(" no próprio arquivo", " in the same file") : byLanguage(" no arquivo de tipos do componente", " in the component's types file")

  return `# ${byLanguage("Guia de padrões do frontend", "Frontend standards guide")}

${byLanguage("Este guia define as regras de arquitetura, componentes, estado e código deste frontend. Seguir este guia é **obrigatório**.", "This guide defines this frontend's architecture, component, state and code rules. Following it is **mandatory**.")}

**${byLanguage("Diretriz", "Directive")}:** ${byLanguage(
    "antes de criar ou refatorar páginas, componentes, hooks ou stores, leia este guia e reproduza exatamente a estrutura e os padrões descritos aqui. Antes de criar um componente ou hook, procure um equivalente que já exista no projeto.",
    "before creating or refactoring pages, components, hooks or stores, read this guide and follow exactly the structure and standards described here. Before creating a component or hook, look for an existing equivalent in the project."
  )}

## 1. Stack

| Item | ${byLanguage("Escolha", "Choice")} |
| :--- | :--- |
| Framework | ${field("frontend.framework", frontendFrameworkOptions, frontend.framework).label} |
| ${byLanguage("Linguagem", "Language")} | ${field("language", languageOptions, config.language).label} (${byLanguage("100% tipado", "100% typed")}) |
| ${byLanguage("Componentes base", "Base components")} | ${ui.label} |
| ${byLanguage("Estilização", "Styling")} | ${styling.label} |
| ${byLanguage("Estado global", "Global state")} | ${state.label} |
| ${byLanguage("Requisições", "Requests")} | ${fetching.label} |
| ${byLanguage("Formulários", "Forms")} | ${forms.label} |
| ${byLanguage("Testes E2E", "E2E tests")} | ${e2e.label} |

${architectureBlock(ctx, tree)}

## 3. ${byLanguage("Nomenclatura", "Naming")}

- **${byLanguage("Idioma dos identificadores", "Identifier language")}:** ${language.label}. ${byLanguage("Textos exibidos para o usuário ficam em português.", "User-facing copy stays in Portuguese.")}

| ${byLanguage("Elemento", "Element")} | ${byLanguage("Padrão", "Standard")} | ${byLanguage("Exemplo", "Example")} |
| :--- | :--- | :--- |
${[...namingRows, ...extraRows].join("\n")}

## 4. ${byLanguage("Componentes", "Components")}

- **${byLanguage("Declaração", "Declaration")}:** ${sentence(declaration.label, declaration.description)}
- **${byLanguage("Estrutura", "Structure")}:** ${sentence(structure.label, structure.description)}
- **Exports:** ${sentence(exportsStyle.label, exportsDescription)} ${byLanguage("Um componente por arquivo.", "One component per file.")}
- **Props:** ${byLanguage("sempre tipadas", "always typed")}${propsWhere}.
- **${byLanguage("Componentes base", "Base components")}:** ${sentence(ui.label, ui.description)}
- **${byLanguage("Estilos", "Styles")}:** ${sentence(styling.label, styling.description)}

${structure.example ? code(structure.example, "text") : ""}

## 5. ${byLanguage("Estado", "State")}

- **Local:** ${byLanguage("`useState` para estado que só o componente usa.", "`useState` for state only the component uses.")}
- **Global:** ${sentence(state.label, state.description)}

${state.example ? code(state.example) : ""}

## 6. ${byLanguage("Dados e API", "Data and API")}

- **${byLanguage("Camada de API", "API layer")}:** ${sentence(apiLayer.label, apiLayer.description)} ${byLanguage("Componentes e páginas nunca chamam o client HTTP direto.", "Components and pages never call the HTTP client directly.")}
- **${byLanguage("Requisições", "Requests")}:** ${sentence(fetching.label, fetching.description)}
- **${byLanguage("Ações assíncronas", "Async actions")}:** ${sentence(asyncActions.label, asyncActions.description)}

${asyncActions.example ? code(asyncActions.example) : ""}

## 7. ${byLanguage("Formulários", "Forms")}

${formsBlock}

## 8. ${byLanguage("Estilo de código", "Code style")}

- **Imports:** ${sentence(imports.label, imports.description)}
- **${byLanguage("Organização dos imports", "Import organization")}:** ${sentence(importOrder.label, importOrder.description)}
- **${byLanguage("Ponto e vírgula", "Semicolons")}:** ${field("conventions.semicolons", semicolonOptions, conventions.semicolons).label}.
- **${byLanguage("Aspas", "Quotes")}:** ${field("conventions.quotes", quoteOptions, conventions.quotes).label}. ${byLanguage("Atributos JSX sempre com aspas duplas.", "JSX attributes always use double quotes.")}
- **${byLanguage("Comentários", "Comments")}:** ${sentence(comments.label, comments.description)}

## 9. ${byLanguage("Princípios obrigatórios", "Required principles")}

${principlesSection(ctx)}

## 10. ${byLanguage("Testes", "Tests")}

${testLines.join("\n")}

## 11. ${byLanguage("Commits e Git", "Commits and Git")}

${gitSection(ctx)}

## 12. ${byLanguage("Publicação", "Publishing")}

${publishingSection(ctx)}

## 13. ${byLanguage("Exemplo de referência", "Reference example")}

${samplesSection(ctx)}

## 14. ${byLanguage("Checklist antes de entregar", "Checklist before delivering")}

${checklist.map((item) => `- [ ] ${item}`).join("\n")}
`.replace(/\n{3,}/g, "\n\n")
}
