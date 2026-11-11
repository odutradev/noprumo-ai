import { Flex } from "enchase"

import { identifierLanguageOptions, namingGroups, tableNumberOptions } from "@assets/data/generator/naming"
import { goFileCaseOptions, goIdioms } from "@assets/data/generator/go"
import { caseStyleLabels } from "@utils/functions/generator/naming"
import { createNamer } from "@utils/functions/generator/namer"
import { createGoNamer } from "@utils/functions/generator/go"
import useCustomField from "@hooks/useCustomField"
import OptionChips from "@components/optionChips"
import useGeneratorStore from "@stores/generator"
import StepHeader from "@components/stepHeader"
import styles from "./styles.module.css"

import type { GoConfig, NamingConfig } from "@utils/types/generator"

const contractKeys = ["dbTables", "dbColumns", "routes", "errorCodes"]

const GoNamingStep = () => {
  const custom = useCustomField()
  const config = useGeneratorStore((state) => state.config)
  const updateNaming = useGeneratorStore((state) => state.updateNaming)
  const updateGo = useGeneratorStore((state) => state.updateGo)
  const { naming } = config
  const goNamerWith = (namingPatch: Partial<NamingConfig>, goPatch: Partial<GoConfig> = {}) => createGoNamer({ ...config, naming: { ...naming, ...namingPatch }, go: { ...config.go, ...goPatch } })
  const namerWith = (patch: Partial<NamingConfig>) => createNamer({ ...naming, ...patch })
  const categories = namingGroups.flatMap((group) => group.categories).filter((category) => contractKeys.includes(category.key))

  return (
    <Flex direction="column" gap="var(--enchase-space-lg)">
      <StepHeader title="Nomenclatura" description="Go já tem convenções fortes de nome. Aqui você escolhe o idioma, os arquivos e os nomes que viram contrato." />

      <div className={styles.group}>
        <OptionChips
          legend="Idioma dos identificadores"
          description="Tipos, funções, variáveis e pacotes de domínio. Pacotes estruturais continuam em inglês."
          options={identifierLanguageOptions.map((option) => ({ value: option.value, label: option.label, example: goNamerWith({ language: option.value }).exported("getUserById") }))}
          value={naming.language}
          onChange={(value) => updateNaming("language", value)}
          {...custom("naming.language")}
        />
        <OptionChips
          legend="Arquivos"
          description="Nome dos arquivos .go com mais de uma palavra."
          options={goFileCaseOptions.map((option) => ({ value: option.value, label: option.label, example: goNamerWith({}, { fileCase: option.value }).file(["user", "handler"]) }))}
          value={config.go.fileCase}
          onChange={(value) => updateGo("fileCase", value)}
          {...custom("go.fileCase")}
        />
      </div>

      <div className={styles.group}>
        <h3 className={styles.heading}>Banco e API</h3>
        {categories.map((category) => (
          <OptionChips
            key={category.key}
            legend={category.label}
            description={category.description}
            options={category.options.map((style) => ({
              value: style,
              label: caseStyleLabels[style],
              example: category.key === "errorCodes" ? `{"code": "${namerWith({ errorCodes: style }).errorCode("userNotFound")}"}` : category.example(namerWith({ [category.key]: style }))
            }))}
            value={naming[category.key]}
            onChange={(value) => updateNaming(category.key, value)}
            {...custom(`naming.${category.key}`)}
          />
        ))}
        <OptionChips
          legend="Número das tabelas"
          description="Plural ou singular."
          options={tableNumberOptions.map((option) => ({ value: option.value, label: option.label, example: namerWith({ tableNumber: option.value }).table() }))}
          value={naming.tableNumber}
          onChange={(value) => updateNaming("tableNumber", value)}
          {...custom("naming.tableNumber")}
        />
      </div>

      <div className={styles.group}>
        <h3 className={styles.heading}>Convenções do Go</h3>
        <p className={styles.hint}>Valem para todo projeto Go e entram no guia como regra.</p>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Elemento</th>
                <th scope="col">Padrão</th>
                <th scope="col">Exemplo</th>
              </tr>
            </thead>
            <tbody>
              {goIdioms.map((idiom) => (
                <tr key={idiom.element}>
                  <th scope="row">{idiom.element}</th>
                  <td>{idiom.standard.replaceAll("`", "")}</td>
                  <td>
                    <code>{idiom.example}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Flex>
  )
}

export default GoNamingStep
