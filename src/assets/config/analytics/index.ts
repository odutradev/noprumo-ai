import appConfig from "@assets/config"

import type { AnalyticsConfig } from "@utils/types/analytics"

const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID ?? ""

const analyticsConfig: AnalyticsConfig = {
  websiteId,
  basePath: "/pulse",
  scriptName: "script.js",
  domains: ["noprumo.odutra.com"],
  tag: `v${appConfig.version}`,
  isDoNotTrackRespected: true,
  isSearchExcluded: false,
  isEnabled: import.meta.env.PROD && websiteId.length > 0
}

export default analyticsConfig
