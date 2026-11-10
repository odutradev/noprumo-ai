import type {
  ApiDocs,
  Architecture,
  ChoiceOption,
  CommentsPolicy,
  Database,
  EnabledProjectType,
  ErrorHandling,
  ExportStyle,
  Framework,
  FunctionStyle,
  ImportAlias,
  ImportOrder,
  Language,
  Paradigm,
  Principle,
  ProjectType,
  Quotes,
  RouteStyle,
  Semicolons,
  TestLocation,
  TestSuffix,
  Testing,
  Validation
} from '@/types/generator'

export const projectTypeOptions: ChoiceOption<ProjectType>[] = [
  { value: 'backend', label: 'Backend', description: 'APIs, serviços, workers e integrações rodando no servidor.', example: 'POST /users/create\n→ 201 { id }' },
  { value: 'frontend', label: 'Frontend', description: 'Aplicações web, dashboards, componentes e design system.', example: '<UserCard name="Ana" />' },
  { value: 'mobile', label: 'Mobile', description: 'Apps React Native, Expo ou nativos.', badge: 'Em breve', disabled: true },
  { value: 'fullstack', label: 'Fullstack', description: 'Monorepo com front e back compartilhando tipos.', badge: 'Em breve', disabled: true }
]

export const languageOptions: ChoiceOption<Language>[] = [
  { value: 'typescript', label: 'TypeScript', description: 'Tipagem estática, strict mode e tipos inferidos dos schemas.', example: 'const total: number = sum(values)' },
  { value: 'javascript', label: 'JavaScript', description: 'ESM puro, sem etapa de compilação.', badge: 'Em breve', disabled: true },
  { value: 'python', label: 'Python', description: 'FastAPI, Django ou Flask.', badge: 'Em breve', disabled: true },
  { value: 'go', label: 'Go', description: 'Serviços compilados e concorrentes.', badge: 'Em breve', disabled: true }
]

export const frameworkOptions: ChoiceOption<Framework>[] = [
  { value: 'express', label: 'Express', description: 'Minimalista e com o maior ecossistema de middlewares.', example: "app.use(express.json())" },
  { value: 'fastify', label: 'Fastify', description: 'Alta performance com schemas e plugins.', example: "app.register(userRoutes)" },
  { value: 'nestjs', label: 'NestJS', description: 'Opinativo, com módulos, decorators e injeção de dependência.', example: '@Controller(\'users\')' },
  { value: 'hono', label: 'Hono', description: 'Leve, roda em Node, Bun, Deno e edge.', example: "app.get('/health', (c) => c.json({ ok: true }))" }
]

export const databaseOptions: ChoiceOption<Database>[] = [
  { value: 'mongoose', label: 'MongoDB + Mongoose', description: 'Documentos com schemas e models.', example: 'new Schema({ name: String })' },
  { value: 'prisma', label: 'Prisma', description: 'ORM com schema declarativo e client tipado.', example: 'prisma.user.findUnique({ where: { id } })' },
  { value: 'drizzle', label: 'Drizzle', description: 'SQL tipado, leve e próximo do banco.', example: 'db.select().from(users)' },
  { value: 'typeorm', label: 'TypeORM', description: 'Entidades com decorators e repositórios.', example: '@Entity() class User {}' },
  { value: 'none', label: 'Sem banco', description: 'Serviço sem persistência própria.' }
]

export interface ArchitectureInfo {
  label: string
  summary: string
  whenToUse: string
  rules: string[]
  badge?: string
}

export const architectureInfo: Record<Architecture, ArchitectureInfo> = {
  domainActions: {
    label: 'Domínios + Actions',
    badge: 'Meu padrão',
    summary: 'Módulos por domínio em que cada endpoint é uma action autocontida (schemas, types e handler), com infraestrutura compartilhada nas pastas raiz.',
    whenToUse: 'APIs que crescem por funcionalidade e querem cada endpoint isolado, sem controllers e services monolíticos.',
    rules: [
      'Cada domínio vive em `src/domains/<dominio>` e exporta um `DomainModule` no `index.ts` (nome, actions e variáveis de ambiente).',
      'Cada funcionalidade em `actions/<funcionalidade>` tem exatamente três arquivos: `schemas.ts`, `types.ts` e `index.ts`.',
      'Endpoints são criados com a fábrica `defineAction`, que concentra método, rota, schemas, middlewares, documentação e handler.',
      'O acesso a dados fica em `repositories/<entidade>` com `model.ts`, `types.ts` e `index.ts`. A action nunca importa o model.',
      'Infraestrutura compartilhada fica nas pastas raiz (`factories`, `middlewares`, `database`, `storage`, `email`, `utils`, `config`).',
      'Um domínio nunca acessa models de outro domínio: importa o repositório exposto por ele.'
    ]
  },
  layered: {
    label: 'Camadas (MVC)',
    summary: 'Separação horizontal por papel técnico: controllers recebem a requisição, services têm a regra e repositories acessam o banco.',
    whenToUse: 'Projetos pequenos ou médios, times que estão começando ou CRUDs diretos.',
    rules: [
      'Controllers só traduzem HTTP para chamadas de service e de volta para HTTP.',
      'Regras de negócio ficam apenas nos services.',
      'Somente repositories falam com o banco de dados.',
      'O fluxo de dependência é controller → service → repository, nunca o inverso.'
    ]
  },
  clean: {
    label: 'Clean Architecture',
    summary: 'Camadas concêntricas: domínio no centro, casos de uso em volta e infraestrutura na borda. Dependências apontam sempre para dentro.',
    whenToUse: 'Domínios com regras ricas que precisam ser testadas sem banco nem framework.',
    rules: [
      '`domain` não importa nada de `application` nem de `infra`.',
      'Cada caso de uso é uma classe ou função com um único método público de execução.',
      'Repositórios são interfaces na aplicação e implementações na infra.',
      'Frameworks e bibliotecas externas ficam só em `infra` e `main`.'
    ]
  },
  hexagonal: {
    label: 'Hexagonal',
    summary: 'Ports & Adapters: o núcleo define portas (interfaces) e o mundo externo se conecta por adaptadores de entrada e saída.',
    whenToUse: 'Sistemas com várias entradas (HTTP, filas, CLI) ou integrações que mudam com frequência.',
    rules: [
      'O `core` não conhece HTTP, banco nem SDKs externos.',
      'Toda dependência externa é uma porta no core e um adaptador em `adapters/outbound`.',
      'Entradas (HTTP, filas, cron) são adaptadores em `adapters/inbound` que chamam serviços do core.',
      'Adaptadores podem ser trocados sem alterar o core.'
    ]
  },
  modular: {
    label: 'Modular por feature',
    summary: 'Cada módulo agrupa tudo de uma funcionalidade (rotas, regra, dados e schemas) em uma única pasta.',
    whenToUse: 'APIs que crescem por funcionalidade e times divididos por área do produto.',
    rules: [
      'Tudo de um módulo fica dentro de `modules/<modulo>`.',
      'Um módulo só importa outro pelo que ele expõe publicamente.',
      'Código realmente compartilhado vai para `shared`.',
      'Remover uma pasta de módulo remove a funcionalidade inteira.'
    ]
  },
  ddd: {
    label: 'DDD',
    summary: 'Bounded contexts com agregados, value objects e serviços de aplicação, modelando a linguagem do negócio.',
    whenToUse: 'Negócios complexos, com especialistas de domínio e regras que mudam com frequência.',
    rules: [
      'Cada bounded context tem sua própria pasta e seu próprio modelo.',
      'Agregados garantem as invariantes e só são alterados pela raiz.',
      'Value objects são imutáveis e validam a si mesmos.',
      'Contextos se comunicam por serviços de aplicação ou eventos, nunca pelos modelos internos.'
    ]
  },
  typeFolders: {
    label: 'Pastas por tipo',
    badge: 'Meu padrão',
    summary: 'A raiz de `src` separa o código pelo papel: actions de API, componentes, hooks, páginas, rotas, stores, estilos e utilitários.',
    whenToUse: 'Dashboards e SPAs em que componentes e hooks são reaproveitados por várias páginas.',
    rules: [
      'Chamadas à API ficam em `src/actions/<dominio>`. Componentes e páginas nunca chamam o client HTTP direto.',
      'Componentes reutilizáveis ficam em `src/components`, um por pasta.',
      'Hooks customizados ficam em `src/hooks`, um por pasta, sempre com prefixo `use`.',
      'Cada página fica em `src/pages/<pagina>` e declara seus metadados de layout (título, permissões).',
      'Estado global fica em `src/stores/<store>`. Estado local fica no componente.',
      'Funções auxiliares, tipos e validações ficam em `src/utils/functions`, `src/utils/types` e `src/utils/validations`.'
    ]
  },
  featureFolders: {
    label: 'Por feature',
    summary: 'Cada feature agrupa seus componentes, hooks, API e estado. O que é compartilhado fica em `shared`.',
    whenToUse: 'Produtos grandes, com times divididos por área e features que evoluem separadas.',
    rules: [
      'Tudo de uma feature fica em `src/features/<feature>`.',
      'Uma feature só importa outra pelo `index.ts` público dela.',
      'Componentes genéricos, hooks e utilitários ficam em `src/shared`.',
      'Páginas só compõem features, sem regra própria.'
    ]
  },
  atomic: {
    label: 'Atomic Design',
    summary: 'Componentes em níveis: atoms, molecules, organisms e templates, compostos pelas páginas.',
    whenToUse: 'Projetos com design system próprio e muitos componentes visuais reutilizáveis.',
    rules: [
      'Atoms não importam outros componentes.',
      'Molecules combinam atoms; organisms combinam molecules e atoms.',
      'Templates definem o layout; páginas preenchem os templates com dados.',
      'Regra de negócio e chamadas à API ficam fora dos componentes visuais.'
    ]
  },
  featureSliced: {
    label: 'Feature-Sliced Design',
    summary: 'Camadas app, pages, widgets, features, entities e shared, cada uma dividida em slices e segmentos (ui, model, api).',
    whenToUse: 'Aplicações grandes que precisam de regras rígidas de dependência entre partes.',
    rules: [
      'Uma camada só importa camadas abaixo dela: app → pages → widgets → features → entities → shared.',
      'Slices da mesma camada não importam umas das outras.',
      'Cada slice expõe só o que está no seu `index.ts`.',
      'Segmentos padronizados: `ui` para componentes, `model` para estado e `api` para requisições.'
    ]
  },
  verticalSlice: {
    label: 'Vertical Slice',
    summary: 'Cada caso de uso é uma fatia completa (endpoint, validação e lógica) em uma pasta própria.',
    whenToUse: 'APIs orientadas a casos de uso, em que cada endpoint evolui de forma independente.',
    rules: [
      'Cada feature em `features/<casoDeUso>` contém handler, schema e testes.',
      'Fatias não importam umas das outras.',
      'Só infraestrutura genérica (banco, erros, logger) vai para `shared`.',
      'Duplicar um pouco entre fatias é preferível a acoplá-las.'
    ]
  }
}

export const architectureOrder: Record<EnabledProjectType, Architecture[]> = {
  backend: ['domainActions', 'layered', 'clean', 'hexagonal', 'modular', 'ddd', 'verticalSlice'],
  frontend: ['typeFolders', 'featureFolders', 'atomic', 'featureSliced']
}

export const paradigmOptions: ChoiceOption<Paradigm>[] = [
  { value: 'objects', label: 'Funções e objetos', description: 'Módulos exportam funções ou objetos literais com métodos.', example: 'const userRepository = {\n  findById: async (id: string) => UserModel.findById(id)\n}' },
  { value: 'classes', label: 'Classes', description: 'Services e repositórios são classes com dependências no construtor.', example: 'class UserService {\n  constructor(private readonly users: UserRepository) {}\n}' }
]

export const functionStyleOptions: ChoiceOption<FunctionStyle>[] = [
  { value: 'arrow', label: 'Arrow functions', description: 'Funções declaradas como constantes.', example: 'const sum = (a: number, b: number) => a + b' },
  { value: 'declaration', label: 'function', description: 'Declarações clássicas, com hoisting.', example: 'function sum(a: number, b: number) {\n  return a + b\n}' }
]

export const exportOptions: ChoiceOption<ExportStyle>[] = [
  { value: 'mixed', label: 'Misto', description: 'Default para o módulo principal do arquivo (repositórios, domínios, fábricas) e named para schemas, tipos e actions.', example: 'export default userRepository\nexport const userSchema = z.object({})' },
  { value: 'named', label: 'Sempre named', description: 'Facilita refatoração e autocomplete.', example: 'export const userRepository = {}' },
  { value: 'default', label: 'Sempre default', description: 'Um export principal por arquivo.', example: 'export default userRepository' }
]

export const importAliasOptions: ChoiceOption<ImportAlias>[] = [
  { value: 'perFolder', label: 'Alias por pasta', description: 'Um alias para cada pasta raiz do projeto.', example: "import defineAction from '@factories/defineAction'\nimport userRepository from '@domains/users/repositories/user'" },
  { value: 'root', label: 'Alias único @/', description: 'Um único alias apontando para `src`.', example: "import { userRepository } from '@/repositories/user'" },
  { value: 'relative', label: 'Caminhos relativos', description: 'Sem aliases configurados.', example: "import { userRepository } from '../../repositories/user'" }
]

export const importOrderOptions: ChoiceOption<ImportOrder>[] = [
  { value: 'blocksByLength', label: '3 blocos, do maior para o menor', description: 'Externos, internos e `import type`, separados por linha em branco e ordenados do maior para o menor. Desestruturação sempre em uma linha.', example: "import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'\nimport { z } from 'zod'\n\nimport userRepository from '@domains/users/repositories/user'\nimport defineAction from '@factories/defineAction'\n\nimport type { UserResponse } from './types'" },
  { value: 'blocksAlphabetical', label: '3 blocos, ordem alfabética', description: 'Mesmos blocos, ordenados pelo caminho do módulo.', example: "import express from 'express'\nimport { z } from 'zod'\n\nimport { logger } from '@/utils/logger'\n\nimport type { User } from './types'" },
  { value: 'free', label: 'Livre', description: 'Sem regra de ordenação, a cargo do formatter.' }
]

export const errorHandlingOptions: ChoiceOption<ErrorHandling>[] = [
  { value: 'errorCatalog', label: 'Catálogo de códigos', description: 'Erros são códigos de um catálogo central, com status e mensagem padronizados, retornados por um helper.', example: "if (!user) return manageError({ code: 'user_not_found' })" },
  { value: 'exceptions', label: 'Exceções tipadas', description: 'Classes de erro customizadas, tratadas por um middleware global.', example: 'if (!user) throw new UserNotFoundError(id)' },
  { value: 'result', label: 'Result / Either', description: 'Funções retornam sucesso ou falha explicitamente, sem lançar.', example: 'if (!user) return err(new UserNotFoundError(id))\nreturn ok(user)' }
]

export const validationOptions: ChoiceOption<Validation>[] = [
  { value: 'zod', label: 'Zod', description: 'Schemas com tipos inferidos via `z.infer`.', example: 'const userSchema = z.object({ name: z.string().min(1) })\ntype User = z.infer<typeof userSchema>' },
  { value: 'classValidator', label: 'class-validator', description: 'DTOs com decorators.', example: 'class CreateUserDto {\n  @IsString() name: string\n}' },
  { value: 'joi', label: 'Joi', description: 'Schemas de validação em runtime.', example: 'Joi.object({ name: Joi.string().required() })' },
  { value: 'none', label: 'Manual', description: 'Validação escrita à mão.' }
]

export const routeStyleOptions: ChoiceOption<RouteStyle>[] = [
  { value: 'actionInPath', label: 'Ação explícita na URL', description: 'A rota diz o que a operação faz.', example: 'POST   /properties/create\nPATCH  /properties/:id/update\nDELETE /users/favorites/:id/remove' },
  { value: 'rest', label: 'REST por recurso', description: 'O verbo HTTP define a operação.', example: 'POST   /properties\nPATCH  /properties/:id\nDELETE /favorites/:id' }
]

export const apiDocsOptions: ChoiceOption<ApiDocs>[] = [
  { value: 'openapiZod', label: 'OpenAPI gerado dos schemas', description: 'Swagger em `/docs` montado a partir das definições de cada endpoint.', example: "responses: {\n  201: { description: 'Criado', schema: userResponseSchema }\n}" },
  { value: 'none', label: 'Sem documentação gerada', description: 'A documentação fica fora do código.' }
]

export const testingOptions: ChoiceOption<Testing>[] = [
  { value: 'vitest', label: 'Vitest', description: 'Rápido, compatível com ESM e com a API do Jest.', example: "import { describe, expect, it } from 'vitest'" },
  { value: 'jest', label: 'Jest', description: 'O mais difundido, com grande ecossistema.', example: "describe('userRepository', () => {})" },
  { value: 'none', label: 'Sem testes', description: 'A skill não vai exigir testes.' }
]

export const testLocationOptions: ChoiceOption<TestLocation>[] = [
  { value: 'hybrid', label: 'Híbrido', description: 'Unitários e de integração ao lado do código, E2E em `tests/e2e`.', example: 'src/utils/date/date.spec.ts\ntests/e2e/health.e2e-spec.ts' },
  { value: 'colocated', label: 'Ao lado do código', description: 'Todo teste fica junto do arquivo testado.', example: 'src/users/user.service.spec.ts' },
  { value: 'separate', label: 'Pasta tests/', description: 'Testes espelham a estrutura de `src` em uma pasta própria.', example: 'tests/users/user.service.spec.ts' }
]

export const testSuffixOptions: ChoiceOption<TestSuffix>[] = [
  { value: 'spec', label: '.spec.ts', description: 'Sufixo spec (E2E como `.e2e-spec.ts`).', example: 'index.spec.ts' },
  { value: 'test', label: '.test.ts', description: 'Sufixo test (E2E como `.e2e-test.ts`).', example: 'index.test.ts' }
]

export const semicolonOptions: ChoiceOption<Semicolons>[] = [
  { value: 'never', label: 'Sem ponto e vírgula', description: 'Estilo limpo, sem `;` no fim das linhas.', example: "const name = 'Ana'" },
  { value: 'always', label: 'Com ponto e vírgula', description: 'Sempre `;` no fim das instruções.', example: "const name = 'Ana';" }
]

export const quoteOptions: ChoiceOption<Quotes>[] = [
  { value: 'single', label: 'Aspas simples', description: 'Strings com aspas simples.', example: "import { z } from 'zod'" },
  { value: 'double', label: 'Aspas duplas', description: 'Strings com aspas duplas.', example: 'import { z } from "zod"' }
]

export const commentsOptions: ChoiceOption<CommentsPolicy>[] = [
  { value: 'none', label: 'Zero comentários', description: 'Proibido `//`, `/* */` e JSDoc. O código precisa ser autoexplicativo.', example: 'const activeUsers = users.filter(isActive)' },
  { value: 'publicOnly', label: 'Só JSDoc em APIs públicas', description: 'Comenta contratos exportados, nunca a implementação.', example: '/** Retorna o usuário ou null. */\nexport const findUser = ...' },
  { value: 'allowed', label: 'Livre', description: 'Comentários quando ajudam a explicar o porquê.', example: '// O provedor limita a 10 req/s' }
]

export interface PrincipleInfo {
  value: Principle
  scope: EnabledProjectType[]
  label: string
  description: string
  good: string
  bad?: string
}

export const principleOptions: PrincipleInfo[] = [
  { value: 'earlyReturn', scope: ['backend', 'frontend'], label: 'Retornos antecipados', description: 'Valide e saia cedo, sem `if/else` aninhado.', good: "if (!user) return manageError({ code: 'not_found' })\nreturn user", bad: 'if (user) {\n  return user\n} else {\n  return error\n}' },
  { value: 'immutability', scope: ['backend', 'frontend'], label: 'Imutabilidade', description: 'Sem `let`, `for` e `while`. Use `map`, `filter`, `reduce` e spread.', good: 'const names = users.map((user) => user.name)', bad: 'let names = []\nfor (const user of users) names.push(user.name)' },
  { value: 'noAny', scope: ['backend', 'frontend'], label: 'Tipagem estrita', description: '`any` é proibido. Tipos vêm dos schemas e de interfaces.', good: 'type User = z.infer<typeof userSchema>', bad: 'const user: any = req.body' },
  { value: 'noConsoleLog', scope: ['backend', 'frontend'], label: 'Logger em vez de console.log', description: 'Nada de `console.log` em produção. Use o logger do projeto.', good: "const logger = createLocalLogger('users')\nlogger.error(error)", bad: 'console.log(error)' },
  { value: 'parallelAsync', scope: ['backend', 'frontend'], label: 'Assincronismo paralelo', description: '`Promise.all` para chamadas sem dependência entre si.', good: 'const [user, plans] = await Promise.all([findUser(id), listPlans()])', bad: 'const user = await findUser(id)\nconst plans = await listPlans()' },
  { value: 'leanResponses', scope: ['backend'], label: 'Respostas enxutas', description: 'Sem mensagens redundantes nem eco do payload. O status HTTP já informa o resultado.', good: 'return { id: newUser.id }', bad: "return { message: 'Criado com sucesso', ...data }" },
  { value: 'repositoryIsolation', scope: ['backend'], label: 'Banco isolado em repositórios', description: 'Handlers nunca importam models. Outros domínios usam o repositório exposto.', good: "import userRepository from '@domains/users/repositories/user'", bad: "import UserModel from '@domains/users/repositories/user/model'" },
  { value: 'auditMutations', scope: ['backend'], label: 'Auditoria em mutações', description: 'Toda criação, edição ou exclusão registra um log de auditoria.', good: "await createAuditLog({ actorId, action: 'create_user', entity: 'User', entityId })" },
  { value: 'standardPagination', scope: ['backend'], label: 'Paginação padronizada', description: 'Listagens recebem `page` e `limit` e respondem `{ meta, data }`.', good: '{ "meta": { "total": 45, "totalPages": 5, "limit": 10, "page": 1 }, "data": [] }' },
  { value: 'noReinvent', scope: ['backend', 'frontend'], label: 'Não reinventar utilitários', description: 'Antes de criar um helper, procure um equivalente no core do projeto.', good: "import { formatDateBR } from '@utils/date'", bad: 'const format = (d: Date) => d.toLocaleDateString()' },
  { value: 'routeGuard', scope: ['frontend'], label: 'Rotas privadas protegidas', description: 'Rotas privadas sem token redirecionam para o login.', good: "return privateRoute && !token ? <Navigate to=\"/signin\" /> : element" },
  { value: 'permissionCheck', scope: ['frontend'], label: 'Permissões por página', description: 'Cada página declara as permissões exigidas, checadas pela store do sistema.', good: "const metadata: Partial<LayoutProps> = { requiredPermissions: ['manage_users'] }", bad: "if (user.role === 'admin') { ... }" },
  { value: 'lazyRoutes', scope: ['frontend'], label: 'Lazy loading de rotas', description: 'Páginas carregadas sob demanda, com code splitting por rota.', good: "const UsersPage = lazy(() => import('@pages/users'))" },
  { value: 'mobileFirst', scope: ['frontend'], label: 'Mobile-first', description: 'Estilos partem do celular e crescem com breakpoints.', good: 'padding: 1rem;\n@media (min-width: 768px) { padding: 2rem; }', bad: "@media (max-width: 768px) { padding: 1rem; }" },
  { value: 'accessibility', scope: ['frontend'], label: 'Acessibilidade (WCAG)', description: 'Elementos semânticos, rótulos em botões de ícone e foco visível.', good: '<IconButton aria-label="Excluir usuário">', bad: '<div onClick={remove}>' },
  { value: 'themeTokens', scope: ['frontend'], label: 'Cores e espaços do tema', description: 'Nada de cor ou espaçamento fixo: use o tema.', good: 'color: ${({ theme }) => theme.palette.primary.main};', bad: 'color: #1976d2;' },
  { value: 'persistedStores', scope: ['frontend'], label: 'Stores persistidas', description: 'Estado que precisa sobreviver ao reload usa o middleware de persistência.', good: "create<UserStore>()(persist((set) => ({ ... }), { name: 'user' }))" }
]
