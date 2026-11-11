import { SegmentedControl } from "enchase"
import { useState } from "react"

import { alignedThreshold, crookedNotes, wallAnchor, wallModes, wallRows, wallTargets } from "@assets/data/landing"
import useScrollProgress from "@hooks/useScrollProgress"
import { symbolGeometry } from "@assets/data/brand"
import styles from "./styles.module.css"

import type { AlignWallProps } from "./types"
import type { CSSProperties } from "react"

const bob = symbolGeometry.regular.parts[2]

const AlignWall = ({ children }: AlignWallProps) => {
  const [isAligned, setIsAligned] = useState(false)
  const ref = useScrollProgress<HTMLDivElement>({
    anchor: wallAnchor,
    isPinned: true,
    smoothing: 0.22,
    onProgress: (progress) => setIsAligned(progress >= alignedThreshold)
  })

  const handleModeChange = (value: string) => {
    const element = ref.current
    if (!element) return
    const rect = element.getBoundingClientRect()
    const viewport = window.innerHeight
    const target = value === "aligned" ? wallTargets.aligned : wallTargets.crooked
    const desiredTop = viewport * wallAnchor - target * (rect.height - viewport * (1 - wallAnchor))
    window.scrollTo({
      top: window.scrollY + rect.top - desiredTop,
      behavior: "smooth"
    })
  }

  return (
    <div ref={ref} className={styles.track} data-aligned={isAligned || undefined}>
      <div className={styles.wall}>
        {children}
        <div className={styles.toolbar}>
          <SegmentedControl ariaLabel="Comparar com e sem o guia" items={wallModes} value={isAligned ? "aligned" : "crooked"} onValueChange={(value: string) => handleModeChange(value)} size="sm" />
          <span className={styles.status}>{isAligned ? "Tudo no seu padrão" : "Cada sessão, um padrão diferente"}</span>
          <span className={styles.hint} aria-hidden="true">
            Role para alinhar
          </span>
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
                style={
                  {
                    "--i": index,
                    "--tilt": row.tilt,
                    "--shift": row.shift
                  } as CSSProperties
                }
              >
                <span className={styles.rowLabel}>{row.label}</span>
                <span className={styles.rowBar} style={{ inlineSize: `${row.width}%` }} />
              </li>
            ))}
          </ul>
          <ul className={styles.notes} aria-hidden={isAligned}>
            {crookedNotes.map((note, index) => (
              <li key={note} className={styles.note} style={{ "--i": index } as CSSProperties}>
                {note}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AlignWall
