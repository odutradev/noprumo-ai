export interface StepperStep {
  label: string
  hint: string
}

export interface StepperProps {
  steps: StepperStep[]
  current: number
  onSelect: (index: number) => void
}
