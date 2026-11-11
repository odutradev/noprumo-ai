import { useEffect } from "react"

import appConfig from "@assets/config"

import type { PageLayoutProps } from "./types"

const PageLayout = ({ children }: PageLayoutProps) => {
  useEffect(() => {
    document.title = appConfig.title
  }, [])

  return children
}

export default PageLayout
