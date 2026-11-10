import type { ReactElement } from 'react'
import { Card, Flex } from 'enchase'

import { booleanPrefixOptions, fileOrganizationOptions, frontendNamingGroups, handlerPrefixOptions, identifierLanguageOptions, namingGroups, tableNumberOptions, typePrefixOptions } from '@/data/generator/naming'
import { caseStyleLabels } from '@/utils/generator/naming'
import { createNamer } from '@/utils/generator/namer'
import OptionChips from '@components/OptionChips'
import useGeneratorStore from '@stores/generator'

import type { NamingConfig } from '@/types/generator'

import styles from './styles.module.css'

const NamingStep = () => {
  const naming = useGeneratorStore((state) => state.config.naming)
  const isFrontend = useGeneratorStore((state) => state.config.projectType === 'frontend')
  const updateNaming = useGeneratorStore((state) => state.updateNaming)
  const namerWith = (patch: Partial<NamingConfig>) => createNamer({ ...naming, ...patch })
  const groups = isFrontend ? frontendNamingGroups : namingGroups

  const typePrefixRow = (
    <OptionChips
      legend="Prefixo de tipos"
      description="Como interfaces e types se diferenciam."
      options={typePrefixOptions.map((option) => ({ value: option.value, label: option.label, example: namerWith({ typePrefix: option.value }).type(isFrontend ? 'userCardProps' : 'userResponse') }))}
      value={naming.typePrefix}
      onChange={(value) => updateNaming('typePrefix', value)}
    />
  )

  const booleanRow = (
    <OptionChips
      legend="Booleanos"
      description="Prefixo de variáveis verdadeiro/falso."
      options={booleanPrefixOptions.map((option) => ({ value: option.value, label: option.label, example: namerWith({ booleanPrefix: option.value }).boolean('isActive') }))}
      value={naming.booleanPrefix}
      onChange={(value) => updateNaming('booleanPrefix', value)}
    />
  )

  const fileOrganizationRow = (
    <OptionChips
      legend={isFrontend ? 'Organização de utilitários' : 'Organização'}
      description={isFrontend ? 'Como actions, stores e utils são nomeados.' : 'Como nome e papel do arquivo se combinam.'}
      options={fileOrganizationOptions.map((option) => ({ value: option.value, label: option.label, example: namerWith({ fileOrganization: option.value }).file('user', isFrontend ? 'service' : 'repository') }))}
      value={naming.fileOrganization}
      onChange={(value) => updateNaming('fileOrganization', value)}
    />
  )

  const extraRows: Record<string, ReactElement> = isFrontend
    ? {
        Código: (
          <>
            <OptionChips
              legend="Handlers de evento"
              description="Funções internas que respondem a eventos."
              options={handlerPrefixOptions.map((option) => ({ value: option.value, label: option.label, example: namerWith({ handlerPrefix: option.value }).handler('save') }))}
              value={naming.handlerPrefix}
              onChange={(value) => updateNaming('handlerPrefix', value)}
            />
            {typePrefixRow}
            {booleanRow}
          </>
        ),
        'Arquivos e pastas': fileOrganizationRow
      }
    : {
        Código: (
          <>
            {typePrefixRow}
            {booleanRow}
          </>
        ),
        'Arquivos e pastas': fileOrganizationRow,
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
          description={isFrontend ? 'Componentes, funções, tipos e pastas. Textos da interface continuam em português.' : 'Variáveis, funções, tipos, tabelas e pastas.'}
          options={identifierLanguageOptions.map((option) => ({ value: option.value, label: option.label, example: namerWith({ language: option.value }).fn(isFrontend ? 'updateUser' : 'getUserById') }))}
          value={naming.language}
          onChange={(value) => updateNaming('language', value)}
        />
      </Card>

      {groups.map((group) => (
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
