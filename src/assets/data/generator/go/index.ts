import type { ChoiceOption, CommentsPolicy, GoArchitecture, GoConfig, GoDatabase, GoErrorHandling, GoFileCase, GoFramework, GoLogger, GoTesting, GoValidation } from "@utils/types/generator"
import type { GoArchitectureInfo, GoIdiom, GoPrincipleInfo } from "@utils/types/go"

export const goDefaults: GoConfig = {
  framework: "chi",
  database: "pgx",
  architecture: "goStandard",
  errorHandling: "wrapped",
  validation: "validator",
  testing: "stdlib",
  logger: "slog",
  fileCase: "snake",
  image: "golang:1.23-alpine",
  principles: ["earlyReturn", "wrapErrors", "contextFirst", "noPanic", "acceptInterfaces", "noGlobalState", "closeResources", "structuredLogs", "tableTests"]
}

export const goModule = "app"

export const goFrameworkOptions: ChoiceOption<GoFramework>[] = [
  { value: "nethttp", label: "net/http", description: "Só a biblioteca padrão, com o roteador do Go 1.22 (método e parâmetros na rota).", example: "mux.HandleFunc(\"GET /users/{id}\", h.getUserByID)" },
  { value: "chi", label: "chi", description: "Roteador leve e 100% compatível com net/http, com middlewares em cadeia.", example: "r.Get(\"/users/{id}\", h.getUserByID)" },
  { value: "gin", label: "Gin", description: "O mais popular, com binding, validação e contexto próprio.", example: "router.GET(\"/users/:id\", h.getUserByID)" },
  { value: "echo", label: "Echo", description: "Minimalista, com handlers que retornam error.", example: "e.GET(\"/users/:id\", h.getUserByID)" },
  { value: "fiber", label: "Fiber", description: "Inspirado no Express, sobre fasthttp, para alto throughput.", example: "app.Get(\"/users/:id\", h.getUserByID)" }
]

export const goDatabaseOptions: ChoiceOption<GoDatabase>[] = [
  { value: "pgx", label: "PostgreSQL + pgx", description: "Driver nativo e pool de conexões, com SQL escrito à mão.", example: "r.db.QueryRow(ctx, query, id).Scan(&user.ID)" },
  { value: "sqlc", label: "sqlc", description: "Código Go gerado a partir das queries SQL, com tipos checados.", example: "r.queries.GetUserByID(ctx, id)" },
  { value: "gorm", label: "GORM", description: "ORM com models, associações e migrations.", example: "r.db.WithContext(ctx).First(&user, \"id = ?\", id)" },
  { value: "mongo", label: "MongoDB", description: "Driver oficial com documentos e bson.", example: "r.collection.FindOne(ctx, bson.M{\"_id\": id})" },
  { value: "none", label: "Sem banco", description: "Serviço sem persistência própria." }
]

export const goArchitectureOrder: GoArchitecture[] = ["goStandard", "goLayered", "goClean", "goHexagonal"]

export const goArchitectureInfo: Record<GoArchitecture, GoArchitectureInfo> = {
  goStandard: {
    label: "Pacotes por domínio (cmd + internal)",
    summary: "O layout mais comum em Go: `cmd/api` sobe o servidor e cada domínio é um pacote em `internal` com handler, service, repository e o tipo do domínio.",
    whenToUse: "A maioria das APIs: simples de navegar, sem camadas artificiais e com o pacote como unidade de encapsulamento.",
    rules: [
      "`cmd/api/main.go` só lê a configuração, monta as dependências e sobe o servidor. Nenhuma regra de negócio ali.",
      "Cada domínio é um pacote em `internal/<dominio>` com `handler.go`, `service.go`, `repository.go` e o arquivo do tipo (`user.go`).",
      "O service declara a interface do repositório que consome. O pacote exporta só o que outros pacotes usam.",
      "Código compartilhado de infraestrutura fica em `internal/platform` (banco, HTTP, logs). Nada de pacotes `utils` ou `common`.",
      "Um domínio nunca importa o repositório de outro: chama o service exportado dele."
    ]
  },
  goLayered: {
    label: "Camadas (handler, service, repository)",
    summary: "Pacotes por papel técnico: `handler` recebe a requisição, `service` tem a regra e `repository` acessa o banco. O tipo do domínio fica em `model`.",
    whenToUse: "Times vindos de outras stacks ou APIs pequenas com poucos domínios.",
    rules: [
      "Handlers só traduzem HTTP para chamadas de service e de volta para JSON.",
      "Regras de negócio ficam apenas em `internal/service`.",
      "Somente `internal/repository` fala com o banco de dados.",
      "O fluxo é handler → service → repository. O service depende de uma interface, nunca da implementação."
    ]
  },
  goClean: {
    label: "Clean Architecture",
    summary: "Domínio no centro (`internal/domain`), casos de uso em volta (`internal/usecase`) e infraestrutura na borda (`internal/infra` e `internal/delivery`).",
    whenToUse: "Domínios com regras ricas que precisam ser testadas sem banco nem framework.",
    rules: [
      "`domain` não importa nenhum outro pacote do projeto. Ali ficam os tipos, os erros e as interfaces de repositório.",
      "Cada caso de uso é um tipo com um único método público `Execute`.",
      "As implementações dos repositórios ficam em `internal/infra` e satisfazem as interfaces do domínio.",
      "Frameworks HTTP e drivers de banco só aparecem em `infra`, `delivery` e `cmd`."
    ]
  },
  goHexagonal: {
    label: "Hexagonal",
    summary: "Ports & Adapters: o `core` define portas (interfaces) e os adaptadores de entrada e saída ficam em `internal/adapters`.",
    whenToUse: "Sistemas com várias entradas (HTTP, filas, CLI) ou integrações que mudam com frequência.",
    rules: [
      "O `core` não conhece HTTP, banco nem SDKs externos.",
      "Toda dependência externa é uma porta em `core/ports` e um adaptador em `adapters`.",
      "Entradas (HTTP, filas, cron) são adaptadores que chamam os services do core.",
      "Adaptadores podem ser trocados sem alterar o core."
    ]
  }
}

export const goErrorHandlingOptions: ChoiceOption<GoErrorHandling>[] = [
  { value: "wrapped", label: "Erros sentinela com contexto", description: "Erros sentinela (`ErrUserNotFound`) embrulhados com `fmt.Errorf(\"...: %w\", err)` a cada camada e checados com `errors.Is`.", example: "return nil, fmt.Errorf(\"find user %s: %w\", id, err)" },
  { value: "sentinel", label: "Erros sentinela", description: "Variáveis `ErrXxx` declaradas no pacote e retornadas sem embrulhar.", example: "if errors.Is(err, user.ErrUserNotFound) { ... }" },
  { value: "typed", label: "Tipos de erro", description: "Structs que implementam `error`, com dados do erro, checados com `errors.As`.", example: "var notFound *NotFoundError\nif errors.As(err, &notFound) { ... }" }
]

export const goValidationOptions: ChoiceOption<GoValidation>[] = [
  { value: "validator", label: "go-playground/validator", description: "Regras nas tags das structs, validadas por uma instância única.", example: "Name string `json:\"name\" validate:\"required,max=120\"`" },
  { value: "ozzo", label: "ozzo-validation", description: "Regras em código, num método `Validate()` de cada input.", example: "validation.Field(&in.Name, validation.Required, validation.Length(1, 120))" },
  { value: "manual", label: "Manual", description: "Validação escrita à mão num método `Validate() error`." }
]

export const goLoggerOptions: ChoiceOption<GoLogger>[] = [
  { value: "slog", label: "log/slog", description: "Logger estruturado da biblioteca padrão, com contexto.", example: "logger.ErrorContext(ctx, \"get user\", \"error\", err)" },
  { value: "zap", label: "zap", description: "Logger estruturado de alta performance da Uber.", example: "logger.Error(\"get user\", zap.Error(err))" },
  { value: "zerolog", label: "zerolog", description: "Logs em JSON sem alocação, com API encadeada.", example: "logger.Error().Err(err).Msg(\"get user\")" }
]

export const goTestingOptions: ChoiceOption<GoTesting>[] = [
  { value: "stdlib", label: "testing", description: "Só a biblioteca padrão, com testes de tabela e `t.Run`.", example: "if !errors.Is(err, tt.wantErr) {\n\tt.Fatalf(\"got %v, want %v\", err, tt.wantErr)\n}" },
  { value: "testify", label: "testify", description: "`require` e `assert` sobre a biblioteca padrão.", example: "require.ErrorIs(t, err, tt.wantErr)" },
  { value: "none", label: "Sem testes", description: "A skill não vai exigir testes." }
]

export const goCommentsOptions: ChoiceOption<CommentsPolicy>[] = [
  { value: "none", label: "Zero comentários", description: "O código precisa ser autoexplicativo. Nomes e tipos contam a história.", example: "func (s *Service) GetUserByID(ctx context.Context, id string) (*User, error)" },
  { value: "publicOnly", label: "godoc em tudo que é exportado", description: "Todo identificador exportado tem um comentário que começa pelo nome dele.", example: "// GetUserByID busca um usuário pelo id.\nfunc (s *Service) GetUserByID(ctx context.Context, id string) (*User, error)" },
  { value: "allowed", label: "Livre", description: "godoc nos exportados e comentários quando ajudam a explicar o porquê.", example: "// O provedor limita a 10 req/s." }
]

export const goFileCaseOptions: { value: GoFileCase; label: string; example: string }[] = [
  { value: "snake", label: "snake_case", example: "user_handler.go" },
  { value: "flat", label: "minúsculas juntas", example: "userhandler.go" }
]

export const goPrincipleOptions: GoPrincipleInfo[] = [
  { value: "earlyReturn", label: "Retornos antecipados", description: "Trate o erro e saia cedo. O caminho feliz fica sem indentação.", good: "user, err := s.repository.FindByID(ctx, id)\nif err != nil {\n\treturn nil, err\n}\nreturn user, nil", bad: "if err == nil {\n\treturn user, nil\n} else {\n\treturn nil, err\n}" },
  { value: "wrapErrors", label: "Erros com contexto", description: "Nunca ignore um erro. Ao repassar, embrulhe com `%w` dizendo o que falhou.", good: "if err != nil {\n\treturn fmt.Errorf(\"save user %s: %w\", id, err)\n}", bad: "_ = repository.Save(ctx, user)" },
  { value: "contextFirst", label: "context.Context primeiro", description: "Toda função que faz I/O recebe `ctx context.Context` como primeiro parâmetro e o repassa.", good: "func (s *Service) GetUserByID(ctx context.Context, id string) (*User, error)", bad: "func (s *Service) GetUserByID(id string) (*User, error)" },
  { value: "noPanic", label: "Sem panic no fluxo normal", description: "`panic` só para erro de programação na inicialização. O resto retorna `error`.", good: "if err != nil {\n\treturn nil, fmt.Errorf(\"parse config: %w\", err)\n}", bad: "if err != nil {\n\tpanic(err)\n}" },
  { value: "acceptInterfaces", label: "Aceite interfaces, retorne structs", description: "Dependências entram como interfaces pequenas, definidas por quem consome. Construtores retornam o tipo concreto.", good: "type Repository interface {\n\tFindByID(ctx context.Context, id string) (*User, error)\n}\n\nfunc NewService(repository Repository) *Service", bad: "func NewService(repository *PostgresRepository) Servicer" },
  { value: "noGlobalState", label: "Sem estado global", description: "Nada de variáveis globais mutáveis nem `init()` com efeitos. Dependências são injetadas pelo construtor em `main`.", good: "service := user.NewService(user.NewPostgresRepository(pool))", bad: "var DB *pgxpool.Pool\n\nfunc init() { DB = connect() }" },
  { value: "closeResources", label: "Recursos sempre fechados", description: "Logo depois de abrir, `defer` fecha: rows, bodies, arquivos e conexões.", good: "rows, err := r.db.Query(ctx, query)\nif err != nil {\n\treturn nil, err\n}\ndefer rows.Close()" },
  { value: "structuredLogs", label: "Logs estruturados", description: "Logs com chave e valor, sem `fmt.Println` nem `log.Printf` no código da aplicação.", good: "logger.ErrorContext(ctx, \"get user\", \"user_id\", id, \"error\", err)", bad: "fmt.Println(\"erro ao buscar usuário\", err)" },
  { value: "tableTests", label: "Testes de tabela", description: "Casos de teste numa tabela com `t.Run` para cada um, nomeados pelo comportamento.", good: "for _, tt := range tests {\n\tt.Run(tt.name, func(t *testing.T) {\n\t\t...\n\t})\n}" },
  { value: "leanResponses", label: "Respostas enxutas", description: "Sem mensagens redundantes nem eco do payload. O status HTTP já informa o resultado.", good: "writeJSON(w, http.StatusCreated, map[string]string{\"id\": user.ID})", bad: "writeJSON(w, http.StatusCreated, map[string]any{\"message\": \"Criado com sucesso\", \"user\": user})" }
]

export const goIdioms: GoIdiom[] = [
  { element: "Pacotes", standard: "minúsculas, uma palavra, sem `_`", example: "user, httpx" },
  { element: "Exportados", standard: "PascalCase", example: "GetUserByID" },
  { element: "Não exportados", standard: "camelCase", example: "findByID" },
  { element: "Siglas", standard: "sempre em maiúsculas", example: "userID, ServeHTTP, apiURL" },
  { element: "Construtores", standard: "prefixo New", example: "NewService" },
  { element: "Interfaces", standard: "papel ou verbo com -er", example: "Repository, Finder" },
  { element: "Erros sentinela", standard: "prefixo Err", example: "ErrUserNotFound" },
  { element: "Tipos de erro", standard: "sufixo Error", example: "NotFoundError" },
  { element: "Receivers", standard: "1 ou 2 letras, sempre iguais", example: "func (s *Service)" },
  { element: "Getters", standard: "sem prefixo Get", example: "user.Name()" },
  { element: "Constantes", standard: "MixedCaps, não SCREAMING", example: "MaxNameLength" },
  { element: "Testes", standard: "Test + tipo + método", example: "TestServiceGetUserByID" }
]
