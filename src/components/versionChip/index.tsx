import styles from "./styles.module.css"
import appConfig from "@assets/config"

import type { VersionChipProps } from "./types"

const VersionChip = ({ className }: VersionChipProps) => (
  <span className={[styles.chip, className].filter(Boolean).join(" ")} aria-label={`Versão ${appConfig.version}`}>
    v{appConfig.version}
  </span>
)

export default VersionChip
