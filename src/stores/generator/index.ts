import { persist } from "zustand/middleware"
import { create } from "zustand"

import { bonfirePreset, codeGuidePreset, fullstackPreset } from "@assets/data/generator/presets"
import { deployDefaults, workspaceDefaults } from "@assets/data/generator/deployOptions"

import type { ContainerService, ConventionsConfig, DeployConfig, EnabledProjectType, FrontendConfig, GeneratorConfig, NamingConfig, Principle, PublishAction, PublishingConfig, WorkspaceConfig } from "@utils/types/generator"
import type { GeneratorState, GeneratorStep, LegacyConfig, LegacyState } from "./types"

export const stepsByType: Record<EnabledProjectType, GeneratorStep[]> = {
  backend: ["project", "language", "architecture", "naming", "conventions", "commits", "deploy", "publish", "result"],
  frontend: ["project", "language", "architecture", "naming", "conventions", "commits", "deploy", "publish", "result"],
  fullstack: ["project", "workspace", "deploy", "commits", "publish", "result"]
}

export const getSteps = (config: GeneratorConfig) => stepsByType[config.projectType as EnabledProjectType]

const initialConfigs: Record<EnabledProjectType, GeneratorConfig> = { backend: codeGuidePreset, frontend: bonfirePreset, fullstack: fullstackPreset }

const withDefaults = (config: LegacyConfig): GeneratorConfig => ({ deploy: deployDefaults, workspace: workspaceDefaults, ...config })

const withConfig = (state: GeneratorState, config: GeneratorConfig) => ({
  config,
  configs: { ...state.configs, [config.projectType as EnabledProjectType]: config }
})

const clampStep = (config: GeneratorConfig, step: number) => Math.min(Math.max(step, 0), getSteps(config).length - 1)

const migrate = (persisted: unknown, version: number) => {
  const initial = { config: codeGuidePreset, configs: initialConfigs, step: 0, format: "skill" }
  if (version !== 6) return initial as GeneratorState
  const state = persisted as LegacyState
  const config = withDefaults(state.config)
  const configs = { backend: withDefaults(state.configs.backend), frontend: withDefaults(state.configs.frontend), fullstack: fullstackPreset }
  return { ...state, config, configs, step: clampStep(config, state.step), format: state.format ?? "skill" } as GeneratorState
}

const storageKey = "noprumo-generator"
const legacyStorageKeys = ["prumo-ai-generator", "minhaskill-generator"]

const moveLegacyStorage = () => {
  try {
    const legacyKey = legacyStorageKeys.find((key) => localStorage.getItem(key))
    if (!legacyKey) return
    const legacy = localStorage.getItem(legacyKey)
    if (legacy && !localStorage.getItem(storageKey)) localStorage.setItem(storageKey, legacy)
    legacyStorageKeys.forEach((key) => localStorage.removeItem(key))
  } catch {
    return
  }
}

moveLegacyStorage()

const useGeneratorStore = create<GeneratorState>()(
  persist(
    (set) => ({
      config: codeGuidePreset,
      configs: initialConfigs,
      step: 0,
      format: "skill",
      setFormat: (format) => set({ format }),
      setStep: (step) => set((state) => ({ step: clampStep(state.config, step) })),
      setProjectType: (projectType) => set((state) => ({ config: state.configs[projectType], step: clampStep(state.configs[projectType], state.step) })),
      editApp: (projectType, step) => set((state) => ({ config: state.configs[projectType], step: clampStep(state.configs[projectType], step) })),
      update: <K extends keyof GeneratorConfig>(key: K, value: GeneratorConfig[K]) => set((state) => withConfig(state, { ...state.config, [key]: value })),
      updateNaming: <K extends keyof NamingConfig>(key: K, value: NamingConfig[K]) => set((state) => withConfig(state, { ...state.config, naming: { ...state.config.naming, [key]: value } })),
      updateConventions: <K extends keyof ConventionsConfig>(key: K, value: ConventionsConfig[K]) =>
        set((state) => withConfig(state, { ...state.config, conventions: { ...state.config.conventions, [key]: value } })),
      updateFrontend: <K extends keyof FrontendConfig>(key: K, value: FrontendConfig[K]) => set((state) => withConfig(state, { ...state.config, frontend: { ...state.config.frontend, [key]: value } })),
      updatePublishing: <K extends keyof PublishingConfig>(key: K, value: PublishingConfig[K]) =>
        set((state) => withConfig(state, { ...state.config, publishing: { ...state.config.publishing, [key]: value } })),
      updateDeploy: <K extends keyof DeployConfig>(key: K, value: DeployConfig[K]) => set((state) => withConfig(state, { ...state.config, deploy: { ...state.config.deploy, [key]: value } })),
      updateWorkspace: <K extends keyof WorkspaceConfig>(key: K, value: WorkspaceConfig[K]) =>
        set((state) => withConfig(state, { ...state.config, workspace: { ...state.config.workspace, [key]: value } })),
      toggleService: (service: ContainerService) =>
        set((state) => {
          const { services } = state.config.deploy
          const next = services.includes(service) ? services.filter((item) => item !== service) : [...services, service]
          return withConfig(state, { ...state.config, deploy: { ...state.config.deploy, services: next } })
        }),
      togglePublishAction: (action: PublishAction) =>
        set((state) => {
          const { actions } = state.config.publishing
          const next = actions.includes(action) ? actions.filter((item) => item !== action) : [...actions, action]
          return withConfig(state, { ...state.config, publishing: { ...state.config.publishing, actions: next } })
        }),
      setCustom: (key: string, text: string | undefined) =>
        set((state) => {
          const { [key]: _removed, ...rest } = state.config.custom
          return withConfig(state, { ...state.config, custom: text === undefined ? rest : { ...rest, [key]: text } })
        }),
      togglePrinciple: (principle: Principle) =>
        set((state) => {
          const { principles } = state.config.conventions
          const next = principles.includes(principle) ? principles.filter((item) => item !== principle) : [...principles, principle]
          return withConfig(state, { ...state.config, conventions: { ...state.config.conventions, principles: next } })
        }),
      applyPreset: (preset) => set((state) => withConfig(state, preset))
    }),
    { name: storageKey, version: 7, migrate }
  )
)

export default useGeneratorStore
