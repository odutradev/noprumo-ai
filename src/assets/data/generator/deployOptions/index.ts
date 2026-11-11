import type { ChoiceOption, ContainerService, DeployConfig, DevRunner, EnvLocation, FullstackNginx, WorkspaceConfig } from "@utils/types/generator"

export const deployDefaults: DeployConfig = {
  hasDocker: false,
  nodeImage: "node:22-alpine",
  hasCompose: false,
  services: [],
  hasNginx: false,
  fullstackNginx: "spaOnly"
}

export const workspaceDefaults: WorkspaceConfig = {
  backendFolder: "api",
  frontendFolder: "frontend",
  devRunner: "prefixScripts",
  envLocation: "root"
}

export const containerServiceOptions: ChoiceOption<ContainerService>[] = [
  { value: "redis", label: "Redis", description: "Cache e filas. Imagem redis:7-alpine com volume nomeado.", example: "redis://redis:6379" },
  { value: "mongo", label: "MongoDB", description: "Banco de documentos. Imagem mongo:7 com volume nomeado.", example: "mongodb://mongo:27017/app" },
  { value: "postgres", label: "PostgreSQL", description: "Banco relacional. Imagem postgres:16-alpine com volume nomeado.", example: "postgres://postgres:postgres@postgres:5432/app" }
]

export const fullstackNginxOptions: ChoiceOption<FullstackNginx>[] = [
  { value: "spaOnly", label: "Só o frontend", description: "O nginx serve a build do frontend. A API fica exposta na própria porta ou domínio.", example: "app.dominio.com → nginx\napi.dominio.com → api" },
  { value: "gateway", label: "Gateway único", description: "O nginx serve o frontend e repassa /api para o container da API. Um domínio só, sem CORS.", example: "dominio.com/ → frontend\ndominio.com/api → api" }
]

export const devRunnerOptions: ChoiceOption<DevRunner>[] = [
  { value: "prefixScripts", label: "Scripts com --prefix", description: "O package.json da raiz chama cada app com npm --prefix e sobe tudo junto com concurrently.", example: "\"dev:api\": \"npm --prefix api run dev\"" },
  { value: "npmWorkspaces", label: "npm workspaces", description: "A raiz declara os apps em workspaces e roda scripts com -w.", example: "\"dev:api\": \"npm run dev -w api\"" }
]

export const envLocationOptions: ChoiceOption<EnvLocation>[] = [
  { value: "root", label: "Um .env na raiz", description: "Um único .env e .env.example na raiz, lido pelo docker-compose e pelos dois apps.", example: ".env\n.env.example" },
  { value: "perApp", label: "Um .env por app", description: "Cada app tem seu .env e .env.example. O compose usa env_file de cada pasta.", example: "api/.env\nfrontend/.env" }
]
