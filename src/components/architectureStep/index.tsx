import { useMemo } from "react"
import { Flex } from "enchase"

import { architectureInfo, architectureOrder } from "@assets/data/generator/options"
import { buildTree, getProjectFiles } from "@utils/functions/generator/architecture"
import useCustomField from "@hooks/useCustomField"
import ChoiceCards from "@components/choiceCards"
import useGeneratorStore from "@stores/generator"
import StepHeader from "@components/stepHeader"
import FileTree from "@components/fileTree"
import styles from "./styles.module.css"

import type { AppProjectType, Architecture, ChoiceOption } from "@utils/types/generator"

const ArchitectureStep = () => {
  const custom = useCustomField()
  const config = useGeneratorStore((state) => state.config)
  const update = useGeneratorStore((state) => state.update)
  const selected = architectureInfo[config.architecture]
  const customField = custom("architecture")
  const isCustom = customField.customText !== undefined

  const options: ChoiceOption<Architecture>[] = architectureOrder[config.projectType as AppProjectType].map((value) => ({
    value,
    label: architectureInfo[value].label,
    description: architectureInfo[value].summary.replaceAll("`", ""),
    badge: architectureInfo[value].badge
  }))

  const tree = useMemo(() => {
    const files = getProjectFiles({ ...config, conventions: { ...config.conventions, testing: "none" }, frontend: { ...config.frontend, e2e: "none" } })
    return buildTree(files).find((node) => node.name === "src")?.children ?? []
  }, [config])

  return (
    <Flex direction="column" gap="var(--enchase-space-lg)">
      <StepHeader title="Arquitetura" description="Como o código é organizado em pastas e camadas. A árvore já usa a nomenclatura que você escolher." />
      <ChoiceCards legend="Organização" options={options} value={config.architecture} onChange={(value) => update("architecture", value)} minWidth="14rem" {...customField} />
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
