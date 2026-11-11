import { buildFullstackMarkdown, getFolders, toWorkspaceApp, withApiLanguage } from "@utils/functions/generator/fullstack"
import { buildGuideMarkdown, frontmatter, slugify } from "@utils/functions/generator/skillMarkdown"

import type { GeneratorConfig, OutputFile, OutputFormat, WorkspaceApps } from "@utils/types/generator"

const fileOf = (path: string, content: string, downloadName = path.split("/").pop() ?? path): OutputFile => ({ path, fileName: downloadName, content })

export const getSkillFolder = (config: GeneratorConfig) => `.claude/skills/${slugify(config.skillName)}`

export const getGlobalPath = (config: GeneratorConfig, format: OutputFormat) => {
  if (config.projectType === "fullstack") return undefined
  return format === "skill" ? `~/${getSkillFolder(config)}/SKILL.md` : "~/.claude/CLAUDE.md"
}

export const buildOutputFiles = (config: GeneratorConfig, format: OutputFormat, apps: WorkspaceApps): OutputFile[] => {
  const isSkill = format === "skill"
  const withFrontmatter = (body: string) => (isSkill ? `${frontmatter(config)}\n\n${body}` : body)

  if (config.projectType !== "fullstack") return [fileOf(isSkill ? `${getSkillFolder(config)}/SKILL.md` : "CLAUDE.md", withFrontmatter(buildGuideMarkdown(config)))]

  const { api, web } = getFolders(config)
  const root = withFrontmatter(buildFullstackMarkdown(withApiLanguage(config, apps), format))
  const apiGuide = buildGuideMarkdown(toWorkspaceApp(apps.backend, config), true)
  const webGuide = buildGuideMarkdown(toWorkspaceApp(apps.frontend, config), true)

  if (isSkill) {
    const folder = getSkillFolder(config)
    return [fileOf(`${folder}/SKILL.md`, root), fileOf(`${folder}/backend.md`, apiGuide), fileOf(`${folder}/frontend.md`, webGuide)]
  }

  return [fileOf("CLAUDE.md", root), fileOf(`${api}/CLAUDE.md`, apiGuide, `${api}-CLAUDE.md`), fileOf(`${web}/CLAUDE.md`, webGuide, `${web}-CLAUDE.md`)]
}
