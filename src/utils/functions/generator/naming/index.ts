import type { CaseStyle } from "@utils/types/generator"

const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1)

export const toCase = (words: string[], style: CaseStyle): string => {
  const parts = words.map((word) => word.toLowerCase())

  switch (style) {
    case "camel":
      return parts.map((word, index) => (index === 0 ? word : capitalize(word))).join("")
    case "pascal":
      return parts.map(capitalize).join("")
    case "snake":
      return parts.join("_")
    case "screamingSnake":
      return parts.join("_").toUpperCase()
    case "kebab":
      return parts.join("-")
  }
}

export const caseStyleLabels: Record<CaseStyle, string> = {
  camel: "camelCase",
  pascal: "PascalCase",
  snake: "snake_case",
  screamingSnake: "SCREAMING_SNAKE",
  kebab: "kebab-case"
}
