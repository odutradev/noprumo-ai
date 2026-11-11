interface ImportMetaEnv {
  readonly VITE_APP_ENV: string
  readonly VITE_UMAMI_WEBSITE_ID?: string
  readonly VITE_ANALYTICS_RETENTION_MONTHS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  umami?: import("@utils/types/analytics").UmamiTracker
}
