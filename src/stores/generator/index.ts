import { persist } from 'zustand/middleware'
import { create } from 'zustand'

import { bonfirePreset, codeGuidePreset } from '@/data/generator/presets'

import type { ConventionsConfig, EnabledProjectType, FrontendConfig, GeneratorConfig, NamingConfig, Principle } from '@/types/generator'
import type { GeneratorState } from './types'

export const generatorSteps = ['project', 'language', 'architecture', 'naming', 'conventions', 'commits', 'result'] as const

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
      togglePrinciple: (principle: Principle) =>
        set((state) => {
          const { principles } = state.config.conventions
          const next = principles.includes(principle) ? principles.filter((item) => item !== principle) : [...principles, principle]
          return withConfig(state, { ...state.config, conventions: { ...state.config.conventions, principles: next } })
        }),
      applyPreset: (preset) => set((state) => withConfig(state, preset))
    }),
    { name: 'minhaskill-generator', version: 3, migrate: () => ({ config: codeGuidePreset, configs: { backend: codeGuidePreset, frontend: bonfirePreset }, step: 0 }) as GeneratorState }
  )
)

export default useGeneratorStore
