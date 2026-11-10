import { useMemo } from 'react'
import { Card, Flex } from 'enchase'

import {
  aiAttributionOptions,
  branchNamingOptions,
  commitBodyOptions,
  commitFormatOptions,
  commitGranularityOptions,
  commitLanguageOptions,
  commitScopeOptions,
  commitTimingOptions
} from '@/data/generator/commitOptions'
import { buildCommitExamples, renderCommitLog } from '@/utils/generator/commits'
import ChoiceCards from '@components/ChoiceCards'
import useGeneratorStore from '@stores/generator'
import CodeBlock from '@components/CodeBlock'

import styles from './styles.module.css'

const CommitsStep = () => {
  const config = useGeneratorStore((state) => state.config)
  const set = useGeneratorStore((state) => state.updateConventions)
  const { conventions } = config
  const log = useMemo(() => renderCommitLog(buildCommitExamples(config)), [config])
  const count = buildCommitExamples(config).length

  return (
    <Flex direction="column" gap="1.5rem">
      <div>
        <h2 className={styles.title}>Commits</h2>
        <p className={styles.subtitle}>Como o Claude vai registrar o trabalho no git. O histórico abaixo muda a cada escolha.</p>
      </div>

      <CodeBlock code={log} title={`git log · ${count} ${count === 1 ? 'commit' : 'commits'} para uma feature`} plain />

      <Card variant="outlined" header="Quantos commits">
        <Flex direction="column" gap="2rem">
          <ChoiceCards legend="Granularidade" description="Como o trabalho de uma tarefa é dividido em commits." options={commitGranularityOptions} value={conventions.commitGranularity} onChange={(value) => set('commitGranularity', value)} minWidth="16rem" />
          <ChoiceCards legend="Quando commitar" options={commitTimingOptions} value={conventions.commitTiming} onChange={(value) => set('commitTiming', value)} minWidth="18rem" />
        </Flex>
      </Card>

      <Card variant="outlined" header="Mensagem">
        <Flex direction="column" gap="2rem">
          <ChoiceCards legend="Formato" options={commitFormatOptions} value={conventions.commitFormat} onChange={(value) => set('commitFormat', value)} minWidth="18rem" />
          <ChoiceCards legend="Idioma" options={commitLanguageOptions} value={conventions.commitLanguage} onChange={(value) => set('commitLanguage', value)} minWidth="18rem" />
          {conventions.commitFormat === 'conventional' && <ChoiceCards legend="Escopo" options={commitScopeOptions} value={conventions.commitScope} onChange={(value) => set('commitScope', value)} minWidth="18rem" />}
          <ChoiceCards legend="Corpo" options={commitBodyOptions} value={conventions.commitBody} onChange={(value) => set('commitBody', value)} minWidth="18rem" />
          <ChoiceCards legend="Coautoria de IA" options={aiAttributionOptions} value={conventions.aiAttribution} onChange={(value) => set('aiAttribution', value)} minWidth="18rem" />
        </Flex>
      </Card>

      <Card variant="outlined" header="Branches">
        <ChoiceCards legend="Nome das branches" options={branchNamingOptions} value={conventions.branchNaming} onChange={(value) => set('branchNaming', value)} minWidth="18rem" />
      </Card>
    </Flex>
  )
}

export default CommitsStep
