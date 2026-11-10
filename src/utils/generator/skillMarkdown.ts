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
  testingOptions,
  validationOptions
} from '@/data/generator/options'
import { booleanPrefixOptions, fileOrganizationOptions, identifierLanguageOptions, namingGroups, typePrefixOptions } from '@/data/generator/naming'
import type { GeneratorConfig } from '@/types/generator'

import { code, gitSection, pick, principlesSection, samplesSection, selectedPrinciples, slugify } from './markdownHelpers'
import { buildTree, getArchitectureLayout, renderTree } from './architecture'
import { buildFrontendMarkdown } from './frontendMarkdown'
import { caseStyleLabels } from './naming'
import { createNamer } from './namer'
import { publishingSection } from './publishing'

export { slugify } from './markdownHelpers'

export const buildSkillMarkdown = (config: GeneratorConfig): string => {
  if (config.projectType === 'frontend') return buildFrontendMarkdown(config)
  const { naming, conventions } = config
  const n = createNamer(naming)
  const architecture = architectureInfo[config.architecture]
  const layout = getArchitectureLayout(config)
  const tree = ['.', ...renderTree(buildTree(layout.files))].join('\n')
  const language = identifierLanguageOptions.find((option) => option.value === naming.language)
  const isPt = naming.language === 'pt'

  const namingRows = namingGroups.flatMap((group) => group.categories.map((category) => `| ${category.label} | ${caseStyleLabels[naming[category.key]]} | \`${category.example(n)}\` |`))
  const extraRows = [
    `| Prefixo de tipos | ${typePrefixOptions.find((option) => option.value === naming.typePrefix)?.label} | \`${n.type('userResponse')}\` |`,
    `| Booleanos | ${booleanPrefixOptions.find((option) => option.value === naming.booleanPrefix)?.label} | \`${n.boolean('isActive')}\` |`,
    `| Organização de arquivos | ${fileOrganizationOptions.find((option) => option.value === naming.fileOrganization)?.label} | \`${n.file('user', 'repository')}\` |`,
    `| Tabelas | ${naming.tableNumber === 'plural' ? 'Plural' : 'Singular'} | \`${n.table()}\` |`,
    '| Variáveis de ambiente | SCREAMING_SNAKE | `DATABASE_URL` |'
  ]

  const principles = selectedPrinciples(config)

  const imports = pick(importAliasOptions, conventions.importAlias)
  const importOrder = pick(importOrderOptions, conventions.importOrder)
  const errors = pick(errorHandlingOptions, conventions.errorHandling)
  const validation = pick(validationOptions, conventions.validation)
  const routes = pick(routeStyleOptions, conventions.routeStyle)
  const docs = pick(apiDocsOptions, conventions.apiDocs)
  const testing = pick(testingOptions, conventions.testing)
  const testLocation = pick(testLocationOptions, conventions.testLocation)
  const comments = pick(commentsOptions, conventions.comments)

  const testSection =
    conventions.testing === 'none'
      ? 'Este projeto não exige testes automatizados.'
      : [
          `- Framework: **${testing.label}**.`,
          `- Localização: **${testLocation.label}**. ${testLocation.description}`,
          `- Sufixo dos arquivos: \`.${conventions.testSuffix}.ts\`${conventions.testLocation === 'hybrid' ? ` (E2E: \`.e2e-${conventions.testSuffix}.ts\`)` : ''}.`,
          '- Os testes seguem as mesmas regras de nomenclatura, imports e comentários do código de produção.',
          `- Unitários não acessam banco nem rede. Integração usa banco em memória ou isolado, criado no setup e limpo após cada caso.`
        ].join('\n')

  const checklist = [
    `Nomes seguem a tabela de nomenclatura e estão em ${language?.label.toLowerCase()}.`,
    `Arquivos estão na pasta certa da arquitetura ${architecture.label}.`,
    `Imports usam ${imports.label.toLowerCase()} e seguem a regra "${importOrder.label}".`,
    `Erros seguem o padrão "${errors.label}".`,
    conventions.validation !== 'none' ? `Toda entrada externa é validada com ${validation.label}.` : '',
    conventions.comments === 'none' ? 'Nenhum comentário no código.' : '',
    conventions.testing !== 'none' ? 'Código novo tem testes no local e com o sufixo definidos.' : '',
    ...principles.map((principle) => `Princípio "${principle.label}" aplicado.`),
    config.publishing.enabled && config.publishing.prompt === 'everyTask' ? 'Pergunta de publicação feita como última ação, se a tarefa alterou arquivos.' : ''
  ].filter(Boolean)

  return `---
name: ${slugify(config.skillName)}
description: ${config.skillDescription.replace(/\n/g, ' ')}
---

# Guia de padrões do projeto

Este guia define as regras de arquitetura, estrutura e código deste projeto. Seguir este guia é **obrigatório**.

**Diretriz:** antes de criar ou refatorar qualquer código, leia este guia e reproduza exatamente a estrutura e os padrões descritos aqui. Quando um padrão não estiver coberto, siga o exemplo de referência mais próximo no final do documento.

## 1. Stack

| Item | Escolha |
| :--- | :--- |
| Tipo de projeto | ${pick(projectTypeOptions, config.projectType).label} |
| Linguagem | ${pick(languageOptions, config.language).label} (strict) |
| Framework HTTP | ${pick(frameworkOptions, config.framework).label} |
| Banco de dados | ${pick(databaseOptions, config.database).label} |
| Validação | ${validation.label} |
| Testes | ${testing.label} |

## 2. Arquitetura: ${architecture.label}

${architecture.summary}

**Regras:**

${architecture.rules.map((rule) => `- ${rule}`).join('\n')}

**Estrutura de pastas:**

${code(tree, 'text')}

## 3. Nomenclatura

- **Idioma dos identificadores:** ${language?.label}. Variáveis, funções, tipos, chaves de objetos, tabelas e campos são escritos em ${language?.label.toLowerCase()}${isPt ? ', sem acentos nem cedilha' : ''}.
- Nomes precisam ser descritivos. Não use abreviações (\`usr\`, \`tmp\`, \`data2\`).

| Elemento | Padrão | Exemplo |
| :--- | :--- | :--- |
${[...namingRows, ...extraRows].join('\n')}

## 4. Estilo de código

- **Paradigma:** ${pick(paradigmOptions, conventions.paradigm).label}. ${pick(paradigmOptions, conventions.paradigm).description}
- **Funções:** ${pick(functionStyleOptions, conventions.functionStyle).label}. ${pick(functionStyleOptions, conventions.functionStyle).description}
- **Exports:** ${pick(exportOptions, conventions.exports).label}. ${pick(exportOptions, conventions.exports).description}
- **Ponto e vírgula:** ${pick(semicolonOptions, conventions.semicolons).label}.
- **Aspas:** ${pick(quoteOptions, conventions.quotes).label}.
- **Comentários:** ${comments.label}. ${comments.description}${conventions.comments === 'none' ? '' : ` Escritos em ${conventions.commentsLanguage === 'pt' ? 'português' : 'inglês'}.`}

### Imports

- **Caminhos:** ${imports.label}. ${imports.description}
- **Organização:** ${importOrder.label}. ${importOrder.description}

${importOrder.example ? code(importOrder.example) : ''}

### Tratamento de erros

${errors.label}: ${errors.description}

${code(errors.example ?? '')}

### Validação

${validation.label}: ${validation.description}

${validation.example ? code(validation.example) : ''}

### Rotas e documentação da API

- **Rotas:** ${routes.label}. ${routes.description}

${code(routes.example ?? '', 'text')}

- **Documentação:** ${docs.label}. ${docs.description}

## 5. Princípios obrigatórios

${principlesSection(config)}

## 6. Testes

${testSection}

## 7. Commits e Git

${gitSection(config)}

## 8. Publicação

${publishingSection(config)}

## 9. Exemplo de referência

Use estes arquivos como modelo. Eles seguem todas as regras acima.

${samplesSection(config)}

## 10. Checklist antes de entregar

${checklist.map((item) => `- [ ] ${item}`).join('\n')}
`
}
