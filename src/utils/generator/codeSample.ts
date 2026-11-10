import type { GeneratorConfig } from '@/types/generator'

import { comment, createImporter, END, exportMain, finalize, fnDeclaration, type ImportLine, type SampleFile } from './codeFormat'
import { getArchitectureLayout, type ArchitectureLayout } from './architecture'
import { createNamer, type Namer } from './namer'
import { buildFrontendSampleFiles } from './frontend'

export type { SampleFile } from './codeFormat'
const errorStatement = (config: GeneratorConfig, n: Namer, kind: ArchitectureLayout['kind'], idVar: string) => {
  const code = n.errorCode('userNotFound')
  switch (config.conventions.errorHandling) {
    case 'errorCatalog':
      return kind === 'action' ? `return manageError({ code: '${code}' })` : `throw new ${n.cls('appError')}('${code}')${END}`
    case 'exceptions':
      return `throw new ${n.cls('appError')}('${code}', { ${n.variable('userId')}: ${idVar} })${END}`
    case 'result':
      return `return err(new ${n.cls('appError')}('${code}'))${END}`
  }
}

const buildSchemaFile = (config: GeneratorConfig, n: Namer, layout: ArchitectureLayout): SampleFile => {
  const constant = n.constant('maxNameLength')
  const statusEnum = n.enumName('userStatus')
  const active = n.enumMember('active')
  const inactive = n.enumMember('inactive')
  const responseType = n.type('userResponse')
  const isActive = n.boolean('isActive')
  const imports: ImportLine[] = []
  const blocks: string[] = [
    `export const ${constant} = 120${END}`,
    `export enum ${statusEnum} {\n  ${active} = '${n.errorCode('active')}',\n  ${inactive} = '${n.errorCode('inactive')}'\n}`
  ]
  const ownTypes = !layout.typesPath

  switch (config.conventions.validation) {
    case 'zod':
      imports.push({ kind: 'external', from: 'zod', line: "import { z } from 'zod'" })
      blocks.push(`export const ${n.variable('getUserByIdParamsSchema')} = z.object({\n  id: z.string().min(1)\n})${END}`)
      blocks.push(`export const ${n.variable('userResponseSchema')} = z.object({\n  id: z.string(),\n  ${n.column('userName')}: z.string().max(${constant}),\n  status: z.nativeEnum(${statusEnum}),\n  ${isActive}: z.boolean()\n})${END}`)
      if (ownTypes) blocks.push(`export type ${responseType} = z.infer<typeof ${n.variable('userResponseSchema')}>${END}`)
      break
    case 'classValidator':
      imports.push({ kind: 'external', from: 'class-validator', line: "import { IsBoolean, IsEnum, IsString, MaxLength } from 'class-validator'" })
      blocks.push(`export class ${n.cls('userResponse')} {\n  @IsString()\n  id!: string${END}\n\n  @IsString()\n  @MaxLength(${constant})\n  ${n.column('userName')}!: string${END}\n\n  @IsEnum(${statusEnum})\n  status!: ${statusEnum}${END}\n\n  @IsBoolean()\n  ${isActive}!: boolean${END}\n}`)
      break
    case 'joi':
      imports.push({ kind: 'external', from: 'joi', line: "import Joi from 'joi'" })
      blocks.push(`export const ${n.variable('userResponseSchema')} = Joi.object({\n  id: Joi.string().required(),\n  ${n.column('userName')}: Joi.string().max(${constant}).required(),\n  ${isActive}: Joi.boolean().required()\n})${END}`)
      if (ownTypes) blocks.push(`export interface ${responseType} {\n  id: string\n  ${n.column('userName')}: string\n  status: ${statusEnum}\n  ${isActive}: boolean\n}`)
      break
    case 'none':
      if (ownTypes) blocks.push(`export interface ${responseType} {\n  id: string\n  ${n.column('userName')}: string\n  status: ${statusEnum}\n  ${isActive}: boolean\n}`)
      break
  }

  return { path: layout.schemaPath, code: finalize(imports, blocks.join('\n\n'), config) }
}

const buildTypesFile = (config: GeneratorConfig, n: Namer, layout: ArchitectureLayout): SampleFile | undefined => {
  if (!layout.typesPath) return undefined
  const importer = createImporter(config, layout.typesPath)
  const isZod = config.conventions.validation === 'zod'
  const imports: ImportLine[] = isZod
    ? [
        { kind: 'type', from: importer(layout.schemaPath), line: `import type { ${n.variable('getUserByIdParamsSchema')}, ${n.variable('userResponseSchema')} } from '${importer(layout.schemaPath)}'` },
        { kind: 'type', from: 'zod', line: "import type { z } from 'zod'" }
      ]
    : []
  const body = isZod
    ? `export type ${n.type('getUserByIdParams')} = z.infer<typeof ${n.variable('getUserByIdParamsSchema')}>${END}\nexport type ${n.type('userResponse')} = z.infer<typeof ${n.variable('userResponseSchema')}>${END}`
    : `export interface ${n.type('getUserByIdParams')} {\n  id: string\n}\n\nexport interface ${n.type('userResponse')} {\n  id: string\n  ${n.column('userName')}: string\n  ${n.boolean('isActive')}: boolean\n}`
  return { path: layout.typesPath, code: finalize(imports, body, config) }
}

const databaseCall = (config: GeneratorConfig, n: Namer, idVar: string) => {
  switch (config.database) {
    case 'mongoose':
      return `${n.cls('userModel')}.findById(${idVar}).lean()`
    case 'prisma':
      return `prisma.${n.table()}.findUnique({ where: { id: ${idVar} } })`
    case 'drizzle':
      return `db.query.${n.table()}.findFirst({ where: eq(${n.table()}.id, ${idVar}) })`
    case 'typeorm':
      return `dataSource.getRepository(${n.cls('user')}).findOneBy({ id: ${idVar} })`
    case 'none':
      return `${n.constant('users')}.get(${idVar}) ?? null`
  }
}

const databaseImport = (config: GeneratorConfig, n: Namer, layout: ArchitectureLayout, importer: (to: string) => string): ImportLine[] => {
  const modelPath = layout.repositoryPath.replace(/index\.ts$/, 'model.ts')
  switch (config.database) {
    case 'mongoose': {
      const isFolder = modelPath !== layout.repositoryPath
      const target = isFolder ? modelPath : `${layout.schemaPath.split('/').slice(0, -1).join('/')}/${n.file('user', 'model')}`
      const name = n.cls('userModel')
      const binding = isFolder || config.conventions.exports !== 'named' ? name : `{ ${name} }`
      return [{ kind: 'internal', from: importer(target), line: `import ${binding} from '${importer(target)}'` }]
    }
    case 'prisma':
      return [{ kind: 'internal', from: 'database', line: `import { prisma } from '${importer(`src/${n.folder('database')}/index.ts`)}'` }]
    case 'drizzle':
      return [
        { kind: 'external', from: 'drizzle-orm', line: "import { eq } from 'drizzle-orm'" },
        { kind: 'internal', from: 'database', line: `import { db, ${n.table()} } from '${importer(`src/${n.folder('database')}/index.ts`)}'` }
      ]
    case 'typeorm':
      return [{ kind: 'internal', from: 'database', line: `import { dataSource } from '${importer(`src/${n.folder('database')}/index.ts`)}'` }]
    case 'none':
      return []
  }
}

const buildRepositoryFile = (config: GeneratorConfig, n: Namer, layout: ArchitectureLayout): SampleFile => {
  const importer = createImporter(config, layout.repositoryPath)
  const ownTypes = layout.kind === 'action' && layout.repositoryPath.endsWith('/index.ts')
  const responseType = ownTypes ? n.type('userDocument') : n.type('userResponse')
  const typesSource = ownTypes ? layout.repositoryPath.replace(/index\.ts$/, 'types.ts') : (layout.typesPath ?? layout.schemaPath)
  const imports: ImportLine[] = [
    ...databaseImport(config, n, layout, importer),
    { kind: 'type', from: importer(typesSource), line: `import type { ${responseType} } from '${importer(typesSource)}'` }
  ]
  const id = 'id'
  const returnType = `Promise<${responseType} | null>`
  const call = databaseCall(config, n, id)
  const repositoryName = n.variable('userRepository')

  if (config.conventions.paradigm === 'classes') {
    const method =
      config.conventions.functionStyle === 'arrow'
        ? `  ${n.fn('findById')} = async (${id}: string): ${returnType} => ${call}${END}`
        : `  async ${n.fn('findById')}(${id}: string): ${returnType} {\n    return ${call}${END}\n  }`
    const className = n.cls('userRepository')
    return { path: layout.repositoryPath, code: finalize(imports, exportMain(config, className, `class ${className} {\n${method}\n}`), config) }
  }

  const findById = fnDeclaration(config, n.fn('findById'), `${id}: string`, returnType, `  return ${call}${END}`)
  const object = `const ${repositoryName} = {\n  ${n.fn('findById')}\n}${END}`
  const body = config.conventions.exports === 'named' ? `${findById}\n\nexport ${object}` : `${findById}\n\n${object}\n\nexport default ${repositoryName}${END}`
  return { path: layout.repositoryPath, code: finalize(imports, body, config) }
}

const repositoryImport = (config: GeneratorConfig, n: Namer, layout: ArchitectureLayout, importer: (to: string) => string): ImportLine => {
  const from = importer(layout.repositoryPath)
  const isDefault = config.conventions.exports !== 'named'
  const name = config.conventions.paradigm === 'classes' ? n.cls('userRepository') : n.variable('userRepository')
  return { kind: config.conventions.paradigm === 'classes' && layout.kind !== 'action' ? 'type' : 'internal', from, line: `import ${config.conventions.paradigm === 'classes' && layout.kind !== 'action' ? 'type ' : ''}${isDefault ? name : `{ ${name} }`} from '${from}'` }
}

const errorImports = (config: GeneratorConfig, n: Namer, layout: ArchitectureLayout, importer: (to: string) => string): ImportLine[] => {
  if (config.conventions.errorHandling === 'errorCatalog' && layout.kind === 'action') return []
  const from = importer(layout.errorsPath)
  const result = config.conventions.errorHandling === 'result' ? [{ kind: 'internal' as const, from: importer(`src/${n.folder('shared')}/${n.file('result')}`), line: `import { err, ok, type Result } from '${importer(`src/${n.folder('shared')}/${n.file('result')}`)}'` }] : []
  return [{ kind: 'internal', from, line: `import { ${n.cls('appError')} } from '${from}'` }, ...result]
}

const buildActionFile = (config: GeneratorConfig, n: Namer, layout: ArchitectureLayout): SampleFile => {
  const importer = createImporter(config, layout.mainPath)
  const typesSource = layout.typesPath ?? layout.schemaPath
  const paramsSchema = n.variable('getUserByIdParamsSchema')
  const responseSchema = n.variable('userResponseSchema')
  const actionName = n.variable('getUserByIdAction')
  const isZod = config.conventions.validation === 'zod'
  const imports: ImportLine[] = [
    ...(isZod ? [{ kind: 'internal' as const, from: './schemas', line: `import { ${paramsSchema}, ${responseSchema} } from '${importer(layout.schemaPath)}'` }] : []),
    repositoryImport(config, n, layout, importer),
    { kind: 'internal', from: 'defineAction', line: `import defineAction from '${importer(`src/${n.folder('factories')}/defineAction/index.ts`)}'` },
    ...errorImports(config, n, layout, importer),
    { kind: 'type', from: importer(typesSource), line: `import type { ${n.type('getUserByIdParams')} } from '${importer(typesSource)}'` }
  ]
  const users = n.folder('users')
  const detailsSegment = config.naming.language === 'pt' ? 'detalhes' : 'details'
  const path = config.conventions.routeStyle === 'actionInPath' ? `/${users}/:id/${detailsSegment}` : `/${users}/:id`
  const docs = config.conventions.apiDocs === 'openapiZod' ? `,\n    responses: {\n      200: { description: '${config.naming.language === 'pt' ? 'Usuário encontrado' : 'User found'}'${isZod ? `, schema: ${responseSchema}` : ''} }\n    }` : ''
  const schema = isZod ? `,\n    schema: { params: ${paramsSchema} }` : ''
  const repositoryCall = config.conventions.paradigm === 'classes' ? `new ${n.cls('userRepository')}().${n.fn('findById')}(id)` : `${n.variable('userRepository')}.${n.fn('findById')}(id)`
  const foundUser = n.variable('foundUser')
  const handlerParams = config.conventions.errorHandling === 'errorCatalog' ? '{ params, manageError }' : '{ params }'
  const success = config.conventions.errorHandling === 'result' ? `ok(${foundUser})` : foundUser
  const declaration = `const ${actionName} = defineAction(\n  {\n    method: 'get',\n    path: '${path}',\n    summary: '${config.naming.language === 'pt' ? 'Busca um usuário pelo id' : 'Finds a user by id'}',\n    tags: ['${n.cls('users')}']${schema}${docs}\n  },\n  async (${handlerParams}) => {\n    const { id } = params as ${n.type('getUserByIdParams')}${END}\n    const ${foundUser} = await ${repositoryCall}${END}\n\n    if (!${foundUser}) ${errorStatement(config, n, 'action', 'id')}\n\n    return ${success}${END}\n  }\n)${END}`
  const doc = comment(config, 'Endpoint que busca um usuário pelo id.', 'Endpoint that finds a user by id.')
  const body = config.conventions.exports === 'default' ? `${doc}${declaration}\n\nexport default ${actionName}${END}` : `${doc}export ${declaration}`
  return { path: layout.mainPath, code: finalize(imports, body, config) }
}

const buildServiceFile = (config: GeneratorConfig, n: Namer, layout: ArchitectureLayout): SampleFile => {
  const importer = createImporter(config, layout.mainPath)
  const typesSource = layout.typesPath ?? layout.schemaPath
  const responseType = n.type('userResponse')
  const imports: ImportLine[] = [
    repositoryImport(config, n, layout, importer),
    ...errorImports(config, n, layout, importer),
    { kind: 'type', from: importer(typesSource), line: `import type { ${responseType} } from '${importer(typesSource)}'` }
  ]
  const idVar = n.variable('userId')
  const foundUser = n.variable('foundUser')
  const isResult = config.conventions.errorHandling === 'result'
  const returnType = isResult ? `Promise<Result<${responseType}, ${n.cls('appError')}>>` : `Promise<${responseType}>`
  const success = isResult ? `ok(${foundUser})` : foundUser
  const unitName = { action: 'getUserByIdAction', service: 'userService', useCase: 'getUserByIdUseCase', handler: 'getUserByIdHandler' } as const
  const methodName = layout.kind === 'useCase' ? n.fn('execute') : layout.kind === 'handler' ? n.fn('handle') : n.fn('getUserById')
  const doc = comment(config, `Busca um usuário pelo id ou falha com ${n.errorCode('userNotFound')}.`, `Finds a user by id or fails with ${n.errorCode('userNotFound')}.`, config.conventions.paradigm === 'classes' ? '  ' : '')

  if (config.conventions.paradigm === 'classes') {
    const repo = n.variable('userRepository')
    const lines = (indent: string) => `${indent}const ${foundUser} = await this.${repo}.${n.fn('findById')}(${idVar})${END}\n\n${indent}if (!${foundUser}) ${errorStatement(config, n, layout.kind, idVar)}\n\n${indent}return ${success}${END}`
    const method =
      config.conventions.functionStyle === 'arrow'
        ? `${doc}  ${methodName} = async (${idVar}: string): ${returnType} => {\n${lines('    ')}\n  }${END}`
        : `${doc}  async ${methodName}(${idVar}: string): ${returnType} {\n${lines('    ')}\n  }`
    const className = n.cls(unitName[layout.kind])
    const declaration = `class ${className} {\n  constructor(private readonly ${repo}: ${n.cls('userRepository')}) {}\n\n${method}\n}`
    return { path: layout.mainPath, code: finalize(imports, exportMain(config, className, declaration), config) }
  }

  const repoCall = `${n.variable('userRepository')}.${n.fn('findById')}(${idVar})`
  const fnBody = `  const ${foundUser} = await ${repoCall}${END}\n\n  if (!${foundUser}) ${errorStatement(config, n, layout.kind, idVar)}\n\n  return ${success}${END}`
  const fn = `${doc}${fnDeclaration(config, methodName, `${idVar}: string`, returnType, fnBody)}`

  if (layout.kind !== 'service') {
    const body = config.conventions.exports === 'named' ? `export ${fn}` : `${fn}\n\nexport default ${methodName}${END}`
    return { path: layout.mainPath, code: finalize(imports, body, config) }
  }

  const serviceName = n.variable('userService')
  const object = `const ${serviceName} = {\n  ${methodName}\n}${END}`
  const body = config.conventions.exports === 'named' ? `${fn}\n\nexport ${object}` : `${fn}\n\n${object}\n\nexport default ${serviceName}${END}`
  return { path: layout.mainPath, code: finalize(imports, body, config) }
}

export const buildSampleFiles = (config: GeneratorConfig): SampleFile[] => {
  if (config.projectType === 'frontend') return buildFrontendSampleFiles(config)
  const n = createNamer(config.naming)
  const layout = getArchitectureLayout(config)
  const main = layout.kind === 'action' ? buildActionFile(config, n, layout) : buildServiceFile(config, n, layout)
  const types = buildTypesFile(config, n, layout)
  return [main, buildSchemaFile(config, n, layout), ...(types ? [types] : []), buildRepositoryFile(config, n, layout)]
}
