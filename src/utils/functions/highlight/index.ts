import type { Token, TokenType } from "@utils/types/highlight"

const keywords = ["import", "from", "export", "default", "const", "let", "async", "await", "return", "if", "else", "throw", "new", "class", "interface", "type", "enum", "extends", "private", "readonly", "constructor", "function", "typeof", "this", "for", "of"]

const pattern = new RegExp(
  [
    String.raw`(\/\/.*$|\/\*[\s\S]*?\*\/)`,
    String.raw`('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|` + "`" + String.raw`(?:[^` + "`" + String.raw`\\]|\\.)*` + "`)",
    String.raw`\b(${keywords.join("|")})\b`,
    String.raw`(@\w+)`,
    String.raw`\b(\d+)\b`,
    String.raw`\b([A-Z][A-Za-z0-9_]*)\b`
  ].join("|"),
  "gm"
)

const groups: TokenType[] = ["comment", "string", "keyword", "decorator", "number", "type"]

export const tokenize = (code: string): Token[] => {
  const { tokens, cursor } = [...code.matchAll(pattern)].reduce<{ tokens: Token[]; cursor: number }>(
    (acc, match) => {
      const index = match.index ?? 0
      const groupIndex = match.slice(1).findIndex((group) => group !== undefined)
      const before: Token[] = index > acc.cursor ? [{ text: code.slice(acc.cursor, index), type: "plain" }] : []
      return { tokens: [...acc.tokens, ...before, { text: match[0], type: groups[groupIndex] ?? "plain" }], cursor: index + match[0].length }
    },
    { tokens: [], cursor: 0 }
  )
  return cursor < code.length ? [...tokens, { text: code.slice(cursor), type: "plain" }] : tokens
}
