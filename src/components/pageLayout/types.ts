import type { PageMetadata } from "@utils/types/page"
import type { ReactNode } from "react"

export interface PageLayoutProps {
  metadata: PageMetadata
  children: ReactNode
}
