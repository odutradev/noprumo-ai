import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

import styles from "./styles.module.css"

import type { NavbarSlotProps } from "./types"

const NavbarSlot = ({ navbarClassName, children }: NavbarSlotProps) => {
  const [target, setTarget] = useState<Element | null>(null)

  useEffect(() => {
    const navbar = document.querySelector(`.${navbarClassName}`)
    if (!navbar) return
    const sync = () => setTarget(navbar.querySelector("[data-slot=\"navbar-actions\"]"))
    const frame = requestAnimationFrame(sync)
    const observer = new MutationObserver(sync)
    observer.observe(navbar, { childList: true, subtree: true })
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [navbarClassName])

  if (!target) return null
  return createPortal(
    <div className={styles.slot} data-navbar-mobile="">
      {children}
    </div>,
    target
  )
}

export default NavbarSlot
