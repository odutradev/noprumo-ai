import { ColorModeProvider, GlobalStyles, ToastProvider, UIProvider } from "enchase"
import { useLocation, useNavigate } from "react-router"
import { ptBR } from "enchase/locales"

import { colorModeStorageKey, theme } from "@styles/theme"

import type { ProvidersProps } from "./types"

const Providers = ({ children }: ProvidersProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <ColorModeProvider theme={theme} storageKey={colorModeStorageKey}>
      <GlobalStyles />
      <UIProvider locale={ptBR} navigate={(href) => navigate(href)} currentHref={location.pathname + location.hash}>
        <ToastProvider>{children}</ToastProvider>
      </UIProvider>
    </ColorModeProvider>
  )
}

export default Providers
