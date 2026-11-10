import { persist } from 'zustand/middleware'
import { create } from 'zustand'

import { codeGuidePreset } from '@/data/generator/presets'

import type { ConventionsConfig, GeneratorConfig, NamingConfig, Principle } from '@/types/generator'
import type { GeneratorState } from './types'

export const generatorSteps = ['project', 'language', 'architecture', 'naming', 'conventions', 'result'] as const

const useGeneratorStore = create<GeneratorState>()(
  persist(
    (set) => ({
      config: codeGuidePreset,
      step: 0,
      setStep: (step) => set({ step: Math.min(Math.max(step, 0), generatorSteps.length - 1) }),
      update: <K extends keyof GeneratorConfig>(key: K, value: GeneratorConfig[K]) => set((state) => ({ config: { ...state.config, [key]: value } })),
      updateNaming: <K extends keyof NamingConfig>(key: K, value: NamingConfig[K]) => set((state) => ({ config: { ...state.config, naming: { ...state.config.naming, [key]: value } } })),
      updateConventions: <K extends keyof ConventionsConfig>(key: K, value: ConventionsConfig[K]) => set((state) => ({ config: { ...state.config, conventions: { ...state.config.conventions, [key]: value } } })),
      togglePrinciple: (principle: Principle) =>
        set((state) => {
          const { principles } = state.config.conventions
          const next = principles.includes(principle) ? principles.filter((item) => item !== principle) : [...principles, principle]
          return { config: { ...state.config, conventions: { ...state.config.conventions, principles: next } } }
        }),
      applyPreset: (preset) => set({ config: preset })
    }),
    { name: 'minhaskill-generator', version: 1 }
  )
)

export default useGeneratorStore
