import { en } from '@assets/data/generator/i18n/en'

import type { GeneratorConfig } from '@utils/types/generator'

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
  custom: boolean
}

export interface MdContext {
  config: GeneratorConfig
  isEn: boolean
  T: (pt: string, english: string) => string
  tr: (text: string) => string
  customText: (key: string) => string | undefined
  field: (key: string, options: FieldOption[], value: string) => ResolvedField
}

export const createMdContext = (config: GeneratorConfig): MdContext => {
  const isEn = config.outputLanguage === 'en'
  const tr = (text: string) => (isEn ? (en[text] ?? text) : text)
  const customText = (key: string) => {
    const text = config.custom[key]?.trim()
    return text ? text : undefined
  }

  return {
    config,
    isEn,
    T: (pt, english) => (isEn ? english : pt),
    tr,
    customText,
    field: (key, options, value) => {
      const custom = customText(key)
      if (custom) return { label: custom, description: '', custom: true }
      const option = options.find((item) => item.value === value) ?? options[0]
      return { label: tr(option.label), description: tr(option.description ?? ''), example: option.example, custom: false }
    }
  }
}

export const sentence = (label: string, description: string) => (description ? `${label}. ${description}` : `${label}.`)
