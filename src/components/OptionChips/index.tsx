import { useId } from 'react'

import type { OptionChipsProps } from './types'
import styles from './styles.module.css'

const OptionChips = <T extends string>({ legend, description, options, value, onChange }: OptionChipsProps<T>) => {
  const name = useId()

  return (
    <fieldset className={styles.row}>
      <div className={styles.info}>
        <legend className={styles.legend}>{legend}</legend>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      <div className={styles.chips}>
        {options.map((option) => (
          <label key={option.value} className={styles.chip} data-checked={option.value === value || undefined}>
            <input className={styles.input} type="radio" name={name} value={option.value} checked={option.value === value} onChange={() => onChange(option.value)} />
            {option.example && <code className={styles.example}>{option.example}</code>}
            <span className={styles.label}>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export default OptionChips
