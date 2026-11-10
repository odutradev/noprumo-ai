import { Button, ConfirmModal, Container, Flex, Navbar, Progress } from 'enchase'
import { useEffect, useRef, useState } from 'react'

import { architectureInfo, frameworkOptions, languageOptions, projectTypeOptions } from '@/data/generator/options'
import useGeneratorStore, { generatorSteps } from '@stores/generator'
import { frontendFrameworkOptions } from '@/data/generator/frontendOptions'
import { commitGranularityOptions } from '@/data/generator/commitOptions'
import { presets } from '@/data/generator/presets'
import { caseStyleLabels } from '@/utils/generator/naming'
import { selectedPrinciples } from '@/utils/generator/markdownHelpers'

import ConventionsStep from './steps/ConventionsStep'
import CommitsStep from './steps/CommitsStep'
import ArchitectureStep from './steps/ArchitectureStep'
import PreviewPanel from './components/PreviewPanel'
import LanguageStep from './steps/LanguageStep'
import ProjectStep from './steps/ProjectStep'
import NamingStep from './steps/NamingStep'
import ResultStep from './steps/ResultStep'
import Stepper from './components/Stepper'

import type { EnabledProjectType, GeneratorConfig } from '@/types/generator'

import styles from './styles.module.css'

const stepComponents = [ProjectStep, LanguageStep, ArchitectureStep, NamingStep, ConventionsStep, CommitsStep, ResultStep]

const labelOf = <T extends string>(options: { value: T; label: string }[], value: T) => options.find((option) => option.value === value)?.label ?? value

const GeneratorPage = () => {
  const config = useGeneratorStore((state) => state.config)
  const step = useGeneratorStore((state) => state.step)
  const setStep = useGeneratorStore((state) => state.setStep)
  const applyPreset = useGeneratorStore((state) => state.applyPreset)
  const [pendingPreset, setPendingPreset] = useState<GeneratorConfig | null>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    topRef.current?.scrollIntoView({ block: 'start' })
  }, [step])

  const isFrontend = config.projectType === 'frontend'
  const typePresets = presets[config.projectType as EnabledProjectType]

  const steps = [
    { label: 'Projeto', hint: labelOf(projectTypeOptions, config.projectType) },
    { label: 'Stack', hint: `${labelOf(languageOptions, config.language)} · ${isFrontend ? labelOf(frontendFrameworkOptions, config.frontend.framework) : labelOf(frameworkOptions, config.framework)}` },
    { label: 'Arquitetura', hint: architectureInfo[config.architecture].label },
    { label: 'Nomenclatura', hint: `${config.naming.language === 'en' ? 'Inglês' : 'Português'} · ${caseStyleLabels[config.naming.functions]}` },
    { label: 'Convenções', hint: `${selectedPrinciples(config).length} princípios` },
    { label: 'Commits', hint: `${labelOf(commitGranularityOptions, config.conventions.commitGranularity)} · ${config.conventions.commitLanguage === 'en' ? 'Inglês' : 'Português'}` },
    { label: 'Resultado', hint: 'SKILL.md' }
  ]

  const CurrentStep = stepComponents[step]
  const isLast = step === generatorSteps.length - 1
  const isResult = generatorSteps[step] === 'result'

  return (
    <>
      <Navbar logo="minhaskill" sections={[{ id: 'main', items: [{ id: 'generator', label: 'Gerador de skills', href: '/' }] }]} translucent />
      <Container as="main" maxWidth="full" className={styles.page}>
        <header className={styles.hero} ref={topRef}>
          <div className={styles.heroText}>
            <span className={styles.eyebrow}>Gerador de skills</span>
            <h1 className={styles.heading}>Transforme os padrões do seu time em uma skill</h1>
            <p className={styles.lead}>Escolha arquitetura, nomenclatura e convenções. O resultado é um SKILL.md pronto para o Claude Code seguir no seu projeto.</p>
          </div>
          <Flex gap="0.5rem" wrap className={styles.presets}>
            <Button variant="outline" size="sm" onClick={() => setPendingPreset(typePresets.mine)}>
              {isFrontend ? 'Usar meu padrão de frontend' : 'Usar meu padrão de backend'}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setPendingPreset(typePresets.neutral)}>
              Começar do padrão neutro
            </Button>
          </Flex>
        </header>

        <div className={styles.progress}>
          <Stepper steps={steps} current={step} onSelect={setStep} />
          <Progress value={step + 1} max={generatorSteps.length} size="sm" aria-label="Progresso do gerador" />
        </div>

        <div className={styles.layout} data-result={isResult || undefined}>
          <section className={styles.main} aria-label={steps[step].label}>
            <CurrentStep />
            <Flex justify="between" gap="0.75rem" className={styles.nav}>
              <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 0}>
                Voltar
              </Button>
              {!isLast && <Button onClick={() => setStep(step + 1)}>Próximo: {steps[step + 1].label}</Button>}
            </Flex>
          </section>
          {!isResult && <PreviewPanel />}
        </div>
      </Container>

      <ConfirmModal
        isOpen={pendingPreset !== null}
        title="Substituir as escolhas atuais?"
        message={`As escolhas de ${isFrontend ? 'frontend' : 'backend'} vão voltar para o preset selecionado.`}
        confirmText="Substituir"
        onConfirm={() => {
          if (pendingPreset) applyPreset(pendingPreset)
        }}
        onClose={() => setPendingPreset(null)}
      />
    </>
  )
}

export default GeneratorPage
