export type UnitKind = "action" | "service" | "useCase" | "handler"

export interface ProjectFile {
  path: string
  note?: string
  isHighlighted?: boolean
}

export interface ArchitectureLayout {
  kind: UnitKind
  files: ProjectFile[]
  mainPath: string
  schemaPath: string
  typesPath?: string
  repositoryPath: string
  errorsPath: string
}
