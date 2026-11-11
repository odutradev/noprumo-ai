import type { IdentifierLanguage, Language, OutputFormat, ProjectType } from "@utils/types/generator"
import type { ExportFormat, LogoKind } from "@utils/types/brand"

export type AnalyticsValue = string | number | boolean

export type AnalyticsData = Record<string, AnalyticsValue>

export type GuideEventData = {
  format: OutputFormat
  projectType: ProjectType
  language: Language
  outputLanguage: IdentifierLanguage
}

export type AnalyticsEvents = {
  "guide-download": GuideEventData & { files: number }
  "guide-copy": GuideEventData
  "brand-download": { kind: LogoKind; format: ExportFormat; size: number; source: "center" | "quick" }
  "brand-copy": { kind: LogoKind }
}

export type AnalyticsEventName = keyof AnalyticsEvents

export interface UmamiTracker {
  track: {
    (): void
    (eventName: string, data?: AnalyticsData): void
  }
  identify: {
    (id: string, data?: AnalyticsData): void
    (data: AnalyticsData): void
  }
}

export interface AnalyticsConfig {
  websiteId: string
  basePath: string
  scriptName: string
  domains: string[]
  tag: string
  isDoNotTrackRespected: boolean
  isSearchExcluded: boolean
  isEnabled: boolean
}
