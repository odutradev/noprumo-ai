import type { ReactNode } from "react"

export interface CheckCardProps {
  label: string
  description: string
  isChecked: boolean
  onToggle: () => void
  extra?: ReactNode
  children?: ReactNode
}
