import { publishActionOptions, publishPromptOptions, publisherInvocationOptions } from '@/data/generator/publishOptions'

import type { GeneratorConfig, PublishAction, PublishingConfig } from '@/types/generator'

import { code, pick } from './markdownHelpers'

export interface PublishChoice {
  label: string
  description: string
  command?: string
}

const ordered = (actions: PublishAction[]) => publishActionOptions.filter((option) => actions.includes(option.value))

const flagsFor = (publishing: PublishingConfig, actions: PublishAction[]) => {
  const flags = ordered(actions).map((option) => option.flag)
  if (actions.includes('build') && publishing.buildScript && publishing.buildScript !== 'build') flags.push(`--script ${publishing.buildScript}`)
  if (actions.includes('push') && publishing.branch && publishing.branch !== 'master') flags.push(`--branch ${publishing.branch}`)
  return flags.join(' ')
}

export const buildPublishCommand = (publishing: PublishingConfig, actions: PublishAction[] = publishing.actions, script = 'release') => {
  const flags = flagsFor(publishing, actions)
  switch (publishing.invocation) {
    case 'npx':
      return `npx project-publisher ${flags}`
    case 'global':
      return `pub ${flags}`
    case 'script':
      return `npm run ${script}`
  }
}

const gitOnly: PublishAction[] = ['bumpPackage', 'push']

export const buildPublishChoices = (publishing: PublishingConfig): PublishChoice[] => {
  const full = ordered(publishing.actions).map((option) => option.value)
  const quick = gitOnly.filter((action) => full.includes(action))
  const showQuick = quick.length > 0 && quick.length < full.length
  return [
    { label: 'Sim, publicar', description: ordered(full).map((option) => option.label.toLowerCase()).join(', '), command: buildPublishCommand(publishing, full) },
    ...(showQuick ? [{ label: 'Só versão e push', description: ordered(quick).map((option) => option.label.toLowerCase()).join(' e '), command: buildPublishCommand(publishing, quick, 'release:version') }] : []),
    { label: 'Agora não', description: 'Nada é publicado.' }
  ]
}

const packageScripts = (publishing: PublishingConfig) => {
  const quick = gitOnly.filter((action) => publishing.actions.includes(action))
  const lines = [`    "release": "project-publisher ${flagsFor(publishing, publishing.actions)}"`]
  if (quick.length > 0 && quick.length < publishing.actions.length) lines.push(`    "release:version": "project-publisher ${flagsFor(publishing, quick)}"`)
  return `"scripts": {\n${lines.join(',\n')}\n}`
}

export const publishingSection = (config: GeneratorConfig) => {
  const { publishing } = config
  if (!publishing.enabled || publishing.actions.length === 0) return 'Este projeto não usa publicação automatizada. Não suba versão, não faça build de release e não publique sem um pedido explícito.'

  const invocation = pick(publisherInvocationOptions, publishing.invocation)
  const prompt = pick(publishPromptOptions, publishing.prompt)
  const choices = buildPublishChoices(publishing)
  const actionRows = ordered(publishing.actions).map((option) => `| \`${option.flag}\` | ${option.label} | ${option.description} |`)
  const install = publishing.invocation === 'global' ? `\n\nInstalação, uma vez por máquina:\n\n${code('npm install -g project-publisher', 'bash')}` : ''
  const scripts = publishing.invocation === 'script' ? `\n\nScripts que devem existir no \`package.json\`:\n\n${code(packageScripts(publishing), 'json')}` : ''

  const askBlock =
    publishing.prompt === 'everyTask'
      ? `### Pergunta obrigatória ao final de cada tarefa

Ao terminar **toda** tarefa que alterou arquivos, depois de commitar seguindo a seção de commits e com typecheck, lint e build passando, a última ação é perguntar se a pessoa quer publicar. Use a ferramenta de pergunta interativa (\`AskUserQuestion\`), que mostra uma caixa com botões:

- **Pergunta:** "Quer subir a versão e publicar?"
- **Cabeçalho:** "Publicar"
- **Opções:**
${choices.map((choice) => `  - **${choice.label}**: ${choice.description}${choice.command ? ` → roda \`${choice.command}\`` : ''}`).join('\n')}

Se a ferramenta não existir no ambiente, faça a mesma pergunta em texto como última linha da resposta, listando as opções.

- Só rode o comando da opção escolhida. Em "Agora não", não rode nada e não pergunte de novo na mesma tarefa.
- Não pergunte quando a tarefa não mudou arquivos (só perguntas, leituras ou explicações).
- Não pergunte se o build, os testes ou o typecheck falharam: corrija primeiro ou avise que a publicação ficou bloqueada.`
      : `### Quando publicar

${prompt.description} Quando pedirem para "publicar", "subir a versão" ou "fazer release", rode:

${code(buildPublishCommand(publishing), 'bash')}`

  return `Este projeto publica com o [project-publisher](https://www.npmjs.com/package/project-publisher). ${invocation.label}: ${invocation.description}${install}${scripts}

| Flag | Etapa | O que faz |
| :--- | :--- | :--- |
${actionRows.join('\n')}

As etapas rodam na ordem das flags. Comando padrão:

${code(buildPublishCommand(publishing), 'bash')}

**Antes de publicar:**

- Commite todo o trabalho da tarefa seguindo as regras de commit. ${publishing.actions.includes('push') ? 'O `--push` roda `git add .` e cria o commit `chore: bump version to X`: qualquer mudança pendente iria junto nesse commit.' : ''}
- A árvore de trabalho precisa estar limpa, exceto pelo que o próprio publish altera.
- ${publishing.actions.includes('push') ? `O push vai para a branch \`${publishing.branch || 'master'}\`.` : 'Esta configuração não faz push.'}
- O bump sobe só o patch. Para mudar minor ou major, edite a versão no \`package.json\` à mão antes de rodar.

${askBlock}`
}
