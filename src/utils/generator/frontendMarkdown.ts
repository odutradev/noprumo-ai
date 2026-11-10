import {
  apiLayerOptions,
  asyncActionsOptions,
  componentDeclarationOptions,
  componentStructureOptions,
  dataFetchingOptions,
  e2eOptions,
  formValidationOptions,
  frontendFrameworkOptions,
  stateOptions,
  stylingOptions,
  uiLibraryOptions
} from '@/data/generator/frontendOptions'
import { architectureInfo, commentsOptions, exportOptions, importAliasOptions, importOrderOptions, languageOptions, quoteOptions, semicolonOptions, testingOptions } from '@/data/generator/options'
import { booleanPrefixOptions, fileOrganizationOptions, frontendNamingGroups, handlerPrefixOptions, identifierLanguageOptions, typePrefixOptions } from '@/data/generator/naming'

import type { GeneratorConfig } from '@/types/generator'

import { code, gitSection, pick, principlesSection, samplesSection, selectedPrinciples, slugify } from './markdownHelpers'
import { buildTree, renderTree } from './architecture'
import { getFrontendLayout } from './frontend'
import { caseStyleLabels } from './naming'
import { createNamer } from './namer'

export const buildFrontendMarkdown = (config: GeneratorConfig): string => {
  const { naming, conventions, frontend } = config
  const n = createNamer(naming)
  const architecture = architectureInfo[config.architecture]
  const layout = getFrontendLayout(config)
  const tree = ['.', ...renderTree(buildTree(layout.files))].join('\n')
  const language = identifierLanguageOptions.find((option) => option.value === naming.language)

  const namingRows = frontendNamingGroups.flatMap((group) => group.categories.map((category) => `| ${category.label} | ${caseStyleLabels[naming[category.key]]} | \`${category.example(n)}\` |`))
  const extraRows = [
    `| Hooks | prefixo \`use\` + ${caseStyleLabels[naming.functions]} | \`${n.fn('useUserStore')}\` |`,
    `| Handlers internos | ${handlerPrefixOptions.find((option) => option.value === naming.handlerPrefix)?.label} | \`${n.handler('save')}\` |`,
    `| Props de callback | prefixo \`on\` | \`${createNamer({ ...naming, handlerPrefix: 'on' }).handler('saved')}\` |`,
    `| Prefixo de tipos | ${typePrefixOptions.find((option) => option.value === naming.typePrefix)?.label} | \`${n.type('userCardProps')}\` |`,
    `| Booleanos | ${booleanPrefixOptions.find((option) => option.value === naming.booleanPrefix)?.label} | \`${n.boolean('isActive')}\` |`,
    `| Organização de utilitários | ${fileOrganizationOptions.find((option) => option.value === naming.fileOrganization)?.label} | \`${n.file('user', 'service')}\` |`,
    '| Variáveis de ambiente | SCREAMING_SNAKE com prefixo do bundler | `VITE_BASEURL` |'
  ]

  const declaration = pick(componentDeclarationOptions, frontend.componentDeclaration)
  const structure = pick(componentStructureOptions, frontend.componentStructure)
  const styling = pick(stylingOptions, frontend.styling)
  const ui = pick(uiLibraryOptions, frontend.uiLibrary)
  const state = pick(stateOptions, frontend.state)
  const fetching = pick(dataFetchingOptions, frontend.dataFetching)
  const apiLayer = pick(apiLayerOptions, frontend.apiLayer)
  const asyncActions = pick(asyncActionsOptions, frontend.asyncActions)
  const forms = pick(formValidationOptions, frontend.formValidation)
  const e2e = pick(e2eOptions, frontend.e2e)
  const testing = pick(testingOptions, conventions.testing)
  const imports = pick(importAliasOptions, conventions.importAlias)
  const importOrder = pick(importOrderOptions, conventions.importOrder)
  const comments = pick(commentsOptions, conventions.comments)
  const exportsStyle = pick(exportOptions, conventions.exports)
  const principles = selectedPrinciples(config)

  const testLines = [
    conventions.testing === 'none' ? '- Testes unitários não são obrigatórios.' : `- Unitários com **${testing.label}**, ao lado do componente (\`.${conventions.testSuffix}.tsx\`).`,
    frontend.e2e === 'none' ? '- Testes E2E não são obrigatórios.' : `- E2E com **${e2e.label}**. ${e2e.description}`,
    frontend.e2e === 'cypress' ? '- Cenários numerados pela ordem de execução (`01.auth.cy.ts`, `02.users.cy.ts`). Dados de teste em `cypress/fixtures` e comandos reutilizáveis (login, factories) em `cypress/support`.' : '',
    '- Antes de abrir um PR, rode o lint e a suíte E2E em modo headless.'
  ].filter(Boolean)

  const checklist = [
    `Nomes seguem a tabela de nomenclatura e estão em ${language?.label.toLowerCase()}.`,
    `Arquivos estão na pasta certa da arquitetura ${architecture.label}.`,
    `Componentes seguem a estrutura "${structure.label}" e a declaração "${declaration.label}".`,
    'Props e estado estão tipados, sem `any`.',
    `Chamadas à API passam pela camada "${apiLayer.label}" e usam "${asyncActions.label}".`,
    `Estilos usam ${styling.label} com os tokens do tema.`,
    `Imports usam ${imports.label.toLowerCase()}.`,
    conventions.commitFormat === 'conventional' ? 'Commits seguem Conventional Commits.' : '',
    ...principles.map((principle) => `Princípio "${principle.label}" aplicado.`)
  ].filter(Boolean)

  return `---
name: ${slugify(config.skillName)}
description: ${config.skillDescription.replace(/\n/g, ' ')}
---

# Guia de padrões do frontend

Este guia define as regras de arquitetura, componentes, estado e código deste frontend. Seguir este guia é **obrigatório**.

**Diretriz:** antes de criar ou refatorar páginas, componentes, hooks ou stores, leia este guia e reproduza exatamente a estrutura e os padrões descritos aqui. Antes de criar um componente ou hook, procure um equivalente que já exista no projeto.

## 1. Stack

| Item | Escolha |
| :--- | :--- |
| Framework | ${pick(frontendFrameworkOptions, frontend.framework).label} |
| Linguagem | ${pick(languageOptions, config.language).label} (100% tipado) |
| Componentes base | ${ui.label} |
| Estilização | ${styling.label} |
| Estado global | ${state.label} |
| Requisições | ${fetching.label} |
| Formulários | ${forms.label} |
| Testes E2E | ${e2e.label} |

## 2. Arquitetura: ${architecture.label}

${architecture.summary}

**Regras:**

${architecture.rules.map((rule) => `- ${rule}`).join('\n')}

**Estrutura de pastas:**

${code(tree, 'text')}

## 3. Nomenclatura

- **Idioma dos identificadores:** ${language?.label}. Textos exibidos para o usuário ficam em português.

| Elemento | Padrão | Exemplo |
| :--- | :--- | :--- |
${[...namingRows, ...extraRows].join('\n')}

## 4. Componentes

- **Declaração:** ${declaration.label}. ${declaration.description}
- **Estrutura:** ${structure.label}. ${structure.description}
- **Exports:** ${exportsStyle.label}. ${conventions.exports === 'mixed' ? 'Default para o componente, hook ou store principal do arquivo e named para tipos e funções de API.' : exportsStyle.description} Um componente por arquivo.
- **Props:** sempre tipadas${frontend.componentStructure === 'singleFile' ? ' no próprio arquivo' : ' no arquivo de tipos do componente'}.
- **Componentes base:** ${ui.label}. ${ui.description}
- **Estilos:** ${styling.label}. ${styling.description}

${code(structure.example ?? '', 'text')}

## 5. Estado

- **Local:** \`useState\` para estado que só o componente usa.
- **Global:** ${state.label}. ${state.description}

${code(state.example ?? '')}

## 6. Dados e API

- **Camada de API:** ${apiLayer.label}. ${apiLayer.description} Componentes e páginas nunca chamam o client HTTP direto.
- **Requisições:** ${fetching.label}. ${fetching.description}
- **Ações assíncronas:** ${asyncActions.label}. ${asyncActions.description}

${code(asyncActions.example ?? '')}

## 7. Formulários

${frontend.formValidation === 'none' ? 'Validação manual, feita no handler de submit antes de chamar a API.' : `Validação com **${forms.label}**. ${forms.description} A submissão usa o padrão de ações assíncronas acima.\n\n${code(forms.example ?? '')}`}

## 8. Estilo de código

- **Imports:** ${imports.label}. ${imports.description}
- **Organização dos imports:** ${importOrder.label}. ${importOrder.description}
- **Ponto e vírgula:** ${pick(semicolonOptions, conventions.semicolons).label}.
- **Aspas:** ${pick(quoteOptions, conventions.quotes).label}. Atributos JSX sempre com aspas duplas.
- **Comentários:** ${comments.label}. ${comments.description}

## 9. Princípios obrigatórios

${principlesSection(config)}

## 10. Testes

${testLines.join('\n')}

## 11. Commits e Git

${gitSection(config)}

## 12. Exemplo de referência

Use estes arquivos como modelo. Eles seguem todas as regras acima.

${samplesSection(config)}

## 13. Checklist antes de entregar

${checklist.map((item) => `- [ ] ${item}`).join('\n')}
`
}
