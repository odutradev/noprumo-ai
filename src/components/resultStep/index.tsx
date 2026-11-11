import { Alert, Button, Flex, Input, SegmentedControl, Textarea } from "enchase"
import { useMemo } from "react"

import { buildOutputMarkdown, getOutputFile } from "@utils/functions/generator/outputFormat"
import { slugify } from "@utils/functions/generator/skillMarkdown"
import { validateSkillMetadata } from "@utils/validations/skill"
import { downloadText } from "@utils/functions/download"
import useGeneratorStore from "@stores/generator"
import StepHeader from "@components/stepHeader"
import CodeBlock from "@components/codeBlock"
import useAction from "@hooks/useAction"
import styles from "./styles.module.css"

import type { IdentifierLanguage, OutputFormat } from "@utils/types/generator"

const formatHints: Record<OutputFormat, string> = {
  skill: "Carrega só quando o Claude acha que a descrição combina com a tarefa, ou quando você chama /nome. Bom para procedimentos sob demanda.",
  claudeMd: "Carrega em toda sessão do Claude Code. Bom para regras que valem sempre, como as deste guia."
}

const ResultStep = () => {
  const config = useGeneratorStore((state) => state.config)
  const update = useGeneratorStore((state) => state.update)
  const format = useGeneratorStore((state) => state.format)
  const setFormat = useGeneratorStore((state) => state.setFormat)
  const markdown = useMemo(() => buildOutputMarkdown(config, format), [config, format])
  const { fileName, installPath, globalPath } = getOutputFile(format, config.skillName)
  const isSkill = format === "skill"
  const slug = slugify(config.skillName)
  const errors = isSkill ? validateSkillMetadata({ skillName: config.skillName, skillDescription: config.skillDescription }) : {}
  const hasErrors = Object.keys(errors).length > 0

  const handleDownload = () => downloadText(fileName, markdown)

  const handleCopy = useAction({
    action: () => navigator.clipboard.writeText(markdown),
    toastMessages: { pending: "Copiando...", success: `${fileName} copiado`, error: "Não foi possível copiar" }
  })

  return (
    <div className={styles.resultGrid}>
      <Flex direction="column" gap="var(--enchase-space-lg)">
        <StepHeader title={isSkill ? "Sua skill está pronta" : "Seu CLAUDE.md está pronto"} description="Escolha o formato, revise e instale no projeto." />

        <div className={styles.form}>
          <div className={styles.field}>
            <SegmentedControl
              label="Formato"
              items={[
                { value: "skill", label: "Skill (SKILL.md)" },
                { value: "claudeMd", label: "CLAUDE.md" }
              ]}
              value={format}
              onValueChange={(value: string) => setFormat(value as OutputFormat)}
            />
            <p className={styles.hint}>{formatHints[format]}</p>
          </div>
          <SegmentedControl
            label="Idioma do prompt"
            items={[
              { value: "pt", label: "Português" },
              { value: "en", label: "English" }
            ]}
            value={config.outputLanguage}
            onValueChange={(value: string) => update("outputLanguage", value as IdentifierLanguage)}
          />
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
          <Button onClick={handleDownload} disabled={hasErrors}>
            Baixar {fileName}
          </Button>
          <Button variant="outline" onClick={handleCopy} disabled={hasErrors}>
            Copiar conteúdo
          </Button>
        </Flex>

        <Alert variant="success" title="Como instalar">
          <p>
            Salve o arquivo em <code className={styles.inlineCode}>{installPath}</code> na raiz do projeto. Para valer em todos os seus projetos, use <code className={styles.inlineCode}>{globalPath}</code>.{" "}
            {isSkill ? "A skill aparece na próxima sessão do Claude Code." : "Se o projeto já tem um CLAUDE.md, junte o conteúdo ao arquivo existente."}
          </p>
        </Alert>
      </Flex>

      <div className={styles.preview}>
        <CodeBlock code={markdown} title={installPath} isPlain isCopyable maxHeight="calc(100dvh - 9rem)" />
      </div>
    </div>
  )
}

export default ResultStep
