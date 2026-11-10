import ReactDOM from "react-dom/client"
import "@fontsource-variable/figtree"
import { StrictMode } from "react"
import "enchase/styles.css"

import Router from "@routes/index"

const rootElement = document.getElementById("root")
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <StrictMode>
      <Router />
    </StrictMode>
  )
}
