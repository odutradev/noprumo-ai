import { useEffect, useRef } from "react"

import type { ScrollProgressOptions } from "@utils/types/motion"

const measure = (rect: DOMRect, anchor: number, isPinned: boolean) => {
  const viewport = window.innerHeight
  if (isPinned) return (viewport * anchor - rect.top) / Math.max(rect.height - viewport * (1 - anchor), 1)
  return (viewport * anchor - rect.top) / Math.max(rect.height, 1)
}

const useScrollProgress = <T extends HTMLElement>({ anchor = 0.6, isPinned = false, smoothing = 1, onProgress }: ScrollProgressOptions = {}) => {
  const ref = useRef<T>(null)
  const callbackRef = useRef(onProgress)

  useEffect(() => {
    callbackRef.current = onProgress
  })

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const isStill = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const ease = isStill ? 1 : smoothing
    const target = () => Math.min(1, Math.max(0, measure(element.getBoundingClientRect(), anchor, isPinned)))
    const state = { frame: 0, current: target() }

    const update = () => {
      const goal = target()
      const gap = goal - state.current
      state.current = Math.abs(gap) < 0.0005 ? goal : state.current + gap * ease
      element.style.setProperty("--progress", state.current.toFixed(4))
      callbackRef.current?.(state.current)
      state.frame = state.current === goal ? 0 : requestAnimationFrame(update)
    }

    const schedule = () => {
      if (!state.frame) state.frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)

    return () => {
      cancelAnimationFrame(state.frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [anchor, isPinned, smoothing])

  return ref
}

export default useScrollProgress
