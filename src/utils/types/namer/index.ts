import type { vocabulary } from "@assets/data/generator/vocabulary"

export type VocabularyKey = keyof typeof vocabulary

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
