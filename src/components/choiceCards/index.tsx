import { useId } from 'react'
import { Badge, Input } from 'enchase'
import { CheckIcon } from 'enchase/icons'

import CodeBlock from '@components/codeBlock'

import type { ChoiceCardsProps } from './types'
import styles from './styles'

const ChoiceCards = <T extends string>({ legend, description, options, value, onChange, minWidth = '15rem', renderExtra, customText, onCustomChange }: ChoiceCardsProps<T>) => {
  const name = useId()
  const isCustom = customText !== undefined
  const allowCustom = onCustomChange !== undefined

  const select = (next: T) => {
    if (isCustom) onCustomChange?.(undefined)
    onChange(next)
  }

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>{legend}</legend>
      {description && <p className={styles.description}>{description}</p>}
      <div className={styles.grid} style={{ gridTemplateColumns: `repeat(auto-fill, minmax(min(${minWidth}, 100%), 1fr))` }}>
        {options.map((option) => {
          const checked = !isCustom && option.value === value
          return (
            <label key={option.value} className={styles.card} data-checked={checked || undefined} data-disabled={option.disabled || undefined}>
              <input className={styles.input} type="radio" name={name} value={option.value} checked={checked} disabled={option.disabled} onChange={() => select(option.value)} />
              <span className={styles.head}>
                <span className={styles.label}>{option.label}</span>
                {option.badge && (
                  <Badge size="sm" variant={option.disabled ? 'neutral' : 'primary'}>
                    {option.badge}
                  </Badge>
                )}
                <span className={styles.check} aria-hidden="true">
                  {checked && <CheckIcon size={14} />}
                </span>
              </span>
              <span className={styles.text}>{option.description}</span>
              {option.example && <CodeBlock code={option.example} compact />}
              {renderExtra?.(option)}
            </label>
          )
        })}
        {allowCustom && (
          <div className={styles.card} data-checked={isCustom || undefined}>
            <label className={styles.customLabel}>
              <input className={styles.input} type="radio" name={name} value="__custom" checked={isCustom} onChange={() => onCustomChange?.('')} />
              <span className={styles.head}>
                <span className={styles.label}>Outro</span>
                <span className={styles.check} aria-hidden="true">
                  {isCustom && <CheckIcon size={14} />}
                </span>
              </span>
              <span className={styles.text}>Descreva o seu padrão com as suas palavras.</span>
            </label>
            {isCustom && (
              <Input
                label={`Seu padrão para ${legend.toLowerCase()}`}
                value={customText}
                onChange={(event) => onCustomChange?.(event.target.value)}
                error={customText.trim() ? undefined : 'Escreva o padrão para ele entrar na skill'}
                fullWidth
                autoFocus
              />
            )}
          </div>
        )}
      </div>
    </fieldset>
  )
}

export default ChoiceCards
