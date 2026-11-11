import { createNamer } from "@utils/functions/generator/namer"
import { toCase } from "@utils/functions/generator/naming"
import { words } from "@assets/data/generator/vocabulary"
import { goModule } from "@assets/data/generator/go"

import type { GoInterfaceHome, GoLayout, GoNamer, GoUnit } from "@utils/types/go"
import type { TermRef, VocabularyKey } from "@utils/types/namer"
import type { GeneratorConfig } from "@utils/types/generator"
import type { ProjectFile } from "@utils/types/architecture"
import type { SampleFile } from "@utils/types/codeSample"

const initialisms = ["id", "url", "http", "api", "json", "sql", "uuid", "html", "ip", "db"]

const capitalize = (word: string) => (initialisms.includes(word) ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1))

export const createGoNamer = (config: GeneratorConfig): GoNamer => {
  const get = (key: TermRef) => (Array.isArray(key) ? key : [key]).flatMap((item) => words(item, config.naming.language)).map((word) => word.toLowerCase())
  return {
    exported: (key) => get(key).map(capitalize).join(""),
    unexported: (key) => get(key).map((word, index) => (index === 0 ? word : capitalize(word))).join(""),
    pkg: (key) => get(key).join(""),
    file: (key) => `${get(key).join(config.go.fileCase === "snake" ? "_" : "")}.go`,
    errVar: (key) => `Err${get(key).map(capitalize).join("")}`
  }
}

const join = (...parts: string[]) => parts.filter(Boolean).join("/")

const unit = (path: string, pkg: string): GoUnit => ({ path, pkg, importPath: join(goModule, path.split("/").slice(0, -1).join("/")) })

const repositoryKey = (config: GeneratorConfig): VocabularyKey => {
  if (config.go.database === "mongo") return "mongoRepository"
  if (config.go.database === "none") return "memoryRepository"
  if (config.go.database === "gorm") return "gormRepository"
  if (config.go.database === "sqlc") return "sqlcRepository"
  return "postgresRepository"
}

const driverFolder = (config: GeneratorConfig) => ({ pgx: "postgres", sqlc: "postgres", gorm: "postgres", mongo: "mongodb", none: "memory" })[config.go.database]

const platformFiles = (config: GeneratorConfig): ProjectFile[] => [
  { path: "go.mod", note: `module ${goModule}` },
  { path: "cmd/api/main.go", note: "monta as dependências e sobe o servidor" },
  { path: "internal/config/config.go", note: "variáveis de ambiente" },
  ...(config.go.framework === "nethttp" || config.go.framework === "chi" ? [{ path: "internal/platform/httpx/respond.go", note: "JSON e erros HTTP" }] : []),
  ...(config.go.database === "none" ? [] : [{ path: `internal/platform/database/${config.go.database === "mongo" ? "mongo.go" : "postgres.go"}`, note: "conexão" }]),
  ...(config.go.database === "sqlc" ? [{ path: "sqlc.yaml" }, { path: "internal/platform/database/queries/users.sql", note: "queries do sqlc" }, { path: "internal/platform/database/sqlc/users.sql.go", note: "gerado" }] : []),
  ...(config.go.database === "pgx" || config.go.database === "sqlc" ? [{ path: "migrations/0001_create_users.sql" }] : [])
]

const testFile = (path: string) => path.replace(/\.go$/, "_test.go")

export const getGoLayout = (config: GeneratorConfig): GoLayout => {
  const g = createGoNamer(config)
  const domainPkg = g.pkg("user")
  const repoKey = repositoryKey(config)
  const hasTests = config.go.testing !== "none"

  const build = (): Omit<GoLayout, "files"> & { extra: ProjectFile[] } => {
    switch (config.go.architecture) {
      case "goLayered": {
        const model = unit(join("internal", "model", g.file("user")), "model")
        return {
          model,
          service: unit(join("internal", "service", g.file(["user", "service"])), "service"),
          repository: unit(join("internal", "repository", g.file(["user", "repository"])), "repository"),
          handler: unit(join("internal", "handler", g.file(["user", "handler"])), "handler"),
          interfaceHome: "service",
          serviceType: g.exported("userService"),
          serviceMethod: g.exported("getUserById"),
          serviceConstructor: `New${g.exported("userService")}`,
          repositoryInterface: g.exported("userRepository"),
          repositoryType: g.exported(["user", repoKey]),
          handlerType: g.exported("userHandler"),
          extra: []
        }
      }
      case "goClean": {
        const driver = driverFolder(config)
        return {
          model: unit(join("internal", "domain", g.file("user")), "domain"),
          service: unit(join("internal", "usecase", g.file("getUserById")), "usecase"),
          repository: unit(join("internal", "infra", driver, g.file(["user", "repository"])), driver),
          handler: unit(join("internal", "delivery", "rest", g.file(["user", "handler"])), "rest"),
          interfaceHome: "domain",
          serviceType: g.exported("getUserById"),
          serviceMethod: g.exported("execute"),
          serviceConstructor: `New${g.exported("getUserById")}`,
          repositoryInterface: g.exported("userRepository"),
          repositoryType: g.exported("userRepository"),
          handlerType: g.exported("userHandler"),
          extra: []
        }
      }
      case "goHexagonal": {
        const driver = driverFolder(config)
        return {
          model: unit(join("internal", "core", "domain", g.file("user")), "domain"),
          ports: unit(join("internal", "core", "ports", g.file(["user", "repository"])), "ports"),
          service: unit(join("internal", "core", "services", g.file(["user", "service"])), "services"),
          repository: unit(join("internal", "adapters", driver, g.file(["user", "repository"])), driver),
          handler: unit(join("internal", "adapters", "rest", g.file(["user", "handler"])), "rest"),
          interfaceHome: "ports",
          serviceType: g.exported("userService"),
          serviceMethod: g.exported("getUserById"),
          serviceConstructor: `New${g.exported("userService")}`,
          repositoryInterface: g.exported("userRepository"),
          repositoryType: g.exported("userRepository"),
          handlerType: g.exported("userHandler"),
          extra: []
        }
      }
      case "goStandard":
      default: {
        const folder = join("internal", domainPkg)
        return {
          model: unit(join(folder, g.file("user")), domainPkg),
          service: unit(join(folder, g.file("service")), domainPkg),
          repository: unit(join(folder, g.file("repository")), domainPkg),
          handler: unit(join(folder, g.file("handler")), domainPkg),
          interfaceHome: "service",
          serviceType: g.exported("service"),
          serviceMethod: g.exported("getUserById"),
          serviceConstructor: `New${g.exported("service")}`,
          repositoryInterface: g.exported("repository"),
          repositoryType: g.exported(repoKey),
          handlerType: g.exported("handler"),
          extra: []
        }
      }
    }
  }

  const { extra, ...layout } = build()
  const files: ProjectFile[] = [
    ...platformFiles(config),
    { path: layout.model.path, note: "tipo do domínio e erros" },
    ...(layout.ports ? [{ path: layout.ports.path, note: "porta (interface)" }] : []),
    { path: layout.service.path, note: layout.interfaceHome === "domain" ? "caso de uso" : "regra de negócio", isHighlighted: true },
    { path: layout.repository.path, note: "acesso ao banco" },
    { path: layout.handler.path, note: "HTTP" },
    ...(hasTests ? [{ path: testFile(layout.service.path), note: "teste" }] : []),
    ...extra
  ]
  return { ...layout, files }
}

const importBlock = (standard: string[], external: string[], internal: string[]) => {
  const groups = [standard, external, internal].map((group) => [...new Set(group)].sort()).filter((group) => group.length)
  const total = groups.flat().length
  if (total === 0) return ""
  if (total === 1) return `import "${groups.flat()[0]}"\n\n`
  return `import (\n${groups.map((group) => group.map((path) => `\t"${path}"`).join("\n")).join("\n\n")}\n)\n\n`
}

const alignStruct = (fields: [string, string, string?][]) => {
  const nameWidth = Math.max(...fields.map(([name]) => name.length))
  const typeWidth = Math.max(...fields.filter(([, , tag]) => tag).map(([, type]) => type.length), 0)
  return fields.map(([name, type, tag]) => `\t${name.padEnd(nameWidth)} ${tag ? `${type.padEnd(typeWidth)} ${tag}` : type}`).join("\n")
}

const qualifier = (from: GoUnit, to: GoUnit) => (from.pkg === to.pkg ? "" : `${to.pkg}.`)

const internalImport = (from: GoUnit, to: GoUnit) => (from.pkg === to.pkg ? [] : [to.importPath])

const docComment = (config: GeneratorConfig, name: string, pt: string, en: string, indent = "") => {
  if (config.conventions.comments === "none") return ""
  return `${indent}// ${name} ${config.conventions.commentsLanguage === "pt" ? pt : en}\n`
}

const isPt = (config: GeneratorConfig) => config.naming.language === "pt"

const notFoundValue = (config: GeneratorConfig, g: GoNamer, prefix: string, idVar: string) =>
  config.go.errorHandling === "typed" ? `&${prefix}${g.exported("notFoundError")}{${g.exported("resource")}: "${isPt(config) ? "usuario" : "user"}", ID: ${idVar}}` : `${prefix}${g.errVar("userNotFound")}`

const notFoundCheck = (config: GeneratorConfig, g: GoNamer, prefix: string) =>
  config.go.errorHandling === "typed" ? `var notFound *${prefix}${g.exported("notFoundError")}\n\tif errors.As(err, &notFound) {` : `if errors.Is(err, ${prefix}${g.errVar("userNotFound")}) {`

const buildModelFile = (config: GeneratorConfig, g: GoNamer, layout: GoLayout): SampleFile => {
  const n = createNamer(config.naming)
  const user = g.exported("user")
  const maxName = g.exported("maxNameLength")
  const tagKey = config.go.database === "mongo" ? "bson" : config.go.database === "gorm" ? "gorm" : "db"
  const columnTag = (column: string, isId: boolean) => {
    if (config.go.database === "none") return ""
    if (tagKey === "bson") return ` bson:"${isId ? "_id" : column}"`
    if (tagKey === "gorm") return isId ? " gorm:\"primaryKey\"" : ` gorm:"column:${column}"`
    return ` db:"${column}"`
  }
  const jsonName = (key: TermRef) => toCase((Array.isArray(key) ? key : [key]).flatMap((item) => words(item, config.naming.language)), "camel")
  const validateTag = config.go.validation === "validator" ? " validate:\"required,max=120\"" : ""
  const fields: [string, string, string?][] = [
    ["ID", "string", `\`json:"id"${columnTag("id", true)}\``],
    [g.exported("userName"), "string", `\`json:"${jsonName("userName")}"${columnTag(n.column("userName"), false)}${validateTag}\``],
    [g.exported("isActive"), "bool", `\`json:"${jsonName("isActive")}"${columnTag(n.column("isActive"), false)}\``]
  ]
  const errorText = isPt(config) ? "usuário não encontrado" : "user not found"
  const notFoundType = g.exported("notFoundError")
  const resource = g.exported("resource")
  const errors =
    config.go.errorHandling === "typed"
      ? `type ${notFoundType} struct {\n${alignStruct([[resource, "string"], ["ID", "string"]])}\n}\n\nfunc (e *${notFoundType}) Error() string {\n\treturn fmt.Sprintf("%s %s ${isPt(config) ? "não encontrado" : "not found"}", e.${resource}, e.ID)\n}`
      : `var ${g.errVar("userNotFound")} = errors.New("${errorText}")`
  const nameField = g.exported("userName")
  const validate = (() => {
    if (config.go.validation === "ozzo") return `\n\nfunc (u ${user}) Validate() error {\n\treturn validation.ValidateStruct(&u,\n\t\tvalidation.Field(&u.${nameField}, validation.Required, validation.Length(1, ${maxName})),\n\t)\n}`
    if (config.go.validation === "manual")
      return `\n\nfunc (u ${user}) Validate() error {\n\tif strings.TrimSpace(u.${nameField}) == "" {\n\t\treturn errors.New("${isPt(config) ? "nome é obrigatório" : "name is required"}")\n\t}\n\tif len(u.${nameField}) > ${maxName} {\n\t\treturn fmt.Errorf("${isPt(config) ? "nome deve ter no máximo %d caracteres" : "name must have at most %d characters"}", ${maxName})\n\t}\n\treturn nil\n}`
    return ""
  })()
  const standard = [
    ...(config.go.errorHandling === "typed" ? ["fmt"] : ["errors"]),
    ...(config.go.validation === "manual" ? ["errors", "fmt", "strings"] : [])
  ]
  const external = config.go.validation === "ozzo" ? ["github.com/go-ozzo/ozzo-validation/v4"] : []
  const header = importBlock(standard, external, []).replace("\t\"github.com/go-ozzo/ozzo-validation/v4\"", "\tvalidation \"github.com/go-ozzo/ozzo-validation/v4\"")
  const body = `package ${layout.model.pkg}\n\n${header}const ${maxName} = 120\n\n${errors}\n\n${docComment(config, user, "é um usuário da plataforma.", "is a platform user.")}type ${user} struct {\n${alignStruct(fields)}\n}${validate}\n`
  return { path: layout.model.path, code: body }
}

const contextParam = (_config: GeneratorConfig) => "ctx context.Context"

const buildPortsFile = (config: GeneratorConfig, g: GoNamer, layout: GoLayout): SampleFile | undefined => {
  if (!layout.ports) return undefined
  const user = `${qualifier(layout.ports, layout.model)}${g.exported("user")}`
  const body = `package ${layout.ports.pkg}\n\n${importBlock(["context"], [], internalImport(layout.ports, layout.model))}${docComment(config, layout.repositoryInterface, "é a porta de saída para os dados de usuários.", "is the outbound port for user data.")}type ${layout.repositoryInterface} interface {\n\t${g.exported("findById")}(${contextParam(config)}, id string) (*${user}, error)\n}\n`
  return { path: layout.ports.path, code: body }
}

const interfaceUnit = (layout: GoLayout) => (layout.interfaceHome === "ports" && layout.ports ? layout.ports : layout.interfaceHome === "domain" ? layout.model : layout.service)

const buildServiceFile = (config: GeneratorConfig, g: GoNamer, layout: GoLayout): SampleFile => {
  const modelPrefix = qualifier(layout.service, layout.model)
  const user = `${modelPrefix}${g.exported("user")}`
  const iface = interfaceUnit(layout)
  const repoInterface = `${qualifier(layout.service, iface)}${layout.repositoryInterface}`
  const repoField = g.unexported("repository")
  const receiver = layout.serviceType.charAt(0).toLowerCase()
  const userVar = g.unexported("user")
  const isWrapped = config.go.errorHandling === "wrapped"
  const interfaceBlock =
    layout.interfaceHome === "service"
      ? `${docComment(config, layout.repositoryInterface, "é o acesso a dados que o service precisa.", "is the data access the service needs.")}type ${layout.repositoryInterface} interface {\n\t${g.exported("findById")}(${contextParam(config)}, id string) (*${user}, error)\n}\n\n`
      : ""
  const failure = isWrapped ? `fmt.Errorf("${isPt(config) ? "buscar usuário" : "get user"} %s: %w", id, err)` : "err"
  const body = `package ${layout.service.pkg}

${importBlock(["context", ...(isWrapped ? ["fmt"] : [])], [], [...internalImport(layout.service, layout.model), ...(iface.pkg !== layout.model.pkg ? internalImport(layout.service, iface) : [])])}${interfaceBlock}type ${layout.serviceType} struct {
\t${repoField} ${repoInterface}
}

func ${layout.serviceConstructor}(${repoField} ${repoInterface}) *${layout.serviceType} {
\treturn &${layout.serviceType}{${repoField}: ${repoField}}
}

${docComment(config, layout.serviceMethod, "busca um usuário pelo id.", "finds a user by id.")}func (${receiver} *${layout.serviceType}) ${layout.serviceMethod}(${contextParam(config)}, id string) (*${user}, error) {
\t${userVar}, err := ${receiver}.${repoField}.${g.exported("findById")}(ctx, id)
\tif err != nil {
\t\treturn nil, ${failure}
\t}
\treturn ${userVar}, nil
}
`
  return { path: layout.service.path, code: body }
}

const buildDomainInterface = (config: GeneratorConfig, g: GoNamer, layout: GoLayout, model: SampleFile): SampleFile => {
  if (layout.interfaceHome !== "domain") return model
  const user = g.exported("user")
  const block = `\n${docComment(config, layout.repositoryInterface, "é o contrato de acesso aos usuários.", "is the contract for user data access.")}type ${layout.repositoryInterface} interface {\n\t${g.exported("findById")}(${contextParam(config)}, id string) (*${user}, error)\n}\n`
  const withContext = model.code.includes("import (") ? model.code.replace("import (\n", "import (\n\t\"context\"\n") : model.code.replace(/^import "(\w+)"\n/m, "import (\n\t\"context\"\n\t\"$1\"\n)\n")
  return { ...model, code: `${withContext}${block}` }
}

const buildRepositoryFile = (config: GeneratorConfig, g: GoNamer, layout: GoLayout): SampleFile => {
  const n = createNamer(config.naming)
  const modelPrefix = qualifier(layout.repository, layout.model)
  const user = `${modelPrefix}${g.exported("user")}`
  const type = layout.repositoryType
  const userVar = g.unexported("user")
  const notFound = notFoundValue(config, g, modelPrefix, "id")
  const internal = internalImport(layout.repository, layout.model)
  const method = g.exported("findById")
  const nameField = g.exported("userName")
  const activeField = g.exported("isActive")
  const lookup = (errCheck: string, call: string, fallback: string) =>
    `\terr := ${call}\n\tif ${errCheck} {\n\t\treturn nil, ${notFound}\n\t}\n\tif err != nil {\n\t\treturn nil, err\n\t}\n\treturn ${fallback}, nil`

  const variants = {
    pgx: {
      standard: ["context", "errors"],
      external: ["github.com/jackc/pgx/v5", "github.com/jackc/pgx/v5/pgxpool"],
      field: ["db", "*pgxpool.Pool"],
      body: `\tvar ${userVar} ${user}\n${lookup("errors.Is(err, pgx.ErrNoRows)", `r.db.QueryRow(ctx, "SELECT id, ${n.column("userName")}, ${n.column("isActive")} FROM ${n.table()} WHERE id = $1", id).Scan(&${userVar}.ID, &${userVar}.${nameField}, &${userVar}.${activeField})`, `&${userVar}`)}`
    },
    sqlc: {
      standard: ["context", "errors"],
      external: ["github.com/jackc/pgx/v5"],
      field: [g.unexported("queries"), "*sqlc.Queries"],
      body: `\trow, err := r.${g.unexported("queries")}.GetUserByID(ctx, id)\n\tif errors.Is(err, pgx.ErrNoRows) {\n\t\treturn nil, ${notFound}\n\t}\n\tif err != nil {\n\t\treturn nil, err\n\t}\n\treturn &${user}{ID: row.ID, ${nameField}: row.Name, ${activeField}: row.IsActive}, nil`
    },
    gorm: {
      standard: ["context", "errors"],
      external: ["gorm.io/gorm"],
      field: ["db", "*gorm.DB"],
      body: `\tvar ${userVar} ${user}\n${lookup("errors.Is(err, gorm.ErrRecordNotFound)", `r.db.WithContext(ctx).First(&${userVar}, "id = ?", id).Error`, `&${userVar}`)}`
    },
    mongo: {
      standard: ["context", "errors"],
      external: ["go.mongodb.org/mongo-driver/v2/bson", "go.mongodb.org/mongo-driver/v2/mongo"],
      field: [g.unexported("collection"), "*mongo.Collection"],
      body: `\tvar ${userVar} ${user}\n${lookup("errors.Is(err, mongo.ErrNoDocuments)", `r.${g.unexported("collection")}.FindOne(ctx, bson.M{"_id": id}).Decode(&${userVar})`, `&${userVar}`)}`
    },
    none: {
      standard: ["context", "sync"],
      external: [],
      field: ["", ""],
      body: `\tr.mu.RLock()\n\tdefer r.mu.RUnlock()\n\t${userVar}, ok := r.${g.unexported("users")}[id]\n\tif !ok {\n\t\treturn nil, ${notFound}\n\t}\n\treturn &${userVar}, nil`
    }
  }
  const variant = variants[config.go.database]
  const isMemory = config.go.database === "none"
  const internalSqlc = config.go.database === "sqlc" ? [`${goModule}/internal/platform/database/sqlc`] : []
  const fields: [string, string][] = isMemory ? [["mu", "sync.RWMutex"], [g.unexported("users"), `map[string]${user}`]] : [[variant.field[0], variant.field[1]]]
  const constructorParams = isMemory ? "" : `${variant.field[0]} ${variant.field[1]}`
  const constructorBody = isMemory ? `&${type}{${g.unexported("users")}: make(map[string]${user})}` : `&${type}{${variant.field[0]}: ${variant.field[0]}}`
  const ctxName = isMemory ? "_ context.Context" : "ctx context.Context"
  const body = `package ${layout.repository.pkg}

${importBlock(variant.standard, variant.external, [...internal, ...internalSqlc])}type ${type} struct {
${alignStruct(fields)}
}

func New${type}(${constructorParams}) *${type} {
\treturn ${constructorBody}
}

func (r *${type}) ${method}(${ctxName}, id string) (*${user}, error) {
${variant.body}
}
`
  return { path: layout.repository.path, code: body }
}

const routeFor = (config: GeneratorConfig, style: "braces" | "colon") => {
  const n = createNamer(config.naming)
  const param = style === "braces" ? "{id}" : ":id"
  const details = isPt(config) ? "detalhes" : "details"
  return config.conventions.routeStyle === "actionInPath" ? `/${n.folder("users")}/${param}/${details}` : `/${n.folder("users")}/${param}`
}

const loggerSpec = (config: GeneratorConfig) =>
  ({
    slog: { type: "*slog.Logger", standard: ["log/slog"], external: [], call: (message: string) => `h.logger.ErrorContext(ctx, "${message}", "error", err)` },
    zap: { type: "*zap.Logger", standard: [], external: ["go.uber.org/zap"], call: (message: string) => `h.logger.Error("${message}", zap.Error(err))` },
    zerolog: { type: "zerolog.Logger", standard: [], external: ["github.com/rs/zerolog"], call: (message: string) => `h.logger.Error().Err(err).Msg("${message}")` }
  })[config.go.logger]

const buildHandlerFile = (config: GeneratorConfig, g: GoNamer, layout: GoLayout): SampleFile => {
  const n = createNamer(config.naming)
  const modelPrefix = qualifier(layout.handler, layout.model)
  const servicePrefix = qualifier(layout.handler, layout.service)
  const serviceField = g.unexported("service")
  const userVar = g.unexported("user")
  const logger = loggerSpec(config)
  const notFoundCode = n.errorCode("userNotFound")
  const internalCode = toCase(["internal", "error"], config.naming.errorCodes)
  const message = isPt(config) ? "buscar usuário" : "get user"
  const check = notFoundCheck(config, g, modelPrefix)
  const call = `h.${serviceField}.${layout.serviceMethod}`
  const type = layout.handlerType
  const handlerName = g.unexported("getUserById")
  const fields = alignStruct([[serviceField, `*${servicePrefix}${layout.serviceType}`], ["logger", logger.type]])
  const constructor = `func New${type}(${serviceField} *${servicePrefix}${layout.serviceType}, logger ${logger.type}) *${type} {\n\treturn &${type}{${serviceField}: ${serviceField}, logger: logger}\n}`
  const internal = [...internalImport(layout.handler, layout.model), ...internalImport(layout.handler, layout.service)]

  const frameworks = {
    nethttp: {
      standard: ["errors", "net/http"],
      external: [],
      internal: [`${goModule}/internal/platform/httpx`],
      register: `func (h *${type}) ${g.exported("register")}(mux *http.ServeMux) {\n\tmux.HandleFunc("GET ${routeFor(config, "braces")}", h.${handlerName})\n}`,
      handler: `func (h *${type}) ${handlerName}(w http.ResponseWriter, r *http.Request) {\n\tctx := r.Context()\n\t${userVar}, err := ${call}(ctx, r.PathValue("id"))\n\t${check}\n\t\thttpx.WriteError(w, http.StatusNotFound, "${notFoundCode}")\n\t\treturn\n\t}\n\tif err != nil {\n\t\t${logger.call(message)}\n\t\thttpx.WriteError(w, http.StatusInternalServerError, "${internalCode}")\n\t\treturn\n\t}\n\thttpx.WriteJSON(w, http.StatusOK, ${userVar})\n}`
    },
    chi: {
      standard: ["errors", "net/http"],
      external: ["github.com/go-chi/chi/v5"],
      internal: [`${goModule}/internal/platform/httpx`],
      register: `func (h *${type}) ${g.exported("register")}(router chi.Router) {\n\trouter.Get("${routeFor(config, "braces")}", h.${handlerName})\n}`,
      handler: `func (h *${type}) ${handlerName}(w http.ResponseWriter, r *http.Request) {\n\tctx := r.Context()\n\t${userVar}, err := ${call}(ctx, chi.URLParam(r, "id"))\n\t${check}\n\t\thttpx.WriteError(w, http.StatusNotFound, "${notFoundCode}")\n\t\treturn\n\t}\n\tif err != nil {\n\t\t${logger.call(message)}\n\t\thttpx.WriteError(w, http.StatusInternalServerError, "${internalCode}")\n\t\treturn\n\t}\n\thttpx.WriteJSON(w, http.StatusOK, ${userVar})\n}`
    },
    gin: {
      standard: ["errors", "net/http"],
      external: ["github.com/gin-gonic/gin"],
      internal: [],
      register: `func (h *${type}) ${g.exported("register")}(router gin.IRouter) {\n\trouter.GET("${routeFor(config, "colon")}", h.${handlerName})\n}`,
      handler: `func (h *${type}) ${handlerName}(c *gin.Context) {\n\tctx := c.Request.Context()\n\t${userVar}, err := ${call}(ctx, c.Param("id"))\n\t${check}\n\t\tc.JSON(http.StatusNotFound, gin.H{"code": "${notFoundCode}"})\n\t\treturn\n\t}\n\tif err != nil {\n\t\t${logger.call(message)}\n\t\tc.JSON(http.StatusInternalServerError, gin.H{"code": "${internalCode}"})\n\t\treturn\n\t}\n\tc.JSON(http.StatusOK, ${userVar})\n}`
    },
    echo: {
      standard: ["errors", "net/http"],
      external: ["github.com/labstack/echo/v4"],
      internal: [],
      register: `func (h *${type}) ${g.exported("register")}(router *echo.Group) {\n\trouter.GET("${routeFor(config, "colon")}", h.${handlerName})\n}`,
      handler: `func (h *${type}) ${handlerName}(c echo.Context) error {\n\tctx := c.Request().Context()\n\t${userVar}, err := ${call}(ctx, c.Param("id"))\n\t${check}\n\t\treturn c.JSON(http.StatusNotFound, map[string]string{"code": "${notFoundCode}"})\n\t}\n\tif err != nil {\n\t\t${logger.call(message)}\n\t\treturn c.JSON(http.StatusInternalServerError, map[string]string{"code": "${internalCode}"})\n\t}\n\treturn c.JSON(http.StatusOK, ${userVar})\n}`
    },
    fiber: {
      standard: ["errors"],
      external: ["github.com/gofiber/fiber/v2"],
      internal: [],
      register: `func (h *${type}) ${g.exported("register")}(router fiber.Router) {\n\trouter.Get("${routeFor(config, "colon")}", h.${handlerName})\n}`,
      handler: `func (h *${type}) ${handlerName}(c *fiber.Ctx) error {\n\tctx := c.UserContext()\n\t${userVar}, err := ${call}(ctx, c.Params("id"))\n\t${check}\n\t\treturn c.Status(fiber.StatusNotFound).JSON(fiber.Map{"code": "${notFoundCode}"})\n\t}\n\tif err != nil {\n\t\t${logger.call(message)}\n\t\treturn c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"code": "${internalCode}"})\n\t}\n\treturn c.JSON(${userVar})\n}`
    }
  }
  const framework = frameworks[config.go.framework]
  const body = `package ${layout.handler.pkg}

${importBlock([...framework.standard, ...logger.standard], [...framework.external, ...logger.external], [...internal, ...framework.internal])}type ${type} struct {
${fields}
}

${constructor}

${framework.register}

${framework.handler}
`
  return { path: layout.handler.path, code: body }
}

const buildTestFile = (config: GeneratorConfig, g: GoNamer, layout: GoLayout): SampleFile | undefined => {
  if (config.go.testing === "none") return undefined
  const modelPrefix = qualifier(layout.service, layout.model)
  const user = `${modelPrefix}${g.exported("user")}`
  const stub = g.unexported("stubRepository")
  const isTyped = config.go.errorHandling === "typed"
  const isTestify = config.go.testing === "testify"
  const pt = isPt(config)
  const notFound = notFoundValue(config, g, modelPrefix, "id")
  const sentinel = `${modelPrefix}${g.errVar("userNotFound")}`
  const notFoundType = `${modelPrefix}${g.exported("notFoundError")}`
  const testName = `Test${layout.serviceType}${layout.serviceMethod}`
  const table = isTyped
    ? alignStruct([["name", "string"], ["id", "string"], ["wantNotFound", "bool"]])
    : alignStruct([["name", "string"], ["id", "string"], ["wantErr", "error"]])
  const cases = isTyped
    ? `\t\t{name: "${pt ? "retorna o usuário" : "returns the user"}", id: "1"},\n\t\t{name: "${pt ? "falha quando o usuário não existe" : "fails when the user does not exist"}", id: "404", wantNotFound: true},`
    : `\t\t{name: "${pt ? "retorna o usuário" : "returns the user"}", id: "1"},\n\t\t{name: "${pt ? "falha quando o usuário não existe" : "fails when the user does not exist"}", id: "404", wantErr: ${sentinel}},`
  const assertion = (() => {
    if (isTyped && isTestify) return `\t\t\tvar notFound *${notFoundType}\n\t\t\trequire.Equal(t, tt.wantNotFound, errors.As(err, &notFound))`
    if (isTyped) return `\t\t\tvar notFound *${notFoundType}\n\t\t\tif errors.As(err, &notFound) != tt.wantNotFound {\n\t\t\t\tt.Fatalf("got error %v, want not found %v", err, tt.wantNotFound)\n\t\t\t}`
    if (isTestify) return "\t\t\trequire.ErrorIs(t, err, tt.wantErr)"
    return "\t\t\tif !errors.Is(err, tt.wantErr) {\n\t\t\t\tt.Fatalf(\"got error %v, want %v\", err, tt.wantErr)\n\t\t\t}"
  })()
  const standard = ["context", "testing", ...(isTyped || !isTestify ? ["errors"] : [])]
  const external = isTestify ? ["github.com/stretchr/testify/require"] : []
  const internal = internalImport(layout.service, layout.model)
  const serviceVar = g.unexported("service")
  const body = `package ${layout.service.pkg}

${importBlock(standard, external, internal)}type ${stub} struct{}

func (${stub}) ${g.exported("findById")}(_ context.Context, id string) (*${user}, error) {
\tif id == "404" {
\t\treturn nil, ${notFound}
\t}
\treturn &${user}{ID: id}, nil
}

func ${testName}(t *testing.T) {
\ttests := []struct {
${table.replaceAll("\n\t", "\n\t\t").replace(/^\t/, "\t\t")}
\t}{
${cases}
\t}

\tfor _, tt := range tests {
\t\tt.Run(tt.name, func(t *testing.T) {
\t\t\t${serviceVar} := ${layout.serviceConstructor}(${stub}{})

\t\t\t_, err := ${serviceVar}.${layout.serviceMethod}(context.Background(), tt.id)

${assertion}
\t\t})
\t}
}
`
  return { path: testFile(layout.service.path), code: body }
}

export const buildGoSampleFiles = (config: GeneratorConfig): SampleFile[] => {
  const g = createGoNamer(config)
  const layout = getGoLayout(config)
  const model = buildDomainInterface(config, g, layout, buildModelFile(config, g, layout))
  const ports = buildPortsFile(config, g, layout)
  const test = buildTestFile(config, g, layout)
  return [buildServiceFile(config, g, layout), model, ...(ports ? [ports] : []), buildRepositoryFile(config, g, layout), buildHandlerFile(config, g, layout), ...(test ? [test] : [])].map((file) => ({ ...file, code: file.code.trimEnd() }))
}

export const goInterfaceHomeLabel: Record<GoInterfaceHome, string> = { service: "no service que consome", domain: "no pacote domain", ports: "em core/ports" }
