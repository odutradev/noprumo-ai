import { CheckIcon } from "enchase/icons"

import styles from "./styles"

import type { CheckCardProps } from "./types"

const CheckCard = ({ label, description, isChecked, onToggle, extra, children }: CheckCardProps) => (
  <label className={styles.card} data-checked={isChecked || undefined}>
    <input className={styles.input} type="checkbox" checked={isChecked} onChange={onToggle} />
    <span className={styles.head}>
      <span className={styles.box} aria-hidden="true">
        {isChecked && <CheckIcon size={14} />}
      </span>
      <span className={styles.label}>{label}</span>
      {extra}
    </span>
    <span className={styles.text}>{description}</span>
    {children}
  </label>
)

export default CheckCard
