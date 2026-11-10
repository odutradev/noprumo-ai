import { Alert, Flex } from 'enchase'

import { architectureInfo, architectureOrder } from '@/data/generator/options'
import { buildTree, getArchitectureLayout } from '@/utils/generator/architecture'
import ChoiceCards from '@components/ChoiceCards'
import useGeneratorStore from '@stores/generator'
import FileTree from '@components/FileTree'

import type { Architecture, ChoiceOption } from '@/types/generator'

const ArchitectureStep = () => {
  const config = useGeneratorStore((state) => state.config)
  const update = useGeneratorStore((state) => state.update)
  const selected = architectureInfo[config.architecture]

  const options: ChoiceOption<Architecture>[] = architectureOrder.map((value) => ({
    value,
    label: architectureInfo[value].label,
    description: architectureInfo[value].summary,
    badge: architectureInfo[value].badge
  }))

  const renderTree = (option: ChoiceOption<Architecture>) => {
    const layout = getArchitectureLayout({ ...config, architecture: option.value, conventions: { ...config.conventions, testing: 'none' } })
    const srcNode = buildTree(layout.files).find((node) => node.name === 'src')
    return <FileTree nodes={srcNode?.children ?? []} label={`Estrutura de pastas da arquitetura ${option.label}`} maxHeight="15rem" />
  }

  return (
    <Flex direction="column" gap="1.5rem">
      <ChoiceCards
        legend="Arquitetura"
        description="Como o código é organizado em pastas e camadas. As árvores já usam a nomenclatura que você escolher."
        options={options}
        value={config.architecture}
        onChange={(value) => update('architecture', value)}
        minWidth="21rem"
        renderExtra={renderTree}
      />
      <Alert variant="info" title={`Quando usar ${selected.label}`}>
        <p>{selected.whenToUse}</p>
        <ul>
          {selected.rules.map((rule) => (
            <li key={rule}>{rule.replaceAll('`', '')}</li>
          ))}
        </ul>
      </Alert>
    </Flex>
  )
}

export default ArchitectureStep
