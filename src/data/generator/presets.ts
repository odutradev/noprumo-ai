import type { GeneratorConfig } from '@/types/generator'

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
    routes: 'kebab'
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
    principles: ['earlyReturn', 'immutability', 'noAny', 'noConsoleLog', 'parallelAsync', 'leanResponses', 'repositoryIsolation', 'auditMutations', 'standardPagination', 'noReinvent']
  }
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
    principles: ['earlyReturn', 'noAny', 'noConsoleLog']
  }
}
