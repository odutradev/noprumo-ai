import { Button } from "enchase"
import { useState } from "react"

import { crookedDigits } from "@assets/data/notFound"
import { symbolGeometry } from "@assets/data/brand"
import usePendulum from "@hooks/usePendulum"
import styles from "./styles.module.css"

import type { OffPlumbCodeProps } from "./types"
import type { CSSProperties } from "react"

const bob = symbolGeometry.regular.parts[2]

const OffPlumbCode = ({ className }: OffPlumbCodeProps) => {
  const [isAligned, setIsAligned] = useState(false)
  const pendulumRef = usePendulum<HTMLDivElement>({ initialAngle: 12, delay: 1000, sensitivity: 1.4 })

  const handleToggle = () => setIsAligned((current) => !current)

  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")} data-aligned={isAligned || undefined}>
      <div className={styles.stage} aria-hidden="true">
        <span className={styles.anchor} />
        <div ref={pendulumRef} className={styles.pendulum}>
          <span className={styles.line} />
          <svg viewBox="16.5 27 15 18" className={styles.bob}>
            <path d={bob.d} />
          </svg>
        </div>
        <div className={styles.digits}>
          {crookedDigits.map((digit, index) => (
            <span key={digit.id} className={styles.digit} data-light={digit.isLight || undefined} style={{ "--i": index, "--tilt": digit.tilt, "--shift": digit.shift } as CSSProperties}>
              <span className={styles.digitInner}>{digit.char}</span>
            </span>
          ))}
        </div>
        <span className={styles.baseline} />
      </div>
      <div className={styles.toolbar}>
        <span className={styles.status} role="status">
          <span className={styles.dot} />
          {isAligned ? "404 no prumo, mas a página continua sumida" : "Erro 404: fora do prumo"}
        </span>
        <Button size="sm" variant="outline" onClick={handleToggle}>
          {isAligned ? "Entortar de novo" : "Colocar no prumo"}
        </Button>
      </div>
    </div>
  )
}

export default OffPlumbCode
