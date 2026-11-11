import { useEffect, useRef } from "react"

import type { PendulumOptions } from "@utils/types/motion"

const stiffness = 0.018
const damping = 0.035
const restThreshold = 0.002

const usePendulum = <T extends HTMLElement | SVGElement>({ initialAngle = 0, delay = 0, sensitivity = 1 }: PendulumOptions = {}) => {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const motion = { angle: 0, velocity: 0, frame: 0, lastX: 0, lastScroll: window.scrollY, isReady: false }

    const render = () => {
      element.style.transform = `rotate(${motion.angle.toFixed(3)}deg)`
    }

    const step = () => {
      const acceleration = -stiffness * motion.angle - damping * motion.velocity
      motion.velocity += acceleration
      motion.angle += motion.velocity
      render()
      const isResting = Math.abs(motion.angle) < restThreshold && Math.abs(motion.velocity) < restThreshold
      motion.frame = isResting ? 0 : requestAnimationFrame(step)
    }

    const kick = (impulse: number) => {
      if (!motion.isReady) return
      motion.velocity = Math.max(-2.4, Math.min(2.4, motion.velocity + impulse * sensitivity))
      if (!motion.frame) motion.frame = requestAnimationFrame(step)
    }

    const handlePointer = (event: PointerEvent) => {
      const delta = motion.lastX ? event.clientX - motion.lastX : 0
      motion.lastX = event.clientX
      kick(-delta * 0.012)
    }

    const handleScroll = () => {
      const delta = window.scrollY - motion.lastScroll
      motion.lastScroll = window.scrollY
      kick(delta * 0.01)
    }

    const start = window.setTimeout(() => {
      motion.isReady = true
      motion.angle = initialAngle
      motion.frame = requestAnimationFrame(step)
    }, delay)

    window.addEventListener("pointermove", handlePointer, { passive: true })
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.clearTimeout(start)
      cancelAnimationFrame(motion.frame)
      window.removeEventListener("pointermove", handlePointer)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [initialAngle, delay, sensitivity])

  return ref
}

export default usePendulum
