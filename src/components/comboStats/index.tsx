import { useState } from "react"

import useScrollProgress from "@hooks/useScrollProgress"
import { comboStats } from "@assets/data/landing"
import styles from "./styles.module.css"

import type { CSSProperties } from "react"

const total = comboStats.reduce((sum, stat) => sum + stat.value, 0)
const largest = Math.max(...comboStats.map((stat) => stat.value))
const easeOut = (value: number) => 1 - (1 - value) ** 3
const format = (value: number) => Math.round(value).toLocaleString("pt-BR")

const ComboStats = () => {
  const [progress, setProgress] = useState(0)
  const ref = useScrollProgress<HTMLDivElement>({
    anchor: 0.95,
    onProgress: setProgress
  })
  const fill = easeOut(Math.min(1, progress * 1.5))

  return (
    <div ref={ref} className={styles.stats} style={{ "--fill": fill } as CSSProperties}>
      <div className={styles.total}>
        <span className={styles.totalValue}>{format(total * fill)}</span>
        <span className={styles.totalLabel}>combinações de stack geradas e conferidas</span>
      </div>
      <ul className={styles.list}>
        {comboStats.map((stat) => (
          <li key={stat.label} className={styles.item}>
            <div className={styles.itemHead}>
              <span className={styles.itemLabel}>{stat.label}</span>
              <span className={styles.itemValue}>{format(stat.value * fill)}</span>
            </div>
            <span className={styles.bar} aria-hidden="true">
              <span
                className={styles.barFill}
                style={
                  {
                    "--share": Math.max(stat.value / largest, 0.03)
                  } as CSSProperties
                }
              />
            </span>
            <span className={styles.itemDescription}>{stat.description}</span>
          </li>
        ))}
        <li className={styles.item}>
          <div className={styles.itemHead}>
            <span className={styles.itemLabel}>Falhas</span>
            <span className={styles.itemValue} data-success="">
              0
            </span>
          </div>
          <span className={styles.itemDescription}>JavaScript passa no parser e Go na checagem de estrutura, em todas</span>
        </li>
      </ul>
    </div>
  )
}

export default ComboStats
