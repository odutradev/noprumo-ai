import { Flex, Grid } from "enchase"
import { useMemo } from "react"

import { pageStructureOptions, scopeSeparationOptions, splitFileOptions } from "@assets/data/generator/frontendOptions"
import { architectureInfo, architectureOrder } from "@assets/data/generator/options"
import { buildTree, getProjectFiles } from "@utils/functions/generator/architecture"
import { goArchitectureInfo, goArchitectureOrder } from "@assets/data/generator/go"
import { hasPageScope } from "@utils/functions/generator/frontend"
import { isGo } from "@utils/functions/generator/language"
import useCustomField from "@hooks/useCustomField"
import ChoiceCards from "@components/choiceCards"
import useGeneratorStore from "@stores/generator"
import StepHeader from "@components/stepHeader"
import CheckCard from "@components/checkCard"
import FileTree from "@components/fileTree"
import styles from "./styles.module.css"

import type { AppProjectType, Architecture, ChoiceOption, GoArchitecture, SplitFile } from "@utils/types/generator"

const ArchitectureStep = () => {
  const custom = useCustomField()
  const config = useGeneratorStore((state) => state.config)
  const update = useGeneratorStore((state) => state.update)
  const updateGo = useGeneratorStore((state) => state.updateGo)
  const updateFrontend = useGeneratorStore((state) => state.updateFrontend)
  const isGoProject = isGo(config)
  const selected = isGoProject ? goArchitectureInfo[config.go.architecture] : architectureInfo[config.architecture]
  const customField = custom("architecture")
  const isCustom = customField.customText !== undefined
  const hasScopeSettings = config.projectType === "frontend" && hasPageScope(config) && !isCustom
  const { frontend } = config

  const handleToggleSplit = (file: SplitFile) => updateFrontend("splitFiles", frontend.splitFiles.includes(file) ? frontend.splitFiles.filter((item) => item !== file) : [...frontend.splitFiles, file])

  const goOptions: ChoiceOption<GoArchitecture>[] = goArchitectureOrder.map((value) => ({ value, label: goArchitectureInfo[value].label, description: goArchitectureInfo[value].summary.replaceAll("`", "") }))

  const options: ChoiceOption<Architecture>[] = architectureOrder[config.projectType as AppProjectType].map((value) => ({
    value,
    label: architectureInfo[value].label,
    description: architectureInfo[value].summary.replaceAll("`", ""),
    badge: architectureInfo[value].badge
  }))

  const tree = useMemo(() => {
    const files = getProjectFiles({ ...config, conventions: { ...config.conventions, testing: "none" }, frontend: { ...config.frontend, e2e: "none" } })
    const nodes = buildTree(files)
    return isGo(config) ? nodes : (nodes.find((node) => node.name === "src")?.children ?? [])
  }, [config])

  return (
    <Flex direction="column" gap="var(--enchase-space-lg)">
      <StepHeader title="Arquitetura" description="Como o código é organizado em pastas e camadas. A árvore já usa a nomenclatura que você escolher." />
      {isGoProject ? (
        <ChoiceCards legend="Organização" options={goOptions} value={config.go.architecture} onChange={(value) => updateGo("architecture", value)} minWidth="14rem" {...customField} />
      ) : (
        <ChoiceCards legend="Organização" options={options} value={config.architecture} onChange={(value) => update("architecture", value)} minWidth="14rem" {...customField} />
      )}
      {hasScopeSettings && (
        <>
          <ChoiceCards legend="Escopo de componentes e hooks" options={scopeSeparationOptions} value={frontend.scopeSeparation} onChange={(value) => updateFrontend("scopeSeparation", value)} {...custom("frontend.scopeSeparation")} />
          <ChoiceCards legend="Estrutura das páginas" options={pageStructureOptions} value={frontend.pageStructure} onChange={(value) => updateFrontend("pageStructure", value)} {...custom("frontend.pageStructure")} />
          <Flex direction="column" gap="var(--enchase-space-sm)">
            <h3 className={styles.heading}>Divisão em arquivos</h3>
            <Grid minColumnWidth="16rem" gap="var(--enchase-space-sm)">
              <CheckCard label="Pastas tabs, sections e afins" description="Páginas grandes se dividem, quando precisam, em pastas como tabs e sections, uma por parte." isChecked={frontend.hasPageDivisions} onToggle={() => updateFrontend("hasPageDivisions", !frontend.hasPageDivisions)} />
              {splitFileOptions.map((option) => (
                <CheckCard key={option.value} label={option.label} description={option.description.replaceAll("`", "")} isChecked={frontend.splitFiles.includes(option.value)} onToggle={() => handleToggleSplit(option.value)} />
              ))}
            </Grid>
          </Flex>
        </>
      )}
      {!isCustom && (
        <div className={styles.details}>
          <div className={styles.column}>
            <h3 className={styles.heading}>Quando usar {selected.label}</h3>
            <p className={styles.text}>{selected.whenToUse}</p>
            <ul className={styles.rules}>
              {selected.rules.map((rule) => (
                <li key={rule}>{rule.replaceAll("`", "")}</li>
              ))}
            </ul>
          </div>
          <div className={styles.column}>
            <h3 className={styles.heading}>Estrutura de pastas</h3>
            <FileTree nodes={tree} label={`Estrutura de pastas da arquitetura ${selected.label}`} />
          </div>
        </div>
      )}
    </Flex>
  )
}

export default ArchitectureStep
