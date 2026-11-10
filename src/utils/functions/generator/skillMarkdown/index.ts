import {
  apiDocsOptions,
  architectureInfo,
  commentsOptions,
  databaseOptions,
  errorHandlingOptions,
  exportOptions,
  frameworkOptions,
  functionStyleOptions,
  importAliasOptions,
  importOrderOptions,
  languageOptions,
  paradigmOptions,
  projectTypeOptions,
  quoteOptions,
  routeStyleOptions,
  semicolonOptions,
  testLocationOptions,
  testSuffixOptions,
  testingOptions,
  validationOptions
} from '@assets/data/generator/options'
import { booleanPrefixOptions, fileOrganizationOptions, identifierLanguageOptions, namingGroups, tableNumberOptions, typePrefixOptions } from '@assets/data/generator/naming'

import type { GeneratorConfig } from '@utils/types/generator'

import { code, extraPrinciples, gitSection, principlesSection, samplesSection, selectedPrinciples, slugify } from '@utils/functions/generator/markdownHelpers'
import { createMdContext, sentence, type MdContext } from '@utils/functions/generator/mdContext'
import { buildTree, getArchitectureLayout, renderTree } from '@utils/functions/generator/architecture'
import { buildFrontendMarkdown } from '@utils/functions/generator/frontendMarkdown'
import { publishingSection } from '@utils/functions/generator/publishing'
import { caseStyleLabels } from '@utils/functions/generator/naming'
import { createNamer } from '@utils/functions/generator/namer'

export { slugify } from '@utils/functions/generator/markdownHelpers'

export const namingRow = (ctx: MdContext, key: string, label: string, value: string, example: string) => {
  const custom = ctx.customText(`naming.${key}`)
  return `| ${ctx.tr(label)} | ${custom ?? value} | ${custom ? '—' : `\`${example}\``} |`
}

export const architectureBlock = (ctx: MdContext, tree: string) => {
  const { config, T, tr } = ctx
  const custom = ctx.customText('architecture')
  if (custom) return `## 2. ${T('Arquitetura', 'Architecture')}\n\n${custom}\n\n${T('Siga essa organização ao criar pastas e arquivos.', 'Follow this organization when creating folders and files.')}`
  const architecture = architectureInfo[config.architecture]
  return `## 2. ${T('Arquitetura', 'Architecture')}: ${tr(architecture.label)}

${tr(architecture.summary)}

**${T('Regras', 'Rules')}:**

${architecture.rules.map((rule) => `- ${tr(rule)}`).join('\n')}

**${T('Estrutura de pastas', 'Folder structure')}:**

${code(tree, 'text')}`
}

export const frontmatter = (config: GeneratorConfig) => `---
name: ${slugify(config.skillName)}
description: ${createMdContext(config).tr(config.skillDescription.trim()).replace(/\n/g, ' ')}
---`

export const buildSkillMarkdown = (config: GeneratorConfig): string => {
  if (config.projectType === 'frontend') return buildFrontendMarkdown(config)

  const ctx = createMdContext(config)
  const { T, tr, field } = ctx
  const { naming, conventions } = config
  const n = createNamer(naming)
  const tree = ['.', ...renderTree(buildTree(getArchitectureLayout(config).files))].join('\n')
  const language = field('naming.language', identifierLanguageOptions, naming.language)
  const isPt = !language.custom && naming.language === 'pt'

  const namingRows = namingGroups.flatMap((group) => group.categories.map((category) => namingRow(ctx, category.key, category.label, caseStyleLabels[naming[category.key]], category.example(n))))
  const extraRows = [
    namingRow(ctx, 'typePrefix', 'Prefixo de tipos', tr(typePrefixOptions.find((option) => option.value === naming.typePrefix)?.label ?? ''), n.type('userResponse')),
    namingRow(ctx, 'booleanPrefix', 'Booleanos', tr(booleanPrefixOptions.find((option) => option.value === naming.booleanPrefix)?.label ?? ''), n.boolean('isActive')),
    namingRow(ctx, 'fileOrganization', 'Organização', tr(fileOrganizationOptions.find((option) => option.value === naming.fileOrganization)?.label ?? ''), n.file('user', 'repository')),
    namingRow(ctx, 'tableNumber', 'Número das tabelas', tr(tableNumberOptions.find((option) => option.value === naming.tableNumber)?.label ?? ''), n.table()),
    `| ${T('Variáveis de ambiente', 'Environment variables')} | SCREAMING_SNAKE | \`DATABASE_URL\` |`
  ]

  const paradigm = field('conventions.paradigm', paradigmOptions, conventions.paradigm)
  const functionStyle = field('conventions.functionStyle', functionStyleOptions, conventions.functionStyle)
  const exportsStyle = field('conventions.exports', exportOptions, conventions.exports)
  const semicolons = field('conventions.semicolons', semicolonOptions, conventions.semicolons)
  const quotes = field('conventions.quotes', quoteOptions, conventions.quotes)
  const comments = field('conventions.comments', commentsOptions, conventions.comments)
  const imports = field('conventions.importAlias', importAliasOptions, conventions.importAlias)
  const importOrder = field('conventions.importOrder', importOrderOptions, conventions.importOrder)
  const errors = field('conventions.errorHandling', errorHandlingOptions, conventions.errorHandling)
  const validation = field('conventions.validation', validationOptions, conventions.validation)
  const routes = field('conventions.routeStyle', routeStyleOptions, conventions.routeStyle)
  const docs = field('conventions.apiDocs', apiDocsOptions, conventions.apiDocs)
  const testing = field('conventions.testing', testingOptions, conventions.testing)
  const testLocation = field('conventions.testLocation', testLocationOptions, conventions.testLocation)
  const testSuffix = field('conventions.testSuffix', testSuffixOptions, conventions.testSuffix)
  const principles = selectedPrinciples(config)
  const noTests = !testing.custom && conventions.testing === 'none'
  const commentsLanguage = conventions.commentsLanguage === 'pt' ? T('português', 'Portuguese') : T('inglês', 'English')

  const testSection = noTests
    ? T('Este projeto não exige testes automatizados.', 'This project does not require automated tests.')
    : [
        `- Framework: **${testing.label}**.`,
        `- ${T('Localização', 'Location')}: ${sentence(`**${testLocation.label}**`, testLocation.description)}`,
        `- ${T('Sufixo dos arquivos', 'File suffix')}: ${testSuffix.custom ? testSuffix.label : `\`.${conventions.testSuffix}.ts\`${conventions.testLocation === 'hybrid' ? ` (E2E: \`.e2e-${conventions.testSuffix}.ts\`)` : ''}`}.`,
        `- ${T('Os testes seguem as mesmas regras de nomenclatura, imports e comentários do código de produção.', 'Tests follow the same naming, import and comment rules as production code.')}`,
        `- ${T('Unitários não acessam banco nem rede. Integração usa banco em memória ou isolado, criado no setup e limpo após cada caso.', 'Unit tests never touch the database or network. Integration tests use an in-memory or isolated database, created in setup and cleaned after each case.')}`
      ].join('\n')

  const checklist = [
    T(`Nomes seguem a tabela de nomenclatura e estão em ${language.label.toLowerCase()}.`, `Names follow the naming table and are in ${language.label}.`),
    T('Arquivos estão na pasta certa da arquitetura.', 'Files are in the right folder for the architecture.'),
    T(`Imports seguem "${imports.label}" e "${importOrder.label}".`, `Imports follow "${imports.label}" and "${importOrder.label}".`),
    T(`Erros seguem o padrão "${errors.label}".`, `Errors follow "${errors.label}".`),
    validation.custom || conventions.validation !== 'none' ? T(`Toda entrada externa é validada (${validation.label}).`, `All external input is validated (${validation.label}).`) : '',
    !comments.custom && conventions.comments === 'none' ? T('Nenhum comentário no código.', 'No comments in the code.') : '',
    noTests ? '' : T('Código novo tem testes no local e com o sufixo definidos.', 'New code has tests in the defined location and with the defined suffix.'),
    ...principles.map((principle) => T(`Princípio "${principle.label}" aplicado.`, `Principle "${tr(principle.label)}" applied.`)),
    ...extraPrinciples(config),
    config.publishing.enabled && config.publishing.prompt === 'everyTask' ? T('Pergunta de publicação feita como última ação, se a tarefa alterou arquivos.', 'Publish question asked as the last action, if the task changed files.') : ''
  ].filter(Boolean)

  return `${frontmatter(config)}

# ${T('Guia de padrões do projeto', 'Project standards guide')}

${T('Este guia define as regras de arquitetura, estrutura e código deste projeto. Seguir este guia é **obrigatório**.', "This guide defines this project's architecture, structure and code rules. Following it is **mandatory**.")}

**${T('Diretriz', 'Directive')}:** ${T(
    'antes de criar ou refatorar qualquer código, leia este guia e reproduza exatamente a estrutura e os padrões descritos aqui. Quando um padrão não estiver coberto, siga o exemplo de referência mais próximo no final do documento.',
    'before creating or refactoring any code, read this guide and follow exactly the structure and standards described here. When a standard is not covered, follow the closest reference example at the end of this document.'
  )}

## 1. Stack

| Item | ${T('Escolha', 'Choice')} |
| :--- | :--- |
| ${T('Tipo de projeto', 'Project type')} | ${field('projectType', projectTypeOptions, config.projectType).label} |
| ${T('Linguagem', 'Language')} | ${field('language', languageOptions, config.language).label} (strict) |
| ${T('Framework HTTP', 'HTTP framework')} | ${field('framework', frameworkOptions, config.framework).label} |
| ${T('Banco de dados', 'Database')} | ${field('database', databaseOptions, config.database).label} |
| ${T('Validação', 'Validation')} | ${validation.label} |
| ${T('Testes', 'Tests')} | ${testing.label} |

${architectureBlock(ctx, tree)}

## 3. ${T('Nomenclatura', 'Naming')}

- **${T('Idioma dos identificadores', 'Identifier language')}:** ${language.label}. ${T(
    `Variáveis, funções, tipos, chaves de objetos, tabelas e campos são escritos em ${language.label.toLowerCase()}${isPt ? ', sem acentos nem cedilha' : ''}.`,
    `Variables, functions, types, object keys, tables and fields are written in ${language.label}${isPt ? ', without accents' : ''}.`
  )}
- ${T('Nomes precisam ser descritivos. Não use abreviações (`usr`, `tmp`, `data2`).', 'Names must be descriptive. No abbreviations (`usr`, `tmp`, `data2`).')}

| ${T('Elemento', 'Element')} | ${T('Padrão', 'Standard')} | ${T('Exemplo', 'Example')} |
| :--- | :--- | :--- |
${[...namingRows, ...extraRows].join('\n')}

## 4. ${T('Estilo de código', 'Code style')}

- **${T('Paradigma', 'Paradigm')}:** ${sentence(paradigm.label, paradigm.description)}
- **${T('Funções', 'Functions')}:** ${sentence(functionStyle.label, functionStyle.description)}
- **Exports:** ${sentence(exportsStyle.label, exportsStyle.description)}
- **${T('Ponto e vírgula', 'Semicolons')}:** ${semicolons.label}.
- **${T('Aspas', 'Quotes')}:** ${quotes.label}.
- **${T('Comentários', 'Comments')}:** ${sentence(comments.label, comments.description)}${!comments.custom && conventions.comments !== 'none' ? ` ${T(`Escritos em ${commentsLanguage}.`, `Written in ${commentsLanguage}.`)}` : ''}

### Imports

- **${T('Caminhos', 'Paths')}:** ${sentence(imports.label, imports.description)}
- **${T('Organização', 'Organization')}:** ${sentence(importOrder.label, importOrder.description)}

${importOrder.example ? code(importOrder.example) : ''}

### ${T('Tratamento de erros', 'Error handling')}

${sentence(errors.label, errors.description)}

${errors.example ? code(errors.example) : ''}

### ${T('Validação', 'Validation')}

${sentence(validation.label, validation.description)}

${validation.example ? code(validation.example) : ''}

### ${T('Rotas e documentação da API', 'Routes and API docs')}

- **${T('Rotas', 'Routes')}:** ${sentence(routes.label, routes.description)}

${routes.example ? code(routes.example, 'text') : ''}

- **${T('Documentação', 'Docs')}:** ${sentence(docs.label, docs.description)}

## 5. ${T('Princípios obrigatórios', 'Required principles')}

${principlesSection(ctx)}

## 6. ${T('Testes', 'Tests')}

${testSection}

## 7. ${T('Commits e Git', 'Commits and Git')}

${gitSection(ctx)}

## 8. ${T('Publicação', 'Publishing')}

${publishingSection(ctx)}

## 9. ${T('Exemplo de referência', 'Reference example')}

${samplesSection(ctx)}

## 10. ${T('Checklist antes de entregar', 'Checklist before delivering')}

${checklist.map((item) => `- [ ] ${item}`).join('\n')}
`.replace(/\n{3,}/g, '\n\n')
}
