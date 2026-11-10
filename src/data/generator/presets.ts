import type { EnabledProjectType, FrontendConfig, GeneratorConfig, NamingConfig, PublishingConfig } from '@/types/generator'

const frontendDefaults: FrontendConfig = {
  framework: 'react',
  uiLibrary: 'mui',
  styling: 'styledComponents',
  state: 'zustand',
  dataFetching: 'axios',
  formValidation: 'yup',
  e2e: 'cypress',
  componentDeclaration: 'arrowFC',
  componentStructure: 'folderTriad',
  apiLayer: 'actionsFolder',
  asyncActions: 'useAction'
}

const publishingDefaults: PublishingConfig = {
  enabled: true,
  actions: ['bumpPackage', 'build', 'push'],
  branch: 'master',
  buildScript: 'build',
  invocation: 'npx',
  prompt: 'everyTask'
}

const componentNaming: Pick<NamingConfig, 'components' | 'componentFolders' | 'handlerPrefix'> = {
  components: 'pascal',
  componentFolders: 'camel',
  handlerPrefix: 'handle'
}

export const codeGuidePreset: GeneratorConfig = {
  skillName: 'backend-code-guide',
  skillDescription: 'Padrões obrigatórios de arquitetura, nomenclatura e código do backend. Use ao criar, refatorar ou revisar endpoints, regras de negócio, repositórios e testes deste projeto.',
  projectType: 'backend',
  language: 'typescript',
  framework: 'express',
  database: 'mongoose',
  architecture: 'domainActions',
  naming: {
    language: 'en',
    variables: 'camel',
    functions: 'camel',
    classes: 'pascal',
    types: 'pascal',
    typePrefix: 'none',
    enums: 'pascal',
    enumMembers: 'pascal',
    constants: 'pascal',
    booleanPrefix: 'verb',
    errorCodes: 'snake',
    files: 'camel',
    fileOrganization: 'folderIndex',
    folders: 'camel',
    dbTables: 'camel',
    tableNumber: 'plural',
    dbColumns: 'camel',
    routes: 'kebab',
    ...componentNaming
  },
  conventions: {
    paradigm: 'objects',
    functionStyle: 'arrow',
    exports: 'mixed',
    importAlias: 'perFolder',
    importOrder: 'blocksByLength',
    errorHandling: 'errorCatalog',
    validation: 'zod',
    routeStyle: 'actionInPath',
    apiDocs: 'openapiZod',
    testing: 'vitest',
    testLocation: 'hybrid',
    testSuffix: 'spec',
    semicolons: 'never',
    quotes: 'single',
    comments: 'none',
    commentsLanguage: 'pt',
    commitFormat: 'conventional',
    commitLanguage: 'en',
    branchNaming: 'typeSlash',
    commitGranularity: 'logical',
    commitScope: 'none',
    commitBody: 'subjectOnly',
    commitTiming: 'afterTask',
    aiAttribution: 'never',
    principles: ['earlyReturn', 'immutability', 'noAny', 'noConsoleLog', 'parallelAsync', 'leanResponses', 'repositoryIsolation', 'auditMutations', 'standardPagination', 'noReinvent']
  },
  frontend: frontendDefaults,
  publishing: { ...publishingDefaults, actions: ['bumpPackage', 'push'] }
}

export const blankPreset: GeneratorConfig = {
  ...codeGuidePreset,
  skillName: 'backend-standards',
  skillDescription: 'Padrões de arquitetura, nomenclatura e código do backend. Use ao criar, editar ou revisar código deste projeto.',
  architecture: 'layered',
  naming: {
    ...codeGuidePreset.naming,
    constants: 'screamingSnake',
    files: 'kebab',
    fileOrganization: 'roleSuffix',
    folders: 'kebab',
    dbTables: 'snake',
    dbColumns: 'snake'
  },
  conventions: {
    ...codeGuidePreset.conventions,
    paradigm: 'classes',
    exports: 'named',
    importAlias: 'root',
    importOrder: 'blocksAlphabetical',
    errorHandling: 'exceptions',
    routeStyle: 'rest',
    apiDocs: 'none',
    testLocation: 'colocated',
    semicolons: 'always',
    comments: 'publicOnly',
    branchNaming: 'free',
    principles: ['earlyReturn', 'noAny', 'noConsoleLog']
  },
  publishing: { ...publishingDefaults, enabled: false }
}

export const bonfirePreset: GeneratorConfig = {
  ...codeGuidePreset,
  skillName: 'frontend-code-guide',
  skillDescription: 'Padrões obrigatórios de arquitetura, componentes, nomenclatura e código do frontend. Use ao criar, refatorar ou revisar páginas, componentes, hooks, stores e chamadas à API deste projeto.',
  projectType: 'frontend',
  architecture: 'typeFolders',
  naming: {
    ...codeGuidePreset.naming,
    constants: 'camel',
    files: 'camel',
    folders: 'camel',
    fileOrganization: 'folderIndex',
    ...componentNaming
  },
  conventions: {
    ...codeGuidePreset.conventions,
    exports: 'mixed',
    importAlias: 'perFolder',
    importOrder: 'free',
    semicolons: 'always',
    quotes: 'double',
    comments: 'allowed',
    testing: 'none',
    principles: ['routeGuard', 'permissionCheck', 'lazyRoutes', 'mobileFirst', 'accessibility', 'themeTokens', 'persistedStores', 'noAny']
  },
  frontend: frontendDefaults,
  publishing: publishingDefaults
}

export const blankFrontendPreset: GeneratorConfig = {
  ...bonfirePreset,
  skillName: 'frontend-standards',
  skillDescription: 'Padrões de arquitetura, componentes e código do frontend. Use ao criar, editar ou revisar código deste projeto.',
  architecture: 'featureFolders',
  naming: { ...bonfirePreset.naming, componentFolders: 'pascal', files: 'kebab', constants: 'screamingSnake' },
  conventions: {
    ...bonfirePreset.conventions,
    exports: 'named',
    importAlias: 'root',
    importOrder: 'blocksAlphabetical',
    semicolons: 'never',
    quotes: 'single',
    comments: 'publicOnly',
    testing: 'vitest',
    testLocation: 'colocated',
    testSuffix: 'test',
    branchNaming: 'free',
    principles: ['lazyRoutes', 'accessibility', 'noAny']
  },
  frontend: {
    ...frontendDefaults,
    uiLibrary: 'shadcn',
    styling: 'tailwind',
    dataFetching: 'reactQuery',
    formValidation: 'zod',
    e2e: 'playwright',
    componentDeclaration: 'arrowProps',
    componentStructure: 'singleFile',
    apiLayer: 'colocated',
    asyncActions: 'mutationHook'
  },
  publishing: { ...publishingDefaults, enabled: false }
}

export const presets: Record<EnabledProjectType, { mine: GeneratorConfig; neutral: GeneratorConfig }> = {
  backend: { mine: codeGuidePreset, neutral: blankPreset },
  frontend: { mine: bonfirePreset, neutral: blankFrontendPreset }
}
