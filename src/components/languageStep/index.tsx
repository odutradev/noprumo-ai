import { Flex } from "enchase"

import { dataFetchingOptions, formValidationOptions, frontendFrameworkOptions, stateOptions, stylingOptions, uiLibraryOptions } from "@assets/data/generator/frontendOptions"
import { databaseOptions, frameworkOptions, languageOptions } from "@assets/data/generator/options"
import useCustomField from "@hooks/useCustomField"
import ChoiceCards from "@components/choiceCards"
import useGeneratorStore from "@stores/generator"

const LanguageStep = () => {
  const custom = useCustomField()
  const config = useGeneratorStore((state) => state.config)
  const update = useGeneratorStore((state) => state.update)
  const updateFrontend = useGeneratorStore((state) => state.updateFrontend)
  const { frontend } = config

  return (
    <Flex direction="column" gap="2.5rem">
      <ChoiceCards
        legend="Linguagem"
        description="A linguagem principal do código."
        options={languageOptions}
        value={config.language}
        onChange={(value) => update("language", value)}
        {...custom("language")}
      />
      {config.projectType === "frontend" ? (
        <>
          <ChoiceCards
            legend="Framework"
            description="Base da aplicação e do roteamento."
            options={frontendFrameworkOptions}
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
            minWidth="17rem"
          />
          <ChoiceCards
            legend="Estilização"
            description="Onde e como os estilos dos componentes são escritos."
            options={stylingOptions}
            value={frontend.styling}
            onChange={(value) => updateFrontend("styling", value)}
            {...custom("frontend.styling")}
          />
          <ChoiceCards
            legend="Estado global"
            description="Onde fica o estado compartilhado entre páginas."
            options={stateOptions}
            value={frontend.state}
            onChange={(value) => updateFrontend("state", value)}
            {...custom("frontend.state")}
            minWidth="17rem"
          />
          <ChoiceCards
            legend="Requisições"
            description="Como o frontend conversa com a API."
            options={dataFetchingOptions}
            value={frontend.dataFetching}
            onChange={(value) => updateFrontend("dataFetching", value)}
            {...custom("frontend.dataFetching")}
            minWidth="18rem"
          />
          <ChoiceCards
            legend="Validação de formulários"
            options={formValidationOptions}
            value={frontend.formValidation}
            onChange={(value) => updateFrontend("formValidation", value)}
            {...custom("frontend.formValidation")}
            minWidth="18rem"
          />
        </>
      ) : (
        <>
          <ChoiceCards
            legend="Framework HTTP"
            description="Define como os endpoints são declarados."
            options={frameworkOptions}
            value={config.framework}
            onChange={(value) => update("framework", value)}
            {...custom("framework")}
          />
          <ChoiceCards
            legend="Banco de dados"
            description="Define como os repositórios acessam os dados."
            options={databaseOptions}
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
