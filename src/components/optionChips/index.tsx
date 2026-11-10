import { Input } from "enchase"
import { useId } from "react"

import styles from "./styles"

import type { OptionChipsProps } from "./types"

const OptionChips = <T extends string>({ legend, description, options, value, onChange, customText, onCustomChange }: OptionChipsProps<T>) => {
  const name = useId()
  const isCustom = customText !== undefined

  const handleSelect = (next: T) => {
    if (isCustom) onCustomChange?.(undefined)
    onChange(next)
  }

  return (
    <fieldset className={styles.row}>
      <div className={styles.info}>
        <legend className={styles.legend}>{legend}</legend>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      <div className={styles.chips}>
        {options.map((option) => {
          const isChecked = !isCustom && option.value === value
          return (
            <label key={option.value} className={styles.chip} data-checked={isChecked || undefined}>
              <input className={styles.input} type="radio" name={name} value={option.value} checked={isChecked} onChange={() => handleSelect(option.value)} />
              {option.example && <code className={styles.example}>{option.example}</code>}
              <span className={styles.label}>{option.label}</span>
            </label>
          )
        })}
        {onCustomChange && (
          <label className={styles.chip} data-checked={isCustom || undefined}>
            <input className={styles.input} type="radio" name={name} value="__custom" checked={isCustom} onChange={() => onCustomChange("")} />
            <code className={styles.example}>…</code>
            <span className={styles.label}>Outro</span>
          </label>
        )}
        {isCustom && (
          <div className={styles.customInput}>
            <Input
              label={`Seu padrão para ${legend.toLowerCase()}`}
              value={customText}
              onChange={(event) => onCustomChange?.(event.target.value)}
              error={customText.trim() ? undefined : "Escreva o padrão para ele entrar na skill"}
              fullWidth
              autoFocus
            />
          </div>
        )}
      </div>
    </fieldset>
  )
}

export default OptionChips
