import "@fontsource-variable/geist-mono"
import ReactDOM from "react-dom/client"
import "@fontsource-variable/geist"
import { StrictMode } from "react"
import "@styles/global.css"
import "enchase/styles.css"

import { loadAnalytics } from "@utils/functions/analytics"
import Router from "@routes/index"

loadAnalytics()

const rootElement = document.getElementById("root")
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <StrictMode>
      <Router />
    </StrictMode>
  )
}
