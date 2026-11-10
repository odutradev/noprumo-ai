import ChoiceCards from '@components/ChoiceCards'
import { projectTypeOptions } from '@/data/generator/options'
import useGeneratorStore from '@stores/generator'

import type { EnabledProjectType } from '@/types/generator'

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
