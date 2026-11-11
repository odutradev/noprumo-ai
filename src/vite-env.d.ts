interface ImportMetaEnv {
  readonly VITE_APP_ENV: string
  readonly VITE_UMAMI_WEBSITE_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  umami?: import("@utils/types/analytics").UmamiTracker
}
