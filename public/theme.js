const readSavedMode = () => {
  try {
    return localStorage.getItem("enchase-color-mode")
  } catch {
    return null
  }
}

const savedMode = readSavedMode()
const preferredMode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
const mode = savedMode === "light" || savedMode === "dark" ? savedMode : preferredMode

document.documentElement.setAttribute("data-theme", mode)
document.documentElement.style.colorScheme = mode
