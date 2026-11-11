import { stackRows } from "@assets/data/landing"
import styles from "./styles.module.css"

const StackMarquee = () => (
  <div className={styles.marquee} role="img" aria-label={`Stacks suportadas: ${stackRows.flat().join(", ")}`}>
    {stackRows.map((row, rowIndex) => (
      <div key={row[0]} className={styles.row} data-reverse={rowIndex % 2 === 1 || undefined}>
        <div className={styles.track} aria-hidden="true">
          {[...row, ...row].map((item, index) => (
            <span key={`${item}-${index}`} className={styles.item}>
              <span className={styles.dot} />
              {item}
            </span>
          ))}
        </div>
      </div>
    ))}
  </div>
)

export default StackMarquee
