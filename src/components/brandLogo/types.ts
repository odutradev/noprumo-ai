import type { SymbolOptical } from "@utils/types/brand"

export type BrandLogoKind = "horizontal" | "stacked" | "symbol" | "wordmark"

export interface BrandLogoProps {
  kind?: BrandLogoKind
  optical?: SymbolOptical
  label?: string
  className?: string
}
