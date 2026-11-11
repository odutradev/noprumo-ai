import { Flex } from "enchase"

import { dataFetchingOptions, formValidationOptions, frontendFrameworkOptions, stateOptions, stylingOptions, uiLibraryOptions } from "@assets/data/generator/frontendOptions"
import { databaseOptions, frameworkOptions, languageOptions } from "@assets/data/generator/options"
import { goDatabaseOptions, goFrameworkOptions } from "@assets/data/generator/go"
import { forLanguage } from "@utils/functions/generator/language"
import useCustomField from "@hooks/useCustomField"
import ChoiceCards from "@components/choiceCards"
import useGeneratorStore from "@stores/generator"
import StepHeader from "@components/stepHeader"

import type { ChoiceOption } from "@utils/types/generator"

const LanguageStep = () => {
  const custom = useCustomField()
  const config = useGeneratorStore((state) => state.config)
  const update = useGeneratorStore((state) => state.update)
  const updateFrontend = useGeneratorStore((state) => state.updateFrontend)
  const setLanguage = useGeneratorStore((state) => state.setLanguage)
  const updateGo = useGeneratorStore((state) => state.updateGo)
  const { frontend } = config
  const localize = <T extends string>(options: ChoiceOption<T>[]) => forLanguage(options, config.language)
  const languages = languageOptions.filter((option) => config.projectType === "backend" || option.value === "typescript" || option.value === "javascript")

  return (
    <Flex direction="column" gap="var(--enchase-space-xl)">
      <StepHeader title="Stack" description="As tecnologias que a skill vai assumir em todo o código." />
      <ChoiceCards
        legend="Linguagem"
        description="A linguagem principal do código."
        options={languages}
        value={config.language}
        onChange={(value) => setLanguage(value)}
        {...custom("language")}
      />
      {config.projectType === "frontend" ? (
        <>
          <ChoiceCards
            legend="Framework"
            description="Base da aplicação e do roteamento."
            options={localize(frontendFrameworkOptions)}
            value={frontend.framework}
            onChange={(value) => updateFrontend("framework", value)}
            {...custom("frontend.framework")}
          />
          <ChoiceCards
            legend="Componentes base"
            description="Biblioteca de UI usada para botões, inputs, tabelas e tema."
            options={uiLibraryOptions}
            value={frontend.uiLibrary}
            onChange={(value) => updateFrontend("uiLibrary", value)}
            {...custom("frontend.uiLibrary")}
           
          />
          <ChoiceCards
            legend="Estilização"
            description="Onde e como os estilos dos componentes são escritos."
            options={localize(stylingOptions)}
            value={frontend.styling}
            onChange={(value) => updateFrontend("styling", value)}
            {...custom("frontend.styling")}
          />
          <ChoiceCards
            legend="Estado global"
            description="Onde fica o estado compartilhado entre páginas."
            options={localize(stateOptions)}
            value={frontend.state}
            onChange={(value) => updateFrontend("state", value)}
            {...custom("frontend.state")}
           
          />
          <ChoiceCards
            legend="Requisições"
            description="Como o frontend conversa com a API."
            options={dataFetchingOptions}
            value={frontend.dataFetching}
            onChange={(value) => updateFrontend("dataFetching", value)}
            {...custom("frontend.dataFetching")}
           
          />
          <ChoiceCards
            legend="Validação de formulários"
            options={localize(formValidationOptions)}
            value={frontend.formValidation}
            onChange={(value) => updateFrontend("formValidation", value)}
            {...custom("frontend.formValidation")}
           
          />
        </>
      ) : config.language === "go" ? (
        <>
          <ChoiceCards
            legend="Framework HTTP"
            description="Define como as rotas e os handlers são declarados."
            options={goFrameworkOptions}
            value={config.go.framework}
            onChange={(value) => updateGo("framework", value)}
            {...custom("go.framework")}
          />
          <ChoiceCards
            legend="Banco de dados"
            description="Define como os repositórios acessam os dados."
            options={goDatabaseOptions}
            value={config.go.database}
            onChange={(value) => updateGo("database", value)}
            {...custom("go.database")}
          />
        </>
      ) : (
        <>
          <ChoiceCards
            legend="Framework HTTP"
            description="Define como os endpoints são declarados."
            options={localize(frameworkOptions)}
            value={config.framework}
            onChange={(value) => update("framework", value)}
            {...custom("framework")}
          />
          <ChoiceCards
            legend="Banco de dados"
            description="Define como os repositórios acessam os dados."
            options={localize(databaseOptions)}
            value={config.database}
            onChange={(value) => update("database", value)}
            {...custom("database")}
          />
        </>
      )}
    </Flex>
  )
}

export default LanguageStep
