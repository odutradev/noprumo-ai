import { toJsSnippet } from "@utils/functions/generator/language"
import { en } from "@assets/data/generator/i18n/en"

import type { GeneratorConfig } from "@utils/types/generator"
import type { MdContext } from "@utils/types/markdown"

export const createMdContext = (config: GeneratorConfig, isWorkspaceApp = false): MdContext => {
  const isEn = config.outputLanguage === "en"
  const tr = (text: string) => (isEn ? (en[text] ?? text) : text)
  const customText = (key: string) => {
    const text = config.custom[key]?.trim()
    return text ? text : undefined
  }

  return {
    config,
    isEn,
    isWorkspaceApp,
    byLanguage: (pt, english) => (isEn ? english : pt),
    tr,
    customText,
    field: (key, options, value) => {
      const custom = customText(key)
      if (custom) return { label: custom, description: "", isCustom: true }
      const option = options.find((item) => item.value === value) ?? options[0]
      const example = option.example && config.language === "javascript" ? toJsSnippet(option.example) : option.example
      return { label: tr(option.label), description: tr(option.description ?? ""), example, isCustom: false }
    }
  }
}

export const sentence = (label: string, description: string) => (description ? `${label}. ${description}` : `${label}.`)
