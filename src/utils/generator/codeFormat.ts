import type { GeneratorConfig } from '@/types/generator'

export interface SampleFile {
  path: string
  code: string
}

export type ImportKind = 'external' | 'internal' | 'type'

export interface ImportLine {
  kind: ImportKind
  from: string
  line: string
}

export const END = '§'

export const stripExtension = (path: string) => path.replace(/\.tsx?$/, '').replace(/\/index$/, '')

export const relativePath = (fromFile: string, toFile: string) => {
  const fromDir = fromFile.split('/').slice(0, -1)
  const target = stripExtension(toFile).split('/')
  const common = fromDir.findIndex((segment, index) => segment !== target[index])
  const shared = common === -1 ? fromDir.length : common
  const up = fromDir.length - shared
  const rest = target.slice(shared).join('/')
  return up === 0 ? `./${rest}` : `${'../'.repeat(up)}${rest}`
}

export const createImporter = (config: GeneratorConfig, fromFile: string) => (toFile: string) => {
  const sameFolder = fromFile.split('/').slice(0, -1).join('/') === toFile.split('/').slice(0, -1).join('/')
  if (sameFolder || config.conventions.importAlias === 'relative') return relativePath(fromFile, toFile)
  const inner = stripExtension(toFile).replace(/^src\//, '')
  return config.conventions.importAlias === 'root' ? `@/${inner}` : `@${inner}`
}

export const formatImports = (imports: ImportLine[], config: GeneratorConfig) => {
  const order = config.conventions.importOrder
  const unique = imports.filter((item, index) => imports.findIndex((other) => other.line === item.line) === index)
  if (order === 'free') return unique.map((item) => item.line).join('\n')

  const sorter = order === 'blocksByLength' ? (a: ImportLine, b: ImportLine) => b.line.length - a.line.length : (a: ImportLine, b: ImportLine) => a.from.localeCompare(b.from)
  const kinds: ImportKind[] = ['external', 'internal', 'type']
  return kinds
    .map((kind) => unique.filter((item) => item.kind === kind).sort(sorter).map((item) => item.line).join('\n'))
    .filter(Boolean)
    .join('\n\n')
}

export const finalize = (imports: ImportLine[], body: string, config: GeneratorConfig) => {
  const header = formatImports(
    imports.map((item) => ({ ...item, line: `${item.line}${END}` })),
    config
  )
  const code = [header, body].filter(Boolean).join('\n\n')
  const withSemicolons = code.replaceAll(END, config.conventions.semicolons === 'always' ? ';' : '')
  return config.conventions.quotes === 'double' ? withSemicolons.replaceAll("'", '"') : withSemicolons
}

export const comment = (config: GeneratorConfig, pt: string, en: string, indent = '') => {
  const { comments, commentsLanguage } = config.conventions
  const text = commentsLanguage === 'pt' ? pt : en
  if (comments === 'publicOnly') return `${indent}/** ${text} */\n`
  if (comments === 'allowed') return `${indent}// ${text}\n`
  return ''
}

export const exportMain = (config: GeneratorConfig, name: string, declaration: string) => {
  const style = config.conventions.exports
  if (style === 'named') return `export ${declaration}`
  return `${declaration}\n\nexport default ${name}${END}`
}

export const fnDeclaration = (config: GeneratorConfig, name: string, params: string, returnType: string, body: string, isAsync = true) => {
  const asyncWord = isAsync ? 'async ' : ''
  if (config.conventions.functionStyle === 'arrow') return `const ${name} = ${asyncWord}(${params}): ${returnType} => {\n${body}\n}`
  return `${asyncWord}function ${name}(${params}): ${returnType} {\n${body}\n}`
}
