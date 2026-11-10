import type { ReactNode } from 'react'

import type { ChoiceOption } from '@/types/generator'

export interface ChoiceCardsProps<T extends string> {
  legend: string
  description?: string
  options: ChoiceOption<T>[]
  value: T
  onChange: (value: T) => void
  minWidth?: string
  renderExtra?: (option: ChoiceOption<T>) => ReactNode
  customText?: string
  onCustomChange?: (text: string | undefined) => void
}
