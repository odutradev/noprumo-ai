import { useEffect } from "react"

import appConfig from "@assets/config"

import type { PageLayoutProps } from "./types"

const PageLayout = ({ metadata, children }: PageLayoutProps) => {
  useEffect(() => {
    document.title = `${metadata.title} · ${appConfig.name}`
  }, [metadata.title])

  return children
}

export default PageLayout
