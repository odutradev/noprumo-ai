import type { AppProjectType, ContainerService, ConventionsConfig, DeployConfig, EnabledProjectType, FrontendConfig, GeneratorConfig, GoConfig, GoPrinciple, Language, NamingConfig, OutputFormat, Principle, PublishAction, PublishingConfig, WorkspaceConfig } from "@utils/types/generator"

export type GeneratorStep = "project" | "language" | "architecture" | "naming" | "conventions" | "commits" | "workspace" | "deploy" | "publish" | "result"

export type LegacyConfig = Omit<GeneratorConfig, "deploy" | "workspace" | "go" | "frontend"> & Partial<Pick<GeneratorConfig, "deploy" | "workspace" | "go">> & { frontend: Partial<FrontendConfig> }

export interface LegacyState {
  config: LegacyConfig
  configs: Record<AppProjectType, LegacyConfig>
  step: number
  format?: OutputFormat
}

export interface GeneratorState {
  config: GeneratorConfig
  configs: Record<EnabledProjectType, GeneratorConfig>
  step: number
  format: OutputFormat
  setStep: (step: number) => void
  setFormat: (format: OutputFormat) => void
  setProjectType: (projectType: EnabledProjectType) => void
  editApp: (projectType: AppProjectType, step: number) => void
  update: <K extends keyof GeneratorConfig>(key: K, value: GeneratorConfig[K]) => void
  updateNaming: <K extends keyof NamingConfig>(key: K, value: NamingConfig[K]) => void
  updateConventions: <K extends keyof ConventionsConfig>(key: K, value: ConventionsConfig[K]) => void
  updateFrontend: <K extends keyof FrontendConfig>(key: K, value: FrontendConfig[K]) => void
  updatePublishing: <K extends keyof PublishingConfig>(key: K, value: PublishingConfig[K]) => void
  updateDeploy: <K extends keyof DeployConfig>(key: K, value: DeployConfig[K]) => void
  updateWorkspace: <K extends keyof WorkspaceConfig>(key: K, value: WorkspaceConfig[K]) => void
  toggleService: (service: ContainerService) => void
  togglePublishAction: (action: PublishAction) => void
  setCustom: (key: string, text: string | undefined) => void
  togglePrinciple: (principle: Principle) => void
  applyPreset: (preset: GeneratorConfig) => void
  setLanguage: (language: Language) => void
  updateGo: <K extends keyof GoConfig>(key: K, value: GoConfig[K]) => void
  toggleGoPrinciple: (principle: GoPrinciple) => void
}
