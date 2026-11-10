import { Flex } from 'enchase'

import { databaseOptions, frameworkOptions, languageOptions } from '@/data/generator/options'
import ChoiceCards from '@components/ChoiceCards'
import useGeneratorStore from '@stores/generator'

const LanguageStep = () => {
  const config = useGeneratorStore((state) => state.config)
  const update = useGeneratorStore((state) => state.update)

  return (
    <Flex direction="column" gap="2.5rem">
      <ChoiceCards legend="Linguagem" description="A linguagem principal do código." options={languageOptions} value={config.language} onChange={(value) => update('language', value)} />
      <ChoiceCards legend="Framework HTTP" description="Define como os endpoints são declarados." options={frameworkOptions} value={config.framework} onChange={(value) => update('framework', value)} />
      <ChoiceCards legend="Banco de dados" description="Define como os repositórios acessam os dados." options={databaseOptions} value={config.database} onChange={(value) => update('database', value)} />
    </Flex>
  )
}

export default LanguageStep
