import { Badge, Flex, Grid, Textarea } from "enchase"

import { goCommentsOptions, goErrorHandlingOptions, goLoggerOptions, goPrincipleOptions, goTestingOptions, goValidationOptions } from "@assets/data/generator/go"
import { routeStyleOptions } from "@assets/data/generator/options"
import StepSections from "@components/stepSections"
import useCustomField from "@hooks/useCustomField"
import ChoiceCards from "@components/choiceCards"
import useGeneratorStore from "@stores/generator"
import StepHeader from "@components/stepHeader"
import CheckCard from "@components/checkCard"
import CodeBlock from "@components/codeBlock"
import styles from "./styles.module.css"

import type { IdentifierLanguage } from "@utils/types/generator"

const languageChoices: { value: IdentifierLanguage; label: string; description: string }[] = [
  { value: "en", label: "Inglês", description: "Escritos em inglês." },
  { value: "pt", label: "Português", description: "Escritos em português." }
]

const GoConventionsStep = () => {
  const custom = useCustomField()
  const config = useGeneratorStore((state) => state.config)
  const updateGo = useGeneratorStore((state) => state.updateGo)
  const setConvention = useGeneratorStore((state) => state.updateConventions)
  const togglePrinciple = useGeneratorStore((state) => state.toggleGoPrinciple)
  const { conventions, go } = config
  const activeCount = go.principles.length

  const sections = [
    {
      value: "errors",
      label: "Erros",
      content: (
        <>
          <ChoiceCards legend="Tratamento de erros" options={goErrorHandlingOptions} value={go.errorHandling} onChange={(value) => updateGo("errorHandling", value)} {...custom("go.errorHandling")} />
          <ChoiceCards legend="Validação de entrada" options={goValidationOptions} value={go.validation} onChange={(value) => updateGo("validation", value)} {...custom("go.validation")} />
        </>
      )
    },
    {
      value: "api",
      label: "API e logs",
      content: (
        <>
          <ChoiceCards legend="Rotas" options={routeStyleOptions} value={conventions.routeStyle} onChange={(value) => setConvention("routeStyle", value)} {...custom("conventions.routeStyle")} />
          <ChoiceCards legend="Logs" options={goLoggerOptions} value={go.logger} onChange={(value) => updateGo("logger", value)} {...custom("go.logger")} />
        </>
      )
    },
    {
      value: "tests",
      label: "Testes",
      content: <ChoiceCards legend="Framework" options={goTestingOptions} value={go.testing} onChange={(value) => updateGo("testing", value)} {...custom("go.testing")} />
    },
    {
      value: "comments",
      label: "Comentários",
      content: (
        <>
          <ChoiceCards legend="Comentários" options={goCommentsOptions} value={conventions.comments} onChange={(value) => setConvention("comments", value)} {...custom("conventions.comments")} />
          {conventions.comments !== "none" && <ChoiceCards legend="Idioma dos comentários" options={languageChoices} value={conventions.commentsLanguage} onChange={(value) => setConvention("commentsLanguage", value)} {...custom("conventions.commentsLanguage")} />}
        </>
      )
    },
    {
      value: "principles",
      label: (
        <span className={styles.tabLabel}>
          Princípios <Badge size="sm">{`${activeCount}/${goPrincipleOptions.length}`}</Badge>
        </span>
      ),
      content: (
        <>
          <Grid minColumnWidth="16rem" gap="var(--enchase-space-sm)">
            {goPrincipleOptions.map((principle) => (
              <CheckCard
                key={principle.value}
                label={principle.label}
                description={principle.description}
                isChecked={go.principles.includes(principle.value)}
                onToggle={() => togglePrinciple(principle.value)}
                details={
                  <span className={styles.examples}>
                    <span className={styles.exampleTag} data-kind="good">
                      Certo
                    </span>
                    <CodeBlock code={principle.good} isCompact isPlain />
                    {principle.bad && (
                      <>
                        <span className={styles.exampleTag} data-kind="bad">
                          Errado
                        </span>
                        <CodeBlock code={principle.bad} isCompact isPlain />
                      </>
                    )}
                  </span>
                }
              />
            ))}
          </Grid>
          <Textarea label="Outros princípios" value={conventions.extraPrinciples} onChange={(event) => setConvention("extraPrinciples", event.target.value)} helperText="Um por linha. Cada linha vira uma regra obrigatória na skill." rows={3} fullWidth />
        </>
      )
    }
  ]

  return (
    <Flex direction="column" gap="var(--enchase-space-lg)">
      <StepHeader title="Convenções de código" description="gofmt resolve a formatação. Aqui ficam as decisões que o formatter não toma." />
      <StepSections label="Seções de convenções" sections={sections} />
    </Flex>
  )
}

export default GoConventionsStep
