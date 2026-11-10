import type { CaseStyle, NamingConfig } from "@utils/types/generator"
import type { Namer } from "@utils/types/namer"

export type CaseKey = { [K in keyof NamingConfig]: NamingConfig[K] extends CaseStyle ? K : never }[keyof NamingConfig]

export interface CaseCategory {
  key: CaseKey
  label: string
  description: string
  options: CaseStyle[]
  example: (namer: Namer) => string
}

export interface NamingGroup {
  title: string
  description: string
  categories: CaseCategory[]
}
