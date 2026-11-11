# noprumo

**Sua IA no prumo.**

Frontend do **noprumo**, que transforma os padrões do seu time em instruções que agentes de IA seguem. A pessoa escolhe o tipo de projeto (backend, frontend ou fullstack), a stack, a arquitetura, a nomenclatura, as convenções de código, commits, Docker e publicação, vê o resultado ao vivo e baixa um `SKILL.md` ou `CLAUDE.md` pronto para instalar.

Construído com React + Vite + TypeScript.

## Stack

- React 19 + React Router 7
- Vite 8
- TypeScript
- [enchase](https://www.npmjs.com/package/enchase) (design system: componentes, tema claro/escuro e toasts)
- Zustand (estado global)
- Zod (validação de formulários)
- ESLint (regras de código da skill do projeto)

## Estrutura

O projeto segue o guia `.claude/CLAUDE.md` (pastas por tipo).

```
src/
  assets/
    config/       configurações gerais da aplicação
    data/         catálogos de opções, vocabulário e presets do gerador
  components/     um componente por pasta (index.tsx, styles.ts, types.ts)
  hooks/          hooks customizados (useAction, useCustomField)
  pages/          páginas (generator, notFound), cada uma com seus metadados
  providers/      providers do enchase (tema, locale pt-BR, navegação, toasts)
  routes/         tabela de rotas
  stores/         stores do Zustand (estado do gerador, salvo no navegador)
  styles/         tema do enchase (`theme.ts`)
  utils/
    functions/    geração do SKILL.md, do código de exemplo, logger e helpers
    types/        tipos do domínio
    validations/  schemas do Zod
```

Aliases de import, um por pasta raiz: `@assets/`, `@components/`, `@hooks/`, `@pages/`, `@providers`, `@routes/`, `@stores/`, `@styles/`, `@utils/`.

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
- `npm run lint` — ESLint com as regras da skill (aspas duplas, sem ponto e vírgula, sem comentários, sem `let`/`for`/`while`, sem `any`, sem `console`, imports em 3 blocos)
- `npm run lint:fix` — corrige o que for automático

## Docker

```bash
docker build -t noprumo .
docker run -p 80:80 noprumo
```
