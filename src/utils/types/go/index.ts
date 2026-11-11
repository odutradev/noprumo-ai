import type { ProjectFile } from "@utils/types/architecture"
import type { GoPrinciple } from "@utils/types/generator"
import type { TermRef } from "@utils/types/namer"

export interface GoArchitectureInfo {
  label: string
  summary: string
  whenToUse: string
  rules: string[]
}

export interface GoPrincipleInfo {
  value: GoPrinciple
  label: string
  description: string
  good: string
  bad?: string
}

export interface GoIdiom {
  element: string
  standard: string
  example: string
}

export type GoInterfaceHome = "service" | "domain" | "ports"

export interface GoUnit {
  path: string
  pkg: string
  importPath: string
}

export interface GoLayout {
  files: ProjectFile[]
  model: GoUnit
  service: GoUnit
  repository: GoUnit
  handler: GoUnit
  ports?: GoUnit
  interfaceHome: GoInterfaceHome
  serviceType: string
  serviceMethod: string
  serviceConstructor: string
  repositoryInterface: string
  repositoryType: string
  handlerType: string
}

export interface GoNamer {
  exported: (key: TermRef) => string
  unexported: (key: TermRef) => string
  pkg: (key: TermRef) => string
  file: (key: TermRef) => string
  errVar: (key: TermRef) => string
}
