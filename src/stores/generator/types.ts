import type { ConventionsConfig, GeneratorConfig, NamingConfig, Principle } from '@/types/generator'

export interface GeneratorState {
  config: GeneratorConfig
  step: number
  setStep: (step: number) => void
  update: <K extends keyof GeneratorConfig>(key: K, value: GeneratorConfig[K]) => void
  updateNaming: <K extends keyof NamingConfig>(key: K, value: NamingConfig[K]) => void
  updateConventions: <K extends keyof ConventionsConfig>(key: K, value: ConventionsConfig[K]) => void
  togglePrinciple: (principle: Principle) => void
  applyPreset: (preset: GeneratorConfig) => void
}
