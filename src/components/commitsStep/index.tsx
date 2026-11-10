import { useMemo } from "react"
import { Flex } from "enchase"

import { aiAttributionOptions, branchNamingOptions, commitBodyOptions, commitFormatOptions, commitGranularityOptions, commitLanguageOptions, commitScopeOptions, commitTimingOptions } from "@assets/data/generator/commitOptions"
import { buildCommitExamples, renderCommitLog } from "@utils/functions/generator/commits"
import StepSections from "@components/stepSections"
import useCustomField from "@hooks/useCustomField"
import ChoiceCards from "@components/choiceCards"
import useGeneratorStore from "@stores/generator"
import StepHeader from "@components/stepHeader"
import CodeBlock from "@components/codeBlock"

const CommitsStep = () => {
  const custom = useCustomField()
  const config = useGeneratorStore((state) => state.config)
  const set = useGeneratorStore((state) => state.updateConventions)
  const { conventions } = config
  const examples = useMemo(() => buildCommitExamples(config), [config])
  const log = renderCommitLog(examples)

  const sections = [
    {
      value: "granularity",
      label: "Quantos commits",
      content: (
        <>
          <ChoiceCards legend="Granularidade" description="Como o trabalho de uma tarefa é dividido em commits." options={commitGranularityOptions} value={conventions.commitGranularity} onChange={(value) => set("commitGranularity", value)} {...custom("conventions.commitGranularity")} />
          <ChoiceCards legend="Quando commitar" options={commitTimingOptions} value={conventions.commitTiming} onChange={(value) => set("commitTiming", value)} {...custom("conventions.commitTiming")} />
        </>
      )
    },
    {
      value: "message",
      label: "Mensagem",
      content: (
        <>
          <ChoiceCards legend="Formato" options={commitFormatOptions} value={conventions.commitFormat} onChange={(value) => set("commitFormat", value)} {...custom("conventions.commitFormat")} />
          <ChoiceCards legend="Idioma" options={commitLanguageOptions} value={conventions.commitLanguage} onChange={(value) => set("commitLanguage", value)} {...custom("conventions.commitLanguage")} />
          {conventions.commitFormat === "conventional" && <ChoiceCards legend="Escopo" options={commitScopeOptions} value={conventions.commitScope} onChange={(value) => set("commitScope", value)} {...custom("conventions.commitScope")} />}
          <ChoiceCards legend="Corpo" options={commitBodyOptions} value={conventions.commitBody} onChange={(value) => set("commitBody", value)} {...custom("conventions.commitBody")} />
          <ChoiceCards legend="Coautoria de IA" options={aiAttributionOptions} value={conventions.aiAttribution} onChange={(value) => set("aiAttribution", value)} {...custom("conventions.aiAttribution")} />
        </>
      )
    },
    {
      value: "branches",
      label: "Branches",
      content: <ChoiceCards legend="Nome das branches" options={branchNamingOptions} value={conventions.branchNaming} onChange={(value) => set("branchNaming", value)} {...custom("conventions.branchNaming")} />
    }
  ]

  return (
    <Flex direction="column" gap="var(--enchase-space-lg)">
      <StepHeader title="Commits" description="Como o Claude vai registrar o trabalho no git. O histórico muda a cada escolha." />
      <CodeBlock code={log} title={`git log · ${examples.length} ${examples.length === 1 ? "commit" : "commits"} para uma feature`} isPlain />
      <StepSections label="Seções de commits" sections={sections} />
    </Flex>
  )
}

export default CommitsStep
