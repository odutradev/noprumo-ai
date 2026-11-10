export interface ChipOption<T extends string> {
  value: T
  label: string
  example?: string
}

export interface OptionChipsProps<T extends string> {
  legend: string
  description?: string
  options: ChipOption<T>[]
  value: T
  onChange: (value: T) => void
}
