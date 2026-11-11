import useInView from "@hooks/useInView"
import styles from "./styles.module.css"

import type { RevealProps } from "./types"

const Reveal = ({ children, className, delay = 0 }: RevealProps) => {
  const { ref, isInView } = useInView<HTMLDivElement>(0.2)

  return (
    <div ref={ref} className={[styles.reveal, className].filter(Boolean).join(" ")} data-visible={isInView || undefined} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

export default Reveal
