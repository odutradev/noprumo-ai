import { projectTypeOptions } from "@assets/data/generator/options"
import ChoiceCards from "@components/choiceCards"
import useGeneratorStore from "@stores/generator"

import type { EnabledProjectType } from "@utils/types/generator"

const ProjectStep = () => {
  const projectType = useGeneratorStore((state) => state.config.projectType)
  const setProjectType = useGeneratorStore((state) => state.setProjectType)

  return (
    <ChoiceCards
      legend="Que tipo de projeto a skill vai guiar?"
      description="Backend e frontend guardam escolhas separadas. Trocar de tipo não perde o que você já configurou."
      options={projectTypeOptions}
      value={projectType}
      onChange={(value) => setProjectType(value as EnabledProjectType)}
    />
  )
}

export default ProjectStep
