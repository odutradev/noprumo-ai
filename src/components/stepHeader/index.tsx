import styles from "./styles"

import type { StepHeaderProps } from "./types"

const StepHeader = ({ title, description }: StepHeaderProps) => (
  <div>
    <h2 className={styles.title}>{title}</h2>
    <p className={styles.subtitle}>{description}</p>
  </div>
)

export default StepHeader
