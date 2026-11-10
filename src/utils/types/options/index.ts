import type { EnabledProjectType, Principle } from "@utils/types/generator"

export interface ArchitectureInfo {
  label: string
  summary: string
  whenToUse: string
  rules: string[]
  badge?: string
}

export interface PrincipleInfo {
  value: Principle
  scope: EnabledProjectType[]
  label: string
  description: string
  good: string
  bad?: string
}
