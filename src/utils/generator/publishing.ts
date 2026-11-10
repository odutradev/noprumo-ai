import { publishActionOptions, publishPromptOptions, publisherInvocationOptions } from '@/data/generator/publishOptions'

import type { PublishAction, PublishingConfig } from '@/types/generator'

import { sentence, type MdContext } from './mdContext'
import { code } from './markdownHelpers'

export interface PublishChoice {
  label: string
  description: string
  command?: string
}

const ordered = (actions: PublishAction[]) => publishActionOptions.filter((option) => actions.includes(option.value))

const flagsFor = (publishing: PublishingConfig, actions: PublishAction[], withExtra = true) => {
  const flags = ordered(actions).map((option) => option.flag)
  if (actions.includes('build') && publishing.buildScript && publishing.buildScript !== 'build') flags.push(`--script ${publishing.buildScript}`)
  if (actions.includes('push') && publishing.branch && publishing.branch !== 'master') flags.push(`--branch ${publishing.branch}`)
  if (withExtra && publishing.extraFlags.trim()) flags.push(publishing.extraFlags.trim())
  return flags.join(' ')
}

export const buildPublishCommand = (publishing: PublishingConfig, actions: PublishAction[] = publishing.actions, script = 'release', withExtra = true) => {
  const flags = flagsFor(publishing, actions, withExtra)
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

const identity = (text: string) => text

export const buildPublishChoices = (publishing: PublishingConfig, tr: (text: string) => string = identity, isEn = false): PublishChoice[] => {
  const full = ordered(publishing.actions).map((option) => option.value)
  const quick = gitOnly.filter((action) => full.includes(action))
  const showQuick = quick.length > 0 && (quick.length < full.length || Boolean(publishing.extraFlags.trim()))
  const describe = (actions: PublishAction[]) => ordered(actions).map((option) => tr(option.label).toLowerCase()).join(', ')
  return [
    { label: isEn ? 'Yes, publish' : 'Sim, publicar', description: describe(full), command: buildPublishCommand(publishing, full) },
    ...(showQuick ? [{ label: isEn ? 'Version and push only' : 'Só versão e push', description: describe(quick), command: buildPublishCommand(publishing, quick, 'release:version', false) }] : []),
    { label: isEn ? 'Not now' : 'Agora não', description: isEn ? 'Nothing is published.' : 'Nada é publicado.' }
  ]
}

const packageScripts = (publishing: PublishingConfig) => {
  const quick = gitOnly.filter((action) => publishing.actions.includes(action))
  const lines = [`    "release": "project-publisher ${flagsFor(publishing, publishing.actions)}"`]
  if (quick.length > 0 && quick.length < publishing.actions.length) lines.push(`    "release:version": "project-publisher ${flagsFor(publishing, quick, false)}"`)
  return `"scripts": {\n${lines.join(',\n')}\n}`
}

export const publishingSection = (ctx: MdContext) => {
  const { config, T, tr, field, isEn } = ctx
  const { publishing } = config
  if (!publishing.enabled || publishing.actions.length === 0) {
    return T(
      'Este projeto não usa publicação automatizada. Não suba versão, não faça build de release e não publique sem um pedido explícito.',
      'This project does not use automated publishing. Do not bump the version, build a release or publish without an explicit request.'
    )
  }

  const invocation = field('publishing.invocation', publisherInvocationOptions, publishing.invocation)
  const prompt = field('publishing.prompt', publishPromptOptions, publishing.prompt)
  const choices = buildPublishChoices(publishing, tr, isEn)
  const actionRows = ordered(publishing.actions).map((option) => `| \`${option.flag}\` | ${tr(option.label)} | ${tr(option.description)} |`)
  const extraRow = publishing.extraFlags.trim() ? `\n| \`${publishing.extraFlags.trim()}\` | ${T('Flags extras', 'Extra flags')} | ${T('Definidas à mão', 'Set by hand')} |` : ''
  const install = publishing.invocation === 'global' && !invocation.custom ? `\n\n${T('Instalação, uma vez por máquina', 'Install once per machine')}:\n\n${code('npm install -g project-publisher', 'bash')}` : ''
  const scripts = publishing.invocation === 'script' && !invocation.custom ? `\n\n${T('Scripts que devem existir no `package.json`', 'Scripts that must exist in `package.json`')}:\n\n${code(packageScripts(publishing), 'json')}` : ''
  const command = code(buildPublishCommand(publishing), 'bash')
  const branch = publishing.branch || 'master'

  const everyTask = [
    `### ${T('Pergunta obrigatória ao final de cada tarefa', 'Required question at the end of every task')}`,
    T(
      'Ao terminar **toda** tarefa que alterou arquivos, depois de commitar seguindo a seção de commits e com typecheck, lint e build passando, a última ação é perguntar se a pessoa quer publicar. Use a ferramenta de pergunta interativa (`AskUserQuestion`), que mostra uma caixa com botões:',
      'When you finish **every** task that changed files, after committing as described in the commits section and with typecheck, lint and build passing, your last action is to ask whether to publish. Use the interactive question tool (`AskUserQuestion`), which shows a box with buttons:'
    ),
    [
      `- **${T('Pergunta', 'Question')}:** "${T('Quer subir a versão e publicar?', 'Do you want to bump the version and publish?')}"`,
      `- **${T('Cabeçalho', 'Header')}:** "${T('Publicar', 'Publish')}"`,
      `- **${T('Opções', 'Options')}:**`,
      ...choices.map((choice) => `  - **${choice.label}**: ${choice.description}${choice.command ? ` → ${T('roda', 'runs')} \`${choice.command}\`` : ''}`)
    ].join('\n'),
    T('Se a ferramenta não existir no ambiente, faça a mesma pergunta em texto como última linha da resposta, listando as opções.', 'If the tool is not available, ask the same question in text as the last line of your reply, listing the options.'),
    [
      `- ${T('Só rode o comando da opção escolhida. Em "Agora não", não rode nada e não pergunte de novo na mesma tarefa.', 'Only run the command for the chosen option. On "Not now", run nothing and do not ask again in the same task.')}`,
      `- ${T('Não pergunte quando a tarefa não mudou arquivos (só perguntas, leituras ou explicações).', 'Do not ask when the task changed no files (questions, reads or explanations only).')}`,
      `- ${T('Não pergunte se o build, os testes ou o typecheck falharam: corrija primeiro ou avise que a publicação ficou bloqueada.', 'Do not ask if the build, tests or typecheck failed: fix them first or say that publishing is blocked.')}`
    ].join('\n')
  ].join('\n\n')

  const onRequest = [
    `### ${T('Quando publicar', 'When to publish')}`,
    T('Só publique quando pedirem para "publicar", "subir a versão" ou "fazer release". Nesse caso, rode:', 'Only publish when asked to "publish", "bump the version" or "release". Then run:'),
    command
  ].join('\n\n')

  const customPrompt = [`### ${T('Quando publicar', 'When to publish')}`, prompt.label, command].join('\n\n')
  const askBlock = prompt.custom ? customPrompt : publishing.prompt === 'everyTask' ? everyTask : onRequest

  const before = [
    `- ${T('Commite todo o trabalho da tarefa seguindo as regras de commit.', "Commit all of the task's work following the commit rules.")}${
      publishing.actions.includes('push')
        ? ` ${T('O `--push` roda `git add .` e cria o commit `chore: bump version to X`: qualquer mudança pendente iria junto nesse commit.', 'The `--push` flag runs `git add .` and creates the commit `chore: bump version to X`: any pending change would end up in that commit.')}`
        : ''
    }`,
    `- ${T('A árvore de trabalho precisa estar limpa, exceto pelo que o próprio publish altera.', 'The working tree must be clean, except for what publishing itself changes.')}`,
    `- ${publishing.actions.includes('push') ? T(`O push vai para a branch \`${branch}\`.`, `The push goes to the \`${branch}\` branch.`) : T('Esta configuração não faz push.', 'This setup does not push.')}`,
    `- ${T('O bump sobe só o patch. Para mudar minor ou major, edite a versão no `package.json` à mão antes de rodar.', 'The bump only raises the patch. To change minor or major, edit the version in `package.json` by hand before running.')}`
  ].join('\n')

  return [
    `${T('Este projeto publica com o', 'This project publishes with')} [project-publisher](https://www.npmjs.com/package/project-publisher). ${sentence(invocation.label, invocation.description)}${install}${scripts}`,
    `| Flag | ${T('Etapa', 'Step')} | ${T('O que faz', 'What it does')} |\n| :--- | :--- | :--- |\n${actionRows.join('\n')}${extraRow}`,
    `${T('As etapas rodam na ordem das flags. Comando padrão:', 'Steps run in flag order. Default command:')}\n\n${command}`,
    `**${T('Antes de publicar', 'Before publishing')}:**\n\n${before}`,
    askBlock
  ].join('\n\n')
}
