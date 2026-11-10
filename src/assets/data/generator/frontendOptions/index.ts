import type {ApiLayer,
  AsyncActions,
  ChoiceOption,
  ComponentDeclaration,
  ComponentStructure,
  DataFetching,
  E2eTesting,
  FormValidation,
  FrontendFramework,
  StateManagement,
  Styling,
  UiLibrary} from "@utils/types/generator"

export const frontendFrameworkOptions: ChoiceOption<FrontendFramework>[] = [
  { value: "react", label: "React + Vite", description: "SPA com React Router, build rápido e code splitting por rota.", example: "createRoot(root).render(<App />)" },
  { value: "next", label: "Next.js", description: "App Router, Server Components e rotas por pasta.", example: "app/users/page.tsx" },
  { value: "vue", label: "Vue", description: "Single File Components e Composition API.", badge: "Em breve", disabled: true },
  { value: "angular", label: "Angular", description: "Framework completo com módulos e DI.", badge: "Em breve", disabled: true }
]

export const uiLibraryOptions: ChoiceOption<UiLibrary>[] = [
  { value: "mui", label: "Material UI", description: "Componentes base e sistema de temas do MUI.", example: "import { Button, Typography } from '@mui/material'" },
  { value: "shadcn", label: "shadcn/ui", description: "Componentes copiados para o projeto, sobre Radix.", example: "import { Button } from '@/components/ui/button'" },
  { value: "chakra", label: "Chakra UI", description: "Componentes com props de estilo e tema.", example: "import { Button } from '@chakra-ui/react'" },
  { value: "antd", label: "Ant Design", description: "Kit denso para painéis e sistemas internos.", example: "import { Button } from 'antd'" },
  { value: "none", label: "Sem biblioteca", description: "Componentes próprios do zero." }
]

export const stylingOptions: ChoiceOption<Styling>[] = [
  { value: "styledComponents", label: "Styled Components", description: "Estilos em `styles.ts` com acesso ao tema.", example: "export const Container = styled.div`\n  display: flex;\n`" },
  { value: "tailwind", label: "Tailwind CSS", description: "Classes utilitárias direto no JSX.", example: "<div className=\"flex gap-4 p-4\" />" },
  { value: "cssModules", label: "CSS Modules", description: "CSS com escopo por componente.", example: "import styles from './styles.module.css'" },
  { value: "sass", label: "Sass Modules", description: "SCSS com escopo por componente.", example: "import styles from './styles.module.scss'" }
]

export const stateOptions: ChoiceOption<StateManagement>[] = [
  { value: "zustand", label: "Zustand", description: "Stores pequenas, com persistência via middleware.", example: "const { user, setUser } = useUserStore()" },
  { value: "redux", label: "Redux Toolkit", description: "Slices, actions e store central.", example: "const user = useAppSelector((state) => state.user)" },
  { value: "context", label: "Context API", description: "Providers do próprio React, sem dependência.", example: "const { user } = useUserContext()" },
  { value: "jotai", label: "Jotai", description: "Estado atômico e derivado.", example: "const [user, setUser] = useAtom(userAtom)" }
]

export const dataFetchingOptions: ChoiceOption<DataFetching>[] = [
  { value: "axios", label: "Axios", description: "Instância configurada com baseURL e interceptors.", example: "const { data } = await api.get('/users')" },
  { value: "fetch", label: "Fetch nativo", description: "Sem dependência, com um wrapper do projeto.", example: "const response = await fetch(`${BASE_URL}/users`)" },
  { value: "reactQuery", label: "TanStack Query", description: "Cache, revalidação e mutations declarativas.", example: "const { data } = useQuery({ queryKey: ['users'], queryFn: getUsers })" }
]

export const formValidationOptions: ChoiceOption<FormValidation>[] = [
  { value: "yup", label: "Yup", description: "Schemas de validação para formulários.", example: "const userSchema = yup.object({ name: yup.string().required() })" },
  { value: "zod", label: "Zod", description: "Schemas com tipos inferidos.", example: "const userSchema = z.object({ name: z.string().min(1) })" },
  { value: "none", label: "Sem schema", description: "Validação manual nos formulários." }
]

export const e2eOptions: ChoiceOption<E2eTesting>[] = [
  { value: "cypress", label: "Cypress", description: "Cenários numerados em `cypress/e2e`, com comandos e factories próprios.", example: "cy.auth('admin', 'password')" },
  { value: "playwright", label: "Playwright", description: "Testes em vários navegadores, em paralelo.", example: "await page.getByRole('button', { name: 'Salvar' }).click()" },
  { value: "none", label: "Sem E2E", description: "A skill não vai exigir testes ponta a ponta." }
]

export const componentDeclarationOptions: ChoiceOption<ComponentDeclaration>[] = [
  { value: "arrowFC", label: "Arrow com React.FC", description: "Arrow function tipada com `React.FC<Props>`.", example: "const UserCard: React.FC<UserCardProps> = ({ name }) => {\n  return <div>{name}</div>\n}" },
  { value: "arrowProps", label: "Arrow com props tipadas", description: "Arrow function com o tipo nas props.", example: "const UserCard = ({ name }: UserCardProps) => {\n  return <div>{name}</div>\n}" },
  { value: "function", label: "function", description: "Declaração clássica de função.", example: "function UserCard({ name }: UserCardProps) {\n  return <div>{name}</div>\n}" }
]

export const componentStructureOptions: ChoiceOption<ComponentStructure>[] = [
  { value: "folderTriad", label: "Pasta com index, styles e types", description: "Um componente por pasta com `index.tsx`, `styles.ts` e `types.ts`.", example: "userCard/\n├── index.tsx\n├── styles.ts\n└── types.ts" },
  { value: "folderNamed", label: "Pasta com arquivos nomeados", description: "Arquivos com o nome do componente e um `index.ts` que reexporta.", example: "UserCard/\n├── UserCard.tsx\n├── UserCard.styles.ts\n├── UserCard.types.ts\n└── index.ts" },
  { value: "singleFile", label: "Arquivo único", description: "Componente e tipos no mesmo arquivo.", example: "UserCard.tsx" }
]

export const apiLayerOptions: ChoiceOption<ApiLayer>[] = [
  { value: "actionsFolder", label: "Pasta actions/", description: "Chamadas à API agrupadas por domínio em `src/actions/<dominio>`.", example: "import { updateUser } from '@actions/user'" },
  { value: "servicesFolder", label: "Pasta services/", description: "Um service por recurso da API.", example: "import { userService } from '@services/user'" },
  { value: "colocated", label: "Junto da feature", description: "Cada feature tem seu próprio arquivo de API.", example: "import { updateUser } from './api'" }
]

export const asyncActionsOptions: ChoiceOption<AsyncActions>[] = [
  { value: "useAction", label: "Hook useAction", description: "Um hook único executa a ação com toasts de pending, success e error e um callback no fim.", example: "useAction({\n  action: async () => await updateUser(data),\n  toastMessages: { pending: 'Salvando...', success: 'Salvo', error: 'Erro ao salvar' },\n  callback: () => navigate('/users')\n})" },
  { value: "tryCatch", label: "try/catch local", description: "Cada handler trata loading e erro.", example: "try {\n  await updateUser(data)\n} catch (error) {\n  toast.error(error.message)\n}" },
  { value: "mutationHook", label: "Hooks de mutation", description: "Um hook por mutation, com estado da requisição.", example: "const { mutate, isPending } = useUpdateUser()" }
]
