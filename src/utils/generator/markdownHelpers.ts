import { aiAttributionOptions, branchNamingOptions, commitBodyOptions, commitGranularityOptions, commitScopeOptions, commitTimingOptions } from '@/data/generator/commitOptions'
import { principleOptions } from '@/data/generator/options'

import type { ChoiceOption, EnabledProjectType, GeneratorConfig } from '@/types/generator'

import { buildCommitExamples, renderCommitLog } from './commits'
import { buildSampleFiles } from './codeSample'

export const pick = <T extends string>(options: ChoiceOption<T>[], value: T) => options.find((option) => option.value === value) ?? options[0]

export const code = (content: string, language = 'typescript') => `\`\`\`${language}\n${content}\n\`\`\``

export const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'skill'

export const selectedPrinciples = (config: GeneratorConfig) =>
  principleOptions.filter((principle) => principle.scope.includes(config.projectType as EnabledProjectType) && config.conventions.principles.includes(principle.value))

export const principlesSection = (config: GeneratorConfig) => {
  const principles = selectedPrinciples(config)
  if (!principles.length) return 'Nenhum princípio adicional obrigatório.'
  return principles
    .map((principle) => {
      const examples = [`✅ Certo:\n${code(principle.good)}`, principle.bad ? `❌ Errado:\n${code(principle.bad)}` : ''].filter(Boolean).join('\n\n')
      return `### ${principle.label}\n\n${principle.description}\n\n${examples}`
    })
    .join('\n\n')
}

export const gitSection = (config: GeneratorConfig) => {
  const { commitFormat, commitLanguage, branchNaming, commitGranularity, commitScope, commitBody, commitTiming, aiAttribution } = config.conventions
  const language = commitLanguage === 'pt' ? 'português' : 'inglês'
  const granularity = pick(commitGranularityOptions, commitGranularity)
  const scope = pick(commitScopeOptions, commitScope)
  const body = pick(commitBodyOptions, commitBody)
  const timing = pick(commitTimingOptions, commitTiming)
  const attribution = pick(aiAttributionOptions, aiAttribution)
  const branch = pick(branchNamingOptions, branchNaming)

  const rules = [
    commitFormat === 'conventional'
      ? `- **Formato:** Conventional Commits. \`<type>${commitScope === 'scoped' ? '(<escopo>)' : ''}: <descrição curta>\`, com type entre \`feat\`, \`fix\`, \`docs\`, \`style\`, \`refactor\`, \`test\` e \`chore\`. Verbo no imperativo, sem ponto final.`
      : '- **Formato:** livre. Uma frase curta e clara do que mudou, começando com letra maiúscula.',
    `- **Idioma:** mensagens em ${language}.`,
    `- **Granularidade:** ${granularity.label}. ${granularity.description}`,
    commitFormat === 'conventional' ? `- **Escopo:** ${scope.label}. ${scope.description}` : '',
    `- **Mensagem:** ${body.label}. ${body.description}`,
    `- **Quando commitar:** ${timing.label}. ${timing.description}`,
    `- **Coautoria de IA:** ${attribution.label}. ${attribution.description}`,
    '- Nunca commitar arquivos de ambiente (`.env`), segredos, builds ou `node_modules`.',
    branchNaming === 'typeSlash' ? `- **Branches:** ${branch.label}. ${branch.description}` : '- **Branches:** sem padrão obrigatório.'
  ].filter(Boolean)

  const branchExample = branchNaming === 'typeSlash' ? `\n\n${code(branch.example ?? '', 'text')}` : ''
  return `${rules.join('\n')}\n\nExemplo de histórico para uma feature:\n\n${code(renderCommitLog(buildCommitExamples(config)), 'text')}${branchExample}`
}

export const samplesSection = (config: GeneratorConfig) =>
  buildSampleFiles(config)
    .map((file) => `### \`${file.path}\`\n\n${code(file.code, file.path.endsWith('.css') || file.path.endsWith('.scss') ? 'css' : file.path.endsWith('.tsx') ? 'tsx' : 'typescript')}`)
    .join('\n\n')
