import { containerServiceOptions } from "@assets/data/generator/deployOptions"
import { code } from "@utils/functions/generator/markdownHelpers"

import type { ContainerService, DeployConfig, GeneratorConfig } from "@utils/types/generator"
import type { DeployApp, NginxMode } from "@utils/types/deploy"
import type { SampleFile } from "@utils/types/codeSample"
import type { MdContext } from "@utils/types/markdown"

const serviceSpecs: Record<ContainerService, { image: string; port: string; volume: string; envKey: string; url: string; environment: string[] }> = {
  redis: { image: "redis:7-alpine", port: "${REDIS_PORT:-6379}:6379", volume: "redis-data:/data", envKey: "REDIS_URL", url: "redis://redis:6379", environment: [] },
  mongo: { image: "mongo:7", port: "${MONGO_PORT:-27017}:27017", volume: "mongo-data:/data/db", envKey: "MONGO_URI", url: "mongodb://mongo:27017/app", environment: [] },
  postgres: {
    image: "postgres:16-alpine",
    port: "${POSTGRES_PORT:-5432}:5432",
    volume: "postgres-data:/var/lib/postgresql/data",
    envKey: "DATABASE_URL",
    url: "postgres://postgres:${POSTGRES_PASSWORD:-postgres}@postgres:5432/app",
    environment: ["POSTGRES_DB=app", "POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-postgres}"]
  }
}

export const joinPath = (folder: string, file: string) => (folder === "." || !folder ? file : `${folder}/${file}`)

export const getDeployApps = (config: GeneratorConfig): DeployApp[] => {
  if (config.projectType === "fullstack")
    return [
      { kind: "api", folder: config.workspace.backendFolder || "api", service: config.workspace.backendFolder || "api" },
      { kind: "web", folder: config.workspace.frontendFolder || "frontend", service: config.workspace.frontendFolder || "frontend" }
    ]
  if (config.projectType === "frontend") return [{ kind: "web", folder: ".", service: "frontend" }]
  return [{ kind: "api", folder: ".", service: "api" }]
}

export const getNginxMode = (config: GeneratorConfig): NginxMode => {
  if (!config.deploy.hasNginx) return "none"
  if (config.projectType === "backend") return "reverseProxy"
  if (config.projectType === "frontend") return "spa"
  return config.deploy.fullstackNginx === "gateway" ? "gateway" : "spa"
}

export const hasDeploy = (deploy: DeployConfig) => deploy.hasDocker || deploy.hasCompose || deploy.hasNginx

const apiDockerfile = (image: string) => `FROM ${image} AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM ${image} AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=80
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=builder /app/dist ./dist
EXPOSE 80
CMD ["node", "dist/server.js"]`

const webDockerfile = (image: string, hasNginx: boolean) => {
  const builder = `FROM ${image} AS builder
WORKDIR /app
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build`
  const runner = hasNginx
    ? `FROM nginx:alpine AS runner
RUN rm -rf /etc/nginx/conf.d/*
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`
    : `FROM ${image} AS runner
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 80
CMD ["serve", "-s", "dist", "-l", "80"]`
  return `${builder}\n\n${runner}`
}

const dockerignore = `node_modules
dist
.git
.gitignore
.env
.env.*
*.local
npm-debug.log*
CLAUDE.md
README.md`

const proxyHeaders = `        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;`

const spaNginx = (apiUpstream: string | undefined) => `server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/javascript application/javascript application/json image/svg+xml;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }

    location = /index.html {
        add_header Cache-Control "no-store, no-cache, must-revalidate";
        expires 0;
    }
${apiUpstream ? `\n    location /api/ {\n        proxy_pass http://${apiUpstream}/;\n${proxyHeaders}\n    }\n` : ""}
    location / {
        try_files $uri $uri/ /index.html;
    }

    location /healthz {
        access_log off;
        return 200 "healthy\\n";
    }
}`

const proxyNginx = (apiUpstream: string) => `server {
    listen 80;
    server_name localhost;

    client_max_body_size 10m;

    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        proxy_pass http://${apiUpstream};
${proxyHeaders}
    }

    location /healthz {
        access_log off;
        return 200 "healthy\\n";
    }
}`

const buildContext = (app: DeployApp) => (app.folder === "." ? "." : `./${app.folder}`)

const envFileFor = (config: GeneratorConfig, app: DeployApp) => (config.projectType === "fullstack" && config.workspace.envLocation === "perApp" ? `./${app.folder}/.env` : ".env")

const composeFile = (config: GeneratorConfig) => {
  const { deploy } = config
  const apps = deploy.hasDocker ? getDeployApps(config) : []
  const mode = getNginxMode(config)
  const api = apps.find((app) => app.kind === "api")
  const isApiHidden = mode === "reverseProxy" || mode === "gateway"
  const services = deploy.services.map((service) => ({ service, spec: serviceSpecs[service] }))

  const apiBlock = api
    ? [
        `  ${api.service}:`,
        "    build:",
        `      context: ${buildContext(api)}`,
        "    restart: unless-stopped",
        "    env_file:",
        `      - ${envFileFor(config, api)}`,
        isApiHidden ? "    expose:\n      - \"80\"" : "    ports:\n      - \"${PORT:-5000}:80\"",
        "    environment:",
        "      - PORT=80",
        "      - NODE_ENV=production",
        ...services.map(({ spec }) => `      - ${spec.envKey}=${spec.url}`),
        services.length ? `    depends_on:\n${services.map(({ service }) => `      - ${service}`).join("\n")}` : "",
        "    networks:",
        "      - app-network"
      ]
    : []

  const webBlock = apps
    .filter((app) => app.kind === "web")
    .flatMap((web) => [
      `  ${web.service}:`,
      "    build:",
      `      context: ${buildContext(web)}`,
      "      args:",
      `        - VITE_API_URL=${mode === "gateway" ? "/api" : "${VITE_API_URL:-http://localhost:5000}"}`,
      "    restart: unless-stopped",
      "    ports:",
      `      - "${mode === "gateway" ? "${APP_PORT:-80}" : "${FRONTEND_PORT:-3000}"}:80"`,
      api ? `    depends_on:\n      - ${api.service}` : "",
      "    networks:",
      "      - app-network"
    ])

  const proxyBlock =
    api && mode === "reverseProxy"
      ? ["  nginx:", "    image: nginx:alpine", "    restart: unless-stopped", "    ports:", "      - \"${NGINX_PORT:-80}:80\"", "    volumes:", "      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf:ro", "    depends_on:", `      - ${api.service}`, "    networks:", "      - app-network"]
      : []

  const serviceBlocks = services.flatMap(({ service, spec }) => [
    `  ${service}:`,
    `    image: ${spec.image}`,
    "    restart: unless-stopped",
    spec.environment.length ? `    environment:\n${spec.environment.map((line) => `      - ${line}`).join("\n")}` : "",
    "    ports:",
    `      - "${spec.port}"`,
    "    volumes:",
    `      - ${spec.volume}`,
    "    networks:",
    "      - app-network"
  ])

  const volumes = services.length ? ["", "volumes:", ...services.map(({ spec }) => `  ${spec.volume.split(":")[0]}:\n    driver: local`)] : []
  const body = [...apiBlock, ...webBlock, ...proxyBlock, ...serviceBlocks].filter(Boolean)
  if (!body.length) return ""
  return ["services:", ...body, ...volumes, "", "networks:", "  app-network:", "    driver: bridge"].join("\n")
}

export const buildDeployFiles = (config: GeneratorConfig): SampleFile[] => {
  const { deploy } = config
  const apps = getDeployApps(config)
  const mode = getNginxMode(config)
  const apiUpstream = deploy.hasDocker ? `${apps.find((app) => app.kind === "api")?.service ?? "api"}:80` : "localhost:5000"
  const web = apps.find((app) => app.kind === "web")
  const image = deploy.nodeImage.trim() || "node:22-alpine"

  const dockerFiles = deploy.hasDocker
    ? apps.flatMap((app) => [
        { path: joinPath(app.folder, "Dockerfile"), code: app.kind === "api" ? apiDockerfile(image) : webDockerfile(image, mode === "spa" || mode === "gateway") },
        { path: joinPath(app.folder, ".dockerignore"), code: dockerignore }
      ])
    : []
  const compose = deploy.hasCompose ? composeFile(config) : ""
  const composeFiles = compose ? [{ path: "docker-compose.yml", code: compose }] : []
  const nginxFiles =
    mode === "none"
      ? []
      : mode === "reverseProxy"
        ? [{ path: "nginx/nginx.conf", code: proxyNginx(apiUpstream) }]
        : [{ path: joinPath(web?.folder ?? ".", "nginx.conf"), code: spaNginx(mode === "gateway" ? apiUpstream : undefined) }]

  return [...dockerFiles, ...composeFiles, ...nginxFiles]
}

const fileLanguage = (path: string) => (path.endsWith(".yml") ? "yaml" : path.endsWith(".conf") ? "nginx" : path.endsWith("Dockerfile") ? "dockerfile" : "text")

export const deploySection = (ctx: MdContext) => {
  const { config, byLanguage } = ctx
  const { deploy } = config
  if (!hasDeploy(deploy)) return byLanguage("O projeto não usa Docker, docker-compose nem nginx. Não crie esses arquivos sem pedido.", "The project does not use Docker, docker-compose or nginx. Do not create these files unless asked.")

  const apps = getDeployApps(config)
  const mode = getNginxMode(config)
  const image = deploy.nodeImage.trim() || "node:22-alpine"
  const hasWeb = apps.some((app) => app.kind === "web")
  const hasApi = apps.some((app) => app.kind === "api")
  const isFullstack = config.projectType === "fullstack"
  const serviceLabels = deploy.services.map((service) => containerServiceOptions.find((option) => option.value === service)?.label ?? service)

  const docker = deploy.hasDocker
    ? [
        "### Docker",
        "",
        byLanguage(
          `- ${isFullstack ? "Cada app tem" : "O app tem"} um \`Dockerfile\` multi-stage na própria pasta: estágio \`builder\` (\`npm ci\` e build) e estágio \`runner\` só com o necessário para rodar.`,
          `- ${isFullstack ? "Each app has" : "The app has"} a multi-stage \`Dockerfile\` in its own folder: a \`builder\` stage (\`npm ci\` and build) and a \`runner\` stage with only what is needed to run.`
        ),
        byLanguage(`- Imagem base dos estágios Node: \`${image}\`. Não troque de versão sem pedido.`, `- Base image for Node stages: \`${image}\`. Do not change the version unless asked.`),
        hasApi
          ? byLanguage(
              "- API: o runner instala só dependências de produção (`npm ci --omit=dev && npm cache clean --force`), copia o `dist` do builder, define `NODE_ENV=production` e `PORT=80` e roda `node dist/server.js`.",
              "- API: the runner installs production dependencies only (`npm ci --omit=dev && npm cache clean --force`), copies `dist` from the builder, sets `NODE_ENV=production` and `PORT=80` and runs `node dist/server.js`."
            )
          : "",
        hasWeb
          ? byLanguage(
              "- Frontend: variáveis do Vite entram como `ARG` e viram `ENV` antes do build (`VITE_API_URL`), porque o Vite embute os valores na build. Nunca leia segredos no frontend.",
              "- Frontend: Vite variables come in as `ARG` and become `ENV` before the build (`VITE_API_URL`), because Vite inlines them into the build. Never read secrets in the frontend."
            )
          : "",
        hasWeb
          ? mode === "spa" || mode === "gateway"
            ? byLanguage("- O runner do frontend é `nginx:alpine` servindo o `dist` com o `nginx.conf` do app.", "- The frontend runner is `nginx:alpine` serving `dist` with the app's `nginx.conf`.")
            : byLanguage("- O runner do frontend serve o `dist` com `serve -s` na porta 80.", "- The frontend runner serves `dist` with `serve -s` on port 80.")
          : "",
        byLanguage("- Todo container escuta na porta 80. A porta externa é definida no compose ou no deploy.", "- Every container listens on port 80. The external port is set in compose or in the deploy."),
        byLanguage(
          "- Cada pasta com `Dockerfile` tem um `.dockerignore` que ignora `node_modules`, `dist`, `.git`, `.env`, `.env.*` e docs. Nunca copie `.env` para a imagem: configuração entra por variável de ambiente.",
          "- Every folder with a `Dockerfile` has a `.dockerignore` that ignores `node_modules`, `dist`, `.git`, `.env`, `.env.*` and docs. Never copy `.env` into the image: configuration comes from environment variables."
        )
      ]
    : []

  const compose = deploy.hasCompose
    ? [
        "",
        "### docker-compose",
        "",
        deploy.hasDocker
          ? byLanguage("- Um `docker-compose.yml` na raiz, com um serviço por app e os serviços de apoio.", "- One `docker-compose.yml` at the root, with one service per app plus the support services.")
          : byLanguage("- O `docker-compose.yml` sobe só os serviços de apoio do desenvolvimento. Os apps rodam fora de container.", "- `docker-compose.yml` only runs the development support services. The apps run outside containers."),
        serviceLabels.length ? byLanguage(`- Serviços de apoio: ${serviceLabels.join(", ")}. Cada um com volume nomeado para os dados.`, `- Support services: ${serviceLabels.join(", ")}. Each one with a named volume for its data.`) : "",
        byLanguage("- Todos os serviços usam `restart: unless-stopped` e a mesma rede bridge `app-network`.", "- Every service uses `restart: unless-stopped` and the same `app-network` bridge network."),
        byLanguage("- Dentro da rede, os apps acessam os serviços pelo nome (`redis://redis:6379`), nunca por `localhost`.", "- Inside the network, apps reach services by name (`redis://redis:6379`), never `localhost`."),
        byLanguage("- Portas publicadas usam variável com padrão: `\"${PORT:-5000}:80\"`. Segredos não têm padrão.", "- Published ports use a variable with a default: `\"${PORT:-5000}:80\"`. Secrets have no default."),
        byLanguage("- `depends_on` define a ordem de subida: serviços de apoio antes da API e API antes do frontend.", "- `depends_on` sets the startup order: support services before the API and the API before the frontend."),
        byLanguage("- Toda variável nova entra no `.env.example` e no serviço do compose no mesmo commit.", "- Every new variable goes into `.env.example` and into the compose service in the same commit.")
      ]
    : []

  const nginxRules: Record<NginxMode, string[]> = {
    none: [],
    spa: [
      byLanguage("- O nginx serve a build estática do frontend com fallback de SPA: `try_files $uri $uri/ /index.html`.", "- nginx serves the frontend static build with SPA fallback: `try_files $uri $uri/ /index.html`."),
      isFullstack ? byLanguage("- A API não passa pelo nginx: fica exposta na própria porta ou domínio, e o frontend chama `VITE_API_URL`.", "- The API does not go through nginx: it is exposed on its own port or domain, and the frontend calls `VITE_API_URL`.") : ""
    ],
    gateway: [
      byLanguage("- O nginx é a única porta de entrada: serve o frontend e repassa `/api/` para o container da API.", "- nginx is the only entry point: it serves the frontend and forwards `/api/` to the API container."),
      byLanguage("- O frontend chama a API por caminho relativo (`VITE_API_URL=/api`). Sem CORS entre os dois.", "- The frontend calls the API through a relative path (`VITE_API_URL=/api`). No CORS between them."),
      byLanguage("- A API não publica porta no host, só `expose: 80` dentro da rede.", "- The API does not publish a host port, only `expose: 80` inside the network.")
    ],
    reverseProxy: [
      byLanguage("- O nginx fica na frente da API como proxy reverso, com a config em `nginx/nginx.conf`.", "- nginx sits in front of the API as a reverse proxy, with its config in `nginx/nginx.conf`."),
      byLanguage("- O proxy repassa `Host`, `X-Real-IP`, `X-Forwarded-For` e `X-Forwarded-Proto`. A API confia nesses headers para IP e protocolo.", "- The proxy forwards `Host`, `X-Real-IP`, `X-Forwarded-For` and `X-Forwarded-Proto`. The API trusts these headers for IP and protocol."),
      deploy.hasDocker ? byLanguage("- A API não publica porta no host, só `expose: 80` dentro da rede.", "- The API does not publish a host port, only `expose: 80` inside the network.") : ""
    ]
  }

  const staticRules =
    mode === "spa" || mode === "gateway"
      ? [
          byLanguage("- `gzip` ligado para texto, JS, CSS, JSON e SVG.", "- `gzip` on for text, JS, CSS, JSON and SVG."),
          byLanguage("- Headers de segurança em toda resposta: `X-Frame-Options`, `X-Content-Type-Options` e `Referrer-Policy`.", "- Security headers on every response: `X-Frame-Options`, `X-Content-Type-Options` and `Referrer-Policy`."),
          byLanguage("- Cache: `/assets/` com 1 ano e `immutable`; `index.html` sem cache para atualizar na hora.", "- Cache: `/assets/` for 1 year and `immutable`; `index.html` never cached so updates are instant.")
        ]
      : []

  const nginx =
    mode === "none"
      ? []
      : ["", "### Nginx", "", ...nginxRules[mode], ...staticRules, byLanguage("- Endpoint `/healthz` responde 200 para o healthcheck.", "- The `/healthz` endpoint returns 200 for the healthcheck.")]

  const files = buildDeployFiles(config).map((file) => `#### \`${file.path}\`\n\n${code(file.code, fileLanguage(file.path))}`)
  const reference = files.length ? ["", `### ${byLanguage("Arquivos de referência", "Reference files")}`, "", files.join("\n\n")] : []

  return [...docker, ...compose, ...nginx, ...reference].filter((line) => line !== null && line !== undefined).filter((line, index, lines) => line !== "" || lines[index - 1] !== "").join("\n").replace(/\n{3,}/g, "\n\n").trim()
}
