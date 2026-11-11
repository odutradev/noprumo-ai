import type { ReactNode } from "react"

export interface CtaLinkProps {
  href: string
  size?: "sm" | "md" | "lg"
  children: ReactNode
  className?: string
}
