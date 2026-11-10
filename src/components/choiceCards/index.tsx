import { Badge, Input } from "enchase"
import { useId } from "react"

import CodeBlock from "@components/codeBlock"
import styles from "./styles"

import type { ChoiceCardsProps } from "./types"

const ChoiceCards = <T extends string>({ legend, description, options, value, onChange, minWidth = "11rem", hasExample = true, customText, onCustomChange }: ChoiceCardsProps<T>) => {
  const name = useId()
  const isCustom = customText !== undefined
  const hasCustomOption = onCustomChange !== undefined
  const selected = options.find((option) => option.value === value)
  const example = hasExample && !isCustom ? selected?.example : undefined

  const handleSelect = (next: T) => {
    if (isCustom) onCustomChange?.(undefined)
    onChange(next)
  }

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>{legend}</legend>
      {description && <p className={styles.description}>{description}</p>}
      <div className={styles.grid} style={{ gridTemplateColumns: `repeat(auto-fill, minmax(min(${minWidth}, 100%), 1fr))` }}>
        {options.map((option) => {
          const isChecked = !isCustom && option.value === value
          return (
            <label key={option.value} className={styles.card} data-checked={isChecked || undefined} data-disabled={option.isDisabled || undefined}>
              <input className={styles.input} type="radio" name={name} value={option.value} checked={isChecked} disabled={option.isDisabled} onChange={() => handleSelect(option.value)} />
              <span className={styles.head}>
                <span className={styles.radio} aria-hidden="true" />
                <span className={styles.label}>{option.label}</span>
                {option.badge && (
                  <Badge size="sm" variant={option.isDisabled ? "neutral" : "primary"}>
                    {option.badge}
                  </Badge>
                )}
              </span>
              {option.description && <span className={styles.text}>{option.description}</span>}
            </label>
          )
        })}
        {hasCustomOption && (
          <label className={styles.card} data-checked={isCustom || undefined}>
            <input className={styles.input} type="radio" name={name} value="__custom" checked={isCustom} onChange={() => onCustomChange?.("")} />
            <span className={styles.head}>
              <span className={styles.radio} aria-hidden="true" />
              <span className={styles.label}>Outro</span>
            </span>
            <span className={styles.text}>Descreva com as suas palavras.</span>
          </label>
        )}
      </div>
      {isCustom && (
        <div className={styles.custom}>
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
      {example && (
        <div className={styles.example}>
          <CodeBlock code={example} isCompact />
        </div>
      )}
    </fieldset>
  )
}

export default ChoiceCards
