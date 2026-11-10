import { createNamer, type Namer } from "@utils/functions/generator/namer"
import { getFrontendLayout } from "@utils/functions/generator/frontend"

import type { BackendArchitecture, GeneratorConfig, TreeNode } from "@utils/types/generator"

export type UnitKind = "action" | "service" | "useCase" | "handler"

export interface ProjectFile {
  path: string
  note?: string
  highlight?: boolean
}

export interface ArchitectureLayout {
  kind: UnitKind
  files: ProjectFile[]
  mainPath: string
  schemaPath: string
  typesPath?: string
  repositoryPath: string
  errorsPath: string
}

const join = (...parts: string[]) => parts.join("/")

const buildLayout = (architecture: BackendArchitecture, n: Namer): ArchitectureLayout => {
  const f = n.folder
  const src = "src"

  switch (architecture) {
    case "domainActions": {
      const domain = join(src, f("domains"), f("users"))
      const action = join(domain, f("actions"), f("user"))
      const repository = join(domain, f("repositories"), f("user"))
      return {
        kind: "action",
        mainPath: join(action, "index.ts"),
        schemaPath: join(action, "schemas.ts"),
        typesPath: join(action, "types.ts"),
        repositoryPath: join(repository, "index.ts"),
        errorsPath: join(src, f("factories"), f("errors"), "index.ts"),
        files: [
          { path: join(domain, "index.ts"), note: "DomainModule" },
          { path: join(action, "schemas.ts"), note: "schemas Zod" },
          { path: join(action, "types.ts"), note: "z.infer" },
          { path: join(action, "index.ts"), note: "defineAction", highlight: true },
          { path: join(repository, "model.ts"), note: "model do banco" },
          { path: join(repository, "types.ts"), note: "payloads" },
          { path: join(repository, "index.ts"), note: "métodos de acesso" },
          { path: join(src, f("factories"), f("errors"), "index.ts"), note: "catálogo de erros" },
          { path: join(src, f("factories"), "defineAction", "index.ts") },
          { path: join(src, f("middlewares"), "manageRequest", "index.ts") },
          { path: join(src, f("database"), "connect.ts") },
          { path: join(src, f("storage"), "utils.ts") },
          { path: join(src, f("utils"), f("logger"), "index.ts") },
          { path: join(src, f("config"), "cors.ts") }
        ]
      }
    }
    case "layered":
      return {
        kind: "service",
        mainPath: join(src, f("services"), n.file("user", "service")),
        schemaPath: join(src, f("models"), n.file("user", "schema")),
        repositoryPath: join(src, f("repositories"), n.file("user", "repository")),
        errorsPath: join(src, f("errors"), n.file("appError")),
        files: [
          { path: join(src, f("controllers"), n.file("user", "controller")) },
          { path: join(src, f("services"), n.file("user", "service")), note: "regra de negócio", highlight: true },
          { path: join(src, f("repositories"), n.file("user", "repository")) },
          { path: join(src, f("models"), n.file("user", "schema")) },
          { path: join(src, f("errors"), n.file("appError")) },
          { path: join(src, f("routes"), n.file("user", "routes")) },
          { path: join(src, n.file("server")) }
        ]
      }
    case "clean":
      return {
        kind: "useCase",
        mainPath: join(src, f("application"), f("useCases"), n.file("getUserById", "useCase")),
        schemaPath: join(src, f("domain"), f("entities"), n.file("user", "entity")),
        repositoryPath: join(src, f("application"), f("repositories"), n.file("user", "repository")),
        errorsPath: join(src, f("domain"), f("errors"), n.file("appError")),
        files: [
          { path: join(src, f("domain"), f("entities"), n.file("user", "entity")) },
          { path: join(src, f("domain"), f("errors"), n.file("appError")) },
          { path: join(src, f("application"), f("useCases"), n.file("getUserById", "useCase")), note: "caso de uso", highlight: true },
          { path: join(src, f("application"), f("repositories"), n.file("user", "repository")), note: "interface" },
          { path: join(src, f("infra"), f("database"), n.file("user", "repository")), note: "implementação" },
          { path: join(src, f("infra"), f("http"), n.file("user", "controller")) },
          { path: join(src, f("main"), n.file("server")) }
        ]
      }
    case "hexagonal":
      return {
        kind: "service",
        mainPath: join(src, f("core"), f("services"), n.file("user", "service")),
        schemaPath: join(src, f("core"), f("domain"), n.file("user", "entity")),
        repositoryPath: join(src, f("core"), f("ports"), n.file("user", "repository")),
        errorsPath: join(src, f("core"), f("domain"), n.file("appError")),
        files: [
          { path: join(src, f("core"), f("domain"), n.file("user", "entity")) },
          { path: join(src, f("core"), f("domain"), n.file("appError")) },
          { path: join(src, f("core"), f("ports"), n.file("user", "repository")), note: "porta de saída" },
          { path: join(src, f("core"), f("services"), n.file("user", "service")), note: "núcleo", highlight: true },
          { path: join(src, f("adapters"), f("inbound"), f("http"), n.file("user", "controller")), note: "adaptador de entrada" },
          { path: join(src, f("adapters"), f("outbound"), f("database"), n.file("user", "repository")), note: "adaptador de saída" }
        ]
      }
    case "modular": {
      const module = join(src, f("modules"), f("user"))
      return {
        kind: "service",
        mainPath: join(module, n.file("user", "service")),
        schemaPath: join(module, n.file("user", "schema")),
        repositoryPath: join(module, n.file("user", "repository")),
        errorsPath: join(src, f("shared"), f("errors"), n.file("appError")),
        files: [
          { path: join(module, n.file("user", "controller")) },
          { path: join(module, n.file("user", "service")), highlight: true },
          { path: join(module, n.file("user", "repository")) },
          { path: join(module, n.file("user", "schema")) },
          { path: join(src, f("shared"), f("errors"), n.file("appError")) },
          { path: join(src, f("shared"), f("database"), n.file("database")) }
        ]
      }
    }
    case "ddd": {
      const context = join(src, f("contexts"), f("identity"))
      return {
        kind: "service",
        mainPath: join(context, f("application"), f("services"), n.file("user", "service")),
        schemaPath: join(context, f("domain"), f("aggregates"), n.file("user", "aggregate")),
        repositoryPath: join(context, f("domain"), f("repositories"), n.file("user", "repository")),
        errorsPath: join(src, f("shared"), f("errors"), n.file("appError")),
        files: [
          { path: join(context, f("domain"), f("aggregates"), n.file("user", "aggregate")), note: "raiz do agregado" },
          { path: join(context, f("domain"), f("valueObjects"), n.file("email", "valueObject")) },
          { path: join(context, f("domain"), f("repositories"), n.file("user", "repository")), note: "contrato" },
          { path: join(context, f("application"), f("services"), n.file("user", "service")), note: "serviço de aplicação", highlight: true },
          { path: join(context, f("infra"), f("database"), n.file("user", "repository")), note: "implementação" },
          { path: join(src, f("shared"), f("errors"), n.file("appError")) }
        ]
      }
    }
    case "verticalSlice": {
      const feature = join(src, f("features"), f("getUserById"))
      return {
        kind: "handler",
        mainPath: join(feature, n.file("getUserById", "handler")),
        schemaPath: join(feature, n.file("getUserById", "schema")),
        repositoryPath: join(src, f("shared"), f("database"), n.file("user", "repository")),
        errorsPath: join(src, f("shared"), f("errors"), n.file("appError")),
        files: [
          { path: join(feature, n.file("getUserById", "handler")), note: "fatia completa", highlight: true },
          { path: join(feature, n.file("getUserById", "schema")) },
          { path: join(src, f("features"), f("createUser"), n.file("createUser", "handler")) },
          { path: join(src, f("features"), f("createUser"), n.file("createUser", "schema")) },
          { path: join(src, f("shared"), f("database"), n.file("user", "repository")) },
          { path: join(src, f("shared"), f("errors"), n.file("appError")) }
        ]
      }
    }
  }
}

const testFileFor = (path: string, suffix: string) => path.replace(/\.ts$/, `.${suffix}.ts`)

const withTests = (layout: ArchitectureLayout, config: GeneratorConfig, n: Namer): ProjectFile[] => {
  const { testing, testLocation, testSuffix } = config.conventions
  if (testing === "none") return layout.files

  const unitTest = testFileFor(layout.mainPath, testSuffix)
  const repositoryTest = testFileFor(layout.repositoryPath, testSuffix)
  const e2eFolder = join("tests", n.folder("e2e"))
  const e2eTest = join(e2eFolder, `${n.file("health").replace(/\.ts$/, "").replace(/\/index$/, "")}.e2e-${testSuffix}.ts`)
  const mirror = (path: string) => join("tests", path.replace(/^src\//, ""))

  if (testLocation === "separate") {
    return [...layout.files, { path: mirror(unitTest), note: "teste" }, { path: mirror(repositoryTest), note: "teste" }, { path: join("tests", "setup.ts") }]
  }

  const colocated = [...layout.files, { path: unitTest, note: "teste" }, { path: repositoryTest, note: "teste" }]
  if (testLocation === "colocated") return colocated
  return [...colocated, { path: join("tests", "setup.ts") }, { path: e2eTest, note: "E2E" }]
}

const sortTree = (nodes: TreeNode[]): TreeNode[] =>
  [...nodes]
    .map((node) => (node.children ? { ...node, children: sortTree(node.children) } : node))
    .sort((a, b) => Number(Boolean(b.children)) - Number(Boolean(a.children)) || a.name.localeCompare(b.name))

const insert = (nodes: TreeNode[], segments: string[], file: ProjectFile): TreeNode[] => {
  const [head, ...rest] = segments
  const existing = nodes.find((node) => node.name === head)

  if (rest.length === 0) {
    return existing ? nodes : [...nodes, { name: head, note: file.note, highlight: file.highlight }]
  }

  const folder: TreeNode = existing ?? { name: head, children: [] }
  const updated: TreeNode = { ...folder, children: insert(folder.children ?? [], rest, file) }
  return existing ? nodes.map((node) => (node === existing ? updated : node)) : [...nodes, updated]
}

export const buildTree = (files: ProjectFile[]): TreeNode[] => sortTree(files.reduce<TreeNode[]>((nodes, file) => insert(nodes, file.path.split("/"), file), []))

export const getArchitectureLayout = (config: GeneratorConfig) => {
  const namer = createNamer(config.naming)
  const layout = buildLayout(config.architecture as BackendArchitecture, namer)
  return { ...layout, files: withTests(layout, config, namer) }
}

export const renderTree = (nodes: TreeNode[], prefix = ""): string[] =>
  nodes.flatMap((node, index) => {
    const isLast = index === nodes.length - 1
    const label = `${prefix}${isLast ? "└── " : "├── "}${node.name}${node.children ? "/" : ""}${node.note ? `  # ${node.note}` : ""}`
    return node.children ? [label, ...renderTree(node.children, `${prefix}${isLast ? "    " : "│   "}`)] : [label]
  })

export const getProjectFiles = (config: GeneratorConfig): ProjectFile[] => (config.projectType === "frontend" ? getFrontendLayout(config).files : getArchitectureLayout(config).files)
