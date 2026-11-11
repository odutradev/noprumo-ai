import { useEffect, useRef } from "react"

import type { ScrollProgressOptions } from "@utils/types/motion"

const measure = (rect: DOMRect, anchor: number, isPinned: boolean) => {
  const viewport = window.innerHeight
  if (isPinned) return (viewport * anchor - rect.top) / Math.max(rect.height - viewport * (1 - anchor), 1)
  return (viewport * anchor - rect.top) / Math.max(rect.height, 1)
}

const useScrollProgress = <T extends HTMLElement>({ anchor = 0.6, isPinned = false, onProgress }: ScrollProgressOptions = {}) => {
  const ref = useRef<T>(null)
  const callbackRef = useRef(onProgress)

  useEffect(() => {
    callbackRef.current = onProgress
  })

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const state = { frame: 0 }

    const update = () => {
      state.frame = 0
      const progress = Math.min(1, Math.max(0, measure(element.getBoundingClientRect(), anchor, isPinned)))
      element.style.setProperty("--progress", progress.toFixed(4))
      callbackRef.current?.(progress)
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
  }, [anchor, isPinned])

  return ref
}

export default useScrollProgress
