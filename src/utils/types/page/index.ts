import type { ComponentType } from "react"

export interface PageMetadata {
  title: string
}

export interface PageRoute {
  path: string
  page: ComponentType
  metadata: PageMetadata
}
