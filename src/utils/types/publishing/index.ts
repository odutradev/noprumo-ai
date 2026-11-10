import type { PublishAction } from "@utils/types/generator"

export interface PublishActionInfo {
  value: PublishAction
  flag: string
  label: string
  description: string
}

export interface PublishChoice {
  label: string
  description: string
  command?: string
}
