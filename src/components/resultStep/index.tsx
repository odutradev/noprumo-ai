import { Alert, Button, Card, Flex, Input, SegmentedControl, Textarea } from "enchase"
import { useMemo } from "react"

import { buildSkillMarkdown, slugify } from "@utils/functions/generator/skillMarkdown"
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

  const handleCopy = useAction({
    action: () => navigator.clipboard.writeText(markdown),
    toastMessages: { pending: "Copiando...", success: "SKILL.md copiado", error: "Não foi possível copiar" }
  })

  return (
    <div className={styles.resultGrid}>
      <Flex direction="column" gap="1.5rem">
        <StepHeader title="Sua skill está pronta" description="Dê um nome, revise e instale no projeto." />

        <Card variant="outlined">
          <Flex direction="column" gap="1rem">
            <SegmentedControl
              label="Idioma do prompt"
              items={[
                { value: "pt", label: "Português" },
                { value: "en", label: "English" }
              ]}
              value={config.outputLanguage}
              onValueChange={(value: string) => update("outputLanguage", value as IdentifierLanguage)}
            />
            <Input label="Nome da skill" value={config.skillName} onChange={(event) => update("skillName", event.target.value)} helperText={`Identificador: ${slug}`} fullWidth />
            <Textarea
              label="Quando usar"
              value={config.skillDescription}
              onChange={(event) => update("skillDescription", event.target.value)}
              helperText="O Claude lê esta descrição para decidir quando ativar a skill. Escreva no mesmo idioma do prompt."
              rows={3}
              fullWidth
            />
          </Flex>
        </Card>

        <Flex gap="0.75rem" wrap>
          <Button onClick={() => downloadText("SKILL.md", markdown)}>Baixar SKILL.md</Button>
          <Button variant="outline" onClick={handleCopy}>
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
