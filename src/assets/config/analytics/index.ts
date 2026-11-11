import appConfig from "@assets/config"

import type { AnalyticsConfig } from "@utils/types/analytics"

const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID ?? ""

const defaultRetentionMonths = 24

const parsedRetentionMonths = Number.parseInt(import.meta.env.VITE_ANALYTICS_RETENTION_MONTHS ?? "", 10)

const analyticsConfig: AnalyticsConfig = {
  websiteId,
  basePath: "/pulse",
  scriptName: "script.js",
  domains: ["noprumo.odutra.com"],
  tag: `v${appConfig.version}`,
  isDoNotTrackRespected: true,
  isSearchExcluded: false,
  retentionMonths: parsedRetentionMonths > 0 ? parsedRetentionMonths : defaultRetentionMonths,
  isEnabled: import.meta.env.PROD && websiteId.length > 0
}

export default analyticsConfig
