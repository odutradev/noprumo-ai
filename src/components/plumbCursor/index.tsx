import { useEffect, useRef, useState } from "react"

import { symbolGeometry } from "@assets/data/brand"
import styles from "./styles.module.css"

import type { CursorRipple } from "@utils/types/motion"

const bob = symbolGeometry.regular.parts[2]
const interactiveSelector = "a, button, [role='button'], [role='radio'], [role='tab'], label, summary"
const gravity = 0.045
const inertia = 0.02
const friction = 0.14

const PlumbCursor = () => {
  const rootRef = useRef<HTMLDivElement>(null)
  const pendulumRef = useRef<HTMLDivElement>(null)
  const [isEnabled, setIsEnabled] = useState(false)
  const [ripples, setRipples] = useState<CursorRipple[]>([])

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)")
    const sync = () => setIsEnabled(query.matches)
    sync()
    query.addEventListener("change", sync)
    return () => query.removeEventListener("change", sync)
  }, [])

  useEffect(() => {
    const root = rootRef.current
    const pendulum = pendulumRef.current
    if (!isEnabled || !root || !pendulum) return
    const isStill = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const html = document.documentElement
    html.dataset.plumbCursor = ""

    const motion = {
      x: -100,
      y: -100,
      lastX: Number.NaN,
      smoothVelocity: 0,
      lastVelocity: 0,
      angle: 0,
      spin: 0,
      stretch: 0,
      frame: 0,
      idle: 0
    }

    const step = () => {
      const velocity = Number.isNaN(motion.lastX) ? 0 : motion.x - motion.lastX
      motion.lastX = motion.x
      motion.smoothVelocity += (velocity - motion.smoothVelocity) * 0.2
      const acceleration = Math.max(-12, Math.min(12, motion.smoothVelocity - motion.lastVelocity))
      motion.lastVelocity = motion.smoothVelocity
      motion.spin += isStill ? 0 : -gravity * Math.sin(motion.angle) + inertia * acceleration * Math.cos(motion.angle) - friction * motion.spin
      motion.angle = Math.max(-1.3, Math.min(1.3, motion.angle + motion.spin))
      motion.stretch += (Math.min(Math.abs(motion.smoothVelocity) * 0.35, 12) - motion.stretch) * 0.15
      root.style.transform = `translate3d(${motion.x}px, ${motion.y}px, 0)`
      pendulum.style.transform = `rotate(${motion.angle.toFixed(4)}rad)`
      pendulum.style.setProperty("--stretch", `${motion.stretch.toFixed(2)}px`)
      const isResting = Math.abs(motion.spin) < 0.0005 && Math.abs(motion.angle) < 0.001 && Math.abs(motion.smoothVelocity) < 0.01 && motion.stretch < 0.05
      motion.idle = isResting ? motion.idle + 1 : 0
      motion.frame = motion.idle > 20 ? 0 : requestAnimationFrame(step)
    }

    const wake = () => {
      motion.idle = 0
      if (!motion.frame) motion.frame = requestAnimationFrame(step)
    }

    const handleMove = (event: PointerEvent) => {
      motion.x = event.clientX
      motion.y = event.clientY
      root.dataset.visible = ""
      const target = event.target instanceof Element ? event.target.closest(interactiveSelector) : null
      if (target) root.dataset.hover = ""
      if (!target) delete root.dataset.hover
      wake()
    }

    const handleDown = (event: PointerEvent) => {
      root.dataset.pressed = ""
      motion.spin += isStill ? 0 : (event.clientX % 2 ? 1 : -1) * 0.05
      setRipples((current) => [...current.slice(-3), { id: event.timeStamp, x: event.clientX, y: event.clientY }])
      wake()
    }

    const handleUp = () => delete root.dataset.pressed
    const handleLeave = () => delete root.dataset.visible

    window.addEventListener("pointermove", handleMove, { passive: true })
    window.addEventListener("pointerdown", handleDown, { passive: true })
    window.addEventListener("pointerup", handleUp, { passive: true })
    document.documentElement.addEventListener("pointerleave", handleLeave)

    return () => {
      cancelAnimationFrame(motion.frame)
      delete html.dataset.plumbCursor
      window.removeEventListener("pointermove", handleMove)
      window.removeEventListener("pointerdown", handleDown)
      window.removeEventListener("pointerup", handleUp)
      document.documentElement.removeEventListener("pointerleave", handleLeave)
    }
  }, [isEnabled])

  const handleRippleEnd = (id: number) => setRipples((current) => current.filter((ripple) => ripple.id !== id))

  if (!isEnabled) return null

  return (
    <div className={styles.layer} aria-hidden="true">
      {ripples.map((ripple) => (
        <span key={ripple.id} className={styles.ripple} style={{ transform: `translate3d(${ripple.x}px, ${ripple.y}px, 0)` }} onAnimationEnd={() => handleRippleEnd(ripple.id)}>
          <span className={styles.rippleRing} />
          <span className={styles.rippleLevel} />
        </span>
      ))}
      <div ref={rootRef} className={styles.cursor}>
        <span className={styles.ring} />
        <div ref={pendulumRef} className={styles.pendulum}>
          <span className={styles.line} />
          <svg viewBox="16.5 27 15 18" className={styles.bob}>
            <path d={bob.d} />
          </svg>
        </div>
        <span className={styles.anchor} />
      </div>
    </div>
  )
}

export default PlumbCursor
