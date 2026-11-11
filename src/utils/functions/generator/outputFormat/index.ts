import { buildGuideMarkdown, frontmatter, slugify } from "@utils/functions/generator/skillMarkdown"

import type { GeneratorConfig, OutputFile, OutputFormat } from "@utils/types/generator"

export const getOutputFile = (format: OutputFormat, skillName: string): OutputFile => {
  if (format === "claudeMd") return { fileName: "CLAUDE.md", installPath: "CLAUDE.md", globalPath: "~/.claude/CLAUDE.md" }
  const installPath = `.claude/skills/${slugify(skillName)}/SKILL.md`
  return { fileName: "SKILL.md", installPath, globalPath: `~/${installPath}` }
}

export const buildOutputMarkdown = (config: GeneratorConfig, format: OutputFormat) => {
  const body = buildGuideMarkdown(config)
  if (format === "claudeMd") return body
  return `${frontmatter(config)}\n\n${body}`
}
