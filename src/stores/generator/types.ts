import type { ConventionsConfig, EnabledProjectType, FrontendConfig, GeneratorConfig, NamingConfig, OutputFormat, Principle, PublishAction, PublishingConfig } from "@utils/types/generator"

export interface GeneratorState {
  config: GeneratorConfig
  configs: Record<EnabledProjectType, GeneratorConfig>
  step: number
  format: OutputFormat
  setStep: (step: number) => void
  setFormat: (format: OutputFormat) => void
  setProjectType: (projectType: EnabledProjectType) => void
  update: <K extends keyof GeneratorConfig>(key: K, value: GeneratorConfig[K]) => void
  updateNaming: <K extends keyof NamingConfig>(key: K, value: NamingConfig[K]) => void
  updateConventions: <K extends keyof ConventionsConfig>(key: K, value: ConventionsConfig[K]) => void
  updateFrontend: <K extends keyof FrontendConfig>(key: K, value: FrontendConfig[K]) => void
  updatePublishing: <K extends keyof PublishingConfig>(key: K, value: PublishingConfig[K]) => void
  togglePublishAction: (action: PublishAction) => void
  setCustom: (key: string, text: string | undefined) => void
  togglePrinciple: (principle: Principle) => void
  applyPreset: (preset: GeneratorConfig) => void
}
