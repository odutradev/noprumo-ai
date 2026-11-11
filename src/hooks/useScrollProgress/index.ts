import { useEffect, useRef } from "react"

const useScrollProgress = <T extends HTMLElement>() => {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const state = { frame: 0 }

    const update = () => {
      state.frame = 0
      const rect = element.getBoundingClientRect()
      const anchor = window.innerHeight * 0.6
      const progress = Math.min(1, Math.max(0, (anchor - rect.top) / Math.max(rect.height, 1)))
      element.style.setProperty("--progress", progress.toFixed(4))
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
  }, [])

  return ref
}

export default useScrollProgress
