import { Badge, Flex, Grid, Textarea } from "enchase"

import { apiDocsOptions, commentsOptions, errorHandlingOptions, exportOptions, functionStyleOptions, importAliasOptions, importOrderOptions, paradigmOptions, principleOptions, quoteOptions, routeStyleOptions, semicolonOptions, testLocationOptions, testSuffixOptions, testingOptions, validationOptions } from "@assets/data/generator/options"
import { apiLayerOptions, asyncActionsOptions, componentDeclarationOptions, componentStructureOptions, e2eOptions } from "@assets/data/generator/frontendOptions"
import StepSections from "@components/stepSections"
import useCustomField from "@hooks/useCustomField"
import ChoiceCards from "@components/choiceCards"
import useGeneratorStore from "@stores/generator"
import StepHeader from "@components/stepHeader"
import CheckCard from "@components/checkCard"
import CodeBlock from "@components/codeBlock"
import styles from "./styles.module.css"

import type { EnabledProjectType } from "@utils/types/generator"

const languageChoices = [
  { value: "en" as const, label: "Inglês", description: "Escritos em inglês." },
  { value: "pt" as const, label: "Português", description: "Escritos em português." }
]

const ConventionsStep = () => {
  const custom = useCustomField()
  const config = useGeneratorStore((state) => state.config)
  const set = useGeneratorStore((state) => state.updateConventions)
  const setFrontend = useGeneratorStore((state) => state.updateFrontend)
  const togglePrinciple = useGeneratorStore((state) => state.togglePrinciple)
  const { conventions, frontend } = config
  const isFrontend = config.projectType === "frontend"
  const principles = principleOptions.filter((principle) => principle.scope.includes(config.projectType as EnabledProjectType))
  const activeCount = principles.filter((principle) => conventions.principles.includes(principle.value)).length

  const frontendSections = [
    {
      value: "components",
      label: "Componentes",
      content: (
        <>
          <ChoiceCards legend="Declaração" options={componentDeclarationOptions} value={frontend.componentDeclaration} onChange={(value) => setFrontend("componentDeclaration", value)} {...custom("frontend.componentDeclaration")} />
          <ChoiceCards legend="Estrutura de arquivos" options={componentStructureOptions} value={frontend.componentStructure} onChange={(value) => setFrontend("componentStructure", value)} {...custom("frontend.componentStructure")} />
          <ChoiceCards legend="Exports" options={exportOptions} value={conventions.exports} onChange={(value) => set("exports", value)} {...custom("conventions.exports")} />
        </>
      )
    },
    {
      value: "data",
      label: "Dados",
      content: (
        <>
          <ChoiceCards legend="Camada de API" options={apiLayerOptions} value={frontend.apiLayer} onChange={(value) => setFrontend("apiLayer", value)} {...custom("frontend.apiLayer")} />
          <ChoiceCards legend="Ações assíncronas" options={asyncActionsOptions} value={frontend.asyncActions} onChange={(value) => setFrontend("asyncActions", value)} {...custom("frontend.asyncActions")} />
        </>
      )
    }
  ]

  const backendSections = [
    {
      value: "structure",
      label: "Estrutura",
      content: (
        <>
          <ChoiceCards legend="Paradigma" options={paradigmOptions} value={conventions.paradigm} onChange={(value) => set("paradigm", value)} {...custom("conventions.paradigm")} />
          <ChoiceCards legend="Declaração de funções" options={functionStyleOptions} value={conventions.functionStyle} onChange={(value) => set("functionStyle", value)} {...custom("conventions.functionStyle")} />
          <ChoiceCards legend="Exports" options={exportOptions} value={conventions.exports} onChange={(value) => set("exports", value)} {...custom("conventions.exports")} />
        </>
      )
    },
    {
      value: "errors",
      label: "Erros",
      content: (
        <>
          <ChoiceCards legend="Tratamento de erros" options={errorHandlingOptions} value={conventions.errorHandling} onChange={(value) => set("errorHandling", value)} {...custom("conventions.errorHandling")} />
          <ChoiceCards legend="Validação de entrada" options={validationOptions} value={conventions.validation} onChange={(value) => set("validation", value)} {...custom("conventions.validation")} />
        </>
      )
    },
    {
      value: "api",
      label: "API",
      content: (
        <>
          <ChoiceCards legend="Rotas" options={routeStyleOptions} value={conventions.routeStyle} onChange={(value) => set("routeStyle", value)} {...custom("conventions.routeStyle")} />
          <ChoiceCards legend="Documentação" options={apiDocsOptions} value={conventions.apiDocs} onChange={(value) => set("apiDocs", value)} {...custom("conventions.apiDocs")} />
        </>
      )
    }
  ]

  const sharedSections = [
    {
      value: "imports",
      label: "Imports",
      content: (
        <>
          <ChoiceCards legend="Caminhos" options={importAliasOptions} value={conventions.importAlias} onChange={(value) => set("importAlias", value)} {...custom("conventions.importAlias")} />
          <ChoiceCards legend="Organização" options={importOrderOptions} value={conventions.importOrder} onChange={(value) => set("importOrder", value)} {...custom("conventions.importOrder")} />
        </>
      )
    },
    {
      value: "tests",
      label: "Testes",
      content: (
        <>
          <ChoiceCards legend={isFrontend ? "Testes unitários" : "Framework"} options={testingOptions} value={conventions.testing} onChange={(value) => set("testing", value)} {...custom("conventions.testing")} />
          {conventions.testing !== "none" && !isFrontend && <ChoiceCards legend="Localização" options={testLocationOptions} value={conventions.testLocation} onChange={(value) => set("testLocation", value)} {...custom("conventions.testLocation")} />}
          {conventions.testing !== "none" && <ChoiceCards legend="Sufixo" options={testSuffixOptions} value={conventions.testSuffix} onChange={(value) => set("testSuffix", value)} {...custom("conventions.testSuffix")} />}
          {isFrontend && <ChoiceCards legend="Testes E2E" options={e2eOptions} value={frontend.e2e} onChange={(value) => setFrontend("e2e", value)} {...custom("frontend.e2e")} />}
        </>
      )
    },
    {
      value: "format",
      label: "Formatação",
      content: (
        <>
          <ChoiceCards legend="Ponto e vírgula" options={semicolonOptions} value={conventions.semicolons} onChange={(value) => set("semicolons", value)} {...custom("conventions.semicolons")} />
          <ChoiceCards legend="Aspas" options={quoteOptions} value={conventions.quotes} onChange={(value) => set("quotes", value)} {...custom("conventions.quotes")} />
          <ChoiceCards legend="Comentários" options={commentsOptions} value={conventions.comments} onChange={(value) => set("comments", value)} {...custom("conventions.comments")} />
          {conventions.comments !== "none" && <ChoiceCards legend="Idioma dos comentários" options={languageChoices} value={conventions.commentsLanguage} onChange={(value) => set("commentsLanguage", value)} {...custom("conventions.commentsLanguage")} />}
        </>
      )
    },
    {
      value: "principles",
      label: (
        <span className={styles.tabLabel}>
          Princípios <Badge size="sm">{`${activeCount}/${principles.length}`}</Badge>
        </span>
      ),
      content: (
        <>
          <Grid minColumnWidth="16rem" gap="var(--enchase-space-sm)">
            {principles.map((principle) => (
              <CheckCard
                key={principle.value}
                label={principle.label}
                description={principle.description}
                isChecked={conventions.principles.includes(principle.value)}
                onToggle={() => togglePrinciple(principle.value)}
                details={
                  <span className={styles.examples}>
                    <span className={styles.exampleTag} data-kind="good">
                      Certo
                    </span>
                    <CodeBlock code={principle.good} isCompact />
                    {principle.bad && (
                      <>
                        <span className={styles.exampleTag} data-kind="bad">
                          Errado
                        </span>
                        <CodeBlock code={principle.bad} isCompact />
                      </>
                    )}
                  </span>
                }
              />
            ))}
          </Grid>
          <Textarea label="Outros princípios" value={conventions.extraPrinciples} onChange={(event) => set("extraPrinciples", event.target.value)} helperText="Um por linha. Cada linha vira uma regra obrigatória na skill." rows={3} fullWidth />
        </>
      )
    }
  ]

  return (
    <Flex direction="column" gap="var(--enchase-space-lg)">
      <StepHeader title="Convenções de código" description="Como o código é escrito no dia a dia. Cada escolha muda o exemplo da prévia." />
      <StepSections label="Seções de convenções" sections={[...(isFrontend ? frontendSections : backendSections), ...sharedSections]} />
    </Flex>
  )
}

export default ConventionsStep
