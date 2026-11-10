# minhaskill

Frontend do **minhaskill**, um gerador de skills para o Claude Code. A pessoa escolhe o tipo de projeto, a stack, a arquitetura, a nomenclatura e as convenções de código, vê o resultado ao vivo e baixa um `SKILL.md` pronto para instalar em `.claude/skills/`.

Construído com React + Vite + TypeScript.

## Stack

- React 19 + React Router 7
- Vite 8
- TypeScript
- [enchase](https://www.npmjs.com/package/enchase) (design system: componentes, tema claro/escuro e toasts)
- Zustand (estado global)

## Estrutura

```
src/
  components/   componentes reutilizáveis (ChoiceCards, OptionChips, CodeBlock, FileTree)
  config/       configurações gerais da aplicação
  data/         catálogos de opções, vocabulário e presets do gerador
  pages/        páginas (generator, notFound)
  providers/    providers do enchase (tema, locale pt-BR, navegação, toasts)
  routes/       definição de rotas
  stores/       stores do Zustand (estado do gerador, salvo no navegador)
  styles/       tema do enchase (`theme.ts`)
  types/        tipos do domínio
  utils/        geração do SKILL.md, do código de exemplo e da estrutura de pastas
```

Aliases de import: `@/`, `@components/`, `@pages/`, `@routes/`, `@stores/`, `@styles/`, `@utils/`, `@assets/`.

## Design

O tema fica em `src/styles/theme.ts` (`brand`, `shape`, `style`...). A documentação completa da lib vem no pacote, em `node_modules/enchase/API.md`, e também está no [Storybook](https://enchase.othiagosilva.com.br/docs/).

## Rodando localmente

```bash
npm install
cp .env.example .env
npm run dev
```

O servidor sobe em `http://localhost:8080`.

## Scripts

- `npm run dev` — servidor de desenvolvimento
- `npm run build` — build de produção em `build/`
- `npm run preview` — pré-visualiza o build
- `npm run typecheck` — checagem de tipos

## Docker

```bash
docker build -t minhaskill .
docker run -p 80:80 minhaskill
```
