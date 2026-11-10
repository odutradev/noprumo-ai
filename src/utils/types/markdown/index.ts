import type { GeneratorConfig } from "@utils/types/generator"

export interface FieldOption {
  value: string
  label: string
  description?: string
  example?: string
}

export interface ResolvedField {
  label: string
  description: string
  example?: string
  isCustom: boolean
}

export interface MdContext {
  config: GeneratorConfig
  isEn: boolean
  byLanguage: (pt: string, english: string) => string
  tr: (text: string) => string
  customText: (key: string) => string | undefined
  field: (key: string, options: FieldOption[], value: string) => ResolvedField
}
