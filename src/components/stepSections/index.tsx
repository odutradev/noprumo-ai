import { Tabs } from "enchase"

import styles from "./styles.module.css"

import type { StepSectionsProps } from "./types"

const StepSections = ({ label, sections }: StepSectionsProps) => (
  <Tabs
    ariaLabel={label}
    className={styles.tabs}
    items={sections.map((section) => ({ value: section.value, label: section.label, content: <div className={styles.panel}>{section.content}</div> }))}
  />
)

export default StepSections
