import { Button } from "enchase"

import styles from "./styles.module.css"

import type { FullstackPartBannerProps } from "./types"

const partLabels = { backend: "backend", frontend: "frontend" } as const

const FullstackPartBanner = ({ part, folder, onFinish }: FullstackPartBannerProps) => (
  <div className={styles.banner} role="status">
    <span className={styles.marker} aria-hidden="true" />
    <div className={styles.text}>
      <span className={styles.eyebrow}>Fullstack · {folder}/</span>
      <p className={styles.title}>Editando os padrões do {partLabels[part]}</p>
      <p className={styles.description}>Essas escolhas valem só para a pasta {folder}/ do monorepo. Commits, deploy e publicação ficam na configuração do fullstack.</p>
    </div>
    <Button size="sm" variant="outline" onClick={onFinish} className={styles.action}>
      Voltar ao fullstack
    </Button>
  </div>
)

export default FullstackPartBanner
