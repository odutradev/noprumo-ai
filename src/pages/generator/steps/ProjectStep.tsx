import ChoiceCards from '@components/ChoiceCards'
import { projectTypeOptions } from '@/data/generator/options'
import useGeneratorStore from '@stores/generator'

const ProjectStep = () => {
  const projectType = useGeneratorStore((state) => state.config.projectType)
  const update = useGeneratorStore((state) => state.update)

  return (
    <ChoiceCards
      legend="Que tipo de projeto a skill vai guiar?"
      description="A skill vai trazer regras específicas para esse tipo de projeto."
      options={projectTypeOptions}
      value={projectType}
      onChange={(value) => update('projectType', value)}
    />
  )
}

export default ProjectStep
