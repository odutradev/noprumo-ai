import { Button } from "enchase"

import useAction from "@hooks/useAction"

import type { ActionButtonProps } from "./types"

const ActionButton = ({ action, toastMessages, children, variant = "outline", size = "sm", ariaLabel }: ActionButtonProps) => {
  const handleClick = useAction({ action, toastMessages })

  return (
    <Button variant={variant} size={size} onClick={handleClick} aria-label={ariaLabel}>
      {children}
    </Button>
  )
}

export default ActionButton
