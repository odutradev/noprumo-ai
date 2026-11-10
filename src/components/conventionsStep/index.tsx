import { Badge, Card, Flex, Grid, Textarea } from "enchase"

import { apiDocsOptions, commentsOptions, errorHandlingOptions, exportOptions, functionStyleOptions, importAliasOptions, importOrderOptions, paradigmOptions, principleOptions, quoteOptions, routeStyleOptions, semicolonOptions, testLocationOptions, testSuffixOptions, testingOptions, validationOptions } from "@assets/data/generator/options"
import { apiLayerOptions, asyncActionsOptions, componentDeclarationOptions, componentStructureOptions, e2eOptions } from "@assets/data/generator/frontendOptions"
import useCustomField from "@hooks/useCustomField"
import ChoiceCards from "@components/choiceCards"
import useGeneratorStore from "@stores/generator"
import StepHeader from "@components/stepHeader"
import CheckCard from "@components/checkCard"
import CodeBlock from "@components/codeBlock"
import styles from "./styles"

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

  return (
    <Flex direction="column" gap="1.5rem">
      <StepHeader title="Convenções de código" description="Como o código é escrito no dia a dia. Cada escolha muda o exemplo ao lado." />

      {isFrontend ? (
        <>
          <Card variant="outlined" header="Componentes">
            <Flex direction="column" gap="2rem">
              <ChoiceCards
                legend="Declaração"
                options={componentDeclarationOptions}
                value={frontend.componentDeclaration}
                onChange={(value) => setFrontend("componentDeclaration", value)}
                {...custom("frontend.componentDeclaration")}
                minWidth="17rem"
              />
              <ChoiceCards
                legend="Estrutura de arquivos"
                options={componentStructureOptions}
                value={frontend.componentStructure}
                onChange={(value) => setFrontend("componentStructure", value)}
                {...custom("frontend.componentStructure")}
                minWidth="17rem"
              />
              <ChoiceCards legend="Exports" options={exportOptions} value={conventions.exports} onChange={(value) => set("exports", value)} {...custom("conventions.exports")} />
            </Flex>
          </Card>

          <Card variant="outlined" header="Dados e ações">
            <Flex direction="column" gap="2rem">
              <ChoiceCards legend="Camada de API" options={apiLayerOptions} value={frontend.apiLayer} onChange={(value) => setFrontend("apiLayer", value)} {...custom("frontend.apiLayer")} />
              <ChoiceCards
                legend="Ações assíncronas"
                options={asyncActionsOptions}
                value={frontend.asyncActions}
                onChange={(value) => setFrontend("asyncActions", value)}
                {...custom("frontend.asyncActions")}
                minWidth="19rem"
              />
            </Flex>
          </Card>
        </>
      ) : (
        <>
          <Card variant="outlined" header="Estrutura">
            <Flex direction="column" gap="2rem">
              <ChoiceCards legend="Paradigma" options={paradigmOptions} value={conventions.paradigm} onChange={(value) => set("paradigm", value)} {...custom("conventions.paradigm")} />
              <ChoiceCards
                legend="Declaração de funções"
                options={functionStyleOptions}
                value={conventions.functionStyle}
                onChange={(value) => set("functionStyle", value)}
                {...custom("conventions.functionStyle")}
              />
              <ChoiceCards legend="Exports" options={exportOptions} value={conventions.exports} onChange={(value) => set("exports", value)} {...custom("conventions.exports")} />
            </Flex>
          </Card>

          <Card variant="outlined" header="Erros e validação">
            <Flex direction="column" gap="2rem">
              <ChoiceCards
                legend="Tratamento de erros"
                options={errorHandlingOptions}
                value={conventions.errorHandling}
                onChange={(value) => set("errorHandling", value)}
                {...custom("conventions.errorHandling")}
                minWidth="18rem"
              />
              <ChoiceCards
                legend="Validação de entrada"
                options={validationOptions}
                value={conventions.validation}
                onChange={(value) => set("validation", value)}
                {...custom("conventions.validation")}
              />
            </Flex>
          </Card>

          <Card variant="outlined" header="API">
            <Flex direction="column" gap="2rem">
              <ChoiceCards
                legend="Rotas"
                options={routeStyleOptions}
                value={conventions.routeStyle}
                onChange={(value) => set("routeStyle", value)}
                {...custom("conventions.routeStyle")}
                minWidth="18rem"
              />
              <ChoiceCards legend="Documentação" options={apiDocsOptions} value={conventions.apiDocs} onChange={(value) => set("apiDocs", value)} {...custom("conventions.apiDocs")} minWidth="18rem" />
            </Flex>
          </Card>
        </>
      )}

      <Card variant="outlined" header="Imports">
        <Flex direction="column" gap="2rem">
          <ChoiceCards
            legend="Caminhos"
            options={importAliasOptions}
            value={conventions.importAlias}
            onChange={(value) => set("importAlias", value)}
            {...custom("conventions.importAlias")}
            minWidth="18rem"
          />
          <ChoiceCards
            legend="Organização"
            options={importOrderOptions}
            value={conventions.importOrder}
            onChange={(value) => set("importOrder", value)}
            {...custom("conventions.importOrder")}
            minWidth="20rem"
          />
        </Flex>
      </Card>

      <Card variant="outlined" header="Testes">
        <Flex direction="column" gap="2rem">
          <ChoiceCards
            legend={isFrontend ? "Testes unitários" : "Framework"}
            options={testingOptions}
            value={conventions.testing}
            onChange={(value) => set("testing", value)}
            {...custom("conventions.testing")}
          />
          {conventions.testing !== "none" && (
            <>
              {!isFrontend && (
                <ChoiceCards
                  legend="Localização"
                  options={testLocationOptions}
                  value={conventions.testLocation}
                  onChange={(value) => set("testLocation", value)}
                  {...custom("conventions.testLocation")}
                />
              )}
              <ChoiceCards legend="Sufixo" options={testSuffixOptions} value={conventions.testSuffix} onChange={(value) => set("testSuffix", value)} {...custom("conventions.testSuffix")} />
            </>
          )}
          {isFrontend && <ChoiceCards legend="Testes E2E" options={e2eOptions} value={frontend.e2e} onChange={(value) => setFrontend("e2e", value)} {...custom("frontend.e2e")} minWidth="18rem" />}
        </Flex>
      </Card>

      <Card variant="outlined" header="Formatação e comentários">
        <Flex direction="column" gap="2rem">
          <ChoiceCards legend="Ponto e vírgula" options={semicolonOptions} value={conventions.semicolons} onChange={(value) => set("semicolons", value)} {...custom("conventions.semicolons")} />
          <ChoiceCards legend="Aspas" options={quoteOptions} value={conventions.quotes} onChange={(value) => set("quotes", value)} {...custom("conventions.quotes")} />
          <ChoiceCards legend="Comentários" options={commentsOptions} value={conventions.comments} onChange={(value) => set("comments", value)} {...custom("conventions.comments")} />
          {conventions.comments !== "none" && (
            <ChoiceCards
              legend="Idioma dos comentários"
              options={languageChoices}
              value={conventions.commentsLanguage}
              onChange={(value) => set("commentsLanguage", value)}
              {...custom("conventions.commentsLanguage")}
            />
          )}
        </Flex>
      </Card>

      <Card variant="outlined" header="Princípios obrigatórios" headerExtra={<Badge variant="primary">{`${activeCount} de ${principles.length}`}</Badge>}>
        <Grid minColumnWidth="18rem">
          {principles.map((principle) => (
            <CheckCard
              key={principle.value}
              label={principle.label}
              description={principle.description}
              isChecked={conventions.principles.includes(principle.value)}
              onToggle={() => togglePrinciple(principle.value)}
            >
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
            </CheckCard>
          ))}
        </Grid>
        <div className={styles.extraField}>
          <Textarea
            label="Outros princípios"
            value={conventions.extraPrinciples}
            onChange={(event) => set("extraPrinciples", event.target.value)}
            helperText="Um por linha. Cada linha vira uma regra obrigatória na skill."
            rows={3}
            fullWidth
          />
        </div>
      </Card>
    </Flex>
  )
}

export default ConventionsStep
