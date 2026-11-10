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
import ChoiceCards from '@components/ChoiceCards'
import useGeneratorStore from '@stores/generator'
import CodeBlock from '@components/CodeBlock'

import styles from './styles.module.css'

const ConventionsStep = () => {
  const conventions = useGeneratorStore((state) => state.config.conventions)
  const set = useGeneratorStore((state) => state.updateConventions)
  const togglePrinciple = useGeneratorStore((state) => state.togglePrinciple)

  return (
    <Flex direction="column" gap="1.5rem">
      <div>
        <h2 className={styles.title}>Convenções de código</h2>
        <p className={styles.subtitle}>Como o código é escrito no dia a dia. Cada escolha muda o exemplo ao lado.</p>
      </div>

      <Card variant="outlined" header="Estrutura">
        <Flex direction="column" gap="2rem">
          <ChoiceCards legend="Paradigma" options={paradigmOptions} value={conventions.paradigm} onChange={(value) => set('paradigm', value)} />
          <ChoiceCards legend="Declaração de funções" options={functionStyleOptions} value={conventions.functionStyle} onChange={(value) => set('functionStyle', value)} />
          <ChoiceCards legend="Exports" options={exportOptions} value={conventions.exports} onChange={(value) => set('exports', value)} />
        </Flex>
      </Card>

      <Card variant="outlined" header="Imports">
        <Flex direction="column" gap="2rem">
          <ChoiceCards legend="Caminhos" options={importAliasOptions} value={conventions.importAlias} onChange={(value) => set('importAlias', value)} minWidth="18rem" />
          <ChoiceCards legend="Organização" options={importOrderOptions} value={conventions.importOrder} onChange={(value) => set('importOrder', value)} minWidth="20rem" />
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

      <Card variant="outlined" header="Testes">
        <Flex direction="column" gap="2rem">
          <ChoiceCards legend="Framework" options={testingOptions} value={conventions.testing} onChange={(value) => set('testing', value)} />
          {conventions.testing !== 'none' && (
            <>
              <ChoiceCards legend="Localização" options={testLocationOptions} value={conventions.testLocation} onChange={(value) => set('testLocation', value)} />
              <ChoiceCards legend="Sufixo" options={testSuffixOptions} value={conventions.testSuffix} onChange={(value) => set('testSuffix', value)} />
            </>
          )}
        </Flex>
      </Card>

      <Card variant="outlined" header="Formatação e comentários">
        <Flex direction="column" gap="2rem">
          <ChoiceCards legend="Ponto e vírgula" options={semicolonOptions} value={conventions.semicolons} onChange={(value) => set('semicolons', value)} />
          <ChoiceCards legend="Aspas" options={quoteOptions} value={conventions.quotes} onChange={(value) => set('quotes', value)} />
          <ChoiceCards legend="Comentários" options={commentsOptions} value={conventions.comments} onChange={(value) => set('comments', value)} />
          {conventions.comments !== 'none' && (
            <ChoiceCards
              legend="Idioma dos comentários"
              options={[
                { value: 'pt', label: 'Português', description: 'Comentários escritos em português.' },
                { value: 'en', label: 'Inglês', description: 'Comentários escritos em inglês.' }
              ]}
              value={conventions.commentsLanguage}
              onChange={(value) => set('commentsLanguage', value)}
            />
          )}
        </Flex>
      </Card>

      <Card variant="outlined" header="Princípios obrigatórios" headerExtra={<Badge variant="primary">{conventions.principles.length} de {principleOptions.length}</Badge>}>
        <div className={styles.principles}>
          {principleOptions.map((principle) => {
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
