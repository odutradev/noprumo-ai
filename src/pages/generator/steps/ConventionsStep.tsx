import { Badge, Card, Flex } from 'enchase'
import { CheckIcon } from 'enchase/icons'

import {
  apiDocsOptions,
  commentsOptions,
  errorHandlingOptions,
  exportOptions,
  functionStyleOptions,
  importAliasOptions,
  importOrderOptions,
  paradigmOptions,
  principleOptions,
  quoteOptions,
  routeStyleOptions,
  semicolonOptions,
  testLocationOptions,
  testSuffixOptions,
  testingOptions,
  validationOptions
} from '@/data/generator/options'
import { apiLayerOptions, asyncActionsOptions, componentDeclarationOptions, componentStructureOptions, e2eOptions } from '@/data/generator/frontendOptions'
import ChoiceCards from '@components/ChoiceCards'
import useGeneratorStore from '@stores/generator'
import CodeBlock from '@components/CodeBlock'

import type { EnabledProjectType } from '@/types/generator'

import styles from './styles.module.css'

const languageChoices = [
  { value: 'en' as const, label: 'Inglês', description: 'Escritos em inglês.' },
  { value: 'pt' as const, label: 'Português', description: 'Escritos em português.' }
]

const ConventionsStep = () => {
  const config = useGeneratorStore((state) => state.config)
  const set = useGeneratorStore((state) => state.updateConventions)
  const setFrontend = useGeneratorStore((state) => state.updateFrontend)
  const togglePrinciple = useGeneratorStore((state) => state.togglePrinciple)
  const { conventions, frontend } = config
  const isFrontend = config.projectType === 'frontend'
  const principles = principleOptions.filter((principle) => principle.scope.includes(config.projectType as EnabledProjectType))
  const activeCount = principles.filter((principle) => conventions.principles.includes(principle.value)).length

  return (
    <Flex direction="column" gap="1.5rem">
      <div>
        <h2 className={styles.title}>Convenções de código</h2>
        <p className={styles.subtitle}>Como o código é escrito no dia a dia. Cada escolha muda o exemplo ao lado.</p>
      </div>

      {isFrontend ? (
        <>
          <Card variant="outlined" header="Componentes">
            <Flex direction="column" gap="2rem">
              <ChoiceCards legend="Declaração" options={componentDeclarationOptions} value={frontend.componentDeclaration} onChange={(value) => setFrontend('componentDeclaration', value)} minWidth="17rem" />
              <ChoiceCards legend="Estrutura de arquivos" options={componentStructureOptions} value={frontend.componentStructure} onChange={(value) => setFrontend('componentStructure', value)} minWidth="17rem" />
              <ChoiceCards legend="Exports" options={exportOptions} value={conventions.exports} onChange={(value) => set('exports', value)} />
            </Flex>
          </Card>

          <Card variant="outlined" header="Dados e ações">
            <Flex direction="column" gap="2rem">
              <ChoiceCards legend="Camada de API" options={apiLayerOptions} value={frontend.apiLayer} onChange={(value) => setFrontend('apiLayer', value)} />
              <ChoiceCards legend="Ações assíncronas" options={asyncActionsOptions} value={frontend.asyncActions} onChange={(value) => setFrontend('asyncActions', value)} minWidth="19rem" />
            </Flex>
          </Card>
        </>
      ) : (
        <>
          <Card variant="outlined" header="Estrutura">
            <Flex direction="column" gap="2rem">
              <ChoiceCards legend="Paradigma" options={paradigmOptions} value={conventions.paradigm} onChange={(value) => set('paradigm', value)} />
              <ChoiceCards legend="Declaração de funções" options={functionStyleOptions} value={conventions.functionStyle} onChange={(value) => set('functionStyle', value)} />
              <ChoiceCards legend="Exports" options={exportOptions} value={conventions.exports} onChange={(value) => set('exports', value)} />
            </Flex>
          </Card>

          <Card variant="outlined" header="Erros e validação">
            <Flex direction="column" gap="2rem">
              <ChoiceCards legend="Tratamento de erros" options={errorHandlingOptions} value={conventions.errorHandling} onChange={(value) => set('errorHandling', value)} minWidth="18rem" />
              <ChoiceCards legend="Validação de entrada" options={validationOptions} value={conventions.validation} onChange={(value) => set('validation', value)} />
            </Flex>
          </Card>

          <Card variant="outlined" header="API">
            <Flex direction="column" gap="2rem">
              <ChoiceCards legend="Rotas" options={routeStyleOptions} value={conventions.routeStyle} onChange={(value) => set('routeStyle', value)} minWidth="18rem" />
              <ChoiceCards legend="Documentação" options={apiDocsOptions} value={conventions.apiDocs} onChange={(value) => set('apiDocs', value)} minWidth="18rem" />
            </Flex>
          </Card>
        </>
      )}

      <Card variant="outlined" header="Imports">
        <Flex direction="column" gap="2rem">
          <ChoiceCards legend="Caminhos" options={importAliasOptions} value={conventions.importAlias} onChange={(value) => set('importAlias', value)} minWidth="18rem" />
          <ChoiceCards legend="Organização" options={importOrderOptions} value={conventions.importOrder} onChange={(value) => set('importOrder', value)} minWidth="20rem" />
        </Flex>
      </Card>

      <Card variant="outlined" header="Testes">
        <Flex direction="column" gap="2rem">
          <ChoiceCards legend={isFrontend ? 'Testes unitários' : 'Framework'} options={testingOptions} value={conventions.testing} onChange={(value) => set('testing', value)} />
          {conventions.testing !== 'none' && (
            <>
              {!isFrontend && <ChoiceCards legend="Localização" options={testLocationOptions} value={conventions.testLocation} onChange={(value) => set('testLocation', value)} />}
              <ChoiceCards legend="Sufixo" options={testSuffixOptions} value={conventions.testSuffix} onChange={(value) => set('testSuffix', value)} />
            </>
          )}
          {isFrontend && <ChoiceCards legend="Testes E2E" options={e2eOptions} value={frontend.e2e} onChange={(value) => setFrontend('e2e', value)} minWidth="18rem" />}
        </Flex>
      </Card>

      <Card variant="outlined" header="Formatação e comentários">
        <Flex direction="column" gap="2rem">
          <ChoiceCards legend="Ponto e vírgula" options={semicolonOptions} value={conventions.semicolons} onChange={(value) => set('semicolons', value)} />
          <ChoiceCards legend="Aspas" options={quoteOptions} value={conventions.quotes} onChange={(value) => set('quotes', value)} />
          <ChoiceCards legend="Comentários" options={commentsOptions} value={conventions.comments} onChange={(value) => set('comments', value)} />
          {conventions.comments !== 'none' && <ChoiceCards legend="Idioma dos comentários" options={languageChoices} value={conventions.commentsLanguage} onChange={(value) => set('commentsLanguage', value)} />}
        </Flex>
      </Card>

      <Card variant="outlined" header="Princípios obrigatórios" headerExtra={<Badge variant="primary">{`${activeCount} de ${principles.length}`}</Badge>}>
        <div className={styles.principles}>
          {principles.map((principle) => {
            const checked = conventions.principles.includes(principle.value)
            return (
              <label key={principle.value} className={styles.principle} data-checked={checked || undefined}>
                <input className={styles.hiddenInput} type="checkbox" checked={checked} onChange={() => togglePrinciple(principle.value)} />
                <span className={styles.principleHead}>
                  <span className={styles.box} aria-hidden="true">
                    {checked && <CheckIcon size={14} />}
                  </span>
                  <span className={styles.principleLabel}>{principle.label}</span>
                </span>
                <span className={styles.principleText}>{principle.description}</span>
                <span className={styles.examples}>
                  <span className={styles.exampleTag} data-kind="good">
                    Certo
                  </span>
                  <CodeBlock code={principle.good} compact />
                  {principle.bad && (
                    <>
                      <span className={styles.exampleTag} data-kind="bad">
                        Errado
                      </span>
                      <CodeBlock code={principle.bad} compact />
                    </>
                  )}
                </span>
              </label>
            )
          })}
        </div>
      </Card>
    </Flex>
  )
}

export default ConventionsStep
