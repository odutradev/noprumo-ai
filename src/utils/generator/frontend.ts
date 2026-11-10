import type { FrontendArchitecture, GeneratorConfig } from '@/types/generator'

import { createImporter, END, finalize, type ImportLine, type SampleFile } from './codeFormat'
import { createNamer, type Namer } from './namer'

import type { ProjectFile } from './architecture'

interface ComponentFiles {
  main: string
  styles?: string
  types?: string
  index?: string
}

export interface FrontendLayout {
  files: ProjectFile[]
  component: ComponentFiles
  api: string
  store: string
  userType: string
  hook: string
  page: string
}

const join = (...parts: string[]) => parts.filter(Boolean).join('/')

const stylesFileName = (config: GeneratorConfig, base: string) => {
  switch (config.frontend.styling) {
    case 'styledComponents':
      return `${base}.ts`
    case 'cssModules':
      return `${base}.module.css`
    case 'sass':
      return `${base}.module.scss`
    case 'tailwind':
      return undefined
  }
}

const componentFiles = (config: GeneratorConfig, n: Namer, baseDir: string): ComponentFiles => {
  const name = n.component('userCard')
  const folder = join(baseDir, n.componentFolder('userCard'))
  switch (config.frontend.componentStructure) {
    case 'folderTriad': {
      const styles = stylesFileName(config, 'styles')
      return { main: join(folder, 'index.tsx'), styles: styles && join(folder, styles), types: join(folder, 'types.ts') }
    }
    case 'folderNamed': {
      const styles = stylesFileName(config, `${name}.styles`)
      return { main: join(folder, `${name}.tsx`), styles: styles && join(folder, styles.replace('.styles.module', '.module')), types: join(folder, `${name}.types.ts`), index: join(folder, 'index.ts') }
    }
    case 'singleFile': {
      const styles = stylesFileName(config, `${name}.styles`)
      return { main: join(baseDir, `${name}.tsx`), styles: styles && join(baseDir, styles.replace('.styles.module', '.module')) }
    }
  }
}

const unitFile = (n: Namer, dir: string, key: Parameters<Namer['file']>[0]) => join(dir, n.file(key))

const pagePath = (config: GeneratorConfig, n: Namer, pagesDir: string) =>
  config.frontend.framework === 'next' ? join('src', 'app', n.folder('users'), 'page.tsx') : join(pagesDir, n.folder('users'), 'index.tsx')

const apiPath = (config: GeneratorConfig, n: Namer, colocatedDir: string) => {
  switch (config.frontend.apiLayer) {
    case 'actionsFolder':
      return unitFile(n, join('src', n.folder('actions')), 'user')
    case 'servicesFolder':
      return join('src', n.folder('servicesFolder'), n.file('user', 'service'))
    default:
      return join(colocatedDir, 'api.ts')
  }
}

const hookFile = (config: GeneratorConfig, dir: string) => (config.naming.fileOrganization === 'folderIndex' ? join(dir, 'useAction', 'index.ts') : join(dir, 'useAction.ts'))

const buildLayout = (architecture: FrontendArchitecture, config: GeneratorConfig, n: Namer): Omit<FrontendLayout, 'files'> & { extra: ProjectFile[] } => {
  const f = n.folder
  const src = 'src'

  switch (architecture) {
    case 'featureFolders': {
      const feature = join(src, f('features'), f('users'))
      return {
        component: componentFiles(config, n, join(feature, f('components'))),
        api: apiPath(config, n, feature),
        store: join(feature, 'store.ts'),
        userType: join(feature, 'types.ts'),
        hook: hookFile(config, join(src, f('shared'), f('hooks'))),
        page: pagePath(config, n, join(src, f('pages'))),
        extra: [{ path: join(feature, 'index.ts'), note: 'API pública da feature' }, { path: join(src, f('shared'), f('components'), n.componentFolder('button'), 'index.tsx') }, { path: join(src, f('shared'), f('utils'), 'api.ts') }]
      }
    }
    case 'atomic': {
      const components = join(src, f('components'))
      return {
        component: componentFiles(config, n, join(components, f('molecules'))),
        api: apiPath(config, n, join(src, f('servicesFolder'))),
        store: unitFile(n, join(src, f('stores')), 'user'),
        userType: join(src, f('typesFolder'), n.file('user')),
        hook: hookFile(config, join(src, f('hooks'))),
        page: pagePath(config, n, join(src, f('pages'))),
        extra: [
          { path: join(components, f('atoms'), n.componentFolder('button'), 'index.tsx'), note: 'atom' },
          { path: join(components, f('organisms'), n.componentFolder('userTable'), 'index.tsx'), note: 'organism' },
          { path: join(components, f('templates'), n.componentFolder('dashboardTemplate'), 'index.tsx'), note: 'template' }
        ]
      }
    }
    case 'featureSliced': {
      const entity = join(src, f('entities'), f('user'))
      return {
        component: componentFiles(config, n, join(entity, f('ui'))),
        api: config.frontend.apiLayer === 'colocated' ? join(entity, f('api'), 'index.ts') : apiPath(config, n, join(entity, f('api'))),
        store: join(entity, f('model'), 'store.ts'),
        userType: join(entity, f('model'), 'types.ts'),
        hook: hookFile(config, join(src, f('shared'), f('lib'))),
        page: join(src, f('pages'), f('users'), f('ui'), 'index.tsx'),
        extra: [
          { path: join(src, f('appFolder'), f('providers'), 'index.tsx'), note: 'app' },
          { path: join(src, f('widgets'), f('userTable'), f('ui'), 'index.tsx'), note: 'widget' },
          { path: join(src, f('features'), f('editUser'), f('ui'), 'index.tsx'), note: 'feature' },
          { path: join(entity, 'index.ts'), note: 'API pública da entidade' },
          { path: join(src, f('shared'), f('api'), 'client.ts') }
        ]
      }
    }
    case 'typeFolders':
    default: {
      const utils = join(src, f('utils'))
      const page = pagePath(config, n, join(src, f('pages')))
      return {
        component: componentFiles(config, n, join(src, f('components'))),
        api: apiPath(config, n, page.split('/').slice(0, -1).join('/')),
        store: unitFile(n, join(src, f('stores')), 'user'),
        userType: join(utils, f('typesFolder'), n.file('user')),
        hook: hookFile(config, join(src, f('hooks'))),
        page,
        extra: [
          { path: join(src, f('assets'), f('config'), 'index.ts') },
          { path: join(src, f('assets'), f('data'), 'index.ts'), note: 'dados estáticos' },
          { path: join(src, f('routes'), 'index.tsx'), note: 'rotas e proteção' },
          { path: unitFile(n, join(src, f('stores')), 'system'), note: 'tema e permissões' },
          { path: join(src, f('stylesFolder'), `${n.file('theme').replace(/\/index\.ts$/, '').replace(/\.ts$/, '')}.ts`) },
          { path: join(utils, f('functions'), 'index.ts') },
          { path: join(utils, f('validations'), n.file('user')) },
          { path: join(utils, 'api.ts'), note: 'instância HTTP' }
        ]
      }
    }
  }
}

const testFiles = (config: GeneratorConfig, layout: Omit<FrontendLayout, 'files'>): ProjectFile[] => {
  const unit = config.conventions.testing === 'none' ? [] : [{ path: layout.component.main.replace(/\.tsx$/, `.${config.conventions.testSuffix}.tsx`), note: 'teste' }]
  switch (config.frontend.e2e) {
    case 'cypress':
      return [...unit, { path: 'cypress/e2e/01.auth.cy.ts', note: 'E2E' }, { path: 'cypress/e2e/02.users.cy.ts', note: 'E2E' }, { path: 'cypress/fixtures/users.json' }, { path: 'cypress/support/commands.ts', note: 'comandos customizados' }]
    case 'playwright':
      return [...unit, { path: 'e2e/users.spec.ts', note: 'E2E' }, { path: 'playwright.config.ts' }]
    case 'none':
      return unit
  }
}

export const getFrontendLayout = (config: GeneratorConfig): FrontendLayout => {
  const n = createNamer(config.naming)
  const { extra, ...layout } = buildLayout(config.architecture as FrontendArchitecture, config, n)
  const { component } = layout
  const files: ProjectFile[] = [
    { path: component.main, note: 'componente', highlight: true },
    ...(component.styles ? [{ path: component.styles, note: 'estilos' }] : []),
    ...(component.types ? [{ path: component.types, note: 'props' }] : []),
    ...(component.index ? [{ path: component.index, note: 'reexport' }] : []),
    { path: layout.api, note: 'chamadas à API' },
    { path: layout.store, note: 'estado global' },
    { path: layout.userType, note: 'tipos' },
    { path: layout.hook, note: 'hook' },
    { path: layout.page, note: 'página' },
    ...extra,
    ...testFiles(config, layout)
  ]
  return { ...layout, files }
}

const uiImports = (config: GeneratorConfig): ImportLine[] => {
  switch (config.frontend.uiLibrary) {
    case 'mui':
      return [{ kind: 'external', from: '@mui/material', line: "import { Button, Typography } from '@mui/material'" }]
    case 'shadcn':
      return [{ kind: 'internal', from: '@/components/ui/button', line: "import { Button } from '@/components/ui/button'" }]
    case 'chakra':
      return [{ kind: 'external', from: '@chakra-ui/react', line: "import { Button, Heading } from '@chakra-ui/react'" }]
    case 'antd':
      return [{ kind: 'external', from: 'antd', line: "import { Button, Typography } from 'antd'" }]
    case 'none':
      return []
  }
}

const titleElement = (config: GeneratorConfig, name: string) => {
  switch (config.frontend.uiLibrary) {
    case 'mui':
      return `<Typography variant=${Q}h6${Q}>{${name}}</Typography>`
    case 'chakra':
      return `<Heading size=${Q}sm${Q}>{${name}}</Heading>`
    case 'antd':
      return `<Typography.Title level={5}>{${name}}</Typography.Title>`
    default:
      return `<h3>{${name}}</h3>`
  }
}

const buttonElement = (config: GeneratorConfig, handler: string, pending?: string) => {
  const disabled = pending ? ` disabled={${pending}}` : ''
  switch (config.frontend.uiLibrary) {
    case 'mui':
      return `<Button variant=${Q}contained${Q} onClick={${handler}}${disabled}>Salvar</Button>`
    case 'none':
      return `<button type=${Q}button${Q} onClick={${handler}}${disabled}>Salvar</button>`
    default:
      return `<Button onClick={${handler}}${disabled}>Salvar</Button>`
  }
}

const toPropName = (config: GeneratorConfig) => createNamer({ ...config.naming, handlerPrefix: 'on' }).handler('saved')

const Q = '¤'

const buildComponentFile = (config: GeneratorConfig, n: Namer, layout: FrontendLayout): SampleFile => {
  const { frontend } = config
  const importer = createImporter(config, layout.component.main)
  const name = n.component('userCard')
  const propsType = n.type('userCardProps')
  const userId = n.variable('userId')
  const userName = n.variable('userName')
  const onSaved = toPropName(config)
  const handler = n.handler('save')
  const updateUser = n.fn('updateUser')
  const container = n.component('container')
  const imports: ImportLine[] = [...uiImports(config)]

  if (frontend.styling === 'styledComponents' && layout.component.styles) {
    imports.push({ kind: 'internal', from: importer(layout.component.styles), line: `import { ${container} } from '${importer(layout.component.styles)}'` })
  }
  if ((frontend.styling === 'cssModules' || frontend.styling === 'sass') && layout.component.styles) {
    imports.push({ kind: 'internal', from: './styles', line: `import styles from './${layout.component.styles.split('/').pop()}'` })
  }
  if (layout.component.types) {
    imports.push({ kind: 'type', from: importer(layout.component.types), line: `import type { ${propsType} } from '${importer(layout.component.types).replace(/\.ts$/, '')}'` })
  }

  const handlerBody = (() => {
    switch (frontend.asyncActions) {
      case 'useAction':
        imports.push({ kind: 'internal', from: importer(layout.hook), line: `import ${n.fn('useAction')} from '${importer(layout.hook)}'` })
        imports.push({ kind: 'internal', from: importer(layout.api), line: `import { ${updateUser} } from '${importer(layout.api)}'` })
        return `  const ${handler} = () =>\n    ${n.fn('useAction')}({\n      action: async () => await ${updateUser}(${userId}, { ${userName} }),\n      toastMessages: {\n        pending: 'Salvando...',\n        success: 'Salvo com sucesso',\n        error: 'Erro ao salvar'\n      },\n      callback: ${onSaved}\n    })${END}`
      case 'tryCatch':
        imports.push({ kind: 'external', from: 'react-toastify', line: "import { toast } from 'react-toastify'" })
        imports.push({ kind: 'internal', from: importer(layout.api), line: `import { ${updateUser} } from '${importer(layout.api)}'` })
        return `  const ${handler} = async () => {\n    try {\n      await ${updateUser}(${userId}, { ${userName} })${END}\n      ${onSaved}?.()${END}\n    } catch {\n      toast.error('Erro ao salvar')${END}\n    }\n  }${END}`
      case 'mutationHook':
        imports.push({ kind: 'internal', from: importer(layout.api), line: `import { ${n.fn('useUpdateUser')} } from '${importer(layout.api)}'` })
        return `  const { mutate, isPending } = ${n.fn('useUpdateUser')}()${END}\n\n  const ${handler} = () => mutate({ ${userId}, ${userName} }, { onSuccess: ${onSaved} })${END}`
    }
  })()

  const pending = frontend.asyncActions === 'mutationHook' ? 'isPending' : undefined
  const wrapperOpen = (() => {
    switch (frontend.styling) {
      case 'styledComponents':
        return [`<${container}>`, `</${container}>`]
      case 'tailwind':
        return [`<div className=${Q}flex items-center justify-between gap-4 rounded-lg border p-4${Q}>`, '</div>']
      default:
        return [`<div className={styles.${n.variable('container')}}>`, '</div>']
    }
  })()

  const jsx = `  return (\n    ${wrapperOpen[0]}\n      ${titleElement(config, userName)}\n      ${buttonElement(config, handler, pending)}\n    ${wrapperOpen[1]}\n  )${END}`
  const params = `{ ${userId}, ${userName}, ${onSaved} }`
  const inlineProps = layout.component.types ? '' : `interface ${propsType} {\n  ${userId}: string${END}\n  ${userName}: string${END}\n  ${onSaved}?: () => void${END}\n}\n\n`
  const isNamed = config.conventions.exports === 'named'
  const exportWord = isNamed ? 'export ' : ''

  const declaration = (() => {
    switch (frontend.componentDeclaration) {
      case 'arrowFC':
        return `${exportWord}const ${name}: React.FC<${propsType}> = (${params}) => {\n${handlerBody}\n\n${jsx}\n}${END}`
      case 'arrowProps':
        return `${exportWord}const ${name} = (${params}: ${propsType}) => {\n${handlerBody}\n\n${jsx}\n}${END}`
      case 'function':
        return `${exportWord}function ${name}(${params}: ${propsType}) {\n${handlerBody}\n\n${jsx}\n}`
    }
  })()

  const body = `${inlineProps}${declaration}${isNamed ? '' : `\n\nexport default ${name}${END}`}`
  return { path: layout.component.main, code: finalize(imports, body, config).replaceAll(Q, '"') }
}


const buildStylesFile = (config: GeneratorConfig, n: Namer, layout: FrontendLayout): SampleFile | undefined => {
  const path = layout.component.styles
  if (!path) return undefined
  if (config.frontend.styling === 'styledComponents') {
    const spacing = config.frontend.uiLibrary === 'mui' ? (value: number) => `\${({ theme }) => theme.spacing(${value})}` : (value: number) => `\${({ theme }) => theme.space[${value}]}`
    const body = `export const ${n.component('container')} = styled.div\`\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: ${spacing(2)};\n  padding: ${spacing(2)};\n  border-radius: ${config.frontend.uiLibrary === 'mui' ? '${({ theme }) => theme.shape.borderRadius}px' : '${({ theme }) => theme.radii.md}'};\n\``
    return { path, code: finalize([{ kind: 'external', from: 'styled-components', line: "import styled from 'styled-components'" }], body, config) }
  }
  const className = n.variable('container')
  return { path, code: `.${className} {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n  padding: 1rem;\n  border-radius: 0.5rem;\n}\n` }
}

const buildTypesFile = (config: GeneratorConfig, n: Namer, layout: FrontendLayout): SampleFile | undefined => {
  const path = layout.component.types
  if (!path) return undefined
  const body = `export interface ${n.type('userCardProps')} {\n  ${n.variable('userId')}: string${END}\n  ${n.variable('userName')}: string${END}\n  ${toPropName(config)}?: () => void${END}\n}`
  return { path, code: finalize([], body, config) }
}

const buildApiFile = (config: GeneratorConfig, n: Namer, layout: FrontendLayout): SampleFile => {
  const importer = createImporter(config, layout.api)
  const user = n.type('user')
  const userId = n.variable('userId')
  const updateUser = n.fn('updateUser')
  const imports: ImportLine[] = [{ kind: 'type', from: importer(layout.userType), line: `import type { ${user} } from '${importer(layout.userType)}'` }]
  const users = n.folder('users')

  const request = (() => {
    if (config.frontend.dataFetching === 'fetch') {
      imports.push({ kind: 'internal', from: 'config', line: `import { ${n.constant('baseUrl')} } from '${importer(`src/${n.folder('config')}/index.ts`)}'` })
      return `export const ${updateUser} = async (${userId}: string, data: Partial<${user}>): Promise<${user}> => {\n  const response = await fetch(\`\${${n.constant('baseUrl')}}/${users}/\${${userId}}\`, {\n    method: 'PATCH',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify(data)\n  })${END}\n  return response.json()${END}\n}${END}`
    }
    imports.push({ kind: 'internal', from: 'api', line: `import api from '${importer(`src/${n.folder('utils')}/api.ts`)}'` })
    return `export const ${updateUser} = async (${userId}: string, data: Partial<${user}>) => {\n  const response = await api.patch<${user}>(\`/${users}/\${${userId}}\`, data)${END}\n  return response.data${END}\n}${END}`
  })()

  const mutation =
    config.frontend.asyncActions === 'mutationHook'
      ? (() => {
          imports.push({ kind: 'external', from: '@tanstack/react-query', line: "import { useMutation } from '@tanstack/react-query'" })
          return `\n\nexport const ${n.fn('useUpdateUser')} = () =>\n  useMutation({\n    mutationFn: ({ ${userId}, ...data }: { ${userId}: string } & Partial<${user}>) => ${updateUser}(${userId}, data)\n  })${END}`
        })()
      : ''

  return { path: layout.api, code: finalize(imports, `${request}${mutation}`, config) }
}

const buildStoreFile = (config: GeneratorConfig, n: Namer, layout: FrontendLayout): SampleFile => {
  const importer = createImporter(config, layout.store)
  const user = n.type('user')
  const setUser = n.fn('setUser')
  const userVar = n.variable('user')
  const persisted = config.conventions.principles.includes('persistedStores')
  const imports: ImportLine[] = [{ kind: 'type', from: importer(layout.userType), line: `import type { ${user} } from '${importer(layout.userType)}'` }]
  const isNamed = config.conventions.exports === 'named'

  switch (config.frontend.state) {
    case 'zustand': {
      imports.push({ kind: 'external', from: 'zustand', line: "import { create } from 'zustand'" })
      if (persisted) imports.push({ kind: 'external', from: 'zustand/middleware', line: "import { persist } from 'zustand/middleware'" })
      const storeType = n.type('userStore')
      const hook = n.fn('useUserStore')
      const state = `(set) => ({\n    ${userVar}: null,\n    ${setUser}: (${userVar}) => set({ ${userVar} })\n  })`
      const creator = persisted ? `create<${storeType}>()(\n  persist(\n    ${state.replaceAll('\n', '\n  ')},\n    { name: '${userVar}' }\n  )\n)` : `create<${storeType}>()(${state.replaceAll('\n  ', '\n')})`
      const body = `interface ${storeType} {\n  ${userVar}: ${user} | null${END}\n  ${setUser}: (${userVar}: ${user} | null) => void${END}\n}\n\n${isNamed ? 'export ' : ''}const ${hook} = ${creator}${END}${isNamed ? '' : `\n\nexport default ${hook}${END}`}`
      return { path: layout.store, code: finalize(imports, body, config) }
    }
    case 'redux': {
      imports.push({ kind: 'external', from: '@reduxjs/toolkit', line: "import { createSlice, type PayloadAction } from '@reduxjs/toolkit'" })
      const slice = n.variable('userSlice')
      const body = `const ${slice} = createSlice({\n  name: '${userVar}',\n  initialState: { ${userVar}: null as ${user} | null },\n  reducers: {\n    ${setUser}: (state, action: PayloadAction<${user} | null>) => {\n      state.${userVar} = action.payload${END}\n    }\n  }\n})${END}\n\nexport const { ${setUser} } = ${slice}.actions${END}\n\nexport default ${slice}.reducer${END}`
      return { path: layout.store, code: finalize(imports, body, config) }
    }
    case 'context': {
      imports.push({ kind: 'external', from: 'react', line: "import { createContext, useContext } from 'react'" })
      const valueType = n.type('userContextValue')
      const context = n.component('userContext')
      const body = `interface ${valueType} {\n  ${userVar}: ${user} | null${END}\n  ${setUser}: (${userVar}: ${user} | null) => void${END}\n}\n\nexport const ${context} = createContext<${valueType}>({ ${userVar}: null, ${setUser}: () => undefined })${END}\n\nexport const ${n.fn('useUserContext')} = () => useContext(${context})${END}`
      return { path: layout.store, code: finalize(imports, body, config) }
    }
    case 'jotai': {
      imports.push(persisted ? { kind: 'external', from: 'jotai/utils', line: "import { atomWithStorage } from 'jotai/utils'" } : { kind: 'external', from: 'jotai', line: "import { atom } from 'jotai'" })
      const body = persisted ? `export const ${n.variable('userAtom')} = atomWithStorage<${user} | null>('${userVar}', null)${END}` : `export const ${n.variable('userAtom')} = atom<${user} | null>(null)${END}`
      return { path: layout.store, code: finalize(imports, body, config) }
    }
  }
}

export const buildFrontendSampleFiles = (config: GeneratorConfig): SampleFile[] => {
  const n = createNamer(config.naming)
  const layout = getFrontendLayout(config)
  return [buildComponentFile(config, n, layout), buildStylesFile(config, n, layout), buildTypesFile(config, n, layout), buildApiFile(config, n, layout), buildStoreFile(config, n, layout)].filter(
    (file): file is SampleFile => Boolean(file)
  )
}
