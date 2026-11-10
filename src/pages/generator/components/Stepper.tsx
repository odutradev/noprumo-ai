import { CheckIcon } from 'enchase/icons'

import styles from './styles.module.css'

interface StepperProps {
  steps: { label: string; hint: string }[]
  current: number
  onSelect: (index: number) => void
}

const Stepper = ({ steps, current, onSelect }: StepperProps) => (
  <nav aria-label="Etapas do gerador">
    <ol className={styles.stepper}>
      {steps.map((step, index) => {
        const state = index < current ? 'done' : index === current ? 'current' : 'next'
        return (
          <li key={step.label}>
            <button type="button" className={styles.step} data-state={state} aria-current={state === 'current' ? 'step' : undefined} onClick={() => onSelect(index)}>
              <span className={styles.bullet} aria-hidden="true">
                {state === 'done' ? <CheckIcon size={14} /> : index + 1}
              </span>
              <span className={styles.stepText}>
                <span className={styles.stepLabel}>{step.label}</span>
                <span className={styles.stepHint}>{step.hint}</span>
              </span>
            </button>
          </li>
        )
      })}
    </ol>
  </nav>
)

export default Stepper
