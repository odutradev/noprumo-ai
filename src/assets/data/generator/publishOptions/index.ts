import type { ChoiceOption, PublisherInvocation, PublishPrompt } from "@utils/types/generator"
import type { PublishActionInfo } from "@utils/types/publishing"

export const publishActionOptions: PublishActionInfo[] = [
  { value: "bumpPackage", flag: "--bump-package", label: "Subir versão", description: "Incrementa o patch do package.json (1.0.9 vira 1.1.0)." },
  { value: "bumpManifest", flag: "--bump-manifest", label: "Atualizar manifest", description: "Copia a versão do package.json para o manifest.json (extensões e PWAs)." },
  { value: "build", flag: "--build", label: "Buildar", description: "Roda o script de build do package.json." },
  { value: "buildZip", flag: "--build-zip", label: "Empacotar em ZIP", description: "Gera um ZIP versionado na pasta builds." },
  { value: "clean", flag: "--clean", label: "Limpar builds antigos", description: "Mantém só os 3 ZIPs mais recentes." },
  { value: "push", flag: "--push", label: "Subir para o git", description: "Faz git add, commit \"chore: bump version to X\" e push na branch." },
  { value: "npmPublish", flag: "--npm-publish", label: "Publicar no npm", description: "Roda npm publish do pacote." }
]

export const publisherInvocationOptions: ChoiceOption<PublisherInvocation>[] = [
  { value: "npx", label: "npx", description: "Roda sem instalar nada no projeto.", example: "npx project-publisher --bump-package --push" },
  { value: "global", label: "Instalado globalmente", description: "Usa o atalho pub depois de npm install -g project-publisher.", example: "pub --bump-package --push" },
  { value: "script", label: "Script do package.json", description: "Os comandos ficam em scripts e o Claude roda npm run.", example: "npm run release" }
]

export const publishPromptOptions: ChoiceOption<PublishPrompt>[] = [
  { value: "everyTask", label: "Ao final de toda tarefa", description: "Sempre que uma tarefa alterar arquivos, o Claude termina perguntando se quer subir a versão e publicar." },
  { value: "onRequest", label: "Só quando pedido", description: "O Claude só publica quando você pedir, usando os comandos definidos aqui." }
]
