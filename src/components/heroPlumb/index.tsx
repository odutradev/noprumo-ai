import { symbolGeometry } from "@assets/data/brand"
import usePendulum from "@hooks/usePendulum"
import styles from "./styles.module.css"

import type { HeroPlumbProps } from "./types"

const bob = symbolGeometry.regular.parts[2]

const HeroPlumb = ({ className, delay = 1100, initialAngle = 14 }: HeroPlumbProps) => {
  const pendulumRef = usePendulum<HTMLDivElement>({ initialAngle, delay })

  return (
    <div className={[styles.plumb, className].filter(Boolean).join(" ")} aria-hidden="true">
      <span className={styles.anchor} />
      <div ref={pendulumRef} className={styles.pendulum}>
        <span className={styles.line} />
        <svg viewBox="16.5 27 15 18" className={styles.bob}>
          <path d={bob.d} />
        </svg>
      </div>
    </div>
  )
}

export default HeroPlumb
