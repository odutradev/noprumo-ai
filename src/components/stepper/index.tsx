import { CheckIcon } from "enchase/icons"

import styles from "./styles.module.css"

import type { StepperProps } from "./types"

const Stepper = ({ steps, current, onSelect }: StepperProps) => (
  <nav aria-label="Etapas do gerador" className={styles.nav}>
    <p className={styles.counter}>
      Etapa {current + 1} de {steps.length}
      <span className={styles.counterLabel}> · {steps[current].label}</span>
    </p>
    <ol className={styles.stepper}>
      {steps.map((step, index) => {
        const state = index < current ? "done" : index === current ? "current" : "next"
        return (
          <li key={step.label}>
            <button type="button" className={styles.step} data-state={state} aria-current={state === "current" ? "step" : undefined} aria-label={`${index + 1}. ${step.label}`} onClick={() => onSelect(index)}>
              <span className={styles.bullet} aria-hidden="true">
                {state === "done" ? <CheckIcon size={12} /> : index + 1}
              </span>
              <span className={styles.stepText} aria-hidden="true">
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
