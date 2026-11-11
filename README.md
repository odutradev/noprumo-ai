<p align="center">
  <a href="https://noprumo.odutra.com">
    <img src=".github/banner.svg" alt="noprumo · Sua IA no prumo." width="100%" />
  </a>
</p>

<p align="center">
  <a href="https://noprumo.odutra.com"><img src="https://img.shields.io/badge/site-noprumo.odutra.com-FF8A4C?style=flat-square&labelColor=0F1012" alt="Site" /></a>
  <a href="https://github.com/odutradev/noprumo-ai/stargazers"><img src="https://img.shields.io/github/stars/odutradev/noprumo-ai?style=flat-square&color=FF8A4C&labelColor=0F1012" alt="Estrelas no GitHub" /></a>
  <img src="https://img.shields.io/github/package-json/v/odutradev/noprumo-ai?style=flat-square&color=FF8A4C&labelColor=0F1012&label=vers%C3%A3o" alt="Versão" />
  <img src="https://img.shields.io/badge/pre%C3%A7o-gratuito-4CC38A?style=flat-square&labelColor=0F1012" alt="Gratuito" />
  <a href="LICENSE"><img src="https://img.shields.io/badge/licen%C3%A7a-MIT-FF8A4C?style=flat-square&labelColor=0F1012" alt="Licença MIT" /></a>
</p>

<p align="center">
  <strong>Transforme os seus padrões, ou os do seu time, em um guia que agentes de IA leem e seguem.</strong><br />
  Defina uma vez: a IA constrói do seu jeito.
</p>

<p align="center">
  <a href="https://noprumo.odutra.com/generator"><strong>Criar meu guia →</strong></a>
</p>

---

## O problema

Agentes de IA, como o Claude Code, escrevem código rápido. Mas, sem um padrão escrito, cada sessão inventa o seu: arquivo na pasta errada, outro jeito de nomear, commit fora do formato, arquitetura ignorada. E você passa o dia corrigindo.

## A solução

O **noprumo** é um gerador de guias de padrões. Você responde poucas etapas sobre o projeto e baixa um `CLAUDE.md` ou uma skill (`SKILL.md`) pronta para instalar. O agente lê o guia e passa a construir seguindo as suas regras: estrutura de pastas, nomenclatura, princípios de código, commits, deploy e publicação.

- **Gratuito e sem cadastro.** Tudo roda no navegador, e as suas escolhas ficam salvas só nele.
- **Prévia ao vivo.** A cada escolha, você vê o código de exemplo, a árvore de pastas e o arquivo final.
- **Pronto para colar.** O guia sai com seções numeradas, exemplos de certo e errado, código de referência e checklist de entrega.

## Como funciona

1. **Responda.** Tipo de projeto, stack, arquitetura, nomenclatura, convenções, commits, deploy e publicação. As opções têm um campo livre para escrever regras próprias.
2. **Veja ao vivo.** A prévia lateral mostra o código de exemplo, as pastas e o guia do jeito que a IA vai ler.
3. **Baixe e instale.** Um `CLAUDE.md` na raiz do projeto, ou uma skill em `.claude/skills/<nome>/SKILL.md`. No fullstack, sai um guia para a raiz e um para cada app.
4. **Construa no prumo.** O agente segue o padrão, e você volta a revisar o que importa.

## O que dá para configurar

| Etapa | O que você define |
| :--- | :--- |
| **Projeto** | Backend, frontend ou fullstack (monorepo com API e frontend). |
| **Stack** | Linguagem, framework, banco, validação, testes e bibliotecas. |
| **Arquitetura** | Domínios + Actions, Camadas, Clean, Hexagonal, Modular, DDD, Pastas por tipo, Feature-Sliced e outras. |
| **Nomenclatura** | Idioma dos identificadores e o padrão de cada elemento: arquivos, pastas, funções, tipos, constantes, rotas, tabelas e códigos de erro. |
| **Convenções** | Declaração de funções, exports, aliases, ordem dos imports, ponto e vírgula, aspas, comentários e princípios obrigatórios, com exemplos de certo e errado. |
| **Commits** | Formato (Conventional Commits ou livre), idioma, granularidade, escopo, coautoria de IA, branches e o resumo `{hash} {mensagem}` ao terminar. |
| **Deploy** | Dockerfile, `.dockerignore`, `docker-compose` e nginx. |
| **Publicação** | Fluxo de versão, build e push com o [project-publisher](https://www.npmjs.com/package/project-publisher). |
| **Resultado** | Formato (`CLAUDE.md` ou skill), idioma do guia e download. |

### Stacks suportadas

| Tipo | Linguagens | Destaques |
| :--- | :--- | :--- |
| **Backend** | TypeScript, JavaScript e Go | Express, Fastify, NestJS, Hono · Prisma, Drizzle, TypeORM, Mongoose · net/http, chi, Gin, Echo, Fiber · pgx, sqlc, GORM |
| **Frontend** | TypeScript e JavaScript | React + Vite, Next.js, Vue · Zustand, Redux, Jotai, Context · Axios, Fetch, TanStack Query · CSS Modules, Tailwind, Sass, Styled Components |
| **Fullstack** | TypeScript, JavaScript e Go na API | Monorepo com workspaces, guia raiz e um guia por app |

### Guia em inglês, resposta em português

O idioma recomendado para o guia é o inglês, porque os modelos seguem instruções em inglês com mais precisão. O guia em inglês já pede que o agente converse com você sempre em português. Se preferir, o guia também sai inteiro em português.

## Rodando localmente

Requisitos: Node.js 22 ou mais recente.

```bash
git clone https://github.com/odutradev/noprumo-ai.git
cd noprumo-ai
npm install
cp .env.example .env
npm run dev
```

O servidor sobe em `http://localhost:8080`.

### Scripts

| Comando | O que faz |
| :--- | :--- |
| `npm run dev` | Servidor de desenvolvimento com Vite. |
| `npm run build` | Build de produção em `build/`. |
| `npm run preview` | Pré-visualiza o build. |
| `npm run typecheck` | Checagem de tipos do TypeScript. |
| `npm run lint` | ESLint com as regras do projeto. |
| `npm run lint:fix` | Corrige o que o ESLint resolve sozinho. |

### Docker

A imagem faz o build com Node e serve os arquivos estáticos com nginx.

```bash
docker build -t noprumo .
docker run -p 8080:80 noprumo
```

### Deploy com Dokploy e análise de acesso (Umami)

O `docker-compose.yml` sobe o site e um [Umami](https://umami.is) self-hosted com Postgres. O Umami não usa cookies e não guarda dados pessoais. O script e os eventos passam pelo nginx do site em `/pulse`, então o CSP continua só com `'self'` e os bloqueadores de anúncio barram menos.

1. No Dokploy, crie um serviço **Compose** apontando para este repositório, com o arquivo `docker-compose.yml`.
2. Em **Environment**, defina as variáveis. Use valores em hex, sem caracteres especiais, gerados com `openssl rand -hex 32`:

   | Variável | Para quê |
   | :--- | :--- |
   | `UMAMI_DB_PASSWORD` | Senha do Postgres do Umami. |
   | `UMAMI_APP_SECRET` | Segredo dos tokens de login do Umami. |
   | `UMAMI_TWO_FACTOR_KEY` | Chave de 64 caracteres hex para o 2FA. |
   | `UMAMI_WEBSITE_ID` | ID do site no Umami. Fica vazio no primeiro deploy. |

3. Em **Domains**, ligue o domínio do site ao serviço `app` na porta `80` e um domínio para o painel (por exemplo, `umami.seudominio.com`) ao serviço `noprumo-analytics` na porta `3000`.
4. Faça o deploy, entre no painel com `admin` / `umami` e **troque a senha na hora**.
5. Cadastre o site no Umami, copie o ID para `UMAMI_WEBSITE_ID` e faça o deploy de novo. O ID entra no build, então sem ele o site funciona normalmente, só que sem registrar acessos.

Toda a configuração fica em [`src/assets/config/analytics`](src/assets/config/analytics/index.ts) e os eventos são tipados em [`src/utils/types/analytics`](src/utils/types/analytics/index.ts). Nos componentes, use o hook `useAnalytics`:

```tsx
const { track } = useAnalytics()

track("guide-download", { format, projectType, language, outputLanguage, files: 1 })
```

Em desenvolvimento nada é enviado: os eventos aparecem só no console, pelo logger.

## Stack do projeto

- [React 19](https://react.dev) e [React Router 7](https://reactrouter.com)
- [Vite](https://vite.dev) e TypeScript em modo strict
- [enchase](https://www.npmjs.com/package/enchase): componentes, tema claro e escuro, toasts e ícones
- [Zustand](https://zustand.docs.pmnd.rs) com persistência no navegador
- [Zod](https://zod.dev) para validação
- CSS Modules com os tokens do tema (`var(--enchase-*)`)
- Geist e Geist Mono como fontes

## Estrutura

O projeto segue o próprio guia, em [`.claude/CLAUDE.md`](.claude/CLAUDE.md), gerado pelo noprumo.

```text
src/
├── assets/
│   ├── config/       nome, título, versão e links da aplicação
│   └── data/         opções, vocabulário, presets e textos do gerador
├── components/       um componente por pasta: index.tsx, styles.module.css e types.ts
├── hooks/            hooks customizados, como useAction e useScrollProgress
├── pages/            uma pasta por página, cada uma com seus metadados
├── providers/        providers do enchase: tema, locale pt-BR, navegação e toasts
├── routes/           tabela de rotas
├── stores/           estado do gerador, salvo no navegador
├── styles/           tema do enchase e estilos globais
└── utils/
    ├── functions/    geração dos guias, do código de exemplo e utilitários
    ├── types/        tipos do domínio
    └── validations/  schemas do Zod
```

Cada pasta raiz de `src` tem um alias de import: `@assets/`, `@components/`, `@hooks/`, `@pages/`, `@providers`, `@routes/`, `@stores/`, `@styles/` e `@utils/`.

### Padrões de código

- Sem ponto e vírgula, com aspas duplas e zero comentários.
- Sem `let`, `for`, `while` e `any`.
- Imports em 3 blocos (externos, internos e `import type`), do maior para o menor.
- Commits em inglês no formato Conventional Commits, sem escopo.

O `npm run lint` garante a maior parte dessas regras.

## Publicação

A versão, o build e o push são feitos com o [project-publisher](https://www.npmjs.com/package/project-publisher):

```bash
npx project-publisher --bump-package --build --push
```

O comando sobe o patch do `package.json`, roda o build e faz o commit `chore: bump version to X` com push para a `master`.

## Licença

Distribuído sob a licença MIT. Veja o arquivo [LICENSE](LICENSE).

## Apoie o projeto

O noprumo é gratuito e não tem custo nenhum para quem usa. Se ele te ajudou, [deixe uma estrela no GitHub](https://github.com/odutradev/noprumo-ai): é o jeito mais simples de apoiar e fazer o projeto chegar a mais gente.

---

<p align="center">
  Feito com ♥ por <a href="https://odutra.com">odutradev</a>
</p>
