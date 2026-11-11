import { createLocalLogger } from "@utils/functions/logger"
import analyticsConfig from "@assets/config/analytics"

import type { AnalyticsData, AnalyticsEventName, AnalyticsEvents } from "@utils/types/analytics"

const logger = createLocalLogger("analytics")

const scriptSelector = "script[data-website-id]"

const buildAttributes = () => ({
  "data-website-id": analyticsConfig.websiteId,
  "data-host-url": `${window.location.origin}${analyticsConfig.basePath}`,
  "data-domains": analyticsConfig.domains.join(","),
  "data-tag": analyticsConfig.tag,
  ...(analyticsConfig.isDoNotTrackRespected ? { "data-do-not-track": "true" } : {}),
  ...(analyticsConfig.isSearchExcluded ? { "data-exclude-search": "true" } : {})
})

export const loadAnalytics = () => {
  if (!analyticsConfig.isEnabled) return
  if (document.querySelector(scriptSelector)) return
  const script = document.createElement("script")
  script.defer = true
  script.src = `${analyticsConfig.basePath}/${analyticsConfig.scriptName}`
  Object.entries(buildAttributes()).forEach(([name, value]) => script.setAttribute(name, value))
  document.head.appendChild(script)
}

export const trackEvent = <E extends AnalyticsEventName>(eventName: E, data: AnalyticsEvents[E]) => {
  if (!analyticsConfig.isEnabled) return logger.info(eventName, data)
  window.umami?.track(eventName, data)
}

export const trackPageview = () => {
  if (!analyticsConfig.isEnabled) return logger.info("pageview", window.location.pathname)
  window.umami?.track()
}

export const identifyVisitor = (data: AnalyticsData) => {
  if (!analyticsConfig.isEnabled) return logger.info("identify", data)
  window.umami?.identify(data)
}
