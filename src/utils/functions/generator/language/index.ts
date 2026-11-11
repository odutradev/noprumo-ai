import { javascriptTextOverrides, typescriptOnlyValues } from "@assets/data/generator/javascript"

import type { ChoiceOption, GeneratorConfig, Language } from "@utils/types/generator"

export const isJavaScript = (config: Pick<GeneratorConfig, "language">) => config.language === "javascript"

export const isGo = (config: Pick<GeneratorConfig, "language" | "projectType">) => config.language === "go" && config.projectType === "backend"

export const toJsPath = (path: string) => path.replace(/\.tsx$/, ".jsx").replace(/\.ts$/, ".js")

const withJsExtensions = (text: string) => text.replace(/\.tsx\b/g, ".jsx").replace(/\.ts\b/g, ".js")

export const toJsText = (text: string) => withJsExtensions(javascriptTextOverrides.reduce((current, [from, to]) => current.replaceAll(from, to), text))

const typeDeclarationLine = /^[ \t]*(export )?type \w+(<[^>]*>)? = .*\n?/gm
const interfaceBlock = /^[ \t]*(export )?interface \w+(<[^>]*>)? \{[^}]*\}\n?\n?/gm
const typeImportLine = /^[ \t]*import type .*\n?/gm
const inlineTypeImport = /,\s*type \w+/g
const genericCall = /(\w)<[A-Z][\w<>[\], |.]*>(?=\()/g
const variableAnnotation = /\b(const|let) (\w+): [^=\n]+ =/g
const destructuredAnnotation = /\}: [A-Z][\w<>, |]*(?=\))/g
const parameterAnnotation = /(\w+)\??: (?:Promise<[^()]*?>|[A-Z][\w.]*(?:<[^()]*?>)?(?:\[\])?|string|number|boolean|unknown|void|Date)(?:\s*\|\s*(?:null|undefined|[A-Z]\w*))*(?=\s*[,)])/g
const returnAnnotation = /\): (?:Promise<.*?>+|[A-Z][\w<>| ,]*|string|number|boolean|void) (=>|\{)/g
const castExpression = /\s+as (?:const|[A-Z][\w<>]*(?: \| null)?)\b/g
const parameterProperty = /constructor\(private readonly (\w+): \w+\) \{\}/g

export const toJsSnippet = (code: string) =>
  withJsExtensions(
    code
      .replace(typeImportLine, "")
      .replace(interfaceBlock, "")
      .replace(typeDeclarationLine, "")
      .replace(inlineTypeImport, "")
      .replace(parameterProperty, "constructor($1) {\n    this.$1 = $1\n  }")
      .replace(genericCall, "$1")
      .replace(variableAnnotation, "$1 $2 =")
      .replace(destructuredAnnotation, "}")
      .replace(returnAnnotation, ") $1")
      .replace(parameterAnnotation, "$1")
      .replace(castExpression, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  )

export const isAvailableFor = (language: Language, value: string) => language !== "javascript" || !typescriptOnlyValues.includes(value)

export const forLanguage = <T extends string>(options: ChoiceOption<T>[], language: Language): ChoiceOption<T>[] => {
  if (language !== "javascript") return options
  return options
    .filter((option) => isAvailableFor(language, option.value))
    .map((option) => ({ ...option, label: toJsText(option.label), description: toJsText(option.description), example: option.example ? toJsSnippet(option.example) : undefined }))
}

export const toJsMarkdown = (markdown: string) => toJsText(markdown.replaceAll("```typescript", "```javascript").replaceAll("```tsx", "```jsx"))

export const normalizeForLanguage = (config: GeneratorConfig): GeneratorConfig => {
  if (config.language !== "javascript") return config
  return {
    ...config,
    framework: config.framework === "nestjs" ? "express" : config.framework,
    database: config.database === "typeorm" ? "prisma" : config.database,
    conventions: {
      ...config.conventions,
      validation: config.conventions.validation === "classValidator" ? "zod" : config.conventions.validation,
      principles: config.conventions.principles.filter((principle) => principle !== "noAny")
    },
    frontend: { ...config.frontend, componentDeclaration: config.frontend.componentDeclaration === "arrowFC" ? "arrowProps" : config.frontend.componentDeclaration }
  }
}
