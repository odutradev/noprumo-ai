import { Flex } from "enchase"

import { projectTypeOptions } from "@assets/data/generator/options"
import ChoiceCards from "@components/choiceCards"
import useGeneratorStore from "@stores/generator"
import StepHeader from "@components/stepHeader"

import type { EnabledProjectType } from "@utils/types/generator"

const ProjectStep = () => {
  const projectType = useGeneratorStore((state) => state.config.projectType)
  const setProjectType = useGeneratorStore((state) => state.setProjectType)

  return (
    <Flex direction="column" gap="var(--enchase-space-lg)">
      <StepHeader title="Transforme os padrões do seu time em uma skill" description="Responda poucas etapas curtas e baixe um SKILL.md ou CLAUDE.md pronto para o Claude Code seguir no seu projeto. A prévia ao lado muda a cada escolha." />
      <ChoiceCards
        legend="Que tipo de projeto a skill vai guiar?"
        description="Backend, frontend e fullstack guardam escolhas separadas. O fullstack usa os padrões de Backend e Frontend para os guias de cada app."
        options={projectTypeOptions}
        value={projectType}
        onChange={(value) => setProjectType(value as EnabledProjectType)}
        minWidth="14rem"
      />
    </Flex>
  )
}

export default ProjectStep
