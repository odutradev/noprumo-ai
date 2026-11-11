import { Button, Popover } from "enchase"
import { CheckIcon } from "enchase/icons"

import styles from "./styles.module.css"

import type { CheckCardProps } from "./types"

const CheckCard = ({ label, description, isChecked, onToggle, extra, details }: CheckCardProps) => (
  <div className={styles.card} data-checked={isChecked || undefined}>
    <label className={styles.main}>
      <input className={styles.input} type="checkbox" checked={isChecked} onChange={onToggle} />
      <span className={styles.head}>
        <span className={styles.box} aria-hidden="true">
          {isChecked && <CheckIcon size={12} />}
        </span>
        <span className={styles.label}>{label}</span>
        {extra}
      </span>
      <span className={styles.text}>{description}</span>
    </label>
    {details && (
      <Popover content={details} label={`Exemplo de ${label}`} placement="bottom-end">
        <Button size="sm" variant="ghost" className={styles.detailsButton}>
          Exemplo
        </Button>
      </Popover>
    )}
  </div>
)

export default CheckCard
