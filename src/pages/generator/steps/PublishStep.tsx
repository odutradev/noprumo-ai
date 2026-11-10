import { Alert, Card, Flex, Input, Switch } from 'enchase'
import { CheckIcon } from 'enchase/icons'

import { publishActionOptions, publishPromptOptions, publisherInvocationOptions } from '@/data/generator/publishOptions'
import { buildPublishChoices, buildPublishCommand } from '@/utils/generator/publishing'
import ChoiceCards from '@components/ChoiceCards'
import useGeneratorStore from '@stores/generator'
import useCustomField from '@/hooks/useCustomField'
import CodeBlock from '@components/CodeBlock'

import styles from './styles.module.css'

const PublishStep = () => {
  const custom = useCustomField()
  const publishing = useGeneratorStore((state) => state.config.publishing)
  const set = useGeneratorStore((state) => state.updatePublishing)
  const toggleAction = useGeneratorStore((state) => state.togglePublishAction)
  const choices = buildPublishChoices(publishing)
  const hasActions = publishing.actions.length > 0

  return (
    <Flex direction="column" gap="1.5rem">
      <div>
        <h2 className={styles.title}>Publicação</h2>
        <p className={styles.subtitle}>Use o project-publisher para subir a versão, buildar, empacotar e publicar no git ou no npm.</p>
      </div>

      <Card variant="outlined">
        <Switch
          label="Usar o project-publisher neste projeto"
          checked={publishing.enabled}
          onChange={(event) => set('enabled', event.target.checked)}
          helperText="Desligado, a skill proíbe subir versão ou publicar sem pedido."
        />
      </Card>

      {publishing.enabled && (
        <>
          {publishing.prompt === 'everyTask' && hasActions && (
            <div className={styles.askPreview} aria-label="Prévia da pergunta que o Claude vai fazer">
              <span className={styles.askEyebrow}>O Claude vai terminar cada tarefa assim</span>
              <p className={styles.askRecap}>Tarefa concluída e commitada. Typecheck e build passando.</p>
              <p className={styles.askQuestion}>Quer subir a versão e publicar?</p>
              <div className={styles.askButtons}>
                {choices.map((choice, index) => (
                  <span key={choice.label} className={styles.askButton} data-primary={index === 0 || undefined} title={choice.command}>
                    {choice.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          <Card variant="outlined" header="Quando perguntar">
            <ChoiceCards legend="Momento" options={publishPromptOptions} value={publishing.prompt} onChange={(value) => set('prompt', value)} {...custom('publishing.prompt')} minWidth="18rem" />
          </Card>

          <Card variant="outlined" header="Etapas da publicação">
            <div className={styles.principles}>
              {publishActionOptions.map((action) => {
                const checked = publishing.actions.includes(action.value)
                return (
                  <label key={action.value} className={styles.principle} data-checked={checked || undefined}>
                    <input className={styles.hiddenInput} type="checkbox" checked={checked} onChange={() => toggleAction(action.value)} />
                    <span className={styles.principleHead}>
                      <span className={styles.box} aria-hidden="true">
                        {checked && <CheckIcon size={14} />}
                      </span>
                      <span className={styles.principleLabel}>{action.label}</span>
                      <code className={styles.flag}>{action.flag}</code>
                    </span>
                    <span className={styles.principleText}>{action.description}</span>
                  </label>
                )
              })}
            </div>
          </Card>

          <Card variant="outlined" header="Execução">
            <Flex direction="column" gap="1.5rem">
              <ChoiceCards legend="Como rodar" options={publisherInvocationOptions} value={publishing.invocation} onChange={(value) => set('invocation', value)} {...custom('publishing.invocation')} />
              <Flex gap="1rem" wrap>
                <Input label="Branch do push" value={publishing.branch} onChange={(event) => set('branch', event.target.value)} helperText="Padrão do project-publisher: master" />
                <Input label="Script de build" value={publishing.buildScript} onChange={(event) => set('buildScript', event.target.value)} helperText="Script do package.json usado pelo --build" />
                <Input label="Outras flags" value={publishing.extraFlags} onChange={(event) => set('extraFlags', event.target.value)} helperText="Adicionadas ao fim do comando, como --bump-manifest" />
              </Flex>
            </Flex>
          </Card>

          {hasActions ? (
            <CodeBlock code={buildPublishCommand(publishing)} title="Comando gerado" copyable />
          ) : (
            <Alert variant="warning" title="Nenhuma etapa marcada">
              Marque ao menos uma etapa para gerar o comando de publicação.
            </Alert>
          )}

          {publishing.actions.includes('push') && (
            <Alert variant="info" title="O --push commita tudo o que estiver pendente">
              O project-publisher roda git add . e cria o commit chore: bump version to X. A skill manda o Claude commitar o trabalho da tarefa antes, seguindo as regras de commit.
            </Alert>
          )}
        </>
      )}
    </Flex>
  )
}

export default PublishStep
