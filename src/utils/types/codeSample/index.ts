import type { ProjectFile } from "@utils/types/architecture"

export interface SampleFile {
  path: string
  code: string
}

export type ImportKind = "external" | "internal" | "type"

export interface ImportLine {
  kind: ImportKind
  from: string
  line: string
}

export interface ComponentFiles {
  main: string
  styles?: string
  types?: string
  index?: string
}

export interface FrontendLayout {
  files: ProjectFile[]
  component: ComponentFiles
  api: string
  store: string
  userType: string
  hook: string
  page: string
}
