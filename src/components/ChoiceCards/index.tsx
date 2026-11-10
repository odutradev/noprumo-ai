import { useId } from 'react'
import { Badge } from 'enchase'
import { CheckIcon } from 'enchase/icons'

import CodeBlock from '@components/CodeBlock'

import type { ChoiceCardsProps } from './types'
import styles from './styles.module.css'

const ChoiceCards = <T extends string>({ legend, description, options, value, onChange, minWidth = '15rem', renderExtra }: ChoiceCardsProps<T>) => {
  const name = useId()

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>{legend}</legend>
      {description && <p className={styles.description}>{description}</p>}
      <div className={styles.grid} style={{ gridTemplateColumns: `repeat(auto-fill, minmax(min(${minWidth}, 100%), 1fr))` }}>
        {options.map((option) => {
          const checked = option.value === value
          return (
            <label key={option.value} className={styles.card} data-checked={checked || undefined} data-disabled={option.disabled || undefined}>
              <input
                className={styles.input}
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                disabled={option.disabled}
                onChange={() => onChange(option.value)}
              />
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
      </div>
    </fieldset>
  )
}

export default ChoiceCards
