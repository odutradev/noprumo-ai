import type { CSSProperties, ReactNode } from "react"

export type BrandStageTone = "dark" | "light" | "orange" | "checker" | "checkerDark"

export interface BrandStageProps {
  tone: BrandStageTone
  children: ReactNode
  className?: string
  style?: CSSProperties
  label?: string
}
