export type ProjectType = "backend" | "frontend" | "mobile" | "fullstack"
export type Language = "typescript" | "javascript" | "python" | "go"
export type Framework = "express" | "fastify" | "nestjs" | "hono"
export type Database = "mongoose" | "prisma" | "drizzle" | "typeorm" | "none"
export type BackendArchitecture = "domainActions" | "layered" | "clean" | "hexagonal" | "modular" | "ddd" | "verticalSlice"
export type FrontendArchitecture = "typeFolders" | "featureFolders" | "atomic" | "featureSliced"
export type Architecture = BackendArchitecture | FrontendArchitecture

export type FrontendFramework = "react" | "next" | "vue" | "angular"
export type UiLibrary = "mui" | "shadcn" | "chakra" | "antd" | "none"
export type Styling = "styledComponents" | "tailwind" | "cssModules" | "sass"
export type StateManagement = "zustand" | "redux" | "context" | "jotai"
export type DataFetching = "axios" | "fetch" | "reactQuery"
export type FormValidation = "yup" | "zod" | "none"
export type E2eTesting = "cypress" | "playwright" | "none"
export type ComponentDeclaration = "arrowFC" | "arrowProps" | "function"
export type ComponentStructure = "folderTriad" | "folderNamed" | "singleFile"
export type ApiLayer = "actionsFolder" | "servicesFolder" | "colocated"
export type AsyncActions = "useAction" | "tryCatch" | "mutationHook"
export type HandlerPrefix = "handle" | "on"
export type CommitFormat = "conventional" | "free"
export type BranchNaming = "typeSlash" | "free"
export type CommitGranularity = "logical" | "perStep" | "single"
export type CommitScope = "none" | "scoped"
export type CommitBody = "subjectOnly" | "withBody"
export type CommitTiming = "afterTask" | "onRequest"
export type AiAttribution = "never" | "coAuthor"
export type PublishAction = "bumpPackage" | "bumpManifest" | "build" | "buildZip" | "clean" | "push" | "npmPublish"
export type PublisherInvocation = "npx" | "global" | "script"
export type PublishPrompt = "everyTask" | "onRequest"

export type CaseStyle = "camel" | "pascal" | "snake" | "screamingSnake" | "kebab"
export type IdentifierLanguage = "en" | "pt"
export type TypePrefix = "none" | "i" | "t"
export type BooleanPrefix = "verb" | "none"
export type FileOrganization = "folderIndex" | "roleSuffix" | "joined"
export type TableNumber = "plural" | "singular"

export type FunctionStyle = "arrow" | "declaration"
export type Paradigm = "objects" | "classes"
export type ExportStyle = "mixed" | "named" | "default"
export type ImportAlias = "perFolder" | "root" | "relative"
export type ImportOrder = "blocksByLength" | "blocksAlphabetical" | "free"
export type ErrorHandling = "errorCatalog" | "exceptions" | "result"
export type Validation = "zod" | "classValidator" | "joi" | "none"
export type Testing = "vitest" | "jest" | "none"
export type TestLocation = "hybrid" | "colocated" | "separate"
export type TestSuffix = "spec" | "test"
export type Semicolons = "never" | "always"
export type Quotes = "single" | "double"
export type CommentsPolicy = "none" | "publicOnly" | "allowed"
export type RouteStyle = "actionInPath" | "rest"
export type ApiDocs = "openapiZod" | "none"

export type Principle =
  | "earlyReturn"
  | "immutability"
  | "noAny"
  | "noConsoleLog"
  | "parallelAsync"
  | "leanResponses"
  | "repositoryIsolation"
  | "auditMutations"
  | "standardPagination"
  | "noReinvent"
  | "routeGuard"
  | "permissionCheck"
  | "lazyRoutes"
  | "mobileFirst"
  | "accessibility"
  | "themeTokens"
  | "persistedStores"

export interface NamingConfig {
  language: IdentifierLanguage
  variables: CaseStyle
  functions: CaseStyle
  classes: CaseStyle
  types: CaseStyle
  typePrefix: TypePrefix
  enums: CaseStyle
  enumMembers: CaseStyle
  constants: CaseStyle
  booleanPrefix: BooleanPrefix
  errorCodes: CaseStyle
  files: CaseStyle
  fileOrganization: FileOrganization
  folders: CaseStyle
  dbTables: CaseStyle
  tableNumber: TableNumber
  dbColumns: CaseStyle
  routes: CaseStyle
  components: CaseStyle
  componentFolders: CaseStyle
  handlerPrefix: HandlerPrefix
}

export interface ConventionsConfig {
  paradigm: Paradigm
  functionStyle: FunctionStyle
  exports: ExportStyle
  importAlias: ImportAlias
  importOrder: ImportOrder
  errorHandling: ErrorHandling
  validation: Validation
  routeStyle: RouteStyle
  apiDocs: ApiDocs
  testing: Testing
  testLocation: TestLocation
  testSuffix: TestSuffix
  semicolons: Semicolons
  quotes: Quotes
  comments: CommentsPolicy
  commentsLanguage: IdentifierLanguage
  commitFormat: CommitFormat
  commitLanguage: IdentifierLanguage
  branchNaming: BranchNaming
  commitGranularity: CommitGranularity
  commitScope: CommitScope
  commitBody: CommitBody
  commitTiming: CommitTiming
  aiAttribution: AiAttribution
  extraPrinciples: string
  principles: Principle[]
}

export interface FrontendConfig {
  framework: FrontendFramework
  uiLibrary: UiLibrary
  styling: Styling
  state: StateManagement
  dataFetching: DataFetching
  formValidation: FormValidation
  e2e: E2eTesting
  componentDeclaration: ComponentDeclaration
  componentStructure: ComponentStructure
  apiLayer: ApiLayer
  asyncActions: AsyncActions
}

export interface PublishingConfig {
  isEnabled: boolean
  actions: PublishAction[]
  branch: string
  buildScript: string
  invocation: PublisherInvocation
  prompt: PublishPrompt
  extraFlags: string
}

export type OutputFormat = "skill" | "claudeMd"

export interface OutputFile {
  fileName: string
  installPath: string
  globalPath: string
}

export interface GeneratorConfig {
  skillName: string
  skillDescription: string
  projectType: ProjectType
  language: Language
  framework: Framework
  database: Database
  architecture: Architecture
  naming: NamingConfig
  conventions: ConventionsConfig
  frontend: FrontendConfig
  publishing: PublishingConfig
  custom: Record<string, string>
  outputLanguage: IdentifierLanguage
}

export type EnabledProjectType = Extract<ProjectType, "backend" | "frontend">

export interface ChoiceOption<T extends string> {
  value: T
  label: string
  description: string
  example?: string
  badge?: string
  isDisabled?: boolean
}

export interface TreeNode {
  name: string
  note?: string
  isHighlighted?: boolean
  children?: TreeNode[]
}
