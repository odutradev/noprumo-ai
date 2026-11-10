export type TokenType = "plain" | "comment" | "string" | "keyword" | "decorator" | "number" | "type"

export interface Token {
  text: string
  type: TokenType
}
