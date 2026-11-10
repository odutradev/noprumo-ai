import type { ReactNode } from "react"

export interface StepSection {
  value: string
  label: ReactNode
  content: ReactNode
}

export interface StepSectionsProps {
  label: string
  sections: StepSection[]
}
