import type { ActionToastMessages } from "@utils/types/action"
import type { ButtonProps } from "enchase"
import type { ReactNode } from "react"

export interface ActionButtonProps {
  action: () => Promise<unknown>
  toastMessages: ActionToastMessages
  onDone?: () => void
  children: ReactNode
  variant?: ButtonProps["variant"]
  size?: ButtonProps["size"]
  ariaLabel?: string
}
