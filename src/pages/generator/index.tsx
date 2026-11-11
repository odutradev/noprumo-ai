import { Button, ConfirmModal, Drawer, Navbar } from "enchase"
import { useEffect, useRef, useState } from "react"

import { architectureInfo, frameworkOptions, languageOptions, projectTypeOptions } from "@assets/data/generator/options"
import { frontendFrameworkOptions } from "@assets/data/generator/frontendOptions"
import { commitGranularityOptions } from "@assets/data/generator/commitOptions"
import { selectedPrinciples } from "@utils/functions/generator/markdownHelpers"
import { caseStyleLabels } from "@utils/functions/generator/naming"
import useGeneratorStore, { getSteps } from "@stores/generator"
import ArchitectureStep from "@components/architectureStep"
import ConventionsStep from "@components/conventionsStep"
import { presets } from "@assets/data/generator/presets"
import WorkspaceStep from "@components/workspaceStep"
import PreviewPanel from "@components/previewPanel"
import LanguageStep from "@components/languageStep"
import CommitsStep from "@components/commitsStep"
import PublishStep from "@components/publishStep"
import ProjectStep from "@components/projectStep"
import DeployStep from "@components/deployStep"
import NamingStep from "@components/namingStep"
import ResultStep from "@components/resultStep"
import Stepper from "@components/stepper"
import styles from "./styles.module.css"

import type { EnabledProjectType, GeneratorConfig } from "@utils/types/generator"
import type { GeneratorStep } from "@stores/generator/types"
import type { PageMetadata } from "@utils/types/page"
import type { ComponentType } from "react"

export const metadata: PageMetadata = { title: "Gerador de skills" }

const stepComponents: Record<GeneratorStep, ComponentType> = {
  project: ProjectStep,
  language: LanguageStep,
  architecture: ArchitectureStep,
  naming: NamingStep,
  conventions: ConventionsStep,
  commits: CommitsStep,
  workspace: WorkspaceStep,
  deploy: DeployStep,
  publish: PublishStep,
  result: ResultStep
}

const typeNames: Record<EnabledProjectType, string> = { backend: "backend", frontend: "frontend", fullstack: "fullstack" }

const labelOf = <T extends string>(options: { value: T; label: string }[], value: T) => options.find((option) => option.value === value)?.label ?? value

const GeneratorPage = () => {
  const config = useGeneratorStore((state) => state.config)
  const step = useGeneratorStore((state) => state.step)
  const format = useGeneratorStore((state) => state.format)
  const setStep = useGeneratorStore((state) => state.setStep)
  const applyPreset = useGeneratorStore((state) => state.applyPreset)
  const [pendingPreset, setPendingPreset] = useState<GeneratorConfig | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    window.scrollTo({ top: 0 })
  }, [step])

  const isFrontend = config.projectType === "frontend"
  const typePresets = presets[config.projectType as EnabledProjectType]

  const stepInfo: Record<GeneratorStep, { label: string; hint: string }> = {
    project: { label: "Projeto", hint: labelOf(projectTypeOptions, config.projectType) },
    language: { label: "Stack", hint: `${labelOf(languageOptions, config.language)} · ${isFrontend ? labelOf(frontendFrameworkOptions, config.frontend.framework) : labelOf(frameworkOptions, config.framework)}` },
    architecture: { label: "Arquitetura", hint: architectureInfo[config.architecture].label },
    naming: { label: "Nomenclatura", hint: `${config.naming.language === "en" ? "Inglês" : "Português"} · ${caseStyleLabels[config.naming.functions]}` },
    conventions: { label: "Convenções", hint: `${selectedPrinciples(config).length} princípios` },
    commits: { label: "Commits", hint: `${labelOf(commitGranularityOptions, config.conventions.commitGranularity)} · ${config.conventions.commitLanguage === "en" ? "Inglês" : "Português"}` },
    workspace: { label: "Monorepo", hint: `${config.workspace.backendFolder || "api"}/ · ${config.workspace.frontendFolder || "frontend"}/` },
    deploy: { label: "Deploy", hint: [config.deploy.hasDocker ? "Docker" : "", config.deploy.hasCompose ? "Compose" : "", config.deploy.hasNginx ? "Nginx" : ""].filter(Boolean).join(" · ") || "Desligado" },
    publish: { label: "Publicação", hint: config.publishing.isEnabled ? "project-publisher" : "Desligada" },
    result: { label: "Resultado", hint: `${format === "skill" ? "SKILL.md" : "CLAUDE.md"}${config.projectType === "fullstack" ? " + 2 guias" : ""}` }
  }

  const stepIds = getSteps(config)
  const steps = stepIds.map((id) => stepInfo[id])
  const currentId = stepIds[step] ?? "project"
  const CurrentStep = stepComponents[currentId]
  const isFirst = step === 0
  const isLast = step === stepIds.length - 1
  const isResult = currentId === "result"

  const handleConfirmPreset = () => {
    if (pendingPreset) applyPreset(pendingPreset)
  }

  return (
    <>
      <Navbar
        className={styles.navbar}
        sections={[]}
        logo={<span className={styles.logo}>minhaskill</span>}
        actions={
          <div className={styles.presets}>
            <Button variant="ghost" size="sm" onClick={() => setPendingPreset(typePresets.mine)}>
              Meu padrão de {typeNames[config.projectType as EnabledProjectType]}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setPendingPreset(typePresets.neutral)}>
              Padrão neutro
            </Button>
          </div>
        }
      />

      <div className={styles.shell} data-result={isResult || undefined}>
        <aside className={styles.steps}>
          <Stepper steps={steps} current={step} onSelect={setStep} />
        </aside>

        <main className={styles.content} aria-label={steps[step].label}>
          <div className={styles.stepBody}>
            <CurrentStep />
          </div>
          <div className={styles.footer}>
            <Button variant="outline" onClick={() => setStep(step - 1)} disabled={isFirst}>
              Voltar
            </Button>
            <div className={styles.footerEnd}>
              {!isResult && (
                <Button variant="ghost" className={styles.previewButton} onClick={() => setIsPreviewOpen(true)}>
                  Prévia
                </Button>
              )}
              {!isLast && (
                <Button onClick={() => setStep(step + 1)}>
                  <span className={styles.nextFull}>Próximo: {steps[step + 1].label}</span>
                  <span className={styles.nextShort}>Próximo</span>
                </Button>
              )}
            </div>
          </div>
        </main>

        {!isResult && (
          <aside className={styles.preview} aria-label="Pré-visualização">
            <PreviewPanel />
          </aside>
        )}
      </div>

      <Drawer open={isPreviewOpen && !isResult} onClose={() => setIsPreviewOpen(false)} title="Prévia ao vivo" side="end" size="lg">
        <PreviewPanel hasHeader={false} />
      </Drawer>

      <ConfirmModal
        isOpen={pendingPreset !== null}
        title="Substituir as escolhas atuais?"
        message={`As escolhas de ${typeNames[config.projectType as EnabledProjectType]} vão voltar para o preset selecionado.`}
        confirmText="Substituir"
        onConfirm={handleConfirmPreset}
        onClose={() => setPendingPreset(null)}
      />
    </>
  )
}

export default GeneratorPage
