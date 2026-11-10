import type { ReactElement } from 'react'
import { Card, Flex } from 'enchase'

import { booleanPrefixOptions, fileOrganizationOptions, identifierLanguageOptions, namingGroups, tableNumberOptions, typePrefixOptions } from '@/data/generator/naming'
import { caseStyleLabels } from '@/utils/generator/naming'
import { createNamer } from '@/utils/generator/namer'
import OptionChips from '@components/OptionChips'
import useGeneratorStore from '@stores/generator'

import type { NamingConfig } from '@/types/generator'

import styles from './styles.module.css'

const NamingStep = () => {
  const naming = useGeneratorStore((state) => state.config.naming)
  const updateNaming = useGeneratorStore((state) => state.updateNaming)
  const namerWith = (patch: Partial<NamingConfig>) => createNamer({ ...naming, ...patch })

  const extraRows: Record<string, ReactElement> = {
    Código: (
      <>
        <OptionChips
          legend="Prefixo de tipos"
          description="Como interfaces e types se diferenciam."
          options={typePrefixOptions.map((option) => ({ value: option.value, label: option.label, example: namerWith({ typePrefix: option.value }).type('userResponse') }))}
          value={naming.typePrefix}
          onChange={(value) => updateNaming('typePrefix', value)}
        />
        <OptionChips
          legend="Booleanos"
          description="Prefixo de variáveis verdadeiro/falso."
          options={booleanPrefixOptions.map((option) => ({ value: option.value, label: option.label, example: namerWith({ booleanPrefix: option.value }).boolean('isActive') }))}
          value={naming.booleanPrefix}
          onChange={(value) => updateNaming('booleanPrefix', value)}
        />
      </>
    ),
    'Arquivos e pastas': (
      <OptionChips
        legend="Organização"
        description="Como nome e papel do arquivo se combinam."
        options={fileOrganizationOptions.map((option) => ({ value: option.value, label: option.label, example: namerWith({ fileOrganization: option.value }).file('user', 'repository') }))}
        value={naming.fileOrganization}
        onChange={(value) => updateNaming('fileOrganization', value)}
      />
    ),
    'Banco e API': (
      <OptionChips
        legend="Número das tabelas"
        description="Plural ou singular."
        options={tableNumberOptions.map((option) => ({ value: option.value, label: option.label, example: namerWith({ tableNumber: option.value }).table() }))}
        value={naming.tableNumber}
        onChange={(value) => updateNaming('tableNumber', value)}
      />
    )
  }

  return (
    <Flex direction="column" gap="1.5rem">
      <div>
        <h2 className={styles.title}>Nomenclatura</h2>
        <p className={styles.subtitle}>Cada opção mostra o nome real que vai aparecer no código.</p>
      </div>

      <Card variant="outlined">
        <OptionChips
          legend="Idioma dos identificadores"
          description="Variáveis, funções, tipos, tabelas e pastas."
          options={identifierLanguageOptions.map((option) => ({ value: option.value, label: option.label, example: namerWith({ language: option.value }).fn('getUserById') }))}
          value={naming.language}
          onChange={(value) => updateNaming('language', value)}
        />
      </Card>

      {namingGroups.map((group) => (
        <Card key={group.title} variant="outlined" header={group.title} headerExtra={<span className={styles.hint}>{group.description}</span>}>
          {group.categories.map((category) => (
            <OptionChips
              key={category.key}
              legend={category.label}
              description={category.description}
              options={category.options.map((style) => ({ value: style, label: caseStyleLabels[style], example: category.example(namerWith({ [category.key]: style })) }))}
              value={naming[category.key]}
              onChange={(value) => updateNaming(category.key, value)}
            />
          ))}
          {extraRows[group.title]}
        </Card>
      ))}
    </Flex>
  )
}

export default NamingStep
