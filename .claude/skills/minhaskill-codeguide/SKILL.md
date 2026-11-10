---
name: minhaskill-codeguide
description: Padrões obrigatórios de arquitetura, componentes, nomenclatura e código do frontend. Use ao criar, refatorar ou revisar páginas, componentes, hooks, stores e chamadas à API deste projeto.
---

# Guia de padrões do frontend

Este guia define as regras de arquitetura, componentes, estado e código deste frontend. Seguir este guia é **obrigatório**.

**Diretriz:** antes de criar ou refatorar páginas, componentes, hooks ou stores, leia este guia e reproduza exatamente a estrutura e os padrões descritos aqui. Antes de criar um componente ou hook, procure um equivalente que já exista no projeto.

## 1. Stack

| Item | Escolha |
| :--- | :--- |
| Framework | React + Vite |
| Linguagem | TypeScript (100% tipado) |
| Componentes base | https://www.npmjs.com/package/enchase |
| Estilização | https://www.npmjs.com/package/enchase   de acordo com essa biblioteca |
| Estado global | Zustand |
| Requisições | Axios |
| Formulários | Zod |
| Testes E2E | Sem E2E |

## 2. Arquitetura: Pastas por tipo

A raiz de `src` separa o código pelo papel: actions de API, componentes, hooks, páginas, rotas, stores, estilos e utilitários.

**Regras:**

- Chamadas à API ficam em `src/actions/<dominio>`. Componentes e páginas nunca chamam o client HTTP direto.
- Componentes reutilizáveis ficam em `src/components`, um por pasta.
- Hooks customizados ficam em `src/hooks`, um por pasta, sempre com prefixo `use`.
- Cada página fica em `src/pages/<pagina>` e declara seus metadados de layout (título, permissões).
- Estado global fica em `src/stores/<store>`. Estado local fica no componente.
- Funções auxiliares, tipos e validações ficam em `src/utils/functions`, `src/utils/types` e `src/utils/validations`.

**Estrutura de pastas:**

```text
.
└── src/
    ├── actions/
    │   └── user/
    │       └── index.ts  # chamadas à API
    ├── assets/
    │   ├── config/
    │   │   └── index.ts
    │   └── data/
    │       └── index.ts  # dados estáticos
    ├── components/
    │   └── userCard/
    │       ├── index.tsx  # componente
    │       ├── styles.ts  # estilos
    │       └── types.ts  # props
    ├── hooks/
    │   └── useAction/
    │       └── index.ts  # hook
    ├── pages/
    │   └── users/
    │       └── index.tsx  # página
    ├── routes/
    │   └── index.tsx  # rotas e proteção
    ├── stores/
    │   ├── system/
    │   │   └── index.ts  # tema e permissões
    │   └── user/
    │       └── index.ts  # estado global
    ├── styles/
    │   └── theme.ts
    └── utils/
        ├── functions/
        │   └── index.ts
        ├── types/
        │   └── user/
        │       └── index.ts  # tipos
        ├── validations/
        │   └── user/
        │       └── index.ts
        └── api.ts  # instância HTTP
```

## 3. Nomenclatura

- **Idioma dos identificadores:** Inglês. Textos exibidos para o usuário ficam em português.

| Elemento | Padrão | Exemplo |
| :--- | :--- | :--- |
| Componentes | PascalCase | `<UserCard />` |
| Funções e hooks | camelCase | `updateUser(), useUserStore()` |
| Variáveis e props | camelCase | `userId, foundUser` |
| Tipos e interfaces | PascalCase | `interface UserCardProps {}` |
| Constantes e dados estáticos | camelCase | `const baseUrl = import.meta.env.VITE_BASEURL` |
| Pastas e arquivos de componentes | camelCase | `userCard/` |
| Arquivos de utilitários | camelCase | `userService/index.ts` |
| Pastas | camelCase | `validations/` |
| Hooks | prefixo `use` + camelCase | `useUserStore` |
| Handlers de evento | Prefixo handle | `handleSave` |
| Props de callback | prefixo `on` | `onSaved` |
| Prefixo de tipos | Sem prefixo | `UserCardProps` |
| Booleanos | Com verbo (is, has, should) | `isActive` |
| Organização de utilitários | Pasta + index.ts | `userService/index.ts` |
| Variáveis de ambiente | SCREAMING_SNAKE com prefixo do bundler | `VITE_BASEURL` |

## 4. Componentes

- **Declaração:** Arrow com props tipadas. Arrow function com o tipo nas props.
- **Estrutura:** Pasta com index, styles e types. Um componente por pasta com `index.tsx`, `styles.ts` e `types.ts`.
- **Exports:** Misto. Default para o componente, hook ou store principal do arquivo e named para tipos e funções de API. Um componente por arquivo.
- **Props:** sempre tipadas no arquivo de tipos do componente.
- **Componentes base:** https://www.npmjs.com/package/enchase.
- **Estilos:** https://www.npmjs.com/package/enchase   de acordo com essa biblioteca.

```text
userCard/
├── index.tsx
├── styles.ts
└── types.ts
```

## 5. Estado

- **Local:** `useState` para estado que só o componente usa.
- **Global:** Zustand. Stores pequenas, com persistência via middleware.

```typescript
const { user, setUser } = useUserStore()
```

## 6. Dados e API

- **Camada de API:** Pasta actions/. Chamadas à API agrupadas por domínio em `src/actions/<dominio>`. Componentes e páginas nunca chamam o client HTTP direto.
- **Requisições:** Axios. Instância configurada com baseURL e interceptors.
- **Ações assíncronas:** Hook useAction. Um hook único executa a ação com toasts de pending, success e error e um callback no fim.

```typescript
useAction({
  action: async () => await updateUser(data),
  toastMessages: { pending: 'Salvando...', success: 'Salvo', error: 'Erro ao salvar' },
  callback: () => navigate('/users')
})
```

## 7. Formulários

**Zod**. Schemas com tipos inferidos. A submissão usa o padrão de ações assíncronas acima.

```typescript
const userSchema = z.object({ name: z.string().min(1) })
```

## 8. Estilo de código

- **Imports:** Alias por pasta. Um alias para cada pasta raiz do projeto.
- **Organização dos imports:** 3 blocos, do maior para o menor. Externos, internos e `import type`, separados por linha em branco e ordenados do maior para o menor. Desestruturação sempre em uma linha.
- **Ponto e vírgula:** Sem ponto e vírgula.
- **Aspas:** Aspas duplas. Atributos JSX sempre com aspas duplas.
- **Comentários:** Zero comentários. Proibido `//`, `/* */` e JSDoc. O código precisa ser autoexplicativo.

## 9. Princípios obrigatórios

### Retornos antecipados

Valide e saia cedo, sem `if/else` aninhado.

✅ Certo:
```typescript
if (!user) return manageError({ code: 'not_found' })
return user
```

❌ Errado:
```typescript
if (user) {
  return user
} else {
  return error
}
```

### Imutabilidade

Sem `let`, `for` e `while`. Use `map`, `filter`, `reduce` e spread.

✅ Certo:
```typescript
const names = users.map((user) => user.name)
```

❌ Errado:
```typescript
let names = []
for (const user of users) names.push(user.name)
```

### Tipagem estrita

`any` é proibido. Tipos vêm dos schemas e de interfaces.

✅ Certo:
```typescript
type User = z.infer<typeof userSchema>
```

❌ Errado:
```typescript
const user: any = req.body
```

### Logger em vez de console.log

Nada de `console.log` em produção. Use o logger do projeto.

✅ Certo:
```typescript
const logger = createLocalLogger('users')
logger.error(error)
```

❌ Errado:
```typescript
console.log(error)
```

### Assincronismo paralelo

`Promise.all` para chamadas sem dependência entre si.

✅ Certo:
```typescript
const [user, plans] = await Promise.all([findUser(id), listPlans()])
```

❌ Errado:
```typescript
const user = await findUser(id)
const plans = await listPlans()
```

### Não reinventar utilitários

Antes de criar um helper, procure um equivalente no core do projeto.

✅ Certo:
```typescript
import { formatDateBR } from '@utils/date'
```

❌ Errado:
```typescript
const format = (d: Date) => d.toLocaleDateString()
```

### Cores e espaços do tema

Nada de cor ou espaçamento fixo: use o tema.

✅ Certo:
```typescript
color: ${({ theme }) => theme.palette.primary.main};
```

❌ Errado:
```typescript
color: #1976d2;
```

### Stores persistidas

Estado que precisa sobreviver ao reload usa o middleware de persistência.

✅ Certo:
```typescript
create<UserStore>()(persist((set) => ({ ... }), { name: 'user' }))
```

## 10. Testes

- Testes unitários não são obrigatórios.
- Testes E2E não são obrigatórios.
- Antes de abrir um PR, rode o lint e a suíte E2E em modo headless.

## 11. Commits e Git

- **Formato:** Conventional Commits. `<type>: <descrição curta>`, com type entre `feat`, `fix`, `docs`, `style`, `refactor`, `test` e `chore`. Verbo no imperativo, sem ponto final.
- **Idioma:** Mensagens de commit em inglês.
- **Granularidade:** Por parte lógica. Ao terminar, agrupa as mudanças em partes coesas (configuração, tipos, feature, testes, docs) e faz um commit para cada.
- **Escopo:** Sem escopo. Só o tipo antes dos dois pontos.
- **Mensagem:** Só o título. Uma linha curta, até 72 caracteres.
- **Quando commitar:** Ao concluir a tarefa. Commita sem esperar pedido, assim que cada parte fica pronta e typecheck, lint e testes passam.
- **Coautoria de IA:** Sem coautoria de IA. Nunca adicionar `Co-Authored-By` nem menções à IA nas mensagens.
- Nunca commitar arquivos de ambiente (`.env`), segredos, builds ou `node_modules`.
- **Branches:** tipo/descricao. Prefixo do tipo de mudança e descrição em kebab-case.

Exemplo de histórico para uma feature:

```text
1a2b3c4  feat: add user types and actions
240eb3d  feat: add user card and profile page
2df22b6  test: add user profile e2e tests
37d5a2f  docs: document user profile
```

```text
feat/user-profile
fix/login-redirect
docs/readme
```

## 12. Publicação

Este projeto publica com o [project-publisher](https://www.npmjs.com/package/project-publisher). npx. Roda sem instalar nada no projeto.

| Flag | Etapa | O que faz |
| :--- | :--- | :--- |
| `--bump-package` | Subir versão | Incrementa o patch do package.json (1.0.9 vira 1.1.0). |
| `--build` | Buildar | Roda o script de build do package.json. |
| `--push` | Subir para o git | Faz git add, commit "chore: bump version to X" e push na branch. |

As etapas rodam na ordem das flags. Comando padrão:

```bash
npx project-publisher --bump-package --build --push
```

**Antes de publicar:**

- Commite todo o trabalho da tarefa seguindo as regras de commit. O `--push` roda `git add .` e cria o commit `chore: bump version to X`: qualquer mudança pendente iria junto nesse commit.
- A árvore de trabalho precisa estar limpa, exceto pelo que o próprio publish altera.
- O push vai para a branch `master`.
- O bump sobe só o patch. Para mudar minor ou major, edite a versão no `package.json` à mão antes de rodar.

### Pergunta obrigatória ao final de cada tarefa

Ao terminar **toda** tarefa que alterou arquivos, depois de commitar seguindo a seção de commits e com typecheck, lint e build passando, a última ação é perguntar se a pessoa quer publicar. Use a ferramenta de pergunta interativa (`AskUserQuestion`), que mostra uma caixa com botões:

- **Pergunta:** "Quer subir a versão e publicar?"
- **Cabeçalho:** "Publicar"
- **Opções:**
  - **Sim, publicar**: subir versão, buildar, subir para o git → roda `npx project-publisher --bump-package --build --push`
  - **Só versão e push**: subir versão, subir para o git → roda `npx project-publisher --bump-package --push`
  - **Agora não**: Nada é publicado.

Se a ferramenta não existir no ambiente, faça a mesma pergunta em texto como última linha da resposta, listando as opções.

- Só rode o comando da opção escolhida. Em "Agora não", não rode nada e não pergunte de novo na mesma tarefa.
- Não pergunte quando a tarefa não mudou arquivos (só perguntas, leituras ou explicações).
- Não pergunte se o build, os testes ou o typecheck falharam: corrija primeiro ou avise que a publicação ficou bloqueada.

## 13. Exemplo de referência

Use estes arquivos como modelo. Eles seguem todas as regras acima.

> Alguns padrões foram definidos à mão. Onde o exemplo divergir do texto das seções acima, siga o texto.

### `src/components/userCard/index.tsx`

```tsx
import { Button, Typography } from "@mui/material"

import { updateUser } from "@actions/user"
import useAction from "@hooks/useAction"
import { Container } from "./styles"

import type { UserCardProps } from "./types"

const UserCard = ({ userId, name, onSaved }: UserCardProps) => {
  const handleSave = () =>
    useAction({
      action: async () => await updateUser(userId, { name }),
      toastMessages: {
        pending: "Salvando...",
        success: "Salvo com sucesso",
        error: "Erro ao salvar"
      },
      callback: onSaved
    })

  return (
    <Container>
      <Typography variant="h6">{name}</Typography>
      <Button variant="contained" onClick={handleSave}>Salvar</Button>
    </Container>
  )
}

export default UserCard
```

### `src/components/userCard/styles.ts`

```typescript
import styled from "styled-components"

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(2)};
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
`
```

### `src/components/userCard/types.ts`

```typescript
export interface UserCardProps {
  userId: string
  name: string
  onSaved?: () => void
}
```

### `src/actions/user/index.ts`

```typescript
import api from "@utils/api"

import type { User } from "@utils/types/user"

export const updateUser = async (userId: string, data: Partial<User>) => {
  const response = await api.patch<User>(`/users/${userId}`, data)
  return response.data
}
```

### `src/stores/user/index.ts`

```typescript
import { persist } from "zustand/middleware"
import { create } from "zustand"

import type { User } from "@utils/types/user"

interface UserStore {
  user: User | null
  setUser: (user: User | null) => void
}

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user })
    }),
    { name: "user" }
  )
)

export default useUserStore
```

## 14. Checklist antes de entregar

- [ ] Nomes seguem a tabela de nomenclatura e estão em inglês.
- [ ] Arquivos estão na pasta certa da arquitetura.
- [ ] Componentes seguem "Pasta com index, styles e types" e "Arrow com props tipadas".
- [ ] Props e estado estão tipados, sem `any`.
- [ ] Chamadas à API passam por "Pasta actions/" e usam "Hook useAction".
- [ ] Estilos usam https://www.npmjs.com/package/enchase   de acordo com essa biblioteca com os tokens do tema.
- [ ] Imports seguem "Alias por pasta".
- [ ] Princípio "Retornos antecipados" aplicado.
- [ ] Princípio "Imutabilidade" aplicado.
- [ ] Princípio "Tipagem estrita" aplicado.
- [ ] Princípio "Logger em vez de console.log" aplicado.
- [ ] Princípio "Assincronismo paralelo" aplicado.
- [ ] Princípio "Não reinventar utilitários" aplicado.
- [ ] Princípio "Cores e espaços do tema" aplicado.
- [ ] Princípio "Stores persistidas" aplicado.
- [ ] Pergunta de publicação feita como última ação, se a tarefa alterou arquivos.
