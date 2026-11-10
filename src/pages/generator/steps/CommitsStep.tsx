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
import useCustomField from '@/hooks/useCustomField'
import CodeBlock from '@components/CodeBlock'

import styles from './styles.module.css'

const CommitsStep = () => {
  const custom = useCustomField()
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
          <ChoiceCards
            legend="Granularidade"
            description="Como o trabalho de uma tarefa é dividido em commits."
            options={commitGranularityOptions}
            value={conventions.commitGranularity}
            onChange={(value) => set('commitGranularity', value)}
            {...custom('conventions.commitGranularity')}
            minWidth="16rem"
          />
          <ChoiceCards
            legend="Quando commitar"
            options={commitTimingOptions}
            value={conventions.commitTiming}
            onChange={(value) => set('commitTiming', value)}
            {...custom('conventions.commitTiming')}
            minWidth="18rem"
          />
        </Flex>
      </Card>

      <Card variant="outlined" header="Mensagem">
        <Flex direction="column" gap="2rem">
          <ChoiceCards
            legend="Formato"
            options={commitFormatOptions}
            value={conventions.commitFormat}
            onChange={(value) => set('commitFormat', value)}
            {...custom('conventions.commitFormat')}
            minWidth="18rem"
          />
          <ChoiceCards
            legend="Idioma"
            options={commitLanguageOptions}
            value={conventions.commitLanguage}
            onChange={(value) => set('commitLanguage', value)}
            {...custom('conventions.commitLanguage')}
            minWidth="18rem"
          />
          {conventions.commitFormat === 'conventional' && (
            <ChoiceCards
              legend="Escopo"
              options={commitScopeOptions}
              value={conventions.commitScope}
              onChange={(value) => set('commitScope', value)}
              {...custom('conventions.commitScope')}
              minWidth="18rem"
            />
          )}
          <ChoiceCards
            legend="Corpo"
            options={commitBodyOptions}
            value={conventions.commitBody}
            onChange={(value) => set('commitBody', value)}
            {...custom('conventions.commitBody')}
            minWidth="18rem"
          />
          <ChoiceCards
            legend="Coautoria de IA"
            options={aiAttributionOptions}
            value={conventions.aiAttribution}
            onChange={(value) => set('aiAttribution', value)}
            {...custom('conventions.aiAttribution')}
            minWidth="18rem"
          />
        </Flex>
      </Card>

      <Card variant="outlined" header="Branches">
        <ChoiceCards
          legend="Nome das branches"
          options={branchNamingOptions}
          value={conventions.branchNaming}
          onChange={(value) => set('branchNaming', value)}
          {...custom('conventions.branchNaming')}
          minWidth="18rem"
        />
      </Card>
    </Flex>
  )
}

export default CommitsStep
