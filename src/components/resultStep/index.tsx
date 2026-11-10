import { Alert, Button, Card, Flex, Input, SegmentedControl, Textarea } from "enchase"
import { useMemo } from "react"

import { buildSkillMarkdown, slugify } from "@utils/functions/generator/skillMarkdown"
import { validateSkillMetadata } from "@utils/validations/skill"
import { downloadText } from "@utils/functions/download"
import useGeneratorStore from "@stores/generator"
import StepHeader from "@components/stepHeader"
import CodeBlock from "@components/codeBlock"
import useAction from "@hooks/useAction"
import styles from "./styles"

import type { IdentifierLanguage } from "@utils/types/generator"

const ResultStep = () => {
  const config = useGeneratorStore((state) => state.config)
  const update = useGeneratorStore((state) => state.update)
  const markdown = useMemo(() => buildSkillMarkdown(config), [config])
  const slug = slugify(config.skillName)
  const installPath = `.claude/skills/${slug}/SKILL.md`
  const errors = validateSkillMetadata({ skillName: config.skillName, skillDescription: config.skillDescription })
  const hasErrors = Object.keys(errors).length > 0

  const handleDownload = () => downloadText("SKILL.md", markdown)

  const handleCopy = useAction({
    action: () => navigator.clipboard.writeText(markdown),
    toastMessages: { pending: "Copiando...", success: "SKILL.md copiado", error: "Não foi possível copiar" }
  })

  return (
    <div className={styles.resultGrid}>
      <Flex direction="column" gap="var(--enchase-space-lg)">
        <StepHeader title="Sua skill está pronta" description="Dê um nome, revise e instale no projeto." />

        <Card variant="outlined">
          <Flex direction="column" gap="var(--enchase-space-md)">
            <SegmentedControl
              label="Idioma do prompt"
              items={[
                { value: "pt", label: "Português" },
                { value: "en", label: "English" }
              ]}
              value={config.outputLanguage}
              onValueChange={(value: string) => update("outputLanguage", value as IdentifierLanguage)}
            />
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
          </Flex>
        </Card>

        <Flex gap="calc(var(--enchase-space-md) * 0.75)" wrap>
          <Button onClick={handleDownload} disabled={hasErrors}>
            Baixar SKILL.md
          </Button>
          <Button variant="outline" onClick={handleCopy} disabled={hasErrors}>
            Copiar conteúdo
          </Button>
        </Flex>

        <Alert variant="success" title="Como instalar">
          <p>
            Salve o arquivo em <code className={styles.inlineCode}>{installPath}</code> na raiz do projeto. Para valer em todos os seus projetos, use{" "}
            <code className={styles.inlineCode}>~/{installPath}</code>. A skill aparece na próxima sessão do Claude Code.
          </p>
        </Alert>
      </Flex>

      <CodeBlock code={markdown} title={installPath} isPlain isCopyable maxHeight="44rem" />
    </div>
  )
}

export default ResultStep
