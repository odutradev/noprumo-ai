import useScrollProgress from "@hooks/useScrollProgress"
import { landingSteps } from "@assets/data/landing"
import { symbolGeometry } from "@assets/data/brand"
import styles from "./styles.module.css"

const bob = symbolGeometry.regular.parts[2]

const StepTimeline = () => {
  const ref = useScrollProgress<HTMLDivElement>()

  return (
    <div ref={ref} className={styles.timeline}>
      <span className={styles.track} aria-hidden="true">
        <span className={styles.fill} />
        <svg viewBox="16.5 27 15 18" className={styles.bob}>
          <path d={bob.d} />
        </svg>
      </span>
      <ol className={styles.list}>
        {landingSteps.map((step, index) => (
          <li key={step.title} className={styles.step}>
            <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>
            <h3 className={styles.title}>{step.title}</h3>
            <p className={styles.description}>{step.description}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default StepTimeline
