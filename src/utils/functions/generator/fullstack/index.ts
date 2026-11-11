import { code, deployChecklistItem, gitSection, publishChecklistItem } from "@utils/functions/generator/markdownHelpers"
import { buildTree, getProjectFiles, renderTree } from "@utils/functions/generator/architecture"
import { devRunnerOptions, envLocationOptions } from "@assets/data/generator/deployOptions"
import { buildDeployFiles, deploySection } from "@utils/functions/generator/deploy"
import { createMdContext, sentence } from "@utils/functions/generator/mdContext"
import { publishingSection } from "@utils/functions/generator/publishing"

import type { GeneratorConfig, OutputFormat, WorkspaceApps } from "@utils/types/generator"
import type { ProjectFile } from "@utils/types/architecture"
import type { SampleFile } from "@utils/types/codeSample"

export const getFolders = (config: GeneratorConfig) => ({ api: config.workspace.backendFolder.trim() || "api", web: config.workspace.frontendFolder.trim() || "frontend" })

export const toWorkspaceApp = (app: GeneratorConfig, fullstack: GeneratorConfig): GeneratorConfig => ({ ...app, outputLanguage: fullstack.outputLanguage })

export const withApiLanguage = (config: GeneratorConfig, apps: WorkspaceApps): GeneratorConfig => ({ ...config, language: apps.backend.language, go: apps.backend.go })

const rootPackageJson = (config: GeneratorConfig) => {
  const { api, web } = getFolders(config)
  const isWorkspaces = config.workspace.devRunner === "npmWorkspaces"
  const isGoApi = config.language === "go"
  const run = (folder: string, script: string) => (isWorkspaces ? `npm run ${script} -w ${folder}` : `npm --prefix ${folder} run ${script}`)
  const runApi = (script: "dev" | "build") => (isGoApi ? (script === "dev" ? `cd ${api} && go run ./cmd/api` : `cd ${api} && go build -o bin/api ./cmd/api`) : run(api, script))
  const hasServices = config.deploy.hasCompose && config.deploy.services.length > 0
  const quote = (text: string) => `\\"${text}\\"`
  const names = [hasServices ? "services" : "", "api", "web"].filter(Boolean)
  const scripts = [
    ["dev", `concurrently -n ${quote(names.join(","))} ${names.map((name) => quote(`npm run dev:${name}`)).join(" ")}`],
    hasServices ? ["dev:services", `docker compose up ${config.deploy.services.join(" ")}`] : [],
    ["dev:api", runApi("dev")],
    ["dev:web", run(web, "dev")],
    ["build", "npm run build:api && npm run build:web"],
    ["build:api", runApi("build")],
    ["build:web", run(web, "build")],
    ["lint", run(web, "lint")],
    config.deploy.hasDocker && config.deploy.hasCompose ? ["up", "docker compose up -d --build"] : []
  ].filter((entry) => entry.length)
  const workspaces = isWorkspaces ? `\n  "workspaces": [${isGoApi ? `"${web}"` : `"${api}", "${web}"`}],` : ""
  return `{
  "name": "monorepo",
  "private": true,${workspaces}
  "scripts": {
${scripts.map(([name, command]) => `    "${name}": "${command}"`).join(",\n")}
  },
  "devDependencies": {
    "concurrently": "^9.1.2"
  }
}`
}

const envExample = (config: GeneratorConfig) => {
  const services = config.deploy.services
  const lines = [
    "PORT=5000",
    "NODE_ENV=development",
    "CORS_ORIGIN=http://localhost:3000",
    "JWT_SECRET=",
    services.includes("mongo") ? "MONGO_URI=mongodb://localhost:27017/app" : "",
    services.includes("postgres") ? "DATABASE_URL=postgres://postgres:postgres@localhost:5432/app" : "",
    services.includes("redis") ? "REDIS_URL=redis://localhost:6379" : "",
    "",
    "FRONTEND_PORT=3000",
    `VITE_API_URL=${config.deploy.hasNginx && config.deploy.fullstackNginx === "gateway" ? "/api" : "http://localhost:5000"}`
  ]
  return lines.filter((line, index) => line !== "" || lines[index - 1] !== "").join("\n").trim()
}

export const buildFullstackSampleFiles = (config: GeneratorConfig): SampleFile[] => {
  const { api, web } = getFolders(config)
  const envFiles =
    config.workspace.envLocation === "root"
      ? [{ path: ".env.example", code: envExample(config) }]
      : [
          { path: `${api}/.env.example`, code: envExample(config).split("\n\n")[0] },
          { path: `${web}/.env.example`, code: envExample(config).split("\n\n")[1] ?? "" }
        ]
  return [{ path: "package.json", code: rootPackageJson(config) }, ...envFiles, ...buildDeployFiles(config)]
}

const prefixed = (folder: string, files: ProjectFile[]) => files.map((file) => ({ ...file, path: `${folder}/${file.path}`, isHighlighted: false }))

export const getFullstackFiles = (config: GeneratorConfig, apps: WorkspaceApps): ProjectFile[] => {
  const { api, web } = getFolders(config)
  const guide = (folder: string) => ({ path: `${folder}/CLAUDE.md`, note: "guia do app" })
  const root = buildFullstackSampleFiles(config).map((file) => ({ path: file.path, isHighlighted: !file.path.includes("/") }))
  return [...root, guide(api), guide(web), ...prefixed(api, getProjectFiles(apps.backend)), ...prefixed(web, getProjectFiles(apps.frontend))]
}

export const getAppGuidePaths = (config: GeneratorConfig, format: OutputFormat) => {
  const { api, web } = getFolders(config)
  if (format === "skill") return { api: "backend.md", web: "frontend.md" }
  return { api: `${api}/CLAUDE.md`, web: `${web}/CLAUDE.md` }
}

export const buildFullstackMarkdown = (config: GeneratorConfig, format: OutputFormat): string => {
  const ctx = createMdContext(config)
  const { byLanguage, field } = ctx
  const { workspace, deploy } = config
  const { api, web } = getFolders(config)
  const guides = getAppGuidePaths(config, format)
  const runner = field("workspace.devRunner", devRunnerOptions, workspace.devRunner)
  const env = field("workspace.envLocation", envLocationOptions, workspace.envLocation)
  const isGateway = deploy.hasNginx && deploy.fullstackNginx === "gateway"
  const rootFiles = buildFullstackSampleFiles(config).filter((file) => !file.path.startsWith(`${api}/`) && !file.path.startsWith(`${web}/`))
  const tree = [
    ".",
    ...renderTree(
      buildTree([
        ...rootFiles.map((file) => ({ path: file.path })),
        { path: `${api}/src`, note: byLanguage("código da API", "API code") },
        { path: config.language === "go" ? `${api}/go.mod` : `${api}/package.json` },
        ...(format === "claudeMd" ? [{ path: `${api}/CLAUDE.md`, note: byLanguage("guia da API", "API guide") }] : []),
        { path: `${web}/src`, note: byLanguage("código do frontend", "frontend code") },
        { path: `${web}/package.json` },
        ...(format === "claudeMd" ? [{ path: `${web}/CLAUDE.md`, note: byLanguage("guia do frontend", "frontend guide") }] : []),
        ...buildDeployFiles(config)
          .filter((file) => file.path.includes("/"))
          .map((file) => ({ path: file.path }))
      ])
    )
  ].join("\n")

  const checklist = [
    byLanguage(`Código da API ficou em \`${api}/\` e código do frontend em \`${web}/\`, seguindo o guia de cada app.`, `API code stayed in \`${api}/\` and frontend code in \`${web}/\`, following each app's guide.`),
    byLanguage("Nenhum import cruza os apps. O frontend fala com a API só por HTTP.", "No import crosses apps. The frontend talks to the API over HTTP only."),
    byLanguage("Tipos de resposta da API alterados foram espelhados no frontend.", "Changed API response types were mirrored in the frontend."),
    deployChecklistItem(ctx),
    deploy.hasDocker ? (config.language === "go" ? byLanguage("Dependência nova entrou no `go.mod` da API ou no `package.json` do frontend, nunca na raiz.", "New dependencies went into the API's `go.mod` or the frontend's `package.json`, never at the root.") : byLanguage("Dependência nova foi instalada no `package.json` do app certo, nunca na raiz.", "New dependencies were installed in the right app's `package.json`, never at the root.")) : "",
    publishChecklistItem(ctx)
  ].filter(Boolean)

  return `# ${byLanguage("Guia do monorepo fullstack", "Fullstack monorepo guide")}

${byLanguage(
  `Este repositório junta a API em \`${api}/\` e o frontend em \`${web}/\`. Este guia define as regras da raiz: estrutura, scripts, variáveis de ambiente, Docker, docker-compose, nginx, commits e publicação. Seguir este guia é **obrigatório**.`,
  `This repository holds the API in \`${api}/\` and the frontend in \`${web}/\`. This guide defines the root rules: structure, scripts, environment variables, Docker, docker-compose, nginx, commits and publishing. Following it is **mandatory**.`
)}

**${byLanguage("Diretriz", "Directive")}:** ${byLanguage(
    `antes de mexer em um app, leia o guia dele: \`${guides.api}\` para a API e \`${guides.web}\` para o frontend. As regras de código, arquitetura e nomenclatura de cada app estão lá.`,
    `before changing an app, read its guide: \`${guides.api}\` for the API and \`${guides.web}\` for the frontend. Each app's code, architecture and naming rules live there.`
  )}

## 1. ${byLanguage("Estrutura do repositório", "Repository structure")}

${code(tree, "text")}

- ${config.language === "go" ? byLanguage(`Cada app é independente: a API em Go tem seu \`go.mod\` e o frontend, seu \`package.json\`. Dependências são instaladas na pasta do app (\`go get\` em \`${api}/\`, \`npm install\` em \`${web}/\`).`, `Each app is independent: the Go API has its own \`go.mod\` and the frontend its own \`package.json\`. Dependencies are installed in the app's folder (\`go get\` in \`${api}/\`, \`npm install\` in \`${web}/\`).`) : byLanguage("Cada app é independente: tem seu próprio `package.json`, `tsconfig`, lint e build. Dependências são instaladas na pasta do app.", "Each app is independent: it has its own `package.json`, `tsconfig`, lint and build. Dependencies are installed in the app's folder.")}
- ${byLanguage("O `package.json` da raiz só orquestra os apps. Ele não tem código nem dependências de runtime.", "The root `package.json` only orchestrates the apps. It has no code and no runtime dependencies.")}
- ${byLanguage("Nenhum import cruza os apps. O frontend fala com a API só por HTTP, pela camada de actions.", "No import crosses apps. The frontend talks to the API over HTTP only, through its actions layer.")}
- ${byLanguage("Quando um contrato da API muda, os tipos de resposta são espelhados no frontend no mesmo trabalho.", "When an API contract changes, the response types are mirrored in the frontend in the same work.")}

## 2. ${byLanguage("Scripts e desenvolvimento local", "Scripts and local development")}

- **${byLanguage("Execução", "Runner")}:** ${sentence(runner.label, runner.description)}
- ${byLanguage("`npm run dev` na raiz sobe tudo junto. Use `dev:api` ou `dev:web` para subir um app só.", "`npm run dev` at the root starts everything. Use `dev:api` or `dev:web` to start a single app.")}
- ${byLanguage("`npm run build` builda os dois apps. Rode antes de dar a tarefa como pronta.", "`npm run build` builds both apps. Run it before calling a task done.")}

${code(rootPackageJson(config), "json")}

## 3. ${byLanguage("Variáveis de ambiente", "Environment variables")}

- **${byLanguage("Local", "Location")}:** ${sentence(env.label, env.description)}
- ${byLanguage("Nunca commite `.env`. Toda variável nova entra no `.env.example` com um valor de exemplo seguro.", "Never commit `.env`. Every new variable goes into `.env.example` with a safe example value.")}
- ${byLanguage("Variáveis lidas pelo frontend têm o prefixo `VITE_` e são públicas: nunca coloque segredos nelas.", "Variables read by the frontend use the `VITE_` prefix and are public: never put secrets in them.")}
- ${isGateway ? byLanguage("Em produção o frontend usa `VITE_API_URL=/api`, atrás do mesmo domínio.", "In production the frontend uses `VITE_API_URL=/api`, behind the same domain.") : byLanguage("`VITE_API_URL` aponta para a URL pública da API em cada ambiente.", "`VITE_API_URL` points to the API's public URL in each environment.")}

## 4. ${byLanguage("Docker e deploy", "Docker and deploy")}

${deploySection(ctx)}

## 5. ${byLanguage("Commits e Git", "Commits and Git")}

${gitSection(ctx)}

## 6. ${byLanguage("Publicação", "Publishing")}

${publishingSection(ctx)}

## 7. ${byLanguage("Guias de cada app", "App guides")}

- **API (\`${api}/\`):** \`${guides.api}\`
- **Frontend (\`${web}/\`):** \`${guides.web}\`

${byLanguage(
  format === "skill" ? "Os dois arquivos ficam na mesma pasta desta skill. Leia o do app antes de criar ou editar código nele." : "O Claude Code carrega o CLAUDE.md da pasta ao trabalhar nela. Leia o do app antes de criar ou editar código nele.",
  format === "skill" ? "Both files live in this skill's folder. Read the app's guide before creating or editing code in it." : "Claude Code loads the folder's CLAUDE.md when working in it. Read the app's guide before creating or editing code in it."
)}

## 8. ${byLanguage("Checklist antes de entregar", "Checklist before delivering")}

${checklist.map((item) => `- [ ] ${item}`).join("\n")}
`.replace(/\n{3,}/g, "\n\n")
}
