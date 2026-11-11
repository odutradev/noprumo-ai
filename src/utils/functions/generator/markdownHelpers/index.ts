import { aiAttributionOptions, branchNamingOptions, commitBodyOptions, commitFormatOptions, commitGranularityOptions, commitLanguageOptions, commitScopeOptions, commitTimingOptions } from "@assets/data/generator/commitOptions"
import { buildCommitExamples, renderCommitLog } from "@utils/functions/generator/commits"
import { buildSampleFiles } from "@utils/functions/generator/codeSample"
import { principleOptions } from "@assets/data/generator/options"
import { sentence } from "@utils/functions/generator/mdContext"

import type { ChoiceOption, EnabledProjectType, GeneratorConfig } from "@utils/types/generator"
import type { MdContext } from "@utils/types/markdown"

export const pick = <T extends string>(options: ChoiceOption<T>[], value: T) => options.find((option) => option.value === value) ?? options[0]

export const code = (content: string, language = "typescript") => `\`\`\`${language}\n${content}\n\`\`\``

export const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "skill"

export const selectedPrinciples = (config: GeneratorConfig) =>
  principleOptions.filter((principle) => principle.scope.includes(config.projectType as EnabledProjectType) && config.conventions.principles.includes(principle.value))

export const extraPrinciples = (config: GeneratorConfig) =>
  config.conventions.extraPrinciples
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

export const principlesSection = (ctx: MdContext) => {
  const { config, byLanguage, tr } = ctx
  const principles = selectedPrinciples(config)
  const extras = extraPrinciples(config)
  if (!principles.length && !extras.length) return byLanguage("Nenhum princípio adicional obrigatório.", "No additional required principles.")
  const listed = principles.map((principle) => {
    const examples = [`✅ ${byLanguage("Certo", "Do")}:\n${code(principle.good)}`, principle.bad ? `❌ ${byLanguage("Errado", "Don't")}:\n${code(principle.bad)}` : ""].filter(Boolean).join("\n\n")
    return `### ${tr(principle.label)}\n\n${tr(principle.description)}\n\n${examples}`
  })
  const extra = extras.length ? [`### ${byLanguage("Outros princípios", "Other principles")}\n\n${extras.map((line) => `- ${line}`).join("\n")}`] : []
  return [...listed, ...extra].join("\n\n")
}

export const gitSection = (ctx: MdContext) => {
  const { config, byLanguage, field } = ctx
  const { conventions } = config
  const format = field("conventions.commitFormat", commitFormatOptions, conventions.commitFormat)
  const language = field("conventions.commitLanguage", commitLanguageOptions, conventions.commitLanguage)
  const granularity = field("conventions.commitGranularity", commitGranularityOptions, conventions.commitGranularity)
  const scope = field("conventions.commitScope", commitScopeOptions, conventions.commitScope)
  const body = field("conventions.commitBody", commitBodyOptions, conventions.commitBody)
  const timing = field("conventions.commitTiming", commitTimingOptions, conventions.commitTiming)
  const attribution = field("conventions.aiAttribution", aiAttributionOptions, conventions.aiAttribution)
  const branch = field("conventions.branchNaming", branchNamingOptions, conventions.branchNaming)
  const isConventional = !format.isCustom && conventions.commitFormat === "conventional"

  const rules = [
    format.isCustom
      ? `- **${byLanguage("Formato", "Format")}:** ${format.label}`
      : isConventional
        ? byLanguage(
            `- **Formato:** Conventional Commits. \`<type>${conventions.commitScope === "scoped" ? "(<escopo>)" : ""}: <descrição curta>\`, com type entre \`feat\`, \`fix\`, \`docs\`, \`style\`, \`refactor\`, \`test\` e \`chore\`. Verbo no imperativo, sem ponto final.`,
            `- **Format:** Conventional Commits. \`<type>${conventions.commitScope === "scoped" ? "(<scope>)" : ""}: <short description>\`, with type one of \`feat\`, \`fix\`, \`docs\`, \`style\`, \`refactor\`, \`test\` and \`chore\`. Imperative verb, no trailing period.`
          )
        : byLanguage("- **Formato:** livre. Uma frase curta e clara do que mudou, começando com letra maiúscula.", "- **Format:** free. A short, clear sentence about what changed, starting with a capital letter."),
    `- **${byLanguage("Idioma", "Language")}:** ${language.isCustom ? language.label : language.description}`,
    `- **${byLanguage("Granularidade", "Granularity")}:** ${sentence(granularity.label, granularity.description)}`,
    isConventional || scope.isCustom ? `- **${byLanguage("Escopo", "Scope")}:** ${sentence(scope.label, scope.description)}` : "",
    `- **${byLanguage("Mensagem", "Message")}:** ${sentence(body.label, body.description)}`,
    `- **${byLanguage("Quando commitar", "When to commit")}:** ${sentence(timing.label, timing.description)}`,
    `- **${byLanguage("Coautoria de IA", "AI co-authorship")}:** ${sentence(attribution.label, attribution.description)}`,
    byLanguage("- Nunca commitar arquivos de ambiente (`.env`), segredos, builds ou `node_modules`.", "- Never commit environment files (`.env`), secrets, builds or `node_modules`."),
    branch.isCustom || conventions.branchNaming === "typeSlash" ? `- **Branches:** ${sentence(branch.label, branch.description)}` : byLanguage("- **Branches:** sem padrão obrigatório.", "- **Branches:** no required pattern.")
  ].filter(Boolean)

  const hasCustom = [format, language, granularity, scope, body, attribution].some((item) => item.isCustom)
  const example = hasCustom ? "" : `\n\n${byLanguage("Exemplo de histórico para uma feature", "Example history for a feature")}:\n\n${code(renderCommitLog(buildCommitExamples(config)), "text")}`
  const branchExample = !branch.isCustom && conventions.branchNaming === "typeSlash" ? `\n\n${code(pick(branchNamingOptions, "typeSlash").example ?? "", "text")}` : ""
  return `${rules.join("\n")}${example}${branchExample}`
}

export const rootGuidePointer = (ctx: MdContext) => ctx.byLanguage("Definido no guia do monorepo, na raiz do repositório. Siga as regras de lá.", "Defined in the monorepo guide at the repository root. Follow the rules there.")

export const publishChecklistItem = (ctx: MdContext) =>
  !ctx.isWorkspaceApp && ctx.config.publishing.isEnabled && ctx.config.publishing.prompt === "everyTask" ? ctx.byLanguage("Pergunta de publicação feita como última ação, se a tarefa alterou arquivos.", "Publish question asked as the last action, if the task changed files.") : ""

export const deployChecklistItem = (ctx: MdContext) =>
  !ctx.isWorkspaceApp && ctx.config.deploy.hasCompose ? ctx.byLanguage("Variável de ambiente nova entrou no `.env.example` e no `docker-compose.yml`.", "New environment variables were added to `.env.example` and `docker-compose.yml`.") : ""

export const hasCustomChoices = (config: GeneratorConfig) => Object.values(config.custom).some((text) => text.trim())

export const samplesSection = (ctx: MdContext) => {
  const { config, byLanguage } = ctx
  const note = hasCustomChoices(config)
    ? `\n\n> ${byLanguage(
        "Alguns padrões foram definidos à mão. Onde o exemplo divergir do texto das seções acima, siga o texto.",
        "Some standards were written by hand. Where the example differs from the sections above, follow the sections."
      )}`
    : ""
  const files = buildSampleFiles(config)
    .map((file) => `### \`${file.path}\`\n\n${code(file.code, file.path.endsWith(".css") || file.path.endsWith(".scss") ? "css" : file.path.endsWith(".tsx") ? "tsx" : "typescript")}`)
    .join("\n\n")
  return `${byLanguage("Use estes arquivos como modelo. Eles seguem todas as regras acima.", "Use these files as a template. They follow every rule above.")}${note}\n\n${files}`
}
