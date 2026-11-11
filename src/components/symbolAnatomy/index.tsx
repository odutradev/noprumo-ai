import { Switch } from "enchase"
import { useState } from "react"

import { anatomyGuides, anatomyNotes, symbolBox, symbolGeometry, themedColors } from "@assets/data/brand"
import styles from "./styles.module.css"

const SymbolAnatomy = () => {
  const [isShowingGuides, setIsShowingGuides] = useState(true)
  const { parts } = symbolGeometry.regular

  return (
    <div className={styles.anatomy}>
      <div className={styles.canvas}>
        <svg viewBox={`0 0 ${symbolBox} ${symbolBox}`} className={styles.svg} role="img" aria-label="Símbolo do noprumo com as guias de construção">
          {isShowingGuides && (
            <g className={styles.guides}>
              {Array.from({ length: 13 }, (_, index) => (
                <path key={`grid-${index}`} d={`M${index * 4} 0V48M0 ${index * 4}H48`} className={styles.grid} />
              ))}
              {anatomyGuides.map((d) => (
                <path key={d} d={d} className={styles.guide} />
              ))}
            </g>
          )}
          {parts.map((part) =>
            part.strokeWidth ? (
              <path key={part.d} d={part.d} strokeWidth={part.strokeWidth} strokeLinecap="round" style={{ fill: "none", stroke: themedColors[part.role] }} />
            ) : (
              <path key={part.d} d={part.d} style={{ fill: themedColors[part.role] }} />
            )
          )}
        </svg>
        <div className={styles.toggle}>
          <Switch label="Mostrar guias e grid 48 × 48" checked={isShowingGuides} onChange={(event) => setIsShowingGuides(event.target.checked)} />
        </div>
      </div>
      <ol className={styles.notes}>
        {anatomyNotes.map((note, index) => (
          <li key={note.title} className={styles.note}>
            <span className={styles.noteIndex}>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <strong className={styles.noteTitle}>{note.title}</strong>
              <span className={styles.noteMeasure}>{note.measure}</span>
              <p className={styles.noteText}>{note.description}</p>
            </div>
          </li>
        ))}
        <li className={styles.rule}>
          <strong>Regra de ouro:</strong> o fio é sempre vertical e o peso sempre aponta para baixo. Nunca gire, espelhe ou deite o símbolo.
        </li>
      </ol>
    </div>
  )
}

export default SymbolAnatomy
