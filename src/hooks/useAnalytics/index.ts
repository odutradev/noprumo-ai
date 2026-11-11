import { identifyVisitor, trackEvent, trackPageview } from "@utils/functions/analytics"
import analyticsConfig from "@assets/config/analytics"

const useAnalytics = () => ({
  isEnabled: analyticsConfig.isEnabled,
  track: trackEvent,
  trackPageview,
  identify: identifyVisitor
})

export default useAnalytics
