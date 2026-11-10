# minhaskill

Frontend do **minhaskill**, construído com React + Vite + TypeScript.

## Stack

- React 18 + React Router
- Vite
- TypeScript
- Zustand (estado global)
- Tailwind CSS (via CDN, tokens de tema em `index.html`)
- react-icons

## Estrutura

```
src/
  components/   componentes reutilizáveis (ex.: Icon)
  config/       configurações gerais da aplicação
  pages/        páginas (home, notFound)
  routes/       definição de rotas
  stores/       stores do Zustand (system: tema claro/escuro)
  styles/       helpers de tema
  utils/        funções utilitárias
```

Aliases de import: `@/`, `@components/`, `@pages/`, `@routes/`, `@stores/`, `@styles/`, `@utils/`, `@assets/`.

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
