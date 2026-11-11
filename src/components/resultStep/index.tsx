import { Alert, Button, Flex, Input, SegmentedControl, Tabs, Textarea } from "enchase"
import { useMemo } from "react"

import { buildOutputFiles, getGlobalPath, getSkillFolder } from "@utils/functions/generator/outputFormat"
import { slugify } from "@utils/functions/generator/skillMarkdown"
import { validateSkillMetadata } from "@utils/validations/skill"
import { downloadText } from "@utils/functions/download"
import useGeneratorStore from "@stores/generator"
import StepHeader from "@components/stepHeader"
import useAnalytics from "@hooks/useAnalytics"
import CodeBlock from "@components/codeBlock"
import StarCard from "@components/starCard"
import useAction from "@hooks/useAction"
import styles from "./styles.module.css"

import type { IdentifierLanguage, OutputFile, OutputFormat } from "@utils/types/generator"

const formatHints: Record<OutputFormat, string> = {
  skill: "Carrega só quando o Claude acha que a descrição combina com a tarefa, ou quando você chama /nome. Bom para procedimentos sob demanda.",
  claudeMd: "Carrega em toda sessão do Claude Code. Bom para regras que valem sempre, como as deste guia."
}

const languageHints: Record<IdentifierLanguage, string> = {
  en: "Os modelos de IA seguem instruções em inglês com mais precisão. O guia já pede que o agente responda sempre em português.",
  pt: "O guia fica todo em português. Funciona, mas os modelos tendem a seguir instruções em inglês com mais precisão."
}

const ResultStep = () => {
  const config = useGeneratorStore((state) => state.config)
  const configs = useGeneratorStore((state) => state.configs)
  const update = useGeneratorStore((state) => state.update)
  const format = useGeneratorStore((state) => state.format)
  const setFormat = useGeneratorStore((state) => state.setFormat)
  const files = useMemo(() => buildOutputFiles(config, format, configs), [config, format, configs])
  const isSkill = format === "skill"
  const isFullstack = config.projectType === "fullstack"
  const isMultiple = files.length > 1
  const slug = slugify(config.skillName)
  const globalPath = getGlobalPath(config, format)
  const errors = isSkill ? validateSkillMetadata({ skillName: config.skillName, skillDescription: config.skillDescription }) : {}
  const hasErrors = Object.keys(errors).length > 0
  const mainName = isSkill ? "SKILL.md" : "CLAUDE.md"
  const { track } = useAnalytics()

  const guideEventData = { format, projectType: config.projectType, language: config.language, outputLanguage: config.outputLanguage }

  const handleDownload = (file: OutputFile) => {
    downloadText(file.fileName, file.content)
    track("guide-download", { ...guideEventData, files: 1 })
  }

  const handleDownloadAll = () => {
    files.forEach((file) => downloadText(file.fileName, file.content))
    track("guide-download", { ...guideEventData, files: files.length })
  }

  const handleCopy = useAction({
    action: () => navigator.clipboard.writeText(files[0].content),
    toastMessages: { pending: "Copiando...", success: `${mainName} copiado`, error: "Não foi possível copiar" },
    callback: () => track("guide-copy", guideEventData)
  })

  const installText = isFullstack
    ? isSkill
      ? `Salve os três arquivos em ${getSkillFolder(config)}/ na raiz do repositório. O SKILL.md aponta para backend.md e frontend.md na mesma pasta.`
      : "Salve cada arquivo no caminho indicado: o guia do monorepo na raiz e o de cada app dentro da pasta dele. O Claude Code carrega o CLAUDE.md da pasta em que está trabalhando."
    : ""

  return (
    <div className={styles.resultGrid}>
      <Flex direction="column" gap="var(--enchase-space-lg)">
        <StepHeader title={isSkill ? "Sua skill está pronta" : "Seu CLAUDE.md está pronto"} description="Escolha o formato, revise e instale no projeto." />

        <div className={styles.form}>
          <div className={styles.field}>
            <SegmentedControl
              label="Formato"
              items={[
                { value: "claudeMd", label: "CLAUDE.md" },
                { value: "skill", label: "Skill (SKILL.md)" }
              ]}
              value={format}
              onValueChange={(value: string) => setFormat(value as OutputFormat)}
            />
            <p className={styles.hint}>{formatHints[format]}</p>
          </div>
          <div className={styles.field}>
            <SegmentedControl
              label="Idioma do prompt"
              items={[
                { value: "en", label: "English (recomendado)" },
                { value: "pt", label: "Português" }
              ]}
              value={config.outputLanguage}
              onValueChange={(value: string) => update("outputLanguage", value as IdentifierLanguage)}
            />
            <p className={styles.hint}>{languageHints[config.outputLanguage]}</p>
          </div>
          {isSkill && (
            <>
              <Input label="Nome da skill" value={config.skillName} onChange={(event) => update("skillName", event.target.value)} helperText={`Identificador: ${slug}`} error={errors.skillName?.[0]} fullWidth />
              <Textarea
                label="Quando usar"
                value={config.skillDescription}
                onChange={(event) => update("skillDescription", event.target.value)}
                helperText="O Claude lê esta descrição para decidir quando ativar a skill. Escreva no mesmo idioma do prompt."
                error={errors.skillDescription?.[0]}
                rows={3}
                fullWidth
              />
            </>
          )}
        </div>

        <Flex gap="calc(var(--enchase-space-md) * 0.75)" wrap>
          <Button onClick={isMultiple ? handleDownloadAll : () => handleDownload(files[0])} disabled={hasErrors}>
            {isMultiple ? `Baixar os ${files.length} arquivos` : `Baixar ${mainName}`}
          </Button>
          <Button variant="outline" onClick={handleCopy} disabled={hasErrors}>
            {isMultiple ? `Copiar ${mainName}` : "Copiar conteúdo"}
          </Button>
        </Flex>

        {isMultiple && (
          <ul className={styles.fileList}>
            {files.map((file) => (
              <li key={file.path} className={styles.fileRow}>
                <code className={styles.inlineCode}>{file.path}</code>
                <Button variant="ghost" size="sm" onClick={() => handleDownload(file)} disabled={hasErrors}>
                  Baixar
                </Button>
              </li>
            ))}
          </ul>
        )}

        <Alert variant="success" title="Como instalar">
          {isFullstack ? (
            <p>{installText}</p>
          ) : (
            <p>
              Salve o arquivo em <code className={styles.inlineCode}>{files[0].path}</code> na raiz do projeto. Para valer em todos os seus projetos, use <code className={styles.inlineCode}>{globalPath}</code>.{" "}
              {isSkill ? "A skill aparece na próxima sessão do Claude Code." : "Se o projeto já tem um CLAUDE.md, junte o conteúdo ao arquivo existente."}
            </p>
          )}
        </Alert>

        <StarCard isCompact />
      </Flex>

      <div className={styles.preview}>
        {isMultiple ? (
          <Tabs
            ariaLabel="Arquivos gerados"
            items={files.map((file) => ({ value: file.path, label: file.path.split("/").slice(-2).join("/"), content: <CodeBlock code={file.content} title={file.path} isPlain isCopyable maxHeight="calc(100dvh - 12rem)" /> }))}
          />
        ) : (
          <CodeBlock code={files[0].content} title={files[0].path} isPlain isCopyable maxHeight="calc(100dvh - 9rem)" />
        )}
      </div>
    </div>
  )
}

export default ResultStep
