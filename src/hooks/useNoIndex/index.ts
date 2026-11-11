import { useEffect } from "react"

const useNoIndex = () => {
  useEffect(() => {
    const meta = document.createElement("meta")
    meta.name = "robots"
    meta.content = "noindex, nofollow"
    const current = document.head.querySelector("meta[name=\"robots\"]")
    const previous = current?.getAttribute("content") ?? null
    if (current) current.setAttribute("content", meta.content)
    if (!current) document.head.appendChild(meta)
    return () => {
      if (current && previous) current.setAttribute("content", previous)
      if (!current) meta.remove()
    }
  }, [])
}

export default useNoIndex
