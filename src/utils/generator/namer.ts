import { words, type VocabularyKey } from '@/data/generator/vocabulary'
import type { NamingConfig } from '@/types/generator'

import { toCase } from './naming'

export type TermRef = VocabularyKey | VocabularyKey[]

export interface Namer {
  variable: (key: TermRef) => string
  fn: (key: TermRef) => string
  cls: (key: TermRef) => string
  type: (key: TermRef) => string
  enumName: (key: TermRef) => string
  enumMember: (key: TermRef) => string
  constant: (key: TermRef) => string
  boolean: (key: TermRef) => string
  errorCode: (key: TermRef) => string
  file: (base: TermRef, role?: TermRef) => string
  folder: (key: TermRef) => string
  table: () => string
  column: (key: TermRef) => string
  route: () => string
  component: (key: TermRef) => string
  componentFolder: (key: TermRef) => string
  handler: (key: TermRef) => string
}

const typePrefixes = { none: '', i: 'I', t: 'T' } as const

export const createNamer = (naming: NamingConfig): Namer => {
  const get = (key: TermRef) => (Array.isArray(key) ? key : [key]).flatMap((item) => words(item, naming.language))
  const fileCase = naming.files

  return {
    variable: (key) => toCase(get(key), naming.variables),
    fn: (key) => toCase(get(key), naming.functions),
    cls: (key) => toCase(get(key), naming.classes),
    type: (key) => `${typePrefixes[naming.typePrefix]}${toCase(get(key), naming.types)}`,
    enumName: (key) => toCase(get(key), naming.enums),
    enumMember: (key) => toCase(get(key), naming.enumMembers),
    constant: (key) => toCase(get(key), naming.constants),
    boolean: (key) => {
      const parts = get(key)
      return toCase(naming.booleanPrefix === 'verb' ? parts : parts.slice(1), naming.variables)
    },
    errorCode: (key) => toCase(get(key), naming.errorCodes),
    file: (base, role) => {
      const baseWords = get(base)
      if (!role) return naming.fileOrganization === 'folderIndex' ? `${toCase(baseWords, fileCase)}/index.ts` : `${toCase(baseWords, fileCase)}.ts`
      const roleWords = get(role)
      if (naming.fileOrganization === 'folderIndex') return `${toCase([...baseWords, ...roleWords], fileCase)}/index.ts`
      if (naming.fileOrganization === 'roleSuffix') return `${toCase(baseWords, fileCase)}.${toCase(roleWords, fileCase === 'pascal' ? 'camel' : fileCase)}.ts`
      return `${toCase([...baseWords, ...roleWords], fileCase)}.ts`
    },
    folder: (key) => toCase(get(key), naming.folders),
    table: () => toCase(get(naming.tableNumber === 'plural' ? 'users' : 'user'), naming.dbTables),
    column: (key) => toCase(get(key), naming.dbColumns),
    route: () => `/${toCase(get('userProfiles'), naming.routes)}`,
    component: (key) => toCase(get(key), naming.components),
    componentFolder: (key) => toCase(get(key), naming.componentFolders),
    handler: (key) => toCase([naming.handlerPrefix, ...get(key)], naming.functions)
  }
}
