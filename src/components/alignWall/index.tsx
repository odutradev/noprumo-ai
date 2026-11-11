import { useEffect, useState } from "react"
import { SegmentedControl } from "enchase"

import { crookedNotes, wallModes, wallRows } from "@assets/data/landing"
import { symbolGeometry } from "@assets/data/brand"
import useInView from "@hooks/useInView"
import styles from "./styles.module.css"

const bob = symbolGeometry.regular.parts[2]

const AlignWall = () => {
  const { ref, isInView } = useInView<HTMLDivElement>(0.45)
  const [isAligned, setIsAligned] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    if (!isInView || hasInteracted) return
    const timer = window.setTimeout(() => setIsAligned(true), 1300)
    return () => window.clearTimeout(timer)
  }, [isInView, hasInteracted])

  const handleModeChange = (value: string) => {
    setHasInteracted(true)
    setIsAligned(value === "aligned")
  }

  return (
    <div ref={ref} className={styles.wall} data-aligned={isAligned || undefined} data-visible={isInView || undefined}>
      <div className={styles.toolbar}>
        <SegmentedControl ariaLabel="Comparar com e sem o guia" items={wallModes} value={isAligned ? "aligned" : "crooked"} onValueChange={(value: string) => handleModeChange(value)} size="sm" />
        <span className={styles.status}>{isAligned ? "Tudo no padrão do time" : "Cada sessão, um padrão diferente"}</span>
      </div>
      <div className={styles.stage}>
        <span className={styles.plumbLine} aria-hidden="true">
          <svg viewBox="16.5 27 15 18" className={styles.plumbBob}>
            <path d={bob.d} />
          </svg>
        </span>
        <ul className={styles.rows}>
          {wallRows.map((row, index) => (
            <li
              key={row.label}
              className={styles.row}
              style={{ transform: isAligned ? "none" : `translateX(${row.shift}px) rotate(${row.tilt}deg)`, transitionDelay: `${index * 70}ms` }}
            >
              <span className={styles.rowLabel}>{row.label}</span>
              <span className={styles.rowBar} style={{ inlineSize: `${row.width}%` }} />
            </li>
          ))}
        </ul>
        <ul className={styles.notes} aria-hidden={isAligned}>
          {crookedNotes.map((note, index) => (
            <li key={note} className={styles.note} style={{ transitionDelay: `${index * 60}ms` }}>
              {note}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default AlignWall
