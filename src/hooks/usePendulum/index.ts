import { useEffect, useRef } from "react"

import type { PendulumOptions } from "@utils/types/motion"

const stiffness = 0.012
const damping = 0.085
const restThreshold = 0.004
const maxAngle = 18
const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value))

const usePendulum = <T extends HTMLElement | SVGElement>({ initialAngle = 0, delay = 0, sensitivity = 1 }: PendulumOptions = {}) => {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const motion = { angle: 0, velocity: 0, scrollLean: 0, pointerLean: 0, frame: 0, lastScroll: window.scrollY, isReady: false }

    const step = () => {
      motion.scrollLean *= 0.94
      const target = clamp(motion.scrollLean + motion.pointerLean, maxAngle)
      motion.velocity += -stiffness * (motion.angle - target) - damping * motion.velocity
      motion.angle += motion.velocity
      element.style.transform = `rotate(${motion.angle.toFixed(3)}deg)`
      const isResting = Math.abs(motion.angle - target) < restThreshold && Math.abs(motion.velocity) < restThreshold && Math.abs(motion.scrollLean) < restThreshold
      motion.frame = isResting ? 0 : requestAnimationFrame(step)
    }

    const wake = () => {
      if (motion.isReady && !motion.frame) motion.frame = requestAnimationFrame(step)
    }

    const handlePointer = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect()
      const offset = (event.clientX - (rect.left + rect.width / 2)) / window.innerWidth
      motion.pointerLean = clamp(-offset * 10 * sensitivity, 6)
      wake()
    }

    const handleScroll = () => {
      const delta = window.scrollY - motion.lastScroll
      motion.lastScroll = window.scrollY
      motion.scrollLean = clamp(motion.scrollLean + delta * 0.06 * sensitivity, maxAngle)
      wake()
    }

    const start = window.setTimeout(() => {
      motion.isReady = true
      motion.angle = initialAngle
      wake()
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
