import type { BooleanPrefix, CaseStyle, FileOrganization, HandlerPrefix, IdentifierLanguage, NamingConfig, TableNumber, TypePrefix } from '@/types/generator'
import type { Namer } from '@/utils/generator/namer'

type CaseKey = { [K in keyof NamingConfig]: NamingConfig[K] extends CaseStyle ? K : never }[keyof NamingConfig]

export interface CaseCategory {
  key: CaseKey
  label: string
  description: string
  options: CaseStyle[]
  example: (namer: Namer) => string
}

export interface NamingGroup {
  title: string
  description: string
  categories: CaseCategory[]
}

export const namingGroups: NamingGroup[] = [
  {
    title: 'Código',
    description: 'Identificadores que aparecem dentro dos arquivos.',
    categories: [
      { key: 'variables', label: 'Variáveis', description: 'Valores locais e parâmetros.', options: ['camel', 'snake'], example: (n) => `${n.variable('foundUser')}, ${n.variable('userId')}` },
      { key: 'functions', label: 'Funções e métodos', description: 'Funções, métodos e handlers.', options: ['camel', 'snake', 'pascal'], example: (n) => `${n.fn('getUserById')}()` },
      { key: 'classes', label: 'Classes', description: 'Classes, erros e serviços.', options: ['pascal', 'camel', 'snake'], example: (n) => `class ${n.cls('userNotFoundError')} extends Error {}` },
      { key: 'types', label: 'Tipos e interfaces', description: 'Interfaces, types e inferências de schema.', options: ['pascal', 'camel', 'snake'], example: (n) => `interface ${n.type('userResponse')} { id: string }` },
      { key: 'enums', label: 'Enums', description: 'Nome do enum ou do objeto de opções.', options: ['pascal', 'camel', 'screamingSnake'], example: (n) => `enum ${n.enumName('userStatus')} {}` },
      { key: 'enumMembers', label: 'Membros de enum', description: 'Cada valor possível do enum.', options: ['pascal', 'screamingSnake', 'camel', 'snake'], example: (n) => `${n.enumName('userStatus')}.${n.enumMember('active')}` },
      { key: 'constants', label: 'Constantes e dados estáticos', description: 'Valores fixos, limites e configurações.', options: ['screamingSnake', 'camel', 'pascal'], example: (n) => `const ${n.constant('maxLoginAttempts')} = 5` },
      { key: 'errorCodes', label: 'Códigos e chaves de catálogo', description: 'Códigos de erro, ações de auditoria e chaves de evento.', options: ['snake', 'screamingSnake', 'kebab', 'camel'], example: (n) => `manageError({ code: '${n.errorCode('userNotFound')}' })` }
    ]
  },
  {
    title: 'Arquivos e pastas',
    description: 'Como o projeto aparece no explorador de arquivos.',
    categories: [
      { key: 'files', label: 'Arquivos', description: 'Nome dos arquivos de código.', options: ['camel', 'kebab', 'pascal', 'snake'], example: (n) => n.file('user', 'repository') },
      { key: 'folders', label: 'Pastas', description: 'Nome dos diretórios.', options: ['camel', 'kebab', 'snake', 'pascal'], example: (n) => `${n.folder('useCases')}/` }
    ]
  },
  {
    title: 'Banco e API',
    description: 'Nomes que saem do código e viram contrato.',
    categories: [
      { key: 'dbTables', label: 'Tabelas e coleções', description: 'Nome no banco de dados.', options: ['camel', 'snake', 'pascal'], example: (n) => n.table() },
      { key: 'dbColumns', label: 'Colunas e campos', description: 'Campos dos documentos ou colunas.', options: ['camel', 'snake'], example: (n) => n.column('createdAt') },
      { key: 'routes', label: 'Segmentos de rota', description: 'Partes da URL com mais de uma palavra.', options: ['kebab', 'camel', 'snake'], example: (n) => n.route() }
    ]
  }
]

export const identifierLanguageOptions: { value: IdentifierLanguage; label: string; example: string }[] = [
  { value: 'en', label: 'Inglês', example: 'getUserById' },
  { value: 'pt', label: 'Português', example: 'buscarUsuarioPorId' }
]

export const typePrefixOptions: { value: TypePrefix; label: string; example: string }[] = [
  { value: 'none', label: 'Sem prefixo', example: 'UserResponse' },
  { value: 'i', label: 'Prefixo I', example: 'IUserResponse' },
  { value: 't', label: 'Prefixo T', example: 'TUserResponse' }
]

export const booleanPrefixOptions: { value: BooleanPrefix; label: string; example: string }[] = [
  { value: 'verb', label: 'Com verbo (is, has, should)', example: 'isActive' },
  { value: 'none', label: 'Sem verbo', example: 'active' }
]

export const fileOrganizationOptions: { value: FileOrganization; label: string; description: string }[] = [
  { value: 'folderIndex', label: 'Pasta + index.ts', description: 'Cada unidade é uma pasta com `index.ts`.' },
  { value: 'roleSuffix', label: 'Sufixo de papel', description: 'O papel vira sufixo depois de um ponto.' },
  { value: 'joined', label: 'Nome composto', description: 'Nome e papel juntos no mesmo padrão.' }
]

export const tableNumberOptions: { value: TableNumber; label: string }[] = [
  { value: 'plural', label: 'Plural' },
  { value: 'singular', label: 'Singular' }
]

export const frontendNamingGroups: NamingGroup[] = [
  {
    title: 'Código',
    description: 'Identificadores que aparecem dentro dos arquivos.',
    categories: [
      { key: 'components', label: 'Componentes', description: 'Componentes React e styled components.', options: ['pascal', 'camel'], example: (n) => `<${n.component('userCard')} />` },
      { key: 'functions', label: 'Funções e hooks', description: 'Funções, actions e hooks (sempre com prefixo use).', options: ['camel', 'snake'], example: (n) => `${n.fn('updateUser')}(), ${n.fn('useUserStore')}()` },
      { key: 'variables', label: 'Variáveis e props', description: 'Valores locais, estados e props.', options: ['camel', 'snake'], example: (n) => `${n.variable('userId')}, ${n.variable('foundUser')}` },
      { key: 'types', label: 'Tipos e interfaces', description: 'Props, tipos de domínio e stores.', options: ['pascal', 'camel'], example: (n) => `interface ${n.type('userCardProps')} {}` },
      { key: 'constants', label: 'Constantes e dados estáticos', description: 'Configurações e listas fixas.', options: ['camel', 'screamingSnake', 'pascal'], example: (n) => `const ${n.constant('baseUrl')} = import.meta.env.VITE_BASEURL` }
    ]
  },
  {
    title: 'Arquivos e pastas',
    description: 'Como o projeto aparece no explorador de arquivos.',
    categories: [
      { key: 'componentFolders', label: 'Pastas e arquivos de componentes', description: 'Nome da pasta ou do arquivo de cada componente.', options: ['camel', 'pascal', 'kebab'], example: (n) => `${n.componentFolder('userCard')}/` },
      { key: 'files', label: 'Arquivos de utilitários', description: 'Actions, stores, utils e validações.', options: ['camel', 'kebab', 'pascal', 'snake'], example: (n) => n.file('user', 'service') },
      { key: 'folders', label: 'Pastas', description: 'Diretórios de páginas, hooks e utilitários.', options: ['camel', 'kebab', 'snake'], example: (n) => `${n.folder('validations')}/` }
    ]
  }
]

export const handlerPrefixOptions: { value: HandlerPrefix; label: string }[] = [
  { value: 'handle', label: 'Prefixo handle' },
  { value: 'on', label: 'Prefixo on' }
]
