import { persist } from 'zustand/middleware'
import { create } from 'zustand'

import { bonfirePreset, codeGuidePreset } from '@assets/data/generator/presets'

import type { ConventionsConfig, EnabledProjectType, FrontendConfig, GeneratorConfig, NamingConfig, Principle, PublishAction, PublishingConfig } from '@utils/types/generator'
import type { GeneratorState } from './types'

export const generatorSteps = ['project', 'language', 'architecture', 'naming', 'conventions', 'commits', 'publish', 'result'] as const

const withConfig = (state: GeneratorState, config: GeneratorConfig) => ({
  config,
  configs: { ...state.configs, [config.projectType as EnabledProjectType]: config }
})

const useGeneratorStore = create<GeneratorState>()(
  persist(
    (set) => ({
      config: codeGuidePreset,
      configs: { backend: codeGuidePreset, frontend: bonfirePreset },
      step: 0,
      setStep: (step) => set({ step: Math.min(Math.max(step, 0), generatorSteps.length - 1) }),
      setProjectType: (projectType) => set((state) => ({ config: state.configs[projectType] })),
      update: <K extends keyof GeneratorConfig>(key: K, value: GeneratorConfig[K]) => set((state) => withConfig(state, { ...state.config, [key]: value })),
      updateNaming: <K extends keyof NamingConfig>(key: K, value: NamingConfig[K]) => set((state) => withConfig(state, { ...state.config, naming: { ...state.config.naming, [key]: value } })),
      updateConventions: <K extends keyof ConventionsConfig>(key: K, value: ConventionsConfig[K]) =>
        set((state) => withConfig(state, { ...state.config, conventions: { ...state.config.conventions, [key]: value } })),
      updateFrontend: <K extends keyof FrontendConfig>(key: K, value: FrontendConfig[K]) => set((state) => withConfig(state, { ...state.config, frontend: { ...state.config.frontend, [key]: value } })),
      updatePublishing: <K extends keyof PublishingConfig>(key: K, value: PublishingConfig[K]) =>
        set((state) => withConfig(state, { ...state.config, publishing: { ...state.config.publishing, [key]: value } })),
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
    { name: 'minhaskill-generator', version: 5, migrate: () => ({ config: codeGuidePreset, configs: { backend: codeGuidePreset, frontend: bonfirePreset }, step: 0 }) as GeneratorState }
  )
)

export default useGeneratorStore
